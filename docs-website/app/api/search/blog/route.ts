import { createI18nSearchAPI } from 'fumadocs-core/search/server';
import type { Index } from 'fumadocs-core/search/server';
import { createTokenizer as createMandarinTokenizer } from '@orama/tokenizers/mandarin';
import { createTokenizer as createJapaneseTokenizer } from '@orama/tokenizers/japanese';
import { blog } from '@/lib/source';
import { i18n } from '@/lib/i18n';

function buildBlogIndexes(): (Index & { locale: string })[] {
  const indexes: (Index & { locale: string })[] = [];

  for (const lang of i18n.languages) {
    for (const page of blog.getPages(lang)) {
      const data = page.data as unknown as Record<string, unknown>;
      const category = (data.category as string) ?? '';
      indexes.push({
        locale: lang,
        title: page.data.title ?? '',
        description: page.data.description ?? '',
        url: page.url,
        breadcrumbs: category ? [category] : [],
        content: page.data.description ?? '',
      });
    }
  }

  return indexes;
}

export const { GET } = createI18nSearchAPI('simple', {
  i18n,
  indexes: buildBlogIndexes(),
  localeMap: {
    en: 'english',
    zh: {
      components: {
        tokenizer: createMandarinTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
    ja: {
      components: {
        tokenizer: createJapaneseTokenizer(),
      },
      search: {
        threshold: 0,
        tolerance: 0,
      },
    },
  },
});
