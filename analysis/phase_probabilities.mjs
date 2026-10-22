// Idea 1: phase membership and transition-exit timing as probabilities.
// Uncertainty: joint bootstrap of the 85-survey fit (knot = transition start, linear 35% crossing = transition end).
// Levels: World Bank NY.GDP.PCAP.PP.KD 2025 (dashboard series). Paths: IMF WEO NGDPRPPPPC growth ratios 2026-2030 applied to the WB level.
// Sensitivity: measured income overstated by 10% / 20% (direction from Almas 2012; magnitude is NOT from the paper).
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const pts = JSON.parse(fs.readFileSync(new URL('engel_threshold_results.json', dir), 'utf8')).points.map((p) => ({ x: Math.log(p.gdp), y: p.share }));
const weo = Object.fromEntries(JSON.parse(fs.readFileSync(new URL('imf_weo_NGDPRPPPPC_2025_2030.json', dir), 'utf8')).map((d) => [d.iso3, d.y]));
const wb2025 = { ETH: 3094.86, IND: 10039.07, PHL: 10747.55, ZAF: 13592.05, IDN: 15091.01, VNM: 15457.34, EGY: 17265.14, COL: 18778.65, BRA: 20024.69, MEX: 21911.92, ARG: 27846.59, TUR: 37300.75 };
const years = [2025, 2026, 2027, 2028, 2029, 2030];
const path = (iso, scale = 1) => years.map((t) => wb2025[iso] * scale * (weo[iso][String(t)] / weo[iso]['2025']));

const lin = (d) => { const n = d.length, mx = d.reduce((s, p) => s + p.x, 0) / n, my = d.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0, sxy = 0; for (const p of d) { sxx += (p.x - mx) ** 2; sxy += (p.x - mx) * (p.y - my); } const b = sxy / sxx; return { a: my - b * mx, b }; };
const solve3 = (A, v) => { const M = A.map((r, i) => [...r, v[i]]);
  for (let c = 0; c < 3; c++) { let p = c; for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let j = c; j < 4; j++) M[r][j] -= k * M[c][j]; } }
  return M.map((r, i) => r[3] / r[i]); };
const knotOf = (d) => { const xs = d.map((p) => p.x).sort((p, q) => p - q), lo = xs[Math.floor(0.15 * xs.length)], hi = xs[Math.floor(0.85 * xs.length)];
  let best = null; for (let k = lo; k <= hi; k += 0.01) { const X = d.map((p) => [1, p.x, Math.max(0, p.x - k)]);
    const XtX = [0, 1, 2].map((i) => [0, 1, 2].map((j) => X.reduce((s, r) => s + r[i] * r[j], 0))); const Xty = [0, 1, 2].map((i) => X.reduce((s, r, n) => s + r[i] * d[n].y, 0));
    const be = solve3(XtX, Xty); const ssr = X.reduce((s, r, n) => s + (d[n].y - (be[0] + be[1] * r[1] + be[2] * r[2])) ** 2, 0); if (!best || ssr < best.ssr) best = { k, ssr }; }
  return Math.exp(best.k); };

let seed = 2026; const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const B = 2000, draws = [];
for (let i = 0; i < B; i++) { const s = Array.from({ length: pts.length }, () => pts[Math.floor(rnd() * pts.length)]); const f = lin(s); draws.push({ start: knotOf(s), end: Math.exp((0.35 - f.a) / f.b) }); }

const scenarios = { base: 1, overstated10: 1 / 1.1, overstated20: 1 / 1.2 };
const result = { B, method: 'joint bootstrap (seed 2026)', boundaries_ci90: {}, countries: {} };
const q = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s[Math.floor(p * (s.length - 1))]; };
result.boundaries_ci90 = { start: [q(draws.map((d) => d.start), 0.05), q(draws.map((d) => d.start), 0.5), q(draws.map((d) => d.start), 0.95)].map(Math.round),
  end: [q(draws.map((d) => d.end), 0.05), q(draws.map((d) => d.end), 0.5), q(draws.map((d) => d.end), 0.95)].map(Math.round) };

for (const iso of Object.keys(wb2025)) {
  const out = {};
  for (const [name, sc] of Object.entries(scenarios)) {
    const p = path(iso, sc); let pre = 0, tr = 0, post = 0; const exitBy = {}, enterBy = {};
    for (const t of years) { exitBy[t] = 0; enterBy[t] = 0; }
    for (const d of draws) {
      const g = p[0]; if (g < d.start) pre++; else if (g < d.end) tr++; else post++;
      for (let j = 0; j < years.length; j++) { if (p[j] >= d.end) exitBy[years[j]]++; if (p[j] >= d.start) enterBy[years[j]]++; }
    }
    out[name] = { gdp2025: Math.round(p[0]), gdp2030: Math.round(p[5]),
      p_phase_2025: { pre: +(pre / B).toFixed(3), transition: +(tr / B).toFixed(3), post: +(post / B).toFixed(3) },
      p_past_transition_by: Object.fromEntries(years.map((t) => [t, +(exitBy[t] / B).toFixed(3)])),
      p_in_or_past_transition_by: Object.fromEntries(years.map((t) => [t, +(enterBy[t] / B).toFixed(3)])) };
  }
  result.countries[iso] = out;
}
fs.writeFileSync(new URL('phase_probabilities_results.json', dir), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result.boundaries_ci90));
for (const [iso, o] of Object.entries(result.countries)) {
  const b = o.base, s20 = o.overstated20;
  console.log(iso.padEnd(4), String(b.gdp2025).padStart(6), '->', String(b.gdp2030).padStart(6), ' pre/tr/post', JSON.stringify(b.p_phase_2025), ' P(past by 2027,2030)', b.p_past_transition_by[2027], b.p_past_transition_by[2030], ' | -20%: P(past 2030)', s20.p_past_transition_by[2030], 'P(pre 2025)', s20.p_phase_2025.pre);
}
