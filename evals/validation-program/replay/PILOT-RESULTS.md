# Phase 3 replay pilot — results

Pilot date 2026-10-08. Question for the full study: does Opus 5.5 find the real defects Fable 5.1 finds when it sits in the open adversarial review row? This pilot measures feasibility and sizing only and reaches no verdict on that question.

## Outcome

No candidate was replayable. The draw examined 25 of 362 frame members, and all 25 failed at least one replayability criterion, so steps 3 to 7 (tree reconstruction, replay, findings extraction, blind adjudication, costs) did not run. No `claude -p` child started, and the cost ledger stands at $0.00.

A frame-wide diagnostic, which selects no candidates and runs no model, found that 0 of 362 frame members pass both the read-only-tools criterion and the recoverable-files criterion. Under the most permissive relaxation I tested, 4 of 362 pass. Retrospective replay of this transcript corpus cannot supply the sample a full run needs.

## Method

Source: a frozen copy of the Claude Code transcript store taken 2026-10-08, read-only. Scripts in this directory produce every number below; the transcript-derived records stay outside the repo.

| Step | Script | Rule |
|---|---|---|
| Frame | `frame.mjs` | Worker resolved to `claude-fable-5-1` or requested `fable`; first timestamp on or after 2026-09-01; label or workflow phase matches gate, critic, adversarial, verify, review or audit, or the worker has no label and its prompt matches |
| Draw | `frame.mjs` | Seed 20261008, mulberry32 PRNG, Fisher-Yates over the frame sorted by transcript path |
| Examine | `examine.mjs` | Prompt = consecutive user text turns before the first assistant turn, joined verbatim; files = Read targets resolved against `git log -1 --before=<start> <branch>` and compared line by line with the blob; tools = Read, Glob, Grep, WebFetch, plus the non-acting StructuredOutput and ToolSearch |
| Diagnostic | `examine.mjs --all` | The same automated checks over all 362 frame members, without scope rulings |
| Sizing | `sizing.mjs` | Token usage per archived worker, deduplicated by message ID |
| Replay, adjudication | `replay.mjs`, `adjudicate.mjs`, `child.mjs`, `adjudicate-core.mjs` | Built and dry-run; never executed against a model |

The content comparison in the files check reads the numbered lines each Read call returned in the transcript and requires at least 98% of them to equal the blob at the resolved commit.

I made the scope rulings (open review, or re-verification and other targeted checks) by reading the opening of each examined prompt's task text. One rater made them, and the rater runs on the Opus arm's model.

## Frame

| Stage | Workers |
|---|---|
| Subagent transcripts in the snapshot | 4,326 |
| Resolved to or requested Fable | 569 |
| Started on or after 2026-09-01 | 532 |
| Labeled with a non-review role, matched only on prompt wording | 97 (removed) |
| Frame: label marks a review | 237 |
| Frame: no label, prompt marks a review | 125 |
| **Frame total** | **362** |

Workflow workers account for 355 of the 362 frame members. The frame-builder's re-verification keyword flag fired on 8 of 362; the exclusion itself is a per-candidate ruling.

## Replayable yield

0 of 25 examined candidates are replayable. Each row below counts the examined candidates that failed the stated check; one candidate can fail several.

| Exclusion reason | Candidates (of 25) |
|---|---|
| Tools: used Bash | 23 |
| Tools: also used WebSearch | 2 |
| Tools: also used Skill | 1 |
| Files: at least half the Read targets outside the repo (session scratchpads, harness tool-result spill files, sibling checkouts) | 16 |
| Files: prompt directs a review of a git diff or log | 13 |
| Files: no Read targets recorded (the worker read through the shell) | 7 |
| Files: recorded branch deleted, no commit resolvable | 4 |
| Files: Read targets absent from the resolved commit (uncommitted at the time) | 2 |
| Files: detached HEAD recorded, no branch to resolve | 1 |
| Scope: refutation of a single named claim or verdict | 4 |
| Scope: re-verification of already-named findings | 2 |
| Scope: verification of other reviewers' named claims | 2 |
| Scope: disposition pass over a closed list of named items | 1 |
| Scope: not a review (matched on prompt wording) | 1 |

| Criteria failed | Candidates (of 25) |
|---|---|
| Files, tools and scope | 8 |
| Files and tools | 14 |
| Scope and tools | 1 |
| Files and scope | 1 |
| Files only | 1 |

The one files-only failure is an open gate whose targets sat in a session scratchpad that still exists on disk, but one of those targets has changed since the review: 68 of its 73 returned lines match the current file.

15 of the 25 examined candidates are open reviews by my ruling.

## Frame-wide diagnostic

The diagnostic applies the automated tools and files checks to all 362 frame members. Scope is not ruled frame-wide, so every count is an upper bound on scope.

