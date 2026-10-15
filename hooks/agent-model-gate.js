#!/usr/bin/env node
// PreToolUse gate enforcing the explicit-model rule from the delegation-tiering
// skill (shipped in this plugin) on both delegation paths:
//  - Agent tool: no explicit `model` -> deny with re-issue instructions;
//    explicit model -> inject a one-line tiering reminder. A fork, and any
//    call while CLAUDE_CODE_SUBAGENT_MODEL_FORCE is on, cannot take a model
//    and is allowed with a note.
//  - Workflow tool: lint the script text for agent() calls with no `model` key
//    in their own argument list -> deny listing the offending calls.
// The workflow lint is a string heuristic, not a JS parse. String literals and
// comments are blanked before the scan (since 0.2.0), so `agent(` or `model:`
// inside a prompt string or a comment is not read as code; a backtick inside a
// template placeholder still desyncs the scan. Each call is judged on its own
// balanced argument list (since 0.2.0), so a `model:` in later code or in the
// call's prompt cannot mask it. A call whose model arrives via a variable, a
// spread, or a shared options object has no `model` key and is flagged:
// suppress it with a `/* model-gate:allow */` comment inside that call's
// argument list. A call with no closing paren (a truncated script) falls back
// to the older check over the text up to the next call.
const fs = require('fs');
const ledger = require('./ledger');

// Denials never reach the PostToolUse ledger (the call is blocked before it
// runs), so the gate records them itself — each denial is a counted, would-be
// violation: the evidence that the deterministic layer is load-bearing.
function logDenial(tool, detail) {
  ledger.append({ tool, denied: true, detail });
}

const TIERS = require('./tiers').LADDER;

// CLAUDE_CODE_SUBAGENT_MODEL_FORCE makes Claude Code run every subagent on one
// model and removes the Agent tool's `model` parameter. It is on for any value
// env-vars.md reads as on: `1`, `true`, `yes`, or `on`, in any casing.
function subagentModelForced() {
  return ['1', 'true', 'yes', 'on'].includes(String(process.env.CLAUDE_CODE_SUBAGENT_MODEL_FORCE || '').trim().toLowerCase());
}

// Same-length blanking of string literals and comments, so an index found in
// the blanked text addresses the original. One literal survives blanking: a
// quoted key that is exactly `model` and followed by a colon (`'model':`) is
// kept as ` model `, so the lint can read it in the blanked text like an
// unquoted key. The tokenizer here already knows which quotes open a literal,
// so a `'model':` inside a prompt string or a comment is still blanked.
function blankLiterals(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') {
      let j = src.indexOf('\n', i);
      if (j < 0) j = n;
      out += ' '.repeat(j - i);
      i = j;
    } else if (c === '/' && d === '*') {
      let j = src.indexOf('*/', i + 2);
      j = j < 0 ? n : j + 2;
      out += ' '.repeat(j - i);
      i = j;
    } else if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n && src[j] !== c) {
        if (src[j] === '\\') j++;
        else if (c !== '`' && src[j] === '\n') break;
        j++;
      }
      j = Math.min(j + 1, n);
      const keyAfter = /\s*:/y;
      keyAfter.lastIndex = j;
      const isModelKey = c !== '`' && src.slice(i + 1, j - 1) === 'model' && src[j - 1] === c && keyAfter.test(src);
      out += isModelKey ? ' model ' : ' '.repeat(j - i);
      i = j;
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

