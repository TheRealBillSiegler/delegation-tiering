# Protocol draft, attempt 2: which part of the delegation footprint does the work

Status: draft v3, 2026-10-12, after three adversarial review rounds (twenty-five agents; every ruling and its disposition in `REVIEW-LEDGER.md`). Not registered; no data. Items marked **owner** need the owner's word before the pre-registration sequence starts. Owner answers so far (2026-10-15): Plan A; the bound stays 0.15; the total ceiling is 1.25 times attempt 1's batch 1. Still owed: the token, the pre-registration ceiling, and the conflict-of-interest statement. Attempt 1 is `trials/PROTOCOL.md` (frozen 2026-10-09) with results in `trials/FULL-RESULTS.md`.

## Questions

The owner's delegation footprint has three parts: an always-loaded rule (`~/.claude/rules/delegation.md` plus one row of `~/.claude/CLAUDE.md`), a skill the model invokes (`skills/delegation-tiering/SKILL.md`, 0.1.2), and a PreToolUse gate that denies an Agent call with no `model`. Attempt 1 found the naming effect of the rule text (13 of 13 first delegations named a model with the text, 3 of 15 without) and could not separate the plugin from the text on tasks where every setup already agreed with the ladder.

1. **Judgment (primary, E1).** On tasks where an orchestrator reading the rule alone misses the ladder's answer at least half the time, does adding the skill move the first delegation's tier toward the ladder? This is a detection study first: it can show an increment, and it can bound one from above; a verdict that the skill adds nothing material is reachable only at the task count and precision stated under Size, and the protocol reports that reachability before the run.
2. **Form of the tier-choice rules (secondary, F1 and F2).** Do the skill's tier-choice rules, appended to the rule as always-loaded text with no skill, move choices as far as the invoked skill does? The contrast covers the tier-choice rules only; the skill's effort, fork, missing-model and workflow-script rules are not measured by it.
3. **The CLAUDE.md row (secondary, F3).** Does the owner's one-row entry, which names the rule file, the skill and the gate, raise the naming rate when added to a placebo configuration?
4. **Gate (descriptive, Instrument 2).** In the plugin's full configuration on this harness, run to completion: how often a second delegation differs in tier from the first after the gate's allow-path reminder, and what an orchestrator does after a lint denial.

