# Research pillar: Building test items that discriminate, and avoiding ceiling and circularity

## Questions

### Q1. What is the unit of inference, and how many items does the claim need? The skill's ladder has roughly a dozen distinct rules, but the draft's 16 divergent items are stimuli sampled by hand from those rules. What may the result be generalized to?

Why here: The sign-flip test runs over tasks, so tasks are the sample. Runs add precision only inside a task. Several divergent items share one rule: T08 and T09 (fix re-verification); T10, T12 and T21 (lens review); T20 and T21 (workflow shape). A conclusion about the skill is therefore a conclusion about these items. My arithmetic for the exact test: with 8 tasks at +0.5 and the rest at 0, two-sided p is 2/256 = 0.0078. With 6 such tasks it is 2/64 = 0.031, which fails a Holm threshold of about 0.017. One reversed task among 8 raises it to about 0.07. The test is fragile unless many items truly move.

Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC5428747/
Quote: technically apply only to the precise stimuli used in each study

Draft: partly: Endpoints use a task-level sign-flip, but the Tasks section never says that 16 items cover about 12 rules, never fixes a target number of items per rule, and never says the conclusion is limited to these items.

### Q2. Which arm must show headroom for an item to count as difficult? The draft says 'the A0 and P arms test' the predicted unaided choice, yet the contrast that matters is RS minus R.

Why here: Attempt 1 shows A named a model on only 3 of 15 first delegations, and an omitted model scores as opus. A0 and P therefore cannot show whether an unaided reading picks haiku, sonnet or opus. Only R, and R- as the cleanest 'lowest sufficient' reading, can. Predictions of 'sonnet' or 'haiku' tested in A0 or P are untestable by construction. In CTT terms the control arm is R, and an item is informative only if R has room to move.

Source: https://testingservices.utexas.edu/interpreting-test-results
Quote: extremely difficult or easy items will have low ability to discriminate.

Draft: missing: The Tasks section and the Limits bullet on predictions assign the prediction test to A0 and P, not to R or R-.

### Q3. What is the target difficulty under the control arm, and how many runs are needed to estimate it? With 2 runs per cell, an item's R agreement can only be 0, 0.5 or 1.

Why here: Classical guidance puts useful items in a middle band, with 0.30 to 0.70 common for classroom tests. Items near 0.9 or above add almost nothing, and ATLAS discards items above 95% mean accuracy. Two runs cannot tell an R-agreement of 0.2 from 0.8, so the draft cannot tell a divergent item from a ceiling item from its own main-run data.

Source: https://testingservices.utexas.edu/interpreting-test-results
Quote: If almost all students responded correctly, an item addresses a concept probably not worth testing.

Draft: missing: Size, batches and stopping gives no item-difficulty target, and batch 1 is only a health check.

### Q4. What counts as ceiling or saturation here, and what rule moves an item out of the primary set? The draft needs a pre-set threshold, plus a rule that stops a mean diluted by ceiling items from reading as 'no increment'.

Why here: Attempt 1 failed this way. Thirteen tasks went in, one moved, and the interval reached past ±0.15. The new decision rule 'No material increment' again fires when the interval lies inside ±0.15. If half the primary items are at ceiling in R, that interval shrinks mechanically. The saturation paper defines the loss of discrimination relative to evaluation noise, which the draft has not estimated.

Source: https://arxiv.org/html/2602.16763
Quote: We define benchmark saturation as the loss of reliable discriminative power among top-performing models under comparison.

Draft: partly: Decision rules has an inconclusive branch and the Tasks section tags anchors, but nothing pre-sets an R-agreement ceiling or ties the 'no increment' verdict to items that had headroom.

### Q5. How can the divergent set be pre-registered without circularity when one author wrote the skill, the labels and the items, and also predicts the control-arm choice?

Why here: Selecting items on outcomes in the contrast arms is circular. Selecting them on prior, disjoint control-arm data, with criteria fixed beforehand, is outcome-neutral. The Registered Reports convention is to define ceiling and floor criteria and manipulation checks in advance and to review whether the data met them. The draft instead keeps failed predictions in the primary set.

Source: https://www.psychologicalscience.org/publications/ampps/registered-report-guidelines
Quote: outcome-neutral criteria (e.g., definitions of ceiling/floor effects, manipulation checks)

Draft: partly: Limits stated now says a failed prediction leaves the primary set only in a sensitivity analysis, which keeps ceiling items in the primary mean and sets no screening data or criteria.

