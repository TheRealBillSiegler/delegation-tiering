# Validation program

Status: audits and pilots done 2026-10-08; the Phase 2 full run stopped after batch 1 on 2026-10-09 under its cost rule. Nothing in this directory is a verdict yet.

The program measures whether the plugin earns its place: whether its presence changes what Claude does when it delegates, whether the 0.1.3 ladder's top rows hold, and whether each tier is the cheapest one that works. Phases run cheapest first, and each phase's result decides whether the next one is worth paying for.

## Phases

| Phase | Question | Status | Directory |
| --- | --- | --- | --- |
| 0 Preserve | Keep the transcripts before the 30-day cleanup deletes them | Done: 10,481 files and both ledgers, kept outside the repo | none |
| 0b and 1b Audit | What has delegation cost so far, and do model aliases resolve to the intended model? | Done | [audit/](audit/) |
| 1a Lint stress | How reliably does the Workflow lint catch a missing model on real scripts? | Done | [lint-stress/](lint-stress/RESULTS.md) |
| 2 With/without trial | Does the plugin's presence change what an Opus orchestrator does? | Pilot done; full run on non-obvious tasks registered 2026-10-09 ([protocol](trials/PROTOCOL.md), SHA-256 `b28bebc70418b59b4a191cb081b6fad90ce6b370153e0f0bea7759fbdb1515d8`) | [trials/](trials/PILOT-RESULTS.md) |
| 3 Opus vs Fable replay | Is Opus as good as Fable as the open adversarial reviewer? | Archive replay retired; the bug-fix bank is too thin in the owner's repos | [replay/](replay/PILOT-RESULTS.md), [bugfix-bank/](bugfix-bank/) |
| 4 Tier sweep | Is each tier the cheapest one that works? | Runs only where Phase 2 shows the plugin changes choices | none yet |
| 5 Real-session trial | Does the plugin change the owner's real work? | Optional, not started | none yet |

## The with/without trial

Every session in the owner's transcripts carried the plugin's footprint: the CLAUDE.md row that tells Claude a PreToolUse gate fires on every Agent and Workflow call, the skill's description in the skill list, and the rule file. Those sessions cannot show what Claude does without the plugin, so the trial runs the same tasks under four setups:

| Setup | Steering text (rule file plus the CLAUDE.md row) | Plugin loaded (skill plus hooks) |
| --- | --- | --- |
| A | absent | absent |
| B | present | absent |
| C | absent | present |
| D | present | present |

Each run is scored twice. The first try shows the effect of the plugin's presence, because the gate can act only after a miss. The final call adds enforcement.

## Rules every phase follows

- A pilot runs before any full run, and its measured cost and variability set the full run's size.
- A full run starts only after its protocol is frozen and its content hash recorded.
- Runs are isolated: `claude plugin eval` children or `claude -p` children with the parent session's variables removed. Workflow agents are not used as subjects, because the workflow harness relays the parent session's user request to every worker.
- Every result records full model IDs, the Claude Code version, the effort level, and the date, and expires with the next model release.
- Transcript-derived data stays on the owner's machine outside the repo. This directory holds scripts and aggregate numbers only.
- Failed and adverse results stay in the record.

## Starting facts

These come from a read-only audit of 163 main session transcripts dated 2026-08-15 to 2026-10-09, run before the program started:

- 247 organic Agent calls all named a model; the 5 model-less calls were deliberate probes.
- The gate's 4 organic denials were all false positives from the string-mention lint class that 0.1.2 fixes.
- Fable was requested for 565 of 4,308 spawned workers (13.1%); the 31% figure in the 0.1.3 research record counts `model:` literals in script text.
- The skill body was loaded in 27 of the 41 sessions that delegated.

These facts describe behavior with the full footprint present. They do not show which part of the footprint produced it; the with/without trial does.

## Results so far

Every figure below is an aggregate; the transcript-level detail stays outside the repo. Dollar figures are list-price estimates computed from token counts: the owner runs Claude Code on a claude.ai subscription, so nothing here was billed per token, and the figures measure usage, not money spent.

