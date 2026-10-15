# Critic lens: feasibility, harness and cost

Verdict: The protocol cannot run as written on this machine. Inside `claude plugin eval`, the loader route and the settings effort route are closed: the docs say so, and the run layout puts the child's config at <run>/config, not $HOME/.claude. So probes I1 and I2 test the wrong directory, arm F cannot exist, and the main run lands at the default medium effort. The observer relies on the model obeying a deny reason rather than the documented continue:false. Arm D under capture duplicates RS. The 200-case layout under the repo path risks the Windows command-line limit and puts 'delegation-tiering' into every prompt. T23 needs fork mode, which `-p` turns off. With bounded edits, a run of about 460 sessions at roughly 1.6–2.4 times batch 1's list cost is feasible and can change the decision about the skill (endpoints 2 and 3) and the rule's floor. The edits are: append_system_prompt as the stated route, medium effort, a stateless continue:false observer, D and F cut from Instrument 1, a neutral short root, a session-start placebo, and staged chunks. The gate decision would still rest on the 48-session Instrument 2 alone and stays weak.

## Attacks

### A1 [BOUNDS] target: Instrument 1, capture and stop (the observer's deny-and-reply-done mechanism); probe I5

Attack: A PreToolUse deny does not end the session. The tool call is blocked and the model gets another turn, so the draft's claim that 'the session therefore ends one turn after the first delegation attempt' rests on the model obeying 'reply with the single word done'. It fails three ways. (a) The model treats the denial as an obstacle and does the user's task itself with Read, Glob and Grep, up to max_turns. (b) The draft records and denies only 'the first matching call', so a retry passes and launches a real worker at full cost. A retry is most likely in arm D, where the gate's own denial of a call with no model carries the fix. (c) Parallel Agent calls in one message (T03, T12, T25) race on any 'first call' state file. A documented hard stop exists and the draft does not use it.

Required edit: On every Agent or Workflow call, statelessly, the observer returns continue:false with a stopReason, plus hookSpecificOutput permissionDecision 'deny' as a backstop. It keeps no 'first call' tracking. Probe I5 must check four things. (1) No subagents/ directory appears under <run>/config/projects/<slug>/<session>/, and no worker model appears in modelUsage. (2) No assistant message follows the denied tool_use. (3) Record the run's `error` field under continue:false; if the harness flags it, the batch health check must exclude that exact text. (4) Whether the stop prevents the tool from executing at all. This also settles open question 1: with no later turn, the model never reacts to any denial text.

Evidence: hooks.md (fetched 2026-10-11): 'If `false`, Claude stops processing entirely after the hook runs. Takes precedence over any event-specific decision fields'; and, for deny, 'the tool call is blocked and Claude Code continues.' PROTOCOL-v0.md line 66: 'On the first matching call it writes ... and returns a deny decision'.

Checkable: hooks.md documents `continue: false` as stopping Claude 'entirely after the hook runs' and taking precedence over event-specific decisions, while a PreToolUse deny blocks only the call and Claude Code continues.

### A2 [BOUNDS] target: Probe I4 (two plugins under --ablation none); arm R in Instrument 2 (empty plugin list)

Attack: `plugins:` is documented as a list of directories relative to the case directory, and `../..` is accepted, so a second plugin can probably ride beside the one under test. But this program has never used the field: attempt 1 ran `claude plugin eval .` with with/without ablation. The documented default for `plugins:` is 'the nearest enclosing plugin'. Any case under the validation worktree has that worktree as its enclosing plugin, and the worktree is itself delegation-tiering 0.1.3 on eval/validation-program. Instrument 2's arm R has no observer and no plugin. An empty or omitted list there risks silently loading the plugin, at the wrong version, into the control arm.

Required edit: Never leave `plugins:` empty. Every arm in both instruments gets an explicit list. For Instrument 2, that list includes a component-free null plugin or a record-and-allow variant of the observer. Put the suite under a component-free dummy target plugin, not the plugin repo. Probe I4 asserts each arm's exact plugin set and skill and command listing from the child's init message in the transcript.

