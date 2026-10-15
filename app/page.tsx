'use client'

import dynamic from 'next/dynamic'

// All chart components are client-only (Recharts requires browser APIs)
const IncomeGrowthChart = dynamic(() => import('@/components/IncomeGrowthChart'), { ssr: false })
const EngelCurveChart   = dynamic(() => import('@/components/EngelCurveChart'),   { ssr: false })
const ChinaSpendingChart = dynamic(() => import('@/components/ChinaSpendingChart'), { ssr: false })
const IndustryChains    = dynamic(() => import('@/components/IndustryChains'),    { ssr: false })
const ScenarioTree      = dynamic(() => import('@/components/ScenarioTree'),      { ssr: false })
const DataGapsTable     = dynamic(() => import('@/components/DataGapsTable'),     { ssr: false })

const NAV = [
  { id: 'mechanism',  label: 'Mechanism'   },
  { id: 'income',     label: 'Income'      },
  { id: 'curve',      label: 'Engel Curve' },
  { id: 'china',      label: 'China 2023'  },
  { id: 'economies',  label: 'Economies'   },
  { id: 'chains',     label: 'Chains'      },
  { id: 'scenario',   label: 'Scenario'    },
  { id: 'gaps',       label: 'Gaps'        },
]

function SectionCard({ id, title, subtitle, children }: {
  id: string; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        {children}
      </div>
    </section>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block text-xs font-mono px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: color + '50', background: color + '15' }}
    >
      {label}
    </span>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar nav */}
      <nav className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-48 bg-zinc-950 border-r border-zinc-900 pt-8 pb-4 px-4 z-10">
        <div className="mb-8">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Research</p>
          <p className="text-xs text-zinc-600 mt-0.5">Engel Curves</p>
        </div>
        <ul className="space-y-1 flex-1">
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="block text-xs text-zinc-500 hover:text-zinc-200 py-1.5 px-2 rounded-lg hover:bg-zinc-900 transition-colors"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="text-xs text-zinc-700 mt-4">
          <p>15 Oct 2026</p>
          <p className="mt-0.5">Run: 60c9821f</p>
        </div>
      </nav>

      {/* Main content */}
      <main className="lg:ml-48 flex-1 max-w-5xl mx-auto px-4 lg:px-10 py-12">

        {/* Hero */}
        <header className="mb-14">
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge label="OBS = Primary source" color="#10b981" />
            <Badge label="INF = Model inference" color="#f59e0b" />
            <Badge label="JDG = Analyst judgment" color="#6366f1" />
            <Badge label="GAP = Evidence unavailable" color="#71717a" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-3">
            Engel-Curve Shifts, Industry Growth & Equity Prices
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            An evidence-led, single cross-economy pass. As household income rises, spending shares
            shift from necessities toward luxuries. This report traces that mechanism across five
            economies, ranks four industry chains, and asks whether current equity prices already
            reflect the outlook.
          </p>
          <p className="text-xs text-zinc-600 mt-3">
            Not investment advice. Every claim carries a provenance label. Data gaps are declared, not substituted.
          </p>
        </header>

        {/* 1. Mechanism */}
        <SectionCard
          id="mechanism"
          title="1. The Economic Mechanism"
          subtitle="Engel's Law and income elasticity — three distinctions the evidence requires"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                title: 'Inferior goods',
                badge: 'ε_Y < 0',
                badgeColor: '#ef4444',
                desc: 'Absolute spending falls as income rises. Budget share falls sharply. Examples: cheap staple grains, basic public transit.',
              },
              {
                title: 'Necessities',
                badge: '0 < ε_Y < 1',
                badgeColor: '#f59e0b',
                desc: 'Absolute spending rises but slower than income. Budget share falls. Examples: food, basic clothing, utilities.',
              },
              {
                title: 'Luxuries',
                badge: 'ε_Y > 1',
                badgeColor: '#10b981',
                desc: 'Spending rises faster than income. Budget share rises. Examples: healthcare, education, travel, premium goods.',
              },
            ].map((c) => (
              <div key={c.title} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-zinc-200">{c.title}</span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color: c.badgeColor, background: c.badgeColor + '18' }}>{c.badge}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">Three distinctions required by the evidence</h3>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex gap-3">
                <span className="text-indigo-400 font-bold flex-shrink-0">1.</span>
                <p><strong className="text-zinc-200">Spending levels vs. budget shares.</strong> Absolute food spending rises with income; the <em>share</em> of food falls. Industry revenue responds to absolute spending; Engel-curve shifts operate on shares. These must not be conflated.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-indigo-400 font-bold flex-shrink-0">2.</span>
                <p><strong className="text-zinc-200">Cross-sectional vs. longitudinal.</strong> Cross-section: rich vs. poor households today. Longitudinal: the same economy over decades. High-inequality economies can show a steep cross-section while longitudinal shifts are slow — if income growth is concentrated at the top.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-indigo-400 font-bold flex-shrink-0">3.</span>
                <p><strong className="text-zinc-200">Confounders.</strong> Relative price changes (healthcare inflation vs. food deflation), demographic mix (aging raises healthcare share independently), inequality (Gini), urbanisation, and category definition changes all shift apparent Engel curves without any income-elasticity effect.</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-3">
              Methodological warning [OBS]: De Vreyer et al. (World Bank Economic Review 2025 / NBER WP26850) show standard household Engel curves
              overestimate food income elasticity by up to 43% due to intra-household heterogeneity.
            </p>
          </div>
        </SectionCard>

        {/* 2. Income trajectories */}
        <SectionCard
          id="income"
          title="2. Economy Income Trajectories"
          subtitle="GDP per capita PPP (constant 2021 $) — World Bank series, 2000–2024"
        >
          <IncomeGrowthChart />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {[
              { name: 'China',   cagr: '+7.9%', period: '2000-2024', color: '#ef4444', note: '+487% total' },
              { name: 'India',   cagr: '+4.9%', period: '2000-2024', color: '#f59e0b', note: '+213% total' },
              { name: 'Brazil',  cagr: '+1.4%', period: '2000-2024', color: '#8b5cf6', note: 'Peaked 2013-14' },
              { name: 'Germany', cagr: '+1.0%', period: '2000-2024', color: '#10b981', note: 'Stable high-income' },
              { name: 'USA',     cagr: '+1.3%', period: '2000-2024', color: '#3b82f6', note: '$75.7k (2024)' },
            ].map((e) => (
              <div key={e.name} className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="font-semibold text-zinc-200">{e.name}</span>
                </div>
                <p className="text-zinc-300 font-mono">{e.cagr} CAGR</p>
                <p className="text-zinc-600">{e.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Brazil caution: income peaked in 2013-14 (~$19.2k) and only recovered to $19.7k by 2024. No Engel-curve tailwind is evidenced for Brazil.
            Brazil is a stagnation case study, not a tailwind economy. [OBS]
          </p>
        </SectionCard>

        {/* 3. Engel Curve */}
        <SectionCard
          id="curve"
          title="3. The Engel Curve — Cross-Economy Evidence"
          subtitle="Food budget share (%) vs. GDP per capita PPP — reference curve + observed economy points"
        >
          <EngelCurveChart />
        </SectionCard>

        {/* 4. China 2023 */}
        <SectionCard
          id="china"
          title="4. China Household Spending — 2023"
          subtitle="NBS press release, 18 Jan 2024 — per capita consumption by category [OBS]"
        >
          <ChinaSpendingChart />
        </SectionCard>

        {/* 5. Economy evidence table */}
        <SectionCard
          id="economies"
          title="5. Cross-Economy Evidence Table"
          subtitle="One pass — dated. Gaps labeled, not filled."
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  {['Economy', 'Income 2024 PPP', 'Food share', 'Healthcare share', 'Key shift observed', 'Data year', 'Uncertainty'].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 text-zinc-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {[
                  {
                    name: 'India',
                    income: '$9,416',
                    food: '~47% rural [OBS]',
                    health: 'GAP',
                    shift: 'Non-food share +5.9pp rural; +2.6pp urban; Gini declining',
                    year: 'HCES 2023-24',
                    unc: 'No category×quintile; HCES food def. includes beverages',
                    color: '#f59e0b',
                  },
                  {
                    name: 'China',
                    income: '$23,841',
                    food: '29.8% [OBS]',
                    health: '9.2% [OBS]',
                    shift: 'Healthcare +16%, Education +16.4% YoY; Food −4pp since 2013',
                    year: 'NBS 2023',
                    unc: 'Rhodium Group disputes NBS aggregate consumption levels',
                    color: '#ef4444',
                  },
                  {
                    name: 'USA',
                    income: '$75,698',
                    food: '~13% [INF]',
                    health: '18% of GDP [OBS]',
                    shift: 'Lowest quintile income +6.8% (2022-24); outpaced all quintiles',
                    year: 'BLS CEX 2024',
                    unc: 'Category×quintile shares not extracted; healthcare share is price-driven',
                    color: '#3b82f6',
                  },
                  {
                    name: 'Germany',
                    income: '$62,655',
                    food: '~13.9% [OBS]',
                    health: '9.3% of GDP [OBS]',
                    shift: 'GKV spending +7.8% projected 2025; aging-driven not income-elastic',
                    year: 'Eurostat HBS 2020; OECD 2026',
                    unc: 'HBS 2020 is pre-COVID; Destatis EVS quintile data not extracted',
                    color: '#10b981',
                  },
                  {
                    name: 'Brazil',
                    income: '$19,652',
                    food: 'GAP',
                    health: 'GAP',
                    shift: 'Income flat since 2013; no Engel shift evidenced',
                    year: 'WB 2024',
                    unc: 'IBGE POF not retrieved; stagnation case, not tailwind',
                    color: '#8b5cf6',
                  },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-zinc-900/50">
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: row.color }} />
                        <span className="font-medium text-zinc-200">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-4 text-zinc-300 font-mono">{row.income}</td>
                    <td className="py-2 pr-4 text-zinc-300">{row.food}</td>
                    <td className="py-2 pr-4 text-zinc-300">{row.health === 'GAP' ? <span className="text-zinc-600 italic">GAP</span> : row.health}</td>
                    <td className="py-2 pr-4 text-zinc-400 max-w-xs">{row.shift}</td>
                    <td className="py-2 pr-4 text-zinc-500">{row.year}</td>
                    <td className="py-2 text-zinc-600 max-w-xs">{row.unc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-700 mt-3">
            Global reference [OBS]: food share ~50% low-income → ~40% lower-middle → ~30% upper-middle → ~15% high-income.
            Source: PERI WP247 "Engel&apos;s Law Around the World 150 Years Later" (207 countries).
          </p>
        </SectionCard>

        {/* 6. Industry chains */}
        <SectionCard
          id="chains"
          title="6. Ranked Industry–Economy Chains"
          subtitle="Four chains with strongest plausible tailwind or structural driver — traced to listed companies"
        >
          <IndustryChains />

          {/* Implied vs evidenced table */}
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">
              Implied vs. Evidenced Growth — Dated Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Company</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Evidenced recent growth [OBS]</th>
                    <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Price-implied growth [INF]</th>
                    <th className="text-left py-2 text-zinc-400 font-medium">Sensitivity axis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  <tr>
                    <td className="py-2 pr-4 font-medium text-zinc-200">Titan (TITAN.NS)</td>
                    <td className="py-2 pr-4 text-zinc-400">29.2% revenue CAGR FY23-26; +29.3% Q1FY27</td>
                    <td className="py-2 pr-4 text-zinc-400">~20-25% EPS CAGR at 59x fwd P/E [INF]</td>
                    <td className="py-2 text-zinc-500">Gold price; premiumisation rate</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-zinc-200">LVMH (MC.PA)</td>
                    <td className="py-2 pr-4 text-zinc-400">-1% organic H1 2025; F&L -5% organic Q3 2026</td>
                    <td className="py-2 pr-4 text-zinc-400">Visible Alpha consensus: +1-2% organic [OBS]</td>
                    <td className="py-2 text-zinc-500">China property recovery; aspirational shopper recovery</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-zinc-200">Fresenius SE (FRE.DE)</td>
                    <td className="py-2 pr-4 text-zinc-400">Organic +7% Q1 2025; guided 4-6% FY2025</td>
                    <td className="py-2 pr-4 text-zinc-400 italic text-zinc-600">P/E not retrieved [GAP]</td>
                    <td className="py-2 text-zinc-500">GKV reform; home dialysis adoption</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-zinc-200">FME (FME.DE)</td>
                    <td className="py-2 pr-4 text-zinc-400">Q2 2026 €4.86bn (beat est.); patient count -16% since 2020</td>
                    <td className="py-2 pr-4 text-zinc-400">FY2026 margin guidance 10.5-12%</td>
                    <td className="py-2 text-zinc-500">Patient volume trajectory; reimbursement reform</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>

        {/* 7. Scenario tree */}
        <SectionCard
          id="scenario"
          title="7. Scenario Tree Pilot — China Income Trajectory"
          subtitle="Focal question: Will China household disposable income grow at ≥5% real CAGR 2024-2028? [JDG — illustrative structure, not a quantified forecast]"
        >
          <ScenarioTree />
        </SectionCard>

        {/* 8. Data gaps */}
        <SectionCard
          id="gaps"
          title="8. Data Gaps"
          subtitle="Unavailable evidence — declared, not substituted"
        >
          <DataGapsTable />
          <div className="mt-4 p-3 rounded-lg bg-indigo-950/20 border border-indigo-800/20">
            <p className="text-xs font-medium text-indigo-400 mb-1">Skill recommendation</p>
            <p className="text-xs text-zinc-400">
              <strong className="text-zinc-300">superforecasting</strong> — The scenario tree in Section 7 uses judgment-based probabilities [JDG].
              Running the formal Tetlock pipeline (triage → Fermi decomposition → outside view → Bayesian update → dragonfly-eye synthesis)
              on the three China branches would sharpen the probabilities and surface the most discriminating evidence to monitor.
              The China income trajectory question is crisp, binary-decomposable, and has market-observable leading indicators.
            </p>
          </div>
        </SectionCard>

        {/* Footer */}
        <footer className="border-t border-zinc-900 pt-8 pb-16 text-xs text-zinc-600">
          <p className="mb-2 font-medium text-zinc-500">Sources</p>
          <ul className="space-y-1">
            <li>World Bank NY.GDP.PCAP.PP.KD series, retrieved 15 Oct 2026</li>
            <li>China NBS "Households&apos; Income and Consumption Expenditure in 2023", 18 Jan 2024</li>
            <li>India MoSPI HCES 2023-24 via official release / The India Forum analysis</li>
            <li>PERI WP247 "Engel&apos;s Law Around the World 150 Years Later" (207 countries)</li>
            <li>NBER WP26850 / De Vreyer et al. World Bank Economic Review 2025 — sub-household bias</li>
            <li>Eurostat HBS 2020 (hbs_exp_t133, hbs_str_t223)</li>
            <li>OECD "Latest Health Spending Trends and Outlook" March 2026</li>
            <li>Commonwealth Fund "U.S. Health Care from a Global Perspective 2026"</li>
            <li>ICICI Direct Q4FY26 Titan research note</li>
            <li>Moneycontrol Titan Company (TITAN.NS) data — Aug 2026</li>
            <li>Reuters: LVMH Q3 2026 results, 13 Oct 2026</li>
            <li>Fresenius SE Q1 2025 earnings; FME Q2 2026 earnings call</li>
            <li>Rhodium Group "No Quick Fixes: China&apos;s Long-Term Consumption Growth"</li>
            <li>AOF/CICC "Understanding Household Consumption in China" (income elasticity estimates)</li>
          </ul>
          <p className="mt-4 text-zinc-700">
            Research run 60c9821f · 15 Oct 2026 · Not investment advice.
            Every claim carries a provenance label: [OBS] primary, [INF] model inference, [JDG] analyst judgment, [GAP] unavailable.
          </p>
        </footer>
      </main>
    </div>
  )
}
