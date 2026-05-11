// ==========================================
// UNAUFHALTSAM CONFIG
// Change only this file for brand/copy/difficulty tuning.
// ==========================================
window.UNAUFHALTSAM_CONFIG = {
  id: "leaderboard_eddie-v1",
  clientVersion: "eddie-unaufhaltsam-v2.1-social-socialkey-rules-ready",

  pageTitle: "EDDIE | UNAUFHALTSAM FOCUS SYSTEM",
  brandTitle: "EDDIE UNAUFHALTSAM",
  brandSub: "99% SCHEITERN AN LEVEL 30",
  startDesc: "Real life. No staging. Der Hund ist roh. Der Fokus bist du. Ein Fehler beendet das System.",
  startButton: "START SYSTEM",
  boxOverlayText: "FOCUS",
  mythText: "LEVEL 30 WALL: NOCH NICHTS FÜR TOURISTEN",

  brandColor: "#7C3AED",
  logoFileName: "eddie_head",
  logoFallbacks: ["eddie_head.png", "unaufhaltsam_brand.png", "logo.png"],

  minScoreToSave: 4,
  easterEggScore: 29,
  maxLeaderboardEntries: 10,

  quotes: [
    '"Eddie hat nicht geblinzelt. Du schon."',
    '"Netter Start. Aber Level 30 ist keine Komfortzone."',
    '"Jetzt beginnt der mentale Teil. Nicht hektisch werden."',
    '"Stark. Macher-Instinkt ist sichtbar."',
    '"Elite-Bereich. Du kontrollierst das System."',
    '"UNAUFHALTSAM. Du hast die 30er-Wand gebrochen. Respekt."'
  ],

  shareText: "Ich habe die Eddie UNAUFHALTSAM Challenge gespielt. Level 30 ist die Wall.",
  savePrompt: "Sichere deinen Platz im Ranking mit deinem Social @:",
  tooWeakText: "Noch nicht rankingfähig. Erst liefern, dann Namen setzen.",
  savedText: "RANK GESICHERT.",
  noImprovementText: "Keine Verbesserung. Nur dein Bestwert zählt.",
  networkErrorText: "Netzwerkfehler. Versuch es erneut.",
  socialRequiredText: "Social @ braucht 2 bis 30 Zeichen.",
  socialInvalidText: "Nur Buchstaben, Zahlen, Punkt, Unterstrich. @ optional.",
  slotLockedText: "Social-Slot gesperrt. Dieser Handle kann nur noch verbessert werden."
};

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
    if (hint) hint.textContent = cfg.slotLockedText || "Social-Slot gesperrt. Dieser Handle kann nur noch verbessert werden.";
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
    return Object.assign({}, data || {}, {
      docId: finalDocId,
      socialKey: finalDocId,
      clientVersion: cfg.clientVersion || "eddie-unaufhaltsam",
      name: cleanName((data && data.name) || (slot && slot.name)),
      platform: (slot && slot.platform) || (data && data.platform) || "OTHER",
      socialHandle: (slot && slot.socialHandle) || cleanSocialHandle(data && (data.socialHandle || data.socialDisplay || data.handle)),
      socialDisplay: "@" + ((slot && slot.socialHandle) || cleanSocialHandle(data && (data.socialHandle || data.socialDisplay || data.handle)))
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
          if (this && this.parent && this.parent.path === collectionName) {
            return originalSet.call(this, enrichPayload(data, this.id), options);
          }
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
    if (docsGetter && typeof docsGetter.get === "function") {
      Object.defineProperty(proto, "docs", { configurable: true, enumerable: true, get: function() { return dedupeDocs(docsGetter.get.call(this)); } });
    }
    if (typeof originalForEach === "function") {
      proto.forEach = function(callback, thisArg) { dedupeDocs(docsGetter && docsGetter.get ? docsGetter.get.call(this) : []).forEach(doc => callback.call(thisArg, doc)); };
    }
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
