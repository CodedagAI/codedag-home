'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  agentNames,
  exampleTasks,
  type HomepageTranslations,
} from '@/lib/homepage-translations';
import { cn } from '@/lib/cn';
import { ShaderBackdrop } from './shader-backdrop';
import { StatusMark, type RunState } from './stage';
import { focusRing } from './ui';

/**
 * 首屏主视觉：示例工作流 site-search 的一次运行，循环播放。
 *
 * 一条提交命令被敲出来，六个任务按依赖自行推进，结果汇入集成分支。
 * 画面是压缩过的示意：不出现任何时长或进度数字，命令与提交成功那一行是真实格式。
 * 提交成功那一行也逐字打出（真实终端是一次打印的）：为的是把视线留在终端上，
 * 不然这一行一闪而过，只有上面的图被看到。它和任务 1 开始执行是同一刻。
 * 舞台够宽时是一张从左到右的任务图，平板上同一张图改成从上到下，
 * 手机上是左侧一条分支线、每个任务一行。
 */

const COMMAND = 'cdg dag submit site-search';
const SUBMITTED = '✔ Submitted successfully: .codedag/dags/site-search.yaml';
const FILE = '.codedag/dags/site-search.yaml';
const BRANCH = 'cdg/site-search/integration';
/** 集成分支在连线表里的编号 */
const END = 7;

/** 时间表，毫秒。三个并行任务的完成时间错开，不整齐 */
const TIME = {
  typeStart: 500,
  typeStep: 42,
  /** 回车的那一刻：光标消失，输出行开始逐字打出，任务 1 同时开始（等于 run[0]） */
  submitted: 2400,
  outputStep: 22,
  run: [2400, 4600, 4600, 4600, 8500, 10600],
  done: [4000, 6500, 7200, 7900, 10000, 12000],
  branch: 12600,
  /** 整个画面开始淡出，淡完才归零，归零之后再淡入 */
  fade: 15500,
  end: 16000,
};

/** 画面淡出、淡入的时长，同 home.css 里 .run-fade 的过渡；要比 TIME.end - TIME.fade 短 */
const FADE = 450;

/** 首次播放跳过开头静止的半秒，一上来就在敲命令；之后每一轮从 0 开始，淡入之后停半秒再敲 */
const OPENING = TIME.typeStart;

/** 光点沿一条连线走完的时间；走完之后这条线保持点亮 */
const PULSE = 620;

const EDGES: [number, number][] = [
  ...exampleTasks.flatMap((task) => task.dependencies.map((from): [number, number] => [from, task.id])),
  [6, END],
];

interface Frame {
  typed: number;
  submitted: boolean;
  /** 提交成功那一行已经打出的字符数 */
  output: number;
  states: RunState[];
  branch: RunState;
  /** 每条连线：光点正在走、已点亮 */
  edges: { pulse: boolean; lit: boolean }[];
  /** 一轮的结尾，画面淡出 */
  fading: boolean;
  /**
   * 图上的状态直接到位、不走过渡：从淡出开始，到重来时淡入完。
   * 归零那一下各处在看不见的时候退回未开始，淡入时也不会有连线还在慢慢暗下去
   */
  snap: boolean;
}

function frameAt(ms: number): Frame {
  return {
    typed: Math.max(0, Math.min(COMMAND.length, Math.floor((ms - TIME.typeStart) / TIME.typeStep))),
    submitted: ms >= TIME.submitted,
    output: Math.max(0, Math.min(SUBMITTED.length, Math.floor((ms - TIME.submitted) / TIME.outputStep))),
    states: TIME.run.map((start, i) => (ms < start ? 'idle' : ms < TIME.done[i] ? 'run' : 'done')),
    branch: ms >= TIME.branch ? 'done' : 'idle',
    edges: EDGES.map(([from]) => {
      const fired = TIME.done[from - 1];
      return { pulse: ms >= fired && ms < fired + PULSE, lit: ms >= fired + PULSE - 120 };
    }),
    fading: ms >= TIME.fade,
    snap: ms >= TIME.fade || ms < FADE,
  };
}

/** 完成状态：没有动画时显示的画面。取在最后一粒光点走完之后，画面上不留半路的光点 */
const FINAL = frameAt(TIME.branch + PULSE);

/* ── 任务图：宽舞台从左到右，平板从上到下 ─────────────── */

