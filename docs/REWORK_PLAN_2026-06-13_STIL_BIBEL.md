# 🏗️ Mega-Update — Grob+Fein-Planung, Stil-Bibel & Asset-Katalog

**Status:** Vorlage zur Owner-Abnahme (Planung, noch kein Bau)
**Datum:** 2026-06-13 · **Branch:** `claude/stoic-hamilton-8kx6k5`
**Quellen:** `DECISIONS_2026-06-13B_TRANSCRIPT.md` (Auftrag, 8 Stränge) ·
`GESAMTKONZEPT_VISUELL.md` (visuelle Verfassung) · `SOUL.md` · `NEXT_LEVEL_PLAN.md` ·
eigene Code-/Asset-Inventur (2026-06-13, IST-Stand verifiziert).

> **Was dieses Dokument ist:** der „verlustfreie Übergabepunkt" für das große
> visuelle + Dialog-Mega-Update. Teil A–C sind die geforderte **Stil-Bibel**,
> der **Asset-Katalog** und der **Proportions-Realitätscheck**. Teil D ist die
> **Reihenfolge der 8 Stränge** + der Feinplan für Strang 1. Teil E klärt die
> zwei offenen Mini-Fragen. Teil F ist die **Budget-Analyse** (Pflicht-Hinweis
> vor jeder Massen-Neugenerierung).

---

## 0. IST-Stand (selbst geprüft, 2026-06-13)

