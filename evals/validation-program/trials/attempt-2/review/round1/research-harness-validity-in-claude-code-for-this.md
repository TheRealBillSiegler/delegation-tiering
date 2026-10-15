# Research pillar: harness validity in Claude Code for this trial

## Questions

### Q1. (a1) What does a PreToolUse deny look like, and does the model see the hook's reason text?

Why here: The observer's whole stop mechanism rests on the model reading 'Recorded... reply with the single word done'. The docs confirm the reason is shown, so the text is a real channel, and it is also a possible leak if it differs by arm. Documented JSON shape: hookSpecificOutput.hookEventName 'PreToolUse', permissionDecision 'deny', permissionDecisionReason. Exit code 2 routes the same way, with stderr as the reason.

Source: https://code.claude.com/docs/en/hooks.md
Quote: For `"deny"`, shown to Claude. For `"allow"` and `"defer"`, written to the debug log only.

Draft: answered: Instrument 1 uses a deny with a fixed reason and says the denial text names no arm or model (Blinding section).

### Q2. (a2) What happens when two hooks on the same event return different decisions?

Why here: Arm D has the gate and the observer firing on one Agent call. A deny beats everything else, so the observer's deny and the gate's deny coexist. The docs do not say which of two deny reasons the model sees or whether both are shown. Hooks also run in parallel (hooks.md: 'All matching hooks run in parallel'), so there is no ordering to lean on.

Source: https://code.claude.com/docs/en/hooks.md
Quote: When multiple PreToolUse hooks return different decisions, precedence is `deny` > `defer` > `ask` > `allow`.

Draft: partly: Instrument 1 says the parser records both hooks' decisions in arm D, but nothing probes which reason text the model sees when both deny.

### Q3. (a3) Can a hook add context on an allowed call?

Why here: Yes by documentation: PreToolUse additionalContext is delivered next to the tool result. This is how the 0.1.2 gate's allow-path reminder works. The reminder lands only after the call exists, so it cannot shape the first choice. In Instrument 1 an observer deny blocks the call anyway. The docs do not say outright that additionalContext is honored on allow (the table does not restrict it, which is an inference).

Source: https://code.claude.com/docs/en/hooks.md
Quote: String added to Claude's context alongside the tool result. Ignored when `permissionDecision` is `"defer"`.

Draft: missing: the draft never addresses the allow-path reminder or when it can reach the model; it matters only for Instrument 2 and for reading D versus RS.

### Q4. (a4) Does a deny end the turn or the session?

Why here: No. A plain deny only prevents the tool call and shows Claude the reason, so the session ends only if the model obeys 'reply done'. The documented way to stop is the universal continue:false field, which the docs say applies to PreToolUse. Whether continue:false ends a -p session cleanly with a result is not stated. The draft's stop depends on model compliance, and a non-compliant model re-issues, tries Workflow after Agent, or does the work itself and spends worker money.

Source: https://code.claude.com/docs/en/hooks.md
Quote: For `PreToolUse` and `PostToolUse` hooks, the stop applies even when the tool call fails or completes while Claude is still streaming a response.

Draft: partly: the draft says the session 'ends one turn after' the denial but treats this as certain; probe I5 tests it only for the deny-and-reply route, not continue:false or defer.

### Q5. (a5) Is there a documented clean exit at the first tool call in -p mode (the defer decision)?

Why here: defer is honored only with -p. The process exits with stop_reason tool_deferred and the call stays in the transcript, with no extra model turn. But it is ignored when the turn has several tool calls (T03 and T12 invite parallel Agent calls), and deny outranks defer, so in arm D the gate's deny would override it.

Source: https://code.claude.com/docs/en/hooks.md
Quote: `"defer"` only works when Claude makes a single tool call in the turn.

Draft: missing: defer and continue:false are not considered as the stop mechanism.

### Q6. (a6) What happens if the observer hook errors out or times out?

Why here: A hook that fails or times out does not block the call. The Agent call then runs, a worker runs to completion, and the cheap-capture premise breaks silently. The docs offer onFailure:'block' (v2.1.295 or later) to fail closed. The gate's own skill text already warns that a gate that cannot start allows every call without notice.

Source: https://code.claude.com/docs/en/hooks.md
Quote: A timed-out `command`, `http`, or `mcp_tool` hook doesn't block the tool call.

Draft: missing: Instrument 1 has no fail-closed setting and no check that a session which delegated also ended without a worker.

### Q7. (b1) May a case list more than one directory under the plugins field?

Why here: The field is plural and the examples use array syntax, but no sentence says more than one directory is allowed or how they are ordered or deduplicated. Every arm depends on the helper observer riding beside the plugin under test, so this is a hard dependency.

