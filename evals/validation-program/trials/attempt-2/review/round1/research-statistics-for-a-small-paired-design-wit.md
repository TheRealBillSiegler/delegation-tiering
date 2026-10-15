# Research pillar: Statistics for a small paired design with runs nested in tasks

## Questions

### Q1. What is the unit of analysis and the null hypothesis when two runs sit inside each task, and what does the sign-flip test over task-level differences actually test?

Why here: Runs within a task share prompt, fixture and the model's task-specific tendencies, so they are not independent draws. The draft's tests are per-task paired differences, but it never states the null the sign flip tests (symmetric task differences, or no arm effect on any session), the estimand (these 16 hand-picked tasks, or tasks like them), the weighting when a cell has missing runs, or how zero-difference tasks are treated. The tasks were chosen from ladder rules, not sampled, so population inference is nominal either way.

Source: https://en.wikipedia.org/wiki/Permutation_test
Quote: An important assumption behind a permutation test is that the observations are exchangeable under the null hypothesis.

Draft: partly: Endpoints names the per-task paired difference and the exact sign-flip test, and Open question 4 admits runs are not independent, but no null, estimand, weighting or missing-cell rule is registered.

### Q2. Can an exact sign-flip test over 16 or 23 task-level differences reach significance, and with how many nonzero tasks?

Why here: Only tasks with a nonzero difference carry information. With n nonzero differences all in one direction the smallest two-sided p is 2/2^n: n=5 gives 0.0625 (cannot reach 0.05), n=6 gives 0.031, n=7 gives 0.0156. Under Holm for three endpoints the first step needs p at or below 0.0167, so at least 7 nonzero same-direction tasks. Attempt 1 had 13 scorable tasks but one nonzero difference, so p was 1.0. Ceiling tasks silently shrink the effective n.

Source: https://en.wikipedia.org/wiki/Permutation_test
Quote: To exploit variance reduction with paired samples, a paired permutation test must be applied

Draft: missing: Endpoints and Size never state the effective n, the minimum attainable p, or the number of nonzero tasks needed; the power sentence promises a simulation but gives no figure.

### Q3. Is the percentile bootstrap over 16 or 23 tasks an adequate interval, and what does it return when nearly all task differences are zero?

Why here: The bound-based verdicts (no material increment, inconclusive, placebo inert) all hinge on this interval. Sixteen clusters sits inside the range where standard cluster asymptotics over-reject; the percentile bootstrap over tasks is a different method and its small-n behaviour is untested here. When every task difference is zero the resampled interval collapses to [0,0] and passes any bound, which is a ceiling artifact, not evidence of equivalence; attempt 1 reported [0, +0.231] from a single nonzero task.

Source: https://www.nber.org/papers/t0344
Quote: Standard asymptotic tests can over-reject, however, with few (5-30) clusters.

Draft: partly: Endpoints fixes a 95% bootstrap interval with 10,000 resamples and a recorded seed, but gives no reason for the method and no rule for degenerate intervals.

### Q4. Does the primary family of three need Holm, and which hypotheses belong in the same family?

Why here: The decision rule says 'endpoint 2 or 3 is significant', an at-least-one claim, which needs familywise control across 2 and 3. The floor (endpoint 1) supports a different claim and decision, and its real gate is the placebo equivalence. The three endpoints share sessions (R is in 1, 2 and 3), so a procedure valid under arbitrary dependence, such as Holm, is the right tool. The price is large: my simulation puts power at the Holm first-step threshold at 0.15 against 0.32 at 0.05 for 16 tasks and 2 runs.

Source: https://en.wikipedia.org/wiki/Holm%E2%80%93Bonferroni_method
Quote: whereas Holm–Bonferroni can be applied without such assumptions.

Draft: partly: Endpoints puts floor, judgment-model and judgment-effort in one Holm family, but the decision rules do not say whether 'significant' means Holm-adjusted, and the cost to power is not stated.

### Q5. How is the smallest effect size of interest (the ±0.15 bound) justified, and is it reachable at the planned size?

Why here: ±0.15 is inherited from attempt 1 with no derivation. In task units it is 2.4 of 16 tasks fully flipping. The skill is about 1,400 words and the gate adds a reminder per call, so a cost-benefit bound is possible: skill and gate cost per delegation versus the saving per mis-tiered delegation avoided. Separately, at a true effect of zero with within-task agreement 0.3, the chance that the interval sits inside ±0.15 is 0.1% to 19% across the planned sizes (see recommendations), so the 'no material increment' verdict can almost never fire.

