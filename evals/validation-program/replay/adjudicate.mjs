// Extract both arms' claimed defects, pool them blind, run the judge, and score.
// Usage: node adjudicate.mjs [--dry-run] [--only <n>] [--seed <s>]
// Per replayed candidate in DATA/candidates/<n>-<id>/:
//   fable-claims.json  from the archived transcript's final output (structured or text)
//   opus-claims.json   from opus-replay.json's result text
//   pool.json          blinded items shown to the judge; key.json stays sealed
//   judge.json         raw judge output; score.json per-candidate metrics
// Text splits are heuristic: hand-check *-claims.json before running the judge.
import fs from 'node:fs';
import path from 'node:path';
import { readJsonl, finalOutput } from './lib.mjs';
import { SNAP, DATA } from './paths.mjs';
import { splitClaims, poolBlind, score } from './adjudicate-core.mjs';
import { runChild } from './child.mjs';

const DRY = process.argv.includes('--dry-run');
const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const ONLY = arg('--only') ? Number(arg('--only')) : null;
const SEED = Number(arg('--seed') ?? 20261008);
const JUDGE_MODEL = 'claude-sonnet-5-5';
const JUDGE_EFFORT = 'high';
const JUDGE_TOOLS = ['Read', 'Glob', 'Grep'];

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['claims', 'defects'],
  properties: {
    claims: { type: 'array', items: { type: 'object', required: ['label', 'verdict', 'evidence'], properties: {
      label: { type: 'string' }, verdict: { enum: ['real', 'not_real', 'unclear'] }, evidence: { type: 'string' } } } },
    defects: { type: 'array', items: { type: 'object', required: ['id', 'claims'], properties: {
      id: { type: 'string' }, claims: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' } } } },
  },
};

/** Build the judge prompt from the blinded pool. */
function judgePrompt(items) {
  return [
    'You are adjudicating claimed defects about the files in your working directory. The claims come from',
    'reviewers whose identity is withheld; judge each on the evidence alone.',
    '',
    'For every claim, decide:',
    '- real: the defect exists in these files; cite file:line you read.',
    '- not_real: the files contradict the claim, or it is not a defect; cite the contradicting file:line.',
    '- unclear: the files cannot settle it (for example it depends on runtime behavior, history, or anything outside this tree).',
    '',
    'Then group the real claims into unique defects: two claims belong together only when fixing one fixes the other.',
    'Every real claim must appear in exactly one defect. Read files; do not guess.',
    '',
    'CLAIMS:',
    ...items.map(it => `${it.label}: ${it.text}`),
  ].join('\n');
}

const exam = JSON.parse(fs.readFileSync(path.join(DATA, 'examine.json'), 'utf8'));
const selected = exam.results.filter(x => x.replayable && (ONLY == null || x.n === ONLY));
console.log(`candidates for adjudication: ${selected.length}`);
const scores = [];
for (const x of selected) {
  const candDir = path.join(DATA, 'candidates', `${String(x.n).padStart(2, '0')}-${x.id}`);
  const replayFile = path.join(candDir, 'opus-replay.json');
  if (!fs.existsSync(replayFile)) { console.log(`candidate ${x.n}: no replay output; skipped`); continue; }
  const fableOut = finalOutput(readJsonl(path.join(SNAP, x.transcript)));
  const opusRaw = JSON.parse(fs.readFileSync(replayFile, 'utf8'));
  const opusOut = { kind: 'text', value: opusRaw.result ?? '' };
  const fableFile = path.join(candDir, 'fable-claims.json');
  const opusFile = path.join(candDir, 'opus-claims.json');
  // Keep hand-corrected splits if present.
  if (!fs.existsSync(fableFile)) fs.writeFileSync(fableFile, JSON.stringify(splitClaims(fableOut), null, 2));
  if (!fs.existsSync(opusFile)) fs.writeFileSync(opusFile, JSON.stringify(splitClaims(opusOut), null, 2));
  const claims = { fable: JSON.parse(fs.readFileSync(fableFile, 'utf8')), opus: JSON.parse(fs.readFileSync(opusFile, 'utf8')) };
  const { items, key } = poolBlind(claims, SEED + x.n);
  fs.writeFileSync(path.join(candDir, 'pool.json'), JSON.stringify(items, null, 2));
  fs.writeFileSync(path.join(candDir, 'key.json'), JSON.stringify(key, null, 2));
  const r = runChild({
    kind: 'judge', candidate: x.n, cwd: path.join(DATA, `tree-${x.n}`), prompt: judgePrompt(items), dryRun: DRY,
    outFile: path.join(candDir, 'judge.json'), model: JUDGE_MODEL, effort: JUDGE_EFFORT, tools: JUDGE_TOOLS,
    jsonSchema: VERDICT_SCHEMA,
  });
  if (r.dryRun || r.refused) { console.log(JSON.stringify({ candidate: x.n, dryRun: !!r.dryRun, refused: r.refused ?? null, argv: r.argv.join(' ') })); if (r.refused) break; continue; }
  const verdict = r.result?.structured_output ?? (() => { try { return JSON.parse(r.result?.result ?? ''); } catch { return null; } })();
  if (!verdict) { console.log(`candidate ${x.n}: judge output unparseable`); continue; }
  const s = { candidate: x.n, ...score(key, verdict) };
  fs.writeFileSync(path.join(candDir, 'score.json'), JSON.stringify(s, null, 2));
  scores.push(s);
}
fs.writeFileSync(path.join(DATA, 'scores.json'), JSON.stringify(scores, null, 2));
console.log(JSON.stringify(scores));
