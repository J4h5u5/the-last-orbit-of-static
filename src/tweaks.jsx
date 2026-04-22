/* ============================================================
   tweaks panel
   ============================================================ */

function TweaksPanel({ tweaks, setTweaks, visible }) {
  const [open, setOpen] = useState(true);

  if (!visible) return null;

  const set = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
    } catch (e) {}
  };

  return (
    <div className={`tweaks-panel ${open?"open":""}`}>
      <div className="tp-head" onClick={()=>setOpen(!open)}>
        <span>▸ tweaks</span>
        <span className="chev">▲</span>
      </div>
      <div className="tp-body">
        <Row label="feedback wall">
          <Opts
            value={tweaks.feedbackStyle}
            onChange={(v)=>set("feedbackStyle",v)}
            options={[["orbit","orbit"],["cassette","tape"],["frequency","freq"]]}
          />
        </Row>
        <Row label="player style">
          <Opts
            value={tweaks.playerStyle}
            onChange={(v)=>set("playerStyle",v)}
            options={[["orbital","orbital"],["minimal","minimal"],["vinyl","vinyl"]]}
          />
        </Row>
        <Row label="gallery style">
          <Opts
            value={tweaks.galleryStyle}
            onChange={(v)=>set("galleryStyle",v)}
            options={[["filmstrip","filmstrip"],["drift","drift"],["bento","bento"]]}
          />
        </Row>
        <Row label={<>dust density <span className="tp-value">{tweaks.dustDensity}</span></>}>
          <input
            type="range" min={40} max={400} step={20}
            value={tweaks.dustDensity}
            onChange={(e)=>set("dustDensity", +e.target.value)}
          />
        </Row>
        <Row label="typography">
          <Opts
            value={tweaks.typePair}
            onChange={(v)=>set("typePair",v)}
            options={[["jetbrains","jetbrains"],["plex","ibm plex"],["space","space mono"],["grotesk","grotesk"]]}
          />
        </Row>
        <Row label="darkness">
          <Opts
            value={tweaks.darkness}
            onChange={(v)=>set("darkness",v)}
            options={[["midnight","midnight"],["deeper","deeper"],["voidblack","void"]]}
          />
        </Row>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="tp-row">
      <div className="tp-label">{label}</div>
      {children}
    </div>
  );
}

function Opts({ value, onChange, options }) {
  return (
    <div className="tp-opts">
      {options.map(([k,lbl]) => (
        <button
          key={k}
          className={`tp-opt ${value===k?"active":""}`}
          onClick={()=>onChange(k)}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}

window.TweaksPanel = TweaksPanel;
