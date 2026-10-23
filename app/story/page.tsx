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
import { JapanChart } from '../../components/story/JapanChart';
import { RobustnessChart } from '../../components/story/RobustnessChart';
import { MeasurementRisk } from '../../components/story/MeasurementRisk';
import { story } from '../../data/storyData';
import { evidenceItems, literatureSources } from '../../data/literatureEvidence';

export const metadata: Metadata = {
  title: 'From Food to Finance | Engel Curves Research',
  description: 'How rising incomes shift household budgets away from food: the law, the break, 102 countries in motion, twelve markets, the street, and what to watch.',
};

const usd = (v: number) => `$${(v / 1000).toFixed(1)}k`;
const pct = (v: number) => `${Math.round(v * 100)}%`;
const T = Object.fromEntries(story.tracks.map((t) => [t.iso3, t]));

const chapters = [
  { id: 'law', n: '1', title: 'The law' },
  { id: 'break', n: '2', title: 'The break' },
  { id: 'motion', n: '3', title: 'In motion' },
  { id: 'map', n: '4', title: 'The map' },
  { id: 'money', n: '5', title: 'The freed-up wallet' },
  { id: 'street', n: '6', title: 'The street' },
  { id: 'watch', n: '7', title: 'What we watch' },
  { id: 'method', n: '8', title: 'Evidence and method' },
];

function Tag({ t }: { t: 'OBS' | 'INF' | 'JDG' | 'GAP' }) {
  return <span className="font-mono text-[9px] tracking-wider text-[#57606a] border border-[#d0d7de] rounded px-1 py-px mr-1.5 align-middle bg-white">{t}</span>;
}

function Cite({ ids }: { ids: number[] }) {
  return <sup className="text-[10px] text-[#57606a] ml-0.5">[{ids.join(',')}]</sup>;
}

