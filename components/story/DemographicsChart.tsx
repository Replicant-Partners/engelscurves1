'use client';
import React, { useState, useEffect, useRef } from 'react';

/* ── UN World Population Prospects 2024 — 12 markets ─────────────────────
   Source: UN Population Division, WPP 2024.
   Population in millions. Median age in years.
   2024+ = projections (medium variant).
   ──────────────────────────────────────────────────────────────────────── */

interface Point { year: number; pop: number; medAge: number; }
interface Market {
  iso3: string; name: string; region: string;
  engelPhase: 'pre' | 'transition' | 'post';
  data: Point[];
}

const MARKETS: Market[] = [
  { iso3:'IND', name:'India',       region:'South Asia',          engelPhase:'transition',
    data:[{year:2000,pop:1057,medAge:22.0},{year:2005,pop:1144,medAge:23.5},{year:2010,pop:1234,medAge:25.1},
          {year:2015,pop:1322,medAge:26.8},{year:2020,pop:1407,medAge:28.2},{year:2023,pop:1429,medAge:28.9},
          {year:2030,pop:1509,medAge:31.2},{year:2035,pop:1536,medAge:33.0},{year:2040,pop:1551,medAge:34.2},{year:2045,pop:1543,medAge:35.1}]},
  { iso3:'NGA', name:'Nigeria',     region:'Sub-Saharan Africa',  engelPhase:'pre',
    data:[{year:2000,pop:122,medAge:15.6},{year:2005,pop:139,medAge:16.1},{year:2010,pop:159,medAge:16.7},
          {year:2015,pop:181,medAge:17.2},{year:2020,pop:206,medAge:17.6},{year:2023,pop:224,medAge:17.9},
          {year:2030,pop:274,medAge:18.5},{year:2035,pop:317,medAge:19.1},{year:2040,pop:348,medAge:19.6},{year:2045,pop:377,medAge:20.0}]},
  { iso3:'IDN', name:'Indonesia',   region:'East Asia & Pacific', engelPhase:'transition',
    data:[{year:2000,pop:211,medAge:24.5},{year:2005,pop:225,medAge:26.0},{year:2010,pop:241,medAge:27.6},
          {year:2015,pop:258,medAge:29.3},{year:2020,pop:271,medAge:30.5},{year:2023,pop:277,medAge:31.1},
          {year:2030,pop:295,medAge:33.6},{year:2035,pop:306,medAge:35.6},{year:2040,pop:314,medAge:37.0},{year:2045,pop:318,medAge:37.7}]},
  { iso3:'BRA', name:'Brazil',      region:'Latin America',       engelPhase:'post',
    data:[{year:2000,pop:174,medAge:25.4},{year:2005,pop:184,medAge:27.3},{year:2010,pop:195,medAge:29.3},
          {year:2015,pop:205,medAge:31.4},{year:2020,pop:213,medAge:33.5},{year:2023,pop:216,medAge:34.7},
          {year:2030,pop:220,medAge:37.2},{year:2035,pop:222,medAge:39.2},{year:2040,pop:224,medAge:40.7},{year:2045,pop:226,medAge:41.5}]},
  { iso3:'MEX', name:'Mexico',      region:'Latin America',       engelPhase:'post',
    data:[{year:2000,pop:98,medAge:22.4},{year:2005,pop:106,medAge:24.3},{year:2010,pop:114,medAge:26.2},
          {year:2015,pop:121,medAge:28.3},{year:2020,pop:126,medAge:30.0},{year:2023,pop:129,medAge:30.7},
          {year:2030,pop:134,medAge:33.3},{year:2035,pop:138,medAge:35.5},{year:2040,pop:141,medAge:37.0},{year:2045,pop:144,medAge:38.0}]},
  { iso3:'VNM', name:'Vietnam',     region:'East Asia & Pacific', engelPhase:'transition',
    data:[{year:2000,pop:77,medAge:24.0},{year:2005,pop:82,medAge:26.1},{year:2010,pop:87,medAge:28.2},
          {year:2015,pop:92,medAge:30.0},{year:2020,pop:97,medAge:31.3},{year:2023,pop:98,medAge:31.9},
          {year:2030,pop:101,medAge:34.2},{year:2035,pop:103,medAge:36.6},{year:2040,pop:104,medAge:38.3},{year:2045,pop:104,medAge:39.1}]},
  { iso3:'PHL', name:'Philippines', region:'East Asia & Pacific', engelPhase:'transition',
    data:[{year:2000,pop:76,medAge:20.0},{year:2005,pop:83,medAge:21.3},{year:2010,pop:93,medAge:22.7},
          {year:2015,pop:103,medAge:23.8},{year:2020,pop:112,medAge:24.4},{year:2023,pop:117,medAge:24.9},
          {year:2030,pop:128,medAge:26.8},{year:2035,pop:134,medAge:28.7},{year:2040,pop:140,medAge:30.2},{year:2045,pop:145,medAge:31.2}]},
  { iso3:'ZAF', name:'South Africa',region:'Sub-Saharan Africa',  engelPhase:'transition',
    data:[{year:2000,pop:45,medAge:22.0},{year:2005,pop:47,medAge:23.5},{year:2010,pop:51,medAge:25.0},
          {year:2015,pop:55,medAge:26.5},{year:2020,pop:59,medAge:28.0},{year:2023,pop:60,medAge:29.0},
          {year:2030,pop:64,medAge:31.0},{year:2035,pop:67,medAge:32.5},{year:2040,pop:69,medAge:33.8},{year:2045,pop:70,medAge:35.0}]},
  { iso3:'EGY', name:'Egypt',       region:'MENA',                engelPhase:'transition',
    data:[{year:2000,pop:67,medAge:21.0},{year:2005,pop:74,medAge:22.5},{year:2010,pop:81,medAge:24.0},
          {year:2015,pop:91,medAge:25.2},{year:2020,pop:102,medAge:26.0},{year:2023,pop:106,medAge:26.3},
          {year:2030,pop:118,medAge:28.2},{year:2035,pop:127,medAge:30.0},{year:2040,pop:135,medAge:31.5},{year:2045,pop:141,medAge:32.5}]},
  { iso3:'TUR', name:'Turkiye',     region:'MENA',                engelPhase:'post',
    data:[{year:2000,pop:63,medAge:26.0},{year:2005,pop:68,medAge:27.8},{year:2010,pop:73,medAge:29.5},
          {year:2015,pop:78,medAge:31.3},{year:2020,pop:84,medAge:33.1},{year:2023,pop:85,medAge:33.9},
          {year:2030,pop:89,medAge:36.5},{year:2035,pop:91,medAge:38.5},{year:2040,pop:93,medAge:39.8},{year:2045,pop:95,medAge:40.5}]},
  { iso3:'ARG', name:'Argentina',   region:'Latin America',       engelPhase:'post',
    data:[{year:2000,pop:37,medAge:28.0},{year:2005,pop:39,medAge:29.2},{year:2010,pop:40,medAge:30.4},
          {year:2015,pop:43,medAge:31.5},{year:2020,pop:45,medAge:32.6},{year:2023,pop:46,medAge:33.4},
          {year:2030,pop:48,medAge:35.3},{year:2035,pop:49,medAge:36.8},{year:2040,pop:50,medAge:38.1},{year:2045,pop:51,medAge:38.9}]},
  { iso3:'KEN', name:'Kenya',       region:'Sub-Saharan Africa',  engelPhase:'pre',
    data:[{year:2000,pop:31,medAge:16.0},{year:2005,pop:35,medAge:17.2},{year:2010,pop:41,medAge:18.3},
          {year:2015,pop:47,medAge:19.2},{year:2020,pop:52,medAge:20.1},{year:2023,pop:55,medAge:20.7},
          {year:2030,pop:64,medAge:22.0},{year:2035,pop:72,medAge:23.3},{year:2040,pop:78,medAge:24.4},{year:2045,pop:83,medAge:25.0}]},
];

