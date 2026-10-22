// Verifies every quote in data/literatureEvidence.ts appears in its corpus chunk.
// Usage: node scripts/verify-citations.mjs <chunks.jsonl>
import fs from 'node:fs';

const chunksPath = process.argv[2];
if (!chunksPath) { console.error('usage: verify-citations.mjs <chunks.jsonl>'); process.exit(64); }

const norm = (s) => s.replace(/(\w)- (\w)/g, '$1$2').replace(/\s+/g, ' ').trim();
const chunks = new Map(
  fs.readFileSync(chunksPath, 'utf8').split('\n').filter(Boolean)
    .map((l) => JSON.parse(l)).map((c) => [c.entity_ref, norm(c.text)])
);

const src = fs.readFileSync(new URL('../data/literatureEvidence.ts', import.meta.url), 'utf8');
const items = [...src.matchAll(/id: (\d+),[\s\S]*?quote:\s*(null|'([^']*)'|\n\s*'([^']*)'),[\s\S]*?chunkRef: (null|'([^']*)')/g)];

let fail = 0, checked = 0;
for (const m of items) {
  const id = m[1], quote = m[3] ?? m[4] ?? null, ref = m[6] ?? null;
  if (quote === null) { console.log(`#${id} GAP (no quote)`); continue; }
  checked++;
  const text = chunks.get(ref);
  if (!text) { console.log(`#${id} FAIL chunk not found: ${ref}`); fail++; continue; }
  const ok = text.includes(norm(quote));
  console.log(`#${id} ${ok ? 'PASS' : 'FAIL'} ${ref.split(':').pop()}`);
  if (!ok) fail++;
}
console.log(`checked=${checked} failed=${fail} items=${items.length}`);
process.exit(fail ? 1 : 0);
