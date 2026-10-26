'use client';
import { useEffect, useRef, useState } from 'react';

interface Entry {
  anchor: string;
  chapter: string;
  title: string;
  terms: string[];
  preview: string;
}

const INDEX: Entry[] = [
  { anchor: '#mechanism', chapter: '0', title: 'The mechanism',
    terms: ['mechanism', 'elasticity', 'budget share', 'expenditure', 'inferior', 'luxury', 'necessity', 'engel curve', 'definition', 'concepts'],
    preview: 'What Engel curves measure, elasticities, and what they cannot say.' },
  { anchor: '#law', chapter: '1', title: 'The law',
    terms: ['the law', 'scatter', '85 surveys', 'ethiopia', 'switzerland', 'cross section', 'houthakker', 'slope', 'historical', '150 years'],
    preview: '85 household surveys, poorest to richest. Slope barely moves across 150 years.' },
  { anchor: '#break', chapter: '2', title: 'The break',
    terms: ['break', 'threshold', 'transition', '$6.6k', '6600', 'structural break', 'japan', 'robustness', 'sup-f', 'piecewise', 'two slopes'],
    preview: 'The food share breaks at $6.6k. Japan walked the curve in one lifetime.' },
  { anchor: '#motion', chapter: '3', title: 'In motion',
    terms: ['in motion', 'animated', 'gapminder', '102 countries', 'play', 'explorer', 'usda', 'imf', '2030', 'projection', 'bubble'],
    preview: 'Gapminder-style animation: 102 countries, 2017–2030.' },
  { anchor: '#map', chapter: '4', title: 'The map',
    terms: ['map', 'twelve markets', '12 markets', 'india', 'philippines', 'vietnam', 'indonesia', 'egypt', 'probability', 'exit', 'phase', 'south africa'],
    preview: 'Where 12 emerging markets sit today and where IMF paths take them by 2030.' },
  { anchor: '#money', chapter: '5', title: 'The freed-up wallet',
    terms: ['freed up', 'wallet', 'non-food', 'spending', 'income doubles', 'kharas', 'middle class', '$10,000', '$20,000', 'trillion'],
    preview: 'When income doubles from $10k to $20k, non-food spending more than doubles.' },
  { anchor: '#street', chapter: '6', title: 'The street',
    terms: ['dollar street', 'street', 'household', 'family', 'photo', 'gapminder', '$335', 'monthly', 'inside home'],
    preview: 'Dollar Street: real families on one global street, sorted by consumption.' },
  { anchor: '#chains', chapter: '7', title: 'Who captures the transition?',
    terms: ['who captures', 'company', 'valuation', 'mwg', 'femsa', 'yduqs', 'mtn nigeria', 'galicia', 'siloam', 'implied growth', 'pe ratio', 'forward', 'verdict', 'falsifier', 'early signals', 'phase 3', 'phase 4'],
    preview: '6 market-company pairs: implied growth vs actual growth. Early signals.' },
  { anchor: '#macrorisk', chapter: '8', title: 'Macro risk',
    terms: ['macro risk', 'gdp', 'inflation', 'fx', 'currency', 'selic', 'banxico', 'argentina', 'brazil', 'vietnam', 'mexico', 'nigeria', 'indonesia', 'stress test'],
    preview: 'Country macro scorecards, FX stress test, Engel exit sensitivity.' },
  { anchor: '#portfolio', chapter: '9', title: 'Portfolio construction',
    terms: ['portfolio', 'weight', 'signal weighted', 'expected value', 'ev', 'equal weight', 'risk register', 'sizing', 'allocation'],
    preview: '4 weighting modes, EV scatter, risk register, entry timing insight.' },
  { anchor: '#watch', chapter: '10', title: 'Predictions',
    terms: ['predictions', 'brier', 'forecast', 'horizon', 'timeline', '2027', 'signal', 'resolve', 'falsifiable', 'watch'],
    preview: 'Dated, falsifiable predictions with Brier scoring at resolution.' },
  { anchor: '#method', chapter: '11', title: 'Evidence and method',
    terms: ['evidence', 'method', 'citations', 'sources', 'corpus', 'verification', 'limitations', 'falsify', 'scripts', 'data'],
    preview: 'Evidence table, data sources, limitations, and what would falsify the thesis.' },
];

function score(entry: Entry, q: string): number {
  const lq = q.toLowerCase().trim();
  if (!lq) return 0;
  let s = 0;
  if (entry.title.toLowerCase().includes(lq)) s += 10;
  if (entry.chapter === lq || entry.chapter === lq.replace('chapter ', '')) s += 15;
  entry.terms.forEach(t => { if (t.includes(lq) || lq.includes(t)) s += 5; });
  if (entry.preview.toLowerCase().includes(lq)) s += 2;
  return s;
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = q.trim().length < 1 ? INDEX.slice(0, 6) :
    INDEX.map(e => ({ ...e, s: score(e, q) }))
         .filter(e => e.s > 0)
         .sort((a, b) => b.s - a.s)
         .slice(0, 6);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setQ(''); }
  }, [open]);

  const go = (anchor: string) => {
    setOpen(false);
    const el = document.querySelector(anchor);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Trigger button in nav */}
      <button
        onClick={() => setOpen(true)}
        className="ml-auto flex items-center gap-2 text-[#57606a] hover:text-[#1b1f23] text-xs border border-[#d0d7de] rounded px-2.5 py-1 bg-white hover:bg-[#f6f8fa] transition-colors"
        aria-label="Search chapters (Ctrl+K)"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
        </svg>
        <span>Search</span>
        <kbd className="hidden md:inline text-[10px] text-[#8c96a0] border border-[#d0d7de] rounded px-1">⌘K</kbd>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-2xl border border-[#d0d7de] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e1e4e8]">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#57606a">
                <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search chapters — try 'vietnam', 'elasticity', 'portfolio'…"
                className="flex-1 text-sm outline-none text-[#1b1f23] placeholder:text-[#8c96a0]"
              />
              {q && (
                <button onClick={() => setQ('')} className="text-[#8c96a0] hover:text-[#57606a] text-xs">✕</button>
              )}
            </div>

            {/* Results */}
            <ul className="max-h-80 overflow-y-auto divide-y divide-[#f0f0f0]">
              {results.length === 0 && (
                <li className="px-4 py-6 text-sm text-[#8c96a0] text-center">No results for "{q}"</li>
              )}
              {results.map(e => (
                <li key={e.anchor}>
                  <button
                    onClick={() => go(e.anchor)}
                    className="w-full text-left px-4 py-3 hover:bg-[#f6f8fa] transition-colors"
                  >
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-[#8c96a0]">CH {e.chapter}</span>
                      <span className="text-sm font-semibold text-[#1b1f23]">{e.title}</span>
                    </div>
                    <p className="text-xs text-[#57606a] leading-relaxed">{e.preview}</p>
                  </button>
                </li>
              ))}
            </ul>

            <div className="px-4 py-2 border-t border-[#e1e4e8] flex gap-4 text-[10px] text-[#8c96a0]">
              <span>↑↓ navigate</span><span>↵ open</span><span>Esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
