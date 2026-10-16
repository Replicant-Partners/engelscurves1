import { NextResponse } from 'next/server'

// ─── API keys ─────────────────────────────────────────────────────────────────
const FMP_KEY        = process.env.FMP_API_KEY ?? ''
const EODHD_KEY      = process.env.EODHD_API_KEY ?? ''
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? ''

// ─── FMP helpers ──────────────────────────────────────────────────────────────
async function fmp<T = unknown>(path: string): Promise<T | null> {
  if (!FMP_KEY) return null
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3${path}?apikey=${FMP_KEY}`)
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

// Try recent quarters in order until we find a transcript
// Mirrors company_transcript quarters_back logic in the MCP skill
async function fetchLatestTranscript(ticker: string): Promise<unknown[] | null> {
  const now = new Date()
  const candidates: Array<{ year: number; quarter: number }> = []
  let y = now.getFullYear()
  let q = Math.ceil((now.getMonth() + 1) / 3)  // current calendar quarter
  for (let i = 0; i < 6; i++) {  // try last 6 quarters
    candidates.push({ year: y, quarter: q })
    q--
    if (q < 1) { q = 4; y-- }
  }
  for (const { year, quarter } of candidates) {
    const result = await fmp<unknown[]>(`/earning-call-transcript/${ticker}?year=${year}&quarter=${quarter}`)
    if (Array.isArray(result) && result.length > 0) return result
  }
  // Fallback: try the general transcript list endpoint
  const list = await fmp<unknown[]>(`/earning-call-transcript/${ticker}`)
  if (Array.isArray(list) && list.length > 0) return [list[0]]
  return null
}

async function fmpSearch(query: string) {
  if (!FMP_KEY) return null
  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=5&apikey=${FMP_KEY}`)
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

// ─── EODHD helper ─────────────────────────────────────────────────────────────
async function eodhd(ticker: string) {
  if (!EODHD_KEY) return null
  try {
    const res = await fetch(`https://eodhd.com/api/real-time/${ticker}?api_token=${EODHD_KEY}&fmt=json`, { next: { revalidate: 300 } })
    return res.ok ? res.json() : null
  } catch { return null }
}

