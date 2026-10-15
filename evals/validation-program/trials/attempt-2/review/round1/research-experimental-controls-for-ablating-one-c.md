# Research pillar: Experimental controls for ablating one component of an instruction set given to an LLM agent: placebo and active controls, route and position, length and specificity, enforcement-naming, instrument reactivity

## Questions

### Q1. Is the placebo inert in loading, content, length and form, or does it only look unrelated? (Every one of those can make a control active.)

Why here: The draft's P arm is markdown.md plus docstrings.md. I read both files: markdown.md carries `paths: **/*.md`, and the fixture is Markdown-heavy (fourteen docs files; T01, T03-T07, T20-T22 and T25 read or list them). Claude Code loads a path-scoped rule when Read touches a matching file, so P can inject its text mid-session, after the first Read and before the first delegation. That makes P a different thing from the always-loaded rule it should mirror. The two rules are also two short imperatives in the first person ('I have agreed to it'), against the delegation rule's single third-person paragraph. Format alone moves behavior in the published work.

Source: https://code.claude.com/docs/en/memory.md
Quote: A path-scoped rule loads when Claude uses the Read, Write, or Edit tool on a matching file.

Draft: partly: Components and arms asserts P contains no agent/model/effort/delegat/tier strings and calls the paths 'ones no task touches', which is wrong for markdown.md because the tasks read .md files; form and register are not matched.

### Q2. Does the delivery route change the effect: loader (CLAUDE.md and rules arrive as a user message) versus append_system_prompt (system level) versus the first user turn?

Why here: Attempt 1 delivered the rule through append_system_prompt; the owner's sessions get it as a user message after the system prompt. Role and position are documented to carry different authority, and the experimental record on instruction hierarchies says the system/user split is unreliable as a priority signal. A result measured on one route may not transfer to the other, and arms that mix routes (P and R by loader, the skill listing by the harness) confound the contrasts.

Source: https://code.claude.com/docs/en/memory.md
Quote: CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself.

Draft: partly: Probe I1 decides loader versus append_system_prompt and the Limits section states the difference if I1 fails, but no arm crosses route with content, so the size of the route effect is never measured.

### Q3. Is length, or document form, what moves the behavior rather than the content: does the on-demand skill beat a length- and shape-matched document with the ladder content wrong or removed?

Why here: The skill is about 1,400 words against a 74-word rule, and the skill's description sits in context on every turn whether or not the body is invoked. Skill invocation is the model's choice, so RS minus R mixes the listing, the body, and the act of reading a long document. A scrambled-ladder control would show whether the table content, and not mere presence, steers the choice. Published work finds reasoning degrades with added tokens even when the task is unchanged.

Source: https://arxiv.org/abs/2402.14848
Quote: a notable degradation in LLMs' reasoning performance at much shorter input lengths than their technical maximum

Draft: missing: the Limits section admits 'a length effect of an invoked document is not controlled' and offers no control; there is no placebo-skill, stub-skill or shuffled-ladder arm.

### Q4. Does an instruction that names an enforcement mechanism change behavior on its own, and which part of the sentence does it: the skill reference, the gate claim, or the 'every Agent and Workflow call' wording?

Why here: Claude Code's own docs describe CLAUDE.md as context, not enforcement, and the models-know-they-are-watched literature shows that stated oversight, or inferred oversight from blocking feedback, can change behavior. R minus R- removes three things at once: the plugin/skill pointer in delegation.md, the '(skill + PreToolUse gate)' clause in the CLAUDE.md row, and the 'every Agent and Workflow call' timing text. A significant difference cannot be assigned to the gate belief. Also, R's skill pointer dangles in the no-skill arms (R, R-, and the placebo contrast), so R minus RS includes 'the pointer resolves'.

Source: https://arxiv.org/abs/2505.14617
Quote: Reasoning-focused LLMs sometimes alter their behavior when they detect that they are being evaluated

Draft: partly: Question 4 and arm R- target the belief effect and the generator asserts R- is free of plugin/gate/skill/hook strings, but the contrast removes skill pointer and gate claim together, and no control shows whether an enforcement claim attached to an unrelated rule does anything.

### Q5. Does the measurement instrument change what it measures, and does 'first delegation' have one defensible reading?

Why here: The observer denies the first Agent|Workflow call and tells the model to reply 'done'. The first choice is made before that feedback, which is the right design. But: (a) hooks matching the same call run in parallel, so when a task provokes several parallel Agent calls in one turn (T03 asks for fourteen in parallel), 'the first matching call' written to a file is a race; (b) in arm D the gate and observer both deny, and the docs I fetched do not say which reason Claude is shown or how conflicts resolve; (c) models can tell evaluations from use and can infer a monitor from blocking feedback, so any session that continues past the first denial is no longer clean; (d) the prompts say 'use a subagent' and often reuse the skill's own vocabulary, which marks the situation as a test of that vocabulary.

