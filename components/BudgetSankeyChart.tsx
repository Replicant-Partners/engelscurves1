'use client'
// Priority 5 — Sankey del presupuesto familiar
// Household budget shift from $10k → $20k per capita PPP
// Data: PERI WP247 "Engel's Law Around the World 150 Years Later" [OBS]
// Verified: both income levels sum to 100% (lisp_eval, 2026-10-15)

import { Sankey, Tooltip, ResponsiveContainer, Rectangle } from 'recharts'

const GAINERS = new Set(['Housing', 'Healthcare', 'Education', 'Financial Svcs', 'Recreation'])
const LOSERS  = new Set(['Food', 'Clothing', 'Other'])

const NODE_COLORS: Record<string, string> = {
  'Budget $10k PPP':  '#6e7681',
  'Budget $20k PPP':  '#0969da',
  'Food':             '#e15759',
  'Housing':          '#4e79a7',
  'Transport':        '#f28e2b',
  'Clothing':         '#b07aa1',
  'Healthcare':       '#59a14f',
  'Education':        '#76b7b2',
  'Financial Svcs':   '#edc948',
  'Recreation':       '#ff9da7',
  'Other':            '#bab0ac',
}

const LINK_COLORS: Record<string, string> = {
  'Housing':          '#4e79a780',
  'Healthcare':       '#59a14f80',
  'Education':        '#76b7b280',
  'Financial Svcs':   '#edc94880',
  'Recreation':       '#ff9da780',
  'Food':             '#e1575930',
  'Clothing':         '#b07aa130',
  'Other':            '#bab0ac30',
  'Transport':        '#f28e2b50',
}

const NODES = [
  { name: 'Budget $10k PPP' },   // 0
  { name: 'Budget $20k PPP' },   // 1
  { name: 'Food' },               // 2
  { name: 'Housing' },            // 3
  { name: 'Transport' },          // 4
  { name: 'Clothing' },           // 5
  { name: 'Healthcare' },         // 6
  { name: 'Education' },          // 7
  { name: 'Financial Svcs' },     // 8
  { name: 'Recreation' },         // 9
  { name: 'Other' },              // 10
]

const LINKS = [
  // $10k budget allocation
  { source: 0, target: 2,  value: 35 },
  { source: 0, target: 3,  value: 20 },
  { source: 0, target: 4,  value: 10 },
  { source: 0, target: 5,  value: 8  },
  { source: 0, target: 6,  value: 5  },
  { source: 0, target: 7,  value: 5  },
  { source: 0, target: 8,  value: 4  },
  { source: 0, target: 9,  value: 3  },
  { source: 0, target: 10, value: 10 },
  // $20k budget allocation
  { source: 1, target: 2,  value: 22 },
  { source: 1, target: 3,  value: 29 },
  { source: 1, target: 4,  value: 12 },
  { source: 1, target: 5,  value: 6  },
  { source: 1, target: 6,  value: 9  },
  { source: 1, target: 7,  value: 8  },
  { source: 1, target: 8,  value: 8  },
  { source: 1, target: 9,  value: 6  },
]

// Delta table: gains / losses in budget share
const DELTA = [
  { cat: 'Food',          d10: 35, d20: 22, delta: -13 },
  { cat: 'Housing',       d10: 20, d20: 29, delta: +9  },
  { cat: 'Financial Svcs',d10: 4,  d20: 8,  delta: +4  },
  { cat: 'Healthcare',    d10: 5,  d20: 9,  delta: +4  },
  { cat: 'Transport',     d10: 10, d20: 12, delta: +2  },
  { cat: 'Education',     d10: 5,  d20: 8,  delta: +3  },
  { cat: 'Recreation',    d10: 3,  d20: 6,  delta: +3  },
  { cat: 'Clothing',      d10: 8,  d20: 6,  delta: -2  },
  { cat: 'Other',         d10: 10, d20: 0,  delta: -10 },
].sort((a, b) => b.delta - a.delta)

