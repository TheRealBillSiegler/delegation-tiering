# Critic lens: statistical inference in v1

Verdict: The rebuilt core holds: the exact stratified test keeps its size (0.030 at nominal 0.05 with doubling, matching v1's claim), and at 12 tasks x 6 runs it has 0.84 power for v1's sizing effect (+0.5 on half the set) under the author's predictions. Under a prior with half the candidates truly at ceiling, which is an assumption motivated by attempt 1, that drops to 0.71.

The branches around the core do not work as registered. Eight attacks KILL, ten BOUND, one FAILS. Ordered by consequence:

1. Arm RL runs at 2 runs per cell, so 'the tables carry the increment' cannot be returned: the TOST passed in 0 of 4,000 simulated runs. Raising RL to 6 runs costs about 48 capture sessions (about $4 to $6).
2. D13, the planted control for M3, sits in E1's set. It quadruples E1's rejection rate under weak diffuse effects (0.049 to 0.205), so the 'keep the skill' verdict can come from the instrument check itself.
3. The interval E1 and the TOSTs need ('by inverting the same test') is undefined for a binary outcome.
4. M2 overrides a significant positive result, and at its own threshold it is a coin flip.
5. The anchor expectation of +/-0.10 at 2 runs fails from noise 69% to 89% of the time.
6. The 'blinded' re-estimation is not blind: the halfway leak correlates 0.72 with the final estimate, because the screen's R rates are known. It also has no grid parameter to update.
7. F4 conditions on naming, a post-treatment variable.
8. The screen admits any task short of 4 of 4, so truly-0.7 tasks enter 76% of the time.

The bounds that follow: regression to the mean biases no estimate but lowers power, so 'conservative' is the wrong word. Power at the owner's material bound of 0.15 is only 0.39 to 0.41. A true null at 12 tasks ends inconclusive about 77% of the time. Twin wordings must be stratified, because unbalanced alternation gives the pooled test a size of 0.155. E2 is likely at ceiling (the pilot's rule-only arm named effort on 10 of 10). F1, F2 and E1 carry two degrees of freedom and should be gatekept after E1, not Holm-adjusted. The transfer count needs a null reference (about 0.3 per task).

M1 is safe. Its only risk is reading a baseline shift as an instrument failure.

Script: Node 26 read from stdin, so no file was written. Seeds are mulberry32 20261011 to 20261014. The exact stratified test convolves per-task hypergeometric pmfs of RS successes given each task's total, with two-sided p as twice the smaller tail. The sign-flip test is exact enumeration. In the generative model, candidates' true R rates come from v1's 18 predictions ('author'), or from 50% U(0.85, 1) plus 50% the predictions ('calibrated', an assumption). The screen is Bin(4, p), admitting at 3 or fewer, and the main run uses fresh binomial draws. The TOST interval is a Wald interval on the mean of task differences, with cell variance from (x+0.5)/(n+1). Runs use 3,000 to 20,000 reps per cell. The source is reproducible from these definitions; it was piped, not saved, as the task forbade writing files.

## Attacks

### S2-01 [KILLS] target: The screen (v1 line 166) and the target-state row (line 24): admission at R agreement <= 0.5, anchor at >= 0.8, flagged between

Attack: At four runs the only observable R rates are 0, .25, .5, .75 and 1. Under the rule as written, 0 to 2 of 4 enters the primary set, 3 of 4 enters it flagged, and only 4 of 4 becomes an anchor. The effective admission rule is therefore 'any miss in four runs', not the 'misses at least half the time' that line 24 promises. A truly-0.7 task enters the primary set 76% of the time (35% unflagged, 41% flagged), a truly-0.8 task 59% and a truly-0.9 task 34%. 'Flagged' has no registered consequence in any endpoint, so the flag changes nothing.

