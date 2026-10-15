'use client'
import { scenarioBranches } from '@/data/research'

export default function ScenarioTree() {
  return (
    <div>
      {/* Root */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <div style={{ display: 'inline-block', border: '1px solid #e8e8e8', borderRadius: 8, padding: '12px 24px', background: '#f9f9f9' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>China 2024 — Starting Condition</p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#666' }}>PPP $23,841 · Household consumption 39% GDP · Property crisis ongoing</p>
        </div>
        <div style={{ width: 1, height: 24, background: '#e8e8e8', margin: '0 auto' }} />
        <p style={{ display: 'inline-block', fontSize: 11, color: '#999', background: '#fff', padding: '2px 12px', border: '1px solid #e8e8e8', borderRadius: 12 }}>
          Property crisis resolution path 2025-2026
        </p>
      </div>

      {/* Branches */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
        {scenarioBranches.map((b) => (
          <div key={b.id} style={{ border: `1px solid ${b.color}30`, borderRadius: 8, padding: 16, background: `${b.color}06` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: b.color }}>{b.label}</span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', background: `${b.color}18`, color: b.color, padding: '2px 6px', borderRadius: 10 }}>{b.probabilityLabel}</span>
            </div>
            <p style={{ fontSize: 11, color: '#555', lineHeight: 1.5, marginBottom: 10 }}>{b.description}</p>
            <div style={{ background: '#f9f9f9', borderRadius: 4, padding: 8, marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#333', margin: '0 0 3px' }}>Industry implication</p>
              <p style={{ fontSize: 11, color: '#555', margin: 0, lineHeight: 1.5 }}>{b.implication}</p>
            </div>
            <p style={{ fontSize: 10, color: '#999', margin: 0, lineHeight: 1.5 }}><strong style={{ color: '#aaa' }}>Watch:</strong> {b.earlyWarning}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: '#fff8dc', borderRadius: 6, border: '1px solid #f5e27a' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#b45309', margin: '0 0 4px' }}>Scenario falsifier</p>
        <p style={{ fontSize: 11, color: '#666', margin: 0, lineHeight: 1.5 }}>
          If China household consumption / GDP does not rise from 39% toward 45% over 2024–2028, the Engel-curve tailwind
          for luxury and high-elasticity categories does not materialise regardless of headline income growth.
          Observable: NBS quarterly household expenditure/income ratio.
        </p>
      </div>
      <p style={{ fontSize: 10, color: '#bbb', textAlign: 'right', marginTop: 6 }}>All probabilities [JDG] — illustrative structure only. Not a forecast.</p>
    </div>
  )
}
