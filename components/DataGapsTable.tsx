'use client'
import { dataGaps } from '@/data/research'

export default function DataGapsTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
          {['Gap', 'Affects', 'Path to fill'].map((h) => (
            <th key={h} style={{ textAlign: 'left', padding: '6px 16px 6px 0', fontSize: 11, color: '#555', fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataGaps.map((g, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
            <td style={{ padding: '6px 16px 6px 0', color: '#1b1f23', fontWeight: 500 }}>{g.gap}</td>
            <td style={{ padding: '6px 16px 6px 0', color: '#555' }}>{g.affects}</td>
            <td style={{ padding: '6px 0', color: '#888' }}>{g.path}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
