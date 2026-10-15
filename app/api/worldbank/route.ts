import { NextResponse } from 'next/server'

// World Bank API — no key required
const INDICATOR = 'NY.GDP.PCAP.PP.KD'
const COUNTRIES = ['USA', 'CHN', 'IND', 'DEU', 'BRA']
const FROM = 2000
const TO   = 2024

export async function GET() {
  try {
    const results = await Promise.all(
      COUNTRIES.map(async (iso3) => {
        const url = `https://api.worldbank.org/v2/country/${iso3}/indicator/${INDICATOR}?date=${FROM}:${TO}&format=json&per_page=30`
        const res = await fetch(url, { next: { revalidate: 86400 } }) // 24h cache
        if (!res.ok) throw new Error(`WB ${iso3}: ${res.status}`)
        const [, data] = await res.json()
        return { iso3, data: (data as Array<{ date: string; value: number | null }>).filter((d) => d.value !== null).map((d) => ({ year: parseInt(d.date), value: Math.round(d.value!) })) }
      })
    )

    // Pivot to time-series rows: [{ year, USA, CHN, IND, DEU, BRA }]
    const years = Array.from({ length: TO - FROM + 1 }, (_, i) => FROM + i)
    const byCountry: Record<string, Record<number, number>> = {}
    for (const { iso3, data } of results) {
      byCountry[iso3] = {}
      for (const d of data) byCountry[iso3][d.year] = d.value
    }

    const countryNames: Record<string, string> = { USA: 'USA', CHN: 'China', IND: 'India', DEU: 'Germany', BRA: 'Brazil' }
    const series = years.map((year) => {
      const row: Record<string, number | string> = { year }
      for (const iso3 of COUNTRIES) {
        if (byCountry[iso3]?.[year]) row[countryNames[iso3]] = byCountry[iso3][year]
      }
      return row
    }).filter((r) => Object.keys(r).length > 1)

    return NextResponse.json({ source: 'worldbank', indicator: INDICATOR, series })
  } catch (err) {
    return NextResponse.json({ source: 'error', error: String(err), series: [] }, { status: 200 })
  }
}
