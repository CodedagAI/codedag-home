/**
 * 【两站共享拷贝】公开站与 App 站各存一份本文件，内容逐字节相同，修改时两份一起改。
 *
 * 导航与 AuthArea 的三语文案字典（零框架依赖）。导航项文案抽取自
 * 公开站 lib/translations.ts 的 NavTranslations（en/zh/ja 现成），
 * 并新增登录区（signIn/getStarted/signOut 等）与 app 站导航键。
 */

export type NavLocale = "en" | "zh" | "ja";

export interface SharedNavTranslations {
  // 公开站页面导航（app 站作为外链回流使用）
  docs: string;
  features: string;
  pricing: string;
  // app 站控制台导航
  dashboard: string;
  billing: string;
  usage: string;
  settings: string;
  // AuthArea 登录区
  signIn: string;
  getStarted: string;
  signOut: string;
  /** 登录后头像的 aria-label / 下拉菜单抬头 */
  account: string;
  /** 登录态加载骨架的 aria-label */
  loadingAccount: string;
}

const sharedNavTranslations: Record<NavLocale, SharedNavTranslations> = {
  en: {
    docs: "Docs",
    features: "Features",
    pricing: "Pricing",
    dashboard: "Dashboard",
    billing: "Billing",
    usage: "Usage",
    settings: "Settings",
    signIn: "Sign in",
    getStarted: "Get Started",
    signOut: "Sign out",
    account: "Account",
    loadingAccount: "Loading account…",
  },
  zh: {
    docs: "文档",
    features: "功能",
    pricing: "定价",
    dashboard: "控制台",
    billing: "账单",
    usage: "用量",
    settings: "设置",
    signIn: "登录",
    getStarted: "开始使用",
    signOut: "退出登录",
    account: "账户",
    loadingAccount: "正在加载账户…",
  },
  ja: {
    docs: "ドキュメント",
    features: "機能",
    pricing: "料金",
    dashboard: "ダッシュボード",
    billing: "請求",
    usage: "使用量",
    settings: "設定",
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
