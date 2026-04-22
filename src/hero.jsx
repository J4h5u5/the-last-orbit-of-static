/* ============================================================
   hero
   ============================================================ */

function Hero() {
  const scrollY = useScrollY();
  const mouse = useMousePos();
  const t = useUTC();

  // parallax transforms based on scroll
  const nameY = scrollY * 0.25;
  const nameScale = 1 - Math.min(scrollY * 0.0005, 0.15);
  const metaY = scrollY * 0.15;
  const metaOpacity = Math.max(0, 1 - scrollY / 700);

  // mouse subtle translate
  const mx = (mouse.x - 0.5) * 10;
  const my = (mouse.y - 0.5) * 10;

  const utc = t.toISOString().slice(11, 19);

  return (
    <section className="hero section" data-screen-label="01 hero">
      <div className="hero-grid" />

      <div className="hero-pre fadein" style={{ animationDelay: "0.1s" }}>
        <span className="dot" />
        <span>transmission live · {utc} utc</span>
        <span style={{ color: "var(--fg-3)" }}>//</span>
        <span>signal strength ok</span>
      </div>

      <h1
        className="hero-name fadein"
        style={{
          transform: `translate3d(${mx}px, ${-nameY}px, 0) scale(${nameScale})`,
          animationDelay: "0.2s",
        }}
      >
        jahsus<span className="slash">/</span>
        <span className="alt">emergency alien</span>
      </h1>

      <div
        className="hero-meta fadein"
        style={{
          transform: `translate3d(0, ${-metaY}px, 0)`,
          opacity: metaOpacity,
          animationDelay: "0.5s",
        }}
      >
        <div className="block">
          <div className="label">mode</div>
          <div className="value">dj <span style={{color:"var(--fg-3)"}}>/</span> live <span style={{color:"var(--fg-3)"}}>/</span> hybrid</div>
        </div>
        <div className="block">
          <div className="label">range</div>
          <div className="value">60 — <span className="orange">174</span> bpm</div>
        </div>
        <div className="block">
          <div className="label">signal</div>
          <div className="value" style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="wavebars">
              <span /><span /><span /><span className="hot" /><span /><span /><span />
            </div>
            <span style={{fontSize:10,color:"var(--fg-2)"}}>ACTIVE</span>
          </div>
        </div>
        <div className="block">
          <div className="label">located</div>
          <div className="value">25.689° N <span style={{color:"var(--fg-3)"}}>·</span> 55.738° E</div>
        </div>
      </div>

      <div className="scroll-cue fadein" style={{ animationDelay: "1s" }}>
        <span>scroll to receive</span>
        <div className="bar" />
      </div>
    </section>
  );
}

window.Hero = Hero;
