// ─────────────────────────────────────────────────────────────────────────────
//  Company deep research reports — Phase 1: pre-computed via company-research-deep
//  All data sourced via kask tools (FMP, EODHD, transcripts, web search)
//  As-of: 2026-10-15 | Not investment advice
// ─────────────────────────────────────────────────────────────────────────────

export type GorillaVerdict = 'GORILLA' | 'SMALL_ANIMAL' | 'PEDESTRIAN'
export type MoatVerdict = 'wide' | 'narrow' | 'none'
export type ManagementRating = 'excellent' | 'good' | 'average' | 'poor'

export interface CompanyReport {
  ticker: string
  name: string
  asOf: string
  price: number
  currency: string
  exchange: string
  marketCapBn: number

  // Engel curve connection
  engelCurveConnection: {
    economies: string[]
    incomeRange: string
    spendingCategories: { category: string; elasticity: number }[]
    mechanism: string
  }

  // Pipeline outputs
  gorilla: {
    score: number
    verdict: GorillaVerdict
    dimensions: {
      obviousProblem: number
      invisibleGorilla: number
      combinatorialSolution: number
      chokePoint: number
    }
    summary: string
  }

  moat: MoatVerdict
  managementRating: ManagementRating

  // Financial snapshot (Level 1 — audited)
  financials: {
    revenue: { year: number; value: number }[]
    revenueCAGR: number
    grossMargin: number
    ebitMargin: number
    freeCashFlowBn: number
    netDebtBn: number
    roic: number
  }

  // Valuation
  valuation: {
    dcfIntrinsic: number
    impliedGrowth: number
    demonstratedGrowth: number
    expectationsGapPp: number
    signal: string
    peRatio: number
    psRatio: number
    evEbitda: number
  }

  // Thesis
  thesis: {
    supported: boolean
    conclusion: string
    franchise: string
    management: string
    valuationNote: string
    priceConclusion: string
  }

  // IMAGINE scenarios
  scenarios: {
    bull: { revenue: string; ebitMargin: string; probability: number; assumption: string }
    base: { revenue: string; ebitMargin: string; probability: number; assumption: string }
    bear: { revenue: string; ebitMargin: string; probability: number; assumption: string }
    horizon: string
  }

  // Falsifiable predictions
  predictions: {
    event: string
    probability: number
    horizon: string
    confirms: string
    refutes: string
  }[]

  // Key risks
  falsifiers: string[]

  // Data provenance
  sources: string[]
  pipeline: string
  notInvestmentAdvice: boolean
}

