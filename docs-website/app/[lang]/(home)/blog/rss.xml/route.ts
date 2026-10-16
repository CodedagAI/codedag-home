import { Feed } from 'feed';
import { blog } from '@/lib/source';
import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export const revalidate = false;

const baseUrl = siteConfig.baseUrl;

export function GET() {
  const pages = blog.getPages();

  // 还没有文章时博客不上线：RSS 返回 404
  if (pages.length === 0) return new NextResponse(null, { status: 404 });

  const feed = new Feed({
    title: `${siteConfig.siteName} Blog`,
    id: `${baseUrl}/blog`,
    link: `${baseUrl}/blog`,
    language: 'en',

    image: `${baseUrl}/og.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `All rights reserved 2025, ${siteConfig.siteName}`,
  });

  for (const page of pages.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  })) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(page.data.date),

      author: [
        {
          name: page.data.author,
        },
      ],
    });
  }

  return new NextResponse(feed.rss2());
}