**Spend, Phase 0b.** List-price spend from 2026-08-15 to 2026-10-09 was $4,817 to $4,832 across 46,809 API responses (two independent counts; the $15 gap sits in Fable 5.1). Fable models took 57% of it. Main sessions took 48%, workflow workers 47%, and direct Agent subagents 4%; the plugin governs only the delegated share. Fable workers cost $1,071, of which review-type workers cost $565 to $665 depending on how labels are classified.

**Alias resolution, Phase 1b.** Every requested alias resolved to the newest model of its line, except `haiku` on Claude Code 2.1.292, which resolved to Haiku 4.5; on 2.1.295 it resolved to Haiku 5.5.

**Lint stress, Phase 1a.** The lint flagged 553 of 559 single-omission mutants of real scripts: recall 98.9%, exact 95% CI 97.7% to 99.6%. All 6 misses share one cause: the lint searches for `model:` across the span up to the next `agent(` call, so a later `model:` hides a missing one. The 5 organic denials in the transcripts all pass the current lint, and none of those scripts had a model-less call.

**With/without pilot, Phase 2.** 40 sessions, 5 tasks × 4 setups × 2 runs, Opus 5.5 orchestrator at its default `medium` effort, $12.39 in list-price cost:

| Measure | A nothing | B words only | C plugin only | D both |
| --- | --- | --- | --- | --- |
| First call named a model | 0 of 10 | 10 of 10 | 10 of 10 | 10 of 10 |
| First call set an effort | 0 of 10 | 10 of 10 | 9 of 10 | 9 of 10 |
| Model per task (inventory, extract, fidelity, lens, gate) | none; workers ran on Opus | haiku, haiku, sonnet, sonnet, opus | same as B | same as B |
| Skill invoked | 0 of 10 | 0 of 10 | 10 of 10 | 3 of 10 |
| Gate denials | none possible | none possible | 0 | 0 |
| Mean cost per session | $0.29 | $0.25 | $0.40 | $0.30 |

The pilot is a screen. Each task asked explicitly for a subagent, each had an obvious ladder row, and 5 tasks give a task-level sign test of at most p = 0.0625 two-sided even when every task agrees. Effort is the only place the skill showed a difference: with the skill, haiku tasks got `medium` and the lens review got `high`, the skill's bands; with the words alone they got `low` and `medium`. Each cell holds 2 runs. The pilot also settled three instrument questions: `CLAUDE_CODE_EFFORT_LEVEL` (not `CLAUDE_EFFORT`) sets the eval child's effort, `tool_used` counts calls a hook denied, and `--allow-tools Workflow` makes the Workflow tool available.

**Replay pilot, Phase 3.** Of 362 archived Fable reviews eligible by date and role, none meets the replay rules as written, and 4 do with every tested relaxation. Most reviewers read files through shell commands, read files outside the repo through absolute paths that now point at changed files, or reviewed diffs, and the archive recorded neither the reviewed commit nor the effort level. No model ran and nothing was spent.

**Full run, Phase 2, batch 1.** The registered run stopped under its own cost rule: batch 1 reached 63 of 80 sessions at $0.97 each, which projects $232 for the planned 240. On the sessions that ran, the steering text again made the difference between naming a model and not: 13 of 13 first delegations named one with the text, 3 of 15 without (exact p 0.0078 over 10 tasks). The plugin beyond the text was inconclusive at ceiling, with D minus B at +0.077 over 13 tasks and an interval reaching past the 0.15 bound; the one task that moved was the open-ended design task, where the text alone chose sonnet and the plugin chose opus. Batch 1 also showed that on Claude Code 2.1.295 an `xhigh` session's Agent tool offers no `effort` parameter, so every direct worker ran at `xhigh` in every setup. Details: [trials/FULL-RESULTS.md](trials/FULL-RESULTS.md).

**Bug-fix bank, Phase 3 redesign.** Of 807 fix commits across the local repos, 412 pass a size and type screen and 240 of those are in the owner's repos. In a judged sample, 7 of 30 defects were findable from the code alone (95% CI 9.9% to 42.3%), but only 1 of 17 in the owner's repos, where most fixes align code with a design document. The owner's repos therefore cannot supply the 80 to 240 defects an Opus-versus-Fable comparison needs.