Required edit: Choose one and register it. (a) Flagged (3 of 4) tasks are excluded from E1 and appear only in a sensitivity analysis; line 24 is rewritten to 'at most two of four R runs agree'. (b) Or screen at 8 runs, admitting at <= 4 of 8 and flagging (excluding from E1) at 5 or 6 of 8. This admits truly-0.7 tasks 19% of the time and truly-0.9 tasks 0.5%, at a cost of 72 more capture sessions (about $6.5 to $9.4 at v1's per-session cost).

Evidence: Binomial: P(<=2/4 | 0.7) = 0.348, P(3/4 | 0.7) = 0.412, P(4/4 | 0.7) = 0.240; P(4/4 | 0.9) = 0.656; P(<=2/4 | 0.5) = 0.688. At 8 runs: P(<=4/8 | 0.7) = 0.194, P(<=4/8 | 0.9) = 0.005, P(<=4/8 | 0.5) = 0.637. v1 lines 24 and 166.

Checkable: Under Bin(4, 0.7), P(at most 3 agreements) = 1 - 0.7^4 = 0.760, so under line 166 a task whose true R agreement is 0.7 enters the primary set (flagged or not) 76% of the time.

### S2-02 [BOUNDS] target: Line 166: 'Regression to the mean makes this selection conservative for RS minus R'

Attack: R is re-measured on fresh sessions and RS is never selected on, so regression to the mean biases no endpoint: main-run RS-R is unbiased for the screened bank. What regression actually does is twofold. First, main-run R sits above the screen's R among admitted tasks (0.447 to 0.485 under the author's predictions; 0.505 to 0.578 under a prior with half the candidates truly at ceiling). Second, false-divergent tasks (true R >= 0.85) make up 2% or 24% of the admitted set, which dilutes expected RS-R and lowers power. That is a power loss, not a conservative estimate. In the other direction, the selection enriches headroom relative to the candidate bank, which is anti-conservative for any bank-wide reading (line 210 states the estimand, so this part is handled). It also selects on label idiosyncrasy: R misses where the author's label is a minority reading of the skill, and RS misses more on those tasks too, because p_R and p_RS correlate across tasks through label clarity. 'RS is unaffected by the selection' therefore holds for sessions but not for task-level rates. The order of the label audit and the screen is unstated, and admission depends on which label scores the screen.

Required edit: Replace the sentence with: 'R is re-measured in the main run, so the screen biases no estimate. Regression to the mean puts main-run R above the screen's estimate and lowers headroom; the power grid accounts for this by drawing R from the posterior given each task's screen count.' Register that the label audit precedes the screen, that the screen scores the author's label, and that admission under the union label is reported per task.

Evidence: Node simulation, 200,000 candidates, seed 20261011. Author prior (true R drawn from v1's 18 predictions): 0.893 admitted; mean screen R among admitted 0.447, mean true R 0.485. Calibrated prior (an assumption: 50% U(0.85, 1), 50% the predictions, motivated by attempt 1's B agreeing on 11 of 13): 0.578 admitted; screen 0.505, true 0.578; 24.2% of admitted tasks have true R >= 0.85.

Checkable: v1 line 166 says 'Screen data enter no endpoint', so main-run R is computed on sessions disjoint from the selection, and the selection cannot bias the RS-R estimate for the admitted set.

### S2-03 [BOUNDS] target: Statistics stated once (line 224): the power grid's inputs, the sizing criterion, and the orientation figures

Attack: (a) Drawing R rates 'from the screen' plugs in estimates that regression pulls down, so the grid overstates power. For +0.25 on every task at 12 x 6, it reports 0.924 against 0.852 (author prior) and 0.940 against 0.829 (calibrated). (b) The sizing criterion, +0.5 on half the set, is a mean effect of 0.25, which is 1.7 times the material bound of 0.15 the decision rules use. Power at a mean effect of 0.15 is 0.39 to 0.41 at 12 tasks x 6 runs, 0.53 to 0.54 at 8 runs and 0.63 at 20 x 6, so no affordable cell reaches 0.8 at the bound. Effects between 0.15 and 0.25, the ones the owner calls material, mostly end inconclusive. (c) At the design point, 12 x 6 gives 0.835 under the author prior but 0.706 under the calibrated prior, so six runs meet v1's own criterion only if the predictions hold, and attempt 1 found them too pessimistic. (d) The orientation figures (0.41 at 2 runs, 0.81 at 4) are round 1's at alpha 0.025 with 16 tasks and unaffected tasks at 0.85; v1 quotes them beside alpha 0.05 without saying so.

Required edit: Draw each task's R rate from a beta-binomial posterior given its screen count, with the prior fitted to all candidates' counts. Report power at mean effects 0.15 and 0.25. Add: 'At T tasks x 6 runs, power at the material bound is X; an effect between 0.15 and 0.25 is more likely to end inconclusive than significant.' Restate the orientation figures with their alpha and rates, or drop them.

