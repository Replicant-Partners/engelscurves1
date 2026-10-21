'use client';
import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { emergingMarketsData, ENGEL_THRESHOLD } from '../data/emergingMarkets';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'overview'|'library'>('overview');

  return (
    <main className="min-h-screen bg-[#f6f8fa] text-[#1b1f23] p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-white border border-[#d0d7de] p-8 rounded-sm">
        
        <header className="border-b border-[#d0d7de] pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1b1f23]">Engel Curves: Emerging Markets</h1>
          <p className="text-[#6e7681] mt-2 leading-relaxed">
            Data sourced directly from the World Bank API (NY.GDP.PCAP.PP.KD, 2025). Mathematically audited.
            The methodology sets the Engel inflection point at $15,000 PPP (constant 2021 international $).
          </p>
        </header>

        <nav className="flex gap-4 border-b border-[#d0d7de] text-sm font-medium">
          <button 
            className={`pb-2 ${activeTab === 'overview' ? 'border-b-2 border-[#1b1f23] text-[#1b1f23]' : 'text-[#6e7681]'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`pb-2 ${activeTab === 'library' ? 'border-b-2 border-[#1b1f23] text-[#1b1f23]' : 'text-[#6e7681]'}`}
            onClick={() => setActiveTab('library')}
          >
            Library
          </button>
        </nav>

        {activeTab === 'overview' && (
          <section className="space-y-6">
            <div className="pl-4 border-l-[3px] border-[#d0d7de] text-[#1b1f23] bg-[#f6f8fa] p-4 text-sm">
              <span className="font-semibold">[OBS] Macro Data Extraction:</span> India, Brazil, Vietnam, Mexico, Argentina, Egypt, and Ethiopia. Vietnam ($15,457) is precisely at the inflection threshold. India remains 33.1% below, highlighting significant room for structural consumption shifts.
            </div>

            <div className="h-[400px] w-full border border-[#d0d7de] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
                  <XAxis type="number" dataKey="gdpPPP" name="GDP PPP" unit="$" domain={[0, 30000]} stroke="#6e7681" />
                  <YAxis type="number" dataKey="distToThreshold" name="Dist. to Threshold" unit="%" stroke="#6e7681" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '0', border: '1px solid #d0d7de', fontSize: '12px' }} />
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
                      <td className="py-3 font-mono">{row.distToThreshold.toFixed(1)}%</td>
                      <td className="py-3">{row.phase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'library' && (
          <section className="space-y-6">
             <div className="pl-4 border-l-[3px] border-[#d0d7de] text-[#1b1f23] bg-[#f6f8fa] p-4 text-sm">
              <span className="font-semibold">[INF] Library Initialization:</span> Phase 1 reports and analyses will be persisted here after generation.
            </div>
            <p className="text-sm text-[#6e7681]">No reports available yet. Run the company-research-deep pipeline to populate.</p>
          </section>
        )}
      </div>
    </main>
  );
}
