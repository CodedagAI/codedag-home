import type { Metadata } from 'next/types';
import { JapanDisclosurePage, japanDisclosureMetadata } from '../components/policy-page';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return japanDisclosureMetadata(lang);
}

export default async function TokushohoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <JapanDisclosurePage lang={lang} />;
}
