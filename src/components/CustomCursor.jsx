import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { isFinePointer, prefersReducedMotion } from '../lib/env';

// Dot + trailing ring. Default: tiny. Links/buttons: ring grows and tints.
// Anything with data-cursor="LABEL": ring becomes a filled label bubble.
// Only mounts on fine pointers — touch devices never see it.
export default function CustomCursor() {
  const dot = useRef(null);
  const wrap = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!prefersReducedMotion() && isFinePointer()) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    gsap.set([dot.current, wrap.current], { xPercent: -50, yPercent: -50, opacity: 0 });
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const wx = gsap.quickTo(wrap.current, 'x', { duration: 0.5, ease: 'expo.out' });
    const wy = gsap.quickTo(wrap.current, 'y', { duration: 0.5, ease: 'expo.out' });

    let shown = false;
    let mode = 'default';
    let text = '';
    let baseScale = 1;
    let lastTarget = null;

    const setMode = (next, nextText = '') => {
      if (next === mode && nextText === text) return;
      mode = next;
      text = nextText;
      label.current.textContent = nextText;
      const hidden = next === 'hidden';
      gsap.to([dot.current, wrap.current], { opacity: hidden || !shown ? 0 : 1, duration: 0.2, overwrite: 'auto' });
      baseScale = next === 'label' ? 2.2 : next === 'hover' ? 1.6 : 1;
      gsap.to(ring.current, {
        scale: baseScale,
        backgroundColor: next === 'label' ? '#FF4D6D' : next === 'hover' ? 'rgba(255,77,109,0.3)' : 'rgba(255,77,109,0)',
        duration: 0.5,
        ease: 'expo.out',
      });
      gsap.to(label.current, { opacity: next === 'label' ? 1 : 0, duration: 0.25 });
      gsap.to(dot.current, { scale: next === 'label' ? 0 : 1, duration: 0.25 });
    };

    const resolve = (t) => {
      lastTarget = t;
      if (!t) return setMode('default');
      if (t.matches('input, textarea, select')) return setMode('hidden');
      if (t.dataset.cursor) return setMode('label', t.dataset.cursor);
      return setMode('hover');
    };

    const find = (el) => el?.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select, label') || null;

    const move = (e) => {
      if (e.pointerType === 'touch') return;
      if (!shown) {
        shown = true;
        gsap.set([dot.current, wrap.current], { x: e.clientX, y: e.clientY });
        if (mode !== 'hidden') gsap.to([dot.current, wrap.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX); dy(e.clientY); wx(e.clientX); wy(e.clientY);
    };
    const over = (e) => resolve(find(e.target));
    const down = () => gsap.to(ring.current, { scale: baseScale * 0.85, duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: baseScale, duration: 0.4, ease: 'expo.out' });
    const click = () => requestAnimationFrame(() => resolve(lastTarget && document.contains(lastTarget) ? lastTarget : null));
    const leave = () => gsap.to([dot.current, wrap.current], { opacity: 0, duration: 0.2 });
    const enter = () => { if (shown && mode !== 'hidden') gsap.to([dot.current, wrap.current], { opacity: 1, duration: 0.2 }); };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerdown', down);
    document.addEventListener('pointerup', up);
    document.addEventListener('click', click);
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);

    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('click', click);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dot} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] h-2.5 w-2.5 rounded-full border-2 border-ink bg-flesh" />
      <div ref={wrap} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] grid h-10 w-10 place-items-center">
        {/* ink ring with a cream halo: readable on every section colour */}
        <div ref={ring} className="absolute inset-0 rounded-full border-2 border-ink" style={{ boxShadow: '0 0 0 1.5px #FFF8EC' }} />
        <span ref={label} className="relative font-tag text-[9px] font-bold uppercase tracking-wide text-ink opacity-0" />
      </div>
    </>
  );
}
