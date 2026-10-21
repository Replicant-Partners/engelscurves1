export interface CompanyReport {
  id: string;
  ticker: string;
  name: string;
  country: string;
  gorillaScore: number;
  gorillaVerdict: string;
  thesis: string;
  date: string;
}

export const initialLibraryReports: CompanyReport[] = [
  {
    id: "rep_nu_2026",
    ticker: "NU",
    name: "Nu Holdings Ltd.",
    country: "Brazil",
    gorillaScore: 88,
    gorillaVerdict: "GORILLA",
    thesis: "Digital-first disruption of the Brazilian banking oligopoly. Extreme customer acquisition efficiency scaling across the mature/advanced transition points of LatAm.",
    date: "2026-10-21"
  },
  {
    id: "rep_meli_2026",
    ticker: "MELI",
    name: "MercadoLibre Inc.",
    country: "Argentina (LatAm Focus)",
    gorillaScore: 85,
    gorillaVerdict: "GORILLA",
    thesis: "Unmatched logistics and fintech ecosystem moats in Latin America, capturing the shift to discretionary and service-based consumption across Mexico and Brazil.",
    date: "2026-10-18"
  },
  {
    id: "rep_hdb_2026",
    ticker: "HDB",
    name: "HDFC Bank Ltd.",
    country: "India",
    gorillaScore: 82,
    gorillaVerdict: "GORILLA",
    thesis: "Premium proxy for India's macroeconomic inflection. Dominant scale in private banking ready to capture the upcoming explosion in middle-class credit demand.",
    date: "2026-10-15"
  }
];
