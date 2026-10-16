import type { CSSProperties, ReactNode } from 'react';
import Link from 'fumadocs-core/link';
import type { AgentId, HomepageTranslations } from '@/lib/homepage-translations';
import { cn } from '@/lib/cn';
import { BranchLines, type Segment } from './branch-lines';
import { Reveal } from './reveal';
import { AgentTag, Stage } from './stage';
import { Beats, Container, focusRing, needsSpace, sentences, tail } from './ui';

const ENGINE = 'var(--engine)';
const CLAUDE = 'var(--agent-claude)';
const CODEX = 'var(--agent-codex)';
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * 播放顺序，毫秒，照一次运行里事情发生的先后。先是本机上的三样：仓库、两个 Agent、cdg。
 * 然后 cdg 连到 CodeDAG 账号服务：点线、沿线走的光点、那张卡片。
 * 接着 cdg 启动两个 Agent 的会话；再是两个 Agent 各自直连模型服务。
 * 一条线画完，下一条才开始。最后停在没有发出去的三样东西上。
 */
const AT = {
  repo: 0,
  agents: 100,
  cdg: 250,
  service: 450,
  serviceMark: 550,
  card: 1050,
  discard: 1200,
  rail: 1450,
  starts: 1800,
  out: 2300,
  outMark: 2850,
  providers: 2950,
  kept: 3300,
  keptItems: [3380, 3460, 3540],
};

/* ── 宽舞台：左边是你的电脑，右边是两处外部服务，1088×360 ── */

/**
 * 桌面上图通栏，舞台里正好 1088px 宽，坐标和像素一比一；图是一条矮带，
 * 连标题和下面三条说明不高过笔记本的一屏。
 * wall 是本机右边那条竖边：出这台电脑的线都从它上面穿过去；cards 是右边两张卡片的左缘
 */
const W = { width: 1088, height: 360, wall: 620, cards: 704 };

/** 两个 Agent、cdg 三处的纵坐标：线、出口和卡片都按它们对齐 */
const Y = { claude: 118, codex: 172, cdg: 274 };

/** 两条 Agent 的线各自一路水平，穿过墙直着进到模型服务的卡片，不拐弯；cdg 的线只伸到两个 Agent 的左缘 */
const WIDE_SEGMENTS: Segment[] = [
  { d: `M74 ${Y.claude}H${W.cards + 2}`, color: CLAUDE, at: AT.out },
  { d: `M74 ${Y.codex}H${W.cards + 2}`, color: CODEX, at: AT.out },
  { d: `M46 ${Y.cdg}V${Y.claude + 12}C46 ${Y.claude + 5} 51 ${Y.claude} 58 ${Y.claude}H74`, color: ENGINE, at: AT.rail },
  { d: `M46 ${Y.codex}H74`, color: ENGINE, at: AT.rail },
];

/** cdg 到 CodeDAG 账号服务：一条细点线，和 Agent 的线不是一种东西 */
const WIDE_SERVICE = `M22 ${Y.cdg}H${W.cards + 2}`;

/** 墙上的三个出口 */
const WIDE_PORTS: [number, number, string][] = [
  [W.wall, Y.claude, CLAUDE],
  [W.wall, Y.codex, CODEX],
  [W.wall, Y.cdg, ENGINE],
];

const pct = (x: number, y: number): CSSProperties => ({
  left: `${(x / W.width) * 100}%`,
  top: `${(y / W.height) * 100}%`,
});

/* ── 窄舞台：288 宽的一列，账号服务的卡片接在下面 ── */

const T = { width: 288, height: 524 };

/** 两条 Agent 的线从右边绕出仓库，向下穿过本机的底边进到模型服务 */
const TALL_SEGMENTS: Segment[] = [
  { d: 'M74 114H261C268 114 273 119 273 126V407', color: CLAUDE, at: AT.out },
  { d: 'M74 158H248C255 158 260 163 260 170V407', color: CODEX, at: AT.out },
  { d: 'M50 234V126C50 119 55 114 62 114H74', color: ENGINE, at: AT.rail },
  { d: 'M50 158H74', color: ENGINE, at: AT.rail },
];

/** 点线从 cdg 的左缘出来，立刻穿过左墙，在框外一路向下：框里是你的东西，框外这条线是 CodeDAG 的 */
const TALL_SERVICE = `M36 234H20C13 234 8 239 8 246V${T.height}`;

