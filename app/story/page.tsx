import type { Metadata } from 'next';
import Link from 'next/link';
import { LawChart } from '../../components/story/LawChart';
import { BreakChart } from '../../components/story/BreakChart';
import { PhaseTracks } from '../../components/story/PhaseTracks';
import { HouseholdBars } from '../../components/story/HouseholdBars';
import { DollarStreetHouses } from '../../components/story/DollarStreetHouses';
import { EngelExplorer } from '../../components/story/EngelExplorer';
import { explorer } from '../../data/explorerData';
import { dollarStreet } from '../../data/dollarStreet';
import { deep } from '../../data/deepDive';
import { mechanismData } from '../../data/mechanismData';
import { MechanismChart } from '../../components/story/MechanismChart';
import { JapanChart } from '../../components/story/JapanChart';
import { RobustnessChart } from '../../components/story/RobustnessChart';
import { MeasurementRisk } from '../../components/story/MeasurementRisk';
import { ValuationChains } from '../../components/story/ValuationChains';
import { EarlySignals } from '../../components/story/EarlySignals';
import { PortfolioBuilder } from '../../components/story/PortfolioBuilder';
import { MacroRisk } from '../../components/story/MacroRisk';
import { WatchTimeline } from '../../components/story/WatchTimeline';
import { story } from '../../data/storyData';
import { evidenceItems, literatureSources } from '../../data/literatureEvidence';

export const metadata: Metadata = {
  title: 'From Food to Finance | Engel Curves Research',
  description: 'How rising incomes shift household budgets away from food: the law, the break, 102 countries in motion, twelve markets, the street, and what to watch.',
};

const usd = (v: number) => `$${(v / 1000).toFixed(1)}k`;
// Deterministic comma-formatter: avoids toLocaleString() ICU mismatch between Node.js and browser
const num = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const pct = (v: number) => `${Math.round(v * 100)}%`;
const T = Object.fromEntries(story.tracks.map((t) => [t.iso3, t]));

const chapters = [
  { id: 'mechanism', n: '0', title: 'The mechanism' },
  { id: 'law', n: '1', title: 'The law' },
  { id: 'break', n: '2', title: 'The break' },
  { id: 'motion', n: '3', title: 'In motion' },
  { id: 'map', n: '4', title: 'The map' },
  { id: 'money', n: '5', title: 'The freed-up wallet' },
  { id: 'street', n: '6', title: 'The street' },
  { id: 'chains', n: '7', title: 'Who captures the transition?' },
  { id: 'macrorisk', n: '8', title: 'Macro risk' },
  { id: 'portfolio', n: '9', title: 'Portfolio construction' },
  { id: 'watch', n: '10', title: 'Predictions' },
  { id: 'method', n: '11', title: 'Evidence and method' },
];

function Tag({ t }: { t: 'OBS' | 'INF' | 'JDG' | 'GAP' }) {
  return <span className="font-mono text-[9px] tracking-wider text-[#57606a] border border-[#d0d7de] rounded px-1 py-px mr-1.5 align-middle bg-white">{t}</span>;
}

function Cite({ ids }: { ids: number[] }) {
  return <sup className="text-[10px] text-[#57606a] ml-0.5">[{ids.join(',')}]</sup>;
}

function Record({ children }: { children: React.ReactNode }) {
  return <div className="mt-10 pt-6 border-t border-[#e1e4e8] text-xs text-[#8c96a0] leading-[1.7] space-y-2">{children}</div>;
}

