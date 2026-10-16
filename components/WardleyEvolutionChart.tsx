'use client'
// Priority 4 — Wardley-style spending category evolution by income level
// Shows how household spending categories move along the evolution axis
// (Genesis → Custom → Product → Commodity) as per-capita income rises
// Framework: Wardley Maps (Simon Wardley, 2016)
// Data: Engel curve research + World Bank income data [INF/JDG]

const INCOME_LEVELS = [3000, 6000, 10000, 15000, 20000, 30000]
const INCOME_LABELS = ['$3k', '$6k', '$10k', '$15k', '$20k', '$30k']

// Evolution stages (0=Genesis, 1=Custom, 2=Product, 3=Commodity)
const EVOLUTION_LABELS = ['Genesis', 'Custom', 'Product', 'Commodity']
const EVOLUTION_DESC = ['Novel, experimental', 'Tailored, growing', 'Standardized, wide', 'Basic, expected']

// Each category: [stage at $3k, $6k, $10k, $15k, $20k, $30k]
// Stage: 0=Genesis, 1=Custom, 2=Product, 3=Commodity [INF based on Engel curve research]
const CATEGORIES: { name: string; stages: number[]; color: string; elasticity?: number }[] = [
  { name: 'Basic Food',        stages: [3, 3, 3, 3, 3, 3], color: '#e15759', elasticity: 0.7 },
  { name: 'Mobile Phone',      stages: [1, 2, 3, 3, 3, 3], color: '#f28e2b', elasticity: 1.0 },
  { name: 'Basic Banking',     stages: [1, 2, 2, 3, 3, 3], color: '#edc948', elasticity: 1.1 },
  { name: 'Housing (shelter)', stages: [2, 2, 3, 3, 3, 3], color: '#4e79a7', elasticity: 1.1 },
  { name: 'E-commerce',        stages: [0, 1, 2, 2, 3, 3], color: '#59a14f', elasticity: 1.2 },
  { name: 'Healthcare',        stages: [1, 1, 2, 2, 3, 3], color: '#76b7b2', elasticity: 1.2 },
  { name: 'Education',         stages: [1, 1, 2, 2, 3, 3], color: '#b07aa1', elasticity: 1.2 },
  { name: 'Consumer Credit',   stages: [0, 0, 1, 2, 2, 3], color: '#ff9da7', elasticity: 1.3 },
  { name: 'Premium Retail',    stages: [0, 0, 1, 1, 2, 3], color: '#9c755f', elasticity: 1.3 },
  { name: 'Insurance',         stages: [0, 0, 0, 1, 2, 3], color: '#bab0ac', elasticity: 1.4 },
  { name: 'Investing/Wealth',  stages: [0, 0, 0, 1, 1, 2], color: '#1b1f23', elasticity: 1.5 },
]

// Current income positions for key economies (World Bank 2024)
const ECONOMY_POSITIONS = [
  { name: 'Ethiopia', ppp: 2892, color: '#76b7b2' },
  { name: 'India',    ppp: 9416, color: '#f28e2b' },
  { name: 'Indonesia',ppp: 14471, color: '#59a14f' },
  { name: 'China',    ppp: 23841, color: '#e15759' },
  { name: 'Mexico',   ppp: 21970, color: '#b07aa1' },
  { name: 'Brazil',   ppp: 19652, color: '#4e79a7' },
]

const W = 780
const H = 340
const PAD_LEFT = 130
const PAD_RIGHT = 20
const PAD_TOP = 30
const PAD_BOTTOM = 50
const CHART_W = W - PAD_LEFT - PAD_RIGHT
const CHART_H = H - PAD_TOP - PAD_BOTTOM

function incomeToX(income: number): number {
  const minI = Math.log(3000)
  const maxI = Math.log(30000)
  return PAD_LEFT + ((Math.log(income) - minI) / (maxI - minI)) * CHART_W
}

function stageToY(stage: number): number {
  return PAD_TOP + CHART_H - (stage / 3) * CHART_H
}

