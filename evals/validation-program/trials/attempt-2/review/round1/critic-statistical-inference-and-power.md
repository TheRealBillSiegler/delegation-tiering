# Critic lens: statistical inference and power

Verdict: As written, the endpoints can change only the decision about the rule, and that decision is already supported: the floor endpoint (R minus P) will almost certainly be significant. Even there, the specificity rule would misread an imprecise placebo check as 'any loaded rule does it' about 95% of the time. For the skill: under the draft's own assumed effect, the judgment endpoint has 0.22 to 0.29 power and the likeliest outcome is 'inconclusive' (77%). At attempt-1-sized effects, significance cannot be reached at all. The 'no material increment' branch fires mainly when the task bank fails to diverge. For the gate and the belief question, the designed contrasts can only return nulls: about zero denials are expected, and naming is at ceiling in both belief arms. The fixes are: a stratified exact test; testing in a fixed sequence instead of Holm; about 32 or more divergent tasks, or 4 runs per cell with arm D pooled into RS; a bound stated in task counts; predictions tested against R; and a forced-denial probe for the gate.

## Attacks

### S1 [KILLS] target: Size; Endpoints 2-3 (attainable significance at attempt-1 effect sizes)

Attack: For the exact two-sided sign-flip test on a sum, the smallest attainable p is 2^(1-n), where n is the number of tasks with a nonzero difference: n=5 gives 0.0625, 6 gives 0.0313, 7 gives 0.0156, 8 gives 0.0078. Under Holm, the floor endpoint is almost certain to be rejected first, so judgment-model is then tested at 0.025 (or at 0.05 only if effort is rejected first). Reaching 0.025 needs at least 7 tasks moving the same way with none moving against. Attempt 1 moved one task of 13 (T15). Text-only already agreed on 11 of 13, and the skill did not fix the workflow-verifier miss (T19, which is T20 here). If the skill moves 1 to 3 tasks deterministically, p is at least 0.25. Simulated with the exact DP sign-flip and 4,000 reps: 3 tasks moving 0 to 1 with the rest at ceiling gives 0% significant and 100% inconclusive; 4 tasks moving 0.3 to 0.8 with the rest at 0.85 gives about 4% significant. At the effect size attempt 1 actually showed, significance is out of reach by arithmetic.

Required edit: Enlarge the divergent bank until the smallest effect the owner would act on yields at least 7 (preferably 10 or more) moving tasks. Otherwise state in Size that the trial detects only an effect that moves at least 7 of 16 tasks the same way, and that any smaller effect, attempt 1's included, ends inconclusive by construction.

Evidence: PROTOCOL-v0 lines 151-155 and 173. FULL-RESULTS lines 65, 70 and 190: one task moved, exact p 1.0. Computed p floors and Holm thresholds of 0.0167, 0.025 and 0.05. Node simulation with seed 20261011.

Checkable: With n=6 nonzero task differences the smallest two-sided sign-flip p is 2/64 = 0.03125, which is above Holm's 0.025 second-step threshold.

### S2 [KILLS] target: Size: the power simulation and its assumptions

Attack: The registered assumption fails the draft's own 0.8 criterion at 16 tasks by 2 runs. The assumption is that agreement goes from 0.3 to 0.8 on half the divergent set and the rest is unchanged. Sign-flip power at alpha 0.025 is 0.29 with the unaffected tasks at ceiling, 0.22 with them at 0.85 and 0.18 at 0.5; at alpha 0.05 it is 0.55, 0.36 and 0.29. Reaching 0.8 needs about 40 tasks by 2 runs: 32 tasks give 0.69 and 48 give 0.92. The inputs are also incoherent or unsupported. (a) The pilot's run-to-run variance in tier is zero: 20 of 20 cells chose the same tier in both runs, on 5 obvious tasks at medium effort. Batch 1 had one run per cell. Attempt 1 therefore supplies no within-task variance for non-obvious tasks. (b) A Bernoulli rate of 0.3 or 0.8 already fixes the within-task variance, so 'observed run-to-run variance' is either redundant or implies an overdispersion model the draft never states. (c) The rate on unaffected tasks is not specified, yet it moves power from 0.29 to 0.18. (d) The 0.3 baseline for R contradicts attempt 1. There, text-only chose sonnet, the label, on the fix re-verification and re-gate analogs of T08 and T09, which the draft predicts at opus.

