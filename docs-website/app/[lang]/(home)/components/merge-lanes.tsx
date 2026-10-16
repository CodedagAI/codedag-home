import { BranchLines, type Segment } from './branch-lines';

/** 四条分支线在画面里的高度（按 224 高的画面计）与颜色，颜色与全页一致 */
const LANES: { y: number; color: string }[] = [
  { y: 26, color: 'var(--agent-claude)' },
  { y: 78, color: 'var(--agent-codex)' },
  { y: 150, color: 'var(--agent-claude)' },
  { y: 198, color: 'var(--agent-codex)' },
];

function side(mirrored: boolean, width: number, height: number): Segment[] {
  const x = (value: number) => (mirrored ? width - value : value);
  const mid = height / 2;
  const join = width * 0.3;
  const bend = width * 0.17;
  return [
    ...LANES.map(({ y, color }, i) => {
      const from = (y / 224) * height;
      return { d: `M${x(0)} ${from}C${x(bend)} ${from} ${x(bend)} ${mid} ${x(join)} ${mid}`, color, at: i * 90 };
    }),
    { d: `M${x(join)} ${mid}H${width / 2}`, color: 'var(--engine)', at: 620 },
  ];
}

/**
 * 合流的分支线：从左边、右边或两边进来，在离边缘三成宽的地方合成一条品牌色的线，走到正中。
 * 收尾舞台与定价页页头共用。
 *
 * 画在 width×height 的坐标里（默认 1000×224）。线的粗细是按坐标画的，所以坐标要和实际显示的
 * 尺寸差不多：同一组线被横向压扁或拉长太多，陡的那几段会明显变细或变粗。窄的地方另给一组
 * 窄的坐标，不靠拉伸。
 */
export function MergeLanes({
  from,
  width = 1000,
  height = 224,
}: {
  from: 'left' | 'right' | 'both';
  width?: number;
  height?: number;
}) {
  return (
    <BranchLines
      segments={[
        ...(from === 'right' ? [] : side(false, width, height)),
        ...(from === 'left' ? [] : side(true, width, height)),
      ]}
    />
  );
}
