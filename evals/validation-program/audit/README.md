# Audit scripts (Phase 0b spend, Phase 1b alias drift)

Read-only analyses over a frozen copy of the Claude Code transcript store. Node built-ins only; no data is stored in this repo.

| File | Computes |
|---|---|
| `lib.js` | Shared helpers: transcript discovery (main / workflow worker / direct subagent), JSONL parsing, ISO weeks, CSV writing. |
| `spend.js` | List-price spend from `message.usage`, deduplicated on `message.id` (fallback `requestId`; the largest value per usage field wins, since streamed duplicates carry growing `output_tokens`). Splits by resolved model, ISO week (UTC), and path, then splits fable workers into gate-type and other by label regex. Prices are the table embedded in the script, copied from the Anthropic pricing page; Haiku 5.5 is priced per request at the over-100k-token tier when input plus cache reads plus cache writes exceed 100,000. Unpriced model IDs are counted in tokens but excluded from cost. |
| `alias-drift.js` | For every subagent, requested alias (`meta.json` `model`), resolved model (first assistant line), Claude Code `version`, and start timestamp. Writes the alias x version x resolved crosstab, the Haiku 4.5 share on or after 2026-10-07 by version, and older-generation checks against the newest model seen in the store at each start time and against the pricing-page newest. |

## Rerun

```sh
node spend.js       [SNAP] [OUT]
node alias-drift.js [SNAP] [OUT]
```

Both `SNAP` (the transcript snapshot) and `OUT` (a private output directory outside the repo) are required, as arguments or through the `SNAP` and `OUT` environment variables. Each run takes about ten seconds and rewrites its CSV and JSON outputs in `OUT`.

## Update the prices

Edit the `P` table at the top of `spend.js` after re-reading the pricing page. Columns are input, 5-minute cache write, 1-hour cache write, cache read, and output, in USD per million tokens. A model ID missing from the table is reported as unpriced rather than guessed.
