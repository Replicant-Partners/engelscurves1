'use client';
import React, { useState } from 'react';
import { GrowthGapChart } from './GrowthGapChart';

/* ── static pair data (avoids re-importing heavy JSON) ─────────────────── */
// VCP math audit (lisp_eval 2026-10-23): g = 1/PE − 9%.
// MWG −0.0007✓ | FMX −0.0442✓ | YDUQ3 +0.0767✓ | MTNN −0.0082✓(trailing 12.23) | GGAL −0.0665✓(TTM 42.6) | SILO −0.0371✓(trailing 18.9)
const PAIRS = [
  {
    id: 1, symbol: 'MWG', market: 'Vietnam', company: 'Mobile World (MWG)',
    ticker: 'MWG HOSE',
    description: "Vietnam's largest multi-category retailer: 5,000+ stores (smartphones, appliances, groceries, pharmacy). Revenue +16.4% FY2025. P/E re-rated 11.2x→17.9x in 6 months.",
    engelPhase: 'Transition', eta: 1.15,
    category: 'Consumer electronics / durables',
    impliedG: -0.0007, actualG: 0.164, pe: 11.2, peType: 'fwd',  // FY2025: revenue +16.4%; NPAT +89.4%
    verdictCode: 'NOT_DISCOUNTED', verdictLabel: 'Not discounted',
    prob: 0.412, forecastQ: 'fwd P/E > 15× by Dec 2027',
    chain: 'Income rises → durables share ↑ (η=1.15) → households buy first smartphone/fridge → MWG revenue grows faster than income; FY2025: revenue +16.4%, NPAT +89.4% (VND 7.1tn); 2026 plan: +19% revenue; P/E TTM re-rated 11.2x→17.9x by Apr-2026 — thesis partially pricing in',
    falsifier: 'Import-dependent electronics: USD/VND appreciation or China export price hike compresses margins independently of income growth.',
  },
  {
    id: 2, symbol: 'FMX', market: 'Mexico', company: 'FEMSA (FMX)',
    ticker: 'FMX NYSE',
    description: "Mexico's FEMSA: 25,587 OXXO stores (13M tickets/day), world's largest Coca-Cola bottler, 3,000+ pharmacies. Revenue +7.6% FY2025. OXXO SSSG recovered to +4.4% in Q4.",
    engelPhase: 'Post-transition', eta: 1.28,
    category: 'Convenience retail + Health/pharma',
    impliedG: -0.0442, actualG: 0.076, pe: 21.82, peType: 'fwd',  // FY2025 AR: +7.6%
    verdictCode: 'FAIRLY_VALUED', verdictLabel: 'Fairly valued',
    prob: 0.368, forecastQ: 'TSR > 20% + Health div > 15% by Dec 2027',
    chain: 'Post-transition: food at 25.7% → freed budget → OXXO convenience (η=1.28) + pharma (η=1.26) → FEMSA captures both at 25,587 OXXO + 3 k+ pharmacies; Health div +10.5% FY2025; 13M OXXO tickets/day in Mexico',
    falsifier: 'Tepid Mexico consumer spending (FEMSA Q2-2026); OXXO transactions −1.1%; informal/e-commerce competition; MXN depreciation.',
  },
  {
    id: 3, symbol: 'YDUQ3', market: 'Brazil', company: 'Yduqs (YDUQ3)',
    ticker: 'YDUQ3 B3',
    description: "Brazil's 2nd-largest private university group: 1.37M students across Estácio, Ibmec (premium) and IDOMED (medical). FCF hit R$1B (+32%) in FY2025 — a historic milestone.",
    engelPhase: 'Post-transition', eta: 0.97,
    category: 'Private university education',
    impliedG: 0.0767, actualG: 0.32, pe: 6.0, peType: 'fwd',  // FCF +32% FY2025; revenue +3.2% < implied g
    verdictCode: 'DEEPLY_UNDERVALUED', verdictLabel: 'Deeply undervalued',
    prob: 0.386, forecastQ: 'FCF > 20% pa FY2026–27, no FIES cut',
    chain: 'Post-transition (food 16.2%) → first-generation university access → premium education (IDOMED + Ibmec = 44% EBITDA) → FCF R$1.05B (+32% FY2025, historic milestone); tension: revenue +3.2% < implied g 7.7% → on revenue basis slightly overvalued; on FCF basis (32%) still deeply undervalued; net debt R$2.48B (leverage 1.46x, down from 1.55x)',
    falsifier: 'FIES cut → enrollment collapse → FCF reversal; EV R$7.1B vs mkt cap R$2.8B means debt risk amplifies any policy shock.',
  },
  {
    // implied_g computed from trailing P/E 12.23 (NGX consensus fwd not available; naira distortion makes fwd estimates unreliable)
    // lisp_eval: 1/12.23 − 0.09 = −0.00823 ✓
    id: 4, symbol: 'MTNN', market: 'Nigeria', company: 'MTN Nigeria (MTNN)',
    ticker: 'MTNN NGX',
    description: "Nigeria's largest mobile operator: 87M subscribers, 38.5% market share, 53M active data users. Service revenue +55.1% (NGN, real growth) in FY2025. MoMo fintech in development.",
    engelPhase: 'Paradox', eta: 0.79,
    category: 'Mobile data / fintech (gateway luxury)',
    impliedG: -0.0082, actualG: 0.259, pe: 12.23, peType: 'trailing',
    verdictCode: 'CHEAP_WITH_CAVEAT', verdictLabel: 'Cheap, growth caveat',
    prob: 0.335, forecastQ: 'Data revenue > 20% YoY H2-26 + FY27 (organic)',
    chain: 'Engel blocked (food=59% flat despite GDP $7.8k) → data is first non-food purchase at all income levels → MTN captures data + fintech; FY2025: service rev +55.1% NGN (naira strengthened N1535→N1436/USD — real growth); EBITDA 52.7%; market share 38.5% (NCC); 53.2M data users',
    falsifier: 'Revenue growth is naira re-pricing after 2023 devaluation; if naira stabilises and real income stagnates, growth reverts to population + penetration only.',
  },
  {
    // implied_g from TTM P/E 42.6; no reliable fwd P/E (Argentina hyperinflation distorts forward earnings)
    // lisp_eval: 1/42.6 − 0.09 = −0.06653 ✓
    id: 5, symbol: 'GGAL', market: 'Argentina', company: 'Galicia (GGAL)',
    ticker: 'GGAL Nasdaq',
    description: "Argentina's largest private financial group (Banco Galicia + ex-HSBC + Naranja X fintech). 432 branches, 15.1% private loan market share. P/B recovered from 0.25x (2022) to 1.15x (2026).",
    engelPhase: 'Post-transition', eta: 1.37,
    category: 'Financial services (macro-stabilisation play)',
    impliedG: -0.0665, actualG: 0.15, pe: 42.6, peType: 'TTM',
    verdictCode: 'MACRO_PLAY', verdictLabel: 'Macro play',
    prob: 0.454, forecastQ: 'P/B > 1.5× by Dec 2027',
    chain: 'GDP post-transition (η=1.37 for financial services) BUT hyperinflation overwhelms Engel → GGAL is a Milei-stabilisation trade; P/B 0.96×, JPM target $85',
    falsifier: 'Milei programme fails → inflation returns → GGAL earnings compress in USD → stays below book value.',
  },
  {
    // implied_g from trailing P/E 18.9 (IDX analysts' fwd consensus not published separately)
    // lisp_eval: 1/18.9 − 0.09 = −0.03709 ✓
    id: 6, symbol: 'SILO', market: 'Indonesia', company: 'Siloam (SILO)',
    ticker: 'SILO IDX',
    description: "Indonesia's largest private hospital network: 41 hospitals, 4,310 beds, 4.35M outpatient visits/year. ~9% private hospital market share. EBITDA margin expanding to 29.1% FY2025.",
    engelPhase: 'Transition', eta: 1.26,
    category: 'Private hospital healthcare',
    impliedG: -0.0371, actualG: 0.052, pe: 18.9, peType: 'trailing',  // FY2025: +5.2% revenue
    verdictCode: 'SLIGHTLY_RICH', verdictLabel: 'Slightly rich',
    prob: 0.349, forecastQ: 'Revenue > 12% FY2027 + IDX outperform >10%',
    chain: 'Transition (66% exit by 2030) → health share ↑ (η=1.26) → middle class upgrades from public BPJS → Siloam: 9% private hospital market share; 41 hospitals; EBITDA 29.1% FY2025; revenue +5.2% — BPJS headwind visible but EBITDA margin expanding',
    falsifier: 'BPJS covers 95% of population; any expansion to non-emergency care cannibalises private volume; current 7% growth suggests Engel not yet showing.',
  },
] as const;

