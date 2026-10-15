'use client'

import { scenarioBranches } from '@/data/research'

export default function ScenarioTree() {
  return (
    <div>
      {/* Root */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-2 text-center max-w-sm mx-auto">
        <p className="text-xs font-semibold text-zinc-300 mb-1">China 2024 — Starting Condition</p>
        <p className="text-xs text-zinc-500">PPP $23,841 · Household consumption 39% GDP</p>
        <p className="text-xs text-zinc-500">Property crisis ongoing · Household deposits rising</p>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-px h-6 bg-zinc-700" />
      </div>

      {/* Branch label */}
      <div className="text-center mb-2">
        <span className="text-xs text-zinc-600 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          Property crisis resolution path 2025-2026
        </span>
      </div>

      {/* Branches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {scenarioBranches.map((branch) => (
          <div
            key={branch.id}
            className="rounded-xl border p-4"
            style={{ borderColor: branch.color + '40', background: branch.color + '08' }}
          >
            {/* Probability badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: branch.color }}>
                {branch.label}
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: branch.color + '20', color: branch.color }}
              >
                {branch.probabilityLabel}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{branch.description}</p>

            {/* Implication */}
            <div className="bg-zinc-950/60 rounded-lg p-2.5 mb-3">
              <p className="text-xs font-medium text-zinc-300 mb-1">Industry implication</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{branch.implication}</p>
            </div>

            {/* Early warning */}
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Early warning indicators</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{branch.earlyWarning}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-800/20">
        <p className="text-xs text-amber-400 font-medium mb-1">Scenario falsifier</p>
        <p className="text-xs text-zinc-400">
          If China household consumption / GDP does not rise from 39% toward 45% over 2024-2028, the Engel-curve tailwind
          for luxury and high-elasticity categories does not materialise — regardless of headline income growth.
          Observable: NBS quarterly household expenditure/income ratio.
        </p>
      </div>

      <p className="text-xs text-zinc-600 mt-2 text-right">
        All probabilities: analyst judgment [JDG] — for illustrative scenario structure only. Not a forecast.
      </p>
    </div>
  )
}
