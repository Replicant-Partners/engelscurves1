'use client';
import React, { useState, useEffect, useRef } from 'react';

/* ── World Bank data 2000-2024 (GDP growth % + CPI %) ────────────────────
   Sources: WB NY.GDP.MKTP.KD.ZG + FP.CPI.TOTL.ZG
   Argentina CPI 2000-2017: IMF/FIEL estimates (WB stopped reporting due to INDEC manipulation)
   Argentina CPI 2018-2024: WB official ────────────────────────────────── */

const RAW: Record<string, { gdp: number[]; cpi: number[] }> = {
  VNM: {
    gdp: [6.79,6.19,6.32,6.90,7.54,7.55,6.98,7.13,5.66,5.40,6.42,6.41,5.50,5.55,5.98,6.99,6.42,6.69,6.94,7.47,7.36,2.55,2.87,4.98,7.04],
    cpi: [-1.71,-0.43,3.83,3.23,7.75,8.28,7.42,8.34,23.12,6.72,9.21,18.68,9.09,6.59,4.08,0.63,2.67,3.52,3.54,2.80,3.53,1.83,3.22,3.25,3.62],
  },
  MEX: {
    gdp: [5.03,-0.45,-0.24,1.19,3.57,2.11,4.81,2.08,0.94,-6.30,4.97,3.44,3.55,0.85,2.50,2.70,1.77,1.87,1.97,-0.39,-8.35,6.05,3.71,3.11,1.35],
    cpi: [9.49,6.37,5.03,4.55,4.69,3.99,3.63,3.97,5.12,5.30,4.16,3.41,4.11,3.81,4.02,2.72,2.82,6.04,4.90,3.64,3.40,5.69,7.90,5.53,4.72],
  },
  BRA: {
    gdp: [4.39,1.39,3.05,1.14,5.76,3.20,3.96,6.07,5.09,-0.13,7.53,3.97,1.92,3.00,0.50,-3.55,-3.28,1.32,1.78,1.22,-3.28,4.76,3.02,3.24,3.42],
    cpi: [7.04,6.84,8.45,14.71,6.60,6.87,4.18,3.64,5.68,4.89,5.04,6.64,5.40,6.20,6.33,9.03,8.74,3.45,3.66,3.73,3.21,8.30,9.28,4.59,4.37],
  },
  NGA: {
    gdp: [5.02,5.92,15.33,7.35,9.25,6.44,6.06,6.59,6.76,8.04,8.01,5.31,4.23,6.67,6.31,2.65,-1.62,0.81,1.92,2.21,-6.37,1.11,4.32,3.32,4.07],
    cpi: [6.93,18.87,12.88,14.03,15.00,17.86,8.23,5.39,11.58,12.54,13.74,10.83,12.22,8.50,8.05,9.01,15.70,16.50,12.10,11.40,13.25,16.95,18.85,24.66,33.24],
  },
  ARG: {
    gdp: [-0.79,-4.41,-10.89,8.84,9.03,8.85,8.05,9.01,4.06,-5.92,10.13,6.00,-1.03,2.41,-2.51,2.73,-2.08,2.82,-2.62,-2.00,-9.90,10.44,6.02,-1.86,-1.34],
    // CPI: 2000-2017 = IMF/FIEL estimates; 2018-2024 = WB official
    cpi: [-0.9,-1.1,25.9,13.4,4.4,9.6,10.9,8.8,9.2,6.3,10.5,9.8,10.0,26.0,38.0,27.0,41.0,24.8,34.3,53.5,42.0,48.4,72.4,133.5,219.9],
  },
  IDN: {
    gdp: [4.92,3.64,4.50,4.78,5.03,5.69,5.50,6.35,6.01,4.63,6.22,6.17,6.03,5.56,5.01,4.88,5.03,5.07,5.17,5.02,-2.07,3.70,5.31,5.05,5.03],
    cpi: [3.69,11.50,11.90,6.76,6.06,10.45,13.11,6.41,10.23,4.39,5.13,5.36,4.28,6.41,6.39,6.36,3.53,3.81,3.20,3.03,1.92,1.56,4.21,3.67,2.18],
  },
};

const YEARS = Array.from({ length: 25 }, (_, i) => 2000 + i);

