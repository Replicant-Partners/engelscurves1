export const INFLECTION_POINT = 15000;

export interface MacroData {
  country: string;
  iso3: string;
  gdpPpp: number;
  distanceToInflection: number;
  status: string;
}

export const emergingMarketsData: MacroData[] = [
  { country: "Ethiopia", iso3: "ETH", gdpPpp: 3094, distanceToInflection: 3094 - INFLECTION_POINT, status: "Early Stage" },
  { country: "India", iso3: "IND", gdpPpp: 10039, distanceToInflection: 10039 - INFLECTION_POINT, status: "Accelerating" },
  { country: "Vietnam", iso3: "VNM", gdpPpp: 15457, distanceToInflection: 15457 - INFLECTION_POINT, status: "Inflection Point" },
  { country: "Egypt", iso3: "EGY", gdpPpp: 17265, distanceToInflection: 17265 - INFLECTION_POINT, status: "Consolidating" },
  { country: "Brazil", iso3: "BRA", gdpPpp: 20024, distanceToInflection: 20024 - INFLECTION_POINT, status: "Maturing" },
  { country: "Mexico", iso3: "MEX", gdpPpp: 21911, distanceToInflection: 21911 - INFLECTION_POINT, status: "Advanced Transition" },
  { country: "Argentina", iso3: "ARG", gdpPpp: 27846, distanceToInflection: 27846 - INFLECTION_POINT, status: "Stagnant / Distorted" },
];
