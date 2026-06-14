# 🎨🔊 Visual- & Audio-Backlog + Asset-Plan (2026-06-14)

**Zweck:** Review der zuletzt (PR #77–#81) hinzugekommenen UI-Elemente auf „aus einem Guss"
vs. „noch CSS/zwei Welten", plus durchdachter Plan für die kommenden **Assets** und die
**Sound-Erweiterung**. Owner-Feedback 2026-06-14 (Screenshots) ist eingearbeitet.
**Zentrale Liste bleibt `STATUS.md`** — dieses Dokument ist der Detailanhang dazu.

> Leitprinzip (SOUL §1): visuelle Kohärenz ist das Erste, was Nutzer beurteilen. Neue
> Mechanik-Panels sind oft erst „CSS-diegetisch" geboren — sie müssen aufs Asset-Niveau
> der Räume gehoben werden, sonst wirken zwei Welten nebeneinander.

---

## 1. Review: neu hinzugekommene Elemente (Verdikt je Element)

| Element | PR | Heutiger Stil | Verdikt | Aktion |
|---|---|---|---|---|
| **Operations-Akte** (`OperationsAkteView`) | #81 | Papier/Manila als CSS (Farben/Rahmen), Stempel „VERTRAULICH" | diegetisch gedacht, **kein echtes Asset** | optional 9-Slice-Akten-Asset (Deckblatt/Reiter); vorerst CSS ok |
| **Operationszentrale** (Raum Etage 4) | #81 | **kein Raumbild** — nur abgedunkelter Backdrop | **fehlt Asset** | `room_operations` generieren (Lagebild-Raum, Karten/Monitore) |
| **Fokusgruppe** (`FokusgruppeView`) | #80 | `room_analyse`-Bild + CSS-Kacheln | ok-ish | Feinpolitur im Stil-Audit |
| **Narrativ-Tafel / Lagebild / Etagen-Tableau** | #78 | CSS-Panels (Korkbrett/Monitor-Look) | teils „CSS-diegetisch" | gegen Stil-Bibel auditieren (V4) |
| **Seitenleiste** (Nachrichten/Aktionen-Queue) | ält. | **flache CSS-Sidebar**, nicht-diegetisch | **„zwei Welten"** (Screenshot) | als Papier-/Klemmbrett-Look ODER zentrales PixelModal (wie Akte); Rand-Tab entfernen (V2) |
| **Büro-Hotspots** | ält. | orange **Rechteck-Drahtgitter** über Möbeln | **„platt markiert"** (Screenshot) | Hotspots an Möbelform; Ruhe-Ring weg, Hover-Glow folgt dem Objekt (V4) |
| **Welt-Ereignis-„2"-Badge** | ält. | schwebt mitten im Fenster | **floating** (Screenshot) | diegetisch verorten (Fensterrahmen/Objekt), nicht in der Luft |
| **Broadcast-Leiste + Wohnzimmer** | #78 | TV-Asset + Publikums-Figuren | **Figuren kaputt, Raum altbacken** (Owner) | Wohnzimmer+Sofa modern neu, Audience-Figuren neu, Leiste höher |
| **ComboHints-Widget** | ält. | `fixed bottom-4 left-4` | **floating** (V6) | diegetisch in HUD/Tafel ziehen |
| **Laufender Avatar** | #80 | 32 px nativ ×4, **nicht** an Avatar-Wahl gekoppelt | funktioniert, **zu pixelig** (Owner) | höher auflösen (Neu-Gen); Bindung an Wahl klären |

## 2. Hintergrund Gebäude-Querschnitt — Tageszeit & Skyline (durchdacht)

**Befund (Code + Screenshot):** Die Skyline (`bld_city_far`) liegt als **schmales Band ganz
unten** (`BuildingStage.tsx:164–182`, Höhe gedeckelt), darüber ein **fester dunkler Verlauf**
(`#05070d→#11131c`). Tageszeit ist heute **nur eine Tönungs-Overlay** (`DayNightTint`, 09:00–18:00).
→ Genau wie beschrieben: Stadt zu klein, schwarzer Himmel zu groß, wenig Abwechslung.

**Owner-Idee:** Skyline deutlich größer, in 7 Helligkeits-Varianten (Frühmorgens … Nacht), plus
Jahreszeiten + Kleinigkeiten.

**Technisch/visuell durchdacht — Empfehlung „Schichten statt 28 Bilder":**
Tageszeit-Stimmung ist zu ~90 % **Beleuchtung**, nicht Form — die Silhouette ändert sich kaum.
Darum **entkoppeln** in vier Schichten statt vieler Vollbilder:

1. **Prozeduraler Himmel (gratis, Code):** den festen Verlauf durch einen **tagesuhr-gesteuerten
   Verlauf** mit 7 Farb-Stops ersetzen (Frühmorgens kühl-rosa → Mittag hell → Goldene Stunde →
   Blaue Stunde → Nacht) + **Horizont-Glühen**. Sofort mehr Abwechslung, **ohne Asset-Kosten**.
2. **Skyline-Komposition (gratis, Code):** Band **höher** ziehen / Deckel lockern, damit die Stadt
   den Himmel füllt und „Schwarz oben" schrumpft.
3. **Skyline-Varianten (moderater Asset-Spend, später entscheiden):** **2–3** Silhouetten —
   *Tag / Dämmerung / Nacht (mit erleuchteten Fenstern)* — und per Tagesuhr **cross-faden**.
   **NICHT** 7×4 Vollbilder (zu viele, schwer konsistent, teuer).
4. **Jahreszeit als Overlay (gratis):** Schnee/Regen existieren bereits; optional dezente
   Paletten-Verschiebung je Saison. Bleibt Overlay, **kein** eigenes Hintergrundbild je Saison.

**Reihenfolge:** erst 1+2 (Code, gratis, löst „zu klein/zu dunkel" sofort), dann 3 nach
Budget-Ansage. Ergebnis: reiche Tageszeit-Atmosphäre bei **2–3** statt 28 Assets.

## 3. Büro — Hotspots & Floating (V4-Kern, „zwei Welten" auflösen)
- **Rechteck-Hotspots** (`PlayerOfficeView` `HOTSPOTS`): Ruhe-Zustand-Ring (`rgba(212,160,23,0.28)`)
  entfernen; Hover-Highlight, das **der Objektform folgt** (Glow-Maske je Möbel, ggf. kleines
  Highlight-Overlay-Asset je Hotspot) statt voller Rechtecke.
- **„2"-Welt-Badge** an einen diegetischen Anker (Fensterrahmen/Monitor) statt mitten im Glas.
- **Seitenleiste** ins diegetische System holen (Papier/Klemmbrett oder zentrales PixelModal wie
  die Akte) → entkoppelt vom „Web-Sidebar"-Eindruck. Hängt an Modal-Vereinheitlichung (Frage 29).
- Prüfen, ob ein **Büro-Neuaufbau** (sauberere Hotspot-Geometrie) günstiger ist als Nachjustieren.

## 4. Avatar
- **Auflösung:** Lauf-/Idle-Sheets höher auflösen (z. B. 48–64 px nativ) → weniger pixelig. (Asset.)
- **Bindung an Wahl:** heute nur Porträt gekoppelt, Lauffigur fix. Entscheidung nötig:
  (a) Porträt-only akzeptieren, (b) **2 Lauf-Varianten** (m/w) passend zum Porträt (günstig),
  (c) Lauf-Sheet je Avatar (teuer). Empfehlung: **(b)**.

## 5. TV / Wohnzimmer / Broadcast-Leiste (Owner-Feedback)
- **Audience-Figuren** neu (die „kaputten" Figuren = `audience_<segment>`-Sprites neu generieren).
- **Wohnzimmer + Sofa** moderner (neues `room_wohnzimmer`/Sofa-Asset).
- **Broadcast-Leiste höher/größer** (`BroadcastBar` Höhe) — Code, günstig; mehr Bühne fürs Publikum.

## 6. Sound- & Musik-Erweiterung (Roadmap — bisher fehlte sie)
**Heute vorhanden:** 3 Kanäle (music/sfx/voice), 6 Musik-Loops (inkl. tense/victory/night_city),
6 Raum-Klangkulissen, 28 SFX, 80+ vertonte NPC-Zeilen (Begrüßungen + Reaktionen).
**Entschieden, aber NICHT gebaut:**
- **Adaptive Musik (J34/J35):** Track wechselt mit Spielzustand (heller Richtung Sieg, dunkler
  Richtung Verlust; eigene Loops bei guten/Welt-Ereignissen). → Music-Director im `SoundSystem`,
  getriggert aus Risk/Trust/Events. (Code; evtl. 1–2 Zusatz-Loops.)
- **Music-Ducking (J36):** Musik leiser, wenn Raum-Kulisse aktiv. → dynamische Lautstärke-Kopplung
  in `playAmbience`. (Code.)
- **Ambience-Verdrahtung:** je Raum die passende Kulisse triggern (Assets liegen, Aufruf fehlt).
- **Topic-Vertonung:** `topics_dialogues.json` (14 Themen × NPC) vertonen — ElevenLabs-Batch mit
  **Kostenansage** (D24), erst wenn Texte stabil.
**Offen:** reichen 6 Tracks für „beides gleichmäßig"? Klang-Referenzen (Frage 37) — Owner überlässt
es uns. Raum-Kulissen unter Musik balancieren (Frage 36).

## 6a. Owner-Feedback Runde 3 (2026-06-14, Detail-Screenshots) — Bau-Programm

Leitsatz Owner: **Hintergrund und Figuren/Möbel müssen zusammengedacht, in realen
Größenverhältnissen, pixelgenau platziert und getestet werden.** Reihenfolge: erst
analysieren, dann Assets, dann platzieren.

| # | Befund | Ursache (Code) | Fix-Ansatz | Status |
|---|---|---|---|---|
| R1 | **Avatar > Tür** (falsches Verhältnis) | Avatar 128px (32×4) vs `doorHeight` 144px, aber sichtbare Tür-Grafik < 144; Figur füllt die 128 fast ganz | Sichtbare Türöffnung messen; Avatar-Anzeige so skalieren, dass Figur ≈ 0,8× Türöffnung (real: Mensch ~1,7 m, Tür ~2 m) | offen |
| R2 | **Tür-Animation hässlich**, offene Tür teils klein | `RoomDoor` tauscht nur `bld_door_open/closed` (kein Zwischenschritt); Asset-Größen passen nicht | Tür-Assets neu/sauber (gleiche Maße offen/zu) + echte Öffnen/Schließen-Phasen; alle Zustände (mit/ohne Avatar) prüfen | offen |
| R3 | **Tür ragt in Boden / überschneidet Sofa** | Tür sitzt `bottom = room.y+room.h-doorHeight`; Korridor-Boden­linie ≠ Tür­unterkante; **gebackene** Wand-Elemente kollidieren | **Entkachelung** (R4) entfernt die Kollision; Tür­unterkante exakt auf die Bodenlinie legen | offen |
| **R4** | **Etagen zu gleichförmig** (Tiling wiederholt Sofa/Poster/Uhr) | `bld_corridor[_2/_3]` **backen** Notizbrett/Uhr/Pflanze/Bank/Poster ein und kacheln (`repeat-x`) | **Saubere Basis-Korridore** (nur Wand+Dado+Decke+Boden, je Etage etwas anders) **+ platzierte Deko** (Liste unten), datengetrieben, pixelgenau | **Hauptaufgabe** |
| R5 | **Fahrstuhl-Kabine wie Briefmarke**, Animation | Kabine 156×208 **hartkodiert** ≠ Schacht­breite; Öffnen/Schließen nur Asset-Tausch | Kabine an Schacht­maße; sauber zuschneiden/neu generieren; alle Zustände (offen/zu, mit/ohne Avatar) prüfen | offen |
| R6 | **Fernsehfamilie: einige sitzen „in der Luft"** + halb abgeschnitten | Alle 8 Segmente werden gezeigt; Sofa fasst ~3–4; Figuren auf Bodenlinie statt Sitz­linie | **Repräsentative Teilmenge** zeigen (Konzept: nicht alle sitzen), auf die Sofa-Sitzlinie setzen, keine abgeschnitten; volle 8-Segment-Daten in Lagebild/Newsroom | offen |
| R7 | **Keller-Hintergrund inkohärent** („war mal ein Boden") | Keller nutzt `bld_corridor_3` (per `level%3`) — passt nicht zum Tresor/Keller | Im Zuge R4: eigener Keller-Basis-Korridor (Beton/Tresor-Anmutung) | offen |
| R8 | **Skyline unscharf + harter Schnitt** | mein Hochskalieren des 576px-Assets; harte Oberkante | ✅ **behoben:** Neu-Gen 2016×864 + Dunst-Tiefe + Mask-Ausblendung (natürlicher Übergang) | ✅ |

### Deko-Element-Liste (R4) — Assets + reale Größen + Platzierung
Maßstab: Avatar ≈ 1,7 m ≈ 128 px ⇒ **~75 px/Meter**. Bodensteher stehen auf der
Korridor-Bodenlinie (unten), Wand-Objekte hängen auf Wand-Mitte/-Höhe.

**Boden-stehend** (datengetrieben platziert, NICHT in der Basis gebacken):
- `prop_plant_tall` (Gummibaum, ~1,4 m → ~105 px) · `prop_plant_small` (~0,5 m → ~40 px)
- `prop_trashcan` (~0,7 m → ~52 px) · `prop_bench` (Wartebank, ~0,8 m hoch, breit → ~60 px)
- `prop_chairs` (2 Stühle, ~0,9 m → ~68 px) · `prop_watercooler` (~1,3 m → ~98 px)
- `prop_vending` (Getränkeautomat, ~1,8 m → ~135 px)

**Wand-hängend:**
- `prop_clock_wall` (~0,4 m → ~30 px) · `prop_noticeboard` (~1,0 m → ~75 px)
- `prop_poster1` · `prop_poster2` · `prop_poster3` (gerahmt, abstrakt/konstruktivistisch, ~0,7 m → ~52 px)

### Platzierungs-Architektur (R4)
1. **Saubere Basis** `bld_corridor[_2/_3]` neu (ohne Wand-Elemente, je Etage andere Wand/Palette);
   eigener Keller-Basis (R7).
2. `building.json` bekommt je Etage ein `decor: [{ id, x, mount:'floor'|'wall' }]` — Positionen
   so gewählt, dass sie **nicht** mit Türen/Schacht kollidieren und **realistisch** wirken
   (Pflanze in der Ecke, Bank zwischen zwei Türen, Poster auf Wandlücken, Uhr hoch).
3. `BuildingStage` rendert Deko an berechnetem y (Boden-Linie bzw. Wandhöhe) + Größe aus der
   Maßstabs-Tabelle. **Atomar mit der sauberen Basis** ausliefern (kein leerer Zwischenstand).

## 7. Empfohlene Reihenfolge (günstig→teuer)
1. **Gratis/Code zuerst:** Himmel-Verlauf+Skyline-Komposition (§2.1–2), Broadcast-Leiste höher,
   Ambience-Verdrahtung, „2"-Badge verorten, Hotspot-Ringe weg.
2. **V4-Audit** der neuen Panels (Seitenleiste/Tafel/Lagebild) — Umfang klären.
3. **Asset-Pakete (mit Budget-Ansage):** `room_operations`, Audience-Figuren + Wohnzimmer,
   2–3 Skyline-Varianten, Avatar höher aufgelöst.
4. **Adaptive Musik + Ducking** (Code), dann **Topic-Vertonung** (Batch).
