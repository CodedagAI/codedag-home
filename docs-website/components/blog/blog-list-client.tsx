'use client';

import { useState, useMemo } from 'react';
import type { BlogTranslations } from '@/lib/blog-translations';
import { BlogFilters } from './blog-filters';
import { BlogCard } from './blog-card';
import { BlogFeatured } from './blog-featured';
import { BlogPagination } from './blog-pagination';

const POSTS_PER_PAGE = 30;

export interface BlogPostData {
  title: string;
  description?: string;
  author: string;
  date: string;
  /** Pre-formatted date label (locale-aware) */
  dateLabel: string;
  /** Pre-formatted long date label for featured card */
  dateLabelLong: string;
  /** Raw English category key (used for filtering logic) */
  category: string;
  /** Translated category display label */
  categoryLabel: string;
  featured: boolean;
  url: string;
  image?: string;
}

export function BlogListClient({
  posts,
  t,
}: {
  posts: BlogPostData[];
  t: BlogTranslations;
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Featured post is fixed — always the latest featured post, independent of filters/pagination
  const featuredPost = posts.find((p) => p.featured);

  // List posts: always exclude featured (it's shown in the hero above)
  // Then apply category filter
  const filteredPosts = useMemo(
    () =>
      posts
        .filter((p) => p !== featuredPost)
        .filter((p) => activeCategory === 'All' || p.category === activeCategory),
    [posts, activeCategory, featuredPost],
  );

  // Pagination (only for list, featured is outside)
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  // Reset to page 1 when category changes
  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-white antialiased dark:bg-[#0A0A0A]">
      {/* ── Hero：一块和定价页页头、页尾同款的舞台 ── */}
      <div className="mx-auto w-full max-w-[1320px] px-3 pt-4 pb-12 sm:px-6 sm:pt-6">
        <section className="stage px-6 py-14 text-center sm:py-20">
          <span className="inline-flex items-center rounded-full border border-stage-line px-3.5 py-1 text-xs font-medium text-stage-muted">
            {t.hero.badge}
          </span>
          <h1 className="home-h2 mx-auto mt-5 max-w-4xl">{t.hero.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-[1.7] text-balance text-stage-muted">
            {t.hero.subtitle}
          </p>
        </section>
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {/* ── Featured Post ── */}
        {featuredPost && (
          <section className="mb-12">
            <BlogFeatured
              title={featuredPost.title}
              description={featuredPost.description}
              author={featuredPost.author}
              date={featuredPost.date}
              dateLabel={featuredPost.dateLabelLong}
              category={featuredPost.categoryLabel}
              url={featuredPost.url}
              image={featuredPost.image}
              badgeLabel={t.featured.badge}
              readMoreLabel={t.featured.readMore}
            />
          </section>
        )}

        {/* ── Category Filters ── */}
        <section className="mb-10 flex items-center justify-between">
          <BlogFilters
            active={activeCategory}
            onChange={handleCategoryChange}
            t={t.filters}
          />
        </section>

        {/* ── Post Grid ── */}
        <section className="pb-12">
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <BlogCard
                  key={post.url}
                  title={post.title}
                  description={post.description}
                  author={post.author}
                  date={post.date}
                  dateLabel={post.dateLabel}
                  category={post.categoryLabel}
                  featured={post.featured}
                  url={post.url}
                  featuredLabel={t.card.featured}
                  readMoreLabel={t.card.readMore}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="mb-4 text-4xl">📝</div>
              <p className="text-neutral-400 dark:text-neutral-500">
                {t.card.emptyState}
              </p>
            </div>
          )}
        </section>

        {/* ── Pagination ── */}
        <section className="pb-24">
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            t={t.pagination}
          />
        </section>
      </div>
    </main>
  );
}
