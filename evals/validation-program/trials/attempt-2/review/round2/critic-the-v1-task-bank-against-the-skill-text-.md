# Critic lens: The v1 task bank against the skill text (SKILL-0.1.2.md), checked against attempt 1's B-arm data

Verdict: As written, the bank is unlikely to deliver ten clean primary tasks, and three candidates fail against the skill text. D2's role has no endpoint. D9's sonnet label rests on a line-64 sentence that governs recurring tasks, and v1's own findings call that case unlabeled. D23's \"touches the signature header\" is a judgment, which line 27 sends to sonnet. Attempt 1's B arm agreed on every analog of D1, D3, D4, D5 and D22 (8 of 8 runs). One of those analogs, T12, is D5's own vocabulary twin. D7 and D16 face no lure R would take. So 7 candidates are likely anchors. Under the author's predictions the strict screen (2 or fewer of 4) yields about 11.8 survivors. Under rates I estimated from the analogs (an assumption, not data) it yields about 8.5, with P(at least 10) near 0.28. The four-run screen also admits 3-of-4 tasks as \"flagged\" with no consequence. Survivors will skew toward under-provisioning labels, because arm B over-provisioned on 0 of 13 first delegations in attempt 1. Neither pair isolates what it claims: D16 hands every arm the diagnosis and the tier, and the D9/D10 and D16/D25 pairs differ on four or five dimensions with no registered contrast. Line 117 inverts the twins: the listed wording is the plain one. D13's \"plain\" wording already says \"gate\", and its role as the M3 positive control is unverified, since arm B chose fable on the nearest analog. Seven of 18 candidates still target validate.js and ratelimit.js has none, contrary to ledger row W06. The anchor band of ±0.10 cannot be met at 2 runs and fires on noise about 70% of the time across six anchors. Model-naming prompts compress M1, F3 and E2. Several fixture facts the tasks need are unlisted (N2's output path, D16's main(), D25's exit code). The fix is a bounded rewrite of text and design, not a new bank. Rewrite the D16/D25 and D10 pairs as minimal pairs. Reword D23, D12, D3, D5 and D13. Move D2 and D7 to the anchors and D5 and D8 to ratelimit.js. State the screen in counts, with pre-written replacements screened in the same block. Make the anchor and direction checks pooled. Score E1 on plain wordings. Report M1 and F3 without model-naming prompts. The bank can then plausibly reach ten survivors, but E1's reading must name the direction its survivors cover.

## Attacks

### B01 [KILLS] target: D2

Attack: D2 cannot survive the screen, and the role it is given has no endpoint. It is predicted at 0.9 on model, and the screen admits on model agreement, so it is predicted to become an anchor. Its stated role ("effort only: registered sign undetermined; secondary") has no endpoint: E2 scores effort named, not effort band, and above-band effort is only descriptive. Attempt 1's arm B chose haiku on the same task (T03) and on the pilot inventory task. Fourteen parallel calls against a label not marked "every call" also leave the scored call undefined (line 173).

Required edit: Remove D2 from the candidate table. Either make it the haiku-low anchor, or list it under Exploratory as "effort band of 14 parallel haiku calls, every call, per arm". Use the freed slot for a replacement aimed at an under-provisioning row (see B07 and B19).

Evidence: PROTOCOL-v1 line 124 (D2 row), lines 195-197 (E1 is model agreement, E2 is effort named), line 173; FULL-RESULTS line 130 (T03, B haiku); PILOT-RESULTS line 103 (inventory, B 2/2 haiku).

Checkable: No endpoint in PROTOCOL-v1 lines 187-210 scores the effort band on D2; E2 (line 197) is the effort-named rate.

### B02 [KILLS] target: D9 label

Attack: The primary label "sonnet; medium or high" cites line 64. But line 64's "when unsure whether `sonnet` suffices, try it once, inspect, and move up on evidence" follows "For recurring tasks, decide with custom evaluations...:", so it governs recurring tasks, and D9 is a one-off. No sonnet row names reasoning (lines 19-20). Line 21 gives reasoning-heavy work to opus "where sonnet demonstrably falls short", which is indeterminate for a first attempt. v1's own Findings section says so (line 270: "leaves a first attempt unlabeled"), and attempt 1 labelled the analog "either agrees". A task the protocol calls unlabeled cannot carry a single-tier primary label. Under the union label, R's opus (T16, arm B opus) agrees, so the task cannot move.

