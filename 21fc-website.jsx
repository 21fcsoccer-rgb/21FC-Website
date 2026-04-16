import { useState, useEffect, useRef, useCallback } from "react";

// ─── Image Assets (local files in /images folder) ───────────────
const LOGOS = {
  whiteOnBlack: "./images/21fc-logo-white.png",
  courtBallerPink: "./images/21fc-logo-court-baller-pink.png",
  neutralGrey: "./images/21fc-logo-grey.png",
};

const PHOTOS = {
  heroGreen: "./images/21fc-hero-green.jpg",
  heroBlue: "./images/21fc-hero-blue.jpg",
  playerBlueNeon: "./images/21fc-player-blue-neon.jpg",
  playerPortrait1: "./images/21fc-player-portrait1.jpg",
  goldAction: "./images/21fc-gold-action.jpg",
  redKitPlayer1: "./images/21fc-red-kit1.jpg",
  playerPortrait2: "./images/21fc-player-portrait2.jpg",
  redKitPlayer2: "./images/21fc-red-kit2.jpg",
  actionWide: "./images/21fc-action-wide.jpg",
};

// ─── Design Tokens ───────────────────────────────────────────────
const COLORS = {
  bgDark: "#0A0E1A",
  bgCard: "#111827",
  bgCardHover: "#1a2238",
  pink: "#E91E8C",
  pinkLight: "#FF4DB2",
  blue: "#6366F1",
  blueLight: "#818CF8",
  white: "#FFFFFF",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
  border: "#1F2937",
  success: "#10B981",
  neonGreen: "#CCFF00",
  navy: "#0A1628",
};

// ─── Parallax & Scroll Hooks ────────────────────────────────────
const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
};

// Intersection Observer hook for scroll-reveal animations
const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// ─── SVG Icons ───────────────────────────────────────────────────
const Icons = {
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Trophy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Instagram: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Zap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ─── Logo Component ─────────────────────────────────────────────
const Logo = ({ size = 48, variant = "white" }) => {
  const src = variant === "grey" ? LOGOS.neutralGrey : LOGOS.whiteOnBlack;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <img src={src} alt="21FC Soccer Club" style={{
        height: size, width: "auto", objectFit: "contain",
        filter: "drop-shadow(0 0 20px rgba(233, 30, 140, 0.15))",
      }}
        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
      />
      <div style={{
        display: "none", alignItems: "center", gap: "8px",
        fontFamily: "'Oswald', sans-serif", fontWeight: 700,
        fontSize: size * 0.45, color: COLORS.white, letterSpacing: "2px",
      }}>
        <div style={{
          width: size * 0.7, height: size * 0.7, borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.25,
        }}>21FC</div>
        21FC
      </div>
    </div>
  );
};

// ─── Smooth Scroll ──────────────────────────────────────────────
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// ─── Parallax Image Component ───────────────────────────────────
const ParallaxBg = ({ src, speed = 0.3, opacity = 0.3, scrollY, sectionTop = 0 }) => {
  const offset = (scrollY - sectionTop) * speed;
  return (
    <div style={{
      position: "absolute", inset: "-20% 0", zIndex: 0,
      backgroundImage: `url(${src})`,
      backgroundSize: "cover", backgroundPosition: "center",
      transform: `translate3d(0, ${offset}px, 0)`,
      willChange: "transform",
      opacity,
    }} />
  );
};

// ─── Floating Particle Component ────────────────────────────────
const FloatingParticles = ({ scrollY }) => {
  const particles = [
    { x: "10%", y: "20%", size: 4, speed: 0.08, color: COLORS.pink },
    { x: "85%", y: "30%", size: 3, speed: -0.05, color: COLORS.blue },
    { x: "70%", y: "60%", size: 5, speed: 0.12, color: COLORS.neonGreen },
    { x: "25%", y: "75%", size: 3, speed: -0.06, color: COLORS.pink },
    { x: "50%", y: "45%", size: 4, speed: 0.09, color: COLORS.blueLight },
    { x: "90%", y: "80%", size: 3, speed: -0.07, color: COLORS.pinkLight },
  ];
  return (
    <>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          background: p.color, opacity: 0.4,
          transform: `translate3d(0, ${scrollY * p.speed}px, 0)`,
          willChange: "transform",
          boxShadow: `0 0 ${p.size * 4}px ${p.color}66`,
        }} />
      ))}
    </>
  );
};

