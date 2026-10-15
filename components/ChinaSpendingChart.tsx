'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { chinaSpending2023 } from '@/data/research'

export default function ChinaSpendingChart() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Budget Share (%)</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chinaSpending2023} layout="vertical" margin={{ left: 4, right: 16 }} barSize={10}>
            <CartesianGrid strokeDasharray="2 4" stroke="#e8e8e8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#444' }} width={108} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 11, border: '1px solid #e8e8e8', borderRadius: 4 }} formatter={(v: number) => [`${v}%`, 'Share']} />
            <Bar dataKey="share" radius={[0, 2, 2, 0]}>
              {chinaSpending2023.map((d) => <Cell key={d.category} fill={d.type === 'luxury' ? '#1f77b4' : '#bbb'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>YoY Growth 2023 (%)</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chinaSpending2023} layout="vertical" margin={{ left: 4, right: 16 }} barSize={10}>
            <CartesianGrid strokeDasharray="2 4" stroke="#e8e8e8" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#444' }} width={108} axisLine={false} tickLine={false} />
            <ReferenceLine x={6.3} stroke="#ff7f0e" strokeDasharray="3 2" label={{ value: '↑ income 6.3%', fill: '#ff7f0e', fontSize: 9, position: 'insideTopRight' }} />
            <Tooltip contentStyle={{ fontSize: 11, border: '1px solid #e8e8e8', borderRadius: 4 }} formatter={(v: number) => [`${v}%`, 'YoY']} />
            <Bar dataKey="yoyGrowth" radius={[0, 2, 2, 0]}>
              {chinaSpending2023.map((d) => <Cell key={d.category} fill={d.yoyGrowth > 6.3 ? '#2ca02c' : '#bbb'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 10, color: '#999', marginTop: 4 }}>Green = growing faster than household income (+6.3%)</p>
      </div>

      {/* Elasticity table */}
      <div style={{ gridColumn: '1 / -1' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              {['Category', 'ε_Y Rural', 'ε_Y Urban', 'Type'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 12px 6px 0', fontSize: 11, color: '#555', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chinaSpending2023.filter((d) => d.elasticityRural !== null).map((d) => (
              <tr key={d.category} style={{ borderBottom: '1px solid #f3f3f3' }}>
                <td style={{ padding: '5px 12px 5px 0', color: '#1b1f23' }}>{d.category}</td>
                <td style={{ padding: '5px 12px 5px 0', fontFamily: 'monospace', fontSize: 12 }}>{d.elasticityRural}</td>
                <td style={{ padding: '5px 12px 5px 0', fontFamily: 'monospace', fontSize: 12 }}>{d.elasticityUrban}</td>
                <td style={{ padding: '5px 0' }}>
                  <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 3, background: d.type === 'luxury' ? '#e8f0fe' : '#f3f3f3', color: d.type === 'luxury' ? '#1d4ed8' : '#666' }}>
                    {d.type === 'luxury' ? 'Luxury ε>1' : 'Necessity ε<1'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 10, color: '#aaa', marginTop: 6 }}>Source: AOF/CICC study based on NBS data [OBS, model-dependent — ELES model]</p>
      </div>
    </div>
  )
}
