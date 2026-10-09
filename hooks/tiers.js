// The machine-readable tier ladder, injected into every denial so the caller
// receives the fix along with the refusal. The prose ladder — its rows, effort
// bands, and the rules about them — is the delegation-tiering skill; this is
// the compressed form that fits in a hook message.
//
// Names are data and the string is derived, so consumers (the hook's denial
// text, the contract suite's skill-ladder guard) share one source. Asserting
// on a substring or a hand-kept name list goes vacuously true the moment the
// ladder is reworded or a tier is renamed, leaving a check that can no longer
// fail.
const RUNGS = [
  ['haiku', 'mechanical scouting/extraction'],
  ['sonnet', 'anchored implementation/doc research/lens review'],
  ['opus', 'reasoning beyond sonnet, open adversarial gates, open-ended design, security reads'],
  ['fable', 'work an opus attempt at xhigh fell short on'],
];

const LADDER =
  RUNGS.map(([name, use]) => `${name}=${use}`).join('; ') +
  '; a model the session cannot delegate to hands its rung to the next one up, or to the most capable one left';

const MODELS = RUNGS.map(([name]) => name);

module.exports = { LADDER, MODELS };
