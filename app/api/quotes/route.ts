import { NextResponse } from 'next/server'

const TICKERS = ['MC.PA', 'FRE.XETRA', 'FME.XETRA']
const EODHD_KEY = process.env.EODHD_API_KEY ?? ''

export async function GET() {
  if (!EODHD_KEY) {
    // Return static fallback if key not configured
    return NextResponse.json({
      source: 'static-fallback',
      note: 'Set EODHD_API_KEY env var on Railway for live quotes',
      quotes: STATIC_FALLBACK,
      asOf: '2026-10-15',
    })
  }

  try {
    const results = await Promise.all(
      TICKERS.map(async (ticker) => {
        const url = `https://eodhd.com/api/real-time/${ticker}?api_token=${EODHD_KEY}&fmt=json`
        const res = await fetch(url, { next: { revalidate: 300 } }) // 5-min cache
        if (!res.ok) throw new Error(`EODHD ${ticker}: ${res.status}`)
        return res.json()
      })
    )

    const quotes = results.map((q, i) => ({
      ticker: TICKERS[i],
      price: q.close,
      change: q.change_p,
      volume: q.volume,
      asOf: new Date(q.timestamp * 1000).toISOString().split('T')[0],
    }))

    return NextResponse.json({ source: 'live', quotes })
  } catch (err) {
    return NextResponse.json(
      { source: 'error', error: String(err), quotes: STATIC_FALLBACK },
      { status: 200 } // degrade gracefully
    )
  }
}

// Last-known values from kask tools — 15 Oct 2026
const STATIC_FALLBACK = [
  { ticker: 'MC.PA',       price: 398.30, change: 2.25, asOf: '2026-10-15' },
  { ticker: 'FRE.XETRA',  price: 43.855, change: 0.68, asOf: '2026-10-15' },
  { ticker: 'FME.XETRA',  price: 39.46,  change: 2.95, asOf: '2026-10-15' },
]