Evidence: plugin-evals.md prompt.md field table, `plugins` row: default 'The nearest enclosing plugin', 'Set `plugins: ["../.."]` when auto-detection doesn't find your plugin'. The validation worktree's .claude-plugin/plugin.json reads name delegation-tiering, version 0.1.3, branch eval/validation-program. The attempt-1 generator make-cases-full.js writes no `plugins:` key.

Checkable: ~/source/repos/delegation-tiering-validation/.claude-plugin/plugin.json declares delegation-tiering 0.1.3, so it is the nearest enclosing plugin of any case generated under that worktree.

### A3 [FAILS] target: Instrument 1: where the observer writes its record

Attack: The question was whether the hook has anywhere to write a record that survives the run. The attack does not hold. The record is redundant, because the session JSONL already keeps every tool_use input, denied calls included, and two write locations are already proven in this program.

Required edit: Nothing is needed for feasibility. The attack fails for three reasons. (1) Attempt 1's parser scored denied calls and their `model` from the transcript, and its Workflow graders matched model literals inside the Workflow tool input. (2) `${CLAUDE_PLUGIN_DATA}` resolves to <run>/config/plugins/data/<id>/; the batch-1 ledger sits there, --keep-temp keeps it, and analyze-full.js `collect` copies it. (3) An absolute directory passed as an EVAL_* variable also works: the diag hook wrote effort-log.jsonl through EVAL_DIAG_DIR. Recommended: make the transcript the primary record and the hook file a cross-check, keyed by session_id and tool_use_id. Name the file to match collect's /ledger.*\.jsonl$/ or extend collect.

Evidence: claude-snapshots/validation-data/trials-full/batch1/runs/c01/with-0/config/plugins/data/delegation-tiering-inline/delegation-ledger.jsonl exists. trials/diag/plugin/hooks/dump.js writes to process.env.EVAL_DIAG_DIR. FULL-RESULTS 'Denied: a tool result that begins PreToolUse:<Tool> hook error'.

Checkable: Batch-1 run c01/with-0 contains config/plugins/data/delegation-tiering-inline/delegation-ledger.jsonl, so a plugin hook's CLAUDE_PLUGIN_DATA writes land inside the kept run directory.

### A4 [BOUNDS] target: Arm D under Instrument 1; 'the gate's increment'; secondary endpoint 'D minus R'; the parser 'records both hooks' decisions'

Attack: In arm D the observer makes the gate's effect on the first-call measure zero by construction. The 0.1.2 hooks manifest declares only PreToolUse (the gate) and an async PostToolUse ledger, both matched to Agent|Workflow. It has no SessionStart or UserPromptSubmit hook. Before the first delegation, D's context is therefore identical to RS's. When the hooks disagree, the observer's deny outranks the gate's allow, so the gate's allow-path reminder never reaches the model. Under continue:false there is no later turn either. D in Instrument 1 is an RS replicate that costs 50 sessions, and the same holds for the gate inside F. The gate also writes nothing on a denied call: its ledger is a PostToolUse hook. So 'the parser records both hooks' decisions' has no source unless the gate's decision is recomputed.

Required edit: Drop D from Instrument 1 (minus 50 sessions), or keep it explicitly as an RS test-retest replicate to measure within-task run variance (see A16). Compute every gate contrast, including 'D minus R', from Instrument 2 only. Recompute the gate's verdict offline by running agent-model-gate.js on each captured input.

Evidence: scratchpad/attempt2/hooks-0.1.2.json: PreToolUse agent-model-gate.js and PostToolUse delegation-ledger.js (async), nothing else. hooks.md: 'When multiple PreToolUse hooks return different decisions, precedence is `deny` > `defer` > `ask` > `allow`.'

Checkable: hooks-0.1.2.json declares no hook event other than PreToolUse and PostToolUse, so nothing in the gate acts before the first Agent or Workflow call.

### A5 [KILLS] target: Probe I1 (the loader route), arm F, and probe I2's scaffold-written settings.json

