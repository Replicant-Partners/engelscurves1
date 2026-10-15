'use client'
import { useState } from 'react'

type Tab = 'overview' | 'gorilla' | 'scenarios' | 'thesis' | 'listen'

const VERDICT_STYLE: Record<string, React.CSSProperties> = {
  GORILLA:      { background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5' },
  SMALL_ANIMAL: { background: '#fff8c5', color: '#9a6700', border: '1px solid #f0c060' },
  PEDESTRIAN:   { background: '#f6f8fa', color: '#57606a', border: '1px solid #d0d7de' },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ResearchResult({ result }: { result: Record<string, any> }) {
  const [tab, setTab] = useState<Tab>('overview')
  const a = result.analysis ?? result  // handle both wrapped and flat
  const g = a.gorilla ?? {}
  const t = a.thesis ?? {}
  const im = a.imagine ?? {}
  const lv = a.listeningView ?? {}
  const verdict = g.verdict ?? 'SMALL_ANIMAL'
  const ec = a.engelCurve ?? t.engelCurve ?? {}

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview',  label: 'Overview'   },
    { id: 'gorilla',   label: 'GORILLA'    },
    { id: 'scenarios', label: 'IMAGINE'    },
    { id: 'thesis',    label: 'Thesis'     },
    { id: 'listen',    label: 'LISTEN'     },
  ]

  return (
    <div style={{ border: '1px solid #d0d7de', borderRadius: 10, background: '#fff', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 22px 0', borderBottom: '1px solid #eaeef2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6e7681', background: '#f6f8fa', padding: '2px 6px', borderRadius: 4, border: '1px solid #eaeef2' }}>
                {a.ticker ?? result.ticker}
              </span>
              {g.verdict && (
                <span style={{ ...VERDICT_STYLE[verdict], fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                  🦍 {verdict} {g.score}/100
                </span>
              )}
              {a.imagine?.digitalStage && (
                <span style={{ fontSize: 11, background: '#ddf4ff', color: '#0969da', border: '1px solid #b6e3ff', padding: '2px 7px', borderRadius: 4 }}>
                  {a.imagine.digitalStage} stage
                </span>
              )}
            </div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1b1f23' }}>
              {a.name ?? result.companyName ?? result.ticker}
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6e7681' }}>
              {a.pipeline} · {a.asOf}
              {a.price && <span> · {a.currency} {Number(a.price).toFixed(2)}</span>}
            </p>
          </div>
          {a.valuation && (
            <div style={{ textAlign: 'right', fontSize: 12, color: '#6e7681' }}>
              {a.valuation.peRatio && <p style={{ margin: 0 }}>P/E {Number(a.valuation.peRatio).toFixed(1)}×</p>}
              {a.valuation.pbRatio && <p style={{ margin: 0 }}>P/B {Number(a.valuation.pbRatio).toFixed(2)}×</p>}
              {a.valuation.roe && <p style={{ margin: 0 }}>ROE {(Number(a.valuation.roe) * 100).toFixed(1)}%</p>}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 14px 10px', border: 'none',
              borderBottom: tab === t.id ? '2px solid #0969da' : '2px solid transparent',
              background: 'none', cursor: 'pointer', fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? '#0969da' : '#6e7681',
              marginBottom: -1, fontFamily: 'inherit',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 22px' }}>

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            {/* Engel Curve */}
            {(ec.mechanism || ec.economies?.length) && (
              <div style={{ background: '#f6f8fa', border: '1px solid #eaeef2', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Engel Curve Connection</p>
                <p style={{ margin: '0 0 8px', fontSize: 13, color: '#1b1f23', lineHeight: 1.6 }}>{ec.mechanism}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(ec.economies ?? []).map((e: string) => <span key={e} style={{ fontSize: 11, background: '#ddf4ff', color: '#0969da', border: '1px solid #b6e3ff', padding: '2px 7px', borderRadius: 4 }}>{e}</span>)}
                  {(ec.categories ?? []).map((c: {name: string; elasticity: number}) => <span key={c.name} style={{ fontSize: 11, background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5', padding: '2px 7px', borderRadius: 4 }}>{c.name} ε={c.elasticity}</span>)}
                </div>
              </div>
            )}

            {/* Business Franchise */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Business Franchise</p>
              <p style={{ fontSize: 13, color: '#1b1f23', lineHeight: 1.65, margin: 0 }}>{a.businessFranchise}</p>
            </div>

            {/* Management Skill */}
            {a.managementSkill && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Management Skill</p>
                <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.65, margin: 0 }}>{a.managementSkill}</p>
              </div>
            )}

            {/* Financial Profile */}
            {a.financialProfile && (
              <div style={{ background: '#f6f8fa', border: '1px solid #eaeef2', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Financial Signposts</p>
                <p style={{ margin: 0, fontSize: 13, color: '#1b1f23', lineHeight: 1.65 }}>{a.financialProfile}</p>
              </div>
            )}

            {/* Two-column: Invisible + Falstaffian */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {a.invisibleLayer && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Invisible Layer</p>
                  <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.6, margin: 0 }}>{a.invisibleLayer}</p>
                </div>
              )}
              {a.falstaffian?.insight && (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Falstaffian Insight</p>
                  <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.6, margin: 0 }}>{a.falstaffian.insight}</p>
                  {a.falstaffian.shapesApplied && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(a.falstaffian.shapesApplied as string[]).map((s: string) => (
                        <span key={s} style={{ fontSize: 10, background: '#f6f8fa', border: '1px solid #d0d7de', padding: '1px 6px', borderRadius: 10, color: '#6e7681' }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── GORILLA ──────────────────────────────────────────────────── */}
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
                { label: '1. Obvious Problem',       key: 'obviousProblem',       weight: '25%', detail: (g.details?.obviousProblem as Record<string,unknown>)?.rationale },
                { label: '2. Invisible Gorilla',     key: 'invisibleGorilla',     weight: '30%', detail: (g.details?.invisibleGorilla as Record<string,unknown>)?.whatMarketMisses },
                { label: '3. Combinatorial Solution',key: 'combinatorialSolution',weight: '25%', detail: ((g.details?.combinatorialSolution as Record<string,unknown>)?.components as string[])?.join(' × ') },
                { label: '4. Choke Point',           key: 'chokePoint',           weight: '20%', detail: (g.details?.chokePoint as Record<string,unknown>)?.lockoutMechanism },
              ].map(d => {
                const score = Number(g[d.key as keyof typeof g] ?? 50)
                return (
                  <div key={d.label} style={{ border: '1px solid #eaeef2', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{d.label}</span>
                      <span style={{ fontSize: 10, color: '#6e7681' }}>{d.weight}</span>
                    </div>
                    <div style={{ height: 5, background: '#eaeef2', borderRadius: 3, marginBottom: 6 }}>
                      <div style={{ height: 5, width: `${score}%`, background: score >= 75 ? '#1a7f37' : score >= 50 ? '#9a6700' : '#cf222e', borderRadius: 3 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ margin: 0, fontSize: 11, color: '#6e7681', flex: 1, lineHeight: 1.4 }}>{String(d.detail ?? '')}</p>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 16, marginLeft: 8 }}>{score}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ ...VERDICT_STYLE[verdict], borderRadius: 6, padding: '10px 14px', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Score: {g.score}/100 → {verdict}</span>
              <span style={{ fontSize: 11, marginLeft: 12, opacity: 0.8 }}>
                (0.25×{g.obviousProblem}) + (0.30×{g.invisibleGorilla}) + (0.25×{g.combinatorialSolution}) + (0.20×{g.chokePoint}) — fixed weights (CRD-2)
              </span>
            </div>

            {/* Framing errors from Falstaffian */}
            {a.falstaffian?.framingErrors?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Framing errors (Falstaffian rotation)</p>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(a.falstaffian.framingErrors as string[]).map((e: string, i: number) => (
                    <li key={i} style={{ fontSize: 12, color: '#57606a', marginBottom: 4, lineHeight: 1.5 }}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ── IMAGINE ──────────────────────────────────────────────────── */}
        {tab === 'scenarios' && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {im.digitalStage && <span style={{ fontSize: 12, background: '#ddf4ff', color: '#0969da', border: '1px solid #b6e3ff', padding: '3px 10px', borderRadius: 4 }}>Stage: {im.digitalStage}</span>}
              {im.growthDriver && <span style={{ fontSize: 12, background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5', padding: '3px 10px', borderRadius: 4 }}>Driver: {im.growthDriver}</span>}
            </div>

            {im.scenarios && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Bull', s: (im.scenarios as Record<string, unknown>).bull, color: '#1a7f37' },
                  { label: 'Base', s: (im.scenarios as Record<string, unknown>).base, color: '#9a6700' },
                  { label: 'Bear', s: (im.scenarios as Record<string, unknown>).bear, color: '#cf222e' },
                ].map(({ label, s, color }) => {
                  const sc = s as Record<string, unknown>
                  return sc ? (
                    <div key={label} style={{ border: `1px solid ${color}40`, borderRadius: 8, padding: '14px 16px', background: `${color}06` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, color, fontSize: 14 }}>{label}</span>
                        <span style={{ fontSize: 11, fontFamily: 'monospace', background: `${color}18`, color, padding: '2px 6px', borderRadius: 4 }}>p={String(sc.probability ?? '')}</span>
                      </div>
                      {!!sc.revenue5Y && <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#1b1f23' }}>Rev: {String(sc.revenue5Y)} · Margin: {String(sc.margin5Y ?? '')}</p>}
                      <p style={{ margin: '0 0 6px', fontSize: 12, color: '#57606a', lineHeight: 1.5 }}>{sc.description as string}</p>
                      {!!sc.assumption && <p style={{ margin: 0, fontSize: 11, color: '#6e7681', fontStyle: 'italic' }}>Key: {sc.assumption as string}</p>}
                    </div>
                  ) : null
                })}
              </div>
            )}

            {im.predictions && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Falsifiable Predictions (CRD-3)</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #d0d7de' }}>
                      {['Event', 'p', 'Horizon', 'Confirms', 'Refuted by'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '5px 8px 6px 0', fontSize: 10, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(im.predictions as Record<string, unknown>[]).map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eaeef2' }}>
                        <td style={{ padding: '5px 8px 5px 0' }}>{p.event as string}</td>
                        <td style={{ padding: '5px 8px 5px 0', fontFamily: 'monospace', fontWeight: 700, color: Number(p.probability) >= 0.65 ? '#1a7f37' : '#9a6700' }}>{p.probability as string}</td>
                        <td style={{ padding: '5px 8px 5px 0', color: '#6e7681' }}>{p.horizon as string}</td>
                        <td style={{ padding: '5px 8px 5px 0', fontSize: 11, color: '#1a7f37' }}>{p.confirms as string}</td>
                        <td style={{ padding: '5px 0', fontSize: 11, color: '#cf222e' }}>{p.refutes as string}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {(im.notOnPage || im.notInPrice) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {im.notOnPage && (
                  <div style={{ padding: '10px 12px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#6e7681' }}>Not on the page</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#57606a', lineHeight: 1.5 }}>{im.notOnPage as string}</p>
                  </div>
                )}
                {im.notInPrice && (
                  <div style={{ padding: '10px 12px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#6e7681' }}>Not in the price</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#57606a', lineHeight: 1.5 }}>{im.notInPrice as string}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── THESIS ───────────────────────────────────────────────────── */}
        {tab === 'thesis' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.supported ? '#1a7f37' : '#cf222e' }}>
                {t.supported ? '✓ Evidence supports a thesis' : '✗ Evidence does not support a thesis'}
              </span>
            </div>

            {t.thesisStatement && (
              <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.65, marginBottom: 18, padding: '12px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                {t.thesisStatement}
              </p>
            )}

            {[
              { pillar: '1 — Business Franchise', text: t.franchise },
              { pillar: '2 — Management Quality', text: t.management },
              { pillar: '3 — Valuation',          text: t.valuation },
            ].map(p => p.text && (
              <div key={p.pillar} style={{ marginBottom: 12, padding: '12px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                <p style={{ margin: '0 0 5px', fontWeight: 600, fontSize: 13 }}>{p.pillar}</p>
                <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.65 }}>{p.text}</p>
              </div>
            ))}

            {t.priceConclusion && (
              <div style={{ background: '#ddf4ff', border: '1px solid #b6e3ff', borderRadius: 6, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: 12, color: '#0969da' }}>Price conclusion</p>
                <p style={{ margin: 0, fontSize: 13, color: '#1b1f23' }}>{t.priceConclusion}</p>
              </div>
            )}

            {t.falsifiers?.length > 0 && (
              <div style={{ background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6, padding: '12px 14px', marginBottom: 12 }}>
                <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 12, color: '#9a6700' }}>Key falsifiers</p>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(t.falsifiers as string[]).map((f: string, i: number) => (
                    <li key={i} style={{ fontSize: 12, color: '#57606a', marginBottom: 4, lineHeight: 1.5 }}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {a.evidenceReview && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Evidence Review</p>
                <p style={{ margin: 0, fontSize: 12, color: '#57606a' }}>{(a.evidenceReview as Record<string, unknown>)?.reviewNote as string}</p>
              </div>
            )}

            <p style={{ fontSize: 11, color: '#afb8c1', marginTop: 14, textAlign: 'right' }}>
              Not investment advice · {a.pipeline}
            </p>
          </div>
        )}

        {/* ── LISTEN ───────────────────────────────────────────────────── */}
        {tab === 'listen' && (
          <div>
            {!lv.strategicGoals && <p style={{ fontSize: 13, color: '#6e7681' }}>No transcript data available for this company.</p>}

            {lv.horizonSummary && (
              <div style={{ marginBottom: 16, padding: '12px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Strategic horizon (12-36 months)</p>
                <p style={{ margin: 0, fontSize: 13, color: '#1b1f23', lineHeight: 1.65 }}>{lv.horizonSummary}</p>
              </div>
            )}

            {lv.strategicGoals?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Strategic goals (management voice)</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(lv.strategicGoals as Record<string, unknown>[]).map((g, i) => (
                    <div key={i} style={{ padding: '10px 12px', border: '1px solid #eaeef2', borderRadius: 6 }}>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 500, color: '#1b1f23' }}>{g.goal as string}</p>
                      {!!g.horizon_years && <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6e7681' }}>Horizon: {g.horizon_years as string} years</p>}
                      {!!g.evidence && <p style={{ margin: 0, fontSize: 11, color: '#57606a', fontStyle: 'italic' }}>"{g.evidence as string}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lv.checkpoints?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Checkpoints delivered?</p>
                {(lv.checkpoints as Record<string, unknown>[]).map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{c.delivered ? '✅' : '❌'}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>{c.event as string}</p>
                      {!!c.evidence && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6e7681', fontStyle: 'italic' }}>"{c.evidence as string}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lv.managementConsistency && (
              <div style={{ padding: '10px 12px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2' }}>
                <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>Management consistency</p>
                <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.6 }}>{lv.managementConsistency}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