// ─── Navigation ──────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Schedule", id: "schedule" },
  { label: "Gallery", id: "gallery" },
  { label: "Contact", id: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? `${COLORS.bgDark}EE` : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
      transition: "all 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      padding: "0 24px",
      transform: scrolled ? "translateY(0)" : "translateY(0)",
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: "72px",
      }}>
        <div onClick={() => scrollTo("hero")} style={{ cursor: "pointer" }} role="button" tabIndex={0} aria-label="Go to top">
          <Logo size={44} />
        </div>

        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: COLORS.textSecondary, fontSize: "14px", fontWeight: 500,
              fontFamily: "'Inter', sans-serif", letterSpacing: "1px",
              textTransform: "uppercase", padding: "8px 4px",
              transition: "color 200ms ease",
            }}
              onMouseEnter={(e) => (e.target.style.color = COLORS.white)}
              onMouseLeave={(e) => (e.target.style.color = COLORS.textSecondary)}
            >{item.label}</button>
          ))}
          <a href="https://opensports.net" target="_blank" rel="noopener noreferrer" style={{
            background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.blue})`,
            color: COLORS.white, border: "none", borderRadius: "8px",
            padding: "10px 24px", fontSize: "14px", fontWeight: 600,
            fontFamily: "'Inter', sans-serif", letterSpacing: "0.5px",
            textDecoration: "none", cursor: "pointer",
            transition: "transform 200ms ease, box-shadow 200ms ease",
          }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 25px ${COLORS.pink}44`; }}
            onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >JOIN NOW</a>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none",
          color: COLORS.white, cursor: "pointer", padding: "8px",
        }} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <Icons.X /> : <Icons.Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div style={{
          position: "fixed", top: "72px", left: 0, right: 0, bottom: 0,
          background: `${COLORS.bgDark}F5`, backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "32px", zIndex: 999,
        }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => { scrollTo(item.id); setMobileOpen(false); }} style={{
              background: "none", border: "none", cursor: "pointer",
              color: COLORS.textPrimary, fontSize: "24px", fontWeight: 600,
              fontFamily: "'Oswald', sans-serif", letterSpacing: "3px", textTransform: "uppercase",
            }}>{item.label}</button>
          ))}
          <a href="https://opensports.net" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} style={{
            background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.blue})`,
            color: COLORS.white, borderRadius: "12px",
            padding: "16px 48px", fontSize: "18px", fontWeight: 700,
            fontFamily: "'Oswald', sans-serif", letterSpacing: "2px",
            textDecoration: "none", marginTop: "16px",
          }}>JOIN NOW</a>
        </div>
      )}
    </nav>
  );
};

// ─── Hero Section (Multi-layer Parallax) ─────────────────────────
const Hero = () => {
  const scrollY = useScrollY();
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  // Parallax speeds for different layers
  const bgOffset = scrollY * 0.4;
  const textOffset = scrollY * -0.15;
  const logoOffset = scrollY * -0.25;
  const statsOffset = scrollY * -0.08;
  const gridOffset = scrollY * 0.06;

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative", overflow: "hidden",
      background: COLORS.bgDark,
    }}>
      {/* Video Background */}
      <div style={{
        position: "absolute", inset: "-30% 0",
        transform: `translate3d(0, ${bgOffset}px, 0)`,
        willChange: "transform",
        overflow: "hidden",
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setImgLoaded(true)}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center",
            opacity: imgLoaded ? 0.45 : 0,
            transition: "opacity 1.5s ease",
            display: "block",
          }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg,
          ${COLORS.bgDark}BB 0%, ${COLORS.bgDark}77 30%,
          ${COLORS.bgDark}99 70%, ${COLORS.bgDark} 100%)`,
      }} />

      {/* Radial glow accents - slow parallax */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 20%, ${COLORS.pink}18 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 70%, ${COLORS.blue}10 0%, transparent 40%)`,
        transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
      }} />

      {/* Animated grid - opposite direction parallax */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${COLORS.white} 1px, transparent 1px),
                          linear-gradient(90deg, ${COLORS.white} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        transform: `translate3d(0, ${gridOffset}px, 0)`,
      }} />

      {/* Floating particles */}
      <FloatingParticles scrollY={scrollY} />

      {/* Soccer field decorative circles - parallax at different rates */}
      <div style={{
        position: "absolute", width: "300px", height: "300px",
        border: `2px solid ${COLORS.white}08`, borderRadius: "50%",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) translate3d(0, ${scrollY * -0.1}px, 0) rotate(${scrollY * 0.02}deg)`,
      }} />
      <div style={{
        position: "absolute", width: "500px", height: "500px",
        border: `1px solid ${COLORS.white}05`, borderRadius: "50%",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) translate3d(0, ${scrollY * 0.08}px, 0) rotate(${scrollY * -0.015}deg)`,
      }} />

      {/* Main content - moves up slightly on scroll */}
      <div style={{
        textAlign: "center", zIndex: 10, padding: "0 24px",
        opacity: visible ? Math.max(1 - scrollY / 700, 0) : 0,
        transform: visible
          ? `translate3d(0, ${textOffset}px, 0)`
          : "translate3d(0, 30px, 0)",
        transition: visible ? "none" : "all 800ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}>
        {/* Logo - floats at its own rate */}
        <div style={{
          margin: "0 auto 32px", display: "flex", justifyContent: "center",
          transform: `translate3d(0, ${logoOffset - textOffset}px, 0)`,
        }}>
          <img src={LOGOS.courtBallerPink} alt="21FC Court Baller Logo" style={{
            height: "160px", width: "auto", objectFit: "contain",
            filter: `drop-shadow(0 0 40px ${COLORS.pink}44)`,
            animation: "float 6s ease-in-out infinite",
          }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `<div style="width:120px;height:120px;border-radius:50%;margin:0 auto;
                background:linear-gradient(135deg,${COLORS.pink},${COLORS.pinkLight});
                display:flex;align-items:center;justify-content:center;
                font-size:36px;font-weight:800;color:white;
                font-family:Oswald,sans-serif;letter-spacing:-1px;
                box-shadow:0 0 60px rgba(233,30,140,0.2);">21FC</div>`;
            }}
          />
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: "14px",
          color: COLORS.pink, fontWeight: 600, letterSpacing: "4px",
          textTransform: "uppercase", marginBottom: "16px",
        }}>MEMBERS ONLY</p>

        <h1 style={{
          fontFamily: "'Oswald', sans-serif", fontWeight: 700,
          fontSize: "clamp(48px, 10vw, 96px)", lineHeight: 0.95,
          color: COLORS.white, margin: "0 0 24px", letterSpacing: "-1px",
        }}>
          ADULT PICKUP<br />
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.blue})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>SOCCER</span>
        </h1>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.6,
          color: COLORS.textSecondary, maxWidth: "500px", margin: "0 auto 40px",
        }}>
          Competitive. Community-driven. Clifton, NJ.<br />
          7AM games, four days a week. No excuses.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://opensports.net" target="_blank" rel="noopener noreferrer" style={{
            background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkLight})`,
            color: COLORS.white, border: "none", borderRadius: "12px",
            padding: "16px 40px", fontSize: "16px", fontWeight: 700,
            fontFamily: "'Oswald', sans-serif", letterSpacing: "2px",
            textDecoration: "none", cursor: "pointer",
            boxShadow: `0 4px 30px ${COLORS.pink}33`,
            transition: "transform 200ms ease, box-shadow 200ms ease",
            display: "inline-flex", alignItems: "center", gap: "8px",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = `0 8px 40px ${COLORS.pink}55`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = `0 4px 30px ${COLORS.pink}33`; }}
          >RESERVE YOUR SPOT <Icons.ArrowRight /></a>
          <button onClick={() => scrollTo("about")} style={{
            background: "transparent", color: COLORS.white, border: `2px solid ${COLORS.border}`,
            borderRadius: "12px", padding: "16px 32px", fontSize: "16px",
            fontWeight: 600, fontFamily: "'Inter', sans-serif",
            cursor: "pointer", transition: "all 200ms ease",
          }}
            onMouseEnter={(e) => { e.target.style.borderColor = COLORS.pink; e.target.style.color = COLORS.pink; }}
            onMouseLeave={(e) => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.white; }}
          >Learn More</button>
        </div>

        {/* Stats - own parallax layer */}
        <div style={{
          display: "flex", gap: "48px", justifyContent: "center",
          marginTop: "64px", flexWrap: "wrap",
          transform: `translate3d(0, ${statsOffset - textOffset}px, 0)`,
        }}>
          {[
            { num: "3,400+", label: "Community Members" },
            { num: "4x", label: "Games Per Week" },
            { num: "7AM", label: "Early Bird Kickoff" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "32px", fontWeight: 700, color: COLORS.white }}>{stat.num}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.textMuted, letterSpacing: "1px", textTransform: "uppercase" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div onClick={() => scrollTo("about")} role="button" tabIndex={0} aria-label="Scroll down" style={{
        position: "absolute", bottom: "32px", left: "50%",
        transform: "translateX(-50%)", cursor: "pointer",
        animation: "bounce 2s infinite", color: COLORS.textMuted,
      }}><Icons.ChevronDown /></div>
    </section>
  );
};

// ─── About Section (scroll-reveal + parallax accents) ────────────
const About = () => {
  const scrollY = useScrollY();
  const [headerRef, headerVisible] = useReveal();
  const [bannerRef, bannerVisible] = useReveal(0.1);
  const [gridRef, gridVisible] = useReveal(0.05);

  const features = [
    { icon: <Icons.Trophy />, title: "Competitive Edge", desc: "Former college and semi-pro players. Every game matters. Bring your best." },
    { icon: <Icons.Users />, title: "Real Community", desc: "More than pickup — it's a crew. Co-ed, diverse, all united by the love of the game." },
    { icon: <Icons.Clock />, title: "Early Bird Grind", desc: "7AM kickoff. Start your day right. Mon, Wed, Fri & Sun on indoor turf." },
    { icon: <Icons.Shield />, title: "Members Only", desc: "Curated roster. Consistent quality. Sign up through OpenSports to lock in your spot." },
    { icon: <Icons.Zap />, title: "Indoor Turf", desc: "Year-round play on premium indoor fields in Clifton, NJ. Rain or shine, we play." },
    { icon: <Icons.MapPin />, title: "Clifton, NJ", desc: "Centrally located and easy to get to. The home pitch for North Jersey ballers." },
  ];

  return (
    <section id="about" style={{
      padding: "120px 24px", background: COLORS.bgDark,
      borderTop: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden",
    }}>
      {/* Floating accent orb */}
      <div style={{
        position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.pink}08, transparent 70%)`,
        top: "10%", right: "-10%",
        transform: `translate3d(0, ${(scrollY - 600) * 0.1}px, 0)`,
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Section Header with scroll-reveal */}
        <div ref={headerRef} style={{
          textAlign: "center", marginBottom: "64px",
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 40px, 0)",
          transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "13px",
            color: COLORS.pink, fontWeight: 600, letterSpacing: "3px",
            textTransform: "uppercase", marginBottom: "12px",
          }}>ABOUT THE CLUB</p>
          <h2 style={{
            fontFamily: "'Oswald', sans-serif", fontWeight: 700,
            fontSize: "clamp(36px, 6vw, 56px)", color: COLORS.white,
            margin: "0 0 20px", lineHeight: 1.1,
          }}>THIS ISN'T YOUR<br /><span style={{ color: COLORS.pink }}>AVERAGE REC LEAGUE</span></h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.7,
            color: COLORS.textSecondary, maxWidth: "600px", margin: "0 auto",
          }}>21FC is an adult pickup soccer community built for players who take the game seriously but never forget it's supposed to be fun.</p>
        </div>

        {/* Player Spotlight Banner with parallax image shift */}
        <div ref={bannerRef} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "24px", marginBottom: "64px", borderRadius: "20px", overflow: "hidden",
          opacity: bannerVisible ? 1 : 0,
          transform: bannerVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 60px, 0)",
          transition: "all 800ms cubic-bezier(0.16, 1, 0.3, 1) 100ms",
        }} className="about-banner">
          {[
            { src: PHOTOS.playerBlueNeon, label: "PLAYER SPOTLIGHT", color: COLORS.neonGreen, dir: 1 },
            { src: PHOTOS.heroBlue, label: "GAME DAY ENERGY", color: COLORS.pink, dir: -1 },
          ].map((panel) => (
            <div key={panel.label} style={{
              position: "relative", borderRadius: "20px", overflow: "hidden",
              minHeight: "300px", background: COLORS.navy,
            }}>
              <img src={panel.src} alt={panel.label} style={{
                width: "100%", height: "120%", objectFit: "cover", objectPosition: "center top",
                position: "absolute", top: "-10%",
                transform: `translate3d(0, ${(scrollY - 800) * 0.06 * panel.dir}px, 0)`,
                willChange: "transform",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: `linear-gradient(transparent, ${COLORS.bgDark})`,
                padding: "40px 24px 24px",
              }}>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: "18px",
                  fontWeight: 600, color: panel.color, letterSpacing: "2px",
                }}>{panel.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Grid with staggered reveal */}
        <div ref={gridRef} style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px",
        }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              background: COLORS.bgCard, borderRadius: "16px",
              padding: "32px", border: `1px solid ${COLORS.border}`,
              transition: `all 250ms ease, opacity 600ms ease ${i * 80}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
              cursor: "default",
              opacity: gridVisible ? 1 : 0,
              transform: gridVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 30px, 0)",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.pink + "44";
                e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
                e.currentTarget.style.boxShadow = `0 16px 50px ${COLORS.pink}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                background: `${COLORS.pink}15`, display: "flex",
                alignItems: "center", justifyContent: "center",
                color: COLORS.pink, marginBottom: "16px",
                transition: "transform 300ms ease",
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: "20px", color: COLORS.white, margin: "0 0 8px", letterSpacing: "0.5px" }}>{f.title}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: COLORS.textSecondary, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Schedule Section (parallax bg + staggered cards) ────────────
const Schedule = () => {
  const scrollY = useScrollY();
  const [ref, visible] = useReveal(0.1);
  const sectionRef = useRef(null);

  const days = [
    { day: "Monday", time: "7:00 AM", type: "Competitive", spots: "Open" },
    { day: "Wednesday", time: "7:00 AM", type: "Competitive", spots: "Open" },
    { day: "Friday", time: "7:00 AM", type: "Community", spots: "Open" },
    { day: "Sunday", time: "7:00 AM", type: "Competitive", spots: "Open" },
  ];

  return (
    <section id="schedule" ref={sectionRef} style={{
      padding: "120px 24px", position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, ${COLORS.bgDark}, #0D1321)`,
    }}>
      {/* Parallax background photo */}
      <div style={{
        position: "absolute", inset: "-30% 0",
        backgroundImage: `url(${PHOTOS.goldAction})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.08,
        transform: `translate3d(0, ${(scrollY - 1800) * 0.15}px, 0)`,
        willChange: "transform",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, ${COLORS.bgDark} 0%, transparent 20%, transparent 80%, #0D1321 100%)`,
      }} />

      <div ref={ref} style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{
          textAlign: "center", marginBottom: "64px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 40px, 0)",
          transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.pink, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>GAME SCHEDULE</p>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 6vw, 56px)", color: COLORS.white, margin: "0 0 20px", lineHeight: 1.1 }}>
            WHEN WE <span style={{ color: COLORS.pink }}>PLAY</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.7, color: COLORS.textSecondary, maxWidth: "500px", margin: "0 auto" }}>
            Four games a week. All indoor turf. All 7AM. Reserve your spot on OpenSports before it fills up.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {days.map((d, i) => (
            <div key={d.day} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: `${COLORS.bgCard}DD`, backdropFilter: "blur(8px)",
              borderRadius: "16px", padding: "24px 32px", border: `1px solid ${COLORS.border}`,
              flexWrap: "wrap", gap: "16px",
              transition: `all 200ms ease, opacity 500ms ease ${i * 100}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 100}ms`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translate3d(0, 0, 0)" : "translate3d(-30px, 0, 0)",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.pink + "44"; e.currentTarget.style.transform = "translate3d(8px, 0, 0)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translate3d(0, 0, 0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: `${COLORS.blue}15`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.blueLight,
                }}><Icons.Calendar /></div>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 600, color: COLORS.white, letterSpacing: "0.5px" }}>{d.day}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: COLORS.textMuted }}>{d.time} &middot; {d.type}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.success, fontWeight: 600,
                  background: `${COLORS.success}15`, padding: "6px 16px", borderRadius: "100px",
                }}>{d.spots}</span>
                <a href="https://opensports.net" target="_blank" rel="noopener noreferrer" style={{
                  background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.blue})`,
                  color: COLORS.white, border: "none", borderRadius: "10px",
                  padding: "10px 24px", fontSize: "13px", fontWeight: 600,
                  fontFamily: "'Inter', sans-serif", textDecoration: "none",
                  cursor: "pointer", letterSpacing: "0.5px",
                  transition: "transform 200ms ease", whiteSpace: "nowrap",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0) scale(1)"}
                >Reserve Spot</a>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: "center", marginTop: "48px", display: "flex", alignItems: "center",
          justifyContent: "center", gap: "8px", color: COLORS.textMuted,
          fontFamily: "'Inter', sans-serif", fontSize: "15px",
        }}><Icons.MapPin /><span>Indoor Turf &middot; Clifton, NJ</span></div>
      </div>
    </section>
  );
};

// ─── Gallery Section (masonry + hover parallax tilt) ─────────────
const GalleryCard = ({ img, index, visible }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        aspectRatio: img.span ? "auto" : "1",
        borderRadius: "16px", overflow: "hidden", position: "relative",
        border: `1px solid ${COLORS.border}`,
        transition: `transform 200ms ease, border-color 200ms ease, opacity 600ms ease ${index * 70}ms, translate 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms`,
        cursor: "pointer", gridRow: img.span ? "span 2" : undefined,
        background: COLORS.navy,
        opacity: visible ? 1 : 0,
        translate: visible ? "0 0" : "0 40px",
        transform: `perspective(600px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
      }}
    >
      <img src={img.src} alt={img.caption} loading="lazy" style={{
        width: "100%", height: "100%", objectFit: "cover", display: "block",
        transition: "transform 400ms ease",
        transform: `scale(1.05) translate(${tilt.x * -0.5}px, ${tilt.y * 0.5}px)`,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: `linear-gradient(transparent, ${COLORS.bgDark}EE)`,
        padding: "40px 16px 16px",
        opacity: Math.abs(tilt.x) > 1 || Math.abs(tilt.y) > 1 ? 1 : 0,
        transition: "opacity 250ms ease",
      }}>
        <span style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "14px",
          fontWeight: 600, color: COLORS.white, letterSpacing: "2px", textTransform: "uppercase",
        }}>{img.caption}</span>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [ref, visible] = useReveal(0.05);
  const [headerRef, headerVisible] = useReveal();

  const images = [
    { src: PHOTOS.redKitPlayer1, caption: "Red Kit Energy", span: true },
    { src: PHOTOS.heroGreen, caption: "Game Day Action" },
    { src: PHOTOS.playerPortrait1, caption: "Player Spotlight" },
    { src: PHOTOS.heroBlue, caption: "Blue Neon Vibes" },
    { src: PHOTOS.goldAction, caption: "Gold Hour" },
    { src: PHOTOS.actionWide, caption: "On the Pitch" },
    { src: PHOTOS.redKitPlayer2, caption: "21FC Crew" },
    { src: PHOTOS.playerPortrait2, caption: "Portrait Series" },
    { src: PHOTOS.playerBlueNeon, caption: "Under the Lights" },
  ];

  return (
    <section id="gallery" style={{
      padding: "120px 24px", background: COLORS.bgDark,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div ref={headerRef} style={{
          textAlign: "center", marginBottom: "64px",
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 40px, 0)",
          transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.pink, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>THE CULTURE</p>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 6vw, 56px)", color: COLORS.white, margin: "0 0 20px", lineHeight: 1.1 }}>
            LIFE AT <span style={{ color: COLORS.pink }}>21FC</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.7, color: COLORS.textSecondary, maxWidth: "500px", margin: "0 auto" }}>
            Professional photo shoots, branded gear, and non-stop action. This is more than pickup soccer.
          </p>
        </div>

        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {images.map((img, i) => (
            <GalleryCard key={i} img={img} index={i} visible={visible} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <a href="https://www.instagram.com/21fc.soccer" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
            borderRadius: "12px", padding: "14px 32px",
            color: COLORS.white, textDecoration: "none",
            fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 500,
            transition: "all 200ms ease",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.pink; e.currentTarget.style.color = COLORS.pink; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.white; e.currentTarget.style.transform = "translateY(0)"; }}
          ><Icons.Instagram /> Follow @21fc.soccer</a>
        </div>
      </div>
    </section>
  );
};

