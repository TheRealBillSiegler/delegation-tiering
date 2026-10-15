'use strict';
// Phase 0b: list-price spend by resolved model, ISO week, and path; fable gate-type split.
// Usage: node spend.js [SNAP] [OUT]   (defaults in lib.js)
const fs = require('fs');
const path = require('path');
const { dirs, listTranscripts, readJsonl, readMeta, isoWeek, writeCsv } = require('./lib');

// USD per MTok, quoted from https://platform.claude.com/docs/en/about-claude/pricing (fetched 2026-10-08).
// [input, cache write 5m, cache write 1h, cache read, output]
const P = {
  'claude-fable-5-1': [10, 12.5, 20, 0.25, 50],
  'claude-fable-5': [10, 12.5, 20, 1, 50],
  'claude-opus-5-5': [4, 5, 8, 0.2, 20],
  'claude-opus-5': [5, 6.25, 10, 0.5, 25],
  'claude-opus-4-8': [5, 6.25, 10, 0.5, 25],
  'claude-opus-4-7': [5, 6.25, 10, 0.5, 25],
  'claude-sonnet-5-5': [2, 2.5, 4, 0.1, 10],
  'claude-sonnet-5': [2, 2.5, 4, 0.2, 10],
  'claude-haiku-5-5': [0.1, 0.125, 0.2, 0.01, 0.5],       // prompts up to 100,000 tokens
  'claude-haiku-5-5:long': [0.5, 0.625, 1, 0.05, 2.5],    // prompts over 100,000 tokens (input+cache read+cache write)
  'claude-haiku-4-5': [1, 1.25, 2, 0.1, 5],
};
/** Map a resolved model ID to its price key (strips a trailing -YYYYMMDD date). */
const priceKey = m => { const k = String(m).replace(/-\d{8}$/, ''); return P[k] ? k : null; };

const { snap, out } = dirs();
const files = listTranscripts(snap);
const order = { main: 0, direct: 1, workflow: 2 }; // dedup attribution prefers main, then direct, then workflow
files.sort((a, b) => order[a.kind] - order[b.kind]);

const seen = new Map();   // dedup key -> response record
let badLines = 0, nFiles = 0, dupCross = 0, dupSame = 0, noKey = 0, usageDiff = 0;
const odd = { speed: {}, geo: {}, stop: 0 };
const workers = [];       // per-subagent summaries
const FIELDS = ['input_tokens', 'output_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens', 'e5m', 'e1h'];

