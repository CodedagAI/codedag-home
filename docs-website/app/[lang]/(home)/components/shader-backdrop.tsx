'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const MeshGradient = dynamic(
  () => import('./mesh-gradient').then((module) => module.MeshGradient),
  { ssr: false },
);

/**
 * 着色器的五种颜色写在 home.css 里（--stage-shader-1 到 -5），浅色与深色主题各一组，
 * 和 .stage 的静态渐变是同一个紫
 */
const COLOR_VARS = [1, 2, 3, 4, 5].map((n) => `--stage-shader-${n}`);

/**
 * 舞台背景里缓慢流动的一层。只用在首屏和收尾两处。
 *
 * 它是锦上添花的东西：进入视口后才加载，加载前和浏览器没有 WebGL 时，
 * 看到的是 .stage 自己的静态渐变；离开视口、用户选择减少动态效果，或者舞台被暂停时停止流动。
 */
export function ShaderBackdrop({ paused = false }: { paused?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [moving, setMoving] = useState(false);
  const [ready, setReady] = useState(false);
  const [colors, setColors] = useState<string[] | null>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl2')) return;

    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setMounted(true);
      setMoving(entry.isIntersecting && !still.matches);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element || !mounted) return;

    const read = () => {
      const style = getComputedStyle(element);
      const next = COLOR_VARS.map((name) => style.getPropertyValue(name).trim());
      setColors((prev) => {
        // 变量没取到时不画，留着 .stage 的静态渐变
        if (!next.every(Boolean)) return null;
        return prev?.join() === next.join() ? prev : next;
      });
    };
    read();

    // 主题切换是给 <html> 换 class：换了就重读，着色器当场换色。
    // 不靠 next-themes 的 useTheme() 触发：这里的副作用先于主题提供者的执行，那一刻读到的还是旧主题的变量
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    // 着色器画出第一帧之后再淡入，免得闪一下空画布
    const timer = window.setTimeout(() => setReady(true), 500);
    return () => window.clearTimeout(timer);
  }, [mounted]);

  return (
    <div ref={root} className="stage-shader" data-ready={ready} aria-hidden="true">
      {mounted && colors ? (
        <MeshGradient
          colors={colors}
          distortion={0.7}
          swirl={0.2}
          speed={moving && !paused ? 0.22 : 0}
          minPixelRatio={1}
          maxPixelCount={1280 * 720}
          style={{ width: '100%', height: '100%' }}
        />
      ) : null}
    </div>
  );
}
