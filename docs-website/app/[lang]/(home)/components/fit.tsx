import type { CSSProperties } from 'react';
import type { AgentId, HomepageTranslations } from '@/lib/homepage-translations';
import { cn } from '@/lib/cn';
import { Reveal } from './reveal';
import { Beats, Container, TextLink, tail } from './ui';

/** 小卡的半宽和半高。四张图里的任务都是这一个尺寸 */
const CHIP = { w: 22, h: 12 };

interface Node {
  x: number;
  y: number;
  /** 做这个任务的 Agent。没有 agent 的不是任务，是 CodeDAG 做的事：合并，或者 end 为真时合并出来的那条分支的端点 */
  agent?: AgentId;
  end?: boolean;
}

interface Shape {
  /** 画布，默认 264 × 128：前三张图和折起来的长链共用这一张，所以它们的小卡一样大 */
  width?: number;
  height?: number;
  nodes: Node[];
  /** 连线：从哪个节点到哪个节点（下标），上游在前 */
  edges: [number, number][];
  /** 接力：一个光点从第一个节点走到最后一个。节点要按先后顺序写 */
  relay?: boolean;
  /** 光走完全程用多久，秒，默认 1.3。四张图里光走得差不多一样快，长链路长，所以走得久 */
  run?: number;
  /** 卡片独占一行时改用的排法 */
  flat?: Shape;
}

function chain(points: [number, number][], agents: (i: number) => AgentId, size?: Pick<Shape, 'width' | 'height'>): Shape {
  return {
    ...size,
    nodes: points.map(([x, y], i): Node => ({ x, y, agent: agents(i) })),
    edges: points.slice(1).map((_, i): [number, number] => [i, i + 1]),
    relay: true,
  };
}

/** 十二个任务的长链：前十一个 Claude Code，最后一个 Codex */
const lastIsCodex = (i: number): AgentId => (i === 11 ? 'codex' : 'claude');

/**
 * 四种任务图，轮廓各不相同：一个菱形、一把收拢的扇子、一上一下的来回、一长串。
 * 来回那张按 Agent 分两行，Claude Code 在上，Codex 在下：交接看得见，也不会和长链混成一种。
 */
const SHAPES: Shape[] = [
  {
    nodes: [
      { x: 22, y: 64, agent: 'claude' },
      { x: 132, y: 31, agent: 'claude' },
      { x: 132, y: 97, agent: 'codex' },
      { x: 242, y: 64, agent: 'claude' },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
  },
  {
    nodes: [
      { x: 45, y: 16, agent: 'claude' },
      { x: 45, y: 48, agent: 'codex' },
      { x: 45, y: 80, agent: 'claude' },
      { x: 45, y: 112, agent: 'claude' },
      { x: 175, y: 64 },
      { x: 235, y: 64, end: true },
    ],
    edges: [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 5],
    ],
  },
  chain(
    [
      [22, 44],
      [95, 84],
      [169, 44],
      [242, 84],
    ],
    (i) => (i % 2 ? 'codex' : 'claude'),
  ),
  {
    // 折成三行，中间一行从右往左走；桌面上卡片独占一行，改用拉成一行的 flat
    ...chain(
      [
        [42, 24],
        [102, 24],
        [162, 24],
        [222, 24],
        [222, 64],
        [162, 64],
        [102, 64],
        [42, 64],
        [42, 104],
        [102, 104],
        [162, 104],
        [222, 104],
      ],
      lastIsCodex,
    ),
    run: 3.2,
    flat: {
      ...chain(
        Array.from({ length: 12 }, (_, i): [number, number] => [22 + i * 56, 12]),
        lastIsCodex,
        { width: 660, height: 24 },
      ),
      run: 3.2,
    },
  },
];

/** 线接在小卡的左右边缘上；菱形和端点很小，线直接画到中心，被它们盖住 */
const reach = (node: Node) => (node.agent ? CHIP.w : 0);

/**
 * 两个节点之间的线和它的长度。和首屏的任务图一样，水平出发、水平到达，不在一行就是一段 S 形。
 * 同一列上下相接的两个节点用半圆连接，鼓向图的外侧：长链在这里掉头。
 */
function edgeLine(a: Node, b: Node, center: number): { d: string; length: number } {
  if (a.x === b.x) {
    const side = a.x > center ? 1 : -1;
    const x = a.x + side * reach(a);
    const r = Math.abs(b.y - a.y) / 2;
    const sweep = side > 0 === b.y > a.y ? 1 : 0;
    return { d: `M${x} ${a.y}A${r} ${r} 0 0 ${sweep} ${x} ${b.y}`, length: Math.PI * r };
  }
  const forward = b.x > a.x ? 1 : -1;
  const x1 = a.x + forward * reach(a);
  const x2 = b.x - forward * reach(b);
  if (a.y === b.y) return { d: `M${x1} ${a.y}H${x2}`, length: Math.abs(x2 - x1) };
  const mid = (x1 + x2) / 2;
  // 曲线的长度没有现成的式子，切成十六小段量
  let length = 0;
  let [px, py] = [x1, a.y];
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    const u = 1 - t;
    const x = u * u * u * x1 + 3 * u * t * mid + t * t * t * x2;
    const y = u * u * (u + 3 * t) * a.y + t * t * (3 * u + t) * b.y;
    length += Math.hypot(x - px, y - py);
    [px, py] = [x, y];
  }
  return { d: `M${x1} ${a.y}C${mid} ${a.y} ${mid} ${b.y} ${x2} ${b.y}`, length };
}

