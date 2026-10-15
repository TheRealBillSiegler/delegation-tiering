# Verified facts for the attempt-2 design (collected 2026-10-11)

Each item names its source. "Observed" means read from a transcript or command output on the owner's machine today; "Doc" means a live fetch of the named page today.

## Effort surfaces

- Doc, https://code.claude.com/docs/en/sub-agents.md: "When you ask Claude to run a non-fork subagent at a specific effort level, it can also pass an `effort` parameter for that invocation. The parameter overrides the `effort` field... The `CLAUDE_CODE_EFFORT_LEVEL` environment variable takes precedence over both. The per-invocation parameter requires Claude Code v2.1.292 or later."
- Doc, CHANGELOG 2.1.292: "Added an `effort` parameter to the Agent tool, so Claude runs a sub-agent at the effort level you ask for".
- Doc, https://code.claude.com/docs/en/agent-sdk/typescript.md: Agent tool input `effort?: "low" | "medium" | "high" | "xhigh" | "max"` beside `model?: "sonnet" | "opus" | "haiku" | "fable"`.
- Doc, sub-agents.md, subagent definition frontmatter `effort`: "Effort level when this subagent is active. Overrides the session effort level, but not the `CLAUDE_CODE_EFFORT_LEVEL` environment variable."
- Doc, https://code.claude.com/docs/en/model-config.md: session effort precedence "1. ... `CLAUDE_CODE_EFFORT_LEVEL`, launching with `--effort`, or `/effort` in the session 2. Your settings... 3. The model's default effort"; settings keys `effortLevel` and `modelSettings`: "`max` isn't accepted as a level in either key"; defaults: "Opus 5.5, Sonnet 5.5, and Haiku 5.5 default to `medium`".
- Doc, https://code.claude.com/docs/en/env-vars.md, `CLAUDE_CODE_EFFORT_LEVEL`: "Takes precedence over `--effort`, `/effort`, and the `modelSettings` and `effortLevel` settings. A `maxEffortLevel` cap still applies."
- Doc, CHANGELOG 2.1.295: "Fixed `/model` saying a Max effort pick was saved as your default for new sessions; Max applies to the current session only".
- Doc: the Workflow tool's per-call `effort` option is on no public page; the bundled workflow-authoring reference inside Claude Code documents `opts.effort` with values low, medium, high, xhigh, max.
- Doc: no page states any condition under which the Agent tool schema omits `effort`.
- Observed, attempt 1 (FULL-RESULTS.md, post-hoc check): on Claude Code 2.1.295 the eval child's Agent tool definition carried `effort` in 72 of 72 pilot transcripts (orchestrator at the default `medium`, no effort variable set) and in 0 of 129 batch-1 transcripts (orchestrator at `xhigh` through `CLAUDE_CODE_EFFORT_LEVEL=xhigh`). Two probes: at `xhigh` without the Workflow grant, no parameter; at `medium` with the grant, parameter present.
- Observed, this session (VS Code extension, Claude Code 2.1.295 then 2.1.296, effort `max`, environment has `CLAUDE_EFFORT=max` and no `CLAUDE_CODE_EFFORT_LEVEL`): the Agent tool schema carries `effort` (low, medium, high, xhigh, max) with the description "Set this ONLY when the user, or instructions such as CLAUDE.md or a skill, explicitly ask that this agent or delegated work run at a specific effort level, never on your own judgment; otherwise omit it and the agent runs at its usual effort."
- Hypothesis, untested: the schema omits `effort` when `CLAUDE_CODE_EFFORT_LEVEL` is set, because that variable overrides the per-call value; probe I3 in the draft tests it.

## `claude plugin eval` (Doc, https://code.claude.com/docs/en/plugin-evals.md, and `claude plugin eval --help` on 2.1.296)

