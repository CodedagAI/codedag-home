import type { Metadata } from 'next';
import { type ComponentProps, type FC, type ReactNode } from 'react';
import * as Twoslash from 'fumadocs-twoslash/ui';
import { Callout } from 'fumadocs-ui/components/callout';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import * as Preview from '@/components/preview';
import { createMetadata, getPageImage, generateAlternates } from '@/lib/metadata';
import { removeLanguagePrefix } from '@/lib/url';
import { source } from '@/lib/source';
import { Wrapper } from '@/components/preview/wrapper';
import { Mermaid } from '@/components/mdx/mermaid';
import { DocsFooter } from '@/components/docs-footer';
import { DocsBetaNotice } from '@/components/docs-beta-notice';
import { owner, repo } from '@/lib/github';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import Link from 'fumadocs-core/link';
import { getPageTreePeers, findNeighbour } from 'fumadocs-core/page-tree';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { getMDXComponents } from '@/mdx-components';
import { CopyPageButton, EditOnGitHub, OpenInAI } from '@/components/ai/page-actions';
import { Banner } from 'fumadocs-ui/components/banner';
import {
  DocsBody,
  DocsPage,
  PageLastUpdate,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { PathUtils } from 'fumadocs-core/source';
import type { TOCItemType } from 'fumadocs-core/toc';

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

export const revalidate = false;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { slug = [], lang } = await params;
  const page = source.getPage(slug, lang);

  // 交给 docs/not-found.tsx：响应状态是 404，页面仍在文档布局里
  if (!page) notFound();

  // Check for OpenAPI page type (if fumadocs-openapi is configured)
  const pageData = page.data as {
    type?: string;
    getAPIPageProps?: () => unknown;
  } & typeof page.data;

  if (pageData.type === 'openapi' && pageData.getAPIPageProps) {
    const { APIPage } = await import('@/components/api-page');
    const apiPageProps = pageData.getAPIPageProps() as Parameters<typeof APIPage>[0];
    return (
      <DocsPage full>
        <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>

        <DocsBody>
          <APIPage {...apiPageProps} />
        </DocsBody>
      </DocsPage>
    );
  }

  // After OpenAPI check, page.data is guaranteed to have load() method
  const docData = page.data as typeof page.data & {
    load: () => Promise<{ body: FC; toc: TOCItemType[]; lastModified?: Date }>;
    preview?: string;
    index?: boolean;
  };

  const { body: Mdx, toc, lastModified } = await docData.load();

  // Get neighbour pages for navigation
  const { previous, next } = findNeighbour(source.getPageTree(lang), page.url);

  return (
    <DocsPage
      toc={toc}
      tableOfContent={{
        style: "clerk",
      }}
      footer={{
        component: (
          <DocsFooter
            previous={previous ? { name: previous.name, url: previous.url } : undefined}
            next={next ? { name: next.name, url: next.url } : undefined}
            lang={lang}
            page={{ title: page.data.title ?? page.url, url: page.url }}
          />
        ),
      }}
    >
      <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
      <p className="text-lg text-fd-muted-foreground mb-2">
        {page.data.description}
      </p>
      <DocsBetaNotice lang={lang} />
      <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
        <CopyPageButton markdownUrl={`${page.url}.mdx`} />
        <OpenInAI markdownUrl={`${page.url}.mdx`} />
        <EditOnGitHub
          githubUrl={`https://github.com/${owner}/${repo}/blob/main/docs-website/content/docs/${page.path}`}
        />
      </div>
      <div className="prose flex-1 text-fd-foreground/90">
        {docData.preview && <PreviewRenderer preview={docData.preview} />}
        <Mdx
          components={getMDXComponents({
            ...Twoslash,
            a: ({ href, ...props }) => {
              const found = source.getPageByHref(href ?? "", {
                dir: PathUtils.dirname(page.path),
                language: lang,
              });

              if (!found) return <Link href={href} {...props} />;

              return (
                <HoverCard>
                  <HoverCardTrigger
                    href={
                      found.hash
                        ? `${found.page.url}#${found.hash}`
                        : found.page.url
                    }
                    {...props}
                  >
                    {props.children}
                  </HoverCardTrigger>
                  <HoverCardContent className="text-sm">
                    <p className="font-medium">{found.page.data.title}</p>
                    <p className="text-fd-muted-foreground">
                      {found.page.data.description}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              );
            },
            Banner,
            Mermaid,
            TypeTable,
            Wrapper,
            blockquote: Callout as unknown as FC<ComponentProps<"blockquote">>,
            DocsCategory: ({ url }) => {
              return <DocsCategory url={url ?? page.url} lang={lang} />;
            },
          })}
        />
        {docData.index ? <DocsCategory url={page.url} lang={lang} /> : null}
      </div>
      {lastModified && (
        <>
          <hr className="border-fd-border" />
          <PageLastUpdate date={lastModified} />
        </>
      )}
    </DocsPage>
  );
}

function DocsCategory({ url, lang }: { url: string; lang: string }) {
  return (
    <Cards>
      {getPageTreePeers(source.getPageTree(lang), url).map((peer) => (
        <Card key={peer.url} title={peer.name} href={peer.url}>
          {peer.description}
        </Card>
      ))}
    </Cards>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [], lang } = await params;
  const page = source.getPage(slug, lang);
  if (!page)
    return createMetadata({
      title: 'Not Found',
    });

  const description =
    page.data.description ?? 'Task orchestration engine for Coding Agents';

  const image = {
    url: getPageImage(page).url,
    width: 1200,
    height: 630,
  };

  // Remove language prefix from URL for hreflang alternates
  const pathWithoutLang = removeLanguagePrefix(page.url);
  // 规范地址和分享地址都指向本语言的这一页，中文、日文页不指向英文页
  const alternates = generateAlternates(pathWithoutLang, lang);

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: alternates.canonical,
      images: [image],
    },
    twitter: {
      images: [image],
    },
    alternates,
  });
}

export function generateStaticParams() {
  return source.generateParams('slug', 'lang');
}
