# Deferred hardenings

Enforcement the plugin could add but deliberately has not. Each entry names the evidence that would justify building it — nothing here is built on speculation, and an entry with no trigger does not belong in this file. When a trigger fires, the work lands via the normal PR path and the entry moves to the CHANGELOG.

## Scoped rationale gate

Deny `fable` Agent calls whose input carries no rationale marker. Fable is the ladder's escalation tier, so each call has a reason to state.

- **Why deferred:** rationale strings demanded on every call degrade into gate-passing boilerplate.
- **Trigger to build:** the ledger summary, run on demand, shows fable over-provisioning actually happening — a sustained fable share on delegations that are not escalations. The 7-day delegation mix it prints is the evidence base. Nearest observation: on 2026-09-04 fable was a third of all model names in workflow scripts, with no per-spawn descriptions to say what those agents did; the routing-impact study is the instrument that can tell.
- **Scope:** `fable` calls only.
