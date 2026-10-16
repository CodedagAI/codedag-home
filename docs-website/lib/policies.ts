/**
 * 政策页（条款、隐私政策、退款政策）的固定事实与正文。
 *
 * 三份政策各有英文、中文、日文三版，英文是起草与审校的基准，中日由英文译出。
 * 正文在 content/policies/ 下（terms.mdx、terms.zh.mdx、terms.ja.mdx），由
 * app/[lang]/(home)/components/policy-page.tsx 读取；
 * 三种语言共用的法定名称、生效日期和联系邮箱只写在这里，页首由它们渲染，正文不重复写日期。
 * 页脚（客户端组件）也从这里取法定名称，所以本文件不引用只能在服务端加载的模块。
 * legalName、effectiveDate 与 policyContacts 改动时保持 `key: '值'` 的字面值写法，不改成变量或表达式，
 * 以便直接按字面值核对三语正文是否一致。
 */
import type { Mailbox } from '@/components/email';

export const POLICY_KINDS = ['terms', 'privacy', 'refund'] as const;
export type PolicyKind = (typeof POLICY_KINDS)[number];

export const policyFacts = {
  /** 运营 CodeDAG 的公司，三份政策与页脚版权行都用这个名称 */
  legalName: 'Zillion AI LLC',
  /** 三份政策共用的生效日期（YYYY-MM-DD） */
  effectiveDate: '2026-10-16',
} as const;

/** 每份政策对应的联系邮箱，只写 @ 前面的名字 */
export const policyContacts: Record<PolicyKind, Mailbox> = {
  terms: 'legal',
  privacy: 'privacy',
  refund: 'hi',
};

type Locale = 'en' | 'zh' | 'ja';

const labels: Record<Locale, { provider: string; effective: string; contact: string; nav: string }> = {
  en: { provider: 'Provided by', effective: 'Effective', contact: 'Contact', nav: 'Policies' },
  zh: { provider: '提供方', effective: '生效日期', contact: '联系邮箱', nav: '政策' },
  ja: { provider: '提供者', effective: '施行日', contact: 'お問い合わせ', nav: 'ポリシー' },
};

const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function locale(lang: string): Locale {
  return lang === 'zh' || lang === 'ja' ? lang : 'en';
}

export function getPolicyLabels(lang: string) {
  return labels[locale(lang)];
}

/** 按语言写出生效日期。不用 Intl：各运行环境的输出不完全一样，这里要求三处页面逐字稳定 */
export function formatEffectiveDate(lang: string): string {
  const [year, month, day] = policyFacts.effectiveDate.split('-').map(Number);
  switch (locale(lang)) {
    case 'zh':
      return `${year} 年 ${month} 月 ${day} 日`;
    case 'ja':
      return `${year}年${month}月${day}日`;
    default:
      return `${EN_MONTHS[month - 1]} ${day}, ${year}`;
  }
}
