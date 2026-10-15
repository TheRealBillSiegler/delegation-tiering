# Protocol: Phase 2 full run, the with/without trial on non-obvious tasks

Status: frozen 2026-10-09 before any data. Its SHA-256 is recorded in the program README and in the commit that adds it; any later change voids this registration and gets a new attempt number.

## Question

On delegation tasks where the right tier is not obvious, does the plugin (skill and gate) change the model and effort an Opus orchestrator names, beyond what the steering text alone produces, and does it move those choices toward the skill's own ladder?

The labels below come from the skill's text. Agreement with them measures whether the plugin transmits its doctrine; it does not show that the doctrine is right, which is Phase 4's question.

## Setups

The four setups of the pilot, unchanged: A nothing, B steering text only, C plugin only, D both. The steering text is the owner's rule file plus lines 7, 8, and 16 of the owner's CLAUDE.md, delivered through `append_system_prompt`. Plugin under test: version 0.1.3, whose shipped files are identical to commit `db5e297`; this program changes none of them.

## Harness

- `claude plugin eval`, Claude Code 2.1.295, orchestrator pinned with `--model claude-opus-5-5`, effort `xhigh` through `CLAUDE_CODE_EFFORT_LEVEL=xhigh` to match the owner's sessions, with the parent session's variables removed as in `run-eval.sh`.
- `allowed_tools: [Agent, Skill, Read, Glob, Grep]` in every case, and `--allow-tools Workflow` on every invocation, so every case can use either delegation path.
- 40 cases: 20 tasks × {without text, with text}. Case directory names are opaque (`c01` to `c40`); the mapping from case to task and condition lives outside the repo, so no path the orchestrator sees names the condition. Each case carries its own copy of the fixture (the plugin repo at `db5e297`) under a neutral directory name.
- `max_turns: 15`, `timeout_seconds: 900`, 3 runs per arm.

## Tasks

`<fx>` stands for the case's fixture path. Each label is the set of answers the skill accepts: models, and the effort band. Effort below the band counts as agreement for the model and is reported separately; effort above the band does not agree.

| ID | Prompt | Label | Skill rule tested |
| --- | --- | --- | --- |
| T01 | Use a subagent to list every file under `<fx>/docs` with its length in lines. | haiku; medium, low allowed | haiku row, inventory |
| T02 | Have a subagent tell me the version string in `<fx>/.claude-plugin/plugin.json`. | haiku; low or medium | haiku row, short item |
| T03 | For each Markdown file under `<fx>/docs`, have a separate subagent return its first heading, in parallel. | haiku; low | haiku row, short high-volume items |
| T04 | Have a subagent go through `<fx>/docs/ROADMAP.md` and decide, item by item, whether `<fx>/CHANGELOG.md` shows it already done. | sonnet; medium | judgment creep leaves the haiku row |
| T05 | Have a subagent copy out, word for word, every row of the verification-shape table in `<fx>/skills/delegation-tiering/SKILL.md`. | haiku; medium, low allowed | haiku row, verbatim extraction |
| T06 | Have a subagent convert the first table in `<fx>/docs/COVERAGE.md` to CSV and give me the CSV. | haiku; medium, low allowed | haiku row, format conversion |
| T07 | Delegate this: using only the files in `<fx>`, explain how the ledger file path is resolved and which environment variables change it. | sonnet; medium | sonnet row, doc research |
| T08 | Delegate this: read `<fx>/hooks/agent-model-gate.js` and `<fx>/hooks/README.md`, and list every place the README's description disagrees with the code. | sonnet; medium | sonnet row, fidelity check |
| T09 | Three fixes were claimed for this release: forks are allowed with a note; CLAUDE_CODE_SUBAGENT_MODEL_FORCE accepts 1, true, yes, and on in any case; the drift check keeps nested page paths. Have a subagent confirm each one against the code in `<fx>` and report pass or fail per fix. | sonnet; medium | fix re-verification |
| T10 | Get a subagent to review `<fx>/scripts/check-links.js` for error handling only. | sonnet; high | lens review |
| T11 | Design is settled: add a `--json` flag to `<fx>/scripts/check-version-bump.js` that prints `{ok, from, to, changed}` instead of text. Have a subagent write the patch as a unified diff in its reply, without editing files. | sonnet; high | implementation from near-code design |
| T12 | Last round's open review of `<fx>/hooks/agent-model-gate.js` found two issues, and both are now fixed: forks are allowed with a note, and the FORCE variable accepts every documented on-value. Run the round-2 re-gate: have a subagent check that those two fixes are in place. | sonnet; medium | a re-gate of named fixes is fix re-verification |
| T13 | Before I ship this, I want an independent adversarial review of `<fx>/hooks/agent-model-gate.js`: whatever is wrong that nobody has listed yet. Use a fresh subagent so it isn't anchored on this conversation. | opus; high or xhigh | open adversarial gate |
| T14 | Before we publish, have a subagent assess whether a crafted Workflow script or tool input could make `<fx>/hooks/agent-model-gate.js` allow a model-less delegation, or crash it in a way that disables the gate. | opus; high or xhigh | security-boundary read |
| T15 | Have a subagent propose two or three designs, with trade-offs, for how `<fx>/hooks/delegation-ledger.js` should record the resolved model and the effort of every delegation, workflow workers included. | opus; high or xhigh | open-ended design |
| T16 | Have a subagent work out, with an argument or a counterexample, whether `lintScript` in `<fx>/hooks/agent-model-gate.js` can both miss a model-less call and flag a model-bearing call in the same script. | sonnet; high, or opus; medium to xhigh | reasoning-heavy work; opus only where sonnet falls short, so either agrees |
| T17 | An opus review at xhigh effort of `<fx>/hooks/agent-model-gate.js` already ran and missed a masking defect that a mutation test found later. Get a stronger independent review of the lint logic. | fable; high or xhigh | escalation after an opus xhigh attempt fell short |
| T18 | `<fx>/hooks/hooks.json` ships to every user's machine as production configuration. Have a subagent do the final adversarial review before release. | opus; high or xhigh | the skill's production-config gate example |
| T19 | Write and launch a workflow with the Workflow tool: one finder per file in `<fx>/scripts` looking for unhandled errors, then a single agent that verifies the combined findings. | finders haiku or sonnet; the verifier opus, high or xhigh; every call names a model and an effort | cheap finders, one gate; workflow scripts |
| T20 | Launch a workflow with the Workflow tool: three reviewers of `<fx>/skills/delegation-tiering/SKILL.md`, one per lens (accuracy against `<fx>/hooks`, clarity, internal consistency), then one agent that merges their findings. | lens reviewers sonnet, high; the merger sonnet or opus; every call names a model and an effort | per-lens gates are lens review; workflow scripts |

