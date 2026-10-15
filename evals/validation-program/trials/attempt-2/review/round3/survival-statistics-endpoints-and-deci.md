# Survival: statistics, endpoints and decision rules

Verdict: v2 is not registrable as written, but it becomes registrable with named edits. Five edits are required before registration. N1 needs the owner's choice of looser admission, about ten more candidates, or dropping the null branches, because the 8-run screen yields an expected 9 tasks and P(T>=12) of 0.08 under the author's own predictions. N2 adds signs to F1 and F2, N4 sets the leave-one-out at p<=0.20 and renames the verdict, N5 names a test for specificity, and N6 drops the unreachable +/-0.10 anchor interval. The core inference holds: the exact stratified test keeps its size, the Wald interval covers 0.86-0.95, and the TOST size at the bound is about 0.05. The bounded items N3 and N7-N13 are text edits that change no data.

## Prior attacks

- S2 [partly]: Six runs and a posterior-fed grid (line 303) answer the core charge. The grid still lacks the k=2 and k=4 few-mover scenarios the edit required. It also lacks a statement of which effect has 0.8 power at the registered T, and it reports E1 power rather than the probability of reaching each branch (N11).
- S5 [partly]: The bound is restated with its task equivalent and the TOST pass probability (line 282). The cost derivation is still an owner item. Given the screen's expected yield, the T>=12 equivalence branch fires under a true null only about 2% of the time (N1).
- S2-02 [partly]: The 'conservative' sentence is gone, posterior draws feed the grid, and the audit precedes the screen (steps 4 and 6). The required per-task report of admission under the union label is absent. That report matters for D4, the only candidate with a second model label.
- S2-04 [partly]: D8 and D13 are out of E1 with their own runs (line 172), and a breadth condition is added. At a uniform +0.25 shift on all 12 tasks, the breadth condition labels about 20% of significant results 'driven by one task'. At +0.15 the share is about 50% (N4).
- S2-08 [partly]: F2 is gatekept after E1 and F3 stands alone. Rows 9-10 use F1 when E1 did not reject, which contradicts the 'Form (gatekept after E1)' heading. E2 and F2 both run at 0.05 after the one gate with no family stated, and F1 and F2 have no registered sign (N2, N3).
- S2-12 [partly]: M2 now qualifies nulls only and is judged on an exact lower bound (line 255). I10 still passes on a point estimate of 8 of 10, which a true exposure of 0.8 passes 0.68 of the time while the main-run bound passes at most 0.044 of the time. M2's denominator and sidedness are unstated (N8).
- S2-13 [partly]: Two planted tasks at 6+6 runs, a pooled one-sided exact test, conditional on headroom (lines 172-177 and 256). One passing task alone needs RS at least 5 of 6 against R at most 1 of 6 (power 0.39 at a true 0.2 to 0.7). Attempt 1 makes 'not testable' the likely outcome, and that outcome lets the null branch run with no positive control (N7).
- S2-15 [partly]: The ruling was right but the adopted remedy fails. A pooled 90% interval inside +/-0.10 over 7 anchors at 6 runs passes only 0-1.3% of the time under no effect. Even if every session agrees, the half-width is 0.092. The pooled stratified test from the same edit has a false-flag rate of 1.4-1.8% (N6).
- res-stat-2 [partly]: The script and grid are registered. The few-mover scenarios and the 'half 0.3 to 0.6' case are absent, and null size is quoted as a figure (0.02-0.03) rather than listed as an output. My simulations give 0.026-0.035 at T=9-14.
- res-stat-3 [partly]: E1 is fully specified, and the minimum p plus the nonzero-task count go beside every p. E2's unit (calls versus sessions) and M2's denominator and sidedness are unstated.
- res-stat-6 [partly]: The equivalence pass probabilities are registered, but the bound is not derived from cost (an owner item). At the screen's expected T the equivalence branch is nearly unreachable (N1).
- res-stat-11 [partly]: Counts are reconciled. The attainability of the P minus A0 interval was never computed; at 2 runs it cannot fit inside +/-0.15 (N12).
- res-item-3 [partly]: The null branch requires T>=12 and M2>=0.8. 'M3 not testable' satisfies the positive-control condition, so the null branch can fire with no positive control (N7).
- res-item-6 [partly]: Per-rule rows are the primary presentation. No rule-clustered sensitivity analysis exists beyond collapsing the validate.js tasks, and several primary candidates share line 22.
- res-item-8 [partly]: Anchors are pooled at 6 runs, but the +/-0.10 criterion is unreachable from noise alone (N6).
- res-item-9 [partly]: M3 uses a one-sided exact test rather than a point floor, but the 'not testable' path voids the control (N7).
- res-ctrl-12 [partly]: The within-cell disagreement rate is published. Run counts come from the grid with no registered selection rule (N11).
- res-rep-8 [partly]: The grid gives power for E1 and F2 only. No minimum detectable effect is registered for M3, E2 or F3.