Source: https://lakens.github.io/statistical_inferences/09-equivalencetest.html
Quote: depends on whether they agree with your justification for a smallest effect of interest

Draft: missing: Decision rules and Endpoints use ±0.15 for the placebo, the skill and the belief contrast without justification, and no equivalence-power check exists.

### Q6. Is 'the 95% interval lies inside ±0.15' the right equivalence criterion, and what follows when it does not?

Why here: A TOST at alpha 0.05 uses a 90% interval; the draft's 95% interval is stricter and so even less attainable. A non-significant result with a wide interval is inconclusive, not a null. The draft has an inconclusive branch, but because the no-increment branch is nearly unreachable at the planned size, the trial's expected outcome is 'inconclusive' again, as in attempt 1.

Source: https://lakens.github.io/statistical_inferences/09-equivalencetest.html
Quote: a 90% confidence interval is used when the one-sided tests are performed at an alpha level of 5%

Draft: partly: Decision rules define no-increment and inconclusive by the interval against ±0.15 and promise 'the size needed' when inconclusive, but do not state the test level or check attainability.

### Q7. Is analyzing after batch 2 only a valid rule, and is batch 1 allowed to influence anything?

Why here: A single analysis at the full planned size is a fixed-sample design and carries no alpha penalty. The condition is that nothing done after batch 1 depends on arm-level outcomes: no peek at named-model rates by arm, no changes to tasks, scoring or arms because of how they came out. A per-arm cost check leaks outcomes, because cost tracks tier and turns. Attempt 1 also showed that a cost stop mid-batch leaves random holes (13 of 20 tasks with both cells).

Source: https://lakens.github.io/statistical_inferences/10-sequential.html
Quote: If one would analyze the data at multiple looks without correcting the alpha level, the Type 1 error rate would inflate.

Draft: partly: Size says endpoints are computed once after batch 2 and batch 1 is a health check (error rate, observer records, cost), but it does not say the health check is arm-blind, that batch 2 is unconditional, or how an early cost stop is analyzed.

### Q8. Should the design allow outcome-based early stopping, and if so how is alpha spent?

Why here: Efficacy stopping after one run per cell is nearly useless at this size, and a futility look has to be justified by a bound that is itself unreachable. Alpha-spending functions exist for planned looks; the cheap and safe course is none.

Source: https://lakens.github.io/statistical_inferences/10-sequential.html
Quote: the O’Brien and Fleming correction is much more conservative at the first look

Draft: answered: Size forbids endpoint computation before batch 2, so no outcome-based stop exists; it only lacks the sentence saying so explicitly.

### Q9. What must the registered protocol say about exclusions?

Why here: Differential attrition can fake or hide an effect. In attempt 1 all five timed-out sessions were excluded although each had already made its first delegation, and the errored sessions sat on the opus and workflow tasks. In this design the first delegation is captured by the observer, so a later timeout does not change the outcome. Skill non-invocation in arm RS or D is a mediator and must stay in (intention to treat). Manipulation checks (canary, ledger, hook decisions) decide whether an arm was actually delivered.

Source: https://help.osf.io/article/158-create-a-preregistration
Quote: Say what exclusion rules will be applied

Draft: partly: Measurement scores a no-delegation session as a non-match and Size sets a one-quarter harness-error threshold, but there is no closed exclusion list, no rule for errored sessions, no rerun rule and no missing-cell rule.

### Q10. What must the protocol say about deviations?

Why here: This design has many moving parts (probes I1 to I7 can change routes, the effort level can fall back from xhigh to high to medium, T23 is conditional, the observer can fail). Each branch is a possible deviation. A deviation made after seeing arm-level outcomes can inflate the error rate by an unknown amount, so those must be separated from deviations forced by infrastructure.

Source: https://research.tue.nl/en/publications/when-and-how-to-deviate-from-a-preregistration/
Quote: Deviations from a preregistered analysis plan can both reduce and increase the severity of a test

Draft: partly: Blinding, leakage and records says every deviation is recorded with its reason and the probes are written in before registration, but there are no deviation categories, no blind-or-not field, and no requirement to report the planned analysis beside the deviating one.

### Q11. Are the test, alpha, sidedness and decision criteria fully stated?