- "Each run gets a temporary home directory, working directory, and Claude Code configuration, and the agent under test runs there as a `claude -p` child process with only your plugin loaded."
- "Your user settings, hooks, `CLAUDE.md` files, MCP servers, other installed plugins, memory, and skills are absent."
- "Each run starts in an empty workspace." Fixtures: "write a Bash script in the case directory and name it in `context.scaffold_script`" (runs only with `--scaffold`, 120 s limit, a non-zero exit scores the run 0).
- "no `.claude/` directory, `CLAUDE.md`, or `.mcp.json` loads from above the workspace or inside it, even one a `scaffold_script` wrote, and `add_dirs` directories grant read access only."
- "A scaffold script starts in the empty workspace with a small fixed environment: your shell's `PATH`, `HOME` set to the run's temporary home directory, `TMPDIR`, and a few constants such as `TERM=dumb`." The same page says a scaffold "can supply only files and git state" and tells authors to "Ship any skills, agents, hooks, or MCP servers a case depends on in the plugin under test", so user-level files a scaffold writes are not loaded (corrected 2026-10-11 after review round 1).
- prompt.md frontmatter fields: schema_version, name, description, tags, plugins ("Plugin directories under test, relative to the case directory"), runs (1 to 50, default 3), expected_outcome, model, max_turns, timeout_seconds, allowed_tools, append_system_prompt, env ("Keys must match `EVAL_[A-Z0-9_]*`; any other key fails the run."). No effort field.
- Graders: regex, tool_used, tool_order, file_exists, llm, baseline. "There are no custom-code graders."
- "Runs never stop to ask for permission. Built-in tools that need a grant you didn't give... are removed from the session." Bash needs a sandbox backend; "Native Windows has no backend, so run shell-granting suites under WSL2".
- `--ablation none | with-without`; `-j` 1 to 8; `--runs`; `--max-cost-usd`; `--keep-temp` keeps each run's sandbox directory (attempt 1 read the session JSONL, subagent JSONL and the plugin ledger from it).
- Observed, attempt 1: `append_system_prompt` reached both arms (canary recovered); `CLAUDE_CODE_EFFORT_LEVEL` crosses into the child and `CLAUDE_EFFORT` does not; `--allow-tools Workflow` adds the Workflow tool; the harness passes a deny list of sibling directories on the command line, so 40 flat case directories overran the Windows command-line limit and cases were grouped 8 per directory; the child runs in `dontAsk` mode with an empty working directory; in a denied-call probe (the prompt told the orchestrator to omit `model`) the gate denied all 3 first calls and the orchestrator stopped rather than re-issue.

## `claude -p` on 2.1.296 (`claude --help`)

- `--bare`: "Minimal mode: skip hooks (those defined in settings and by installed plugins...), LSP, plugin sync, attribution, auto-memory, background prefetches, keychain reads, and CLAUDE.md auto-discovery. ... Anthropic auth is strictly ANTHROPIC_API_KEY or apiKeyHelper via --settings (OAuth and keychain are never read)." The owner authenticates through the subscription's OAuth login and has no API key, so `--bare` is unusable here.
- `--effort <level>` (low, medium, high, xhigh, max); `--permission-mode` choices acceptEdits, auto, bypassPermissions, manual, dontAsk, plan; `--plugin-dir <path>` (repeatable); `--settings <file-or-json>`; `--setting-sources user,project,local`; `--add-dir`; `--no-session-persistence`.
- A non-bare `claude -p` loads the owner's `~/.claude/CLAUDE.md`, rules, hooks and installed plugins, so it cannot serve as a clean arm without modifying the owner's live configuration.

## Owner's configuration (Observed)

- VS Code extension; session model Fable 5.1 (Opus 5.5 at times, by `/model`); effort `max`.
- `~/.claude/CLAUDE.md`: 212 words, a 12-row mechanism table; line 16 is the delegation row. Rule files (words): delegation 74, markdown 69, docstrings 16, propose-dont-apply 91, git-hygiene 155, coding-principles 69, analysis-doc-voice 62, reasoning-posture 537.
- Installed plugin: delegation-tiering 0.1.1. The 0.1.2 candidate is on `origin/develop` at 5886ff7 (skill text in SKILL-0.1.2.md beside this file; hooks manifest in hooks-0.1.2.json). Its gate's allow path injects a reminder on every Agent call that names a model: "delegation-tiering: chosen tier <tier> — confirm it is the lowest sufficient for this task; consult the delegation-tiering skill if unsure."

## Attempt 1 numbers to reuse

- Pilot (medium effort, 5 tasks × 4 setups × 2 runs): first call named a model A 0/10, B 10/10, C 10/10, D 10/10; effort set A 0/10, B 10/10, C 9/10, D 9/10; skill invoked C 10/10, D 3/10; mean cost per session $0.25 to $0.40.
- Batch 1 (xhigh, 63 sessions, 5 timeouts at 900 s): named a model A 3/15, B 13/13, C 16/16, D 14/14; model agreement A 7/15 (an omitted model scores as opus), B 11/13, C 16/16, D 13/14; D minus B on model agreement +0.077 over 13 tasks, interval [0, +0.231], exact p 1.0; B minus A on naming +0.800 over 10 tasks, p 0.0078; skill invoked C 16/16, D 14/14; orchestrator-level gate denials 0; nested denials in 5 sessions; mean cost $0.97 per session; 553 orchestrator turns across 58 sessions.
- Organic audit (163 sessions, 2026-08-15 to 2026-10-09): 247 organic Agent calls all named a model; the gate's 4 denials were all false positives of a lint class fixed in 0.1.2.
