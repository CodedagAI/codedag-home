import {
  type FileObject,
  printErrors,
  scanURLs,
  validateFiles,
} from 'next-validate-link';
import { InferPageType } from 'fumadocs-core/source';
import { blog, source } from '@/lib/source';
import { i18n } from '@/lib/i18n';

type AnySource = typeof blog | typeof source;

const languages = i18n.languages;
const allLanguages = languages.map((lang) => ({ value: { lang } }));

/**
 * 路由目录里的地址都以 [lang] 开头；公开地址里默认语言不带前缀（/docs/...），
 * 其他语言带前缀（/zh/docs/...），与 proxy.ts 的规则一致。
 */
function toPublicUrl(url: string): string {
  const prefix = `/${i18n.defaultLanguage}`;
  if (url === prefix) return '/';
  if (url.startsWith(`${prefix}/`)) return url.slice(prefix.length);
  return url;
}

async function checkLinks() {
  const blogPages = blog.getPages();
  const docsPages = source.getPages();

  const scanned = await scanURLs({
    // 键是 app/ 下的路由目录；没有登记的动态段会退化成匹配任意值的正则，不再校验锚点
    populate: {
      '[lang]': allLanguages,
      // 兜底路由只渲染 404 页，不是有效目标
      '[lang]/(home)/[...slug]': [],
      // 没有文章时博客列表页返回 404
      '[lang]/(home)/blog': blogPages.length > 0 ? allLanguages : [],
      '[lang]/(home)/blog/[slug]': await Promise.all(
        blogPages.map(async (page) => ({
          value: {
            lang: page.locale ?? i18n.defaultLanguage,
            slug: page.slugs[0],
          },
          hashes: await getHeadings(page),
        })),
      ),
      '[lang]/docs/[...slug]': await Promise.all(
        docsPages.map(async (page) => ({
          value: {
            lang: page.locale ?? i18n.defaultLanguage,
            slug: page.slugs,
          },
          hashes: await getHeadings(page),
        })),
      ),
    },
  });

  if (scanned.fallbackUrls.length > 0) {
    throw new Error(
      `Routes with unpopulated params would match any URL and skip anchor checks: ${scanned.fallbackUrls
        .map((entry) => entry.url.source)
        .join(', ')}. Add them to \`populate\` in scripts/lint.ts.`,
    );
  }

  scanned.urls = new Map(
    [...scanned.urls].map(([url, meta]) => [toPublicUrl(url), meta]),
  );

  // 地址映射必须与 fumadocs 生成的页面地址一致，且三种语言的文档页都被收集到
  const missing = docsPages
    .map((page) => page.url)
    .filter((url) => !scanned.urls.has(url));
  if (missing.length > 0) {
    throw new Error(
      `Docs page URLs missing from the scanned routes: ${missing.slice(0, 10).join(', ')}`,
    );
  }

  const docsCounts = languages.map((lang) => {
    const prefix = `${lang === i18n.defaultLanguage ? '' : `/${lang}`}/docs/`;
    const count = [...scanned.urls.keys()].filter((url) =>
      url.startsWith(prefix),
    ).length;
    return { lang, count };
  });
  console.log(
    `collected ${scanned.urls.size} URLs (docs pages: ${docsCounts
      .map(({ lang, count }) => `${lang} ${count}`)
      .join(', ')}), ${scanned.fallbackUrls.length} fallbacks`,
  );
  const uncovered = docsCounts.filter(({ count }) => count === 0);
  if (uncovered.length > 0) {
    throw new Error(
      `No docs pages collected for: ${uncovered.map(({ lang }) => lang).join(', ')}`,
    );
  }

  printErrors(
    await validateFiles(
      [...(await getFiles(source)), ...(await getFiles(blog))],
      {
        scanned,
        markdown: {
          components: {
            Card: { attributes: ['href'] },
          },
        },
        checkRelativePaths: 'as-url',
      },
    ),
    true,
  );
}

async function getHeadings({
  data,
}: InferPageType<AnySource>): Promise<string[]> {
  if ('type' in data && data.type === 'openapi') return [];
  const { _exports, toc } = await data.load();
  const headings = toc.map((item) => item.url.slice(1));
  const elementIds = _exports?.elementIds;
  if (Array.isArray(elementIds)) {
    headings.push(...elementIds);
  }

  return headings;
}

async function getFiles(source: AnySource) {
  const files: FileObject[] = [];
  for (const page of source.getPages()) {
    if ('type' in page.data && page.data.type === 'openapi') continue;

    files.push({
      data: page.data,
      url: page.url,
      path: page.data.info.fullPath,
      content: await page.data.getText('raw'),
    });
  }

  return files;
}

// 脚本自身出错也要让 `pnpm lint` 失败，不能当作检查通过
await checkLinks().catch((e) => {
  console.error('Failed to run link check', e);
  process.exit(1);
});
