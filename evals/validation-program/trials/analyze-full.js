#!/usr/bin/env node
// Analyze the Phase 2 full run (PROTOCOL.md): parse every run's transcript, score first and final
// delegations against labels.json, compute the registered endpoints, and print the aggregate report.
// Node built-ins only.
//
// Setups: A = no text, no plugin; B = text only; C = plugin only; D = both. The case key (outside the
// repo) maps c01..c40 to task and condition; arm "with" is the plugin arm.
//
// Usage:
//   node analyze-full.js collect <batch-dir>...                 copy kept transcripts out of %TEMP%
//   node analyze-full.js clean <batch-dir> --since <iso-time>   delete the claude-eval-* temp dirs the batch made
//   node analyze-full.js parse <batch-dir>... --json rows.json  parse runs, write rows, print a short check
//   node analyze-full.js report <rows.json>... [--json out.json] print the Markdown aggregate report
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const KEY_PATH = path.join(process.env.VALIDATION_DATA || (() => { throw new Error('VALIDATION_DATA is not set; point it at the private data directory'); })(), 'trials-full', 'key.json');
const LABELS = JSON.parse(fs.readFileSync(path.join(__dirname, 'labels.json'), 'utf8'));
const TASKS = Object.fromEntries(LABELS.tasks.map((t) => [t.id, t]));
const LEVELS = LABELS.levels; // low < medium < high < xhigh
const TIERS = LABELS.tiers; // haiku < sonnet < opus < fable
const PLUGIN_ROOT = path.resolve(__dirname, '..', '..', '..');
const SESSION_EFFORT = 'xhigh';
const SESSION_MODEL_TIER = 'opus';
const SETUPS = ['A', 'B', 'C', 'D'];
const BOOT = 10000;
const SEED = 20261009;

// ---------------------------------------------------------------- file helpers
const readJsonl = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((l) => l.trim()).map((l) => {
  try { return JSON.parse(l); } catch (e) { return null; }
}).filter(Boolean);

function walk(dir, keep, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, keep, out);
    else if (keep(p)) out.push(p);
  }
  return out;
}

const loadKey = () => JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

// ---------------------------------------------------------------- run discovery
function loadRuns(batchDir) {
  const agg = JSON.parse(fs.readFileSync(path.join(batchDir, 'aggregate-result.json'), 'utf8'));
  const key = loadKey().cases;
  const runs = [];
  for (const c of agg.cases) {
    const k = key[c.name];
    if (!k) throw new Error(`case ${c.name} is not in the key`);
    for (const armName of ['with', 'without']) {
      (c.arms[armName] || []).forEach((r, i) => {
        runs.push({ batchDir, batch: path.basename(batchDir), case: c.name, caseDir: c.dir, task: k.task, text: k.text,
          arm: armName, idx: i, setup: k.arms[armName], rec: r });
      });
    }
  }
  return { agg, runs };
}

const runSubdir = (run) => path.join(run.batchDir, 'runs', run.case, `${run.arm}-${run.idx}`);
const tempRootOf = (tracePath) => path.dirname(path.dirname(tracePath));

function collect(batchDir) {
  const { runs } = loadRuns(batchDir);
  let copied = 0;
  for (const run of runs) {
    const tp = run.rec.tracePath;
    if (!tp || !fs.existsSync(tp)) { console.error(`missing trace: ${run.case} ${run.arm}-${run.idx}`); continue; }
    const tempRoot = tempRootOf(tp);
    const dest = runSubdir(run);
    // Only transcript/metadata files; never the agent-writable workspace or the .claude.json config.
    const files = [path.join(tempRoot, 'out', 'trace.jsonl'),
      ...walk(path.join(tempRoot, 'config', 'projects'), (p) => /\.(jsonl|json)$/.test(p)),
      ...walk(path.join(tempRoot, 'config', 'plugins', 'data'), (p) => /ledger.*\.jsonl$/.test(p))];
    for (const f of files) {
      const rel = path.relative(tempRoot, f);
      fs.mkdirSync(path.dirname(path.join(dest, rel)), { recursive: true });
      fs.copyFileSync(f, path.join(dest, rel));
      copied++;
    }
  }
  console.log(`collected ${copied} files for ${runs.length} runs into ${path.join(batchDir, 'runs')}`);
}

// Delete only claude-eval-* directories directly under the temp dir that were created at or after
// --since. Every candidate is checked by name and creation time; anything else is left alone.
function clean(batchDir, since) {
  const t0 = Date.parse(since);
  if (Number.isNaN(t0)) throw new Error('clean needs --since <iso time>');
  const tmp = os.tmpdir();
  let deleted = 0; const skipped = [];
  for (const e of fs.readdirSync(tmp, { withFileTypes: true })) {
    if (!e.isDirectory() || !/^claude-eval-/.test(e.name)) continue;
    const p = path.join(tmp, e.name);
    const born = fs.statSync(p).birthtimeMs;
    if (born < t0 - 2000) { skipped.push(`${e.name} (created before ${since})`); continue; }
    try { fs.rmSync(p, { recursive: true, force: true }); deleted++; } catch (err) { skipped.push(`${e.name} (${err.code || err.message})`); }
  }
  console.log(`deleted ${deleted} claude-eval-* temp dirs created since ${since}; left ${skipped.length}${skipped.length ? `: ${skipped.join('; ')}` : ''}`);
}

