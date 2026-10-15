# Lint stress test (validation program, Phase 1a)

Measures the Workflow-script lint in `hooks/agent-model-gate.js` (`blankLiterals` + `lintScript`, extracted verbatim from the file, not re-implemented) on archived real workflow scripts. Run: `node lint-stress.js` (Node built-ins only). Aggregates are in `results.json`; per-call and per-mutant detail lives outside the repo.

## Corpus

| Item | Count |
|---|---|
| Script files in the snapshot | 201 |
| After byte-identical dedupe | 200 |
| `agent(` call sites (code level, blanked text) | 560 |
| Calls with unbalanced argument lists | 0 |
| Main transcripts scanned | 163 |

## 1. Baseline

0 of 560 calls flagged across 200 unique scripts, as expected: a denied script never launches, so it is never archived. The corpus is therefore survivorship-filtered, and says nothing about how often authors omit `model`.

## 2. Mutation test

One mutant per call whose own argument list has a direct options-object `model:` property (559 of 560 calls); only that property was removed.

| Measure | Value |
|---|---|
| Mutants | 559 |
| Caught | 553 |
| Masked | 6 |
| Recall (pooled) | 98.93% |
| Exact Clopper-Pearson 95% CI | 97.68% to 99.61% |
| Recall averaged per script (200 scripts) | 98.21% |
| Scripts with at least one masked mutant | 6 of 200 |
| Spurious flags on other calls | 0 |

Masked causes (all 6 are the same mechanism: the lint tests `model\s*:` over the whole span up to the next `agent(`, not over the call's own arguments):

- 5 cases: a later code-level `model:` inside the span after the mutated call's closing paren. Observed forms: lens or batch tables (`{ key: ..., model: ... }`) and a result-mapping object defined after the call, in scripts where the mutated call is followed by further code before the next call, or is the last call.
- 1 case: `model:` text inside a prompt string within the call's own arguments (the lint's span test runs on original text, not blanked text).

Four of the 6 are in scripts that have only one or two calls, so the span extends to end of file. No case was caused by a schema key named `model` surviving; nested schema keys appear in the corpus but did not mask a mutant here.

Per-script recall is lower than pooled recall because masking clusters in scripts with a few calls followed by long trailing data; 6 scripts account for all 6 misses.

## 3. Indirect models

| Measure | Count (of 560 calls) |
|---|---|
| Direct options-object `model:` property | 559 |
| No direct property | 1 |
| Of those: spread, variable options argument, or shorthand `{ model }` | 0 |
| Of those: passes lint only via `model:` text elsewhere in its span | 1 |
| Passes via a `model-gate: allow` marker | 0 |
| `model-gate: allow` markers in the whole corpus | 0 |
| Calls with a quoted key `'model':` | 0 |

The corpus contains no spread, variable-options, or shared-options-object calls, and no allow markers. The allow-marker path and indirect-model handling are therefore unexercised by real data; this test cannot say how often they will matter.

## 4. Recovered denials

Workflow tool_use blocks whose result contained "without an explicit model": 7 occurrences, all with scripts available (5 distinct scripts; two scripts each appear twice, as retries or reruns).

| Group | Denials | Denied by current lint | Truly model-less call (independent balanced-paren check) |
|---|---|---|---|
| Deliberate (prompt says "probe" or "diagnostic") | 2 | 2 | 2 |
| Organic | 5 | 0 | 0 |
| All | 7 | 2 | 2 |

- Current lint and the independent check agree on every one of the 7 (no case where one denies and the other does not).
- The 2 deliberate denials are the same one-call script run in two sessions (distinct sessions, identical hash); both still deny, correctly.
- None of the 5 organic denials is denied by the current lint, and none contains a model-less call. Re-running a naive no-blanking variant (plain `agent(` regex on the raw text) flags each of them, and one script has an `agent(` on a comment or quoted line. Assumption, not verified against the older gate source: these were false denials from an earlier lint that lacked literal and comment blanking, and the blanking now in the file fixed them. The data shows only that they pass today.
- Probe classification used the nearest preceding user prompt and the non-script Workflow input fields; script text containing "probe" did not change any assignment.

## Limits

- Survivorship: archived scripts passed the gate, so baseline 0 and the high recall describe launched scripts, not scripts as first drafted.
- Mutants remove only a direct `model:` property; they do not test other omission shapes (a model-less call among model-bearing neighbors in the same span is covered, since every mutant is such a case).
- The caught test matches the mutated call's 90-character span summary in the lint output; with an identical summary on a different call it could misattribute. Zero spurious flags suggests this did not occur.
