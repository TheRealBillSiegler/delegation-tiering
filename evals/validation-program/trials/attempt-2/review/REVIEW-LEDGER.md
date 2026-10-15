# Review ledger, attempt-2 protocol

Each round: who reviewed, what they ruled, what I re-derived, what changed. A critic's ruling is recorded as given; my ruling follows it. "Re-derived" means I checked the claim against the file, page or transcript named, not against the critic's summary.

## Round 1 (2026-10-11), on PROTOCOL-v0

Reviewers: five research pillars (sonnet, high effort): controls, statistics, item construction, harness validity, reporting. Four adversarial critics (opus, xhigh): confounds and leakage (CL1 to CL12), statistics (S1 to S15), the task bank (A01 to A15, W01 to W12), feasibility (A1 to A16). Rulings given: 11 KILLS, 32 BOUNDS, 3 FAILS. Raw reports: `round1/*.md`.

### Confounds and leakage

| Attack | Critic | Mine | Re-derived | Change in v1 |
| --- | --- | --- | --- | --- |
| CL1 placebo files are path-scoped, never load at session start | KILLS | adopted | `markdown.md` and `docstrings.md` both open with `paths:` frontmatter; `coding-principles.md` has none (read all three) | P is coding-principles.md plus its CLAUDE.md row; frugality cue reported on over- and under-provisioning |
| CL2 R− removes the skill pointer, the gate claim and timing text at once; naming at ceiling in both arms | KILLS | adopted | `grep -ci gate ~/.claude/rules/delegation.md` is 0; the gate claim sits only on CLAUDE.md line 16 | R− dropped; Bc (the claim alone, no naming instruction) against A0, where naming has headroom |
| CL3 the observer's or the gate's denial text reaches the model before the first choice | FAILS | agreed | hooks-0.1.2.json declares PreToolUse and an async PostToolUse only (printed) | none; consistency check registered: Instrument 2's first delegations should match Instrument 1's |
| CL4 "first matching call" is a race under parallel calls | BOUNDS | adopted | attempt 1's T03 issued 13 calls in one assistant message (critic's parse; consistent with the transcript structure I read) | the scored set is every call in the first delegating turn; the observer records every call; transcript order is primary |
| CL5 D under Instrument 1 equals RS; D minus R double-counts; Instrument 2's R has a different harness footprint | BOUNDS | adopted | same manifest fact as CL3 | D kept as an A/A replicate with an expected null; D minus R removed; Instrument 2 runs RS and D only |
| CL6 the Skill tool prints the plugin's base directory; variants named by role would leak | BOUNDS | adopted | attempt-1 transcript c01/with-0 contains "Base directory for this skill:" and the canary description (grep) | one neutral directory name for every plugin arm; canary calls flagged; S and RS stated to carry gate belief |
| CL7 the case path names the plugin and the trial in every arm | BOUNDS | adopted | cases-full/g1/c01/prompt.md embeds `delegation-tiering-validation/evals/validation-program/trials` (read) | short neutral root; banned strings asserted over prompt-visible paths |
| CL8 the fixture mirrors the plugin's layout and the banned list misses the cue words | BOUNDS | adopted | `git ls-tree 5886ff7` has hooks/hooks.json, docs/COVERAGE.md, docs/ROADMAP.md (listed earlier) | fixture renamed (src/guard, config/rules.json, MATRIX.md, GUARD.md); banned list extended; gate tasks spread over three files |
| CL9 prompts reuse the skill's coined terms; labels leave author choices; the divergent-set count is wrong | BOUNDS | adopted | attempt-1 PROTOCOL.md T16 accepted opus; v0's T13 did not (both read) | label audit by three fresh labelers; dual labels; wording twins on five tasks; counts fixed |
| CL10 skill invocation falls at medium effort; a null could mean "unread"; omitted model scores wrong on Fable | BOUNDS | adopted | PILOT-RESULTS: D invoked the skill 3 of 10 at medium; FULL-RESULTS: 14 of 14 at xhigh (read) | manipulation check M2 at 0.8; omitted model scores as the session model by name |
| CL11 routes differ across arms if I1 passes partly; the loader's wrapper amplifies compliance | BOUNDS | adopted | the wrapper header is in this session's own context | one route for every arm; the route is the loader under H2 or append under H1, never mixed |
| CL12 bundled skills are a second doctrine source | BOUNDS | adopted | workflow-authoring's advice to omit `model` is in the bundled reference in this session | every Skill call by name is a mediator; D14 and D15 reported with it |

### Statistics

