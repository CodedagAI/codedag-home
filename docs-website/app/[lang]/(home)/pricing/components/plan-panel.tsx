'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Check } from 'lucide-react';
import type { PricingTranslations } from '@/lib/pricing-translations';
import type { BillingCycle, Entry } from '@/lib/site-mode';
import { cn } from '@/lib/cn';
import { EntryButton, focusRing, tail } from '../../components/ui';

/**
 * 订阅计划：付款周期切换、价格、包含的内容和订阅按钮。
 * 按钮的目标与文案由服务端按主页模式算好传入（lib/site-mode.ts）。
 */
export function PlanPanel({
  t,
  entries,
  entryNote,
}: {
  t: PricingTranslations['plan'];
  entries: Record<BillingCycle, Entry>;
  entryNote: string;
}) {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const yearly = billing === 'yearly';
  const group = useRef<HTMLDivElement>(null);

  // 单选组的键盘操作：Tab 只停在选中的那一项上，方向键在两项之间切换并带走焦点
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const next: BillingCycle = yearly ? 'monthly' : 'yearly';
    setBilling(next);
    group.current?.querySelector<HTMLButtonElement>(`[data-value="${next}"]`)?.focus();
  };

  const option = (value: BillingCycle, label: string, hint?: string) => (
    <button
      type="button"
      role="radio"
      data-value={value}
      aria-checked={billing === value}
      tabIndex={billing === value ? 0 : -1}
      onClick={() => setBilling(value)}
      className={cn(
        // 选中与否用同一个字重：换字重会让按钮宽度变一两个像素，切换时文字跟着挪
        'inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-md px-3.5 text-sm font-medium transition-colors',
        billing === value
          ? 'bg-home-ink text-fd-background'
          : 'text-home-muted hover:text-home-ink',
        focusRing,
      )}
    >
      {label}
      {hint ? (
        <span className={billing === value ? 'opacity-75' : 'text-home-accent'}>{hint}</span>
      ) : null}
    </button>
  );

  return (
    <div className="price-panel p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h2 className="text-[1.0625rem] font-semibold text-home-ink">{t.name}</h2>
        <div
          ref={group}
          role="radiogroup"
          aria-label={t.billingLabel}
          onKeyDown={onKeyDown}
          className="inline-flex gap-1 rounded-lg border border-home-rule bg-home-surface-strong/60 p-1"
        >
          {option('monthly', t.monthly)}
          {option('yearly', t.yearly, t.yearlySaving)}
        </div>
      </div>

      <p className="mt-8 flex h-14 items-baseline gap-2 text-home-ink" aria-live="polite">
        <span className="text-[3.25rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">
          {yearly ? t.priceYearly : t.priceMonthly}
        </span>
        <span className="text-lg text-home-muted">
          {yearly ? t.priceYearlyUnit : t.priceMonthlyUnit}
        </span>
      </p>
      <p className="mt-3 text-[0.9375rem] leading-[1.6] text-home-muted">
        {yearly ? t.yearlyNote : t.monthlyNote}
      </p>

      <EntryButton entry={entries[billing]} className="mt-7 w-full sm:w-auto" />
      {entryNote ? (
        <p className="mt-4 text-[0.875rem] leading-[1.65] text-home-muted">{tail(entryNote)}</p>
      ) : null}

      <ul className="mt-8 list-none space-y-3 border-t border-home-rule p-0 pt-7">
        {t.includes.map((item) => (
          <li key={item} className="flex gap-3 text-[0.9375rem] leading-[1.6] text-home-ink">
            <Check
              className="mt-[0.3em] size-4 shrink-0 text-home-accent"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span>{tail(item)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[0.875rem] leading-[1.65] text-home-muted">{tail(t.modelNote)}</p>
      <p className="mt-1.5 text-[0.875rem] leading-[1.65] text-home-muted">{tail(t.taxNote)}</p>
    </div>
  );
}
