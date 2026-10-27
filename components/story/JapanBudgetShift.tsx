'use client';
import React, { useState } from 'react';

/* ── Japan budget reallocation 1955→1992 ────────────────────────────────
   Method: Working-Leser model (Clements & Chen 2010, 42-country OECD panel)
   Δw_i = β_i × Δlog(Q)   where Δlog(Q) = log(119559/32155) = 1.31 log points
   1955 baseline shares: OECD shares scaled so food = 37.4% (actual)
   1992 shares: baseline + β_i × 1.31 × scale_factor (1.64, to match actual food decline)
   All non-food shares are model estimates [INF], not observed data [OBS]
   ──────────────────────────────────────────────────────────────────────── */

interface Cat {
  id: string; label: string; short: string;
  share55: number; share92: number; eta: number; type: string;
}

const CATS: Cat[] = [
  { id: 'food',   label: 'Food',                      short: 'Food',        share55: 37.4, share92: 15.7, eta: -0.28, type: 'inferior' },
  { id: 'other',  label: 'Other goods & services',    short: 'Other',       share55: 9.0,  share92: 19.5, eta: 1.37,  type: 'luxury' },
  { id: 'health', label: 'Health & medical',           short: 'Health',      share55: 8.0,  share92: 14.7, eta: 1.26,  type: 'luxury' },
  { id: 'rec',    label: 'Recreation & culture',       short: 'Recreation',  share55: 6.6,  share92: 12.9, eta: 1.31,  type: 'luxury' },
  { id: 'rest',   label: 'Restaurants & dining out',   short: 'Dining',      share55: 5.3,  share92: 10.0, eta: 1.28,  type: 'luxury' },
  { id: 'trans',  label: 'Transport (cars, rail)',      short: 'Transport',   share55: 7.5,  share92: 9.5,  eta: 1.08,  type: 'luxury' },
  { id: 'dur',    label: 'Durables (TV, fridge, car)', short: 'Durables',    share55: 3.8,  share92: 5.7,  eta: 1.15,  type: 'luxury' },
  { id: 'house',  label: 'Housing, water, fuels',      short: 'Housing',     share55: 10.3, share92: 5.9,  eta: 0.80,  type: 'necessity' },
  { id: 'edu',    label: 'Education',                  short: 'Education',   share55: 5.1,  share92: 3.8,  eta: 0.97,  type: 'necessity' },
  { id: 'cloth',  label: 'Clothing & footwear',        short: 'Clothing',    share55: 3.1,  share92: 1.8,  eta: 0.91,  type: 'necessity' },
  { id: 'alc',    label: 'Alcohol & tobacco',          short: 'Alcohol',     share55: 2.4,  share92: 0.9,  eta: 0.80,  type: 'necessity' },
  { id: 'comm',   label: 'Communication',              short: 'Telecom',     share55: 1.6,  share92: 0.6,  eta: 0.79,  type: 'necessity' },
];

const TYPE_COLOR: Record<string, string> = {
  inferior: '#c9d0d8',
  luxury:   '#4c78a8',
  necessity:'#9aa4ae',
};

const TYPE_OPACITY: Record<string, Record<string, number>> = {
  inferior: { '55': 0.7, '92': 0.3 },
  luxury:   { '55': 0.35, '92': 0.85 },
  necessity:{ '55': 0.55, '92': 0.35 },
};

