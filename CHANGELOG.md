# Changelog

Versions here are the `version` field in `.claude-plugin/plugin.json`, which Claude Code uses as the update cache key — an installed plugin only updates when that field rises. Repo-level changes that ship to nobody (docs/, evals/, scripts/, the root README, CI) are not versioned and are not listed.

Versioning is [semantic](https://semver.org) with one deliberate exception: **pre-1.0, breaking changes ship as MINOR**, not MAJOR — reserving 1.0.0 for a stability commitment this plugin has not made. Anything breaking is called out in its entry.

## delegation-tiering

### 0.1.2

Corrections to shipped prose and one lint defect; no enforcement or ladder semantics change.

- **The skill used Anthropic's word "advisor" for the opposite shape.** Its "Advisor pattern" section described cheap finders feeding a top-tier gate and cited a SWE-bench Pro figure that measures the advisor tool, where a cheaper executor consults a stronger model mid-task. The section is renamed "Cheap finders, top-tier gate", carries a one-sentence naming note, and drops the figure. The scope line now says what an attached advisor is on this ladder: the executor's escalation path, not a rung. The README's design rationale is restated on Claude Code's own comparison table (the plugin is the "Subagents with model set" row).
- **The haiku row claimed an effort band Haiku 4.5 does not have.** The platform models overview lists effort as not supported for Haiku 4.5; the row and the first durable rule say so. "Flagship" is dropped from the fable cell; the page does not use it.
- **Workflow-internal spawns were called "not hookable".** SubagentStop fires for them (live, 2026-09-03); what holds is that no hook can gate them. The Enforcement section says "cannot be gated".
- **Workflow lint: `agent(` inside a prompt string or a comment was read as a call** and denied a legitimate launch twice on 2026-09-10. String literals and comments are blanked before the call scan; the model check and the escape marker still apply to the original text. Two regression fixtures and three self-test cases added. Lint semantics for real calls are unchanged.

Repo-side in the same change, unversioned: the coverage table gains six dated dependency rows from the 2026-09-03 live tests and a Protects column; row A3 becomes docs-silent (hooks.md no longer shows the Agent input schema); row A9 records the 2026-09-14 headless re-test; the drift check strips links before hashing and reports the Claude Code version without treating it as drift; the drift task is documented as run on demand; the 2026-09-03 research records and the 2026-09-14 drift report are added.

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
