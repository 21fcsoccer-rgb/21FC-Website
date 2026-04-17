import { useState, useEffect, useRef } from 'react';
import { Gradient } from 'whatamesh';

const BASE = import.meta.env.BASE_URL;

/* magnetic-cursor effect: element subtly tracks cursor within its bounds */
const useMagnetic = (strength = 0.35) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => { el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [strength]);
  return ref;
};

/* count-up when element scrolls into view */
const useCountUp = (target, duration = 1600) => {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const end = parseFloat(target) || 0;
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setVal(eased * end);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return [ref, val];
};

/* 3D perspective tilt that follows cursor — used on membership cards */
const useTilt = (max = 8) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * max;
      const ry = (px - 0.5) * max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    };
    const onLeave = () => {
      el.style.transform = '';
      el.style.setProperty('--mx', '50%');
      el.style.setProperty('--my', '50%');
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [max]);
  return ref;
};

/* split a string into animated words, each revealing on scroll */
const SplitText = ({ children, stagger = 60, delay = 0, as: Tag = 'span' }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.classList.add('split-in');
        io.disconnect();
      }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = String(children).split(/(\s+)/);
  return (
    <Tag ref={ref} className="split" style={{'--base-delay': `${delay}ms`}}>
      {words.map((w, i) => w.match(/^\s+$/)
        ? <span key={i}>{w}</span>
        : <span key={i} className="split-word" style={{'--i': i}}><span className="split-inner" style={{'--d': `${i * stagger}ms`}}>{w}</span></span>
      )}
    </Tag>
  );
};

/* ─── palette + shared ─── */
const pk = '#ED1171';
const vt = '#D3DE25';  // volt yellow accent (from logo)
const bg = '#0A0A0F';
const card = '#0F0F18';
const wh = '#F0EFEF';
const mt = '#7A7F8A';
const ease = 'cubic-bezier(.25,.46,.45,.94)';

/* ─── CTA button (reusable) ─── */
const Btn = ({ href, big, children }) => {
  const ref = useMagnetic(0.25);
  return (
    <a ref={ref} href={href} target="_blank" rel="noopener noreferrer"
       className={big ? 'btn-cta btn-big' : 'btn-cta'}>
      <span className="btn-cta-inner">{children}</span>
    </a>
  );
};

/* ─── HEADER (CSS-only scroll transition — zero JS state) ─── */
const Header = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const fn = () => {
      if (window.scrollY > 50) el.classList.add('hdr-solid');
      else el.classList.remove('hdr-solid');
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <header ref={ref} className="hdr">
      <img src={BASE + 'images/logo-full-white.png'} alt="21FC" className="hdr-logo" />
      <nav className="navL">
        {['About', 'Schedule', 'Gallery', 'Join'].map(s => (
          <a key={s} href={`#${s.toLowerCase()}`} className="nav-link">{s}</a>
        ))}
        <a href={BASE + 'world-cup.html'} className="nav-link nav-wc">World Cup</a>
        <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer" className="nav-btn">Book Now</a>
      </nav>
    </header>
  );
};

