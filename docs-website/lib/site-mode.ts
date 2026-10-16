/**
 * 主页模式与入口。
 *
 * 模式由构建期变量 NEXT_PUBLIC_SITE_MODE 决定，值写在入库的 .env.production 里：
 * - waitlist：只收集 Waitlist 申请，页面不访问也不链接 App 站
 * - beta：内测，导航栏出现登录，主行动按钮仍进入 Waitlist
 * - live：正式开放，入口指向 App 的账号入口与结账流程
 *
 * 所有页面的登录、开始使用、订阅入口都从这里取目标与文案，
 * 页面和组件里不直接写 App 地址或 Waitlist 地址。
 */

import { siteConfig } from './config';
import { i18n } from './i18n';

export const SITE_MODES = ['waitlist', 'beta', 'live'] as const;
export type SiteMode = (typeof SITE_MODES)[number];

export function resolveSiteMode(raw: string | undefined): SiteMode {
  if (raw === undefined || raw === '') return 'waitlist';
  if ((SITE_MODES as readonly string[]).includes(raw)) return raw as SiteMode;
  throw new Error(
    `Invalid NEXT_PUBLIC_SITE_MODE "${raw}". Expected one of: ${SITE_MODES.join(', ')}.`,
  );
}

export const siteMode: SiteMode = resolveSiteMode(
  process.env.NEXT_PUBLIC_SITE_MODE,
);

/** 入口位置，随链接带到 /waitlist 的 source 参数里，也是点击事件唯一带的属性 */
export type EntrySource =
  | 'nav'
  | 'nav-menu'
  | 'home-hero'
  | 'home-cta'
  | 'pricing-plan'
  | 'pricing-cta'
  | 'docs';

export type BillingCycle = 'monthly' | 'yearly';

export interface Entry {
  href: string;
  label: string;
  /** true 表示离开公开站（指向 App 站） */
  external: boolean;
  /** 入口位置，点击时随 cta 事件上报 */
  source: EntrySource;
}

type EntryLocale = 'en' | 'zh' | 'ja';

interface EntryLabels {
  joinWaitlist: string;
  requestBeta: string;
  getStarted: string;
  signIn: string;
  subscribe: string;
}

const labels: Record<EntryLocale, EntryLabels> = {
  en: {
    joinWaitlist: 'Join the waitlist',
    requestBeta: 'Request beta access',
    getStarted: 'Get started',
    signIn: 'Sign in',
    subscribe: 'Subscribe',
  },
  zh: {
    joinWaitlist: '加入 Waitlist',
    requestBeta: '申请内测',
    getStarted: '开始使用',
    signIn: '登录',
    subscribe: '订阅',
  },
  ja: {
    joinWaitlist: 'ウェイトリストに登録',
    requestBeta: 'ベータ版に申し込む',
    getStarted: '使ってみる',
    signIn: 'ログイン',
    subscribe: 'サブスクリプションに登録',
  },
};

function getLabels(locale: string): EntryLabels {
  return labels[locale as EntryLocale] ?? labels.en;
}

function waitlistHref(locale: string, source: EntrySource): string {
  const prefix = locale === i18n.defaultLanguage ? '' : `/${locale}`;
  return `${prefix}/waitlist?source=${source}`;
}

function appLoginHref(): string {
  return `${siteConfig.appUrl}/login`;
}

/** 主行动按钮：首页等处的“加入 Waitlist / 申请内测 / 开始使用” */
export function getStartEntry(locale: string, source: EntrySource): Entry {
  const t = getLabels(locale);
  switch (siteMode) {
    case 'waitlist':
      return { href: waitlistHref(locale, source), label: t.joinWaitlist, external: false, source };
    case 'beta':
      return { href: waitlistHref(locale, source), label: t.requestBeta, external: false, source };
    case 'live':
      return { href: appLoginHref(), label: t.getStarted, external: true, source };
  }
}

/** 登录入口：waitlist 模式没有登录入口 */
export function getSignInEntry(locale: string, source: EntrySource): Entry | null {
  if (siteMode === 'waitlist') return null;
  return { href: appLoginHref(), label: getLabels(locale).signIn, external: true, source };
}

/** 定价页的订阅按钮：live 进入 App 结账流程，其余进入 Waitlist */
export function getSubscribeEntry(
  locale: string,
  source: EntrySource,
  billing: BillingCycle,
): Entry {
  if (siteMode === 'live') {
    return {
      href: `${siteConfig.appUrl}/checkout?plan=pro&billing=${billing}`,
      label: getLabels(locale).subscribe,
      external: true,
      source,
    };
  }
  return getStartEntry(locale, source);
}
