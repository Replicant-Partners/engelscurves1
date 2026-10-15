'use client'
import { scenarioBranches } from '@/data/research'

export default function ScenarioTree() {
  return (
    <div>
      {/* Root node */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '12px 24px', background: '#f6f8fa', textAlign: 'center' }}>
          <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: 14, color: '#1b1f23' }}>China 2024 — Starting Condition</p>
          <p style={{ margin: 0, fontSize: 12, color: '#6e7681' }}>PPP $23,841 · Household consumption 39% GDP · Property crisis ongoing</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 1, height: 20, background: '#d0d7de' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#6e7681', background: '#fff', padding: '2px 12px', border: '1px solid #eaeef2', borderRadius: 20 }}>
          Property crisis resolution path 2025–2026
        </span>
      </div>

      {/* Branches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 12 }}>
        {scenarioBranches.map((b) => (
          <div key={b.id} style={{ border: `1px solid ${b.color}40`, borderRadius: 8, padding: '16px 18px', background: `${b.color}06` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: b.color }}>{b.label}</span>
              <code style={{ fontSize: 11, background: b.color + '18', color: b.color, padding: '2px 7px', borderRadius: 4, fontFamily: 'monospace' }}>
                {b.probabilityLabel}
              </code>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: '#57606a', lineHeight: 1.55 }}>{b.description}</p>
            <div style={{ background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2', padding: '8px 12px', marginBottom: 10 }}>
              <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 600, color: '#1b1f23' }}>Industry implication</p>
              <p style={{ margin: 0, fontSize: 12, color: '#57606a', lineHeight: 1.5 }}>{b.implication}</p>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: '#6e7681', lineHeight: 1.5 }}>
              <strong style={{ color: '#afb8c1' }}>Watch: </strong>{b.earlyWarning}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6, padding: '12px 16px' }}>
        <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#9a6700' }}>Falsifier</p>
        <p style={{ margin: 0, fontSize: 13, color: '#1b1f23', lineHeight: 1.55 }}>
          If China household consumption / GDP does not rise from 39% toward 45% over 2024–2028, the Engel-curve tailwind for luxury and high-elasticity categories does not materialise — regardless of headline income growth. Observable: NBS quarterly household expenditure / income ratio.
        </p>
      </div>
      <p style={{ fontSize: 11, color: '#afb8c1', textAlign: 'right', marginTop: 8 }}>
        All probabilities [JDG] — illustrative scenario structure only. Not a forecast.
      </p>
    </div>
  )
}
