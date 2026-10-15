# Critic lens: The task bank against the skill text

Verdict: As written, the task bank is unlikely to change a decision about the skill. Attempt 1's rule-only arm already reached the label on the analogs of T04, T08 and T09. T09, T22 and T23 are mislabelled or test obedience to the user. T08, T13, T19 and T20 each have a second reading in the skill text. Only about six tasks are credibly divergent in R, which is close to the minimum the exact sign-flip test needs under Holm. The likely outcome is a repeat of attempt 1's 'inconclusive'. With a pre-registration screen in arm R, the four KILLS replaced, the labels checked by independent labelers, and the fixture made explicit, the bank could support a keep-or-shrink decision on the skill. The gate and belief questions fall outside this lens.

## Attacks

### A01 [BOUNDS] target: T02

Attack: The label is sound. SKILL line 18 puts verbatim extraction in the haiku row, and line 35 says difficulty is the main axis, so importance does not raise the tier. The prediction for an orchestrator reading 'lowest sufficient' (sonnet or opus) is weak, though. R's own text says 'at the lowest tier sufficient', and in the pilot the rule-only arm (B) chose haiku 2 of 2 times on verbatim extraction. The 'release board' framing is the only thing pushing the tier up, so T02 is likely at ceiling in R. It also depends on a fixture detail the Fixture section does not promise: every script must start with a comment line.

Required edit: Keep the label. Put T02 in a 'weak divergence' stratum until an R screen (see W03) confirms it diverges. Raise the stakes without naming a tier: "This goes on the release board, and last month a paraphrased line there caused a rollback, so it has to be exactly right: have a subagent copy the first comment line of every file under `<fx>/scripts`, word for word, with each file name." Add to the Fixture section that each of the five scripts opens with a one-line comment.

Evidence: PILOT-RESULTS.md line 91: the extract task, arm B, 'haiku 2'. SKILL-0.1.2.md line 18: 'verbatim extraction'. delegation.md: 'at the lowest tier sufficient for its task'.

Checkable: PILOT-RESULTS.md line 91 shows arm B's first tier on the extract task as 'haiku 2'.

### A02 [BOUNDS] target: T03

Attack: The effort label has two readings. (a) Low, from line 18's 'low for short, high-volume items'. (b) Low or medium, because the haiku row's cell spans both, line 27 says 'Bands are sweet spots, not fences', and fourteen items may not count as high-volume. The prediction ('haiku; medium') is backwards for R. In the pilot the rule-only arm ran its haiku workers at low 4 of 4 times, while the skill-only arm used medium. So on T03, R probably matches the label 'low', and RS may land above it, which pushes endpoint 3 negative. Two scoring gaps also apply. The observer's handling of calls 2 to 14 when they are issued in the same message is unspecified. A Workflow launch on an Agent-path task has no scoring rule.

Required edit: Either relabel 'haiku; low or medium (low preferred)' and drop T03 from the effort-divergent set, or keep 'low', predict R = low, and register T03 as a check that the skill does not push effort up. The observer must deny every matching call, not only the first, and record all calls in the first delegating assistant message. A Workflow launch on an Agent-path task agrees only if every site's model and effort fall within the label.

Evidence: PILOT-RESULTS.md line 114: 'B: requested haiku -> resolved claude-haiku-5-5 @ low (x4)'. Line 120: 'C: requested haiku -> ... @ medium (x3)'. README.md line 73: 'with the words alone they got low and medium'. PROTOCOL-v0 line 66 covers only 'the first matching call'.

Checkable: PILOT-RESULTS.md line 114 reads 'B: requested haiku -> resolved claude-haiku-5-5 @ low (x4)'.

### A03 [BOUNDS] target: T04

Attack: 'For a cheap subagent' is an explicit cost instruction from the user. Scoring sonnet as the only correct answer assumes the orchestrator should override or reinterpret that instruction, and no skill sentence says a user's tier preference gives way to the ladder. A haiku choice here is obedience, not a misreading of the doctrine. The label also depends on the fixture. If CHANGELOG entries repeat ROADMAP titles word for word, marking items done is string matching, and haiku is correct by line 18. Only paraphrased or partial entries make it the judgment work of line 27's example. Without the 'cheap' phrase, the attempt-1 rule-only arm already chose sonnet, so T04 would sit at ceiling.

Required edit: Remove 'for a cheap subagent' and keep the mislabel as the trap: "A quick inventory job for a subagent: go through `<fx>/docs/ROADMAP.md` and mark each item done or not done according to `<fx>/CHANGELOG.md`." Add to the Fixture section that CHANGELOG entries paraphrase ROADMAP items, at least a third share no title words with their item, and some items are partly done. Screen T04 in R (see W03).

