// Build the sample frame of Fable open-review workers and a seeded draw order.
// Usage: node frame.mjs [seed]
// Writes DATA/frame.jsonl (one record per frame member) and DATA/draw-order.json.
// Prints only aggregate counts.
import fs from 'node:fs';
import path from 'node:path';
import {
  walk, readJsonl, initialPrompt, toolUses, finalOutput,
  firstField, resolvedModels, seededShuffle, writeJson,
} from './lib.mjs';
import { SNAP, DATA } from './paths.mjs';

const SEED = Number(process.argv[2] ?? 20261008);
const START = '2026-09-01T00:00:00Z';
const FABLE_ID = 'claude-fable-5-1';
const REVIEW_RE = /\b(gate|critic|adversarial|verif\w*|review\w*|audit\w*)\b/i;
// Heuristic flag only; the exclusion itself is decided per candidate at examination.
const REVERIFY_RE = /\b(re-?verif\w*|confirm (that )?the fix|verify (that )?the fix|fix(es)? (landed|applied)|check the fixes)\b/i;
const READ_TOOLS = new Set(['Read', 'Glob', 'Grep', 'WebFetch']);
// Harness tools that neither read the target nor change anything.
const NEUTRAL_TOOLS = new Set(['StructuredOutput', 'ToolSearch']);

// Frame rule: the label marks a review, or there is no label and the prompt does.
// A label naming another role (draft, revise, synthesize) keeps a worker out even
// when its prompt mentions review.
const counts = { metas: 0, fable: 0, fableSince: 0, frameLabel: 0, framePromptOnly: 0, outLabeledOtherRole: 0 };
const frame = [];

for (const metaPath of walk(SNAP, /^agent-.*\.meta\.json$/)) {
  counts.metas++;
  const tPath = metaPath.replace(/\.meta\.json$/, '.jsonl');
  if (!fs.existsSync(tPath)) continue;
  let meta;
  try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch { continue; }
  const lines = readJsonl(tPath);
  const models = resolvedModels(lines);
  const isFable = models.includes(FABLE_ID) || /fable/i.test(String(meta.model ?? ''));
  if (!isFable) continue;
  counts.fable++;
  const ts = firstField(lines, 'timestamp');
  if (!ts || ts < START) continue;
  counts.fableSince++;

  const label = [meta.description, meta.workflowPhase].filter(Boolean).join(' | ');
  const promptParts = initialPrompt(lines);
  const prompt = promptParts.join('\n\n');
  const labelHit = REVIEW_RE.test(label);
  const promptHit = REVIEW_RE.test(prompt);
  if (!labelHit && !promptHit) continue;
  if (!labelHit && label) { counts.outLabeledOtherRole++; continue; }
  if (labelHit) counts.frameLabel++; else counts.framePromptOnly++;

  const tools = toolUses(lines).map(b => b.name);
  const toolSet = [...new Set(tools)];
  const nonRead = toolSet.filter(t => !READ_TOOLS.has(t) && !NEUTRAL_TOOLS.has(t));
  const out = finalOutput(lines);
  const rel = path.relative(SNAP, tPath).split(path.sep).join('/');
  frame.push({
    id: path.basename(tPath, '.jsonl').replace(/^agent-/, ''),
    transcript: rel,
    project: rel.split('/')[0],
    workflow: /\/workflows\//.test(rel),
    metaModel: meta.model ?? null,
    metaEffort: meta.effort ?? null,
    resolvedModels: models,
    start: ts,
    cwd: firstField(lines, 'cwd'),
    gitBranch: firstField(lines, 'gitBranch'),
    version: firstField(lines, 'version'),
    label,
    match: labelHit ? 'label' : 'prompt',
    reverifyFlag: REVERIFY_RE.test(label) || REVERIFY_RE.test(prompt.slice(0, 4000)),
    promptTurns: promptParts.length,
    promptChars: prompt.length,
    tools: toolSet,
    nonReadTools: nonRead,
    outputKind: out.kind,
  });
}

frame.sort((a, b) => (a.transcript < b.transcript ? -1 : 1));
fs.mkdirSync(DATA, { recursive: true });
fs.writeFileSync(path.join(DATA, 'frame.jsonl'), frame.map(r => JSON.stringify(r)).join('\n') + '\n');
const order = seededShuffle(frame.map(r => r.id), SEED);
writeJson(path.join(DATA, 'draw-order.json'), { seed: SEED, prng: 'mulberry32 + Fisher-Yates over frame sorted by transcript path', order });

const agg = {
  seed: SEED,
  ...counts,
  frame: frame.length,
  reverifyFlagged: frame.filter(r => r.reverifyFlag).length,
  readOnlyTools: frame.filter(r => r.nonReadTools.length === 0).length,
  workflowWorkers: frame.filter(r => r.workflow).length,
  withMetaEffort: frame.filter(r => r.metaEffort).length,
  outputKinds: frame.reduce((m, r) => ((m[r.outputKind] = (m[r.outputKind] ?? 0) + 1), m), {}),
};
console.log(JSON.stringify(agg, null, 2));