// ---------------------------------------------------------------- literal-blanked workflow parsing
// Copied from hooks/agent-model-gate.js (the gate runs on import, so it cannot be required): same-length
// blanking of string literals and comments, so an index found in the blanked text addresses the original.
function blankLiterals(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') {
      let j = src.indexOf('\n', i);
      if (j < 0) j = n;
      out += ' '.repeat(j - i);
      i = j;
    } else if (c === '/' && d === '*') {
      let j = src.indexOf('*/', i + 2);
      j = j < 0 ? n : j + 2;
      out += ' '.repeat(j - i);
      i = j;
    } else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n && src[j] !== c) {
        if (src[j] === String.fromCharCode(92)) j++;
        else if (c !== '`' && src[j] === '\n') break;
        j++;
      }
      j = Math.min(j + 1, n);
      out += ' '.repeat(j - i);
      i = j;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

const tierOf = (model) => {
  if (model === null || model === undefined || model === '') return 'omitted';
  const s = String(model).toLowerCase();
  if (s === 'inherit') return SESSION_MODEL_TIER;
  for (const t of TIERS) if (s.includes(t)) return t;
  return 'other';
};

// Index of the ")" matching the "(" at `open`, scanning literal-blanked text.
function closeParen(blank, open) {
  let depth = 0;
  for (let i = open; i < blank.length; i++) {
    if (blank[i] === '(') depth++;
    else if (blank[i] === ')') { depth--; if (depth === 0) return i; }
  }
  return blank.length - 1;
}

