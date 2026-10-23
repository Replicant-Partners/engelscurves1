'use client';
import { useEffect, useRef, useState } from 'react';
import { mechanismData } from '../../data/mechanismData';

const W = 820, H = 320, M = { top: 30, right: 130, bottom: 44, left: 170 };
const cats = mechanismData.categories;
const MIN_ETA = -0.4, MAX_ETA = 1.5;
const ROW = Math.floor((H - M.top - M.bottom) / cats.length);
const x = (eta: number) => M.left + ((eta - MIN_ETA) / (MAX_ETA - MIN_ETA)) * (W - M.left - M.right);
const COLORS: Record<string, string> = { luxury: '#4c78a8', necessity: '#9aa4ae', inferior: '#c26b6b' };
const ZERO = x(0), ONE = x(1);

export function MechanismChart() {
  const [entered, setEntered] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setEntered(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <div className="space-y-2">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[640px]" role="img" aria-label="Income elasticity of demand by consumption category, 42 OECD countries">
        <line x1={ZERO} x2={ZERO} y1={M.top - 10} y2={H - M.bottom} stroke="#e1e4e8" strokeWidth={1.5} />
        <line x1={ONE} x2={ONE} y1={M.top - 10} y2={H - M.bottom} stroke="#1b1f23" strokeDasharray="3 3" />
        <text x={ZERO} y={M.top - 14} textAnchor="middle" fontSize="10" fill="#57606a">η=0</text>
        <text x={ONE} y={M.top - 14} textAnchor="middle" fontSize="10" fill="#1b1f23">η=1 (necessity/luxury split)</text>
        <text x={x(-0.28)} y={M.top - 14} textAnchor="middle" fontSize="10" fill="#c26b6b">food (OECD)</text>
        <line x1={M.left} x2={W - M.right} y1={H - M.bottom} y2={H - M.bottom} stroke="#d0d7de" />
        {[-0.25, 0, 0.5, 1.0, 1.25].map((v) => (
          <text key={v} x={x(v)} y={H - M.bottom + 16} textAnchor="middle" fontSize="11" fill="#57606a">{v.toFixed(2)}</text>
        ))}
        <text x={(M.left + W - M.right) / 2} y={H - M.bottom + 32} textAnchor="middle" fontSize="12" fill="#57606a">Income elasticity of demand (η) — Working-Leser system, 42 countries</text>
        {cats.map((c, i) => {
          const y = M.top + i * ROW + ROW / 2;
          const barW = entered ? Math.abs(x(c.eta) - ZERO) : 0;
          const barX = c.eta >= 0 ? ZERO : x(c.eta);
          const isHov = hover === c.id;
          return (
            <g key={c.id} onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)}>
              <rect x={barX} y={y - 8} width={barW} height={16} fill={COLORS[c.type]} fillOpacity={isHov ? 0.9 : 0.65}
                style={{ transition: `width 0.6s ease ${i * 55}ms, x 0.6s ease ${i * 55}ms` }} />
              <text x={M.left - 8} y={y + 4} textAnchor="end" fontSize="11.5"
                fill={isHov ? '#1b1f23' : '#57606a'} fontWeight={isHov ? 600 : 400}>{c.label}</text>
              <text x={x(c.eta) + (c.eta >= 0 ? 6 : -6)} y={y + 4} textAnchor={c.eta >= 0 ? 'start' : 'end'} fontSize="11" fontWeight={600}
                fill={COLORS[c.type]} style={{ opacity: entered ? 1 : 0, transition: `opacity 0.3s ease ${i * 55 + 500}ms` }}>
                {c.eta.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#57606a]">
        {(['luxury', 'necessity', 'inferior'] as const).map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3" style={{ background: COLORS[t] }} />
            {t === 'luxury' ? 'Luxury (η > 1): share rises with income' : t === 'necessity' ? 'Necessity (0 < η < 1): grows slower than income' : 'Inferior (η < 0): share falls as income rises (OECD levels)'}
          </span>
        ))}
      </div>
    </div>
  );
}
