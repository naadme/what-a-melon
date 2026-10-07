import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { isDesktop, prefersReducedMotion } from '../lib/env';

// Scroll-linked vertical drift. speed is a fraction of the element's own
// height (0.08 = drifts ±8%). Halved on small screens, off for reduced motion.
export default function Parallax({ children, speed = 0.08, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const amount = (isDesktop() ? speed : speed * 0.5) * 100;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { yPercent: -amount }, {
        yPercent: amount,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [speed]);

  return <div ref={ref} className={className}>{children}</div>;
}
