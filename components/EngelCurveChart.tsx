'use client'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { engelReferenceCurve, economyFoodShares } from '@/data/research'

const refPoints = engelReferenceCurve.map((p) => ({ x: p.income, y: p.foodShare }))
const ecoPoints = economyFoodShares.map((e) => ({ x: e.income, y: e.foodShare, name: e.name, color: e.color, flag: e.flag }))

type DotProps = { cx?: number; cy?: number; payload?: { name: string; color: string; flag: string } }

const EcoDot = ({ cx = 0, cy = 0, payload }: DotProps) => {
  if (!payload) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill={payload.color} opacity={0.9} stroke="#fff" strokeWidth={1.5} />
      <text x={cx + 10} y={cy + 4} fontSize={11} fill="#1b1f23" fontWeight={600}>{payload.name}</text>
      {payload.flag === 'INF' && <text x={cx + 10} y={cy + 15} fontSize={9} fill="#999">[INF]</text>}
    </g>
  )
}

const RefDot = ({ cx = 0, cy = 0 }: { cx?: number; cy?: number }) => (
  <circle cx={cx} cy={cy} r={2.5} fill="#aaa" />
)

export default function EngelCurveChart() {
  return (
    <>
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 16, right: 48, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#e8e8e8" />
          <XAxis dataKey="x" type="number" domain={[0, 82000]} name="Income" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} label={{ value: 'GDP per capita PPP (2021 $)', position: 'insideBottom', offset: -14, fontSize: 11, fill: '#999' }} />
          <YAxis dataKey="y" type="number" domain={[0, 58]} name="Food share" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} width={36} label={{ value: 'Food share (%)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#999', dx: 12 }} />
          <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e8e8e8', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }} formatter={(v: number, name: string) => name === 'y' ? [`${v}%`, 'Food share'] : [`$${v.toLocaleString()}`, 'Income']} />
          <Scatter name="Reference (PERI WP247)" data={refPoints} shape={<RefDot />} line={{ stroke: '#aaa', strokeWidth: 1.5, strokeDasharray: '4 3' }} legendType="none" />
          <Scatter name="Economies" data={ecoPoints} shape={<EcoDot />} legendType="none" />
        </ScatterChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8, fontSize: 11, color: '#555', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="24" height="10"><line x1="0" y1="5" x2="24" y2="5" stroke="#aaa" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
          Reference curve — PERI WP247 (207 countries)
        </span>
        {economyFoodShares.map((e) => (
          <span key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill={e.color} /></svg>
            {e.name}{e.flag === 'INF' ? ' [INF]' : ''}
          </span>
        ))}
      </div>
    </>
  )
}
