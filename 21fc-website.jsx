import { useState, useEffect, useRef, useCallback } from 'react';

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  // Hero image cycle
  const heroImages = [
    './images/DSC08584.jpg',
    './images/DSC08619.jpg',
    './images/DSC08641.jpg',
    './images/DSC08671.jpg',
    './images/DSC08800.jpg',
  ];

  // Ken Burns effect for hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener with throttle
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

  // Intersection observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      observer.observe(el);
    });

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
    banner: "'Bangers', cursive",
  };

  // ===== STYLES =====

  const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: ${fonts.display};
      background-color: ${colors.darkNav};
      color: ${colors.white};
      font-weight: 400;
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    @keyframes kenBurns {
      0% { transform: scale(1); }
      100% { transform: scale(1.12); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `;

  // ===== COMPONENTS =====

  const Header = () => (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: `rgba(10, 10, 20, 0.98)`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid rgba(255, 255, 255, 0.05)`,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img
          src="./images/logo-court-baller-white.png"
          alt="21FC Logo"
          style={{ height: '40px', width: 'auto' }}
          loading="lazy"
        />
        <span
          style={{
            fontSize: 'clamp(16px, 2vw, 24px)',
            fontWeight: 700,
            fontFamily: fonts.display,
            letterSpacing: '-0.5px',
          }}
        >
          21FC
        </span>
      </div>

      <nav
        style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          '@media (max-width: 768px)': {
            display: menuOpen ? 'flex' : 'none',
            flexDirection: 'column',
            position: 'absolute',
            top: '60px',
            left: 0,
            right: 0,
            backgroundColor: colors.darkNav,
            padding: '2rem',
            borderBottom: `1px solid rgba(255, 255, 255, 0.05)`,
          },
        }}
      >
        {['About', 'Schedule', 'Gallery', 'Membership', 'Join'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
            style={{
              color: colors.white,
              textDecoration: 'none',
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              fontWeight: 500,
              fontFamily: fonts.display,
              transition: 'color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = colors.pink;
              e.target.style.borderBottomColor = colors.pink;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = colors.white;
              e.target.style.borderBottomColor = 'transparent';
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block',
          },
          background: 'none',
          border: 'none',
          color: colors.white,
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>
    </header>
  );

  const Hero = () => (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        marginTop: '60px',
      }}
    >
      {/* Background image carousel */}
      {heroImages.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt="Hero"
          loading={idx === 0 ? 'eager' : 'lazy'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: activeImageIndex === idx ? 1 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animation:
              activeImageIndex === idx
                ? 'kenBurns 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                : 'none',
          }}
        />
      ))}

      {/* Dark gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(10, 10, 20, 0.95) 100%)`,
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: 'clamp(2rem, 10vh, 6rem)',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ animation: 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both' }}>
          <p style={{
            fontSize: 'clamp(11px, 1.2vw, 14px)',
            fontFamily: fonts.display,
            fontWeight: 500,
            color: colors.pink,
            textTransform: 'uppercase',
            letterSpacing: '4px',
            marginBottom: 'clamp(12px, 2vw, 20px)',
          }}>Clifton, NJ &mdash; Indoor Turf</p>
        </div>

        <h1
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            color: colors.white,
            lineHeight: 0.92,
            marginBottom: '0.3em',
            letterSpacing: '-0.03em',
            animation: 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.25s both',
          }}
        >
          <span style={{ display: 'block', fontSize: 'clamp(56px, 12vw, 160px)' }}>7 AM.</span>
          <span style={{
            display: 'block',
            fontSize: 'clamp(40px, 8vw, 110px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'rgba(240,239,239,0.85)',
          }}>No Excuses.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(15px, 1.8vw, 22px)',
            fontFamily: fonts.display,
            fontWeight: 300,
            color: 'rgba(240,239,239,0.75)',
            maxWidth: '520px',
            marginBottom: '2.5rem',
            lineHeight: 1.7,
            letterSpacing: '0.01em',
            animation: 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both',
          }}
        >
          High-level adult pickup soccer. Organized games, real community, no shortcuts.
        </p>

        <div style={{
          display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
          animation: 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.55s both',
        }}>
          <a
            href="https://opensports.net/21fc"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '16px 44px',
              backgroundColor: colors.pink,
              color: '#fff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: fonts.display,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = colors.darkNav;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.pink;
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Reserve Your Spot
          </a>
          <a
            href="#schedule"
            style={{
              padding: '16px 32px',
              backgroundColor: 'transparent',
              color: 'rgba(240,239,239,0.8)',
              border: '1px solid rgba(240,239,239,0.15)',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: fonts.display,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(240,239,239,0.4)';
              e.currentTarget.style.color = colors.white;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(240,239,239,0.15)';
              e.currentTarget.style.color = 'rgba(240,239,239,0.6)';
            }}
          >
            View Schedule
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          animation: 'fadeIn 1s ease 1s both',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '40px',
            border: `1px solid rgba(255, 255, 255, 0.3)`,
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            padding: '6px 0',
          }}
        >
          <div
            style={{
              width: '2px',
              height: '6px',
              backgroundColor: colors.white,
              borderRadius: '1px',
              animation: 'slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
            }}
          />
        </div>
      </div>
    </section>
  );

  const About = () => (
    <section
      id="about"
      data-reveal
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        alignItems: 'stretch',
        minHeight: '600px',
        opacity: visibleSections['about'] ? 1 : 0.6,
        transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <img
        src="./images/DSC08671.jpg"
        alt="Action shot"
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div
        style={{
          backgroundColor: colors.cardDark,
          padding: 'clamp(2rem, 8vw, 5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: `1px solid rgba(255, 255, 255, 0.08)`,
          position: 'relative',
        }}
      >
        {/* Pink accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '40px',
            height: '3px',
            backgroundColor: colors.pink,
          }}
        />

        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#9BA3A3',
            marginBottom: '1rem',
            fontFamily: fonts.display,
          }}
        >
          Our Mission
        </span>

        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 300,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            color: colors.white,
            fontFamily: fonts.display,
          }}
        >
          Unite skilled players
          <br />
          in real competition
        </h2>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(240, 239, 239, 0.8)',
            marginBottom: '2rem',
            fontFamily: fonts.display,
          }}
        >
          21FC brings together dedicated players in a competitive, respectful, and
          community-driven environment. We create organized, high-level adult pickup
          soccer where players can push their game, build real connections, and belong
          to something bigger than the match itself.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {[
            { label: 'Location', value: 'Clifton, NJ' },
            { label: 'Schedule', value: 'Mon, Wed, Fri, Sun 7AM' },
          ].map((item, idx) => (
            <div key={idx}>
              <span
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#9BA3A3',
                  marginBottom: '0.5rem',
                  fontFamily: fonts.display,
                }}
              >
                {item.label}
              </span>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: colors.white,
                  fontFamily: fonts.display,
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Schedule = () => (
    <section
      id="schedule"
      data-reveal
      style={{
        backgroundColor: colors.darkNav,
        padding: 'clamp(4rem, 10vh, 8rem) 2rem',
        backgroundImage: `url('./images/DSC08674.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        opacity: visibleSections['schedule'] ? 1 : 0.6,
        transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(10, 10, 20, 0.92)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            marginBottom: '3rem',
            borderLeft: `3px solid ${colors.pink}`,
            paddingLeft: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: colors.white,
              fontFamily: fonts.display,
            }}
          >
            Weekly Schedule
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#9BA3A3',
              fontWeight: 300,
              fontFamily: fonts.display,
            }}
          >
            High-level play. Every session.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {['Monday', 'Wednesday', 'Friday', 'Sunday'].map((day, idx) => (
            <div
              key={idx}
              style={{
                padding: '2rem',
                borderLeft: `2px solid ${colors.pink}`,
                backgroundColor: 'rgba(13, 13, 26, 0.5)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                cursor: 'pointer',
                animation: visibleSections['schedule']
                  ? `slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 0.1}s both`
                  : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftColor = colors.voltYellow;
                e.currentTarget.style.backgroundColor = 'rgba(17, 17, 24, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftColor = colors.pink;
                e.currentTarget.style.backgroundColor = 'rgba(13, 13, 26, 0.5)';
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#9BA3A3',
                  marginBottom: '1rem',
                  fontFamily: fonts.display,
                }}
              >
                {day}
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: colors.white,
                  marginBottom: '0.5rem',
                  fontFamily: fonts.display,
                }}
              >
                7:00 AM
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#9BA3A3',
                  fontWeight: 400,
                  fontFamily: fonts.display,
                }}
              >
                60 min match
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            style={{
              padding: '14px 40px',
              backgroundColor: colors.pink,
              color: colors.darkNav,
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: fonts.display,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.white;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.pink;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Reserve Your Spot
          </button>
        </div>
      </div>
    </section>
  );

  const Gallery = () => (
    <section
      id="gallery"
      data-reveal
      style={{
        backgroundColor: colors.darkNav,
        padding: 'clamp(4rem, 10vh, 8rem) 2rem',
        opacity: visibleSections['gallery'] ? 1 : 0.6,
        transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '3rem',
            borderLeft: `3px solid ${colors.pink}`,
            paddingLeft: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: colors.white,
              fontFamily: fonts.display,
            }}
          >
            Gallery
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#9BA3A3',
              fontWeight: 300,
              fontFamily: fonts.display,
            }}
          >
            Moments from the pitch
          </p>
        </div>

        {/* Featured image */}
        <div
          style={{
            marginBottom: '2rem',
            overflow: 'hidden',
            borderRadius: '2px',
            height: '400px',
            animation: visibleSections['gallery']
              ? `slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both`
              : 'none',
          }}
        >
          <img
            src="./images/DSC08823.jpg"
            alt="Featured action"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '8px',
          }}
        >
          {[
            './images/DSC08584.jpg',
            './images/DSC08634.jpg',
            './images/DSC08703.jpg',
            './images/DSC08730.jpg',
            './images/DSC08806.jpg',
            './images/DSC08820.jpg',
          ].map((src, idx) => (
            <div
              key={idx}
              style={{
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                borderRadius: '2px',
                animation: visibleSections['gallery']
                  ? `slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.15 + idx * 0.08}s both`
                  : 'none',
              }}
            >
              <img
                src={src}
                alt={`Gallery ${idx}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02) brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) brightness(1)';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const Membership = () => (
    <section
      id="membership"
      data-reveal
      style={{
        backgroundColor: colors.darkNav,
        padding: 'clamp(4rem, 10vh, 8rem) 2rem',
        opacity: visibleSections['membership'] ? 1 : 0.6,
        transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '3rem',
            borderLeft: `3px solid ${colors.pink}`,
            paddingLeft: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: colors.white,
              fontFamily: fonts.display,
            }}
          >
            Membership Plans
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#9BA3A3',
              fontWeight: 300,
              fontFamily: fonts.display,
            }}
          >
            Choose your level of commitment
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {[
            {
              name: 'Drop-In',
              price: '$20',
              period: 'per session',
              features: ['1 match', 'No commitment', 'Flexible schedule'],
              featured: false,
            },
            {
              name: 'Player',
              price: '$120',
              period: 'per month',
              features: ['Unlimited games', 'Priority booking', 'Player community'],
              featured: true,
            },
            {
              name: 'Captain',
              price: '$200',
              period: 'per month',
              features: ['Team slots', 'Coach access', 'Premium stats', 'Events'],
              featured: false,
            },
          ].map((plan, idx) => (
            <div
              key={idx}
              style={{
                padding: '2.5rem',
                backgroundColor: colors.cardDark,
                border: `1px solid rgba(255, 255, 255, 0.08)`,
                borderRadius: '2px',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                animation: visibleSections['membership']
                  ? `slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 0.12}s both`
                  : 'none',
                boxShadow: plan.featured
                  ? `inset 0 0 40px rgba(237, 17, 113, 0.08)`
                  : 'none',
                transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.pink;
                e.currentTarget.style.backgroundColor = 'rgba(17, 17, 24, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.backgroundColor = colors.cardDark;
              }}
            >
              {plan.featured && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: colors.pink,
                    color: colors.darkNav,
                    padding: '4px 16px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontFamily: fonts.display,
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.white,
                    marginBottom: '0.5rem',
                    fontFamily: fonts.display,
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: 800,
                      color: colors.white,
                      fontFamily: fonts.display,
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#9BA3A3',
                      fontFamily: fonts.display,
                    }}
                  >
                    {plan.period}
                  </span>
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '1.5rem',
                  marginBottom: '2rem',
                }}
              >
                {plan.features.map((feature, fidx) => (
                  <div
                    key={fidx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      fontSize: '14px',
                      color: 'rgba(240, 239, 239, 0.8)',
                      fontFamily: fonts.display,
                    }}
                  >
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        backgroundColor: colors.pink,
                        borderRadius: '50%',
                      }}
                    />
                    {feature}
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: plan.featured ? colors.pink : 'transparent',
                  color: plan.featured ? colors.darkNav : colors.white,
                  border: plan.featured ? 'none' : `1px solid rgba(255, 255, 255, 0.2)`,
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: fonts.display,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
                onMouseEnter={(e) => {
                  if (plan.featured) {
                    e.target.style.backgroundColor = colors.white;
                  } else {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (plan.featured) {
                    e.target.style.backgroundColor = colors.pink;
                  } else {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const CTA = () => (
    <section
      style={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src="./images/DSC08800.jpg"
        alt="CTA background"
        loading="lazy"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, rgba(10, 10, 20, 0.8) 0%, rgba(10, 10, 20, 0.5) 100%)`,
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 3,
          textAlign: 'center',
          maxWidth: '600px',
          padding: '2rem',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: '1.5rem',
            lineHeight: 1.2,
            fontFamily: fonts.display,
          }}
        >
          Ready to Play?
        </h2>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(240, 239, 239, 0.9)',
            marginBottom: '2rem',
            fontWeight: 300,
            fontFamily: fonts.display,
          }}
        >
          Join the most competitive pickup soccer community in Jersey. No excuses. No
          limits.
        </p>

        <button
          style={{
            padding: '16px 48px',
            backgroundColor: colors.pink,
            color: colors.darkNav,
            border: 'none',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: fonts.display,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.white;
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.pink;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Join Now
        </button>
      </div>
    </section>
  );

  const Contact = () => (
    <section
      id="join"
      data-reveal
      style={{
        backgroundColor: colors.darkNav,
        padding: 'clamp(4rem, 10vh, 8rem) 2rem',
        borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
        opacity: visibleSections['join'] ? 1 : 0.6,
        transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '3rem',
            borderLeft: `3px solid ${colors.pink}`,
            paddingLeft: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: colors.white,
              fontFamily: fonts.display,
            }}
          >
            Get in Touch
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#9BA3A3',
              fontWeight: 300,
              fontFamily: fonts.display,
            }}
          >
            Questions? We're here to help.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Contact Info */}
          <div>
            {[
              { label: 'Instagram', value: '@21fc.soccer' },
              { label: 'Location', value: 'Clifton, NJ' },
              { label: 'Schedule', value: 'Mon, Wed, Fri, Sun 7 AM' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: '2rem',
                  paddingBottom: '2rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  animation: visibleSections['join']
                    ? `slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${idx * 0.1}s both`
                    : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#9BA3A3',
                    marginBottom: '0.5rem',
                    fontFamily: fonts.display,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: colors.white,
                    fontWeight: 500,
                    fontFamily: fonts.display,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quick form */}
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Your name"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
                color: colors.white,
                padding: '0.75rem 0',
                fontSize: '14px',
                fontFamily: fonts.display,
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = colors.pink;
              }}
              onBlur={(e) => {
                e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
                color: colors.white,
                padding: '0.75rem 0',
                fontSize: '14px',
                fontFamily: fonts.display,
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = colors.pink;
              }}
              onBlur={(e) => {
                e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <textarea
              placeholder="Your message"
              rows="4"
              style={{
                backgroundColor: 'transparent',
                border: `1px solid rgba(255, 255, 255, 0.2)`,
                color: colors.white,
                padding: '0.75rem',
                fontSize: '14px',
                fontFamily: fonts.display,
                outline: 'none',
                transition: 'border-color 0.3s',
                resize: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.pink;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: colors.pink,
                color: colors.darkNav,
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: fonts.display,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.white;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.pink;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  const Location = () => (
    <section
      id="location"
      data-reveal
      style={{
        backgroundColor: '#060610',
        padding: 'clamp(4rem, 10vh, 8rem) 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        opacity: visibleSections['location'] ? 1 : 0.6,
        transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 'clamp(2rem, 4vw, 4rem)',
          alignItems: 'start',
        }}>
          {/* Left — Info */}
          <div>
            <div style={{
              borderLeft: `3px solid ${colors.pink}`,
              paddingLeft: '1.5rem',
              marginBottom: '2.5rem',
            }}>
              <h2 style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: colors.white,
                fontFamily: fonts.display,
              }}>Find Us</h2>
              <p style={{
                fontSize: '16px',
                color: '#9BA3A3',
                fontWeight: 300,
                fontFamily: fonts.display,
              }}>Indoor turf facility in Clifton, NJ</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { label: 'Location', value: 'Clifton, NJ — Indoor Turf' },
                { label: 'Game Days', value: 'Monday · Wednesday · Friday · Sunday' },
                { label: 'Kickoff', value: '7:00 AM Sharp' },
                { label: 'Book Via', value: 'OpenSports', link: 'https://opensports.net/21fc' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: colors.pink,
                    marginBottom: '6px',
                    fontFamily: fonts.display,
                  }}>{item.label}</div>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                      fontSize: '16px',
                      color: colors.white,
                      fontWeight: 500,
                      fontFamily: fonts.display,
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(237, 17, 113, 0.4)',
                      paddingBottom: '2px',
                      transition: 'border-color 0.3s',
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.pink; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(237, 17, 113, 0.4)'; }}
                    >{item.value}</a>
                  ) : (
                    <div style={{
                      fontSize: '16px',
                      color: colors.white,
                      fontWeight: 500,
                      fontFamily: fonts.display,
                    }}>{item.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Google Map */}
          <div style={{
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            height: '440px',
          }}>
            <iframe
              title="21FC — Clifton, NJ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48338.1!2d-74.1637!3d40.8584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f9b4b5cc7c6b%3A0xa27b78b5b3bfc7e!2sClifton%2C%20NJ!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: 'block',
                filter: 'invert(90%) hue-rotate(180deg) saturate(0.3) brightness(0.7)',
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );

  const Footer = () => (
    <footer
      style={{
        backgroundColor: colors.darkNav,
        borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
        padding: '3rem 2rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="./images/logo-court-baller-white.png"
              alt="21FC"
              style={{ height: '32px', width: 'auto' }}
              loading="lazy"
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: '18px',
                fontFamily: fonts.display,
                color: colors.white,
              }}
            >
              21FC
            </span>
          </div>

          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {['Instagram', 'OpenSports', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: '#9BA3A3',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontFamily: fonts.display,
                  transition: 'color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = colors.white;
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = colors.gray;
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#9BA3A3',
              fontFamily: fonts.display,
            }}
          >
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
      <About />
      <Schedule />
      <Gallery />
      <Membership />
      <CTA />
      <Contact />
      <Location />
      <Footer />
    </>
  );
};

export default App;
