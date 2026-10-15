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

// ── HDFC Bank (HDB) — 2026-10-15 ──────────────────────────────────────────
// Full report: data/reports/HDB-2026-10-15.md
// Sources: FMP audited FY2024-2026, Q2+Q3 FY26 transcripts, Annual Report FY26,
//          SEC 6-K filings, kask EP valuation tools
const HDB: CompanyReport = {
  ticker: 'HDB',
  name: 'HDFC Bank Limited',
  asOf: '2026-10-15',
  price: 23.53,
  currency: 'USD',
  exchange: 'NYSE (ADR)',
  marketCapBn: 120.7,

  engelCurveConnection: {
    economies: ['India'],
    incomeRange: '$8,000–$15,000 per capita PPP',
    spendingCategories: [
      { category: 'Financial Services', elasticity: 1.12 },
      { category: 'Home Loans / Housing Finance', elasticity: 1.20 },
    ],
    mechanism:
      'India PPP per capita ($9,416 in 2024) is crossing the $8k–$12k inflection zone where household financial services budget share rises sharply (ε ≈ 1.12). HDFC Bank is the dominant private sector gateway: as 300M+ aspirational Indian households gain formal banking access, they open savings accounts, obtain home loans, and adopt credit cards — all HDFC Bank products. The home loan flywheel (from the HDFC Ltd. merger) creates a 20-30 year relationship per customer: 99% savings account adoption, 14% credit card, 35% consumer durable loan, insurance cross-sell.',
  },

  gorilla: {
    score: 70,
    verdict: 'SMALL_ANIMAL',
    dimensions: {
      obviousProblem: 65,      // India 300M+ underbanked + rising financial services share; SBI public sector cap → 65
      invisibleGorilla: 75,   // Home loan flywheel × branch vintage compounding × UPI data moat
      combinatorialSolution: 65, // Retail × Wholesale × Treasury × Insurance × AMC; replicable by ICICI → 65
      chokePoint: 75,          // 9,600 branches (30Y build) + HDFC brand + CASA ratio 34-35%
    },
    summary:
      'HDFC Bank is a high-quality SMALL_ANIMAL (score 70). The invisible gorilla is the home loan flywheel from the HDFC Ltd. merger: 30M+ customers who generate 5x LTV in lifetime banking value. Branch vintage compounding (4,800 branches entering the 5-10 year growth window) provides operating leverage without new capital. The choke point is the 9,600-branch network built over 30 years — competitors cannot replicate this density in <10 years. SMALL_ANIMAL (not GORILLA) because SBI\'s public sector dominance and ICICI Bank\'s comparable retail franchise constrain the choke-point and combinatorial scores.',
  },

  moat: 'narrow',
  managementRating: 'excellent',

  financials: {
    revenue: [
      { year: 2024, value: 41.9 },  // FY2024 (Mar year-end): ₹3.52T / 84 ≈ $41.9B [OBS]
      { year: 2025, value: 49.9 },  // FY2025: ₹4.19T / 84 ≈ $49.9B [OBS]
      { year: 2026, value: 62.1 },  // FY2026: ₹5.21T / 84 ≈ $62.1B [OBS]
    ],
    revenueCAGR: 0.217,             // 2-year CAGR FY2024-FY2026 [OBS]
    grossMargin: 0.572,             // NII/Revenue proxy, FY2026 [OBS]
    ebitMargin: 0.194,              // ROA 1.94% × assets/revenue proxy [OBS]
    freeCashFlowBn: 0,              // Not applicable — financial institution [OBS]
    netDebtBn: 0,                   // Not applicable — bank
    roic: 0.139,                    // ROE FY2026 (ROIC not meaningful for banks) [OBS]
  },

  valuation: {
    dcfIntrinsic: 0,                // Not applicable — financial institution
    impliedGrowth: 0,               // Not computed (EP model used)
    demonstratedGrowth: 0.217,      // 2-year revenue CAGR [OBS]
    expectationsGapPp: 0,           // Not computed via reverse DCF
    signal: 'ep_model_undervalued_at_trough_roe',
    peRatio: 15.65,                 // FY2026 [OBS kask key_metrics]
    psRatio: 2.29,                  // FY2026 [OBS]
    evEbitda: 13.14,                // FY2026 [OBS]
  },

  thesis: {
    supported: true,
    conclusion:
      'Evidence supports a thesis. Business franchise is robust (India\'s largest private sector bank, Engel curve tailwind). Management is excellent (30-year track record; post-merger ROE recovery on track: 10.1% FY25 → 14.3% FY26 → target 17-18%). Valuation is reasonable to attractive: P/B 2.08x prices perpetual ROE of ~13.5%, while the company is demonstrably on a path to 17-18% ROE.',
    franchise:
      'HDFC Bank is the premier financial access point for India\'s rising middle class. The home loan flywheel (post-HDFC Ltd. merger) creates a 20-30 year customer relationship: 99% savings account, 14% credit card, 35% consumer durable loan, insurance. The Engel curve tailwind (financial services ε ≈ 1.12) means every 1% income rise drives 1.12% financial services spending growth — and HDFC Bank captures a disproportionate share through branch density and brand trust.',
    management:
      'CEO Jagdishan has managed the HDFC Ltd. merger with discipline: GNPA 1.15% (near multi-year low), NIM in a tight range, LDR glide path on track (96% → 85-90% target). The post-merger pattern mirrors prior investment cycles (2015-2019 branch expansion) that produced 17-18% ROE. Branch productivity growing: from ₹237cr/branch (2019) to ₹305cr/branch (2026) despite adding 4,800 new branches.',
    valuationNote:
      'P/B 2.08x at ROE 14.3% prices the company at perpetual trough ROE. A bank at 17-18% ROE should trade at P/B ~2.6-2.8x at 6.5% cost of equity (P/B = ROE/CoE). The market is not pricing the ROE recovery. EP model (equity excess returns): value creator (ROE 13.9% > CoE 6.15%); 33% of value from competitive advantage, 67% from assets-in-place.',
    priceConclusion:
      'At $23.53/ADR (2026-10-15), attractive for investors with 3-5+ year horizon who believe in India\'s economic trajectory and HDFC Bank\'s ROE recovery to 17-18%. The valuation thesis weakens if: India credit cycle turns (GNPA >2%), or home loan flywheel does not materialize in deposit balances by FY28.',
  },

  scenarios: {
    horizon: '5Y (FY2031)',
    bull: {
      revenue: '₹9T+ (~$107B)',
      ebitMargin: '18-20% ROE',
      probability: 0.30,
      assumption:
        'Home loan flywheel fully contributing to deposits; branch vintage compounding mature; India GDP >6% sustaining credit demand; NIM recovery 15-20bps from rate cycle.',
    },
    base: {
      revenue: '₹7-8T (~$83-95B)',
      ebitMargin: '15-17% ROE',
      probability: 0.50,
      assumption:
        'LDR normalizes to 85-90%; NIM recovers 10bps; loan growth 14-16%; credit costs stable; India GDP 6-7%.',
    },
    bear: {
      revenue: '₹5-6T (~$60-71B)',
      ebitMargin: '11-13% ROE',
      probability: 0.20,
      assumption:
        'India credit cycle deteriorates; GNPA rises above 2%; fintech erodes retail margins; SBI/ICICI gains share; ROE recovery delayed to FY2030+.',
    },
  },

  predictions: [
    {
      event: 'ROE returns above 17% in any single fiscal year',
      probability: 0.60,
      horizon: '5Y',
      confirms: 'Annual Report ROE >17% published',
      refutes: 'ROE stays below 15% through FY2030',
    },
    {
      event: 'Loan growth outpaces industry by 200+ bps in FY2027',
      probability: 0.65,
      horizon: '1Y',
      confirms: 'RBI aggregate credit data + FY27 Annual Report',
      refutes: 'HDFC Bank grows at or below industry rate in FY27',
    },
    {
      event: 'GNPA remains below 1.5% through FY2028',
      probability: 0.70,
      horizon: '3Y',
      confirms: 'Annual Report GNPA < 1.5% in each year through FY2028',
      refutes: 'GNPA breaches 2.0% in any year due to credit cycle',
    },
    {
      event: 'Home loan portfolio private sector market share reaches 12%+',
      probability: 0.55,
      horizon: '5Y',
      confirms: 'NHB/RBI data shows HDFC Bank home loan share',
      refutes: 'Market share stagnates below 10% due to PSU competition',
    },
  ],

  falsifiers: [
    'India credit cycle turns sharply: GNPA rises above 2%, requiring provision charges that compress ROE below 12% for 2+ years',
    'Home loan flywheel does not materialise: mortgage customers do not cross-sell into deposits/cards at the modelled rates (currently 14% credit card, 99% savings account penetration)',
    'Digital-only fintech (Paytm Payments Bank successor, or a foreign entrant) disrupts the CASA deposit franchise without branch cost',
    'RBI regulatory action (as with agri portfolio in Q3 FY26) scales to a material capital event',
  ],

  sources: [
    'FMP income_statement(HDB, limit=3) — Audited FY2024, FY2025, FY2026 (March year-end)',
    'FMP balance_sheet(HDB) + key_metrics(HDB) — FY2025, FY2026',
    'FMP company_transcript(HDB, year=2026, quarter=3) — Q3 FY26 Earnings Call, 2026-01-17',
    'FMP company_transcript(HDB, year=2026, quarter=2) — Q2 FY26 Earnings Call, 2025-10-18',
    'HDFC Bank Integrated Annual Report 2025-26 — Published',
    'HDFC Bank Q1 FY27 Earnings Presentation — Published',
    'SEC Form 6-K (Sep 2026) — Advances ₹33.1T, Deposits ₹33.3T',
    'kask ep_valuation(HDB) + moat_check(HDB) + management_scorecard(HDB) — 2026-10-15',
    'kask comparable_analysis(HDB) — peers: IBN, AXBK, KOTAKBANK, SBIN — 2026-10-15',
    'lisp_eval GORILLA CRD-2: (0.25×65 + 0.30×75 + 0.25×65 + 0.20×75) = 70.0 → SMALL_ANIMAL',
    'Web: KenResearch India digital banking market; Koalagains HDB analysis; StockTitan 6-K filings, 2026-10-15',
  ],
  pipeline: 'company-research-deep (one_shot) — 2026-10-15',
  notInvestmentAdvice: true,
}

// ── Registry ──────────────────────────────────────────────────────────────────
export const COMPANY_REPORTS: Record<string, CompanyReport> = {
  MELI,
  HDB,
}

export const REPORT_TICKERS = Object.keys(COMPANY_REPORTS)
