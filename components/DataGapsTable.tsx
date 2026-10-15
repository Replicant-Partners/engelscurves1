'use client'
import { dataGaps } from '@/data/research'

export default function DataGapsTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #d0d7de' }}>
          {['Gap', 'Affects', 'Path to fill'].map((h) => (
            <th key={h} style={{ textAlign: 'left', padding: '6px 16px 8px 0', fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataGaps.map((g, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #eaeef2' }}>
            <td style={{ padding: '7px 16px 7px 0', fontWeight: 500, color: '#1b1f23' }}>{g.gap}</td>
            <td style={{ padding: '7px 16px 7px 0', color: '#57606a' }}>{g.affects}</td>
            <td style={{ padding: '7px 0', color: '#6e7681' }}>{g.path}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
