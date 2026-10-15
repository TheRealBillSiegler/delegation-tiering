# Completeness

Verdict: At the design level, v1 takes up most of round 1. It adds the H2 harness, the Bc and RL arms, the R-only screen, the stratified exact test, the manipulation checks, the provenance and publication rules, and replaces every task the critics killed. All 13 KILLS are addressed at least in part. Against the text, though, several items the ledger marks as adopted are missing from v1: the failure-handling table, equivalence power, CL3's consistency check, the A10 residuals and the spread away from validate.js. The ledger's own ruling counts are also wrong (13/51/6, not 11/32/3). A reader could not yet re-run the trial from v1 alone. Missing are the fixture property list, the label-audit procedure, the order of pre-registration steps, the tests for every endpoint except E1, several session parameters, isolation between sessions under H2, and decision branches for plausible outcomes: a positive E1 with M2 or M3 failed, an unresolved F2, a significant F1 under a null E1, and a null F3. The sizes disagree internally: six runs against a grid-chosen count, a twenty-task bound against 12 assumed tasks, and worker sessions and smoke cost undercounted. One limit on this review: whether `--max-budget-usd` exists and whether sibling session directories are readable under dontAsk is unverified, so those two items are flagged as needing a probe, not asserted as defects.

## Round-1 musts and rulings

