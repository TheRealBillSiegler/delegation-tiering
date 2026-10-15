// Scan local git repos for fix commits and apply the mechanical screen.
// Usage: node scan.mjs <reposRoot> <outDir> [ownerRegex]
// Env equivalents: BANK_ROOT, BANK_OUT, BANK_OWNER (regex on "name <email>", default "siegler").
// Read-only git only (log, show, rev-parse). Writes only to outDir.
import { execFileSync } from 'node:child_process';
import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const rootArg = process.argv[2] ?? process.env.BANK_ROOT;
const outArg = process.argv[3] ?? process.env.BANK_OUT;
if (!rootArg || !outArg) { console.error('usage: node scan.mjs <reposRoot> <outDir> [ownerRegex]'); process.exit(2); }
const root = resolve(rootArg);
const out = resolve(outArg);
const ownerRe = new RegExp(process.argv[4] ?? process.env.BANK_OWNER ?? 'siegler', 'i');
mkdirSync(out, { recursive: true });

const git = (dir, args, maxMB = 512) =>
  execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', maxBuffer: maxMB * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
const isRepo = (d) => existsSync(join(d, '.git'));
const subdirs = (d) => readdirSync(d, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => join(d, e.name));

// Discover repos: top level plus one level down. Keep only canonical (own object store) repos.
const found = [];
for (const d of subdirs(root)) {
  if (isRepo(d)) found.push(d);
  for (const s of subdirs(d)) if (isRepo(s)) found.push(s);
}
const canonical = [];
const aliases = [];
for (const d of found) {
  let common;
  try { common = resolve(d, git(d, ['rev-parse', '--git-common-dir']).trim()); } catch { continue; }
  if (resolve(d, '.git') === common) canonical.push(d);
  else aliases.push({ dir: d, canonical: resolve(common, '..') });
}

