import type { CSSProperties } from 'react';
import { exampleTasks, type HomepageTranslations } from '@/lib/homepage-translations';
import { Reveal } from './reveal';
import { AgentTag } from './stage';
import { Beats, Container, tail } from './ui';

/** 停着的三个会话：写测试、做接口都做完了，做页面有问题要问 */
const SESSIONS: { task: number; asks?: boolean }[] = [{ task: 2 }, { task: 3 }, { task: 4, asks: true }];

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/**
 * 痛点：没有 CodeDAG 时的样子。
 *
 * 故意不放在舞台上：舞台是 CodeDAG 在干活的地方，这一格画在页面上，平的、虚线框、没有颜色，
 * 上沿压一枚“没有 CodeDAG”的标签，标题和画面都圈在框里。画的是首屏并行的那三个任务，
 * 褪了色、停着：每条线都落到“你”身上，只有三个光标在闪。
 * 框的底边垂下一条虚线，接到能力节开头的“有了 CodeDAG”（见 capabilities.tsx）。
 * 这一格里不放链接：它的出口是那条线，各种现有做法的比较由“适合做什么”一节的链接带过去。
 */
export function Burden({ t }: { t: HomepageTranslations }) {
  const s = t.burden.stage;
  return (
    <section className="today-section">
      <Container>
        <div className="today">
          <p className="today-tag">{t.burden.tag}</p>

          <div className="today-head">
            <h2 className="home-h2 today-title">
              <Beats value={t.burden.title} />
            </h2>
            <p className="today-lead text-[1.0625rem] leading-[1.7] text-home-muted">{tail(t.burden.body)}</p>
          </div>

          <Reveal role="img" aria-label={s.label} className="waiting">
            <div aria-hidden="true" className="waiting-scene">
              <ul className="waiting-cards">
                {SESSIONS.map(({ task, asks }, i) => (
                  <li key={task} className="waiting-card lane-fade" style={delay(150 + i * 300)}>
                    <span className="waiting-card-bar">
                      <span className="text-[0.9375rem] font-semibold">{t.tasks[task - 1]}</span>
                      <AgentTag agent={exampleTasks[task - 1].agent} className="text-xs text-home-muted" />
                    </span>
                    <span className="waiting-card-line">
                      {asks ? s.question : s.done}
                      <span className="waiting-caret" />
                    </span>
                  </li>
                ))}
              </ul>

              {/* 三张卡各有一条线垂下来，汇到“你”身上。线是虚线：都停着 */}
              <svg
                className="waiting-lines lane-fade"
                style={delay(1150)}
                viewBox="0 0 600 100"
                preserveAspectRatio="none"
              >
                <path d="M100 0C100 62 300 38 300 100" />
                <path d="M300 0V100" />
                <path d="M500 0C500 62 300 38 300 100" />
              </svg>

              <div className="waiting-you lane-fade" style={delay(1350)}>
                <span className="waiting-you-mark">
                  <svg viewBox="0 0 24 24" fill="none" className="size-6">
                    <circle cx="12" cy="8.2" r="3.6" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M4.8 20c.5-3.6 3.4-6 7.2-6s6.7 2.4 7.2 6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="waiting-you-text">
                  <span className="block text-[0.9375rem] font-semibold">{s.you}</span>
                  <span className="mt-0.5 block text-xs text-home-muted">
                    {s.waiting.replace('{n}', String(SESSIONS.length))}
                  </span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
