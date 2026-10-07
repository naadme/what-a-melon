import { useEffect } from 'react';
import { gsap } from '../lib/gsap';
import { onPointer } from '../lib/pointer';
import { isFinePointer, prefersReducedMotion } from '../lib/env';

// Every [data-depth] inside the root drifts with the cursor. depth 1 = the
// foreground (moves the most), 0.2 = far background. Negative = opposite way.
export function usePointerParallax(rootRef, amplitude = 36) {
  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer() || !rootRef.current) return;
    const layers = [...rootRef.current.querySelectorAll('[data-depth]')].map((el) => ({
      depth: parseFloat(el.dataset.depth),
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
    }));
    const off = onPointer((e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      layers.forEach((l) => { l.x(-nx * l.depth * amplitude); l.y(-ny * l.depth * amplitude); });
    });
    return () => {
      off();
      rootRef.current?.querySelectorAll('[data-depth]').forEach((el) => gsap.set(el, { x: 0, y: 0 }));
    };
  }, [rootRef, amplitude]);
}
