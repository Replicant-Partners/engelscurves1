'use client'
import { useEffect, useState } from 'react'
import { liveQuotes } from '@/data/liveData'

type Quote = { ticker: string; price: number; change: number; asOf?: string }

const dot = (s: 'loading' | 'live' | 'static' | 'error') =>
  ({ loading: '○', live: '●', static: '◎', error: '×' })[s]

const dotColor = (s: 'loading' | 'live' | 'static' | 'error') =>
  ({ loading: '#afb8c1', live: '#1a7f37', static: '#9a6700', error: '#cf222e' })[s]

export default function LiveQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>(liveQuotes)
  const [source, setSource] = useState<'loading' | 'live' | 'static' | 'error'>('loading')

  useEffect(() => {
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((data) => {
        if (data.quotes?.length) {
          setQuotes(data.quotes)
          setSource(data.source === 'live' ? 'live' : 'static')
        } else setSource('error')
      })
      .catch(() => setSource('error'))
  }, [])

  const srcLabel = {
    loading: 'Fetching live quotes…',
    live:    'Live — EODHD',
    static:  'Snapshot · 15 Oct 2026 (set EODHD_API_KEY for live)',
    error:   'API unavailable — using snapshot',
  }[source]

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Chain company quotes
        </p>
        <span style={{ fontSize: 12, color: dotColor(source), fontFamily: 'inherit' }}>
          {dot(source)} {srcLabel}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {quotes.map((q) => {
          const meta = liveQuotes.find((x) => x.ticker === q.ticker)
          const up = (q.change ?? 0) >= 0
          return (
            <div key={q.ticker} style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '16px 20px', background: '#fff' }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: '#6e7681', fontFamily: 'monospace' }}>{q.ticker}</p>
              <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 15, color: '#1b1f23' }}>{meta?.name ?? q.ticker}</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 700, fontFamily: '"SFMono-Regular", Consolas, monospace', color: '#1b1f23', lineHeight: 1 }}>
                {meta?.currency}&nbsp;{(q.price ?? 0).toFixed(2)}
              </p>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: up ? '#1a7f37' : '#cf222e', fontWeight: 500 }}>
                {up ? '▲' : '▼'} {Math.abs(q.change ?? 0).toFixed(2)}%
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