Evidence: SKILL-0.1.2.md line 27: 'A haiku inventory whose prompt keeps growing judgment calls ... goes to sonnet at medium'. FULL-RESULTS.md line 131: T04, arm B, 'sonnet@omit>xhigh'.

Checkable: FULL-RESULTS.md line 131 shows T04's arm B first delegation as sonnet, the label tier.

### A04 [BOUNDS] target: T08

Attack: Two readings of the skill give different labels. Line 51 (fix re-verification) gives sonnet at medium. Line 22's 'security-boundary reads' gives opus at high to xhigh, because 'unsigned payloads are rejected' is a signature check. The skill does not say whether the verification table outranks the ladder row. The prompt also names no evidence for any fix, and evidence is the row's defining condition ('Does each named fix match its named evidence?'). An RS choice of opus is therefore a valid reading that would be scored as disagreement. On the non-security version of this task, the attempt-1 rule-only arm chose sonnet. The security subject is the only thing driving the divergence, and it is also the thing that creates the second reading.

Required edit: Name the evidence for each fix so that line 46 ('how enumerated the target is') settles the label: "Three fixes to the input validator were claimed for this release, each with its evidence: unsigned payloads are rejected (the signature check at the top of `validate()`); the size limit is read from config (`config.maxBytes`); a malformed header logs and continues (the `catch` around `parseHeader()`). Have a subagent confirm each fix against its named evidence in `<fx>/hooks/validate.js` and report pass or fail per fix." Add those identifiers to the Fixture section, and register opus at high or xhigh as a sensitivity label.

Evidence: SKILL-0.1.2.md line 51: 'Does each named fix match its named evidence? | sonnet, medium'. Line 22: 'security-boundary reads'. FULL-RESULTS.md line 136: the T09 analog, arm B, sonnet.

Checkable: The T08 prompt (PROTOCOL-v0 line 113) names three fixes and no evidence for any of them.

### A05 [KILLS] target: T09

Attack: The prompt never says what the two fixes are, so the subagent's target is not enumerated. Line 46 says 'the less anyone has named what to look for, the higher the tier'. Line 56 treats a re-gate as fix re-verification only when it 'checks enumerated fixes against expected evidence'. Neither condition holds, so the skill's own answer to the task as written is closer to an open gate (opus) than to the label (sonnet, medium). The Fixture section also promises no review record. A headless orchestrator will search, find nothing, and may reply asking which fixes are meant, which scores as no delegation. The attempt-1 version named the fixes, and the rule-only arm chose sonnet, at ceiling. The task cannot be divergent and correctly labelled in its current form.

Required edit: Replace it with: "Round one of the review of `<fx>/hooks/validate.js` was an opus gate; it found two problems, and both are now fixed: the size check now runs before parsing, and an empty signature header is rejected. Run round two: have a subagent check that those two fixes are in place." Label: sonnet, medium. Predicted R choice: opus, anchored on round one's tier. This drops 're-gate', which is the skill's own word (see W05).

Evidence: PROTOCOL-v0 line 114: 'found two problems and both are fixed now ... check that the two fixes are in place'. SKILL-0.1.2.md lines 46 and 56. FULL-RESULTS.md line 139: attempt-1 T12 (fixes named), arm B, sonnet.

Checkable: The T09 prompt at PROTOCOL-v0 line 114 does not describe either fix.

### A06 [BOUNDS] target: T11

Attack: The model prediction (opus) is not credible. R asks for the lowest sufficient tier, the prompt says the design is settled, and the change is one flag on a script under 120 lines. In attempt 1 the skill-only arm chose sonnet, the rule-only arm has no cell, and the no-text arm only omitted the model. The effort label has two readings: sonnet at high for 'Implementation from near-code design' (line 20), or sonnet at medium for 'Pattern-following implementation with verified anchors' (line 19). A one-flag change with an exact output shape fits both. So T11 is probably at ceiling on model and contested on effort. 'Design is settled' also echoes selection question 4.

Required edit: Reclassify T11 as a model anchor. If an effort-divergent version is wanted, make line 20's 'complex but well-specified multi-file edits' apply: "Design is settled: add `--json` to `<fx>/scripts/check-version.js` and `<fx>/scripts/release.js`; both print `{ok, from, to}` through a new `formatResult()` in `<fx>/scripts/util.js`, which the text output also uses. Have a subagent write the patch as one unified diff in its reply, without editing files." The Fixture section must name util.js as one of the five scripts.

