/* ============================================================
   player — 3 variants: orbital / minimal / vinyl
   ============================================================ */

function Player({ style }) {
  const [playingId, setPlayingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const tracks = window.DATA.tracks;

  const playing = tracks.find((t) => t.id === playingId);

  // progress ticker when something is playing
  useEffect(() => {
    if (!playingId) { setProgress(0); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      const durSec = playing ? parseDur(playing.dur) : 300;
      setProgress(Math.min(1, elapsed / durSec));
      if (elapsed < durSec) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playingId]);

  const toggle = (id) => setPlayingId((cur) => (cur === id ? null : id));

  return (
    <section className="section player-section" data-screen-label="02 player" id="transmissions">
      <div className="section-head">
        <span className="idx">02 /</span>
        <span>transmissions</span>
        <div className="line" />
        <span className="meta">{tracks.length} orbits · click planet to play</span>
      </div>

      {style === "orbital" && <OrbitalPlayer tracks={tracks} playingId={playingId} toggle={toggle} />}
      {style === "minimal" && <MinimalPlayer tracks={tracks} playingId={playingId} toggle={toggle} />}
      {style === "vinyl" && <VinylPlayer tracks={tracks} playingId={playingId} toggle={toggle} />}
      <MobileSolar tracks={tracks} playingId={playingId} toggle={toggle} />

      <NowPlaying playing={playing} progress={progress} />
    </section>
  );
}

function parseDur(s) {
  const [m, sec] = s.split(":").map(Number);
  return m * 60 + sec;
}

function MobileSolar({ tracks, playingId, toggle }) {
  const playing = tracks.find(t => t.id === playingId);
  return (
    <div className="m-solar only-mobile">
      <div className="m-solar-core">
        <div className={`sun ${playingId?"playing":""}`} />
        <div className="sun-meta">
          {playing ? (
            <>
              <span className="title">▶ {playing.title}</span>
              {playing.bpm}bpm · {playing.key} · {playing.tone}
            </>
          ) : (
            <>
              <span className="title idle">[ core · idle ]</span>
              tap any planet below to transmit
            </>
          )}
        </div>
      </div>
      {tracks.map((t, i) => (
        <div
          key={t.id}
          className={`m-track ${playingId === t.id ? "playing" : ""}`}
          onClick={() => toggle(t.id)}
        >
          <div
            className="planet-mini"
            style={{
              background: t.hot
                ? `radial-gradient(circle at 30% 30%, #ffc7a3, ${t.color} 50%, ${t.color}88 90%)`
                : `radial-gradient(circle at 30% 30%, #ffffff22, ${t.color} 60%, #000 120%)`,
              boxShadow: `inset -3px -5px 10px rgba(0,0,0,0.6), 0 0 ${playingId===t.id?24:12}px ${t.color}55`,
            }}
          />
          <div className="name">
            {playingId === t.id ? "▶ " : ""}{t.title}
            <span className="sub">
              {t.release} · <span className={t.hot?"hot":""}>{t.tone}</span>
            </span>
          </div>
          <div className="meta-r">
            <span className="dur">{t.dur}</span>
            {t.bpm}bpm · {t.key}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrbitalPlayer({ tracks, playingId, toggle }) {
  const scrollY = useScrollY();
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  useEffect(() => {
    const upd = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // scroll-driven rotation of the whole system
  const baseRot = scrollY * 0.03;

  // rings
  const rings = [150, 200, 260, 320, 380];
  const scale = Math.max(0.3, Math.min(size.w, size.h) / 780);

  return (
    <div className="orbit-stage only-desktop" ref={ref}>
      {rings.map((r, i) => (
        <div
          key={i}
          className={`orbit-ring ${i === 2 ? "pulse" : ""}`}
          style={{ width: r * 2 * scale, height: r * 2 * scale, opacity: 0.25 + i * 0.05 }}
        />
      ))}

      <div className={`sun ${playingId ? "playing" : ""}`} onClick={() => playingId && toggle(playingId)}>
        <div className="sun-label">
          [core] {playingId ? "transmitting" : "idle · click any planet"}
        </div>
      </div>

      {tracks.map((t, i) => {
        const rot = baseRot + t.angle + (i % 2 ? 1 : -1) * scrollY * 0.015;
        const rad = t.orbit * scale;
        const rx = Math.cos((rot * Math.PI) / 180) * rad;
        const ry = Math.sin((rot * Math.PI) / 180) * rad;
        const isPlaying = t.id === playingId;
        return (
          <div key={t.id} className="planet" style={{ transform: `translate(${rx}px, ${ry}px)` }}>
            <div
              className={`body ${isPlaying ? "playing" : ""}`}
              style={{
                width: t.size,
                height: t.size,
                background: t.hot
                  ? `radial-gradient(circle at 30% 30%, #ffc7a3, ${t.color} 50%, ${t.color}88 90%)`
                  : `radial-gradient(circle at 30% 30%, #ffffff22, ${t.color} 60%, #000 120%)`,
              }}
              onClick={() => toggle(t.id)}
              title={`${t.title} · ${t.bpm}bpm`}
            />
            <div className="label" style={{ marginTop: t.size/2 + 12 }}>
              {t.title}
              <span className="sub">
                {t.bpm}bpm · {t.key} · <span className={t.hot?"hot":""}>{t.tone}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MinimalPlayer({ tracks, playingId, toggle }) {
  return (
    <div className="mini-player only-desktop">
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,letterSpacing:"0.2em",color:"var(--fg-3)",textTransform:"uppercase",paddingBottom:12}}>
        <span>TRACKLIST</span><span>BPM · KEY · DUR</span>
      </div>
      {tracks.map((t, i) => (
        <div
          key={t.id}
          className={`track-row ${playingId === t.id ? "playing" : ""}`}
          onClick={() => toggle(t.id)}
        >
          <div className="num">{String(i+1).padStart(2,"0")}</div>
          <div className="name">
            {playingId === t.id ? "▶ " : ""}{t.title}
            <span className="sub">{t.release}</span>
          </div>
          <div className="dur" style={{color: t.hot?"var(--accent)":"var(--fg-2)"}}>
            {t.bpm} · {t.key}
          </div>
          <div className="dur">{t.dur}</div>
        </div>
      ))}
    </div>
  );
}

function VinylPlayer({ tracks, playingId, toggle }) {
  const anyPlaying = !!playingId;
  return (
    <div className="vinyl-player only-desktop">
      <div className={`vinyl ${anyPlaying ? "playing" : ""}`} />
      <div>
        <div style={{fontSize:10,letterSpacing:"0.25em",color:"var(--fg-3)",textTransform:"uppercase",marginBottom:16}}>
          ▷ SIDE A · PRESS PLAY
        </div>
        {tracks.map((t, i) => (
          <div
            key={t.id}
            onClick={() => toggle(t.id)}
            style={{
              display:"grid",
              gridTemplateColumns:"24px 1fr auto",
              gap:16,
              padding:"10px 0",
              borderBottom:"1px dashed var(--fg-4)",
              cursor:"pointer",
              color: playingId===t.id ? "var(--accent)" : "var(--fg-1)"
            }}
          >
            <span style={{fontVariantNumeric:"tabular-nums",color:"var(--fg-3)"}}>a{i+1}</span>
            <span>{playingId===t.id ? "▶ " : "· "}{t.title}</span>
            <span style={{fontVariantNumeric:"tabular-nums",color:"var(--fg-2)"}}>{t.dur}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NowPlaying({ playing, progress }) {
  if (!playing) return null;
  return (
    <div className="now-playing">
      <div className="tick" />
      <div className="np-text">
        <span className="title">{playing.title}</span>
        <span style={{color:"var(--fg-3)"}}> / </span>
        <span className="bpm">{playing.bpm}bpm</span>
        <span style={{color:"var(--fg-3)"}}> · </span>
        <span>{playing.key}</span>
      </div>
      <div className="np-progress" style={{ width: `${progress*100}%` }} />
    </div>
  );
}

window.Player = Player;