const TALL_PORTS: [number, number, string][] = [
  [273, 373, CLAUDE],
  [260, 373, CODEX],
  [23, 234, ENGINE],
];

const px = (left: number, top: number): CSSProperties => ({ left, top });

function Folder() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-4 flex-none text-stage-muted">
      <path
        d="M2.5 4.2c0-.7.6-1.2 1.2-1.2h2.6l1.4 1.6h4.6c.7 0 1.2.5 1.2 1.2v6c0 .7-.5 1.2-1.2 1.2H3.7c-.6 0-1.2-.5-1.2-1.2V4.2Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/**
 * 你的环境：一句隐私承诺、一张数据边界图、三条“不”。
 *
 * 图回答“什么发给谁”。仓库是一块面板，两个 Agent 在面板里：它们直接读写仓库，不用连线；
 * cdg 在面板外面，只有一条线伸进去启动会话，代码不从它手里过。出这台电脑的口只有两处：
 * 两个 Agent 像平时一样各自直连模型服务，走的是代码与上下文；cdg 到 CodeDAG 账号服务只有一条点线，
 * 走的是登录与额度。墙外账号服务的卡片只有两句：收的是做什么用的信息，工作流文件算完即丢弃；
 * 收到的是哪几类写在三条说明的第一条“不上传你的代码”里，逐项的清单在文档里。墙内贴着出口是没有发出去的三样。
 * 不画 cdg 与仓库之间的线：它确实在本机管分支，但那样它又成了连着一切的枢纽，
 * 会被读成“代码经过 cdg”。
 *
 * 桌面上图通栏，三条说明在图下排成三栏：整节不高过笔记本的一屏。
 * 窄于 1280px 时图换成窄版的一列，在说明的左边；手机上图、说明单列。
 * 标题（连同上方的章节名）、图、说明是同一个网格里的三块，各档宽度下的位置写在 home.css 的 .local-layout 里。
 * 这一节没有单独的文档链接：第一条说明里讲“收到什么”的那一句就是链接，悬停时才显出来。
 */
