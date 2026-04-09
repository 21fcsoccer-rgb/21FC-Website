import { useState, useEffect, useRef, useCallback } from 'react';

const BASE = import.meta.env.BASE_URL;

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [countersTriggered, setCountersTriggered] = useState(false);

  const heroImages = [
    BASE + 'images/DSC08584.jpg',
    BASE + 'images/DSC08619.jpg',
    BASE + 'images/DSC08641.jpg',
    BASE + 'images/DSC08671.jpg',
    BASE + 'images/DSC08800.jpg',
  ];

  // Hero image cycle — slower for cinematic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
            if (entry.target.id === 'stats') setCountersTriggered(true);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const colors = {
    pink: '#ED1171',
    black: '#000000',
    voltYellow: '#D3DE25',
    gray: '#718080',
    white: '#F0EFEF',
    darkNav: '#0A0A14',
    cardDark: '#111118',
    darkGray: '#0D0D1A',
  };

  const fonts = {
    display: "'Red Hat Display', sans-serif",
  };

  const ease = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  // ===== ANIMATED COUNTER =====
  const Counter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!countersTriggered) return;
      let start = 0;
      const step = end / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(timer);
    }, [countersTriggered, end, duration]);
    return <>{count}{suffix}</>;
  };

  // ===== PARALLAX IMAGE DIVIDER =====
  const ParallaxDivider = ({ src, height = '50vh', objectPos = 'center 40%', overlay = 0.3, children }) => (
    <div style={{
      position: 'relative',
      height,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: 0,
        right: 0,
        height: '140%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: objectPos,
        backgroundAttachment: 'fixed',
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(10, 10, 20, ${overlay})`,
        zIndex: 1,
      }} />
      {children && (
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );

  // ===== STYLES =====
  const globalStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: ${fonts.display};
      background-color: ${colors.darkNav};
      color: ${colors.white};
      font-weight: 400;
      overflow-x: hidden;
    }
    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }
    @keyframes kenBurns {
      0% { transform: scale(1) translate(0, 0); }
      100% { transform: scale(1.06) translate(-0.5%, -0.5%); }
    }
    @keyframes kenBurns2 {
      0% { transform: scale(1.04) translate(-1%, 0); }
      100% { transform: scale(1) translate(0.5%, -0.5%); }
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 20px rgba(237,17,113,0.15); } 50% { box-shadow: 0 0 40px rgba(237,17,113,0.3); } }
    @keyframes lineGrow { from { width: 0; } to { width: 100%; } }
    @keyframes scrollBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
    @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  `;

  // ===== HEADER =====
  const isScrolled = scrollY > 80;
  const Header = () => (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      backgroundColor: isScrolled ? 'rgba(10,10,20,0.98)' : 'rgba(10,10,20,0.4)',
      backdropFilter: 'blur(12px)',
      borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      padding: isScrolled ? '0.75rem 2rem' : '1.25rem 2rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      transition: 'all 0.5s ' + ease,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src={BASE + "images/logo-court-baller-white.png"} alt="21FC Logo"
          style={{ height: isScrolled ? '32px' : '40px', width: 'auto', transition: 'height 0.4s ' + ease }} loading="lazy" />
        <span style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 700, fontFamily: fonts.display, letterSpacing: '-0.5px' }}>
          21FC
        </span>
      </div>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {['About', 'Schedule', 'Gallery', 'Membership', 'Join'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}
            style={{
              color: colors.white, textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              fontFamily: fonts.display, transition: 'color 0.3s ' + ease,
              borderBottom: '2px solid transparent', paddingBottom: '2px',
            }}
            onMouseEnter={(e) => { e.target.style.color = colors.pink; e.target.style.borderBottomColor = colors.pink; }}
            onMouseLeave={(e) => { e.target.style.color = colors.white; e.target.style.borderBottomColor = 'transparent'; }}
          >{item}</a>
        ))}
      </nav>
    </header>
  );

  // ===== HERO — fixed image display =====
  const Hero = () => (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {heroImages.map((src, idx) => (
        <div key={idx} style={{
          position: 'absolute', inset: 0,
          opacity: activeImageIndex === idx ? 1 : 0,
          transition: 'opacity 1.5s ' + ease,
        }}>
          <img src={src} alt="Hero" loading={idx === 0 ? 'eager' : 'lazy'}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
              animation: activeImageIndex === idx
                ? `${idx % 2 === 0 ? 'kenBurns' : 'kenBurns2'} 9s ${ease} forwards`
                : 'none',
            }}
          />
        </div>
      ))}

      {/* Gradient overlays — softer so you see more image */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: `linear-gradient(180deg, rgba(10,10,20,0.25) 0%, rgba(10,10,20,0.15) 40%, rgba(10,10,20,0.6) 75%, rgba(10,10,20,0.97) 100%)`,
      }} />
      {/* Side vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,20,0.4) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start',
        padding: 'clamp(2rem, 10vh, 6rem)', maxWidth: '1400px', margin: '0 auto', width: '100%',
      }}>
        <div style={{ animation: 'slideInUp 0.8s ' + ease + ' 0.2s both' }}>
          <p style={{
            fontSize: 'clamp(11px, 1.2vw, 14px)', fontFamily: fonts.display, fontWeight: 500,
            color: colors.pink, textTransform: 'uppercase', letterSpacing: '4px',
            marginBottom: 'clamp(12px, 2vw, 20px)',
          }}>Clifton, NJ &mdash; Indoor Turf</p>
        </div>

        <h1 style={{
          fontFamily: fonts.display, fontWeight: 900, color: colors.white, lineHeight: 0.92,
          marginBottom: '0.3em', letterSpacing: '-0.03em',
          animation: 'slideInUp 0.8s ' + ease + ' 0.25s both',
        }}>
          <span style={{ display: 'block', fontSize: 'clamp(56px, 12vw, 160px)' }}>7 AM.</span>
          <span style={{
            display: 'block', fontSize: 'clamp(40px, 8vw, 110px)', fontWeight: 300,
            letterSpacing: '-0.02em', color: 'rgba(240,239,239,0.85)',
          }}>No Excuses.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 1.8vw, 22px)', fontFamily: fonts.display, fontWeight: 300,
          color: 'rgba(240,239,239,0.75)', maxWidth: '520px', marginBottom: '2.5rem',
          lineHeight: 1.7, letterSpacing: '0.01em', animation: 'slideInUp 0.8s ' + ease + ' 0.4s both',
        }}>
          High-level adult pickup soccer. Organized games, real community, no shortcuts.
        </p>

        <div style={{
          display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
          animation: 'slideInUp 0.8s ' + ease + ' 0.55s both',
        }}>
          <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
            style={{
              padding: '16px 44px', backgroundColor: colors.pink, color: '#fff', border: 'none',
              fontSize: '13px', fontWeight: 700, fontFamily: fonts.display, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '2px', textDecoration: 'none', display: 'inline-block',
              transition: 'all 0.3s ' + ease,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = colors.darkNav; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(237,17,113,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.pink; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Reserve Your Spot</a>
          <a href="#schedule"
            style={{
              padding: '16px 32px', backgroundColor: 'transparent', color: 'rgba(240,239,239,0.8)',
              border: '1px solid rgba(240,239,239,0.2)', fontSize: '13px', fontWeight: 500,
              fontFamily: fonts.display, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '2px',
              textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s ' + ease,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.white; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(240,239,239,0.2)'; e.currentTarget.style.color = 'rgba(240,239,239,0.8)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >View Schedule</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 3, animation: 'fadeIn 1s ease 1.2s both' }}>
        <div style={{ width: '24px', height: '40px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '12px', display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
          <div style={{ width: '2px', height: '8px', backgroundColor: colors.pink, borderRadius: '1px', animation: 'scrollBounce 1.5s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );

  // ===== STATS BAR =====
  const StatsBar = () => (
    <section id="stats" data-reveal style={{
      backgroundColor: colors.cardDark, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
        {[
          { end: 200, suffix: '+', label: 'Active Players' },
          { end: 4, suffix: 'x', label: 'Weekly Games' },
          { end: 7, suffix: 'AM', label: 'Kickoff Time' },
          { end: 3, suffix: '+', label: 'Years Running' },
        ].map((stat, idx) => (
          <div key={idx} style={{
            animation: visibleSections['stats'] ? `slideInUp 0.7s ${ease} ${idx * 0.12}s both` : 'none',
          }}>
            <div style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, fontFamily: fonts.display,
              color: colors.white, lineHeight: 1,
              background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.pink} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              <Counter end={stat.end} suffix={stat.suffix} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#9BA3A3', marginTop: '0.5rem', fontFamily: fonts.display }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ===== ABOUT — with better image display =====
  const About = () => (
    <section id="about" data-reveal style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, alignItems: 'stretch', minHeight: '600px',
    }}>
      {/* Image with proper framing — show the full scene */}
      <div style={{
        overflow: 'hidden', position: 'relative',
        opacity: visibleSections['about'] ? 1 : 0,
        transform: visibleSections['about'] ? 'translateX(0)' : 'translateX(-40px)',
        transition: 'all 1s ' + ease,
      }}>
        <img src={BASE + "images/DSC08671.jpg"} alt="Action shot" loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: 'center 30%',
            transition: 'transform 8s ' + ease,
          }}
          onMouseEnter={(e) => { e.target.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
        />
        {/* Pink accent corner */}
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '4px', backgroundColor: colors.pink }} />
      </div>

      <div style={{
        backgroundColor: colors.cardDark, padding: 'clamp(2rem, 8vw, 5rem)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        borderLeft: '1px solid rgba(255,255,255,0.08)', position: 'relative',
        opacity: visibleSections['about'] ? 1 : 0,
        transform: visibleSections['about'] ? 'translateX(0)' : 'translateX(40px)',
        transition: 'all 1s ' + ease + ' 0.2s',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '3px', backgroundColor: colors.pink }} />

        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9BA3A3', marginBottom: '1rem', fontFamily: fonts.display }}>
          Our Mission
        </span>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, marginBottom: '1.5rem', lineHeight: 1.2, color: colors.white, fontFamily: fonts.display }}>
          Unite skilled players<br />in real competition
        </h2>
        <p style={{ fontSize: 'clamp(16px, 2vw, 18px)', fontWeight: 300, lineHeight: 1.8, color: 'rgba(240,239,239,0.8)', marginBottom: '2rem', fontFamily: fonts.display }}>
          21FC brings together dedicated players in a competitive, respectful, and community-driven environment. We create organized, high-level adult pickup soccer where players can push their game, build real connections, and belong to something bigger than the match itself.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {[{ label: 'Location', value: 'Clifton, NJ' }, { label: 'Schedule', value: 'Mon, Wed, Fri, Sun 7AM' }].map((item, idx) => (
            <div key={idx}>
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9BA3A3', marginBottom: '0.5rem', fontFamily: fonts.display }}>{item.label}</span>
              <p style={{ fontSize: '16px', fontWeight: 500, color: colors.white, fontFamily: fonts.display }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ===== PHOTO STRIP — horizontal scrolling images =====
  const PhotoStrip = () => {
    const stripImages = [
      BASE + 'images/DSC08712.jpg', BASE + 'images/DSC08737.jpg', BASE + 'images/DSC08674.jpg',
      BASE + 'images/DSC08703.jpg', BASE + 'images/DSC08619.jpg', BASE + 'images/DSC08820.jpg',
    ];
    return (
      <div style={{
        overflow: 'hidden', padding: '4px 0',
        backgroundColor: colors.black,
        borderTop: '1px solid rgba(237,17,113,0.2)',
        borderBottom: '1px solid rgba(237,17,113,0.2)',
      }}>
        <div style={{
          display: 'flex', gap: '4px',
          animation: 'none',
          transform: `translateX(${-scrollY * 0.15}px)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform',
        }}>
          {[...stripImages, ...stripImages].map((src, idx) => (
            <div key={idx} style={{ flexShrink: 0, width: '300px', height: '200px', overflow: 'hidden' }}>
              <img src={src} alt="" loading="lazy"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%',
                  transition: 'transform 0.5s ' + ease, filter: 'brightness(0.85)',
                }}
                onMouseEnter={(e) => { e.target.style.transform = 'scale(1.08)'; e.target.style.filter = 'brightness(1)'; }}
                onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'brightness(0.85)'; }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ===== SCHEDULE =====
  const Schedule = () => (
    <section id="schedule" data-reveal style={{
      backgroundColor: colors.darkNav, padding: 'clamp(4rem, 10vh, 8rem) 2rem',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3rem', borderLeft: `3px solid ${colors.pink}`, paddingLeft: '1.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, marginBottom: '0.5rem',
            color: colors.white, fontFamily: fonts.display,
            opacity: visibleSections['schedule'] ? 1 : 0,
            transform: visibleSections['schedule'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ' + ease,
          }}>Weekly Schedule</h2>
          <p style={{ fontSize: '16px', color: '#9BA3A3', fontWeight: 300, fontFamily: fonts.display }}>
            High-level play. Every session.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {['Monday', 'Wednesday', 'Friday', 'Sunday'].map((day, idx) => (
            <div key={idx}
              style={{
                padding: '2rem', borderLeft: `2px solid ${colors.pink}`,
                backgroundColor: 'rgba(17,17,24,0.6)', backdropFilter: 'blur(10px)',
                transition: 'all 0.4s ' + ease, cursor: 'pointer',
                animation: visibleSections['schedule'] ? `slideInUp 0.8s ${ease} ${0.1 + idx * 0.12}s both` : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftColor = colors.voltYellow;
                e.currentTarget.style.backgroundColor = 'rgba(17,17,24,0.9)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftColor = colors.pink;
                e.currentTarget.style.backgroundColor = 'rgba(17,17,24,0.6)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9BA3A3', marginBottom: '1rem', fontFamily: fonts.display }}>{day}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: colors.white, marginBottom: '0.5rem', fontFamily: fonts.display }}>7:00 AM</div>
              <div style={{ fontSize: '14px', color: '#9BA3A3', fontWeight: 400, fontFamily: fonts.display }}>60 min match</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
            style={{
              padding: '14px 40px', backgroundColor: colors.pink, color: '#fff', border: 'none',
              fontSize: '14px', fontWeight: 700, fontFamily: fonts.display, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s ' + ease,
              textDecoration: 'none', display: 'inline-block',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.white; e.currentTarget.style.color = colors.darkNav; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(237,17,113,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.pink; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >Reserve Your Spot</a>
        </div>
      </div>
    </section>
  );

  // ===== GALLERY — better image display =====
  const Gallery = () => {
    const galleryImages = [
      { src: BASE + 'images/DSC08823.jpg', span: 'span 2', pos: 'center 25%' },
      { src: BASE + 'images/DSC08584.jpg', span: 'span 1', pos: 'center 30%' },
      { src: BASE + 'images/DSC08634.jpg', span: 'span 1', pos: 'center 40%' },
      { src: BASE + 'images/DSC08703.jpg', span: 'span 1', pos: 'center 35%' },
      { src: BASE + 'images/DSC08730.jpg', span: 'span 1', pos: 'center 30%' },
      { src: BASE + 'images/DSC08806.jpg', span: 'span 1', pos: 'center 40%' },
      { src: BASE + 'images/DSC08820.jpg', span: 'span 1', pos: 'center 35%' },
      { src: BASE + 'images/DSC08712.jpg', span: 'span 2', pos: 'center 30%' },
    ];

    return (
      <section id="gallery" data-reveal style={{
        backgroundColor: colors.darkNav, padding: 'clamp(4rem, 10vh, 8rem) 2rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem', borderLeft: `3px solid ${colors.pink}`, paddingLeft: '1.5rem' }}>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, marginBottom: '0.5rem',
              color: colors.white, fontFamily: fonts.display,
              opacity: visibleSections['gallery'] ? 1 : 0,
              transform: visibleSections['gallery'] ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ' + ease,
            }}>Gallery</h2>
            <p style={{ fontSize: '16px', color: '#9BA3A3', fontWeight: 300, fontFamily: fonts.display }}>Moments from the pitch</p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px',
            gridAutoRows: '220px',
          }}>
            {galleryImages.map((img, idx) => (
              <div key={idx} style={{
                gridColumn: img.span, overflow: 'hidden', borderRadius: '2px', position: 'relative',
                animation: visibleSections['gallery'] ? `scaleIn 0.7s ${ease} ${idx * 0.08}s both` : 'none',
              }}>
                <img src={img.src} alt={`Gallery ${idx}`} loading="lazy"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    objectPosition: img.pos,
                    transition: 'transform 0.6s ' + ease + ', filter 0.6s ' + ease,
                    cursor: 'pointer', filter: 'brightness(0.9)',
                  }}
                  onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.filter = 'brightness(1.05)'; }}
                  onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'brightness(0.9)'; }}
                />
                {/* Hover overlay with pink accent */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                  backgroundColor: colors.pink, transform: 'scaleX(0)', transformOrigin: 'left',
                  transition: 'transform 0.4s ' + ease,
                }}
                  className="gallery-line"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // ===== MEMBERSHIP =====
  const Membership = () => (
    <section id="membership" data-reveal style={{
      backgroundColor: colors.darkNav, padding: 'clamp(4rem, 10vh, 8rem) 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', borderLeft: `3px solid ${colors.pink}`, paddingLeft: '1.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, marginBottom: '0.5rem',
            color: colors.white, fontFamily: fonts.display,
            opacity: visibleSections['membership'] ? 1 : 0,
            transform: visibleSections['membership'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ' + ease,
          }}>Membership Plans</h2>
          <p style={{ fontSize: '16px', color: '#9BA3A3', fontWeight: 300, fontFamily: fonts.display }}>Choose your level of commitment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { name: 'Drop-In', price: '$20', period: 'per session', features: ['1 match', 'No commitment', 'Flexible schedule'], featured: false },
            { name: 'Player', price: '$120', period: 'per month', features: ['Unlimited games', 'Priority booking', 'Player community'], featured: true },
            { name: 'Captain', price: '$200', period: 'per month', features: ['Team slots', 'Coach access', 'Premium stats', 'Events'], featured: false },
          ].map((plan, idx) => (
            <div key={idx} style={{
              padding: '2.5rem', backgroundColor: colors.cardDark,
              border: plan.featured ? `1px solid rgba(237,17,113,0.3)` : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '2px', position: 'relative',
              transition: 'all 0.5s ' + ease,
              animation: visibleSections['membership'] ? `slideInUp 0.8s ${ease} ${idx * 0.15}s both` : 'none',
              boxShadow: plan.featured ? '0 0 60px rgba(237,17,113,0.08)' : 'none',
              transform: plan.featured ? 'scale(1.03)' : 'scale(1)',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.pink;
                e.currentTarget.style.transform = plan.featured ? 'scale(1.05) translateY(-6px)' : 'scale(1.02) translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = plan.featured ? 'rgba(237,17,113,0.3)' : 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = plan.featured ? 'scale(1.03)' : 'scale(1)';
                e.currentTarget.style.boxShadow = plan.featured ? '0 0 60px rgba(237,17,113,0.08)' : 'none';
              }}
            >
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: colors.pink, color: '#fff', padding: '5px 20px',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                  fontFamily: fonts.display, animation: 'glowPulse 3s ease-in-out infinite',
                }}>Most Popular</div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, color: colors.white, marginBottom: '0.5rem', fontFamily: fonts.display }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: colors.white, fontFamily: fonts.display }}>{plan.price}</span>
                  <span style={{ fontSize: '14px', color: '#9BA3A3', fontFamily: fonts.display }}>{plan.period}</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '14px', color: 'rgba(240,239,239,0.8)', fontFamily: fonts.display }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: colors.pink, borderRadius: '50%', flexShrink: 0 }} />
                    {feature}
                  </div>
                ))}
              </div>
              <button style={{
                width: '100%', padding: '14px', backgroundColor: plan.featured ? colors.pink : 'transparent',
                color: plan.featured ? '#fff' : colors.white,
                border: plan.featured ? 'none' : '1px solid rgba(255,255,255,0.2)',
                fontSize: '13px', fontWeight: 700, fontFamily: fonts.display, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s ' + ease,
              }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = plan.featured ? colors.white : 'rgba(255,255,255,0.1)'; if (plan.featured) e.target.style.color = colors.darkNav; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = plan.featured ? colors.pink : 'transparent'; if (plan.featured) e.target.style.color = '#fff'; }}
              >Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ===== CTA — parallax background =====
  const CTA = () => (
    <section style={{ position: 'relative', height: '60vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        position: 'absolute', top: '-20%', left: 0, right: 0, height: '140%',
        backgroundImage: `url(${BASE}images/DSC08800.jpg)`,
        backgroundSize: 'cover', backgroundPosition: 'center 30%', backgroundAttachment: 'fixed',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,20,0.75) 0%, rgba(237,17,113,0.15) 100%)', zIndex: 1 }} />
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '700px', padding: '2rem' }}>
        <h2 style={{
          fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 900, color: colors.white,
          marginBottom: '1.5rem', lineHeight: 1.1, fontFamily: fonts.display, letterSpacing: '-0.02em',
        }}>
          Ready to Play?
        </h2>
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(240,239,239,0.9)', marginBottom: '2.5rem', fontWeight: 300, fontFamily: fonts.display, lineHeight: 1.7 }}>
          Join the most competitive pickup soccer community in Jersey.<br />No excuses. No limits.
        </p>
        <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
          style={{
            padding: '18px 56px', backgroundColor: colors.pink, color: '#fff', border: 'none',
            fontSize: '15px', fontWeight: 700, fontFamily: fonts.display, cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '2px', transition: 'all 0.4s ' + ease,
            textDecoration: 'none', display: 'inline-block',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.white; e.currentTarget.style.color = colors.darkNav; e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 15px 50px rgba(237,17,113,0.35)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.pink; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >Join Now</a>
      </div>
    </section>
  );

  // ===== CONTACT =====
  const Contact = () => (
    <section id="join" data-reveal style={{
      backgroundColor: colors.darkNav, padding: 'clamp(4rem, 10vh, 8rem) 2rem',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', borderLeft: `3px solid ${colors.pink}`, paddingLeft: '1.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, marginBottom: '0.5rem',
            color: colors.white, fontFamily: fonts.display,
            opacity: visibleSections['join'] ? 1 : 0,
            transform: visibleSections['join'] ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ' + ease,
          }}>Get in Touch</h2>
          <p style={{ fontSize: '16px', color: '#9BA3A3', fontWeight: 300, fontFamily: fonts.display }}>Questions? We're here to help.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            {[
              { label: 'Instagram', value: '@21fc.soccer' },
              { label: 'Location', value: 'Clifton, NJ' },
              { label: 'Schedule', value: 'Mon, Wed, Fri, Sun 7 AM' },
            ].map((item, idx) => (
              <div key={idx} style={{
                marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
                animation: visibleSections['join'] ? `slideInLeft 0.7s ${ease} ${idx * 0.1}s both` : 'none',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9BA3A3', marginBottom: '0.5rem', fontFamily: fonts.display }}>{item.label}</div>
                <div style={{ fontSize: '16px', color: colors.white, fontWeight: 500, fontFamily: fonts.display }}>{item.value}</div>
              </div>
            ))}
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => e.preventDefault()}>
            {['Your name', 'your@email.com'].map((ph, idx) => (
              <input key={idx} type={idx === 1 ? 'email' : 'text'} placeholder={ph}
                style={{
                  backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)',
                  color: colors.white, padding: '0.75rem 0', fontSize: '14px', fontFamily: fonts.display, outline: 'none',
                  transition: 'border-color 0.4s ' + ease,
                  animation: visibleSections['join'] ? `slideInRight 0.7s ${ease} ${idx * 0.1}s both` : 'none',
                }}
                onFocus={(e) => { e.target.style.borderBottomColor = colors.pink; }}
                onBlur={(e) => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.15)'; }}
              />
            ))}
            <textarea placeholder="Your message" rows="4"
              style={{
                backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                color: colors.white, padding: '0.75rem', fontSize: '14px', fontFamily: fonts.display, outline: 'none',
                transition: 'border-color 0.4s ' + ease, resize: 'none',
                animation: visibleSections['join'] ? `slideInRight 0.7s ${ease} 0.2s both` : 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = colors.pink; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            />
            <button type="submit" style={{
              padding: '14px 28px', backgroundColor: colors.pink, color: '#fff', border: 'none',
              fontSize: '13px', fontWeight: 700, fontFamily: fonts.display, cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s ' + ease,
              animation: visibleSections['join'] ? `slideInRight 0.7s ${ease} 0.3s both` : 'none',
            }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = colors.white; e.target.style.color = colors.darkNav; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = colors.pink; e.target.style.color = '#fff'; e.target.style.transform = 'translateY(0)'; }}
            >Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );

  // ===== LOCATION =====
  const Location = () => (
    <section id="location" data-reveal style={{
      backgroundColor: '#060610', padding: 'clamp(4rem, 10vh, 8rem) 2rem',
      borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 'clamp(2rem, 4vw, 4rem)', alignItems: 'start' }}>
          <div style={{
            opacity: visibleSections['location'] ? 1 : 0,
            transform: visibleSections['location'] ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s ' + ease,
          }}>
            <div style={{ borderLeft: `3px solid ${colors.pink}`, paddingLeft: '1.5rem', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, marginBottom: '0.5rem', color: colors.white, fontFamily: fonts.display }}>Find Us</h2>
              <p style={{ fontSize: '16px', color: '#9BA3A3', fontWeight: 300, fontFamily: fonts.display }}>Indoor turf facility in Clifton, NJ</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: 'Location', value: 'Clifton, NJ — Indoor Turf' },
                { label: 'Game Days', value: 'Monday · Wednesday · Friday · Sunday' },
                { label: 'Kickoff', value: '7:00 AM Sharp' },
                { label: 'Book Via', value: 'OpenSports', link: 'https://opensports.net/21fc' },
              ].map((item, idx) => (
                <div key={idx} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: colors.pink, marginBottom: '6px', fontFamily: fonts.display }}>{item.label}</div>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '16px', color: colors.white, fontWeight: 500, fontFamily: fonts.display,
                      textDecoration: 'none', borderBottom: '1px solid rgba(237,17,113,0.4)', paddingBottom: '2px',
                      transition: 'border-color 0.3s ' + ease,
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.pink; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(237,17,113,0.4)'; }}
                    >{item.value}</a>
                  ) : (
                    <div style={{ fontSize: '16px', color: colors.white, fontWeight: 500, fontFamily: fonts.display }}>{item.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            borderRadius: '2px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: '440px',
            opacity: visibleSections['location'] ? 1 : 0,
            transform: visibleSections['location'] ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all 0.8s ' + ease + ' 0.2s',
          }}>
            <iframe title="21FC — Clifton, NJ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48338.1!2d-74.1637!3d40.8584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f9b4b5cc7c6b%3A0xa27b78b5b3bfc7e!2sClifton%2C%20NJ!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="100%"
              style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.7)' }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );

  // ===== FOOTER =====
  const Footer = () => (
    <footer style={{ backgroundColor: colors.darkNav, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '3rem 2rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={BASE + "images/logo-court-baller-white.png"} alt="21FC" style={{ height: '32px', width: 'auto' }} loading="lazy" />
            <span style={{ fontWeight: 700, fontSize: '18px', fontFamily: fonts.display, color: colors.white }}>21FC</span>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {['Instagram', 'OpenSports', 'Contact'].map((item) => (
              <a key={item} href="#" style={{ color: '#9BA3A3', textDecoration: 'none', fontSize: '14px', fontFamily: fonts.display, transition: 'color 0.3s ' + ease }}
                onMouseEnter={(e) => { e.target.style.color = colors.white; }}
                onMouseLeave={(e) => { e.target.style.color = '#9BA3A3'; }}
              >{item}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#9BA3A3', fontFamily: fonts.display }}>
            © 2026 21FC. High-level players. Organized games. Real community.
          </p>
        </div>
      </div>
    </footer>
  );

  // ===== RENDER =====
  return (
    <>
      <style>{globalStyles}</style>
      <Header />
      <Hero />
      <StatsBar />
      <About />
      <PhotoStrip />
      <Schedule />
      <ParallaxDivider src={BASE + 'images/DSC08674.jpg'} height="45vh" objectPos="center 35%" overlay={0.4} />
      <Gallery />
      <Membership />
      <CTA />
      <Contact />
      <ParallaxDivider src={BASE + 'images/DSC08737.jpg'} height="35vh" objectPos="center 30%" overlay={0.5} />
      <Location />
      <Footer />
    </>
  );
};

export default App;
