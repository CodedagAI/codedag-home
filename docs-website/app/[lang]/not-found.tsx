import { headers } from 'next/headers';
import { NotFound } from '@/components/not-found';
import { i18n } from '@/lib/i18n';

export default async function LangNotFound() {
  const headersList = await headers();

  // 从 proxy.ts 设置的 x-locale 头获取语言
  const locale = headersList.get('x-locale') || i18n.defaultLanguage;

  return <NotFound locale={locale} />;
}