// ─── OpenRouter LLM call ──────────────────────────────────────────────────────
async function llm(system: string, user: string, maxTokens = 3000): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not configured on Railway')
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
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.2,
      max_tokens: maxTokens,
    }),
  })
  if (!res.ok) throw new Error(`LLM error ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function parseJSON(raw: string): Record<string, unknown> {
  try {
    const m = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/)
    return JSON.parse(m ? m[1] ?? m[0] : raw)
  } catch { return { raw } }
}

// ─── Safe JSON stringify (JSON.stringify(undefined) returns undefined, not '') ─
function sj(v: unknown, limit = 99999): string {
  return (JSON.stringify(v ?? {}) ?? '{}').slice(0, limit)
}

// ─── SSE helper ───────────────────────────────────────────────────────────────
type SendFn = (event: Record<string, unknown>) => void

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 1 — collect-evidence (deterministic)
// ═════════════════════════════════════════════════════════════════════════════
async function collectEvidence(query: string, send: SendFn) {
  send({ stage: 'evidence', status: 'running', msg: 'Resolving ticker and collecting financial data…' })

  // Resolve ticker
  const searchRes = await fmpSearch(query) as Array<{symbol: string}> | null
  const ticker = (searchRes?.[0]?.symbol ?? query.toUpperCase().replace(/[^A-Z0-9.-]/g, ''))

  // Collect all data in parallel
  const [profile, income, balanceSheet, cashFlow, keyMetrics, transcript, quote] = await Promise.all([
    fmp<Record<string, unknown>[]>(`/profile/${ticker}`).then(d => Array.isArray(d) ? d[0] : d),
    fmp<unknown[]>(`/income-statement/${ticker}?limit=3`),
    fmp<unknown[]>(`/balance-sheet-statement/${ticker}?limit=2`),
    fmp<unknown[]>(`/cash-flow-statement/${ticker}?limit=2`),
    fmp<unknown[]>(`/key-metrics/${ticker}?limit=3`),
    fetchLatestTranscript(ticker),
    EODHD_KEY ? eodhd(`${ticker}.US`) : Promise.resolve(null),
  ])

  // Web search for competitive context
  let webContext = ''
  if (process.env.TAVILY_API_KEY) {
    try {
      const r = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query: `${ticker} ${(profile as Record<string,unknown>)?.companyName ?? ''} earnings strategy competitive position 2025 2026`, max_results: 6 }),
      })
      const d = await r.json()
      webContext = (d.results ?? []).map((x: {title: string; content: string}) => `${x.title}: ${x.content?.slice(0, 300)}`).join('\n')
    } catch { webContext = '' }
  }

  send({ stage: 'evidence', status: 'done', msg: `Collected: profile, ${(income as unknown[])?.length ?? 0}Y income, ${(transcript as unknown[])?.length ?? 0} transcripts, live quote ${quote ? '✓' : '—'}` })

  return { ticker, profile, income, balanceSheet, cashFlow, keyMetrics, transcript, quote, webContext }
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 2 — LISTEN
// ═════════════════════════════════════════════════════════════════════════════
async function runListen(evidence: Record<string, unknown>, send: SendFn) {
  send({ stage: 'listen', status: 'running', msg: 'Listening to management narrative (transcripts)…' })

  const transcript = evidence.transcript as unknown[]
  if (!transcript?.length) {
    send({ stage: 'listen', status: 'done', msg: 'No transcript available — skipped' })
    return null
  }

  const transcriptText = (transcript as Array<{content: string}>)
    .map(t => t.content?.slice(0, 6000))
    .join('\n\n---\n\n')

  const system = `You are a long-term owner listening to management. Extract what the company says about its strategy, verify it against stated results, and classify each claim.

Rules:
- Never fabricate quotes. Only use exact words from the transcript.
- Label management claims as [CLAIM]. Label verified results as [VERIFIED].
- Ignored short-term guidance (quarterly EPS, near-term guidance) → ignoredShortTerm.
- Strategic goals must have a stated timeline (horizon_years) from the transcript itself. Never invent one.

Return JSON only:
{
  "strategicGoals": [{"goal": "...", "horizon_years": N_or_null, "evidence": "exact quote"}],
  "checkpoints": [{"goal": "...", "event": "...", "delivered": true/false, "evidence": "quote"}],
  "managementConsistency": "one paragraph on whether management delivers on commitments",
  "horizonSummary": "2-3 sentences on the 12-36 month strategic direction",
  "keyQuotes": ["verbatim quote 1", "verbatim quote 2"],
  "ignoredShortTerm": ["quarterly guidance item 1"],
  "dataGaps": ["what transcript could not establish"]
}`

  const raw = await llm(system, `Earnings transcripts:\n${transcriptText.slice(0, 8000)}\n\nCompany: ${evidence.ticker}`)
  const result = parseJSON(raw)
  send({ stage: 'listen', status: 'done', msg: `Strategic goals: ${(result.strategicGoals as unknown[])?.length ?? 0} · Checkpoints: ${(result.checkpoints as unknown[])?.length ?? 0}` })
  return result
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 3 — COMPANY 8-part board
// ═════════════════════════════════════════════════════════════════════════════
async function runCompany(evidence: Record<string, unknown>, listeningView: Record<string, unknown> | null, send: SendFn) {
  send({ stage: 'company', status: 'running', msg: 'Building 8-part company board…' })

  const profile = evidence.profile as Record<string, unknown>
  const income  = evidence.income  as Record<string, unknown>[]
  const km      = evidence.keyMetrics as Record<string, unknown>[]

  const financialDigest = {
    revenues: income?.map(y => ({ fy: y.fiscalYear ?? y.calendarYear, rev: y.revenue, ni: y.netIncome, gp: y.grossProfit, ebitda: y.ebitda, eps: y.eps })),
    metrics: km?.[0] ? { pe: km[0].priceToEarningsRatio, pb: km[0].priceToBookRatio, roe: km[0].returnOnEquity, roic: km[0].returnOnInvestedCapital, revenueGrowth: km[0].revenueGrowth, grossMargin: km[0].grossProfitMargin } : {},
    quote: evidence.quote,
  }

  const system = `You are a fundamental analyst producing an 8-part company board for investment research. Use the provided financial data and transcript evidence only. Label every claim: [OBS] = from data, [INF] = your inference, [JDG] = judgment.

For financial-sector companies (banks, insurance): use ROE, ROA, P/B, NIM, NPL — not ROIC or FCF-based metrics.

Return JSON:
{
  "selfView": "How the company describes itself (use transcript quotes where available, label [OBS])",
  "businessFranchise": "What it does to make money, moat, competitive position [label each claim]",
  "managementSkill": "CEO long-term capital allocation track record. CFO working capital management. Use specific numbers from the data. [OBS/INF]",
  "financialProfile": "Key signposts: gross margin stability, DPO-DSO spread, ROIC trend, revenue growth acceleration/deceleration. Use the actual numbers provided. [OBS]",
  "invisibleLayer": "What is NOT on the page and NOT in the price. The asymmetric insight. [INF/JDG]",
  "falstaffianInversion": "What does the consensus get wrong? Pierce the market narrative. [JDG]",
  "valueGorillaElevatorPitch": "The economic opportunity, what they are doing, why likely to succeed while market prices it as if it will not [INF/JDG]",
  "investmentThesisStatement": "Does evidence support a thesis? State plainly. If insufficient evidence, say so. [JDG]"
}`

  const user = `Company: ${evidence.ticker} — ${profile?.companyName} (${profile?.sector} / ${profile?.country})
Description: ${(profile?.description as string)?.slice(0, 600)}

Financial data: ${JSON.stringify(financialDigest, null, 1).slice(0, 3000)}

Listening view: ${listeningView ? JSON.stringify({ strategicGoals: listeningView.strategicGoals, checkpoints: listeningView.checkpoints, horizonSummary: listeningView.horizonSummary }, null, 1).slice(0, 1500) : 'Not available'}

Web context: ${(evidence.webContext as string)?.slice(0, 1500) ?? 'None'}`

  const raw = await llm(system, user, 3500)
  const result = parseJSON(raw)
  send({ stage: 'company', status: 'done', msg: `8-part board complete — franchise + invisible layer identified` })
  return result
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 4 — FALSTAFFIAN rotation
// ═════════════════════════════════════════════════════════════════════════════
async function runFalstaffian(companyBoard: Record<string, unknown>, send: SendFn) {
  send({ stage: 'falstaffian', status: 'running', msg: 'Rotating competitive frame (Falstaffian)…' })

  const system = `You apply Falstaffian semantic rotation to expose framing errors in analyst narratives.
Five rotation shapes:
1. Predicate hollow — the action verb is empty rhetoric
2. Subject expansion — the company is smaller/narrower than claimed
3. Object inversion — the claimed strength IS the weakness
4. Direction reversal — the trend runs opposite to consensus
5. Value redefinition — what looks like value is actually cost

Apply at least 2 shapes. For each: state the original frame, the rotation, and the implication.

Return JSON:
{
  "shapesApplied": ["predicate_hollow", "object_inversion"],
  "framingErrors": ["error 1 description", "error 2"],
  "rotatedCompetitivePosition": "How the company ACTUALLY competes after rotation",
  "rotatedSelfView": "The honest version of what the company does",
  "falstaffianInsight": "The one thing the consensus has backwards",
  "implicationForGorilla": "How this changes the GORILLA scoring"
}`

  const user = `Company board to rotate:
${JSON.stringify({ businessFranchise: companyBoard.businessFranchise, valueGorillaElevatorPitch: companyBoard.valueGorillaElevatorPitch, falstaffianInversion: companyBoard.falstaffianInversion }, null, 1).slice(0, 2000)}`

  const raw = await llm(system, user, 2000)
  const result = parseJSON(raw)
  send({ stage: 'falstaffian', status: 'done', msg: `Shapes: ${(result.shapesApplied as string[])?.join(', ')}` })
  return result
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 5 — GORILLA 4-dimension scoring
// ═════════════════════════════════════════════════════════════════════════════
async function runGorilla(companyBoard: Record<string, unknown>, rotated: Record<string, unknown>, evidence: Record<string, unknown>, send: SendFn) {
  send({ stage: 'gorilla', status: 'running', msg: 'Running GORILLA 4-dimension framework…' })

  const system = `You apply the GORILLA framework (Moore, Johnson & Kippola, The Gorilla Game, 1998).

Score 4 dimensions 0-100:
1. OBVIOUS PROBLEM (weight 25%): Is the problem large, real, urgent? Apply MARKET-REALITY GATE: search for incumbents already selling this as a product line. If incumbents exist → cap at 60.
2. INVISIBLE GORILLA (weight 30%): What advantage does the MARKET OVERLOOK? Must be non-obvious and non-priced.
3. COMBINATORIAL SOLUTION (weight 25%): Do the company's capabilities combine in ways that reinforce each other and are hard to replicate separately?
4. CHOKE POINT (weight 20%): What structural barrier locks competitors out?

For any dimension scored above 70: write one counter-argument paragraph. If the counter is more convincing → reduce the score.

Return JSON ONLY (no prose):
{
  "obviousProblem": { "score": N, "rationale": "...", "marketRealityGate": "incumbents found: X / none found", "counterArgument": "..." },
  "invisibleGorilla": { "score": N, "rationale": "...", "whatMarketMisses": "...", "counterArgument": "..." },
  "combinatorialSolution": { "score": N, "rationale": "...", "components": ["A", "B", "C"], "counterArgument": "..." },
  "chokePoint": { "score": N, "rationale": "...", "lockoutMechanism": "...", "counterArgument": "..." }
}`

  const user = `Analyze for GORILLA scoring:

Company: ${evidence.ticker} — ${(evidence.profile as Record<string,unknown>)?.companyName}
Sector: ${(evidence.profile as Record<string,unknown>)?.sector} / ${(evidence.profile as Record<string,unknown>)?.industry}

Rotated board:
${JSON.stringify({ rotatedCompetitivePosition: rotated.rotatedCompetitivePosition, falstaffianInsight: rotated.falstaffianInsight }, null, 1).slice(0, 1000)}

Company board:
${JSON.stringify({ businessFranchise: companyBoard.businessFranchise, invisibleLayer: companyBoard.invisibleLayer, valueGorillaElevatorPitch: companyBoard.valueGorillaElevatorPitch }, null, 1).slice(0, 1500)}

Key metrics: ${sj((evidence.keyMetrics as unknown[])?.[0], 800)}`

  const raw = await llm(system, user, 2500)
  const dims = parseJSON(raw)

  // CRD-2: compute score deterministically
  const op = Number((dims.obviousProblem as Record<string,unknown>)?.score ?? 50)
  const ig = Number((dims.invisibleGorilla as Record<string,unknown>)?.score ?? 50)
  const cs = Number((dims.combinatorialSolution as Record<string,unknown>)?.score ?? 50)
  const cp = Number((dims.chokePoint as Record<string,unknown>)?.score ?? 50)
  const score = Math.round((0.25 * op + 0.30 * ig + 0.25 * cs + 0.20 * cp) * 10) / 10
  const verdict = score >= 75 ? 'GORILLA' : score >= 50 ? 'SMALL_ANIMAL' : 'PEDESTRIAN'

  const result: Record<string, unknown> = { ...dims, score, verdict }
  send({ stage: 'gorilla', status: 'done', msg: `Score: ${score}/100 → ${verdict} (OP:${op} IG:${ig} CS:${cs} CP:${cp})` })
  return result
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 6 — IMAGINE 5/10Y scenarios
// ═════════════════════════════════════════════════════════════════════════════
async function runImagine(companyBoard: Record<string, unknown>, gorilla: Record<string, unknown>, evidence: Record<string, unknown>, send: SendFn) {
  send({ stage: 'imagine', status: 'running', msg: 'Projecting 5/10Y scenarios (IMAGINE)…' })

  const system = `You project the business at 5 and 10 years using the Merchant Adventures IMAGINE framework.

Rules:
- Scenarios ANCHORED on economic trajectory (falling cost, rising income, adjacent possible)
- Scenarios CHALLENGED by Falstaffian rotations
- Digital transformation stage: MODEL (digitizing physical) / SHADOW (digital layer) / TWIN (digital replica) / SOURCE (digital native)
- Growth driver: innovation / demographic / both / neither
- Falsifiable predictions: specific observable events, NOT generic. Probability must NOT be 0.5 — it must be a considered estimate.
- Not on page: adjacent possible nodes the company hasn't captured yet
- Not in price: what the current valuation doesn't reflect

Return JSON:
{
  "digitalStage": "MODEL|SHADOW|TWIN|SOURCE",
  "growthDriver": "innovation|demographic|both|neither",
  "scenarios": {
    "bull": { "description": "...", "probability": 0.N, "revenue5Y": "...", "margin5Y": "...", "assumption": "..." },
    "base": { "description": "...", "probability": 0.N, "revenue5Y": "...", "margin5Y": "...", "assumption": "..." },
    "bear": { "description": "...", "probability": 0.N, "revenue5Y": "...", "margin5Y": "...", "assumption": "..." }
  },
  "falsifiablePredictions": [
    { "event": "specific observable event", "probability": 0.N, "horizon": "3Y|5Y|10Y", "confirms": "what observation confirms it", "refutes": "what observation refutes it", "rationale": "why this probability" }
  ],
  "notOnPage": "What isn't in the financial statements yet that matters",
  "notInPrice": "What the current valuation doesn't discount"
}`

  const user = `Company: ${evidence.ticker} — ${(evidence.profile as Record<string,unknown>)?.companyName}
GORILLA verdict: ${gorilla.verdict} (score ${gorilla.score})

Business franchise: ${(companyBoard.businessFranchise as string)?.slice(0, 500)}
Invisible layer: ${(companyBoard.invisibleLayer as string)?.slice(0, 300)}

Revenue history: ${JSON.stringify((evidence.income as Record<string,unknown>[])?.map(y => ({ fy: y.fiscalYear ?? y.calendarYear, rev: y.revenue })))}

Note: Bull+Base+Bear probabilities MUST sum to 1.0. All prediction probabilities MUST differ from 0.5.`

  const raw = await llm(system, user, 2500)
  const result = parseJSON(raw)
  send({ stage: 'imagine', status: 'done', msg: `${(result.falsifiablePredictions as unknown[])?.length ?? 0} predictions · Digital stage: ${result.digitalStage}` })
  return result
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 7 — THESIS 3 pillars
// ═════════════════════════════════════════════════════════════════════════════
async function runThesis(companyBoard: Record<string, unknown>, gorilla: Record<string, unknown>, imagine: Record<string, unknown>, evidence: Record<string, unknown>, send: SendFn) {
  send({ stage: 'thesis', status: 'running', msg: 'Synthesizing 3-pillar investment thesis…' })

  const profile = evidence.profile as Record<string, unknown>
  const km      = (evidence.keyMetrics as Record<string, unknown>[])?.[0]
  const quote   = evidence.quote as Record<string, unknown>

  const system = `You synthesize the Merchant Adventures 3-pillar investment thesis (Business Franchise, Management, Valuation).

Rules:
- Apply the Exist test: delete each pillar — does the thesis collapse? If not, the pillar is decorative, fold it in or cut it.
- State an explicit price conclusion at the current price: attractive / unattractive / indeterminate.
- For financial sector: use ROE vs. cost of equity, P/B. For others: use FCF yield, EV/EBITDA, DCF implied growth.
- State whether evidence SUPPORTS / CONTRADICTS / INSUFFICIENT for a thesis.
- Never claim investment-grade quality. Not investment advice.
- The valuation pillar MUST include a price at which the thesis breaks (the falsifier price).

Return JSON:
{
  "franchise": "Pillar 1: what the company does to make money and why it is profitable and growing [OBS/INF]",
  "management": "Pillar 2: why the people running it are the right ones to keep it growing [OBS/INF/JDG]",
  "valuation": "Pillar 3: what expectations the current price discounts and the gap vs what it can achieve [INF/JDG]",
  "thesisStatement": "One paragraph: does evidence support a thesis?",
  "priceConclusion": "attractive | unattractive | indeterminate — and why",
  "supported": true/false,
  "falsifiers": ["specific event that would break the thesis 1", "..."],
  "keyRisks": ["risk 1", "risk 2", "risk 3"],
  "engelCurve": {
    "economies": ["..."],
    "categories": [{"name": "...", "elasticity": 0.0}],
    "mechanism": "How the Engel curve tailwind (rising household income → rising spending share in this category) specifically benefits this company"
  }
}`

  const price = quote?.close ?? quote?.price ?? km?.['price'] ?? 'unknown'

  const user = `Company: ${evidence.ticker} — ${profile?.companyName}
Current price: ${price} ${profile?.currency ?? 'USD'}
Sector: ${profile?.sector} / ${profile?.industry} / ${profile?.country}

GORILLA: ${gorilla.verdict} (score ${gorilla.score})
- Obvious Problem: ${(gorilla.obviousProblem as Record<string,unknown>)?.score}
- Invisible Gorilla: ${(gorilla.invisibleGorilla as Record<string,unknown>)?.score}
- Combinatorial: ${(gorilla.combinatorialSolution as Record<string,unknown>)?.score}
- Choke Point: ${(gorilla.chokePoint as Record<string,unknown>)?.score}

Company board summary:
${JSON.stringify({ businessFranchise: companyBoard.businessFranchise, managementSkill: companyBoard.managementSkill, financialProfile: companyBoard.financialProfile, invisibleLayer: companyBoard.invisibleLayer }, null, 1).slice(0, 2000)}

IMAGINE: ${imagine.digitalStage} stage · ${imagine.growthDriver} driven
Base scenario: ${sj((imagine.scenarios as Record<string,unknown>)?.base, 200)}

Key valuation multiples: P/E ${km?.priceToEarningsRatio}, P/B ${km?.priceToBookRatio}, P/S ${km?.priceToSalesRatio}, EV/EBITDA ${km?.evToEBITDA}
Revenue growth: ${km?.revenueGrowth}, ROE: ${km?.returnOnEquity}, ROIC: ${km?.returnOnInvestedCapital}`

  const raw = await llm(system, user, 2500)
  const result = parseJSON(raw)
  send({ stage: 'thesis', status: 'done', msg: `Thesis: ${result.supported ? 'Supported ✓' : 'Not supported'} · ${result.priceConclusion}` })
  return result
}

// ═════════════════════════════════════════════════════════════════════════════
// EVIDENCE REVIEW (abbreviated)
// ═════════════════════════════════════════════════════════════════════════════
async function runEvidenceReview(all: Record<string, unknown>, evidence: Record<string, unknown>, send: SendFn) {
  send({ stage: 'review', status: 'running', msg: 'Running evidence review…' })

  const system = `You perform an abbreviated evidence review on a research report draft. Check:
1. Do load-bearing claims cite the data provided? Flag any that do not.
2. Are there material omissions from the data that the report should address?
3. Are there disagreements between sections that are not resolved?

Return JSON:
{
  "claimsChecked": N,
  "uncorroborated": ["claim that is not backed by the data provided"],
  "materialOmissions": ["fact in data not engaged by the report"],
  "disagreementsFound": ["section A says X but section B says Y"],
  "reviewNote": "One paragraph: what was checked, what gaps remain",
  "dataGaps": ["evidence not available that would strengthen the analysis"]
}`

  const user = `Evidence available: ${JSON.stringify({
    hasProfile: !!(evidence.profile),
    incomeYears: (evidence.income as unknown[])?.length,
    hasTranscript: !!(evidence.transcript as unknown[])?.length,
    hasLiveQuote: !!(evidence.quote),
    hasWebContext: !!(evidence.webContext as string)?.length,
  })}

Report sections produced: ${Object.keys(all).join(', ')}

Thesis: ${sj(all.thesis, 500)}
GORILLA: score ${(all.gorilla as Record<string,unknown>)?.score}, verdict ${(all.gorilla as Record<string,unknown>)?.verdict}
Falsifiable predictions count: ${((all.imagine as Record<string,unknown>)?.falsifiablePredictions as unknown[])?.length ?? 0}`

  const raw = await llm(system, user, 1200)
  const result = parseJSON(raw)
  send({ stage: 'review', status: 'done', msg: `${result.claimsChecked ?? 0} claims checked · ${(result.uncorroborated as unknown[])?.length ?? 0} uncorroborated` })
  return result
}

// ═════════════════════════════════════════════════════════════════════════════
// POST HANDLER — streaming SSE
// ═════════════════════════════════════════════════════════════════════════════
export async function POST(req: Request) {
  if (!FMP_KEY)        return NextResponse.json({ error: 'FMP_API_KEY not configured on Railway — add it in Variables' }, { status: 503 })
  if (!OPENROUTER_KEY) return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured on Railway' }, { status: 503 })

  let body: { company?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }

  const query = body.company?.trim() ?? ''
  if (query.length < 2) return NextResponse.json({ error: 'company name or ticker required' }, { status: 400 })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send: SendFn = (event) => {
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`)) } catch { /* closed */ }
      }

      try {
        // Wave 1: Evidence (deterministic)
        const evidence = await collectEvidence(query, send)

        // Wave 2: LISTEN
        const listeningView = await runListen(evidence, send)

        // Wave 3: COMPANY board
        const companyBoard = await runCompany(evidence, listeningView, send)

        // Wave 4: FALSTAFFIAN rotation
        const rotatedBoard = await runFalstaffian(companyBoard, send)

        // Wave 5: GORILLA scoring (LLM + deterministic CRD-2)
        const gorilla = await runGorilla(companyBoard, rotatedBoard, evidence, send)

        // Wave 6: IMAGINE scenarios + predictions (CRD-3)
        const imagine = await runImagine(companyBoard, gorilla, evidence, send)

        // Wave 7: THESIS synthesis
        const thesis = await runThesis(companyBoard, gorilla, imagine, evidence, send)

        // Evidence review
        const all = { listeningView, companyBoard, rotatedBoard, gorilla, imagine, thesis }
        const review = await runEvidenceReview(all, evidence, send)

        // ── Final structured result ──────────────────────────────────────────
        const profile = evidence.profile as Record<string, unknown>
        const km      = (evidence.keyMetrics as Record<string, unknown>[])?.[0]
        const quote   = evidence.quote as Record<string, unknown>

        send({
          stage: 'complete',
          result: {
            ticker: evidence.ticker,
            name: profile?.companyName ?? evidence.ticker,
            asOf: '2026-10-15',
            price: quote?.close ?? quote?.price,
            currency: profile?.currency ?? 'USD',
            exchange: profile?.exchangeFullName ?? profile?.exchange,
            pipeline: 'company-research-deep (7-stage via Phase 2 API)',

            selfView: companyBoard.selfView,
            businessFranchise: companyBoard.businessFranchise,
            managementSkill: companyBoard.managementSkill,
            financialProfile: companyBoard.financialProfile,
            invisibleLayer: companyBoard.invisibleLayer,
            falstaffian: {
              shapesApplied: rotatedBoard.shapesApplied,
              framingErrors: rotatedBoard.framingErrors,
              rotatedPosition: rotatedBoard.rotatedCompetitivePosition,
              insight: rotatedBoard.falstaffianInsight,
            },
            gorilla: {
              obviousProblem: (gorilla.obviousProblem as Record<string,unknown>)?.score,
              invisibleGorilla: (gorilla.invisibleGorilla as Record<string,unknown>)?.score,
              combinatorialSolution: (gorilla.combinatorialSolution as Record<string,unknown>)?.score,
              chokePoint: (gorilla.chokePoint as Record<string,unknown>)?.score,
              score: gorilla.score,
              verdict: gorilla.verdict,
              summary: (gorilla.invisibleGorilla as Record<string,unknown>)?.whatMarketMisses,
              marketRealityGate: (gorilla.obviousProblem as Record<string,unknown>)?.marketRealityGate,
              details: gorilla,
            },
            imagine: {
              digitalStage: imagine.digitalStage,
              growthDriver: imagine.growthDriver,
              scenarios: imagine.scenarios,
              predictions: imagine.falsifiablePredictions,
              notOnPage: imagine.notOnPage,
              notInPrice: imagine.notInPrice,
            },
            thesis: {
              supported: thesis.supported,
              franchise: thesis.franchise,
              management: thesis.management,
              valuation: thesis.valuation,
              thesisStatement: thesis.thesisStatement,
              priceConclusion: thesis.priceConclusion,
              falsifiers: thesis.falsifiers,
              keyRisks: thesis.keyRisks,
            },
            engelCurve: thesis.engelCurve,
            listeningView,
            evidenceReview: review,
            valuation: {
              peRatio: km?.priceToEarningsRatio,
              pbRatio: km?.priceToBookRatio,
              psRatio: km?.priceToSalesRatio,
              evEbitda: km?.evToEBITDA,
              roe: km?.returnOnEquity,
              roic: km?.returnOnInvestedCapital,
              revenueGrowth: km?.revenueGrowth,
              grossMargin: km?.grossProfitMargin,
            },
            stagesRun: ['evidence', 'listen', 'company', 'falstaffian', 'gorilla', 'imagine', 'thesis', 'evidence_review'],
            notInvestmentAdvice: true,
          },
        })
      } catch (err) {
        send({ stage: 'error', error: err instanceof Error ? err.message : String(err) })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
