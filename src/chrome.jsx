/* ============================================================
   chrome: top bar, side rails, footer
   ============================================================ */

function ChromeTop() {
  const t = useUTC();
  const y = useScrollY();
  const isMobile = useIsMobile();
  const [active, setActive] = useState("intro");
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const sections = ["intro","transmissions","artifacts","about","feedback"];
    const onScroll = () => {
      let cur = "intro";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < 200) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const utc = t.toISOString().slice(11, 19);
  const go = (id) => {
    setDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) setTimeout(() => window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" }), 50);
  };

  const items = [
    { id: "intro",         idx: "01", label: "intro" },
    { id: "transmissions", idx: "02", label: "transmissions" },
    { id: "artifacts",     idx: "03", label: "artifacts" },
    { id: "about",         idx: "04", label: "signal" },
    { id: "feedback",      idx: "05", label: "reception" },
  ];

  return (
    <>
      <div className="chrome-top">
        <div className="brand">
          <span className="blink" />
          <span>jahsus · transmission 01</span>
        </div>
        <nav className="only-desktop">
          {items.map((it) => (
            <a key={it.id} className={active===it.id?"active":""} onClick={()=>go(it.id)}>{it.label}</a>
          ))}
        </nav>
        <div className="clock only-desktop">
          {utc} UTC · SY {String(Math.round(y)).padStart(5,"0")}
        </div>
        {isMobile && (
          <button className="m-menu-btn" onClick={()=>setDrawerOpen(true)}>
            <span className="bars"><span/><span/><span/></span>
            <span>menu</span>
          </button>
        )}
      </div>

      {isMobile && (
        <div className={`m-drawer ${drawerOpen?"open":""}`}>
          <button className="close" onClick={()=>setDrawerOpen(false)}>close ×</button>
          {items.map((it) => (
            <a key={it.id} className="m-nav-item" onClick={()=>go(it.id)}>
              <span className="idx">{it.idx}</span>
              <span>{it.label}</span>
              <span className="arrow">→</span>
            </a>
          ))}
          <div className="m-foot">
            <div className="row"><span>UTC</span><span className="v">{utc}</span></div>
            <div className="row"><span>SCROLL·Y</span><span className="v">{String(Math.round(y)).padStart(5,"0")}</span></div>
            <div className="row"><span>SIGNAL</span><span className="v hot">ACTIVE</span></div>
            <div className="row"><span>LAT·LON</span><span className="v">54.41N · 25.17E</span></div>
          </div>
        </div>
      )}
    </>
  );
}

function SideRails() {
  const y = useScrollY();
  return (
    <>
      <div className="side-rail left">
        <div className="ticks">
          <span>LAT 54.41N · LON 25.17E</span>
        </div>
      </div>
      <div className="side-rail right">
        <div className="ticks">
          <span>[ SIGNAL · STATIONARY ORBIT · ACTIVE ]</span>
        </div>
      </div>
    </>
  );
}

function Footer() {
  const d = window.DATA;
  return (
    <footer className="footer">
      <div className="big-logo">jahsus<span style={{color:"var(--accent)"}}>/</span>ea</div>
      <div className="footer-grid">
        <div>
          <h4>transmit</h4>
          <a href="#soundcloud">soundcloud</a>
          <a href="#youtube">youtube</a>
          <a href="#bandcamp">bandcamp</a>
          <a href="#ra">resident advisor</a>
        </div>
        <div>
          <h4>visual</h4>
          <a href="#instagram">instagram</a>
          <a href="#archive">archive</a>
          <a href="#presskit">press kit ↓</a>
        </div>
        <div>
          <h4>contact</h4>
          <a href="#booking">booking@jahsus.space</a>
          <a href="#label">label@emergencyalien.org</a>
          <a href="#press">press@jahsus.space</a>
        </div>
        <div>
          <h4>coordinates</h4>
          <a>25.689° N · 55.738° E</a>
          <a>broadcasting · mmxix — now</a>
          <a>signal strength: steady</a>
        </div>
      </div>
      <div className="bottom-bar">
        <span>© MMXXVI — emergency alien · all frequencies reserved</span>
        <span className="callsign">callsign JH-001 · end of transmission</span>
      </div>
    </footer>
  );
}

Object.assign(window, { ChromeTop, SideRails, Footer });
