/**
 * 文档页模板里的固定文案：标题下方的内测提示，和页面底部的“反馈这一页的问题”链接。
 */

export interface DocsPageTranslations {
  /**
   * 内测提示，只在 waitlist 模式下显示。链接文字取入口模块的 Waitlist 文案
   * （lib/site-mode.ts），before 与 after 是链接前后的文字。
   */
  betaNotice: {
    before: string;
    after: string;
  };
  reportIssue: {
    label: string;
    /** 新建 Issue 时预填的标题 */
    issueTitle: (pageTitle: string) => string;
    /** 新建 Issue 时预填的正文，pageUrl 是这一页的正式地址 */
    issueBody: (pageUrl: string) => string;
  };
}

const translations: Record<'en' | 'zh' | 'ja', DocsPageTranslations> = {
  en: {
    betaNotice: {
      before:
        "The private beta opens soon, and CodeDAG isn't available to install yet. ",
      after: ' to get in line for an invite.',
    },
    reportIssue: {
      label: 'Report an issue with this page',
      issueTitle: (pageTitle) => `Docs: ${pageTitle}`,
      issueBody: (pageUrl) => `Page: ${pageUrl}\n\nWhat's wrong or unclear:\n\n`,
    },
  },
  zh: {
    betaNotice: {
      before: '内测即将开始，CodeDAG 暂未开放安装。可以先',
      after: '，邀请会分批通过邮件发出。',
    },
    reportIssue: {
      label: '反馈这一页的问题',
      issueTitle: (pageTitle) => `文档：${pageTitle}`,
      issueBody: (pageUrl) => `页面：${pageUrl}\n\n问题描述：\n\n`,
    },
  },
  ja: {
    betaNotice: {
      before:
        'プライベートベータはまもなく開始します。CodeDAG はまだインストールできません。',
      after: 'しておくと、招待を順次メールでお送りします。',
    },
    reportIssue: {
      label: 'このページの問題を報告',
      issueTitle: (pageTitle) => `ドキュメント：${pageTitle}`,
      issueBody: (pageUrl) => `ページ：${pageUrl}\n\n問題の内容：\n\n`,
    },
  },
};

export function getDocsPageTranslations(lang: string): DocsPageTranslations {
  return translations[lang as keyof typeof translations] ?? translations.en;
}
