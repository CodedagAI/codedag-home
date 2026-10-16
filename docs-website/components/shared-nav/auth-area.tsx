/**
 * 【两站共享拷贝】公开站与 App 站各存一份本文件，内容逐字节相同，修改时两份一起改。
 *
 * 导航栏登录区（纯 React + Tailwind，不依赖 fumadocs / shadcn）：
 * 挂载后 fetch(appUrl + "/api/public/session", { credentials: "include" })，
 * 未登录显示 Sign in + Get Started，已登录显示头像（img / 首字母 fallback）。
 * 不传 renderAvatar 时头像链接到 session 返回的 settings_url；两站都通过
 * renderAvatar 组合插槽包上头像下拉菜单。
 *
 * 颜色只用两站都定义的 brand token（--color-brand*）与中性色 Tailwind
 * 类，深浅主题跟随各站的 .dark class。
 */
"use client";

import { useEffect, useState, type ReactNode } from "react";

import { getSharedNavTranslations } from "./nav-translations";

export interface AuthAreaUser {
  name?: string;
  email?: string;
  image?: string;
}

/** GET /api/public/session 的最小响应形状（只含展示字段） */
interface PublicSessionState {
  authenticated: boolean;
  user?: AuthAreaUser;
  settings_url?: string;
  login_url?: string;
}

export interface AuthAreaProps {
  /** app 站基地址（公开站传 NEXT_PUBLIC_APP_URL；app 站内传 "" 走同源） */
  appUrl: string;
  /** 文案语言（en / zh / ja），缺省 en */
  locale?: string;
  /**
   * 组合插槽：登录后头像的自定义渲染（app 站用它包 DropdownMenu）。
   * 缺省渲染一个链接到 settingsUrl 的头像。
   */
  renderAvatar?: (props: {
    user: AuthAreaUser;
    settingsUrl: string;
  }) => ReactNode;
  /**
   * 替换未登录时第二个按钮的目标、文案与样式（公开站按主页模式传入：
   * 内测时指向 Waitlist，正式开放后指向 App 账号入口；className 让它与
   * 站内其他主按钮同一套样式）。不传时为 Get Started → appUrl + "/signup"，
   * 样式为扁平品牌色（bg-brand，两站都定义了这个变量）。
   */
  secondaryAction?: { href: string; label: string; className?: string };
  className?: string;
}

function cls(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** 头像圆片：有 image 用 img，否则名字/邮箱首字母 fallback（品牌紫底） */
export function AuthAvatar({
  user,
  className,
}: {
  user: AuthAreaUser;
  className?: string;
}) {
  const initialSource = (user.name ?? "").trim() || (user.email ?? "").trim();
  const initial = initialSource ? initialSource.charAt(0).toUpperCase() : "?";

  if (user.image) {
    // 用原生 img 而非 next/image：共享组件零框架依赖，且头像域名不可枚举
    return (
      <img
        src={user.image}
        alt=""
        referrerPolicy="no-referrer"
        className={cls("size-8 shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cls(
        "flex size-8 shrink-0 select-none items-center justify-center rounded-full bg-brand-secondary text-sm font-semibold text-brand-secondary-foreground",
        className,
      )}
    >
      {initial}
    </span>
  );
}

export function AuthArea({
  appUrl,
  locale = "en",
  renderAvatar,
  secondaryAction,
  className,
}: AuthAreaProps) {
  const t = getSharedNavTranslations(locale);
  const [session, setSession] = useState<PublicSessionState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${appUrl}/api/public/session`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (res) =>
        res.ok ? ((await res.json()) as PublicSessionState) : null,
      )
      .catch(() => null)
      .then((data) => {
        if (controller.signal.aborted) return;
        setSession(data);
        setLoading(false);
      });

    return () => controller.abort();
  }, [appUrl]);

  // 加载中：骨架占位（高度恒为 h-8，宽度按最终形态预估，避免跳动）
  if (loading) {
    return (
      <div
        role="status"
        aria-label={t.loadingAccount}
        className={cls("flex h-8 items-center gap-2", className)}
      >
        {renderAvatar ? (
          // app 站导航必然已登录，骨架取头像形状
          <span className="size-8 animate-pulse rounded-full bg-neutral-500/20 motion-reduce:animate-none" />
        ) : (
          <>
            <span className="h-8 w-14 animate-pulse rounded-lg bg-neutral-500/20 motion-reduce:animate-none" />
            <span className="h-8 w-24 animate-pulse rounded-lg bg-neutral-500/20 motion-reduce:animate-none" />
          </>
        )}
      </div>
    );
  }

  // 已登录：头像（缺省链接到 settings_url；app 站用 renderAvatar 包下拉）
  if (session?.authenticated && session.user) {
    const settingsUrl = session.settings_url ?? `${appUrl}/settings`;
    return (
      <div className={cls("flex h-8 shrink-0 items-center", className)}>
        {renderAvatar ? (
          renderAvatar({ user: session.user, settingsUrl })
        ) : (
          <a
            href={settingsUrl}
            aria-label={t.account}
            title={session.user.email}
            // shrink-0：img 的 max-width:100% 让它对最小宽度没有贡献，容器一紧头像就会被压扁
            className={cls("shrink-0 rounded-full", focusRing)}
          >
            <AuthAvatar user={session.user} />
          </a>
        )}
      </div>
    );
  }

  // 未登录（含请求失败的降级）：Sign in + Get Started
  const loginUrl = session?.login_url ?? `${appUrl}/login`;
  return (
    <div className={cls("flex h-8 items-center gap-2", className)}>
      <a
        href={loginUrl}
        className={cls(
          "inline-flex h-8 items-center whitespace-nowrap rounded-lg px-2.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white",
          focusRing,
        )}
      >
        {t.signIn}
      </a>
      <a
        href={secondaryAction?.href ?? `${appUrl}/signup`}
        className={cls(
          secondaryAction?.className ??
            "inline-flex h-8 items-center whitespace-nowrap rounded-lg bg-brand px-3.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90",
          focusRing,
        )}
      >
        {secondaryAction?.label ?? t.getStarted}
      </a>
    </div>
  );
}
