'use client';
import React from 'react';

/* ── Palette ────────────────────────────────────────────────────────────── */
const C: Record<string, string> = {
  MWG: '#4c78a8', FMX: '#7c5c00', YDUQ3: '#2c6e49',
  MTNN: '#7c5c9e', GGAL: '#9e3c38', SILO: '#8b7355',
};

/* ── 1. GDP vs CPI quadrant ─────────────────────────────────────────────── */
export function GDPCPIQuadrant() {
  const W = 440; const H = 300;
  const PAD = { t: 24, b: 40, l: 48, r: 20 };
  const iW = W - PAD.l - PAD.r; const iH = H - PAD.t - PAD.b;

  const data = [
    { sym: 'MWG',   label: 'Vietnam',   gdp: 8.02, cpi: 3.3  },
    { sym: 'FMX',   label: 'Mexico',    gdp: 0.3,  cpi: 3.7  },
    { sym: 'YDUQ3', label: 'Brazil',    gdp: 2.3,  cpi: 5.5  },
    { sym: 'MTNN',  label: 'Nigeria',   gdp: 4.0,  cpi: 23.0 },
    { sym: 'GGAL',  label: 'Argentina', gdp: 4.2,  cpi: 31.0 },
    { sym: 'SILO',  label: 'Indonesia', gdp: 5.11, cpi: 3.55 },
  ];

  const xMin = 0; const xMax = 9.5;
  const yMin = 0; const yMax = 35;
  const xS = (v: number) => PAD.l + (v - xMin) / (xMax - xMin) * iW;
  const yS = (v: number) => PAD.t + iH - (v - yMin) / (yMax - yMin) * iH;

  const xTicks = [0, 2, 4, 6, 8];
  const yTicks = [0, 5, 10, 15, 20, 25, 30];

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>
        Best macro backdrop for Engel: lower-right quadrant (high GDP, low inflation). Bottom axis = GDP growth 2025; left axis = CPI 2025.
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', overflow: 'visible' }}>
        {/* Quadrant shading */}
        <rect x={xS(4)} y={PAD.t} width={iW - (xS(4) - PAD.l)} height={yS(5) - PAD.t}
          fill="#f0faf4" opacity={0.6} />
        <text x={xS(6.5)} y={PAD.t + 14} fontSize={9} fill="#2c6e49" textAnchor="middle" fontStyle="italic">
          ideal zone
        </text>

        {/* grid */}
        {xTicks.map(v => (
          <line key={v} x1={xS(v)} x2={xS(v)} y1={PAD.t} y2={PAD.t + iH} stroke="#e1e4e8" strokeWidth={0.5} />
        ))}
        {yTicks.map(v => (
          <line key={v} x1={PAD.l} x2={PAD.l + iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5} />
        ))}

        {/* threshold lines */}
        <line x1={xS(4)} x2={xS(4)} y1={PAD.t} y2={PAD.t + iH} stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 2" />
        <text x={xS(4)} y={PAD.t + iH + 28} fontSize={8} fill="#57606a" textAnchor="middle">GDP 4%</text>
        <line x1={PAD.l} x2={PAD.l + iW} y1={yS(5)} y2={yS(5)} stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 2" />
        <text x={PAD.l - 4} y={yS(5)} fontSize={8} fill="#57606a" textAnchor="end" dominantBaseline="central">5%</text>

        {/* bubbles */}
        {data.map(d => {
          const cx = xS(d.gdp); const cy = yS(d.cpi);
          const above = cy < PAD.t + iH / 2;
          return (
            <g key={d.sym}>
              <circle cx={cx} cy={cy} r={10}
                fill={C[d.sym]} fillOpacity={0.65} stroke={C[d.sym]} strokeWidth={1.5} />
              <text x={cx} y={above ? cy + 14 : cy - 14}
                fontSize={9} fontWeight={600} fill={C[d.sym]} textAnchor="middle">
                {d.sym}
              </text>
              <text x={cx} y={above ? cy + 23 : cy - 23}
                fontSize={8} fill="#57606a" textAnchor="middle">
                {d.label}
              </text>
            </g>
          );
        })}

        {/* axis labels */}
        {xTicks.map(v => (
          <text key={v} x={xS(v)} y={PAD.t + iH + 14} fontSize={8} fill="#57606a" textAnchor="middle">{v}%</text>
        ))}
        {yTicks.filter(v => v > 0).map(v => (
          <text key={v} x={PAD.l - 4} y={yS(v)} fontSize={8} fill="#57606a" textAnchor="end" dominantBaseline="central">{v}%</text>
        ))}
        <text x={PAD.l + iW / 2} y={H - 2} fontSize={9} fill="#57606a" textAnchor="middle">GDP growth 2025 →</text>
        <text transform={`rotate(-90) translate(${-(PAD.t + iH / 2)},${12})`} fontSize={9} fill="#57606a" textAnchor="middle">CPI inflation 2025 →</text>
      </svg>
    </div>
  );
}

