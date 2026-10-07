import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useCurtain } from '../hooks/useCurtain';
import SplitText from './SplitText';
import TiltCard from './TiltCard';

// Portfolio content. Every card traces back to a real file in the supplied
// media folder, re-encoded into /public/assets/projects so the site ships
// standalone (nothing is read from the Desktop at runtime):
//   1000240219.mp4                  -> reopening-teaser.mp4  + poster
//   VID_20251102_012834_948_bsl.mp4 -> delivery-day-reel.mp4 + poster
//   Bun_Hub_High_Quality_Poster.pdf -> bun-hub-key-art.jpg
// Reels carry previewOnHover: muted playback starts on hover and parks back on
// the first frame when the pointer leaves (or the card scrolls out of view).
const projects = [
  {
    id: 1, category: 'Reels', title: 'Reopening Saturday — Teaser', sub: 'Direction & Edit',
    rotate: 'rotate-2',
    previewOnHover: true,
    video: '/assets/projects/reopening-teaser.mp4',
    videoPoster: '/assets/projects/reopening-teaser-poster.jpg',
    videoW: 720, videoH: 1280,
    gradient: 'linear-gradient(145deg, #14110D 0%, #1f1a20 55%, #3a2a33 100%)',
  },
  {
    id: 2, category: 'Reels', title: 'Delivery Day — Event Reel', sub: 'Shoot & Edit',
    rotate: '-rotate-1',
    previewOnHover: true,
    video: '/assets/projects/delivery-day-reel.mp4',
    videoPoster: '/assets/projects/delivery-day-reel-poster.jpg',
    videoW: 720, videoH: 1280,
    gradient: 'linear-gradient(145deg, #14110D 0%, #241200 55%, #4a2f0a 100%)',
  },
  {
    id: 3, category: 'Creative', title: 'Bun Hub — Key Art', sub: 'Poster & Art Direction',
    rotate: 'rotate-1',
    image: '/assets/projects/bun-hub-key-art.jpg', imageFit: 'contain', imageBg: '#000000',
    gradient: 'linear-gradient(160deg, #0a0a0a 0%, #241200 50%, #FF9800 100%)',
  },
];

// Chips are derived from the data: filters with no real work behind them are
// dropped rather than left as buttons that render an empty grid.
const categories = ['All', ...new Set(projects.map((p) => p.category))];

// Frame state for the reel card: the compact box keeps the card's 4/3
// proportions, the playing box uses the video's own intrinsic ratio
// (read from the <video> element — never assumed or hardcoded).
const COMPACT_RATIO = { w: 4, h: 3 };

