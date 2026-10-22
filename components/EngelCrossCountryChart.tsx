'use client';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { engelPoints, engelLinearFit, engelStats } from '../data/engelCrossCountry';

const fitSeries = engelLinearFit.map((p) => ({ gdp: p.gdp, share: p.fit }));

export function EngelCrossCountryChart() {
  return (
    <div className="h-[380px] w-full border border-[#d0d7de] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 24, right: 24, bottom: 24, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
          <XAxis
            type="number" dataKey="gdp" name="GDP per capita (PPP)" scale="log" domain={[800, 70000]}
            ticks={[1000, 2000, 5000, 10000, 15000, 30000, 60000]}
            tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`} stroke="#1b1f23" tick={{ fontSize: 12 }}
            label={{ value: 'GDP per capita, PPP (constant 2021 int\u2019l $, log scale)', position: 'bottom', offset: 4, fontSize: 12, fill: '#6e7681' }}
          />
          <YAxis
            type="number" dataKey="share" name="Food share" domain={[0, 0.8]} tickFormatter={(v) => `${Math.round(v * 100)}%`}
            stroke="#1b1f23" tick={{ fontSize: 12 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value: number, name: string) => (name === 'Food share' ? `${(value * 100).toFixed(1)}%` : `$${Math.round(value).toLocaleString()}`)}
            labelFormatter={() => ''}
            contentStyle={{ borderRadius: '2px', border: '1px solid #d0d7de', fontSize: '12px' }}
          />
          <ReferenceLine x={engelStats.knot} stroke="#6e7681" strokeDasharray="4 4"
            label={{ value: `Estimated break ~$${(engelStats.knot / 1000).toFixed(1)}k`, position: 'top', fontSize: 11, fill: '#6e7681' }} />
          <ReferenceLine x={engelStats.incomeAt35} stroke="#6e7681" strokeDasharray="4 4"
            label={{ value: `Food 35% ~$${(engelStats.incomeAt35 / 1000).toFixed(1)}k`, position: 'insideTopRight', fontSize: 11, fill: '#6e7681' }} />
          <ReferenceLine x={15000} stroke="#d0d7de" label={{ value: 'former $15k', position: 'insideBottomRight', fontSize: 10, fill: '#6e7681' }} />
          <Scatter name="Survey" data={engelPoints} fill="#1b1f23" fillOpacity={0.55} shape="circle" />
          <Scatter name="Linear fit" data={fitSeries} line={{ stroke: '#6e7681', strokeWidth: 1.5 }} shape={() => <g />} legendType="none" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
