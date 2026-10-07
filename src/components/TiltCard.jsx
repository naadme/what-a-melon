import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { isFinePointer, prefersReducedMotion } from '../lib/env';

// Wraps a project card with (1) a perspective entrance on scroll and
// (2) a pointer-driven 3D tilt that also leans slightly toward the cursor.
// The wrapper owns all JS transforms so the card's own CSS rotate/hover
// classes keep working untouched.
export default function TiltCard({ children, cursor = 'VIEW', index = 0 }) {
  const wrap = useRef(null);
  const tilt = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const w = wrap.current;
    const t = tilt.current;
    const cleanups = [];

    const ctx = gsap.context(() => {
      gsap.from(w, {
        y: 90, scale: 0.92, rotationX: -16, opacity: 0,
        transformPerspective: 900, transformOrigin: '50% 100%',
        duration: 1.2, delay: (index % 3) * 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: w, start: 'top 90%', once: true },
        onComplete: () => gsap.set(w, { clearProps: 'transform,opacity' }),
      });

      if (isFinePointer()) {
        gsap.set(t, { transformPerspective: 900 });
        const o = { duration: 0.6, ease: 'power3.out' };
        const rx = gsap.quickTo(t, 'rotationX', o);
        const ry = gsap.quickTo(t, 'rotationY', o);
        const tx = gsap.quickTo(t, 'x', o);
        const ty = gsap.quickTo(t, 'y', o);

        const move = (e) => {
          const r = w.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          ry(nx * 12); rx(-ny * 12); tx(nx * 12); ty(ny * 12);
          w.style.setProperty('--mx', `${(nx + 0.5) * 100}%`);
          w.style.setProperty('--my', `${(ny + 0.5) * 100}%`);
        };
        const leave = () => {
          gsap.to(t, { rotationX: 0, rotationY: 0, x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        };
        w.addEventListener('pointermove', move);
        w.addEventListener('pointerleave', leave);
        cleanups.push(() => { w.removeEventListener('pointermove', move); w.removeEventListener('pointerleave', leave); });
      }
    }, w);

    return () => { cleanups.forEach((fn) => fn()); ctx.revert(); };
  }, [index]);

  return (
    <div ref={wrap} className="proj-wrap" data-cursor={cursor}>
      <div ref={tilt} className="will-change-transform">{children}</div>
    </div>
  );
}
