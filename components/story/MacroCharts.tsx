'use client';
import React, { useState } from 'react';

const C: Record<string, string> = {
  MWG: '#4c78a8', FMX: '#7c5c00', YDUQ3: '#2c6e49',
  MTNN: '#7c5c9e', GGAL: '#9e3c38', SILO: '#8b7355',
};

/* ── 1. GDP vs CPI Quadrant ─────────────────────────────────────────────── */
export function GDPCPIQuadrant() {
  const [hov, setHov] = useState<string | null>(null);
  const W = 560; const H = 360;
  const PAD = { t: 24, b: 48, l: 56, r: 20 };
  const iW = W - PAD.l - PAD.r; const iH = H - PAD.t - PAD.b;
  const xMin = 0; const xMax = 9.5; const yMin = 0; const yMax = 35;
  const xS = (v: number) => PAD.l + (v - xMin) / (xMax - xMin) * iW;
  const yS = (v: number) => PAD.t + iH - (v - yMin) / (yMax - yMin) * iH;
  const xTicks = [0, 2, 4, 6, 8];
  const yTicks = [0, 5, 10, 15, 20, 25, 30];

  const data = [
    { sym: 'MWG',   label: 'Vietnam',   gdp: 8.02, cpi: 3.3  },
    { sym: 'FMX',   label: 'Mexico',    gdp: 0.3,  cpi: 3.7  },
    { sym: 'YDUQ3', label: 'Brazil',    gdp: 2.3,  cpi: 5.5  },
    { sym: 'MTNN',  label: 'Nigeria',   gdp: 4.0,  cpi: 23.0 },
    { sym: 'GGAL',  label: 'Argentina', gdp: 4.2,  cpi: 31.0 },
    { sym: 'SILO',  label: 'Indonesia', gdp: 5.11, cpi: 3.55 },
  ];
  const h = data.find(d => d.sym === hov);

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 8 }}>
        Best macro backdrop for Engel: lower-right quadrant (high GDP, low inflation). Hover a bubble for details.
      </div>
      {/* Fixed-height tooltip strip */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        {h ? (
          <div style={{ display: 'flex', gap: 20, fontSize: 13, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: C[h.sym] }}>{h.label}</span>
            <span>GDP <strong style={{ color: h.gdp >= 4 ? '#2c6e49' : '#9e3c38' }}>+{h.gdp.toFixed(1)}%</strong></span>
            <span>CPI <strong style={{ color: h.cpi <= 5 ? '#2c6e49' : '#9e3c38' }}>{h.cpi.toFixed(1)}%</strong></span>
            <span style={{ color: '#8c96a0', fontSize: 11 }}>{h.sym}</span>
          </div>
        ) : <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a bubble to inspect</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
        {/* ideal zone */}
        <rect x={xS(4)} y={PAD.t} width={iW - (xS(4) - PAD.l)} height={yS(5) - PAD.t}
          fill="#f0faf4" opacity={0.7} />
        <text x={xS(6.5)} y={PAD.t + 16} fontSize={10} fill="#2c6e49" textAnchor="middle" fontStyle="italic">ideal zone</text>
        {/* grid */}
        {xTicks.map(v => <line key={v} x1={xS(v)} x2={xS(v)} y1={PAD.t} y2={PAD.t + iH} stroke="#e1e4e8" strokeWidth={0.5} />)}
        {yTicks.map(v => <line key={v} x1={PAD.l} x2={PAD.l + iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5} />)}
        {/* threshold lines */}
        <line x1={xS(4)} x2={xS(4)} y1={PAD.t} y2={PAD.t + iH} stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 2" />
        <line x1={PAD.l} x2={PAD.l + iW} y1={yS(5)} y2={yS(5)} stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 2" />
        {/* bubbles */}
        {data.map(d => {
          const cx = xS(d.gdp); const cy = yS(d.cpi);
          const isHov = hov === d.sym;
          const dim = hov && !isHov;
          const above = cy < PAD.t + iH / 2;
          return (
            <g key={d.sym} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHov(d.sym)} onMouseLeave={() => setHov(null)}>
              <circle cx={cx} cy={cy} r={isHov ? 16 : 12}
                fill={C[d.sym]} fillOpacity={dim ? 0.15 : isHov ? 0.9 : 0.65}
                stroke={C[d.sym]} strokeWidth={isHov ? 2 : 1}
                style={{ transition: 'r 0.15s, fill-opacity 0.15s' }} />
              <text x={cx} y={above ? cy + (isHov ? 20 : 17) : cy - (isHov ? 20 : 17)}
                fontSize={isHov ? 13 : 11} fontWeight={700} fill={C[d.sym]} textAnchor="middle"
                style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 0.15s' }}>
                {d.label}
              </text>
              <text x={cx} y={above ? cy + (isHov ? 33 : 28) : cy - (isHov ? 33 : 28)}
                fontSize={isHov ? 11 : 9} fill="#8c96a0" textAnchor="middle"
                style={{ opacity: dim ? 0.2 : 1, transition: 'opacity 0.15s' }}>
                {d.sym}
              </text>
            </g>
          );
        })}
        {/* axes */}
        {xTicks.map(v => <text key={v} x={xS(v)} y={PAD.t + iH + 16} fontSize={10} fill="#57606a" textAnchor="middle">{v}%</text>)}
        {yTicks.filter(v => v > 0).map(v => <text key={v} x={PAD.l - 6} y={yS(v)} fontSize={10} fill="#57606a" textAnchor="end" dominantBaseline="central">{v}%</text>)}
        <text x={PAD.l + iW / 2} y={H - 6} fontSize={11} fill="#57606a" textAnchor="middle">GDP growth 2025 →</text>
        <text transform={`rotate(-90) translate(${-(PAD.t + iH / 2)},${14})`} fontSize={11} fill="#57606a" textAnchor="middle">CPI inflation 2025 →</text>
      </svg>
    </div>
  );
}