Evidence: Exact stratified test (two-sided by doubling) in 3,000 reps per cell, seeds 20261011 and 20261014. True rates versus the naive grid at 12 x 6: author prior, +0.5 on half 0.835 vs 0.823 and +0.25 on all 0.852 vs 0.924; calibrated prior, +0.5 on half 0.706 vs 0.767 and +0.25 on all 0.829 vs 0.940. Mean effect 0.15: T12 r6 0.41/0.39, T12 r8 0.53/0.54, T16 r6 0.52/0.51, T20 r6 0.63/0.64, T20 r8 0.76/0.76.

Checkable: round1/critic-statistical-inference-and-power.md (S3) gives 0.41 and 0.81 as 'Power at alpha 0.025' with unaffected tasks at 0.85. v1 line 224 quotes the same numbers in a section that sets 'Alpha 0.05 two-sided everywhere' and names neither condition.

### S2-04 [KILLS] target: E1 set membership (D13 and its twin among the candidate primary tasks, line 134) and the positive decision rule (line 214)

Attack: E1's null is the sharp null on every session, so rejection shows that at least one task moved, not that the bank moved. D13 is M3's planted positive control: a rule present only in the skill, with P(R agrees) 0.2. It sits in the candidate primary set and passes the screen with probability near 1. At 12 x 6, with D13 moving from 0.1 to 0.95 and +0.15 on three other tasks, E1 rejects 0.205 of the time with D13 and 0.049 without it. The pilot showed near-deterministic behaviour (20 of 20 cells unanimous). Under that behaviour, a single 0.03-to-0.97 mover among 12 tasks rejects E1 0.459 of the time (size with no mover 0.006). The verdict 'the skill transmits judgment the rule lacks; keep the judgment layer' can therefore be produced by the one rule planted to validate the instrument.

Required edit: Remove D13 and its twin from the E1 set; they serve M3 only, with their own fixed runs. Add a breadth condition to the positive branch: E1 must be significant on the set without D13, and a registered leave-one-task-out check runs. If dropping any single task makes E1 non-significant, the verdict reads 'driven by one task (<id>)', and the per-rule rows carry the finding.

Evidence: Simulation seeds 20261012 and 20261013, 4,000 reps. PILOT-RESULTS per-task table: every task-by-setup cell lists one first tier with count 2. v1 line 134 (D13, 'planted-effect positive control') and line 191 (M3 on D13).

Checkable: v1 lists D13 under 'Candidate primary tasks' with P(R agrees) 0.2 (line 134) and uses D13 for M3 (line 191). No sentence in v1 excludes D13 from the E1 set.

### S2-05 [BOUNDS] target: E1's exchangeability (line 195) when twin wordings alternate within a cell (line 117)

Attack: Within a twin task, runs under the two wordings are not identically distributed, so arm labels are not exchangeable across all of a task's runs. With balanced 3/3 alternation, the test pooled by task is valid but conservative: size 0.016 against 0.035 when stratified by wording, and power 0.788 against 0.845. With imbalance (R 4A/2B against RS 2A/4B), the pooled test's size is 0.155. v1 permits imbalance: runs added by re-estimation, re-runs after exclusions, cells completed only in part, and odd run counts.

Required edit: Stratify E1 and every other stratified test by (task, wording), so each twin contributes two strata. Fix the wording by run index within each cell, so a re-run keeps the wording of the run it replaces.

Evidence: Simulation, seed 20261012, 4,000 reps: five twins with wording rates 0.1 and 0.8 plus seven author-prior tasks; the effect scenario is +0.4 on the five twins and three other tasks.

Checkable: v1 line 195 permutes arm labels 'within each task among its runs', and line 117 alternates wordings within each cell, so each twin task's stratum pools two wordings.

### S2-06 [KILLS] target: Line 195: 'a 95% interval by inverting the same test'; the TOST intervals in lines 214 to 216; the two-sided p rule

Attack: The stratified permutation test tests only the sharp null (line 224). A binary outcome has no shift family to invert unless a framework is chosen, such as Rigdon-Hudgens attributable effects, and those frameworks assume a fixed set of units randomized to arms. Here the arms are fixed by design over stochastic sessions. Three things depend on an interval that is not defined: the null branch's TOST, F2's TOST, and the inconclusive branch's 'effect the interval excludes'. The analyst would pick a method after seeing the data. The two-sided rule is also unstated. Doubling gives size 0.030 at 12 x 6, which matches v1's '0.02 to 0.03'; a minimum-likelihood rule would differ.

