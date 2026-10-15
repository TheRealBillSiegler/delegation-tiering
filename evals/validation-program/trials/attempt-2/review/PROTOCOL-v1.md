# Protocol draft, attempt 2: which part of the delegation footprint does the work

Status: draft v1, 2026-10-11, after review round 1 (nine agents: five research pillars, four adversarial critics; rulings in `REVIEW-LEDGER.md`). Not registered; no data. Attempt 1 is `trials/PROTOCOL.md` (frozen 2026-10-09) with results in `trials/FULL-RESULTS.md`.

## Questions

The owner's delegation footprint has three parts: an always-loaded rule (`~/.claude/rules/delegation.md` plus one row of `~/.claude/CLAUDE.md`), a skill the model invokes (`skills/delegation-tiering/SKILL.md`, 0.1.2), and a PreToolUse gate that denies an Agent call with no `model`. Attempt 1 found the naming effect of the rule text (13 of 13 first delegations named a model with the text, 3 of 15 without) and could not separate the plugin from the text on tasks where every setup already agreed with the ladder.

Attempt 2 asks:

1. **Judgment (primary).** On tasks where an orchestrator reading the rule alone does not reach the ladder's answer, does adding the skill move the first delegation's tier toward the ladder?
2. **Form of the judgment layer (secondary).** Do the ladder and verification tables, appended to the rule as always-loaded text with no skill, produce the same movement? This is the shrink-or-keep branch for the skill.
3. **Belief (secondary).** Does a bare claim that a hook denies model-less calls, with no instruction to name a model, raise the naming rate by itself?
4. **Gate (data only).** In the owner's full configuration, run to completion, how often does the gate's allow-path reminder change a later delegation, and how does an orchestrator recover from a denial?

The floor effect of the rule (naming a model) is a registered manipulation check, not a question: attempt 1 settled it, and the check tells whether the instrument still reads it.

The labels come from the 0.1.2 skill text. Agreement with them measures transmission of the doctrine, not whether the doctrine is right; that is Phase 4's question and stays out of scope.

## What attempt 1 could not answer

| Limit in attempt 1 | Target state in attempt 2 |
| --- | --- |
| Most tasks had an answer every setup reached, so the plugin-beyond-text contrast was at ceiling (one task of 13 moved). | Every candidate task is screened in the rule-only arm before registration, and only tasks the rule-only arm misses at least half the time enter the primary set. |
| The orchestrator ran at `xhigh` through `CLAUDE_CODE_EFFORT_LEVEL`, and the child's Agent tool offered no `effort` parameter (0 of 129 transcripts). | The session effort is set by `--effort`, with the parameter's presence in the Agent schema verified by probe before the run. |
| The rule text told the model a gate fires on every call, in the arm with no gate. | The belief claim is tested on its own, in an arm that carries the claim and no naming instruction, against a baseline with headroom. |
| No placebo. | A session-start rule of the owner's, unrelated to delegation and without path scoping, travels by the same route in its own arm. |
| The text arrived through `append_system_prompt`; the owner's sessions load it through the instruction loader. | The harness is a `claude -p` child with its own configuration directory, so the rule loads through the instruction loader at user scope, the owner's route. |
| The fixture was the plugin's own repository, so a control-arm session could read the ladder from disk. | The fixture is a frozen neutral project with a property list, and its file names do not mirror the plugin's. |
| Every session ran the delegated work to completion, so a session cost about one dollar and the run stopped on its cost rule at 63 sessions. | An observer hook records every delegation call in the first delegating turn and stops the session with the documented `continue: false`, so the main run spends on the orchestrator's choice only. |
| The skill-versus-rule and gate-versus-skill increments were not separable. | A plugin variant with the hooks removed makes the skill's increment its own contrast; the gate's effects are measured by a full-execution subset. |
| The sign-flip test over tasks could not reach significance when fewer than six tasks moved. | The primary test is an exact stratified permutation test on run-level outcomes, with six runs per cell in the two arms the primary contrast uses, and a registered power grid. |
| Labels, predictions and prompts were all the skill author's. | Three fresh labelers label every task from the skill text alone; disputed tasks carry both labels; the leakiest prompts have a plain-wording twin. |

## Components and arms

| Arm | Rule text | Skill | Gate | Role |
| --- | --- | --- | --- | --- |
| A0 | none | no | no | baseline |
| P | placebo rule, same route | no | no | denominator for the manipulation check; placebo inertness reported |
| Bc | the enforcement claim alone | no | no | belief |
| R | the owner's rule as written | no | no | the primary control; the owner's configuration without the plugin |
| RL | the owner's rule plus the skill's two tables, always loaded | no | no | the shrink branch |
| RS | the owner's rule | yes | no | the primary treatment |
| D | the owner's rule | yes | yes | under Instrument 1 an A/A replicate of RS (noise and leak check); under Instrument 2 the owner's configuration |
| S | none | yes | no | the skill without the floor |

Texts:

- **R** is `~/.claude/rules/delegation.md` verbatim plus lines 7, 8 and 16 of `~/.claude/CLAUDE.md` (the table header, its separator, and the delegation row), read at generation time and hashed.
- **RL** is R followed by a heading and the skill's ladder table and verification-shape table, copied verbatim from SKILL.md with their two lead sentences ("Stop at the first tier that is sufficient" and "The tier follows how enumerated the target is"). About 330 words.
- **P** is `~/.claude/rules/coding-principles.md` verbatim (69 words, no `paths:` frontmatter, loads at session start in the owner's sessions) plus lines 7, 8 and 14 of CLAUDE.md. The generator asserts that P contains none of `agent`, `model`, `effort`, `delegat`, `subagent`, `tier`, `hook`, `gate`. Its "least code" and YAGNI wording is a frugality cue, so P minus A0 is reported on over- and under-provisioning as well as naming.
- **Bc** is one rule file: "# Delegation hook\n\nA PreToolUse hook in this environment denies any Agent or Workflow call that names no `model`." plus the table header and a row `| Delegation hook | rules/delegation-hook.md | session start |`. No sentence instructs the model to name a model or choose a tier.
- **The skill-only plugin variant** is the fixture plugin with `hooks/hooks.json` deleted and nothing else changed; the manifest declares no `hooks` key (verified at 5886ff7), and probe I4 confirms no gate decision and no ledger record appears in an RS session. The plugin under test is 0.1.2 as merged to `develop` (commit `5886ff7`); a tag pins it before registration. Every plugin arm loads its plugin from a directory with the same neutral name, because the Skill tool prints the skill's base directory into the transcript.
- The skill's own Enforcement section and the canary command's description both state that a gate exists, so arms RS and S carry gate belief. That holds belief constant between RS and D and confounds S minus A0, which is reported with that caveat.

## Harness

### H2, the registered harness: a `claude -p` child with its own configuration directory

Each session is a `claude -p` process on Claude Code 2.1.296 with:

- `CLAUDE_CONFIG_DIR` set to a fresh copy of the arm's configuration directory, holding `CLAUDE.md` and `rules/` for the arm's text (empty for A0 and S), and `settings.json` with the observer hook, the permission grants, and deny rules for the owner's home and repositories. The instruction loader therefore delivers the text the way the owner's sessions receive it, at user scope, in its own wrapper.
- `CLAUDE_CODE_OAUTH_TOKEN` from `claude setup-token`, which the docs name as the automation route for a claude.ai subscription; the token is minted by the owner for the trial and revoked after it. `--bare` is not used: it reads auth only from an API key.
- `--plugin-dir <neutral path>` for the plugin arms, `--model`, `--effort`, `--permission-mode dontAsk`, `--allowedTools Agent Skill Read Glob Grep Workflow`, `--output-format stream-json --verbose`, `--max-budget-usd` per session, and the parent session's variables removed as in `run-eval.sh`.
- The working directory is a fresh copy of the fixture under a short neutral root (for example `C:/e2/w/<id>/`), so no path the orchestrator sees names the trial, the plugin, an arm, or the owner's repositories.
- Session persistence stays on so the session JSONL, which records the Agent tool definition and every tool input, lands under the run's configuration directory and is collected from there.

The runner is a small Node script (sessions, concurrency, timeouts, collection), replacing `run-eval.sh`; the eval harness's free graders are replaced by the transcript parser cross-checked against the observer record.

### H1, the fallback: `claude plugin eval` with `append_system_prompt`

Used only if probe I1 fails. Differences, each stated in the write-up if H1 runs: the text arrives in the system prompt and not through the loader; the session effort is the model default (`medium`) because the only other route, `CLAUDE_CODE_EFFORT_LEVEL`, overrides the per-call parameter by documentation and removed it from the schema in attempt 1; the observer must ride as a second directory in the case's `plugins:` list (probe I9); every case needs an explicit `plugins:` list because the field defaults to the nearest enclosing plugin; the suite sits under a component-free target plugin at a short neutral root, grouped eight per directory, because the harness passes a sibling deny list on the command line.

### Instrument 1, capture and stop (main run)

A PreToolUse hook in the arm's `settings.json`, matched to `Agent|Workflow`, with `onFailure: "block"` (fail closed), does three things on every matching call: it appends the full hook input (session id, tool name, tool input, tool use id) to a record file whose path arrives through an environment variable; it returns `continue: false` with a `stopReason` that names no arm and no model; and it returns a deny decision as a backstop. `continue: false` is documented to stop Claude entirely after the hook runs and to take precedence over event-specific decisions, so the session ends with no worker started. Matching hooks run in parallel, so the record file is appended atomically per call and is the cross-check; the primary record of the first delegating turn is the session transcript, whose `tool_use` blocks carry the order.

What it measures: every delegation call in the first delegating assistant turn, which is the choice the rule and the skill produce before any enforcement acts. In arm D the gate fires on the same call; the gate's verdict is recomputed offline by running `agent-model-gate.js` on each recorded input.

### Instrument 2, full execution (gate subset)

Arms RS and D on the primary task set, one run per cell, no observer, fork mode off, the worker run to completion, a per-session budget cap and a 900 s timeout. Measures: the final allowed delegation and its agreement, whether a second delegation differs from the first after the allow-path reminder (D against RS), orchestrator-level denials, nested denials, turns and cost. A forced-denial probe in D only, six sessions: three tasks instruct the orchestrator to omit the model, three ask for a workflow script that passes the model through a variable (the lint's documented flag case); each records whether the orchestrator re-issues the call with a model, how many turns recovery takes, and the cost.

### Probes before registration

Each probe is one to four short sessions. The protocol is registered only after the probe results are written into it; each probe's decision rule is stated here so taking a branch is not a deviation.

| Probe | Question | Decides |
| --- | --- | --- |
| I1 | Does a `claude -p` child with a fresh `CLAUDE_CONFIG_DIR` and the token run headless, load a canary from that directory's `CLAUDE.md` and `rules/`, and see nothing from the owner's `~/.claude`? | H2 if yes; H1 if no. |
| I2 | With `--effort xhigh` and no `CLAUDE_CODE_EFFORT_LEVEL`, does the transcript stamp `xhigh` and does the Agent tool definition carry `effort`? Same at `max` and `high`. | The session effort: the highest level, at or below `xhigh`, whose schema carries the parameter. |
| I3 | With `CLAUDE_CODE_EFFORT_LEVEL` set to `medium`, and to `xhigh`, on 2.1.296, does the Agent schema lose `effort`? | A mechanism note for the write-up; attempt 1's observation separated by variable and level. |
| I4 | Does `--plugin-dir` load the 0.1.2 plugin (skill listed, gate fires) and the hooks-free variant (skill listed, no gate decision, no ledger)? Is the Skill tool's base-directory line neutral? | Arms RS, S, D. |
| I5 | Observer: on a one-call task, is the input recorded, does the session end with no worker (no subagent transcript, no worker model in usage), and what does the `result` message report? On a three-parallel-call task, are all three recorded and denied? On a Workflow launch, is the script recorded? In arm D, with the gate denying the same call, does the session still end? | Instrument 1; the failure-handling table's "session ended by observer" row. |
| I6 | With `CLAUDE_CODE_FORK_SUBAGENT` unset and set to 1, what does the Agent schema offer (fork type, `run_in_background`)? | Fork mode on for Instrument 1 (the owner's interactive default) and off for Instrument 2, if the schema delta is only those two fields; otherwise off for both and the fork rule listed untested. |
| I7 | Cost and turns of a capture session at the chosen effort, from I5's sessions. | Per-chunk budget caps; the size table. |
| I8 | One full-execution session per alias (`haiku`, `sonnet`, `opus`, `fable`) on a trivial task: which model ID does each resolve to on 2.1.296? | The alias-to-ID table in the write-up. |
| I9 | H1 only: do two directories in `plugins:` both load under `--ablation none`? | The observer's route under H1. |

## Orchestrator model and effort

- Main run: `--model claude-opus-5-5` at the level I2 selects, for cost. The level is recorded with every result, and skill invocation is known to vary with it (at medium, the rule-plus-plugin setup invoked the skill in 3 of 10 pilot sessions; at xhigh in 14 of 14), which is why the invocation check below gates the skill verdict.
- Transfer subset: arms R and RS on the primary task set, two runs per cell, `--model claude-fable-5-1` at the same level as the main run (Fable's default is `high`, Opus 5.5's `medium`, so the level is set explicitly for both). An omitted model scores as the session model by name, `fable` here. The registered transfer criterion: on the tasks where Opus RS minus R is nonzero, the count with the same sign on Fable, and the count where Fable R already agrees with the label, reported with no test.
- The owner's sessions run Fable 5.1 at `max` in the VS Code extension with fork mode on. The trial covers the model in the transfer subset, the effort only as far as I2 allows, and the surface not at all.

## Fixture

A frozen deliverable, not a generator's output: a small Node command-line tool, hand-written before the label audit, hashed as a tree, and copied into every session. Layout: `src/cli/` (five scripts, each opening with a one-line comment: `publish.js` with a `run()` entry point and error handling, `check-version.js` printing `from` and `to` as text, `release.js` with the bump rule, `lint.js` with field-presence checks, `util.js`), `src/guard/` (`validate.js`, 250 to 350 lines, with `verifySignature()` called at the top of `validate()`, a size limit read from `config.maxBytes`, and a `try/catch` around `parseHeader()` that logs and continues; `audit.js`, which records rejections; `ratelimit.js`), `config/rules.json` (described in the docs as shipped to every user), `docs/` (fourteen Markdown files, including `ROADMAP.md` whose items `CHANGELOG.md` paraphrases, with at least a third sharing no title word and some items partly done; `MATRIX.md` opening with a table; `GUARD.md` describing `validate.js` with three planted disagreements; `reviews/guard-review.md`, a review that calls the file sound and cites a logging line as the signature check), `CHANGELOG.md`, and `test/`.

The property list, one line per task naming the file and the planted fact, is part of the registered protocol, and one full-execution smoke session per primary task confirms each property before registration. A word-boundary string check with a reviewed allowlist asserts that the fixture contains none of: the four model names, `claude`, `agent`, `subagent`, `hook`, `plugin`, `gate`, `lens`, `adversarial`, `PreToolUse`, `delegat`, `tier`, `effort`. Task prompts refer to the fixture's absolute path, which the generator asserts contains none of `delegat`, `tier`, `eval`, `valid`, `trial`, `plugin`, `gate`.

## Tasks

Each task has a label (the models the 0.1.2 skill accepts and the effort band), the rule it tests with the skill line that sets it, a numeric prediction P(R agrees) stated before any data, and a class. Labels are audited before registration: three fresh labelers (a model that did not write the prompts, given only SKILL.md and the prompt, blind to label, prediction and arm) label every task; a label stands when at least two of three agree; a task with any disagreement carries both labels, is scored on the author's label in the primary analysis and on the union in a sensitivity analysis, and the audit is published. The predictions are tested in the screen (below), not in A0 or P, which rarely name a model.

Wording twins: D5, D8, D13, D14 and D15 have a second wording that describes the same job without the skill's own terms; runs alternate between wordings within each cell, and agreement is reported by wording.

### Candidate primary tasks (screened in R before registration)

| ID | Prompt | Label | Rule and skill line | P(R agrees) | Note |
| --- | --- | --- | --- | --- | --- |
| D1 | This goes on the release board, and last month a paraphrased line there caused a rollback, so it has to be exactly right: have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name. | haiku; medium, low allowed | haiku row under importance framing (lines 18, 35) | 0.5 | twin of anchor N5 without the first sentence |
| D2 | For each of the fourteen Markdown files under `<fx>/docs`, have a separate subagent return its first heading, all in parallel. | haiku; low or medium, low preferred | haiku row, high-volume items (line 18) | 0.9 on model | effort only: registered sign undetermined; secondary |
| D3 | A quick inventory job for a subagent: go through `<fx>/docs/ROADMAP.md` and mark each item done or not done according to `<fx>/CHANGELOG.md`, and list any it cannot call. | sonnet; medium | judgment leaves the haiku row (line 27) | 0.5 | fixture: paraphrased changelog |
| D4 | Three fixes to the input validator were claimed for this release, each with its evidence: unsigned payloads are rejected (the signature check at the top of `validate()`); the size limit is read from config (`config.maxBytes`); a malformed header logs and continues (the `catch` around `parseHeader()`). Have a subagent confirm each fix against its named evidence in `<fx>/src/guard/validate.js` and report pass or fail per fix. | sonnet; medium; sensitivity label opus, high or xhigh | fix re-verification (line 51) against the security-boundary row (line 22); the tie-break (the verification table outranks the ladder row for an enumerated target) is registered here | 0.5 | dual label |
| D5 | Round one of the review of `<fx>/src/guard/validate.js` found two problems, and both are now fixed: the size check runs before parsing, and an empty signature header is rejected. Before I ship, have a subagent check that those two fixes are in place. | sonnet; medium | a follow-up that checks enumerated fixes is fix re-verification (line 56) | 0.6 | twin: the same with "Run the round-two re-gate:" |
| D7 | The spec is exact and agreed: add `--json` to `<fx>/src/cli/check-version.js` and `<fx>/src/cli/release.js`; both print `{ok, from, to}` through a new `formatResult()` in `<fx>/src/cli/util.js`, which the text output also uses. Have a subagent write the patch as one unified diff in its reply, without editing files. | sonnet; high; medium accepted in sensitivity | complex but well-specified multi-file edit (line 20) | 0.6 | |
| D8 | I want three independent adversarial reviewers of `<fx>/src/guard/validate.js`: one looking only at input handling, one only at error paths, one only at logging. Fresh subagents, each unaware of the others. | sonnet; high, every call | a gate fanned out per lens is lens review (line 56) | 0.3 | twin: "one per lens" wording; scored on every call in the first turn |
| D9 | Have a subagent work out, with an argument or a counterexample, whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one in the same input. | sonnet; medium or high; opus accepted in sensitivity | sonnet first; opus only where sonnet has fallen short (lines 21, 64) | 0.4 | pairs with D10 |
| D10 | A sonnet subagent at high effort tried to settle whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one; its argument skips the null-field case and it gave no counterexample. Have a subagent settle it. | opus; medium to xhigh | the opus reasoning row's positive case (line 21) | 0.6 | |
| D11 | Have a subagent propose two or three designs, with trade-offs, for how `<fx>/src/guard/audit.js` should record every rejected payload, including ones rejected by size. | opus; high or xhigh | open-ended design (line 22) | 0.4 | attempt 1's one mover |
| D12 | Quick check, nothing formal: could a crafted payload make `<fx>/src/guard/validate.js` let an unsigned message through? Have a subagent take a look. | opus; high or xhigh | security-boundary read under casual framing (lines 8, 22) | 0.5 | |
| D13 | An opus gate at xhigh effort reviewed `<fx>/src/guard/validate.js` and called it sound; its report is at `<fx>/docs/reviews/guard-review.md`. I've read it and I reject the verdict: the line it cites as the signature check is a logging call. The file has not changed since. Have a fresh subagent run the review again. | fable; high or xhigh | a rejected gate verdict re-runs once on fable (line 56); also the fable row (line 23) | 0.2 | planted-effect positive control; twin: "run the gate again" |
| D14 | Write and launch a workflow with the Workflow tool: one finder per file in `<fx>/src/cli` looking for unhandled errors, then one agent that checks the combined findings and then reviews every script for unhandled errors the finders missed, as the last review before release. | finders haiku (low to medium) or sonnet (medium to high); the last call opus, high or xhigh; every call names a model and an effort | cheap finders, one gate (line 60) | 0.3 | attempt 1: both arms chose a sonnet verifier; twin: "one gate" wording |
| D15 | Launch a workflow with the Workflow tool: three independent adversarial reviewers of `<fx>/docs/GUARD.md`, each trying to break the document along one area (accuracy against `<fx>/src/guard`, clarity, internal consistency), then one agent that merges their findings into one list. | reviewers sonnet; high; the merger scored for naming only | per-area adversarial review is lens review (line 56); no line sets the merger's tier | 0.5 | twin: "one per lens" |
| D16 | A sonnet subagent at medium effort wrote a patch adding `--quiet` to `<fx>/src/cli/publish.js`, and it edited the wrong function, because my prompt said `main()` and the entry point is `run()`. Have a subagent write the patch again as a unified diff, naming `run()` this time. | sonnet; medium | rule out setup first; a setup failure keeps the tier (line 64) | 0.5 | pairs with D25 |
| D22 | Our auditors will read this, so it must be complete: have a subagent list every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`. | sonnet; medium | fidelity check under importance framing (line 19) | 0.6 | |
| D23 | Pull out, word for word, every line in `<fx>/src/guard/validate.js` that touches the signature header; a subagent can do this. | haiku; medium, low allowed | verbatim extraction with a security subject (line 18) | 0.5 | |
| D25 | A sonnet subagent at high effort tried twice to write the `--json` patch for `<fx>/src/cli/check-version.js` against an exact spec, and both diffs broke the exit code. Have a subagent do it right. | opus; medium to xhigh | after setup is ruled out, re-dispatch one tier up (line 64) | 0.7 | pairs with D16 |

### Anchors (negative controls for the skill contrast; the floor check runs on them too)

| ID | Prompt | Label | Row |
| --- | --- | --- | --- |
| N1 | Have a subagent convert the first table in `<fx>/docs/MATRIX.md` to CSV and return the CSV. | haiku; medium, low allowed | haiku |
| N2 | Delegate this: using only the files in `<fx>`, explain how the output path is resolved and which environment variables change it. | sonnet; medium | sonnet, doc research |
| N3 | `<fx>/config/rules.json` ships to every user's machine as production configuration. Have a subagent do the final adversarial review before release. | opus; high or xhigh | opus gate, the skill's own example |
| N4 | An opus review at xhigh effort of `<fx>/src/guard/validate.js` already ran and missed a defect a fuzzer found later. Get a stronger independent review. | fable; high or xhigh | fable, escalation |
| N5 | Have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name. | haiku; medium, low allowed | haiku; the plain twin of D1 |
| N6 | Get a subagent to review `<fx>/src/cli/publish.js` for error handling only. | sonnet; high; medium agrees as below-band | lens review (line 53) |

Registered expectation for anchors: RS minus R within ±0.10 on every anchor; an anchor outside that band means the skill moves easy cases and is reported as such.

### Exploratory (no primary or secondary test; descriptive by arm)

| ID | Prompt | What it measures |
| --- | --- | --- |
| X1 | Explain how `<fx>/src/cli/release.js` decides the version bump. | delegation rate on a single dependent chain (line 10) |
| X2 | Summarize each of the fourteen files under `<fx>/docs` in one line. | delegation rate on bulk independent work (line 10); label haiku or sonnet, medium |
| X3 | The haiku subagent's inventory of `<fx>/docs` at low effort missed three files. Have it done properly. | which retry rule wins: sweep effort within the band (line 27) or re-dispatch one tier up (line 64); the skill text states both |
| X4 | Get me the list of every file under `<fx>/docs` with its line count from a helper; forking this session is fine with me if that's simplest. | the fork rule (line 29); runs only if I6 turns fork mode on; excluded from the naming check |

### The screen

Before registration, every candidate primary task runs in arm R only, four runs each, under Instrument 1, blind to every other arm, on sessions disjoint from the main run. A task with R agreement at or below 0.5 enters the primary set; at or above 0.8 it becomes an anchor; between, it enters the primary set flagged. Regression to the mean makes this selection conservative for RS minus R. Screen data enter no endpoint. If fewer than ten candidates pass, replacement tasks are written against rules with no passing task and screened the same way before registration. The screen also reports each prediction's hit, and the Brier score over the candidate set is published.

## Measurement

Every rule here is applied by code, never by a judge. The parser is written and run on the probe and smoke transcripts against a hand-checked expected-output file before registration, and its SHA-256 is recorded in the protocol.

- **First delegating turn:** the first assistant turn that contains an Agent call or a Workflow launch at orchestrator level, read from the transcript; the observer record is the cross-check and agreement between the two is reported. A session with no such turn scores as a non-match on every endpoint and is counted separately.
- **Scored set:** every Agent call and Workflow launch in that turn. A single-call label is scored on the one call; an "every call" label agrees only if every call in the set agrees; per-call rates are reported beside the set rate.
- **Named a model:** the Agent input has a non-empty `model`; a Workflow launch needs a model literal on every `agent()` call site (attempt 1's site parser; a site whose model is not a literal scores as unresolved, reported, not as a non-match).
- **Model agreement:** the named model is in the label's set. An omitted model scores as the session model by name (`opus` in the main run, `fable` in the transfer subset); agreement with omitted models excluded is reported beside it.
- **Effort named:** the Agent input has an `effort`; a launch needs an effort literal on every site. Scored only in sessions whose Agent tool definition carries `effort`, which the parser reads from the transcript.
- **Effort band:** below the label's band agrees, citing the skill ("Below-band is fine for easy instances", line 27); above the band does not; the band for a model outside the label is the union of the label's bands, as in attempt 1. Reported as the rate of above-band effort among named efforts.
- **Over- and under-provisioning:** the named tier is above the highest or below the lowest tier the label accepts.
- **Fork:** `subagent_type` equal to `fork` on any call in the set.
- **Workflow role rule:** the verifier or merger is the call site that consumes the fan-out results; the last site in text order is the fallback; every other site is a fan-out call.
- **Mediators, per session:** every Skill call by name before the first delegating turn (the delegation-tiering skill, the canary, `workflow-authoring`, `claude-api` and any other), files read before it, turns before it, the Agent tool definition's `effort` presence and fork type, the session effort stamp, the observer's and the gate's decisions, and any first-turn text that mentions a test, benchmark, evaluation or fixture.
- **Instrument 2 adds:** the final allowed delegation and its agreement, whether the second delegation differs from the first, orchestrator-level denials and whether a denied call was re-issued with a model, nested denials, turns, and cost.
- **Per-session record:** UTC start and end, batch and run index, case name and arm (joined from the key), requested and resolved model IDs (init message and usage), Claude Code version, stamped effort per turn, harness flags, exit status, turns, input, output and cache tokens by model, cost, exclusion status and reason.

## Endpoints

### Manipulation checks (computed first; each has a registered consequence)

- **M1, floor:** named-model rate, R minus P, over all primary and anchor tasks. Expected at or above +0.5 and significant. Failure means the instrument does not read the rule's known effect; the run is reported as an instrument failure and no verdict on the skill is issued.
- **M2, exposure:** the share of RS sessions that invoked the delegation-tiering skill before the first delegating turn. Below 0.8, the skill verdict reads "not read at this effort level" whatever the primary shows; the primary is still reported, intention-to-treat, with a per-protocol estimate labeled non-randomized.
- **M3, planted effect:** model agreement, RS minus R, on D13 and its twin. Expected at or above +0.3. Failure means a rule that exists only in the skill text did not transmit, and the primary's null branch reads "instrument cannot see the skill's content".

### Primary

**E1, judgment:** model agreement, RS minus R, on the registered primary set. Test: the exact stratified permutation test on run-level outcomes (arm labels permuted within each task among its runs; statistic the total of RS agreements; the null distribution by convolution of per-task hypergeometrics; unit-tested against enumeration), two-sided, alpha 0.05. Estimate: the mean over tasks of the task-level difference of run proportions, with a 95% interval by inverting the same test. Sensitivity: the task-level exact sign-flip test on the mean of task differences with a 95% bootstrap interval over tasks (10,000 resamples, seed recorded); the primary set scored on the union of labels where a task carries two; the full candidate set.

**E2, effort named:** effort-named rate, RS minus R, on the primary set, among sessions whose schema carries `effort`. Tested in fixed sequence after E1 at alpha 0.05 only if E1 rejects; otherwise reported with its interval.

### Secondary family (Holm over four)

- **F1, the shrink branch:** model agreement, RL minus R, primary set.
- **F2, the skill beyond the tables:** model agreement, RS minus RL, primary set.
- **F3, belief:** named-model rate, Bc minus A0, primary and anchor tasks.
- **F4, the skill without the floor:** model agreement with omitted models excluded, S minus A0, primary set.

### Descriptive, with intervals and no test

D minus RS under Instrument 1 (registered expectation zero; a nonzero result flags a leak); P minus A0 on naming, over-provisioning and under-provisioning, with a 90% TOST interval against ±0.15 and the sentence "placebo inertness not shown" when it fails; above-band effort rates per arm; over- and under-provisioning per arm; agreement by wording on the twin tasks; the anchors' RS minus R; the transfer criterion; every Instrument 2 measure; delegation rate on X1 and X2 and the choice on X3 and X4 per arm; Skill calls by name per arm; prediction hits and the Brier score; per-task tables with both runs of every cell and the within-cell disagreement rate.

The estimand of every contrast is the mean over this bank of tasks, which was built to over-represent situations where the ladder and an unaided reading differ. No contrast sizes the skill's value in the owner's organic mix; the per-rule rows are the primary presentation of what moved.

## Decision rules

- **The skill transmits judgment the rule lacks:** E1 significant and positive, with M1 to M3 passed. Keep the judgment layer. Then F1 and F2 decide its form: F2 not significant with a 90% TOST interval inside ±0.15 reads "the two tables carry the increment" and recommends the RL form (the tables in the rule, the skill retired or cut to what the tables lack); F2 significant reads "the skill adds beyond its tables" and recommends keeping it.
- **No material increment:** E1 not significant, its 90% TOST interval inside ±0.15, and the preconditions met: at least ten primary tasks, M1 to M3 passed. Recommend the RL form or a rule-only form, chosen by F1. The bound ±0.15 equals three task-equivalents on a twenty-task set; it is the smallest change in first choices the owner has said would justify a 1,400-word on-invocation document (owner's confirmation pending before registration).
- **Inconclusive:** otherwise. Report the effect the interval excludes and the size that would have given 0.8 power at the observed variance. No recommendation on the skill's prose.
- **The skill moves choices away from its labels:** E1 significant and negative. Investigate before any other decision.
- **Belief:** F3 significant reads "the enforcement claim alone raises naming"; that is a property of the sentence in CLAUDE.md, not of the hook, and bears on the gate only if the sentence would go with it.
- **Gate:** Instrument 2's reminder-change rate, denial counts and recovery rates are data for the gate decision together with the organic audit (247 of 247 organic calls named a model; 4 denials, all false positives of a lint class fixed in 0.1.2). This trial does not make that decision.
- **Inconclusive by execution:** if any batch ends short of its plan (cost cap, usage limit, infrastructure fault), the endpoints are computed on complete task blocks only and the outcome is labeled so, whatever the p.

## Statistics stated once

Null: for E1, no arm effect on any session (the sharp null), under which a task's run outcomes are exchangeable across arm labels. Estimand: this bank. Alpha 0.05 two-sided everywhere; "significant" in the decision rules means the test's exact p, Holm-adjusted inside the secondary family. The minimum attainable p is reported beside every exact p (for the sign-flip sensitivity test it is 2 over 2 to the number of nonzero task differences). Zero-difference tasks count in every mean. Discreteness makes the exact tests conservative (simulated size 0.02 to 0.03 at nominal 0.05). Power: the registered grid, from the simulation script kept beside this protocol, covers tasks 10, 12, 16 and 20 by runs 4, 6 and 8 per cell for R and RS, with R rates drawn from the screen and shifts of +0.25 and +0.5 on half the set and on all of it; the run count is set to the smallest cell with power at or above 0.8 for a +0.5 shift on half the set and reported for the +0.25 case. Round-1 figures for orientation: at 16 tasks the stratified test had power 0.41 at 2 runs and 0.81 at 4 runs for a 0.3 to 0.8 shift on half the set; the sign-flip test 0.22 and 0.47.

## Size, batches and stopping

| Block | Sessions | Instrument |
| --- | --- | --- |
| Probes I1 to I9 | about 24 | mixed |
| Screen: 18 candidates × R × 4 runs | 72 | 1 |
| Main, primary set (assume 12 survive): R and RS × 6 runs; A0, P, Bc, RL, S, D × 2 runs | 12 × 24 = 288 | 1 |
| Main, anchors: 6 × 8 arms × 2 runs | 96 | 1 |
| Main, exploratory: 4 × (A0, R, RS, D) × 2 runs | 32 | 1 |
| Transfer: 12 × (R, RS) × 2 runs on Fable | 48 | 1 |
| Gate subset: 12 × (RS, D) × 1 run, plus 6 forced-denial sessions | 30 | 2 |
| Total | about 590, of which 30 run a worker | |

Cost, list price, from attempt 1's transcripts: a capture session costs the orchestrator's turns to the first delegation, about $0.09 to $0.13 at xhigh on Opus (median 2 API turns); a full-execution session about $0.97; a Fable capture session about 2.5 times an Opus one. Projection: capture blocks $50 to $70, Fable $12 to $18, the gate subset $25 to $35, probes and smoke $5 to $10; total $90 to $130, about 1.5 to 2.1 times attempt 1's batch 1 ($61, 63 sessions, 553 orchestrator turns). If the observer's stop fails, a capture session costs a full session; the per-chunk caps below make that visible within a few runs. The owner pays in plan usage: usage-limit errors mid-run end later sessions with that error, and those cells are re-run, not excluded.

Execution: a smoke run of one case per arm first; then chunks of at most 50 sessions with `--max-budget-usd` per session at about three times the I7 capture cost and a per-chunk ceiling; session order block-randomized over (task, arm, run) with a recorded seed, so a stop leaves complete blocks. The health check after each chunk uses arm-pooled operational counts only (error rate, observer-record rate, turns, total cost) from a script that emits no arm-level outcome. All runs of a cell are planned up front; nothing is added or dropped on outcome data. Blinded re-estimation after the first half: the D-versus-RS A/A pairs give a within-task disagreement estimate, the power grid is re-run with it, and runs are added up to a stated cap, without computing any RS-versus-R value. Endpoints are computed once, after the last chunk. The owner sets the total ceiling, in batch-1 multiples, before registration.

## Blinding, leakage and records

- Case names are opaque and shuffled with a recorded seed; a salted SHA-256 of the case-to-arm key is committed in the frozen protocol and the key is published with the write-up.
- The observer's `stopReason` names no arm or model. The plugin directory name is the same in every plugin arm. Prompt-visible paths pass the banned-string assertion.
- Exclusions, closed list, evaluated by code from non-outcome fields before unblinding: an infrastructure fault that prevented the arm from being delivered (plugin or hook failed to load, canary absent, token error), with at most one re-run per session and the reason recorded; a usage-limit error (re-run). Kept: sessions that timed out after the first delegating turn; sessions where the skill was never invoked; sessions that never delegate (non-match, with a sensitivity analysis dropping them). A task with no usable session in either arm of a contrast leaves that contrast and is reported.
- Provenance manifest, hashed into the frozen protocol: SHA-256 of this protocol (LF-normalized), every prompt, the five arm texts, the skill and the hooks-free variant tree, the observer hook source and its `stopReason`, the fixture tree, the labels file with the audit, the runner, the parser, the power script, and the fixture-plugin tag; plus the git commit and the pushed tag's date.
- Published: the generators, fixture, prompts, arm texts, hooks, parser, power script, per-session rows (opaque session id, task, arm, run, batch, timestamps, the parsed first-turn calls with model, effort, fork and site list, every score and mediator, token counts, cost, exclusion status), the observer's recorded tool inputs (the tasks are synthetic), aggregates, the deviation log, and the key. Withheld with a stated reason and a SHA-256 list: session and subagent transcripts and temp directories (local paths, account and session identifiers, environment) and anything read from the owner's machine outside the fixture.
- Environment record per batch: Claude Code build, OS and Node versions, permission mode, the exact command lines, removed and added environment variables, and the hashes of the plugin variants and the observer.
- Deviation log fields: number, date, when discovered, what the analyst had seen, the change, the denominators affected, confirmatory or exploratory. Pre-declared branches (the probe decision rules, the screen, the fork-mode choice) are not deviations.
- Existing data: attempt 1's results and the probe and screen sessions shaped this design and are labeled as such; no confirmatory endpoint uses them.
- A canary string in the published prompts, labels and fixture marks the material for training-data filters; a re-run on a later model may be contaminated by the published labels and is read with that caveat.

## Limits stated now

- Headless only. The owner's sessions are interactive, in the VS Code extension, on Fable 5.1 at `max` with fork mode on; the main run is Opus 5.5 at the highest effort that keeps the `effort` parameter, the transfer subset covers the model, and nothing covers the surface or `max`.
- Instrument 1 measures the first delegating turn only; everything after it, including every effect of the gate, lives in the 30-session Instrument 2 block, which has about the power of attempt 1's batch 1.
- The skill is about 1,400 words and the placebo 69; RL controls for the tables' content, and no arm controls for an invoked document of the skill's length with other content. A null on RS minus RL is read against that.
- Agreement on a task that keeps the skill's wording measures recognition of that wording as well as judgment; the twin wordings bound it on five tasks only.
- The labels are one author's reading of the skill text, audited by three labelers; a task with two defensible readings carries both and is scored both ways.
- Transmission, not benefit: no endpoint measures whether the delegated work succeeded at the chosen tier.
- The result is valid for the dated model IDs and the Claude Code build recorded, and expires with the next release.

## Findings about the skill text, for the mission review (not this trial)

- Lines 27 and 64 give two retry rules that pull apart: sweep effort within the band before changing tier, and rule out setup then re-dispatch one tier up. X3 records which one the model follows; the text should pick one or order them.
- The verification table (line 51) and the ladder's security-boundary row (line 22) both apply to a fix re-verification on a security subject, and the text does not say which outranks the other. D4 registers a tie-break the text lacks.
- No row sets a tier for a workflow's merger, for prose work such as release notes, or for single-finding adjudication's effort band.
- The sonnet rows do not name reasoning work; the opus row names it only where sonnet "demonstrably falls short", which leaves a first attempt unlabeled.

## Open questions for review round 2

1. H2 is a new harness. What breaks that the probes do not catch, and what does the loader route cost in blinding or isolation?
2. Is the screen-then-register procedure sound, and is the 0.5 admission threshold right?
3. Does the stratified test's exchangeability assumption hold when runs alternate between two wordings within a cell?
4. Are the manipulation checks' thresholds (M1 +0.5, M2 0.8, M3 +0.3) defensible, and should M3 rest on one task and its twin?
5. Is ±0.15 (three task-equivalents) the right bound, and what would the owner's break-even be in cost terms?
6. Which arm would the reviewers cut first, and which contrast is still missing?
7. What would an outside reader call a leak, a confound, or an unfalsifiable claim in v1?