Source: https://code.claude.com/docs/en/hooks.md
Quote: All matching hooks run in parallel.

Draft: partly: Instrument 1 plus the open question 1 acknowledge possible reactivity and the Hawthorne-type risk; the parallel-call race, the D-arm double denial and prompt-vocabulary priming are not addressed.

### Q6. Is the contrast measuring a judgment the skill adds, or compliance with an explicit instruction that the skill states and the control lacks?

Why here: Endpoint 3 (effort agreement, RS minus R) is largely a compliance test: the 0.1.2 skill says to pass effort on every call whose schema lists it, while the Agent tool's own parameter text, as recorded in FACTS (observed, not re-fetched), says to set effort only when instructions ask. R says only 'and effort where supported'. A positive RS minus R on effort then reflects an instruction to do X being followed, the thing verifiable-instruction benchmarks measure, not the ladder's band judgment. Similarly the task prompts T09, T12 and T20 reuse the skill's own terms ('re-gate', 'lens', 'finder'), so agreement can come from string matching the skill, not from judgment.

Source: https://arxiv.org/abs/2311.07911
Quote: Human evaluations are expensive, slow, and not objectively reproducible

Draft: partly: The Measurement section splits effort named from effort agreement and the Limits section admits transmission is not benefit, but endpoint 3 pools the two, and each divergent task has one wording.

### Q7. Are results stable across prompt wording and across repeated runs, and is the statistical unit correct?

Why here: Behavior is sensitive to small phrasing changes, and repeated runs of the same configuration vary. The draft has two runs per cell, tasks written once, and a sign-flip test over tasks. With two runs a task's share can only be 0, 0.5 or 1, and every task has a single wording, so task variance and wording variance are inseparable. Reliability over repeated trials is a distinct quantity from the mean rate.

Source: https://arxiv.org/abs/2310.11324
Quote: extremely sensitive to subtle changes in prompt formatting in few-shot settings

Draft: partly: Task-level exact permutation test and a power simulation are specified, and open question 4 asks about run independence; there is no second wording per task and no A/A calibration of run-to-run noise.

### Q8. Is the treatment actually delivered, and are effects analysed as assigned or as received (the skill is invoked by choice)?

Why here: Skill descriptions are always in context but the body loads only if the model invokes it. In attempt 1's pilot the skill was invoked in 10 of 10 sessions without the rule but only 3 of 10 with it (arm D), so exposure to the body differs by arm and is itself an outcome. An as-invoked analysis breaks randomization; an as-assigned analysis dilutes the effect. The draft records invocation but does not say which analysis is primary.

Source: https://code.claude.com/docs/en/skills.md
Quote: full skill content only loads when invoked

Draft: partly: Mediators lists skill invocation per session and the secondary family reports invocation rate per arm; the primary analysis is not stated as intention-to-treat and no invoked-only sensitivity is planned.

## Recommendations

1. [must] (Components and arms) Fix the placebo. Either drop markdown.md and use only the unconditional rule files (propose-dont-apply.md, git-hygiene.md or coding-principles.md, any one with no `paths:` frontmatter), or strip the frontmatter and also remove 'Markdown' from the fixture. Match the rule in tokens (not words), in form (one third-person paragraph) and register, and assert 'no path-scoped rule is in P' in the generator. Then verify with an InstructionsLoaded hook or a canary in the transcript that P's text is present from turn 1 in every P session.
   Rationale: The tasks read Markdown files, so the current P loads mid-session and differs from R in timing as well as content; a path-scoped placebo may also be absent from the context when the tasks start. The memory page says path-scoped rules load only on a matching file read.

2. [must] (Components and arms) Split the R- contrast into a 2x2 on the two removable clauses: skill pointer (present/absent) and gate claim (present/absent), keeping 'every Agent and Workflow call' in the gate clause. Minimum: add one arm R-g that keeps the skill pointer and drops only the gate claim (CLAUDE.md row clause and timing text). Interpret R minus R-g as the gate-belief effect and R-g minus R- as the dangling-pointer effect.
   Rationale: As drafted, R- removes skill pointer, gate claim and timing text together, so a significant belief contrast cannot support the draft's own decision rule ('the rule's gate sentence does work on its own').