(resolved items omitted; count: 34)

## New attacks

### N1 [KILLS] target: The screen (line 214), the size table's 'T assumed 12' (line 312) and the null branches that need T at least 12 (rows at lines 294-296)

Attack: Scored against the author's own 19 predictions, the 8-run screen admits on average 9.0 tasks. P(T>=12) is 0.080, P(T in 10-11) is 0.312 and P(T<10) is 0.608. Under round 2's attempt-1-calibrated prior (half the candidates truly at 0.85-1), E[T] is 4.6 and P(T>=12) is about 0. Rows 9 and 10 require T>=12, and the TOST under a true null passes 0.10 at T=10, 0.22 at T=12 and 0.33 at T=14. Under a true null, the 'no material increment' outcomes therefore fire about 0.019 of the time before M2 and M3 are applied. The trial is effectively 'detect or inconclusive'. The size table plans 336 primary sessions at T=12 against an expected 252, and the quoted power figures (T=12) overstate E1 power at the likely T: at T=9 power is 0.75 at +0.25 on every task and 0.30 at a mean of 0.15.

Required edit: Before the screen, choose one option and register it. (a) Admit at <=5/8: E[T] becomes 12.9 and P(T>=12) 0.79, but a truly-0.7 task enters 45% of the time instead of 19%. (b) Pre-write and audit about ten more candidates: 28-30 candidates at the same prediction mix give P(T>=12) of 0.77-0.80, for 72-88 more screen sessions. (c) Delete rows 9-10 and the T>=12 clause, state under Questions that the trial can return only an increment or 'inconclusive', and re-plan the primary block at E[T] of about 9. Whichever option is chosen, the size table's T must be the screen's expected yield, not 12.

Evidence: Exact dynamic programming over the 19 listed predictions (D1 .7, D3 .6, D4 .7, D5 .8, D10 .7, D11 .4, D12 .5, D14 .3, D15 .5, D16 .8, D22 .7, D23 .5, D25 .7, R1 .4, R3 .6, R4 .5, R5 .6, R6 .3, R7 .5). Script (Node 26.7, piped on stdin, no file): bcdf(n,k,p)=sum_{i<=k} C(n,i)p^i(1-p)^(n-i); d=[1]; for each p: a=bcdf(8,4,p); `d'[i]+=d[i]*(1-a); d'[i+1]+=d[i]a`. P(T=k) for k=6..14: .054 .119 .191 .223 .191 .121 .056 .019 .004. E[sensitivity set]=7.18 and E[promoted anchors]=2.80. TOST pass rates come from 4,000 null replicates per T on the admitted pool (seed 20261012). FULL-RESULTS: text-only agreed 11 of 13, so attempt 1 points to fewer misses than predicted, not more.

Checkable: Sum over the 19 listed predictions of P(Bin(8,p)<=4) = 0.970+1.218+0.112+1.652+3.185+1.884 = 9.02 expected admitted tasks, below the size table's assumed 12.

