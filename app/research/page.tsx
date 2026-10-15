'use client'
import dynamic from 'next/dynamic'
import TabNav from '@/components/TabNav'

const ResearchSearch = dynamic(() => import('@/components/ResearchSearch'), { ssr: false })

export default function ResearchPage() {
  return (
    <div className="obs-notebook">
      <header style={{ paddingTop: 48 }}>
        <TabNav />
        <h1 className="obs-h1">Deep Research — Any Company</h1>
        <p className="obs-byline" style={{ marginTop: 6 }}>
          Powered by <strong>company-research-deep</strong> pipeline · OpenRouter/Claude Sonnet ·
          FMP financials · EODHD quotes · 9 analytical perspectives
        </p>
        <p className="obs-body obs-prose" style={{ color: '#57606a', marginTop: 12 }}>
          Type any company name or ticker. The pipeline collects audited financial data,
          runs GORILLA scoring, builds 5-year scenarios, and synthesizes a 3-pillar thesis —
          the same methodology used for the pre-computed MercadoLibre and HDFC Bank reports.
          Runs in ~30–60 seconds.
        </p>
      </header>

      <section style={{ marginBottom: 48 }}>
        <ResearchSearch />
      </section>

      {/* Pre-computed reports */}
      <section>
        <h2 className="obs-h2">Pre-computed Reports (Phase 1)</h2>
        <p className="obs-byline">Full pipeline · sourced · evidence-reviewed · 2026-10-15</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            {
              ticker: 'MELI',
              name: 'MercadoLibre',
              verdict: 'GORILLA',
              score: 78,
              moat: 'Wide',
              color: '#1a7f37',
              bg: '#e6f4ea',
              border: '#a8d5b5',
              economy: 'Brazil · Mexico · Argentina',
              elasticity: 'E-commerce ε=1.2 · Financial Services ε=1.15',
              thesis: 'The credit-data flywheel × e-commerce dominance × Engel curve tailwind. Price implies 21.1% growth vs 42.2% demonstrated.',
              report: '/data/reports/MELI-2026-10-15.md',
            },
            {
              ticker: 'HDB',
              name: 'HDFC Bank',
              verdict: 'SMALL_ANIMAL',
              score: 70,
              moat: 'Narrow',
              color: '#9a6700',
              bg: '#fff8c5',
              border: '#f0c060',
              economy: 'India',
              elasticity: 'Financial Services ε=1.12 · Home Loans ε=1.20',
              thesis: 'Home loan flywheel (30M customers, 99% savings account adoption) × branch vintage compounding. P/B 2.08x prices perpetual trough ROE; recovery to 17-18% implies P/B ~2.6-2.8x.',
              report: '/data/reports/HDB-2026-10-15.md',
            },
          ].map(r => (
            <div key={r.ticker} style={{ border: '1px solid #d0d7de', borderRadius: 10, padding: '20px 22px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6e7681', background: '#f6f8fa', padding: '2px 6px', borderRadius: 4, border: '1px solid #eaeef2', marginRight: 8 }}>{r.ticker}</span>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: r.bg, color: r.color, border: `1px solid ${r.border}` }}>
                    {r.verdict} {r.score}/100
                  </span>
                </div>
                <span style={{ fontSize: 11, color: '#6e7681', background: '#f6f8fa', padding: '2px 8px', borderRadius: 4, border: '1px solid #eaeef2' }}>
                  {r.moat} moat
                </span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#1b1f23' }}>{r.name}</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {r.economy.split(' · ').map(e => (
                  <span key={e} style={{ fontSize: 11, background: '#ddf4ff', color: '#0969da', border: '1px solid #b6e3ff', padding: '2px 7px', borderRadius: 4 }}>{e}</span>
                ))}
                {r.elasticity.split(' · ').map(e => (
                  <span key={e} style={{ fontSize: 11, background: '#e6f4ea', color: '#1a7f37', border: '1px solid #a8d5b5', padding: '2px 7px', borderRadius: 4 }}>{e}</span>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#57606a', lineHeight: 1.6 }}>{r.thesis}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #d0d7de', paddingTop: 20, marginTop: 48, fontSize: 11, color: '#6e7681' }}>
        <p>
          <strong>Phase 2 API</strong> · POST /api/research · OpenRouter/Claude Sonnet 4-6 · FMP + EODHD ·
          Not investment advice · Results depend on data availability · Always verify against primary sources
        </p>
        <p style={{ marginTop: 4, color: '#afb8c1' }}>
          To add companies to Phase 1 (pre-computed, fully sourced): run company-research-deep in kask, save output to data/reports/, add to data/companyReports.ts
        </p>
      </footer>
    </div>
  )
}
