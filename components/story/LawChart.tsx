'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { story } from '../../data/storyData';

const W = 900, H = 460, M = { top: 26, right: 26, bottom: 48, left: 54 };
const MINX = 700, MAXX = 90000, MAXY = 0.8;
const x = (g: number) => M.left + ((Math.log(g) - Math.log(MINX)) / (Math.log(MAXX) - Math.log(MINX))) * (W - M.left - M.right);
const y = (s: number) => M.top + (1 - s / MAXY) * (H - M.top - M.bottom);
const usd = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${v}`);
const ACCENT = '#4c78a8';

const NARRATIVE = new Set(story.highlights.map((h) => `${h.gdp}-${h.share}`));
const RULE = new Set(story.autoHighlights.map((h) => `${h.gdp}-${h.share}`));

export function LawChart() {
  const pts = story.lawPoints; // sorted poorest to richest
  const [idx, setIdx] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setEntered(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sel = idx == null ? null : pts[idx];
  const labels = useMemo(() => [
    ...story.highlights.map((h) => ({ ...h, accent: true })),
    ...story.autoHighlights.map((h) => ({ ...h, accent: false })),
  ], []);

  return (
    <div ref={ref} className="space-y-3">
      <div className="relative border border-[#d0d7de] overflow-x-auto">
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
            const isSel = i === idx;
            const fill = isSel ? '#1b1f23' : NARRATIVE.has(key) ? ACCENT : RULE.has(key) ? '#57606a' : '#9aa4ae';
            return (
              <circle key={i} cx={x(p.gdp)} cy={entered ? y(p.share) : y(0)} r={isSel ? 7 : 4.5}
                fill={fill} fillOpacity={isSel ? 1 : 0.8} stroke={isSel ? 'white' : 'none'} strokeWidth={1.5}
                style={{ transition: `cy 0.55s ease ${i * 11}ms, r 0.15s ease, fill 0.15s ease`, cursor: 'pointer' }}
                onMouseEnter={() => setIdx(i)} onClick={() => setIdx(i)} />
            );
          })}
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
            <div className="font-semibold text-sm">{sel.country} &middot; {sel.year}</div>
            <div>Food share: <span className="font-mono">{(sel.share * 100).toFixed(0)}%</span></div>
            <div>Income: <span className="font-mono">{usd(sel.gdp)}</span> per person</div>
            <div className="text-[#57606a]">survey {idx! + 1} of {pts.length}, poorest to richest</div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-[#57606a]">
        <span className="whitespace-nowrap">Walk the data:</span>
        <input type="range" min={0} max={pts.length - 1} value={idx ?? 0} onChange={(e) => setIdx(+e.target.value)}
          className="w-full max-w-md accent-[#1b1f23]" aria-label="Step through the 85 surveys from poorest to richest" />
        <button onClick={() => setIdx((i) => Math.max(0, (i ?? 1) - 1))} className="border border-[#d0d7de] px-2 py-1 hover:text-[#1b1f23]">&larr;</button>
        <button onClick={() => setIdx((i) => Math.min(pts.length - 1, (i ?? -1) + 1))} className="border border-[#d0d7de] px-2 py-1 hover:text-[#1b1f23]">&rarr;</button>
        <span className="hidden md:inline">or hover any dot</span>
      </div>
    </div>
  );
}
