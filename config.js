// ==========================================
// SYSTEM MASTER CONFIGURATION (White Label)
// ==========================================

const CLIENT_CONFIG = {
    // 1. SYSTEM & DATABASE
    id: "unaufhaltsam-master-v1",   // Eindeutige Firebase ID (keine Leerzeichen)
    brandColor: "#7C3AED",          // Deine Brand-Farbe (Purpur) als Standard
    easterEggScore: 29,             // Sieg nach 30 Kisten (Score 29)

    // 2. BRANDING & IDENTITY (English, except UNAUFHALTSAM)
    brandTitle: "UNAUFHALTSAM",
    brandSub: "PRECISION UNDER PRESSURE",
    startDesc: "Focus the target. Luxury means nothing without focus. Any mistake ends the system.",
    boxOverlayText: "FOCUS",
    
    // 3. REWARDS & RETENTION
    rewardTitle: "ELITE STATUS: CLAIM YOUR REWARD",
    rewardSuccess: "CLAIMED. YOU WILL BE CONTACTED.",

    // 4. PSYCHOLOGICAL QUOTES (The Frustration Curve)
    quotes: [
        '"Focus is a choice. You just chose against it."',                 // 0-5
        '"Consistency separates the wheat from the chaff."',              // 6-10
        '"Waking up. Now the real mental work begins."',                  // 11-15
        '"Strong performance. You are above average."',                   // 16-20
        '"Outstanding. You control the system, not the other way around."',// 21-25
        '"Absolute Elite. You broke the 30-box wall. Respect."'            // 26+
    ],

    // 5. LEGAL (Automatic injection)
    legal: {
        name: "YOUR NAME / COMPANY",
        street: "STREET 123",
        city: "ZIP CITY",
        email: "MAIL@EXAMPLE.COM",
        register: "COMMERCIAL REGISTER XXX",
        ustid: "VAT ID: DE XXX XXX XXX"
    }
};
