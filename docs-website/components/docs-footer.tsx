import { cn } from '@/lib/cn';
import { ChevronLeft, ChevronRight, MessageSquareWarning } from 'lucide-react';
import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';
import { siteConfig } from '@/lib/config';
import { getDocsPageTranslations } from '@/lib/translations/docs-page';

export interface FooterItem {
  name: ReactNode;
  url: string;
  description?: string;
}

export interface DocsFooterProps {
  previous?: FooterItem;
  next?: FooterItem;
  lang: string;
  /** 当前页面的标题和站内路径（带语言前缀），预填到新建 Issue 里 */
  page: { title: string; url: string };
}

/** GitHub 仓库的新建 Issue 页面，标题和正文预填当前页面的标题与正式地址 */
function reportIssueHref(lang: string, page: DocsFooterProps['page']): string {
  const t = getDocsPageTranslations(lang).reportIssue;
  const title = encodeURIComponent(t.issueTitle(page.title));
  const body = encodeURIComponent(t.issueBody(`${siteConfig.baseUrl}${page.url}`));
  return `${siteConfig.githubUrl}/issues/new?title=${title}&body=${body}`;
}

function FooterNavItem({
  item,
  direction,
}: {
  item: FooterItem;
  direction: 'previous' | 'next';
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;
  const isNext = direction === 'next';

  return (
    <Link
      href={item.url}
      className={cn(
        'flex flex-col gap-2 rounded-lg border p-4 text-sm transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground',
        isNext && 'text-end',
      )}
    >
      <div
        className={cn(
          'inline-flex items-center gap-1.5 font-medium',
          isNext && 'flex-row-reverse',
        )}
      >
        <Icon className="-mx-1 size-4 shrink-0 rtl:rotate-180" />
        <p>{item.name}</p>
      </div>
      {item.description && (
        <p className="text-fd-muted-foreground truncate">{item.description}</p>
      )}
    </Link>
  );
}

export function DocsFooter({ previous, next, lang, page }: DocsFooterProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Navigation */}
      {(previous || next) && (
        <div
          className={cn(
            'grid gap-4',
            previous && next ? 'grid-cols-2 max-md:grid-cols-1' : 'grid-cols-1',
          )}
        >
          {previous && <FooterNavItem item={previous} direction="previous" />}
          {next && <FooterNavItem item={next} direction="next" />}
        </div>
      )}

      {/* 公开的问题反馈走 GitHub Issues */}
      <div className="flex justify-center py-2">
        <a
          href={reportIssueHref(lang, page)}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-md text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <MessageSquareWarning className="size-4 shrink-0" aria-hidden="true" />
          {getDocsPageTranslations(lang).reportIssue.label}
        </a>
      </div>
    </div>
  );
}
