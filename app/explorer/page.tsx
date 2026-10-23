import type { Metadata } from 'next';
import Link from 'next/link';
import { EngelExplorer } from '../../components/story/EngelExplorer';
import { explorer } from '../../data/explorerData';
import { story } from '../../data/storyData';

export const metadata: Metadata = {
  title: 'Engel Explorer | Engel Curves Research',
  description: 'An animated view of Engel\u2019s law: 102 countries, food share of spending against income, 2017\u20132030.',
};

export default function ExplorerPage() {
  return (
    <main className="min-h-screen bg-white text-[#1b1f23]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#d0d7de]">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center gap-5 text-xs">
          <span className="font-semibold">Engel Explorer</span>
          <Link href="/story" className="text-[#6e7681] hover:text-[#1b1f23]">The story &rarr;</Link>
          <Link href="/" className="ml-auto text-[#6e7681] hover:text-[#1b1f23]">Dashboard &rarr;</Link>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6">
        <header className="pt-12 pb-8">
          <div className="text-xs font-mono text-[#6e7681] tracking-widest mb-3">ENGEL CURVES RESEARCH &middot; INTERACTIVE</div>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight max-w-3xl">One law, every country: as income rises, food loses its share of the budget.</h1>
          <p className="text-base text-[#6e7681] leading-relaxed max-w-3xl mt-4">
            Each bubble is a country; size is population, color is region. Press play to watch 102 countries move along the Engel curve from 2017 to 2023, then down the IMF income path to 2030. Click a bubble or pick a country to trace its trail. The dark line is the fitted Engel curve &mdash; the law every bubble is read against.
          </p>
        </header>
        <EngelExplorer />
        <section className="py-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold mb-2">Two lenses, one law</h2>
            <p className="mb-3"><span className="font-mono text-[10px] text-[#6e7681] mr-1.5">[INF]</span>The animated lens uses national-accounts food shares (USDA ERS, {explorer.usda.n} countries in 2023). On it, the shift away from food begins near ${(explorer.usda.knot / 1000).toFixed(1)}k and food reaches 35% of spending near ${(explorer.usda.end / 1000).toFixed(1)}k. The static lens uses the {story.fit.n} household surveys behind the main study: the shift begins near ${(story.bounds.start / 1000).toFixed(1)}k and food reaches 35% near ${(story.bounds.end / 1000).toFixed(1)}k.</p>
            <p><span className="font-mono text-[10px] text-[#6e7681] mr-1.5">[JDG]</span>The start of the shift agrees across lenses (about $6.6k&ndash;$8.9k). Where the transition ends depends on how spending is measured: national accounts include items surveys miss (such as imputed rent), so their food shares run lower and the 35% line arrives earlier. Both readings are shown rather than averaged.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Data and honesty rules</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Observed bubbles (2017&ndash;2023): USDA ERS food share via Our World in Data; GDP per capita PPP (2021$) and population from the World Bank. 713 country-years.</li>
              <li>Hollow dashed bubbles (2024&ndash;2030): income moves on the IMF WEO growth path; the food share is <span className="font-semibold">held at its 2023 value</span>, not forecast. 99 of 102 countries have paths (Bolivia, Lebanon, Sri Lanka do not).</li>
              <li>USDA-lens break at ${(explorer.usda.knot / 1000).toFixed(1)}k is borderline-significant (sup-F {explorer.usda.supF} vs 8.85); the survey-lens break is strongly significant (sup-F {story.fit.supF}).</li>
              <li>Script: analysis/explorer/build_explorer_data.mjs; the dark line is the 2023 piecewise fit (linear R&sup2; {explorer.usda.r2}).</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