Why here: Attempt 1 stated two-sided alpha 0.05 and the decision rules in the protocol; the draft states neither alpha nor sidedness and uses 'significant' without saying whether it is the Holm-adjusted p. It also leaves open how the tie-heavy discrete statistic is handled: in my simulation the exact test's size at nominal 0.05 is only 0.019 to 0.031 because p-values are lumpy.

Source: https://help.osf.io/article/158-create-a-preregistration
Quote: Describe the statistical tests you will use on the data and what decision criteria you are using for interpreting the result

Draft: partly: Endpoints and Decision rules name tests and outcomes, but alpha, sidedness, the adjusted-versus-raw p and the discreteness are unstated.

### Q12. Is the planned power simulation specified well enough, and does the size reach 0.8?

Why here: Size says to simulate 0.3 to 0.8 on half the divergent set 'with the observed run-to-run variance from attempt 1's pilot'. The pilot cannot supply that: it had 5 obvious tasks and 2 runs per cell with identical tiers across runs, and batch 1 had one run per cell. Within-task noise is an assumption, and the answer swings from 0.11 to 0.98 across plausible values. At the specified scenario the draft's own 0.8 rule fails: 0.32 at 16 tasks and 2 runs.

Source: https://lakens.github.io/statistical_inferences/09-equivalencetest.html
Quote: the smallest effect of interest you decide to test against

Draft: partly: Size commits to a simulation and to adjusting the run size if power is under 0.8 for endpoint 2, but no numbers, no variance source and no sensitivity grid are given.

### Q13. Does the task count behind each denominator hold together (16 divergent, 23 scored)?

Why here: The sign-flip's n and the Holm threshold depend on it. The draft's class counts do not reconcile with its table: it says nine model, three effort-only (T01, T03, T10) and four shape divergent tasks, yet T01 is an anchor outside the sixteen, T12 and T21 are model-divergent by their own labels, and T23 is conditional on probe I7, so the floor's 23 and the divergent 16 become 22 and 15 if I7 fails.

Source: none fetched
Quote: none fetched

Draft: partly: Tasks lists the divergent set and the denominators, but the class counts are inconsistent and no rule says what happens to n if I7 fails.

## Recommendations

1. [must] (Size, batches and stopping) Raise runs per cell for the arms in the judgment contrast (R and RS) and allocate runs unevenly: about 8 runs per cell for R and RS on the divergent set, 2 for the arms whose contrasts are large (A0, P, R- for naming). My power at the specified alternative (8 of N tasks go 0.3 to 0.8, rest 0.3 in both arms; 2,000 trials each, exact two-sided sign-flip on task-mean differences): 16 tasks, 2 runs 0.32; 16 tasks, 3 runs 0.46; 24 tasks, 2 runs 0.55; 24 tasks, 3 runs 0.74. At the Holm first-step threshold 0.0167 the same cells give 0.15, 0.24, 0.33, 0.50. Larger run counts (1,000 trials): 16 tasks at 4, 6, 8, 10 runs give 0.57, 0.72, 0.83, 0.88 (Holm threshold 0.31, 0.45, 0.57, 0.61); 24 tasks at 4, 6, 8 runs give 0.84, 0.94, 0.98 (Holm 0.64, 0.80, 0.87). The draft's own 0.8 rule therefore fails at the stated size and must be applied before registration.
   Rationale: Run count within a task is the cheap lever because capture-and-stop sessions cost orchestrator turns only (unmeasured; probe I5 should price it). Adding tasks raises power more than runs but needs new predictions.

2. [must] (Size: power simulation) Register the simulation script and a sensitivity grid instead of a single scenario, and drop the phrase about pilot variance. Report at least: half the tasks 0.3 to 0.8 (above); half 0.3 to 0.6 (16 tasks: 0.11 at 2 runs, 0.18 at 3); only 4 of 16 tasks 0.3 to 0.8 (0.06, 0.11); all 16 tasks 0.3 to 0.8 (0.97, 0.999); near-deterministic half 0.05 to 0.95 (0.98, 0.996; Holm threshold 0.82, 0.93). Also report null size: 0.019 to 0.031 at 0.05 (16 or 24 tasks), 0.005 to 0.009 at 0.0167.
   Rationale: Power ranges from 0.06 to 0.99 depending on how noisy a task is within arm, which is the one quantity no existing data estimate (pilot: 5 obvious tasks; batch 1: one run per cell). A grid shows the owner that the verdict depends on whether tasks are near-deterministic. The exact test is conservative (size about 2 to 3 percent) because the statistic is discrete.