Source: https://code.claude.com/docs/en/plugin-evals.md
Quote: Plugin directories under test, relative to the case directory.

Draft: partly: probe I4 tests two directories under --ablation none, which is the right test because the docs do not state it.

### Q8. (b2) What does the ablation baseline arm do with the listed plugins?

Why here: The baseline arm removes every plugin, so the observer would vanish from the baseline arm along with the plugin under test. That confirms the draft's choice to run --ablation none with each arm as its own case.

Source: https://code.claude.com/docs/en/plugin-evals.md
Quote: The with-arm is its runs with the plugin loaded, and the without-arm is the same number of runs with no plugin at all.

Draft: answered: the Harness section runs --ablation none and does not use the harness baseline arm.

### Q9. (c) Are a scaffold script's writes under the temporary HOME documented as loaded or ignored?

Why here: Neither way for user-level files. The page says only that project-level configuration a scaffold writes is not loaded, and that a scaffold can supply only files and git state. The 'ship hooks in the plugin' sentence leans toward ignored. Also undocumented: whether the harness's 'Claude Code configuration' directory is HOME/.claude. Native Windows reads the home from USERPROFILE and the harness might set CLAUDE_CONFIG_DIR (both my inference, not in the docs). Scaffolds also run only with --scaffold.

Source: https://code.claude.com/docs/en/plugin-evals.md
Quote: no `.claude/` directory, `CLAUDE.md`, or `.mcp.json` loads from above the workspace or inside it, even one a `scaffold_script` wrote

Draft: partly: the draft states the gap correctly and sends it to probe I1, but does not mention --scaffold, Windows USERPROFILE, or finding the real config directory first.

### Q10. (d) Do forked subagents exist in a non-interactive session, and how is a fork requested?

Why here: Fork mode is off by default under -p unless turned on. A fork is requested through the Agent tool's `fork` subagent type, and CLAUDE_CODE_FORK_SUBAGENT=1 turns it on (the docs cite it for versions before v2.1.232). So the attempt-1 child offers no fork, and T23's label ('a fork disagrees') cannot fire. Turning fork mode on changes the Agent tool for every task, and subagents then run in the background by default.

Source: https://code.claude.com/docs/en/sub-agents.md
Quote: Claude Code turns fork mode on by default in interactive sessions and leaves it off by default in non-interactive mode with `-p` and in the Agent SDK.

Draft: partly: probe I7 asks whether the fork option exists, which the docs already answer (no, by default); the draft does not consider turning fork mode on or what that does to the other 24 tasks.

### Q11. (e1) Can CLAUDE_CODE_EFFORT_LEVEL cross into the plugin-eval child although env keys must match EVAL_*?

Why here: The case-level env field is EVAL_* only, but the run inherits an allowlist from the launching shell that includes most CLAUDE_CODE_* configuration. Attempt 1 observed the crossing. The sub-agents page says this variable outranks the per-call effort parameter and the frontmatter effort. So under the variable, any effort the orchestrator names would be overridden in the worker, and the stated effort becomes an intention, not an effect.

Source: https://code.claude.com/docs/en/plugin-evals.md
Quote: most `ANTHROPIC_*` and `CLAUDE_CODE_*` configuration, and `EVAL_*`

Draft: partly: the draft uses the variable for attempt 1's route and notes it removed the parameter, but does not note that the variable overrides named efforts by documentation.

### Q12. (e2) Does a settings-file effortLevel set the session effort of an Opus 5.5 child?

Why here: By the model-config page, no: a top-level effortLevel in a user settings file does not count for Opus 5.5, which starts at medium; the per-model modelSettings key is the route (its shape is on the settings-reference page, which I did not fetch). A top-level effortLevel passed with --settings or in project, local, or managed settings applies to every model, but the eval child loads none of those. The draft's I2 (effortLevel in a scaffold-written user settings.json, main run on Opus 5.5) is predicted to fail even if scaffold-written user settings load. It would work for the Fable transfer subset.

Source: https://code.claude.com/docs/en/model-config.md
Quote: a top-level `effortLevel` in your user settings file doesn't count for Opus 5.5.

Draft: missing: the Orchestrator model and effort section and probe I2 use effortLevel with Opus 5.5 and never mention this carve-out.

### Q13. (e3) Can the plugin itself carry effort or settings into the child?

Why here: Plugin settings.json and the manifest settings key accept only agent and subagentStatusLine, so a plugin cannot set effortLevel. But the agent key can make the main session run as a plugin-supplied agent, and agent frontmatter effort overrides the session level (but not the env variable). That is a documented, untested route to xhigh that keeps the Agent tool's effort parameter, but it replaces or adds to the main system prompt, so it must be identical across arms.