for (const f of files) {
  nFiles++;
  const { rows, bad } = readJsonl(f.file);
  badLines += bad;
  const w = { file: f, firstModel: null, keys: [] };
  for (const r of rows) {
    const m = r.message;
    if (r.type !== 'assistant' || !m || !m.usage) continue;
    const key = m.id || r.requestId;
    if (!key) { noKey++; continue; }
    const u = m.usage, cc = u.cache_creation || {};
    let e5 = cc.ephemeral_5m_input_tokens || 0, e1 = cc.ephemeral_1h_input_tokens || 0;
    const cw = u.cache_creation_input_tokens || 0;
    if (e5 + e1 < cw) e5 += cw - e5 - e1; // untiered remainder priced as 5m writes
    const rec = { input_tokens: u.input_tokens || 0, output_tokens: u.output_tokens || 0,
      cache_creation_input_tokens: cw, cache_read_input_tokens: u.cache_read_input_tokens || 0, e5m: e5, e1h: e1 };
    if (!w.firstModel && m.model) w.firstModel = m.model;
    const prev = seen.get(key);
    if (prev) {
      if (prev.file === f.file) dupSame++; else dupCross++;
      for (const k of FIELDS) { if (rec[k] !== prev.u[k]) { usageDiff++; prev.u[k] = Math.max(prev.u[k], rec[k]); } }
      continue;
    }
    odd.speed[u.speed] = (odd.speed[u.speed] || 0) + 1;
    odd.geo[u.inference_geo] = (odd.geo[u.inference_geo] || 0) + 1;
    seen.set(key, { file: f.file, kind: f.kind, model: m.model || '(none)', ts: r.timestamp, u: rec, key });
    w.keys.push(key);
  }
  if (f.kind !== 'main') {
    const meta = readMeta(f.metaFile);
    let label = meta.description || null, labelSrc = label ? 'meta.description' : null;
    if (!label && meta.workflowPhase) { label = meta.workflowPhase; labelSrc = 'meta.workflowPhase'; }
    let firstUser = null;
    if (!label) {
      for (const r of rows) {
        if (r.type === 'user' && r.message) {
          const c = r.message.content;
          firstUser = typeof c === 'string' ? c : Array.isArray(c) ? c.map(x => x.text || '').join(' ') : '';
          break;
        }
      }
      // A workflow-harness preamble is not a label; anything else: first 200 chars of the first user message.
      if (firstUser && !/^\s*\[Workflow harness/.test(firstUser)) { label = firstUser.slice(0, 200); labelSrc = 'first_user_message[0:200]'; }
    }
    workers.push({ kind: f.kind, agentId: f.agentId, alias: meta.model || '(none)', firstModel: w.firstModel || '(none)',
      label, labelSrc, keys: w.keys });
  }
}

// ---- cost -----------------------------------------------------------------
function cost(rec) {
  let k = priceKey(rec.model);
  if (!k) return null;
  const u = rec.u;
  if (k === 'claude-haiku-5-5' && u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens > 100000) k = 'claude-haiku-5-5:long';
  const p = P[k];
  return (u.input_tokens * p[0] + u.e5m * p[1] + u.e1h * p[2] + u.cache_read_input_tokens * p[3] + u.output_tokens * p[4]) / 1e6;
}
const add = (o, k, v) => { o[k] = (o[k] || 0) + v; };
const tok = {}, byModel = {}, byWeek = {}, byPath = {}, byModelPath = {}, byWeekModel = {}, unpriced = {};
let total = 0, nResp = 0, haikuLong = 0;
for (const rec of seen.values()) {
  nResp++;
  const t = tok[rec.model] = tok[rec.model] || { responses: 0, input: 0, output: 0, cache_write_5m: 0, cache_write_1h: 0, cache_read: 0 };
  t.responses++; t.input += rec.u.input_tokens; t.output += rec.u.output_tokens;
  t.cache_write_5m += rec.u.e5m; t.cache_write_1h += rec.u.e1h; t.cache_read += rec.u.cache_read_input_tokens;
  const c = cost(rec);
  rec.cost = c;
  if (c == null) { add(unpriced, rec.model, 1); continue; }
  if (priceKey(rec.model) === 'claude-haiku-5-5' && c && rec.u.input_tokens + rec.u.cache_read_input_tokens + rec.u.cache_creation_input_tokens > 100000) haikuLong++;
  total += c;
  add(byModel, rec.model, c); add(byPath, rec.kind, c); add(byWeek, isoWeek(rec.ts), c);
  add(byModelPath, rec.model + '|' + rec.kind, c); add(byWeekModel, isoWeek(rec.ts) + '|' + rec.model, c);
}

// ---- fable gate split -------------------------------------------------------
const GATE = /gate|critic|verif|review|check|audit|adjudicat|judge/i;
const gate = { gate: { workers: 0, cost: 0 }, other: { workers: 0, cost: 0 }, unclassified: { workers: 0, cost: 0 } };
const gateBySrc = {}, fableRows = [];
let fableByAliasNotResolved = 0;
for (const w of workers) {
  const resolvedFable = /^claude-fable/.test(w.firstModel);
  if (!resolvedFable && w.alias !== 'fable') continue;
  if (!resolvedFable) fableByAliasNotResolved++;
  let cls = w.label ? (GATE.test(w.label) ? 'gate' : 'other') : 'unclassified';
  const c = w.keys.reduce((s, k) => s + (seen.get(k).cost || 0), 0);
  gate[cls].workers++; gate[cls].cost += c;
  const sk = cls + '|' + (w.labelSrc || 'none'); gateBySrc[sk] = gateBySrc[sk] || { workers: 0, cost: 0 }; gateBySrc[sk].workers++; gateBySrc[sk].cost += c;
  fableRows.push({ kind: w.kind, agentId: w.agentId, alias: w.alias, resolved: w.firstModel, class: cls, label_source: w.labelSrc || '', label: (w.label || '').replace(/\s+/g, ' ').slice(0, 200), cost_usd: c.toFixed(4) });
}

// ---- output ---------------------------------------------------------------
const r4 = x => Number(x.toFixed(4));
const mapRows = (o, names) => Object.entries(o).map(([k, v]) => { const p = k.split('|'); const row = {}; names.forEach((n, i) => row[n] = p[i]); row.cost_usd = r4(v); return row; }).sort((a, b) => String(a[names[0]]).localeCompare(String(b[names[0]])) || b.cost_usd - a.cost_usd);
const wr = (name, rows, cols) => writeCsv(path.join(out, name), rows, cols);
wr('spend_tokens_by_model.csv', Object.entries(tok).map(([model, t]) => ({ model, priced: priceKey(model) ? 'yes' : 'no', ...t })).sort((a, b) => b.output - a.output));
wr('spend_cost_by_model.csv', mapRows(byModel, ['model']), ['model', 'cost_usd']);
wr('spend_cost_by_week.csv', mapRows(byWeek, ['week']), ['week', 'cost_usd']);
wr('spend_cost_by_path.csv', mapRows(byPath, ['path']), ['path', 'cost_usd']);
wr('spend_cost_by_model_path.csv', mapRows(byModelPath, ['model', 'path']), ['model', 'path', 'cost_usd']);
wr('spend_cost_by_week_model.csv', mapRows(byWeekModel, ['week', 'model']), ['week', 'model', 'cost_usd']);
wr('spend_fable_workers.csv', fableRows);
const summary = { snapshot: snap, transcripts: nFiles, badLines, responses: nResp, dupSameFile: dupSame, dupCrossFile: dupCross, dupWithDifferingUsage: usageDiff, noDedupKey: noKey,
  totalListPriceUsd: r4(total), byModel, byPath, unpricedResponsesByModel: unpriced, haiku55LongTierResponses: haikuLong,
  usageSpeedValues: odd.speed, usageInferenceGeoValues: odd.geo, fableGate: gate, fableGateBySource: gateBySrc,
  fableWorkersByAliasOnlyNotResolvedFable: fableByAliasNotResolved, fableWorkerTotal: fableRows.length, gateRegex: String(GATE), prices: P };
fs.writeFileSync(path.join(out, 'spend_summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