3. [must] (Endpoints: unit and test) State, per endpoint: the statistic (mean over tasks of the task-level difference of run proportions), the null (task differences symmetric about zero), two-sided alpha 0.05 before Holm, the exact enumeration method (convolution over signed integer differences, unit-tested against brute-force 2^n enumeration), the treatment of zero-difference tasks (counted in the mean, no contribution to the null distribution), and the minimum attainable p given the number of nonzero tasks (6 nonzero same-direction tasks for 0.05; 7 for 0.0167). Report the number of nonzero tasks beside every p.
   Rationale: A reader cannot tell otherwise whether p=1.0 means no effect or no variation, as in attempt 1's endpoint 1 (one nonzero task of 13).

4. [should] (Endpoints: unit and test) Choose and register the test unit knowingly. Options and simulated power (same alternative; 2,000 trials for first row, 1,000 for the others; 16 tasks/2 runs, 16/3, 24/2, 24/3): task-level sign-flip 0.32, 0.46, 0.55, 0.74; sign-flip over (task, batch) block differences, one session per arm per block, 0.41, 0.62, 0.61, 0.84 (size 0.020 to 0.040); within-task permutation of arm labels across all sessions of a task 0.47, 0.64, 0.66, 0.86. The block-paired and within-task variants test the sharp null for these tasks only. Make one primary, state its estimand, and report the others as sensitivity.
   Rationale: Runs are the cheaper unit but are not independent draws of tasks; pairing by batch is natural because each batch holds one session per arm per task, and it controls time drift. The price is a narrower claim (these tasks), which the hand-picked task bank supports anyway.

5. [should] (Endpoints: multiplicity) Define families by decision rather than by list. Put judgment-model and judgment-effort in one family under Holm or a fixed sequence (model first at 0.05, effort only if model rejects); give the floor its own test, gated by the placebo equivalence as an intersection rule (both must hold, no alpha split). Say that 'significant' in the decision rules means the Holm-adjusted p, and state that at Holm's first step 7 nonzero same-direction tasks are the minimum for a family of 3 and also for a family of 2 at 0.025 (n=6 gives 0.031).
   Rationale: The decision rules use an 'either of 2 or 3' claim, which needs familywise control; the floor claim is a different decision. A family of three costs power (0.15 against 0.32 at the first step for 16 tasks and 2 runs). Holm needs no independence assumption, which matters because R sessions feed all three endpoints.

6. [must] (Decision rules: bound and equivalence) Derive the ±0.15 bound from the decision it serves (keep or shorten a 1,400-word skill, keep or drop the gate): break-even gain = skill and gate token cost per delegation divided by the saving per mis-tiered delegation avoided, using attempt 1's per-session costs, and state the result in tasks (0.15 of 16 is 2.4 tasks). Then add an equivalence-power calculation. My simulation at a true effect of zero, within-task agreement 0.3: chance the 95% bootstrap interval sits inside ±0.15 is 0.1% (16 tasks, 2 runs), 4.5% (16, 3), 2.1% (24, 2), 8.2% (24, 3); a 90% t-interval (TOST) gives 0.7%, 5.8%, 4.6%, 19.2%. At agreement 0.05 (near-deterministic) it is 47.5% and 66.5% at 16 tasks and 2 runs. The task-difference SD is 0.45 at 2 runs and 0.37 at 3, against about 0.31 needed at 16 tasks for a 95% interval within ±0.15.
   Rationale: Unless the bound is justified, a reader cannot judge the verdict; and unless the no-increment branch is reachable at the registered size, the rule is decoration. If it is unreachable, either widen the bound with a stated reason, raise the size, or delete that branch and say the trial can only confirm an increment or report the largest effect the interval excludes.

7. [should] (Endpoints: interval method) Replace or supplement the percentile bootstrap with an interval obtained by inverting the sign-flip test (the same test as the p-value), and use a TOST built from two one-sided sign-flip tests for any equivalence claim; give a rule for an all-zero or near-all-zero interval (report it as 'no variation observed', not as equivalence). Keep the bootstrap seed. In my check of coverage (true mean difference 0.25, 1,000 trials) the percentile bootstrap covered 98% at 16 tasks and 2 runs and 97.5% at 24 and 3, so it was conservative, not liberal, in that scenario; the degenerate case remains untested.
   Rationale: A test and its interval should share a null so the two cannot disagree; the cluster-asymptotic literature warns about few clusters, though it concerns cluster-robust standard errors, not this bootstrap.

