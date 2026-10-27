'use client';
import React, { useState } from 'react';
import { GDPCPIQuadrant, GDPBars, InflationBars, FXBars, ArgentinaInflation } from './MacroCharts';
import { MacroQuadrantAnimated } from './MacroQuadrantAnimated';

/* ── Risk level ─────────────────────────────────────────────────────────── */
type RiskLevel = 'low' | 'medium' | 'elevated' | 'high';
const RISK_STYLE: Record<RiskLevel, { color: string; bg: string; label: string }> = {
  low:      { color: '#2c6e49', bg: '#f0faf4', label: 'Low' },
  medium:   { color: '#7c5c00', bg: '#fefbe8', label: 'Medium' },
  elevated: { color: '#9e4c00', bg: '#fff4ec', label: 'Elevated' },
  high:     { color: '#9e3c38', bg: '#fdf0f0', label: 'High' },
};

interface CountryMacro {
  iso3: string; country: string; symbol: string;
  gdpGrowth2025: number;       // %
  gdpGrowth2026F: number;      // %
  inflation2025: number;        // %
  inflationTrend: 'falling' | 'stable' | 'rising';
  fxChange2025: number;         // % vs USD, negative = depreciation
  fxRisk: RiskLevel;
  policyRate: number;           // %
  policyRisk: RiskLevel;
  engelMechanism: 'active' | 'completing' | 'delayed' | 'blocked';
  engelNote: string;
  gdpRisk: RiskLevel;
  inflationRisk: RiskLevel;
  politicalRisk: RiskLevel;
  topRisk: string;
  source: string;
}

const COUNTRIES: CountryMacro[] = [
  {
    iso3: 'VNM', country: 'Vietnam', symbol: 'MWG',
    gdpGrowth2025: 8.02, gdpGrowth2026F: 9.0,
    inflation2025: 3.3, inflationTrend: 'stable',
    fxChange2025: -3.2, fxRisk: 'low',
    policyRate: 4.5, policyRisk: 'low',
    engelMechanism: 'active',
    engelNote: 'Transition phase. Retail +9.2%; household goods +13.4%. GDP growth fastest since 2011.',
    gdpRisk: 'low', inflationRisk: 'low', politicalRisk: 'low',
    topRisk: 'US tariff escalation on Vietnam electronics exports; China supply-chain dependency.',
    source: 'Vietnam GSO Jan-2026; KBSV 4Q26 Macro; S&I Ratings',
  },
  {
    iso3: 'MEX', country: 'Mexico', symbol: 'FMX',
    gdpGrowth2025: 0.3, gdpGrowth2026F: 1.0,
    inflation2025: 3.7, inflationTrend: 'stable',
    fxChange2025: 12.0, fxRisk: 'low',
    policyRate: 7.0, policyRisk: 'medium',
    engelMechanism: 'delayed',
    engelNote: 'Post-transition (food 25.7%) but GDP growth near zero delays freed-budget effect. Banxico cutting to 7%.',
    gdpRisk: 'high', inflationRisk: 'low', politicalRisk: 'medium',
    topRisk: 'Nearshoring cycle may delay without USMCA clarity; fiscal consolidation limits public investment.',
    source: 'Banxico Q4-2025 Report; IMF Article IV Oct-2025; Deloitte/Econosignal Jan-2026',
  },
  {
    iso3: 'BRA', country: 'Brazil', symbol: 'YDUQ3',
    gdpGrowth2025: 2.3, gdpGrowth2026F: 1.6,
    inflation2025: 5.5, inflationTrend: 'falling',
    fxChange2025: -8.0, fxRisk: 'medium',
    policyRate: 15.0, policyRisk: 'high',
    engelMechanism: 'completing',
    engelNote: 'Post-transition completed. Selic 15% compresses YDUQ3 net profit (interest cost). FCF thesis intact despite macro headwinds.',
    gdpRisk: 'medium', inflationRisk: 'medium', politicalRisk: 'elevated',
    topRisk: 'Selic stays high → YDUQ3 debt service costs rise → net profit falls even as FCF grows. Elections 2026 → BRL volatility.',
    source: 'Reuters Mar-2026; OECD Jun-2026; Itaú Macro Feb-2026',
  },
  {
    iso3: 'NGA', country: 'Nigeria', symbol: 'MTNN',
    gdpGrowth2025: 4.0, gdpGrowth2026F: 4.1,
    inflation2025: 23.0, inflationTrend: 'falling',
    fxChange2025: -5.0, fxRisk: 'elevated',
    policyRate: 27.5, policyRisk: 'elevated',
    engelMechanism: 'blocked',
    engelNote: 'Food share 59% flat 2017-2023 despite GDP $7.8k. Mechanism blocked by inequality and food inflation. Data/mobile is the alternative channel.',
    gdpRisk: 'medium', inflationRisk: 'elevated', politicalRisk: 'elevated',
    topRisk: 'Inflation 23% (down from 33%) still blocks food share decline. Oil price shock (downside) compresses fiscal space and consumer income.',
    source: 'AFDB Nigeria 2025; CBN MPC Activities 2025; NBS Q1-2026',
  },
  {
    iso3: 'ARG', country: 'Argentina', symbol: 'GGAL',
    gdpGrowth2025: 4.2, gdpGrowth2026F: 3.5,
    inflation2025: 31.0, inflationTrend: 'falling',
    fxChange2025: -15.0, fxRisk: 'high',
    policyRate: 35.0, policyRisk: 'high',
    engelMechanism: 'delayed',
    engelNote: 'GDP post-transition (η=1.37 for financial services). Inflation down from 211% → 31% — most dramatic disinflation in dataset. GGAL is the macro-stabilisation trade.',
    gdpRisk: 'medium', inflationRisk: 'high', politicalRisk: 'high',
    topRisk: 'Presidential elections 2027 risk policy reversal. NIR accumulation below IMF target. ARS pressure ahead of elections → dollarization spikes.',
    source: 'IMF Argentina 2nd Review May-2026; OECD Dec-2025; Reuters Jan-2026',
  },
  {
    iso3: 'IDN', country: 'Indonesia', symbol: 'SILO',
    gdpGrowth2025: 5.11, gdpGrowth2026F: 5.2,
    inflation2025: 3.55, inflationTrend: 'stable',
    fxChange2025: -4.0, fxRisk: 'medium',
    policyRate: 4.75, policyRisk: 'low',
    engelMechanism: 'active',
    engelNote: 'Transition (66% exit by 2030). GDP 5.1%, inflation 3.55%, BI rate 4.75%. GDP/capita approaching $17,775 upper boundary.',
    gdpRisk: 'low', inflationRisk: 'low', politicalRisk: 'medium',
    topRisk: 'BPJS coverage expansion into non-emergency care would directly cannibalise SILO. Middle-East oil shock via energy import costs.',
    source: 'ADB ADO Apr-2026; IMF Art.IV Jan-2026; Bank Indonesia Q4-2025 MPR',
  },
];

