// ─────────────────────────────────────────────────────────────
//  Research data — Engel Curves & Industry Growth
//  Source labels: [OBS] = observed / primary source
//                 [INF] = model inference
//                 [JDG] = analyst judgment
// ─────────────────────────────────────────────────────────────

// World Bank NY.GDP.PCAP.PP.KD (constant 2021 PPP $)
// Retrieved 15 Oct 2026 [OBS]
export const incomeTimeSeries = [
  { year: 2000, China: 4066,  India: 3010,  Brazil: 14005, Germany: 49956, USA: 55046 },
  { year: 2005, China: 6298,  India: 3770,  Brazil: 15221, Germany: 51265, USA: 59612 },
  { year: 2010, China: 10476, India: 4914,  Brazil: 18062, Germany: 54826, USA: 59797 },
  { year: 2015, China: 14857, India: 6302,  Brazil: 18357, Germany: 59669, USA: 64368 },
  { year: 2020, China: 19215, India: 7187,  Brazil: 17328, Germany: 60300, USA: 67407 },
  { year: 2023, China: 22687, India: 8871,  Brazil: 19080, Germany: 63140, USA: 74352 },
  { year: 2024, China: 23841, India: 9416,  Brazil: 19652, Germany: 62655, USA: 75698 },
]

// Engel reference curve: food share % at given PPP income level
// Source: PERI WP247 "Engel's Law Around the World 150 Years Later" (207 countries) [OBS]
export const engelReferenceCurve = [
  { income: 1500,  foodShare: 50 },
  { income: 3000,  foodShare: 43 },
  { income: 5000,  foodShare: 38 },
  { income: 8000,  foodShare: 33 },
  { income: 12000, foodShare: 29 },
  { income: 18000, foodShare: 25 },
  { income: 25000, foodShare: 21 },
  { income: 35000, foodShare: 17 },
  { income: 50000, foodShare: 14 },
  { income: 75000, foodShare: 12 },
]

// Economy food-share data points (for scatter overlay)
// Note: "food share" definitions vary by economy — labeled accordingly
export const economyFoodShares = [
  {
    name: 'India',
    income: 8871,   // 2023 PPP [OBS]
    foodShare: 47,  // Rural HCES 2023-24: non-food = 53%, so food ≈ 47% [OBS]
    note: 'HCES 2023-24 rural MPCE; food incl. beverages & processed food',
    source: 'India MoSPI HCES 2023-24',
    color: '#f59e0b',
    flag: 'OBS',
  },
  {
    name: 'China',
    income: 22687,  // 2023 PPP [OBS]
    foodShare: 29.8, // NBS 2023: food, tobacco & liquor [OBS]
    note: 'NBS 2023: food, tobacco and liquor as % of per capita consumption',
    source: 'China NBS Press Release, 18 Jan 2024',
    color: '#ef4444',
    flag: 'OBS',
  },
  {
    name: 'Brazil',
    income: 19080,  // 2023 PPP [OBS]
    foodShare: 27,  // [INF] estimated from PERI curve at this income level; IBGE HICES not retrieved
    note: 'Estimated from Engel reference curve — IBGE POF microdata not retrieved [GAP]',
    source: 'Inference from PERI WP247 reference curve',
    color: '#8b5cf6',
    flag: 'INF',
  },
  {
    name: 'Germany',
    income: 63140,  // 2023 PPP [OBS]
    foodShare: 13.9, // [OBS] Eurostat HBS 2020 EU average food/non-alcoholic beverages
    note: 'Eurostat HBS 2020 EU average; Germany-specific Destatis EVS data not retrieved',
    source: 'Eurostat HBS 2020 (EU aggregate)',
    color: '#10b981',
    flag: 'OBS',
  },
  {
    name: 'USA',
    income: 74352,  // 2023 PPP [OBS]
    foodShare: 12.5, // [INF] BLS CEX 2024 available but category shares not extracted in this pass
    note: 'Approx. from BLS CEX 2024 structure; exact figure requires BLS table extraction [GAP]',
    source: 'BLS Consumer Expenditure Survey 2024 (approximate)',
    color: '#3b82f6',
    flag: 'INF',
  },
]

