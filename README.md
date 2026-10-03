# EDDIE UNAUFHALTSAM

**Real life. No staging.**

EDDIE UNAUFHALTSAM ist das Fokus-Game aus Eddie’s World.

Merken. Mischen. Treffen. Ein Fehler beendet den Lauf.

## Projektstatus

Dieses Repository enthält die eigenständige Eddie-/UNAUFHALTSAM-Version des Fokus-Systems inklusive statischem Frontend, Firebase-/Firestore-Anbindung, Social-Ranking, rechtlichen Seiten und den zugehörigen Assets.

Die zentrale Spielversion liegt in `index.html`.

## Spielprinzip

1. Eine Box wird markiert.
2. Die Position muss gemerkt werden.
3. Die Boxen werden gemischt.
4. Die richtige Box muss gewählt werden.
5. Mit jedem erfolgreichen Durchlauf steigt die Schwierigkeit.
6. Ein Fehler beendet den Lauf.

Die Schwierigkeit steigt gezielt bis zur Level-30-Wall.

## Enthaltene Funktionen

- statisches HTML/CSS/JavaScript-Frontend
- konfigurierbare Texte und Branding-Werte über `config.js`
- Firebase-/Firestore-Anbindung
- globales Leaderboard
- lokaler Bestwert
- Social-Ranking mit Plattform und Social-Handle
- Bestwert-Logik: schlechtere Wiederholungen überschreiben keinen besseren Run
- Share-/Copy-Funktion nach einem Lauf
- Firestore-Regeln zur Begrenzung einfacher Manipulationen
- Datenschutz-, Impressums- und Legal-Seiten

## Wichtige Dateien

```text
/
├── index.html             # Hauptspiel
├── config.js              # Texte, Branding, Ranking- und Spielparameter
├── amazon-outbound.js     # Amazon-Outbound-Logik
├── firestore.rules        # Firestore-Sicherheitsregeln
├── firebase.json          # Firebase-Konfiguration
├── .firebaserc            # Firebase-Projektzuordnung
├── datenschutz.html       # Datenschutz
├── impressum.html         # Impressum
├── legal.html             # Rechtliche Hinweise
├── privacy.html           # Privacy-Seite
├── eddie_head.png         # Eddie-Asset
├── eddie_tongue.png       # Eddie-Asset
├── logo.png               # Logo
└── README_UPGRADE.md      # dokumentierte Upgrade-Historie
```

## Konfiguration

Die statische Konfiguration liegt in `config.js`.

Dort werden unter anderem gesteuert:

- Seitentitel und Brand-Texte
- Brand-Farbe
- Logo-Fallbacks
- Leaderboard-ID
- Mindestscore zum Speichern
- maximale Zahl sichtbarer Leaderboard-Einträge
- Share-Texte
- Ranking- und Statusmeldungen

Aktuelle Client-Version laut Konfiguration:

`eddie-v2.3-safe-config`

## Social-Ranking

Spieler können ihren Run mit einem Social-Handle speichern.

Unterstützte Plattformtypen sind:

- Auto
- TikTok
- Instagram
- YouTube
- X
- LinkedIn
- Twitch
- Other

Der Ranking-Schlüssel basiert auf Plattform + Handle. Ein vorhandener Slot kann nur durch einen besseren Run verbessert werden.

## Firebase / Firestore

Das globale Ranking verwendet Firebase/Firestore.

`firestore.rules` begrenzt Schreibzugriffe auf plausible Daten und reduziert einfache Manipulationen. Da das Spiel als Client-Anwendung ausgeliefert wird, ist diese Architektur nicht vollständig cheat-sicher.

Die Upgrade-Dokumentation weist ausdrücklich darauf hin, dass echte serverseitige Verifikation eine Cloud Function oder einen eigenen Server erfordern würde.

## Deployment

Das Projekt ist als statische Website aufgebaut und benötigt keine klassische Build-Pipeline.

Beim Deployment müssen neben den Webdateien auch die zugehörigen Firestore-Regeln berücksichtigt werden.

Die bestehende Upgrade-Dokumentation beschreibt den Ablauf für GitHub Pages + Firebase in `README_UPGRADE.md`.

## Upgrade-Stand

Dokumentierte Änderungen der vorhandenen Versionen umfassen unter anderem:

- entkoppelte Konfiguration
- geschärfte Difficulty Curve
- bereinigtes Leaderboard
- korrigierten Local-Best-Stand
- Share-Funktion
- Firestore-Regeln
- aktualisierte Datenschutzangaben
- Social-Ranking

Details stehen in `README_UPGRADE.md`.

## Marke

EDDIE UNAUFHALTSAM verbindet Eddie’s World mit dem Fokus-System UNAUFHALTSAM.

**Eddie’s World:** echter Ursprung, echtes Material, keine Inszenierung.

**UNAUFHALTSAM:** Fokus, Frusttoleranz und Weitermachen unter steigendem Druck.

**Real life. No staging.**