Source: https://code.claude.com/docs/en/plugins-reference.md
Quote: Settings Claude Code applies while the plugin is enabled. Only `agent` and `subagentStatusLine` take effect; other keys are dropped at load.

Draft: missing: no probe covers the plugin agent-setting route or skill/agent frontmatter effort.

### Q14. (f1) Do plugin hooks run in a plugin-eval child?

Why here: Yes by documentation: the eval loads the target plugin's hooks, and they run outside the agent's sandbox. The hooks page lists plugin hooks/hooks.json as active when the plugin is enabled. The docs never say in one sentence that plugin hooks run under -p. That is an inference from the eval page, the headless page, and attempt 1's observed gate denials.

Source: https://code.claude.com/docs/en/plugin-evals.md
Quote: `claude plugin eval` loads the target plugin's skills, hooks, and agents and runs its eval suite on your machine, as you.

Draft: answered: the draft relies on it, and attempt 1 saw gate denials in the child.

### Q15. (f2) Does a plugin with no hooks file load?

Why here: Almost certainly yes: the manifest is optional, and hooks/hooks.json is merged 'when that file exists'. The trap is the manifest: a `hooks` key in plugin.json is merged with, and loaded beside, the default file, and a declared path that does not exist does not load. Deleting the file is not proof that the skill-only variant has no gate; commit 64442d8 already shows manifest-versus-file hook duplication broke 0.1.1.

Source: https://code.claude.com/docs/en/plugins-reference.md
Quote: Claude Code merges whatever you declare with `hooks/hooks.json` when that file exists.

Draft: partly: the draft deletes hooks/hooks.json and asserts the file diff; it does not check plugin.json for a hooks key or verify absence of gate activity.

### Q16. I1: does a scaffold-written $HOME/.claude/CLAUDE.md and rules/x.md reach the child?

Why here: RULING: must run, with a leaning against. The docs are silent on user-level files, but the 'only files and git state' sentence implies not. Precondition: inspect a --keep-temp sandbox to find where the harness puts its Claude Code configuration, and pass --scaffold. Fallbacks the docs support: append_system_prompt (attempt 1) or a helper-plugin SessionStart hook additionalContext, which the docs say is added 'at the start of the conversation, before the first prompt'. Its behavior under -p is not stated. A CLAUDE.md at a plugin root is documented as not loaded.

Source: https://code.claude.com/docs/en/plugin-evals.md
Quote: no `.claude/` directory, `CLAUDE.md`, or `.mcp.json` loads from above the workspace or inside it, even one a `scaffold_script` wrote

Draft: partly: I1 is defined and gates the delivery route; its fallback is only append_system_prompt.

### Q17. I2: with a scaffold-written settings.json effortLevel xhigh and no env variable, does the transcript stamp xhigh and keep the Agent effort parameter?

Why here: RULING: the docs partly answer, so redesign before running. For Opus 5.5 a user-level top-level effortLevel does not count; use modelSettings, or the plugin agent route, or accept the medium default (pilot: parameter present 72 of 72). Whether scaffold-written user settings load at all is undocumented, so a run is still needed for that.

Source: https://code.claude.com/docs/en/model-config.md
Quote: a top-level `effortLevel` in your user settings file doesn't count for Opus 5.5.

Draft: partly: I2 exists, but its design contradicts the documented Opus 5.5 behavior.

### Q18. I3: does setting CLAUDE_CODE_EFFORT_LEVEL=medium explicitly remove the Agent tool's effort parameter?

Why here: RULING: must run. The docs say the variable overrides the per-call parameter but never say the schema omits the parameter (FACTS.md also found no page that states any omission condition). Run xhigh via the variable as well on 2.1.296, because attempt 1's absence was seen on 2.1.295 and the medium run alone cannot separate 'variable' from 'level'. Also run with the variable unset.

Source: https://code.claude.com/docs/en/sub-agents.md
Quote: The `CLAUDE_CODE_EFFORT_LEVEL` environment variable takes precedence over both.

Draft: partly: I3 tests medium via the variable, which separates variable from level only if xhigh via the variable is rerun on the same version.

### Q19. I4: do two directories in plugins: both load under --ablation none?

Why here: RULING: must run. The docs imply it through the plural field and array syntax but do not state it. Verify with the child's plugin list or load errors; the headless page documents plugins and plugin_errors in system/init for stream-json, though whether the eval transcript keeps that event is unknown.

Source: https://code.claude.com/docs/en/plugin-evals.md
Quote: Plugin directories under test, relative to the case directory.

