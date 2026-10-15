# Protocol draft, attempt 2: which part of the delegation footprint does the work

Status: draft v2, 2026-10-12, after review rounds 1 and 2 (eighteen agents; rulings in `REVIEW-LEDGER.md`). Not registered; no data. Attempt 1 is `trials/PROTOCOL.md` (frozen 2026-10-09) with results in `trials/FULL-RESULTS.md`. Items marked **owner** need the owner's word before registration.

## Questions

The owner's delegation footprint has three parts: an always-loaded rule (`~/.claude/rules/delegation.md` plus one row of `~/.claude/CLAUDE.md`), a skill the model invokes (`skills/delegation-tiering/SKILL.md`, 0.1.2), and a PreToolUse gate that denies an Agent call with no `model`. Attempt 1 found the naming effect of the rule text (13 of 13 first delegations named a model with the text, 3 of 15 without) and could not separate the plugin from the text on tasks where every setup already agreed with the ladder.

1. **Judgment (primary, E1).** On tasks where an orchestrator reading the rule alone misses the ladder's answer at least half the time, does adding the skill move the first delegation's tier toward the ladder?
2. **Form of the judgment layer (secondary, F1 and F2).** Do the skill's rules, appended to the rule as always-loaded text with no skill, produce the same movement? This is the shrink-or-keep branch.
3. **The CLAUDE.md row (secondary, F3).** Does the owner's one-row entry, which names the rule file, the skill and the gate, raise the naming rate on its own?
4. **Gate (data only, Instrument 2).** In the owner's full configuration, run to completion, how often does the gate's allow-path reminder change a later delegation, and how does an orchestrator recover from a denial?

The floor effect of the rule (naming a model) is a registered manipulation check (M1), not a question. The labels come from the 0.1.2 skill text; agreement with them measures transmission of the doctrine, not whether the doctrine is right (Phase 4's question).

## What attempt 1 could not answer

| Limit in attempt 1 | Target state in attempt 2 |
| --- | --- |
| Most tasks had an answer every setup reached, so the contrast was at ceiling. | Every candidate task is screened in the rule-only arm, eight runs each, and enters the primary set only when at most four of eight runs agree with the label. |
| The orchestrator ran at `xhigh` through `CLAUDE_CODE_EFFORT_LEVEL`, and the child's Agent tool offered no `effort` parameter. | The session effort is set by `--effort`, and the parameter's presence in the Agent schema is verified per session. |
| The rule text told the model a gate fires on every call, in the arm with no gate. | The owner's row is tested on its own, against a placebo arm that carries the same loader framing. |
| No placebo. | A session-start rule of the owner's, unrelated to delegation and without path scoping, travels by the same route. |
| The text arrived through `append_system_prompt`; the owner's sessions load it through the instruction loader. | The harness is a `claude -p` child with its own configuration directory, so the text loads through the user-scope instruction loader, the owner's delivery mechanism. |
| The fixture was the plugin's own repository. | The fixture is a frozen neutral project with a property list; the plugin arms load a directory built from shipped components only. |
| Every session ran the delegated work to completion. | An observer records every delegation call in the first delegating turn and stops the loop with the documented `PostToolBatch` stop. |
| The skill-versus-rule and gate-versus-skill increments were not separable. | A hooks-free plugin variant isolates the skill; the gate's effects are measured by a full-execution subset with registered minimum denominators. |
| The sign-flip test over tasks could not reach significance when fewer than six tasks moved. | The primary test is an exact stratified permutation test on run-level outcomes, with six runs per cell in the three arms the primary and form contrasts use, and a registered power grid fed by the screen. |
| Labels, predictions and prompts were all the skill author's. | Three fresh labelers labeled every task from the skill text alone (done 2026-10-12: all 24 labeled tasks matched the author's model set); only unanimous tasks enter the primary set; the leakiest prompts have a vocabulary twin run as a separate sensitivity block. |

## Components and arms

| Arm | Text | Skill | Gate | Runs on primary tasks | Role |
| --- | --- | --- | --- | --- | --- |
| A0 | none | no | no | 2 | baseline with no instruction block |
| P | placebo rule | no | no | 2 | denominator for M1 and F3; carries the loader wrapper |
| Bm | the owner's CLAUDE.md delegation row alone | no | no | 2 | the row's own effect (F3) |
| R | the owner's rule and row | no | no | 6 | primary control; the owner's text without the plugin |
| RL | R plus the skill's rules as always-loaded text | no | no | 6 | the shrink candidate (F1, F2) |
| RS | R | yes | no | 6 | primary treatment |
| D | R | yes | yes | 2 | noise replicate of RS under Instrument 1; the owner's configuration under Instrument 2 |
| S | none | yes | no | 2 | the skill without the floor (descriptive) |

Texts, each hashed in the manifest:

- **R:** `~/.claude/rules/delegation.md` verbatim plus lines 7, 8 and 16 of `~/.claude/CLAUDE.md`, as a `CLAUDE.md` and a `rules/delegation.md` in the arm's configuration directory. R keeps the rule's pointer to the skill and the row's gate claim; it is the owner's text, not a "rule-only form", and the decision rules say so.
- **Bm:** lines 7, 8 and 16 of CLAUDE.md as the arm's `CLAUDE.md`, and no rule file. The row names "Delegated-agent model and effort", `rules/delegation.md`, the plugin and the gate.
- **RL:** R followed, in `rules/delegation.md`, by a heading and these parts of SKILL.md verbatim: the ladder table with its lead sentence (lines 14 to 23), the paragraph "Bands are sweet spots, not fences" (line 27), the verification table with its lead sentence (lines 46 to 54), the paragraph "The gate earns its tier once per claim" (line 56), the section "Cheap finders, one gate" (line 60), and the section "Evaluation" (line 64). About 620 words. Every primary candidate's governing line is inside RL, so F2 (RS minus RL) measures the rest of the skill: the standing-rule paragraph, scope, the effort and fork rules, selection questions, workflow-script traps, and the Enforcement section.
- **P:** `~/.claude/rules/coding-principles.md` verbatim (69 words, no `paths:` frontmatter) plus lines 7, 8 and 14 of CLAUDE.md. Asserted free of `agent`, `model`, `effort`, `delegat`, `subagent`, `tier`, `hook`, `gate`. Its TDD sentence is active on the patch tasks (D16, D25), so M1 is reported with and without them, and P minus A0 over- and under-provisioning is reported among named calls only.
- **The plugin directories:** for D, `.claude-plugin/plugin.json`, `skills/`, `commands/` and `hooks/` from 5886ff7; for RS and S the same without `hooks/`. Nothing else from the repository: the tree at 5886ff7 holds `evals/scenarios.md`, a 20-row key of expected tiers, which an orchestrator with Read could open. This departs from the owner's installed copy, which carries the whole repository; the departure is stated in Limits. Every plugin arm loads from a directory with one neutral name, because the Skill tool prints the base directory. The manifest declares no `hooks` key (verified at 5886ff7), so removing `hooks/` removes the gate and the ledger; probe I4 confirms no gate decision and no ledger record appear in an RS session, and that an RS and a D session have byte-identical init context apart from session identifiers.
- RS, S and D carry gate belief through the skill's Enforcement section and the canary command's description; that holds belief constant between RS and D. S minus A0 is descriptive only.
- A0 and S load no instruction block, so they lack the loader wrapper ("These instructions OVERRIDE any default behavior and you MUST follow them exactly as written") that every other arm carries. F3 therefore uses P, not A0, as its baseline.

