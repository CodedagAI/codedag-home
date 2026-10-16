import type { CSSProperties } from 'react';
import { exampleTasks, type HomepageTranslations } from '@/lib/homepage-translations';
import { cn } from '@/lib/cn';
import { AgentTag, Stage, StageWindow } from './stage';

const vars = (values: Record<string, string | number>) => values as CSSProperties;
/** 播放顺序里的延迟，毫秒 */
const delay = (ms: number) => vars({ '--d': `${ms}ms` });
/** 运行到这一步时，文件里对应的那一行闪一下的时刻，毫秒 */
const flash = (ms: number) => vars({ '--f': `${ms}ms` });

/**
 * 引擎线上的四个标记：任务开始的四个时刻。join 为真的两处是分叉与合流，
 * 从标记垂下一条线贯穿三个工作区。
 */
const MARKS: { column: number; at: number; join?: boolean }[] = [
  { column: 1, at: 1500 },
  { column: 2, at: 2000, join: true },
  { column: 3, at: 2900, join: true },
  { column: 4, at: 3430 },
];

/**
 * 每个任务在轨道图里的位置：哪个工作区、第几段，占这一段的多宽，
 * 以及什么时候开始显形、用多久。没有时间刻度，不代表真实时长。
 */
const BARS: { task: number; workspace: number; column: number; width: number; at: number; lasts: number }[] = [
  { task: 1, workspace: 1, column: 1, width: 100, at: 1550, lasts: 400 },
  { task: 3, workspace: 1, column: 2, width: 84, at: 2080, lasts: 640 },
  { task: 4, workspace: 2, column: 2, width: 100, at: 2080, lasts: 770 },
  { task: 2, workspace: 3, column: 2, width: 92, at: 2080, lasts: 700 },
  { task: 5, workspace: 1, column: 3, width: 100, at: 2980, lasts: 400 },
  { task: 6, workspace: 1, column: 4, width: 100, at: 3500, lasts: 400 },
];

function Key({ children }: { children: string }) {
  return <span className="tok-key">{children}</span>;
}

/**
 * “编排”的画面：上半是工作流文件，下半是它的一次运行，两半按颜色对应。
 *
 * 文件里写着“谁等谁”的那一行是引擎的颜色，由引擎执行；每个任务的那段指令是它的 Agent 的颜色，
 * 交给一个全新的会话。运行时最上面一条是引擎线，每个任务的起点都挂在它上面；
 * “你”在最底下，从提交到回来中间是空的：和痛点那张图相反，没有一条线落到你身上。
 * 运行到哪一步，文件里对应的那一行闪一下。文件是真实格式，不解释字段。
 */
export function OrchestrateStage({ t }: { t: HomepageTranslations }) {
  const s = t.capabilities.orchestrate.stage;
  return (
    <Stage label={s.label} className="orch p-5 sm:px-8 sm:py-6">
      <div className="lane-fade" style={delay(0)}>
        <StageWindow bar=".codedag/dags/site-search.yaml" className="orch-file">
          <pre className="stage-code">
            <span className="yaml-block lane-fade" style={delay(150)}>
              <Key>tasks:</Key>
            </span>
            <span className="yaml-block agent-claude lane-fade" style={delay(300)}>
              {'  - '}
              <Key>id:</Key>
              {' 1\n    '}
              <Key>title:</Key>
              {` ${t.tasks[0]}\n    `}
              <Key>agent:</Key>
              {' claude\n'}
              <span className="yaml-ask" style={flash(1550)}>
                <span className="yaml-row">
                  <span>
                    {'    '}
                    <Key>prompt:</Key>
                    {' |'}
                  </span>
                  <span className="yaml-tag font-sans lane-fade" style={delay(1150)}>
                    <AgentTag agent="claude" />
                  </span>
                </span>
                <span className="yaml-long">{`      ${s.specPrompt}`}</span>
              </span>
            </span>
            <span className="yaml-block agent-codex lane-fade" style={delay(600)}>
              {'  - '}
              <Key>id:</Key>
              {' 2\n    '}
              <Key>title:</Key>
              {` ${t.tasks[1]}\n`}
              <span className="yaml-dep" style={flash(2000)}>
                <span className="yaml-row">
                  <span>
                    {'    '}
                    <Key>dependencies:</Key>
                    {' [1]'}
                  </span>
                  <span className="yaml-tag yaml-tag-engine font-sans lane-fade" style={delay(1000)}>
                    <i />
                    {s.engineTag}
                  </span>
                </span>
              </span>
              {'    '}
              <Key>agent:</Key>
              {' codex\n'}
              <span className="yaml-ask" style={flash(2080)}>
                <span className="yaml-row">
                  <span>
                    {'    '}
                    <Key>prompt:</Key>
                    {' |'}
                  </span>
                  <span className="yaml-tag font-sans lane-fade" style={delay(1150)}>
                    <AgentTag agent="codex" />
                  </span>
                </span>
                <span className="yaml-long">{`      ${s.testPrompt}`}</span>
              </span>
            </span>
            <span className="yaml-block lane-fade" style={delay(900)}>
              {'  - '}
              <Key>id:</Key>
              {' 3\n    '}
              <Key>title:</Key>
              {` ${t.tasks[2]}`}
            </span>
          </pre>
        </StageWindow>
      </div>

      <div className="lanes">
        {/* 引擎：名字连着上面的文件，下面一条线贯穿整次运行 */}
        <span className="lanes-engine-name lane-fade" style={delay(1350)}>
          {s.engine}
        </span>
        <span className="lanes-engine lane-fade" style={delay(1350)} />
        {MARKS.map(({ column, at }) => (
          <span
            key={column}
            className="lanes-mark dot-fade"
            data-start={column === 1 ? '' : undefined}
            style={vars({ '--c': column, '--d': `${at}ms` })}
          />
        ))}
        {MARKS.filter((mark) => mark.join).map(({ column, at }) => (
          <span key={column} className="lanes-join dot-fade" style={vars({ '--c': column, '--d': `${at}ms` })} />
        ))}

        {[1, 2, 3].map((workspace) => (
          <span key={workspace} className="lanes-label" style={vars({ '--r': workspace })}>
            {s.workspace.replace('{n}', String(workspace))}
          </span>
        ))}
        {[1, 2, 3].map((workspace) => (
          <span key={workspace} className="lanes-rail" style={vars({ '--r': workspace })} />
        ))}

        {BARS.map(({ task, workspace, column, width, at, lasts }) => (
          <span
            key={task}
            className={cn('lanes-bar', `agent-${exampleTasks[task - 1].agent}`)}
            style={vars({
              '--r': workspace,
              '--c': column,
              '--w': `${width}%`,
              '--d': `${at}ms`,
              '--t': `${lasts}ms`,
            })}
          >
            <i className="lanes-spark" />
            <span>{t.tasks[task - 1]}</span>
          </span>
        ))}

        {/* 你：提交之后不在，回来时已经跑完。没有一条线连到这一行 */}
        <div className="lanes-you">
          <span className="lanes-you-name">{s.you}</span>
          <span className="lanes-point lane-fade" style={delay(1450)}>
            <i />
            {s.submit}
          </span>
          <span className="lanes-away">{s.away}</span>
          <span className="lanes-point lane-fade" style={delay(4000)}>
            {s.back}
            <i />
          </span>
        </div>
      </div>
    </Stage>
  );
}