- [partly] Research, item construction #1: test predictions in R, not A0/P; numeric P(R agrees) and P(RS agrees); a second forecaster; Brier score (Tasks (P(R agrees) column); The screen (Brier score). P(RS agrees) and the second forecaster are missing, and the ledger does not list them as not adopted.)
- [adopted] Research, item construction #2: a registered R-only screen (at least 4 runs, disjoint sessions, thresholds 0.5 and 0.8, screen data kept out of the endpoints) (The screen. Line 24 restates the admission rule differently (see inconsistencies).)
- [adopted] Research, item construction #3: a failed task leaves the primary set; the full set is the sensitivity analysis; 'no material increment' requires at least 10 headroom tasks, a passed positive control and invocation of at least 80% (E1 sensitivity (full candidate set); Decision rules preconditions; M2; M3)
- [partly] Research, item construction #4: a label audit by 2-3 fresh readers; keep a label only with at least 2/3 agreement; rewrite or drop failing items (Tasks paragraph. Failing labels get a dual label instead of being rewritten or dropped, and the primary analysis still scores the author's label even if all three labelers disagree. The ledger does not record this departure.)
- [partly] Research, item construction #5: fix the class arithmetic and state the rules-to-items ratio (Tasks. The old miscount is gone, but v1 says each task has 'a class' and no table has a class column. No rules-to-items count is given.)
- [partly] Research, item construction #9: a planted-effect positive control with a +0.3 floor, plus an invocation floor of 80% with ITT and per-protocol results (M2, M3. The fork-rule half of the positive control was dropped (X4 is exploratory), M3 rests on one task (D13), and M3 has no pass test.)
- [partly] Research, item construction #14 (T04): remove the 'cheap' and 'inventory' leaks; make a third of the changelog items paraphrased; verify with a haiku worker (D3 and Fixture. 'Cheap' is removed and the paraphrase property added, but 'inventory' stays in the prompt and no haiku-worker check is specified (the smoke session's worker model is not given).)
- [adopted] Research, item construction #16 (T09): replace with named fixes and no skill vocabulary (D5, with a 're-gate' twin)
- [adopted] Research, item construction #19 (T13): delete 'No one has tried this yet'; relabel 'sonnet; medium or high' (D9, plus its positive pair D10)
- [adopted] Research, item construction #23 (T20): make the verifier an open gate (D14)
- [adopted] Research, item construction #26 (T23): move to exploratory or cut (X4, conditional on I6)
- [partly] Research, controls #1: a session-start placebo matched in form; assert that no path-scoped rule is in P; verify P is present from turn 1 in every P session (Texts (P = coding-principles.md) and the banned-string assertion. Delivery is checked only in probe I1. The exclusion list's 'canary absent' points to a per-session canary that no arm text contains.)
- [missing] Research, controls #2: a 2x2 on the skill pointer and the gate claim (or at least arm R-g) (Not adopted (ledger). The stated reason, that Bc tests belief where there is headroom, holds for Q3. It leaves R with a dangling skill pointer and a gate claim, though, so R is not the 'rule-only form' the no-increment branch would recommend. v1 should say so.)
- [adopted] Research, controls #7: record every call in the first turn in transcript order; all-agree scoring with an 'any' version; record which hook's reason D received; a two-hook probe (Instrument 1, Measurement (scored set), I5. Per-call rates replace the 'any' version.)
- [adopted] Research, controls #8: ITT primary, per-protocol sensitivity, and a skill-read mediator (M2; Mediators)
- [partly] Research, controls #13: five limits (topic-unrelated placebo, mixed routes, same author, first choice only, one model generation) (Limits stated now covers (3), (4) and (5). (2) is resolved by having one route. (1), that a topic-unrelated placebo cannot separate 'any rule' from 'this rule' as an active control would, is not stated.)
- [partly] Research, harness #1: test three stop mechanisms; fail closed; a parser check that every session ended with no worker (Instrument 1 (continue:false, deny backstop, onFailure block) and I5. The alternatives are not tested, which is defensible from hooks.md. The no-worker check exists only in the I5 probe, not as a per-session parser check or flag in the main run.)
- [adopted] Research, harness #2: record every matching call in the first turn; the transcript is primary; never read transcript_path inside the hook (Instrument 1; Measurement)
- [adopted] Research, harness #4: redesign I2 for an effort route that works (H2 --effort; I2; the H1 fallback states medium)
- [adopted] Research, harness 'must run': I1 (the loader route) (I1 (redesigned for H2))
- [adopted] Research, harness 'must run': I3 (variable unset, medium, xhigh on 2.1.296) (I2 (unset) and I3)
- [adopted] Research, harness 'must run': two plugin directories load together (I9 (H1 only))
- [partly] Research, harness 'must run': widen I5 (one call, parallel calls, Workflow script; whether the hook input carries effort and the script) (I5 covers one call, three calls, the Workflow script and D's double deny. Whether the hook's tool_input carries `effort` is not probed, so the observer cross-check for effort is undefined.)
- [adopted] Research, reporting #1: a provenance manifest hashed into the frozen protocol, with a pushed tag (Blinding, leakage and records: provenance manifest)
- [adopted] Research, reporting #2: a per-session record schema and an alias-to-ID probe (Measurement: per-session record; I8)
- [missing] Research, reporting #3: a failure-handling table registered before data, and a flow table per arm (Only a closed exclusion list exists. I5 cites 'the failure-handling table's "session ended by observer" row', but no such table is in v1. No flow table. There are no rows for a missing observer record, a model that stops after a denial, a malformed Workflow script, or an observer stop that fails. The ledger lists this item as adopted.)
- [adopted] Research, reporting #4: publish the per-session rows and the captured inputs (Blinding, leakage and records: Published)
- [adopted] Research, reporting #5: a withholding policy with a SHA-256 list (Blinding, leakage and records: Withheld (the record count is omitted))
- [adopted] Research, statistics #1: raise runs for R and RS; allocate unevenly (Size table (6 runs for R and RS, 2 for the other arms). This conflicts with the grid-chosen run count in Statistics.)
- [partly] Research, statistics #2: register the simulation script and a sensitivity grid, including null size and few-mover scenarios (Statistics stated once. The grid covers shifts on half the set and on all of it, plus null size. The few-mover cases (k=2 or 4 affected tasks) and the half-0.3-to-0.6 case are absent.)
- [partly] Research, statistics #3: per endpoint, the statistic, null, alpha, enumeration, zero handling, minimum p, and the nonzero count beside every p (Complete for E1 only. No test is named for M1, M3, E2, F1-F4 or the TOST. The minimum p is required, but the number of nonzero tasks is not.)
- [partly] Research, statistics #6: derive the bound from cost and add an equivalence-power calculation (Decision rules: the bound is restated in task units and awaits the owner's confirmation. There is no cost derivation and no equivalence power (the ledger says adopted). 'Twenty-task set' conflicts with the size table.)
- [adopted] Research, statistics #8: batch rules (arm-pooled health check, no efficacy or futility stopping, block randomization, complete blocks) (Execution; Inconclusive by execution. The block unit is ambiguous and the re-estimation cap is not stated.)
- [partly] Research, statistics #9: a closed exclusion list (infrastructure faults, failed fixture check), what stays in, and a missing-cell rule (Exclusions bullet. The failed-fixture-check exclusion and the rule for unequal run counts are absent.)
- [adopted] CL1 KILLS: the placebo is path-scoped (Texts: P)
- [adopted] CL2 KILLS: R- confounds the pointer and the gate claim; naming at ceiling (Arm Bc vs A0; the Belief decision rule is reworded. A0 headroom replaces the critic's omission-inviting tasks, and that reason holds.)
- [adopted] CL4 BOUNDS: the first call is a race under parallel calls (Instrument 1; Scored set)
- [adopted] CL5 BOUNDS: D under Instrument 1 equals RS (Arm D role; Descriptive D minus RS; Instrument 2 runs RS and D only)
- [adopted] CL6 BOUNDS: the base-directory leak; S carries gate belief (Texts (neutral directory, Enforcement caveat); I4; Mediators (canary))
- [adopted] CL7 BOUNDS: the case path leaks (H2 neutral root; Fixture path assertion)
- [partly] CL8 BOUNDS: the fixture mirrors the plugin (Fixture renamed and banned list extended. RS minus R reported separately for the validator-file tasks is missing.)
- [partly] CL9 BOUNDS: coined terms; author labels; counts (Label audit and twins. Twins cover 5 tasks, not every divergent task; the limit is stated at line 260.)
- [adopted] CL10 BOUNDS: invocation depends on effort; omitted-model scoring on Fable (M2; Model agreement (session model by name); Transfer runs at the same level)
- [partly] CL11 BOUNDS: route seams and the loader wrapper (One route per harness. Recording in I1 whether the 'OVERRIDE' wrapper is present is not stated.)
- [partly] CL12 BOUNDS: bundled skills as a second source of doctrine (Mediators by name. A separate D14/D15 report alongside workflow-authoring invocation is not in the Descriptive list, although the ledger claims it.)
- [adopted] S1 KILLS: the attainable p floor (The screen; stratified test; minimum p reported)
- [partly] S2 KILLS: the power assumption (Power grid. It lacks the k=2 and k=4 scenarios the critic required.)
- [adopted] S3 BOUNDS: use a stratified run-level test (E1. 'Interval by inverting the same test' is not specified (a binary outcome needs an effect model).)
- [adopted] S4 BOUNDS: predictions about R; disjoint calibration (Tasks; The screen)
- [partly] S5 KILLS: the ±0.15 bound (Decision rules. Task units, 90% TOST and a precondition are in. The cost justification is pending, the TOST method is unspecified, and there is no evidence the branch is reachable.)
- [adopted] S6 KILLS: specificity misread (M1; Descriptive P minus A0 with TOST)
- [adopted] S8 BOUNDS: endpoint 3 re-measures endpoint 2 (E2 (effort named); above-band effort is descriptive)
- [partly] S9 BOUNDS: secondary family too large and unnamed (F1-F4 are named by arm, metric and set. The test for each is not named, and no power is given for these 2-run arms.)
- [partly] S10 KILLS: R minus R- cannot show belief (Arm Bc and F3. The decision rule for a null F3, which the critic required, is missing.)
- [partly] S11 BOUNDS: batch gaps; blinded re-estimation (Execution. 'Up to a stated cap' never states the cap, and 'after the first half' is undefined.)
- [adopted] S12 KILLS: Instrument 2 cannot see denials (Instrument 2 (reminder-change rate, forced-denial probe); Gate rule uses the organic audit)
- [adopted] S13 BOUNDS: no transfer criterion (Orchestrator model: transfer criterion; Limits)
- [adopted] S14 BOUNDS: D is A/A; pool or reallocate (D kept separate as a leak check (ledger reason holds). The 'nonzero flags a leak' rule has no threshold.)
- [adopted] S15 BOUNDS: the estimand (Endpoints closing paragraph)
- [adopted] A1 BOUNDS: deny does not stop; use continue:false (Instrument 1; I5)
- [adopted] A2 BOUNDS: plugins: default (H1 fallback paragraph (H2 avoids the field))
- [adopted] A4 BOUNDS: D under capture; the gate writes nothing on a denied call (Instrument 1 (offline gate recompute))
- [adopted] A5 KILLS: loader route closed inside plugin eval (H2 harness. The critic's caveat that H2 loses read isolation is met only for the owner's home. Isolation between sibling session and config directories under the neutral root is not addressed.)
- [adopted] A6 BOUNDS: effort route (H2 --effort; I2; I3)
- [partly] A7 BOUNDS: command-line limit (H1 fallback grouping. The single longest-path start check before registration is not stated.)
- [adopted] A8 BOUNDS: path leak (H2 neutral root; banned strings)
- [adopted] A9 BOUNDS: fork mode off under -p (I6; X4; Limits. Re-running the effort probe under fork-on is not stated.)
- [adopted] A11 BOUNDS: Fable effort, scoring, price (Orchestrator model: transfer subset)
- [partly] A12 BOUNDS: the fixture is a hand-authored deliverable (Fixture. The property list is declared part of the protocol but is absent. Facts that D5, D12 and N2 need (env-var output path) are not in the fixture description.)
- [adopted] A13 BOUNDS: analyzer extensions (Measurement: parser hashed before registration)
- [adopted] A14 BOUNDS: size against plan usage (Size table; Execution (no dollar figure on the smoke ceiling))
- [adopted] A15 BOUNDS: placebo route (Texts: P)
- [adopted] A16 BOUNDS: no within-task variance (The screen; blinded re-estimation from the D/RS pairs)
- [adopted] A01 BOUNDS (T02) (D1, N5; Fixture (comment lines))
- [partly] A02 BOUNDS (T03) (D2 is relabelled, but 'low preferred' has no scoring meaning, and D2 is screened as a primary candidate while marked 'secondary')
- [adopted] A03 BOUNDS (T04) (D3; Fixture)
- [adopted] A04 BOUNDS (T08) (D4 (evidence named, dual label, tie-break))
- [adopted] A05 KILLS (T09) (D5)
- [adopted] A06 BOUNDS (T11) (D7)
- [adopted] A07 BOUNDS (T12) (D8; every-call scoring)
- [adopted] A08 BOUNDS (T13) (D9, D10)
- [adopted] A10 BOUNDS (T19) (D13; guard-review.md in the fixture)
- [adopted] A11 BOUNDS (T20) (D14)
- [adopted] A12 BOUNDS (T21) (D15 (merger scored for naming only))
- [adopted] A13 KILLS (T22) (D16)
- [adopted] A14 KILLS (T23) (X4; excluded from the naming check)
- [adopted] A15 BOUNDS (T24, T25) (X1, X2)
- [adopted] W01 BOUNDS: predictions about R (Tasks)
- [partly] W02 BOUNDS: divergent-set arithmetic (The counts are gone, but the class column is missing)
- [adopted] W03 KILLS: screen before registration (The screen)
- [partly] W04 BOUNDS: rule coverage (D10, D25, X3 and the findings section are added. The tiering-rationale regex and the list of untested rules (deterministic check, unsupervised run, missing models, meta.phases) are missing.)
- [adopted] W05 BOUNDS: wording leaks (Twins; Limits line 260)
- [missing] W06 BOUNDS: concentration on validate.js (validate.js is still named by D4, D5, D8, D12, D13, D22, D23 and N4 (8 tasks, as in v0). ratelimit.js is named by no task, contrary to the ledger. The collapse sensitivity analysis is deferred.)
- [adopted] W07 BOUNDS: below-band scoring (Measurement: effort band)
- [partly] W08 BOUNDS: workflow parsing (Measurement (unresolved sites, consuming-site role). The consuming-site rule is not an algorithm. The per-arm rate of Agent-first calls on workflow tasks is not reported. I5 does not include an A0 or R launch of D14.)
- [adopted] W10 BOUNDS: independent labels (Label audit)
- [partly] W11 BOUNDS: fixture against task dependencies (The property list is declared but absent. Some prompts cite prior records the fixture lacks (D10, D16, D25, N4, X3), which is acceptable because the prompt carries the facts, but it departs from the critic's rule.)
- [adopted] W12 BOUNDS: placebo sentence false (Texts: P)

## Missing

- The failure-handling table (I5 cites it) and a per-arm flow table
  Why: A re-runner has no registered treatment for a missing observer record, an observer stop that fails (a worker runs), a model that stops after a denial, a malformed Workflow script, or a timeout before the first delegating turn. The denominators per endpoint cannot be reproduced.
  Fix: Add the table: row, treatment, affected denominator, sensitivity run. Add a flow table (launched, scored, excluded by reason, tasks with both cells per contrast).
- The fixture property list, which v1 calls 'part of the registered protocol'
  Why: Without it nobody can rebuild the fixture. The fixture description omits facts that prompts presuppose: N2's environment-variable output-path resolution, D5's size check before parsing and empty-header rejection, whatever D12 depends on, and whether each D4 fix actually passes. It is also unclear whether docs/reviews/guard-review.md counts among the 'fourteen' Markdown files in D2, X2 and X4.
  Fix: Inline the list (task, file, planted fact, assertion), state the docs/ file count with or without subdirectories, and hash it.
- An ordered pre-registration sequence
  Why: Fixture freeze, smoke sessions, label audit, predictions, probes, parser, screen, power grid, run count and the owner's confirmations depend on each other. If a smoke session after the screen shows a property failing, there is no rule (re-freeze and re-screen?).
  Fix: Add a numbered checklist with each step's input, output and stop rule, ending in the owner's sign-offs (bound, ceiling, re-estimation cap).
- The label-audit procedure
  Why: The labeler model and effort, its instructions and output format, the handling of three different answers, and multi-call workflow labels are all unspecified. 'Given only SKILL.md and the prompt' also conflicts with tasks-v1-prompts.md, which includes a fixture description.
  Fix: Specify the labeler model and effort, the exact handout (name the file), the output schema, and the agreement rule, stated once.
- Screen details
  Why: The screen does not say which agreement it uses (model only? D2 is effort-only), how twin wordings are screened, what happens if fewer than 10 pass after replacement, how many replacement rounds are allowed, or how screened-out tasks are run (the size table fixes 6 anchors at 2 runs).
  Fix: Name the screening metric per task, the twin handling, the replacement cap and fallback, and the run allocation for tasks reclassified as anchors.
- Tests for M1, M3, E2, F1-F4 and the TOST; the interval inversion
  Why: 'Statistics stated once' specifies only E1. Inverting a sharp-null permutation test for a mean difference in binary outcomes needs an effect model. M3's 'at or above +0.3' has no test and rests on one task.
  Fix: Name the test and interval method per endpoint, the effect model used for inversion, and M3's pass criterion.
- Decision branches for plausible outcomes
  Why: No branch covers: E1 significant positive with M2 or M3 failed (M2's 'not read whatever the primary shows' conflicts with falling to Inconclusive); F2 not significant with a TOST that fails; F2 significant negative; E1 null but F1 significant (plausible, since RL needs no invocation); F3 null (S10 required one); D13 failing the screen (M3 then has no headroom); D minus RS nonzero with no threshold; anchors' ±0.10 at 2 runs (resolution 0.5 per task, so noise alone breaks it).
  Fix: Add a branch table keyed on (M1-M3, E1, F1, F2) and give thresholds for the leak and anchor checks.
- Session parameters
  Why: Instrument 1's timeout and max turns, concurrency, the per-session budget value, the per-chunk ceiling, the smoke ceiling, health-check thresholds and their actions, and the variables removed 'as in run-eval.sh' are unstated. `--max-budget-usd` is not among the flags FACTS.md verified for `claude -p`.
  Fix: State every value and the exact command line, list the removed variables, and add `--max-budget-usd` (or its real name) to probe I1.
- Isolation under H2 between sessions
  Why: Read, Glob and Grep are granted. Deny rules cover only the owner's home and repositories. Nothing says where per-session config directories (which hold rules/delegation.md), record files, the key and the labels live relative to the C:/e2 root. An A0 session might read another arm's rule text. I1 checks only the owner's ~/.claude.
  Fix: Place config dirs and records outside any readable root or deny them explicitly, and add to I1 a check that a session cannot read a sibling session's config.
- Effort-schema probe conditions and hook input fields
  Why: FACTS line 16 shows the effort parameter's presence co-varied with the Workflow grant in attempt 1, so I2 must run with the main run's exact tool grant. The hooks docs list no effort field in the Agent hook input, so the observer cross-check for effort may be impossible.
  Fix: State that I2 uses the main-run flags, and add to I5 whether tool_input carries effort and the Workflow script.
- Scoring gaps
  Why: No rule covers: several calls on a single-call-label task (D1 split per file); a scouting Agent call before the Workflow launch on D14 or D15 (the A10 residual the ledger says was stated); D2's 'low preferred'; whether D14's 'every call names a model and an effort' enters model agreement; the denominator for unresolved Workflow sites in M1 and F3; how X3 is coded; what 'second delegation differs' means in Instrument 2.
  Fix: Add one scoring line for each.
- CL3's consistency check (Instrument 2's first delegations should match Instrument 1's)
  Why: The ledger says it is registered, but v1 lacks it. Fork mode is also on in Instrument 1 and off in Instrument 2, which would confound it.
  Fix: Add it to Descriptive and run both instruments with the same fork setting, or state the confound.
- Forced-denial probe prompts
  Why: The six sessions are described but their prompts are not written, so the probe cannot be re-run.
  Fix: Add the six prompts to the task tables.
- Power for the secondary contrasts and for the equivalence branches
  Why: RL and S run 2 per cell. The round-1 simulation put the chance of an interval inside ±0.15 at a few percent for runs of this size, so the 'tables carry the increment' and 'no material increment' branches may be unreachable. The ledger claims equivalence power was added.
  Fix: Extend the grid to F1, F2 and the TOST branches, or state that they are unreachable at this size.
- Untested rules and the RS-shuf rationale
  Why: W04 required listing the untested rules. The ledger says a shuffled-ladder control 'changes no decision', but the F2-positive branch ('keep the skill') cannot separate the skill's content from the effect of invoking a long document, as Limits line 259 concedes.
  Fix: List the untested rules in Limits, and either add RS-stub or RS-shuf or weaken the F2-positive recommendation.

## Internal inconsistencies

- The admission rule is stated two ways. Line 24 says only tasks R 'misses at least half the time' enter the primary set. The screen (line 166) also admits R agreement between 0.5 and 0.8 (that is, 0.75 at 4 runs) as 'flagged'.
- The run count is stated two ways. Line 32 and the size table fix six runs per cell for R and RS. 'Statistics stated once' sets the run count from the grid (4, 6 or 8), and blinded re-estimation can add runs.
- The task count behind the bound disagrees. The bound is 'three task-equivalents on a twenty-task set' (line 215), but there are 18 candidates and the size table assumes 12 survive. ±0.15 of 12 tasks is 1.8 tasks.
- Worker sessions and cost are undercounted. 'Of which 30 run a worker' and 'probes and smoke $5 to $10' leave out I8's four full-execution sessions and one full-execution smoke session per primary task (12 to 18), roughly $15 to $25 more at $0.97 per session.
- Line 115 says each task has 'a class', but no task table has a class column.
- Two label rules overlap. 'A label stands when at least two of three agree' and 'a task with any disagreement carries both labels' both apply to a 2-of-3 outcome, and 'both labels' is undefined when three readings differ.
- D2 is listed among 'Candidate primary tasks' and screened, but noted 'secondary'. With P(R agrees) of 0.9 on model, the screen rule would make it an anchor, yet the size table fixes the anchor count at 6.
- D1's note ('twin of anchor N5 without the first sentence') reads backwards. N5 is D1 without the first sentence.
- The provenance manifest counts 'the five arm texts', but four arms carry text (R, RL, P, Bc). A0 and S are empty.
- The fixture is 'hashed as a tree and copied into every session' under a banned-string check, yet line 253 puts a training-data canary string in the published fixture. Either the sessions see an evaluation marker, or the published fixture differs from the hashed one.
- The exclusion list names 'canary absent' as an infrastructure fault, but no arm text carries a per-session canary. 'Canary' also means the plugin command and the I1 probe string.
- I5's decision column cites 'the failure-handling table's "session ended by observer" row', which does not exist.
- Two block units are used. Session order is 'block-randomized over (task, arm, run)', while 'Inconclusive by execution' computes on 'complete task blocks'.
- M2 says a failed exposure check makes the skill verdict read 'not read at this effort level' whatever the primary shows. The Decision rules send any failed manipulation check to 'Inconclusive' through the 'otherwise' branch.
- 'The skill-only plugin variant is the fixture plugin…' and the 'fixture-plugin tag' use 'fixture plugin', a term defined nowhere. The fixture is the Node CLI.
- Cross-file: v1 says labelers get 'only SKILL.md and the prompt', but the labeling handout tasks-v1-prompts.md also carries a fixture description.
- Ledger against v1: the ledger says tasks were spread over ratelimit.js (no v1 task names it). It says the failure-handling table, the CL3 consistency check, the A10 residuals and equivalence power were adopted (none is in v1). It reports '11 KILLS, 32 BOUNDS, 3 FAILS', but the four critic reports contain 13, 51 and 6.