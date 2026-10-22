import { engelStats } from './engelCrossCountry';

// GDP per capita, PPP (constant 2021 int'l $), World Bank NY.GDP.PCAP.PP.KD, 2025.
const markets = [
  { id: 'ETH', country: 'Ethiopia', gdpPPP: 3094.86, year: 2025 },
  { id: 'IND', country: 'India', gdpPPP: 10039.07, year: 2025 },
  { id: 'PHL', country: 'Philippines', gdpPPP: 10747.55, year: 2025 },
  { id: 'ZAF', country: 'South Africa', gdpPPP: 13592.05, year: 2025 },
  { id: 'IDN', country: 'Indonesia', gdpPPP: 15091.01, year: 2025 },
  { id: 'VNM', country: 'Vietnam', gdpPPP: 15457.34, year: 2025 },
  { id: 'EGY', country: 'Egypt', gdpPPP: 17265.14, year: 2025 },
  { id: 'COL', country: 'Colombia', gdpPPP: 18778.65, year: 2025 },
  { id: 'BRA', country: 'Brazil', gdpPPP: 20024.69, year: 2025 },
  { id: 'MEX', country: 'Mexico', gdpPPP: 21911.92, year: 2025 },
  { id: 'ARG', country: 'Argentina', gdpPPP: 27846.59, year: 2025 },
  { id: 'TUR', country: 'Turkiye', gdpPPP: 37300.75, year: 2025 },
];

// Phase boundaries come from the cross-country Engel analysis (analysis/engel_threshold.mjs):
// the break where the food share starts falling, and the income where it reaches 35%.
export const PHASE_BOUNDS = {
  transitionStart: engelStats.knot,
  transitionStartCi: engelStats.knotCi,
  transitionEnd: engelStats.incomeAt35,
  transitionEndCi: engelStats.incomeAt35Ci,
};

export type Phase = 'Pre-inflection' | 'Transition' | 'Post-inflection';

const phaseOf = (gdp: number): Phase =>
  gdp < PHASE_BOUNDS.transitionStart ? 'Pre-inflection' : gdp < PHASE_BOUNDS.transitionEnd ? 'Transition' : 'Post-inflection';

const nearBoundary = (gdp: number) =>
  (gdp >= PHASE_BOUNDS.transitionStartCi[0] && gdp <= PHASE_BOUNDS.transitionStartCi[1]) ||
  (gdp >= PHASE_BOUNDS.transitionEndCi[0] && gdp <= PHASE_BOUNDS.transitionEndCi[1]);

export const emergingMarketsData = markets.map((m) => ({
  ...m,
  predictedFoodShare: engelStats.a + engelStats.b * Math.log(m.gdpPPP),
  phase: phaseOf(m.gdpPPP),
  nearBoundary: nearBoundary(m.gdpPPP),
}));
