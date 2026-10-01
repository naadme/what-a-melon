import { useEffect, useRef } from 'react';

export function useScrollReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const els = container.querySelectorAll('.scroll-hidden');
      els.forEach(el => el.classList.add('scrolled-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scrolled-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const els = container.querySelectorAll('.scroll-hidden');
    els.forEach(el => observer.observe(el));

    // Elements added after mount (e.g. portfolio cards remounting when a
    // category filter changes) start at opacity:0 too — keep observing any
    // new .scroll-hidden nodes so they reveal instead of staying invisible.
    const watch = new MutationObserver(() => {
      container.querySelectorAll('.scroll-hidden').forEach(el => {
        if (!el.classList.contains('scrolled-in')) observer.observe(el);
      });
    });
    watch.observe(container, { childList: true, subtree: true });

    return () => {
      watch.disconnect();
      observer.disconnect();
    };
  }, []);

  return ref;
}