### Q6. Are the labels derivable from the skill text by someone other than the author? Would two independent readers applying the 0.1.2 text to a prompt reach the same model and effort?

Why here: Several labels rest on a tie-break the skill does not state. T08 could be fix re-verification (sonnet) or a security-boundary read (opus). T13 asks for 'sonnet; high', but no skill row gives sonnet high to reasoning work. T20's verifier could be an open gate (opus) or an adjudication of enumerated findings (sonnet). T23's prompt satisfies the skill's own fork exception. An item whose label is not derivable scores noise and cannot show the skill's effect.

Source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
Quote: A good task is one where two domain experts would independently reach the same pass/fail verdict.

Draft: missing: Tasks lists one label per item with a one-clause 'rule tested' and no independent label audit.

### Q7. Does the prompt wording leak the label through shared vocabulary or framing cues? Examples are 'cheap subagent', 're-gate', 'one per lens', 'Design is settled' and 'No one has tried this yet'.

Why here: RS carries the skill text, and many prompts reuse the skill's own phrases. RS can then win by phrase matching, which measures keyword lookup, not judgment about the situation. Decoy phrases such as 'cheap subagent' turn the item into a test of obeying an explicit user instruction. Framing alone is known to change LLM behavior while the task is held fixed.

Source: https://arxiv.org/abs/2510.08624
Quote: hold task content and decoding fixed while varying framing (evaluation-oriented vs. real-world)

Draft: missing: Blinding, leakage and records covers case names, fixture text, placebo text and the observer denial text, but not prompt vocabulary overlap with the skill.

### Q8. What are the anchors for? As written they are labeled positive controls, but they are items where every arm is expected to agree.

Why here: An item with no expected effect is a negative control for the skill contrast. It checks that RS does not move easy cases, and it gives a ceiling reference. A positive control needs a planted effect. The only known-effect contrast in this design is R versus A0 on naming. The skill-judgment contrast has none. The benchmark-audit literature registers the positive control, and its manipulation-check floor, before the run. Balanced sets also need cases where the behavior should not occur.

Source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
Quote: Test both the cases where a behavior should occur and where it shouldn't.

Draft: partly: The Tasks section names 7 anchors as positive controls that 'the instrument still reads the obvious case', but no rule says what a failed anchor means, and the anchors duplicate each other (T01/T05, T06/T07, T14/T17).

### Q9. What is the planted-effect positive control for 'the skill transmits judgment', and what outcome is registered if it fails?

Why here: A null for RS minus R is uninterpretable if the skill was not read. Attempt 1 invoked the skill in 3 of 10 D sessions at medium effort, and 14 of 14 at xhigh. Items whose answer exists only in the skill text and is arbitrary to the model's priors (T19's re-run on fable, T23's fork rule) are natural planted-effect items. If RS cannot beat R there, the verdict should be 'instrument cannot see', not 'skill adds nothing'. The CleanScore authors fixed a manipulation-check floor beforehand and let a failed check end the study.

Source: https://arxiv.org/html/2609.22183
Quote: A manipulation check that comes in at -0.220 against a floor of +0.05 means no contamination was successfully planted

Draft: missing: Decision rules has no positive-control floor or skill-invocation floor; 'No material increment' can fire with the skill unread.

### Q10. What is the pre-registered action when a prediction fails?

Why here: With author-written predictions, a failure can mean the item was at ceiling, at floor, or mislabeled. Each needs a different action: demote to anchor, rewrite before registration, or drop. Fixing the rule in advance prevents post-hoc rescue, and the same document says what happens to the primary set. Public paper registries find that stated hypotheses are often too vague to test.

Source: https://arxiv.org/html/2609.22183
Quote: By the rule fixed in advance, that ends the study.

Draft: partly: Limits stated now keeps a failed-prediction task in the primary set and moves it only in a sensitivity analysis, and Measurement lists the prediction hit rate as descriptive, but there is no screening, rewrite or demotion rule.

### Q11. Are the predictions specific enough to be falsified? Each is a single word such as 'opus' or 'sonnet or opus', with no probability and no stated threshold for 'divergent in fact'.

Why here: A one-word prediction cannot be scored later except by hit or miss, and 'sonnet or opus' for T02 is nearly unfalsifiable. Stating P(R agrees) and P(RS agrees) per item before any data, ideally from a second forecaster who did not write the items, makes the author's model of the model visible and lets calibration be reported. Preregistration studies find that clear, testable hypotheses are hard to write.

Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC7725296/
Quote: clearly stating testable hypotheses and expectations is surprisingly challenging and an area for substantial improvement.

