#!/usr/bin/env node
// Analyze Phase 2 pilot results: parse per-run session transcripts from one or more
// `claude plugin eval --json` result directories and report per-setup (A-D) rates with exact
// Clopper-Pearson 95% CIs, cost, tier distributions, per-task rows, and a grader cross-check.
//
// Setups: A = no words, no plugin; B = words only; C = plugin only; D = both.
// A case named <task>-nowords has arms with=C, without=A; <task>-words has with=D, without=B.
//
// Usage:
//   node analyze-pilot.js collect <result-dir>...   copy kept transcripts into <result-dir>/runs/
//   node analyze-pilot.js report  <result-dir>...   print the Markdown report (--json <file> writes raw rows)
// Node built-ins only.
'use strict';
const fs = require('fs');
const path = require('path');

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

// ---------------------------------------------------------------- run discovery
const SETUP = { 'nowords/with': 'C', 'nowords/without': 'A', 'words/with': 'D', 'words/without': 'B' };

function loadRuns(resultDir) {
  const agg = JSON.parse(fs.readFileSync(path.join(resultDir, 'aggregate-result.json'), 'utf8'));
  const runs = [];
  for (const c of agg.cases) {
    const m = /^(.*)-(nowords|words)$/.exec(c.name);
    const task = m ? m[1] : c.name;
    const wordsKey = m ? m[2] : 'n/a';
    for (const armName of ['with', 'without']) {
      (c.arms[armName] || []).forEach((r, i) => {
        runs.push({
          resultDir, label: path.basename(resultDir), case: c.name, task, arm: armName, idx: i,
          setup: SETUP[`${wordsKey}/${armName}`] || '?', rec: r,
        });
      });
    }
  }
  return { agg, runs };
}

const runSubdir = (run) => path.join(run.resultDir, 'runs', run.case, `${run.arm}-${run.idx}`);

