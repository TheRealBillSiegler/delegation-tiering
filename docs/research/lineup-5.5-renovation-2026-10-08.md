# Lineup 5.5 renovation and prior-art sweep — research record, 2026-10-08

Status: ruled by the owner on 2026-10-08. The remedies were drafted as release 0.1.3; on 2026-10-09 the owner folded them, with the lint fix drafted as 0.1.4, into release 0.1.2, the first release after 0.1.1; on 2026-10-15 the owner numbered that release 0.2.0 under the versioning rule ruled in #12. In this record, 0.1.2 names the draft on PR #19 as of 2026-10-08, and 0.1.3 names the remedies below. This record backs a renovation of the delegation-tiering skill for the Claude 5.5 lineup, a second prior-art sweep, and the owner's ruling on the top of the ladder.

Trigger: the owner reported on 2026-10-08 that the skill predates Claude Opus 5.5 and Claude Haiku 5.5. The skill text in force is release 0.1.2 (branch `release/0.1.2`, PR #19, unmerged).

## 1. The lineup the ladder names

Four models are current on the Anthropic API, per the [platform models overview](https://platform.claude.com/docs/en/about-claude/models/overview) and the [pricing page](https://platform.claude.com/docs/en/about-claude/pricing), both fetched as markdown on 2026-10-08:

| Model | ID | Released | Input / output per MTok | Default effort |
| --- | --- | --- | --- | --- |
| Claude Fable 5.1 | `claude-fable-5-1` | 2026-09-01 | $10 / $50 | high |
| Claude Opus 5.5 | `claude-opus-5-5` | 2026-09-22 | $4 / $20 | medium |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 2026-09-28 | $2 / $10 | high on the API, medium in Claude Code |
| Claude Haiku 5.5 | `claude-haiku-5-5` | 2026-10-07 | $0.10 / $0.50 for prompts up to 100,000 tokens; $0.50 / $2.50 above | medium |

- Haiku 5.5 is the first Haiku with an effort setting: "Claude Haiku 5.5 supports all five effort levels, and `medium` is the default on the Claude API and in Claude Code" ([effort page](https://platform.claude.com/docs/en/build-with-claude/effort)).
- Haiku 4.5 is a legacy model with a tentative retirement "Not sooner than October 15, 2026" ([deprecations table](https://platform.claude.com/docs/en/about-claude/model-deprecations)), and its model page still lists effort as "Not supported".
- The Sonnet 5.5 default differs by surface. The effort page says "`high` is the default on the Claude API"; Claude Code's [model configuration page](https://code.claude.com/docs/en/model-config) says "Opus 5.5, Sonnet 5.5, and Haiku 5.5 default to `medium`". The Claude Code value governs this skill.
- Sonnet 5.5 cache reads cost $0.10 per MTok since the Haiku 5.5 launch ("Cache reads now cost 50% less", [Haiku 5.5 announcement](https://www.anthropic.com/claude-haiku-5-5)); the local `claude-api` skill cached on 2026-09-25 still prints $0.20 and has no Haiku 5.5 row.

### Alias resolution has version floors

Claude Code's version history moves each family alias at a stated version: `fable` to Fable 5.1 at 2.1.257, `opus` to Opus 5.5 at 2.1.280, `sonnet` to Sonnet 5.5 at 2.1.284, and `haiku` to Haiku 5.5 at 2.1.293, the last on the Anthropic API only. Claude Platform on AWS, Amazon Bedrock, Google Cloud's Agent Platform, and Microsoft Foundry resolve `haiku` to Haiku 4.5.

Workflow subagent transcripts on this machine (Claude Code 2.1.292, VS Code extension) recorded `sonnet` as `claude-sonnet-5-5`, `fable` as `claude-fable-5-1`, and `haiku` as `claude-haiku-4-5-20251001`. The CLI on `PATH` reported 2.1.282 early on 2026-10-08 and 2.1.295 later that day after an automatic update; the first live probe below ran on 2.1.295 and resolved `haiku` to `claude-haiku-5-5`.

### Default main model

"Pro, Max, Team, Enterprise, and Anthropic API: defaults to Opus 5.5", and "Fable models are not the account-type default on any plan or provider" (model configuration page). The owner's `settings.json` sets `"model": "opus"`. The 0.1.2 scope line assumes the orchestrator is "already the most capable model in the session"; in a default session the orchestrator is Opus 5.5 and Fable 5.1 remains available to delegate to.

## 2. Claude Code delegation surfaces

- **Per-call effort on the Agent tool.** Claude Code 2.1.292 (2026-10-06 changelog): "Added an `effort` parameter to the Agent tool, so Claude runs a sub-agent at the effort level you ask for". The [subagents page](https://code.claude.com/docs/en/sub-agents) scopes it to non-fork subagents and ranks `CLAUDE_CODE_EFFORT_LEVEL` above it. The tool schema sets effort only "when the user, or instructions such as CLAUDE.md or a skill, explicitly ask". The 0.1.2 durable rule "direct Agent tool calls have no effort parameter" is false from 2.1.292.
- **Model precedence.** The subagents page orders the per-invocation `model`, the definition's `model` frontmatter, `CLAUDE_CODE_SUBAGENT_MODEL`, and the main model. Workflow agents follow the same order, and a model named in a script counts as the per-invocation model ([workflows page](https://code.claude.com/docs/en/workflows)).
- **`CLAUDE_CODE_SUBAGENT_MODEL_FORCE`** (2.1.257 and later): "Claude can't pass a model when it starts a subagent". The 0.1.2 gate denies every Agent call that lacks `model`, so that gate and this setting cannot both be satisfied.
- **Forks.** A fork runs on the main session's model; the Agent tool schema says the `model` parameter is "Ignored for subagent_type: "fork"". The 0.1.2 gate denies a model-less fork call, and the re-issued call passes with a model that never runs.
- **Mods.** Claude Code 2.1.292 "Added workflow agents to the `agent.spawn` mod hook, with their run and index, so a mod can refuse them". The mods reference page has not caught up. A mod is therefore a candidate per-spawn contact point for workflow agents; this plugin ships no mod and no live test has exercised one.
- **Hook failure.** Claude Code 2.1.295 "Added `onFailure: "block"` for command and HTTP hooks: a hook that can't start, times out, or exits with an unexpected code blocks the action instead of letting it through". The hooks page has no `onFailure` text yet.
- **Hook payloads.** The hooks page documents the PreToolUse Agent `tool_input` fields `prompt`, `description`, `subagent_type`, and `model` (row A3 at 0.1.2 records them as docs-silent), and the PostToolUse Agent `tool_response` fields `resolvedModel` ("may differ from the requested model"), `modelsUsed`, and `usage`, where `usage` covers the final request only. No `effort` field appears in the Agent `tool_input` table.
- **Safety fallback.** "Fable 5.1, Fable 5, and Opus 5.5: biology-flagged requests re-run on Opus 5, and cybersecurity-flagged requests re-run on Opus 4.8", and "In a subagent, Claude Code doesn't show the prompt, and a flagged request that would switch models re-runs on the fallback model" (model configuration page).
- **Settings.** A user-level top-level `effortLevel` applies to Opus 5 and Fable 5.1 and is ignored for Opus 5.5 and later; `modelSettings.<model>.effortLevel` applies per model. Whether `modelSettings` reaches a subagent running that model is undocumented.
- **Ultracode.** The workflows page says `claude --effort ultracode` "also sets the effort level to `xhigh`"; the 2.1.284 changelog says Ultracode "no longer forces xhigh effort and stays on at any effort level". The model configuration page reconciles them: turning ultracode on with `/effort` or the `ultracode` setting "leaves the effort level unchanged", and the `--effort ultracode` flag also sets `xhigh`. The skill's ultracode sentence depends on neither.
- **Workflow harness relay.** On 2.1.292 the workflow harness hands every workflow agent the user's triggering request, verbatim, ahead of the script's task, with the instruction "Where the computed task conflicts with this request, this request wins".

## 3. Anthropic's guidance at the top of the ladder

- The [Opus 5.5 announcement](https://www.anthropic.com/claude-opus-5-5): "It performs at the level of Claude Fable 5.1 on most work and costs 40% less to run than Opus 5", and "In our own use, the gap between Opus 5.5 and Claude Fable 5.1 is narrower than these scores suggest", where the scores favor Opus 5.5.
- The [choosing-a-model page](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model): "Most workloads start with Claude Opus 5.5", and "If your evals at `xhigh` or `max` effort still fall short on demanding reasoning or long-horizon agentic work, move to Claude Fable 5.1." The same page calls Fable 5.1 "Anthropic's most capable model open to all customers" and says "Tuning effort is often a better lever than switching models."
- The [cost and intelligence page](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence): "Opus 5.5 at its default, `medium`, matched Fable 5.1 at its default (92.8% against 92.3%, inside run-to-run noise) for about a fifth of the cost per solved task ($0.22 USD against $1.19 USD)", on a 478-problem SWE-bench Pro subset the page calls not comparable to the public leaderboard. On orchestration: "In every such case measured, the coordinator's model alone at lower effort came out ahead", and delegation paid on routine, normally solvable work and on work larger than one context window.
- The Haiku 5.5 announcement: "It pairs well with Opus 5.5 and Sonnet 5.5 as a subagent on coding work", and "Sonnet 5.5 and Opus 5.5 remain better choices for complex agentic coding tasks".
- The [Claude models explained post](https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case) still shows 2026-07-24 and no 5.5 text; every quote in [claude-models-explained-2026-08-05.md](claude-models-explained-2026-08-05.md) is present in the live page.
- The bundled workflow-authoring reference (Claude Code 2.1.292) tells script authors: "Default to omitting it — the agent inherits the main-loop model (the resolved session model), which is almost always correct." The plugin's Workflow lint denies exactly that.

### Head-to-head comparisons by role

A second sweep collected every Opus 5.5 versus Fable 5.1 (or Mythos 5.1, the same model under Project Glasswing access) comparison in the four launch posts, the four system cards, and the platform and Claude Code docs. About 30 direct measurements favor Opus 5.5 or tie; Fable 5.1 leads only on OfficeQA, by 1.3 points, and nominally on silent use of leaked answers (9.2% against 12.1%, overlapping intervals). Many Opus 5.5 leads have no printed error bars, and the arms often ran at different effort. The Opus 5.5 announcement's table orders its columns Opus 5.5, Fable 5.1, Opus 5, GPT-6 Astra, GPT-5.6 Sol, read from the table's header cells. No comparison measures a review verdict, design under unsettled requirements, or a defensive source-code security read.

| Role | Measured | First-party guidance |
| --- | --- | --- |
| Open adversarial gate | none on review verdicts; honesty and fabrication measures favor Opus 5.5 (concealed-change disclosure 96.9% against 85.3%) | Claude Code: Fable models "investigate before acting, and verify their work more often than smaller models"; Anthropic used Mythos 5.1 as the adversarial reviewer of the Opus 5.5 system card's alignment section |
| Open-ended design | knowledge-work proxies favor Opus 5.5 (GDPval-AA v2.1 1846 against 1735 Elo, Opus 5.5 at max); the Opus 5.5 card reports it "addressed review feedback narrowly without reconsidering whether the overall design is right" | Claude Code: "Hand it ambiguous problems: root-cause investigations, outage debugging, and architecture decisions are where the extra investigation and verification pay off", written of Fable |
| Security-boundary read | Opus 5.5 "meeting or exceeding Claude Mythos 5.1 on all of our internal evaluations" (cyber, safeguards off); vulnerability identification 91.1% against 88.3%; defensive vulnerability discovery flagged 4.5% against 7.0% (overlapping bars) | the Fable 5.1 system card points cyber use cases that "cannot run on Fable" to the Cyber Verification Program, and the Fable product page lists Opus 5.5, Sonnet 5.5, and Mythos 5.1 for it, not Fable 5.1 |

## 4. This plugin's own measurements

- **Fable share of workflow model literals.** Across 171 workflow scripts persisted since 2026-08-16, 539 `model:` literals sit outside `export const meta`, and fable is 166 of them (31%). The 69 literals inside `meta.phases` include 42 fable entries; counting them raises the share to 34%, the figure the 2026-09-10 assessment used.
- **The ledger double-counts.** `hooks/delegation-ledger.js` collects `modelLiterals` with a regex over the whole script, so a `model` in `meta.phases` is recorded beside the agent call it describes. Upstream report anthropics/claude-code#88695 says a `meta.phases` model is display metadata only.
- **What fable did.** The 155 fable call sites in those scripts all have labels: 104 name a gate, critic, verify, review, or check; 25 name a draft, plan, design, or synthesis; 23 name a revision, merge, ranking, or critique; 3 name implementation or research. Of the 104 gate-type sites, 48 sit in fanned-out code — 29 with per-item labels such as `verify:${lens.key}`, `check-r${round}-…`, and `adjudicate:batch-${i + 1}`, and 19 more inside a `map`, loop, or `parallel` call — and each of those spawns once per item. Some are once-per-claim gates over many claims; others are lens reviews, per-round checks, or batched adjudications, which the skill's verification table assigns below the gate tier.
- **Agent calls.** Between 2026-09-10 and 2026-10-08 the ledger recorded 72 allowed Agent calls: 48 `sonnet`, 11 `haiku`, 8 `opus`, 5 `fable`. The gate recorded no denial between 2026-09-14 and the 2026-10-08 probes. The ledger records the requested alias only, so it cannot show which model ran or what an unsteered orchestrator would have chosen.
- **Drift.** `node scripts/check-drift.js` on 2026-10-08 reported all eight anchored code.claude.com pages changed since the 2026-09-14 baseline. The changes that broke the ladder landed on platform.claude.com, anthropic.com, and the Claude Code changelog, none of which the drift check hashes.

### Live probes, 2026-10-08

Three headless sessions on Claude Code 2.1.295 (the CLI on `PATH`, updated during the session), main model `sonnet`, `--effort medium`, with a dump hook on PreToolUse and PostToolUse for `Agent` and on SubagentStop. List-price cost was $1.16 across the three sessions.

| Call | PreToolUse `tool_input` | Outcome |
| --- | --- | --- |
| `haiku`, `effort: "low"` | `model`, `effort: "low"`, `subagent_type`, `run_in_background: false` | resolved `claude-haiku-5-5`; SubagentStop `effort.level: low` |
| `sonnet`, no effort | `model: "sonnet"`, no `effort` | resolved `claude-sonnet-5-5`; ran at `medium` |
| `fable`, no effort | `model: "fable"`, no `effort` | resolved `claude-fable-5-1`; ran at `medium`, the session level, where Fable 5.1 defaults to `high` and the owner's `modelSettings` entry for `claude-fable-5-1` says `high` |
| fork, no model (`CLAUDE_CODE_FORK_SUBAGENT=1`) | `subagent_type: "fork"`, no `model` | denied by the installed gate (0.1.1) |
| fork, `model: "sonnet"` | `subagent_type: "fork"`, `model: "sonnet"` | allowed; PostToolUse `status: async_launched`, resolved `claude-sonnet-5-5` |
| `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1`, `CLAUDE_CODE_SUBAGENT_MODEL=haiku` | no `model` field; the session reported its Agent tool had no `model` parameter and did have `effort` | denied by the installed gate; the subagent never ran |

- The PreToolUse Agent payload names `effort` and `run_in_background`, which the hooks page's Agent table omits.
- A delegation that omits `effort` ran at the session's effort level, not at its model's default and not at the model's `modelSettings` entry. The session effort here was an explicit `--effort`; a session whose effort comes from settings was not tested.
- Under `CLAUDE_CODE_SUBAGENT_MODEL_FORCE`, the Agent tool has no `model` parameter, so the 0.1.2 gate denies every Agent call and Claude cannot comply. A user with that documented setting loses the Agent tool while 0.1.2 or earlier is enabled. A fourth headless run confirmed the hook process receives the variable.
- A fork arrives with `subagent_type: "fork"`. Because the main model and the re-issued `model` were both `sonnet`, this run does not show the per-call model being ignored; the Agent tool schema and the subagents page state it.

Two further calls ran later the same day inside the owner's VS Code session (Claude Code 2.1.292, Anthropic API), where `haiku` still resolved to Haiku 4.5:

- An Agent call with `model: "haiku"` and `effort: "low"` ran on `claude-haiku-4-5-20251001` and completed (30,624 subagent tokens).
- A workflow call with the same model and effort ran on `claude-haiku-4-5-20251001` and completed. Its task was "Reply with exactly the word: ok"; the worker wrote a review of the delegation-tiering skill instead, which was the user request the harness relayed (section 2), and spent 45,511 subagent tokens.

## 5. Evidence for the top of the ladder

The 0.1.2 ladder reserves three roles for fable: the open adversarial gate, open-ended design, and security-boundary reads. The sources below are Addy Osmani's guides and repositories, community routers with published routing rules, third-party evaluations, and the roles Anthropic's own shipped tools assign. No source measures Fable 5.1 against Opus 5.5 on any of the three roles.

| Role | Measured | Guidance |
| --- | --- | --- |
| Open adversarial gate | CodeRabbit, 13 hard review cases (2026-09-28): "Opus 5.5 caught 8 to 10 issues where Sonnet 5.5 caught 6, at higher precision"; CodeRabbit (2026-09-22): "Turning up effort did not consistently produce a better review"; claude-agenting's 2026-10-06 report, planted-item discovery: "Only Opus `xhigh` found every planted item in every run (9/9); `opus/high` 7/9, `sonnet/xhigh` 6/9"; The New Stack, three author-built tests at max effort (2026-09-29): "The premium buys speed and fewer dead ends, not better judgment" | Osmani's Opus 5.5 guide (claude.dev, 2026-09-22) gives a merge-blocking review prompt for Opus 5.5; Claude Code's advisor page lists an Opus main model with an Opus advisor as a second reviewer for high-stakes tasks; Anthropic's migrations post (2026-07-16, before Opus 5.5): "save your largest model for reviewers"; EONRaider's router runs its judge agent on Opus at high for "Review, adversarial critique, security or design calls" |
| Open-ended design | proxies only: the knowledge-work and long-horizon coding results in section 3 | Claude Code hands Fable "architecture decisions" (section 3); Osmani's Sonnet 5.5 guide (2026-09-28): "Opus 5.5 is built for complex work requiring careful judgment"; tzachbon's router sends architecture work to Opus at `xhigh` |
| Security-boundary read | Anthropic's cyber evaluations favor Opus 5.5 (section 3); Endor Labs, 179 secure-coding tasks in Claude Code (2026-09-24): Fable 5.1 87.2% functional and 37.4% secure, Opus 5.5 68.7% and 33.5%, a code-writing test | Anthropic's security-guidance plugin: "Both model-backed reviews use Claude Opus 4.7 by default"; the Claude Security plugin runs its hunting and verification agents on the session's model; Osmani's agent-skills repository (April 2026) names Opus for a security auditor |

The strongest case for fable on the gate is independence. Claude Code's default orchestrator is Opus 5.5, so an opus gate reviews work written by its own model. Osmani's doubt-driven-development skill states the principle — "A single-model reviewer shares blind spots with the original author — a colder, different-architecture model catches them" — and no source above measures correlated misses between an Opus author and an Opus reviewer.

## 6. Prior art

### Correction to the 2026-08-09 record

[prior-art-and-eval-methodology-2026-08-09.md](prior-art-and-eval-methodology-2026-08-09.md) §1 lists "hard denial as the enforcement mechanism" and "Workflow-script linting at launch" as genuinely unclaimed. Both statements are wrong for the Workflow path on that date: `nedjamez/claude-code-model-router` commit `fd79b9e` (2026-07-05, "feat: enforce explicit model on Workflow agent() calls") returns a deny decision for model-less `agent()` calls, and `furkanzt/claude-agenting` commit `e68e3a3` (2026-08-06) ships a Workflow guard that denies launches lacking a model or effort. Agent-call denial was unclaimed on 2026-08-09 and has shipped since in `paultaki/claude-code-failsafe` (2026-08-30), `onlyjq04/jev-agent-hooks` (2026-09-20), and `EONRaider/agent-router` (2026-10-03). Drift detection against Anthropic's live docs appears in no tiering plugin found; the nearest is a proposal, fmanimashaun/claude-skills#1328. Novelty language in this repo stakes drift detection only.

### Neighbors

| Project | Mechanism | Workflow path | Published evaluation |
| --- | --- | --- | --- |
| [furkanzt/claude-agenting](https://github.com/furkanzt/claude-agenting) | Workflow deny on missing model or effort, balanced-parenthesis call scan; tiering skill; 20 pinned agents | yes | eval harness and a routing table dated 2026-10-06 on the 5.5 lineup, judge-graded per its README |
| [onlyjq04/jev-agent-hooks](https://github.com/onlyjq04/jev-agent-hooks) | deny on missing model, string-aware Workflow scanner, paid semantic classifier | yes | none found |
| [nedjamez/claude-code-model-router](https://github.com/nedjamez/claude-code-model-router) | Agent model rewrite through `updatedInput`; Workflow deny by call count | yes | unit tests |
| [paultaki/claude-code-failsafe](https://github.com/paultaki/claude-code-failsafe) | Agent deny for inheriting built-in types | no | none found |
| [EONRaider/agent-router](https://github.com/EONRaider/agent-router) | Agent deny below a tier floor; spawn log | no | none |
| [Kevsosmooth/claude-code-dispatch](https://github.com/Kevsosmooth/claude-code-dispatch) | rewrite, ask, or deny on Agent | no | replay benchmark over the user's own dispatch history |
| [tzachbon/claude-model-router-hook](https://github.com/tzachbon/claude-model-router-hook) | rewrite only; logs requested and resolved models since 2.1.0 | no | CI-gated labeled routes |

### Upstream issues

- anthropics/claude-code#27665 (native routing) is open. #44976 closed as a duplicate of #15721, which a collaborator closed on 2026-08-17 as covered by `opusplan`; #67898 closed as not planned by the inactivity bot. `opusplan` switches models between plan and execution and does not route per delegation, so the README's sunset criterion is unmet and two of its three pointers are dead.
- #94534 (open) reports bare `agent()` calls at 47% of one day's subagent spend after the workflow docs steered authors to omit the model. #92990 (open) asks workflow traces to record per-agent model and effort.
- #100082 and #91890 (open) report an explicit frontmatter model ignored in favor of the parent's; #91160 reports `CLAUDE_CODE_SUBAGENT_MODEL` overriding call-level models on 2.1.236. A model that passes the gate is a request, and `resolvedModel` is the record of what ran.
- #95769 reports that the `Agent` matcher does not fire. The tools reference lists the tool as `Agent`, and the plugin's live probes of 2026-08-12 and 2026-09-03 observed denials on that matcher; the canary is the detector if a build regresses.

### Literature

- [LLMRouterBench](https://arxiv.org/abs/2601.07206) (400,000+ instances, 33 models): "several recent approaches, including commercial routers, fail to reliably outperform a simple baseline". Its models predate Claude 5.
- [Planner-as-Router](https://arxiv.org/abs/2609.32917) (Claude 4-generation models, graded by executing queries): routing "cuts cost 44% against all-frontier routing while giving up 2.9 points of accuracy", with a pilot hint of a compounding penalty on compositional workflows.
- [The Price of Thinking](https://arxiv.org/abs/2608.16956) (preregistered, Sonnet 5 only, 30 AIME items): an explicit `high` effort contract cost more per call than an omitted one, with no detected accuracy difference.
- No controlled study of a supervised, hand-written tier ladder on Claude 5-generation models was found. The ladder's cost claims stay hypotheses until the routing-impact study in [../../evals/routing-impact-study/PROTOCOL.md](../../evals/routing-impact-study/PROTOCOL.md) runs.

## 7. Review of the draft skill

- The first draft of the renovated skill (2,072 words) answered all 18 answer-key scenarios as keyed in two blind walks (36/36).
- By a cold reader's estimate, 40 to 50% of the draft's words change no decision. The largest blocks were the Enforcement section (347 words), mostly mechanics that `hooks/README.md` already states, and a 157-word rationale section of benchmark citations.
- The draft's fable rule produced two contradictions. "Top tier" meant the most capable model while the same draft placed Opus 5.5 at or above Fable 5.1 on nearly every measure, and a security-boundary gate went to opus under the security rule and to fable under the gate rule.
- The draft's opus band, medium to high, sat below the trigger it set for fable, an opus attempt at `xhigh`.
- The draft's rule to omit effort for Haiku 4.5 guarded against no observed failure (section 4, the VS Code calls).

The rewrite under the owner's ruling (1,293 words as walked) answered 35 of 36 keyed scenarios in two final blind walks. The miss was a production-config gate answer whose model field said fable while its note concluded opus. The same rewrite at 0.1.2's tier assignments answered 36 of 36 against its own key in two blind walks. The release text then gained the canary sentence, the unreadable-`scriptPath` clause, the staleness stamp, a rule that forking chooses the session's tier, and an under-provisioning example that names the production-config review as an `opus` gate. On the 20-row key, which adds the escalation to fable and the fork choice, the release text answered 20 of 20 in each of four blind walks, two on `claude-haiku-5-5` and two on `claude-sonnet-5-5`; every walk sent the production-config gate to opus.

## Remedies

Owner ruling, 2026-10-08: the uniform ladder. Opus is the lowest tier section 5 shows sufficient for all three roles, and fable is the escalation above it. The ruling corrects the 0.1.2 rule "When fable is available, top-tier categories stay on fable", which no measurement in sections 3 or 5 supports.

**0.1.3, skill (patch).**

- The ladder assigns open adversarial gates (once per claim), open-ended design, and security-boundary reads to `opus` at high to `xhigh`, and reasoning-heavy work beyond `sonnet` to `opus` at medium to `xhigh`.
- `fable` takes work an `opus` attempt at `xhigh` has fallen short on, and one re-run of a gate whose `opus` verdict the orchestrator rejects on the evidence before any fix lands; that re-run is the claim's gate.
- A model the session cannot delegate to hands its tier to the next tier up, and the lone remaining model gates through fresh context and adversarial framing.
- The haiku row reads medium, low for short high-volume items, and the effort rule passes effort to `haiku` on every surface, including where `haiku` resolves to Haiku 4.5.
- A fork runs on the session's model, so the skill forks only when that model is the lowest sufficient tier or the shared context is the point.
- The standing rule's under-provisioning example names the production-config review as an `opus` gate.
- The effort rule names the Agent tool's `effort` parameter by what the session observes (the schema lists it), states that the skill is the explicit request the parameter's description asks for, and states that an omitted effort runs at the session's level.
- A run that nobody reviews starts at Anthropic's default model and changes models on the choosing-a-model page's own trigger.
- The workflow section names the bundled reference's omit-by-default advice as overridden and reports that a `meta.phases` model is a display label.
- The verification table gives fix re-verification an effort, and its paragraph classes a gate fanned out per lens or per round as lens review.
- The Enforcement section states what Claude acts on: the denials and their two exceptions, the lint's limits, the unchecked paths, and the `claude -p` boundary, with mechanics in `hooks/README.md`.
- The Source section points model facts at the live models overview and holds one staleness stamp that names the coverage matrix.
- `hooks/tiers.js` names `opus` for the gate, design, and security roles and `fable` for escalation; the gate's denial text derives from it.

**0.1.3, gate bug fixes (owner ruling 2026-10-08: patch).** Both fixes allow calls that cannot name a model, and the probes in section 4 fixed the payload shapes they key on.

- The gate allows `subagent_type: "fork"` with a note that forking chooses the session's tier, and that a non-fork subagent with an explicit model fits whenever the session model is above the lowest sufficient tier and the shared context is not the point.
- The gate allows a model-less Agent call with a note while `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` is on (`1`, `true`, `yes`, or `on`, in any casing, per the env-vars page), so a user with that setting keeps the Agent tool.
- Contract cases cover both allows, every documented on-value, and `0` and `off` calls that the gate still denies; the contract runner and the live probe strip an inherited `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` so their deny cases stay hermetic, and the canary counts the forced-model note as a pass.

**0.1.3, repo files (unversioned).**

- COVERAGE rows A3, A6, A8, A10, A11, A14, A15, A17, and A18 cite the 2026-10-08 pages and probes, and new rows cover forks, `CLAUDE_CODE_SUBAGENT_MODEL_FORCE`, and the safety fallback.
- The README's design rationale states the supervised premise without assuming the orchestrator is the most capable model, its Configuration line qualifies data-directory deletion to the last scope, and its sunset criterion names the one open upstream request.
- The scenario answer key holds 18 rows under the uniform ladder.
- This record and the 2026-10-08 drift report are added. The anchor refresh waits for the owner's word.

**0.2.0, ledger (minor).**

- The ledger records the per-call `effort` that the PreToolUse payload names.
- The denial text names the workflow-authoring conflict.
- The ledger records `resolvedModel` and `modelsUsed`, and collects model literals inside `agent()` spans only.
- `onFailure: "block"` is evaluated separately, because a hook key unknown to an older Claude Code may fail the hook load the way the 0.1.1 manifest defect did.

**Drift apparatus (repo, unversioned).** `check-drift.js` hashes the platform models overview, the effort page, and the Claude Code changelog beside the code.claude.com pages, and the README describes the check as on demand.

## Method

Two read-only workflows ran on 2026-10-08 from Claude Code 2.1.292. The facts workflow ran eight researchers: model lineup, Claude Code model configuration, four drift scopes over the eight anchored pages, a changelog extraction for 2.1.264 to 2.1.295, and a claim-by-claim check of the skill, README, `tiers.js`, and scenarios. Seven ran on `sonnet` and the changelog extraction on `haiku`. A `fable` gate then re-fetched 24 consequential findings and ruled each one. The prior-art workflow ran four `sonnet` researchers (community tools, known neighbors and upstream issues, first-party guidance, literature) and a `fable` legitimacy critic, which re-derived its checkable claims with `gh` and fetches. Docs were fetched as markdown with curl where the site serves it.

The section 5 sweep ran four `sonnet` gatherers at medium effort (Osmani, community routers, third-party evaluations, Anthropic's shipped tools) and a `sonnet` synthesis at high effort, 560,619 subagent tokens in all. Each gathered item has a retrieval label; section 5 quotes only items read from the page itself, and leaves out Osmani's posts on X, which were read from search snippets.

The section 7 review read the draft skill against the code-review-and-quality and code-simplification guides, its sentences as code and its delegation decisions as behavior. It ran a `sonnet` cold reader at high effort, `sonnet` scenario walkers at medium effort (two per text, each given only the skill and the scenario list), a `fable` gate at high effort on the rewrite, and a `sonnet` fix re-verification at medium effort, 489,612 subagent tokens across the three runs. The gate ruled the rewrite ship-after-fixes on two blocking findings, a fork sentence that contradicted the 0.1.2 gate and no trigger for escalating a gate to fable; the re-verification confirmed six fixes.

A release gate on `opus` at `xhigh` effort (287,567 subagent tokens) reviewed the whole branch, fetched 20 cited pages to check quotes, and ruled it ship-after-fixes on three blocking findings: the forced-model allow missed two documented on-values, the fork note said a fork has no tier to choose, and the production-config miss called for a skill fix under the eval protocol's grading rule. The final walks ran two `claude-haiku-5-5` readers, requested by model ID, and two `sonnet` readers, all at medium effort (187,048 subagent tokens).

The ledger and script measurements in section 4 are deterministic counts I ran over local files. The probes in section 4 were headless sessions I ran with a payload-dumping hook passed through `--settings`, leaving the owner's settings files unchanged, and two calls I made from the owner's session.

## Limits

- The label buckets in section 4 are a keyword classification of call-site labels, not a reading of what each agent did; a per-lens check named "gate" counts as a gate.
- Literal counts are not spawn counts: one `agent()` call inside `pipeline()` spawns once per item.
- The live probes ran once per condition. Three questions stay open: whether `modelSettings` reaches a subagent when the session's effort comes from settings and not from `--effort`; whether a fork ignores a per-call model that differs from the main model; and whether a mod's `agent.spawn` hook can refuse a workflow spawn.
- The Haiku 4.5 calls ran on the Anthropic API from one Claude Code version; providers that resolve `haiku` to Haiku 4.5 were not tested.
- The Opus 5.5 versus Fable 5.1 benchmark figures in the announcement were read from tag-stripped HTML; this record quotes only figures found on the platform pages.
- Section 5 measures no role on both models at matched effort. The ruling rests on the lowest-sufficient rule and on cost, and a matched-effort review test with planted flaws, Opus 5.5 against Fable 5.1, would test it directly.
- The scenario walkers ran two per text per model, each answering every scenario in one spawn, which falls short of the eval protocol's baseline. No scenario exercises `meta.phases`. The answer key under the uniform ladder is the author's and was graded by the author.
- GitHub code search was unavailable unauthenticated, so the community sweep is repository and web search, not exhaustive.
