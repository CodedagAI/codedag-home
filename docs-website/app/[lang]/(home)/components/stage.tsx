import type { ComponentProps, ReactNode } from 'react';
import { agentNames, type AgentId } from '@/lib/homepage-translations';
import { cn } from '@/lib/cn';

export type RunState = 'idle' | 'run' | 'done';

/**
 * 舞台：凡是“有东西在跑”的画面都放在舞台里。舞台随主题变化：浅色主题下是带紫的浅色纸面，
 * 深色主题下是深紫的面板，颜色都来自 home.css 的 --stage-* 变量。
 * 画面本身是示意，文字替代写在 label 里。
 */
export function Stage({
  label,
  className,
  children,
  ...props
}: { label: string } & ComponentProps<'div'>) {
  return (
    <div role="img" aria-label={label} className={cn('stage', className)} {...props}>
      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </div>
  );
}

/** 舞台上的终端或文件窗口。标题栏写路径或命令 */
export function StageWindow({
  bar,
  className,
  children,
}: {
  bar?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('stage-window', className)}>
      {bar ? (
        <div className="stage-window-bar">
          {/* 只有一段文字的标题栏放不下时用省略号收尾，不顶到窗口边上 */}
          {typeof bar === 'string' ? <span className="truncate">{bar}</span> : bar}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/** 状态标记：未开始是空心圈，执行中是转动的弧，完成是对勾。由父元素的 data-state 切换 */
export function StatusMark({ className }: { className?: string }) {
  return (
    <span className={cn('status-mark', className)}>
      <svg viewBox="0 0 18 18" className="mark-idle" fill="none">
        <circle cx="9" cy="9" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg viewBox="0 0 18 18" className="mark-run" fill="none">
        <circle cx="9" cy="9" r="6.25" stroke="currentColor" strokeWidth="1.5" opacity="0.28" />
        <path
          d="M9 2.75A6.25 6.25 0 0 1 15.25 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <svg viewBox="0 0 18 18" className="mark-done" fill="none">
        <circle cx="9" cy="9" r="7.5" fill="currentColor" />
        <path
          d="m5.6 9.3 2.3 2.3 4.6-4.9"
          stroke="var(--stage-on-done)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Agent 的名字，前面一个该 Agent 颜色的小圆点 */
export function AgentTag({ agent, className }: { agent: AgentId; className?: string }) {
  return (
    <span className={cn(`agent-${agent} inline-flex items-center gap-1.5`, className)}>
      <span className="agent-dot" />
      {agentNames[agent]}
    </span>
  );
}

/** 区块正文下面的三个短标签 */
export function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <li key={item} className="home-chip">
          {item}
        </li>
      ))}
    </ul>
  );
}
