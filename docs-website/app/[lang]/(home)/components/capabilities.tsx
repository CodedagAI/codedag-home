import type { ReactNode } from 'react';
import type { Capability, HomepageTranslations } from '@/lib/homepage-translations';
import { BranchStage } from './branch-stage';
import { OrchestrateStage } from './orchestrate-stage';
import { Reveal } from './reveal';
import { Chips } from './stage';
import { SteerStage } from './steer-stage';
import { Beats, Container, TextLink, tail } from './ui';

/**
 * 三个能力节：编排、随时接手、汇成一条分支。
 *
 * 它们是一次使用的先后三步，所以带序号，并由左侧一条竖线串起来。竖线从上一节“没有 CodeDAG”
 * 那一格的底边起头：先是一段灰色虚线，过了“有了 CodeDAG”这枚标签变成品牌色的实线。
 * 每一节的序号圆点进入视口时从“未开始”转成“执行中”再到“完成”，和首屏节点是同一套状态；
 * 画面自己进入视口时才播放，手机上文字在上、画面在下，滚到画面时它才开始。
 * 三节也是八条设计理念归并出的三组，结尾链接到设计理念页。
 */
export function Capabilities({ t, docsPrefix }: { t: HomepageTranslations; docsPrefix: string }) {
  const c = t.capabilities;
  const items: [Capability, ReactNode][] = [
    [c.orchestrate, <OrchestrateStage key="orchestrate" t={t} />],
    [c.steer, <SteerStage key="steer" t={t} />],
    [c.merge, <BranchStage key="merge" t={t} />],
  ];

  return (
    <section id="features" aria-label={c.label} className="caps-section scroll-mt-14">
      <Container>
        <p className="caps-turn">
          <span className="caps-turn-tag">{c.turn}</span>
        </p>

        <ol className="caps">
          {items.map(([item, stage], i) => (
            <li key={item.name} className="cap">
              <Reveal className="cap-rail" aria-hidden="true">
                <span className="cap-marker">
                  <span className="cap-ring" />
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Reveal>
              <div className="cap-text">
                <p className="text-sm font-medium text-home-accent">{item.name}</p>
                <h2 className="cap-title mt-3">
                  <Beats value={item.title} />
                </h2>
                <p className="mt-5 text-[1.0625rem] leading-[1.7] text-home-muted">{tail(item.body)}</p>
                <Chips items={item.chips} className="mt-6" />
              </div>
              <Reveal className="cap-stage">{stage}</Reveal>
            </li>
          ))}
        </ol>

        <p className="caps-more">
          <TextLink href={`${docsPrefix}/docs/introduction/design-philosophy`} solo>
            {c.philosophyLink}
          </TextLink>
        </p>
      </Container>
    </section>
  );
}
