'use client'
import dynamic from 'next/dynamic'

const IncomeGrowthChart  = dynamic(() => import('@/components/IncomeGrowthChart'),  { ssr: false })
const EngelCurveChart    = dynamic(() => import('@/components/EngelCurveChart'),    { ssr: false })
const ChinaSpendingChart = dynamic(() => import('@/components/ChinaSpendingChart'), { ssr: false })
const IndustryChains     = dynamic(() => import('@/components/IndustryChains'),     { ssr: false })
const ScenarioTree       = dynamic(() => import('@/components/ScenarioTree'),       { ssr: false })
const DataGapsTable      = dynamic(() => import('@/components/DataGapsTable'),      { ssr: false })
const LiveQuotes         = dynamic(() => import('@/components/LiveQuotes'),         { ssr: false })
const LiveRevenueChart   = dynamic(() => import('@/components/LiveRevenueChart'),   { ssr: false })

// ── Observable provenance badges ────────────────────────────────
const BADGES = [
  { label: 'OBS', bg: '#e6f4ea', color: '#1a7f37', border: '#a8d5b5' },
  { label: 'INF', bg: '#fff8c5', color: '#9a6700', border: '#f0c060' },
  { label: 'JDG', bg: '#ddf4ff', color: '#0969da', border: '#b6e3ff' },
  { label: 'GAP', bg: '#f6f8fa', color: '#57606a', border: '#d0d7de' },
]

const BadgeLegend = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginBottom: 28 }}>
    {BADGES.map((b) => (
      <span key={b.label} className="obs-badge" style={{ background: b.bg, color: b.color, borderColor: b.border }}>
        {b.label}
      </span>
    ))}
    <span style={{ fontSize: 12, color: '#6e7681', alignSelf: 'center' }}>
      OBS = primary source · INF = model inference · JDG = analyst judgment · GAP = evidence unavailable
    </span>
  </div>
)

// ── Section wrapper ──────────────────────────────────────────────
const Sec = ({ n, title, sub, children }: { n: string; title: string; sub?: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 56 }}>
    <h2 className="obs-h2">{n} — {title}</h2>
    {sub && <p className="obs-byline">{sub}</p>}
    {children}
  </section>
)

// ── Evidence table helper ────────────────────────────────────────
const TH = { textAlign: 'left' as const, padding: '6px 16px 8px 0', fontSize: 11, fontWeight: 600 as const, color: '#6e7681' as const, textTransform: 'uppercase' as const, letterSpacing: '.06em' as const }
const TD = { padding: '7px 16px 7px 0', borderBottom: '1px solid #eaeef2', verticalAlign: 'top' as const, fontSize: 13 }

