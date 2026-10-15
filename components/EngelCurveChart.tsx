'use client'

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { engelReferenceCurve, economyFoodShares } from '@/data/research'

// Reference curve: format as {x, y} for ScatterChart
const refPoints = engelReferenceCurve.map((p) => ({ x: p.income, y: p.foodShare }))

// Economy points: {x, y} plus metadata for labels
const ecoPoints = economyFoodShares.map((e) => ({
  x: e.income,
  y: e.foodShare,
  name: e.name,
  color: e.color,
  flag: e.flag,
  note: e.note,
}))

// Custom dot for economy points — renders name + colored circle
type EcoDot = {
  cx?: number
  cy?: number
  payload?: { name: string; color: string; flag: string }
}

const EconomyDot = ({ cx = 0, cy = 0, payload }: EcoDot) => {
  if (!payload) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={payload.color} opacity={0.85} />
      <text x={cx + 12} y={cy + 4} fill="#e4e4e7" fontSize={11} fontWeight={600}>
        {payload.name}
      </text>
      {payload.flag === 'INF' && (
        <text x={cx + 12} y={cy + 15} fill="#71717a" fontSize={9}>
          [INF]
        </text>
      )}
    </g>
  )
}

// Tiny dot for reference curve
const RefDot = ({ cx = 0, cy = 0 }: { cx?: number; cy?: number }) => (
  <circle cx={cx} cy={cy} r={3} fill="#6366f1" opacity={0.6} />
)

export default function EngelCurveChart() {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-1">
        Reference curve: PERI WP247 &quot;Engel&apos;s Law Around the World 150 Years Later&quot; (207 countries) [OBS].
        Economy points: primary sources as labeled; [INF] = estimated.
      </p>
      <p className="text-xs text-zinc-600 mb-3">
        X-axis: GDP per capita PPP (constant 2021 $). Y-axis: food budget share (%).
      </p>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 50, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 82000]}
            name="Income"
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            label={{ value: 'GDP per capita PPP (2021 $)', position: 'insideBottom', offset: -10, fill: '#71717a', fontSize: 11 }}
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[0, 60]}
            name="Food share"
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v: number) => `${v}%`}
            label={{ value: 'Food share (%)', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#e4e4e7', fontSize: 12 }}
            formatter={(v: number, name: string) =>
              name === 'y' ? [`${v}%`, 'Food share'] : [`$${v.toLocaleString()}`, 'Income PPP']
            }
            cursor={{ strokeDasharray: '3 3', stroke: '#3f3f46' }}
          />
          {/* Reference curve — small connected dots */}
          <Scatter
            name="Reference (PERI WP247)"
            data={refPoints}
            shape={<RefDot />}
            line={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6 3' }}
            legendType="line"
          />
          {/* Economy data points */}
          <Scatter
            name="Economies"
            data={ecoPoints}
            shape={<EconomyDot />}
            legendType="none"
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Manual legend */}
      <div className="flex gap-4 mt-3 flex-wrap items-center">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <div className="w-8 border-t-2 border-dashed border-indigo-400" />
          Reference curve (PERI WP247)
        </div>
        {economyFoodShares.map((e) => (
          <div key={e.name} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: e.color }} />
            <span>{e.name}</span>
            {e.flag === 'INF' && <span className="text-zinc-600">[INF]</span>}
          </div>
        ))}
      </div>

      {/* Source notes per economy */}
      <div className="mt-3 space-y-1">
        {economyFoodShares.map((e) => (
          <p key={e.name} className="text-xs text-zinc-600">
            <span style={{ color: e.color }} className="font-medium">{e.name}</span>:{' '}
            {e.note} — <em>{e.source}</em>
          </p>
        ))}
      </div>
    </div>
  )
}
