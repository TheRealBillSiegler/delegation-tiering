// Tests for the blind-adjudication helpers. Run: node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripIdentity, poolBlind, splitClaims, score } from './adjudicate-core.mjs';

test('stripIdentity removes model names, IDs, and arm words', () => {
  const s = stripIdentity('Fable 5.1 says X; claude-opus-5-5 disagrees; opus thinks; Sonnet agrees');
  assert.doesNotMatch(s, /fable|opus|sonnet|claude-/i);
  assert.match(s, /says X/);
});

test('poolBlind is deterministic for a seed and hides the arm', () => {
  const claims = { fable: ['a', 'b'], opus: ['c'] };
  const p1 = poolBlind(claims, 7);
  const p2 = poolBlind(claims, 7);
  assert.deepEqual(p1, p2);
  assert.equal(p1.items.length, 3);
  for (const it of p1.items) assert.deepEqual(Object.keys(it).sort(), ['label', 'text']);
  assert.deepEqual(Object.values(p1.key).sort(), ['fable', 'fable', 'opus']);
});

test('splitClaims takes array items from structured output and list items from text', () => {
  const structured = { kind: 'structured', value: { verdict: 'fail', findings: [{ title: 'x', evidence: 'y' }, 'z'] } };
  assert.equal(splitClaims(structured).length, 2);
  const text = { kind: 'text', value: 'Intro\n\n1. First defect\n   detail\n2. Second defect\n- Third defect' };
  assert.equal(splitClaims(text).length, 3);
});

test('score splits unique real defects by arm and counts false claims and unclear rate', () => {
  const key = { C1: 'fable', C2: 'opus', C3: 'opus', C4: 'fable', C5: 'opus' };
  const verdict = {
    claims: [
      { label: 'C1', verdict: 'real' }, { label: 'C2', verdict: 'real' },
      { label: 'C3', verdict: 'real' }, { label: 'C4', verdict: 'not_real' },
      { label: 'C5', verdict: 'unclear' },
    ],
    defects: [{ id: 'D1', claims: ['C1', 'C2'] }, { id: 'D2', claims: ['C3'] }],
  };
  assert.deepEqual(score(key, verdict), {
    claims: 5, uniqueReal: 2, fableOnly: 0, opusOnly: 1, both: 1,
    falseFable: 1, falseOpus: 0, unclear: 1, unclearRate: 0.2,
    realClaimsUngrouped: 0, unjudged: 0,
  });
});

test('score treats a real claim missing from every defect group as its own defect', () => {
  const key = { C1: 'fable' };
  const verdict = { claims: [{ label: 'C1', verdict: 'real' }], defects: [] };
  const s = score(key, verdict);
  assert.equal(s.fableOnly, 1);
  assert.equal(s.realClaimsUngrouped, 1);
});
