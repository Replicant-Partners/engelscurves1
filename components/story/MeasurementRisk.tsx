'use client';
import { story } from '../../data/storyData';

const markets = ['EGY', 'VNM', 'IDN'] as const;
const scen = [
  { key: 'pExit2030', label: 'Incomes as measured' },
  { key: 'pExit2030Overstated10', label: 'Overstated by 10%' },
  { key: 'pExit2030Overstated20', label: 'Overstated by 20%' },
] as const;
const shades = ['#4c78a8', '#8fa9c8', '#c9d4e2'];

export function MeasurementRisk() {
  const rows = story.tracks.filter((t) => (markets as readonly string[]).includes(t.iso3)).sort((a, b) => b.pExit2030 - a.pExit2030);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 text-xs text-[#57606a]">
        {scen.map((s, i) => (
          <span key={s.key} className="flex items-center gap-1.5"><span className="inline-block w-3 h-3" style={{ background: shades[i] }} />{s.label}</span>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.iso3}>
          <div className="text-sm font-semibold mb-1.5">{r.country}</div>
          <div className="space-y-1">
            {scen.map((s, i) => {
              const v = r[s.key];
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div className="h-4" style={{ width: `${Math.max(v * 100, 0.5)}%`, background: shades[i] }} />
                  <span className="text-xs font-mono text-[#1b1f23]">{Math.round(v * 100)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