Attack: The docs do speak to scaffold-written user files, and they say no. A scaffold 'can supply only files and git state'. 'Your user settings, hooks, CLAUDE.md files ... are absent.' No .claude/ directory or CLAUDE.md 'loads from above the workspace or inside it, even one a scaffold_script wrote'. The run layout makes it concrete. The child's Claude Code config directory is <run>/config: transcripts sit in <run>/config/projects/C--...-claude-eval-9ljBp0-home-cwd/, and plugin data in <run>/config/plugins/data/. The workspace is <run>/home/cwd. So `$HOME/.claude/` is a project-level .claude/ above the workspace, which is exactly the case the docs exclude. The scaffold's environment carries no CLAUDE_CONFIG_DIR. As written, I1 and I2 write to the wrong directory, so a negative result cannot tell 'loader disabled' from 'wrong path'. FACTS.md line 26 ('documented neither way') is wrong.

Required edit: Inside `claude plugin eval`, state now that every arm's text arrives through append_system_prompt, the attempt-1 route recovered by canary. Drop F, or move F to append_system_prompt and state that route. An optional one-session check is a scaffold writing a canary to $HOME/../config/CLAUDE.md, expected to fail. If the loader route itself matters, it needs a different harness: `claude -p` with a temporary CLAUDE_CONFIG_DIR holding CLAUDE.md, rules/ and settings.json, authenticated by CLAUDE_CODE_OAUTH_TOKEN from `claude setup-token`, with `--plugin-dir` and `--setting-sources user`. That harness loses the eval's read isolation (the owner's ~/.claude/rules/delegation.md becomes readable unless deny rules are added) and its graders. It is a new build, not a probe.

Evidence: plugin-evals.md: 'Ship any skills, agents, hooks, or MCP servers a case depends on in the plugin under test, since a scaffold_script can supply only files and git state' and 'no `.claude/` directory, `CLAUDE.md`, or `.mcp.json` loads from above the workspace or inside it, even one a `scaffold_script` wrote'. The scaffold env is PATH, HOME, TMPDIR and constants: 'Nothing else from your shell reaches it'. analyze-full.js lines 78–80 read <tempRoot>/config/projects and <tempRoot>/config/plugins/data.

Checkable: Batch-1 transcripts live under <run>/config/projects/ in a project slug ending '-home-cwd', so the child's config directory is <run>/config and its workspace is <run>/home/cwd, not $HOME/.claude.

### A6 [BOUNDS] target: Effort route: Harness bullet on effort, the 'Orchestrator model and effort' section, probes I2 and I3, and the line-94 limit

Attack: Of the three routes, two are closed. (1) A settings effortLevel through the scaffold is closed (A5). Plugin settings honor only `agent` and `subagentStatusLine`. `claude plugin eval --help` on 2.1.296 has no --effort option. (2) CLAUDE_CODE_EFFORT_LEVEL crosses into the child, but the docs say it 'takes precedence over both' the per-call parameter and agent frontmatter, so the parameter is moot whenever it is set. That plausibly explains why the schema drops it. This VS Code session at max, set without the variable, does carry `effort`, which weakens the 'xhigh level removes it' reading. Attempt 1's 0 of 129 confounds variable and level, since every xhigh session used the variable. Line 94 states as a finding ('which attempt 1 found removes the effort parameter') what attempt 1 only observed in conjunction. (3) The default `medium` carried the parameter in 72 of 72 pilot transcripts. The draft's fallback 'otherwise high' has no probe, because I3 tests only medium through the variable and high is reachable only through the variable. The 'xhigh with the parameter' target state is very likely unreachable in this harness.

Required edit: Register `medium` (the model default, no variable) as the main-run level now, with xhigh and high as stated limits. Keep I3 only as a mechanism note. If `high` matters, add I3b (high through the variable) with the decision written in advance. Rewrite line 94 as: 'every xhigh session was set through the variable and lacked the parameter; whether the variable or the level removes it is I3's question.' Note that `--effort` exists only on plain `claude -p` (the custom harness in A5), and nobody has tested whether it keeps the parameter.

Evidence: `claude plugin eval --help` (2.1.296) lists no --effort. plugins-reference.md: '`settings` ... Only `agent` and `subagentStatusLine` take effect'. sub-agents.md: 'The `CLAUDE_CODE_EFFORT_LEVEL` environment variable takes precedence over both.' FACTS.md line 17 records this session (max, no CLAUDE_CODE_EFFORT_LEVEL) carrying `effort`. FULL-RESULTS post-hoc check.

Checkable: `claude plugin eval --help` on Claude Code 2.1.296 offers no --effort option, so the only session-effort inputs the eval child can receive are CLAUDE_CODE_EFFORT_LEVEL and the model default.

### A7 [BOUNDS] target: Arm count × tasks against the Windows command-line limit (case layout)

Attack: The draft has 200 case directories (225 with F). Every arm now loads at least one plugin and RS, D, S and F load two, which is the configuration that overflowed in attempt 1: only the plugin arm hit ENAMETOOLONG. The harness's deny list names every sibling of every ancestor of the case directory. For attempt 1's c01 path, those siblings' full paths add up to about 9.3k characters per deny pattern (~ has 70 entries, source/repos 41, trials 14). The grouped layout fit; the flat one, about +2.7k characters per pattern, did not. Headroom is therefore a few thousand characters at most. 200 cases in groups of 8 make 25 groups, adding about +2.1k per pattern, which is in the same range as the increment that broke attempt 1. Plugin directories placed as siblings of case ancestors (`plugins: ["../../obs"]`) add more.

Required edit: Put the suite at a short neutral root (for example C:/e2) under a component-free dummy target plugin, with the eval dir below it. Use two-level grouping with at most 8 entries per level. Place plugin copies inside the suite root rather than as siblings of case ancestors. Before registration, run the single longest-path two-plugin case and record that it starts. My headroom figure is an estimate from directory listings, not the harness's real argument string; `--verbose` with `--debug-file` may show the real one.

Evidence: make-cases-full.js comment: '40 flat siblings overran Windows' 32,767-character command-line limit (ENAMETOOLONG). Grouping cuts the siblings per case from 39 to 11.' FULL-RESULTS deviation 2: failure in the plugin arm only. Sibling tally from `ls -A` of each ancestor of cases-full/g1/c01.

Checkable: In attempt 1 the flat 40-case layout failed with ENAMETOOLONG in the plugin arm only, and the 8-per-group layout ran, per FULL-RESULTS.md deviation 2.

### A8 [BOUNDS] target: Blinding and leakage ('every path the orchestrator sees is identical across arms except the case name'; 'the fixture contains no tiering text')

Attack: The eval dir must be a relative path below the target plugin. Attempt 1's prompts therefore embedded ~/source/repos/delegation-tiering-validation/evals/validation-program/trials/cases-full/g1/c01/fx/..., which puts 'delegation-tiering', 'validation' and 'trials' in every arm's prompt, including A0, P and R−. Those are the arms meant to carry no cue. A neutral fixture does not remove the cue from the path. Attempt 1 recorded the path as deviation 9 and never tested its effect.

Required edit: Use the same neutral short root as A7 (for example C:/e2/evals/gA/c017/fx). Extend the generator's forbidden-string assertion to the full prompt text, paths included: model, tier, delegat, effort, plugin, trial, valid. The run's working directory name (claude-eval-*) is constant across arms and cannot be removed; state it.

Evidence: cases-full/g1/c01/prompt.md body: 'Get a subagent to review `~/source/repos/delegation-tiering-validation/evals/validation-program/trials/cases-full/g1/c01/fx/scripts/check-links.js`'. plugin-evals.md: an absolute path or one containing `..` 'isn't accepted' as --eval-dir.

Checkable: Attempt 1's generated prompt for c01 contains the substring 'delegation-tiering-validation' in the fixture path the orchestrator reads.

### A9 [BOUNDS] target: Task T23 and probe I7 (fork)

Attack: The docs already answer I7: fork mode is off in `claude -p` unless it is turned on, and the eval child is a `claude -p` process. Turning it on with CLAUDE_CODE_FORK_SUBAGENT=1, a CLAUDE_CODE_* variable that crosses the allowlist, applies to every case in the invocation. It changes the measured tool for all tasks: it adds the fork type, removes `run_in_background`, and backgrounds every subagent. In Instrument 2, backgrounding in `-p` risks the session ending before workers report; attempt 1's Workflow probe ended after one turn for that reason. Fork mode is on by default in interactive sessions, so the owner's Agent tool likely differs from the trial's on this point; this is unverified for the VS Code surface. That is a transfer limit the draft does not state.

Required edit: Drop T23 from the divergent set (15 tasks), or run it alone in a separate Instrument 1 invocation with the variable set and report it outside the primary family. Add fork mode to the stated limits. If fork mode is turned on for the whole run to match the owner's surface, re-run the effort-parameter probe under it and keep Instrument 2 with fork mode off.

Evidence: sub-agents.md: 'Fork mode is off in non-interactive mode with `-p` and in the Agent SDK unless you turn it on' and 'Claude Code also removes the Agent tool's `run_in_background` parameter'. env-vars.md CLAUDE_CODE_FORK_SUBAGENT: 'Set to `1` to turn it on in `claude -p`'. PILOT-RESULTS: 'The eval session ended after one turn because the workflow ran in the background'.

Checkable: sub-agents.md states fork mode is off by default in `claude -p` and is enabled there only by CLAUDE_CODE_FORK_SUBAGENT=1.

### A10 [FAILS] target: Workflow tasks T20 and T21 under capture-and-stop

Attack: The question was whether a denied Workflow launch still yields the script for scoring. The attack does not hold. PreToolUse matches the Workflow tool. The gate's own launch-time lint and the canary's Workflow deny path depend on exactly that. The script travels inline in tool_input, and with no Write tool the model has no scriptPath to point at.

Required edit: Nothing is needed to run. State three residuals. (1) A captured launch is scored on literals only, and nothing shows the script would have run. (2) A scouting Agent call made before writing the workflow ends the session and scores a non-match, the same rule attempt 1 used. (3) In D, the gate's lint verdict is recomputed offline (A4).

Evidence: hooks.md lists Agent and Workflow among the tools PreToolUse matches. Attempt 1's wf-model-literal and wf-effort-literal graders matched literals inside the Workflow input; the grader-parser agreement was 638 of 638. allowed_tools is [Agent, Skill, Read, Glob, Grep].

Checkable: Attempt 1's generator defines a tool_used grader on tool Workflow whose input_match finds `model:` literals, which shows the script text is present in the Workflow tool input.

### A11 [BOUNDS] target: Transfer subset (Fable 5.1, arms R and D under Instrument 1)

Attack: Four problems. (1) Fable 5.1's default effort is high and Opus 5.5's is medium. With the variable route closed or removing the parameter (A6), Fable runs at high against Opus at medium, so 'do the Opus results hold on Fable' confounds model with effort. (2) The rule 'An omitted model scores as the session model, `opus`' is wrong under a Fable orchestrator. An omitted model inherits fable, which sits above every non-fable label. (3) Under capture, D equals RS (A4), so the subset compares R with RS, not with the gate. (4) Fable's list price is $10 / $50 against Opus's $4 / $20, about 2.5 times per capture session.

Required edit: Score an omitted model as the session model by name. Relabel the arms R and RS. Restrict the subset to the divergent tasks × 2 arms × 1 run (30–32 sessions, about $7–12 list at roughly 2.5 times the Opus capture cost). Either run both models at default and state the effort confound, or run both at one level through the variable and accept that the subset has no effort parameter and no effort endpoints.

Evidence: platform.claude.com models overview: default effort Fable 5.1 `high`, Opus 5.5 `medium`; pricing $10 / $50 and $4 / $20 per MTok. PROTOCOL-v0.md line 140: 'An omitted model scores as the session model, `opus`'.

Checkable: The models overview lists Claude Fable 5.1's default effort as `high` and Claude Opus 5.5's as `medium`.

### A12 [BOUNDS] target: Fixture ('generated by a script')

Attack: The fixture is a hand-authored artifact with planted properties, not something a script can generate. Twelve prompts assert specific content. T08: three claimed fixes in validate.js. T09: two fixed problems. T07: planted disagreements between HOOKS.md and the code. T13: a lint.js with an open miss-and-flag question. T16: an unsigned-message path. T15: audit.js with a size rejection. T22: existing release notes with a voice. T04: ROADMAP items checkable against CHANGELOG. T06: output-path resolution through environment variables. T24: release.js bump logic. T02: a first comment line in every script. T20: exactly five scripts. The predicted unaided choices depend on how this content reads, so the fixture has to exist and be frozen before predictions are registered. The forbidden-string check collides with natural validator vocabulary ('threat model', 'data model'). The layout mirrors the plugin's own (hooks/hooks.json, docs/COVERAGE.md, HOOKS.md, ROADMAP.md, CHANGELOG.md). In Instrument 2 workers read it, so a mis-planted fix turns a fix re-verification into an open review and changes cost and timeout rates.

Required edit: Add the fixture as a deliverable with a property list, one line per task naming the file and the planted fact, hashed and frozen before predictions are registered. Run one Instrument 2 smoke session per divergent task to confirm each property holds. Rename files that mirror the plugin's docs. Make the string check word-boundary based, with a reviewed allowlist.

Evidence: PROTOCOL-v0.md Fixture section gives directories and counts only; task rows T02–T25 presuppose specific file contents.

Checkable: The draft's Fixture section names no planted property, yet T08's prompt asserts three specific fixes in `<fx>/hooks/validate.js`.

### A13 [BOUNDS] target: Measurement: extending analyze-full.js

Attack: analyze-full.js is built around attempt 1. It assumes setups A–D from a with/without key, scores an omitted effort as xhigh, and detects denials as tool results beginning 'PreToolUse:<Tool> hook error' that name the explicit-model rule. Attempt 2 needs it to do eight new things. (1) Map 6–8 arms from the `plugins:` lists. (2) Tell the observer's denial from the gate's when both deny; how combined reasons are rendered is undocumented. (3) Parse transcripts that end at a tool_use with no tool_result, under continue:false. (4) Define 'first' among parallel Agent calls in one message. (5) Score an omitted model by the session model. (6) Detect forks. (7) Read the Agent tool definition's effort property, which the scratch agent-schema.js does. (8) Count Skill calls and reads made before the first delegation, and collect the observer file. None of this is exercised until probe transcripts exist.

Required edit: Write the analyzer before registration. Run it on the probe and smoke transcripts against a hand-checked expected-output file. Record its SHA-256 in the protocol, as attempt 1 did for the protocol itself.

Evidence: analyze-full.js lines 77–80: collect walks only out/trace.jsonl, config/projects and config/plugins/data ledger*.jsonl. FULL-RESULTS scoring rules: 'An omitted effort scores as `xhigh`'; the denial rule quoted above.

Checkable: analyze-full.js's collect step copies only out/trace.jsonl, config/projects/**/*.json(l) and config/plugins/data/**/ledger*.jsonl from each kept run.

### A14 [BOUNDS] target: Size, batches and stopping, against the owner's plan usage

Attack: As drafted the run is about 560 sessions (400 + 50 F capture, 48 full, 50 Fable, about 12 probes), roughly 9 times attempt 1's batch 1 of 63. The dollar figures below are my recomputation from the batch-1 transcripts at overview list prices, assuming cache writes at 1.25 times input. At xhigh, orchestrator spend up to and including the first delegation averaged $0.087 (median $0.077, p90 $0.138) over 1.7 API turns. Harness-reported orchestrator cost ran above my estimate ($0.213 against $0.164, on different subsets), so I take $0.09–0.13 per capture session. On that basis: Instrument 1 costs about $40–60. Instrument 2 costs about $45–60, using attempt 1's per-task costs: a fable worker about $3.5, an opus security review about $2.8, workflows about $1.2–1.4 with timeouts, about $0.95 on average. The Fable subset costs about $11–17, and probes and smoke about $5–10. The total is about $100–145, roughly 1.6–2.4 times batch 1's $61, provided the stop works. If it fails (A1), Instrument 1 sessions run workers at about $0.97 and Instrument 1 alone reaches about $390, roughly 6–7 times batch 1. On plan usage, there is no extra usage. When the plan limit hits mid-suite, the docs say later runs end with that error and the suite still finishes without being marked partial; -j runs share one limit. Batch 1 at 200 sessions is also the first time the observer is checked at scale, and its ceiling is still unset.

Required edit: Put the projection in the protocol as batch-1 multiples (sessions, dollars, turns), including the failed-stop case. Cut D and F from Instrument 1, bringing it to 300. Stage the start. First, a smoke run of one case per arm (6–8 sessions) with a $3 ceiling. Then batch 1 in chunks of at most 50 sessions via --case globs. Give each chunk --max-cost-usd of about chunk size × p90 capture cost, so a failed stop trips within a few runs. After each chunk, scan cases[].arms.with[].error for usage-limit text and re-run those cells rather than excluding them. The owner sets the total ceiling, in batch-1 multiples, before registration.

Evidence: plugin-evals.md, 'Runs fail with a usage-limit or rate-limit error partway through': 'each later run ends with that error ... The suite still finishes and isn't marked `partial`'. Help text: runs under -j 'share one rate limit'. Batch-1 transcript recomputation (63 sessions) and rows.json modelCost.

Checkable: Across the 63 batch-1 session transcripts, the orchestrator made a median of 2 API turns up to and including its first Agent or Workflow call.

### A15 [BOUNDS] target: Placebo arm P ('same route' as the rule)

Attack: markdown.md and docstrings.md are path-scoped: their frontmatter lists `**/*.md` and `**/*.mdx`, and `**/*.py`. Through the loader they load only when a matching file is touched. That means never at session start, and mid-session only on tasks where the orchestrator reads a .md file before delegating; the fixture has fourteen docs plus CHANGELOG, and T01, T03, T04, T05, T07, T22 and T25 point at them. P's exposure would vary by task and R's would not. Through append_system_prompt, the route left after A5, P is always on, but its own text and its CLAUDE.md rows say it applies only when touching *.md or *.py. That is not the same kind of text as an always-on rule. Either way the draft's 'same route' claim fails.

Required edit: Use a session-start rule as the placebo. coding-principles.md is 69 words, its CLAUDE.md row 14 says 'session start', and it passes the draft's forbidden-string check. Caveat: its 'least code' and YAGNI wording is a frugality prime that could push tiers down, so report P minus A0 on over- and under-provisioning too. Alternatively, write a neutral rule of about 74 words and say it is not the owner's.

Evidence: ~/.claude/rules/markdown.md frontmatter: paths '**/*.md', '**/*.mdx'. ~/.claude/rules/docstrings.md: paths '**/*.py'. CLAUDE.md rows 13 and 15: 'only when touching `*.md`' and '`*.py`'.

Checkable: ~/.claude/rules/markdown.md and docstrings.md both begin with a `paths:` frontmatter block, so the instruction loader would not load either at session start.

### A16 [BOUNDS] target: Power simulation that sets the run size

Attack: The draft seeds the simulation with 'the observed run-to-run variance from attempt 1's pilot', but there is no such variance to observe. In the pilot every B, C and D cell chose the same tier in both runs: haiku 4, sonnet 4, opus 2 in each setup. Batch 1 held one run per cell. A simulation built on zero within-task variance overstates power, and the session count and cost get set from it.

Required edit: Either assume a binomial within-task model with agreement probabilities from a stated prior, or measure the variance. To measure it, keep D in Instrument 1 as an RS replicate (A4), or during the smoke stage run 3–5 repeats of 4–6 divergent tasks in arms R and RS. That is about 30–50 capture sessions, roughly $3–6 list.

Evidence: PILOT-RESULTS per-setup table, 'tier of first call: haiku 4, sonnet 4, opus 2' for B, C and D, with 2 runs per cell. FULL-RESULTS: 'Each cell holds one run, not three.'

Checkable: In PILOT-RESULTS.md, setups B, C and D each show 'haiku 4, sonnet 4, opus 2' as the tier of the first call, with identical choices across both runs of every task.
