'use client'
import dynamic from 'next/dynamic'

const IncomeGrowthChart  = dynamic(() => import('@/components/IncomeGrowthChart'),  { ssr: false })
const EngelCurveChart    = dynamic(() => import('@/components/EngelCurveChart'),    { ssr: false })
const ChinaSpendingChart = dynamic(() => import('@/components/ChinaSpendingChart'), { ssr: false })
const IndustryChains     = dynamic(() => import('@/components/IndustryChains'),     { ssr: false })
const ScenarioTree       = dynamic(() => import('@/components/ScenarioTree'),       { ssr: false })
const DataGapsTable      = dynamic(() => import('@/components/DataGapsTable'),      { ssr: false })

// ── Observable-style layout constants ──────────────────────────
const PAGE: React.CSSProperties   = { maxWidth: 900, margin: '0 auto', padding: '48px 24px 120px', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1b1f23' }
const H1: React.CSSProperties     = { fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.2 }
const H2: React.CSSProperties     = { fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#1b1f23' }
const BYLINE: React.CSSProperties = { fontSize: 12, color: '#999', marginBottom: 32, marginTop: 0 }
const PROSE: React.CSSProperties  = { fontSize: 14, lineHeight: 1.7, color: '#333', margin: '0 0 16px' }
const SECTION: React.CSSProperties = { marginBottom: 56 }
const DIVIDER: React.CSSProperties = { border: 'none', borderTop: '1px solid #e8e8e8', margin: '48px 0' }
const NOTE: React.CSSProperties   = { background: '#f9f9f9', border: '1px solid #e8e8e8', borderRadius: 4, padding: '8px 12px', fontSize: 11, color: '#666', fontFamily: 'monospace', marginBottom: 12 }
const TABLE: React.CSSProperties  = { width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 12 }
const TH: React.CSSProperties     = { textAlign: 'left', padding: '6px 12px 6px 0', fontSize: 11, color: '#555', fontWeight: 600, borderBottom: '1px solid #e8e8e8' }
const TD: React.CSSProperties     = { padding: '5px 12px 5px 0', borderBottom: '1px solid #f5f5f5', verticalAlign: 'top' }

type BadgeProps = { label: string; color: string }
const Badge = ({ label, color }: BadgeProps) => (
  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: color + '18', color, border: `1px solid ${color}40`, fontFamily: 'monospace', marginRight: 6 }}>
    {label}
  </span>
)