/* ─── STATS ─── */
const StatItem = ({ num, suffix, prefix, label, i, noAnimate }) => {
  const [ref, val] = useCountUp(noAnimate ? 0 : num);
  return (
    <div ref={ref} className={`rv d${i + 1}`}>
      <div className="stat-val">
        {noAnimate ? (<>{prefix || ''}{num}{suffix || ''}</>) : (<>{prefix || ''}{Math.round(val)}{suffix || ''}</>)}
      </div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
};
const Stats = () => (
  <section className="stats-bar">
    <div className="stats-grid g4">
      <StatItem i={0} num={200} suffix="+" label="Players" />
      <StatItem i={1} num={4} suffix="×" label="Weekly" />
      <StatItem i={2} num="7 AM" noAnimate label="Kickoff" />
      <StatItem i={3} num={3} suffix="+" label="Years" />
    </div>
  </section>
);

/* ─── ABOUT ─── */
const About = () => (
  <section id="about">
    <div className="about-grid g2">
      <div className="rv about-img-wrap">
        <img src={BASE + 'images/DSC08671.jpg'} alt="" loading="lazy" className="about-img" />
      </div>
      <div className="rv d2 about-text">
        <div className="accent-line" />
        <div className="label">Our Mission</div>
        <h2 className="sec-heading">Unite skilled players<br />in real competition</h2>
        <p className="sec-sub">
          21FC brings together dedicated players in a competitive, respectful, and community-driven environment.
          Organized, high-level adult pickup soccer where you push your game and build real connections.
        </p>
        <div className="about-meta">
          <div><span className="meta-label">Location</span><span className="meta-val">Clifton, NJ</span></div>
          <div><span className="meta-label">Game Days</span><span className="meta-val">Mon · Wed · Fri · Sun</span></div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── IMAGE BAND (static 3 col) — objectPosition tuned to show faces ─── */
const ImageBand = () => (
  <section className="img-band">
    {[
      { src: BASE + 'images/DSC08584.jpg', pos: 'center 15%' },
      { src: BASE + 'images/DSC08712.jpg', pos: 'center 12%' },
      { src: BASE + 'images/DSC08730.jpg', pos: 'center 10%' },
    ].map((img, i) => (
      <div key={i} className={`rv d${i + 1} img-band-cell`}>
        <img src={img.src} alt="" loading="lazy" style={{ objectPosition: img.pos }} />
      </div>
    ))}
  </section>
);

/* ─── SCHEDULE — professional fixture roster ─── */
const Schedule = () => {
  const matches = [
    { day: 'MON', date: 'Every Week', time: '7:00 AM', type: 'Competitive', spots: '22', status: 'OPEN' },
    { day: 'WED', date: 'Every Week', time: '7:00 AM', type: 'Competitive', spots: '22', status: 'OPEN' },
    { day: 'FRI', date: 'Every Week', time: '7:00 AM', type: 'Competitive', spots: '22', status: 'OPEN' },
    { day: 'SUN', date: 'Every Week', time: '7:00 AM', type: 'Open Run', spots: '30', status: 'OPEN' },
  ];
  return (
    <section id="schedule" className="section">
      <div className="container">
        <div className="rv">
          <div className="accent-line" />
          <h2 className="sec-heading">Match Schedule</h2>
          <p className="sec-sub">Weekly fixtures · Indoor Turf · Clifton, NJ</p>
        </div>
        {/* fixture board */}
        <div className="rv d1 fixture-board">
          <div className="fixture-header">
            <div className="fixture-h-cell fx-day">Day</div>
            <div className="fixture-h-cell fx-time">Kickoff</div>
            <div className="fixture-h-cell fx-type">Format</div>
            <div className="fixture-h-cell fx-spots">Spots</div>
            <div className="fixture-h-cell fx-status">Status</div>
            <div className="fixture-h-cell fx-action"></div>
          </div>
          {matches.map((m, i) => (
            <div key={i} className={`rv d${i + 1} fixture-row`}>
              <div className="fixture-cell fx-day">
                <span className="fixture-day-badge">{m.day}</span>
                <span className="fixture-date">{m.date}</span>
              </div>
              <div className="fixture-cell fx-time">
                <span className="fixture-time">{m.time}</span>
                <span className="fixture-dur">60 min</span>
              </div>
              <div className="fixture-cell fx-type">
                <span className="fixture-type-badge" data-type={m.type}>{m.type}</span>
              </div>
              <div className="fixture-cell fx-spots">
                <span className="fixture-spots">{m.spots}</span>
                <span className="fixture-spots-label">players</span>
              </div>
              <div className="fixture-cell fx-status">
                <span className="fixture-status-dot" />
                <span className="fixture-status-text">{m.status}</span>
              </div>
              <div className="fixture-cell fx-action">
                <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer" className="fixture-book-btn">Book</a>
              </div>
            </div>
          ))}
        </div>
        {/* venue info bar */}
        <div className="rv d5 fixture-venue">
          <div className="fixture-venue-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Indoor Turf · Clifton, NJ
          </div>
          <div className="fixture-venue-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Gates open 6:45 AM
          </div>
          <Btn href="https://opensports.net/21fc">Reserve Your Spot</Btn>
        </div>
      </div>
    </section>
  );
};

/* ─── GALLERY — auto-scrolling carousel with face-framed crops ─── */
const Gallery = () => {
  const imgs = [
    { src: BASE + 'images/DSC08823.jpg', pos: 'center 10%' },
    { src: BASE + 'images/DSC08634.jpg', pos: 'center 12%' },
    { src: BASE + 'images/DSC08703.jpg', pos: 'center 10%' },
    { src: BASE + 'images/DSC08806.jpg', pos: 'center 8%' },
    { src: BASE + 'images/DSC08820.jpg', pos: 'center 10%' },
    { src: BASE + 'images/DSC08674.jpg', pos: 'center 8%' },
    { src: BASE + 'images/DSC08737.jpg', pos: 'center 12%' },
    { src: BASE + 'images/DSC08712.jpg', pos: 'center 10%' },
  ];
  /* duplicate for seamless loop */
  const doubled = [...imgs, ...imgs];
  return (
    <section id="gallery" className="carousel-section">
      <div className="container-wide rv">
        <div className="accent-line" />
        <h2 className="sec-heading">On the Pitch</h2>
        <p className="sec-sub">Matchday moments</p>
      </div>
      <div className="carousel-track-wrap">
        <div className="carousel-track">
          {doubled.map((img, i) => (
            <div key={i} className="carousel-card">
              <img src={img.src} alt="" loading="lazy" style={{ objectPosition: img.pos }} />
              <div className="carousel-card-overlay" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── MEMBERSHIP ─── */
const TiltMemCard = ({ p, i }) => {
  const ref = useTilt(6);
  return (
    <div ref={ref} className={`rv d${i + 1} mem-card tilt-card${p.pop ? ' mem-pop' : ''}`}>
      <div className="tilt-glow" />
      {p.pop && <div className="mem-badge">Popular</div>}
      <div className="mem-name">{p.name}</div>
      <div className="mem-price"><span>{p.price}</span><small>{p.per}</small></div>
      <div className="mem-feats">
        {p.feats.map((f, fi) => (
          <div key={fi} className="mem-feat"><span className="dot" />{f}</div>
        ))}
      </div>
      <button className={`mem-btn${p.pop ? ' mem-btn-pop' : ''}`}>Choose Plan</button>
    </div>
  );
};
const Membership = () => (
  <section id="membership" className="section section-alt">
    <div className="container">
      <div className="rv" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="accent-line" style={{ margin: '0 auto .8rem' }} />
        <h2 className="sec-heading">Membership</h2>
        <p className="sec-sub">Choose your commitment level</p>
      </div>
      <div className="mem-grid g3">
        {[
          { name: 'Drop-In', price: '$20', per: '/session', feats: ['Single match access', 'No commitment', 'Walk-on flexibility'], pop: false },
          { name: 'Player', price: '$120', per: '/month', feats: ['Unlimited games', 'Priority booking', 'Player community', 'Kit discounts'], pop: true },
          { name: 'Captain', price: '$200', per: '/month', feats: ['Reserved team slots', 'Coach access', 'Premium stats', 'Exclusive events'], pop: false },
        ].map((p, i) => <TiltMemCard key={i} p={p} i={i} />)}
      </div>
    </div>
  </section>
);

/* ─── BIG CTA ─── */
const CTA = () => (
  <section className="cta-section">
    <div className="cta-glow" />
    <div className="cta-glow-2" />
    <div className="rv cta-inner">
      <div className="accent-line" style={{ margin: '0 auto 1.5rem' }} />
      <h2 className="cta-heading"><SplitText stagger={80}>Ready to Play?</SplitText></h2>
      <p className="cta-sub">The most competitive pickup soccer community in New Jersey.<br />200+ players show up every week.</p>
      <Btn href="https://opensports.net/21fc" big>Join Now</Btn>
      <div className="cta-note">Via OpenSports — takes 30 seconds</div>
    </div>
  </section>
);

/* ─── CONTACT ─── */
const Contact = () => (
  <section id="join" className="section">
    <div className="container-sm">
      <div className="rv">
        <div className="accent-line" />
        <h2 className="sec-heading">Get in Touch</h2>
        <p className="sec-sub">Questions? We're here.</p>
      </div>
      <div className="contact-grid g2">
        <div>
          {[{ l: 'Instagram', v: '@21fc.soccer' }, { l: 'Location', v: 'Clifton, NJ' }, { l: 'Schedule', v: 'Mon, Wed, Fri, Sun — 7 AM' }].map((x, i) => (
            <div key={i} className={`rv d${i + 1} contact-item`}>
              <div className="label" style={{ fontSize: '9px' }}>{x.l}</div>
              <div className="meta-val">{x.v}</div>
            </div>
          ))}
        </div>
        <form className="rv d2 contact-form" onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Your name" className="input" />
          <input type="email" placeholder="your@email.com" className="input" />
          <textarea placeholder="Your message" rows="3" className="input textarea" />
          <button type="submit" className="btn-cta" style={{ alignSelf: 'flex-start' }}>Send Message</button>
        </form>
      </div>
    </div>
  </section>
);

/* ─── LOCATION ─── */
const Location = () => (
  <section id="location" className="section" style={{ background: '#07070E' }}>
    <div className="container">
      <div className="loc-grid g2">
        <div className="rv">
          <div className="accent-line" />
          <h2 className="sec-heading">Find Us</h2>
          <p className="sec-sub" style={{ marginBottom: '1.5rem' }}>Indoor turf in Clifton, NJ</p>
          {[
            { l: 'Location', v: 'Clifton, NJ — Indoor Turf' },
            { l: 'Game Days', v: 'Mon · Wed · Fri · Sun' },
            { l: 'Kickoff', v: '7:00 AM Sharp' },
          ].map((x, i) => (
            <div key={i} className="loc-item">
              <div className="label" style={{ fontSize: '9px' }}>{x.l}</div>
              <div className="meta-val">{x.v}</div>
            </div>
          ))}
          <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer" className="loc-link">Book on OpenSports</a>
          <a href="https://www.google.com/maps/search/Indoor+Turf+Soccer+Clifton+NJ" target="_blank" rel="noopener noreferrer" className="loc-link loc-maps">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            Open in Google Maps
          </a>
        </div>
        <div className="rv d2 loc-map-wrap">
          <iframe title="21FC — Clifton, NJ"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48338.1!2d-74.1637!3d40.8584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f9b4b5cc7c6b%3A0xa27b78b5b3bfc7e!2sClifton%2C%20NJ!5e0!3m2!1sen!2sus!4v1"
            width="100%" height="100%"
            style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg) saturate(.3) brightness(.65)' }}
            allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </div>
  </section>
);

/* ─── FOOTER ─── */
const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <img src={BASE + 'images/logo-full-white.png'} alt="21FC" className="footer-logo" loading="lazy" />
      <div className="footer-links">
        {[{ t: 'Instagram', h: 'https://instagram.com/21fc.soccer' }, { t: 'OpenSports', h: 'https://opensports.net/21fc' }, { t: 'Contact', h: '#join' }].map(l => (
          <a key={l.t} href={l.h} target={l.h.startsWith('#') ? '_self' : '_blank'} rel="noopener noreferrer">{l.t}</a>
        ))}
      </div>
    </div>
    <div className="container footer-copy">© 2026 21FC. All rights reserved.</div>
  </footer>
);

/* ─── SESSION MARQUEE ─── horizontal auto-scroll of upcoming dates */
const SessionMarquee = () => {
  const items = ['TUE · 04.21 · 7AM', 'THU · 04.23 · 7AM', 'SAT · 04.25 · 9AM', 'SUN · 04.26 · 10AM', 'TUE · 04.28 · 7AM', 'THU · 04.30 · 7AM'];
  const loop = [...items, ...items, ...items];
  return (
    <div className="sess-marq" aria-hidden="true">
      <div className="sess-marq-track">
        {loop.map((t, i) => (
          <span key={i} className="sess-marq-item">
            <span className="sess-marq-dot" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── MAIN APP ═══════════════════ */
const App = () => {
  const [splashDone, setSplashDone] = useState(false);
  const [splashFade, setSplashFade] = useState(false);
  const heroVideoRef = useRef(null);

  /* after splash lifts, force-play the video (iOS sometimes pauses autoplay) */
  useEffect(() => {
    if (!splashDone) return;
    const v = heroVideoRef.current;
    if (!v) return;
    const tryPlay = () => { v.play().catch(() => {}); };
    tryPlay();
    const t = setTimeout(tryPlay, 300);
    // one-shot user-interaction unlock for stricter mobile browsers
    const unlock = () => { tryPlay(); document.removeEventListener('touchstart', unlock); document.removeEventListener('click', unlock); };
    document.addEventListener('touchstart', unlock, { once: true, passive: true });
    document.addEventListener('click', unlock, { once: true });
    return () => { clearTimeout(t); document.removeEventListener('touchstart', unlock); document.removeEventListener('click', unlock); };
  }, [splashDone]);

  /* Stripe-style WebGL mesh gradient on hero */
  useEffect(() => {
    if (!splashDone) return;
    try {
      const g = new Gradient();
      g.initGradient('#gradient-canvas');
      return () => { try { g.pause?.(); } catch(_){} };
    } catch(e) { console.warn('gradient init failed', e); }
  }, [splashDone]);

  /* splash — ball rolls → logo reveals → splash lifts */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const a = setTimeout(() => setSplashFade(true), 2600); // lift
    const b = setTimeout(() => { setSplashDone(true); document.body.style.overflow = ''; }, 3400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  /* reveal observer — runs ONCE, never re-runs, never disconnects early */
  useEffect(() => {
    let obs;
    const setup = () => {
      obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.rv').forEach(el => obs.observe(el));
    };
    const timer = setTimeout(setup, 1700);
    return () => { clearTimeout(timer); if (obs) obs.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* parallax: scroll-linked transforms so sections fall into each other */
  useEffect(() => {
    let raf;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        document.querySelectorAll('.prlx').forEach(el => {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          const center = rect.top + rect.height / 2 - vh / 2;
          const n = Math.max(-1.2, Math.min(1.2, center / vh));
          const rate = parseFloat(el.dataset.rate || '0.15');
          el.style.setProperty('--prlx-y', `${(-n * rate * 100).toFixed(2)}px`);
        });
        const hero = document.querySelector('.hero-poster');
        if (hero) hero.style.transform = `scale(${1.05 + Math.min(y, 600) / 3000}) translateY(${y * 0.2}px)`;
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  /* cursor-follow spotlight — soft glow trails the mouse across the page */
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    let raf, tx = 0, ty = 0, cx = 0, cy = 0;
    const spot = document.getElementById('cursor-spot');
    if (!spot) return;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      spot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    document.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <style>{`
/* ─── RESET ─── */
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Red Hat Display',sans-serif;background:${bg};color:${wh};overflow-x:hidden;-webkit-font-smoothing:antialiased}

/* ─── AMBIENT BACKGROUND ─── */
.site-wrap{position:relative;overflow:hidden}
.site-wrap::before{content:'';position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;pointer-events:none;
  background:
    radial-gradient(ellipse 600px 600px at 10% 20%, rgba(237,17,113,.06) 0%, transparent 70%),
    radial-gradient(ellipse 500px 500px at 85% 60%, rgba(211,222,37,.05) 0%, transparent 70%),
    radial-gradient(ellipse 700px 400px at 50% 90%, rgba(237,17,113,.04) 0%, transparent 70%),
    ${bg};
  animation:ambientShift 20s ease-in-out infinite alternate}
/* pulsating volt surge — a large soft volt-yellow orb that drifts across the whole site */
.site-wrap::after{content:'';position:fixed;top:-30%;left:-20%;width:140%;height:160%;z-index:-1;pointer-events:none;
  background:
    radial-gradient(ellipse 40% 30% at 20% 30%, rgba(211,222,37,.09) 0%, rgba(211,222,37,.03) 40%, transparent 70%),
    radial-gradient(ellipse 35% 25% at 80% 70%, rgba(237,17,113,.07) 0%, rgba(237,17,113,.02) 40%, transparent 70%);
  filter:blur(40px);
  animation:voltSurge 14s ease-in-out infinite alternate;
  mix-blend-mode:screen}
@keyframes ambientShift{
  0%{background-position:0% 0%,100% 50%,50% 100%}
  50%{background-position:20% 30%,70% 40%,40% 80%}
  100%{background-position:10% 50%,90% 70%,60% 90%}
}
@keyframes voltSurge{
  0%{transform:translate(0,0) scale(1);opacity:.8}
  33%{transform:translate(6%,-4%) scale(1.1);opacity:1}
  66%{transform:translate(-4%,5%) scale(.95);opacity:.9}
  100%{transform:translate(3%,3%) scale(1.05);opacity:1}
}
/* section dividers — now pink-to-volt glow lines */
.glow-div{height:1px;background:linear-gradient(90deg,transparent 0%,rgba(237,17,113,.15) 20%,rgba(211,222,37,.3) 50%,rgba(237,17,113,.15) 80%,transparent 100%);margin:0;animation:divPulse 5s ease-in-out infinite}
@keyframes divPulse{0%,100%{opacity:.6}50%{opacity:1}}

/* ─── REVEAL (CSS only, no JS state) ─── */
.rv{opacity:0;transform:translateY(22px);transition:opacity .6s ${ease},transform .6s ${ease}}
.rv.vis{opacity:1;transform:translateY(0)}
.rv.d1{transition-delay:.06s}.rv.d2{transition-delay:.12s}.rv.d3{transition-delay:.18s}
.rv.d4{transition-delay:.24s}.rv.d5{transition-delay:.3s}.rv.d6{transition-delay:.36s}

/* ─── PARALLAX ─── sections translate at different rates so they fall into each other */
.prlx{--prlx-y:0px;transform:translate3d(0,var(--prlx-y),0);will-change:transform;transition:transform .1s linear}
@media(prefers-reduced-motion:reduce){.prlx{transform:none!important}}

/* ─── CURSOR SPOTLIGHT ─── soft glow follows mouse */

/* ═══ WORLD CUP EVENT BANNER ═══ */
.wc-banner{display:block;position:relative;overflow:hidden;padding:clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,3rem);margin:0;background:linear-gradient(135deg,#0B3D2E 0%,${bg} 40%,${bg} 60%,rgba(212,175,55,.08) 100%);border-bottom:1px solid rgba(212,175,55,.12);border-top:1px solid rgba(212,175,55,.12);text-decoration:none;color:${wh};cursor:pointer;transition:background .4s ease}
.wc-banner:hover{background:linear-gradient(135deg,rgba(11,61,46,.25) 0%,rgba(212,175,55,.06) 50%,${bg} 100%)}
.wc-banner-glow{position:absolute;top:-40%;right:-10%;width:500px;height:500px;background:radial-gradient(circle,rgba(212,175,55,.1) 0%,transparent 65%);border-radius:50%;pointer-events:none;animation:wcGlow 6s ease-in-out infinite alternate}
@keyframes wcGlow{0%{transform:translate(0,0) scale(1);opacity:.6}100%{transform:translate(-3%,5%) scale(1.15);opacity:1}}
.wc-banner-inner{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;max-width:1000px;margin:0 auto}
.wc-banner-flags{font-size:clamp(1.1rem,2.5vw,1.8rem);flex-shrink:0;letter-spacing:.15em;filter:drop-shadow(0 2px 6px rgba(0,0,0,.4));display:inline-flex;gap:.35em}
.wc-banner-flags span{display:inline-block;animation:wcFlagWave 3.2s ease-in-out infinite;transform-origin:left center;will-change:transform}
.wc-banner-flags span:nth-child(2){animation-delay:-.4s;animation-duration:3s}
.wc-banner-flags span:nth-child(3){animation-delay:-.8s;animation-duration:3.4s}
.wc-banner-flags span:nth-child(4){animation-delay:-1.2s;animation-duration:2.8s}
.wc-banner-flags span:nth-child(5){animation-delay:-1.6s;animation-duration:3.6s}
.wc-banner-flags span:nth-child(6){animation-delay:-2s;animation-duration:3.1s}
.wc-banner-flags span:nth-child(7){animation-delay:-2.4s;animation-duration:3.3s}
.wc-banner-flags span:nth-child(8){animation-delay:-2.8s;animation-duration:2.9s}
@keyframes wcFlagWave{
  0%,100%{transform:perspective(300px) rotateY(0deg) rotateZ(0deg) scaleX(1)}
  20%{transform:perspective(300px) rotateY(-15deg) rotateZ(-2deg) scaleX(.96)}
  40%{transform:perspective(300px) rotateY(8deg) rotateZ(1deg) scaleX(1.02)}
  60%{transform:perspective(300px) rotateY(-6deg) rotateZ(-1deg) scaleX(.98)}
  80%{transform:perspective(300px) rotateY(12deg) rotateZ(2deg) scaleX(1.01)}
}
.wc-banner-text{flex:1;min-width:200px}
.wc-banner-eyebrow{font-family:'Red Hat Display',sans-serif;font-size:clamp(.5rem,1.2vw,.7rem);font-weight:800;letter-spacing:.3em;text-transform:uppercase;color:#FF3386;margin-bottom:.2rem}
.wc-banner-title{font-family:'Red Hat Display',sans-serif;font-size:clamp(1.4rem,4vw,2.4rem);font-weight:900;line-height:1;letter-spacing:-.02em}
.wc-banner-title span{color:#D4AF37;text-shadow:0 0 30px rgba(212,175,55,.2)}
.wc-banner-sub{font-size:clamp(.6rem,1.3vw,.82rem);color:${mt};margin-top:.2rem;font-weight:600;letter-spacing:.08em}
.wc-banner-cta{flex-shrink:0;font-family:'Red Hat Display',sans-serif;font-size:clamp(.65rem,1.2vw,.82rem);font-weight:800;letter-spacing:.25em;text-transform:uppercase;padding:clamp(.55rem,1vw,.8rem) clamp(1rem,2vw,2rem);background:#D4AF37;color:${bg};transition:all .3s ${ease};position:relative;overflow:hidden;animation:wcBtnPulse 2.5s ease-in-out infinite}
.wc-banner-cta::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transition:left .6s ease}
.wc-banner:hover .wc-banner-cta{background:#e8c84a;transform:translateY(-2px);box-shadow:0 0 24px rgba(212,175,55,.5);animation:none}
.wc-banner:hover .wc-banner-cta::after{left:100%}
@keyframes wcBtnPulse{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.4)}50%{box-shadow:0 0 0 10px rgba(212,175,55,0)}}
.wc-banner-stripe{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#009c3b,#D4AF37,#FF3386,#74acdf,#D4AF37,#009c3b);background-size:300% 100%;animation:stripeShift 8s linear infinite}
@keyframes stripeShift{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@media(max-width:700px){.wc-banner-inner{flex-direction:column;text-align:center;align-items:center}.wc-banner-flags{order:-1}}

.cursor-spot{position:fixed;top:0;left:0;width:600px;height:600px;border-radius:50%;pointer-events:none;z-index:1;
  background:radial-gradient(circle,rgba(211,222,37,.08) 0%,rgba(237,17,113,.04) 30%,transparent 60%);
  mix-blend-mode:screen;transform:translate(-50%,-50%);will-change:transform;transition:opacity .3s ease}
@media(hover:none){.cursor-spot{display:none}}
@media(prefers-reduced-motion:reduce){.cursor-spot{display:none}}

/* ─── TILT CARDS ─── */
.tilt-card{transform-style:preserve-3d;transition:transform .35s ${ease},box-shadow .35s ease,border-color .35s ease}
.tilt-card .tilt-glow{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .4s ease;
  background:radial-gradient(ellipse 60% 60% at var(--mx,50%) var(--my,50%),rgba(211,222,37,.15),transparent 60%)}
.tilt-card:hover .tilt-glow{opacity:1}
.tilt-card > *{transform:translateZ(30px)}
.tilt-card .tilt-glow{transform:none}

/* ─── SESSION MARQUEE ─── */
.sess-marq{overflow:hidden;background:linear-gradient(90deg,transparent,rgba(237,17,113,.03) 20%,rgba(211,222,37,.03) 50%,rgba(237,17,113,.03) 80%,transparent);border-top:1px solid rgba(237,17,113,.08);border-bottom:1px solid rgba(211,222,37,.08);padding:1.2rem 0;position:relative;mask-image:linear-gradient(90deg,transparent,black 10%,black 90%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,black 10%,black 90%,transparent)}
.sess-marq-track{display:flex;gap:0;white-space:nowrap;animation:sessScroll 35s linear infinite;width:fit-content}
.sess-marq-item{display:inline-flex;align-items:center;gap:.8rem;padding:0 2.5rem;font-family:'Red Hat Display',sans-serif;font-size:clamp(16px,2.2vw,24px);font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${wh};opacity:.85;border-right:1px solid rgba(255,255,255,.06)}
.sess-marq-item:nth-child(3n){color:${vt}}
.sess-marq-item:nth-child(3n+2){color:${pk}}
.sess-marq-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 10px currentColor;flex-shrink:0}
@keyframes sessScroll{0%{transform:translateX(0)}100%{transform:translateX(-33.333%)}}
.sess-marq:hover .sess-marq-track{animation-play-state:paused}

/* ─── SPLIT TEXT ─── */
.split{display:inline-block}
.split-word{display:inline-block;overflow:hidden;vertical-align:top}
.split-inner{display:inline-block;transform:translateY(110%);transition:transform .7s cubic-bezier(.22,1,.36,1);transition-delay:var(--d,0ms)}
.split.split-in .split-inner{transform:translateY(0)}

/* ─── HEADER (CSS transition, no JS rerender) ─── */
.hdr{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;justify-content:space-between;align-items:center;
  padding:.9rem 2rem;background:transparent;transition:all .4s ${ease}}
.hdr-solid{background:rgba(10,10,15,.96);backdrop-filter:blur(10px);padding:.5rem 2rem;border-bottom:1px solid rgba(255,255,255,.04)}
.hdr-logo{height:46px;width:auto;transition:height .4s ${ease}}
.hdr-solid .hdr-logo{height:34px}
.navL{display:flex;gap:1.5rem;align-items:center}
.nav-link{color:rgba(240,239,239,.55);text-decoration:none;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;transition:color .3s ease}
.nav-link:hover{color:${pk}}
.nav-wc{color:#D4AF37!important;font-weight:700;letter-spacing:1.5px}
.nav-wc:hover{color:#fff!important;text-shadow:0 0 12px rgba(212,175,55,.4)}
.nav-btn{position:relative;padding:8px 18px;background:${pk};color:#fff;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;text-decoration:none;overflow:hidden;box-shadow:0 0 14px rgba(237,17,113,.35);transition:all .3s ${ease}}
.nav-btn:hover{background:${vt};color:${bg};box-shadow:0 0 22px rgba(211,222,37,.55);transform:translateY(-1px)}

/* ─── HERO ─── */
.hero{position:relative;height:100vh;max-height:1000px;overflow:hidden;background:${bg}}
.hero-gradient{position:absolute;inset:0;width:100%;height:100%;z-index:1;opacity:0;transition:opacity 1.4s ease;mix-blend-mode:screen;
  --gradient-color-1:#ED1171;
  --gradient-color-2:#D3DE25;
  --gradient-color-3:#7038ff;
  --gradient-color-4:#0A0A0F}
.hero-gradient.isLoaded{opacity:.55}
.hero-poster{position:absolute;inset:0;z-index:0;background-image:url('${BASE}images/21fc-hero-blue.jpg');background-size:cover;background-position:center;animation:kenBurns 18s ease-in-out infinite alternate;filter:saturate(.85) contrast(1.05)}
.hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;opacity:0;animation:videoFade 1s ease 1.6s forwards;pointer-events:none;mix-blend-mode:luminosity}
.hero-grad{position:absolute;inset:0;z-index:3;background:linear-gradient(180deg,rgba(10,10,15,.6) 0%,rgba(10,10,15,.3) 30%,rgba(10,10,15,.3) 45%,rgba(10,10,15,.75) 75%,rgba(10,10,15,1) 100%)}
@keyframes videoFade{to{opacity:1}}
@keyframes kenBurns{0%{transform:scale(1.05) translate(0,0)}100%{transform:scale(1.18) translate(-2%,-1%)}}
.hero-content{position:absolute;bottom:0;left:0;right:0;z-index:3;padding:0 clamp(2rem,6vw,5rem) clamp(3rem,7vh,5.5rem)}
.hero-label{font-size:10px;font-weight:700;color:${pk};text-transform:uppercase;letter-spacing:3.5px;margin-bottom:10px;animation:fadeUp .5s ${ease} .1s both}
.hero-h1{font-weight:900;line-height:.88;letter-spacing:-.05em;margin-bottom:.2em;animation:fadeUp .5s ${ease} .2s both}
.hero-h1 .big{display:block;font-size:clamp(56px,11vw,140px)}
.hero-h1 .sub{display:block;font-size:clamp(36px,7vw,92px);font-weight:200;letter-spacing:-.02em;color:rgba(240,239,239,.7)}
.hero-p{font-size:clamp(14px,1.4vw,17px);font-weight:300;line-height:1.7;color:rgba(240,239,239,.5);max-width:420px;margin-bottom:1.8rem;animation:fadeUp .5s ${ease} .35s both}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap;animation:fadeUp .5s ${ease} .45s both}
.ghost-btn{padding:17px 28px;border:1px solid rgba(255,255,255,.2);color:rgba(240,239,239,.75);font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;text-decoration:none;transition:all .3s ${ease};backdrop-filter:blur(6px)}
.ghost-btn:hover{border-color:${vt};color:${vt};transform:translateY(-2px);box-shadow:0 0 20px rgba(211,222,37,.25)}
.scroll-ind{position:absolute;bottom:1.2rem;left:50%;transform:translateX(-50%);z-index:3;opacity:.3}
.scroll-pill{width:18px;height:28px;border:1px solid rgba(255,255,255,.18);border-radius:9px;display:flex;justify-content:center;padding-top:5px}
.scroll-dot{width:2px;height:5px;background:${pk};border-radius:1px;animation:bounce 1.4s ease-in-out infinite}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
@keyframes glow{0%,100%{box-shadow:0 0 16px rgba(237,17,113,.22)}50%{box-shadow:0 0 40px rgba(237,17,113,.42)}}

/* ─── BUTTONS ─── */
.btn-cta{position:relative;display:inline-block;padding:14px 36px;background:${pk};color:#fff;text-decoration:none;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border:none;cursor:pointer;font-family:inherit;overflow:hidden;box-shadow:0 0 0 rgba(237,17,113,0),0 4px 18px rgba(0,0,0,.3);animation:btnPulse 2.4s ease-in-out infinite;transition:transform .3s ${ease}, box-shadow .3s ${ease}, background .3s ${ease}, color .3s ${ease}}
.btn-cta::before{content:'';position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);transform:translateX(-100%);transition:transform .7s ease}
.btn-cta::after{content:'';position:absolute;inset:-2px;border:1px solid ${vt};opacity:0;transition:opacity .3s ease;pointer-events:none}
.btn-cta:hover{background:${vt};color:${bg};transform:translateY(-3px) scale(1.02);box-shadow:0 0 30px rgba(211,222,37,.6),0 10px 30px rgba(0,0,0,.4);animation-play-state:paused}
.btn-cta:hover::before{transform:translateX(100%)}
.btn-cta:hover::after{opacity:1}
.btn-cta:active{transform:translateY(-1px) scale(1)}
.btn-big{padding:18px 52px;font-size:14px;letter-spacing:3px}
@keyframes btnPulse{0%,100%{box-shadow:0 0 0 0 rgba(237,17,113,.5),0 4px 18px rgba(0,0,0,.3)}50%{box-shadow:0 0 0 14px rgba(237,17,113,0),0 4px 22px rgba(237,17,113,.35)}}

/* ─── STATS ─── */
.stats-bar{background:linear-gradient(180deg,${card} 0%,rgba(237,17,113,.04) 100%);border-top:1px solid rgba(237,17,113,.12);border-bottom:1px solid rgba(237,17,113,.12);padding:2rem 1.5rem;position:relative}
.stats-bar::after{content:'';position:absolute;bottom:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(211,222,37,.35),transparent)}
.stats-grid{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;text-align:center}
.stats-grid > div{padding:.5rem;position:relative;transition:transform .3s ${ease}}
.stats-grid > div:not(:last-child)::after{content:'';position:absolute;right:0;top:20%;bottom:20%;width:1px;background:linear-gradient(180deg,transparent,rgba(237,17,113,.2),transparent)}
.stats-grid > div:hover{transform:translateY(-3px)}
.stat-val{font-size:clamp(28px,5vw,44px);font-weight:800;line-height:1;background:linear-gradient(180deg,${wh} 0%,${pk} 140%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:${wh}}
.stat-lbl{font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:${mt};margin-top:.2rem}

/* ─── SECTIONS ─── */
.section{padding:clamp(3.5rem,7vh,6rem) clamp(1.5rem,5vw,4rem);position:relative}
.section-alt{background:linear-gradient(180deg,${card} 0%,rgba(15,15,24,.95) 50%,${card} 100%);border-top:1px solid rgba(255,255,255,.03)}
.container{max-width:1100px;margin:0 auto}
.container-wide{max-width:1200px;margin:0 auto}
.container-sm{max-width:900px;margin:0 auto}
.accent-line{width:28px;height:2px;background:${pk};margin-bottom:.8rem}
.label{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${pk};margin-bottom:.4rem}
.sec-heading{font-size:clamp(28px,5vw,48px);font-weight:700;line-height:1.1;letter-spacing:-.02em;margin-bottom:.2rem}
.sec-sub{font-size:clamp(14px,1.4vw,16px);font-weight:300;line-height:1.7;color:rgba(240,239,239,.55);margin-top:.25rem;margin-bottom:1.8rem}

/* ─── ABOUT ─── */
.about-grid{display:grid;grid-template-columns:1fr 1fr;min-height:400px}
.about-img-wrap{overflow:hidden;position:relative}
.about-img{width:100%;height:100%;min-height:280px;object-fit:cover;object-position:center 10%;transition:transform 5s ease}
.about-img-wrap:hover .about-img{transform:scale(1.03)}
.about-text{background:${card};padding:clamp(2.5rem,4vw,4rem);display:flex;flex-direction:column;justify-content:center;border-left:1px solid rgba(255,255,255,.04)}
.about-meta{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.meta-label{display:block;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${pk};margin-bottom:.15rem}
.meta-val{font-size:15px;font-weight:600}

/* ─── IMAGE BAND ─── */
.img-band{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;padding:3px;background:${bg}}
.img-band-cell{overflow:hidden;height:clamp(150px,20vw,260px)}
.img-band-cell img{width:100%;height:100%;object-fit:cover;filter:brightness(.8);transition:all .5s ease}
.img-band-cell:hover img{filter:brightness(1);transform:scale(1.03)}

/* ─── SCHEDULE — fixture roster ─── */
.fixture-board{background:linear-gradient(180deg,${card} 0%,rgba(15,15,24,.6) 100%);border:1px solid rgba(237,17,113,.12);overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.3)}
.fixture-header{display:grid;grid-template-columns:1.3fr 1fr .8fr .7fr .7fr .6fr;padding:.9rem 1.2rem;background:rgba(237,17,113,.06);border-bottom:1px solid rgba(237,17,113,.2)}
.fixture-h-cell{font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${mt}}
.fixture-row{display:grid;grid-template-columns:1.3fr 1fr .8fr .7fr .7fr .6fr;padding:1rem 1.2rem;align-items:center;border-bottom:1px solid rgba(255,255,255,.05);transition:background .3s ease,border-left-color .3s ease;border-left:3px solid transparent}
.fixture-row:last-child{border-bottom:none}
.fixture-row:hover{background:rgba(237,17,113,.05);border-left-color:${vt}}
.fixture-cell{display:flex;flex-direction:column;gap:2px}
.fixture-day-badge{font-size:16px;font-weight:800;letter-spacing:1px}
.fixture-date{font-size:10px;color:${mt};font-weight:500}
.fixture-time{font-size:16px;font-weight:700}
.fixture-dur{font-size:10px;color:${mt};font-weight:500}
.fixture-type-badge{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:4px 10px;
  background:rgba(237,17,113,.06);color:${pk};border:1px solid rgba(237,17,113,.12);display:inline-block;width:fit-content}
.fixture-type-badge[data-type="Open Run"]{background:rgba(211,222,37,.06);color:#D3DE25;border-color:rgba(211,222,37,.15)}
.fixture-spots{font-size:16px;font-weight:700}
.fixture-spots-label{font-size:10px;color:${mt}}
.fixture-status-dot{width:6px;height:6px;border-radius:50%;background:#2ECC71;display:inline-block;box-shadow:0 0 8px rgba(46,204,113,.4);flex-shrink:0}
.fixture-status-text{font-size:11px;font-weight:700;color:#2ECC71;letter-spacing:1.5px}
.fx-status{flex-direction:row;gap:6px;align-items:center}
.fixture-book-btn{padding:7px 16px;background:${pk};color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;text-decoration:none;transition:all .3s ease;text-align:center;display:block}
.fixture-book-btn:hover{background:#fff;color:${bg};transform:translateY(-1px)}
.fixture-venue{display:flex;align-items:center;gap:2rem;flex-wrap:wrap;margin-top:1.5rem;padding-top:1.2rem;border-top:1px solid rgba(255,255,255,.04)}
.fixture-venue-item{display:flex;align-items:center;gap:.4rem;font-size:12px;color:${mt};font-weight:500}
.fixture-venue-item svg{color:${pk}}

/* ─── GALLERY — auto-scrolling carousel ─── */
.carousel-section{padding:clamp(3rem,6vh,5rem) 0;overflow:hidden}
.carousel-section .container-wide{padding:0 clamp(1.5rem,5vw,4rem);margin-bottom:1.5rem}
.carousel-track-wrap{overflow:hidden;width:100%;mask-image:linear-gradient(90deg,transparent 0%,black 5%,black 95%,transparent 100%);-webkit-mask-image:linear-gradient(90deg,transparent 0%,black 5%,black 95%,transparent 100%)}
.carousel-track{display:flex;gap:14px;width:fit-content;animation:carouselScroll 40s linear infinite}
.carousel-track:hover{animation-play-state:paused}
.carousel-card{width:clamp(260px,30vw,380px);height:clamp(180px,22vw,260px);flex-shrink:0;overflow:hidden;position:relative;cursor:pointer;border:1px solid rgba(255,255,255,.05);transition:border-color .4s ease,box-shadow .4s ease}
.carousel-card img{width:100%;height:100%;object-fit:cover;filter:brightness(.72) saturate(.9);transition:all .6s ${ease}}
.carousel-card:hover{border-color:${vt};box-shadow:0 0 30px rgba(211,222,37,.25)}
.carousel-card:hover img{filter:brightness(1.08) saturate(1.15);transform:scale(1.06)}
.carousel-card-overlay{position:absolute;inset:0;border:2px solid transparent;transition:all .4s ease;pointer-events:none;
  background:linear-gradient(transparent 60%,rgba(10,10,15,.4) 100%)}
.carousel-card:hover .carousel-card-overlay{border-color:rgba(237,17,113,.4);box-shadow:inset 0 0 20px rgba(237,17,113,.08)}
@keyframes carouselScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ─── MEMBERSHIP ─── */
.mem-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.mem-card{padding:clamp(1.8rem,2.5vw,2.2rem);background:linear-gradient(180deg,${card} 0%,rgba(10,10,15,.9) 100%);border:1px solid rgba(255,255,255,.08);position:relative;transition:all .4s ${ease};overflow:hidden}
.mem-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at top,rgba(211,222,37,.06),transparent 60%);opacity:0;transition:opacity .4s ease;pointer-events:none}
.mem-card:hover{border-color:${vt};transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,.5),0 0 24px rgba(211,222,37,.2)}
.mem-card:hover::before{opacity:1}
.mem-pop{background:linear-gradient(180deg,rgba(237,17,113,.08) 0%,${card} 100%);border-color:rgba(237,17,113,.35);box-shadow:0 12px 36px rgba(237,17,113,.15)}
.mem-badge{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:${pk};color:#fff;padding:4px 16px;font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;box-shadow:0 4px 14px rgba(237,17,113,.4)}
.mem-name{font-size:14px;font-weight:700;margin-bottom:.3rem}
.mem-price{margin-bottom:1rem;display:flex;align-items:baseline;gap:.3rem}
.mem-price span{font-size:clamp(26px,4vw,32px);font-weight:800}
.mem-price small{font-size:12px;color:${mt}}
.mem-feats{border-top:1px solid rgba(255,255,255,.08);padding-top:.9rem;margin-bottom:1.2rem}
.mem-feat{display:flex;align-items:center;gap:.4rem;margin-bottom:.35rem;font-size:13px;color:rgba(240,239,239,.75)}
.dot{width:5px;height:5px;background:${vt};border-radius:50%;flex-shrink:0;box-shadow:0 0 8px rgba(211,222,37,.5)}
.mem-btn{width:100%;padding:11px;background:transparent;color:${wh};border:1px solid rgba(255,255,255,.15);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;font-family:inherit;transition:all .3s ${ease}}
.mem-btn:hover{background:${vt};color:${bg};border-color:${vt}}
.mem-btn-pop{background:${pk};color:#fff;border:none;box-shadow:0 0 18px rgba(237,17,113,.3)}
.mem-btn-pop:hover{background:${vt};color:${bg};box-shadow:0 0 22px rgba(211,222,37,.5)}

/* ─── CTA ─── */
.cta-section{position:relative;padding:clamp(5rem,12vh,9rem) 2rem;overflow:hidden;text-align:center;
  background:linear-gradient(135deg,rgba(237,17,113,.1) 0%,${bg} 35%,${bg} 55%,rgba(211,222,37,.06) 100%);
  border-top:1px solid rgba(237,17,113,.15);border-bottom:1px solid rgba(211,222,37,.15)}
.cta-glow{position:absolute;top:-40%;left:-15%;width:500px;height:500px;background:radial-gradient(circle,rgba(237,17,113,.12) 0%,transparent 70%);border-radius:50%;pointer-events:none;animation:ctaPulse 8s ease-in-out infinite alternate;filter:blur(20px)}
.cta-glow-2{position:absolute;bottom:-30%;right:-15%;width:480px;height:480px;background:radial-gradient(circle,rgba(211,222,37,.1) 0%,transparent 70%);border-radius:50%;pointer-events:none;animation:ctaPulse2 11s ease-in-out infinite alternate;filter:blur(20px)}
@keyframes ctaPulse{0%{transform:translate(0,0) scale(1);opacity:.7}50%{transform:translate(5%,5%) scale(1.15);opacity:1}100%{transform:translate(-3%,3%) scale(.95);opacity:.8}}
@keyframes ctaPulse2{0%{transform:translate(0,0) scale(1);opacity:.6}50%{transform:translate(-6%,-4%) scale(1.1);opacity:.9}100%{transform:translate(3%,-3%) scale(1.05);opacity:.7}}
.cta-inner{position:relative;z-index:1;max-width:620px;margin:0 auto}
.cta-heading{font-size:clamp(36px,8vw,76px);font-weight:900;line-height:.95;letter-spacing:-.04em;margin-bottom:.8rem;text-shadow:0 0 40px rgba(237,17,113,.15)}
.cta-sub{font-size:clamp(15px,1.6vw,19px);color:rgba(240,239,239,.55);font-weight:300;line-height:1.7;max-width:460px;margin:0 auto 2.2rem}
.cta-note{margin-top:1rem;font-size:11px;color:${mt};letter-spacing:1px}

/* ─── CONTACT ─── */
.contact-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:2.5rem}
.contact-item{margin-bottom:.8rem;padding-bottom:.8rem;border-bottom:1px solid rgba(255,255,255,.04)}
.contact-form{display:flex;flex-direction:column;gap:.7rem}
.input{background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.07);color:${wh};padding:.5rem 0;font-size:14px;font-family:inherit;outline:none;transition:border-color .3s ease}
.input:focus{border-bottom-color:${pk}}
.textarea{border:1px solid rgba(255,255,255,.07);padding:.5rem;resize:none}
.textarea:focus{border-color:${pk}}

/* ─── LOCATION ─── */
.loc-grid{display:grid;grid-template-columns:1fr 1.6fr;gap:clamp(1.5rem,3vw,3rem);align-items:start}
.loc-item{padding-bottom:.7rem;margin-bottom:.7rem;border-bottom:1px solid rgba(255,255,255,.04)}
.loc-link{display:inline-flex;align-items:center;gap:.4rem;margin-top:.6rem;margin-right:.8rem;padding:8px 16px;border:1px solid rgba(237,17,113,.18);color:${wh};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;text-decoration:none;transition:all .3s ease}
.loc-link:hover{border-color:${pk};background:rgba(237,17,113,.04)}
.loc-map-wrap{overflow:hidden;border:1px solid rgba(255,255,255,.04);height:320px}

/* ─── FOOTER ─── */
.footer{background:${bg};border-top:1px solid rgba(255,255,255,.04);padding:1.5rem 2rem .8rem}
.footer-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1rem}
.footer-logo{height:24px;width:auto}
.footer-links{display:flex;gap:1.5rem}
.footer-links a{color:${mt};text-decoration:none;font-size:12px;font-weight:500;transition:color .3s ease}
.footer-links a:hover{color:${wh}}
.footer-copy{border-top:1px solid rgba(255,255,255,.04);padding-top:.7rem;text-align:center;font-size:11px;color:${mt}}

/* ─── SPLASH ─── */
.splash{position:fixed;inset:0;z-index:9999;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform .8s cubic-bezier(.83,0,.17,1), opacity .8s ease;will-change:transform,opacity}
.splash-lift{transform:translateY(-100%);opacity:0;pointer-events:none}
.splash-stage{position:relative;width:min(520px,78vw);height:clamp(120px,22vw,180px);display:flex;align-items:center;justify-content:center}
.splash-ball{position:absolute;top:50%;left:50%;width:clamp(48px,9vw,72px);height:clamp(48px,9vw,72px);transform:translate(-50%,-50%);animation:ballRoll 1.8s cubic-bezier(.4,0,.2,1) forwards;filter:drop-shadow(0 8px 24px rgba(237,17,113,.35))}
.splash-logo{position:absolute;top:50%;left:50%;height:clamp(70px,16vw,130px);width:auto;transform:translate(-50%,-50%) scale(.55);opacity:0;filter:drop-shadow(0 0 40px rgba(237,17,113,.25));animation:logoReveal 1.1s cubic-bezier(.16,1,.3,1) 1.2s forwards}
.splash-tag{margin-top:1.5rem;font-size:11px;font-weight:700;color:${mt};text-transform:uppercase;letter-spacing:4px;opacity:0;animation:tagIn .7s ease 2s forwards}
.splash-ring{position:absolute;top:50%;left:50%;width:6px;height:6px;border-radius:50%;border:1px solid ${pk};transform:translate(-50%,-50%);opacity:0;animation:ringPulse 1.4s cubic-bezier(.16,1,.3,1) 1.2s forwards}
@keyframes ballRoll{
  0%{transform:translate(calc(-50% - 60vw),-50%) rotate(0deg);opacity:0}
  8%{opacity:1}
  48%{transform:translate(calc(-50% + 0vw),-50%) rotate(720deg);opacity:1}
  92%{transform:translate(calc(-50% + 60vw),-50%) rotate(1440deg);opacity:1}
  100%{transform:translate(calc(-50% + 60vw),-50%) rotate(1440deg);opacity:0}
}
@keyframes logoReveal{
  0%{opacity:0;transform:translate(-50%,-50%) scale(.55);filter:drop-shadow(0 0 0 rgba(237,17,113,0)) blur(8px)}
  60%{opacity:1;transform:translate(-50%,-50%) scale(1.03);filter:drop-shadow(0 0 48px rgba(237,17,113,.4)) blur(0)}
  100%{opacity:1;transform:translate(-50%,-50%) scale(1);filter:drop-shadow(0 0 24px rgba(237,17,113,.18)) blur(0)}
}
@keyframes tagIn{0%{opacity:0;letter-spacing:10px}100%{opacity:.8;letter-spacing:4px}}
@keyframes ringPulse{0%{width:6px;height:6px;opacity:.8;border-width:1px}100%{width:clamp(240px,45vw,420px);height:clamp(240px,45vw,420px);opacity:0;border-width:1px}}

/* ─── RESPONSIVE ─── */
@media(max-width:960px){
  .g2{grid-template-columns:1fr!important}
  .g4{grid-template-columns:repeat(2,1fr)!important}
  .g3{grid-template-columns:1fr!important}
  .navL{display:none!important}
  .hero-h1 .big{font-size:clamp(44px,13vw,90px)}
  .hero-h1 .sub{font-size:clamp(26px,8vw,56px)}
  .cta-heading{font-size:clamp(30px,9vw,60px)}
  .about-text{border-left:none;border-top:1px solid rgba(255,255,255,.04)}
  .img-band{grid-template-columns:1fr 1fr}
  .img-band-cell:last-child{display:none}
  .fixture-header{display:none}
  .fixture-row{grid-template-columns:1fr 1fr 1fr;gap:.6rem;padding:.8rem 1rem}
  .fx-type,.fx-spots{display:none}
  .fixture-venue{flex-direction:column;align-items:flex-start;gap:1rem}
}
@media(max-width:600px){
  .g4{grid-template-columns:1fr!important}
  .img-band{grid-template-columns:1fr}
  .img-band-cell:last-child{display:block}
  .fixture-row{grid-template-columns:1fr 1fr auto}
}
      `}</style>

      {/* CURSOR SPOTLIGHT — soft glow follows mouse */}
      <div id="cursor-spot" className="cursor-spot" aria-hidden="true" />

      {/* SPLASH — ball rolls in, logo reveals in its wake, splash lifts */}
      {!splashDone && (
        <div className={`splash ${splashFade ? 'splash-lift' : ''}`}>
          <div className="splash-stage">
            {/* the rolling ball — Telstar truncated icosahedron pattern */}
            <svg className="splash-ball" viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              {/* white sphere with subtle gradient for depth */}
              <defs>
                <radialGradient id="ballSphere" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#f0efef" />
                  <stop offset="100%" stopColor="#c8c8c8" />
                </radialGradient>
              </defs>
              <circle cx="0" cy="0" r="48" fill="url(#ballSphere)" stroke="#0A0A0F" strokeWidth="0.8"/>
              {/* center black pentagon (points up) */}
              <polygon fill="#0A0A0F" points="0,-18 17.12,-5.56 10.58,14.56 -10.58,14.56 -17.12,-5.56"/>
              {/* 5 hexagon outlines surrounding the central pentagon */}
              <g fill="none" stroke="#0A0A0F" strokeWidth="1.6" strokeLinejoin="round">
                {/* top hexagon (shares top edge w/ pentagon) */}
                <polygon points="0,-18 17.12,-5.56 18,-22 8,-36 -8,-36 -18,-22"/>
                {/* upper right hex (shares top-right edge) */}
                <polygon points="17.12,-5.56 10.58,14.56 26,20 38,8 40,-12 18,-22"/>
                {/* lower right hex (shares bottom-right edge) */}
                <polygon points="10.58,14.56 -10.58,14.56 -4,32 14,38 28,28 26,20"/>
                {/* lower left hex (shares bottom-left edge) */}
                <polygon points="-10.58,14.56 -17.12,-5.56 -26,20 -28,28 -14,38 -4,32"/>
                {/* upper left hex (shares top-left edge) */}
                <polygon points="-17.12,-5.56 0,-18 -18,-22 -40,-12 -38,8 -26,20"/>
              </g>
              {/* 5 partial outer pentagons at ball's rim (slightly visible due to sphere curvature) */}
              <g fill="#0A0A0F" opacity="0.92">
                {/* upper partial pentagon (top) */}
                <polygon points="-8,-36 8,-36 4,-46 -4,-46"/>
                {/* upper-right partial */}
                <polygon points="38,8 40,-12 47,-4 44,10"/>
                {/* lower-right partial */}
                <polygon points="28,28 14,38 22,44 34,36"/>
                {/* lower-left partial */}
                <polygon points="-14,38 -28,28 -34,36 -22,44"/>
                {/* upper-left partial */}
                <polygon points="-40,-12 -38,8 -44,10 -47,-4"/>
              </g>
              {/* highlight reflection on upper-left */}
              <ellipse cx="-16" cy="-22" rx="14" ry="6" fill="#ffffff" opacity="0.35" transform="rotate(-35 -16 -22)"/>
            </svg>
            {/* the logo */}
            <img
              src={BASE + 'images/logo-full-white.png'}
              alt="21FC"
              className="splash-logo"
            />
          </div>
          <div className="splash-tag">Twenty One FC · EST 2022</div>
          <div className="splash-ring" />
        </div>
      )}

      {/* HERO */}
      <section className="hero">
        <canvas
          id="gradient-canvas"
          className="hero-gradient"
          data-js-darken-top=""
          data-transition-in=""
          aria-hidden="true"
        />
        <div className="hero-poster" aria-hidden="true" />
        <video
          ref={heroVideoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={BASE + 'images/DSC08619.jpg'}
          onCanPlay={(e) => { try { e.currentTarget.play(); } catch(_){} }}
        >
          <source src={BASE + 'images/hero-bg.mp4'} type="video/mp4" />
        </video>
        <div className="hero-grad" />
        <div className="hero-content">
          <div className="hero-label">Clifton, NJ — Indoor Turf</div>
          <h1 className="hero-h1">
            <span className="big">7 AM.</span>
            <span className="sub">No Excuses.</span>
          </h1>
          <p className="hero-p">High-level adult pickup soccer. Organized matches, real competition, no shortcuts.</p>
          <div className="hero-btns">
            <Btn href="https://opensports.net/21fc" big>Reserve Your Spot</Btn>
            <a href="#schedule" className="ghost-btn">View Schedule</a>
          </div>
        </div>
        <div className="scroll-ind"><div className="scroll-pill"><div className="scroll-dot" /></div></div>
      </section>

      <div className="site-wrap">
      <Header />

      {/* ═══ WORLD CUP EVENT BANNER ═══ */}
      <a href={BASE + 'world-cup.html'} className="wc-banner rv" target="_self">
        <div className="wc-banner-glow" />
        <div className="wc-banner-inner">
          <div className="wc-banner-flags"><span>🇧🇷</span><span>🇦🇷</span><span>🇫🇷</span><span>🇺🇸</span><span>🇪🇸</span><span>🇨🇴</span><span>🇳🇱</span><span>🇲🇽</span></div>
          <div className="wc-banner-text">
            <div className="wc-banner-eyebrow">NEW EVENT · STARTING MAY 11</div>
            <div className="wc-banner-title">21FC <span>WORLD CUP</span></div>
            <div className="wc-banner-sub">8 Countries · 6 Weeks · $500 Prize · 7AM Kickoff</div>
          </div>
          <div className="wc-banner-cta">Register Now →</div>
        </div>
        <div className="wc-banner-stripe" />
      </a>

      <div className="prlx" data-rate="0.08"><Stats /></div>
      <div className="glow-div" />
      <div className="prlx" data-rate="0.18"><About /></div>
      <div className="prlx" data-rate="0.12"><ImageBand /></div>
      <SessionMarquee />
      <div className="glow-div" />
      <div className="prlx" data-rate="0.15"><Schedule /></div>
      <div className="glow-div" />
      <div className="prlx" data-rate="0.2"><Gallery /></div>
      <div className="glow-div" />
      <div className="prlx" data-rate="0.1"><Membership /></div>
      <div className="prlx" data-rate="0.22"><CTA /></div>
      <div className="glow-div" />
      <div className="prlx" data-rate="0.12"><Contact /></div>
      <div className="glow-div" />
      <div className="prlx" data-rate="0.08"><Location /></div>
      <Footer />
      </div>
    </>
  );
};

export default App;
