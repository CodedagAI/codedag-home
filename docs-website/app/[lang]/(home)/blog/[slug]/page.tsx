export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { blog } from '@/lib/source';
import { createMetadata, generateAlternates } from '@/lib/metadata';
import { getMDXComponents } from '@/mdx-components';
import { getBlogTranslations, translateCategory, formatBlogDate } from '@/lib/blog-translations';
import { getHomepageTranslations } from '@/lib/homepage-translations';
import { Closing } from '../../components/closing';
import { ShareButton } from './page.client';
import { cn } from '@/lib/cn';

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const t = getBlogTranslations(lang);
  const page = blog.getPage([slug], lang);

  if (!page) notFound();
  const { body: Mdx, toc } = await page.data.load();

  const allPosts = [...blog.getPages(lang)].sort(
    (a, b) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
  const currentIndex = allPosts.findIndex((p) => p.slugs[0] === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const rawCategory = (page.data as unknown as Record<string, unknown>).category as string | undefined;
  const category = rawCategory ? translateCategory(lang, rawCategory) : undefined;
  // Estimate reading time: ~3 min base + 1 min per 2 TOC entries
  const readingTime = Math.max(2, 3 + Math.floor(toc.length / 2));

  return (
    <main className="min-h-screen bg-white antialiased dark:bg-[#0A0A0A]">
      {/* Hero header */}
      <section className="relative px-6 pb-8 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-[radial-gradient(ellipse,hsl(260,100%,65%,0.06),transparent_70%)] opacity-50 dark:opacity-100" />
        </div>

        <div className="relative z-10 mx-auto max-w-[800px]">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500">
            <Link
              href={`${lang === 'en' ? '' : `/${lang}`}/blog`}
              className="transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              {t.hero.title}
            </Link>
            {category && (
              <>
                <ChevronRight className="size-3.5" />
                <span className="text-neutral-500 dark:text-neutral-400">
                  {category}
                </span>
              </>
            )}
          </nav>

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            {page.data.title}
          </h1>

          {/* Description */}
          {page.data.description && (
            <p className="mb-6 max-w-xl text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
              {page.data.description}
            </p>
          )}

          {/* Author + Date + Category */}
          <div className="flex flex-wrap items-center gap-3 border-b border-neutral-200 pb-6 dark:border-white/8">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-400 dark:text-neutral-500">
                {t.detail.writtenBy}
              </span>
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                {page.data.author}
              </span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <time
              dateTime={String(page.data.date)}
              className="text-sm text-neutral-400 dark:text-neutral-500"
            >
              {formatBlogDate(lang, String(page.data.date), 'long')}
            </time>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <span className="text-sm text-neutral-400 dark:text-neutral-500">
              {readingTime} {t.detail.minRead}
            </span>
            {category && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-white/6 dark:text-neutral-400">
                  {category}
                </span>
              </>
            )}
            <div className="ml-auto">
              <ShareButton url={page.url} />
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="mx-auto max-w-[800px] px-6 pb-16">
        {toc.length > 0 && (
          <div className="mb-8">
            <InlineTOC items={toc} />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-home-accent prose-a:underline-offset-2 prose-code:rounded prose-code:bg-neutral-100 dark:prose-code:bg-white/6 prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-white/8">
          <Mdx components={getMDXComponents()} />
        </div>
      </article>

      {/* Previous / Next navigation */}
      {(prevPost || nextPost) && (
        <nav className="mx-auto max-w-[800px] border-t border-neutral-200 px-6 py-8 dark:border-white/8">
          <div className="grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={prevPost.url}
                className={cn(
                  'group flex flex-col rounded-xl border p-4 transition-all',
                  'border-neutral-200 hover:border-neutral-300 dark:border-white/8 dark:hover:border-white/16',
                )}
              >
                <span className="mb-1 flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                  <ChevronLeft className="size-3" />
                  {t.detail.previousPost}
                </span>
                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">
                  {prevPost.data.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={nextPost.url}
                className={cn(
                  'group flex flex-col items-end rounded-xl border p-4 text-right transition-all',
                  'border-neutral-200 hover:border-neutral-300 dark:border-white/8 dark:hover:border-white/16',
                )}
              >
                <span className="mb-1 flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                  {t.detail.nextPost}
                  <ChevronRight className="size-3" />
                </span>
                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">
                  {nextPost.data.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      )}

      {/* Back to Blog */}
      <div className="mx-auto max-w-[800px] px-6 pb-8">
        <Link
          href={`${lang === 'en' ? '' : `/${lang}`}/blog`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-home-accent transition-colors hover:text-home-ink"
        >
          <ChevronLeft className="size-3.5" />
          {t.detail.backToBlog}
        </Link>
      </div>

      {/* CTA Section */}
      <Closing
        t={getHomepageTranslations(lang)}
        lang={lang}
        docsPrefix={lang === 'en' ? '' : `/${lang}`}
      />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = blog.getPage([slug], lang);

  if (!page) notFound();

  return createMetadata({
    title: page.data.title,
    description:
      page.data.description ?? 'Insights on AI workflows and developer tools',
    alternates: generateAlternates(`/blog/${slug}`),
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