## Measurement

Each run's transcript is parsed by code. For an Agent call: `model` and `effort` from the tool input, and whether a hook denied it. For a Workflow launch: each `agent()` call's `model` and `effort` literals from the script text. The scored unit is the run's first delegation, the first Agent call or Workflow launch, whichever comes first; the final allowed delegation is scored too. A run that does not delegate scores as a non-match and is counted separately. An omitted model on an Agent call scores as the session model, `opus`, inherited at the session effort, `xhigh`.

## Endpoints

Primary, two, each tested at two-sided α 0.05:

1. **Plugin beyond the text (D versus B).** Per task, the share of runs whose first-delegation model agrees with the label, in D minus in B. Test: exact sign-flip permutation test over the 20 task-level differences. Report the mean difference with a 95% bootstrap interval over tasks.
2. **Text versus nothing (B versus A).** Per task, the share of runs whose first delegation names a model, in B minus in A. Same test. This replicates the pilot.

Secondary, Holm-corrected as a family: effort agreement, D versus B; model agreement, C versus B; over-provisioning (model above the label) and under-provisioning (model below the label) per setup; gate denials per setup; Skill invocation in C and D; delegation rate per setup. Descriptive only: cost per session per setup (mean, median, bootstrap interval over tasks), and per-task tables.

## Decision rules

- **The plugin transmits doctrine the text does not:** endpoint 1 is significant and positive. Keep the skill, and name the tasks that drive the difference.
- **No material difference:** endpoint 1 is not significant and its 95% interval lies within −0.15 to +0.15. Recommend shrinking the skill toward what the text already carries, keeping the sections whose rules the text lacks. Effort agreement is reported beside this, but does not change it.
- **Inconclusive:** endpoint 1 is not significant and its interval reaches past ±0.15. Report it as inconclusive at this size, and make no recommendation about the prose.
- **The plugin moves choices away from its labels:** endpoint 1 is significant and negative. Investigate before any other decision.
- The gate's keep-or-drop decision is not made here; this run reports denials as data for it.

## Size, budget, and stopping

- 20 tasks × 4 setups × 3 runs = 240 sessions. Twenty tasks is the budget-bound size. A shift that holds on most tasks is detectable; a small shift is not, which is why the decision rules include an inconclusive outcome.
- Batch 1 is one run per arm, 80 sessions. If batch 1's mean cost per session projects the full run above $150 in list price, stop after batch 1 and report before running more. Otherwise run batches 2 and 3.
- Hard ceilings: `--max-cost-usd 60` per batch, $10 for smoke tests, and $160 in total.

## Records

Raw results, kept transcripts, the case-to-task key, and parsed rows go to the owner's private data directory. The repo gets the case generator, the analysis script, and aggregate results. Kept temp directories are deleted after their transcripts are copied out. Every deviation from this protocol is recorded in the results with its reason.
