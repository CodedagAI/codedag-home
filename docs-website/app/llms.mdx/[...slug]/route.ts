import { type NextRequest, NextResponse } from 'next/server';
import { getLLMText } from '@/lib/get-llm-text';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const revalidate = false;

type Language = (typeof i18n.languages)[number];
const languages = new Set<Language>(i18n.languages);

function isLanguage(value: string): value is Language {
  return languages.has(value as Language);
}

export async function GET(
  _req: NextRequest,
  { params }: RouteContext<'/llms.mdx/[...slug]'>,
) {
  const slug = (await params).slug;

  // Check if first segment is a language code
  let language: Language | undefined;
  let pageSlug = slug;

  if (slug.length > 0 && isLanguage(slug[0])) {
    language = slug[0];
    pageSlug = slug.slice(1);
  }

  const page = source.getPage(pageSlug, language);
  if (!page) notFound();

  return new NextResponse(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
