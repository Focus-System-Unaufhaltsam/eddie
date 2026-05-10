// ==========================================
// UNAUFHALTSAM CONFIG
// Change only this file for brand/copy/difficulty tuning.
// ==========================================
window.UNAUFHALTSAM_CONFIG = {
  id: "leaderboard_eddie-v1",
  clientVersion: "eddie-unaufhaltsam-v2.2-one-slot",

  pageTitle: "EDDIE | UNAUFHALTSAM FOCUS SYSTEM",
  brandTitle: "EDDIE UNAUFHALTSAM",
  brandSub: "99% FAIL AT LEVEL 30",
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
  savedText: "RANK LOCKED.",
  noImprovementText: "No improvement. Only your best run counts.",
  networkErrorText: "Network error. Try again.",
  socialRequiredText: "Social @ needs 2 to 30 characters.",
  socialInvalidText: "Letters, numbers, dot and underscore only. @ is optional.",
  oneRankText: "One player. One ranking slot. This device is already locked.",
  slotLockedText: "Ranking slot locked. Only your best run can update it."
};