3. [should] (Components and arms) Add a form-matched active control: a rule of the same shape as the delegation rule but demanding a named parameter on a different tool the trial grants (for example, every Read call names an explicit limit), with a row in the CLAUDE.md table that claims a hook enforces it. Run it as arm P2 on the same tasks. Use it to answer whether any imperative that names a parameter, or any enforcement claim, lifts the naming rate.
   Rationale: A topic-unrelated placebo (P) cannot raise model naming, so R minus P is near-certain and uninformative (attempt 1: 13 of 13 versus 3 of 15). An active control of the same form is the contrast that can fail, and it tests the enforcement-naming question directly.

4. [should] (Components and arms) Add skill-side controls on the same tasks: (a) RS-shuf, the skill with the same length, headings and description but the ladder rows and verification-table tiers permuted; (b) RS-stub, the real description with a body of the opening 'Standing rule' paragraph only (about 110 words). Predictions to register: RS-shuf moves choices away from the labels, and RS-stub recovers a stated share of the full effect.
   Rationale: Without them the skill's increment cannot be separated from length, listing presence, or the opening paragraph. A shuffled ladder is a falsifiable control: if choices do not follow the shuffled content, the ladder table is not what transmits.

5. [should] (Components and arms) Reuse arms RS and D in Instrument 1 as a built-in A/A test: at first call the only difference is the gate, which cannot act before the observer ends the session unless the hooks manifest adds other events (not read here). Register that D minus RS in Instrument 1 equals zero up to noise and use its spread to calibrate the run-to-run noise used in the power simulation. State in the arms table that D's Instrument 1 role is calibration, not a gate-effect measure.
   Rationale: A hook that fires only on the call cannot influence that call's content; treating D minus RS at first call as 'the gate's increment' (the arms table says so) is wrong. The identical pair is a free noise estimate.

6. [consider] (Components and arms) Add a route-by-content block on a small task subset: rule R delivered by loader versus by append_system_prompt versus embedded in the first user turn, same text, three tiers of the same ten tasks. Report the route spread beside every main-run contrast.
   Rationale: Instrument route is a documented difference between the attempt-1 harness and the owner's sessions, and the probe I1 only decides which route is used, not how much it matters. Instruction-hierarchy work finds roles are not a reliable priority signal, so the direction of any route effect cannot be assumed.

7. [must] (Harness) Make the observer record every Agent and Workflow tool_use in the turn that contains the first one, with tool_use_id, and define 'first delegation' from the transcript order of tool_use blocks, not from write order into the observer's file. Score a multi-call first turn as agreeing only if all calls in that turn agree (and report the 'any' version beside it). For arm D, record which hook's reason the model received (read it from the transcript tool_result), and add a probe I8 with the two hooks denying together.
   Rationale: Matching hooks run in parallel, so file order is a race, and T03 explicitly asks for fourteen parallel subagents. The hooks docs I fetched do not state conflict resolution when two matching hooks both decide.

8. [must] (Harness) State intention-to-treat as the primary analysis for skill arms (all sessions in the assigned arm, invoked or not) and add a pre-registered sensitivity analysis on sessions in which the Skill tool was called before the first delegation. Add 'skill body read before first delegation' to the mediators.
   Rationale: Invocation is the model's choice (descriptions always in context, body only on use) and in attempt 1's pilot it varied by arm (10/10 versus 3/10), so a per-protocol analysis alone would compare unlike populations.

9. [should] (Harness) Write two wordings for each divergent task: one that reuses the skill's vocabulary and one that describes the same job without it (for example, T09 'check the two fixes landed' versus 'round-two re-gate'; T12 'three reviewers, one per angle' versus 'one per lens'). Randomize wording across runs and report agreement by wording. Keep the three-way label unchanged.
   Rationale: Single wordings make task effects and phrasing effects inseparable, and several current prompts quote the skill's own terms, which tests keyword recognition. Format sensitivity is large and weakly correlated across models in the literature.

10. [should] (Harness) Split effort into two measures with separate endpoints: effort named (compliance with an explicit 'pass effort' instruction) and effort in band given named (judgment). Make endpoint 3 the second; report the first as a transmission check. Also record, per session, the Agent tool's effort-parameter description text from the transcript.
   Rationale: The skill instructs the model to pass effort on every call and the tool description tells it not to unless instructed, so pooled effort agreement mostly measures instruction compliance.

11. [consider] (Harness) Add an evaluation-awareness covariate: record whether the model's first-turn text mentions a test, benchmark, evaluation or 'fixture', and keep the task prompts free of the placeholder '<fx>' by substituting the real fixture path. Keep the observer's deny text neutral (as drafted) and add a no-observer replication of the first call on a 10-session subset via the Instrument 2 transcripts.
   Rationale: Models can often tell an evaluation from deployment use and may behave differently when they do; a cheap covariate and a replication on unobserved sessions bound that.

