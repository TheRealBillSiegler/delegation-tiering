# Critic lens: Confounds, leakage and construct validity in PROTOCOL-v1 (arms, controls, harness exposure, task wording, manipulation checks, and the proxy for the owner's decision)

Verdict: No attack on this lens kills the primary contrast, E1 (RS minus R), but three registered components fail as written. (1) RL cannot answer the shrink question: the two tables omit lines 27, 56, 60 and 64, which govern 8 of the 18 candidates, so F2 is positive by construction. (2) M3's planted control on D13 is neither arbitrary to the model's priors nor protected against the screen routing D13 to the anchors, where M3 cannot reach +0.3. (3) F4's omitted-excluded scoring leaves A0 with no denominator on most tasks. Bounded issues that need registered edits: the plugin directory is the whole repository, including evals/scenarios.md, a de facto answer key (low pre-call read base rate in attempt 1, 0 of 30 plugin-arm orchestrators); there are no deny rules between concurrent sessions under H2; Bc's referent is the skill's Enforcement sentence, not CLAUDE.md, and its baseline lacks the loader wrapper that A0 and S never get; the configuration path is printed by the loader and not covered by the banned-string assertion; P is active on the coding tasks, and its frugality readout is blind; tier-naming prompts inflate naming and admit a one-tier-up heuristic; the twins leak skill terms into E1; the planted review is visible in all seven validate.js tasks; the scoring of unresolved workflow sites and canary-driven turns is unspecified; D's A/A leak check covers only the hooks manifest; the interim re-estimation reads treatment-arm outcomes. The stopReason attack fails. Evidence not yet checked: the wrapper's absence for an empty configuration directory under H2 needs probe I1.

## Attacks

### CL2-01 [KILLS] target: RL arm and the F2 decision rule (v1 lines 43, 51, 201-202, 214)

Attack: RL is not a fair stand-in for a shortened skill, because it keeps the two tables and drops every paragraph the bank actually tests. Four candidates cite only lines outside both tables: D3 (line 27), D14 (line 60), D16 (line 64) and D25 (line 64). Four more (D5, D8, D13, D15) cite line 56, the paragraph that resolves the table conflict (re-gate as fix re-verification, per-lens gate as lens review, the fable re-run), and RL drops it too. On those eight tasks RS minus RL is positive by construction whenever the skill transmits at all. F2 therefore cannot read 'the tables carry the increment', and a significant F2 would recommend keeping the 1,400-word skill when a four-paragraph addition to the rule might do. Without their prose the tables also lose the below-band and judgment-creep rules (line 27), which the scoring itself relies on.

Required edit: Define the shrink candidate as the form the owner would actually ship: the two tables plus lines 27, 56, 60 and 64 (and the line-8 production-config example), with the word count stated. Alternatively, keep RL and tag each primary task in or out of RL by its governing line. Register F2 separately on the two strata, with the prediction RS minus RL near 0 on in-RL tasks. Remove 'recommends the RL form' unless the in-RL stratum is null and the out-of-RL stratum was tested against RL-plus.

Evidence: SKILL-0.1.2.md: ladder table lines 14-23, verification table lines 46-54; lines 27, 56, 60 and 64 lie outside both. v1 task table: D3 'line 27', D14 'line 60', D16 'line 64', D25 'line 64', D5/D8/D13/D15 'line 56'. v1 line 51 defines RL as R plus the two tables and their lead sentences only.

Checkable: In SKILL-0.1.2.md, lines 27, 56, 60 and 64 fall outside lines 14-23 and 46-54. v1's task table cites one of those lines as the governing rule for D3, D5, D8, D13, D14, D15, D16 and D25 (8 of 18 candidates).

### CL2-02 [KILLS] target: M3 planted-effect check on D13 and its twin (v1 line 191) and the screen (line 166)

