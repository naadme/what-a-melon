// Single shared pointer listener. Everything that reacts to the mouse
// (hero parallax, 3D melon, magnetic buttons, cursor) reads from here.
export const pointer = { x: 0, y: 0, cx: -1000, cy: -1000 };

const listeners = new Set();
let started = false;

function start() {
  if (started) return;
  started = true;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      listeners.forEach((fn) => fn(e));
    },
    { passive: true }
  );
}

export function onPointer(fn) {
  start();
  listeners.add(fn);
  return () => listeners.delete(fn);
}
