'use client';
import React from 'react';

interface GapRow { symbol: string; ticker: string; impliedG: number; actualG: number; peLabel: string; }

const PAIRS: GapRow[] = [
  { symbol:'YDUQ3', ticker:'B3',    impliedG: 0.0767, actualG: 0.32,  peLabel:'fwd 6.0×' },
  { symbol:'MTNN',  ticker:'NGX',   impliedG:-0.0082, actualG: 0.259, peLabel:'trail 12.2×' },
  { symbol:'MWG',   ticker:'HOSE',  impliedG:-0.0007, actualG: 0.164, peLabel:'fwd 11.2×' },
  { symbol:'GGAL',  ticker:'Nasdaq',impliedG:-0.0665, actualG: 0.15,  peLabel:'TTM 42.6×' },
  { symbol:'FMX',   ticker:'NYSE',  impliedG:-0.0442, actualG: 0.076, peLabel:'fwd 21.8×' },
  { symbol:'SILO',  ticker:'IDX',   impliedG:-0.0371, actualG: 0.052, peLabel:'trail 18.9×' },
];

const COLOR: Record<string, string> = {
  MWG: '#4c78a8', FMX: '#7c5c00', YDUQ3: '#2c6e49',
  MTNN: '#7c5c9e', GGAL: '#9e3c38', SILO: '#8b7355',
};

export function GrowthGapChart() {
  const W = 500; const BAR_H = 20; const GAP = 10;
  const H = PAIRS.length * (BAR_H * 2 + GAP + 10) + 36;
  const PAD_L = 80; const ZERO_PCT = -0.10; const MAX_PCT = 0.38;
  const RANGE = MAX_PCT - ZERO_PCT;
  const xS = (v: number) => PAD_L + ((v - ZERO_PCT) / RANGE) * (W - PAD_L - 20);

  return (
    <div>
      <p style={{ fontSize: 10, color: '#57606a', marginBottom: 8 }}>
        Each pair shows two bars: implied terminal growth (what the current P/E says the market expects) and actual recent revenue growth. The gap between them is the market's "mispricing" — above the implied = market underprices growth.
        P/E type in parentheses (fwd/trailing/TTM). Implied g = 1/P/E − 9% discount rate.
      </p>
      <svg width={W} height={H} style={{ display: 'block', overflow: 'visible', maxWidth: '100%' }}>
        {/* zero line */}
        <line x1={xS(0)} x2={xS(0)} y1={20} y2={H - 14} stroke="#57606a" strokeWidth={0.8} />
        <text x={xS(0)} y={H - 2} fontSize={8} fill="#57606a" textAnchor="middle">0%</text>

        {/* tick marks */}
        {[-0.08,-0.04,0,0.04,0.08,0.12,0.16,0.20,0.24,0.28,0.32].map(v => (
          <g key={v}>
            <line x1={xS(v)} x2={xS(v)} y1={18} y2={H - 14} stroke="#e1e4e8" strokeWidth={0.5} />
            <text x={xS(v)} y={H - 4} fontSize={7} fill="#8c96a0" textAnchor="middle">{(v*100).toFixed(0)}%</text>
          </g>
        ))}

        {PAIRS.map((p, i) => {
          const y0 = 20 + i * (BAR_H * 2 + GAP + 10);
          const color = COLOR[p.symbol];
          const gap = p.actualG - p.impliedG;

          // implied g bar (may be negative)
          const impliedX = p.impliedG >= 0 ? xS(0) : xS(p.impliedG);
          const impliedW = Math.abs(xS(p.impliedG) - xS(0));

          // actual g bar (positive)
          const actualW = xS(p.actualG) - xS(0);

          return (
            <g key={p.symbol}>
              {/* label */}
              <text x={PAD_L - 6} y={y0 + BAR_H + 4} fontSize={11} fontWeight={700}
                fill={color} textAnchor="end">{p.symbol}</text>
              <text x={PAD_L - 6} y={y0 + BAR_H + 14} fontSize={8} fill="#8c96a0" textAnchor="end">{p.peLabel}</text>

              {/* implied g */}
              <rect x={impliedX} y={y0} width={Math.max(impliedW, 3)} height={BAR_H}
                fill={p.impliedG >= 0 ? '#d0d7de' : '#f4c4c2'} stroke="#d0d7de" strokeWidth={0.5} rx={2} />
              <text x={impliedX + (p.impliedG >= 0 ? Math.max(impliedW,3)+3 : -3)} y={y0 + BAR_H/2 + 4}
                fontSize={8} fill="#57606a"
                textAnchor={p.impliedG >= 0 ? 'start' : 'end'}>
                {p.impliedG >= 0 ? '+' : ''}{(p.impliedG*100).toFixed(1)}%
              </text>
              <text x={PAD_L - 50} y={y0 + BAR_H/2 + 4} fontSize={8} fill="#57606a" textAnchor="start">implied g</text>

              {/* actual growth */}
              <rect x={xS(0)} y={y0 + BAR_H + 3} width={Math.max(actualW, 4)} height={BAR_H}
                fill={color} fillOpacity={0.75} rx={2} />
              <text x={xS(0) + Math.max(actualW, 4) + 3} y={y0 + BAR_H * 2 + 3 + BAR_H/2 - 6}
                fontSize={9} fontWeight={700} fill={color}>
                +{(p.actualG*100).toFixed(1)}%
              </text>
              <text x={PAD_L - 50} y={y0 + BAR_H + 3 + BAR_H/2 + 4} fontSize={8} fill="#57606a" textAnchor="start">actual g</text>

              {/* gap annotation */}
              <text x={xS(Math.max(p.actualG, p.impliedG)) + 40} y={y0 + BAR_H + 10}
                fontSize={9} fontWeight={700} fill={gap > 0 ? '#2c6e49' : '#9e3c38'} textAnchor="start">
                gap +{(gap*100).toFixed(1)}pp
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
