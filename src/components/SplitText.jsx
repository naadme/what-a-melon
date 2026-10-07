import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/env';
import { onReady } from '../lib/ready';

// Masked word / character reveal. Pass the original string as children;
// "\n" makes a hard line break. Keeps the real text in aria-label.
// trigger="load" waits for the loader to lift, trigger="scroll" fires once
// when the element enters the viewport.
export default function SplitText({
  as: Tag = 'div',
  children,
  className = '',
  style,
  by = 'words',
  trigger = 'scroll',
  delay = 0,
}) {
  const ref = useRef(null);
  const text = String(children);
  const lines = text.split('\n');

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    const targets = el.querySelectorAll('[data-s]');
    let off = () => {};

    const ctx = gsap.context(() => {
      const from = by === 'chars'
        ? { yPercent: 118, rotation: 9, opacity: 0, transformOrigin: '0% 100%' }
        : { yPercent: 112, rotation: 4, transformOrigin: '0% 100%' };
      const tween = gsap.from(targets, {
        ...from,
        duration: by === 'chars' ? 1 : 1.15,
        stagger: by === 'chars' ? 0.028 : 0.07,
        delay,
        ease: 'expo.out',
        paused: true,
      });
      if (trigger === 'load') off = onReady(() => tween.play());
      else gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true, onEnter: () => tween.play() } });
    }, el);

    return () => { off(); ctx.revert(); };
  }, [by, trigger, delay, text]);

  const mask = 'inline-block overflow-hidden align-top pt-[0.08em] pb-[0.14em] -mt-[0.08em] -mb-[0.14em]';

  return (
    <Tag ref={ref} className={className} style={style} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(' ').map((word, wi, arr) => (
            <span key={wi}>
              <span className={`${mask} ${by === 'chars' ? 'whitespace-nowrap' : ''}`}>
                {by === 'chars'
                  ? [...word].map((ch, ci) => (
                      <span key={ci} data-s className="inline-block will-change-transform">{ch}</span>
                    ))
                  : <span data-s className="inline-block will-change-transform">{word}</span>}
              </span>
              {wi < arr.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
