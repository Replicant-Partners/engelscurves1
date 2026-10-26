'use client';
import React from 'react';

/* Horizon timeline — shows forecast resolution dates on a horizontal axis */

interface Horizon {
  date: string;        // display
  dateSort: number;    // YYYYMM for sorting
  label: string;
  detail: string;
  type: 'data' | 'market' | 'policy' | 'brier';
  status: 'past' | 'near' | 'future';
}

const HORIZONS: Horizon[] = [
  { date: 'Q4-2025', dateSort: 202512, label: 'Vietnam GDP 8.0% confirmed', detail: 'GSO published Jan-2026. MWG revenue +16.4% confirmed.', type: 'data', status: 'past' },
  { date: 'Q1-2026', dateSort: 202603, label: 'FEMSA Q4-2025 SSSG +4.4%', detail: 'OXXO Mexico inflection confirmed. Banxico rate 7.0%.', type: 'market', status: 'past' },
  { date: 'Q1-2026', dateSort: 202603, label: 'YDUQ3 FCF R$1.05B (+32%)', detail: 'FCF thesis confirmed at historic milestone.', type: 'market', status: 'past' },
  { date: 'Q1-2026', dateSort: 202603, label: 'MTN Nigeria FY2025: real growth', detail: 'Naira appreciated — growth not purely FX rebase.', type: 'market', status: 'past' },
  { date: 'H1-2026', dateSort: 202606, label: 'USDA ERS 2024 food shares', detail: 'First post-2023 data: does Indonesia food share continue rising (lens conflict) or fall?', type: 'data', status: 'near' },
  { date: 'H1-2026', dateSort: 202606, label: 'ENIGH 2024 (Mexico household survey)', detail: 'Confirms post-transition status still holds after GDP +0.3% year.', type: 'data', status: 'near' },
  { date: 'Q3-2026', dateSort: 202609, label: 'GGAL HSBC integration ROE normalisation', detail: 'Q3-2025 ROE 4.7% (drag). Q3-2026 target: ROE 15%+ ex-integration costs.', type: 'market', status: 'near' },
  { date: 'Oct-2026', dateSort: 202610, label: 'Argentina mid-term elections', detail: 'Milei coalition gains/losses determine 2027 presidential race confidence.', type: 'policy', status: 'near' },
  { date: 'H2-2026', dateSort: 202612, label: 'SILO H1-2026 revenue (12% target)', detail: 'Oct-2025 mgmt guidance: double-digit. Analyst consensus FY26F: +12%. First confirmation.', type: 'market', status: 'future' },
  { date: 'H2-2026', dateSort: 202612, label: 'MTN MoMo fintech turn positive', detail: 'Was −7.2% H1-2026. Positive turn = second Engel channel (financial inclusion) confirmed.', type: 'market', status: 'future' },
  { date: 'Oct-2027', dateSort: 202710, label: 'Brier loop: MWG fwd P/E > 15×', detail: '41.2% calibrated probability. Already re-rated to 17.9× TTM (Apr-2026) — may resolve early.', type: 'brier', status: 'future' },
  { date: 'Dec-2027', dateSort: 202712, label: 'Brier loop: FEMSA TSR > 20%', detail: '36.8% calibrated probability.', type: 'brier', status: 'future' },
  { date: 'Dec-2027', dateSort: 202712, label: 'Brier loop: YDUQ3 FCF > 20% pa', detail: '38.6% calibrated probability. FCF +32% already in FY2025 — on track.', type: 'brier', status: 'future' },
  { date: 'Dec-2027', dateSort: 202712, label: 'Brier loop: MTNN data > 20% organic', detail: '33.5% calibrated probability.', type: 'brier', status: 'future' },
  { date: 'Dec-2027', dateSort: 202712, label: 'Brier loop: GGAL P/B > 1.5×', detail: '45.4% calibrated probability. Currently 1.15× (Aug-2026).', type: 'brier', status: 'future' },
  { date: 'Dec-2027', dateSort: 202712, label: 'Brier loop: SILO revenue > 12%', detail: '34.9% calibrated probability.', type: 'brier', status: 'future' },
];

const TYPE_STYLE: Record<Horizon['type'], { color: string; label: string }> = {
  data:   { color: '#4c78a8', label: 'Data release' },
  market: { color: '#2c6e49', label: 'Company result' },
  policy: { color: '#7c5c9e', label: 'Policy event' },
  brier:  { color: '#7c5c00', label: 'Brier closure' },
};

const STATUS_OPACITY: Record<Horizon['status'], number> = {
  past: 0.5, near: 1.0, future: 0.7,
};

export function WatchTimeline() {
  const sorted = [...HORIZONS].sort((a, b) => a.dateSort - b.dateSort);

  return (
    <div style={{ marginTop: 20 }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, fontSize: 10, color: '#57606a' }}>
        {Object.entries(TYPE_STYLE).map(([k, v]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: v.color, display: 'inline-block' }} />
            {v.label}
          </span>
        ))}
        <span style={{ color: '#8c96a0' }}>— faded = confirmed/past &nbsp;|&nbsp; solid border = near-term &nbsp;|&nbsp; future = dashed</span>
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {sorted.map((h, i) => {
          const s = TYPE_STYLE[h.type];
          const isPast = h.status === 'past';
          const isFuture = h.status === 'future';
          return (
            <div key={i} style={{
              display: 'flex', gap: 0, alignItems: 'stretch',
              opacity: STATUS_OPACITY[h.status],
            }}>
              {/* Date + connector */}
              <div style={{ flex: '0 0 90px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#57606a', fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap', marginTop: 2 }}>
                  {h.date}
                </div>
                <div style={{ flex: 1, width: 1, background: '#d0d7de', margin: '2px 0' }} />
              </div>
              {/* Dot */}
              <div style={{ flex: '0 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: isPast ? '#d0d7de' : s.color,
                  border: isFuture ? `2px dashed ${s.color}` : `2px solid ${s.color}`,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, width: 1, background: '#e1e4e8', margin: '2px 0' }} />
              </div>
              {/* Content */}
              <div style={{ flex: 1, paddingLeft: 10, paddingBottom: 12, paddingTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1b1f23' }}>{h.label}</span>
                  <span style={{ fontSize: 9, fontWeight: 600, color: s.color, border: `1px solid ${s.color}`,
                    borderRadius: 3, padding: '0 4px', background: s.color + '18' }}>
                    {s.label}
                  </span>
                  {isPast && <span style={{ fontSize: 9, color: '#2c6e49', fontWeight: 600 }}>✓ confirmed</span>}
                </div>
                <p style={{ fontSize: 11, color: '#57606a', lineHeight: 1.5, margin: 0 }}>{h.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
