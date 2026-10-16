// ─── Analysis Library — localStorage persistence ─────────────────────────────
// Each saved analysis is keyed by ticker + timestamp so multiple runs per
// company are preserved.

export interface SavedAnalysis {
  id: string                     // ticker-timestamp, e.g. "NU-1728998400000"
  ticker: string
  name: string
  savedAt: string                // ISO date
  gorilla: { score: number; verdict: string }
  thesis: { supported: boolean; priceConclusion: string }
  engelCurve?: { economies: string[]; categories: { name: string; elasticity: number }[] }
  pipeline: string
  fullAnalysis: Record<string, unknown>
}

const KEY = 'engel_library_v1'

export function loadLibrary(): SavedAnalysis[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch { return [] }
}

export function saveAnalysis(raw: Record<string, unknown>): SavedAnalysis {
  const ticker  = String(raw.ticker ?? 'UNKNOWN')
  const name    = String(raw.name ?? ticker)
  const gorilla = (raw.gorilla ?? {}) as { score: number; verdict: string }
  const thesis  = (raw.thesis ?? {}) as { supported: boolean; priceConclusion: string }
  const ec      = raw.engelCurve as SavedAnalysis['engelCurve']

  const entry: SavedAnalysis = {
    id:           `${ticker}-${Date.now()}`,
    ticker,
    name,
    savedAt:      new Date().toISOString(),
    gorilla:      { score: Number(gorilla.score ?? 0), verdict: String(gorilla.verdict ?? 'PEDESTRIAN') },
    thesis:       { supported: Boolean(thesis.supported), priceConclusion: String(thesis.priceConclusion ?? '') },
    engelCurve:   ec,
    pipeline:     String(raw.pipeline ?? 'company-research-deep'),
    fullAnalysis: raw,
  }

  const lib = loadLibrary()
  // Keep at most 50 entries (drop oldest)
  const updated = [entry, ...lib].slice(0, 50)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return entry
}

export function deleteAnalysis(id: string): void {
  const updated = loadLibrary().filter(a => a.id !== id)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function clearLibrary(): void {
  localStorage.removeItem(KEY)
}

// Verdict styling
export const VERDICT_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  GORILLA:      { bg: '#e6f4ea', color: '#1a7f37', border: '#a8d5b5' },
  SMALL_ANIMAL: { bg: '#fff8c5', color: '#9a6700', border: '#f0c060' },
  PEDESTRIAN:   { bg: '#f6f8fa', color: '#57606a', border: '#d0d7de' },
}
