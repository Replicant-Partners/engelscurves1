'use client';
import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { emergingMarketsData, ENGEL_THRESHOLD } from '../data/emergingMarkets';
import { libraryReports } from '../data/libraryReports';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview'|'library'>('overview');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const activeReport = libraryReports.find(r => r.id === selectedReport);

  return (
    <main className="min-h-screen text-[#1b1f23] p-8 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-4xl mx-auto space-y-8">

        <header className="border-b border-[#d0d7de] pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1b1f23]">Engel Curves: Emerging Markets</h1>
          <p className="text-[#6e7681] mt-2 leading-relaxed">
            Data sourced directly from the World Bank API (NY.GDP.PCAP.PP.KD, 2025). Mathematically audited via Lisp strict evaluation.
            The methodology establishes the Engel inflection point at $15,000 PPP (constant 2021 international $), marking the transition from subsistence-driven consumption to discretionary spending.
          </p>
        </header>

        <nav className="flex gap-4 border-b border-[#d0d7de] text-sm font-medium">
          <button
            className={`pb-2 ${activeTab === 'overview' ? 'border-b-2 border-[#1b1f23] text-[#1b1f23]' : 'text-[#6e7681]'}`}
            onClick={() => { setActiveTab('overview'); setSelectedReport(null); }}
          >
            Macro Baseline
          </button>
          <button
            className={`pb-2 ${activeTab === 'library' ? 'border-b-2 border-[#1b1f23] text-[#1b1f23]' : 'text-[#6e7681]'}`}
            onClick={() => setActiveTab('library')}
          >
            Company Analysis Library
          </button>
        </nav>

        {activeTab === 'overview' && (
          <section className="space-y-6">
            <div className="border-l-[3px] border-[#d0d7de] bg-[#f6f8fa] p-4 text-sm leading-relaxed">
              <span className="font-semibold text-[#1b1f23]">[OBS] Macro Data Extraction:</span> 
              {" "}The dataset has been expanded to 12 emerging markets. Crucially, Indonesia ($15,091) and Vietnam ($15,457) are currently crossing the $15,000 PPP inflection threshold. At this exact stage, historical models indicate an acceleration in non-essential consumption categories such as financial services, packaged consumer goods, and healthcare. South Africa (-9.4%) approaches the threshold, while the Philippines (-28.4%) and India (-33.1%) retain substantial pre-inflection runway.
            </div>

            <div className="h-[400px] w-full border border-[#d0d7de] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
                  <XAxis type="number" dataKey="gdpPPP" name="GDP PPP" unit="$" domain={[0, 40000]} stroke="#6e7681" />
                  <YAxis type="number" dataKey="distToThreshold" name="Dist. to Threshold" unit="%" stroke="#6e7681" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '0', border: '1px solid #d0d7de', fontSize: '12px', backgroundColor: '#ffffff' }} />
                  <ReferenceLine x={ENGEL_THRESHOLD} stroke="#1b1f23" strokeDasharray="3 3" label={{ position: 'top', value: '$15k Threshold', fill: '#1b1f23', fontSize: 12 }} />
                  <Scatter name="Markets" data={emergingMarketsData} fill="#1b1f23" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#d0d7de] text-[#6e7681]">
                    <th className="py-3 font-medium">Country</th>
                    <th className="py-3 font-medium">GDP PPP (2025)</th>
                    <th className="py-3 font-medium">Dist. to $15k</th>
                    <th className="py-3 font-medium">Phase</th>
                  </tr>
                </thead>
                <tbody className="text-[#1b1f23]">
                  {emergingMarketsData.map(row => (
                    <tr key={row.id} className="border-b border-[#d0d7de] last:border-0 hover:bg-[#f6f8fa]">
                      <td className="py-3">{row.country}</td>
                      <td className="py-3 font-mono">${row.gdpPPP.toLocaleString()}</td>
                      <td className="py-3 font-mono">{row.distToThreshold > 0 ? '+' : ''}{row.distToThreshold.toFixed(1)}%</td>
                      <td className="py-3">{row.phase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="border-l-[3px] border-[#d0d7de] bg-[#f6f8fa] p-4 text-sm leading-relaxed">
              <span className="font-semibold text-[#1b1f23]">[INF] Strategic Implication:</span> 
              {" "}The clustering of Southeast Asian economies (Indonesia and Vietnam) around the inflection zone signals a structural transition. Capital allocation frameworks typically shift weighting toward discretionary consumer equities and financial infrastructure providers when a demographic base achieves this specific purchasing power parity.
            </div>
          </section>
        )}

        {activeTab === 'library' && (
          <section className="space-y-6">
            {!selectedReport ? (
              <>
                <div className="border-l-[3px] border-[#d0d7de] bg-[#f6f8fa] p-4 text-sm">
                  <span className="font-semibold text-[#1b1f23]">[OBS] VCP-Audited Swarm Analyses:</span> These reports apply the macroeconomic baseline data to specific equity assets, predicting non-linear cash flow acceleration based on Engel Curve mechanics.
                </div>
                
                <div className="grid gap-4">
                  {libraryReports.map(report => (
                    <div 
                      key={report.id} 
                      className="border border-[#d0d7de] p-5 cursor-pointer hover:bg-[#f6f8fa] transition-colors"
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <span className="text-xs text-[#6e7681] whitespace-nowrap ml-4">{report.date}</span>
                      </div>
                      <p className="text-sm text-[#6e7681]">{report.summary}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-sm text-[#6e7681] hover:text-[#1b1f23] flex items-center gap-2"
                >
                  ← Back to Library
                </button>
                <article className="prose prose-sm max-w-none text-[#1b1f23]">
                  <h2 className="text-2xl font-semibold mb-2">{activeReport?.title}</h2>
                  <div className="text-xs text-[#6e7681] mb-8 pb-4 border-b border-[#d0d7de]">
                    Author: {activeReport?.author} | Date: {activeReport?.date}
                  </div>
                  <div 
                    className="space-y-4"
                    dangerouslySetInnerHTML={{ __html: activeReport?.content.replace(/\n\n/g, '<br/><br/>').replace(/## (.*?)<br\/>/g, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') || '' }} 
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
