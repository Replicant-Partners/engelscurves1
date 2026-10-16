'use client'
import dynamic from 'next/dynamic'
import TabNav from '@/components/TabNav'

const IncomeGrowthChart      = dynamic(() => import('@/components/IncomeGrowthChart'),      { ssr: false })
const EngelCurveChart        = dynamic(() => import('@/components/EngelCurveChart'),        { ssr: false })
const ChinaSpendingChart     = dynamic(() => import('@/components/ChinaSpendingChart'),     { ssr: false })
const IndustryChains         = dynamic(() => import('@/components/IndustryChains'),         { ssr: false })
const ScenarioTree           = dynamic(() => import('@/components/ScenarioTree'),           { ssr: false })
const DataGapsTable          = dynamic(() => import('@/components/DataGapsTable'),          { ssr: false })
const LiveQuotes             = dynamic(() => import('@/components/LiveQuotes'),             { ssr: false })
const LiveRevenueChart       = dynamic(() => import('@/components/LiveRevenueChart'),       { ssr: false })
const BudgetSankeyChart      = dynamic(() => import('@/components/BudgetSankeyChart'),      { ssr: false })
const WardleyEvolutionChart  = dynamic(() => import('@/components/WardleyEvolutionChart'),  { ssr: false })
const MacroProbabilities     = dynamic(() => import('@/components/MacroProbabilities'),     { ssr: false })

const BADGES = [
  { label: 'OBS', bg: '#e6f4ea', color: '#1a7f37', border: '#a8d5b5' },
  { label: 'INF', bg: '#fff8c5', color: '#9a6700', border: '#f0c060' },
  { label: 'JDG', bg: '#ddf4ff', color: '#0969da', border: '#b6e3ff' },
  { label: 'GAP', bg: '#f6f8fa', color: '#57606a', border: '#d0d7de' },
]

const TH: React.CSSProperties = { textAlign: 'left', padding: '6px 16px 8px 0', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }
const TD: React.CSSProperties = { padding: '7px 16px 7px 0', borderBottom: '1px solid #eaeef2', verticalAlign: 'top', fontSize: 13 }

const Sec = ({ n, title, sub, children }: { n: string; title: string; sub?: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 56 }}>
    <h2 className="obs-h2">{n} — {title}</h2>
    {sub && <p className="obs-byline">{sub}</p>}
    {children}
  </section>
)

