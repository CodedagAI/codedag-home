import '../global.css';
import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextProvider } from 'fumadocs-core/framework/next';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { source } from '@/lib/source';
import { Body } from '@/app/layout.client';
import { Analytics } from '@/components/analytics';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { I18nProvider } from './provider';

export const metadata = createMetadata({
  title: {
    template: '%s | CodeDAG',
    default: 'CodeDAG',
  },
  description:
    'Write a batch of development tasks as one workflow file and let CodeDAG run it across Claude Code and Codex.',
  metadataBase: baseUrl,
  // 标签页图标：浅色、深色各一个 ICO，用 media 区分，深色排在后面；每个 ICO 里有
  // 16、32 两帧，浏览器按屏幕倍率挑帧。这里写了 icons，app/ 下的图标文件就不再生效，
  // 主屏幕图标也在这里声明。
  icons: {
    icon: [
      { url: '/icon-light.ico', type: 'image/x-icon', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.ico', type: 'image/x-icon', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
});

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

/**
 * <html lang> 的取值。中文写 zh-CN：浏览器据此选简体中文的字形，
 * app/home.css 里的 [lang='zh-CN'] 规则也按它匹配。
 * 不在三种语言之内的段（如 proxy.ts 为 /en/... 改写出的 404 路径）按英文处理。
 */
const HTML_LANG: Record<string, string> = { en: 'en', zh: 'zh-CN', ja: 'ja' };

/**
 * 根布局放在 [lang] 下，<html lang> 才能按当前语言输出。
 * app/ 下其余的路由（api、og、llms、static.json、sitemap、robots）都是路由处理器，不需要布局。
 */
export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <html
      lang={HTML_LANG[lang] ?? 'en'}
      className={`${geist.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.getPageTree(lang)}>
            <I18nProvider lang={lang}>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex flex-1 flex-col">{children}</div>
                <Footer />
              </div>
            </I18nProvider>
          </TreeContextProvider>
        </NextProvider>
        <Analytics />
      </Body>
    </html>
  );
}