// Read a `key:` option inside one call's argument span. Returns {kind, value}: kind is literal (a quoted
// string in the call), const (an identifier bound once to a string literal), binding (found in an options
// object the call passes by name), expr (anything else), or absent.
function readOption(src, blank, spanStart, spanEnd, key) {
  const spanB = blank.slice(spanStart, spanEnd + 1);
  const m = new RegExp(String.raw`\b${key}\s*:`).exec(spanB);
  if (m) return readValueAt(src, spanStart + m.index + m[0].length);
  // Options passed as a named object: agent(prompt, OPTS). Look the object up and read the key there.
  const idents = [...spanB.matchAll(/[(,]\s*([A-Za-z_$][\w$]*)\s*(?=[,)])/g)].map((x) => x[1]);
  for (const name of idents) {
    const d = new RegExp(String.raw`\b(?:const|let|var)\s+${name}\s*=\s*\{`).exec(blank);
    if (!d) continue;
    const open = d.index + d[0].length - 1;
    let depth = 0; let end = blank.length - 1;
    for (let i = open; i < blank.length; i++) {
      if (blank[i] === '{') depth++;
      else if (blank[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    const km = new RegExp(String.raw`\b${key}\s*:`).exec(blank.slice(open, end + 1));
    if (km) { const v = readValueAt(src, open + km.index + km[0].length); return { kind: 'binding', value: v.value }; }
  }
  return { kind: 'absent', value: null };
}

function readValueAt(src, p) {
  while (p < src.length && /\s/.test(src[p])) p++;
  const ch = src[p];
  if (ch === '"' || ch === "'" || ch === '`') {
    let j = p + 1;
    while (j < src.length && src[j] !== ch) { if (src[j] === String.fromCharCode(92)) j++; j++; }
    return { kind: 'literal', value: src.slice(p + 1, j) };
  }
  const id = /^[A-Za-z_$][\w$]*/.exec(src.slice(p, p + 80));
  if (id) {
    const b = new RegExp(String.raw`\b(?:const|let|var)\s+${id[0].replace(/\$/g, '[$]')}\s*=\s*(['"` + '`' + String.raw`])([^'"` + '`' + String.raw`]*)\1`).exec(src);
    if (b) return { kind: 'const', value: b[2] };
  }
  return { kind: 'expr', value: src.slice(p, p + 30).replace(/\s+/g, ' ') };
}

// Every agent() call site in the script, in source order, with its model and effort literals.
function parseWorkflowScript(src) {
  const blank = blankLiterals(src);
  const re = /\bagent\s*\(/g;
  const sites = [];
  let m;
  while ((m = re.exec(blank))) {
    const open = m.index + m[0].length - 1;
    const end = closeParen(blank, open);
    sites.push({
      pos: m.index,
      model: readOption(src, blank, open, end, 'model'),
      effort: readOption(src, blank, open, end, 'effort'),
    });
  }
  return sites;
}

// ---------------------------------------------------------------- transcript parsing
const resultText = (b) => (typeof b.content === 'string' ? b.content
  : Array.isArray(b.content) ? b.content.map((x) => x.text || '').join('\n') : '');
// A hook denial reaches the transcript as a tool_result that begins `PreToolUse:<Tool> hook error`. Matching the
// phrase alone is wrong: subagent reports about the gate quote it (batch 1 had such false positives).
const DENY_RE = /^[ \t\r\n]*PreToolUse:[A-Za-z]+ hook error[^]*(no explicit model|without an explicit model)/i;

function parseRun(run) {
  const base = runSubdir(run);
  const collected = path.join(base, 'out', 'trace.jsonl');
  const tracePath = fs.existsSync(collected) ? collected : run.rec.tracePath;
  const out = { ok: false, delegations: [], allCalls: [], skills: [], workers: [], resultMsg: null, sessionEffort: {}, init: null };
  if (!tracePath || !fs.existsSync(tracePath)) { out.err = 'no trace'; return out; }
  const msgs = readJsonl(tracePath);
  const results = new Map();
  for (const m of msgs) {
    if (m.type === 'user' && Array.isArray(m.message && m.message.content)) {
      for (const b of m.message.content) if (b.type === 'tool_result') results.set(b.tool_use_id, b);
    }
    if (m.type === 'result') out.resultMsg = m;
    if (m.type === 'system' && m.subtype === 'init') out.init = { model: m.model, version: m.claude_code_version, tools: m.tools };
  }
  for (const m of msgs) {
    if (m.type !== 'assistant' || !Array.isArray(m.message && m.message.content)) continue;
    const nested = !!m.parent_tool_use_id;
    for (const b of m.message.content) {
      if (b.type !== 'tool_use') continue;
      const inp = b.input || {};
      if (b.name === 'Skill' && !nested) out.skills.push(inp.skill);
      const isAgent = b.name === 'Agent' || b.name === 'Task';
      if (!isAgent && b.name !== 'Workflow') continue;
      const res = results.get(b.id);
      const text = res ? resultText(res) : '';
      const rec = { id: b.id, nested, kind: isAgent ? 'agent' : 'workflow', inputJson: JSON.stringify(inp),
        denied: DENY_RE.test(text), resultHead: text.slice(0, 160).replace(/\s+/g, ' ') };
      if (isAgent) {
        rec.hasModelKey = Object.prototype.hasOwnProperty.call(inp, 'model');
        rec.model = inp.model === undefined ? null : inp.model;
        rec.effort = inp.effort === undefined ? null : inp.effort;
        rec.subagentType = inp.subagent_type || null;
      } else {
        let src = inp.script;
        if (!src && inp.scriptPath && fs.existsSync(inp.scriptPath)) src = fs.readFileSync(inp.scriptPath, 'utf8');
        rec.scriptAvailable = !!src;
        rec.sites = src ? parseWorkflowScript(src) : [];
        rec.scriptChars = src ? src.length : 0;
      }
      out.allCalls.push(rec);
      if (!nested) out.delegations.push(rec);
    }
  }
  // Session effort: the top-level session transcript stamps `effort` and `perTurnEffort` on each assistant turn.
  const sessionFiles = walk(path.join(base, 'config', 'projects'), (p) => p.endsWith('.jsonl') && !p.includes(`${path.sep}subagents${path.sep}`) && !/workflow/i.test(p));
  for (const f of sessionFiles) {
    for (const x of readJsonl(f)) {
      if (x.type !== 'assistant' || x.isSidechain) continue;
      const e = x.effort === undefined ? 'none' : x.effort;
      out.sessionEffort[e] = (out.sessionEffort[e] || 0) + 1;
    }
  }
  for (const meta of walk(base, (p) => p.endsWith('.meta.json'))) {
    let md; try { md = JSON.parse(fs.readFileSync(meta, 'utf8')); } catch (e) { continue; }
    const jl = meta.replace(/\.meta\.json$/, '.jsonl');
    let resolved = null;
    if (fs.existsSync(jl)) {
      const set = new Set(readJsonl(jl).filter((x) => x.type === 'assistant' && x.message && x.message.model).map((x) => x.message.model));
      resolved = [...set].join(',') || null;
    }
    out.workers.push({ toolUseId: md.toolUseId, requested: md.model || null, effort: md.effort || null, agentType: md.agentType, resolved });
  }
  out.ok = true;
  return out;
}

// ---------------------------------------------------------------- scoring against labels
const lvl = (e) => LEVELS.indexOf(e);
const trank = (t) => TIERS.indexOf(t);

// Effort status of effort `e` for the model tier `t` under option list `opts`: in | below | above | none (no band).
function effortStatus(opts, t, e) {
  const own = opts.find((o) => o.model === t);
  const bands = own ? [own] : opts;
  if (bands.every((o) => !o.efforts)) return 'none';
  const set = [...new Set(bands.flatMap((o) => o.efforts || []))];
  if (set.includes(e)) return 'in';
  return lvl(e) < Math.min(...set.map(lvl)) ? 'below' : 'above';
}

// One call site/agent call -> {tier, named, effort, effortNamed}
function describeAgentCall(c) {
  const named = typeof c.model === 'string' && c.model.length > 0;
  const tier = named ? tierOf(c.model) : SESSION_MODEL_TIER;
  const effort = c.effort === null ? SESSION_EFFORT : String(c.effort).toLowerCase();
  return { tier, named, effort, effortNamed: c.effort !== null };
}
function describeSite(s) {
  const named = s.model.kind !== 'absent';
  const resolved = s.model.kind === 'literal' || s.model.kind === 'const' || s.model.kind === 'binding';
  const tier = !named ? SESSION_MODEL_TIER : (resolved ? tierOf(s.model.value) : 'unresolved');
  const effortNamed = s.effort.kind !== 'absent';
  const effort = !effortNamed ? SESSION_EFFORT : String(s.effort.value).toLowerCase();
  return { tier, named, effort, effortNamed };
}

// Score one delegation against the task label.
function scoreDelegation(task, d) {
  const T = TASKS[task];
  const base = { kind: d.kind, denied: d.denied, nested: d.nested };
  if (d.kind === 'agent' && !T.options) {
    // A workflow task answered with a plain Agent call: the label needs the Workflow launch, so no match.
    const x = describeAgentCall(d);
    return { ...base, tier: x.tier, effort: x.effort, named: x.named, effortNamed: x.effortNamed, modelAgree: false, effortAgree: false, effortStatus: 'none', over: false, under: false };
  }
  if (d.kind === 'agent') {
    const x = describeAgentCall(d);
    const st = effortStatus(T.options, x.tier, x.effort);
    const tiers = T.options.map((o) => trank(o.model));
    return { ...base, tier: x.tier, effort: x.effort, named: x.named, effortNamed: x.effortNamed,
      modelAgree: T.options.some((o) => o.model === x.tier),
      effortStatus: st, effortAgree: st === 'in',
      over: trank(x.tier) > Math.max(...tiers), under: trank(x.tier) >= 0 && trank(x.tier) < Math.min(...tiers) };
  }
  // Workflow launch. Role rule (mechanical): the call site that appears last in the script text is the
  // verifier/merger (the call made after the fan-out); every earlier site is a fan-out call.
  const xs = d.sites.map(describeSite);
  const roles = xs.map((x, i) => ({ ...x, role: i === xs.length - 1 ? 'gate' : 'fanout' }));
  // An agent-label task answered with a Workflow launch: every call site is scored against the single option list.
  const okRoles = T.roles ? xs.length >= 2 : xs.length >= 1;
  const allNamed = xs.length >= 1 && xs.every((x) => x.named);
  const optsFor = (r) => (T.roles ? T.roles[r] : T.options);
  const modelAgree = okRoles && allNamed && roles.every((x) => optsFor(x.role).some((o) => o.model === x.tier));
  const statuses = roles.map((x) => effortStatus(optsFor(x.role), x.tier, x.effort));
  const effortAgree = okRoles && roles.every((x, i) => x.effortNamed && (statuses[i] === 'in' || statuses[i] === 'none') && optsFor(x.role).some((o) => o.model === x.tier));
  const mx = (r) => Math.max(...optsFor(r).map((o) => trank(o.model)));
  const mn = (r) => Math.min(...optsFor(r).map((o) => trank(o.model)));
  return { ...base, sites: roles.map((x) => `${x.role}:${x.named ? x.tier : 'omitted'}@${x.effortNamed ? x.effort : 'omitted'}`),
    nSites: xs.length, scriptAvailable: d.scriptAvailable, unresolved: xs.some((x) => x.tier === 'unresolved'),
    named: xs.length >= 1 && allNamed, effortNamed: xs.length >= 1 && xs.every((x) => x.effortNamed),
    tier: roles.length ? roles[roles.length - 1].tier : null,
    modelAgree, effortAgree,
    effortStatus: effortAgree ? 'in' : (statuses.includes('above') ? 'above' : (statuses.includes('below') ? 'below' : 'omitted-or-other')),
    over: okRoles && roles.some((x) => trank(x.tier) > mx(x.role)),
    under: okRoles && roles.some((x) => trank(x.tier) >= 0 && trank(x.tier) < mn(x.role)) };
}

// Parse the case's grader files (tool_used) and evaluate them against every call in the transcript, for the
// grader cross-check. Counts every call: nested worker calls and hook-denied calls included.
function readGraders(caseDir) {
  const dir = path.join(caseDir, 'graders');
  const res = {};
  if (!fs.existsSync(dir)) return res;
  for (const f of fs.readdirSync(dir)) {
    const fm = {};
    for (const line of fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/)) {
      const m = /^([\w_]+):\s*(.*)$/.exec(line);
      if (!m) continue;
      let v = m[2];
      if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
      fm[m[1]] = v;
    }
    res[f.replace(/\.md$/, '')] = fm;
  }
  return res;
}
function predictGrader(g, allCalls) {
  const toolNames = g.tool === 'Agent' ? ['agent'] : ['workflow'];
  const re = g.input_match ? new RegExp(g.input_match) : null;
  const n = allCalls.filter((c) => toolNames.includes(c.kind) && (!re || re.test(c.inputJson))).length;
  const min = g.min === undefined ? 1 : Number(g.min);
  const max = g.max === undefined ? Infinity : Number(g.max);
  return n >= min && n <= max;
}

function summarizeRun(run) {
  const p = parseRun(run);
  const rec = run.rec;
  const ds = p.delegations;
  const score = (d) => (d ? scoreDelegation(run.task, d) : null);
  const first = ds[0] || null;
  const allowed = ds.filter((d) => !d.denied);
  const final = allowed.length ? allowed[allowed.length - 1] : null;
  const mu = (p.resultMsg && p.resultMsg.modelUsage) || {};
  const gr = {};
  for (const g of rec.graders || []) gr[g.name] = g.passed;
  const gdefs = readGraders(path.resolve(PLUGIN_ROOT, run.caseDir || ''));
  const pred = {};
  for (const [name, g] of Object.entries(gdefs)) pred[name] = predictGrader(g, p.allCalls);
  return {
    batch: run.batch, case: run.case, task: run.task, text: run.text, arm: run.arm, idx: run.idx, setup: run.setup,
    error: rec.error || null, parsed: p.ok,
    delegates: !!first, nDelegations: ds.length, nDenied: ds.filter((d) => d.denied).length, nNested: p.allCalls.filter((c) => c.nested).length, nNestedDenied: p.allCalls.filter((c) => c.nested && c.denied).length,
    first: score(first), final: score(final),
    firstSites: first && first.kind === 'workflow' ? first.sites.map((s) => ({ model: s.model, effort: s.effort })) : null,
    firstHead: first ? first.resultHead : null,
    skillDT: p.skills.some((s) => /delegation-tiering/.test(s || '')),
    sessionEffort: p.sessionEffort, initModel: p.init && p.init.model, version: p.init && p.init.version,
    workers: p.workers, costUsd: rec.costUsd, modelCost: Object.fromEntries(Object.entries(mu).map(([k, v]) => [k, v.costUSD])),
    models: Object.keys(mu), turns: rec.turns, graders: gr, graderPred: pred,
  };
}

// ---------------------------------------------------------------- statistics
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const median = (a) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const pctile = (sorted, q) => { const i = (sorted.length - 1) * q; const lo = Math.floor(i); const hi = Math.ceil(i); return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo); };

// Exact two-sided sign-flip permutation test on paired differences: enumerate all 2^n sign assignments,
// p = share with |sum| >= |observed sum| (tolerance for float noise).
function signFlipExact(d) {
  const n = d.length;
  const obs = Math.abs(d.reduce((a, b) => a + b, 0));
  let ge = 0;
  const total = 2 ** n;
  for (let mask = 0; mask < total; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += (mask >> i) & 1 ? d[i] : -d[i];
    if (Math.abs(s) >= obs - 1e-9) ge++;
  }
  return { n, obsSum: d.reduce((a, b) => a + b, 0), p: ge / total, assignments: total };
}
function bootstrapMean(x, seed = SEED) {
  const rnd = mulberry32(seed);
  const n = x.length; const ms = [];
  for (let b = 0; b < BOOT; b++) { let s = 0; for (let i = 0; i < n; i++) s += x[Math.floor(rnd() * n)]; ms.push(s / n); }
  ms.sort((a, b) => a - b);
  return [pctile(ms, 0.025), pctile(ms, 0.975)];
}
function holm(ps) {
  const idx = ps.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0]);
  const adj = new Array(ps.length); let run = 0;
  idx.forEach(([p, i], k) => { run = Math.max(run, Math.min(1, (ps.length - k) * p)); adj[i] = run; });
  return adj;
}