/* ── FX sensitivity calculation ─────────────────────────────────────────── */
const FX_SCENARIOS = [
  { label: 'Base',  fxStress: 0 },
  { label: 'Bear',  fxStress: -0.15 },
  { label: 'Shock', fxStress: -0.30 },
];

function fxAdjReturn(localReturn: number, fxChange: number, fxStress: number) {
  return (1 + localReturn) * (1 + fxChange + fxStress) - 1;
}

const LOCAL_RETURNS: Record<string, number> = {
  MWG: 0.20, FMX: 0.20, YDUQ3: 0.30, MTNN: 0.25, GGAL: 0.30, SILO: 0.20,
};

/* ── Engel exit sensitivity ─────────────────────────────────────────────── */
const EXIT_SENSITIVITY = [
  { country: 'Vietnam',   symbol: 'MWG',   base: 0.83, stress2pp: 0.55, stress5pp: 0.22 },
  { country: 'Indonesia', symbol: 'SILO',  base: 0.66, stress2pp: 0.38, stress5pp: 0.12 },
  { country: 'Nigeria',   symbol: 'MTNN',  base: 0.08, stress2pp: 0.03, stress5pp: 0.01 },
  { country: 'Mexico',    symbol: 'FMX',   base: 1.00, stress2pp: 1.00, stress5pp: 1.00 },
  { country: 'Brazil',    symbol: 'YDUQ3', base: 0.94, stress2pp: 0.94, stress5pp: 0.94 },
  { country: 'Argentina', symbol: 'GGAL',  base: 0.85, stress2pp: 0.85, stress5pp: 0.85 },
];

