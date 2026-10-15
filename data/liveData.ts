// ─────────────────────────────────────────────────────────────────────────────
//  Live data snapshot — pulled from kask data services (EODHD + FMP + FRED)
//  on 15 Oct 2026. The web app refreshes via /api/quotes and /api/worldbank.
//  These values serve as the static fallback when the API is unavailable.
// ─────────────────────────────────────────────────────────────────────────────

// EODHD real-time quotes — 15 Oct 2026 [OBS via kask/EODHD]
export const liveQuotes = [
  { ticker: 'MC.PA',      name: 'LVMH',             price: 398.30, change: 2.25, currency: 'EUR', exchange: 'Euronext Paris' },
  { ticker: 'FRE.XETRA', name: 'Fresenius SE',      price: 43.855, change: 0.68, currency: 'EUR', exchange: 'XETRA' },
  { ticker: 'FME.XETRA', name: 'Fresenius Med Care', price: 39.46, change: 2.95, currency: 'EUR', exchange: 'XETRA' },
]

// EODHD + FMP income statements — [OBS via kask tools]
export const companyRevenue = {
  'MC.PA': {
    name: 'LVMH',
    currency: 'EUR',
    years: [2022, 2023, 2024, 2025],
    revenue: [79184, 86153, 84683, 80807], // millions
    yoy: [null, 8.8, -1.7, -4.6],          // %
    operatingMargin: [null, null, 22.3, 21.9],
    peRatioTTM: 17.86,
    marketCapBn: 194.3,
    source: 'EODHD via kask — income_statement + key_metrics, 15 Oct 2026',
  },
  'FRE.XETRA': {
    name: 'Fresenius SE',
    currency: 'EUR',
    years: [2022, 2023, 2024, 2025],
    revenue: [21329, 21067, 21833, 22873], // millions
    yoy: [null, -1.2, 3.6, 4.8],
    operatingMargin: [7.0, 6.3, 8.4, 9.5],
    peRatioTTM: 19.07,
    marketCapBn: 24.1,
    source: 'EODHD via kask — income_statement + key_metrics, 15 Oct 2026',
  },
}

// FRED Personal Consumption Expenditures (PCE) — monthly, billions USD [OBS via kask/FRED]
// Series: PCE, retrieved 15 Oct 2026
export const fredPCE = [
  { date: '2025-01', value: 20400.4 },
  { date: '2025-03', value: 20594.0 },
  { date: '2025-06', value: 20799.4 },
  { date: '2025-09', value: 21126.5 },
  { date: '2025-12', value: 21336.0 },
  { date: '2026-01', value: 21383.1 },
  { date: '2026-04', value: 21856.9 },
  { date: '2026-06', value: 22095.5 },
  { date: '2026-08', value: 22308.5 },
]
// PCE growth Jan 2025 → Aug 2026: +9.3% in 19 months [INF: ~5.8% annualised]

// World Bank GDP per capita PPP — key milestones [OBS via kask/World Bank]
// Full series served live at /api/worldbank
export const gdpSummary = [
  { economy: 'China',   iso3: 'CHN', ppp2000: 4066,  ppp2024: 23841, cagr: 7.9, note: '+487% total' },
  { economy: 'India',   iso3: 'IND', ppp2000: 3010,  ppp2024: 9416,  cagr: 4.9, note: '+213% total' },
  { economy: 'Brazil',  iso3: 'BRA', ppp2000: 14005, ppp2024: 19652, cagr: 1.4, note: 'Peaked 2013-14' },
  { economy: 'Germany', iso3: 'DEU', ppp2000: 49956, ppp2024: 62655, cagr: 1.0, note: 'Stable high-income' },
  { economy: 'USA',     iso3: 'USA', ppp2000: 55046, ppp2024: 75698, cagr: 1.3, note: 'Lowest quintile +6.8% (2022-24)' },
]
