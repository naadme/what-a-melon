import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { onPointer } from '../lib/pointer';
import { isFinePointer, prefersReducedMotion } from '../lib/env';

// Wrap any button/link. It leans toward the cursor when it's close and
// springs back when it leaves. No-op on touch and reduced motion.
export default function Magnetic({ children, strength = 0.35, className = 'inline-block' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;
    const el = ref.current;
    const qx = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' });
    let engaged = false;

    const off = onPointer((e) => {
      const r = el.getBoundingClientRect();
      // Remove our own offset so the centre doesn't chase itself.
      const cx = r.left + r.width / 2 - gsap.getProperty(el, 'x');
      const cy = r.top + r.height / 2 - gsap.getProperty(el, 'y');
      const reach = Math.max(r.width, r.height) / 2 + 60;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      if (Math.hypot(dx, dy) < reach) {
        engaged = true;
        qx(dx * strength);
        qy(dy * strength);
      } else if (engaged) {
        engaged = false;
        qx(0);
        qy(0);
      }
    });

    return () => { off(); gsap.set(el, { x: 0, y: 0 }); };
  }, [strength]);

  return <span ref={ref} className={className}>{children}</span>;
}
