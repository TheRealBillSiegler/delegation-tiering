# Protocol draft, attempt 2: which part of the delegation footprint does the work

Status: draft v0, 2026-10-11, for adversarial review. Not registered; no data. Attempt 1 is `trials/PROTOCOL.md` (frozen 2026-10-09) with results in `trials/FULL-RESULTS.md`.

## Questions

The owner's delegation footprint has three parts: an always-loaded rule (`~/.claude/rules/delegation.md` plus one row of `~/.claude/CLAUDE.md`), a skill the model invokes (`skills/delegation-tiering/SKILL.md`), and a PreToolUse gate that denies an Agent call with no `model`. Attempt 1 compared the rule text against the whole plugin and found the naming effect of the text (13 of 13 first delegations named a model with the text, 3 of 15 without) and no measurable increment from the plugin on tasks where every setup already agreed with the ladder.

Attempt 2 asks, for each part, whether its presence changes the orchestrator's first delegation on tasks where the ladder's answer is not the obvious one:

1. **Floor.** Does the rule raise the rate of naming a model beyond what an unrelated rule of the same length and route produces?
2. **Judgment.** Does the skill, added to the rule, move the chosen tier and effort toward the ladder on tasks where an unaided "lowest sufficient" reading points elsewhere?
3. **Gate.** In the owner's full configuration, does the gate change anything at the orchestrator level: denials, retries, or the final delegation?
4. **Belief.** Does the rule's claim that a gate exists change behavior when no gate is loaded?

The labels come from the 0.1.2 skill text. Agreement with them measures transmission of the doctrine, not whether the doctrine is right; that is Phase 4's question and stays out of scope.

## What attempt 1 could not answer

| Limit in attempt 1 | Target state in attempt 2 |
| --- | --- |
| Most tasks had an answer every setup reached, so the plugin-beyond-text contrast was at ceiling (one task of 13 moved). | The task bank is built from the ladder rules whose answer differs from an unaided reading, each with a pre-registered prediction of the unaided choice. |
| The orchestrator ran at `xhigh` through `CLAUDE_CODE_EFFORT_LEVEL`, and the child's Agent tool offered no `effort` parameter (0 of 129 transcripts), so effort was unmeasurable. | The session effort is set by a route that leaves the `effort` parameter in the Agent tool schema, verified by probe before the run. |
| The rule text told the model a gate fires on every call, in the arm with no gate. | A rule-only arm with no mention of the plugin or gate sits beside the as-is rule. |
| No placebo: the text-versus-nothing contrast cannot separate "this rule" from "any rule". | An unrelated rule of similar length travels by the same route in its own arm. |
| The text arrived through `append_system_prompt`; the owner's sessions load it through the instruction loader. | The rule travels through the instruction loader where the harness permits it (probe I1); otherwise the route difference is a stated limit. |
| The fixture was the plugin's own repository, so a control-arm session could read the ladder from disk. | The fixture is a neutral project that contains no tiering text. |
| Every session ran the delegated work to completion, so a session cost about one dollar and the run stopped on its cost rule at 63 sessions. | The first delegation is captured by an observer hook that records the call and ends the session, so the main run spends on the orchestrator's choice and not on the worker. |
| The skill-versus-rule and gate-versus-skill increments were not separable: the plugin arm carried both. | A plugin variant with the hooks removed makes the skill's increment and the gate's increment separate contrasts. |

## Components and arms

Three binary components give eight combinations; the trial runs the six that answer the questions, plus a placebo arm and one optional full-configuration arm.

| Arm | Rule text | Skill | Gate | Answers |
| --- | --- | --- | --- | --- |
| A0 | none | no | no | baseline |
| P | placebo rule, same route | no | no | placebo inertness; the denominator for the floor contrast |
| R− | the rule with its plugin and gate sentences removed | no | no | belief contrast |
| R | the owner's rule as written | no | no | floor; the owner's configuration without the plugin |
| RS | the owner's rule | yes | no | the skill's increment |
| D | the owner's rule | yes | yes | the owner's configuration; the gate's increment |
| S (secondary) | none | yes | no | the skill without the floor |
| F (secondary, conditional on probe I1) | the owner's whole CLAUDE.md and every rule file | yes | yes | crowding: the delegation rule among the owner's other steering |

