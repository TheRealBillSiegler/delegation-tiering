# Changelog

Versions here are the `version` field in `.claude-plugin/plugin.json`, which Claude Code uses as the update cache key — an installed plugin only updates when that field rises. Repo-level changes that ship to nobody (docs/, evals/, scripts/, the root README, CI) are not versioned and are not listed.

Versioning is [semantic](https://semver.org) with one deliberate exception: **pre-1.0, breaking changes ship as MINOR**, not MAJOR — reserving 1.0.0 for a stability commitment this plugin has not made. Anything breaking is called out in its entry.

Which tier a change takes (ruled 2026-10-15 in #12): a change that leaves the payload untouched takes no version; a breaking change, or one that changes the scenario answer key in `evals/scenarios.md`, is minor; anything else is a patch.

## delegation-tiering

### 0.2.0

The tier ladder for the Claude 5.5 lineup, a shorter skill, corrections to shipped prose, and fixes to the gate and the Workflow lint. The work drafted as 0.1.2, 0.1.3, and 0.1.4 ships here; none of those versions was released. It is a minor release because the answer key and the lint's behavior change. **Ladder semantics change:** the open adversarial gate, open-ended design, and security-boundary reads move from fable to opus.

- **The top of the ladder sent three roles to fable that no measurement separates from opus.** Opus 5.5 "performs at the level of Claude Fable 5.1 on most work", its per-token price is 40% of Fable 5.1's ($4/$20 against $10/$50 per MTok), and Anthropic's choosing-a-model page starts most workloads on Opus 5.5 and moves to Fable when evals at `xhigh` or `max` fall short. Opus now takes the open adversarial gate (once per claim), open-ended design, and security-boundary reads at high to `xhigh`; fable takes work an opus attempt at `xhigh` fell short on, and one re-run of a gate verdict the orchestrator rejects before any fix lands. The opus band reaches `xhigh`, a model the session cannot delegate to hands its tier to the next one up, and `hooks/tiers.js` and the gate's denial text follow.
- **The skill said the Agent tool takes no per-call effort.** It has since Claude Code 2.1.292. The skill now asks Claude to pass `effort` inside the tier's band on every Agent call whose schema lists the parameter, and says an omitted effort runs at the session's level, not the model's default.
- **The haiku row claimed an effort band Haiku 4.5 does not have.** Haiku 5.5, released since, takes all five levels. The row reads medium, low for short high-volume items, and a `haiku` call that still resolves to Haiku 4.5 runs with effort passed.
- **The gate blocked calls that cannot name a model.** A fork runs on the session's model and ignores `model`, and under `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` the Agent tool has no `model` parameter, so the gate denied every Agent call in such a session. Both now pass with a note. The fork note says forking chooses the session's tier and when a non-fork subagent fits better; the forced-model allow counts every value Claude Code reads as on (`1`, `true`, `yes`, `on`, any casing), and the canary counts its note as a pass. Every other model-less Agent call is still denied.
- **Forking chooses a tier.** A fork runs on the session's model, and fork mode is on by default in interactive sessions; the skill forks only when that model is the lowest sufficient tier or the shared context is the point.
- **The skill used Anthropic's word "advisor" for the opposite shape.** Its "Advisor pattern" section described cheap finders feeding a top-tier gate and cited a SWE-bench Pro figure that measures the advisor tool, where a cheaper executor consults a stronger model mid-task. The section is now "Cheap finders, one gate", drops the figure, and says what an attached advisor is on this ladder: the executor's escalation path, not a tier.
- **The gate fails closed.** A gate that could not start, for example with `node` missing from `PATH`, allowed every call, and the model saw no error. The gate's hook now sets `onFailure: "block"`, so Claude Code blocks every Agent and Workflow call with a hook error that names the missing executable (live 2026-10-15, headless, Claude Code 2.1.296). The ledger hook stays fail-open. **Requires Claude Code 2.1.295 or later**; on an older version the setting was not tested, so treat the gate as fail-open there. The Enforcement section, the README, and a contract check follow.
- **Workflow-internal spawns were called "not hookable".** SubagentStop fires for them (live, 2026-09-03); what holds is that no hook can deny a spawn or change its model, and the Enforcement section lists them among the paths nothing checks.
- **The skill is shorter** (1,573 to 1,395 words by `wc -w`). Hook mechanics, version floors, and rationale citations live in the repo, each rule appears once, and the Enforcement section states what Claude acts on. One staleness stamp points at the coverage matrix.
- **Two traps from current Claude Code are named:** the bundled workflow-authoring reference tells script authors to omit `model`, which this skill overrides, and a `model` in `meta.phases` is a display label.
- **Workflow lint: `agent(` inside a prompt string or a comment was read as a call** and denied a legitimate launch twice on 2026-09-10. String literals and comments are blanked before the call scan.
- **Workflow lint: a model-less call could pass on a `model:` that was not its own.** The model check and the escape marker ran over the text from each `agent(` to the next one. A `model:` in later code (a lens or batch table, a result-mapping object) or in the call's own prompt string hid the call. A mutation test over 559 real calls caught 553; all six misses were these two causes. Each call is now checked in its own balanced argument list, read with string literals and comments blanked; a quoted `'model':` or `"model":` key counts. **Behavior changes:** a `/* model-gate:allow */` marker now suppresses a flag only inside the call's own argument list, so a marker after the closing paren no longer does; and a call whose model arrives through a variable, a spread, or a shared options object stays flagged unless it carries the marker, as documented. A script with an unbalanced call (truncated or invalid) falls back to the old span-to-next-call check.

Repo-side in the same release, unversioned: the coverage matrix gains a Protects column, dated dependency rows from the 2026-09-03 live tests, citations of the pages that now document nine rows' mechanics, and new rows for forks, the forced-model setting, and the cybersecurity fallback that re-runs a flagged subagent on Opus 4.8; the drift check strips links before hashing, reports the Claude Code version without treating it as drift, and watches nested doc pages, which its pattern previously misread; the drift task is documented as run on demand; the 2026-09-14, 2026-10-08, and 2026-10-15 drift reports, the 2026-09-03 research records, and the lineup research record (the evidence behind the ladder ruling, with a correction to the 2026-08-09 prior-art claims) are added; a 20-row answer key; README fact fixes, with the design rationale restated on Claude Code's own comparison table (the plugin is the "Subagents with model set" row); the live probe strips the forced-model setting so its deny assertions hold; contract fixtures and `--test` cases for both lint fixes; a failure-class row in `docs/REMEDIATION.md`.

### 0.1.1

- **Fresh installs failed to load on current Claude Code** (verified on 2.1.224): the manifest's `hooks` field pointed at `hooks/hooks.json`, which Claude Code already loads automatically, and the duplicate reference is rejected at hook-load time. The field is removed; hook behavior once loaded is unchanged. Already-installed copies kept working, which is how the defect survived until a clean-machine install.

### 0.1.0

First release under this name. `delegation-steering` (retired section below) split in two: this plugin keeps the enforcement half — tiering skill, gate, ledger, canary — and the steering-mechanism decision guide is now the sibling plugin `steering-claude-code`. Versions reset with the new identities. Relative to `delegation-steering` 0.1.x, everything below changed.

How the hooks are wired changed; what the gate decides did not. It denies and allows exactly what it did before.

- **Windows no longer needs Git for Windows.** The hooks declared `"shell": "bash"` so a shell could expand `${CLAUDE_PLUGIN_ROOT}`. They now spawn in exec form — `"command": "node"` with the script path as an `args` element — which the hooks reference recommends whenever a hook references a path placeholder. Node.js on `PATH` is the only remaining requirement.
- **The ledger no longer blocks a delegation.** It runs with `"async": true`: it emits no output and no decision waits on it.
- **The ledger writes to `${CLAUDE_PLUGIN_DATA}`**, not `~/.claude/delegation-ledger.jsonl`. Uninstalling now removes it along with the plugin's data directory, or preserves it with `--keep-data`, instead of leaving a file behind for you to find. History written under the old plugin name or the old path stays where it is and is not migrated; the repo's weekly summary reads all three locations.
- **Breaking, for anyone reading the ledger file:** the workflow entry's `models` field is now `modelLiterals`. The contents are unchanged — model strings scanned out of the script text, one entry per literal rather than per agent spawned — but the name now says so.
- **The gate checks the tool name instead of inferring it.** Anything the matcher passed that was not a `Workflow` was treated as an `Agent` call and denied for lacking a `model` field. Agent and Workflow calls are unaffected; a tool the gate has no rule for now passes through untouched.
- **Two documented claims were wrong and are corrected.** `/* model-gate:allow */` suppresses only the `agent()` call whose span it sits in, not the whole script as the hooks README stated — a marker in a file header suppresses nothing. And an unreadable `scriptPath` fails open *silently*, not with a reminder as the plugin README stated. Both now have contract cases.
- **The tiering skill leads with the ladder.** The design justification that opened the file moves to the plugin README's Design rationale section; the scope line beside the standing rule keeps the one-line why, and the skill speaks in its own voice — no inline article attributions, with the Source section a pointer at the live post for rationale beyond it.
- **The payload carries only what Claude needs to apply the skill.** The apparatus that builds and verifies it — the dated source digest, doc-anchor table, verification stamps, drift and weekly-summary pointers — lives in the plugin repo, not the installed plugin; shipped pointers at repo files are full URLs. The operational content the skill keeps — what the gate denies, the fail-open paths, the post-update canary instruction — is the execution surface.
- **The ladder is data.** `hooks/tiers.js` holds the rungs and top-tier preference order and derives the denial string from them — byte-identical to the previous literal, so no user-visible change.
- **The plugin README states the missing-runtime fail-open right under Components**, in a Verify section, and the canary is namespaced `/delegation-tiering:canary`.

## delegation-steering (retired)

Renamed and split 2026-08-12 into `delegation-tiering` and `steering-claude-code` — one plugin enforced model choice while the other advised on config placement, two jobs under one name. Installed copies keep working but will never update; uninstall it and install the successors. History:

### 0.1.1

- Corrected the ledger description: a workflow entry records the model literals scanned from the script text, so it neither counts fan-out (agents spawned from one literal appear once) nor excludes non-agent occurrences. The previous wording claimed it recorded the models used across the workflow.
- Components are now a table with a "Fires when" column, replacing the bullet list.
- Documented the `DELEGATION_LEDGER` path override and the off switch.

No behaviour changed: no skill, hook, or command was modified in this release.

### 0.1.0

- Initial release: `delegation-tiering` and `steering-claude-code` skills, the `agent-model-gate` PreToolUse hook (denies delegations that name no model, lints workflow scripts at launch), the `delegation-ledger` PostToolUse hook, and the `/delegation-steering:canary` verification command.
