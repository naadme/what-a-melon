import { scrollToTarget } from '../lib/scroll';

const scrollTo = (id) => scrollToTarget(id);

const navLinks = ['Services', 'Work', 'About'];
const contactEmail = 'whatamelonmedia@gmail.com';
const whatsappUrl = 'https://wa.me/918928821881';
const instagramUrl = 'https://www.instagram.com/whatamelonmedia?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==';

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
                  <button onClick={() => scrollTo(link.toLowerCase())} className="link-slide text-ink/60 hover:text-ink text-sm font-medium">
                    {link}
                  </button>
                </li>
              ))}
            </ul>

            <ul className="flex flex-col gap-3">
              <li><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-slide text-ink/60 hover:text-ink text-sm font-medium">Instagram</a></li>
              <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-slide text-ink/60 hover:text-ink text-sm font-medium">WhatsApp</a></li>
              <li><a href={`mailto:${contactEmail}`} className="link-slide text-ink/60 hover:text-ink text-sm font-medium">{contactEmail}</a></li>
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
