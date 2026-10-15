// Run one `claude -p` child with a stripped environment, a budget gate, and a cost ledger.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { DATA } from './paths.mjs';

export const BUDGET_USD = 25;
export const LEDGER = path.join(DATA, 'costs.jsonl');
// Session variables a parent Claude Code session would otherwise leak into the child.
export const STRIP_ENV = [
  'CLAUDECODE', 'CLAUDE_CODE_CHILD_SESSION', 'CLAUDE_CODE_ENTRYPOINT', 'CLAUDE_CODE_SESSION_ID',
  'CLAUDE_CODE_MESSAGING_SOCKET', 'CLAUDE_CODE_MESSAGING_TOKEN', 'CLAUDE_CODE_SESSION_ATTENDED',
  'CLAUDE_PID', 'CLAUDE_EFFORT',
];

/** Return the cumulative total_cost_usd recorded in the ledger. */
export function spentUsd() {
  if (!fs.existsSync(LEDGER)) return 0;
  return fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean)
    .reduce((s, l) => s + (Number(JSON.parse(l).total_cost_usd) || 0), 0);
}

/** Build the argv for a read-only `claude -p` child. */
export function childArgs({ model, effort, tools, jsonSchema }) {
  const args = ['-p', '--model', model, '--output-format', 'json', '--effort', effort,
    '--tools', tools.join(','), '--permission-mode', 'dontAsk', '--no-session-persistence'];
  if (jsonSchema) args.push('--json-schema', JSON.stringify(jsonSchema));
  return args;
}

/**
 * Run a child with prompt on stdin from cwd. Refuse to start once the ledger
 * reaches the budget. Write raw stdout to outFile and append the cost to the ledger.
 */
export function runChild({ kind, candidate, cwd, prompt, outFile, dryRun, ...opts }) {
  const args = childArgs(opts);
  const spent = spentUsd();
  const record = { kind, candidate, model: opts.model, effort: opts.effort, tools: opts.tools, cwd, argv: ['claude', ...args] };
  if (dryRun) return { ...record, dryRun: true, spentBefore: spent };
  if (spent >= BUDGET_USD) return { ...record, refused: `budget reached: $${spent.toFixed(2)} >= $${BUDGET_USD}` };
  const env = { ...process.env };
  for (const k of STRIP_ENV) delete env[k];
  const t0 = Date.now();
  const r = spawnSync('claude', args, { cwd, env, input: prompt, encoding: 'utf8', maxBuffer: 256 << 20, windowsHide: true });
  fs.writeFileSync(outFile, r.stdout ?? '');
  if (r.stderr) fs.writeFileSync(outFile + '.stderr.txt', r.stderr);
  let parsed = null;
  try { parsed = JSON.parse(r.stdout); } catch { /* recorded below */ }
  const entry = {
    ts: new Date().toISOString(), kind, candidate, model: opts.model, effort: opts.effort,
    exitCode: r.status, wallMs: Date.now() - t0,
    total_cost_usd: parsed?.total_cost_usd ?? null, num_turns: parsed?.num_turns ?? null,
    is_error: parsed?.is_error ?? null, parseError: parsed ? null : 'stdout not JSON',
  };
  fs.appendFileSync(LEDGER, JSON.stringify(entry) + '\n');
  return { ...record, ...entry, result: parsed };
}