Draft: partly: The Tasks column 'Predicted unaided choice' is one word per item and Measurement reports the hit rate descriptively, with no numeric probabilities or threshold.

### Q12. How should items with negative or zero discrimination be treated? That is, items where RS agrees no better, or worse, than R.

Why here: IRT treats a negative discriminator as a defective or mis-keyed item, and the ATLAS preprint reports items of that kind. Here T03 may be one. Attempt 1's pilot has words-only haiku calls at low in all 4 listed B workers, which sits inside T03's label 'haiku; low', while C workers got medium (3 of 4). So R may already agree and RS may move away from the label. A label that the skill itself fails to reach would be noise or a mis-key.

Source: https://arxiv.org/html/2511.04689v2
Quote: static evaluations treat poorly discriminative items as equally informative as high-quality questions.

Draft: partly: Decision rules covers a significant negative endpoint, but nothing screens or reports item-level negative discriminators before pooling.

### Q13. Can multi-call items be scored from the first call only? T03 asks for 14 parallel subagents, T12 for 3 fanned reviewers 'each', and T20 and T21 for workflows with several call sites.

Why here: Instrument 1 records the first matching call and then denies it. Labels such as 'sonnet; high, each' and 'every call names a model' need all calls from the first assistant turn, and denying the first call may change how its parallel siblings are issued or logged. If only the first call is scored, the 'each' condition is unmeasured and the label is not mechanical.

Source: none fetched
Quote: none fetched

Draft: partly: Measurement defines 'First delegation' as the first call and applies a workflow role rule to scripts, but the observer in Instrument 1 does not say it logs all parallel Agent calls in the first turn.

## Recommendations

1. [must] (Tasks (A0 and P predictions)) Move prediction testing from A0 and P to R and R-. State each divergent item's prediction as a numeric P(R agrees) and P(RS agrees), signed and dated before any data. Add a second forecaster who did not write the items if one is available. Report a Brier score for all items at the end.
   Rationale: A0 and P rarely name a model (3 of 15 in attempt 1), so they cannot test a 'sonnet' or 'haiku' prediction. Numeric predictions are falsifiable and expose the author's circularity.

2. [must] (Size, batches and stopping (new item screen)) Add a screening run before registration. Run R only (and R- if affordable), at least 4 runs per task, blind to RS, on sessions that are disjoint from the main run. Register the rule now. R agreement of 0.5 or below is divergent. 0.8 or above becomes an anchor. In between is kept but flagged. Test the primary endpoints on main-run data only, never pooled with the screening runs.
   Rationale: Screening on control-arm data only keeps the selection outcome-neutral. Pooling the screen into the test would bias RS minus R upward because the selection used low R. Two runs per cell cannot separate 0.2 from 0.8.

3. [must] (Limits stated now (failed predictions)) Reverse the current rule. A task that fails screening leaves the primary set by the registered rule, and the full 16-item set is the sensitivity analysis. Make 'No material increment' conditional on at least a stated number of items that had R headroom (suggest 10 or more), the positive control passing, and skill invocation at or above 80% in RS.
   Rationale: Ceiling items dilute the mean and the interval, which is how attempt 1 ended inconclusive and how this protocol can end in a false 'no increment'.

4. [must] (Tasks (label audit)) Before registration, give two or three fresh subagents the 0.1.2 skill text plus each prompt, with no label, and ask for model and effort. Keep a label only if at least two-thirds of the independent readings agree with it. Items that fail are rewritten or dropped. Log the audit and the result.
   Rationale: Meets the 'two experts reach the same verdict' criterion with no model-execution cost beyond short reads. It also exposes tie-break gaps (T08, T13, T20, T23) and gives a reachable ceiling for RS.

5. [must] (Tasks (count and arithmetic)) Fix the class arithmetic. The text says nine on model, three on effort only (T01, T03, T10) and four on shape, but T01 is not in the 16-item list. My count is 10 on model (T02, T04, T08, T09, T11, T13, T15, T16, T19, T22), 2 on effort only (T03, T10) and 4 on shape (T12, T20, T21, T23). Also say that the 16 items cover about 12 rules.
   Rationale: A miscount in the registered text invites a post-hoc reclassification. The rules-to-items ratio determines what can be claimed.

