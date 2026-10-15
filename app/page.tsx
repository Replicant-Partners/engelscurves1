'use client'
import dynamic from 'next/dynamic'
import TabNav from '@/components/TabNav'
import { OBS_IMAGES, gdpPPP, countryElasticities, argSectors, mexicoSectors, ethiopiaSectors } from '@/data/emergingMarkets'

const EngelInflectionChart = dynamic(() => import('@/components/EngelInflectionChart'), { ssr: false })
const MeliQuote            = dynamic(() => import('@/components/MeliQuote'),            { ssr: false })

const TH: React.CSSProperties = { textAlign: 'left', padding: '6px 16px 8px 0', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }
const TD: React.CSSProperties = { padding: '7px 16px 7px 0', borderBottom: '1px solid #eaeef2', verticalAlign: 'top', fontSize: 13 }

const FLAG = (f: string): React.CSSProperties => {
  const m: Record<string, React.CSSProperties> = {
    OBS: { background: '#e6f4ea', color: '#1a7f37', borderColor: '#a8d5b5' },
    INF: { background: '#fff8c5', color: '#9a6700', borderColor: '#f0c060' },
  }
  return { ...(m[f] ?? m.INF), fontSize: 10, padding: '1px 7px', borderRadius: 20, border: '1px solid', fontFamily: 'monospace', whiteSpace: 'nowrap' }
}

const COUNTRY_COLORS: Record<string, string> = {
  Argentina: '#4e79a7', Mexico: '#f28e2b', Brazil: '#e15759',
  Indonesia: '#59a14f', Egypt: '#edc948', Ethiopia: '#76b7b2',
}

const Sec = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 56 }}>
    <h2 className="obs-h2">{title}</h2>
    {sub && <p className="obs-byline">{sub}</p>}
    {children}
  </section>
)