Required edit: Register the generative model in full. Draw R's per-task rate from a distribution anchored on attempt 1 B's per-task outcomes, use within-task Bernoulli draws, and set the number of affected tasks k to 2, 4 and 8 with stated shifts. State the rate on unaffected tasks and the test and alpha actually used (0.025 under Holm). Report the whole grid and size to the smallest effect that would change the decision. If 0.8 is out of reach at an affordable size, state which effect has 0.8 power.

Evidence: PROTOCOL-v0 line 177. PILOT-RESULTS lines 90-109: every cell reads 'haiku 2', 'sonnet 2', 'opus 2' or 'omitted 2'. FULL-RESULTS line 9 (one run per cell) and lines 136 and 139 (B chose sonnet on T09 and T12). Simulation grid of 2,000 to 4,000 reps per cell.

Checkable: Every one of the 20 task-by-setup rows in PILOT-RESULTS lists a single first tier with count 2, so the pilot shows zero within-cell disagreement on model.

### S3 [BOUNDS] target: Endpoints: the unit of analysis (two runs averaged to a task share, sign-flip over tasks)

Attack: Averaging two runs to a share in {0, 0.5, 1} and sign-flipping over tasks is valid: simulated size was 0.003 to 0.009 at a nominal 0.025. It wastes the run-level information, though. The attainable p depends only on how many tasks have a nonzero difference, so extra runs cannot lift the p floor. An exact stratified permutation test tests the same sharp null on the same conditional-on-bank basis. It permutes arm labels among each task's 2+2 runs, uses RS successes as the statistic, and is computed exactly by convolving per-task hypergeometrics. Power at alpha 0.025 under the draft's effect: 16x2 gives 0.41 against the sign-flip's 0.22 (unaffected at 0.85) and 0.66 against 0.29 (unaffected at ceiling); 16x4 gives 0.81 against 0.47; 32x2 gives 0.80 against 0.69. The bootstrap 'over tasks' also implies a population of tasks. The bank is hand-built, so the interval is conditional on these 16 tasks and is not a generalization.

Required edit: Make the primary test the exact stratified permutation test on run-level outcomes (arm labels permuted within each task), with the interval obtained by inverting that test. Keep the task-level sign-flip as a sensitivity analysis. State that both are inferences about this bank of tasks.

Evidence: Node simulation with exact DP for both tests: sign-flip versus stratified, 4,000 reps for 16 tasks and 2,000 for the larger banks.

Checkable: Under the sharp null with both arms run in every batch, a task's four run outcomes are exchangeable across arm labels, which is the only condition the stratified exact test requires.

### S4 [BOUNDS] target: Tasks and Endpoints: the divergent set defined by the author's predictions; what happens if half fail

Attack: The predictions are of the 'unaided' choice and are to be tested in A0 and P. Those arms mostly omit the model (attempt 1 A omitted it in 12 of 15 runs; the pilot in 10 of 10), and an omitted model scores as opus. On the 12 Agent tasks whose label excludes opus, divergence in A0 is therefore guaranteed. On T15 and T16 (label opus) agreement is guaranteed, and a workflow omission is a non-match. The 'hit rate' is fixed by the labels at about 14 of 16, whatever the model would have chosen. Endpoint 2's comparator is also R, not A0: R names a model and carries 'lowest tier sufficient'. If half the predictions fail in R (R already at the label), those tasks add zeros. Sign-flip power then falls to 0.000 (4 real movers going 0.3 to 0.8, 12 tasks at ceiling) and stratified power to 0.17. The diluted mean also pulls toward the 'no material' branch. The sensitivity analysis that drops failed tasks is biased if failure is read from R's own runs. Under a null with every task at 0.85, keeping only the tasks where R did not agree in both runs gives an expected RS-R of about +0.39 from regression to the mean.

