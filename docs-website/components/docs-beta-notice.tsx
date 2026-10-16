import { Callout } from 'fumadocs-ui/components/callout';
import { TrackedAnchor } from '@/components/tracked-link';
import { getStartEntry, siteMode } from '@/lib/site-mode';
import { getDocsPageTranslations } from '@/lib/translations/docs-page';

/**
 * 文档页标题下方的内测提示：内测尚未开始、安装暂未开放、可以加入 Waitlist。
 * 只在 waitlist 模式下显示，切到 beta、live 后自动消失；不逐页写进正文。
 */
export function DocsBetaNotice({ lang }: { lang: string }) {
  if (siteMode !== 'waitlist') return null;

  const entry = getStartEntry(lang, 'docs');
  const t = getDocsPageTranslations(lang).betaNotice;

  return (
    <Callout className="my-3">
      {t.before}
      {/* /waitlist 是服务端跳转路由，用原生链接，不走客户端路由预取 */}
      <TrackedAnchor
        href={entry.href}
        event="cta"
        source={entry.source}
        className="font-medium text-fd-foreground underline decoration-fd-primary/60 underline-offset-4 transition-colors hover:decoration-fd-primary"
      >
        {entry.label}
      </TrackedAnchor>
      {t.after}
    </Callout>
  );
}
