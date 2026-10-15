# Survival: harness, instruments and feasibility

Verdict: v2 is registrable with named edits, not as written. Nothing found in round 3 stops H2 from running on this machine: the flags it needs exist on 2.1.296 (--tools, --max-budget-usd, --effort, --plugin-dir), the docs support a PostToolBatch stop, and most remaining risks sit behind probes that already have pre-declared branches. Before registration v2 needs these edits: replace I1's owner-hash criterion (R3-H03); key the stop on the observer's own records and handle a failing PostToolBatch hook (R3-H01, R3-H02); set the background-wait ceiling and the fork outcomes for Instrument 2 (R3-H07, R3-H08); move sweep.js into an overlay (R3-H09); make the gate subset's minimum reachable (R3-H10); copy and hash the binary (R3-H11); and order the sequence so the token, the spend ceiling and the effort level come before everything that depends on them (R3-H13, R3-H14).

## Prior attacks

- A2 [partly]: H2 never uses `plugins:`. The H1 fallback's explicit-list rule exists only in v1 (v2 line 67: 'its differences are listed in v1 and apply unchanged'), so the registered text has to inline it or hash v1 into the manifest.
- A6 [partly]: --effort replaces the variable, and I2 probes the parameter at each level. But I2 has no medium cell, depends on the fork setting that I6 decides in the same step, and can conflict with I10's exposure rule with no tie-break (R3-H13).
- A9 [partly]: I6 sets one fork setting for both instruments, but v2 drops the critic's advice to keep Instrument 2 fork-off and the ledger does not record that. With fork mode on in -p, every worker runs in the background under a 10-minute idle ceiling, and FD1-FD3 gain a fork path the gate does not deny (R3-H07, R3-H08).
- A10 [partly]: The FAILS ruling was correct: the script is in the hook input. Of the three residuals, only the offline lint recompute is in v2. How a scouting Agent call before a Workflow launch on D14, R6 or D15 is scored is still not stated.
- A12 [partly]: The property list is inline and confirmed by smoke sessions, but the smoke covers only primary and anchor tasks. The G1-G3 and FD4-FD6 properties are never confirmed, and no rule says what a failed property does to the sequence (R3-H14).
- A14 [partly]: Chunks, per-session caps, rate-limit stops and an owner ceiling are in v2. The failed-stop cost projection the critic required is missing, and the ceiling is signed at step 7, after roughly a third of the projected spend (probes, 26 full-execution smoke sessions, the 184-session screen).
- H2-03 [partly]: The warm-up template and the per-session tool-list and Agent-hash exclusion are adopted. But the owner-hash check cannot work while the owner's sessions run (R3-H03); the template fixes only the starting flags, since each child refetches and saves; there is no branch for a warm-up that writes no cache; and the sequence builds the template after the probes (R3-H04).
- H2-06 [partly]: Token storage, env-only passing, the scrub and the stated residual are adopted. The critic's other edit was not adopted, and the ledger does not list it as not adopted: read the owner's 5-hour and weekly meters before and after the smoke run, and set chunk ceilings as shares of the plan meter.
- H2-09 [partly]: The allowlist is adopted in principle, but v2 names neither the system variables nor the full registered set (the critic's CLAUDE_CODE_DISABLE_OFFICIAL_MARKETPLACE_AUTOINSTALL is absent). It only logs variable names per chunk instead of registering a hashed list. Instrument 2 also needs CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS (R3-H07).
- H2-11 [partly]: enableWorkflows, Workflow in both tool flags and the I1 assertion are adopted. The critic's Workflow-specific branch (D14 and D15 under H1, or out of the primary set) is missing, so a Workflow-only failure in I1 sends the whole trial to H1.
- RH4 (must: redesign I2) [partly]: Same status as A6: the route is fixed, but the level rule is incomplete and conflicts with I10 (R3-H13).
- RH6 (should: one fork setting for all arms; schema check under fork-on) [partly]: I6 sets fork mode once for every arm, but I2 'with the main run's exact flags' must run after I6, and the sequence runs them together (R3-H13).
- RH12 (consider: exec-form hook commands on Windows, node on PATH) [unresolved]: v2 does not specify the observer hooks' command form. Under an allowlisted PATH, a shell-form command depends on a shell and on node being reachable, and with onFailure:block a launch failure blocks every call. Register the exec form (command node, args), as the gate uses.
- RC11 (controls pillar: no-observer replication of the first call) [unresolved]: Ledger CL3 says a consistency check (Instrument 2's first delegations against Instrument 1's) was registered, but neither v1 nor v2 contains it. v2's shared fork setting now makes it computable on the gate subset; add it to the descriptive list.

(resolved items omitted; count: 34)

## New attacks

### R3-H01 [BOUNDS] target: Instrument 1 PostToolBatch stop (v2 line 74) and I5's fallback (line 101)

Attack: The stop fires only 'when the batch's tool_calls include an Agent or Workflow call'. hooks.md describes tool_calls as every call in the batch, each carrying the tool_response the model sees, and its example shows only executed calls. It never says whether a call that a PreToolUse hook denied is in the array. If denied calls are absent, PostToolBatch fires but never stops the loop: the model sees the fixed deny reason and continues until it stops or hits the cap. The registered fallback triggers only if PostToolBatch 'does not fire', so this case has no branch, and the 'ended by the observer' test (terminal_reason plus batch record) fails on every session.

Required edit: Key the stop on the observer's own records. The PostToolBatch hook returns continue:false when any <session_id>-*.json written by the PreToolUse hook exists for the session (PreToolUse has finished for every call before the batch resolves), and it writes tool_calls as the batch record whatever the array holds. I5 records whether denied calls appear in tool_calls and with what tool_response. Widen the fallback to 'does not fire, or fires without the denied calls', and use the transcript against the PreToolUse files as the cross-check when tool_calls omits denials.

Evidence: scratchpad/h2docs/hooks.md lines 2289-2322 (saved live page): 'Runs once after every tool call in a batch has resolved'; tool_calls is 'an array describing every tool call in the batch'; the example holds two executed Reads with tool_response. No sentence addresses PreToolUse-denied calls. PROTOCOL-v2 lines 74, 76, 101.

Checkable: The PostToolBatch section of hooks.md does not state whether a call denied by a PreToolUse hook is included in the hook's tool_calls array.

### R3-H02 [BOUNDS] target: onFailure: "block" on the PostToolBatch hook (v2 line 71) and the failure-handling table (lines 235-246)

Attack: PostToolBatch runs after every batch, including the Skill call and the Reads before the first delegation. hooks.md defines onFailure as what happens 'to the action when the hook fails' and does not say what that action is for PostToolBatch. If a failure there blocks the next model call, a transient hook failure (a node start-up error, or the 10 s timeout under concurrency 4) on a pre-delegation batch ends the session with no delegating turn. v2 scores that as a non-match on every endpoint. RS and S run one more batch than R (the Skill call), so exposure to this failure differs by arm. The PostToolBatch hook does not need to fail closed: PreToolUse with onFailure:block already prevents any worker, so a failed stop costs only turns.

Required edit: Drop onFailure:block from the PostToolBatch hook and keep it on PreToolUse. Otherwise, add a failure row: a session whose transcript shows a hook-failure block before its first delegating turn is an infrastructure fault, excluded and re-run once. I5 forces a PostToolBatch failure on a Read batch and records what happens.

Evidence: scratchpad/h2docs/hooks.md line 461 (onFailure: 'What happens to the action when the hook fails') and line 883 ('To block the action instead, set onFailure: block'). PROTOCOL-v2 line 71 ('both with onFailure: "block"'), line 242 (no delegating turn is a non-match), line 220 (Skill calls before the first delegating turn). FULL-RESULTS: the skill was invoked in 16 of 16 C and 14 of 14 D runs.

Checkable: PROTOCOL-v2's failure-handling table has no row for a session stopped by a hook failure, as opposed to the model, the observer, the cap or a timeout.

### R3-H03 [KILLS] target: Probe I1's criterion 'the owner's ~/.claude.json hash is unchanged' (v2 lines 58 and 97), which helps decide H2 against H1

Attack: The owner's own Claude Code sessions rewrite that file continually, including the session that would run the probe. During this review its modification time was 19 seconds old, with no H2 child running. A before-and-after hash will therefore change without any child touching the file. That fails I1 and routes the whole trial to the H1 fallback, which gives up the loader route that attempt 2 exists to test. A hash also cannot see a read, which is half of what I1 says it records ('whether a child reads or writes it').

Required edit: Replace the hash with positive checks that can be attributed to the child. After the I1 session: (1) the child's configuration directory holds a .claude.json created or modified during the session, carrying the template's userID; (2) the owner's ~/.claude.json has no projects entry for any path under the neutral root, and its userID and oauthAccount keys are unchanged. Optionally, run one Process Monitor trace of the I1 child filtered on the owner's file path, in I1 only.

Evidence: This review: `ls --full-time ~/.claude.json` gave 2026-10-12 00:23:52 -0400 while `date -u` gave 04:24:11 UTC, with no child launched. scratchpad/h2docs/claude-directory.md line 1552: backups/ holds earlier versions of ~/.claude.json, 'copied when Claude Code rewrites the file'. H2-03's key list (cachedGrowthBookFeatures, projects, userID).

Checkable: The modification time of ~/.claude.json advances while the owner's Claude Code sessions run, with no H2 child launched.

### R3-H04 [BOUNDS] target: The warm-up flag cache and config template (v2 line 58; probe I1; pre-registration step 2)

Attack: (a) The docs say a session that fetches flags saves them. Each child therefore refetches at start and runs on the template's cache only until that fetch lands. Server-side flag changes during a multi-day run still reach later sessions. The version check cannot see them, and the Agent-definition hash sees them only when they change the Agent schema. (b) Step 2 fixes the template after probes I1 to I9, yet I1 checks that the warm-up cache is present, and I2, I5 and I6 certify behavior that depends on the flags. (c) There is no branch for a token warm-up that writes no cache at all, which H2-03 named as a decision point.

Required edit: Order step 2 as: warm-up, then freeze and hash the template, then the probes. In every session, diff the child's post-session flag cache against the template and report changed keys by chunk. Treat a change in a registered key set (workflow, agent, subagent, fork and streaming-tool flags) like a version mismatch: close the chunk at its last complete block. Pre-declare that if the warm-up writes no cache, sessions run as first sessions, the per-session tool-list and Agent-hash exclusions are the guard, and Limits says so.

Evidence: scratchpad/h2docs/env-vars.md, 'First session after an install or upgrade' (about lines 589-593): 'When Claude Code fetches the flags during that session, it saves them on the machine', and non-interactive sessions 'don't always wait' for the flags. PROTOCOL-v2 line 97 (I1 requires the warm-up cache) and line 328 (step 2 order). H2-03.

Checkable: PROTOCOL-v2's step 2 lists 'fix the config template from the warm-up session' after 'run probes I1 to I9', while I1 requires the warm-up session's flag cache to be present.

### R3-H05 [BOUNDS] target: The isolation statement (v2 line 62), the plugin directories (line 50), and the D-minus-RS reading (line 276)

Attack: blockReadsOutsideWorkingDirectories keeps 'files Claude Code itself needs' readable, 'such as your skills, plugins, rules, agents, commands'. So 'Reads outside it are refused' is false for the plugin directory, and possibly for the session's own configuration directory. In D, the readable plugin tree contains hooks/README.md and the gate scripts. SKILL.md points to that README ('Mechanics and limits: the plugin's hooks/README.md'), but the RS tree has no hooks/ directory, so in RS the same pointer leads nowhere. That is a second D-versus-RS difference before the first delegating turn, which contradicts 'the hooks manifest being the only one'. If the configuration directory's settings.json is readable, it contains 'hooks', 'PreToolUse' and 'Agent|Workflow', and the banned-string check cannot cover it.

