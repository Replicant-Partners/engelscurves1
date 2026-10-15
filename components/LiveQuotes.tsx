'use client'
import { useEffect, useState } from 'react'
import { liveQuotes } from '@/data/liveData'

type Quote = { ticker: string; price: number; change: number; asOf?: string }

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
        } else {
          setSource('error')
        }
      })
      .catch(() => setSource('error'))
  }, [])

  const sourceLabel = {
    loading: { text: 'Loading…', color: '#aaa' },
    live:    { text: '● Live (EODHD)', color: '#16a34a' },
    static:  { text: '◎ Snapshot 15 Oct 2026', color: '#b45309' },
    error:   { text: '○ API unavailable — snapshot', color: '#999' },
  }[source]

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Company Quotes — Chain Companies
        </p>
        <span style={{ fontSize: 11, color: sourceLabel.color }}>{sourceLabel.text}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {quotes.map((q) => {
          const full = liveQuotes.find((x) => x.ticker === q.ticker)
          const up = q.change >= 0
          return (
            <div key={q.ticker} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: '14px 16px', background: '#fff' }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, color: '#999', fontFamily: 'monospace' }}>{q.ticker}</p>
              <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14 }}>{full?.name ?? q.ticker}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace' }}>{full?.currency} {q.price?.toFixed(2)}</span>
                <span style={{ fontSize: 12, color: up ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                  {up ? '▲' : '▼'} {Math.abs(q.change ?? 0).toFixed(2)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