/* ── 2. Argentina inflation trajectory ──────────────────────────────────── */
export function ArgentinaInflation() {
  const W = 360; const H = 200;
  const PAD = { t: 20, b: 32, l: 48, r: 20 };
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
  const projPts = pts.filter((_, i) => i >= pts.length - 2);
  const projPath = projPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xS(pts.length - 2 + i).toFixed(1)},${yS(p.v).toFixed(1)}`).join(' ');

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>
        Argentina CPI (year-end %). The most dramatic disinflation in this dataset: 211% → 31% in 2 years.
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block' }}>
        {/* fill area */}
        <path d={path + ` L${xS(pts.findIndex(p => !p.proj) - 1 < 0 ? 3 : 3)},${yS(0)} L${xS(0)},${yS(0)} Z`}
          fill={C.GGAL} fillOpacity={0.08} />

        {/* grid */}
        {[0, 50, 100, 150, 200].map(v => (
          <g key={v}>
            <line x1={PAD.l} x2={PAD.l + iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5} />
            <text x={PAD.l - 4} y={yS(v)} fontSize={8} fill="#57606a" textAnchor="end" dominantBaseline="central">{v}%</text>
          </g>
        ))}

        {/* observed line */}
        <path d={path} fill="none" stroke={C.GGAL} strokeWidth={2} strokeLinecap="round" />
        {/* projected */}
        <path d={projPath} fill="none" stroke={C.GGAL} strokeWidth={1.5} strokeDasharray="4 3" />

        {/* dots + labels */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={xS(i)} cy={yS(p.v)} r={4}
              fill={p.proj ? 'white' : C.GGAL} stroke={C.GGAL} strokeWidth={1.5} />
            <text x={xS(i)} y={yS(p.v) - 8} fontSize={9} fontWeight={700}
              fill={C.GGAL} textAnchor="middle">
              {p.v}%{p.proj ? 'F' : ''}
            </text>
            <text x={xS(i)} y={PAD.t + iH + 14} fontSize={8} fill="#57606a" textAnchor="middle">{p.yr}</text>
          </g>
        ))}

        <text transform={`rotate(-90) translate(${-(PAD.t + iH / 2)},${12})`} fontSize={9} fill="#57606a" textAnchor="middle">CPI YoY %</text>
      </svg>
    </div>
  );
}

/* ── 3. GDP comparison bar chart ─────────────────────────────────────────── */
export function GDPBars() {
  const W = 400; const BAR_H = 26; const GAP = 8;
  const MAX_VAL = 10;
  const data = [
    { sym: 'MWG',   label: 'Vietnam (+8.0%)',    v: 8.02  },
    { sym: 'SILO',  label: 'Indonesia (+5.1%)',  v: 5.11  },
    { sym: 'GGAL',  label: 'Argentina (+4.2%)',  v: 4.2   },
    { sym: 'MTNN',  label: 'Nigeria (+4.0%)',    v: 4.0   },
    { sym: 'YDUQ3', label: 'Brazil (+2.3%)',     v: 2.3   },
    { sym: 'FMX',   label: 'Mexico (+0.3%)',     v: 0.3   },
  ];
  const PAD_L = 120;
  const H = data.length * (BAR_H + GAP) + 20;
  const barW = (v: number) => (v / MAX_VAL) * (W - PAD_L - 60);

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>
        GDP growth 2025. Mexico at +0.3% is the weakest macro backdrop in the set.
      </div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        {data.map((d, i) => {
          const y = 10 + i * (BAR_H + GAP);
          const bw = barW(d.v);
          return (
            <g key={d.sym}>
              <text x={PAD_L - 6} y={y + BAR_H / 2 + 4} fontSize={11} textAnchor="end" fill={C[d.sym]} fontWeight={600}>{d.label}</text>
              <rect x={PAD_L} y={y} width={Math.max(bw, 4)} height={BAR_H}
                fill={C[d.sym]} fillOpacity={d.v >= 4 ? 0.9 : 0.5} rx={3} />
              <text x={PAD_L + Math.max(bw, 4) + 5} y={y + BAR_H / 2 + 4}
                fontSize={10} fill={C[d.sym]} fontWeight={700}>{d.v.toFixed(1)}%</text>
            </g>
          );
        })}
        {/* 4% guideline */}
        <line x1={PAD_L + barW(4)} x2={PAD_L + barW(4)} y1={6} y2={H - 4}
          stroke="#d0d7de" strokeWidth={1} strokeDasharray="3 2" />
        <text x={PAD_L + barW(4)} y={4} fontSize={8} fill="#57606a" textAnchor="middle">4%</text>
      </svg>
    </div>
  );
}

/* ── 4. FX change bar chart ──────────────────────────────────────────────── */
export function FXBars() {
  const W = 400; const BAR_H = 26; const GAP = 8;
  const data = [
    { sym: 'FMX',   label: 'Mexico  (MXN)',      v: 12.0  },
    { sym: 'MWG',   label: 'Vietnam  (VND)',      v: -3.2  },
    { sym: 'SILO',  label: 'Indonesia  (IDR)',    v: -4.0  },
    { sym: 'MTNN',  label: 'Nigeria  (NGN)',      v: -5.0  },
    { sym: 'YDUQ3', label: 'Brazil  (BRL)',       v: -8.0  },
    { sym: 'GGAL',  label: 'Argentina  (ARS)',    v: -15.0 },
  ];
  const MAX_ABS = 16;
  const PAD_L = 124; const ZERO_X = PAD_L + (MAX_ABS / (2 * MAX_ABS)) * (W - PAD_L - 40);
  const H = data.length * (BAR_H + GAP) + 28;

  const bx = (v: number) => v >= 0
    ? { x: ZERO_X, w: (v / MAX_ABS) * (W - ZERO_X - 40) }
    : { x: ZERO_X + (v / MAX_ABS) * (W - PAD_L - 40), w: (-v / MAX_ABS) * (W - PAD_L - 40) };

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>
        FX change vs USD in 2025. Mexico appreciated (+12%) — most USD-protected. Argentina depreciated (−15%).
      </div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        {/* zero line */}
        <line x1={ZERO_X} x2={ZERO_X} y1={8} y2={H - 14} stroke="#57606a" strokeWidth={0.8} />
        <text x={ZERO_X} y={H - 2} fontSize={8} fill="#57606a" textAnchor="middle">0%</text>
        <text x={ZERO_X - 30} y={H - 2} fontSize={8} fill="#9e3c38" textAnchor="middle">−</text>
        <text x={ZERO_X + 30} y={H - 2} fontSize={8} fill="#2c6e49" textAnchor="middle">+</text>

        {data.map((d, i) => {
          const y = 10 + i * (BAR_H + GAP);
          const { x, w } = bx(d.v);
          return (
            <g key={d.sym}>
              <text x={PAD_L - 6} y={y + BAR_H / 2 + 4} fontSize={11} textAnchor="end"
                fill={C[d.sym]} fontWeight={600}>{d.label}</text>
              <rect x={x} y={y} width={Math.max(w, 4)} height={BAR_H}
                fill={d.v >= 0 ? '#2c6e49' : C[d.sym]} fillOpacity={0.7} rx={3} />
              <text x={d.v >= 0 ? x + w + 4 : x - 4} y={y + BAR_H / 2 + 4}
                fontSize={10} fontWeight={700}
                fill={d.v >= 0 ? '#2c6e49' : C[d.sym]}
                textAnchor={d.v >= 0 ? 'start' : 'end'}>
                {d.v > 0 ? '+' : ''}{d.v.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── 5. Inflation comparison bar ─────────────────────────────────────────── */
export function InflationBars() {
  const W = 400; const BAR_H = 26; const GAP = 8;
  const MAX_VAL = 35;
  const data = [
    { sym: 'MWG',   label: 'Vietnam (3.3%)',    v: 3.3   },
    { sym: 'SILO',  label: 'Indonesia (3.6%)',  v: 3.55  },
    { sym: 'FMX',   label: 'Mexico (3.7%)',     v: 3.7   },
    { sym: 'YDUQ3', label: 'Brazil (5.5%)',     v: 5.5   },
    { sym: 'MTNN',  label: 'Nigeria (23%)',     v: 23.0  },
    { sym: 'GGAL',  label: 'Argentina (31%)',   v: 31.0  },
  ];
  const PAD_L = 130;
  const H = data.length * (BAR_H + GAP) + 20;

  return (
    <div>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>
        CPI inflation 2025. High inflation blocks Engel by forcing food budget back up. Threshold 5% shown.
      </div>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
        {data.map((d, i) => {
          const y = 10 + i * (BAR_H + GAP);
          const bw = (d.v / MAX_VAL) * (W - PAD_L - 60);
          const danger = d.v > 10;
          return (
            <g key={d.sym}>
              <text x={PAD_L - 6} y={y + BAR_H / 2 + 4} fontSize={11} textAnchor="end"
                fill={C[d.sym]} fontWeight={600}>{d.label}</text>
              <rect x={PAD_L} y={y} width={Math.max(bw, 4)} height={BAR_H}
                fill={danger ? '#9e3c38' : '#2c6e49'} fillOpacity={danger ? 0.75 : 0.6} rx={3} />
              <text x={PAD_L + Math.max(bw, 4) + 5} y={y + BAR_H / 2 + 4}
                fontSize={10} fontWeight={700}
                fill={danger ? '#9e3c38' : '#2c6e49'}>{d.v.toFixed(1)}%</text>
            </g>
          );
        })}
        {/* 5% line */}
        {(() => {
          const gx = PAD_L + (5 / MAX_VAL) * (W - PAD_L - 60);
          return <>
            <line x1={gx} x2={gx} y1={6} y2={H - 4} stroke="#d0d7de" strokeWidth={1} strokeDasharray="3 2" />
            <text x={gx} y={4} fontSize={8} fill="#57606a" textAnchor="middle">5%</text>
          </>;
        })()}
      </svg>
    </div>
  );
}