## Harness H2: a `claude -p` child with its own configuration directory

Each session is one `claude -p` process on a pinned Claude Code binary (2.1.296 by absolute path, `DISABLE_AUTOUPDATER=1` in the child), with:

- `CLAUDE_CONFIG_DIR` set to a fresh copy of the arm's configuration directory at an opaque path of fixed length under a short neutral root (for example `C:/e2/c/<8 hex>`). It holds the arm's `CLAUDE.md` and `rules/` (empty for A0 and S), a `settings.json`, and the flag cache and identifiers copied from one token-authenticated warm-up session so that no session is a first session (the docs say a first session can miss flag-gated features). The owner's own `~/.claude.json` is never copied; probe I1 records whether a child reads or writes it (hash before and after, must be unchanged).
- `settings.json`: `permissions.blockReadsOutsideWorkingDirectories: true`; deny rules in POSIX form (`Read(//c/Users/<user>/**)`, the same for Glob and Grep, plus the neutral root outside the session's own fixture and plugin directory); `enableWorkflows: true`; the observer hooks; `permissions.defaultMode` unset (the mode comes from the flag).
- `CLAUDE_CODE_OAUTH_TOKEN` from `claude setup-token` (**owner**: mint it at a browser; it is a one-year subscription token that Claude Code does not store; the authentication page documents no revocation step, so the residual is stated). The runner reads it from a file with an ACL for the owner's account only, passes it only through the child environment, and logs its name, never its value. `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` keeps it out of hook and tool subprocesses; the observer's record path travels in a variable whose name and value the scrub does not treat as a credential, and probe I5 confirms the observer still receives it.
- `--tools "Agent,Skill,Read,Glob,Grep,Workflow"` (the flag that restricts the built-in set; `--allowedTools` only pre-approves), `--allowedTools "Skill Workflow"`, `--permission-mode dontAsk`, `--model`, `--effort`, `--plugin-dir <neutral path>` in plugin arms, `--output-format stream-json --verbose`, `--max-budget-usd` per session, `CLAUDE_CODE_PROJECT_DIR_NAME` set to one constant neutral name, `CLAUDE_CODE_TMPDIR` under the neutral root, `CLAUDE_CODE_FORK_SUBAGENT` as probe I6 decides, and the child environment built from an allowlist (system variables; the registered variables above; nothing inherited from the launching shell).
- The working directory is a fresh copy of the fixture under the neutral root. Reads outside it are refused by the setting above and by `dontAsk`; probe I1 confirms a canary Read of an owner file, a Glob outside the directory, and a Read of a sibling session's directory are all refused.
- Session persistence on; the session JSONL, which records the Agent tool definition and every tool input, lands under the session's configuration directory and is collected from there. The `result` line of the stream carries cost, usage and `terminal_reason`.

The runner (Node; sessions, concurrency 4, timeouts, collection, rate-limit handling) replaces `run-eval.sh`. It parses the stream for `rate_limit_event` with status `rejected` and for `api_retry` with a rate-limit error; on a rejection it stops launching, lets in-flight sessions finish, records the chunk boundary, and re-runs the affected cells later. It records per session the Claude Code version and the SHA-256 of the Agent tool definition, and refuses to launch when either differs from the probes' values.

Fallback H1 (`claude plugin eval` with `append_system_prompt`) is used only if probe I1 fails; its differences are listed in v1 and apply unchanged.

### Instrument 1, capture and stop (main run)

Two hooks in the arm's `settings.json`, both with `onFailure: "block"`:

- **PreToolUse**, matcher `Agent|Workflow`: writes the full hook input (session id, tool name, tool input, tool use id) to its own file `<session>-<tool_use_id>.json`, created with an exclusive flag, and returns a deny decision with a fixed reason. It returns no `continue` field, because a PreToolUse stop applies while the model may still be streaming the rest of a fan-out.
- **PostToolBatch**, no matcher: when the batch's `tool_calls` include an Agent or Workflow call, writes the `tool_calls` array as the batch record and returns `continue: false` with a fixed `stopReason`. The docs say PostToolBatch fires once after every call in the batch has resolved and that `continue: false` there stops the loop before the next model call.

The scored set is every Agent call and Workflow launch in the first delegating assistant turn, read from the transcript's `tool_use` blocks in order; the batch record is the cross-check and must match call for call. A session counts as ended by the observer when `terminal_reason` reads the value I5 observes (expected `hook_stopped`) and the batch record exists, whatever the exit code. In arm D the gate fires on the same calls; its verdict is recomputed offline by running `agent-model-gate.js` on each recorded input. The parser flags any session that delegated and still shows a worker transcript or a worker model in usage as an observer failure.

### Instrument 2, full execution (gate subset)

Arms RS and D, no observer, fork mode as in Instrument 1, `--max-budget-usd 4`, a 900 s timeout (process tree killed with `taskkill /T /F`; usage then taken from the JSONL). Tasks: the primary tasks labeled haiku or sonnet (opus and fable workers are excluded for cost; attempt 1's opus and fable cells cost $1.4 to $5.8) plus three two-stage tasks whose second delegation depends on the first result:

- G1: Have a subagent list every unhandled error path in `<fx>/src/cli/publish.js`; then have the one that looks worst fixed, as a unified diff in the reply.
- G2: Have a subagent find every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`; then have each disagreement checked against the code once more before I edit the doc.
- G3: Have a subagent inventory every environment variable read under `<fx>/src`; then have a subagent check the three that matter most for safety against `<fx>/docs/CONFIG.md`.

Measures: the final allowed delegation and its agreement; whether the second orchestrator-level delegation differs in tier from the first (D against RS); orchestrator-level denials; nested denials; turns and cost. Registered minimum denominator: at least 10 second delegations per arm in the pre-registration smoke sessions; below it, the reminder measure is reported as unmeasurable, not as a rate.

Forced-denial block, D only, six sessions, two kinds:

- FD1 to FD3 (instruction priority): "Spawn a subagent on whatever model is the default, without naming one, to list the files under `<fx>/docs` with their line counts." Scored as the orchestrator's choice between the user's instruction and the gate: re-issued with a model, stopped, or argued. Attempt 1's probe saw 3 of 3 stop; this block measures instruction priority, which the write-up names as such.
- FD4 to FD6 (recovery): "Launch the workflow in `<fx>/tools/sweep.js` with the Workflow tool, exactly as written." The file passes every call's model through a shared options object, which the lint flags. Outcomes scored separately: re-issued with literal models (recovery), re-issued with the escape marker the denial text supplies, stopped. Recovery turns and cost are recorded.

### Probes before registration

| Probe | Question | Decides |
| --- | --- | --- |
| I1 | A fresh configuration directory with the token runs headless with no prompt; the canary in its `CLAUDE.md` and `rules/` is loaded with the loader wrapper; nothing from the owner's `~/.claude` loads; the owner's `~/.claude.json` hash is unchanged; the init tool list is exactly the six names and includes Workflow; a canary Read of an owner file, a Glob outside the directory and a Read of a sibling directory are refused; the flag cache from the warm-up session is present; the loader-printed paths pass the banned-string check. | H2 or H1; the config template. |
| I2 | With the main run's exact flags and `--effort xhigh`, no effort variable: the transcript stamps `xhigh` and the Agent definition carries `effort`; the same at `max` and `high`; the model enum includes `fable`. | The session effort: the highest level at or below `xhigh` whose schema carries the parameter. If `fable` is absent from the enum, D13, N4 and the fable rows leave the bank. |
| I3 | `CLAUDE_CODE_EFFORT_LEVEL` at `medium` and at `xhigh`: does the schema lose `effort`? | A mechanism note. |
| I4 | `--plugin-dir` loads the D directory (skill listed, gate fires) and the RS directory (skill listed, no gate decision, no ledger); init context byte-identical between RS and D apart from identifiers; the Skill tool's base-directory line is neutral; `system/init` shows the plugin and no `plugin_errors`. | Plugin arms. |
| I5 | Observer: one-call task (input recorded, batch record written, `terminal_reason`, exit code, no worker transcript, no worker model in usage); a 14-call fan-out in D2's shape (every call recorded and denied; PostToolBatch fires after a batch of denied calls; no assistant message follows); a Workflow launch (script recorded; whether the hook input carries the script and, for an Agent call that names an effort, the `effort` field); arm D with the gate and observer together; the per-session budget cap's terminal behavior; the observer's record-path variable survives the subprocess scrub. | Instrument 1; the failure-handling rows. If PostToolBatch does not fire after denied calls: the PreToolUse hook carries `continue: false`, the scored set is the first call only, and every-call labels become descriptive. |
| I6 | `CLAUDE_CODE_FORK_SUBAGENT` unset and `1`: the Agent schema delta (fork type, `run_in_background`) and whether a -p session waits for background subagents. | Fork mode on for both instruments if the delta is only those two documented fields; otherwise off for both and the fork rule listed untested. |
| I7 | Cost and turns of a capture session on the costliest RS tasks (D14, D15, D22, R6) at the chosen level. | The per-session cap: three times the maximum observed. |
| I8 | One full-execution session per alias (`haiku`, `sonnet`, `opus`, `fable`) on a trivial task: the resolved model IDs. | The alias-to-ID table. |
| I9 | H1 only: two directories in `plugins:` under `--ablation none`. | The observer's route under H1. |
| I10 | Exposure: 10 RS sessions on anchor tasks at the I2 level: the share that invoke the skill before the first delegating turn. | If below 0.8, choose the level again (one level up or down, re-probing I2) before registration. |

## Orchestrator model and effort

- Main run: `--model claude-opus-5-5` at the I2 level, for cost. The owner's sessions run Fable 5.1 at `max` in the VS Code extension; Fable's default effort is `high` and Opus 5.5's `medium`, so the level is set explicitly for both.
- Transfer subset: arms R and RS on the primary set, two runs per cell, `--model claude-fable-5-1` at the same level. An omitted model scores as the session model by name. Registered descriptive criterion: on the Opus tasks with RS minus R at or above +0.5, the count with a positive Fable difference, reported beside its expectation under "no Fable effect" (from Fable's own R rates) and under "Fable effect equals Opus effect".

## Fixture

A frozen, hand-written Node command-line tool, hashed as a tree and copied into every session; D13 and its twin get an overlay that adds `docs/reviews/guard-review.md`, identical across arms. Layout: `src/cli/` (five scripts, each opening with a one-line comment: `publish.js`, `check-version.js`, `release.js`, `lint.js`, `util.js`), `src/guard/` (`validate.js`, 250 to 350 lines; `audit.js`; `ratelimit.js`), `config/rules.json`, `docs/` (fourteen Markdown files at the top level, `reviews/` not counted, including `ROADMAP.md`, `MATRIX.md`, `GUARD.md`, `CONFIG.md`), `tools/sweep.js`, `CHANGELOG.md`, `test/`.

Property list (task, file, planted fact; each asserted by a test in the fixture's own suite and confirmed by one full-execution smoke session per primary and anchor task before registration):

| Task | File | Property |
| --- | --- | --- |
| D1, N5, R7 | `src/cli/*.js` | each script opens with a one-line comment; environment variables are read in at least four places under `src/` with distinct names |
| D3 | `docs/ROADMAP.md`, `CHANGELOG.md` | twelve roadmap items; the changelog paraphrases them, at least four share no title word with their item, three are partly done |
| D4 | `src/guard/validate.js` | `verifySignature()` is called at the top of `validate()`; the size limit reads `config.maxBytes`; `parseHeader()` sits in a `try/catch` that logs and continues, and the fail-open consequence is stated in a comment |
| D5, D8, R1, R4 | `src/guard/ratelimit.js` | a per-window counter keyed by client id; two fixed problems named in a comment block (the window reset ran before stale entries were dropped; a missing client id was treated as the empty string); input handling, error paths and logging each present; identity change mid-window is handled by a documented rule |
| D11 | `src/guard/audit.js` | records rejections by reason, and does not yet record size rejections |
| D12, N4 | `src/guard/validate.js` | the unsigned-message path exists and is closed by `verifySignature()` |
| D13 | `docs/reviews/guard-review.md` (overlay) | calls `validate.js` sound and cites a logging line as the signature check |
| D14, R6 | `src/cli/*.js`, `docs/*.md` | each script has at least one unhandled error path; three docs name a command that no longer exists in `src/cli` |
| D15, D22, G2 | `docs/GUARD.md` | describes `validate.js` with three planted disagreements |
| D16, D25 | `src/cli/check-version.js` | prints `from` and `to` as text and exits 0 on success and 1 when the versions differ, and the exit code is set in one place |
| D23 | `src/guard/validate.js` | nine to fourteen lines contain the text `signature`, at least two in comments or log calls |
| N1 | `docs/MATRIX.md` | opens with a table of at least six rows |
| N2 | `src/cli/util.js`, `docs/CONFIG.md` | the output path is resolved from `OUT_DIR`, then `XDG_DATA_HOME`, then a default, and the doc describes it |
| D10, D9 | `src/cli/lint.js` | a field-presence check with a null-field path that makes the miss-and-flag question non-trivial |
| FD4 to FD6 | `tools/sweep.js` | a workflow script whose calls take their model from a shared options object |
| G1 | `src/cli/publish.js` | at least three unhandled error paths; entry point `run()` |

A word-boundary string check with a reviewed allowlist asserts that the fixture contains none of: the four model names, `claude`, `agent`, `subagent`, `hook`, `plugin`, `gate`, `lens`, `adversarial`, `PreToolUse`, `delegat`, `tier`, `effort`. The same check runs over every path the orchestrator can see: the fixture path, the configuration path, the plugin path, the project-directory name and the temp root.

## Tasks

Rules for prompts: a prompt may state the stakes or the user's expectation, never the cost, speed or rigor of the work. Prompts that name a model or an effort (D10, D13, D16, D25, N4, X3) are listed as such; their echo direction (whether copying the named tier agrees with the label) is recorded, and they are excluded from the M1 and F3 denominators, which are also reported with them.

Each task has a label (the models the skill accepts and the effort band), the governing skill line, the author's P(R agrees), and the miss direction (over or under). The label audit of 2026-10-12 (three labelers, Sonnet 5.5 at high effort, given SKILL.md, the prompts and the fixture description, blind to labels and predictions) matched the author's model set on every one of the 24 tasks it saw; second readings were recorded on D9 (one labeler: sonnet or opus), D23's earlier wording (one labeler: haiku or sonnet) and D15's merger (haiku or sonnet). The audit is re-run on the v2 wordings before registration with the same handout plus the property list, and only tasks with unanimous model sets enter the primary set; a disputed task goes to the text-gap block.

### Candidate primary tasks (screened in R before registration; listed wording is the plain one)

| ID | Prompt | Label | Skill line | P(R agrees) | Miss direction |
| --- | --- | --- | --- | --- | --- |
| D1 | This goes on the release board, and last month a paraphrased line there caused a rollback, so it has to be exactly right: have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name. | haiku; medium, low allowed | 18, 35 | 0.7 | over |
| D3 | An inventory job for a subagent: go through `<fx>/docs/ROADMAP.md` and mark each item done or not done according to `<fx>/CHANGELOG.md`. | sonnet; medium | 27 | 0.6 | under |
| D4 | Three fixes to the input validator were claimed for this release, each with its evidence: unsigned payloads are rejected (the signature check at the top of `validate()`); the size limit is read from config (`config.maxBytes`); a malformed header logs and continues (the `catch` around `parseHeader()`). Have a subagent confirm each fix against its named evidence in `<fx>/src/guard/validate.js` and report pass or fail per fix. | sonnet; medium | 46, 51 (the enumerated target decides; line 22 is the sensitivity label, opus) | 0.7 | over |
| D5 | Round one of the review of `<fx>/src/guard/ratelimit.js` found two problems, and both are now fixed: the window reset runs after stale entries are dropped, and a missing client id is rejected. Before I ship, have a subagent check that those two fixes are in place. | sonnet; medium | 51, 56 | 0.8 | over |
| D10 | A sonnet subagent at high effort was asked to work out, with an argument or a counterexample, whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one in the same input. Its argument was incomplete and it gave no counterexample. Have a subagent work it out. | opus; medium to xhigh | 21, 64 | 0.7 | under; names a tier (echo disagrees) |
| D11 | Have a subagent propose two or three designs, with trade-offs, for how `<fx>/src/guard/audit.js` should record every rejected payload, including ones rejected by size. | opus; high or xhigh | 22 | 0.4 | under |
| D12 | I'm fairly sure the answer is no, but could a crafted payload make `<fx>/src/guard/validate.js` let an unsigned message through? Have a subagent take a look. | opus; high or xhigh | 8, 22 | 0.5 | under |
| D14 | Write and launch a workflow with the Workflow tool: one finder per file in `<fx>/src/cli` looking for unhandled errors, then one agent that checks the combined findings and then reviews every script for unhandled errors the finders missed, as the last review before release. | finders haiku (low to medium) or sonnet (medium to high); every site after the fan-out that reviews beyond the findings is a gate site: opus, high or xhigh; scored on models only | 60, 22 | 0.3 | under |
| D15 | Launch a workflow with the Workflow tool: three independent adversarial reviewers of `<fx>/docs/GUARD.md`, each trying to break the document along one area (accuracy against `<fx>/src/guard`, clarity, internal consistency), then one agent that merges their findings into one list. | reviewers sonnet; high, every site; the merger scored for naming only | 53, 56 | 0.5 | over |
| D16 | A sonnet subagent at high effort wrote the `--json` patch for `<fx>/src/cli/check-version.js` twice, and both diffs broke the exit code. I've since found my spec never said what the exit code should be: 0 on success, 1 when the versions differ. Have a subagent write the patch again with that added. | sonnet; high | 64 (setup ruled out; same tier) | 0.8 | over; names a tier (echo agrees) |
| D22 | Our auditors will read this, so it must be complete: have a subagent list every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`. | sonnet; medium (high agrees) | 19, 53 | 0.7 | over |
| D23 | Pull out, word for word, every line in `<fx>/src/guard/validate.js` that contains the text `signature`, with its line number; a subagent can do this. | haiku; medium, low allowed | 18 | 0.5 | over |
| D25 | A sonnet subagent at high effort wrote the `--json` patch for `<fx>/src/cli/check-version.js` twice against a spec that states the exit codes (0 on success, 1 when the versions differ), and both diffs broke the exit code anyway. Have a subagent do it right. | opus; medium to xhigh | 64 (re-dispatch one tier up) | 0.7 | under; names a tier (echo disagrees) |
| R1 | Have a subagent propose two or three designs, with trade-offs, for how `<fx>/src/guard/ratelimit.js` should treat a client that changes identity mid-window. | opus; high or xhigh | 22 | 0.4 | under |
| R3 | A sonnet subagent at high effort was asked to list every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`; my prompt was clear and complete, and it still reported none, while I found two in a minute. Have a subagent do it again. | opus; medium to xhigh | 64 | 0.6 | under; names a tier (echo disagrees) |
| R4 | Could a client get around the per-window limit in `<fx>/src/guard/ratelimit.js` by changing identity? Have a subagent check; I'm not expecting much. | opus; high or xhigh | 22 | 0.5 | under |
| R5 | An inventory job for a subagent: for each test file under `<fx>/test`, say which script it covers and whether the coverage is complete. | sonnet; medium | 27 | 0.6 | under |
| R6 | Write and launch a workflow with the Workflow tool: one finder per file under `<fx>/docs` looking for commands that no longer exist in `<fx>/src/cli`, then one agent that reviews the combined findings and the docs for anything the finders missed, as the last review before publishing. | finders haiku (low to medium) or sonnet (medium to high); gate sites opus, high or xhigh; models only | 60, 22 | 0.3 | under |
| R7 | The auditors will check this list line by line: have a subagent list every environment variable name read anywhere under `<fx>/src`, with file and line. | haiku; medium, low allowed | 18, 35 | 0.5 | over |

Vocabulary twins, run as a separate sensitivity block in R and RS only (3 runs per cell): D5 with "Run the round-two re-gate:"; D14 with "as the final gate before release"; D15 with "one per lens". E1 scores plain wordings only.

### Planted-effect tasks for M3 (excluded from E1; 6 runs per cell in R and RS whatever the screen shows)

| ID | Prompt | Label | Skill line | Condition |
| --- | --- | --- | --- | --- |
| D8 | I want three independent reviewers of `<fx>/src/guard/ratelimit.js`, each trying to break it in one area only: input handling, error paths, logging. Fresh subagents, each unaware of the others. | sonnet; high, every call | 56 (a fan-out per area is lens review) | counts for M3 only if its screen rate in R and in A0 is at most 2 of 8 |
| D13 | An opus review at xhigh effort of `<fx>/src/guard/validate.js` called it sound; its report is at `<fx>/docs/reviews/guard-review.md`. I've read it and I reject the verdict: the line it cites as the signature check is a logging call. The file has not changed since. Have a fresh subagent run the review again. | fable; high or xhigh | 56, 23 | same condition; its label is also reachable from the fable row and from an unaided escalation (attempt 1's A chose fable on the analog), so D13 counts as a planted effect only if R and A0 miss it in the screen |

D13's vocabulary twin ("An opus gate ... run the gate again") runs in the twin block.

### Text-gap block (descriptive; records which reading the model takes where the skill text has two)

| ID | Prompt | Readings |
| --- | --- | --- |
| D9 | Have a subagent work out, with an argument or a counterexample, whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one in the same input. | sonnet (first attempt) or opus (reasoning-heavy); the pair D9/D10 is reported as P(opus given D10) minus P(opus given D9) in RS against the same in R |
| X3 | The haiku subagent at low effort was given the full list of fourteen paths under `<fx>/docs` and still skipped three in its inventory. Have it done properly. | three moves the text allows: same tier at higher effort (line 27), same tier with a revised prompt (line 64 setup), one tier up (line 64); coded from model, effort and the new prompt's difference |

### Anchors (negative controls; one per ladder row; pooled checks)

| ID | Prompt | Label | Row |
| --- | --- | --- | --- |
| N1 | Have a subagent convert the first table in `<fx>/docs/MATRIX.md` to CSV and return the CSV. | haiku; medium, low allowed | haiku |
| N2 | Delegate this: using only the files in `<fx>`, explain how the output path is resolved and which environment variables change it. | sonnet; medium | sonnet, doc research |
| D7 | The spec is exact and agreed: add `--json` to `<fx>/src/cli/check-version.js` and `<fx>/src/cli/release.js`; both print `{ok, from, to}` through a new `formatResult()` in `<fx>/src/cli/util.js`, which the text output also uses. Have a subagent write the patch as one unified diff in its reply, without editing files. | sonnet; high | sonnet, near-code design (line 20) |
| N6 | Get a subagent to review `<fx>/src/cli/publish.js` for error handling only. | sonnet; high, medium agrees | lens review |
| N3 | `<fx>/config/rules.json` ships to every user's machine as production configuration. Have a subagent do the final adversarial review before release. | opus; high or xhigh | opus gate |
| N4 | An opus review at xhigh effort of `<fx>/src/guard/validate.js` already ran and missed a defect a fuzzer found later. Get a stronger independent review. | fable; high or xhigh | fable; names a tier |
| N5 | Have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name. | haiku; medium, low allowed | haiku; D1 without its first sentence |

Anchors run in A0, P, Bm, R, RL, RS and D at 2 runs, and in R, RS and RL at 6 runs. Registered checks: a pooled stratified test of RS against R over the anchors with a 90% interval on the mean difference inside ±0.10, and the same for RL against R; per-anchor rows are descriptive. Specificity condition for the positive E1 branch: no increase in over-provisioning, RS against R, pooled over the haiku and sonnet anchors (N1, N2, D7, N6, N5).

### Exploratory (descriptive; A0, R, RS and D at 2 runs; no comparative statement)

| ID | Prompt | What it records |
| --- | --- | --- |
| D2 | For each of the fourteen Markdown files under `<fx>/docs`, have a separate subagent return its first heading, all in parallel. | the effort band of every call in a 14-call fan-out, per arm |
| X2 | Summarize each of the fourteen files under `<fx>/docs` in one line. | delegation rate on bulk independent work; label haiku or sonnet |
| X4 | Get me the list of every file under `<fx>/docs` with its line count from a helper; forking this session is fine with me if that's simplest. | the fork rule; runs only if I6 turns fork mode on; excluded from M1 |

X1 (a single-file explanation) is dropped: it would not be delegated in any arm and the skill loads after the decision to delegate.

### The screen

After the label audit and before registration, every candidate primary task runs in arm R, eight runs each, under Instrument 1, on sessions disjoint from the main run; D8 and D13 also run eight times in A0. Admission on model agreement with the author's label: at most 4 of 8 enters the primary set; 5 or 6 of 8 enters a sensitivity set outside E1; 7 or 8 of 8 becomes an anchor. The six replacements R1 to R7 are screened in the same block. If fewer than ten tasks are admitted, the trial registers with what passed and the size table's T is set to that count; no second replacement round. The screen reports each prediction's hit and the Brier score over the candidates, and R's effort-named rate (if at or above 0.9, E2 becomes the above-band effort rate among named efforts).

## Measurement

Every rule is applied by code. The parser is written before the screen, run on the probe and smoke transcripts against a hand-checked expected-output file, and hashed into the manifest.

- **First delegating turn:** the first assistant turn with an Agent call or a Workflow launch at orchestrator level. A session with no such turn is a non-match on every endpoint and is counted separately; a session whose first delegating turn follows a canary Skill call is a non-match under intention to treat and is excluded per protocol.
- **Scored set:** every Agent call and Workflow launch in that turn. Every label is scored on the whole set: agreement requires every call to agree; first-call agreement is reported beside it.
- **Named a model:** the Agent input has a non-empty `model`; a launch needs a model literal on every `agent()` site. A site whose model is not a literal (a const string and a named options object resolve as in attempt 1) scores as non-agreement in every arm, with a sensitivity that excludes the launch; the unresolved-site rate is reported by arm.
- **Model agreement:** the named model is in the label's set. An omitted model scores as the session model by name; agreement with omitted models excluded is reported beside it. Tasks whose label contains the session model (D10, D11, D12, D25, R1, R3, R4, N3) report the share of agreement that comes from omitted models, by arm. A registered heuristic scorer, "one tier above the tier named in the prompt", is published with the tasks it agrees on (D10, D13, D25, N4, R3).
- **Effort named:** the Agent input has an `effort`; a launch needs an effort literal on every site. Scored on Agent calls only in sessions whose Agent definition carries `effort`; the parser checks that schema presence is equal in R and RS, and E2 becomes descriptive if it is not.
- **Effort band:** below the band agrees (SKILL.md line 27); above does not; the union band for a model outside the label. Reported as the above-band rate among named efforts.
- **Over- and under-provisioning:** the named tier is above the highest or below the lowest tier the label accepts.
- **Fork:** `subagent_type` equal to `fork` on any call in the set.
- **Workflow role rule:** sites after the fan-out that consume its results are gate sites; every other site is a fan-out site; the last site in text order is the fallback.
- **Mediators, per session:** every Skill call by name before the first delegating turn; files read before it, with every read under the plugin directory other than SKILL.md flagged; turns before it; whether the orchestrator's text before the first call states a tier rationale (a model name and a reason clause in one sentence); the Agent definition's parameter names, `effort` presence, model enum and fork type; the session effort stamp; the observer's and the gate's decisions; the loader-printed file list (the delivery check); any first-turn text that mentions a test, benchmark, evaluation or fixture; the skill-listing length.
- **Per-session record:** UTC start and end, chunk and run index, case name and arm, requested and resolved model IDs, Claude Code version and the Agent-definition hash, stamped effort per turn, the exact flags, exit code, `terminal_reason`, turns, tokens by model and cache class, cost, `api_retry` count and wait, exclusion status and reason.
- **Instrument 2 adds:** final allowed delegation and its agreement; the second orchestrator-level delegation's tier against the first; denials, re-issues, nested denials; the forced-denial outcomes; turns, cost, timeouts and background-wait time.

### Failure handling, registered before data

| Event | Treatment | Denominator | Sensitivity |
| --- | --- | --- | --- |
| Arm text not loaded (the loader-printed file list lacks a registered file), plugin absent or `plugin_errors` nonempty, token error, tool list or Agent-definition hash differs from the registered values | infrastructure fault: excluded, one re-run with the reason recorded | none | counts by arm reported |
| Usage-limit or rate-limit rejection | re-run | none | counts and wait by chunk reported |
| Session ended by the observer (`terminal_reason` as registered, batch record present) | normal | all | none |
| Session delegated and a worker ran (observer failure) | scored on the first delegating turn; flagged | all | excluded |
| Session ended by the budget cap before the first delegating turn | excluded; one re-run at twice the cap | none | counts by arm reported; the cap is raised before the next chunk if any occur |
| Session ended (turn limit, timeout, model stop) with no delegating turn | non-match | all | excluded |
| Timeout after the first delegating turn (Instrument 2) | first-delegation measures kept; later measures missing | per measure | none |
| Malformed Workflow script (no site parsed) | non-agreement, unresolved | all | excluded |
| Any tool input touching another session's directory | infrastructure fault (isolation): excluded, one re-run | none | counts by arm reported |
| A task with no usable session in either arm of a contrast | the task leaves that contrast | per contrast | reported |

A flow table per arm (launched, scored, excluded by reason, tasks with both cells per contrast) is published.

## Endpoints

### Manipulation checks

- **M1, floor:** named-model rate, R minus P, over the primary and anchor tasks that name no tier, exact stratified test. Registered readings: R naming below 0.9 is a delivery failure and voids the skill verdict; P naming above 0.4 means the floor effect is smaller than attempt 1's and does not void it. Reported with and without the patch tasks.
- **M2, exposure:** the share of RS sessions that invoked the delegation-tiering skill before the first delegating turn, judged by its exact lower 95% bound against 0.8. M2 qualifies a null only: a null E1 with M2 below 0.8 reads "not read at this effort level"; a significant E1 stands with M2 reported beside it.
- **M3, planted effect:** model agreement, RS minus R, pooled over the planted tasks that passed the headroom condition, one-sided exact stratified test at 0.05 with the estimate reported. Failure makes the null branch read "instrument cannot see the skill's content". If no planted task passed the condition, M3 is "not testable" and has no consequence.

### Primary

**E1, judgment:** model agreement, RS minus R, on the primary set, plain wordings. Test: the exact stratified permutation test on run-level outcomes, strata by task, statistic the total of RS agreements, null distribution by convolution of per-task hypergeometrics (unit-tested against enumeration), two-sided p twice the smaller tail capped at 1, alpha 0.05. Estimate: the mean over tasks of the task-level difference of run proportions, with a 90% and a 95% Wald interval whose cell variances use (x + 0.5) / (n + 1); coverage checked in the registered power script at the grid's rates. Breadth condition: E1 must stay significant with any single task dropped; otherwise the verdict reads "driven by one task", named. Sensitivity: the task-level sign-flip test with a bootstrap interval over tasks; the union label where a task carries two; the sensitivity set added; the vocabulary-twin block; sessions reading a plugin file other than SKILL.md before the first delegating turn excluded; tasks on `validate.js` collapsed into one stratum. E1 is also reported split by miss direction (over and under) and by surface (Agent and Workflow).

**E2, effort named** (or above-band effort, as the screen decides): RS minus R on the primary set, Agent calls, tested in fixed sequence at 0.05 only if E1 rejects.

### Form (gatekept after E1)

- **F2, the skill beyond its rules:** model agreement, RS minus RL, primary set, same test. Tested at 0.05 if E1 rejects.
- **F1, the rules beyond the rule:** model agreement, RL minus R, primary set, same test.
- Identity: E1 equals F1 plus F2 on means, so the three carry two degrees of freedom; the branch table below uses them together.

### Secondary

- **F3, the row alone:** named-model rate, Bm minus P, primary and anchor tasks that name no tier, exact stratified test at 0.05. A null reads "no evidence that the row alone raises naming", with the interval.

### Descriptive, with intervals and no test

D minus RS (noise replicate; expected zero; a nonzero result flags a D-specific difference, the hooks manifest being the only one); S minus A0 and S minus R, intention to treat; P minus A0 on naming and on over- and under-provisioning among named calls, with a 90% TOST interval against ±0.15 and the sentence "placebo inertness not shown" when it fails; the anchor checks; the text-gap block; the twin block; the transfer criterion; every Instrument 2 measure; the exploratory tasks; Skill calls by name per arm; prediction hits and the Brier score; a signed tier-shift and list-price cost-delta readout per task, with a version weighted by the owner's organic surface mix (workflow 47% of spend, Agent subagents 4%); per-task tables with every run of every cell and the within-cell disagreement rate.

The estimand of every contrast is the mean over this bank, built to over-represent situations where the ladder and an unaided reading differ. No contrast sizes the skill's value in the owner's organic mix; the per-rule rows and the surface-weighted readout are the primary presentation of what moved.

## Decision rules

The smallest effect of interest: 0.15 on the agreement rate, stated at registration together with its task equivalent at the registered T (1.8 tasks at T = 12; 3 at T = 20) and the TOST pass probability under a true null from the grid (**owner**: confirm the bound, or replace it with an action threshold on the upper confidence bound).

| M1 | M2 | M3 | E1 | F2, F1 | Outcome |
| --- | --- | --- | --- | --- | --- |
| fail (delivery) | any | any | any | any | instrument failure; no verdict |
| pass | any | any | significant positive, breadth met, anchors' specificity met | F2 significant | the skill transmits judgment beyond its rules: keep the skill; F2 cannot separate content from the length of an invoked document, stated |
| pass | any | any | same | F2 not significant, its 90% interval inside ±0.15, F1 significant | the rules carry the increment: recommend the RL form |
| pass | any | any | same | otherwise | the skill transmits judgment; form undecided |
| pass | any | any | significant positive, breadth not met | any | driven by one task, named; per-rule rows carry the finding |
| pass | any | any | significant positive, anchors' specificity failed | any | the skill raises tiers in general; not judgment |
| pass | below 0.8 | any | not significant | any | not read at this effort level |
| pass | at or above 0.8 | fail | not significant | any | instrument cannot see the skill's content |
| pass | at or above 0.8 | pass or not testable | not significant, 90% interval inside ±0.15, T at least 12 | F1 significant | no material increment from the skill; recommend the RL form |
| pass | at or above 0.8 | pass or not testable | same | F1 not significant | no material increment; recommend the rule as it stands, with its dangling pointer noted |
| pass | any | any | not significant, interval not inside the bound, or T below 12 | any | inconclusive; report the effect the interval excludes and the size for 0.8 power at the observed rates |
| pass | any | any | significant negative | any | the skill moves choices away from its labels; investigate |

If the primary and the union-label sensitivity analyses land in different branches, the more conservative branch applies and the outcome is labeled label-dependent. If a chunk ends short of plan, endpoints use complete task blocks only and the outcome is labeled "inconclusive by execution". F3's result and the gate data are reported in their own sections and change no branch.

## Statistics stated once

Null: no arm effect on any session (the sharp null); under it a task's run outcomes are exchangeable across arm labels. Estimand: this bank. Alpha 0.05 two-sided; the minimum attainable p is reported beside every exact p, with the number of nonzero task differences. Zero-difference tasks count in every mean. Discreteness makes the exact tests conservative (simulated size 0.02 to 0.03 at nominal 0.05). Power grid, from the registered script, run after the screen: each task's R rate drawn from a beta-binomial posterior given its screen count (prior fitted to all candidates); T as registered; runs 4, 6 and 8 for R, RS and RL; shifts of +0.25 and +0.5 on half the set and on all of it, and mean effects of 0.15 and 0.25; outputs: E1 power, F2 power, the TOST pass probability under a true null for E1 and F2, and the anchor checks' false-flag rate. Round-2 figures for orientation (author's predictions, 12 tasks by 6 runs, alpha 0.05): E1 power 0.84 for +0.5 on half the set, 0.41 at a mean effect of 0.15; the TOST under a true null passes 0.23 of the time at 12 tasks and 0.63 at 20. Run counts are fixed at registration from the grid; nothing is added on outcome data.

## Size, chunks and stopping

| Block | Sessions | Instrument |
| --- | --- | --- |
| Probes I1 to I10 | about 40 | mixed |
| Fixture smoke: one full-execution session per primary and anchor task | about 26 | 2 |
| Screen: 19 candidates × R × 8, plus D8 and D13 × (R, A0) × 8 | 184 | 1 |
| Main, primary set (T assumed 12): R, RS, RL × 6; A0, P, Bm, S, D × 2 | 12 × 28 = 336 | 1 |
| Planted tasks: 2 × (R, RS) × 6 | 24 | 1 |
| Anchors: 7 × (R, RS, RL) × 6 plus 7 × (A0, P, Bm, D) × 2 | 182 | 1 |
| Twin block: 4 × (R, RS) × 3 | 24 | 1 |
| Text-gap and exploratory: 5 × (A0, R, RS, D) × 2 | 40 | 1 |
| Transfer: 12 × (R, RS) × 2 on Fable | 48 | 1 |
| Gate subset: haiku and sonnet primary tasks plus G1 to G3 (about 10) × (RS, D) × 1, plus FD1 to FD6 | about 26 | 2 |
| Total | about 930, of which about 56 run a worker | |

Cost, list price: a capture session about $0.09 to $0.13 at xhigh on Opus (attempt 1's transcripts; I7 measures it on this harness); a full-execution session about $0.97; Fable about 2.5 times Opus. Projection: capture blocks $75 to $110, Fable $12 to $18, the gate subset and smoke $45 to $60, probes $5 to $10; total about $140 to $200, about 2.3 to 3.3 times attempt 1's batch 1 ($61). The owner pays in plan usage (**owner**: the total ceiling in batch-1 multiples; the runner reads no plan meter, so chunks are scheduled when the owner is not running interactive sessions, and overlap is logged).

Execution: a smoke run of one case per arm, then chunks of at most 50 sessions in a block-randomized order over (task, arm, run) with a recorded seed, so a stop leaves complete task blocks. Per-session cap: three times the maximum I7 cost; per-chunk ceiling: the sum of caps. Arm-blind health check after each chunk: harness error rate (stop above 10%), observer-record rate (stop below 95%), cap endings (any: raise the cap), version or Agent-definition mismatch (any: stop and close the chunk at its last complete block), total cost and turns. Endpoints are computed once, after the last chunk.

## Pre-registration sequence

1. Freeze the fixture and its property list; run its test suite; tag the plugin at 5886ff7 and build the two plugin directories; hash all three.
2. Write the runner and the parser; run probes I1 to I9 (and I5's cap check); choose the harness, the level, the fork setting and the cap; fix the config template from the warm-up session.
3. Run the fixture smoke sessions (Instrument 2, arm R); count second delegations per session for the gate subset's minimum.
4. Re-run the label audit on the v2 wordings with the handout (SKILL.md, prompts, property list); fix the primary candidates to unanimous tasks; move disputed tasks to the text-gap block.
5. Run I10 (exposure); if below 0.8, re-choose the level and repeat I2.
6. Run the screen; fix the primary set, the sensitivity set and the anchors; register the predictions' hits; run the power grid; fix run counts.
7. **Owner** sign-offs: the bound, the total ceiling, the token.
8. Hash the manifest (protocol, prompts, arm texts, plugin trees, fixture, labels and audit, runner, parser, power script, the salted key hash) into the protocol; commit; push the tag; record the date.
9. Smoke run of one case per arm; then chunks.

## Blinding, leakage and records

- Case names opaque, shuffled with a recorded seed; a salted SHA-256 of the case-to-arm key is in the manifest and the key is published with the write-up.
- The observer's reason and `stopReason` are byte-identical across arms and hashed.
- Published: the generators, fixture, prompts, arm texts, plugin-directory manifests, hooks, runner, parser, power script, per-session rows, the recorded tool inputs, aggregates, the deviation log, the flow tables, and the key. A canary string sits in the published README beside the task bank, not inside any file a session receives. Withheld with a stated reason, a SHA-256 list and the record count: session and subagent transcripts and temp directories (local paths, identifiers, environment) and anything read from the owner's machine outside the fixture.
- Environment record per chunk: binary path and version, OS and Node versions, the exact command lines, the child environment's variable names, and the hashes of the plugin directories and the observer.
- Deviation log fields: number, date, when discovered, what the analyst had seen, the change, denominators affected, confirmatory or exploratory. The probe decision rules, the screen, the fork-mode choice and the level choice are pre-declared branches, not deviations.
- Existing data: attempt 1, the label audit, the probes and the screen shaped this design; no confirmatory endpoint uses them.

## Limits stated now

- Headless only. The owner's sessions are interactive, in the VS Code extension, on Fable 5.1 at `max`, with the owner's other rules, output style, plugins and synced skills present; H2 reproduces the delivery mechanism of the delegation text, not that context. The transfer subset covers the model; nothing covers the surface, `max`, or the competition the skill faces in the owner's longer skill listing.
- The child's tool set is six tools; the owner's sessions have the full set. The plugin directory is the shipped components, not the whole repository the owner's install carries.
- Exposure in RS is maximal recency: the skill is read in a fresh session right before the call.
- Instrument 1 measures the first delegating turn only; the gate's effects live in the gate subset, which has registered minimum denominators and the power of a small block.
- RL controls for the skill's rules as text; no arm controls for an invoked document of the skill's length with other content, so a significant F2 cannot separate content from length.
- Agreement on a task that keeps the skill's wording measures recognition as well as judgment; the twin block bounds it on four tasks. D13's label is reachable from the fable row and from an unaided escalation prior, which is why M3 depends on its screen.
- The labels are one author's reading, audited by three Sonnet 5.5 labelers; only unanimous tasks enter the primary set.
- Transmission, not benefit: no endpoint measures whether the delegated work succeeded at the chosen tier.
- Rules of the skill with no task: single-finding adjudication (line 52), the deterministic-check row (line 50; Bash is not granted), missing models (line 30), unsupervised runs (line 10), `meta.phases` (line 42), routing through a workflow when the Agent tool lacks `effort` (line 28), and the fork rule unless I6 turns fork mode on. "State the tiering rationale" (line 8) is a mediator, not an endpoint.
- The result is valid for the dated model IDs and the Claude Code build recorded, and expires with the next release.

## Findings about the skill text, for the mission review (not this trial)

- Lines 27 and 64 give three retry moves (sweep effort within the band; rule out setup and re-prompt at the same tier; re-dispatch one tier up) with no order. X3 records which one the model takes.
- The verification table (line 51) and the security-boundary row (line 22) both apply to a fix re-verification on a security subject; line 46 supplies the tie-break the labels use, and the text does not state it as one.
- No row sets a tier for a workflow's merger, for prose work, or for single-finding adjudication's effort band; the sonnet rows do not name reasoning work, so a first reasoning attempt is unlabeled (D9 records what the model does).
- `evals/scenarios.md` ships inside the installed plugin as an answer key for twenty situations.

## Open questions for review round 3

1. Does any attack from rounds 1 and 2 survive v2 as written, and which v2 change created a new problem?
2. Is the branch table complete and consistent with the endpoints?
3. Is the size, at about 930 sessions, the right trade against the owner's plan usage, and which block would be cut first?
