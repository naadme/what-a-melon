import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const links = ['Services', 'Work', 'About', 'Contact'];

  const scrollTo = (id) => {
    setIsOpen(false);
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream border-b-[3px] border-ink">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="font-display font-semibold text-ink text-[0.95rem] relative group"
              >
                {link}
                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-flesh transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <button onClick={() => scrollTo('Contact')} className="btn-primary text-sm py-2.5 px-5">
              Let's talk
            </button>
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
