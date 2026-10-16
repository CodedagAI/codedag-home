import type { Metadata } from 'next/types';
import { notFound } from 'next/navigation';
import Link from 'fumadocs-core/link';
import { policies } from 'fumadocs-mdx:collections/server';
import { Email } from '@/components/email';
import { getMDXComponents } from '@/mdx-components';
import { createMetadata, generateAlternates, shareImage } from '@/lib/metadata';
import { i18n } from '@/lib/i18n';
import { getFooterTranslations } from '@/lib/translations';
import {
  POLICY_KINDS,
  formatEffectiveDate,
  getPolicyLabels,
  policyContacts,
  policyFacts,
  type PolicyKind,
} from '@/lib/policies';
import { cn } from '@/lib/cn';
import { focusRing, textLinkClass } from './ui';

/** 一份政策在某种语言下的正文（content/policies/）；默认语言的文件不带语言后缀 */
function getPolicy(kind: PolicyKind, lang: string) {
  const file = lang === i18n.defaultLanguage ? `${kind}.mdx` : `${kind}.${lang}.mdx`;
  const entry = policies.find((item) => item.info.path === file);
  if (!entry) notFound();
  return entry;
}

/** 三份政策页共用的元数据：标题与描述取自正文的 frontmatter，三种语言各一份 */
export function policyMetadata(kind: PolicyKind, lang: string): Metadata {
  const policy = getPolicy(kind, lang);
  const alternates = generateAlternates(`/${kind}`, lang);
  const images = shareImage(lang);

  return createMetadata({
    title: policy.title,
    description: policy.description,
    alternates,
    openGraph: { url: alternates.canonical, images },
    twitter: { images },
  });
}

/**
 * 三份政策页共用的版式：顶部是三份政策之间的切换，页首写法定名称、生效日期和这份政策的联系邮箱，
 * 下面是正文。三种语言、三份政策的页首都从 lib/policies.ts 取值，不各写一遍
 */
export function PolicyPage({ kind, lang }: { kind: PolicyKind; lang: string }) {
  const policy = getPolicy(kind, lang);
  const Body = policy.body;
  const labels = getPolicyLabels(lang);
  const footer = getFooterTranslations(lang);
  const prefix = lang === i18n.defaultLanguage ? '' : `/${lang}`;
  const names: Record<PolicyKind, string> = {
    terms: footer.termsOfService,
    privacy: footer.privacyPolicy,
    refund: footer.refundPolicy,
  };

  return (
    <main className="bg-fd-background text-home-ink antialiased">
      <div className="mx-auto w-full max-w-[760px] px-5 pt-12 pb-20 sm:px-8 sm:pt-16 lg:pb-28">
        <nav aria-label={labels.nav}>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {POLICY_KINDS.map((item) => (
              <li key={item}>
                <Link
                  href={`${prefix}/${item}`}
                  aria-current={item === kind ? 'page' : undefined}
                  className={cn(
                    'inline-block rounded-sm py-1 transition-colors',
                    item === kind
                      ? 'font-medium text-home-ink'
                      : 'text-home-muted hover:text-home-ink',
                    focusRing,
                  )}
                >
                  {names[item]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <h1 className="mt-10 text-[2rem] font-semibold leading-[1.2] tracking-tight sm:text-[2.5rem]">
          {policy.title}
        </h1>
        {policy.description ? (
          <p className="mt-4 text-[1.0625rem] leading-[1.7] text-home-muted">{policy.description}</p>
        ) : null}

        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-y border-home-rule py-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-home-muted">{labels.provider}</dt>
            <dd className="mt-1 font-medium">{policyFacts.legalName}</dd>
          </div>
          <div>
            <dt className="text-home-muted">{labels.effective}</dt>
            <dd className="mt-1 font-medium">
              <time dateTime={policyFacts.effectiveDate}>{formatEffectiveDate(lang)}</time>
            </dd>
          </div>
          <div>
            <dt className="text-home-muted">{labels.contact}</dt>
            <dd className="mt-1">
              <Email user={policyContacts[kind]} className={textLinkClass()} />
            </dd>
          </div>
        </dl>

        <article className="prose mt-10 max-w-none">
          <Body components={getMDXComponents()} />
        </article>
      </div>
    </main>
  );
}
