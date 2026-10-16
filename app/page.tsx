'use client'
import dynamic from 'next/dynamic'
import TabNav from '@/components/TabNav'
import { gdpPPP, countryElasticities, argSectors, mexicoSectors, ethiopiaSectors } from '@/data/emergingMarkets'
import { COMPANY_REPORTS } from '@/data/companyReports'

const EngelInflectionChart = dynamic(() => import('@/components/EngelInflectionChart'), { ssr: false })
const MeliQuote            = dynamic(() => import('@/components/MeliQuote'),            { ssr: false })
const ArgEngelChart        = dynamic(() => import('@/components/ArgEngelChart'),        { ssr: false })
const ArgMarketsChart      = dynamic(() => import('@/components/ArgMarketsChart'),      { ssr: false })
const EthiopiaMarketsChart = dynamic(() => import('@/components/EthiopiaMarketsChart'), { ssr: false })
const MexicoMarketsChart   = dynamic(() => import('@/components/MexicoMarketsChart'),   { ssr: false })
const DeepResearchCard     = dynamic(() => import('@/components/DeepResearchCard'),     { ssr: false })

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
          Engel curves reveal how household spending patterns evolve as income increases, providing critical insights for investment opportunities in emerging markets. The analysis across income levels from $10,000 to $30,000 per capita PPP shows food expenditure declining from 35% to 22% of household budgets [OBS — PERI WP247, 207 countries], while housing demonstrates the strongest upward trajectory, rising from 20% to 29%. Financial services (+4pp), healthcare (+4pp), and education (+3pp) also gain significant budget share. This structural shift from essential to discretionary spending marks key investment inflection points in emerging markets — India ($9,416 PPP), Indonesia ($14,471), Brazil ($19,652), Mexico ($21,970), China ($23,841) and Argentina ($26,772) are all in or approaching this transition zone [OBS — World Bank 2024].
        </p>
      </header>

      {/* ── 1. Engel Curves Global ─────────────────────────────── */}
      <Sec title="Engel Curves — Global Income Patterns" sub="Spending share (%) by category as GDP per capita rises from $10k → $30k. Interactive chart built from original Observable analysis.">
        <EngelInflectionChart />
        <p className="obs-caption" style={{ marginTop: 12 }}>
          Budget share shifts from PERI WP247 reference curve (207 countries) [OBS]. Food falls 35% → 22%; housing rises 20% → 29% (verified via lisp_eval, both budgets sum to 100%). Yellow reference lines mark current income positions: India ($9,416 PPP, entering the zone), Indonesia ($14,471, in the $13k inflection zone), Mexico/Brazil ($20-22k, mid-upper transition), China/Argentina ($24-27k, upper zone). Technology and e-commerce accelerate after $15k [INF — inferred from Wardley evolution analysis].
        </p>

        {/* Interactive chart replaces the original static image */}

        <div style={{ marginTop: 24, padding: '14px 16px', background: '#fff8c5', border: '1px solid #f0c060', borderRadius: 6 }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#9a6700' }}>Key investment implication</p>
          <p style={{ margin: 0, fontSize: 13, color: '#1b1f23', lineHeight: 1.55 }}>
            As household income crosses key thresholds, spending category shares shift predictably. The Sankey analysis (section 8 in Global Analysis) shows Housing gaining +9pp, Financial Services +4pp, Healthcare +4pp, and Education +3pp of budget share between $10k and $20k PPP [OBS]. Investment implications [JDG]: <strong>financial services and e-commerce</strong> are in the highest-growth Custom→Product phase for India ($9k) and Indonesia ($14k); <strong>housing finance and consumer credit</strong> for Brazil ($20k) and Mexico ($22k); <strong>premium retail and insurance</strong> for China ($24k) and Argentina ($27k).
          </p>
        </div>
      </Sec>

      {/* ── 2. Current Income Positions ───────────────────────── */}
      <Sec title="Where Each Market Stands Today" sub="GDP per capita PPP (constant 2021 $) — World Bank, Oct 2026 [OBS]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {Object.entries(gdpPPP).map(([country, d]) => {
            const color = COUNTRY_COLORS[country] ?? '#999'
            const zone = d.ppp2024 < 5000 ? 'Pre-inflection (<$5k)' : d.ppp2024 < 11000 ? 'Entering $10k zone' : d.ppp2024 < 16000 ? '$13k inflection zone' : d.ppp2024 < 22000 ? 'Mid-stage $18-22k' : 'Upper-mid $22k+'
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
          Source: World Bank NY.GDP.PCAP.PP.KD, retrieved 15 Oct 2026 [OBS]. PPP values (constant 2021 international $) are higher than nominal USD per capita: India nominal ~$2,600 vs PPP $9,416 (28%); Mexico nominal ~$11,500 vs PPP $21,970 (52%); Argentina nominal ~$13,000 vs PPP $26,772 (49%). The original Observable notebook used nominal USD figures, which are 25–55% of PPP values shown here.
        </p>
      </Sec>

      {/* ── 3. Emerging Market Consumption Evolution ───────────── */}
      <Sec title="Emerging Market: Consumption Evolution" sub="Income elasticities by country and sector — original analysis with 2026 company updates">
        {/* Interactive Argentina Engel curve — replaces static image */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Monthly spending by sector vs. income — Argentina</p>
          <ArgEngelChart />
        </div>

        <p className="obs-body obs-prose" style={{ color: '#57606a' }}>
          The cross-market analysis reveals distinct spending patterns across emerging markets [OBS — original Observable notebook, Nov 2024]. Brazil’s households show the highest elasticities in education (1.2) and financial services (1.1). India, currently at $9,416 PPP, is approaching the $13,000 inflection point where e-commerce spending (ε=1.2) accelerates — making it the market with the most near-term structural runway. Argentina’s high inflation environment historically drove households toward real estate (ε=1.4) and financial services (ε=1.3) as value-preservation strategies; Milei’s Dec 2023 reforms are reshaping this dynamic. Indonesia ($14,471 PPP) is currently crossing the $13,000 zone where fintech (ε=1.1) and e-commerce (ε=0.9) spending shares begin rising materially.
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
      <Sec title="MercadoLibre — Latin America's E-commerce & Fintech Leader" sub="NASDAQ: MELI · Live quote + company-research-deep analysis · 2026-10-15">
        <MeliQuote />
        <p className="obs-body obs-prose" style={{ color: '#57606a', marginBottom: 24 }}>
          MercadoLibre dominates e-commerce across Latin America and has expanded into fintech (Mercado Pago), logistics (Mercado Envíos) and credit (Mercado Crédito). Revenue: $15.1B (FY2023) → $20.8B (FY2024) → $28.9B (FY2025), 2-year CAGR of 38.3% [OBS — FMP audited statements]. Q2 2026 quarterly revenue surpassed $10B for the first time (+50% YoY) [OBS — FMP transcript]. The Engel curve connection is direct: Brazil ($19.7k PPP) is in the upper-mid transition zone where financial services spending share accelerates; Mexico ($22k PPP) is entering this zone; Argentina ($26.8k PPP) is in the upper zone where premium goods and insurance gain budget share. All three economies show rising e-commerce (ε≈1.2) and financial services (ε≈1.1–1.3) spending shares. MELI’s credit portfolio reached $16.4B (+75% YoY) with NPLs near all-time lows [OBS — Q2 2026 earnings transcript].
        </p>
        {/* Deep research report — generated via company-research-deep pipeline */}
        {COMPANY_REPORTS['MELI'] && <DeepResearchCard report={COMPANY_REPORTS['MELI']} />}
      </Sec>

      {/* ── 5. Argentina ───────────────────────────────────────── */}
      <Sec title="Argentina — Growth Trajectories" sub="Sectors updated Oct 2026. Milei reforms (Dec 2023 onward) substantially changed the investment landscape.">
        {/* Interactive Argentina markets chart — replaces static image */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Top growth industries 2014–2030 (USD billions)</p>
          <ArgMarketsChart />
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
            { label: 'GDP per capita PPP (2024)', value: '$26,772', note: 'World Bank NY.GDP.PCAP.PP.KD [OBS]. Down -4% from 2022 peak of $27,825 due to Milei’s Dec 2023 devaluation shock.', color: '#4e79a7' },
            { label: 'GDP per capita PPP (2022 peak)', value: '$27,825', note: 'Pre-shock peak. Nominal terms: ~$13k (vs PPP $27.8k — 49% ratio) [OBS].', color: '#6e7681' },
            { label: 'Lithium CAGR (projected)', value: '15%', note: 'Fastest-growing sector [INF]. Milei removed state monopoly Jan 2024. World’s 2nd largest reserves.', color: '#1a7f37' },
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
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Growth industries 2014–2030 (USD billions)</p>
            <EthiopiaMarketsChart />
          </div>
          <div>
            <p className="obs-body" style={{ color: '#57606a' }}>
              Ethiopia’s GDP per capita PPP reached $2,892 in 2024 (up from $2,517 in 2020, +14.9% over 4 years, ~3.5% CAGR) [OBS — World Bank]. At $2,892, Ethiopia is firmly pre-inflection — well below the $10k zone where discretionary spending shares begin rising. The Engel curve tailwind is not yet active, but three structural conditions are building: (1) 63% of population under 25 [OBS — original notebook]; (2) Grand Ethiopian Renaissance Dam (GERD) fully operational 2023, providing Africa’s largest hydropower capacity (5.15 GW); (3) Safaricom Ethiopia launched M-Pesa 2022, with 8M+ users by 2024. Mobile money and manufacturing are the pre-conditions for the eventual Engel shift, not signs of it having started.
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
            <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Growth industries 2014–2030 (USD billions)</p>
            <MexicoMarketsChart />
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
            Mexico overtook China as the #1 source of US goods imports in early 2026 (17% vs 7.2% share) [OBS — US Census Bureau via Economics Observatory]. FDI hit a record $41B in 2025 (+11% YoY), though 68% was reinvested earnings — not new investment — a nuance the headline obscures [OBS — Economics Observatory]. GDP growth was only 0.8% in 2025 despite the trade boom, reflecting infrastructure gaps and domestic investment weakness. The Engel curve angle: Mexico at $21,970 PPP is in the mid-stage zone where consumer credit, e-commerce, and fintech spending shares are rising — MercadoLibre’s Mexico segment grew fastest in FY2025. The 2026 USMCA review is the key near-term event. Plan Mexico targets raising investment/GDP from 22% to 25–28%.
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
        <p><strong>Updated data [OBS]:</strong> World Bank NY.GDP.PCAP.PP.KD (Oct 2026) · FMP income_statement + transcripts MELI (Oct 2026) · EODHD real-time quotes · PERI WP247 “Engel’s Law Around the World 150 Years Later” (207 countries) · Economics Observatory, LSEG, Dallas Fed (Mexico nearshoring) · NBS China 2023 household expenditure · India MoSPI HCES 2023-24 · Safaricom Ethiopia (M-Pesa users)</p>
        <p><strong>Analysis tools:</strong> kask sankey-flow skill (Sankey, P5) · kask wardley-mapper framework (Wardley evolution, P4) · kask scenario_calibrate (macro probabilities, P6) · company-research-deep pipeline (MELI, HDB reports)</p>
        <p><strong>Provenance:</strong> [OBS] = primary/sourced · [INF] = model inference from data · [JDG] = analyst judgment · [GAP] = evidence unavailable</p>
      </footer>
    </div>
  )
}