export function Local({ t, docsPrefix }: { t: HomepageTranslations; docsPrefix: string }) {
  const d = t.local.diagram;

  const lines = (segments: Segment[], service: string, ports: [number, number, string][], r: number) => (
    <>
      <path className="bound-dotted dot-fade" style={delay(AT.service)} d={service} />
      <BranchLines segments={segments} halo={false} />
      <path className="bound-pulse" style={delay(AT.serviceMark)} d={service} pathLength={1} />
      {ports.map(([x, y, color], i) => (
        <circle
          key={i}
          className="bound-port dot-fade"
          style={{ color, ...delay(color === ENGINE ? AT.serviceMark : AT.outMark) }}
          cx={x}
          cy={y}
          // 两条 Agent 的线在这张图里是背景，它们的出口比 cdg 那一个小一号
          r={color === ENGINE ? r : r - 1}
        />
      ))}
    </>
  );

  const head = (style: CSSProperties) => (
    <span className="bound-head lane-fade" style={{ ...style, ...delay(AT.repo) }}>
      <span className="bound-head-name">
        <Folder />
        {d.repo}
      </span>
      <span className="bound-note">{d.repoNote}</span>
    </span>
  );

  const agent = (id: AgentId, style: CSSProperties) => (
    <span className="bound-chip lane-fade" style={{ ...style, ...delay(AT.agents) }}>
      <AgentTag agent={id} />
    </span>
  );

  const cli = (style: CSSProperties) => (
    <span className="bound-chip bound-cdg lane-fade" style={{ ...style, ...delay(AT.cdg) }}>
      <code>cdg</code>
      <span>{d.cli}</span>
    </span>
  );

  const note = (text: string, at: number, style: CSSProperties, className?: string, own = false) => (
    <span
      className={cn('lane-fade', className)}
      data-own={own ? '' : undefined}
      style={{ ...style, ...delay(at) }}
    >
      {text}
    </span>
  );

  const kept = (style: CSSProperties, align?: 'end') => (
    <div className="bound-kept" data-align={align} style={style}>
      <strong className="lane-fade" style={delay(AT.kept)}>
        {d.kept}
      </strong>
      <ul>
        {d.keptItems.map((item, i) => (
          <li key={item} className="lane-fade" style={delay(AT.keptItems[i])}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const providers = (style?: CSSProperties): ReactNode => (
    <div className="bound-card lane-fade" data-card="providers" style={{ ...style, ...delay(AT.providers) }}>
      <strong>{d.providers}</strong>
      <span>{d.direct}</span>
    </div>
  );

  const service = (
    <div className="bound-card lane-fade" data-card="service" style={delay(AT.card)}>
      <strong>{d.service}</strong>
      <p className="bound-receives">{d.receives}</p>
      <p className="bound-discard lane-fade" style={delay(AT.discard)}>
        {tail(d.discard, 22)}
      </p>
    </div>
  );

  return (
    <section className="home-section">
      <Container>
        <div className="local-layout">
          <div className="local-title">
            <p className="text-sm font-medium text-home-accent">{t.local.label}</p>
            <h2 className="home-h2 mt-3">
              <Beats value={t.local.title} />
            </h2>
          </div>

          <Reveal className="local-pic">
            {/* 最窄的手机上内边距收一档：窄版的图是 288px 定宽，要正好放得下。
                放宽版的图时内边距是 24px，写在 home.css 里和那一档的版式放在一起 */}
            <Stage label={d.label} className="bound px-4 py-5 min-[375px]:p-5 sm:p-8">
              <div className="bound-wide">
                <svg viewBox={`0 0 ${W.width} ${W.height}`} className="bound-lines">
                  <rect className="bound-machine" x="1" y="1" width={W.wall - 1} height={W.height - 2} rx="24" />
                  <rect className="bound-repo" x="18" y="48" width="400" height="160" rx="16" />
                  {lines(WIDE_SEGMENTS, WIDE_SERVICE, WIDE_PORTS, 4.5)}
                </svg>
                <span className="bound-tag" style={pct(22, 17)}>
                  {d.machine}
                </span>
                {head(pct(38, 73))}
                {agent('claude', pct(74, Y.claude))}
                {agent('codex', pct(74, Y.codex))}
                {cli(pct(22, Y.cdg))}
                {note(d.starts, AT.starts, pct(60, 231), 'bound-note bound-starts')}
                {note(d.agentCargo, AT.outMark, pct(W.wall - 14, (Y.claude + Y.codex) / 2), 'bound-cargo')}
                {note(d.serviceCargo, AT.serviceMark, pct(W.wall - 14, Y.cdg - 18), 'bound-cargo', true)}
                {kept(pct(W.wall - 14, Y.cdg + 32), 'end')}
                {providers()}
                {service}
              </div>

              <div className="bound-tall">
                <div className="bound-tall-map">
                  <svg width={T.width} height={T.height} viewBox={`0 0 ${T.width} ${T.height}`} className="bound-lines">
                    <rect className="bound-machine" x="23" y="1" width="264" height="372" rx="20" />
                    <rect className="bound-repo" x="35" y="40" width="216" height="150" rx="14" />
                    {lines(TALL_SEGMENTS, TALL_SERVICE, TALL_PORTS, 3.5)}
                  </svg>
                  <span className="bound-tag" style={px(40, 14)}>
                    {d.machine}
                  </span>
                  {head(px(48, 70))}
                  {agent('claude', px(74, 114))}
                  {agent('codex', px(74, 158))}
                  {cli(px(36, 234))}
                  {note(d.starts, AT.starts, px(62, 203), 'bound-note bound-starts')}
                  {kept(px(40, 274))}
                  {note(d.agentCargo, AT.outMark, px(250, 388), 'bound-cargo')}
                  {providers()}
                  {note(d.serviceCargo, AT.serviceMark, px(18, 510), 'bound-cargo', true)}
                </div>
                {service}
              </div>
            </Stage>
          </Reveal>

          <ul className="local-facts">
            {t.local.facts.map((fact) => (
              <li key={fact.title} className="border-t border-home-rule-strong pt-5">
                <h3 className="home-h3">{fact.title}</h3>
                {/* 比别处的正文小一档：三条是图的附注，日文也要在三行里说完 */}
                <p className="mt-2 text-[0.9063rem] leading-[1.65] text-home-muted">
                  {sentences(fact.body)}
                  {fact.received ? (
                    <>
                      {needsSpace(fact.body, fact.received) ? ' ' : null}
                      {/* 这一节不另放文档链接：说“收到什么”的这一句自己就是链接，样子见 home.css */}
                      <Link
                        href={`${docsPrefix}/docs/account/login-and-account#data-boundary`}
                        title={t.local.link}
                        className={cn('local-quiet-link', focusRing)}
                      >
                        {tail(fact.received)}
                      </Link>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
