/* global React */
const { useState, useEffect, useRef } = React;

// ============= Header =============
function Header({ section, setSection, theme, setTheme }) {
  const items = ['home', 'about', 'services', 'work', 'contact'];
  return (
    <header className="site-header">
      <div className="container nav-row">
        <div className="brand" onClick={() => setSection('home')}>Andy<span className="dot">.</span>Casafranca</div>
        <nav className="nav-links">
          {items.map(it => (
            <a key={it} className={section === it ? 'active' : ''} onClick={() => setSection(it)}>{it}</a>
          ))}
          <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle theme">
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </nav>
      </div>
    </header>
  );
}

// ============= Hero =============
function Hero({ tilt, parallax }) {
  const [typed, setTyped] = useState('');
  const phrases = ['mechatronics engineer', 'embedded systems hacker', 'F1 enthusiast 🏎️', 'biomedical tinkerer'];
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const dirRef = useRef(1);

  useEffect(() => {
    const tick = () => {
      const phrase = phrases[idxRef.current];
      if (dirRef.current === 1) {
        charRef.current++;
        if (charRef.current > phrase.length) { dirRef.current = -1; setTimeout(tick, 1200); return; }
      } else {
        charRef.current--;
        if (charRef.current === 0) { dirRef.current = 1; idxRef.current = (idxRef.current + 1) % phrases.length; }
      }
      setTyped(phrase.slice(0, charRef.current));
      setTimeout(tick, dirRef.current === 1 ? 80 : 30);
    };
    const t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  // 3D tilt on portrait
  const portraitRef = useRef(null);
  useEffect(() => {
    if (!tilt) return;
    const el = portraitRef.current; if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [tilt]);

  // Parallax bg
  const bgRef = useRef(null);
  useEffect(() => {
    if (!parallax) return;
    const onScroll = () => {
      if (bgRef.current) bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [parallax]);

  return (
    <section className="hero" id="home">
      <div className="hero-bg" ref={bgRef}></div>
      <div className="container hero-grid">
        <div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>HI THERE 👋 — LIMA, PERÚ</div>
          <h1>I'm Andy <span className="accent">Casafranca</span><span className="papaya">.</span></h1>
          <p className="subhead">A mechatronics engineering student who thrives at the chaotic intersection of mechanics, electronics, and intelligent systems.</p>
          <div className="typed">&gt; {typed}</div>
          <div className="hero-cta">
            <button className="btn btn-primary">Contact Me <i className="fa-solid fa-arrow-right"></i></button>
            <button className="btn btn-outline">Download CV</button>
          </div>
        </div>
        <div className="hero-portrait" ref={portraitRef}>
          <img src="../../assets/banner.png" alt="Andy" onError={(e) => e.target.style.display = 'none'} />
          <div className="badge"><span className="pulse"></span>Available for projects</div>
        </div>
      </div>
    </section>
  );
}

// ============= Marquee =============
function MarqueeRibbon({ enabled }) {
  if (!enabled) return null;
  const items = ['MECHATRONICS', 'EMBEDDED', 'HACKING', 'F1', 'BIOMEDICAL', 'CONTROL SYSTEMS', 'PERÚ'];
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((s, i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}

// ============= About =============
function About() {
  return (
    <section className="section section--grey" id="about">
      <div className="container about-grid">
        <div className="about-photo">
          <img src="../../assets/about.jpg" alt="Andy" onError={(e) => e.target.style.opacity = .2} />
        </div>
        <div>
          <div className="eyebrow">ABOUT ME</div>
          <h2>Engineer who also has a soul.</h2>
          <p style={{ letterSpacing: '1px', lineHeight: 1.9, fontSize: '1.05rem' }}>
            I'm passionate about creating, exploring, and moving — whether it's through engineering challenges, road trips, fast cars, or quiet moments by the ocean. I'm just as comfortable debugging a circuit board as I am polishing a user interface.
          </p>
          <div className="stats">
            <div className="stat"><div className="stat-num">12<span className="plus">+</span></div><div className="stat-label">Projects</div></div>
            <div className="stat"><div className="stat-num">3<span className="plus">+</span></div><div className="stat-label">Years tinkering</div></div>
            <div className="stat"><div className="stat-num">∞</div><div className="stat-label">Cups of coffee</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============= Services =============
function Services() {
  const items = [
    { num: '01', icon: 'fa-microchip', title: 'Embedded Systems & Automation', desc: 'Microcontroller firmware, sensor integration, and control algorithms — the brain behind machines.' },
    { num: '02', icon: 'fa-code', title: 'Ethical Hacking & Pen Testing', desc: 'Secure-by-design audits and offensive-security exercises that find the cracks before they widen.' },
    { num: '03', icon: 'fa-brain', title: 'Bioengineering & Instrumentation', desc: 'Biomedical signal pipelines and instruments that turn living systems into useful data.' },
    { num: '04', icon: 'fa-robot', title: 'AI Model Training', desc: 'I train models for different purposes — image classification, signal recognition, and custom datasets — and I love the part where they finally start working.' },
    { num: '05', icon: 'fa-headset', title: 'Customer Service (EN/ES)', desc: 'Bilingual support for US clients in the health-insurance space. Calm under pressure, clear in two languages, and good at turning angry calls into solved problems.' },
  ];
  return (
    <section className="section" id="services">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">WHAT I DO</div>
          <h2>some things i do <span className="lower">— for fun & profit</span></h2>
        </div>
        <div className="services-grid">
          {items.map(it => (
            <div className="service-card" key={it.num}>
              <div className="num">{it.num}</div>
              <div className="ico"><i className={`fa-solid ${it.icon}`}></i></div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============= Portfolio =============
function Portfolio() {
  const [filter, setFilter] = useState('all');
  const projects = [
    { id: 1, cat: 'embedded', img: '../../assets/blog1.jpg', title: 'EEG Headset Controller', desc: 'STM32 + custom analog frontend', badge: '🏆 1st place' },
    { id: 2, cat: 'hacking', img: '../../assets/blog2.jpg', title: 'IoT Camera Audit', desc: 'CVE writeup & exploit POC', badge: null },
    { id: 3, cat: 'f1', img: '../../assets/first.jpg', title: 'Telemetry Dashboard', desc: 'Live F1 data viz · WebSockets', badge: '🏎️ Featured' },
    { id: 4, cat: 'embedded', img: '../../assets/second.jpg', title: 'Smart Greenhouse', desc: 'ESP32 mesh + soil sensors', badge: null },
    { id: 5, cat: 'side', img: '../../assets/blog1.jpg', title: 'Custom Mechanical KB', desc: 'Hand-wired QMK board', badge: null },
    { id: 6, cat: 'hacking', img: '../../assets/blog2.jpg', title: 'Phishing Sim Platform', desc: 'Internal red-team tool', badge: '🔧 OSS' },
  ];
  const filters = ['all', 'embedded', 'hacking', 'f1', 'side'];
  const visible = filter === 'all' ? projects : projects.filter(p => p.cat === filter);
  return (
    <section className="section section--grey" id="work">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">SELECTED WORK</div>
          <h2>some projects <span className="lower">ツ</span></h2>
        </div>
        <div className="filter-row">
          {filters.map(f => (
            <button key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="portfolio-grid">
          {visible.map(p => (
            <div className="portfolio-item" key={p.id}>
              {p.badge && <div className="badge">{p.badge}</div>}
              <img src={p.img} alt={p.title} onError={(e) => e.target.style.background = '#0aa697'} />
              <div className="overlay">
                <h5>{p.title}</h5>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============= Contact =============
function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">GET IN TOUCH</div>
          <h2>let's build something <span className="lower">— or just chat F1</span></h2>
        </div>
        <div className="contact-grid">
          <form onSubmit={(e) => { e.preventDefault(); alert('Demo only — not wired up. Send for real via the contact channels →'); }}>
            <div className="form-row">
              <div className="field"><label>Name</label><input placeholder="Your name" /></div>
              <div className="field"><label>Email</label><input type="email" placeholder="you@domain.com" /></div>
            </div>
            <div className="field" style={{ marginBottom: 16 }}><label>Subject</label><input placeholder="What's this about?" /></div>
            <div className="field" style={{ marginBottom: 20 }}><label>Message</label><textarea placeholder="Tell me about your project, idea, or favorite team principal..."></textarea></div>
            <button className="btn btn-primary" type="submit">Send Message <i className="fa-solid fa-paper-plane"></i></button>
          </form>
          <aside className="contact-aside">
            <h3>Reach out directly</h3>
            <p style={{ color: 'var(--font-color-soft)', fontSize: 14, marginBottom: 16 }}>I usually reply within a day. Faster if there's a Grand Prix that weekend.</p>
            <div className="item">
              <div className="ico"><i className="fa-solid fa-location-dot"></i></div>
              <div><div className="label">Location</div><div className="value">Lima, Perú</div></div>
            </div>
            <div className="item">
              <div className="ico"><i className="fa-solid fa-envelope"></i></div>
              <div><div className="label">Email</div><div className="value">andy@casafranca.dev</div></div>
            </div>
            <div className="item">
              <div className="ico"><i className="fa-solid fa-clock"></i></div>
              <div><div className="label">Timezone</div><div className="value">UTC−5 (PET)</div></div>
            </div>
            <div className="socials">
              <a title="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a title="GitHub"><i className="fa-brands fa-github"></i></a>
              <a title="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a title="YouTube"><i className="fa-brands fa-youtube"></i></a>
              <a title="Steam"><i className="fa-brands fa-steam"></i></a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ============= 3D Flourish (interactive cube — drag, auto-spin resumes after 2s idle) =============
function ThreeDFlourish() {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const rotRef = useRef({ x: -15, y: 25, dragging: false, lx: 0, ly: 0, lastDragEnd: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene) return;

    let raf;
    const tick = () => {
      const r = rotRef.current;
      // Auto-spin when not dragging AND 2 seconds have passed since last drag-end
      const idleMs = performance.now() - r.lastDragEnd;
      if (!r.dragging && idleMs > 2000) {
        r.y += 0.35;
      }
      scene.style.transform = `rotateX(${r.x}deg) rotateY(${r.y}deg)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const getPoint = (e) => {
      if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    };
    const onDown = (e) => {
      const p = getPoint(e);
      rotRef.current.dragging = true;
      rotRef.current.lx = p.x;
      rotRef.current.ly = p.y;
      setHasInteracted(true);
    };
    const onMove = (e) => {
      const r = rotRef.current;
      if (!r.dragging) return;
      const p = getPoint(e);
      r.y += (p.x - r.lx) * 0.5;
      r.x -= (p.y - r.ly) * 0.5;
      r.x = Math.max(-80, Math.min(80, r.x));
      r.lx = p.x;
      r.ly = p.y;
    };
    const onUp = () => {
      if (rotRef.current.dragging) {
        rotRef.current.dragging = false;
        rotRef.current.lastDragEnd = performance.now();
      }
    };

    stage.addEventListener('mousedown', onDown);
    stage.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('mousedown', onDown);
      stage.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow" style={{ color: 'var(--accent-papaya)' }}>BONUS · 3D · INTERACTIVE</div>
          <h2 style={{ color: '#f5f7f8' }}>built with code, <span style={{ color: 'var(--accent-papaya)', fontStyle: 'italic', textTransform: 'lowercase' }}>not pixels</span></h2>
        </div>

        <div className="i3d-stage" ref={stageRef}>
          <div className="i3d-grid"></div>
          <div className="i3d-scene" ref={sceneRef}>
            <div className="i3d-cube">
              <div className="i3d-face" style={{ transform: 'translateZ(90px)' }}>µC</div>
              <div className="i3d-face" style={{ transform: 'rotateY(180deg) translateZ(90px)' }}>F1</div>
              <div className="i3d-face" style={{ transform: 'rotateY(90deg) translateZ(90px)' }}>/dev</div>
              <div className="i3d-face" style={{ transform: 'rotateY(-90deg) translateZ(90px)' }}>EEG</div>
              <div className="i3d-face" style={{ transform: 'rotateX(90deg) translateZ(90px)' }}>AI</div>
              <div className="i3d-face" style={{ transform: 'rotateX(-90deg) translateZ(90px)' }}>{ }</div>
            </div>
          </div>
          <div className="i3d-orb" style={{ top: '20%', right: '12%' }}></div>
          <div className="i3d-orb i3d-orb--small" style={{ bottom: '18%', left: '10%' }}></div>
          <div className={`i3d-hint ${hasInteracted ? 'i3d-hint--faded' : ''}`}>
            <i className="fa-solid fa-hand-pointer"></i> drag me!
          </div>
        </div>
      </div>
    </section>
  );
}

// ============= Footer =============
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <div className="brand">Andy<span className="dot">.</span>Casafranca</div>
        <div className="copy" style={{ marginLeft: 'auto' }}>
          © 2026 · Built with <span className="heart">♥</span> in Lima, Perú · DM Sans + Dosis
        </div>
      </div>
    </footer>
  );
}

// ============= Cursor Halo =============
function CursorHalo({ enabled }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px';
        ref.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);
  if (!enabled) return null;
  return <div className="cursor-halo" ref={ref}></div>;
}

Object.assign(window, { Header, Hero, MarqueeRibbon, About, Services, Portfolio, Contact, ThreeDFlourish, Footer, CursorHalo });
