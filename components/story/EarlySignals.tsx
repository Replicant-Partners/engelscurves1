'use client';
import React, { useState } from 'react';

/* ── Signal taxonomy ────────────────────────────────────────────────────── */
type SignalStatus = 'confirmed' | 'mixed' | 'watch' | 'refuted' | 'weakened';

const STATUS_STYLE: Record<SignalStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmed',     color: '#2c6e49', bg: '#f0faf4' },
  mixed:     { label: 'Mixed',         color: '#7c5c00', bg: '#fefbe8' },
  watch:     { label: 'Watch',         color: '#4c78a8', bg: '#f0f4fb' },
  refuted:   { label: 'Refuted',       color: '#9e3c38', bg: '#fdf0f0' },
  weakened:  { label: 'Weakened',      color: '#7c5c9e', bg: '#f5f0fb' },
};

interface Signal {
  type: 'thesis' | 'refutation' | 'macro';
  metric: string;
  reading: string;
  status: SignalStatus;
  source: string;
}

interface PairSignals {
  symbol: string;
  market: string;
  ticker: string;
  engelPhase: string;
  overallStatus: SignalStatus;
  overallNote: string;
  signals: Signal[];
}

/* ── Signal data ────────────────────────────────────────────────────────── */
const PAIRS: PairSignals[] = [
  {
    symbol: 'MWG', market: 'Vietnam', ticker: 'MWG HOSE',
    engelPhase: 'Transition',
    overallStatus: 'confirmed',
    overallNote: 'Strongest early signal in the set — P/E re-rated and revenue accelerating.',
    signals: [
      {
        type: 'thesis', status: 'confirmed',
        metric: 'P/E re-rating (market pricing in transition-driven growth)',
        reading: 'TTM P/E: 11.2× (Oct-2025) → 17.9× (Apr-2026). Target VND 98,600 (+15.2%) per VPBank Apr-2026. Thesis partially pricing in.',
        source: 'VPBank AGM Note Apr-2026',
      },
      {
        type: 'thesis', status: 'confirmed',
        metric: 'Revenue acceleration',
        reading: 'FY2025: +16.4% (VND 156.5tn). Q4-2025: +28%. H1-2026: +28.5%. NPAT +89.4% FY2025 (VND 7.1tn vs target 4.85tn — 146% of plan).',
        source: 'MWG Q4-2025 Earnings Call, Feb-2026',
      },
      {
        type: 'macro', status: 'confirmed',
        metric: 'Vietnam retail market — household goods/equipment',
        reading: 'Vietnam total retail sales +9.2% in 2025. Household goods/equipment surged +13.4%. Electronics e-commerce +23%. GDP +8%+.',
        source: 'Vietnam NSO Jan-2026; YouNet ECI 2025',
      },
      {
        type: 'refutation', status: 'watch',
        metric: 'E-commerce/Shopee cannibalisation of physical retail',
        reading: 'MWG online only 6% of revenue (FY2025). Physical chain growing faster (+28%). Not yet cannibalistic — watch Shopee electronics share.',
        source: 'MWG AR 2025',
      },
    ],
  },
  {
    symbol: 'FMX', market: 'Mexico', ticker: 'FMX NYSE',
    engelPhase: 'Post-transition',
    overallStatus: 'mixed',
    overallNote: 'Engel mechanism structurally intact but Mexico consumer timing delayed.',
    signals: [
      {
        type: 'thesis', status: 'mixed',
        metric: 'OXXO same-store transactions recovery',
        reading: 'SSSG +1.0% FY2025 (positive, but FEMSA management still calling environment "challenging"). Transactions recovering from -1.1% dip but slowly.',
        source: 'FEMSA AR 2025, Mar-2026',
      },
      {
        type: 'thesis', status: 'mixed',
        metric: 'Health division growth >15%',
        reading: 'Health +10.5% FY2025 — below 15% thesis target. Chile, Colombia growing; Mexico health net -158 locations. Gross margin contracted.',
        source: 'FEMSA MD&A 2025',
      },
      {
        type: 'macro', status: 'watch',
        metric: 'Mexico household food share (ENIGH 2024)',
        reading: 'ENIGH 2022: food 25.7%. 2024 survey due 2025 publication — key data point to confirm post-transition is holding. Not yet released.',
        source: 'INEGI (pending)',
      },
      {
        type: 'refutation', status: 'watch',
        metric: 'Mercado Libre / informal sector competition',
        reading: 'FEMSA expanding digital (Spin Premia 28M users, 10M Spin by OXXO active). Competitive threat real but OXXO physical moat (13M tickets/day) intact.',
        source: 'FEMSA AR 2025',
      },
    ],
  },
  {
    symbol: 'YDUQ3', market: 'Brazil', ticker: 'YDUQ3 B3',
    engelPhase: 'Post-transition',
    overallStatus: 'confirmed',
    overallNote: 'FCF thesis confirmed at R$1B milestone. Revenue/FCF tension is analytical — not a refutation.',
    signals: [
      {
        type: 'thesis', status: 'confirmed',
        metric: 'Free Cash Flow > 20% growth',
        reading: 'FCF R$1.051B FY2025, +32% YoY — historic milestone. FCFE R$500M (+38%). CEO: "we are clearly on an upward trajectory." Net debt R$2.48B (-11.8%).',
        source: 'Yduqs IR Mar-2026',
      },
      {
        type: 'thesis', status: 'confirmed',
        metric: 'No FIES cut (policy refutation check)',
        reading: 'FIES maintained through 2025. No government announcement of cut or cap. Student base +4.3% to 1.37M.',
        source: 'Yduqs IR Mar-2026',
      },
      {
        type: 'thesis', status: 'confirmed',
        metric: 'Premium education segment growth (first-gen access thesis)',
        reading: 'Premium (IDOMED + Ibmec) = 44% of EBITDA (+4pp vs 2024, was 30% in 2021). Ibmec EBITDA +38%, margin 45%. Semi-presencial students +61%.',
        source: 'Yduqs Integrated Report 2025',
      },
      {
        type: 'refutation', status: 'watch',
        metric: 'Revenue growth < implied g (7.7%) — valuation tension',
        reading: 'Revenue +3.2% FY2025 < implied g 7.7%. On a revenue basis the stock appears fairly valued. Thesis depends on FCF as the right metric for a leveraged education business.',
        source: 'lisp_eval derivation',
      },
    ],
  },
  {
    symbol: 'MTNN', market: 'Nigeria', ticker: 'MTNN NGX',
    engelPhase: 'Paradox',
    overallStatus: 'weakened',
    overallNote: 'Original falsifier (naira re-pricing) has been weakened by FY2025 results — naira appreciated.',
    signals: [
      {
        type: 'thesis', status: 'confirmed',
        metric: 'Data revenue growth (organic, post-rebase)',
        reading: 'FY2025 service revenue +55.1% NGN with naira STRENGTHENING N1,535→N1,436/USD. Growth is partially real (not just FX). Data users +11.6% to 53.2M.',
        source: 'MTN Nigeria FY2025 Earnings, Feb-2026',
      },
      {
        type: 'refutation', status: 'weakened',
        metric: 'Naira re-pricing falsifier',
        reading: 'Original falsifier was "growth is only naira re-pricing". FY2025 naira appreciated — this falsifier is WEAKENED. Real revenue growth is higher in USD terms than NGN terms.',
        source: 'MTN Nigeria FY2025; CBN data',
      },
      {
        type: 'thesis', status: 'confirmed',
        metric: 'EBITDA margin expansion',
        reading: 'EBITDA margin 52.7% (+13.6pp) FY2025. PAT N1.1tn vs loss N400B in 2024. FCF N1.2tn (+215%). Management guiding EBITDA "mid to high 50%".',
        source: 'MTN Nigeria FY2025 Earnings',
      },
      {
        type: 'refutation', status: 'watch',
        metric: 'MoMo fintech (-7.2% H1-2026)',
        reading: 'MoMo fintech revenue still negative. Fintech as a second Engel channel (financial inclusion precursor) not yet confirmed. Key watch for H2-2026.',
        source: 'MTN Nigeria H1-2026',
      },
    ],
  },
  {
    symbol: 'GGAL', market: 'Argentina', ticker: 'GGAL Nasdaq',
    engelPhase: 'Post-transition (macro play)',
    overallStatus: 'mixed',
    overallNote: 'Macro stabilisation progressing but P/B re-rating to thesis target still pending.',
    signals: [
      {
        type: 'thesis', status: 'mixed',
        metric: 'P/B re-rating toward 1.5× (macro-stabilisation signal)',
        reading: 'P/B was 0.96× at Oct-2025 analysis. GGAL absorbed HSBC Argentina (Galicia Más) in 2025 — now 15.1% loan market share (scale milestone). P/B re-rating to 1× is the first milestone.',
        source: 'GGAL 4Q2025 Press Release, Mar-2026',
      },
      {
        type: 'macro', status: 'confirmed',
        metric: 'Argentina inflation declining',
        reading: 'Inflation: 211% (2023) → 117% (2024) → estimated 40-50% (2025, declining). Milei programme on track. IMF relationship maintained.',
        source: 'GGAL 20-F 2025; INDEC',
      },
      {
        type: 'thesis', status: 'confirmed',
        metric: 'HSBC acquisition integration (scale thesis)',
        reading: 'Galicia Más integration completed FY2025. Combined entity: 10,079 employees, 432 branches, Ps.11,351B AUM. Credit to private sector at 15.1% market share.',
        source: 'GGAL Informe Integrado 2025',
      },
      {
        type: 'refutation', status: 'watch',
        metric: 'Milei programme failure scenario',
        reading: 'IMF programme on track. Runoff Oct-2026 (Polymarket: incumbent 77.8%) outcome matters for continuity. Argentina structural under-penetration (credit/GDP ~13%) is real but requires stable macro.',
        source: 'Polymarket Oct-2026; GGAL 20-F',
      },
    ],
  },
  {
    symbol: 'SILO', market: 'Indonesia', ticker: 'SILO IDX',
    engelPhase: 'Transition',
    overallStatus: 'mixed',
    overallNote: 'Engel transition not yet visible in revenue. EBITDA margin expanding — quality improving before volume.',
    signals: [
      {
        type: 'thesis', status: 'mixed',
        metric: 'Revenue acceleration toward 12% target',
        reading: 'FY2025 revenue +5.2% — below 12% thesis target. Patient volumes: inpatient +7.8%, outpatient +7.5%. Revenue lags volume due to mix shift toward lower-revenue archetypes.',
        source: 'SILO IDX Filing Mar-2026',
      },
      {
        type: 'thesis', status: 'confirmed',
        metric: 'EBITDA margin expansion (profitability before volume)',
        reading: 'EBITDA margin 29.1% (+3.2pp FY2025). Net profit +22.5%. Operating leverage improving ahead of volume acceleration. 9% private hospital market share.',
        source: 'SILO IDX Filing Mar-2026',
      },
      {
        type: 'refutation', status: 'watch',
        metric: 'BPJS coverage expansion',
        reading: 'No major BPJS non-emergency expansion announced FY2025. BPJS covers 95% of population for routine care — private hospital growth requires middle-class self-selection for premium/speed/non-covered services.',
        source: 'SILO IR; Ministry of Health Indonesia',
      },
      {
        type: 'macro', status: 'watch',
        metric: 'Indonesia middle-income household growth (SUSENAS)',
        reading: 'Indonesia GDP/capita PPP $17,040 (2025 est.). Approaching $17,775 upper transition boundary. SUSENAS 2024 health spending share not yet released.',
        source: 'IMF WEO 2026; BPS (pending)',
      },
    ],
  },
];

/* ── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status, small }: { status: SignalStatus; small?: boolean }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{
      fontSize: small ? 10 : 11, fontWeight: 600, color: s.color,
      background: s.bg, border: `1px solid ${s.color}`,
      borderRadius: 4, padding: small ? '1px 5px' : '2px 7px',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

const TYPE_ICON: Record<string, string> = {
  thesis: '↑', refutation: '✗', macro: '◎',
};
const TYPE_COLOR: Record<string, string> = {
  thesis: '#2c6e49', refutation: '#9e3c38', macro: '#4c78a8',
};

/* ── Main component ─────────────────────────────────────────────────────── */
export function EarlySignals() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 12, color: '#57606a', marginBottom: 12, maxWidth: 680, lineHeight: 1.6 }}>
        Phase 4 monitors whether each Engel chain is showing observable early movement — three signal types per pair:
        <strong style={{ color: '#2c6e49' }}> ↑ Thesis</strong> (confirms the chain),
        <strong style={{ color: '#9e3c38' }}> ✗ Refutation</strong> (tests the falsifier),
        <strong style={{ color: '#4c78a8' }}> ◎ Macro</strong> (country-level context).
        Sources: FY2025 primary filings (Mar-2026) and latest public data.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PAIRS.map((pair) => {
          const isOpen = open === pair.symbol;
          return (
            <div key={pair.symbol} style={{ border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
              {/* Header row */}
              <button
                onClick={() => setOpen(isOpen ? null : pair.symbol)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', background: isOpen ? '#f0f4f8' : '#f6f8fa',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#1b1f23' }}>{pair.market}</span>
                  <span style={{ fontSize: 11, color: '#57606a', marginLeft: 8 }}>{pair.ticker}</span>
                  <span style={{ fontSize: 10, color: '#57606a', marginLeft: 6, border: '1px solid #d0d7de', borderRadius: 3, padding: '0 4px' }}>{pair.engelPhase}</span>
                </div>
                <StatusBadge status={pair.overallStatus} />
                <span style={{ fontSize: 14, color: '#57606a', marginLeft: 4 }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded signals */}
              {isOpen && (
                <div style={{ padding: '12px 14px', borderTop: '1px solid #e1e4e8' }}>
                  <p style={{ fontSize: 11, color: '#57606a', marginBottom: 10, fontStyle: 'italic' }}>
                    {pair.overallNote}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pair.signals.map((sig, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{
                          fontSize: 13, fontWeight: 700, color: TYPE_COLOR[sig.type],
                          minWidth: 18, marginTop: 1,
                        }}>
                          {TYPE_ICON[sig.type]}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#1b1f23' }}>{sig.metric}</span>
                            <StatusBadge status={sig.status} small />
                          </div>
                          <p style={{ fontSize: 11, color: '#57606a', lineHeight: 1.55, margin: 0 }}>
                            {sig.reading}
                          </p>
                          <span style={{ fontSize: 10, color: '#8c96a0', marginTop: 2, display: 'block' }}>
                            {sig.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary scorecard */}
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 11, color: '#57606a' }}>
        {Object.entries(STATUS_STYLE).map(([k, v]) => {
          const count = PAIRS.filter(p => p.overallStatus === k).length;
          return count > 0 ? (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.color, display: 'inline-block' }} />
              <strong style={{ color: v.color }}>{count}</strong> {v.label}
            </span>
          ) : null;
        })}
        <span style={{ color: '#8c96a0' }}>— as of FY2025 primary filings (Mar-2026)</span>
      </div>
    </div>
  );
}