Evidence: FULL-RESULTS.md line 138: T11, arm A 'omit>opus', arm B '0r', arm C 'sonnet'. SKILL-0.1.2.md lines 19 and 20.

Checkable: FULL-RESULTS.md line 138 has no arm-B cell for T11, and its arm-C cell is sonnet.

### A07 [BOUNDS] target: T12

Attack: The label is sound (line 56: 'A gate fanned out per lens or per round is lens review, whatever its label says'), and the opus prediction is credible. The label says 'each', but Instrument 1 defines behaviour only for the first matching call. Three Agent calls issued in parallel in one message leave calls 2 and 3 unspecified. If they are allowed, workers run, the session continues and costs rise. If they go unrecorded, 'each' cannot be scored. A mixed-tier fan-out, such as opus for input handling and sonnet for logging, would be scored on whichever call landed first. 'Lens' and 'adversarial' are also the skill's own words (see W05).

Required edit: The observer denies every Agent and Workflow call and records every call in the first delegating assistant message. T12 agrees only if every recorded call is within the label, and the number of recorded calls is reported. Reword the lens cue: "three independent adversarial reviewers of `<fx>/hooks/validate.js`: one looking only at input handling, one only at error paths, one only at logging."

Evidence: PROTOCOL-v0 line 66: 'On the first matching call it writes the tool input ... and returns a deny decision'. PROTOCOL-v0 line 117: label 'sonnet; high, each'.

Checkable: PROTOCOL-v0 line 66 specifies observer behaviour for the first matching call only.

### A08 [BOUNDS] target: T13

Attack: No skill sentence sets 'sonnet; high'. The sonnet-high row covers implementation and multi-file edits (line 20), and reasoning work appears only in the opus row (line 21). 'Where sonnet demonstrably falls short' has two readings. It can mean shown on this instance, which gives sonnet first, in line with line 64's 'try it once, inspect, and move up on evidence'. It can also mean a known gap for this kind of work, which gives opus. Attempt 1 labelled the matching task 'sonnet; high, or opus; medium to xhigh ... either agrees'. The draft narrows that after attempt-1 data showed the rule-only arm choosing opus and the skill arms choosing sonnet. The added sentence 'No one has tried this yet' is what makes the first reading apply. The prediction itself is credible.

Required edit: Change the label to 'sonnet; medium or high'. Record the change from attempt 1's label with lines 21 and 64 as its textual basis. Add the positive counterpart (see W04): a task in which a sonnet attempt at high has fallen short, labelled opus at medium to xhigh. The pair then separates 'sonnet first' from 'never opus'.

Evidence: Attempt-1 PROTOCOL.md line 43: T16 label 'sonnet; high, or opus; medium to xhigh ... so either agrees'. FULL-RESULTS.md line 143: arm B opus, arms C and D sonnet. SKILL-0.1.2.md lines 20, 21 and 64.

Checkable: Attempt-1 PROTOCOL.md line 43 accepts opus for the lintScript reasoning task, and the draft's T13 does not.

### A09 [FAILS] target: T16

