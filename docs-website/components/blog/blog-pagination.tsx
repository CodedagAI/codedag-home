'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { BlogTranslations } from '@/lib/blog-translations';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: BlogTranslations['pagination'];
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
  t,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-1.5"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          currentPage === 1
            ? 'cursor-not-allowed text-neutral-300 dark:text-neutral-600'
            : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-white/6 dark:hover:text-neutral-200',
        )}
      >
        <ChevronLeft className="size-4" />
        {t.previous}
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1.5 text-sm text-neutral-400 dark:text-neutral-500"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                page === currentPage
                  ? 'bg-[hsl(260,100%,65%,0.12)] text-[hsl(260,70%,46%)] dark:text-brand border border-[hsl(260,100%,65%,0.25)]'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-white/6 dark:hover:text-neutral-200',
              )}
            >
              {page}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          currentPage === totalPages
            ? 'cursor-not-allowed text-neutral-300 dark:text-neutral-600'
            : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-white/6 dark:hover:text-neutral-200',
        )}
      >
        {t.next}
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}

/**
 * Generate page numbers with ellipsis for large page counts.
 * Shows: 1 ... (current-1) current (current+1) ... last
 */
function getPageNumbers(
  current: number,
  total: number,
): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  // Always show last page
  pages.push(total);

  return pages;
}