Required edit: Restate each prediction as a prediction of R's choice. Test the predictions on data independent of the confirmatory contrast: a registered calibration run of R, or batch-1 R runs with the sensitivity test computed on batch 2 only. Drop the A0/P hit rate as evidence about the predictions. Keep the primary analysis on the full registered set.

Evidence: PROTOCOL-v0 lines 102, 140, 159 and 191. FULL-RESULTS line 151: A first tiers 'omitted(opus) 12'. Bias arithmetic: 0.85 - (0.255 x 0.5 / 0.2775) = 0.39. Simulation for the half-fail scenario.

Checkable: FULL-RESULTS lists A's first-delegation tiers as 'omitted(opus) 12, haiku 2, fable 1' out of 15.

### S5 [KILLS] target: Decision rules: the +/-0.15 material-difference bound

Attack: Origin: the bound is copied from attempt 1's protocol, and neither protocol derives it. Scale: on 16 tasks it equals 2.4 full-task flips. The 95% percentile bootstrap's upper bound passes 0.15 whenever a single task flips fully, because that task's resample count has a 97.5th percentile of 3, giving 3/16 = 0.19. 'No material increment' therefore allows at most about one half-moved task. Simulated with 2,000 reps: under an exact null with both arms at 0.85 on every task, the branch fires 5.9% of the time and the outcome is inconclusive 94% of the time. At 0.5 it fires 0%. It fires 100% only when both arms sit at ceiling, which is the case where the bank failed to diverge, and then it recommends shrinking the skill. On a rate scale the same effect is material or not depending on dilution: 4 fully moved tasks average 0.25 over 16 but 0.125 over 32. Requiring the 95% interval inside the bounds is TOST at 0.025, stricter than the usual 90%. Under the draft's own effect assumption the outcomes are significant 23%, inconclusive 77% and no-material 0.1%.

Required edit: State the bound in task units derived from the decision, for example 'the skill changes the first choice on at most 1 of 16 divergent tasks', and justify it from the cost of a mis-tiered delegation in the owner's mix. Test equivalence by TOST (a 90% interval) on the stratified estimator. Add a precondition: the 'no material' branch is available only if R disagreed with the label on at least k registered tasks. Below that, the outcome is 'bank did not diverge; no recommendation'.

Evidence: Attempt 1 PROTOCOL.md line 65. PROTOCOL-v0 lines 164-165. Binomial computation P(count<=2)=0.926 and P(count<=3)=0.985 for Bin(16, 1/16). Decision-outcome simulation.

Checkable: Neither PROTOCOL.md (line 65) nor PROTOCOL-v0 (lines 164-167) gives any source or derivation for the 0.15 figure.

### S6 [KILLS] target: Decision rules: 'the floor is specific to the rule' and the placebo-inertness secondary

Attack: Under the rule as written, the floor counts as specific only if R-P is significant and the P-A0 95% interval lies inside +/-0.15; otherwise it is 'read as an effect of any loaded rule'. The logic is wrong: a significant R-P already shows the rule beats a placebo, and P-A0 only splits R-A0 into specific and non-specific parts. The statistics make it worse. With P truly inert, the P-A0 interval over 23 tasks by 2 runs lies inside +/-0.15 only 4.6% of the time (uniform naming rate 0.2), 0.3% (rate 0.5) and 45% (bimodal: 5 tasks at 0.8, 18 at 0.05). The protocol would usually conclude 'any rule does it' from imprecision alone.

Required edit: Base specificity on endpoint 1 (R-P) alone. Report P-A0 with its interval as the non-specific component. If inertness is to be claimed, use TOST with a justified bound and write 'placebo inertness not shown' when it fails, never 'the floor is an effect of any loaded rule'. Remove placebo inertness from the Holm family, because it is an equivalence claim, not a test.

Evidence: PROTOCOL-v0 lines 157 and 167. Simulation of 2,000 reps with a 2,000-resample percentile bootstrap.

