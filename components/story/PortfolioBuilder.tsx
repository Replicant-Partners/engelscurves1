'use client';
import React, { useState } from 'react';

/* ── Types ──────────────────────────────────────────────────────────────── */
type Archetype = 'pure' | 'structural' | 'macro';

interface PairRow {
  symbol: string; market: string; ticker: string; exchange: string;
  archetype: Archetype;
  calP: number;          // calibrated probability
  signalMult: number;    // 1.0 confirmed, 0.85 weakened, 0.75 mixed
  liquidityMult: number; // 1.0 NYSE/Nasdaq, 0.85 B3/NGX, 0.80 HOSE/IDX
  upsideIfTrue: number;  // expected price gain if thesis confirmed (0–1)
  downside: number;      // expected loss if thesis fails (negative, 0 to -1)
  verdictLabel: string;
  currency: string;
}

const PAIRS: PairRow[] = [
  { symbol:'MWG',   market:'Vietnam',   ticker:'MWG HOSE', exchange:'HOSE',   archetype:'pure',
    calP:0.412, signalMult:1.00, liquidityMult:0.80, upsideIfTrue:0.20, downside:-0.15,
    verdictLabel:'Not discounted', currency:'VND' },
  { symbol:'FMX',   market:'Mexico',    ticker:'FMX NYSE', exchange:'NYSE',   archetype:'structural',
    calP:0.368, signalMult:0.75, liquidityMult:1.00, upsideIfTrue:0.20, downside:-0.15,
    verdictLabel:'Fairly valued',  currency:'MXN' },
  { symbol:'YDUQ3', market:'Brazil',    ticker:'YDUQ3 B3', exchange:'B3',     archetype:'pure',
    calP:0.386, signalMult:1.00, liquidityMult:0.85, upsideIfTrue:0.67, downside:-0.20,
    verdictLabel:'Deeply undervalued', currency:'BRL' },
  { symbol:'MTNN',  market:'Nigeria',   ticker:'MTNN NGX', exchange:'NGX',    archetype:'macro',
    calP:0.335, signalMult:0.85, liquidityMult:0.85, upsideIfTrue:0.25, downside:-0.15,
    verdictLabel:'Cheap, growth caveat', currency:'NGN' },
  { symbol:'GGAL',  market:'Argentina', ticker:'GGAL Nasdaq', exchange:'Nasdaq', archetype:'macro',
    calP:0.454, signalMult:0.75, liquidityMult:1.00, upsideIfTrue:0.30, downside:-0.20,
    verdictLabel:'Macro play',     currency:'ARS' },
  { symbol:'SILO',  market:'Indonesia', ticker:'SILO IDX', exchange:'IDX',    archetype:'structural',
    calP:0.349, signalMult:0.75, liquidityMult:0.80, upsideIfTrue:0.20, downside:-0.20,
    verdictLabel:'Slightly rich',  currency:'IDR' },
];

/* ── Portfolio weight calculators ───────────────────────────────────────── */
type PortfolioMode = 'equal' | 'signal' | 'ev' | 'pure';

