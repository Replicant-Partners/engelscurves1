'use client'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { engelReferenceCurve, economyFoodShares } from '@/data/research'

const refPoints = engelReferenceCurve.map((p) => ({ x: p.income, y: p.foodShare }))
const ecoPoints = economyFoodShares.map((e) => ({
  x: e.income, y: e.foodShare,
  name: e.name, color: e.color, flag: e.flag,
}))

// D3 Tableau-10
const ECO_COLORS: Record<string, string> = {
  India: '#f28e2b', China: '#e15759', Brazil: '#b07aa1', Germany: '#59a14f', USA: '#4e79a7',
}

type DotProps = { cx?: number; cy?: number; payload?: { name: string; flag: string } }

const EcoDot = ({ cx = 0, cy = 0, payload }: DotProps) => {
  if (!payload) return null
  const color = ECO_COLORS[payload.name] ?? '#999'
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={color} stroke="#fff" strokeWidth={1.5} />
      <text
        x={cx + 9} y={cy + 4}
        fontSize={12} fontFamily="inherit" fill="#1b1f23" fontWeight={500}
      >
        {payload.name}
      </text>
      {payload.flag === 'INF' && (
        <text x={cx + 9} y={cy + 16} fontSize={10} fontFamily="inherit" fill="#6e7681">
          [INF]
        </text>
      )}
    </g>
  )
}

const RefDot = ({ cx = 0, cy = 0 }: { cx?: number; cy?: number }) => (
  <circle cx={cx} cy={cy} r={2} fill="#afb8c1" />
)

export default function EngelCurveChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 16, right: 80, left: 0, bottom: 32 }}>
          <CartesianGrid stroke="#eaeef2" strokeDasharray="none" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 82000]}
            name="Income"
            tick={{ fontSize: 12, fill: '#6e7681', fontFamily: 'inherit' }}
            axisLine={{ stroke: '#d0d7de' }}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            label={{ value: 'GDP per capita, PPP (constant 2021 international $)', position: 'insideBottom', offset: -20, fontSize: 12, fill: '#6e7681', fontFamily: 'inherit' }}
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[0, 56]}
            name="Food share"
            tick={{ fontSize: 12, fill: '#6e7681', fontFamily: 'inherit' }}
            axisLine={false}
            tickLine={false}
            tickMargin={4}
            width={40}
            tickFormatter={(v: number) => `${v}%`}
            label={{ value: 'Food budget share (%)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6e7681', dx: 14, fontFamily: 'inherit' }}
          />
          <Tooltip
            contentStyle={{ fontSize: 13, fontFamily: 'inherit', border: '1px solid #d0d7de', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,.08)', background: '#fff' }}
            formatter={(v: number, name: string) => name === 'y' ? [`${v}%`, 'Food share'] : [`$${v.toLocaleString()}`, 'Income']}
            cursor={{ stroke: '#d0d7de', strokeWidth: 1 }}
          />
          <Scatter
            name="Reference — PERI WP247 (207 countries)"
            data={refPoints}
            shape={<RefDot />}
            line={{ stroke: '#afb8c1', strokeWidth: 1.5, strokeDasharray: '5 3' }}
            legendType="none"
          />
          <Scatter
            name="Economies"
            data={ecoPoints}
            shape={<EcoDot />}
            legendType="none"
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', marginTop: 8 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6e7681' }}>
          <svg width="20" height="10" style={{ flexShrink: 0 }}>
            <line x1="0" y1="5" x2="20" y2="5" stroke="#afb8c1" strokeWidth="1.5" strokeDasharray="5 3" />
          </svg>
          Reference curve — PERI WP247
        </span>
        {economyFoodShares.map((e) => (
          <span key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#6e7681' }}>
            <svg width="12" height="12" style={{ flexShrink: 0 }}>
              <circle cx="6" cy="6" r="5" fill={ECO_COLORS[e.name] ?? '#999'} />
            </svg>
            {e.name}{e.flag === 'INF' ? ' [INF]' : ''}
          </span>
        ))}
      </div>
    </>
  )
}
