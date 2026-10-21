import React from 'react';

export function Callout({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="border-l-[3px] border-obs-border pl-4 py-3 my-6 bg-obs-bg text-obs-fg">
      {title && <h4 className="font-semibold mb-2">{title}</h4>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function EvidenceLabel({ type }: { type: 'OBS' | 'INF' | 'JDG' | 'GAP' }) {
  const labels = {
    OBS: { text: 'OBS', tooltip: 'Observed primary data (e.g. World Bank, filings)' },
    INF: { text: 'INF', tooltip: 'Model inference or computed derivation' },
    JDG: { text: 'JDG', tooltip: 'Analyst judgment or qualitative assessment' },
    GAP: { text: 'GAP', tooltip: 'Data unavailable or omitted' }
  };
  
  return (
    <span 
      title={labels[type].tooltip}
      className="inline-block px-1.5 py-0.5 ml-2 text-[10px] font-bold tracking-wider text-obs-muted border border-obs-border rounded bg-white align-middle cursor-help"
    >
      {type}
    </span>
  );
}
