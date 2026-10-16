import { i18n } from './i18n';
import { siteConfig } from './config';

/**
 * Get the URL prefix for a given language
 * - Default language (en): no prefix
 * - Other languages: has prefix (e.g., /zh, /ja)
 */
export function getLanguagePrefix(lang: string): string {
  return lang === i18n.defaultLanguage ? '' : `/${lang}`;
}

/**
 * Generate a full URL with domain
 * @param path - The path (e.g., /docs/overview)
 * @param lang - Optional language code
 */
export function getFullUrl(path: string, lang?: string): string {
  const prefix = lang ? getLanguagePrefix(lang) : '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.baseUrl}${prefix}${normalizedPath}`;
}

/**
 * Generate a relative URL without domain
 * @param path - The path (e.g., /docs/overview)
 * @param lang - Optional language code
 */
export function getRelativeUrl(path: string, lang?: string): string {
  const prefix = lang ? getLanguagePrefix(lang) : '';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${prefix}${normalizedPath}`;
}

/**
 * Remove language prefix from a URL path
 * @param path - The path that may contain a language prefix
 */
export function removeLanguagePrefix(path: string): string {
  const langPattern = new RegExp(`^/(${i18n.languages.join('|')})`);
  return path.replace(langPattern, '') || '/';
}
