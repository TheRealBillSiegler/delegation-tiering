// Phase 1a: stress the gate's Workflow-script lint on a frozen real-world corpus.
// Usage: node lint-stress.js [--snap DIR] [--out DIR] [--gate FILE]
// Reads only; writes aggregates to ./results.json and per-call/per-mutant detail to --out.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
// The snapshot and the private output directory have no defaults, so no user path lives in the repo.
const SNAP = arg('--snap', process.env.SNAP);
const OUT = arg('--out', process.env.OUT);
if (!SNAP || !OUT) throw new Error('usage: node lint-stress.js --snap <snapshot> --out <private dir> [--gate <hook file>], or set SNAP and OUT');
const GATE = arg('--gate', path.join(__dirname, '..', '..', '..', 'hooks', 'agent-model-gate.js'));

// Extract the gate's own functions verbatim (no re-implementation).
const gateSrc = fs.readFileSync(GATE, 'utf8');
const grab = (name) => {
  const s = gateSrc.indexOf('function ' + name);
  let depth = 0, i = gateSrc.indexOf('{', s);
  for (; i < gateSrc.length; i++) { if (gateSrc[i] === '{') depth++; else if (gateSrc[i] === '}' && --depth === 0) break; }
  return gateSrc.slice(s, i + 1);
};
const { lintScript, blankLiterals } = new Function(grab('blankLiterals') + '\n' + grab('lintScript') + '\nreturn { lintScript, blankLiterals };')();