type Pair = (typeof PAIRS)[number];

/* ── verdict → muted palette color ─────────────────────────────────────── */
const VERDICT_COLOR: Record<string, string> = {
  NOT_DISCOUNTED:    '#4c78a8',
  DEEPLY_UNDERVALUED:'#2c6e49',
  FAIRLY_VALUED:     '#57606a',
  CHEAP_WITH_CAVEAT: '#7c5c9e',
  MACRO_PLAY:        '#9e4c38',
  SLIGHTLY_RICH:     '#8b7355',
};

const PHASE_LABEL: Record<string, string> = {
  'Transition':     'Transition',
  'Post-transition':'Post',
  'Paradox':        'Paradox',
};

/* ── Probability badge ──────────────────────────────────────────────────── */
function ProbBadge({ p }: { p: number }) {
  const pct = Math.round(p * 100);
  const color = p >= 0.45 ? '#2c6e49' : p >= 0.35 ? '#7c5c9e' : '#9e4c38';
  return (
    <span style={{ color, border: `1px solid ${color}`, borderRadius: 4, padding: '1px 6px', fontSize: 11, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      {pct}%
    </span>
  );
}

/* ── Tag span ───────────────────────────────────────────────────────────── */
function Tag({ t }: { t: 'OBS' | 'INF' | 'JDG' | 'GAP' }) {
  const colors: Record<string, string> = { OBS: '#2c6e49', INF: '#4c78a8', JDG: '#7c5c9e', GAP: '#9e4c38' };
  return <span style={{ fontSize: 10, fontWeight: 700, color: colors[t], border: `1px solid ${colors[t]}`, borderRadius: 3, padding: '0 4px', marginRight: 4 }}>{t}</span>;
}

/* ── Growth-gap scatter ─────────────────────────────────────────────────── */
function GrowthGapScatter({ selected, hovered, onHover, onClick }:
  { selected: string | null; hovered: string | null; onHover: (s: string | null) => void; onClick: (s: string) => void }) {
  const W = 800, H = 420;
  const MARGIN = { top: 20, right: 30, bottom: 48, left: 52 };
  const iW = W - MARGIN.left - MARGIN.right;
  const iH = H - MARGIN.top - MARGIN.bottom;

  // axes range
  const xMin = -0.09, xMax = 0.12;
  const yMin = 0, yMax = 0.38;

  const xS = (v: number) => ((v - xMin) / (xMax - xMin)) * iW;
  const yS = (v: number) => iH - ((v - yMin) / (yMax - yMin)) * iH;

  // diagonal "fairly valued" line: y = x
  const diagX0 = Math.max(xMin, yMin); // 0
  const diagX1 = Math.min(xMax, yMax); // 0.12

  const xTicks = [-0.08, -0.06, -0.04, -0.02, 0, 0.02, 0.04, 0.06, 0.08, 0.10];
  const yTicks = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block', overflow: 'visible' }}>
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        {/* grid */}
        {xTicks.map(v => (
          <line key={v} x1={xS(v)} x2={xS(v)} y1={0} y2={iH} stroke="#e1e4e8" strokeWidth={0.5} />
        ))}
        {yTicks.map(v => (
          <line key={v} x1={0} x2={iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5} />
        ))}

        {/* "fairly valued" diagonal */}
        <line
          x1={xS(diagX0)} y1={yS(diagX0)}
          x2={xS(diagX1)} y2={yS(diagX1)}
          stroke="#d0d7de" strokeWidth={1} strokeDasharray="4 3"
        />
        <text x={xS(0.07)} y={yS(0.065)} fill="#57606a" fontSize={9} textAnchor="middle">fairly valued</text>

        {/* zero lines */}
        <line x1={xS(0)} x2={xS(0)} y1={0} y2={iH} stroke="#57606a" strokeWidth={0.8} />
        <line x1={0} x2={iW} y1={yS(0)} y2={yS(0)} stroke="#57606a" strokeWidth={0.8} />

        {/* bubbles */}
        {PAIRS.map((p) => {
          const cx = xS(p.impliedG);
          const cy = yS(p.actualG);
          const r = 7 + p.prob * 14; // size by calibrated probability
          const color = VERDICT_COLOR[p.verdictCode];
          const isSelected = selected === p.symbol;
          const labelAbove = p.symbol === 'YDUQ3';
          return (
            <g key={p.symbol}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover?.(p.symbol)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onClick?.(p.symbol)}
          >
              <circle
                cx={cx} cy={cy} r={r}
                fill={color} fillOpacity={isSelected ? 0.85 : 0.45}
                stroke={color} strokeWidth={isSelected ? 2 : 1}
              />
              <text
                x={cx} y={labelAbove ? cy - r - 3 : cy + r + 11}
                fill={color} fontSize={10} fontWeight={600}
                textAnchor="middle"
              >
                {p.symbol}
              </text>
            </g>
          );
        })}

        {/* axes labels */}
        {xTicks.map(v => (
          <text key={v} x={xS(v)} y={iH + 14} fill="#57606a" fontSize={9} textAnchor="middle">
            {(v * 100).toFixed(0)}%
          </text>
        ))}
        {yTicks.map(v => (
          <text key={v} x={-6} y={yS(v) + 3} fill="#57606a" fontSize={9} textAnchor="end">
            {(v * 100).toFixed(0)}%
          </text>
        ))}

        <text x={iW / 2} y={iH + 36} fill="#57606a" fontSize={10} textAnchor="middle">
          Implied terminal growth¹ (g = 1/P/E − 9%)  [INF]
        </text>
        <text
          transform={`rotate(-90) translate(${-iH / 2},${-38})`}
          fill="#57606a" fontSize={10} textAnchor="middle"
        >
          Actual revenue growth (most recent year)  [OBS]
        </text>

        {/* "above line = underpriced growth" annotation */}
        <text x={10} y={yS(0.31)} fill="#4c78a8" fontSize={9} fontStyle="italic">
          above diagonal:
        </text>
        <text x={10} y={yS(0.29)} fill="#4c78a8" fontSize={9} fontStyle="italic">
          market underprices growth
        </text>
      </g>
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export function ValuationChains() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const sel = PAIRS.find(p => p.symbol === selected) ?? null;
  const hov = PAIRS.find(p => p.symbol === hovered) ?? null;

  const handleClick = (sym: string) => setSelected(s => s === sym ? null : sym);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* ── SECTION 1: The position map ─────────────────────────────── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#57606a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          SECTION 1 — THE POSITION MAP
        </p>
        <h4 style={{ fontSize: 17, fontWeight: 700, color: '#1b1f23', marginBottom: 12 }}>
          Where does each company sit relative to market expectations?
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 20, alignItems: 'start' }}>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: '#1b1f23', margin: 0 }}>
            <Tag t="INF" />Each bubble is one company. The x-axis shows the growth rate the current P/E implicitly assumes the company will sustain forever (implied terminal growth = 1/P/E − 9%). The y-axis shows the growth actually delivered in the most recent year. <strong>Bubbles above the diagonal mean the market underprices growth</strong> — it assumes less than we currently observe.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: '#57606a', margin: 0 }}>
            <Tag t="JDG" />The two clearest outliers: YDUQ3 at the top (FCF +32%, yet P/E implies only 7.7% terminal growth) and MWG to the right (revenue +16%, yet P/E implies near-zero). GGAL and MTNN are above the diagonal too, but their growth partly reflects macro factors rather than the Engel mechanism. Bubble size = calibrated probability.
          </p>
        </div>

        <GrowthGapScatter selected={selected} hovered={hovered} onHover={setHovered} onClick={handleClick} />

        {/* Hover info — fixed height so no layout shift */}
        <div style={{ marginTop: 10, height: 40, display: 'flex', alignItems: 'center' }}>
          {hov ? (
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap', fontSize: 12 }}>
              <span style={{ fontWeight: 700, color: VERDICT_COLOR[hov.verdictCode] }}>{hov.company}</span>
              <span style={{ color: '#57606a' }}>{hov.category}</span>
              <span>implied <strong style={{ color: hov.impliedG < 0 ? '#9e4c38' : '#2c6e49' }}>{(hov.impliedG*100).toFixed(1)}%</strong></span>
              <span>actual <strong style={{ color: '#2c6e49' }}>+{(hov.actualG*100).toFixed(1)}%</strong></span>
              <span>gap <strong style={{ color: '#4c78a8' }}>+{((hov.actualG - hov.impliedG)*100).toFixed(1)} pp</strong></span>
              <ProbBadge p={hov.prob} />
              <span style={{ color: '#8c96a0', fontSize: 11 }}>click to expand →</span>
            </div>
          ) : (
            <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a bubble or bar to inspect</span>
          )}
        </div>

        <p style={{ marginTop: 4, fontSize: 10, color: '#8c96a0', lineHeight: 1.5 }}>
          ¹ Implied g = 1/P/E − 9% discount rate. P/E type: MWG, FMX, YDUQ3 forward; MTNN &amp; SILO trailing; GGAL TTM. All six re-verified via lisp_eval 2026-10-23.
        </p>
      </div>

      {/* ── SECTION 2: The six pairs ─────────────────────────────────── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#57606a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          SECTION 2 — THE SIX PAIRS
        </p>
        <h4 style={{ fontSize: 17, fontWeight: 700, color: '#1b1f23', marginBottom: 8 }}>
          Income chain, verdict, and calibrated probability
        </h4>
        <p style={{ fontSize: 13, lineHeight: 1.75, color: '#57606a', marginBottom: 20 }}>
          Each row is one market-company pair. Click to expand the full Engel chain (income change → category demand → company revenue), the one-year forecast question, and the falsifier that would invalidate the thesis. Probabilities are calibrated via Tetlock superforecasting + scenario_calibrate shrinkage toward reference-class base rates.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d0d7de', background: '#f6f8fa' }}>
                {['Market / Company', 'Phase', 'η', 'Implied g¹', 'Actual g', 'Gap', 'Verdict', 'P(thesis)'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#57606a', fontWeight: 600, whiteSpace: 'nowrap', fontSize: 11, letterSpacing: '0.03em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAIRS.map((p, i) => {
                const isEven = i % 2 === 0;
                const isSelected = selected === p.symbol;
                const gap = p.actualG - p.impliedG;
                return (
                  <React.Fragment key={p.symbol}>
                    <tr
                      style={{
                        background: isSelected ? '#eef4fb' : isEven ? '#f6f8fa' : '#fff',
                        borderBottom: isSelected ? 'none' : '1px solid #e1e4e8',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onClick={() => setSelected(isSelected ? null : p.symbol)}
                    >
                      <td style={{ padding: '14px 14px', fontWeight: 700, color: VERDICT_COLOR[p.verdictCode], fontSize: 13 }}>
                        {p.market}
                        <div style={{ fontWeight: 400, color: '#8c96a0', fontSize: 11, marginTop: 2 }}>{p.ticker}</div>
                        <div style={{ fontWeight: 400, color: '#57606a', fontSize: 12, marginTop: 6, lineHeight: 1.55, fontStyle: 'italic' }}>{(p as any).description}</div>
                      </td>
                      <td style={{ padding: '14px 14px', color: '#57606a' }}>
                        <span style={{ fontSize: 10, border: '1px solid #d0d7de', borderRadius: 3, padding: '2px 6px', whiteSpace: 'nowrap' }}>
                          {PHASE_LABEL[p.engelPhase] ?? p.engelPhase}
                        </span>
                      </td>
                      <td style={{ padding: '14px 14px', fontVariantNumeric: 'tabular-nums', fontSize: 13 }}>{p.eta.toFixed(2)}</td>
                      <td style={{ padding: '14px 14px', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: p.impliedG < 0 ? '#9e4c38' : '#2c6e49', fontWeight: 600 }}>
                        {(p.impliedG * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '14px 14px', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: '#2c6e49', fontWeight: 600 }}>
                        +{(p.actualG * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '14px 14px', fontVariantNumeric: 'tabular-nums', fontSize: 13, fontWeight: 700, color: '#4c78a8' }}>
                        +{(gap * 100).toFixed(1)} pp
                      </td>
                      <td style={{ padding: '14px 14px' }}>
                        <span style={{ color: VERDICT_COLOR[p.verdictCode], fontWeight: 600, fontSize: 12 }}>
                          {p.verdictLabel}
                        </span>
                      </td>
                      <td style={{ padding: '14px 14px' }}>
                        <ProbBadge p={p.prob} />
                      </td>
                    </tr>

                    {/* Inline expanded detail */}
                    {isSelected && (
                      <tr style={{ background: '#eef4fb', borderBottom: '1px solid #d0d7de' }}>
                        <td colSpan={8} style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, color: '#57606a', letterSpacing: '0.06em', marginBottom: 4 }}>ABOUT THE COMPANY</p>
                              <p style={{ fontSize: 13, lineHeight: 1.65, margin: '0 0 10px', color: '#1b1f23' }}>{(sel as any).description}</p>
                              <p style={{ fontSize: 10, fontWeight: 700, color: '#57606a', letterSpacing: '0.06em', marginBottom: 6 }}>ENGEL CHAIN</p>
                              <p style={{ fontSize: 12, lineHeight: 1.65, margin: 0 }}><Tag t="INF" />{sel!.chain}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, color: '#57606a', letterSpacing: '0.06em', marginBottom: 6 }}>FORECAST QUESTION</p>
                              <p style={{ fontSize: 12, lineHeight: 1.65, margin: 0, marginBottom: 8 }}><Tag t="JDG" />{sel!.forecastQ}</p>
                              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#57606a', flexWrap: 'wrap' }}>
                                <span>{sel!.peType} P/E <strong>{sel!.pe}×</strong></span>
                                <span>implied g <strong style={{ color: sel!.impliedG < 0 ? '#9e4c38' : '#2c6e49' }}>{(sel!.impliedG * 100).toFixed(1)}%</strong></span>
                                <span>actual <strong style={{ color: '#2c6e49' }}>+{(sel!.actualG * 100).toFixed(1)}%</strong></span>
                                <ProbBadge p={sel!.prob} />
                              </div>
                            </div>
                            <div>
                              <p style={{ fontSize: 10, fontWeight: 700, color: '#9e3c38', letterSpacing: '0.06em', marginBottom: 6 }}>FALSIFIER</p>
                              <p style={{ fontSize: 12, lineHeight: 1.65, color: '#9e3c38', margin: 0 }}>{sel!.falsifier}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SECTION 3: The growth gap ────────────────────────────────── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#57606a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          SECTION 3 — THE GROWTH GAP
        </p>
        <h4 style={{ fontSize: 17, fontWeight: 700, color: '#1b1f23', marginBottom: 8 }}>
          What the price assumes vs what the company delivers
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 20, alignItems: 'start' }}>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: '#1b1f23', margin: 0 }}>
            <Tag t="OBS" />Each pair has two bars: the grey bar is what the current P/E implies the company will grow forever (the market's embedded assumption); the coloured bar is actual recent revenue or FCF growth. The larger the gap between the two bars, the larger the apparent mispricing — if the recent growth rate is sustainable.
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: '#57606a', margin: 0 }}>
            <Tag t="JDG" />YDUQ3 has the widest gap: 7.7% implied vs 32% FCF actual (24.3pp). This is the most asymmetric case by expected value (+13.6% EV). MWG is second: near-zero implied vs 16.4% actual. The key question for both: is the recent growth rate persistent, or a one-cycle event? The falsifier for each pair answers this directly.
          </p>
        </div>
        {/* Fixed-height hover info — no layout shift */}
        <div style={{ height: 36, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          {hov ? (
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', fontSize: 12 }}>
              <span style={{ fontWeight: 700, color: VERDICT_COLOR[hov.verdictCode] }}>{hov.company}</span>
              <span>implied <strong style={{ color: hov.impliedG < 0 ? '#9e4c38' : '#2c6e49' }}>{(hov.impliedG*100).toFixed(1)}%</strong></span>
              <span>actual <strong style={{ color: '#2c6e49' }}>+{(hov.actualG*100).toFixed(1)}%</strong></span>
              <span>gap <strong style={{ color: '#4c78a8' }}>+{((hov.actualG - hov.impliedG)*100).toFixed(1)} pp</strong></span>
              <ProbBadge p={hov.prob} />
              {!selected && <span style={{ color: '#8c96a0', fontSize: 11 }}>click to expand chain →</span>}
            </div>
          ) : (
            <span style={{ color: '#c8ced4', fontSize: 11 }}>hover a bar to inspect</span>
          )}
        </div>
        <GrowthGapChart selected={selected} hovered={hovered} onHover={setHovered} onClick={handleClick} />
      </div>

      {/* Methodology note — collapsed */}
      <details style={{ fontSize: 11, color: '#57606a', borderTop: '1px solid #e1e4e8', paddingTop: 16 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>Methodology — probability calibration</summary>
        <p style={{ marginTop: 8, lineHeight: 1.7 }}>
          Calibrated probabilities follow Tetlock &amp; Gardner (2015): question triage, Fermi sub-question decomposition (5 questions per pair), outside-view base rate, inside-view adjustment, dragonfly-eye synthesis, and shrinkage toward the base rate via scenario_calibrate. All six forecast IDs are registered for Brier scoring.
        </p>
        <p style={{ marginTop: 6, lineHeight: 1.7 }}>
          <Tag t="GAP" />Implied terminal growth = 1/P/E − 9% discount rate — a residual of what the current price assumes, not a forecast. Actual growth = most recent annual revenue growth per primary filings.
        </p>
      </details>

    </div>
  );
}
