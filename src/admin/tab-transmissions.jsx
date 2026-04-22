/* transmissions (tracks) tab */

const PLANET_COLORS = ["#7a5cff","#4a8fff","#e8e9f3","#ff6b35","#b7bbd1","#c9a2ff","#6de0ff"];
const TONES = ["dub","ambient","techno","dnb","amb","downtempo","experimental"];

function TabTransmissions({ store, update }) {
  const toast = useToast();
  const [editing, setEditing] = useState(null); // track or "new" or null
  const [q, setQ] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const filtered = store.tracks.filter(t =>
    !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.release.toLowerCase().includes(q.toLowerCase())
  );

  const del = (id) => {
    if (!confirm("delete this transmission?")) return;
    update(s => ({...s, tracks: s.tracks.filter(t => t.id !== id)}));
    toast("DELETED","transmission removed from orbit");
  };
  const save = (track) => {
    if (track.id) {
      update(s => ({...s, tracks: s.tracks.map(t => t.id === track.id ? track : t)}));
      toast("SAVED", `${track.title} · updated`);
    } else {
      const nt = {...track, id: "t" + Date.now()};
      update(s => ({...s, tracks: [...s.tracks, nt]}));
      toast("ADDED", `${nt.title} · entered orbit`);
    }
    setEditing(null);
  };
  const toggleHot = (id) => {
    update(s => ({...s, tracks: s.tracks.map(t => t.id===id ? {...t, hot: !t.hot} : t)}));
  };
  const onDrop = (toIdx) => {
    if (dragIdx === null || dragIdx === toIdx) return;
    update(s => {
      const arr = [...s.tracks];
      const [m] = arr.splice(dragIdx, 1);
      arr.splice(toIdx, 0, m);
      return {...s, tracks: arr};
    });
    setDragIdx(null);
    setOverIdx(null);
    toast("REORDERED","orbit sequence updated");
  };

  return (
    <>
      <MHead
        kicker="[ 01 / transmissions ]"
        title="audio" em="orbit"
        actions={<>
          <button className="btn" onClick={()=>{
            toast("SYNC","orbit synced · 6 tracks confirmed");
          }}><span className="dot"/> sync</button>
          <button className="btn primary" onClick={()=>setEditing("new")}>
            <span className="dot"/> + new transmission
          </button>
        </>}
      />

      <div className="filter-row">
        <div className="search">
          <span className="prefix">&gt;</span>
          <input placeholder="search by title or release..." value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{width:32}}></th>
              <th>title</th>
              <th>release</th>
              <th>bpm · key</th>
              <th>duration</th>
              <th>tone</th>
              <th style={{width:120}}>status</th>
              <th style={{textAlign:"right"}}>actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr
                key={t.id}
                className={`${dragIdx===i?"dragging":""} ${overIdx===i?"drag-over":""}`}
                draggable
                onDragStart={()=>setDragIdx(i)}
                onDragOver={(e)=>{e.preventDefault(); setOverIdx(i);}}
                onDragLeave={()=>setOverIdx(null)}
                onDrop={()=>onDrop(i)}
                onDragEnd={()=>{setDragIdx(null); setOverIdx(null);}}
              >
                <td><span className="drag" title="drag to reorder">⋮⋮</span></td>
                <td>
                  <span className="planet-chip" style={{
                    background: t.hot
                      ? `radial-gradient(circle at 30% 30%, #ffc7a3, ${t.color} 50%, ${t.color}88 90%)`
                      : `radial-gradient(circle at 30% 30%, #ffffff33, ${t.color} 60%, #000 120%)`
                  }} />
                  <span className="title">{t.title}</span>
                </td>
                <td><span className="num">{t.release}</span></td>
                <td><span className="num">{t.bpm} · {t.key}</span></td>
                <td><span className="num">{t.dur}</span></td>
                <td>
                  <span className={`chip ${t.hot?"hot":""}`}>{t.tone}</span>
                </td>
                <td>
                  <button className={`chip ${t.hot?"hot":""}`} style={{cursor:"pointer",background:"transparent",font:"inherit"}} onClick={()=>toggleHot(t.id)}>
                    {t.hot ? "★ hot" : "○ standard"}
                  </button>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn ghost" onClick={()=>setEditing(t)}>edit</button>
                    <button className="btn ghost danger" onClick={()=>del(t.id)}>del</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8}><div className="empty"><span className="big">[ no signals ]</span>adjust search or add a new transmission</div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <TrackEditor
          track={editing === "new" ? null : editing}
          onSave={save}
          onClose={()=>setEditing(null)}
        />
      )}
    </>
  );
}

