import { useScrollReveal } from '../hooks/useScrollReveal';
import MelonMark from './MelonMark';

export default function CTA() {
  const ref = useScrollReveal();

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-butter text-ink" ref={ref}>
      <MelonMark className="absolute -left-10 -bottom-10 w-40 h-40 md:w-56 md:h-56 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="scroll-hidden max-w-2xl">
          <h2 className="font-display font-extrabold text-5xl md:text-7xl leading-[0.98] -rotate-1 origin-left mb-6">
            Ready to blow up your feed?
          </h2>
          <p className="text-ink/70 text-lg md:text-xl mb-10 leading-relaxed">
            
          </p>
          <button onClick={scrollToContact} className="btn-primary bg-ink text-cream border-ink">
            Start a project
          </button>
        </div>
      </div>
    </section>
  );
}