Required edit: Restate isolation: the plugin directory and Claude Code's own configuration files stay readable by design. Add to I1 and I4 a Read of <plugin>/hooks/README.md in D, of the skill directory in RS, and of <config>/settings.json, with each outcome registered. Name the hooks/ contents as a second D-RS difference in the descriptive sentence. Record reads under the configuration directory as a mediator beside plugin reads, and keep the observer scripts outside the configuration directory under neutral names.

Evidence: scratchpad/h2docs/settings-reference.md line 1616: 'Files Claude Code itself needs stay readable, such as your skills, plugins, rules, agents, commands'. SKILL-0.1.2.md line 68. `git ls-tree --name-only 5886ff7 hooks/` lists README.md, agent-model-gate.js, delegation-ledger.js, hooks.json, ledger.js and tiers.js. PROTOCOL-v2 lines 50, 62, 276.

Checkable: settings-reference.md says that under permissions.blockReadsOutsideWorkingDirectories, skills, plugins and rules that Claude Code itself needs stay readable.

### R3-H06 [BOUNDS] target: --tools "Agent,Skill,Read,Glob,Grep,Workflow" and I1's 'init tool list is exactly the six names' (v2 lines 61 and 97)

Attack: Attempt 1's init tool list named the delegation tool Task while the calls were named Agent, so an exact-name check can fail on the alias and push the trial to H1. Separately, --tools excludes ToolSearch. On this install some built-in tools are deferred behind ToolSearch: this review's own session lists WebFetch, Monitor, NotebookEdit and SendMessage as deferred. If any of the six is deferred in a -p child, its name appears but the model cannot load its schema.

