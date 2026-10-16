import type { CSSProperties } from 'react';
import { exampleTasks, type HomepageTranslations } from '@/lib/homepage-translations';
import { BranchLines, type Segment } from './branch-lines';
import { Stage } from './stage';

const INTEGRATION = 'cdg/site-search/integration';
const PREFIX = INTEGRATION.slice(0, INTEGRATION.lastIndexOf('/') + 1);
const NAME = INTEGRATION.slice(PREFIX.length);

const agentColor = (task: number) => `var(--agent-${exampleTasks[task - 1].agent})`;
const ENGINE = 'var(--engine)';
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * 两种版式共用的时间表，毫秒：集成分支先从 main 上分出去，任务的线从它上面岔开，
 * 按依赖分叉、合流，最后回到集成分支上；这时才出现集成分支的名字，以及通向 main 的那条“由你决定”。
 * 三条线合流的那一刻出现合并的标记，随后是“冲突已解决”，再往后才是下一个任务的结果。
 */
const AT = {
  integration: 100,
  first: 450,
  fork: 1000,
  join: 1700,
  merge: 2000,
  resolved: 2200,
  fifth: 2000,
  sixth: 2350,
  lost: 1850,
  end: 3150,
  call: 3450,
  dots: [850, 1400, 1400, 1400, 2250, 2600],
};

/* ── 宽舞台：从左到右的线路图，700×372 ─────────────────── */

/** main 在 y=336，集成分支在 y=48，两条线都画到 x=680（end） */
const W = { width: 700, height: 372, main: 336, top: 48, end: 680 };

/** 每个任务结果点的位置；label 说明任务名写在点的上方还是下方 */
const WIDE_DOTS: { task: number; x: number; y: number; label: 'above' | 'below' }[] = [
  { task: 1, x: 142, y: 190, label: 'above' },
  { task: 2, x: 306, y: 110, label: 'above' },
  { task: 3, x: 306, y: 190, label: 'above' },
  { task: 4, x: 306, y: 262, label: 'above' },
  { task: 5, x: 492, y: 190, label: 'above' },
  { task: 6, x: 578, y: 190, label: 'below' },
];

/** 集成分支排在最后：它最后画，任务线从它上面岔开的那一小段贴着它走，不把它盖住 */
const WIDE_SEGMENTS: Segment[] = [
  { d: 'M56 252C56 212 76 190 112 190H190', color: agentColor(1), at: AT.first },
  { d: 'M190 190C220 190 216 110 246 110H380', color: agentColor(2), at: AT.fork },
  { d: 'M190 190H380', color: agentColor(3), at: AT.fork },
  { d: 'M190 190C220 190 216 262 246 262H380', color: agentColor(4), at: AT.fork },
  { d: 'M380 110C410 110 406 190 436 190', color: agentColor(2), at: AT.join },
  { d: 'M380 190H436', color: agentColor(3), at: AT.join },
  { d: 'M380 262C410 262 406 190 436 190', color: agentColor(4), at: AT.join },
  { d: 'M436 190H550', color: agentColor(5), at: AT.fifth },
  { d: 'M550 190H606C636 190 618 48 648 48', color: agentColor(6), at: AT.sixth },
  { d: `M56 336V104C56 68 72 48 108 48H${W.end}`, color: ENGINE, at: AT.integration },
];

/** 三条并行的线合成一条的地方：CodeDAG 在“跑通测试”开始之前自动合并，冲突也在这里解决 */
const WIDE_MERGE = { x: 436, y: 190 };

const pct = (x: number, y: number): CSSProperties => ({
  left: `${(x / W.width) * 100}%`,
  top: `${(y / W.height) * 100}%`,
});

/* ── 窄舞台：从上到下，线在左，文字在右 ─────────────────── */

/** main 在 x=14，集成分支在 x=34；land 是集成分支回到 main 的地方；merge 是三条线合流的高度 */
const T = { width: 110, height: 420, main: 14, integration: 34, merge: 254, end: 362, land: 404 };

const TALL_DOTS: { task: number; x: number; y: number }[] = [
  { task: 1, x: 58, y: 92 },
  { task: 2, x: 98, y: 144 },
  { task: 3, x: 78, y: 180 },
  { task: 4, x: 58, y: 216 },
  { task: 5, x: 58, y: 286 },
  { task: 6, x: 58, y: 324 },
];

