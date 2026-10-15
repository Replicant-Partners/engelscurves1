'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { companyRevenue } from '@/data/liveData'

const COLORS: Record<string, string> = { LVMH: '#4e79a7', 'Fresenius SE': '#59a14f' }

const axisStyle = { fontSize: 12, fill: '#6e7681', fontFamily: 'inherit' }
const tooltipStyle = {
  fontSize: 13, fontFamily: 'inherit',
  border: '1px solid #d0d7de', borderRadius: 6,
  boxShadow: '0 4px 12px rgba(0,0,0,.08)', background: '#fff',
}

export default function LiveRevenueChart() {
  const data = [2022, 2023, 2024, 2025].map((year) => {
    const row: Record<string, string | number> = { year }
    for (const co of Object.values(companyRevenue)) {
      const idx = co.years.indexOf(year)
      if (idx >= 0) row[co.name] = co.revenue[idx]
    }
    return row
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 40 }}>
      <div>
        <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Annual Revenue (€M) — EODHD income statements
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barGap={6} barSize={22} margin={{ left: 0, right: 12 }}>
            <CartesianGrid stroke="#eaeef2" vertical={false} />
            <XAxis dataKey="year" tick={axisStyle} axisLine={{ stroke: '#d0d7de' }} tickLine={false} tickMargin={8} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={52} tickMargin={4} tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}B`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [`€${v.toLocaleString()}M`, name]} />
            <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, fontFamily: 'inherit', color: '#6e7681', paddingTop: 12 }} />
            {Object.values(companyRevenue).map((co) => (
              <Bar key={co.name} dataKey={co.name} fill={COLORS[co.name]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <p style={{ fontSize: 12, color: '#6e7681', marginTop: 8 }}>
          Source: EODHD via kask — income_statement · 15 Oct 2026 [OBS]
        </p>
      </div>

      <div>
        <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          YoY Revenue Growth & Multiples
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #d0d7de' }}>
              <th style={{ textAlign: 'left', padding: '5px 12px 7px 0', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Year</th>
              {Object.values(companyRevenue).map((co) => (
                <th key={co.name} style={{ textAlign: 'right', padding: '5px 0 7px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{co.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[2023, 2024, 2025].map((year) => (
              <tr key={year} style={{ borderBottom: '1px solid #eaeef2' }}>
                <td style={{ padding: '6px 12px 6px 0', fontFamily: 'monospace', fontSize: 13 }}>{year}</td>
                {Object.values(companyRevenue).map((co) => {
                  const idx = co.years.indexOf(year)
                  const yoy = idx >= 0 ? co.yoy[idx] : null
                  return (
                    <td key={co.name} style={{ textAlign: 'right', padding: '6px 0', fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: yoy === null ? '#afb8c1' : yoy >= 0 ? '#1a7f37' : '#cf222e' }}>
                      {yoy === null ? '—' : `${yoy > 0 ? '+' : ''}${yoy}%`}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.values(companyRevenue).map((co) => (
            <div key={co.name} style={{ background: '#f6f8fa', border: '1px solid #eaeef2', borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
              <strong style={{ color: '#1b1f23' }}>{co.name}</strong>
              <span style={{ color: '#6e7681', marginLeft: 8 }}>P/E {co.peRatioTTM}× · Mkt cap €{co.marketCapBn}B</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
