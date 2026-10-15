# Quote re-check

Notes: Pages were fetched live on 2026-10-12 as raw markdown with curl from code.claude.com/docs/en/<page>.md. I did not read PROTOCOL-v2.md or REVIEW-LEDGER.md, because the claims were fully stated in the task. 22 claims are verbatim, 2 are paraphrase-ok (1e and 7a), 1 is not-found (8b), and 2 (2 and 8a) carry caveats. The claims are numbered 1a to 9b. 1e: 'only' is implied, not stated. 7a: the page says to use the script 'for files and git state only', not 'can supply only'. 8b: authentication.md says nothing about revoking a setup-token token; its only revocation text is about /logout and covers the credential a sign-in wrote. 6c: the 'max applies to the current session only' claim has an exception when set through CLAUDE_CODE_EFFORT_LEVEL. 1c: the timeout rule is for command, http and mcp_tool hooks; an Agent SDK callback hook that times out does block a PreToolUse call. 2: --tools affects built-in tools only, not MCP tools. 9b: terminal_reason and hook_stopped appear on the SDK TypeScript page, not on headless.md.

- [verbatim] 1a. PostToolBatch fires once after every tool call in a batch has resolved (https://code.claude.com/docs/en/hooks.md)
  Page: "Runs once after every tool call in a batch has resolved, before Claude Code sends the next request to the model... `PostToolBatch` fires exactly once with the full batch"
- [verbatim] 1b. continue:false on PostToolBatch stops the loop before the next model call (https://code.claude.com/docs/en/hooks.md)
  Page: "Returning `decision: "block"` or `continue: false` stops the agentic loop before the next model call." Also the decision table row: PostToolBatch | Yes | "Stops the agentic loop before the next model call"
- [verbatim] 1c. A timed-out command hook does not block the tool call (https://code.claude.com/docs/en/hooks.md)
  Page: "A timed-out `command`, `http`, or `mcp_tool` hook doesn't block the tool call. The call continues through the normal permission flow, so don't count on a stalled hook to act as a gate." Caveat: the same page says a PreToolUse Agent SDK callback hook that times out does block.
- [verbatim] 1d. onFailure block requires 2.1.295 (https://code.claude.com/docs/en/hooks.md)
  Page: "`onFailure` ... `\"continue\"`, the default, or `\"block\"`... Requires Claude Code v2.1.295 or later." Applies to command and http hooks.
- [paraphrase-ok] 1e. stopReason is seen by Claude only if the conversation continues (https://code.claude.com/docs/en/hooks.md)
  Page: Field table: "`stopReason` | Message shown to the user when `continue` is `false`. It stays in the conversation, so Claude sees it if the conversation continues." PostToolBatch section: "it stays in the conversation, so Claude sees it when the conversation continues." The word 'only' is implied, not stated.
- [verbatim] 1f. All matching hooks run in parallel (https://code.claude.com/docs/en/hooks.md)
  Page: "All matching hooks run in parallel. If you define the same handler in more than one settings file, it runs once."
- [paraphrase-ok] 2. --tools restricts available tools; --allowedTools only pre-approves (https://code.claude.com/docs/en/cli-reference.md)
  Page: --tools: "Restrict which built-in tools Claude can use." --allowedTools: "Tools that execute without prompting for permission... To restrict which tools are available, use `--tools` instead." Note --tools covers built-in tools only: "The flag doesn't affect MCP tools."
- [verbatim] 3a. permissions.blockReadsOutsideWorkingDirectories exists and what it does (https://code.claude.com/docs/en/settings-reference.md)
  Page: "Make Claude's file tools refuse reads outside your working directories in every permission mode, including `bypassPermissions`. Claude Code denies `Read`, `Grep`, `Glob`, and `LSP` calls on those paths... Claude Code doesn't refuse shell commands the same way." Requires v2.1.257 or later. A true in any file applies.
- [verbatim] 3b. enableWorkflows and its default (https://code.claude.com/docs/en/settings-reference.md)
  Page: "Turn dynamic workflows on or off for yourself when your plan's default isn't what you want." "Default: unset, so workflows are on unless you're on the Pro plan, where they're off." CLAUDE_CODE_DISABLE_WORKFLOWS turns them off per session and true here can't override it.
- [verbatim] 4a. CLAUDE_CODE_OAUTH_TOKEN with claude setup-token (https://code.claude.com/docs/en/env-vars.md)
  Page: "OAuth access token for claude.ai authentication. Alternative to `/login` for SDK and automated environments. Takes precedence over keychain-stored credentials. Generate one with `claude setup-token`."
- [verbatim] 4b. CLAUDE_CODE_SUBPROCESS_ENV_SCRUB strips credentials from hook subprocesses (https://code.claude.com/docs/en/env-vars.md)
  Page: "Set to `1` to strip credentials from the environments of the subprocesses Claude Code starts, such as Bash commands, hooks, and stdio MCP servers... it leaves GitHub tokens and proxy settings in place."
- [verbatim] 4c. CLAUDE_CODE_PROJECT_DIR_NAME (https://code.claude.com/docs/en/env-vars.md)
  Page: "Set together with `CLAUDE_CONFIG_DIR` to choose the `projects/` directory name Claude Code stores that session's transcripts and auto memory under... ignores this variable when `CLAUDE_CONFIG_DIR` is unset, and reads it only from the environment you start `claude` from, never from a settings file `env` block."
- [verbatim] 4d. CLAUDE_CODE_FORK_SUBAGENT (https://code.claude.com/docs/en/env-vars.md)
  Page: "Controls fork mode... on by default in interactive sessions only. Set to `1` to turn it on in `claude -p` and the Agent SDK as well, or `0` to turn it off in every kind of session."
- [verbatim] 4e. DISABLE_AUTOUPDATER (https://code.claude.com/docs/en/env-vars.md)
  Page: "Set to `1` to disable automatic background updates. Manual `claude update` still works. Use `DISABLE_UPDATES` to block both."
- [verbatim] 4f. CLAUDE_CODE_EFFORT_LEVEL takes precedence over --effort (https://code.claude.com/docs/en/env-vars.md)
  Page: "Takes precedence over `--effort`, `/effort`, and the `modelSettings` and `effortLevel` settings. A `maxEffortLevel` cap still applies."
- [verbatim] 5a. Per-invocation effort parameter is for non-fork subagents since 2.1.292; env var takes precedence (https://code.claude.com/docs/en/sub-agents.md)
  Page: "When you ask Claude to run a non-fork subagent at a specific effort level, it can also pass an `effort` parameter for that invocation... The `CLAUDE_CODE_EFFORT_LEVEL` environment variable takes precedence over both. The per-invocation parameter requires Claude Code v2.1.292 or later."
- [verbatim] 5b. Fork mode is off by default under -p (https://code.claude.com/docs/en/sub-agents.md)
  Page: "Claude Code turns fork mode on by default in interactive sessions and leaves it off by default in non-interactive mode with `-p` and in the Agent SDK."
- [verbatim] 6a. Top-level effortLevel in user settings does not count for Opus 5.5 (https://code.claude.com/docs/en/model-config.md)
  Page: "Opus 5.5 starts at `medium` unless one of the sources above sets a level for it, and a top-level `effortLevel` in your user settings file doesn't count for Opus 5.5." It still applies on Opus 5, Fable 5.1 and earlier; top-level effortLevel in project, local, managed or --settings applies to every model.
- [verbatim] 6b. Opus 5.5 defaults to medium (https://code.claude.com/docs/en/model-config.md)
  Page: "`high` on every model that supports effort, except that Opus 5.5, Sonnet 5.5, and Haiku 5.5 default to `medium`"
- [verbatim] 6c. max applies to the current session only (https://code.claude.com/docs/en/model-config.md)
  Page: "Unless you set it through the `CLAUDE_CODE_EFFORT_LEVEL` environment variable, Claude Code applies `max` to the current session only." The page's exception for the env var is a qualifier worth keeping.
- [paraphrase-ok] 7a. A scaffold script can supply only files and git state (https://code.claude.com/docs/en/plugin-evals.md)
  Page: "Use the script for files and git state only, since project configuration it writes isn't loaded." The words 'can supply only' are not on the page; the page says 'Use the script for ... only'.
- [verbatim] 7b. plugins field defaults to the nearest enclosing plugin (https://code.claude.com/docs/en/plugin-evals.md)
  Page: Field table: "`plugins` | The nearest enclosing plugin | Plugin directories under test, relative to the case directory. Set `plugins: [\"../..\"]` when auto-detection doesn't find your plugin"
- [verbatim] 8a. claude setup-token mints a one-year token for subscription accounts (https://code.claude.com/docs/en/authentication.md)
  Page: "generate a one-year OAuth token with `claude setup-token`"; "This token authenticates with your Claude subscription and requires a Pro, Max, Team, or Enterprise plan. It can only make model requests, so it can't establish Remote Control sessions or fetch claude.ai connectors." Bare mode does not read it. The command "does not save the token anywhere".
- [not-found] 8b. The page's statements on revocation (https://code.claude.com/docs/en/authentication.md)
  Page: No statement on revoking a setup-token token. The only 'revoke' text is line 131 about /logout: "run `/logout`, which removes and revokes the credential this sign-in wrote" (sign-in credential, not setup-token). Another ledger claim about setup-token revocation would be unsupported by this page. Page also says an expired token is replaced by generating a new one and restarting (env-vars.md).
- [verbatim] 9a. Result message carries total_cost_usd (https://code.claude.com/docs/en/agent-sdk/typescript.md (and headless.md))
  Page: typescript.md result message type has `total_cost_usd: number` ('cumulative estimated cost in USD'). headless.md: "With `--output-format json`, the response payload includes `total_cost_usd` and a per-model cost breakdown... client-side estimates and can differ from your actual bill."
- [verbatim] 9b. Result message carries terminal_reason including the value hook_stopped (https://code.claude.com/docs/en/agent-sdk/typescript.md)
  Page: "`terminal_reason`: why the loop ended. One of \"completed\", \"max_turns\", \"tool_deferred\", \"aborted_streaming\", \"aborted_tools\", \"hook_stopped\", \"stop_hook_prevented\", ..." (field is optional: `terminal_reason?`). headless.md does not mention terminal_reason or hook_stopped; the SDK TypeScript reference does.