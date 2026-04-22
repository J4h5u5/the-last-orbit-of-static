/* ============================================================
   about
   ============================================================ */

function About() {
  const d = window.DATA;
  const [ref, off] = useParallax(-0.06);
  const scrollY = useScrollY();

  return (
    <section className="section about-section" data-screen-label="04 about" id="about">
      <div className="section-head">
        <span className="idx">04 /</span>
        <span>signal origin</span>
        <div className="line" />
        <span className="meta">who / what / from where</span>
      </div>

      <div className="about-inner">
        <div className="about-side" ref={ref} style={{ transform: `translateY(${off}px)` }}>
          <div className="kicker">[ operator.bio ]</div>
          <h2>
            making <em>slow</em> machines<br/>
            for <span style={{color:"var(--accent)"}}>4am</span> rooms.
          </h2>
          <div className="about-body">
            <p>
              jahsus — also broadcasting as <span className="hot">emergency alien</span> — is a dj, producer and occasional signal-jammer. the work sits between dub techno's long patience, ambient's room-tone, and the high-bpm end of drum & bass, usually within the same set.
            </p>
            <p>
              every set is built analog-first: tape loops, hardware delays, and whatever modular patch survived the night. the goal is never the drop. the goal is the breath between drops.
            </p>
            <p>
              currently transmitting from the baltic coast. available for bookings in rooms with low ceilings, cold floors, and no phones pointed at the booth.
            </p>
          </div>

          <div className="link-grid">
            {d.links.map((l) => (
              <a key={l.label} className="link-pill" href={l.url} target="_blank" rel="noopener">
                <span className="dot" />
                <span>{l.label}</span>
                <span style={{color:"var(--fg-3)"}}>{l.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="about-side">
          <div className="kicker">[ technical.spec ]</div>
          <div className="about-specs">
            {d.specs.map((s, i) => (
              <div key={i} className="row" style={{gridColumn: i < 2 ? "1 / -1" : "auto"}}>
                <span className="k">{s.k}</span>
                <span className={`v ${s.hot ? "hot" : ""}`}>{s.v}</span>
              </div>
            ))}
          </div>

          <div className="kicker" style={{marginTop:48}}>[ upcoming.transmissions ]</div>
          <div style={{marginTop:20}}>
            {d.dates.map((dt, i) => (
              <div key={i} style={{
                display:"grid",
                gridTemplateColumns:"90px 1fr 100px",
                gap:16,
                padding:"14px 0",
                borderBottom:"1px dashed var(--fg-4)",
                fontSize:12,
                alignItems:"center"
              }}>
                <span style={{fontVariantNumeric:"tabular-nums",color:"var(--fg-0)"}}>{dt.d}</span>
                <span>
                  <span style={{color:"var(--fg-0)"}}>{dt.city}</span>
                  <span style={{color:"var(--fg-3)"}}> · {dt.venue}</span>
                </span>
                <span style={{
                  fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",
                  color: dt.status==="CONFIRMED"?"var(--accent)":dt.status==="HOLD"?"var(--fg-1)":"var(--fg-3)"
                }}>
                  {dt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.About = About;
