'use client'
import { useEffect, useState } from 'react'
import { mercadoLibre } from '@/data/emergingMarkets'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

const revenueData = Object.entries(mercadoLibre.revenue).map(([y, v]) => ({
  year: y, revenue: v,
  growth: mercadoLibre.revenueGrowth[y as unknown as keyof typeof mercadoLibre.revenueGrowth] ?? null,
}))

type Quote = { price: number; change: number; source: string }

export default function MeliQuote() {
  const [quote, setQuote] = useState<Quote>({ price: mercadoLibre.price, change: mercadoLibre.change, source: 'static' })

  useEffect(() => {
    fetch('/api/meli')
      .then(r => r.json())
      .then(d => { if (d.price) setQuote(d) })
      .catch(() => {})
  }, [])

  const up = quote.change >= 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32, marginBottom: 32 }}>
      {/* Quote card */}
      <div style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '20px 24px', background: '#fff' }}>
        <p style={{ margin: '0 0 3px', fontSize: 11, color: '#6e7681', fontFamily: 'monospace' }}>MELI · NASDAQ</p>
        <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 18, color: '#1b1f23' }}>MercadoLibre, Inc.</p>
        <p style={{ margin: 0, fontSize: 32, fontWeight: 700, fontFamily: 'monospace', color: '#1b1f23', lineHeight: 1 }}>
          ${quote.price.toFixed(2)}
        </p>
        <p style={{ margin: '8px 0 16px', fontSize: 14, color: up ? '#1a7f37' : '#cf222e', fontWeight: 600 }}>
          {up ? '▲' : '▼'} {Math.abs(quote.change).toFixed(2)}%
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Market cap', `$${mercadoLibre.marketCapBn}B`],
            ['Revenue 2025', `$${mercadoLibre.revenue[2025]}B`],
            ['Rev growth', `+${mercadoLibre.revenueGrowth[2025]}%`],
            ['Net income', `$${mercadoLibre.netIncome2025}B`],
          ].map(([k, v]) => (
            <div key={k} style={{ background: '#f6f8fa', borderRadius: 6, padding: '8px 10px' }}>
              <p style={{ margin: 0, fontSize: 10, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{k}</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: '#1b1f23', fontFamily: 'monospace' }}>{v}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: 10, color: '#afb8c1' }}>
          {quote.source === 'live' ? '● Live — EODHD' : '◎ Snapshot 15 Oct 2026'} · FMP financials [OBS]
        </p>
      </div>

      {/* Revenue area chart */}
      <div>
        <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Annual Revenue ($B) — MercadoLibre 2023-2025
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueData} margin={{ left: 0, right: 12, top: 8 }}>
            <defs>
              <linearGradient id="meliGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4e79a7" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4e79a7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eaeef2" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6e7681' }} axisLine={{ stroke: '#d0d7de' }} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6e7681' }} axisLine={false} tickLine={false} width={42} tickFormatter={(v: number) => `$${v}B`} />
            <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #d0d7de', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }} formatter={(v: number) => [`$${v}B`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#4e79a7" strokeWidth={2.5} fill="url(#meliGrad)" dot={{ r: 5, fill: '#4e79a7', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>

        {/* Growth badges */}
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {revenueData.filter(d => d.growth).map(d => (
            <div key={d.year} style={{ background: '#e6f4ea', border: '1px solid #a8d5b5', borderRadius: 6, padding: '6px 12px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#1a7f37', fontWeight: 600 }}>{d.year}: +{d.growth}% YoY</p>
            </div>
          ))}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#6e7681' }}>
          Source: FMP income_statement — MELI, 15 Oct 2026 [OBS]. 3-year revenue CAGR: ~38%.
        </p>
      </div>
    </div>
  )
}
