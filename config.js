// ==========================================
// UNAUFHALTSAM CONFIG
// Change only this file for brand/copy/difficulty tuning.
// ==========================================
window.UNAUFHALTSAM_CONFIG = {
  id: "leaderboard_eddie-v1",
  clientVersion: "eddie-unaufhaltsam-v2.1-social-one-slot",

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

  minScoreToSave: 4,       // score 4 = 6 sichtbare Boxes. Hält Spam aus dem Ranking.
  easterEggScore: 29,      // Nach gelöstem 30-Box-Level wird das System beendet.
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
  slotLockedText: "Ranking-Slot gesperrt. Nur dein bestehender Platz kann verbessert werden."
};

// ==========================================
// ONE PLAYER / ONE RANKING SLOT PER BROWSER
// Prevents one person from filling the leaderboard with multiple handles.
// ==========================================
(function installOneSlotGuard() {
  const cfg = window.UNAUFHALTSAM_CONFIG || {};
  const SLOT_KEY = "unaufhaltsam_player_slot_" + (cfg.id || "leaderboard_eddie-v1");
  const PLATFORMS = ["TIKTOK", "INSTAGRAM", "YOUTUBE", "X", "LINKEDIN", "TWITCH", "OTHER"];

  function cleanName(raw) {
    return String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 15) || "PLAYER";
  }

  function cleanSocialHandle(raw) {
    return String(raw || "")
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\?.*$/, "")
      .replace(/#.*$/, "")
      .replace(/^@+/, "")
      .split("/")
      .filter(Boolean)
      .pop()
      .replace(/[^A-Za-z0-9._]/g, "")
      .slice(0, 30);
  }

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

  function makeDocId(platform, handle) {
    return `${platform}_${handle}`.toUpperCase().replace(/[^A-Z0-9_]/g, "_").slice(0, 60);
  }

  function getSlot() {
    try {
      const raw = localStorage.getItem(SLOT_KEY);
      if (!raw) return null;
      const slot = JSON.parse(raw);
      if (!slot || !slot.docId || !slot.socialHandle || !slot.name) return null;
      return {
        docId: String(slot.docId).slice(0, 60),
        name: cleanName(slot.name),
        platform: PLATFORMS.includes(String(slot.platform)) ? String(slot.platform) : "OTHER",
        socialHandle: cleanSocialHandle(slot.socialHandle)
      };
    } catch (e) {
      return null;
    }
  }

  function setSlot(slot) {
    if (!slot || !slot.docId || !slot.socialHandle) return;
    localStorage.setItem(SLOT_KEY, JSON.stringify({
      docId: slot.docId,
      name: slot.name,
      platform: slot.platform,
      socialHandle: slot.socialHandle,
      lockedAt: new Date().toISOString()
    }));
  }

  function captureSlotFromInputs() {
    const nameInput = document.getElementById("nameInput");
    const platformSelect = document.getElementById("platformSelect");
    const socialInput = document.getElementById("socialInput");
    if (!nameInput || !platformSelect || !socialInput) return null;
    const name = cleanName(nameInput.value);
    const platform = detectPlatform(socialInput.value, platformSelect.value);
    const socialHandle = cleanSocialHandle(socialInput.value);
    if (socialHandle.length < 2) return null;
    return { name, platform, socialHandle, docId: makeDocId(platform, socialHandle) };
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
    if (hint) hint.textContent = cfg.slotLockedText || "Ranking-Slot gesperrt. Nur dein bestehender Platz kann verbessert werden.";
  }

  function wrapSaveButton() {
    const saveBtn = document.getElementById("saveScoreBtn");
    if (!saveBtn || saveBtn.dataset.oneSlotGuard === "1") return false;
    if (typeof saveBtn.onclick !== "function") return false;

    const originalSave = saveBtn.onclick;
    saveBtn.dataset.oneSlotGuard = "1";

    saveBtn.onclick = async function guardedSave(event) {
      const lockedSlot = getSlot();
      if (lockedSlot) applySlot(lockedSlot);
      const slotBeforeSave = lockedSlot || captureSlotFromInputs();

      await originalSave.call(this, event);

      window.setTimeout(() => {
        const errorEl = document.getElementById("errorMsg");
        const saveMsg = document.getElementById("saveMsg");
        const hasError = errorEl && errorEl.style.display !== "none" && errorEl.textContent.trim();
        const hasSaved = saveMsg && saveMsg.style.display !== "none" && saveMsg.textContent.trim();
        if (!hasError && hasSaved) {
          const finalSlot = slotBeforeSave || captureSlotFromInputs();
          if (finalSlot) {
            setSlot(finalSlot);
            applySlot(finalSlot);
          }
        }
      }, 250);
    };

    applySlot(getSlot());
    return true;
  }

  function bootGuard() {
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      const done = wrapSaveButton();
      if (done || tries > 40) window.clearInterval(timer);
      applySlot(getSlot());
    }, 250);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootGuard);
  else bootGuard();
})();