// ─── Infinite Auto-Scrolling Carousel ───────────────────────────
const InfiniteCarousel = () => {
  const row1 = [
    { src: PHOTOS.heroGreen, caption: "Game Day" },
    { src: PHOTOS.playerBlueNeon, caption: "Under the Lights" },
    { src: PHOTOS.goldAction, caption: "Gold Hour" },
    { src: PHOTOS.redKitPlayer1, caption: "Red Kit" },
    { src: PHOTOS.actionWide, caption: "On the Pitch" },
    { src: PHOTOS.playerPortrait2, caption: "Player Spotlight" },
  ];
  const row2 = [
    { src: PHOTOS.heroBlue, caption: "Blue Neon" },
    { src: PHOTOS.playerPortrait1, caption: "Portrait Series" },
    { src: PHOTOS.redKitPlayer2, caption: "21FC Crew" },
    { src: PHOTOS.goldAction, caption: "Action" },
    { src: PHOTOS.playerBlueNeon, caption: "Night Game" },
    { src: PHOTOS.heroGreen, caption: "Turf Life" },
  ];

  const CarouselRow = ({ imgs, reverse }) => {
    const doubled = [...imgs, ...imgs, ...imgs];
    return (
      <div style={{ overflow: "hidden", marginBottom: "12px", position: "relative" }}>
        <div style={{
          display: "flex", gap: "12px",
          width: "max-content",
          animation: `${reverse ? "marqueeReverse" : "marquee"} ${reverse ? 38 : 32}s linear infinite`,
        }}>
          {doubled.map((img, i) => (
            <div key={i} style={{
              width: "280px", height: "190px", borderRadius: "12px",
              overflow: "hidden", flexShrink: 0, position: "relative",
              border: `1px solid ${COLORS.border}`,
            }}>
              <img src={img.src} alt={img.caption} loading="lazy" style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(transparent 50%, ${COLORS.bgDark}99)`,
              }} />
              <span style={{
                position: "absolute", bottom: "10px", left: "12px",
                fontFamily: "'Oswald', sans-serif", fontSize: "11px",
                fontWeight: 600, color: COLORS.white, letterSpacing: "2px",
                textTransform: "uppercase", opacity: 0.85,
              }}>{img.caption}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section style={{
      padding: "60px 0 80px", background: COLORS.bgDark, overflow: "hidden",
    }}>
      <CarouselRow imgs={row1} reverse={false} />
      <CarouselRow imgs={row2} reverse={true} />
    </section>
  );
};

// ─── Membership & Pricing ────────────────────────────────────────
const Membership = () => {
  const [ref, visible] = useReveal(0.05);
  const [headerRef, headerVisible] = useReveal();
  const [hovered, setHovered] = useState(null);

  const tiers = [
    {
      name: "Drop-In",
      price: "$25",
      period: "per session",
      accent: COLORS.blue,
      popular: false,
      features: [
        "Single session access",
        "All skill levels welcome",
        "Book via OpenSports",
        "Indoor turf facility",
        "No commitment required",
      ],
      cta: "Book a Session",
    },
    {
      name: "Monthly",
      price: "$89",
      period: "per month",
      accent: COLORS.pink,
      popular: true,
      features: [
        "Unlimited weekly sessions",
        "Priority booking window",
        "21FC kit discount (10%)",
        "Members WhatsApp group",
        "Guest pass (1×/month)",
        "Cancel anytime",
      ],
      cta: "Join Monthly",
    },
    {
      name: "Annual",
      price: "$799",
      period: "per year",
      accent: COLORS.neonGreen,
      popular: false,
      features: [
        "Everything in Monthly",
        "Founding member badge",
        "Guest passes (2×/month)",
        "Early access to new sessions",
        "Annual team photo shoot",
        "Best value — save $269",
      ],
      cta: "Go Annual",
    },
  ];

  return (
    <section id="membership" style={{
      padding: "120px 24px",
      background: `linear-gradient(180deg, ${COLORS.bgDark}, #0D1321)`,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div ref={headerRef} style={{
          textAlign: "center", marginBottom: "64px",
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 40px, 0)",
          transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.pink, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>JOIN THE CLUB</p>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 6vw, 56px)", color: COLORS.white, margin: "0 0 20px", lineHeight: 1.1 }}>
            MEMBERSHIP <span style={{ color: COLORS.pink }}>OPTIONS</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.7, color: COLORS.textSecondary, maxWidth: "520px", margin: "0 auto" }}>
            Spots fill fast. Pick the plan that fits your game and lock in your spot before it's gone.
          </p>
        </div>

        <div ref={ref} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px", alignItems: "start",
        }}>
          {tiers.map((tier, i) => {
            const isHovered = hovered === i;
            return (
              <div key={tier.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: tier.popular ? `linear-gradient(145deg, ${COLORS.bgCard}, #1a1a2e)` : COLORS.bgCard,
                  borderRadius: "20px", padding: "36px 32px",
                  border: `2px solid ${tier.popular || isHovered ? tier.accent : COLORS.border}`,
                  position: "relative", overflow: "hidden",
                  transform: `scale(${tier.popular ? 1.04 : 1}) translateY(${isHovered ? "-6px" : "0"})`,
                  transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: (tier.popular || isHovered) ? `0 20px 60px ${tier.accent}22` : "none",
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${i * 100}ms`,
                  cursor: "pointer",
                }}
              >
                {tier.popular && (
                  <div style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkLight})`,
                    color: COLORS.white, fontSize: "10px", fontWeight: 700,
                    fontFamily: "'Oswald', sans-serif", letterSpacing: "2px",
                    padding: "4px 12px", borderRadius: "20px", textTransform: "uppercase",
                  }}>MOST POPULAR</div>
                )}

                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "14px", color: tier.accent, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>{tier.name}</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "52px", fontWeight: 700, color: COLORS.white, lineHeight: 1 }}>{tier.price}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: COLORS.textMuted }}>{tier.period}</span>
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "24px", marginBottom: "32px" }}>
                  {tier.features.map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <div style={{
                        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                        background: `${tier.accent}22`, border: `1px solid ${tier.accent}66`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke={tier.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: tier.popular ? COLORS.textPrimary : COLORS.textSecondary }}>{f}</span>
                    </div>
                  ))}
                </div>

                <a href="https://opensports.net" target="_blank" rel="noopener noreferrer" style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  background: tier.popular ? `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkLight})` : "transparent",
                  color: tier.popular ? COLORS.white : tier.accent,
                  border: `2px solid ${tier.popular ? "transparent" : tier.accent}`,
                  borderRadius: "12px", padding: "14px",
                  fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700,
                  letterSpacing: "2px", textTransform: "uppercase",
                  transition: "all 200ms ease",
                }}
                  onMouseEnter={(e) => {
                    if (!tier.popular) { e.currentTarget.style.background = `${tier.accent}22`; }
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    if (!tier.popular) { e.currentTarget.style.background = "transparent"; }
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >{tier.cta} →</a>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.textMuted, marginTop: "32px" }}>
          * Pricing is indicative — confirm current rates on OpenSports when booking.
        </p>
      </div>
    </section>
  );
};

