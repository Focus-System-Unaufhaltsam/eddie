# Eddie UNAUFHALTSAM — Upgrade v2

## Was geändert wurde

- **Config entkoppelt:** `config.js` steuert Texte, Brand-Farbe, Ranking-ID, Mindestscore und Difficulty-Parameter. Die Datei lag vorher herum, wurde aber vom Spiel nicht sauber genutzt.
- **Difficulty Curve geschärft:** Frühe Runden sind weniger zufällig-chaotisch, spätere Runden ziehen gezielt an. Die Level-30-Wall bleibt brutal, aber nicht kaputt.
- **Leaderboard sauberer:** Namen werden strenger normalisiert, Ausgabe läuft über DOM-Nodes statt `innerHTML`, und schlechtere Wiederholungen überschreiben keinen Bestwert.
- **Local Best gefixt:** Der Bestwert wird jetzt auch dann gespeichert, wenn jemand seinen Score nicht ins Ranking schreibt.
- **Share-Hebel eingebaut:** Nach dem Run kann der Nutzer die Challenge teilen oder den Text kopieren.
- **Firebase-Regeln beigelegt:** `firestore.rules` begrenzt Schreibzugriffe auf plausible Scores und verhindert einfache Feld-Manipulationen.
- **Datenschutz aktualisiert:** Firebase/Leaderboard/LocalStorage sind jetzt erwähnt. Final rechtlich prüfen lassen.

## Deployment

1. Inhalt dieses Ordners in dein GitHub-Pages-Repo kopieren.
2. Commit + Push.
3. Firebase Console öffnen.
4. Firestore Rules mit dem Inhalt aus `firestore.rules` ersetzen und veröffentlichen.
5. Website hart neu laden.

## Wichtig

GitHub Pages + Firebase Client ist nie vollständig cheat-sicher. Die Regeln reduzieren Billig-Manipulationen, aber echte Verifikation braucht eine Cloud Function oder einen eigenen Server. Für den aktuellen TikTok/Challenge-Use-Case ist dieser Stand ausreichend härter, ohne das System zu überbauen.

## v2.1 Social-Ranking

Neu: Spieler können sich unabhängig von der Plattform mit ihrem Social-@ eintragen.

- Plattform-Auswahl: Auto, TikTok, Instagram, YouTube, X, LinkedIn, Twitch, Other
- Handle-Validierung: 2 bis 30 Zeichen, erlaubt sind Buchstaben, Zahlen, Punkt und Unterstrich
- Ranking-Dokument-ID basiert auf Plattform + Handle, nicht mehr nur auf Anzeigename
- Anzeigename bleibt kurz und clean; Social-@ sorgt für Wiedererkennung und Cross-Plattform-Hype

Wichtig: Nach dem Upload die aktualisierten `firestore.rules` in Firebase übernehmen und veröffentlichen.
