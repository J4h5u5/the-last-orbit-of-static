/* admin app root */

function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [store, update] = useStore();
  const [tab, setTab] = useState(() => location.hash.replace("#","") || "dashboard");

  useEffect(() => {
    location.hash = tab;
  }, [tab]);

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) return <Login onEnter={()=>setAuthed(true)} />;

  return (
    <ToastProvider>
      <AdminShell store={store} update={update} tab={tab} setTab={setTab} onLogout={logout} />
    </ToastProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AdminApp />);