// A call passes on a `model` object key in its own balanced argument list,
// read in the blanked text (a key is `{` or `,` then `model` then `:`), or on
// the escape marker anywhere in that list in the original text. Parens are
// counted in the blanked text only, so a paren in a string or comment cannot
// end the list early. An unbalanced list falls back to the span up to the next
// call, tested on the original text.
function lintScript(src) {
  const missing = [];
  const re = /\bagent\s*\(/g;
  const calls = [];
  let m;
  const scan = blankLiterals(src);
  while ((m = re.exec(scan))) calls.push({ start: m.index, open: m.index + m[0].length - 1 });
  calls.forEach((call, i) => {
    const next = calls[i + 1] ? calls[i + 1].start : src.length;
    let depth = 0;
    let close = call.open;
    for (; close < scan.length; close++) {
      if (scan[close] === '(') depth++;
      else if (scan[close] === ')' && --depth === 0) break;
    }
    const balanced = close < scan.length;
    const own = src.slice(call.start, balanced ? close + 1 : next);
    const hasModel = balanced ? /[{,]\s*model\s*:/.test(scan.slice(call.start, close + 1)) : /model\s*:/.test(own);
    if (!hasModel && !/model-gate:\s*allow/.test(own)) {
      missing.push(src.slice(call.start, next).slice(0, 90).replace(/\s+/g, ' ').trim());
    }
  });
  return missing;
}

// Self-check: `node agent-model-gate.js --test`. Guards the span-boundary logic —
// a space-styled `agent (` must not desync spans and mask the model-less call —
// and the literal blanking: `agent(` in a prompt string or a comment is not a call.
if (process.argv[2] === '--test') {
  const checks = [
    { src: "await agent('x'); await agent ('y', { model: 'haiku' });", want: 1, name: 'space-styled call still linted' },
    { src: "const P = 'which model an agent() call should use'; await agent(P, { model: 'sonnet' });", want: 0, name: 'agent( inside a string is not a call' },
    { src: "// every agent( needs a model\nawait agent('x', { model: 'sonnet' });", want: 0, name: 'agent( inside a comment is not a call' },
    { src: "await agent(`multi\nline agent() prompt`, { model: 'sonnet' }); await agent('z');", want: 1, name: 'template literal blanked, later model-less call still caught' },
    { src: "await agent('x'); const lenses = [{ model: 'haiku' }];", want: 1, name: 'model: in later code does not rescue the call' },
    { src: "await agent('pick the model: haiku', { effort: 'low' });", want: 1, name: 'model: in the prompt string does not count' },
    { src: "await agent('x', { /* model: haiku */ effort: 'low' });", want: 1, name: 'model: in a comment inside the call does not count' },
    { src: "await agent('x', opts /* model-gate:allow */);", want: 0, name: 'marker inside the call allows it' },
    { src: "await agent('x', opts); /* model-gate:allow */", want: 1, name: 'marker after the closing paren does not allow it' },
    { src: "await agent('x', { 'model': 'haiku' }); await agent('y', { \"model\": 'haiku' });", want: 0, name: 'quoted model keys count' },
    { src: "await agent('x', c ? 'model' : 'haiku');", want: 1, name: 'a quoted model that is not a key does not count' },
    { src: "await agent('x', { ...base });", want: 1, name: 'spread options stay flagged' },
    { src: "await agent('ok', { model: 'haiku' }); await agent('x', { effort: 'low'", want: 1, name: 'truncated script: unbalanced call falls back, no crash' },
    { src: "await agent('x', { model: 'haiku'", want: 0, name: 'truncated script: fallback span still sees a model' },
  ];
  let failed = 0;
  for (const c of checks) {
    const got = lintScript(c.src);
    if (got.length !== c.want) {
      failed++;
      console.error('lint self-test FAILED (' + c.name + '): ' + JSON.stringify(got));
    }
  }
  if (failed) process.exit(1);
  console.log('lint self-test OK (' + checks.length + ' cases)');
  process.exit(0);
}

const emit = (out) => console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', ...out } }));
const allow = (context) => emit({ additionalContext: context });
const deny = (reason) => emit({ permissionDecision: 'deny', permissionDecisionReason: reason });

let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  let input = {};
  try {
    input = JSON.parse(raw || '{}');
  } catch {
    // Unparseable input: fail open (no output = allow) rather than block all
    // delegation. Deliberate: the harness serializes tool_input itself, so the
    // realistic trigger is a harness bug. A crash or a missing runtime is a
    // hook failure instead, which hooks.json's onFailure "block" turns into a
    // blocked call.
    return;
  }
  const ti = input.tool_input || {};

  if (input.tool_name === 'Workflow') {
    let src = ti.script;
    if (!src && ti.scriptPath) {
      try {
        src = fs.readFileSync(ti.scriptPath, 'utf8');
      } catch {
        // Unreadable scriptPath: the Workflow tool will surface that itself.
        return;
      }
    }
    if (!src) {
      // Named/predefined workflow: no script text available to lint.
      allow('delegation-tiering: this predefined workflow cannot be linted for explicit per-agent models. Confirm its agent() calls set model explicitly at the lowest sufficient tier (' + TIERS + ').');
      return;
    }
    const missing = lintScript(src);
    if (missing.length) {
      logDenial('Workflow', missing.length + ' model-less call(s)');
      deny('Workflow script has ' + missing.length + ' agent() call(s) without an explicit model: ' + missing.map((s) => '`' + s + '`').join(' ; ') + '. Apply the delegation-tiering skill: set model (and effort) explicitly on every agent() call at the lowest sufficient tier (' + TIERS + '). If a flagged call genuinely sets its model via a variable or shared options object, add a /* model-gate:allow */ comment inside that call.');
    } else {
      allow('delegation-tiering: workflow script lints clean for explicit per-agent models. Confirm each chosen tier is the lowest sufficient; consult the delegation-tiering skill if unsure.');
    }
    return;
  }

  // Agent tool. Checked explicitly rather than reached by falling through the
  // Workflow branch: the matcher in hooks.json is the only thing deciding what
  // arrives here, and widening it to a third delegation surface would otherwise
  // deny every call to that tool for lacking a `model` field it never had — a
  // hard block on a working tool, caused by an edit in a different file.
  if (input.tool_name !== 'Agent') return;

  // A fork runs on the parent session's model and ignores `model` (Agent tool
  // schema; sub-agents.md). Demanding one would make Claude restate a value that
  // never takes effect, and the ledger would record it as a choice. Forking
  // still chooses a tier, the session's own, so the note says when that fits.
  if (ti.subagent_type === 'fork') {
    allow('delegation-tiering: a fork runs on the session model, so forking chooses that tier. Fork only when the session model is the lowest sufficient tier or the shared context is the point; otherwise spawn a non-fork subagent with an explicit model.');
    return;
  }

  if (ti.model) {
    allow('delegation-tiering: chosen tier ' + ti.model + ' — confirm it is the lowest sufficient for this task; consult the delegation-tiering skill if unsure.');
  } else if (subagentModelForced()) {
    // Under CLAUDE_CODE_SUBAGENT_MODEL_FORCE the Agent tool has no `model`
    // parameter (observed live 2026-10-08), so a denial could never be
    // satisfied: the user has chosen one model for every subagent.
    allow('delegation-tiering: CLAUDE_CODE_SUBAGENT_MODEL_FORCE is on, so every subagent runs on the forced model and an Agent call cannot name one; the explicit-model check is off for Agent calls while it is set.');
  } else {
    logDenial('Agent', 'no model');
    deny('Agent call has no explicit model. Apply the delegation-tiering skill: choose the lowest sufficient tier (' + TIERS + ') and re-issue this exact Agent call with the model parameter set. If the agent type’s definition already pins a suitable model, restate that model; if inheriting the session model is genuinely the lowest sufficient choice, state that model explicitly.');
  }
});
