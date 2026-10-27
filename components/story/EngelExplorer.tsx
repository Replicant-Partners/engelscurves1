'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { explorer } from '../../data/explorerData';
import { story } from '../../data/storyData';
import { dollarStreet } from '../../data/dollarStreet';
import { REGION_COLORS, regionColor as color, BAND_FILL } from './regionColors';

type Row = { iso3: string; name: string; region: string; year: number; share: number; gdp: number; pop: number; projected?: boolean };

const W = 900, H = 520, M = { top: 28, right: 24, bottom: 46, left: 56 };
const MINX = 1200, MAXX = 130000, MAXY = 0.65;
const x = (g: number) => M.left + ((Math.log(g) - Math.log(MINX)) / (Math.log(MAXX) - Math.log(MINX))) * (W - M.left - M.right);
const y = (s: number) => M.top + (1 - s / MAXY) * (H - M.top - M.bottom);
const r = (pop: number) => Math.max(3, Math.min(30, 0.012 * Math.sqrt(pop)));
const usd = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${v}`);


const YEARS: number[] = [];
for (let t = 2017; t <= 2030; t++) YEARS.push(t);
const ALL: Row[] = [...explorer.observed, ...explorer.projected];
const DS = new Map(dollarStreet.markets.filter((m) => m.n > 0).map((m) => [m.iso3, m]));
const COUNTRIES = Array.from(new Map(ALL.map((d) => [d.iso3, d.name] as [string, string]))).sort((a, b) => a[1].localeCompare(b[1]));

export function EngelExplorer() {
  const [year, setYear] = useState(2023);
  const [playing, setPlaying] = useState(false);
  const lens = 'usda';
  const [selected, setSelected] = useState<string[]>(['IDN', 'VNM', 'IND', 'BRA']);
  const [hover, setHover] = useState<Row | null>(null);
  const [search, setSearch] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('highlight');
    if (q) {
      const codes = q.split(',').map((c) => c.trim().toUpperCase()).filter((iso) => ALL.some((d) => d.iso3 === iso));
      if (codes.length) setSelected(codes);
    }
  }, []);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => setYear((t) => (t >= 2030 ? (setPlaying(false), 2030) : t + 1)), 750);
      return () => { if (timer.current) clearInterval(timer.current); };
    }
  }, [playing, lens]);

  const frame = useMemo(() => ALL.filter((d) => d.year === year).sort((a, b) => b.pop - a.pop), [year]);
  const trails = useMemo(() => selected.map((iso) => ({ iso, pts: ALL.filter((d) => d.iso3 === iso && d.year <= year).sort((a, b) => a.year - b.year) })), [selected, year]);
  const bounds = { start: explorer.usda.knot, end: explorer.usda.end };
  const curve = explorer.usda.curve;
  const toggle = (iso: string) => setSelected((s) => (s.includes(iso) ? s.filter((c) => c !== iso) : [...s, iso]));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex border border-[#d0d7de]">
        </div>
        {(
          <>
            <button onClick={() => { if (year >= 2030) setYear(2017); setPlaying((p) => !p); }} className="border border-[#1b1f23] px-4 py-1.5 font-semibold min-w-[72px]">{playing ? 'Pause' : 'Play'}</button>
            <input type="range" min={2017} max={2030} value={year} onChange={(e) => { setPlaying(false); setYear(+e.target.value); }} className="w-56 accent-[#1b1f23]" aria-label="Year" />
            <span className={`font-mono text-2xl font-semibold w-24 ${year > 2023 ? 'text-[#57606a]' : ''}`}>{year}{year > 2023 ? '*' : ''}</span>
            <div className="relative">
              <div className="flex items-center gap-1.5 border border-[#d0d7de] rounded px-2.5 py-1.5 bg-white text-xs focus-within:border-[#1b1f23] focus-within:ring-1 focus-within:ring-[#1b1f23]">
                <svg width="11" height="11" viewBox="0 0 16 16" fill="#8c96a0">
                  <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"/>
                </svg>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowDrop(true); }}
                  onFocus={() => setShowDrop(true)}
                  placeholder="Highlight a country…"
                  className="outline-none w-40 text-[#1b1f23] placeholder:text-[#8c96a0] text-xs"
                />
                {search && <button onClick={() => { setSearch(''); setShowDrop(false); }} className="text-[#8c96a0] hover:text-[#57606a]">✕</button>}
              </div>
              {showDrop && search.trim().length > 0 && (() => {
                const hits = COUNTRIES.filter(([, name]) => name.toLowerCase().includes(search.toLowerCase())).slice(0, 8);
                return hits.length > 0 ? (
                  <ul className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#d0d7de] rounded shadow-lg z-20 text-xs overflow-hidden">
                    {hits.map(([iso, name]) => (
                      <li key={iso}>
                        <button className="w-full text-left px-3 py-2 hover:bg-[#f6f8fa] flex items-center justify-between"
                          onClick={() => { toggle(iso); setSearch(''); setShowDrop(false); }}>
                          <span className="font-medium">{selected.includes(iso) ? '✓ ' : ''}{name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null;
              })()}
            </div>
          </>
        )}
      </div>

      <div className="relative border border-[#d0d7de] overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block min-w-[760px]" role="img" aria-label="Food share of household spending against GDP per capita">
          <rect x={0} y={0} width={W} height={H} fill="transparent" onClick={() => { setHover(null); setShowDrop(false); }} />
          {(
            <text x={(M.left + W - M.right) / 2} y={H - M.bottom - 36} textAnchor="middle" fontSize="110" fontWeight={600}
              fill={year > 2023 ? '#57606a' : '#1b1f23'} opacity={0.1} pointerEvents="none">{year}{year > 2023 ? '*' : ''}</text>
          )}
          <rect x={x(bounds.start)} y={M.top} width={x(bounds.end) - x(bounds.start)} height={H - M.top - M.bottom} fill="#f2f4f7" />
          {[bounds.start, bounds.end].map((b, i) => (
            <g key={i}>
              <line x1={x(b)} x2={x(b)} y1={M.top} y2={H - M.bottom} stroke="#1b1f23" strokeDasharray="3 3" />
              <text x={x(b)} y={M.top - 8} textAnchor="middle" fontSize="11" fill="#1b1f23">{i === 0 ? `Shift begins ~${usd(b)}` : `Food 35% ~${usd(b)}`}</text>
            </g>
          ))}
          {[0, 0.2, 0.4, 0.6].map((s) => (
            <g key={s}>
              <line x1={M.left} x2={W - M.right} y1={y(s)} y2={y(s)} stroke="#eef0f2" />
              <text x={M.left - 8} y={y(s) + 4} textAnchor="end" fontSize="11" fill="#57606a">{Math.round(s * 100)}%</text>
            </g>
          ))}
          {[2000, 5000, 10000, 20000, 50000, 100000].map((g) => (
            <text key={g} x={x(g)} y={H - M.bottom + 18} textAnchor="middle" fontSize="11" fill="#57606a">{usd(g)}</text>
          ))}
          <text x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#57606a">GDP per capita, PPP (2021 international $, log scale)</text>
          <text transform={`translate(14 ${(M.top + H - M.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#57606a">Food share of household spending</text>

          <polyline points={curve.map((p) => `${x(p.gdp)},${y(p.share)}`).join(' ')} fill="none" stroke="#1b1f23" strokeWidth={2} opacity={0.75} />
          cy={y(p.share)} r={4} fill="#9aa4ae" opacity={0.75}><title>{`${p.iso3} ${p.year}: ${(p.share * 100).toFixed(0)}% at ${usd(p.gdp)}`}</title></circle>
          ))}

          {trails.map((t) => t.pts.length > 1 && (
            <polyline key={t.iso} points={t.pts.map((p) => `${x(p.gdp)},${y(p.share)}`).join(' ')} fill="none" stroke={color(t.pts[0].region)} strokeWidth={1.5} opacity={0.9} strokeDasharray={t.pts.some((p) => p.projected) ? undefined : undefined} />
          ))}
          {frame.map((d) => {
            const sel = selected.includes(d.iso3);
            return (
              <circle key={d.iso3} cx={x(d.gdp)} cy={y(d.share)} r={r(d.pop)}
                fill={d.projected ? 'none' : color(d.region)} stroke={d.projected ? color(d.region) : sel ? '#1b1f23' : 'white'}
                strokeWidth={d.projected ? 1.8 : sel ? 2 : 0.8} strokeDasharray={d.projected ? '4 3' : undefined}
                fillOpacity={sel ? 0.95 : 0.75} style={{ cursor: 'pointer', transition: 'cx 0.6s linear, cy 0.6s linear' }}
                onMouseEnter={() => setHover(d)} onMouseLeave={() => setHover(null)} onClick={() => { toggle(d.iso3); setHover(d); }} />
            );
          })}
          {frame.filter((d) => selected.includes(d.iso3)).map((d) => (
            <text key={d.iso3} x={x(d.gdp)} y={y(d.share) - r(d.pop) - 5} textAnchor="middle" fontSize="11.5" fontWeight={600} fill="#1b1f23">{d.name}</text>
          ))}
        </svg>
        {hover && (
          <div className="absolute top-2 right-2 bg-white border border-[#d0d7de] px-3 py-2 text-xs leading-relaxed shadow-sm pointer-events-none">
            <div className="font-semibold text-sm">{hover.name} &middot; {hover.year}{hover.projected ? ' (projection)' : ''}</div>
            <div>Food share: <span className="font-mono">{(hover.share * 100).toFixed(1)}%</span>{hover.projected ? ' (held at 2023)' : ''}</div>
            <div>GDP per capita: <span className="font-mono">{usd(hover.gdp)}</span>{hover.projected ? ' (IMF path)' : ''}</div>
            <div>Population: <span className="font-mono">{(hover.pop / 1e6).toFixed(1)}M</span></div>
            {DS.has(hover.iso3) && (
              <a href={`https://www.gapminder.org/dollar-street?countries=${DS.get(hover.iso3)!.c2}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 pointer-events-auto block mt-1">
                {DS.get(hover.iso3)!.n} {DS.get(hover.iso3)!.n === 1 ? 'family' : 'families'} on Dollar Street &rarr;
              </a>
            )}
            {['VNM','MEX','BRA','NGA','ARG','IDN'].includes(hover.iso3) && (
              <a href="/story#chains" className="underline underline-offset-2 pointer-events-auto block mt-1 text-[#4c78a8]">
                Valuation chain &rarr; chapter 8
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#57606a]">
        {Object.entries(REGION_COLORS).map(([reg, c]) => (
          <span key={reg} className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c }} />{reg}</span>
        ))}
        <span className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-[#57606a]" />2024&ndash;2030*: income on IMF path, food share held at 2023</span>
      </div>
    </div>
  );
}
