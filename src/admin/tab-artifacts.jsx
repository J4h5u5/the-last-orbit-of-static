/* artifacts (gallery) tab */

const VARIANTS = ["v1","v2","v3","v4","hot"];
const TAGS = ["live","portrait","flyer","record","studio"];
const WIDTHS = [{v:"",l:"standard"},{v:"wide",l:"wide"},{v:"tall",l:"tall"}];

function TabArtifacts({ store, update }) {
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [tag, setTag] = useState("all");
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

  const filtered = tag === "all" ? store.gallery : store.gallery.filter(g => g.tag === tag);

  const del = (id) => {
    if (!confirm("remove this frame?")) return;
    update(s => ({...s, gallery: s.gallery.filter(g => g.id !== id)}));
    toast("DELETED","frame archived");
  };
  const save = (g) => {
    if (g.id) {
      update(s => ({...s, gallery: s.gallery.map(x => x.id===g.id ? g : x)}));
      toast("SAVED", `${g.label} · updated`);
    } else {
      const ng = {...g, id: "g"+Date.now()};
      update(s => ({...s, gallery: [...s.gallery, ng]}));
      toast("ADDED", `${ng.label} · archived`);
    }
    setEditing(null);
  };
  const onDrop = (toIdx) => {
    if (dragIdx === null || dragIdx === toIdx) return;
    update(s => {
      const arr = [...s.gallery];
      const [m] = arr.splice(dragIdx, 1);
      arr.splice(toIdx, 0, m);
      return {...s, gallery: arr};
    });
    setDragIdx(null); setOverIdx(null);
    toast("REORDERED","filmstrip sequence updated");
  };

  return (
    <>
      <MHead
        kicker="[ 02 / artifacts ]"
        title="gallery" em="frames"
        actions={<>
          <button className="btn primary" onClick={()=>setEditing("new")}>
            <span className="dot"/> + new frame
          </button>
        </>}
      />

      <div className="filter-row">
        <div className="chips">
          {["all", ...TAGS].map(tt => (
            <button key={tt} className={`chip-btn ${tag===tt?"active":""}`} onClick={()=>setTag(tt)}>
              {tt} {tt!=="all" && `(${store.gallery.filter(g=>g.tag===tt).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{width:32}}></th>
              <th style={{width:80}}>#</th>
              <th>frame</th>
              <th>tag</th>
              <th>location</th>
              <th>date</th>
              <th>variant</th>
              <th style={{textAlign:"right"}}>actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g, i) => {
              const realIdx = store.gallery.findIndex(x => x.id === g.id);
              return (
                <tr
                  key={g.id}
                  className={`${dragIdx===realIdx?"dragging":""} ${overIdx===realIdx?"drag-over":""}`}
                  draggable
                  onDragStart={()=>setDragIdx(realIdx)}
                  onDragOver={(e)=>{e.preventDefault(); setOverIdx(realIdx);}}
                  onDragLeave={()=>setOverIdx(null)}
                  onDrop={()=>onDrop(realIdx)}
                >
                  <td><span className="drag">⋮⋮</span></td>
                  <td><span className="num">{String(realIdx+1).padStart(3,"0")}</span></td>
                  <td>
                    <span className="plate-chip" style={{
                      background: g.variant==="hot"
                        ? "linear-gradient(135deg, #1a0805, #3a1810 40%, #0a0e1f)"
                        : g.variant==="v1" ? "linear-gradient(135deg, #1a1433, #12132a)"
                        : g.variant==="v2" ? "linear-gradient(200deg, #241a4a, #12132a)"
                        : g.variant==="v3" ? "radial-gradient(ellipse, #2a2d44, #12132a)"
                        : "linear-gradient(170deg, #0a0e1f, #1a1433)"
                    }} />
                    <span className="title">{g.label}</span>
                  </td>
                  <td><span className="chip">{g.tag}</span></td>
                  <td><span className="num" style={{color: g.hot?"var(--accent)":"var(--fg-1)"}}>{g.loc}</span></td>
                  <td><span className="num">{g.date}</span></td>
                  <td><span className={`chip ${g.variant==="hot"?"hot":""}`}>{g.variant}{g.w?`·${g.w}`:""}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn ghost" onClick={()=>setEditing(g)}>edit</button>
                      <button className="btn ghost danger" onClick={()=>del(g.id)}>del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8}><div className="empty"><span className="big">[ no frames ]</span>add a new one to start archiving</div></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <FrameEditor frame={editing==="new"?null:editing} onSave={save} onClose={()=>setEditing(null)} />}
    </>
  );
}

function FrameEditor({ frame, onSave, onClose }) {
  const [f, setF] = useState(frame || {
    tag:"live", loc:"", date: new Date().toISOString().slice(2,10).replaceAll("-","."), variant:"v1", w:"", label:"", hot:false
  });
  const set = (k,v) => setF(p => ({...p, [k]:v}));
  return (
    <div className="drawer-back" onClick={onClose}>
      <div className="drawer" onClick={(e)=>e.stopPropagation()}>
        <div className="dhead">
          <div>
            <div className="kicker">[ {frame?"edit":"new"} · frame ]</div>
            <h3>{frame ? f.label || "untitled" : "new artifact"}</h3>
          </div>
          <button className="dclose" onClick={onClose}>× close</button>
        </div>
        <div className="form-grid">
          <div className="field wide">
            <label>label / caption</label>
            <input value={f.label} onChange={(e)=>set("label",e.target.value)} placeholder="LIVE / FRAME 014" />
          </div>
          <div className="field">
            <label>tag</label>
            <select value={f.tag} onChange={(e)=>set("tag",e.target.value)}>
              {TAGS.map(x=> <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className="field">
            <label>date (yy.mm.dd)</label>
            <input value={f.date} onChange={(e)=>set("date",e.target.value)} placeholder="24.11.03" />
          </div>
          <div className="field wide">
            <label>location / context</label>
            <input value={f.loc} onChange={(e)=>set("loc",e.target.value)} placeholder="KABLYS / vilnius" />
          </div>
          <div className="field">
            <label>variant (visual plate)</label>
            <select value={f.variant} onChange={(e)=>set("variant",e.target.value)}>
              {VARIANTS.map(x=> <option key={x}>{x}</option>)}
            </select>
          </div>
          <div className="field">
            <label>cell width</label>
            <select value={f.w} onChange={(e)=>set("w",e.target.value)}>
              {WIDTHS.map(x=> <option key={x.v} value={x.v}>{x.l}</option>)}
            </select>
          </div>
          <div className="field wide">
            <label>image file</label>
            <div className="dropzone" onClick={()=>alert("[demo] image upload — wire to your backend / s3")}>
              <span className="big">↑ drop photo or click</span>
              .jpg · .png · .webp · auto-processed to film grain
            </div>
          </div>
          <div className="field wide">
            <div className="toggle">
              <div className={`sw ${f.hot?"on":""}`} onClick={()=>set("hot",!f.hot)} />
              <label style={{margin:0}}>flag as HOT (warm variant, featured position)</label>
            </div>
          </div>
        </div>
        <div className="dfoot">
          <div className="meta">id: {f.id || "pending"}</div>
          <div className="dactions">
            <button className="btn" onClick={onClose}>cancel</button>
            <button className="btn primary" onClick={()=>onSave(f)}>save & archive →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TabArtifacts = TabArtifacts;