// China NBS 2023: household spending by category [OBS]
// Source: NBS "Households' Income and Consumption Expenditure in 2023", 18 Jan 2024
export const chinaSpending2023 = [
  {
    category: 'Food & Tobacco',
    share: 29.8,
    yoyGrowth: 6.7,
    elasticityRural: 0.64,
    elasticityUrban: 0.86,
    type: 'necessity',
  },
  {
    category: 'Healthcare',
    share: 9.2,
    yoyGrowth: 16.0,
    elasticityRural: 1.19,
    elasticityUrban: 1.12,
    type: 'luxury',
  },
  {
    category: 'Education & Culture',
    share: 10.8,
    yoyGrowth: 16.4,
    elasticityRural: 1.35,
    elasticityUrban: 1.18,
    type: 'luxury',
  },
  {
    category: 'Transport & Comms',
    share: 13.6,
    yoyGrowth: 14.3,
    elasticityRural: 1.71,
    elasticityUrban: 1.59,
    type: 'luxury',
  },
  {
    category: 'Housing',
    share: 22.7,
    yoyGrowth: 3.6,
    elasticityRural: 1.20,
    elasticityUrban: 1.06,
    type: 'luxury',
  },
  {
    category: 'Clothing',
    share: 5.5,
    yoyGrowth: 8.4,
    elasticityRural: 0.81,
    elasticityUrban: 0.47,
    type: 'necessity',
  },
  {
    category: 'Household Articles',
    share: 5.7,
    yoyGrowth: 6.6,
    elasticityRural: 1.09,
    elasticityUrban: 0.81,
    type: 'necessity',
  },
  {
    category: 'Misc. & Services',
    share: 2.6,
    yoyGrowth: 17.1,
    elasticityRural: null,
    elasticityUrban: null,
    type: 'luxury',
  },
]

// Ranked industry–economy chains [INF/JDG]
export const industryChains = [
  {
    rank: 1,
    economy: 'India',
    economyColor: '#f59e0b',
    industry: 'Consumer Discretionary — Branded Premium Goods',
    tailwind: 'TAILWIND',
    tailwindColor: '#10b981',
    mechanism:
      'India PPP income +213% since 2000; HCES 2023-24 confirms non-food share rose 47%→53% (rural); Gini declining — shift is broad-based, not top-only.',
    category: 'Jewellery, Watches, Eyewear',
    elasticityNote: 'Income elasticity >1 [INF — consistent with luxury classification; no India-specific estimate retrieved]',
    companies: [
      {
        name: 'Titan Company',
        ticker: 'TITAN.NS',
        data: 'Revenue FY23→FY26 CAGR: 29.2% (Rs.40,575cr→Rs.87,584cr). Q1 FY27 +29.3% YoY. Forward P/E: 59x.',
        evidenceFlag: 'OBS',
        source: 'ICICI Direct Q4FY26; Yahoo Finance Oct 2026',
      },
    ],
    falsifier:
      'Gold price −20%: Titan revenue growth collapses to near-zero regardless of volume, since gold is >80% of jewellery cost. Testable via gold spot price.',
    dataFlag: 'OBS+INF',
  },
  {
    rank: 2,
    economy: 'China',
    economyColor: '#ef4444',
    industry: 'Healthcare / Digital Health',
    tailwind: 'TAILWIND',
    tailwindColor: '#10b981',
    mechanism:
      'Healthcare budget share: ~6% (2012) → 9.2% (2023). Spend +16% YoY vs. income +6.3% — implies elasticity ≈1.1-1.2. Aging population reinforces income-elastic demand.',
    category: 'Healthcare, Medical Services, Online Pharmacy',
    elasticityNote: 'ε_Y = 1.19 rural / 1.12 urban [OBS — AOF/CICC study based on NBS data]',
    companies: [
      {
        name: 'JD Health (6618.HK)',
        ticker: '6618.HK',
        data: 'Equity data not retrieved in this pass [GAP].',
        evidenceFlag: 'GAP',
        source: 'Gap — HK-listed equity data not pulled',
      },
      {
        name: 'Alibaba Health (241.HK)',
        ticker: '241.HK',
        data: 'Equity data not retrieved in this pass [GAP].',
        evidenceFlag: 'GAP',
        source: 'Gap — HK-listed equity data not pulled',
      },
    ],
    falsifier:
      'Chinese government regulatory crackdown on private healthcare (2021 EdTech precedent). Observable early warning: People\'s Daily rhetoric on private hospital pricing inequality.',
    dataFlag: 'OBS+GAP',
  },
  {
    rank: 3,
    economy: 'USA',
    economyColor: '#3b82f6',
    industry: 'Healthcare — Drug & Managed Care',
    tailwind: 'STRUCTURAL',
    tailwindColor: '#6366f1',
    mechanism:
      'US healthcare = 18% of GDP (2024). Spending grew +7.2% in 2024. McKinsey: drug expenditure ~8%/yr CAGR to 2029 → $990bn. Note: rising share is partly price inflation, not pure income elasticity.',
    category: 'Pharmaceuticals, Managed Care Insurance',
    elasticityNote: 'Income elasticity partially confounded by price inflation and aging; not pure Engel-curve effect [INF]',
    companies: [
      {
        name: 'UnitedHealth Group',
        ticker: 'UNH',
        data: 'Equity data not retrieved in this pass [GAP].',
        evidenceFlag: 'GAP',
        source: 'Gap',
      },
    ],
    falsifier:
      'ACA rollback or expansion of IRA drug-price negotiation to additional molecules compresses managed-care TAM. Legislative risk is directly observable via Congressional Budget Office scoring of proposed legislation.',
    dataFlag: 'OBS+GAP',
  },
  {
    rank: 4,
    economy: 'Germany',
    economyColor: '#10b981',
    industry: 'Hospital & Dialysis Services',
    tailwind: 'AGING-DRIVEN',
    tailwindColor: '#f59e0b',
    mechanism:
      'Germany GKV (statutory health insurance) spending: +7.8% projected 2025. Driver is demographic aging, not income elasticity per se — Germany income level ($62k PPP) too high for pure Engel effect. Structural volume growth from population age shift.',
    category: 'Hospital Services, Renal Care',
    elasticityNote: 'Income elasticity secondary at this income level; aging is the primary structural driver [INF]',
    companies: [
      {
        name: 'Fresenius SE',
        ticker: 'FRE.DE',
        data: 'FY2024 revenue €21.53bn. Q1 2025 organic +7%. Guidance FY2025: 4-6% organic. [OBS]',
        evidenceFlag: 'OBS',
        source: 'Yahoo Finance; Fresenius Q1 2025 earnings',
      },
      {
        name: 'Fresenius Medical Care',
        ticker: 'FME.DE',
        data: 'Q2 2026 revenue €4.86bn (beat €4.79bn est.). FY2026 margin guidance: 10.5-12%. Patient count: 346k (2020) → 292k (2025) — declining. [OBS]',
        evidenceFlag: 'OBS',
        source: 'Reuters Aug 2026; FME Q2 2026 presentation',
      },
    ],
    falsifier:
      'Krankenhausreformgesetz (hospital reform) price caps reduce Fresenius Helios organic revenue growth below 2%. Observable via annual GKV reimbursement tables (Bundesamt für Soziale Sicherung).',
    dataFlag: 'OBS',
  },
]