Checkable: PROTOCOL-v0 line 167 makes 'read as an effect of any loaded rule' the default whenever the placebo interval is not inside +/-0.15.

### S7 [FAILS] target: Endpoints: the three-test primary family under Holm

Attack: The charge is that putting the near-certain floor endpoint in a three-test Holm family spends alpha the judgment endpoints need.

Required edit: The charge fails because Holm with a member that is surely rejected first reduces to Holm on the rest. Attempt 1's B-A was +0.80 with p 0.0078 on 10 tasks and one run, so at 23 tasks by 2 runs the floor will be rejected at 0.0167, leaving judgment-model and judgment-effort at 0.025 and 0.05, exactly as a two-test Holm would. An available gain: a registered fixed-sequence order (floor, then judgment-model, then judgment-effort) gives judgment-model the full 0.05. That needs 6 unanimous movers instead of 7 and raises power under the draft's effect from 0.22 to 0.36 (unaffected at 0.85) and from 0.29 to 0.55 (at ceiling). The family-wise error rate stays controlled.

Evidence: FULL-RESULTS line 66. Holm thresholds for m=3. Simulation at alpha 0.025 and 0.05.

Checkable: Holm's step-down thresholds for three tests are 0.0167, 0.025 and 0.05, so once the floor is rejected first the remaining endpoints face 0.025 and 0.05.

### S8 [BOUNDS] target: Endpoint 3 (effort agreement, RS minus R, divergent set)

Attack: Only two divergent tasks are effort-divergent by design, T03 and T10. Line 132 names T01 as a third, but T01 is an anchor and not in the sixteen-task list; the model-divergent count is 10, not 9. Effort agreement is scored 'inside the label's band for the chosen model', so on the 14 model and shape tasks it moves whenever the model moves, and endpoint 3 mostly re-measures endpoint 2. As a separate claim about effort judgment it has at most 2 designed movers, so p is at least 0.5. Scoring 'omitted does not agree' also turns schema absence into disagreement: attempt 1 found the parameter in 0 of 129 xhigh transcripts.

Required edit: Define endpoint 3 conditionally: effort agreement among first calls whose model is in the label, scored only in sessions whose Agent schema carries 'effort' (the protocol already records this as a mediator). Either add at least 7 effort-divergent tasks or demote endpoint 3 to secondary. Correct the T01 count on line 132.

Evidence: PROTOCOL-v0 lines 106, 132, 142, 146 and 155. FACTS line 16.

Checkable: PROTOCOL-v0 line 132 lists sixteen divergent tasks without T01, then says 'three on effort only (T01, T03, T10)'.

### S9 [BOUNDS] target: Endpoints: the size and definition of the secondary family

Attack: The family has 11 defined contrasts: placebo inertness 1, belief 2, S-A0 1, D-R 1, over- and under-provisioning for two contrasts 4, gate final-delegation 1, denial count 1. On top of those come transfer (unclear whether it is in the family), 'skill invocation rate per arm' and 'delegation rate on T24 and T25 per arm', none with named contrasts. Attempt 1's deviation 10 shows the analyst then chose those contrasts after the fact. Holm's first threshold at m=11 is 0.0045, which needs at least 9 unanimous tasks. A delegation rate measured on two tasks has a sign-flip floor of 0.5 and can never be significant. The denial count is not a paired contrast, because RS has no gate. Placebo inertness is an equivalence claim. S-A0 model agreement mostly measures the omitted-equals-opus scoring rule, as attempt 1's C-A over-provisioning did.

Required edit: Name every secondary contrast exactly: arms, metric, task set and test. Cut the Holm family to at most 4 contrasts that can move. Move T24/T25, skill invocation, denial counts and transfer to descriptive, and take placebo inertness out of the family.

Evidence: PROTOCOL-v0 line 157. FULL-RESULTS lines 46 and 193 and deviation 10 at line 209.

Checkable: FULL-RESULTS deviation 10 records that attempt 1's secondary contrasts were the analyst's choice because the protocol named members but not contrasts.

### S10 [KILLS] target: Question 4 (belief) and its decision rule: R minus R-