/** 一张任务的小卡：白底、细边，里面一个 Agent 颜色的圆点和一条代表任务名的短横。光走到时亮一下边 */
function Chip({ node, agent, at }: { node: Node; agent: AgentId; at: number }) {
  const box = { x: node.x - CHIP.w + 0.5, y: node.y - CHIP.h + 0.5, width: CHIP.w * 2 - 1, height: CHIP.h * 2 - 1, rx: 7.5 };
  return (
    <g className={`agent-${agent}`} style={{ '--at': at } as CSSProperties}>
      <rect className="fit-chip" {...box} />
      <rect className="fit-chip-lit fit-tick" {...box} />
      <circle className="fit-chip-dot" cx={node.x - 11} cy={node.y} r="3" />
      <rect className="fit-chip-bar" x={node.x - 4} y={node.y - 2} width="16" height="4" rx="2" />
    </g>
  );
}

function ShapeSvg({ shape, fit }: { shape: Shape; fit?: 'folded' | 'flat' }) {
  const width = shape.width ?? 264;
  const height = shape.height ?? 128;
  const ends = shape.edges.map(([from, to]) => [shape.nodes[from], shape.nodes[to]] as const);
  const lines = ends.map(([a, b]) => edgeLine(a, b, width / 2));

  // 不接力的图分步走：没有上游的节点是第 0 步，光从它们出发，每一步走完一层连线
  const step = shape.nodes.map(() => 0);
  for (const [from, to] of shape.edges) step[to] = Math.max(step[to], step[from] + 1);
  const steps = Math.max(...step);

  // 接力：各段首尾相接成一条路径，中间从小卡底下穿过去
  const track = lines.map(({ d }, i) => (i === 0 ? d : `L${d.slice(1)}`)).join('');
  const total = lines.reduce((sum, line) => sum + line.length, 0) + CHIP.w * 2 * (shape.nodes.length - 2);
  const along = (i: number) =>
    lines.slice(0, i).reduce((sum, line) => sum + line.length, 0) + CHIP.w * (2 * i - 1);

  /** 光走到第 i 个节点时，全程过了几分之几 */
  const at = (i: number) => {
    if (!shape.relay) return step[i] / steps;
    return i === 0 ? 0 : Math.min(1, along(i) / total);
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} data-fit={fit} aria-hidden="true">
      <g className="fit-lines">
        {lines.map(({ d }, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {shape.relay ? (
        <path className="fit-pulse fit-relay" d={track} pathLength={1} />
      ) : (
        lines.map(({ d }, i) => (
          <path
            key={i}
            className="fit-pulse fit-step"
            style={{ '--at': step[shape.edges[i][0]] / steps } as CSSProperties}
            d={d}
            pathLength={1}
          />
        ))
      )}
      <g className="fit-marks">
        {shape.nodes.map((node, i) =>
          node.agent ? (
            <Chip key={i} node={node} agent={node.agent} at={at(i)} />
          ) : node.end ? (
            <circle key={i} className="fit-engine" cx={node.x} cy={node.y} r="5" />
          ) : (
            <rect
              key={i}
              className="fit-engine"
              x={node.x - 6}
              y={node.y - 6}
              width="12"
              height="12"
              rx="2.5"
              transform={`rotate(45 ${node.x} ${node.y})`}
            />
          ),
        )}
      </g>
    </svg>
  );
}

/** 一张任务图放在自己的小舞台里：进入视口时才播放，手机上滑到哪张播哪张 */
function ShapeGraph({ shape, label }: { shape: Shape; label: string }) {
  return (
    <Reveal
      role="img"
      aria-label={label}
      className="stage fit-stage"
      style={{ '--run': `${shape.run ?? 1.3}s` } as CSSProperties}
    >
      <ShapeSvg shape={shape} fit={shape.flat ? 'folded' : undefined} />
      {shape.flat ? <ShapeSvg shape={shape.flat} fit="flat" /> : null}
    </Reveal>
  );
}

/**
 * 适合做什么：四种任务图的形状各配一个名字。前三张讲活怎么分，第四张讲能交出去多久：
 * 桌面上它是三张卡下面通栏的一条，长链拉成一行，卡片的形状本身就在说“长”。
 * 图是首屏那张任务图缩小之后的样子：任务是白色的小卡，Agent 是卡里的一个小圆点，线是细的紫线。
 * 卡片下面只有一个通往“何时用”页的链接，名字写的是读者看到这里最可能想问的那件事
 * （和 Claude Code Dynamic Workflow 的对比）；旁边一行小字写目前支持哪些 Agent：
 * 首屏和页面标题只说“编程 Agent”，名字留到这里才出现在正文里。哪些活不适合，这里不写，在链接的那一页里。
 */
export function Fit({ t, docsPrefix }: { t: HomepageTranslations; docsPrefix: string }) {
  return (
    <section className="home-section">
      <Container>
        <p className="text-sm font-medium text-home-accent">{t.fit.label}</p>
        <h2 className="home-h2 mt-3">
          <Beats value={t.fit.title} />
        </h2>
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {t.fit.cards.map((card, i) => (
            <li key={card.name} className={cn('fit-card', SHAPES[i].flat ? 'fit-card-long lg:col-span-3' : null)}>
              <ShapeGraph shape={SHAPES[i]} label={card.label} />
              <div className="fit-text">
                <h3 className="home-h3">{card.name}</h3>
                <p className="mt-2 text-[0.9688rem] leading-[1.65] text-home-muted">{tail(card.body)}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <TextLink href={`${docsPrefix}/docs/introduction/when-to-use`} solo>
            {t.fit.link}
          </TextLink>
          <span className="text-[0.9375rem] text-home-muted">{t.fit.agents}</span>
        </p>
      </Container>
    </section>
  );
}