| Attack | Critic | Mine | Re-derived | Change in v1 |
| --- | --- | --- | --- | --- |
| S1 sign-flip significance needs at least 7 unanimous movers; attempt-1-sized effects cannot reach it | KILLS | adopted | the floor 2 over 2^n holds when every nonzero difference has one sign; n=6 gives 0.03125 | the screen admits only tasks with R agreement at or below 0.5; stratified run-level test primary |
| S2 the power assumption fails 0.8 at 16 tasks by 2 runs; the pilot has no within-task variance | KILLS | adopted | PILOT-RESULTS: every cell lists one tier with count 2 (read) | runs raised to 6 per cell for R and RS; registered power grid; variance from the screen and the D/RS A/A pairs |
| S3 the stratified exact test uses run-level information and has higher power | BOUNDS | adopted | the critic's simulation; the exchangeability condition is the sharp null | primary test is the stratified exact permutation test; sign-flip is the sensitivity analysis |
| S4 predictions tested in A0 and P are fixed by the omitted-model rule; selection on R's own runs biases upward | BOUNDS | adopted | FULL-RESULTS: A omitted the model in 12 of 15 (read) | predictions are P(R agrees); tested in a screen on disjoint sessions |
| S5 the ±0.15 bound is undefined and nearly unreachable | KILLS | adopted in part | neither protocol derives it (both read) | bound restated as three task-equivalents with a 90% TOST interval; the owner confirms it before registration; preconditions added |
| S6 the specificity rule misreads an imprecise placebo check | KILLS | adopted | v0 line 167 (my own text) | specificity rests on M1 alone; P minus A0 is descriptive with TOST and the sentence "placebo inertness not shown" |
| S7 a three-test Holm family wastes alpha | FAILS | agreed; gain taken | Holm thresholds 0.0167, 0.025, 0.05 | fixed sequence: E1 then E2; the floor is a manipulation check outside the family |
| S8 endpoint 3 re-measures endpoint 2 and has two designed movers | BOUNDS | adopted | v0 line 132 miscounts T01 (my own text) | effort demoted: E2 is effort named, in fixed sequence; above-band effort descriptive |
| S9 the secondary family is eleven contrasts, some unnamed | BOUNDS | adopted | FULL-RESULTS deviation 10 (read) | four named secondary contrasts; the rest descriptive |
| S10 R minus R− cannot show belief | KILLS | adopted | as CL2 | Bc arm |
| S11 batch rules: incomplete batch 2, arm-blind health checks, blinded re-estimation | BOUNDS | adopted | v0 line 173 (my own text) | "inconclusive by execution"; arm-blind health script; blinded re-estimation from the A/A pairs |
| S12 Instrument 2 cannot measure denials; the live mechanism is the reminder | KILLS | adopted | FULL-RESULTS and PILOT-RESULTS: 0 orchestrator-level denials in 103 sessions (read) | Instrument 2 measures the reminder-change rate and a forced-denial recovery probe; denial rates come from the organic audit |
| S13 the transfer subset has no criterion for "holds" | BOUNDS | adopted | v0 line 93 (my own text) | registered descriptive criterion; divergent set only; arms R and RS |
| S14 D is an A/A replicate; pooling or reallocating raises power | BOUNDS | adopted | as CL3 | D kept at 2 runs as the A/A noise estimate; not pooled, to keep the leak check |
| S15 the mean over a built bank is not the organic value | BOUNDS | adopted | README: workflow workers 47% of spend, Agent subagents 4% (read) | estimand stated; per-rule rows the primary presentation |

### Task bank

