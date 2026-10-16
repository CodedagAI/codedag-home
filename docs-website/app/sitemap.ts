import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { i18n } from '@/lib/i18n';
import { source } from '@/lib/source';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /**
   * Generate URL with proper language prefix
   * - Default language (en): no prefix
   * - Other languages: with prefix
   */
  const url = (path: string, lang: string): string => {
    const prefix = lang === i18n.defaultLanguage ? '' : `/${lang}`;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    // The home page of a prefixed language is /zh, not /zh/ (same as the canonical URL)
    return `${siteConfig.baseUrl}${prefix}${normalizedPath === '/' && prefix ? '' : normalizedPath}`;
  };

  const items: MetadataRoute.Sitemap = [];

  // Generate sitemap entries for all languages
  for (const lang of i18n.languages) {
    const pages = source.getPages(lang);

    for (const page of pages) {
      if (page.data.type === 'openapi') continue;

      try {
        const { lastModified } = await page.data.load();

        // Remove language prefix from page.url if present
        const pathWithoutLang = page.url.replace(/^\/(en|zh|ja)/, '') || '/';

        items.push({
          url: url(pathWithoutLang, lang),
          lastModified: lastModified ? new Date(lastModified) : undefined,
          changeFrequency: 'weekly',
          priority: 0.5,
        });
      } catch {
        // Skip pages that fail to load
      }
    }

    // Add static pages for each language. /docs only redirects to the overview
    // page and /waitlist only redirects to the form, so neither is listed.
    const staticPages = [
      { path: '/', priority: 1, changeFrequency: 'monthly' as const },
      { path: '/pricing', priority: 0.8, changeFrequency: 'monthly' as const },
      { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
      { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
      { path: '/refund', priority: 0.3, changeFrequency: 'yearly' as const },
    ];

    for (const page of staticPages) {
      items.push({
        url: url(page.path, lang),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return items;
}
