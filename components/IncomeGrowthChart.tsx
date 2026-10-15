'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { incomeTimeSeries } from '@/data/research'

const COLORS = { China: '#d62728', India: '#ff7f0e', Brazil: '#9467bd', Germany: '#2ca02c', USA: '#1f77b4' }

export default function IncomeGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={incomeTimeSeries} margin={{ top: 8, right: 24, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#e8e8e8" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: '#666' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          width={42}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #e8e8e8', borderRadius: 4, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}
          formatter={(v: number) => [`$${v.toLocaleString()}`, '']}
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
        {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((k) => (
          <Line key={k} type="monotone" dataKey={k} stroke={COLORS[k]} strokeWidth={2} dot={{ r: 2, fill: COLORS[k] }} activeDot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
