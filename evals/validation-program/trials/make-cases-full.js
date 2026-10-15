#!/usr/bin/env node
// Generate the Phase 2 full-run suite per PROTOCOL.md: 40 cases (20 tasks x {without text, with text}),
// named c01..c40 in a seeded shuffle, under ./cases-full/. The steering text is read verbatim from the
// owner's rule file and CLAUDE.md lines 7, 8 and 16 at generation time. Each case carries its own copy of
// the fixture (the plugin repo at db5e297) under the neutral directory name `fx`. The case -> task/condition
// key is written outside the repo (see KEY_PATH) so no path the orchestrator sees names the condition.
// Usage: node make-cases-full.js [--seed N]
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUT = path.join(__dirname, 'cases-full');
const LABELS = JSON.parse(fs.readFileSync(path.join(__dirname, 'labels.json'), 'utf8'));
const PROTOCOL = path.join(__dirname, 'PROTOCOL.md');
const PROTOCOL_SHA256 = 'b28bebc70418b59b4a191cb081b6fad90ce6b370153e0f0bea7759fbdb1515d8'; // over LF line endings
const KEY_PATH = path.join(process.env.VALIDATION_DATA || (() => { throw new Error('VALIDATION_DATA is not set; point it at the private data directory'); })(), 'trials-full', 'key.json');
const HOME = process.env.USERPROFILE || process.env.HOME;
const RULE = path.join(HOME, '.claude', 'rules', 'delegation.md');
const CLAUDE_MD = path.join(HOME, '.claude', 'CLAUDE.md');
const FIXTURE_SRC = process.env.VALIDATION_FIXTURE || (() => { throw new Error('VALIDATION_FIXTURE is not set; point it at the read-only fixture copy of the plugin repo'); })();
const SEED = Number((process.argv.indexOf('--seed') > 0 && process.argv[process.argv.indexOf('--seed') + 1]) || 20261009);

// Mulberry32: small seeded PRNG, so the shuffle is reproducible from the recorded seed.
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The protocol is frozen: refuse to generate against a changed copy, and refuse prompts that are not
// verbatim table cells of it.
const protoText = fs.readFileSync(PROTOCOL, 'utf8').replace(/\r\n/g, '\n');
const sha = crypto.createHash('sha256').update(protoText).digest('hex');
if (sha !== PROTOCOL_SHA256) throw new Error(`PROTOCOL.md hash ${sha} does not match the registered ${PROTOCOL_SHA256}`);
for (const t of LABELS.tasks) {
  if (!protoText.includes(`| ${t.id} | ${t.prompt} | ${t.labelText} |`)) throw new Error(`${t.id}: labels.json text is not a verbatim protocol row`);
}

const rule = fs.readFileSync(RULE, 'utf8').replace(/\s+$/, '');
const mdLines = fs.readFileSync(CLAUDE_MD, 'utf8').split(/\r?\n/);
const rows = [mdLines[6], mdLines[7], mdLines[15]]; // 1-based lines 7, 8, 16
if (!rows[0].startsWith('| Convention') || !rows[1].startsWith('|---') || !rows[2].includes('PreToolUse gate')) {
  throw new Error('CLAUDE.md layout changed; the three steering rows are not where expected');
}
const STEERING = `${rule}\n\n${rows.join('\n')}`;

const indent = (s) => s.split('\n').map((l) => (l ? `  ${l}` : '')).join('\n');
const q = (s) => `'${s.replace(/'/g, "''")}'`;
// Cases are grouped g1..g5 (8 each). The harness denies Read and Edit on every sibling of each ancestor of the
// case directory and passes the list on the command line, so 40 flat siblings overran Windows' 32,767-character
// command-line limit (ENAMETOOLONG). Grouping cuts the siblings per case from 39 to 11.
const groupOf = (i) => `g${Math.floor(i / 8) + 1}`;
const fxPath = (group, name) => `${OUT.split(path.sep).join('/')}/${group}/${name}/fx`;

