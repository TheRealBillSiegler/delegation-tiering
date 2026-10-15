// Draw a seeded, repo-stratified sample of screen-passing candidates, and compute
// exact Clopper-Pearson intervals from judged labels.
// Usage:
//   node sample.mjs draw  <candidates.json> <outFile> [seed=1] [n=30]
//   node sample.mjs stats <judgments.json>   (array of {repo, group, label: yes|no|trivial})
//   node sample.mjs cp <x> <n>
import { readFileSync, writeFileSync } from 'node:fs';

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Regularized incomplete beta via continued fraction (Numerical Recipes betacf).
function lgamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5;
  t -= (x + 0.5) * Math.log(t);
  let s = 1.000000000190015;
  for (const ci of c) s += ci / ++y;
  return -t + Math.log((2.5066282746310005 * s) / x);
}
function betacf(a, b, x) {
  const FP = 1e-300;
  let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FP) d = FP;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 500; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FP) d = FP;
    c = 1 + aa / c; if (Math.abs(c) < FP) c = FP;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FP) d = FP;
    c = 1 + aa / c; if (Math.abs(c) < FP) c = FP;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return h;
}
function ibeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}
function betaInv(p, a, b) { // bisection on the regularized incomplete beta
  let lo = 0, hi = 1;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (ibeta(mid, a, b) < p) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
export function clopperPearson(x, n, alpha = 0.05) {
  const lo = x === 0 ? 0 : betaInv(alpha / 2, x, n - x + 1);
  const hi = x === n ? 1 : betaInv(1 - alpha / 2, x + 1, n - x);
  return [lo, hi];
}

const [mode, ...args] = process.argv.slice(2);
if (mode === 'draw') {
  const [file, outFile, seedArg = '1', nArg = '30'] = args;
  const seed = +seedArg, n = +nArg, rnd = mulberry32(seed);
  const pool = JSON.parse(readFileSync(file, 'utf8')).filter((c) => c.pass);
  const strata = {};
  for (const c of pool) (strata[c.repo] ??= []).push(c);
  const names = Object.keys(strata).sort();
  // 1 per stratum, remainder by largest remainder on stratum size, capped at stratum size.
  const alloc = Object.fromEntries(names.map((k) => [k, 1]));
  let left = n - names.length;
  const total = pool.length;
  const want = Object.fromEntries(names.map((k) => [k, (strata[k].length / total) * n]));
  while (left > 0) {
    const k = names.filter((x) => alloc[x] < strata[x].length).sort((a, b) => (want[b] - alloc[b]) - (want[a] - alloc[a]))[0];
    if (!k) break;
    alloc[k]++; left--;
  }
  const sample = [];
  for (const k of names) {
    const arr = strata[k].map((c) => c.sha).sort();
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    for (const sha of arr.slice(0, alloc[k])) sample.push({ repo: k, sha, group: strata[k][0].group, stratumSize: strata[k].length });
  }
  writeFileSync(outFile, JSON.stringify({ seed, n, poolSize: total, alloc, sample }, null, 1));
  console.log(JSON.stringify({ seed, poolSize: total, alloc }));
} else if (mode === 'stats') {
  const j = JSON.parse(readFileSync(args[0], 'utf8'));
  const rows = j.judgments ?? j;
  const cnt = (f) => { const r = { yes: 0, no: 0, trivial: 0 }; for (const x of rows.filter(f)) r[x.label]++; return r; };
  const show = (name, r) => { const n = r.yes + r.no + r.trivial; const [l, h] = clopperPearson(r.yes, n); console.log(name, JSON.stringify(r), `n=${n} yes=${(r.yes / n).toFixed(3)} CP95=[${l.toFixed(3)}, ${h.toFixed(3)}]`); };
  show('all', cnt(() => true));
  for (const g of ['owner', 'third-party']) show(g, cnt((x) => x.group === g));
  // Post-stratified extrapolation: per-repo yes rate x repo screen-passing size (needs stratumSize).
  if (rows.every((x) => x.stratumSize)) {
    const est = (f) => {
      const by = {};
      for (const x of rows.filter(f)) (by[x.repo] ??= { n: 0, y: 0, size: x.stratumSize }).n++, (by[x.repo].y += x.label === 'yes');
      const pool = Object.values(by).reduce((a, v) => a + v.size, 0);
      const yes = Object.values(by).reduce((a, v) => a + (v.y / v.n) * v.size, 0);
      return `${yes.toFixed(1)} of ${pool} (${(yes / pool).toFixed(3)})`;
    };
    console.log('post-stratified yes:', 'all', est(() => true), '| owner', est((x) => x.group === 'owner'), '| third-party', est((x) => x.group === 'third-party'));
  }
} else if (mode === 'cp') {
  const [x, n] = args.map(Number);
  console.log(clopperPearson(x, n));
}