// ---------------------------------------------------------------- aggregation
// By default a run with a harness error (here: the 900 s timeout) is excluded from every denominator;
// --include-errored keeps errored runs that left a parseable transcript (a sensitivity check).
let INCLUDE_ERRORED = false;
const valid = (r) => r.parsed && (INCLUDE_ERRORED ? r.delegates || !r.error : !r.error);
const share = (rs, f) => (rs.length ? rs.filter(f).length / rs.length : NaN);
// Per-task run shares for a setup: non-delegating runs count as 0 (non-match); errored runs are excluded.
function taskShares(rows, setup, f) {
  const out = {};
  for (const t of Object.keys(TASKS)) {
    const rs = rows.filter((r) => r.setup === setup && r.task === t && valid(r));
    out[t] = { n: rs.length, v: rs.length ? rs.filter(f).length / rs.length : null };
  }
  return out;
}
function contrast(rows, s1, s0, f) {
  const a = taskShares(rows, s1, f); const b = taskShares(rows, s0, f);
  const tasks = Object.keys(TASKS).filter((t) => a[t].v !== null && b[t].v !== null);
  const d = tasks.map((t) => a[t].v - b[t].v);
  const test = signFlipExact(d);
  const ci = bootstrapMean(d);
  return { s1, s0, tasks, diffs: Object.fromEntries(tasks.map((t, i) => [t, d[i]])), mean: mean(d), ci, p: test.p, nTasks: d.length,
    shares1: Object.fromEntries(tasks.map((t) => [t, a[t].v])), shares0: Object.fromEntries(tasks.map((t) => [t, b[t].v])) };
}

