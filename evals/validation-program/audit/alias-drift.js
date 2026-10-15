'use strict';
// Phase 1b: does a requested model alias resolve to the intended (newest) model?
// Usage: node alias-drift.js [SNAP] [OUT]   (defaults in lib.js)
const fs = require('fs');
const path = require('path');
const { dirs, listTranscripts, readJsonl, readMeta, writeCsv } = require('./lib');

const HAIKU55_RELEASE = '2026-10-07T00:00:00.000Z';  // Haiku 5.5 release date, given by the task brief
// Newest model per family on the pricing page fetched 2026-10-08 (the page gives no release dates).
const PAGE_NEWEST = { fable: 'claude-fable-5-1', opus: 'claude-opus-5-5', sonnet: 'claude-sonnet-5-5', haiku: 'claude-haiku-5-5' };

const { snap, out } = dirs();
const files = listTranscripts(snap);

/** Split a model ID into {family, gen:[numbers]}; null for IDs that are not Claude model IDs. */
function parseModel(id) {
  const m = /^claude-(fable|opus|sonnet|haiku|mythos)-([0-9-]+?)(?:-[0-9]{8})?$/.exec(id || '');
  return m ? { family: m[1], gen: m[2].split('-').map(Number) } : null;
}
function cmpGen(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) { const d = (a[i] || 0) - (b[i] || 0); if (d) return d; }
  return 0;
}

const firstSeen = {};   // model -> earliest timestamp anywhere in the store (proxy for availability; an assumption)
const subs = [];
let badLines = 0;
for (const f of files) {
  const { rows, bad } = readJsonl(f.file);
  badLines += bad;
  let first = null, firstTs = null, version = null;
  for (const r of rows) {
    if (!firstTs && r.timestamp) firstTs = r.timestamp;
    const m = r.message;
    if (r.type === 'assistant' && m && m.model && m.model !== '<synthetic>') {
      if (!firstSeen[m.model] || r.timestamp < firstSeen[m.model]) firstSeen[m.model] = r.timestamp;
      if (!first) { first = m.model; version = r.version || null; }
    }
  }
  if (f.kind === 'main') continue;
  const meta = readMeta(f.metaFile);
  if (!version) { const v = rows.find(r => r.version); version = v ? v.version : '(none)'; }
  subs.push({ kind: f.kind, agentId: f.agentId, alias: meta.model || '(none)', resolved: first || '(no assistant line)', version, start: firstTs || '' });
}

// Newest model of a family whose first observed use is at or before ts.
function newestObserved(family, ts) {
  let best = null;
  for (const [id, t] of Object.entries(firstSeen)) {
    const p = parseModel(id);
    if (!p || p.family !== family || t > ts) continue;
    if (!best || cmpGen(p.gen, best.gen) > 0) best = { id, gen: p.gen };
  }
  return best ? best.id : null;
}

const byDay = {};
const cnt = (o, k) => { o[k] = (o[k] || 0) + 1; };
const cross = {}, haiku = {}, drift = {}, driftPage = {};
let haikuTotal = 0, haiku45 = 0;
const ALIASES = ['fable', 'opus', 'sonnet', 'haiku'];
for (const s of subs) {
  cnt(cross, [s.alias, s.version, s.resolved].join('|'));
  const post = s.start >= HAIKU55_RELEASE;
  if (s.alias === 'haiku' && post) {
    const is45 = /^claude-haiku-4-5/.test(s.resolved);
    haikuTotal++; if (is45) haiku45++;
    const k = s.version; haiku[k] = haiku[k] || { n: 0, haiku45: 0, haiku55: 0, other: 0 };
    haiku[k].n++; haiku[k][is45 ? 'haiku45' : /^claude-haiku-5-5/.test(s.resolved) ? 'haiku55' : 'other']++;
  }
  if (ALIASES.includes(s.alias) && parseModel(s.resolved)) {
    const newest = newestObserved(s.alias, s.start);
    const older = newest && cmpGen(parseModel(s.resolved).gen, parseModel(newest).gen) < 0;
    cnt(drift, [s.alias, s.resolved, newest, older ? 'older' : 'current_or_newer'].join('|'));
    if (post) {
      const pn = PAGE_NEWEST[s.alias];
      cnt(driftPage, [s.alias, s.resolved, pn, cmpGen(parseModel(s.resolved).gen, parseModel(pn).gen) < 0 ? 'older' : 'current_or_newer'].join('|'));
    }
  }
}
const toRows = (o, names) => Object.entries(o).map(([k, n]) => { const p = k.split('|'); const r = {}; names.forEach((c, i) => r[c] = p[i]); r.count = n; return r; })
  .sort((a, b) => names.map(c => String(a[c]).localeCompare(String(b[c]))).find(x => x) || 0);
writeCsv(path.join(out, 'alias_drift_subagents.csv'), subs);
writeCsv(path.join(out, 'alias_drift_crosstab.csv'), toRows(cross, ['alias', 'version', 'resolved']));
writeCsv(path.join(out, 'alias_drift_by_day.csv'), toRows(byDay, ['alias', 'day_utc', 'resolved']));
writeCsv(path.join(out, 'alias_drift_vs_newest_observed.csv'), toRows(drift, ['alias', 'resolved', 'newest_observed_at_start', 'status']));
writeCsv(path.join(out, 'alias_drift_vs_pricing_page_newest_since_2026-10-07.csv'), toRows(driftPage, ['alias', 'resolved', 'page_newest', 'status']));
writeCsv(path.join(out, 'alias_drift_haiku_share_by_version.csv'), Object.entries(haiku).map(([version, v]) => ({ version, requests: v.n, resolved_haiku_4_5: v.haiku45, resolved_haiku_5_5: v.haiku55, resolved_other: v.other, share_haiku_4_5: (v.haiku45 / v.n).toFixed(4) })).sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true })));
writeCsv(path.join(out, 'alias_drift_first_seen_by_model.csv'), Object.entries(firstSeen).map(([model, first_seen]) => ({ model, first_seen })).sort((a, b) => a.first_seen.localeCompare(b.first_seen)));
const summary = { snapshot: snap, subagents: subs.length, badLines, haikuAliasOnOrAfter_2026_10_07: { requests: haikuTotal, resolvedHaiku45: haiku45, share: haikuTotal ? haiku45 / haikuTotal : null, byVersion: haiku },
  firstSeen, pageNewest: PAGE_NEWEST };
fs.writeFileSync(path.join(out, 'alias_drift_summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
const t = rows => rows.map(r => Object.values(r).join('  ')).join('\n');
console.log('\nDRIFT vs newest observed:\n' + t(toRows(drift, ['alias', 'resolved', 'newest', 'status'])));
console.log('\nDRIFT vs pricing page (>=2026-10-07):\n' + t(toRows(driftPage, ['alias', 'resolved', 'page_newest', 'status'])));
