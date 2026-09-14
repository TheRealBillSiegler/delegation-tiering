# Drift report — 2026-09-14

**Trigger:** manual run of `scripts/check-drift.js`, not the weekly schedule (the Windows scheduled task was unregistered 2026-09-10, per docs/research/advisor-and-ladder-proposal-2026-09-03.md). Baseline captured 2026-08-15T21:55Z at Claude Code 2.1.224; the installed version is now 2.1.263 or later. All seven anchored pages in `scripts/anchors.json` hash-changed.

## Verdicts

### hooks-guide.md — NOISE

Fetched twice. The PreToolUse deny example is unchanged in substance: `{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny", "permissionDecisionReason": "..."}}`, matching A1. The page grew several new hook events (`PostToolBatch`, `TeammateIdle`, `WorktreeCreate`/`WorktreeRemove`, `PreModelSwitch`/`PostModelSwitch`, `Elicitation`) and new sections (agent-based hooks, HTTP hooks) — additive content, no anchored claim contradicted.

### hooks.md — CLAIM-AFFECTING (rows A3, A9)

- **A1**: SUPPORTED — same `permissionDecision`/`permissionDecisionReason` fields.
- **A5**: SUPPORTED — `PostToolUse`: "After a tool call succeeds" (generic, covers Agent/Workflow as tool calls).
- **A7**: SUPPORTED, verbatim: "When a subagent calls a tool, tool events such as `PreToolUse` and `PostToolUse` fire the same configured hooks as in the main conversation, and the input carries the `agent_id` and `agent_type` common input fields that identify the subagent." (More detail than the row currently cites — `agent_id`/`agent_type` are now named — but nothing contradicts it.)
- **A3**: GONE. Three separate targeted fetches of hooks.md found no `tool_input` example for the Agent tool and no `model` field documented anywhere on the page; the only PreToolUse `tool_input` example shown is Bash's `{"command": "..."}`. I also checked the two pages a schema like this would plausibly have moved to — tools-reference.md and hooks-guide.md — neither shows it either. COVERAGE row A3 currently cites hooks.md for this schema (re-pointed there 2026-08-09); that citation no longer resolves to visible content.
- **A9**: CHANGED. Current text: "A hook that can't start lands in the same non-blocking bucket. When the script path doesn't exist or isn't executable, the shell exits with a code like 127 and you see the same notice with the interpreter's message, for example `Failed with non-blocking status code: /bin/sh: /path/to/hook.sh: No such file or directory`. For most hook events, the action proceeds." Fail-open still holds (the action proceeds), but a notice with the interpreter's error text is shown — this contradicts the "no error" clause in COVERAGE row A9 and README.md line 46. The 2026-09-11 claims audit found the same thing against a fetch on that date; this is the same finding reconfirmed against the live page three days later.

### memory.md — NOISE

- **A12**: SUPPORTED on both halves. Load order: "The table below lists them in load order, from broadest scope to most specific" (Managed policy, User, Project, Local). Subdirectory files: "Instead of loading them at launch, they are included when Claude reads files in those subdirectories." Rules at session start: "Rules without `paths` frontmatter are loaded at launch with the same priority as `.claude/CLAUDE.md`."
- **A6**: SUPPORTED for "load at session start" ("User-level rules are loaded before project rules"). One observation, not a correction: the page's explicit compaction-survival statement — "Project-root CLAUDE.md survives compaction: after `/compact`, Claude re-reads it from disk and re-injects it into the session" — names CLAUDE.md specifically, not `~/.claude/rules/*.md`. A6's "persist" clause isn't restated for rules files on this page. Not a contradiction; worth a citation check if the row is ever re-verified.

### plugins-reference.md — NOISE

- **A10**: SUPPORTED, verbatim: "`${CLAUDE_PLUGIN_DATA}`... Persistent directory that survives plugin updates, created on first reference" and "All three [environment variables] are exported as environment variables to hook processes." Uninstall/`--keep-data` behavior confirmed: "The data directory is deleted automatically when you uninstall the plugin... pass `--keep-data` to preserve it."
- One observation, not a correction: README.md line 51 cites this page for "`/plugin disable` deactivates the components." The page documents that `plugin disable` exists and can fail on a dependent plugin, but I found no passage stating what happens to a disabled plugin's individual components (skills, hooks, MCP servers). I can't tell from this pass whether that's new drift or a pre-existing thin citation — no baseline text to diff against.

### sub-agents.md — NOISE

- **A11** (effort frontmatter): SUPPORTED, verbatim: "`effort` | No | Effort level when this subagent is active. Overrides the session effort level. Default: inherits from session. Options: `low`, `medium`, `high`, `xhigh`, `max`."
- **A12** (isolated context, summary only): SUPPORTED, verbatim: "the subagent does that work in its own context and returns only the summary" and "Each subagent starts with a fresh, isolated context window."

### tools-reference.md — NOISE

- **A2**: SUPPORTED, and more explicit than before: "Hook `matcher` fields use bare tool names, not the parenthesized rule format." Both `Agent` and `Workflow` are listed as tool names in the tool table.
- Confirms the A3 finding from a second angle: this page's Agent row describes behavior only ("spawns a subagent... returns a single text result") with no `tool_input` schema or `model` field.

### workflows.md — CLAIM-AFFECTING (row A11)