### N2 [KILLS] target: Decision rows 2, 3, 9 and 10 (lines 287, 288, 294, 295) against the two-sided F1 and F2 definitions (lines 266-267)

Attack: F1 and F2 are two-sided tests ('same test' as E1, two-sided by doubling), but the branch table conditions on 'F2 significant' and 'F1 significant' with no direction. Row 9 returns 'recommend the RL form' when F1 is significantly negative, that is, when the always-loaded rules lower agreement below R. Row 2 returns 'keep the skill' when F2 is significantly negative alongside a positive E1. By the identity E1 = F1 + F2, that combination means RL > RS > R: the rules as text beat the invoked skill, and the right recommendation is RL. Both can happen. RL adds about 620 words under the loader's OVERRIDE wrapper, and on the eight 'over'-direction candidates added ladder text could plausibly move choices either way.

Required edit: Write 'F2 significant positive' in row 2 and 'F1 significant positive' in rows 3 and 9. Add two rows. First: E1 significant positive and F2 significant negative means the rules as text beat the skill, so recommend the RL form. Second: F1 significant negative means the always-loaded rules lower agreement, so do not recommend RL. Row 10 then reads 'F1 not significant positive'.

Evidence: v2 line 260: two-sided p as twice the smaller tail. Lines 266-267 say F2 and F1 use the 'same test'. Rows at lines 287, 288 and 294 name no sign; only E1 has a negative row (line 297). Identity at line 268.

Checkable: v2 line 294 conditions 'recommend the RL form' on 'F1 significant' with no sign, while line 267 defines F1 as RL minus R under E1's two-sided test.

### N3 [BOUNDS] target: The branch table's coverage and precedence (lines 284-299) and the 'Form (gatekept after E1)' heading (line 264)

Attack: Three pairs of rows both apply, and no precedence is stated. Rows 5 and 6 both apply when breadth fails and specificity fails. Rows 7 and 11 both apply when M2 is below 0.8 and the interval is wide. Rows 8 and 11 both apply when M3 fails and the interval is wide. Rows 9-10 use F1 when E1 did not reject, which contradicts the heading 'Form (gatekept after E1)'. E2 and F2 each run at 0.05 after one E1 rejection with no stated family, so the strong FWER over {E2, F2} is about 0.06 at the tests' actual size. The identity E1 = F1 + F2 holds only on a common task set, but the missing-cell rule (line 246) drops tasks per contrast. Row 11 asks for 'the size for 0.8 power at the observed rates' without naming the effect, which invites observed-effect power.

Required edit: Rows 7 and 8 require the same interval and T conditions as rows 9-10; otherwise row 11 applies, with the M2 and M3 readings reported as qualifiers. When rows 5 and 6 both hold, both labels are reported. F1 in the null branch is declared a separate test at 0.05 outside the gate. E2 and F2 are declared separate one-test families, or each runs at 0.025. E1, F1 and F2 are computed on tasks that have all three cells. Row 11 computes size at an effect of 0.15.

Evidence: Rows at lines 290/291, 292/296 and 293/296 have overlapping conditions. Line 262 tests E2 at 0.05 if E1 rejects, and line 266 tests F2 at 0.05 if E1 rejects. Rows at lines 294-295 test F1 under a non-significant E1. Size of each exact test at nominal 0.05 is 0.026-0.035 in my nulls, so 1-(1-0.03)^2 is about 0.06.

Checkable: A result with E1 significant positive, the breadth condition failed and the specificity condition failed satisfies both row 5 (line 290) and row 6 (line 291), which return different outcomes.

### N4 [KILLS] target: E1's breadth condition (line 260) and row 5 (line 290)

