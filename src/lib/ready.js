// Fires once the page loader has lifted. Hero animations wait on this.
let ready = false;
const subs = new Set();

export function markReady() {
  if (ready) return;
  ready = true;
  subs.forEach((fn) => fn());
  subs.clear();
}

export function onReady(fn) {
  if (ready) { fn(); return () => {}; }
  subs.add(fn);
  return () => subs.delete(fn);
}
