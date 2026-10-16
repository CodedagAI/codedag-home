export interface PageActionsTranslations {
  copyPage: string;
  copyPageAsMarkdown: string;
  viewAsMarkdown: string;
  editOnGitHub: string;
  askAI: string;
  discussInClaude: string;
  discussInChatGPT: string;
  discussInGoogleAI: string;
  discussInMistral: string;
  discussInDeepSeek: string;
  aiPrompt: (url: string) => string;
}

export const pageActionsTranslations: Record<string, PageActionsTranslations> = {
  en: {
    copyPage: 'Copy Page',
    copyPageAsMarkdown: 'Copy Page as Markdown',
    viewAsMarkdown: 'View as Markdown',
    editOnGitHub: 'Edit on GitHub',
    askAI: 'Ask AI',
    discussInClaude: 'Discuss this page in Claude',
    discussInChatGPT: 'Discuss this page in ChatGPT',
    discussInGoogleAI: 'Discuss this page in Google AI Mode',
    discussInMistral: 'Discuss this page in Mistral',
    discussInDeepSeek: 'Discuss this page in DeepSeek',
    aiPrompt: (url: string) => `Read from ${url} so I can ask questions about it.`,
  },
  zh: {
    copyPage: '复制页面',
    copyPageAsMarkdown: '复制为 Markdown',
    viewAsMarkdown: '查看 Markdown',
    editOnGitHub: '在 GitHub 上编辑',
    askAI: '问 AI',
    discussInClaude: '在 Claude 中讨论此页面',
    discussInChatGPT: '在 ChatGPT 中讨论此页面',
    discussInGoogleAI: '在 Google AI 中讨论此页面',
    discussInMistral: '在 Mistral 中讨论此页面',
    discussInDeepSeek: '在 DeepSeek 中讨论此页面',
    aiPrompt: (url: string) => `请阅读 ${url}，我想询问关于它的问题。`,
  },
  ja: {
    copyPage: 'ページをコピー',
    copyPageAsMarkdown: 'Markdownとしてコピー',
    viewAsMarkdown: 'Markdownで表示',
    editOnGitHub: 'GitHubで編集',
    askAI: 'AIに質問',
    discussInClaude: 'Claudeでこのページについて質問',
    discussInChatGPT: 'ChatGPTでこのページについて質問',
    discussInGoogleAI: 'Google AIでこのページについて質問',
    discussInMistral: 'Mistralでこのページについて質問',
    discussInDeepSeek: 'DeepSeekでこのページについて質問',
    aiPrompt: (url: string) => `${url} を読んでください。質問があります。`,
  },
};

export function getPageActionsTranslations(lang: string): PageActionsTranslations {
  return pageActionsTranslations[lang] || pageActionsTranslations.en;
}
