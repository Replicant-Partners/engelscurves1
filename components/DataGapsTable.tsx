'use client'

import { dataGaps } from '@/data/research'

export default function DataGapsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="text-left py-2 pr-4 text-zinc-400 font-medium w-1/3">Gap</th>
            <th className="text-left py-2 pr-4 text-zinc-400 font-medium w-1/3">Affects</th>
            <th className="text-left py-2 text-zinc-400 font-medium">Path to fill</th>
          </tr>
        </thead>
        <tbody>
          {dataGaps.map((g, i) => (
            <tr key={i} className="border-b border-zinc-900 hover:bg-zinc-900/50">
              <td className="py-2 pr-4 text-zinc-300 font-medium">{g.gap}</td>
              <td className="py-2 pr-4 text-zinc-400">{g.affects}</td>
              <td className="py-2 text-zinc-500">{g.path}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
