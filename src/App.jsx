import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;

const App = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [visible, setVisible] = useState({});
  const [splashDone, setSplashDone] = useState(false);
  const [splashFading, setSplashFading] = useState(false);

  const c = {
    pink: '#ED1171', black: '#000', volt: '#D3DE25',
    white: '#F0EFEF', bg: '#0A0A14', card: '#111118', muted: '#9BA3A3',
  };
  const font = "'Red Hat Display', sans-serif";
  const ease = 'cubic-bezier(.25,.46,.45,.94)';

  // Hero slides — objectPosition zoomed OUT to show full players
  const heroSlides = [
    { src: BASE + 'images/DSC08619.jpg', pos: 'center 20%' },
    { src: BASE + 'images/DSC08800.jpg', pos: 'center 25%' },
    { src: BASE + 'images/DSC08641.jpg', pos: 'center 30%' },
    { src: BASE + 'images/DSC08674.jpg', pos: 'center 25%' },
    { src: BASE + 'images/DSC08823.jpg', pos: 'center 20%' },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(p => (p + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let tick = false;
    const fn = () => { if (!tick) { requestAnimationFrame(() => { setScrollY(window.scrollY); tick = false; }); tick = true; } };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setVisible(p => ({ ...p, [e.target.id]: true })); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-r]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Splash
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const f1 = setTimeout(() => setSplashFading(true), 2800);
    const f2 = setTimeout(() => { setSplashDone(true); document.body.style.overflow = ''; }, 3600);
    return () => { clearTimeout(f1); clearTimeout(f2); };
  }, []);

  const reveal = (id, delay = 0) => ({
    opacity: visible[id] ? 1 : 0,
    transform: visible[id] ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity .9s ${ease} ${delay}s, transform .9s ${ease} ${delay}s`,
  });

  // ── CSS ──
  const css = `
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:${font};background:${c.bg};color:${c.white};overflow-x:hidden}
    @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
    @keyframes heroSlow{0%{transform:scale(1)}100%{transform:scale(1.03)}}
    @keyframes up{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
    @keyframes pulse{0%,100%{box-shadow:0 0 16px rgba(237,17,113,.12)}50%{box-shadow:0 0 32px rgba(237,17,113,.25)}}
    @keyframes splashLogo{0%{opacity:0;transform:scale(.7)}40%{opacity:1;transform:scale(1.02)}60%{transform:scale(1)}100%{opacity:1;transform:scale(1)}}
    @keyframes splashText{0%{opacity:0;transform:translateY(16px);letter-spacing:12px}100%{opacity:1;transform:translateY(0);letter-spacing:6px}}
    @keyframes splashLine{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
    @keyframes splashTagline{0%{opacity:0}100%{opacity:.6}}
    @keyframes scrollLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes scrollRight{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}

    @media(max-width:900px){
      .grid-2col{grid-template-columns:1fr!important}
      .grid-4col{grid-template-columns:repeat(2,1fr)!important}
      .grid-3col{grid-template-columns:1fr!important}
      .gallery-grid{grid-template-columns:repeat(2,1fr)!important}
      .gallery-grid>*{grid-column:auto!important;grid-row:auto!important}
      .nav-links{display:none!important}
    }
    @media(max-width:600px){
      .grid-4col{grid-template-columns:1fr!important}
      .gallery-grid{grid-template-columns:1fr!important}
    }
  `;

  // ═══ SPLASH ═══
  const Splash = () => (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,background:c.bg,
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      opacity:splashFading?0:1,transition:'opacity .8s ease-in-out',
      pointerEvents:splashFading?'none':'all',
    }}>
      <div style={{position:'absolute',width:'400px',height:'400px',
        background:'radial-gradient(circle, rgba(237,17,113,.08) 0%, transparent 70%)',borderRadius:'50%'}}/>
      <img src={BASE+"images/logo-full-white.png"} alt="21FC"
        style={{height:'clamp(80px,18vw,140px)',width:'auto',position:'relative',
          animation:'splashLogo 1.2s cubic-bezier(.16,1,.3,1) forwards',
          filter:'drop-shadow(0 0 40px rgba(237,17,113,.15))',
        }}/>
      <div style={{width:'60px',height:'2px',background:c.pink,margin:'1.5rem 0 1.2rem',
        animation:'splashLine .6s ease-out .8s both',transformOrigin:'center'}}/>
      <div style={{fontSize:'clamp(11px,1.5vw,14px)',fontWeight:700,textTransform:'uppercase',
        animation:'splashText .8s ease-out .6s both',position:'relative'}}>TWENTY ONE FC</div>
      <div style={{fontSize:'clamp(10px,1.2vw,12px)',fontWeight:300,color:c.muted,marginTop:'.6rem',
        animation:'splashTagline .8s ease-out 1.4s both',letterSpacing:'2px',textTransform:'uppercase'}}>Members Only</div>
      <div style={{position:'absolute',bottom:'clamp(40px,8vh,80px)',width:'120px',height:'1px',
        background:'rgba(255,255,255,.08)',borderRadius:'1px',overflow:'hidden'}}>
        <div style={{height:'100%',background:c.pink,animation:'splashLine 2.4s ease-in-out .4s both',transformOrigin:'left'}}/>
      </div>
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
      </nav>
    </header>
  );

  // ═══ HERO — images positioned to show full scene, not cropped torsos ═══
  const Hero = () => (
    <section style={{position:'relative',height:'85vh',maxHeight:'850px',overflow:'hidden'}}>
      {heroSlides.map((slide,i)=>(
        <div key={i} style={{
          position:'absolute',inset:0,opacity:heroIdx===i?1:0,transition:`opacity 1.8s ${ease}`,
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
        background:'linear-gradient(180deg, rgba(10,10,20,.35) 0%, rgba(10,10,20,.05) 25%, rgba(10,10,20,.1) 50%, rgba(10,10,20,.8) 82%, rgba(10,10,20,1) 100%)',
      }}/>
      <div style={{
        position:'absolute',bottom:0,left:0,right:0,zIndex:3,
        padding:'0 clamp(1.5rem,6vw,5rem) clamp(3rem,8vh,5rem)',maxWidth:'1400px',
      }}>
        <p style={{fontSize:'12px',fontWeight:600,color:c.pink,textTransform:'uppercase',letterSpacing:'4px',
          marginBottom:'14px',animation:`up .7s ${ease} .2s both`}}>Clifton, NJ &mdash; Indoor Turf</p>
        <h1 style={{fontWeight:900,lineHeight:.9,letterSpacing:'-.04em',marginBottom:'.35em',animation:`up .7s ${ease} .3s both`}}>
          <span style={{display:'block',fontSize:'clamp(48px,10vw,130px)'}}>7 AM.</span>
          <span style={{display:'block',fontSize:'clamp(32px,6.5vw,88px)',fontWeight:300,letterSpacing:'-.02em',color:'rgba(240,239,239,.8)'}}>No Excuses.</span>
        </h1>
        <p style={{fontSize:'clamp(14px,1.5vw,19px)',fontWeight:300,color:'rgba(240,239,239,.6)',maxWidth:'460px',lineHeight:1.7,marginBottom:'2rem',
          animation:`up .7s ${ease} .45s both`}}>
          High-level adult pickup soccer. Organized games, real community, no shortcuts.
        </p>
        <div style={{display:'flex',gap:'14px',flexWrap:'wrap',animation:`up .7s ${ease} .6s both`}}>
          <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
            style={{padding:'14px 36px',background:c.pink,color:'#fff',fontSize:'12px',fontWeight:700,
              textTransform:'uppercase',letterSpacing:'2px',textDecoration:'none',transition:`all .35s ${ease}`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c.bg;e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(237,17,113,.25)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=c.pink;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
          >Reserve Your Spot</a>
          <a href="#schedule" style={{padding:'14px 28px',background:'transparent',color:'rgba(240,239,239,.7)',
              border:'1px solid rgba(240,239,239,.15)',fontSize:'12px',fontWeight:500,
              textTransform:'uppercase',letterSpacing:'2px',textDecoration:'none',transition:`all .35s ${ease}`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(240,239,239,.4)';e.currentTarget.style.color=c.white;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(240,239,239,.15)';e.currentTarget.style.color='rgba(240,239,239,.7)';}}
          >View Schedule</a>
        </div>
      </div>
      <div style={{position:'absolute',bottom:'1.5rem',left:'50%',transform:'translateX(-50%)',zIndex:3,opacity:.4}}>
        <div style={{width:'20px',height:'34px',border:'1px solid rgba(255,255,255,.2)',borderRadius:'10px',display:'flex',justifyContent:'center',paddingTop:'6px'}}>
          <div style={{width:'2px',height:'6px',background:c.pink,borderRadius:'1px',animation:'bounce 1.4s ease-in-out infinite'}}/>
        </div>
      </div>
    </section>
  );

  // ═══ STATS ═══
  const Stats = () => (
    <section id="stats" data-r style={{background:c.card,borderTop:'1px solid rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.04)',padding:'2.5rem 2rem'}}>
      <div className="grid-4col" style={{maxWidth:'1000px',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',textAlign:'center'}}>
        {[{v:'200+',l:'Players'},{v:'4×',l:'Weekly'},{v:'7 AM',l:'Kickoff'},{v:'3+',l:'Years'}].map((s,i)=>(
          <div key={i} style={reveal('stats',i*.08)}>
            <div style={{fontSize:'clamp(24px,4vw,40px)',fontWeight:800,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:'11px',fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',color:c.muted,marginTop:'.4rem'}}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );

  // ═══ ABOUT ═══
  const About = () => (
    <section id="about" data-r style={{borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div className="grid-2col" style={{display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'500px'}}>
        <div style={{overflow:'hidden',position:'relative',...reveal('about',0)}}>
          <img src={BASE+"images/DSC08671.jpg"} alt="21FC match" loading="lazy"
            style={{width:'100%',height:'100%',minHeight:'350px',objectFit:'cover',objectPosition:'center 25%',transition:`transform 6s ${ease}`}}
            onMouseEnter={e=>{e.target.style.transform='scale(1.03)'}}
            onMouseLeave={e=>{e.target.style.transform='scale(1)'}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'30%',background:'linear-gradient(transparent,rgba(10,10,20,.4))'}}/>
        </div>
        <div style={{background:c.card,padding:'clamp(2rem,5vw,4.5rem)',display:'flex',flexDirection:'column',justifyContent:'center',
          borderLeft:'1px solid rgba(255,255,255,.06)',...reveal('about',.15)}}>
          <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1.5rem'}}/>
          <span style={{fontSize:'11px',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:c.muted,marginBottom:'.8rem'}}>Our Mission</span>
          <h2 style={{fontSize:'clamp(24px,3.5vw,42px)',fontWeight:300,lineHeight:1.2,marginBottom:'1.5rem'}}>
            Unite skilled players<br/>in real competition
          </h2>
          <p style={{fontSize:'clamp(14px,1.4vw,16px)',fontWeight:300,lineHeight:1.8,color:'rgba(240,239,239,.75)',marginBottom:'2rem'}}>
            21FC brings together dedicated players in a competitive, respectful, and community-driven environment. Organized, high-level adult pickup soccer where you push your game and build real connections.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
            {[{l:'Location',v:'Clifton, NJ'},{l:'Days',v:'Mon · Wed · Fri · Sun'}].map((x,i)=>(
              <div key={i}>
                <span style={{display:'block',fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:c.pink,marginBottom:'.4rem'}}>{x.l}</span>
                <span style={{fontSize:'15px',fontWeight:500}}>{x.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  // ═══ DUAL CAROUSEL — two rows scrolling opposite directions ═══
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
        <div style={{
          display:'flex',gap:'6px',width:'fit-content',
          animation:`${direction} 35s linear infinite`,
        }}>
          {[...images,...images].map((img,i)=>(
            <div key={i} style={{width:'clamp(220px,28vw,340px)',height:'clamp(140px,18vw,210px)',flexShrink:0,overflow:'hidden',borderRadius:'2px'}}>
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
      <div style={{background:c.black,padding:'6px 0',display:'flex',flexDirection:'column',gap:'6px',
        borderTop:'1px solid rgba(237,17,113,.15)',borderBottom:'1px solid rgba(237,17,113,.15)'}}>
        {renderRow(row1, 'scrollLeft')}
        {renderRow(row2, 'scrollRight')}
      </div>
    );
  };

  // ═══ SCHEDULE ═══
  const Schedule = () => (
    <section id="schedule" data-r style={{background:c.bg,padding:'clamp(3.5rem,8vh,7rem) 2rem'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{marginBottom:'2.5rem',...reveal('schedule')}}>
          <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1.2rem'}}/>
          <h2 style={{fontSize:'clamp(26px,4.5vw,46px)',fontWeight:600,marginBottom:'.4rem'}}>Weekly Schedule</h2>
          <p style={{fontSize:'15px',color:c.muted,fontWeight:300}}>High-level play. Every session.</p>
        </div>
        <div className="grid-4col" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
          {['Monday','Wednesday','Friday','Sunday'].map((day,i)=>(
            <div key={i} style={{
              padding:'1.8rem',background:'rgba(17,17,24,.7)',borderLeft:`2px solid ${c.pink}`,
              transition:`all .4s ${ease}`,cursor:'pointer',...reveal('schedule',.08+i*.06),
            }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(17,17,24,.95)';e.currentTarget.style.borderLeftColor=c.volt;e.currentTarget.style.transform='translateY(-3px)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(17,17,24,.7)';e.currentTarget.style.borderLeftColor=c.pink;e.currentTarget.style.transform='translateY(0)';}}
            >
              <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:c.muted,marginBottom:'.8rem'}}>{day}</div>
              <div style={{fontSize:'24px',fontWeight:700,marginBottom:'.3rem'}}>7:00 AM</div>
              <div style={{fontSize:'13px',color:c.muted}}>60 min match</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:'2.5rem',paddingTop:'1.5rem',borderTop:'1px solid rgba(255,255,255,.06)',...reveal('schedule',.4)}}>
          <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
            style={{padding:'13px 36px',background:c.pink,color:'#fff',fontSize:'12px',fontWeight:700,
              textTransform:'uppercase',letterSpacing:'1.5px',textDecoration:'none',display:'inline-block',transition:`all .35s ${ease}`}}
            onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c.bg;e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background=c.pink;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(0)';}}
          >Reserve Your Spot</a>
        </div>
      </div>
    </section>
  );

  // ═══ PARALLAX ═══
  const Parallax = ({src,pos='center 30%',h='38vh',overlay=.45,children}) => (
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
      <section id="gallery" data-r style={{background:c.bg,padding:'clamp(3.5rem,8vh,7rem) 2rem'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{marginBottom:'2.5rem',...reveal('gallery')}}>
            <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1.2rem'}}/>
            <h2 style={{fontSize:'clamp(26px,4.5vw,46px)',fontWeight:600,marginBottom:'.4rem'}}>Gallery</h2>
            <p style={{fontSize:'15px',color:c.muted,fontWeight:300}}>Moments from the pitch</p>
          </div>
          <div className="gallery-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'5px',gridAutoRows:'190px'}}>
            {imgs.map((img,i)=>(
              <div key={i} style={{overflow:'hidden',borderRadius:'2px',...reveal('gallery',.04+i*.04)}}>
                <img src={img.src} alt="" loading="lazy"
                  style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:img.pos,
                    filter:'brightness(.88)',transition:`transform .6s ${ease}, filter .4s ${ease}`,cursor:'pointer'}}
                  onMouseEnter={e=>{e.target.style.transform='scale(1.05)';e.target.style.filter='brightness(1.05)';}}
                  onMouseLeave={e=>{e.target.style.transform='scale(1)';e.target.style.filter='brightness(.88)';}}
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
    <section id="membership" data-r style={{background:c.card,padding:'clamp(3.5rem,8vh,7rem) 2rem',borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{marginBottom:'2.5rem',textAlign:'center',...reveal('membership')}}>
          <div style={{width:'32px',height:'2px',background:c.pink,margin:'0 auto 1.2rem'}}/>
          <h2 style={{fontSize:'clamp(26px,4.5vw,46px)',fontWeight:600,marginBottom:'.4rem'}}>Membership</h2>
          <p style={{fontSize:'15px',color:c.muted,fontWeight:300}}>Choose your commitment level</p>
        </div>
        <div className="grid-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem'}}>
          {[
            {name:'Drop-In',price:'$20',per:'/ session',feats:['Single match','No commitment','Walk-on flexibility'],feat:false},
            {name:'Player',price:'$120',per:'/ month',feats:['Unlimited games','Priority booking','Player community','Kit discounts'],feat:true},
            {name:'Captain',price:'$200',per:'/ month',feats:['Team slots','Coach access','Premium stats','Exclusive events'],feat:false},
          ].map((p,i)=>(
            <div key={i} style={{
              padding:'2.2rem',background:p.feat?'rgba(237,17,113,.04)':c.bg,
              border:p.feat?'1px solid rgba(237,17,113,.2)':'1px solid rgba(255,255,255,.06)',
              borderRadius:'3px',position:'relative',transition:`all .45s ${ease}`,
              transform:p.feat?'scale(1.02)':'scale(1)',...reveal('membership',.06+i*.1),
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=c.pink;e.currentTarget.style.transform=p.feat?'scale(1.04) translateY(-4px)':'translateY(-4px)';e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,.35)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=p.feat?'rgba(237,17,113,.2)':'rgba(255,255,255,.06)';e.currentTarget.style.transform=p.feat?'scale(1.02)':'scale(1)';e.currentTarget.style.boxShadow='none';}}
            >
              {p.feat && <div style={{position:'absolute',top:'-10px',left:'50%',transform:'translateX(-50%)',
                background:c.pink,color:'#fff',padding:'4px 16px',fontSize:'10px',fontWeight:700,
                letterSpacing:'1.5px',textTransform:'uppercase',animation:'pulse 3s ease-in-out infinite'}}>Most Popular</div>}
              <div style={{fontSize:'16px',fontWeight:700,marginBottom:'.6rem'}}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:'.4rem',marginBottom:'1.5rem'}}>
                <span style={{fontSize:'32px',fontWeight:800}}>{p.price}</span>
                <span style={{fontSize:'13px',color:c.muted}}>{p.per}</span>
              </div>
              <div style={{borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:'1.2rem',marginBottom:'1.8rem'}}>
                {p.feats.map((f,fi)=>(
                  <div key={fi} style={{display:'flex',alignItems:'center',gap:'.6rem',marginBottom:'.6rem',fontSize:'13px',color:'rgba(240,239,239,.75)'}}>
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

  // ═══ CTA ═══
  const CTA = () => (
    <Parallax src={BASE+'images/DSC08800.jpg'} h="50vh" pos="center 25%" overlay={.55}>
      <div style={{maxWidth:'600px'}}>
        <h2 style={{fontSize:'clamp(30px,6vw,68px)',fontWeight:900,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:'1.2rem'}}>
          Ready to<br/>Play?
        </h2>
        <p style={{fontSize:'clamp(14px,1.6vw,18px)',color:'rgba(240,239,239,.85)',fontWeight:300,lineHeight:1.7,marginBottom:'2rem'}}>
          The most competitive pickup soccer community in Jersey.
        </p>
        <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
          style={{padding:'15px 44px',background:c.pink,color:'#fff',fontSize:'13px',fontWeight:700,
            textTransform:'uppercase',letterSpacing:'2px',textDecoration:'none',display:'inline-block',transition:`all .4s ${ease}`}}
          onMouseEnter={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=c.bg;e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(237,17,113,.3)';}}
          onMouseLeave={e=>{e.currentTarget.style.background=c.pink;e.currentTarget.style.color='#fff';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';}}
        >Join Now</a>
      </div>
    </Parallax>
  );

  // ═══ CONTACT ═══
  const Contact = () => (
    <section id="join" data-r style={{background:c.bg,padding:'clamp(3.5rem,8vh,7rem) 2rem',borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>
        <div style={{marginBottom:'2.5rem',...reveal('join')}}>
          <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1.2rem'}}/>
          <h2 style={{fontSize:'clamp(26px,4.5vw,46px)',fontWeight:600,marginBottom:'.4rem'}}>Get in Touch</h2>
          <p style={{fontSize:'15px',color:c.muted,fontWeight:300}}>Questions? We're here.</p>
        </div>
        <div className="grid-2col" style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:'3rem'}}>
          <div>
            {[{l:'Instagram',v:'@21fc.soccer'},{l:'Location',v:'Clifton, NJ'},{l:'Schedule',v:'Mon, Wed, Fri, Sun 7 AM'}].map((x,i)=>(
              <div key={i} style={{marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:'1px solid rgba(255,255,255,.06)',...reveal('join',.05+i*.06)}}>
                <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:c.pink,marginBottom:'.3rem'}}>{x.l}</div>
                <div style={{fontSize:'15px',fontWeight:500}}>{x.v}</div>
              </div>
            ))}
          </div>
          <form style={{display:'flex',flexDirection:'column',gap:'1.2rem'}} onSubmit={e=>e.preventDefault()}>
            {['Your name','your@email.com'].map((ph,i)=>(
              <input key={i} type={i===1?'email':'text'} placeholder={ph}
                style={{background:'transparent',border:'none',borderBottom:'1px solid rgba(255,255,255,.1)',
                  color:c.white,padding:'.7rem 0',fontSize:'14px',fontFamily:font,outline:'none',
                  transition:`border-color .3s ${ease}`,...reveal('join',.08+i*.06)}}
                onFocus={e=>{e.target.style.borderBottomColor=c.pink}}
                onBlur={e=>{e.target.style.borderBottomColor='rgba(255,255,255,.1)'}}/>
            ))}
            <textarea placeholder="Your message" rows="3"
              style={{background:'transparent',border:'1px solid rgba(255,255,255,.1)',color:c.white,
                padding:'.7rem',fontSize:'14px',fontFamily:font,outline:'none',resize:'none',
                transition:`border-color .3s ${ease}`,...reveal('join',.2)}}
              onFocus={e=>{e.target.style.borderColor=c.pink}}
              onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,.1)'}}/>
            <button type="submit" style={{padding:'12px 24px',background:c.pink,color:'#fff',border:'none',fontSize:'12px',
              fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',cursor:'pointer',
              transition:`all .3s ${ease}`,alignSelf:'flex-start',...reveal('join',.25)}}
              onMouseEnter={e=>{e.target.style.background='#fff';e.target.style.color=c.bg;e.target.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.target.style.background=c.pink;e.target.style.color='#fff';e.target.style.transform='translateY(0)';}}
            >Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );

  // ═══ LOCATION ═══
  const Location = () => (
    <section id="location" data-r style={{background:'#060610',padding:'clamp(3.5rem,8vh,7rem) 2rem',borderTop:'1px solid rgba(255,255,255,.04)'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div className="grid-2col" style={{display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'clamp(2rem,4vw,3.5rem)',alignItems:'start'}}>
          <div style={reveal('location')}>
            <div style={{width:'32px',height:'2px',background:c.pink,marginBottom:'1.2rem'}}/>
            <h2 style={{fontSize:'clamp(26px,4.5vw,46px)',fontWeight:600,marginBottom:'.4rem'}}>Find Us</h2>
            <p style={{fontSize:'15px',color:c.muted,fontWeight:300,marginBottom:'2rem'}}>Indoor turf in Clifton, NJ</p>
            <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
              {[
                {l:'Location',v:'Clifton, NJ — Indoor Turf'},
                {l:'Game Days',v:'Mon · Wed · Fri · Sun'},
                {l:'Kickoff',v:'7:00 AM Sharp'},
                {l:'Book Via',v:'OpenSports',link:'https://opensports.net/21fc'},
              ].map((x,i)=>(
                <div key={i} style={{paddingBottom:'1.2rem',borderBottom:'1px solid rgba(255,255,255,.05)'}}>
                  <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:c.pink,marginBottom:'.3rem'}}>{x.l}</div>
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
          </div>
          <div style={{borderRadius:'2px',overflow:'hidden',border:'1px solid rgba(255,255,255,.05)',height:'380px',...reveal('location',.15)}}>
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
    <footer style={{background:c.bg,borderTop:'1px solid rgba(255,255,255,.05)',padding:'2.5rem 2rem 1.5rem'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',flexWrap:'wrap',gap:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'.6rem'}}>
            <img src={BASE+"images/logo-full-white.png"} alt="21FC" style={{height:'28px',width:'auto'}} loading="lazy"/>
          </div>
          <div style={{display:'flex',gap:'2rem'}}>
            {['Instagram','OpenSports','Contact'].map(s=>(
              <a key={s} href="#" style={{color:c.muted,textDecoration:'none',fontSize:'13px',transition:`color .3s ${ease}`}}
                onMouseEnter={e=>{e.target.style.color=c.white}}
                onMouseLeave={e=>{e.target.style.color=c.muted}}>{s}</a>
            ))}
          </div>
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:'1.2rem',textAlign:'center'}}>
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
      <Parallax src={BASE+'images/DSC08619.jpg'} h="35vh" pos="center 25%" overlay={.5} />
      <Gallery />
      <Membership />
      <CTA />
      <Contact />
      <Parallax src={BASE+'images/DSC08674.jpg'} h="28vh" pos="center 35%" overlay={.55} />
      <Location />
      <Footer />
    </>
  );
};

export default App;
