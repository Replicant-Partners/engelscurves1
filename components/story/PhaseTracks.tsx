import { story } from '../../data/storyData';
import { BAND_FILL } from './regionColors';

const W = 820, LEFT = 120, RIGHT = 150, ROW = 46, TOP = 50;
const MIN = 2000, MAX = 50000;
const x = (g: number) => LEFT + ((Math.log(g) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN))) * (W - LEFT - RIGHT);
const usd = (v: number) => `$${Math.round(v / 1000)}k`;
const ACCENT = '#4c78a8';

export function PhaseTracks() {
  const rows = story.tracks;
  const H = TOP + rows.length * ROW + 30;
  const { start, end, startCi, endCi } = story.bounds;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[700px]" role="img" aria-label="Each market's GDP per capita in 2025 and projected 2030, against the three Engel phases">
      <rect x={x(startCi[0])} y={TOP - 14} width={x(startCi[2]) - x(startCi[0])} height={rows.length * ROW + 8} fill="#f6f8fa" />
      <rect x={x(endCi[0])} y={TOP - 14} width={x(endCi[2]) - x(endCi[0])} height={rows.length * ROW + 8} fill="#f6f8fa" />
      <rect x={x(start)} y={TOP - 14} width={x(end) - x(start)} height={rows.length * ROW + 8} fill={BAND_FILL} />
      <line x1={x(start)} x2={x(start)} y1={TOP - 14} y2={TOP + rows.length * ROW - 6} stroke="#1b1f23" strokeDasharray="3 3" />
      <line x1={x(end)} x2={x(end)} y1={TOP - 14} y2={TOP + rows.length * ROW - 6} stroke="#1b1f23" strokeDasharray="3 3" />
      <text x={(LEFT + x(start)) / 2} y={22} textAnchor="middle" fontSize="12" fill="#57606a" letterSpacing="1.2">PRE-INFLECTION</text>
      <text x={(x(start) + x(end)) / 2} y={22} textAnchor="middle" fontSize="12" fill="#1b1f23" fontWeight={600} letterSpacing="1.2">TRANSITION</text>
      <text x={(x(end) + (W - RIGHT)) / 2} y={22} textAnchor="middle" fontSize="12" fill="#57606a" letterSpacing="1.2">POST-INFLECTION</text>
      <text x={W - RIGHT + 14} y={22} fontSize="11" fill="#57606a">P(leaves transition</text>
      <text x={W - RIGHT + 14} y={35} fontSize="11" fill="#57606a">by 2030)</text>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
        </marker>
      </defs>
      {rows.map((r, i) => {
        const y = TOP + i * ROW + 10;
        const inTransition = r.gdp2025 >= start && r.gdp2025 < end;
        const prob = r.gdp2025 >= end ? 'already past' : r.gdp2025 < start ? 'pre-inflection' : `${Math.round(r.pExit2030 * 100)}%`;
        return (
          <a key={r.iso3} href={'/story?highlight=' + r.iso3 + '#motion'} aria-label={'Trace ' + r.country + ' in chapter 3'} className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4c78a8]">
          <g style={{ cursor: 'pointer' }}>
            <title>{'Trace ' + r.country + ' in chapter 3 (In motion)'}</title>
            <text x={LEFT - 12} y={y + 4} textAnchor="end" fontSize="13" fill="#1b1f23" fontWeight={inTransition ? 600 : 400} className="group-hover:underline">{r.country}</text>
            <line x1={LEFT} x2={W - RIGHT} y1={y} y2={y} stroke="#e1e4e8" />
            <line x1={x(r.gdp2025)} x2={x(r.gdp2030) - 4} y1={y} y2={y} stroke={ACCENT} strokeWidth={2} markerEnd="url(#arrow)" />
            <circle cx={x(r.gdp2025)} cy={y} r={5} fill="#1b1f23" />
            <text x={(x(r.gdp2025) + x(r.gdp2030)) / 2} y={y - 8} textAnchor="middle" fontSize="10" fill="#57606a">{(r.food2025 * 100).toFixed(1)}% &rarr; {(r.food2030 * 100).toFixed(1)}%</text>
            <text x={W - RIGHT + 14} y={y + 4} fontSize="13" fill={inTransition ? '#1b1f23' : '#57606a'} fontWeight={inTransition ? 600 : 400}>{prob}</text>
            <text x={W - 16} y={y + 5} fontSize="14" fill="#4c78a8" className="opacity-0 group-hover:opacity-100">&rsaquo;</text>
          </g>
          </a>
        );
      })}
      {[2000, 5000, 10000, 20000, 50000].map((g) => (
        <text key={g} x={x(g)} y={TOP + rows.length * ROW + 14} textAnchor="middle" fontSize="11" fill="#57606a">{usd(g)}</text>
      ))}
      <circle cx={LEFT + 4} cy={H - 6} r={4} fill="#1b1f23" />
      <text x={LEFT + 14} y={H - 2} fontSize="11" fill="#57606a">2025 (World Bank)</text>
      <line x1={LEFT + 140} x2={LEFT + 170} y1={H - 6} y2={H - 6} stroke={ACCENT} strokeWidth={2} markerEnd="url(#arrow)" />
      <text x={LEFT + 178} y={H - 2} fontSize="11" fill="#57606a">2030 (IMF growth path)</text>
      <text x={LEFT + 340} y={H - 2} fontSize="11" fill="#57606a">Grey: food share 2025 &rarr; 2030. Bands: 90% intervals.</text>
    </svg>
  );
}
