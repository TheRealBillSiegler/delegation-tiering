// Token-usage sizing proxy from the archived Fable workers in the frame.
// Usage: node sizing.mjs
// Dedupes assistant usage by message id (a turn's blocks repeat it). Prints
// medians and quartiles only; USD needs a verified price table and is not computed.
import fs from 'node:fs';
import path from 'node:path';
import { readJsonl } from './lib.mjs';
import { SNAP, DATA } from './paths.mjs';

const frame = fs.readFileSync(path.join(DATA, 'frame.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const exam = JSON.parse(fs.readFileSync(path.join(DATA, 'examine.json'), 'utf8'));
const examined = new Set(exam.results.map(x => x.id));

function usage(file) {
  const seen = new Map();
  for (const o of readJsonl(file)) {
    if (o.type !== 'assistant' || !o.message?.usage) continue;
    seen.set(o.message.id ?? o.uuid, o.message.usage);
  }
  let input = 0, cacheWrite = 0, cacheRead = 0, output = 0;
  for (const u of seen.values()) {
    input += u.input_tokens ?? 0; cacheWrite += u.cache_creation_input_tokens ?? 0;
    cacheRead += u.cache_read_input_tokens ?? 0; output += u.output_tokens ?? 0;
  }
  const lines = readJsonl(file);
  const ms = Date.parse(lines.at(-1)?.timestamp) - Date.parse(lines.find(o => o.timestamp)?.timestamp);
  return { turns: seen.size, input, cacheWrite, cacheRead, output, wallMin: ms / 60000 };
}

const q = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[Math.floor(p * (s.length - 1))] : null; };
const summarize = rows => Object.fromEntries(['turns', 'input', 'cacheWrite', 'cacheRead', 'output', 'wallMin'].map(k => {
  const v = rows.map(r => r[k]).filter(Number.isFinite);
  return [k, { p25: q(v, 0.25), median: q(v, 0.5), p75: q(v, 0.75) }];
}));

const all = frame.map(r => ({ id: r.id, ...usage(path.join(SNAP, r.transcript)) }));
console.log(JSON.stringify({
  frame: { n: all.length, ...summarize(all) },
  examined: { n: examined.size, ...summarize(all.filter(r => examined.has(r.id))) },
}, null, 2));
