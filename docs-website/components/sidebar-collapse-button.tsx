'use client';

import {
  SidebarCollapseTrigger,
  SidebarTrigger,
  useSidebar,
} from 'fumadocs-ui/components/sidebar/base';
import { Sidebar as SidebarIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getSidebarTranslations } from '@/lib/translations';
import type { ReactNode } from 'react';

export interface SidebarFooterCollapseButtonProps {
  lang?: string;
}

function renderFumadocsText(template: string): ReactNode {
  const parts = template.split('{fumadocs}');
  if (parts.length === 1) {
    return template;
  }

  const linkClassName = cn(
    'font-medium hover:text-fd-foreground transition-colors',
  );

  return (
    <>
      {parts[0]}
      <a
        href="https://github.com/fuma-nama/fumadocs"
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        Fumadocs
      </a>
      {parts[1]}
    </>
  );
}

export function SidebarFooterCollapseButton({
  lang = 'en',
}: SidebarFooterCollapseButtonProps) {
  const { mode } = useSidebar();
  const t = getSidebarTranslations(lang);

  const buttonClassName = cn(
    'inline-flex items-center justify-center rounded-lg p-2',
    'text-fd-muted-foreground transition-colors',
    'hover:bg-fd-accent hover:text-fd-accent-foreground hover:rounded-full',
  );

  const textClassName = cn('text-xs text-fd-muted-foreground/60 me-2');

  return (
    <div className="flex w-full items-center">
      {mode === 'drawer' ? (
        <SidebarTrigger className={buttonClassName} aria-label="Close sidebar">
          <SidebarIcon className="size-4" />
        </SidebarTrigger>
      ) : (
        <SidebarCollapseTrigger
          className={buttonClassName}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon className="size-4" />
        </SidebarCollapseTrigger>
      )}
      <span className={cn(textClassName, 'flex-1 text-center')}>
        {renderFumadocsText(t.builtWithFumadocs)}
      </span>
    </div>
  );
}
