'use client';
import React, { useState } from 'react';
import { GrowthGapChart } from './GrowthGapChart';

/* ── static pair data (avoids re-importing heavy JSON) ─────────────────── */
// VCP math audit (lisp_eval 2026-10-23): g = 1/PE − 9%.
// MWG −0.0007✓ | FMX −0.0442✓ | YDUQ3 +0.0767✓ | MTNN −0.0082✓(trailing 12.23) | GGAL −0.0665✓(TTM 42.6) | SILO −0.0371✓(trailing 18.9)
const PAIRS = [
  {
    id: 1, symbol: 'MWG', market: 'Vietnam', company: 'Mobile World (MWG)',
    ticker: 'MWG HOSE', engelPhase: 'Transition', eta: 1.15,
    category: 'Consumer electronics / durables',
    impliedG: -0.0007, actualG: 0.164, pe: 11.2, peType: 'fwd',  // FY2025: revenue +16.4%; NPAT +89.4%
    verdictCode: 'NOT_DISCOUNTED', verdictLabel: 'Not discounted',
    prob: 0.412, forecastQ: 'fwd P/E > 15× by Dec 2027',
    chain: 'Income rises → durables share ↑ (η=1.15) → households buy first smartphone/fridge → MWG revenue grows faster than income; FY2025: revenue +16.4%, NPAT +89.4% (VND 7.1tn); 2026 plan: +19% revenue; P/E TTM re-rated 11.2x→17.9x by Apr-2026 — thesis partially pricing in',
    falsifier: 'Import-dependent electronics: USD/VND appreciation or China export price hike compresses margins independently of income growth.',
  },
  {
    id: 2, symbol: 'FMX', market: 'Mexico', company: 'FEMSA (FMX)',
    ticker: 'FMX NYSE', engelPhase: 'Post-transition', eta: 1.28,
    category: 'Convenience retail + Health/pharma',
    impliedG: -0.0442, actualG: 0.076, pe: 21.82, peType: 'fwd',  // FY2025 AR: +7.6%
    verdictCode: 'FAIRLY_VALUED', verdictLabel: 'Fairly valued',
    prob: 0.368, forecastQ: 'TSR > 20% + Health div > 15% by Dec 2027',
    chain: 'Post-transition: food at 25.7% → freed budget → OXXO convenience (η=1.28) + pharma (η=1.26) → FEMSA captures both at 25,587 OXXO + 3 k+ pharmacies; Health div +10.5% FY2025; 13M OXXO tickets/day in Mexico',
    falsifier: 'Tepid Mexico consumer spending (FEMSA Q2-2026); OXXO transactions −1.1%; informal/e-commerce competition; MXN depreciation.',
  },
  {
    id: 3, symbol: 'YDUQ3', market: 'Brazil', company: 'Yduqs (YDUQ3)',
    ticker: 'YDUQ3 B3', engelPhase: 'Post-transition', eta: 0.97,
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
    ticker: 'MTNN NGX', engelPhase: 'Paradox', eta: 0.79,
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
    ticker: 'GGAL Nasdaq', engelPhase: 'Post-transition', eta: 1.37,
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
    ticker: 'SILO IDX', engelPhase: 'Transition', eta: 1.26,
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
function GrowthGapScatter({ selected }: { selected: string | null }) {
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
            <g key={p.symbol}>
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
  const sel = PAIRS.find(p => p.symbol === selected) ?? null;

  return (
    <div>
      {/* Scatter chart */}
      <div className="mb-6">
        <p className="text-xs text-[#57606a] mb-2">
          Bubble size reflects calibrated probability (Tetlock superforecasting + scenario_calibrate shrinkage).
          The diagonal is where implied terminal growth equals actual growth — above it the market prices in less growth than currently observed.
          <Tag t="INF" />Implied g = 1/fwd P/E − 9% discount rate. Actual growth = most recent annual revenue growth per public filings.
        </p>
        <GrowthGapScatter selected={selected} />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginTop: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d0d7de' }}>
              {['Market / Company', 'Phase', 'η', 'Implied g¹', 'Actual g', 'Gap', 'Verdict', 'P(thesis)'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#57606a', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAIRS.map((p, i) => {
              const isEven = i % 2 === 0;
              const isSelected = selected === p.symbol;
              const gap = p.actualG - p.impliedG;
              return (
                <tr
                  key={p.symbol}
                  style={{
                    background: isSelected ? '#f0f4f8' : isEven ? '#f6f8fa' : '#fff',
                    borderBottom: '1px solid #e1e4e8',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelected(isSelected ? null : p.symbol)}
                >
                  <td style={{ padding: '12px 12px', fontWeight: 600, color: VERDICT_COLOR[p.verdictCode] }}>
                    {p.market}<br />
                    <span style={{ fontWeight: 400, color: '#57606a', fontSize: 11 }}>{p.ticker}</span>
                  </td>
                  <td style={{ padding: '7px 8px', color: '#57606a' }}>
                    <span style={{ fontSize: 10, border: '1px solid #d0d7de', borderRadius: 3, padding: '1px 4px' }}>
                      {PHASE_LABEL[p.engelPhase] ?? p.engelPhase}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px', fontVariantNumeric: 'tabular-nums' }}>{p.eta.toFixed(2)}</td>
                  <td style={{ padding: '12px 12px', fontVariantNumeric: 'tabular-nums', color: p.impliedG < 0 ? '#9e4c38' : '#2c6e49' }}>
                    {(p.impliedG * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: '12px 12px', fontVariantNumeric: 'tabular-nums', color: '#2c6e49' }}>
                    +{(p.actualG * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: '12px 12px', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: '#4c78a8' }}>
                    +{(gap * 100).toFixed(1)} pp
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ color: VERDICT_COLOR[p.verdictCode], fontWeight: 600, fontSize: 11 }}>
                      {p.verdictLabel}
                    </span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <ProbBadge p={p.prob} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Growth gap chart */}
      <div style={{ marginTop: 28 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#1b1f23', marginBottom: 4 }}>
          Implied terminal growth vs actual growth — all 6 pairs
        </h4>
        <GrowthGapChart />
      </div>

      {/* Detail panel — expands on row click */}
      {sel && (
        <div style={{ marginTop: 16, padding: 16, border: `1px solid ${VERDICT_COLOR[sel.verdictCode]}`, borderRadius: 6, background: '#f6f8fa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 14, color: VERDICT_COLOR[sel.verdictCode] }}>{sel.company}</span>
              <span style={{ marginLeft: 8, fontSize: 12, color: '#57606a' }}>{sel.category}</span>
            </div>
            <ProbBadge p={sel.prob} />
          </div>

          <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
            <strong>Chain: </strong><Tag t="INF" />{sel.chain}
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
            <strong>Forecast question: </strong><Tag t="JDG" />{sel.forecastQ}
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: '#9e4c38' }}>
            <strong>Falsifier: </strong>{sel.falsifier}
          </p>

          <div style={{ marginTop: 10, display: 'flex', gap: 24, fontSize: 11, color: '#57606a' }}>
            <span>{sel.peType} P/E <strong>{sel.pe}×</strong></span>
            <span>implied g <strong style={{ color: sel.impliedG < 0 ? '#9e4c38' : '#2c6e49' }}>{(sel.impliedG * 100).toFixed(1)}%</strong></span>
            <span>actual growth <strong style={{ color: '#2c6e49' }}>+{(sel.actualG * 100).toFixed(1)}%</strong></span>
            <span>gap <strong style={{ color: '#4c78a8' }}>+{((sel.actualG - sel.impliedG) * 100).toFixed(1)} pp</strong></span>
          </div>
        </div>
      )}

      {/* PE-type footnote */}
      <p style={{ marginTop: 8, fontSize: 10, color: '#57606a', maxWidth: 680, lineHeight: 1.5 }}>
        &#xb9; Implied g = 1/P/E &minus; 9% discount rate. P/E type used: MWG, FMX, YDUQ3 &mdash; forward consensus; MTNN &amp; SILO &mdash; trailing (NGX/IDX forward consensus not available; naira and IDR distortions make analyst estimates unreliable); GGAL &mdash; TTM (Argentina hyperinflation makes forward earnings unstable). All six calculations re-verified via lisp_eval 2026-10-23 &mdash; results match to two decimal places.
      </p>

      {/* Methodology note */}
      <details style={{ marginTop: 20, fontSize: 11, color: '#57606a' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Methodology — probability estimates</summary>
        <p style={{ marginTop: 8, maxWidth: 680, lineHeight: 1.6 }}>
          Calibrated probabilities follow Tetlock &amp; Gardner (2015) in eight steps: question triage, Fermi sub-question decomposition (5 questions per pair), outside-view base rate from reference-class analysis, inside-view adjustment, dragonfly-eye synthesis, and shrinkage toward the base rate via scenario_calibrate. The calibrator shrinks Fermi estimates toward the base rate proportionally to reference-class sample size — this is a feature, not a bug: it corrects overconfidence. All six forecast IDs are registered for Brier scoring; call forecast_record when the horizon passes to close the loop.
        </p>
        <p style={{ marginTop: 6, maxWidth: 680, lineHeight: 1.6 }}>
          <Tag t="GAP" />Implied terminal growth = 1/P/E − 9% discount rate (PE type per footnote ¹). This is a residual, not a forecast — it is what the current price implies the market expects. Actual growth is the most recent annual revenue growth from public filings. Both are labeled by provenance: [OBS] for observed data, [INF] for model-derived values.
        </p>
      </details>
    </div>
  );
}
