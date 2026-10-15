# Drift report — 2026-10-15

**Trigger:** manual run of `scripts/check-drift.js` on the `release/0.2.0` tree before release, at the owner's request. Baseline captured 2026-09-14T15:38:39Z at Claude Code 2.1.263; the CLI on `PATH` reports 2.1.296. The check flagged twelve pages: eight changed since the baseline (advisor.md, hooks-guide.md, hooks.md, memory.md, plugins-reference.md, sub-agents.md, tools-reference.md, workflows.md) and four with no baseline (context-window.md, env-vars.md, model-config.md, plugins/cli-reference.md), cited in COVERAGE since the 2026-10-08 report. The 2026-10-08 report scoped the same pages as they stood that day, and its corrections shipped in this release; this pass tests whether each claim's cited support holds in today's text.

## Verdicts

### hooks.md — CLAIM-AFFECTING (rows A9, A14; skill Enforcement)

- The page documents a fail-closed hook setting: "To block the action instead, set `"onFailure": "block"` on a `command` or `http` hook. The default value is `"continue"`. Requires Claude Code v2.1.295 or later." A hook that fails to start counts as a failure under that setting.
- A failed PreToolUse hook produces a transcript notice: "The action goes ahead, and on events such as `PreToolUse` you see a `<hook name> hook error` notice in the transcript." The skill's "without notice" overstated what the page says; the 2026-09-14 headless run showed no notice to the model.
- The common `effort` object is present "when the current model supports the effort parameter", so a SubagentStop for a Haiku 4.5 delegation has no effort level.
- "Not every SubagentStop event comes from a subagent Claude spawned": internal agents for prompt suggestions and `/btw` side questions fire it too.
- Rows A1, A2, A3, A7, A8 (hook half), A15, and A20 (hook half) hold. No new event gates or observes `agent()` spawns inside a workflow; `PreModelSwitch` and `PostModelSwitch` cover session model switches only.

### model-config.md — CLAIM-AFFECTING (row A21)

- Row A21 named two models. The page lists three cases: "Fable 5.1, Fable 5, and Opus 5.5: biology-flagged requests re-run on Opus 5, and cybersecurity-flagged requests re-run on Opus 4.8"; "Sonnet 5.5: cybersecurity-flagged requests re-run on Sonnet 5"; "Opus 5: cybersecurity-flagged requests re-run on Opus 4.8".
- A configured fallback chain reaches subagents: "Claude Code also applies the chain to subagents."
- Row A18 holds: the effort table lists Haiku 5.5 and omits Haiku 4.5, the 5.5 models default to `medium`, and the `haiku` alias resolves to Haiku 5.5 on the Anthropic API from v2.1.293.

### plugins-reference.md — CLAIM-AFFECTING (row A17; README off switch)

- The Bash half of row A17 is documented: "The variables aren't present in the environment of commands Claude runs through the Bash tool, in the main session or in a subagent." The `!` preprocessing half has no basis on the page.
- The page has no mention of `disable`; the README's off-switch link pointed here. plugins/cli-reference.md documents "`/plugin disable <plugin>` … disables it".
- Row A10 holds.

### sub-agents.md — CLAIM-AFFECTING (rows A8, A19, A20)

- A mod can replace the model the gate checked: "If an installed mod sets a model in its `agent.spawn` hook, Claude Code uses that model in place of the per-invocation parameter." Row A8 called the mod hook docs silent.
- The fork payload has a documented basis: "Claude starts a fork by requesting the `fork` subagent type through the Agent tool."
- `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` applies to workflow agents: "To apply one model to every subagent, teammate, and workflow agent, also set `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` to `1`." Under it a script's `model:` has no effect, and the launch lint still requires one.
- Rows A11, A12, and the skill's fork rule hold.

### NOISE

advisor.md (A13 holds), context-window.md (A6 holds), env-vars.md (A20's on-values hold), hooks-guide.md (A1 and A9 hold), memory.md (A6 and A12 hold), plugins/cli-reference.md (A10 holds), tools-reference.md (A2 holds), workflows.md (A11 and the skill's model-order sentence hold; the page states nothing about a `model` in `meta.phases`).

## Corrections made in this release

- COVERAGE row A8 cites sub-agents.md for the mod override on subagents and keeps the workflow-agent half docs silent.
- COVERAGE row A9 and the intro name the `onFailure: "block"` setting and state that `hooks/hooks.json` leaves it unset.
- COVERAGE row A14 quotes the effort qualifier and the internal-agents sentence.
- COVERAGE row A17 cites plugins-reference.md for the Bash half; the `!` half stays empirical.
- COVERAGE row A19 cites the fork-request sentence beside the 2026-10-08 probe.
- COVERAGE row A20 records that the setting reaches workflow agents.
- COVERAGE row A21 lists every fallback case on the page and the fallback chain.
- The skill's Enforcement sentence says the model sees no error from a gate that cannot start, and its verification stamp reads 2026-10-15.
- The README's off-switch link points to the plugins CLI reference.

## Open for the owner

Setting `"onFailure": "block"` on the gate's two hooks makes a gate that cannot start deny every Agent and Workflow call. That is a change to enforcement, and the research record notes that an unknown hook key on an older Claude Code may break hook loading, as the 0.1.1 manifest defect did. This report leaves the setting unchanged.

## Method and limitations

One read-only `sonnet` session fetched the twelve pages as markdown with curl on 2026-10-15 and checked each COVERAGE row and each mechanical claim in the skill and README against the current text. I re-checked every quote this report and the corrections rely on against the saved copies. No stored copy of earlier page text exists, so the verdicts test current support and do not date individual changes. The session grepped the three largest pages (hooks.md, env-vars.md, sub-agents.md) for each claim's terms instead of reading them whole. The mods reference, the changelog, and the platform model pages were not fetched.

## Disposition

Claim-affecting; the corrections above land in the release PR, and `check-drift.js --update` refreshes `anchors.json` in the same PR after the edits.
