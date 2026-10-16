import Link from 'next/link';
import { cn } from '@/lib/cn';

interface BlogCardProps {
  title: string;
  description?: string;
  author: string;
  date: string;
  dateLabel?: string;
  category?: string;
  featured?: boolean;
  url: string;
  featuredLabel?: string;
  readMoreLabel?: string;
}

export function BlogCard({
  title,
  description,
  author,
  date,
  dateLabel,
  category,
  featured,
  url,
  featuredLabel = 'Featured',
}: BlogCardProps) {
  return (
    <Link
      href={url}
      className={cn(
        'group relative flex flex-col rounded-xl border p-5 transition-all duration-200',
        'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md hover:-translate-y-0.5',
        'dark:border-white/8 dark:bg-white/2 dark:hover:border-white/16 dark:hover:bg-white/4 dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
        featured && 'border-l-2 border-l-[hsl(260,100%,65%,0.5)] dark:border-l-[hsl(260,100%,65%,0.4)]',
      )}
    >
      {/* Category + Featured badge row */}
      <div className="mb-3 flex items-center gap-2">
        {category && (
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-white/6 dark:text-neutral-400">
            {category}
          </span>
        )}
        {featured && (
          <span className="rounded-full bg-[hsl(260,100%,65%,0.1)] px-2.5 py-0.5 text-xs font-medium text-[hsl(260,70%,46%)] dark:text-brand">
            {featuredLabel}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-1.5 text-lg font-semibold leading-snug tracking-tight text-neutral-900 group-hover:text-neutral-800 dark:text-white dark:group-hover:text-white">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}

      {/* Footer: Author + Date */}
      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-neutral-400 dark:text-neutral-500">
        <span>{author}</span>
        <time dateTime={date}>
          {dateLabel ?? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </time>
      </div>
    </Link>
  );
}
