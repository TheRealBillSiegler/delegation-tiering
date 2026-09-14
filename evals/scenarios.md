# Delegation-tiering skill: tier-assignment eval

Run each scenario against a fresh subagent given ONLY `skills/delegation-tiering/SKILL.md`. Pass = assigned tier matches Expected (effort within the stated band). Baseline (2026-09-14, after the 0.1.2 prose changes): sonnet 13/13, haiku 12/13. The haiku miss is scenario 5, answered opus at high where the expected is the top tier; the scenario does not say whether fable is available, and the expected answer allows opus only when it is not. Run as 26 fresh-context workflow spawns via aliases `haiku`/`sonnet`, which resolved on this machine to claude-haiku-4-5-20251001 and claude-sonnet-5 in the same week's transcripts; graded mechanically on structured output (tier token, effort band, and for the fan-out, explicit-model, and effort-surface rows their own fields). Prior baseline (2026-08-06): 12/12 at both tiers, model IDs not captured at run time.

| # | Scenario | Expected |
| --- | --- | --- |
| 1 | Inventory every TODO comment across a 400-file repo | haiku (no effort setting: Haiku 4.5 does not take one) |
| 2 | Verbatim quote-fidelity check of a doc against a reference file | haiku–sonnet (medium if sonnet) |
| 3 | Implement a feature from a spec that names files, functions, and signatures | sonnet, high |
| 4 | Research current API syntax for a library against its docs | sonnet, medium |
| 5 | Final adversarial review of a production config change | top tier (fable; opus if fable unavailable), high–xhigh |
| 6 | Open-ended architecture design with unsettled requirements | top tier, high–xhigh |
| 7 | Reasoning-heavy refactor where sonnet demonstrably produced wrong results, not security/design/review | opus, high |
| 8 | Fan-out of 12 finder agents feeding a verification gate | finders haiku/sonnet, gate top tier (cheap finders, top-tier gate: finders produce, a stronger gate adjudicates) |
| 9 | Session is opus-topped (no fable): who takes the adversarial review gate? | opus — top tier is most capable available in session |
| 10 | Workflow script where inheriting the session model genuinely is the right choice | still write the model explicitly (visibility rule / lint) |
| 11 | Session is sonnet-topped (no fable, no opus): who takes the adversarial review gate, and what does the gate stage buy? | sonnet — top tier is most capable available; independence (fresh context, adversarial framing), not extra capability |
| 12 | Session effort is medium; a top-tier review gate wants high–xhigh effort. Direct Agent call or workflow? | Workflow `agent()` (per-call effort) or an agent type with definition-pinned effort; plain Agent calls inherit session effort |
| 13 | A top-tier gate found 6 issues, each fixed; an agent must now verify each fix against named evidence. What tier? | sonnet — enumerated fixes with expected evidence are anchored verification, not an open-ended gate; "re-gate" framing does not re-earn top tier |

Grading notes (scenarios referenced by topic, not row number — rows renumber when scenarios are inserted): state the task plainly to the subagent; a first 2026-09-14 run that labelled each task "Scenario N" sent four haiku spawns looking for a numbered scenario inside the skill file, which they reported absent, so that run was discarded and re-run. the two session-ceiling scenarios (opus-topped, sonnet-topped) test that "top tier" resolves to the most capable model available; the inherit-anyway scenario tests the explicit-over-inherited rule, not tier choice; the effort-band scenario tests choosing the delegation surface that controls effort (Workflow `agent()` takes per-call effort; plain Agent calls inherit the session's); the fix-reverification scenario tests the named-checklist-is-not-a-gate rule, drawn from a real mis-tiering on 2026-08-12 (a fable re-gate corrected to sonnet).