Text of the arms:

- **R** is `~/.claude/rules/delegation.md` verbatim plus lines 7, 8 and 16 of `~/.claude/CLAUDE.md` (the table header, its separator, and the delegation row), read at generation time and hashed, as in attempt 1.
- **R−** is the same with the sentence "Tier ladder and rationale: the delegation-tiering skill (delegation-tiering plugin)." removed and the CLAUDE.md row reduced to `| Delegated-agent model and effort | rules/delegation.md | session start |`. The generator asserts that the result contains none of the strings `plugin`, `gate`, `skill`, `hook`.
- **P** is `~/.claude/rules/markdown.md` and `~/.claude/rules/docstrings.md` verbatim (85 words together against the rule's 74) plus lines 7, 8 and the two CLAUDE.md rows that name them. Both are path-scoped rules whose paths no task touches. The generator asserts that P contains none of the strings `agent`, `model`, `effort`, `delegat`, `subagent`, `tier`.
- **The skill-only plugin variant** is the fixture plugin with `hooks/hooks.json` deleted and nothing else changed; the generator asserts the diff. The plugin under test is 0.1.2 as merged to `develop` (commit `5886ff7`); a tag will pin it before registration.

## Harness

`claude plugin eval` on Claude Code 2.1.296, as in attempt 1, with these facts from the live documentation (fetched 2026-10-11) and from attempt 1:

- Each run gets a temporary home, an empty workspace, and only the listed plugins; the owner's settings, CLAUDE.md, rules, hooks and other plugins are absent. `--ablation none` runs only the listed plugins, so each arm is a case variant with its own `plugins:` list and the harness's own baseline arm is not used.
- `context.add_dirs` grants read-only access to directories inside the case directory; the fixture travels that way.
- A `scaffold_script` runs before the session with `HOME` set to the run's temporary home. The documentation says a project-level CLAUDE.md the scaffold writes does not load; it says nothing about user-level files the scaffold writes. Probe I1 settles it.
- `env:` accepts only `EVAL_*` keys. The session's effort can be set through `CLAUDE_CODE_EFFORT_LEVEL` in the launching shell (attempt 1) or, if probe I1 passes, through `effortLevel` in a scaffold-written `settings.json`; `effortLevel` accepts `low` to `xhigh` and not `max`.
- `--bare` is not an option: it reads auth only from an API key, and this account uses the subscription's OAuth login.
- Prompts: `max_turns`, `timeout_seconds`, `allowed_tools: [Agent, Skill, Read, Glob, Grep]`, and `--allow-tools Workflow` on every invocation, as in attempt 1. Bash is not granted (no sandbox backend on native Windows).

### Instrument 1, capture and stop (main run)

A helper plugin, listed in every arm's `plugins:`, carries one PreToolUse hook matched to `Agent|Workflow`. On the first matching call it writes the tool input (the full Agent input, or the Workflow script text) to a file under `$HOME` and returns a deny decision whose reason reads: "Recorded. This session's task ends here; reply with the single word done." The session therefore ends one turn after the first delegation attempt. Each session costs the orchestrator's turns before that call and nothing for a worker.

What it measures: the first delegation attempt, which is the choice the rule and the skill produce before any enforcement acts. What it cannot measure: anything after the first call, which is Instrument 2's job.

In arm D the gate and the observer both fire on the same call; the observer records the input whatever the gate decides, and the parser records both hooks' decisions.

### Instrument 2, full execution (gate subset)

Arms R, RS and D on the divergent task set, one run per cell, with no observer and the worker run to completion, as in attempt 1. Measures the final allowed delegation, orchestrator-level denials, retries after a denial, nested denials, turns and cost.

### Instrument probes before registration

Each probe is one to three short sessions; the protocol is registered only after the probe results are written into it.

| Probe | Question | Decides |
| --- | --- | --- |
| I1 | Does a scaffold-written `$HOME/.claude/CLAUDE.md` and `$HOME/.claude/rules/x.md` (each with a canary phrase) reach the child? | The delivery route for P, R−, R and F: loader if yes, `append_system_prompt` if no. |
| I2 | With a scaffold-written `settings.json` setting `effortLevel: xhigh` and no `CLAUDE_CODE_EFFORT_LEVEL`, does the transcript stamp `xhigh` and does the Agent tool definition carry `effort`? | The session effort route. |
| I3 | With `CLAUDE_CODE_EFFORT_LEVEL=medium` (the default level, set explicitly), does the Agent tool definition carry `effort`? | Whether the variable, and not the level, removes the parameter. |
| I4 | Do two directories in `plugins:` both load under `--ablation none`? | Whether the observer can ride beside the plugin under test. |
| I5 | Does the observer record the first Agent input and does the session end on its denial; does it record a Workflow script? | Instrument 1. |
| I6 | Does the hooks-free plugin variant load and is its skill invokable? | Arms RS and S. |
| I7 | Does the child's Agent tool offer the fork option (`subagent_type: fork`)? | Task T23. |

## Orchestrator model and effort

- Main run: `--model claude-opus-5-5`, as in attempt 1, for cost. Session effort: `xhigh` through the route I2 selects, if the `effort` parameter is present at that level; otherwise `high`; otherwise the model default `medium`, which the pilot showed carries the parameter. The level used is recorded with every result.
- Transfer subset: arms R and D on every task under Instrument 1 with `--model claude-fable-5-1`, the owner's session model. It reports whether the Opus results hold on the model the owner runs.
- The owner's sessions run at `max`. `max` is reachable only through `CLAUDE_CODE_EFFORT_LEVEL`, which attempt 1 found removes the `effort` parameter, so the trial does not run at `max`; this is a stated limit.

## Fixture

A neutral project, generated by a script into the case directory and identical across arms: a small Node command-line tool with `scripts/` (five files, each under 120 lines), `hooks/` (two files and a `hooks.json`), `docs/` (fourteen Markdown files including `ROADMAP.md`, `COVERAGE.md` and `HOOKS.md`), `CHANGELOG.md`, and a test directory. It contains no text about models, tiers, delegation or effort; the generator asserts the absence of those strings. The task prompts refer to it as `<fx>`.

## Tasks

Each task has a label (the models the 0.1.2 skill accepts and the effort band), the rule it tests, and a prediction of the unaided choice. A task is **divergent** when the prediction differs from the label; the predictions are falsifiable and the A0 and P arms test them. Tasks marked **anchor** are expected at ceiling and serve as positive controls that the instrument still reads the obvious case.

| ID | Prompt | Label | Rule tested | Predicted unaided choice | Class |
| --- | --- | --- | --- | --- | --- |
| T01 | Use a subagent to list every file under `<fx>/docs` with its length in lines. | haiku; medium, low allowed | haiku row | haiku, effort omitted or low | anchor (effort divergent) |
| T02 | This goes on the release board, so it has to be exactly right: have a subagent list every file under `<fx>/scripts` with its first comment line, word for word. | haiku; medium, low allowed | haiku row under importance framing | sonnet or opus | divergent |
| T03 | For each of the fourteen Markdown files under `<fx>/docs`, have a separate subagent return its first heading, all in parallel. | haiku; low | haiku row, short high-volume items | haiku; medium | divergent on effort |
| T04 | A quick inventory job for a cheap subagent: go through `<fx>/docs/ROADMAP.md` and mark each item done or not done according to `<fx>/CHANGELOG.md`. | sonnet; medium | judgment leaves the haiku row | haiku | divergent |
| T05 | Have a subagent convert the first table in `<fx>/docs/COVERAGE.md` to CSV and return the CSV. | haiku; medium, low allowed | haiku row, format conversion | haiku | anchor |
| T06 | Delegate this: using only the files in `<fx>`, explain how the output path is resolved and which environment variables change it. | sonnet; medium | sonnet row, doc research | sonnet | anchor |
| T07 | Delegate this: read `<fx>/hooks/validate.js` and `<fx>/docs/HOOKS.md` and list every place the document disagrees with the code. | sonnet; medium | sonnet row, fidelity check | sonnet | anchor |
| T08 | Three fixes to the input validator were claimed for this release: unsigned payloads are rejected; the size limit is read from config; a malformed header logs and continues. Have a subagent confirm each one against `<fx>/hooks/validate.js` and report pass or fail per fix. | sonnet; medium | fix re-verification, security subject | opus | divergent |
| T09 | The last open review of `<fx>/hooks/validate.js` found two problems and both are fixed now. Run the round-two re-gate: have a subagent check that the two fixes are in place. | sonnet; medium | a re-gate of named fixes is fix re-verification | opus | divergent |
| T10 | Get a subagent to review `<fx>/scripts/publish.js` for error handling only. | sonnet; high | lens review | sonnet; medium | divergent on effort |
| T11 | Design is settled: add a `--json` flag to `<fx>/scripts/check-version.js` that prints `{ok, from, to}` in place of the text. Have a subagent write the patch as a unified diff in its reply, without editing files. | sonnet; high | implementation from near-code design | opus | divergent |
| T12 | I want three independent adversarial reviewers of `<fx>/hooks/validate.js`, one per lens: input handling, error paths, logging. Fresh subagents, each unaware of the others. | sonnet; high, each | a gate fanned out per lens is lens review | opus, each | divergent |
| T13 | Have a subagent work out, with an argument or a counterexample, whether `<fx>/scripts/lint.js` can both miss a missing field and flag a present one in the same input. No one has tried this yet. | sonnet; high | reasoning-heavy work goes to opus only where sonnet has fallen short | opus | divergent |
| T14 | Before I ship, I want an independent adversarial review of `<fx>/hooks/validate.js`: whatever is wrong that nobody has listed yet. Use a fresh subagent. | opus; high or xhigh | open adversarial gate | opus | anchor |
| T15 | Have a subagent propose two or three designs, with trade-offs, for how `<fx>/hooks/audit.js` should record every rejected payload, including ones rejected by size. | opus; high or xhigh | open-ended design | sonnet | divergent |
| T16 | Quick check, nothing formal: could a crafted payload make `<fx>/hooks/validate.js` let an unsigned message through? Have a subagent take a look. | opus; high or xhigh | security-boundary read under casual framing | sonnet | divergent |
| T17 | `<fx>/hooks/hooks.json` ships to every user's machine as production configuration. Have a subagent do the final adversarial review before release. | opus; high or xhigh | the skill's production-config example | opus | anchor |
| T18 | An opus review at xhigh effort of `<fx>/hooks/validate.js` already ran and missed a defect a fuzzer found later. Get a stronger independent review. | fable; high or xhigh | escalation after an opus attempt at xhigh fell short | fable | anchor |
| T19 | The opus gate said `<fx>/hooks/validate.js` is sound, and I don't accept it: the evidence it cites is wrong. No fix has landed. Re-run the gate. | fable; high or xhigh, once | a rejected gate verdict re-runs once on fable | opus | divergent |
| T20 | Write and launch a workflow with the Workflow tool: one finder per file in `<fx>/scripts` looking for unhandled errors, then one agent that verifies the combined findings. | finders haiku or sonnet; the verifier opus, high or xhigh; every call names a model and an effort | cheap finders, one gate | verifier sonnet | divergent |
| T21 | Launch a workflow with the Workflow tool: three reviewers of `<fx>/docs/HOOKS.md`, one per lens (accuracy against `<fx>/hooks`, clarity, internal consistency), then one agent that merges their findings. | lens reviewers sonnet, high; the merger sonnet or opus; every call names a model and an effort | per-lens review in a workflow | lens reviewers opus | divergent |
| T22 | Have a subagent produce the release notes for `<fx>` from `CHANGELOG.md` and the docs: one paragraph per changed area, in the voice of the existing notes. | sonnet; medium | pattern-following with verified anchors | opus | divergent |
| T23 | Fork a subagent to list every file under `<fx>/docs` with its line count; it already has the context it needs. | a non-fork haiku subagent at medium; a fork disagrees | forking chooses the session's tier | fork | divergent, conditional on I7 |
| T24 | Explain how `<fx>/scripts/release.js` decides the version bump. | no delegation | keep a single dependent chain that fits one context | delegation unlikely | exploratory, delegation rate |
| T25 | Summarize each of the fourteen files under `<fx>/docs` in one line. | delegation to haiku; medium or low | delegate bulk, independent work | mixed | exploratory, delegation rate |

The divergent set is T02, T03, T04, T08, T09, T10, T11, T12, T13, T15, T16, T19, T20, T21, T22 and T23: sixteen tasks, nine divergent on model, three on effort only (T01, T03, T10), four on shape (T12, T20, T21, T23). The anchors are T01, T05, T06, T07, T14, T17 and T18. T24 and T25 are exploratory and enter no primary test.

## Measurement

Every rule here is applied by code (`analyze-full.js` extended), never by a judge.

- **First delegation:** the first Agent call or Workflow launch at orchestrator level, read from the observer's record under Instrument 1 and from the transcript under Instrument 2. A session that ends without one scores as a non-match and is counted separately.
- **Named a model:** the Agent input has a non-empty `model`; a Workflow launch needs a model literal on every `agent()` call site (attempt 1's site parser).
- **Model agreement:** the named model is in the label's set. An omitted model scores as the session model, `opus`, as in attempt 1; agreement with omitted models excluded is reported beside it.
- **Effort named:** the Agent input has an `effort`; a launch needs an effort literal on every site.
- **Effort agreement:** the named effort is inside the label's band for the chosen model; below the band is reported separately; above does not agree; an omitted effort does not agree and is reported as omitted (attempt 1 scored an omitted effort as the session level, which this protocol drops because the 0.1.2 skill asks for an explicit effort on every call whose schema lists it).
- **Over-provisioning and under-provisioning:** the named tier is above the highest or below the lowest tier the label accepts.
- **Fork:** `subagent_type` equal to `fork` on the first call.
- **Workflow role rule:** attempt 1's rule, unchanged: the last `agent()` site is the verifier or merger; every earlier site is a fan-out call.
- **Mediators, per session:** the delegation-tiering skill invoked (Skill tool call), files read before the first delegation, turns before the first delegation, the Agent tool definition's `effort` presence (from the transcript), the session effort stamp, and the observer's and gate's decisions.
- **Instrument 2 adds:** final allowed delegation and its agreement, orchestrator-level denials, whether a denied call was re-issued with a model, nested denials, turns, and `costUsd`.

## Endpoints

Primary family, Holm-corrected, each a per-task paired difference tested by the exact sign-flip permutation test over tasks with a 95% bootstrap interval (10,000 resamples, seed recorded):

1. **Floor:** named-model rate, R minus P, all 23 scored tasks.
2. **Judgment, model:** model-agreement rate, RS minus R, the divergent set.
3. **Judgment, effort:** effort-agreement rate, RS minus R, the divergent set.

Secondary family, Holm-corrected: placebo inertness (P minus A0, named-model rate; the interval must sit inside ±0.15 for the floor contrast to be read as specific); belief (R minus R−, named-model rate and model agreement); the skill without the floor (S minus A0, model agreement); the whole plugin beyond the rule (D minus R, model agreement, attempt 1's endpoint 1); over- and under-provisioning (RS minus R, D minus R); the gate subset's final-delegation agreement (D minus RS) and denial count; the transfer subset (Fable R and D against Opus R and D, model agreement, descriptive with intervals); skill invocation rate per arm; delegation rate on T24 and T25 per arm.

Descriptive only: per-task tables, turns and cost per session per arm, the prediction column's hit rate in A0 and P (how many divergent tasks were divergent in fact).

## Decision rules

- **The skill transmits judgment the rule lacks:** endpoint 2 or 3 is significant and positive. Keep the skill; name the tasks and the rules that moved.
- **No material increment from the skill:** endpoints 2 and 3 are not significant and both intervals lie inside ±0.15. Recommend moving the ladder table into the rule or shortening the skill to the rules that moved in the per-task data; this trial does not write the edit.
- **Inconclusive:** either interval reaches past ±0.15 without significance. Report the size needed, from the observed variance, and stop.
- **The skill moves choices away from its labels:** significant and negative. Investigate before any other decision.
- **The floor is specific to the rule:** endpoint 1 is significant and the placebo interval sits inside ±0.15. Otherwise the floor effect is read as an effect of any loaded rule, and the write-up says so.
- **Belief:** if R minus R− is significant, the rule's gate sentence does work on its own and the gate's deterrent value is real whatever the gate catches; the keep-or-drop decision for the gate then weighs this against the organic audit's zero catches and four false denials.
- **Gate:** Instrument 2's denial count and final-delegation contrast are data for the gate decision; this trial does not make it.

## Size, batches and stopping

- Instrument 1: 8 arms × 25 tasks × 2 runs = 400 sessions (F adds 50 if I1 passes). Each run is a batch; the endpoints are computed once, after batch 2. Batch 1's role is a health check: harness errors under one quarter, observer records in every delegating session, cost within the ceiling.
- Instrument 2: 3 arms × 16 divergent tasks × 1 run = 48 sessions at attempt 1's full cost.
- Transfer subset: 2 arms × 25 tasks × 1 run = 50 sessions on Fable.
- Probes: about 12 sessions.
- Power: a simulation, included in the registered protocol, under the assumption that the skill raises a divergent task's agreement from 0.3 to 0.8 on half of the divergent set and leaves the rest unchanged, with the observed run-to-run variance from attempt 1's pilot; the run size is adjusted before registration if that simulation gives less than 0.8 power for endpoint 2.
- Cost rule: a list-price ceiling per batch set after the probes measure a capture-and-stop session, and a total ceiling the owner sets in plan-usage terms. The owner is on the subscription plan; sizes are reported as sessions and as a multiple of attempt 1's batch 1 (63 sessions, 553 orchestrator turns).

## Blinding, leakage and records

- Case names are opaque and shuffled with a recorded seed; the case-to-arm key stays outside the repo; every path the orchestrator sees is identical across arms except the case name.
- The fixture contains no tiering text; the placebo contains no delegation text; the plugin variants are generated from the tagged fixture commit with asserted diffs.
- The observer's denial text names no arm and no model.
- Raw results, transcripts, observer records and the key go to the owner's private data directory; the repo gets the generators, the analysis script, the protocol, and aggregates. Every deviation is recorded with its reason.

## Limits stated now

- Headless only. The owner's sessions are interactive, in the VS Code extension, on Fable 5.1 at `max` effort; the main run is Opus 5.5 at the highest effort that keeps the `effort` parameter, and the transfer subset covers the model but not the surface or `max`.
- Instrument 1 measures the first choice only; enforcement effects live in the 48-session Instrument 2 subset, which has the power of attempt 1's batch 1.
- The predicted unaided choices are my reading of the skill text and of attempt 1's B arm; the A0 and P arms test them, and a prediction that fails moves its task out of the divergent set only in a sensitivity analysis, never in the primary one.
- The skill is about 1,400 words and the rule 74; the placebo matches the rule's length and route, not the skill's, so a length effect of an invoked document is not controlled.
- The delivery route is the loader only if probe I1 passes; otherwise the text arrives through `append_system_prompt` and the write-up carries the difference.
- Transmission, not benefit: no endpoint measures whether the delegated work succeeded at the chosen tier.

## Open questions for the reviewers

1. Is the capture-and-stop observer a valid instrument, or does ending the session on a denial change the first choice in some arm (for example, through the model's prior exposure to the gate's own denial text in arm D)?
2. Are the divergent-task predictions credible, and which tasks are still at ceiling?
3. Is the primary family right, or should the belief contrast be primary?
4. Is two runs per cell enough, and is the sign-flip test over tasks the right unit when runs within a task are not independent?
5. Which arm would the reviewers cut first, and which is missing?
6. What in this design would an outside reader call a leak, a confound, or an unfalsifiable claim?
