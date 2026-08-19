/* ===========================================================
   Emojify-Recon — app.js
   Data alfanumerik A–Z -> { emoji, ucapan, warna, wajah SVG }
   Semua logika berjalan lokal di browser (offline-safe).
=========================================================== */
(() => {
  "use strict";

  /* ---------- small shape helpers (reused across letters) ---------- */
  const heart = (cx, cy, s, fill) =>
    `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0,4 C-6,-3 -14,1 0,10 C14,1 6,-3 0,4 Z" fill="${fill}" stroke="none"/>`;

  const star = (cx, cy, r, fill) => {
    let pts = [];
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.42;
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${cx + rad * Math.cos(ang)},${cy + rad * Math.sin(ang)}`);
    }
    return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="none"/>`;
  };

  const spiral = (cx, cy, scale) =>
    `<path transform="translate(${cx} ${cy}) scale(${scale})" d="M0,0 a3,3 0 1,1 5,-2 a5.5,5.5 0 1,1 -9,4 a8,8 0 1,1 13,-6" fill="none" stroke-width="1.6" stroke-linecap="round"/>`;

  const zzz = () =>
    `<text x="132" y="58" font-family="'Space Mono',monospace" font-size="10" opacity=".85">Z</text>
     <text x="142" y="48" font-family="'Space Mono',monospace" font-size="8" opacity=".65">z</text>
     <text x="150" y="40" font-family="'Space Mono',monospace" font-size="6" opacity=".45">z</text>`;

  const tear = (cx, cy) =>
    `<path d="M${cx},${cy} q-4,7 0,11 q4,-4 0,-11 Z" fill="currentColor" stroke="none" opacity=".85"/>`;

  const sweat = (cx, cy) =>
    `<path d="M${cx},${cy} q-3.5,6 0,9.5 q3.5,-3.5 0,-9.5 Z" fill="currentColor" stroke="none" opacity=".8"/>`;

  /* ================= A–Z reconstruction table ================= */
  const FACES = {
    A: { emoji:"😄", phrase:"hahaha kamu lucu", color:"#5eead4",
      eyes:`<path d="M68,88 Q75,78 82,88" fill="none" stroke-width="3" stroke-linecap="round"/>
            <path d="M118,88 Q125,78 132,88" fill="none" stroke-width="3" stroke-linecap="round"/>`,
      mouth:`<ellipse cx="100" cy="133" rx="20" ry="13" fill="currentColor" opacity=".92"/>
             <line x1="83" y1="127" x2="117" y2="127" stroke="var(--screen)" stroke-width="2.5"/>` },

    B: { emoji:"🥹", phrase:"aku mohon", color:"#6fb3ff",
      eyes:`<circle cx="75" cy="90" r="6" fill="currentColor"/><circle cx="125" cy="90" r="6" fill="currentColor"/>`,
      mouth:`<path d="M86,132 Q93,138 100,132 T114,132" fill="none" stroke-width="2.6" stroke-linecap="round"/>`,
      extrasFront: tear(72,98) + tear(128,98) },

    C: { emoji:"🙂", phrase:"cukup tau", color:"#8fd6c4",
      eyes:`<circle cx="76" cy="89" r="4.4" fill="currentColor"/><circle cx="124" cy="89" r="4.4" fill="currentColor"/>`,
      mouth:`<path d="M85,130 Q100,140 115,130" fill="none" stroke-width="2.8" stroke-linecap="round"/>` },

    D: { emoji:"😉", phrase:"okeyy sayang", color:"#ffb454",
      eyes:`<circle cx="75" cy="89" r="4.6" fill="currentColor"/>
            <path d="M118,89 Q125,84 132,89" fill="none" stroke-width="3" stroke-linecap="round"/>`,
      mouth:`<path d="M84,129 Q100,142 118,127" fill="none" stroke-width="2.8" stroke-linecap="round"/>` },

    E: { emoji:"😌", phrase:"tenang aja", color:"#5eead4",
      eyes:`<path d="M67,90 Q75,94 83,90" fill="none" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M117,90 Q125,94 133,90" fill="none" stroke-width="2.6" stroke-linecap="round"/>`,
      mouth:`<path d="M88,131 Q100,136 112,131" fill="none" stroke-width="2.4" stroke-linecap="round"/>` },

    F: { emoji:"😍", phrase:"aku padamu sayang", color:"#ff6fb0",
      eyes: heart(75,88,1.15,"currentColor") + heart(125,88,1.15,"currentColor"),
      mouth:`<path d="M85,130 Q100,141 115,130" fill="none" stroke-width="2.8" stroke-linecap="round"/>`,
      extrasFront: heart(52,60,.6,"currentColor") + heart(150,55,.5,"currentColor") + heart(146,72,.4,"currentColor") },

    G: { emoji:"😋", phrase:"wenak e rek", color:"#ffb454",
      eyes:`<path d="M68,89 Q75,81 82,89" fill="none" stroke-width="3" stroke-linecap="round"/>
            <path d="M118,89 Q125,81 132,89" fill="none" stroke-width="3" stroke-linecap="round"/>`,
      mouth:`<path d="M83,128 Q100,145 117,128 Q100,133 83,128 Z" fill="currentColor" opacity=".9"/>
             <ellipse cx="103" cy="138" rx="7" ry="5" fill="var(--screen)" opacity=".85"/>` },

    H: { emoji:"😜", phrase:"gak ngurus", color:"#ffb454",
      eyes:`<circle cx="75" cy="89" r="4.6" fill="currentColor"/>
            <path d="M118,89 Q125,84 132,89" fill="none" stroke-width="3" stroke-linecap="round"/>`,
      mouth:`<path d="M84,129 Q100,140 112,131" fill="none" stroke-width="2.6" stroke-linecap="round"/>
             <path d="M100,134 q4,14 12,10 q-2,-9 -12,-10 Z" fill="currentColor" opacity=".9"/>` },

    I: { emoji:"🤨", phrase:"opo maksudmu", color:"#9fb0b6",
      eyes:`<circle cx="75" cy="91" r="4.4" fill="currentColor"/><circle cx="125" cy="91" r="4.4" fill="currentColor"/>
            <line x1="112" y1="79" x2="136" y2="76" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
            <line x1="64" y1="80" x2="86" y2="82" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>`,
      mouth:`<line x1="87" y1="132" x2="113" y2="129" stroke-width="2.6" stroke-linecap="round"/>` },

    J: { emoji:"😎", phrase:"keren kan", color:"#5eead4",
      eyes:`<rect x="62" y="83" width="76" height="14" rx="6" fill="currentColor" opacity=".95"/>
            <line x1="70" y1="88" x2="86" y2="88" stroke="var(--screen)" stroke-width="2" opacity=".7"/>`,
      mouth:`<path d="M84,130 Q100,142 116,129" fill="none" stroke-width="2.8" stroke-linecap="round"/>` },

    K: { emoji:"🤩", phrase:"selamat ya", color:"#ffd166",
      eyes: star(75,88,9,"currentColor") + star(125,88,9,"currentColor"),
      mouth:`<ellipse cx="100" cy="134" rx="14" ry="11" fill="currentColor" opacity=".9"/>`,
      extrasFront:`<g opacity=".8">
          <path d="M50,55 l2,7 l7,2 l-7,2 l-2,7 l-2,-7 l-7,-2 l7,-2 Z" fill="currentColor"/>
          <path d="M150,50 l1.5,5 l5,1.5 l-5,1.5 l-1.5,5 l-1.5,-5 l-5,-1.5 l5,-1.5 Z" fill="currentColor"/>
        </g>` },

    L: { emoji:"😏", phrase:"siapa dulu, Mas Zain gituloh", color:"#c9a6ff",
      eyes:`<line x1="66" y1="90" x2="84" y2="88" stroke-width="2.6" stroke-linecap="round"/>
            <line x1="116" y1="88" x2="134" y2="90" stroke-width="2.6" stroke-linecap="round"/>`,
      mouth:`<path d="M86,132 Q100,132 108,124 Q112,132 96,134 Z" fill="currentColor" opacity=".9"/>` },

    M: { emoji:"😒", phrase:"apalah kau ini", color:"#8fa3ad",
      eyes:`<path d="M65,86 h20" stroke-width="2.4" stroke-linecap="round"/><circle cx="75" cy="92" r="4" fill="currentColor"/>
            <path d="M115,86 h20" stroke-width="2.4" stroke-linecap="round"/><circle cx="129" cy="92" r="4" fill="currentColor"/>`,
      mouth:`<line x1="86" y1="131" x2="114" y2="134" stroke-width="2.6" stroke-linecap="round"/>` },

    N: { emoji:"😭", phrase:"argh (sedih)", color:"#6fb3ff",
      eyes:`<path d="M66,86 Q75,94 84,86" fill="none" stroke-width="3" stroke-linecap="round"/>
            <path d="M116,86 Q125,94 134,86" fill="none" stroke-width="3" stroke-linecap="round"/>`,
      mouth:`<path d="M82,126 Q100,150 118,126 Q100,136 82,126 Z" fill="currentColor" opacity=".92"/>`,
      extrasFront: tear(70,96) + tear(84,102) + tear(130,96) + tear(116,102) },

    O: { emoji:"🤬", phrase:"jancok raimu", color:"#ff5b4a",
      eyes:`<line x1="64" y1="80" x2="86" y2="88" stroke-width="3.2" stroke-linecap="round"/>
            <line x1="136" y1="80" x2="114" y2="88" stroke-width="3.2" stroke-linecap="round"/>
            <circle cx="76" cy="92" r="3.6" fill="currentColor"/><circle cx="124" cy="92" r="3.6" fill="currentColor"/>`,
      mouth:`<path d="M80,124 L120,124 L114,144 L86,144 Z" fill="currentColor" opacity=".92"/>
             <line x1="88" y1="124" x2="88" y2="141" stroke="var(--screen)" stroke-width="2"/>
             <line x1="100" y1="124" x2="100" y2="144" stroke="var(--screen)" stroke-width="2"/>
             <line x1="112" y1="124" x2="112" y2="141" stroke="var(--screen)" stroke-width="2"/>`,
      extrasFront:`<g stroke-width="2.4" stroke-linecap="round" opacity=".8">
          <line x1="46" y1="70" x2="54" y2="78"/><line x1="46" y1="82" x2="55" y2="80"/>
          <line x1="154" y1="70" x2="146" y2="78"/><line x1="154" y1="82" x2="145" y2="80"/>
        </g>` },

    P: { emoji:"😳", phrase:"i-ini beneran?", color:"#ffb454",
      eyes:`<circle cx="75" cy="88" r="9" fill="none" stroke-width="2"/><circle cx="75" cy="88" r="3" fill="currentColor"/>
            <circle cx="125" cy="88" r="9" fill="none" stroke-width="2"/><circle cx="125" cy="88" r="3" fill="currentColor"/>`,
      mouth:`<circle cx="100" cy="133" r="6" fill="currentColor" opacity=".9"/>`,
      extrasFront:`<ellipse cx="62" cy="108" rx="9" ry="5.5" fill="currentColor" opacity=".35"/>
                   <ellipse cx="138" cy="108" rx="9" ry="5.5" fill="currentColor" opacity=".35"/>` },

    Q: { emoji:"🥵", phrase:"panasnyaa", color:"#ff8a4c",
      eyes:`<path d="M67,90 Q75,86 83,90" fill="none" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M117,90 Q125,86 133,90" fill="none" stroke-width="2.4" stroke-linecap="round"/>`,
      mouth:`<ellipse cx="100" cy="134" rx="12" ry="9" fill="currentColor" opacity=".85"/>
             <ellipse cx="100" cy="140" rx="4" ry="5" fill="var(--screen)" opacity=".7"/>`,
      extrasFront: sweat(140,72) +
        `<g stroke-width="2" stroke-linecap="round" opacity=".55" fill="none">
          <path d="M58,52 q4,8 0,16"/><path d="M70,48 q4,8 0,16"/><path d="M130,48 q-4,8 0,16"/>
        </g>` },

    R: { emoji:"🥶", phrase:"dingin banget", color:"#8fe9ff",
      eyes:`<circle cx="75" cy="89" r="7" fill="none" stroke-width="2"/><circle cx="75" cy="89" r="2.6" fill="currentColor"/>
            <circle cx="125" cy="89" r="7" fill="none" stroke-width="2"/><circle cx="125" cy="89" r="2.6" fill="currentColor"/>`,
      mouth:`<path d="M84,131 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4" fill="none" stroke-width="2.4" stroke-linecap="round"/>`,
      extrasFront:`<g fill="currentColor" opacity=".7" font-family="'Space Mono',monospace" font-size="11">
          <text x="52" y="70">❄</text><text x="140" y="66">❄</text>
        </g>` },

    S: { emoji:"😶‍🌫️", phrase:"hm", color:"#9aa7ac",
      eyes:`<circle cx="75" cy="89" r="3.2" fill="currentColor" opacity=".5"/><circle cx="125" cy="89" r="3.2" fill="currentColor" opacity=".5"/>`,
      mouth:`<line x1="93" y1="132" x2="107" y2="132" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>`,
      extrasFront:`<g fill="currentColor" opacity=".22">
          <ellipse cx="82" cy="128" rx="20" ry="9"/><ellipse cx="118" cy="132" rx="18" ry="8"/>
          <ellipse cx="100" cy="120" rx="24" ry="10"/>
        </g>` },

    T: { emoji:"😱", phrase:"Oh My God", color:"#ffd166",
      eyes:`<circle cx="75" cy="86" r="10" fill="none" stroke-width="2.2"/><circle cx="75" cy="86" r="3" fill="currentColor"/>
            <circle cx="125" cy="86" r="10" fill="none" stroke-width="2.2"/><circle cx="125" cy="86" r="3" fill="currentColor"/>
            <path d="M62,70 Q75,62 88,70" fill="none" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M112,70 Q125,62 138,70" fill="none" stroke-width="2.2" stroke-linecap="round"/>`,
      mouth:`<ellipse cx="100" cy="138" rx="14" ry="17" fill="currentColor" opacity=".92"/>
             <ellipse cx="100" cy="144" rx="4" ry="5" fill="var(--screen)" opacity=".8"/>`,
      extrasFront:`<g stroke-width="2" stroke-linecap="round" opacity=".55">
          <line x1="40" y1="100" x2="50" y2="100"/><line x1="150" y1="100" x2="160" y2="100"/>
          <line x1="45" y1="130" x2="53" y2="126"/><line x1="147" y1="126" x2="155" y2="130"/>
        </g>` },

    U: { emoji:"🫡", phrase:"Siap pak ketua", color:"#5eead4",
      eyes:`<circle cx="75" cy="89" r="4" fill="currentColor"/><circle cx="125" cy="89" r="4" fill="currentColor"/>
            <line x1="64" y1="78" x2="86" y2="78" stroke-width="2.2" stroke-linecap="round"/>
            <line x1="114" y1="78" x2="136" y2="78" stroke-width="2.2" stroke-linecap="round"/>`,
      mouth:`<line x1="87" y1="132" x2="113" y2="132" stroke-width="2.8" stroke-linecap="round"/>`,
      extrasFront:`<path d="M148,96 l10,-22 l6,2 l-8,24 Z" fill="currentColor" opacity=".85"/>` },

    V: { emoji:"🤫", phrase:"Shutt anda diam saja", color:"#c084fc",
      eyes:`<path d="M67,90 Q75,86 83,90" fill="none" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M117,90 Q125,86 133,90" fill="none" stroke-width="2.4" stroke-linecap="round"/>`,
      mouth:`<line x1="90" y1="133" x2="110" y2="133" stroke-width="2" stroke-linecap="round" opacity=".5"/>`,
      extrasFront:`<rect x="95" y="112" width="10" height="34" rx="5" fill="currentColor" opacity=".92"/>
          <g stroke-width="1.8" stroke-linecap="round" opacity=".5" fill="none">
            <path d="M112,120 q8,4 8,10"/><path d="M112,132 q9,3 8,11"/>
          </g>` },

    W: { emoji:"🤥", phrase:"aduh ketahuan bohong deh", color:"#c9a6ff",
      eyes:`<path d="M67,91 Q75,87 83,91" fill="none" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M117,88 Q125,86 133,90" fill="none" stroke-width="2.4" stroke-linecap="round"/>`,
      mouth:`<path d="M86,131 Q94,135 101,130 Q107,134 114,129" fill="none" stroke-width="2.4" stroke-linecap="round"/>`,
      extrasFront:`<path d="M133,108 Q158,110 172,104 Q160,116 168,122 Q150,122 133,113 Z" fill="currentColor" opacity=".85"/>` },

    X: { emoji:"🫩", phrase:"(lagak gak percaya)", color:"#8fa3ad",
      eyes:`<line x1="66" y1="87" x2="84" y2="87" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="116" y1="87" x2="134" y2="87" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M65,98 Q75,102 85,98" fill="none" stroke-width="1.8" opacity=".6"/>
            <path d="M115,98 Q125,102 135,98" fill="none" stroke-width="1.8" opacity=".6"/>`,
      mouth:`<line x1="85" y1="132" x2="115" y2="132" stroke-width="2.6" stroke-linecap="round"/>` },

    Y: { emoji:"😴", phrase:"dah aku mau tidur", color:"#b39ddb",
      eyes:`<path d="M67,90 Q75,94 83,90" fill="none" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M117,90 Q125,94 133,90" fill="none" stroke-width="2.6" stroke-linecap="round"/>`,
      mouth:`<ellipse cx="100" cy="132" rx="7" ry="5" fill="currentColor" opacity=".85"/>`,
      extrasFront: zzz() },

    Z: { emoji:"😵‍💫", phrase:"pusing aku", color:"#ff7edb",
      eyes: spiral(75,88,1.4) + spiral(125,88,1.4),
      mouth:`<path d="M86,132 q7,5 14,0 t14,0" fill="none" stroke-width="2.2" stroke-linecap="round"/>`,
      extrasFront:`<g fill="none" stroke-width="1.6" opacity=".55">
          <circle cx="100" cy="55" r="26" stroke-dasharray="4 6"/>
        </g>` },
  };

  /* ---------- audio: short synth "blip" + spoken phrase (offline TTS) ---------- */
  let audioCtx = null;
  function ctx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  const BEEP_BY_MOOD = {
    warm: [660, 880], cool: [440, 520], sad: [330, 220], angry: [180, 120],
    shock: [900, 1200], sleepy: [260, 200], neutral: [500, 500],
  };
  function moodFor(letter) {
    if ("AGKJCDU".includes(letter)) return "warm";
    if ("FEHL".includes(letter)) return "cool";
    if ("BN".includes(letter)) return "sad";
    if ("O".includes(letter)) return "angry";
    if ("PT".includes(letter)) return "shock";
    if ("YZ".includes(letter)) return "sleepy";
    return "neutral";
  }
  function playBeep(letter) {
    try {
      const c = ctx();
      const [f1, f2] = BEEP_BY_MOOD[moodFor(letter)];
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(f1, c.currentTime);
      osc.frequency.linearRampToValueAtTime(f2, c.currentTime + 0.14);
      gain.gain.setValueAtTime(0.06, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.22);
      osc.connect(gain).connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.24);
    } catch (e) { /* audio unavailable — fail silently */ }
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID";
      u.rate = 1.02;
      u.pitch = 1.05;
      window.speechSynthesis.speak(u);
    } catch (e) { /* TTS unavailable — fail silently */ }
  }

  /* ---------- DOM refs ---------- */
  const monitor = document.getElementById("monitor");
  const eyesG = document.getElementById("faceEyes");
  const mouthG = document.getElementById("faceMouth");
  const extrasBackG = document.getElementById("faceExtrasBack");
  const extrasFrontG = document.getElementById("faceExtrasFront");
  const emojiBurst = document.getElementById("emojiBurst");
  const terminalText = document.getElementById("terminalText");
  const logList = document.getElementById("logList");
  const soundToggle = document.getElementById("soundToggle");
  const keypad = document.getElementById("keypad");
  const statusPill = document.getElementById("statusPill");
  const statusDot = document.getElementById("statusDot");
  const statusLabel = document.getElementById("statusLabel");
  const offlineChip = document.getElementById("offlineChip");

  let logCount = 0;

  function reconstruct(letter) {
    const cfg = FACES[letter];
    if (!cfg) return;

    document.documentElement.style.setProperty("--face-color", cfg.color);
    document.documentElement.style.setProperty("--face-glow", cfg.color);

    eyesG.innerHTML = cfg.eyes || "";
    mouthG.innerHTML = cfg.mouth || "";
    extrasBackG.innerHTML = cfg.extrasBack || "";
    extrasFrontG.innerHTML = cfg.extrasFront || "";

    // restart emoji burst animation
    emojiBurst.classList.remove("pop");
    emojiBurst.textContent = cfg.emoji;
    void emojiBurst.offsetWidth; // reflow to restart CSS animation
    emojiBurst.classList.add("pop");

    // glitch shake on the monitor
    monitor.classList.remove("glitch");
    void monitor.offsetWidth;
    monitor.classList.add("glitch");

    terminalText.textContent = `recon("${letter}") → ${cfg.emoji}  "${cfg.phrase}"`;

    if (soundToggle.checked) {
      playBeep(letter);
      speak(cfg.phrase);
    }

    pushLog(letter, cfg);

    const btn = keypad.querySelector(`[data-key="${letter}"]`);
    if (btn) {
      btn.classList.add("pressed");
      setTimeout(() => btn.classList.remove("pressed"), 180);
    }
  }

  function pushLog(letter, cfg) {
    logCount++;
    const li = document.createElement("li");
    const time = new Date().toLocaleTimeString("id-ID", { hour12:false });
    li.innerHTML = `<span class="lg-key">${letter}</span><span class="lg-emoji">${cfg.emoji}</span><span class="lg-phrase">${cfg.phrase}</span><span class="lg-time">${time}</span>`;
    logList.prepend(li);
    while (logList.children.length > 40) logList.removeChild(logList.lastChild);
  }

  /* ---------- build on-screen keypad (fallback for mobile / locked shortcuts) ---------- */
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const btn = document.createElement("button");
    btn.className = "key";
    btn.type = "button";
    btn.dataset.key = letter;
    btn.textContent = letter;
    btn.setAttribute("aria-label", `Rekonstruksi huruf ${letter}`);
    btn.addEventListener("click", () => reconstruct(letter));
    keypad.appendChild(btn);
  }

  /* ---------- CTRL / CMD + letter keyboard trigger ---------- */
  window.addEventListener("keydown", (e) => {
    const letter = e.key.toUpperCase();
    if ((e.ctrlKey || e.metaKey) && letter.length === 1 && letter >= "A" && letter <= "Z") {
      // Some browsers reserve certain combos (Ctrl+N/T/W...) and can't be intercepted —
      // for those the on-screen keypad above is the reliable path.
      e.preventDefault();
      reconstruct(letter);
    }
  });

  /* ---------- boot status + online/offline chip ---------- */
  function setOnlineStatus() {
    const isOnline = navigator.onLine;
    offlineChip.textContent = isOnline ? "● online" : "● offline (cache aktif)";
    offlineChip.classList.toggle("offline", !isOnline);
  }
  window.addEventListener("online", setOnlineStatus);
  window.addEventListener("offline", setOnlineStatus);
  setOnlineStatus();

  statusPill.classList.add("ready");
  statusDot.style.background = "";
  statusLabel.textContent = "REKA siap — 26/26 ekspresi dimuat";

  /* ---------- register service worker for offline use ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* offline-first still works for this load; SW registration retried next visit */
      });
    });
  }
})();
