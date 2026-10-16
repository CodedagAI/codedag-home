import { siteConfig } from '@/lib/config';

/** 对外公布的邮箱，@ 前面的部分：一般联系、条款、隐私 */
export type Mailbox = 'hi' | 'legal' | 'privacy';

/** 每个字符换成一个十进制的字符实体 */
function entities(text: string): string {
  return Array.from(text, (ch) => `&#${ch.codePointAt(0)};`).join('');
}

/**
 * 页面上的邮箱地址。看上去、用起来和普通的邮件链接一样；HTML 源码里地址和链接的每个字符都是一个字符实体，
 * 搜不到完整的 name@domain，批量收集地址的爬虫大多认不出来。
 * 整个链接作为一段 HTML 输出：经 React 的属性输出时 & 会被转义，实体就失效了；
 * 这样写，页面里内嵌的 RSC 数据留下的也是编码后的字符串。
 * 完整的地址只在这里拼出来：页面、文案和 MDX 里都只写 @ 前面的名字。
 */
export function Email({ user, className }: { user: Mailbox; className?: string }) {
  const address = `${user}@${siteConfig.emailDomain}`;
  const classAttr = className
    ? ` class="${className.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`
    : '';
  const html = `<a href="${entities(`mailto:${address}`)}"${classAttr}>${entities(address)}</a>`;
  return <span className="contents" dangerouslySetInnerHTML={{ __html: html }} />;
}
