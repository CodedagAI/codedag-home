'use client';

import Link from 'fumadocs-core/link';
import { useParams, usePathname } from 'next/navigation';
import { i18n } from '@/lib/i18n';
import { githubIcon, githubUrl } from '@/lib/layout.shared';
import { cn } from '@/lib/cn';
import { useTheme } from 'next-themes';
import { Moon, Sun, Airplay } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { getFooterTranslations } from '@/lib/translations';
import { policyFacts } from '@/lib/policies';
import { CodeDagMark } from './codedag-mark';

interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

const themeItemVariants = cva(
  'size-8 rounded-full p-2 text-fd-muted-foreground',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground',
        false: 'text-fd-muted-foreground',
      },
    },
  },
);

function FooterThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = cn(
    'inline-flex items-center rounded-full border p-1',
    className,
  );

  const items = [
    ['light', Sun] as const,
    ['dark', Moon] as const,
    ['system', Airplay] as const,
  ];

  const value = mounted ? theme : null;

  return (
    <div className={container} data-theme-toggle="">
      {items.map(([key, Icon]) => (
        <button
          key={key}
          aria-label={key}
          className={cn(themeItemVariants({ active: value === key }))}
          onClick={() => setTheme(key)}
        >
          <Icon className="size-full" fill="currentColor" />
        </button>
      ))}
    </div>
  );
}

export function Footer() {
  const { lang } = useParams<{ lang: string }>();
  const pathname = usePathname();
  const currentLang = lang || i18n.defaultLanguage;
  const prefix = lang && lang !== i18n.defaultLanguage ? `/${lang}` : '';

  // 页脚和导航栏是同一副骨架（导航栏的排法见 global.css）：1024 宽以上各页完全一样，
  // 宽度随 1440 的文档布局，左右各留 16px；再窄，左右边距随本页的正文，所以要知道是不是文档页
  const isDocs = (pathname.replace(/^\/(en|zh|ja)/, '') || '/').startsWith('/docs');

  // 获取翻译
  const t = getFooterTranslations(currentLang);

  const sections: FooterSection[] = [
    {
      title: t.product,
      links: [
        { label: t.features, href: `${prefix}/#features` },
        { label: t.pricing, href: `${prefix}/pricing` },
      ],
    },
    {
      title: t.resources,
      links: [
        { label: t.docs, href: `${prefix}/docs/introduction/overview` },
        { label: t.designPhilosophy, href: `${prefix}/docs/introduction/design-philosophy` },
        { label: t.reference, href: `${prefix}/docs/reference/cli` },
        { label: t.releaseNotes, href: `${prefix}/docs/release-notes/0.1.0` },
      ],
    },
    {
      title: t.legal,
      links: [
        { label: t.termsOfService, href: `${prefix}/terms` },
        { label: t.privacyPolicy, href: `${prefix}/privacy` },
        { label: t.refundPolicy, href: `${prefix}/refund` },
      ],
    },
    // 页脚出现在每一页，这里不写邮箱地址：求助链到文档里写着地址和该附哪些信息的那一节，
    // 公开的问题反馈走 GitHub Issues
    {
      title: t.contact,
      links: [
        { label: t.getHelp, href: `${prefix}/docs/troubleshooting/troubleshooting#get-help` },
        { label: t.issues, href: `${githubUrl}/issues`, external: true },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t bg-fd-background">
      <div className={cn('mx-auto max-w-page pt-12 pb-6', isDocs ? 'px-4' : 'px-5 sm:px-8 lg:px-4')}>
        {/* 标识这一列和导航栏的标识列一样宽，连左边距正好是文档侧边栏的 268px；
            四栏链接从 300 开始，在文档页上接着正文那一列 */}
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-[15.75rem_minmax(0,1fr)]">
          <Link
            href={`${prefix}/`}
            className="inline-flex items-center gap-2.75 self-start text-lg font-semibold text-fd-foreground"
          >
            <CodeDagMark className="size-6.5" />
            CodeDAG
          </Link>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-1.5 text-sm font-medium text-home-muted">
                  {section.title}
                </h3>
                {/* 行距放在链接自己的内边距里：间距不变，可点的范围更高 */}
                <ul>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        external={link.external}
                        className="inline-block py-1.5 text-sm text-fd-foreground transition-colors hover:text-fd-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t pt-6 max-sm:items-start sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-home-muted">
            {/* 版权行写运营 CodeDAG 的公司的法定名称，与三份政策页一致 */}
            &copy; {new Date().getFullYear()} {policyFacts.legalName}
            {t.allRightsReserved}
          </p>
          <div className="flex items-center gap-3">
            <FooterThemeToggle />
            <Link
              href={githubUrl}
              external
              className="inline-flex size-10.5 items-center justify-center rounded-full border text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
              aria-label="GitHub"
            >
              <span className="size-6">{githubIcon}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