// Free graders only (tool_used), all arm: both, as cross-checks on the transcript parser.
const MODEL_TIER = (t) => String.raw`"model"\s*:\s*"(?:[\w.-]*[:/.])?(?:claude-)?[${t[0].toUpperCase()}${t[0]}]${t.slice(1)}`;
const GRADERS = {
  delegated: { tool: 'Agent', min: 1 },
  'named-model': { tool: 'Agent', input_match: String.raw`"model"\s*:`, min: 1 },
  'no-modelless-call': { tool: 'Agent', input_match: String.raw`^(?![\s\S]*"model"\s*:)`, min: 0, max: 0 },
  'tier-haiku': { tool: 'Agent', input_match: MODEL_TIER('haiku'), min: 1 },
  'tier-sonnet': { tool: 'Agent', input_match: MODEL_TIER('sonnet'), min: 1 },
  'tier-opus': { tool: 'Agent', input_match: MODEL_TIER('opus'), min: 1 },
  'tier-fable': { tool: 'Agent', input_match: MODEL_TIER('fable'), min: 1 },
  'effort-set': { tool: 'Agent', input_match: String.raw`"effort"\s*:`, min: 1 },
  // Workflow-tool indicators. The script travels as a JSON string, so quotes inside it are escaped (\").
  'wf-launched': { tool: 'Workflow', min: 1 },
  'wf-model-literal': { tool: 'Workflow', input_match: String.raw`\bmodel\s*:\s*\x5c?["'\x60]`, min: 1 },
  'wf-effort-literal': { tool: 'Workflow', input_match: String.raw`\beffort\s*:\s*\x5c?["'\x60]`, min: 1 },
};

// 20 tasks x 2 conditions, shuffled with the seed, then named c01..c40.
const pairs = [];
for (const t of LABELS.tasks) for (const text of [false, true]) pairs.push({ task: t.id, text });
const rnd = mulberry32(SEED);
for (let i = pairs.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pairs[i], pairs[j]] = [pairs[j], pairs[i]]; }

fs.rmSync(OUT, { recursive: true, force: true });
const key = {};
pairs.forEach((p, i) => {
  const name = `c${String(i + 1).padStart(2, '0')}`;
  const task = LABELS.tasks.find((t) => t.id === p.task);
  const group = groupOf(i);
  const dir = path.join(OUT, group, name);
  fs.mkdirSync(path.join(dir, 'graders'), { recursive: true });
  const fm = ['---', `name: ${name}`, `description: ${q('Phase 2 full-run case.')}`,
    'runs: 3', 'max_turns: 15', 'timeout_seconds: 900', 'allowed_tools: [Agent, Skill, Read, Glob, Grep]'];
  if (p.text) fm.push('append_system_prompt: |', indent(STEERING));
  fm.push('---', '', task.prompt.split('<fx>').join(fxPath(group, name)), '');
  fs.writeFileSync(path.join(dir, 'prompt.md'), fm.join('\n'));
  fs.cpSync(FIXTURE_SRC, path.join(dir, 'fx'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'case.yaml'),
    ['schema_version: "1.1"', `name: ${name}`, 'context:', '  add_dirs: [fx]', ''].join('\n'));
  for (const [g, o] of Object.entries(GRADERS)) {
    const lines = ['---', 'type: tool_used', `tool: ${o.tool}`];
    if (o.input_match) lines.push(`input_match: ${q(o.input_match)}`);
    lines.push(`min: ${o.min}`);
    if (o.max !== undefined) lines.push(`max: ${o.max}`);
    lines.push('arm: both', '---', '');
    fs.writeFileSync(path.join(dir, 'graders', `${g}.md`), lines.join('\n'));
  }
  key[name] = { group, task: p.task, text: p.text, arms: p.text ? { with: 'D', without: 'B' } : { with: 'C', without: 'A' } };
});
fs.mkdirSync(path.dirname(KEY_PATH), { recursive: true });
fs.writeFileSync(KEY_PATH, JSON.stringify({ seed: SEED, protocolSha256: sha, generated: new Date().toISOString(),
  steeringSha256: crypto.createHash('sha256').update(STEERING).digest('hex'), cases: key }, null, 1));
console.log(`wrote ${pairs.length} cases to ${OUT}; seed ${SEED}; key at ${KEY_PATH}`);