Attack: D13's label is not arbitrary to the model's priors. 'An opus ... at xhigh ... fell short, so go to fable' matches the ladder's fable row (line 23), which sits in the table RL carries. It is also close to an unaided escalation prior: in attempt 1, the arm with no text and no plugin chose fable on T17 ('opus review at xhigh missed a defect, get a stronger review'). So passing M3 does not show that a skill-only rule transmitted. M3 also has no screen contingency. D13 is a screened candidate, and if R agrees at or above 0.8 it becomes an anchor. Then RS minus R cannot reach +0.3, M3 fails, and the null branch is misread as 'instrument cannot see the skill's content'.

Required edit: Screen the M3 candidates in R and in A0. Run M3 only on a task with all three properties: screened R and A0 agreement at or below 0.3; a label that contradicts the unaided choice; a governing line outside both R and RL. D8, if it screens low, is a candidate: its label (sonnet) runs against the 'adversarial means opus' prior. If no task qualifies, report M3 as 'not testable' and drop its consequence for the null reading. State that D13 tests line 23 surface-matching as much as line 56.

Evidence: FULL-RESULTS per-task row T17: A nothing '1r; 1/1/1; fable'. SKILL line 23: 'Work an opus attempt at xhigh has fallen short on' → fable, inside the ladder table. D13 prompt: 'An opus gate at xhigh effort ... I reject the verdict'. v1 line 166 routes candidates with R ≥ 0.8 to anchors; line 191 defines M3 with no contingency.

Checkable: FULL-RESULTS shows arm A (no text, no plugin) naming fable on T17. v1 states no rule for M3 when D13's screened R agreement is high.

### CL2-03 [KILLS] target: F4, S minus A0 with omitted models excluded (v1 line 204)

Attack: Excluding omitted models leaves A0 with an almost empty denominator, and the calls left in it are selected by the task. In attempt 1, arm A named a model in 3 of 15 sessions, all on prompts that were trivially mechanical (T02, T03) or named a prior tier (T17). With 2 runs per A0 cell and a naming rate near 0.2, about 64% of primary tasks would have no named A0 call. F4 is then undefined on most tasks, or computed on the tier-naming prompts (D10, D13, D16, D25). Either way it does not estimate 'the skill without the floor'.

Required edit: Score F4 intention-to-treat (an omitted model scores as the session model), and report naming separately with the sentence that S carries the deny claim and the canary's rule-file hint. Alternatively, replace F4 with a contrast where both arms name: S minus R on agreement among named calls, which reads 'skill alone versus rule alone'. In either case, state how a task with zero named calls in a cell is handled.

Evidence: FULL-RESULTS per-setup table: A names a model 3/15. Per-task rows: A named only on T02 (haiku), T03 (haiku) and T17 (fable); every other A cell reads x/0/1. v1 size table: A0 and S at 2 runs per cell.

Checkable: In FULL-RESULTS, arm A's named-model count is nonzero only on T02, T03 and T17.

### CL2-04 [BOUNDS] target: Plugin directory contents in RS, S and D (v1 line 54), and Read access

Attack: The plugin under test is the repository root at 5886ff7: 57 files, not only the skill. They include evals/scenarios.md, an answer key that gives expected tiers for situations matching at least 10 bank tasks: re-gate as fix re-verification (D5), 'gate:<lens>' as sonnet high (D8, D15), a rejected opus verdict re-run once on fable (D13), cheap finders with an opus gate (D14), sonnet that produced wrong results going to opus (D10, D25), security-boundary reads (D12), production-config review (N3) and fable escalation (N4). The Skill tool prints the base directory, line 68 points to 'the plugin's hooks/README.md', and Read and Glob are granted. Only plugin arms can reach the key. The hooks-free variant also keeps hooks/README.md and the gate scripts. Attempt-1 orchestrators read the plugin directory before the first delegation in 0 of 30 plugin-arm sessions, so the base rate is low. It is not zero for workers, and Instrument 2 continues past the first call.

