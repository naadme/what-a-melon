const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const navLinks = ['Services', 'Work', 'About', 'Contact'];
const contactEmail = 'piyushpanbude2107@gmail.com';
const whatsappUrl = 'https://wa.me/919321881100';
const instagramUrl = 'https://instagram.com/whatamelon';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-[3px] border-ink bg-cream text-ink">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-xs">
            <img
              src="/logo.png"
              alt="What A Melon Media"
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-ink/55 text-sm leading-relaxed">
              A creative agency for brands that refuse to blend in. Reels, socials,
              branding and websites that actually get noticed.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            <ul className="flex flex-col gap-3">
              {navLinks.map(link => (
                <li key={link}>
                  <button onClick={() => scrollTo(link.toLowerCase())} className="text-ink/60 hover:text-ink text-sm font-medium transition-colors duration-200">
                    {link}
                  </button>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-3">
              <li><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-ink/60 hover:text-ink text-sm font-medium transition-colors duration-200">Instagram</a></li>
              <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-ink/60 hover:text-ink text-sm font-medium transition-colors duration-200">WhatsApp</a></li>
              <li><a href={`mailto:${contactEmail}`} className="text-ink/60 hover:text-ink text-sm font-medium transition-colors duration-200">{contactEmail}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t-[3px] border-ink">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-ink/50 text-xs">© {year} What A Melon. Juicy work only.</p>
          <p className="text-ink/40 text-xs">Made fresh, not from concentrate.</p>
        </div>
      </div>
    </footer>
  );
}