export default function Home() {
  return (
    <div className="obs-notebook">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{ padding: '48px 0 32px' }}>
        <BadgeLegend />
        <h1 className="obs-h1">
          Engel-Curve Shifts, Industry Growth &amp; Equity Prices
        </h1>
        <p className="obs-byline" style={{ marginTop: 6 }}>
          Research run <code style={{ fontFamily: 'monospace', fontSize: 12, background: '#f6f8fa', padding: '1px 5px', borderRadius: 4 }}>60c9821f</code>
          &nbsp;· 15 Oct 2026 · Evidence-led cross-economy pass · Not investment advice
        </p>
        <p className="obs-body obs-prose" style={{ marginTop: 16, color: '#57606a' }}>
          As household income rises, the share of spending devoted to food falls while luxuries claim a growing fraction — Engel&apos;s Law, formalised in 1857. This notebook traces that mechanism across five economies, ranks four industry chains by tailwind strength, and asks whether current equity prices already reflect the structural shift.
        </p>
      </header>

      {/* ── 1. Mechanism ───────────────────────────────────────── */}
      <Sec n="1" title="The Economic Mechanism" sub="Three distinctions the evidence requires">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { type: 'Inferior goods', badge: 'ε_Y < 0',   color: '#e15759', desc: 'Absolute spending falls as income rises. Budget share falls sharply. Example: cheap staple grains, basic public transit.' },
            { type: 'Necessities',    badge: '0 < ε_Y < 1', color: '#f28e2b', desc: 'Spending rises but slower than income. Budget share falls. Example: food, basic clothing, utilities.' },
            { type: 'Luxuries',       badge: 'ε_Y > 1',   color: '#4e79a7', desc: 'Spending rises faster than income. Budget share rises. Example: healthcare, education, travel, premium goods.' },
          ].map((c) => (
            <div key={c.type} style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#1b1f23' }}>{c.type}</span>
                <code style={{ fontSize: 11, background: c.color + '18', color: c.color, padding: '1px 6px', borderRadius: 4, border: `1px solid ${c.color}30` }}>{c.badge}</code>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="obs-cell obs-prose">
          spending levels ≠ budget shares &nbsp;·&nbsp; cross-section ≠ longitudinal &nbsp;·&nbsp; price effects ≠ income elasticity
        </div>

        <div className="obs-prose">
          <p className="obs-body"><strong>Spending levels vs. budget shares.</strong> Absolute food spending rises with income; the <em>share</em> falls. Industry revenue responds to absolute spending; Engel-curve shifts operate on shares — these must not be conflated.</p>
          <p className="obs-body"><strong>Cross-sectional vs. longitudinal.</strong> Cross-section compares rich and poor households today. Longitudinal tracks the same economy over decades. High-inequality economies can show a steep cross-section while longitudinal shifts are slow.</p>
          <p className="obs-caption">Methodological warning [OBS]: De Vreyer et al. (World Bank Economic Review 2025 / NBER WP26850) show standard household Engel curves overestimate food income elasticity by up to 43% due to intra-household heterogeneity. The true slope is steeper than standard models imply.</p>
        </div>
      </Sec>

      {/* ── 2. Income Trajectories ─────────────────────────────── */}
      <Sec n="2" title="Economy Income Trajectories" sub="GDP per capita, PPP (constant 2021 international $) · World Bank NY.GDP.PCAP.PP.KD · 2000–2024 [OBS]">
        <IncomeGrowthChart />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 20 }}>
          {[
            { name: 'China',   color: '#e15759', cagr: '+7.9%', note: '+487% total since 2000' },
            { name: 'India',   color: '#f28e2b', cagr: '+4.9%', note: '+213% total since 2000' },
            { name: 'Brazil',  color: '#b07aa1', cagr: '+1.4%', note: 'Peaked 2013–14 ⚠' },
            { name: 'Germany', color: '#59a14f', cagr: '+1.0%', note: 'Stable high-income' },
            { name: 'USA',     color: '#4e79a7', cagr: '+1.3%', note: 'Lowest quintile +6.8% (2022-24)' },
          ].map((e) => (
            <div key={e.name} style={{ border: '1px solid #d0d7de', borderRadius: 6, padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: 13, color: '#1b1f23' }}>{e.name}</span>
              </div>
              <p style={{ margin: '0 0 2px', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: e.color }}>{e.cagr}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6e7681' }}>{e.note}</p>
            </div>
          ))}
        </div>
        <div className="obs-cell" style={{ marginTop: 16 }}>
          Brazil caution: income peaked ≈$19.2k in 2013–14 and recovered only to $19.7k by 2024. No Engel-curve tailwind evidenced — treated as a stagnation case. [OBS]
        </div>
      </Sec>

      {/* ── 3. Engel Curve ─────────────────────────────────────── */}
      <Sec n="3" title="The Engel Curve" sub="Food budget share (%) vs. GDP per capita PPP — 207-country reference curve + observed economy points">
        <EngelCurveChart />
        <p className="obs-caption" style={{ marginTop: 12 }}>
          Reference curve: PERI WP247 "Engel&apos;s Law Around the World 150 Years Later" — 207 countries [OBS].
          Economy food-share data: India HCES 2023-24 [OBS]; China NBS 2023 [OBS]; Germany Eurostat HBS 2020 [OBS]; USA/Brazil [INF — estimated from reference curve; primary surveys not extracted].
        </p>
      </Sec>

      {/* ── 4. China 2023 ──────────────────────────────────────── */}
      <Sec n="4" title="China Household Spending 2023" sub="NBS Press Release, 18 Jan 2024 — per capita consumption expenditure by category [OBS]">
        <ChinaSpendingChart />
      </Sec>

      {/* ── 5. Cross-Economy Evidence ──────────────────────────── */}
      <Sec n="5" title="Cross-Economy Evidence Table" sub="One pass · Dated · Gaps declared, not filled">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d0d7de' }}>
                {['Economy', 'Income 2024', 'Food share', 'Healthcare', 'Key shift observed', 'Data year', 'Uncertainty'].map((h) => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'India',   color: '#f28e2b', income: '$9,416',  food: '~47% rural',   health: 'GAP',         shift: 'Non-food share +5.9pp rural; Gini declining', year: 'HCES 2023-24', unc: 'No category × quintile retrieved', foodFlag: 'OBS', healthFlag: 'GAP' },
                { name: 'China',   color: '#e15759', income: '$23,841', food: '29.8%',         health: '9.2%',        shift: 'Healthcare +16%, Education +16.4% YoY', year: 'NBS 2023', unc: 'Rhodium Group disputes NBS aggregate levels', foodFlag: 'OBS', healthFlag: 'OBS' },
                { name: 'USA',     color: '#4e79a7', income: '$75,698', food: '~13%',          health: '18% of GDP',  shift: 'Lowest quintile income +6.8% (2022–24)', year: 'BLS CEX 2024', unc: 'Category × quintile shares not extracted', foodFlag: 'INF', healthFlag: 'OBS' },
                { name: 'Germany', color: '#59a14f', income: '$62,655', food: '~13.9%',        health: '9.3% of GDP', shift: 'GKV spending +7.8% projected 2025; aging-driven', year: 'Eurostat HBS 2020; OECD 2026', unc: 'HBS 2020 pre-COVID; Destatis EVS quintiles not extracted', foodFlag: 'OBS', healthFlag: 'OBS' },
                { name: 'Brazil',  color: '#b07aa1', income: '$19,652', food: 'GAP',           health: 'GAP',         shift: 'Income flat since 2013; no Engel shift evidenced', year: 'WB 2024', unc: 'IBGE POF not retrieved', foodFlag: 'GAP', healthFlag: 'GAP' },
              ].map((r) => (
                <tr key={r.name}>
                  <td style={TD}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                      <strong>{r.name}</strong>
                    </span>
                  </td>
                  <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 600 }}>{r.income}</td>
                  <td style={TD}>
                    {r.foodFlag === 'GAP'
                      ? <span style={{ color: '#afb8c1', fontStyle: 'italic' }}>unavailable</span>
                      : <>{r.food} <span className="obs-badge" style={r.foodFlag === 'OBS' ? { background: '#e6f4ea', color: '#1a7f37', borderColor: '#a8d5b5' } : { background: '#fff8c5', color: '#9a6700', borderColor: '#f0c060' }}>{r.foodFlag}</span></>
                    }
                  </td>
                  <td style={TD}>
                    {r.healthFlag === 'GAP'
                      ? <span style={{ color: '#afb8c1', fontStyle: 'italic' }}>unavailable</span>
                      : <>{r.health} <span className="obs-badge" style={{ background: '#e6f4ea', color: '#1a7f37', borderColor: '#a8d5b5' }}>OBS</span></>
                    }
                  </td>
                  <td style={{ ...TD, maxWidth: 220 }}>{r.shift}</td>
                  <td style={{ ...TD, fontSize: 12, color: '#6e7681' }}>{r.year}</td>
                  <td style={{ ...TD, fontSize: 11, color: '#afb8c1', maxWidth: 200 }}>{r.unc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="obs-caption" style={{ marginTop: 10 }}>
          Global reference [OBS]: food share ≈50% low income → ≈40% lower-middle → ≈30% upper-middle → ≈15% high income.
          PERI WP247 "Engel&apos;s Law Around the World 150 Years Later" (207 countries).
        </p>
      </Sec>

      {/* ── Live quotes + revenue ──────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="obs-h2">Live Market Data</h2>
        <p className="obs-byline">EODHD real-time via /api/quotes · 5-minute cache · Static snapshot fallback</p>
        <LiveQuotes />
        <LiveRevenueChart />
      </section>

      {/* ── 6. Industry Chains ─────────────────────────────────── */}
      <Sec n="6" title="Ranked Industry–Economy Chains" sub="Four chains with strongest plausible tailwind — traced to listed companies with falsifiers">
        <IndustryChains />

        {/* Implied vs evidenced */}
        <div style={{ marginTop: 40 }}>
          <h3 className="obs-h3">Implied vs. Evidenced Growth — Dated Comparison</h3>
          <p className="obs-byline">As of 15 Oct 2026</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d0d7de' }}>
                {['Company', 'Evidenced recent growth', 'Price-implied growth', 'Sensitivity axis'].map((h) => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { co: 'Titan (TITAN.NS)',   evid: '29.2% revenue CAGR FY23-26 [OBS]; +29.3% Q1 FY27 [OBS]', implied: '~20-25% EPS CAGR at 59× fwd P/E [INF]', sens: 'Gold price; premiumisation rate' },
                { co: 'LVMH (MC.PA)',       evid: '€80.8B revenue 2025, -4.6% YoY [OBS]; F&L -5% organic Q3 2026 [OBS]', implied: 'Visible Alpha consensus +1-2% organic [OBS]; P/E 17.9× [OBS]', sens: 'China property recovery; aspirational demand' },
                { co: 'Fresenius SE (FRE)', evid: '€22.9B revenue 2025, +4.8% YoY [OBS]; organic +7% Q1 2025 [OBS]', implied: 'P/E 19.1× at €43.86 [OBS]; guided 4-6% FY2025 [OBS]', sens: 'GKV reform; home dialysis adoption' },
                { co: 'FME (FME.XETRA)',   evid: 'Q2 2026 €4.86B (beat est.); patient count -16% since 2020 [OBS]', implied: 'P/E ~16×; margin guidance 10.5-12% [OBS]', sens: 'Patient volume trajectory; reimbursement' },
              ].map((r) => (
                <tr key={r.co} style={{ borderBottom: '1px solid #eaeef2' }}>
                  <td style={{ ...TD, fontWeight: 600 }}>{r.co}</td>
                  <td style={TD}>{r.evid}</td>
                  <td style={TD}>{r.implied}</td>
                  <td style={{ ...TD, color: '#6e7681' }}>{r.sens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>

      {/* ── 7. Scenario Tree ───────────────────────────────────── */}
      <Sec n="7" title="Scenario Tree Pilot — China Income Trajectory" sub="Focal question: China household disposable income ≥5% real CAGR 2024-2028? · [JDG] — illustrative structure, not a quantified forecast">
        <ScenarioTree />
      </Sec>

      {/* ── 8. Data Gaps ───────────────────────────────────────── */}
      <Sec n="8" title="Data Gaps" sub="Declared, not substituted">
        <DataGapsTable />
        <div style={{ marginTop: 20, background: '#ddf4ff', border: '1px solid #b6e3ff', borderRadius: 6, padding: '12px 16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#0969da' }}>Skill recommendation</p>
          <p style={{ margin: 0, fontSize: 13, color: '#1b1f23', lineHeight: 1.55 }}>
            <strong>superforecasting</strong> — The scenario tree uses judgment-based probabilities [JDG]. Running the full Tetlock pipeline (triage → Fermi decomposition → outside view → Bayesian update → dragonfly-eye synthesis) on the three China branches would sharpen the estimates and surface the most discriminating observables.
          </p>
        </div>
      </Sec>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #d0d7de', paddingTop: 24, marginTop: 32 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#6e7681', margin: '0 0 8px' }}>Sources</p>
        <ul style={{ margin: 0, paddingLeft: 18, columns: 2, columnGap: 40, fontSize: 12, color: '#6e7681', lineHeight: 1.8 }}>
          {[
            'World Bank NY.GDP.PCAP.PP.KD, retrieved 15 Oct 2026 [OBS]',
            'China NBS "Households\' Income and Consumption Expenditure in 2023", 18 Jan 2024 [OBS]',
            'India MoSPI HCES 2023-24 / The India Forum analysis [OBS]',
            'PERI WP247 "Engel\'s Law Around the World 150 Years Later" (207 countries) [OBS]',
            'NBER WP26850 / De Vreyer et al. World Bank Economic Review 2025 [OBS]',
            'Eurostat HBS 2020 (hbs_exp_t133, hbs_str_t223) [OBS]',
            'OECD "Latest Health Spending Trends and Outlook" March 2026 [OBS]',
            'Commonwealth Fund "U.S. Health Care from a Global Perspective 2026" [OBS]',
            'EODHD income_statement + key_metrics — MC.PA, FRE.XETRA, FME.XETRA, 15 Oct 2026 [OBS]',
            'FRED PCE series, retrieved 15 Oct 2026 [OBS]',
            'ICICI Direct Q4FY26 Titan research note [OBS]',
            'Reuters LVMH Q3 2026 results, 13 Oct 2026 [OBS]',
            'Rhodium Group "No Quick Fixes: China\'s Long-Term Consumption Growth" [OBS]',
            'AOF/CICC "Understanding Household Consumption in China" [OBS]',
          ].map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p style={{ fontSize: 11, color: '#afb8c1', marginTop: 16 }}>
          Research run 60c9821f · 15 Oct 2026 · Not investment advice.
        </p>
      </footer>
    </div>
  )
}
