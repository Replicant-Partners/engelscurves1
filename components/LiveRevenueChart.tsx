'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { companyRevenue } from '@/data/liveData'

const COLORS: Record<string, string> = { 'MC.PA': '#1f77b4', 'FRE.XETRA': '#2ca02c' }

export default function LiveRevenueChart() {
  const data = [2022, 2023, 2024, 2025].map((year) => {
    const row: Record<string, string | number> = { year }
    for (const [ticker, co] of Object.entries(companyRevenue)) {
      const idx = co.years.indexOf(year)
      if (idx >= 0) row[co.name] = co.revenue[idx]
    }
    return row
  })

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Revenue bar chart */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Annual Revenue (€M)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ left: 0, right: 16 }} barGap={4} barSize={18}>
              <CartesianGrid strokeDasharray="2 4" stroke="#e8e8e8" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${(v / 1000).toFixed(0)}bn`} width={44} />
              <Tooltip contentStyle={{ fontSize: 11, border: '1px solid #e8e8e8', borderRadius: 4 }} formatter={(v: number) => [`€${v.toLocaleString()}M`, '']} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              {Object.entries(companyRevenue).map(([ticker, co]) => (
                <Bar key={ticker} dataKey={co.name} fill={COLORS[ticker]} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>Source: EODHD via kask — income_statement, 15 Oct 2026 [OBS]</p>
        </div>

        {/* YoY growth table */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>YoY Revenue Growth</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px 4px 0', fontSize: 11, color: '#555' }}>Year</th>
                {Object.values(companyRevenue).map((co) => (
                  <th key={co.name} style={{ textAlign: 'right', padding: '4px 0', fontSize: 11, color: '#555' }}>{co.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[2023, 2024, 2025].map((year) => (
                <tr key={year} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '5px 8px 5px 0', fontFamily: 'monospace' }}>{year}</td>
                  {Object.values(companyRevenue).map((co) => {
                    const idx = co.years.indexOf(year)
                    const yoy = idx >= 0 ? co.yoy[idx] : null
                    return (
                      <td key={co.name} style={{ textAlign: 'right', padding: '5px 0', fontFamily: 'monospace', color: yoy === null ? '#ccc' : yoy >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                        {yoy === null ? '—' : `${yoy > 0 ? '+' : ''}${yoy}%`}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Key metrics */}
          <div style={{ marginTop: 16 }}>
            {Object.values(companyRevenue).map((co) => (
              <div key={co.name} style={{ marginBottom: 8, padding: '8px 10px', background: '#f9f9f9', borderRadius: 4, fontSize: 11 }}>
                <strong style={{ color: '#333' }}>{co.name}</strong>
                <span style={{ color: '#666', marginLeft: 8 }}>P/E {co.peRatioTTM}x · Mkt cap €{co.marketCapBn}bn</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