export default function GlobalAnalysis() {
  return (
    <div className="obs-notebook">
      <header style={{ paddingTop: 48 }}>
        <TabNav />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginBottom: 28 }}>
          {BADGES.map((b) => (
            <span key={b.label} className="obs-badge" style={{ background: b.bg, color: b.color, borderColor: b.border }}>{b.label}</span>
          ))}
          <span style={{ fontSize: 12, color: '#6e7681', alignSelf: 'center' }}>
            OBS = primary source · INF = model inference · JDG = analyst judgment · GAP = evidence unavailable
          </span>
        </div>
        <h1 className="obs-h1">Engel-Curve Shifts, Industry Growth &amp; Equity Prices</h1>
        <p className="obs-byline" style={{ marginTop: 6 }}>
          Research run <code style={{ fontFamily: 'monospace', fontSize: 12, background: '#f6f8fa', padding: '1px 5px', borderRadius: 4 }}>60c9821f</code>
          &nbsp;· 15 Oct 2026 · Evidence-led cross-economy pass · Not investment advice
        </p>
        <p className="obs-body obs-prose" style={{ color: '#57606a' }}>
          As household income rises, spending shares shift from necessities toward luxuries — Engel&apos;s Law, formalised in 1857. This analysis traces that mechanism across five major economies (USA, China, India, Germany, Brazil), ranks four industry chains by tailwind strength, and asks whether current equity prices already reflect the structural shift.
        </p>
      </header>

      <Sec n="1" title="The Economic Mechanism" sub="Three distinctions the evidence requires">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { type: 'Inferior goods', badge: 'ε_Y < 0',    color: '#e15759', desc: 'Absolute spending falls as income rises. Budget share falls sharply. Example: cheap staple grains.' },
            { type: 'Necessities',    badge: '0 < ε_Y < 1', color: '#f28e2b', desc: 'Spending rises but slower than income. Budget share falls. Example: food, basic clothing.' },
            { type: 'Luxuries',       badge: 'ε_Y > 1',    color: '#4e79a7', desc: 'Spending rises faster than income. Budget share rises. Example: healthcare, education, travel.' },
          ].map((c) => (
            <div key={c.type} style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{c.type}</span>
                <code style={{ fontSize: 11, background: c.color + '18', color: c.color, padding: '1px 6px', borderRadius: 4, border: `1px solid ${c.color}30` }}>{c.badge}</code>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.55 }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="obs-cell obs-prose">
          spending levels ≠ budget shares &nbsp;·&nbsp; cross-section ≠ longitudinal &nbsp;·&nbsp; price effects ≠ income elasticity
        </div>
        <p className="obs-caption">
          Methodological warning [OBS]: De Vreyer et al. (World Bank Economic Review 2025 / NBER WP26850) show standard household Engel curves overestimate food income elasticity by up to 43% due to intra-household heterogeneity.
        </p>
      </Sec>

      <Sec n="2" title="Economy Income Trajectories" sub="GDP per capita PPP (constant 2021 $) · World Bank NY.GDP.PCAP.PP.KD · 2000–2024 [OBS]">
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
                <span style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</span>
              </div>
              <p style={{ margin: '0 0 2px', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: e.color }}>{e.cagr}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6e7681' }}>{e.note}</p>
            </div>
          ))}
        </div>
      </Sec>

      <Sec n="3" title="The Engel Curve" sub="Food budget share (%) vs. GDP per capita PPP — 207-country reference curve + observed economy points">
        <EngelCurveChart />
        <p className="obs-caption" style={{ marginTop: 12 }}>
          Reference curve: PERI WP247 "Engel&apos;s Law Around the World 150 Years Later" (207 countries) [OBS].
        </p>
      </Sec>

      <Sec n="4" title="China Household Spending 2023" sub="NBS Press Release, 18 Jan 2024 [OBS]">
        <ChinaSpendingChart />
      </Sec>

      <Sec n="5" title="Cross-Economy Evidence Table" sub="One pass · Dated · Gaps declared, not filled">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d0d7de' }}>
                {['Economy', 'Income 2024', 'Food share', 'Healthcare', 'Key shift observed', 'Data year'].map(h => <th key={h} style={TH}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'India',   color: '#f28e2b', income: '$9,416',  food: '~47% rural [OBS]', health: 'GAP',         shift: 'Non-food share +5.9pp rural; Gini declining',    year: 'HCES 2023-24' },
                { name: 'China',   color: '#e15759', income: '$23,841', food: '29.8% [OBS]',      health: '9.2% [OBS]',  shift: 'Healthcare +16%, Education +16.4% YoY',         year: 'NBS 2023' },
                { name: 'USA',     color: '#4e79a7', income: '$75,698', food: '~13% [INF]',       health: '18% GDP [OBS]', shift: 'Lowest quintile income +6.8% (2022–24)',       year: 'BLS CEX 2024' },
                { name: 'Germany', color: '#59a14f', income: '$62,655', food: '~13.9% [OBS]',    health: '9.3% GDP [OBS]', shift: 'GKV spending +7.8% 2025; aging-driven',       year: 'Eurostat HBS 2020' },
                { name: 'Brazil',  color: '#b07aa1', income: '$19,652', food: 'GAP',             health: 'GAP',           shift: 'Income flat since 2013; no Engel shift evidenced', year: 'WB 2024' },
              ].map((r) => (
                <tr key={r.name} style={{ borderBottom: '1px solid #eaeef2' }}>
                  <td style={TD}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} /><strong>{r.name}</strong></span></td>
                  <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 600 }}>{r.income}</td>
                  <td style={TD}>{r.food === 'GAP' ? <span style={{ color: '#afb8c1', fontStyle: 'italic' }}>unavailable</span> : r.food}</td>
                  <td style={TD}>{r.health === 'GAP' ? <span style={{ color: '#afb8c1', fontStyle: 'italic' }}>unavailable</span> : r.health}</td>
                  <td style={{ ...TD, maxWidth: 220 }}>{r.shift}</td>
                  <td style={{ ...TD, fontSize: 12, color: '#6e7681' }}>{r.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>

      <section style={{ marginBottom: 56 }}>
        <h2 className="obs-h2">Live Market Data</h2>
        <p className="obs-byline">EODHD real-time · 5-minute cache · Static fallback</p>
        <LiveQuotes />
        <LiveRevenueChart />
      </section>

      <Sec n="6" title="Ranked Industry–Economy Chains" sub="Four chains with strongest plausible tailwind — with falsifiers">
        <IndustryChains />
      </Sec>

      <Sec n="7" title="Scenario Tree — China Income Trajectory" sub="[JDG] — illustrative structure, not a forecast">
        <ScenarioTree />
      </Sec>

      {/* ── P5: Sankey ───────────────────────────────────────── */}
      <Sec n="8" title="Household Budget Shift — Sankey" sub="How the family budget redistributes as income rises from $10k → $20k PPP · Priority 5: sankey-flow skill [OBS]">
        <BudgetSankeyChart />
      </Sec>

      {/* ── P4: Wardley ──────────────────────────────────────── */}
      <Sec n="9" title="Wardley Evolution by Income Level" sub="How spending categories evolve (Genesis → Commodity) as household income rises · Priority 4: wardley-mapper framework [INF]">
        <WardleyEvolutionChart />
      </Sec>

      {/* ── P6: CMP / Macro probabilities ─────────────────────────── */}
      <Sec n="10" title="Calibrated Macro Probabilities" sub="Superforecasting pipeline (Tetlock 2015) on key Engel curve inflection questions · Priority 6: scenario_calibrate [OBS]">
        <MacroProbabilities />
      </Sec>

      <Sec n="11" title="Data Gaps" sub="Declared, not substituted">
        <DataGapsTable />
      </Sec>

      <footer style={{ borderTop: '1px solid #d0d7de', paddingTop: 24, marginTop: 16, fontSize: 11, color: '#6e7681' }}>
        <p>Research run 60c9821f · 15 Oct 2026 · Not investment advice. [OBS] primary · [INF] inference · [JDG] judgment · [GAP] unavailable</p>
      </footer>
    </div>
  )
}