Required edit: Name the interval method. One option: the mean of task differences with variance sum_t [pR~(1-pR~)/nR + pS~(1-pS~)/nS] / T^2, where p~ = (x+0.5)/(n+1). Another: a parametric bootstrap within cells. Verify its coverage in the registered power script at the grid's rates. Register the two-sided p as twice the smaller exact tail, capped at 1.

Evidence: Size simulation, 3,000 reps, seed 20261011: doubling gives 0.030 (author prior) and 0.029 (calibrated) at 12 x 6, and 0.025 to 0.028 at 12 x 2.

Checkable: v1 line 224 defines E1's null as 'no arm effect on any session (the sharp null)', and v1 states no model of the effect under which that test could be inverted for a binary outcome.

### S2-07 [KILLS] target: Allocation in the size table (RL at 2 runs, RS at 6) and the form decision (line 214)

Attack: F2 compares RS at 6 runs with RL at 2. At 12 tasks the 90% interval's mean half-width is 0.171, wider than the 0.15 bound. As a result, 'F2 not significant with a 90% TOST interval inside +/-0.15' occurred in 0 of 4,000 simulated true-null runs, and in only 0.057 even with both arms at 0.9. When the skill does add beyond its tables (+0.5 on half), F2's superiority power is 0.31 at Holm's 0.0125 and 0.52 at 0.05; with RL at 6 runs the figures are TOST 0.23 and power 0.65 and 0.82. Question 2, which v1 calls 'the shrink-or-keep branch for the skill', cannot return 'the tables carry the increment' at this allocation. The decision rules also give no outcome for 'E1 significant, F2 neither significant nor equivalent'. Moving RL to 6 runs costs 48 capture sessions, about $4 to $6 at v1's $0.09 to $0.13 each.

Required edit: Run RL at 6 runs per cell on the primary set; the size table then reads 12 x 28 = 336 primary sessions. Add a decision row: 'E1 significant, F2 neither significant nor inside the bound: form undecided.'

Evidence: Simulation, seed 20261012 (TOST) and 20261014 (power), 3,000 to 4,000 reps, author prior, Wald interval as in S2-06.

Checkable: At 12 tasks with rates 0.5, RL at 2 runs and RS at 6, the 90% Wald half-width is 1.645 * sqrt(12 * 0.25 * (1/2 + 1/6)) / 12 = 0.194, which exceeds 0.15, so the TOST condition cannot be met.

### S2-08 [BOUNDS] target: The secondary family (lines 199 to 204) and how the decision rules use F1 and F2

Attack: On means, E1 = F1 + F2 for any data, because RS-R = (RS-RL) + (RL-R) per task. F1 and F2 share RL's noise with opposite signs, so E1, F1 and F2 carry two degrees of freedom. F1 and F2 matter only inside E1's branches, yet they are Holm-adjusted together with F3 and F4, which answer unrelated questions. Holm adjustment makes F2 less likely to be significant, and F2 non-significance is half of the condition for retiring the skill. Only the TOST stops that, and at RL = 2 runs the TOST cannot be met (S2-07). Checking F2 alone also ignores F1: if RL's noise runs high, F2 looks like 0 and F1 looks like E1 by chance.

Required edit: Use gatekeeping instead. If E1 rejects, test F2 for superiority at 0.05. If F2 does not reject, 'the tables carry the increment' requires both F2's 90% interval inside +/-0.15 and F1 significant at 0.05. In the null branch, F1 at 0.05 decides between the RL form and the rule-only form. F3 (and F4, if kept) form their own Holm family. Family-wise error stays controlled by the closed-testing argument for serial gatekeeping.

Evidence: v1 lines 199 to 204 and 214 to 215. Arithmetic identity of the means. F2 powers as in S2-07.

Checkable: For any data with equal runs per task, mean_t(RS_t - R_t) = mean_t(RS_t - RL_t) + mean_t(RL_t - R_t).

### S2-09 [KILLS] target: F4 (line 204): model agreement with omitted models excluded, S minus A0

