import type { Metadata } from 'next/types';
import { createMetadata, generateAlternates, shareImage } from '@/lib/metadata';
import { getHomepageTranslations } from '@/lib/homepage-translations';
import { i18n } from '@/lib/i18n';
import { Burden } from './components/burden';
import { Capabilities } from './components/capabilities';
import { Closing } from './components/closing';
import { Fit } from './components/fit';
import { Hero } from './components/hero';
import { Local } from './components/local';
import { Price } from './components/price';
import { StructuredData } from './components/structured-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = getHomepageTranslations(lang);
  const alternates = generateAlternates('/', lang);
  // 标题本身已含品牌名，不再套用 “%s | CodeDAG” 模板
  const title = { absolute: meta.title };
  const images = shareImage(lang);

  return createMetadata({
    title,
    description: meta.description,
    alternates,
    openGraph: { title, description: meta.description, url: alternates.canonical, images },
    twitter: { title, description: meta.description, images },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getHomepageTranslations(lang);
  const docsPrefix = lang === i18n.defaultLanguage ? '' : `/${lang}`;

  // 顺序跟着访客的问题走：这是什么 → 没有它的时候是什么样 → 凭什么能自己跑、敢不敢放手 →
  // 哪些活能交给它 → 我的代码去了哪 → 多少钱 → 下一步。
  return (
    <main className="overflow-x-clip bg-fd-background text-home-ink antialiased">
      <StructuredData lang={lang} />
      <Hero t={t} lang={lang} docsPrefix={docsPrefix} />
      <Burden t={t} />
      <Capabilities t={t} docsPrefix={docsPrefix} />
      <Fit t={t} docsPrefix={docsPrefix} />
      <Local t={t} docsPrefix={docsPrefix} />
      <Price t={t} docsPrefix={docsPrefix} />
      <Closing t={t} lang={lang} docsPrefix={docsPrefix} />
    </main>
  );
}