Attack: Leave-one-out at 0.05 fails whenever E1's p is marginal, whatever the effect's shape, and the verdict then reads 'driven by one task'. At T=12 with 6 v 6 runs on posterior-pool R rates, the share of significant results labelled 'driven by one task' is 0.47-0.50 at +0.15 on every task and 0.19-0.20 at +0.25 on every task. In a near-deterministic bank (pilot-like) with two full movers it is 0.56. In each case the effect is spread over more than one task. The positive branch's reachability is P(E1 significant and breadth met), which is far below E1 power and is not in the grid's outputs. At T=12 it is 0.18 at a mean of 0.15 against power of 0.39, and 0.68 at +0.25 against 0.87. At T=9 it is 0.11 and 0.48.

Required edit: Run the leave-one-out at p<=0.20. That threshold asks whether one task carries the effect, not whether significance survives: it flags diffuse +0.15 in 0.016 of significant results and +0.25 in 0.006, while it still flags a lone 0.03-to-0.97 mover in 0.38 of significant results in the pool bank and 0.95 in a near-deterministic bank. Rename the verdict 'significance depends on <ids>' and list every task whose removal breaks it. Add P(positive branch), with breadth and specificity, to the grid's outputs.

Evidence: Node 26.7 on stdin, mulberry32 seeds 20261012-20261014, 2,000-4,000 reps per cell. Pool: 200,000 candidates cycling the 19 predictions, kept if Bin(8,p)<=4 (mean true R 0.478). Per rep, T rates are drawn from the pool, with xR~Bin(6,p) and xS~Bin(6,min(1,p+shift)). Exact test: convolve per-task hypergeometric pmfs of xS given xR+xS; two-sided p = min(1, 2*min tail). Breadth: every leave-one-out exact p<=0.05. Single-mover runs set task 0 to 0.03 under R and 0.97 under RS.

Checkable: With 12 tasks whose RS rate exceeds R's by 0.25 on every task (6 runs per arm), about one in five significant E1 results loses significance when some single task is dropped, so v2 would label it 'driven by one task'.

### N5 [KILLS] target: The specificity condition (line 200) that gates rows 2-4 and row 6

Attack: The specificity condition is 'no increase in over-provisioning, RS against R, pooled over N1, N2, D7, N6, N5'. It names no test and no margin. Read as the point estimate, it fails from noise alone 0.33-0.43 of the time when both arms over-provision equally at 0.03-0.2 (5 anchors x 6 runs). A true positive E1 is then relabelled 'the skill raises tiers in general; not judgment' about a third of the time. Read as a one-sided exact test at 0.05, it fails 0.001-0.025 of the time. The branch therefore depends on an unregistered choice.

Required edit: Define the condition as failing when a one-sided exact stratified test of RS over R on over-provisioning (the five anchors, 6 runs each) has p<=0.05, or when the upper 90% bound exceeds a stated margin. Register which one, with its false-flag rate from the grid.

Evidence: 20,000 replicates per rate with seed 20261013. Under equal over-provisioning rate q in both arms, P(RS count > R count) is 0.334 at q=0.03, 0.378 at 0.05, 0.413 at 0.1 and 0.433 at 0.2. One-sided exact p<=0.05 occurs 0.001, 0.006, 0.015 and 0.025 of the time.

Checkable: With equal over-provisioning rate 0.1 in R and RS on five anchors at 6 runs each, the pooled RS count exceeds the R count about 41% of the time.

### N6 [KILLS] target: The registered anchor checks (line 200): the 90% interval on the pooled anchor difference inside +/-0.10, RS against R and RL against R

Attack: The pooled check that replaced S2-15's per-anchor band cannot pass from noise. With 7 anchors x 6 runs and (x+0.5)/(n+1) variances, the half-width is 0.092 even when all 84 sessions agree. One disagreeing session moves the upper bound to 0.121. Under no effect, the check passes 0.013 of the time at anchor rates of 0.95 and 0.000 at 0.9. It passes 0.003 at a mix of .98x3, .95x2 and .85x2, and 0.088 with three screen-promoted anchors added. The write-up would report 'anchors moved' in 91-100% of runs with no effect. The stratified test in the same check has a false-flag rate of 0.014-0.018.