// Custom node renderer
type NodeProps = { x?: number; y?: number; width?: number; height?: number; index?: number; payload?: { name: string } }
const CustomNode = ({ x = 0, y = 0, width = 0, height = 0, payload }: NodeProps) => {
  const name  = payload?.name ?? ''
  const color = NODE_COLORS[name] ?? '#999'
  const isSource = name.startsWith('Budget')
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} rx={3} />
      <text
        x={isSource ? x - 6 : x + width + 6}
        y={y + height / 2}
        textAnchor={isSource ? 'end' : 'start'}
        dominantBaseline="middle"
        fontSize={11}
        fontFamily="inherit"
        fill="#1b1f23"
        fontWeight={500}
      >
        {name}
      </text>
    </g>
  )
}

// Custom link renderer
type LinkProps = { sourceX?: number; sourceY?: number; sourceControlX?: number; targetX?: number; targetY?: number; targetControlX?: number; linkWidth?: number; payload?: { target: { name: string } } }
const CustomLink = ({ sourceX = 0, sourceY = 0, sourceControlX = 0, targetX = 0, targetY = 0, targetControlX = 0, linkWidth = 0, payload }: LinkProps) => {
  const name  = payload?.target?.name ?? ''
  const color = LINK_COLORS[name] ?? '#99999930'
  const path = `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`
  return (
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={linkWidth}
      strokeOpacity={0.8}
    />
  )
}

export default function BudgetSankeyChart() {
  return (
    <div>
      {/* Sankey */}
      <p style={{ fontSize: 11, color: '#6e7681', marginBottom: 12 }}>
        Each column shows budget allocation (%). Left = household at $10k PPP per capita · Right = household at $20k PPP.
        Width of each band = share of budget. Source: PERI WP247 (207 countries) [OBS]
      </p>
      <ResponsiveContainer width="100%" height={400}>
        <Sankey
          data={{ nodes: NODES, links: LINKS }}
          node={<CustomNode />}
          link={<CustomLink />}
          nodePadding={8}
          margin={{ top: 10, right: 120, bottom: 10, left: 120 }}
        >
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #d0d7de', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
            formatter={(v: number) => [`${v}%`, 'Budget share']}
          />
        </Sankey>
      </ResponsiveContainer>

      {/* Delta table */}
      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
          Budget share change: $10k → $20k PPP (percentage points)
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: 6 }}>
          {DELTA.map(r => (
            <div key={r.cat} style={{ textAlign: 'center', padding: '8px 4px', borderRadius: 6, background: r.delta > 0 ? '#e6f4ea' : r.delta < 0 ? '#ffebe9' : '#f6f8fa', border: `1px solid ${r.delta > 0 ? '#a8d5b5' : r.delta < 0 ? '#ffc1c0' : '#eaeef2'}` }}>
              <p style={{ margin: '0 0 3px', fontSize: 10, color: '#6e7681', fontWeight: 500 }}>{r.cat}</p>
              <p style={{ margin: 0, fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: r.delta > 0 ? '#1a7f37' : r.delta < 0 ? '#cf222e' : '#57606a' }}>
                {r.delta > 0 ? '+' : ''}{r.delta}pp
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 9, color: '#afb8c1' }}>{r.d10}% → {r.d20}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Implication */}
      <div style={{ marginTop: 14, padding: '10px 14px', background: '#f6f8fa', borderRadius: 6, border: '1px solid #eaeef2', fontSize: 12, color: '#57606a', lineHeight: 1.6 }}>
        <strong style={{ color: '#1b1f23' }}>Investment implication [JDG]:</strong> As 600M+ households in India/China/Mexico move from $10k → $20k PPP income, Housing (+9pp), Financial Services (+4pp), Healthcare (+4pp) and Education (+3pp) each take a larger share of a growing budget. Food loses 13pp of share — not in absolute spending, but as a proportion. Companies in the gaining categories with income elasticity &gt;1 grow faster than income itself.
      </div>

      <p style={{ fontSize: 10, color: '#afb8c1', marginTop: 8 }}>
        Data: PERI WP247 "Engel's Law Around the World 150 Years Later" (207 countries) [OBS] · Conservation verified: $10k = 100%, $20k = 100% [lisp_eval, 2026-10-15]
      </p>
    </div>
  )
}
