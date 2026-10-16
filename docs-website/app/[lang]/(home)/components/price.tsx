import { exampleTasks, type HomepageTranslations } from '@/lib/homepage-translations';
import { Beats, Container, TextLink, tail } from './ui';

/** 示例工作流六个节点在小图里的位置 */
const AT: Record<number, [number, number]> = {
  1: [22, 62],
  2: [107, 22],
  3: [107, 62],
  4: [107, 102],
  5: [193, 62],
  6: [278, 62],
};

/** 小卡的半宽和半高，和形状卡里的小卡一样大 */
const CHIP = { w: 22, h: 12 };

/**
 * 价格摘要：左边用首屏那张六个任务的图说明“一个任务扣 1 点”，右边是三个大数字。
 * 小图和形状卡是同一种画法：任务是白色的小卡，里面一个 Agent 颜色的圆点，这里圆点后面写着它计的点数。
 * 口径与定价页一致，完整内容与常见问题在定价页。
 */
export function Price({ t, docsPrefix }: { t: HomepageTranslations; docsPrefix: string }) {
  const p = t.pricing;
  return (
    <section className="home-section">
      {/* 左七右五：面板里最长的一行也只有三百来像素宽，对半分时它右边空着一大截，
          左边的中文标题却差十几个像素放不进一行 */}
      <Container className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-sm font-medium text-home-accent">{p.label}</p>
          <h2 className="home-h2 mt-3">
            <Beats value={p.title} />
          </h2>

          <svg viewBox="0 0 300 124" role="img" aria-label={p.exampleLabel} className="price-graph mt-10">
            <g className="price-edges">
              {exampleTasks.flatMap((task) =>
                task.dependencies.map((from) => {
                  // 线接在小卡的左右边缘上，水平出发、水平到达
                  const [x1, y1] = [AT[from][0] + CHIP.w, AT[from][1]];
                  const [x2, y2] = [AT[task.id][0] - CHIP.w, AT[task.id][1]];
                  const mid = (x1 + x2) / 2;
                  return <path key={`${from}-${task.id}`} d={`M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`} />;
                }),
              )}
            </g>
            <g className="price-nodes">
              {exampleTasks.map((task) => {
                const [x, y] = AT[task.id];
                return (
                  <g key={task.id} className={`price-node price-node-${task.agent}`}>
                    <rect
                      x={x - CHIP.w + 0.5}
                      y={y - CHIP.h + 0.5}
                      width={CHIP.w * 2 - 1}
                      height={CHIP.h * 2 - 1}
                      rx="7.5"
                    />
                    <circle cx={x - 9} cy={y} r="3" />
                    <text x={x + 6} y={y + 4.5} textAnchor="middle" aria-hidden="true">
                      1
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          <p className="mt-6 max-w-120 text-[1.0625rem] leading-[1.7] text-home-muted">
            {tail(p.example)}
          </p>
          <p className="mt-6">
            <TextLink href={`${docsPrefix}/pricing`} solo track={{ event: 'pricing', source: 'home' }}>
              {p.link}
            </TextLink>
          </p>
        </div>

        <div className="lg:col-span-5">
          <dl className="price-panel">
            {p.figures.map((figure) => (
              <div key={figure.unit} className="price-row">
                <dt className="price-figure">
                  <span className="price-value">{figure.value}</span>
                  <span className="price-unit">{figure.unit}</span>
                </dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-[1.55] text-home-muted">{tail(figure.note)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm leading-[1.65] text-home-muted">{tail(p.modelNote, 22)}</p>
        </div>
      </Container>
    </section>
  );
}
