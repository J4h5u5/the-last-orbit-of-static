/* ============================================================
   admin login gate
   ============================================================ */

const SESSION_KEY = "jahsus_admin_session";

function Login({ onEnter }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [t, setT] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    // demo creds
    if ((u === "jahsus" || u === "admin") && (p === "emergency" || p === "0601" || p === "alien")) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onEnter();
    } else if (!u && !p) {
      // allow empty submit as demo
      sessionStorage.setItem(SESSION_KEY, "1");
      onEnter();
    } else {
      setErr("> signal mismatch · try: jahsus / emergency");
    }
  };

  const utc = t.toISOString().slice(11, 19);

  return (
    <div className="login-stage">
      <div className="admin-bg" />
      <form className="login-card" onSubmit={submit}>
        <div className="kicker">
          <span className="d" />
          <span>[ restricted · operator only ]</span>
        </div>
        <h1>control room</h1>
        <div className="sub">jahsus.space · admin console v0.2</div>

        <label>callsign</label>
        <input
          autoFocus
          value={u}
          onChange={(e)=>{setU(e.target.value); setErr("");}}
          placeholder="jahsus"
        />

        <label>key / passphrase</label>
        <input
          type="password"
          value={p}
          onChange={(e)=>{setP(e.target.value); setErr("");}}
          placeholder="•••••••••"
        />

        <div className="err">{err || "\u00a0"}</div>

        <button className="enter-btn" type="submit">
          transmit credentials →
        </button>

        <div className="login-meta">
          <span>UTC</span><span className="v">{utc}</span>
          <span>SIGNAL</span><span className="v">steady</span>
          <span>COORD</span><span className="v">54.41N · 25.17E</span>
          <span>BUILD</span><span className="v">0.2.1 · MMXXVI</span>
        </div>

        <div style={{
          marginTop: 18,
          fontSize: 9,
          letterSpacing: "0.18em",
          color: "var(--fg-3)",
          textTransform: "uppercase",
          textAlign: "center",
        }}>
          [hint] empty fields or jahsus / emergency to enter
        </div>
      </form>
    </div>
  );
}

window.Login = Login;
window.SESSION_KEY = SESSION_KEY;