Required edit: Build the plugin directory from shipped components only (.claude-plugin/plugin.json, skills/, commands/, plus hooks/ in D), or deny Read, Glob and Grep on <plugin>/evals/** and <plugin>/docs/**. Register as a mediator every read of a plugin-directory file other than SKILL.md, by arm and by phase (before the first delegating turn, after it). Register a per-protocol sensitivity for E1 that excludes sessions reading such a file before the first delegating turn.

Evidence: `git ls-tree -r --name-only 5886ff7` lists evals/scenarios.md, evals/routing-impact-study/PROTOCOL.md, docs/research/*, hooks/README.md (57 files). The owner's installed cache ~/.claude/plugins/cache/siegler-plugins/delegation-tiering/0.1.1/evals/scenarios.md exists. scenarios.md rows 5, 7, 8, 13, 15, 16, 17, 19 match the bank. A scan of attempt-1 main-session JSONLs (excluding sidechains) found no orchestrator read of the plugin root before or after the first delegation; out/trace.jsonl shows workers reading it in 8 of 63 sessions.

Checkable: The tree at 5886ff7 contains evals/scenarios.md, whose row 13 reads 'sonnet, medium — ... "re-gate" framing does not re-earn the gate tier' and row 17 reads 'sonnet, high — lens review, whatever the label'.

### CL2-05 [BOUNDS] target: H2 isolation between concurrent sessions (v1 lines 63, 66; ledger A7)

Attack: H2 drops the sibling deny list. Deny rules cover only the owner's home and repositories, while every session's fixture copy, plugin copy and configuration directory (rule files, settings.json with the observer, session transcripts) sits under one shared neutral root. R's rule tells the orchestrator the ladder lives in 'the delegation-tiering skill', which R lacks: an incentive to search. A Glob from the root would find a concurrent RS session's SKILL.md, or an RS transcript. Attempt 1 shows the reach is real: workers in 8 of 63 sessions, two of them in no-plugin arms (c07 and c17 without-0), read paths at the plugin repository root or in ~/.claude/plugins. Before the first delegation, orchestrators left the fixture in only 2 of 63 sessions, both Globs for .claude/agents in the working directory. So the main threat is to Instrument 2 and to any exploratory pre-call search.

Required edit: For each session, deny Read, Glob and Grep on the run root except that session's own fixture and plugin directory, and deny its own configuration directory. Register a mediator for any tool path outside those two directories. Exclude by code any session whose tool input touches another session's directory (an infrastructure fault: the arm was not delivered as assigned).

Evidence: v1 line 63: 'deny rules for the owner's home and repositories'. Ledger A7: 'H2 has no sibling deny list'. Rule text: 'Tier ladder and rationale: the delegation-tiering skill (delegation-tiering plugin)'. Grep of attempt-1 batch1 out/trace.jsonl: c07/with-0, c07/without-0, c12/with-0, c17/without-0, c20/with-0, c22/with-0, c24/with-0 and c31/with-0 touch the plugin root or plugin cache.

Checkable: v1 states no deny rule for sibling session directories under the shared root. In attempt 1, two no-plugin sessions (c07/without-0, c17/without-0) had tool calls on paths at the plugin repository root outside cases-full.

### CL2-06 [BOUNDS] target: Bc arm and the Belief decision rule (v1 lines 53, 203, 218)

Attack: Bc does not isolate the owner's belief text. The owner's always-loaded text states no deny condition: CLAUDE.md line 16 says only 'skill + PreToolUse gate' and 'every Agent and Workflow call', and delegation.md never mentions a gate. Bc's sentence paraphrases the skill's Enforcement section (line 68). So the decision rule's reading, 'a property of the sentence in CLAUDE.md', has the wrong referent. Bc also carries more than belief. It gives a deny condition whose only compliant action is to name a model, delivered under the loader's 'MUST follow' wrapper and in a table headed 'Convention'. It is titled 'Delegation hook'. And 'in this environment' is the only arm text that frames the session as an instrumented environment.

Required edit: Restate question 3 and the decision rule: F3 measures 'an explicit deny-condition statement delivered as a user rule'. Its referent is the skill's Enforcement sentence (and the canary), not CLAUDE.md. To test the owner's actual line, add or substitute an arm with CLAUDE.md lines 7, 8 and 16 alone, noting that line 16's first cell 'Delegated-agent model and effort' is itself a naming cue. Drop 'in this environment' from Bc, or log first-turn eval-awareness text for Bc separately.

Evidence: ~/.claude/CLAUDE.md line 16 (read): no 'deny'. ~/.claude/rules/delegation.md (read): no 'gate' or 'deny'. SKILL line 68: 'This plugin's PreToolUse hook denies an Agent call that names no `model`'. v1 line 218: 'that is a property of the sentence in CLAUDE.md'.

Checkable: `grep -c deny` returns 0 on both ~/.claude/rules/delegation.md and line 16 of ~/.claude/CLAUDE.md, while SKILL-0.1.2.md line 68 contains 'denies an Agent call that names no `model`'.

### CL2-07 [BOUNDS] target: Loader framing across arms under H2 (v1 lines 42, 45, 63, 203, 246)

Attack: Not every arm gets the same framing. A0 and S have an empty configuration directory, so they get no instruction block at all. Every other arm gets the loader wrapper ('These instructions OVERRIDE any default behavior and you MUST follow them exactly as written'). F3 (Bc minus A0) therefore mixes the claim with the wrapper. The wrapper also prints each file's absolute path ('Contents of <path>\rules\delegation.md'), so the configuration directory path is model-visible. The banned-string assertion covers only prompt paths and the fixture path. Finally, R is a one-row table plus a 74-word rule, while the owner's always-loaded text is a 12-row table plus about 1,070 words of rules. That gives delegation a salience it lacks in the owner's sessions, so 'the owner's configuration' (lines 42 and 45) overclaims.

Required edit: Use P, not A0, as the baseline for F3: P has the wrapper, one rule file and one row. Alternatively, give A0 and S a content-neutral instruction file so every arm carries the wrapper; confirm in I1 whether an empty directory yields no wrapper. Extend the banned-string assertion to the configuration directory path and every loader-printed path, and name configuration directories by opaque session id. Replace 'the owner's configuration' with 'the owner's delegation text and plugin, isolated', and list what is absent: other rules, the output style, memory, and competing delegation skills.

Evidence: v1 line 63: '(empty for A0 and S)'. v1 line 203: F3 is Bc minus A0. This session's own context shows 'Contents of ~\.claude\rules\delegation.md (user's private global instructions for all projects)'. FACTS: CLAUDE.md 212 words with a 12-row table; rule files total 1,073 words.

Checkable: The loader prints the absolute path of each instruction file in its header, and v1's banned-string assertion (lines 111, 246) names only prompt-visible paths and the fixture path.

### CL2-08 [BOUNDS] target: P as the placebo (v1 lines 40, 52, 208)

Attack: P is route-matched but not inert, and its inertness check is blind. Its TDD sentence ('write the failing test first, make it pass with the least code') is active on the three patch tasks (D7, D16, D25). It can change what the subagent prompt asks for, add reads of test/, or move the task's scope and so its tier. The planned P minus A0 check on over- and under-provisioning cannot detect P's frugality cue: both arms rarely name a model, and an omitted model scores as opus. In attempt 1, all 8 of arm A's over-provisioned runs were omitted models scored as opus. The readout measures naming, not frugality.

Required edit: Report P minus A0 over- and under-provisioning among named calls only, with the count of named calls. On D7, D16 and D25, report delegation rate and the presence of test or TDD wording in the subagent prompt, by arm. Report M1 with and without the three coding tasks. State in Limits that P is active on coding tasks.

Evidence: ~/.claude/rules/coding-principles.md line 5 (read). FULL-RESULTS: 'A's 8 over-provisioned runs are omitted models scoring as opus on haiku and sonnet tasks'. v1 line 175: an omitted model scores as the session model.

Checkable: FULL-RESULTS states that arm A's over-provisioned runs were all omitted models scored as opus, and coding-principles.md contains 'write the failing test first, make it pass with the least code'.

### CL2-09 [BOUNDS] target: Prompts that name a tier: D10, D13, D16, D25, N4, X3 (naming check, F3 and agreement)

Attack: Naming a prior tier in the prompt does three things. (1) It raises model naming in A0, P and Bc: attempt-1 arm A named fable on T17, a prompt that named opus. This shrinks and unevenly spreads the headroom M1 and F3 rely on. (2) A simple 'one tier above the named tier' heuristic agrees with the labels of D10, D13, D25 and N4, so agreement on those tasks needs neither the rule nor the skill; only D16 departs from it. (3) D10 and D25 are labeled opus, so an omitted model, which scores as opus, counts as agreement, giving non-naming sessions free agreement. The screen will route some of these to anchors, but M1 and F3 still pool them.

Required edit: Exclude the six tier-naming prompts from the M1 and F3 denominators, as X4 is excluded, or report those contrasts on both subsets. Register a 'one tier above the named tier' heuristic scorer and publish which tasks it agrees on; treat agreement on those tasks as non-diagnostic of the skill. Flag the tasks where the session-model default coincides with the label (D10, D11, D12, D25, N3), and report the share of their agreement that comes from omitted models, by arm.

Evidence: tasks-v1-prompts.md: D10 'A sonnet subagent at high effort', D13 'An opus gate at xhigh effort', D16 'A sonnet subagent at medium effort', D25 'A sonnet subagent at high effort', N4 'An opus review at xhigh effort', X3 'The haiku subagent's inventory'. v1 labels: D10 and D25 opus, D13 and N4 fable, D16 sonnet. FULL-RESULTS row T17 for arm A: fable named.

Checkable: Under the rule 'one tier above the tier named in the prompt', the predicted model equals v1's label for D10, D13, D25 and N4, and differs for D16.

### CL2-10 [BOUNDS] target: Wording twins alternating within a cell (v1 line 117; Limits line 260)

Attack: The twins do not bound recognition the way v1 claims. D13's 'plain' wording already contains 'An opus gate at xhigh effort', and D8's and D15's plain wordings contain 'adversarial', the skill's own row term (lines 8, 22, 54). Alternating within a cell puts the skill-term wording into half of each twin task's E1 runs, so recognition enters the primary estimate. Arms at 2 runs get one run per wording per task, so 'agreement by wording' is n=1 per cell outside R and RS. The permutation test permutes arm labels within a task, across wordings.

Required edit: Stratify the exact test by task × wording. Register E1 on the plain wordings as a sensitivity. State that D13 has no wording free of skill terms, because its label depends on 'opus gate at xhigh', so D13 measures recognition plus rule. Report by-wording agreement only for R and RS.

Evidence: tasks-v1-prompts.md D13, D8, D15 texts. v1 line 117: 'runs alternate between wordings within each cell'. v1 size table: A0, P, Bc, RL, S and D at 2 runs per cell.

Checkable: The v1 prompt for D13 contains the string 'opus gate at xhigh effort', and the prompts for D8 and D15 contain 'adversarial'.

### CL2-11 [BOUNDS] target: Planted review file docs/reviews/guard-review.md in the shared fixture (v1 line 109)

Attack: The review planted for D13 sits in the one fixture that every session gets. Seven tasks name validate.js (D4, D5, D8, D12, D22, D23, N4). If an orchestrator reads the review, it finds validate.js called sound, with a logging line cited as the signature check. That contradicts D5's 'round one found two problems'. It casts doubt on D4's named evidence ('the signature check at the top of validate()'), which pushes D4 toward a security-boundary read: opus, D4's sensitivity label. It can also signal 'already reviewed', which pushes toward re-verification tiers. The banned list stops the file naming a tier, but not cueing one. Pre-call reading can differ by arm, so the cue becomes an arm-dependent mediator.

Required edit: Place guard-review.md only in the fixture copies for D13 and its twin (per-task fixture variants, identical across arms), and add that to the property list. Alternatively, register reads of the file before the first delegating turn as a mediator by arm, with an E1 sensitivity excluding non-D13 sessions that read it.

Evidence: v1 line 109: one fixture with reviews/guard-review.md 'that calls the file sound and cites a logging line as the signature check'. D4 prompt: 'unsigned payloads are rejected (the signature check at the top of `validate()`)'. D5 prompt: 'Round one of the review ... found two problems'.

Checkable: v1 describes one fixture tree copied into every session, containing docs/reviews/guard-review.md, and seven non-D13 tasks name src/guard/validate.js.

### CL2-12 [BOUNDS] target: Gate belief and lint knowledge carried by RS and S through the Enforcement section and the canary (v1 lines 55, 174, 181)

Attack: Holding belief constant between RS and D is correct. Beyond belief, though, the Enforcement section teaches that the lint flags a model passed through a variable, spread or shared options object, and gives the /* model-gate:allow */ escape. RS, S and D workflow scripts (D14, D15) will therefore use literal model keys more often than R's. v1 marks a non-literal site as 'unresolved' but never says how a launch with an unresolved site scores for agreement, so missingness differs by arm on the workflow tasks. A canary invocation would make a deliberately model-less Agent call the scored first turn. v1 records canary calls but gives no scoring rule (attempt 1: 0 canary calls in 32 invocations).

