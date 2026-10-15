'use strict';
// Shared transcript-store walking and parsing for spend.js and alias-drift.js.
const fs = require('fs');
const path = require('path');

/** Return SNAP and OUT directories from argv or the SNAP and OUT environment variables; both are required. */
function dirs() {
  const snap = process.argv[2] || process.env.SNAP;
  const out = process.argv[3] || process.env.OUT;
  if (!snap || !out) throw new Error('usage: node <script> SNAP OUT, or set the SNAP and OUT environment variables');
  fs.mkdirSync(out, { recursive: true });
  return { snap, out };
}

/** List every transcript file as {file, kind, project, session, agentId}; kind is main|workflow|direct. */
function listTranscripts(snap) {
  const res = [];
  for (const proj of fs.readdirSync(snap)) {
    const pdir = path.join(snap, proj);
    if (!fs.statSync(pdir).isDirectory()) continue;
    for (const e of fs.readdirSync(pdir, { withFileTypes: true })) {
      if (e.isFile() && e.name.endsWith('.jsonl')) {
        res.push({ file: path.join(pdir, e.name), kind: 'main', project: proj, session: e.name.slice(0, -6) });
      } else if (e.isDirectory()) {
        const sub = path.join(pdir, e.name, 'subagents');
        if (fs.existsSync(sub)) walkSub(sub, proj, e.name, res);
      }
    }
  }
  return res;
}

function walkSub(dir, proj, session, res) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSub(p, proj, session, res);
    else if (/^agent-.*\.jsonl$/.test(e.name)) {
      const kind = p.split(/[\\/]/).includes('workflows') ? 'workflow' : 'direct';
      res.push({ file: p, kind, project: proj, session, agentId: e.name.slice(6, -6),
        metaFile: p.slice(0, -6) + '.meta.json' });
    }
  }
}

/** Read a JSONL file; return {rows, bad} where bad counts unparsable non-empty lines. */
function readJsonl(file) {
  const rows = [];
  let bad = 0;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try { rows.push(JSON.parse(line)); } catch { bad++; }
  }
  return { rows, bad };
}

/** Read a meta.json, returning {} when missing or unparsable. */
function readMeta(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return {}; }
}

/** ISO-8601 week label (UTC), e.g. 2026-W41. */
function isoWeek(ts) {
  const d = new Date(ts);
  if (isNaN(d)) return 'unknown';
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = t.getUTCFullYear();
  const wk = Math.ceil(((t - Date.UTC(y, 0, 1)) / 86400000 + 1) / 7);
  return `${y}-W${String(wk).padStart(2, '0')}`;
}

/** Write rows (array of objects) as CSV. */
function writeCsv(file, rows, cols) {
  cols = cols || (rows.length ? Object.keys(rows[0]) : []);
  const esc = v => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  fs.writeFileSync(file, [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n');
}

module.exports = { dirs, listTranscripts, readJsonl, readMeta, isoWeek, writeCsv };
