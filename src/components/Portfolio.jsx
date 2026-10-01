import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const categories = ['All', 'Reels', 'Social', 'Branding', 'Websites', 'Creative'];

const projects = [
  { id: 1, category: 'Branding', title: 'Brand Identity', sub: 'Visual System', gradient: 'linear-gradient(135deg, #0E1512 0%, #1a4a2a 45%, #C6FF4D 100%)', rotate: '-rotate-2' },
  { id: 2, category: 'Reels', title: 'Motion Content', sub: 'Short-Form Video', gradient: 'linear-gradient(145deg, #4a0a1a 0%, #7a1030 50%, #FF4D6D 100%)', rotate: 'rotate-2', video: '/assets/reels/1000170743.mp4', videoPoster: '/assets/reels/1000170743-poster.jpg' },
  { id: 3, category: 'Websites', title: 'Web Experience', sub: 'Design & Dev', gradient: 'linear-gradient(120deg, #14110D 0%, #2a2410 50%, #FFD23F 100%)', rotate: '-rotate-1' },
  { id: 4, category: 'Creative', title: 'Campaign Visuals', sub: 'Art Direction', gradient: 'linear-gradient(160deg, #3a1a00 0%, #7a3d00 50%, #FF9800 100%)', rotate: 'rotate-1' },
  { id: 5, category: 'Social', title: 'Social Strategy', sub: 'Content & Growth', gradient: 'linear-gradient(135deg, #0a1020 0%, #0D2B1A 50%, #C6FF4D 100%)', rotate: 'rotate-2' },
  { id: 6, category: 'Branding', title: 'Logo & Identity', sub: 'Brand Creation', gradient: 'linear-gradient(135deg, #3a0a20 0%, #6a1040 50%, #FF4D6D 100%)', rotate: '-rotate-2' },
];

// Frame state for the reel card: the compact box keeps the card's 4/3
// proportions, the playing box uses the video's own intrinsic ratio
// (read from the <video> element — never assumed or hardcoded).
const COMPACT_RATIO = { w: 4, h: 3 };

export default function Portfolio() {
  const [active, setActive] = useState('All');
  const [reelOpen, setReelOpen] = useState(false);
  const [reelSize, setReelSize] = useState({ w: 0, h: 0 });
  // Nothing is downloaded while the card sits idle: preload stays "none" until
  // the visitor actually asks for the reel. The poster image is all we serve.
  const [reelPreload, setReelPreload] = useState('none');
  const pendingPlayRef = useRef(false);
  const videoRef = useRef(null);
  const ref = useScrollReveal();

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  const stopReel = () => {
    pendingPlayRef.current = false;
    const v = videoRef.current;
    if (v) {
      v.pause();
      try { v.currentTime = 0; } catch { /* metadata not ready yet */ }
    }
    setReelOpen(false);
  };

  const toggleReel = () => {
    const v = videoRef.current;
    if (!v) return;
    if (reelOpen) {
      stopReel();
      return;
    }
    if (!reelSize.w || !reelSize.h) {
      // First interaction — nothing has been fetched up to this point.
      pendingPlayRef.current = true;
      const w = parseInt(v.getAttribute('width'), 10);
      const h = parseInt(v.getAttribute('height'), 10);
      if (w > 0 && h > 0) {
        // Expand right away from the intrinsic size the element declares, so
        // the card doesn't stall waiting on the network. loadedmetadata will
        // confirm (or correct) it with the real videoWidth/videoHeight.
        setReelSize({ w, h });
        setReelOpen(true);
      }
      setReelPreload('metadata'); // effect below turns this into v.load()
      return;
    }
    setReelOpen(true);
    v.play().catch(() => {});
  };

  // Flipping the preload attribute doesn't start a fetch on its own, so ask the
  // element to load — this is the single point where the network is touched.
  useEffect(() => {
    const v = videoRef.current;
    if (reelPreload === 'metadata' && v && v.readyState === 0) v.load();
  }, [reelPreload]);

  const handleLoadedMetadata = (e) => {
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight) {
      setReelSize({ w: v.videoWidth, h: v.videoHeight });
    }
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      setReelOpen(true);
      v.play().catch(() => {});
    }
  };

  // Never leave an expanded reel behind when the category filter changes.
  useEffect(() => {
    stopReel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const ratio = reelOpen && reelSize.w && reelSize.h ? reelSize : COMPACT_RATIO;

  return (
    <section id="work" className="section-pad bg-cream text-ink">
      <div className="max-w-screen-xl mx-auto" ref={ref}>
        <div className="scroll-hidden mb-10 md:mb-12">
          <span className="sticker bg-flesh text-ink mb-6">Portfolio</span>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl mb-3">Work we're proud of.</h2>
          <p className="text-ink/55 text-sm md:text-base max-w-sm">
            Placeholder compositions for now — real client work is dropping soon.
          </p>
        </div>

        <div className="scroll-hidden flex flex-wrap gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-tag text-xs uppercase px-4 py-2 rounded-full border-2 border-ink transition-all duration-200 ${
                active === cat ? 'bg-ink text-cream' : 'bg-transparent text-ink hover:bg-ink/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* items-start keeps sibling cards at their own height while the reel expands */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 items-start">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className={`scroll-hidden ${project.rotate} rounded-2xl border-[3px] border-ink shadow-pop transition-all duration-300 hover:rotate-0 hover:shadow-pop-flesh hover:-translate-y-1 overflow-hidden group cursor-default`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className={`relative ${project.video ? 'reel-media' : 'aspect-[4/3]'}`}
                style={{
                  background: project.gradient,
                  ...(project.video
                    ? {
                        aspectRatio: `${ratio.w} / ${ratio.h}`,
                        transition: 'aspect-ratio 520ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }
                    : null),
                }}
              >
                {project.video && (
                  <div
                    className="absolute inset-2.5 sm:inset-3 overflow-hidden rounded-lg ring-1 ring-ink/50 cursor-pointer"
                    onClick={toggleReel}
                  >
                    <video
                      ref={videoRef}
                      className="absolute inset-0 h-full w-full object-contain"
                      src={project.video}
                      poster={project.videoPoster}
                      width="1080"
                      height="1920"
                      muted
                      loop
                      playsInline
                      preload={reelPreload}
                      onLoadedMetadata={handleLoadedMetadata}
                      onError={() => {
                        // Network/decode hiccup: forget the request so the next
                        // click starts over instead of being swallowed.
                        if (pendingPlayRef.current) setReelPreload('none');
                      }}
                      aria-label={`${project.title} reel`}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-flesh/10 via-transparent to-[#4a0a1a]/45" />
                    {!reelOpen ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleReel(); }}
                        aria-label={`Play ${project.title} reel`}
                        className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-flesh text-ink transition-transform duration-200 hover:scale-110"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 translate-x-[1px]">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleReel(); }}
                        aria-label={`Pause ${project.title} reel`}
                        className="absolute right-2 top-2 rounded-full border border-cream/25 bg-ink/80 px-2.5 py-1 font-tag text-[10px] uppercase tracking-wide text-cream transition-colors duration-200 hover:bg-ink"
                      >
                        <span aria-hidden="true">❚❚</span> Pause
                      </button>
                    )}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-ink/70 backdrop-blur-0">
                  <span className="font-tag text-xs uppercase text-cream/60">{project.category}</span>
                  <h3 className="font-display font-bold text-xl text-cream leading-tight">{project.title}</h3>
                  <p className="text-cream/50 text-xs mt-0.5">{project.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
