/* admin shell: sidebar, tabs, live clock */

function AdminShell({ store, update, onLogout, tab, setTab }) {
  const t = useUTC();
  const utc = t.toISOString().slice(11, 19);
  const sessionMin = Math.floor((Date.now() - store.sessionStart) / 60000);

  const tabs = [
    { id: "dashboard",    idx: "00", label: "overview",     count: null },
    { id: "transmissions",idx: "01", label: "transmissions",count: store.tracks.length },
    { id: "artifacts",    idx: "02", label: "artifacts",    count: store.gallery.length },
    { id: "reception",    idx: "03", label: "reception",    count: store.notes.filter(n=>!n.hidden).length },
  ];

  return (
    <div className="admin-shell">
      <div className="admin-bg" />
      <aside className="admin-side">
        <div className="brand">
          <span className="blink" />
          <div>
            <span className="title">control room</span>
            <span className="sub">jahsus · v0.2</span>
          </div>
        </div>
        <nav>
          {tabs.map(tt => (
            <a key={tt.id} className={tab===tt.id?"active":""} onClick={()=>setTab(tt.id)}>
              <span className="idx">{tt.idx}</span>
              <span>{tt.label}</span>
              {tt.count !== null && <span className="count">{tt.count}</span>}
            </a>
          ))}
        </nav>
        <div className="side-foot">
          <div className="row"><span>UTC</span><span className="v">{utc}</span></div>
          <div className="row"><span>SESSION</span><span className="v">{sessionMin}m</span></div>
          <div className="row"><span>SIGNAL</span><span className="v hot">LIVE</span></div>
          <button className="logout" onClick={onLogout}>▢ end transmission</button>
        </div>
      </aside>

      <main className="admin-main">
        {tab === "dashboard"     && <TabDashboard     store={store} update={update} setTab={setTab} />}
        {tab === "transmissions" && <TabTransmissions store={store} update={update} />}
        {tab === "artifacts"     && <TabArtifacts     store={store} update={update} />}
        {tab === "reception"     && <TabReception     store={store} update={update} />}
      </main>
    </div>
  );
}

function MHead({ kicker, title, em, actions }) {
  return (
    <div className="mhead">
      <div>
        <div className="ktitle">{kicker}</div>
        <h2>{title} {em && <em>{em}</em>}</h2>
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

Object.assign(window, { AdminShell, MHead });
