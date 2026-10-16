import Link from 'fumadocs-core/link';
import { type ReactNode, Suspense } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import {
  getNotFoundTranslations,
  type NotFoundTranslations,
} from '@/lib/translations';

export interface Suggestion {
  id: string;
  href: string;
  title: ReactNode;
}

export interface NotFoundProps {
  /** 当前语言 */
  locale?: string;
  /** 可选的建议获取函数，不提供则显示简单的返回首页按钮 */
  getSuggestions?: () => Promise<Suggestion[]>;
}

export function NotFound({
  locale = 'en',
  getSuggestions,
}: NotFoundProps) {
  const t = getNotFoundTranslations(locale);

  return (
    <div
      data-not-found
      className="flex flex-col items-center justify-center text-center gap-4 flex-1 p-8"
    >
      <h1 className="text-4xl font-bold font-mono">{t.title}</h1>
      <div className="w-full border border-fd-foreground/50 border-dashed p-4 max-w-[400px]">
        {getSuggestions ? (
          <Suspense
            fallback={
              <p className="text-sm text-fd-muted-foreground">
                {t.findingAlternatives}
              </p>
            }
          >
            <Alternative getSuggestions={getSuggestions} t={t} />
          </Suspense>
        ) : (
          <SimpleReturn t={t} />
        )}
      </div>
    </div>
  );
}

function SimpleReturn({ t }: { t: NotFoundTranslations }) {
  return (
    <div>
      <p className="mb-2">{t.pageNotFound}</p>
      <Link href="/" className={cn(buttonVariants({ variant: 'secondary' }))}>
        {t.returnToHome}
      </Link>
    </div>
  );
}

// 使用 Orama Cloud 查找相关文档，进行建议
async function Alternative({
  getSuggestions,
  t,
}: {
  getSuggestions: () => Promise<Suggestion[]>;
  t: NotFoundTranslations;
}) {
  const suggestions = await getSuggestions();

  if (suggestions.length === 0) {
    return (
      <div>
        <p className="mb-2">{t.pageNotFound}</p>
        <Link href="/" className={cn(buttonVariants({ variant: "secondary" }))}>
          {t.returnToHome}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">{t.maybeYouAreLookingFor}</h2>

      <div className="flex flex-col gap-2">
        {suggestions.map((doc) => (
          <Link
            key={doc.id}
            href={doc.href}
            className="block text-sm p-3 rounded-lg border bg-fd-card text-fd-card-foreground shadow-md transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium">{doc.title}</p>
            <p className="text-fd-muted-foreground">{doc.href}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
