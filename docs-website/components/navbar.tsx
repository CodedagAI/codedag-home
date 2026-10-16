'use client';

import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';
import Link from 'fumadocs-core/link';
import { useParams, usePathname } from 'next/navigation';
import { Book, Lightbulb, Terminal, Workflow } from 'lucide-react';
import { getLinkItems, logo } from '@/lib/layout.shared';
import { CustomHeader } from './custom-header';
import { DocsCardArt } from './docs-card-art';
import { AuthArea } from './shared-nav/auth-area';
import { AccountMenu } from './account-menu';
import { TrackedAnchor } from './tracked-link';
import { i18n } from '@/lib/i18n';
import { getNavTranslations } from '@/lib/translations';
import { siteConfig } from '@/lib/config';
import { getStartEntry, siteMode, type EntrySource } from '@/lib/site-mode';
import { cn } from '@/lib/cn';

/**
 * 导航栏主按钮的样式：与首屏、收尾的主按钮同一套扁平品牌色（home.css 的 --home-cta*），
 * 三种模式共用，waitlist 的单个按钮和 beta、live 未登录时的第二个按钮都是它
 */
const NAV_CTA_CLASS =
  'inline-flex h-8 items-center whitespace-nowrap rounded-lg bg-home-cta px-3.5 text-sm font-medium text-white antialiased transition-colors hover:bg-home-cta-hover active:bg-home-cta-active focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

/**
 * 窄于 640 时，waitlist 模式的首页、定价页等在栏上并排放标题、语言按钮、主按钮和菜单按钮。
 * 主按钮的文案长短随语言差得多，栏宽不够时按语言分档收缩：先缩主按钮的字号和内边距，
 * 再缩标题，标题与语言按钮之间至少留出 global.css 给的 8px。
 * 日文最长，390 以下把主按钮拆成两行，firstLine 是第一行，文案不以它开头时仍排一行
 */
const BAR_FIT: Record<string, { title?: string; cta?: string; firstLine?: string }> = {
  en: {
    title: 'max-[339px]:text-sm',
    cta: 'max-[359px]:px-2.5 max-[359px]:text-xs max-[339px]:px-2',
  },
  zh: {
    cta: 'max-[339px]:px-2.5 max-[339px]:text-[13px]',
  },
  ja: {
    title: 'max-[339px]:text-[15px]',
    cta: 'max-[411px]:px-3 max-[411px]:text-[13px] max-[389px]:h-9 max-[389px]:flex-col max-[389px]:justify-center max-[389px]:leading-[1.15] max-[339px]:px-2 max-[339px]:text-xs',
    firstLine: 'ウェイトリスト',
  },
};

/**
 * 导航栏右侧入口，随主页模式变化（见 lib/site-mode.ts）：
 * waitlist 模式只有一个进入 /waitlist 的按钮，不挂载 AuthArea，也就不向 App 站发请求，点击时上报 cta 事件；
 * beta 与 live 模式挂载 AuthArea，未登录时第二个按钮的目标与文案由入口模块给出，这两个模式的按钮不上报；
 * 已登录时头像带悬浮菜单（控制台、账号设置、退出登录），退出经 App 的 /logout 页再回到当前页。
 * onBar 表示栏上的那一份，waitlist 模式窄屏时按 BAR_FIT 收缩；菜单里的那一份不收缩
 */
function NavEntry({
  locale,
  source,
  onBar = false,
}: {
  locale: string;
  source: EntrySource;
  onBar?: boolean;
}) {
  const start = getStartEntry(locale, source);

  if (siteMode === 'waitlist') {
    const fit = onBar ? BAR_FIT[locale] : undefined;
    const firstLine = fit?.firstLine;
    return (
      <TrackedAnchor
        href={start.href}
        className={cn(NAV_CTA_CLASS, fit?.cta)}
        event="cta"
        source={start.source}
      >
        {firstLine && start.label.startsWith(firstLine) ? (
          <>
            <span>{firstLine}</span>
            <span>{start.label.slice(firstLine.length)}</span>
          </>
        ) : (
          start.label
        )}
      </TrackedAnchor>
    );
  }

  return (
    <AuthArea
      appUrl={siteConfig.appUrl}
      locale={locale}
      secondaryAction={{ href: start.href, label: start.label, className: NAV_CTA_CLASS }}
      renderAvatar={({ user, settingsUrl }) => (
        <AccountMenu user={user} settingsUrl={settingsUrl} locale={locale} />
      )}
    />
  );
}

/**
 * 文档下拉里的小卡。下拉是一张六行的网格：上下两排小卡各占三行（图标、标题、说明），
 * 每张卡片把这三行接过来排自己的内容，所以同一排的标题在一条线上、说明从同一行开始，
 * 不管各自有几行字。左边的概览卡占满六行，标题和说明落在下排小卡的标题行、说明行上。
 */
const MENU_CARD = 'lg:grid lg:grid-rows-subgrid lg:row-span-3';

