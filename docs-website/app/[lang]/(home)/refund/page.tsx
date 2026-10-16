import type { Metadata } from 'next/types';
import { PolicyPage, policyMetadata } from '../components/policy-page';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return policyMetadata('refund', lang);
}

export default async function RefundPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <PolicyPage kind="refund" lang={lang} />;
}
