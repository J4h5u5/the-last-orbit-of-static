/* ============================================================
   app — root
   ============================================================ */

function App() {
  const [tweaks, setTweaks] = useState(window.TWEAKS);
  const [editModeOn, setEditModeOn] = useState(false);

  // announce tweaks capability to parent
  useEffect(() => {
    const onMessage = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setEditModeOn(true);
      if (e.data.type === "__deactivate_edit_mode") setEditModeOn(false);
    };
    window.addEventListener("message", onMessage);
    try {
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    } catch (e) {}
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // apply data attrs for theme
  useEffect(() => {
    document.documentElement.setAttribute("data-type", tweaks.typePair);
    document.documentElement.setAttribute("data-dark", tweaks.darkness);
  }, [tweaks.typePair, tweaks.darkness]);

  return (
    <>
      <Starfield density={tweaks.dustDensity} />
      <ChromeTop />
      <SideRails />

      <main className="stage">
        <div id="intro"><Hero /></div>
        <Player style={tweaks.playerStyle} />
        <Gallery style={tweaks.galleryStyle} />
        <About />
        <Feedback style={tweaks.feedbackStyle} />
        <Footer />
      </main>

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={editModeOn} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