Required edit: Flag the anchors on the stratified exact test only (two-sided, 0.05), and report the interval with no inside/outside reading. If a bound is wanted, use +/-0.20, which passes 0.76-0.88 under no effect. State whether screen-promoted anchors join the pooled check.

Evidence: 20,000 null replicates per rate set, seed 20261014. Pass rates at +/-0.10, +/-0.15 and +/-0.20 are 0.003, 0.522 and 0.884 for the mixed set, and 0.000, 0.310 and 0.755 with all rates at 0.9.

Checkable: With 7 anchors x 6 runs and every session agreeing in both arms, the 90% half-width is 1.645*sqrt(7*2*(6.5/7)*(0.5/7)/6)/7 = 0.092. A single disagreeing session gives an estimate of 1/42 and an upper bound of 0.121, outside +/-0.10.

### N7 [BOUNDS] target: M3 (line 256) when one or no planted task passes the headroom condition (lines 176-177), and rows 9-10's 'pass or not testable'

Attack: A single planted task at 6 v 6 under a one-sided exact test needs RS at least 4 of 6 when R is 0 of 6, at least 5 of 6 when R is 1 of 6, and 6 of 6 when R is 2 of 6. Power at a true R of 0.2 is 0.14, 0.39 and 0.74 for RS rates of 0.5, 0.7 and 0.9. Failure relabels a null 'instrument cannot see the skill's content'. Headroom (R at most 2 of 8) passes 0.011 of the time at a true R of 0.7 and 0.001 at 0.8. Attempt 1 points to ceiling for both planted tasks: T17, the D13 analog, chose fable in all four setups including no text, and the pilot's lens rows show text-only at sonnet 2 of 2, matching D8's label. The A0 condition is nearly vacuous, since A0 omitted the model 12 of 15 times and an omitted model scores as opus, which disagrees with both labels. The likeliest outcome is 'not testable', which lets rows 9-10 fire with no positive control.

Required edit: Make 'not testable' send a null to row 11 ('inconclusive: no positive control'), or pre-write two replacement planted tasks screened in the same block. When one planted task passes, run it at 12 v 12. That costs 12 more sessions and gives power 0.77 at a true 0.2 to 0.7, with size 0.019.

Evidence: Exact Fisher enumeration. The 12 v 12 power at R 0.2 is 0.356, 0.768 and 0.981 for RS 0.5, 0.7 and 0.9. FULL-RESULTS line 144 (T17 is fable in A, B, C and D) and line 151 (A omitted 12 of 15). PILOT-RESULTS line 107 (lens B: sonnet 2).

Checkable: For one 6-v-6 table with R at 1 of 6, the one-sided Fisher p for RS at 4 of 6 is 96/792 = 0.121. RS at 5 of 6 gives 37/924 = 0.040, so 5 of 6 is the least that passes.

### N8 [BOUNDS] target: M2's exact lower bound (line 255) against probe I10's point threshold (line 106)

Attack: M2 names neither its denominator (primary RS sessions only, or every RS session including anchors, planted tasks and twins) nor its sidedness. Its pass probability, P(lower bound >= 0.8), at a true exposure of 0.85 is 0.23 at n=72, 0.37 at n=126 and 0.45 at n=148 (one-sided 95%), and 0.14 to 0.28 two-sided. At 0.9 it is 0.71 to 0.96. I10 passes at 8 of 10, which a true 0.8 meets 0.68 of the time and a true 0.85 meets 0.82 of the time. The probe therefore admits effort levels at which the main-run M2 will probably read 'not read at this effort level' on a null.

Required edit: Name M2's denominator and sidedness. Calibrate I10 to the main criterion, either by requiring at least 19 of 20 or 10 of 10, or by stating that M2 passes when the point estimate is at least 0.8 with the bound reported beside it.

