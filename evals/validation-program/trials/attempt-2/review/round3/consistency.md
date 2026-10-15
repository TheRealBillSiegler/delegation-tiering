# Consistency

Verdict: The session totals add up: 40 + 26 + 184 + 336 + 24 + 182 + 24 + 40 + 48 + 26 = 930. Cost projections are within rounding of the per-session figures. The task count of 19 matches the screen row. v2 is still not internally consistent or re-runnable from itself alone.

Four defects change outcomes:
1. RL's claim that it contains every primary candidate's governing line is false for D1, R7 (line 35) and D12 (line 8), which muddies what F2 measures.
2. The branch table keys on \"F1 significant\" and \"F2 significant\" without a sign, so a significant negative result would recommend the RL form or keep the skill. F1 is tested on null-E1 branches despite the \"gatekept after E1\" heading.
3. The fixture smoke and gate-subset minimum denominator are defined against an arm (R) and a task set (the 26 candidates and anchors) that cannot produce the second delegations the minimum requires, and they omit the planted, G, FD and text-gap tasks whose properties the list asserts.
4. The banned-string check contradicts tools/sweep.js and the fixture's own property tests, both of which sit in every session's copy of the fixture.

The label-audit claims overstate what was done: the audit used v1 wordings, was unanimous on 21 of 24, and never saw R1, R3 to R7 or the redesigned D16.

The pre-registration sequence places the token sign-off after the steps that need it, and leaves the order of I2 and I6 and the re-probe scope after I10 unstated.