/* ── Helper: interactive bar row ────────────────────────────────────────── */
function Bar({ label, sym, value, maxVal, color, fmt, threshold, reverse = false }:
  { label: string; sym: string; value: number; maxVal: number; color: string;
    fmt: (v: number) => string; threshold?: number; reverse?: boolean;
    hov?: string | null; onHov?: (s: string | null) => void }) {
  return null; // replaced inline
}

/* ── 2. Argentina inflation trajectory ──────────────────────────────────── */
export function ArgentinaInflation() {
  const [hov, setHov] = useState<number | null>(null);
  const W = 400; const H = 240;
  const PAD = { t: 24, b: 36, l: 52, r: 24 };
  const iW = W - PAD.l - PAD.r; const iH = H - PAD.t - PAD.b;
  const pts = [
    { yr: '2022', v: 95,  proj: false },
    { yr: '2023', v: 211, proj: false },
    { yr: '2024', v: 117, proj: false },
    { yr: '2025', v: 31,  proj: false },
    { yr: '2026F', v: 25, proj: true  },
  ];
  const yMax = 230;
  const xS = (i: number) => PAD.l + (i / (pts.length - 1)) * iW;
  const yS = (v: number) => PAD.t + iH - (v / yMax) * iH;
  const path = pts.filter(p => !p.proj).map((p, i) => `${i === 0 ? 'M' : 'L'}${xS(i).toFixed(1)},${yS(p.v).toFixed(1)}`).join(' ');
  const projPath = `M${xS(3).toFixed(1)},${yS(31).toFixed(1)} L${xS(4).toFixed(1)},${yS(25).toFixed(1)}`;
  const h = hov !== null ? pts[hov] : null;

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 8 }}>
        Argentina CPI (year-end %). The most dramatic disinflation in this dataset: 211% → 31% in 2 years.
      </div>
      <div style={{ height: 28, display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        {h ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: C.GGAL }}>{h.yr}: {h.v}%{h.proj ? ' (forecast)' : ''}</span>
        ) : <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a point</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
        <path d={path + ` L${xS(3)},${yS(0)} L${xS(0)},${yS(0)} Z`} fill={C.GGAL} fillOpacity={0.07} />
        {[0, 50, 100, 150, 200].map(v => (
          <g key={v}>
            <line x1={PAD.l} x2={PAD.l + iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5} />
            <text x={PAD.l - 4} y={yS(v)} fontSize={9} fill="#57606a" textAnchor="end" dominantBaseline="central">{v}%</text>
          </g>
        ))}
        <path d={path} fill="none" stroke={C.GGAL} strokeWidth={2.5} strokeLinecap="round" />
        <path d={projPath} fill="none" stroke={C.GGAL} strokeWidth={1.5} strokeDasharray="4 3" />
        {pts.map((p, i) => (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            <circle cx={xS(i)} cy={yS(p.v)} r={hov === i ? 8 : 5}
              fill={p.proj ? 'white' : C.GGAL} stroke={C.GGAL} strokeWidth={2}
              style={{ transition: 'r 0.15s' }} />
            <text x={xS(i)} y={yS(p.v) - 12} fontSize={hov === i ? 12 : 10} fontWeight={700} fill={C.GGAL} textAnchor="middle">
              {p.v}%{p.proj ? 'F' : ''}
            </text>
            <text x={xS(i)} y={H - 4} fontSize={9} fill="#57606a" textAnchor="middle">{p.yr}</text>
          </g>
        ))}
        <text transform={`rotate(-90) translate(${-(PAD.t + iH / 2)},${13})`} fontSize={10} fill="#57606a" textAnchor="middle">CPI YoY %</text>
      </svg>
    </div>
  );
}

