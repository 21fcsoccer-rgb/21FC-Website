import { useState, useEffect, useRef } from 'react';

const BASE = import.meta.env.BASE_URL;

/* ─── 21FC — Nike Football–inspired rebuild ─── */
const App = () => {
  const [heroIdx, setHeroIdx] = useState(0);
  const [splashDone, setSplashDone] = useState(false);
  const [splashFade, setSplashFade] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);

  /* palette */
  const pk = '#ED1171';
  const bg = '#0A0A0F';
  const card = '#0F0F18';
  const wh = '#F0EFEF';
  const mt = '#7A7F8A';

  /* hero images */
  const heroes = [
    { src: BASE+'images/DSC08619.jpg', pos: 'center 18%' },
    { src: BASE+'images/DSC08800.jpg', pos: 'center 22%' },
    { src: BASE+'images/DSC08641.jpg', pos: 'center 28%' },
    { src: BASE+'images/DSC08674.jpg', pos: 'center 22%' },
    { src: BASE+'images/DSC08823.jpg', pos: 'center 18%' },
  ];

  /* timers */
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1) % heroes.length), 5500);
    return () => clearInterval(t);
  }, []);

  /* header scroll */
  useEffect(() => {
    const fn = () => setHeaderSolid(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* splash — 1.6s total */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const a = setTimeout(() => setSplashFade(true), 1100);
    const b = setTimeout(() => { setSplashDone(true); document.body.style.overflow = ''; }, 1600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);

  /* reveal on scroll — runs ONCE, not every render */
  const observed = useRef(false);
  useEffect(() => {
    if (observed.current) return;
    observed.current = true;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    /* observe after splash clears so all elements register */
    const timer = setTimeout(() => {
      document.querySelectorAll('.rv').forEach(el => obs.observe(el));
    }, 1800);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, []);

  /* ── global css ── */
  const css = `
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'Red Hat Display',sans-serif;background:${bg};color:${wh};overflow-x:hidden;-webkit-font-smoothing:antialiased}

/* reveal */
.rv{opacity:0;transform:translateY(24px);transition:opacity .65s cubic-bezier(.25,.46,.45,.94),transform .65s cubic-bezier(.25,.46,.45,.94)}
.rv.vis{opacity:1;transform:translateY(0)}
.rv.d1{transition-delay:.07s}.rv.d2{transition-delay:.14s}.rv.d3{transition-delay:.21s}
.rv.d4{transition-delay:.28s}.rv.d5{transition-delay:.35s}.rv.d6{transition-delay:.42s}

/* hero fade */
@keyframes heroScale{0%{transform:scale(1)}100%{transform:scale(1.04)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(237,17,113,.25)}50%{box-shadow:0 0 44px rgba(237,17,113,.45)}}

/* splash */
@keyframes sLogo{0%{opacity:0;transform:scale(.75)}60%{opacity:1;transform:scale(1.01)}100%{transform:scale(1)}}
@keyframes sLine{0%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes sText{0%{opacity:0;letter-spacing:10px}100%{opacity:1;letter-spacing:5px}}

/* responsive */
@media(max-width:960px){
  .g2{grid-template-columns:1fr!important}
  .g4{grid-template-columns:repeat(2,1fr)!important}
  .g3{grid-template-columns:1fr!important}
  .imgG{grid-template-columns:repeat(2,1fr)!important}
  .imgG>*{grid-column:auto!important;grid-row:auto!important}
  .navL{display:none!important}
  .heroH1{font-size:clamp(44px,13vw,90px)!important}
  .heroH2{font-size:clamp(26px,8vw,56px)!important}
  .ctaH{font-size:clamp(30px,9vw,60px)!important}
}
@media(max-width:600px){
  .g4{grid-template-columns:1fr!important}
  .imgG{grid-template-columns:1fr!important}
}
  `;

  /* ═══ shared ═══ */
  const sec = (py = 'clamp(4rem,8vh,7rem)') => ({ padding: `${py} clamp(1.5rem,5vw,4rem)` });
  const wrap = (mw = '1200px') => ({ maxWidth: mw, margin: '0 auto' });
  const label = { fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: pk };
  const heading = (sz = 'clamp(28px,5vw,48px)') => ({ fontSize: sz, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.02em' });
  const sub = { fontSize: 'clamp(14px,1.4vw,17px)', fontWeight: 300, lineHeight: 1.75, color: 'rgba(240,239,239,.6)' };

  const Btn = ({ href, big, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'inline-block', padding: big ? '17px 52px' : '14px 36px',
        background: pk, color: '#fff', textDecoration: 'none',
        fontSize: big ? '14px' : '12px', fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: big ? '3px' : '2px',
        animation: 'glow 3s ease-in-out infinite',
        transition: 'all .35s cubic-bezier(.25,.46,.45,.94)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = bg; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = pk; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >{children}</a>
  );

  /* ═══ SPLASH ═══ */
  const Splash = () => (
    <div style={{ position:'fixed',inset:0,zIndex:9999,background:bg,display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',opacity:splashFade?0:1,transition:'opacity .5s ease',
      pointerEvents:splashFade?'none':'all' }}>
      <img src={BASE+'images/logo-full-white.png'} alt="21FC"
        style={{ height:'clamp(60px,14vw,110px)',width:'auto',animation:'sLogo .7s cubic-bezier(.16,1,.3,1) forwards',
          filter:'drop-shadow(0 0 30px rgba(237,17,113,.15))' }} />
      <div style={{ width:'40px',height:'2px',background:pk,margin:'1rem 0 .8rem',animation:'sLine .35s ease-out .35s both',transformOrigin:'center' }} />
      <div style={{ fontSize:'12px',fontWeight:700,textTransform:'uppercase',animation:'sText .45s ease-out .25s both' }}>Twenty One FC</div>
    </div>
  );

  /* ═══ HEADER ═══ */
  const Header = () => (
    <header style={{
      position:'fixed',top:0,left:0,right:0,zIndex:1000,
      background: headerSolid ? 'rgba(10,10,15,.96)' : 'transparent',
      backdropFilter: headerSolid ? 'blur(10px)' : 'none',
      borderBottom: headerSolid ? '1px solid rgba(255,255,255,.04)' : 'none',
      padding: headerSolid ? '.55rem 2rem' : '.9rem 2rem',
      display:'flex',justifyContent:'space-between',alignItems:'center',
      transition: 'all .45s cubic-bezier(.25,.46,.45,.94)',
    }}>
      <img src={BASE+'images/logo-full-white.png'} alt="21FC"
        style={{ height: headerSolid ? '34px' : '46px', width:'auto', transition:'height .4s ease' }} />
      <nav className="navL" style={{ display:'flex',gap:'1.6rem',alignItems:'center' }}>
        {['About','Schedule','Gallery','Join'].map(s => (
          <a key={s} href={`#${s.toLowerCase()}`}
            style={{ color:'rgba(240,239,239,.6)',textDecoration:'none',fontSize:'12px',fontWeight:600,
              letterSpacing:'1px',textTransform:'uppercase',transition:'color .3s ease' }}
            onMouseEnter={e => e.target.style.color = pk}
            onMouseLeave={e => e.target.style.color = 'rgba(240,239,239,.6)'}
          >{s}</a>
        ))}
        <a href="https://opensports.net/21fc" target="_blank" rel="noopener noreferrer"
          style={{ padding:'8px 18px',background:pk,color:'#fff',fontSize:'10px',fontWeight:700,
            textTransform:'uppercase',letterSpacing:'1.5px',textDecoration:'none',transition:'all .3s ease' }}
          onMouseEnter={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.color=bg; }}
          onMouseLeave={e => { e.currentTarget.style.background=pk; e.currentTarget.style.color='#fff'; }}
        >Book Now</a>
      </nav>
    </header>
  );

  /* ═══ HERO — full-bleed Nike style ═══ */
  const Hero = () => (
    <section style={{ position:'relative',height:'100vh',maxHeight:'1000px',overflow:'hidden' }}>
      {heroes.map((h, i) => (
        <div key={i} style={{ position:'absolute',inset:0,opacity:heroIdx===i?1:0,transition:'opacity 1.4s ease' }}>
          <img src={h.src} alt="" loading={i===0?'eager':'lazy'}
            style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:h.pos,
              animation: heroIdx===i ? 'heroScale 12s ease forwards' : 'none' }} />
        </div>
      ))}
      {/* gradient — dark at bottom for text legibility */}
      <div style={{ position:'absolute',inset:0,zIndex:2,
        background:'linear-gradient(180deg,rgba(10,10,15,.5) 0%,rgba(10,10,15,0) 30%,rgba(10,10,15,0) 45%,rgba(10,10,15,.7) 75%,rgba(10,10,15,1) 100%)' }} />

      <div style={{ position:'absolute',bottom:0,left:0,right:0,zIndex:3,
        padding:'0 clamp(2rem,6vw,5rem) clamp(3.5rem,8vh,6rem)' }}>
        <div style={{ ...label, marginBottom:'12px', animation:'fadeUp .5s ease .1s both' }}>Clifton, NJ &mdash; Indoor Turf</div>
        <h1 style={{ fontWeight:900,lineHeight:.88,letterSpacing:'-.05em',marginBottom:'.25em',animation:'fadeUp .5s ease .2s both' }}>
          <span className="heroH1" style={{ display:'block',fontSize:'clamp(56px,11vw,140px)' }}>7 AM.</span>
          <span className="heroH2" style={{ display:'block',fontSize:'clamp(36px,7vw,92px)',fontWeight:200,letterSpacing:'-.02em',color:'rgba(240,239,239,.75)' }}>No Excuses.</span>
        </h1>
        <p style={{ ...sub, maxWidth:'420px',marginBottom:'2rem',animation:'fadeUp .5s ease .35s both' }}>
          High-level adult pickup soccer. Organized matches, real competition, no shortcuts.
        </p>
        <div style={{ display:'flex',gap:'12px',flexWrap:'wrap',animation:'fadeUp .5s ease .45s both' }}>
          <Btn href="https://opensports.net/21fc" big>Reserve Your Spot</Btn>
          <a href="#schedule" style={{ padding:'17px 28px',border:'1px solid rgba(255,255,255,.15)',color:'rgba(240,239,239,.65)',
            fontSize:'12px',fontWeight:600,textTransform:'uppercase',letterSpacing:'2px',textDecoration:'none',
            transition:'all .35s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.4)'; e.currentTarget.style.color=wh; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.15)'; e.currentTarget.style.color='rgba(240,239,239,.65)'; }}
          >View Schedule</a>
        </div>
      </div>

      {/* scroll indicator */}
      <div style={{ position:'absolute',bottom:'1.5rem',left:'50%',transform:'translateX(-50%)',zIndex:3,opacity:.3 }}>
        <div style={{ width:'18px',height:'30px',border:'1px solid rgba(255,255,255,.2)',borderRadius:'9px',display:'flex',justifyContent:'center',paddingTop:'5px' }}>
          <div style={{ width:'2px',height:'5px',background:pk,borderRadius:'1px',animation:'bounce 1.4s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );

  /* ═══ STATS BAR ═══ */
  const Stats = () => (
    <section style={{ background:card,borderBottom:`1px solid rgba(237,17,113,.06)`,padding:'1.8rem 1.5rem' }}>
      <div className="g4" style={{ ...wrap('900px'),display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',textAlign:'center' }}>
        {[{v:'200+',l:'Players'},{v:'4×',l:'Weekly'},{v:'7 AM',l:'Kickoff'},{v:'3+',l:'Years'}].map((s,i) => (
          <div key={i} className={`rv d${i+1}`}>
            <div style={{ fontSize:'clamp(28px,5vw,44px)',fontWeight:800,lineHeight:1 }}>{s.v}</div>
            <div style={{ fontSize:'10px',fontWeight:600,letterSpacing:'2.5px',textTransform:'uppercase',color:mt,marginTop:'.25rem' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );

  /* ═══ ABOUT — split layout ═══ */
  const About = () => (
    <section id="about" style={{ background:bg }}>
      <div className="g2" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:'420px' }}>
        <div className="rv" style={{ overflow:'hidden',position:'relative' }}>
          <img src={BASE+'images/DSC08671.jpg'} alt="" loading="lazy"
            style={{ width:'100%',height:'100%',minHeight:'300px',objectFit:'cover',objectPosition:'center 25%',
              transition:'transform 5s ease' }}
            onMouseEnter={e => e.target.style.transform='scale(1.03)'}
            onMouseLeave={e => e.target.style.transform='scale(1)'} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(90deg,transparent 70%,rgba(10,10,15,.3) 100%)' }} />
        </div>
        <div className="rv d2" style={{ background:card,padding:'clamp(2.5rem,4vw,4rem)',display:'flex',flexDirection:'column',justifyContent:'center',
          borderLeft:'1px solid rgba(255,255,255,.04)' }}>
          <div style={{ width:'28px',height:'2px',background:pk,marginBottom:'1.2rem' }} />
          <div style={{ ...label, marginBottom:'.5rem' }}>Our Mission</div>
          <h2 style={{ ...heading(),marginBottom:'1rem' }}>Unite skilled players<br/>in real competition</h2>
          <p style={{ ...sub,marginBottom:'1.8rem' }}>
            21FC brings together dedicated players in a competitive, respectful, and community-driven environment. Organized, high-level adult pickup soccer where you push your game and build real connections.
          </p>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem' }}>
            {[{l:'Location',v:'Clifton, NJ'},{l:'Game Days',v:'Mon · Wed · Fri · Sun'}].map((x,i) => (
              <div key={i}>
                <div style={{ ...label,fontSize:'9px',marginBottom:'.25rem' }}>{x.l}</div>
                <div style={{ fontSize:'15px',fontWeight:600 }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  /* ═══ IMAGE BAND — Nike-style 3-column grid, no carousel ═══ */
  const ImageBand = () => {
    const imgs = [
      { src: BASE+'images/DSC08584.jpg', pos:'center 28%' },
      { src: BASE+'images/DSC08712.jpg', pos:'center 30%' },
      { src: BASE+'images/DSC08730.jpg', pos:'center 25%' },
    ];
    return (
      <section style={{ background:bg,padding:'3px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'3px' }}>
          {imgs.map((img,i) => (
            <div key={i} className={`rv d${i+1}`} style={{ overflow:'hidden',height:'clamp(160px,22vw,280px)' }}>
              <img src={img.src} alt="" loading="lazy"
                style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:img.pos,
                  filter:'brightness(.82)',transition:'all .6s ease',cursor:'pointer' }}
                onMouseEnter={e => { e.target.style.filter='brightness(1)'; e.target.style.transform='scale(1.04)'; }}
                onMouseLeave={e => { e.target.style.filter='brightness(.82)'; e.target.style.transform='scale(1)'; }} />
            </div>
          ))}
        </div>
      </section>
    );
  };

  /* ═══ SCHEDULE ═══ */
  const Schedule = () => (
    <section id="schedule" style={{ ...sec(),background:bg }}>
      <div style={wrap('1100px')}>
        <div className="rv" style={{ marginBottom:'2rem' }}>
          <div style={{ width:'28px',height:'2px',background:pk,marginBottom:'1rem' }} />
          <h2 style={heading()}>Weekly Schedule</h2>
          <p style={{ ...sub,marginTop:'.3rem' }}>High-level play. Every session.</p>
        </div>
        <div className="g4" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px' }}>
          {['Monday','Wednesday','Friday','Sunday'].map((day,i) => (
            <div key={i} className={`rv d${i+1}`}
              style={{ padding:'clamp(1.2rem,2vw,1.8rem)',background:card,borderLeft:`2px solid ${pk}`,
                transition:'all .4s ease',cursor:'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background='#161622'; e.currentTarget.style.borderLeftColor='#D3DE25'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background=card; e.currentTarget.style.borderLeftColor=pk; e.currentTarget.style.transform='translateY(0)'; }}
            >
              <div style={{ fontSize:'10px',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:mt,marginBottom:'.5rem' }}>{day}</div>
              <div style={{ fontSize:'clamp(20px,3vw,26px)',fontWeight:700,marginBottom:'.15rem' }}>7:00 AM</div>
              <div style={{ fontSize:'12px',color:mt }}>60 min · Indoor Turf</div>
            </div>
          ))}
        </div>
        <div className="rv d5" style={{ marginTop:'1.8rem' }}>
          <Btn href="https://opensports.net/21fc">Reserve Your Spot</Btn>
        </div>
      </div>
    </section>
  );

  /* ═══ FULL-BLEED IMAGE BREAK ═══ */
  const ImageBreak = ({ src, pos='center 25%', h='clamp(200px,35vh,400px)' }) => (
    <section style={{ position:'relative',height:h,overflow:'hidden' }}>
      <img src={src} alt="" loading="lazy"
        style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:pos,filter:'brightness(.7)' }} />
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(10,10,15,.3) 0%,rgba(10,10,15,.1) 50%,rgba(10,10,15,.5) 100%)' }} />
    </section>
  );

  /* ═══ GALLERY — staggered grid ═══ */
  const Gallery = () => {
    const imgs = [
      { src:BASE+'images/DSC08823.jpg', pos:'center 20%', tall:true },
      { src:BASE+'images/DSC08634.jpg', pos:'center 35%', tall:false },
      { src:BASE+'images/DSC08703.jpg', pos:'center 30%', tall:false },
      { src:BASE+'images/DSC08806.jpg', pos:'center 32%', tall:false },
      { src:BASE+'images/DSC08820.jpg', pos:'center 28%', tall:false },
      { src:BASE+'images/DSC08674.jpg', pos:'center 22%', tall:true },
    ];
    return (
      <section id="gallery" style={{ ...sec(),background:bg }}>
        <div style={wrap()}>
          <div className="rv" style={{ marginBottom:'2rem' }}>
            <div style={{ width:'28px',height:'2px',background:pk,marginBottom:'1rem' }} />
            <h2 style={heading()}>Gallery</h2>
            <p style={{ ...sub,marginTop:'.3rem' }}>Moments from the pitch</p>
          </div>
          <div className="imgG" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'4px',gridAutoRows:'180px' }}>
            {imgs.map((img,i) => (
              <div key={i} className={`rv d${Math.min(i+1,6)}`}
                style={{ overflow:'hidden', gridRow: img.tall ? 'span 2' : 'span 1' }}>
                <img src={img.src} alt="" loading="lazy"
                  style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:img.pos,
                    filter:'brightness(.8)',transition:'all .5s ease',cursor:'pointer' }}
                  onMouseEnter={e => { e.target.style.filter='brightness(1)'; e.target.style.transform='scale(1.04)'; }}
                  onMouseLeave={e => { e.target.style.filter='brightness(.8)'; e.target.style.transform='scale(1)'; }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* ═══ MEMBERSHIP ═══ */
  const Membership = () => (
    <section id="membership" style={{ ...sec(),background:card,borderTop:'1px solid rgba(255,255,255,.03)' }}>
      <div style={wrap('1100px')}>
        <div className="rv" style={{ textAlign:'center',marginBottom:'2.5rem' }}>
          <div style={{ width:'28px',height:'2px',background:pk,margin:'0 auto 1rem' }} />
          <h2 style={heading()}>Membership</h2>
          <p style={{ ...sub,marginTop:'.3rem' }}>Choose your commitment level</p>
        </div>
        <div className="g3" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px' }}>
          {[
            { name:'Drop-In',price:'$20',per:'/session',feats:['Single match access','No commitment','Walk-on flexibility'],pop:false },
            { name:'Player',price:'$120',per:'/month',feats:['Unlimited games','Priority booking','Player community','Kit discounts'],pop:true },
            { name:'Captain',price:'$200',per:'/month',feats:['Reserved team slots','Coach access','Premium stats','Exclusive events'],pop:false },
          ].map((p,i) => (
            <div key={i} className={`rv d${i+1}`}
              style={{
                padding:'clamp(1.5rem,2.5vw,2.2rem)',background:p.pop?'rgba(237,17,113,.03)':bg,
                border:p.pop?`1px solid rgba(237,17,113,.18)`:'1px solid rgba(255,255,255,.05)',
                position:'relative',transition:'all .4s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=pk; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=p.pop?'rgba(237,17,113,.18)':'rgba(255,255,255,.05)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              {p.pop && <div style={{ position:'absolute',top:'-9px',left:'50%',transform:'translateX(-50)',
                background:pk,color:'#fff',padding:'3px 14px',fontSize:'9px',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase' }}>Popular</div>}
              <div style={{ fontSize:'14px',fontWeight:700,marginBottom:'.4rem' }}>{p.name}</div>
              <div style={{ display:'flex',alignItems:'baseline',gap:'.3rem',marginBottom:'1.2rem' }}>
                <span style={{ fontSize:'clamp(26px,4vw,34px)',fontWeight:800 }}>{p.price}</span>
                <span style={{ fontSize:'12px',color:mt }}>{p.per}</span>
              </div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:'.8rem',marginBottom:'1.2rem' }}>
                {p.feats.map((f,fi) => (
                  <div key={fi} style={{ display:'flex',alignItems:'center',gap:'.4rem',marginBottom:'.4rem',fontSize:'13px',color:'rgba(240,239,239,.7)' }}>
                    <div style={{ width:'4px',height:'4px',background:pk,borderRadius:'50%',flexShrink:0 }} />{f}
                  </div>
                ))}
              </div>
              <button style={{ width:'100%',padding:'11px',background:p.pop?pk:'transparent',
                color:p.pop?'#fff':wh,border:p.pop?'none':'1px solid rgba(255,255,255,.12)',
                fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',cursor:'pointer',transition:'all .3s ease' }}
                onMouseEnter={e => { e.target.style.background=p.pop?'#fff':'rgba(255,255,255,.06)'; if(p.pop) e.target.style.color=bg; }}
                onMouseLeave={e => { e.target.style.background=p.pop?pk:'transparent'; if(p.pop) e.target.style.color='#fff'; }}
              >Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /* ═══ BIG CTA — full width, in-your-face ═══ */
  const CTA = () => (
    <section style={{ position:'relative',padding:'clamp(5rem,12vh,9rem) 2rem',overflow:'hidden',
      background:`linear-gradient(135deg, rgba(237,17,113,.08) 0%, ${bg} 40%, ${bg} 60%, rgba(211,222,37,.04) 100%)`,
      borderTop:'1px solid rgba(237,17,113,.1)',borderBottom:'1px solid rgba(237,17,113,.1)' }}>
      {/* ambient glow */}
      <div style={{ position:'absolute',top:'-40%',left:'-15%',width:'500px',height:'500px',
        background:'radial-gradient(circle,rgba(237,17,113,.07) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none' }} />
      <div className="rv" style={{ maxWidth:'650px',margin:'0 auto',textAlign:'center',position:'relative',zIndex:1 }}>
        <div style={{ width:'36px',height:'2px',background:pk,margin:'0 auto 1.5rem' }} />
        <h2 className="ctaH" style={{ fontSize:'clamp(36px,8vw,76px)',fontWeight:900,lineHeight:.95,letterSpacing:'-.04em',marginBottom:'1rem' }}>
          Ready to<br/>Play?
        </h2>
        <p style={{ ...sub,maxWidth:'460px',margin:'0 auto 2.5rem',color:'rgba(240,239,239,.55)' }}>
          The most competitive pickup soccer community in New Jersey. 200+ players show up every week.
        </p>
        <Btn href="https://opensports.net/21fc" big>Join Now</Btn>
        <div style={{ marginTop:'1rem',fontSize:'11px',color:mt,letterSpacing:'1px' }}>Via OpenSports — takes 30 seconds</div>
      </div>
    </section>
  );

  /* ═══ CONTACT ═══ */
  const Contact = () => (
    <section id="join" style={{ ...sec(),background:bg,borderTop:'1px solid rgba(255,255,255,.03)' }}>
      <div style={wrap('900px')}>
        <div className="rv" style={{ marginBottom:'2rem' }}>
          <div style={{ width:'28px',height:'2px',background:pk,marginBottom:'1rem' }} />
          <h2 style={heading()}>Get in Touch</h2>
          <p style={{ ...sub,marginTop:'.3rem' }}>Questions? We're here.</p>
        </div>
        <div className="g2" style={{ display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:'2.5rem' }}>
          <div>
            {[{l:'Instagram',v:'@21fc.soccer'},{l:'Location',v:'Clifton, NJ'},{l:'Schedule',v:'Mon, Wed, Fri, Sun — 7 AM'}].map((x,i) => (
              <div key={i} className={`rv d${i+1}`} style={{ marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                <div style={{ ...label,fontSize:'9px',marginBottom:'.15rem' }}>{x.l}</div>
                <div style={{ fontSize:'15px',fontWeight:600 }}>{x.v}</div>
              </div>
            ))}
          </div>
          <form className="rv d2" style={{ display:'flex',flexDirection:'column',gap:'.8rem' }} onSubmit={e => e.preventDefault()}>
            {['Your name','your@email.com'].map((ph,i) => (
              <input key={i} type={i===1?'email':'text'} placeholder={ph}
                style={{ background:'transparent',border:'none',borderBottom:'1px solid rgba(255,255,255,.08)',
                  color:wh,padding:'.55rem 0',fontSize:'14px',fontFamily:'Red Hat Display, sans-serif',outline:'none',
                  transition:'border-color .3s ease' }}
                onFocus={e => e.target.style.borderBottomColor=pk}
                onBlur={e => e.target.style.borderBottomColor='rgba(255,255,255,.08)'} />
            ))}
            <textarea placeholder="Your message" rows="3"
              style={{ background:'transparent',border:'1px solid rgba(255,255,255,.08)',color:wh,
                padding:'.55rem',fontSize:'14px',fontFamily:'Red Hat Display, sans-serif',outline:'none',resize:'none',
                transition:'border-color .3s ease' }}
              onFocus={e => e.target.style.borderColor=pk}
              onBlur={e => e.target.style.borderColor='rgba(255,255,255,.08)'} />
            <button type="submit" style={{ padding:'11px 22px',background:pk,color:'#fff',border:'none',fontSize:'11px',
              fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',cursor:'pointer',transition:'all .3s ease',alignSelf:'flex-start' }}
              onMouseEnter={e => { e.target.style.background='#fff'; e.target.style.color=bg; }}
              onMouseLeave={e => { e.target.style.background=pk; e.target.style.color='#fff'; }}
            >Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );

  /* ═══ LOCATION + MAP ═══ */
  const Location = () => (
    <section id="location" style={{ ...sec(),background:'#07070E',borderTop:'1px solid rgba(255,255,255,.03)' }}>
      <div style={wrap('1100px')}>
        <div className="g2" style={{ display:'grid',gridTemplateColumns:'1fr 1.6fr',gap:'clamp(1.5rem,3vw,3rem)',alignItems:'start' }}>
          <div className="rv">
            <div style={{ width:'28px',height:'2px',background:pk,marginBottom:'1rem' }} />
            <h2 style={heading()}>Find Us</h2>
            <p style={{ ...sub,marginTop:'.3rem',marginBottom:'1.5rem' }}>Indoor turf in Clifton, NJ</p>
            {[
              {l:'Location',v:'Clifton, NJ — Indoor Turf'},
              {l:'Game Days',v:'Mon · Wed · Fri · Sun'},
              {l:'Kickoff',v:'7:00 AM Sharp'},
              {l:'Book Via',v:'OpenSports',link:'https://opensports.net/21fc'},
            ].map((x,i) => (
              <div key={i} style={{ paddingBottom:'.8rem',marginBottom:'.8rem',borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                <div style={{ ...label,fontSize:'9px',marginBottom:'.15rem' }}>{x.l}</div>
                {x.link ? (
                  <a href={x.link} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:'15px',fontWeight:600,color:wh,textDecoration:'none',
                      borderBottom:'1px solid rgba(237,17,113,.25)',paddingBottom:'1px',transition:'border-color .3s ease' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor=pk}
                    onMouseLeave={e => e.currentTarget.style.borderColor='rgba(237,17,113,.25)'}
                  >{x.v}</a>
                ) : <div style={{ fontSize:'15px',fontWeight:600 }}>{x.v}</div>}
              </div>
            ))}
            <a href="https://www.google.com/maps/search/Indoor+Turf+Soccer+Clifton+NJ" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex',alignItems:'center',gap:'.4rem',marginTop:'.8rem',
                padding:'9px 18px',border:'1px solid rgba(237,17,113,.2)',color:wh,fontSize:'11px',fontWeight:600,
                textTransform:'uppercase',letterSpacing:'1.5px',textDecoration:'none',transition:'all .35s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=pk; e.currentTarget.style.background='rgba(237,17,113,.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(237,17,113,.2)'; e.currentTarget.style.background='transparent'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Open in Google Maps
            </a>
          </div>
          <div className="rv d2" style={{ overflow:'hidden',border:'1px solid rgba(255,255,255,.04)',height:'340px' }}>
            <iframe title="21FC — Clifton, NJ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48338.1!2d-74.1637!3d40.8584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f9b4b5cc7c6b%3A0xa27b78b5b3bfc7e!2sClifton%2C%20NJ!5e0!3m2!1sen!2sus!4v1"
              width="100%" height="100%"
              style={{ border:0,display:'block',filter:'invert(90%) hue-rotate(180deg) saturate(.3) brightness(.65)' }}
              allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );

  /* ═══ FOOTER ═══ */
  const Footer = () => (
    <footer style={{ background:bg,borderTop:'1px solid rgba(255,255,255,.04)',padding:'1.8rem 2rem 1rem' }}>
      <div style={{ ...wrap('1100px'),display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem' }}>
        <img src={BASE+'images/logo-full-white.png'} alt="21FC" style={{ height:'26px',width:'auto' }} loading="lazy" />
        <div style={{ display:'flex',gap:'1.5rem' }}>
          {[{t:'Instagram',h:'https://instagram.com/21fc.soccer'},{t:'OpenSports',h:'https://opensports.net/21fc'},{t:'Contact',h:'#join'}].map(l => (
            <a key={l.t} href={l.h} target={l.h.startsWith('#')?'_self':'_blank'} rel="noopener noreferrer"
              style={{ color:mt,textDecoration:'none',fontSize:'12px',fontWeight:500,transition:'color .3s ease' }}
              onMouseEnter={e => e.target.style.color=wh}
              onMouseLeave={e => e.target.style.color=mt}
            >{l.t}</a>
          ))}
        </div>
      </div>
      <div style={{ ...wrap('1100px'),borderTop:'1px solid rgba(255,255,255,.04)',marginTop:'1rem',paddingTop:'.8rem',textAlign:'center' }}>
        <p style={{ fontSize:'11px',color:mt }}>© 2026 21FC. All rights reserved.</p>
      </div>
    </footer>
  );

  /* ═══ PAGE LAYOUT ═══ */
  return (
    <>
      <style>{css}</style>
      {!splashDone && <Splash />}
      <Header />
      <Hero />
      <Stats />
      <About />
      <ImageBand />
      <Schedule />
      <ImageBreak src={BASE+'images/DSC08619.jpg'} pos="center 22%" />
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