function computeWeights(mode: PortfolioMode): Record<string, number> {
  const w: Record<string, number> = {};
  if (mode === 'equal') {
    PAIRS.forEach(p => { w[p.symbol] = 1/6; });
  } else if (mode === 'signal') {
    const raw: Record<string, number> = {};
    let total = 0;
    PAIRS.forEach(p => {
      raw[p.symbol] = p.calP * p.signalMult * p.liquidityMult;
      total += raw[p.symbol];
    });
    PAIRS.forEach(p => { w[p.symbol] = raw[p.symbol] / total; });
  } else if (mode === 'ev') {
    // EV = P*upside + (1-P)*downside
    const ev: Record<string, number> = {};
    let posTotal = 0;
    PAIRS.forEach(p => {
      ev[p.symbol] = p.calP * p.upsideIfTrue + (1 - p.calP) * p.downside;
    });
    // Rank by EV; only include positive EV + blend low-EV at minimum 5%
    // Floor at 5%, scale positive EV proportionally above that
    const floor = 0.05;
    const surplus = 1 - floor * PAIRS.length;  // = 1 - 0.30 = 0.70
    const minEV = Math.min(...Object.values(ev));
    const shiftedEV: Record<string, number> = {};
    let shiftedTotal = 0;
    PAIRS.forEach(p => {
      shiftedEV[p.symbol] = ev[p.symbol] - minEV + 0.001;
      shiftedTotal += shiftedEV[p.symbol];
    });
    PAIRS.forEach(p => {
      w[p.symbol] = floor + surplus * (shiftedEV[p.symbol] / shiftedTotal);
    });
  } else if (mode === 'pure') {
    // Only pure Engel plays (MWG + YDUQ3) plus a small hedge via GGAL
    w['MWG']   = 0.35;
    w['YDUQ3'] = 0.35;
    w['GGAL']  = 0.20;
    w['FMX']   = 0.05;
    w['MTNN']  = 0.03;
    w['SILO']  = 0.02;
  }
  return w;
}

function ev(p: PairRow) {
  return p.calP * p.upsideIfTrue + (1 - p.calP) * p.downside;
}

function portfolioEV(weights: Record<string, number>) {
  return PAIRS.reduce((s, p) => s + weights[p.symbol] * ev(p), 0);
}

/* ── Palette ────────────────────────────────────────────────────────────── */
const ARCHETYPE_COLOR: Record<Archetype, string> = {
  pure:       '#2c6e49',
  structural: '#4c78a8',
  macro:      '#7c5c9e',
};
const ARCHETYPE_LABEL: Record<Archetype, string> = {
  pure:       'Pure Engel',
  structural: 'Engel + Structural',
  macro:      'Macro Overlay',
};

/* ── Pie chart ──────────────────────────────────────────────────────────── */
function PieChart({ weights }: { weights: Record<string, number> }) {
  const R = 64; const CX = 80; const CY = 80;
  const COLORS: Record<string, string> = {
    MWG: '#4c78a8', FMX: '#7c5c00', YDUQ3: '#2c6e49',
    MTNN: '#7c5c9e', GGAL: '#9e3c38', SILO: '#8b7355',
  };
  let cum = 0;
  const slices = PAIRS.map(p => {
    const pct = weights[p.symbol];
    const start = cum * 2 * Math.PI - Math.PI / 2;
    cum += pct;
    const end = cum * 2 * Math.PI - Math.PI / 2;
    const x1 = CX + R * Math.cos(start);
    const y1 = CY + R * Math.sin(start);
    const x2 = CX + R * Math.cos(end);
    const y2 = CY + R * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    const mid = (start + end) / 2;
    const lx = CX + (R + 16) * Math.cos(mid);
    const ly = CY + (R + 16) * Math.sin(mid);
    return { symbol: p.symbol, d: `M${CX},${CY} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`, color: COLORS[p.symbol], pct, lx, ly };
  });

  return (
    <svg width={160} height={160} viewBox="0 0 160 160" style={{ display: 'block' }}>
      {slices.map(s => (
        <path key={s.symbol} d={s.d} fill={s.color} stroke="white" strokeWidth={1} />
      ))}
      {slices.filter(s => s.pct >= 0.08).map(s => (
        <text key={s.symbol} x={s.lx} y={s.ly} fontSize={9} fontWeight={600}
          fill={s.color} textAnchor="middle" dominantBaseline="central">
          {s.symbol}
        </text>
      ))}
    </svg>
  );
}

