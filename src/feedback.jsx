/* ============================================================
   feedback — 3 variants: orbit / cassette / frequency
   ============================================================ */

function Feedback({ style }) {
  const initialNotes = window.DATA.notes;
  const [notes, setNotes] = useState(initialNotes);
  const [form, setForm] = useState({ from: "", text: "", freq: 108 });

  const submit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    const n = {
      id: "u" + Date.now(),
      from: form.from.trim() || "anon",
      freq: `${form.freq} hz`,
      text: form.text.trim(),
      hot: Math.random() < 0.15,
    };
    setNotes((prev) => [n, ...prev].slice(0, 20));
    setForm({ from: "", text: "", freq: 108 });
  };

  return (
    <section className="section feedback-section" data-screen-label="05 feedback" id="feedback">
      <div className="feedback-inner">
        <div className="section-head">
          <span className="idx">05 /</span>
          <span>reception / leave a signal</span>
          <div className="line" />
          <span className="meta">{notes.length} received · transmitting since MMXIX</span>
        </div>

        {style === "orbit" && <OrbitNotes notes={notes} />}
        {style === "cassette" && <CassetteWall notes={notes} />}
        {style === "frequency" && <FreqStack notes={notes} />}

        <form className="fb-form" onSubmit={submit}>
          <div className="fb-kicker">[ transmit.signal ] — leave a note at any frequency</div>
          <div className="wide">
            <label>message / transmission</label>
            <textarea
              placeholder="type into the void..."
              value={form.text}
              onChange={(e)=>setForm({...form,text:e.target.value})}
              maxLength={200}
            />
          </div>
          <div>
            <label>from / callsign</label>
            <input
              placeholder="anon"
              value={form.from}
              onChange={(e)=>setForm({...form,from:e.target.value})}
              maxLength={30}
            />
          </div>
          <div>
            <label>tune to frequency</label>
            <div className="freq-pick">
              <input
                type="range"
                min={30} max={440} step={1}
                value={form.freq}
                onChange={(e)=>setForm({...form,freq:+e.target.value})}
              />
              <div className="freq-val">{form.freq} hz</div>
            </div>
          </div>
          <div className="submit-row">
            <div className="hint">
              {form.text.length}/200 · tune low for sub, high for signal
            </div>
            <button type="submit" className="transmit-btn">
              transmit <span className="arrow">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function OrbitNotes({ notes }) {
  const stageRef = useRef(null);
  const [dims, setDims] = useState({ w: 1200, h: 640 });
  useEffect(() => {
    const u = () => {
      if (!stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      setDims({ w: r.width, h: r.height });
    };
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      setT((x) => x + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = dims.w / 2;
  const cy = dims.h / 2;

  return (
    <div className="feedback-stage" ref={stageRef}>
      <div className="center-core">
        <span className="count">{notes.length}</span>
        signals in orbit
      </div>
      {notes.map((n, i) => {
        const angle = (i / notes.length) * Math.PI * 2 + t * 0.0008 * (i % 2 === 0 ? 1 : -0.7);
        const ring = (i % 3) + 1;
        const radX = (dims.w * 0.38) * (0.45 + ring * 0.18);
        const radY = (dims.h * 0.42) * (0.35 + ring * 0.18);
        const x = cx + Math.cos(angle) * radX;
        const y = cy + Math.sin(angle) * radY;
        return (
          <div
            key={n.id}
            className={`fnote ${n.hot ? "hot" : ""}`}
            style={{
              left: x,
              top: y,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <div className="meta">
              <span className="from">{n.from}</span>
              <span className="freq">{n.freq}</span>
            </div>
            <div>{n.text}</div>
          </div>
        );
      })}
    </div>
  );
}

function CassetteWall({ notes }) {
  return (
    <div className="cassette-wall">
      {notes.map((n, i) => (
        <div key={n.id} className="cassette">
          <div className="reels">
            <div className="reel" style={{animation:`spin ${8 + (i%3)*2}s linear infinite`}} />
            <div className="reel" style={{animation:`spin ${8 + (i%3)*2}s linear infinite`}} />
          </div>
          <div className="tape-label">{n.text}</div>
          <div className="tape-meta">
            <span>{n.from}</span>
            <span className={n.hot?"hot":""}>{n.freq}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FreqStack({ notes }) {
  const sorted = [...notes].sort((a,b) => parseInt(a.freq) - parseInt(b.freq));
  return (
    <div className="freq-stack">
      {sorted.map((n) => {
        const hz = parseInt(n.freq);
        const bars = 24;
        const peak = Math.floor((hz / 440) * bars);
        return (
          <div key={n.id} className="freq-row">
            <div className="f">{n.freq}</div>
            <div className="text">
              {n.text}
              <span className="from">— {n.from}</span>
            </div>
            <div className="spec">
              {Array.from({length: bars}).map((_, i) => (
                <span
                  key={i}
                  className={i === peak ? "hot" : ""}
                  style={{ height: `${20 + (Math.sin(i*0.7+hz*0.1)+1)*40}%` }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

window.Feedback = Feedback;
