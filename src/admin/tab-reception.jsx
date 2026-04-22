/* reception (comments/feedback) tab */

function TabReception({ store, update }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  const matches = (n) => {
    if (filter === "hidden" && !n.hidden) return false;
    if (filter === "visible" && n.hidden) return false;
    if (filter === "hot" && !n.hot) return false;
    if (q && !n.text.toLowerCase().includes(q.toLowerCase()) && !n.from.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  };
  const filtered = store.notes.filter(matches);

  const toggleHide = (id) => {
    update(s => ({...s, notes: s.notes.map(n => n.id===id ? {...n, hidden: !n.hidden} : n)}));
    toast("UPDATED","signal visibility toggled");
  };
  const toggleHot = (id) => {
    update(s => ({...s, notes: s.notes.map(n => n.id===id ? {...n, hot: !n.hot} : n)}));
  };
  const del = (id) => {
    if (!confirm("permanently delete this signal?")) return;
    update(s => ({...s, notes: s.notes.filter(n => n.id !== id)}));
    toast("DELETED","signal removed from orbit");
  };
  const save = (n) => {
    if (n.id) {
      update(s => ({...s, notes: s.notes.map(x => x.id===n.id ? n : x)}));
      toast("SAVED","signal edited");
    }
    setEditing(null);
  };

  const stats = {
    all: store.notes.length,
    visible: store.notes.filter(n=>!n.hidden).length,
    hidden: store.notes.filter(n=>n.hidden).length,
    hot: store.notes.filter(n=>n.hot).length,
  };

  return (
    <>
      <MHead
        kicker="[ 03 / reception ]"
        title="incoming" em="signals"
        actions={<>
          <button className="btn" onClick={()=>{
            const json = JSON.stringify(store.notes, null, 2);
            navigator.clipboard?.writeText(json);
            toast("COPIED","signals copied as JSON");
          }}><span className="dot"/> export json</button>
        </>}
      />

      <div className="filter-row">
        <div className="search">
          <span className="prefix">&gt;</span>
          <input placeholder="search text or callsign..." value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        <div className="chips">
          {[
            {id:"all",    l:"all",     c:stats.all},
            {id:"visible",l:"visible", c:stats.visible},
            {id:"hidden", l:"hidden",  c:stats.hidden},
            {id:"hot",    l:"hot",     c:stats.hot},
          ].map(x => (
            <button key={x.id} className={`chip-btn ${filter===x.id?"active":""}`} onClick={()=>setFilter(x.id)}>
              {x.l} ({x.c})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty"><span className="big">[ no signals match ]</span>adjust the filters</div>
      ) : (
        <div className="comment-grid">
          {filtered.map(n => (
            <div key={n.id} className={`comment-card ${n.hidden?"hidden-c":""} ${n.hot?"hot":""}`}>
              <div className="c-head">
                <span className="from">{n.from}</span>
                <span className="freq">{n.freq}</span>
              </div>
              <div className="c-body">"{n.text}"</div>
              <div className="c-foot">
                <span className="t">{n.received || "recv " + (n.id.startsWith("u") ? "just now" : "archive")}</span>
                <div className="actions">
                  <button className="btn ghost" onClick={()=>toggleHot(n.id)} title="toggle hot">
                    {n.hot ? "★" : "☆"}
                  </button>
                  <button className="btn ghost" onClick={()=>toggleHide(n.id)} title={n.hidden?"show":"hide"}>
                    {n.hidden ? "◌ show" : "● hide"}
                  </button>
                  <button className="btn ghost" onClick={()=>setEditing(n)}>edit</button>
                  <button className="btn ghost danger" onClick={()=>del(n.id)}>del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <NoteEditor note={editing} onSave={save} onClose={()=>setEditing(null)} />}
    </>
  );
}

function NoteEditor({ note, onSave, onClose }) {
  const [f, setF] = useState({...note});
  const set = (k,v) => setF(p => ({...p, [k]:v}));
  return (
    <div className="drawer-back" onClick={onClose}>
      <div className="drawer" onClick={(e)=>e.stopPropagation()}>
        <div className="dhead">
          <div>
            <div className="kicker">[ edit · signal ]</div>
            <h3>{f.from}</h3>
          </div>
          <button className="dclose" onClick={onClose}>× close</button>
        </div>
        <div className="form-grid">
          <div className="field">
            <label>from / callsign</label>
            <input value={f.from} onChange={(e)=>set("from",e.target.value)} />
          </div>
          <div className="field">
            <label>frequency</label>
            <input value={f.freq} onChange={(e)=>set("freq",e.target.value)} placeholder="108 hz" />
          </div>
          <div className="field wide">
            <label>message</label>
            <textarea value={f.text} onChange={(e)=>set("text",e.target.value)} />
          </div>
          <div className="field wide">
            <div className="toggle">
              <div className={`sw ${f.hot?"on":""}`} onClick={()=>set("hot",!f.hot)} />
              <label style={{margin:0}}>pin as hot · highlight in orbit</label>
            </div>
            <div className="toggle">
              <div className={`sw ${f.hidden?"on":""}`} onClick={()=>set("hidden",!f.hidden)} />
              <label style={{margin:0}}>hide from public orbit</label>
            </div>
          </div>
        </div>
        <div className="dfoot">
          <div className="meta">id: {f.id}</div>
          <div className="dactions">
            <button className="btn" onClick={onClose}>cancel</button>
            <button className="btn primary" onClick={()=>onSave(f)}>save →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TabReception = TabReception;