8. [must] (Size, batches and stopping: batch rules) Write: batch 2 runs whatever batch 1 shows, unless a pre-registered infrastructure fault or the cost ceiling stops it; batch 1 data stay in the final analysis; the health check may use only arm-pooled operational counts (harness error rate, observer-record rate, total cost, turns), never per-arm outcome rates or per-arm cost; no efficacy stopping and no futility stopping on endpoint data. Order sessions by block randomization over (task, batch) with a recorded seed so that a cost stop leaves complete blocks, and analyze complete blocks only.
   Rationale: One look at the full planned size needs no alpha correction provided no decision depends on collected arm data; the sequential-analysis literature's condition is that the decision to look is not based on the data. Attempt 1's random order left only 13 of 20 tasks with both cells. Per-arm cost reveals the chosen tier.

9. [must] (Blinding, leakage and records: exclusions) Register a closed exclusion list evaluated by code from non-outcome fields before unblinding: (a) infrastructure faults that prevent the arm from being delivered (command-line overrun, plugin or hook failed to load, canary absent), with at most one rerun per session and the rerun reason recorded; (b) a failed fixture check. State what stays in: sessions that timed out after the observer recorded a first delegation; sessions where the skill was never invoked (intention to treat); sessions that never delegate (scored non-match, plus a sensitivity analysis dropping them). State the missing-cell rule: a task with no usable session in either arm of a contrast leaves that contrast; unequal run counts use the proportion of available runs, and the task count is reported.
   Rationale: Exclusion is where arm-dependent attrition enters; attempt 1 excluded five timed-out sessions that had all already delegated. The OSF guidance asks to say what exclusion rules will be applied.

10. [should] (Blinding, leakage and records: deviations) Add a deviation log schema (what, why, when, who decided, whether any arm-level outcome had been seen, endpoints affected) and a rule: any deviation made after arm-level outcomes were seen is flagged as sample-based and the planned and deviating analyses are both reported. Pre-declare the allowed branches (effort route fallback, I1 route, T23 dropped if I7 fails with n updated, hooks-free variant failing I6) so that taking them is not a deviation. Freeze the analysis script and the power script by hash before the first main-run session.
   Rationale: Deviations can raise or lower the severity of a test; unplanned data-dependent ones add unknown error inflation. Pre-declared branches keep the log short and the severe cases visible.

11. [should] (Tasks and Endpoints: denominators) Reconcile the class counts (T01 is an anchor yet counted effort-divergent; T12 and T21 are model-divergent by their predicted tier, not 'shape'), fix the divergent n and the floor n, and state the rule if I7 fails (15 and 22). Also compute, for the placebo contrast (P minus A0, named-model rate near 0.2), whether the interval can sit inside ±0.15 at the registered size, since the floor claim depends on it.
   Rationale: The sign-flip's n, the minimum p and the Holm thresholds all depend on these counts; a mislabelled class changes which tasks enter the primary set.

12. [consider] (Endpoints: effort endpoint) Consider making judgment-effort secondary or reporting it split into 'effort named' and 'named effort inside the band'. Only T03 and T10 are predicted effort-divergent; on all other divergent tasks effort agreement mostly measures whether an effort was named at all, which both the rule ('and effort where supported') and the skill ask for.
   Rationale: Shrinking the primary family from three to two raises power at every Holm step and removes an endpoint that may be near ceiling or mechanically driven.

## Gaps