function Record({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 border-l-2 border-[#d0d7de] pl-4 text-xs text-[#57606a] leading-relaxed space-y-1">{children}</div>;
}

function Chapter({ id, n, title, lede, children }: { id: string; n: string; title: string; lede: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 py-14 border-t border-[#d0d7de]">
      <div className="text-xs font-mono text-[#57606a] tracking-widest mb-2">CHAPTER {n}</div>
      <h2 className="text-3xl font-semibold tracking-tight mb-3">{title}</h2>
      <p className="text-lg text-[#1b1f23] leading-relaxed max-w-3xl mb-8">{lede}</p>
      {children}
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
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center gap-5 text-xs overflow-x-auto">
          <span className="font-semibold whitespace-nowrap">From Food to Finance</span>
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="text-[#57606a] hover:text-[#1b1f23] whitespace-nowrap">{c.n}. {c.title}</a>
          ))}
          <Link href="/" className="ml-auto text-[#57606a] hover:text-[#1b1f23] whitespace-nowrap">Dashboard &rarr;</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6">
        {/* Chapter 0 */}
        <header className="pt-16 pb-14">
          <div className="text-xs font-mono text-[#57606a] tracking-widest mb-4">ENGEL CURVES RESEARCH &middot; OCTOBER 2026</div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight max-w-4xl">
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
          <p className="text-sm text-[#57606a] mt-10 max-w-3xl leading-relaxed">
            Built from {story.fit.n} household surveys, World Bank and IMF income data, and 15 papers. Every number links to a source or a script; labels mark what is observed <Tag t="OBS" />, inferred <Tag t="INF" />, judged <Tag t="JDG" /> or missing <Tag t="GAP" />.
          </p>
        </header>

        <Chapter id="law" n="1" title="The law" lede="Poorer households spend most of their budget on food. Richer ones spend a small share. Engel described this in the 19th century; household surveys across the world still show it.">
          <LawChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-sm leading-relaxed">
            <p><Tag t="OBS" />A typical household in Ethiopia (2004) spent 54% of its budget on food; in Switzerland (2003), 9%. Each dot is one national survey; the chart fills poorest to richest as you arrive, and the slider walks it one household survey at a time.</p>
            <p><Tag t="OBS" />The pattern holds across income groups: over 50% in low-income countries, 40&ndash;50% in lower-middle and 30&ndash;40% in upper-middle income countries<Cite ids={[10]} />. Between countries, being 50% richer means a food share about 5 points lower<Cite ids={[9]} />.</p>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Going deeper</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
              <div>
                <p><Tag t="OBS" />The slope barely moves across 150 years of measurement:</p>
                <table className="mt-3 w-full text-sm border-collapse">
                  <tbody>
                    {deep.historicalSlopes.map((h) => (
                      <tr key={h.label} className="border-b border-[#e1e4e8] last:border-0">
                        <td className="py-1.5 pr-3">{h.label}</td>
                        <td className="py-1.5 text-right font-mono">{h.v.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-[#57606a]">Engel slope: change in the food share per log point of income. First two rows from Pritchett &amp; Spivack tables A.7&ndash;A.8; third from evidence item 9.</p>
              </div>
              <p><Tag t="JDG" />Few relationships in economics are this stable across centuries, methods and samples. That stability is what licenses using the curve as a map at all &mdash; and it is why the deviations matter: Bulgaria and Armenia sit far above the line, Ukraine and the West Bank far below, reminders that prices, measurement and history move individual countries off a very persistent track.</p>
            </div>
          </div>

          <Record>
            <p>Food shares: survey means from the appendix tables of Pritchett &amp; Spivack (2013), 1991&ndash;2010. Income: World Bank NY.GDP.PCAP.PP.KD, matched to survey year. All {story.fit.n} values checked against the source tables. Labeled dots: four narrative countries (accent) plus, by rule, the two largest deviations above and below the fitted line (grey); Armenia 2003 is also the highest food share in the sample.</p>
          </Record>
        </Chapter>

        <Chapter id="break" n="2" title="The break" lede={`The decline is not smooth from the start. Below about ${usd(story.bounds.start)}, the food share barely moves. Above it, it falls steadily until food is about a third of the budget near ${usd(story.bounds.end)}. That band is the transition.`}>
          <BreakChart />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 text-sm leading-relaxed">
            <p><Tag t="INF" />Toggle &ldquo;one slope&rdquo; to see why a straight line fails: it cannot hold the flat poor-country stretch and the steep decline at once. Below the break the fitted food share stays near 56&ndash;59%, with individual surveys mostly between 50% and 70%. Above it, it falls about {Math.round(Math.abs(story.piecewise.slopeAbove) * Math.LN2 * 100)} percentage points each time income doubles.</p>
            <p><Tag t="INF" />The earlier $15,000 marker sits inside the transition, where food is still about 37% of spending. It marks the middle of the shift, not its start.</p>
            <p><Tag t="GAP" />No paper in the corpus states a dollar threshold. Both boundaries are this study&apos;s estimates<Cite ids={[3]} />.</p>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Going deeper</h3>
            <p className="text-sm leading-relaxed max-w-3xl mb-4"><Tag t="OBS" />Japan walked most of this curve in one lifetime: between 1955 and 1992 its household food share fell from 37.4% to 15.7% while real spending per person multiplied by 3.7 (38 annual observations, Pritchett &amp; Spivack table A.12). <Tag t="INF" />Japan&rsquo;s case shows the cross-country pattern can also be a within-country path, not only a comparison of different societies &mdash; it entered the window already mid-transition and exited the 35% line around 1973.</p>
            <div className="border border-[#d0d7de] p-4 md:p-6 overflow-x-auto"><JapanChart /></div>
            <p className="text-sm leading-relaxed max-w-3xl mt-4"><Tag t="INF" />On the fit, the transition spans about ${deep.freed.delta.toLocaleString('en-US')} per person per year of non-food spending: at our break threshold ($6.6k) non-food spending is ${deep.freed.atBreak.toLocaleString('en-US')}; at our exit threshold ($17.8k) it is ${deep.freed.atExit.toLocaleString('en-US')}. That dollar span &mdash; not the percentage &mdash; is what a consumer business prices.</p>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-1">Does the break hold up?</h3>
            <p className="text-sm text-[#57606a] leading-relaxed max-w-3xl mb-4">The same model re-estimated on five versions of the data. If the break were an artefact of one group of surveys, it would move or vanish when that group is removed.</p>
            <div className="border border-[#d0d7de] p-4 md:p-6 overflow-x-auto"><RobustnessChart /></div>
            <p className="text-sm leading-relaxed mt-4 max-w-3xl"><Tag t="INF" />In four of five versions the break lands at $6.6k (between $6,566 and $6,592) and stays significant. Without the ILO surveys, half of the sample and the largest single source inside the transition band (13 of 32 surveys), it moves to $5.7k and becomes borderline (8.6 against 8.85). The location is stable; its sharpness depends on having enough middle-income data.</p>
          </div>
          <Record>
            <p>Model: food share on ln(GDP per capita) with one estimated break. Break at {usd(story.bounds.start)} (bootstrap 90% interval {usd(story.bounds.startCi[0])}&ndash;{usd(story.bounds.startCi[2])}); slope {story.piecewise.slopeBelow} below, {story.piecewise.slopeAbove} above. sup-F {story.fit.supF} against an Andrews (1993) 5% critical value of 8.85. The 35% line comes from the linear fit (R&sup2; {story.fit.r2}), 90% interval {usd(story.bounds.endCi[0])}&ndash;{usd(story.bounds.endCi[2])}.</p>
            <p>The break survives dropping definition-problem surveys, one-survey-per-country and dropping the LSMS table; it weakens to borderline without the ILO surveys. Scripts: analysis/engel_threshold.mjs, engel_robustness.mjs; independent check: verify_independent.py.</p>
            <p>A second lens agrees on the start and moves the end: on national-accounts food shares (USDA ERS, 101 countries, 2023) the break lands near $8.9k (borderline-significant) and food reaches 35% near $12.2k, because national accounts count items surveys miss, such as imputed rent. Both lenses are side by side in <a href="#motion" className="underline underline-offset-2">chapter 3</a>.</p>
          </Record>
        </Chapter>

        <Chapter id="motion" n="3" title="In motion" lede="The same law, set in motion. Each bubble is one of 102 countries; press play to watch seven observed years, then the IMF income path to 2030. The dark line is the Engel curve every bubble is read against.">
          <EngelExplorer />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 text-sm leading-relaxed">
            <p><Tag t="INF" />This animated lens uses national-accounts food shares (USDA ERS, {explorer.usda.n} countries, 2017&ndash;2023). On it the shift away from food begins near ${(explorer.usda.knot / 1000).toFixed(1)}k and food reaches 35% near ${(explorer.usda.end / 1000).toFixed(1)}k &mdash; earlier than the survey lens of chapters 1&ndash;2, because national accounts count items surveys miss, such as imputed rent. The static survey lens is one toggle away; the start of the shift agrees across both (about $6.6k&ndash;$8.9k), the end depends on measurement. We show both rather than average them.</p>
            <p><Tag t="JDG" />Click a country in the map below to land here with its trail traced. Hollow dashed bubbles are projections: income moves on the IMF path while each country&rsquo;s food share is held at its 2023 value, not forecast.</p>
          </div>
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Going deeper</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-relaxed">
              <p><Tag t="INF" />Within countries the street moves slowly: over 2017&ndash;2023 the share fell only {deep.withinCountrySlope} per log point of income growth &mdash; half the cross-section slope on the same USDA panel ({deep.crossSlopeUsda}; the survey fit of chapter 2 gives &minus;0.141). The cross-section behaves like a long-run map, not a five-year forecast.</p>
              <p><Tag t="OBS" />2020 ran the law in reverse: mean income across the panel fell about 5% and the mean food share rose from {Math.round(deep.covid.share2019 * 1000) / 10}% to {Math.round(deep.covid.share2020 * 1000) / 10}%. <Tag t="JDG" />Part of this may be the law under an income shock; part may be pandemic food-price inflation and lockdown spending composition &mdash; the panel cannot separate them.</p>
              <p><Tag t="OBS" />The law is a tendency, not destiny: {deep.moversTotal} of {deep.moversPanel} countries raised their food share by a point or more between 2017 and 2023 despite income growth above 5% &mdash; among them {deep.movers.map((m) => `${m.country} (+${m.dpp}pp)`).join(', ')}. <Tag t="JDG" />We attribute those rises mainly to food-price inflation in those years, a judgment the panel itself cannot confirm.</p>
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
              <p className="text-sm leading-relaxed mt-6"><Tag t="INF" />Food falls from {pct(story.household[0].foodShare)} to {pct(story.household[1].foodShare)} of the budget. Non-food spending per person rises from ${story.household[0].nonFood.toLocaleString('en-US')} to ${story.household[1].nonFood.toLocaleString('en-US')}, about +{Math.round((story.household[1].nonFood / story.household[0].nonFood - 1) * 100)}%, while income rises 100%.</p>
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
            <p className="text-sm leading-relaxed max-w-3xl"><Tag t="INF" />Scaled up, this per-person arithmetic is the largest consumption story of the decade: Kharas projects global middle-class consumption $29 trillion higher in 2030 than in 2015<Cite ids={[15]} />, with today&rsquo;s lower middle-income countries &mdash; including India, Indonesia and Vietnam &mdash; carrying $15 trillion of that market growth<Cite ids={[16]} />. Those are the same markets chapter 4 places inside the transition. <Tag t="JDG" />Both figures are 2017 projections, not observations; we cite them as the order of magnitude, not a forecast we underwrite.</p>
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
            <p className="text-sm leading-relaxed max-w-3xl"><Tag t="OBS" />{deep.street.belowEntry} of the {deep.street.familiesOurMarkets} documented families in our twelve markets ({Math.round(100 * deep.street.belowEntry / deep.street.familiesOurMarkets)}%) live below our $335/month entry line (the $11-a-day definition of item 13, converted to a month<Cite ids={[13]} />). India&rsquo;s 10th-percentile family lives on ${deep.street.indiaP10} a month and its 90th on ${deep.street.indiaP90.toLocaleString('en-US')} &mdash; a {Math.round(deep.street.indiaP90 / deep.street.indiaP10)}&times; spread inside one country. <Tag t="INF" />This is evidence item 11 made visible: a country&rsquo;s average hides most of the street it actually lives on, which is why chapter 4&rsquo;s country phases and this chapter&rsquo;s households are different questions.</p>
          </div>

          <Record>
            <p>Source: Dollar Street family registry via api.dollarstreet.org (fetched {dollarStreet.fetched}; {dollarStreet.usable} families, {dollarStreet.markets.reduce((s2, m) => s2 + m.n, 0)} in these twelve markets; Argentina has none yet). Dollars/month = household consumption per adult-equivalent, PPP, self-reported and Gapminder-adjusted. Dollar Street is a Gapminder project, CC BY 4.0. Script: analysis/dollar-street/build.mjs.</p>
          </Record>
        </Chapter>

        <Chapter id="watch" n="7" title="What we watch" lede="The thesis makes dated predictions. These are the signals that will confirm or weaken it, in the order they arrive.">
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
          <Record>
            <p>No Polymarket or Kalshi market exists on any of these country events (783 open markets screened on 22 Oct 2026); the Brazil runoff is the only related market. Each event resolves on a public figure and will be Brier-scored when it does.</p>
          </Record>
        </Chapter>

        <section id="method" className="scroll-mt-16 py-14 border-t border-[#d0d7de]">
          <div className="text-xs font-mono text-[#57606a] tracking-widest mb-2">CHAPTER 8</div>
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Evidence and method</h2>
          <p className="text-lg leading-relaxed max-w-3xl mb-8">For readers who want to check the work.</p>

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
