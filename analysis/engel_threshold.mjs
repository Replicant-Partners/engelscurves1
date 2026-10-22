// Cross-country Engel curve: household food budget share vs GDP per capita (PPP, constant 2021 int'l $).
// Food shares: Pritchett & Spivack (2013), CGD WP, appendix tables A.1-A.6 (survey means).
// Income: World Bank NY.GDP.PCAP.PP.KD (same series as the dashboard), matched to survey year.
// Usage: node analysis/engel_threshold.mjs
import fs from 'node:fs';

const dir = new URL('.', import.meta.url);
const rows = fs.readFileSync(new URL('food_share_surveys.csv', dir), 'utf8').trim().split('\n').slice(1)
  .map((l) => { const [iso3, country, year, share, table] = l.split(','); return { iso3, country, year, share: +share, table }; });
const wb = JSON.parse(fs.readFileSync(new URL('wb_NY.GDP.PCAP.PP.KD_1990-2011.json', dir), 'utf8'))[1];
const gdp = new Map(wb.filter((d) => d.value != null).map((d) => [`${d.countryiso3code}-${d.date}`, d.value]));

const data = [], unmatched = [];
for (const r of rows) {
  const g = gdp.get(`${r.iso3}-${r.year}`);
  if (g == null) unmatched.push(`${r.country} ${r.year}`); else data.push({ ...r, gdp: g, x: Math.log(g) });
}

const ols = (pts) => {
  const n = pts.length, mx = pts.reduce((s, p) => s + p.x, 0) / n, my = pts.reduce((s, p) => s + p.share, 0) / n;
  let sxx = 0, sxy = 0; for (const p of pts) { sxx += (p.x - mx) ** 2; sxy += (p.x - mx) * (p.share - my); }
  const b = sxy / sxx, a = my - b * mx;
  let ssr = 0, sst = 0; for (const p of pts) { ssr += (p.share - a - b * p.x) ** 2; sst += (p.share - my) ** 2; }
  return { a, b, ssr, r2: 1 - ssr / sst, n };
};
const incomeAt = (f, s) => Math.exp((s - f.a) / f.b);
const shareAt = (f, y) => f.a + f.b * Math.log(y);

const fit = ols(data);

// Deterministic bootstrap (LCG seed 42), 2,000 resamples, percentile 90% intervals.
let seed = 42; const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const B = 2000, boots = { s15: [], y35: [], y30: [], y25: [], b: [] };
for (let i = 0; i < B; i++) {
  const s = Array.from({ length: data.length }, () => data[Math.floor(rnd() * data.length)]);
  const f = ols(s);
  boots.s15.push(shareAt(f, 15000)); boots.y35.push(incomeAt(f, 0.35)); boots.y30.push(incomeAt(f, 0.30)); boots.y25.push(incomeAt(f, 0.25)); boots.b.push(f.b);
}
const ci = (arr) => { const s = [...arr].sort((p, q) => p - q); return [s[Math.floor(0.05 * B)], s[Math.floor(0.95 * B)]]; };

// Structural-break test: one-knot piecewise linear in ln(GDP), knot searched over the 15th-85th percentile.
const xs = data.map((d) => d.x).sort((p, q) => p - q);
const lo = xs[Math.floor(0.15 * xs.length)], hi = xs[Math.floor(0.85 * xs.length)];
const solve3 = (A, v) => { // Gaussian elimination for 3x3
  const M = A.map((r, i) => [...r, v[i]]);
  for (let c = 0; c < 3; c++) { let p = c; for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < 3; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let j = c; j < 4; j++) M[r][j] -= k * M[c][j]; } }
  return M.map((r, i) => r[3] / r[i]);
};
let best = null;
for (let k = lo; k <= hi; k += 0.01) {
  const X = data.map((d) => [1, d.x, Math.max(0, d.x - k)]);
  const XtX = [0, 1, 2].map((i) => [0, 1, 2].map((j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
  const Xty = [0, 1, 2].map((i) => X.reduce((s, r, n) => s + r[i] * data[n].share, 0));
  const beta = solve3(XtX, Xty);
  const ssr = X.reduce((s, r, n) => s + (data[n].share - (beta[0] + beta[1] * r[1] + beta[2] * r[2])) ** 2, 0);
  if (!best || ssr < best.ssr) best = { knot: Math.exp(k), ssr, slopeBelow: beta[1], slopeAbove: beta[1] + beta[2] };
}
const F = ((fit.ssr - best.ssr) / 1) / (best.ssr / (data.length - 3));

const markets = { ETH: 3094.86, IND: 10039.07, PHL: 10747.55, ZAF: 13592.05, IDN: 15091.01, VNM: 15457.34, EGY: 17265.14, COL: 18778.65, BRA: 20024.69, MEX: 21911.92, ARG: 27846.59, TUR: 37300.75 };

const out = {
  n: data.length, unmatched,
  model: 'food_share = a + b * ln(GDP per capita PPP 2021$)',
  a: fit.a, b: fit.b, r2: fit.r2,
  b_ci90: ci(boots.b),
  food_share_at_15000: shareAt(fit, 15000), food_share_at_15000_ci90: ci(boots.s15),
  income_at_share_35: incomeAt(fit, 0.35), income_at_share_35_ci90: ci(boots.y35),
  income_at_share_30: incomeAt(fit, 0.30), income_at_share_30_ci90: ci(boots.y30),
  income_at_share_25: incomeAt(fit, 0.25), income_at_share_25_ci90: ci(boots.y25),
  break_test: { best_knot_gdp: best.knot, slope_below: best.slopeBelow, slope_above: best.slopeAbove, F_vs_linear: F, F_crit_5pct_df1_df82: 3.96 },
  predicted_food_share_2025: Object.fromEntries(Object.entries(markets).map(([k, y]) => [k, +shareAt(fit, y).toFixed(3)])),
  points: data.map((d) => ({ iso3: d.iso3, year: d.year, gdp: Math.round(d.gdp), share: d.share, table: d.table })),
};
fs.writeFileSync(new URL('engel_threshold_results.json', dir), JSON.stringify(out, null, 2));
const { points, ...summary } = out;
console.log(JSON.stringify(summary, null, 2));