Draft: answered: I4 is defined and is the right probe.

### Q20. I5: does the observer record the first Agent input, does the session end on its denial, and does it record a Workflow script?

Why here: RULING: must run, and widen it. The docs show the hook's Agent input fields as prompt, description, subagent_type and model, with no effort field, and give no Workflow input fields at all, so the observer may not see effort or script. The docs also do not guarantee the session ends. Test deny-plus-reply, continue:false, and defer, each with a one-call task and a parallel-call task (T03).

Source: https://code.claude.com/docs/en/hooks.md
Quote: For `PreToolUse` and `PostToolUse` hooks, the stop applies even when the tool call fails or completes while Claude is still streaming a response.

Draft: partly: I5 covers the deny route for one Agent call and one Workflow, but not parallel calls, the other stop mechanisms, or missing hook input fields.

### Q21. I6: does the hooks-free plugin variant load and is its skill invokable?

Why here: RULING: the docs answer load (manifest optional, hooks file conditional), so fold I6 into I4 and I5 as a smoke test. The one thing to run is the skill invocation, and to confirm the gate is absent: no gate decision and no ledger entry in the sessions of arms RS and S.

Source: https://code.claude.com/docs/en/plugins-reference.md
Quote: Claude Code merges whatever you declare with `hooks/hooks.json` when that file exists.

Draft: partly: I6 is defined as a separate probe; it should add the manifest check and the absence check.

### Q22. I7: does the child's Agent tool offer the fork option?

Why here: RULING: the docs answer it. Fork mode is off by default under -p, so the option is absent unless CLAUDE_CODE_FORK_SUBAGENT=1 is set. The probe worth running is a different one: whether that variable crosses the eval allowlist ('most' CLAUDE_CODE_* variables do) and what it does to the Agent schema and to background execution for all arms.

Source: https://code.claude.com/docs/en/sub-agents.md
Quote: Claude Code turns fork mode on by default in interactive sessions and leaves it off by default in non-interactive mode with `-p` and in the Agent SDK.

Draft: partly: I7 is defined, but it asks a question the docs have answered and leaves T23 conditional on it.

## Recommendations

