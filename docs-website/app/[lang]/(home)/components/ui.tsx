import { Fragment, type ComponentProps, type ReactNode } from 'react';
import Link from 'fumadocs-core/link';
import type { Beats as BeatsValue, Heading } from '@/lib/homepage-translations';
import type { Entry } from '@/lib/site-mode';
import { TrackedAnchor, TrackedLink, type TrackEvent } from '@/components/tracked-link';
import { cn } from '@/lib/cn';

// 不写 outline-none：Tailwind v4 里它会把 --tw-outline-style 设为 none，
// 连带让 focus-visible:outline-2 也画不出来
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export function Container({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1200px] px-5 sm:px-8', className)}
      {...props}
    />
  );
}

/** 标题里带记号的词：反引号或星号，连同两边的记号 */
const MARKED = /(`[^`]+`|\*[^*]+\*)/;

/**
 * 两拍标题。第一拍用正文色，后面的用次要色；每一拍是一个整体，折行先落在两拍之间。
 * 分段写的一拍，拍内只在段与段之间折行。
 * 反引号里的词按代码排，星号里的词用品牌紫。onStage 为真时换成舞台上的两档文字色。
 * even 为真时各拍同色：首屏标题两行一样重，带色的只有星号里的词。
 */
export function Beats({
  value,
  onStage = false,
  even = false,
}: {
  value: BeatsValue;
  onStage?: boolean;
  even?: boolean;
}) {
  const first = onStage ? 'text-stage-ink' : 'text-home-ink';
  const muted = onStage ? 'text-stage-muted' : 'text-home-muted';
  const rest = even ? first : muted;
  return (
    <>
      {value.map((beat, i) => (
        <Fragment key={i}>
          {i > 0 && needsSpace(beatText(value[i - 1]), beatText(beat)) ? ' ' : null}
          <span className={cn('home-beat', i === 0 ? first : rest)}>
            {typeof beat === 'string'
              ? marked(beat)
              : beat.map((chunk, j) => (
                  <Fragment key={j}>
                    {j > 0 && needsSpace(beat[j - 1], chunk) ? ' ' : null}
                    <span className="inline-block">{marked(chunk)}</span>
                  </Fragment>
                ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** 一拍的全文：分段写的连起来 */
function beatText(beat: Heading): string {
  return typeof beat === 'string' ? beat : beat.join('');
}

/** 标题文字：反引号里的词按代码排，星号里的词用品牌紫 */
function marked(text: string): ReactNode {
  return text.split(MARKED).map((part, j) => {
    if (j % 2 === 0) return part;
    const word = part.slice(1, -1);
    return part.startsWith('`') ? (
      <code key={j}>{word}</code>
    ) : (
      <span key={j} className="home-beat-name">
        {word}
      </span>
    );
  });
}