// ─── Testimonials (staggered card reveal) ────────────────────────
const Testimonials = () => {
  const [ref, visible] = useReveal(0.1);
  const [headerRef, headerVisible] = useReveal();

  const quotes = [
    { text: "Best pickup soccer I've found in Jersey. The quality of play is unmatched and the community is like family.", name: "Marco R.", role: "Member since 2023" },
    { text: "I used to play in college and missed having a competitive outlet. 21FC gave me that back. 7AM games are the best way to start the day.", name: "Sarah K.", role: "Felician University Alum" },
    { text: "The vibe here is different. Everyone's competitive but respectful. I've made real friends through this club.", name: "James T.", role: "Member since 2024" },
  ];

  return (
    <section style={{
      padding: "120px 24px",
      background: `linear-gradient(180deg, #0D1321, ${COLORS.bgDark})`,
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div ref={headerRef} style={{
          textAlign: "center", marginBottom: "64px",
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 40px, 0)",
          transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.pink, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>WHAT PLAYERS SAY</p>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 6vw, 56px)", color: COLORS.white, margin: 0, lineHeight: 1.1 }}>
            THE <span style={{ color: COLORS.pink }}>WORD</span> ON THE PITCH
          </h2>
        </div>

        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {quotes.map((q, i) => (
            <div key={q.name} style={{
              background: COLORS.bgCard, borderRadius: "16px",
              padding: "32px", border: `1px solid ${COLORS.border}`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 30px, 0) scale(0.95)",
              transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
            }}>
              <div style={{ display: "flex", gap: "4px", marginBottom: "16px", color: COLORS.pink }}>
                {[...Array(5)].map((_, j) => <Icons.Star key={j} />)}
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.7, color: COLORS.textSecondary, margin: "0 0 24px", fontStyle: "italic" }}>"{q.text}"</p>
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: "16px", fontWeight: 600, color: COLORS.white }}>{q.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.textMuted }}>{q.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CTA Banner (parallax + pulse glow) ──────────────────────────
const CTABanner = () => {
  const scrollY = useScrollY();
  const [ref, visible] = useReveal(0.2);

  return (
    <section style={{
      padding: "120px 24px", position: "relative", overflow: "hidden",
      background: COLORS.bgDark,
    }}>
      <div style={{
        position: "absolute", inset: "-30% 0",
        backgroundImage: `url(${PHOTOS.actionWide})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.18,
        transform: `translate3d(0, ${(scrollY - 3800) * 0.12}px, 0)`,
        willChange: "transform",
      }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${COLORS.pink}25, ${COLORS.blue}18)` }} />
      {/* Animated glow pulse */}
      <div style={{
        position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.pink}15, transparent 70%)`,
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        animation: "pulse 4s ease-in-out infinite",
      }} />

      <div ref={ref} style={{
        maxWidth: "700px", margin: "0 auto", textAlign: "center",
        position: "relative", zIndex: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0) scale(1)" : "translate3d(0, 30px, 0) scale(0.96)",
        transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 6vw, 56px)", color: COLORS.white, margin: "0 0 16px", lineHeight: 1.1 }}>
          READY TO <span style={{ color: COLORS.neonGreen }}>PLAY</span>?
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.7, color: COLORS.textSecondary, margin: "0 0 40px" }}>
          Spots fill fast. Reserve yours on OpenSports and join the best pickup soccer community in North Jersey.
        </p>
        <a href="https://opensports.net" target="_blank" rel="noopener noreferrer" style={{
          background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkLight})`,
          color: COLORS.white, border: "none", borderRadius: "12px",
          padding: "18px 48px", fontSize: "18px", fontWeight: 700,
          fontFamily: "'Oswald', sans-serif", letterSpacing: "2px",
          textDecoration: "none", cursor: "pointer",
          boxShadow: `0 4px 30px ${COLORS.pink}44`,
          transition: "transform 200ms ease, box-shadow 200ms ease",
          display: "inline-flex", alignItems: "center", gap: "10px",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.03)"; e.currentTarget.style.boxShadow = `0 12px 50px ${COLORS.pink}66`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = `0 4px 30px ${COLORS.pink}44`; }}
        >JOIN 21FC NOW <Icons.ArrowRight /></a>
      </div>
    </section>
  );
};

// ─── Contact Section ─────────────────────────────────────────────
const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ref, visible] = useReveal(0.1);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  const inputStyle = {
    width: "100%", padding: "14px 18px", fontSize: "16px",
    fontFamily: "'Inter', sans-serif", background: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`, borderRadius: "12px",
    color: COLORS.white, outline: "none", boxSizing: "border-box",
    transition: "border-color 200ms ease, box-shadow 200ms ease",
  };

  return (
    <section id="contact" style={{ padding: "120px 24px", background: COLORS.bgDark, borderTop: `1px solid ${COLORS.border}` }}>
      <div ref={ref} style={{
        maxWidth: "600px", margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 40px, 0)",
        transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.pink, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>GET IN TOUCH</p>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 6vw, 56px)", color: COLORS.white, margin: "0 0 20px", lineHeight: 1.1 }}>
            WANT IN<span style={{ color: COLORS.pink }}>?</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", lineHeight: 1.7, color: COLORS.textSecondary }}>
            Drop us a message or hit us up on Instagram. We'll get you on the pitch.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { id: "name", type: "text", label: "Name" },
            { id: "email", type: "email", label: "Email" },
          ].map(({ id, type, label }) => (
            <div key={id}>
              <label htmlFor={id} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.textMuted, fontWeight: 500, display: "block", marginBottom: "6px" }}>{label}</label>
              <input id={id} type={type} required style={inputStyle} value={formData[id]}
                onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                onFocus={(e) => { e.target.style.borderColor = COLORS.pink; e.target.style.boxShadow = `0 0 0 3px ${COLORS.pink}22`; }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
          ))}
          <div>
            <label htmlFor="message" style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.textMuted, fontWeight: 500, display: "block", marginBottom: "6px" }}>Message</label>
            <textarea id="message" rows={5} required style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }} value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              onFocus={(e) => { e.target.style.borderColor = COLORS.pink; e.target.style.boxShadow = `0 0 0 3px ${COLORS.pink}22`; }}
              onBlur={(e) => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <button type="submit" style={{
            background: submitted ? COLORS.success : `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.blue})`,
            color: COLORS.white, border: "none", borderRadius: "12px",
            padding: "16px", fontSize: "16px", fontWeight: 700,
            fontFamily: "'Oswald', sans-serif", letterSpacing: "2px",
            cursor: "pointer", marginTop: "8px",
            transition: "all 250ms ease",
            transform: submitted ? "scale(1.02)" : "scale(1)",
          }}>{submitted ? "MESSAGE SENT!" : "SEND MESSAGE"}</button>
        </form>

        <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "48px", flexWrap: "wrap" }}>
          {[
            { href: "https://www.instagram.com/21fc.soccer", icon: <Icons.Instagram />, text: "@21fc.soccer" },
            { href: "mailto:hello@21fc.soccer", icon: <Icons.Mail />, text: "hello@21fc.soccer" },
          ].map(link => (
            <a key={link.text} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: "8px",
              color: COLORS.textSecondary, textDecoration: "none",
              fontFamily: "'Inter', sans-serif", fontSize: "15px",
              transition: "color 200ms ease, transform 200ms ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.pink; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textSecondary; e.currentTarget.style.transform = "translateY(0)"; }}
            >{link.icon} {link.text}</a>
          ))}
        </div>

        {/* Location / Map */}
        <div style={{ marginTop: "56px" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.pink, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", textAlign: "center", marginBottom: "24px" }}>FIND US</p>
          <div style={{
            borderRadius: "16px", overflow: "hidden",
            border: `1px solid ${COLORS.border}`,
            boxShadow: `0 8px 40px ${COLORS.navy}`,
          }}>
            <iframe
              title="21FC Location — Clifton, NJ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48338.1!2d-74.1637!3d40.8584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f9b4b5cc7c6b%3A0xa27b78b5b3bfc7e!2sClifton%2C%20NJ!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="240"
              style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "14px", color: COLORS.textMuted, marginTop: "12px" }}>
            Indoor turf facility · Clifton, NJ
          </p>
        </div>
      </div>
    </section>
  );
};

// ─── Newsletter / Email Capture ──────────────────────────────────
const NewsletterBar = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sent | error
  const [ref, visible] = useReveal(0.1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sent");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section style={{
      padding: "80px 24px",
      background: `linear-gradient(135deg, ${COLORS.navy}, #0d1321)`,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div ref={ref} style={{
        maxWidth: "560px", margin: "0 auto", textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, 40px, 0)",
        transition: "all 700ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: `${COLORS.pink}18`, border: `1px solid ${COLORS.pink}44`,
          borderRadius: "20px", padding: "6px 14px", marginBottom: "20px",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.pink}><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.7l-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/></svg>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: "11px", color: COLORS.pink, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>Stay in the Loop</span>
        </div>

        <h2 style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 5vw, 42px)", color: COLORS.white, margin: "0 0 12px", lineHeight: 1.1 }}>
          NEVER MISS A <span style={{ color: COLORS.neonGreen }}>SESSION</span>
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", lineHeight: 1.7, color: COLORS.textSecondary, marginBottom: "32px" }}>
          Spots fill fast. Get notified when new sessions open and be first in line.
        </p>

        {status === "sent" ? (
          <div style={{
            background: `${COLORS.success}18`, border: `1px solid ${COLORS.success}44`,
            borderRadius: "12px", padding: "20px 32px",
            fontFamily: "'Oswald', sans-serif", fontSize: "18px", color: COLORS.success,
            letterSpacing: "1px",
          }}>
            ✓ YOU'RE ON THE LIST — SEE YOU ON THE PITCH!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <input
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: "1 1 220px", padding: "14px 20px", fontSize: "16px",
                fontFamily: "'Inter', sans-serif", background: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`, borderRadius: "12px",
                color: COLORS.white, outline: "none",
                transition: "border-color 200ms ease, box-shadow 200ms ease",
              }}
              onFocus={(e) => { e.target.style.borderColor = COLORS.pink; e.target.style.boxShadow = `0 0 0 3px ${COLORS.pink}22`; }}
              onBlur={(e) => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = "none"; }}
            />
            <button type="submit" style={{
              background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkLight})`,
              color: COLORS.white, border: "none", borderRadius: "12px",
              padding: "14px 28px", fontSize: "15px", fontWeight: 700,
              fontFamily: "'Oswald', sans-serif", letterSpacing: "2px",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "transform 200ms ease, box-shadow 200ms ease",
              boxShadow: `0 4px 20px ${COLORS.pink}33`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${COLORS.pink}55`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 20px ${COLORS.pink}33`; }}
            >NOTIFY ME</button>
          </form>
        )}
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: COLORS.textMuted, marginTop: "16px" }}>
          No spam. Just game alerts. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

