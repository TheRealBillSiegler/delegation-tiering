p# Proposal record: advisor findings into the plugin, 2026-09-03

Status: proposed, nothing applied. Each release below is one PR. Date each item here as it lands, so this file stays the single account of what was planned and what shipped.

Tracked on GitHub, filed 2026-09-03: live tests [#11](https://github.com/TheRealBillSiegler/delegation-tiering/issues/11); rulings on versioning [#12](https://github.com/TheRealBillSiegler/delegation-tiering/issues/12) and PR base branch [#13](https://github.com/TheRealBillSiegler/delegation-tiering/issues/13); release 0.1.2 [#14](https://github.com/TheRealBillSiegler/delegation-tiering/issues/14); release 0.3.0 [#15](https://github.com/TheRealBillSiegler/delegation-tiering/issues/15); the routing-impact study [#16](https://github.com/TheRealBillSiegler/delegation-tiering/issues/16); the guidance release [#17](https://github.com/TheRealBillSiegler/delegation-tiering/issues/17); release 0.4.0 [#18](https://github.com/TheRealBillSiegler/delegation-tiering/issues/18). The study is filed ahead of the guidance release on purpose: its verdict should decide whether more skill prose is added at all.

Where it came from: the blog sweep and live experiments recorded in [claude-blog-sweep-2026-09-03.md](claude-blog-sweep-2026-09-03.md), then an adversarial review pass over a first draft on 2026-09-03 (three lens reviews on the balanced tier at high effort, one open gate on the top tier). The draft and the review transcripts are session-ephemeral and are not cited; everything load-bearing from them is reproduced here. That record's own "Proposals arising" section is superseded by this file.

## Why this order

Corrections first, with the records that back them. New guidance second, once the records are in the repo to cite. Observability third, and nothing is built on a hook field until that field has been tested on the path the hook claims to cover. Every item names its evidence tier under the repo's anchoring policy: article digest, doc page, or dated live test.

## Evidence this rests on

| Claim | Where it is recorded | Tier |
| --- | --- | --- |
| A session advisor is inherited by Agent-tool foreground and background subagents and by Workflow `agent()` spawns whose model passes the pairing check | Sweep record, "Live experiments", E2, E5, E6 | Live, 2026-09-03, Claude Code 2.1.248 |
| A saved `advisorModel` runs silently with no advisor under allowlist exclusion and an invalid pairing; the kill switch and feature-flag-off were silent with the `--advisor` flag and were not tested with a saved setting; CLI validation of the flag is loud for an invalid model, an invalid pairing, and an allowlist exclusion | Sweep record, E3a, E3b, E3c, E7, E8, E8b, E9, and the "Reading" paragraph | Live |
| Each consult is an uncached advisor-rate read of the delegate's context: seven subagent consults averaged 35,835 input and 5,989 output tokens for an empty task on one machine; the main-session consult was the outlier at 61,373 in | Sweep record, "Per-consult cost, observed" | Live, one machine |
| SubagentStop input carries `agent_transcript_path`, `agent_id`, `agent_type`, and `effort.level`; PostToolUse for Agent carries `tool_response.resolvedModel`, `usage`, `totalTokens`, `totalDurationMs` on completed foreground responses and `resolvedModel` with `async_launched` on background ones | Sweep record, "Hook fields observed (E4)" | Live, docs-silent |
| The advisor consult itself fires no hook; it is server-side inside one request | Sweep record, same table; anthropics/claude-code#70611 | Live |
| The advisor tool is the inverse of this plugin's shape: executor consults a stronger model mid-loop, versus a stronger orchestrator delegating to cheaper workers. The advisor doc page's compare table lists "Subagents with `model` set" as the sibling row | <https://code.claude.com/docs/en/advisor> (experimental page) | Doc page |
| The migrations post calls the orchestrator shape "an advisory pattern" and says to save the largest model for reviewers and for anything that writes rules other agents will follow | Sweep record, migrations post digest | Article |
| Model-versus-effort diagnostic: had the context, tried, still wrong means a bigger model; skipped a file or bailed partway means more effort | Sweep record, model-and-effort post digest | Article |
| Delegate-at-all gates: context pollution, parallelization, specialization; state-lossy handoffs; sequential subagents cost without speed | Sweep record, multi-agent, commerce, and coordination post digests | Article |
| Cost per solved task on SWE-bench Pro: Fable 5.1 at low effort $0.54, Sonnet 5 at default $0.84 | Platform cost-and-intelligence doc, single benchmark; figures were rendered by a fetch summarizer, re-read the page before quoting them in the payload | Doc page |
| Zero organic gate denials since 2026-08-16 across about 170 delegations; 4 possibly organic denials in total, all during the build period | Sweep record, "Local ledger read" | Live |

## Release 0.1.2, corrections and records

Payload edits, confined to the skill and the plugin README:

- Rename the skill section `## Advisor pattern` ([SKILL.md:59](../../skills/delegation-tiering/SKILL.md)) to the finders-plus-gate shape, for example "Cheap finders, top-tier gate". Add one disambiguation sentence: Anthropic uses "advisor" two ways; the migrations post calls a top model directing cheaper executors "an advisory pattern", which is this plugin's shape, while the platform's advisor tool and advisor strategy mean an executor consulting a stronger model mid-loop, the inverse. Cut the SWE-bench Pro advisor figure at line 61; it benchmarks the advisor tool, not this shape.
- Fix the cross-reference in the Orchestration-modes bullet ([SKILL.md:31](../../skills/delegation-tiering/SKILL.md), "the advisor pattern below").
- Withdrawn 2026-09-11: the earlier draft of this list said to fix the Source line at SKILL.md line 88 for crediting the models-explained post with "the advisor figure". Re-fetched 2026-09-11, that post does contain the figure ("on SWE-bench Pro Sonnet 5 with a Fable 5 advisor is within 10% of Fable 5's score at 63% of the price"), and the sweep record at its line 588 already said so. The attribution is correct; only the use of the figure for the finders-plus-gate shape is wrong, which the line-59 edit above covers. Issue #14 still lists the withdrawn item and needs a correcting comment.
- Condition the scope line ([SKILL.md:10](../../skills/delegation-tiering/SKILL.md)): when the session model is the top tier, tier bottom-up; when the session runs a cheaper main model with an advisor, the advisor is the executor's escalation, not a rung, and delegated gates still go to the most capable model available. No cost figures in this line.
- Apply the same conditional to the Design rationale's opening premise in [README.md:85](../../README.md), and replace "That structure is the article's own advisor strategy generalized across the ladder" with the advisor page's compare-table framing: this plugin implements the "Subagents with `model` set" row; the advisor tool is the sibling row.

Repo-side, same PR:

- Commit [claude-blog-sweep-2026-09-03.md](claude-blog-sweep-2026-09-03.md) and this file; list both in the research row of [docs/README.md](../README.md).
- Relabel row 8 of [evals/scenarios.md](../../evals/scenarios.md) from "advisor pattern" to the new section name.
- Append dated rows to [COVERAGE.md](../COVERAGE.md): advisor inheritance into Agent-tool, background, and workflow-internal spawns (live, E2, E5, E6); silent non-attachment under a saved `advisorModel` (live, E8b, E9); PostToolUse `resolvedModel` presence (docs-silent, live, E4); on dependency A11, the observation that SubagentStop reported `effort.level` `xhigh` for an Agent-tool subagent, the session's level, one run. Add a dependency row for the advisor doc page, marked experimental: its withdrawal is a drift outcome whose remediation is removing the dependent prose. The `agent_transcript_path` row waits for 0.4.0, with the hook that depends on it.
- Refresh [scripts/anchors.json](../../scripts/anchors.json) with check-drift's update mode so the advisor page joins the watch.
- Add the withdrawn-experimental-page case to [REMEDIATION.md](../REMEDIATION.md).
- Add the three entries under "Roadmap entries" below to [ROADMAP.md](../ROADMAP.md).
- Reword the drift task as on-demand, not scheduled: the owner unregistered the Windows task on 2026-09-10 (it had pointed at the deleted monorepo path since the split and failed every Monday). Lines that say scheduled or weekly: scripts/README.md lines 3, 7, 15, 22; docs/REMEDIATION.md lines 7, 11, 16, 19, 22; docs/COVERAGE.md row A5; docs/ROADMAP.md line 10; README.md line 59. The script header keeps its registration snippet as an option.
- CHANGELOG entry and the version field in `.claude-plugin/plugin.json` to 0.1.2.

Checks before the PR: the gate's self-test, the contract suite, check-links, check-version-bump, and the scenario evals because skill prose changed. No hook changes, so the live probe is optional.

## Release 0.2.0, new skill guidance

- New skill section on the native advisor, four sentences, hedged and dated. One: a session advisor set with the `--advisor` flag is inherited by every Agent-tool subagent, background subagent, and Workflow `agent()` spawn whose model passes the pairing check (live 2026-09-03, Claude Code 2.1.248, E2, E5, E6); `/advisor` and a saved `advisorModel` share the mechanism but were not tested for inheritance. Two: each consult is an uncached, advisor-rate read of the delegate's full context, about 36K input and 6K output tokens for an empty task across seven subagent consults on one machine, growing with the transcript, with no cap or force setting, so the prompt has to say whether to consult. Three: a configured advisor is not proof one attached; a saved `advisorModel` ran silently with no advisor under allowlist exclusion and an invalid pairing, and the kill switch and feature-flag-off were silent with the flag (E3b, E7), untested with a saved setting. Four: a delegate reporting "advisor approved" does not discharge the top-tier gate, and never downgrade a tier on the assumption an advisor rides along. No canary reference until 0.4.0 exists. The per-condition loud-versus-silent table stays in the COVERAGE row and the sweep record, not the payload.
- Fourth top-tier category, "rules or specs other agents will follow", in the ladder row at [SKILL.md:22](../../skills/delegation-tiering/SKILL.md). This also changes the derived ladder string in [hooks/tiers.js](../../hooks/tiers.js), so the denial text and the contract suite's README-drift guard change with it; update fixtures that assert on the category list.
- Hedged ladder row between the balanced-high and reasoning-high rows: top tier at low effort, for hard, checkable work where balanced-high demonstrably falls short; judged by cost per solved task, not per token, with the single-benchmark figure above. State that the row is reachable only where effort is per-call, meaning Workflow `agent()` or a definition-pinned agent type, since direct Agent calls inherit session effort. Add the model-versus-effort diagnostic beside it.
- Rung zero, "delegate at all?", placed before the ladder table because only the top of the file reliably re-attaches after compaction: the three-scenario gate (context pollution, parallelization, specialization), the state-lossy handoff warning, the sequential-subagents cost-without-speed warning, and the fixed per-delegation context cost, about 36K tokens written before any work, labelled one machine, one run.
- Four new rows in [evals/scenarios.md](../../evals/scenarios.md), one per new durable rule: rung zero; top tier at low effort via a workflow; rules other agents will follow; no downgrade under an advisor. Re-baseline.
- Source section additions: the model-and-effort post and the migrations post.
- README Sunset criterion addendum: anthropics/claude-code#73072 and #91715 (a per-subagent advisor field) retire the advisor section and, later, the consult hook.
- CHANGELOG entry and version 0.2.0.

Open until the scenario runs: whether the top-tier-at-low-effort row survives against the "Top-tier categories ONLY" cell at line 22, or that cell becomes "high to xhigh: categories only; low: see row above".

## Release 0.3.0, ledger raw fields

- [hooks/delegation-ledger.js](../../hooks/delegation-ledger.js) records, when present in the Agent PostToolUse `tool_response`: `resolvedModel`, `usage` (input, cache creation, cache read, output), `totalTokens`, `totalDurationMs`. Also `background`, from `tool_input.run_in_background`, so a null-usage background entry is a labelled case rather than a silently absent field. No mismatch flag in the hook.
- Contract fixtures for three response shapes: fields present, fields absent, `async_launched`.
- [scripts/live-probe.js](../../scripts/live-probe.js) asserts that `resolvedModel` lands on the allow path.
- Weekly summary, repo apparatus with no version bump of its own: cost per delegation by tier at list prices, and requested-versus-served mismatches derived from `model` against `resolvedModel`. Contract-test the derivation against fixture strings for all four model families; only the sonnet alias was observed live.
- CHANGELOG entry and version 0.3.0.

Gated by live test 3 below, which decides whether background delegations are documented as permanent-null cost entries.

## Release 0.4.0, advisor consult observability, blocked on live tests 1 and 2

- New SubagentStop hook, `async`: read `agent_transcript_path` and fail open if absent; count `server_tool_use` blocks named `advisor`; sum the `advisor_message` iteration input and output tokens and record the advisor model; record `effort.level`; append one ledger line keyed by `agent_id`. State the in-charter reason in the hooks README: consults are a per-delegation cost invisible to the gate and the ledger, and the ledger exists to make tier choices, including their cost, reviewable.
- COVERAGE rows for the SubagentStop fields `agent_transcript_path` and `effort`, docs-silent, and a cell for workflow-spawn reachability per test 1.
- Weekly summary: advisor consult rate, advisor tokens, effort distribution; labelled Agent-tool-only if workflow spawns stay unreachable.
- Canary advisor step in `commands/canary.md`: spawn one `model: sonnet` subagent with the probe prompt below and assert on the ledger line this hook writes, never on a transcript or the subagent's self-report. If the in-session command cannot locate the ledger (test 4), the step becomes an advisor mode of the live probe using its temp-redirected ledger, and the skill never points at the canary.
- The 0.2.0 no-downgrade sentence may then reference the canary.
- CHANGELOG entry and version 0.4.0.

## Live tests that gate 0.3.0 and 0.4.0

| Test | Method | If yes | If no |
| --- | --- | --- | --- |
| 1. SubagentStop fires with `agent_transcript_path` and `agent_id` for `agent()` spawns inside a running Workflow | Headless run with the hook-dump settings below and the workflow probe script | 0.4.0 covers workflow spawns | COVERAGE records the gap, as A8 does for PreToolUse; advisor aggregates are labelled Agent-tool-only |
| 2. `async: true` is honored for SubagentStop, and the transcript parse adds no completion latency | Time subagent completion with and without the hook | The hook parses inline | The hook does a tail read only; token summation moves to the weekly batch |
| 3. PostToolUse re-fires with populated `usage` when a background Agent completes | E4 setup with one background spawn, wait for completion | Background cost is recorded | Background entries are documented as permanent-null cost |
| 4. An in-session slash command can locate the ledger file, since the model cannot expand `${CLAUDE_PLUGIN_DATA}` | Try from the canary command | Canary advisor step lands | Live-probe advisor mode instead |

### Results, 2026-09-03

All four ran on 2026-09-03, headless, Claude Code 2.1.248, `--model sonnet`, one run each unless stated. Raw hook logs and transcripts lived in the session scratchpad and are gone with it; the numbers below are what survives. The release sections above were written before the runs; where they differ, this table governs.

| Test | Result | What was seen | Consequence |
| --- | --- | --- | --- |
| 1 | Yes | SubagentStop fired for the workflow spawn with `agent_id`, `agent_type: workflow-subagent`, `agent_transcript_path` under `subagents/workflows/<run>/`, and `effort.level: low`, the per-call value. The transcript held one `server_tool_use` block named `advisor`, an `advisor_tool_result` block, a `usage.iterations` entry of type `advisor_message` (33,659 in, 773 out), and a top-level `advisorModel` key on every assistant line. PreToolUse fired for the Workflow call itself, not for the inner `agent()`, as A8 records. | 0.4.0 covers workflow spawns. |
| 2 | Yes | With `async: true` and an 8 s sleep inside the hook, PostToolUse for the Agent call arrived 1.35 s after SubagentStop was received, 6.7 s before the hook finished. The sync control held PostToolUse until after the sleep and inflated the subagent's reported `totalDurationMs` from 2,083 to 10,571. | The hook parses inline and stays async; a sync SubagentStop hook would distort the duration field 0.3.0 records. |
| 3 | No, three runs | One PostToolUse only, `status: async_launched`, no `usage`, no second firing on completion. Seen with the main session idle (this run and the earlier E4 run) and with the main session mid-turn inside a 15 s Bash call while the agent finished. But SubagentStop fired for the background agent with its transcript path, and the transcript carries `usage` per assistant message. | 0.3.0 records background cost as null. 0.4.0's SubagentStop hook can fill it from the transcript, so "permanent-null" is withdrawn. |
| 4 | Yes, by substitution | `${CLAUDE_PLUGIN_DATA}` and `${CLAUDE_PLUGIN_ROOT}` written literally in a plugin command body were replaced with absolute paths before the model saw the text. Neither variable reached the model's Bash tool or a command's `!` shell preprocessing, though the same plugin's SessionStart hook saw both. Verified with a `--plugin-dir` plugin whose data directory was `ledger-probe-inline`; the installed plugin's is `delegation-tiering-siegler-plugins`, so the name follows `<plugin>-<marketplace>`. | The canary advisor step lands and names the ledger as `${CLAUDE_PLUGIN_DATA}/delegation-ledger.jsonl` in the command text. Not yet verified on a marketplace-installed plugin; the 0.4.0 canary is that check. |

Three side findings from the same runs:

- An async SubagentStop hook is not awaited at session exit. With no Stop hook holding the process open, the headless session ended about 7 s after the hook started its 8 s sleep and the hook's completion line never appeared. The 0.4.0 hook must read the transcript and append its ledger line immediately, with nothing deferred; parse and append are millisecond work, so this is a design constraint, not a blocker.
- A probe prompt with no stated purpose ("run echo on these variables, then glob this directory") was refused by Sonnet 5 as a possible exfiltration attempt. The canary step's subagent prompt must say what it is for.
- Agent-tool subagents carried `effort.level: xhigh`, the session value; the workflow spawn carried the `low` passed per call. This is the A11 evidence the review pass pointed at. A "reply OK" delegate with no advisor cost 33,851 tokens, almost all cache creation.

Headless gotcha for re-runs: `--allowedTools` is variadic and swallows a trailing prompt argument with "Input must be provided either through stdin or as a prompt argument". Put the prompt right after `-p`. For the timing test, the dump script takes a fourth argument, a sleep in milliseconds, and appends a second line with `phase: done` after it; compare the PostToolUse receipt time to that line.

Reproduction, so the tests can be re-run after the session scratchpad is gone. Every 2026-09-03 run was headless from a scratch directory, with the nested-session guard variables cleared:

```sh
env -u CLAUDECODE -u CLAUDE_CODE_ENTRYPOINT claude -p --model sonnet --advisor sonnet --output-format stream-json --verbose --settings "$(cat settings.json)" "$(cat prompt.txt)"
```

Transcripts land under `~/.claude/projects/<cwd-slug>/<session-id>/subagents/agent-*.jsonl` for Agent-tool subagents and `.../subagents/workflows/<run>/agent-*.jsonl` for workflow spawns.

The probe prompt given to each subagent:

```text
You are a probe. Do not read or write any files. Do not run any commands. Do not use any tool except the one named advisor, if it exists. Answer these steps in order.

Step 1. Look at your tool list. Is there a tool named advisor? Write ADVISOR_PRESENT=yes or ADVISOR_PRESENT=no.

Step 2. If present, call the advisor tool exactly once now, with no parameters. Then write the result you received verbatim inside a fenced code block, including any error text, decline text, or unavailable message. If the call produced no readable text, say so.

Step 3. Write one final line exactly in this format and nothing after it:
PROBE ADVISOR_PRESENT=<yes|no> ADVISOR_CALLED=<yes|no> ADVISOR_OUTCOME=<advice|declined|error|unavailable|not_present>
```

The workflow probe, passed to the main session as "use the Workflow tool exactly once with this script and return its value verbatim":

```js
export const meta = { name: 'advisor-wf-probe', description: 'probe whether a workflow agent has the advisor tool' }
const PROBE = '<the probe prompt above>'
return await agent(PROBE, { model: 'sonnet', effort: 'low', label: 'wf-probe' })
```

The hook-dump script, `dump-hook.js`, appends one JSON line per hook invocation:

```js
const fs = require('fs');
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  let input = null;
  try { input = JSON.parse(raw); } catch { input = { raw }; }
  fs.appendFileSync(process.argv[3], JSON.stringify({ event: process.argv[2], input }) + '\n');
});
```

The settings passed with `--settings`, one exec-form entry per event; the PostToolUse entry carries `"matcher": "Agent"`:

```json
{ "hooks": { "SubagentStart": [ { "hooks": [ { "type": "command", "command": "node", "args": ["<abs>/dump-hook.js", "SubagentStart", "<abs>/hooks.jsonl"], "timeout": 10 } ] } ],
             "SubagentStop":  [ { "hooks": [ { "type": "command", "command": "node", "args": ["<abs>/dump-hook.js", "SubagentStop",  "<abs>/hooks.jsonl"], "timeout": 10 } ] } ],
             "Stop":          [ { "hooks": [ { "type": "command", "command": "node", "args": ["<abs>/dump-hook.js", "Stop",          "<abs>/hooks.jsonl"], "timeout": 10 } ] } ],
             "PostToolUse":   [ { "matcher": "Agent", "hooks": [ { "type": "command", "command": "node", "args": ["<abs>/dump-hook.js", "PostToolUse", "<abs>/hooks.jsonl"], "timeout": 10 } ] } ] } }
```

### Two-arm outcome check, 2026-09-03

The question: does haiku deserve the mechanical work the ladder gives it? Taken from the ledger's largest tier miss, the 08-24 itemize fan-out of 53 sonnet calls plus 12 retries over the user's own chat archive in `workbench/data/explicit/`.

What the original run showed before any new spend:

- Counted from the surviving subagent transcripts under `~/.claude/projects/c--Users-billy-source-repos-workbench/1dcc20bc-6dab-4ba3-920c-b399c4fa9e02/subagents/`, files dated 2026-08-24. The retries were not sonnet failing. Three spawns hit the 20-subagent concurrency cap and seven were blocked by the auto-mode classifier on the Agent call itself.
- 13 of 41 subagent transcripts were refusals, before reading the file in most cases. They split between content refusals and "context mismatch" refusals: the fan-out ran from the conference-talk repo and pointed at a different repo's data, and the subagent treated the task as untrusted. One batch named a file that does not exist.
- The single-file batches ran at inherited `xhigh` on 200 to 430 KB files and used a median 2.2M tokens each, almost all cache reads from chunked reading.

Design: six files from the same directory, three mundane and three kink, 15 to 53 KB, each itemized once at haiku and once at sonnet with effort `medium` and the original prompt verbatim with one file listed. One blind Fable judge per pair, order alternated by index, reading the source file, grading refusal, format, coverage 1 to 5, and listed errors. Usage from the workflow transcripts. Run as one Workflow; script and results in the session scratchpad, gone with it.

| File | KB | Winner | haiku coverage, format, errors | sonnet coverage, format, errors |
| --- | --- | --- | --- | --- |
| Acura TSX frame repair | 16 | sonnet | 4, ok, 0 | 5, ok, 0 |
| Edging vs PE training | 15 | sonnet | 4, ok, 2 | 5, ok, 0 |
| Getting most from Claude | 27 | haiku | 4, ok, 0 | 4, broken, 1 |
| Daily wear of chastity cage | 36 | sonnet | 3, broken, 4 | 4, ok, 3 |
| Healthy cannabis use | 49 | unjudged, judge blocked by the safety classifier | type ok, 5 bullets | type line holds two values |
| Visible cage activities | 53 | sonnet | 3, broken, 6 | 4, ok, 4 |

Cost and time, six files per arm, usage summed from transcripts:

| Arm | Refusals | Total tokens | Output tokens | Wall time | List price, assumed rates |
| --- | --- | --- | --- | --- | --- |
| haiku, medium | 0 of 6 | 838K | 5.7K | 80 s | about $0.43 |
| sonnet, medium | 0 of 6 | 1,080K | 3.1K | 83 s | about $1.58 |
| Fable judge, 5 pairs | | 1,890K | 17K | 268 s | more than both arms together |

Reading:

- Haiku completed and formatted every file with no refusals, at roughly a quarter of sonnet's price and the same wall time. That is the case for the ladder's haiku row.
- The blind judge preferred sonnet on four of five pairs. On the two small files both arms were accurate and sonnet was more complete. On the two larger kink files haiku's coverage fell to 3, its format broke, and its error count rose, while sonnet held format with three to four errors of its own. Haiku won the one pair where sonnet broke the format.
- The pattern is size, not content: haiku held up to about 27 KB and degraded at 36 KB and above. A size-conditional haiku rule is the hypothesis this suggests for the study, not a skill change from six files.
- Neither arm refused, against 13 refusals in 41 for the original run. Effort, agent type, and launch context all differ from the original, so the cause is not isolated.
- "Lowest sufficient" is the owner's bar. For an archive inventory, haiku's output would need a format check with retry, or sonnet above the size threshold.

Limits: six files, one run, one judge model, and the judge was blocked on one mundane file. Dollar figures use assumed list rates and must be re-priced before quoting. Haiku transcripts carry no effort field, so the medium setting may not have applied to that arm.


## Claims audit, 2026-09-11

Method: seven files (the skill, README, hooks README, COVERAGE, this record, the blog sweep, and the bodies of issues #11 to #18) were split into 567 atomic claims. Each was checked against a fetched copy of its cited source; live-test and ledger claims were checked against the records and recomputed from the ledger; every claim that did not come back supported went to a top-tier review that re-fetched sources, and ten supported verdicts were re-checked for leniency (all held). Result: 509 supported, 15 contradicted, 9 not found, 34 not checkable (ladder conventions and design rules, which are this skill's own choices). The review found 6 confirmed errors, 8 items only the owner can settle, and 44 false alarms, most of them verifiers declining to fetch. The audit data is session-local and not committed.

Confirmed errors and where each is fixed:

- SKILL.md line 77 says per-spawn events inside a running workflow are "not hookable". SubagentStop fires for them (live test 1 above); PreToolUse does not, and SubagentStart cannot deny. Correct wording: "cannot be gated". Payload edit for 0.1.2.
- COVERAGE row A11 says workflows.md "defers the option list to the Agent SDK reference". Fetched 2026-09-11: the page's Agent SDK link covers the Workflow tool's inputs; the per-spawn option reference is the bundled workflow-authoring skill it names. 0.1.2.
- This record's 0.2.0 sentence one said an advisor set by `/advisor`, the `advisorModel` setting, or the `--advisor` flag was shown to be inherited. Only `--advisor` was tested (E2, E5, E6). Corrected in place today; issue #17 carries the old wording.
- This record's 0.2.0 sentence three dropped the qualifier that kill-switch and feature-flag-off silence was observed with the flag only (E3b, E7). Restored today; also in #17.
- Sweep finding 5 quoted the platform cost page as saying Fable 5.1 cache reads are "10x cheaper than other models". The page says 0.025x the input price against 0.1x on other models, a 4x deeper discount, and half of Opus 5's cached price. A fetch-summarizer artifact of the kind the sweep's own method note warns about. Corrected today.
- Sweep finding 7 spliced two sentences of the context-engineering post into one quotation. Corrected today to the two sentences as printed.
- Also withdrawn today, before the audit: the 0.1.2 item to "fix" the skill's Source line. The models-explained post does contain the advisor figure.

Owner items, with what could be settled:

- Four Workflow denials since 2026-08-16. The two on 2026-09-04 (01:09 and 02:04 UTC) came from a boilerplate session that relaunched with models within a minute: organic catches. The two on 2026-09-11 (02:45 and 02:46 UTC) were this session's launches denied by the lint's `agent(`-in-a-string defect: false positives. So "zero organic denials since 08-16" now reads "two organic Workflow-lint catches, none on the Agent path". Issue #16's Why bullet needs a comment.
- The 2026-08-24 fan-out figures (three concurrency-cap failures, seven classifier blocks, 13 refusals in 41 transcripts, one missing file) were counted from the surviving subagent transcripts under `~/.claude/projects/c--Users-billy-source-repos-workbench/1dcc20bc-6dab-4ba3-920c-b399c4fa9e02/subagents/`, files dated 2026-08-24. The path is now cited so the counts can be redone.
- COVERAGE row A3 cites hooks.md for the Agent tool's `tool_input` schema. Fetched 2026-09-11, the page carries only a Bash example; the 2026-08-09 drift report saw the Agent schema. Doc drift; scope it before the anchor refresh.
- README line 46 and COVERAGE row A9 say a hook whose command cannot run fails open with "no error". hooks.md now says such a hook shows "Failed with non-blocking status code" with the interpreter's message, and the action proceeds. Fail-open stands; "no error" is contradicted by the current docs. Rerun the missing-node canary before rewording.

Found from primary pages during the audit, not by it:

- The platform models overview (fetched 2026-09-11) lists default effort as "Not supported" for Haiku 4.5 and `high` for Fable 5.1, Opus 5, and Sonnet 5. The ladder's haiku row gives an effort band of "low–medium", and the pilot's haiku transcripts carried no effort field. The row needs rewording, and the guidance release must not add effort language to haiku.
- The same page does not call Fable 5.1 a "flagship"; it says to start with Opus 5 for most workloads and use Fable 5.1 for demanding reasoning and long-horizon agentic work, or when Opus 5 at higher effort still falls short. "Above opus" holds; "flagship" is this skill's word.
- Cache reads cost 10% of base input on current models and 2.5% on Fable 5.1 and Mythos 5.1.

## Cut from the draft by the review pass

- A wording change to the effort-inheritance bullet: the skill already says direct Agent calls inherit session effort. The `xhigh` observation goes to COVERAGE A11 as evidence instead.
- A cost argument for staying Fable-topped in the scope line: the per-task figures compare solo models, not the two session shapes the line decides between. The line is a conditional with no numbers.
- The "re-run failures at higher effort" pattern and the Fable cache-read discount in the low-effort row: one unattributed data point, and cache reads do not apply to delegations, which are fresh cache writes of about 36K tokens.
- A mismatch flag computed inside the ledger hook: only the sonnet alias was observed. Record raw, derive in the summary.
- A canary that locates and reads a subagent transcript: no prompt-visible channel gives the orchestrator that path; `agent_transcript_path` was only ever seen as hook input. Assert on the ledger.
- The SWE-bench "Sonnet 5 with a Fable 5 advisor" figure, moved rather than cut: it is an advisor-tool benchmark cited for the orchestrator shape. Cut.
- The loud-versus-silent failure taxonomy in the skill payload: Claude needs "a configured advisor is not proof one attached"; the table belongs in COVERAGE and the sweep record.
- A "not proposed" section as a roadmap tier: ROADMAP holds only triggered entries. The items are listed below instead.
- One 0.2.0 bundle for guidance, ledger, and canary: different evidence tiers, and the hook work is blocked on unrun tests. Bundling would hold verified prose behind unverified hooks.
- The draft's own overclaim that the `--advisor` flag "fails loudly": true only for CLI-side validation. The kill switch and feature-flag-off are silent with the flag and untested with a saved setting. The sweep record's Reading paragraph was corrected on 2026-09-03.
- The draft's per-consult mean of 39K in and 6.7K out: it included the main-session consult, the largest outlier. The subagent-only figures are 35,835 and 5,989.

## Not proposed

- A harness advisor agent type, a consult-only top-tier subagent: it sees only the prompt it is handed, so it is a nested lens review at top-tier cost, the orchestrator shape again.
- Transcript scanning as enforcement, a SubagentStop deny: observability only.
- Any per-delegation advisor attach, detach, or cap: no surface exists in Claude Code; tracked upstream in anthropics/claude-code#73072 and #91715.
- Reading `advisorModel` from settings as proof of attachment: shown unreliable in both directions on 2026-09-03.

## Roadmap entries

Land in 0.1.2 as repo apparatus, unversioned, each with its trigger:

- Rungs as agent types: ship subagent definitions with `model` and `effort` pinned (fastest-low, balanced-medium, balanced-high, top-high) so the Agent tool gets an effort dial and tier choice becomes structural. Trigger: 0.3.0 ledger data showing balanced-tier delegates at inherited `xhigh` cost measurably more than pinned-medium on matched tasks.
- Advisor explicitness gate: deny or remind when a fan-out runs under a session advisor without the prompt saying whether to consult. Trigger: 0.4.0 data showing consult rates on fan-out workers, or anthropics/claude-code#73072 or #91715 shipping a per-subagent advisor field, which is also the sunset trigger for the advisor section and the consult hook.
- Routing-impact study: run [evals/routing-impact-study/PROTOCOL.md](../../evals/routing-impact-study/PROTOCOL.md) once 0.3.0 lands, with the ledger as the cost axis. Its verdict decides whether the Agent-tool deny stays. Zero organic denials since 2026-08-16 argue for retiring it; the 2026-08-01 violation history keeps it for now.

## Owner rulings needed

- Versioning: the review placed new skill guidance at minor because it is additive, while REMEDIATION's "prose is a patch" rule reads as scoped to drift remediation of existing claims. If prose-is-patch is universal, 0.2.0 becomes 0.1.3 and the CHANGELOG policy line should say so.
- Branch flow: ruled 2026-09-04, always `develop`; feature branches PR into `develop`, releases go `develop` to `main` by PR. CONTRIBUTING already says this; #9 and #10 were exceptions.
- The top-tier-at-low-effort row against "categories ONLY": decided by its scenario in 0.2.0; the owner picks the wording if it fails.
- Canary ledger location: settled by test 4 on 2026-09-03, no ruling needed.

## Outside the plugin

- The user-level `~/.claude/settings.json` SessionStart hook throws a PowerShell ParserError every session. Not touched here; fix separately.
- The main-session shape question, Fable-topped with cheap delegates versus a Sonnet main with a Fable advisor: the platform doc's per-task numbers lean toward the former for this account, but they compare solo models, so this is a measurement to take, not a rule to write.