function collect(resultDir) {
  const { runs } = loadRuns(resultDir);
  let copied = 0;
  for (const run of runs) {
    const tp = run.rec.tracePath;
    if (!tp || !fs.existsSync(tp)) { console.error(`missing trace: ${run.case} ${run.arm}-${run.idx}`); continue; }
    const tempRoot = path.dirname(path.dirname(tp));
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
  console.log(`collected ${copied} files for ${runs.length} runs into ${path.join(resultDir, 'runs')}`);
}

// ---------------------------------------------------------------- transcript parsing
const tierOf = (model) => {
  if (model === null || model === undefined) return 'omitted';
  const s = String(model).toLowerCase();
  for (const t of ['haiku', 'sonnet', 'opus', 'fable']) if (s.includes(t)) return t;
  return 'other';
};
const resultText = (b) => (typeof b.content === 'string' ? b.content
  : Array.isArray(b.content) ? b.content.map((x) => x.text || '').join('\n') : '');

function parseRun(run) {
  const base = runSubdir(run);
  const collected = path.join(base, 'out', 'trace.jsonl');
  const tracePath = fs.existsSync(collected) ? collected : run.rec.tracePath;
  const out = { ok: false, calls: [], skills: [], workers: [], resultMsg: null };
  if (!tracePath || !fs.existsSync(tracePath)) { out.err = 'no trace'; return out; }
  const msgs = readJsonl(tracePath);
  const results = new Map();
  for (const m of msgs) {
    if (m.type === 'user' && Array.isArray(m.message && m.message.content)) {
      for (const b of m.message.content) if (b.type === 'tool_result') results.set(b.tool_use_id, b);
    }
    if (m.type === 'result') out.resultMsg = m;
  }
  for (const m of msgs) {
    if (m.type !== 'assistant' || !Array.isArray(m.message && m.message.content)) continue;
    const nested = !!m.parent_tool_use_id;
    for (const b of m.message.content) {
      if (b.type !== 'tool_use') continue;
      if (b.name === 'Skill' && !nested) out.skills.push(b.input && b.input.skill);
      if (b.name === 'Agent' || b.name === 'Task') {
        const inp = b.input || {};
        const res = results.get(b.id);
        const text = res ? resultText(res) : '';
        out.calls.push({
          id: b.id, nested,
          hasModelKey: Object.prototype.hasOwnProperty.call(inp, 'model'),
          model: inp.model === undefined ? null : inp.model,
          effort: inp.effort === undefined ? null : inp.effort,
          subagentType: inp.subagent_type || null,
          denied: /no explicit model/i.test(text),
          inputJson: JSON.stringify(inp),
        });
      }
    }
  }
  // Worker resolution: subagent meta.json carries the requested model/effort; the subagent
  // transcript's assistant messages carry the model that actually ran.
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
  if (!out.workers.length && out.resultMsg && out.resultMsg.modelUsage) {
    // Fallback when sub-transcripts were not collected: models other than the orchestrator.
    const orch = Object.keys(out.resultMsg.modelUsage);
    out.workers = [{ toolUseId: null, requested: null, effort: null, agentType: null, resolved: orch.join(',') }];
  }
  out.ok = true;
  return out;
}

function summarizeRun(run) {
  const p = parseRun(run);
  const top = p.calls.filter((c) => !c.nested);
  const first = top[0] || null;
  const allowed = top.filter((c) => !c.denied);
  const final = allowed.length ? allowed[allowed.length - 1] : null;
  const rec = run.rec;
  const mu = (p.resultMsg && p.resultMsg.modelUsage) || {};
  const gr = {};
  for (const g of rec.graders || []) gr[g.name] = g.passed;
  // What each tool_used grader should say under three counting rules: every Agent call in the
  // transcript (worker-made nested calls and denied calls included), orchestrator-level calls
  // only, and orchestrator-level calls the gate allowed.
  const predict = (calls) => ({
    delegated: calls.length >= 1,
    'named-model': calls.some((c) => c.hasModelKey),
    'no-modelless-call': calls.every((c) => c.hasModelKey),
    'effort-set': calls.some((c) => c.effort !== null),
    ...Object.fromEntries(['haiku', 'sonnet', 'opus', 'fable'].map((t) => [`tier-${t}`, calls.some((c) => tierOf(c.model) === t)])),
  });
  return {
    label: run.label, case: run.case, task: run.task, arm: run.arm, idx: run.idx, setup: run.setup,
    error: rec.error || null, parsed: p.ok,
    nCalls: top.length, nDenied: top.filter((c) => c.denied).length,
    first, final,
    skillAny: p.skills.length > 0, skillDT: p.skills.some((s) => /delegation-tiering/.test(s || '')),
    workers: p.workers, costUsd: rec.costUsd, judgeCostUsd: rec.judgeCostUsd || 0,
    modelCost: Object.fromEntries(Object.entries(mu).map(([k, v]) => [k, v.costUSD])),
    turns: rec.turns, graders: gr,
    nNested: p.calls.filter((c) => c.nested).length,
    predEvery: predict(p.calls), predTop: predict(top), predAllowed: predict(allowed),
  };
}

// ---------------------------------------------------------------- statistics
function lgamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x; let t = x + 5.5; t -= (x + 0.5) * Math.log(t);
  let s = 1.000000000190015;
  for (const cj of c) s += cj / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
}
function betacf(a, b, x) {
  const FPMIN = 1e-300; let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
    const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break;
  }
  return h;
}
function ibeta(x, a, b) { // regularized incomplete beta I_x(a,b)
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
}
function betaQuantile(p, a, b) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (ibeta(mid, a, b) < p) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
function clopperPearson(k, n, alpha = 0.05) {
  if (n === 0) return [NaN, NaN];
  return [k === 0 ? 0 : betaQuantile(alpha / 2, k, n - k + 1), k === n ? 1 : betaQuantile(1 - alpha / 2, k + 1, n - k)];
}
const pct = (x) => (Number.isNaN(x) ? 'n/a' : `${(x * 100).toFixed(0)}%`);
function rate(k, n) {
  if (n === 0) return 'n/a (0)';
  const [lo, hi] = clopperPearson(k, n);
  return `${k}/${n} = ${pct(k / n)} [${pct(lo)}-${pct(hi)}]`;
}
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const median = (a) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const usd = (x) => (Number.isNaN(x) ? 'n/a' : `$${x.toFixed(3)}`);

// ---------------------------------------------------------------- report
const TIERS = ['haiku', 'sonnet', 'opus', 'fable', 'other', 'omitted'];
const tierDist = (calls) => {
  const d = Object.fromEntries(TIERS.map((t) => [t, 0]));
  for (const c of calls) d[tierOf(c.model)]++;
  return TIERS.filter((t) => d[t]).map((t) => `${t} ${d[t]}`).join(', ') || 'none';
};

