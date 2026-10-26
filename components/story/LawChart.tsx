'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { story } from '../../data/storyData';
import { REGION_COLORS, regionColor } from './regionColors';

const W = 900, H = 460, M = { top: 26, right: 26, bottom: 48, left: 54 };
const MINX = 700, MAXX = 90000, MAXY = 0.8;
const x = (g: number) => M.left + ((Math.log(g) - Math.log(MINX)) / (Math.log(MAXX) - Math.log(MINX))) * (W - M.left - M.right);
const y = (s: number) => M.top + (1 - s / MAXY) * (H - M.top - M.bottom);
const usd = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${v}`);

const NARRATIVE = new Set(story.highlights.map((h) => `${h.gdp}-${h.share}`));
const RULE = new Set(story.autoHighlights.map((h) => `${h.gdp}-${h.share}`));

export function LawChart() {
  const pts = story.lawPoints;
  const [idx, setIdx] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [pinned, setPinned] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setEntered(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const sel = pinned != null ? pts[pinned] : idx != null ? pts[idx] : null;

  const matches = search.trim().length > 0
    ? pts.map((p, i) => ({ p, i })).filter(({ p }) => p.country.toLowerCase().includes(search.toLowerCase().trim())).slice(0, 8)
    : [];

  const selectCountry = (i: number) => {
    setPinned(i);
    setIdx(i);
    setSearch(pts[i].country + ' ' + pts[i].year);
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearch('');
    setPinned(null);
    setShowDropdown(false);
  };

  const labels = useMemo(() => [
    ...story.highlights.map((h) => ({ ...h, accent: true })),
    ...story.autoHighlights.map((h) => ({ ...h, accent: false })),
  ], []);

  return (
    <div ref={ref} className="space-y-3">
      {/* Search row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <div className="flex items-center gap-1.5 border border-[#d0d7de] rounded px-2.5 py-1.5 bg-white text-xs focus-within:border-[#1b1f23] focus-within:ring-1 focus-within:ring-[#1b1f23]">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="#8c96a0">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => { setSearch(e.target.value); setShowDropdown(true); if (!e.target.value) { setPinned(null); setIdx(null); } }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Find a country…"
              className="outline-none w-36 text-[#1b1f23] placeholder:text-[#8c96a0]"
            />
            {search && <button onClick={clearSearch} className="text-[#8c96a0] hover:text-[#57606a]">✕</button>}
          </div>

          {showDropdown && matches.length > 0 && (
            <ul className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#d0d7de] rounded shadow-lg z-20 text-xs overflow-hidden">
              {matches.map(({ p, i }) => (
                <li key={i}>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#f6f8fa] flex items-center justify-between"
                    onClick={() => selectCountry(i)}
                  >
                    <span className="font-medium">{p.country}</span>
                    <span className="text-[#8c96a0]">{p.year} · {(p.share * 100).toFixed(0)}% food</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {pinned != null && (
          <span className="text-xs text-[#57606a]">
            <span className="font-semibold text-[#1b1f23]">{pts[pinned].country} {pts[pinned].year}</span>
            {' — '}{(pts[pinned].share * 100).toFixed(0)}% food share at {usd(pts[pinned].gdp)}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="relative border border-[#d0d7de] overflow-x-auto" onClick={() => setShowDropdown(false)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block min-w-[720px]" role="img" aria-label="Food share of household spending against GDP per capita, 85 surveys">
          {[0, 0.2, 0.4, 0.6, 0.8].map((s) => (
            <g key={s}>
              <line x1={M.left} x2={W - M.right} y1={y(s)} y2={y(s)} stroke="#eef0f2" />
              <text x={M.left - 8} y={y(s) + 4} textAnchor="end" fontSize="11" fill="#57606a">{Math.round(s * 100)}%</text>
            </g>
          ))}
          {[1000, 2000, 5000, 10000, 20000, 50000].map((g) => (
            <text key={g} x={x(g)} y={H - M.bottom + 18} textAnchor="middle" fontSize="11" fill="#57606a">{usd(g)}</text>
          ))}
          <text x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#57606a">GDP per capita, PPP (2021 international $, log scale)</text>
          <text transform={`translate(13 ${(M.top + H - M.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#57606a">Food share of household spending</text>

          {pts.map((p, i) => {
            const key = `${p.gdp}-${p.share}`;
            const isSel = i === (pinned ?? idx);
            const isPinned = i === pinned;
            const isMatch = !pinned && search.trim() && p.country.toLowerCase().includes(search.toLowerCase().trim());
            const dim = (pinned != null && !isPinned) || (!pinned && search.trim().length > 0 && !isMatch);
            const fill = isSel ? '#1b1f23' : regionColor(p.region);
            return (
              <circle key={i}
                cx={x(p.gdp)} cy={entered ? y(p.share) : y(0)}
                r={isSel ? 7 : isMatch ? 6 : 4.5}
                fill={fill} fillOpacity={dim ? 0.12 : isSel ? 1 : 0.8}
                stroke={isPinned ? '#1b1f23' : NARRATIVE.has(key) || RULE.has(key) ? '#1b1f23' : isMatch ? regionColor(p.region) : 'none'}
                strokeWidth={isPinned ? 2 : isMatch ? 1.5 : 1}
                style={{ transition: `cy 0.55s ease ${i * 11}ms, r 0.15s ease, fill-opacity 0.2s ease`, cursor: 'pointer' }}
                onMouseEnter={() => { if (pinned == null) setIdx(i); }}
                onMouseLeave={() => { if (pinned == null) setIdx(null); }}
                onClick={() => {
                  if (pinned === i) { setPinned(null); setIdx(null); setSearch(''); }
                  else { setPinned(i); setIdx(i); setSearch(p.country + ' ' + p.year); setShowDropdown(false); }
                }}
              />
            );
          })}

          {/* Pulse on pinned */}
          {pinned != null && (
            <circle cx={x(pts[pinned].gdp)} cy={y(pts[pinned].share)} r={12}
              fill="none" stroke={regionColor(pts[pinned].region)} strokeWidth={1.5} opacity={0.4}
              style={{ animation: 'pulse-ring 1.5s ease-out infinite' }}
            />
          )}

          {labels.map((h) => (
            <text key={h.label} x={x(h.gdp)} y={y(h.share) + (h.accent ? -10 : 16)} textAnchor="middle" fontSize={h.accent ? 11.5 : 10}
              fontWeight={h.accent ? 600 : 400} fill={h.accent ? '#1b1f23' : '#57606a'}
              style={{ opacity: entered ? 1 : 0, transition: 'opacity 0.5s ease 1.1s' }}>{h.label}</text>
          ))}

          {sel && (
            <line x1={x(sel.gdp)} x2={x(sel.gdp)} y1={y(sel.share)} y2={H - M.bottom} stroke="#1b1f23" strokeDasharray="3 3" opacity={0.5} />
          )}
        </svg>

        {sel && (
          <div className="absolute top-2 left-14 bg-white border border-[#d0d7de] px-3 py-2 text-xs leading-relaxed shadow-sm pointer-events-none">
            <div className="font-semibold text-sm">{sel.country} · {sel.year}</div>
            <div>Food share: <span className="font-mono">{(sel.share * 100).toFixed(0)}%</span></div>
            <div>Income: <span className="font-mono">{usd(sel.gdp)}</span> per person</div>
            <div className="text-[#57606a] text-[10px]">{sel.region} · survey {(pinned ?? idx)! + 1} of {pts.length}</div>
          </div>
        )}
      </div>

      {/* Slider + legend */}
      <div className="flex items-center gap-3 text-xs text-[#57606a]">
        <span className="whitespace-nowrap">Walk the data:</span>
        <input type="range" min={0} max={pts.length - 1} value={pinned ?? idx ?? 0}
          onChange={(e) => { const i = +e.target.value; setIdx(i); setPinned(null); setSearch(''); }}
          className="w-full max-w-md accent-[#1b1f23]" aria-label="Step through the 85 surveys from poorest to richest" />
        <button onClick={() => { const i = Math.max(0, (pinned ?? idx ?? 1) - 1); setIdx(i); setPinned(null); setSearch(''); }} className="border border-[#d0d7de] px-2 py-1 hover:text-[#1b1f23]">&larr;</button>
        <button onClick={() => { const i = Math.min(pts.length - 1, (pinned ?? idx ?? -1) + 1); setIdx(i); setPinned(null); setSearch(''); }} className="border border-[#d0d7de] px-2 py-1 hover:text-[#1b1f23]">&rarr;</button>
        <span className="hidden md:inline">or hover any dot</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#57606a]">
        {Object.entries(REGION_COLORS).map(([r, c]) => (
          <span key={r} className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c }} />{r}</span>
        ))}
      </div>

      <style>{`@keyframes pulse-ring { 0% { r: 10; opacity: 0.5; } 100% { r: 22; opacity: 0; } }`}</style>
    </div>
  );
}