/** 从左到右时，节点中心在舞台里的位置，百分比 */
const WIDE_AT: Record<number, [number, number]> = {
  1: [9.5, 50],
  2: [29.75, 20],
  3: [29.75, 50],
  4: [29.75, 80],
  5: [50, 50],
  6: [70.25, 50],
  [END]: [90.5, 50],
};

/** 从上到下时，节点在三列网格里的行与列 */
const STACK_AT: Record<number, [number, number]> = {
  1: [1, 2],
  2: [2, 1],
  3: [2, 2],
  4: [2, 3],
  5: [3, 2],
  6: [4, 2],
  [END]: [5, 2],
};

/** 量出节点的实际位置之前用的画布：连线先按节点中心画，被卡片盖住两头 */
const DRAFT = { width: 1000, height: 330 };

function draftPath([from, to]: [number, number]): string {
  const [ax, ay] = WIDE_AT[from];
  const [bx, by] = WIDE_AT[to];
  return across(
    (ax * DRAFT.width) / 100,
    (ay * DRAFT.height) / 100,
    (bx * DRAFT.width) / 100,
    (by * DRAFT.height) / 100,
  );
}

/** 从 (x1, y1) 水平出发、水平到达 (x2, y2) 的一段 S 形 */
function across(x1: number, y1: number, x2: number, y2: number): string {
  const reach = (x2 - x1) / 2;
  return `M${x1} ${y1}C${x1 + reach} ${y1} ${x2 - reach} ${y2} ${x2} ${y2}`;
}

/**
 * 从 (x1, y1) 往下到 (x2, y2)：两张卡上下对齐时是一条竖线；错开时先下到两行中间，
 * 横着走到目标上方，再往下，拐角是圆的。两行之间的空当不高，S 形在这里会被压扁。
 */
function down(x1: number, y1: number, x2: number, y2: number): string {
  if (Math.abs(x2 - x1) < 1) return `M${x1} ${y1}V${y2}`;
  const mid = (y1 + y2) / 2;
  const turn = Math.min(12, (y2 - y1) / 2, Math.abs(x2 - x1) / 2);
  const side = x2 > x1 ? turn : -turn;
  return (
    `M${x1} ${y1}V${mid - turn}Q${x1} ${mid} ${x1 + side} ${mid}` +
    `H${x2 - side}Q${x2} ${mid} ${x2} ${mid + turn}V${y2}`
  );
}

interface GraphLayout {
  width: number;
  height: number;
  paths: string[];
}

/* ── 窄舞台：左侧分支线，每个任务一行 ─────────────────── */

const ROW = 72;
const LANE = [20, 42, 64];
/** 每个节点所在的分支线与行 */
const TALL_AT: Record<number, [number, number]> = {
  1: [0, 0],
  2: [0, 1],
  3: [1, 2],
  4: [2, 3],
  5: [0, 4],
  6: [0, 5],
  [END]: [0, 6],
};
const rowY = (row: number) => ROW / 2 + row * ROW;

function tallPath([from, to]: [number, number]): string {
  const [fromLane, fromRow] = TALL_AT[from];
  const [toLane, toRow] = TALL_AT[to];
  const x1 = LANE[fromLane];
  const y1 = rowY(fromRow);
  const x2 = LANE[toLane];
  const y2 = rowY(toRow);
  if (x1 === x2) return `M${x1} ${y1}V${y2}`;
  // 分叉：离开起点后拐到自己的线上再往下；合流：走到终点上方再拐回去
  if (x2 > x1) return `M${x1} ${y1}C${x1} ${y1 + 30} ${x2} ${y1 + 16} ${x2} ${y1 + 46}V${y2}`;
  return `M${x1} ${y1}V${y2 - 46}C${x1} ${y2 - 16} ${x2} ${y2 - 30} ${x2} ${y2}`;
}

const TALL_PATHS = EDGES.map(tallPath);

/**
 * 连线分四层画：未点亮的底线、点亮后的光晕、线芯、光点。底线和光晕各自放在一个带透明度的组里：
 * 从上到下的版式里几条线有一段是重合的，各画各的透明度会在那一段叠亮。
 */
function Edges({ paths, frame }: { paths: string[]; frame: Frame }) {
  return (
    <>
      <g className="edge-bases">
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g className="edge-glows">
        {paths.map((d, i) => (
          <path key={i} data-lit={frame.edges[i].lit} d={d} />
        ))}
      </g>
      {paths.map((d, i) => (
        <g key={i} data-lit={frame.edges[i].lit} data-pulse={frame.edges[i].pulse}>
          <path className="edge-lit" d={d} />
          <path className="edge-pulse" d={d} pathLength={1} />
        </g>
      ))}
    </>
  );
}

