import { notFound } from 'next/navigation';
import { blog } from '@/lib/source';
import { createMetadata, generateAlternates } from '@/lib/metadata';
import { getBlogTranslations, translateCategory, formatBlogDate } from '@/lib/blog-translations';
import { getHomepageTranslations } from '@/lib/homepage-translations';
import { Closing } from '../components/closing';
import {
  BlogListClient,
  type BlogPostData,
} from '@/components/blog/blog-list-client';

export const metadata = createMetadata({
  title: 'Blog',
  description: 'Insights on AI workflows, developer tools, and building the future of code.',
  alternates: generateAlternates('/blog'),
});

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getBlogTranslations(lang);
  const pages = blog.getPages(lang);

  // 还没有文章时博客不上线：列表页返回 404
  if (pages.length === 0) notFound();

  const posts: BlogPostData[] = [...pages]
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    )
    .map((post) => {
      const rawCategory = ((post.data as unknown as Record<string, unknown>).category as string) ?? 'Announcements';
      const dateStr = String(post.data.date);
      return {
        title: post.data.title,
        description: post.data.description,
        author: post.data.author,
        date: dateStr,
        dateLabel: formatBlogDate(lang, dateStr, 'short'),
        dateLabelLong: formatBlogDate(lang, dateStr, 'long'),
        category: rawCategory,
        categoryLabel: translateCategory(lang, rawCategory),
        featured: Boolean((post.data as unknown as Record<string, unknown>).featured),
        url: post.url,
        image: (post.data as unknown as Record<string, unknown>).image as string | undefined,
      };
    });

  const docsPrefix = lang === 'en' ? '' : `/${lang}`;

  return (
    <>
      <BlogListClient posts={posts} t={t} />
      <Closing t={getHomepageTranslations(lang)} lang={lang} docsPrefix={docsPrefix} />
    </>
  );
}
