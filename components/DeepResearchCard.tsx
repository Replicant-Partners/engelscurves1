'use client'
import { useState } from 'react'
import type { CompanyReport } from '@/data/companyReports'

const VERDICT_STYLE: Record<string, React.CSSProperties> = {
  GORILLA:     { background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5' },
  SMALL_ANIMAL:{ background: '#fff8c5', color: '#9a6700', border: '1px solid #f0c060' },
  PEDESTRIAN:  { background: '#f6f8fa', color: '#57606a', border: '1px solid #d0d7de' },
}

const MOAT_LABEL: Record<string, string> = { wide: 'Wide moat', narrow: 'Narrow moat', none: 'No moat' }
const MGMT_LABEL: Record<string, string> = { excellent: 'Excellent', good: 'Good', average: 'Average', poor: 'Poor' }

type Tab = 'overview' | 'gorilla' | 'valuation' | 'scenarios' | 'thesis'

export default function DeepResearchCard({ report }: { report: CompanyReport }) {
  const [tab, setTab] = useState<Tab>('overview')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview',   label: 'Overview'   },
    { id: 'gorilla',    label: 'GORILLA'    },
    { id: 'valuation',  label: 'Valuation'  },
    { id: 'scenarios',  label: 'Scenarios'  },
    { id: 'thesis',     label: 'Thesis'     },
  ]

  const up = report.price > 0
  const gap = report.valuation.expectationsGapPp
  const gapUp = gap < 0 // negative gap = price demands less than demonstrated = favorable

  return (
    <div style={{ border: '1px solid #d0d7de', borderRadius: 10, background: '#fff', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #eaeef2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6e7681', background: '#f6f8fa', padding: '2px 6px', borderRadius: 4, border: '1px solid #eaeef2' }}>{report.ticker}</span>
              <span style={{ fontSize: 11, ...VERDICT_STYLE[report.gorilla.verdict], padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                {report.gorilla.verdict} {report.gorilla.score}/100
              </span>
              <span style={{ fontSize: 11, background: '#ddf4ff', color: '#0969da', border: '1px solid #b6e3ff', padding: '2px 8px', borderRadius: 20 }}>
                {MOAT_LABEL[report.moat]}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1b1f23' }}>{report.name}</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6e7681' }}>
              {report.exchange} · {report.asOf} · {report.pipeline.split(' ')[0]}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: '#1b1f23', lineHeight: 1 }}>
              {report.currency} {report.price.toLocaleString()}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6e7681' }}>Market cap ${report.marketCapBn}B</p>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, marginTop: 4 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 16px 10px',
                border: 'none',
                borderBottom: tab === t.id ? '2px solid #0969da' : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: tab === t.id ? 600 : 400,
                color: tab === t.id ? '#0969da' : '#6e7681',
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: '20px 24px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            {/* Engel curve connection */}
            <div style={{ background: '#f6f8fa', border: '1px solid #eaeef2', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
              <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Engel Curve Connection
              </p>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#1b1f23' }}>{report.engelCurveConnection.mechanism}</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {report.engelCurveConnection.spendingCategories.map((c) => (
                  <span key={c.category} style={{ fontSize: 12, background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5', padding: '2px 8px', borderRadius: 4 }}>
                    {c.category} ε={c.elasticity}
                  </span>
                ))}
              </div>
            </div>

            {/* Revenue chart (simple bars) */}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Revenue (USD billions) — Level 1 audited</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 16, height: 80 }}>
              {report.financials.revenue.map((r) => {
                const maxRev = Math.max(...report.financials.revenue.map((x) => x.value))
                const height = (r.value / maxRev) * 72
                return (
                  <div key={r.year} style={{ flex: 1, textAlign: 'center' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#4e79a7' }}>${r.value}B</p>
                    <div style={{ height, background: '#4e79a7', borderRadius: '3px 3px 0 0', opacity: 0.85 }} />
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6e7681' }}>{r.year}</p>
                  </div>
                )
              })}
            </div>

            {/* Key metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { label: 'Revenue CAGR', value: `${(report.financials.revenueCAGR * 100).toFixed(1)}%`, note: '4-year [OBS]' },
                { label: 'Gross margin', value: `${(report.financials.grossMargin * 100).toFixed(1)}%`, note: 'FY2025' },
                { label: 'Free cash flow', value: `$${report.financials.freeCashFlowBn}B`, note: 'FY2025' },
                { label: 'ROIC', value: `${(report.financials.roic * 100).toFixed(1)}%`, note: 'FY2025' },
              ].map((m) => (
                <div key={m.label} style={{ background: '#f6f8fa', borderRadius: 6, padding: '10px 12px', border: '1px solid #eaeef2' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 10, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{m.label}</p>
                  <p style={{ margin: '0 0 1px', fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: '#1b1f23' }}>{m.value}</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#afb8c1' }}>{m.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GORILLA */}
        {tab === 'gorilla' && (
          <div>
            <p style={{ fontSize: 13, color: '#57606a', marginBottom: 16, lineHeight: 1.6 }}>
              <strong style={{ color: '#1b1f23' }}>GORILLA framework</strong> (Moore, Johnson &amp; Kippola, 1998): companies that dominate category-defining markets through four dimensions — Obvious Problem, Invisible Gorilla, Combinatorial Solution, Choke Point. Fixed weights. Score ≥75 = GORILLA.
            </p>
            <p style={{ fontSize: 13, color: '#57606a', marginBottom: 20 }}>{report.gorilla.summary}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Obvious Problem', score: report.gorilla.dimensions.obviousProblem, weight: '25%', desc: 'Is the problem real, large and urgent?' },
                { label: 'Invisible Gorilla', score: report.gorilla.dimensions.invisibleGorilla, weight: '30%', desc: 'What advantage does the market overlook?' },
                { label: 'Combinatorial Solution', score: report.gorilla.dimensions.combinatorialSolution, weight: '25%', desc: 'Do multiple solution elements reinforce each other?' },
                { label: 'Choke Point', score: report.gorilla.dimensions.chokePoint, weight: '20%', desc: 'What locks competitors out?' },
              ].map((d) => (
                <div key={d.label} style={{ border: '1px solid #eaeef2', borderRadius: 6, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{d.label}</span>
                    <span style={{ fontSize: 11, color: '#6e7681' }}>weight {d.weight}</span>
                  </div>
                  <div style={{ height: 6, background: '#eaeef2', borderRadius: 3, marginBottom: 6 }}>
                    <div style={{ height: 6, width: `${d.score}%`, background: d.score >= 75 ? '#1a7f37' : d.score >= 50 ? '#9a6700' : '#cf222e', borderRadius: 3 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#6e7681' }}>{d.desc}</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14 }}>{d.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, background: VERDICT_STYLE[report.gorilla.verdict].background, border: VERDICT_STYLE[report.gorilla.verdict].border, borderRadius: 6, padding: '12px 16px' }}>
              <span style={{ fontWeight: 700, color: VERDICT_STYLE[report.gorilla.verdict].color, fontSize: 14 }}>
                Score: {report.gorilla.score}/100 → {report.gorilla.verdict}
              </span>
              <span style={{ fontSize: 12, color: '#6e7681', marginLeft: 12 }}>Fixed-weight: (0.25×{report.gorilla.dimensions.obviousProblem}) + (0.30×{report.gorilla.dimensions.invisibleGorilla}) + (0.25×{report.gorilla.dimensions.combinatorialSolution}) + (0.20×{report.gorilla.dimensions.chokePoint}) = {report.gorilla.score}</span>
            </div>
          </div>
        )}

        {/* VALUATION */}
        {tab === 'valuation' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>DCF Intrinsic Value</p>
                <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: '#1a7f37', lineHeight: 1 }}>${report.valuation.dcfIntrinsic.toLocaleString()}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#afb8c1' }}>15% investor target return · audited inputs</p>
              </div>
              <div style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '16px 18px' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Expectations Gap</p>
                <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: 28, fontWeight: 700, color: gapUp ? '#1a7f37' : '#cf222e', lineHeight: 1 }}>
                  {gap > 0 ? '+' : ''}{gap.toFixed(1)}pp
                </p>
                <p style={{ margin: 0, fontSize: 11, color: '#afb8c1' }}>
                  {gapUp ? '✓ Price demands less than demonstrated' : '⚠ Price demands more than demonstrated'}
                </p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d0d7de' }}>
                  {['Metric', 'Value', 'Source'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 16px 8px 0', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Current price', value: `$${report.price.toLocaleString()}`, source: 'EODHD live [OBS]' },
                  { metric: 'DCF intrinsic', value: `$${report.valuation.dcfIntrinsic.toLocaleString()}`, source: 'kask dcf_valuation [OBS tool]' },
                  { metric: 'Implied growth (reverse DCF)', value: `${(report.valuation.impliedGrowth * 100).toFixed(1)}%`, source: 'kask reverse_dcf [OBS tool]' },
                  { metric: 'Demonstrated CAGR', value: `${(report.valuation.demonstratedGrowth * 100).toFixed(1)}%`, source: 'FMP audited statements [OBS]' },
                  { metric: 'Expectations gap', value: `${report.valuation.expectationsGapPp.toFixed(1)}pp`, source: 'kask expectations_gap [OBS tool]' },
                  { metric: 'P/E ratio', value: `${report.valuation.peRatio.toFixed(1)}×`, source: 'kask key_metrics [OBS]' },
                  { metric: 'P/S ratio', value: `${report.valuation.psRatio.toFixed(1)}×`, source: 'kask key_metrics [OBS]' },
                  { metric: 'EV/EBITDA', value: `${report.valuation.evEbitda.toFixed(1)}×`, source: 'kask key_metrics [OBS]' },
                ].map((r) => (
                  <tr key={r.metric} style={{ borderBottom: '1px solid #eaeef2' }}>
                    <td style={{ padding: '6px 16px 6px 0', fontWeight: 500 }}>{r.metric}</td>
                    <td style={{ padding: '6px 16px 6px 0', fontFamily: 'monospace', fontWeight: 600 }}>{r.value}</td>
                    <td style={{ padding: '6px 0', fontSize: 11, color: '#6e7681' }}>{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SCENARIOS */}
        {tab === 'scenarios' && (
          <div>
            <p style={{ fontSize: 12, color: '#6e7681', marginBottom: 16 }}>Horizon: {report.scenarios.horizon} · Probabilities [JDG] — illustrative, not a forecast</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Bull', s: report.scenarios.bull, color: '#1a7f37' },
                { label: 'Base', s: report.scenarios.base, color: '#9a6700' },
                { label: 'Bear', s: report.scenarios.bear, color: '#cf222e' },
              ].map(({ label, s, color }) => (
                <div key={label} style={{ border: `1px solid ${color}40`, borderRadius: 8, padding: '14px 16px', background: `${color}06` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color, fontSize: 14 }}>{label}</span>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', background: `${color}18`, color, padding: '2px 6px', borderRadius: 4 }}>p={s.probability}</span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontWeight: 700, fontSize: 15, color: '#1b1f23' }}>{s.revenue}</p>
                  <p style={{ margin: '0 0 8px', fontSize: 12, color: '#6e7681' }}>EBIT {s.ebitMargin}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#57606a', lineHeight: 1.5 }}>{s.assumption}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Falsifiable Predictions</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #d0d7de' }}>
                  {['Event', 'p', 'Horizon', 'Refuted by'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '5px 12px 7px 0', fontSize: 10, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.predictions.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eaeef2' }}>
                    <td style={{ padding: '6px 12px 6px 0' }}>{p.event}</td>
                    <td style={{ padding: '6px 12px 6px 0', fontFamily: 'monospace', fontWeight: 700 }}>{p.probability}</td>
                    <td style={{ padding: '6px 12px 6px 0', color: '#6e7681' }}>{p.horizon}</td>
                    <td style={{ padding: '6px 0', color: '#cf222e', fontSize: 11 }}>{p.refutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* THESIS */}
        {tab === 'thesis' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: report.thesis.supported ? '#1a7f37' : '#cf222e' }}>
                {report.thesis.supported ? '✓ Evidence supports a thesis' : '✗ Evidence does not support a thesis'}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.65, marginBottom: 20 }}>{report.thesis.conclusion}</p>

            {[
              { pillar: '1 — Business Franchise', text: report.thesis.franchise },
              { pillar: '2 — Management Quality', text: report.thesis.management },
              { pillar: '3 — Valuation', text: report.thesis.valuationNote },
            ].map((p) => (
              <div key={p.pillar} style={{ marginBottom: 16, padding: '14px 16px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 13, color: '#1b1f23' }}>{p.pillar}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.6 }}>{p.text}</p>
              </div>
            ))}

            <div style={{ background: '#ddf4ff', border: '1px solid #b6e3ff', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
              <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 12, color: '#0969da' }}>Price conclusion (as of {report.asOf})</p>
              <p style={{ margin: 0, fontSize: 13, color: '#1b1f23' }}>{report.thesis.priceConclusion}</p>
            </div>

            <div style={{ background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6, padding: '12px 16px' }}>
              <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 12, color: '#9a6700' }}>Key falsifiers (what would break the thesis)</p>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {report.falsifiers.map((f, i) => (
                  <li key={i} style={{ fontSize: 12, color: '#57606a', marginBottom: 4, lineHeight: 1.5 }}>{f}</li>
                ))}
              </ul>
            </div>

            <p style={{ fontSize: 11, color: '#afb8c1', marginTop: 12, textAlign: 'right' }}>
              Not investment advice · Not investment-grade · Pipeline: {report.pipeline}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
