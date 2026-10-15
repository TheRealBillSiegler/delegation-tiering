# Bugfix bank feasibility count

`scan.mjs` walks a directory of git repos (top level plus one level down), keeps one canonical repo per object store, and lists non-merge commits whose message marks a fix. It then applies a mechanical screen: at most 3 files and 80 changed lines, code or prose docs touched, every changed file present in the parent, not a revert or a version-only bump. It writes `candidates.csv`, `candidates.json` and `repos.json` to the output directory.

`sample.mjs` draws a seeded, repo-stratified sample of screen-passing candidates (`draw`), computes exact Clopper-Pearson intervals and a post-stratified yield from judged labels (`stats`), or evaluates one interval (`cp <x> <n>`).

Rerun: `node scan.mjs <reposRoot> <outDir> [ownerRegex]`, then `node sample.mjs draw <outDir>/candidates.json <outDir>/sample.json 20261009 30`. Labels are judged by hand and passed back as JSON to `sample.mjs stats`. Only read-only git commands run; the outputs contain commit data and belong outside this repo.