/** 相邻两段落在同一行时，中间要不要补一个空格：西文之间要，中日文标点之后不要 */
export function needsSpace(prev: string, next: string): boolean {
  const latin = /[A-Za-z0-9.,;:!?'’)`]/;
  const prevEnd = prev.slice(-1);
  if (latin.test(prevEnd)) return true;
  // 前一段以中日文标点收尾时不补
  return /[A-Za-z0-9]/.test(next.charAt(0)) && /[\p{L}\p{N}]/u.test(prevEnd);
}

/**
 * 标题文字。分段数组里的每一段不在内部换行，
 * 中文和日文标题靠它把折行落在意群之间。
 */
export function HeadingText({ value }: { value: Heading }) {
  if (typeof value === 'string') return <>{value}</>;
  return (
    <>
      {value.map((chunk, i) => (
        <Fragment key={i}>
          {i > 0 && needsSpace(value[i - 1], chunk) ? ' ' : null}
          <span className="inline-block">{chunk}</span>
        </Fragment>
      ))}
    </>
  );
}

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
/** 不换行空格。写成字符码，源码里不留看不见的字符 */
const NBSP = String.fromCharCode(0xa0);

/** 中文正文里反复出现的词：产品与工程术语在前，其余是页面上常落在行尾的常用词 */
const ZH_WORDS =
  '任务|工作流|工作区|集成分支|主分支|分支|会话|额度|仓库|依赖|副本|编排|引擎' +
  '|调度|上游|下游|拓扑序|并行|串行|节点|合并|冲突|上下文|确定性|审查|修复' +
  '|项目|电脑|自己|运行|完成|进度|改动|操作|路径|处理器|下一个|下一步|第一个|或者|它们';

/**
 * 正文里不该被拆到两行的地方：
 * - 上面这些中文词；“的”和它前面的字（不让“的”落到行首），后面跟着标点时连标点一起；
 * - 日文按文节折行时会被从中间拆开的词，连体词和它后面的名词；
 * - 带两个以上连字符的标识符（approve-for-me、spec-to-code）和两个示例名；
 * - 中日文里几个字的括注，连同两边的括号；
 * - 中日文里十来个字的短句整句不拆（“随时看，直接纠正。”）：几个短句连排时，折行落在句与句之间；
 * - 痛点正文里“谁等谁、该推进谁”这一个分句：它所在的句子刚超出上一条的字数，不绑会在头一个“谁”后面断开；
 * - 中日文句末的两个字连同句号：长句折行时，下一行不会以“实。”这样的一个字开头。
 */
const KEEP = new RegExp(
  `((?:^|(?<=[。！？]))[^。！？]{3,13}[。！？]` +
    `|[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}]{2}[。！？]` +
    `|（[^（）]{1,8}）|(?:${ZH_WORDS}|\\p{Script=Han})的[：，。；、]?|${ZH_WORDS}` +
    '|谁等谁、该推进谁' +
    '|差し引|つにつき|いくつか|やり取り|バックグラウンド|バージョン|といった|一時停止|もう一度|その都度' +
    '|プロンプト|コンテキスト|スケジュール|スケジューラー|トポロジカル|決定論的|依存関係' +
    '|これまでどおり|(?:この|その|どの|あの)[\\p{Script=Katakana}\\p{Script=Han}]' +
    '|[a-z]+(?:-[a-z]+){2,}|refactor-review|request-changes)',
  'u',
);

/** 正文：KEEP 匹配到的每一处各自包成不换行的一段 */
export function prose(text: string): ReactNode {
  const parts = text.split(KEEP);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * 段落文字：在 prose() 之上，末尾几个字（西文是最后两个词）不拆开，
 * 最后一行不会只剩一两个字或一个词。max 是整句不拆时允许的最长字数，
 * 行宽有保证的地方（旁白、图注）可以给大一些。
 */
export function tail(text: string, max = 16): ReactNode {
  const chars = Array.from(text);
  if (chars.length < 12) return prose(text);

  if (!CJK.test(text)) {
    const cut = text.lastIndexOf(' ');
    // 最后两个词合起来太长时不绑，免得窄屏上撑出一整行
    if (cut < 0 || text.length - text.lastIndexOf(' ', cut - 1) > 26) return prose(text);
    return prose(text.slice(0, cut) + NBSP + text.slice(cut + 1));
  }

  // 最后一句（或最后一个分句）很短时整段不拆，折行落在标点之后
  const after = (marks: string[]) =>
    Math.max(...marks.map((mark) => chars.lastIndexOf(mark, chars.length - 2))) + 1;
  const fits = (from: number) => from > 0 && chars.length - from >= 4 && chars.length - from <= max;
  const sentence = after(['。', '！', '？']);
  const clause = after(['。', '！', '？', '，', '、', '；', '：']);
  let start = fits(sentence) ? sentence : fits(clause) ? clause : -1;

  // 日文到此为止：按字数切会切在词中间，折行交给浏览器的文节折行
  if (start < 0 && /[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)) return prose(text);

  // 中文从末尾往回数五个字（一个西文词算一个字，标点和空格不算）；
  // 八个字之内遇到标点或开括号，就停在那里，不从词中间切开
  if (start < 0) {
    const latin = /[A-Za-z0-9]/;
    let units = 0;
    let five = 0;
    start = chars.length;
    while (start > 0 && units < 8) {
      const prev = chars[start - 1];
      if (units >= 3 && /[，、；：]/.test(prev)) break;
      start--;
      if (units >= 3 && /[（「“『]/.test(prev)) break;
      if (latin.test(prev)) {
        while (start > 0 && latin.test(chars[start - 1])) start--;
        units++;
      } else if (CJK.test(prev)) {
        units++;
      }
      if (units === 5 && five === 0) five = start;
    }
    if (units >= 8) start = five;
    // 数词、指示词和它后面的量词不分开：一次、第一个、这几个
    while (start > 0 && /[一二两三几第每这那]/.test(chars[start - 1])) start--;
    // 末尾这一段不以“的”开头：“的”留给前面的词，折行落在它后面
    if (chars[start] === '的') start++;
  }
  if (chars.length - start > Math.max(16, max)) return prose(text);
  return (
    <>
      {prose(chars.slice(0, start).join(''))}
      <span className="whitespace-nowrap">{chars.slice(start).join('')}</span>
    </>
  );
}

/**
 * 两三句的中日文短说明：每一句是一个整体，放不下就整句另起一行，折行落在句与句之间；
 * 一行放不下的长句在自己里面照 tail() 折行。只有一句的和西文的照常连排。
 */
export function sentences(text: string, max?: number): ReactNode {
  const parts = CJK.test(text) ? text.match(/[^。！？]+[。！？]?/g) : null;
  if (!parts || parts.length < 2) return tail(text, max);
  return parts.map((part, i) => (
    <span key={i} className="inline-block">
      {tail(part, max)}
    </span>
  ));
}

/** 主行动按钮：目标与文案来自 lib/site-mode 的入口，点击时上报 cta 事件 */
export function EntryButton({
  entry,
  className,
}: {
  entry: Entry;
  className?: string;
}) {
  // /waitlist 是服务端跳转路由，用原生链接，不走客户端路由预取
  return (
    <TrackedAnchor
      href={entry.href}
      className={cn('home-cta', focusRing, className)}
      event="cta"
      source={entry.source}
    >
      {entry.label}
    </TrackedAnchor>
  );
}

/**
 * 文字链接。onStage 为真时用舞台上的文字色，悬停时下划线从引擎紫变成文字色
 * （舞台随主题变化，悬停态不能写死成白）。
 * solo 用在独占一行的链接上：样子不变，可点的范围向四周扩出去，手指点得中。
 * track 有值时，点击上报这个事件。
 */
export function TextLink({
  href,
  children,
  className,
  onStage = false,
  solo = false,
  track,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onStage?: boolean;
  solo?: boolean;
  track?: TrackEvent;
}) {
  const linkClass = textLinkClass({ className, onStage, solo });
  if (track) {
    return (
      <TrackedLink href={href} className={linkClass} event={track.event} source={track.source}>
        {children}
      </TrackedLink>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

/** 文字链接的样式。不经 TextLink 输出、但要画成同一个样子的链接（邮箱地址）也用它 */
export function textLinkClass({
  className,
  onStage = false,
  solo = false,
}: { className?: string; onStage?: boolean; solo?: boolean } = {}) {
  return cn(
    'rounded-sm font-medium underline decoration-1 underline-offset-[5px] transition-colors',
    onStage
      ? 'text-stage-ink decoration-engine hover:decoration-stage-ink'
      : 'text-home-ink decoration-home-accent hover:text-home-accent',
    solo ? 'home-link-solo' : null,
    focusRing,
    className,
  );
}