| Criterion set | Pass (of 362) |
|---|---|
| Tools, strict | 27 |
| Tools, with shell commands allowed when a heuristic classes every command as inspect-only | 104 |
| Files, strict | 7 |
| Files, with diff-or-log review allowed | 7 |
| Tools strict and files strict (the protocol as specified) | 0 |
| Inspect-only shell and files strict | 2 |
| Inspect-only shell and files strict, with intact scratchpad targets copied into the tree | 4 |

| Files failure, frame-wide | Members (of 362) |
|---|---|
| No Read targets recorded | 165 |
| Prompt directs a diff-or-log review | 160 |
| At least half the Read targets outside the repo | 143 |
| Read targets absent from the resolved commit | 52 |
| Recorded branch deleted, no commit resolvable | 37 |
| Detached HEAD recorded | 7 |
| Read content diverges from the resolved commit | 5 |

## Defects, false claims, judge reliability

No replay or adjudication ran, so the pilot reports no defect counts. Real defects per prompt by arm (Fable only, Opus only, both), false claims per arm, and the judge's unclear rate all have a denominator of 0.

## Cost

| Item | Children | Total cost |
|---|---|---|
| Opus replays | 0 | $0.00 |
| Sonnet adjudications | 0 | $0.00 |

The archived Fable workers give a size for one replay, in tokens and not in dollars, because I did not verify a price table. Quartiles are p25 / median / p75.

| Per archived worker | Frame (362) | Examined (25) |
|---|---|---|
| API turns | 5 / 7 / 10 | 5 / 8 / 12 |
| Cache-write input tokens | 58,896 / 86,628 / 120,280 | 80,313 / 114,005 / 128,382 |
| Cache-read input tokens | 264,656 / 458,924 / 845,096 | 326,021 / 630,657 / 1,209,100 |
| Output tokens | 5,046 / 9,687 / 21,448 | 10,307 / 20,127 / 29,830 |
| Wall-clock minutes | 3 / 6 / 9 | 5 / 6 / 9 |

A replay on Opus at a different effort will not match these counts; they bound the order of magnitude only.

## Replay setup as built

`replay.mjs` runs `claude -p --model claude-opus-5-5 --output-format json --effort <e> --tools Read,Glob,Grep,WebFetch --permission-mode dontAsk --no-session-persistence` with the verbatim prompt on stdin, from inside the archived tree. The effort is the worker's `meta.effort` when recorded and `xhigh` otherwise; `meta.effort` is recorded for 1 of 362 frame members and 0 of 25 examined. `adjudicate.mjs` runs `claude -p --model claude-sonnet-5-5 --effort high --tools Read,Glob,Grep --json-schema <verdict schema>` from the same tree. `child.mjs` deletes the nine parent-session variables from each child's environment, refuses to start a child once the ledger reaches $25, and appends each child's `total_cost_usd` to the ledger.

Known differences between a replay and its original, recorded per candidate in `replay-setup.json`:

- The original ran as a workflow subagent under the harness system prompt; the replay runs as a top-level print session.
- The original returned through a StructuredOutput tool whose schema the transcript does not record; the replay returns free text, so the two arms' outputs differ in shape before claim splitting.
- The original received the relayed user request and the computed task as two turns; the replay receives them joined as one.
- Absolute paths inside the prompts point at the live repos, worktrees and scratchpads, so a replay that follows them reads current files and not the archived tree.
- Plugins, rules, memory and hooks load from the machine's state on the replay date, not the original start date.

## What must change before a full run

1. The study draws its sample prospectively: each new open-review gate assigned to Fable or Opus records, at launch, the commit SHA of every checkout it reviews and a copy of every scratchpad file named in its prompt, and its transcript records effort and the structured-output schema.
2. If the study keeps a retrospective arm, the files criterion reconstructs the reviewed state from a local clone of the repo at the recorded refs, so diff-and-log reviews and shell readers become replayable, and both arms get the same inspect-only shell allowlist through `--allowedTools`.
3. The replay confines file access to the archived tree, either through `--restricted` (which also drops user settings, a further setup difference to record) or by rewriting absolute paths in the prompt to the tree.
4. The frame-builder reads the scope from the workflow script's role for each agent, so refutation, re-verification and closed-list workers leave the frame before the draw; 10 of 25 examined candidates were out of scope.
5. Both arms return through the same `--json-schema`, so claim splitting applies one rule to both.
6. Two raters, at least one on neither arm's model, make the scope rulings.

## Unverified

- The inspect-only shell classification is a regular-expression heuristic that I did not hand-check against the 104 commands it passes.
- The diff-or-log flag is a prompt regular expression; in the examined sample 2 of its 13 hits were mentions of git output, not directions to review a diff, and both of those candidates failed other checks.
- The adjudication driver reads the judge's verdict from `structured_output` in the JSON result and falls back to parsing `result`. I did not run a `--json-schema` child to confirm the field name.
- `--no-session-persistence` is meant to keep each child's transcript out of the user's session store; I did not confirm what else a child writes under the user profile.
- The yield of change 2 (clone-based reconstruction with a shared shell allowlist) is untested; the diagnostic measured only the relaxations in its table.
