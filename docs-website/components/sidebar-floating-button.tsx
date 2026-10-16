'use client';

import {
  SidebarCollapseTrigger,
  useSidebar,
} from 'fumadocs-ui/components/sidebar/base';
import { Sidebar } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Unified floating button for sidebar toggle
 * - Desktop: shows when sidebar is collapsed, click to expand
 * - Mobile: shows when sidebar is closed, click to open
 */
export function SidebarFloatingButton() {
  const { open, setOpen, collapsed, mode } = useSidebar();

  // Desktop: show when collapsed
  // Mobile (drawer): show when closed
  const shouldShow = mode === 'drawer' ? !open : collapsed;

  if (!shouldShow) return null;

  const containerClassName = cn(
    'fixed start-4 bottom-4 z-10',
    'flex rounded-full p-0.5',
    'border bg-fd-muted shadow-lg',
  );

  const buttonClassName = cn(
    'inline-flex items-center justify-center',
    'rounded-full p-2',
    'text-fd-muted-foreground',
    'transition-colors',
    'hover:bg-fd-accent hover:text-fd-accent-foreground',
  );

  // Mobile: custom button to open sidebar
  if (mode === 'drawer') {
    return (
      <div className={containerClassName}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={buttonClassName}
          aria-label="Open sidebar"
        >
          <Sidebar className="size-4" />
        </button>
      </div>
    );
  }

  // Desktop: use SidebarCollapseTrigger to expand
  return (
    <div className={containerClassName}>
      <SidebarCollapseTrigger
        className={buttonClassName}
        aria-label="Expand sidebar"
      >
        <Sidebar className="size-4" />
      </SidebarCollapseTrigger>
    </div>
  );
}
