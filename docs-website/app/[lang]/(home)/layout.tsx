import type { ReactNode } from 'react';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  await params; // consume params to satisfy Next.js

  return (
    <div
      id="nd-home-layout"
      className="flex flex-1 flex-col dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)] [--color-fd-primary:var(--color-brand)]"
    >
      {children}
    </div>
  );
}
