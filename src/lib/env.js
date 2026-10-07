const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');
export const isFinePointer = () => mq('(hover: hover) and (pointer: fine)');
export const isDesktop = () => mq('(min-width: 768px)');

// One easing language across the whole site.
export const EASE_OUT = 'expo.out';
export const EASE_IN_OUT = 'expo.inOut';