Evidence: Clopper-Pearson: x* is the least x with P(X>=x | 0.8) <= alpha, and the pass probability is P(X>=x* | p). x* is 64 of 72, 109 of 126 and 127 of 148 one-sided; 65, 110 and 129 two-sided. I10: P(Bin(10,p)>=8).

Checkable: For n=72 RS sessions and a true exposure of 0.85, P(one-sided 95% Clopper-Pearson lower bound >= 0.8) = P(X>=64) = 0.229.

### N9 [BOUNDS] target: The label-dependent rule (line 299)

Attack: 'The more conservative branch applies' has no registered order over the twelve outcomes. Is 'recommend the RL form' more conservative than 'keep the skill', or 'no material increment; rule as it stands' more conservative than 'inconclusive'? In v2 the union label differs from the primary only on D4: the audit admits unanimous tasks only, and D22's second reading is effort. If D4 is admitted, it is admitted because R chose opus, so under the union label D4 has no headroom by construction. The union analysis is mechanically diluted, and an unordered rule decides the outcome whenever the dilution changes a branch.

Required edit: Register a total order, for example by the size of the change from the owner's current configuration. Outcomes that change nothing (keep, inconclusive, form undecided, driven by one task, raises tiers, investigate) rank below 'RL form', which ranks below 'rule as it stands'. State that the union label touches D4 only.

Evidence: Line 152 (D4: 'line 22 is the sensitivity label, opus'), line 160 (D22: 'high agrees' is effort), line 144 (only unanimous model sets enter), and line 299.

Checkable: Among v2's primary candidates, only D4 lists a second model label; no other row in the table at lines 148-168 names an alternative model.

### N10 [BOUNDS] target: The size table (lines 307-319) against the screen's outputs (line 214) and E1's sensitivity analysis 'the sensitivity set added' (line 260)

Attack: Under the author's predictions, the screen produces an expected 7.2 sensitivity-set tasks and 2.8 promoted anchors. Neither is budgeted, and E1's sensitivity analysis needs main-run R and RS sessions for the sensitivity set. The anchor block budgets 7 anchors only. Either those analyses cannot run or the total is understated: about 86 sessions for the sensitivity set at R and RS x 6, and about 73 for promoted anchors at the anchor allocation.

Required edit: State the arms and runs for sensitivity-set and promoted-anchor tasks and add rows to the size table, or drop 'the sensitivity set added' and say promoted tasks are reported from the screen only.

Evidence: Expected counts from the binomial probabilities at 8 runs (N1 script). The size table rows at lines 312-314 assume T=12 primary tasks and 7 anchors.

Checkable: v2's size table has no row for sensitivity-set tasks or screen-promoted anchors, although line 214 creates both and line 260 analyzes the first.

### N11 [BOUNDS] target: The power grid fed by posterior rates (line 303)

Attack: The grid outputs E1 power, F2 power, TOST pass probabilities and the anchor false-flag rate. It omits five things. (1) The probability of each branch: with breadth, P(positive) is 0.18 against E1 power of 0.39 at T=12 and a mean effect of 0.15. (2) The share of the effect RL carries, which decides F2: given a significant E1, row 2 fires 0.89, 0.34 and 0.03 of the time when RL carries 0%, 50% and 100%. (3) Few-mover scenarios. (4) The beta-binomial fitting method; maximum likelihood on about 21 counts out of 8 can sit at the boundary, collapsing posteriors to a common mean. (5) Capping of shifted rates at 1. 'Run counts are fixed at registration from the grid' has no selection rule, while the size table fixes 6.

Required edit: Register the grid's outputs as the probability of each decision row. Add RL scenarios (0, 0.5 and 1 of the effect), k=2 and k=4 movers, the fitting method with bounds, and capping at 1. Add a run-count rule, for example the least of 4, 6 or 8 runs giving P(positive branch) >= 0.8 at +0.5 on half, capped by the owner's ceiling, with the action if none qualifies.