6. [should] (Endpoints (unit and size)) Aim for at least 2 items per rule (about 24 divergent items), cluster the sign-flip by rule when twins share a rule, and add the claim restriction 'limited to these items and rules'. Pay for the extra items by cutting T01, T07 and T14 and by spending fewer runs per cell. Between-task variance, not run count, limits the test.
   Rationale: With zeros from ceiling, the exact test needs about 7 or more tasks that move with no reversals to clear a Holm threshold near 0.017. Extra runs do not help; extra non-ceiling items do.

7. [should] (Tasks (twin items)) For the highest-leak items, write a skill-vocabulary version and a plain-wording version of the same situation and report agreement for each. The gap measures phrase matching. Candidates: T09 with its plain rewrite below, T12, T19, T21.
   Rationale: RS can match skill phrases without having learned the doctrine. A twin pair separates the two readings at a cost of a few extra items.

8. [should] (Tasks (anchors)) Rename the anchors 'negative controls for the skill contrast'. Keep one per ladder row: T05 (haiku), T06 (sonnet), T17 (opus), T18 (fable). Cut T01 as a standalone anchor, T07 (duplicate of T06) and T14 (duplicate of T17). Make T01 the exact twin of T02 with the importance sentence removed, so T02 minus T01 measures the cue within each arm. Register that anchors must show RS minus R within ±0.1 or the skill is moving easy cases.
   Rationale: Anchors are expected nulls, not known effects. Attempt 1 already has haiku, sonnet, opus and fable rows at 3 of 3 or 4 of 4 agreement across set-ups.

9. [must] (Decision rules (positive control)) Register a planted-effect positive control: items whose correct answer exists only in the skill text and is arbitrary to the model's priors (T19-style fable re-run, and the fork rule). Pre-set a floor such as RS minus R at or above +0.3 on them. If it fails, report 'instrument cannot see' and not 'no increment'. Also register a skill-invocation floor (suggest 80% of RS sessions), with an intention-to-treat result and a per-protocol result.
   Rationale: Without it, a null can mean the skill was not read. Attempt 1's D arm invoked the skill in 3 of 10 sessions at medium effort and 14 of 14 at xhigh.

10. [should] (Measurement (parallel calls)) Make the observer log every Agent and Workflow call in the first assistant turn, and score fan-out labels on that list. State how the denial of the first call interacts with siblings, and test it in probe I5 with a prompt that asks for 3 parallel subagents.
   Rationale: T03 (14 calls), T12 (3 reviewers 'each') and T20 and T21 cannot be scored on the stated labels from the first call alone.

11. [should] (Tasks: T01) Drop T01 as a standalone anchor or make it the plain twin of T02. It is a tier-neutral duplicate of T05, the label allows low and the draft predicts 'haiku, effort omitted or low', so the prediction is not divergent. Attempt 1's pilot 'inventory' rows show B, C and D at haiku, 2 of 2 each. Suggested twin wording: 'Use a subagent to list every file under <fx>/scripts with its first comment line, word for word.'
   Rationale: Ceiling for every model-naming arm, no pull against the label, and the class 'anchor (effort divergent)' contradicts itself.

12. [consider] (Tasks: T02) Keep as the importance-decoy, but treat as at risk of ceiling in R (file listing is an easy haiku call even with 'exactly right'). It must pass the R screen. 'Word for word' also echoes the skill's 'verbatim extraction' row. Pair with the T01 twin so the importance sentence is the only difference.
   Rationale: A single decoy sentence is a weak pull. The pair isolates its effect and shows if R ignores it.

13. [should] (Tasks: T03) Reclassify the effort cell. The model is at ceiling in attempt 1's T03 (haiku in all four set-ups, including A). The pilot's words-only haiku workers were at low (4 of 4), inside the label 'haiku; low', while C workers were at medium (3 of 4). So R may already agree and RS may disagree, which makes the draft's R prediction ('medium') doubtful. Register the sign of the expected RS minus R as undetermined, or drop T03 from the effort endpoint.
   Rationale: The prediction is contradicted by the attempt-1 pilot, and a negative item pooled into endpoint 3 weakens it.

