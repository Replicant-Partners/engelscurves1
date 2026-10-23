import { dollarStreet } from '../../data/dollarStreet';

const W = 860, LEFT = 150, RIGHT = 70, ROW = 30, TOP = 74;
const MIN = 24, MAX = 16000;
const x = (v: number) => LEFT + ((Math.log(v) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN))) * (W - LEFT - RIGHT);
const ACCENT = '#4c78a8';

export function DollarStreetStrip() {
  const rows = dollarStreet.markets;
  const H = TOP + rows.length * ROW + 40;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[700px]" role="img" aria-label="Dollar Street families in the twelve markets, by consumption per adult per month">
      <text x={LEFT} y={16} fontSize="12" fill="#57606a">All {dollarStreet.usable} Dollar Street families, poorest to richest (consumption per adult, $/month, PPP, log scale)</text>
      {dollarStreet.globalIncomes.map((v, i) => (
        <line key={i} x1={x(v)} x2={x(v)} y1={24} y2={38} stroke="#d0d7de" strokeWidth={1} />
      ))}
      <line x1={x(dollarStreet.kharasMonthly)} x2={x(dollarStreet.kharasMonthly)} y1={22} y2={TOP + rows.length * ROW} stroke="#1b1f23" strokeDasharray="4 3" />
      <text x={x(dollarStreet.kharasMonthly) + 5} y={50} fontSize="11" fill="#1b1f23">middle-class entry ~${dollarStreet.kharasMonthly}/month ($11/day)</text>
      {rows.map((m, i) => {
        const y = TOP + i * ROW + 8;
        return (
          <a key={m.iso3} href={`https://www.gapminder.org/dollar-street?countries=${m.c2}`} target="_blank" rel="noreferrer" className="group" aria-label={`Open ${m.country} on Dollar Street`}>
            <title>{`Open ${m.country} on Dollar Street`}</title>
            <text x={LEFT - 10} y={y + 4} textAnchor="end" fontSize="12.5" fill="#1b1f23" className="group-hover:underline">{m.country}</text>
            <line x1={LEFT} x2={W - RIGHT} y1={y} y2={y} stroke="#eef0f2" />
            {m.n > 0 ? (
              <>
                <line x1={x(m.min!)} x2={x(m.max!)} y1={y} y2={y} stroke="#9aa4ae" strokeWidth={1.2} />
                {m.incomes.map((v, k) => <circle key={k} cx={x(v)} cy={y} r={3.2} fill="#1b1f23" fillOpacity={0.45} />)}
                <line x1={x(m.median!)} x2={x(m.median!)} y1={y - 7} y2={y + 7} stroke={ACCENT} strokeWidth={2.5} />
                <text x={W - RIGHT + 8} y={y + 4} fontSize="11" fill="#57606a">{m.n} {m.n === 1 ? 'family' : 'families'}</text>
              </>
            ) : (
              <text x={LEFT + 4} y={y + 4} fontSize="11" fill="#57606a">no families documented yet &mdash; open the global street</text>
            )}
          </a>
        );
      })}
      {[25, 50, 100, 335, 1000, 3000, 10000].map((v) => (
        <text key={v} x={x(v)} y={TOP + rows.length * ROW + 16} textAnchor="middle" fontSize="11" fill="#57606a">${v >= 1000 ? `${v / 1000}k` : v}</text>
      ))}
      <circle cx={LEFT + 4} cy={H - 6} r={3.2} fill="#1b1f23" fillOpacity={0.45} />
      <text x={LEFT + 13} y={H - 2} fontSize="11" fill="#57606a">one family</text>
      <line x1={LEFT + 86} x2={LEFT + 86} y1={H - 12} y2={H} stroke={ACCENT} strokeWidth={2.5} />
      <text x={LEFT + 94} y={H - 2} fontSize="11" fill="#57606a">median</text>
      <text x={LEFT + 150} y={H - 2} fontSize="11" fill="#57606a">Click a country to visit its homes on Dollar Street.</text>
    </svg>
  );
}