/* ── Bar chart: before vs after per category ────────────────────────────── */
function CategoryBars({ hov, setHov }: { hov: string | null; setHov: (s: string | null) => void }) {
  const sorted = [...CATS].sort((a, b) => (b.share92 - b.share55) - (a.share92 - a.share55));
  const maxShare = 40;
  const BAR_H = 22; const GAP = 10; const PAD_L = 100;
  const W = 480;
  const H = sorted.length * (BAR_H * 2 + GAP + 4) + 32;

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible', width: '100%' }}>
      {/* zero line */}
      <line x1={PAD_L} x2={PAD_L} y1={8} y2={H - 16} stroke="#d0d7de" strokeWidth={0.8} />
      <text x={PAD_L} y={6} fontSize={9} fill="#57606a" textAnchor="middle">0%</text>
      {/* 20% guideline */}
      <line x1={PAD_L + (20/maxShare)*(W-PAD_L-20)} x2={PAD_L + (20/maxShare)*(W-PAD_L-20)} y1={8} y2={H-16}
        stroke="#e1e4e8" strokeWidth={0.5} strokeDasharray="3 2" />
      <text x={PAD_L + (20/maxShare)*(W-PAD_L-20)} y={6} fontSize={9} fill="#8c96a0" textAnchor="middle">20%</text>

      {sorted.map((c, i) => {
        const y0 = 12 + i * (BAR_H * 2 + GAP + 4);
        const w55 = (c.share55 / maxShare) * (W - PAD_L - 20);
        const w92 = (c.share92 / maxShare) * (W - PAD_L - 20);
        const color = TYPE_COLOR[c.type];
        const isHov = hov === c.id;
        const dim = hov && !isHov;
        const gain = c.share92 - c.share55;

        return (
          <g key={c.id} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHov(c.id)} onMouseLeave={() => setHov(null)}>
            {/* label */}
            <text x={PAD_L - 6} y={y0 + BAR_H - 2} fontSize={11} textAnchor="end"
              fontWeight={isHov ? 700 : 500}
              fill={dim ? '#d0d7de' : c.type === 'luxury' ? '#4c78a8' : c.type === 'inferior' ? '#9e3c38' : '#57606a'}
              style={{ transition: 'fill 0.15s' }}>
              {c.short}
            </text>
            {/* 1955 bar */}
            <rect x={PAD_L} y={y0} width={Math.max(w55, 2)} height={BAR_H}
              fill={color} fillOpacity={dim ? 0.1 : 0.4} rx={2}
              style={{ transition: 'fill-opacity 0.15s' }} />
            <text x={PAD_L + Math.max(w55, 2) + 3} y={y0 + BAR_H/2 + 4}
              fontSize={10} fill={dim ? '#d0d7de' : '#57606a'}>{c.share55.toFixed(1)}%</text>
            {/* 1992 bar */}
            <rect x={PAD_L} y={y0 + BAR_H + 2} width={Math.max(w92, 2)} height={BAR_H}
              fill={color} fillOpacity={dim ? 0.1 : 0.85} rx={2}
              style={{ transition: 'fill-opacity 0.15s' }} />
            <text x={PAD_L + Math.max(w92, 2) + 3} y={y0 + BAR_H * 2 + 2 + BAR_H/2 + 4}
              fontSize={10} fontWeight={700}
              fill={dim ? '#d0d7de' : c.type === 'luxury' ? '#4c78a8' : c.type === 'inferior' ? '#9e3c38' : '#57606a'}>
              {c.share92.toFixed(1)}%
              {!dim && <tspan fontSize={9} fill="#8c96a0"> ({gain > 0 ? '+' : ''}{gain.toFixed(1)}pp)</tspan>}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${PAD_L},${H - 12})`}>
        <rect x={0} y={-8} width={14} height={8} fill="#c9d0d8" fillOpacity={0.4} rx={1} />
        <text x={17} y={0} fontSize={9} fill="#57606a">1955</text>
        <rect x={40} y={-8} width={14} height={8} fill="#4c78a8" fillOpacity={0.85} rx={1} />
        <text x={57} y={0} fontSize={9} fill="#57606a">1992</text>
      </g>
    </svg>
  );
}

/* ── Freed budget flow ───────────────────────────────────────────────────── */
function FlowSummary() {
  const freed = 21.7;
  const gainers = CATS.filter(c => c.share92 > c.share55);
  const total_gain = gainers.reduce((s, c) => s + (c.share92 - c.share55), 0);
  const maxBar = 250;

  return (
    <div>
      <p style={{ fontSize: 11, color: '#57606a', marginBottom: 12, lineHeight: 1.6 }}>
        Food freed <strong style={{ color: '#9e3c38' }}>−{freed}pp</strong> of the household budget over 37 years.
        The Working-Leser model (Clements &amp; Chen 2010) distributes this across categories in proportion to income elasticity.
        Categories with η &gt; 1 gained share; η &lt; 1 lost share.
        <span style={{ color: '#8c96a0', fontSize: 10 }}> [INF] model-based estimates, not direct observations.</span>
      </p>
      {gainers.map(c => {
        const gain = c.share92 - c.share55;
        const w = (gain / total_gain) * maxBar;
        return (
          <div key={c.id} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 110, fontSize: 12, fontWeight: 600, color: '#4c78a8', flexShrink: 0 }}>{c.short}</div>
              <div style={{ height: 20, width: Math.max(w, 4), background: '#4c78a8',
                opacity: 0.6 + (c.eta - 1) * 0.3, borderRadius: 2 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#4c78a8' }}>+{gain.toFixed(1)}pp</span>
              <span style={{ fontSize: 10, color: '#8c96a0' }}>η={c.eta}</span>
            </div>
            <div style={{ fontSize: 11, color: '#57606a', marginLeft: 120, marginTop: 2, lineHeight: 1.5 }}>
              {c.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export function JapanBudgetShift() {
  const [hov, setHov] = useState<string | null>(null);
  const [view, setView] = useState<'bars' | 'flow'>('bars');
  const hovCat = CATS.find(c => c.id === hov);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[{ v: 'bars', l: 'Before vs after' }, { v: 'flow', l: 'Where the money went' }].map(({ v, l }) => (
          <button key={v} onClick={() => setView(v as 'bars' | 'flow')}
            style={{ padding: '5px 14px', fontSize: 12, borderRadius: 4, cursor: 'pointer', fontWeight: view === v ? 700 : 400,
              border: view === v ? '2px solid #1b1f23' : '1px solid #d0d7de',
              background: view === v ? '#1b1f23' : '#f6f8fa', color: view === v ? '#fff' : '#1b1f23' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Hover info strip */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        {hovCat ? (
          <div style={{ display: 'flex', gap: 18, fontSize: 13, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: TYPE_COLOR[hovCat.type] }}>{hovCat.label}</span>
            <span>η = <strong>{hovCat.eta}</strong></span>
            <span>1955: <strong>{hovCat.share55.toFixed(1)}%</strong></span>
            <span>1992: <strong style={{ color: hovCat.share92 > hovCat.share55 ? '#4c78a8' : '#9e3c38' }}>{hovCat.share92.toFixed(1)}%</strong></span>
            <span style={{ fontWeight: 700, color: hovCat.share92 > hovCat.share55 ? '#4c78a8' : '#9e3c38' }}>
              {hovCat.share92 > hovCat.share55 ? '+' : ''}{(hovCat.share92 - hovCat.share55).toFixed(1)}pp
            </span>
          </div>
        ) : <span style={{ color: '#c8ced4', fontSize: 11 }}>
          {view === 'bars' ? 'hover a category — light bar = 1955, dark bar = 1992' : 'where did the 21.7pp freed from food go?'}
        </span>}
      </div>

      {view === 'bars' ? <CategoryBars hov={hov} setHov={setHov} /> : <FlowSummary />}

      <p style={{ fontSize: 10, color: '#8c96a0', marginTop: 10, lineHeight: 1.6 }}>
        <strong>[INF]</strong> 1955 baseline shares: OECD category weights (Clements &amp; Chen 2010) scaled so food = 37.4% (Pritchett &amp; Spivack table A.12).
        1992 shares: baseline + β_i × Δlog(Q) × 1.64 (scale factor to match observed food decline).
        The Working-Leser model assumes constant β coefficients — an approximation over a 37-year period.
        Direct Japanese household expenditure surveys (FIES) would show the observed figures; this is a structural estimate.
      </p>
    </div>
  );
}
