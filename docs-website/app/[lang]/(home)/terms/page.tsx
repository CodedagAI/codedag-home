import type { Metadata } from 'next/types';
import { PolicyPage, policyMetadata } from '../components/policy-page';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return policyMetadata('terms', lang);
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <PolicyPage kind="terms" lang={lang} />;
}
