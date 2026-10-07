// Shared scroll state (written by SmoothScroll, read by hooks / 3D scene)
// plus helpers so every in-page link goes through Lenis when it exists.
export const scrollState = { y: 0, velocity: 0, direction: 1, progress: 0 };

let lenis = null;
export const setLenis = (l) => { lenis = l; };
export const getLenis = () => lenis;

const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.5, easing: expoOut });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.5, easing: expoOut });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
