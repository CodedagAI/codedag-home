import Link from 'next/link';

interface BlogFeaturedProps {
  title: string;
  description?: string;
  author: string;
  date: string;
  dateLabel?: string;
  category?: string;
  url: string;
  image?: string;
  badgeLabel?: string;
  readMoreLabel?: string;
}

export function BlogFeatured({
  title,
  description,
  author,
  date,
  dateLabel,
  category,
  url,
  badgeLabel = 'Featured',
  readMoreLabel = 'Read article →',
}: BlogFeaturedProps) {
  return (
    <Link
      href={url}
      className="group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-300 hover:shadow-md dark:border-white/8 dark:bg-white/2 dark:hover:border-white/16 dark:hover:bg-white/4"
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:gap-10">
        {/* Left: text content */}
        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-[hsl(260,100%,65%,0.12)] px-3 py-1 text-xs font-medium text-[hsl(260,70%,46%)] dark:text-brand border border-[hsl(260,100%,65%,0.25)]">
              {badgeLabel}
            </span>
            {category && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-white/6 dark:text-neutral-400">
                {category}
              </span>
            )}
          </div>

          <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            {title}
          </h2>

          {description && (
            <p className="mb-6 max-w-lg text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-neutral-400 dark:text-neutral-500">
            <span>{author}</span>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <time dateTime={date}>
              {dateLabel ?? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>

          <span className="mt-6 inline-flex items-center text-sm font-medium text-[hsl(260,70%,46%)] transition-colors group-hover:text-[hsl(260,70%,56%)] dark:text-brand dark:group-hover:text-[hsl(257,100%,85%)]">
            {readMoreLabel}
          </span>
        </div>

        {/* Right: decorative gradient (placeholder for future cover image) */}
        <div className="hidden aspect-4/3 w-full max-w-[280px] shrink-0 overflow-hidden rounded-xl md:block">
          <div className="relative h-full w-full overflow-hidden">
            {/* Base bg */}
            <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900" />
            {/* Glow orbs */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[hsl(260,100%,65%,0.35)] blur-2xl" />
            <div className="absolute -bottom-8 -left-4 h-32 w-32 rounded-full bg-[hsl(280,100%,70%,0.25)] blur-2xl" />
            <div className="absolute bottom-4 right-8 h-24 w-24 rounded-full bg-[hsl(200,100%,60%,0.2)] blur-xl" />
          </div>
        </div>
      </div>
    </Link>
  );
}
