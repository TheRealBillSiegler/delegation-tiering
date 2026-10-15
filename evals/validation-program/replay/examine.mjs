// Examine drawn candidates for replayability: prompt, files, tools.
// Usage: node examine.mjs [maxExamined=25]   draw-order examination; stops at 5 replayable
//        node examine.mjs --all            frame-wide diagnostic; writes no prompts, selects nothing
// Reads DATA/frame.jsonl, DATA/draw-order.json, and optional DATA/judgments.json
// (per-id manual rulings: { "<id>": { "openReview": bool, "historyDependent": bool, "note": "..." } }).
// Writes DATA/examine.json (evidence per candidate) and DATA/candidates/<n>-<id>/prompt.txt.
// Prints only aggregate counts. Read-only against every repo (git log, cat-file, show).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readJsonl, initialPrompt, toolUses, writeJson } from './lib.mjs';
import { SNAP, DATA } from './paths.mjs';

const ALL = process.argv.includes('--all');
const MAX = ALL ? Infinity : Number(process.argv[2] ?? 25);
// Heuristic: a shell command that writes, deletes, installs, executes code, or changes git/gh state.
const SHELL_EFFECT_RE = /(^|[^0-9&2])>(?!\s*\/dev\/null)|\b(rm|mv|cp|mkdir|touch|tee|chmod|ln)\b|\bsed\s+-i|\bgit\s+(commit|push|checkout|switch|reset|add|stash|worktree|rebase|merge|tag|cherry-pick|restore|clean|apply|am|fetch|pull)\b|\bgh\b.*\b(create|edit|merge|close|comment|review)\b|-X\s*(POST|PUT|PATCH|DELETE)|\b(npm|npx|pip|uv|pytest|python3?|node|pwsh|copier|make)\b/;
const READ_TOOLS = new Set(['Read', 'Glob', 'Grep', 'WebFetch']);
const NEUTRAL_TOOLS = new Set(['StructuredOutput', 'ToolSearch']);
const HISTORY_RE = /\bgit (diff|log|show|blame)\b|\bdiff (against|between|of)\b|\bcommit range\b|\.\.\.?HEAD\b/i;
const EPHEMERAL_RE = /[\\/](appdata[\\/]local[\\/]temp|tmp|scratchpad)[\\/]/i;

const git = (repo, args) => {
  try { return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20 }); }
  catch { return null; }
};
const norm = p => String(p).replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();

/** Split a recorded cwd into the repo root and, for a Claude worktree, its name. */
function locateRepo(cwd) {
  const m = cwd.match(/^(.*?)[\\/]\.claude[\\/]worktrees[\\/]([^\\/]+)/i);
  if (m) return { repo: m[1], checkout: cwd.slice(0, m[0].length), worktree: m[2] };
  const top = git(cwd, ['rev-parse', '--show-toplevel']);
  return { repo: top ? top.trim() : cwd, checkout: top ? top.trim() : cwd, worktree: null };
}

/** Map each tool_use id to the text of its tool_result. */
function resultsById(lines) {
  const map = new Map();
  for (const o of lines) {
    if (o.type !== 'user' || !o.message || !Array.isArray(o.message.content)) continue;
    for (const b of o.message.content) {
      if (b.type !== 'tool_result') continue;
      const t = typeof b.content === 'string' ? b.content
        : Array.isArray(b.content) ? b.content.filter(x => x.type === 'text').map(x => x.text).join('\n') : '';
      map.set(b.tool_use_id, { text: t, isError: !!b.is_error });
    }
  }
  return map;
}

/** Compare numbered lines returned by a Read against the blob; return [matched, compared]. */
function compareRead(resultText, blobText) {
  const blob = blobText.split('\n').map(l => l.replace(/\r$/, ''));
  let matched = 0, compared = 0;
  for (const line of resultText.split('\n')) {
    const m = line.match(/^\s*(\d+)(?:\t|→)(.*)$/);
    if (!m) continue;
    const n = Number(m[1]);
    compared++;
    if (blob[n - 1] !== undefined && blob[n - 1].replace(/\s+$/, '') === m[2].replace(/\r$/, '').replace(/\s+$/, '')) matched++;
  }
  return [matched, compared];
}

