# Drift report — 2026-10-08

**Trigger:** manual run of `scripts/check-drift.js` on the `release/0.1.2` tree, prompted by the Claude 5.5 model launches. Baseline captured 2026-09-14T15:38:39Z at Claude Code 2.1.263; the CLI on `PATH` reports 2.1.282 and the session ran 2.1.292. All eight anchored pages in `scripts/anchors.json` hash-changed.

## Verdicts

### advisor.md — NOISE

- **A13**: SUPPORTED. The page is still marked experimental and still says "Subagents inherit the configured advisor and apply the same pairing check against their own model." The "Compare with related features" table keeps the "Subagents with `model` set" row that README's design rationale cites, and adds a `/model` row.
- Additive: the pairing table lists the 5.5 models, Haiku 5.5 as main model or advisor from 2.1.293, the `CLAUDE_CODE_DISABLE_ADVISOR_TOOL` kill switch, and a usage-credits consent for a Fable advisor on some plans.

### hooks-guide.md — NOISE

No Agent or Workflow content. The page repeats the non-blocking failure notice and recommends exec form through `args`; no anchored claim changed.

### hooks.md — CLAIM-AFFECTING (rows A3, A14, A15; skill Enforcement)

- **A3**: RESTORED. A PreToolUse `##### Agent` `tool_input` table lists `prompt`, `description`, `subagent_type`, and `model` ("Optional model alias to override the default"). `run_in_background` and `effort` are absent from the table, so those halves stay empirical.
- **A14**: DOCUMENTED. SubagentStop input lists `agent_id`, `agent_type`, `agent_transcript_path`, `last_assistant_message`, and `stop_hook_active`; the common `effort` object is "Present for events that fire within a tool-use context, such as PreToolUse, PostToolUse, Stop, and SubagentStop". Workflow-spawn coverage (`agent_type: workflow-subagent`) stays empirical.
- **A15**: DOCUMENTED. PostToolUse Agent `tool_response` lists `resolvedModel`, `usage`, `totalTokens`, `totalDurationMs`, `modelsUsed`, and the background `async_launched` shape, with the caveat that `totalTokens` and `usage` "cover the final request only". The no-re-fire-on-completion behavior stays empirical.
- **Skill Enforcement, per-spawn sentence**: "SubagentStop | Yes | Prevents the subagent from stopping" and "SubagentStart hooks can't block subagent creation". The skill's "the subagent start and stop events that do fire cannot deny" is accurate for spawns and wrong for SubagentStop's block decision; the sentence needs "cannot deny a spawn or change its model".
- **A9**: SUPPORTED as recorded. A hook that cannot start is non-blocking and the action proceeds with a "Failed with non-blocking status code" notice; the page's example is a shell-path failure, not a missing exec-form `node`.
- Additive: `PreModelSwitch` and `PostModelSwitch` events, which can deny or ask on a model switch.

### memory.md — NOISE (A12); A6 gains a basis elsewhere

