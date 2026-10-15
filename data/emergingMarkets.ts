// ─────────────────────────────────────────────────────────────────────────────
//  Emerging Markets data — updated Oct 2026
//  Sources labeled [OBS] = observed/sourced, [INF] = inference, [JDG] = judgment
// ─────────────────────────────────────────────────────────────────────────────

// Observable image assets (original notebook files)
export const OBS_IMAGES = {
  engelGlobal:  'https://static.observableusercontent.com/files/ac5dd7ec8e84a9fdf71fc04762e893845a72338d32ff229990af2786404496990a6eb7337331baf7a2385d52c29905723c3d6f31d3fc4c290e172a8b51fd46d5',
  argCurve:     'https://static.observableusercontent.com/files/e23cd16730b91f6dfa9d713d2381fe8a87835f72918ab70322adfe64920682571fae29cdabba4124b90b38f01ebc90cf4b614fa4a3e24789d3503722cf19ad13',
  argMarket:    'https://static.observableusercontent.com/files/50f275d6e4b1abe6f58aa12ad9da4cb2a1b6553a303d194fd6c0f9f9c7565d08d350f13994bb1f431e56aa158ec8e431ee4a2103efeb96101309ab8231ec7366',
  ethiopia:     'https://static.observableusercontent.com/files/32628c8fbeadb3b2372d38c5b9462a98224ec7a584082e9c96a88f3544cf14614bb425847a19a9e64c551633fac5a31ac284d5fbe8bb85fbd1c7b136b0455063',
  mexico:       'https://static.observableusercontent.com/files/5caa05e142eba3d81b08ffa9c0a46cae40b176f44d5144303e2cd05380f08b9592cda71114c5af404a0117ade817e6035b3efed07cc11f8f82987111285bc04c',
}

// ── GDP per capita PPP (constant 2021 $) — World Bank, Oct 2026 [OBS] ───────
export const gdpPPP = {
  Argentina:  { ppp2024: 26772,  ppp2020: 23877,  nominal2024: 13000  }, // nominal ~$13k estimate [INF]
  Mexico:     { ppp2024: 21970,  ppp2020: 19728,  nominal2024: 11500  },
  Indonesia:  { ppp2024: 14471,  ppp2020: 12389,  nominal2024: 4800   },
  Egypt:      { ppp2024: 16798,  ppp2020: 15309,  nominal2024: 3900   },
  Ethiopia:   { ppp2024: 2892,   ppp2020: 2517,   nominal2024: 1200   },
  Brazil:     { ppp2024: 19652,  ppp2020: 17328,  nominal2024: 10700  },
}

// ── MercadoLibre — FMP + EODHD, Oct 2026 [OBS] ─────────────────────────────
export const mercadoLibre = {
  ticker: 'MELI',
  price: 1856.98,
  change: 0.97,
  marketCapBn: 94.1,
  revenue: { 2023: 15.1, 2024: 20.8, 2025: 28.9 }, // $B
  revenueGrowth: { 2024: 37.7, 2025: 39.1 },        // %
  netIncome2025: 2.0,                                 // $B
  grossMargin2025: 44.5,                             // %
  source: 'FMP income_statement + EODHD stock_quote, 15 Oct 2026 [OBS]',
}

// ── Engel curve inflection points — original Observable analysis [OBS] ───────
export const engelInflection = [
  { income: 10000, food: 35, housing: 9,  tech: 3,  healthcare: 5,  education: 4 },
  { income: 12000, food: 32, housing: 12, tech: 5,  healthcare: 6,  education: 5 },
  { income: 14000, food: 29, housing: 16, tech: 8,  healthcare: 7,  education: 6 },
  { income: 16000, food: 26, housing: 20, tech: 11, healthcare: 8,  education: 7 },
  { income: 18000, food: 24, housing: 24, tech: 14, healthcare: 9,  education: 8 },
  { income: 20000, food: 23, housing: 26, tech: 16, healthcare: 10, education: 8 },
  { income: 25000, food: 22, housing: 28, tech: 18, healthcare: 11, education: 9 },
  { income: 30000, food: 22, housing: 29, tech: 20, healthcare: 12, education: 9 },
]

