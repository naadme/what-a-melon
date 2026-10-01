import MelonMark from './MelonMark';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const tickerItems = [
    'REELS THAT HIT DIFFERENT', 'BRANDING THAT SLAPS', 'WEBSITES THAT CONVERT', 'CONTENT THAT COMPOUNDS',
  ];

  return (
    <section className="relative overflow-hidden bg-rind pt-24 md:pt-32 pb-0">
      {/* Big bleeding melon mark */}
      <MelonMark
        rotate={false}
        className="absolute -top-16 -right-24 w-72 h-72 md:w-[30rem] md:h-[30rem] rotate-12 opacity-95 pointer-events-none"
      />

      <div className="relative max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 pb-20 md:pb-28">
        <span className="animate-hero-1 sticker bg-zest text-ink mb-8">
          Social-first creative studio
        </span>

        <h1 className="animate-hero-2 font-display font-extrabold text-cream leading-[0.95] -rotate-1 origin-left"
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6.5rem)' }}>
          MAKE THEM<br />STOP SCROLLING.
        </h1>

        <p className="animate-hero-3 mt-8 text-cream/70 text-lg md:text-xl leading-relaxed max-w-lg">
          Reels, socials, branding and websites — we build the stuff people
          actually stop for. No boring agency energy, just juicy work that performs.
        </p>

        <div className="animate-hero-4 flex flex-wrap gap-4 mt-10">
          <button onClick={() => scrollTo('work')} className="btn-primary bg-zest text-ink hover:shadow-[5px_5px_0_0_#FFF8EC]">
            See the work
          </button>
          <button onClick={() => scrollTo('contact')} className="btn-outline border-cream text-cream">
            Say hi
          </button>
        </div>
      </div>

      {/* Loud ticker strip */}
      <div className="relative bg-flesh py-3 -rotate-1 origin-left scale-105 border-y-[3px] border-ink overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center">
              {tickerItems.map((item, j) => (
                <span key={j} className="flex items-center">
                  <span className="font-display font-bold text-sm md:text-base text-ink mx-5">{item}</span>
                  <span className="text-ink text-sm">★</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
