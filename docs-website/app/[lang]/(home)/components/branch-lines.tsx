import type { CSSProperties } from 'react';

export interface Segment {
  d: string;
  color: string;
  /** 进入视口后多久开始画，毫秒 */
  at?: number;
}

/**
 * 一张图里的全部分支线，放在 `<svg>` 里用。每一段是 2px 的线芯加一圈同色的光晕。
 *
 * 光晕统一放在一个带透明度的组里、画在所有线芯的下面：几段在接头处叠在一起时互相盖住，
 * 不会越叠越亮。所以一张图里所有的线要一次传进来，不要分几次调用。
 * 形状卡和价格那两张小图不用它：那里的线细一档，不带光晕。
 * halo 为 false 时只画线芯：线在那张图里不是主角时用，粗细由那张图自己的样式定。
 */
export function BranchLines({ segments, halo = true }: { segments: Segment[]; halo?: boolean }) {
  const style = ({ color, at = 0 }: Segment) => ({ color, '--d': `${at}ms` }) as CSSProperties;
  return (
    <>
      {halo ? (
        <g className="lane-halos">
          {segments.map((segment, i) => (
            <path key={i} className="lane-halo" d={segment.d} style={style(segment)} />
          ))}
        </g>
      ) : null}
      {segments.map((segment, i) => (
        <path key={i} className="lane-core lane-draw" d={segment.d} pathLength={1} style={style(segment)} />
      ))}
    </>
  );
}