14. [must] (Tasks: T04) Replace. 'A quick inventory job for a cheap subagent' puts the decoy answer in the prompt, so agreement then measures obedience to an explicit instruction. It also relies on the fixture making the match a real judgment call. Suggested wording: 'Have a subagent inventory the items in <fx>/docs/ROADMAP.md and say for each whether <fx>/CHANGELOG.md shows it shipped, and list any it cannot call.' Build the fixture so at least a third of the items are worded differently in the changelog, and verify that with a haiku worker run before registration.
   Rationale: 'Cheap' and 'inventory' leak the haiku answer. If matching is exact, haiku is sufficient and the sonnet label is wrong.

15. [should] (Tasks: T08) Keep but register the tie-break that decides the label: the 'Tiering verification work' table (target enumerated, so fix re-verification) outranks the 'security-boundary read' row. Note that attempt 1's near-identical T09 had B and D at sonnet, so the opus prediction rests only on the added security subject.
   Rationale: Two skill rows can apply and the label picks one without saying so.

16. [must] (Tasks: T09) Replace. It reuses the skill's own terms ('re-gate', 'fixes', 'open review'), and attempt 1's near-identical T12 had B, C and D all at sonnet, so R likely agrees and the opus prediction is probably wrong. Suggested wording without skill vocabulary but with an upward pull: 'Before I ship, confirm that the two problems flagged in the last review of <fx>/hooks/validate.js (unsigned payloads accepted; size limit hard-coded) are actually fixed in the current file. This is the last thing before release.'
   Rationale: Ceiling for R and a leak for RS. The rewrite keeps the enumerated-fix structure and adds a ship-time cue that could pull an unaided reading up to opus.

17. [should] (Tasks: T11) Replace 'Design is settled'. It echoes the skill's selection question 4, and attempt 1's sonnet pick in C suggests R also picks sonnet on the model (only effort high may differ). Suggested wording: 'Add a --json flag to <fx>/scripts/check-version.js. When passed, it prints one line of JSON with ok, from and to instead of the text message and exits with the same code. This script gates our release pipeline. Have a subagent write the patch as a unified diff in its reply, without editing files.'
   Rationale: Removes the skill phrase, keeps near-code design in the task itself, and adds a consequence cue that supports an opus pull.

18. [should] (Tasks: T12) Replace 'one per lens'. Suggested wording: 'I want three independent adversarial reviewers of <fx>/hooks/validate.js. Each takes a different area: input handling, error paths, logging. Fresh subagents, each unaware of the others.' Also fix the 'each' scoring (see Measurement).
   Rationale: 'Per lens' is the skill's own phrase. The adversarial and independent cues stay as the decoy.

19. [must] (Tasks: T13) Delete 'No one has tried this yet'. It signals the skill's 'only where sonnet has fallen short' condition. Change the label from 'sonnet; high' to 'sonnet; medium or high' (the skill gives sonnet two rows and neither names reasoning work), or restore attempt 1's either-set. Attempt 1's T16 is the evidence: B opus, C and D sonnet.
   Rationale: A narrow label without a derivable effort invites mislabeling; the leak turns the item into a lookup.

