'use client';

import { Analytics as VercelAnalytics, type BeforeSend } from '@vercel/analytics/next';

/** 只有这两处上报：生产域名，和本地开发（开发时是调试模式，只在控制台打印，不发请求） */
const REPORTED_HOSTS = new Set(['codedag.com', 'localhost']);

// 放在模块顶层，引用不变：Analytics 在 beforeSend 换了引用时会重新登记一次
const beforeSend: BeforeSend = (event) =>
  REPORTED_HOSTS.has(window.location.hostname) ? event : null;

/**
 * Vercel Web Analytics。*.vercel.app 预览和公开仓库的 fork 部署都不上报；
 * 不用 Cookie，自定义事件只带入口位置 source（见 components/tracked-link.tsx）。
 * beforeSend 是函数，不能从服务端组件作为属性传进来，所以在这里包一层。
 */
export function Analytics() {
  return <VercelAnalytics beforeSend={beforeSend} />;
}