Required edit: Register launch-level scoring when any site is unresolved: resolve const strings and named options objects as attempt 1 did; otherwise score the launch as non-agreement in every arm, with a sensitivity that excludes it. Report the unresolved-site rate by arm. Register that a session whose first delegating turn follows a canary Skill call scores as non-match under intention-to-treat and is excluded per-protocol, with counts by arm.

Evidence: SKILL line 68: 'a model passed through a variable, a spread, or a shared options object is flagged, and a `/* model-gate:allow */` comment ... lets it pass'. commands/canary.md step 2: 'Issue one Agent tool call ... and NO `model` parameter'. v1 line 174: 'scores as unresolved, reported, not as a non-match'. Round-1 CL6: canary 0 of 32.

Checkable: v1 contains no rule for scoring a Workflow launch's model agreement when one of its sites is unresolved, and no scoring rule for a first delegating turn produced by the canary command.

### CL2-13 [BOUNDS] target: D as an A/A replicate and 'leak check' under Instrument 1 (v1 lines 45, 208; probe I4)

Attack: The 0.1.2 manifest declares only a PreToolUse gate and an async PostToolUse ledger, with no SessionStart or UserPromptSubmit hook. So before the first call, D and RS differ only in the plugin tree: hooks/hooks.json is present in D, and both trees keep the hook scripts. A tool call is needed to see the difference. D minus RS can therefore flag only that leak. It is blind to leaks common to every plugin arm: the base-directory line, the scenarios.md key, the configuration path. Calling it a 'leak check' overstates it. I4 checks only for no gate decision and no ledger, not for identical context.

