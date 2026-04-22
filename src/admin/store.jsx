/* ============================================================
   admin store — localStorage-backed CRUD for tracks/gallery/notes
   ============================================================ */

const STORAGE_KEY = "jahsus_admin_store_v1";

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // seed from site data
  return {
    tracks: [...window.DATA.tracks],
    gallery: [...window.DATA.gallery],
    notes: window.DATA.notes.map(n => ({ ...n, hidden: false, pinned: n.hot, received: "24.11.0" + (Math.floor(Math.random()*9)+1) })),
    activity: [
      { t: "12:04 UTC", v: "new signal received from low end believer · 33 hz", tag: "NEW" },
      { t: "11:58 UTC", v: "warning signal played 14 times today", tag: "HOT" },
      { t: "11:42 UTC", v: "gallery frame 004 edited · location updated", tag: "EDIT" },
      { t: "10:30 UTC", v: "orbit sync · all 6 transmissions confirmed", tag: "OK" },
      { t: "09:14 UTC", v: "admin session start · callsign JH-001", tag: "OK" },
    ],
    sessionStart: Date.now(),
  };
}

function saveStore(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}

function useStore() {
  const [store, setStore] = useState(loadStore);
  const update = (patch) => {
    setStore(prev => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      saveStore(next);
      return next;
    });
  };
  return [store, update];
}

// toast system
const ToastContext = React.createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((k, v) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { id, k, v }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span className="k">{t.k}</span>
            <span>{t.v}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
const useToast = () => React.useContext(ToastContext);

Object.assign(window, { loadStore, saveStore, useStore, ToastProvider, useToast });
