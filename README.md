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

## Ergebnisbildschirm und Analytics (v3.2)

Dies ist die von `eddiesworld.de` verlinkte Spielquelle: `https://focus-system-unaufhaltsam.github.io/eddie/`. Die ähnlich benannte Quelle `KeschFlow/unaufhaltsam` ist nicht dieser öffentliche Einstieg.

Der Ergebnisbildschirm verwendet `result-flow.js` und `result-flow.css`. Er zeigt Level (die bisherige Boxenzahl), Laufzeit und lokalen Rekord. „Noch ein Versuch“ startet ohne Seitenreload. Ranking bleibt bei einem neuen lokalen Rekord ab vier Boxen optional. Der Rekordschlüssel `eddie_unaufhaltsam_best_boxes_v4`, die boxenbasierte Wertung und das Firestore-Dokumentschema bleiben erhalten. Share nutzt die aktuelle Spielroute ohne Query oder Fragment; bei fehlender Share-/Clipboard-Unterstützung gibt es markierbaren Text. Ein abgebrochener Share-Dialog kopiert nichts.

### Bestehende Firebase-Anbindung

Es wird die bereits konfigurierte App in `mg-challenge` mit `measurementId: G-4KYDE7P5W8` weiterverwendet. SDK, Einwilligungsdialog, Quellenzuordnung und `track()` bleiben bestehen. Es gibt kein neues Firebase-Projekt, keine neue Mess-ID und keine Firestore-Sammlung für Ereignisse.

| Neues Ereignis | Auslöser | Zusätzliche Parameter |
| --- | --- | --- |
| `game_over` | Ein beendeter Lauf | `level`, `duration_ms`, `new_best`, `variant`, `version` |
| `retry_clicked` | Direkter Ergebnis-Neustart | `level`, `duration_ms`, `variant`, `version` |
| `share_clicked` | Klick auf Teilen/Kopieren | `level`, `duration_ms`, `share_method`, `variant`, `version` |

Die vorhandenen `baseParams()` liefern weiterhin Quelle, Sitzung und App-Version. Namen und Handles werden nicht in die neuen Event-Parameter aufgenommen. Die Ereignisse passieren denselben Einwilligungscheck wie vorhandene Events. Lokale Zähler sind kein Nachweis eines Eingangs bei Google. `share_clicked` misst den Klick, nicht eine abgeschlossene Weiterleitung an einen Empfänger. Das bisherige `game_end` bleibt zur historischen Vergleichbarkeit erhalten; für die neue Metrik wird nur `game_over` als Nenner verwendet.

`retry_clicked / game_over` ist die direkte Neustartquote für die erfassten, einwilligenden Spielbesuche. Eine Änderung dieses Verhältnisses allein beweist keine kausale Verbesserung und sagt nichts über nicht erfasste Spieler. Vergleiche müssen denselben App-Stand/Zeitraum, Einstiegsweg und möglichst dieselbe Traffic-Mischung berücksichtigen.

### Prüf- und Veröffentlichungsgrenze

Für einen bewusst gestarteten Test kann `?analytics_debug=1` verwendet werden. Dann erhalten die über `track()` gesendeten Ereignisse `debug_mode: true` und können in Firebase/GA4 DebugView geprüft werden. Diese Test-URL nicht als öffentlichen Profil-Link verwenden. Siehe [Firebase DebugView](https://firebase.google.com/docs/analytics/debugview).

Vor dem Merge müssen `game_over`, `retry_clicked` und `share_clicked` im vorhandenen Dashboard mit passender App-Version und Level sichtbar geprüft werden. Erst danach Merge/Pages-Deployment und eine erneute Prüfung der öffentlichen Seite. Browser-Adaptertests oder ein erfolgreicher Transport allein ersetzen diesen Dashboard-Nachweis nicht.

Lokale Tests: `npm ci`, `npx playwright install chromium`, `npm test`. Vorhandenes Chromium lässt sich mit `BROWSER_EXECUTABLE_PATH` auswählen. Die Tests sperren externe Requests und simulieren Firebase; sie sind kein Live-Nachweis. Spiel, Leaderboard-Schreibregeln, externe Produktlinks und Analytics-Projekteinstellungen werden durch diese Tests nicht produktiv verändert.

## Marke

EDDIE UNAUFHALTSAM verbindet Eddie’s World mit dem Fokus-System UNAUFHALTSAM.

**Eddie’s World:** echter Ursprung, echtes Material, keine Inszenierung.

**UNAUFHALTSAM:** Fokus, Frusttoleranz und Weitermachen unter steigendem Druck.

**Real life. No staging.**