A re-runner also lacks the hook and settings contents, the H1 fallback (deferred to v1), the Workflow-site resolution rule (deferred to attempt 1's analyzer), Instrument 1's timeout and turn limit, the test definitions for every endpoint but E1, and run allocations for any screen outcome other than T = 12.

Most fixes are textual and local. The fixture/banned-list conflict and the smoke/minimum-denominator design need a structural change before round 3.

## Inconsistencies

- (Components and arms, Texts, RL bullet) The text says "Every primary candidate's governing line is inside RL", but RL carries SKILL.md lines 14-23, 27, 46-54, 56, 60 and 64 only. D1 and R7 cite line 35 (selection question 1), and D12 cites line 8 (the standing rule). Neither line is in RL. The same bullet then lists "the standing-rule paragraph" and "selection questions" among what F2 measures, so for those three candidates F2 includes the governing line itself.
  Fix: Either add lines 8 and 35 to RL, or correct the sentence to name D1, D12 and R7 as exceptions and say that F2 on those tasks includes their governing line.
- (Decision rules, branch table (rows 2-4, 9, 10)) The cells read "F2 significant" and "F1 significant" with no direction. A significant negative F2 (RL above RS) under a positive E1 would trigger "keep the skill". A significant negative F1 (RL below R) would trigger "recommend the RL form" in rows 3 and 9.
  Fix: Write "F2 significant positive" and "F1 significant positive". Add rows for a significant negative F1 or F2.
- (Form heading "(gatekept after E1)" against F1 and the null branches) F2 is "tested at 0.05 if E1 rejects". F1 has no gating statement, yet the null-E1 rows 9 and 10 branch on "F1 significant", so F1 is tested when E1 does not reject. That contradicts the gatekept heading. F1's alpha and sidedness are also never stated.
  Fix: State F1's test, alpha and sidedness. Say explicitly whether F1 is tested regardless of E1, and drop or qualify the "gatekept" heading.
- (Branch table: row overlaps) Some outcomes match more than one row and no precedence is given. A positive E1 that fails breadth and specificity at once matches rows 5 and 6. M2 below 0.8 with E1 not significant matches both "not read at this effort level" and the "any/any ... inconclusive" row. M2 at or above 0.8 with M3 failed matches both "instrument cannot see" and "inconclusive".
  Fix: State that the first matching row applies, or make the conditions mutually exclusive.
- (M2 definition against the branch table M2 column) M2 is "judged by its exact lower 95% bound against 0.8", but the table columns read "below 0.8" and "at or above 0.8", which reads as the point share.
  Fix: Write "lower bound below 0.8" and "lower bound at or above 0.8" in the table.
- (M1 definition against the branch table M1 column) M1 is a test of R minus P, but pass and fail are defined only by R's absolute naming rate (below 0.9 voids). The stratified test of R minus P has no consequence, and "pass" is never defined positively.
  Fix: Define M1 pass as R naming at or above 0.9 and state that the R-minus-P test is reported only. Otherwise, add the test result to the pass condition.
- (Decision rules, smallest effect of interest) "3 at T = 20" and the orientation figure "0.63 at 20" assume 20 primary tasks, but only 19 candidates exist and the size table assumes T = 12.
  Fix: Restate the task equivalents at attainable T values (for example 10, 12 and 19).
- (The screen ("fewer than ten") against Decision rules ("T at least 12")) The ten-task threshold has no effect: under 10 or not, "the trial registers with what passed". The null branch then needs T of at least 12, so any T from 1 to 11 can only reach inconclusive, and breadth with a very small T is undefined.
  Fix: Give the ten-task threshold a consequence (for example, below it the trial does not register, or the null branch is declared unreachable at registration), and align it with the T of at least 12 in the null branch.
- (The screen ("5 or 6 of 8 enters a sensitivity set"; "7 or 8 becomes an anchor") against the Size table and Anchors) The sensitivity set has no arms, run count or row in the size table, yet E1's sensitivity analysis adds it. Tasks screened into anchors are not budgeted (the size table fixes 7 anchors), and it is not stated whether they join the pooled anchor checks or the specificity pool, which lists N1, N2, D7, N6 and N5 by name.
  Fix: State the arms and runs for the sensitivity set and for screened-in anchors, add both to the size table, and say whether screened-in anchors join the anchor checks.
- (Components and arms table and Size table (6 runs) against Statistics stated once ("Run counts are fixed at registration from the grid"; "runs 4, 6 and 8 for R, RS and RL")) The arms table, the size table and the attempt-1 limits row present 6 runs as fixed, while the grid may choose 4 or 8. "Runs 4, 6 and 8 for R, RS and RL" can also be read as R = 4, RS = 6, RL = 8.
  Fix: Say the grid evaluates 4, 6 and 8 runs per cell in each of R, RS and RL. Mark the tables' 6 as provisional.
- (Anchors paragraph ("in A0, P, Bm, R, RL, RS and D at 2 runs, and in R, RS and RL at 6 runs")) R, RS and RL are listed at both 2 and 6 runs. The size table reads it as 6 for R, RS and RL and 2 for A0, P, Bm and D.
  Fix: Write it as "R, RS and RL at 6 runs; A0, P, Bm and D at 2".
- (Anchors: "Registered checks" against Endpoints "Descriptive, with intervals and no test" ("the anchor checks")) The pooled anchor tests (90% interval inside ±0.10, RS against R and RL against R) are called registered checks, then listed as descriptive with no test. No branch uses them. Only the separate specificity condition (over-provisioning) enters the branch table, and "no increase" has no operational definition (point estimate, test or interval).
  Fix: State what a failed ±0.10 anchor check does, and define "no increase in over-provisioning" as a rule that code can apply.
- (Anchors heading "one per ladder row") There are seven anchors and six ladder rows. N5 duplicates the haiku row, N6 is a verification-table row, and no anchor covers the opus medium-to-xhigh reasoning row (line 21).
  Fix: Reword the heading or add a reasoning-row anchor.
- (Fixture smoke: Fixture section, Size table and Pre-registration step 3) Step 3 runs the smoke as "Instrument 2, arm R", but Instrument 2 is defined as arms RS and D only. Step 3 also comes before the screen (step 6), so "per primary and anchor task" can only mean per candidate (19 + 7 = 26, which matches the size table). That leaves planted D8 and D13 (with its overlay), text-gap D9 and X3, G1 to G3 and FD4 to FD6 without a smoke session, although D8, D13, D9, G1 and FD4-6 all have rows in the property list. The opus- and fable-labeled candidates also run full execution under Instrument 2's $4 cap, although Instrument 2 itself excludes opus and fable workers for cost and attempt 1's opus cells cost up to $5.8.
  Fix: Define the smoke instrument and arm on their own terms. List every task that needs a smoke session, including planted, text-gap, G and FD tasks, and state the cap for opus and fable smoke runs.
- (Instrument 2 minimum denominator against Pre-registration step 3) "At least 10 second delegations per arm in the pre-registration smoke sessions" cannot be met: the smoke runs only arm R, one session per task, mostly on single-delegation prompts, and G1 to G3 (the two-stage tasks built to produce a second delegation) are not in the smoke. It is also unclear whether the minimum applies to the smoke or to the gate subset itself.
  Fix: Count the minimum on the gate subset's own RS and D sessions, or run G1 to G3 in the smoke in both arms.
- (Instrument 2 measures against the labels) "The final allowed delegation and its agreement" needs labels, but G1 to G3 and FD1 to FD6 have none. It is also unclear which workflow candidates count as "labeled haiku or sonnet": D15 (sonnet reviewers, unlabeled merger), and D14 and R6 (haiku or sonnet finders with opus gate sites).
  Fix: Label G1 to G3, state that FD tasks are scored only on recovery, and list the Instrument 2 task membership explicitly.
- (Tasks, prompt rule list "(D10, D13, D16, D25, N4, X3)") R3 names a tier ("A sonnet subagent at high effort"). Its table row says "names a tier (echo disagrees)" and it appears in the heuristic-scorer list, but it is missing from the list excluded from the M1 and F3 denominators.
  Fix: Add R3 to the list.
- (Texts, P bullet and M1 ("patch tasks (D16, D25)")) D16 and D25 name a tier, so they are already excluded from M1, and "M1 with and without the patch tasks" changes nothing. D7, an anchor that names no tier and asks for a unified diff patch, is the patch task that actually enters M1 under P's TDD sentence.
  Fix: Define "patch tasks" as D7 (plus any untiered patch tasks), or drop the with-and-without split.
- (Tasks, "Tasks whose label contains the session model (D10, D11, D12, D25, R1, R3, R4, N3)") The list omits D14 and R6, whose gate sites are opus, and D4's opus sensitivity label. It is also Opus-specific: under the Fable transfer, the session model is fable and D13 and N4 qualify instead. Whether an omitted `model` on an `agent()` site scores as the session model or as "not a literal" (non-agreement) is not stated.
  Fix: Complete the list per session model, and state the scoring of an omitted model at a Workflow site.
- (Measurement, Workflow role rule against D15's label and D14's label) The generic rule makes every post-fan-out site that consumes results a gate site, which includes D15's merger. D15's label scores the merger for naming only, and gives the reviewers "high, every site". D14's label defines gate sites as sites that "review beyond the findings", not as sites that "consume results". "The last site in text order is the fallback" does not say what it falls back from.
  Fix: Make the role rule defer to per-task labels, give the merger its own role, and define when the fallback applies.
- (Effort band rule against the labels for D22) The rule is "below the band agrees; above does not". D22's label "sonnet; medium (high agrees)" makes above-band agree, an exception the rule does not register.
  Fix: Either list per-task exceptions in the rule or make D22's band "medium to high".
- (Fixture: banned-string check against tools/sweep.js (FD4 to FD6) and test/) The fixture copied into every session is asserted to contain none of the four model names or `agent`. tools/sweep.js is a workflow script with `agent()` calls whose model values come from a shared options object, so it must contain both. The fixture's own test suite asserts each planted property ("three planted disagreements", "nine to fourteen lines") and sits in test/, which R5 inventories and every orchestrator can read. That leaks answers and may also trip the banned list.
  Fix: Put sweep.js in an FD-only overlay, as with D13's review, and keep the property tests outside the copied fixture tree.
- (Property list against task tables) Rows are missing for anchors D7 (release.js and util.js), N3 (config/rules.json) and N6 (publish.js), for R5 (test files), G3 (CONFIG.md listing env vars) and R3 (GUARD.md row omits R3), and for the docs-count tasks D2, X2 and X3. The list claims to cover "every primary and anchor task". N4's prompt presupposes a fuzzer-found defect in validate.js, while the D12 and N4 row says the unsigned path is closed.
  Fix: Add the missing rows, and state N4's presupposed defect or note that the prompt alone carries it.
- (Label audit claims: limits table row and Tasks paragraph, against REVIEW-LEDGER round 2 and tasks-v1-prompts.md) v2 says "Three fresh labelers labeled every task" and that the labels "matched the author's model set on every one of the 24 tasks". The ledger says the author's set was chosen by at least two of three, and by all three on only 21. The audited wordings were v1: D16 was a different task (a --quiet patch on publish.js), and D5 and D8 were on validate.js with different fixes. D3, D10, D12, D13, D23, D25 and X3 were reworded. R1 and R3 to R7, G1 to G3 and FD1 to FD6 were never labeled.
  Fix: State "24 v1 tasks; unanimous on 21; v2 wordings and R1, R3 to R7 unaudited", and list which tasks the re-audit covers, including G tasks and anchors.
- (Tasks paragraph ("same handout plus the property list") against Pre-registration step 4 ("SKILL.md, prompts, property list")) The first audit's handout included the fixture description. Step 4 lists only SKILL.md, the prompts and the property list.
  Fix: Name one handout file and hash it.
- (Pre-registration step 7 (owner sign-off on the token) against steps 2 and 3, and H2) The token is needed for the warm-up session, every probe (I1 "with the token"), the smoke and the screen, all of which come before step 7. The total-cost ceiling is likewise signed only after about 250 or more pre-registration sessions (probes, smoke, screen, I10) have been spent.
  Fix: Move the token, and a pre-registration spend ceiling, to step 0.
- (Probe ordering: I2 ("with the main run's exact flags") against I6 (the fork setting), I7 and I10) I6 decides `CLAUDE_CODE_FORK_SUBAGENT`, which changes the Agent schema that I2 inspects, but both run in step 2 with no order. I10 can change the level and re-probes only I2, although I7's cap ("at the chosen level"), I4 and I5 were measured at the old level. I2's rule ("highest level at or below xhigh") is deterministic, so I10's "one level up or down" either overrides it (up from xhigh is max, which I2 excludes) or has nothing to choose.
  Fix: Order I6 before I2. Say which probes re-run on a level change, and state that I10 overrides I2's rule and within what range.
- (Version or Agent-definition mismatch: Harness (runner refuses launch), Failure table (excluded, one re-run) and Execution health check (stop and close the chunk)) Three treatments are given for one event. The runner cannot know the Agent-definition hash before launching, since the hash is read from the session's own JSONL. The Fable transfer sessions may legitimately carry a different definition from the Opus probes' value.
  Fix: Use one rule: a post-hoc check, an exclusion, and a chunk stop after N occurrences. Probe the Fable definition separately.
- (Measurement, first delegating turn (canary rule) against the Failure table and E1 sensitivities) A first delegating turn after a canary Skill call is a non-match under intention to treat and is excluded per protocol. This exclusion appears neither in the failure-handling table nor in E1's sensitivity list.
  Fix: Add a row and a sensitivity.
- (Failure table against Instrument 1 and 2) Several events have no row: the transcript tool_use blocks disagree with the batch record ("must match call for call"); the batch record is missing but no worker ran; a budget-cap ending after the first delegating turn in Instrument 2 ($4 cap); a second infrastructure fault on the single re-run. "Harness error" in the health check is undefined relative to "infrastructure fault".
  Fix: Add the rows, and define "harness error".
- (Instrument 1 (no timeout or turn limit) against Failure table "turn limit, timeout") The failure table cites a turn limit and a timeout, but v2 gives no `--max-turns` value and no Instrument 1 timeout. Only Instrument 2's 900 s is stated.
  Fix: State both values for Instrument 1.
- (I5 fallback against the scored set and M3) If PostToolBatch does not fire after denied calls, the scored set becomes the first call only and every-call labels become descriptive. D8 (M3's second planted task, labeled "every call") would then leave M3, and "every label is scored on the whole set" would no longer hold. Neither consequence is stated.
  Fix: State the fallback's consequence for D8 and M3, and for the D1, N5 and R7 multi-call scoring.
- (I2 decision ("D13, N4 and the fable rows leave the bank") against the Transfer subset and I8) "The fable rows" is undefined. Whether the Fable-orchestrator transfer subset and I8's fable alias still run when fable is absent from the enum is not stated, and M3 would then rest on D8 alone.
  Fix: Define "the fable rows" and state these consequences.
- (Planted tasks: the D8 condition against the D13 condition) D8 counts if the R and A0 screen rates are "at most 2 of 8". D13 says "same condition", then "only if R and A0 miss it in the screen", which could mean 0 of 8 or a majority miss.
  Fix: Use one phrasing for both.
- (Twin block against the screen) Twins for D5, D14, D15 and D13 run in R and RS at 3 runs whatever the screen shows. If the plain wording leaves the primary set (anchor or sensitivity), the twin block's purpose (bounding recognition in E1) no longer applies, and no rule covers it.
  Fix: State the twin block's fate when its plain task is screened out.
- (Pre-registration step 2 "(and I5's cap check)") The cap's terminal behavior is already part of I5, so the parenthesis is redundant. It also implies a separate probe that the probe table does not list.
  Fix: Delete the parenthesis.
- (REVIEW-LEDGER rows CL3 (round 1) and B05 (round 2) against v2) The ledger records CL3's consistency check (Instrument 2's first delegations should match Instrument 1's) and B05's D16/D25 difference-in-differences as adopted. Neither appears in v2's Descriptive list or anywhere else in v2. The round-1 A10 residual (a denied launch still yields the script) is also not in Limits.
  Fix: Add them, or mark them not adopted in the ledger.
- (Statistics stated once ("Alpha 0.05 two-sided") against M3 ("one-sided")) A global two-sided rule is stated, and M3 departs from it without being listed as an exception. The sidedness of M1, F1, F2, F3 and E2 is unstated.
  Fix: Give the sidedness per endpoint.
- (Size table, gate subset "(about 10)" and the probe and worker counts) The haiku- and sonnet-labeled candidates are D1, D3, D4, D5, D15, D16, D22, D23, R5 and R7 (10), plus G1 to G3, which gives up to 13 before the screen. "About 56 run a worker" leaves out I5's and I6's worker-running probes and any repeat of I2 or I10 after a level change. The probe cost of $5 to $10 includes I8's opus and fable full executions, which attempt 1 priced at $1.4 to $5.8 each.
  Fix: Recount after the screen rule, and price I8 separately.
- (Execution: two senses of "smoke" and three of "canary") "Fixture smoke" (26 full-execution sessions) and "smoke run of one case per arm" (step 9) are different blocks under the same word. "Canary" names the I1 loader string, the /delegation-tiering:canary command and the published README string.
  Fix: Rename them, for example "property smoke" and "launch smoke", and "loader canary", "canary command" and "leak canary".

## Undefined terms or procedures

- "Loader-printed file list" and "loader-printed paths" (Harness I1; Failure table; Mediators): v2 never says where in the stream-json or JSONL this list appears, or what format it takes.
- "The flag cache and identifiers" copied from the warm-up session (Harness H2): the files are not named, and identifiers normally live in .claude.json, which v2 says is never copied.
- "System variables" in the child-environment allowlist (Harness H2): not enumerated.
- "Stamps xhigh" and "stamped effort per turn" (I2; Per-session record): the transcript field is not named.
- "First delegating assistant turn" against "batch" (Instrument 1; Measurement): how a turn maps to JSONL assistant messages and to PostToolBatch batches when a turn holds more than one batch.
- "Resolve as in attempt 1" for a const string and a named options object (Measurement, Named a model): the rule lives only in attempt 1's analyze-full.js.
- "Union label", "sensitivity label" and "label-dependent" (E1 sensitivity; Decision rules; D4): which tasks carry two labels in v2 is not listed.
- "The union band for a model outside the label" (Measurement, Effort band).
- "Headroom condition" (M3): the D8 and D13 phrasings differ.
- "Anchors' specificity met" and "no increase in over-provisioning" (Anchors; Decision rules): no statistic or threshold is given.
- "Breadth met" when T is very small (E1).
- "Per-rule rows" (Endpoints estimand paragraph; Decision row 5): never specified.
- "Signed tier-shift", "list-price cost-delta" and "weighted by the owner's organic surface mix (workflow 47%, Agent 4%)" (Descriptive): no price table source, and no weighting rule for the remaining 49%.
- Purpose of the "registered heuristic scorer" (Measurement, Model agreement): no endpoint uses it.
- "Tier rationale (a model name and a reason clause in one sentence)" (Mediators): no coding rule for "reason clause", though "every rule is applied by code".
- FD outcome classes "argued" and "stopped", and X3's "the new prompt's difference" (Instrument 2; Text-gap block): no coding thresholds.
- "Second orchestrator-level delegation differs in tier from the first" when either delegation is a multi-call batch or a Workflow launch (Instrument 2).
- "Harness error rate" and "observer-record rate" (Execution health check), and what "stop" entails (resume or abort).
- "Complete task blocks" and the randomization block unit (Execution; Decision rules): v2 says a block is over (task, arm, run) but never defines it.
- "Exact lower 95% bound" (M2): the method (for example Clopper-Pearson) and the session population (all RS sessions, or primary only?) are not named.
- "Exact stratified test" for M1, F3, M3 and E2: the statistic and sidedness are stated only for E1.
- "Coverage checked in the registered power script" (E1 interval): no acceptance criterion.
- Beta-binomial prior "fitted to all candidates" (Statistics): no fitting method.
- "The fable rows" (I2 decision).
- "Fallback" in the Workflow role rule ("the last site in text order is the fallback").
- "Skill-listing length" (Mediators): characters, tokens or entries.
- Label-audit agreement rule for multi-role labels (D14, D15, R6) and for effort bands: what counts as "unanimous model sets".
- "Opaque path of fixed length" and the neutral plugin-directory name (Harness H2; Texts): no values given.
- "Patch tasks" (Texts P; M1): defined as D16 and D25, which conflicts with D7.

## Re-run gaps

- v2 gives no settings.json contents: the hook commands and scripts, the matchers, the fixed deny reason and the fixed `stopReason` text, which are hashed but never printed.
- H1 fallback: its differences are only "listed in v1 and apply unchanged", so a reader with v2 alone cannot run H1.
- The fixture exists only as a layout and a partial property list. There are no rows for D7, N3, N6, R5, G3, D2, X2 or X3, and nothing says which file contents satisfy them. The published fixture is required.
- The Workflow-site resolution rule (const strings, named options objects) depends on attempt 1's analyze-full.js. The Agent-only-response-on-a-workflow-task rule (attempt 1: non-match) is not restated in v2.
- There are no Instrument 1 timeout and max-turns values. The per-session budget for Instrument 1 is only "three times the maximum I7 cost", and no rule covers the Fable transfer sessions, which cost about 2.5 times Opus.
- The label-audit instructions, output schema and the coding of each labeler's answer are not given (only the model, the effort and the handout).
- There are no labels for G1 to G3 (needed for "final allowed delegation and its agreement"), and no labels or scoring for FD tasks beyond the outcome classes.
- Run allocation for the sensitivity set, for screened-in anchors and for disputed tasks moved to the text-gap block is missing. The size table cannot be rebuilt for any screen outcome other than the assumed one.
- There is no procedure when the level changes after I10: which probes re-run, how the cap is re-derived, and how I10 itself is repeated.
- There is no procedure after a mid-run version or Agent-definition change beyond "stop and close the chunk": no re-probe, stratum or resume rule.
- Rate-limit and infrastructure re-runs do not say whether they keep their run index, seed position or wording, or what happens when the single re-run also fails.
- The test and sidedness for M1, M3, E2, F1, F2 and F3, the M2 bound method, and the TOST mechanics for F2 are unstated. Only E1 is fully specified.
- The power-grid script's prior fit and coverage acceptance criterion are absent, and the script itself is only promised.
- Owner decisions are open: the bound (or an action-threshold replacement whose branch-table rows are unwritten), the cost ceiling and the token. The token is needed before any probe can run.
- The decision table cannot be applied mechanically for a negative F1 or F2 or for overlapping rows (see inconsistencies).
- The I1 canary string, the warm-up session's prompt and procedure, and the location of the "loader-printed file list" are not given.
- Whether Agent, Read, Glob and Grep run without pre-approval under `--permission-mode dontAsk` with `--allowedTools "Skill Workflow"` is assumed, not stated. Only I1's tool-list check and I8's full execution would reveal it.