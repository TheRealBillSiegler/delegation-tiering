#!/usr/bin/env node
// Generate the Phase 2 trial suite (10 cases = 5 tasks x {nowords, words}) under
// ./cases/. The steering text is read verbatim from the owner's rule file and
// CLAUDE.md so the "words" arm cannot drift from the real setup.
// Usage: node make-cases.js            (writes ./cases/)
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'cases');
const HOME = process.env.USERPROFILE || process.env.HOME;
const RULE = path.join(HOME, '.claude', 'rules', 'delegation.md');
const CLAUDE_MD = path.join(HOME, '.claude', 'CLAUDE.md');
const FIXTURE_SRC = process.env.VALIDATION_FIXTURE || (() => { throw new Error('VALIDATION_FIXTURE is not set; point it at the read-only fixture copy of the plugin repo'); })();
// add_dirs may only name directories inside the case directory, so each case gets its own
// copy of the fixture (gitignored; regenerated here) and the prompt names that copy.
const caseFixture = (name) => `${OUT.split(path.sep).join('/')}/${name}/fixture`;

const TASKS = [
  { name: 'inventory', row: 'haiku (mechanical scouting)',
    prompt: (FIXTURE) => `Use a subagent to list every Markdown file under ${FIXTURE} with its first heading, then give me the list.` },
  { name: 'extract', row: 'haiku (verbatim extraction)',
    prompt: (FIXTURE) => `Have a subagent copy out, word for word, every row of the ladder table in ${FIXTURE}/skills/delegation-tiering/SKILL.md.` },
  { name: 'fidelity', row: 'sonnet (doc research / consistency check)',
    prompt: (FIXTURE) => `Delegate this: read ${FIXTURE}/hooks/agent-model-gate.js and ${FIXTURE}/hooks/README.md, and list every place the README's description disagrees with the code.` },
  { name: 'lens', row: 'sonnet, high effort (lens review)',
    prompt: (FIXTURE) => `Get a subagent to review ${FIXTURE}/scripts/check-drift.js for correctness bugs only — wrong regexes, unhandled errors, off-by-one — with line numbers.` },
  { name: 'gate', row: 'opus (open adversarial review)',
    prompt: (FIXTURE) => `Before I ship this, I want an independent adversarial review of ${FIXTURE}/hooks/agent-model-gate.js: whatever is wrong that nobody has listed yet. Use a fresh subagent so it isn't anchored on this conversation.` },
];

const rule = fs.readFileSync(RULE, 'utf8').replace(/\s+$/, '');
const mdLines = fs.readFileSync(CLAUDE_MD, 'utf8').split(/\r?\n/);
// 1-based lines 7, 8, 16: table header, separator, delegation row.
const rows = [mdLines[6], mdLines[7], mdLines[15]];
if (!rows[0].startsWith('| Convention') || !rows[1].startsWith('|---') || !rows[2].includes('PreToolUse gate')) {
  throw new Error('CLAUDE.md layout changed; the three steering rows are not where expected');
}
const STEERING = `${rule}\n\n${rows.join('\n')}`;

const indent = (s) => s.split('\n').map((l) => (l ? `  ${l}` : '')).join('\n');
const q = (s) => `'${s.replace(/'/g, "''")}'`;

const GRADERS = {
  delegated: { tool: 'Agent', min: 1 },
  'named-model': { tool: 'Agent', input_match: String.raw`"model"\s*:`, min: 1 },
  'no-modelless-call': { tool: 'Agent', input_match: String.raw`^(?![\s\S]*"model"\s*:)`, min: 0, max: 0 },
  'tier-haiku': { tool: 'Agent', input_match: String.raw`"model"\s*:\s*"(?:[\w.-]*[:/.])?(?:claude-)?[Hh]aiku`, min: 1 },
  'tier-sonnet': { tool: 'Agent', input_match: String.raw`"model"\s*:\s*"(?:[\w.-]*[:/.])?(?:claude-)?[Ss]onnet`, min: 1 },
  'tier-opus': { tool: 'Agent', input_match: String.raw`"model"\s*:\s*"(?:[\w.-]*[:/.])?(?:claude-)?[Oo]pus`, min: 1 },
  'tier-fable': { tool: 'Agent', input_match: String.raw`"model"\s*:\s*"(?:[\w.-]*[:/.])?(?:claude-)?[Ff]able`, min: 1 },
  'effort-set': { tool: 'Agent', input_match: String.raw`"effort"\s*:`, min: 1 },
};

fs.rmSync(OUT, { recursive: true, force: true });
for (const t of TASKS) {
  for (const words of [false, true]) {
    const name = `${t.name}-${words ? 'words' : 'nowords'}`;
    const dir = path.join(OUT, name);
    fs.mkdirSync(path.join(dir, 'graders'), { recursive: true });
    const fm = [
      '---',
      `name: ${name}`,
      `description: ${q(`Ladder row: ${t.row}. Setups ${words ? 'D (both) vs B (words only)' : 'C (plugin only) vs A (nothing)'}.`)}`,
      `tags: [${t.name}, ${words ? 'words' : 'nowords'}]`,
      'runs: 1',
      'max_turns: 15',
      'timeout_seconds: 900',
      'allowed_tools: [Agent, Skill, Read, Glob, Grep]',
    ];
    if (words) fm.push('append_system_prompt: |', indent(STEERING));
    fm.push('---', '', t.prompt(caseFixture(name)), '');
    fs.writeFileSync(path.join(dir, 'prompt.md'), fm.join('\n'));
    fs.cpSync(FIXTURE_SRC, path.join(dir, 'fixture'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'case.yaml'),
      ['schema_version: "1.1"', `name: ${name}`, 'context:', '  add_dirs: [fixture]', ''].join('\n'));
    for (const [g, o] of Object.entries(GRADERS)) {
      const lines = ['---', 'type: tool_used', `tool: ${o.tool}`];
      if (o.input_match) lines.push(`input_match: ${q(o.input_match)}`);
      lines.push(`min: ${o.min}`);
      if (o.max !== undefined) lines.push(`max: ${o.max}`);
      lines.push('arm: both', '---', '');
      fs.writeFileSync(path.join(dir, 'graders', `${g}.md`), lines.join('\n'));
    }
  }
}
console.log(`wrote ${TASKS.length * 2} cases to ${OUT}`);
