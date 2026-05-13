// ==========================================
// UNAUFHALTSAM CONFIG
// Change only this file for brand/copy/difficulty tuning.
// Public UI copy is English. UNAUFHALTSAM remains the only German public word.
// ==========================================
window.UNAUFHALTSAM_CONFIG = {
  id: "leaderboard_eddie-v1",
  clientVersion: "eddie-v2.2-story-rank",

  pageTitle: "EDDIE | UNAUFHALTSAM FOCUS SYSTEM",
  brandTitle: "EDDIE UNAUFHALTSAM",
  brandSub: "99% FAIL AT LEVEL 30",
  startDesc: "Real life. No staging. The dog stays raw. The focus is yours. One mistake ends the system.",
  startButton: "START SYSTEM",
  boxOverlayText: "FOCUS",
  mythText: "LEVEL 30 WALL: NOT FOR TOURISTS",

  brandColor: "#7C3AED",
  logoFileName: "eddie_head",
  logoFallbacks: ["eddie_head.png", "unaufhaltsam_brand.png", "logo.png"],

  minScoreToSave: 4,
  easterEggScore: 29,
  maxLeaderboardEntries: 10,

  quotes: [
    '"Eddie did not blink. You did."',
    '"Nice start. Level 30 is not comfort."',
    '"Now the mental part begins. Do not rush."',
    '"Strong. Maker instinct is visible."',
    '"Elite zone. You control the system."',
    '"UNAUFHALTSAM. You broke the Level 30 wall. Respect."'
  ],

  shareText: "I played the Eddie UNAUFHALTSAM Challenge. Level 30 is the wall. Screenshot your run. Tag @eddie_unaufhaltsam.",
  storyShoutoutText: "Screenshot your run. Tag @eddie_unaufhaltsam. Eddie sees your focus.",
  savePrompt: "Lock your rank with your social @:",
  tooWeakText: "Not rank-ready. Deliver first.",
  savedText: "RANK LOCKED. Screenshot your run. Tag @eddie_unaufhaltsam.",
  noImprovementText: "No improvement. Only your best run counts.",
  networkErrorText: "Network error. Try again.",
  socialRequiredText: "Social @ needs 2 to 30 characters.",
  socialInvalidText: "Letters, numbers, dots and underscores only. @ optional.",
  slotLockedText: "Social slot locked. This handle can only be improved."
};

