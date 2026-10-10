# Hooks

The plugin's deterministic layer: one PreToolUse gate that enforces explicit model choice, one PostToolUse ledger that records every delegation. Both are wired by `hooks.json` with matcher `Agent|Workflow`, in [exec form](https://code.claude.com/docs/en/hooks) — `command` is `node` and the script path is an `args` element, so Claude Code spawns the binary directly with no shell between it and the script. That is what the docs recommend whenever a hook references a path placeholder, and it means no Git Bash is needed on Windows.

The ledger additionally sets `"async": true`. Nothing reads its output and no decision waits on it, so it runs in the background and adds no blocking time to a delegation. The gate cannot: it returns the allow/deny decision.

```mermaid
flowchart TD
    CALL["Agent or Workflow tool call"] --> GATE["agent-model-gate.js (PreToolUse)"]
    GATE -- "Agent, no model" --> DENY["deny + tier ladder + re-issue instructions"]
    GATE -- "Agent, explicit model" --> ALLOW["allow + one-line tier reminder"]
    GATE -- "Agent fork, or FORCE on" --> NOTE["allow + note: the session or forced model runs"]
    GATE -- "Workflow, script/scriptPath" --> LINT{"lint script text"}
    LINT -- "model-less agent() found" --> DENY
    LINT -- "clean" --> ALLOW2["allow + clean-lint note"]
    GATE -- "Workflow, predefined name" --> OPEN["fail open + reminder (no text to lint)"]
    DENY --> LOG["denied:true line to ledger"]
    ALLOW & ALLOW2 --> RUN["tool runs"] --> LED["delegation-ledger.js (PostToolUse)<br>one JSONL line per delegation"]
```

In text: a call reaches the gate, which denies an Agent call missing a model, allows one with an explicit model, allows a fork or any Agent call made while `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` is on with a note, lints Workflow script text and denies or allows depending on whether every agent() call names a model, fails open with a reminder when there is no script text to lint, and logs every denial or completed run to the ledger — the same branches the list below spells out.

## `agent-model-gate.js`

- **Agent branch:** denies any call whose `tool_input` lacks `model`; the denial carries the tier ladder so the orchestrator can re-issue with an explicit choice. Allow responses inject only a one-line reminder. Two calls cannot name a model and are allowed with a note: a fork (`subagent_type: "fork"`), which runs on the session model and ignores `model` (its note says forking chooses the session's tier), and any Agent call while `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` is on, which removes the Agent tool's `model` parameter. Under that variable the Workflow lint still asks for a `model` on each `agent()` call, though the forced model runs either way.
- **Workflow branch:** lints the launch-time script text (`tool_input.script`, or the file at `tool_input.scriptPath` when readable) for `agent()` calls without a `model` option, and denies the launch quoting the offending call — the only deterministic contact point for workflow-internal spawns, which no hook can gate individually. The lint is a string heuristic, not a JS parse. Each `agent(` call is judged on its own balanced argument list, read with string literals and comments blanked: a call passes when that list holds a `model` key (`model:`, or a quoted `'model':` or `"model":`). A `model:` in later code, or in the call's prompt string, does not count. A call whose model arrives through a variable, a spread, or a shared options object has no such key and is flagged; `/* model-gate:allow */` suppresses it only when the comment sits inside that call's own argument list, so a marker after the closing paren or in a file header suppresses nothing. A script cut off mid-call (an unbalanced list) falls back to testing the text up to the next call. Predefined workflow names fail open with a reminder; an unreadable `scriptPath` fails open silently.
- **Failure posture:** unparseable stdin fails open (a broken hook must not block all delegation); every deny appends a `{ts, tool, denied: true, detail}` line to the ledger so gate value is countable.
- **`--test`:** embedded self-check for the lint's regression cases (call-span boundaries, literal blanking, own-argument scoping) — run `node agent-model-gate.js --test` to verify the lint on your install. The fuller contract suite lives in the plugin repo: [evals/contract/](https://github.com/TheRealBillSiegler/delegation-tiering/tree/main/evals/contract).
- **Ledger path:** resolved in `ledger.js`, shared with the ledger hook — `DELEGATION_LEDGER` (contract tests use this), else `${CLAUDE_PLUGIN_DATA}/delegation-ledger.jsonl`, else `~/.claude/delegation-ledger.jsonl` for runs outside a plugin context.

## `delegation-ledger.js`

PostToolUse observability, running async. Agent calls log `{ts, tool, cwd, model, agentType, description}`; Workflow launches log `modelLiterals`, the model strings scanned out of the script text — one entry per literal, not per agent spawned. The gate makes models *explicit*; the ledger makes tier choices *reviewable* — inspect it to see whether tiering judgment held, not just whether models were named.

Contract tests for both hooks live in the repo, not the installed payload: [`evals/contract/`](https://github.com/TheRealBillSiegler/delegation-tiering/tree/main/evals/contract).
