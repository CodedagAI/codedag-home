/**
 * Translations for navbar and footer
 */

export type SupportedLocale = 'en' | 'zh' | 'ja';

export interface NavTranslations {
  features: string;
  pricing: string;
  docs: string;
  // Docs dropdown menu
  // 标题与目标文档页的 title 一致（CLI 一项简写为“命令总览”）；说明是导航栏专用的短句
  docsOverview: string;
  docsOverviewDesc: string;
  howItWorks: string;
  howItWorksDesc: string;
  writingWorkflows: string;
  writingWorkflowsDesc: string;
  cliOverview: string;
  cliOverviewDesc: string;
  designPhilosophy: string;
  designPhilosophyDesc: string;
}

export interface NotFoundTranslations {
  title: string;
  pageNotFound: string;
  findingAlternatives: string;
  noAlternativeFound: string;
  maybeYouAreLookingFor: string;
  returnToHome: string;
}

export interface SidebarTranslations {
  builtWithFumadocs: string;
}

export interface FooterTranslations {
  // Section titles
  product: string;
  resources: string;
  legal: string;
  contact: string;
  // Product links
  features: string;
  pricing: string;
  // Resources links
  docs: string;
  designPhilosophy: string;
  reference: string;
  releaseNotes: string;
  // Legal links
  termsOfService: string;
  privacyPolicy: string;
  refundPolicy: string;
  // Contact links
  getHelp: string;
  issues: string;
  // Copyright: the text after the owner's name, including its leading punctuation or space
  allRightsReserved: string;
}

export interface Translations {
  nav: NavTranslations;
  notFound: NotFoundTranslations;
  sidebar: SidebarTranslations;
  footer: FooterTranslations;
}

const translations: Record<SupportedLocale, Translations> = {
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      docs: 'Docs',
      docsOverview: 'Overview',
      docsOverviewDesc: 'What CodeDAG does and how it works.',
      howItWorks: 'How CodeDAG Works',
      howItWorksDesc: 'How tasks are queued, run, and handed back to you.',
      writingWorkflows: 'Write a Workflow File',
      writingWorkflowsDesc: 'Start from the minimal structure and validate before submitting.',
      cliOverview: 'CLI Overview',
      cliOverviewDesc: 'Find CodeDAG commands by what you want to do.',
      designPhilosophy: 'Design Philosophy',
      designPhilosophyDesc: 'The eight principles behind CodeDAG, and what these choices cost.',
    },
    notFound: {
      title: 'Not Found',
      pageNotFound: 'Page not found',
      findingAlternatives: 'Finding Alternatives...',
      noAlternativeFound: 'No Alternative Found',
      maybeYouAreLookingFor: 'Maybe you are looking for',
      returnToHome: 'Return to Home',
    },
    sidebar: {
      builtWithFumadocs: 'Site built with {fumadocs}',
    },
    footer: {
      product: 'Product',
      resources: 'Resources',
      legal: 'Legal',
      contact: 'Contact',
      features: 'Features',
      pricing: 'Pricing',
      docs: 'Docs',
      designPhilosophy: 'Design Philosophy',
      reference: 'CLI Reference',
      releaseNotes: 'Release Notes',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      refundPolicy: 'Refund Policy',
      getHelp: 'Get help',
      issues: 'Report an issue',
      allRightsReserved: '. All rights reserved.',
    },
  },
  zh: {
    nav: {
      features: '功能',
      pricing: '定价',
      docs: '文档',
      docsOverview: '概览',
      docsOverviewDesc: '了解 CodeDAG 做什么、怎样运作。',
      howItWorks: '工作原理',
      howItWorksDesc: '任务怎样排队、执行，再把结果交还给你。',
      writingWorkflows: '编写工作流文件',
      writingWorkflowsDesc: '从最小结构写起，提交前先校验。',
      cliOverview: '命令总览',
      cliOverviewDesc: '按操作查找 CodeDAG 命令。',
      designPhilosophy: '设计理念',
      designPhilosophyDesc: 'CodeDAG 背后的八条理念，以及这些取舍的代价。',
    },
    notFound: {
      title: '404',
      pageNotFound: '当前页面不存在，请检查访问地址',
      findingAlternatives: '正在查找相关内容...',
      noAlternativeFound: '未找到相关内容',
      maybeYouAreLookingFor: '您可能在找',
      returnToHome: '返回首页',
    },
    sidebar: {
      builtWithFumadocs: '此站基于 {fumadocs} 构建',
    },
    footer: {
      product: '产品',
      resources: '资源',
      legal: '法律',
      contact: '联系',
      features: '功能',
      pricing: '定价',
      docs: '文档',
      designPhilosophy: '设计理念',
      reference: '命令参考',
      releaseNotes: '发布说明',
      termsOfService: '服务条款',
      privacyPolicy: '隐私政策',
      refundPolicy: '退款政策',
      getHelp: '获取帮助',
      issues: '反馈问题',
      allRightsReserved: ' 保留所有权利',
    },
  },
  ja: {
    nav: {
      features: '機能',
      pricing: '料金',
      docs: 'ドキュメント',
      docsOverview: '概要',
      docsOverviewDesc: 'CodeDAG の役割と仕組みを知る。',
      howItWorks: 'CodeDAG の仕組み',
      howItWorksDesc: 'タスクがキューに入り、実行され、結果が戻るまで。',
      writingWorkflows: 'ワークフローファイルを書く',
      writingWorkflowsDesc: '最小構成から書き、投入前に検証する。',
      cliOverview: 'コマンド一覧',
      cliOverviewDesc: '操作から CodeDAG のコマンドを探す。',
      designPhilosophy: '設計理念',
      designPhilosophyDesc: 'CodeDAG を支える 8 つの理念と、それぞれのトレードオフ。',
    },
    notFound: {
      title: 'ページが見つかりません',
      pageNotFound: 'ページが存在しません',
      findingAlternatives: '関連コンテンツを検索中...',
      noAlternativeFound: '関連コンテンツが見つかりません',
      maybeYouAreLookingFor: 'お探しのページ',
      returnToHome: 'ホームに戻る',
    },
    sidebar: {
      builtWithFumadocs: '{fumadocs} で構築されたサイト',
    },
    footer: {
      product: '製品',
      resources: 'リソース',
      legal: '法的情報',
      contact: 'お問い合わせ',
      features: '機能',
      pricing: '料金',
      docs: 'ドキュメント',
      designPhilosophy: '設計理念',
      reference: 'コマンドリファレンス',
      releaseNotes: 'リリースノート',
      termsOfService: '利用規約',
      privacyPolicy: 'プライバシーポリシー',
      refundPolicy: '返金ポリシー',
      getHelp: 'サポートを受ける',
      issues: '問題を報告',
      allRightsReserved: '. All rights reserved.',
    },
  },
};

export function getTranslations(locale: string): Translations {
  const lang = (locale || 'en') as SupportedLocale;
  return translations[lang] || translations.en;
}

export function getNavTranslations(locale: string): NavTranslations {
  return getTranslations(locale).nav;
}

export function getNotFoundTranslations(locale: string): NotFoundTranslations {
  return getTranslations(locale).notFound;
}

export function getSidebarTranslations(locale: string): SidebarTranslations {
  return getTranslations(locale).sidebar;
}

export function getFooterTranslations(locale: string): FooterTranslations {
  return getTranslations(locale).footer;
}
