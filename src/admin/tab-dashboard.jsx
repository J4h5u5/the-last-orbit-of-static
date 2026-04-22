/* dashboard tab */

function TabDashboard({ store, update, setTab }) {
  const totalTracks = store.tracks.length;
  const hotTracks = store.tracks.filter(t => t.hot).length;
  const totalFrames = store.gallery.length;
  const totalNotes = store.notes.length;
  const newNotes = store.notes.filter(n => n.id.startsWith("u")).length;

  const recentNotes = [...store.notes].slice(0, 5);

  return (
    <>
      <MHead
        kicker="[ 00 / overview ]"
        title="signal"
        em="status"
        actions={<>
          <button className="btn" onClick={()=>window.open("index.html","_blank")}>
            <span className="dot" /> view site →
          </button>
          <button className="btn primary" onClick={()=>{
            if (confirm("reset all data to defaults? this clears your edits.")) {
              localStorage.removeItem("jahsus_admin_store_v1");
              location.reload();
            }
          }}>
            <span className="dot" /> reset data
          </button>
        </>}
      />

      <div className="dash-grid">
        <Stat k="transmissions" v={totalTracks} sub="tracks in orbit" />
        <Stat k="artifacts"     v={totalFrames} sub="frames archived" />
        <Stat k="signals recv"  v={totalNotes}  sub={`+${newNotes} since session start`} hot />
        <Stat k="hot / new"     v={hotTracks}   sub="flagged as primary" />
      </div>

      <div className="dash-cols">
        <div className="panel">
          <h3>activity <span className="small">last 24h</span></h3>
          {store.activity.map((a, i) => (
            <div key={i} className="feed-row">
              <span className="t">{a.t}</span>
              <span className="v">{a.v}</span>
              <span className={`tag ${a.tag==="HOT"||a.tag==="NEW"?"hot":a.tag==="OK"?"ok":""}`}>{a.tag}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>latest reception <span className="small">{store.notes.length} total</span></h3>
          {recentNotes.map((n) => (
            <div key={n.id} className="feed-row">
              <span className="t">{n.freq}</span>
              <span className="v">
                <span style={{color:"var(--fg-3)"}}>— {n.from} — </span>{n.text}
              </span>
              <span className={`tag ${n.hot?"hot":""}`}>{n.hot?"HOT":"·"}</span>
            </div>
          ))}
          <div style={{marginTop:14,textAlign:"right"}}>
            <button className="btn ghost" onClick={()=>setTab("reception")}>all signals →</button>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ k, v, sub, hot }) {
  const bars = 14;
  return (
    <div className="stat">
      <div className="stat-k">{k}</div>
      <div className={`stat-v ${hot?"hot":""}`}>{String(v).padStart(2,"0")}</div>
      <div className="mini-spec">
        {Array.from({length: bars}).map((_, i) => (
          <span
            key={i}
            className={i < (v % bars) ? "hot" : ""}
            style={{height: `${30 + ((i*7+v*3)%70)}%`}}
          />
        ))}
      </div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

window.TabDashboard = TabDashboard;
