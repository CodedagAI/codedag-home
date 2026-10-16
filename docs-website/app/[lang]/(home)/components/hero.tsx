import { Fragment } from 'react';
import type { HomepageTranslations } from '@/lib/homepage-translations';
import { getStartEntry, siteMode } from '@/lib/site-mode';
import { RunStage } from './run-stage';
import { Beats, Container, EntryButton, TextLink, needsSpace, tail } from './ui';

export function Hero({
  t,
  lang,
  docsPrefix,
}: {
  t: HomepageTranslations;
  lang: string;
  docsPrefix: string;
}) {
  const status = t.hero.status[siteMode];
  return (
    // 上边距随视口的高度变（见 home.css 的 .home-hero）：笔记本的一屏里，任务图中间那一行要露全
    <section className="home-hero pb-4">
      <Container>
        <h1 className="home-display">
          <Beats value={t.hero.title} even />
        </h1>
        {/* 手机上几句连排；宽屏上每句是一个整体，放不下就整句另起一行，折行落在句与句之间 */}
        <p className="home-lead mt-5 max-w-176 text-[1.0625rem] leading-[1.65] text-home-muted sm:mt-6 sm:text-[1.1875rem]">
          {t.hero.lead.map((sentence, i) => (
            <Fragment key={i}>
              {i > 0 && needsSpace(t.hero.lead[i - 1], sentence) ? ' ' : null}
              <span>{tail(sentence)}</span>
            </Fragment>
          ))}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-8">
          <EntryButton entry={getStartEntry(lang, 'home-hero')} />
          <TextLink
            href={`${docsPrefix}/docs/introduction/overview`}
            solo
            track={{ event: 'docs', source: 'home-hero' }}
          >
            {t.hero.docsLink}
          </TextLink>
          {/* 宽屏上和按钮同一行，省下一行的高度；放不下就整句落到下一行 */}
          <p className="max-w-full shrink-0 text-sm leading-[1.6] text-home-muted">{tail(status)}</p>
        </div>
      </Container>

      {/* 舞台比文字的版心宽一些，图在首屏内就露出来 */}
      <div className="mx-auto mt-10 w-full max-w-[1320px] px-3 sm:px-6">
        <RunStage tasks={t.tasks} t={t.hero.stage} />
      </div>
    </section>
  );
}
