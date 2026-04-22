/* ============================================================
   data: tracks, gallery, notes, copy
   ============================================================ */

window.DATA = {
  artist: {
    name: "JAHSUS",
    alias: "emergency alien",
    callsign: "JH-001",
    location: "somewhere / everywhere",
    coords: "54°41′N · 25°17′E",
    since: "MMXIX",
    tagline: "transmitting low-frequency signals to the edge of the room",
    genres: ["dub techno", "ambient", "downtempo", "drum & bass", "experimental", "leftfield"],
  },

  tracks: [
    { id: "t1", title: "slow lightning", release: "emergency / 01", bpm: 72, key: "Cm",  dur: "07:14", orbit: 200, size: 28, angle: 18,  color: "#7a5cff", tone: "dub", hot: false },
    { id: "t2", title: "alien lullaby",  release: "vinyl press",    bpm: 84, key: "F#m", dur: "05:48", orbit: 260, size: 34, angle: 74,  color: "#4a8fff", tone: "ambient", hot: false },
    { id: "t3", title: "undertow / b2",  release: "split w/ K.M.",  bpm: 132, key: "Gm", dur: "06:22", orbit: 320, size: 22, angle: 140, color: "#e8e9f3", tone: "techno", hot: false },
    { id: "t4", title: "warning signal", release: "unreleased",     bpm: 174, key: "Am", dur: "04:56", orbit: 380, size: 40, angle: 212, color: "#ff6b35", tone: "dnb",    hot: true  },
    { id: "t5", title: "room tone",      release: "emergency / 02", bpm: 60,  key: "D",  dur: "09:03", orbit: 230, size: 18, angle: 280, color: "#b7bbd1", tone: "amb", hot: false },
    { id: "t6", title: "halogen dust",   release: "single",         bpm: 90,  key: "Em", dur: "05:11", orbit: 340, size: 26, angle: 330, color: "#7a5cff", tone: "downtempo", hot: false },
  ],

  gallery: [
    { id:"g1", tag:"live",     loc:"KABLYS / vilnius",    date:"24.11.03", variant:"v1", w:"wide", label:"LIVE / FRAME 001" },
    { id:"g2", tag:"portrait", loc:"studio / dawn",        date:"24.09.17", variant:"v2", w:"tall", label:"SELF / EXPOSURE" },
    { id:"g3", tag:"flyer",    loc:"emergency alien b2b",  date:"24.10.12", variant:"hot",w:"",     label:"FLYER / NIGHT 12", hot:true },
    { id:"g4", tag:"record",   loc:"press plant / test",   date:"24.06.30", variant:"v3", w:"",     label:"VINYL / TEST PRESS" },
    { id:"g5", tag:"live",     loc:"SALON / warsaw",       date:"24.08.02", variant:"v4", w:"wide", label:"LIVE / FRAME 014" },
    { id:"g6", tag:"studio",   loc:"room 3 / 4am",         date:"24.05.19", variant:"v1", w:"tall", label:"STUDIO / ROOM 3" },
    { id:"g7", tag:"flyer",    loc:"tbc / 25.01.18",       date:"25.01.18", variant:"v2", w:"",     label:"FLYER / UPCOMING" },
    { id:"g8", tag:"live",     loc:"warehouse / berlin",   date:"24.04.07", variant:"hot",w:"wide", label:"LIVE / BERLIN", hot:true },
    { id:"g9", tag:"portrait", loc:"field / nowhere",      date:"24.03.22", variant:"v3", w:"tall", label:"FIELD / LONG EXPOSURE" },
    { id:"g10", tag:"record",  loc:"dub plate",            date:"24.02.11", variant:"v4", w:"",     label:"DUBPLATE / 140 BPM" },
  ],

  notes: [
    { id:"n1", from:"ø / kaunas",       freq:"62 hz",  text:"room tone made my walls vibrate for an hour. thank you.", hot:false },
    { id:"n2", from:"nika",             freq:"174 hz", text:"warning signal set at KABLYS was the only time i felt the floor breathing", hot:true },
    { id:"n3", from:"anon",             freq:"108 hz", text:"dub plate arrived. warped. perfect.", hot:false },
    { id:"n4", from:"m. / warsaw",      freq:"40 hz",  text:"please do not stop.", hot:false },
    { id:"n5", from:"orbit resident",   freq:"222 hz", text:"slow lightning on repeat since october. everything else is noise.", hot:false },
    { id:"n6", from:"lena",             freq:"88 hz",  text:"you made 300 ppl stand perfectly still at 4am. still thinking about it.", hot:false },
    { id:"n7", from:"kurtas",           freq:"50 hz",  text:"the 60bpm section destroyed me in the best way", hot:false },
    { id:"n8", from:"radio operator",   freq:"440 hz", text:"transmission received. signal clear.", hot:true },
    { id:"n9", from:"j.",               freq:"72 hz",  text:"halogen dust is my drive home forever now", hot:false },
    { id:"n10", from:"low end believer",freq:"33 hz",  text:"sub was so deep my glass of water went full dinosaur-footprint", hot:false },
    { id:"n11", from:"signal ghost",    freq:"128 hz", text:"emergency alien should be an actual emergency service", hot:false },
    { id:"n12", from:"a.k.",            freq:"96 hz",  text:"made a whole walk around the lake to one of your mixes. 40 minutes felt like 4.", hot:false },
  ],

  links: [
    { label:"SOUNDCLOUD",  handle:"/jahsus",           url:"#soundcloud" },
    { label:"YOUTUBE",     handle:"/@emergency-alien", url:"#youtube" },
    { label:"INSTAGRAM",   handle:"@jahsus.space",     url:"#instagram" },
    { label:"RA",          handle:"/jahsus",           url:"#ra" },
    { label:"BANDCAMP",    handle:"/emergency-alien",  url:"#bandcamp" },
    { label:"BOOKING",     handle:"booking@...",       url:"#contact" },
  ],

  dates: [
    { d:"25.04.18", city:"BERLIN",  venue:"warehouse / tba", status:"CONFIRMED" },
    { d:"25.05.02", city:"VILNIUS", venue:"KABLYS",           status:"CONFIRMED" },
    { d:"25.05.24", city:"WARSAW",  venue:"smolna",           status:"HOLD" },
    { d:"25.06.14", city:"RIGA",    venue:"tbc",              status:"TBC" },
  ],

  specs: [
    { k:"genre",       v:"dub · ambient · techno · dnb" },
    { k:"mode",        v:"live / dj / hybrid" },
    { k:"format",      v:"analog-first" },
    { k:"tempo range", v:"60 — 174 bpm",  hot:true },
    { k:"duration",    v:"60 — 240 min" },
    { k:"label",       v:"emergency alien" },
  ],
};
