'use client';

import { RootProvider } from 'fumadocs-ui/provider/base';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const SearchDialog = dynamic(() => import('@/components/search'), {
  ssr: false,
});

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
    },
    zh: {
      displayName: '中文',
      search: '搜索文档',
      searchNoResult: '没有找到结果',
      toc: '目录',
      tocNoHeadings: '没有标题',
      lastUpdate: '最后更新',
      chooseTheme: '选择主题',
      nextPage: '下一页',
      previousPage: '上一页',
      chooseLanguage: '选择语言',
    },
    ja: {
      displayName: '日本語',
      search: '検索',
      searchNoResult: '結果が見つかりません',
      toc: '目次',
      tocNoHeadings: '見出しなし',
      lastUpdate: '最終更新',
      chooseTheme: 'テーマを選択',
      nextPage: '次のページ',
      previousPage: '前のページ',
      chooseLanguage: '言語を選択',
    },
  },
});

export function I18nProvider({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  return (
    <RootProvider
      i18n={provider(lang)}
      search={{
        SearchDialog,
      }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </RootProvider>
  );
}
