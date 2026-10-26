'use client';
import React, { useState } from 'react';

/* ── Types ──────────────────────────────────────────────────────────────── */
type SignalStatus = 'confirmed' | 'mixed' | 'watch' | 'refuted' | 'weakened';

const STATUS_STYLE: Record<SignalStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmed', color: '#2c6e49', bg: '#f0faf4' },
  mixed:     { label: 'Mixed',     color: '#7c5c00', bg: '#fefbe8' },
  watch:     { label: 'Watch',     color: '#4c78a8', bg: '#f0f4fb' },
  refuted:   { label: 'Refuted',   color: '#9e3c38', bg: '#fdf0f0' },
  weakened:  { label: 'Weakened',  color: '#7c5c9e', bg: '#f5f0fb' },
};

interface SparkPoint { label: string; value: number; projected?: boolean }
interface Signal {
  type: 'thesis' | 'refutation' | 'macro';
  metric: string; reading: string; status: SignalStatus; source: string;
}
interface PairData {
  symbol: string; market: string; ticker: string; engelPhase: string;
  overallStatus: SignalStatus; overallNote: string;
  keyMetric: string; keyMetricUnit: string; spark: SparkPoint[];
  catalyst: string;
  signals: Signal[];
}

/* ── Sparkline ──────────────────────────────────────────────────────────── */
function Spark({ points, unit, color }: { points: SparkPoint[]; unit: string; color: string }) {
  const vals = points.map(p => p.value);
  const min = Math.min(...vals); const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 260; const H = 72; const PAD = { t: 8, b: 22, l: 4, r: 4 };
  const iW = W - PAD.l - PAD.r; const iH = H - PAD.t - PAD.b;
  const x = (i: number) => PAD.l + (i / (points.length - 1)) * iW;
  const y = (v: number) => PAD.t + iH - ((v - min) / range) * iH;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const last = points[points.length - 1];
  return (
    <svg width={W} height={H} style={{ overflow: 'visible', display: 'block' }}>
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray={last.projected ? '3 2' : undefined} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.value)} r={p.projected ? 3 : 3}
            fill={p.projected ? 'white' : color}
            stroke={color} strokeWidth={1.2}
          />
          <text x={x(i)} y={H - 2} fontSize={9} textAnchor="middle" fill="#8c96a0">{p.label}</text>
        </g>
      ))}
      <text x={x(points.length - 1) + 4} y={y(last.value) + 4} fontSize={11} fontWeight={700}
        fill={color} textAnchor="start">
        {last.value > 0 && unit !== 'x' ? '+' : ''}{last.value.toFixed(unit === 'x' ? 2 : 1)}{unit}
      </text>
    </svg>
  );
}