| Attack | Critic | Mine | Re-derived | Change in v1 |
| --- | --- | --- | --- | --- |
| A01 T02 weak divergence; fixture must promise a comment line | BOUNDS | adopted | PILOT: B chose haiku 2 of 2 on extraction (read) | D1 reworded with the rollback sentence; N5 is its plain twin; fixture property added |
| A02 T03 effort label has two readings; the prediction is backwards | BOUNDS | adopted | PILOT: B haiku at low ×4, C at medium ×3 (read) | D2 label "low or medium, low preferred"; sign registered undetermined; secondary |
| A03 T04 "cheap subagent" is a user instruction | BOUNDS | adopted | SKILL line 27 (read) | "cheap" removed; fixture paraphrase property added |
| A04 T08 two rows apply; no evidence named | BOUNDS | adopted | SKILL lines 22 and 51 (read) | evidence named per fix; dual label; tie-break registered; finding recorded for the skill text |
| A05 T09 fixes unnamed, so the skill's own answer is a gate | KILLS | adopted | v0 T09 names no fix (my own text) | D5 names both fixes, "round one / round two" wording; twin keeps "re-gate" |
| A06 T11 at ceiling on model; effort contested | BOUNDS | adopted | FULL-RESULTS T11: C sonnet, B no cell (read) | D7 is the multi-file version; medium accepted in sensitivity |
| A07 T12 "each" unscored under a first-call observer | BOUNDS | adopted | as CL4 | every-call scoring; reworded without "lens"; twin keeps it |
| A08 T13 no row gives sonnet high to reasoning | BOUNDS | adopted | SKILL lines 20, 21, 64 (read) | D9 label "sonnet; medium or high; opus in sensitivity"; D10 added as the positive case; finding recorded |
| A09 T16 adjudication reading | FAILS | agreed | SKILL line 52 sets no fixed tier | none |
| A10 T19 two readings; user rejects, not orchestrator; no report in the fixture | BOUNDS | adopted | SKILL lines 23, 27, 56 (read) | D13 names the gate's effort, the report file and the wrong citation; "fresh subagent" |
| A11 T20 the verifier reads as adjudication | BOUNDS | adopted | FULL-RESULTS T19: B and D both sonnet verifier (read) | D14's last call also reviews what the finders missed |
| A12 T21 no gate cue, so at ceiling | BOUNDS | adopted | PILOT: B lens review at sonnet (read) | D15 has "adversarial reviewers, each trying to break"; merger naming only |
| A13 T22 no row for release notes | KILLS | adopted | SKILL ladder rows name no prose work (read) | replaced by D16, the setup-failure retry task |
| A14 T23 obedience, the fork exception in the prompt, no fork under -p | KILLS | adopted | SKILL line 29; sub-agents.md: fork mode off under -p unless turned on (fetched) | X4 exploratory, reworded; runs only if I6 turns fork mode on |
| A15 T24, T25 measure priming, not the scope rule | BOUNDS | adopted | SKILL line 3 (description) and line 10 (read) | X1, X2 exploratory with that statement; X2 label haiku or sonnet |
| W01 the prediction column must be about R | BOUNDS | adopted | as S4 | done |
| W02 the divergent-set arithmetic is wrong | BOUNDS | adopted | v0 line 132 | counts rebuilt |
| W03 several "divergent" tasks are at ceiling in R; screen before registration | KILLS | adopted | FULL-RESULTS: B agreed 11 of 13 (read) | the screen |
| W04 rules with no task; the opus reasoning row's positive case; the two retry rules conflict | BOUNDS | adopted | SKILL lines 27 and 64 (read) | D10, D25 added; X3 records the conflict; finding recorded |
| W05 wording leaks | BOUNDS | adopted | SKILL line 56 and v0 T09, T19 (read) | twins and rewording |
| W06 eight tasks on one file | BOUNDS | adopted | v0 task table | spread over validate.js, ratelimit.js, lint.js, publish.js; sensitivity collapsing one file's tasks is a round-2 question |
| W07 below-band scoring unstated | BOUNDS | adopted | SKILL line 27: "Below-band is fine for easy instances" | below band agrees; above does not; union band for a model outside the label |
| W08 workflow parsing gaps | BOUNDS | adopted | FULL-RESULTS line 43 (read) | unresolved sites reported; verifier is the consuming site with a text-order fallback |
| W09 anchors waste sessions | FAILS | agreed | FULL-RESULTS T17, T18 rows (read) | anchors kept as negative controls, one per row, with a registered ±0.10 expectation |
| W10 labels need independent readers | BOUNDS | adopted | SKILL lines 19 and 53 both fit T07 (read) | the label audit; dual labels |
| W11 fixture promises nothing the prompts need | BOUNDS | adopted | v0 Fixture section (my own text) | the property list and smoke sessions |
| W12 placebo sentence false | BOUNDS | adopted | as CL1 | P replaced |

### Feasibility

| Attack | Critic | Mine | Re-derived | Change in v1 |
| --- | --- | --- | --- | --- |
| A1 a deny does not end the session; `continue: false` does | BOUNDS | adopted | hooks.md: "If `false`, Claude stops processing entirely after the hook runs. Takes precedence over any event-specific decision fields" (fetched) | observer returns `continue: false` with a `stopReason`, deny as backstop, `onFailure: "block"` (2.1.295+, fetched) |
| A2 `plugins:` defaults to the nearest enclosing plugin, which is the 0.1.3 worktree | BOUNDS | adopted | plugin-evals.md field table (fetched); the worktree's plugin.json reads 0.1.3 (read) | H1 fallback requires an explicit list in every case and a component-free target plugin; H2 avoids the field |
| A3 nowhere for the hook to write | FAILS | agreed | the batch-1 run directory holds the ledger (listed) | record file path by environment variable; transcript primary |
| A4 D under capture equals RS; the gate writes nothing on a denied call | BOUNDS | adopted | as CL3; the ledger is PostToolUse | gate verdict recomputed offline on recorded inputs |
| A5 I1 and I2 write to the wrong directory; the loader route is closed in plugin eval | KILLS | adopted, with a different remedy | plugin-evals.md: "a scaffold_script can supply only files and git state" (fetched); batch-1 config sits at <run>/config (listed) | H2: `claude -p` with `CLAUDE_CONFIG_DIR` and `CLAUDE_CODE_OAUTH_TOKEN` (env-vars.md entry and `claude setup-token` on 2.1.296, both checked); H1 is the fallback with append |
| A6 the settings effort route is closed; the variable confounds level and parameter | BOUNDS | adopted | model-config.md: a top-level `effortLevel` does not count for Opus 5.5; the variable outranks `--effort` (fetched) | H2 uses `--effort`; I2 probes the parameter at each level; I3 is a mechanism note |
| A7 200 case directories against the command-line limit | BOUNDS | adopted for H1 | FULL-RESULTS deviation 2 (read) | H2 has no sibling deny list; H1 fallback is grouped under a short root |
| A8 path leak | BOUNDS | adopted | as CL7 | done |
| A9 fork mode off under -p; turning it on changes the tool | BOUNDS | adopted | sub-agents.md and env-vars.md entries (fetched) | I6 probes the schema delta; fork on for Instrument 1 only if the delta is the two documented fields |
| A10 a denied Workflow launch still yields the script | FAILS | agreed | attempt 1's Workflow graders matched literals in the tool input | residuals stated |
| A11 Fable's default effort is high; omitted model scores wrong; price 2.5× | BOUNDS | adopted | model-config.md: `high` on every model except the listed ones (fetched) | explicit level for both models; omitted scores by session model; subset restricted to the primary set |
| A12 the fixture is hand-authored with planted properties | BOUNDS | adopted | v0 Fixture section | a frozen deliverable with a property list and smoke sessions |
| A13 the analyzer needs eight extensions | BOUNDS | adopted | analyze-full.js collect walks three paths only (read) | parser written and hashed before registration |
| A14 total about 560 sessions; chunking; usage limits | BOUNDS | adopted | plugin-evals.md on usage-limit errors (fetched) | size table in batch-1 multiples; chunks with caps; usage-limit cells re-run |
| A15 placebo not same route | BOUNDS | adopted | as CL1 | done |
| A16 no within-task variance exists | BOUNDS | adopted | as S2 | D/RS pairs and the screen supply it |