const F = {
  modelAgree: (r) => !!(r.first && r.first.modelAgree),
  named: (r) => !!(r.first && r.first.named),
  effortAgree: (r) => !!(r.first && r.first.effortAgree),
  effortNamed: (r) => !!(r.first && r.first.effortNamed),
  over: (r) => !!(r.first && r.first.over),
  under: (r) => !!(r.first && r.first.under),
  delegates: (r) => r.delegates,
  denied: (r) => r.nDenied > 0,
  skillDT: (r) => r.skillDT,
};

const fmt = (x, d = 3) => (x === null || x === undefined || Number.isNaN(x) ? 'n/a' : x.toFixed(d));
const fmtP = (p) => (p < 0.0001 ? '<0.0001' : p.toFixed(4));
const usd = (x) => (Number.isNaN(x) ? 'n/a' : `$${x.toFixed(3)}`);
const sgn = (x) => (x >= 0 ? `+${x.toFixed(3)}` : x.toFixed(3));

function analyze(rows) {
  const R = { endpoints: {}, secondary: [], descriptive: {} };
  R.endpoints.e1 = contrast(rows, 'D', 'B', F.modelAgree);
  R.endpoints.e2 = contrast(rows, 'B', 'A', F.named);
  // Secondary family. Contrasts are fixed here (the protocol names the family, not every contrast):
  // effort agreement D vs B; model agreement C vs B; over- and under-provisioning and delegation rate for
  // the two plugin contrasts D vs B and C vs A; gate denials D vs C (the only setups with a gate); Skill
  // invocation D vs C (the only setups with the skill).
  const sec = [
    ['effort agreement, D vs B', 'D', 'B', F.effortAgree],
    ['model agreement, C vs B', 'C', 'B', F.modelAgree],
    ['over-provisioning, D vs B', 'D', 'B', F.over], ['over-provisioning, C vs A', 'C', 'A', F.over],
    ['under-provisioning, D vs B', 'D', 'B', F.under], ['under-provisioning, C vs A', 'C', 'A', F.under],
    ['gate denials, D vs C', 'D', 'C', F.denied],
    ['Skill invocation, D vs C', 'D', 'C', F.skillDT],
    ['delegation rate, D vs B', 'D', 'B', F.delegates], ['delegation rate, C vs A', 'C', 'A', F.delegates],
  ];
  const cs = sec.map(([name, a, b, f]) => ({ name, ...contrast(rows, a, b, f) }));
  const adj = holm(cs.map((c) => c.p));
  R.secondary = cs.map((c, i) => ({ name: c.name, mean: c.mean, ci: c.ci, p: c.p, pHolm: adj[i], nTasks: c.nTasks }));
  // Decision rule (applied literally to endpoint 1).
  const e = R.endpoints.e1; const sig = e.p < 0.05;
  let rule;
  if (sig && e.mean > 0) rule = 'The plugin transmits doctrine the text does not (endpoint 1 significant and positive)';
  else if (sig && e.mean < 0) rule = 'The plugin moves choices away from its labels (endpoint 1 significant and negative)';
  else if (e.ci[0] >= -0.15 && e.ci[1] <= 0.15) rule = 'No material difference (endpoint 1 not significant, 95% interval within -0.15 to +0.15)';
  else rule = 'Inconclusive (endpoint 1 not significant, 95% interval reaches past +/-0.15)';
  R.decision = { rule, significant: sig, drivers: Object.entries(e.diffs).filter(([, v]) => v !== 0).sort((a, b) => b[1] - a[1]).map(([t, v]) => `${t} ${sgn(v)}`) };
  return R;
}

