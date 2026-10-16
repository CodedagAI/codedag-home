'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';

/**
 * 进入视口时给自己标上 data-inview="true"，里面的画面据此播放一次自己的过程。
 *
 * 没有脚本时不带这个属性，样式显示的是完成状态；脚本接管后，还没进入视口的先回到
 * 起始状态（"false"），进入时播放。用户选择减少动态效果时不做任何标记，一直是完成状态。
 */
export function Reveal(props: ComponentProps<'div'>) {
  const root = useRef<HTMLDivElement>(null);
  const [inview, setInview] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const element = root.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setInview(false);
    // 顶边越过视口下方四分之一处就算进入：比视口还高的画面也能触发
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInview(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -24% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={root} data-inview={inview} {...props} />;
}
