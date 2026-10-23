'use client';
import { useEffect, useRef, useState } from 'react';
import { deep } from '../../data/deepDive';

const W = 860, H = 300, M = { top: 26, right: 120, bottom: 40, left: 50 };
const Y0 = 1955, Y1 = 1992, MAXY = 0.42;
const x = (yr: number) => M.left + ((yr - Y0) / (Y1 - Y0)) * (W - M.left - M.right);
const y = (s: number) => M.top + (1 - s / MAXY) * (H - M.top - M.bottom);

export function JapanChart() {
  const [entered, setEntered] = useState(false);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setEntered(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const pts = deep.japan;
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.year).toFixed(1)},${y(p.share).toFixed(1)}`).join(' ');
  const first = pts[0], last = pts[pts.length - 1];
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto min-w-[640px]" role="img" aria-label="Japan's household food share, 1955 to 1992">
      {[0.1, 0.2, 0.3, 0.4].map((s) => (
        <g key={s}>
          <line x1={M.left} x2={W - M.right} y1={y(s)} y2={y(s)} stroke="#eef0f2" />
          <text x={M.left - 8} y={y(s) + 4} textAnchor="end" fontSize="11" fill="#57606a">{Math.round(s * 100)}%</text>
        </g>
      ))}
      {[1955, 1965, 1975, 1985, 1992].map((yr) => (
        <text key={yr} x={x(yr)} y={H - M.bottom + 18} textAnchor="middle" fontSize="11" fill="#57606a">{yr}</text>
      ))}
      <line x1={M.left} x2={W - M.right} y1={y(0.35)} y2={y(0.35)} stroke="#1b1f23" strokeDasharray="3 3" opacity={0.5} />
      <text x={W - M.right - 6} y={y(0.35) - 6} textAnchor="end" fontSize="10" fill="#57606a">35% line</text>
      <path d={d} fill="none" stroke="#4c78a8" strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={entered ? 0 : 1}
        style={{ transition: 'stroke-dashoffset 1.6s ease 0.2s' }} />
      <circle cx={x(first.year)} cy={y(first.share)} r={4} fill="#1b1f23" />
      <text x={x(first.year) + 8} y={y(first.share) - 8} fontSize="11" fill="#1b1f23" fontWeight={600}>{(first.share * 100).toFixed(1)}% in {first.year}</text>
      <g style={{ opacity: entered ? 1 : 0, transition: 'opacity 0.4s ease 1.8s' }}>
        <circle cx={x(last.year)} cy={y(last.share)} r={4} fill="#1b1f23" />
        <text x={x(last.year) + 8} y={y(last.share) + 4} fontSize="11" fill="#1b1f23" fontWeight={600}>{(last.share * 100).toFixed(1)}% in {last.year}</text>
        <text x={x(last.year) + 8} y={y(last.share) + 18} fontSize="10" fill="#57606a">real spending &times;3.7</text>
      </g>
      <text x={(M.left + W - M.right) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#57606a">Japan, household food share by year (38 annual observations)</text>
    </svg>
  );
}
