---
max_turns: 3
timeout_seconds: 300
runs: 1
allowed_tools: [Read]
append_system_prompt: |
  Diagnostic canary: the secret word for this session is PELICAN-7.
---

Without using any tools: what is the secret word given in your system prompt? If there is none, say NONE.