12. [should] (Harness) Choose run counts from the A/A spread: replace 'two runs per cell' with a register-before-data rule that sets runs so that the width of the 95% interval on a per-task share is under 0.35, and model the per-session outcome with task as a random effect, treating the sign-flip over task means as the sensitivity analysis. Report pass^k-style consistency (all k runs agree) beside the mean.
   Rationale: Repeated runs of nominally fixed settings differ materially, tasks are the sampled population, and the reliability of a repeated choice is a different quantity than its mean rate.

13. [must] (Limits) Add: (1) the placebo is a topic-unrelated control and cannot separate 'any rule' from 'this rule' unless P2 runs; (2) the arms mix routes unless I1 passes; (3) the tasks were written by the same author as the skill and the labels are the skill's text, so agreement measures recoverability of the author's reading, with the wording split as the only guard; (4) the first-choice design cannot see whether a gate changes the second call; (5) the Opus 5.5 main run and Fable transfer subset are one model generation each, and Anthropic's guidance says newer models respond more strongly to the system prompt, so a result may not survive a model upgrade.
   Rationale: These are the confounds an outside reader will list first; stating them now makes the claims falsifiable at the strength the design supports.

14. [should] (Limits) Replace 'the placebo matches the rule's length and route, not the skill's' with a statement of which of the skill-side controls (RS-shuf, RS-stub) ran, and say that a null result for the skill is read against RS-shuf's behavior (if the shuffled skill also does nothing, the skill's content is not what is being measured).
   Rationale: Makes the length limitation conditional on the design rather than an admission without a remedy.

15. [consider] (Components and arms) Demote endpoint 1 (named-model rate, R minus P) to a positive-control check and make the substantive primary contrast model agreement and effort-in-band among divergent tasks. Pre-register that endpoint 1 failing (R not above P) would invalidate the instrument, not the rule.
   Rationale: Attempt 1 already showed the naming effect near ceiling; spending a primary slot on a contrast that cannot fail inflates the family without information.

## Gaps

- The WebFetch tool returns only short fragments (about 125 characters) of abstracts, so every paper quote above is a fragment of the abstract and I could not read full texts or methods sections. The papers cited (IFEval 2311.07911, SysBench 2408.10943, Sclar et al. 2310.11324, Levy et al. 2402.14848, the Hawthorne-effect paper 2505.14617, SkillsBench 2602.12670, Non-Determinism 2408.04667, tau-bench 2406.12045, Error Bars 2411.00640) were fetched live for their abstracts only.
- Abstract fragments I obtained for 'Position is Power' (2505.21091), 'Control Illusion' (2502.15851) and 'Instruction Hierarchy' (2404.13208) were paraphrases or off-topic fragments, so my statement that roles are an unreliable priority signal rests on the fetch tool's paraphrase of the Control Illusion abstract, not a verbatim quote; none of the three tests the loader versus append_system_prompt contrast in Claude Code itself.
- I found no published paper that ablates a CLAUDE.md-style rule file or an agent skill document with a length-matched placebo; the closest results (a preregistered placebo-controlled study of self-repair feedback in small code models, and practitioner posts on prompt ablation) came from search snippets that I did not fetch, so the placebo-control recommendations rest on reasoning, not on a cited precedent.
- SkillsBench (2602.12670) reports curated skills raising pass rate; its claims about self-generated skills and about 'focused 2-3 module skills beating comprehensive documentation' came from a search snippet and a secondary blog, not the abstract, so I did not rely on them.
- The hooks documentation I fetched (first 100,000 of 268,801 characters) does not state how conflicting decisions from two matching PreToolUse hooks resolve, or which reason Claude receives; this is why I recommend a probe, not a statement.
- I did not verify the claim in FACTS.md that the Agent tool's effort description says to set it only when instructions ask; I used it as recorded (observed on the owner's machine), not as a fetched page. I also did not read the 0.1.2 hooks manifest, so the 'D equals RS at first call' argument assumes the manifest registers no SessionStart or UserPromptSubmit hook.
- I did not obtain an OpenAI or Anthropic page that speaks directly to the effect of placing the same instruction in system versus first-user position; the OpenAI page I fetched gives role priority ('developer' ahead of 'user') and the Anthropic prompting guide gives long-document and query placement and a warning about aggressive emphasis, none of which is a measurement of route effect for this case.
- The relayed user question about 'the delivery route' and about what offers the effort setting is outside this pillar and I did not answer it beyond the route recommendations above; the effort-surface facts are in FACTS.md and I did not re-fetch them.