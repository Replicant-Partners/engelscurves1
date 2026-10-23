'use client';
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea, ReferenceLine, Tooltip, LabelList } from 'recharts';
import { engelPoints } from '../../data/engelCrossCountry';
import { story } from '../../data/storyData';

const ACCENT = '#4c78a8';
const pct = (v: number) => `${Math.round(v * 100)}%`;
const usd = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `$${v}`);

export function FoodShareChart({ mode }: { mode: 'law' | 'break' }) {
  const highlights = story.highlights.map((h) => ({ gdp: h.gdp, share: h.share, label: h.label }));
  const autoHighlights = story.autoHighlights.map((h) => ({ gdp: h.gdp, share: h.share, label: h.label }));
  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 28, right: 28, bottom: 36, left: 4 }}>
          <CartesianGrid stroke="#eef0f2" vertical={false} />
          <XAxis type="number" dataKey="gdp" scale="log" domain={[700, 80000]} ticks={[1000, 2000, 5000, 10000, 20000, 50000]}
            tickFormatter={usd} stroke="#57606a" tick={{ fontSize: 12 }} allowDuplicatedCategory={false}
            label={{ value: 'GDP per capita, PPP (2021 international $, log scale)', position: 'bottom', offset: 16, fontSize: 12, fill: '#57606a' }} />
          <YAxis type="number" dataKey="share" domain={[0, 0.8]} ticks={[0, 0.2, 0.4, 0.6, 0.8]} tickFormatter={pct} stroke="#57606a" tick={{ fontSize: 12 }}
            label={{ value: 'Food share of household spending', angle: -90, position: 'insideLeft', offset: 14, fontSize: 12, fill: '#57606a', dy: 90 }} />
          <Tooltip cursor={false} formatter={(v: number, n: string) => (n === 'share' ? pct(v) : usd(Math.round(v)))} labelFormatter={() => ''}
            contentStyle={{ borderRadius: 2, border: '1px solid #d0d7de', fontSize: 12 }} />
          {mode === 'break' && (
            <>
              <ReferenceArea x1={story.bounds.start} x2={story.bounds.end} fill="#f2f4f7" fillOpacity={1} />
              <ReferenceLine x={story.bounds.start} stroke="#1b1f23" strokeDasharray="3 3"
                label={{ value: `Shift begins ~${usd(story.bounds.start)}`, position: 'top', fontSize: 11, fill: '#1b1f23' }} />
              <ReferenceLine x={story.bounds.end} stroke="#1b1f23" strokeDasharray="3 3"
                label={{ value: `Food reaches 35% ~${usd(story.bounds.end)}`, position: 'top', fontSize: 11, fill: '#1b1f23' }} />
            </>
          )}
          <Scatter data={engelPoints} fill={mode === 'law' ? '#9aa4ae' : '#8a94a0'} shape="circle" isAnimationActive={false} />
          {mode === 'law' && (
            <Scatter data={highlights} fill={ACCENT} shape="circle" isAnimationActive={false}>
              <LabelList dataKey="label" position="top" style={{ fontSize: 11, fill: '#1b1f23' }} />
            </Scatter>
          )}
          {mode === 'law' && (
            <Scatter data={autoHighlights} fill="#57606a" shape="circle" isAnimationActive={false}>
              <LabelList dataKey="label" position="bottom" style={{ fontSize: 10, fill: '#57606a' }} />
            </Scatter>
          )}
          {mode === 'break' && (
            <Line data={story.piecewiseLine} dataKey="share" type="linear" stroke={ACCENT} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