const YEARS = [2000,2005,2010,2015,2020,2023,2030,2035,2040,2045];
const PHASE_COLOR: Record<string, string> = {
  pre:'#7c5c9e', transition:'#4c78a8', post:'#2c6e49'
};
const REGION_COLOR: Record<string, string> = {
  'South Asia':'#e05c5c', 'Sub-Saharan Africa':'#2c9e6e',
  'East Asia & Pacific':'#4c78a8', 'Latin America':'#e0993c',
  'MENA':'#9e7c2c',
};

/* interpolate between known points */
function interp(market: Market, year: number): Point {
  const pts = market.data;
  if (year <= pts[0].year) return pts[0];
  if (year >= pts[pts.length-1].year) return pts[pts.length-1];
  for (let i = 0; i < pts.length-1; i++) {
    if (year >= pts[i].year && year <= pts[i+1].year) {
      const t = (year - pts[i].year) / (pts[i+1].year - pts[i].year);
      return { year, pop: pts[i].pop + t*(pts[i+1].pop-pts[i].pop),
               medAge: pts[i].medAge + t*(pts[i+1].medAge-pts[i].medAge) };
    }
  }
  return pts[pts.length-1];
}

export function DemographicsChart() {
  const [yearIdx, setYearIdx] = useState(0); // 2000
  const [playing, setPlaying] = useState(false);
  const [hov, setHov] = useState<string | null>(null);
  const [colorBy, setColorBy] = useState<'phase'|'region'>('phase');
  const timer = useRef<ReturnType<typeof setInterval>|null>(null);

  const ANIM_YEARS: number[] = [];
  for (let y = 2000; y <= 2045; y++) ANIM_YEARS.push(y);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setYearIdx(i => { if (i >= ANIM_YEARS.length-1) { setPlaying(false); return ANIM_YEARS.length-1; } return i+1; });
      }, 120);
      return () => { if (timer.current) clearInterval(timer.current); };
    }
  }, [playing]);

  const year = ANIM_YEARS[yearIdx];

  const W = 620; const H = 420;
  const PAD = { t: 28, b: 52, l: 60, r: 24 };
  const iW = W - PAD.l - PAD.r; const iH = H - PAD.t - PAD.b;

  const xMin = 14; const xMax = 43;
  const yMin = 0; const yMax = 1600;

  const xS = (v: number) => PAD.l + (v - xMin) / (xMax - xMin) * iW;
  const yS = (v: number) => PAD.t + iH - (v / yMax) * iH;
  const rS = (pop: number) => Math.max(5, Math.min(35, Math.sqrt(pop) * 0.9));

  const hm = hov ? MARKETS.find(m => m.iso3 === hov) : null;
  const hmPt = hm ? interp(hm, year) : null;

  return (
    <div>
      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:10 }}>
        <button onClick={() => { if(yearIdx>=ANIM_YEARS.length-1) setYearIdx(0); setPlaying(p=>!p); }}
          style={{ padding:'6px 18px', fontWeight:700, fontSize:13, border:'2px solid #1b1f23',
            background:playing?'#1b1f23':'white', color:playing?'white':'#1b1f23', borderRadius:4, cursor:'pointer' }}>
          {playing ? 'Pause' : yearIdx >= ANIM_YEARS.length-1 ? 'Replay' : 'Play'}
        </button>
        <input type="range" min={0} max={ANIM_YEARS.length-1} value={yearIdx}
          onChange={e=>{setPlaying(false);setYearIdx(+e.target.value);}}
          style={{ width:200, accentColor:'#1b1f23' }} />
        <span style={{ fontWeight:700, fontSize:20, color: year>2023?'#57606a':'#1b1f23', minWidth:44 }}>
          {year}{year>2023?'*':''}
        </span>
        <div style={{ display:'flex', gap:6, marginLeft:'auto' }}>
          {(['phase','region'] as const).map(c => (
            <button key={c} onClick={()=>setColorBy(c)}
              style={{ padding:'4px 12px', fontSize:11, borderRadius:4, cursor:'pointer',
                border: colorBy===c?'2px solid #1b1f23':'1px solid #d0d7de',
                background: colorBy===c?'#1b1f23':'#f6f8fa', color:colorBy===c?'#fff':'#1b1f23', fontWeight:colorBy===c?700:400 }}>
              {c==='phase'?'Engel phase':'Region'}
            </button>
          ))}
        </div>
      </div>

      {/* Hover strip */}
      <div style={{ height:34, display:'flex', alignItems:'center', marginBottom:6 }}>
        {hmPt && hm ? (
          <div style={{ display:'flex', gap:20, fontSize:13, alignItems:'center' }}>
            <span style={{ fontWeight:700, color: colorBy==='phase'?PHASE_COLOR[hm.engelPhase]:REGION_COLOR[hm.region] }}>{hm.name}</span>
            <span>Population: <strong>{hmPt.pop.toFixed(0)}M</strong></span>
            <span>Median age: <strong>{hmPt.medAge.toFixed(1)} yrs</strong></span>
            <span style={{ fontSize:11, color:'#8c96a0' }}>Engel: {hm.engelPhase}</span>
          </div>
        ) : <span style={{ color:'#c8ced4', fontSize:11 }}>hover a bubble · press Play to animate 2000→2045</span>}
      </div>

      {/* Chart */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', display:'block', overflow:'visible' }}>
        {/* Watermark year */}
        <text x={xS(28)} y={yS(800)} fontSize={90} fontWeight={700} fill="#1b1f23" opacity={0.05} textAnchor="middle">{year}</text>

        {/* "Transition zone" median age band */}
        <rect x={xS(22)} y={PAD.t} width={xS(35)-xS(22)} height={iH}
          fill="#f0f4f8" opacity={0.5} />
        <text x={xS(28.5)} y={PAD.t+14} fontSize={9} fill="#4c78a8" textAnchor="middle" fontStyle="italic">Engel transition zone (median age 22–35)</text>

        {/* Grid */}
        {[15,20,25,30,35,40].map(v=>(
          <g key={v}>
            <line x1={xS(v)} x2={xS(v)} y1={PAD.t} y2={PAD.t+iH} stroke="#e1e4e8" strokeWidth={0.5}/>
            <text x={xS(v)} y={PAD.t+iH+16} fontSize={10} fill="#57606a" textAnchor="middle">{v}</text>
          </g>
        ))}
        {[200,400,600,800,1000,1200,1400].map(v=>(
          <g key={v}>
            <line x1={PAD.l} x2={PAD.l+iW} y1={yS(v)} y2={yS(v)} stroke="#e1e4e8" strokeWidth={0.5}/>
            <text x={PAD.l-6} y={yS(v)} fontSize={9} fill="#57606a" textAnchor="end" dominantBaseline="central">{v}M</text>
          </g>
        ))}

        {/* Trails (last 10 years) */}
        {MARKETS.map(m => {
          const trailYears = ANIM_YEARS.slice(Math.max(0, yearIdx-10), yearIdx+1);
          if (trailYears.length < 2) return null;
          const pts = trailYears.map(y => interp(m, y));
          const d = pts.map((p,i)=>`${i===0?'M':'L'}${xS(p.medAge).toFixed(1)},${yS(p.pop).toFixed(1)}`).join(' ');
          const color = colorBy==='phase'?PHASE_COLOR[m.engelPhase]:REGION_COLOR[m.region];
          const dim = hov && hov !== m.iso3;
          return <path key={m.iso3} d={d} fill="none" stroke={color} strokeWidth={1.5}
            strokeOpacity={dim?0.1:0.4} style={{ transition:'stroke-opacity 0.15s' }} />;
        })}

        {/* Bubbles */}
        {MARKETS.map(m => {
          const pt = interp(m, year);
          const cx = xS(pt.medAge); const cy = yS(pt.pop);
          const r = rS(pt.pop);
          const color = colorBy==='phase'?PHASE_COLOR[m.engelPhase]:REGION_COLOR[m.region];
          const isHov = hov === m.iso3;
          const dim = hov && !isHov;
          const above = cy < PAD.t + iH/2;
          return (
            <g key={m.iso3} style={{ cursor:'pointer' }}
              onMouseEnter={()=>setHov(m.iso3)} onMouseLeave={()=>setHov(null)}>
              <circle cx={cx} cy={cy} r={isHov?r+3:r}
                fill={color} fillOpacity={dim?0.1:isHov?0.9:0.65}
                stroke={color} strokeWidth={isHov?2:1}
                style={{ transition:'r 0.15s, fill-opacity 0.15s' }} />
              {(!dim || isHov) && (
                <text x={cx} y={above?cy+r+12:cy-r-5} fontSize={isHov?12:10}
                  fontWeight={isHov?700:500} fill={color} textAnchor="middle"
                  opacity={dim?0.2:1} style={{ transition:'opacity 0.15s' }}>
                  {m.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Axes */}
        <text x={PAD.l+iW/2} y={H-6} fontSize={11} fill="#57606a" textAnchor="middle">Median age →</text>
        <text transform={`rotate(-90) translate(${-(PAD.t+iH/2)},${14})`} fontSize={11} fill="#57606a" textAnchor="middle">Population (millions) →</text>
      </svg>

      {/* Legend + note */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginTop:10, fontSize:11, color:'#57606a' }}>
        {colorBy==='phase' ? (
          Object.entries(PHASE_COLOR).map(([k,c])=>(
            <span key={k} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:c, display:'inline-block' }} />
              <span style={{ color:c, fontWeight:600 }}>{k==='pre'?'Pre-transition':k==='transition'?'Transition':'Post-transition'}</span>
            </span>
          ))
        ) : (
          Object.entries(REGION_COLOR).map(([k,c])=>(
            <span key={k} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:10, height:10, borderRadius:'50%', background:c, display:'inline-block' }} />
              {k}
            </span>
          ))
        )}
        <span style={{ color:'#8c96a0', marginLeft:8 }}>Bubble size = population · *2024–2045 = UN projections (medium variant)</span>
      </div>

      <p style={{ fontSize:10, color:'#8c96a0', marginTop:8, lineHeight:1.6 }}>
        Source: UN World Population Prospects 2024, medium variant. Median age and population for 12 tracked markets.
        The shaded band (median age 22–35) corresponds roughly to the Engel transition zone — populations in this band have the largest share of households entering or moving through the food-share decline.
        Bubble size proportional to population (square root scale).
      </p>
    </div>
  );
}