/* ── EV scatter ─────────────────────────────────────────────────────────── */
function EVScatter({ weights }: { weights: Record<string, number> }) {
  const W = 320; const H = 200;
  const PAD = { t: 16, b: 32, l: 44, r: 16 };
  const iW = W - PAD.l - PAD.r; const iH = H - PAD.t - PAD.b;
  const xMin = 0.3; const xMax = 0.5;
  const yMin = -0.08; const yMax = 0.16;
  const xS = (v: number) => PAD.l + (v - xMin) / (xMax - xMin) * iW;
  const yS = (v: number) => PAD.t + iH - (v - yMin) / (yMax - yMin) * iH;
  const COLORS: Record<string, string> = {
    MWG: '#4c78a8', FMX: '#7c5c00', YDUQ3: '#2c6e49',
    MTNN: '#7c5c9e', GGAL: '#9e3c38', SILO: '#8b7355',
  };

  return (
    <svg width={W} height={H} style={{ display: 'block', overflow: 'visible' }}>
      {/* grid */}
      {[0.32,0.36,0.40,0.44,0.48].map(v => (
        <line key={v} x1={xS(v)} x2={xS(v)} y1={PAD.t} y2={PAD.t+iH} stroke="#e1e4e8" strokeWidth={0.5} />
      ))}
      {[-0.06,-0.04,-0.02,0,0.02,0.04,0.06,0.08,0.10,0.12,0.14].map(v => (
        <line key={v} x1={PAD.l} x2={PAD.l+iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5} />
      ))}
      {/* zero EV line */}
      <line x1={PAD.l} x2={PAD.l+iW} y1={yS(0)} y2={yS(0)} stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 2" />
      <text x={PAD.l - 2} y={yS(0)} fontSize={8} fill="#57606a" textAnchor="end" dominantBaseline="central">0%</text>

      {PAIRS.map(p => {
        const evVal = ev(p);
        const r = 8 + weights[p.symbol] * 28;
        const cx = xS(p.calP);
        const cy = yS(evVal);
        const above = cy < PAD.t + iH / 2;
        return (
          <g key={p.symbol}>
            <circle cx={cx} cy={cy} r={r}
              fill={COLORS[p.symbol]} fillOpacity={0.6}
              stroke={COLORS[p.symbol]} strokeWidth={1.2}
            />
            <text x={cx} y={above ? cy + r + 10 : cy - r - 4}
              fontSize={9} fontWeight={600} fill={COLORS[p.symbol]} textAnchor="middle">
              {p.symbol}
            </text>
          </g>
        );
      })}
      {/* axes */}
      {[0.32,0.36,0.40,0.44,0.48].map(v => (
        <text key={v} x={xS(v)} y={PAD.t+iH+12} fontSize={8} fill="#57606a" textAnchor="middle">{(v*100).toFixed(0)}%</text>
      ))}
      {[-0.06,-0.02,0.02,0.06,0.10,0.14].map(v => (
        <text key={v} x={PAD.l-4} y={yS(v)} fontSize={8} fill="#57606a" textAnchor="end" dominantBaseline="central">
          {(v*100).toFixed(0)}%
        </text>
      ))}
      <text x={PAD.l+iW/2} y={H-2} fontSize={9} fill="#57606a" textAnchor="middle">Calibrated probability →</text>
      <text transform={`rotate(-90) translate(${-(PAD.t+iH/2)},${12})`} fontSize={9} fill="#57606a" textAnchor="middle">Expected value</text>
    </svg>
  );
}

/* ── Risk register ───────────────────────────────────────────────────────── */
const RISKS = [
  { label: 'EM risk-off',          note: 'All 6 fall together. The portfolio has near-zero diversification against a global risk-off event — this is a concentrated EM income-growth bet.',
    pairs: ['MWG','FMX','YDUQ3','MTNN','GGAL','SILO'] },
  { label: 'USD strength',         note: 'Weakens all EM currencies simultaneously (VND, MXN, BRL, NGN, ARS, IDR). The Engel thesis is denominated in local income growth; a strong USD erases USD returns.',
    pairs: ['MWG','FMX','YDUQ3','MTNN','GGAL','SILO'] },
  { label: 'Food price spike',     note: 'Reverses the Engel transition: households in pre-transition markets (Nigeria, Indonesia) are forced back to higher food shares, delaying the mechanism.',
    pairs: ['MTNN','SILO'] },
  { label: 'China slowdown',       note: 'Vietnam (MWG) is exposed via electronics imports and export demand. Indonesia (SILO) affected indirectly via commodity prices.',
    pairs: ['MWG','SILO'] },
  { label: 'EM rate hikes (Selic/Milei)',  note: 'Brazil high Selic amplifies YDUQ3 interest costs, compressing net profit even as FCF grows. Argentina tight monetary policy slows GGAL re-rating.',
    pairs: ['YDUQ3','GGAL'] },
  { label: 'Policy reversal (FIES/BPJS)', note: 'Brazil FIES cut kills YDUQ3 enrollment. Indonesia BPJS expansion into non-emergency care cannibalises SILO private volume.',
    pairs: ['YDUQ3','SILO'] },
];