export default function Home() {
  return (
    <div style={PAGE}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ marginBottom: 12 }}>
          <Badge label="OBS = Primary source" color="#137333" />
          <Badge label="INF = Model inference" color="#b45309" />
          <Badge label="JDG = Analyst judgment" color="#1d4ed8" />
          <Badge label="GAP = Unavailable" color="#666" />
        </div>
        <h1 style={H1}>Engel-Curve Shifts, Industry Growth & Equity Prices</h1>
        <p style={BYLINE}>Research run 60c9821f · 15 Oct 2026 · Evidence-led · Not investment advice</p>
        <p style={{ ...PROSE, maxWidth: 680 }}>
          As household income rises, spending shares shift from necessities toward luxuries — Engel&apos;s Law, formalised in 1857.
          This notebook traces that mechanism across five economies, ranks four industry chains by tailwind strength, and asks
          whether current equity prices already reflect the structural shift.
        </p>
      </div>

      <hr style={DIVIDER} />

      {/* ── 1. Mechanism ─────────────────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>1 — The Economic Mechanism</h2>
        <p style={{ ...BYLINE, marginBottom: 20 }}>Three distinctions the evidence requires</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          {[
            { type: 'Inferior goods', badge: 'ε_Y < 0', color: '#d62728', desc: 'Absolute spending falls as income rises. Budget share falls sharply. Example: cheap staple grains.' },
            { type: 'Necessities',    badge: '0 < ε_Y < 1', color: '#ff7f0e', desc: 'Spending rises but slower than income. Budget share falls. Example: food, basic clothing.' },
            { type: 'Luxuries',      badge: 'ε_Y > 1',   color: '#2ca02c', desc: 'Spending rises faster than income. Budget share rises. Example: healthcare, education, travel.' },
          ].map((c) => (
            <div key={c.type} style={{ border: '1px solid #e8e8e8', borderRadius: 6, padding: 16 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{c.type}</span>
                <span style={{ fontSize: 11, background: c.color + '15', color: c.color, padding: '1px 6px', borderRadius: 3, fontFamily: 'monospace' }}>{c.badge}</span>
              </div>
              <p style={{ fontSize: 12, color: '#555', margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={NOTE}>spending levels ≠ budget shares · cross-section ≠ longitudinal · price effects ≠ income elasticity</div>
        <p style={PROSE}>
          <strong>Spending levels vs. budget shares:</strong> absolute food spending rises with income; the <em>share</em> falls.
          Industry revenue responds to absolute spending; Engel-curve structural shifts operate on shares — these must not be conflated.
        </p>
        <p style={PROSE}>
          <strong>Cross-sectional vs. longitudinal:</strong> cross-section compares rich and poor households today.
          Longitudinal tracks the same economy over decades. High-inequality economies can show a steep cross-section while
          longitudinal shifts are slow — if income growth is concentrated at the top.
        </p>
        <p style={{ ...PROSE, color: '#888', fontSize: 12 }}>
          Methodological warning [OBS]: De Vreyer et al. (World Bank Economic Review 2025 / NBER WP26850) show standard
          household Engel curves overestimate food income elasticity by up to 43% due to intra-household heterogeneity.
        </p>
      </section>

      <hr style={DIVIDER} />

      {/* ── 2. Income Trajectories ───────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>2 — Economy Income Trajectories</h2>
        <p style={BYLINE}>GDP per capita PPP (constant 2021 $) · World Bank NY.GDP.PCAP.PP.KD · 2000–2024 [OBS]</p>
        <IncomeGrowthChart />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 16 }}>
          {[
            { name: 'China',   color: '#d62728', cagr: '+7.9%', note: '+487% since 2000' },
            { name: 'India',   color: '#ff7f0e', cagr: '+4.9%', note: '+213% since 2000' },
            { name: 'Brazil',  color: '#9467bd', cagr: '+1.4%', note: 'Peaked 2013–14 ⚠' },
            { name: 'Germany', color: '#2ca02c', cagr: '+1.0%', note: 'Stable high-income' },
            { name: 'USA',     color: '#1f77b4', cagr: '+1.3%', note: '$75.7k in 2024' },
          ].map((e) => (
            <div key={e.name} style={{ border: '1px solid #e8e8e8', borderRadius: 6, padding: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: 12 }}>{e.name}</span>
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: 13, margin: '0 0 2px', color: e.color }}>{e.cagr} CAGR</p>
              <p style={{ fontSize: 10, color: '#999', margin: 0 }}>{e.note}</p>
            </div>
          ))}
        </div>
        <div style={{ ...NOTE, marginTop: 12 }}>
          Brazil caution: income peaked ≈$19.2k in 2013–14 and only recovered to $19.7k by 2024.
          No Engel-curve tailwind evidenced for Brazil — treated as a stagnation case study. [OBS]
        </div>
      </section>

      <hr style={DIVIDER} />

      {/* ── 3. Engel Curve ───────────────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>3 — The Engel Curve</h2>
        <p style={BYLINE}>Food budget share (%) vs. GDP per capita PPP — 207-country reference + observed economy points</p>
        <EngelCurveChart />
      </section>

      <hr style={DIVIDER} />

      {/* ── 4. China 2023 ────────────────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>4 — China Household Spending 2023</h2>
        <p style={BYLINE}>NBS Press Release, 18 Jan 2024 — per capita consumption by category [OBS]</p>
        <ChinaSpendingChart />
      </section>

      <hr style={DIVIDER} />

      {/* ── 5. Cross-Economy Table ───────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>5 — Cross-Economy Evidence Table</h2>
        <p style={BYLINE}>One pass · Dated · Gaps labeled, not filled</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={TABLE}>
            <thead>
              <tr>
                {['Economy', 'Income 2024 PPP', 'Food share', 'Healthcare share', 'Key shift', 'Data year', 'Uncertainty'].map((h) => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'India',   color: '#ff7f0e', income: '$9,416',  food: '~47% rural [OBS]', health: 'GAP',           shift: 'Non-food share +5.9pp rural; Gini declining', year: 'HCES 2023-24', unc: 'No category×quintile data retrieved' },
                { name: 'China',   color: '#d62728', income: '$23,841', food: '29.8% [OBS]',      health: '9.2% [OBS]',    shift: 'Healthcare +16%, Education +16.4% YoY', year: 'NBS 2023', unc: 'Rhodium Group disputes NBS aggregate levels' },
                { name: 'USA',     color: '#1f77b4', income: '$75,698', food: '~13% [INF]',       health: '18% GDP [OBS]', shift: 'Lowest quintile income +6.8% (2022–24)', year: 'BLS CEX 2024', unc: 'Category×quintile shares not extracted' },
                { name: 'Germany', color: '#2ca02c', income: '$62,655', food: '~13.9% [OBS]',    health: '9.3% GDP [OBS]', shift: 'GKV spending +7.8% 2025; aging-driven', year: 'Eurostat HBS 2020; OECD 2026', unc: 'HBS 2020 pre-COVID; EVS quintiles not extracted' },
                { name: 'Brazil',  color: '#9467bd', income: '$19,652', food: 'GAP',              health: 'GAP',           shift: 'Income flat since 2013; no Engel shift evidenced', year: 'WB 2024', unc: 'IBGE POF not retrieved' },
              ].map((r) => (
                <tr key={r.name}>
                  <td style={TD}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} /><strong>{r.name}</strong></span></td>
                  <td style={{ ...TD, fontFamily: 'monospace' }}>{r.income}</td>
                  <td style={TD}>{r.food === 'GAP' ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>GAP</span> : r.food}</td>
                  <td style={TD}>{r.health === 'GAP' ? <span style={{ color: '#bbb', fontStyle: 'italic' }}>GAP</span> : r.health}</td>
                  <td style={{ ...TD, maxWidth: 200 }}>{r.shift}</td>
                  <td style={{ ...TD, fontSize: 11, color: '#666' }}>{r.year}</td>
                  <td style={{ ...TD, fontSize: 10, color: '#aaa', maxWidth: 180 }}>{r.unc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...NOTE, marginTop: 10 }}>
          Global reference [OBS]: food share ≈50% low income → ≈40% lower-middle → ≈30% upper-middle → ≈15% high income.
          Source: PERI WP247 "Engel&apos;s Law Around the World 150 Years Later" (207 countries).
        </div>
      </section>

      <hr style={DIVIDER} />

      {/* ── 6. Industry Chains ───────────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>6 — Ranked Industry–Economy Chains</h2>
        <p style={BYLINE}>Four chains with strongest plausible tailwind — traced to listed companies with falsifiers</p>
        <IndustryChains />

        {/* Implied vs evidenced */}
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px', color: '#333' }}>Implied vs. Evidenced Growth — Dated Comparison</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={TABLE}>
              <thead>
                <tr>
                  {['Company', 'Evidenced recent growth', 'Price-implied growth [INF]', 'Sensitivity axis'].map((h) => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { co: 'Titan (TITAN.NS)',   evid: '29.2% revenue CAGR FY23-26 [OBS]; +29.3% Q1FY27 [OBS]', implied: '~20-25% EPS CAGR at 59x fwd P/E [INF]', sens: 'Gold price; premiumisation rate' },
                  { co: 'LVMH (MC.PA)',        evid: '-1% organic H1 2025; F&L -5% organic Q3 2026 [OBS]',    implied: 'Visible Alpha consensus +1-2% organic [OBS]', sens: 'China property recovery; aspirational demand' },
                  { co: 'Fresenius SE (FRE)', evid: 'Organic +7% Q1 2025; guided 4-6% FY2025 [OBS]',          implied: 'P/E not retrieved [GAP]',                  sens: 'GKV reform; home dialysis adoption' },
                  { co: 'FME (FME.DE)',        evid: 'Q2 2026 €4.86bn (beat est.); patient count -16% since 2020 [OBS]', implied: 'Margin guidance 10.5-12% FY2026 [OBS]', sens: 'Patient volume trajectory; reimbursement' },
                ].map((r) => (
                  <tr key={r.co}>
                    <td style={{ ...TD, fontWeight: 500 }}>{r.co}</td>
                    <td style={{ ...TD, color: '#444' }}>{r.evid}</td>
                    <td style={{ ...TD, color: '#444' }}>{r.implied}</td>
                    <td style={{ ...TD, color: '#888', fontSize: 11 }}>{r.sens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <hr style={DIVIDER} />

      {/* ── 7. Scenario Tree ─────────────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>7 — Scenario Tree Pilot</h2>
        <p style={BYLINE}>China income trajectory 2024–2028 · [JDG] — illustrative structure, not a quantified forecast</p>
        <ScenarioTree />
      </section>

      <hr style={DIVIDER} />

      {/* ── 8. Data Gaps ─────────────────────────────────── */}
      <section style={SECTION}>
        <h2 style={H2}>8 — Data Gaps</h2>
        <p style={BYLINE}>Declared, not substituted</p>
        <DataGapsTable />
        <div style={{ marginTop: 16, padding: 12, background: '#e8f0fe', borderRadius: 6, border: '1px solid #c7d7fd' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1d4ed8', margin: '0 0 4px' }}>Skill recommendation</p>
          <p style={{ fontSize: 11, color: '#444', margin: 0, lineHeight: 1.5 }}>
            <strong>superforecasting</strong> — The scenario tree uses judgment-based probabilities [JDG].
            Running the full Tetlock pipeline (triage → Fermi → outside view → Bayesian update → dragonfly-eye synthesis)
            on the three China branches would sharpen the probabilities and surface the most discriminating evidence to monitor.
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #e8e8e8', paddingTop: 24, fontSize: 11, color: '#aaa', lineHeight: 1.8 }}>
        <p style={{ fontWeight: 600, color: '#666', marginBottom: 6 }}>Sources</p>
        <ul style={{ margin: 0, paddingLeft: 16, listStyle: 'disc' }}>
          {[
            'World Bank NY.GDP.PCAP.PP.KD, retrieved 15 Oct 2026',
            'China NBS "Households\' Income and Consumption Expenditure in 2023", 18 Jan 2024',
            'India MoSPI HCES 2023-24 / The India Forum analysis',
            'PERI WP247 "Engel\'s Law Around the World 150 Years Later" (207 countries)',
            'NBER WP26850 / De Vreyer et al. World Bank Economic Review 2025',
            'Eurostat HBS 2020 (hbs_exp_t133, hbs_str_t223)',
            'OECD "Latest Health Spending Trends and Outlook" March 2026',
            'Commonwealth Fund "U.S. Health Care from a Global Perspective 2026"',
            'ICICI Direct Q4FY26 Titan research note; Yahoo Finance Oct 2026',
            'Reuters LVMH Q3 2026 results, 13 Oct 2026',
            'Fresenius SE Q1 2025 earnings; FME Q2 2026 earnings call',
            'Rhodium Group "No Quick Fixes: China\'s Long-Term Consumption Growth"',
            'AOF/CICC "Understanding Household Consumption in China"',
          ].map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p style={{ marginTop: 16 }}>Research run 60c9821f · 15 Oct 2026 · Not investment advice. [OBS] primary · [INF] inference · [JDG] judgment · [GAP] unavailable</p>
      </footer>
    </div>
  )
}