Attack: Alternative reading: T16 is single-finding adjudication (line 52, 'the tier the finding's severity warrants') rather than a security-boundary read, so its label would differ.

Required edit: None required. Asking whether a crafted payload can get past the signature check is a read of the security boundary (line 22). Under the adjudication reading, an authentication bypass is severe enough to warrant the gate tier, so both readings give opus. 'Quick check, nothing formal' names no tier, so the trap fairly tests line 8 ('Sufficient cuts both ways') and does not set the label against a user instruction. Optionally note that the adjudication row states no effort band, and keep 'high or xhigh'.

Evidence: SKILL-0.1.2.md line 22: 'security-boundary reads'. Line 52: 'the tier the finding's severity warrants'. Line 8: 'Sufficient cuts both ways'.

Checkable: SKILL-0.1.2.md line 52 sets no fixed tier for single-finding adjudication.

### A10 [BOUNDS] target: T19

Attack: Two readings give different labels. Line 56 says 'If the orchestrator rejects an opus gate's verdict on the evidence before any fix lands, re-run that gate once on fable', which gives fable. The fable row (line 23), however, requires 'an opus attempt at xhigh', and line 27 says 'Sweep effort within the band before changing tier'. The prompt does not give the earlier gate's effort, so rerunning opus at xhigh is also a defensible reading. Three further problems. The user rejects the verdict here, where the skill says the orchestrator does. The gate's report and the evidence it cites are not in the fixture. 'Re-run the gate' does not ask for a subagent, so the orchestrator may do the review itself. 'No fix has landed' echoes line 56.

Required edit: Replace it with: "An opus gate at xhigh effort reviewed `<fx>/hooks/validate.js` and called it sound. I've read its report and I reject the verdict: the line it cites as the signature check is a logging call. The file has not changed since. Have a fresh subagent run the gate again." Both readings then give fable at high or xhigh.

Evidence: PROTOCOL-v0 line 124: 'The opus gate said ... I don't accept it ... No fix has landed. Re-run the gate.' SKILL-0.1.2.md lines 23, 27 and 56.

Checkable: The T19 prompt at PROTOCOL-v0 line 124 states no effort for the earlier gate and does not contain the word 'subagent'.

### A11 [BOUNDS] target: T20

Attack: The verifier label has two readings. Line 60's 'cheap finders ... feeding one gate' gives an opus gate. But checking an enumerated list of findings is adjudication or verification of named items, and line 46 sends enumerated targets to lower tiers, which gives sonnet at high (lens review) or a tier set by severity. In attempt 1, the arm with the skill loaded (invoked 14 of 14 times) also chose a sonnet verifier at high, exactly as the rule-only arm did. A miss on T20 in RS therefore cannot separate a failure to transmit the doctrine from a contestable label. The finder label also gives no effort band, although effort agreement needs one.

Required edit: Make the verifier an unambiguous open gate: "Write and launch a workflow with the Workflow tool: one finder per file in `<fx>/scripts` looking for unhandled errors, then one agent that checks the combined findings and then reviews every script for unhandled errors the finders missed, as the final gate before release." Finder label: haiku at low to medium, or sonnet at medium to high. Verifier label: opus at high or xhigh.

Evidence: FULL-RESULTS.md line 146: T19, arms B and D both 'WF[fanout:sonnet@medium,gate:sonnet@high]'. SKILL-0.1.2.md lines 46 and 60.

Checkable: FULL-RESULTS.md line 146 shows the skill-loaded arm D choosing a sonnet verifier on the cheap-finders task.

### A12 [BOUNDS] target: T21

Attack: The prediction (lens reviewers on opus) is not credible. The prompt carries no gate or adversarial cue, and in the pilot the rule-only arm ran its lens review on sonnet at medium. Line 56's rule ('A gate fanned out per lens ... is lens review, whatever its label says') is only tested when the fan-out is called a gate, and T21 does not call it one, so the task is at ceiling on model. No skill sentence covers the merger, and its label has no effort band.

Required edit: Replace it with: "Launch a workflow with the Workflow tool: three independent adversarial gates on `<fx>/docs/HOOKS.md`, one per lens (accuracy against `<fx>/hooks`, clarity, internal consistency), then one agent that merges their findings into one list." Lens label: sonnet at high. Score the merger for naming only, since no sentence sets its tier.

Evidence: PILOT-RESULTS.md line 107: the lens task, arm B, sonnet. Line 117: 'B: requested sonnet -> resolved claude-sonnet-5-5 @ medium (x4)'. PROTOCOL-v0 line 126 contains no gate cue.

Checkable: The T21 prompt at PROTOCOL-v0 line 126 contains neither 'gate' nor 'adversarial'.

### A13 [KILLS] target: T22

Attack: No skill sentence sets this label. The sonnet-at-medium row says 'Pattern-following implementation with verified anchors', which describes code, not prose. Writing release notes has no ladder row; the nearest are haiku's 'reflows' and sonnet's 'doc research'. 'In the voice of the existing notes' depends on release notes that the Fixture section does not promise. An opus prediction for R, whose text says lowest sufficient, is not credible.

Required edit: Replace it with a task for a rule that currently has none (rule out setup first, line 64): "A sonnet subagent at medium effort wrote a patch adding `--quiet` to `<fx>/scripts/publish.js`, and it edited the wrong function, because my prompt said `main()` and the entry point is `run()`. Have a subagent write the patch again as a unified diff, naming `run()` this time." Label: sonnet, medium. The failure was in the setup, so the tier stays the same. Predicted R choice: sonnet at high, or opus, by escalation. Screen it (see W03).

Evidence: SKILL-0.1.2.md line 19: 'Pattern-following implementation with verified anchors'. Line 64: 'rule out setup first ... because a mis-specified delegation fails the same way at every tier'. PROTOCOL-v0 line 98 lists no release notes.

Checkable: No row of the ladder in SKILL-0.1.2.md lines 16-23 names prose writing or release notes.

### A14 [KILLS] target: T23

Attack: 'Fork a subagent' is an explicit mechanism instruction. 'It already has the context it needs' invokes the skill's own exception (line 29: 'or the shared context is the point'), so a fork can be defended under the skill, and the label scores obedience as an error. R alone already pushes away from forking: 'Never inherit the session model silently', and a fork inherits it. The task therefore separates A0 and P from R, not RS from R. A fork carries no model, so in the floor endpoint T23 scores as 'not named' in every arm that forks. The effort label ('at medium') also conflicts with T01, the same job, labelled 'medium, low allowed'. If probe I7 fails, the forking rule has no task. The gate exempts forks, so D equals RS by construction.

Required edit: Replace it with: "Get me the list of every file under `<fx>/docs` with its line count from a helper; forking this session is fine with me if that's simplest." Label: a non-fork haiku subagent at low or medium; a fork disagrees. Exclude T23 from the floor endpoint. If I7 fails, list the forking rule as untested under Limits.

Evidence: SKILL-0.1.2.md line 29: 'fork only when the session model is the lowest sufficient tier or the shared context is the point'. delegation.md: 'Never inherit the session model silently'. PROTOCOL-v0 lines 106 and 128.

Checkable: The T23 prompt at PROTOCOL-v0 line 128 contains 'it already has the context it needs', which matches the skill's own exception for forking.

### A15 [BOUNDS] target: T24, T25

Attack: The scope sentence (line 10, 'Delegate bulk or routine work ... keep a single dependent chain') is in the skill body, which loads on invocation. The description triggers 'when spawning or configuring any delegated agent', which comes after the decision to delegate. The delegation rate on T24 and T25 therefore measures priming by the rule and the skill listing, not the scope rule. Neither prompt asks for delegation, and an Opus orchestrator will likely read one file (T24) or fourteen short files (T25) itself in every arm, so both tasks are likely at floor. Summarising is not in the haiku row's list, so T25's haiku label has a second reading: sonnet, under 'doc research'.

Required edit: State that T24 and T25 measure how often each footprint leads the orchestrator to delegate, not the scope rule. Record any Skill invocation made before the first delegation decision. Relabel T25 as 'haiku or sonnet, medium', or drop it.

Evidence: SKILL-0.1.2.md line 3: description 'Use when spawning or configuring any delegated agent'. Line 10: the scope sentence. Line 18: the haiku row's list.

Checkable: SKILL-0.1.2.md line 18 does not list summarising among haiku's mechanical tasks.

### W01 [BOUNDS] target: Prediction column (whole bank)

Attack: The draft says the A0 and P arms test the predicted unaided choices. Those arms rarely name a model: A0 named one on 3 of 15 batch-1 first delegations and 0 of 10 in the pilot, and an omitted model scores as opus. A0 and P therefore 'hit' every prediction that includes opus (T02, T08, T09, T11, T12, T13, T19, T22) by omission. They miss every haiku or sonnet prediction (T03, T04, T15, T16, T20) whatever their judgment. The judgment endpoint is RS minus R, and the 'unaided lowest sufficient reading' in Question 2 is arm R, so R's choice is the prediction that decides whether a task can move.

Required edit: Restate the column as 'predicted choice in arm R', and compute its hit rate in R. Report A0 and P hit rates only with omitted models excluded. The sensitivity analysis drops tasks whose R prediction failed.

Evidence: PROTOCOL-v0 line 102: 'the A0 and P arms test them'. Line 159: 'hit rate in A0 and P'. Line 140: an omitted model scores as opus. FULL-RESULTS.md line 93: A named a model on 3 of 15.

Checkable: FULL-RESULTS.md line 93 shows arm A naming a model on 3 of 15 first delegations.

### W02 [BOUNDS] target: Divergent-set accounting (line 132)

Attack: The draft says 'nine divergent on model, three on effort only (T01, T03, T10)', but T01 is not in its own divergent list. The list gives ten tasks divergent on model (T02, T04, T08, T09, T11, T13, T15, T16, T19, T22), two on effort (T03, T10) and four on shape (T12, T20, T21, T23). T01's claimed effort divergence rests on R omitting effort or choosing low. R's text asks for effort ('and effort where supported'), the pilot's rule-only arm set effort 10 of 10 times, and T01's label allows low. T01 is at ceiling on both model and effort.

Required edit: Correct line 132 to ten on model, two on effort and four on shape, and drop '(effort divergent)' from T01's class.

Evidence: PROTOCOL-v0 lines 106 and 132. PILOT-RESULTS.md line 58: effort set on the first call, B 10/10. delegation.md: '(and effort where supported)'.

Checkable: PROTOCOL-v0 line 132's list of sixteen divergent tasks does not include T01, yet the same line names T01 as effort-divergent.

### W03 [KILLS] target: Divergent set and endpoint 2 power

Attack: Attempt 1's rule-only data puts several 'divergent' tasks at or near ceiling in R. The neutral form of T04, the non-security form of T08 and the named-fix form of T09 all drew sonnet, the label. T11, T21 and T22 are not credible as model-divergent. The rule-only arm agreed on 11 of 13 batch-1 tasks. The credible model-divergent tasks are about T12, T13, T15, T16, T19 and T20, with T02 and T08 weak. Endpoint 2 is an exact sign-flip test over task differences. With k nonzero differences the smallest two-sided p is 2^(1-k): k = 6 gives 0.031, which passes Holm only in last position (alpha 0.05). In second position (alpha 0.025) it needs k of at least 7, all of one sign. Ceiling tasks add zeros and dilute the mean by the fraction of tasks that move out of 16. The bank as built will most likely repeat attempt 1's 'inconclusive'. The power simulation assumes R agrees 0.3 of the time on the divergent set, which contradicts the observed 11 of 13.

Required edit: Before registration, screen every candidate task in arm R alone under Instrument 1, with 2 or 3 runs each; capture-and-stop makes this cheap. Admit to the primary divergent set only tasks with R agreement of 0.5 or less, and exclude the screen data from the analysis. Regression to the mean makes this conservative. Base the power simulation on the screened R rates, and add replacement tasks until at least 10 pass the screen.

Evidence: FULL-RESULTS.md line 92: model agreement, B 11/13. Lines 131, 136 and 139: B sonnet on the analogs of T04, T08 and T09. PROTOCOL-v0 line 177: 'raises a divergent task's agreement from 0.3 to 0.8'.

Checkable: An exact two-sided sign-flip test over 6 nonzero differences of the same sign gives p = 2/64 = 0.03125.

### W04 [BOUNDS] target: Rule coverage and ladder balance

Attack: Several rules have no task. The opus reasoning row's positive case (line 21) is untested, because T13 tests only its negative. So are 'Sweep effort within the band before changing tier' (line 27), 'rule out setup first ... then re-dispatch one tier up' (line 64), redo economics (line 37), single-finding adjudication (line 52), missing models (line 30), unsupervised runs (line 10), 'State the tiering rationale' (line 8), meta.phases (line 42), and the deterministic-check row (line 50), which cannot be tested without Bash. Other rules are over-represented: the haiku row has 6 tasks, sonnet at medium 6, lens review 3, fable 2, and the opus medium-to-xhigh row 0. Lines 27 and 64 also pull in different directions on retries (raise effort first, or go one tier up), so any retry task needs a label under each.

Required edit: Replace T22 (see A13), and one of the anchors T05 or T06, with this positive opus-reasoning task: "A sonnet subagent at high effort tried to settle whether `<fx>/scripts/lint.js` can both miss a missing field and flag a present one; its argument skips the null-field case and it gave no counterexample. Have a subagent settle it." Label: opus, medium to xhigh. Measure the tiering rationale with a regular expression over the orchestrator's text before the first call in T03, T12, T20 and T21. List the deterministic-check, unsupervised-run, missing-model and meta.phases rules as untested, and register the conflict between lines 27 and 64.

Evidence: SKILL-0.1.2.md line 21: 'Reasoning-heavy work where sonnet demonstrably falls short'. Line 27: 'Sweep effort within the band before changing tier'. Line 64: 'then re-dispatch one tier up'. PROTOCOL-v0 line 62: 'Bash is not granted'.

Checkable: No task in PROTOCOL-v0 lines 106-130 carries an opus label at medium effort, or any label from the 'Reasoning-heavy work' row.

### W05 [BOUNDS] target: Wording that leaks the skill's own terms (T09, T12, T13, T19; anchors T14, T17, T18)

Attack: Several divergent prompts reuse the skill's trigger phrases. T09 has 're-gate' (line 56), T12 'one per lens' (line 56), T13 'No one has tried this yet' (lines 21 and 64), and T19 'No fix has landed' (line 56's 'before any fix lands'). R does not contain these phrases, so RS's increment on these tasks partly measures matching the prompt to the skill's text rather than judgment. The claim 'the skill transmits judgment' is then stronger than the data. The anchors echo the skill too: T14 'nobody has listed yet', T17's production-config sentence and T18's 'opus ... at xhigh'. That is acceptable for positive controls.

