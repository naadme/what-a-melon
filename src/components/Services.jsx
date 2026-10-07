import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCurtain } from '../hooks/useCurtain';

const services = [
  { num: '01', title: 'Reels That Hit', description: "Scroll-stopping, sound-on, shareable. We write, shoot, and edit reels built for the feed, not the boardroom." },
  { num: '02', title: 'Social Media Management', description: 'Strategy, scheduling, captions, comments. We run the whole account like it\'s our own brand.' },
  { num: '03', title: 'Creative & Poster Design', description: 'Posters, carousels, brand graphics — visuals that grab attention in half a second flat.' },
  { num: '04', title: 'Website Development', description: "Fast, punchy, built to convert. Sites that don't feel like everyone else's template." },
  { num: '05', title: 'Instagram Management', description: 'Grid glow-ups, story strategy, reel drops, growth. The whole account, handled.' },
  { num: '06', title: 'Branding & Digital Marketing', description: 'Identity and voice that make you unmistakable — then paid strategy to get you seen.' },
];

export default function Services() {
  const ref = useScrollReveal();
  const sectionRef = useRef(null);
  useCurtain(sectionRef);

  return (
    <section ref={sectionRef} id="services" className="section-pad bg-zest text-ink">
      <div className="max-w-screen-xl mx-auto" ref={ref}>
        <div className="scroll-hidden mb-14 md:mb-16">
          <span className="sticker bg-cream text-ink mb-6">Services</span>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl">The full menu.</h2>
        </div>

        <div className="scroll-hidden border-t-[3px] border-ink">
          {services.map((s) => (
            <div key={s.num} className="group border-b-[3px] border-ink transition-colors duration-200 hover:bg-butter">
              <div className="flex items-start gap-5 md:gap-10 py-7 md:py-8 px-2 md:px-4">
                <span className="font-tag text-ink/50 text-sm md:text-base w-7 flex-shrink-0 pt-1.5">{s.num}</span>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-baseline">
                  <h3 className="md:col-span-4 font-display font-bold text-2xl md:text-3xl leading-tight">{s.title}</h3>
                  <p className="md:col-span-7 text-ink/70 text-sm md:text-base leading-relaxed">{s.description}</p>
                </div>
                <span className="hidden md:block font-display font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
