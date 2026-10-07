import { useEffect } from 'react';
import { gsap } from '../lib/gsap';
import { isDesktop, prefersReducedMotion } from '../lib/env';

// Section "curtain": as a section scrolls in, it grows from a rounded,
// slightly inset card to full-bleed. Desktop only (clip-path on tall
// sections is too costly on phones). Clip is removed once fully in view so
// shadows / rotated children are never cropped.
export function useCurtain(ref) {
  useEffect(() => {
    if (prefersReducedMotion() || !isDesktop() || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0px 3vw 0px 3vw round 64px 64px 0px 0px)' },
        {
          clipPath: 'inset(0px 0vw 0px 0vw round 0px 0px 0px 0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 96%',
            end: 'top 30%',
            scrub: true,
            onLeave: () => { el.style.clipPath = 'none'; },
          },
        }
      );
    }, el);
    return () => { ctx.revert(); el.style.clipPath = ''; };
  }, [ref]);
}