Attack: Excluding omitted models conditions on naming, which the arm itself changes: S names a model nearly always, A0 about 20% of the time (attempt 1's A named 3 of 15). At 2 runs, a task has a usable A0 session with probability 1 - 0.8^2 = 0.36, so about 4.3 of 12 tasks enter the contrast. Even at a maximal effect (S always agrees, A0's named sessions never do), significance at Holm's first step is only 0.53. A0's named subset is also self-selected: attempt 1's A named haiku twice and fable once, on prompts that pointed to a model. The contrast compares a whole arm with a post-treatment subset, so it is not randomized and does not estimate the skill's effect.

Required edit: Remove F4 from the Holm family. Report S-A0 descriptively: on naming, and on agreement with an omitted model scored as opus, carrying the omitted-scoring caveat attempt 1 recorded. Holm then runs over F3 alone, or F3 plus F1 and F2 if S2-08 is not adopted.

Evidence: Simulation, seed 20261014, 3,000 reps: usable tasks per 12 = 4.32; at the maximal effect, significance 0.531 at 0.0125 and 0.735 at 0.05.

Checkable: FULL-RESULTS lists A's first-delegation tiers as 'omitted(opus) 12, haiku 2, fable 1'.

### S2-10 [BOUNDS] target: E2 (line 197): fixed sequence after E1, restricted to sessions whose Agent schema carries effort

Attack: The fixed sequence holds for any valid level-alpha E2. Conditioning on schema presence is harmless when presence is set by configuration and equal across arms, and I2 picks a level whose schema carries effort, which makes the condition vacuous. So the charge that conditioning breaks the sequence largely fails. The live problem is headroom. In the pilot, with the schema carrying effort (medium), the rule-only arm named an effort on 10 of 10 delegations, and R's text says '(and effort where supported)'. E2 RS-R is therefore a near-certain null. The Agent-schema condition is also irrelevant to Workflow launches, which E2 scores too.

Required edit: Register a parser check that schema presence is equal in R and RS; if it is not, E2 becomes descriptive. Before registration, check headroom with the screen's R sessions (Instrument 1, same level). If R's effort-named rate there is >= 0.9, E2 becomes the above-band effort rate among named efforts on the primary set. Apply the schema condition to Agent calls only.

Evidence: FACTS.md attempt-1 pilot line; v1 line 197; the I2 decision rule at v1 line 92.

Checkable: FACTS.md records the medium-effort pilot as 'effort set A 0/10, B 10/10, C 9/10, D 9/10', where B is the rule-text-only setup.

### S2-11 [BOUNDS] target: Line 215: the +/-0.15 bound as 'three task-equivalents on a twenty-task set', and TOST power

Attack: The size table assumes 12 surviving tasks, where 0.15 is 1.8 task-equivalents; at 10 tasks it is 1.5. The bound is fixed on the rate scale but justified in task units, so its meaning depends on how the screen comes out. At 12 x 6, a true null passes TOST 0.229 of the time (mean 90% half-width 0.125); at 20 x 6, 0.625. At the expected size, a true null ends inconclusive about 77% of the time. The bank over-represents divergent situations (line 210), so 0.15 on the bank corresponds to a smaller share of the owner's organic first choices. The owner's pending confirmation needs that conversion.

Required edit: Before the screen, state the bound in one unit: either 'k tasks fully moved', with the rate bound k/T computed at registration, or the rate together with its task equivalent at the registered T. Report the TOST pass probability at the registered T. Either require T >= 16 for the 'no material increment' branch, or state that at T = 12 it fires on a true null about one time in four.

Evidence: Simulation, seed 20261012, 4,000 reps, author prior, Wald 90% interval.

Checkable: 0.15 x 12 = 1.8 task-equivalents, and v1's size table row reads 'assume 12 survive'.

### S2-12 [KILLS] target: M2 (line 190): exposure at 0.8, applied 'whatever the primary shows'

Attack: (a) A point threshold on about 72 to 84 RS sessions is a coin flip at its own value: P(observed < 0.8 | true 0.8) = 0.48 to 0.52, and 0.11 to 0.12 at a true 0.85. (b) 'Whatever the primary shows' overrides a significant positive E1. Under the sharp null, low exposure cannot create a false positive, so a significant intention-to-treat effect at 70% exposure is still evidence that the skill moves choices. M2 can only qualify a null. (c) Exposure at the chosen level is unknown but measurable before registration. In the pilot at medium effort, D (rule plus plugin) invoked the skill in 3 of 10 sessions against C's 10 of 10, so the rule may suppress invocation below xhigh.

