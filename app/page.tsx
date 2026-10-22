'use client';
import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { emergingMarketsData, ENGEL_THRESHOLD } from '../data/emergingMarkets';
import { libraryReports } from '../data/libraryReports';
import { evidenceItems, literatureSources } from '../data/literatureEvidence';

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
              Engel Curve Inflection Matrix
            </h1>
            <p className="text-[#6e7681] mt-2 text-sm leading-relaxed max-w-2xl">
              [JDG] Tracks emerging markets against a $15,000 per-capita (PPP) reference level. The share of spending on discretionary goods rises with income, and, in theory, at low expenditure households buy basic goods only<sup className="text-[10px] text-[#6e7681] ml-0.5">[1,2]</sup>. No source in our corpus places this switching point at a dollar value; $15,000 is an analyst reference<sup className="text-[10px] text-[#6e7681] ml-0.5">[3]</sup>.
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
                <div className="text-3xl font-semibold text-[#1b1f23]">0.84 <span className="text-sm font-normal text-[#6e7681]">MCDA (FY2024 inputs, re-run pending)</span></div>
                <div className="text-sm text-[#1b1f23] mt-2 leading-snug space-y-1">
                  <p><span className="font-mono text-xs text-[#6e7681]">[OBS]</span> IDN/VNM entering the $15k inflection.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[INF]</span> The discretionary share of spending rises with income<sup className="text-[10px] text-[#6e7681] ml-0.5">[1,2]</sup>.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[JDG]</span> Markets near the reference level are where we expect that rise to be underway; a multi-vertical platform is positioned to capture it.</p>
                </div>
              </div>
              <div className="border border-[#d0d7de] p-5">
                <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">LATAM Efficiency (NU)</div>
                <div className="text-3xl font-semibold text-[#1b1f23]">0.78 <span className="text-sm font-normal text-[#6e7681]">MCDA (FY2024 inputs, re-run pending)</span></div>
                <div className="text-sm text-[#1b1f23] mt-2 leading-snug space-y-1">
                  <p><span className="font-mono text-xs text-[#6e7681]">[OBS]</span> Post-inflection markets (BRA, MEX, COL).</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[OBS]</span> Q2 2026: ARPAC $17.1 vs $1.0 cost to serve per active customer (17.1x).</p>
                </div>
              </div>
              <div className="border border-[#d0d7de] p-5">
                <div className="text-xs text-[#6e7681] uppercase tracking-wider font-semibold mb-1">Pre-Inflection Pipeline</div>
                <div className="text-3xl font-semibold text-[#1b1f23]">IND, PHL</div>
                <div className="text-sm text-[#1b1f23] mt-2 leading-snug space-y-1">
                  <p><span className="font-mono text-xs text-[#6e7681]">[OBS]</span> &gt;25% distance to the $15k threshold.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[INF]</span> At low expenditure, spending is concentrated in basic goods (model prediction)<sup className="text-[10px] text-[#6e7681] ml-0.5">[2]</sup>; where financial systems are shallow, stock-market gains do not reliably reach consumption<sup className="text-[10px] text-[#6e7681] ml-0.5">[6,7]</sup>.</p>
                  <p><span className="font-mono text-xs text-[#6e7681]">[JDG]</span> Prioritize infrastructure over broad B2C exposure.</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Macro Positioning vs. Engel Threshold</h2>
              <div className="h-[400px] w-full border border-[#d0d7de] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" vertical={false} />
                    <XAxis type="number" dataKey="gdpPPP" name="GDP PPP" unit="$" domain={[0, 40000]} stroke="#1b1f23" tick={{fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                    <YAxis type="number" dataKey="distToThreshold" name="Distance" unit="%" stroke="#1b1f23" tick={{fontSize: 12}} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ borderRadius: '2px', border: '1px solid #d0d7de', fontSize: '13px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                    />
                    <ReferenceArea x1={14000} x2={16000} fill="#f6f8fa" fillOpacity={1} />
                    <ReferenceLine x={ENGEL_THRESHOLD} stroke="#1b1f23" strokeWidth={2} label={{ position: 'top', value: 'Inflection Point ($15k)', fill: '#1b1f23', fontSize: 12, fontWeight: 600 }} />
                    <Scatter name="Markets" data={emergingMarketsData} fill="#1b1f23" shape="circle" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strategic Implications BLUF */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="md:w-1/3 border-l-4 border-[#1b1f23] pl-4 py-1 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">MCDA Allocation Result</h3>
                  <p className="text-sm text-[#1b1f23] leading-relaxed">
                    <span className="font-mono text-xs text-[#6e7681]">[OBS]</span> The MCDA scored Sea Limited 0.84 vs Nu Holdings 0.78 on FY2024 inputs. Several of those inputs were superseded by Q2 2026 filings; a re-run is pending.</p>
                </div>
                <div>
                  <p className="text-sm text-[#1b1f23] leading-relaxed">
                    <span className="font-mono text-xs text-[#6e7681]">[INF]</span> Shopee is adding buyers near the threshold (new active buyers +35% YoY in Q2 2026) but converts only 0.67% of GMV into adjusted EBITDA; Monee (20.5%) and Garena (57.6%) carry group margins.</p>
                </div>
                <div>
                  <p className="text-sm text-[#1b1f23] leading-relaxed">
                    <span className="font-mono text-xs text-[#6e7681]">[JDG]</span> Allocation call (Overweight SE, Hold NU) is suspended until the MCDA is re-run on verified Q2 2026 data.</p>
                </div>
              </div>
              <div className="md:w-2/3 overflow-x-auto border border-[#d0d7de]">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#1b1f23]">
                      <th className="py-2 px-4 font-semibold">Market</th>
                      <th className="py-2 px-4 font-semibold">GDP PPP</th>
                      <th className="py-2 px-4 font-semibold">Distance</th>
                      <th className="py-2 px-4 font-semibold">Strategic Phase</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1b1f23]">
                    {emergingMarketsData.map(row => (
                      <tr key={row.id} className="border-b border-[#e1e4e8] last:border-0 hover:bg-[#f6f8fa]">
                        <td className="py-2 px-4 font-medium">{row.id} - {row.country}</td>
                        <td className="py-2 px-4 font-mono">${row.gdpPPP.toLocaleString()}</td>
                        <td className="py-2 px-4 font-mono">
                          <span className={Math.abs(row.distToThreshold) < 5 ? "font-bold text-[#1b1f23]" : ""}>
                            {row.distToThreshold > 0 ? '+' : ''}{row.distToThreshold.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-sm ${Math.abs(row.distToThreshold) < 5 ? 'bg-[#1b1f23] text-white' : 'bg-[#e1e4e8] text-[#1b1f23]'}`}>
                            {row.phase}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Literature Evidence */}
            <div className="space-y-3 border-t border-[#d0d7de] pt-6">
              <h2 className="text-lg font-semibold">Literature Evidence</h2>
              <p className="text-sm text-[#6e7681] leading-relaxed max-w-3xl">
                How emerging-market wealth reaches consumption: mainly through housing; a positive stock-market effect appears only once the financial sector deepens<sup className="text-[10px] ml-0.5">[6,7]</sup>. Sales surprises at higher-margin US retailers track market returns more closely than at lower-margin retailers<sup className="text-[10px] ml-0.5">[5]</sup>.
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
              <p className="text-xs text-[#6e7681]">Passages retrieved from a local corpus of 8 papers and checked verbatim against the source text. Support levels reviewed by an independent citation-auditor agent.</p>
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
