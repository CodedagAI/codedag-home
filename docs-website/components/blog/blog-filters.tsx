'use client';

import { cn } from '@/lib/cn';
import type { BlogTranslations } from '@/lib/blog-translations';

const CATEGORIES = [
  'All',
  'Engineering',
  'Product',
  'Tutorials',
  'Deep Dives',
  'Announcements',
] as const;

type CategoryKey = (typeof CATEGORIES)[number];

const categoryToI18nKey: Record<CategoryKey, keyof BlogTranslations['filters']> = {
  All: 'all',
  Engineering: 'engineering',
  Product: 'product',
  Tutorials: 'tutorials',
  'Deep Dives': 'deepDives',
  Announcements: 'announcements',
};

export function BlogFilters({
  active,
  onChange,
  t,
}: {
  active: string;
  onChange: (category: string) => void;
  t: BlogTranslations['filters'];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-[hsl(260,100%,65%,0.15)] text-[hsl(260,70%,46%)] dark:text-[hsl(258,100%,80%)] border border-[hsl(260,100%,65%,0.3)]'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 border border-transparent hover:border-neutral-200 dark:hover:border-white/10',
            )}
          >
            {t[categoryToI18nKey[cat]]}
          </button>
        );
      })}
    </div>
  );
}
