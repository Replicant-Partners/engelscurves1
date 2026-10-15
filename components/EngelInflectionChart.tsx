'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { engelInflection } from '@/data/emergingMarkets'

const LINES = [
  { key: 'food',       label: 'Food',       color: '#e15759' },
  { key: 'housing',    label: 'Housing',    color: '#4e79a7' },
  { key: 'tech',       label: 'Technology', color: '#f28e2b' },
  { key: 'healthcare', label: 'Healthcare', color: '#59a14f' },
  { key: 'education',  label: 'Education',  color: '#b07aa1' },
]

export default function EngelInflectionChart() {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={engelInflection} margin={{ top: 12, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#eaeef2" vertical={false} />
        <XAxis
          dataKey="income"
          tick={{ fontSize: 12, fill: '#6e7681' }}
          axisLine={{ stroke: '#d0d7de' }}
          tickLine={false}
          tickMargin={8}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          label={{ value: 'GDP per capita (nominal USD)', position: 'insideBottom', offset: -8, fontSize: 12, fill: '#6e7681' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6e7681' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}%`}
          width={36}
          tickMargin={4}
          label={{ value: '% of household budget', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6e7681', dx: 14 }}
        />
        {/* Key inflection zones */}
        <ReferenceLine x={13000} stroke="#edc948" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'Indonesia/India ($13k)', fill: '#9a6700', fontSize: 10, position: 'top' }} />
        <ReferenceLine x={18000} stroke="#edc948" strokeDasharray="4 2" strokeWidth={1} label={{ value: 'Egypt/Arg ($18-20k)', fill: '#9a6700', fontSize: 10, position: 'top' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: '1px solid #d0d7de', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,.08)', background: '#fff' }}
          formatter={(v: number, name: string) => [`${v}%`, name]}
          labelFormatter={(v: number) => `Income: $${v.toLocaleString()}`}
        />
        <Legend iconType="plainline" iconSize={20} wrapperStyle={{ fontSize: 12, paddingTop: 12, color: '#6e7681' }} />
        {LINES.map((l) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