const frame = Object.fromEntries(fs.readFileSync(path.join(DATA, 'frame.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l)).map(r => [r.id, r]));
const { order, seed } = JSON.parse(fs.readFileSync(path.join(DATA, 'draw-order.json'), 'utf8'));
const judgmentsPath = path.join(DATA, 'judgments.json');
const judgments = fs.existsSync(judgmentsPath) ? JSON.parse(fs.readFileSync(judgmentsPath, 'utf8')) : {};

const results = [];
let replayable = 0;
for (let i = 0; i < order.length && results.length < MAX && (ALL || replayable < 5); i++) {
  const r = frame[order[i]];
  const n = i + 1;
  const lines = readJsonl(path.join(SNAP, r.transcript));
  const promptParts = initialPrompt(lines);
  const prompt = promptParts.join('\n\n');
  const candDir = path.join(DATA, 'candidates', `${String(n).padStart(2, '0')}-${r.id}`);
  if (!ALL) {
    fs.mkdirSync(candDir, { recursive: true });
    fs.writeFileSync(path.join(candDir, 'prompt.txt'), prompt);
  }

  const reasons = [];
  // (a) prompt
  if (!prompt.trim()) reasons.push('prompt: empty');
  const j = judgments[r.id] ?? {};
  if (j.openReview === false) reasons.push(`scope: ${j.note ?? 'not an open review'}`);
  if (j.historyDependent ?? HISTORY_RE.test(prompt)) reasons.push('files: depends on git history (diff/log) per prompt');

  // (c) tools
  const uses = toolUses(lines);
  const nonRead = [...new Set(uses.map(u => u.name))].filter(t => !READ_TOOLS.has(t) && !NEUTRAL_TOOLS.has(t));
  if (nonRead.length) reasons.push(`tools: used ${nonRead.join(', ')}`);
  const bashCmds = uses.filter(u => u.name === 'Bash' || u.name === 'PowerShell').map(u => String(u.input?.command ?? ''));
  const bashHistory = bashCmds.some(c => /\bgit\s+(diff|log|show|blame)\b/.test(c));
  const bashEffect = bashCmds.filter(c => SHELL_EFFECT_RE.test(c)).length;
  const otherNonRead = nonRead.filter(t => t !== 'Bash' && t !== 'PowerShell');

  // (b) files
  const loc = locateRepo(r.cwd);
  const checkoutExists = fs.existsSync(loc.checkout);
  let sha = null, branchUsed = r.gitBranch;
  if (r.gitBranch && r.gitBranch !== 'HEAD') {
    sha = (git(loc.repo, ['log', '-1', '--format=%H', `--before=${r.start}`, r.gitBranch]) ?? '').trim()
      || (git(loc.repo, ['log', '-1', '--format=%H', `--before=${r.start}`, `origin/${r.gitBranch}`]) ?? '').trim() || null;
    if (sha && !git(loc.repo, ['rev-parse', '--verify', '-q', r.gitBranch])) branchUsed = `origin/${r.gitBranch}`;
  }
  const res = resultsById(lines);
  const targets = [];
  for (const u of uses) {
    if (u.name !== 'Read' || !u.input?.file_path) continue;
    const fp = norm(u.input.file_path);
    const result = res.get(u.id);
    let rel = null, where = 'outside-repo';
    for (const [base, tag] of [[norm(loc.checkout), 'checkout'], [norm(loc.repo), 'repo-root']]) {
      if (fp.startsWith(base + '/')) { rel = u.input.file_path.replace(/\\/g, '/').slice(base.length + 1); where = tag; break; }
    }
    if (where === 'repo-root' && loc.worktree && fp.startsWith(norm(loc.repo) + '/.claude/')) where = 'outside-repo';
    const t = { where, ephemeral: EPHEMERAL_RE.test(u.input.file_path), readError: result?.isError ?? null };
    if (where === 'outside-repo' && fs.existsSync(u.input.file_path) && result && !result.isError) {
      const [m, c] = compareRead(result.text, fs.readFileSync(u.input.file_path, 'utf8'));
      t.outsideNow = { matched: m, compared: c };
    }
    if (rel && sha) {
      // Resolve the path case-insensitively against the commit's tree.
      const blob = git(loc.repo, ['show', `${sha}:${rel}`]);
      t.inCommit = blob != null;
      if (blob != null && result && !result.isError) {
        const [m, c] = compareRead(result.text, blob);
        t.linesMatched = m; t.linesCompared = c;
      }
    }
    targets.push(t);
  }
  const inRepo = targets.filter(t => t.where !== 'outside-repo');
  const outRepo = targets.filter(t => t.where === 'outside-repo');
  const compared = inRepo.reduce((s, t) => s + (t.linesCompared ?? 0), 0);
  const matched = inRepo.reduce((s, t) => s + (t.linesMatched ?? 0), 0);
  const missing = inRepo.filter(t => t.inCommit === false && !t.readError).length;

  if (!r.gitBranch || r.gitBranch === 'HEAD') reasons.push('files: no branch recorded (detached HEAD); commit not resolvable by branch');
  else if (!sha) reasons.push(`files: branch ${r.gitBranch} not found or no commit before start`);
  if (targets.length === 0) reasons.push('files: no Read targets recorded');
  if (outRepo.length && outRepo.length >= inRepo.length) reasons.push(`files: ${outRepo.length}/${targets.length} reads outside the repo${outRepo.some(t => t.ephemeral) ? ' (scratchpad/temp)' : ''}`);
  if (sha && missing) reasons.push(`files: ${missing} read target(s) absent from resolved commit`);
  if (sha && compared && matched / compared < 0.98) reasons.push(`files: read content matches commit on ${matched}/${compared} lines (uncommitted at the time)`);

  const flags = {
    scope: reasons.some(x => x.startsWith('scope:')),
    toolsStrict: nonRead.length > 0,
    toolsIfInspectOnlyShell: otherNonRead.length > 0 || bashEffect > 0,
    history: reasons.some(x => x.includes('git history')),
    filesNonHistory: reasons.some(x => x.startsWith('files:') && !x.includes('git history')),
    outsideStillIntact: outRepo.length > 0 && outRepo.every(t => t.outsideNow && t.outsideNow.compared > 0 && t.outsideNow.matched === t.outsideNow.compared),
  };
  const ok = reasons.length === 0;
  if (ok) replayable++;
  results.push({
    n, id: r.id, transcript: r.transcript, label: r.label, start: r.start, cwd: r.cwd,
    repo: loc.repo, worktree: loc.worktree, checkoutExistsNow: checkoutExists,
    branch: r.gitBranch, branchUsed, sha, version: r.version, metaEffort: r.metaEffort,
    promptTurns: promptParts.length, promptChars: prompt.length,
    tools: [...new Set(uses.map(u => u.name))], bashCount: bashCmds.length, bashHistory,
    reads: { total: targets.length, inRepo: inRepo.length, outside: outRepo.length, missing, matched, compared },
    judgment: j, reasons, flags, bashEffect, otherNonRead, replayable: ok,
  });
}

if (ALL) {
  writeJson(path.join(DATA, 'diagnostic.json'), { seed, mode: 'frame-wide diagnostic', results });
  const c = f => results.filter(f).length;
  const filesStrict = x => !x.flags.history && !x.flags.filesNonHistory;
  console.log(JSON.stringify({
    frame: results.length,
    passToolsStrict: c(x => !x.flags.toolsStrict),
    passToolsIfInspectOnlyShell: c(x => !x.flags.toolsIfInspectOnlyShell),
    passFilesStrict: c(filesStrict),
    passFilesIfHistoryAllowed: c(x => !x.flags.filesNonHistory),
    passToolsStrictAndFilesStrict: c(x => !x.flags.toolsStrict && filesStrict(x)),
    passShellAndFilesStrict: c(x => !x.flags.toolsIfInspectOnlyShell && filesStrict(x)),
    passShellAndFilesHistoryAllowed: c(x => !x.flags.toolsIfInspectOnlyShell && !x.flags.filesNonHistory),
    outsideTargetsStillIntact: c(x => x.flags.outsideStillIntact),
    note: 'scope (open review vs. re-verification) is not judged frame-wide; every count is an upper bound on that axis',
  }, null, 2));
  process.exit(0);
}

writeJson(path.join(DATA, 'examine.json'), { seed, mode: 'draw-order examination', examined: results.length, replayable, results });
const reasonClass = {};
for (const x of results) for (const k of new Set(x.reasons.map(s => s.split(':')[0]))) reasonClass[k] = (reasonClass[k] ?? 0) + 1;
console.log(JSON.stringify({ examined: results.length, replayable, excludedWithReasonClass: reasonClass }, null, 2));
