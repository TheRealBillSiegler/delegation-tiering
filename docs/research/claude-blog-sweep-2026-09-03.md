# Research record: claude.com blog sweep and advisor-attachment experiments — 2026-09-03

Three questions, worked 2026-09-03: (1) what on the claude.com blog bears on this plugin; (2) what happens, live, when the native advisor is configured for delegated agents, and when it silently fails to attach; (3) what the evidence says about whether the plugin's premises hold. Confidence labels follow the repo's [anchoring policy](../REMEDIATION.md#anchoring-policy): blog quotes are article-tier (digest is the ceiling; re-verify against the live URL before anchoring a shipped claim), doc quotes are mechanics-tier, and everything under "Live experiments" is a dated live test on this machine.

## Method and coverage

- **Enumeration:** the claude.com blog index does not paginate server-side (pages 2–4 returned page 1), so posts were enumerated from the `claude-code` category (5 pages) and the `agents` category (4 pages) plus two `site:claude.com/blog` searches. About 125 titles were triaged by hand; the main feed reports 16 pages (roughly 240 posts), and the `announcements` and `enterprise-ai` categories were not swept.
- **Extraction:** 26 posts were each read by one Sonnet 5 agent through WebFetch against a fixed schema: verbatim claims by topic, a supports/contradicts/qualifies/silent check against six plugin premises, and "novel for the plugin" items. 397 claims extracted. `fetch_status` is `ok` for 6 posts and `partial` for 20: WebFetch runs pages through a summarizing model that sometimes declines long verbatim reproduction, so absence of a topic in a partial digest is weak evidence and quoted text is "as rendered by the fetch tool" unless re-verified.
- **Premises tested** (the plugin's, stated for the readers): P1 explicit lowest-sufficient model per delegation, bottom-up, because the orchestrator reviews; P2 the orchestrator is the most capable model in the session; P3 only adversarial gates, open-ended design, and security-boundary reads earn the top tier; P4 cost per completed task, model class before effort; P5 a deterministic deny hook is worth its friction over prose; P6 cheap workers plus a top-tier gate for fan-outs.

## Findings of use, ranked

1. **The post the skill should cite for model-versus-effort is "Choosing a Claude model and effort level in Claude Code", not only "Claude models explained".** It gives a diagnostic the ladder lacks: "If Claude has all the pertinent context, clearly tried, and still got it wrong, that's a signal to pick a more capable model. If Claude got it wrong by skipping a file, not running the tests, or bailing on a refactor partway through, pick a higher effort level." It also states a capability ceiling effort cannot cross: "the larger model can accomplish tasks the smaller one cannot even at the highest effort settings", and for the top tier, "it finished jobs Opus and Sonnet can't reach at any effort level." And it cuts against per-call effort tuning: "Consider this more as a general preference than a task-by-task decision."
2. **"How Anthropic runs large-scale code migrations with Claude Code" (2026-07-16) is the strongest primary support for the plugin's shape, and it names a top-tier category the ladder omits.** "Don't use the largest model for everything. Token spend concentrates in your loops, so design them deliberately. Smaller models handle the high-volume implementation fan-out well; save your largest model for reviewers and for anything that writes rules other agents will follow." Also: "Two adversarial reviewers evaluate the work of the implementers using separate contexts and disagreement between reviewers goes to a third agent"; "Make review adversarial and verification mechanical"; "Validate the judge. Run it against the original code to confirm it passes. Then run it against deliberately broken code to confirm it fails." Note the post calls Fable directing cheaper executors "an advisory pattern": Anthropic's own blog uses the word loosely for the orchestrator-with-reviewers shape, while the platform doc's advisor-versus-orchestrator table defines "advisor" narrowly. The skill's "Advisor pattern" heading is therefore a disambiguation problem, not an error.
3. **Delegation is the cache-safe way to use a cheaper model, and a delegation is a cache write of the whole subagent context.** "Prompt caching is everything": "if you're 100k tokens into a conversation with Opus and want to ask a question that is fairly easy to answer, it would actually be more expensive to switch to Haiku than to have Opus answer, because we would need to rebuild the prompt cache"; "If you need to switch models, the best way to do it is with subagents". "Agent Harness Design": "If you need a cheaper model, use a subagent." "Maximizing the value of your Claude Code sessions": "a subagent sometimes has to re-read things the main session already had, and it's paying for its own turns while it does." Live figure below: a trivial one-step subagent on this machine writes about 36K tokens of context before doing anything.
4. **The first question is whether to delegate at all; the plugin has no rung for it.** "The Anatomy of Effective Commerce Agents" (2026-09-02): "Every handoff to a subagent is a state-lossy operation, which often impacts the quality of the subagent's response"; skills in one agent beat per-domain subagents on quality. "Building multi-agent systems": "multi-agent implementations typically use 3-10x more tokens than single-agent approaches for equivalent tasks", with a three-scenario gate (context pollution, parallelization, specialization). "Subagents in Claude Code" lists when not to. "Multi-agent coordination patterns": "Unless explicitly parallelized, subagents run one after another, meaning the system incurs multi-agent token costs without the speed benefit."
5. **Effort sweeps and re-run-on-failure are the levers the platform doc puts before architecture** ([optimizing for cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence), mechanics-tier): "Effort sweeps before architecture. Most workloads end here." On SWE-bench Pro, Fable 5.1 at low effort solved 88.6% at $0.54 per solved task against Sonnet 5 default 77.4% at $0.84, so the cheaper-per-token model cost more per solved task. "Low + re-run at default" held Opus 5's pass rate at half the cost. Fable 5.1 cache reads cost 0.025x the input price ($0.25 per million) against 0.1x on other models, a 4x deeper discount, so in cached agent loops Fable 5.1 costs "half as much on cached input ($0.25 against $0.50 per million)" as Opus 5. (Corrected 2026-09-11: an earlier version quoted "10x cheaper than other models", which is not on the page.) The ladder is organized by price per token; these numbers say the top model at low effort belongs on it as a rung.
6. **Deterministic gates over prose has independent support, and so does injecting rather than denying.** "Steering Claude Code": "A `PreToolUse` hook can inspect a call and exit with code 2 to block it." "How to configure hooks": hooks "can approve it, block it, request user confirmation, or modify the parameters" via `updatedInput`. "Auto mode is now the default": human approvals ran at 97% and habituated, an argument that prose reminders degrade into rubber-stamping. "The AI-Native SDLC playbook": run the eval suite "on any change to CLAUDE.md, skills or hooks."
7. **Over-constraining is a named failure.** "The new rules of context engineering for Claude 5 generation models": "Overall, we found that we were overconstraining Claude Code, both through our system prompt and in our CLAUDE.md files and skills." and "we see several conflicting messages in a single request". (Corrected 2026-09-11: an earlier version spliced the two sentences into one quotation.) The plugin delivers the same instruction three ways per delegation (rule file, skill, allow-branch reminder); the reminder is already a ceremony candidate in [evals/README.md](../../evals/README.md).
8. **Ready-made measurement harnesses.** "Improving skill-creator": blinded comparator agents ("They judge outputs without knowing which is which") and benchmark mode tracking "eval pass rate, elapsed time, and token usage", a shape the unrun routing-impact study could reuse. "Loop engineering": `/usage` "breaks down recent usage by skills, subagents, and MCPs", a native surface that overlaps the ledger.

## Premise scorecard (26 posts)

| Premise | Supports | Contradicts | Qualifies | Silent | Reading |
| --- | --- | --- | --- | --- | --- |
| P1 explicit lowest-sufficient, bottom-up | 0 | 0 | 8 | 18 | No post argues bottom-up; the qualifiers all say smaller for routine, larger for hard, with measurement deciding |
| P2 orchestrator is the top model | 1 | 1 | 3 | 21 | Supported by the migrations post (Fable and Opus 4.8 "particularly good at delegating, directing, and verifying"); contradicted by the advisor strategy, which is the inverse shape |
| P3 three top-tier categories | 0 | 1 | 2 | 23 | The commerce post starts merchant agents on Opus for "analysis-heavy" work; the migrations post adds "anything that writes rules other agents will follow" |
| P4 cost per task, model before effort | 5 | 1 | 6 | 14 | Cost-per-task is universally supported; "model before effort" is the contested half: the loops post ranks model and effort together as "among the biggest levers", and the platform doc puts effort sweeps first |
| P5 deterministic deny hook | 1 | 0 | 5 | 20 | Mechanism documented; nobody but this plugin argues for denying model-less delegations |
| P6 cheap workers, top-tier gate | 2 | 0 | 9 | 15 | Supported by the migrations post; qualified everywhere by "delegate only when the three scenarios apply" |

## Live experiments, 2026-09-03

Environment: Claude Code 2.1.248 (WinGet CLI on PATH; the VS Code session that ran them is 2.1.259), Windows 11, claude.ai login, Max plan, first-party API, no `advisorModel` saved, feature-flag fetching on. Every run was headless (`claude -p`, `--output-format stream-json --verbose`) with a probe prompt that asks the model whether a tool named `advisor` is in its tool list, to call it once if so, and to end with a `PROBE ...` line; runs were spawned from separate scratch directories so transcripts are separable. List-priced cost of the whole set: about $4.50, billed to plan usage.

| Run | Configuration | Observed |
| --- | --- | --- |
| E1 | `--model sonnet --advisor sonnet` | Advisor present and called; `server_tool_use` name `advisor` plus `advisor_tool_result` (plaintext `advisor_result` for a Sonnet 5 advisor) in the stream and in the session transcript; `usage.iterations[]` carries an `advisor_message` entry with the advisor model. The `system.init` event's `tools` list does **not** include the advisor: it is a server tool, so `init.tools` cannot detect attachment |
| E2 | E1 plus one foreground and one background `model: sonnet` Agent call | Both subagents inherited the advisor and consulted it; each subagent transcript under `<session>/subagents/agent-*.jsonl` persists the `server_tool_use`, the `advisor_tool_result`, and the `advisor_message` iteration. Background inheritance contradicts the original report in anthropics/claude-code#76381 and matches its later comments |
| E3a | `--advisor haiku` | Exit 1: `The model "haiku" cannot be used as an advisor.` Loud |
| E3b | `CLAUDE_CODE_DISABLE_ADVISOR_TOOL=1 --advisor sonnet` | Runs; no advisor; no stderr. Silent by design |
| E3c | `--model opus --advisor sonnet` (flag) | Runs; stderr `"sonnet" cannot advise "claude-opus-5" ... The advisor will not be used for the main model.`; main has no advisor. Loud in headless mode |
| E4 | E2 with `--settings` adding SubagentStart, SubagentStop, Stop, and PostToolUse(Agent) hooks that dump their stdin | See "Hook fields observed" below |
| E5 | E1 plus a Workflow whose script calls `agent(PROBE, { model: 'sonnet', effort: 'low' })` | The workflow agent inherited the advisor and consulted it; transcript under `<session>/subagents/workflows/<run>/agent-*.jsonl`. Closes the open question behind anthropics/claude-code#85124 |
| E6 | `--model opus --advisor sonnet` plus two `model: sonnet` subagents | Main: no advisor (stderr line). Both subagents: advisor present and consulted. The documented "subagents whose own model satisfies the pairing may still use the advisor" behavior, verified |
| E7 | `DISABLE_TELEMETRY=1 --advisor sonnet` | Runs; no advisor; no stderr. Silent |
| E8 | `--settings '{"availableModels":["sonnet"]}' --advisor opus` (flag) | Exit 1: `The model "opus" cannot be used as an advisor.` Loud |
| E8b | `--settings '{"availableModels":["sonnet"],"advisorModel":"opus"}'` (saved setting) | Runs; no advisor; no stderr. Silent |
| E9 | `--model opus --settings '{"advisorModel":"sonnet"}'` (saved setting, invalid pairing) | Runs; no advisor; no stderr. Silent |

Reading: CLI-side validation of the `--advisor` flag fails loudly, for an invalid advisor model, an invalid pairing, and an allowlist exclusion (E3a, E3c, E8). A saved `advisorModel` fails silently under allowlist exclusion and invalid pairing (E8b, E9). The kill switch and feature-flag-off runs were silent with the flag (E3b, E7) and were not tested with a saved setting. Since `/advisor <model>` saves to user settings, the common path is the silent one. Not tested: the Fable usage-credit consent state (this account has consented) and non-Anthropic API paths.

### Per-consult cost, observed

Eight unique consults (the main-session transcript mirrors subagent consults; duplicates removed). Advisor iterations showed `cache_read_input_tokens: 0` in every case, matching the Claude Code doc's statement that the advisor's read is not cached.

| Run | Caller | Advisor input tokens | Advisor output tokens |
| --- | --- | --- | --- |
| E1 | main session | 61,373 | 11,480 |
| E2 | foreground subagent | 36,886 | 11,636 |
| E2 | background subagent | 35,685 | 5,238 |
| E4 | foreground subagent | 35,731 | 6,889 |
| E4 | background subagent | 36,950 | 7,702 |
| E5 | workflow agent | 33,661 | 2,060 |
| E6 | foreground subagent | 36,633 | 4,389 |
| E6 | background subagent | 35,296 | 4,012 |

Mean 39,027 in and 6,676 out per consult, for a one-step probe with an empty transcript; the main-session consult (E1) is the largest outlier, and the seven subagent consults alone average 35,835 in and 5,989 out. At list rates that is $0.15 with a Sonnet 5 advisor, $0.36 with Opus 5, $0.72 with Fable 5.1. The input is almost entirely the subagent's fixed context on this machine (system prompt, plugins, hooks, skills): the foreground probe's own `PostToolUse.tool_response.usage` showed 36,274 cache-creation tokens and 35,476 cache-read tokens for a run with 850 output tokens. A 12-agent fan-out under a Fable advisor with one consult each therefore starts near $9 of advisor reads before any real work, and the advisor's read grows with the subagent's transcript.

### Hook fields observed (E4), against the docs

| Hook | Field | Observed | Doc status |
| --- | --- | --- | --- |
| SubagentStop | `agent_transcript_path` | Present; points at `<session>/subagents/agent-<id>.jsonl`, which contains the advisor blocks and `advisor_message` iterations | Docs-silent: two targeted fetches of hooks.md could not reach the SubagentStop section; the common-fields table documents `agent_id` and `agent_type` only |
| SubagentStop | `transcript_path` | The parent session transcript, not the subagent's | Docs-silent as above |
| SubagentStop | `effort` | `{"level":"xhigh"}`: the session effort, inherited by every Agent-tool subagent | Documented as present in tool-use context |
| SubagentStop | `agent_id`, `agent_type`, `last_assistant_message` | Present | `agent_id`/`agent_type` documented |
| PostToolUse (Agent) | `tool_response.resolvedModel` | `claude-sonnet-5` for a `model: sonnet` request, on both the completed foreground response and the `async_launched` background response | Docs-silent |
| PostToolUse (Agent) | `tool_response.usage`, `totalTokens`, `totalDurationMs`, `totalToolUseCount` | Present on the completed foreground response | Docs-silent |
| PreToolUse / PostToolUse | anything for the advisor consult itself | Nothing fires; the consult is server-side inside one request | Consistent with anthropics/claude-code#70611 |

### Local ledger read

313 delegations recorded 2026-08-07 to 2026-09-03 across the two ledger files. 18 denials, of which 14 are paired Agent-plus-Workflow denials within ten minutes (the canary and weekly probe deliberately trigger both) and 4 are solo, all between 2026-08-09 and 2026-08-15, the plugin's build period. Zero denials since 2026-08-16 across about 170 delegations. Agent-call model mix: sonnet 153, fable 6, opus 6, haiku 4. Workflow model literals: sonnet 104, fable 79, opus 9. Every subagent transcript checked in this session (14 workflow agents, 1 Agent call, plus the 11 experiment subagents) answered on the requested model.

## Proposals arising (nothing applied)

Superseded on 2026-09-03 by the reviewed [proposal record](advisor-and-ladder-proposal-2026-09-03.md), which holds the release sequence, the live tests that gate it, what the review pass cut, and what is deliberately not proposed. The first draft of this section overstated two things the review corrected: the `--advisor` flag is loud only for CLI-side validation, and the 39K per-consult mean included the main-session outlier.

## Per-post digests

Generated from the readers' structured output: thesis, non-silent premise checks, novel items, and up to ten quotes per post, preferring quotes with figures. Dates marked "as reported by fetch tool" or "unknown" were not visible to the reader; where the category listing pages showed a date it is given in the source line.

### The Claude Code guide for startups

- Source: <https://claude.com/blog/claude-code-guide-for-startups> — dated 2026-08-20 (from the category listing page, captured 2026-09-03); not independently verified); fetch partial; 22 claims extracted, 10 shown
- Thesis: The article is a general adoption/culture guide urging startups to build "AI-native" engineering practices around Claude Code — sharing conventions via CLAUDE.md and skills, automating routine SDLC work with agents and hooks, verifying agent output with evals and deterministic gates, and using worktrees/plan-mode for large rebuilds — rather than a technical guide to model-tier selection for delegated subagents.

Premises: **P5 qualifies** — "Use hooks as deterministic hard gates"; **P6 qualifies** — "Dynamic workflows can be used to fan multiple subagents to analyze large amounts of data in parallel"

Novel for the plugin:

- Purpose-built agents as named repo contributors for a recurring maintenance task (fixing flaky tests, finding missing coverage) — ClickHouse agents rank as the #2 and #3 contributors to the repo (section: AI-native SDLCs).
- 'Claude Tag' as an automated on-call first responder for CI/CD failures (section: AI-native SDLCs).
- 'Code Review' described as a managed, research-preview multi-agent service built into Claude Code, distinct from ad-hoc subagent fan-out (section: Automate the tedium).
- Git worktrees used specifically to run old and new implementations side by side and diff their eval results ('v2 running next to v1, run your evals against both') as a rebuild/migration pattern (section: Build for rebuilding).
- 'Plan mode' recommended as the entry point for nontrivial rewrites, with Claude proposing the rebuild approach before code changes (section: Build for rebuilding / The Checklist).
- Company-wide plugin marketplace as the distribution mechanism for sharing skills across an organization, not just within one repo (section: Everyone ships / The Checklist).
- Cainex's verification design pairs deterministic checks with an LLM-judge prompt framed as 'is this a real error or just a different valid path' — a judge-prompt pattern rather than a bare pass/fail eval (section: Trust, but verify).

Quotes:

- [cost] "No specific cost-per-task metrics are provided." ([tool-derived finding, not an article quote]) — no cost-per-task figures found in the article
- [cost] "ClickHouse: 30% more features shipped" ([tool-derived paraphrase]) — 30% more features shipped (ClickHouse) — reported as paraphrase, not confirmed verbatim wording
- [cost] "Omni: 2-3x engineering productivity" ([tool-derived paraphrase]) — 2-3x engineering productivity (Omni) — reported as paraphrase, not confirmed verbatim wording
- [subagents-orchestration] "One engineer ran a ~13-ticket initiative with Claude subagents in parallel, each owning a ticket and its PR." (Everyone ships (Commure example)) — ~13-ticket initiative, one subagent per ticket/PR
- [subagents-orchestration] "purpose-built agents designed to fix flaky tests and find missing test coverage are now the #2 and #3 contributors to the ClickHouse repo." (AI-native SDLCs (ClickHouse)) — #2 and #3 contributors to the ClickHouse repo
- [model-selection] "[Uses] Anthropic models behind the scenes" (Prototype, dogfood, productionize)
- [advisor] "The article does not discuss advisor tools, cost-per-task metrics, effort quantification, or specific model selection guidance for delegated work." ([tool-derived finding across full article])
- [subagents-orchestration] "Dynamic workflows can be used to fan multiple subagents to analyze large amounts of data in parallel" (Automate the tedium / Accelerating processes with agents / The Checklist Chapter 2)
- [subagents-orchestration] "Loops are agents that repeat cycles of work until a stop condition is met" (Trust, but verify)
- [subagents-orchestration] "Use [git worktrees] to run a rebuild in an isolated copy of the repo" (Build for rebuilding)

### Choosing a Claude model and effort level in Claude Code

- Source: <https://claude.com/blog/claude-model-and-effort-level-in-claude-code> — dated unknown (byline present, no date shown in fetched content); fetch partial; 23 claims extracted, 10 shown
- Thesis: The post explains Claude Code's two independent quality dials — model selection (which frozen weights answer, i.e. capability ceiling) and effort level (how much work Claude does before returning: files read, verification, plan depth) — and gives a diagnostic heuristic (did Claude not know enough, or not try hard enough?) plus a cost framing (larger models cost more per token but can cost less per completed task on genuinely hard, multi-step work, and can solve what smaller models cannot at any effort level).

Premises: **P3 qualifies** — "Pick a larger model when the problem is genuinely hard. For example, problems like subtle bugs, unfamiliar domains, or architecture decisions."; **P4 supports** — "You're paying more per token for the larger model, but on tasks that genuinely stretch the smaller one, the total cost per task can come out lower."

Novel for the plugin:

- The post frames effort and model as two orthogonal dials with distinct diagnostic tests: model is wrong when Claude 'didn't know enough' (had context, clearly tried, still failed) vs. effort is wrong when Claude 'didn't try hard enough' (skipped a file, didn't run tests, bailed partway) — a ready-made decision heuristic for a tiering skill, from 'What to change when Claude gets it wrong' / 'Key takeaways'.
- Effort level is sent to the model as an explicit request parameter and its behavior is 'baked into the frozen weights' via training — meaning effort is a first-class per-call dial with model-specific trained semantics, not a generic 'think longer' flag ('How Claude Code effort level works').
- The post explicitly warns against task-by-task effort tuning: 'Consider this more as a general preference than a task-by-task decision' and 'Most of the time, you shouldn't be thinking about either setting' — this cuts against a plugin norm of setting effort explicitly on every delegated call, worth reconciling ('Picking an effort level', 'Start with the defaults, then reach for the dials').
- There is a capability ceiling, not just a cost curve: 'the larger model can accomplish tasks the smaller one cannot even at the highest effort settings' — for the top-tier model specifically, 'it finished jobs Opus and Sonnet can't reach at any effort level' — meaning effort cannot always substitute for model tier, relevant to a plugin's escalation logic ('Effort, model, and token consumption').
- A named-model capability hierarchy is offered as a mental model — 'specialist' (Fable/top tier) vs 'expert' (Opus) vs 'generalist' (Sonnet) — with the specialist's value being pattern recognition from rare training exposure rather than thoroughness, i.e. worth 'saving for the tasks that genuinely need it' ('Fable vs. Opus vs. Sonnet').
- Token/effort has a hard ceiling distinct from effort's soft guidance: max_tokens truncates mid-stream and is described as 'a blunt instrument, mostly relevant to API developers,' with 'task budgets' or brevity instructions in the prompt offered as the more useful soft controls — relevant if the plugin ever wants to cap a delegated agent's spend ('Effort, model, and token consumption').
- The post contains no content at all on subagents, delegation, orchestrators, hooks, plugins-as-gates, an 'advisor' tool, or evals/verification gates — confirmed by an explicit keyword search of the page text finding none of 'advisor', 'subagent', 'sub-agent', 'orchestrat', 'eval', 'delegat'. A delegation-tiering plugin author should not cite this post as authority for P1, P2, P5, or P6; it only supports the single-session model/effort choice, not multi-agent architecture.

Quotes:

- [model-selection] "Claude model selection chooses the set of fixed weights, or the overall capability range of the model. While models can be provided context or steered, the model's overall knowledge base and capabilities are set." (Key takeaways)
- [model-selection] "Choose smaller models for more routine tasks and larger models for more complex or ambiguous tasks. Start with default effort levels for each model and tune as a general preference based on the type of work you do rather than task-by-task." (Key takeaways)
- [model-selection] "If Claude has all the pertinent context, clearly tried, and still got it wrong, that's a signal to pick a more capable model. If Claude got it wrong by skipping a file, not running the tests, or bailing on a refactor partway through, pick a higher effort level." (Key takeaways)
- [model-selection] "Pick a larger model when the problem is genuinely hard. For example, problems like subtle bugs, unfamiliar domains, or architecture decisions." (Model: The problem was too hard)
- [model-selection] "Pick a smaller model when the work is routine. For example, edits you can describe precisely, mechanical changes, or questions about code that's already in context." (Model: The problem was too hard)
- [model-selection] "If Claude has all the pertinent context and clearly tried and still got it wrong, that's a signal to pick a larger model." (Model: The problem was too hard)
- [effort] "Effort means more than "thinking time." It controls how much work Claude does on your request overall including the number of files read, tools used, and how many steps it takes before it checks back in with you." (Key takeaways)
- [effort] "The effort level is sent to the model as part of the request, right alongside your prompt." (How Claude Code effort level works)
- [effort] "The model was trained to understand how to behave at each effort level and that learned behavior is baked into the frozen weights." (How Claude Code effort level works)
- [effort] "At higher effort levels, Claude often starts with creating a plan and the level of effort influences the depth and breadth of that plan." (How Claude Code effort level works)

### Building verification loops in Claude Code with Skills

- Source: <https://claude.com/blog/building-verification-loops-in-claude-code-with-skills> — dated 2026-07-22 (from the category listing page, captured 2026-09-03); fetch partial; 6 claims extracted, 6 shown
- Thesis: The post explains how to build "verification loops" in Claude Code — self-checking cycles where Claude runs tests/linters/custom checks and fixes failures — covering both built-in mechanisms (toolchain integration, /verify, Code Review, GitHub Actions, spec validation, rubric-graded managed agents) and how to author custom ones as Skills, with guidance on where in a workflow (standalone, embedded, chained, on every PR) to trigger them.

Premises: silent on all six.

Novel for the plugin:

- 'Rubrics in Claude Managed Agents (beta)' — a separate grader agent verifies outcomes against a rubric and failures loop back automatically for rework. This is a distinct verification-gate pattern (grader-agent-with-rubric, auto-retry-on-fail) not covered by the six premises, which assume a human/orchestrator-reviewed gate rather than an automated rubric-driven retry loop. Section: Built-in verification loops.
- Deployment taxonomy for verification skills — Standalone (deliberately invoked, cross-cutting checks like security/accessibility that don't run every time), Embedded (fires automatically as part of a producing skill's body), Chained (one skill invokes another sequentially for end-to-end workflows), On every PR (team-wide infra applied to all changes via GitHub Actions). This is a placement/triggering taxonomy for verification work that could map onto where a delegation-tiering plugin's gate hooks in. Sections: Standalone / Embedded / Chained / On every PR.
- The article explicitly recommends putting exact build/test commands in CLAUDE.md to reduce Claude's need to infer them — a concrete, narrow CLAUDE.md usage pattern, not a broad steering-mechanism discussion. Section: Writing verification loops.

Quotes:

- [evals-verification] "A verification loop is a repeating cycle where an AI agent checks its own work — running tests, linters, or custom checks — and fixes what fails before moving on." (What is a verification loop?)
- [evals-verification] "Rubrics in Claude Managed Agents (beta): A managed agentic service that allows you to verify outcomes against a rubric using a separate grader agent. Failures loop back for rework automatically." (Built-in verification loops)
- [steering-mechanisms] "A good practice is to list your exact build and test commands in CLAUDE.md so Claude doesn't have to infer them." (Writing verification loops / toolchain guidance)
- [steering-mechanisms] "Claude aims to catch and act on error codes and warnings from any tool you provide such as a linter." (Built-in verification loops)
- [other] "Write the best-practices version in plain English, the way you'd hand it to a new teammate on day one." (Writing verification loops)
- [other] "The more you can encode for Claude to follow, the more often Claude's response will land closer to what you want on the very first try." (Key Principle)

### Subagents in Claude Code

- Source: <https://claude.com/blog/subagents-in-claude-code> — dated 2026-04-07 (from the category listing page, captured 2026-09-03); fetch partial; 9 claims extracted, 9 shown
- Thesis: The post is a practical how-to on when and how to use Claude Code subagents (parallel research, fresh-context review, pipeline steps) and the four ways to invoke them (conversational, custom subagent files, CLAUDE.md policy, skills), plus when overhead makes subagents the wrong call.

Premises: **P4 qualifies** — "Subagents carry overhead. Each one spins up its own context, consumes tokens, and adds a layer of indirection between the developer and the work."; **P5 qualifies** — "Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle."; **P6 qualifies** — "Three subagents working in parallel complete in roughly the time one would take."

Novel for the plugin:

- The post frames the four invocation methods (conversational invocation, custom subagents, CLAUDE.md instructions, skills) as an escalation path — 'Start conversational, automate later' — i.e. don't build durable subagent/CLAUDE.md/skill infrastructure until a conversational pattern proves itself repeatedly. This is a maturity-ladder idea the six premises don't address.
- Section 'When shouldn't you use subagents?' lists concrete anti-patterns not covered by the premises: sequential dependent work, same-file edits by multiple agents, small/trivial tasks, spawning too many specialist agents, and work requiring agent-to-agent coordination. Useful as a companion 'don't delegate at all' checklist alongside the tiering plugin's 'which tier' checklist.
- Custom subagents are described as having their own permissions and optionally their own model, per the 'Custom subagents' section — confirming the mechanism the delegation-tiering plugin's PreToolUse gate presumably targets exists in the product, but the post gives no guidance on which model to pick for which subagent type.
- The parallel fan-out example ('Three subagents working in parallel complete in roughly the time one would take') is framed purely as a wall-clock/throughput benefit, with no mention of tiering the parallel workers differently or gating their output with a stronger verifier — a gap P6 assumes but the post doesn't fill.

Quotes:

- [subagents-orchestration] "Three subagents working in parallel complete in roughly the time one would take." (Practical patterns for using subagents) — 3 parallel subagents ~ time of 1
- [model-selection] "each can have different permissions" (Custom subagents)
- [model-selection] "its own model" (Custom subagents)
- [cost] "Subagents carry overhead. Each one spins up its own context, consumes tokens, and adds a layer of indirection between the developer and the work." (When shouldn't you use subagents?)
- [subagents-orchestration] "Subagents are self-contained agents that operate with their own context windows. When Claude spawns a subagent, that assistant works independently to read files, explore code, or make changes." (What is a subagent?)
- [steering-mechanisms] "CLAUDE.md files define the rules for when Claude should reach for them. If every code review should go through a read-only subagent, or every architecture question should trigger a research pass first, CLAUDE.md is where that policy lives." (CLAUDE.md instructions)
- [steering-mechanisms] "Define a skill once in .claude/skills/, then invoke it with /skill-name or let Claude load it automatically when a task matches its description." (Skills)
- [steering-mechanisms] "Hooks are user-defined shell commands, HTTP endpoints, or LLM prompts that execute automatically at specific points in Claude Code's lifecycle." (Hooks (referenced within steering discussion))
- [other] "Start conversational, automate later" (Closing section heading)

### Maximizing the value of your Claude Code sessions

- Source: <https://claude.com/blog/maximizing-the-value-of-your-claude-code-sessions> — dated 2026-08-14 (from the category listing page, captured 2026-09-03); fetch partial; 22 claims extracted, 10 shown
- Thesis: The post is a token-economics guide for Claude Code sessions: it explains what drives token price and count (model choice, prompt caching, context contents, turn count, subagents) and gives concrete session hygiene habits (/clear, /compact, /rewind, /context, @-mentions, quiet flags, CLAUDE.md trimming) to keep cost down, deferring model/effort selection criteria to a separate linked post.

Premises: **P1 qualifies** — "use a larger model when the problem is genuinely hard or ambiguous, and a smaller one when the work is routine"; **P4 qualifies** — "Being efficient with tokens doesn't mean using fewer of them overall. It means making sure the ones you do use go towards the thing you actually asked for."

Novel for the plugin:

- Prompt caching is invalidated by mid-conversation /model or /effort switches, and the CLI enforces a confirmation prompt on both — a concrete, checkable steering mechanism the plugin's tiering guidance should account for when a workflow re-tiers a running agent mid-task (section: Prompt caching / TL;DR).
- Default subagent behavior when no model is declared is explicit and different from the plugin's stance: 'Otherwise it runs on whatever your main session is running on' — i.e. silent inheritance is the documented default, which is exactly what P1's rule (and the delegation-tiering PreToolUse gate) exists to override; worth citing as the baseline behavior being deliberately overridden (section: Subagents).
- The post frames subagent cost as re-read overhead, not model tier: 'a subagent sometimes has to re-read things the main session already had, and it's paying for its own turns while it does' — a distinct cost driver (context reconstruction) orthogonal to model-tier choice that a tiering plugin doesn't address (section: Subagents).
- /context command surfaces what's loaded (CLAUDE.md, MCP tool definitions, presumably skills) for inspection — a diagnostic the plugin author could point users to when auditing why a session or delegated call is expensive (section: TL;DR).
- The post explicitly punts model/effort selection criteria to a separate, linked post ('Choosing a Claude model and effort level in Claude Code') rather than covering tiering logic itself — meaning this post is a weak primary source for P1-P4 and the actually relevant tiering guidance likely lives in that other post, not this one (section: Model).

Quotes:

- [context-engineering] "`/compact` before you take a break from your keyboard. The prompt cache expires after an hour, and summarizing a conversation is much cheaper while it's still cached." (TL;DR) — 1 hour cache expiry
- [other] "Of everything above, four things are worth keeping an eye on, roughly in order of how much they cost:" (Where to look first) — four things
- [model-selection] "A bigger model does more work on both input and output tokens." (Model)
- [model-selection] "Which model is worth it for which kind of work is a topic on its own, and we covered it in _Choosing a Claude model and effort level in Claude Code_." (Model)
- [model-selection] "For this post, all you need to know is that everything else we're about to cover gets multiplied by the model's price: use a larger model when the problem is genuinely hard or ambiguous, and a smaller one when the work is routine." (Model)
- [model-selection] "if there's a noisy job you hand off over and over, give it a subagent definition of its own with model: haiku (or sonnet). Otherwise it runs on whatever your main session is running on." (Subagents)
- [effort] "the effort level is part of what the cache is keyed on too, so it's the same story." (Prompt caching (via TL;DR/effort discussion))
- [effort] "It's why both `/model` and `/effort` ask you to confirm when you switch in the middle of a conversation." (Prompt caching (via TL;DR/effort discussion))
- [effort] "Set your model and effort level before you start. Changing either one mid-conversation can bust your prompt cache, which can increase token cost." (TL;DR)
- [cost] "It's the same fix, but you spent a different number of tokens on it." (cost/pricing discussion)

### Auto Mode is Now the Default in Claude Code for Pro, Max, and Team Plans

- Source: <https://claude.com/blog/auto-mode-default-in-claude-code> — dated 2026-08-07 (from the category listing page, captured 2026-09-03); fetch partial; 14 claims extracted, 10 shown
- Thesis: The post announces that Claude Code's auto mode (a classifier-based permission system that approves or blocks tool calls instead of prompting for manual approval) becomes the default for Pro, Max, and Team plans, and argues — via internal studies, red-teaming, and customer testimonials — that this classifier catches more dangerous commands than habitual human approval does.

Premises: silent on all six.

Novel for the plugin:

- The post is not about model/effort tiering for delegated agents at all — it is about Claude Code's permission classifier ('auto mode') that approves or denies tool calls automatically instead of prompting the user. None of the six premises (model tier, orchestrator supervision, top-tier categories, cost-per-task, PreToolUse deny hooks, cheap-worker+verification-gate fan-outs) are addressed one way or the other.
- Section 'Making auto mode even safer': a deterministic rule/classifier layer (hard denies for data exfiltration, git-push destination checks, git-status checks before destructive git actions, prompt-injection screening) sits structurally adjacent to P5's proposed PreToolUse deny hook — it is evidence that Anthropic itself ships deterministic denial rules alongside model judgment for safety, which a plugin author could cite as precedent for a deterministic gate pattern, even though it targets destructive/exfiltration actions rather than un-tiered delegations.
- Section 'Comparing manual review to auto mode': the 97%-approval-habituation finding is a reusable argument for why prose-only rules (asking a human, or an agent, to remember a policy every time) tend to degrade into rubber-stamping — relevant analogy for why a plugin might prefer a deterministic gate (P5) over rule/skill prose alone, though the post never draws this connection to delegated-agent model tiering itself.
- Getting started: `defaultMode` and `disableAutoMode` are named Claude Code managed-settings keys — a concrete example of a steering mechanism (org-wide config) alongside CLAUDE.md/rules/skills/hooks/plugins that a plugin author might want to know exists.
- The article names three current model identifiers together — 'Claude Fable 5, Opus 5, or Sonnet 5' — as the models auto mode was tested against, confirming these as the live model family names at time of publication, which is incidentally useful for any tiering ladder referencing current model names.

Quotes:

- [model-selection] "none of the 720 attack attempts succeeded against Claude Fable 5, Opus 5, or Sonnet 5 running auto mode" (Model/Agent references (prompt injection testing)) — 720 attack attempts, 0 successes, across three named models: Claude Fable 5, Opus 5, Sonnet 5
- [cost] "auto mode users ship about 25% more PRs" (Auto mode in production) — ~25% more PRs among Teams & Enterprise adopters (per WebFetch summary; not independently confirmed verbatim in-article wording)
- [subagents-orchestration] "I kicked off an agent at 10 p.m. and it kept running until 5 a.m.—and it gave me three PRs" (Auto mode in production (Nuro testimonial)) — 7-hour unattended agent run producing 3 PRs
- [evals-verification] "In a controlled experiment with 1,053 paid professional testers, human review caught just 13.6% of dangerous commands, while auto mode caught 89%." (Auto mode outperforms manual permissions on safety) — 1,053 testers; human review 13.6% caught; auto mode 89% caught
- [evals-verification] "Among the flagged sessions, those that went through manual approval contained serious unintended harm more than twice as often as auto mode sessions." (Auto mode prevents more harmful actions) — manually-approved sessions: 6.3% harmful vs auto mode: 2.4% harmful (per WebFetch summary of this claim)
- [evals-verification] "After hardening, Apollo re-tested on a separate held-out attack set...Auto mode caught about half of the attacks it previously missed." (Adversarial red-teaming made auto mode stronger) — caught about half of previously-missed attacks (ellipsis in source as returned by fetch tool)
- [evals-verification] "With auto mode enabled, no attack in an independent evaluation was successful against any of our models." (Auto mode reduces prompt injection risk) — 0 of 720 attack attempts succeeded (per second fetch: "none of the 720 attack attempts succeeded against Claude Fable 5, Opus 5, or Sonnet 5 running auto mode")
- [steering-mechanisms] "To switch modes, press Shift+Tab in the CLI or use the mode dropdown on the desktop app. Admins can pin an org-wide default with `defaultMode` in managed settings, or turn auto mode off entirely with `disableAutoMode`." (Getting started) — two config keys named: defaultMode and disableAutoMode
- [other] "Data suggests that manual review can become habitual: users approve 97% of permission prompts in Claude Code." (Comparing manual review to auto mode) — 97% of permission prompts approved
- [other] "A destructive mass operation: In a long-running session, Claude attempted a mass process kill across roughly two thousand pods and queued deletions that would have torn down hundreds of GPUs of in-flight training jobs. Auto mode flagged the destructive commands before execution." (Three incidents auto mode prevented inside Anthropic) — roughly 2,000 pods; hundreds of GPUs of training jobs at risk

### The AI-Native SDLC Playbook

- Source: <https://claude.com/blog/the-ai-native-sdlc-playbook> — dated 2026-08-21 (from the category listing page, captured 2026-09-03); fetch partial; 25 claims extracted, 10 shown
- Thesis: The traditional sequential SDLC assumes code is the bottleneck; the AI-native version holds that implementation now runs faster than planning, review, and deployment, so orchestration moves upstream and governance (via version-controlled artifacts, CLAUDE.md, skills, hooks, and evals) must accelerate to match.

Premises: **P5 qualifies** — "**Hooks**: Deterministic scripts that allow, ask, or block specific actions. Used for approval gates and guardrails like preventing edits to frozen packages."

Novel for the plugin:

- Six-stage SDLC framing (Plan/Design/Build/Test/Deploy/Maintain) each producing a version-controlled artifact (intent.md, spec.md, plan.md, CLAUDE.md, evals, PR review findings) that feeds the next stage — a structural model a delegation-tiering plugin could hook stage-specific tier defaults to. Section: 'Six Stages with Artifacts'.
- Explicit taxonomy distinguishing parallel sessions (separate git worktrees, same engineer coordinating multiple concurrent streams) from subagents (scoped helper inside one session, own context window and tool limits) — two different delegation shapes with different resource/isolation tradeoffs, neither tied to model choice in the source. Section: 'Stage 3 — Build: Parallel sessions and subagents'.
- Subagents are described as defined in markdown files under `.claude/agents/` — a concrete steering-mechanism location a plugin's model-tiering gate would need to read/patch. Section: 'Stage 3 — Build: Parallel sessions and subagents'.
- Eval suite is triggered not just on a schedule but specifically 'on any change to CLAUDE.md, skills or hooks' — i.e., steering-file edits are themselves a CI trigger, which is a pattern a delegation-tiering plugin's own rule/skill changes could adopt (re-run evals when the tiering rule file changes). Section: 'Stage 4 — Test: Continuous evals in CI'.
- Named anti-pattern/practice: every production incident is converted into a permanent eval, authored by the team that owned the incident, so the suite grows from real failures rather than being authored speculatively upfront. Section: 'Stage 4 — Test: Continuous evals in CI'.
- Audit trail is claimed to be the git history itself (commits + PR metadata) rather than a separate logging system — relevant if the tiering plugin wants to justify not building bespoke audit logging. Section: 'Governance Through Artifacts'.
- A named set of leading/lagging indicators for measuring AI-native SDLC adoption (time to first artifact, first-pass CI success, concurrent sessions per engineer / defects escaping to production, repeat incidents, rework cycles, requirement survival rate) — none of these are model- or cost-specific, but could inform what a tiering plugin's own success metrics should look like. Section: 'Measurement'.
- The article never mentions model names (Haiku/Sonnet/Opus), effort levels, an 'advisor' pattern, per-task cost, or the word 'orchestrator' — confirmed absent via a targeted second and third fetch pass, so the six premises get no direct support or contradiction from this source; it operates one layer of abstraction above model/cost tiering (process and artifact governance, not model economics).

Quotes:

- [other] "Leading indicators: time to first artifact, first-pass CI success, concurrent sessions per engineer. Lagging indicators: defects escaping to production, repeat incidents, rework cycles, survival rate of accepted requirements." (Measurement) — multiple named leading/lagging indicators, no numeric values given
- [subagents-orchestration] "**Subagents**: Scoped helpers within a single session for recurring micro-tasks (verification, research) with their own context window." (Steering Mechanisms)
- [subagents-orchestration] "**Parallel Sessions**: Independent Claude Code instances in separate git worktrees, coordinated by one engineer, enabling multiple concurrent streams." (Steering Mechanisms)
- [subagents-orchestration] ""A parallel session is another full Claude Code instance, working a separate task in its own git worktree."" (Stage 3 — Build: Parallel sessions and subagents)
- [subagents-orchestration] ""A subagent runs inside a single session as a scoped helper with its own context window and tool limits."" (Stage 3 — Build: Parallel sessions and subagents)
- [subagents-orchestration] ""Parallel sessions raise the number of tasks an engineer can have in flight, while subagents keep each session focused on its own task."" (Stage 3 — Build: Parallel sessions and subagents)
- [subagents-orchestration] ""The engineer's job shifts to orchestrating, and eventually, to building and monitoring loops."" (Stage 3 — Build: Parallel sessions and subagents)
- [evals-verification] ""A session checks its own work and fixes its own mistakes before an engineer sees them."" (Stage 3 — Build)
- [evals-verification] ""Run the tests, run the build, take the screenshot."" (Stage 3 — Build)
- [evals-verification] ""Evals are the AI-native equivalent of stage-gate QA."" (Stage 4 — Test: Continuous evals in CI)

### How Warp builds self-improving agents on Claude

- Source: <https://claude.com/blog/how-warp-builds-self-improving-agents-on-claude> — dated 2026-08-26 (from the category listing page, captured 2026-09-03); fetch partial; 9 claims extracted, 9 shown
- Thesis: The post describes Warp's self-improvement loop for coding agents built on Claude: file-based "skills" (an inner/base skill holding task instructions, and an outer/improver skill that runs periodically as an observer to rewrite the base skill from human feedback), illustrated by Warp's GitHub issue-triage agent.

Premises: silent on all six.

Novel for the plugin:

- Two-fetch verification (initial full-article fetch, then a targeted re-fetch scanning explicitly for haiku/sonnet/opus/subagents/orchestrator/advisor/cost/evals/CLAUDE.md/hooks/plugins) both returned negative — the post does not discuss model tiering, effort levels, subagent orchestration, an advisor tool, cost per task, or evals/verification at all. It is scoped narrowly to a skills-based self-improvement loop (inner/base skill vs. outer/improver skill) for a single agent, illustrated by a GitHub issue-triage use case. Named platform detail worth noting for a plugin author's own context: Warp runs on an 'internal agent orchestration platform (Oz)' layered on Claude Platform — orchestration here means Warp's own scheduling/orchestration system for running the improver skill on a cadence, not a Claude Code subagent-tiering pattern.

Quotes:

- [steering-mechanisms] "The central technique is a self-improvement loop using **skills**, which are file based encodings of knowledge that keep instructions out of the raw prompt." (Agent self-improvement loops built on skills)
- [steering-mechanisms] "The **inner/base skill** holds the functional domain knowledge and instructions. For example, when a PR is opened, Warp's code agent executes using that base skill and context to produce its review." (Agent self-improvement loops built on skills)
- [steering-mechanisms] "The **outer/improver skill** functions as an observer agent that runs on a schedule rather than per-task." (Agent self-improvement loops built on skills)
- [steering-mechanisms] "Because skills are plain files, agents are extremely good at updating them." (Agent self-improvement loops built on skills)
- [steering-mechanisms] "Keep skills small and use progressive disclosure. A good skill file isn't large; it references resource files and scripts rather than dumping everything into context at once." (How to write self-improving skills for agents)
- [steering-mechanisms] "Put extra effort into the improver skill." (How to write self-improving skills for agents)
- [steering-mechanisms] "The agent authenticated to GitHub, ran a Python script bundled with the skill to pull recent issues carrying feedback." (The loop in action: Warp's issue triage agent)
- [steering-mechanisms] "Because the whole update is a skill file, it moves through the normal code-review workflow." (The loop in action: Warp's issue triage agent)
- [other] "Stack: Rust, Golang, GitHub Actions, internal agent orchestration platform (Oz), Claude Platform" (The quick pitch)

### Skills explained: How Skills compares to prompts, Projects, MCP, and subagents

- Source: <https://claude.com/blog/skills-explained> — dated 2026-03-05 (from the category listing page, captured 2026-09-03); fetch partial; 13 claims extracted, 10 shown
- Thesis: The post explains five "agentic building blocks" — Skills, prompts, Projects, subagents, and MCP — and how they differ and combine; subagents are framed as specialized, independently-scoped assistants used for task specialization, context management, parallel processing, and tool restriction, with Skills as portable expertise any of them (including subagents) can load.

Premises: **P6 qualifies** — "The market-researcher gathers industry data while the technical-analyst reviews technical implementations"

Novel for the plugin:

- Named anti-pattern/best-practice framing not in the premises: tool-permission scoping as a first-class reason to spawn a subagent — 'Tool restriction: Limit specific subagents to safe operations (e.g., read-only access)' (When to use subagents) — this is an orthogonal lever from model tier (capability scoping vs. cost/capability tier) that a tiering plugin's schema might want to capture alongside `model`.
- The post frames 'Context management' (keeping the main conversation's context window clean by offloading work to a subagent) as a distinct justification for delegation, independent of cost or capability — a dimension the six premises don't name (they're framed entirely in terms of model tier/cost, not context-window hygiene).
- The concrete code-reviewer example ties a *specific* least-privilege tool set (Read, Grep, Glob; no Write/Edit) to a specific task type, which is a template a plugin could mirror for its own tier-to-tool-scope defaults, though the post never connects this to model choice at all — tool scoping and model tier are presented as unrelated axes here.
- The post is entirely silent on model selection, effort levels, the 'advisor' tool/strategy, cost per task, and evals/verification — none of these terms occur in the article (confirmed via targeted searches for 'advisor', 'effort', 'cost', 'eval', 'verification', 'CLAUDE.md', 'hook'), so it cannot be cited as support (or contradiction) for any of P1-P5's cost/tiering/verification claims; the only content adjacent to P6 is the two-subagent parallel research example, which shows fan-out shape but says nothing about tiering the workers or gating with a top-tier verifier.

Quotes:

- [subagents-orchestration] "Subagents are specialized AI assistants with their own context windows, custom system prompts, and specific tool permissions." (What are subagents?)
- [subagents-orchestration] "Each subagent operates with its own configuration—you define what it does, how it approaches problems, and which tools it can access." (What are subagents?)
- [subagents-orchestration] "Claude automatically delegates tasks to appropriate subagents based on their descriptions, or you can explicitly request a specific subagent." (What are subagents?)
- [subagents-orchestration] "Task specialization: Code review, test generation, security audits" (When to use subagents)
- [subagents-orchestration] "Context management: Keep the main conversation focused while offloading specialized work" (When to use subagents)
- [subagents-orchestration] "Parallel processing: Multiple subagents can work on different aspects simultaneously" (When to use subagents)
- [subagents-orchestration] "Tool restriction: Limit specific subagents to safe operations (e.g., read-only access)" (When to use subagents)
- [subagents-orchestration] "Create a code-reviewer subagent with access to Read, Grep, and Glob tools but not Write or Edit." (When to use subagents (code-reviewer example))
- [subagents-orchestration] "The market-researcher gathers industry data while the technical-analyst reviews technical implementations" (Example agentic workflow: research agent)
- [subagents-orchestration] "You need complete, self-contained agents designed for specific purposes that handle workflows independently." (Skills vs. subagents: when to use what)

### Agent Harness Design: 3 Patterns for Harnessing Claude's Intelligence

- Source: <https://claude.com/blog/harnessing-claudes-intelligence> — dated 2026-04-02 (from the category listing page, captured 2026-09-03); fetch ok; 18 claims extracted, 10 shown
- Thesis: As Claude's underlying capability improves, agent-harness scaffolding that once compensated for what the model couldn't do becomes dead weight; the post argues for building on tools Claude already knows well, periodically testing which harness assumptions can be removed, and setting only the boundaries (caching, security, UX, observability) that still earn their place.

Premises: **P1 qualifies** — "If you need a cheaper model, use a subagent."

Novel for the plugin:

- Section 3 caching table: switching models mid-session breaks prompt caching entirely (caches are model-specific) — the post's recommended workaround for needing a cheaper tier is to spin off a subagent rather than change the orchestrator's model, a direct mechanical constraint a tiering plugin should account for.
- Section 3, 'Use declarative tools...': Claude Code's auto-mode security pattern — a second Claude instance reads and judges the safety of a bash command string as a lighter-weight alternative to dedicated typed tools — is a steering/gating mechanism not mentioned in the six premises (distinct from a PreToolUse hook).
- Section 2, 'Let Claude orchestrate its own actions': giving Claude a code-execution/bash tool so it filters tool outputs itself before they hit context (rather than the harness pre-filtering) is framed as moving an orchestration decision from harness to model — relevant background for how much orchestration logic a tiering plugin should hard-code versus delegate.
- Section 2, 'Let Claude manage its own context': skills' progressive disclosure (YAML frontmatter pre-loaded, full body read on demand) and context editing (stale tool-result/thinking-block removal) are named as the mechanisms that keep per-task context small — relevant to how a plugin's own skill should be structured to avoid bloating the orchestrator's context.
- Section 3 caching table in full: 'Static first, dynamic last' (stable content — system prompt, tools — ordered first) and 'Messages for updates' (append a <\system-reminder> in messages rather than editing the prompt) are concrete harness-design rules with no counterpart in the six premises.
- The overall thesis — harness assumptions and scaffolding should be periodically re-tested and removed as the model improves ('what can I stop doing?') — is a standing tension with a tiering plugin's premise that explicit low-tier assignment is durably correct; the post's repeated context-anxiety/Pokémon examples show that hard-coded compensations for model weakness can become 'dead weight' as models improve, an argument a tiering-plugin author should address (e.g. by making tier assignments reviewable/revisable, not fixed).

Quotes:

- [cost] "Since cached tokens are 10% the cost of base input tokens, here are a few principles in the agent harness help maximize cache hits:" (3. Set boundaries carefully — Design context to maximize cache hits) — Cached tokens cost 10% of base input tokens.
- [subagents-orchestration] "With subagents, Claude is getting better at knowing when to fork into a fresh context window to isolate work on a specific task. With Opus 4.6, the ability to spawn subagents improved results on BrowseComp by 2.8% over the best single-agent runs." (2. Strip your agent harness down — Let Claude manage its own context) — Subagent use with Opus 4.6 improved BrowseComp results by 2.8% over the best single-agent runs.
- [subagents-orchestration] "The orchestration decision moves from the harness to the model. Since code is a general way for Claude to orchestrate actions, a strong coding model is also a strong general agent. Claude shows strong performance on non-coding evals using this pattern: on BrowseComp, a benchmark that tests the ability of agents to browse the web, giving Opus 4.6 the ability to filter its own tool outputs brought accuracy from 45.3% to 61.6%." (2. Strip your agent harness down — Let Claude orchestrate its own actions) — Opus 4.6 with self-filtered tool outputs: BrowseComp accuracy rose from 45.3% to 61.6%.
- [evals-verification] "In late 2024, Claude 3.5 Sonnet reached 49% on SWE-bench Verified—then state of the art—with only a bash tool and a text editor tool for viewing, creating, and editing files." (1. Lean on the model, not the harness) — Claude 3.5 Sonnet: 49% on SWE-bench Verified with only a bash tool and a text editor tool.
- [context-engineering] "For example, compaction lets Claude summarize its past context in order to maintain continuity on long-horizon tasks. Over several releases, Claude has gotten better at choosing what to remember. On BrowseComp, for example, an agentic search task, Sonnet 4.5 stayed flat at 43% regardless of the compaction budget we gave it. Yet Opus 4.5 scaled to 68% and Opus 4.6 reached 84% with the same setup." (2. Strip your agent harness down — Let Claude persist its own context) — BrowseComp with compaction: Sonnet 4.5 flat at 43% regardless of compaction budget; Opus 4.5 scaled to 68%; Opus 4.6 reached 84%, same setup.
- [context-engineering] "A memory folder is another approach, allowing Claude to write context to files and later read them as needed. We've seen Claude use this for agentic search. On BrowseComp-Plus, giving Sonnet 4.5 a memory folder lifted accuracy from 60.4% to 67.2%." (2. Strip your agent harness down — Let Claude persist its own context) — Sonnet 4.5 with a memory folder on BrowseComp-Plus: accuracy rose from 60.4% to 67.2%.
- [context-engineering] "Sonnet 3.5 treated memory as a transcript, writing down what non-player characters (NPCs) said rather than what mattered. After 14,000 steps it had 31 files—including two near-duplicates about caterpillar Pokémon—and was still in the second town." (2. Strip your agent harness down — Let Claude persist its own context) — Sonnet 3.5 at 14,000 steps: 31 memory files, still in second town.
- [context-engineering] "Later models wrote tactical notes. Opus 4.6, at the same step count, had 10 files organized into directories, three gym badges, and a learnings file distilled from its own failures." (2. Strip your agent harness down — Let Claude persist its own context) — Opus 4.6 at same 14,000 steps: 10 organized files, three gym badges, a distilled learnings file.
- [model-selection] "Don't change models | Avoid switching models during a session. Caches are model-specific; switching breaks them. If you need a cheaper model, use a subagent." (3. Set boundaries carefully — Design context to maximize cache hits (table))
- [subagents-orchestration] "We've seen Claude compose these general tools into patterns that solve different problems. For instance, Agent Skills, programmatic tool calling, and the memory tool are all built from the bash and text editor tools." (1. Lean on the model, not the harness)

### The Anatomy of Effective Commerce Agents

- Source: <https://claude.com/blog/the-anatomy-of-effective-commerce-agents> — dated 2026-09-02 (from the category listing page, captured 2026-09-03); fetch partial; 24 claims extracted, 10 shown
- Thesis: The post is a three-part guide to building commerce agents: architect with a single agent plus loaded skills rather than per-domain subagents (reserving subagents for narrow, self-contained, dedicated-context tasks); choose model and effort together by running eval sweeps and judging cost per completed task rather than per token, with a starting heuristic of Opus for analysis-heavy merchant agents and Sonnet for latency-sensitive consumer agents; and validate and operate the system with stateless snapshot evals (paired positive/negative cases, 50-100 per flow), staged/human-approved writes, and heavy prompt-caching for cost control.

Premises: **P1 qualifies** — "Run your entire eval suite across every model and effort level you'd consider."; **P3 contradicts** — "We recommend starting at Opus for merchant agents, whose tasks are analysis-heavy, and Sonnet for consumer agents, where latency weighs more."; **P4 supports** — "Measure cost per completed task rather than per model call, since a cheaper model that needs more turns, or fails more often, is not cheaper."; **P6 qualifies** — "The tempting fix is to break the system into many subagents, one per business unit. As discussed in Part 1, we recommend against it for quality reasons."

Novel for the plugin:

- Distinguishes 'hand-off' (transfers conversation ownership to a domain agent, which becomes the user's counterpart) from 'delegation' (orchestrator retains control, bouncing a subagent in and out within one turn) — Part 1: Skills, not subagents. This is a sharper taxonomy than the premises' single 'delegated agent' bucket and would let the plugin distinguish tiering rules for each mode.
- Names 'skills' loaded into the main agent's context as the alternative to subagents for avoiding the 'handoff tax' (state loss, added latency/token cost) — Part 1. Directly relevant to a Claude Code plugin since Claude Code Skills are the same mechanism; the post's argument is that skills should often replace subagent fan-out entirely, not just receive lower-tier models.
- Explicitly reports resisting organizational pressure to shard into one-subagent-per-business-unit even 'when shipping with a large organization,' on quality grounds — Part 3: Shipping with a large organization. Useful counter-evidence for a plugin that assumes fan-out/subagent decomposition is generally desirable.
- Eval methodology detail: evaluate stateless snapshots (system prompt + tools + messages array) rather than full simulated conversations, because simulated-user evals (model-plays-user, judge grades) are 'a poor tool for measurement' — Part 3: Evals. This is a concrete verification technique a delegation-tiering plugin's own eval/canary mechanism could borrow, distinct from the premises' 'top-tier verification gate' framing.
- Rule of requiring a negative counterpart for every positive eval case ('should refuse' for every 'should serve,' etc.), calling missing negatives 'the most common gap' — Part 3: Evals. A concrete, checkable heuristic the plugin's own test/canary skill could adopt.
- Quantified prompt-caching economics (cached reads at 1/10 cost, ~1.25x write premium, 90-99% hit rates in the best deployments) — Part 2: Prompt caching. Not covered by any premise; relevant to the plugin's cost-per-task framing (P4) as a second cost lever independent of model tier.
- Notes that a more capable/expensive model configuration can win on tail latency (p90/p99) despite slower per-token generation, because of better planning — Part 2: Choosing the model. Complicates any premise assuming lower tier is strictly cheaper/faster; worth flagging as an exception case for the plugin's tiering logic.
- The word 'advisor' does not appear anywhere in the article across three targeted searches — the premise's 'advisor tool or advisor strategy' topic has no corresponding content in this source at all, so it cannot be used as supporting or disconfirming evidence either way.
- The article contains no discussion of Claude Code, CLAUDE.md, hooks, PreToolUse gates, plugins, or any Claude Code-specific steering mechanism (confirmed by targeted search) — it is a general commerce-agent architecture guide, not a Claude Code operational guide, so P5 cannot be assessed from this source at all.

Quotes:

- [model-selection] "We recommend starting at Opus for merchant agents, whose tasks are analysis-heavy, and Sonnet for consumer agents, where latency weighs more." (Part 2: Making it fast and affordable > Choosing the model and its configuration) — Opus for merchant agents, Sonnet for consumer agents
- [effort] "A more intelligent configuration sometimes wins on latency (most commonly on p90 and p99) despite slower tokens." (Part 2: Making it fast and affordable > Choosing the model and its configuration) — p90 and p99 latency
- [cost] "Cached input token reads cost a tenth of fresh ones, and while cache-writes carry a premium of roughly 1.25x, a cached prefix pays for itself on its second use." (Part 2: Making it fast and affordable > Prompt caching) — cached reads cost 1/10 of fresh tokens; cache-writes ~1.25x premium
- [cost] "The best commerce deployments we've seen run at 90–99% cache hit rates." (Part 2: Making it fast and affordable > Prompt caching) — 90-99% cache hit rate
- [evals-verification] "Real failures make the best evals, and 50-100 eval cases per user flow is a good starting point." (Part 3: Running it in production > Evals) — 50-100 eval cases per user flow
- [model-selection] "Sometimes Opus 5's lift on cart-driving tasks justifies the cost difference over Sonnet, and sometimes it doesn't." (Part 2: Making it fast and affordable > Choosing the model and its configuration)
- [model-selection] "Run your entire eval suite across every model and effort level you'd consider." (Part 2: Making it fast and affordable > Choosing the model and its configuration)
- [effort] "Model size and the effort setting are the same tradeoff – intelligence against latency and cost – and you should choose both by measurement" (Part 2: Making it fast and affordable > Choosing the model and its configuration)
- [cost] "Measure cost per completed task rather than per model call, since a cheaper model that needs more turns, or fails more often, is not cheaper." (Part 2: Making it fast and affordable > Choosing the model and its configuration)
- [subagents-orchestration] "Where subagents do earn their place is when the orchestrator can call them as a tool for a narrow or self-contained task that would benefit from its own dedicated context window." (Part 1: The architecture > Skills, not subagents)

### The advisor strategy

- Source: <https://claude.com/blog/the-advisor-strategy> — dated unknown; fetch partial; 19 claims extracted, 10 shown
- Thesis: Pair a large model (Opus) as an on-demand "advisor" with a cheaper model (Sonnet or Haiku) as the "executor" that runs the task end-to-end and only consults the advisor when it hits a decision it can't reasonably solve — inverting the usual pattern where a large orchestrator decomposes work top-down for smaller workers.

Premises: **P1 qualifies** — "This inverts a common sub-agent pattern, where a larger orchestrator model decomposes work and delegates to smaller worker models."; **P2 contradicts** — "When the executor hits a decision it can't reasonably solve, it consults Opus for guidance as the advisor."; **P4 supports** — "Frontier-level reasoning applies only when the executor needs it, and the rest of the run stays at executor-level cost."

Novel for the plugin:

- Section 'Build cost-effective agents with the advisor strategy': a named alternative delegation shape — 'advisor' pattern, not 'orchestrator/worker' — where the CHEAP model stays in control and calls UP to the expensive model on demand, rather than the expensive model calling down. The post frames this as an explicit inversion of the top-down orchestrator pattern the plugin's premises assume; worth deciding whether the plugin should treat advisor-style escalation as a distinct tier pattern rather than only pre-assigned per-agent tiers.
- Section 'The advisor tool': this is a first-class Anthropic API tool (Messages API entry, beta header anthropic-beta: advisor-tool-2026-03-01), not a prompting convention — the executor model itself decides when to invoke the advisor, and advisor/executor tokens are billed and reported separately in the usage block, with a max_uses cap. This is a concrete, product-level mechanism for bounding cost of an escalation-style delegation that the six premises (framed around Claude Code Agent/Workflow calls) don't address at all.
- Section 'The advisor tool' (per WebFetch's rendering): the advisor model 'never calls tools or produces user-facing output, and only provides guidance' — a hard architectural constraint (advisor is read/reason-only, not an actor) that differs from Claude Code subagents, which do act (call tools, write files). Not independently verified verbatim; flagged as reported by the fetch tool's summary rather than confirmed against raw source text.
- Benchmark footnotes report combined model+effort configurations per task type (e.g., high effort with thinking for SWE-bench, medium effort without thinking for BrowseComp/Terminal-Bench) rather than a single fixed effort policy — suggests effort is tuned per benchmark/task type, not treated as a universal secondary dial as P4 assumes, though the post doesn't generalize this into a stated rule.
- No mention anywhere in the post of Claude Code, CLAUDE.md, subagents (the Claude Code feature), skills, hooks, or plugins — this post is entirely about the Anthropic Messages API advisor tool, not Claude Code's internal steering/orchestration mechanisms. The plugin author should not treat this post as evidence about Claude Code's Agent/Workflow tooling specifically.

Quotes:

- [effort] "Sonnet 4.6 runs used medium effort on BrowseComp and Terminal-Bench 2.0, and high effort with thinking on SWE-bench Multilingual." (Benchmark methodology footnotes) — effort appears only as a benchmark-configuration detail (medium/high) alongside model choice, per WebFetch's rendering — not presented in the post as a generalized independent tuning strategy
- [cost] "Sonnet 4.6 + Opus advisor reduced cost per agentic task by 11.9% versus Sonnet 4.6 solo on SWE-bench Multilingual." (Build cost-effective agents with the advisor strategy (benchmark footnote)) — 11.9% lower cost per agentic task, Sonnet+Opus-advisor vs Sonnet solo (as rendered by WebFetch; exact source sentence not independently confirmed)
- [cost] "Haiku 4.5 + Opus advisor scored 41.2% on BrowseComp, more than double Haiku 4.5's solo score of 19.7%, while costing 85% less per task than Sonnet 4.6 solo." (The advisor tool (BrowseComp footnote)) — Haiku+advisor 41.2% vs Haiku solo 19.7% on BrowseComp; Haiku+advisor trails Sonnet solo by 29% in score but costs 85% less per task (as rendered by WebFetch, not independently confirmed against raw HTML)
- [cost] "The advisor tool enables Haiku 4.5 to dynamically scale intelligence by consulting Opus 4.6 as complexity demands, matching frontier-model quality at 5× lower cost." (Customer testimonials) — 5x lower cost claimed by Eve Legal (Anuraj Pandey) for Haiku 4.5 + Opus 4.6 advisor vs frontier-model-quality baseline
- [evals-verification] "SWE-bench Multilingual: Sonnet 4.6 + Opus advisor scored 2.7 percentage points higher than Sonnet 4.6 solo, averaged over five trials of 300 problems across nine languages." (Build cost-effective agents with the advisor strategy (benchmark footnote)) — 2.7 percentage point improvement on SWE-bench Multilingual for Sonnet+Opus-advisor vs Sonnet solo (per WebFetch's rendering of the footnote; not independently verified against raw source markup)
- [evals-verification] "Terminal-Bench 2.0 scores were averaged over five attempts per task across 89 tasks, each task run in an isolated pod with 3x resource allocation and 1x timeout." (Benchmark methodology footnotes) — 89 tasks, 5 attempts each, 3x resource/1x timeout allocation (per WebFetch's rendering of the footnote)
- [steering-mechanisms] "Set max_uses to cap advisor calls per request." (The advisor tool) — max_uses parameter caps advisor calls per API request
- [model-selection] "Frontier-level reasoning applies only when the executor needs it, and the rest of the run stays at executor-level cost." (Build cost-effective agents with the advisor strategy)
- [advisor] "Pair Opus as an advisor with Sonnet or Haiku as an executor, and get near Opus-level intelligence in your agents at a fraction of the cost." (Headline)
- [advisor] "Developers who want to better balance intelligence and cost have converged on what we call the advisor strategy: pair Opus as an advisor with Sonnet or Haiku as an executor." (Opening)

### The evolution of agentic surfaces: building with Claude Managed Agents

- Source: <https://claude.com/blog/building-with-claude-managed-agents> — dated 2026-06-10 (from the category listing page, captured 2026-09-03); fetch ok; 24 claims extracted, 10 shown
- Thesis: Claude Managed Agents decouples the reasoning harness ("brain") from code-execution sandboxes ("hands"), letting Anthropic run agent infrastructure (hosting, sessions, credentials, observability) so teams can focus on context management and domain expertise instead of maintaining bespoke agent harnesses.

Premises: **P6 qualifies** — "Beyond these features, additional capabilities include outcomes that let an agent grade its own work against a rubric, multiagent orchestration, permission policies, and webhooks."

Novel for the plugin:

- "Context anxiety" (When and why to use Claude Managed Agents): a named failure mode where a model rushes/cuts work short near its context limit — Sonnet 4.5 exhibited it, Opus 4.5 did not, and the harness fix (context resets) became overhead once the behavior disappeared on the newer model. Relevant precedent that a mitigation tuned to one model generation can become dead weight, or need re-validation, on the next.
- "Outcomes" (Building for production and scale): a built-in capability letting an agent grade its own work against a rubric — a self-verification primitive distinct from a separate top-tier review gate; an alternative/complementary verification mechanism to P6's cheap-worker-plus-top-tier-verifier pattern.
- Credential/Vault architecture (Building for production and scale): credentials for MCPs/CLIs/GitHub are kept in a separate encrypted vault outside the sandbox, decrypted only on demand via a signed request token — a concrete security-boundary pattern relevant to P3's "security-boundary reads" top-tier category, though framed as infrastructure isolation rather than a model-tiering decision.
- Self-hosted sandboxes and MCP tunnels (Building for production and scale): let teams keep code execution and network egress inside their own VPC while orchestration stays Anthropic-managed — a deployment-boundary distinction (where code runs vs. where reasoning runs) a tiering plugin's threat model may want to track separately from model choice.
- "Dreaming" (Building for production and scale): a scheduled background process that mines persistent session logs to refine agent memory over time — a session-persistence/memory mechanism with no analog in the six premises.
- The /claude-api skill's `managed-agents-onboard` interview flow (Getting started) is Anthropic's own steering mechanism for this SDK — skill-as-onboarding-interview, distinct from CLAUDE.md/rules/hooks, that none of the premises address.
- Latency figures (Building for production and scale): time-to-first-token cut ~60% at p50 and >90% at p95 by skipping container spin-up for tool-free sessions — a concrete cost/latency lever (infrastructure architecture) orthogonal to model-class or effort-level choices that P4 does not cover.

Quotes:

- [cost] "In our testing, that cut the time-to-first-token by roughly 60% in the median case (p50) and by over 90% in the slowest cases (p95)." (Building for production and scale on Managed Agents) — time-to-first-token reduced ~60% at p50, >90% at p95
- [other] "Dozens of tasks run in parallel, and their team has described an early prototype turning roughly twelve hours of work into twenty minutes." (How customers are building on Managed Agents today) — ~12 hours of work compressed to 20 minutes
- [other] "Rakuten used Managed Agents to ship specialist agents across product, sales, marketing, and finance, each live within about a week." (How customers are building on Managed Agents today) — specialist agents live within about a week
- [other] "Sentry paired its Seer debugging agent with a Claude agent that writes the patch and opens the PR, built in weeks instead of months by a single engineer." (How customers are building on Managed Agents today) — built in weeks instead of months, by one engineer
- [model-selection] "An _agent_ is a configuration: a model, a prompt, a set of tools, and the guardrails around them." (When and why to use Claude Managed Agents)
- [model-selection] "When the harness doesn't evolve alongside model intelligence, the agent breaks down." (When and why to use Claude Managed Agents)
- [model-selection] "With Claude Managed Agents, the harness evolves alongside the model, allowing teams to focus on what will differentiate their agents: **context management and domain expertise.**" (When and why to use Claude Managed Agents)
- [model-selection] "Now, when a new model comes out, you update your agent to use it, rerun your evals, and ship the improvement without touching the architecture underneath." (The future of building managed agents)
- [model-selection] "On Claude Sonnet 4.5, an agent would rush to finish as it neared the end of its context, cutting work short rather than using the room it had left—a pattern called "context anxiety."" (When and why to use Claude Managed Agents)
- [model-selection] "On Claude Opus 4.5, the behavior was gone, and the resets we'd added were just overhead." (When and why to use Claude Managed Agents)

### Lessons from Building Claude Code: Prompt Caching is Everything

- Source: <https://claude.com/blog/lessons-from-building-claude-code-prompt-caching-is-everything> — dated 2026-04-30 (from the category listing page, captured 2026-09-03); fetch partial; 8 claims extracted, 8 shown
- Thesis: Prompt caching is the dominant cost/latency lever for a long-running agentic coding product, so the prompt architecture (layout, message-based updates, model consistency, stable tool sets, compaction strategy) must be designed around cache-hit preservation from the start rather than treated as an afterthought.

Premises: **P1 qualifies** — "We do this often with the Claude Code's Explore agents, which use Haiku."; **P2 qualifies** — "you could deploy a subagent that prompts Opus to prepare a 'hand-off' message to another model on the task that it needs to get done."; **P4 qualifies** — "it would actually be more expensive to switch to Haiku than to have Opus answer, because we would need to rebuild the prompt cache for Haiku."

Novel for the plugin:

- Switching models mid-session forces a full cache rebuild and can make a *cheaper* model's call more expensive in total than letting the current (pricier) model finish — a tiering plugin should account for cache-rebuild cost, not just per-token price, when a delegation would downgrade mid-conversation. Section: 'Don't change models mid-session'.
- The recommended way to change models is to spin up a subagent that has the current model prepare a hand-off message for the next model, rather than switching in place — a concrete pattern the plugin's guidance on tier transitions could adopt or cite. Section: 'Don't change models mid-session'.
- Adding or removing tools mid-session invalidates the entire cached prefix; the article's fix is to expose new capabilities as tools that toggle behavior (e.g., EnterPlanMode/ExitPlanMode) or defer-load tool schemas rather than add/remove tool sets — relevant if the tiering plugin's own hook or gate adds/removes tools dynamically during a session. Sections: 'Never add or remove tools mid-session', 'Use tool search to defer instead of remove'.
- Compaction is done via 'cache-safe forking': keeping the system prompt and tool definitions identical while summarizing, so even the summarization call benefits from the cached prefix — a design constraint worth noting for any workflow/orchestration script the plugin recommends for long delegation chains. Section: 'The solution: cache-safe forking'.

Quotes:

- [model-selection] "For example, if you're 100k tokens into a conversation with Opus and want to ask a question that is fairly easy to answer, it would actually be more expensive to switch to Haiku than to have Opus answer, because we would need to rebuild the prompt cache for Haiku." (Don't change models mid-session)
- [model-selection] "We do this often with the Claude Code's Explore agents, which use Haiku." (Don't change models mid-session)
- [cost] "You end up paying the full, uncached input rate for the entire conversation you're sending in" (Compacting without breaking the cache)
- [cost] "the longer the conversation (i.e., the more you need compaction in the first place), the more expensive that one call becomes" (Compacting without breaking the cache)
- [cost] "A high prompt cache hit rate decreases costs and helps us create more generous rate limits" (Lessons learned)
- [cost] "A few percentage points of cache miss rate can dramatically affect cost and latency" (Lessons learned)
- [subagents-orchestration] "If you need to switch models, the best way to do it is with subagents; extending the above example, you could deploy a subagent that prompts Opus to prepare a 'hand-off' message to another model on the task that it needs to get done." (Don't change models mid-session)
- [steering-mechanisms] "CLAUDE.md (cached within a project)" (Lay out your prompt for caching)

### Common workflow patterns for AI agents and when to use them

- Source: <https://claude.com/blog/common-workflow-patterns-for-ai-agents-and-when-to-use-them> — dated 2026-03-05 (from the category listing page, captured 2026-09-03); not independently confirmed against a rendered page); fetch partial; 4 claims extracted, 4 shown
- Thesis: The post argues three workflow patterns — sequential, parallel, and evaluator-optimizer — cover most production agent use cases, and gives guidance for matching a pattern to a problem rather than defaulting to complexity; sections run How workflows and agents work together, Understanding workflows vs. autonomous agents, Agent workflow patterns, Sequential workflows, Parallel workflows, Evaluator-optimizer workflows, Choosing the right workflow pattern, Combining patterns, Evolve your workflows thoughtfully.

Premises: **P4 qualifies** — "Costs more (multiple concurrent API calls) and requires an aggregation strategy / Multiplies token usage and adds iteration time — the post flags cost as a real tradeoff of parallel and evaluator-optimizer patterns but never frames it as cost-per-completed-task versus price-per-token, and never mentions model tier or effort as levers on that cost."

Novel for the plugin:

- Nothing substantive surfaced: this post is a general workflow-pattern taxonomy (sequential / parallel / evaluator-optimizer), not the subagent/orchestration-and-model-selection post the task premises assume. It contains no discussion of model tiers, effort parameters, an advisor pattern, or Claude Code steering mechanisms (CLAUDE.md, rules, skills, hooks, subagents, plugins).
- Caveat on method: WebFetch here runs the page through a small summarizing model and, on a request for large verbatim reproduction, explicitly refused on copyright/fair-use grounds, offering only quotes under ~125 characters. So absence of a topic in these results is evidence the small summarizer model did not find it in three independent passes, not a hand-verified read of the raw HTML — treat 'not mentioned' as fairly reliable given three convergent queries, but not a substitute for a human/full-text read if this claim needs to be load-bearing.

Quotes:

- [cost] "Costs more (multiple concurrent API calls) and requires an aggregation strategy" (Parallel workflows) — no specific dollar or token figure given, only a qualitative cost note
- [cost] "Multiplies token usage and adds iteration time" (Evaluator-optimizer workflows) — no specific number given
- [evals-verification] "Set a baseline with a single agent so you can tell whether the workflow actually helps" (Choosing the right workflow pattern)
- [evals-verification] "assess different quality dimensions, checking for completeness, clarity, and accuracy" (Evaluator-optimizer workflows (as paraphrased by fetch tool, not confirmed verbatim))

### Improving skill-creator: Test, measure, and refine Agent Skills

- Source: <https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills> — dated March 3, 2026; fetch partial; 5 claims extracted, 5 shown
- Thesis: Skill-creator gained an evaluation/benchmarking layer (write evals, run them via parallel multi-agent execution, compare skill versions with blinded comparator agents, track pass rate/time/tokens, and get description-optimization suggestions) so skill authors can verify and refine skills empirically rather than by feel.

Premises: silent on all six.

Novel for the plugin:

- Blinded A/B comparator-agent pattern ("They judge outputs without knowing which is which") is a technique the plugin author could reuse for testing whether a tier-downgrade actually degrades output quality, even though the post never applies it to model tiering — Comparator Agents for A/B Testing section.
- Benchmark mode's per-eval tracking of pass rate + elapsed time + token usage is a ready-made shape for a 'cost per completed task' dashboard the plugin could adopt, though the post frames it purely as a skill-regression check, not a cost-per-tier argument — Benchmark Mode section.
- Running each parallel eval agent 'in a clean context with its own token and timing metrics' is a concrete instance of isolated-subagent-per-unit-of-work, relevant precedent for fan-out design even though the post gives no model-tier guidance for those agents — Multi-agent Support section.

Quotes:

- [cost] "each in a clean context with its own token and timing metrics." (Multi-agent Support)
- [subagents-orchestration] "Skill-creator now spins up independent agents to run evals in parallel with multi-agent support — each in a clean context with its own token and timing metrics." (Multi-agent Support)
- [subagents-orchestration] "Comparator agents for A/B comparisons: two skill versions, or skill vs. no skill. They judge outputs without knowing which is which." (Comparator Agents for A/B Testing)
- [evals-verification] "define some test prompts (plus files if needed), describe what good looks like, and skill-creator tells you whether the skill holds up." (Evaluation Framework)
- [evals-verification] "Benchmark mode runs a standardized assessment using your evals. This tracks eval pass rate, elapsed time, and token usage." (Benchmark Mode (Cost & Performance))

### Loop engineering: Getting started with loops

- Source: <https://claude.com/blog/getting-started-with-loops> — dated June 30, 2026; fetch ok; 20 claims extracted, 10 shown
- Thesis: The post defines loops as agents repeating cycles of work until a stop condition is met, categorizes them (turn-based, goal-based, time-based, proactive) by trigger and stop criteria, and gives practical guidance on managing token usage and code quality within loops.

Premises: **P1 qualifies** — "Your model and effort level choices are among the biggest levers on what a loop costs."; **P4 contradicts** — "Your model and effort level choices are among the biggest levers on what a loop costs."; **P6 qualifies** — "Use a second agent for code reviews: A reviewer with fresh context is less biased and not influenced by the main agent's reasoning."

Novel for the plugin:

- The post frames model/effort choice as one lever alongside four others for managing token usage/cost — 'pilot before a large run' for dynamic workflows spawning hundreds of agents, 'use scripts for deterministic work' instead of reasoning through steps, and matching poll interval to how often the watched thing changes (Managing Token Usage section) — none of which the six premises address.
- It names a concrete usage-inspection mechanism, the `/usage` command, which 'breaks down recent usage by skills, subagents, and MCPs' — a tool for verifying tiering decisions after the fact rather than a rule for making them upfront (Managing Token Usage section).
- It ties the 'fresh context, less biased' rationale for a second review agent specifically to freedom from the main agent's own reasoning trace, not explicitly to that reviewer running a stronger model — a narrower justification for review gates than P6 assumes (Maintaining Code Quality section).
- It introduces a taxonomy orthogonal to model tiering — turn-based, goal-based, time-based, and proactive loops, categorized by trigger and stop criteria rather than by capability needed — that a tiering plugin would need to compose with, since a loop's trigger type doesn't by itself determine which tier its steps deserve.
- Verification is repeatedly pushed into encoded artifacts ('encoding your manual steps as a SKILL.md', 'Encode what good looks like for you and your team with skills') rather than into a top-tier reviewing model — an alternative or complementary verification strategy to P6's 'top-tier gate' framing (Turn-based loops; Maintaining Code Quality).

Quotes:

- [model-selection] "Smaller tasks don't need multiple agents or loops. Some tasks can use cheaper and faster models." (Managing token usage)
- [effort] "Your model and effort level choices are among the biggest levers on what a loop costs." (Getting started (final section) / token usage guidance)
- [cost] "To manage token usage, loops should have clear boundaries: Choose the right primitive and model for the job: Smaller tasks don't need multiple agents or loops. Some tasks can use cheaper and faster models." (Managing Token Usage)
- [cost] "Use scripts for deterministic work: Running a script is cheaper than reasoning through the steps." (Managing Token Usage)
- [subagents-orchestration] "use **auto mode** and **dynamic workflows** (research preview) can be composed into a loop for long-running work" (Proactive loops)
- [subagents-orchestration] "Pilot before a large run: Dynamic workflows can spawn hundreds of agents. Gauge usage on a smaller slice of the work first." (Managing Token Usage)
- [subagents-orchestration] "Review usage: The `/usage` command breaks down recent usage by skills, subagents, and MCPs." (Managing Token Usage)
- [evals-verification] "An evaluator model checks your condition and sends it back to work until the goal is met" (Goal-based loop (/goal))
- [evals-verification] "You can use the built-in `/code-review` **skill** or Code Review for Github. Loops that write code need loops that check it" (Maintaining code quality)
- [evals-verification] "Use a second agent for code reviews: A reviewer with fresh context is less biased and not influenced by the main agent's reasoning." (Maintaining Code Quality)

### Steering Claude Code: when to use CLAUDE.md, skills, hooks, and subagents

- Source: <https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more> — dated June 18, 2026; fetch partial; 8 claims extracted, 8 shown
- Thesis: The post is a reference guide to seven Claude Code steering mechanisms (CLAUDE.md, rules, skills, subagents, hooks, output styles, system-prompt appending) and how they trade context cost against instruction-following authority; it does not cover model tiering, cost management, or verification strategy for delegated agents.

Premises: **P5 qualifies** — "A `PreToolUse` hook can inspect a call and exit with code 2 to block it."

Novel for the plugin:

- Subagent nesting is capped at five levels deep — a concrete architectural constraint for any workflow the plugin's tiering gate must account for (Subagents section).
- Dynamic workflows can orchestrate tens to hundreds of background agents at once — the fan-out scale a tiering gate needs to handle cheaply (Subagents section).
- Only the subagent's final message plus metadata returns to the parent session; this isolation, not cost, is given as the main reason to use a subagent over a skill (Subagents section) — a different rationale than the plugin's cost/tiering framing.
- The post frames 'model' and 'effort' as two separate per-call dials distinct from the seven prose/instruction-delivery methods, implying prose-based steering (CLAUDE.md, rules, skills) cannot itself set them — only an external, deterministic mechanism like a hook can guarantee they're set (The seven methods for delivering instructions).
- Plugins are positioned as the packaging/sharing unit for a coherent bundle of skills, subagents, hooks, and output styles — relevant to how the delegation-tiering plugin itself should be distributed (Getting started with Claude Code customization).
- The post's own organizing axis is 'context cost vs. authority' per mechanism, not cost-per-task or model tier — a different cost dimension than the plugin's premises assume, worth noting as a gap the plugin fills rather than echoes.

Quotes:

- [model-selection] "Two separate dials, which model and effort level you choose, control how capable it is and how hard it works." (The seven methods for delivering instructions) — two dials: model and effort level
- [subagents-orchestration] "Subagents can nest up to five levels deep, and dynamic workflows orchestrate tens to hundreds of background agents." (Subagents) — nesting depth up to 5 levels; dynamic workflows orchestrate tens to hundreds of background agents
- [steering-mechanisms] "A `PreToolUse` hook can inspect a call and exit with code 2 to block it." (Hooks) — exit code 2 blocks the call
- [subagents-orchestration] "The only thing that returns to your main session is the subagent's final message plus metadata." (Subagents)
- [subagents-orchestration] "That isolation is one of the main reasons to reach for a subagent instead of a skill." (Subagents)
- [subagents-orchestration] "Use a subagent when a side task like deep search, a log analysis pass, or a dependency audit would clutter your main conversation." (When to use each method)
- [steering-mechanisms] "Subagents are markdown files in `.claude/agents/` that define isolated assistants for specific side tasks." (Subagents)
- [steering-mechanisms] "You can bundle many of them (skills, subagents, hooks, output styles) as a plugin to share a coherent setup." (Getting started with Claude Code customization)

### Claude Models Explained: Key Takeaways on Model Selection

- Source: <https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case> — dated 2026-07-24 (from the category listing page, captured 2026-09-03); not independently verified against a rendered page); fetch partial; 11 claims extracted, 10 shown
- Thesis: Default to the most intelligent generally-available model and use effort level as the dial for cost/quality, because intelligent models are often cheaper per completed task despite higher per-token price; drop to lower model classes only where evals show high-volume/simple tasks are handled satisfactorily, and use an advisor pattern (cheap worker model + strong model checking its plan/output) to recover most of the top model's quality at a fraction of the cost.

Premises: **P1 qualifies** — "Anthropic advises starting "with the most intelligent generally available model and use effort level to dial in performance and cost.""; **P2 qualifies** — "The advisor strategy allows faster, lower-cost worker models to call more intelligent models to check their plan and evaluate their work, leading to improved performance."; **P4 supports** — "Cost-per-task is often lower for more intelligent models, especially at lower effort levels, even if the price-per-token is higher."; **P6 supports** — "The advisor strategy allows faster, lower-cost worker models to call more intelligent models to check their plan and evaluate their work, leading to improved performance."

Novel for the plugin:

- Concrete advisor-pattern cost/quality figure the plugin's premises don't cite: on SWE-bench Pro, Sonnet 5 + Fable 5 advisor scores within 10% of Fable 5 alone at 63% of Fable-5-for-the-whole-task price (section: 'Combining models' strengths with the advisor strategy') — a specific, citable number for justifying an advisor/verification-gate design.
- The post's default is top-down, not bottom-up: start at the most capable model and dial cost/quality down via effort level, only dropping model class when evaluations show a lower class suffices at volume (sections: 'Our advice: start smart', 'How to choose which Claude model is best for your workload'). This is in tension with P1's bottom-up-by-default framing and worth flagging explicitly to the plugin author rather than silently reconciling.
- A four-question selection framework — task difficulty, latency requirements, access constraints, unit economics — as the article's structured decision procedure (section: 'How to choose which Claude model is best for your workload'), which the six premises don't mirror and could be adapted as a tiering checklist.
- Explicit warning that standard benchmarks show saturation at higher model tiers while real-world capability differences persist, which is why the post pushes custom, production-drawn evals (including tasks current tools fail) as the trustworthy verification signal (section: 'How evals and benchmarks help with model choice') — relevant to how the plugin's evals/verification story should be framed.
- A companion, more specifically relevant post is cross-linked but not itself fetched here: 'Choosing a Claude model and effort level in Claude Code' — this is likely the primary source for Claude-Code-specific steering/orchestration guidance (CLAUDE.md, subagents, etc.) and none of that content was found in the fetched post; the plugin author should fetch that companion post directly rather than assume its content from this summary.

Quotes:

- [advisor] "For example, on SWE-bench Pro Sonnet 5 with a Fable 5 advisor is within 10% of Fable 5's score at 63% of the price of using Fable 5 for the whole task." (Combining models' strengths with the advisor strategy) — On SWE-bench Pro, Sonnet 5 + a Fable 5 advisor scores within 10% of Fable 5 alone, at 63% of the price of running the whole task on Fable 5.
- [model-selection] "Cost-per-task is often lower for more intelligent models, especially at lower effort levels, even if the price-per-token is higher." (Our advice: start smart)
- [model-selection] "What are the unit economics? Higher volumes of production may be more appropriate for lower classes of models, particularly if evaluations show those tasks are completed satisfactorily." (How to choose which Claude model is best for your workload)
- [advisor] "The advisor strategy allows faster, lower-cost worker models to call more intelligent models to check their plan and evaluate their work, leading to improved performance." (Combining models' strengths with the advisor strategy)
- [effort] "Effort level also impacts the balance of quality, speed, and cost." (How to choose which Claude model is best for your workload)
- [cost] "Cost-per-task is often lower for more intelligent models, especially at lower effort levels, even if the price-per-token is higher." (Our advice: start smart)
- [subagents-orchestration] "Sonnet provides a balance of performance, cost, and speed for the widest set of general purpose use cases, including high-volume sub-agents in multi-agent orchestration setups." (Sonnet)
- [evals-verification] "Two common ways to see if model capabilities are sufficient for your needs are to use standard benchmarks and custom evaluations." (How evals and benchmarks help with model choice)
- [evals-verification] "Typically, evaluations are a curated set of problems drawn from production — including difficult tasks where your current tools fall short, with success criteria your team defines." (How evals and benchmarks help with model choice)
- [evals-verification] "We've written extensively on the best practices for developing custom agent evaluations." (How evals and benchmarks help with model choice)

### The new rules of context engineering for Claude 5-generation models

- Source: <https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models> — dated 2026-07-24; fetch partial; 32 claims extracted, 10 shown
- Thesis: The post argues that Claude 5-generation models need much lighter, judgment-preserving context (rules relaxed to principles, examples replaced by well-designed interfaces, upfront exhaustive instructions replaced by progressive disclosure via skills/references/deferred-loaded tools, manual CLAUDE.md memory replaced by auto-memory) because the newer models were being overconstrained by prior-generation prompting habits.

Premises: **P6 qualifies** — "Rubrics allow Claude to try and verify your taste in a particular field (e.g. what does a good API design look like) by using dynamic workflows and spinning up verifier agents with those rubrics."

Novel for the plugin:

- The post's central mechanism for verification/review workload is moving it OUT of the always-loaded system prompt and INTO selectively-invoked skills ('we moved verification and code review into their own skills that Claude Code could selectively call') — a progressive-disclosure argument for where a review/verification skill should live, distinct from and not addressing which model tier runs it. Section: Then: Put it all upfront / Now: Use progressive disclosure.
- Deferred tool loading via ToolSearch ('Some of our tools are deferred loading, which means the agent must search for their full definitions using ToolSearch before using them') is offered as a context-budget technique orthogonal to model tiering — could inform how a delegation-tiering plugin keeps its own gate/skill definitions out of context until invoked. Section: Then: Put it all upfront / Now: Use progressive disclosure.
- The post explicitly warns against treating CLAUDE.md/Skill.md as 'a central repository for every known practice you might run into' and instead recommends 'a tree of files that can be loaded at the right time' — relevant to how the delegation-tiering skill/rule files themselves should be structured to avoid the overconstraining pattern the post diagnoses. Section: Then: Put it all upfront / Now: Use progressive disclosure.
- 'Rubrics' as a named reference type — dynamic workflows spinning up 'verifier agents' scored against a rubric for subjective judgment (e.g. API design taste) — is a concrete orchestration pattern (a verification fan-out) not framed in terms of model tier at all; the plugin author might note this as a pattern to tier (rubric-verifier agents would plausibly be a P3/P6-style top-tier gate) even though the source doesn't say so. Section: Then: Simple specs / Now: Rich references.
- The post's overall thesis is a caution AGAINST over-specifying constraints on the agent ('we were overconstraining Claude Code... several conflicting messages in a single request') — a general steering-hygiene point (avoid conflicting/redundant rules across system prompt, skills, and user requests) that a delegation-tiering plugin's own rule/skill prose should heed to not itself become a source of conflicting instructions. Section: Unhobbling Claude.

Quotes:

- [subagents-orchestration] "Rubrics allow Claude to try and verify your taste in a particular field (e.g. what does a good API design look like) by using dynamic workflows and spinning up verifier agents with those rubrics." (Then: Simple specs / Now: Rich references)
- [evals-verification] "Because Claude Code was focused on coding, our system prompt included detailed information on how to do code review and verification." (Then: Put it all upfront / Now: Use progressive disclosure)
- [evals-verification] "These were not always needed, but when they were, it was crucial information." (Then: Put it all upfront / Now: Use progressive disclosure)
- [evals-verification] "For example, we moved verification and code review into their own skills that Claude Code could selectively call." (Then: Put it all upfront / Now: Use progressive disclosure)
- [evals-verification] "Rubrics are another form of references." (Then: Simple specs / Now: Rich references)
- [evals-verification] "Rubrics allow Claude to try and verify your taste in a particular field (e.g. what does a good API design look like) by using dynamic workflows and spinning up verifier agents with those rubrics." (Then: Simple specs / Now: Rich references)
- [steering-mechanisms] "Since then, Claude Code has gotten very competent at using progressive disclosure- loading the right context at the right times." (Then: Put it all upfront / Now: Use progressive disclosure)
- [steering-mechanisms] "But progressive disclosure is not just for skills, we also use it for tools." (Then: Put it all upfront / Now: Use progressive disclosure)
- [steering-mechanisms] "Some of our tools are 'deferred loading,' which means the agent must search for their full definitions using ToolSearch before using them." (Then: Put it all upfront / Now: Use progressive disclosure)
- [steering-mechanisms] "This allows us to have more tools (such as our Task tools) that don't take up context until they're needed." (Then: Put it all upfront / Now: Use progressive disclosure)

### How Anthropic runs large-scale code migrations with Claude Code

- Source: <https://claude.com/blog/ai-code-migration> — dated July 16, 2026; fetch ok; 23 claims extracted, 10 shown
- Thesis: Anthropic's internal migration playbook assigns cheap models to high-volume implementation fan-out and reserves the largest models for orchestration, rule-writing, and adversarial review, paired with mechanical/scripted verification (a validated "judge," compilers, diffs, test suites) to run multi-agent code migrations at production scale.

Premises: **P1 qualifies** — "You can offload implementer work to smaller models and keep reviewers on larger ones. For example, Mike used Claude Sonnet when he fanned out 12 subagents for the main migration."; **P2 supports** — "Fable and Opus 4.8 are particularly good at delegating, directing, and verifying parallel workstreams with subagents while finding multiple paths towards stated goals."; **P3 qualifies** — "Smaller models handle the high-volume implementation fan-out well; save your largest model for reviewers and for anything that writes rules other agents will follow."; **P4 supports** — "Don't use the largest model for everything. Token spend concentrates in your loops, so design them deliberately."; **P6 supports** — "Two adversarial reviewers evaluate the work of the implementers using separate contexts and disagreement between reviewers goes to a third agent."

Novel for the plugin:

- Advisory pattern: using a top-tier model class to advise/direct while cheaper models execute, explicitly framed as a token-cost optimization, not just a capability match ("Why AI changes the code migration math").
- Escalation on reviewer disagreement to a third agent, rather than a single top-tier reviewer being final ("Step 3 — Translate everything").
- A validated "judge": build and test the verification harness itself against both correct and deliberately-broken code before trusting it as an exit condition ("Prerequisites").
- A build/rebuild daemon that serializes the single most expensive shared operation so parallel fixer agents don't trigger redundant rebuilds ("Steps 4, 5, 6").
- Living rulebook as the fix target: a recurring reviewer finding becomes one added rule plus a regenerated batch, not a per-file patch — keeps the rulebook itself the artifact under version control rather than the code ("Step 3" / "Code migrations best practices").
- Resumability defined purely by disk state ("the output file exists on disk") as the mechanical completion predicate for a work queue ("Code migrations best practices").
- Front-loading advice: rulebook + stress test consume the human time budget; everything downstream is queue burn-down, which reframes where a plugin should place human review checkpoints ("Code migrations best practices").

Quotes:

- [cost] "While million line migrations no longer cost $3 to $4 million in engineering resources over the course of a four year project, they still cost tens to hundreds of thousands of dollars or more to execute. The Bun migration, for example, consumed 5.9 billion uncached input tokens and 690 million output tokens — around $165,000 at API pricing. The main portion of Mike’s port was 27 million tokens." (Why and when to migrate languages) — 5.9B uncached input tokens; 690M output tokens; ~$165,000 (Bun); 27M tokens (Mike's main port)
- [model-selection] "Claude Fable 5 is our most capable, generally available model. Fable and Opus 4.8 are particularly good at delegating, directing, and verifying parallel workstreams with subagents while finding multiple paths towards stated goals." (Why AI changes the code migration math)
- [model-selection] "You can offload implementer work to smaller models and keep reviewers on larger ones. For example, Mike used Claude Sonnet when he fanned out 12 subagents for the main migration." (Step 3 — Translate everything)
- [model-selection] "Don't use the largest model for everything. Token spend concentrates in your loops, so design them deliberately. Smaller models handle the high-volume implementation fan-out well; save your largest model for reviewers and for anything that writes rules other agents will follow." (Code migrations best practices)
- [advisor] "As we will see below, both Mike and Jarred used Fable for key steps in their migration process, particularly in an advisory pattern that used multiple model classes to optimize token consumption." (Why AI changes the code migration math)
- [subagents-orchestration] "Two adversarial reviewers evaluate the work of the implementers using separate contexts and disagreement between reviewers goes to a third agent." (Step 3 — Translate everything)
- [subagents-orchestration] "When a reviewer keeps catching the same mistake across files, the fix isn't per-file. You add one sentence to the rulebook and regenerate the affected batch. The rulebook keeps growing through this step; the code never gets hand-patched against it." (Step 3 — Translate everything)
- [subagents-orchestration] "He also used eight subagents specifically designed to review for 8 different categories of common failure modes based on his own intuition." (Rulebook)
- [subagents-orchestration] "Jarred executed this with an orchestrator script that invoked the compiler once across the whole workspace. “Fixer agents” then ran through the error list in parallel with adversarial review. The build runs again, rinse and repeat." (Steps 4, 5, 6 — Compile, run, and match behavior)
- [subagents-orchestration] "The next stage in this loop is a build daemon, which is the only process allowed to rebuild the binary. Fixers write patches; the daemon batches them, rebuilds once, re-runs the affected tests, and feeds the results back. This serializes the most expensive operation instead of letting multiple agents trigger it independently." (Steps 4, 5, 6 — Compile, run, and match behavior)

### Building multi-agent systems: when and how to use them

- Source: <https://claude.com/blog/building-multi-agent-systems-when-and-how-to-use-them> — dated 2026-01-23 (from the category listing page, captured 2026-09-03); not independently verified against the rendered page); fetch partial; 17 claims extracted, 10 shown
- Thesis: Start with a single agent; move to a multi-agent architecture only when one of three concrete constraints applies (context pollution, parallelizable work, or specialization needs), decompose work along context boundaries rather than problem-type boundaries, and use a dedicated verification subagent — with concrete, comprehensive, negative-test-inclusive criteria — to catch the "early victory problem" of premature success declarations.

Premises: **P4 qualifies** — "multi-agent implementations typically use 3-10x more tokens than single-agent approaches for equivalent tasks"; **P6 qualifies** — "Verification requires minimal context transfer by nature, so a verifier can blackbox-test a system"

Novel for the plugin:

- This article never discusses model selection, model tiers (Haiku/Sonnet/Opus), reasoning-effort dials, or an 'advisor' pattern at all — its entire vocabulary is architectural (single- vs multi-agent, context isolation, decomposition boundaries), so it cannot be cited as either support or contradiction for any of the plugin's model-tiering premises; treat the six premises as untested by this source, not validated by it.
- Three-scenario gate for adding agents at all (Introduction/decision-framework section): context pollution, parallelization, specialization — a pre-check a tiering plugin could borrow as 'don't spawn a delegate before this gate passes,' upstream of which tier to assign it.
- 'Context-centric decomposition' principle (Context-centric decomposition section): divide work by context boundary, not by problem type — 'dividing by type of work creates constant coordination overhead.' Directly useful for how a plugin scopes what a delegated agent's spec/context bundle should contain, independent of model choice.
- Named failure mode 'the early victory problem' (The Early Victory Problem section) with four concrete mitigations: concrete success criteria, comprehensive checks, negative tests, and explicit instructions not to declare success prematurely — a ready-made checklist for the plugin's verification-gate guidance, orthogonal to but complementary to model tiering.
- 40+ tools cited as the empirical threshold where a single agent's tool-selection reliability degrades (Example: Multi-platform integration) — a concrete signal a plugin could use for 'split into specialized agents,' distinct from model-tier signals.
- The 3-10x token-cost multiplier for multi-agent vs single-agent architectures (Overview) is an architecture-level cost lever the post treats as more significant than any per-call knob it discusses — useful as a caveat that the plugin's 'model class is the bigger lever than tokens' framing (P4) addresses a different cost axis (which model per call) than this post's main cost warning (whether to fan out agents at all).

Quotes:

- [model-selection] "model="claude-sonnet-4-5"" (code examples throughout) — Every code example uniformly uses claude-sonnet-4-5, with no comparative discussion of Haiku vs Sonnet vs Opus tiering
- [advisor] "" (not present anywhere in the article per targeted queries) — No mention of an 'advisor' pattern or tool was found
- [effort] "" (not present anywhere in the article per targeted queries) — No mention of reasoning-effort levels was found
- [cost] "multi-agent implementations typically use 3-10x more tokens than single-agent approaches for equivalent tasks" (Overview / The case for starting with a single agent) — Multi-agent systems use 3 to 10 times more tokens than single-agent approaches for equivalent tasks
- [subagents-orchestration] "context pollution degrades performance, when tasks can run in parallel, and when specialization improves tool selection or task focus" (Introduction (the three scenarios justifying multi-agent investment)) — Three qualifying scenarios named
- [subagents-orchestration] "A single agent with 40+ tools often struggles to select correctly, confusing similar operations across platforms." (Example: Multi-platform integration) — 40+ tools cited as the threshold at which a single agent confuses similar operations
- [steering-mechanisms] "" (not present anywhere in the article per targeted queries) — No mention of CLAUDE.md, rules files, skills, hooks, or subagent-as-configuration-mechanism was found
- [subagents-orchestration] "Running multiple agents in parallel allows you to explore a larger search space than a single agent can cover" (Parallelization)
- [subagents-orchestration] "Different tasks sometimes benefit from different tool sets, system prompts, or domains of expertise. Rather than providing a single agent with access to dozens of tools, specialized agents with focused toolsets matched to their responsibilities can improve reliability." (Specialization / Tool set specialization)
- [subagents-orchestration] "Approaching context limits. If an agent routinely uses large amounts of context and performance is degrading, context pressure may be the bottleneck." (Outgrowing single-agent architectures)

### Claude Code power user customization: How to configure hooks

- Source: <https://claude.com/blog/how-to-configure-hooks> — dated December 11, 2025; fetch ok; 9 claims extracted, 9 shown
- Thesis: The article is a how-to guide explaining Claude Code's eight hook types (PreToolUse, PermissionRequest, PostToolUse, PreCompact, SessionStart, Stop, SubagentStop, UserPromptSubmit), how to configure them in settings.json, matcher syntax, input/output/structured-response formats, environment variables, security considerations, and debugging techniques — it is not about model selection, agent tiering, cost, or evals.

Premises: **P5 qualifies** — "This hook is most commonly used, firing after Claude chooses a tool to use but before the tool actually executes. Your script can inspect the planned action and approve it, block it, request user confirmation, or modify the parameters, using a matcher to filter which tools trigger this hook."

Novel for the plugin:

- The article documents PreToolUse's exact mechanics (fires after Claude picks a tool, before it runs; can approve/block/request confirmation/modify parameters) and gives the canonical JSON shape (matcher + hooks array with type:"command") — directly useful as the technical substrate for the plugin's PreToolUse deny-gate, cited in section 'PreToolUse'.
- SubagentStop is a second, distinct enforcement point (subagent completion, not tool-call time) that could complement or replace a PreToolUse check for validating that a delegated subagent's output/model choice was appropriate after the fact, cited in section 'SubagentStop'.
- Structured hook responses support a 'reason' field ('explanation shown to Claude') and 'block'/'deny' decisions, plus exit code 2 makes stderr the error message shown to Claude — relevant to how the plugin's gate should communicate a missing-model violation back to the agent, cited in section 'How hooks respond' / 'Security considerations'.
- Hooks can return updatedInput to modify tool parameters before execution — a mechanism the plugin could in principle use to inject a default model/effort rather than only denying, cited in section 'How hooks respond'.
- Note on determinism/reliability of hook config: 'direct edits to hook configuration files require review in the /hooks menu before taking effect' — relevant to how the plugin's own hook installation is surfaced/approved to the user, cited in section 'Security considerations'.
- The article explicitly recommends starting with one simple hook (PostToolUse formatter) and expanding only as needed ('Start with one simple hook that solves an actual friction point in your workflow... Once that works, expand based on what you learn') — a minimalism argument that could be cited when scoping how much the tiering plugin's hook surface should grow, section 'Building your own hooks'.

Quotes:

- [subagents-orchestration] "This hook fires whenever a subagent created via the Task tool finishes. Works the same way as Stop, but triggers specifically when a subagent completes its action (rather than the main agent)." (SubagentStop)
- [subagents-orchestration] ""prompt": "Evaluate the subagent's output. Verify the task was completed correctly and the results meet quality standards. If the output is satisfactory, respond with 'accept'. If issues exist, respond with 'reject' and explain what needs to be fixed."" (SubagentStop)
- [subagents-orchestration] "When to use SubagentStop:

* Validating that subagent output meets quality criteria
* Triggering follow-up actions based on subagent results
* Logging subagent activity for debugging or auditing" (SubagentStop)
- [evals-verification] "When to use Stop:

* Forcing Claude to continue until all items in a checklist are done
* Verifying that tests pass before considering a task complete
* Triggering summary generation at the end of a session
* Checking that generated code compiles before stopping" (Stop)
- [evals-verification] ""prompt": "Review whether the task is complete. If all requirements are met, respond with 'complete'. If work remains, respond with 'continue' and specify what still needs to be done."" (Stop)
- [steering-mechanisms] "Hooks are configured in your settings files using a JSON structure with event names, matchers (to filter which tools trigger the hook), and the commands to run." (What is a hook?)
- [steering-mechanisms] "Hooks live in JSON settings files at three levels. Project-level hooks go in .claude/settings.json within your repository, making them shareable with your team. User-level hooks go in ~/.claude/settings.json and apply across all your projects. Local project hooks go in .claude/settings.local.json for personal configuration you don't want to commit." (Configuration and file locations)
- [steering-mechanisms] "Project-level settings take precedence over user-level settings. There are also enterprise-managed policy settings available for organizational control." (Configuration and file locations)
- [steering-mechanisms] "Claude Code includes a safeguard: direct edits to hook configuration files require review in the /hooks menu before taking effect. This prevents malicious code from silently adding hooks to your configuration." (Security considerations)

### Running auto mode in production

- Source: <https://claude.com/blog/auto-mode-in-production> — dated August 7, 2026; fetch ok; 18 claims extracted, 10 shown
- Thesis: The post is a customer-story piece (Nuro, Gusto, Garner Health) arguing that Claude Code's "auto mode" — an automated per-action classifier that blocks likely-harmful tool calls — lets teams remove manual permission-prompt friction ("9x longer between interruptions") while keeping safety, provided teams pair it with their own layered controls (skills-based command denials, a governed MCP proxy, manual fallback for the highest-stakes production work).

Premises: **P2 qualifies** — "Chad still steps out of auto mode for his most sensitive work."; **P5 supports** — "In internal evaluations, the classifier caught more dangerous actions than developers did when clicking through permission prompts by hand"

Novel for the plugin:

- Introduction section: 'auto mode' is a permission-layer classifier that blocks risky tool calls automatically, distinct from model-tier selection — it's a deterministic-ish safety gate evaluated per-action, conceptually adjacent to but not the same mechanism as a PreToolUse hook enforcing model tiering.
- Introduction section: reported '9x longer between interruptions than under the previous default' as the headline productivity metric for the automated-gate approach — a possible analogue metric (friction reduction) if the plugin wants to argue ROI for a deterministic gate.
- Nuro section: unattended overnight fan-out of long-running research agents that 'hill-climb the evaluation metrics' and produce multiple PRs by morning — an autonomous fan-out pattern with no mention of differentiated model tiers across the fan-out workers.
- Gusto section: risk-based mode switching by task type at the *permission-mode* level (auto mode vs accept-edits-with-manual-verification vs bypass-permissions) rather than the *model* level — Chad Kunsman manually verifies each tool call for production-infrastructure work instead of any model upgrade; this is an alternative axis to model tiering worth distinguishing from it.
- Garner Health section: an agent's own workflow embeds a self-adversarial verification step ('antagonistic research' to pressure-test its own assumptions) before implementation, i.e. verification built into the single agent's process rather than a separate top-tier review-gate agent.
- Garner Health section: a 'standardized software development lifecycle' is packaged and run 'as a plugin of standardized skills' — direct evidence of plugins bundling skills into a repeatable multi-step lifecycle, relevant to how a delegation-tiering plugin might itself be structured or marketed.
- Gusto section: a category-based carve-out disables the automated mode for actions that affect other people (Slack messages, emails) regardless of assessed risk score — a policy dimension (audience/reversibility of the action) orthogonal to both model tier and permission mode.
- Gusto section: the classifier is explicitly claimed to outperform human manual review at catching dangerous actions ('the classifier caught more dangerous actions than developers did when clicking through permission prompts by hand') — an evidentiary data point favoring automated/deterministic gating over prose-only or human-judgment-only guardrails, though it is about a different gate (harm classifier) than a model-tier-naming gate.

Quotes:

- [cost] "You have to weigh the amount of time you're saving against what it could reasonably make a mistake on, and how catastrophic that would be." (Gusto section (Chad Kunsman quote))
- [cost] "Ultimately, you're still responsible for what happens." (Gusto section (Chad Kunsman quote))
- [subagents-orchestration] "An agent picks up a task, explores the context it has access to, commits context files to the repository, runs what Evan calls 'antagonistic research' to pressure-test its own assumptions, and then moves on to implementation" (Garner Health section)
- [evals-verification] "In internal evaluations, the classifier caught more dangerous actions than developers did when clicking through permission prompts by hand" (Introduction section)
- [evals-verification] "Kai's team uses auto mode to power long-running research agents that hill-climb the evaluation metrics behind its autonomous-driving stack" (Nuro section)
- [evals-verification] "In his team's own analysis, roughly 10% of session transcripts since mid-May 2026 included an auto mode denial, evidence the classifier is doing real work without dragging on legitimate tasks." (Gusto section)
- [steering-mechanisms] "Nuro leans heavily on skills, and engineers deny the most dangerous commands, like recursive deletes, outright in their settings" (Nuro section)
- [steering-mechanisms] "That lifecycle runs as a plugin of standardized skills" (Garner Health section)
- [steering-mechanisms] "Gusto routes its MCP traffic through a governed proxy layer with tool guards and prompt inspection, so agents work with tightly scoped permissions before auto mode ever weighs in." (Gusto section)
- [other] "a classifier [that] evaluates each action and blocks ones that look potentially harmful" (Introduction section)

### Best Practices for Using Claude Opus 4.7 with Claude Code

- Source: <https://claude.com/blog/best-practices-for-using-claude-opus-4-7-with-claude-code> — dated April 16, 2026; fetch partial; 5 claims extracted, 5 shown
- Thesis: The post is operational guidance for using Opus 4.7 inside Claude Code (effort-level selection, session structuring, adaptive thinking, and behavioral changes vs. prior models) — it is not about multi-model delegation tiering, cost-per-task economics, evals, or Claude Code steering-artifact design, and is silent on nearly all six premises of the delegation-tiering plugin, touching only tangentially on effort-as-a-dial and subagent fan-out.

Premises: **P4 qualifies** — "You can toggle between effort levels during the same task to more effectively manage token usage."; **P6 qualifies** — "Spawn multiple subagents in the same turn when fanning out across items or reading multiple files."

Novel for the plugin:

- Adaptive thinking replaces fixed thinking budgets in Opus 4.7 ("Extended Thinking with a fixed thinking budget is not supported in Opus 4.7"), making the model decide per-step whether to reason more — a dynamic the plugin's per-call effort dial doesn't currently model (section: Working with adaptive thinking).
- The model is now described as more judicious about delegating to subagents at all, and spawns fewer by default — a shift toward doing work directly rather than fanning out, which the plugin's tiering premises don't address since they assume delegation is already happening (section: Behavior changes worth knowing).
- Guidance to reduce required user interactions and rely on auto mode for long-running tasks, plus requesting completion notifications — an interactive-session ergonomics concern orthogonal to model/effort tiering (section: Structuring interactive coding sessions).

Quotes:

- [effort] "The default effort level for Opus 4.7 in Claude Code is now `xhigh`." (Recommended effort settings for Opus 4.7)
- [effort] "`xhigh` (default, recommended): The best setting for most coding and agentic uses." (Recommended effort settings for Opus 4.7)
- [effort] "You can toggle between effort levels during the same task to more effectively manage token usage." (Recommended effort settings for Opus 4.7)
- [subagents-orchestration] "It spawns fewer subagents by default." (Behavior changes worth knowing)
- [subagents-orchestration] "Spawn multiple subagents in the same turn when fanning out across items or reading multiple files." (Structuring interactive coding sessions)

### Multi-agent coordination patterns: Five approaches and when to use them

- Source: <https://claude.com/blog/multi-agent-coordination-patterns> — dated 2026-04-10 (from the category listing page, captured 2026-09-03); not independently confirmed against raw page); fetch partial; 9 claims extracted, 9 shown
- Thesis: The post catalogs five multi-agent coordination shapes — generator-verifier, orchestrator-subagent, agent teams, message bus, shared state — describes how each works and where it struggles, and recommends starting with orchestrator-subagent as the default, evolving toward the others only once its specific limits are observed in practice.

Premises: silent on all six.

Novel for the plugin:

- Repeated verification with a WebFetch summarizer tool refused verbatim full-text reproduction (copyright/fair-use policy) across three separate attempts, and explicitly confirmed — after being asked point-blank — that model selection, effort levels, cost-per-task/price-per-token, an 'advisor' tool/pattern, and Claude Code steering mechanisms (CLAUDE.md, rules, skills, hooks, plugins) are NOT discussed anywhere in this article. Treat this as evidence of absence, not proof: it rests on an intermediary model's search of the page rather than a byte-for-byte read of the raw HTML, so a residual chance of a missed passage remains.
- The article names sequential (non-parallel) subagent execution as a concrete failure mode distinct from model choice: 'Unless explicitly parallelized, subagents run one after another, meaning the system incurs multi-agent token costs without the speed benefit.' (Pattern 2, Where it struggles) — a cost/throughput anti-pattern a delegation-tiering plugin could flag independently of tier selection.
- Named anti-pattern for shared-state fan-outs: 'reactive loops' where 'Agent A writes findings, Agent B responds, Agent A replies' and the system 'cycles burning tokens without convergence' — the post's fix is explicit termination strategies (time budgets, convergence thresholds of 'no new findings for N cycles', or a designated completion agent), not model tier. (Pattern 5: Shared state — Where it struggles)
- The post frames pattern choice as answering 'structural questions' (how long workers hold context, workflow predictability, degree of interdependence, centralization needs) rather than anything about model capability or cost — a decomposition-first framing a delegation-tiering plugin could contrast against its own tiering-first framing. (Choosing and evolving between patterns)
- Its one general recommendation is procedural, not architectural-upfront: 'start with orchestrator-subagent... observe where it struggles, then evolve.' This is an empirical/iterative stance the plugin's bottom-up-by-design premise (P1) could be checked against, though it addresses pattern choice, not model tier. (Getting started)

Quotes:

- [cost] "Unless explicitly parallelized, subagents run one after another, meaning the system incurs multi-agent token costs without the speed benefit." (Pattern 2: Orchestrator-subagent — Where it struggles) — multi-agent token cost incurred with no speed benefit when subagents run sequentially rather than in parallel
- [subagents-orchestration] "Claude Code uses this pattern. The main agent writes code, edits files, and runs commands itself, dispatching subagents in the background when it needs to search a large codebase or investigate independent questions so work continues while results stream back." (Pattern 2: Orchestrator-subagent)
- [subagents-orchestration] "The orchestrator becomes an information bottleneck. When a subagent discovers something relevant to another subagent's work, that information has to travel back through the orchestrator." (Pattern 2: Orchestrator-subagent — Where it struggles)
- [subagents-orchestration] "When subagents need to retain state across invocations, agent teams are the better fit." (Choosing and evolving between patterns — Orchestrator-subagent vs. agent teams)
- [subagents-orchestration] "once teammates need to communicate with each other rather than only share final results, shared state makes that more natural." (Choosing and evolving between patterns — Agent teams vs. shared state)
- [subagents-orchestration] "If agents in a message bus system are publishing events to share findings rather than trigger actions, shared state is a better fit." (Choosing and evolving between patterns — Message bus vs. shared state)
- [subagents-orchestration] "For most use cases, we recommend starting with orchestrator-subagent. It handles the widest range of problems with the least coordination overhead. Observe where it struggles, then evolve toward other patterns as specific needs become clear." (Choosing and evolving between patterns / Getting started)
- [evals-verification] "The verifier checks whether the output meets the required criteria and either accepts it as complete or rejects it with feedback." (Pattern 1: Generator-verifier — How it works)
- [context-engineering] "the right pattern depends on a handful of structural questions about the system" (Choosing and evolving between patterns)