Required edit: Limit M2 to the null branch: a null with exposure below 0.8 reads 'not read at this effort level', while a significant E1 stands with M2 reported beside it. Add a pre-registration exposure probe: 10 RS sessions on anchor tasks (not primary tasks) at the I2-chosen level, and if invocation there is below 0.8, choose the level again before registration. In the main run, judge M2 by its exact lower 95% bound rather than by the point estimate.

Evidence: Binomial at n = 72 and n = 84. FACTS.md pilot line on skill invocation.

Checkable: FACTS.md records the medium-effort pilot as 'skill invoked C 10/10, D 3/10'.

### S2-13 [BOUNDS] target: M3 (line 191): RS-R >= +0.3 on D13 and its twin

Attack: M3 rests on one task with two wordings at 6 + 6 runs. With no effect (0.2 and 0.2), P(RS-R >= +0.3) = 0.134. With a real moderate effect (0.2 to 0.5) it is 0.585, and with 0.2 to 0.8 it is 0.927. If the screen sends D13 to the anchors (which run 2 runs per arm), a true null passes 0.243. A point threshold on one task cannot tell 'the instrument cannot see the skill's content' from noise, yet its failure relabels the null branch.

Required edit: Run D13 and its twin at 6 + 6 runs whatever the screen shows. Base M3 on a one-sided exact test at 0.05 together with the +0.3 estimate. Add a second planted task on a different rule that exists only in the skill, so M3 does not rest on one prompt. Exclude both planted tasks from E1 (S2-04).

Evidence: Exact binomial convolution: (0.2, 0.5) 0.585 at 6 runs and 0.560 at 2; (0.2, 0.8) 0.927 and 0.819; (0.4, 0.8) 0.728 and 0.653; (0.2, 0.2) 0.134 and 0.243.

Checkable: For independent X_R, X_S ~ Bin(6, 0.2), P(X_S - X_R >= 2) = 0.134.

### S2-14 [FAILS] target: M1 (line 189): R-P naming at or above +0.5 and significant

Attack: The question is whether M1 could fail at the border and void the run. The expected R-P is about +0.8 (attempt 1: B 13 of 13, A 3 of 15). With 12 primary tasks (R at 6 runs), 6 anchors (R at 2 runs) and P at 2 runs, the SD of the mean difference is about 0.069, so P(estimate < 0.5) is about 3e-5 when P names at 0.2. M1 fails mainly if P's baseline rises: at P naming 0.4, P(fail) is about 0.16. v1 would then report an 'instrument failure' when the real finding is a smaller floor effect.

Required edit: None required. Optional: split M1's failure reading. 'R naming below 0.9' means a delivery failure and voids the skill verdict; 'P naming above 0.4' means the baseline moved and the floor effect is smaller than attempt 1's, which does not void it.

Evidence: Normal approximation: per-task variance 0.98 * 0.02 / n_R + 0.2 * 0.8 / 2, summed over 18 tasks and divided by 18^2.

Checkable: FULL-RESULTS reports named-model first delegations as B 13/13 and A 3/15.

### S2-15 [KILLS] target: Line 153: anchors' RS-R within +/-0.10 on every anchor

Attack: Anchors run 2 runs per arm, so each per-task difference is a multiple of 0.5 and 'within +/-0.10' means exactly zero. With equal true rates in both arms, P(difference = 0) per anchor is 0.689 at 0.9 and 0.824 at 0.95. All six anchors fall inside the band only 0.107 and 0.312 of the time. The expectation therefore fails from noise alone 69% to 89% of the time and reports 'the skill moves easy cases'. Tasks promoted to anchors by the screen add more anchors and make failure likelier.

Required edit: Replace the per-anchor band with a pooled anchor contrast: the stratified test of RS against R over the anchors, plus a 90% interval on the anchors' mean difference inside +/-0.10, with per-anchor rows descriptive. Alternatively, run the anchors at 6 runs per arm in R and RS (48 more sessions).

Evidence: Exact binomial computation.

Checkable: For Bin(2, 0.9) in both arms, P(equal counts) = 0.81^2 + 0.18^2 + 0.01^2 = 0.6886, and 0.6886^6 = 0.107.

### S2-16 [KILLS] target: Line 241: blinded re-estimation from the D/RS A/A pairs after the first half