export default function EmergingMarkets() {
  return (
    <div className="obs-notebook">
      <header style={{ paddingTop: 48 }}>
        <TabNav />
        <h1 className="obs-h1">Consumption Evolution Analysis Through Engel Curves</h1>
        <p className="obs-byline" style={{ marginTop: 6 }}>
          Originally published Nov 21, 2024 · Updated Oct 2026 with World Bank, FMP &amp; EODHD live data
        </p>
        <p className="obs-body obs-prose" style={{ color: '#57606a' }}>
          Engel curves reveal how household spending patterns evolve as income increases, providing critical insights for investment opportunities in emerging markets. The analysis across income levels from $10,000 to $30,000 per capita shows food expenditure declining significantly from 35% to 22% of household budgets, while housing demonstrates the strongest upward trajectory, increasing from 9% to 29%. This fundamental shift from essential to discretionary spending marks key investment inflection points in emerging markets.
        </p>
      </header>

      {/* ── 1. Engel Curves Global ─────────────────────────────── */}
      <Sec title="Engel Curves — Global Income Patterns" sub="Spending share (%) by category as GDP per capita rises from $10k → $30k. Interactive chart built from original Observable analysis.">
        <EngelInflectionChart />
        <p className="obs-caption" style={{ marginTop: 12 }}>
          Based on the original Observable notebook analysis. Food share falls from 35% → 22%; housing rises from 9% → 29%. Technology and entertainment accelerate sharply after the $15,000 inflection point. Yellow reference lines mark current income positions of Indonesia/India ($13k) and Egypt/Argentina ($18-20k). [OBS — notebook analysis; INF — interactive recreation from original data]
        </p>

        {/* Original Observable static image as reference */}
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Original notebook chart (Nov 2024)
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={OBS_IMAGES.engelGlobal}
            alt="Engel Curves Global Income — original Observable chart"
            style={{ width: '100%', borderRadius: 8, border: '1px solid #eaeef2' }}
          />
        </div>

        <div style={{ marginTop: 24, padding: '14px 16px', background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6 }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#9a6700' }}>Key investment implication</p>
          <p style={{ margin: 0, fontSize: 13, color: '#1b1f23', lineHeight: 1.55 }}>
            Technology and entertainment sectors exhibit classic luxury good characteristics (ε &gt; 1), accelerating rapidly after the $15,000 income level. Healthcare and education show steady increases. These patterns suggest optimal market entry points: <strong>real estate and housing plays</strong> as markets approach $20,000 per capita; <strong>technology and digital platforms</strong> around $15,000; <strong>premium consumer services</strong> throughout the transition.
          </p>
        </div>
      </Sec>

      {/* ── 2. Current Income Positions ───────────────────────── */}
      <Sec title="Where Each Market Stands Today" sub="GDP per capita PPP (constant 2021 $) — World Bank, Oct 2026 [OBS]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {Object.entries(gdpPPP).map(([country, d]) => {
            const color = COUNTRY_COLORS[country] ?? '#999'
            const zone = d.ppp2024 < 5000 ? 'Pre-inflection' : d.ppp2024 < 14000 ? 'Early stage (~$13k zone)' : d.ppp2024 < 20000 ? 'Mid-stage (~$15-18k zone)' : 'Upper-mid ($20k+ zone)'
            return (
              <div key={country} style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#1b1f23' }}>{country}</span>
                </div>
                <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>
                  ${d.ppp2024.toLocaleString()}
                </p>
                <p style={{ margin: '0 0 8px', fontSize: 11, color: '#6e7681' }}>PPP per capita (2024)</p>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: color + '18', color, border: `1px solid ${color}40` }}>
                  {zone}
                </span>
              </div>
            )
          })}
        </div>
        <p className="obs-caption">
          Source: World Bank NY.GDP.PCAP.PP.KD, retrieved 15 Oct 2026. PPP values are not directly comparable to the original notebook&apos;s nominal USD figures — nominal GDP per capita is approximately 35-60% of PPP values depending on the economy.
        </p>
      </Sec>

      {/* ── 3. Emerging Market Consumption Evolution ───────────── */}
      <Sec title="Emerging Market: Consumption Evolution" sub="Income elasticities by country and sector — original analysis with 2026 company updates">
        {/* Original Argentina curve image */}
        <div style={{ marginBottom: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={OBS_IMAGES.argCurve}
            alt="Engel Curve Argentina — original Observable chart"
            style={{ width: '100%', borderRadius: 8, border: '1px solid #eaeef2' }}
          />
          <p className="obs-caption">Argentina Engel curve — original Observable analysis (Nov 2024)</p>
        </div>

        <p className="obs-body obs-prose" style={{ color: '#57606a' }}>
          The cross-market analysis of monthly consumer spending reveals distinct patterns across emerging markets, with key inflection points varying by country and sector. Brazil shows the highest elasticity in education (1.2) and financial services (1.1), while India demonstrates strong e-commerce elasticity (1.2) with an earlier inflection point ($13,000). Argentina&apos;s unique economic environment drives high elasticity in real estate (1.4) and financial services (1.3) as value preservation strategies. Indonesia shows fintech and e-commerce elasticities of 1.1 and 0.9 respectively.
        </p>

        {/* Elasticity table */}
        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d0d7de' }}>
                {['Country', 'Sector', 'Elasticity', 'Inflection point', 'Company / Leader', 'Updated status'].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {countryElasticities.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eaeef2' }}>
                  <td style={TD}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                      <strong>{r.country}</strong>
                    </span>
                  </td>
                  <td style={TD}>{r.sector}</td>
                  <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 700, color: '#1b1f23' }}>{r.elasticity}</td>
                  <td style={{ ...TD, fontFamily: 'monospace', color: '#6e7681' }}>${r.inflection.toLocaleString()}</td>
                  <td style={{ ...TD, fontWeight: 500 }}>{r.company}</td>
                  <td style={TD}>
                    <span style={FLAG('OBS')}>OBS</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Sec>

      {/* ── 4. MercadoLibre ────────────────────────────────────── */}
      <Sec title="MercadoLibre — Latin America's E-commerce & Fintech Leader" sub="NASDAQ: MELI · Live quote + FMP financials [OBS]">
        <MeliQuote />
        <p className="obs-body obs-prose" style={{ color: '#57606a' }}>
          MercadoLibre dominates e-commerce across Latin America and has expanded into fintech (MercadoPago), logistics (MELI Envíos) and credit (Mercado Crédito). Revenue grew from $15.1B (2023) → $20.8B (2024) → $28.9B (2025), a 3-year CAGR of ~38%. The company benefits directly from the Engel curve shift: as Brazil, Argentina and Mexico move through the $10k-$20k income range, both e-commerce (ε ≈ 1.2) and financial services (ε ≈ 1.1-1.3) spending shares rise faster than income.
        </p>
      </Sec>

      {/* ── 5. Argentina ───────────────────────────────────────── */}
      <Sec title="Argentina — Growth Trajectories" sub="Sectors updated Oct 2026. Milei reforms (Dec 2023 onward) substantially changed the investment landscape.">
        {/* Original chart */}
        <div style={{ marginBottom: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={OBS_IMAGES.argMarket}
            alt="Argentina market opportunities — original Observable chart"
            style={{ width: '100%', borderRadius: 8, border: '1px solid #eaeef2' }}
          />
          <p className="obs-caption">Original analysis (Nov 2024) — updated figures in table below</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 16 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d0d7de' }}>
              {['Sector', 'CAGR to 2030', 'Size 2024', 'Size 2030', 'Update / Context'].map(h => <th key={h} style={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {argSectors.map((r) => (
              <tr key={r.sector} style={{ borderBottom: '1px solid #eaeef2' }}>
                <td style={{ ...TD, fontWeight: 600 }}>{r.sector}</td>
                <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 700, color: '#1a7f37' }}>{r.cagr2030}%</td>
                <td style={{ ...TD, fontFamily: 'monospace', color: '#6e7681' }}>{r.unit}{r.size2024}B</td>
                <td style={{ ...TD, fontFamily: 'monospace', color: '#1b1f23' }}>{r.unit}{r.size2030}B</td>
                <td style={TD}>
                  <span style={FLAG(r.flag)}>{r.flag}</span>
                  <span style={{ marginLeft: 6, color: '#57606a' }}>{r.note}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'GDP per capita PPP (2024)', value: '$26,772', note: 'World Bank [OBS]. Down from $27,825 (2022) — Milei shock therapy.', color: '#4e79a7' },
            { label: 'GDP per capita PPP (2020)', value: '$23,877', note: 'Pre-Milei base.', color: '#6e7681' },
            { label: 'Lithium CAGR', value: '15%', note: 'Fastest-growing sector. Milei removed state monopoly Jan 2024.', color: '#1a7f37' },
          ].map(c => (
            <div key={c.label} style={{ border: '1px solid #d0d7de', borderRadius: 6, padding: '12px 14px' }}>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{c.label}</p>
              <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: 20, fontWeight: 700, color: c.color }}>{c.value}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#afb8c1' }}>{c.note}</p>
            </div>
          ))}
        </div>
      </Sec>

      {/* ── 6. Ethiopia ────────────────────────────────────────── */}
      <Sec title="Ethiopia — Frontier Market Evolution" sub="Updated Oct 2026. GERD fully operational; Safaricom M-Pesa launched 2022.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={OBS_IMAGES.ethiopia}
              alt="Ethiopia market — original Observable chart"
              style={{ width: '100%', borderRadius: 8, border: '1px solid #eaeef2' }}
            />
            <p className="obs-caption">Original analysis (Nov 2024)</p>
          </div>
          <div>
            <p className="obs-body" style={{ color: '#57606a' }}>
              Ethiopia&apos;s GDP per capita PPP reached $2,892 in 2024 (up from $2,517 in 2020, +14.9%). The country sits firmly pre-inflection on the Engel curve — but its 63% youth population and rapid urbanization create the structural conditions for the shift.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #d0d7de' }}>
                  {['Sector', '2024', '2030 proj.', ''].map(h => <th key={h} style={{ ...TH, fontSize: 10 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {ethiopiaSectors.map(r => (
                  <tr key={r.sector} style={{ borderBottom: '1px solid #eaeef2' }}>
                    <td style={{ ...TD, fontWeight: 600, fontSize: 12 }}>{r.sector}</td>
                    <td style={{ ...TD, fontFamily: 'monospace', fontSize: 12, color: '#6e7681' }}>${r.value2024}B</td>
                    <td style={{ ...TD, fontFamily: 'monospace', fontSize: 12, color: '#1b1f23', fontWeight: 600 }}>${r.value2030}B</td>
                    <td style={{ ...TD, fontSize: 11, color: '#57606a' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sec>

      {/* ── 7. Mexico ──────────────────────────────────────────── */}
      <Sec title="Mexico — Nearshoring &amp; Digital Transformation" sub="Substantially updated — Mexico overtook China as #1 US import source in 2026.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={OBS_IMAGES.mexico}
              alt="Mexico growth — original Observable chart"
              style={{ width: '100%', borderRadius: 8, border: '1px solid #eaeef2' }}
            />
            <p className="obs-caption">Original projections (Nov 2024)</p>
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'US import share', value: '17%', note: '#1 source (vs China 7.2%), Q1 2026 [OBS]', up: true },
                { label: 'FDI 2025', value: '$41B', note: 'Record high, +11% YoY [OBS]', up: true },
                { label: 'GDP per capita PPP', value: '$21,970', note: 'World Bank 2024 [OBS]', up: true },
                { label: 'GDP growth 2025', value: '0.8%', note: 'Slower than expected; exports +7.6% [OBS]', up: false },
              ].map(c => (
                <div key={c.label} style={{ border: '1px solid #d0d7de', borderRadius: 6, padding: '10px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 10, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{c.label}</p>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: c.up ? '#1a7f37' : '#cf222e' }}>{c.value}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 10, color: '#afb8c1' }}>{c.note}</p>
                </div>
              ))}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #d0d7de' }}>
                  {['Sector', 'CAGR 2030E', 'Update'].map(h => <th key={h} style={{ ...TH, fontSize: 10 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {mexicoSectors.map(r => (
                  <tr key={r.sector} style={{ borderBottom: '1px solid #eaeef2' }}>
                    <td style={{ ...TD, fontWeight: 600, fontSize: 12 }}>{r.sector}</td>
                    <td style={{ ...TD, fontFamily: 'monospace', fontWeight: 700, color: '#1a7f37', fontSize: 12 }}>{r.cagr2030}%</td>
                    <td style={{ ...TD, fontSize: 11, color: '#57606a' }}>
                      <span style={FLAG(r.flag)}>{r.flag}</span>
                      <span style={{ marginLeft: 5 }}>{r.note}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ marginTop: 16, background: '#ddf4ff', border: '1px solid #b6e3ff', borderRadius: 6, padding: '12px 16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#0969da' }}>Nearshoring 2.0 update [OBS]</p>
          <p style={{ margin: 0, fontSize: 13, color: '#1b1f23', lineHeight: 1.55 }}>
            Mexico has overtaken China as the top source of US goods imports (17% vs 7.2% share, early 2026). The trend is evolving toward higher-value sectors — semiconductors, medical devices, AI infrastructure. The 2026 USMCA review is the key near-term event shaping future flows. Plan Mexico targets raising investment to 25-28% of GDP.
          </p>
        </div>
      </Sec>

      {/* ── Supplementary ──────────────────────────────────────── */}
      <Sec title="Supplementary Analysis" sub="Links from the original Observable notebook — Claude.ai deep-dives by market">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { country: 'Brazil',    url: 'https://claude.ai/share/3ac24263-48f5-4e84-8dca-f2921d717fbc', note: 'Market Evolution 2014-2030' },
            { country: 'India',     url: 'https://claude.ai/share/5e89877d-3355-4d67-bacc-da1d7ded647f', note: 'Market Evolution 2014-2030' },
            { country: 'Indonesia', url: 'https://claude.ai/share/065eca1f-53cb-40de-918b-df4c1e92c428', note: 'Market Evolution 2014-2030' },
            { country: 'Egypt',     url: 'https://claude.ai/share/7db63d4e-eabc-4b65-9176-1855c04e6ac6', note: 'Market Evolution 2014-2030' },
            { country: 'Argentina', url: 'https://claude.ai/share/6a3f2a26-9bd6-4a3b-9773-0abf5fa07f0e', note: 'Growing Industries' },
            { country: 'Ethiopia',  url: 'https://claude.ai/share/5f07dbf0-ce27-46c9-9c2a-a3e755dc2cde', note: 'Growing Industries' },
          ].map(l => (
            <a key={l.country} href={l.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div style={{ border: '1px solid #d0d7de', borderRadius: 8, padding: '14px 16px', background: '#fff', cursor: 'pointer', transition: 'border-color .15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: COUNTRY_COLORS[l.country] ?? '#999', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#1b1f23' }}>{l.country}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#0969da' }}>{l.note} →</p>
              </div>
            </a>
          ))}
        </div>
      </Sec>

      <footer style={{ borderTop: '1px solid #d0d7de', paddingTop: 24, marginTop: 16, fontSize: 12, color: '#6e7681' }}>
        <p><strong>Original notebook:</strong> Mario Orellana (@merchantadventure) · observablehq.com · Nov 21, 2024</p>
        <p><strong>Updated data sources:</strong> World Bank NY.GDP.PCAP.PP.KD (Oct 2026) · FMP income_statement MELI (Oct 2026) · EODHD real-time quote MELI · Economics Observatory (Mexico nearshoring) · LSEG (Mexico) · Dallas Fed (nearshoring analysis)</p>
        <p>All claims labeled [OBS] = primary source · [INF] = inference · [JDG] = judgment</p>
      </footer>
    </div>
  )
}