- **A12**: SUPPORTED. User-level rules load before project rules; rules without `paths` load at launch.
- **A6**: memory.md still states compaction survival for project-root CLAUDE.md only and now links [context-window](https://code.claude.com/docs/en/context-window), whose table says "Project-root CLAUDE.md and unscoped rules | Re-injected from disk" and "If a rule must persist across compaction, drop the `paths:` frontmatter". The table does not distinguish user-level rules, so `~/.claude/rules/delegation.md` is covered by inference plus the 2026-09-10 observation.

### plugins-reference.md — CLAIM-AFFECTING (rows A10, A17)

- **A10**: SUPPORTED for the data directory and hook export; the uninstall detail moved to [plugins/cli-reference](https://code.claude.com/docs/en/plugins/cli-reference), which says "When you uninstall a plugin from the last scope it's installed at, Claude Code also deletes" the data directory, and keeps it with `--keep-data`, when another installed plugin uses the same folder, or when Claude Code can't read the list of installed plugins back. README's Configuration paragraph needs the last-scope qualifier, and A10 needs cli-reference as a second basis.
- **A17**: DOCUMENTED. "In skill, command, and agent content, write the `${...}` reference in the Markdown body instead, and Claude Code substitutes the path inline." The marketplace-install caveat in the row stands.
- Additive: plugins may ship `settings.json`, of which only `agent` and `subagentStatusLine` take effect, so a plugin cannot ship a model default.

### sub-agents.md — CLAIM-AFFECTING (row A11; skill effort rule)

- **A11**: The Agent-tool half is CONTRADICTED. "When you ask Claude to run a non-fork subagent at a specific effort level, it can also pass an `effort` parameter for that invocation. The parameter overrides the `effort` field and stays in effect when the subagent is resumed. The `CLAUDE_CODE_EFFORT_LEVEL` environment variable takes precedence over both. The per-invocation parameter requires Claude Code v2.1.292 or later." The frontmatter `effort` row now reads "Overrides the session effort level, but not the `CLAUDE_CODE_EFFORT_LEVEL` environment variable"; "Default: inherits from session" is gone.
- New, claim-bearing for the gate: the model order (per-invocation `model`, definition frontmatter, `CLAUDE_CODE_SUBAGENT_MODEL`, main model); `CLAUDE_CODE_SUBAGENT_MODEL_FORCE`, under which "Claude can't pass a model when it starts a subagent"; and forks, whose model is "Same as main session".
- **A12**: SUPPORTED, with a fork exception: a fork inherits the whole conversation.

### tools-reference.md — NOISE

- **A2**: SUPPORTED: "Hook `matcher` fields use bare tool names, not the parenthesized rule format."
- Additive: a `SubagentHandback` tool in auto mode (2.1.271 and later); the Agent section names no model or effort parameter.

### workflows.md — NOISE for anchored rows; new model-order text

- **A11** (Workflow half): SUPPORTED. The prompt-cache sentence still presupposes per-agent model and effort, and the page names the `/workflow-authoring` bundled skill as the option reference.
- **A8**: unchanged and docs-silent; the page names no per-spawn hook event.
- New: "Claude Code picks each workflow agent's model in the same order it uses for subagents. A model the script names for a stage counts as the per-invocation model in that order. When nothing else assigns one, the agent runs on your session's model." Also a `workflowSizeGuideline` setting.
- Apparent conflict: the page says `claude --effort ultracode` "also sets the effort level to `xhigh`"; the 2.1.284 changelog says Ultracode "no longer forces xhigh effort". The model configuration page reconciles them: turning ultracode on with `/effort` or the `ultracode` setting "leaves the effort level unchanged", and the `--effort ultracode` flag also sets `xhigh`. Not anchored by any skill claim.

## Unanchored sources that changed claims

The ladder's model facts rest on pages the drift check does not hash: the platform models overview and effort page (row A18: Haiku 5.5 takes effort, the 5.5 models default to medium in Claude Code), the Claude Code model configuration page (alias version floors, default main model), and the Claude Code changelog (2.1.292 Agent `effort`; 2.1.292 workflow agents in the mod `agent.spawn` hook; 2.1.295 `onFailure: "block"`). The research record [lineup-5.5-renovation-2026-10-08.md](../research/lineup-5.5-renovation-2026-10-08.md) holds those findings.

## Corrections needed

- **COVERAGE A3**: cite the hooks.md PreToolUse Agent table for `model`; keep `run_in_background` empirical.
- **COVERAGE A6**: add context-window.md as the compaction basis for unscoped rules; keep the user-level inference note.
- **COVERAGE A10**: add plugins/cli-reference.md; README Configuration gains "from its last scope".
- **COVERAGE A11**: split into definition pinning (documented), Agent per-call effort (documented, 2.1.292 and later, non-fork), and the no-parameter default (docs-silent; live 2026-09-03 observation).
- **COVERAGE A14, A15, A17**: mark documented as above, keeping the empirical halves named.
- **COVERAGE A18**: rewrite for Haiku 5.5, the Claude Code medium defaults, and Haiku 4.5 as legacy.
- **New rows**: fork model inheritance (sub-agents.md); `CLAUDE_CODE_SUBAGENT_MODEL_FORCE` incompatibility with the gate (sub-agents.md, env-vars.md); safety-classifier fallback inside subagents (model-config.md). The mod `agent.spawn` hook on workflow agents (changelog 2.1.292, docs-silent) belongs in row A8, beside the gap it could close.
- **Skill**: the effort-surface rule, the haiku row, and the per-spawn Enforcement sentence, as drafted in the research record's remedies.

## Method and limitations

Four read-only scoping agents on `sonnet` fetched the eight pages as markdown with curl on 2026-10-08 and checked each COVERAGE row against the current text, quoting verbatim. A `fable` gate re-fetched the consequential findings. No stored copy of the 2026-09-14 page text exists, so verdicts test each row's current support and do not attribute changes to specific hunks. The contract suite, `/delegation-tiering:canary`, and `check-drift.js --update` were not run as part of scoping.

## Disposition

Claim-affecting (hooks.md, plugins-reference.md, sub-agents.md), so `check-drift.js --update` waits. Per REMEDIATION step 2 onward: run the contract suite and the canary, edit the COVERAGE rows and the skill in one PR, and refresh `anchors.json` in that PR after the edits. Citing model-config.md, env-vars.md, context-window.md, and plugins/cli-reference.md in COVERAGE adds them to the watch, because the watched set derives from citations.