Required edit: Paraphrase the cues in the divergent tasks: 're-gate' becomes 'round two'; 'one per lens' becomes 'one looking only at X'; 'No fix has landed' becomes 'The file has not changed since'. Keep the echoes in the anchors. State as a limit that agreement on any task that keeps the skill's wording measures recognition of that wording.

Evidence: SKILL-0.1.2.md line 56: "a follow-up 're-gate'" and "before any fix lands". PROTOCOL-v0 line 114: 're-gate'. Line 124: 'No fix has landed'.

Checkable: Both 're-gate' and 'fix lands' or 'fix has landed' appear in SKILL-0.1.2.md line 56 and in the T09 and T19 prompts.

### W06 [BOUNDS] target: Concentration on validate.js

Attack: Eight of the 25 tasks target `<fx>/hooks/validate.js` (T07, T08, T09, T12, T14, T16, T18, T19). Read is allowed, so the orchestrator can read the file before delegating. Its size and apparent complexity, which the Fixture section does not specify, will shift every gate task in the same direction. The task differences are then not exchangeable, independent units for the sign-flip test. A short validate.js also gives R a size-based reason for a lower tier that the skill's shape-based labels ignore, so a divergence there would not show that R misread the doctrine.

Required edit: Spread the gate tasks over at least three hook and script files, or fix validate.js at a stated size, such as 250 to 350 lines with a real signature path. Report a sensitivity analysis that collapses the validate.js tasks into one unit.

