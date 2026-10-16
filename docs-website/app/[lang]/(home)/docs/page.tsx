import { redirect } from 'next/navigation';
import { getRelativeUrl } from '@/lib/url';

/**
 * /docs 没有自己的页面：跳到当前语言的概览页
 * （/docs/introduction/overview、/zh/docs/introduction/overview、/ja/docs/introduction/overview）。
 */
export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(getRelativeUrl('/docs/introduction/overview', lang));
}