function statBlock(rows) {
  const valid = rows.filter((r) => r.parsed && !r.error);
  const del = valid.filter((r) => r.first);
  return {
    runs: rows.length, errors: rows.filter((r) => r.error || !r.parsed).length, valid: valid.length,
    delegated: rate(del.length, valid.length),
    firstNamed: rate(del.filter((r) => r.first.hasModelKey).length, del.length),
    finalNamed: rate(del.filter((r) => r.final && r.final.hasModelKey).length, del.length),
    denied: rate(del.filter((r) => r.first.denied).length, del.length),
    firstEffort: rate(del.filter((r) => r.first.effort !== null).length, del.length),
    finalEffort: rate(del.filter((r) => r.final && r.final.effort !== null).length, del.length),
    anyEffort: rate(del.filter((r) => r.nCalls && (r.first.effort !== null || (r.final && r.final.effort !== null))).length, del.length),
    firstTiers: tierDist(del.map((r) => r.first)),
    finalTiers: tierDist(del.filter((r) => r.final).map((r) => r.final)),
    skillAny: rate(valid.filter((r) => r.skillAny).length, valid.length),
    skillDT: rate(valid.filter((r) => r.skillDT).length, valid.length),
    meanCalls: mean(del.map((r) => r.nCalls)),
    cost: valid.map((r) => r.costUsd),
  };
}