Evidence: PROTOCOL-v0 lines 112-124 name validate.js in T07, T08, T09, T12, T14, T16, T18 and T19. Line 98 gives no size for hooks/ files.

Checkable: Eight task prompts in PROTOCOL-v0 name `<fx>/hooks/validate.js`.

### W07 [BOUNDS] target: Effort labels and scoring (T03, T10, T11; endpoint 3)

Attack: Line 142 says 'below the band is reported separately' but does not say whether below-band agrees, and the skill says 'Below-band is fine for easy instances' (line 27). T10's effort divergence (R at medium against the label's high, from the pilot rule-only arm's sonnet at medium) exists only if below-band counts as disagreement. If below-band agrees, T10 and T11 leave the effort-divergent set. T03 runs the other way (see A02). The band is also undefined when the chosen model is outside the label; attempt 1 used the union of bands.

Required edit: Pre-register below-band as agreement, citing line 27, or as disagreement with a stated reason, and recompute the effort-divergent set accordingly. Define the band for a model outside the label (the union, as in attempt 1). Report T03 separately.

Evidence: PROTOCOL-v0 line 142. SKILL-0.1.2.md line 27: 'Below-band is fine for easy instances'. PILOT-RESULTS.md line 117: B sonnet at medium, 4 times. FULL-RESULTS.md line 42: union of bands.

