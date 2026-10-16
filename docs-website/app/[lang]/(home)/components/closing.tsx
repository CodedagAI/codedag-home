import type { HomepageTranslations } from '@/lib/homepage-translations';
import { getStartEntry, siteMode, type EntrySource } from '@/lib/site-mode';
import { MergeLanes } from './merge-lanes';
import { Reveal } from './reveal';
import { ShaderBackdrop } from './shader-backdrop';
import { Beats, EntryButton, TextLink, tail } from './ui';

/**
 * 合流线的三组坐标宽度：手机、平板、桌面。线铺满舞台的宽度，同一组坐标只在它自己那一段
 * 宽度里用，横向的伸缩不超过四成，线的粗细看不出变化。
 */
const LANE_FITS = [
  ['narrow', 360],
  ['mid', 620],
  ['wide', 1000],
] as const;

/** 收尾：全页的分支线在这里合成一条，停在行动按钮上。首页与定价页共用 */
export function Closing({
  t,
  lang,
  docsPrefix,
  source = 'home-cta',
}: {
  t: HomepageTranslations;
  lang: string;
  docsPrefix: string;
  source?: EntrySource;
}) {
  return (
    <section className="pt-6 pb-10 sm:pb-14">
      <div className="mx-auto w-full max-w-[1320px] px-3 sm:px-6">
        <Reveal className="stage closing px-6 pt-16 pb-0 text-center sm:pt-24">
          <ShaderBackdrop />
          <h2 className="home-h2 mx-auto max-w-184">
            <Beats value={t.closing.title[siteMode]} onStage />
          </h2>
          <p className="mx-auto mt-5 max-w-136 text-[1.0625rem] leading-[1.65] text-stage-muted">
            {tail(t.closing.body[siteMode])}
          </p>

          {/* 线在按钮的高度上合流，从按钮背后穿过。三组坐标各管一段舞台宽度，由样式切换 */}
          <div className="closing-merge">
            {LANE_FITS.map(([fit, width]) => (
              <svg
                key={fit}
                data-fit={fit}
                viewBox={`0 0 ${width} 224`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <MergeLanes from="both" width={width} />
              </svg>
            ))}
            <EntryButton entry={getStartEntry(lang, source)} className="closing-cta" />
          </div>

          <p className="pb-12 sm:pb-16">
            <TextLink
              href={`${docsPrefix}/docs/introduction/overview`}
              onStage
              solo
              track={{ event: 'docs', source }}
            >
              {t.closing.docsLink}
            </TextLink>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
