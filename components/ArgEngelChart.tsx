'use client'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

// Argentina Engel curves: monthly spending ($) by sector vs monthly income ($)
// Modeled from original Observable chart using income elasticity estimates [INF]
// Argentina nominal GDP per capita ~$13k/yr ≈ $1,100/month (2024, WB estimate)
const DATA = [
  { income: 400,  ecom: 10,  fin: 15,  retail: 20, educ: 30,  health: 25,  realestate: 80  },
  { income: 600,  ecom: 18,  fin: 25,  retail: 32, educ: 48,  health: 38,  realestate: 130 },
  { income: 800,  ecom: 28,  fin: 40,  retail: 48, educ: 70,  health: 56,  realestate: 200 },
  { income: 1000, ecom: 42,  fin: 60,  retail: 68, educ: 98,  health: 76,  realestate: 295 },
  { income: 1200, ecom: 58,  fin: 85,  retail: 92, educ: 130, health: 100, realestate: 410 },
  { income: 1500, ecom: 85,  fin: 130, retail: 130, educ: 180, health: 138, realestate: 610 },
  { income: 2000, ecom: 135, fin: 210, retail: 200, educ: 270, health: 210, realestate: 1000 },
  { income: 2500, ecom: 190, fin: 310, retail: 275, educ: 375, health: 290, realestate: 1450 },
  { income: 3000, ecom: 255, fin: 430, retail: 355, educ: 490, health: 380, realestate: 1950 },
]

const LINES = [
  { key: 'ecom',      label: 'E-commerce',        color: '#4e79a7', dash: false },
  { key: 'fin',       label: 'Financial Services', color: '#59a14f', dash: false },
  { key: 'retail',    label: 'Premium Retail',     color: '#edc948', dash: false },
  { key: 'educ',      label: 'Education',          color: '#f28e2b', dash: false },
  { key: 'health',    label: 'Healthcare',         color: '#b07aa1', dash: false },
  { key: 'realestate',label: 'Real Estate',        color: '#1b1f23', dash: false },
]

export default function ArgEngelChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={DATA} margin={{ top: 12, right: 24, left: 0, bottom: 16 }}>
          <CartesianGrid stroke="#eaeef2" vertical={false} />
          <XAxis
            dataKey="income"
            tick={{ fontSize: 12, fill: '#6e7681' }}
            axisLine={{ stroke: '#d0d7de' }}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(v: number) => `$${v}`}
            label={{ value: 'Monthly income per capita (nominal USD)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#6e7681' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6e7681' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v}`}
            width={52}
            tickMargin={4}
            label={{ value: 'Monthly spending (USD)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#6e7681', dx: 18 }}
          />
          <ReferenceLine
            x={1100}
            stroke="#e15759"
            strokeDasharray="4 2"
            strokeWidth={1.5}
            label={{ value: 'Median ~$1,100', fill: '#e15759', fontSize: 10, position: 'top' }}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #d0d7de', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,.08)', background: '#fff' }}
            formatter={(v: number, name: string) => [`$${v}/mo`, name]}
            labelFormatter={(v: number) => `Income: $${v}/month`}
          />
          <Legend iconType="plainline" iconSize={20} wrapperStyle={{ fontSize: 12, paddingTop: 12, color: '#6e7681' }} />
          {LINES.map((l) => (
            <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: 10, padding: '10px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#6e7681', lineHeight: 1.5 }}>
          <strong style={{ color: '#1b1f23' }}>Data note [INF]:</strong> Modeled from the original Observable chart using sector income elasticities (Real Estate ε≈1.4, Financial Services ε≈1.3, Education ε≈1.2, E-commerce ε≈1.2). Argentina nominal GDP/capita ≈ $1,100/month (2024). Real estate shows steepest slope as a value-preservation strategy in an inflationary economy.
        </p>
      </div>
    </>
  )
}
