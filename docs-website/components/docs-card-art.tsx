type Agent = 'claude' | 'codex';

/** 画布。宽 382 是卡片在 1200 宽的下拉里的宽度，这时一比一画；高是任务图加上下面的余量 */
const WIDTH = 382;
const HEIGHT = 200;
/** 小卡的半宽和半高 */
const CHIP = { w: 28, h: 15 };
/** 五列三行的中心位置。左边和命令那行字对齐，上面留出它的地方 */
const COLS = [40, 116, 191, 266, 342];
const ROWS = [54, 92, 130];
/** 任务图的下沿：最下面一行小卡的底边 */
const GRAPH_BOTTOM = ROWS[2] + CHIP.h;

/** 六个任务：在第几列第几行、交给谁。顺序、依赖和 Agent 同首屏的示例工作流（exampleTasks） */
const TASKS: { col: number; row: number; agent: Agent }[] = [
  { col: 0, row: 1, agent: 'claude' },
  { col: 1, row: 0, agent: 'codex' },
  { col: 1, row: 1, agent: 'claude' },
  { col: 1, row: 2, agent: 'claude' },
  { col: 2, row: 1, agent: 'claude' },
  { col: 3, row: 1, agent: 'codex' },
];
/** 集成分支，在最后一列 */
const BRANCH = { col: 4, row: 1 };
const NODES = [...TASKS, BRANCH];
/** 连线：从哪个节点到哪个节点（NODES 的下标），上游在前 */
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 4],
  [2, 4],
  [3, 4],
  [4, 5],
  [5, 6],
];

/** 代表 Agent 名字的那条短横有多长：Claude Code 的名字长，Codex 的短 */
const NAME_BAR: Record<Agent, number> = { claude: 15, codex: 9 };

/** 舞台上半透明的线和块都用这一个颜色，只变透明度 */
const fg = (alpha: number) => `rgb(var(--stage-fg) / ${alpha})`;

/** 完成的标记，画法同首屏的 StatusMark */
function Done({ x, y }: { x: number; y: number }) {
  return (
    <svg x={x - 6.5} y={y - 6.5} width="13" height="13" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" fill="var(--done)" />
      <path
        d="m5.6 9.3 2.3 2.3 4.6-4.9"
        stroke="var(--stage-on-done)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 任务图本身：连线、六张任务小卡和集成分支。按宽度画，高度随画布的比例 */
function Graph() {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} fill="none" className="block w-full">
      {EDGES.map(([from, to]) => {
        const a = NODES[from];
        const b = NODES[to];
        const x1 = COLS[a.col] + CHIP.w;
        const x2 = COLS[b.col] - CHIP.w;
        const mid = (x1 + x2) / 2;
        return (
          <path
            key={`${from}-${to}`}
            d={`M${x1} ${ROWS[a.row]}C${mid} ${ROWS[a.row]} ${mid} ${ROWS[b.row]} ${x2} ${ROWS[b.row]}`}
            stroke="var(--engine)"
            strokeWidth="1.5"
          />
        );
      })}
      <g style={{ filter: 'drop-shadow(0 4px 5px color-mix(in srgb, var(--stage-shadow) 50%, transparent))' }}>
        {TASKS.map((task, i) => {
          const x = COLS[task.col];
          const y = ROWS[task.row];
          return (
            <g key={i}>
              <rect
                x={x - CHIP.w + 0.5}
                y={y - CHIP.h + 0.5}
                width={CHIP.w * 2 - 1}
                height={CHIP.h * 2 - 1}
                rx="8"
                fill="var(--stage-card)"
                stroke={fg(0.14)}
              />
              <Done x={x - 15.5} y={y} />
              <rect x={x - 4} y={y - 7.5} width="24" height="4.5" rx="2.25" fill={fg(0.5)} />
              <circle cx={x - 1.5} cy={y + 5.5} r="2.25" fill={`var(--agent-${task.agent})`} />
              <rect x={x + 3.5} y={y + 3.75} width={NAME_BAR[task.agent]} height="3.5" rx="1.75" fill={fg(0.22)} />
            </g>
          );
        })}
        {/* 集成分支：合并完之后是亮的，和首屏一样。两条横是分支名的前缀和名字 */}
        <rect
          x={COLS[BRANCH.col] - CHIP.w - 2}
          y={ROWS[BRANCH.row] - CHIP.h - 2}
          width={CHIP.w * 2 + 4}
          height={CHIP.h * 2 + 4}
          rx="10.5"
          stroke="var(--engine)"
          strokeWidth="4"
          opacity="0.15"
        />
        <rect
          x={COLS[BRANCH.col] - CHIP.w + 0.5}
          y={ROWS[BRANCH.row] - CHIP.h + 0.5}
          width={CHIP.w * 2 - 1}
          height={CHIP.h * 2 - 1}
          rx="8"
          fill="var(--stage-card-hub)"
          stroke="color-mix(in srgb, var(--engine) 85%, transparent)"
        />
        <Done x={COLS[BRANCH.col] - 15.5} y={ROWS[BRANCH.row]} />
        <rect x={COLS[BRANCH.col] - 4} y={ROWS[BRANCH.row] - 7.25} width="15" height="3.5" rx="1.75" fill={fg(0.22)} />
        <rect x={COLS[BRANCH.col] - 4} y={ROWS[BRANCH.row] + 2.5} width="24" height="4.5" rx="2.25" fill={fg(0.5)} />
      </g>
    </svg>
  );
}

/**
 * 导航栏“文档”下拉里概览卡片的配图：首屏那张示例任务图缩成的一张小图，画的是全部完成之后的样子。
 * 六个任务和集成分支的位置、依赖和各自的 Agent 都和首屏一致。卡片里的字缩到这么小读不出来，
 * 换成记号：完成的对勾、一条代表任务名的横条、Agent 颜色的圆点和一条代表它名字的短横。
 * 图上只留一行字，提交这个工作流的命令：它不随语言变，图缩小时字号停在 12px。
 * 画在舞台的底色上，颜色都取自 home.css 的 --stage-* 变量，随主题变化。
 *
 * 它铺满父元素（父元素要是定位的），自己不占高度：高度由卡片的版式给。图按宽度画，
 * 画不下的从下面裁掉，多出来的地方是舞台的底色；任务图在画布上面七成，裁掉的只是底下的空白。
 * 从任务图的下沿往下渐隐到卡片的底色（Fumadocs 模板里这张图原来的收法），任务图本身不变淡。
 */
export function DocsCardArt() {
  return (
    // 外面一层只管量宽度：里面的位置、字号和渐隐的起点都按它的宽度算
    <div aria-hidden="true" className="@container absolute inset-0">
      <div
        className="stage-ground absolute inset-0 overflow-hidden rounded-t-lg"
        style={{ maskImage: `linear-gradient(to bottom, white ${(GRAPH_BOTTOM / WIDTH) * 100}cqw, transparent)` }}
      >
        {/* 位置跟着图的宽度走，左边和第一张小卡对齐；字号也跟着走，但不小于 12px */}
        <p className="absolute top-[2.1cqw] left-[3.14cqw] font-mono text-[max(0.75rem,3.14cqw)] leading-[1.34] whitespace-nowrap">
          <span className="text-stage-faint">$ </span>
          <span className="font-semibold text-stage-ink">cdg dag submit site-search</span>
        </p>
        <Graph />
      </div>
    </div>
  );
}