// ── Country elasticities — original Observable analysis [OBS] ────────────────
export const countryElasticities = [
  { country: 'Brazil',    sector: 'Education',           elasticity: 1.2, company: 'Ser Educacional',  inflection: 14000, color: '#e15759' },
  { country: 'Brazil',    sector: 'Financial Services',  elasticity: 1.1, company: 'MercadoLibre',     inflection: 14000, color: '#e15759' },
  { country: 'India',     sector: 'E-commerce',          elasticity: 1.2, company: "HDFC Bank",         inflection: 13000, color: '#f28e2b' },
  { country: 'Argentina', sector: 'Real Estate',         elasticity: 1.4, company: 'IRSA',              inflection: 20000, color: '#4e79a7' },
  { country: 'Argentina', sector: 'Financial Services',  elasticity: 1.3, company: 'Grupo Financiero Galicia', inflection: 20000, color: '#4e79a7' },
  { country: 'Indonesia', sector: 'Fintech',             elasticity: 1.1, company: 'GoTo / Gojek',      inflection: 13000, color: '#59a14f' },
  { country: 'Indonesia', sector: 'E-commerce',          elasticity: 0.9, company: 'Bank Central Asia',  inflection: 13000, color: '#59a14f' },
  { country: 'Egypt',     sector: 'Education',           elasticity: 1.2, company: 'CIRA',               inflection: 16000, color: '#edc948' },
]

// ── Argentina sectors — updated Oct 2026 [OBS + INF] ────────────────────────
export const argSectors = [
  { sector: 'Vaca Muerta (Oil & Gas)', cagr2030: 8,  size2024: 100, size2030: 141, unit: '$B', flag: 'OBS', note: 'Infrastructure bottleneck; Milei reforms opening to private investment' },
  { sector: 'Lithium (mining)',        cagr2030: 15, size2024: 4,   size2030: 10,  unit: '$B', flag: 'OBS', note: 'World\'s 2nd largest reserves; Milei removed state monopoly in 2024' },
  { sector: 'Knowledge exports',       cagr2030: 7,  size2024: 7,   size2030: 11,  unit: '$B', flag: 'INF', note: 'IT services; devaluation boosted competitiveness' },
  { sector: 'Crypto / Fintech',        cagr2030: 12, size2024: 3,   size2030: 6,   unit: '$B', flag: 'INF', note: 'Highest crypto adoption per capita in LatAm; Milei pro-crypto stance' },
  { sector: 'Agriculture (agro)',      cagr2030: 5,  size2024: 33,  size2030: 44,  unit: '$B', flag: 'OBS', note: 'Soy/corn/wheat; devaluation benefits exporters' },
]

// ── Mexico sectors — updated 2025/2026 [OBS] ────────────────────────────────
export const mexicoSectors = [
  { sector: 'Nearshoring / Manufacturing', cagr2030: 12, note: '#1 source of US imports (17% share, 2026). FDI record $41B in 2025. Plan Mexico targets 25-28% investment/GDP', flag: 'OBS' },
  { sector: 'Automotive / Aerospace',      cagr2030: 7,  note: 'Motor vehicles 5.2% of US imports from Mexico. Tesla Monterrey plant under negotiation', flag: 'OBS' },
  { sector: 'E-commerce',                  cagr2030: 18, note: 'MercadoLibre dominates; 39% revenue growth 2025. Walmart Mexico / Rappi expanding', flag: 'OBS' },
  { sector: 'Fintech',                     cagr2030: 14, note: 'Nu Mexico (Nubank) 9M+ users. CNBV digital banking licenses growing', flag: 'OBS' },
  { sector: 'Semiconductors / Advanced mfg', cagr2030: 20, note: 'Nearshoring 2.0 — chips, medical devices, AI infrastructure. Early stage', flag: 'INF' },
]

// ── Ethiopia sectors — updated 2025/2026 [OBS + INF] ────────────────────────
export const ethiopiaSectors = [
  { sector: 'Mobile Money',   value2024: 12, value2030: 38, note: 'Safaricom Ethiopia (M-Pesa) launched 2022; 8M+ users by 2024. Telebirr (Ethio Telecom) 40M+ users', flag: 'OBS' },
  { sector: 'Manufacturing',  value2024: 18, value2030: 38, note: 'Industrial parks (Hawassa, Bole Lemi) attracting Asian manufacturers. Textile exports growing', flag: 'OBS' },
  { sector: 'Energy (GERD)',  value2024: 8,  value2030: 28, note: 'Grand Ethiopian Renaissance Dam fully operational 2023; Africa\'s largest hydropower dam (5.15 GW)', flag: 'OBS' },
]
