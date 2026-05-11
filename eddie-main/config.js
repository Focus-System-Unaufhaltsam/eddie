// ==========================================
// UNAUFHALTSAM CONFIG
// Change only this file for brand/copy/difficulty tuning.
// ==========================================
window.UNAUFHALTSAM_CONFIG = {
  id: "leaderboard_eddie-v1",
  clientVersion: "eddie-unaufhaltsam-v2.5-link-guard",

  pageTitle: "EDDIE | UNAUFHALTSAM FOCUS SYSTEM",
  brandTitle: "EDDIE UNAUFHALTSAM",
  brandSub: "LEVEL 30 IS THE WALL",
  startDesc: "Real life. No staging. The dog is raw. You are the focus. One mistake ends the system.",
  startButton: "START SYSTEM",
  boxOverlayText: "FOCUS",
  mythText: "LEVEL 30 WALL: NOT FOR TOURISTS",

  brandColor: "#7C3AED",
  logoFileName: "eddie_head",
  logoFallbacks: ["eddie_head.png", "unaufhaltsam_brand.png", "logo.png"],

  minScoreToSave: 4,       // score 4 = 6 visible boxes. Keeps spam out of the ranking.
  easterEggScore: 29,      // Ends the system after the 30-box level is solved.
  maxLeaderboardEntries: 10,

  quotes: [
    '"Eddie did not blink. You did."',
    '"Clean start. But Level 30 is not a comfort zone."',
    '"Now the mental part begins. Do not get frantic."',
    '"Strong. Operator instinct is visible."',
    '"Elite zone. You control the system."',
    '"UNAUFHALTSAM. You broke the Level 30 wall. Respect."'
  ],

  shareText: "I played the Eddie UNAUFHALTSAM Challenge. Level 30 is the wall.",
  savePrompt: "Lock your rank with your social @:",
  tooWeakText: "Not leaderboard-ready yet. Deliver first, then claim your name.",
  savedText: "RANK SAVED. LEVEL 30 WAITS.",
  noImprovementText: "No improvement. Only your best run counts.",
  networkErrorText: "Network error. Try again.",
  socialRequiredText: "Social @ needs 2 to 30 characters.",
  socialInvalidText: "Letters, numbers, dot and underscore only. @ is optional.",
  oneRankText: "One player. One ranking slot. This device is already locked.",
  slotLockedText: "Ranking slot locked. Only your best run can update it."
};