export default function Portfolio() {
  const [active, setActive] = useState('All');
  // Reels are addressed by project id so two video cards can coexist while
  // still obeying the old rule: one open reel at a time.
  const [openId, setOpenId] = useState(null);
  const [sizes, setSizes] = useState({});
  const [preloads, setPreloads] = useState({});
  // Nothing is downloaded while a card sits idle: preload stays "none" until
  // the visitor actually asks for the reel. The poster image is all we serve.
  const pendingPlayRef = useRef(null);
  const videoRefs = useRef({});
  const openIdRef = useRef(null);
  openIdRef.current = openId;
  const ref = useScrollReveal();
  const sectionRef = useRef(null);
  useCurtain(sectionRef);

  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  const resetVideo = (v) => {
    if (!v) return;
    v.pause();
    try { v.currentTime = 0; } catch { /* metadata not ready yet */ }
  };

  const stopReel = () => {
    pendingPlayRef.current = null;
    if (openId != null) resetVideo(videoRefs.current[openId]);
    setOpenId(null);
  };

  // Never let two videos run at once: hovering one card (or opening a reel)
  // parks every other preview back on its first frame.
  const parkOthers = (keepId) => {
    Object.entries(videoRefs.current).forEach(([id, v]) => {
      const n = Number(id);
      if (n !== keepId && openIdRef.current !== n) resetVideo(v);
    });
  };

  const toggleReel = (project) => {
    const id = project.id;
    const v = videoRefs.current[id];
    if (!v) return;
    if (openId === id) {
      stopReel();
      return;
    }
    if (openId != null) resetVideo(videoRefs.current[openId]);
    const size = sizes[id];
    if (!size) {
      // First interaction — nothing has been fetched up to this point.
      pendingPlayRef.current = id;
      const w = parseInt(v.getAttribute('width'), 10);
      const h = parseInt(v.getAttribute('height'), 10);
      if (w > 0 && h > 0) {
        // Expand right away from the intrinsic size the element declares, so
        // the card doesn't stall waiting on the network. loadedmetadata will
        // confirm (or correct) it with the real videoWidth/videoHeight.
        setSizes((s) => ({ ...s, [id]: { w, h } }));
        setOpenId(id);
      }
      setPreloads((p) => ({ ...p, [id]: 'metadata' })); // effect below turns this into v.load()
      return;
    }
    setOpenId(id);
    v.play().catch(() => {});
  };

  // Flipping the preload attribute doesn't start a fetch on its own, so ask the
  // element to load — this is the single point where the network is touched.
  useEffect(() => {
    Object.entries(preloads).forEach(([id, mode]) => {
      if (mode !== 'metadata') return;
      const v = videoRefs.current[Number(id)];
      if (v && v.readyState === 0) v.load();
    });
  }, [preloads]);

  const handleLoadedMetadata = (project) => (e) => {
    const v = e.currentTarget;
    const id = project.id;
    if (v.videoWidth && v.videoHeight) {
      setSizes((s) => ({ ...s, [id]: { w: v.videoWidth, h: v.videoHeight } }));
    }
    if (pendingPlayRef.current === id) {
      pendingPlayRef.current = null;
      setOpenId(id);
      v.play().catch(() => {});
    }
  };

  const handleVideoError = (project) => () => {
    // Network/decode hiccup: forget the request so the next click starts over
    // instead of being swallowed.
    if (pendingPlayRef.current === project.id) {
      pendingPlayRef.current = null;
      setPreloads((p) => ({ ...p, [project.id]: 'none' }));
    }
  };

  // Hover preview: only the hovered card plays, one at a time, and playback
  // parks back on the first frame the moment the pointer leaves.
  const startPreview = (project) => {
    if (!project.previewOnHover || openId === project.id) return;
    const v = videoRefs.current[project.id];
    if (!v) return;
    parkOthers(project.id);
    v.play().catch(() => {});
  };
  const endPreview = (project) => {
    if (openId === project.id) return;
    resetVideo(videoRefs.current[project.id]);
  };

  // Scroll-away safety net: a pointer can stay "inside" a card that has moved
  // off screen, so park any preview that leaves the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const vids = Object.values(videoRefs.current);
    if (!vids.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return;
        const id = Number(entry.target.dataset.reelId);
        if (openIdRef.current === id) return;
        resetVideo(videoRefs.current[id]);
      });
    }, { threshold: 0.15 });
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
    // Cards remount when the category filter changes.
  }, [active]);

  // Never leave an expanded reel (or a running preview) behind when the
  // category filter changes.
  useEffect(() => {
    stopReel();
    Object.values(videoRefs.current).forEach(resetVideo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const ratioFor = (project) => (
    openId === project.id && sizes[project.id] ? sizes[project.id] : COMPACT_RATIO
  );

  return (
    <section ref={sectionRef} id="work" className="section-pad bg-cream text-ink">
      <div className="max-w-screen-xl mx-auto" ref={ref}>
        <div className="scroll-hidden mb-10 md:mb-12">
          <span className="sticker bg-flesh text-ink mb-6">Portfolio</span>
          <SplitText as="h2" className="font-display font-extrabold text-4xl md:text-6xl mb-3">Work we're proud of.</SplitText>
          <p className="text-ink/55 text-sm md:text-base max-w-sm">
            Films, event reels and key art — shot, cut and designed in-house.
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
        <div className="proj-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 items-start">
          {filtered.map((project, i) => (
            <TiltCard key={project.id} index={i} cursor={project.video ? (openId === project.id ? 'PAUSE' : 'PLAY') : 'VIEW'}>
            <div
              className={`scroll-hidden relative ${project.rotate} rounded-2xl border-[3px] border-ink shadow-pop transition-all duration-300 hover:rotate-0 hover:shadow-pop-flesh hover:-translate-y-2 overflow-hidden group cursor-default`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div
                className={`relative ${project.video ? 'reel-media' : 'aspect-[4/3]'}`}
                style={{
                  ...(project.video
                    ? {
                        aspectRatio: `${ratioFor(project).w} / ${ratioFor(project).h}`,
                        transition: 'aspect-ratio 520ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }
                    : null),
                }}
              >
                {/* Backdrop: the brand gradient stays (it is also the placeholder
                    while a still loads); contained artwork sits on a flat panel. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-2"
                  style={{ background: project.imageBg || project.gradient }}
                />
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className={
                      project.imageFit === 'contain'
                        ? 'absolute inset-0 h-full w-full object-contain p-6 sm:p-8 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105'
                        : 'absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:rotate-2'
                    }
                  />
                )}
                {project.video && (
                  <div
                    className="absolute inset-2.5 sm:inset-3 overflow-hidden rounded-lg ring-1 ring-ink/50 cursor-pointer"
                    onClick={() => toggleReel(project)}
                    onPointerEnter={() => startPreview(project)}
                    onPointerLeave={() => endPreview(project)}
                  >
                    {/* Blurred frame from the same poster: the portrait video
                        letterboxes inside a 4/3 card, so the matte reads as
                        part of the still instead of dead space. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-70 blur-[16px] scale-110 saturate-0"
                      style={{ backgroundImage: `url(${project.videoPoster})` }}
                    />
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[project.id] = el;
                        else delete videoRefs.current[project.id];
                      }}
                      data-reel-id={project.id}
                      className="absolute inset-0 h-full w-full object-contain"
                      src={project.video}
                      poster={project.videoPoster}
                      width={project.videoW}
                      height={project.videoH}
                      muted
                      loop
                      playsInline
                      preload={preloads[project.id] || 'none'}
                      onLoadedMetadata={handleLoadedMetadata(project)}
                      onError={handleVideoError(project)}
                      aria-label={`${project.title} reel`}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-flesh/10 via-transparent to-[#4a0a1a]/45" />
                    {openId !== project.id ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleReel(project); }}
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
                        onClick={(e) => { e.stopPropagation(); toggleReel(project); }}
                        aria-label={`Pause ${project.title} reel`}
                        className="absolute right-2 top-2 rounded-full border border-cream/25 bg-ink/80 px-2.5 py-1 font-tag text-[10px] uppercase tracking-wide text-cream transition-colors duration-200 hover:bg-ink"
                      >
                        <span aria-hidden="true">❚❚</span> Pause
                      </button>
                    )}
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-soft-light"
                  style={{ background: 'radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,.6), transparent 65%)' }}
                />
                {!project.video && (
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-zest font-display font-bold text-ink opacity-0 -translate-y-2 scale-75 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                  >
                    ↗
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-ink/70 backdrop-blur-0">
                  <span className="font-tag text-xs uppercase text-cream/60">{project.category}</span>
                  <h3 className="font-display font-bold text-xl text-cream leading-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">{project.title}</h3>
                  <p className="text-cream/50 text-xs mt-0.5 transition-all duration-500 group-hover:translate-x-2 group-hover:text-cream/80">{project.sub}</p>
                </div>
              </div>
            </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
