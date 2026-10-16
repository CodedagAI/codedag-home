import { NextResponse, type NextRequest } from 'next/server';
import { siteConfig, type SupportedLanguage } from '@/lib/config';

/**
 * Waitlist 跳转路由：/waitlist、/zh/waitlist、/ja/waitlist。
 *
 * 站内所有 Waitlist 入口都指向这里，由它 302 到当前语言的 Tally 表单，
 * 并把 lang 与入口位置 source 作为查询参数带过去（Tally 用它们填充同名隐藏字段）。
 * 不渲染页面，不加载任何 Tally 脚本；以后更换表单工具时只改这里的跳转目标。
 */

const SOURCE_PATTERN = /^[a-z0-9-]{1,40}$/;

function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return (siteConfig.languages as readonly string[]).includes(lang);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  if (!isSupportedLanguage(lang)) {
    return new NextResponse(null, { status: 404 });
  }

  const source = request.nextUrl.searchParams.get('source') ?? '';
  const target = new URL(`https://tally.so/r/${siteConfig.waitlistForms[lang]}`);
  target.searchParams.set('lang', lang);
  target.searchParams.set('source', SOURCE_PATTERN.test(source) ? source : 'direct');

  return NextResponse.redirect(target, 302);
}