Evidence: Form simulation at T=12, 6 v 6, +0.25 on every task, 2,000 reps, seed 20261013. Given E1+, row 2 / row 3 / row 4 fire 0.894/0.001/0.105 when RL carries 0%, 0.336/0.060/0.604 at 50%, and 0.032/0.364/0.604 at 100%.

Checkable: v2 line 303 lists the grid's outputs without any branch probability and gives no rule that turns those outputs into a run count.

### N12 [BOUNDS] target: P minus A0 with a 90% TOST against +/-0.15 (line 276)

Attack: At 2 runs per cell, the smallest cell variance under (x+0.5)/(n+1) is (1/6)(5/6)/2. The 90% half-width is therefore at least 0.194 over 10 tasks and 0.164 over 14, and the interval cannot fit inside +/-0.15 at any data. 'Placebo inertness not shown' is fixed before the run, yet it reads as a test result.

Required edit: Drop the TOST and report the interval, stating the minimum half-width at the registered task count; or raise P and A0 runs on the naming tasks.

Evidence: Closed form: 1.645*sqrt(T*2*0.139/2)/T, which is 0.194 at T=10, 0.164 at T=14 and 0.144 at T=18. T=18 is attainable only when every cell is 0 of 2 or 2 of 2 with a zero estimate.

Checkable: Over 14 tasks at 2 runs per arm, the 90% Wald half-width with (x+0.5)/(n+1) variances is at least 0.164, so the interval cannot lie inside +/-0.15.

### N13 [BOUNDS] target: Instrument 2's minimum denominator (line 86) and pre-registration step 3 (line 329)

Attack: The minimum is 'at least 10 second delegations per arm in the pre-registration smoke sessions'. Those sessions run in arm R only (line 329), and R is not an Instrument 2 arm. The realized RS and D denominators in the gate subset, about 10 sessions per arm at one run per cell, are never checked. The smoke sessions can therefore pass the rule while the main block yields 2 or 3 second delegations, which would then be reported as a rate. The pilot recorded 1.00 Agent calls per delegating run.

Required edit: Apply the minimum to the realized count per arm (RS and D) in the gate subset, and use the smoke counts only as a forecast that decides whether to add two-stage tasks.

Evidence: v2 lines 86, 318 and 329. PILOT-RESULTS line 64.

Checkable: v2 line 329 runs the smoke sessions in arm R, while line 86 states the minimum 'per arm' for an instrument whose arms are RS and D.

### N14 [FAILS] target: The Wald interval with (x+0.5)/(n+1) cell variances at 6 runs (line 260), and the TOST it feeds

Attack: Charge: at 6 runs per cell the Wald interval mis-covers and the TOST built on it is invalid. It fails. Over T=9-14 on posterior-pool rates, 90% coverage is 0.86-0.90 and 95% coverage is 0.93-0.95. The TOST's size at the bound (true mean +0.15) is 0.049-0.052 at T=12-14 and 0.014-0.027 at T=9-10. The 90% interval under-covers slightly at the null (0.86-0.89), which makes the inconclusive row's 'effect the interval excludes' mildly anti-conservative. Exact-test size is 0.026-0.035, a little above the stated '0.02 to 0.03'.

Required edit: None required. Optional: give the registered coverage check an action (if 90% coverage at the grid's rates is below 0.87, use a t quantile on T-1 degrees of freedom), and restate the size as 0.02-0.035.

Evidence: 4,000 null replicates and 2,000 effect replicates per T (seed 20261012). At T=12: null coverage 0.872 (90%) and 0.932 (95%); TOST pass 0.049 at +0.15 everywhere and 0.051 at +0.3 on half. Exact size is 0.035, 0.026, 0.031 and 0.034 at T=9, 10, 12 and 14.

Checkable: In 4,000 null replicates at T=12 (6 v 6, posterior-pool R rates), 87% of 90% Wald intervals covered zero, and the TOST passed 4.9% of the time when the true difference was +0.15.
