'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { chinaSpending2023 } from '@/data/research'

const LUXURY_COLOR = '#4e79a7'
const NECESS_COLOR = '#afb8c1'

const axisStyle = { fontSize: 12, fill: '#6e7681', fontFamily: 'inherit' }
const tooltipStyle = {
  fontSize: 13, fontFamily: 'inherit',
  border: '1px solid #d0d7de', borderRadius: 6,
  boxShadow: '0 4px 12px rgba(0,0,0,.08)', background: '#fff',
}
const labelStyle = {
  fontSize: 11, fontWeight: 600, color: '#6e7681',
  textTransform: 'uppercase' as const, letterSpacing: '.06em',
  marginBottom: 10,
}

export default function ChinaSpendingChart() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

      {/* Budget share */}
      <div>
        <p style={labelStyle}>Budget share (%)</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chinaSpending2023} layout="vertical" barSize={12} margin={{ left: 0, right: 12 }}>
            <CartesianGrid stroke="#eaeef2" horizontal={false} />
            <XAxis type="number" tick={axisStyle} axisLine={{ stroke: '#d0d7de' }} tickLine={false} tickMargin={6} tickFormatter={(v: number) => `${v}%`} />
            <YAxis type="category" dataKey="category" tick={{ ...axisStyle, fontSize: 11 }} width={116} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Share']} />
            <Bar dataKey="share" radius={[0, 3, 3, 0]}>
              {chinaSpending2023.map((d) => (
                <Cell key={d.category} fill={d.type === 'luxury' ? LUXURY_COLOR : NECESS_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[['Luxury (ε>1)', LUXURY_COLOR], ['Necessity (ε<1)', NECESS_COLOR]].map(([label, color]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6e7681' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color as string, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* YoY growth */}
      <div>
        <p style={labelStyle}>YoY growth 2023 (%)</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chinaSpending2023} layout="vertical" barSize={12} margin={{ left: 0, right: 12 }}>
            <CartesianGrid stroke="#eaeef2" horizontal={false} />
            <XAxis type="number" tick={axisStyle} axisLine={{ stroke: '#d0d7de' }} tickLine={false} tickMargin={6} tickFormatter={(v: number) => `${v}%`} />
            <YAxis type="category" dataKey="category" tick={{ ...axisStyle, fontSize: 11 }} width={116} axisLine={false} tickLine={false} />
            <ReferenceLine
              x={6.3}
              stroke="#f28e2b"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              label={{ value: 'income +6.3%', fill: '#f28e2b', fontSize: 11, position: 'insideTopRight', fontFamily: 'inherit' }}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'YoY growth']} />
            <Bar dataKey="yoyGrowth" radius={[0, 3, 3, 0]}>
              {chinaSpending2023.map((d) => (
                <Cell key={d.category} fill={d.yoyGrowth > 6.3 ? '#59a14f' : NECESS_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12, color: '#6e7681', marginTop: 8 }}>
          Green bars grow faster than household income (6.3%). Orange line = income growth.
        </p>
      </div>

      {/* Elasticity table — full width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <p style={labelStyle}>Income elasticities by category — China</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #d0d7de' }}>
              {['Category', 'ε_Y Rural', 'ε_Y Urban', 'Classification'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 16px 8px 0', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chinaSpending2023.filter((d) => d.elasticityRural !== null).map((d) => (
              <tr key={d.category} style={{ borderBottom: '1px solid #eaeef2' }}>
                <td style={{ padding: '7px 16px 7px 0', color: '#1b1f23', fontWeight: 500 }}>{d.category}</td>
                <td style={{ padding: '7px 16px 7px 0', fontFamily: 'monospace', fontSize: 13 }}>{d.elasticityRural}</td>
                <td style={{ padding: '7px 16px 7px 0', fontFamily: 'monospace', fontSize: 13 }}>{d.elasticityUrban}</td>
                <td style={{ padding: '7px 0' }}>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 4,
                    background: d.type === 'luxury' ? '#ddf4ff' : '#f6f8fa',
                    color: d.type === 'luxury' ? '#0969da' : '#57606a',
                    border: `1px solid ${d.type === 'luxury' ? '#b6e3ff' : '#d0d7de'}`,
                  }}>
                    {d.type === 'luxury' ? 'Luxury ε > 1' : 'Necessity ε < 1'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: '#6e7681', marginTop: 6 }}>
          Source: AOF/CICC study based on NBS data [OBS — ELES model; estimates are model-dependent]
        </p>
      </div>
    </div>
  )
}
