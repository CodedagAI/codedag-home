import { type NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { i18n } from '@/lib/i18n';

const { rewrite: rewriteLLM } = rewritePath('/docs/*path', '/llms.mdx/*path');

/**
 * Custom i18n proxy for Next.js 16
 *
 * This proxy handles language routing with the following behavior:
 * - Paths without language prefix (e.g., /docs/overview) are rewritten to the default language route
 * - Paths with non-default language prefix (e.g., /zh/docs/overview) are passed through
 * - Paths with default language prefix (e.g., /en/docs/overview) are NOT redirected, they will 404
 *
 * This differs from fumadocs' default hideLocale: 'default-locale' behavior which
 * would redirect /en/... to /...
 */
export function proxy(request: NextRequest, _event: NextFetchEvent) {
  // Handle markdown content negotiation
  if (isMarkdownPreferred(request)) {
    const result = rewriteLLM(request.nextUrl.pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  // Custom i18n routing (different from fumadocs createI18nMiddleware)
  const url = request.nextUrl;
  const { languages, defaultLanguage } = i18n;

  // Check if the path already has a language prefix
  const pathLocale = languages.find(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`,
  );

  // If path has the default language prefix (/en), rewrite to a non-existent path to trigger 404
  // We cannot simply return NextResponse.next() because [lang] route would match 'en'
  if (pathLocale === defaultLanguage) {
    const notFoundUrl = new URL(request.url);
    notFoundUrl.pathname = `/__locale_not_allowed${url.pathname}`;
    // Set locale header for not-found page
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', defaultLanguage);
    return NextResponse.rewrite(notFoundUrl, {
      request: { headers: requestHeaders },
    });
  }

  // If path has other language prefix (zh, ja), pass through normally with locale header
  if (pathLocale) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', pathLocale);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // No prefix path -> rewrite to default language route
  const next = new URL(request.url);
  next.pathname = `/${defaultLanguage}${url.pathname}`;
  // Set locale header for not-found page
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', defaultLanguage);
  return NextResponse.rewrite(next, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, `/_vercel/` (Web Analytics 的脚本与上报路径，
  // 不能被加上语言前缀), the root-level routes that have no language version
  // (robots.txt、sitemap.xml、llms.txt、llms-full.txt、static.json 和 llms.mdx/**；
  // 加上语言前缀就会 404), the `.md`/`.mdx` document URLs that next.config.ts
  // rewrites to llms.mdx/** (加了前缀就匹配不上改写规则，会渲染成页面),
  // static assets, and files with extensions
  matcher: ['/((?!api|_vercel|_next/static|_next/image|favicon.ico|(?:robots\\.txt|sitemap\\.xml|llms\\.txt|llms-full\\.txt|static\\.json)$|llms\\.mdx(?:/|$)|.*\\.(?:md|mdx|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$).*)'],
};
