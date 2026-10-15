---
name: workflow-probe
description: 'Instrument check: does --allow-tools Workflow make the Workflow tool available to the agent under test?'
runs: 1
max_turns: 15
timeout_seconds: 900
allowed_tools: [Agent, Skill, Read]
---

Launch a one-agent workflow with the Workflow tool: a script that makes a single agent() call with an explicit model of "haiku" and the prompt "Reply with the single word hello". Report what the workflow returned.
