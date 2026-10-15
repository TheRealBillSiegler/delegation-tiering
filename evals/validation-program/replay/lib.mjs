// Shared helpers for the Phase 3 replay pilot. Contains no transcript content.
import fs from 'node:fs';
import path from 'node:path';


/** Return a seeded PRNG (mulberry32) producing floats in [0, 1). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Shuffle a copy of arr with a Fisher-Yates pass driven by the seeded PRNG. */
export function seededShuffle(arr, seed) {
  const rand = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Walk dir recursively and yield every file path whose basename matches re. */
export function* walk(dir, re) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p, re);
    else if (re.test(e.name)) yield p;
  }
}

/** Parse a JSONL file into an array of objects, skipping malformed lines. */
export function readJsonl(file) {
  const out = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { out.push(JSON.parse(line)); } catch { /* skip */ }
  }
  return out;
}

/** Return the plain text of a message content field (string or block array). */
export function contentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.filter(b => b && b.type === 'text').map(b => b.text).join('\n');
}

/**
 * Return the replay prompt: the consecutive user text turns before the first
 * assistant turn, joined verbatim. Workflow workers receive the relayed user
 * request and the computed task as two such turns.
 */
export function initialPrompt(lines) {
  const parts = [];
  for (const o of lines) {
    if (o.type === 'assistant') break;
    if (o.type === 'user' && o.message && !o.isMeta) {
      const c = o.message.content;
      if (Array.isArray(c) && c.some(b => b.type === 'tool_result')) break;
      const t = contentText(c);
      if (t) parts.push(t);
    }
  }
  return parts;
}

/** Return every tool_use block from assistant turns, in order. */
export function toolUses(lines) {
  const out = [];
  for (const o of lines) {
    if (o.type !== 'assistant' || !o.message || !Array.isArray(o.message.content)) continue;
    for (const b of o.message.content) if (b.type === 'tool_use') out.push(b);
  }
  return out;
}

/**
 * Return the worker's final output: the last StructuredOutput tool input if
 * any, else the text of the last assistant turn that carries text.
 */
export function finalOutput(lines) {
  const uses = toolUses(lines).filter(b => b.name === 'StructuredOutput');
  if (uses.length) return { kind: 'structured', value: uses[uses.length - 1].input };
  for (let i = lines.length - 1; i >= 0; i--) {
    const o = lines[i];
    if (o.type === 'assistant' && o.message) {
      const t = contentText(o.message.content);
      if (t.trim()) return { kind: 'text', value: t };
    }
  }
  return { kind: 'none', value: null };
}

/** Return the first non-null value of field across lines. */
export function firstField(lines, field) {
  for (const o of lines) if (o[field] != null) return o[field];
  return null;
}

/** Return the set of resolved model IDs on assistant turns. */
export function resolvedModels(lines) {
  const s = new Set();
  for (const o of lines) if (o.type === 'assistant' && o.message && o.message.model) s.add(o.message.model);
  return [...s];
}

export function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}
