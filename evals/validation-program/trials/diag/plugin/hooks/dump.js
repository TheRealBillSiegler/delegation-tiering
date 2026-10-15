// Log the effort level Claude Code reports to a hook plus the effort-related env a hook sees.
// Records names/levels only; no other environment values are written.
const fs = require('fs');
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  let input = {};
  try { input = JSON.parse(raw); } catch (e) { /* log anyway */ }
  const rec = {
    label: process.env.EVAL_DIAG_LABEL || null,
    tool: input.tool_name || null,
    hookEffort: input.effort === undefined ? null : input.effort,
    envCLAUDE_EFFORT: process.env.CLAUDE_EFFORT === undefined ? null : process.env.CLAUDE_EFFORT,
    envCLAUDE_CODE_EFFORT_LEVEL: process.env.CLAUDE_CODE_EFFORT_LEVEL === undefined ? null : process.env.CLAUDE_CODE_EFFORT_LEVEL,
  };
  // EVAL_* variables reach the eval child, so the log directory travels as EVAL_DIAG_DIR.
  const dir = process.env.EVAL_DIAG_DIR;
  if (!dir) return;
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(require('path').join(dir, 'effort-log.jsonl'), JSON.stringify(rec) + '\n');
});
