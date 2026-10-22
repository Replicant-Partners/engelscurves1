import { story } from '../../data/storyData';

const fmt = (v: number) => `$${v.toLocaleString('en-US')}`;

export function HouseholdBars() {
  const max = story.household[1].income;
  return (
    <div className="space-y-5">
      {story.household.map((h) => (
        <div key={h.income}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold">Income {fmt(h.income)} per person</span>
            <span className="text-[#6e7681]">food {Math.round(h.foodShare * 100)}%</span>
          </div>
          <div className="flex h-10" style={{ width: `${(h.income / max) * 100}%` }}>
            <div className="bg-[#c9d0d8] flex items-center pl-3 text-xs text-[#1b1f23]" style={{ width: `${h.foodShare * 100}%` }}>Food {fmt(h.food)}</div>
            <div className="bg-[#4c78a8] flex items-center pl-3 text-xs text-white" style={{ width: `${(1 - h.foodShare) * 100}%` }}>Everything else {fmt(h.nonFood)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
