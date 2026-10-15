'use client'

import { industryChains } from '@/data/research'

const flagColors: Record<string, string> = {
  OBS: 'bg-emerald-900/50 text-emerald-300',
  INF: 'bg-amber-900/50 text-amber-300',
  'OBS+INF': 'bg-blue-900/50 text-blue-300',
  'OBS+GAP': 'bg-orange-900/50 text-orange-300',
  GAP: 'bg-zinc-800 text-zinc-400',
}

const tailwindColors: Record<string, string> = {
  TAILWIND: 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/30',
  STRUCTURAL: 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/30',
  'AGING-DRIVEN': 'bg-amber-900/50 text-amber-300 border border-amber-700/30',
}

export default function IndustryChains() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {industryChains.map((chain) => (
        <div key={chain.rank} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-zinc-600 tabular-nums">#{chain.rank}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: chain.economyColor }}
                  />
                  <span className="text-sm font-semibold text-zinc-200">{chain.economy}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tailwindColors[chain.tailwind]}`}>
                    {chain.tailwind}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{chain.industry}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ${flagColors[chain.dataFlag]}`}>
              {chain.dataFlag}
            </span>
          </div>

          {/* Mechanism chain */}
          <div className="bg-zinc-950 rounded-lg p-3 mb-3 border border-zinc-800/50">
            <p className="text-xs text-zinc-400 leading-relaxed">{chain.mechanism}</p>
          </div>

          {/* Elasticity */}
          <div className="flex items-start gap-2 mb-3">
            <span className="text-xs font-medium text-zinc-500 flex-shrink-0 mt-0.5">ε_Y:</span>
            <p className="text-xs text-zinc-400">{chain.elasticityNote}</p>
          </div>

          {/* Companies */}
          <div className="space-y-2 mb-3">
            {chain.companies.map((co) => (
              <div key={co.ticker} className="flex items-start gap-2">
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono flex-shrink-0 mt-0.5 ${flagColors[co.evidenceFlag]}`}>
                  {co.evidenceFlag}
                </span>
                <div>
                  <span className="text-xs font-medium text-zinc-200">{co.name}</span>
                  <span className="text-xs text-zinc-600 ml-1">({co.ticker})</span>
                  <p className="text-xs text-zinc-400 mt-0.5">{co.data}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Falsifier */}
          <div className="border-t border-zinc-800 pt-3">
            <p className="text-xs font-medium text-red-400 mb-1">⚠ Falsifier</p>
            <p className="text-xs text-zinc-400 leading-relaxed">{chain.falsifier}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
