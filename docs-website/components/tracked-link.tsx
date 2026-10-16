'use client';

import type { ComponentProps } from 'react';
import Link, { type LinkProps } from 'fumadocs-core/link';
import { track } from '@vercel/analytics';

/** 点击时上报的事件：事件名，和唯一的属性 source（入口位置） */
export interface TrackEvent {
  event: string;
  source: string;
}

/** 原生链接，点击时上报一次。/waitlist 这类服务端跳转路由用它，不走客户端路由预取 */
export function TrackedAnchor({
  event,
  source,
  ...props
}: Omit<ComponentProps<'a'>, 'onClick'> & TrackEvent) {
  return <a {...props} onClick={() => track(event, { source })} />;
}

/** fumadocs-core/link 的站内链接，点击时上报一次 */
export function TrackedLink({
  event,
  source,
  ...props
}: Omit<LinkProps, 'onClick'> & TrackEvent) {
  return <Link {...props} onClick={() => track(event, { source })} />;
}
