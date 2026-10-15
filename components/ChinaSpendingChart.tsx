'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { chinaSpending2023 } from '@/data/research'

export default function ChinaSpendingChart() {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-1">
        China NBS "Households&apos; Income and Consumption Expenditure in 2023" — 18 Jan 2024 [OBS].
        Income elasticities: AOF/CICC study based on NBS data [OBS, model-dependent].
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Budget shares */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Budget Share (%)</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chinaSpending2023} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="category" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 10 }} width={110} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#e4e4e7', fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'Budget share']}
              />
              <Bar dataKey="share" radius={[0, 3, 3, 0]}>
                {chinaSpending2023.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={entry.type === 'luxury' ? '#6366f1' : '#71717a'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* YoY growth */}
        <div>
          <h4 className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">YoY Growth 2023 (%)</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chinaSpending2023} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="category" stroke="#71717a" tick={{ fill: '#a1a1aa', fontSize: 10 }} width={110} />
              <ReferenceLine x={6.3} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'Income growth 6.3%', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#e4e4e7', fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'YoY growth']}
              />
              <Bar dataKey="yoyGrowth" radius={[0, 3, 3, 0]}>
                {chinaSpending2023.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={entry.yoyGrowth > 6.3 ? '#10b981' : '#71717a'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-zinc-600 mt-1">Yellow line = income growth (6.3%). Green bars = growing faster than income (ε_Y implied &gt; 1).</p>
        </div>
      </div>

      {/* Elasticity table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Category</th>
              <th className="text-right py-2 pr-4 text-zinc-400 font-medium">ε_Y Rural</th>
              <th className="text-right py-2 pr-4 text-zinc-400 font-medium">ε_Y Urban</th>
              <th className="text-right py-2 text-zinc-400 font-medium">Classification</th>
            </tr>
          </thead>
          <tbody>
            {chinaSpending2023.filter((d) => d.elasticityRural !== null).map((d) => (
              <tr key={d.category} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                <td className="py-1.5 pr-4 text-zinc-300">{d.category}</td>
                <td className="py-1.5 pr-4 text-right font-mono text-zinc-300">{d.elasticityRural}</td>
                <td className="py-1.5 pr-4 text-right font-mono text-zinc-300">{d.elasticityUrban}</td>
                <td className="py-1.5 text-right">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    d.type === 'luxury'
                      ? 'bg-indigo-900/50 text-indigo-300'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {d.type === 'luxury' ? 'Luxury (ε>1)' : 'Necessity (ε<1)'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-zinc-600 text-xs mt-1">Source: AOF/CICC study based on NBS data [OBS, model-dependent — ELES model]</p>
      </div>
    </div>
  )
}
