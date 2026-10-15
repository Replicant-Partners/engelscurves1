'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

// Mexico: Growth Industries 2014→2030
// Original notebook: Nearshoring $166.8B→$498B; Auto $98.9B→$175.3B; E-commerce→$214B; Fintech→$127.6B
// VERIFICATION: "Nearshoring/Manufacturing" $166.8B (2024) refers to nearshoring-specific manufacturing
// value-added, NOT total Mexico-US trade ($873B in 2025). Figure is plausible for nearshoring subset.
// Updated: Mexico #1 US import source 17% share (2026); FDI record $41B (2025)
const DATA = [
  { year: 2014, nearshoring: 65,  auto: 60,  ecom: 4,   fintech: 0.5, greenenergy: 2  },
  { year: 2016, nearshoring: 78,  auto: 72,  ecom: 8,   fintech: 1.0, greenenergy: 4  },
  { year: 2018, nearshoring: 95,  auto: 85,  ecom: 16,  fintech: 2.5, greenenergy: 7  },
  { year: 2020, nearshoring: 105, auto: 80,  ecom: 25,  fintech: 4.5, greenenergy: 9  }, // COVID dip auto
  { year: 2022, nearshoring: 138, auto: 92,  ecom: 38,  fintech: 8.0, greenenergy: 13 },
  { year: 2024, nearshoring: 167, auto: 99,  ecom: 55,  fintech: 15,  greenenergy: 20 }, // [OBS]
  { year: 2026, nearshoring: 215, auto: 116, ecom: 90,  fintech: 28,  greenenergy: 30 }, // [INF]
  { year: 2028, nearshoring: 330, auto: 145, ecom: 145, fintech: 65,  greenenergy: 42 }, // [INF]
  { year: 2030, nearshoring: 498, auto: 175, ecom: 214, fintech: 128, greenenergy: 58 }, // [INF] original notebook
]

const LINES = [
  { key: 'nearshoring',  label: 'Nearshoring & Manufacturing', color: '#1b1f23', cagr: '12%' },
  { key: 'auto',         label: 'Auto & Aerospace',            color: '#4e79a7', cagr: '7%'  },
  { key: 'ecom',         label: 'E-commerce & Digital',        color: '#f28e2b', cagr: '18%' },
  { key: 'fintech',      label: 'Fintech & Digital Banking',   color: '#59a14f', cagr: '14%' },
  { key: 'greenenergy',  label: 'Green Energy',                color: '#76b7b2', cagr: '9%'  },
]

export default function MexicoMarketsChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height={360}>
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
            width={50}
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
            <Line key={l.key} type="monotone" dataKey={l.key} name={`${l.label} (${l.cagr})`} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 10, padding: '10px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#6e7681', lineHeight: 1.5 }}>
          <strong style={{ color: '#1b1f23' }}>Data note:</strong> Nearshoring/Manufacturing $166.8B (2024) = nearshoring-specific manufacturing value-added; <em>not</em> total Mexico-US trade ($873B in 2025 [OBS]). 2014-2023 historical estimates [INF]; 2024 actuals [OBS]; 2025-2030 original notebook projections updated for context. Fintech fastest growing — Nu Mexico 9M+ users; CNBV digital banking licenses expanding. Green Energy added (solar/wind expanding rapidly under Plan Mexico).
        </p>
      </div>
    </>
  )
}
