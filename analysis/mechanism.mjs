// Phase 1 output: categorized income elasticities from Clements & Chen (2010), 42 OECD countries.
// Formula: eta_i = 1 + beta_i / w_i (Working-Leser demand system)
// Source: Table A (extracted) of Clements & Chen (2010), UWA working paper version.
import fs from 'node:fs';
const dir = new URL('.', import.meta.url);
const cats = [
  {id:'food',         label:'Food & non-alcoholic beverages', w:0.0789, beta:-0.1010},
  {id:'alcohol',      label:'Alcohol & tobacco',               w:0.0356, beta:-0.0073},
  {id:'clothing',     label:'Clothing & footwear',             w:0.0453, beta:-0.0039},
  {id:'housing',      label:'Housing, water, fuels',           w:0.1511, beta:-0.0306},
  {id:'durables',     label:'Durables (furnishings/equip.)',   w:0.0553, beta: 0.0084},
  {id:'health',       label:'Health',                          w:0.1184, beta: 0.0313},
  {id:'transport',    label:'Transport',                       w:0.1099, beta: 0.0090},
  {id:'comm',         label:'Communication',                   w:0.0231, beta:-0.0049},
  {id:'recreation',   label:'Recreation & culture',            w:0.0978, beta: 0.0301},
  {id:'education',    label:'Education',                       w:0.0743, beta:-0.0019},
  {id:'restaurants',  label:'Restaurants & hotels',            w:0.0785, beta: 0.0219},
  {id:'other',        label:'Other goods & services',          w:0.1320, beta: 0.0488},
].map((c) => ({ ...c, eta: +(1 + c.beta / c.w).toFixed(3), type: (1 + c.beta / c.w) > 1 ? 'luxury' : (1 + c.beta / c.w) > 0 ? 'necessity' : 'inferior' }));
const out = {
  source: 'Clements & Chen (2010), 42 OECD countries + emerging markets (Mexico, Korea, Turkey), ~2004 OECD data.',
  formula: 'eta_i = 1 + beta_i / w_i (Working-Leser demand system)',
  caveat: 'Estimates are OECD-weighted; elasticities in lower-income markets differ (education and health tend toward luxury in markets with low public provision). These are cross-sectional, not longitudinal.',
  incomeFlex: -0.7728,
  categories: cats.sort((a,b) => b.eta - a.eta),
};
fs.writeFileSync(new URL('mechanism_elasticities.json', dir), JSON.stringify(out, null, 2));
console.log('category | eta | type');
for (const c of out.categories) console.log(`${c.label.padEnd(35)} | ${c.eta.toFixed(3)} | ${c.type}`);