/* ── Mode buttons ────────────────────────────────────────────────────────── */
const MODES: { mode: PortfolioMode; label: string; desc: string }[] = [
  { mode: 'equal',    label: 'Equal weight', desc: '16.7% each — no active bets, maximum humility' },
  { mode: 'signal',   label: 'Signal-weighted', desc: 'P × signal × liquidity — the systematic Engel portfolio' },
  { mode: 'ev',       label: 'EV-weighted', desc: 'Expected value tilted — concentrates in asymmetric upsides' },
  { mode: 'pure',     label: 'Pure Engel', desc: 'Only confirmed Engel plays; macro overlay as satellite' },
];

/* ── Main ────────────────────────────────────────────────────────────────── */
export function PortfolioBuilder() {
  const [mode, setMode] = useState<PortfolioMode>('signal');
  const [showRisk, setShowRisk] = useState(false);
  const weights = computeWeights(mode);
  const portEV = portfolioEV(weights);

  return (
    <div>
      {/* Archetype legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {(Object.entries(ARCHETYPE_COLOR) as [Archetype, string][]).map(([k, c]) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />
            <strong style={{ color: c }}>{ARCHETYPE_LABEL[k]}</strong>
            <span style={{ color: '#57606a' }}>({PAIRS.filter(p => p.archetype === k).map(p => p.symbol).join(', ')})</span>
          </span>
        ))}
      </div>

      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {MODES.map(m => (
          <button key={m.mode} onClick={() => setMode(m.mode)}
            style={{
              padding: '5px 12px', fontSize: 11, borderRadius: 4, cursor: 'pointer',
              border: mode === m.mode ? '2px solid #1b1f23' : '1px solid #d0d7de',
              background: mode === m.mode ? '#1b1f23' : '#f6f8fa',
              color: mode === m.mode ? '#fff' : '#1b1f23',
              fontWeight: mode === m.mode ? 700 : 400,
            }}>
            {m.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 11, color: '#57606a', marginBottom: 16 }}>
        {MODES.find(m => m.mode === mode)?.desc}
      </p>

      {/* Main layout: pie + table + scatter */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>

        {/* Pie + EV */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <PieChart weights={weights} />
          <div style={{ fontSize: 11, textAlign: 'center' }}>
            <div style={{ color: '#57606a' }}>Portfolio EV</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: portEV >= 0 ? '#2c6e49' : '#9e3c38' }}>
              {portEV > 0 ? '+' : ''}{(portEV * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Weight table */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d0d7de' }}>
                {['Pair', 'Arch.', 'Cal. P', 'Weight', 'EV'].map(h => (
                  <th key={h} style={{ padding: '4px 8px', textAlign: 'left', color: '#57606a', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAIRS.sort((a,b) => weights[b.symbol] - weights[a.symbol]).map((p, i) => {
                const evVal = ev(p);
                return (
                  <tr key={p.symbol} style={{ background: i%2===0?'#f6f8fa':'#fff', borderBottom: '1px solid #e1e4e8' }}>
                    <td style={{ padding: '5px 8px', fontWeight: 600, color: ARCHETYPE_COLOR[p.archetype] }}>
                      {p.symbol}<br /><span style={{ fontWeight:400, color:'#57606a', fontSize:10 }}>{p.exchange}</span>
                    </td>
                    <td style={{ padding: '5px 8px' }}>
                      <span style={{ fontSize:9, background: ARCHETYPE_COLOR[p.archetype]+'22', color: ARCHETYPE_COLOR[p.archetype], border:'1px solid '+ARCHETYPE_COLOR[p.archetype], borderRadius:3, padding:'1px 4px' }}>
                        {p.archetype === 'pure' ? 'Pure' : p.archetype === 'structural' ? 'Struct' : 'Macro'}
                      </span>
                    </td>
                    <td style={{ padding: '5px 8px', fontVariantNumeric:'tabular-nums' }}>{(p.calP*100).toFixed(1)}%</td>
                    <td style={{ padding: '5px 8px', fontVariantNumeric:'tabular-nums', fontWeight:600 }}>
                      {(weights[p.symbol]*100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '5px 8px', fontVariantNumeric:'tabular-nums', color: evVal>=0?'#2c6e49':'#9e3c38', fontWeight:600 }}>
                      {evVal>0?'+':''}{(evVal*100).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize:10, color:'#8c96a0', marginTop:6 }}>
            EV = P(thesis) × upside + (1−P) × downside. Upside: YDUQ3 +67% (PE 6x→10x), GGAL +30% (P/B→1.5x), MTNN +25%, others +20%. Downside: −15% to −20%.
          </p>
        </div>

        {/* EV Scatter */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontSize: 10, color: '#8c96a0', marginBottom: 4 }}>
            Bubble size = portfolio weight. X = calibrated probability. Y = expected value. Dashed = EV=0 line.
          </div>
          <EVScatter weights={weights} />
        </div>
      </div>

      {/* Key insight */}
      <div style={{ background:'#f0f4f8', border:'1px solid #d0d7de', borderRadius:6, padding:'12px 14px', marginBottom:16 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'#4c78a8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:6 }}>Key insight — entry timing</div>
        <p style={{ fontSize:12, color:'#1b1f23', lineHeight:1.65, margin:0 }}>
          The best risk/reward for this portfolio was <em>before</em> the early signals confirmed the thesis — MWG at 11.2× P/E, YDUQ3 at 6× fwd P/E before FCF reached R$1B.
          Phase 4 (early signals) is not a buy signal by itself: it tells you the thesis is playing out and reduces the probability of a permanent loss. But the expected value declines as confirmation arrives because the price has already moved.
          The asymmetric case remaining is <strong>YDUQ3</strong> (+13.6% EV): the market still prices the stock on revenue (+3.2%) rather than FCF (+32%), creating a persistent mispricing if the deleveraging path continues.
        </p>
      </div>

      {/* Risk register toggle */}
      <button onClick={() => setShowRisk(!showRisk)}
        style={{ fontSize:11, color:'#4c78a8', background:'none', border:'1px solid #d0d7de', borderRadius:4, padding:'5px 12px', cursor:'pointer', marginBottom:8 }}>
        {showRisk ? '▲ Hide' : '▼ Show'} portfolio risk register (what kills everything simultaneously)
      </button>

      {showRisk && (
        <div style={{ marginTop:8 }}>
          {RISKS.map((r, i) => (
            <div key={i} style={{ display:'flex', gap:12, padding:'8px 0', borderBottom:'1px solid #e1e4e8', alignItems:'flex-start' }}>
              <div style={{ flex:'0 0 160px', fontSize:11, fontWeight:600, color:'#1b1f23' }}>{r.label}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:11, color:'#57606a', margin:0, lineHeight:1.55 }}>{r.note}</p>
                <div style={{ display:'flex', gap:4, marginTop:4, flexWrap:'wrap' }}>
                  {r.pairs.map(s => (
                    <span key={s} style={{ fontSize:10, border:'1px solid #d0d7de', borderRadius:3, padding:'1px 5px', color:'#57606a' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize:10, color:'#8c96a0', marginTop:12 }}>
        Signal multipliers: Confirmed=1.00, Weakened=0.85, Mixed=0.75. Liquidity: NYSE/Nasdaq=1.00, B3/NGX=0.85, HOSE/IDX=0.80.
        This is an analytical framework, not investment advice. All EV calculations depend on assumptions about upside/downside that carry significant uncertainty.
      </p>
    </div>
  );
}