### Research recommendations marked "must"

Adopted: fix the placebo; record every call in the first turn; intention-to-treat primary with per-protocol sensitivity; state the test, null, alpha, enumeration, zero handling and minimum p; derive the bound and add equivalence power; batch rules; closed exclusion list; move prediction testing to R; add the screen; reverse the failed-prediction rule; the label audit; the planted-effect positive control and the invocation floor; provenance manifest; per-session record schema; failure-handling table; publish rows and captured inputs; withholding policy; environment record; `continue: false` with fail-closed; redesign I2 (now `--effort` under H2).

Not adopted, with reason: the 2×2 on the two removable clauses (CL2's remedy and the controls pillar's), because Bc answers the belief question with headroom at one arm; the active control P2 (a rule demanding a named parameter on Read with an enforcement claim), because F3 covers the enforcement claim and the naming effect is a manipulation check; RS-shuf and RS-stub, because RL answers the decision-relevant form question and a shuffled ladder adds an arm whose result changes no decision; the route-by-content block, because H2 makes every arm use the owner's route.

### Re-derivations that changed a critic's claim

- The feasibility critic quoted a precedence rule for conflicting PreToolUse decisions ("deny > defer > ask > allow"). The first 100,000 characters of hooks.md, which I fetched, do not contain it; the observer's `continue: false` is documented to outrank event decisions, so the design does not depend on the rule.
- The controls pillar's quotes from papers are abstract fragments relayed by the fetch tool; I kept their questions and dropped their numbers.
- FACTS.md said the scaffold's user-level files were "documented neither way"; the feasibility critic is right that the "only files and git state" sentence settles it. FACTS.md is corrected in the next revision.

## Round 2 (2026-10-12), on PROTOCOL-v1

Reviewers: three independent labelers (Sonnet 5.5, high effort; handout: SKILL-0.1.2.md and the prompts with the fixture description, no labels); four adversarial critics (Opus 5.5, xhigh): harness H2 (H2-01 to H2-16), statistics (S2-01 to S2-19), confounds (CL2-01 to CL2-16), task bank (B01 to B26); a completeness check (Opus, high); a pre-mortem (Opus, xhigh). Rulings given by the critics: 15 KILLS, 44 BOUNDS, 10 FAILS. Raw reports: `round2/*.md`. Correction to round 1's count: the four round-1 reports contain 13 KILLS, 51 BOUNDS and 6 FAILS, not 11, 32 and 3.

### Label audit result

All 24 labeled tasks (D1 to D25 as numbered, N1 to N6) had the author's model set chosen by at least two of three labelers, and by all three on 21. Minority second readings: D9 (one labeler: sonnet or opus), D23's v1 wording (one: haiku or sonnet), D15's merger (haiku or sonnet; the merger is scored for naming only). The labelers' notes name D9, N2, X2 and D15's merger as the prompts the skill decides least. The audit is re-run on the v2 wordings before registration. The scorer's automatic author-column parse failed on the table syntax; the comparison above was made by reading the three label files against the v1 table.

### Re-derived from primary pages this round

`--tools` restricts the built-in tool set and `--allowedTools` only pre-approves (`claude --help`, 2.1.296); `PostToolBatch` fires once per batch and `continue: false` there stops the loop before the next model call (hooks.md, second portion); PreToolUse decision precedence `deny > defer > ask > allow` and the `defer` single-call restriction (same portion); `permissions.blockReadsOutsideWorkingDirectories`, `enableWorkflows` and per-model `modelSettings.effortLevel` (settings-reference.md index); `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB`, `CLAUDE_CODE_TMPDIR`, `DISABLE_AUTOUPDATER` and the first-session passage (env-vars.md, second portion); `~/.claude.json` is listed as global and the relocation sentence names `~/.claude` paths only (claude-directory.md). `CLAUDE_CODE_PROJECT_DIR_NAME` was quoted by the first env-vars fetch. Not re-derived by me: the authentication page's token wording, the `rate_limit_event` shape, the workflows page's Pro-plan default, and the `terminal_reason` values; v2 uses them as the critic quoted them, and probes I1 and I5 and the runner verify them in practice.

### Harness H2

