import { useState, useEffect, useRef, useCallback } from 'react';

const BASE = import.meta.env.BASE_URL;

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [splashDone, setSplashDone] = useState(false);
  const [splashFading, setSplashFading] = useState(false);

  const c = {
    pink: '#ED1171', black: '#000', volt: '#D3DE25',
    white: '#F0EFEF', bg: '#0A0A14', card: '#111118', muted: '#9BA3A3',
  };
  const font = "'Red Hat Display', sans-serif";
  const ease = 'cubic-bezier(.25,.46,.45,.94)';

  const heroSlides = [
    { src: BASE + 'images/DSC08619.jpg', pos: 'center 20%' },
    { src: BASE + 'images/DSC08800.jpg', pos: 'center 25%' },
    { src: BASE + 'images/DSC08641.jpg', pos: 'center 30%' },
    { src: BASE + 'images/DSC08674.jpg', pos: 'center 25%' },
    { src: BASE + 'images/DSC08823.jpg', pos: 'center 20%' },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(p => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let tick = false;
    const fn = () => { if (!tick) { requestAnimationFrame(() => { setScrollY(window.scrollY); tick = false; }); tick = true; } };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Splash — FAST: 1.5s total
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const f1 = setTimeout(() => setSplashFading(true), 1200);
    const f2 = setTimeout(() => { setSplashDone(true); document.body.style.overflow = ''; }, 1800);
    return () => { clearTimeout(f1); clearTimeout(f2); };
  }, []);

  // ── CSS ──
  const css = `
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:${font};background:${c.bg};color:${c.white};overflow-x:hidden}
    @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @keyframes heroSlow{0%{transform:scale(1)}100%{transform:scale(1.04)}}
    @keyframes up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
    @keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(237,17,113,.2)}50%{box-shadow:0 0 50px rgba(237,17,113,.45)}}
    @keyframes ctaGlow{0%,100%{box-shadow:0 0 20px rgba(237,17,113,.3),0 0 60px rgba(237,17,113,.08)}50%{box-shadow:0 0 40px rgba(237,17,113,.5),0 0 80px rgba(237,17,113,.15)}}
    @keyframes splashLogo{0%{opacity:0;transform:scale(.7)}50%{opacity:1;transform:scale(1.02)}100%{opacity:1;transform:scale(1)}}
    @keyframes splashText{0%{opacity:0;letter-spacing:12px}100%{opacity:1;letter-spacing:6px}}
    @keyframes splashLine{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
    @keyframes scrollLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes scrollRight{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}

    /* REVEAL SYSTEM — CSS driven, no JS opacity needed */
    .reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ${ease},transform .7s ${ease}}
    .reveal.visible{opacity:1;transform:translateY(0)}
    .reveal-d1{transition-delay:.08s}
    .reveal-d2{transition-delay:.16s}
    .reveal-d3{transition-delay:.24s}
    .reveal-d4{transition-delay:.32s}
    .reveal-d5{transition-delay:.4s}

    @media(max-width:900px){
      .grid-2col{grid-template-columns:1fr!important}
      .grid-4col{grid-template-columns:repeat(2,1fr)!important}
      .grid-3col{grid-template-columns:1fr!important}
      .gallery-grid{grid-template-columns:repeat(2,1fr)!important}
      .gallery-grid>*{grid-column:auto!important;grid-row:auto!important}
      .nav-links{display:none!important}
      .hero-title{font-size:clamp(40px,12vw,80px)!important}
      .hero-sub{font-size:clamp(24px,7vw,50px)!important}
      .cta-title{font-size:clamp(28px,8vw,56px)!important}
    }
    @media(max-width:600px){
      .grid-4col{grid-template-columns:1fr!important}
      .gallery-grid{grid-template-columns:1fr!important}
    }
  `;

  // ── Reveal observer — robust, re-observes on every render ──
  const observerRef = useRef(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  });

  // ═══ SPLASH — fast, minimal ═══
  const Splash = () => (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,background:c.bg,
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      opacity:splashFading?0:1,transition:'opacity .6s ease-in-out',
      pointerEvents:splashFading?'none':'all',
    }}>
      <div style={{position:'absolute',width:'300px',height:'300px',
        background:'radial-gradient(circle, rgba(237,17,113,.1) 0%, transparent 70%)',borderRadius:'50%'}}/>
      <img src={BASE+"images/logo-full-white.png"} alt="21FC"
        style={{height:'clamp(70px,16vw,120px)',width:'auto',position:'relative',
          animation:'splashLogo .8s cubic-bezier(.16,1,.3,1) forwards',
          filter:'drop-shadow(0 0 40px rgba(237,17,113,.2))',
        }}/>
      <div style={{width:'50px',height:'2px',background:c.pink,margin:'1.2rem 0 1rem',
        animation:'splashLine .4s ease-out .4s both',transformOrigin:'center'}}/>
      <div style={{fontSize:'clamp(11px,1.5vw,13px)',fontWeight:700,textTransform:'uppercase',
        animation:'splashText .5s ease-out .3s both',position:'relative'}}>TWENTY ONE FC</div>
    </div>
  );

  // ═══ HEADER ═══
  const scrolled = scrollY > 60;
  const Header = () => (
    <header style={{
      position:'fixed',top:0,left:0,right:0,zIndex:1000,
      background:scrolled?'rgba(10,10,20,.97)':'transparent',
      backdropFilter:scrolled?'blur(12px)':'none',
      borderBottom:scrolled?'1px solid rgba(255,255,255,.05)':'none',
      padding:scrolled?'.5rem 2.5rem':'1rem 2.5rem',
      display:'flex',justifyContent:'space-between',alignItems:'center',
      transition:`all .5s ${ease}`,
    }}>
      <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
        <img src={BASE+"images/logo-full-white.png"} alt="21FC"
          style={{height:scrolled?'36px':'50px',width:'auto',transition:`height .4s ${ease}`}}/>
      </div>
      <nav className="nav-links" style={{display:'flex',gap:'1.8rem',alignItems:'center'}}>
        {['About','Schedule','Gallery','Join'].map(s=>(
          <a key={s} href={`#${s.toLowerCase()}`} style={{
            color:'rgba(240,239,239,.7)',textDecoration:'none',fontSize:'13px',fontWeight:500,
            letterSpacing:'.5px',textTransform:'uppercase',transition:`color .3s ${ease}`,
          }}
            onMouseEnter={e=>{e.target.style.color=c.pink}}
            onMouseLeave={e=>{e.target.style.color='rgba(240,239,239,.7)'}}
          >{s}</a>
        ))}
        <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
          style={{padding:'8px 20px',background:c.pink,color:'#fff',fontSize:'11px',fontWeight:700,
            textTransform:'uppercase',letterSpacing:'1.5px',textDecoration:'none',
            transition:`all .3s ${ease}`,marginLeft:'.5rem'}}
          onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c.bg;}}
          onMouseLeave={e=>{e.currentTarget.style.background=c.pink;e.currentTarget.style.color='#fff';}}
        >Book Now</a>
      </nav>
    </header>
  );

  // ═══ HERO ═══
  const Hero = () => (
    <section style={{position:'relative',height:'88vh',maxHeight:'880px',overflow:'hidden'}}>
      {heroSlides.map((slide,i)=>(
        <div key={i} style={{
          position:'absolute',inset:0,opacity:heroIdx===i?1:0,transition:`opacity 1.6s ${ease}`,
        }}>
          <img src={slide.src} alt="" loading={i===0?'eager':'lazy'}
            style={{
              width:'100%',height:'100%',objectFit:'cover',
              objectPosition:slide.pos,
              animation:heroIdx===i?`heroSlow 10s ${ease} forwards`:'none',
            }}/>
        </div>
      ))}
      <div style={{position:'absolute',inset:0,zIndex:2,
        background:'linear-gradient(180deg, rgba(10,10,20,.4) 0%, rgba(10,10,20,.05) 20%, rgba(10,10,20,.08) 50%, rgba(10,10,20,.75) 80%, rgba(10,10,20,1) 100%)',
      }}/>
      <div style={{
        position:'absolute',bottom:0,left:0,right:0,zIndex:3,
        padding:'0 clamp(1.5rem,6vw,5rem) clamp(2.5rem,6vh,4.5rem)',maxWidth:'1400px',
      }}>
        <p style={{fontSize:'12px',fontWeight:600,color:c.pink,textTransform:'uppercase',letterSpacing:'4px',
          marginBottom:'12px',animation:`up .6s ${ease} .15s both`}}>Clifton, NJ &mdash; Indoor Turf</p>
        <h1 style={{fontWeight:900,lineHeight:.9,letterSpacing:'-.04em',marginBottom:'.3em',animation:`up .6s ${ease} .25s both`}}>
          <span className="hero-title" style={{display:'block',fontSize:'clamp(52px,10vw,130px)'}}>7 AM.</span>
          <span className="hero-sub" style={{display:'block',fontSize:'clamp(34px,6.5vw,88px)',fontWeight:300,letterSpacing:'-.02em',color:'rgba(240,239,239,.8)'}}>No Excuses.</span>
        </h1>
        <p style={{fontSize:'clamp(14px,1.5vw,18px)',fontWeight:300,color:'rgba(240,239,239,.55)',maxWidth:'440px',lineHeight:1.7,marginBottom:'1.8rem',
          animation:`up .6s ${ease} .4s both`}}>
          High-level adult pickup soccer. Organized games, real community, no shortcuts.
        </p>
        <div style={{display:'flex',gap:'14px',flexWrap:'wrap',animation:`up .6s ${ease} .5s both`}}>
          <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
            style={{padding:'16px 44px',background:c.pink,color:'#fff',fontSize:'13px',fontWeight:800,
              textTransform:'uppercase',letterSpacing:'2.5px',textDecoration:'none',
              animation:'ctaGlow 3s ease-in-out infinite',
              transition:`all .35s ${ease}`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c.bg;e.currentTarget.style.transform='translateY(-3px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=c.pink;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(0)';}}
          >Reserve Your Spot</a>
          <a href="#schedule" style={{padding:'16px 28px',background:'transparent',color:'rgba(240,239,239,.7)',
              border:'1px solid rgba(240,239,239,.15)',fontSize:'12px',fontWeight:500,
              textTransform:'uppercase',letterSpacing:'2px',textDecoration:'none',transition:`all .35s ${ease}`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(240,239,239,.4)';e.currentTarget.style.color=c.white;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(240,239,239,.15)';e.currentTarget.style.color='rgba(240,239,239,.7)';}}
          >View Schedule</a>
        </div>
      </div>
      <div style={{position:'absolute',bottom:'1.2rem',left:'50%',transform:'translateX(-50%)',zIndex:3,opacity:.35}}>
        <div style={{width:'20px',height:'34px',border:'1px solid rgba(255,255,255,.2)',borderRadius:'10px',display:'flex',justifyContent:'center',paddingTop:'6px'}}>
          <div style={{width:'2px',height:'6px',background:c.pink,borderRadius:'1px',animation:'bounce 1.4s ease-in-out infinite'}}/>
        </div>
      </div>
    </section>
  );

  // ═══ STATS ═══
  const Stats = () => (
    <section style={{background:c.card,borderTop:'1px solid rgba(237,17,113,.08)',borderBottom:'1px solid rgba(255,255,255,.04)',padding:'2rem 1.5rem'}}>
      <div className="grid-4col" style={{maxWidth:'900px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',textAlign:'center'}}>
        {[{v:'200+',l:'Players'},{v:'4×',l:'Weekly'},{v:'7 AM',l:'Kickoff'},{v:'3+',l:'Years'}].map((s,i)=>(
          <div key={i} className={`reveal reveal-d${i+1}`}>
            <div style={{fontSize:'clamp(26px,4.5vw,42px)',fontWeight:800,lineHeight:1,color:c.white}}>{s.v}</div>
            <div style={{fontSize:'11px',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',color:c.muted,marginTop:'.3rem'}}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );

  // ═══ ABOUT ═══
  const About = () => (
    <section id="about" style={{borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div className="grid-2col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'460px'}}>
        <div className="reveal" style={{overflow:'hidden',position:'relative'}}>
          <img src={BASE+"images/DSC08671.jpg"} alt="21FC match" loading="lazy"
            style={{width:'100%',height:'100%',minHeight:'320px',objectFit:'cover',objectPosition:'center 25%',transition:`transform 6s ${ease}`}}
            onMouseEnter={e=>{e.target.style.transform='scale(1.03)'}}
            onMouseLeave={e=>{e.target.style.transform='scale(1)'}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'30%',background:'linear-gradient(transparent,rgba(10,10,20,.4))'}}/>
        </div>
        <div className="reveal reveal-d2" style={{background:c.card,padding:'clamp(2rem,4vw,4rem)',display:'flex',flexDirection:'column',justifyContent:'center',
          borderLeft:'1px solid rgba(255,255,255,.06)'}}>
          <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1.2rem'}}/>
          <span style={{fontSize:'11px',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:c.muted,marginBottom:'.6rem'}}>Our Mission</span>
          <h2 style={{fontSize:'clamp(24px,3.5vw,40px)',fontWeight:300,lineHeight:1.2,marginBottom:'1.2rem'}}>
            Unite skilled players<br/>in real competition
          </h2>
          <p style={{fontSize:'clamp(14px,1.4vw,16px)',fontWeight:300,lineHeight:1.8,color:'rgba(240,239,239,.7)',marginBottom:'1.5rem'}}>
            21FC brings together dedicated players in a competitive, respectful, and community-driven environment. Organized, high-level adult pickup soccer where you push your game and build real connections.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.2rem'}}>
            {[{l:'Location',v:'Clifton, NJ'},{l:'Days',v:'Mon · Wed · Fri · Sun'}].map((x,i)=>(
              <div key={i}>
                <span style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:c.pink,marginBottom:'.3rem'}}>{x.l}</span>
                <span style={{fontSize:'15px',fontWeight:500}}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // ═══ DUAL CAROUSEL ═══
  const DualCarousel = () => {
    const row1 = [
      {src:BASE+'images/DSC08584.jpg',pos:'center 25%'},
      {src:BASE+'images/DSC08712.jpg',pos:'center 30%'},
      {src:BASE+'images/DSC08674.jpg',pos:'center 35%'},
      {src:BASE+'images/DSC08730.jpg',pos:'center 25%'},
      {src:BASE+'images/DSC08806.jpg',pos:'center 30%'},
      {src:BASE+'images/DSC08703.jpg',pos:'center 35%'},
    ];
    const row2 = [
      {src:BASE+'images/DSC08737.jpg',pos:'center 30%'},
      {src:BASE+'images/DSC08820.jpg',pos:'center 25%'},
      {src:BASE+'images/DSC08634.jpg',pos:'center 35%'},
      {src:BASE+'images/DSC08619.jpg',pos:'center 20%'},
      {src:BASE+'images/DSC08671.jpg',pos:'center 25%'},
      {src:BASE+'images/DSC08823.jpg',pos:'center 20%'},
    ];
    const renderRow = (images, direction) => (
      <div style={{overflow:'hidden',width:'100%'}}>
        <div style={{display:'flex',gap:'5px',width:'fit-content',animation:`${direction} 30s linear infinite`}}>
          {[...images,...images].map((img,i)=>(
            <div key={i} style={{width:'clamp(200px,26vw,320px)',height:'clamp(130px,16vw,195px)',flexShrink:0,overflow:'hidden'}}>
              <img src={img.src} alt="" loading="lazy"
                style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:img.pos,
                  filter:'brightness(.85)',transition:`filter .4s ${ease}, transform .5s ${ease}`}}
                onMouseEnter={e=>{e.target.style.filter='brightness(1.05)';e.target.style.transform='scale(1.04)';}}
                onMouseLeave={e=>{e.target.style.filter='brightness(.85)';e.target.style.transform='scale(1)';}}
              />
            </div>
          ))}
        </div>
      </div>
    );
    return (
      <div style={{background:c.black,padding:'5px 0',display:'flex',flexDirection:'column',gap:'5px',
        borderTop:'1px solid rgba(237,17,113,.12)',borderBottom:'1px solid rgba(237,17,113,.12)'}}>
        {renderRow(row1, 'scrollLeft')}
        {renderRow(row2, 'scrollRight')}
      </div>
    );
  };

  // ═══ SCHEDULE ═══
  const Schedule = () => (
    <section id="schedule" style={{background:c.bg,padding:'clamp(3rem,6vh,5.5rem) 2rem'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div className="reveal" style={{marginBottom:'2rem'}}>
          <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1rem'}}/>
          <h2 style={{fontSize:'clamp(26px,4.5vw,44px)',fontWeight:600,marginBottom:'.3rem'}}>Weekly Schedule</h2>
          <p style={{fontSize:'14px',color:c.muted,fontWeight:300}}>High-level play. Every session.</p>
        </div>
        <div className="grid-4col" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
          {['Monday','Wednesday','Friday','Sunday'].map((day,i)=>(
            <div key={i} className={`reveal reveal-d${i+1}`} style={{
              padding:'1.5rem',background:'rgba(17,17,24,.7)',borderLeft:`2px solid ${c.pink}`,
              transition:`all .4s ${ease}`,cursor:'pointer',
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(17,17,24,.95)';e.currentTarget.style.borderLeftColor=c.volt;e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(17,17,24,.7)';e.currentTarget.style.borderLeftColor=c.pink;e.currentTarget.style.transform='translateY(0)';}}
            >
              <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:c.muted,marginBottom:'.6rem'}}>{day}</div>
              <div style={{fontSize:'24px',fontWeight:700,marginBottom:'.2rem'}}>7:00 AM</div>
              <div style={{fontSize:'13px',color:c.muted}}>60 min match</div>
            </div>
          ))}
        </div>
        <div className="reveal reveal-d5" style={{marginTop:'2rem',paddingTop:'1.2rem',borderTop:'1px solid rgba(255,255,255,.06)'}}>
          <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
            style={{padding:'14px 40px',background:c.pink,color:'#fff',fontSize:'12px',fontWeight:700,
              textTransform:'uppercase',letterSpacing:'1.5px',textDecoration:'none',display:'inline-block',
              animation:'ctaGlow 3s ease-in-out infinite',transition:`all .35s ${ease}`}}
            onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c.bg;e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=c.pink;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(0)';}}
          >Reserve Your Spot</a>
        </div>
      </div>
    </section>
  );

  // ═══ PARALLAX ═══
  const Parallax = ({src,pos='center 30%',h='35vh',overlay=.45,children}) => (
    <div style={{position:'relative',height:h,overflow:'hidden'}}>
      <div style={{position:'absolute',inset:'-10% 0',height:'120%',backgroundImage:`url(${src})`,
        backgroundSize:'cover',backgroundPosition:pos,backgroundAttachment:'fixed'}}/>
      <div style={{position:'absolute',inset:0,background:`rgba(10,10,20,${overlay})`}}/>
      {children && <div style={{position:'relative',zIndex:1,height:'100%',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem'}}>{children}</div>}
    </div>
  );

  // ═══ GALLERY ═══
  const Gallery = () => {
    const imgs = [
      {src:BASE+'images/DSC08823.jpg',pos:'center 20%'},
      {src:BASE+'images/DSC08584.jpg',pos:'center 30%'},
      {src:BASE+'images/DSC08634.jpg',pos:'center 35%'},
      {src:BASE+'images/DSC08703.jpg',pos:'center 30%'},
      {src:BASE+'images/DSC08806.jpg',pos:'center 35%'},
      {src:BASE+'images/DSC08730.jpg',pos:'center 25%'},
      {src:BASE+'images/DSC08820.jpg',pos:'center 30%'},
      {src:BASE+'images/DSC08712.jpg',pos:'center 25%'},
    ];
    return (
      <section id="gallery" style={{background:c.bg,padding:'clamp(3rem,6vh,5.5rem) 2rem'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div className="reveal" style={{marginBottom:'2rem'}}>
            <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1rem'}}/>
            <h2 style={{fontSize:'clamp(26px,4.5vw,44px)',fontWeight:600,marginBottom:'.3rem'}}>Gallery</h2>
            <p style={{fontSize:'14px',color:c.muted,fontWeight:300}}>Moments from the pitch</p>
          </div>
          <div className="gallery-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'4px',gridAutoRows:'180px'}}>
            {imgs.map((img,i)=>(
              <div key={i} className={`reveal reveal-d${Math.min(i+1,5)}`} style={{overflow:'hidden'}}>
                <img src={img.src} alt="" loading="lazy"
                  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:img.pos,
                    filter:'brightness(.85)',transition:`transform .6s ${ease}, filter .4s ${ease}`,cursor:'pointer'}}
                  onMouseEnter={e=>{e.target.style.transform='scale(1.06)';e.target.style.filter='brightness(1.05)';}}
                  onMouseLeave={e=>{e.target.style.transform='scale(1)';e.target.style.filter='brightness(.85)';}}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // ═══ MEMBERSHIP ═══
  const Membership = () => (
    <section id="membership" style={{background:c.card,padding:'clamp(3rem,6vh,5.5rem) 2rem',borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div className="reveal" style={{marginBottom:'2rem',textAlign:'center'}}>
          <div style={{width:'32px',height:'2px',background:c.pink,margin:'0 auto 1rem'}}/>
          <h2 style={{fontSize:'clamp(26px,4.5vw,44px)',fontWeight:600,marginBottom:'.3rem'}}>Membership</h2>
          <p style={{fontSize:'14px',color:c.muted,fontWeight:300}}>Choose your commitment level</p>
        </div>
        <div className="grid-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.2rem'}}>
          {[
            {name:'Drop-In',price:'$20',per:'/ session',feats:['Single match','No commitment','Walk-on flexibility'],feat:false},
            {name:'Player',price:'$120',per:'/ month',feats:['Unlimited games','Priority booking','Player community','Kit discounts'],feat:true},
            {name:'Captain',price:'$200',per:'/ month',feats:['Team slots','Coach access','Premium stats','Exclusive events'],feat:false},
          ].map((p,i)=>(
            <div key={i} className={`reveal reveal-d${i+1}`} style={{
              padding:'2rem',background:p.feat?'rgba(237,17,113,.04)':c.bg,
              border:p.feat?'1px solid rgba(237,17,113,.2)':'1px solid rgba(255,255,255,.06)',
              borderRadius:'3px',position:'relative',transition:`all .45s ${ease}`,
              transform:p.feat?'scale(1.02)':'scale(1)',
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c.pink;e.currentTarget.style.transform=p.feat?'scale(1.04) translateY(-4px)':'translateY(-4px)';e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,.35)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=p.feat?'rgba(237,17,113,.2)':'rgba(255,255,255,.06)';e.currentTarget.style.transform=p.feat?'scale(1.02)':'scale(1)';e.currentTarget.style.boxShadow='none';}}
            >
              {p.feat && <div style={{position:'absolute',top:'-10px',left:'50%',transform:'translateX(-50%)',
                background:c.pink,color:'#fff',padding:'4px 16px',fontSize:'10px',fontWeight:700,
                letterSpacing:'1.5px',textTransform:'uppercase',animation:'pulse 3s ease-in-out infinite'}}>Most Popular</div>}
              <div style={{fontSize:'15px',fontWeight:700,marginBottom:'.5rem'}}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:'.4rem',marginBottom:'1.2rem'}}>
                <span style={{fontSize:'30px',fontWeight:800}}>{p.price}</span>
                <span style={{fontSize:'13px',color:c.muted}}>{p.per}</span>
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:'1rem',marginBottom:'1.5rem'}}>
                {p.feats.map((f,fi)=>(
                  <div key={fi} style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.5rem',fontSize:'13px',color:'rgba(240,239,239,.75)'}}>
                    <div style={{width:'5px',height:'5px',background:c.pink,borderRadius:'50%',flexShrink:0}}/>{f}
                  </div>
                ))}
              </div>
              <button style={{width:'100%',padding:'12px',background:p.feat?c.pink:'transparent',
                color:p.feat?'#fff':c.white,border:p.feat?'none':'1px solid rgba(255,255,255,.15)',
                fontSize:'12px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',cursor:'pointer',
                transition:`all .3s ${ease}`}}
                onMouseEnter={e=>{e.target.style.background=p.feat?'#fff':'rgba(255,255,255,.08)';if(p.feat)e.target.style.color=c.bg;}}
                onMouseLeave={e=>{e.target.style.background=p.feat?c.pink:'transparent';if(p.feat)e.target.style.color='#fff';}}
              >Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // ═══ BIG CTA — impossible to miss ═══
  const CTA = () => (
    <section style={{position:'relative',overflow:'hidden',padding:'clamp(4rem,10vh,8rem) 2rem',
      background:`linear-gradient(135deg, rgba(237,17,113,.12) 0%, ${c.bg} 50%, rgba(211,222,37,.05) 100%)`,
      borderTop:'1px solid rgba(237,17,113,.15)',borderBottom:'1px solid rgba(237,17,113,.15)'}}>
      <div style={{position:'absolute',top:'-50%',left:'-20%',width:'600px',height:'600px',
        background:'radial-gradient(circle, rgba(237,17,113,.06) 0%, transparent 70%)',borderRadius:'50%'}}/>
      <div style={{position:'absolute',bottom:'-40%',right:'-10%',width:'500px',height:'500px',
        background:'radial-gradient(circle, rgba(211,222,37,.04) 0%, transparent 70%)',borderRadius:'50%'}}/>
      <div className="reveal" style={{maxWidth:'700px',margin:'0 auto',textAlign:'center',position:'relative',zIndex:1}}>
        <div style={{width:'40px',height:'2px',background:c.pink,margin:'0 auto 1.5rem'}}/>
        <h2 className="cta-title" style={{fontSize:'clamp(32px,7vw,72px)',fontWeight:900,lineHeight:1,letterSpacing:'-.03em',marginBottom:'1rem'}}>
          Ready to Play?
        </h2>
        <p style={{fontSize:'clamp(15px,1.8vw,20px)',color:'rgba(240,239,239,.7)',fontWeight:300,lineHeight:1.7,marginBottom:'2.5rem',maxWidth:'500px',margin:'0 auto 2.5rem'}}>
          The most competitive pickup soccer community in New Jersey. Join 200+ players who show up every week.
        </p>
        <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
          style={{padding:'18px 56px',background:c.pink,color:'#fff',fontSize:'15px',fontWeight:800,
            textTransform:'uppercase',letterSpacing:'3px',textDecoration:'none',display:'inline-block',
            animation:'ctaGlow 2.5s ease-in-out infinite',
            transition:`all .4s ${ease}`}}
          onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c.bg;e.currentTarget.style.transform='translateY(-4px) scale(1.02)';e.currentTarget.style.boxShadow='0 16px 60px rgba(237,17,113,.35)';}}
          onMouseLeave={e=>{e.currentTarget.style.background=c.pink;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(0) scale(1)';}}
        >Join Now</a>
        <p style={{marginTop:'1.2rem',fontSize:'12px',color:c.muted,letterSpacing:'1px'}}>Via OpenSports — takes 30 seconds</p>
      </div>
    </section>
  );

  // ═══ CONTACT ═══
  const Contact = () => (
    <section id="join" style={{background:c.bg,padding:'clamp(3rem,6vh,5.5rem) 2rem',borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>
        <div className="reveal" style={{marginBottom:'2rem'}}>
          <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1rem'}}/>
          <h2 style={{fontSize:'clamp(26px,4.5vw,44px)',fontWeight:600,marginBottom:'.3rem'}}>Get in Touch</h2>
          <p style={{fontSize:'14px',color:c.muted,fontWeight:300}}>Questions? We're here.</p>
        </div>
        <div className="grid-2col" style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:'2.5rem'}}>
          <div>
            {[{l:'Instagram',v:'@21fc.soccer'},{l:'Location',v:'Clifton, NJ'},{l:'Schedule',v:'Mon, Wed, Fri, Sun 7 AM'}].map((x,i)=>(
              <div key={i} className={`reveal reveal-d${i+1}`} style={{marginBottom:'1.2rem',paddingBottom:'1.2rem',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:c.pink,marginBottom:'.2rem'}}>{x.l}</div>
                <div style={{fontSize:'15px',fontWeight:500}}>{x.v}</div>
              </div>
            ))}
          </div>
          <form className="reveal reveal-d2" style={{display:'flex',flexDirection:'column',gap:'1rem'}} onSubmit={e=>e.preventDefault()}>
            {['Your name','your@email.com'].map((ph,i)=>(
              <input key={i} type={i===1?'email':'text'} placeholder={ph}
                style={{background:'transparent',border:'none',borderBottom:'1px solid rgba(255,255,255,.1)',
                  color:c.white,padding:'.6rem 0',fontSize:'14px',fontFamily:font,outline:'none',
                  transition:`border-color .3s ${ease}`}}
                onFocus={e=>{e.target.style.borderBottomColor=c.pink}}
                onBlur={e=>{e.target.style.borderBottomColor='rgba(255,255,255,.1)'}}/>
            ))}
            <textarea placeholder="Your message" rows="3"
              style={{background:'transparent',border:'1px solid rgba(255,255,255,.1)',color:c.white,
                padding:'.6rem',fontSize:'14px',fontFamily:font,outline:'none',resize:'none',
                transition:`border-color .3s ${ease}`}}
              onFocus={e=>{e.target.style.borderColor=c.pink}}
              onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,.1)'}}/>
            <button type="submit" style={{padding:'12px 24px',background:c.pink,color:'#fff',border:'none',fontSize:'12px',
              fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',cursor:'pointer',
              transition:`all .3s ${ease}`,alignSelf:'flex-start'}}
              onMouseEnter={e=>{e.target.style.background='#fff';e.target.style.color=c.bg;e.target.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.target.style.background=c.pink;e.target.style.color='#fff';e.target.style.transform='translateY(0)';}}
            >Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );

  // ═══ LOCATION — with Google Maps link ═══
  const Location = () => (
    <section id="location" style={{background:'#060610',padding:'clamp(3rem,6vh,5.5rem) 2rem',borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div className="grid-2col" style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'clamp(1.5rem,3vw,3rem)',alignItems:'start'}}>
          <div className="reveal">
            <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1rem'}}/>
            <h2 style={{fontSize:'clamp(26px,4.5vw,44px)',fontWeight:600,marginBottom:'.3rem'}}>Find Us</h2>
            <p style={{fontSize:'14px',color:c.muted,fontWeight:300,marginBottom:'1.5rem'}}>Indoor turf in Clifton, NJ</p>
            <div style={{display:'flex',flexDirection:'column',gap:'1.2rem'}}>
              {[
                {l:'Location',v:'Clifton, NJ — Indoor Turf'},
                {l:'Game Days',v:'Mon · Wed · Fri · Sun'},
                {l:'Kickoff',v:'7:00 AM Sharp'},
                {l:'Book Via',v:'OpenSports',link:'https://opensports.net/21fc'},
              ].map((x,i)=>(
                <div key={i} style={{paddingBottom:'1rem',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                  <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:c.pink,marginBottom:'.2rem'}}>{x.l}</div>
                  {x.link?(
                    <a href={x.link} target="_blank" rel="noopener noreferrer" style={{fontSize:'15px',fontWeight:500,color:c.white,textDecoration:'none',
                      borderBottom:'1px solid rgba(237,17,113,.3)',paddingBottom:'1px',transition:`border-color .3s ${ease}`}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=c.pink}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(237,17,113,.3)'}}
                    >{x.v}</a>
                  ):(<div style={{fontSize:'15px',fontWeight:500}}>{x.v}</div>)}
                </div>
              ))}
            </div>
            <a href="https://www.google.com/maps/search/Indoor+Turf+Soccer+Clifton+NJ" target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:'.5rem',marginTop:'1.5rem',
                padding:'10px 22px',background:'transparent',border:'1px solid rgba(237,17,113,.3)',
                color:c.white,fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'1.5px',
                textDecoration:'none',transition:`all .35s ${ease}`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c.pink;e.currentTarget.style.background='rgba(237,17,113,.06)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(237,17,113,.3)';e.currentTarget.style.background='transparent';e.currentTarget.style.transform='translateY(0)';}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Open in Google Maps
            </a>
          </div>
          <div className="reveal reveal-d2" style={{overflow:'hidden',border:'1px solid rgba(255,255,255,.05)',height:'360px'}}>
            <iframe title="21FC — Clifton, NJ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48338.1!2d-74.1637!3d40.8584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f9b4b5cc7c6b%3A0xa27b78b5b3bfc7e!2sClifton%2C%20NJ!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="100%"
              style={{border:0,display:'block',filter:'invert(90%) hue-rotate(180deg) saturate(.3) brightness(.7)'}}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
          </div>
        </div>
      </div>
    </section>
  );

  // ═══ FOOTER ═══
  const Footer = () => (
    <footer style={{background:c.bg,borderTop:'1px solid rgba(255,255,255,.05)',padding:'2rem 2rem 1.2rem'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem',flexWrap:'wrap',gap:'1rem'}}>
          <img src={BASE+"images/logo-full-white.png"} alt="21FC" style={{height:'28px',width:'auto'}} loading="lazy"/>
          <div style={{display:'flex',gap:'2rem'}}>
            {[{t:'Instagram',h:'https://instagram.com/21fc.soccer'},{t:'OpenSports',h:'https://opensports.net/21fc'},{t:'Contact',h:'#join'}].map(s=>(
              <a key={s.t} href={s.h} target={s.h.startsWith('#')?'_self':'_blank'} rel="noopener noreferrer"
                style={{color:c.muted,textDecoration:'none',fontSize:'13px',transition:`color .3s ${ease}`}}
                onMouseEnter={e=>{e.target.style.color=c.white}}
                onMouseLeave={e=>{e.target.style.color=c.muted}}>{s.t}</a>
            ))}
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:'1rem',textAlign:'center'}}>
          <p style={{fontSize:'12px',color:c.muted}}>© 2026 21FC. High-level players. Organized games. Real community.</p>
        </div>
      </div>
    </footer>
  );

  // ═══ LAYOUT ═══
  return (
    <>
      <style>{css}</style>
      {!splashDone && <Splash />}
      <Header />
      <Hero />
      <Stats />
      <About />
      <DualCarousel />
      <Schedule />
      <Parallax src={BASE+'images/DSC08619.jpg'} h="30vh" pos="center 25%" overlay={.5} />
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