Attack: R- keeps the sentence 'Every delegated agent ... gets an explicit model' and 'Never inherit the session model silently'; only the skill pointer and the CLAUDE.md row change. Named-model rate is therefore about 1.0 in both arms (attempt 1 text-only 13 of 13, pilot 10 of 10), and the naming contrast will have about zero nonzero tasks, giving p=1 and an interval of [0,0]. No mechanism is stated by which a gate claim would shift the chosen tier. The decision rule covers only 'significant', and the likely null cannot separate 'the belief does no work' from 'ceiling'.

Required edit: Test belief where naming has room to move: add an arm carrying only the gate claim (for example 'a PreToolUse hook denies any Agent call with no model') with no naming instruction, and contrast it with A0, whose baseline is about 0.2. Otherwise drop Question 4 as unanswerable by R versus R-. Either way, add a decision rule for a null result.

Evidence: PROTOCOL-v0 lines 14, 39-40, 49 and 168. FULL-RESULTS line 189. PILOT-RESULTS line 55. Rule text of ~/.claude/rules/delegation.md.

Checkable: PROTOCOL-v0 line 49 removes only the 'Tier ladder and rationale' sentence and reduces the CLAUDE.md row, so R- keeps the explicit-model instruction.

### S11 [BOUNDS] target: Size, batches and stopping: analyze after batch 2 only

Attack: Computing the endpoints once, after batch 2, is right for alpha, but the rule has three gaps. (a) It says nothing about a batch 2 cut short by the cost rule, which is exactly how attempt 1 ended (63 of 80 sessions, partial cells). (b) It does not say that the batch-1 health checks are computed blind to arm. (c) It wastes batch 1 on the one decision batch 1 can legitimately inform: blinded sample-size re-estimation from nuisance parameters (internal pilot, Wittes and Brittain 1990; Kieser and Friede 2003). That re-estimation would use pooled within-task disagreement, or the D/RS pairs, which are an A/A comparison under Instrument 1 (S14), and never look at RS-R. Given S2, the size is the weakest input, and batch 1 is the cheapest place to fix it.

Required edit: Add three rules. (1) If batch 2 is incomplete, compute the endpoints on tasks with complete R/RS pairs only and label the decision 'inconclusive by execution' whatever the p. (2) Compute the batch-1 checks with a script that emits no arm-level endpoint value. (3) Register a blinded re-estimation rule: after batch 1, estimate within-task disagreement from the D/RS pairs, rerun the registered power grid, and add runs up to a stated session cap. No RS-R value is computed before the final analysis.

Evidence: PROTOCOL-v0 line 173. FULL-RESULTS lines 7-10.

Checkable: PROTOCOL-v0 line 173 states no action for an incomplete batch 2.

### S12 [KILLS] target: Instrument 2: the gate subset (48 sessions, one run per cell) and the gate endpoints

Attack: The gate denies only calls that name no model. With the rule present, the first call named a model in 13 of 13 (B), 14 of 14 (D), 10 of 10 (pilot) and 247 of 247 organic calls. Orchestrator-level denials were 0 across 103 trial sessions. Expected denials in 16 D sessions are therefore about 0, giving a one-sided 95% upper bound of 1 - 0.05^(1/16) = 0.171 per session. That is weaker than the organic audit (163 sessions, 4 denials, all false positives fixed in 0.1.2). Retries after a denial cannot be observed without denials. D-RS on the final delegation with one run per cell has differences in {-1, 0, 1} and, under a secondary Holm with m of at least 11, needs at least 9 unanimous tasks. The one live mechanism is 0.1.2's allow-path reminder possibly prompting a re-delegation, and no endpoint isolates it. The cost is 48 sessions at attempt 1's full-execution rate, about $0.97 each list price.

Required edit: Replace the subset with two measurements. (a) A forced-denial probe in D only: tasks that elicit the lint's documented false-positive class (a model passed through a variable or a shared options object) or an instructed omission, measuring retry, recovery turns and cost per denial. (b) An allow-path-reminder measure: the rate at which a second delegation differs from the first, in D against RS. Take the denial rate from the organic audit, not from 16 sessions.