20. [should] (Tasks: T14, T17, T18 (anchors)) Keep T17 and T18, drop T14. All three reuse skill phrases (T14: 'nobody has listed yet', 'fresh'; T17: the skill's production-config example; T18: opus at xhigh missed). Attempt 1 had T17-equivalent at opus in B, C and D, and T18-equivalent at fable in all four set-ups including A. Fine as anchors and not as skill-judgment evidence.
   Rationale: Leak is acceptable only where ceiling is the intent. T18 is at ceiling even in A0.

21. [consider] (Tasks: T16) Keep as a decoy ('Quick check, nothing formal') but expect ceiling risk in R: a security read is a strong opus prior. Require it to pass the R screen. Register that the label follows selection question 1 (difficulty, not tone).
   Rationale: The casual-tone cue is the only pull, and the skill never says tone is irrelevant.

22. [should] (Tasks: T19) Use as the planted-effect positive control, but write a plain twin. The current prompt transcribes the skill rule ('I don't accept it', 'the evidence it cites is wrong', 'No fix has landed', 'Re-run the gate'). Twin: 'The review of <fx>/hooks/validate.js that the opus subagent returned says the file is sound, but the check it cites is not in the file. Nothing in the code has changed since. Get the review done again.' Drop 'once' from the label, since a first-call score cannot test it.
   Rationale: It is an arbitrary rule that exists only in the skill, so it separates 'read the skill' from 'judged well', and the twin measures phrase matching.

23. [must] (Tasks: T20) Fix the label ambiguity, since a verifier of enumerated findings is arguably adjudication (sonnet). Attempt 1's T19 had B and D both at sonnet for the verifier. Suggested wording: 'Write and launch a workflow with the Workflow tool: one finder per file in <fx>/scripts looking for unhandled errors, then one agent that reviews the combined findings and the scripts for anything the finders missed.' That makes the last agent an open gate (opus, high or xhigh).
   Rationale: As written the verifier label contradicts the skill's own verification table, and both attempt-1 arms disagreed with it, which implies a floor in R and RS.

24. [should] (Tasks: T21) Add the missing pull, since 'reviewers' alone reads as sonnet. Suggested wording: 'Launch a workflow with the Workflow tool: three adversarial reviewers of <fx>/docs/HOOKS.md, each trying to break the document along one area (accuracy against <fx>/hooks, clarity, internal consistency), then one agent that merges their findings.' Attempt 1's version had no scored cell, so there is no evidence either way.
   Rationale: Without 'adversarial' or 'gate', R likely already picks sonnet (ceiling on model), and the draft's opus prediction has no cue behind it.

25. [should] (Tasks: T22) Replace or cut. Release notes from a changelog are a routine sonnet job that R is likely to pick, which makes the opus prediction weak. Also 'in the voice of the existing notes' echoes 'pattern-following'. If kept as a pull-up decoy, use: 'Have a subagent write the release notes for <fx> from CHANGELOG.md and the docs, one paragraph per changed area, in the voice of the existing notes. These go out to customers under our company name.'
   Rationale: Ceiling risk in R, and the label excludes haiku although a haiku worker could plausibly do format-like work.

26. [must] (Tasks: T23) Move to exploratory or cut. The prompt says 'Fork', so a model that obeys the user is scored as wrong. 'It already has the context it needs' also states the shared-context exception, so the skill itself allows a fork there. Counting it in the floor endpoint also penalizes a correct fork, which takes no model.
   Rationale: The label is internally inconsistent with the skill text, and the item tests instruction-versus-rule priority, not tier judgment.

27. [consider] (Tasks: T24 and T25) Keep T24 only as a negative control for the delegation-rate question (expected rate at or below a registered value in every arm). For T25, state that the label is uncontested only if the labelers agree: 'one-line summaries' may be haiku or sonnet. Both stay out of the floor endpoint.
   Rationale: T24 is a near-certain zero and T25's label is ambiguous. Neither can discriminate between arms.

28. [consider] (Tasks (file spread)) Spread the items across more files. Seven of 25 tasks (T08, T09, T12, T14, T16, T18, T19) target <fx>/hooks/validate.js. A quirk of that single file can affect many items at once.
   Rationale: Item dependence through a shared target inflates apparent consistency across items.

## Gaps

- The Wells and Windschitl PDF and the Prometric CTT page were not readable (a compressed PDF and an HTTP 403), so the stimulus-sampling quote comes from the Westfall et al. paper and the CTT thresholds from the UT Austin page. All quotes passed through WebFetch's summarizing model and were not compared with raw page text.
- The sentence 'an experiment that is allowed to be repeated until it works is not a positive control' appeared in a search summary but was not found on the fetched CleanScore page (only the first 100,000 characters were read), so I did not rely on it.
- I found no live source on pre-registering predicted control-arm behavior for LLM-as-subject evaluations specifically. The recommendations adapt Registered Reports and benchmark-audit practice by analogy, and the benchmark-audit source is an ML preprint, not a behavioral-science standard.
- The IRT information-function claim (maximum at theta equal to b) comes from a search summary and the Columbia page's wording about the 'apex of the curve'. The ATLAS preprint was read only to character 100,000 of 121,284 and its negative-discrimination statistic was not seen on the page.
- My ceiling and leak flags are judgments from attempt 1's per-task cells (mostly one run per cell, pilot cells two) and the skill text. No item was run and the fixture does not exist yet, so none of the R-arm agreement estimates is measured. Several are inferences from near-identical but not identical prompts.
- The exact-test arithmetic (8 tasks at +0.5 gives p of about 0.0078, 6 gives about 0.031, one reversal gives about 0.07) is my own calculation under a mean-difference sign-flip on 8 or 16 tasks. I did not run a simulation.
- I did not assess the capture-and-stop observer, the harness, or the endpoints beyond what bears on item design, and I did not test how parallel Agent calls behave under the observer's denial.