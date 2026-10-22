'use client';
import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { emergingMarketsData, PHASE_BOUNDS } from '../data/emergingMarkets';
import { libraryReports } from '../data/libraryReports';
import { evidenceItems, literatureSources } from '../data/literatureEvidence';
import { engelStats } from '../data/engelCrossCountry';
import { EngelCrossCountryChart } from '../components/EngelCrossCountryChart';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview'|'library'>('overview');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const activeReport = libraryReports.find(r => r.id === selectedReport);

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-[#1b1f23] p-6 md:p-12 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-5xl mx-auto space-y-8 bg-white border border-[#d0d7de] p-8 md:p-10 rounded-sm shadow-sm">

        {/* Executive Header */}
        <header className="border-b border-[#d0d7de] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1b1f23] leading-tight">
              Engel Curve Phase Matrix
            </h1>
            <p className="text-[#6e7681] mt-2 text-sm leading-relaxed max-w-2xl">
              [INF] Markets are placed in three phases estimated from 85 household surveys: pre-inflection below about $6.6k GDP per capita (PPP), a transition zone from $6.6k to $17.8k where the food share of spending falls from about 55% to 35%, and post-inflection above. The share of spending on discretionary goods rises with income<sup className="text-[10px] text-[#6e7681] ml-0.5">[1,2]</sup>; the boundaries are this dashboard’s estimates, not values stated in the literature<sup className="text-[10px] text-[#6e7681] ml-0.5">[3]</sup>. For reference, median food shares fall from over 50% in low-income to 30–40% in upper-middle-income countries<sup className="text-[10px] text-[#6e7681] ml-0.5">[10]</sup>.
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-[#6e7681] uppercase tracking-wider">Data Provenance</div>
            <div className="text-xs font-semibold text-[#1b1f23]">World Bank (NY.GDP.PCAP.PP.KD)</div>
            <div className="text-xs text-[#6e7681]">Constant 2021 Int'l $</div>
          </div>
        </header>

        <nav className="flex gap-6 border-b border-[#d0d7de] text-sm font-medium">
          <button
            className={`pb-3 transition-colors ${activeTab === 'overview' ? 'border-b-2 border-[#1b1f23] text-[#1b1f23]' : 'text-[#6e7681] hover:text-[#1b1f23]'}`}
            onClick={() => { setActiveTab('overview'); setSelectedReport(null); }}
          >
            Executive Dashboard
          </button>
          <button
            className={`pb-3 transition-colors ${activeTab === 'library' ? 'border-b-2 border-[#1b1f23] text-[#1b1f23]' : 'text-[#6e7681] hover:text-[#1b1f23]'}`}
            onClick={() => setActiveTab('library')}
          >
            Investment Memos
          </button>
        </nav>

        {activeTab === 'overview' && (
          <section className="space-y-8">
            {/* KPI Cards for Executives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#d0d7de] p-5">
                <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">ASEAN Ecosystem (SE)</div>
                <div className="text-3xl font-semibold text-[#1b1f23]">0.638 <span className="text-sm font-normal text-[#6e7681]">MCDA, Q2 2026</span></div>
                <div className="text-sm text-[#1b1f23] mt-2 leading-snug space-y-1">
                  <p><span className="font-mono text-xs text-[#6e7681]">[INF]</span> IDN and VNM sit in the upper half of the transition zone (predicted food share about 37%).</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[INF]</span> The discretionary share of spending rises with income<sup className="text-[10px] text-[#6e7681] ml-0.5">[1,2]</sup>.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[JDG]</span> Transition-zone markets are where that rise is underway; a multi-vertical platform is positioned to capture it.</p>
                </div>
              </div>
              <div className="border border-[#d0d7de] p-5">
                <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">LATAM Efficiency (NU)</div>
                <div className="text-3xl font-semibold text-[#1b1f23]">0.634 <span className="text-sm font-normal text-[#6e7681]">MCDA, Q2 2026</span></div>
                <div className="text-sm text-[#1b1f23] mt-2 leading-snug space-y-1">
                  <p><span className="font-mono text-xs text-[#6e7681]">[INF]</span> BRA, MEX and COL are past the transition (predicted food share 32–34%); BRA and COL sit within the uncertainty band of the upper boundary.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[OBS]</span> Q2 2026: ARPAC $17.1 vs $1.0 cost to serve per active customer (17.1x).</p>
                </div>
              </div>
              <div className="border border-[#d0d7de] p-5">
                <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">Early Transition</div>
                <div className="text-3xl font-semibold text-[#1b1f23]">IND, PHL</div>
                <div className="text-sm text-[#1b1f23] mt-2 leading-snug space-y-1">
                  <p><span className="font-mono text-xs text-[#6e7681]">[INF]</span> Past the ~$6.6k break but early in the transition: predicted food share 42–43%, so budgets remain weighted to basic goods.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[INF]</span> Where financial systems are shallow, stock-market gains do not reliably reach consumption<sup className="text-[10px] text-[#6e7681] ml-0.5">[6,7]</sup>. PPP incomes tend to overstate the real income of poorer countries<sup className="text-[10px] text-[#6e7681] ml-0.5">[12]</sup>, so they may sit closer to the break than shown.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[JDG]</span> Prioritize infrastructure over broad B2C exposure.</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Macro Positioning by Phase</h2>
              <div className="h-[400px] w-full border border-[#d0d7de] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 24, right: 20, bottom: 20, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" vertical={false} />
                    <XAxis type="number" dataKey="gdpPPP" name="GDP per capita (PPP)" domain={[0, 40000]} stroke="#1b1f23" tick={{fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                    <YAxis type="number" dataKey="predictedFoodShare" name="Predicted food share" domain={[0.2, 0.65]} stroke="#1b1f23" tick={{fontSize: 12}} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: number, name: string) => (name === 'Predicted food share' ? `${(value * 100).toFixed(1)}%` : `$${Math.round(value).toLocaleString()}`)}
                      contentStyle={{ borderRadius: '2px', border: '1px solid #d0d7de', fontSize: '13px', backgroundColor: '#ffffff' }}
                    />
                    <ReferenceArea x1={PHASE_BOUNDS.transitionStart} x2={PHASE_BOUNDS.transitionEnd} fill="#f6f8fa" fillOpacity={1} label={{ value: 'Transition', position: 'insideTop', fontSize: 12, fill: '#6e7681' }} />
                    <ReferenceLine x={PHASE_BOUNDS.transitionStart} stroke="#1b1f23" strokeDasharray="4 4" label={{ position: 'top', value: `Break ~$${(PHASE_BOUNDS.transitionStart / 1000).toFixed(1)}k`, fill: '#1b1f23', fontSize: 11 }} />
                    <ReferenceLine x={PHASE_BOUNDS.transitionEnd} stroke="#1b1f23" strokeDasharray="4 4" label={{ position: 'top', value: `Food 35% ~$${(PHASE_BOUNDS.transitionEnd / 1000).toFixed(1)}k`, fill: '#1b1f23', fontSize: 11 }} />
                    <Scatter name="Markets" data={emergingMarketsData} fill="#1b1f23" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-[#6e7681]">Predicted food share from the cross-country fit (food share = {engelStats.a} {engelStats.b} × ln GDP per capita). Boundaries carry 90% intervals of ${(PHASE_BOUNDS.transitionStartCi[0] / 1000).toFixed(1)}k–${(PHASE_BOUNDS.transitionStartCi[1] / 1000).toFixed(1)}k and ${(PHASE_BOUNDS.transitionEndCi[0] / 1000).toFixed(1)}k–${(PHASE_BOUNDS.transitionEndCi[1] / 1000).toFixed(1)}k.</p>
            </div>

            {/* Strategic Implications BLUF */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/3 border-l-4 border-[#1b1f23] pl-4 py-1 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">MCDA Allocation Result</h3>
                  <p className="text-sm text-[#1b1f23] leading-relaxed">
                    <span className="font-mono text-xs text-[#6e7681]">[INF]</span> Re-run on verified Q2 2026 data and the new Engel phases: Sea Limited 0.638 vs Nu Holdings 0.634, a statistical tie. A 2% change in any one weight flips the order, and using Nu’s USD growth instead of FX-neutral puts Nu ahead (0.704). Sea’s score relies on compensation: its 8.4% operating margin falls below the danger threshold on the most heavily weighted criterion, offset by Engel headroom and credit quality. The earlier 0.84 vs 0.78 result is withdrawn.</p>
                </div>
                <div>
                  <p className="text-sm text-[#1b1f23] leading-relaxed">
                    <span className="font-mono text-xs text-[#6e7681]">[INF]</span> Shopee is adding buyers in transition-zone markets (new active buyers +35% YoY in Q2 2026) but converts only 0.67% of GMV into adjusted EBITDA; Monee (20.5%) and Garena (57.6%) carry group margins.</p>
                </div>
                <div>
                  <p className="text-sm text-[#1b1f23] leading-relaxed">
                    <span className="font-mono text-xs text-[#6e7681]">[JDG]</span> No allocation preference on this evidence. The choice turns on what the portfolio values: proven profitability (Nu, 27.7% pre-tax margin) or exposure to markets still inside the Engel transition (Sea, predicted food share 37% vs 33%).</p>
                </div>
              </div>
              <div className="md:w-2/3 overflow-x-auto border border-[#d0d7de]">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#1b1f23]">
                      <th className="py-2 px-4 font-semibold">Market</th>
                      <th className="py-2 px-4 font-semibold">GDP PPP</th>
                      <th className="py-2 px-4 font-semibold">Predicted food share</th>
                      <th className="py-2 px-4 font-semibold">Strategic Phase</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1b1f23]">
                    {emergingMarketsData.map(row => (
                      <tr key={row.id} className="border-b border-[#e1e4e8] last:border-0 hover:bg-[#f6f8fa]">
                        <td className="py-2 px-4 font-medium">{row.id} - {row.country}</td>
                        <td className="py-2 px-4 font-mono">${row.gdpPPP.toLocaleString()}</td>
                        <td className="py-2 px-4 font-mono">{(row.predictedFoodShare * 100).toFixed(1)}%</td>
                        <td className="py-2 px-4">
                          <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-sm ${row.phase === 'Transition' ? 'bg-[#1b1f23] text-white' : 'bg-[#e1e4e8] text-[#1b1f23]'}`}>
                            {row.phase}
                          </span>
                          {row.nearBoundary && <span className="ml-2 text-[10px] text-[#6e7681] uppercase tracking-wider">near boundary</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Cross-country test of the threshold */}
            <div className="space-y-3 border-t border-[#d0d7de] pt-6">
              <h2 className="text-lg font-semibold">Testing the Threshold: Food Share vs Income Across Countries</h2>
              <p className="text-sm text-[#6e7681] leading-relaxed max-w-3xl">
                {engelStats.n} household surveys (1991–2010) from the appendix tables of Pritchett &amp; Spivack (2013), matched to the same World Bank GDP-per-capita series used above.
              </p>
              <EngelCrossCountryChart />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="border border-[#d0d7de] p-4">
                  <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">Where the decline starts</div>
                  <div className="text-2xl font-semibold">~${(engelStats.knot / 1000).toFixed(1)}k</div>
                  <p className="mt-1 leading-snug"><span className="font-mono text-xs text-[#6e7681]">[INF]</span> Below it the food share is roughly flat at 50–70%; above it, it falls about {Math.abs(engelStats.slopeAbove * Math.LN2 * 100).toFixed(0)} percentage points each time income doubles. 90% interval ${(engelStats.knotCi[0] / 1000).toFixed(1)}k–${(engelStats.knotCi[1] / 1000).toFixed(1)}k.</p>
                </div>
                <div className="border border-[#d0d7de] p-4">
                  <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">Food share at $15k</div>
                  <div className="text-2xl font-semibold">{Math.round(engelStats.shareAt15k * 100)}%</div>
                  <p className="mt-1 leading-snug"><span className="font-mono text-xs text-[#6e7681]">[INF]</span> Fitted value, 90% interval {Math.round(engelStats.shareAt15kCi[0] * 100)}–{Math.round(engelStats.shareAt15kCi[1] * 100)}%. Food falls below 35% of the budget at about ${(engelStats.incomeAt35 / 1000).toFixed(1)}k (${(engelStats.incomeAt35Ci[0] / 1000).toFixed(1)}k–${(engelStats.incomeAt35Ci[1] / 1000).toFixed(1)}k).</p>
                </div>
                <div className="border border-[#d0d7de] p-4">
                  <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">How solid is the break</div>
                  <div className="text-2xl font-semibold">sup-F {engelStats.supF}</div>
                  <p className="mt-1 leading-snug"><span className="font-mono text-xs text-[#6e7681]">[INF]</span> Above the 5% critical value of {engelStats.supFCrit} (Andrews 1993). The knot stays at $5.7k–$6.6k across subsamples; it weakens to borderline when ILO surveys are dropped.</p>
                </div>
              </div>
              <div className="text-sm leading-relaxed max-w-3xl space-y-2">
                <p><span className="font-mono text-xs text-[#6e7681]">[JDG]</span> The dashboard’s phases use these two estimates: the break (~$6.6k) opens the transition zone and the 35% food-share level (~$17.8k) closes it. The earlier $15k reference sits inside the transition, where food is still about 37% of the budget. On this basis India, the Philippines, South Africa, Indonesia and Vietnam are in transition, Egypt is at its upper edge, and Brazil and Colombia are just past it, within the uncertainty band.</p>
                <p className="text-xs text-[#6e7681]">Caveats: survey means, not GDP-based consumption; years 1991–2010 compared with 2025 income; food definitions differ (India excludes imputed owner rent; Pakistan and the Philippines include tobacco); a cross-section is not a country’s path over time; PPP may overstate poorer countries’ incomes (item 12), which would move the break lower. All 85 values were checked against the source tables, and the fit was reproduced independently in Python (analysis/verify_independent.py).</p>
              </div>
            </div>

            {/* Literature Evidence */}
            <div className="space-y-3 border-t border-[#d0d7de] pt-6">
              <h2 className="text-lg font-semibold">Literature Evidence</h2>
              <p className="text-sm text-[#6e7681] leading-relaxed max-w-3xl">
                How emerging-market wealth reaches consumption: mainly through housing; a positive stock-market effect appears only once the financial sector deepens<sup className="text-[10px] ml-0.5">[6,7]</sup>. Sales surprises at higher-margin US retailers track market returns more closely than at lower-margin retailers<sup className="text-[10px] ml-0.5">[5]</sup>. Even 95th-percentile households in poor countries spend 5 to 15 percentage points more of their budget on food than poor households in rich countries<sup className="text-[10px] ml-0.5">[11]</sup>, leaving 5 to 15 percentage points less of the budget for non-food spending.
              </p>
              <div className="overflow-x-auto border border-[#d0d7de]">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#f6f8fa] border-b border-[#d0d7de]">
                      <th className="py-2 px-3 font-semibold w-8">#</th>
                      <th className="py-2 px-3 font-semibold">Claim</th>
                      <th className="py-2 px-3 font-semibold w-24">Support</th>
                      <th className="py-2 px-3 font-semibold">Source passage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidenceItems.map(item => {
                      const source = literatureSources.find(s => s.key === item.sourceKey);
                      return (
                        <tr key={item.id} className="border-b border-[#e1e4e8] last:border-0 align-top">
                          <td className="py-2 px-3 font-mono text-xs">{item.id}</td>
                          <td className="py-2 px-3">{item.claim}</td>
                          <td className="py-2 px-3 font-mono text-xs uppercase tracking-wider text-[#6e7681]">{item.support}</td>
                          <td className="py-2 px-3 text-[#1b1f23]">
                            {item.quote ? <p className="italic">&ldquo;{item.quote}&rdquo;</p> : <p className="text-[#6e7681]">No supporting passage in the corpus.</p>}
                            {source && <p className="text-xs text-[#6e7681] mt-1">{source.citation}</p>}
                            <p className="text-xs text-[#6e7681] mt-1">{item.note}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#6e7681]">Passages retrieved from a local corpus of 15 papers and checked verbatim against the source text. Support levels reviewed by an independent citation-auditor agent.</p>
            </div>
          </section>
        )}

        {activeTab === 'library' && (
          <section className="space-y-6">
            {!selectedReport ? (
              <>
                <div className="border-l-4 border-[#1b1f23] pl-4 py-1 mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-1">Quantitative Strategy</h3>
                  <p className="text-sm text-[#6e7681]">Actionable equity research mapping the macroeconomic baseline to specific asset cash flow acceleration.</p>
                </div>
                
                <div className="grid gap-4">
                  {libraryReports.map(report => (
                    <div 
                      key={report.id} 
                      className="group border border-[#d0d7de] p-6 cursor-pointer hover:border-[#1b1f23] transition-colors"
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-xl group-hover:underline decoration-2 underline-offset-4">{report.title}</h3>
                        <span className="text-xs font-mono bg-[#f6f8fa] px-2 py-1 border border-[#d0d7de] whitespace-nowrap ml-4">{report.date}</span>
                      </div>
                      <p className="text-sm text-[#6e7681] leading-relaxed">{report.summary}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-300">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-sm font-semibold text-[#6e7681] hover:text-[#1b1f23] flex items-center gap-2 transition-colors"
                >
                  &larr; Return to Memos
                </button>
                <article className="max-w-3xl">
                  <h2 className="text-3xl font-semibold mb-4 leading-tight">{activeReport?.title}</h2>
                  <div className="flex gap-4 text-xs text-[#6e7681] mb-8 pb-6 border-b border-[#d0d7de] font-mono">
                    <span>FROM: {activeReport?.author}</span>
                    <span>DATE: {activeReport?.date}</span>
                  </div>
                  <div 
                    className="prose prose-sm md:prose-base prose-headings:font-semibold prose-h3:text-lg prose-h3:uppercase prose-h3:tracking-wider prose-h3:text-[#1b1f23] prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[#1b1f23] prose-p:leading-relaxed prose-strong:text-[#1b1f23] prose-strong:font-semibold prose-li:text-[#1b1f23] max-w-none"
                    dangerouslySetInnerHTML={{ __html: activeReport?.content.replace(/\n\n/g, '<br/><br/>').replace(/### (.*?)<br\/>/g, '<h3>$1</h3>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') || '' }} 
                  />
                </article>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
