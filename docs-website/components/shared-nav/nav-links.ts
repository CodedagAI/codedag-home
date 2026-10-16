/**
 * 【两站共享拷贝】公开站与 App 站各存一份本文件，内容逐字节相同，修改时两份一起改。
 *
 * 导航链接数据（零框架依赖）。所有链接都指向公开站（codedag.com）页面，
 * 通过 siteBase 参数化：公开站传 ""（站内相对路径），app 站传
 * 配置里的公开站地址（NEXT_PUBLIC_SITE_URL；绝对地址回公开站，external 标记为 true）。
 */

export type NavLinkKey = "docs" | "features" | "pricing";

export interface NavLink {
  key: NavLinkKey;
  href: string;
  /** true 表示点击后离开当前站点（app 站指向公开站的绝对地址） */
  external: boolean;
}

const NAV_LINK_PATHS: ReadonlyArray<{ key: NavLinkKey; path: string }> = [
  { key: "docs", path: "/docs/introduction/overview" },
  { key: "features", path: "/#features" },
  { key: "pricing", path: "/pricing" },
];

/**
 * 返回导航链接集。
 *
 * @param siteBase 公开站基地址；传 "" 表示当前站就是公开站（相对路径）。
 */
export function getNavLinks(siteBase = ""): NavLink[] {
  return NAV_LINK_PATHS.map(({ key, path }) => ({
    key,
    href: `${siteBase}${path}`,
    external: siteBase !== "",
  }));
}