Required edit: I1 checks the six tools through a registered alias table (Task = Agent), and checks that each has a full input_schema on the transcript's tool-definition line (the agent-schema.js read). Pre-declare that if any of the six is deferred, ToolSearch is added to --tools in every arm and the change is recorded in Limits.

Evidence: PILOT-RESULTS.md, Problems and surprises, item 5 ('The child's init tool list shows the delegation tool as Task, while tool calls in the transcript are named Agent'). scratchpad/h2docs/tools-reference.md line 61 (ToolSearch 'loads deferred tools'). This review session's deferred-tool listing.

Checkable: PILOT-RESULTS.md item 5 says the child's init tool list showed Task while transcript calls were named Agent.

### R3-H07 [BOUNDS] target: Instrument 2 under fork mode on (v2 line 80: 'fork mode as in Instrument 1'; 900 s timeout; --max-budget-usd 4) and the allowlisted environment

Attack: With fork mode on, every subagent runs in the background and Claude cannot ask for the foreground; workflows always run in the background. In -p, Claude Code stops background subagents and workflows after CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS of idle waiting (default 600,000 ms) and drops their partial results. That is five minutes before v2's 900 s timeout, and attempt 1's workflow and opus tasks ran past 900 s. The allowlist does not carry the variable, and no failure row covers a ceiling stop. The budget cap also stops background work, and a spawn after the cap fails with 'Budget limit reached', which the parser could count as a gate denial.

Required edit: Register CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=900000 (or 0, with the runner's timeout as the bound) in Instrument 2's environment. Record the ceiling and the cap as terminal causes. Add a failure row: 'background work stopped by the idle ceiling or the cap after the first delegating turn: first-delegation measures kept, later measures missing'. Have the parser classify 'Budget limit reached' spawn failures apart from gate denials. If I6 turns fork mode on, state that Instrument 2 workers run in the background only, with the reduced background tool set.

Evidence: scratchpad/h2docs/env-vars.md line 362 (default 600000; 'Claude Code stops waiting for the remaining background tasks'). headless.md lines 75-88. sub-agents.md line 906 (fork on: background, 'Claude can't ask for the foreground') and line 440 (reduced background tool set). cli-reference.md line 105 ('spawning another subagent fails with Budget limit reached'). FULL-RESULTS.md, Errors: five 900 s timeouts on T13, T14 and T20.

Checkable: env-vars.md documents CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS with a default of 600000 ms, after which a -p run stops waiting for background subagents and workflows.

### R3-H08 [BOUNDS] target: Forced-denial FD1-FD3 and the reminder measure under fork mode on (v2 lines 86 and 90)

Attack: FD1-FD3 ask for a subagent 'on whatever model is the default, without naming one'. With fork mode on, a fork satisfies that request literally, and the 0.1.2 gate allows a fork with a fork-specific message instead of denying it. The registered outcomes (re-issued with a model, stopped, argued) have no class for this, so a forking session is either unscored or misread as recovery. In G1-G3, a forked second delegation receives the fork message, not the tier reminder that the measure is about.

Required edit: Add 're-issued as a fork' as an FD outcome and as a separate class in the reminder measure. Alternatively, run the gate subset with an Agent(fork) deny rule in both RS and D (the documented way to keep fork mode on while stopping forks) and state that choice.

Evidence: `git show 5886ff7:hooks/agent-model-gate.js` lines 198-203: subagent_type 'fork' is allowed with 'a fork runs on the session model, so forking chooses that tier...'. SKILL-0.1.2.md lines 29 and 68. scratchpad/h2docs/sub-agents.md line 1222 (an Agent(fork) deny keeps fork mode on but stops forks).

Checkable: agent-model-gate.js at 5886ff7 allows an Agent call with subagent_type 'fork' and returns a fork-specific message instead of a denial.

### R3-H09 [BOUNDS] target: tools/sweep.js in the shared fixture (v2 lines 115, 135, 138) and the FD4-FD6 prompt (line 91)

Attack: sweep.js is part of the fixture that every session in every arm receives. A workflow script whose calls take their model from a shared options object must contain agent() calls and model names, both on the banned list. It therefore either fails the fixture check or is allowlisted into every session, and either way every orchestrator has a working delegation script one Glob away. On D14 and R6, which ask the model to write a workflow, the file is a template. Its shared-options pattern scores as an unresolved site (non-agreement), and the skill arms are told that the lint flags that pattern, so the file's pull differs by arm. Separately, 'exactly as written' turns FD4-FD6 into another instruction-priority test, the same confound v2 names for FD1-FD3.

Required edit: Move sweep.js into an overlay applied only to FD4-FD6 sessions, the way D13's review file is handled. Keep the banned-string check with no allowlist entry for it in the shared tree. Reword FD4-FD6 to 'Launch the workflow in <fx>/tools/sweep.js with the Workflow tool.' Smoke the overlay once in D.

Evidence: PROTOCOL-v2 line 115 (sweep.js in the layout of the tree 'copied into every session'); line 138 (banned list includes agent and the four model names); lines 157 and 167 (D14 and R6 ask for a workflow); line 91 ('exactly as written'). SKILL-0.1.2.md line 68 (a model passed through 'a shared options object is flagged').

Checkable: PROTOCOL-v2's fixture layout places tools/sweep.js in the tree copied into every session, while its banned-string list includes 'agent' and all four model names.

### R3-H10 [BOUNDS] target: The gate subset's registered minimum denominator (v2 line 86), the smoke step (step 3, line 329) and the subset size (line 318)

Attack: The minimum is 'at least 10 second delegations per arm in the pre-registration smoke sessions'. The smoke sessions run in arm R only and cover primary and anchor tasks, not G1-G3. So the per-arm count cannot be taken, and the tasks built to produce a second delegation are never smoked. In the main gate subset each task runs once per arm, about 10 sessions per arm, so meeting the minimum needs nearly every session to delegate twice. Attempt 1 recorded 1.00 Agent calls per delegating run. The reminder measure is therefore unmeasurable by construction. In addition, a second call in the same assistant turn as the first cannot have seen the reminder, and the measure does not exclude such calls.

Required edit: Smoke G1-G3 in RS and D. Run G1-G3 at four runs per arm in the gate subset: 18 more full-execution sessions, about $17 to $25 at attempt 1's $0.97 per session. Define a second delegation as one issued in a later assistant turn than the first allowed call's result.

Evidence: PROTOCOL-v2 lines 86, 318, 329. PILOT-RESULTS.md per-setup table: 'mean Agent calls per delegating run 1.00' in A, B, C and D.

Checkable: PROTOCOL-v2 runs the smoke sessions in arm R only (step 3), yet defines the gate subset's minimum per arm (RS and D) in those same smoke sessions.

### R3-H11 [BOUNDS] target: The pinned binary (v2 line 56: '2.1.296 by absolute path, DISABLE_AUTOUPDATER=1 in the child') and the runner's version check (line 65)

Attack: No path is named. ~/.local/bin/claude.exe is a copy of the current version, with the same byte size and timestamp as versions/2.1.296, so the owner's next update replaces it. The versions directory holds only 2.1.282, 2.1.295 and 2.1.296, which is consistent with pruning but does not prove it. DISABLE_AUTOUPDATER in the child does not stop the owner's own sessions from updating the shared install during a multi-day run. With the --version check, an update halts the run; without a private copy, the pinned binary can disappear.

Required edit: Copy the 2.1.296 binary to the neutral root before the probes and register its SHA-256. The runner verifies that hash, not only --version, before each chunk. The H1 fallback uses the same copy.

Evidence: This review: `ls -la ~/.local/share/claude/versions` lists 2.1.282 (Sep 24), 2.1.295 (Oct 8) and 2.1.296 (Oct 9, 260489376 bytes); ~/.local/bin/claude.exe is 260489376 bytes, dated Oct 9 21:13; `claude --version` gives 2.1.296.

Checkable: ~/.local/bin/claude.exe has the same byte size and timestamp as ~/.local/share/claude/versions/2.1.296, so it is a copy that the next update replaces.

### R3-H12 [BOUNDS] target: Cap calibration (I7, v2 line 103; failure row line 241; transfer subset line 111)

Attack: I7 sets one cap from one Opus session on each of four RS tasks, at a level that I10 can still change at step 5. The same cap governs the Fable transfer sessions, which cost about 2.5 times as much, leaving little margin on the costliest skill-reading cells. The CLI docs say spend 'can pass the cap'. A cap can also end a session after the delegating turn is emitted but before the hooks run, leaving tool_use blocks with no PreToolUse record and no batch record. No failure row covers that case: it is neither 'before the first delegating turn' nor 'ended by the observer'.

Required edit: Run I7 after the level is final. Give the Fable block its own cap, from two Fable I7 cells or at 2.5 times the Opus cap. Add a failure row: 'terminal_reason budget_exhausted at or after the first delegating turn: scored from the transcript, flagged, excluded in sensitivity'. Report cap endings by arm at analysis.

Evidence: scratchpad/h2docs/cli-reference.md line 105 ('Spend can pass the cap, so leave headroom'). agent-sdk_typescript.md line 1666 (terminal_reason 'budget_exhausted'). PROTOCOL-v2 lines 103, 106, 241, 321 (Fable about 2.5 times Opus), and 331 (I10 at step 5).

Checkable: cli-reference.md says spend can pass the --max-budget-usd cap and recommends leaving headroom.

### R3-H13 [BOUNDS] target: The session-effort choice: I2 (line 98) against I10 (line 106), and the probe order

Attack: I2 picks 'the highest level at or below xhigh whose schema carries the parameter' but tests only xhigh, max and high, so it has no rule if neither xhigh nor high carries the parameter. I10 then requires exposure of at least 0.8 and allows a move 'one level up or down'. In attempt 1, exposure rose with level (3 of 10 at medium, 14 of 14 at xhigh) while the parameter was absent at xhigh, so the two rules can point in opposite directions, and no tie-break is registered. I2 also runs with 'the main run's exact flags', which include the fork variable that I6 sets in the same step.

Required edit: Register the tie-break: exposure, which qualifies E1's null, outranks the effort parameter, which only E2 needs; if the chosen level lacks the parameter, E2 is descriptive. Add a medium cell to I2. Order the probes I6, then I2, then I10, then I7.

Evidence: PROTOCOL-v2 lines 98, 102, 106, 262. FACTS.md line 16 (parameter present in 72 of 72 transcripts at medium, 0 of 129 at xhigh). PILOT-RESULTS.md (skill invoked in 3 of 10 D runs at medium). FULL-RESULTS.md (14 of 14 at xhigh).

Checkable: PROTOCOL-v2's I2 tests the Agent effort parameter at xhigh, max and high only, while I10 allows the level to move one step up.

### R3-H14 [BOUNDS] target: The pre-registration sequence (v2 lines 325-335)

Attack: Four steps cannot run in the stated order. (1) Step 7 lists the token as an owner sign-off, but every step from step 2 on launches token-authenticated sessions, and minting the token at a browser is a precondition, not a sign-off. (2) The total ceiling is also signed at step 7, after the probes, 26 full-execution smoke sessions, the 184-session screen and I10: about $48 to $61 of the $140 to $200 projection. (3) Step 5 can change the level after I7 (step 2) has set the cap and step 3 has counted second delegations at the old level. (4) The parser scores the screen at step 6 but is hashed only at step 8. Also, no rule says what a failed smoke property does to the sequence.

Required edit: Add a step 0: the owner mints the token and signs a pre-registration spend ceiling. Fix the level (I6, I2, I10) before I7 and the smoke sessions. Freeze and hash the parser and runner after the smoke sessions and before the screen. Register that a failed property returns the fixture to step 1 and re-runs the smoke for the tasks it touches, and that the screen does not start until every property passes.

Evidence: PROTOCOL-v2 line 60 (the owner mints the token at a browser); lines 309-311 and 321 (sizes and per-session costs: smoke about $0.97, capture $0.09-0.13, probes $5-10); lines 327-335 (steps 1-9; the token at step 7).

Checkable: PROTOCOL-v2's step 7 lists the token among the owner sign-offs, after steps 2 to 6, which run token-authenticated sessions.
