// Robustness of the cross-country Engel break: knot bootstrap, points per segment, exclusions.
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const all = JSON.parse(fs.readFileSync(new URL('engel_threshold_results.json', dir), 'utf8')).points
  .map((p) => ({ ...p, x: Math.log(p.gdp) }));

const ols = (pts) => { const n = pts.length, mx = pts.reduce((s, p) => s + p.x, 0) / n, my = pts.reduce((s, p) => s + p.share, 0) / n;
  let sxx = 0, sxy = 0; for (const p of pts) { sxx += (p.x - mx) ** 2; sxy += (p.x - mx) * (p.share - my); }
  const b = sxy / sxx, a = my - b * mx; const ssr = pts.reduce((s, p) => s + (p.share - a - b * p.x) ** 2, 0); return { a, b, ssr }; };
const solve3 = (A, v) => { const M = A.map((r, i) => [...r, v[i]]);
  for (let c = 0; c < 3; c++) { let p = c; for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let j = c; j < 4; j++) M[r][j] -= k * M[c][j]; } }
  return M.map((r, i) => r[3] / r[i]); };
const piecewise = (data) => {
  const xs = data.map((d) => d.x).sort((p, q) => p - q), lo = xs[Math.floor(0.15 * xs.length)], hi = xs[Math.floor(0.85 * xs.length)];
  let best = null;
  for (let k = lo; k <= hi; k += 0.01) {
    const X = data.map((d) => [1, d.x, Math.max(0, d.x - k)]);
    const XtX = [0, 1, 2].map((i) => [0, 1, 2].map((j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
    const Xty = [0, 1, 2].map((i) => X.reduce((s, r, n) => s + r[i] * data[n].share, 0));
    const be = solve3(XtX, Xty); const ssr = X.reduce((s, r, n) => s + (data[n].share - (be[0] + be[1] * r[1] + be[2] * r[2])) ** 2, 0);
    if (!best || ssr < best.ssr) best = { knot: Math.exp(k), ssr, below: be[1], above: be[1] + be[2] };
  }
  const lin = ols(data); best.F = (lin.ssr - best.ssr) / (best.ssr / (data.length - 3)); best.n = data.length;
  best.n_below = data.filter((d) => d.gdp < best.knot).length; best.lin = lin; return best;
};
const summarize = (label, data) => { const p = piecewise(data);
  const y35 = Math.exp((0.35 - p.lin.a) / p.lin.b), s15 = p.lin.a + p.lin.b * Math.log(15000);
  return { label, n: p.n, knot: Math.round(p.knot), n_below_knot: p.n_below, slope_below: +p.below.toFixed(3), slope_above: +p.above.toFixed(3), supF: +p.F.toFixed(1), linear_share_at_15k: +s15.toFixed(3), linear_income_at_35pct: Math.round(y35) }; };

const out = [];
out.push(summarize('all', all));
out.push(summarize('excl BRA-2008, PAK-2010, PHL-2009 (definition issues)', all.filter((d) => !['BRA-2008', 'PAK-2010', 'PHL-2009'].includes(`${d.iso3}-${d.year}`))));
out.push(summarize('one observation per country (latest)', Object.values(all.reduce((m, d) => ((!m[d.iso3] || d.year > m[d.iso3].year) ? (m[d.iso3] = d, m) : m), {}))));
out.push(summarize('excl LSMS table A.1', all.filter((d) => d.table !== 'A.1')));
out.push(summarize('excl ILO tables A.4a/A.4b', all.filter((d) => !d.table.startsWith('A.4'))));

// Knot bootstrap (seed 7, 1,000 resamples).
let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const knots = []; for (let i = 0; i < 1000; i++) knots.push(piecewise(Array.from({ length: all.length }, () => all[Math.floor(rnd() * all.length)])).knot);
knots.sort((p, q) => p - q);
const below = all.filter((d) => d.gdp < 6566).sort((p, q) => p.gdp - q.gdp).map((d) => `${d.iso3}${d.year}:${d.share}@${d.gdp}`);
const res = { variants: out, knot_bootstrap_90ci: [Math.round(knots[50]), Math.round(knots[950])], knot_bootstrap_median: Math.round(knots[500]), points_below_6566: below,
  note: 'supF is the max F over a searched knot; compare with Andrews (1993) sup-F 5% critical value of about 8.85 for one break with 15% trimming, not the fixed-point F(1,n-3) value.' };
fs.writeFileSync(new URL('engel_robustness_results.json', dir), JSON.stringify(res, null, 2));
console.log(JSON.stringify(res, null, 2));
