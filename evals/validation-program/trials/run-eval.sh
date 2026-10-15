#!/usr/bin/env bash
# Run `claude plugin eval` for the Phase 2 trials with session variables removed.
# Usage: [PLUGIN=<dir>] [EXTRA_ENV="NAME=value ..."] run-eval.sh <label> [extra eval args...]
# Writes JSON, report, stdout/stderr, and exit code under validation-data/trials/<label>/.
# CLAUDE_EFFORT is removed by default: it is an output variable that Claude Code sets for
# hooks and Bash, not an input (see PILOT-RESULTS.md). EXTRA_ENV re-adds variables for the
# instrument diagnostics only.
set -uo pipefail
label="$1"; shift
PLUGIN="${PLUGIN:-$(cd "$(dirname "$0")/../../.." && pwd)}"
OUT="${VALIDATION_DATA:?set VALIDATION_DATA to the private data directory}/trials/$label"
mkdir -p "$OUT"
cd "$PLUGIN" || exit 1
# shellcheck disable=SC2086  # EXTRA_ENV is a deliberate word-split list of NAME=value pairs
env -u CLAUDECODE -u CLAUDE_CODE_CHILD_SESSION -u CLAUDE_CODE_ENTRYPOINT -u CLAUDE_CODE_SESSION_ID \
    -u CLAUDE_CODE_MESSAGING_SOCKET -u CLAUDE_CODE_MESSAGING_TOKEN -u CLAUDE_CODE_SESSION_ATTENDED \
    -u CLAUDE_PID -u CLAUDE_CODE_EMIT_STARTUP_TIMING -u CLAUDE_CODE_QUESTION_PREVIEW_FORMAT \
    -u CLAUDE_EFFORT ${EXTRA_ENV:-} \
  claude plugin eval . \
    --model claude-opus-5-5 --no-publish --trust-plugin --threshold 0 \
    --json "$OUT/aggregate-result.json" --output-dir "$OUT" --keep-temp -j 4 --max-cost-usd 8 \
    "$@" > "$OUT/stdout.txt" 2> "$OUT/stderr.txt"
echo "exit=$?" > "$OUT/exit.txt"