// ---------------------------------------------------------------- report
function report(rows, jsonOut) {
  const L = [];
  const R = analyze(rows);
  const names = { A: 'A nothing', B: 'B text only', C: 'C plugin only', D: 'D both' };
  const sessions = rows.length; const errors = rows.filter((r) => !valid(r));
  L.push('## Run counts', '');
  L.push('| Setup | sessions | errors | delegated | non-delegating | gate-denied runs | Skill invoked (delegation-tiering) |', '|---|---|---|---|---|---|---|');
  for (const s of SETUPS) {
    const all = rows.filter((r) => r.setup === s); const v = all.filter(valid);
    L.push(`| ${names[s]} | ${all.length} | ${all.length - v.length} | ${v.filter((r) => r.delegates).length}/${v.length} | ${v.filter((r) => !r.delegates).length} | ${v.filter((r) => r.nDenied > 0).length} | ${v.filter((r) => r.skillDT).length} |`);
  }
  L.push('', `Total sessions ${sessions}; errored ${errors.length}.`, '');

  const e1 = R.endpoints.e1; const e2 = R.endpoints.e2;
  L.push('## Primary endpoints', '');
  L.push('| Endpoint | tasks | mean difference | 95% bootstrap interval (10,000 resamples over tasks, seed 20261009) | exact two-sided p (sign-flip, 2^n assignments) |', '|---|---|---|---|---|');
  L.push(`| 1. Model agreement, D minus B | ${e1.nTasks} | ${sgn(e1.mean)} | [${sgn(e1.ci[0])}, ${sgn(e1.ci[1])}] | ${fmtP(e1.p)} |`);
  L.push(`| 2. Named-model rate, B minus A | ${e2.nTasks} | ${sgn(e2.mean)} | [${sgn(e2.ci[0])}, ${sgn(e2.ci[1])}] | ${fmtP(e2.p)} |`, '');
  L.push(`Decision rule fired: **${R.decision.rule}**.`, '');
  L.push(`Endpoint 1 per-task differences (D minus B), nonzero only: ${R.decision.drivers.join('; ') || 'none'}.`, '');

  L.push('## Secondary endpoints (Holm-corrected as one family of ' + R.secondary.length + ')', '');
  L.push('| Test | tasks | mean difference | 95% interval | raw p | Holm p |', '|---|---|---|---|---|---|');
  for (const s of R.secondary) L.push(`| ${s.name} | ${s.nTasks} | ${sgn(s.mean)} | [${sgn(s.ci[0])}, ${sgn(s.ci[1])}] | ${fmtP(s.p)} | ${fmtP(s.pHolm)} |`);
  L.push('');

  // Per-setup rates (over all valid sessions; task-balanced means of per-task shares in brackets).
  L.push('## Per-setup rates (first delegation; non-delegating runs count as non-match)', '');
  L.push('| Metric | ' + SETUPS.map((s) => names[s]).join(' | ') + ' |', '|---|' + SETUPS.map(() => '---').join('|') + '|');
  const rateRow = (title, f) => L.push(`| ${title} | ${SETUPS.map((s) => {
    const v = rows.filter((r) => r.setup === s && valid(r));
    const ts = taskShares(rows, s, f); const tm = mean(Object.values(ts).filter((x) => x.v !== null).map((x) => x.v));
    return `${v.filter(f).length}/${v.length} (task mean ${fmt(tm, 2)})`;
  }).join(' | ')} |`);
  rateRow('delegated', F.delegates); rateRow('model agrees with label', F.modelAgree); rateRow('names a model', F.named);
  rateRow('effort agrees', F.effortAgree); rateRow('effort named explicitly', F.effortNamed); rateRow('over-provisioned', F.over); rateRow('under-provisioned', F.under);
  L.push('');
  L.push('Final allowed delegation, model agreement / named (descriptive):', '');
  L.push('| ' + SETUPS.map((s) => names[s]).join(' | ') + ' |', '|' + SETUPS.map(() => '---').join('|') + '|');
  L.push('| ' + SETUPS.map((s) => {
    const v = rows.filter((r) => r.setup === s && valid(r));
    return `${v.filter((r) => r.final && r.final.modelAgree).length}/${v.length} agree; ${v.filter((r) => r.final && r.final.named).length}/${v.length} named`;
  }).join(' | ') + ' |', '');

  // Effort status distribution for delegating runs
  L.push('Effort status of the first delegation (delegating runs): below / in / above / none or other.', '');
  L.push('| ' + SETUPS.map((s) => names[s]).join(' | ') + ' |', '|' + SETUPS.map(() => '---').join('|') + '|');
  L.push('| ' + SETUPS.map((s) => {
    const v = rows.filter((r) => r.setup === s && valid(r) && r.first);
    const c = (k) => v.filter((r) => r.first.effortStatus === k).length;
    return `${c('below')} / ${c('in')} / ${c('above')} / ${v.length - c('below') - c('in') - c('above')}; effort omitted ${v.filter((r) => !r.first.effortNamed).length}`;
  }).join(' | ') + ' |', '');

  // Cost
  L.push('## Cost per session (costUsd list-price estimate; descriptive)', '');
  L.push('| Setup | n | mean | median | 95% bootstrap interval of mean (over tasks) | total |', '|---|---|---|---|---|---|');
  for (const s of SETUPS) {
    const v = rows.filter((r) => r.setup === s && valid(r));
    const c = v.map((r) => r.costUsd);
    const tmeans = Object.keys(TASKS).map((t) => mean(v.filter((r) => r.task === t).map((r) => r.costUsd))).filter((x) => !Number.isNaN(x));
    const ci = tmeans.length ? bootstrapMean(tmeans) : [NaN, NaN];
    L.push(`| ${names[s]} | ${c.length} | ${usd(mean(c))} | ${usd(median(c))} | [${usd(ci[0])}, ${usd(ci[1])}] | ${usd(c.reduce((a, b) => a + b, 0))} |`);
  }
  L.push('', `Total costUsd across these sessions: ${usd(rows.reduce((a, r) => a + (r.costUsd || 0), 0))}.`, '');

  // Per-task tables
  L.push('## Per-task rows', '');
  L.push('Cell format: runs; model-agree/named/delegated counts; first-delegation tier@effort list; mean cost.', '');
  L.push('| Task | label | ' + SETUPS.map((s) => names[s]).join(' | ') + ' |', '|---|---|' + SETUPS.map(() => '---').join('|') + '|');
  for (const t of Object.keys(TASKS)) {
    const T = TASKS[t];
    const lab = T.kind === 'agent' ? T.options.map((o) => `${o.model}@${o.efforts.join('/')}`).join(' or ') : `fanout ${T.roles.fanout.map((o) => o.model + (o.efforts ? '@' + o.efforts.join('/') : '')).join('/')}; gate ${T.roles.gate.map((o) => o.model + (o.efforts ? '@' + o.efforts.join('/') : '')).join('/')}`;
    const cells = SETUPS.map((s) => {
      const v = rows.filter((r) => r.task === t && r.setup === s && valid(r));
      const ch = v.map((r) => (r.first ? (r.first.kind === 'workflow' ? `WF[${r.first.sites.join(',')}]` : `${r.first.named ? r.first.tier : 'omit>' + r.first.tier}@${r.first.effortNamed ? r.first.effort : 'omit>' + r.first.effort}${r.first.denied ? '(denied)' : ''}`) : 'none'));
      return `${v.length}r; ${v.filter(F.modelAgree).length}/${v.filter(F.named).length}/${v.filter(F.delegates).length}; ${ch.join(', ')}; ${usd(mean(v.map((r) => r.costUsd)))}`;
    });
    L.push(`| ${t} | ${lab} | ${cells.join(' | ')} |`);
  }
  L.push('');

  // Tier choice by setup
  L.push('## First-delegation tier by setup (all tasks)', '');
  for (const s of SETUPS) {
    const v = rows.filter((r) => r.setup === s && valid(r));
    const d = {};
    for (const r of v) { const k = r.first ? (r.first.kind === 'workflow' ? 'workflow-launch' : (r.first.named ? r.first.tier : `omitted(${r.first.tier})`)) : 'none'; d[k] = (d[k] || 0) + 1; }
    L.push(`- ${names[s]}: ${Object.entries(d).map(([k, n]) => `${k} ${n}`).join(', ')}`);
  }
  L.push('');
  const wf = rows.filter((r) => r.first && r.first.kind === 'workflow' && valid(r));
  L.push(`Workflow launches as first delegation: ${wf.length}; script unavailable: ${wf.filter((r) => !r.first.scriptAvailable).length}; with an unresolved (non-literal) model expression: ${wf.filter((r) => r.first.unresolved).length}; with fewer than 2 agent() call sites (role rule cannot apply): ${wf.filter((r) => r.first.nSites < 2).length}.`, '');

  // Effort evidence + resolved models + version
  L.push('## Session effort and models (from transcripts)', '');
  const eff = {};
  for (const r of rows.filter(valid)) for (const [k, n] of Object.entries(r.sessionEffort)) eff[k] = (eff[k] || 0) + n;
  L.push(`Orchestrator assistant turns by recorded effort (session transcript \`effort\` field): ${Object.entries(eff).map(([k, n]) => `${k} ${n}`).join(', ') || 'none recorded'}.`, '');
  const ms = {}; for (const r of rows.filter(valid)) for (const m of r.models) ms[m] = (ms[m] || 0) + 1;
  L.push(`Model IDs in modelUsage (sessions containing each): ${Object.entries(ms).map(([k, n]) => `${k} ${n}`).join(', ')}.`);
  L.push(`Orchestrator init models: ${[...new Set(rows.map((r) => r.initModel).filter(Boolean))].join(', ')}; Claude Code versions: ${[...new Set(rows.map((r) => r.version).filter(Boolean))].join(', ')}.`, '');

  // Grader cross-check
  L.push('## Grader cross-check (tool_used verdict vs parser, counting every call incl. nested and denied)', '');
  let comparable = 0; let match = 0; const mism = [];
  for (const r of rows.filter(valid)) {
    for (const [g, pv] of Object.entries(r.graderPred)) {
      if (!(g in r.graders)) continue;
      comparable++;
      if (r.graders[g] === pv) match++; else mism.push(`${r.batch} ${r.case} ${r.arm}-${r.idx} ${g}: grader=${r.graders[g]} parser=${pv}`);
    }
  }
  L.push(`Verdicts compared: ${comparable}; agree: ${match}.`, mism.length ? `Mismatches (${mism.length}):\n${mism.map((m) => `- ${m}`).join('\n')}` : 'No mismatches.', '');
  const nest = rows.filter((r) => r.nNested > 0);
  L.push(`Sessions where a worker made nested delegation calls: ${nest.length}; sessions with a nested call denied by the gate: ${rows.filter((r) => r.nNestedDenied > 0).length} (${SETUPS.map((s) => `${s} ${rows.filter((r) => r.setup === s && r.nNestedDenied > 0).length}`).join(', ')}). Gate denials in the endpoints count orchestrator-level delegations only.`, '');
  const errd = rows.filter((r) => r.error);
  L.push(`Errored runs that had already made a delegation: ${errd.filter((r) => r.delegates).length} of ${errd.length}.`, '');

  L.push('## Errors', '');
  L.push(errors.length ? errors.map((r) => `- ${r.batch} ${r.case} ${r.arm}-${r.idx} (${r.setup}): ${r.error || 'unparsed'}`).join('\n') : 'None.', '');
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(R, null, 1));
  return L.join('\n');
}