// ── MercadoLibre (MELI) — 2026-10-15 ────────────────────────────────────────
// Full report: data/reports/MELI-2026-10-15.md
// Sources: FMP audited statements (FY2023-2025), Q2 2026 earnings transcript,
//          kask valuation tools, web search competitive analysis
const MELI: CompanyReport = {
  ticker: 'MELI',
  name: 'MercadoLibre, Inc.',
  asOf: '2026-10-15',
  price: 1856.98,
  currency: 'USD',
  exchange: 'NASDAQ',
  marketCapBn: 94.1,

  engelCurveConnection: {
    economies: ['Brazil', 'Mexico', 'Argentina'],
    incomeRange: '$10,000–$20,000 per capita PPP',
    spendingCategories: [
      { category: 'E-commerce', elasticity: 1.2 },
      { category: 'Financial Services', elasticity: 1.15 },
    ],
    mechanism:
      'As Brazil (~$12k PPP), Mexico (~$22k PPP) and Argentina households move through the $10k–$20k per capita income range, e-commerce and financial services budget shares rise faster than income. MercadoLibre sits at the intersection of both — Commerce (Marketplace) and Fintech (Mercado Pago) — creating a self-reinforcing flywheel: more commerce → richer credit data → better underwriting → more credit → more commerce.',
  },

  gorilla: {
    score: 78,
    verdict: 'GORILLA',
    dimensions: {
      obviousProblem: 70,     // LatAm financial exclusion + 11% e-commerce penetration; market-reality gate: Amazon exists → capped at 70
      invisibleGorilla: 85,   // Credit-data flywheel + ecosystemic user multiplier; falsified NU edge case → adjusted 90→85
      combinatorialSolution: 80, // Commerce × Fintech × Logistics × Advertising × AI
      chokePoint: 75,         // 27Y proprietary data + Envios density + PIX integration
    },
    summary:
      'MercadoLibre is a GORILLA (score 78). The invisible gorilla is the credit-underwriting flywheel built on 27 years of behavioral transactional data that no competitor can replicate from a standing start. Ecosystemic users (Marketplace + Fintech combined) generate 70% more GMV and are multiples more profitable. The combinatorial lock: Commerce × Fintech × Logistics × Advertising × AI each reinforce the others. Choke point: proprietary data moat + Mercado Envios network density in Brazil.',
  },

  moat: 'wide',
  managementRating: 'excellent',

  financials: {
    revenue: [
      { year: 2023, value: 15.1 },
      { year: 2024, value: 20.8 },
      { year: 2025, value: 28.9 },
    ],
    revenueCAGR: 0.422,       // 4-year CAGR from FMP audited [OBS]
    grossMargin: 0.445,       // FY2025 audited [OBS]
    ebitMargin: 0.067,        // Q2 2026 reported [OBS]
    freeCashFlowBn: 10.8,     // FY2025 audited [OBS]
    netDebtBn: 7.7,           // FY2025 audited [OBS]
    roic: 0.118,              // FY2025 kask key_metrics [OBS]
  },

  valuation: {
    dcfIntrinsic: 4851,       // kask dcf_valuation, 15% investor target return [OBS tool output]
    impliedGrowth: 0.211,     // kask reverse_dcf [OBS tool output]
    demonstratedGrowth: 0.422, // 4-year revenue CAGR [OBS]
    expectationsGapPp: -21.1, // implied − demonstrated, lisp_eval [OBS]
    signal: 'price_demands_less_than_demonstrated',
    peRatio: 51.1,            // kask key_metrics [OBS]
    psRatio: 3.5,             // kask key_metrics [OBS]
    evEbitda: 28.8,           // kask key_metrics [OBS]
  },

  thesis: {
    supported: true,
    conclusion:
      'Evidence supports a thesis. Business franchise is exceptional (GORILLA 78). Management is excellent (ROIC inflection from negative → 17.7%, now at 11.8% during deliberate credit expansion). Valuation demands less growth than demonstrated (21.1% implied vs 42.2% demonstrated), creating a margin of safety.',
    franchise:
      'MercadoLibre turns one dollar of commerce into two through a self-reinforcing flywheel. Each Marketplace transaction generates behavioral data that improves fintech underwriting; each credit issued creates a buyer who spends more on the Marketplace. The Engel curve tailwind is structural: as LatAm incomes rise through the $10k–$20k range, both e-commerce and financial services budget shares claim more of the household wallet.',
    management:
      'Three investment cycles executed with discipline: logistics (2015–19) → fintech (2018–22) → AI/credit (2023–present). Each cycle was ROIC-negative during investment, then inflected positively. Engineering headcount flat at 3x business scale via AI productivity. Brazilian consumer NPLs near all-time lows while credit book grows 75% YoY.',
    valuationNote:
      'At P/E 51x and P/S 3.5x, not statistically cheap in absolute terms. But P/S 3.5x is cheaper than Nubank (5.1x) without the commerce flywheel. DCF at 15% investor target return produces $4,851/share (161% implied upside). Margin of safety is in the growth gap, not the multiple.',
    priceConclusion:
      'At $1,856.98 (2026-10-15), attractive for investors with a 5+ year horizon willing to accept short-term multiple compression. The valuation margin of safety disappears if revenue CAGR decelerates below 20% or Brazilian consumer NPLs spike above 15%.',
  },

  scenarios: {
    horizon: '5Y (FY2030)',
    bull: {
      revenue: '$75–80B',
      ebitMargin: '15–18%',
      probability: 0.30,
      assumption:
        'Ecosystemic users reach 50%+ of base; credit card profitability inflects; AI drives structural margin expansion; CBT adds significant new GMV.',
    },
    base: {
      revenue: '$55–60B',
      ebitMargin: '10–12%',
      probability: 0.50,
      assumption:
        'Revenue CAGR decelerates to 20–25%; margins expand as investment phase matures; credit book stabilizes.',
    },
    bear: {
      revenue: '$30–35B',
      ebitMargin: '5–8%',
      probability: 0.20,
      assumption:
        'TikTok Shop/Amazon fragment the market; Brazil credit cycle deteriorates; EBIT stays compressed; Argentine macro worsens.',
    },
  },

  predictions: [
    {
      event: 'MELI credit card NIMAL reaches >5% portfolio-wide',
      probability: 0.65,
      horizon: '5Y',
      confirms: 'Published in annual earnings as NIMAL metric >5%',
      refutes: 'NPLs above 12% in Brazil consumer for 2+ consecutive quarters',
    },
    {
      event: 'MELI advertising revenue exceeds $5B annually',
      probability: 0.70,
      horizon: '5Y',
      confirms: 'Audited advertising revenue segment >$5B in any annual report',
      refutes: 'Revenue stalls below $3B; Amazon Ads takes significant LatAm share',
    },
    {
      event: 'Revenue CAGR 2025–2030 lands between 20–30%',
      probability: 0.55,
      horizon: '5Y',
      confirms: 'FY2030 revenue between $72B and $108B',
      refutes: 'Revenue below $50B or above $120B',
    },
    {
      event: 'EBIT margin reaches >12% in any single fiscal year',
      probability: 0.50,
      horizon: '5Y',
      confirms: 'Annual EBIT margin >12% in any reported fiscal year',
      refutes: 'Margin stays below 8% through FY2030',
    },
  ],

  falsifiers: [
    'TikTok Shop or Amazon captures >30% of LatAm e-commerce GMV, breaking the MELI first-party data advantage',
    'Brazilian credit cycle deteriorates: consumer NPLs rise above 15% for 2+ quarters, forcing credit book contraction',
    'Nubank builds a commerce flywheel (via acquisition or partnership) that competes with MELI\'s credit underwriting moat',
    'Revenue CAGR decelerates below 15% for 3+ consecutive years, signaling market saturation',
  ],

  sources: [
    'FMP income_statement(MELI, limit=3) — Audited FY2023, FY2024, FY2025',
    'FMP balance_sheet(MELI) — Audited FY2025, FY2024',
    'FMP cash_flow_statement(MELI) — Audited FY2025, FY2024',
    'FMP company_transcript(MELI, year=2026, quarter=2) — Q2 2026 Earnings Call, 2026-08-05',
    'kask dcf_valuation(MELI) — computed 2026-10-15',
    'kask reverse_dcf(MELI) — computed 2026-10-15',
    'kask expectations_gap(MELI) — computed 2026-10-15',
    'kask comparable_analysis(MELI) — peers: SE, SHOP, AMZN, NU, PAGS — 2026-10-15',
    'kask moat_check(MELI) + management_scorecard(MELI) + key_metrics(MELI) — 2026-10-15',
    'Web search: LatAm e-commerce market share, competitive position — NocNocStore, KoalaGains, GabGrowth, 2026-10-15',
  ],
  pipeline: 'company-research-deep (one_shot) — 2026-10-15',
  notInvestmentAdvice: true,
}

// ── Registry ──────────────────────────────────────────────────────────────────
export const COMPANY_REPORTS: Record<string, CompanyReport> = {
  MELI,
  // GoTo (GOTO.JK), HDFC Bank (HDFCBANK.NSE), CIRA — Phase 1b
}

export const REPORT_TICKERS = Object.keys(COMPANY_REPORTS)
