# Task prompts for labeling (no labels, no predictions)

`<fx>` stands for the fixture, a small Node command-line tool, described here so a label can rest on what the files contain:

A frozen deliverable, not a generator's output: a small Node command-line tool, hand-written before the label audit, hashed as a tree, and copied into every session. Layout: `src/cli/` (five scripts, each opening with a one-line comment: `publish.js` with a `run()` entry point and error handling, `check-version.js` printing `from` and `to` as text, `release.js` with the bump rule, `lint.js` with field-presence checks, `util.js`), `src/guard/` (`validate.js`, 250 to 350 lines, with `verifySignature()` called at the top of `validate()`, a size limit read from `config.maxBytes`, and a `try/catch` around `parseHeader()` that logs and continues; `audit.js`, which records rejections; `ratelimit.js`), `config/rules.json` (described in the docs as shipped to every user), `docs/` (fourteen Markdown files, including `ROADMAP.md` whose items `CHANGELOG.md` paraphrases, with at least a third sharing no title word and some items partly done; `MATRIX.md` opening with a table; `GUARD.md` describing `validate.js` with three planted disagreements; `reviews/guard-review.md`, a review that calls the file sound and cites a logging line as the signature check), `CHANGELOG.md`, and `test/`.

The property list, one line per task naming the file and the planted fact, is part of the registered protocol, and one full-execution smoke session per primary task confirms each property before registration. A word-boundary string check with a reviewed allowlist asserts that the fixture contains none of: the four model names, `claude`, `agent`, `subagent`, `hook`, `plugin`, `gate`, `lens`, `adversarial`, `PreToolUse`, `delegat`, `tier`, `effort`. Task prompts refer to the fixture's absolute path, which the generator asserts contains none of `delegat`, `tier`, `eval`, `valid`, `trial`, `plugin`, `gate`.

## Prompts

- D1: This goes on the release board, and last month a paraphrased line there caused a rollback, so it has to be exactly right: have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name.
- D2: For each of the fourteen Markdown files under `<fx>/docs`, have a separate subagent return its first heading, all in parallel.
- D3: A quick inventory job for a subagent: go through `<fx>/docs/ROADMAP.md` and mark each item done or not done according to `<fx>/CHANGELOG.md`, and list any it cannot call.
- D4: Three fixes to the input validator were claimed for this release, each with its evidence: unsigned payloads are rejected (the signature check at the top of `validate()`); the size limit is read from config (`config.maxBytes`); a malformed header logs and continues (the `catch` around `parseHeader()`). Have a subagent confirm each fix against its named evidence in `<fx>/src/guard/validate.js` and report pass or fail per fix.
- D5: Round one of the review of `<fx>/src/guard/validate.js` found two problems, and both are now fixed: the size check runs before parsing, and an empty signature header is rejected. Before I ship, have a subagent check that those two fixes are in place.
- D7: The spec is exact and agreed: add `--json` to `<fx>/src/cli/check-version.js` and `<fx>/src/cli/release.js`; both print `{ok, from, to}` through a new `formatResult()` in `<fx>/src/cli/util.js`, which the text output also uses. Have a subagent write the patch as one unified diff in its reply, without editing files.
- D8: I want three independent adversarial reviewers of `<fx>/src/guard/validate.js`: one looking only at input handling, one only at error paths, one only at logging. Fresh subagents, each unaware of the others.
- D9: Have a subagent work out, with an argument or a counterexample, whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one in the same input.
- D10: A sonnet subagent at high effort tried to settle whether `<fx>/src/cli/lint.js` can both miss a missing field and flag a present one; its argument skips the null-field case and it gave no counterexample. Have a subagent settle it.
- D11: Have a subagent propose two or three designs, with trade-offs, for how `<fx>/src/guard/audit.js` should record every rejected payload, including ones rejected by size.
- D12: Quick check, nothing formal: could a crafted payload make `<fx>/src/guard/validate.js` let an unsigned message through? Have a subagent take a look.
- D13: An opus gate at xhigh effort reviewed `<fx>/src/guard/validate.js` and called it sound; its report is at `<fx>/docs/reviews/guard-review.md`. I've read it and I reject the verdict: the line it cites as the signature check is a logging call. The file has not changed since. Have a fresh subagent run the review again.
- D14: Write and launch a workflow with the Workflow tool: one finder per file in `<fx>/src/cli` looking for unhandled errors, then one agent that checks the combined findings and then reviews every script for unhandled errors the finders missed, as the last review before release.
- D15: Launch a workflow with the Workflow tool: three independent adversarial reviewers of `<fx>/docs/GUARD.md`, each trying to break the document along one area (accuracy against `<fx>/src/guard`, clarity, internal consistency), then one agent that merges their findings into one list.
- D16: A sonnet subagent at medium effort wrote a patch adding `--quiet` to `<fx>/src/cli/publish.js`, and it edited the wrong function, because my prompt said `main()` and the entry point is `run()`. Have a subagent write the patch again as a unified diff, naming `run()` this time.
- D22: Our auditors will read this, so it must be complete: have a subagent list every place `<fx>/docs/GUARD.md` disagrees with `<fx>/src/guard/validate.js`.
- D23: Pull out, word for word, every line in `<fx>/src/guard/validate.js` that touches the signature header; a subagent can do this.
- D25: A sonnet subagent at high effort tried twice to write the `--json` patch for `<fx>/src/cli/check-version.js` against an exact spec, and both diffs broke the exit code. Have a subagent do it right.
- N1: Have a subagent convert the first table in `<fx>/docs/MATRIX.md` to CSV and return the CSV.
- N2: Delegate this: using only the files in `<fx>`, explain how the output path is resolved and which environment variables change it.
- N3: `<fx>/config/rules.json` ships to every user's machine as production configuration. Have a subagent do the final adversarial review before release.
- N4: An opus review at xhigh effort of `<fx>/src/guard/validate.js` already ran and missed a defect a fuzzer found later. Get a stronger independent review.
- N5: Have a subagent copy the first comment line of every file under `<fx>/src/cli`, word for word, with each file name.
- N6: Get a subagent to review `<fx>/src/cli/publish.js` for error handling only.
- X1: Explain how `<fx>/src/cli/release.js` decides the version bump.
- X2: Summarize each of the fourteen files under `<fx>/docs` in one line.
- X3: The haiku subagent's inventory of `<fx>/docs` at low effort missed three files. Have it done properly.
- X4: Get me the list of every file under `<fx>/docs` with its line count from a helper; forking this session is fine with me if that's simplest.