const C: Record<string, string> = {
  VNM: '#4c78a8', MEX: '#7c5c00', BRA: '#2c6e49',
  NGA: '#7c5c9e', ARG: '#9e3c38', IDN: '#8b7355',
};
const LABELS: Record<string, string> = {
  VNM: 'Vietnam', MEX: 'Mexico', BRA: 'Brazil',
  NGA: 'Nigeria', ARG: 'Argentina', IDN: 'Indonesia',
};
const TICKERS = { VNM:'MWG', MEX:'FMX', BRA:'YDUQ3', NGA:'MTNN', ARG:'GGAL', IDN:'SILO' };

const CPI_CAP = 45; // cap y-axis; values above shown at edge with ↑

export function MacroQuadrantAnimated() {
  const [yearIdx, setYearIdx] = useState(24); // 2024
  const [playing, setPlaying] = useState(false);
  const [hov, setHov] = useState<string | null>(null);
  const [trailLen] = useState(5);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setYearIdx(i => {
          if (i >= 24) { setPlaying(false); return 24; }
          return i + 1;
        });
      }, 600);
      return () => { if (timer.current) clearInterval(timer.current); };
    }
  }, [playing]);

  const year = YEARS[yearIdx];

  const W = 580; const H = 400;
  const PAD = { t: 28, b: 52, l: 56, r: 28 };
  const iW = W - PAD.l - PAD.r; const iH = H - PAD.t - PAD.b;

  const gdpMin = -12; const gdpMax = 16;
  const cpiMin = -3; const cpiMax = CPI_CAP;

  const xS = (v: number) => PAD.l + Math.max(0, Math.min(1, (v - gdpMin) / (gdpMax - gdpMin))) * iW;
  const yS = (v: number) => PAD.t + iH - Math.max(0, Math.min(1, (v - cpiMin) / (cpiMax - cpiMin))) * iH;

  const pt = (sym: string, idx: number) => ({
    gdp: RAW[sym].gdp[idx],
    cpi: Math.min(RAW[sym].cpi[idx], CPI_CAP + 2),
    capped: RAW[sym].cpi[idx] > CPI_CAP,
  });

  const h = hov ? pt(hov, yearIdx) : null;

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => { if (yearIdx >= 24) setYearIdx(0); setPlaying(p => !p); }}
          style={{ padding: '6px 18px', fontWeight: 700, fontSize: 13, border: '2px solid #1b1f23',
            background: playing ? '#1b1f23' : 'white', color: playing ? 'white' : '#1b1f23',
            borderRadius: 4, cursor: 'pointer' }}>
          {playing ? 'Pause' : yearIdx >= 24 ? 'Replay' : 'Play'}
        </button>
        <input type="range" min={0} max={24} value={yearIdx}
          onChange={e => { setPlaying(false); setYearIdx(+e.target.value); }}
          style={{ width: 220, accentColor: '#1b1f23' }} />
        <span style={{ fontWeight: 700, fontSize: 20, fontVariantNumeric: 'tabular-nums', color: '#1b1f23', minWidth: 48 }}>{year}</span>
        <span style={{ fontSize: 11, color: '#8c96a0' }}>World Bank data (GDP growth + CPI). Argentina CPI 2000-2017: IMF/FIEL estimates.</span>
      </div>

      {/* Hover strip */}
      <div style={{ height: 32, display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        {h && hov ? (
          <div style={{ display: 'flex', gap: 20, fontSize: 13, alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: C[hov] }}>{LABELS[hov]}</span>
            <span>{year} GDP <strong style={{ color: RAW[hov].gdp[yearIdx] >= 4 ? '#2c6e49' : '#9e3c38' }}>
              {RAW[hov].gdp[yearIdx] > 0 ? '+' : ''}{RAW[hov].gdp[yearIdx].toFixed(1)}%
            </strong></span>
            <span>CPI <strong style={{ color: RAW[hov].cpi[yearIdx] <= 10 ? '#2c6e49' : '#9e3c38' }}>
              {RAW[hov].cpi[yearIdx].toFixed(1)}%{RAW[hov].cpi[yearIdx] > CPI_CAP ? ' ↑ (off chart)' : ''}
            </strong></span>
          </div>
        ) : <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a bubble or press Play to animate 2000→2024</span>}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
        {/* Year watermark */}
        <text x={xS(0)} y={yS(0) - 20} fontSize={80} fontWeight={700} fill="#1b1f23" opacity={0.06}
          textAnchor="middle">{year}</text>

        {/* Ideal zone */}
        <rect x={xS(4)} y={PAD.t} width={iW - (xS(4) - PAD.l)} height={yS(10) - PAD.t}
          fill="#f0faf4" opacity={0.6} />
        <text x={xS(10)} y={PAD.t + 14} fontSize={10} fill="#2c6e49" textAnchor="middle" fontStyle="italic">ideal zone</text>

        {/* Grid */}
        {[-10,-5,0,5,10,15].map(v => (
          <g key={v}>
            <line x1={xS(v)} x2={xS(v)} y1={PAD.t} y2={PAD.t+iH} stroke="#e1e4e8" strokeWidth={0.5} />
            <text x={xS(v)} y={PAD.t+iH+16} fontSize={10} fill="#57606a" textAnchor="middle">{v}%</text>
          </g>
        ))}
        {[0,10,20,30,40].map(v => (
          <g key={v}>
            <line x1={PAD.l} x2={PAD.l+iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5} />
            <text x={PAD.l-6} y={yS(v)} fontSize={10} fill="#57606a" textAnchor="end" dominantBaseline="central">{v}%</text>
          </g>
        ))}

        {/* Threshold lines */}
        <line x1={xS(4)} x2={xS(4)} y1={PAD.t} y2={PAD.t+iH} stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 2" />
        <line x1={PAD.l} x2={PAD.l+iW} y1={yS(10)} y2={yS(10)} stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 2" />
        <line x1={xS(0)} x2={xS(0)} y1={PAD.t} y2={PAD.t+iH} stroke="#9e3c38" strokeWidth={0.5} opacity={0.4} />

        {/* Trails */}
        {Object.keys(RAW).map(sym => {
          const trailPts = [];
          for (let i = Math.max(0, yearIdx - trailLen); i <= yearIdx; i++) {
            trailPts.push({ x: xS(RAW[sym].gdp[i]), y: yS(Math.min(RAW[sym].cpi[i], CPI_CAP)) });
          }
          if (trailPts.length < 2) return null;
          const d = trailPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
          return <path key={sym} d={d} fill="none" stroke={C[sym]}
            strokeWidth={hov && hov !== sym ? 0.5 : 1.5}
            strokeOpacity={hov && hov !== sym ? 0.2 : 0.5}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'stroke-opacity 0.2s' }} />;
        })}

        {/* Bubbles */}
        {Object.keys(RAW).map(sym => {
          const p = pt(sym, yearIdx);
          const cx = xS(p.gdp); const cy = yS(p.cpi);
          const isHov = hov === sym;
          const dim = hov && !isHov;
          const above = p.cpi === CPI_CAP + 2; // capped

          return (
            <g key={sym} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHov(sym)} onMouseLeave={() => setHov(null)}>
              {above && <text x={cx} y={cy - 14} fontSize={12} textAnchor="middle" fill={C[sym]}>↑</text>}
              <circle cx={cx} cy={cy} r={isHov ? 15 : 11}
                fill={C[sym]} fillOpacity={dim ? 0.1 : isHov ? 0.9 : 0.7}
                stroke={C[sym]} strokeWidth={isHov ? 2.5 : 1}
                style={{ transition: 'r 0.2s, fill-opacity 0.2s' }} />
              <text x={cx} y={cy - (isHov ? 19 : 15)} fontSize={isHov ? 13 : 11}
                fontWeight={700} fill={C[sym]} textAnchor="middle"
                opacity={dim ? 0.25 : 1}
                style={{ transition: 'opacity 0.2s' }}>
                {LABELS[sym]}
              </text>
              <text x={cx} y={cy - (isHov ? 31 : 26)} fontSize={9}
                fill="#8c96a0" textAnchor="middle"
                opacity={dim ? 0.15 : 0.8}>
                {TICKERS[sym as keyof typeof TICKERS]}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={PAD.l + iW / 2} y={H - 6} fontSize={11} fill="#57606a" textAnchor="middle">GDP growth (annual %) →</text>
        <text transform={`rotate(-90) translate(${-(PAD.t + iH / 2)},${14})`} fontSize={11} fill="#57606a" textAnchor="middle">CPI inflation → (capped at 45%)</text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8, fontSize: 11, color: '#57606a' }}>
        {Object.keys(RAW).map(sym => (
          <span key={sym} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: C[sym], display: 'inline-block' }} />
            <strong style={{ color: C[sym] }}>{LABELS[sym]}</strong> {TICKERS[sym as keyof typeof TICKERS]}
          </span>
        ))}
        <span style={{ color: '#8c96a0' }}>↑ = value above chart axis</span>
      </div>
    </div>
  );
}
