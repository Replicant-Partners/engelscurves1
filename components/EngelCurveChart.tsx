'use client'

import {
  ScatterChart, Scatter, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Label, ReferenceLine,
  ComposedChart, Area,
} from 'recharts'
import { engelReferenceCurve, economyFoodShares } from '@/data/research'

const CustomDot = (props: {
  cx?: number; cy?: number; payload?: { name: string; color: string; flag: string }
}) => {
  const { cx = 0, cy = 0, payload } = props
  if (!payload) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={payload.color} opacity={0.9} />
      <text x={cx + 10} y={cy + 4} fill="#e4e4e7" fontSize={11} fontWeight="600">
        {payload.name}
      </text>
      {payload.flag === 'INF' && (
        <text x={cx + 10} y={cy + 16} fill="#71717a" fontSize={9}>
          [INF]
        </text>
      )}
    </g>
  )
}

export default function EngelCurveChart() {
  const scatterData = economyFoodShares.map((e) => ({
    income: e.income,
    foodShare: e.foodShare,
    name: e.name,
    color: e.color,
    flag: e.flag,
  }))

  return (
    <div>
      <p className="text-xs text-zinc-500 mb-1">
        Reference curve: PERI WP247 "Engel&apos;s Law Around the World 150 Years Later" (207 countries) [OBS].
        Economy points: primary sources as labeled; [INF] = estimated.
      </p>
      <p className="text-xs text-zinc-600 mb-3">
        X-axis: GDP per capita PPP (constant 2021 $) — log-approximate scale.
        Y-axis: food budget share (%).
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart margin={{ top: 10, right: 40, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            type="number"
            dataKey="income"
            domain={[0, 80000]}
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            name="GDP/capita PPP"
          >
            <Label value="GDP per capita PPP (2021 $)" offset={-10} position="insideBottom" fill="#71717a" fontSize={11} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="foodShare"
            domain={[0, 60]}
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
            name="Food share"
          />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#e4e4e7', fontSize: 12 }}
            formatter={(v: number, name: string) =>
              name === 'foodShare' ? [`${v}%`, 'Food share'] : [`$${v.toLocaleString()}`, 'Income']
            }
          />
          {/* Reference curve */}
          <Line
            data={engelReferenceCurve}
            type="monotone"
            dataKey="foodShare"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            name="Reference curve (PERI WP247)"
            legendType="line"
          />
          {/* Economy scatter */}
          <Scatter
            data={scatterData}
            dataKey="foodShare"
            shape={<CustomDot />}
            name="Economies"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <div className="w-8 border-t-2 border-dashed border-indigo-400" />
          Reference curve (PERI WP247)
        </div>
        {economyFoodShares.map((e) => (
          <div key={e.name} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <div className="w-3 h-3 rounded-full" style={{ background: e.color }} />
            {e.name} {e.flag === 'INF' ? <span className="text-zinc-600">[INF]</span> : ''}
          </div>
        ))}
      </div>
    </div>
  )
}