export function Navbar() {
  const { lang } = useParams<{ lang: string }>();
  const pathname = usePathname();
  // Only add language prefix for non-default languages
  // Default language (en) has no prefix in URL
  const currentLang = lang || i18n.defaultLanguage;
  const prefix = lang && lang !== i18n.defaultLanguage ? `/${lang}` : '';

  // 检查是否在 docs 子目录下
  const normalizedPathname = pathname.replace(/^\/(en|zh|ja)/, '') || '/';
  const isDocsActive = normalizedPathname.startsWith('/docs');

  // 获取翻译
  const t = getNavTranslations(currentLang);

  // 功能、定价：为站内链接添加语言前缀
  const mainLinks = getLinkItems(currentLang).map((item) => {
    if ('url' in item && item.url && !item.external && !item.url.startsWith('http')) {
      return { ...item, url: `${prefix}${item.url}` };
    }
    return item;
  });

  // Docs 链接（移动端：普通链接格式）
  const docsLinkMobile = {
    on: 'menu' as const,
    text: t.docs,
    url: `${prefix}/docs/introduction/overview`,
    icon: <Book />,
    active: 'nested-url' as const,
  };

  const docsMenuDesktop = {
    type: 'custom' as const,
    on: 'nav' as const,
    children: (
      <NavbarMenu>
        <NavbarMenuTrigger
          className={cn(
            'inline-flex items-center gap-1 p-2 text-home-muted transition-colors hover:text-fd-accent-foreground [&_svg]:size-4',
            isDocsActive && 'font-medium text-home-accent',
          )}
        >
          <Link href={`${prefix}/docs/introduction/overview`}>{t.docs}</Link>
        </NavbarMenuTrigger>
        <NavbarMenuContent>
          <NavbarMenuLink
            href={`${prefix}/docs/introduction/overview`}
            className="lg:col-start-1 lg:row-start-1 lg:row-span-6 lg:grid lg:grid-rows-subgrid"
          >
            {/* 配图占前四行：上排小卡的三行，加下排小卡的图标行。它自己不撑高度，高度由右边的卡片定 */}
            <div className="relative -mx-3 -mt-3 max-lg:aspect-1200/630 lg:row-span-4">
              <DocsCardArt />
            </div>
            <p className="font-medium">{t.docsOverview}</p>
            <p className="text-fd-muted-foreground text-sm">
              {t.docsOverviewDesc}
            </p>
          </NavbarMenuLink>

          <NavbarMenuLink
            href={`${prefix}/docs/concepts/how-it-works`}
            className={`${MENU_CARD} lg:col-start-2 lg:row-start-1`}
          >
            <Book className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
            <p className="font-medium">{t.howItWorks}</p>
            <p className="text-fd-muted-foreground text-sm">
              {t.howItWorksDesc}
            </p>
          </NavbarMenuLink>

          <NavbarMenuLink
            href={`${prefix}/docs/guides/writing-workflows`}
            className={`${MENU_CARD} lg:col-start-2 lg:row-start-4`}
          >
            <Workflow className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
            <p className="font-medium">{t.writingWorkflows}</p>
            <p className="text-fd-muted-foreground text-sm">
              {t.writingWorkflowsDesc}
            </p>
          </NavbarMenuLink>

          <NavbarMenuLink
            href={`${prefix}/docs/reference/cli`}
            className={`${MENU_CARD} lg:col-start-3 lg:row-start-1`}
          >
            <Terminal className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
            <p className="font-medium">{t.cliOverview}</p>
            <p className="text-fd-muted-foreground text-sm">
              {t.cliOverviewDesc}
            </p>
          </NavbarMenuLink>

          <NavbarMenuLink
            href={`${prefix}/docs/introduction/design-philosophy`}
            className={`${MENU_CARD} lg:col-start-3 lg:row-start-4`}
          >
            <Lightbulb className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
            <p className="font-medium">{t.designPhilosophy}</p>
            <p className="text-fd-muted-foreground text-sm">
              {t.designPhilosophyDesc}
            </p>
          </NavbarMenuLink>
        </NavbarMenuContent>
      </NavbarMenu>
    ),
  };

  // 右侧入口在 <sm 时收进移动端下拉菜单（on: 'menu' 的 custom 项）；≥sm 导航栏内联常驻，
  // 菜单（<lg 可见）里这份隐藏以免重复展示。waitlist 模式下首页、定价页等把入口留在栏上，
  // 不加这一项；beta、live 模式的 AuthArea 窄栏放不下，仍走菜单，账号入口整合时再定
  const entryOnBar = siteMode === 'waitlist';
  const entryMobile = {
    type: 'custom' as const,
    on: 'menu' as const,
    children: (
      <div className="pt-2 sm:hidden">
        <NavEntry locale={currentLang} source="nav-menu" />
      </div>
    ),
  };

  return (
    <CustomHeader
      nav={{
        url: `${prefix}/`,
        title: (
          <>
            {logo}
            <span
              className={cn(
                'text-lg font-medium max-[374px]:text-base',
                entryOnBar && !isDocsActive && BAR_FIT[currentLang]?.title,
              )}
            >
              CodeDAG
            </span>
          </>
        ),
      }}
      layout={isDocsActive ? 'docs' : 'page'}
      entryOnBar={entryOnBar}
      i18n={true}
      themeSwitch={{ enabled: false }}
      authSlot={<NavEntry locale={currentLang} source="nav" onBar />}
      links={[
        // Features, Pricing
        ...mainLinks,
        // Docs (mobile: simple link)
        docsLinkMobile,
        // Docs (desktop: dropdown menu)
        docsMenuDesktop,
        // 右侧入口（mobile 菜单内）：文档页，以及入口不在栏上的模式
        ...(isDocsActive || !entryOnBar ? [entryMobile] : []),
      ]}
    />
  );
}
