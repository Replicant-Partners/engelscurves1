import { NextResponse } from 'next/server'

// ─── API keys from Railway env vars ──────────────────────────────────────────
const FMP_KEY        = process.env.FMP_API_KEY ?? ''
const EODHD_KEY      = process.env.EODHD_API_KEY ?? ''
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? ''

// ─── FMP helpers ─────────────────────────────────────────────────────────────
async function fmp(path: string) {
  if (!FMP_KEY) return null
  const res = await fetch(`https://financialmodelingprep.com/api/v3${path}?apikey=${FMP_KEY}`)
  if (!res.ok) return null
  return res.json()
}

async function fmpSearch(query: string) {
  if (!FMP_KEY) return null
  const res = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=5&apikey=${FMP_KEY}`
  )
  if (!res.ok) return null
  return res.json()
}

// ─── EODHD helper ─────────────────────────────────────────────────────────────
async function eodhd(ticker: string) {
  if (!EODHD_KEY) return null
  const res = await fetch(
    `https://eodhd.com/api/real-time/${ticker}?api_token=${EODHD_KEY}&fmt=json`,
    { next: { revalidate: 300 } }
  )
  if (!res.ok) return null
  return res.json()
}

// ─── OpenRouter helper ────────────────────────────────────────────────────────
async function openRouterAnalysis(systemPrompt: string, userMessage: string): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not configured')
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://engelscurves.up.railway.app',
      'X-Title': 'Engel Curves Research',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-6',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter error: ${res.status} ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ─── System prompt (company-research-deep condensed) ─────────────────────────
const SYSTEM_PROMPT = `You are a professional equity research analyst following the company-research-deep pipeline. You produce sourced analytical reports on companies through nine perspectives. You are rigorous about distinguishing observed facts (OBS) from model inferences (INF) and analyst judgment (JDG). You never fabricate data.

For any company, produce a structured JSON report with these sections:

1. Self-view: How the company describes itself (1-2 sentences from the data provided)
2. Business franchise: What it does to make money, why profitable
3. Engel curve connection: Which economies, which spending categories, income elasticity, mechanism
4. Financial profile: Key signposts from the financial data (revenue growth, margins, ROIC, asset quality for banks)
5. Invisible layer: What's not on the page, not priced
6. Falstaffian: What does the consensus get wrong?
7. GORILLA: Score 4 dimensions (Obvious Problem 25%, Invisible Gorilla 30%, Combinatorial Solution 25%, Choke Point 20%) each 0-100, compute weighted score, verdict (GORILLA≥75, SMALL_ANIMAL 50-74, PEDESTRIAN<50)
8. Scenarios: Bull/base/bear at 5Y with probabilities
9. Thesis: 3 pillars (Business Franchise, Management, Valuation) — supported/not supported/insufficient
10. Falsifiable predictions: 3-4 specific events with probability (0.0-1.0, never 0.5)

IMPORTANT RULES:
- Label every claim: [OBS] = from data provided, [INF] = your inference, [JDG] = judgment
- For financial sector (banks): use ROE, P/B, ROA — not DCF. Say "not applicable" for FCF-based metrics
- For non-financial: GORILLA on the business model, not on the bank
- Be direct. State a price conclusion if warranted
- Return valid JSON only — no markdown, no explanation outside the JSON

Return this exact JSON structure:
{
  "ticker": "...",
  "name": "...",
  "asOf": "2026-10-15",
  "pipeline": "company-research-deep (condensed via Phase 2 API)",
  "selfView": "...",
  "businessFranchise": "...",
  "engelCurve": {
    "economies": ["..."],
    "incomeRange": "...",
    "categories": [{"name": "...", "elasticity": 0.0}],
    "mechanism": "..."
  },
  "financialProfile": {
    "revenueGrowth": "...",
    "margins": "...",
    "returns": "...",
    "assetQuality": "...",
    "keySignpost": "..."
  },
  "invisibleLayer": "...",
  "falstaffian": "...",
  "gorilla": {
    "obviousProblem": 0,
    "invisibleGorilla": 0,
    "combinatorialSolution": 0,
    "chokePoint": 0,
    "score": 0.0,
    "verdict": "GORILLA|SMALL_ANIMAL|PEDESTRIAN",
    "summary": "...",
    "marketRealityGate": "..."
  },
  "scenarios": {
    "bull": {"description": "...", "probability": 0.0, "keyMetric": "..."},
    "base": {"description": "...", "probability": 0.0, "keyMetric": "..."},
    "bear": {"description": "...", "probability": 0.0, "keyMetric": "..."}
  },
  "thesis": {
    "supported": true,
    "franchise": "...",
    "management": "...",
    "valuation": "...",
    "priceConclusion": "..."
  },
  "predictions": [
    {"event": "...", "probability": 0.0, "horizon": "...", "confirms": "...", "refutes": "..."}
  ],
  "falsifiers": ["..."],
  "dataGaps": ["..."],
  "notInvestmentAdvice": true
}`

