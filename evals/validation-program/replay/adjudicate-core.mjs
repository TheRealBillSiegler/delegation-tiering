// Pure helpers for blind adjudication: split, blind, pool, score. No I/O.
import { seededShuffle } from './lib.mjs';

const IDENTITY_RE = /\bclaude-[a-z0-9-]+\b|\b(fable|opus|sonnet|haiku)(\s*\d+(\.\d+)?)?\b/gi;

/** Replace model names and IDs with a neutral token so the judge cannot tell the arm. */
export function stripIdentity(text) {
  return String(text).replace(IDENTITY_RE, '[model]');
}

/** Render one structured finding as a single line of text. */
function renderItem(item) {
  if (item == null) return '';
  if (typeof item !== 'object') return String(item);
  return Object.entries(item)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(' | ');
}

/**
 * Split a worker's final output into atomic claimed defects. Structured output:
 * every element of the largest array field. Text: top-level numbered or bulleted
 * items, continuation lines folded in. The caller must hand-check text splits.
 */
export function splitClaims(output) {
  if (!output || output.value == null) return [];
  if (output.kind === 'structured' && typeof output.value === 'object') {
    const arrays = Object.values(output.value).filter(Array.isArray);
    if (!arrays.length) return [renderItem(output.value)];
    const biggest = arrays.reduce((a, b) => (b.length > a.length ? b : a));
    return biggest.map(renderItem).filter(Boolean);
  }
  const items = [];
  for (const line of String(output.value).split('\n')) {
    if (/^(\d+[.)]|[-*])\s+\S/.test(line)) items.push(line.replace(/^(\d+[.)]|[-*])\s+/, ''));
    else if (items.length && /^\s+\S/.test(line)) items[items.length - 1] += ' ' + line.trim();
  }
  return items;
}

/**
 * Pool both arms' claims, shuffle with a seed, label C1..Cn, strip identity.
 * Return { items: [{label, text}], key: {label: arm} }; the key stays sealed from the judge.
 */
export function poolBlind(claimsByArm, seed) {
  const pooled = [];
  for (const [arm, list] of Object.entries(claimsByArm)) for (const text of list) pooled.push({ arm, text });
  const shuffled = seededShuffle(pooled, seed);
  const items = [], key = {};
  shuffled.forEach((c, i) => {
    const label = `C${i + 1}`;
    items.push({ label, text: stripIdentity(c.text) });
    key[label] = c.arm;
  });
  return { items, key };
}

/** Compute per-candidate metrics from the sealed key and the judge's verdict. */
export function score(key, verdict) {
  const byLabel = Object.fromEntries((verdict.claims ?? []).map(c => [c.label, c.verdict]));
  const labels = Object.keys(key);
  const real = new Set(labels.filter(l => byLabel[l] === 'real'));
  const groups = [];
  const grouped = new Set();
  for (const d of verdict.defects ?? []) {
    const members = (d.claims ?? []).filter(l => real.has(l));
    if (!members.length) continue;
    members.forEach(l => grouped.add(l));
    groups.push(members);
  }
  const ungrouped = [...real].filter(l => !grouped.has(l));
  for (const l of ungrouped) groups.push([l]);
  let fableOnly = 0, opusOnly = 0, both = 0;
  for (const g of groups) {
    const arms = new Set(g.map(l => key[l]));
    if (arms.has('fable') && arms.has('opus')) both++;
    else if (arms.has('fable')) fableOnly++;
    else opusOnly++;
  }
  const count = (arm, v) => labels.filter(l => key[l] === arm && byLabel[l] === v).length;
  const unclear = labels.filter(l => byLabel[l] === 'unclear').length;
  return {
    claims: labels.length,
    uniqueReal: groups.length,
    fableOnly, opusOnly, both,
    falseFable: count('fable', 'not_real'),
    falseOpus: count('opus', 'not_real'),
    unclear,
    unclearRate: labels.length ? unclear / labels.length : 0,
    realClaimsUngrouped: ungrouped.length,
    unjudged: labels.filter(l => !(l in byLabel)).length,
  };
}
