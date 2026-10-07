import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCurtain } from '../hooks/useCurtain';
import Parallax from './Parallax';

const traits = [
  { label: 'Creative-first', description: "Ideas before templates. Every project starts with: what would actually be interesting here?", rotate: '-rotate-2' },
  { label: 'Built for the feed', description: 'We live in the scroll. Everything is built for how people actually consume content — fast and unforgiving.', rotate: 'rotate-1' },
  { label: 'Obsessed with growth', description: "Pretty isn't the job. Everything we make is built to perform, grow, and convert.", rotate: '-rotate-1' },
];

export default function About() {
  const ref = useScrollReveal();
  const sectionRef = useRef(null);
  useCurtain(sectionRef);

  return (
    <section ref={sectionRef} id="about" className="section-pad bg-flesh text-ink">
      <div className="max-w-screen-xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
          <div className="lg:col-span-7 scroll-hidden">
            <h2 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.02] -rotate-1 origin-left mb-8 max-w-xl">
              We make your brand look stupid good.
            </h2>
            <div className="space-y-5 text-ink/75 text-base md:text-lg leading-relaxed max-w-lg">
              <p>
                What A Melon is a scrappy, obsessive little studio that mixes
                content, design and code into one thing: a digital presence
                people actually notice.
              </p>
              <p>
                We work with founders, restaurants, creators and small brands
                who want to look expensive without the agency-speak, the
                six-week decks, or the stock photography.
              </p>
              <p className="font-display font-bold text-xl">
                Good instincts. Fast execution. Zero fluff.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 scroll-hidden flex flex-col gap-6">
            {traits.map((trait, i) => (
              <Parallax key={trait.label} speed={[0.07, -0.05, 0.09][i % 3]}>
                <div className={`${trait.rotate} bg-cream border-[3px] border-ink rounded-2xl p-6 shadow-pop-sm`}>
                  <h3 className="font-display font-bold text-lg text-ink mb-1.5">{trait.label}</h3>
                  <p className="text-ink/60 text-sm leading-relaxed">{trait.description}</p>
                </div>
              </Parallax>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
