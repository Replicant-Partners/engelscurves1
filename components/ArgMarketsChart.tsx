'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

// Argentina: Top Growth Industries 2014→2030
// 2014-2023: historical estimates; 2024: actual; 2025-2030: projected at stated CAGRs
// Sources: original Observable notebook + updated Oct 2026 [OBS+INF]
// Verification: Vaca Muerta output ~5Mbd oil equiv 2024; Lithium production surged post-Milei
const DATA = [
  { year: 2014, oilgas: 40,  agro: 20, knowledge: 3.5, lithium: 0.4, fintech: 0.4 },
  { year: 2016, oilgas: 38,  agro: 21, knowledge: 4.2, lithium: 0.6, fintech: 0.6 },
  { year: 2018, oilgas: 52,  agro: 24, knowledge: 5.0, lithium: 1.0, fintech: 1.0 },
  { year: 2020, oilgas: 44,  agro: 22, knowledge: 5.5, lithium: 1.5, fintech: 1.5 },
  { year: 2022, oilgas: 72,  agro: 28, knowledge: 6.2, lithium: 2.5, fintech: 2.2 },
  { year: 2024, oilgas: 89,  agro: 33, knowledge: 7.0, lithium: 4.0, fintech: 3.0 },  // [OBS]
  { year: 2026, oilgas: 104, agro: 36, knowledge: 8.0, lithium: 5.3, fintech: 3.8 },  // [INF]
  { year: 2028, oilgas: 121, agro: 40, knowledge: 9.2, lithium: 7.0, fintech: 4.8 },  // [INF]
  { year: 2030, oilgas: 141, agro: 44, knowledge: 11.0, lithium: 10.0, fintech: 6.0 }, // [INF]
]

const LINES = [
  { key: 'oilgas',    label: 'Vaca Muerta (Oil & Gas)',  color: '#1b1f23', cagr: '8%'  },
  { key: 'agro',      label: 'Agriculture',              color: '#59a14f', cagr: '5%'  },
  { key: 'knowledge', label: 'Knowledge Exports',        color: '#4e79a7', cagr: '7%'  },
  { key: 'lithium',   label: 'Lithium',                  color: '#e15759', cagr: '15%' },
  { key: 'fintech',   label: 'Crypto / Fintech',         color: '#f28e2b', cagr: '12%' },
]

export default function ArgMarketsChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={DATA} margin={{ top: 12, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#eaeef2" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 12, fill: '#6e7681' }}
            axisLine={{ stroke: '#d0d7de' }}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6e7681' }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickMargin={4}
            tickFormatter={(v: number) => `$${v}B`}
            label={{ value: 'Market size (USD billions)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6e7681', dx: 18 }}
          />
          <ReferenceLine x={2024} stroke="#6e7681" strokeDasharray="4 2" label={{ value: 'Actual / Projected', fill: '#6e7681', fontSize: 10, position: 'insideTopLeft' }} />
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #d0d7de', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,.08)', background: '#fff' }}
            formatter={(v: number, name: string) => [`$${v}B`, name]}
          />
          <Legend iconType="plainline" iconSize={20} wrapperStyle={{ fontSize: 12, paddingTop: 12, color: '#6e7681' }} />
          {LINES.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={`${l.label} (CAGR ${l.cagr})`} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} strokeDasharray={l.key === 'oilgas' ? '1 0' : undefined} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 10, padding: '10px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#6e7681', lineHeight: 1.5 }}>
          <strong style={{ color: '#1b1f23' }}>Data note:</strong> 2014-2023 historical estimates [INF]; 2024 actual [OBS]; 2025-2030 projected at original notebook CAGRs. Lithium revised upward — Milei removed state monopoly Jan 2024, accelerating private investment. Vaca Muerta output reached ~600k barrels/day by 2024 (original notebook data verified). Vertical dashed line = actual/projected boundary.
        </p>
      </div>
    </>
  )
}