Checkable: PROTOCOL-v0 line 142 does not state whether a below-band effort counts as agreement.

### W08 [BOUNDS] target: Workflow tasks T20 and T21

Attack: T20 and T21 are the only Workflow-path tasks, and their scores depend on more than tier judgment. (1) The orchestrator must write a script rather than first make a scouting Agent call. Under capture-and-stop such a call ends the session and scores as a non-match. (2) Attempt 1's site parser resolves const-bound strings and named options objects, but not a helper that takes the model as a parameter, or a loop over an array of roles. (3) The role rule ('last site is the verifier or merger') misassigns a script with a separate dedupe step. Attempt 1 has only 2 parsed launches as evidence.

Required edit: Probe I5 should include one A0 launch and one R launch of T20, to show real script shapes. Unresolved sites should score as 'unresolved' and be reported, not scored as non-matches. Identify the verifier as the site that consumes the fan-out results, falling back to the last site. Report per arm how often a workflow task's first call is an Agent call.

Evidence: FULL-RESULTS.md line 43: the parser resolves 'a string bound once by const' and 'an options object passed by name'. Line 156: 'Workflow launches as first delegation: 2'. PROTOCOL-v0 line 145.

Checkable: FULL-RESULTS.md line 156 reports 2 Workflow launches as first delegations in batch 1.

### W09 [FAILS] target: Anchors at ceiling (T05, T06, T07, T14, T17, T18)

Attack: Alternative reading: the anchors are at ceiling in every arm that names a model, and T14, T17 and T18 are at ceiling even in A0. Attempt 1's arm A even named fable on T18's analog. On this reading they waste sessions.

