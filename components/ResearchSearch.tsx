'use client'
import { useState } from 'react'
import ResearchResult from './ResearchResult'

type StageId = 'evidence' | 'listen' | 'company' | 'falstaffian' | 'gorilla' | 'imagine' | 'thesis' | 'review'
type StageStatus = 'idle' | 'running' | 'done' | 'error'
type AppStatus = 'idle' | 'loading' | 'done' | 'error'

interface Stage {
  id: StageId
  label: string
  icon: string
  msg: string
  status: StageStatus
}

const INITIAL_STAGES: Stage[] = [
  { id: 'evidence',    label: 'collect-evidence',  icon: '📊', msg: '', status: 'idle' },
  { id: 'listen',      label: 'LISTEN',             icon: '👂', msg: '', status: 'idle' },
  { id: 'company',     label: 'COMPANY (8-part)',   icon: '🏢', msg: '', status: 'idle' },
  { id: 'falstaffian', label: 'FALSTAFFIAN',        icon: '🔄', msg: '', status: 'idle' },
  { id: 'gorilla',     label: 'GORILLA scoring',    icon: '🦍', msg: '', status: 'idle' },
  { id: 'imagine',     label: 'IMAGINE scenarios',  icon: '🔭', msg: '', status: 'idle' },
  { id: 'thesis',      label: 'THESIS (3 pillars)', icon: '📋', msg: '', status: 'idle' },
  { id: 'review',      label: 'evidence-review',    icon: '✅', msg: '', status: 'idle' },
]

const EXAMPLES = ['Nu Holdings (NU)', 'Grab Holdings (GRAB)', 'Sea Limited (SE)', 'Kaspi.kz (KSPI)', 'Rappi', 'Nubank Brazil']

export default function ResearchSearch() {
  const [query, setQuery]   = useState('')
  const [status, setStatus] = useState<AppStatus>('idle')
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError]   = useState('')
  const [elapsed, setElapsed] = useState(0)

  function updateStage(id: StageId, patch: Partial<Stage>) {
    setStages(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  async function run(q: string) {
    if (!q.trim()) return
    setStatus('loading')
    setResult(null)
    setError('')
    setStages(INITIAL_STAGES)
    const t0 = Date.now()
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - t0) / 1000)), 500)

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: q.trim() }),
      })

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const dec    = new TextDecoder()
      let buf      = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })

        const lines = buf.split('\n')
        buf = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const evt = JSON.parse(line.slice(6))

            if (evt.stage === 'error') throw new Error(evt.error)

            if (evt.stage === 'complete') {
              setResult(evt.result)
              setStatus('done')
              continue
            }

            const id = evt.stage as StageId
            if (INITIAL_STAGES.find(s => s.id === id)) {
              updateStage(id, { status: evt.status, msg: evt.msg ?? '' })
            }
          } catch (parseErr) {
            if (parseErr instanceof SyntaxError) continue
            throw parseErr
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error')
      setStatus('error')
    } finally {
      clearInterval(timer)
    }
  }

  const statusColor = (s: StageStatus) =>
    s === 'done' ? '#1a7f37' : s === 'running' ? '#0969da' : s === 'error' ? '#cf222e' : '#afb8c1'

  const statusIcon = (s: StageStatus) =>
    s === 'done' ? '✓' : s === 'running' ? '●' : s === 'error' ? '✗' : '○'

  return (
    <div>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run(query)}
          placeholder="Company name or ticker — e.g. Nu Holdings, Grab, Kaspi.kz"
          disabled={status === 'loading'}
          style={{ flex: 1, padding: '10px 14px', fontSize: 14, border: '1px solid #d0d7de', borderRadius: 6, fontFamily: 'inherit', color: '#1b1f23', background: '#fff', outline: 'none' }}
        />
        <button
          onClick={() => run(query)}
          disabled={status === 'loading' || !query.trim()}
          style={{ padding: '10px 20px', background: status === 'loading' ? '#6e7681' : '#0969da', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
        >
          {status === 'loading' ? `${elapsed}s…` : 'Run Analysis'}
        </button>
      </div>

      {/* Examples */}
      {status === 'idle' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          <span style={{ fontSize: 12, color: '#6e7681', alignSelf: 'center' }}>Try:</span>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => { setQuery(ex); run(ex) }}
              style={{ padding: '4px 10px', background: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: 20, fontSize: 12, color: '#0969da', cursor: 'pointer', fontFamily: 'inherit' }}>
              {ex}
            </button>
          ))}
        </div>
      )}

      {/* Live pipeline progress */}
      {status === 'loading' && (
        <div style={{ border: '1px solid #eaeef2', borderRadius: 8, padding: '16px 20px', marginBottom: 20, background: '#f6f8fa' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: '#6e7681', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            company-research-deep pipeline · {elapsed}s
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {stages.map(s => (
              <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: statusColor(s.status), fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 1 }}>
                  {statusIcon(s.status)}
                </span>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.status === 'running' ? '#0969da' : s.status === 'done' ? '#1b1f23' : '#afb8c1' }}>
                    {s.icon} {s.label}
                  </span>
                  {s.msg && (
                    <p style={{ margin: '1px 0 0', fontSize: 11, color: '#6e7681' }}>{s.msg}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: '12px 0 0', fontSize: 11, color: '#6e7681' }}>
            7 sequential LLM calls · OpenRouter/Claude Sonnet · FMP + EODHD
          </p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{ padding: '14px 16px', background: '#ffebe9', border: '1px solid #ffc1c0', borderRadius: 6, marginBottom: 16 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#cf222e', fontSize: 13 }}>Analysis failed</p>
          <p style={{ margin: 0, fontSize: 12, color: '#57606a' }}>{error}</p>
          <button onClick={() => setStatus('idle')} style={{ marginTop: 10, padding: '6px 12px', background: '#fff', border: '1px solid #d0d7de', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Try again
          </button>
        </div>
      )}

      {/* Result */}
      {status === 'done' && result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {stages.map(s => (
                <span key={s.id} style={{ fontSize: 10, color: '#1a7f37', background: '#e6f4ea', border: '1px solid #a8d5b5', padding: '1px 6px', borderRadius: 10 }}>
                  ✓ {s.label}
                </span>
              ))}
            </div>
            <button onClick={() => { setStatus('idle'); setResult(null); setQuery('') }}
              style={{ padding: '5px 12px', background: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#57606a' }}>
              New search
            </button>
          </div>
          <ResearchResult result={{ analysis: result, ticker: result.ticker as string, companyName: result.name as string }} />
        </div>
      )}

      <p style={{ fontSize: 11, color: '#afb8c1', marginTop: 14 }}>
        Pipeline: evidence → LISTEN → COMPANY → FALSTAFFIAN → GORILLA → IMAGINE → THESIS → evidence-review · Not investment advice
      </p>
    </div>
  )
}
