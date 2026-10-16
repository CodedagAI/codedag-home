import { siteConfig } from '@/lib/config';
import { type Page } from '@/lib/source';

/**
 * 正文里的邮箱是 <Email user="hi" /> 这样的组件，纯文本里读不出地址。
 * 换成 hi (at) codedag.com：模型和人都读得懂，文本里仍没有可以直接收走的完整地址。
 */
function spellOutEmails(text: string): string {
  return text.replace(/<Email user="([a-z]+)"\s*\/>/g, `$1 (at) ${siteConfig.emailDomain}`);
}

export async function getLLMText(page: Page) {
  if (page.data.type === 'openapi') return '';

  const processed = spellOutEmails(await page.data.getText('processed'));

  return `# CodeDAG Documentation: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/CodedagAI/codedag-home/refs/heads/main/docs-website/content/docs/${page.path}

${page.data.description ?? ''}

${processed}`;
}
