'use client'
import { useState } from 'react'
import ResearchResult from './ResearchResult'

type Status = 'idle' | 'loading' | 'done' | 'error'

const EXAMPLES = ['Apple (AAPL)', 'Nu Holdings (NU)', 'Grab (GRAB)', 'Sea Limited (SE)', 'Rappi', 'Kaspi.kz (KSPI)']

export default function ResearchSearch() {
  const [query, setQuery]   = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError]   = useState('')
  const [elapsed, setElapsed] = useState(0)

  async function run(q: string) {
    if (!q.trim()) return
    setStatus('loading')
    setResult(null)
    setError('')
    const t0 = Date.now()

    // Show elapsed time while loading
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 500)

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: q.trim() }),
      })
      clearInterval(timer)
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error ?? `HTTP ${res.status}`)
        setStatus('error')
      } else {
        setResult(data)
        setStatus('done')
      }
    } catch (e) {
      clearInterval(timer)
      setError(e instanceof Error ? e.message : 'Network error')
      setStatus('error')
    }
  }

  return (
    <div>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run(query)}
          placeholder="Company name or ticker — e.g. MercadoLibre, GRAB, Nu Holdings"
          style={{
            flex: 1,
            padding: '10px 14px',
            fontSize: 14,
            border: '1px solid #d0d7de',
            borderRadius: 6,
            fontFamily: 'inherit',
            outline: 'none',
            color: '#1b1f23',
            background: '#fff',
          }}
          disabled={status === 'loading'}
        />
        <button
          onClick={() => run(query)}
          disabled={status === 'loading' || !query.trim()}
          style={{
            padding: '10px 20px',
            background: status === 'loading' ? '#6e7681' : '#0969da',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? `Analyzing… ${elapsed}s` : 'Run Analysis'}
        </button>
      </div>

      {/* Example chips */}
      {status === 'idle' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: '#6e7681', alignSelf: 'center' }}>Try:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); run(ex) }}
              style={{
                padding: '4px 10px',
                background: '#f6f8fa',
                border: '1px solid #d0d7de',
                borderRadius: 20,
                fontSize: 12,
                color: '#0969da',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {status === 'loading' && (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <div style={{ marginBottom: 12 }}>
            {['Resolving symbol…', 'Collecting financials (FMP)…', 'Getting live quote (EODHD)…', 'Running web search…', 'Synthesizing with Claude…'].map((step, i) => (
              <p key={step} style={{
                fontSize: 13,
                color: elapsed > i * 4 ? '#1b1f23' : '#afb8c1',
                margin: '4px 0',
                transition: 'color 0.5s',
              }}>
                {elapsed > i * 4 ? '✓' : '○'} {step}
              </p>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#6e7681' }}>
            Running company-research-deep pipeline via Claude Sonnet · {elapsed}s elapsed
          </p>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div style={{ padding: '16px', background: '#ffebe9', border: '1px solid #ffc1c0', borderRadius: 6, marginBottom: 16 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#cf222e', fontSize: 13 }}>Analysis failed</p>
          <p style={{ margin: 0, fontSize: 12, color: '#57606a' }}>{error}</p>
          {error.includes('FMP_API_KEY') && (
            <p style={{ margin: '8px 0 0', fontSize: 11, color: '#9a6700', background: '#fff8c5', padding: '6px 10px', borderRadius: 4, border: '1px solid #f0c060' }}>
              → Add FMP_API_KEY=P5wzdE4pQG1m2q2vHuQoZcpmEZkoV3dA to Railway Variables
            </p>
          )}
          <button
            onClick={() => setStatus('idle')}
            style={{ marginTop: 10, padding: '6px 12px', background: '#fff', border: '1px solid #d0d7de', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Result */}
      {status === 'done' && result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6e7681' }}>
              Analysis complete · {elapsed}s · {(result.meta as Record<string, unknown>)?.model as string}
            </p>
            <button
              onClick={() => { setStatus('idle'); setResult(null); setQuery('') }}
              style={{ padding: '5px 12px', background: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#57606a' }}
            >
              New search
            </button>
          </div>
          <ResearchResult result={result} />
        </div>
      )}

      <p style={{ fontSize: 11, color: '#afb8c1', marginTop: 16 }}>
        Powered by company-research-deep pipeline · OpenRouter/Claude · FMP + EODHD · Not investment advice
      </p>
    </div>
  )
}
