'use client';
import { story } from '../../data/storyData';

const fmt = (v: number) => `$${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export function HouseholdBars() {
  const max = story.household[1].income;
  return (
    <div className="space-y-8">
      {story.household.map((h, idx) => (
        <div key={h.income}>
          <div className="flex justify-between text-[15px] mb-2">
            <span className="font-semibold">Income {fmt(h.income)} per person</span>
            <span className="text-[#57606a]">food share: <strong>{Math.round(h.foodShare * 100)}%</strong></span>
          </div>
          <div className="flex rounded overflow-hidden h-14" style={{ width: `${(h.income / max) * 100}%` }}>
            <div className="bg-[#c9d0d8] flex items-center px-4 text-sm font-medium text-[#1b1f23] whitespace-nowrap"
              style={{ width: `${h.foodShare * 100}%` }}>
              Food {fmt(h.food)}
            </div>
            <div className="bg-[#4c78a8] flex items-center px-4 text-sm font-medium text-white whitespace-nowrap"
              style={{ width: `${(1 - h.foodShare) * 100}%` }}>
              Everything else {fmt(h.nonFood)}
            </div>
          </div>
          {idx === 0 && (
            <div className="text-xs text-[#57606a] mt-1.5">$10k household — food dominates the budget</div>
          )}
          {idx === 1 && (
            <div className="text-xs text-[#57606a] mt-1.5">$20k household — non-food spending more than doubled</div>
          )}
        </div>
      ))}
      <div className="pt-2 border-t border-[#e1e4e8]">
        <p className="text-[14px] leading-[1.7] text-[#1b1f23]">
          <span className="font-mono text-[9px] text-[#57606a] border border-[#d0d7de] rounded px-1 py-px mr-1.5 align-middle">INF</span>
          Non-food spending rises {fmt(story.household[1].nonFood - story.household[0].nonFood)} (+{Math.round((story.household[1].nonFood / story.household[0].nonFood - 1) * 100)}%) while income only doubles. Food share falls {((story.household[0].foodShare - story.household[1].foodShare) * 100).toFixed(1)} percentage points.
        </p>
      </div>
    </div>
  );
}
