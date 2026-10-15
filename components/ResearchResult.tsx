'use client'
import { useState } from 'react'

type Tab = 'overview' | 'gorilla' | 'scenarios' | 'thesis'

const VERDICT_STYLE: Record<string, React.CSSProperties> = {
  GORILLA:      { background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5' },
  SMALL_ANIMAL: { background: '#fff8c5', color: '#9a6700', border: '1px solid #f0c060' },
  PEDESTRIAN:   { background: '#f6f8fa', color: '#57606a', border: '1px solid #d0d7de' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ResearchResult({ result }: { result: Record<string, any> }) {
  const [tab, setTab] = useState<Tab>('overview')
  const a = result.analysis ?? {}
  const g = a.gorilla ?? {}
  const verdict = g.verdict ?? 'SMALL_ANIMAL'

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview',  label: 'Overview'  },
    { id: 'gorilla',   label: 'GORILLA'   },
    { id: 'scenarios', label: 'Scenarios' },
    { id: 'thesis',    label: 'Thesis'    },
  ]

  return (
    <div style={{ border: '1px solid #d0d7de', borderRadius: 10, background: '#fff', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 22px 0', borderBottom: '1px solid #eaeef2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6e7681', background: '#f6f8fa', padding: '2px 6px', borderRadius: 4, border: '1px solid #eaeef2' }}>
                {result.ticker}
              </span>
              {g.verdict && (
                <span style={{ ...VERDICT_STYLE[verdict], fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                  {verdict} {g.score}/100
                </span>
              )}
            </div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1b1f23' }}>
              {result.companyName ?? a.name ?? result.ticker}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6e7681' }}>
              {a.pipeline} · {a.asOf}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px 10px',
              border: 'none',
              borderBottom: tab === t.id ? '2px solid #0969da' : '2px solid transparent',
              background: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#0969da' : '#6e7681',
              marginBottom: -1,
              fontFamily: 'inherit',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 22px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            {/* Engel curve */}
            {a.engelCurve && (
              <div style={{ background: '#f6f8fa', border: '1px solid #eaeef2', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Engel Curve Connection
                </p>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#1b1f23' }}>{a.engelCurve.mechanism}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(a.engelCurve.economies ?? []).map((e: string) => (
                    <span key={e} style={{ fontSize: 11, background: '#ddf4ff', color: '#0969da', border: '1px solid #b6e3ff', padding: '2px 7px', borderRadius: 4 }}>{e}</span>
                  ))}
                  {(a.engelCurve.categories ?? []).map((c: { name: string; elasticity: number }) => (
                    <span key={c.name} style={{ fontSize: 11, background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5', padding: '2px 7px', borderRadius: 4 }}>
                      {c.name} ε={c.elasticity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Business franchise */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Business Franchise</p>
              <p style={{ fontSize: 13, color: '#1b1f23', lineHeight: 1.6, margin: 0 }}>{a.businessFranchise}</p>
            </div>

            {/* Financial profile */}
            {a.financialProfile && (
              <div style={{ background: '#f6f8fa', border: '1px solid #eaeef2', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Financial Signposts</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {Object.entries(a.financialProfile as Record<string, string>).map(([k, v]) => (
                    <div key={k}>
                      <span style={{ fontSize: 10, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                        {k.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <p style={{ margin: '1px 0 0', fontSize: 12, color: '#1b1f23', fontWeight: 500 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invisible layer */}
            {a.invisibleLayer && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Invisible Layer</p>
                <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.6, margin: 0 }}>{a.invisibleLayer}</p>
              </div>
            )}

            {/* Falstaffian */}
            {a.falstaffian && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Falstaffian Inversion</p>
                <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.6, margin: 0 }}>{a.falstaffian}</p>
              </div>
            )}
          </div>
        )}

        {/* GORILLA */}
        {tab === 'gorilla' && (
          <div>
            <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.6, marginBottom: 14 }}>{g.summary}</p>
            {g.marketRealityGate && (
              <div style={{ padding: '8px 12px', background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6, marginBottom: 14, fontSize: 12, color: '#9a6700' }}>
                <strong>Market-reality gate:</strong> {g.marketRealityGate}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Obvious Problem', score: g.obviousProblem, weight: '25%' },
                { label: 'Invisible Gorilla', score: g.invisibleGorilla, weight: '30%' },
                { label: 'Combinatorial Solution', score: g.combinatorialSolution, weight: '25%' },
                { label: 'Choke Point', score: g.chokePoint, weight: '20%' },
              ].map(d => (
                <div key={d.label} style={{ border: '1px solid #eaeef2', borderRadius: 6, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{d.label}</span>
                    <span style={{ fontSize: 10, color: '#6e7681' }}>{d.weight}</span>
                  </div>
                  <div style={{ height: 5, background: '#eaeef2', borderRadius: 3, marginBottom: 5 }}>
                    <div style={{ height: 5, width: `${d.score ?? 50}%`, background: (d.score ?? 50) >= 75 ? '#1a7f37' : (d.score ?? 50) >= 50 ? '#9a6700' : '#cf222e', borderRadius: 3 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15, color: '#1b1f23' }}>{d.score ?? '—'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...VERDICT_STYLE[verdict], borderRadius: 6, padding: '10px 14px' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Score: {g.score}/100 → {verdict}</span>
              <span style={{ fontSize: 12, marginLeft: 12, opacity: 0.8 }}>
                (0.25×{g.obviousProblem}) + (0.30×{g.invisibleGorilla}) + (0.25×{g.combinatorialSolution}) + (0.20×{g.chokePoint})
              </span>
            </div>
          </div>
        )}

        {/* SCENARIOS */}
        {tab === 'scenarios' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Bull', s: a.scenarios?.bull, color: '#1a7f37' },
                { label: 'Base', s: a.scenarios?.base, color: '#9a6700' },
                { label: 'Bear', s: a.scenarios?.bear, color: '#cf222e' },
              ].map(({ label, s, color }) => s && (
                <div key={label} style={{ border: `1px solid ${color}40`, borderRadius: 8, padding: '14px 16px', background: `${color}06` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color, fontSize: 14 }}>{label}</span>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', background: `${color}18`, color, padding: '2px 6px', borderRadius: 4 }}>
                      p={s.probability}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#1b1f23' }}>{s.keyMetric}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#57606a', lineHeight: 1.5 }}>{s.description}</p>
                </div>
              ))}
            </div>

            {/* Falsifiable predictions */}
            {a.predictions && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
                  Falsifiable Predictions
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #d0d7de' }}>
                      {['Event', 'p', 'Horizon', 'Refuted by'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '5px 10px 6px 0', fontSize: 10, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(a.predictions as { event: string; probability: number; horizon: string; refutes: string }[]).map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eaeef2' }}>
                        <td style={{ padding: '5px 10px 5px 0' }}>{p.event}</td>
                        <td style={{ padding: '5px 10px 5px 0', fontFamily: 'monospace', fontWeight: 700 }}>{p.probability}</td>
                        <td style={{ padding: '5px 10px 5px 0', color: '#6e7681' }}>{p.horizon}</td>
                        <td style={{ padding: '5px 0', color: '#cf222e', fontSize: 11 }}>{p.refutes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* THESIS */}
        {tab === 'thesis' && (
          <div>
            {a.thesis && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: a.thesis.supported ? '#1a7f37' : '#cf222e' }}>
                    {a.thesis.supported ? '✓ Evidence supports a thesis' : '✗ Evidence does not support a thesis'}
                  </span>
                </div>

                {[
                  { pillar: '1 — Business Franchise', text: a.thesis.franchise },
                  { pillar: '2 — Management Quality', text: a.thesis.management },
                  { pillar: '3 — Valuation', text: a.thesis.valuation },
                ].map(p => p.text && (
                  <div key={p.pillar} style={{ marginBottom: 12, padding: '12px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                    <p style={{ margin: '0 0 5px', fontWeight: 600, fontSize: 13 }}>{p.pillar}</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.6 }}>{p.text}</p>
                  </div>
                ))}

                {a.thesis.priceConclusion && (
                  <div style={{ background: '#ddf4ff', border: '1px solid #b6e3ff', borderRadius: 6, padding: '12px 14px', marginBottom: 12 }}>
                    <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: 12, color: '#0969da' }}>Price conclusion</p>
                    <p style={{ margin: 0, fontSize: 13, color: '#1b1f23' }}>{a.thesis.priceConclusion}</p>
                  </div>
                )}

                {a.falsifiers && (
                  <div style={{ background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6, padding: '12px 14px' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 12, color: '#9a6700' }}>Key falsifiers</p>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {(a.falsifiers as string[]).map((f, i) => (
                        <li key={i} style={{ fontSize: 12, color: '#57606a', marginBottom: 4, lineHeight: 1.5 }}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {a.dataGaps && a.dataGaps.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Data gaps</p>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(a.dataGaps as string[]).map((g, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#6e7681', marginBottom: 3 }}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            <p style={{ fontSize: 11, color: '#afb8c1', marginTop: 14, textAlign: 'right' }}>
              Not investment advice · {a.pipeline}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
