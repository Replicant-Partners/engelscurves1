'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { incomeTimeSeries } from '@/data/research'

const COLORS = {
  China: '#ef4444',
  India: '#f59e0b',
  Brazil: '#8b5cf6',
  Germany: '#10b981',
  USA: '#3b82f6',
}

export default function IncomeGrowthChart() {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-3">
        World Bank NY.GDP.PCAP.PP.KD — constant 2021 PPP $ — retrieved 15 Oct 2026 [OBS]
      </p>
      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={incomeTimeSeries} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis dataKey="year" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <YAxis
            stroke="#71717a"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#e4e4e7' }}
            formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
          />
          <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
          {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[key]}
              strokeWidth={2}
              dot={{ r: 3, fill: COLORS[key] }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
