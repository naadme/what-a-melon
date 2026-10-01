import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  { num: '01', label: 'Stalk it', description: 'We dig into your brand, audience, and goals — before touching a single pixel.', color: '#C6FF4D' },
  { num: '02', label: 'Cook it up', description: "Concepts, content, design, code. We move fast and iterate till it feels right.", color: '#FF4D6D' },
  { num: '03', label: 'Drop it', description: 'We push it into the world with precision — sites deploy, reels publish, campaigns go live.', color: '#FFD23F' },
  { num: '04', label: 'Grow it', description: "We watch what lands, double down, keep building. One project's a start; a relationship's how brands grow.", color: '#C6FF4D' },
];

export default function Process() {
  const ref = useScrollReveal();

  return (
    <section className="section-pad bg-rind" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        <div className="scroll-hidden mb-16 md:mb-20">
          <span className="sticker bg-transparent text-cream border-cream mb-6">Process</span>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl text-cream">How we work.</h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-[9px] left-0 right-0 h-[3px] bg-cream/10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
            {steps.map((step) => (
              <div key={step.num} className="scroll-hidden relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-5 h-5 rounded-full border-[3px] border-rind relative z-10" style={{ background: step.color }} />
                  <span className="font-tag text-cream/40 text-sm">{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-cream text-2xl mb-2.5">{step.label}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
