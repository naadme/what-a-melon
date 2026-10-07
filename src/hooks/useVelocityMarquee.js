import { useEffect } from 'react';
import { gsap } from '../lib/gsap';
import { scrollState } from '../lib/scroll';
import { prefersReducedMotion } from '../lib/env';

// The CSS marquee keeps running, but scroll velocity speeds it up (and
// reverses it when scrolling up) and skews the strip. Pure compositor work.
export function useVelocityMarquee(trackRef, skewRef) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    const skew = skewRef.current;
    if (!track || !skew) return;
    const setSkew = gsap.quickSetter(skew, 'skewX', 'deg');
    let rate = 1;
    let skewVal = 0;

    const tick = () => {
      const v = scrollState.velocity || 0;
      const targetRate = gsap.utils.clamp(-4, 7, 1 + v * 0.12);
      rate += (targetRate - rate) * 0.12;
      const targetSkew = gsap.utils.clamp(-9, 9, -v * 0.35);
      skewVal += (targetSkew - skewVal) * 0.15;
      const anim = track.getAnimations()[0];
      if (anim) anim.playbackRate = rate;
      setSkew(skewVal);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [trackRef, skewRef]);
}
