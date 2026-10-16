import type { Metadata } from 'next/types';
import { Page } from './source';
import { siteConfig } from './config';

/**
 * Generate hreflang alternates for SEO
 * - x-default: no prefix (points to English)
 * - en: no prefix
 * - zh: /zh prefix
 * - ja: /ja prefix
 *
 * Pass `lang` to make the canonical URL point at that language's own page;
 * without it the canonical is the default-language URL.
 */
export function generateAlternates(path: string, lang?: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // The home page of a prefixed language is /zh, not /zh/
  const localized = (prefix: string) =>
    `${siteConfig.baseUrl}${prefix}${normalizedPath === '/' && prefix ? '' : normalizedPath}`;
  const prefix = lang && lang !== siteConfig.defaultLanguage ? `/${lang}` : '';

  return {
    canonical: localized(prefix),
    languages: {
      'x-default': localized(''),
      'en': localized(''),
      'zh': localized('/zh'),
      'ja': localized('/ja'),
    },
  };
}

/** 默认分享图（1200×630，英文），页面没有自己的分享图时使用 */
const DEFAULT_SHARE_IMAGE = '/og.png';

/** 另有本语言版本的分享图：图上是该语言的首页标题 */
const LOCALIZED_SHARE_IMAGES: Partial<Record<string, string>> = {
  zh: '/og-zh.png',
  ja: '/og-ja.png',
};

/** 按语言取分享图，没有本语言版本时用默认的英文图 */
export function shareImage(lang: string): string {
  return LOCALIZED_SHARE_IMAGES[lang] ?? DEFAULT_SHARE_IMAGE;
}

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: siteConfig.baseUrl,
      images: DEFAULT_SHARE_IMAGE,
      siteName: siteConfig.siteName,
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: DEFAULT_SHARE_IMAGE,
      ...override.twitter,
    },
  };
}

/**
 * 文档页的分享图：英文的在 /og/<slugs>/image.webp，中文、日文的在 /og/zh/…、/og/ja/… 下，
 * 图上是该语言的标题和描述。app/og/[...slug]/route.tsx 按同样的规则把地址解析回页面。
 */
export function getPageImage(page: Page) {
  const prefix =
    page.locale && page.locale !== siteConfig.defaultLanguage ? [page.locale] : [];
  const segments = [...prefix, ...page.slugs, 'image.webp'];

  return {
    segments,
    url: `/og/${segments.join('/')}`,
  };
}

/**
 * 元数据里相对地址（规范地址、分享图）的基地址。开发时没有设置
 * NEXT_PUBLIC_BASE_URL 用本机地址；其余情况与 siteConfig.baseUrl 相同，
 * 生产构建没有设置时是 https://codedag.com。
 */
export const baseUrl = new URL(
  process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_BASE_URL
    ? 'http://localhost:3000'
    : siteConfig.baseUrl,
);
