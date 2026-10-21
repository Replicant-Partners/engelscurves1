export interface FoodElasticityData {
  country: string;
  iso3: string;
  gdpPpp: number;
  foodExpenditurePercent: number;
}

export const globalFoodElasticity: FoodElasticityData[] = [
  { country: "Ethiopia", iso3: "ETH", gdpPpp: 3094, foodExpenditurePercent: 41.5 },
  { country: "India", iso3: "IND", gdpPpp: 10039, foodExpenditurePercent: 29.8 },
  { country: "Vietnam", iso3: "VNM", gdpPpp: 15457, foodExpenditurePercent: 20.2 },
  { country: "Egypt", iso3: "EGY", gdpPpp: 17265, foodExpenditurePercent: 31.0 },
  { country: "Brazil", iso3: "BRA", gdpPpp: 20024, foodExpenditurePercent: 16.3 },
  { country: "Mexico", iso3: "MEX", gdpPpp: 21911, foodExpenditurePercent: 14.8 },
  { country: "Argentina", iso3: "ARG", gdpPpp: 27846, foodExpenditurePercent: 15.2 },
  { country: "United States", iso3: "USA", gdpPpp: 80000, foodExpenditurePercent: 9.8 } // Anchor for advanced economy
];

export interface ScenarioData {
  scenario: string;
  cagr: number;
  targetYear: number;
  yearsToTarget: number;
}

export const indiaScenarios: ScenarioData[] = [
  { scenario: "Bull (8.0% CAGR)", cagr: 0.08, targetYear: 2030, yearsToTarget: 5.22 },
  { scenario: "Base (6.5% CAGR)", cagr: 0.065, targetYear: 2031, yearsToTarget: 6.38 },
  { scenario: "Bear (5.0% CAGR)", cagr: 0.05, targetYear: 2033, yearsToTarget: 8.23 }
];
