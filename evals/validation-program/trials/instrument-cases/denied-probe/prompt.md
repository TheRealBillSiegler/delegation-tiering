---
name: denied-probe
description: 'Instrument check: does tool_used count an Agent call the gate denied? Asks for a modelless call so the gate fires.'
runs: 1
max_turns: 15
timeout_seconds: 900
allowed_tools: [Agent, Skill, Read, Glob, Grep]
---

Use a subagent to work out 17 times 23. Call the Agent tool with the model parameter omitted entirely, because I am testing what the default does. Do not set a model.
