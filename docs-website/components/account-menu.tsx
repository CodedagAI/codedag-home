'use client';

import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { AuthAvatar, type AuthAreaUser } from './shared-nav/auth-area';
import { getSharedNavTranslations } from './shared-nav/nav-translations';
import { useHoverMenu } from './shared-nav/use-hover-menu';
import { siteConfig } from '@/lib/config';
import { cn } from '@/lib/cn';

const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

/**
 * 公开站登录后的头像菜单（beta、live 模式），与 App 站控制台的头像菜单同一套行为：
 * 鼠标悬停即展开，点击、Enter 也能展开，方向键选项；菜单项是控制台、账号设置、退出登录。
 *
 * 退出不在公开站上直接调 App 的接口（会话 Cookie 属于 App 站，跨站调用要放开 CORS 与
 * 可信来源），而是整页进入 App 的 /logout 页：那里在同站内退出，再按 return_to 回到当前页。
 * return_to 由 App 校验来源，只接受公开站与 App 自己的地址。
 */
export function AccountMenu({
  user,
  settingsUrl,
  locale,
}: {
  user: AuthAreaUser;
  settingsUrl: string;
  locale: string;
}) {
  const t = getSharedNavTranslations(locale);
  const appUrl = siteConfig.appUrl;
  const { open, setOpen, triggerProps, contentProps } = useHoverMenu();
  // 服务端渲染时没有 location，先给不带 return_to 的地址，挂载后再补上当前页
  const [signOutHref, setSignOutHref] = useState(`${appUrl}/logout`);

  useEffect(() => {
    const returnTo = encodeURIComponent(window.location.href);
    setSignOutHref(`${appUrl}/logout?return_to=${returnTo}`);
  }, [appUrl]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger
        aria-label={t.account}
        title={user.email}
        className={cn('shrink-0 rounded-full', focusRing)}
        {...triggerProps}
      >
        <AuthAvatar user={user} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-56 rounded-lg border bg-fd-popover p-1 text-fd-popover-foreground shadow-md outline-none data-[state=open]:animate-fd-popover-in data-[state=closed]:animate-fd-popover-out origin-[--radix-dropdown-menu-content-transform-origin]"
          {...contentProps}
        >
          <DropdownMenu.Label className="px-2 py-1.5 font-normal">
            <span className="block truncate text-sm font-medium">
              {user.name?.trim() || t.account}
            </span>
            <span className="block truncate text-xs text-fd-muted-foreground">
              {user.email}
            </span>
          </DropdownMenu.Label>
          <DropdownMenu.Separator className="my-1 h-px bg-fd-border" />
          <MenuLink href={`${appUrl}/dashboard`} icon={LayoutDashboard}>
            {t.dashboard}
          </MenuLink>
          <MenuLink href={settingsUrl} icon={Settings}>
            {t.settings}
          </MenuLink>
          <DropdownMenu.Separator className="my-1 h-px bg-fd-border" />
          <MenuLink href={signOutHref} icon={LogOut}>
            {t.signOut}
          </MenuLink>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  // 都是离开公开站的地址（App 站），用原生链接，不走客户端路由
  return (
    <DropdownMenu.Item asChild>
      <a
        href={href}
        className="flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors data-highlighted:bg-fd-accent data-highlighted:text-fd-accent-foreground"
      >
        <Icon className="size-4 text-fd-muted-foreground" />
        {children}
      </a>
    </DropdownMenu.Item>
  );
}