Required edit: None required for the anchors. Under capture-and-stop they cost only the orchestrator's turns, they are positive controls for the instrument, and they enter only the floor endpoint, which scores naming rather than tier. Report S minus A0 with omitted models excluded, because A0 'agrees' on the opus-labelled tasks by omission. Note that the T18 and T19 prompts name tiers, which raises naming in A0 and P on those two tasks.

Evidence: FULL-RESULTS.md lines 144-145: T17 fable in all four arms, T18 opus or omitted in all. PROTOCOL-v0 line 153: the floor endpoint is the named-model rate.

Checkable: FULL-RESULTS.md line 144 shows arm A naming fable on the attempt-1 T17 escalation task.

### W10 [BOUNDS] target: Independence of the labels

Attack: The protocol's author wrote both the labels and the predictions. At least ten tasks have a second defensible reading: T03, T08, T09, T11, T13, T19, T20, T21 (merger), T22, T23 and T25, plus T07. T07 can read as a fidelity check (sonnet at medium, line 19) or as lens review (sonnet at high, line 53). Agreement with a single author's labels measures agreement with that author's reading of the skill.

Required edit: Before registration, have two fresh labelers label every task, each given only SKILL-0.1.2.md and the prompts. Report their agreement with the draft's labels. Tasks with any disagreement get a dual label and are scored in both a primary analysis (the draft's label) and a sensitivity analysis (either label accepted), or they move to a secondary stratum.

Evidence: SKILL-0.1.2.md line 19: 'fidelity checks' at sonnet medium. Line 53: lens review at sonnet high. PROTOCOL-v0 line 112: T07 lists 'every place the document disagrees with the code'.

Checkable: SKILL-0.1.2.md gives fidelity checks sonnet at medium (line 19) and lens review sonnet at high (line 53), and T07's prompt fits both.

### W11 [BOUNDS] target: Fixture section (line 98) against task dependencies

Attack: Tasks depend on files and behaviours the Fixture section does not promise. validate.js needs a signature check, a size limit read from config and header parsing (T07, T08, T12, T14, T16, T18, T19). audit.js must record rejections (T15). publish.js needs error handling and a run() entry point (T10, A13). check-version.js needs from/to text output (T11). lint.js needs field-presence checks (T13). release.js needs version-bump logic (T24). COVERAGE.md must contain a table (T05). The scripts need leading comments (T02). ROADMAP and CHANGELOG items must stand in a stated relation (T04). HOOKS.md must describe validate.js with some disagreements (T07, T21). Output-path resolution must depend on environment variables (T06). Existing release notes are needed for T22, and review records for T09 and T19. Where a referenced record is missing, the orchestrator searches the fixture, finds nothing, and may stop or ask.

Required edit: List in the Fixture section every file named in a prompt, with the feature each task relies on, and have the generator assert each one. Every prompt should carry everything the delegation needs. No prompt should refer to a record (a review, a verdict or prior notes) that the fixture does not contain.

Evidence: PROTOCOL-v0 line 98 names only directories, counts, and ROADMAP.md, COVERAGE.md and HOOKS.md. The prompts at lines 106-130 name validate.js, audit.js, publish.js, check-version.js, lint.js and release.js.

Checkable: PROTOCOL-v0 line 98 does not name validate.js, audit.js, publish.js, check-version.js, lint.js or release.js.

### W12 [BOUNDS] target: Placebo arm P against the task bank (line 50)

Attack: Line 50 says P's two rules 'are path-scoped rules whose paths no task touches'. markdown.md is scoped to '**/*.md', and T01, T03, T04, T05, T07, T21, T22 and T25 read Markdown files in the fixture. Under the loader route, the rule may load partway through those sessions only, so P's content varies by task. Under append_system_prompt, path scoping disappears altogether. The placebo is still free of delegation text, so its inertness is not at risk, but the sentence is false. The placebo also matches R's route less well than a session-start rule would.

Required edit: Correct line 50. Either record from the transcripts whether the markdown rule loaded before the first delegation in P sessions, or use a session-start rule of similar length as the placebo, such as coding-principles.md (69 words, containing none of agent, model, effort, delegat, subagent or tier).

Evidence: ~/.claude/rules/markdown.md frontmatter: 'paths: - "**/*.md" - "**/*.mdx"'. CLAUDE.md row: 'rules/markdown.md | only when touching *.md'. FACTS.md line 42: coding-principles is 69 words.

Checkable: ~/.claude/rules/markdown.md has `paths: "**/*.md"` frontmatter, and T05's prompt reads `<fx>/docs/COVERAGE.md`.
