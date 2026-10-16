import { cn } from '@/lib/cn';

/**
 * CodeDAG 标志：减半切片。右边是半圆，左边是三片逐片减半的切片，最左留一条空。
 * 圆的直径分成 26 份：半圆、三片、留空宽 12、4、2、1、1 份，三道缝各 2 份（约占直径的 7.7%）。
 * 框就是圆，外部不留边。
 * 半圆用 currentColor，跟着文字色走；三片用主题紫 --home-accent（浅色 #7632ec，深色 #b899ff）。
 * 与 public/brand/ 下的素材、App 站的 CodeDagMark 同形。
 *
 * 尺寸由 className 决定。26 像素（size-6.5）时每份正好 1 像素，竖边都落在整像素上，
 * 1 倍屏上也清楚，导航栏、页脚用这个尺寸；其他尺寸 36 像素以上用。
 */
export function CodeDagMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 26 26"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path fill="currentColor" d="M14 0.039A13 13 0 0 1 14 25.961Z" />
      <path
        className="fill-home-accent"
        d="M8 1A13 13 0 0 1 12 0.039L12 25.961A13 13 0 0 1 8 25ZM4 3.619A13 13 0 0 1 6 2.046L6 23.954A13 13 0 0 1 4 22.381ZM1 8A13 13 0 0 1 2 6.072L2 19.928A13 13 0 0 1 1 18Z"
      />
    </svg>
  );
}
