/* ============================================================
   gallery — 3 variants: filmstrip / drift / bento
   ============================================================ */

function Gallery({ style }) {
  const items = window.DATA.gallery;
  return (
    <section className="section gallery-section" data-screen-label="03 gallery" id="artifacts">
      <div className="section-head">
        <span className="idx">03 /</span>
        <span>artifacts</span>
        <div className="line" />
        <span className="meta">{items.length} frames · recovered</span>
      </div>
      {style === "filmstrip" && <Filmstrip items={items} />}
      {style === "drift" && <DriftGallery items={items} />}
      {style === "bento" && <BentoGallery items={items} />}
    </section>
  );
}

function Filmstrip({ items }) {
  const wrap = useRef(null);
  const track = useRef(null);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  // scroll-coupled horizontal translate (desktop only)
  useEffect(() => {
    if (isMobile) {
      if (track.current) track.current.style.transform = "";
      setProgress(0);
      return;
    }
    let raf;
    const update = () => {
      if (!wrap.current || !track.current) return;
      const r = wrap.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const progressRaw = (vh - r.top) / (r.height + vh);
      const p = Math.max(0, Math.min(1, progressRaw));
      setProgress(p);
      const trackW = track.current.scrollWidth;
      const maxShift = trackW - window.innerWidth + 112;
      track.current.style.transform = `translate3d(${-p * maxShift}px, 0, 0)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { update(); raf = 0; }); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [isMobile]);

  return (
    <div ref={wrap} style={{ position: "relative" }}>
      <div className="gallery-hscroll-hint">
        <span>horizontal drift · scroll to pan →</span>
        <span style={{marginLeft:20, color:"var(--accent)"}}>
          [{String(Math.round(progress * 100)).padStart(3, "0")}%]
        </span>
      </div>
      <div style={{ overflow: "hidden", paddingTop: 28 }}>
        <div className="filmstrip-track" ref={track}>
          {items.map((it, i) => (
            <FilmCell key={it.id} item={it} idx={i} />
          ))}
          <div style={{flexShrink:0, width:120, display:"flex",alignItems:"center",color:"var(--fg-3)",fontSize:10,letterSpacing:"0.3em"}}>
            END / TRANSMISSION
          </div>
        </div>
      </div>
      <div style={{
        marginTop:24, padding:"0 56px", fontSize:10, color:"var(--fg-3)",
        letterSpacing:"0.2em", textTransform:"uppercase"
      }}>
        <div style={{height:1, background:"var(--fg-4)", position:"relative"}}>
          <div style={{
            position:"absolute", top:-3, width:8, height:7,
            background:"var(--accent)", left:`${progress*100}%`, transform:"translateX(-50%)"
          }} />
        </div>
      </div>
    </div>
  );
}

function FilmCell({ item, idx }) {
  return (
    <div className={`film-cell ${item.w}`}>
      <div className={`plate ${item.variant}`} />
      <div className="film-tag">{item.tag}</div>
      <div className="film-num">{String(idx+1).padStart(3,"0")}</div>
      <div className="placeholder-label">
        [ {item.label} ]
        <span className="sub">{item.loc}</span>
      </div>
      <div className="film-caption">
        <span className={item.hot ? "hot" : "loc"}>{item.loc}</span>
        <span>{item.date}</span>
      </div>
    </div>
  );
}

function DriftGallery({ items }) {
  const mouse = useMousePos();
  const scrollY = useScrollY();
  const positions = useMemo(() => items.map((_, i) => ({
    x: 10 + (i * 83) % 85,
    y: 8 + (i * 47) % 78,
    depth: 0.3 + (i % 4) * 0.2,
    rot: (i % 2 ? -1 : 1) * (3 + (i * 7) % 8),
  })), [items]);
  return (
    <div className="drift-grid">
      {items.map((it, i) => {
        const p = positions[i];
        const dx = (mouse.x - 0.5) * 40 * p.depth;
        const dy = (mouse.y - 0.5) * 30 * p.depth - scrollY * 0.05 * p.depth;
        return (
          <div key={it.id} className="drift-tile" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${p.rot}deg)`,
          }}>
            <div className={`plate ${it.variant}`} style={{position:"absolute",inset:0}} />
            <div className="placeholder-label" style={{fontSize:9}}>
              [ {it.label} ]
              <span className="sub">{it.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BentoGallery({ items }) {
  const spans = [
    { c: "span 2", r: "span 2" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 2" },
    { c: "span 2", r: "span 1" }, { c: "span 1", r: "span 2" }, { c: "span 1", r: "span 1" },
    { c: "span 2", r: "span 2" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 1" },
    { c: "span 2", r: "span 1" },
  ];
  return (
    <div className="bento-grid">
      {items.map((it, i) => {
        const s = spans[i % spans.length];
        return (
          <div key={it.id} className="bento-cell" style={{ gridColumn: s.c, gridRow: s.r }}>
            <div className={`plate ${it.variant}`} style={{position:"absolute",inset:0}} />
            <div className="film-tag">{it.tag}</div>
            <div className="film-caption">
              <span className={it.hot?"hot":""}>{it.loc}</span>
              <span>{it.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.Gallery = Gallery;
