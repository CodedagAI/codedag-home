/**
 * 【两站共享拷贝】公开站与 App 站各存一份本文件，内容逐字节相同，修改时两份一起改。
 *
 * 账号入口的三语用词（零框架依赖）：App 站各页面的名称，以及登录、退出登录等词。
 * 公开站的登录区与头像菜单、App 站的侧边栏与头像菜单都从这里取，同一样东西在两站
 * 叫同一个名字。只有一个站用得到的词写在那个站自己的文案里。
 * 中日文的用词与用户文档一致。两站要保持一致的其他事项见同目录的 README.md。
 */

export type NavLocale = "en" | "zh" | "ja";

export interface SharedNavTranslations {
  // App 站的页面名
  dashboard: string;
  billing: string;
  usage: string;
  // 登录区与头像菜单
  signIn: string;
  getStarted: string;
  signOut: string;
  /** 登录后头像的 aria-label / 头像菜单没有姓名时的抬头 */
  account: string;
  /** 登录态加载骨架的 aria-label */
  loadingAccount: string;
}

const sharedNavTranslations: Record<NavLocale, SharedNavTranslations> = {
  en: {
    dashboard: "Dashboard",
    billing: "Billing",
    usage: "Usage",
    signIn: "Sign in",
    getStarted: "Get Started",
    signOut: "Sign out",
    account: "Account",
    loadingAccount: "Loading account…",
  },
  zh: {
    dashboard: "控制台",
    billing: "账单",
    usage: "用量",
    signIn: "登录",
    getStarted: "开始使用",
    signOut: "退出登录",
    account: "账号",
    loadingAccount: "正在加载账号…",
  },
  ja: {
    dashboard: "ダッシュボード",
    billing: "請求",
    usage: "利用状況",
    signIn: "ログイン",
    getStarted: "始める",
    signOut: "ログアウト",
    account: "アカウント",
    loadingAccount: "アカウントを読み込み中…",
  },
};

export function getSharedNavTranslations(locale: string): SharedNavTranslations {
  return (
    sharedNavTranslations[locale as NavLocale] ?? sharedNavTranslations.en
  );
}
