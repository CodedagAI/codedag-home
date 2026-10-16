import { Fragment } from 'react';
import type { Metadata } from 'next/types';
import { ChevronDown } from 'lucide-react';
import { createMetadata, generateAlternates, shareImage } from '@/lib/metadata';
import { getHomepageTranslations } from '@/lib/homepage-translations';
import { getPricingTranslations, type AnswerPart } from '@/lib/pricing-translations';
import { getSubscribeEntry, siteMode } from '@/lib/site-mode';
import { i18n } from '@/lib/i18n';
import { Email } from '@/components/email';
import { Beats, Container, HeadingText, TextLink, focusRing, prose, tail, textLinkClass } from '../components/ui';
import { Closing } from '../components/closing';
import { MergeLanes } from '../components/merge-lanes';
import { PlanPanel } from './components/plan-panel';
import { cn } from '@/lib/cn';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { meta } = getPricingTranslations(lang);
  const alternates = generateAlternates('/pricing', lang);
  const images = shareImage(lang);

  return createMetadata({
    title: meta.title,
    description: meta.description,
    alternates,
    openGraph: { url: alternates.canonical, images },
    twitter: { images },
  });
}

function Answer({ parts, docsPrefix }: { parts: AnswerPart[]; docsPrefix: string }) {
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <Fragment key={i}>{i === parts.length - 1 ? tail(part) : prose(part)}</Fragment>
        ) : 'email' in part ? (
          <Email key={i} user={part.email} className={textLinkClass({ className: 'font-normal' })} />
        ) : (
          <TextLink
            key={i}
            href={part.href.startsWith('/') ? `${docsPrefix}${part.href}` : part.href}
            className="font-normal"
          >
            {part.text}
          </TextLink>
        ),
      )}
    </>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getPricingTranslations(lang);
  const docsPrefix = lang === i18n.defaultLanguage ? '' : `/${lang}`;

  return (
    <main className="overflow-x-clip bg-fd-background text-home-ink antialiased">
      {/* 页头是一块和首页同款的舞台：几条分支线从右边进来，合成一条。
          桌面上线在文字右边；再窄，文字旁边没有地方，线在文字下面单独占一条带子。
          三种摆法各用一组和显示尺寸相当的坐标，等比显示，线不变形。
          标题说的是这一页最要紧的一条：按任务计费，一个任务扣 1 点。线在右边时标题和说明一样宽，
          一行放不下的语言（英文、日文）两拍各占一行，不伸到线上 */}
      <div className="mx-auto w-full max-w-[1320px] px-3 pt-4 sm:px-6 sm:pt-6">
        <div className="stage pricing-head">
          <svg
            className="pricing-head-lanes"
            data-fit="beside"
            viewBox="484 0 516 224"
            preserveAspectRatio="xMaxYMid meet"
            aria-hidden="true"
          >
            <MergeLanes from="right" />
            <circle className="pricing-head-dot" cx="500" cy="112" r="6" />
          </svg>
          <svg className="pricing-head-lanes" data-fit="band" viewBox="536 0 564 112" aria-hidden="true">
            <MergeLanes from="right" width={1100} height={112} />
            <circle className="pricing-head-dot" cx="550" cy="56" r="5.5" />
          </svg>
          <svg className="pricing-head-lanes" data-fit="band-narrow" viewBox="296 0 324 112" aria-hidden="true">
            <MergeLanes from="right" width={620} height={112} />
            <circle className="pricing-head-dot" cx="310" cy="56" r="5.5" />
          </svg>
          <div className="mx-auto w-full max-w-[1200px] px-2 sm:px-2">
            <h1 className="home-h2 xl:max-w-xl">
              <Beats value={typeof t.title === 'string' ? [t.title] : t.title} onStage />
            </h1>
            <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.7] text-stage-muted">
              {tail(t.lead)}
            </p>
          </div>
        </div>
      </div>

      <section className="pt-12 pb-16 sm:pt-16 lg:pb-24">
        <Container>
          <div className="grid grid-cols-1 items-start gap-x-16 gap-y-14 lg:grid-cols-2">
            <PlanPanel
              t={t.plan}
              entries={{
                monthly: getSubscribeEntry(lang, 'pricing-plan', 'monthly'),
                yearly: getSubscribeEntry(lang, 'pricing-plan', 'yearly'),
              }}
              entryNote={t.plan.entryNote[siteMode]}
            />

            {/* 顶部留白与左侧卡片的内边距一致，两边的第一个标题落在同一条线上 */}
            <div className="lg:pt-9">
              <h2 className="home-h3 text-home-ink">{t.free.title}</h2>
              <p className="mt-3 text-base leading-[1.75] text-home-muted">{tail(t.free.body)}</p>

              <h2 className="home-h3 mt-12 text-home-ink">
                <HeadingText value={t.charge.title} />
              </h2>
              <p className="mt-3 text-base leading-[1.75] text-home-muted">
                {tail(t.charge.lead)}
              </p>
              <ol className="mt-6 list-none divide-y divide-home-rule border-y border-home-rule p-0">
                {t.charge.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 py-4 sm:grid-cols-[1.5rem_8.5rem_minmax(0,1fr)]"
                  >
                    <span className="font-mono text-sm leading-[1.7] text-home-muted" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="text-[0.9375rem] font-semibold leading-[1.7] text-home-ink">
                      {step.title}
                    </span>
                    <span className="col-start-2 text-[0.9375rem] leading-[1.7] text-home-muted sm:col-start-3">
                      {tail(step.body)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-home-rule py-16 lg:py-24">
        <Container className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <h2 className="home-h2 text-home-ink lg:sticky lg:top-24 lg:self-start">{t.faq.title}</h2>
          <div className="divide-y divide-home-rule border-y border-home-rule">
            {t.faq.items.map((item, i) => (
              <details key={item.question} className="group" open={i === 0}>
                <summary
                  className={cn(
                    'flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm py-5 text-[1.0625rem] font-medium leading-normal text-home-ink [&::-webkit-details-marker]:hidden',
                    focusRing,
                  )}
                >
                  <span>{tail(item.question)}</span>
                  <ChevronDown
                    className="mt-1 size-4 shrink-0 text-home-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <p className="m-0 max-w-176 pb-6 text-base leading-[1.75] text-home-muted">
                  <Answer parts={item.answer} docsPrefix={docsPrefix} />
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <Closing
        t={getHomepageTranslations(lang)}
        lang={lang}
        docsPrefix={docsPrefix}
        source="pricing-cta"
      />
    </main>
  );
}