const TALL_SEGMENTS: Segment[] = [
  { d: 'M34 66C34 82 58 74 58 90V104', color: agentColor(1), at: AT.first },
  { d: 'M58 104C58 126 98 116 98 136V204', color: agentColor(2), at: AT.fork },
  { d: 'M58 104C58 124 78 122 78 142V204', color: agentColor(3), at: AT.fork },
  { d: 'M58 104V232', color: agentColor(4), at: AT.fork },
  { d: 'M98 204C98 232 58 226 58 254', color: agentColor(2), at: AT.join },
  { d: 'M78 204C78 230 58 230 58 254', color: agentColor(3), at: AT.join },
  { d: 'M58 232V254', color: agentColor(4), at: AT.join },
  { d: 'M58 254V306', color: agentColor(5), at: AT.fifth },
  { d: `M58 306V330C58 348 34 342 34 ${T.end - 4}`, color: agentColor(6), at: AT.sixth },
  { d: `M14 40C14 56 34 50 34 66V${T.end}`, color: ENGINE, at: AT.integration },
];

/** 合流点上的菱形：引擎的颜色，合并是 CodeDAG 做的，不属于哪一个任务 */
const diamond = (x: number, y: number, r: number) =>
  `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;

/**
 * “汇成一条分支”的画面：一张分支线路图。主分支是一条不动的线；集成分支从它上面分出去，
 * 每个任务一条自己的线，按依赖分叉、合流，最后回到集成分支。三条并行的线合成一条的地方
 * 有一个引擎色的菱形和两行小字：这次合并是自动做的，冲突也解决了。集成分支到主分支之间
 * 是一条没有画实的线，落点是空心的：合不合由你决定。
 * 宽舞台上“做页面”那条线旁边有一截被丢弃的虚线，是重做之前的那一版。
 */
export function BranchStage({ t }: { t: HomepageTranslations }) {
  const s = t.capabilities.merge.stage;
  return (
    <Stage label={s.label} className="branch p-5 sm:p-8">
      <div className="branch-wide">
        <svg viewBox={`0 0 ${W.width} ${W.height}`} className="branch-lines">
          <path className="branch-main" d={`M20 ${W.main}H${W.end + 12}`} />
          <path
            className="branch-dashed dot-fade"
            style={delay(AT.lost)}
            d="M246 262C270 262 268 298 290 298"
          />
          <path
            className="branch-dotted dot-fade"
            style={delay(AT.call)}
            d={`M${W.end} ${W.top}V${W.main}`}
          />
          <path
            className="branch-tick dot-fade"
            style={delay(AT.merge)}
            d={`M${WIDE_MERGE.x} ${WIDE_MERGE.y + 11}V${WIDE_MERGE.y + 46}`}
          />
          <BranchLines segments={WIDE_SEGMENTS} />
          <circle className="branch-base" cx="56" cy={W.main} r="5" />
          <circle
            className="branch-landing dot-fade"
            style={delay(AT.call)}
            cx={W.end}
            cy={W.main}
            r="6"
          />
          <circle className="branch-lost dot-fade" style={delay(AT.lost)} cx="296" cy="298" r="4.5" />
          {WIDE_DOTS.map(({ task, x, y }) => (
            <circle
              key={task}
              className="branch-dot dot-fade"
              style={{ color: agentColor(task), ...delay(AT.dots[task - 1]) }}
              cx={x}
              cy={y}
              r="6.5"
            />
          ))}
          <path
            className="branch-dot dot-fade"
            style={{ color: ENGINE, ...delay(AT.merge) }}
            d={diamond(WIDE_MERGE.x, WIDE_MERGE.y, 7.5)}
          />
          <circle
            className="branch-dot dot-fade"
            style={{ color: ENGINE, ...delay(AT.end) }}
            cx={W.end}
            cy={W.top}
            r="7"
          />
        </svg>

        <span
          className="branch-label branch-merge lane-fade"
          style={{ ...pct(WIDE_MERGE.x - 7, WIDE_MERGE.y + 52), ...delay(AT.merge) }}
        >
          {s.merged}
          <span className="branch-merge-note lane-fade" style={delay(AT.resolved)}>
            <Check />
            {s.resolved}
          </span>
        </span>
        {WIDE_DOTS.map(({ task, x, y, label }) => (
          <span
            key={task}
            className="branch-label lane-fade"
            data-place={label}
            data-task={task}
            style={{ ...pct(x, y), ...delay(AT.dots[task - 1]) }}
          >
            {t.tasks[task - 1]}
          </span>
        ))}
        <span
          className="branch-label lane-fade"
          data-place="right"
          style={{ ...pct(308, 298), ...delay(AT.lost + 100) }}
        >
          <span className="text-stage-faint">{s.reworked}</span>
        </span>
        <span
          className="branch-label lane-fade font-mono"
          data-place="above-end"
          style={{ ...pct(W.end, W.top), ...delay(AT.end) }}
        >
          <span className="text-stage-muted">{PREFIX}</span>
          {NAME}
        </span>
        <span
          className="branch-label lane-fade"
          data-place="left"
          style={{ ...pct(W.end - 14, 310), ...delay(AT.call) }}
        >
          {s.yourCall}
        </span>
        {/* main 的两个标注写在线的下方：线的上方是任务线分出去的地方 */}
        <span className="branch-label font-mono" data-place="below-start" style={pct(20, W.main)}>
          <Lock />
          main
        </span>
        <span className="branch-label" data-place="below-end" style={pct(W.end + 12, W.main)}>
          <span className="text-stage-faint">{s.noCommits}</span>
        </span>
      </div>

      <div className="branch-tall">
        <svg width={T.width} height={T.height} viewBox={`0 0 ${T.width} ${T.height}`} className="branch-lines">
          <path className="branch-main" d={`M${T.main} 12V${T.height - 8}`} />
          <path
            className="branch-dotted dot-fade"
            style={delay(AT.call)}
            d={`M${T.integration} ${T.end}C${T.integration} ${T.end + 18} ${T.main} ${T.land - 20} ${T.main} ${T.land}`}
          />
          <BranchLines segments={TALL_SEGMENTS} />
          <circle className="branch-base" cx={T.main} cy="40" r="5" />
          <circle
            className="branch-landing dot-fade"
            style={delay(AT.call)}
            cx={T.main}
            cy={T.land}
            r="5.5"
          />
          {TALL_DOTS.map(({ task, x, y }) => (
            <circle
              key={task}
              className="branch-dot dot-fade"
              style={{ color: agentColor(task), ...delay(AT.dots[task - 1]) }}
              cx={x}
              cy={y}
              r="6"
            />
          ))}
          <path
            className="branch-dot dot-fade"
            style={{ color: ENGINE, ...delay(AT.merge) }}
            d={diamond(58, T.merge, 6)}
          />
          <circle
            className="branch-dot dot-fade"
            style={{ color: ENGINE, ...delay(AT.end) }}
            cx={T.integration}
            cy={T.end}
            r="6.5"
          />
        </svg>
        <span className="branch-row font-mono" style={{ top: 40 }}>
          <span>
            <Lock />
            main
          </span>
          <span className="font-sans text-xs font-normal text-stage-faint">{s.noCommits}</span>
        </span>
        {TALL_DOTS.map(({ task, y }) => (
          <span
            key={task}
            className="branch-row lane-fade"
            style={{ top: y, ...delay(AT.dots[task - 1]) }}
          >
            {t.tasks[task - 1]}
          </span>
        ))}
        <span className="branch-row branch-merge lane-fade" style={{ top: T.merge, ...delay(AT.merge) }}>
          {s.merged}
          <span className="branch-merge-note lane-fade" style={delay(AT.resolved)}>
            <Check />
            {s.resolved}
          </span>
        </span>
        <span className="branch-row lane-fade font-mono" style={{ top: T.end - 6, ...delay(AT.end) }}>
          <span>
            <span className="block text-[0.6875rem] text-stage-muted">{PREFIX}</span>
            {NAME}
          </span>
        </span>
        <span className="branch-row lane-fade" style={{ top: T.land, ...delay(AT.call) }}>
          {s.yourCall}
        </span>
      </div>
    </Stage>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="size-3 flex-none text-done">
      <path
        d="m2.4 6.3 2.3 2.3 4.9-5.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="mr-1.5 inline size-3.5 -translate-y-px text-stage-muted">
      <rect x="3" y="7" width="10" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
