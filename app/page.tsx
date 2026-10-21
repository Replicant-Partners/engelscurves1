"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { emergingMarketsData, INFLECTION_POINT } from '../data/emergingMarkets';
import { Callout, EvidenceLabel } from '../components/Callout';

const ScatterChart = dynamic(() => import('recharts').then(mod => mod.ScatterChart), { ssr: false });
const Scatter = dynamic(() => import('recharts').then(mod => mod.Scatter), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then(mod => mod.ReferenceLine), { ssr: false });
const LabelList = dynamic(() => import('recharts').then(mod => mod.LabelList), { ssr: false });
const Label = dynamic(() => import('recharts').then(mod => mod.Label), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

export default function Home() {
  const [activeTab, setActiveTab] = useState('emerging');

  return (
    <div className="min-h-screen bg-white text-obs-fg font-sans">
      <header className="border-b border-obs-border px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">Engel Curves Macroeconomic Analysis</h1>
        <p className="text-obs-muted mt-1 text-sm">Consumption Evolution & Income Elasticity Modeling</p>
      </header>

      <div className="px-8 border-b border-obs-border flex space-x-6 text-sm">
        {['emerging', 'global', 'research', 'library'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-1 capitalize transition-colors ${
              activeTab === tab 
                ? 'border-b-2 border-obs-fg font-medium text-obs-fg' 
                : 'text-obs-muted hover:text-obs-fg'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      <main className="px-8 py-8 max-w-6xl mx-auto">
        {activeTab === 'emerging' && (
          <section className="animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold mb-4">Emerging Markets Baseline</h2>
            <p className="text-obs-muted text-sm mb-8 leading-relaxed">
              Analysis of key emerging economies and their proximity to the Engel Curve inflection point, 
              where discretionary consumption accelerates structurally as basic needs are met.
            </p>

            <Callout title="Methodology Note">
              <p>GDP per capita is based on Constant 2021 International $ (PPP) to ensure cross-sectional comparability. The inflection point is modeled at $15,000 PPA based on historical OECD consumption shifts.</p>
              <div className="mt-2">
                <EvidenceLabel type="OBS" /> World Bank WDI (NY.GDP.PCAP.PP.KD)
                <EvidenceLabel type="INF" /> Inflection threshold model ($15,000)
              </div>
            </Callout>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-obs-border text-obs-muted">
                    <th className="py-3 font-medium">Country</th>
                    <th className="py-3 font-medium">ISO3</th>
                    <th className="py-3 font-medium text-right">GDP per capita (PPP)</th>
                    <th className="py-3 font-medium text-right">Distance to Inflection</th>
                    <th className="py-3 font-medium pl-6">Macro Phase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obs-border/50">
                  {emergingMarketsData.map((row) => (
                    <tr key={row.iso3} className="hover:bg-obs-bg/50 transition-colors">
                      <td className="py-3 font-medium">{row.country}</td>
                      <td className="py-3 text-obs-muted">{row.iso3}</td>
                      <td className="py-3 text-right font-mono">${row.gdpPpp.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                      <td className={`py-3 text-right font-mono ${row.distanceToInflection < 0 ? 'text-obs-red' : 'text-obs-green'}`}>
                        {row.distanceToInflection > 0 ? '+' : ''}{row.distanceToInflection.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </td>
                      <td className="py-3 text-obs-muted pl-6">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-16 h-[400px] w-full">
              <h3 className="text-base font-semibold mb-6 text-center">Distance to Discretionary Inflection ($15k PPP)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d0d7de" vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="gdpPpp" 
                    name="GDP PPP" 
                    unit="$" 
                    domain={[0, 30000]}
                    stroke="#6e7681"
                    tick={{fill: '#6e7681'}}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="distanceToInflection" 
                    name="Distance" 
                    unit="$" 
                    stroke="#6e7681"
                    tick={{fill: '#6e7681'}}
                  />
                  <Tooltip 
                    cursor={{strokeDasharray: '3 3'}}
                    contentStyle={{ backgroundColor: '#1b1f23', color: '#fff', borderRadius: '4px', border: 'none' }}
                  />
                  <ReferenceLine x={INFLECTION_POINT} stroke="#e45756" strokeDasharray="3 3">
                    <Label value="Inflection Point" position="top" fill="#e45756" fontSize={12} />
                  </ReferenceLine>
                  <ReferenceLine y={0} stroke="#6e7681" />
                  <Scatter name="Countries" data={emergingMarketsData} fill="#4c78a8">
                    {emergingMarketsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.gdpPpp >= INFLECTION_POINT ? '#54a24b' : '#f58518'} />
                    ))}
                    <LabelList dataKey="iso3" position="top" fill="#1b1f23" fontSize={12} offset={10} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {activeTab === 'global' && (
          <section className="animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold mb-4">Global Analysis: Food Income Elasticity</h2>
            <p className="text-obs-muted text-sm mb-8 leading-relaxed">
              Applying Engel's Law across our target markets vs. the US anchor. As income rises, the proportion of income spent on food falls, freeing capital for discretionary consumption.
            </p>

            <Callout title="Methodology Note">
              <p>Food expenditure as % of total household consumption. The curve flattens significantly after the $15,000 PPP mark.</p>
              <div className="mt-2">
                <EvidenceLabel type="OBS" /> World Bank ICP / National Household Surveys
              </div>
            </Callout>

            <div className="mt-12 h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d0d7de" vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="gdpPpp" 
                    name="GDP PPP" 
                    unit="$" 
                    domain={[0, 30000]}
                    stroke="#6e7681"
                    tick={{fill: '#6e7681'}}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="foodExpenditurePercent" 
                    name="Food Exp %" 
                    unit="%" 
                    domain={[0, 50]}
                    stroke="#6e7681"
                    tick={{fill: '#6e7681'}}
                  />
                  <Tooltip 
                    cursor={{strokeDasharray: '3 3'}}
                    contentStyle={{ backgroundColor: '#1b1f23', color: '#fff', borderRadius: '4px', border: 'none' }}
                  />
                  <Scatter name="Countries" data={globalFoodElasticity.filter(d => d.iso3 !== 'USA')} fill="#4c78a8">
                    <LabelList dataKey="iso3" position="top" fill="#1b1f23" fontSize={12} offset={10} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {activeTab === 'research' && (
          <section className="animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold mb-4">Deep Research: India Inflection Trajectory</h2>
            <p className="text-obs-muted text-sm mb-8 leading-relaxed">
              Mathematical projection of India's trajectory to the $15,000 PPP Engel Curve Inflection point, evaluating bull, base, and bear macroeconomic scenarios.
            </p>

            <Callout title="Verification Commons Protocol (VCP)">
              <p>Calculations mathematically audited via <strong>vcp-math-auditor</strong> against independent Lisp execution to eliminate LLM arithmetic hallucination.</p>
              <div className="mt-2">
                <EvidenceLabel type="OBS" /> Base GDP PPP: $10,039
                <EvidenceLabel type="INF" /> Model inference on growth logs
              </div>
            </Callout>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-obs-border text-obs-muted">
                    <th className="py-3 font-medium">Scenario</th>
                    <th className="py-3 font-medium text-right">Projected CAGR</th>
                    <th className="py-3 font-medium text-right">Years to Target</th>
                    <th className="py-3 font-medium pl-6">Estimated Inflection Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obs-border/50">
                  {indiaScenarios.map((row) => (
                    <tr key={row.scenario} className="hover:bg-obs-bg/50 transition-colors">
                      <td className="py-3 font-medium">{row.scenario}</td>
                      <td className="py-3 text-right font-mono">{(row.cagr * 100).toFixed(1)}%</td>
                      <td className="py-3 text-right font-mono">{row.yearsToTarget} yrs</td>
                      <td className="py-3 font-bold pl-6">{row.targetYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'library' && (
          <section className="animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold mb-4">Research Library</h2>
            <p className="text-obs-muted text-sm mb-8 leading-relaxed">
              Archived Deep Research pipelines for individual equities within the Engel Curves macro thesis.
            </p>

            <Callout title="Persistence Note">
              <p>These reports are pre-computed results from our local agent swarms (company-research-deep pipeline). In a fully live environment, they represent the output saved to localStorage after a successful 7-stage SSE pipeline.</p>
              <div className="mt-2">
                <EvidenceLabel type="OBS" /> SEC Filings / Earnings
                <EvidenceLabel type="INF" /> GORILLA Execution Scoring
              </div>
            </Callout>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialLibraryReports.map((report) => (
                <div key={report.id} className="border border-obs-border rounded p-5 hover:border-obs-fg transition-colors bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{report.ticker}</h3>
                      <span className="text-xs text-obs-muted">{report.name} &middot; {report.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold font-mono">{report.gorillaScore}</div>
                      <div className="text-[10px] uppercase tracking-wider text-obs-muted font-bold">{report.gorillaVerdict}</div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-obs-fg mt-4 mb-4">
                    {report.thesis}
                  </p>
                  <div className="text-xs text-obs-muted pt-4 border-t border-obs-border/50">
                    Generated: {report.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