| Attack | Critic | Mine | Change in v2 |
| --- | --- | --- | --- |
| H2-01 a PreToolUse stop can truncate a streaming fan-out; appends race | BOUNDS | adopted | PreToolUse records and denies per call with exclusive files; PostToolBatch carries the stop; I5 adds a 14-call fan-out; fallback registered |
| H2-02 `--allowedTools` does not restrict tools; read-only Bash and unscoped Read reach the owner's files | KILLS | adopted | `--tools` six names; `--allowedTools "Skill Workflow"`; `blockReadsOutsideWorkingDirectories`; POSIX deny rules; I1 checks; tool set listed in Limits |
| H2-03 every fresh config dir is a first session; `.claude.json` may be the owner's | BOUNDS | adopted | warm-up session's flag cache copied into every config dir; owner's `~/.claude.json` hash checked; per-session tool list and schema hash recorded; mismatch is an exclusion |
| H2-04 the loader prints the config path; the projects slug derives from the cwd | BOUNDS | adopted | opaque config paths; `CLAUDE_CODE_PROJECT_DIR_NAME` constant; `CLAUDE_CODE_TMPDIR`; banned strings over every visible path |
| H2-05 the plugin tree ships `evals/scenarios.md`, an answer key | BOUNDS | adopted | plugin directories built from shipped components only; departure from the installed copy stated; plugin reads a mediator |
| H2-06 token revocation undocumented; plan usage unreadable from the child | BOUNDS | adopted | storage, passing and logging rules; scrub on; the residual stated; chunks scheduled around the owner's sessions |
| H2-07 no concurrency stated; usage limits do not pause in -p | BOUNDS | adopted | concurrency 4; rate-limit events parsed; launch stops on rejection |
| H2-08 hook-stop exit code undocumented; Windows kill | BOUNDS | adopted | `terminal_reason` keys the observer stop; `taskkill /T /F`; usage from the JSONL |
| H2-09 a denylist leaks the launching shell's variables | BOUNDS | adopted | child environment from an allowlist |
| H2-10 H2 reproduces the mechanism, not the owner's context | BOUNDS | adopted | reworded; skill-listing length recorded; Limits extended |
| H2-11 Workflow may be flag-gated or off on Pro | BOUNDS | adopted | `enableWorkflows: true`; Workflow in `--tools` and `--allowedTools`; I1 asserts it |
| H2-12 to H2-16 loader under -p, settings hooks and deny rules, `--plugin-dir` hooks, transcript persistence, `stopReason` | FAILS | agreed | per-session `system/init` plugin check added; POSIX path rule added |

### Statistics

| Attack | Critic | Mine | Change in v2 |
| --- | --- | --- | --- |
| S2-01 the four-run screen admits any miss; "flagged" has no consequence | KILLS | adopted | eight screen runs; at most 4 of 8 admits; 5 or 6 is a sensitivity set outside E1; 7 or 8 an anchor |
| S2-02 regression to the mean lowers power, is not "conservative"; audit before screen | BOUNDS | adopted | sentence replaced; the audit precedes the screen; the screen scores the author's label |
| S2-03 the grid overstates power; the sizing effect is 1.7 times the bound; orientation figures mislabeled | BOUNDS | adopted | beta-binomial posterior rates; power at mean effects 0.15 and 0.25; figures restated with their conditions |
| S2-04 the planted task can carry E1 alone | KILLS | adopted | D13 and D8 excluded from E1 with their own runs; breadth condition (leave one task out) |
| S2-05 twin wordings within a cell break exchangeability | BOUNDS | adopted by removal | E1 scores plain wordings only; twins run as a separate R and RS block |
| S2-06 the interval by test inversion is undefined for a binary outcome | KILLS | adopted | Wald interval on the mean of task differences with (x + 0.5) / (n + 1) cell variances; coverage checked in the grid; the two-sided rule stated |
| S2-07 RL at 2 runs cannot return the shrink verdict; no branch for an undecided F2 | KILLS | adopted | RL at 6 runs; a "form undecided" row |
| S2-08 E1, F1 and F2 carry two degrees of freedom; Holm misplaces them | BOUNDS | adopted | gatekeeping after E1; F3 tested alone |
| S2-09 F4 conditions on naming, a post-treatment variable | KILLS | adopted | F4 dropped; S minus A0 and S minus R descriptive, intention to treat |
| S2-10 E2 is likely at ceiling; conditioning on schema presence is harmless | BOUNDS | adopted | the screen reports R's effort-named rate; E2 becomes the above-band rate at or above 0.9; schema equality check |
| S2-11 the bound's unit depends on T; TOST pass rates | BOUNDS | adopted | bound stated with its task equivalent at the registered T and the pass probability; the null branch needs T at least 12 |
| S2-12 M2 overrides a significant result and is a coin flip at its threshold | KILLS | adopted | M2 qualifies a null only; exact lower bound; exposure probe I10 |
| S2-13 M3 on one task is noise-prone | BOUNDS | adopted | two planted tasks at 6 + 6, pooled one-sided exact test, conditional on screen headroom |
| S2-14 M1 could fail at the border | FAILS | agreed; split reading taken | R below 0.9 voids; P above 0.4 does not |
| S2-15 the per-anchor band fails from noise | KILLS | adopted | pooled anchor tests with 90% intervals; anchors at 6 runs in R, RS and RL |
| S2-16 the re-estimation is not blind and has no parameter | KILLS | adopted | re-estimation dropped; run counts fixed at registration |
| S2-17 the transfer criterion has no null reference | BOUNDS | adopted | Opus set at RS minus R of at least +0.5; two reference expectations |
| S2-18 X3 has three readings, not two | BOUNDS | adopted | three outcome classes coded from model, effort and the new prompt |
| S2-19 D2 dilutes E1 | BOUNDS | adopted | D2 exploratory, every-call effort band |