// ==========================================
// HARD MOBILE START FIX
// If the original start button is buried inside the card, this adds a fixed mobile start dock.
// ==========================================
(function installMobileHardStartDock() {
  const css = `
    @media (max-width: 760px) {
      html, body { overflow-x: hidden !important; -webkit-text-size-adjust: 100%; }
      body { padding-left: 8px !important; padding-right: 8px !important; }
      .wrap, main, .app, .container { width: 100% !important; max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
      header, .topbar { gap: 10px !important; align-items: center !important; }
      header h1, .brand-title, h1 { font-size: clamp(28px, 8vw, 42px) !important; line-height: .95 !important; }
      .hud, .stats { gap: 8px !important; }
      .stat { min-width: 0 !important; padding: 10px 6px !important; border-radius: 16px !important; }
      .game-shell, .game-frame, .screen, .canvas-wrap { max-height: none !important; overflow: visible !important; }
      canvas { max-height: 56vh !important; object-fit: contain !important; touch-action: manipulation !important; }
      .overlay { align-items: flex-start !important; justify-content: center !important; overflow-y: auto !important; -webkit-overflow-scrolling: touch !important; padding: 10px !important; }
      .overlay .card, .modal, .game-over-card, .start-card { max-height: calc(100dvh - 105px) !important; overflow-y: auto !important; padding: 14px 12px 76px !important; }
      #startOverlay .card { display: flex !important; flex-direction: column !important; gap: 10px !important; }
      #startBtn { order: -999 !important; margin: 0 0 10px 0 !important; }
      #startBtn, #saveScoreBtn, #restartBtn, .start-button, .save-button, .reboot-button { min-height: 56px !important; font-size: 18px !important; display: flex !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; pointer-events: auto !important; }
      #mobileStartDock { position: fixed !important; left: 12px !important; right: 12px !important; bottom: max(12px, env(safe-area-inset-bottom)) !important; z-index: 2147483000 !important; min-height: 62px !important; border-radius: 16px !important; border: 2px solid #000 !important; background: #7C3AED !important; color: #fff !important; font-size: 19px !important; font-weight: 900 !important; text-transform: uppercase !important; box-shadow: 0 8px 24px rgba(0,0,0,.35) !important; display: flex !important; align-items: center !important; justify-content: center !important; }
      #mobileStartDock.hidden { display: none !important; }
    }
    @media (min-width: 761px) { #mobileStartDock { display:none !important; } }
  `;
  const style = document.createElement("style");
  style.id = "unaufhaltsam-mobile-hard-start-dock";
  style.textContent = css;
  document.head.appendChild(style);

  function isMobile() { return window.matchMedia && window.matchMedia("(max-width: 760px)").matches; }

  function ensureDock() {
    let dock = document.getElementById("mobileStartDock");
    if (!dock) {
      dock = document.createElement("button");
      dock.id = "mobileStartDock";
      dock.type = "button";
      dock.textContent = "START SYSTEM";
      dock.addEventListener("click", function () {
        const startBtn = document.getElementById("startBtn");
        if (startBtn) startBtn.click();
      });
      document.body.appendChild(dock);
    }
    return dock;
  }

  function syncDock() {
    const dock = ensureDock();
    const overlay = document.getElementById("startOverlay");
    const startBtn = document.getElementById("startBtn");
    const visible = isMobile() && overlay && startBtn && !overlay.classList.contains("hidden") && getComputedStyle(overlay).display !== "none";
    dock.classList.toggle("hidden", !visible);
    if (startBtn) {
      startBtn.style.display = "flex";
      startBtn.style.visibility = "visible";
      startBtn.style.opacity = "1";
      startBtn.style.pointerEvents = "auto";
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", syncDock);
  else syncDock();
  window.addEventListener("resize", syncDock);
  window.setInterval(syncDock, 250);
})();

// ==========================================
// SOCIAL KEY RULES ADAPTER
// Keeps Firestore writes compatible with strict socialKey == docId rules.
// ==========================================
(function installSocialKeyRulesAdapter() {
  const cfg = window.UNAUFHALTSAM_CONFIG || {};
  const collectionName = cfg.id || "leaderboard_eddie-v1";
  const SLOT_KEY = "unaufhaltsam_social_slot_" + collectionName;
  const PLATFORMS = ["TIKTOK", "INSTAGRAM", "YOUTUBE", "X", "LINKEDIN", "TWITCH", "OTHER"];

  function cleanName(raw) { return String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 15) || "PLAYER"; }
  function cleanSocialHandle(raw) { return String(raw || "").trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\?.*$/, "").replace(/#.*$/, "").replace(/^@+/, "").split("/").filter(Boolean).pop().replace(/[^A-Za-z0-9._]/g, "").slice(0, 30); }
  function normalizeHandle(raw) { return cleanSocialHandle(raw).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 40); }
  function docIdForHandle(handle) { const n = normalizeHandle(handle); return n ? "SOCIAL_" + n : null; }
  function scoreOf(d) { return Number(d && d.score || 0); }
  function timeOf(d) { const t = Number(d && d.time); return Number.isFinite(t) ? t : 999999999; }
  function rowKeyFromData(d) { const norm = normalizeHandle(d && (d.socialHandle || d.socialDisplay || d.handle || "")); return norm ? "H_" + norm : "N_" + cleanName(d && d.name); }

  function detectPlatform(raw, selected) {
    if (selected && selected !== "AUTO") return selected;
    const value = String(raw || "").toLowerCase();
    if (value.includes("tiktok")) return "TIKTOK";
    if (value.includes("instagram") || value.includes("insta")) return "INSTAGRAM";
    if (value.includes("youtube") || value.includes("youtu.be")) return "YOUTUBE";
    if (value.includes("linkedin")) return "LINKEDIN";
    if (value.includes("twitch")) return "TWITCH";
    if (value.includes("twitter") || value.includes("x.com")) return "X";
    return "OTHER";
  }

  function readInputs() {
    const nameInput = document.getElementById("nameInput");
    const platformSelect = document.getElementById("platformSelect");
    const socialInput = document.getElementById("socialInput");
    if (!nameInput || !platformSelect || !socialInput) return null;
    const socialHandle = cleanSocialHandle(socialInput.value);
    const docId = docIdForHandle(socialHandle);
    if (!docId) return null;
    return { docId, socialKey: docId, name: cleanName(nameInput.value), platform: detectPlatform(socialInput.value, platformSelect.value), socialHandle, normalizedHandle: normalizeHandle(socialHandle) };
  }

  function getSlot() {
    try {
      const slot = JSON.parse(localStorage.getItem(SLOT_KEY) || "null");
      if (!slot || !slot.docId || !slot.socialHandle) return null;
      const docId = docIdForHandle(slot.socialHandle) || String(slot.docId).slice(0, 80);
      return { docId, socialKey: docId, name: cleanName(slot.name), platform: PLATFORMS.includes(String(slot.platform)) ? String(slot.platform) : "OTHER", socialHandle: cleanSocialHandle(slot.socialHandle), normalizedHandle: normalizeHandle(slot.socialHandle) };
    } catch (e) { return null; }
  }

  function setSlot(slot) {
    if (!slot || !slot.docId || !slot.socialHandle) return;
    localStorage.setItem(SLOT_KEY, JSON.stringify({ docId: slot.docId, socialKey: slot.docId, name: slot.name, platform: slot.platform, socialHandle: slot.socialHandle, normalizedHandle: slot.normalizedHandle, lockedAt: new Date().toISOString() }));
  }

  function applySlot(slot) {
    if (!slot) return;
    const nameInput = document.getElementById("nameInput");
    const platformSelect = document.getElementById("platformSelect");
    const socialInput = document.getElementById("socialInput");
    const hint = document.querySelector(".social-hint");
    if (!nameInput || !platformSelect || !socialInput) return;
    nameInput.value = slot.name;
    socialInput.value = "@" + slot.socialHandle;
    platformSelect.value = PLATFORMS.includes(slot.platform) ? slot.platform : "OTHER";
    nameInput.readOnly = true;
    socialInput.readOnly = true;
    platformSelect.disabled = true;
    if (hint) hint.textContent = cfg.slotLockedText || "Social slot locked. This handle can only be improved.";
  }

  function dedupeDocs(docs) {
    try {
      const map = new Map();
      docs.forEach(doc => {
        const d = doc.data ? doc.data() : {};
        const key = rowKeyFromData(d);
        const prev = map.get(key);
        if (!prev) map.set(key, doc);
        else {
          const pd = prev.data ? prev.data() : {};
          if (scoreOf(d) > scoreOf(pd) || (scoreOf(d) === scoreOf(pd) && timeOf(d) < timeOf(pd))) map.set(key, doc);
        }
      });
      return Array.from(map.values()).sort((a, b) => {
        const da = a.data ? a.data() : {};
        const db = b.data ? b.data() : {};
        return scoreOf(db) - scoreOf(da) || timeOf(da) - timeOf(db);
      }).slice(0, cfg.maxLeaderboardEntries || 10);
    } catch (e) { return docs; }
  }

  function enrichPayload(data, docId) {
    const slot = getSlot() || readInputs();
    const finalDocId = (slot && slot.docId) || docId;
    const handle = (slot && slot.socialHandle) || cleanSocialHandle(data && (data.socialHandle || data.socialDisplay || data.handle));
    return Object.assign({}, data || {}, {
      docId: finalDocId,
      socialKey: finalDocId,
      clientVersion: cfg.clientVersion || "eddie-unaufhaltsam",
      name: cleanName((data && data.name) || (slot && slot.name)),
      platform: (slot && slot.platform) || (data && data.platform) || "OTHER",
      socialHandle: handle,
      socialDisplay: "@" + handle
    });
  }

  function installDocInterceptor() {
    if (!window.firebase || !firebase.firestore) return false;
    const colProto = firebase.firestore.CollectionReference && firebase.firestore.CollectionReference.prototype;
    const docProto = firebase.firestore.DocumentReference && firebase.firestore.DocumentReference.prototype;
    if (!colProto || !docProto || typeof colProto.doc !== "function" || typeof docProto.set !== "function") return false;

    if (!colProto.__unaufhaltsamSocialKeyDoc) {
      const originalDoc = colProto.doc;
      colProto.doc = function guardedDoc(path) {
        try {
          if (this && this.path === collectionName) {
            const slot = getSlot() || readInputs();
            if (slot && slot.docId) return originalDoc.call(this, slot.docId);
          }
        } catch (e) {}
        return originalDoc.apply(this, arguments);
      };
      colProto.__unaufhaltsamSocialKeyDoc = true;
    }

    if (!docProto.__unaufhaltsamSocialKeySet) {
      const originalSet = docProto.set;
      docProto.set = function guardedSet(data, options) {
        try {
          if (this && this.parent && this.parent.path === collectionName) return originalSet.call(this, enrichPayload(data, this.id), options);
        } catch (e) {}
        return originalSet.apply(this, arguments);
      };
      docProto.__unaufhaltsamSocialKeySet = true;
    }
    return true;
  }

  function installQueryDedupe() {
    if (!window.firebase || !firebase.firestore) return false;
    const proto = firebase.firestore.QuerySnapshot && firebase.firestore.QuerySnapshot.prototype;
    if (!proto || proto.__unaufhaltsamDedupeDisplay) return !!proto;
    const docsGetter = Object.getOwnPropertyDescriptor(proto, "docs");
    const originalForEach = proto.forEach;
    if (docsGetter && typeof docsGetter.get === "function") Object.defineProperty(proto, "docs", { configurable: true, enumerable: true, get: function() { return dedupeDocs(docsGetter.get.call(this)); } });
    if (typeof originalForEach === "function") proto.forEach = function(callback, thisArg) { dedupeDocs(docsGetter && docsGetter.get ? docsGetter.get.call(this) : []).forEach(doc => callback.call(thisArg, doc)); };
    proto.__unaufhaltsamDedupeDisplay = true;
    return true;
  }

  function wrapSaveButton() {
    const saveBtn = document.getElementById("saveScoreBtn");
    if (!saveBtn || saveBtn.dataset.socialKeyAdapter === "1") return false;
    if (typeof saveBtn.onclick !== "function") return false;
    const originalSave = saveBtn.onclick;
    saveBtn.dataset.socialKeyAdapter = "1";
    saveBtn.onclick = async function guardedSave(event) {
      const locked = getSlot();
      if (locked) applySlot(locked);
      const intended = locked || readInputs();
      await originalSave.call(this, event);
      window.setTimeout(() => {
        const errorEl = document.getElementById("errorMsg");
        const saveMsg = document.getElementById("saveMsg");
        const hasError = errorEl && errorEl.style.display !== "none" && errorEl.textContent.trim();
        const hasSaved = saveMsg && saveMsg.style.display !== "none" && saveMsg.textContent.trim();
        if (!hasError && hasSaved && intended) { setSlot(intended); applySlot(intended); }
      }, 250);
    };
    applySlot(getSlot());
    return true;
  }

  function boot() {
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      installDocInterceptor();
      installQueryDedupe();
      wrapSaveButton();
      applySlot(getSlot());
      if (tries > 100) window.clearInterval(timer);
    }, 100);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

// ==========================================
// PUBLIC COPY GUARD
// Cleans hardcoded legacy text from index.html without changing game logic.
// ==========================================
(function installPublicCopyGuard() {
  const cfg = window.UNAUFHALTSAM_CONFIG || {};
  const replacements = [
    [/SCHEITERN AN/g, "FAIL AT"],
    [/Der Hund ist roh\. Der Fokus bist du\. Ein Fehler beendet das System\./g, "The dog stays raw. The focus is yours. One mistake ends the system."],
    [/Fehler/g, "Mistake"],
    [/Ausreden/g, "Excuses"],
    [/Sichere deinen Platz im Ranking:?/g, "Lock your rank:"],
    [/Lade Ranking\.\.\./g, "Loading ranking..."],
    [/Noch kein Rank gesetzt\./g, "No rank locked yet."],
    [/Ranking aktuell nicht erreichbar\./g, "Ranking unavailable right now."],
    [/Firebase Auth blockiert\. Ranking nicht erreichbar\./g, "Firebase Auth blocked. Ranking unavailable."],
    [/Name braucht mindestens 2 Zeichen\./g, "Name needs at least 2 characters."],
    [/30er-Wand erreicht\. Jetzt Ranking sichern\./g, "Level 30 wall reached. Lock your rank."],
    [/([0-9]+) Boxes bis zur Wall\./g, "$1 boxes to the wall."],
    [/CHALLENGE TEILEN/g, "SHARE CHALLENGE"],
    [/KOPIERT/g, "COPIED"],
    [/ANZEIGENAME/g, "DISPLAY NAME"],
    [/@deinhandle/g, "@yourhandle"],
    [/Plattform egal\. Ein @ reicht\. Beispiel: @eddie_unaufhaltsam/g, "Any platform. One @ is enough. Example: @eddie_unaufhaltsam"],
    [/NOCH NICHTS FÜR TOURISTEN/g, "NOT FOR TOURISTS"],
    [/scheitern an/g, "fail at"],
    [/Ein Fehler beendet das System\./g, "One mistake ends the system."],
    [/ist die Wall/g, "is the wall"]
  ];

  function cleanText(value) {
    let out = String(value || "");
    replacements.forEach(([from, to]) => { out = out.replace(from, to); });
    return out;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function run() {
    document.documentElement.lang = "en";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Eddie UNAUFHALTSAM Focus System. Real life. No staging. Level 30 is the wall.");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", "99% fail at Level 30. One mistake ends the system.");
    setText("uiBrandSub", cfg.brandSub || "99% FAIL AT LEVEL 30");
    setText("uiStartDesc", cfg.startDesc || "Real life. No staging. The dog stays raw. The focus is yours. One mistake ends the system.");
    setText("uiMyth", cfg.mythText || "LEVEL 30 WALL: NOT FOR TOURISTS");
    setText("savePrompt", cfg.savePrompt || "Lock your rank with your social @:");
    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn && shareBtn.textContent.trim() === "CHALLENGE TEILEN") shareBtn.textContent = "SHARE CHALLENGE";
    const nameInput = document.getElementById("nameInput");
    if (nameInput) nameInput.placeholder = "DISPLAY NAME";
    const socialInput = document.getElementById("socialInput");
    if (socialInput) socialInput.placeholder = "@yourhandle";
    const canvas = document.getElementById("gameCanvas");
    if (canvas) canvas.setAttribute("aria-label", "UNAUFHALTSAM Focus Game");
    const hud = document.querySelector("section.hud");
    if (hud) hud.setAttribute("aria-label", "Game status");
    const hint = document.querySelector(".social-hint");
    if (hint) hint.textContent = cleanText(hint.textContent);

    document.querySelectorAll("body *").forEach(el => {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        const cleaned = cleanText(el.textContent);
        if (cleaned !== el.textContent) el.textContent = cleaned;
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  const observer = new MutationObserver(run);
  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
