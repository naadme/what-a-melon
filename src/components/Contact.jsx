import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const services = [
  'Reel Making',
  'Social Media Management',
  'Creative & Poster Design',
  'Website Development',
  'Instagram Management',
  'Branding & Digital Marketing',
  'Multiple Services',
];

const initialForm = {
  name: '',
  email: '',
  brand: '',
  service: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const ref = useScrollReveal();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.service) e.service = 'Please select a service';
    if (!form.message.trim()) e.message = 'Tell us a bit about your project';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const contactEmail = 'piyushpanbude2107@gmail.com';

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const subject = `New project inquiry${form.brand ? ` — ${form.brand}` : ''}`;
    const bodyLines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.brand ? `Brand / Business: ${form.brand}` : null,
      `Service: ${form.service}`,
      '',
      form.message,
    ].filter(Boolean);
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;

    setSubmitted(true);
    setForm(initialForm);
    setErrors({});
  };

  const instagramUrl = 'https://instagram.com/whatamelon';
  const whatsappUrl = 'https://wa.me/919321881100';
  const emailUrl = `mailto:${contactEmail}`;

  return (
    <section id="contact" className="section-pad bg-rind" ref={ref}>
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 lg:gap-20">
          <div className="lg:col-span-2 scroll-hidden">
            <span className="sticker bg-flesh text-ink mb-6">Let's talk</span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-cream leading-tight mb-6">
              Got a brand worth talking about?
            </h2>
            <p className="text-cream/55 text-sm leading-relaxed mb-10 max-w-xs">
              Drop us a message. We reply fast and we're honest about what we can actually do for you.
            </p>

            <div className="flex flex-col gap-4">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border-2 border-cream/20 flex items-center justify-center text-cream/60 group-hover:border-zest group-hover:text-zest transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-cream/60 group-hover:text-cream text-sm transition-colors duration-200">@whatamelon</span>
              </a>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border-2 border-cream/20 flex items-center justify-center text-cream/60 group-hover:border-zest group-hover:text-zest transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.1 1.5 5.84L0 24l6.32-1.48A11.95 11.95 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52z" fill="currentColor" opacity="0.5" />
                    <path d="M17.5 14.5c-.3-.15-1.75-.87-2.02-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.17c-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.25-.6-.5-.52-.68-.53h-.57c-.2 0-.52.07-.8.37S6 8.8 6 10c0 1.2.88 2.35 1 2.52.13.17 1.72 2.65 4.18 3.72.58.25 1.04.4 1.4.51.59.18 1.12.16 1.54.1.47-.07 1.45-.59 1.66-1.17.2-.57.2-1.07.14-1.17-.06-.1-.26-.17-.55-.32z" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-cream/60 group-hover:text-cream text-sm transition-colors duration-200">WhatsApp us</span>
              </a>

              <a href={emailUrl} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border-2 border-cream/20 flex items-center justify-center text-cream/60 group-hover:border-zest group-hover:text-zest transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-cream/60 group-hover:text-cream text-sm transition-colors duration-200">{contactEmail}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 scroll-hidden">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-6 bg-cream text-ink rounded-2xl border-[3px] border-ink shadow-pop-zest">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-zest border-2 border-ink">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L19 7" stroke="#14110D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink text-2xl mb-2">Almost there!</h3>
                  <p className="text-ink/60 text-sm">Your email app should've opened with everything filled in — just hit send.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="btn-outline border-ink text-ink mt-2">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs font-tag uppercase text-cream/50 mb-2">Name</label>
                    <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Your name" className="input-field" />
                    {errors.name && <p className="text-flesh text-xs mt-2">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-tag uppercase text-cream/50 mb-2">Email</label>
                    <input type="email" value={form.email} onChange={handleChange('email')} placeholder="your@email.com" className="input-field" />
                    {errors.email && <p className="text-flesh text-xs mt-2">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-tag uppercase text-cream/50 mb-2">Brand / Business</label>
                    <input type="text" value={form.brand} onChange={handleChange('brand')} placeholder="What's the brand?" className="input-field" />
                  </div>

                  <div>
                    <label className="block text-xs font-tag uppercase text-cream/50 mb-2">Service</label>
                    <select
                      value={form.service}
                      onChange={handleChange('service')}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="" disabled>What do you need?</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.service && <p className="text-flesh text-xs mt-2">{errors.service}</p>}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-tag uppercase text-cream/50 mb-2">Message</label>
                  <textarea
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={4}
                    className="input-field resize-none"
                  />
                  {errors.message && <p className="text-flesh text-xs mt-2">{errors.message}</p>}
                </div>

                <button type="submit" className="btn-primary bg-zest text-ink hover:shadow-[5px_5px_0_0_#FFF8EC] w-full sm:w-auto justify-center text-base py-4 px-10">
                  Send it
                </button>

                <p className="text-cream/50 text-xs mt-4">
                  This opens your email app with the details pre-filled — no backend required.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
