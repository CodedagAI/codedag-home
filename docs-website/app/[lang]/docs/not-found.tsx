import { headers } from 'next/headers';
import { DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { NotFound } from '@/components/not-found';
import { i18n } from '@/lib/i18n';

/**
 * 文档区里找不到页面时的 404：留在文档布局里，侧边栏还在。
 * 文档页调用 notFound() 落到这里，响应状态是 404，Next.js 会给页面加上 noindex。
 */
export default async function DocsNotFound() {
  const headersList = await headers();

  // 从 proxy.ts 设置的 x-locale 头获取语言
  const locale = headersList.get('x-locale') || i18n.defaultLanguage;

  return (
    <DocsPage>
      <NotFound locale={locale} />
    </DocsPage>
  );
}