**Grün-Basis:** `tsc`, `npm run build`, `vitest` laufen alle durch (Stand main #76).

**Bild-Pipeline:** `tools/asset-pipeline` (headless) + `sprite-tool` (GUI) teilen
ein Manifest (`public/assets/assets.json`). Bild-Modell: **`gemini-3-pro-image`**
(„Nano Banana Pro"). 82 Bild-Assets, 21 Sprite-Sheets, 51 Stimmen, 30 SFX, 6 Musik.

**Der Kern-Befund zur Transparenz (Auftrag A1/D12):**
| Asset-Klasse | Hintergrund im Prompt | Datei-Format | Transparent? |
|---|---|---|---|
| `figure_*`, `player_*`, `audience_*` (Sheets) | „uniformes Magenta #FF00FF" | **RGBA** | ✅ ja (Chroma-Key) |
| `portrait_*` (NPC-Porträts) | „plain dark concrete wall" | **RGB** | ❌ **nein → „Briefmarke"** |
| `room_*`, `bld_*` (Hintergründe) | volle Szene | RGB | (korrekt opak) |

→ **Die Lauf-Avatare sind bereits transparent.** Das eigentliche Transparenz-Problem
sind die **NPC-Porträts** (und die künftigen Halbfiguren „NPC hinter Schreibtisch"):
Sie wurden mit gemaltem Beton-Hintergrund erzeugt, nie durch den Chroma-Key
(`tools/asset-pipeline/src/transparency.mjs`) geschickt. Die Lösung ist deshalb
**keine neue Technik**, sondern: Porträts/Halbfiguren mit Magenta-Hintergrund neu
erzeugen und durch die vorhandene `keyOutMagenta`-Pipeline schicken.

**Weitere harte Stilbrüche (Code-Inventur):**
- **Keine Pixel-Font** — global `Inter` + `JetBrains Mono`; „Pixel-Gefühl" wird mit
  System-Monospace simuliert.
- **Drei parallele Farbsysteme** (`theme.ts StoryModeColors` brutalistisch ·
  `index.css` HSL-Variablen aus dem Pro-Mode · Tailwind-`colors`) + hartkodierte
  Hex-Werte in Modals (`'#8B0000'`, `'#FF8C00'` …).
- **~14 Modals** mit **zwei** widersprüchlichen Schatten-Idiomen (Glow `0 0 60px`
  vs. harter Pixel-Schatten `12px 12px 0 #000`); kein gemeinsames Rahmen-System.
- **Emojis als Funktions-Icons** überall (HUD `💰⚡⚠️👁️💀`, View-Tabs `🏢📊🗂️`,
  Panel-Tabs `📋📞📰🌍📁📊`) — verstößt gegen die Verbotsliste. **19 Pixel-Icons
  existieren bereits**, sind aber kaum verdrahtet.
- **CSS-gezeichnetes Gesicht** als Porträt-Fallback in `DialogBox.tsx` (Verbot).
- **`NpcPanel`** zeigt nur den Anfangsbuchstaben statt des vorhandenen Porträts.
- **Kaputte Publikums-Sheets** (`audience_*`): halbe Figuren, Couch liegt drüber
  (eigene Sicht bestätigt an `audience_family.png`).
- **Proportionen:** Avatar 128 px / Etage 224 px = **57 %** (Ziel ~60 %, knapp dran).
  Stage-Skalierung ist **gleitend (float)**, nicht ganzzahlig (§4.1-Verstoß).

---

# TEIL A — STIL-BIBEL (visuelle Verfassung v2)

> Ergänzt `GESAMTKONZEPT_VISUELL.md` §4. Wo dort schon Regeln stehen (Schichten,
> zwei Kameras, Verbotsliste), gelten sie weiter; hier wird **konkretisiert**:
> Auflösung, **moderne Farbwelt**, **freie Pixel-Font**, Rahmen/Icon-System,
> Transparenz-Verfahren, Prompt-Vorlage v2.

## A1 · Auflösung & Skalierung (fein, nicht grob — E17)
- **Logische Bühne 480×270** (16:9), Basis-Raster 16 px, Figuren-Frames 32 px
  (wie §4.1). `image-rendering: pixelated` überall (ist gesetzt).
- **Asset-Erzeugung in hoher Quelle, Anzeige fein:** Räume in **2K**, Porträts/
  Halbfiguren in **1:1 ~1–2K**, herunter auf die Bühne. So bleibt es „pixelig im
  Geist", aber **scharf auf Retina/MacBook** (E17: kein 1990-Simulat, Schrift auf
  Postern darf fein sein).
- **Skalierungs-Regel (Fix gegen „krumme Skalierung"):** Assets uniform skalieren,
  nie verzerren; Stage bevorzugt **ganzzahlige** Skalenstufen, Rest per Letterbox.
  (Heutiges float-Scaling auf ganzzahlige Stufen bringen, wo ohne Layout-Bruch
  möglich; `pixelated` bleibt Pflicht.)

## A2 · Farbwelt — modern 2026, nicht 70er-Klischee (E16)
**Leitidee:** EIN gedeckter, **kühl-moderner** Neutral-Kern (Beton/Glas/Stahl eines
*heutigen* Bürobaus) statt warmem 70er-Braun. „Evil Cold War" nur **dosiert** über
Akzente und Zonen-Licht, nicht über schlammige Erdtöne. Brutalismus = klare
Geometrie, **nicht** Leere/Kälte (E16: Räume zum Kontext passend, nicht trocken).

**Master-Palette v2 (Vorschlag, ein Token-Satz, ersetzt die drei alten):**
| Rolle | Token | Hex | Einsatz |
|---|---|---|---|
| Tiefe/Schatten | `ink` | `#1B1E24` | Outlines, tiefste Flächen |
| Flächen dunkel | `surface` | `#262A31` | Panels, Modal-Grund |
| Flächen mittel | `surface-2` | `#3A3F47` | Karten, Leisten |
| Beton hell | `concrete` | `#9AA1AC` | Wände, Neutral |
| Licht/Glas | `paper` | `#E7EAEF` | helle Räume, Terminal-Text-BG |
| Marke (Rot) | `ministry-red` | `#C2253B` | Akzent „wichtig", Alarm-Kante |
| Warn | `amber` | `#F0B429` | Hinweise, Verfalls-Fäden |
| Tech/Screen | `cyan` | `#34C6D8` | Monitore (statt Neon-`#00FF00`) |
| OK | `green` | `#5BA66A` | Erfolg, Publikum-Zustimmung |
| Gefahr | `danger` | `#E5484D` | Krise, Enttarnung |

**Zonen-Licht (Kontext schlägt Einheits-Grau, E16):** je Raum ein **Stimmungs-Tint**
über demselben Neutral-Kern —
*Keller/Cyber-Lab:* kühl-dunkel (Cyan-Stich, niedrige Helligkeit) ·
*Direktor/Zentrale:* neutral-streng (kühles Grau + Rot-Akzent, mittel) ·
*Marina/Medien-Zentrum:* **wärmer & heller** (Creme-Licht) ·
*Finanzen/Analyse:* sauber-kühl, hell ·
*Newsroom:* hell, blau-weißes Bildschirmlicht.

## A3 · Schrift — freie Pixel-Font (E18, lizenz-sicher)
- **Empfehlung Welt-/UI-Font: „Pixel Operator"** (Jayvee Enaguas) — **Public Domain
  / CC0**, volle Latin-Abdeckung **inkl. Umlauten ä ö ü ß**, auf Lesbarkeit getrimmt,
  fein statt klobig (passt zu E17). Familie liefert auch eine **Mono**-Variante.
- **Empfehlung Zahlen/Terminal/HUD: „Pixel Operator Mono"** (gleiche Familie, CC0) —
  hält die Kohärenz; Alternative für „moderneren" Terminal-Look: **„Departure Mono"**
  (MIT). Beide ersetzen `JetBrains Mono`/System-Mono.
- Text bleibt **flexible Ebene ÜBER der Grafik** (E35, lokalisierbar). Font wird per
  `@font-face` aus `public/fonts/` geladen (lizenz-frei, im Repo). **Verbot:** `Inter`
  als Weltschrift, `font-mono` (System) als Pixel-Ersatz.
- *Hinweis:* finale Lizenz-Datei (CC0/OFL) wird im Umsetzungs-PR mitgeführt.

## A4 · Rahmen-System (9-Slice) — heilt ~14 Modals auf einen Schlag (H29)
- **EIN** `PixelFrame`-Bauteil (React) + **9-Slice-Rahmen-Assets** in drei Gewichten:
  `frame_light` (Tooltips/Chips), `frame_std` (Dialoge/Panels), `frame_alarm`
  (Krise/Enttarnung, rote Kante). 9-Slice = Ecken fix, Kanten/Mitte kacheln →
  jede Größe ohne Verzerrung.
- Ablöse-Plan: alle CSS-`border-4/8`-Rahmen + beide Schatten-Idiome → `PixelFrame`.
  Ein gezeichneter Schatten ist Teil des Assets (kein CSS-Schatten als Stilträger).
- **Terminal/Listen (F20):** `frame_std` + gezeichneter **Scrollbalken**-Asset,
  Scrollen im Rahmen (kein zweites CSS). Pattern-Kacheln für Flächen.

## A5 · Icon-System — Pixel statt Emoji (E30, Verbot)
- **EIN** `icon_*`-Set, einheitliche Zelle (z. B. 16×16). Die **19 vorhandenen**
  Pixel-Icons prüfen/in v2-Palette angleichen, fehlende generieren (Budget gering).
- `Icon`-Bauteil mappt semantische Namen (`budget`, `risk`, `attention`, `morale`,
  `time`, `building`, `office`, `dashboard`, Panel-Tabs) → Pixel-Asset. **Alle
  Emoji-Funktions-Icons** in HUD/Panels/Modals ersetzen.

## A6 · Transparenz-Verfahren (das Auftrags-Herzstück A1/D12)
- **Regel:** Jedes Asset, das **frei auf einer Szene** liegt (Figuren, Halbfiguren,
  Props, Türen, Stadt-Tiles), wird mit **Magenta-Hintergrund (#FF00FF)** erzeugt und
  durch `keyOutMagenta` zu echtem Alpha ausgestanzt (Verfahren existiert, läuft für
  Sheets). **Porträts/NPC-Halbfiguren wandern in diese Klasse.**
- **Zwei Porträt-Nutzungen, klar getrennt:**
  1. **NPC-Halbfigur in der Raum-Nahsicht** („groß hinter Schreibtisch", §4.3) →
     **transparent**, in die Raum-Szene komponiert.
  2. **Dialog-Porträt** (Sprecher-Leiste) → sitzt **bewusst in einem Pixel-Rahmen**
     (Dienstausweis/Monitor-Look); die Rechteck-Kante ist dann **gewollt**, kein
     „Briefmarken"-Unfall. Wird trotzdem transparent erzeugt (frei verwendbar).
- **CSS-Gesichts-Fallback raus**; Ersatz = neutrale **Pixel-Silhouette** als Asset.

## A7 · Verbotsliste (aus §4.6, weiter gültig — Auszug)
Keine Emojis · keine CSS-Gradients/CSS-Gesichter/CSS-Möbel · keine Web-Pillen/
abgerundeten Buttons · Brutalismus-Schlagschatten nicht als Stilträger · keine
Foto-Interieurs neben Pixel · keine krumme Skalierung · **keine realen Staatssymbole**
(`SYMBOLS_AUDIT.md`), Prompts mit „no emblems, no real flags, no readable text".

## A8 · Prompt-Vorlage v2 (für die Pipeline, ersetzt 70er-Anker)
Style-Anchor (`sprite-tool/public/context/game-style-guide.md`) wird auf v2 gehoben:
„*fine detailed 16-bit pixel art, modern 2026 government/office interior with restrained
brutalist geometry, **cool clean palette** (greys/glass/steel), context lighting, NOT
1970s brown, NOT dark/empty; dark-red + cyan accents dosed; [Magenta-BG-Klausel wo
freigestellt]; no emblems, no real flags, no readable text*". Master-Referenz + fester
Seed je Shot → Konsistenz (Rezept steht in `ASSET_BACKEND.md`).

---

# TEIL B — ASSET-KATALOG (was / wo / wie / modular)

**Lesart:** „Neu v2" = im neuen Stil-Bibel-Look neu erzeugen. „Reuse?" = kann ggf.
bleiben/leicht angepasst werden. Alle freistehenden Klassen → Magenta+Alpha.

| Klasse | ids (Beispiele) | Anz. | Auflösung/Format | Transparenz | Aktion | Prio |
|---|---|---|---|---|---|---|
| **Räume** (Hintergrund) | `room_<id>` (cyber_lab, medien_zentrum, analyse, newsroom, feld_ops, zentrale, spieler_buero, finanzen, lobby) + `audience_room` | 10 | 2K, opak | nein | **Neu v2** (alle, H27) + Skala-Referenz (Teil C) | Muss |
| **NPC-Halbfiguren** (Raum-Nahsicht) | `npc_half_<id>` (alexei, igor, katja, marina, direktor) | 5 | ~1–2K, 1:1+ | **Magenta→Alpha** | **Neu v2** (Transparenz-Herzstück) | Muss |
| **Dialog-Porträts** | `portrait_<id>` + Stimmungen `_angry/_happy/_suspicious/_worried` | 25 | 1:1 | **Magenta→Alpha** | **Neu v2**; Stimmungen Kür-Batch | Muss(Basis)/Kür(Moods) |
| **Spieler-Porträts** (Avatar-Wahl K10) | `portrait_player_m1..3`, `_f1..3` | 6 | 1:1 | Magenta→Alpha | **Neu v2** | Muss |
| **Publikums-Sheets** (kaputt!) | `audience_<milieu>` (8 moderne Milieus + Legacy) | ~14 | 32px-Frames | Alpha (da) | **Neu v2** (K38: kaputt) | Muss |
| **NPC-Lauf-Figuren** | `figure_<id>` (4-Frame idle) | 5 | 32px | Alpha (da) | Reuse?/v2-Angleich | Kür |
| **Spieler-Avatar** | `player_walk` (8×32), `player_idle` (4×32) | 2 | 32px | Alpha (da) | Reuse (Laufzyklus ok); v2-Angleich Kür | — |
| **Gebäude-Teile** | `bld_*` (city_far, corridor, door_open/closed, fenster, fahrstuhl …), `building`, `elevator_*` | ~12 | tile/opak+Alpha | gemischt | **Neu v2** (Fassade/Stadt/Türen) | Muss |
| **Props** | `prop_*` (Korkbrett, Akten, Telefon, TV, Pflanze, Papierkorb …) | 8 | klein | Magenta→Alpha | **Neu v2** + Atmosphäre-Props (Strang 5) | Muss/Kür |
| **Rahmen (9-Slice)** | `frame_light/std/alarm` (+ Scrollbalken, Pattern) | ~5 | 9-Slice | Alpha | **Neu** (existiert nicht) | Muss |
| **Icons** | `icon_*` | 19 + Lücken | 16×16 | Alpha | Prüfen/angleichen + Lücken | Muss |
| **HUD-Rahmen** | `hud_tv_frame`, `hud_paper_frame` | 2 | 9-Slice-artig | Alpha | Reuse → in `PixelFrame` integrieren | — |

**Modularität (D14 — vorab sauber planen):**
- **Räume** als **Schichten** denken: (1) leere Raum-„Schale" (Wände/Boden/Decke/
  Fenster, je Zonen-Licht), (2) **Möbel-/Prop-Layer** als separate transparente
  Props, (3) NPC-Halbfigur, (4) diegetische Bildschirme. Vorteil: neue Etagen/Büros
  (Gebäude-Wachstum K40) entstehen aus **Schale + Prop-Set**, ohne jedes Mal ein
  ganzes Raumbild neu zu erfinden. Empfehlung: Räume **modular** (Schale + Props)
  statt monolithisch — etwas mehr Anfangsaufwand, viel billigeres Wachstum.
- **Etagen-Schalen** (Querschnitt) als kachelbare Tiles (Wand/Tür/Fenster/Boden) →
  „Etage schnell auflegbar" (D14). Stadt-Tiles Tag/Nacht + Jahreszeiten-Overlays.
- **Namens-Konvention** bleibt schema-stabil (`type/id`), damit Pipeline + sprite-tool
  dasselbe Manifest mergen.

---

# TEIL C — PROPORTIONS-REALITÄTSCHECK (Avatar > Schreibtisch)

**Regel-System (Bezug = Avatar-Körperhöhe H, aus §4.2):**
Tür 1,15 H · Innen-Raumhöhe ~1,5 H (Avatar ≈ **2/3**) · **Schreibtisch 0,42 H —
IMMER kleiner als der Avatar** · sitzender NPC: Kopf ~0,9 H · Schrank 0,9 H.

**IST → SOLL:**
- *Gebäude-Querschnitt:* Avatar 128 / Etage 224 = **57 %** → SOLL ~60 %. Feinjustage:
  Avatar leicht hoch **oder** Etage leicht flacher (z. B. avatarSize 132–136 px).
- *Raum-Nahsicht (der eigentliche Knackpunkt):* Räume sind **gebackene Szenen** — die
  Möbel-Größe entsteht heute „wie die KI es malt", ohne Avatar-Bezug. Deshalb der
  **Realitätscheck als Prozess, nicht nur als Bild:**
  1. **Skala-Referenz im Prompt:** jeden Raum mit einer **eingezeichneten neutralen
     Figur-Silhouette auf der Lauflinie** (Referenzbild an Gemini) erzeugen, an der
     die KI die Möbel ausrichtet → Schreibtisch garantiert ≤ 0,42 H.
  2. **Mess-Overlay im Vision-Review:** vor Annahme die echte Avatar-Sprite an der
     Lauflinie einblenden + 0,42-H-Linie über den Schreibtisch legen. Nur Räume, in
     denen **Avatar > Schreibtisch** sichtbar stimmt, werden `chosen: true`.
  3. **Modular hilft:** liegen Möbel als **separate Props** vor, lässt sich die Größe
     nachträglich exakt setzen (Props skaliert komponiert) — kein Neulauf nötig.
- *Verteilung von Möbeln:* nie Möbel größer als Figuren; Figuren stehen **vor**, nicht
  „als Ameise neben" Foto-Möbeln (heilt Befund #4 der Verfassung).

**Akzeptanz-Kriterium Strang 1:** In **jedem** Raum ist der Avatar an der Lauflinie
sichtbar größer als der Schreibtisch und ~2/3 der sichtbaren Raumhöhe.

---

# TEIL D — REIHENFOLGE DER 8 STRÄNGE + FEINPLAN STRANG 1

## D1 · Makro-Reihenfolge (Abhängigkeiten)
Begründung: alles rendert durch die visuelle Grundlage; Diegese braucht das
Rahmen-System; Inhalt (Aktionen/Dialoge) braucht die diegetischen Flächen.

1. **Strang 1 — Visuelles Rework** (Fundament; H26 höchste Prio) ← *Start jetzt*
2. **Strang 2 — Diegetische Bedienung** (Knopfbalken weg, Tür/Fahrstuhl, Möbel-UI,
   Narrativ-Tafel animiert+ziehbar, 10 Modals→1 Rahmensystem) — baut auf 1.
3. **Strang 4 — Dialog-/Sprach-Mega-Update** (K38 Schwerpunkt) ⟂ **Strang 3 —
   Aktions-Überarbeitung** (granular, Ziel/Parameter, 100–500 Pfade) — gemeinsam das
   inhaltliche Herz; teilen sich „Aktion aus Dialog"; nach Strang 2.
4. **Strang 5 — Atmosphäre** (Flur-Details, Dummies, Tür-Animation, anklickbare Flavor).
5. **Strang 6 — Gegenseite erzählerisch** (Einzelpersonen-Lageeinschätzungen, medial).
6. **Strang 7 — Sound adaptiv** (zustandsreaktive Musik) — weitgehend unabhängig,
   kann früh einfließen, gebündelt aber hier.
7. **Strang 8 — Inhalt** (explizit-fiktiv, reale Themen ohne Namen, dezente Moral) —
   **querschnittlich**, läuft durch 3/4/6 mit.

## D2 · Feinplan Strang 1 (PR-Schnitt — „kleinere PRs als bisher")
Jeder Punkt = **ein kleiner, grün getesteter PR**. Reihenfolge so, dass früh sichtbar.

- **PR 1a — Planung & Stil-Bibel** *(dieser PR)*: dieses Dokument + Style-Anchor v2-Entwurf. Kein Code-Risiko.
- **PR 1b — Avatar/NPC-Transparenz (Start, lt. Auftrag):** 5 NPC-Halbfiguren in v2 +
  Magenta→Alpha, in Raum-Nahsicht komponiert; CSS-Gesicht raus. **Erst Budget-Hinweis
  (Teil F), dann Generierung.** Kleiner, vorzeigbarer Beweis, validiert die Pipeline
  für Porträts vor dem großen Restyle (kein Doppel-Spend: gleich in v2-Stil).
- **PR 1c — Fundament-Code (wenig/kein Asset-Spend):** Pixel-Font einbinden;
  EIN Palette-Token-Modul (drei Systeme → v2 zusammenführen); `PixelFrame` (9-Slice) +
  3 Rahmen-Assets; `Icon`-Bauteil + Emoji→Pixel-Icon-Ablöse (vorhandene 19 nutzen).
- **PR 1d — Asset-Restyle Räume:** alle 10 Räume v2 + Skala-Referenz/Mess-Overlay
  (Teil C). Modular (Schale + Props) wo sinnvoll.
- **PR 1e — Asset-Restyle Rest:** Porträts (Basis + Stimmungen), Spieler-Porträts,
  **kaputte Publikums-Sheets**, Gebäude/Stadt/Türen, Props.
- **PR 1f — Proportions-/Lobby-/Avatar-Pass:** Avatar→60 %, Lobby als echte Halle,
  Laufanimation-Feinschliff, ganzzahlige Skalierung, Tag/Nacht + Jahreszeiten (H30).

*(Strang-2-PRs etc. folgen nach Strang-1-Abnahme.)*

## D3 · Qualitäts-Kontrakt je PR (SOUL §4)
`tsc` + `vitest` + `build` grün vor Push · generierte Bilder per **Vision-Review**
gegen Stil-Bibel · Proportions-Mess-Overlay · keine Funktion fällt weg (A1-Bedingung).

---

# TEIL E — OFFENE MINI-FRAGEN (mit Empfehlung)

## E1 · A1 — „kleine Randleiste"? → ✅ ENTSCHIEDEN: **GAR KEINE Randleiste**
**Owner-Entscheidung (2026-06-13):** Keine persistente Randleiste. **Alles
diegetisch** (an Möbeln); das **System-Menü** (Pause · Ton/Mixer · Speichern/Laden ·
Version · Beenden) ist **nur über die Pause-Taste** erreichbar. Der HUD-Rand
(Zeit/Risiko/Budget) bleibt **auf Knopfdruck** einblendbar (I32), nicht dauerhaft.
→ *Folge für §4.4: Schicht 3 schrumpft auf „Pause-Overlay + optionaler HUD" — kein
ständig sichtbares Rand-UI. Puristischste Variante, maximal „aus einem Guss".*
→ *Umsetzungs-Hinweis: Pause-Taste (Esc) + ein dezenter, IMMER auffindbarer
Einstieg (z. B. kleines Pause-Glyph), damit Systemfunktionen ohne Randleiste
nicht „verschwinden".*

## E2 · B6 — Anzahl Narrative → ✅ ENTSCHIEDEN: **max 3, Start 2 → 3**
**Owner-Entscheidung (2026-06-13):** maximal 3 gleichzeitig, Spielstart bei 2,
der 3. Slot schaltet mit dem Gebäude-Wachstum frei (K40). Begründung (4 Blickwinkel):
- *Game-Design:* 2–3 parallele „Sendungen" sind anfassbar; mehr verwässert jede
  Entscheidung (MadTV-Lehre: begrenzte Slots erzeugen interessante Konflikte).
- *Inhalt/Realismus:* echte Operationen fahren wenige **koordinierte** Narrative
  gleichzeitig (z. B. Energie + Migration + Wahl), die sich verstärken — nicht Dutzende.
- *UX/Tafel:* das Korkbrett (480×270) trägt **3 Spuren** + rote Verfalls-Fäden +
  Karten lesbar; ab 4 wird es bei Pixel-Auflösung eng.
- *Niedrigschwellig:* 3 ist für spielaffine Erwachsene gut überschaubar; die
  Progression (2→3) gibt ein Wachstums-Gefühl (MadTV: Studio wächst).

*(G25 + E19/I33 sind im Decisions-Dok bereits geklärt — kein Handlungsbedarf.)*

---

# TEIL F — BUDGET-ANALYSE (Pflicht-Hinweis vor Massen-Neugenerierung)

**Modell-Preise `gemini-3-pro-image` (Stand 2026):** 1K/2K **$0,134**/Bild ·
4K **$0,24**/Bild · **Batch/Flex** ~**$0,067**/Bild (2K, asynchron, halber Preis).

**Kosten je Maßnahme (grobe Schätzung, vor Vision-Review-Nachläufen):**
| Maßnahme | Bilder | @2K Standard | @2K Batch | @4K |
|---|---|---|---|---|
| **Transparenz-Start (PR 1b)**: 5 NPC-Halbfiguren | 5 | **~$0,67** | ~$0,34 | ~$1,20 |
| Porträt-Basis (5) + Spieler (6) | 11 | ~$1,47 | ~$0,74 | ~$2,64 |
| Porträt-Stimmungen (20, Kür) | 20 | ~$2,68 | ~$1,34 | ~$4,80 |
| Alle Räume (10) | 10 | ~$1,34 | ~$0,67 | ~$2,40 |
| Publikums-Sheets + Gebäude + Props (~34) | 34 | ~$4,56 | ~$2,28 | ~$8,16 |
| **Voller v2-Restyle (alle ~82 Bilder)** | 82 | **~$11** | **~$5,5** | **~$20** |
| + Nachläufe/Rejects (~+40 %) | — | ~$15 | ~$7,7 | ~$28 |

**Headroom:** Owner hat das Bild-KI-Budget **+30 €** erhöht (zzgl. der im
Decisions-Dok genannten +10–20 €). **Fazit:** Selbst ein **kompletter v2-Restyle aller
82 Bilder inkl. Iteration** liegt klar im erhöhten Budget — bei 2K/Batch sogar mit
großem Puffer. Der **Transparenz-Start (PR 1b) kostet ~1 €** (vernachlässigbar).
*Vorgehen:* Standard ist Dry-Run; echte Läufe nur `--live`, harte Per-Lauf-Limits
(`PIPELINE_MAX_IMAGES`), inkrementelles Manifest (Abbruch verliert nichts).

---

## Nächster Schritt (nach Abnahme dieses Plans + Antwort auf E1/E2)
PR 1b starten: 5 NPC-Halbfiguren v2 + Transparenz (Budget ~1 €), in Raum-Nahsicht
komponiert, CSS-Gesicht entfernt — `tsc`/Tests/Build grün, Vision-Review angehängt.