Evidence: PROTOCOL-v0 lines 74, 157 and 174. FULL-RESULTS lines 48 and 194. FACTS lines 31, 43 and 49. SKILL-0.1.2 line 68 (variable-passed models are flagged).

Checkable: Attempt 1 recorded 0 orchestrator-level gate denials in 63 batch-1 sessions and 0 in 40 pilot sessions.

### S13 [BOUNDS] target: Orchestrator model: the transfer subset's descriptive-only status

Attack: The owner runs Fable at max, the decision concerns the owner's sessions, and the primary is on Opus. The transfer subset (one run per cell, 25 tasks including 7 anchors and 2 exploratory tasks) has power of about 0.10 to 0.17 for the draft's assumed effect even on the 16 divergent tasks, from the one-run simulation. 'Whether the Opus results hold' is a model-by-arm interaction, which needs several times the sample of the main effect. Calling it descriptive is honest, but with no stated criterion for 'holds' any pattern can be read as transfer. Under Instrument 1, D is equivalent to RS (S14), so the subset actually measures Fable RS-R.

Required edit: Pre-state a descriptive transfer criterion: on the tasks where Opus RS-R is nonzero, count how many have the same sign on Fable, and how many have Fable R already at the label. Restrict the subset to the divergent set. Add to Limits that the decision applies to Opus 5.5 at the trial's effort and that transfer to Fable at max is untested.

Evidence: PROTOCOL-v0 lines 93, 157, 175 and 189. One-run simulation: sf 0.095 at 0.025 and 0.173 at 0.05.

Checkable: PROTOCOL-v0 gives no criterion for when the Opus results 'hold' on Fable.

### S14 [BOUNDS] target: Components and arms: arm D under Instrument 1, the D-R secondary and the transfer arms

Attack: 0.1.2's hooks.json declares only PreToolUse and PostToolUse hooks on Agent|Workflow, with no SessionStart or UserPromptSubmit hook. Under capture-and-stop, the first call's input is formed before any hook runs, and the skill text (Enforcement section included) is present in both RS and D. D and RS therefore give identical context up to the measured choice, which makes D against RS an A/A comparison. The 'D-R' secondary duplicates endpoint 2, and D's 50 sessions add no new estimand. Pooling D with RS raises stratified power for endpoint 2 from 0.42 to 0.63 under the draft's effect, and reallocating D's sessions to 3+3 runs gives 0.66.

Required edit: Relabel D under Instrument 1 as an A/A replicate of RS. Register either pooling, after the parser confirms no hook output preceded the first call, or reallocation of D's sessions to R and RS. Use the D/RS disagreement as the null-variance estimate (S11). Drop 'D-R' as a separate secondary under Instrument 1.

Evidence: scratchpad/attempt2/hooks-0.1.2.json. PROTOCOL-v0 lines 42, 66-70 and 157. Stratified simulation with unequal runs, 3,000 reps.

Checkable: hooks-0.1.2.json declares only the PreToolUse and PostToolUse events.

### S15 [BOUNDS] target: Endpoints: the estimand, a mean over a constructed bank

Attack: The mean over 16 hand-built tasks weights each task equally, and the bank holds 10 model, 2 effort and 4 shape tasks, so the mean is a property of that mix. The keep-or-move decision depends on how often such situations arise in the owner's delegations. Workflow workers took 47% of spend and direct Agent subagents 4%. The bank over-represents divergent situations by design, so a significant mean does not size the skill's value, and a null over 16 tasks does not bound it in the organic mix.

Required edit: Make per-rule results (per task row and per ladder rule) the primary presentation of what moved. State that the mean is conditional on the bank's composition. If the decision needs a magnitude, weight tasks by the organic frequency of their rule from the audit and say so.

Evidence: PROTOCOL-v0 lines 132 and 163-164. Validation-program README lines 45-48 and 56.

Checkable: The validation-program README states that direct Agent subagents took 4% of list-price spend and workflow workers 47%.