// ─── Footer ──────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ padding: "48px 24px", background: "#060810", borderTop: `1px solid ${COLORS.border}` }}>
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "24px", marginBottom: "32px",
      }}>
        <Logo size={32} variant="grey" />

        <nav style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
          {[
            { label: "About", href: "#about" },
            { label: "Schedule", href: "#schedule" },
            { label: "Gallery", href: "#gallery" },
            { label: "Membership", href: "#membership" },
            { label: "Contact", href: "#contact" },
          ].map(link => (
            <a key={link.label} href={link.href} style={{
              fontFamily: "'Inter', sans-serif", fontSize: "13px",
              color: COLORS.textMuted, textDecoration: "none",
              transition: "color 200ms ease",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; }}
            >{link.label}</a>
          ))}
        </nav>

        <a href="https://www.instagram.com/21fc.soccer" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
          style={{ color: COLORS.textMuted, transition: "color 200ms ease, transform 200ms ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.pink; e.currentTarget.style.transform = "scale(1.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.transform = "scale(1)"; }}
        ><Icons.Instagram /></a>
      </div>
      <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.textMuted, margin: 0 }}>
          &copy; 2026 21FC Soccer Club · Clifton, NJ · Members Only
        </p>
        <a href="mailto:hello@21fc.soccer" style={{
          fontFamily: "'Inter', sans-serif", fontSize: "13px", color: COLORS.textMuted,
          textDecoration: "none", transition: "color 200ms ease",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.pink; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.textMuted; }}
        >hello@21fc.soccer</a>
      </div>
    </div>
  </footer>
);

// ─── Global Styles ───────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: ${COLORS.bgDark};
      color: ${COLORS.textPrimary};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ::selection { background: ${COLORS.pink}44; color: ${COLORS.white}; }
    :focus-visible { outline: 2px solid ${COLORS.pink}; outline-offset: 2px; }

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.333%); }
    }
    @keyframes marqueeReverse {
      0% { transform: translateX(-33.333%); }
      100% { transform: translateX(0); }
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    @keyframes pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.2; }
    }

    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-menu-btn { display: block !important; }
      .about-banner { grid-template-columns: 1fr !important; }
    }
    @media (min-width: 769px) {
      .mobile-menu-btn { display: none !important; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `}</style>
);

// ─── Main App ────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Schedule />
        <Gallery />
        <InfiniteCarousel />
        <Membership />
        <Testimonials />
        <CTABanner />
        <Contact />
      </main>
      <NewsletterBar />
      <Footer />
    </>
  );
}
