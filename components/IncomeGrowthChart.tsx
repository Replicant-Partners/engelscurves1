'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { incomeTimeSeries } from '@/data/research'

// D3 Tableau-10
const C = { China: '#e15759', India: '#f28e2b', Brazil: '#b07aa1', Germany: '#59a14f', USA: '#4e79a7' }

const fmt = (v: number) => `$${(v / 1000).toFixed(0)}k`

export default function IncomeGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <LineChart data={incomeTimeSeries} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#eaeef2" strokeDasharray="none" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: '#6e7681', fontFamily: 'inherit' }}
          axisLine={{ stroke: '#d0d7de' }}
          tickLine={false}
          tickMargin={8}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6e7681', fontFamily: 'inherit' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={fmt}
          width={46}
          tickMargin={4}
        />
        <Tooltip
          contentStyle={{
            fontSize: 13,
            fontFamily: 'inherit',
            border: '1px solid #d0d7de',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,.08)',
            background: '#fff',
            color: '#1b1f23',
          }}
          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          formatter={(v: number, name: string) => [fmt(v), name]}
        />
        <Legend
          iconType="plainline"
          iconSize={20}
          wrapperStyle={{ fontSize: 13, paddingTop: 12, fontFamily: 'inherit', color: '#6e7681' }}
        />
        {(Object.keys(C) as Array<keyof typeof C>).map((k) => (
          <Line
            key={k}
            type="monotone"
            dataKey={k}
            stroke={C[k]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
