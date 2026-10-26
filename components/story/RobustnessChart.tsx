'use client';
import { story } from '../../data/storyData';

const W = 820, LEFT = 300, RIGHT = 120, ROW = 34, TOP = 30;
const MIN = 4000, MAX = 11000;
const x = (g: number) => LEFT + ((Math.log(g) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN))) * (W - LEFT - RIGHT);
const usd = (v: number) => `$${(v / 1000).toFixed(1)}k`;

export function RobustnessChart() {
  const rows = story.robustness.variants;
  const [lo, , hi] = story.bounds.startCi;
  const H = TOP + rows.length * ROW + 34;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[700px]" role="img" aria-label="Estimated break point in five subsamples of the survey data">
      <rect x={x(lo)} y={TOP - 12} width={x(hi) - x(lo)} height={rows.length * ROW} fill="#f2f4f7" />
      <line x1={x(story.bounds.start)} x2={x(story.bounds.start)} y1={TOP - 12} y2={TOP + rows.length * ROW - 12} stroke="#1b1f23" strokeDasharray="3 3" />
      <text x={x(story.bounds.start)} y={TOP - 18} textAnchor="middle" fontSize="11" fill="#1b1f23">Main estimate {usd(story.bounds.start)}</text>
      <text x={W - RIGHT + 14} y={TOP - 18} fontSize="11" fill="#57606a">sup-F (5% crit. 8.85)</text>
      {rows.map((r, i) => {
        const y = TOP + i * ROW + 6;
        return (
          <g key={r.label}>
            <text x={LEFT - 14} y={y + 4} textAnchor="end" fontSize="12" fill="#1b1f23">{r.label} <tspan fill="#57606a">(n={r.n})</tspan></text>
            <line x1={x(MIN)} x2={W - RIGHT} y1={y} y2={y} stroke="#e1e4e8" />
            <circle cx={x(r.knot)} cy={y} r={6} fill={r.significant ? '#4c78a8' : 'white'} stroke="#4c78a8" strokeWidth={2} />
            <text x={x(r.knot) + 11} y={y + 4} fontSize="11" fill="#1b1f23">{usd(r.knot)}</text>
            <text x={W - RIGHT + 14} y={y + 4} fontSize="12" fill={r.significant ? '#1b1f23' : '#57606a'}>{r.supF.toFixed(1)}{r.significant ? '' : ' (borderline)'}</text>
          </g>
        );
      })}
      {[4000, 5000, 6000, 8000, 10000].map((g) => (
        <text key={g} x={x(g)} y={H - 14} textAnchor="middle" fontSize="11" fill="#57606a">{usd(g)}</text>
      ))}
      <text x={x(MIN)} y={H} fontSize="10" fill="#57606a">Shaded: bootstrap 90% interval of the main estimate ({usd(lo)}&ndash;{usd(hi)}). Hollow dot: not significant at 5%.</text>
    </svg>
  );
}
