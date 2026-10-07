import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCurtain } from '../hooks/useCurtain';
import { scrollToTarget } from '../lib/scroll';
import MelonMark from './MelonMark';
import Magnetic from './Magnetic';
import Arrow from './Arrow';

export default function CTA() {
  const ref = useScrollReveal();
  const sectionRef = useRef(null);
  useCurtain(sectionRef);

  const scrollToContact = () => scrollToTarget('contact');

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32 bg-butter text-ink">
      <MelonMark className="absolute -left-10 -bottom-10 w-40 h-40 md:w-56 md:h-56 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20" ref={ref}>
        <div className="scroll-hidden max-w-2xl">
          <h2 className="font-display font-extrabold text-5xl md:text-7xl leading-[0.98] -rotate-1 origin-left mb-6">
            Ready to blow up your feed?
          </h2>
          <p className="text-ink/70 text-lg md:text-xl mb-10 leading-relaxed">
            
          </p>
          <Magnetic strength={0.4}>
            <button onClick={scrollToContact} className="btn-primary bg-ink text-cream border-ink">
              Start a project <Arrow />
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
