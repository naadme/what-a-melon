import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/env';
import { scrollState, setLenis } from '../lib/scroll';

// Lenis drives the scroll, GSAP's ticker drives Lenis, ScrollTrigger listens.
// Touch devices keep native momentum scrolling (Lenis default), reduced-motion
// users get plain native scrolling.
export default function SmoothScroll() {
  useEffect(() => {
    let lenis;
    let tick;
    let onNative;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      setLenis(lenis);
      lenis.on('scroll', (l) => {
        scrollState.y = l.scroll;
        scrollState.direction = l.direction;
        scrollState.progress = l.progress;
        ScrollTrigger.update();
      });
      tick = (t) => {
        lenis.raf(t * 1000);
        scrollState.velocity = lenis.velocity;
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    } else {
      onNative = () => { scrollState.y = window.scrollY; };
      window.addEventListener('scroll', onNative, { passive: true });
    }

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      if (onNative) window.removeEventListener('scroll', onNative);
      if (tick) gsap.ticker.remove(tick);
      if (lenis) { lenis.destroy(); setLenis(null); }
    };
  }, []);

  return null;
}