Required edit: Add to I4 an assertion that the init context is byte-identical between an RS and a D session: system prompt minus session ids, tool list with schemas, and the skill listing. Rename D's role 'noise replicate; detects only D-specific differences (the hooks manifest's presence)'. Cover plugin-arm-common leaks with the read-path mediator in CL2-04.

Evidence: hooks-0.1.2.json (printed): PreToolUse agent-model-gate.js and PostToolUse delegation-ledger.js with async true only. v1 line 54: the variant deletes hooks/hooks.json and changes nothing else. A scan of attempt-1 main sessions found pre-first-delegation reads outside the fixture in 2 of 63 sessions, both Globs of .claude/agents/*.md in the working directory.

Checkable: hooks-0.1.2.json declares exactly two events, PreToolUse and PostToolUse (async), and v1's I4 decision criterion does not compare the init context of RS and D sessions.

### CL2-14 [BOUNDS] target: Blinded re-estimation at the halfway point (v1 line 241)

Attack: The re-estimation is not blind to the treatment arm. It computes within-task disagreement from the D and RS pairs, which are both treatment-arm outcomes, and R's per-task rates are already known from the screen. Disagreement between two arms that share one rate p is 2p(1−p), so the number of added runs depends on the treatment arm's agreement level, and through it on the effect size. The analyst also sees per-task treatment-arm values before the endpoints are computed, against v1's own 'endpoints computed once'.

Required edit: Have a script output only the recommended run count, never per-task disagreement. Base the variance on within-cell disagreement pooled over all arms with arm labels hidden, or on the screen's R variance alone. Record the script's hash in the manifest.

Evidence: v1 line 241: 'the D-versus-RS A/A pairs give a within-task disagreement estimate, the power grid is re-run with it, and runs are added up to a stated cap'. v1 line 166: screen R rates per task, four runs each.

Checkable: v1's re-estimation step uses outcomes from only the D and RS arms, both of which load the skill.

### CL2-15 [FAILS] target: Observer stopReason text (v1 lines 77, 246)

Attack: The stopReason could, in principle, cue the model or carry arm information. The docs place it in the conversation only if the conversation continues. Under Instrument 1 the session ends at the first delegating turn, and the scored turn is generated before any hook runs. It is also the same string in every arm and is hashed in the manifest. It cannot affect the measured choice. A residual exists only if continue:false fails to end a session (parallel calls or a Workflow launch), and I5 covers that case.

Required edit: None beyond I5. Optionally, state in the manifest that the stopReason and the backstop deny reason are byte-identical across arms.

Evidence: hooks.md (fetched today): 'stopReason | Message shown to the user when continue is false. It stays in the conversation, so Claude sees it if the conversation continues'; 'continue ... If false, Claude stops processing entirely after the hook runs'. v1 line 246: the stopReason names no arm or model.

Checkable: The hooks reference describes stopReason as a message shown to the user that Claude sees only if the conversation continues.

### CL2-16 [BOUNDS] target: Construct: first-call agreement with the 0.1.2 label as the proxy for the owner's keep, shrink or retire decision (v1 lines 18, 115, 210, 214-216)

Attack: Four gaps separate the proxy from the decision. (1) The decision rules map a mean over 18 mostly single-Agent-call tasks onto a decision about a document whose cost leverage is in workflows: the owner's spend is 47% workflow workers against 4% Agent subagents, and only D14 and D15 are workflow tasks. (2) The skill is invoked in a fresh session right before the call, which is maximal recency. In organic sessions it sits far back in context or was never read, so a positive E1 overstates organic transmission. (3) Agreement is symmetric, but the owner's costs are not: over-provisioning costs money, under-provisioning costs redos. (4) The labelers are 'a model that did not write the prompts' given SKILL.md. If that is Opus 5.5, the orchestrator's model, then RS agreement partly measures the same model reading the same text twice.

Required edit: Register, beside E1, a signed tier-shift and list-price cost-delta readout per task, weighted by the owner's organic surface mix (workflow against Agent). Require a per-surface reading before any retire or shrink recommendation. Name the labelers' model and choose one other than the orchestrator's. Report E1 separately on tasks with unanimous labels. Add a Limits line that exposure in this trial is maximal recency.

Evidence: Ledger S15: 'README: workflow workers 47% of spend, Agent subagents 4%'. v1 task table: D14 and D15 are the only Workflow tasks among 18 candidates. v1 line 115: labelers are 'a model that did not write the prompts', with no model named. v1 lines 214-215: the decision rules recommend the RL or rule-only form from E1, F1 and F2 alone.

Checkable: v1 names no labeler model, and only 2 of its 18 candidate primary tasks (D14, D15) are Workflow launches.