// ─── Build user message from collected data ───────────────────────────────────
function buildUserMessage(
  ticker: string,
  profile: Record<string, unknown> | null,
  income: unknown[] | null,
  keyMetrics: unknown[] | null,
  quote: Record<string, unknown> | null,
  searchResults: string
): string {
  return `Analyze this company for the Engel Curves research platform. Focus on its connection to emerging market income growth and the Engel curve (as household incomes rise, which spending categories rise faster than income?).

COMPANY: ${ticker}
${profile ? `
Profile: ${JSON.stringify({
  name: profile.companyName,
  sector: profile.sector,
  industry: profile.industry,
  country: profile.country,
  description: (profile.description as string)?.slice(0, 500),
  ceo: profile.ceo,
  employees: profile.fullTimeEmployees,
  marketCap: profile.marketCap,
  website: profile.website,
})}` : ''}

${quote ? `Live quote: price=${quote.close ?? quote.price}, change=${quote.change_p ?? quote.changePercentage}%, marketCap=${quote.marketCapitalization}` : ''}

${income ? `Income statements (3 years, most recent first):
${JSON.stringify((income as Record<string, unknown>[]).slice(0, 3).map((y) => ({
  year: y.fiscalYear ?? y.calendarYear,
  revenue: y.revenue,
  netIncome: y.netIncome,
  grossProfit: y.grossProfit,
  ebitda: y.ebitda,
  eps: y.eps,
})))}` : ''}

${keyMetrics ? `Key metrics (most recent):
${JSON.stringify((keyMetrics as Record<string, unknown>[])[0] ? {
  pe: (keyMetrics as Record<string, unknown>[])[0].priceToEarningsRatio,
  pb: (keyMetrics as Record<string, unknown>[])[0].priceToBookRatio,
  ps: (keyMetrics as Record<string, unknown>[])[0].priceToSalesRatio,
  evEbitda: (keyMetrics as Record<string, unknown>[])[0].evToEBITDA,
  roe: (keyMetrics as Record<string, unknown>[])[0].returnOnEquity,
  roic: (keyMetrics as Record<string, unknown>[])[0].returnOnInvestedCapital,
  revenueGrowth: (keyMetrics as Record<string, unknown>[])[0].revenueGrowth,
  grossMargin: (keyMetrics as Record<string, unknown>[])[0].grossProfitMargin,
} : {})}` : ''}

Web search context:
${searchResults}

Today's date: 2026-10-15
Produce the JSON report now.`
}

// ─── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const query: string = body.company ?? body.ticker ?? ''

    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'company name or ticker required' }, { status: 400 })
    }

    if (!FMP_KEY) {
      return NextResponse.json({ error: 'FMP_API_KEY not configured on Railway — add it in Variables' }, { status: 503 })
    }
    if (!OPENROUTER_KEY) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured on Railway' }, { status: 503 })
    }

    // ── Step 1: Resolve ticker ──────────────────────────────────────────────
    let ticker = query.toUpperCase().replace(/[^A-Z0-9.-]/g, '')
    const searchRes = await fmpSearch(query)
    if (searchRes && Array.isArray(searchRes) && searchRes.length > 0) {
      ticker = searchRes[0].symbol ?? ticker
    }

    // ── Step 2: Collect financial data in parallel ──────────────────────────
    const [profile, income, keyMetrics, quote] = await Promise.all([
      fmp(`/profile/${ticker}`).then(d => Array.isArray(d) ? d[0] : d),
      fmp(`/income-statement/${ticker}?limit=3`),
      fmp(`/key-metrics/${ticker}?limit=2`),
      EODHD_KEY ? eodhd(`${ticker}.US`) : Promise.resolve(null),
    ])

    // ── Step 3: Web search for context ─────────────────────────────────────
    let searchResults = ''
    try {
      if (process.env.TAVILY_API_KEY) {
        const tavily = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: `${ticker} ${(profile as Record<string, unknown> | null)?.companyName ?? ''} earnings growth 2025 2026`,
            max_results: 5,
            search_depth: 'basic',
          }),
        })
        const tavilyData = await tavily.json()
        searchResults = (tavilyData.results ?? [])
          .map((r: { title: string; content: string }) => `${r.title}: ${r.content?.slice(0, 200)}`)
          .join('\n')
      }
    } catch {
      searchResults = 'Web search unavailable'
    }

    // ── Step 4: Run LLM analysis ────────────────────────────────────────────
    const userMessage = buildUserMessage(
      ticker,
      profile as Record<string, unknown> | null,
      income as unknown[] | null,
      keyMetrics as unknown[] | null,
      quote as Record<string, unknown> | null,
      searchResults,
    )

    const rawAnalysis = await openRouterAnalysis(SYSTEM_PROMPT, userMessage)

    // Parse JSON from LLM response
    let analysis: Record<string, unknown>
    try {
      // Extract JSON if wrapped in markdown
      const jsonMatch = rawAnalysis.match(/\{[\s\S]*\}/)
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : rawAnalysis)
    } catch {
      analysis = { raw: rawAnalysis, parseError: 'LLM did not return valid JSON' }
    }

    // ── Step 5: Compute GORILLA score deterministically ────────────────────
    if (analysis.gorilla && typeof analysis.gorilla === 'object') {
      const g = analysis.gorilla as Record<string, unknown>
      const op = Number(g.obviousProblem ?? 50)
      const ig = Number(g.invisibleGorilla ?? 50)
      const cs = Number(g.combinatorialSolution ?? 50)
      const cp = Number(g.chokePoint ?? 50)
      const score = 0.25 * op + 0.30 * ig + 0.25 * cs + 0.20 * cp
      g.score = Math.round(score * 10) / 10
      g.verdict = score >= 75 ? 'GORILLA' : score >= 50 ? 'SMALL_ANIMAL' : 'PEDESTRIAN'
    }

    return NextResponse.json({
      ok: true,
      ticker,
      companyName: (profile as Record<string, unknown> | null)?.companyName ?? ticker,
      analysis,
      meta: {
        dataCollected: {
          profile: !!profile,
          income: !!(income as unknown[] | null)?.length,
          keyMetrics: !!(keyMetrics as unknown[] | null),
          liveQuote: !!quote,
          webSearch: !!searchResults && searchResults !== 'Web search unavailable',
        },
        model: 'anthropic/claude-sonnet-4-6 via OpenRouter',
        pipeline: 'company-research-deep (condensed — Phase 2 API)',
        asOf: '2026-10-15',
        notInvestmentAdvice: true,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