// ==========================================
// SILENT SPONSOR-PROOF TRACKING
// Backend-only metrics. No stopwatch pressure in the UI.
// ==========================================
(function installSilentTracking() {
  const cfg = window.UNAUFHALTSAM_CONFIG || {};
  const statsCollection = `stats_${cfg.id || "leaderboard_eddie-v1"}`;
  const sessionsCollection = `sessions_${cfg.id || "leaderboard_eddie-v1"}`;
  const leaderboardCollection = cfg.id || "leaderboard_eddie-v1";

  let sessionStartedAt = 0;
  let attemptsInSession = 0;
  let startTracked = false;
  let saveTracked = false;
  let sessionId = "";

  function getFirebase() {
    if (!window.firebase || !firebase.apps || !firebase.apps.length) return null;
    return {
      db: firebase.firestore(),
      auth: firebase.auth(),
      inc: firebase.firestore.FieldValue.increment,
      ts: firebase.firestore.FieldValue.serverTimestamp
    };
  }

  function makeSessionId() {
    const arr = new Uint32Array(4);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(arr);
    else for (let i = 0; i < arr.length; i += 1) arr[i] = Math.floor(Math.random() * 2 ** 32);
    return Array.from(arr, n => n.toString(16).padStart(8, "0")).join("");
  }

  function getVisibleBoxes() {
    const raw = (document.getElementById("finalScore")?.textContent || "").match(/\d+/);
    return raw ? Number(raw[0]) : 0;
  }

  function getScoreFromBoxes(boxes) {
    if (!Number.isFinite(boxes)) return 0;
    return Math.max(0, Math.min(29, boxes - 2));
  }

  function getTimePlayedMs() {
    return sessionStartedAt ? Math.max(0, Date.now() - sessionStartedAt) : 0;
  }

  async function writeStats(payload) {
    const fb = getFirebase();
    if (!fb) return;
    try {
      await fb.db.collection(statsCollection).doc("global").set(payload, { merge: true });
    } catch (e) {
      console.warn("Silent tracking stats failed", e);
    }
  }

  function trackStart(isRestart) {
    const fb = getFirebase();
    if (!fb) return;

    if (!sessionStartedAt) {
      sessionStartedAt = Date.now();
      sessionId = makeSessionId();
    }

    attemptsInSession += 1;

    if (isRestart) {
      writeStats({
        total_restarts: fb.inc(1),
        updated_at: fb.ts()
      });
      return;
    }

    if (!startTracked) {
      startTracked = true;
      writeStats({
        total_starts: fb.inc(1),
        updated_at: fb.ts()
      });
    }
  }

  function getLockedDocId() {
    try {
      if (typeof window.getLockedPlayerSlot === "function") {
        const slot = window.getLockedPlayerSlot();
        if (slot && slot.docId) return String(slot.docId).slice(0, 120);
      }
    } catch (e) {}
    return null;
  }

  async function trackScoreSave() {
    if (saveTracked) return;

    const fb = getFirebase();
    if (!fb) return;

    const boxes = getVisibleBoxes();
    const score = getScoreFromBoxes(boxes);
    if (score < Number(cfg.minScoreToSave || 0)) return;

    const errorEl = document.getElementById("errorMsg");
    if (errorEl && errorEl.style.display !== "none" && errorEl.textContent.trim()) return;

    saveTracked = true;
    const timePlayedMs = getTimePlayedMs();
    const uid = fb.auth.currentUser ? fb.auth.currentUser.uid : null;
    const docId = getLockedDocId();

    const payload = {
      session_id: sessionId || makeSessionId(),
      score,
      visible_boxes: boxes,
      time_played_ms: timePlayedMs,
      attempts_in_session: attemptsInSession,
      saved_at: fb.ts(),
      source: "github_pages",
      campaign: "level30_wall"
    };

    try {
      await fb.db.collection(statsCollection).doc("global").set({
        score_saves: fb.inc(1),
        total_time_played_ms: fb.inc(timePlayedMs),
        updated_at: fb.ts()
      }, { merge: true });

      if (uid) {
        await fb.db.collection(sessionsCollection).doc(`${uid}_${payload.session_id}`).set({
          ...payload,
          uid
        }, { merge: true });
      }

      // Enrich the actual leaderboard row if the main app has already locked a player slot.
      // Fallback to uid only when no locked slot is available.
      if (docId || uid) {
        await fb.db.collection(leaderboardCollection).doc(docId || uid).set({
          time_played_ms: timePlayedMs,
          attempts_in_session: attemptsInSession,
          last_saved_at: fb.ts()
        }, { merge: true });
      }
    } catch (e) {
      saveTracked = false;
      console.warn("Silent score tracking failed", e);
    }
  }

  function hideStopwatchUI() {
    const finalTime = document.getElementById("finalTime");
    if (finalTime) finalTime.style.display = "none";
  }

  function installListeners() {
    hideStopwatchUI();

    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const saveBtn = document.getElementById("saveScoreBtn");

    if (startBtn && !startBtn.dataset.silentTracking) {
      startBtn.dataset.silentTracking = "1";
      startBtn.addEventListener("click", () => trackStart(false), true);
    }

    if (restartBtn && !restartBtn.dataset.silentTracking) {
      restartBtn.dataset.silentTracking = "1";
      restartBtn.addEventListener("click", () => trackStart(true), true);
    }

    if (saveBtn && !saveBtn.dataset.silentTracking) {
      saveBtn.dataset.silentTracking = "1";
      saveBtn.addEventListener("click", () => {
        window.setTimeout(trackScoreSave, 1200);
      }, false);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installListeners);
  } else {
    installListeners();
  }

  window.setInterval(hideStopwatchUI, 600);
})();
