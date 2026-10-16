'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import TabNav from '@/components/TabNav'
import { loadLibrary, deleteAnalysis, clearLibrary, VERDICT_COLORS, type SavedAnalysis } from '@/lib/library'

const ResearchResult = dynamic(() => import('@/components/ResearchResult'), { ssr: false })

export default function LibraryPage() {
  const [lib, setLib]       = useState<SavedAnalysis[]>([])
  const [selected, setSelected] = useState<SavedAnalysis | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'GORILLA' | 'SMALL_ANIMAL' | 'PEDESTRIAN'>('all')

  useEffect(() => { setLib(loadLibrary()) }, [])

  function remove(id: string) {
    deleteAnalysis(id)
    setLib(loadLibrary())
    if (selected?.id === id) setSelected(null)
  }

  function clear() {
    if (!confirm('Delete all saved analyses?')) return
    clearLibrary()
    setLib([])
    setSelected(null)
  }

  const filtered = lib.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.ticker.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || a.gorilla.verdict === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="obs-notebook">
      <header style={{ paddingTop: 48 }}>
        <TabNav />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="obs-h1">Analysis Library</h1>
            <p className="obs-byline" style={{ marginTop: 6 }}>
              {lib.length} saved {lib.length === 1 ? 'analysis' : 'analyses'} · stored in your browser · not shared
            </p>
          </div>
          {lib.length > 0 && (
            <button onClick={clear} style={{ padding: '6px 14px', background: '#fff', border: '1px solid #d0d7de', borderRadius: 6, fontSize: 12, color: '#cf222e', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear all
            </button>
          )}
        </div>
      </header>

      {lib.length === 0 ? (
        <section style={{ textAlign: 'center', padding: '64px 0', color: '#6e7681' }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>📚</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1b1f23', marginBottom: 8 }}>No analyses saved yet</p>
          <p style={{ fontSize: 14 }}>Run an analysis in the Deep Research tab and click <strong>Save to Library</strong>.</p>
        </section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, marginTop: 24 }}>

          {/* ── Sidebar list ────────────────────────────────────────────── */}
          <div>
            {/* Search + filter */}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company…"
              style={{ width: '100%', padding: '8px 12px', fontSize: 13, border: '1px solid #d0d7de', borderRadius: 6, fontFamily: 'inherit', color: '#1b1f23', background: '#fff', boxSizing: 'border-box', marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {(['all', 'GORILLA', 'SMALL_ANIMAL', 'PEDESTRIAN'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '3px 10px', fontSize: 11, borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', fontWeight: filter === f ? 600 : 400,
                  border: '1px solid', ...(f === 'all' ? { background: filter === 'all' ? '#0969da' : '#f6f8fa', color: filter === 'all' ? '#fff' : '#57606a', borderColor: filter === 'all' ? '#0969da' : '#d0d7de' } : { ...VERDICT_COLORS[f], opacity: filter === f ? 1 : 0.6 }),
                }}>
                  {f === 'all' ? 'All' : f === 'SMALL_ANIMAL' ? 'Small Animal' : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.length === 0 && (
                <p style={{ fontSize: 13, color: '#6e7681', textAlign: 'center', padding: '24px 0' }}>No matches</p>
              )}
              {filtered.map(a => {
                const vc = VERDICT_COLORS[a.gorilla.verdict] ?? VERDICT_COLORS.PEDESTRIAN
                const isSelected = selected?.id === a.id
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelected(isSelected ? null : a)}
                    style={{
                      border: `1px solid ${isSelected ? '#0969da' : '#d0d7de'}`,
                      borderRadius: 8, padding: '12px 14px', cursor: 'pointer',
                      background: isSelected ? '#f0f6ff' : '#fff',
                      transition: 'border-color .15s, background .15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6e7681', background: '#f6f8fa', padding: '1px 5px', borderRadius: 3, border: '1px solid #eaeef2' }}>{a.ticker}</span>
                          <span style={{ ...vc, fontSize: 10, padding: '1px 7px', borderRadius: 20, border: `1px solid ${vc.border}`, fontWeight: 600 }}>
                            {a.gorilla.verdict === 'SMALL_ANIMAL' ? 'S.ANIMAL' : a.gorilla.verdict} {a.gorilla.score}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: '#1b1f23' }}>{a.name}</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); remove(a.id) }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#afb8c1', fontSize: 16, padding: '0 2px', lineHeight: 1 }}
                        title="Delete"
                      >×</button>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: '#6e7681' }}>
                      {new Date(a.savedAt).toLocaleDateString()} · {a.thesis.supported ? '✓ thesis' : '— no thesis'}
                    </p>
                    {a.engelCurve?.economies?.length ? (
                      <p style={{ margin: '4px 0 0', fontSize: 10, color: '#0969da' }}>{a.engelCurve.economies.join(' · ')}</p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Detail panel ─────────────────────────────────────────────── */}
          <div>
            {!selected ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, border: '1px dashed #d0d7de', borderRadius: 10, color: '#6e7681' }}>
                <p style={{ fontSize: 14 }}>Select an analysis from the list</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#6e7681' }}>
                    Saved {new Date(selected.savedAt).toLocaleString()} · {selected.pipeline}
                  </p>
                  <button
                    onClick={() => remove(selected.id)}
                    style={{ padding: '5px 12px', background: '#fff', border: '1px solid #d0d7de', borderRadius: 6, fontSize: 12, color: '#cf222e', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Delete
                  </button>
                </div>
                <ResearchResult result={{ analysis: selected.fullAnalysis, ticker: selected.ticker, companyName: selected.name }} />
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #d0d7de', paddingTop: 20, marginTop: 48, fontSize: 11, color: '#6e7681' }}>
        Analyses are stored in your browser (localStorage). They are not synced across devices or shared. Max 50 saved.
      </footer>
    </div>
  )
}