### Confounds

| Attack | Critic | Mine | Change in v2 |
| --- | --- | --- | --- |
| CL2-01 RL omits the lines that govern eight candidates | KILLS | adopted | RL carries lines 27, 56, 60 and 64 with the two tables (about 620 words); F2 reads as "the rest of the skill" |
| CL2-02 D13 is not arbitrary to the model's priors; no screen contingency | KILLS | adopted | D8 added as a planted task; both conditional on R and A0 screen rates at most 2 of 8 |
| CL2-03 F4 undefined on most tasks | KILLS | adopted | as S2-09 |
| CL2-04 the plugin directory is the repository | BOUNDS | adopted | as H2-05; per-protocol sensitivity excluding plugin-file readers |
| CL2-05 no isolation between concurrent sessions | BOUNDS | adopted | reads outside the cwd refused; sibling deny; isolation exclusion row; I1 check |
| CL2-06 Bc paraphrases the skill, not CLAUDE.md | BOUNDS | adopted | Bm is CLAUDE.md lines 7, 8 and 16 verbatim; question 3 reworded |
| CL2-07 A0 and S lack the wrapper; the config path is visible | BOUNDS | adopted | F3's baseline is P; banned strings over the config path; "owner's configuration" reworded |
| CL2-08 P is active on patch tasks; its frugality readout is blind | BOUNDS | adopted | M1 with and without patch tasks; over- and under-provisioning among named calls |
| CL2-09 tier-naming prompts inflate naming and admit a heuristic | BOUNDS | adopted | excluded from M1 and F3 denominators; echo direction recorded; heuristic scorer published; omitted-model share reported |
| CL2-10 twins put skill terms into E1; D13 has no plain wording | BOUNDS | adopted | as S2-05; D13's listed wording is plain ("review") |
| CL2-11 the planted review cues every validate.js task | BOUNDS | adopted | overlay for D13 only; D5 and D8 moved to ratelimit.js |
| CL2-12 unresolved sites and canary turns unscored | BOUNDS | adopted | scoring rules added |
| CL2-13 D's leak check sees only the manifest difference | BOUNDS | adopted | D renamed a noise replicate; I4 asserts identical init context |
| CL2-14 the re-estimation reads treatment outcomes | BOUNDS | adopted | dropped |
| CL2-15 the stopReason | FAILS | agreed | byte-identical across arms, hashed |
| CL2-16 the construct: surface mix, recency, asymmetric costs, labeler model | BOUNDS | adopted | tier-shift and cost-delta readout weighted by surface; recency in Limits; labelers named (Sonnet 5.5) |

### Task bank

| Attack | Critic | Mine | Change in v2 |
| --- | --- | --- | --- |
| B01 D2 has no endpoint | KILLS | adopted | exploratory |
| B02 D9's sonnet label rests on a recurring-task sentence | KILLS | adopted | D9 to the text-gap block with both readings; the D9/D10 pair contrast descriptive |
| B03 D23's "touches" is a judgment | KILLS | adopted | lexical selection ("contains the text `signature`") with a property |
| B04 D10 differs from D9 in five ways | BOUNDS | adopted | D10 is D9 plus history; prediction 0.7 |
| B05 D16/D25 differ in five ways; D16 hands over the diagnosis | BOUNDS | adopted | minimal pair on check-version.js, spec silent or stated; difference-in-differences descriptive |
| B06 predictions too low where B agreed; D5's lure lost | BOUNDS | adopted in part | predictions raised; D3 trimmed; D5 kept plain (no model name added) |
| B07 the screen cannot yield ten survivors; replacements | BOUNDS | adopted | eight runs; six pre-written replacements (R1, R3 to R7) screened in the same block; one round |
| B08 the twins are inverted; D13 not plain | BOUNDS | adopted | listed wording plain; twins as a sensitivity block |
| B09 D13 must not become an anchor; M3 conditional | BOUNDS | adopted | as S2-13 |
| B10 model-naming prompts | BOUNDS | adopted | as CL2-09 |
| B11 validate.js concentration; ratelimit.js unused | BOUNDS | adopted | D5, D8, R1, R4 on ratelimit.js; the collapse sensitivity registered |
| B12 D8 on a validator is a security read | BOUNDS | adopted | moved to ratelimit.js |
| B13 D4 cites line 46 | BOUNDS | adopted | cited; prediction 0.7; parseHeader behavior stated |
| B14 D7 is an anchor | BOUNDS | adopted | the line-20 anchor |
| B15 "quick" and "nothing formal" are rigor instructions | BOUNDS | adopted | prompt rule stated; D3 and D12 reworded |
| B16 unlisted fixture facts | BOUNDS | adopted | property list inline |
| B17 labelers' handout | BOUNDS | adopted | SKILL.md, prompts, property list; hashed |
| B18 per-anchor band; S on anchors | BOUNDS | adopted | pooled checks; S cut from anchors; RL kept |
| B19 direction balance | BOUNDS | adopted | miss direction registered; E1 split by direction; over-provisioning specificity condition |
| B20 untested rules; rationale mediator | BOUNDS | adopted | Limits list; mediator |
| B21 multi-call scoring; D14 roles | BOUNDS | adopted | every label scored on the whole set; gate-site rule; models only |
| B22 X1 pointless; X3 cannot discriminate | BOUNDS | adopted | X1 dropped; X3 reworded to rule out setup |
| B23 to B26 D1, D11, D13, D15 labels | FAILS | agreed | none |