/* ── Helpers ────────────────────────────────────────────────────────────── */
function RiskBadge({ level, small }: { level: RiskLevel; small?: boolean }) {
  const s = RISK_STYLE[level];
  return (
    <span style={{ fontSize: small ? 10 : 12, fontWeight: 600, color: s.color, background: s.bg,
      border: `1px solid ${s.color}`, borderRadius: 3, padding: small ? '1px 6px' : '3px 9px', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

const ENGEL_STYLE: Record<string, { icon: string; color: string }> = {
  active:     { icon: '↑', color: '#2c6e49' },
  completing: { icon: '✓', color: '#4c78a8' },
  delayed:    { icon: '~', color: '#7c5c00' },
  blocked:    { icon: '✗', color: '#9e3c38' },
};

const PAIR_COLOR: Record<string, string> = {
  MWG: '#4c78a8', FMX: '#7c5c00', YDUQ3: '#2c6e49',
  MTNN: '#7c5c9e', GGAL: '#9e3c38', SILO: '#8b7355',
};

/* ── Exit probability bar chart ─────────────────────────────────────────── */
function ExitSensitivity() {
  const W = 400; const BAR_H = 18; const GAP = 6;
  const H = EXIT_SENSITIVITY.length * (BAR_H * 3 + GAP * 4) + 24;
  const xS = (v: number) => 2 + v * (W - 80);
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>
        Probability of exiting transition zone by 2030 under GDP growth stress scenarios.
        Mexico/Brazil/Argentina: already post-transition — exits are not applicable (stays at historical level).
      </div>
      <svg width={W} height={H} style={{ display: 'block' }}>
        {EXIT_SENSITIVITY.map((d, i) => {
          const y0 = 20 + i * (BAR_H * 3 + GAP * 4);
          const color = PAIR_COLOR[d.symbol];
          return (
            <g key={d.symbol}>
              <text x={0} y={y0 + BAR_H / 2 + 4} fontSize={10} fontWeight={600} fill={color}>{d.symbol}</text>
              {[
                { v: d.base, label: 'Base', opacity: 1.0 },
                { v: d.stress2pp, label: '−2pp GDP', opacity: 0.65 },
                { v: d.stress5pp, label: '−5pp GDP', opacity: 0.35 },
              ].map((bar, j) => (
                <g key={j}>
                  <rect x={44} y={y0 + j * (BAR_H + GAP)} width={Math.max(xS(bar.v), 4)} height={BAR_H}
                    fill={color} fillOpacity={bar.opacity} rx={2} />
                  <text x={44 + Math.max(xS(bar.v), 4) + 4} y={y0 + j * (BAR_H + GAP) + BAR_H / 2 + 4}
                    fontSize={9} fill={color} fontWeight={600}>
                    {(bar.v * 100).toFixed(0)}%
                  </text>
                  <text x={40} y={y0 + j * (BAR_H + GAP) + BAR_H / 2 + 4}
                    fontSize={8} fill="#8c96a0" textAnchor="end">{bar.label}</text>
                </g>
              ))}
            </g>
          );
        })}
        <text x={44 + (W - 80) / 2} y={14} fontSize={9} fill="#57606a" textAnchor="middle">
          P(exit transition by 2030)
        </text>
        <line x1={44} x2={W - 36} y1={18} y2={18} stroke="#d0d7de" strokeWidth={0.5} />
        {[0, 0.25, 0.5, 0.75, 1.0].map(v => (
          <text key={v} x={44 + v * (W - 80)} y={16} fontSize={8} fill="#8c96a0" textAnchor="middle">
            {(v * 100).toFixed(0)}%
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ── FX sensitivity table ────────────────────────────────────────────────── */
function FXSensitivity() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ fontSize: 10, color: '#57606a', marginBottom: 6 }}>
        USD return = (1 + local return) × (1 + base FX + stress) − 1. Local return assumption: 20% (MWG, FMX, SILO), 25% (MTNN), 30% (YDUQ3, GGAL). Base FX = 2025 actual FX change.
      </div>
      <table style={{ borderCollapse: 'collapse', fontSize: 11, width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #d0d7de' }}>
            {['Pair', 'Local return', 'Base FX', 'USD Base', 'USD Bear (−15%)', 'USD Shock (−30%)'].map(h => (
              <th key={h} style={{ padding: '4px 8px', textAlign: 'left', color: '#57606a', fontWeight: 600, fontSize: 10 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COUNTRIES.map((c, i) => {
            const lr = LOCAL_RETURNS[c.symbol];
            const fxBase = c.fxChange2025 / 100;
            const base = fxAdjReturn(lr, fxBase, 0);
            const bear = fxAdjReturn(lr, fxBase, -0.15);
            const shock = fxAdjReturn(lr, fxBase, -0.30);
            return (
              <tr key={c.symbol} style={{ background: i%2===0?'#f6f8fa':'#fff', borderBottom: '1px solid #e1e4e8' }}>
                <td style={{ padding: '5px 8px', fontWeight: 700, color: PAIR_COLOR[c.symbol] }}>{c.symbol}</td>
                <td style={{ padding: '5px 8px', fontVariantNumeric: 'tabular-nums', color: '#2c6e49' }}>+{(lr*100).toFixed(0)}%</td>
                <td style={{ padding: '5px 8px', fontVariantNumeric: 'tabular-nums', color: c.fxChange2025 >= 0 ? '#2c6e49' : '#9e3c38' }}>
                  {c.fxChange2025 > 0 ? '+' : ''}{c.fxChange2025.toFixed(1)}%
                </td>
                <td style={{ padding: '5px 8px', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: base >= 0 ? '#2c6e49' : '#9e3c38' }}>
                  {base >= 0 ? '+' : ''}{(base*100).toFixed(1)}%
                </td>
                <td style={{ padding: '5px 8px', fontVariantNumeric: 'tabular-nums', color: bear >= 0 ? '#2c6e49' : '#9e3c38' }}>
                  {bear >= 0 ? '+' : ''}{(bear*100).toFixed(1)}%
                </td>
                <td style={{ padding: '5px 8px', fontVariantNumeric: 'tabular-nums', color: shock >= 0 ? '#2c6e49' : '#9e3c38', fontWeight: 600 }}>
                  {shock >= 0 ? '+' : ''}{(shock*100).toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export function MacroRisk() {
  const [tab, setTab] = useState<'scorecards'|'charts'|'animated'|'exit'|'fx'>('scorecards');
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'scorecards', label: 'Country scorecards' },
          { key: 'charts',     label: 'Charts' },
          { key: 'animated',   label: 'Historical (2000–2024)' },
          { key: 'exit',       label: 'Engel exit sensitivity' },
          { key: 'fx',         label: 'FX stress test' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            style={{
              padding: '7px 16px', fontSize: 13, borderRadius: 4, cursor: 'pointer',
              border: tab === t.key ? '2px solid #1b1f23' : '1px solid #d0d7de',
              background: tab === t.key ? '#1b1f23' : '#f6f8fa',
              color: tab === t.key ? '#fff' : '#1b1f23',
              fontWeight: tab === t.key ? 700 : 400,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'scorecards' && (
        <div>
          <p style={{ fontSize: 13, color: '#57606a', marginBottom: 16 }}>
            Click a country to expand the risk detail and Engel mechanism status. Sources: primary central bank reports, IMF Article IV consultations, and national statistics offices (FY2025 / Q1-2026).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COUNTRIES.map(c => {
              const isOpen = open === c.iso3;
              const eng = ENGEL_STYLE[c.engelMechanism];
              return (
                <div key={c.iso3} style={{ border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
                  <button onClick={() => setOpen(isOpen ? null : c.iso3)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '16px 20px', background: isOpen ? '#f0f4f8' : '#f6f8fa',
                      border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ flex: '0 0 100px' }}>
                      <span style={{ fontWeight: 700, fontSize: 17, color: '#1b1f23' }}>{c.country}</span><br />
                      <span style={{ fontSize: 13, color: '#57606a' }}>{c.symbol}</span>
                    </div>
                    <div style={{ flex: '0 0 90px', fontVariantNumeric: 'tabular-nums', fontSize: 15 }}>
                      <span style={{ color: c.gdpGrowth2025 >= 4 ? '#2c6e49' : c.gdpGrowth2025 >= 2 ? '#7c5c00' : '#9e3c38', fontWeight: 700 }}>
                        {c.gdpGrowth2025 > 0 ? '+' : ''}{c.gdpGrowth2025.toFixed(1)}%
                      </span>
                      <span style={{ fontSize: 11, color: '#8c96a0' }}> GDP</span>
                    </div>
                    <div style={{ flex: '0 0 90px', fontVariantNumeric: 'tabular-nums', fontSize: 15 }}>
                      <span style={{ color: c.inflation2025 <= 5 ? '#2c6e49' : c.inflation2025 <= 15 ? '#7c5c00' : '#9e3c38', fontWeight: 700 }}>
                        {c.inflation2025.toFixed(1)}%
                      </span>
                      <span style={{ fontSize: 11, color: '#8c96a0' }}> CPI</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
                      <RiskBadge level={c.gdpRisk} small />
                      <RiskBadge level={c.inflationRisk} small />
                      <RiskBadge level={c.fxRisk} small />
                      <RiskBadge level={c.politicalRisk} small />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: eng.color, marginRight: 6 }}>{eng.icon}</span>
                    <span style={{ fontSize: 14, color: '#57606a' }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '20px 24px', borderTop: '1px solid #e1e4e8' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 14 }}>
                        {[
                          { label: 'GDP 2025', val: `+${c.gdpGrowth2025.toFixed(1)}%`, sub: `2026F: +${c.gdpGrowth2026F.toFixed(1)}%` },
                          { label: 'Inflation 2025', val: `${c.inflation2025.toFixed(1)}%`, sub: `Trend: ${c.inflationTrend}` },
                          { label: 'FX vs USD (2025)', val: `${c.fxChange2025> 0 ? '+' : ''}${c.fxChange2025.toFixed(1)}%`, sub: `Risk: ${RISK_STYLE[c.fxRisk].label}` },
                          { label: 'Policy rate', val: `${c.policyRate.toFixed(1)}%`, sub: `Risk: ${RISK_STYLE[c.policyRisk].label}` },
                        ].map(({ label, val, sub }) => (
                          <div key={label} style={{ background: '#f6f8fa', borderRadius: 4, padding: '12px 14px' }}>
                            <div style={{ fontSize: 11, color: '#8c96a0', marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: '#1b1f23', fontVariantNumeric: 'tabular-nums' }}>{val}</div>
                            <div style={{ fontSize: 12, color: '#57606a' }}>{sub}</div>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 13, color: '#57606a', lineHeight: 1.75, marginBottom: 10 }}>
                        <span style={{ fontWeight: 700, color: eng.color }}>{eng.icon} Engel:</span> {c.engelNote}
                      </p>
                      <div style={{ background: '#fdf0f0', borderLeft: '3px solid #9e3c38', padding: '10px 14px', borderRadius: '0 4px 4px 0' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#9e3c38', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top macro risk</span>
                        <p style={{ fontSize: 11, color: '#57606a', margin: '3px 0 0', lineHeight: 1.55 }}>{c.topRisk}</p>
                      </div>
                      <p style={{ fontSize: 9, color: '#8c96a0', marginTop: 6 }}>{c.source}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 10, color: '#57606a' }}>
            <div><span style={{ fontWeight: 600 }}>GDP Risk:</span> Low ≥ 4% / Medium 2-4% / Elevated 1-2% / High &lt; 1%</div>
            <div><span style={{ fontWeight: 600 }}>Inflation Risk:</span> Low ≤ 5% / Medium 5-15% / Elevated 15-30% / High &gt; 30%</div>
          </div>
        </div>
      )}

      {tab === 'charts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1b1f23' }}>GDP growth vs inflation — macro backdrop for Engel</h4>
            <GDPCPIQuadrant />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1b1f23' }}>GDP growth 2025</h4>
              <GDPBars />
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1b1f23' }}>CPI inflation 2025</h4>
              <InflationBars />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1b1f23' }}>FX change vs USD (2025)</h4>
              <FXBars />
            </div>
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1b1f23' }}>Argentina — inflation trajectory</h4>
              <ArgentinaInflation />
            </div>
          </div>
        </div>
      )}
      {tab === 'animated' && (
        <div>
          <p style={{ fontSize: 13, color: '#57606a', marginBottom: 16, lineHeight: 1.7 }}>
            Each bubble is one of the six markets. Press <strong>Play</strong> to animate 2000→2024 and watch how GDP growth and inflation evolved over 25 years. Trails show the last 5 years of movement. Vietnam's consistent upper-right trajectory contrasts with Argentina's volatility and Mexico's stagnation post-2018.
          </p>
          <MacroQuadrantAnimated />
        </div>
      )}
      {tab === 'exit' && <ExitSensitivity />}
      {tab === 'fx' && <FXSensitivity />}
    </div>
  );
}
