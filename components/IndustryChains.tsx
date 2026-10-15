'use client'
import { industryChains } from '@/data/research'

const flagStyle = (f: string): React.CSSProperties => {
  const map: Record<string, React.CSSProperties> = {
    'OBS':     { background: '#e6f4ea', color: '#137333', border: '1px solid #ceead6' },
    'INF':     { background: '#fef7e0', color: '#b45309', border: '1px solid #fde68a' },
    'OBS+INF': { background: '#e8f0fe', color: '#1d4ed8', border: '1px solid #c7d7fd' },
    'OBS+GAP': { background: '#fff3e0', color: '#9a3412', border: '1px solid #fed7aa' },
    'GAP':     { background: '#f3f3f3', color: '#555',    border: '1px solid #e8e8e8' },
  }
  return { ...map[f] ?? map['GAP'], fontSize: 10, padding: '1px 6px', borderRadius: 3, fontFamily: 'monospace' }
}

const tailwindBadge = (t: string): React.CSSProperties => {
  const map: Record<string, React.CSSProperties> = {
    'TAILWIND':    { background: '#e6f4ea', color: '#137333' },
    'STRUCTURAL':  { background: '#e8f0fe', color: '#1d4ed8' },
    'AGING-DRIVEN':{ background: '#fef7e0', color: '#b45309' },
  }
  return { ...(map[t] ?? {}), fontSize: 11, padding: '2px 8px', borderRadius: 12, fontWeight: 600 }
}

export default function IndustryChains() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
      {industryChains.map((c) => (
        <div key={c.rank} style={{ border: '1px solid #e8e8e8', borderRadius: 8, padding: 20, background: '#fff' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#ccc', lineHeight: 1 }}>#{c.rank}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: c.economyColor, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{c.economy}</span>
                  <span style={tailwindBadge(c.tailwind)}>{c.tailwind}</span>
                </div>
                <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{c.industry}</p>
              </div>
            </div>
            <span style={flagStyle(c.dataFlag)}>{c.dataFlag}</span>
          </div>

          {/* Mechanism */}
          <div style={{ background: '#f9f9f9', borderRadius: 4, padding: 10, marginBottom: 10, fontSize: 12, color: '#444', lineHeight: 1.5 }}>
            {c.mechanism}
          </div>

          {/* Elasticity */}
          <p style={{ fontSize: 11, color: '#666', marginBottom: 8 }}>
            <strong style={{ color: '#555' }}>ε_Y:</strong> {c.elasticityNote}
          </p>

          {/* Companies */}
          <div style={{ marginBottom: 10 }}>
            {c.companies.map((co) => (
              <div key={co.ticker} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={flagStyle(co.evidenceFlag)}>{co.evidenceFlag}</span>
                <div style={{ fontSize: 11 }}>
                  <strong>{co.name}</strong> <span style={{ color: '#999' }}>({co.ticker})</span>
                  <p style={{ margin: '2px 0 0', color: '#666' }}>{co.data}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Falsifier */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
            <p style={{ fontSize: 11, color: '#d62728', marginBottom: 4, fontWeight: 600 }}>⚠ Falsifier</p>
            <p style={{ fontSize: 11, color: '#666', lineHeight: 1.5, margin: 0 }}>{c.falsifier}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
