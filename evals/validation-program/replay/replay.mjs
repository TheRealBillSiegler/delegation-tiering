// Reconstruct each replayable candidate's tree and replay its verbatim prompt on Opus.
// Usage: node replay.mjs [--dry-run] [--only <n>]
// Reads DATA/examine.json (replayable entries). For each: git archive <sha> into
// DATA/tree-<n>/ (read-only against the repo: no worktree, branch, or .git write),
// then run the prompt from DATA/candidates/<n>-<id>/prompt.txt inside that tree.
// Writes DATA/candidates/<n>-<id>/opus-replay.json and replay-setup.json.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { DATA } from './paths.mjs';
import { runChild } from './child.mjs';

const DRY = process.argv.includes('--dry-run');
const onlyIdx = process.argv.indexOf('--only');
const ONLY = onlyIdx > 0 ? Number(process.argv[onlyIdx + 1]) : null;
const MODEL = 'claude-opus-5-5';
const DEFAULT_EFFORT = 'xhigh'; // the 0.1.3 ladder's band for the open-adversarial-review row
const TOOLS = ['Read', 'Glob', 'Grep', 'WebFetch'];

const exam = JSON.parse(fs.readFileSync(path.join(DATA, 'examine.json'), 'utf8'));
const selected = exam.results.filter(x => x.replayable && (ONLY == null || x.n === ONLY));
console.log(`selected for replay: ${selected.length} of ${exam.examined} examined`);

for (const x of selected) {
  const candDir = path.join(DATA, 'candidates', `${String(x.n).padStart(2, '0')}-${x.id}`);
  const tree = path.join(DATA, `tree-${x.n}`);
  const archiveCmd = `git -C "${x.repo}" archive ${x.sha} | tar -x -C "${tree}"`;
  if (!DRY && !fs.existsSync(tree)) {
    // Same as archiveCmd, without a shell: git archive's stdout feeds tar's stdin.
    fs.mkdirSync(tree, { recursive: true });
    const tarball = execFileSync('git', ['-C', x.repo, 'archive', x.sha], { maxBuffer: 1 << 30 });
    execFileSync('tar', ['-x', '-C', tree], { input: tarball });
  }
  const effort = x.metaEffort ?? DEFAULT_EFFORT;
  const prompt = fs.readFileSync(path.join(candDir, 'prompt.txt'), 'utf8');
  const setup = {
    archiveCmd, tree, model: MODEL, effort, effortSource: x.metaEffort ? 'meta.effort' : 'default (unrecorded)',
    tools: TOOLS, originalVersion: x.version, originalCwd: x.cwd,
    knownDifferences: [
      'original ran as a workflow subagent with the harness system prompt; replay runs as a top-level -p session',
      'original returned through a StructuredOutput tool whose schema is not in the transcript; replay returns free text',
      'relayed user request and computed-task headers are passed verbatim as one stdin prompt instead of two turns',
      'replay cwd is an archived tree at a different absolute path; absolute paths in the prompt point at the live repo',
      'plugins, rules, CLAUDE.md, and hooks load from the current machine state, not the state at the original start time',
    ],
  };
  fs.writeFileSync(path.join(candDir, 'replay-setup.json'), JSON.stringify(setup, null, 2));
  const r = runChild({
    kind: 'replay', candidate: x.n, cwd: tree, prompt, dryRun: DRY,
    outFile: path.join(candDir, 'opus-replay.json'), model: MODEL, effort, tools: TOOLS,
  });
  console.log(JSON.stringify({ candidate: x.n, dryRun: !!r.dryRun, refused: r.refused ?? null, cost: r.total_cost_usd ?? null, argv: r.argv.join(' ') }));
  if (r.refused) break;
}
