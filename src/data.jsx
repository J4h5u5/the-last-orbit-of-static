/* ============================================================
   data — fetched from API
   ============================================================ */

window.__dataPromise = (async function () {
  const base = window.API_BASE || "http://localhost:8001";

  try {
    const [artist, tracks, rawGallery, rawNotes, rawDates, links] = await Promise.all([
      fetch(`${base}/api/artist/`).then(r => r.json()),
      fetch(`${base}/api/tracks/`).then(r => r.json()),
      fetch(`${base}/api/gallery/`).then(r => r.json()),
      fetch(`${base}/api/notes/`).then(r => r.json()),
      fetch(`${base}/api/dates/`).then(r => r.json()),
      fetch(`${base}/api/links/`).then(r => r.json()),
    ]);

    window.DATA = {
      artist,
      tracks,
      gallery: rawGallery.map(({ width, ...rest }) => ({ ...rest, w: width })),
      notes:   rawNotes.map(({ from_name, ...rest }) => ({ ...rest, from: from_name })),
      dates:   rawDates.map(({ date, ...rest }) => ({ ...rest, d: date })),
      links,
      specs: [
        { k: "genre",       v: "dub · ambient · techno · dnb" },
        { k: "mode",        v: "live / dj / hybrid" },
        { k: "format",      v: "analog-first" },
        { k: "tempo range", v: "60 — 174 bpm", hot: true },
        { k: "duration",    v: "60 — 240 min" },
        { k: "label",       v: "emergency alien" },
      ],
    };
  } catch (err) {
    console.error("[beacon] API unreachable:", err);
    window.DATA = {
      artist:  { name: "JAHSUS", alias: "emergency alien", callsign: "JH-001", location: "–", coords: "–", since: "MMXIX", tagline: "signal lost", genres: [] },
      tracks:  [],
      gallery: [],
      notes:   [],
      dates:   [],
      links:   [],
      specs:   [],
    };
  }
})();