### Completeness and pre-mortem

Adopted: the failure-handling and flow tables; the fixture property list inline; the ordered pre-registration sequence; the label-audit procedure; the screen details; tests named per endpoint; the branch table; session parameters; isolation; I2 with the main-run flags; hook-input fields in I5; the scoring gaps; the forced-denial prompts; power for F2 and the TOST branches; the untested-rule list; the inconsistency list (admission rule, run count, bound unit, worker count, class column, label rule, D2, the D1/N5 note, arm-text count, canary placement, I5's reference, block unit, M2 against Inconclusive, "fixture plugin"). From the pre-mortem: equivalence pass rates registered; minimum denominators and two-stage tasks for the gate subset; the instruction-priority block named as such; M3 pooled and conditional; the pinned binary and the version check; unanimous labels for the primary set and the conservative-branch rule; the cap calibrated on the costliest RS sessions, probed, with an exclusion row and a health-check action.

Not adopted, with reason: the pre-mortem's 16 runs per cell for TOST power 0.8 (about 240 more sessions); v2 registers the TOST pass probability at the chosen size instead, and the owner may replace the bound with an action threshold. The owner's other rule files as a constant background (H2-10's option): it would add every other rule's effects to every arm; the absence is stated instead.

## Round 3 (2026-10-12), on PROTOCOL-v2

Reviewers: three survival critics (Opus 5.5, xhigh) covering harness and feasibility, statistics and decision rules, and confounds and the task bank, each re-checking every prior attack in its domain; an outside reader (Opus, xhigh) who saw v2 and the skill only; a consistency pass (Opus, high); a cost-options analysis (Sonnet 5.5, high); a quote re-check (Sonnet 5.5, medium) against the live pages. Tallies: prior attacks resolved 161, partly 60, unresolved 2, ruling-wrong 1; new attacks 6 KILLS, 39 BOUNDS, 3 FAILS; the outside reader gave 3 blocking, 8 major and 10 minor findings. Raw reports: `round3/*.md`.

### Quote re-check

22 of 27 claims verbatim, 2 paraphrase-ok (the `stopReason` "only", and the scaffold "files and git state only" wording), 1 not found (any revocation route for a setup-token token; the page documents none), and caveats on three: a timed-out SDK callback hook does block; `--tools` covers built-in tools only; `max` set through the environment variable persists. v3 carries the caveats.

### Rulings I reversed or declined

- CTL-2 (the pointer-by-gate 2×2), marked ruling-wrong by the confounds critic: with Bc replaced by Bm the earlier reason lapsed. v3 does not add the 2×2; it lists gate belief as a separate manipulation the trial does not run, and holds the claim constant across R, RL and RS.
- The pre-mortem's 16 runs per cell for TOST power 0.8: declined again. v3 replaces the two-sided TOST with the one-sided 95% upper bound, which is the decision-relevant half, and raises R and RS to 8 runs, which the cost analysis found the cheapest lever.
- The owner's plan-meter readings before and after the smoke (H2-06's second edit): declined; the runner has no meter access, and the owner's ceiling is set in batch-1 multiples with scheduling around the owner's sessions.
- Running the screen-promoted candidates and the near-ceiling set in the main run (N10, CB3-17): declined; they are reported from the screen only.

### Changes in v3, by source

| Source | Change |
| --- | --- |
| Outside reader blocking 1; N1; cost analysis | 26 candidates (seven added: R8 to R15 minus R4, which moved to the text-gap block); the screen stops early when decided; the realized T and the grid's branch probabilities go into the registered protocol; the null rows need T at least 12 and use the one-sided upper bound; the trial is named a detection study first |
| Outside reader blocking 2; N2, N3, N5, N6, N9 | a 14-row ordered branch table with signed conditions and first-match precedence; a total order for the label-dependent rule; the specificity condition as a one-sided exact test; anchor checks as tests only; M2 as a lower bound at 0.70 with I10 calibrated to it; M1 pass defined on R's level |
| Outside reader blocking 3 | owner items gathered into step 0: token, pre-registration spend ceiling, total ceiling, plan choice, the bound, a conflict-of-interest statement; the manifest hash deposited outside the repository |
| Outside reader major 4; N7; CB3-10 | M3 is an instrument control: arm Pc (R plus a directive line naming the tier) against R on the planted tasks; the planted tasks' RS minus R is reported as transmission of skill-only rules and supports a null; "not testable" reads "instrument sensitivity not shown" |
| Outside reader major 5 | the screen scores agreement among named calls; row 2 ("naming, not judgment") requires the named-calls sensitivity to agree |
| Outside reader major 6; B21; W08 | gate-site model as the primary outcome on Workflow tasks; a role-assignment algorithm with test cases; the Workflow cap of three in the primary set; a sensitivity dropping them |
| Outside reader major 7 and 8 | rows 5, 7, 12 and 13 scoped to the tier-choice rules; "keep" pending Phase 4; RL's cost decided outside; E2 and F1 tested whatever E1 shows, each its own family; F2 gated on E1 |
| Outside reader major 9; CB3-04 | RL carries lines 8 and 33 to 38 as well; about 720 words; the coverage claim holds by construction |
| Outside reader major 10; R3-H13 | I7 on non-candidate tasks with sealed transcripts; I10 at 20 sessions, pass at 17, direction down from the highest candidate level; exposure outranks the parameter; probes ordered I1, I6, I2, I3, I10, I7, I4, I5, I8 |
| Outside reader major 11; CB3-11 | labelers from two model families; unanimity defined on first readings per role; effort bands audited; the round-2 audit stated as 21 of 24 unanimous on v1 wordings and re-run in full |
| Outside reader minors | D dropped from Instrument 1; Q4 descriptive; "the plugin's full configuration on this harness"; every primary prompt instructs to delegate; D4 carries the union label; the gate claim stated as held constant; re-runs by whole task block at a fresh position; the template's file list asserted; the deferred-tool branch; fork scores as the session model; the transfer criterion on named calls |
| R3-H01, R3-H02 | the PostToolBatch stop keyed on the observer's record files; no `onFailure` on PostToolBatch; a hook-failure row |
| R3-H03, R3-H04 | I1's owner-file criterion replaced by positive checks; the template frozen before the probes; flag-cache diffs per session with a registered key set; the no-cache branch |
| R3-H05, CB3-20 | isolation restated (plugin and configuration files readable by design); a stub `hooks/README.md` in RS and S; `tiers.js` kept out of RS and S; reads under the configuration directory a mediator |
| R3-H06 | the alias table and schema check in I1; the `ToolSearch` branch |
| R3-H07, R3-H08, A9 | Instrument 2 fork mode off; the idle-ceiling variable; `Budget limit reached` classified apart; "re-issued as a fork" as an FD outcome |
| R3-H09, CB3-01 | `tools/sweep.js` as an overlay for FD4 to FD6; the FD prompt without "exactly as written" |
| R3-H10, N13 | G1 to G3 at four runs per arm; the minimum applied to the realized count; a second delegation defined by turn |
| R3-H11 | a private binary copy under the neutral root with its hash verified per chunk |
| R3-H12 | I7 after the level is final; a separate Fable cap; a failure row for a cap landing between the delegating turn and the hooks |
| R3-H14; consistency | the pre-registration sequence reordered with step 0; the parser hashed before the screen; a failed property returns to step 1 |
| S2-05 (round 2) and CB3-03 | the twin block is descriptive and runs only for twins whose plain task is primary; "finder" moved into D14's twin; D4, D14 and R6 plain wordings without skill terms |
| CB3-02, CB3-12, CB3-13, CB3-14, CB3-16; consistency | the property suite outside the copied tree; `test/` ordinary; the D4 property with the call order stated and no fail-open comment; ratelimit.js fixes and identity rule implemented without comments and declared a fairness limiter; R4 to the text-gap block; R7's literal-read property; D22 and D23 reworded; missing property rows added |
| CB3-05 | F2 named a form contrast; per-protocol F2 reported; row 7 requires M2; RL's best-case position in Limits |
| CB3-06 | Bm is P plus line 16 |
| CB3-08, CB3-09 | R3 and D13's twin in the tier-naming list; the gate sites of D14 and R6 in the session-model list; D16's cell corrected; the patch tasks are D7, D16 and D25 and M1 is reported with and without D7 |
| N4 | breadth at p at or below 0.20, renamed "significance depends on <ids>" |
| N8 | M2's denominator (primary-set RS sessions) and bound method named |
| N11 | the grid outputs branch probabilities, RL scenarios, few-mover cases, the fitting method with bounds, and a run-count rule |
| N12 | the P minus A0 TOST dropped |
| N14 (FAILS) | the coverage action registered |
| CB3-18, CB3-19 (FAILS) | none |
| Consistency pass | the admission rule stated once; the run counts stated once with the grid's rule; task equivalents at attainable T; "patch tasks" defined; the anchor heading corrected; the smoke defined on its own terms and named "property smoke" against "launch smoke"; the three senses of "canary" named; D22's band; sidedness per endpoint; the terms list defined in Measurement; Instrument 1's timeout stated; the H1 fallback inlined |

### Still open after round 3

- The expected admitted T is about 9 from 19 candidates under the author's predictions; the seven added candidates raise it, and the registered protocol will state the realized T. Rows 12 and 13 stay unreachable below 12.
- The cost analysis's three plans are the owner's choice; v3 is written at Plan C's scope.
- The round-2 label audit covered v1 wordings; the v3 wordings and R1 to R15 are unaudited until step 4.
- No simulation of the one-sided upper-bound criterion exists yet; the registered grid produces it.