/* ── Pair data ──────────────────────────────────────────────────────────── */
const PAIRS: PairData[] = [
  {
    symbol: 'MWG', market: 'Vietnam', ticker: 'MWG HOSE',
    engelPhase: 'Transition',
    overallStatus: 'confirmed',
    overallNote: 'Strongest early signal — P/E re-rating and revenue accelerating simultaneously. Market recognising the Engel transition.',
    keyMetric: 'Revenue growth YoY', keyMetricUnit: '%',
    spark: [
      { label: 'FY22', value: -13.5 },
      { label: 'FY23', value: 4.0 },
      { label: 'FY24', value: 2.0 },
      { label: 'FY25', value: 16.4 },
      { label: 'Q4-25', value: 28.0 },
      { label: 'H1-26', value: 28.5 },
    ],
    catalyst: 'BHX (grocery) growing 13.8% FY2025 — the Engel food-to-non-food shift is showing in MWG\'s own mix. Watch BHX SSSG and An Khang pharmacy profitability in H2-2026.',
    signals: [
      { type: 'thesis', status: 'confirmed', metric: 'P/E re-rating (market pricing transition)',
        reading: 'TTM P/E: 11.2× (Oct-2025 analysis) → 17.9× (Apr-2026). VPBank target VND 98,600 (+15.2%). Thesis materialising faster than implied at 11.2×.',
        source: 'VPBank AGM Note Apr-2026' },
      { type: 'thesis', status: 'confirmed', metric: 'Revenue acceleration (durables + grocery)',
        reading: 'FY2025: +16.4% (VND 156.5tn, 104% of plan). NPAT +89.4% (VND 7.1tn, 146% of plan). Q4-2025 +28%. H1-2026 +28.5%. DMX (ICT/CE) +38.4%; BHX (grocery) +13.8%.',
        source: 'MWG Q4-2025 Earnings Call Feb-2026' },
      { type: 'macro', status: 'confirmed', metric: 'Vietnam retail market — structural shift',
        reading: 'Vietnam total retail +9.2% FY2025. Household goods/equipment +13.4%. Electronics e-commerce +23%. GDP +8%+. NSO attributes growth to "higher disposable incomes and evolving consumer preferences."',
        source: 'Vietnam NSO Jan-2026; Ministry of Industry & Trade' },
      { type: 'refutation', status: 'watch', metric: 'E-commerce / Shopee cannibalisation',
        reading: 'MWG online = 6% of revenue (FY2025). Physical chain growing faster. Not yet cannibalistic — watch Shopee electronics category share in H2-2026.',
        source: 'MWG AR 2025' },
    ],
  },
  {
    symbol: 'FMX', market: 'Mexico', ticker: 'FMX NYSE',
    engelPhase: 'Post-transition',
    overallStatus: 'mixed',
    overallNote: 'Clear Q4 inflection at OXXO (+4.4% SSSG) after 6 months of pain — the recovery is real but below the 15% Health target.',
    keyMetric: 'OXXO Mexico SSSG', keyMetricUnit: '%',
    spark: [
      { label: 'H1-25', value: -0.1 },
      { label: 'Q3-25', value: 1.7 },
      { label: 'Q4-25', value: 4.4 },
      { label: 'FY25', value: 1.0 },
      { label: 'FY26F', value: 5.0, projected: true },
    ],
    catalyst: 'FIFA World Cup 2026 partly in Mexico — management calling it "exciting 2026." Watch Q1/Q2-2026 SSSG and Health division Same-Store Sales (SSSS); ENIGH 2024 food share release confirms post-transition status.',
    signals: [
      { type: 'thesis', status: 'mixed', metric: 'OXXO SSSG quarterly trajectory',
        reading: 'H1-2025: −0.1% (negative). Q3-2025: +1.7% (turning positive). Q4-2025: +4.4% (inflection). CEO: "improved trend indeed continued through the end of the year." Traffic still −0.6% in Q4 but improving.',
        source: 'FEMSA Q4-2025 Results Feb-2026; Q3-2025 Earnings Call' },
      { type: 'thesis', status: 'mixed', metric: 'Health division growth vs 15% target',
        reading: 'YTD-2025: +12.7%. FY2025: +10.5% (below 15% target). Q4-2025: +4.6% revenue, but operating income −52.3% (margin squeeze). SSSS +4.7% Q4. Chile and Colombia growing; Mexico net −158 locations.',
        source: 'FEMSA Q4-2025 Financial Summary' },
      { type: 'thesis', status: 'confirmed', metric: 'Spin/OXXO digital wallet (Engel services thesis)',
        reading: 'Spin by OXXO: 10.5M active users (+22% Q4-2025). Spin Premia: 28.1M users (+13.8%). Digital tender at OXXO: 49.3% of transactions (was 40.7% Q4-2024). Services-as-revenue is the freed-budget play.',
        source: 'FEMSA Q4-2025 Results' },
      { type: 'refutation', status: 'watch', metric: 'Mexico structural consumption weakness',
        reading: 'CEO describes "challenging environment" in Mexico. Traffic negative Q4-2025 (−0.6%). Macro: peso weakness, Banxico tight policy. ENIGH 2024 food share (expected publication 2025) not yet released.',
        source: 'FEMSA CEO Q4-2025 Call; INEGI (pending)' },
    ],
  },
  {
    symbol: 'YDUQ3', market: 'Brazil', ticker: 'YDUQ3 B3',
    engelPhase: 'Post-transition',
    overallStatus: 'confirmed',
    overallNote: 'FCF thesis at R$1B confirmed. Premium segment trajectory is the Engel story in real time — first-gen families choosing university.',
    keyMetric: 'Free Cash Flow (R$B)', keyMetricUnit: 'B',
    spark: [
      { label: '2022', value: -0.125 },
      { label: '2023', value: 0.5 },
      { label: '2024', value: 0.795 },
      { label: '2025', value: 1.051 },
      { label: '2026F', value: 1.3, projected: true },
    ],
    catalyst: 'Premium segment (IDOMED + Ibmec) was 30% of EBITDA in 2021, now 44%. At 50%+ (est. 2027) the mix shift becomes the dominant narrative. Watch semi-presencial students (currently +61%) sustaining above 50% growth.',
    signals: [
      { type: 'thesis', status: 'confirmed', metric: 'FCF exceeds R$1B (historic milestone)',
        reading: 'FCL R$1.051B FY2025 (+32%). FCFE R$500M (+38%). Net debt R$2.48B (−11.8%). Leverage 1.46× (down from 1.55×). CEO: "not an isolated event — clearly on an upward trajectory."',
        source: 'Yduqs IR Mar-2026' },
      { type: 'thesis', status: 'confirmed', metric: 'Premium segment EBITDA share (first-gen access)',
        reading: 'Premium = 44% of adj. EBITDA in 2025 (was 30% in 2021). Ibmec EBITDA +38%, margin 45%. IDOMED margin 50%, renewal rate 99%. Semi-presencial students +61% — new access vector.',
        source: 'Yduqs Integrated Report 2025' },
      { type: 'thesis', status: 'confirmed', metric: 'FIES policy — no cut',
        reading: 'FIES maintained through FY2025. No cut or cap announced. Student base +4.3% to 1.37M. Bad debt ratio 11.5% (lowest since 2020).',
        source: 'Yduqs IR Mar-2026' },
      { type: 'refutation', status: 'watch', metric: 'Revenue +3.2% < implied g 7.7% (valuation tension)',
        reading: 'Revenue +3.2% vs implied terminal growth 7.7% → on revenue basis, market may be fairly valuing the stock. Thesis depends on FCF (32%) as the correct metric for this leveraged education business. Selic at 13.75% amplifies the interest cost.',
        source: 'lisp_eval + Estadão Mar-2026' },
    ],
  },
  {
    symbol: 'MTNN', market: 'Nigeria', ticker: 'MTNN NGX',
    engelPhase: 'Paradox',
    overallStatus: 'weakened',
    overallNote: 'Original falsifier (naira re-pricing) is structurally weakened — FY2025 delivered real growth. Fintech remains the open question.',
    keyMetric: 'Service revenue growth (NGN)', keyMetricUnit: '%',
    spark: [
      { label: 'FY23', value: 68.0 },
      { label: 'H1-24', value: 32.0 },
      { label: 'FY24', value: 35.9 },
      { label: 'H1-26', value: 25.9 },
      { label: 'FY25', value: 55.1 },
    ],
    catalyst: 'MoMo fintech (was −7.2% H1-2026) turning positive is the second Engel signal — financial inclusion as a precursor-demand story. Watch H2-2026 MoMo and data ARPU trends as naira stabilises.',
    signals: [
      { type: 'thesis', status: 'confirmed', metric: 'Service revenue — real growth, not FX rebase',
        reading: 'FY2025 service revenue +55.1% NGN. Naira STRENGTHENED N1,535→N1,436/USD — growth is real in USD terms too. Data users +11.6% to 53.2M. Medium-term guidance: "at least low 20%."',
        source: 'MTN Nigeria FY2025 Earnings Feb-2026' },
      { type: 'refutation', status: 'weakened', metric: 'Naira re-pricing falsifier',
        reading: 'Original falsifier: "growth is only naira re-pricing after 2023 devaluation." FY2025: naira APPRECIATED. This falsifier is materially weakened. Real USD-equivalent revenue grew faster than NGN terms.',
        source: 'MTN Nigeria FY2025; CBN' },
      { type: 'thesis', status: 'confirmed', metric: 'EBITDA margin expansion and FCF',
        reading: 'EBITDA margin 52.7% (+13.6pp) FY2025. PAT N1.1tn (vs loss N400B in 2024). FCF N1.2tn (+215%). Tower lease renegotiation. Guidance: EBITDA "mid to high 50%."',
        source: 'MTN Nigeria FY2025' },
      { type: 'refutation', status: 'watch', metric: 'MoMo fintech negative (−7.2% H1-2026)',
        reading: 'MoMo fintech revenue still declining in H1-2026. The Engel financial-inclusion thesis requires MoMo to activate low-income households entering formal finance. Not yet confirmed.',
        source: 'MTN Nigeria H1-2026' },
    ],
  },
  {
    symbol: 'GGAL', market: 'Argentina', ticker: 'GGAL Nasdaq',
    engelPhase: 'Post-transition (macro play)',
    overallStatus: 'mixed',
    overallNote: 'P/B trajectory tells the story: 0.25× trough → 1.41× peak (2024) → 0.96× pullback (Oct-2025 analysis) → 1.15× (Aug-2026). The Milei re-rating played out; now a second leg.',
    keyMetric: 'Price / Book value', keyMetricUnit: 'x',
    spark: [
      { label: 'Q4-22', value: 0.25 },
      { label: 'Q3-24', value: 1.20 },
      { label: 'Q4-24', value: 1.41 },
      { label: 'Q1-25', value: 1.36 },
      { label: 'Oct-25', value: 0.96 },
      { label: 'Aug-26', value: 1.15 },
      { label: 'Target', value: 1.5, projected: true },
    ],
    catalyst: 'HSBC integration costs (causing Q3-2025 net loss and ROE dip to 4.7%) are one-time. Watch Q1/Q2-2026 ROE normalisation toward 15%+ (ex-integration: 6.9% in Q3-2025, improving). Argentina credit/GDP at ~13% — structural under-penetration is the Engel story.',
    signals: [
      { type: 'thesis', status: 'mixed', metric: 'P/B re-rating trajectory (0.25→1.41→1.15)',
        reading: 'P/B went 0.25× (Q4-2022 trough) → 1.41× (Q4-2024 Milei peak) → 0.96× (Oct-2025, HSBC integration drag) → 1.15× (Aug-2026). The thesis already played out once. This is a second-leg re-rating to 1.5× target.',
        source: 'MacroTrends GGAL P/B Aug-2026' },
      { type: 'macro', status: 'confirmed', metric: 'Argentina inflation declining',
        reading: 'CPI: 211% (2023) → 117% (2024) → 40-50% (2025F). Milei programme on track through 2025. IMF relationship maintained. BCRA rate cycle easing.',
        source: 'GGAL 20-F 2025; INDEC' },
      { type: 'thesis', status: 'confirmed', metric: 'HSBC integration completed — scale milestone',
        reading: 'Galicia absorbed HSBC Argentina (Galicia Más) FY2025. Combined: 432 branches, 10,079 employees, 15.1% private sector loan market share, Ps.11,351B AUM. The structural under-penetration play now has critical mass.',
        source: 'GGAL 4Q2025 Press Release Mar-2026' },
      { type: 'refutation', status: 'watch', metric: 'Integration costs suppressing ROE (one-time vs structural)',
        reading: 'Q3-2025 ROE 4.7% (vs 27.3% Q3-2024) due to HSBC integration. ROE ex-integration: 6.9%. Watch Q1-2026 ROE normalisation — this is the signal that the one-time drag is clearing.',
        source: 'GGAL 3Q2025 Press Release Nov-2025' },
    ],
  },
  {
    symbol: 'SILO', market: 'Indonesia', ticker: 'SILO IDX',
    engelPhase: 'Transition',
    overallStatus: 'mixed',
    overallNote: 'Revenue lags the Engel story, but ARPOB +10% shows pricing power improving. Analyst consensus: +12% in FY2026. The question is timing, not direction.',
    keyMetric: 'Revenue growth YoY', keyMetricUnit: '%',
    spark: [
      { label: 'FY23', value: 9.1 },
      { label: 'FY24', value: 9.1 },
      { label: 'Q3-25', value: 8.0 },
      { label: 'FY25', value: 5.2 },
      { label: 'FY26F', value: 12.0, projected: true },
      { label: 'FY27F', value: 12.0, projected: true },
    ],
    catalyst: 'Da Vinci Xi robotic surgery launched FY2025 — the "cutting-edge devices → subspecialists → premium cases" loop Bridareksa describes. Watch Average Revenue per Occupied Bed (ARPOB) trend: was +10% YoY in Q1-2025 despite flat volume. When volume recovers, ARPOB × volume = revenue acceleration.',
    signals: [
      { type: 'thesis', status: 'mixed', metric: 'Revenue vs 12% thesis target — timing gap',
        reading: 'FY2025: +5.2% revenue. But ARPOB +10% YoY (Q1-2025) and analyst consensus for FY2026F: +12% (Bridareksa Buy, TP Rp2,850). Oct-2025 revenue "indicated at double-digit YoY" (mgmt guidance). Timing gap, not direction.',
        source: 'SILO IDX Mar-2026; Bridareksa Nov-2025' },
      { type: 'thesis', status: 'confirmed', metric: 'EBITDA margin expansion — quality before quantity',
        reading: 'EBITDA margin: 22% (FY2022) → 29.1% (FY2025, +3.2pp YoY). Net profit +22.5% FY2025. Q4-2025 EBITDA margin 30.8%. Profitability improving faster than volume — the "archetype differentiation" strategy is working.',
        source: 'SILO IDX Mar-2026; Indopremier' },
      { type: 'refutation', status: 'watch', metric: 'BPJS coverage — no expansion',
        reading: 'No BPJS non-emergency coverage expansion announced FY2025. Inpatient admissions −2.5% FY2025 (deliberate portfolio mix shift, not demand loss). BPJS 95% coverage for routine; private hospital play is premium/non-covered cases.',
        source: 'SILO AR 2025; Ministry of Health Indonesia' },
      { type: 'macro', status: 'watch', metric: 'Indonesia GDP/capita approaching upper transition boundary',
        reading: 'Indonesia GDP/capita PPP ~$17,040 (2025 est.). Upper transition boundary: $17,775. Approaching threshold — FY2026 data will test the model. SUSENAS 2024 health spending share not yet released.',
        source: 'IMF WEO 2026; BPS (pending)' },
    ],
  },
];

/* ── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ status, small }: { status: SignalStatus; small?: boolean }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{
      fontSize: small ? 11 : 13, fontWeight: 600, color: s.color,
      background: s.bg, border: `1px solid ${s.color}`,
      borderRadius: 4, padding: small ? '2px 6px' : '3px 9px', whiteSpace: 'nowrap',
    }}>{s.label}</span>
  );
}

const TYPE_ICON = { thesis: '↑', refutation: '✗', macro: '◎' };
const TYPE_COLOR = { thesis: '#2c6e49', refutation: '#9e3c38', macro: '#4c78a8' };
const SPARK_COLOR: Record<string, string> = {
  MWG: '#4c78a8', FMX: '#7c5c00', YDUQ3: '#2c6e49',
  MTNN: '#7c5c9e', GGAL: '#9e3c38', SILO: '#8b7355',
};

/* ── Conviction bar ─────────────────────────────────────────────────────── */
function ConvictionBar({ signals }: { signals: { status: SignalStatus }[] }) {
  const counts = { confirmed: 0, mixed: 0, watch: 0, weakened: 0, refuted: 0 };
  signals.forEach(s => counts[s.status]++);
  const total = signals.length;
  return (
    <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', width: '100%', gap: 1 }}>
      {Object.entries(counts).map(([k, n]) => n > 0 ? (
        <div key={k} style={{
          flex: n / total, background: STATUS_STYLE[k as SignalStatus].color, minWidth: 4,
        }} />
      ) : null)}
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export function EarlySignals() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 14, color: '#57606a', marginBottom: 14, maxWidth: 680, lineHeight: 1.6 }}>
        Three signal types per pair:
        <strong style={{ color: TYPE_COLOR.thesis }}> ↑ Thesis</strong> (confirms the Engel chain),
        <strong style={{ color: TYPE_COLOR.refutation }}> ✗ Refutation</strong> (tests the falsifier),
        <strong style={{ color: TYPE_COLOR.macro }}> ◎ Macro</strong> (country context).
        Sparklines show the key metric over time — hollow points are analyst projections, not observations.
        Sources: FY2025 primary filings (Feb–Mar 2026) and latest public data.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PAIRS.map((pair) => {
          const isOpen = open === pair.symbol;
          const color = SPARK_COLOR[pair.symbol];
          return (
            <div key={pair.symbol} style={{ border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
              {/* Header */}
              <button
                onClick={() => setOpen(isOpen ? null : pair.symbol)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '16px 20px', background: isOpen ? '#f0f4f8' : '#f6f8fa',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                {/* Left: name + phase + conviction bar */}
                <div style={{ flex: '0 0 160px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#1b1f23' }}>{pair.market}</span>
                    <span style={{ fontSize: 14, color: '#57606a' }}>{pair.ticker}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#57606a', border: '1px solid #d0d7de', borderRadius: 3, padding: '2px 6px', display: 'inline-block', marginBottom: 4 }}>
                    {pair.engelPhase}
                  </span>
                  <ConvictionBar signals={pair.signals} />
                </div>

                {/* Sparkline */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#8c96a0', marginBottom: 4 }}>{pair.keyMetric}</div>
                    <Spark points={pair.spark} unit={pair.keyMetricUnit} color={color} />
                  </div>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <StatusBadge status={pair.overallStatus} />
                  <span style={{ fontSize: 14, color: '#57606a' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div style={{ padding: '20px 24px 18px', borderTop: '1px solid #e1e4e8' }}>
                  {/* Overall note */}
                  <p style={{ fontSize: 13, color: '#57606a', fontStyle: 'italic', marginBottom: 16 }}>
                    {pair.overallNote}
                  </p>

                  {/* Signals */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                    {pair.signals.map((sig, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: TYPE_COLOR[sig.type], minWidth: 18, marginTop: 1 }}>
                          {TYPE_ICON[sig.type]}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#1b1f23' }}>{sig.metric}</span>
                            <StatusBadge status={sig.status} small />
                          </div>
                          <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.75, margin: 0 }}>{sig.reading}</p>
                          <span style={{ fontSize: 11, color: '#8c96a0', marginTop: 3, display: 'block' }}>{sig.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Catalyst */}
                  <div style={{ background: '#f6f8fa', borderLeft: '3px solid ' + color, padding: '8px 10px', borderRadius: '0 4px 4px 0' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next catalyst</span>
                    <p style={{ fontSize: 14, color: '#57606a', lineHeight: 1.7, margin: '4px 0 0' }}>{pair.catalyst}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary scorecard */}
      <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#57606a', alignItems: 'center' }}>
        {Object.entries(STATUS_STYLE).map(([k, v]) => {
          const count = PAIRS.filter(p => p.overallStatus === k).length;
          return count > 0 ? (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.color, display: 'inline-block' }} />
              <strong style={{ color: v.color }}>{count}</strong> {v.label}
            </span>
          ) : null;
        })}
        <span style={{ color: '#8c96a0', marginLeft: 4 }}>— FY2025 filings (Feb–Mar 2026) + MacroTrends (Aug-2026)</span>
      </div>
    </div>
  );
}
