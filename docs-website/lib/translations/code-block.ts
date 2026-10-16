export interface CodeBlockTranslations {
  wrapLines: string;
}

export const codeBlockTranslations: Record<string, CodeBlockTranslations> = {
  en: {
    wrapLines: 'Wrap lines',
  },
  zh: {
    wrapLines: '自动换行',
  },
  ja: {
    wrapLines: '行を折り返す',
  },
};

export function getCodeBlockTranslations(lang: string): CodeBlockTranslations {
  return codeBlockTranslations[lang] || codeBlockTranslations.en;
}