1. [must] (Instrument 1, capture and stop) Test three stop mechanisms in I5 and pick by cost and cleanliness: deny plus 'reply done' (the draft's), deny plus continue:false, and defer. Make the observer fail closed with onFailure:'block' and add a parser check that every delegating session ended with no worker transcript.
   Rationale: A plain deny does not end a session; the stop depends on model compliance. continue:false is documented for PreToolUse; defer is documented for -p but only for single-call turns and loses to the gate's deny. Hook failure and timeout are fail-open, which would turn a cheap capture into a full worker run unnoticed.

2. [must] (Instrument 1, capture and stop) Record every matching call in the first assistant turn (tool_use_id, order, full tool_input from hook stdin), not 'the first matching call'. Define 'first delegation' as the set of delegating calls in the first delegating turn. Do not read transcript_path inside the hook.
   Rationale: Hooks run in parallel and T03, T12, T20 and T21 invite several calls in one turn, so the first file write is arbitrary. The docs say the transcript file is written asynchronously and may lag. The transcript is also kept via --keep-temp, so the observer's file is a stop device and a cross-check, not the primary record.

3. [should] (Arm D in Instrument 1) State that D versus RS under Instrument 1 is a null by construction, and demote D there to a negative control (an estimate of run-to-run noise). Move the gate question wholly to Instrument 2.
   Rationale: The 0.1.2 hooks are a PreToolUse gate and an async PostToolUse ledger, no SessionStart or prompt hook. Both fire after the model has composed the call, so neither can alter the first choice. This also answers open question 1: the denial text is seen only after the choice, so it cannot bias it. Dropping D saves about 50 sessions.

4. [must] (Orchestrator model and effort, probe I2) Redesign I2 for Opus 5.5: use modelSettings (read the settings-reference page for its shape) or the plugin-agent route (plugin settings.json agent key, agent frontmatter effort xhigh), and keep the medium default as the stated fallback. Keep effortLevel only for the Fable transfer subset, which it should apply to. Record for each route whether the Agent tool definition carries effort.
   Rationale: The model-config page says a top-level effortLevel in a user settings file does not count for Opus 5.5. Plugins cannot set effortLevel. The env variable outranks per-call efforts by documentation, so under it the named effort is intention only; say so in the effort endpoints.

5. [should] (Probe I1 and the delivery route) Before I1, run one --keep-temp session and list the sandbox to see where the harness puts its configuration; pass --scaffold; confirm Bash is available for scaffold scripts on this machine; and check USERPROFILE versus HOME. If the loader route fails, choose between append_system_prompt in every arm and a helper-plugin SessionStart additionalContext hook, and probe the second under -p.
   Rationale: The docs leave user-level scaffold files undocumented and lean against loading. The loader-versus-append difference is the draft's largest stated limit; a SessionStart hook is the only documented context channel that is not a system-prompt append, but under -p its behavior is untested and it changes the surface.

6. [should] (Task T23 and probe I7) Replace I7 with a probe of CLAUDE_CODE_FORK_SUBAGENT=1 crossing the eval allowlist, and decide fork mode once for all arms; if it is turned on, rerun T01 to T06 as a schema-change check. Otherwise drop T23 from the divergent set (the child cannot fork) and state that the gate's fork exemption is untested.
   Rationale: Fork mode is off by default under -p, and turning it on changes the Agent tool for every task and makes subagents background by default. The owner's interactive sessions have it on, so fork-on is arguably the more faithful setting, but it must be identical across arms and tested for effect on the other tasks.

7. [should] (Skill-only plugin variant) Assert on the resolved hook set, not just the deleted file: confirm plugin.json has no hooks key, and that arms RS and S show no gate decision and no ledger record. Add a harmless always-loaded second hooks-free plugin check inside I4.
   Rationale: A manifest hooks key is merged with hooks/hooks.json, so deleting the file may leave the gate in place; 0.1.1 already broke on manifest-versus-file hook duplication.

8. [should] (Probe I3) Run three cells on 2.1.296: variable unset, variable medium, variable xhigh. Record the Agent tool definition from the transcript in each. Pin the CLI version for the whole trial and re-read the docs if it changes.
   Rationale: The only evidence for variable-removes-parameter is attempt 1 on 2.1.295 at xhigh. The medium cell alone cannot tell the variable from the level, and the docs state no omission rule.

9. [should] (Probe I5, hook input) Add to I5: log the raw hook stdin for an Agent call that names an effort, and for a Workflow launch, and see whether tool_input carries effort and script or scriptPath. If not, parse the transcript for those fields.
   Rationale: The hooks page lists Agent input fields without effort and gives no Workflow input fields.

10. [consider] (Probe I4 and helper plugin) Use a distinct helper name, load check via plugin errors if the kept transcript exposes system/init, and keep --ablation none for every run.
   Rationale: The baseline arm removes all plugins, so only ablation none keeps the helper. Multi-directory loading is undocumented.

11. [should] (Arm D, deny text) Add a two-deny probe to I5 (gate deny plus observer deny) and log which reason text the model sees in the next turn; if it is the gate's, the 'reply done' instruction never arrives in D and the session will not end.
   Rationale: The docs give a decision precedence, not a rule for which reason is displayed.

12. [consider] (Hook command on Windows) Write the observer in the gate's exec form (command node plus args with ${CLAUDE_PLUGIN_ROOT}), and test it on this machine with node on the PATH the child inherits.
   Rationale: The child's environment is an allowlist; a shell-form command on Windows risks quoting and path failures that would show up as the fail-open case above.

## Gaps

- The quotes from hooks.md, sub-agents.md and model-config.md came back through WebFetch's summarizing model, not as raw page text. I checked the plugin-evals quotes against the saved raw page, and plugins-reference.md returned raw text. The hooks, sub-agents and model-config quotes are as extracted and are not independently re-verified.
- hooks.md is 268,801 characters; I read 0 to 200,000 through the summarizer, and from 200,000 on I only grepped the saved text, so a passage on plugin hooks under -p or on continue:false for PreToolUse in that tail could have been missed. No page states in one sentence that plugin hooks run under -p; (f1) is an inference from the eval page, the hooks locations table and attempt 1's observed denials.
- I did not fetch settings-reference (the modelSettings shape and the effortLevel entry), env-vars (CLAUDE_CODE_FORK_SUBAGENT), or the plugin components page, so the modelSettings route in (e2) and the fork variable's allowlist behavior are unverified.
- Not documented anywhere I read: which of two deny reasons the model sees; whether continue:false ends a -p session with a result; the Workflow tool's hook input fields; whether the Agent hook input carries effort; whether the harness sets USERPROFILE or CLAUDE_CONFIG_DIR for the child (my inference about Windows home resolution is not from the docs).
- For the attempt-1 files I read PROTOCOL.md in full and grepped FULL-RESULTS.md; I did not read PILOT-RESULTS.md or the program README, so any attempt-1 fact beyond FACTS.md and the grep hits was not cross-checked.
- The additionalContext-on-allow answer rests on the delivery-points list and the unrestricted table row, not on a sentence that says 'on allow'.