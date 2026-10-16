'use client';
import { type ComponentProps, Fragment, useMemo, useState } from 'react';
import { cva } from 'class-variance-authority';
import Link from 'fumadocs-core/link';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from 'fumadocs-ui/components/ui/navigation-menu';
import { ChevronDown, Languages, Moon, Sun, Airplay, Search } from 'lucide-react';
import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';
import { useTheme } from 'next-themes';
import { useI18n, type LocaleItem } from 'fumadocs-ui/contexts/i18n';
import { usePathname, useRouter } from 'next/navigation';
import { i18n } from '@/lib/i18n';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { useEffect, useState as useStateReact } from 'react';

const navItemVariants = cva('[&_svg]:size-4', {
  variants: {
    variant: {
      main: 'inline-flex items-center gap-1 p-2 text-home-muted transition-colors hover:text-fd-accent-foreground data-[active=true]:text-home-accent',
      button: buttonVariants({
        color: 'secondary',
        className: 'gap-1.5 whitespace-nowrap',
      }),
      icon: buttonVariants({
        color: 'ghost',
        size: 'icon',
      }),
    },
  },
  defaultVariants: {
    variant: 'main',
  },
});

interface NavOptions {
  enabled?: boolean;
  component?: React.ReactNode;
  title?: React.ReactNode;
  url?: string;
  transparentMode?: 'always' | 'top' | 'none';
  children?: React.ReactNode;
  enableHoverToOpen?: boolean;
}

interface CustomHeaderProps extends BaseLayoutProps {
  nav?: Partial<NavOptions>;
  /**
   * 所在的是哪类页面：docs 是文档页，page 是首页、定价页等。
   * 1024 宽以上两类页面的导航栏完全一样，都与 1440 宽的文档布局（含侧边栏）对齐；
   * 1024 以下 page 的左右边距改用这些页面自己的边距（见 global.css）。
   */
  layout?: 'docs' | 'page';
  /**
   * 右侧登录区插槽（AuthArea）。
   * ≥sm 显示在控件区最右；<sm 时默认不显示，由调用方通过 on:'menu' 的 custom 项
   * 放进移动端下拉菜单；entryOnBar 为真且是 page 布局时留在栏上，与语言按钮并排，搜索改由下拉菜单提供。
   */
  authSlot?: React.ReactNode;
  /**
   * <sm 时把 authSlot 留在栏上（只对 page 布局生效）。只在 waitlist 模式下开：那时插槽里
   * 是一个按钮；beta、live 模式的 AuthArea 有登录加第二个按钮，窄栏放不下，仍收进菜单。
   */
  entryOnBar?: boolean;
}

function resolveLinkItems(props: {
  links?: LinkItemType[];
  githubUrl?: string;
}): LinkItemType[] {
  const items: LinkItemType[] = [];

  if (props.links) {
    items.push(...props.links);
  }

  if (props.githubUrl) {
    items.push({
      type: 'icon',
      label: 'Github',
      text: 'Github',
      icon: (
        <svg role="img" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      ),
      url: props.githubUrl,
      external: true,
    });
  }

  return items;
}

function isSecondary(item: LinkItemType): boolean {
  if ('secondary' in item && item.secondary != null) return item.secondary;
  return item.type === 'icon';
}

/**
 * 根据 active 类型和当前路径计算是否激活
 * - 'url': 只有完全匹配时才激活
 * - 'nested-url': 当 URL 是当前路径的前缀时激活
 */
function useIsActive(url: string, activeType?: 'url' | 'nested-url'): boolean {
  const pathname = usePathname();

  if (!activeType || !url) return false;

  // 移除语言前缀进行比较
  const normalizedPathname = pathname.replace(/^\/(en|zh|ja)/, '') || '/';
  const normalizedUrl = url.replace(/^\/(en|zh|ja)/, '') || '/';

  if (activeType === 'url') {
    return normalizedPathname === normalizedUrl;
  }

  if (activeType === 'nested-url') {
    // 对于根路径，只完全匹配
    if (normalizedUrl === '/') {
      return normalizedPathname === '/';
    }
    return normalizedPathname === normalizedUrl || normalizedPathname.startsWith(normalizedUrl + '/');
  }

  return false;
}