/* ── 3. GDP bars ────────────────────────────────────────────────────────── */
export function GDPBars() {
  const [hov, setHov] = useState<string | null>(null);
  const BAR_H = 32; const GAP = 10; const PAD_L = 140;
  const data = [
    { sym: 'MWG',   label: 'Vietnam',   v: 8.02 },
    { sym: 'SILO',  label: 'Indonesia', v: 5.11 },
    { sym: 'GGAL',  label: 'Argentina', v: 4.2  },
    { sym: 'MTNN',  label: 'Nigeria',   v: 4.0  },
    { sym: 'YDUQ3', label: 'Brazil',    v: 2.3  },
    { sym: 'FMX',   label: 'Mexico',    v: 0.3  },
  ];
  const W = 480; const MAX = 10;
  const H = data.length * (BAR_H + GAP) + 24;
  const bw = (v: number) => (v / MAX) * (W - PAD_L - 60);

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>GDP growth 2025. Mexico at +0.3% is the weakest macro backdrop.</div>
      <div style={{ height: 24, display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        {hov ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: C[data.find(d=>d.sym===hov)!.sym] }}>
            {(() => { const fd = data.find(d=>d.sym===hov); return fd ? `${fd.label}: +${fd.v.toFixed(1)} GDP` : ''; })()}
          </span>
        ) : <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a bar</span>}
      </div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <line x1={PAD_L + bw(4)} x2={PAD_L + bw(4)} y1={4} y2={H - 4} stroke="#d0d7de" strokeWidth={1} strokeDasharray="3 2" />
        <text x={PAD_L + bw(4)} y={2} fontSize={9} fill="#57606a" textAnchor="middle">4%</text>
        {data.map((d, i) => {
          const y = 12 + i * (BAR_H + GAP);
          const w = bw(d.v);
          const isHov = hov === d.sym;
          const dim = hov && !isHov;
          return (
            <g key={d.sym} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHov(d.sym)} onMouseLeave={() => setHov(null)}>
              <text x={PAD_L - 8} y={y + BAR_H / 2 + 4} fontSize={13} textAnchor="end"
                fontWeight={isHov ? 700 : 500}
                fill={dim ? '#c8ced4' : C[d.sym]}
                style={{ transition: 'fill 0.15s' }}>
                {d.label}
              </text>
              <rect x={PAD_L} y={y} width={Math.max(w, 4)} height={BAR_H}
                fill={C[d.sym]} fillOpacity={dim ? 0.15 : isHov ? 0.95 : d.v >= 4 ? 0.8 : 0.45} rx={3}
                style={{ transition: 'fill-opacity 0.15s' }} />
              <text x={PAD_L + Math.max(w, 4) + 6} y={y + BAR_H / 2 + 5}
                fontSize={13} fontWeight={700}
                fill={dim ? '#c8ced4' : C[d.sym]}
                style={{ transition: 'fill 0.15s' }}>
                +{d.v.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── 4. CPI bars ────────────────────────────────────────────────────────── */
export function InflationBars() {
  const [hov, setHov] = useState<string | null>(null);
  const BAR_H = 32; const GAP = 10; const PAD_L = 140;
  const data = [
    { sym: 'MWG',   label: 'Vietnam',   v: 3.3  },
    { sym: 'SILO',  label: 'Indonesia', v: 3.55 },
    { sym: 'FMX',   label: 'Mexico',    v: 3.7  },
    { sym: 'YDUQ3', label: 'Brazil',    v: 5.5  },
    { sym: 'MTNN',  label: 'Nigeria',   v: 23.0 },
    { sym: 'GGAL',  label: 'Argentina', v: 31.0 },
  ];
  const W = 480; const MAX = 35;
  const H = data.length * (BAR_H + GAP) + 24;
  const bw = (v: number) => (v / MAX) * (W - PAD_L - 70);

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>CPI inflation 2025. High inflation blocks Engel by forcing food budget back up.</div>
      <div style={{ height: 24, display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        {hov ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: C[data.find(d=>d.sym===hov)!.sym] }}>
            {data.find(d=>d.sym===hov)?.label}: {data.find(d=>d.sym===hov)?.v.toFixed(1)}% CPI
          </span>
        ) : <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a bar</span>}
      </div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        {(() => { const gx = PAD_L + bw(5); return <>
          <line x1={gx} x2={gx} y1={4} y2={H - 4} stroke="#d0d7de" strokeWidth={1} strokeDasharray="3 2" />
          <text x={gx} y={2} fontSize={9} fill="#57606a" textAnchor="middle">5%</text>
        </>; })()}
        {data.map((d, i) => {
          const y = 12 + i * (BAR_H + GAP);
          const w = bw(d.v);
          const danger = d.v > 10;
          const isHov = hov === d.sym;
          const dim = hov && !isHov;
          return (
            <g key={d.sym} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHov(d.sym)} onMouseLeave={() => setHov(null)}>
              <text x={PAD_L - 8} y={y + BAR_H / 2 + 4} fontSize={13} textAnchor="end"
                fontWeight={isHov ? 700 : 500}
                fill={dim ? '#c8ced4' : C[d.sym]}
                style={{ transition: 'fill 0.15s' }}>
                {d.label}
              </text>
              <rect x={PAD_L} y={y} width={Math.max(w, 4)} height={BAR_H}
                fill={danger ? '#9e3c38' : '#2c6e49'}
                fillOpacity={dim ? 0.12 : isHov ? 0.95 : 0.65} rx={3}
                style={{ transition: 'fill-opacity 0.15s' }} />
              <text x={PAD_L + Math.max(w, 4) + 6} y={y + BAR_H / 2 + 5}
                fontSize={13} fontWeight={700}
                fill={dim ? '#c8ced4' : danger ? '#9e3c38' : '#2c6e49'}
                style={{ transition: 'fill 0.15s' }}>
                {d.v.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── 5. FX bars ─────────────────────────────────────────────────────────── */
export function FXBars() {
  const [hov, setHov] = useState<string | null>(null);
  const BAR_H = 32; const GAP = 10; const PAD_L = 140;
  const data = [
    { sym: 'FMX',   label: 'Mexico',    v: 12.0  },
    { sym: 'MWG',   label: 'Vietnam',   v: -3.2  },
    { sym: 'SILO',  label: 'Indonesia', v: -4.0  },
    { sym: 'MTNN',  label: 'Nigeria',   v: -5.0  },
    { sym: 'YDUQ3', label: 'Brazil',    v: -8.0  },
    { sym: 'GGAL',  label: 'Argentina', v: -15.0 },
  ];
  const W = 480; const MAX_ABS = 16;
  const H = data.length * (BAR_H + GAP) + 24;
  const ZERO_X = PAD_L + (MAX_ABS / (2 * MAX_ABS)) * (W - PAD_L - 50);
  const bx = (v: number) => v >= 0
    ? { x: ZERO_X, w: (v / MAX_ABS) * (W - ZERO_X - 50) }
    : { x: ZERO_X + (v / MAX_ABS) * (W - PAD_L - 50), w: (-v / MAX_ABS) * (W - PAD_L - 50) };

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>FX change vs USD in 2025. Mexico appreciated (+12%) — most USD-protected.</div>
      <div style={{ height: 24, display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        {hov ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: C[data.find(d=>d.sym===hov)!.sym] }}>
            {(() => { const fd = data.find(d=>d.sym===hov); return fd ? `${fd.label}: ${fd.v > 0 ? '+' : ''}${fd.v.toFixed(1)}% vs USD` : ''; })()}
          </span>
        ) : <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a bar</span>}
      </div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        <line x1={ZERO_X} x2={ZERO_X} y1={4} y2={H - 4} stroke="#57606a" strokeWidth={0.8} />
        {data.map((d, i) => {
          const y = 12 + i * (BAR_H + GAP);
          const { x, w } = bx(d.v);
          const isHov = hov === d.sym;
          const dim = hov && !isHov;
          return (
            <g key={d.sym} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHov(d.sym)} onMouseLeave={() => setHov(null)}>
              <text x={PAD_L - 8} y={y + BAR_H / 2 + 4} fontSize={13} textAnchor="end"
                fontWeight={isHov ? 700 : 500}
                fill={dim ? '#c8ced4' : C[d.sym]}
                style={{ transition: 'fill 0.15s' }}>
                {d.label}
              </text>
              <rect x={x} y={y} width={Math.max(w, 4)} height={BAR_H}
                fill={d.v >= 0 ? '#2c6e49' : C[d.sym]}
                fillOpacity={dim ? 0.12 : isHov ? 0.95 : 0.7} rx={3}
                style={{ transition: 'fill-opacity 0.15s' }} />
              <text x={d.v >= 0 ? x + Math.max(w,4) + 6 : x - 6} y={y + BAR_H/2 + 5}
                fontSize={13} fontWeight={700}
                textAnchor={d.v >= 0 ? 'start' : 'end'}
                fill={dim ? '#c8ced4' : d.v >= 0 ? '#2c6e49' : C[d.sym]}
                style={{ transition: 'fill 0.15s' }}>
                {d.v > 0 ? '+' : ''}{d.v.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
