import type { CSSProperties, ReactNode } from 'react';
import type { HomepageTranslations } from '@/lib/homepage-translations';
import { cn } from '@/lib/cn';
import { AgentTag, Stage, StageWindow } from './stage';

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

const WORKFLOW = 'site-search';

/** 随时能下的三条控制命令：文案里的键，也是 `cdg task` 后面的命令名 */
const ACTIONS = ['pause', 'kill', 'recover'] as const;

/**
 * “随时接手”的画面：两层窗口加一排控制命令。
 *
 * 后面是 `cdg dag status` 看板里任务列表以下的一段，逐行与产品输出一致
 * （src/cli/commands/task-ls.ts、src/cli/utils/output-formatter.ts）；行尾的标注是页面加的，
 * 不是输出的一部分。情景是：任务 2 设了审核门禁，已做完，停在 [done] [done] 等你；
 * 任务 3 被你中断了，停在 [stopped] [killed]，会话还在；任务 4 还在执行。
 * 前面是任务 4 的会话窗口，你正在里面打一句话。Agent 的输出画成灰条，不编内容。
 * 下面三个动作是暂停、中断、恢复，选中的“恢复”和看板上高亮的那一行是同一个任务：
 * 最后一行命令让任务 3 在原会话里接着做。
 */
export function SteerStage({ t }: { t: HomepageTranslations }) {
  const s = t.capabilities.steer.stage;

  /**
   * 看板的一行：状态列在前，任务在后。两部分分开，舞台窄到一行放不下时任务另起一行，
   * 和窄终端里的折行是一个样子。每行自己是一个块，后面不再跟换行符。
   */
  const row = (status: string, id: number, className?: string, note?: ReactNode) => (
    <span className={cn('steer-row', className)}>
      {status}
      <span className="steer-task">{`Task ${id}: ${t.tasks[id - 1]}`}</span>
      {note}
    </span>
  );

  return (
    <Stage label={s.label} className="steer p-5 sm:p-8">
      <div className="steer-board lane-fade" style={delay(0)}>
        <StageWindow bar={`cdg dag status ${WORKFLOW} --watch`}>
          <pre className="stage-code">
            {'Submitted Tasks (5):\n'}
            {row(
              '  🔵 [done]        [done]  ',
              2,
              undefined,
              <span className="steer-note lane-fade" data-quiet="" style={delay(500)}>
                {s.waiting}
              </span>,
            )}
            {row(
              '  🔴 [stopped]     [killed]  ',
              3,
              'steer-held',
              <span className="steer-note lane-fade" style={delay(800)}>
                {s.kept}
              </span>,
            )}
            {row('  🟢 [in-progress] [working]  ', 4)}
            {row('  🔘 [pending]     [blocked]  ', 5, 'tok-dim')}
            {row('  🔘 [pending]     [blocked]  ', 6, 'tok-dim')}
            {'\nReviewed Tasks (1):\n'}
            {row('  🤖☑️ [auto-accepted]  ', 1)}
            {'\nProgress: 2/6 tasks completed (33%), 1 reviewed'}
          </pre>
        </StageWindow>
      </div>

      {/* 会话窗口压着看板的下沿，左边是三条控制命令 */}
      <div className="steer-below">
        <div className="steer-session lane-fade" style={delay(1100)}>
          <StageWindow
            bar={
              <>
                <span className="truncate">{`cdg task view 4 -w ${WORKFLOW}`}</span>
                <AgentTag agent="claude" className="steer-agent ml-auto font-sans text-xs" />
              </>
            }
          >
            <div className="steer-output">
              <i />
              <i />
              <i />
            </div>
            <div className="steer-input">
              <span className="text-stage-faint">›</span>
              <span className="steer-typed" style={delay(1700)}>
                <span>{s.message}</span>
              </span>
              <span className="run-caret" />
            </div>
          </StageWindow>
        </div>

        <ul className="steer-actions lane-fade" style={delay(2500)}>
          {ACTIONS.map((command) => (
            <li key={command} data-chosen={command === 'recover' ? 'true' : undefined}>
              {s[command]}
              {/* 英文里动作的叫法和命令名是同一个词，不再重复写一遍 */}
              {s[command].toLowerCase() === command ? null : <code>{command}</code>}
            </li>
          ))}
        </ul>
        <pre className="steer-command lane-fade" style={delay(2800)}>
          <span className="text-stage-faint select-none">$ </span>
          {`cdg task recover 3 -w ${WORKFLOW}`}
        </pre>
      </div>
    </Stage>
  );
}
