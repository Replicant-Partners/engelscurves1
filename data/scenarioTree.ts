// Scenario tree (idea 4). Forward marginals from scenario_quantify; conditional queries recomputed with lisp_eval
// (scenario_recompute_posteriors returned incorrect values and was not used; issue reported).
export type Provenance = 'data' | 'calibrated' | 'judgment';

export interface ScenarioNode {
  id: string;
  label: string;
  question: string;
  deadline: string;
  probability: number;
  provenance: Provenance;
  basis: string;
  parents?: string[];
}

export const scenarioNodes: ScenarioNode[] = [
  { id: 'E1', label: 'Indonesia exits the Engel transition', question: 'Indonesia\u2019s GDP per capita (PPP, 2021$) in 2028 exceeds the income at which food falls to 35% of spending.', deadline: '2028', probability: 0.225, provenance: 'data',
    basis: '2,000 bootstrap draws of the 85-survey fit applied to the IMF WEO growth path.' },
  { id: 'E2', label: 'Indonesia financial deepening', question: 'Private credit reaches at least 40% of GDP in the 2027 World Bank data (36.4% in 2024).', deadline: '2028', probability: 0.16, provenance: 'data',
    basis: 'Base rate in Singh (2021)\u2019s 20-country panel: 8 of 50 comparable 3-year windows (credit below 45% of GDP and flat or falling).' },
  { id: 'E3', label: 'Shopee FY2026 adjusted EBITDA \u2265 $1.0B', question: 'Sea reports FY2026 Shopee adjusted EBITDA of at least $1.0B.', deadline: 'Mar 2027', probability: 0.643, provenance: 'calibrated',
    basis: 'H1 2026 at $478.6M; needs $521.4M in H2 vs $255.4M in Q2. Outside view 60% blended with a Fermi estimate of 84% (scenario_calibrate).' },
  { id: 'E4', label: 'Shopee FY2028 margin \u2265 1.0% of GMV', question: 'Shopee FY2028 adjusted EBITDA is at least 1.0% of GMV (0.67% in Q2 2026).', deadline: 'Mar 2029', probability: 0.373, provenance: 'judgment', parents: ['E1', 'E3'],
    basis: 'Conditional on E1 and E3: 15% if neither, 25% if E1 only, 45% if E3 only, 60% if both. Analyst judgment.' },
  { id: 'E5', label: 'Monee loan book \u2265 $20B', question: 'Monee loans principal outstanding reaches $20B by end-2028 ($11.1B in Q2 2026).', deadline: 'Mar 2029', probability: 0.582, provenance: 'judgment', parents: ['E2'],
    basis: 'Conditional on E2: 55% without, 75% with deeper Indonesian credit. Requires about 27% a year vs 62.5% YoY in Q2 2026.' },
  { id: 'E6', label: 'Nu ARPAC \u2265 $20', question: 'Nu reports monthly ARPAC of at least $20.0 in Q2 2027 ($17.1 in Q2 2026).', deadline: 'Aug 2027', probability: 0.627, provenance: 'calibrated',
    basis: 'Requires +17% in USD over four quarters vs +37% in the past four. Outside view 50% blended with a Fermi estimate of 84%.' },
];

export const scenarioQueries = [
  { question: 'If Shopee misses $1.0B in FY2026, how likely is a 1.0% margin in FY2028?', answer: 0.1725, prior: 0.373, node: 'E4' },
  { question: 'If Shopee hits $1.0B in FY2026, how likely is a 1.0% margin in FY2028?', answer: 0.484, prior: 0.373, node: 'E4' },
  { question: 'If Shopee reaches a 1.0% margin in FY2028, how likely is it that FY2026 hit $1.0B?', answer: 0.835, prior: 0.643, node: 'E3' },
  { question: 'If Shopee reaches a 1.0% margin in FY2028, how likely is it that Indonesia exited the transition?', answer: 0.287, prior: 0.225, node: 'E1' },
  { question: 'If the Monee book reaches $20B, how likely is it that Indonesian credit deepened?', answer: 0.206, prior: 0.16, node: 'E2' },
];
