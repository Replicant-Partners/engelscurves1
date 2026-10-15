import { NextResponse } from 'next/server'

const EODHD_KEY = process.env.EODHD_API_KEY ?? ''

export async function GET() {
  if (!EODHD_KEY) {
    return NextResponse.json({ price: 1856.98, change: 0.97, source: 'static' })
  }
  try {
    const res = await fetch(
      `https://eodhd.com/api/real-time/MELI.US?api_token=${EODHD_KEY}&fmt=json`,
      { next: { revalidate: 300 } }
    )
    const q = await res.json()
    return NextResponse.json({ price: q.close, change: q.change_p, source: 'live' })
  } catch {
    return NextResponse.json({ price: 1856.98, change: 0.97, source: 'static' })
  }
}