export function RunStage({
  tasks,
  t,
}: {
  tasks: HomepageTranslations['tasks'];
  t: HomepageTranslations['hero']['stage'];
}) {
  const root = useRef<HTMLDivElement>(null);
  const graph = useRef<HTMLDivElement>(null);
  /** 动画走到的时刻。放在 ref 里：暂停后再继续，从停下的地方接着走 */
  const elapsed = useRef(OPENING);
  const [frame, setFrame] = useState<Frame>(() => frameAt(OPENING));
  const [paused, setPaused] = useState(false);
  /** 用户选择了减少动态效果：直接显示完成状态，不提供播放 */
  const [still, setStill] = useState(false);
  const [layout, setLayout] = useState<GraphLayout | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  // 连线接在卡片的边缘上：图从左到右时从右缘连到左缘，从上到下时从下缘连到上缘。
  // 卡片的位置和大小随版式、文字和字号变，所以量出来再画
  useEffect(() => {
    const scene = graph.current;
    if (!scene) return;

    const measure = () => {
      const frameBox = scene.getBoundingClientRect();
      if (frameBox.width === 0) {
        setLayout(null);
        return;
      }
      // 从上到下的版式是一个三列网格（见 home.css 的 .run-graph）
      const stacked = getComputedStyle(scene).display === 'grid';
      const box = (id: number) => {
        const rect = scene.querySelector(`[data-node="${id}"]`)?.getBoundingClientRect();
        return rect
          ? {
              left: rect.left - frameBox.left,
              right: rect.right - frameBox.left,
              top: rect.top - frameBox.top,
              bottom: rect.bottom - frameBox.top,
              center: rect.left - frameBox.left + rect.width / 2,
              middle: rect.top - frameBox.top + rect.height / 2,
            }
          : null;
      };
      const paths = EDGES.map(([from, to]) => {
        const a = box(from);
        const b = box(to);
        if (!a || !b) return '';
        return stacked
          ? down(a.center, a.bottom, b.center, b.top)
          : across(a.right, a.middle, b.left, b.middle);
      });
      setLayout({ width: frameBox.width, height: frameBox.height, paths });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    document.fonts.ready.then(measure);
    return () => observer.disconnect();
  }, [tasks]);

  useEffect(() => {
    if (still) {
      setFrame(FINAL);
      return;
    }
    if (paused) return;
    // 暂停时画面不淡出（见下面的 fading）；停在淡出途中的，继续时从淡出的起点重新淡出
    elapsed.current = Math.min(elapsed.current, TIME.fade);

    let last = performance.now();
    let visible = true;
    let signature = '';
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      last = performance.now();
    });
    if (root.current) observer.observe(root.current);

    const timer = window.setInterval(() => {
      const now = performance.now();
      // 离开视口或标签页不在前台时不走时间
      if (visible && !document.hidden) elapsed.current += Math.min(now - last, 120);
      last = now;
      if (elapsed.current >= TIME.end) elapsed.current = 0;
      const next = frameAt(elapsed.current);
      const key = JSON.stringify(next);
      if (key !== signature) {
        signature = key;
        setFrame(next);
      }
    }, 40);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [paused, still]);

  // 提交之后只用一种说法报进度，数字变、句式不变
  const done = frame.states.filter((state) => state === 'done').length;
  const count = frame.submitted ? t.progress.replace('{n}', String(done)) : '';
  // 任务图、计数和命令行一起淡出、一起淡入。暂停时不淡出：停在淡出途中，看到的是这一轮跑完的样子
  const fading = frame.fading && !paused;

  const node = (id: number, style?: CSSProperties) => {
    const task = exampleTasks[id - 1];
    return (
      <div
        key={id}
        data-node={id}
        className={cn('run-node', `agent-${task.agent}`)}
        data-state={frame.states[id - 1]}
        style={style}
      >
        <StatusMark />
        <span className="run-node-title">{tasks[id - 1]}</span>
        <span className="run-node-agent">
          <span className="agent-dot" />
          {agentNames[task.agent]}
        </span>
        <span className="run-node-work">
          <i />
          <i />
          <i />
        </span>
      </div>
    );
  };

  const branch = (style?: CSSProperties) => (
    <div className="run-node run-branch" data-node={END} data-state={frame.branch} style={style}>
      <StatusMark />
      <span className="run-branch-prefix">{BRANCH.slice(0, BRANCH.lastIndexOf('/') + 1)}</span>
      <span className="run-branch-name">{BRANCH.slice(BRANCH.lastIndexOf('/') + 1)}</span>
    </div>
  );

  const at = (id: number): CSSProperties =>
    ({
      '--x': `${WIDE_AT[id][0]}%`,
      '--y': `${WIDE_AT[id][1]}%`,
      '--row': STACK_AT[id][0],
      '--col': STACK_AT[id][1],
    }) as CSSProperties;

  return (
    <div
      ref={root}
      className="stage run px-4 pt-4 pb-4 sm:px-7 sm:pt-5 sm:pb-6"
      data-paused={paused}
    >
      <ShaderBackdrop paused={paused} />

      {/* 这一行直接压在流动的背景上：次要色在着色器最深或最亮的地方也过 4.5:1，最弱的一档不行 */}
      <div className="flex min-h-7 items-center justify-between gap-4 font-mono text-xs text-stage-muted">
        <span className="truncate">{FILE}</span>
        <span
          className="run-fade shrink-0 text-stage-ink tabular-nums"
          data-fading={fading}
          aria-hidden="true"
        >
          {count}
        </span>
      </div>

      <div role="img" aria-label={t.label} className="mt-3">
        <div className="run-fade" data-fading={fading} data-snap={frame.snap} aria-hidden="true">
          <div ref={graph} className="run-scene run-graph" data-measured={layout !== null}>
            <svg
              className="run-edges"
              viewBox={`0 0 ${layout?.width ?? DRAFT.width} ${layout?.height ?? DRAFT.height}`}
              preserveAspectRatio="none"
            >
              <Edges paths={layout?.paths ?? EDGES.map(draftPath)} frame={frame} />
            </svg>
            {exampleTasks.map((task) => node(task.id, at(task.id)))}
            {branch(at(END))}
          </div>

          <div className="run-scene run-tall">
            <svg className="run-edges" width="84" height={ROW * 7} viewBox={`0 0 84 ${ROW * 7}`}>
              <Edges paths={TALL_PATHS} frame={frame} />
              {[...exampleTasks.map((task) => task.id), END].map((id) => (
                <circle
                  key={id}
                  className={cn('lane-dot', id === END ? null : `agent-${exampleTasks[id - 1].agent}`)}
                  data-state={id === END ? frame.branch : frame.states[id - 1]}
                  cx={LANE[TALL_AT[id][0]]}
                  cy={rowY(TALL_AT[id][1])}
                  r="5"
                />
              ))}
            </svg>
            <div className="run-tall-rows">
              {exampleTasks.map((task) => node(task.id))}
              {branch()}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 sm:mt-5">
        <div className="stage-window min-w-0 max-w-full" aria-hidden="true">
          <pre
            className="stage-code run-fade py-2.5! text-[0.75rem] sm:text-[0.8125rem]"
            data-fading={fading}
          >
            <span className="block truncate">
              <span className="tok-dim select-none">$ </span>
              <span className="tok-cmd">{COMMAND.slice(0, frame.typed)}</span>
              {frame.submitted ? null : <span className="run-caret" />}
            </span>
            {/* 完整的一行留在原位但看不见，撑住高度；打出的部分盖在它上面，折行和它一致，终端的高度不会跳 */}
            <span className="run-submitted tok-ok relative">
              <span className="invisible">{SUBMITTED}</span>
              <span className="absolute inset-0 overflow-hidden text-ellipsis">
                {SUBMITTED.slice(0, frame.output)}
              </span>
            </span>
          </pre>
        </div>
        {still ? null : (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? t.play : t.pause}
            className={cn(
              'stage-icon-button grid size-10 shrink-0 place-items-center rounded-full',
              focusRing,
            )}
          >
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              {paused ? (
                <path d="M4.5 2.7v10.6a.6.6 0 0 0 .92.5l8.2-5.3a.6.6 0 0 0 0-1L5.42 2.2a.6.6 0 0 0-.92.5Z" />
              ) : (
                <path d="M4 2.5h2.5v11H4zM9.5 2.5H12v11H9.5z" />
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