function LinkItemComponent({
  item,
  ...props
}: {
  item: LinkItemType;
} & Omit<ComponentProps<typeof Link>, 'href'>) {
  // 提前检查类型，避免在 custom/menu 类型上访问不存在的属性
  const url = 'url' in item ? item.url : undefined;
  const activeType = 'active' in item ? item.active : undefined;
  // 过滤掉 'none' 类型，只保留 'url' | 'nested-url' | undefined
  const validActiveType = activeType === 'none' ? undefined : activeType;
  const isActive = useIsActive(url ?? '', validActiveType);

  if (item.type === 'custom') return null;
  if (item.type === 'menu') return null;

  return (
    <Link
      href={item.url}
      external={item.external}
      {...props}
      className={cn(props.className, isActive && 'font-medium text-home-accent!')}
      data-active={isActive}
    >
      {props.children}
    </Link>
  );
}

// Theme Toggle Component
const themeItemVariants = cva(
  'size-7 rounded-full p-1.5 text-fd-muted-foreground',
  {
    variants: {
      active: {
        true: 'bg-fd-accent text-fd-accent-foreground',
        false: 'text-fd-muted-foreground',
      },
    },
  },
);

function ThemeToggle({
  className,
  mode = 'light-dark',
}: {
  className?: string;
  mode?: 'light-dark' | 'light-dark-system';
}) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useStateReact(false);

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  const container = cn(
    'inline-flex items-center rounded-full border p-1',
    className,
  );

  const items = [
    ['light', Sun] as const,
    ['dark', Moon] as const,
    ['system', Airplay] as const,
  ];

  if (mode === 'light-dark') {
    const value = mounted ? resolvedTheme : null;

    return (
      <button
        className={container}
        aria-label="Toggle Theme"
        onClick={() => setTheme(value === 'light' ? 'dark' : 'light')}
        data-theme-toggle=""
      >
        {items.map(([key, Icon]) => {
          if (key === 'system') return null;

          return (
            <Icon
              key={key}
              fill="currentColor"
              className={cn(themeItemVariants({ active: value === key }))}
            />
          );
        })}
      </button>
    );
  }

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

// 语言按钮的切换逻辑
function useLanguageSwitch() {
  const context = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Custom language switch handler that respects our URL strategy:
   * - Default language (en): no prefix -> /docs/overview
   * - Other languages: with prefix -> /zh/docs/overview
   */
  const handleLanguageChange = (targetLocale: string) => {
    // Remove current language prefix from pathname
    const langPattern = new RegExp(`^/(${i18n.languages.join('|')})`);
    const pathWithoutLang = pathname.replace(langPattern, '') || '/';

    // Generate new URL based on target locale
    let newPath: string;
    if (targetLocale === i18n.defaultLanguage) {
      // Default language: no prefix
      newPath = pathWithoutLang;
    } else {
      // Other languages: with prefix
      newPath = `/${targetLocale}${pathWithoutLang}`;
    }

    router.push(newPath);
  };

  return { context, handleLanguageChange };
}