- Power simulation: I ran code (Node v26.7.0, no numpy available, script piped on stdin so no file was written). Core script, verbatim as run (seed 20261011; exact p by dynamic programming over signed integer sums): function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}} const rnd=mulberry32(20261011); function binom(n,p){let k=0;for(let i=0;i<n;i++)if(rnd()<p)k++;return k} function exactP(D){const a=D.filter(d=>d!==0).map(Math.abs);const obs=Math.abs(D.reduce((x,y)=>x+y,0));const tot=a.reduce((x,y)=>x+y,0);if(a.length===0)return 1;let dist=new Map([[0,1]]);for(const v of a){const nd=new Map();for(const [s,c] of dist){nd.set(s+v,(nd.get(s+v)||0)+c);nd.set(s-v,(nd.get(s-v)||0)+c)}dist=nd}let cnt=0;for(const [s,c] of dist)if(Math.abs(s)>=obs)cnt+=c;return cnt/Math.pow(2,a.length);} function sim(nT,R,nEff,p0,p1,trials){let r05=0,r0167=0,r025=0;for(let t=0;t<trials;t++){const D=[];for(let i=0;i<nT;i++){const pt=i<nEff?p1:p0;D.push(binom(R,pt)-binom(R,p0))}const p=exactP(D);if(p<=0.05)r05++;if(p<=0.05/3)r0167++;if(p<=0.025)r025++;}return {alpha05:r05/trials,holm3_0167:r0167/trials,holm2_025:r025/trials};} // D_i = treatment successes minus control successes in task i (integer units; mean difference = sum(D)/(nT*R)). Main call: for [nT,R] of [[16,2],[16,3],[24,2],[24,3]]: sim(nT,R,nT/2,0.3,0.8,2000); null: sim(nT,R,0,0.3,0.3,2000). Equivalence check at true zero effect: per task d=(binom(R,p0)-binom(R,p0))/R; 'tost' = |mean| + t(0.95,n-1)*SD/sqrt(n) <= 0.15 with t=1.753 (df 15), 1.714 (df 23); 'boot' = 2.5th and 97.5th percentiles of 1,000 resamples of tasks inside [-0.15,0.15]; 1,000 trials. Results: power at alpha 0.05 for [16,2],[16,3],[24,2],[24,3] = 0.3225, 0.4575, 0.551, 0.7375; at alpha/3 = 0.1455, 0.236, 0.326, 0.5025; null size 0.019, 0.0235, 0.031, 0.0305. Minimum p 2/2^n: n=5 0.0625, 6 0.03125, 7 0.0156, 8 0.0078, 12 4.9e-4, 16 3.05e-5, 23 2.4e-7.
- Two follow-up scripts (also piped, not saved; seeds 777 and 4242; 1,000 trials each, so Monte Carlo SE is roughly 0.015) are described rather than reproduced: (a) within-task permutation, where each task's null distribution is the hypergeometric split of its pooled successes between the arms, convolved across tasks; (b) block-paired sign-flip, where each (task, batch) block contributes a run-pair difference in {-1,0,1} to the same exact routine. Also a bootstrap-versus-t coverage check for a true mean difference of 0.25. Their numbers are in the recommendations; I can supply the code if asked.
- Simulation limits: sessions are modelled as independent Bernoulli draws given the task and arm, with the 0.3 and 0.8 values taken from the task brief, not from data. Real sessions can drift with time, rate limits and model updates. The 'Holm' columns give power at the first-step threshold 0.0167 (or 0.025), which is the best case for the smallest p; I did not simulate the full Holm procedure for three correlated endpoints. I did not simulate the 23-task floor contrast or the placebo equivalence beyond the zero-effect cases listed.
- Sources I could not read: the fetch tool returned only binary for the PDFs of Cameron and Miller (2015), the FDA multiple-endpoints guidance, and the arXiv PDF 2408.12347 (which also turned out to be Rubin's paper, not Lakens's). So I have no live-fetched text on the pairs cluster bootstrap with few clusters, on the FDA or EMA rule for when a multiplicity adjustment is required, or on the body of Lakens's deviation paper (only its abstract on the TU/e portal). The NBER quote concerns standard cluster-robust tests, not the percentile bootstrap over tasks.
- Pre-registration templates: I read OSF's help page (definition, exclusions, analysis plan) but did not retrieve the OSF Prereg form itself or the AsPredicted questions (the homepage lacked them). My statements about what those templates ask beyond the quoted lines rest on a search summary and are unverified.
- Wikipedia is the only fetched source for the exact paired permutation (sign-reversal) test and for Holm; it does not state the minimum p-value. The 2/2^n ceiling is my derivation, checked in the simulation, not a quoted fact. I did not fetch Ernst (2004) or Phipson and Smyth (2010).
- Not verified: the cost of a capture-and-stop session (no data yet; probe I5 is meant to measure it), so the feasibility of 8 runs per cell is untested; and whether run-to-run variance on the divergent tasks is near-deterministic or near 0.3, which decides which row of the sensitivity grid applies.