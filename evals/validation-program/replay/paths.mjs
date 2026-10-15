// Locations of the transcript snapshot and the private data directory. They come
// from the environment, so no user path lives in the repo; a missing one stops
// the script before it reads or writes anything.
function required(name, what) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set; point it at the ${what}`);
  return value;
}
export const SNAP = required('VALIDATION_SNAP', 'transcript snapshot');
export const DATA = required('VALIDATION_DATA', 'private replay data directory');