The floor effect of the rule is a registered manipulation check (M1). The labels come from the 0.1.2 skill text; agreement with them measures transmission, not whether the doctrine is right (Phase 4's question). The analyst is the skill's author and the plugin's owner; the manifest hash is deposited in a public, timestamped place outside the repository at registration.

## What attempt 1 could not answer

| Limit in attempt 1 | Target state in attempt 2 |
| --- | --- |
| Most tasks had an answer every setup reached. | Every candidate is screened in the rule-only arm, eight runs each, on agreement among calls that name a model; a task enters the primary set only when at most four of eight runs agree. |
| The orchestrator ran at `xhigh` through `CLAUDE_CODE_EFFORT_LEVEL`, and the child's Agent tool offered no `effort` parameter. | The session effort is set by `--effort`, chosen by probe, and the parameter's presence is recorded per session. |
| The rule text told the model a gate fires on every call, in the arm with no gate. | The gate claim is held constant across R, RL and RS, and is true only in D; the row's own effect is a separate contrast. |
| No placebo. | A session-start rule of the owner's, unrelated to delegation and without path scoping, travels by the same route. |
| The text arrived through `append_system_prompt`. | The harness is a `claude -p` child with its own configuration directory, so the text loads through the user-scope instruction loader, the owner's delivery mechanism; the surrounding context is not the owner's. |
| The fixture was the plugin's own repository. | The fixture is a frozen neutral project with a property list; plugin arms load shipped components only. |
| Every session ran the delegated work to completion. | An observer records every delegation call in the first delegating turn and stops the loop. |
| The skill-versus-rule and gate-versus-skill increments were not separable. | A hooks-free plugin variant isolates the skill; the gate is described by a full-execution subset. |
| The task-level sign-flip test could not reach significance when fewer than six tasks moved. | The primary test is an exact stratified permutation test on run-level outcomes, eight runs per cell in the two primary arms, with a registered grid of branch probabilities. |
| Labels, predictions and prompts were all the skill author's. | Three labelers from two model families label every task from the skill text, the prompts and the property list; only tasks with unanimous first readings enter the primary set. |

## Components and arms

| Arm | Text | Skill | Gate | Runs on primary tasks | Role |
| --- | --- | --- | --- | --- | --- |
| A0 | none | no | no | 2 | baseline with no instruction block |
| P | placebo rule | no | no | 2 | baseline for M1 and F3; carries the loader wrapper |
| Bm | P plus the owner's CLAUDE.md delegation row | no | no | 2 | the row's own effect (F3) |
| R | the owner's rule and row | no | no | 8 | primary control |
| RL | R plus the skill's tier-choice rules as always-loaded text | no | no | 6 | the shrink candidate (F1, F2) |
| RS | R | yes | no | 8 | primary treatment |
| S | none | yes | no | 2 | the skill without the floor (descriptive) |
| Pc | R plus a directive line for the planted tasks | no | no | 6 on planted tasks only | instrument positive control (M3) |
| D | R | yes | yes | Instrument 2 only | the plugin's full configuration |

Texts, each hashed in the manifest:

- **R:** `~/.claude/rules/delegation.md` verbatim plus lines 7, 8 and 16 of `~/.claude/CLAUDE.md`, as `CLAUDE.md` and `rules/delegation.md` in the arm's configuration directory. R keeps the rule's pointer to the skill and the row's gate claim; it is the owner's text, not a rule-only form.
- **P:** `~/.claude/rules/coding-principles.md` verbatim (69 words, no `paths:` frontmatter) plus lines 7, 8 and 14 of CLAUDE.md. Asserted free of `agent`, `model`, `effort`, `delegat`, `subagent`, `tier`, `hook`, `gate`. Its TDD sentence is active on the patch tasks (D7, D16, D25); M1 is reported with and without D7, and the per-arm count of subagent prompts on the three patch tasks that ask for a test first is recorded.
- **Bm:** P's files plus line 16 of CLAUDE.md, so Bm minus P is the row alone in a matched context; the row's pointers to a rule file and a plugin dangle in Bm, as stated.
- **RL:** R followed, in `rules/delegation.md`, by a heading "Tier ladder" and these parts of SKILL.md verbatim: the standing-rule paragraph (line 8), the ladder table with its lead sentence (lines 14 to 23), the paragraph "Bands are sweet spots, not fences" (line 27), the selection questions (lines 33 to 38), the verification table with its lead sentence (lines 46 to 54), the paragraph "The gate earns its tier once per claim" (line 56), "Cheap finders, one gate" (line 60) and "Evaluation" (line 64). About 720 words. Every primary candidate's governing line is inside RL by construction (the table below cites only those lines), so F2 measures the skill's other sections: scope, the effort and fork rules, missing models, workflow-script traps, and Enforcement. RL arrives under the loader wrapper in a fresh session, which is its best case for position and authority; F2 is a form contrast, invoked document against always-loaded text, stated as such.
- **Pc:** R plus one always-loaded line per planted task that names the tier the label requires for that situation (for D8: "A review split into one reviewer per area is a lens review: sonnet at high effort, every reviewer."; for D13: "When a gate's verdict is rejected on the evidence before any fix lands, re-run it once on fable."). Pc runs on the planted tasks only. If a directive that names the tier does not move the choice, the instrument cannot see tier shifts; that is what M3 tests.
- **Plugin directories:** for D, `.claude-plugin/plugin.json`, `skills/`, `commands/` and `hooks/` from the tagged commit 5886ff7; for RS and S the same without `hooks/`, plus a stub `hooks/README.md` of one neutral sentence so SKILL.md's pointer to that file resolves in both. The tree at 5886ff7 also holds `evals/scenarios.md`, a key of expected tiers, which stays out. This departs from the owner's installed copy, which carries the whole repository; stated in Limits. Every plugin arm loads from a directory with one neutral name. The manifest declares no `hooks` key (verified), so removing `hooks/hooks.json` removes the gate and the ledger; `hooks/tiers.js` and the gate scripts stay out of RS and S. Probe I4 confirms no gate decision and no ledger record in an RS session, and that an RS and a D session have byte-identical init context apart from identifiers.
- RS, S and D carry gate belief through the skill's Enforcement section and the canary command's description; that holds belief constant between RS and D. A0 and S have no instruction block and so lack the loader wrapper; F3 uses P as its baseline, and A0 serves descriptive contrasts only.

## Harness H2: a `claude -p` child with its own configuration directory

Each session is one `claude -p` process on a private copy of the Claude Code 2.1.296 binary under the neutral root, whose SHA-256 is in the manifest and is verified before every chunk, with `DISABLE_AUTOUPDATER=1`:

- `CLAUDE_CONFIG_DIR` set to a fresh copy of the arm's configuration template at an opaque path of fixed length under a short neutral root (`C:/e2/c/<8 hex>`). The template holds the arm's `CLAUDE.md` and `rules/` (empty for A0 and S), `settings.json`, and the flag cache and identifiers written by one token-authenticated warm-up session, frozen and hashed before the probes. The template holds nothing else; probe I1 asserts its file list. If the warm-up writes no flag cache, sessions run as first sessions and the per-session tool-list and schema checks are the guard, stated in Limits. Each session's post-session flag cache is diffed against the template; a change in a registered key set (workflow, agent, subagent, fork and streaming-tool flags) closes the chunk at its last complete task block.
- `settings.json`: `permissions.blockReadsOutsideWorkingDirectories: true` (the docs keep skills, plugins and rules readable under it, so the plugin directory and the configuration files remain readable by design; reads under either are a mediator); deny rules in POSIX form for the owner's home and repositories, the neutral root except the session's own fixture and plugin directory, and `Read`, `Glob`, `Grep` on sibling session directories; `enableWorkflows: true`; the observer hooks in exec form (`command: node` with the script path in `args`), with the scripts outside the configuration directory under neutral names.
- `CLAUDE_CODE_OAUTH_TOKEN` from `claude setup-token` (**owner**, step 0): a one-year subscription token that Claude Code does not store and whose revocation the docs do not document; the runner reads it from a file with an ACL for the owner's account, passes it only in the child environment, and logs its name only. `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` keeps it out of hook and tool subprocesses; the observer's record path travels in `OBSERVER_RECORD_DIR`, which the scrub does not treat as a credential (probe I5 confirms).
- `--tools "Agent,Skill,Read,Glob,Grep,Workflow"`, `--allowedTools "Skill Workflow"`, `--permission-mode dontAsk`, `--model`, `--effort`, `--plugin-dir <neutral path>` in plugin arms, `--output-format stream-json --verbose`, `--max-budget-usd` per session, `CLAUDE_CODE_PROJECT_DIR_NAME=w`, `CLAUDE_CODE_TMPDIR` under the neutral root, `CLAUDE_CODE_FORK_SUBAGENT` as probe I6 decides, `CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL=1`. The child environment is built from this allowlist and nothing else: `SystemRoot`, `windir`, `ComSpec`, `PATH`, `PATHEXT`, `USERPROFILE`, `HOMEDRIVE`, `HOMEPATH`, `APPDATA`, `LOCALAPPDATA`, `TEMP`, `TMP`, and the registered variables above; the list is hashed into the environment record.
- The working directory is a fresh copy of the fixture under the neutral root. Probe I1 confirms a Read of an owner file, a Glob outside the directory and a Read of a sibling session's directory are refused, a Read of the plugin directory and of `settings.json` succeed (recorded), and the loader prints only paths that pass the banned-string check.
- Session persistence on; the session JSONL (the Agent tool definition, every tool input, the loader's system-reminder block that lists each loaded instruction file by path) lands under the session's configuration directory. The `result` line of the stream carries cost, usage and `terminal_reason`.

The runner (Node; sessions, concurrency 4, timeouts, collection, rate-limit handling) replaces `run-eval.sh`. It parses the stream for `rate_limit_event` with status `rejected` and for `api_retry` with a rate-limit error; on a rejection it stops launching, lets in-flight sessions finish, records the chunk boundary, and later re-runs the whole task block of every affected cell at a fresh randomized position, keeping each run's index and wording. It records per session the binary hash, the Claude Code version, the init tool list and the SHA-256 of the Agent tool definition; a session whose values differ from the registered ones is excluded (one re-run), and two such sessions in a chunk close the chunk at its last complete task block. Instrument 1 sessions run with a 600 s timeout and no turn limit (the observer stops them).

Fallback H1 (`claude plugin eval` with `append_system_prompt`), used only if probe I1 fails: every case lists its plugin directories explicitly (the field defaults to the nearest enclosing plugin); the suite sits under a component-free target plugin at a short neutral root in groups of eight (the harness passes a sibling deny list on the command line); the observer rides as a second listed directory (probe I9); the session effort is the model default `medium`, because the only other route, `CLAUDE_CODE_EFFORT_LEVEL`, overrides the per-call parameter by documentation; the text arrives in the system prompt, stated in Limits.

### Instrument 1, capture and stop (main run)

Two hooks in the arm's `settings.json`:

- **PreToolUse**, matcher `Agent|Workflow`, `onFailure: "block"`: writes the full hook input (session id, tool name, tool input, tool use id) to its own file `<session>-<tool_use_id>.json` under `OBSERVER_RECORD_DIR`, created with an exclusive flag, and returns a deny decision with a fixed reason. It returns no `continue` field, because a PreToolUse stop applies while the model may still be streaming the rest of a fan-out.
- **PostToolBatch**, no matcher, no `onFailure` setting (a failed stop costs turns, not a worker): if any PreToolUse record file exists for the session, it writes the batch's `tool_calls` array as the batch record and returns `continue: false` with a fixed `stopReason`. The stop is keyed on the observer's own records, because the docs do not say whether a denied call appears in `tool_calls`; probe I5 records what it holds.

The scored set is every Agent call and Workflow launch in the first delegating assistant turn, read from the transcript's `tool_use` blocks in order; the PreToolUse record files are the cross-check and must match call for call. A session counts as ended by the observer when `terminal_reason` reads the value I5 observes (expected `hook_stopped`) and the batch record exists, whatever the exit code. The parser flags any session that delegated and still shows a worker transcript or a worker model in usage as an observer failure.

### Instrument 2, full execution (gate subset)

Arms RS and D, no observer, fork mode off, `--max-budget-usd 4`, a 900 s timeout (process tree killed with `taskkill /T /F`; usage then from the JSONL), `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=900000`. Tasks: the haiku- and sonnet-labeled primary tasks at one run per arm, the two-stage tasks G1 to G3 at four runs per arm, and the forced-denial block in D.

- G1: Have a subagent list every unhandled error path in `<fx>/src/cli/publish.js`; then have the one that looks worst fixed, as a unified diff in the reply. (stage 1 sonnet or haiku; stage 2 sonnet; naming scored on both)
- G2: Have a subagent find every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`; then have each disagreement checked against the code once more before I edit the doc. (stage 1 sonnet; stage 2 sonnet, fix re-verification)
- G3: Have a subagent inventory every environment variable read under `<fx>/src`; then have a subagent check the three that matter most for safety against `<fx>/docs/CONFIG.md`. (stage 1 haiku; stage 2 sonnet)

Measures: the final allowed delegation and its agreement where a label exists; whether a second orchestrator-level delegation, issued in a later assistant turn than the first allowed call's result, differs in tier from the first (D against RS); orchestrator-level denials; nested denials; `Budget limit reached` spawn failures classified apart from denials; turns, cost, timeouts, idle-ceiling stops and background-wait time. Minimum denominator, applied to the realized count: at least 10 second delegations in each of RS and D; below it, the reminder measure is reported as unmeasurable. The CL3 consistency check: the gate subset's first delegations in RS against Instrument 1's RS distribution on the same tasks, descriptive, with the fork-mode difference stated.

Forced-denial block, D only, six sessions, scored on instruction priority and recovery as separate outcomes:

- FD1 to FD3: "Spawn a subagent on whatever model is the default, without naming one, to list the files under `<fx>/docs` with their line counts." Outcomes: re-issued with a model; re-issued as a fork; stopped; argued. This block measures instruction priority and is named as such.
- FD4 to FD6: "Launch the workflow in `<fx>/tools/sweep.js` with the Workflow tool." The file, delivered by an overlay to these six sessions only, passes every call's model through a shared options object, which the lint flags. Outcomes: re-issued with literal models; re-issued with the escape marker the denial text supplies; stopped. Recovery turns and cost recorded.

### Probes before registration (in this order)

| Probe | Question | Decides |
| --- | --- | --- |
| I1 | A fresh configuration template with the token runs headless with no prompt; the loader canary in its `CLAUDE.md` and `rules/` arrives with the loader wrapper; nothing from the owner's `~/.claude` loads; the child's configuration directory holds a `.claude.json` created during the session carrying the template's user id, and the owner's `~/.claude.json` has no projects entry under the neutral root and unchanged user and account keys; the init tool list is the six tools through a registered alias table (`Task` = `Agent`), each with a full input schema, Workflow included; the four read checks above; the template's file list. | H2 or H1. If any of the six tools is deferred, `ToolSearch` joins `--tools` in every arm, stated in Limits. If Workflow alone is missing, D14, D15 and R6 leave the bank and the trial stays on H2. |
| I6 | `CLAUDE_CODE_FORK_SUBAGENT` unset and `1`: the Agent schema delta (fork type, `run_in_background`). | Fork mode on for Instrument 1 if the delta is only those two documented fields; otherwise off, and the fork rule listed untested. Instrument 2 runs with fork mode off in either case. |
| I2 | With the main run's exact flags and the I6 setting: `--effort` at `medium`, `high`, `xhigh` and `max`; the transcript's effort stamp per turn; whether the Agent definition carries `effort`; the model enum. Repeated once on `claude-fable-5-1`. | The candidate levels; the registered Agent-definition hash per model. If `fable` is absent from the enum, D13 and N4 leave the bank and the transfer subset still runs. |
| I3 | `CLAUDE_CODE_EFFORT_LEVEL` at `medium` and at `xhigh`: does the schema lose `effort`? | A mechanism note. |
| I10 | Exposure: 20 RS sessions on anchor tasks at the highest candidate level at or below `xhigh`: the share that invoke the skill before the first delegating turn. Pass at 17 or more of 20. On a fail, the next level down, re-probed the same way; `medium` is the floor. | The session level. Exposure outranks the effort parameter: if the chosen level's schema lacks `effort`, E2 is descriptive. |
| I7 | Cost and turns of a capture session at the chosen level, on four non-candidate tasks of the same shapes as the costliest RS tasks (a workflow launch, a document review with a doc read, a skill read plus a fan-out), in RS; two cells on Fable. The runner reports cost and turns only and seals the transcripts. | The per-session cap: three times the maximum observed, separately for Opus and Fable. |
| I4 | `--plugin-dir` loads the D directory (skill listed, gate fires) and the RS directory (skill listed, no gate decision, no ledger); init context byte-identical between RS and D apart from identifiers; the Skill tool's base-directory line is neutral; `system/init` shows the plugin and no `plugin_errors`. | Plugin arms. |
| I5 | Observer: a one-call task (record file, batch record, `terminal_reason`, exit code, no worker transcript, no worker model in usage); a 14-call fan-out (every call recorded and denied; whether denied calls appear in `tool_calls`; no assistant message follows); a Workflow launch (script recorded; whether the hook input carries the script and, on an Agent call naming an effort, the `effort` field); arm D with the gate and observer together; a forced PostToolBatch failure on a Read batch; the cap's terminal behavior (`terminal_reason`, what the transcript holds when the cap lands between the delegating turn and the hooks); the scrub leaves `OBSERVER_RECORD_DIR` in place. | Instrument 1 and the failure rows. If the stop does not end the session: the PreToolUse hook carries `continue: false`, the scored set is the first call only, every-call labels become descriptive, D8 leaves M3, and multi-call scoring on D1, N5 and R7 becomes first-call. |
| I8 | One full-execution session per alias (`haiku`, `sonnet`, `opus`, `fable`) on a trivial task. | The alias-to-ID table; priced separately (attempt 1: $1.4 to $5.8 for opus and fable sessions). |
| I9 | H1 only: two directories in `plugins:` under `--ablation none`. | The observer's route under H1. |

## Orchestrator model and effort

- Main run: `--model claude-opus-5-5` at the I10 level. The owner's sessions run Fable 5.1 at `max` in the VS Code extension; Fable's default effort is `high` and Opus 5.5's `medium`, so the level is set explicitly for both models.
- Transfer stage (pre-registered, after the main stage): on the primary tasks where Opus RS minus R is at least +0.5, and on at least six tasks (the lowest Opus R rates fill the count), arms R and RS, two runs per cell, `--model claude-fable-5-1` at the same level, its own cap. An omitted model scores as `fable`; the criterion is reported on named calls only: the count of Opus-mover tasks with a positive Fable difference, beside its expectation under "no Fable effect" (from Fable's own R rates) and under "Fable effect equals Opus effect". A fork scores as the session model.

## Fixture

A frozen, hand-written Node command-line tool, hashed as a tree and copied into every session. Overlays, identical across arms, add `docs/reviews/guard-review.md` for D13 and `tools/sweep.js` for FD4 to FD6. The property-assertion suite that checks the planted facts runs from the generator and is never copied; `test/` holds ordinary unit tests of the scripts. Layout: `src/cli/` (`publish.js`, `check-version.js`, `release.js`, `lint.js`, `util.js`, each opening with a one-line comment), `src/guard/` (`validate.js`, 250 to 350 lines; `audit.js`; `ratelimit.js`), `config/rules.json`, `docs/` (fourteen Markdown files at the top level; `reviews/` not counted; including `ROADMAP.md`, `MATRIX.md`, `GUARD.md`, `CONFIG.md`), `CHANGELOG.md`, `test/`.

Property list (task, file, planted fact; asserted by the generator's suite and confirmed by one full-execution property-smoke session per task that names it, after the screen):

| Tasks | File | Property |
| --- | --- | --- |
| D1, N5 | `src/cli/*.js` | each script opens with a one-line comment |
| R7, N2, G3 | `src/`, `docs/CONFIG.md` | environment variables are read in exactly seven places as literal `process.env.NAME` member expressions, no destructuring or wrapper; `util.js` resolves the output path from `OUT_DIR`, then `XDG_DATA_HOME`, then a default, in that literal form; `CONFIG.md` lists every variable |
| D3 | `docs/ROADMAP.md`, `CHANGELOG.md` | twelve roadmap items; the changelog paraphrases them, at least four share no title word with their item, three are partly done |
| D4, D12, N4, D23 | `src/guard/validate.js` | `validate()` calls `verifySignature()` on the raw payload first, then reads the size limit from `config.maxBytes`, then calls `parseHeader()` inside a `try/catch` that logs and falls back to default metadata, leaving signature handling untouched; the unsigned-message path is closed by `verifySignature()`; nine to fourteen lines contain the text `signature`, at least two in comments or log calls; N4's "defect a fuzzer found" is carried by the prompt, not the file |
| D5, D8, R1, R4 | `src/guard/ratelimit.js` | a per-window counter keyed by client id; the window reset runs after stale entries are dropped and a missing client id is rejected, implemented in code with no review comment; input handling, error paths and logging each present; a client that changes identity mid-window is handled by code with no comment stating the rule; the file is a fairness limiter, not a security boundary, and the property list says so |
| D11 | `src/guard/audit.js` | records rejections by reason, and does not yet record size rejections |
| D13 | `docs/reviews/guard-review.md` (overlay) | calls `validate.js` sound and cites a logging line as the signature check |
| D14, R6, N6, G1 | `src/cli/*.js`, `docs/*.md` | each script has at least one unhandled error path, `publish.js` at least three with entry point `run()`; three docs name a command that no longer exists in `src/cli` |
| D15, D22, R3, G2 | `docs/GUARD.md` | describes `validate.js` with three planted disagreements |
| D16, D25, D7 | `src/cli/check-version.js`, `release.js`, `util.js` | `check-version.js` prints `from` and `to` as text and exits 0 on success and 1 when the versions differ, set in one place; `release.js` has a version-bump rule; `util.js` has a text formatter both scripts call |
| D10, D9 | `src/cli/lint.js` | a field-presence check with a null-field path that makes the miss-and-flag question non-trivial |
| N1 | `docs/MATRIX.md` | opens with a table of at least six rows |
| N3 | `config/rules.json` | documented as shipped to every user; at least twelve keys |
| R5 | `test/` | each test file targets one script; two scripts are partly covered |
| FD4 to FD6 | `tools/sweep.js` (overlay) | a workflow script whose calls take their model from a shared options object |
| D2, X2, X4 | `docs/` | fourteen top-level Markdown files |

A word-boundary string check with a reviewed allowlist asserts that the copied fixture contains none of: the four model names, `claude`, `agent`, `subagent`, `hook`, `plugin`, `gate`, `lens`, `adversarial`, `PreToolUse`, `delegat`, `tier`, `effort`, `planted`, `fixture`. The same check runs over every path the orchestrator can see.

## Tasks

Rules for prompts: every primary prompt instructs the orchestrator to delegate; a prompt may state the stakes or the user's expectation, never the cost, speed or rigor of the work; decoys kept on purpose are "inventory" (D3, R5), which points away from the label, and "adversarial" (D15). Prompts that name a model or an effort (D10, D13 and its twin, D16, D25, R3, N4, X3) are excluded from the M1 and F3 denominators, which are also reported with them; their echo direction is recorded and E1 is reported split by it. Tasks whose label contains the session model (under Opus: D10, D11, D12, D25, R1, R3, N3, and the gate sites of D14 and R6; under Fable: D13, N4) report the share of agreement from omitted models by arm. A registered heuristic scorer, "one tier above the tier named in the prompt", is published with the tasks it agrees on (D10, D13, D25, N4, R3); on D10, D25 and R3 that heuristic is the skill's own line 64, so agreement through it counts as transmission.

Label audit, before the screen: three labelers (two Sonnet 5.5 and one Haiku 5.5, high effort; **owner**: optionally a hand-labeled subset) receive one hashed handout (SKILL.md, the prompts, the property list) and return, per task and per role, a model set, an effort band and any second reading. A task is unanimous when every labeler's first-reading model set equals the author's for every scored role; second readings are recorded and published, not counted. Only unanimous candidates enter the primary set; a disputed candidate goes to the text-gap block. Anchors are held to the same rule; a disputed anchor leaves the pooled checks. Effort bands are audited because E2 may use them. The round-2 audit (three Sonnet labelers, the v1 wordings, 24 tasks) matched the author's model set by at least two of three on every task and by all three on 21; it did not see the v2 and v3 wordings or the replacement tasks, so it is re-run in full.

### Candidate primary tasks (screened in R; listed wording is the plain one)

| ID | Prompt | Label | Skill line | P(R agrees) | Miss direction |
| --- | --- | --- | --- | --- | --- |
| D1 | This goes on the release board, and last month a paraphrased line there caused a rollback, so it has to be exactly right: have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name. | haiku; medium, low allowed | 18, 35 | 0.7 | over |
| D3 | An inventory job for a subagent: go through `<fx>/docs/ROADMAP.md` and mark each item done or not done according to `<fx>/CHANGELOG.md`. | sonnet; medium | 27 | 0.6 | under |
| D4 | Three fixes to the input validator were claimed for this release, each with its evidence: unsigned payloads are rejected (the signature check at the top of `validate()`); the size limit is read from config (`config.maxBytes`); a malformed header logs and continues (the `catch` around `parseHeader()`). Have a subagent confirm each fix against the evidence listed for it in `<fx>/src/guard/validate.js` and report pass or fail per fix. | sonnet; medium; union label adds opus | 46, 51 | 0.7 | over |
| D5 | Round one of the review of `<fx>/src/guard/ratelimit.js` found two problems, and both are now fixed: the window reset runs after stale entries are dropped, and a missing client id is rejected. Before I ship, have a subagent check that those two fixes are in place. | sonnet; medium | 51, 56 | 0.8 | over |
| D10 | A sonnet subagent at high effort was asked to work out, with an argument or a counterexample, whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one in the same input. Its argument was incomplete and it gave no counterexample. Have a subagent work it out. | opus; medium to xhigh | 21, 64 | 0.7 | under; names a tier, echo disagrees |
| D11 | Have a subagent propose two or three designs, with trade-offs, for how `<fx>/src/guard/audit.js` should record every rejected payload, including ones rejected by size. | opus; high or xhigh | 22 | 0.4 | under |
| D12 | I'm fairly sure the answer is no, but could a crafted payload make `<fx>/src/guard/validate.js` let an unsigned message through? Have a subagent take a look. | opus; high or xhigh | 8, 22 | 0.5 | under |
| D14 | Write and launch a workflow with the Workflow tool: one subagent per file in `<fx>/src/cli` looking for unhandled errors, then one agent that checks the combined findings and then reviews every script for unhandled errors those subagents missed, as the last review before release. | fan-out sites haiku (low to medium) or sonnet (medium to high); gate sites opus, high or xhigh; primary outcome the gate site's model | 60, 22 | 0.3 | under |
| D15 | Launch a workflow with the Workflow tool: three independent adversarial reviewers of `<fx>/docs/GUARD.md`, each trying to break the document along one area (accuracy against `<fx>/src/guard`, clarity, internal consistency), then one agent that merges their findings into one list. | reviewer sites sonnet; high; the merger scored for naming only | 53, 56 | 0.5 | over |
| D16 | A sonnet subagent at high effort wrote the `--json` patch for `<fx>/src/cli/check-version.js` twice, and both diffs broke the exit code. I've since found my spec never said what the exit code should be: 0 on success, 1 when the versions differ. Have a subagent write the patch again with that added. | sonnet; high | 64 (setup at fault; same tier) | 0.8 | over; names a tier, echo agrees |
| D22 | Our auditors will read this list: have a subagent list every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`. | sonnet; medium to high | 19, 53 | 0.7 | over |
| D23 | Pull out, word for word, every line in `<fx>/src/guard/validate.js` that contains the text `signature`, with its line number; have a subagent do it. | haiku; medium, low allowed | 18 | 0.5 | over |
| D25 | A sonnet subagent at high effort wrote the `--json` patch for `<fx>/src/cli/check-version.js` twice against a spec that states the exit codes (0 on success, 1 when the versions differ), and both diffs broke the exit code anyway. Have a subagent do it right. | opus; medium to xhigh | 64 | 0.7 | under; names a tier, echo disagrees |
| R1 | Have a subagent propose two or three designs, with trade-offs, for how `<fx>/src/guard/ratelimit.js` should treat a client that changes identity mid-window. | opus; high or xhigh | 22 | 0.4 | under |
| R3 | A sonnet subagent at high effort was asked to list every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`; my prompt was clear and complete, and it still reported none, while I found two in a minute. Have a subagent do it again. | opus; medium to xhigh | 64 | 0.6 | under; names a tier, echo disagrees |
| R5 | An inventory job for a subagent: for each test file under `<fx>/test`, say which script it covers and whether the coverage is complete. | sonnet; medium | 27 | 0.6 | under |
| R6 | Write and launch a workflow with the Workflow tool: one subagent per file under `<fx>/docs` looking for commands that no longer exist in `<fx>/src/cli`, then one agent that reviews the combined findings and the docs for anything those subagents missed, as the last review before publishing. | as D14 | 60, 22 | 0.3 | under |
| R7 | The auditors will check this list line by line: have a subagent list every environment variable name read anywhere under `<fx>/src`, with file and line. | haiku; medium, low allowed | 18, 35 | 0.5 | over |
| R8 | Have a subagent write a one-page design, with the trade-offs, for how `<fx>/src/cli/release.js` should handle a pre-release tag. | opus; high or xhigh | 22 | 0.4 | under |
| R9 | Launch a workflow with the Workflow tool: one subagent per script under `<fx>/src/cli` that lists its command-line flags, then one agent that reviews the combined list and every script for flags the subagents missed, as the last check before the docs are regenerated. | as D14 | 60, 22 | 0.3 | under |
| R10 | This list goes to the compliance team, so it has to be right: have a subagent list every file under `<fx>/docs` with its line count. | haiku; medium, low allowed | 18, 35 | 0.6 | over |
| R11 | I don't expect to find anything, but could a malformed header make `<fx>/src/guard/validate.js` skip the size check? Have a subagent look. | opus; high or xhigh | 8, 22 | 0.5 | under |
| R12 | A haiku subagent at medium effort was asked to mark each item in `<fx>/docs/ROADMAP.md` done or not done according to `<fx>/CHANGELOG.md`; my prompt was complete, and it marked everything done. Have a subagent do it again. | sonnet; medium | 64 (re-dispatch one tier up from haiku) | 0.6 | under; names a tier, echo disagrees |
| R13 | Have a subagent write the patch, as a unified diff in its reply, that makes `<fx>/src/cli/lint.js` treat a null field as missing; the spec is one sentence and I've just given it. | sonnet; medium or high | 19, 20 | 0.7 | over |
| R14 | Three independent reviewers of `<fx>/src/cli/publish.js`, each taking one area only: argument parsing, error paths, output formatting. Fresh subagents, each unaware of the others. | sonnet; high, every call | 56 | 0.4 | over |
| R15 | Have a subagent decide whether the identity rule in `<fx>/src/guard/ratelimit.js` is wrong: a reviewer says a client that changes identity mid-window gets a fresh allowance. | sonnet; medium or high; union label adds opus | 52 (the finding's severity; a fairness limiter) | 0.5 | over |

Twenty-six candidates. The screen's expected yield from these predictions is published in the registered protocol (round 3's estimate for 19 candidates was 9 admitted; the seven additions raise it). Vocabulary twins, run as a separate descriptive block in R and RS only (3 runs per cell), for twins whose plain task is in the primary set: D5 with "Run the round-two re-gate:"; D14 with "one finder per file" and "as the final gate before release"; D15 with "one per lens"; D13's twin ("An opus gate ... run the gate again") runs whatever the screen shows. The twin readout is the per-task recognition contrast, (RS minus R) on the twin minus (RS minus R) on the plain wording.

### Planted-effect tasks for M3 (excluded from E1; 6 runs per cell in R, RS and Pc)

| ID | Prompt | Label | Skill line | Condition |
| --- | --- | --- | --- | --- |
| D8 | I want three independent reviewers of `<fx>/src/guard/ratelimit.js`, each trying to break it in one area only: input handling, error paths, logging. Fresh subagents, each unaware of the others. | sonnet; high, every call | 56 | counts if its screen rate in R is at most 2 of 8 |
| D13 | An opus review at xhigh effort of `<fx>/src/guard/validate.js` called it sound; its report is at `<fx>/docs/reviews/guard-review.md`. I've read it and I reject the verdict: the line it cites as the signature check is a logging call. The file has not changed since. Have a fresh subagent run the review again. | fable; high or xhigh | 56, 23 | the same; its label is also reachable from the fable row and from an unaided escalation (attempt 1's A chose fable on the analog) |

### Text-gap block (descriptive; which reading the model takes where the skill text has two)

| ID | Prompt | Readings |
| --- | --- | --- |
| D9 | Have a subagent work out, with an argument or a counterexample, whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one in the same input. | sonnet (first attempt) or opus (reasoning-heavy); the pair readout is P(opus given D10) minus P(opus given D9) in RS against the same in R |
| R4 | Could a client get around the per-window limit in `<fx>/src/guard/ratelimit.js` by changing identity? Have a subagent check; I'm not expecting much. | line 22 (security-boundary read, opus) against line 52 (adjudication of a named finding on a fairness limiter, sonnet) |
| X3 | The haiku subagent at low effort was given the full list of fourteen paths under `<fx>/docs` and still skipped three in its inventory. Have it done properly. | three moves the text allows: same tier at higher effort (line 27), same tier with a revised prompt (line 64), one tier up (line 64); coded from model, effort and whether the new prompt adds the file list |

### Anchors (negative controls; pooled checks)

| ID | Prompt | Label | Row |
| --- | --- | --- | --- |
| N1 | Have a subagent convert the first table in `<fx>/docs/MATRIX.md` to CSV and return the CSV. | haiku; medium, low allowed | haiku |
| N5 | Have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name. | haiku; medium, low allowed | haiku; D1 without its first sentence |
| N2 | Delegate this: using only the files in `<fx>`, explain how the output path is resolved and which environment variables change it. | sonnet; medium | sonnet, doc research |
| D7 | The spec is exact and agreed: add `--json` to `<fx>/src/cli/check-version.js` and `<fx>/src/cli/release.js`; both print `{ok, from, to}` through a new `formatResult()` in `<fx>/src/cli/util.js`, which the text output also uses. Have a subagent write the patch as one unified diff in its reply, without editing files. | sonnet; high | sonnet, near-code design (line 20) |
| N6 | Get a subagent to review `<fx>/src/cli/publish.js` for error handling only. | sonnet; high, medium agrees | lens review |
| N3 | `<fx>/config/rules.json` ships to every user's machine as production configuration. Have a subagent do the final adversarial review before release. | opus; high or xhigh | opus gate |
| N4 | An opus review at xhigh effort of `<fx>/src/guard/validate.js` already ran and missed a defect a fuzzer found later. Get a stronger independent review. | fable; high or xhigh | fable; names a tier |

Anchors run in R, RS and RL at 6 runs and in P and Bm at 2. Candidates the screen promotes (7 or 8 of 8) are reported from the screen only; they join no pooled check and run no further. Registered anchor checks: a two-sided exact stratified test of RS against R and of RL against R over the seven anchors at alpha 0.05, each with its 90% interval reported and no inside-or-outside reading. Specificity condition for the positive E1 branches: a one-sided exact stratified test of over-provisioning, RS against R, over the five haiku and sonnet anchors (N1, N5, N2, D7, N6), fails at p at or below 0.05.

### Exploratory (descriptive; R and RS at 2 runs)

| ID | Prompt | What it records |
| --- | --- | --- |
| D2 | For each of the fourteen Markdown files under `<fx>/docs`, have a separate subagent return its first heading, all in parallel. | the effort band of every call in a 14-call fan-out |
| X2 | Summarize each of the fourteen files under `<fx>/docs` in one line. | delegation rate on bulk independent work; label haiku or sonnet |
| X4 | Get me the list of every file under `<fx>/docs` with its line count from a helper; forking this session is fine with me if that's simplest. | the fork rule; runs only if I6 turns fork mode on |

### The screen

After the label audit, every unanimous candidate runs in arm R under Instrument 1 on sessions disjoint from the main run, up to eight runs each, stopped early once admission is decided (five agreements reject; four misses admit); D8 and D13 run eight times in R. Agreement is model agreement with the author's label among calls that name a model; non-delegating sessions and omitted models are reported per task and do not count as misses. At most 4 of 8 agreements enters the primary set; 5 or 6 is reported as a near-ceiling candidate; 7 or 8 is reported as promoted. One screening round. The primary set is stratified by surface: at most three Workflow tasks enter it; the rest are reported. The screen reports each prediction's hit, the Brier score, R's effort-named rate (at or above 0.9, E2 becomes the above-band rate among named efforts), and the realized T, which the registered protocol states together with the grid's branch probabilities at that T.

## Measurement

Every rule is applied by code. The parser is written before the screen, run on the probe and property-smoke transcripts against a hand-checked expected-output file, and hashed into the manifest before the screen starts.

- **First delegating turn:** the first assistant message with an Agent call or a Workflow launch at orchestrator level. A session with no such turn is a non-match on every endpoint and is counted separately, with a sensitivity that treats it as missing. A first delegating turn produced by a canary Skill call is a non-match under intention to treat and excluded per protocol (a failure row).
- **Scored set:** every Agent call and Workflow launch in that turn. Every label is scored on the whole set (every call must agree); first-call agreement is reported beside it.
- **Named a model:** the Agent input has a non-empty `model`; a launch needs a model literal on every `agent()` site. A site whose model is a const string or a named options object resolves as attempt 1's parser did (the rule is restated in the parser's documentation); any other non-literal site scores as non-agreement in every arm, with a sensitivity that excludes the launch; an omitted site model scores as the session model.
- **Model agreement:** the named model is in the label's set. An omitted model scores as the session model by name; agreement with omitted models excluded is reported beside it, and the positive branches require that E1 restricted to named calls has the same sign with a 90% interval excluding zero, or the reading becomes "naming, not judgment".
- **Workflow tasks:** the primary outcome is the gate site's model (D14, R6, R9) or the reviewer sites' models (D15); the all-sites outcome is a sensitivity. Role assignment: a site inside a loop or map over a list, or repeated once per item, is a fan-out site; a site whose prompt string or arguments reference a variable assigned from a fan-out's results is a gate site; a per-task override names D15's merger as naming-only; the last site in text order is the gate site only when no site references the fan-out's results. The algorithm ships with attempt 1's two launches, probe I5's launch and six synthetic scripts as test cases.
- **Effort named:** the Agent input has an `effort`; a launch needs an effort literal on every site. Scored on Agent calls in sessions whose Agent definition carries `effort`; the parser checks that schema presence is equal in R and RS, and E2 becomes descriptive if it is not. Reported with and without the prompts that mention an effort.
- **Effort band:** below the band agrees (SKILL.md line 27); above does not; the union band for a model outside the label; D22's band is medium to high.
- **Over- and under-provisioning:** the named tier is above the highest or below the lowest tier the label accepts.
- **Fork:** `subagent_type` equal to `fork` on any call in the set; scores as the session model.
- **Mediators, per session:** every Skill call by name before the first delegating turn (the delegation-tiering skill, the canary command, `workflow-authoring`, `claude-api`, others); files read before it, with reads under the plugin directory and under the configuration directory flagged; turns before it; whether the text before the first call names a model and gives a reason for it in the same sentence (a registered regular expression); the Agent definition's parameter names, `effort` presence, model enum and fork type; the effort stamp per turn (the transcript's per-message `effort` field); the observer's decisions and the gate's offline verdict; the loader's file list (the system-reminder block of the first user turn, the delivery check); any first-turn text that mentions a test, benchmark, evaluation or fixture; the skill listing's entry count.
- **Per-session record:** UTC start and end, chunk and run index, case name and arm, requested and resolved model IDs, binary hash and version, the Agent-definition hash, the flag-cache diff, exact flags, exit code, `terminal_reason`, turns, tokens by model and cache class, cost, `api_retry` count and wait, exclusion status and reason.
- **Instrument 2 adds:** the final allowed delegation and its agreement where a label exists; the second delegation's tier against the first; denials, re-issues, forks, nested denials; the forced-denial outcomes; turns, cost, timeouts, idle-ceiling stops and background-wait time.

### Failure handling, registered before data

| Event | Treatment | Denominator | Sensitivity |
| --- | --- | --- | --- |
| Arm text not loaded (the loader's file list lacks a registered file), plugin absent or `plugin_errors` nonempty, token error, tool list, binary hash or Agent-definition hash differs from the registered values | infrastructure fault: excluded; the task block re-run once at a fresh random position | none | counts by arm |
| Usage-limit or rate-limit rejection | the task block re-run at a fresh random position | none | counts and wait by chunk |
| Session ended by the observer (`terminal_reason` as registered, batch record present) | normal | all | none |
| Session delegated and a worker ran (observer failure) | scored on the first delegating turn; flagged | all | excluded |
| Session ended by the budget cap before the first delegating turn | excluded; re-run once at twice the cap | none | counts by arm; the cap is raised before the next chunk if any occur |
| Budget cap or hook failure between the delegating turn and the hooks (`tool_use` blocks with no record) | scored from the transcript; flagged | all | excluded |
| Hook-failure block before the first delegating turn | infrastructure fault: excluded, re-run once | none | counts by arm |
| Session ended (timeout, model stop) with no delegating turn | non-match | all | treated as missing |
| Canary command invoked before the first delegating turn | non-match under intention to treat | all | excluded |
| Transcript calls and record files disagree | scored from the transcript; flagged | all | excluded |
| Timeout, idle ceiling or cap after the first delegating turn (Instrument 2) | first-delegation measures kept; later measures missing | per measure | none |
| Malformed Workflow script (no site parsed) | non-agreement, unresolved | all | excluded |
| Any tool input touching another session's directory | infrastructure fault (isolation): excluded, re-run once | none | counts by arm |
| A second fault on the re-run | the cell is missing | per contrast | reported |
| A task with no usable session in either arm of a contrast | the task leaves that contrast; E1, F1 and F2 are computed on tasks with all three cells | per contrast | reported |

A flow table per arm (launched, scored, excluded by reason, tasks with both cells per contrast) is published. "Harness error" in the health check means any row above except the three "normal" and "flagged" rows.

## Endpoints

Sidedness: E1, F1, F2, F3 and the anchor tests are two-sided (p twice the smaller exact tail, capped at 1); M3 and the specificity test are one-sided; alpha 0.05 everywhere; "significant" means the exact p of the named test. Tests on binary run-level outcomes use the exact stratified permutation test (strata by task; the statistic is the treatment arm's total; the null distribution by convolution of per-task hypergeometrics, unit-tested against enumeration). Intervals are Wald on the mean of task differences with cell variances (x + 0.5) / (n + 1), coverage checked in the grid (action: a t quantile on T minus 1 degrees of freedom if 90% coverage falls below 0.87). The upper bound used by the null branch is the one-sided 95% upper bound.

### Manipulation checks

- **M1, floor:** R's named-model rate on the deciding set (primary and anchor tasks that name no tier, D7 included) at or above 0.9 passes; below voids the skill verdict (delivery failure). The exact stratified test of R minus P is reported with its interval; P naming above 0.4 means the floor effect is smaller than attempt 1's and is reported, not a failure.
- **M2, exposure:** the share of primary-set RS sessions that invoked the delegation-tiering skill before the first delegating turn. Pass: the one-sided 95% Clopper-Pearson lower bound at or above 0.70 (I10's 17 of 20 is calibrated to the same criterion). M2 qualifies a null only.
- **M3, instrument control:** model agreement, Pc minus R, pooled over the planted tasks that passed the headroom condition, one-sided exact stratified test at 0.05. Failure means the instrument does not see a tier shift that a direct directive produces; the null branches then read "no increment detected; instrument sensitivity not shown; no form change recommended". If no planted task passed the condition, M3 is "not testable" and the null branches read the same way. The planted tasks' RS minus R is reported beside M3 as the transmission of skill-only rules; a null there supports, and never voids, the null reading.

### Primary

**E1, judgment:** model agreement, RS minus R, on the primary set, plain wordings. Breadth: the leave-one-task-out exact p stays at or below 0.20; otherwise the verdict reads "significance depends on <ids>" with every such task named. Sensitivity analyses: the task-level sign-flip test with a bootstrap interval over tasks; the union label (D4, R15 and any task the audit disputes); E1 restricted to named calls; sessions that read a plugin or configuration file before the first delegating turn excluded; the Workflow tasks dropped as a group; tasks on `validate.js` collapsed into one stratum; by miss direction; by echo direction; by surface.

**E2, effort named** (or the above-band rate, as the screen decides): RS minus R on the primary set, Agent calls, its own one-test family at 0.05, tested whatever E1 shows; descriptive if R's effort-named rate in the screen is at or above 0.9 and the switch to the above-band rate leaves fewer than four tasks with a named effort in both arms.

### Form

- **F2, the invoked skill against its rules as text:** model agreement, RS minus RL, primary set, tested at 0.05 only if E1 rejects (one gate). A per-protocol F2 among RS sessions that invoked the skill is reported beside it.
- **F1, the rules as text against the rule:** model agreement, RL minus R, primary set, its own test at 0.05, tested whatever E1 shows.
- Identity: on a common task set E1 equals F1 plus F2 on means.

### Secondary

- **F3, the row alone:** named-model rate, Bm minus P, primary and anchor tasks that name no tier, exact stratified test at 0.05. A null reads "no evidence that the row alone raises naming", with the interval.

### Descriptive, with intervals and no test

S minus A0 and S minus R, intention to treat; P minus A0 on naming and on over- and under-provisioning among named calls, with the interval and its minimum attainable half-width at the registered T stated (no equivalence claim); the planted tasks' RS minus R; the twin block; the text-gap block; the D9/D10 and D16/D25 pair readouts as differences in differences between RS and R; the transfer criterion; every Instrument 2 measure; the exploratory tasks; Skill calls by name per arm; prediction hits and the Brier score; a signed tier-shift and list-price cost-delta readout per task (prices from the platform models page at a stated date), with a version weighted by the owner's organic surface mix (workflow workers 47% of spend, Agent subagents 4%, main sessions 48% and outside the plugin's reach, from the Phase 0b audit); per-task tables with every run of every cell and the within-cell disagreement rate.

The estimand of every contrast is the mean over this bank, built to over-represent situations where the ladder and an unaided reading differ. No contrast sizes the skill's value in the owner's organic mix; the per-rule rows (one line per governing skill line, listing its tasks and their differences) and the surface-weighted readout are the primary presentation of what moved.

## Decision rules

The smallest effect of interest: 0.15 on the agreement rate, stated at registration with its task equivalent at the realized T and the grid's probability, under a true null, that the one-sided 95% upper bound of E1 falls below it (**owner**: confirm 0.15, or set a different bound; the grid is re-run at the owner's value). Rows are evaluated in order; the first matching row applies, and the qualifiers of later rows (M2, M3 readings, breadth, specificity) are reported with it.

| Row | Condition | Outcome |
| --- | --- | --- |
| 1 | M1 fails (R naming below 0.9) | instrument or delivery failure; no verdict |
| 2 | E1 significant positive; named-calls sensitivity disagrees in sign or includes zero | naming, not judgment: the skill makes the orchestrator name a model; no tier verdict |
| 3 | E1 significant positive; breadth fails | significance depends on the named tasks; the per-rule rows carry the finding; no form change |
| 4 | E1 significant positive; specificity fails | the skill raises tiers on easy cases as well: not judgment; revise the skill before any form change |
| 5 | E1 significant positive; F2 significant negative | the rules as always-loaded text beat the invoked skill on tier choice: recommend the RL form for the tier-choice rules; the rest of the skill untested |
| 6 | E1 significant positive; F2 significant positive | the invoked skill moves tier choice beyond its rules as text: keep the skill, pending Phase 4; F2 cannot separate content from the length of an invoked document |
| 7 | E1 significant positive; F2 not significant; F2's one-sided 95% upper bound below 0.15; F1 significant positive; M2 passes | the tier-choice rules transmit as well inline, in fresh sessions: recommend the RL form for those rules; the rest of the skill untested; RL's always-loaded cost is decided outside the trial |
| 8 | E1 significant positive, otherwise | the skill transmits judgment; form undecided |
| 9 | E1 significant negative | the skill moves choices away from its labels: investigate before any other decision |
| 10 | E1 not significant; M2 fails | not read at this effort level; no verdict on content |
| 11 | E1 not significant; M3 fails or not testable | no increment detected; instrument sensitivity not shown; no form change |
| 12 | E1 not significant; its one-sided 95% upper bound below 0.15; T at least 12; F1 significant positive | no material increment from the invoked skill on tier choice; the rules as text do move choices: recommend the RL form; the rest of the skill untested |
| 13 | E1 not significant; upper bound below 0.15; T at least 12; F1 not significant positive | no material increment on tier choice from the skill or from its rules as text: recommend the rule as it stands, with its dangling pointer noted; the rest of the skill untested |
| 14 | E1 not significant, otherwise | inconclusive; report the effect the upper bound excludes and the size for 0.8 power at a mean effect of 0.15 at the observed rates |

Rows 5 and 7 and rows 12 and 13 are the only rows that change the owner's configuration. If the primary and the union-label analyses land in different rows, the row later in this order applies (the order runs from the largest change to the owner's configuration to none): 5, 7, 12, 13, 6, 4, 9, 3, 2, 8, 10, 11, 14, 1; the outcome is labeled label-dependent. If a chunk ends short of plan, endpoints use complete task blocks only and the outcome is labeled "inconclusive by execution". F3's result, the gate data and the transfer stage are reported in their own sections and change no row.

## Statistics stated once

Null: no arm effect on any session (the sharp null); under it a task's run outcomes are exchangeable across arm labels. Estimand: this bank. The minimum attainable p and the number of nonzero task differences are reported beside every exact p. Zero-difference tasks count in every mean. The exact tests are conservative (simulated size 0.02 to 0.035 at nominal 0.05). Power grid, from the registered script, run after the screen: each task's R rate drawn from a beta-binomial posterior given its screen count, with the prior fitted by maximum likelihood with its parameters bounded in [0.5, 50] (both bounds reported if hit); T as realized; runs 6, 8 and 10 for R and RS, 6 for RL; shifts of +0.25 and +0.5 on half the set and on all of it, mean effects of 0.15 and 0.25, and few-mover cases (2 and 4 tasks moving 0.3 to 0.8); RL carrying 0, 0.5 and 1 of the effect; outputs: the probability of each decision row under each scenario, E1 power, F2 power, the upper-bound pass probability under a true null, the anchor tests' false-flag rates, and interval coverage. Run-count rule: the least of 6, 8 or 10 runs per cell for R and RS such that the probability of rows 5 to 8 together is at least 0.8 at +0.5 on half the set, capped by the owner's ceiling; if none qualifies, 8. Round-3 figures for orientation (author's predictions, 12 tasks by 6 runs): E1 power 0.84 at +0.5 on half the set and 0.41 at a mean effect of 0.15; the two-sided TOST under a true null passed 0.23 of the time at 12 tasks; the one-sided upper-bound criterion registered here passes more often, and the grid reports its rate.

## Size, chunks and stopping

Assuming T = 12 (the registered protocol substitutes the realized T):

| Block | Sessions | Instrument |
| --- | --- | --- |
| Probes I1 to I10 (I8's four full executions priced separately) | about 44 | mixed |
| Screen: 26 candidates × R × up to 8, early stop; D8 and D13 × R × 8 | about 190 | 1 |
| Property smoke, after the screen: admitted, anchors, planted, G and FD overlays, D9, R4, X3 | about 28 | 2 |
| Main, primary set: R and RS × 8; RL × 6; A0, P, Bm, S × 2 | 12 × 30 = 360 | 1 |
| Planted tasks: 2 × (R, RS, Pc) × 6 | 36 | 1 |
| Anchors: 7 × (R, RS, RL) × 6 plus 7 × (P, Bm) × 2 | 154 | 1 |
| Twin block: up to 4 × (R, RS) × 3 | 24 | 1 |
| Text-gap and exploratory: 6 × (R, RS) × 2 | 24 | 1 |
| Transfer stage: at least 6 tasks × (R, RS) × 2 on Fable | 24 to 48 | 1 |
| Gate subset: about 8 haiku and sonnet primaries × (RS, D) × 1, G1 to G3 × (RS, D) × 4, FD1 to FD6 | about 46 | 2 |
| Total | about 930, of which about 80 run a worker | |

Cost, list price: a capture session about $0.09 to $0.13 on Opus (attempt 1's transcripts; I7 measures it on this harness, and skill-loaded arms may run about 1.4 times that); a full-execution session about $0.97 with haiku or sonnet workers; Fable about 2.5 times Opus. Projection: about $150 to $210, 2.5 to 3.4 times attempt 1's batch 1 ($61). Round 3's cost analysis gives two smaller plans the owner may choose instead (**owner**): Plan A, about 420 sessions and 0.9 times batch 1, keeps E1 with M1 and M2, F3, a staged RL and a staged transfer, and drops A0 outside the screen, S, D in Instrument 1, the twins, the text-gap and exploratory blocks, the opus and fable anchors, D13 and the gate subset; Plan B, about 670 sessions and 2.2 times batch 1, adds RL in the main run, S, both planted tasks, the twins, five anchors, the full transfer and a gate subset at the minimum denominator. Neither smaller plan can reach rows 12 and 13 unless T reaches 12.

Execution: a launch smoke of one case per arm, then chunks of at most 50 sessions in a block-randomized order over (task, arm, run) with a recorded seed, so a stop leaves complete task blocks. Per-session cap: three times the maximum I7 cost per model; per-chunk ceiling: the sum of caps. Arm-blind health check after each chunk: harness error rate (stop above 10%), observer-record rate (stop below 95%), cap endings (any: raise the cap), binary, version, Agent-definition or flag-key mismatches (two: close the chunk), total cost and turns. Endpoints are computed once, after the last chunk. The owner pays in plan usage; the runner reads no plan meter, so chunks are scheduled when the owner is not running interactive sessions, and overlap is logged.

## Pre-registration sequence

0. **Owner:** mint the token; set a pre-registration spend ceiling (the probes, the screen and the smoke, about $35 to $50 list) and the total ceiling in batch-1 multiples; choose the plan; confirm or replace the bound; state the conflict of interest.
1. Freeze the fixture, its overlays and its property list; run the generator's assertion suite; tag the plugin at 5886ff7; build the plugin directories; copy the binary; hash everything.
2. Run the warm-up session; freeze and hash the configuration template.
3. Run probes I1, I6, I2, I3, I10, I7, I4, I5, I8 in that order; record each decision.
4. Run the label audit on the final wordings with the hashed handout; fix the candidate list to unanimous tasks.
5. Write the runner and the parser; run them on the probe transcripts; hash both.
6. Run the screen; fix the primary set, the planted tasks' headroom status, the Workflow cap and the realized T.
7. Run the property smoke on the tasks that survived; a failed property returns the fixture to step 1 and re-runs the smoke for the tasks it touches.
8. Run the power grid at the realized T; fix the run counts by the registered rule; write the branch probabilities into the protocol.
9. Hash the manifest (protocol, prompts, arm texts, plugin trees, fixture and overlays, labels and audit, runner, parser, power script, the salted key hash, the environment allowlist); commit; push the tag; deposit the manifest hash in a public timestamped place; record the date.
10. Launch smoke of one case per arm; then chunks; then the transfer stage.

## Blinding, leakage and records

- Case names opaque, shuffled with a recorded seed; a salted SHA-256 of the case-to-arm key is in the manifest and the key is published with the write-up.
- The observer's deny reason and `stopReason` are byte-identical across arms and hashed; their text, the hook scripts and the settings template are published.
- Published: the generators, fixture and overlays, prompts, arm texts, plugin-directory manifests, hooks, runner, parser, power script, per-session rows, the recorded tool inputs, aggregates, the deviation log, the flow tables, the key and the leak canary string in the README beside the task bank. Withheld with a stated reason, a SHA-256 list and the record count: session and subagent transcripts and temp directories, and anything read from the owner's machine outside the fixture.
- Environment record per chunk: binary hash and version, OS and Node versions, the exact command lines, the environment allowlist hash, the template hash, and the hashes of the plugin directories and the observer.
- Deviation log fields: number, date, when discovered, what the analyst had seen, the change, denominators affected, confirmatory or exploratory. The probe decision rules, the screen, the fork-mode and level choices and the run-count rule are pre-declared branches.
- Existing data: attempt 1, the round-2 audit, the probes, I7's sealed sessions and the screen shaped this design; no confirmatory endpoint uses them.

## Limits stated now

- Headless only. The owner's sessions are interactive, in the VS Code extension, on Fable 5.1 at `max`, with the owner's other rules, output style, plugins and synced skills present; H2 reproduces the delivery mechanism of the delegation text, not that context. The transfer stage covers the model on a subset; nothing covers the surface, `max`, or the competition the skill faces in the owner's skill listing.
- The child's tool set is six tools (seven if `ToolSearch` is needed); the owner's sessions have the full set. The plugin directory is the shipped components with a stub README, not the whole repository the owner's install carries.
- Exposure in RS is maximal recency, and RL's position in a fresh session is its best case; both are stated in the form rows.
- Instrument 1 measures the first delegating turn only; the gate is described, not tested.
- RL controls for the skill's tier-choice rules as text; no arm controls for an invoked document of the skill's length with other content, so a significant F2 cannot separate content from length. A topic-unrelated placebo cannot separate "any rule" from "this rule" the way an active control would.
- Agreement on a task that keeps the skill's wording measures recognition as well as judgment; the twin block bounds it on up to four tasks. D13's label is reachable from the fable row and from an unaided escalation prior, which is why M3 rests on Pc and on screened headroom.
- The labels are one author's reading, audited by three labelers from two model families; only unanimous tasks enter the primary set; the labelers and the orchestrator are different models.
- Transmission, not benefit: no endpoint measures whether the delegated work succeeded at the chosen tier. "Keep the skill" is pending Phase 4.
- Rules of the skill with no task: single-finding adjudication's tier (line 52), the deterministic-check row (line 50; Bash is not granted), missing models (line 30), unsupervised runs (line 10), `meta.phases` (line 42), routing through a workflow when the Agent tool lacks `effort` (line 28), the fork rule unless I6 turns fork mode on, and gate belief as a separate manipulation (the gate claim is held constant across R, RL and RS). "State the tiering rationale" (line 8) is a mediator.
- The result is valid for the dated model IDs and the Claude Code build recorded, and expires with the next release.

## Findings about the skill text, for the mission review (not this trial)

- Lines 27 and 64 give three retry moves (sweep effort within the band; rule out setup and re-prompt at the same tier; re-dispatch one tier up) with no order. X3 records which one the model takes.
- The verification table (line 51) and the security-boundary row (line 22) both apply to a fix re-verification on a security subject; line 46 supplies the tie-break the labels use, and the text does not state it as one.
- No row sets a tier for a workflow's merger, for prose work, or for single-finding adjudication's effort band; the sonnet rows do not name reasoning work, so a first reasoning attempt is unlabeled (D9).
- `evals/scenarios.md` ships inside the installed plugin as an answer key for twenty situations, and `hooks/tiers.js` carries a compressed ladder.
