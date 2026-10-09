---
name: delegation-tiering
description: Use when spawning or configuring any delegated agent — an Agent tool call, a Workflow agent() call, or a multi-agent plan — including choosing model or effort parameters, authoring a workflow script, tiering a fan-out, or deciding which tier a delegated task needs.
---

# Delegation Tiering

Standing rule: every delegated agent gets an **explicit model** at the **lowest tier sufficient** for its task, and an **explicit effort** inside that tier's band wherever the call takes one. Sufficient cuts both ways: `fable` for scouting and `sonnet` for the final adversarial review of a production config are equally wrong. State the tiering rationale when presenting a plan that spawns agents.

Scope: supervised delegation, where the orchestrator writes the spec, picks the tier, and reviews the output. Delegate bulk or routine work, independent pieces, or work larger than one context; keep a single dependent chain that fits one context. A run that nobody reviews is not supervised: start it at Anthropic's default model (see Source), tune effort, and change models only on that page's own trigger.

## The ladder

Stop at the first tier that is sufficient:

| Tier | Effort | Use for |
| --- | --- | --- |
| `haiku` | medium; low for short, high-volume items | Mechanical work: scouting, verbatim extraction, inventories, reflows, format conversion |
| `sonnet` | medium | Pattern-following implementation with verified anchors, doc research, toolchain iteration, fidelity checks |
| `sonnet` | high | Implementation from near-code design; complex but well-specified multi-file edits |
| `opus` | medium–xhigh | Reasoning-heavy work where `sonnet` demonstrably falls short |
| `opus` | high–xhigh | Open adversarial gates (once per claim), open-ended design, security-boundary reads |
| `fable` | high–xhigh | Work an `opus` attempt at xhigh has fallen short on |

Rules about the table:

- **Bands are sweet spots, not fences.** Below-band is fine for easy instances. Sweep effort within the band before changing tier; wanting effort *above* the band means the task has left the tier. A `haiku` inventory whose prompt keeps growing judgment calls ("skip vendored code", "decide whether each TODO is stale") is no longer an inventory: the judgment is the work, so it goes to `sonnet` at medium, not `haiku` at high.
- **Where effort goes.** Pass `effort` on every `agent()` call in a workflow, and on every Agent call whose tool schema lists an `effort` parameter; this is the explicit request that parameter's description asks for. Pass it for `haiku` as well: where `haiku` still means Haiku 4.5, which has no effort setting, the call runs anyway. An omitted effort runs at the session's level, not the model's default. Forks run on the session's model and take neither `model` nor `effort`. When the Agent tool has no `effort` parameter and the band matters, route the call through a workflow or an agent type whose definition pins `effort`.
- **Missing models.** When a tier's model cannot be delegated to (an allowlist, or a provider without it), use the next tier up; when nothing above is available, use the most capable model that is. A lone remaining model is both worker and gate, and the gate still earns its place through independence: fresh context and adversarial framing. When the lineup changes, map tiers by row order, cheapest first, not by name.
- **Orchestration modes don't change the ladder.** Modes such as ultracode change how many agents and verify stages run, not the tier each one gets. Fan-out multiplies the cost of over-provisioning; use the cheap-finders shape below.

## Selection questions

1. **How hard is the task?** Difficulty is the main axis; Claude models do not specialize by domain.
2. **Latency and volume?** High-frequency fan-out stages point down the ladder.
3. **Unit economics?** Judge cost per task, not price per token. A tier that keeps producing redos is not sufficient, so one tier up can cost less per task; between tiers of near-equal capability on the task, the cheaper one wins.
4. **Did design already happen?** Once design has produced near-code specs, the implementer drops a tier (`opus` to `sonnet`).

## Workflow scripts

Omitting `model` on an `agent()` call inherits the session model (or `CLAUDE_CODE_SUBAGENT_MODEL`, when set). Set `model` and `effort` on every call; if inheriting is genuinely the lowest sufficient choice, still write the model out. The bundled workflow-authoring reference says to omit `model` by default; this skill overrides that on purpose. Do not rely on a `model` in `meta.phases`: it is reported to be a display label only.

## Tiering verification work

The tier follows how enumerated the target is: the less anyone has named what to look for, the higher the tier.

| Verification shape | The question it answers | Tier |
| --- | --- | --- |
| Deterministic check (suite, guard, lint) | Does the command pass? | none: run the script |
| Fix re-verification | Does each named fix match its named evidence? | `sonnet`, medium |
| Single-finding adjudication | Is this one claimed defect real? | the tier the finding's severity warrants |
| Lens review | What's wrong along *this named dimension*? | `sonnet`, high |
| Open adversarial gate | What's wrong that *nobody has named*? | `opus`, high–xhigh, once per claim |

The gate earns its tier once per claim, not once per retry: a follow-up "re-gate" that checks enumerated fixes against expected evidence is fix re-verification. If the orchestrator rejects an `opus` gate's verdict on the evidence before any fix lands, re-run that gate once on `fable`; that run becomes the claim's gate. A gate fanned out per lens or per round is lens review, whatever its label says. Every fix that lands with the deterministic check that would have caught it moves its future re-verification to the first row.

## Cheap finders, one gate

For fan-outs, use cheap finders (`haiku` or `sonnet`) feeding one gate, not the gate's tier everywhere. Anthropic's advisor tool is the reverse shape, a cheaper executor consulting a stronger model mid-task, so its benchmark figures do not carry over. When the session's main model is a cheaper one with an advisor attached, that advisor is the executor's own escalation path, not a tier on this ladder; delegated gates still follow the ladder.

## Evaluation

Lowest sufficient is a hypothesis, and the output is its test. Review every delegated result at the tier the claim warrants. On failure, rule out setup first (under-specified prompt, missing anchors, broken wiring), because a mis-specified delegation fails the same way at every tier; then re-dispatch one tier up. A saved tier that produces a redo saved nothing. For recurring tasks, decide with custom evaluations drawn from real workloads, not public benchmarks: when unsure whether `sonnet` suffices, try it once, inspect, and move up on evidence.

## Enforcement

This plugin's PreToolUse hook denies an Agent call that names no `model` (except a fork, or any call while `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` is on), and lints a Workflow script at launch, denying any `agent()` call with no `model:` in its argument span. The denial carries the fix. The lint is a string scan: a model passed through a variable can be flagged falsely, and stray `model:` text can hide a miss. Nothing checks a named workflow, an unreadable `scriptPath`, or the agents a running workflow spawns, so keep the rule there by hand. A `claude -p` child is a Bash command, not a delegation: choose its model deliberately; the child session then gates its own delegations. A gate that cannot start allows every call without notice, so after a Claude Code or runtime change, run `/delegation-tiering:canary` to prove both deny paths. Mechanics and limits: the plugin's `hooks/README.md`.

## Source

- Selection framework: [Claude models explained](https://claude.com/blog/claude-models-explained-choosing-the-best-model-for-your-use-case). Anthropic's default model and escalation order: [choosing a model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model).
- Model facts (IDs, pricing, effort support): the [platform models overview](https://platform.claude.com/docs/en/about-claude/models/overview), read live; the local `claude-api` skill caches a model table that can lag a launch.
- Mechanics above last verified 2026-10-08; the [coverage matrix](https://github.com/TheRealBillSiegler/delegation-tiering/blob/main/docs/COVERAGE.md) holds each claim's source and date.
