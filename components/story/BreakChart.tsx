'use client';
import { useEffect, useRef, useState } from 'react';
import { story } from '../../data/storyData';
import { REGION_COLORS, regionColor, BAND_FILL } from './regionColors';

const W = 900, H = 460, M = { top: 30, right: 26, bottom: 48, left: 54 };
const MINX = 700, MAXX = 90000, MAXY = 0.8;
const x = (g: number) => M.left + ((Math.log(g) - Math.log(MINX)) / (Math.log(MAXX) - Math.log(MINX))) * (W - M.left - M.right);
const y = (s: number) => M.top + (1 - s / MAXY) * (H - M.top - M.bottom);
const usd = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${v}`);

type P = { gdp: number; share: number };
const path = (pts: readonly P[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.gdp).toFixed(1)},${y(p.share).toFixed(1)}`).join(' ');
const GRID = [800, 1500, 3000, 6000, 12000, 25000, 50000, 80000];
const linearLine: P[] = GRID.map((g) => ({ gdp: g, share: story.fit.a + story.fit.b * Math.log(g) }));

export function BreakChart() {
  const [fit, setFit] = useState<'break' | 'linear'>('break');
  const [entered, setEntered] = useState(false);
  const [hover, setHover] = useState<(typeof story.lawPoints)[number] | null>(null);
  const [pinned, setPinned] = useState<(typeof story.lawPoints)[number] | null>(null);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setEntered(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);

  // Filter countries for dropdown
  const matches = search.trim().length > 0
    ? story.lawPoints.filter(p => p.country.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  const active = pinned ?? hover;

  const selectCountry = (p: typeof story.lawPoints[number]) => {
    setPinned(p);
    setSearch(p.country + ' ' + p.year);
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setSearch('');
    setPinned(null);
    setShowDropdown(false);
  };

  return (
    <div ref={ref} className="space-y-3">
      {/* Controls row: toggle + search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex border border-[#d0d7de]">
          <button onClick={() => setFit('linear')} className={`px-3 py-1.5 text-sm ${fit === 'linear' ? 'bg-[#1b1f23] text-white' : 'text-[#57606a]'}`}>One slope</button>
          <button onClick={() => setFit('break')} className={`px-3 py-1.5 text-sm ${fit === 'break' ? 'bg-[#1b1f23] text-white' : 'text-[#57606a]'}`}>Two slopes (the break)</button>
        </div>
        <span className="text-xs text-[#57606a] flex-1">
          {fit === 'break'
            ? <>The broken line fits better: sup-F {story.fit.supF} against a 5% critical value of 8.85 (Andrews 1993).</>
            : <>A single slope (R&sup2; {story.fit.r2}) misses the flat stretch below ~{usd(story.bounds.start)}.</>}
        </span>

        {/* Country search */}
        <div className="relative">
          <div className="flex items-center gap-1.5 border border-[#d0d7de] rounded px-2.5 py-1.5 bg-white text-xs focus-within:border-[#1b1f23] focus-within:ring-1 focus-within:ring-[#1b1f23]">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="#8c96a0">
              <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => { setSearch(e.target.value); setShowDropdown(true); if (!e.target.value) setPinned(null); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Find a country…"
              className="outline-none w-36 text-[#1b1f23] placeholder:text-[#8c96a0]"
            />
            {search && (
              <button onClick={clearSearch} className="text-[#8c96a0] hover:text-[#57606a]">✕</button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && matches.length > 0 && (
            <ul className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#d0d7de] rounded shadow-lg z-20 text-xs overflow-hidden">
              {matches.map((p, i) => (
                <li key={i}>
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-[#f6f8fa] flex items-center justify-between"
                    onClick={() => selectCountry(p)}
                  >
                    <span className="font-medium">{p.country}</span>
                    <span className="text-[#8c96a0]">{p.year} · {(p.share * 100).toFixed(0)}% food</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative border border-[#d0d7de] overflow-x-auto" onClick={() => setShowDropdown(false)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block min-w-[720px]" role="img" aria-label="The same 85 surveys with a fitted line: flat below the break, falling above it">
          {fit === 'break' && (
            <>
              <rect x={x(story.bounds.start)} y={M.top} width={x(story.bounds.end) - x(story.bounds.start)} height={H - M.top - M.bottom} fill={BAND_FILL} style={{ opacity: entered ? 1 : 0, transition: 'opacity 0.6s ease 1s' }} />
              {[story.bounds.start, story.bounds.end].map((b, i) => (
                <g key={i} style={{ opacity: entered ? 1 : 0, transition: 'opacity 0.6s ease 1.1s' }}>
                  <line x1={x(b)} x2={x(b)} y1={M.top} y2={H - M.bottom} stroke="#1b1f23" strokeDasharray="3 3" />
                  <text x={x(b)} y={M.top - 8} textAnchor="middle" fontSize="11" fill="#1b1f23">{i === 0 ? `Shift begins ~${usd(b)}` : `Food reaches 35% ~${usd(b)}`}</text>
                </g>
              ))}
            </>
          )}
          {[0, 0.2, 0.4, 0.6, 0.8].map((s) => (
            <g key={s}>
              <line x1={M.left} x2={W - M.right} y1={y(s)} y2={y(s)} stroke="#eef0f2" />
              <text x={M.left - 8} y={y(s) + 4} textAnchor="end" fontSize="11" fill="#57606a">{Math.round(s * 100)}%</text>
            </g>
          ))}
          {[1000, 2000, 5000, 10000, 20000, 50000].map((g) => (
            <text key={g} x={x(g)} y={H - M.bottom + 18} textAnchor="middle" fontSize="11" fill="#57606a">{usd(g)}</text>
          ))}
          <text x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#57606a">GDP per capita at survey year — PPP, constant 2021 $ (log scale)</text>
          <text transform={`translate(13 ${(M.top + H - M.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#57606a">Food share of household spending</text>

          {story.lawPoints.map((p, i) => {
            const isActive = active === p;
            const isPinned = pinned === p;
            const isSearch = !pinned && search.trim() && p.country.toLowerCase().includes(search.toLowerCase().trim());
            const dim = !!pinned && !isPinned;
            return (
              <circle key={i} cx={x(p.gdp)} cy={y(p.share)}
                r={isActive ? 7 : isSearch ? 6 : 4}
                fill={isActive || isSearch ? regionColor(p.region) : regionColor(p.region)}
                fillOpacity={dim ? 0.15 : isActive ? 1 : isSearch ? 0.9 : 0.65}
                stroke={isPinned ? '#1b1f23' : isSearch ? regionColor(p.region) : 'white'}
                strokeWidth={isPinned ? 2 : isSearch ? 1.5 : 0.6}
                style={{ cursor: 'pointer', transition: 'r 0.15s ease, fill-opacity 0.2s ease' }}
                onMouseEnter={() => setHover(p)}
                onMouseLeave={() => setHover(null)}
                onClick={() => { setPinned(isPinned ? null : p); setSearch(p.country + ' ' + p.year); setShowDropdown(false); }}
              />
            );
          })}

          {/* Pulse ring on pinned */}
          {pinned && (
            <circle cx={x(pinned.gdp)} cy={y(pinned.share)} r={12}
              fill="none" stroke={regionColor(pinned.region)} strokeWidth={1.5} opacity={0.4}
              style={{ animation: 'pulse-ring 1.5s ease-out infinite' }}
            />
          )}

          <path d={path(story.piecewiseLine)} fill="none" stroke="#1b1f23" strokeWidth={2.5}
            pathLength={1} strokeDasharray={1} strokeDashoffset={entered ? 0 : 1}
            style={{ opacity: fit === 'break' ? 1 : 0, transition: 'stroke-dashoffset 1.1s ease 0.25s, opacity 0.45s ease' }} />
          <path d={path(linearLine)} fill="none" stroke="#1b1f23" strokeWidth={2.5} strokeDasharray="7 5"
            style={{ opacity: fit === 'linear' ? 1 : 0, transition: 'opacity 0.45s ease' }} />
        </svg>

        {/* Tooltip */}
        {active && (
          <div className="absolute top-2 left-14 bg-white border border-[#d0d7de] px-3 py-2 text-xs leading-relaxed shadow-sm pointer-events-none">
            <div className="font-semibold text-sm">{active.country} · {active.year}</div>
            <div>Food share <span className="font-mono">{(active.share * 100).toFixed(0)}%</span> at <span className="font-mono">{usd(active.gdp)}</span></div>
            <div className="text-[#57606a] text-[10px] mt-0.5">{active.region}</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#57606a]">
        {Object.entries(REGION_COLORS).map(([r, c]) => (
          <span key={r} className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c }} />{r}</span>
        ))}
      </div>

      <style>{`@keyframes pulse-ring { 0% { r: 10; opacity: 0.5; } 100% { r: 20; opacity: 0; } }`}</style>
    </div>
  );
}