function report(rows, aggs) {
  const L = [];
  const setups = ['A', 'B', 'C', 'D'];
  const names = { A: 'A nothing', B: 'B words only', C: 'C plugin only', D: 'D both' };
  L.push('## Per-setup aggregates', '');
  L.push('Rates use runs without a harness error as the denominator (agent-call rates: runs that delegated). Brackets are exact Clopper-Pearson 95% CIs.', '');
  const S = Object.fromEntries(setups.map((s) => [s, statBlock(rows.filter((r) => r.setup === s))]));
  const line = (title, f) => L.push(`| ${title} | ${setups.map((s) => f(S[s])).join(' | ')} |`);
  L.push(`| Metric | ${setups.map((s) => names[s]).join(' | ')} |`, `|---|${setups.map(() => '---').join('|')}|`);
  line('runs (errors)', (b) => `${b.runs} (${b.errors})`);
  line('delegated (>=1 Agent call)', (b) => b.delegated);
  line('first-try named model', (b) => b.firstNamed);
  line('first call denied by gate', (b) => b.denied);
  line('final allowed call named model', (b) => b.finalNamed);
  line('effort set, first call', (b) => b.firstEffort);
  line('effort set, final call', (b) => b.finalEffort);
  line('tier of first call', (b) => b.firstTiers);
  line('tier of final call', (b) => b.finalTiers);
  line('Skill tool invoked (any skill)', (b) => b.skillAny);
  line('delegation-tiering skill invoked', (b) => b.skillDT);
  line('mean Agent calls per delegating run', (b) => (Number.isNaN(b.meanCalls) ? 'n/a' : b.meanCalls.toFixed(2)));
  L.push('');
  L.push('## Cost per session (costUsd list-price estimate; orchestrator plus workers)', '');
  L.push('| Setup | n | mean | median | min | max | total |', '|---|---|---|---|---|---|---|');
  for (const s of setups) {
    const c = S[s].cost;
    L.push(`| ${names[s]} | ${c.length} | ${usd(mean(c))} | ${usd(median(c))} | ${usd(Math.min(...c))} | ${usd(Math.max(...c))} | ${usd(c.reduce((a, b) => a + b, 0))} |`);
  }
  L.push('', 'Mean cost by resolved model (from each run\'s `modelUsage`; runs lacking a model count as 0):', '');
  const models = [...new Set(rows.flatMap((r) => Object.keys(r.modelCost)))].sort();
  L.push(`| Setup | ${models.join(' | ')} |`, `|---|${models.map(() => '---').join('|')}|`);
  for (const s of setups) {
    const rs = rows.filter((r) => r.setup === s && r.parsed && !r.error);
    L.push(`| ${names[s]} | ${models.map((m) => usd(mean(rs.map((r) => r.modelCost[m] || 0)))).join(' | ')} |`);
  }
  const total = aggs.reduce((a, g) => a + (g.costUsd || 0), 0);
  L.push('', `Total costUsd across the analyzed invocations: ${usd(total)} (${aggs.length} invocation(s)).`, '');

  L.push('## Per-task rows', '');
  L.push('| Task | Setup | runs (err) | delegated | first named | final named | effort set (final) | first tier | final tier | mean cost |', '|---|---|---|---|---|---|---|---|---|---|');
  for (const task of [...new Set(rows.map((r) => r.task))]) {
    for (const s of setups) {
      const rs = rows.filter((r) => r.task === task && r.setup === s);
      if (!rs.length) continue;
      const b = statBlock(rs);
      L.push(`| ${task} | ${s} | ${b.runs} (${b.errors}) | ${b.delegated} | ${b.firstNamed} | ${b.finalNamed} | ${b.finalEffort} | ${b.firstTiers} | ${b.finalTiers} | ${usd(mean(b.cost))} |`);
    }
  }
  L.push('');

  L.push('## Workers (resolved model per delegation)', '');
  const wc = {};
  for (const r of rows) for (const w of r.workers) {
    const k = `${r.setup}: requested ${w.requested || 'none'} -> resolved ${w.resolved || 'unknown'}${w.effort ? ` @ ${w.effort}` : ''}`;
    wc[k] = (wc[k] || 0) + 1;
  }
  Object.keys(wc).sort().forEach((k) => L.push(`- ${k} (x${wc[k]})`));
  L.push('');

  L.push('## Grader cross-check (tool_used verdict vs transcript parser)', '');
  const gnames = ['delegated', 'named-model', 'no-modelless-call', 'effort-set', 'tier-haiku', 'tier-sonnet', 'tier-opus', 'tier-fable'];
  let comparable = 0, matchEvery = 0, matchTop = 0, matchAllowed = 0;
  const mism = [];
  for (const r of rows.filter((x) => x.parsed)) {
    for (const g of gnames) {
      if (!(g in r.graders)) continue;
      comparable++;
      // tool_used passes when the count is within [min,max]; the parser predicts the same indicator.
      if (r.graders[g] === r.predEvery[g]) matchEvery++;
      if (r.graders[g] === r.predTop[g]) matchTop++;
      if (r.graders[g] === r.predAllowed[g]) matchAllowed++;
      if (r.graders[g] !== r.predEvery[g]) mism.push(`${r.label} ${r.case} ${r.arm}-${r.idx} ${g}: grader=${r.graders[g]} every-call=${r.predEvery[g]} top-level=${r.predTop[g]}`);
    }
  }
  L.push(`Grader verdicts compared: ${comparable}. Agree with the parser counting every Agent call in the transcript (nested worker calls and denied calls included): ${matchEvery}. Agree counting orchestrator-level calls only: ${matchTop}. Agree counting orchestrator-level calls the gate allowed: ${matchAllowed}.`, '');
  L.push(mism.length ? `Mismatches against the every-call prediction (${mism.length}):\n${mism.map((m) => `- ${m}`).join('\n')}` : 'No mismatches against the every-call prediction.', '');
  const dn = rows.filter((r) => r.nDenied > 0);
  L.push(`Runs with an orchestrator-level Agent call denied by the gate: ${dn.length}. ${dn.map((r) => `${r.case} ${r.arm}-${r.idx}`).join('; ')}`);
  const nn = rows.filter((r) => r.nNested > 0);
  L.push('', `Runs where a worker made nested Agent calls (excluded from the rates above, counted by tool_used): ${nn.length}. ${nn.map((r) => `${r.setup}:${r.case}`).join('; ')}`, '');

  L.push('## Errors', '');
  const er = rows.filter((r) => r.error || !r.parsed);
  L.push(er.length ? er.map((r) => `- ${r.label} ${r.case} ${r.arm}-${r.idx} (${r.setup}): ${r.error || 'unparsed'}`).join('\n') : 'None.', '');
  return L.join('\n');
}

// ---------------------------------------------------------------- main
function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const ji = rest.indexOf('--json');
  const jsonOut = ji >= 0 ? rest.splice(ji, 2)[1] : null;
  if (!['collect', 'report'].includes(cmd) || !rest.length) {
    console.error('usage: node analyze-pilot.js <collect|report> <result-dir>... [--json rows.json]');
    process.exit(2);
  }
  if (cmd === 'collect') { rest.forEach(collect); return; }
  const rows = []; const aggs = [];
  for (const d of rest) {
    const { agg, runs } = loadRuns(d);
    aggs.push(agg);
    for (const r of runs) rows.push(summarizeRun(r));
  }
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(rows, null, 1));
  console.log(report(rows, aggs));
}

if (require.main === module) main();
module.exports = { clopperPearson, parseRun, summarizeRun, tierOf };