function TrackEditor({ track, onSave, onClose }) {
  const [f, setF] = useState(track || {
    title:"", release:"", bpm: 120, key:"Am", dur:"06:00", tone: "ambient",
    color: PLANET_COLORS[0], orbit: 260, size: 28, angle: Math.floor(Math.random()*360), hot: false
  });
  const set = (k,v) => setF(p => ({...p, [k]:v}));
  return (
    <div className="drawer-back" onClick={onClose}>
      <div className="drawer" onClick={(e)=>e.stopPropagation()}>
        <div className="dhead">
          <div>
            <div className="kicker">[ {track?"edit":"new"} · transmission ]</div>
            <h3>{track ? f.title || "untitled" : "new signal"}</h3>
          </div>
          <button className="dclose" onClick={onClose}>× close</button>
        </div>

        <div className="form-grid">
          <div className="field wide">
            <label>title</label>
            <input value={f.title} onChange={(e)=>set("title",e.target.value)} placeholder="slow lightning" />
          </div>
          <div className="field">
            <label>release</label>
            <input value={f.release} onChange={(e)=>set("release",e.target.value)} placeholder="emergency / 01" />
          </div>
          <div className="field">
            <label>tone</label>
            <select value={f.tone} onChange={(e)=>set("tone",e.target.value)}>
              {TONES.map(x=> <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div className="field">
            <label>bpm</label>
            <input type="number" value={f.bpm} onChange={(e)=>set("bpm",+e.target.value)} />
          </div>
          <div className="field">
            <label>key</label>
            <input value={f.key} onChange={(e)=>set("key",e.target.value)} placeholder="Am" />
          </div>
          <div className="field">
            <label>duration (mm:ss)</label>
            <input value={f.dur} onChange={(e)=>set("dur",e.target.value)} placeholder="06:00" />
          </div>
          <div className="field">
            <label>orbit radius</label>
            <input type="number" value={f.orbit} onChange={(e)=>set("orbit",+e.target.value)} />
          </div>
          <div className="field wide">
            <label>planet color</label>
            <div className="color-dots">
              {PLANET_COLORS.map(c => (
                <span key={c} className={`dot ${f.color===c?"active":""}`}
                  style={{background: `radial-gradient(circle at 30% 30%, #ffffff33, ${c} 60%, #000 120%)`}}
                  onClick={()=>set("color",c)} />
              ))}
            </div>
          </div>
          <div className="field wide">
            <label>audio file</label>
            <div className="dropzone" onClick={()=>alert("[demo] audio upload — wire to your backend / s3")}>
              <span className="big">↑ drop audio or click</span>
              .mp3 · .wav · .flac · up to 200mb · metadata autofilled
            </div>
          </div>
          <div className="field wide">
            <div className="toggle">
              <div className={`sw ${f.hot?"on":""}`} onClick={()=>set("hot",!f.hot)} />
              <label style={{margin:0}}>flag as HOT (orange accent · playing state emphasized)</label>
            </div>
          </div>
        </div>

        <div className="dfoot">
          <div className="meta">id: {f.id || "pending"} · last saved: now</div>
          <div className="dactions">
            <button className="btn" onClick={onClose}>cancel</button>
            <button className="btn primary" onClick={()=>onSave(f)}>save & transmit →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TabTransmissions = TabTransmissions;