Required edit: Label D9 "sonnet or opus" (attempt 1's label) and take it out of the candidate set. Keep it only as the descriptive partner of D10 (B04). Stop citing line 64 for one-off tasks anywhere in the bank.

Evidence: SKILL-0.1.2 lines 19-21, 64; PROTOCOL-v1 lines 130, 270; attempt-1 PROTOCOL line 43; FULL-RESULTS line 143 (T16, B opus).

Checkable: SKILL-0.1.2.md line 64 reads "For recurring tasks, decide with custom evaluations drawn from real workloads, not public benchmarks: when unsure whether `sonnet` suffices, try it once, inspect, and move up on evidence."

### B03 [KILLS] target: D23 label

Attack: "Every line ... that touches the signature header" requires deciding which of 250-350 lines reach the header through calls and variables. That is a judgment, and line 27 moves judgment off haiku: "the judgment is the work, so it goes to sonnet at medium, not haiku at high." A sonnet choice in RS is therefore skill-endorsed but scored as an error under the haiku label. Under a dual label (haiku or sonnet), R agrees unless it picks opus. The task cannot discriminate either way.

Required edit: Make the selection lexical: "Pull out, word for word, every line in `<fx>/src/guard/validate.js` that contains the text `signature`, with its line number; a subagent can do this." Add to the property list the count of such lines (for example 9 to 14), with at least two of them in comments or log calls. The label stays haiku; medium, low allowed. The security subject remains the lure.

Evidence: SKILL-0.1.2 lines 18, 27; PROTOCOL-v1 line 139.

Checkable: SKILL-0.1.2.md line 27 contains "the judgment is the work, so it goes to `sonnet` at medium, not `haiku` at high".

### B04 [BOUNDS] target: D9/D10 pair

Attack: The pair claims to isolate "sonnet first; opus after a demonstrated shortfall", but D10 differs from D9 in five ways: a prior attempt; a named tier and effort; a named gap (the null-field case); the verb ("settle" against "work out"); and the dropped "with an argument or a counterexample". The named gap invites line 64's setup branch ("under-specified prompt, missing anchors"): re-dispatching sonnet with the null case spelled out is a defensible reading, so D10 has a second label. No endpoint compares D9 with D10, so "pairs with" registers nothing. D10's 0.6 prediction is also low: after a named failure, arm B escalated on T17.

Required edit: Reword D10 as D9's sentence plus history only: "A sonnet subagent at high effort was asked to work out, with an argument or a counterexample, whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one in the same input. Its argument was incomplete and it gave no counterexample. Have a subagent work it out." Register a descriptive pair contrast: P(opus | D10) minus P(opus | D9) in RS, against the same difference in R. Raise D10's prediction to at least 0.7.

Evidence: PROTOCOL-v1 lines 130-131, 187-210; SKILL-0.1.2 lines 21, 64; FULL-RESULTS line 144 (T17, B fable).

Checkable: No endpoint in PROTOCOL-v1 lines 187-210 names D9 or D10.

### B05 [BOUNDS] target: D16/D25 pair

Attack: D16 gives every arm both the diagnosis and the fix ("because my prompt said `main()`... naming `run()` this time"), and it names the label tier (sonnet, medium). Keeping sonnet is the only sensible reading with or without the skill, so the 0.5 prediction is not credible, and every arm, A0 included, can agree by echo. D25 differs from D16 in file, feature, prior effort, failure count and failure type. "Against an exact spec" does not say the spec covered the exit code, so line 64's setup branch (add the exit-code requirement and retry on sonnet) is a second reading of D25. The pair confounds setup against capability with five other differences, and no endpoint compares the two tasks.

Required edit: Rewrite both on one file, feature, tier, effort and failure count, varying only whether the spec was at fault. D16': "A sonnet subagent at high effort wrote the `--json` patch for `<fx>/src/cli/check-version.js` twice, and both diffs broke the exit code. I've since found my spec never said what the exit code should be: 0 on success, 1 when the versions differ. Have a subagent write the patch again with that added." Label: sonnet; high. D25': "A sonnet subagent at high effort wrote the `--json` patch for `<fx>/src/cli/check-version.js` twice against a spec that states the exit codes (0 on success, 1 when the versions differ), and both diffs broke the exit code anyway. Have a subagent do it right." Label: opus; medium to xhigh. Register a descriptive difference-in-differences: [P(opus|D25') minus P(opus|D16')] in RS, minus the same quantity in R. Add the exit-code behavior to the property list.

Evidence: PROTOCOL-v1 lines 137, 140; SKILL-0.1.2 line 64 ("rule out setup first ... then re-dispatch one tier up") and line 37.

Checkable: The D16 prompt states both the setup cause and its correction ("naming `run()` this time"), and D16 and D25 name different files (publish.js and check-version.js).

### B06 [BOUNDS] target: Predictions for D1, D3, D4, D5, D22 (and D7, D16)

Attack: Every candidate with a B-arm analog on which B agreed is predicted at 0.5 or 0.6. D1: pilot extract, B haiku 2/2. D3: T04, B sonnet, on a wording without the inventory lure. D4: T09, B sonnet on named fixes. D5: T12, B sonnet, and T12 is D5's own vocabulary twin ("Run the round-2 re-gate", after a "Last round's open review"), the harder wording. D22: T08, B sonnet, and pilot fidelity, B sonnet 2/2. That is 8 of 8 analog runs in agreement. D7 and D16 have no B cell but face R's frugality cue. These tasks are the likely anchors. Two v1 changes also weakened lures. D3 gained "and list any it cannot call", which announces the judgment. D5 lost round one's tier, which was its anchor toward opus in round 1's A05 wording.

Required edit: Revise predictions to at least 0.7 for D1, D4 and D22, and at least 0.8 for D5, D7 and D16, citing the analog line for each. Strengthen two lures without skill vocabulary. D5: "Round one of the review of `<fx>/src/guard/validate.js` ran on opus at xhigh effort and found two problems..." (add D5 to the model-naming list in B10). D3: drop "and list any it cannot call". Write the replacements for the expected anchors before the screen, not after it (B07).

Evidence: PILOT-RESULTS line 91; FULL-RESULTS lines 131, 135, 136, 139; attempt-1 PROTOCOL line 39; round1 critic A05 required edit.

Checkable: FULL-RESULTS.md line 139 records T12, whose prompt contains "Run the round-2 re-gate", as sonnet in arm B, the label tier.

### B07 [BOUNDS] target: The screen: can 18 candidates yield ten survivors at 0.5?

Attack: With four runs, R agreement takes only the values 0, .25, .5, .75 or 1. "At or below 0.5 enters; at or above 0.8 anchor; between, flagged" therefore means: 2 or fewer of 4 enter primary, 3 of 4 enter primary flagged, 4 of 4 become an anchor. The 0.5 threshold is in effect 0.75, and "flagged" has no consequence in E1. Under the author's own predictions, independent binomials give an expected 11.8 tasks at 2 or fewer of 4 (P of at least 10 about 0.89), and 16.1 at 3 or fewer. Under rates I estimated from the B-arm analogs, the expected count at 2 or fewer of 4 is 8.5 and P(at least 10) is about 0.28. Those rates are an assumption, not data: D1 .7, D2 .95, D3 .6, D4 .7, D5 .8, D7 .8, D8 .4, D9 .4, D10 .8, D11 .4, D12 .5, D13 .4, D14 .4, D15 .6, D16 .8, D22 .8, D23 .5, D25 .7. A true-0.7 task passes at 2 or fewer of 4 35% of the time and then regresses in the main run, so a power grid fed raw screen rates overstates power.

Required edit: State the screen in counts. Admit 2 or fewer of 4 to the primary set. Send 3 of 4 to a sensitivity set outside E1. Either run 8 screen sessions per task (admit 4 or fewer of 8), or keep 4 and screen 4 to 6 pre-written replacements in the same block, aimed at rows where B missed (open-ended design, a gate after a workflow fan-out, escalation). Feed the power grid shrunken R rates, for example Beta(1,1) posterior means, not raw screen proportions.

Evidence: PROTOCOL-v1 line 166; binomial computation with n=4 run during this review via node -e (no file written).

Checkable: With four runs per task, the only attainable R agreement strictly between the 0.5 admission bound and the 0.8 anchor bound in PROTOCOL-v1 line 166 is 0.75.

### B08 [BOUNDS] target: Wording twins (D5, D8, D13, D14, D15)

Attack: Line 117 says each twin describes the same job "without the skill's own terms", but the table's twins add the terms ("Run the round-two re-gate", "one per lens", "run the gate again", "one gate"). The listed wording is the plain one, and the twin is the vocabulary one. D13's listed wording is not plain: it already says "An opus gate at xhigh effort", so its twin changes one noun and isolates nothing. Runs alternate wordings within each cell, and E1 pools them, so half the confirmatory runs on five tasks carry the skill's coined terms. The screen's wording is unspecified. Each vocabulary twin does fit its label: line 56 for re-gate, per lens and "re-run that gate once on fable", and line 60 for "one gate". T12 shows the re-gate wording did not lure R.

Required edit: Rewrite line 117: "D5, D8, D13, D14 and D15 have a vocabulary twin that adds the skill's term; the listed wording is plain." Make D13's listed wording plain: "An opus review at xhigh effort of `<fx>/src/guard/validate.js` called it sound; ...". Its twin becomes "An opus gate at xhigh effort ... Have a fresh subagent run the gate again." Screen the plain wording only. Score E1 on the plain wording, and register RS minus R on the vocabulary wording as a sensitivity analysis.

Evidence: PROTOCOL-v1 lines 117, 127, 129, 134-136, 260; SKILL-0.1.2 lines 56, 60; FULL-RESULTS line 139.

Checkable: The D13 prompt at PROTOCOL-v1 line 134 already contains the word "gate", the word its twin note gives as the twin's change.

### B09 [BOUNDS] target: D13 as the M3 task

Attack: M3 needs R to miss D13, and nothing shows that it will. The nearest analog, T17 (an opus xhigh review missed a defect; "get a stronger independent review"), drew fable in arm B and in every other arm. The 0.2 prediction has no analog behind it. D13 is a screen candidate, so 4 of 4 in R makes it an anchor with 2 runs per arm. M3's consequence ("a rule that exists only in the skill text did not transmit") would then read R's ceiling as instrument blindness, although R can reach fable here without the ladder.

Required edit: Exempt D13 from the screen's anchor branch: register it as the M3 task with 6 runs per cell in R and RS whatever the screen shows. Make M3 conditional: if D13's screen rate in R is 3 of 4 or higher, report M3 as uninformative, not as failed. Consider a second M3 task whose rule R cannot reach without the skill, such as D8's per-lens rule in plain wording, if it passes the screen.

Evidence: PROTOCOL-v1 lines 134, 166, 191; attempt-1 PROTOCOL line 44; FULL-RESULTS line 144.

Checkable: FULL-RESULTS.md line 144 shows arm B choosing fable on T17, an escalation after an opus xhigh review fell short.

### B10 [BOUNDS] target: Prompts that name a model: D10, D13, D16, D25, N4, X3

Attack: Naming a model in the prompt affects scoring in four ways. (1) M1 and F3 measure naming. A prompt that names a model lifts naming in P, A0 and Bc: in attempt 1, arm A named only 3 models, and one was fable on T17, whose prompt names opus. That compresses R minus P and Bc minus A0 on these tasks. (2) Echo is asymmetric. D16 names its own label tier, so copying it agrees. D10, D13, D25 and N4 name the tier below their label, so copying disagrees. (3) All six prompts mention an effort level, which primes effort naming in both arms of E2. (4) An omitted model scores as opus, so on D10 and D25 an omission agrees in A0, P and S.

Required edit: Compute M1 and F3 on prompts that name no model, and report the model-naming prompts beside them. Report E2 with and without effort-mentioning prompts. Add an echo-direction column (echo agrees / echo disagrees) to the label table. Apply all three to D5 if B06's rewording is adopted.

Evidence: PROTOCOL-v1 lines 131, 134, 137, 140, 149, 161, 175, 189, 197, 203; FULL-RESULTS lines 144, 151.

Checkable: FULL-RESULTS.md line 151 lists arm A's first-delegation tiers as "omitted(opus) 12, haiku 2, fable 1", and the fable is T17, whose prompt names opus.

### B11 [BOUNDS] target: Concentration on validate.js and shared fixture state

Attack: 8 of the 24 primary and anchor tasks (D4, D5, D8, D12, D13, D22, D23, N4) target validate.js, and D15 reviews against src/guard. That is 7 of the 18 candidates. ratelimit.js is in the fixture but no task names it, although ledger row W06 records the v1 change as "spread over validate.js, ratelimit.js, lint.js, publish.js". guard-review.md, which "calls the file sound", is in every session, so every validate.js task can find a prior verdict before choosing a tier. D4's third "fix", a catch around parseHeader() that logs and continues, is a fail-open pattern that answers D12's question. How the fixture implements it decides the tier an orchestrator that reads the file will choose in D4, D5, D12 and N4.

Required edit: Move D5 and D8 to `<fx>/src/guard/ratelimit.js` and list properties for them: two fixed defects for D5; input handling, error paths and logging for D8. Put guard-review.md only in D13 sessions, as a task overlay identical across arms. State in the property list whether the parseHeader() catch fails open. Register the sensitivity analysis that collapses the remaining validate.js tasks into one stratum. Reconcile ledger row W06 with the bank.

Evidence: PROTOCOL-v1 lines 109, 126-127, 129, 133-134, 138-139, 149; REVIEW-LEDGER line 70.

Checkable: In PROTOCOL-v1, `ratelimit` occurs only on line 109 (the Fixture section), and eight task rows name validate.js.

### B12 [BOUNDS] target: D8 label

Attack: Line 56 sends a per-lens fan-out to lens review "whatever its label says", but what it overrides is the name (gate, adversarial), not the subject. A reviewer "looking only at input handling" of a signature validator is also a security-boundary read (line 22, opus high to xhigh). D8 has the same two-row conflict as D4, but no dual label. Under every-call scoring, one opus input-handling call fails the whole set.

Required edit: Move D8 to ratelimit.js (B11), or add a sensitivity label: "opus, high or xhigh, accepted on the input-handling call". Name line 22 in D8's rule column either way.

Evidence: SKILL-0.1.2 lines 22, 53, 56; PROTOCOL-v1 line 129.

Checkable: SKILL-0.1.2.md line 22 lists "security-boundary reads" in the opus high-xhigh row, and D8's label in PROTOCOL-v1 line 129 carries no sensitivity label.

### B13 [BOUNDS] target: D4 tie-break and prediction

Attack: The tie-break ("the verification table outranks the ladder row for an enumerated target") is registered as the author's own, but line 46, the verification section's governing sentence, supplies its textual basis. Citing it keeps the primary label a reading of the skill rather than an addition to it. The 0.5 prediction is low against T09 (B sonnet on named fixes). The security lure only works if the orchestrator reads the parseHeader() catch as fail-open (B11).

Required edit: Cite line 46 as the basis of D4's primary label. Keep opus high or xhigh as the sensitivity label. Raise the prediction to 0.7. Fix the parseHeader() behavior in the property list.

Evidence: SKILL-0.1.2 lines 22, 46, 51; PROTOCOL-v1 lines 126, 268; FULL-RESULTS line 136.

Checkable: SKILL-0.1.2.md line 46 reads "The tier follows how enumerated the target is: the less anyone has named what to look for, the higher the tier."

### B14 [BOUNDS] target: D7

Attack: D7 was built to diverge on effort (high against medium), but E1 scores the model, and the registered rule "below the label's band agrees" already accepts medium. "Medium accepted in sensitivity" therefore changes nothing. On model, R has no reason to pick opus when "the spec is exact and agreed" and its own text says "lowest tier sufficient"; the T11 analog drew sonnet in C (B has no cell). D7 will most likely become an anchor, and line 20 currently has no anchor.

Required edit: Move D7 to the anchors as the line-20 anchor (sonnet; high) and delete "medium accepted in sensitivity".

Evidence: PROTOCOL-v1 lines 128, 146-151, 177; FULL-RESULTS line 138; SKILL-0.1.2 line 20.

Checkable: PROTOCOL-v1 line 177 scores below-band effort as agreement, so sonnet at medium already agrees with D7's "sonnet; high" label under the primary scoring.

### B15 [BOUNDS] target: User framing in D12 and D3

Attack: v1 removed "cheap" from D3 as a user instruction (ledger A03), yet it keeps "Quick check, nothing formal" in D12 and "A quick inventory job" in D3. "Nothing formal" scopes how deep the review goes, and an orchestrator that honors it is obeying the user. That is the obedience reading round 1 removed elsewhere. The bank states no rule on whether a characterization of rigor or speed is a lure or an instruction.

Required edit: State the rule once: prompts may characterize the stakes or the user's expectation, but never set cost, speed or rigor. Reword D12: "I'm fairly sure the answer is no, but could a crafted payload make `<fx>/src/guard/validate.js` let an unsigned message through? Have a subagent take a look." Reword D3 to "An inventory job for a subagent: ...", dropping "quick".

Evidence: REVIEW-LEDGER line 52; PROTOCOL-v1 lines 125, 133.

Checkable: The D12 prompt contains "nothing formal" and the D3 prompt contains "quick", while ledger row A03 records removing "cheap" from the same D3 task because it is a user instruction.

### B16 [BOUNDS] target: Fixture properties the tasks need but the Fixture section omits

Attack: Several tasks depend on unlisted facts. D5: the size check runs before parsing, and an empty signature header is rejected; these must also be reconciled with D4's "verifySignature() called at the top of validate()". D11: audit.js does not yet record size rejections. D16: publish.js has a `main()` that is not the entry point, or the story is incoherent to an orchestrator that reads the file. D25: check-version.js sets an exit code. D9 and D10: lint.js has a null-field path that makes the question non-trivial. N2: output-path resolution through environment variables, which appears nowhere in the fixture. Read is granted, so the orchestrator may read any of these before it chooses a tier.

Required edit: Add each fact to the property list with its file. Add path resolution (for example, util.js resolves the output path from `OUT_DIR` and `XDG_DATA_HOME`). Order validate.js so that D4's and D5's claims both hold. Cover each property in the smoke sessions.

Evidence: PROTOCOL-v1 lines 109, 127, 130-132, 137, 140, 147.

Checkable: PROTOCOL-v1 line 109 contains no output path, no environment variable, no `main()`, no exit code and no null-field case; its only "output" is in "a generator's output".

### B17 [BOUNDS] target: Label audit inputs

Attack: Line 115 gives the labelers "only SKILL.md and the prompt". But the labels for D3 (paraphrase makes marking a judgment), D23 and D4 depend on fixture facts. tasks-v1-prompts.md, the evident labeling packet, does carry the fixture description. The protocol and the packet disagree. A labeler without the fixture would label D3 haiku from the word "inventory" and so manufacture a dual label.

Required edit: State that the labelers receive SKILL.md, the prompt and the fixture property list (not the fixture tree), and hash that packet into the provenance manifest.

Evidence: PROTOCOL-v1 line 115; tasks-v1-prompts.md lines 3-7.

Checkable: PROTOCOL-v1 line 115 says the labelers are "given only SKILL.md and the prompt", and tasks-v1-prompts.md line 5 carries the fixture description.

### B18 [BOUNDS] target: Anchors: the per-anchor band and the arms that run them

Attack: "RS minus R within ±0.10 on every anchor" cannot be met at two runs per cell. A task difference takes only the values 0, ±0.5 or ±1, so ±0.10 means exactly 0. With true agreement 0.95 in both arms, a single anchor shows a nonzero difference with probability 0.18, and at least one of six does with probability 0.69 (0.89 at 0.9). The check fires on noise. Anchors in RL and S, 24 sessions, feed no registered endpoint.

Required edit: Replace the per-anchor band with a pooled check: the mean RS minus R over the anchors (12 runs per arm), with its 90% interval inside ±0.10, and per-anchor rows reported as description. Cut S from the anchors. Either cut RL from the anchors too, or register RL minus R on the anchors as part of the shrink branch, since RL is a form the decision rules may recommend.

Evidence: PROTOCOL-v1 lines 153, 199-204, 233; binomial computation with n=2 via node -e during this review.

Checkable: With two runs per arm, a task-level difference of run proportions can only be 0, ±0.5 or ±1, so "within ±0.10" (PROTOCOL-v1 line 153) requires exactly 0.

### B19 [BOUNDS] target: Direction balance of the bank

Attack: In attempt 1, arm B over-provisioned on 0 of 13 first delegations and under-provisioned on 2 (T15, sonnet for opus; T19, a sonnet verifier). R's own text is a frugality cue. Ten candidates are over-provisioning traps (D1, D4, D5, D7, D8, D9, D15, D16, D22, D23), and seven are under-provisioning traps (D3, D10, D11, D12, D13, D14, D25). The screen will remove the over side preferentially, so the surviving set can end up mostly opus- and fable-labelled. E1 would then read "the skill raises tiers on gates, design and escalation", which a generic "be careful" text would also produce. Only the anchors check for a general upward shift, and B18 shows they cannot carry that check as registered.

Required edit: Register each task's predicted direction of R's miss, and report E1 split by direction. Make "no RS minus R increase in over-provisioning on the pooled haiku and sonnet anchors (N1, N2, N5, N6, D7)" a specificity condition of the "transmits judgment" decision. If the over side fails the screen, say so in the estimand, and aim the replacement tasks accordingly.

Evidence: FULL-RESULTS lines 96-97, 142, 146; PROTOCOL-v1 lines 123-140, 210, 214.

Checkable: FULL-RESULTS.md line 96 shows arm B over-provisioned on 0 of 13 first delegations, and line 97 shows it under-provisioned on 2 of 13.

### B20 [BOUNDS] target: Coverage: rules with no task and no Limits entry

Attack: Seven rules have no task and no entry under Limits: single-finding adjudication (line 52); the deterministic-check row (line 50, untestable because Bash is not granted); missing models (line 30); unsupervised runs (line 10); meta.phases (line 42); routing through a workflow when the Agent tool has no effort parameter (line 28); and "State the tiering rationale" (line 8), which the captured transcript could measure at no cost. Round 1's W04 asked for this list. The ledger records W04 as adopted, but v1 does not carry the list.

Required edit: Add a Limits line naming these rules as untested. Add a mediator that records whether the orchestrator's text before the first call states a tier rationale (by code rule: a model name and a reason clause in the same sentence), reported per arm.

Evidence: SKILL-0.1.2 lines 8, 10, 28, 30, 42, 50, 52; PROTOCOL-v1 lines 181, 255-263; REVIEW-LEDGER line 68.

Checkable: The word "untested" appears in PROTOCOL-v1 only on line 96, which refers to the fork rule.

### B21 [BOUNDS] target: Scoring multi-call answers (D1, D4, D22) and D14's roles

Attack: Line 173 scores a label not marked "every call" "on the one call". That is undefined when the orchestrator fans out: per fix in D4, per file in D1, per section in D22. D14's last agent "checks the combined findings and then reviews every script" can be written as two sites after the fan-out, both of which consume its results, so the role rule picks one arbitrarily. D14's label also folds effort naming into model agreement ("every call names a model and an effort"), so E1 on D14 partly measures E2. And because the bundled workflow-authoring reference advises omitting `model`, an omitted finder site scores as opus and fails a haiku or sonnet label for a naming reason, not a tier reason.

Required edit: Score labels not marked "every call" on every call in the set (all must agree), with first-call agreement reported beside it. In D14, treat every site after the fan-out that reviews beyond the findings as a gate site that must be opus. Score D14's model agreement on models only. Report E1 on workflow tasks with omitted-site runs excluded.

Evidence: PROTOCOL-v1 lines 135, 173, 174, 180; SKILL-0.1.2 line 42.

Checkable: PROTOCOL-v1 line 173 reads "A single-call label is scored on the one call" and gives no rule for several calls under such a label.

### B22 [BOUNDS] target: Exploratory tasks X1 and X3

Attack: X1 (one file, "explain") will almost certainly not be delegated in any arm. Non-delegating sessions run to completion, outside the capture-cost projection, and the skill cannot act on X1 because it loads on invocation, after the decision to delegate. X3's choice cannot show which retry rule wins. Haiku at medium fits line 27 (sweep effort first) and also line 64's setup branch (fix the prompt and retry at the same tier); missing three files plausibly means the glob skipped `docs/reviews/`. Only a sonnet choice is diagnostic, of line 64's tier step.

Required edit: Drop X1, or run it in A0 and R only. Reword X3 to rule setup out: "The haiku subagent at low effort was given the full list of fourteen paths under `<fx>/docs` and still skipped three in its inventory. Have it done properly." Record whether the new worker prompt changes the specification. Keep X4 conditional on I6.

Evidence: SKILL-0.1.2 lines 3, 10, 27, 64; PROTOCOL-v1 lines 109, 159-162, 234, 239.

Checkable: The X3 prompt does not say whether the first inventory was given the file list, and the fixture places one of the fourteen docs under `docs/reviews/`.

### B23 [FAILS] target: D1 label

Attack: Alternative reading: the rollback stakes raise D1 above haiku. This fails. Line 18 puts verbatim extraction on haiku, and line 35 makes difficulty the main axis, so stakes do not change the row. The label stands; only the prediction is in question (B06).

Required edit: None.

Evidence: SKILL-0.1.2 lines 18, 35; PROTOCOL-v1 line 123.

Checkable: SKILL-0.1.2.md line 18 lists "verbatim extraction" in the haiku row, and line 35 reads "Difficulty is the main axis".

### B24 [FAILS] target: D11 label

Attack: Alternative reading: line 38 ("Did design already happen?") or doc research (line 19) puts D11 on sonnet. This fails. Nothing in the prompt says design has happened; it asks for two or three designs with trade-offs, which is line 22's "open-ended design". The 0.4 prediction matches T15, where B chose sonnet against an opus label.

Required edit: None to the label. Add to the property list that audit.js does not yet record size rejections (B16).

Evidence: SKILL-0.1.2 lines 19, 22, 38; FULL-RESULTS line 142; PROTOCOL-v1 line 132.

Checkable: FULL-RESULTS.md line 142 shows T15's arm-B first delegation as sonnet, against the label opus@high/xhigh.

### B25 [FAILS] target: D13 label

Attack: Two alternative readings, both of which fail. First: the user has already named the defect, so the job is single-finding adjudication (line 52) at a lower tier. Second: line 56 speaks of the orchestrator rejecting a verdict, and here the user does. The prompt asks to "run the review again", and line 23 gives fable to "work an opus attempt at xhigh has fallen short on" no matter who rejected the verdict. The label is robust; D13's problems are its twin (B08) and its M3 role (B09).

Required edit: None.

Evidence: SKILL-0.1.2 lines 23, 52, 56; PROTOCOL-v1 line 134.

Checkable: SKILL-0.1.2.md line 23 assigns fable, high to xhigh, to "Work an `opus` attempt at xhigh has fallen short on".

### B26 [FAILS] target: D15 label

Attack: Alternative reading: the "accuracy against src/guard" reviewer is a fidelity check (line 19, sonnet medium), not lens review (line 53, sonnet high). This fails on model: both rows are sonnet, and medium is below band, which agrees under the registered effort rule. v1 already scores the merger, which no row covers, on naming only.

Required edit: None to the label. Define D15's set rule explicitly: every reviewer site must be sonnet, and the merger must name a model (see B21).

Evidence: SKILL-0.1.2 lines 19, 53, 56; PROTOCOL-v1 lines 136, 177.

Checkable: SKILL-0.1.2.md gives fidelity checks sonnet at medium (line 19) and lens review sonnet at high (line 53), so both readings of D15's accuracy reviewer give sonnet.