- The prompt-cache premise A11 rests on is intact: "Two agents that run with the same model, effort level, agent type, tools, output schema, and working directory build the same tools-and-system-prompt prefix" — still presupposes agents in one run can differ by model and effort level.
- The clause "defers the option list to the Agent SDK reference" is wrong, confirming the 2026-09-11 audit's finding independently. The page's Agent SDK Reference link is scoped to the *Workflow tool's own inputs* — "For the Workflow tool's inputs, see its entry in the Agent SDK reference" — not to `agent()` call options. The per-spawn `agent()` option reference is the bundled skill: "Before you edit or ask, run the `/workflow-authoring` bundled skill to load the script-writing reference Claude works from."

## Advisor page (not anchored — checked per step 5, not part of the drift verdict above)

Fetched `code.claude.com/docs/en/advisor` 2026-09-14. The research record backed two claims with live tests only, marked docs-silent; the page now states both generally:

- Subagent inheritance, verbatim: "Subagents inherit the configured advisor and apply the same pairing check against their own model." The research record's evidence table backed this with live tests scoped to the `--advisor` flag only (E2, E5, E6); the doc page states it without scoping to entry mode.
- Allowlist exclusion, verbatim: "Claude Code doesn't invoke a saved advisor that your organization's `availableModels` allowlist excludes." The record's backing was live-only (E3a/E3c). Now doc-confirmed.

The record omits one nuance the page states: "For an advisor the table lists as rejected, Claude Code doesn't attach it to the main model's requests... **Subagents whose own model satisfies the pairing may still use the advisor.**" A main-model pairing rejection doesn't disable the advisor for subagents with a different, compatible model.

The proposal in that record is "proposed, nothing applied" (its own header) — no COVERAGE.md advisor rows exist yet, so there is nothing to correct here. This is scoping input for whoever executes that proposal: the two rows it plans to add as "live" evidence can also cite this doc page.

## Corrections needed

- **docs/COVERAGE.md, row A3**: hooks.md no longer shows the Agent `tool_input`/`model` schema. Mark the doc basis docs-silent (no page currently shows it), or keep searching — I checked tools-reference.md and hooks-guide.md and found nothing there either.
- **docs/COVERAGE.md, row A9** and **README.md, line 46**: drop or reword "no error." Current hooks.md/hooks-guide.md show a non-blocking notice ("Failed with non-blocking status code: ...") when a hook can't start; fail-open (no denial, no ledger line) still holds, but a notice does appear. The 2026-09-11 audit flagged this and said to rerun the missing-node canary before rewording — that hasn't happened yet and is out of scope for this read-only pass.
- **docs/COVERAGE.md, row A11**: replace "defers the option list to the Agent SDK reference" — the Agent SDK reference link covers the Workflow tool's own inputs, not `agent()` call options. The per-spawn option reference is the bundled `/workflow-authoring` skill.
- **README.md, line 51** (lower priority, not confirmed as drift): re-check the `/plugin disable` → "deactivates the components" claim against plugins-reference.md; I found the disable command documented but not a statement about component-level effect.

## Method and limitations

Single read-only scoping agent (Sonnet 5), 2026-09-14: read COVERAGE.md, the skill's Enforcement section, README.md lines 40–75, the 2026-08-06 and 2026-08-09 reports, REMEDIATION.md, and anchors.json first. Then fetched all seven anchored pages live with targeted WebFetch prompts per row, quoting verbatim; hooks.md was fetched three times with different asks because A3's absence needed confirming rather than assuming from a thin summary. I did not pull Wayback/pre-drift snapshots this cycle, so I checked each row's current support directly rather than diffing exact hunks the way the 2026-08-09 report did — sufficient for a claim-affecting verdict, not for attributing which hunk of the 08-15→now change removed the A3 schema. WebFetch itself summarizes through a smaller model; I treated a single "not found" as inconclusive and only reported A3 as GONE after it held across three fetches of three different pages. Contract tests, `/delegation-tiering:canary`, and `check-drift.js --update` were not run — out of scope for a scoping pass under REMEDIATION.md step 1.

## Follow-up, same day

The missing-runtime test the A9 correction waited on ran on 2026-09-14, headless (Claude Code 2.1.263, `--model sonnet`), with the node directory removed from `PATH` and one Agent call issued without a model. The call ran, no ledger line was written, and the session's event stream carried no hook event or notice for the PreToolUse hook; the model reported seeing no message. So the notice hooks.md describes did not reach a headless session, and row A9 keeps "no error the model can see" with the doc's interactive notice recorded beside it. Rows A3, A9, and A11 and README line 46 were edited in the same change as this report, and the anchors were refreshed after those edits, as the disposition below asks.

## Disposition

This run is claim-affecting (hooks.md: rows A3, A9; workflows.md: row A11), not noise, so `check-drift.js --update` should not run yet. Per REMEDIATION.md step 2 onward: re-run the contract suite and `/delegation-tiering:canary` live — specifically the missing-node canary before touching A9/line 46's wording — then edit COVERAGE.md rows A3, A9, A11 and README.md line 46 in the same PR, updating "Last verified" dates only for cells actually re-verified. Fold in the README line 51 and A6 observations if convenient; neither blocks the anchor refresh. Refresh `anchors.json` only in that same PR, per the procedure.
