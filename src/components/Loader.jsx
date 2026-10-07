import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/env';
import { markReady } from '../lib/ready';

// Short entrance: mark pops, counter runs, panel lifts off with a curved edge.
// ~1.6s total, never waits on anything but fonts (capped at 1.5s).
export default function Loader() {
  const root = useRef(null);
  const panel = useRef(null);
  const mark = useRef(null);
  const count = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      markReady();
      return;
    }

    const html = document.documentElement;
    html.classList.add('is-loading');
    let dead = false;

    const ctx = gsap.context(() => {
      const n = { v: 0 };
      const intro = gsap.timeline();
      intro
        .fromTo(mark.current, { scale: 0.4, rotation: -30, opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.8)' }, 0)
        .to(n, {
          v: 100, duration: 0.9, ease: 'power2.inOut',
          onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(2, '0'); },
        }, 0);

      const introDone = new Promise((r) => intro.eventCallback('onComplete', r));
      const fonts = Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise((r) => setTimeout(r, 1500)),
      ]);

      Promise.all([introDone, fonts]).then(() => {
        if (dead) return;
        gsap.timeline({
          onComplete: () => { html.classList.remove('is-loading'); setGone(true); },
        })
          .to(mark.current, { scale: 1.25, rotation: 90, opacity: 0, duration: 0.45, ease: 'power3.in' }, 0)
          .to(count.current, { opacity: 0, duration: 0.3 }, 0)
          .call(markReady, null, 0.35)
          .to(panel.current, { yPercent: -105, duration: 1, ease: 'expo.inOut' }, 0.3);
      });
    }, root);

    return () => {
      dead = true;
      html.classList.remove('is-loading');
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-hidden="true">
      {/* Panel is 12vh taller than the screen so its curved lower edge only
          shows once it starts lifting off. */}
      <div
        ref={panel}
        className="absolute left-0 right-0 top-0 flex items-center justify-center bg-cream pb-[12vh] text-ink"
        style={{ height: 'calc(100% + 12vh)', borderRadius: '0 0 50% 50% / 0 0 12vh 12vh' }}
      >
        <img ref={mark} src="/logo-mark.png" alt="" className="w-52 md:w-80 h-auto object-contain" />
      </div>
      <span ref={count} className="absolute left-6 bottom-6 md:left-12 md:bottom-10 font-display font-extrabold text-6xl md:text-8xl leading-none text-ink">
        00
      </span>
    </div>
  );
}