// ---------------------------------------------------------------- main
function main() {
  const args = process.argv.slice(2);
  const take = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args.splice(i, 2)[1] : null; };
  const jsonOut = take('--json'); const since = take('--since');
  if (args.includes('--include-errored')) { INCLUDE_ERRORED = true; args.splice(args.indexOf('--include-errored'), 1); }
  const [cmd, ...rest] = args;
  if (cmd === 'collect') { rest.forEach(collect); return; }
  if (cmd === 'clean') { clean(rest[0], since); return; }
  if (cmd === 'parse') {
    const rows = [];
    for (const d of rest) rows.push(...loadRuns(d).runs.map(summarizeRun));
    if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(rows, null, 1));
    for (const r of rows) {
      console.log(JSON.stringify({ case: r.case, task: r.task, setup: r.setup, err: r.error, deleg: r.nDelegations, den: r.nDenied, first: r.first, final: r.final && r.final.tier, eff: r.sessionEffort, cost: r.costUsd && +r.costUsd.toFixed(3), gradersAgree: Object.keys(r.graderPred).every((g) => !(g in r.graders) || r.graders[g] === r.graderPred[g]) }));
    }
    return;
  }
  if (cmd === 'report') {
    const rows = rest.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
    console.log(report(rows, jsonOut));
    return;
  }
  console.error('usage: node analyze-full.js <collect|clean|parse|report> ...');
  process.exit(2);
}

if (require.main === module) main();
module.exports = { parseWorkflowScript, blankLiterals, signFlipExact, bootstrapMean, holm, scoreDelegation, tierOf, effortStatus };