// ---- structural helpers over blanked text ----
function findCalls(src) {
  const scan = blankLiterals(src); const calls = []; let m;
  const re = /\bagent\s*\(/g;
  while ((m = re.exec(scan))) {
    const open = m.index + m[0].length - 1; let depth = 0, j = open;
    for (; j < scan.length; j++) { if ('([{'.includes(scan[j])) depth++; else if (')]}'.includes(scan[j]) && --depth === 0) break; }
    calls.push({ start: m.index, open, close: j, balanced: j < scan.length });
  }
  return { scan, calls };
}
// Classify one call from its balanced args in blanked text. `direct` is the
// model: property of an options object that is itself a direct argument.
function analyse(scan, c) {
  const res = { direct: null, nested: 0, spread: false, varArg: false, shorthand: false };
  const stack = []; let argIdx = 0;
  for (let j = c.open; j <= c.close; j++) {
    const ch = scan[j];
    if ('([{'.includes(ch)) { stack.push(ch); continue; }
    if (')]}'.includes(ch)) { stack.pop(); continue; }
    if (ch === ',' && stack.length === 1) argIdx++;
    if (ch === '.' && scan.startsWith('...', j) && (stack.length === 1 || (stack.length === 2 && stack[1] === '{'))) res.spread = true;
    if (stack.length === 1 && argIdx >= 1 && /[A-Za-z_$]/.test(ch) && /,\s*$/.test(scan.slice(Math.max(c.open, j - 40), j))) res.varArg = true;
    if (ch === 'm' && scan.startsWith('model', j) && !/[\w$]/.test(scan[j - 1] || '')) {
      const rest = /^model\s*(:|(?![\w$]))/.exec(scan.slice(j, j + 40));
      if (!rest) continue;
      if (rest[1] === ':') {
        if (stack.length === 2 && stack[0] === '(' && stack[1] === '{' && !res.direct) {
          let k = j + rest[0].length, d = 0;
          for (; k <= c.close; k++) { const x = scan[k]; if ('([{'.includes(x)) d++; else if (')]}'.includes(x)) { if (d === 0) break; d--; } else if (x === ',' && d === 0) break; }
          res.direct = { keyStart: j, valEnd: k, term: scan[k] };
        } else res.nested++;
      } else if (stack.length === 2 && stack[1] === '{') res.shorthand = true;
    }
  }
  return res;
}
const summarise = (span) => span.slice(0, 90).replace(/\s+/g, ' ').trim();

// ---- exact Clopper-Pearson via regularized incomplete beta ----
function lgamma(x) { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const v of c) s += v / ++y; return -t + Math.log(2.5066282746310005 * s / x); }
function betacf(a, b, x) { const qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d; for (let m = 1; m <= 500; m++) { const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c; aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-15) break; } return h; }
function ibeta(a, b, x) { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; }
function betaq(p, a, b) { let lo = 0, hi = 1; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (ibeta(a, b, mid) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; }
function clopperPearson(k, n, alpha = 0.05) { return { lo: k === 0 ? 0 : betaq(alpha / 2, k, n - k + 1), hi: k === n ? 1 : betaq(1 - alpha / 2, k + 1, n - k) }; }

// ---- corpus ----
const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();
const files = [];
for (const p of fs.readdirSync(SNAP)) {
  if (!isDir(path.join(SNAP, p))) continue;
  for (const s of fs.readdirSync(path.join(SNAP, p))) {
    const dir = path.join(SNAP, p, s, 'workflows', 'scripts');
    if (isDir(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.js')) files.push(path.join(dir, f));
  }
}
const byHash = new Map();
for (const f of files) { const src = fs.readFileSync(f, 'utf8'); const h = crypto.createHash('sha256').update(src).digest('hex'); if (!byHash.has(h)) byHash.set(h, { h, src, copies: 0 }); byHash.get(h).copies++; }
const scripts = [...byHash.values()];
fs.mkdirSync(OUT, { recursive: true });

const R = { corpus: { files: files.length, unique: scripts.length } };
const callRows = [], mutRows = [];
let baseFlagged = 0, baseFlaggedScripts = 0, totalCalls = 0, unbalanced = 0, allow = 0, scriptsWithAllow = 0, parseErr = 0;
const ind = { directModel: 0, noDirect: 0, spread: 0, varArg: 0, shorthand: 0, nestedOnly: 0, none: 0, passViaSpanText: 0, passViaMarker: 0, quotedKey: 0 };
const perScript = [];
for (const sc of scripts) {
  const { scan, calls } = findCalls(sc.src); totalCalls += calls.length;
  const base = lintScript(sc.src); baseFlagged += base.length; if (base.length) baseFlaggedScripts++;
  const am = (sc.src.match(/model-gate:\s*allow/g) || []).length; allow += am; if (am) scriptsWithAllow++;
  let caught = 0, mutN = 0;
  calls.forEach((c, i) => {
    if (!c.balanced) unbalanced++;
    const a = analyse(scan, c); const args = sc.src.slice(c.start, c.close + 1);
    const span = sc.src.slice(c.start, calls[i + 1] ? calls[i + 1].start : sc.src.length);
    const spanModel = /model\s*:/.test(span), spanMarker = /model-gate:\s*allow/.test(span);
    const row = { h: sc.h.slice(0, 12), i, direct: !!a.direct, nested: a.nested, spread: a.spread, varArg: a.varArg, shorthand: a.shorthand, spanModel, spanMarker };
    if (/['"]model['"]\s*:/.test(args)) { ind.quotedKey++; row.quotedKey = true; }
    if (a.direct) ind.directModel++; else {
      ind.noDirect++;
      if (a.spread) ind.spread++;
      if (a.varArg) ind.varArg++;
      if (a.shorthand) ind.shorthand++;
      if (a.nested && !a.spread && !a.varArg && !a.shorthand) ind.nestedOnly++;
      if (!a.spread && !a.varArg && !a.shorthand && !a.nested) ind.none++;
      if (spanModel) ind.passViaSpanText++; else if (spanMarker) ind.passViaMarker++;
    }
    callRows.push(row);
    if (!a.direct || !c.balanced) return;
    // mutant: drop `model: <value>` plus its trailing comma, or the preceding comma when it is the last property
    let from = a.direct.keyStart, to = a.direct.valEnd;
    if (a.direct.term === ',') { to++; while (/[ \t]/.test(sc.src[to] || '')) to++; }
    else { let b = from - 1; while (b > c.open && /\s/.test(scan[b])) b--; if (scan[b] === ',') from = b; }
    const mut = sc.src.slice(0, from) + sc.src.slice(to);
    mutN++;
    const flagged = lintScript(mut);
    const mf = findCalls(mut); const my = mf.calls[i];
    const mspan = mut.slice(my.start, mf.calls[i + 1] ? mf.calls[i + 1].start : mut.length);
    const caughtIt = flagged.includes(summarise(mspan));
    const spurious = flagged.length - (caughtIt ? 1 : 0);
    let reason = null;
    if (caughtIt) caught++; else {
      const mm = /model\s*:/.exec(mspan); const argLen = my.close - my.start + 1;
      if (!mm) reason = /model-gate:\s*allow/.test(mspan) ? 'allow-marker-in-span' : 'unknown';
      else {
        const inArgs = mm.index < argLen; const inCode = mf.scan[my.start + mm.index] === 'm';
        reason = inCode ? (inArgs ? 'own-args code-level model: (nested/schema key)' : 'after-call code-level model: (later code in span)') : (inArgs ? 'own-args model: text in string/comment' : 'after-call model: text in string/comment');
      }
    }
    mutRows.push({ h: sc.h.slice(0, 12), i, removedChars: to - from, caught: caughtIt, spurious, reason });
  });
  if (mutN) perScript.push({ h: sc.h.slice(0, 12), mutants: mutN, caught, recall: caught / mutN });
}
R.corpus.callsTotal = totalCalls; R.corpus.unbalancedCalls = unbalanced;
R.baseline = { flaggedCalls: baseFlagged, scriptsWithFlag: baseFlaggedScripts, scriptsLinted: scripts.length };
const nMut = mutRows.length, nCaught = mutRows.filter((r) => r.caught).length;
const cp = clopperPearson(nCaught, nMut);
const reasons = {}; for (const r of mutRows) if (!r.caught) reasons[r.reason] = (reasons[r.reason] || 0) + 1;
R.mutation = { mutants: nMut, caught: nCaught, masked: nMut - nCaught, recall: nCaught / nMut, ci95: [cp.lo, cp.hi], spuriousMutants: mutRows.filter((r) => r.spurious > 0).length, spuriousFlagsTotal: mutRows.reduce((s, r) => s + r.spurious, 0), scriptsWithMutants: perScript.length, perScriptMeanRecall: perScript.reduce((s, r) => s + r.recall, 0) / (perScript.length || 1), scriptsWithAnyMasked: perScript.filter((r) => r.caught < r.mutants).length, maskedReasons: reasons };
R.indirect = { ...ind, allowMarkers: allow, scriptsWithAllow, note: 'noDirect = calls with no options-object model: property in their own args; passViaSpanText/passViaMarker = of those, how they pass lint' };

// ---- recovered denials ----
function ownModelless(src) { const { scan, calls } = findCalls(src); return calls.filter((c) => { const args = scan.slice(c.start, c.close + 1); return !(/\bmodel\s*:/.test(args) || /\.\.\.\s*\w/.test(args)); }).length; }
const den = [];
const tx = [];
for (const p of fs.readdirSync(SNAP)) { const d = path.join(SNAP, p); if (!isDir(d)) continue; for (const f of fs.readdirSync(d)) if (f.endsWith('.jsonl')) tx.push(path.join(d, f)); }
const probeLike = /probe|diagnostic/i;
for (const f of tx) {
  let lastUser = '';
  const uses = new Map();
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim()) continue; let o; try { o = JSON.parse(line); } catch { parseErr++; continue; }
    const content = o.message && o.message.content;
    if (o.type === 'user' && typeof content === 'string') lastUser = content;
    if (!Array.isArray(content)) continue;
    for (const b of content) {
      if (o.type === 'user' && b.type === 'text' && b.text) lastUser = b.text;
      if (b.type === 'tool_use' && b.name === 'Workflow') uses.set(b.id, { input: b.input || {}, lastUser });
      if (b.type === 'tool_result' && uses.has(b.tool_use_id)) {
        const text = typeof b.content === 'string' ? b.content : Array.isArray(b.content) ? b.content.map((c) => c.text || '').join(' ') : '';
        if (!/without an explicit model/i.test(text)) continue;
        const u = uses.get(b.tool_use_id); const script = u.input.script;
        const rest = JSON.stringify({ ...u.input, script: undefined });
        const row = { session: path.basename(f), toolUseId: b.tool_use_id, hasScript: typeof script === 'string', probeByUserPrompt: probeLike.test(u.lastUser), probeByInputFields: probeLike.test(rest), probeByScript: typeof script === 'string' && probeLike.test(script) };
        if (row.hasScript) { row.lintNow = lintScript(script).length; row.callsTotal = findCalls(script).calls.length; row.modellessOwnArgs = ownModelless(script); row.scriptHash = crypto.createHash('sha256').update(script).digest('hex').slice(0, 12); }
        row.deliberate = row.probeByUserPrompt || row.probeByInputFields;
        den.push(row);
      }
    }
  }
}
const grp = (rows) => ({ denials: rows.length, withScript: rows.filter((r) => r.hasScript).length, stillDeniedByCurrentLint: rows.filter((r) => r.lintNow > 0).length, trulyModelless: rows.filter((r) => r.modellessOwnArgs > 0).length, lintDeniesButNoModellessCall: rows.filter((r) => r.lintNow > 0 && !(r.modellessOwnArgs > 0)).length, modellessButLintPasses: rows.filter((r) => r.modellessOwnArgs > 0 && !(r.lintNow > 0)).length });
R.denials = { transcripts: tx.length, jsonParseErrors: parseErr, all: grp(den), deliberate: grp(den.filter((r) => r.deliberate)), organic: grp(den.filter((r) => !r.deliberate)), probeByScriptTextOnly: den.filter((r) => !r.deliberate && r.probeByScript).length };

const jl = (rows) => rows.map((r) => JSON.stringify(r)).join('\n');
fs.writeFileSync(path.join(OUT, 'per-call.jsonl'), jl(callRows));
fs.writeFileSync(path.join(OUT, 'per-mutant.jsonl'), jl(mutRows));
fs.writeFileSync(path.join(OUT, 'per-script.jsonl'), jl(perScript));
fs.writeFileSync(path.join(OUT, 'denials.jsonl'), jl(den));
fs.writeFileSync(path.join(__dirname, 'results.json'), JSON.stringify(R, null, 2));
console.log(JSON.stringify(R, null, 2));