export default function WardleyEvolutionChart() {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#6e7681', marginBottom: 12 }}>
        How spending categories evolve along the Wardley axis (Genesis → Commodity) as household income rises.
        Framework: Wardley Maps (Wardley 2016). Data: [INF] — inferred from Engel curve research and observed market development patterns.
        Vertical lines show current income positions of key economies (World Bank 2024 PPP).
      </p>

      <div style={{ overflowX: 'auto' }}>
        <svg width={W} height={H} style={{ fontFamily: 'inherit' }}>
          {/* Y-axis labels */}
          {EVOLUTION_LABELS.map((label, i) => (
            <g key={label}>
              <text x={PAD_LEFT - 8} y={stageToY(i) + 4} textAnchor="end" fontSize={11} fill="#6e7681" fontWeight={600}>{label}</text>
              <text x={PAD_LEFT - 8} y={stageToY(i) + 16} textAnchor="end" fontSize={9} fill="#afb8c1">{EVOLUTION_DESC[i]}</text>
              <line x1={PAD_LEFT} y1={stageToY(i)} x2={W - PAD_RIGHT} y2={stageToY(i)} stroke="#eaeef2" strokeDasharray="3 3" />
            </g>
          ))}

          {/* X-axis */}
          {INCOME_LEVELS.map((inc, i) => {
            const x = incomeToX(inc)
            return (
              <g key={inc}>
                <line x1={x} y1={PAD_TOP} x2={x} y2={PAD_TOP + CHART_H} stroke="#eaeef2" />
                <text x={x} y={PAD_TOP + CHART_H + 16} textAnchor="middle" fontSize={11} fill="#6e7681">{INCOME_LABELS[i]}</text>
              </g>
            )
          })}

          {/* X-axis label */}
          <text x={PAD_LEFT + CHART_W / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#6e7681">
            GDP per capita PPP (log scale) — World Bank constant 2021 $
          </text>

          {/* Economy vertical lines */}
          {ECONOMY_POSITIONS.map(e => {
            const x = incomeToX(Math.min(e.ppp, 29999))
            return (
              <g key={e.name}>
                <line x1={x} y1={PAD_TOP} x2={x} y2={PAD_TOP + CHART_H} stroke={e.color} strokeWidth={2} strokeDasharray="5 3" opacity={0.7} />
                <text x={x + 3} y={PAD_TOP + 12} fontSize={9} fill={e.color} fontWeight={600}>{e.name}</text>
              </g>
            )
          })}

          {/* Category evolution paths */}
          {CATEGORIES.map(cat => {
            const points = INCOME_LEVELS.map((inc, i) => ({
              x: incomeToX(inc),
              y: stageToY(cat.stages[i]),
            }))

            const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')

            return (
              <g key={cat.name}>
                <path d={d} fill="none" stroke={cat.color} strokeWidth={2} opacity={0.85} strokeLinejoin="round" />
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={3} fill={cat.color} />
                ))}
                {/* Label at last point */}
                <text
                  x={points[points.length - 1].x + 5}
                  y={points[points.length - 1].y + 4}
                  fontSize={9}
                  fill={cat.color}
                  fontWeight={600}
                >
                  {cat.name.length > 16 ? cat.name.slice(0, 14) + '…' : cat.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        {CATEGORIES.map(c => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6e7681' }}>
            <div style={{ width: 20, height: 2, background: c.color }} />
            <span>{c.name}</span>
            {c.elasticity && <span style={{ fontSize: 10, color: c.color, fontFamily: 'monospace' }}>ε={c.elasticity}</span>}
          </div>
        ))}
      </div>

      {/* Key insight table */}
      <div style={{ marginTop: 16, overflowX: 'auto' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
          Investment window — when each category crosses from Custom → Product (highest growth phase)
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d0d7de' }}>
              {['Category', 'ε_Y', 'Entry income', 'Economies NOW in window'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '5px 12px 6px 0', fontSize: 10, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { cat: 'E-commerce',      e: 1.2, window: '$6k–$15k',  economies: 'India ($9k), Indonesia ($14k)' },
              { cat: 'Healthcare',      e: 1.2, window: '$6k–$15k',  economies: 'India ($9k), Indonesia ($14k)' },
              { cat: 'Education',       e: 1.2, window: '$6k–$15k',  economies: 'India ($9k), Indonesia ($14k)' },
              { cat: 'Consumer Credit', e: 1.3, window: '$10k–$20k', economies: 'India ($9k entering), Brazil ($20k), Mexico ($22k exiting)' },
              { cat: 'Premium Retail',  e: 1.3, window: '$15k–$30k', economies: 'China ($24k), Brazil ($20k), Mexico ($22k)' },
              { cat: 'Insurance',       e: 1.4, window: '$15k–$30k', economies: 'China ($24k), Brazil ($20k)' },
              { cat: 'Investing/Wealth',e: 1.5, window: '$15k–$30k+',economies: 'China ($24k) — early stage' },
            ].map(r => (
              <tr key={r.cat} style={{ borderBottom: '1px solid #eaeef2' }}>
                <td style={{ padding: '5px 12px 5px 0', fontWeight: 500 }}>{r.cat}</td>
                <td style={{ padding: '5px 12px 5px 0', fontFamily: 'monospace', color: '#0969da' }}>{r.e}</td>
                <td style={{ padding: '5px 12px 5px 0', fontFamily: 'monospace', color: '#9a6700' }}>{r.window}</td>
                <td style={{ padding: '5px 0', fontSize: 11, color: '#57606a' }}>{r.economies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 10, color: '#afb8c1', marginTop: 8 }}>
        [INF] Inferred from Engel curve research (PERI WP247, China NBS, India HCES) and observed market development patterns. Not empirically derived from panel data. Framework: Wardley Maps (Wardley 2016).
      </p>
    </div>
  )
}
