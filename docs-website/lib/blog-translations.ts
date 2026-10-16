// ── Blog page i18n translations (en / zh / ja) ─────────────────────

export interface BlogTranslations {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
  };
  filters: {
    all: string;
    engineering: string;
    product: string;
    tutorials: string;
    deepDives: string;
    announcements: string;
  };
  featured: {
    badge: string;
    readMore: string;
  };
  card: {
    readMore: string;
    featured: string;
    emptyState: string;
  };
  pagination: {
    previous: string;
    next: string;
    page: string;
    of: string;
  };
  detail: {
    backToBlog: string;
    writtenBy: string;
    publishedOn: string;
    tableOfContents: string;
    previousPost: string;
    nextPost: string;
    share: string;
    copied: string;
    minRead: string;
  };
}

const en: BlogTranslations = {
  hero: {
    title: 'Blog',
    subtitle: 'Insights on AI workflows, developer tools, and building the future of code.',
    badge: 'From the Team',
  },
  filters: {
    all: 'All',
    engineering: 'Engineering',
    product: 'Product',
    tutorials: 'Tutorials',
    deepDives: 'Deep Dives',
    announcements: 'Announcements',
  },
  featured: {
    badge: 'Featured',
    readMore: 'Read article →',
  },
  card: {
    readMore: 'Read more',
    featured: 'Featured',
    emptyState: 'No posts in this category yet.',
  },
  pagination: {
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
  },
  detail: {
    backToBlog: 'Back to Blog',
    writtenBy: 'Written by',
    publishedOn: 'Published on',
    tableOfContents: 'Table of Contents',
    previousPost: 'Previous',
    nextPost: 'Next',
    share: 'Share Post',
    copied: 'Copied URL',
    minRead: 'min read',
  },
};

const zh: BlogTranslations = {
  hero: {
    title: '博客',
    subtitle: '关于 AI 工作流、开发者工具与代码未来的深度洞察。',
    badge: '来自团队',
  },
  filters: {
    all: '全部',
    engineering: '工程',
    product: '产品',
    tutorials: '教程',
    deepDives: '深度解析',
    announcements: '公告',
  },
  featured: {
    badge: '精选',
    readMore: '阅读全文 →',
  },
  card: {
    readMore: '阅读更多',
    featured: '精选',
    emptyState: '该分类暂无文章。',
  },
  pagination: {
    previous: '上一页',
    next: '下一页',
    page: '第',
    of: '/ 共',
  },
  detail: {
    backToBlog: '返回博客',
    writtenBy: '作者',
    publishedOn: '发布于',
    tableOfContents: '目录',
    previousPost: '上一篇',
    nextPost: '下一篇',
    share: '分享',
    copied: '已复制链接',
    minRead: '分钟阅读',
  },
};

const ja: BlogTranslations = {
  hero: {
    title: 'ブログ',
    subtitle: 'AIワークフロー、開発者ツール、コードの未来に関するインサイト。',
    badge: 'チームから',
  },
  filters: {
    all: 'すべて',
    engineering: 'エンジニアリング',
    product: 'プロダクト',
    tutorials: 'チュートリアル',
    deepDives: 'ディープダイブ',
    announcements: 'お知らせ',
  },
  featured: {
    badge: '注目',
    readMore: '記事を読む →',
  },
  card: {
    readMore: '続きを読む',
    featured: '注目',
    emptyState: 'このカテゴリにはまだ記事がありません。',
  },
  pagination: {
    previous: '前へ',
    next: '次へ',
    page: 'ページ',
    of: '/',
  },
  detail: {
    backToBlog: 'ブログに戻る',
    writtenBy: '著者',
    publishedOn: '公開日',
    tableOfContents: '目次',
    previousPost: '前の記事',
    nextPost: '次の記事',
    share: 'シェア',
    copied: 'URLをコピーしました',
    minRead: '分で読めます',
  },
};

const translations: Record<string, BlogTranslations> = { en, zh, ja };

const dateLocaleMap: Record<string, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ja: 'ja-JP',
};

/** Format a date string according to the current locale */
export function formatBlogDate(lang: string, date: string, style: 'short' | 'long' = 'short'): string {
  const locale = dateLocaleMap[lang] ?? 'en-US';
  const d = new Date(date);
  if (style === 'long') {
    return d.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
  }
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getBlogTranslations(lang: string): BlogTranslations {
  return translations[lang] ?? en;
}

const categoryKeyMap: Record<string, keyof BlogTranslations['filters']> = {
  Engineering: 'engineering',
  Product: 'product',
  Tutorials: 'tutorials',
  'Deep Dives': 'deepDives',
  Announcements: 'announcements',
};

/** Estimate reading time in minutes from a description (rough heuristic for blog cards). */
export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

/** Translate a raw category value (from MDX frontmatter) to the current locale label. */
export function translateCategory(lang: string, category: string): string {
  const t = getBlogTranslations(lang);
  const key = categoryKeyMap[category];
  return key ? t.filters[key] : category;
}
