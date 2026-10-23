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
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setEntered(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex border border-[#d0d7de]">
          <button onClick={() => setFit('linear')} className={`px-3 py-1.5 ${fit === 'linear' ? 'bg-[#1b1f23] text-white' : 'text-[#57606a]'}`}>One slope</button>
          <button onClick={() => setFit('break')} className={`px-3 py-1.5 ${fit === 'break' ? 'bg-[#1b1f23] text-white' : 'text-[#57606a]'}`}>Two slopes (the break)</button>
        </div>
        <span className="text-xs text-[#57606a]">
          {fit === 'break'
            ? <>The broken line fits better: sup-F {story.fit.supF} against a 5% critical value of 8.85 (Andrews 1993).</>
            : <>A single slope (R&sup2; {story.fit.r2}) misses the flat stretch below ~{usd(story.bounds.start)}.</>}
        </span>
      </div>

      <div className="relative border border-[#d0d7de] overflow-x-auto">
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
          <text x={(M.left + W - M.right) / 2} y={H - 8} textAnchor="middle" fontSize="12" fill="#57606a">GDP per capita, PPP (2021 international $, log scale)</text>
          <text transform={`translate(13 ${(M.top + H - M.bottom) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#57606a">Food share of household spending</text>

          {story.lawPoints.map((p, i) => (
            <circle key={i} cx={x(p.gdp)} cy={y(p.share)} r={hover === p ? 6.5 : 4}
              fill={regionColor(p.region)} fillOpacity={hover === p ? 1 : 0.65} stroke={hover === p ? '#1b1f23' : 'white'} strokeWidth={hover === p ? 1.5 : 0.6}
              style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
              onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} onClick={() => setHover(p)} />
          ))}

          <path d={path(story.piecewiseLine)} fill="none" stroke="#1b1f23" strokeWidth={2.5}
            pathLength={1} strokeDasharray={1} strokeDashoffset={entered ? 0 : 1}
            style={{ opacity: fit === 'break' ? 1 : 0, transition: 'stroke-dashoffset 1.1s ease 0.25s, opacity 0.45s ease' }} />
          <path d={path(linearLine)} fill="none" stroke="#1b1f23" strokeWidth={2.5} strokeDasharray="7 5"
            style={{ opacity: fit === 'linear' ? 1 : 0, transition: 'opacity 0.45s ease' }} />
        </svg>
        {hover && (
          <div className="absolute top-2 left-14 bg-white border border-[#d0d7de] px-3 py-2 text-xs leading-relaxed shadow-sm pointer-events-none">
            <div className="font-semibold text-sm">{hover.country} &middot; {hover.year}</div>
            <div>Food share <span className="font-mono">{(hover.share * 100).toFixed(0)}%</span> at <span className="font-mono">{usd(hover.gdp)}</span></div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#57606a]">
        {Object.entries(REGION_COLORS).map(([r, c]) => (
          <span key={r} className="flex items-center gap-1.5"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: c }} />{r}</span>
        ))}
      </div>
    </div>
  );
}