Attack: (a) It is not blind. The analyst knows each task's screen R rate before the run, so per-task RS (plus D) outcomes at halfway reveal the effect. In simulation, (halfway RS+D rate minus screen R) correlates 0.72 with the final E1 estimate, and P(final significant | leaked estimate > 0.15) is 0.75 against 0.55 overall. (b) For a Bernoulli outcome, D/RS disagreement equals 2p(1-p) of the treatment arm: a function of the outcome, not a nuisance parameter separate from the effect. The power grid has no free variance parameter for it to update, so 're-run the grid with it' is undefined. (c) It contradicts 'nothing is added or dropped on outcome data' in the same paragraph. A mechanical top-up costs little alpha (size 0.033 to 0.036), so the defects are blinding and definability.

Required edit: Preferred: drop the re-estimation and fix the run counts at registration, since the screen already supplies the R rates the grid needs. If it is kept: a script that sees no arm labels applies a rule written into the protocol, with the cap as a number, using pooled overdispersion across all arms (a beta-binomial intra-task correlation). The script outputs only the new run count, and the analyst never sees intermediate rates.

Evidence: Simulation, seed 20261013: 4,000 reps for the leak and 20,000 for size. Model: halfway = RS 3 runs + D 1 run per task; top-up from 6 to 8 runs when pooled disagreement exceeds 0.42, which triggered in 72% of runs.

Checkable: v1 line 241 contains both 'nothing is added or dropped on outcome data' and 'runs are added up to a stated cap', the latter driven by D-versus-RS outcomes.

### S2-17 [BOUNDS] target: Line 104: the transfer criterion

Attack: At 6 runs, 'tasks where Opus RS-R is nonzero' includes 71% to 77% of tasks under a true null, so the set is mostly noise. On Fable at 2 runs per arm, the per-task P(same positive sign) is 0.29 to 0.31 with no Fable effect, 0.56 at a 0.3-to-0.6 effect and 0.74 at 0.3 to 0.8. Without a null reference the count cannot be read: about 4 of 12 same-sign tasks is what no transfer produces.

Required edit: Define the Opus set as tasks with Opus RS-R >= +0.5 (3 of 6 runs). Report two references beside the Fable same-sign count: its expectation under 'no Fable effect', computed from Fable's own R rates, and its expectation under 'Fable effect equals Opus effect'.

Evidence: Exact binomial computation.

Checkable: For two independent Bin(6, 0.5) counts, P(equal) = sum_k C(6,k)^2 / 4096 = 924/4096 = 0.226, so 77% of null tasks show a nonzero difference.

### S2-18 [BOUNDS] target: Exploratory tasks X1 to X4 (lines 157 to 162), X3 in particular

Attack: The exploratory tasks are descriptive at 2 runs per arm, so they carry no inferential risk, with one exception: X3 is uninterpretable as written. The skill text gives three retry moves, not two: rule out setup first and re-prompt at the same tier (line 64), sweep effort within the band (line 27), and re-dispatch one tier up (line 64). These map to three observables: same tier and effort with a revised prompt; same tier at higher effort; a higher tier. v1 names two and registers no mapping. An effort sweep cannot be observed when the schema lacks effort, and only RS and D carry the text, which is four sessions.

Required edit: Register X3's outcome classes and how each is read from (model, effort, and the prompt's difference from the X3 prompt). State that exploratory results with at most four sessions per arm support no comparative statement.

Evidence: SKILL-0.1.2 lines 27 and 64; v1 lines 161 and 267.

Checkable: SKILL-0.1.2 line 64 reads 'rule out setup first ... then re-dispatch one tier up', and line 27 reads 'Sweep effort within the band before changing tier'.

### S2-19 [BOUNDS] target: Task D2 (line 124) among the screened candidate primary tasks

Attack: D2's stated role is 'effort only ... secondary', yet no secondary contrast covers the effort band (F1 to F4 test model agreement or naming). E1 scores model agreement, where D2's predicted R agreement is 0.9. The screen therefore sends it to the anchors 66% of the time and into the primary set 34% of the time, where it dilutes E1 with a task the protocol itself says does not diverge on model.

Required edit: Remove D2 from the screened candidates and report it descriptively, with its above-band effort rate per arm.

Evidence: Binomial: P(4/4 | 0.9) = 0.656. v1 lines 124 and 199 to 204.

Checkable: v1 line 124 notes 'effort only: registered sign undetermined; secondary', and the secondary family at lines 201 to 204 lists no effort contrast.