// Language Toggle Component
function LanguageToggle({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { context, handleLanguageChange } = useLanguageSwitch();

  if (!context.locales || context.locales.length <= 1) return null;

  return (
    <Popover>
      <PopoverTrigger
        aria-label={context.text.chooseLanguage}
        className={cn(
          buttonVariants({ color: 'ghost', size: 'icon' }),
          className,
        )}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1 p-1">
        {context.locales.map((locale: LocaleItem) => (
          <button
            key={locale.locale}
            className={cn(
              'rounded-md px-3 py-1.5 text-start text-sm hover:bg-fd-accent hover:text-fd-accent-foreground',
              locale.locale === context.locale && 'bg-fd-accent text-fd-accent-foreground',
            )}
            onClick={() => handleLanguageChange(locale.locale)}
          >
            {locale.name}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

// Search Toggle Component
function SearchToggle({ className }: { className?: string }) {
  const search = useSearchContext();
  if (!search.enabled) return null;

  return (
    <button
      className={cn(
        buttonVariants({ color: 'ghost', size: 'icon' }),
        className,
      )}
      aria-label="Open Search"
      onClick={() => search.setOpenSearch(true)}
    >
      <Search className="size-5" />
    </button>
  );
}

function LargeSearchToggle({ className }: { className?: string }) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  const { text } = useI18n();

  if (!enabled) return null;

  return (
    <button
      type="button"
      data-search-full=""
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground',
        className,
      )}
      onClick={() => setOpenSearch(true)}
    >
      <Search className="size-4" />
      {text.search}
      <div className="ms-auto inline-flex gap-0.5">
        {hotKey.map((k, i) => (
          <kbd key={i} className="rounded-md border bg-fd-background px-1.5">
            {k.display}
          </kbd>
        ))}
      </div>
    </button>
  );
}

export function CustomHeader({
  nav = {},
  i18n = false,
  links,
  githubUrl,
  themeSwitch = {},
  searchToggle = {},
  authSlot,
  layout = 'docs',
  entryOnBar = false,
}: CustomHeaderProps) {
  const { navItems, menuItems } = useMemo(() => {
    const navItems: LinkItemType[] = [];
    const menuItems: LinkItemType[] = [];

    for (const item of resolveLinkItems({ links, githubUrl })) {
      switch (item.on ?? 'all') {
        case 'menu':
          menuItems.push(item);
          break;
        case 'nav':
          navItems.push(item);
          break;
        default:
          navItems.push(item);
          menuItems.push(item);
      }
    }

    return { navItems, menuItems };
  }, [links, githubUrl]);

  // waitlist 模式下首页、定价页等在 <sm 把入口按钮放在栏上，与语言按钮并排，搜索收进下拉菜单；
  // 文档页，以及 beta、live 模式，保持栏上放搜索和语言两个图标、入口收进菜单
  const barEntry = layout === 'page' && entryOnBar;

  return (
    <HeaderNavigationMenu data-layout={layout}>
      {/* 左侧区域: Logo 和标题 (左对齐)。375 以下间距收到 9，配合标题字号回到 16；
          更窄时标题和入口按钮怎么按语言收缩见 navbar.tsx 的 BAR_FIT */}
      <Link
        href={nav.url ?? '/'}
        className="inline-flex items-center gap-2.75 font-semibold max-[374px]:gap-2.25"
      >
        {nav.title}
      </Link>
      {nav.children}

      {/* 中间区域: 导航链接。≥xl 绝对居中；lg–xl 流式居中（避免与右侧
          搜索/语言/登录区在窄屏上重叠）；<lg 收进下拉菜单 */}
      <ul className="mx-auto flex flex-row items-center gap-2 max-lg:hidden xl:absolute xl:left-1/2 xl:mx-0 xl:-translate-x-1/2 **:whitespace-nowrap">
        {navItems
          .filter((item) => !isSecondary(item))
          .map((item, i) => (
            <NavigationMenuLinkItem key={i} item={item} className="text-sm" />
          ))}
      </ul>

      {/* 右侧区域: 控件 (右对齐)。page 在 <sm 栏上并排语言、入口和菜单三个按钮，间距收到 4，
          图标按钮自带内边距，看上去仍隔得开 */}
      <div
        className={cn(
          'flex items-center justify-end gap-1.5 ml-auto max-sm:min-w-0',
          barEntry && 'max-sm:gap-1',
        )}
      >
        {/* Desktop: lg 以上显示搜索框 */}
        {searchToggle.enabled !== false && (
          <LargeSearchToggle className="w-full max-w-60 max-lg:hidden" />
        )}
        {/* Desktop: lg 以上显示多语言 */}
        {i18n && (
          <LanguageToggle className="max-lg:hidden">
            <Languages className="size-5" />
          </LanguageToggle>
        )}
        {themeSwitch.enabled !== false && (
          <ThemeToggle mode={themeSwitch?.mode} className="max-lg:hidden" />
        )}
        <ul className="flex flex-row gap-2 items-center empty:hidden max-lg:hidden">
          {navItems.filter(isSecondary).map((item, i) => (
            <NavigationMenuLinkItem
              key={i}
              className={cn(
                item.type === 'icon' && '-mx-1 first:ms-0 last:me-0',
              )}
              item={item}
            />
          ))}
        </ul>

        {/* Mobile: lg 以下显示搜索按钮（page 在 <sm 改由菜单里的搜索项提供，栏上的位置留给语言和入口） */}
        {searchToggle.enabled !== false && (
          <SearchToggle className={cn('p-2 lg:hidden', barEntry && 'max-sm:hidden')} />
        )}
        {/* Mobile: lg 以下显示多语言。page 在 <sm 也留在栏上，紧挨入口按钮，
            不熟悉英文的访客一眼能看到；内边距收一点，给入口按钮让出位置 */}
        {i18n && (
          <LanguageToggle className={cn('p-2 lg:hidden', barEntry && 'max-sm:p-1.5')}>
            <Languages className="size-5" />
          </LanguageToggle>
        )}
        {/* 登录区（AuthArea）：≥sm 常驻最右；<sm 时收进下拉菜单，只有 waitlist 模式的
            首页、定价页等把那一个按钮留在栏上（barEntry）。shrink-0：右侧区域放不下时
            由搜索框（w-full）收缩，登录区不收缩，否则头像会被挤成椭圆 */}
        {authSlot != null && (
          <div
            className={cn(
              'ms-1 flex shrink-0 items-center',
              barEntry ? 'max-sm:ms-0 max-sm:min-w-0 max-sm:*:min-w-0' : 'max-sm:hidden',
            )}
          >
            {authSlot}
          </div>
        )}
        {/* Mobile: lg 以下显示下拉菜单（导航链接 <lg 已隐藏，经菜单可达）；
            page 在 <sm 让按钮伸进右边距，图标与左边的标识对齐页面边距，栏上多出一点位置给登录区 */}
        <NavigationMenuItem className={cn('lg:hidden', barEntry && 'max-sm:-me-1.5')}>
          <NavigationMenuTrigger
            aria-label="Toggle Menu"
            className={cn(
              buttonVariants({
                size: 'icon',
                color: 'ghost',
                className: 'group [&_svg]:size-5.5',
              }),
            )}
            onPointerMove={
              nav.enableHoverToOpen ? undefined : (e) => e.preventDefault()
            }
          >
            <ChevronDown className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="flex flex-col p-4">
            {menuItems
              .filter((item) => !isSecondary(item))
              .map((item, i) => (
                <MobileNavigationMenuLinkItem key={i} item={item} />
              ))}
            {/* page 在 <sm 不在栏上放搜索图标，改放在菜单里 */}
            {barEntry && searchToggle.enabled !== false && (
              <div className="flex flex-col sm:hidden">
                <MobileSearchItem />
              </div>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </div>
    </HeaderNavigationMenu>
  );
}

function HeaderNavigationMenu(props: ComponentProps<'div'>) {
  const [value, setValue] = useState('');

  return (
    <NavigationMenu value={value} onValueChange={setValue} asChild>
      <header
        id="nd-nav"
        {...props}
        suppressHydrationWarning
        className={cn(
          'sticky h-14 top-0 z-40 [--fd-layout-width:1440px]',
          props.className,
        )}
      >
        <div
          className={cn(
            'backdrop-blur-lg border-b transition-colors *:mx-auto *:max-w-(--fd-layout-width)',
            value.length > 0 && 'max-lg:shadow-lg max-lg:rounded-b-2xl',
            'bg-fd-background/80',
          )}
        >
          <NavigationMenuList
            className="relative flex h-14 w-full items-center px-4"
            asChild
          >
            <nav>{props.children}</nav>
          </NavigationMenuList>

          {/* 下拉比导航栏窄，居中在三项链接下面：跟着 1440 的导航栏铺满时，
              每张卡片有四成是空的；1200 宽时第一张卡的配图正好按一比一画 */}
          <NavigationMenuViewport className="max-w-[1200px]" />
        </div>
      </header>
    </NavigationMenu>
  );
}

function NavigationMenuLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  if (item.type === 'custom') return <div {...props}>{item.children}</div>;

  if (item.type === 'menu') {
    const children = item.items.map((child, j) => {
      if (child.type === 'custom') {
        return <Fragment key={j}>{child.children}</Fragment>;
      }

      const {
        banner = child.icon ? (
          <div className="w-fit rounded-md border bg-fd-muted p-1 [&_svg]:size-4">
            {child.icon}
          </div>
        ) : null,
        ...rest
      } = child.menu ?? {};

      return (
        <NavigationMenuLink key={`${j}-${child.url}`} asChild>
          <Link
            href={child.url}
            external={child.external}
            {...rest}
            className={cn(
              'flex flex-col gap-2 rounded-lg border bg-fd-card p-3 transition-colors hover:bg-fd-accent/80 hover:text-fd-accent-foreground',
              rest.className,
            )}
          >
            {rest.children ?? (
              <>
                {banner}
                <p className="text-base font-medium">{child.text}</p>
                <p className="text-sm text-fd-muted-foreground empty:hidden">
                  {child.description}
                </p>
              </>
            )}
          </Link>
        </NavigationMenuLink>
      );
    });

    return (
      <NavigationMenuItem {...props}>
        <NavigationMenuTrigger className={cn(navItemVariants(), 'rounded-md')}>
          {item.url ? (
            <Link href={item.url} external={item.external}>
              {item.text}
            </Link>
          ) : (
            item.text
          )}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3">
          {children}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem {...props}>
      <NavigationMenuLink asChild>
        <LinkItemComponent
          item={item}
          aria-label={item.type === 'icon' ? item.label : undefined}
          className={cn(navItemVariants({ variant: item.type }))}
        >
          {item.type === 'icon' ? item.icon : item.text}
        </LinkItemComponent>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

// 下拉菜单里一行一项的样式：导航链接、搜索项共用
const mobileMenuItem =
  'inline-flex items-center gap-2 py-1.5 transition-colors hover:text-fd-popover-foreground/50 data-[active=true]:font-medium data-[active=true]:text-home-accent [&_svg]:size-4';

// 菜单里的搜索项：首页、定价页等 <sm 不在栏上放搜索图标，从这里打开搜索对话框
function MobileSearchItem() {
  const { enabled, setOpenSearch } = useSearchContext();
  const { text } = useI18n();

  if (!enabled) return null;

  return (
    <NavigationMenuLink asChild>
      <button
        type="button"
        className={mobileMenuItem}
        onClick={() => setOpenSearch(true)}
      >
        <Search />
        {text.search}
      </button>
    </NavigationMenuLink>
  );
}

function MobileNavigationMenuLinkItem({
  item,
  ...props
}: {
  item: LinkItemType;
  className?: string;
}) {
  if (item.type === 'custom')
    return <div className={cn('grid', props.className)}>{item.children}</div>;

  if (item.type === 'menu') {
    const header = (
      <>
        {item.icon}
        {item.text}
      </>
    );

    return (
      <div className={cn('mb-4 flex flex-col', props.className)}>
        <p className="mb-1 text-sm text-fd-muted-foreground">
          {item.url ? (
            <NavigationMenuLink asChild>
              <Link href={item.url} external={item.external}>
                {header}
              </Link>
            </NavigationMenuLink>
          ) : (
            header
          )}
        </p>
        {item.items.map((child, i) => (
          <MobileNavigationMenuLinkItem key={i} item={child} />
        ))}
      </div>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <LinkItemComponent
        item={item}
        className={cn(
          {
            main: mobileMenuItem,
            icon: buttonVariants({
              size: 'icon',
              color: 'ghost',
            }),
            button: buttonVariants({
              color: 'secondary',
              className: 'gap-1.5 [&_svg]:size-4',
            }),
          }[item.type ?? 'main'],
          props.className,
        )}
        aria-label={item.type === 'icon' ? item.label : undefined}
      >
        {item.icon}
        {item.type === 'icon' ? undefined : item.text}
      </LinkItemComponent>
    </NavigationMenuLink>
  );
}
