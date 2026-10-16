import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { SidebarFooterCollapseButton } from '@/components/sidebar-collapse-button';
import { SidebarFloatingButton } from '@/components/sidebar-floating-button';
import 'katex/dist/katex.min.css';
import type { ReactNode } from 'react';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const base = baseOptions(lang);

  return (
    <DocsLayout
      {...base}
      tree={source.getPageTree(lang)}
      nav={{ enabled: false }}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
      i18n={false}
      containerProps={{
        style: {
          '--fd-banner-height': '3.5rem',
          '--fd-layout-width': '1440px',
        } as React.CSSProperties,
      }}
      sidebar={{
        collapsible: false,
        footer: <SidebarFooterCollapseButton lang={lang} />,
        tabs: {
          transform(option, node) {
            const meta = source.getNodeMeta(node);
            if (!meta || !node.icon) return option;

            const color = `var(--${meta.path.split('/')[0]}-color, var(--color-fd-foreground))`;

            return {
              ...option,
              icon: (
                <div
                  className="[&_svg]:size-full rounded-lg size-full text-(--tab-color) max-md:bg-(--tab-color)/10 max-md:border max-md:p-1.5"
                  style={
                    {
                      '--tab-color': color,
                    } as object
                  }
                >
                  {node.icon}
                </div>
              ),
            };
          },
        },
      }}
    >
      {children}
      <SidebarFloatingButton />
    </DocsLayout>
  );
}
