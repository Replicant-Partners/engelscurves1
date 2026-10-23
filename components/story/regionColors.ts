// Shared muted region palette (CVD-adjusted lightness spread). One source for chapters 1, 2 and 3.
export const REGION_COLORS: Record<string, string> = {
  'East Asia & Pacific': '#4c78a8',
  'Europe & Central Asia': '#699bb3',
  'Latin America & Caribbean': '#d8956b',
  'Middle East, North Africa, Afghanistan & Pakistan': '#857a3e',
  'North America': '#8d7fa8',
  'South Asia': '#c26b6b',
  'Sub-Saharan Africa': '#a9c7a0',
};
export const regionColor = (region: string) => REGION_COLORS[region.trim()] ?? '#9aa4ae';
// The soft band marking the transition zone, shared by every chart that draws it.
export const BAND_FILL = 'rgba(76, 120, 168, 0.08)';
