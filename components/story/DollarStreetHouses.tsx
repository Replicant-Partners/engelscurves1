'use client';
import { useEffect, useMemo, useState } from 'react';
import { dollarStreet } from '../../data/dollarStreet';

const W = 900, H = 480, LEFT = 50, RIGHT = 20, BOTTOM = 64, TOP = 32;
const MIN = 22, MAX = 17000, BINS = 64;
const xOf = (v: number) => LEFT + ((Math.log(v) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN))) * (W - LEFT - RIGHT);
const ACCENT = '#4c78a8';
const OUR = new Map(dollarStreet.markets.map((m) => [m.c2, m]));

// One house glyph: a small pentagon (roof + body), drawn at (0,0) bottom-left, 10x10.
const HOUSE = 'M0,10 L0,4 L5,0 L10,4 L10,10 Z';

type House = { v: number; c2: string; bin: number; stack: number };

export function DollarStreetHouses() {
  const [selected, setSelected] = useState<string[]>(['in']);
  const [hover, setHover] = useState<House | null>(null);
  const [built, setBuilt] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBuilt(true), 60); return () => clearTimeout(t); }, []);

  const houses = useMemo(() => {
    const counts = new Array(BINS).fill(0);
    return dollarStreet.allFamilies.map((f) => {
      const t = (Math.log(f.v) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN));
      const bin = Math.max(0, Math.min(BINS - 1, Math.floor(t * BINS)));
      return { v: f.v, c2: f.c2, bin, stack: counts[bin]++ };
    });
  }, []);
  const maxStack = useMemo(() => Math.max(...houses.map((h) => h.stack)) + 1, [houses]);
  const size = Math.min(11, (W - LEFT - RIGHT) / BINS - 1.5);
  const sy = Math.min(size + 1, (H - TOP - BOTTOM) / maxStack);

  const toggle = (c2: string) => setSelected((s) => (s.includes(c2) ? s.filter((c) => c !== c2) : [...s, c2]));
  const markets = dollarStreet.markets.filter((m) => m.n > 0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5 text-xs">
        {markets.map((m) => {
          const on = selected.includes(m.c2);
          return (
            <button key={m.c2} onClick={() => toggle(m.c2)}
              className={`border px-2 py-1 transition-colors ${on ? 'bg-[#1b1f23] text-white border-[#1b1f23]' : 'border-[#d0d7de] text-[#57606a] hover:border-[#1b1f23] hover:text-[#1b1f23]'}`}>
              {m.country} <span className={on ? 'text-[#9aa4ae]' : 'text-[#9aa4ae]'}>{m.n}</span>
            </button>
          );
        })}
        <button onClick={() => setSelected([])} className="border border-[#d0d7de] px-2 py-1 text-[#57606a] hover:text-[#1b1f23]">clear</button>
      </div>

      <div className="relative border border-[#d0d7de] overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block min-w-[720px]" role="img"
          aria-label="All Dollar Street families as houses stacked along one street by consumption per adult per month">
          <line x1={LEFT - 6} x2={W - RIGHT} y1={H - BOTTOM + 1} y2={H - BOTTOM + 1} stroke="#1b1f23" strokeWidth={1.2} />
          <line x1={xOf(dollarStreet.kharasMonthly)} x2={xOf(dollarStreet.kharasMonthly)} y1={TOP - 6} y2={H - BOTTOM} stroke="#1b1f23" strokeDasharray="4 3" />
          <text x={xOf(dollarStreet.kharasMonthly) + 5} y={TOP + 4} fontSize="13" fill="#1b1f23">middle-class entry ~${dollarStreet.kharasMonthly}/month ($11/day)</text>
          {houses.map((h, i) => {
            const sel = selected.includes(h.c2);
            const ours = OUR.has(h.c2);
            const x = LEFT + h.bin * ((W - LEFT - RIGHT) / BINS);
            const y = H - BOTTOM - (h.stack + 1) * sy;
            const fill = sel ? ACCENT : ours ? '#8a94a0' : '#d7dce1';
            return (
              <path key={i} d={HOUSE} transform={`translate(${x} ${built ? y : H - BOTTOM - 10}) scale(${size / 10} ${(sy - 0.8) / 10})`}
                fill={fill} stroke="white" strokeWidth={0.6}
                style={{ transition: `transform 0.5s ease ${Math.min(h.bin * 14 + h.stack * 10, 1400)}ms, fill 0.25s ease`, cursor: 'pointer' }}
                onMouseEnter={() => setHover(h)} onMouseLeave={() => setHover(null)} onClick={() => OUR.has(h.c2) && toggle(h.c2)} />
            );
          })}
          {[25, 50, 100, 335, 1000, 3000, 10000].map((v) => (
            <g key={v}>
              <line x1={xOf(v)} x2={xOf(v)} y1={H - BOTTOM + 1} y2={H - BOTTOM + 6} stroke="#9aa4ae" />
              <text x={xOf(v)} y={H - BOTTOM + 20} textAnchor="middle" fontSize="13" fill="#57606a">${v >= 1000 ? `${v / 1000}k` : v}</text>
            </g>
          ))}
          <text x={(LEFT + W - RIGHT) / 2} y={H - 10} textAnchor="middle" fontSize="14" fill="#57606a">Consumption per adult, $/month (PPP, log scale) &mdash; each house is one of the {dollarStreet.usable} documented families</text>
        </svg>
        {hover && (
          <div className="absolute top-2 right-2 bg-white border border-[#d0d7de] px-3 py-2 text-xs leading-relaxed shadow-sm">
            <div className="font-semibold text-sm">{dollarStreet.countryNames[hover.c2] ?? hover.c2}</div>
            <div>${hover.v.toLocaleString('en-US')}/month per adult</div>
            {OUR.has(hover.c2) && (
              <a href={`https://www.gapminder.org/dollar-street?countries=${hover.c2}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 block mt-0.5">visit on Dollar Street &rarr;</a>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#57606a]">
        <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 10 10"><path d={HOUSE} fill={ACCENT} /></svg>selected market</span>
        <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 10 10"><path d={HOUSE} fill="#8a94a0" /></svg>our twelve markets</span>
        <span className="flex items-center gap-1.5"><svg width="12" height="12" viewBox="0 0 10 10"><path d={HOUSE} fill="#d7dce1" /></svg>rest of the street</span>
        {selected.length > 0 && (
          <span>
            Open on Dollar Street:{' '}
            {selected.map((c2, i) => (
              <a key={c2} href={`https://www.gapminder.org/dollar-street?countries=${c2}`} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {dollarStreet.countryNames[c2] ?? c2}{i < selected.length - 1 ? ', ' : ''}
              </a>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
