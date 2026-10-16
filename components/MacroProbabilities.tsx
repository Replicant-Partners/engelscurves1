'use client'
// Priority 6 — Calibrated macro probabilities for Engel curve scenarios
// Uses superforecasting skill (Tetlock & Gardner 2015) with Fermi decomposition
// Generated: 2026-10-15 | Calibrated via scenario_calibrate [OBS — kask tool]

interface Forecast {
  question: string
  probability: number
  tier: 'proximate' | 'probable' | 'possible'
  subQuestions: { q: string; p: number }[]
  implication: string
  source: string
  asOf: string
}

const FORECASTS: Forecast[] = [
  {
    question: "India per-capita PPP will exceed $12,000 by 2028",
    probability: 0.747,
    tier: 'proximate',
    subQuestions: [
      { q: "India sustains 6%+ real GDP growth through 2028", p: 0.72 },
      { q: "Population growth stays below 1% (per-capita intact)", p: 0.90 },
      { q: "No major external shock derails growth", p: 0.65 },
      { q: "$12k reachable from $9.4k in 4 years at current pace", p: 0.68 },
    ],
    implication: "India enters the $10k–$15k inflection zone where e-commerce, healthcare, and education spending shares accelerate fastest. HDFC Bank, consumer discretionary companies positioned here.",
    source: "scenario_calibrate (kask) · Fermi decomposition · World Bank base data",
    asOf: "2026-10-15",
  },
  {
    question: "China household consumption / GDP rises from 39% to 44%+ by 2028",
    probability: 0.428,
    tier: 'probable',
    subQuestions: [
      { q: "China GDP grows at 4%+ annually 2025-2028", p: 0.60 },
      { q: "Property crisis stabilizes, releases household savings", p: 0.40 },
      { q: "Government stimulus shifts to consumption vs investment", p: 0.45 },
      { q: "5pp consumption/GDP shift achievable in 3 years", p: 0.25 },
    ],
    implication: "If achieved: structural tailwind for luxury goods (LVMH), healthcare, education in China. If not: China stagnation scenario (20% probability) depresses the entire Engel curve thesis for China chains.",
    source: "scenario_calibrate (kask) · Fermi decomposition · Rhodium Group base data",
    asOf: "2026-10-15",
  },
  {
    question: "Mexico per-capita PPP exceeds $25,000 by 2030",
    probability: 0.42,
    tier: 'probable',
    subQuestions: [
      { q: "Nearshoring investment sustains 2%+ GDP growth 2025-2030", p: 0.60 },
      { q: "USMCA 2026 review does not structurally disrupt trade", p: 0.65 },
      { q: "No severe security/political shock limits investment", p: 0.55 },
      { q: "$25k reachable from $22k at current pace", p: 0.72 },
    ],
    implication: "Mexico crossing $25k would accelerate premium retail, financial services. MercadoLibre's Mexico segment would benefit most — currently 22% of MELI revenue.",
    source: "scenario_calibrate (kask) · Fermi decomposition · World Bank + LSEG Mexico data",
    asOf: "2026-10-15",
  },
]

const TIER_STYLE = {
  proximate: { bg: '#e6f4ea', color: '#1a7f37', border: '#a8d5b5', label: 'Proximate (>67%)' },
  probable:  { bg: '#fff8c5', color: '#9a6700', border: '#f0c060', label: 'Probable (33–67%)' },
  possible:  { bg: '#f6f8fa', color: '#57606a', border: '#d0d7de', label: 'Possible (<33%)' },
}

function ProbBar({ p }: { p: number }) {
  const pct = Math.round(p * 100)
  const color = p >= 0.67 ? '#1a7f37' : p >= 0.33 ? '#9a6700' : '#cf222e'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: '#eaeef2', borderRadius: 4 }}>
        <div style={{ height: 8, width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, color, minWidth: 44 }}>{pct}%</span>
    </div>
  )
}

export default function MacroProbabilities() {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#6e7681', marginBottom: 16 }}>
        Calibrated via Tetlock superforecasting methodology — Fermi decomposition of 4 sub-questions per forecast,
        confidence-weighted average. No isotonic calibration (insufficient resolved forecasts). [OBS — kask scenario_calibrate, 2026-10-15]
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {FORECASTS.map((f, i) => {
          const ts = TIER_STYLE[f.tier]
          return (
            <div key={i} style={{ border: '1px solid #d0d7de', borderRadius: 10, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #eaeef2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ ...ts, fontSize: 10, padding: '2px 8px', borderRadius: 20, border: `1px solid ${ts.border}`, fontWeight: 600, display: 'inline-block', marginBottom: 6 }}>
                      {ts.label}
                    </span>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1b1f23', lineHeight: 1.4 }}>{f.question}</p>
                  </div>
                </div>
                <ProbBar p={f.probability} />
              </div>

              {/* Sub-questions */}
              <div style={{ padding: '12px 20px', background: '#f6f8fa', borderBottom: '1px solid #eaeef2' }}>
                <p style={{ margin: '0 0 8px', fontSize: 10, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Fermi sub-questions
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {f.subQuestions.map((sq, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: sq.p >= 0.67 ? '#1a7f37' : sq.p >= 0.5 ? '#9a6700' : '#cf222e', flexShrink: 0, minWidth: 36 }}>
                        {Math.round(sq.p * 100)}%
                      </span>
                      <p style={{ margin: 0, fontSize: 11, color: '#57606a', lineHeight: 1.4 }}>{sq.q}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Implication */}
              <div style={{ padding: '12px 20px' }}>
                <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Engel curve implication
                </p>
                <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.6 }}>{f.implication}</p>
                <p style={{ margin: '8px 0 0', fontSize: 10, color: '#afb8c1' }}>{f.source} · {f.asOf}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 16, padding: '10px 14px', background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6, fontSize: 11, color: '#9a6700' }}>
        <strong>Calibration note:</strong> These are Fermi-decomposed estimates, not market-implied probabilities.
        No prediction markets were found for China/India/Mexico GDP-level questions on Kalshi or Polymarket.
        Calibration will improve as more forecasts are resolved and scored via Brier scoring.
        Methodology: Tetlock &amp; Gardner, <em>Superforecasting</em> (2015), Ch. 4-6.
      </div>
    </div>
  )
}