function Chapter({ id, n, title, lede, children }: { id: string; n: string; title: string; lede: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 py-14 border-t border-[#d0d7de]">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 xl:grid-cols-[320px_1fr]">
        <div className="mb-8 lg:mb-0 lg:pt-1">
          <div className="text-xs font-mono text-[#57606a] tracking-widest mb-2">CHAPTER {n}</div>
          <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-3">{title}</h2>
          <p className="text-base lg:text-lg text-[#57606a] leading-relaxed">{lede}</p>
        </div>
        <div className="[&>p]:max-w-[680px] [&>p]:leading-[1.75] [&_.text-sm]:leading-[1.7] space-y-0">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function StoryPage() {
  const watch = [
    { when: '25 Oct 2026', what: 'Brazil presidential runoff', detail: 'Polymarket: Flávio Bolsonaro 77.8%, Lula 22.5%. Brazil sits just past the transition; the result bears on the real and on dollar-measured incomes.', tag: 'OBS' as const },
    { when: 'Apr 2027', what: 'IMF World Economic Outlook update', detail: 'Revises the growth paths behind every 2030 probability on the map. A downgrade for Indonesia or Vietnam lowers their exit odds directly.', tag: 'INF' as const },
    { when: 'By 2027', what: 'Egypt leaves the transition', detail: `${pct(T.EGY.pExit2027)} probability on the IMF path. The first of the six transition markets likely to cross the 35% food-share line.`, tag: 'INF' as const },
    { when: '2027 data', what: 'Indonesia\u2019s credit reaches 40% of GDP', detail: '16% probability (36.4% in 2024); a near-term marker of financial deepening. In Singh (2021), stock-market gains reached consumption only in the deeper-credit group, which averaged above about 58% of GDP.', tag: 'INF' as const },
    { when: 'By 2028', what: 'Indonesia leaves the transition', detail: '23% probability. Most of the move is expected later.', tag: 'INF' as const },
    { when: 'By 2030', what: 'Vietnam and Indonesia leave the transition', detail: `Vietnam ${pct(T.VNM.pExit2030)}, Indonesia ${pct(T.IDN.pExit2030)}. Both fall to about 5% and 2% if 2025 incomes are overstated by 20%.`, tag: 'INF' as const },
  ];

  return (
    <main className="min-h-screen bg-white text-[#1b1f23]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#d0d7de]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-20 h-12 flex items-center gap-5 text-xs overflow-x-auto">
          <span className="font-semibold whitespace-nowrap">From Food to Finance</span>
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="text-[#57606a] hover:text-[#1b1f23] whitespace-nowrap">{c.n}. {c.title}</a>
          ))}
          <Link href="/" className="ml-auto text-[#57606a] hover:text-[#1b1f23] whitespace-nowrap">Dashboard &rarr;</Link>
        </div>
      </nav>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-20">
        {/* Chapter 0 */}
        <header className="pt-16 pb-14">
          <div className="text-xs font-mono text-[#57606a] tracking-widest mb-4">ENGEL CURVES RESEARCH &middot; OCTOBER 2026</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight max-w-5xl">
            As countries get richer, the share of household budgets spent on food falls. The shift starts near {usd(story.bounds.start)} per person, not $15,000.
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-5xl font-semibold tracking-tight">{usd(story.bounds.start)}</div>
              <p className="text-sm text-[#57606a] mt-2 leading-relaxed">GDP per capita (PPP) where the food share of spending starts to fall. 90% interval {usd(story.bounds.startCi[0])}&ndash;{usd(story.bounds.startCi[2])}.</p>
            </div>
            <div>
              <div className="text-5xl font-semibold tracking-tight">6 of 12</div>
              <p className="text-sm text-[#57606a] mt-2 leading-relaxed">Emerging markets tracked here are inside the transition today: India, the Philippines, South Africa, Indonesia, Vietnam and Egypt.</p>
            </div>
            <div>
              <div className="text-5xl font-semibold tracking-tight">3 of 6</div>
              <p className="text-sm text-[#57606a] mt-2 leading-relaxed">Transition markets more likely than not to complete it by 2030 on IMF growth paths: Egypt ({pct(T.EGY.pExit2030)}), Vietnam ({pct(T.VNM.pExit2030)}) and Indonesia ({pct(T.IDN.pExit2030)}).</p>
            </div>
          </div>
          <p className="text-base text-[#57606a] mt-10 leading-relaxed max-w-[680px]">
            Built from {story.fit.n} household surveys, World Bank and IMF income data, and 15 papers. Every number links to a source or a script; labels mark what is observed <Tag t="OBS" />, inferred <Tag t="INF" />, judged <Tag t="JDG" /> or missing <Tag t="GAP" />.
          </p>
        </header>

                <section id="mechanism" className="scroll-mt-16 py-14 border-t border-[#d0d7de]">
          <div className="text-xs font-mono text-[#57606a] tracking-widest mb-2">CHAPTER 0</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-3">The mechanism</h2>
          <p className="text-lg text-[#1b1f23] leading-relaxed mb-8 max-w-[680px]">
            Before looking at countries, the underlying economics: what Engel curves measure, what they don't, and why the distinction matters for industry analysis.
          </p>

          {/* 0.1 Three distinct concepts */}
          <div className="space-y-10">
            <div>
              <h3 className="text-lg font-semibold mb-3">Three concepts that are easy to confuse</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm leading-relaxed">
                <div className="border-l-2 border-[#4c78a8] pl-4">
                  <div className="font-semibold mb-1">Expenditure level (q<sub>i</sub>)</div>
                  <p>How much a household spends in dollars on category i. Rises with income for all goods except inferior goods. <Tag t="OBS" />Engel's original finding (1857) was about food expenditure in Belgian working-class families — it rises with income, but more slowly.</p>
                </div>
                <div className="border-l-2 border-[#9aa4ae] pl-4">
                  <div className="font-semibold mb-1">Budget share (w<sub>i</sub>)</div>
                  <p>The fraction of total spending devoted to category i. <Tag t="OBS" />This is what the Engel curve in chapters 1–2 tracks: the food share falls. A good's share falls if its income elasticity is below 1, rises if above 1.<Cite ids={[4]} /></p>
                </div>
                <div className="border-l-2 border-[#c26b6b] pl-4">
                  <div className="font-semibold mb-1">Income elasticity (η<sub>i</sub>)</div>
                  <p><Tag t="OBS" />"Goods with income elasticities below zero, between zero and 1, and above 1 are called inferior goods, necessities and luxuries respectively."<Cite ids={[4]} /> Critically, a good that is a luxury for the poor can be a necessity for the rich — elasticity changes with income level.</p>
                </div>
              </div>
            </div>

            {/* 0.2 Elasticity chart */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Income elasticities across 12 consumption categories</h3>
              <p className="text-sm text-[#57606a] mb-4"><Tag t="OBS" />Estimated from the Working-Leser demand system (w<sub>i</sub> = α<sub>i</sub> + β<sub>i</sub> log Q) on 42 countries, mostly OECD plus Mexico, Korea and Turkey. η<sub>i</sub> = 1 + β<sub>i</sub> / w<sub>i</sub>.<Cite ids={[9]} /> Source: {mechanismData.source}</p>
              <div className="border border-[#d0d7de] p-4 overflow-x-auto"><MechanismChart /></div>
              <div className="text-sm leading-relaxed mt-4 space-y-2">
                <p><Tag t="INF" />Health (η={mechanismData.categories.find((c: any) => c.id === 'health')?.eta.toFixed(2)}), recreation ({mechanismData.categories.find((c: any) => c.id === 'recreation')?.eta.toFixed(2)}) and restaurants ({mechanismData.categories.find((c: any) => c.id === 'restaurants')?.eta.toFixed(2)}) are luxuries in the OECD: for every 1% rise in total spending, these categories grow by 1.3%+. Food is an inferior good at OECD income levels (η={mechanismData.categories.find((c: any) => c.id === 'food')?.eta.toFixed(2)}): the rich already have enough — additional income flows elsewhere.</p>
                <p><Tag t="JDG" />These are OECD-weighted estimates. In our transition markets — where incomes are still 15–60% of OECD levels — the sign and magnitude of elasticities differ, especially for health and education, which behave more like luxuries where public provision is low. We mark these differences as [GAP] where no country-specific estimate exists.</p>
              </div>
            </div>

            {/* 0.3 Cross-section vs longitudinal */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Cross-section is not the same as a country's path over time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                  <p className="font-semibold mb-1">Cross-sectional Engel curve</p>
                  <p><Tag t="OBS" />"The structure of cross-section Engel curves reflects the structure of individual ones" (Härdle & Jerison 1991, cited in Benda-Prokeinová et al. 2017<Cite ids={[1]} />). A cross-section compares different households at the same moment — it is the map we use in chapters 1–4.</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Within-country longitudinal change</p>
                  <p><Tag t="INF" />As chapter 2's Japan chart shows, a single country can walk the cross-sectional map over decades. But the within-country slope (–0.057 per log point) is about half the cross-sectional one (–0.112 in the same USDA panel). The map is the long-run destination, not a five-year forecast.</p>
                </div>
              </div>
            </div>

            {/* 0.4 What moves the curve */}
            <div>
              <h3 className="text-lg font-semibold mb-2">What else moves the curve (and why it matters for industry analysis)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-4 text-sm leading-relaxed">
                <div className="border border-[#e1e4e8] p-3">
                  <div className="font-semibold mb-1">Relative prices</div>
                  <p><Tag t="OBS" />If health prices rise faster than income, health spending can absorb a larger share even with no real change in quantity.<Cite ids={[9]} /> Budget shares reflect nominal spending; quantity purchased can diverge sharply. This matters especially in markets with rapid healthcare-price inflation.</p>
                </div>
                <div className="border border-[#e1e4e8] p-3">
                  <div className="font-semibold mb-1">Demographic composition</div>
                  <p><Tag t="OBS" />"Engel curves may also depend on demographic variables and other consumer characteristics."<Cite ids={[4]} /> Household size (children reduce per-capita spending on non-food goods), age structure (retirees spend differently to workers) and urbanisation all shift the curve independently of income.</p>
                </div>
                <div className="border border-[#e1e4e8] p-3">
                  <div className="font-semibold mb-1">Inequality</div>
                  <p><Tag t="INF" />If income growth is concentrated at the top, the aggregate food share can fall even if median households see no change. A rising food share among lower deciles, as in Egypt 2017–2023 (+3.3pp), may reflect food-price inflation hitting the poor more than income effects.</p>
                </div>
                <div className="border border-[#e1e4e8] p-3">
                  <div className="font-semibold mb-1">Category definitions</div>
                  <p><Tag t="OBS" />"The level of aggregation across goods affects Engel curve estimates."<Cite ids={[4]} /> Pakistan and the Philippines include tobacco in food; India excludes imputed owner rent. These choices move budget shares by 2–5 points — a gap larger than the transition effect in some years.</p>
                </div>
              </div>
            </div>

            {/* 0.5 What the data cannot say */}
            <div>
              <h3 className="text-lg font-semibold mb-2">What we can and cannot infer for industry analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                  <p className="font-semibold mb-1">What the curve establishes</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The direction and approximate magnitude of budget-share shifts as income rises — a durable pattern across 150 years of data.</li>
                    <li>Which categories capture a disproportionate share of new income (η &gt; 1) and which lose share (η &lt; 1 or &lt; 0).</li>
                    <li>Where a country sits on the transition today and how far it needs to travel (chapters 3–4).</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-1">What it cannot establish alone</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><Tag t="GAP" />The speed of the within-country transition — that depends on growth, inequality, prices and policy.</li>
                    <li><Tag t="GAP" />Market structure: a growing category benefits all suppliers; which firm captures share depends on competition, not on Engel curves.</li>
                    <li><Tag t="GAP" />Whether current stock prices already discount the transition — that requires valuation analysis, which begins in phase 3.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Record>
            <p>Core definitions: Lewbel &amp; Houthakker (2008), evidence item 4. Elasticity estimates: Clements &amp; Chen (2010), 42-country Working-Leser system, evidence item 9. Cross-section vs. longitudinal distinction: Benda-Prokeinová et al. (2017), evidence item 1; Japan time series (Pritchett &amp; Spivack 2013, table A.12). Confounding factors: Lewbel (2008) on aggregation; Almås (2012) on PPP bias, evidence item 12. Script: analysis/mechanism.mjs.</p>
          </Record>
        </section>

<Chapter id="law" n="1" title="The law" lede="Poorer households spend most of their budget on food. Richer ones spend a small share. Engel described this in the 19th century; household surveys across the world still show it.">
          <LawChart />

          {/* Two key observations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mt-14 mb-12">
            <p className="text-[15px] leading-[1.75] text-[#1b1f23]">
              <Tag t="OBS" />A typical household in Ethiopia (2004) spent 54% of its budget on food; in Switzerland (2003), 9%. Each dot is one national survey — the chart fills poorest to richest as you arrive, and the slider walks it one survey at a time.
            </p>
            <p className="text-[15px] leading-[1.75] text-[#1b1f23]">
              <Tag t="OBS" />The pattern holds across income groups: over 50% in low-income countries, 40– 50% in lower-middle and 30–40% in upper-middle income countries<Cite ids={[10]} />. Between countries, being 50% richer means a food share about 5 points lower<Cite ids={[9]} />.
            </p>
          </div>

          <Record>
            <p>Food shares: survey means from the appendix tables of Pritchett &amp; Spivack (2013), 1991–2010. Income: World Bank NY.GDP.PCAP.PP.KD, matched to survey year. All {story.fit.n} values checked against the source tables.</p>
          </Record>
        </Chapter>

        {/* Going deeper — FULL WIDTH outside Chapter */}
        <div className="py-12 border-t border-[#d0d7de]">
          <h3 className="text-lg font-semibold mb-1">Going deeper</h3>
          <p className="text-sm text-[#57606a] leading-relaxed mb-8">150 years, four studies, the same slope.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {deep.historicalSlopes.map((h) => (
              <div key={h.label}>
                <div className="text-5xl font-semibold tracking-tight">{h.v.toFixed(3)}</div>
                <p className="text-sm text-[#57606a] mt-2 leading-relaxed">{h.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div className="border-l-2 border-[#d0d7de] pl-4">
              <p><Tag t="JDG" />Few relationships in economics are this stable across centuries, methods and samples. That stability licenses using the curve as a map — if the slope varied by era or method, the projections in chapter 4 would be guesswork.</p>
            </div>
            <div className="border-l-2 border-[#d0d7de] pl-4">
              <p className="text-[#57606a]">And it is why deviations matter: Bulgaria and Armenia sit far above the line, Ukraine and the West Bank far below. The curve is a long-run attractor, not a five-year forecast.</p>
            </div>
          </div>
        </div>

        <Chapter id="break" n="2" title="The break" lede={`The decline is not smooth from the start. Below about ${usd(story.bounds.start)}, the food share barely moves. Above it, it falls steadily until food is about a third of the budget near ${usd(story.bounds.end)}. That band is the transition.`}>

          <BreakChart />

          {/* Three key observations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-4 mt-8">
            <p className="text-[15px] leading-[1.75]">
              <Tag t="INF" />Toggle &ldquo;one slope&rdquo; to see why a straight line fails: below the break the fitted share stays near 56&ndash;59%; above it, food falls about {Math.round(Math.abs(story.piecewise.slopeAbove) * Math.LN2 * 100)} percentage points each time income doubles.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <Tag t="INF" />The earlier $15,000 marker sits inside the transition, where food is still about 37% of spending. It marks the middle of the shift, not its start.
            </p>
            <p className="text-[15px] leading-[1.75]">
              <Tag t="GAP" />No paper in the corpus states a dollar threshold. Both boundaries are this study&apos;s estimates<Cite ids={[3]} />.
            </p>
          </div>

          {/* Going deeper: Japan case study */}
          <div className="mt-12 pt-8 border-t border-[#e1e4e8]">
            <p className="text-xs font-mono text-[#57606a] tracking-widest mb-6">GOING DEEPER — ONE COUNTRY, ONE LIFETIME</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-6">
              <p className="text-[15px] leading-[1.75]">
                <Tag t="OBS" />Japan walked most of this curve in one lifetime: between 1955 and 1992 its household food share fell from 37.4% to 15.7% while real spending per person multiplied by 3.7 (38 annual observations, Pritchett &amp; Spivack table A.12).
              </p>
              <p className="text-[15px] leading-[1.75] text-[#57606a]">
                <Tag t="INF" />Japan&rsquo;s case shows the cross-country pattern can also be a within-country path — it entered the window already mid-transition and exited the 35% line around 1973. The transition took about 18 years at Japan&rsquo;s growth rate; at slower emerging-market rates it takes longer.
              </p>
            </div>
            <div className="overflow-x-auto rounded border border-[#e1e4e8]">
              <JapanChart />
            </div>
            <p className="text-[14px] leading-[1.7] text-[#57606a] mt-4">
              <Tag t="INF" />On the fit, the transition spans about ${num(deep.freed.delta)} per person per year of non-food spending: at our break threshold ($6.6k) non-food spending is ${num(deep.freed.atBreak)}; at our exit threshold ($17.8k) it is ${num(deep.freed.atExit)}. That dollar span — not the percentage — is what a consumer business prices.
            </p>
          </div>

          {/* Does the break hold up? */}
          <div className="mt-12 pt-8 border-t border-[#e1e4e8]">
            <p className="text-xs font-mono text-[#57606a] tracking-widest mb-3">ROBUSTNESS — DOES THE BREAK HOLD UP?</p>
            <p className="text-[15px] leading-[1.75] text-[#57606a] mb-6">
              The same model re-estimated on five versions of the data. If the break were an artefact of one group of surveys, it would move or vanish when that group is removed.
            </p>
            <div className="overflow-x-auto rounded border border-[#e1e4e8]">
              <RobustnessChart />
            </div>
            <p className="text-[15px] leading-[1.75] mt-4">
              <Tag t="INF" />In four of five versions the break lands at $6.6k (between $6,566 and $6,592) and stays significant. Without the ILO surveys — half the sample and the largest single source inside the transition band (13 of 32 surveys) — it moves to $5.7k and becomes borderline (sup-F 8.6 vs 8.85 critical). The location is stable; its sharpness depends on having enough middle-income data.
            </p>
          </div>

          <Record>
            <p>Model: food share on ln(GDP per capita) with one estimated break. Break at {usd(story.bounds.start)} (bootstrap 90% interval {usd(story.bounds.startCi[0])}&ndash;{usd(story.bounds.startCi[2])}); slope {story.piecewise.slopeBelow} below, {story.piecewise.slopeAbove} above. sup-F {story.fit.supF} against an Andrews (1993) 5% critical value of 8.85. The 35% line comes from the linear fit (R&sup2; {story.fit.r2}), 90% interval {usd(story.bounds.endCi[0])}&ndash;{usd(story.bounds.endCi[2])}.</p>
            <p>The break survives dropping definition-problem surveys, one-survey-per-country and dropping the LSMS table; it weakens to borderline without the ILO surveys. Scripts: analysis/engel_threshold.mjs, engel_robustness.mjs; independent check: verify_independent.py.</p>
            <p>A second lens agrees on the start and moves the end: on national-accounts food shares (USDA ERS, 101 countries, 2023) the break lands near $8.9k (borderline-significant) and food reaches 35% near $12.2k, because national accounts count items surveys miss, such as imputed rent. Both lenses are side by side in <a href="#motion" className="underline underline-offset-2">chapter 3</a>.</p>
          </Record>
        </Chapter>

        <Chapter id="motion" n="3" title="In motion" lede="The same law, set in motion. Each bubble is one of 102 countries; press play to watch seven observed years, then the IMF income path to 2030. The dark line is the Engel curve every bubble is read against.">

          <EngelExplorer />

          {/* Two context notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mt-8">
            <p className="text-[15px] leading-[1.75]">
              <Tag t="INF" />This animated lens uses national-accounts food shares (USDA ERS, {explorer.usda.n} countries, 2017&ndash;2023). The shift begins near ${(explorer.usda.knot / 1000).toFixed(1)}k and food reaches 35% near ${(explorer.usda.end / 1000).toFixed(1)}k — earlier than the survey lens because national accounts include imputed rent. The static survey lens is one toggle away; both lenses agree on where the shift <em>starts</em> ($6.6k&ndash;$8.9k) and disagree on where it <em>ends</em>.
            </p>
            <p className="text-[15px] leading-[1.75] text-[#57606a]">
              <Tag t="JDG" />Click any country to trace its year-by-year path. Hollow dashed bubbles are projections: income moves on the IMF path, food share is held at its 2023 value — not forecast. The projection shows direction, not magnitude.
            </p>
          </div>

          {/* Going deeper: 3 observations as insight cards */}
          <div className="mt-12 pt-8 border-t border-[#e1e4e8]">
            <p className="text-xs font-mono text-[#57606a] tracking-widest mb-6">GOING DEEPER — THREE THINGS THE ANIMATION SHOWS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-[#f6f8fa] rounded-lg p-5 border border-[#e1e4e8]">
                <p className="text-xs font-mono text-[#57606a] tracking-widest mb-3">THE MAP MOVES SLOWLY</p>
                <p className="text-[14px] leading-[1.75]">
                  <Tag t="INF" />Within countries the share fell only {deep.withinCountrySlope} per log point of income growth over 2017&ndash;2023 — half the cross-section slope. The cross-section is a long-run map, not a five-year forecast.
                </p>
              </div>

              <div className="bg-[#f6f8fa] rounded-lg p-5 border border-[#e1e4e8]">
                <p className="text-xs font-mono text-[#57606a] tracking-widest mb-3">2020 RAN IT IN REVERSE</p>
                <p className="text-[14px] leading-[1.75]">
                  <Tag t="OBS" />Mean income fell ~5% in 2020 and mean food share rose from {Math.round(deep.covid.share2019 * 1000) / 10}% to {Math.round(deep.covid.share2020 * 1000) / 10}%. <Tag t="JDG" />Whether this was the law under a shock, food-price inflation, or lockdown spending composition — the panel cannot separate them.
                </p>
              </div>

              <div className="bg-[#f6f8fa] rounded-lg p-5 border border-[#e1e4e8]">
                <p className="text-xs font-mono text-[#57606a] tracking-widest mb-3">A TENDENCY, NOT DESTINY</p>
                <p className="text-[14px] leading-[1.75]">
                  <Tag t="OBS" />{deep.moversTotal} of {deep.moversPanel} countries raised their food share despite income growth above 5%, including {deep.movers.map((m) => `${m.country} (+${m.dpp}pp)`).join(', ')}. <Tag t="JDG" />We attribute those rises mainly to food-price inflation — a judgment the panel cannot confirm.
                </p>
              </div>

            </div>
          </div>

          <Record>
            <p>Observed bubbles: USDA ERS food share (via Our World in Data) &times; World Bank GDP per capita PPP (2021$) &times; population, 713 country-years. Projections 2024&ndash;2030: IMF WEO growth from the WB 2023 level; 99 of 102 countries have paths (Bolivia, Lebanon and Sri Lanka stop at 2023). USDA-lens break ${(explorer.usda.knot / 1000).toFixed(1)}k is borderline-significant (sup-F {explorer.usda.supF} vs 8.85); the survey-lens break is strong (sup-F {story.fit.supF}). Script: analysis/explorer/build_explorer_data.mjs.</p>
          </Record>
        </Chapter>

        <Chapter id="map" n="4" title="The map" lede="Where twelve emerging markets stand today and where IMF growth projections take them by 2030. Six are inside the transition; three of them are likely to finish it this decade.">
          <div className="border border-[#d0d7de] p-4 md:p-6 overflow-x-auto">
            <PhaseTracks />
          </div>
          <p className="text-xs text-[#57606a] mt-2">Click a country to trace its year-by-year path in <a href="#motion" className="underline underline-offset-2">chapter 3</a>.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 text-sm leading-relaxed">
            <p><Tag t="INF" />India ({usd(T.IND.gdp2025)}) and the Philippines ({usd(T.PHL.gdp2025)}) are early in the transition, with food near {pct(T.IND.food2025)} of spending. Neither reaches the 35% line by 2030.</p>
            <p><Tag t="INF" />Vietnam and Indonesia are in the upper half. On IMF paths they cross by 2030 with {pct(T.VNM.pExit2030)} and {pct(T.IDN.pExit2030)} probability. South Africa stays put: its projected growth is close to zero.</p>
            <p><Tag t="INF" />Ten of twelve markets sit in their phase with at least 94% probability. The uncertain ones are Egypt and Colombia, near the upper boundary.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-1">The biggest risk: how income is measured</h3>
              <p className="text-sm leading-relaxed mt-2"><Tag t="INF" />PPP incomes tend to overstate poorer countries&apos; real income<Cite ids={[12]} />. The 2030 exit odds of the three markets closest to the line fall fast if that bias applies here. With a 10% overstatement, Vietnam drops from {pct(T.VNM.pExit2030)} to {pct(T.VNM.pExit2030Overstated10)} and Indonesia from {pct(T.IDN.pExit2030)} to {pct(T.IDN.pExit2030Overstated10)}.</p>
              <p className="text-sm leading-relaxed mt-3"><Tag t="GAP" />Alm&aring;s (2012) estimates the bias for Penn World Table incomes; no source gives its size for the World Bank series used here. The 10% and 20% cases are stress tests, not estimates.</p>
            </div>
            <div className="md:col-span-3 border border-[#d0d7de] p-4 md:p-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#57606a] mb-4">Probability of leaving the transition by 2030</div>
              <MeasurementRisk />
            </div>
          </div>

          <details className="mt-10 border-t border-b border-[#e1e4e8] py-4">
            <summary className="cursor-pointer font-semibold text-sm">Full table: phase probabilities for all twelve markets</summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#d0d7de] text-[#57606a] text-xs uppercase tracking-wider">
                    <th className="py-2 pr-3">Market</th>
                    <th className="py-2 pr-3 text-right">GDP pc 2025 &rarr; 2030</th>
                    <th className="py-2 pr-3 text-right">Food share 2025 &rarr; 2030</th>
                    <th className="py-2 pr-3 text-right">P(pre / transition / post) today</th>
                    <th className="py-2 pr-3 text-right">P(exit by 2027)</th>
                    <th className="py-2 pr-3 text-right">P(exit by 2030)</th>
                    <th className="py-2 text-right">Same, income overstated 20%</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {story.tracks.map((r) => {
                    const near = (r.gdp2025 >= story.bounds.startCi[0] && r.gdp2025 <= story.bounds.startCi[2]) || (r.gdp2025 >= story.bounds.endCi[0] && r.gdp2025 <= story.bounds.endCi[2]);
                    const past = r.gdp2025 >= story.bounds.end;
                    return (
                      <tr key={r.iso3} className="border-b border-[#e1e4e8] last:border-0">
                        <td className="py-2 pr-3 font-sans text-sm">{r.country}{near && <span className="ml-2 text-[10px] text-[#57606a] uppercase tracking-wider">near boundary</span>}</td>
                        <td className="py-2 pr-3 text-right">{usd(r.gdp2025)} &rarr; {usd(r.gdp2030)}</td>
                        <td className="py-2 pr-3 text-right">{(r.food2025 * 100).toFixed(1)}% &rarr; {(r.food2030 * 100).toFixed(1)}%</td>
                        <td className="py-2 pr-3 text-right">{pct(r.pPre2025)} / {pct(r.pTransition2025)} / {pct(r.pPost2025)}</td>
                        <td className="py-2 pr-3 text-right">{past ? '—' : pct(r.pExit2027)}</td>
                        <td className="py-2 pr-3 text-right font-semibold">{past ? '—' : pct(r.pExit2030)}</td>
                        <td className="py-2 text-right text-[#57606a]">{past ? '—' : pct(r.pExit2030Overstated20)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-[#57606a] mt-3">&ldquo;Near boundary&rdquo;: 2025 income inside the 90% interval of a phase boundary. Dashes: already past the transition in 2025 on the point estimate; their probability of being post-inflection today is in the fourth column.</p>
            </div>
          </details>
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Going deeper</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
              <p><Tag t="INF" />Median crossing years on the bootstrap paths: Egypt {deep.medianExit.EGY}, Vietnam {deep.medianExit.VNM}, Indonesia {deep.medianExit.IDN}. India, the Philippines and South Africa do not reach a 50% exit probability by 2030 &mdash; India and the Philippines because the distance is large, South Africa because its projected growth is close to zero.</p>
              <p><Tag t="JDG" />A tension we watch rather than hide: the survey-based model predicts Indonesia&rsquo;s food share falling as it grows, yet on the USDA national-accounts lens Indonesia&rsquo;s observed share <em>rose</em> 1.7 points over 2017&ndash;2023 (chapter 3). If that persists, the {Math.round(story.tracks.find((t) => t.iso3 === 'IDN')!.pExit2030 * 100)}%-by-2030 exit probability is too optimistic. The first check arrives with the 2024&ndash;2025 USDA releases.</p>
            </div>
          </div>

          <Record>
            <p>Phase probabilities from 2,000 bootstrap re-fits of the survey curve. 2025 levels: World Bank. 2026&ndash;2030 paths: IMF WEO NGDPRPPPPC growth applied to the World Bank level. Probabilities reflect uncertainty in the curve only, not IMF forecast error.</p>
            <p>Measurement risk: PPP incomes tend to overstate poorer countries&apos; real income<Cite ids={[12]} />. If 2025 incomes were 20% too high, Indonesia&apos;s 2030 exit probability falls from {pct(T.IDN.pExit2030)} to {pct(T.IDN.pExit2030Overstated20)}, Vietnam&apos;s from {pct(T.VNM.pExit2030)} to {pct(T.VNM.pExit2030Overstated20)}. Script: analysis/phase_probabilities.mjs.</p>
          </Record>
        </Chapter>

        <Chapter id="money" n="5" title="The freed-up wallet" lede="What the transition means for a household. When income per person doubles from $10,000 to $20,000, spending on everything other than food more than doubles.">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-3">
              <HouseholdBars />
              <p className="text-sm leading-relaxed mt-6"><Tag t="INF" />Food falls from {pct(story.household[0].foodShare)} to {pct(story.household[1].foodShare)} of the budget. Non-food spending per person rises from ${num(story.household[0].nonFood)} to ${num(story.household[1].nonFood)}, about +{Math.round((story.household[1].nonFood / story.household[0].nonFood - 1) * 100)}%, while income rises 100%.</p>
            </div>
            <div className="md:col-span-2 text-sm leading-relaxed space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#57606a]">Where the money goes, according to the literature</h3>
              <p><span className="font-semibold">Discretionary goods.</span> The share of spending on discretionary goods rises with income<Cite ids={[1, 2]} />.</p>
              <p><span className="font-semibold">Housing first.</span> In 20 emerging markets, household wealth reaches consumption mainly through housing<Cite ids={[6]} />.</p>
              <p><span className="font-semibold">Finance later.</span> Stock-market gains reach consumption only once the financial sector deepens past a threshold<Cite ids={[7]} />.</p>
              <p><span className="font-semibold">Thinner than it looks.</span> Even the richest 5% of households in poor countries spend 5&ndash;15 points more on food than the poor in rich countries<Cite ids={[11]} />.</p>
              <p><span className="font-semibold">More cyclical.</span> Discretionary demand tracks financial markets more closely than necessities (US retail evidence)<Cite ids={[5]} />.</p>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Going deeper</h3>
            <p className="text-sm leading-relaxed"><Tag t="INF" />Scaled up, this per-person arithmetic is the largest consumption story of the decade: Kharas projects global middle-class consumption $29 trillion higher in 2030 than in 2015<Cite ids={[15]} />, with today&rsquo;s lower middle-income countries &mdash; including India, Indonesia and Vietnam &mdash; carrying $15 trillion of that market growth<Cite ids={[16]} />. Those are the same markets chapter 4 places inside the transition. <Tag t="JDG" />Both figures are 2017 projections, not observations; we cite them as the order of magnitude, not a forecast we underwrite.</p>
          </div>

          <Record>
            <p>Household figures use the linear fit at $10,000 and $20,000 GDP per capita (recomputed with lisp_eval). This is a comparison across countries at one point in time, not the path of a single country. Numbered citations refer to the evidence table in chapter 8.</p>
            <p>To see what these budgets look like inside real homes, walk <a href="https://www.gapminder.org/dollar-street" target="_blank" rel="noreferrer" className="underline underline-offset-2">Dollar Street</a> &mdash; or jump straight to chapter 6 below.</p>
          </Record>
        </Chapter>

        <Chapter id="street" n="6" title="The street" lede={`The same transition, seen from inside the home. Dollar Street (Gapminder) photographs real families and places them on one global street by consumption per adult — ${dollarStreet.usable} families so far. Here are the ${dollarStreet.markets.filter((m) => m.n > 0).length} of our twelve markets they have visited.`}>
          <DollarStreetHouses />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-sm leading-relaxed">
            <p><Tag t="OBS" />Each house is one documented family, stacked where its consumption per adult per month (PPP) falls on the street; toggle a market to light its homes. The spread inside one country is the point: India’s {dollarStreet.markets.find((m) => m.iso3 === 'IND')!.n} families run from ${dollarStreet.markets.find((m) => m.iso3 === 'IND')!.min} to ${dollarStreet.markets.find((m) => m.iso3 === 'IND')!.max} a month — the whole Engel curve lives inside a single country.</p>
            <p><Tag t="JDG" />The dashed line marks the $11-a-day middle-class entry (about ${dollarStreet.kharasMonthly}/month)<Cite ids={[13]} />. Families to its left spend their budgets largely on food and essentials; to its right, the freed-up wallet of chapter 4 appears — this is the household-level view of the same shift our country phases track in GDP terms. The two scales are related but not convertible, so no phase boundaries are drawn here.</p>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Going deeper</h3>
            <p className="text-sm leading-relaxed"><Tag t="OBS" />{deep.street.belowEntry} of the {deep.street.familiesOurMarkets} documented families in our twelve markets ({Math.round(100 * deep.street.belowEntry / deep.street.familiesOurMarkets)}%) live below our $335/month entry line (the $11-a-day definition of item 13, converted to a month<Cite ids={[13]} />). India&rsquo;s 10th-percentile family lives on ${deep.street.indiaP10} a month and its 90th on ${num(deep.street.indiaP90)} &mdash; a {Math.round(deep.street.indiaP90 / deep.street.indiaP10)}&times; spread inside one country. <Tag t="INF" />This is evidence item 11 made visible: a country&rsquo;s average hides most of the street it actually lives on, which is why chapter 4&rsquo;s country phases and this chapter&rsquo;s households are different questions.</p>
          </div>

          <Record>
            <p>Source: Dollar Street family registry via api.dollarstreet.org (fetched {dollarStreet.fetched}; {dollarStreet.usable} families, {dollarStreet.markets.reduce((s2, m) => s2 + m.n, 0)} in these twelve markets; Argentina has none yet). Dollars/month = household consumption per adult-equivalent, PPP, self-reported and Gapminder-adjusted. Dollar Street is a Gapminder project, CC BY 4.0. Script: analysis/dollar-street/build.mjs.</p>
          </Record>
        </Chapter>

                <Chapter
          id="chains"
          n="7"
          title="Who captures the transition?"
          lede="The Engel mechanism identifies which categories of spending grow as incomes rise. The investment question is which listed companies sit in those categories — and whether current prices already discount the growth."
        >
          <p className="text-sm leading-relaxed mb-6">
            <Tag t="JDG" />Chapters 1&ndash;6 established the mechanism, the data, and the country-level predictions. This chapter traces the last mile: income change &rarr; budget share shift &rarr; industry revenue &rarr; one or two listed companies per market. For each pair we compute the implied terminal growth embedded in the current stock price and compare it with observed revenue growth. A second section asks whether the early company-level signals already confirm what the macro predicts. Six market-company pairs trace the chain: income change &rarr; budget share shift &rarr; industry revenue &rarr; one or two listed companies. For each pair we compute the growth rate the current price implicitly assumes (implied terminal growth, derived from forward P/E and a 9% discount rate), compare it with recent observed revenue growth, and assign a calibrated probability to a one-year thesis question using the Tetlock superforecasting pipeline. Click a row to expand the full chain and falsifier.
          </p>
          <ValuationChains />

          <div style={{ marginTop: 48 }}>
            <div className="text-xs font-mono text-[#57606a] tracking-widest mb-2">PART II OF THIS CHAPTER</div>
            <h3 className="text-xl font-semibold tracking-tight mb-2">Are they capturing it yet? Early signals</h3>
            <p className="text-sm text-[#57606a] leading-relaxed mb-0">
              The valuation chains above ask <em>who could</em> capture the transition. This section asks <em>who already is</em>: which company-level metrics confirm the Engel mechanism is showing up in observed financials. FY2025 primary filings. Click a pair to expand.
            </p>
            <EarlySignals />
          </div>

          <Record>
            <p><strong>Mechanism.</strong> The link from income to category demand rests on Clements &amp; Chen (2010): &ldquo;when the relative price of food is constant, [the food share equation] implies d&#x175; &asymp; &beta;Q&#x302;, with &beta; = w(&eta; &minus; 1)&rdquo; &mdash; the budget share falls when the elasticity is below 1. Their 42-country cross-section yields a median slope &beta; &asymp; &minus;0.13 (food-share change per log-point of income, R&sup2;&thinsp;=&thinsp;0.85). That is the slope every chain below uses to link a country&rsquo;s income position to its freed-up budget. <Tag t="OBS" /></p>
            <p><strong>Middle-class threshold.</strong> Kharas (2017) defines the global middle class as households with per capita incomes &ldquo;between $10 and $100 per person per day (pppd) in 2005 PPP terms&rdquo; &mdash; $11&ndash;$110 in 2011 PPP. The six pairs are chosen from countries already at or approaching this band: the freed-up wallet is not hypothetical but observable in current household survey data. <Tag t="OBS" /></p>
            <p><strong>Data vintage.</strong> Revenue growth: FY2025 primary filings for FEMSA (AR Mar-2026), Siloam (IDX Mar-2026), MTN Nigeria (NGX Feb-2026); H1-2026 for MWG and MTNN where more recent. Multiples as of late Oct 2026. P/E type: forward for MWG, FMX, YDUQ3; trailing for MTNN and SILO; TTM for GGAL &mdash; see footnote ¹ in the chart. All six <code>forecast_persist</code> IDs registered; call <code>forecast_record</code> at horizon to close the Brier loop.</p>
            <p><strong>Falsifiers.</strong> Each chain states a condition that would invalidate its premise. Engel curves describe structural budget share shifts over years; they do not predict macro shocks, FX moves, or policy reversals. Where macro overwhelms the mechanism (Argentina, Nigeria), the trade is labelled macro play or paradox &mdash; the Engel thesis is secondary.</p>
          </Record>
        </Chapter>

                <Chapter
          id="macrorisk"
          n="8"
          title="Macro risk"
          lede="The six markets face different macro headwinds. Vietnam is the strongest backdrop; Mexico GDP at +0.3% delays the mechanism; Brazil's Selic at 15% compresses YDUQ3 profits; Argentina's disinflation from 211% to 31% is the most dramatic stabilization in the dataset."
        >
          <p className="text-sm leading-relaxed mb-6">
            <Tag t="OBS" />Country-level macro risk is distinct from company-level falsifiers: it operates upstream of the Engel mechanism, controlling whether income growth materialises at all. Three tabs: scorecards (GDP, inflation, FX, policy rate per country), Engel exit sensitivity (how GDP growth stress shifts 2030 exit probabilities), and FX stress test (how currency depreciation reduces USD returns under base/bear/shock scenarios).
          </p>
          <MacroRisk />
          <Record>
            <p>GDP and inflation data: national statistics offices (Vietnam GSO, INEGI Mexico, IBGE Brazil, NBS Nigeria, INDEC Argentina, BPS Indonesia) and IMF Article IV consultations (FY2025, latest available Q1-2026). FX changes: 2025 calendar-year vs USD. Policy rates: central bank decisions as of Q4-2025 / Q1-2026. Engel exit sensitivity: re-derived from the 2,000-draw bootstrap of the survey curve (analysis/phase_probabilities.mjs) under alternate GDP growth paths. FX stress test: USD return = (1 + local return) &times; (1 + base FX + stress) &minus; 1; local returns are analyst assumptions, not guarantees.</p>
          </Record>
        </Chapter>

                <Chapter
          id="portfolio"
          n="9"
          title="Portfolio construction"
          lede="Given the Engel analysis, how would you size these positions? Three systematic approaches — equal-weight, signal-weighted, and expected-value tilted — plus the portfolio risks that hit all six simultaneously."
        >
          <p className="text-sm leading-relaxed mb-6">
            <Tag t="JDG" />Portfolio construction here is an analytical exercise, not investment advice. The framework makes the trade-offs explicit: calibrated probability sets the base; signal confirmation and liquidity adjust it; expected value shows where the asymmetry lives. Four pre-built views — switch between them to see how the weighting changes.
          </p>
          <PortfolioBuilder />
          <Record>
            <p>Weights computed as: calibrated_P &times; signal_multiplier &times; liquidity_multiplier, normalised to 100%. Signal multipliers: Confirmed=1.00, Weakened=0.85, Mixed=0.75. Liquidity: NYSE/Nasdaq=1.00, B3/NGX=0.85, HOSE/IDX=0.80. Expected value: P(thesis) &times; upside + (1&minus;P) &times; downside. Upside and downside assumptions are author estimates, not model outputs; they carry significant uncertainty. This is a pedagogical framework for connecting the Engel analysis to capital allocation decisions &mdash; the kind of bridge an academic economist rarely builds explicitly.</p>
          </Record>
        </Chapter>

                <Chapter id="watch" n="7" title="Predictions" lede="The Engel mechanism generates falsifiable country-level predictions. These are the dated claims the data will confirm or refute — ordered by when each signal arrives.">
          <p className="text-xs text-[#57606a] mb-4">Solid marker: an observed fact. Hollow marker: an inferred probability &mdash; the same convention as the Explorer&rsquo;s hollow projection bubbles.</p>
          <ol className="relative border-l border-[#d0d7de] ml-2 space-y-8">
            {watch.map((w) => (
              <li key={w.what} className="pl-6">
                <span className={`absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full ${w.tag === 'OBS' ? 'bg-[#1b1f23]' : 'bg-white border-2 border-[#1b1f23]'}`} />
                <div className="text-xs font-mono text-[#57606a] tracking-wider">{w.when}</div>
                <div className="text-lg font-semibold mt-0.5">{w.what}</div>
                <p className="text-sm text-[#1b1f23] leading-relaxed mt-1 max-w-3xl"><Tag t={w.tag} />{w.detail}</p>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: 24 }}>
            <h4 className="text-sm font-semibold mb-2">Forecast horizon timeline</h4>
            <WatchTimeline />
          </div>
          <Record>
            <p>No Polymarket or Kalshi market exists on any of these country events (783 open markets screened on 22 Oct 2026); the Brazil runoff is the only related market. Each event resolves on a public figure and will be Brier-scored when it does.</p>
          </Record>
        </Chapter>
        <section id="method" className="scroll-mt-16 py-14 border-t border-[#d0d7de]">
          <div className="text-xs font-mono text-[#57606a] tracking-widest mb-2">CHAPTER 11</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Evidence and method</h2>
          <p className="text-lg leading-relaxed mb-8">For readers who want to check the work.</p>

          <details className="border-t border-[#e1e4e8] py-4" open>
            <summary className="cursor-pointer font-semibold">Evidence table ({evidenceItems.length} claims, each with its source passage)</summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#d0d7de] text-[#57606a] text-xs uppercase tracking-wider">
                    <th className="py-2 pr-3 w-8">#</th><th className="py-2 pr-3">Claim</th><th className="py-2 pr-3 w-24">Support</th><th className="py-2">Source passage</th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceItems.map((item) => {
                    const s = literatureSources.find((x) => x.key === item.sourceKey);
                    return (
                      <tr key={item.id} className="border-b border-[#e1e4e8] align-top">
                        <td className="py-2 pr-3 font-mono text-xs">{item.id}</td>
                        <td className="py-2 pr-3">{item.claim}</td>
                        <td className="py-2 pr-3 font-mono text-[10px] uppercase tracking-wider text-[#57606a]">{item.support}</td>
                        <td className="py-2">
                          {item.quote ? <p className="italic">&ldquo;{item.quote}&rdquo;</p> : <p className="text-[#57606a]">No supporting passage in the corpus.</p>}
                          {s && <p className="text-xs text-[#57606a] mt-1">{s.citation}</p>}
                          <p className="text-xs text-[#57606a] mt-1">{item.note}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>

          <details className="border-t border-[#e1e4e8] py-4">
            <summary className="cursor-pointer font-semibold">Data and verification</summary>
            <ul className="mt-4 text-sm leading-relaxed list-disc pl-5 space-y-1.5 max-w-3xl">
              <li>Food shares: {story.fit.n} national household surveys, Pritchett &amp; Spivack (2013), appendix tables A.1&ndash;A.6, transcribed to analysis/food_share_surveys.csv and checked row by row against the source text.</li>
              <li>Income: World Bank GDP per capita, PPP, constant 2021 international $ (NY.GDP.PCAP.PP.KD); projections from IMF WEO (NGDPRPPPPC), latest vintage on DBnomics.</li>
              <li>Literature: a local corpus of 15 papers; every quote in the evidence table is verified verbatim against its passage (scripts/verify-citations.mjs) and reviewed for support by an independent citation-auditor agent.</li>
              <li>Estimates reproduced independently in Python (analysis/verify_independent.py). Arithmetic in the text recomputed with lisp_eval.</li>
            </ul>
          </details>

          <details className="border-t border-b border-[#e1e4e8] py-4">
            <summary className="cursor-pointer font-semibold">Limitations</summary>
            <ul className="mt-4 text-sm leading-relaxed list-disc pl-5 space-y-1.5 max-w-3xl">
              <li>Surveys date from 1991&ndash;2010 and are compared with 2025 incomes.</li>
              <li>Food definitions differ: India excludes imputed owner rent; Pakistan and the Philippines include tobacco.</li>
              <li>A cross-section of countries is not the path of one country over time.</li>
              <li>Survey consumption and GDP per capita measure different things; the boundaries are in GDP terms.</li>
              <li>PPP may overstate poorer countries&apos; incomes, which would move the break lower and delay projected exits.</li>
              <li>Probabilities cover the uncertainty of the curve, not IMF forecast error.</li>
            </ul>
          </details>

          <details className="border-b border-[#e1e4e8] py-4">
            <summary className="cursor-pointer font-semibold">What would falsify this</summary>
            <ul className="mt-4 text-sm leading-relaxed list-disc pl-5 space-y-1.5 max-w-3xl">
              <li>The break: new middle-income household surveys that move the knot outside $5.5k&ndash;$9.2k, or push the sup-F below its critical value in full samples (it is already borderline without the ILO surveys).</li>
              <li>The timing: within-country movement staying near {deep.withinCountrySlope} per log point for another five years &mdash; the exit probabilities of chapter 4 assume countries travel the cross-country curve.</li>
              <li>The measurement: an ICP/PPP revision cutting Indonesia&rsquo;s or Vietnam&rsquo;s 2025 income by 10%+ &mdash; the stress test in chapter 4 shows exit odds collapse from 66%/83% to 17%/33%.</li>
              <li>The lens: Indonesia&rsquo;s USDA food share continuing to rise through 2024&ndash;2025 while income grows &mdash; the tension flagged in chapter 4 resolving against the model.</li>
            </ul>
          </details>
        </section>

        <footer className="py-10 text-xs text-[#57606a] border-t border-[#d0d7de] flex justify-between">
          <span>Engel Curves Research &middot; Z-K Quantitative Strategy</span>
          <Link href="/" className="hover:text-[#1b1f23]">Back to the dashboard</Link>
        </footer>
      </div>
    </main>
  );
}