const FIXRE = /\b(fix(es|ed|ing)?|bugs?|regressions?|broken|crash(es|ed)?|wrong|incorrect)\b/i;
const kindOf = (p) => {
  const l = p.toLowerCase();
  const b = l.split('/').pop();
  if (/(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|uv\.lock|cargo\.lock|gemfile\.lock|composer\.lock)$/.test(l) || b.endsWith('.lock')) return 'lockfile';
  if (/(^|\/)(\.github\/workflows|\.gitlab-ci|\.circleci)|azure-pipelines|(^|\/)jenkinsfile/.test(l)) return 'ci';
  if (/(^|\/)(dist|build|out|node_modules|vendor|coverage|__snapshots__)\//.test(l) || /\.(min\.js|map|snap)$/.test(l) || /\.generated\./.test(l)) return 'generated';
  if (/(^|\/)(tests?|__tests__|spec|specs)\//.test(l) || /[._](test|spec)\.[a-z]+$/.test(b) || /^test_/.test(b)) return 'tests';
  if (/\.(md|mdx|rst|txt|adoc)$/.test(l) || /(^|\/)docs?\//.test(l)) return 'docs';
  if (/\.(json|ya?ml|toml|ini|cfg|conf|env|xml|csproj|props)$/.test(l) || b.startsWith('.')) return 'config';
  return 'code';
};

const rows = [];
for (const dir of canonical) {
  const repo = basename(dir);
  let raw;
  try {
    raw = git(dir, ['log', '--all', '--no-merges', '--no-renames', '--raw', '--numstat', '-z',
      '--format=%x01%H%x02%P%x02%an%x02%ae%x02%aI%x02%s%x02%b%x03']);
  } catch { console.error('skip', repo); continue; }
  for (const chunk of raw.split('\x01').slice(1)) {
    const cut = chunk.indexOf('\x03');
    const head = chunk.slice(0, cut);
    const rest = chunk.slice(cut + 1);
    const [sha, parents, an, ae, date, subj, body = ''] = head.split('\x02');
    const subjFix = /^fix(\(|:|!)/i.test(subj) || FIXRE.test(subj);
    if (!subjFix && !FIXRE.test(body)) continue;
    // -z output: raw ":old new sha sha S" then NUL path NUL; numstat "a\tr\tpath" NUL-terminated.
    const toks = rest.split('\0').map((t) => t.replace(/^\n+/, '')).filter(Boolean);
    const status = {};
    const stat = {};
    let pend = null;
    for (const t of toks) {
      if (t.startsWith(':')) pend = t.trim().split(/\s+/).pop();
      else if (pend) { status[t] = pend; pend = null; }
      else {
        const m = t.match(/^(-|\d+)\t(-|\d+)\t([\s\S]*)$/);
        if (m) stat[m[3]] = [m[1], m[2]];
      }
    }
    const files = Object.keys(status);
    let add = 0, del = 0, binary = false;
    for (const f of files) {
      const s = stat[f];
      if (!s || s[0] === '-') binary = true;
      else { add += +s[0]; del += +s[1]; }
    }
    const kinds = [...new Set(files.map(kindOf))];
    const parent = parents.split(' ').filter(Boolean)[0] ?? '';
    const allInParent = !!parent && files.length > 0 && files.every((f) => status[f] !== 'A');
    rows.push({
      repo, dir, sha, date, author: an, ownerCommit: ownerRe.test(`${an} <${ae}>`), subject: subj,
      subjectMarksFix: subjFix, files, kinds, nFiles: files.length, add, del, lines: add + del, binary,
      hasParent: !!parent, allInParent,
      isRevert: /^revert\b/i.test(subj) || /This reverts commit/.test(body),
    });
  }
}
// Dedupe by SHA across repos (separate clones of one history): keep the first canonical repo.
const uniq = new Map();
for (const r of rows) if (!uniq.has(r.sha)) uniq.set(r.sha, r);
const cands = [...uniq.values()];

// Repo-level author group: owner if a majority of ALL non-merge commits are the owner's.
const groupOf = {};
for (const dir of canonical) {
  try {
    const lines = git(dir, ['log', '--all', '--no-merges', '--format=%an <%ae>']).split('\n').filter(Boolean);
    const n = lines.filter((l) => ownerRe.test(l)).length;
    groupOf[basename(dir)] = { total: lines.length, owner: n, group: lines.length && n / lines.length >= 0.5 ? 'owner' : 'third-party' };
  } catch { /* ignore */ }
}

const versionOnly = (c) => {
  try {
    const p = git(c.dir, ['show', '--format=', '--unified=0', c.sha], 64).split('\n').filter((l) => /^[+-][^+-]/.test(l));
    return p.length > 0 && p.every((l) => /version/i.test(l));
  } catch { return false; }
};
for (const c of cands) {
  c.group = groupOf[c.repo]?.group ?? 'unknown';
  const small = c.nFiles >= 1 && c.nFiles <= 3 && c.lines <= 80 && !c.binary;
  const touches = c.kinds.some((k) => k === 'code' || k === 'docs');
  c.fail = [];
  if (!small) c.fail.push('size');
  if (!touches) c.fail.push('kind');
  if (!c.allInParent) c.fail.push('parent');
  if (c.isRevert) c.fail.push('revert');
  if (!c.fail.length && versionOnly(c)) c.fail.push('versionbump');
  c.pass = c.fail.length === 0;
}

const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
const cols = ['repo', 'sha', 'group', 'date', 'author', 'subject', 'subjectMarksFix', 'nFiles', 'add', 'del', 'kinds', 'hasParent', 'allInParent', 'isRevert', 'pass', 'fail'];
writeFileSync(join(out, 'candidates.csv'), [cols.join(','), ...cands.map((c) => cols.map((k) => q(Array.isArray(c[k]) ? c[k].join('|') : c[k])).join(','))].join('\n'));
writeFileSync(join(out, 'candidates.json'), JSON.stringify(cands, null, 1));
writeFileSync(join(out, 'repos.json'), JSON.stringify({
  canonical: canonical.map((d) => ({ name: basename(d), ...groupOf[basename(d)] })),
  aliases: aliases.map((a) => ({ dir: basename(a.dir), canonical: basename(a.canonical) })),
}, null, 1));

// Aggregate counts to stdout.
const by = {};
for (const c of cands) {
  const k = `${c.group}\t${c.repo}`;
  by[k] ??= { cand: 0, pass: 0, subj: 0 };
  by[k].cand++; by[k].pass += c.pass; by[k].subj += c.subjectMarksFix;
}
console.log('group\trepo\tcandidates\tsubjectFix\tpass');
for (const [k, v] of Object.entries(by).sort()) console.log(`${k}\t${v.cand}\t${v.subj}\t${v.pass}`);
const tot = {};
for (const c of cands) { tot[c.group] ??= [0, 0]; tot[c.group][0]++; tot[c.group][1] += c.pass; }
console.log('TOTAL [cand,pass]', JSON.stringify(tot), 'rows-before-dedupe', rows.length);
