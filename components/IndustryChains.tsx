'use client'
import { industryChains } from '@/data/research'

const BADGE = (f: string) => {
  const m: Record<string, React.CSSProperties> = {
    'OBS':     { background: '#e6f4ea', color: '#1a7f37', borderColor: '#a8d5b5' },
    'INF':     { background: '#fff8c5', color: '#9a6700', borderColor: '#f0c060' },
    'OBS+INF': { background: '#ddf4ff', color: '#0969da', borderColor: '#b6e3ff' },
    'OBS+GAP': { background: '#fff1e0', color: '#9a3412', borderColor: '#fecba1' },
    'GAP':     { background: '#f6f8fa', color: '#57606a', borderColor: '#d0d7de' },
  }
  return { ...(m[f] ?? m['GAP']), fontSize: 10, padding: '1px 7px', borderRadius: 20, border: '1px solid', fontFamily: 'monospace' } as React.CSSProperties
}

const TAIL = (t: string): React.CSSProperties => {
  const m: Record<string, React.CSSProperties> = {
    TAILWIND:    { background: '#e6f4ea', color: '#1a7f37', borderColor: '#a8d5b5' },
    STRUCTURAL:  { background: '#ddf4ff', color: '#0969da', borderColor: '#b6e3ff' },
    'AGING-DRIVEN': { background: '#fff8c5', color: '#9a6700', borderColor: '#f0c060' },
  }
  const s = m[t] ?? m['STRUCTURAL']
  return { ...s, fontSize: 11, padding: '2px 9px', borderRadius: 20, border: '1px solid', fontWeight: 600 }
}

export default function IndustryChains() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {industryChains.map((c) => (
        <div key={c.rank} style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '18px 20px', background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Rank + Economy + Tailwind */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#eaeef2', lineHeight: 1 }}>#{c.rank}</span>
              <span style={BADGE(c.dataFlag)}>{c.dataFlag}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.economyColor, flexShrink: 0 }} />
              <span style={{ fontWeight: 600, fontSize: 14, color: '#1b1f23' }}>{c.economy}</span>
              <span style={TAIL(c.tailwind)}>{c.tailwind}</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#6e7681' }}>{c.industry}</p>
          </div>

          {/* Mechanism */}
          <div style={{ background: '#f6f8fa', border: '1px solid #eaeef2', borderRadius: 6, padding: '10px 12px', fontSize: 12, color: '#57606a', lineHeight: 1.55, flexGrow: 1 }}>
            {c.mechanism}
          </div>

          {/* Elasticity */}
          <p style={{ margin: 0, fontSize: 12, color: '#6e7681' }}>
            <strong style={{ color: '#57606a' }}>ε_Y: </strong>{c.elasticityNote}
          </p>

          {/* Companies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {c.companies.map((co) => (
              <div key={co.ticker} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                <span style={BADGE(co.evidenceFlag)}>{co.evidenceFlag}</span>
                <div style={{ fontSize: 12 }}>
                  <strong style={{ color: '#1b1f23' }}>{co.name}</strong>
                  <span style={{ color: '#6e7681', marginLeft: 4, fontFamily: 'monospace', fontSize: 11 }}>({co.ticker})</span>
                  <p style={{ margin: '2px 0 0', color: '#57606a' }}>{co.data}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Falsifier */}
          <div style={{ borderTop: '1px solid #eaeef2', paddingTop: 10 }}>
            <p style={{ margin: '0 0 3px', fontSize: 11, color: '#cf222e', fontWeight: 600 }}>⚠ Falsifier</p>
            <p style={{ margin: 0, fontSize: 11, color: '#57606a', lineHeight: 1.5 }}>{c.falsifier}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