// Scenario tree nodes for China income trajectory [JDG]
export const scenarioBranches = [
  {
    id: 'recovery',
    label: 'Partial Recovery',
    probability: 0.35,
    probabilityLabel: 'P = 0.35 [JDG]',
    color: '#10b981',
    description: 'Property stabilises; real income CAGR 5-6% (2024-2028)',
    implication: 'Engel shift resumes: healthcare/education share rises. LVMH Asia organic +5-8%.',
    earlyWarning: 'NBS disposable income real growth ≥5% for 2 consecutive quarters; Tier-1 property transactions recovering.',
  },
  {
    id: 'stagnation',
    label: 'Prolonged Deleveraging',
    probability: 0.45,
    probabilityLabel: 'P = 0.45 [JDG]',
    color: '#f59e0b',
    description: 'Property crisis persists; real income CAGR 3-4%; household deposits keep rising',
    implication: 'Elasticity >1 categories grow at income rate only (~3-4%). LVMH Asia flat to slightly positive.',
    earlyWarning: 'Household deposit growth >8% YoY continues; property transactions flat in Tier 1.',
  },
  {
    id: 'japan',
    label: 'Japan-Style Stagnation',
    probability: 0.20,
    probabilityLabel: 'P = 0.20 [JDG]',
    color: '#ef4444',
    description: 'Income growth <2%; consumer confidence structural damage; lost decade begins',
    implication: 'Luxury demand −10-20%. Healthcare grows only via aging, not income. LVMH China revenue deeply negative.',
    earlyWarning: 'Urban unemployment >7%; household debt deleveraging accelerates; Gini rises.',
  },
]

// Data gaps log
export const dataGaps = [
  {
    gap: 'John Brooks corpus not installed',
    affects: 'No historical investment reasoning quotation',
    path: 'Build corpus from "Business Adventures" and "The Go-Go Years"',
  },
  {
    gap: 'Observable notebook rate-limited (429)',
    affects: 'Visual Engel curve design not reviewed',
    path: 'Retry web_extract or web_browse in a separate session',
  },
  {
    gap: 'BLS CEX category-by-quintile shares not extracted',
    affects: 'USA Engel curve quantification by income group',
    path: 'Direct BLS table pull from bls.gov/cex/tables.htm',
  },
  {
    gap: 'India HCES microdata (category × quintile)',
    affects: 'India Engel curve at fine-grain',
    path: 'Download HCES 2022-23 microdata from MoSPI website',
  },
  {
    gap: 'Germany Destatis EVS 2018 quintile shares',
    affects: 'Germany Engel curve by income group',
    path: 'Access Destatis EVS tables (2018 latest wave)',
  },
  {
    gap: 'Brazil IBGE POF survey',
    affects: 'Brazil cell — income stagnation case study',
    path: 'IBGE Pesquisa de Orçamentos Familiares data',
  },
  {
    gap: 'HK-listed China health equity data (JD Health, Alibaba Health)',
    affects: 'Chain #2 equity comparison',
    path: 'Run company_profile for 6618.HK and 241.HK',
  },
]
