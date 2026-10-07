import { useState, useEffect, useRef } from 'react';
import Magnetic from './Magnetic';
import { getLenis, scrollToTarget, scrollToTop } from '../lib/scroll';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const nav = useRef(null);

  // Lock both native and Lenis scrolling while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const lenis = getLenis();
    if (isOpen) {
      lenis?.stop();
      // The bar may have auto-hidden on the way here — bring it back so the
      // close (X) button is reachable while the menu is open.
      if (nav.current) nav.current.dataset.hidden = '0';
    } else {
      lenis?.start();
    }
    return () => { document.body.style.overflow = ''; getLenis()?.start(); };
  }, [isOpen]);

  // Hide on scroll down, return on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (!nav.current) return;
      if (y > 240 && y > last + 4) nav.current.dataset.hidden = '1';
      else if (y < last - 4 || y <= 240) nav.current.dataset.hidden = '0';
      last = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const links = ['Services', 'Work', 'About', 'Contact'];

  const scrollTo = (id) => {
    setIsOpen(false);
    // Let the menu release the scroll lock before Lenis starts moving.
    setTimeout(() => scrollToTarget(id.toLowerCase()), 0);
  };

  return (
    <>
      <nav ref={nav} data-nav data-hidden="0" className="fixed top-0 left-0 right-0 z-50 bg-cream border-b-[3px] border-ink">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => { setIsOpen(false); scrollToTop(); }}
            className="flex items-center gap-2.5 text-ink"
          >
            <img
              src="/logo.png"
              alt="What A Melon Media"
              className="h-11 md:h-14 w-auto object-contain"
            />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Magnetic key={link} strength={0.3}>
                <button
                  onClick={() => scrollTo(link)}
                  className="font-display font-semibold text-ink text-[0.95rem] relative group"
                >
                  {link}
                  <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-flesh transition-all duration-200 group-hover:w-full" />
                </button>
              </Magnetic>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Magnetic strength={0.4}>
              <button onClick={() => scrollTo('Contact')} className="btn-primary text-sm py-2.5 px-5">
                Let's talk
              </button>
            </Magnetic>
          </div>

          <button
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-[5px]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className={`block w-6 h-[3px] bg-ink rounded-full transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <span className={`block w-6 h-[3px] bg-ink rounded-full transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[3px] bg-ink rounded-full transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu — loud on purpose */}
      <div
        className={`fixed inset-0 z-40 bg-zest transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col justify-center px-8">
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link}>
                <button
                  onClick={() => scrollTo(link)}
                  className="font-display font-bold text-5xl text-ink py-2 focus-visible:outline-ink"
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => scrollTo('Contact')} className="btn-primary self-start mt-8 border-ink focus-visible:outline-ink">
            Let's talk
          </button>
        </div>
      </div>
    </>
  );
}
