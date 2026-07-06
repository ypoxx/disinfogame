# 🔎 VISUAL REVIEW 2026-07-06 — Broadcast-Leiste: Röhren-TV (Standby) + Publikums-Wohnzimmer

**Status:** Befund-Dokument. Es wurde **nichts gefixt** — nur bewertet und belegt.
**Anlass:** Owner-Frage — „Wie bewertest du die Darstellung des Fernsehers links und des
Fernsehers rechts inkl. der Figuren? Nimm Gemini zusätzlich zur Bewertung der Elemente
und der grafischen Darstellung."
**Umfang:** die zwei Elemente der ausgeklappten `BroadcastBar` (Taste B) im **Standby**:
- **links** der Röhren-TV mit Sendepause-Testbild (`BroadcastScreen`),
- **rechts** das Publikums-Wohnzimmer „PUBLIKUM — WESTUNION" mit den sitzenden
  Milieu-Figuren (`AudienceRoom`).

## Methodik (reproduzierbar, zweischichtig)

1. **Originaltreue Reproduktion:** `BroadcastBar.tsx`-Layout + `theme.ts`-Farben + die
   Original-Assets (`hud_tv_frame`, `hud_tv_testcard`, `audience_room`, `audience_*`-Sheets)
   1:1 als Standalone-HTML nachgebaut und mit Headless-Chrome geschossen (Standby-Fixture:
   `lastItem=null`, `history=[]`, `quote=0`; Figuren = die ersten 4 Segmente aus
   `audience.json` mit ihren echten Default-Moods). Ergebnisse in
   `docs/review-evidence/2026-07-06/`. Deckt sich mit den Owner-Screenshots.
2. **Ground-Truth per Pixel-Dekodierung** (ohne Browser, ohne KI): die roh-PNGs direkt
   dekodiert, um Artefakte und Palette **messbar** statt „gefühlt" zu belegen.
3. **Gemini 3.1 Pro als Zweitmeinung** (`scripts/visual-review/gemini-review.mjs`) auf
   dieselben Reproduktionen — Zusammenfassung in §5.

> Cross-Ref: baut auf `VISUAL_REVIEW_2026-07-05.md` auf (dort V15 „Wohnzimmer/Publikum",
> B1 Integer-Scaling §4.1, B4 Queue-Widget verdeckt Publikum, P5 „Drahtgitter im
> Broadcast-Zustand sichtbar"). Prüf-Bar = `GESAMTKONZEPT_VISUELL.md` §4 + Stil-Lock
> „Behörden-Akte" (§4.7) + `styleHome()`-Mandat für Heim-Szenen (Shot-List Paket B).

---

## 1. Röhren-TV links (Standby) — **überwiegend stark**

`BroadcastScreen` blendet `hud_tv_frame.png` (512×384) über ein transparentes Bildröhren-
Loch (17 % / 29 % / 48 % / 45 %), darin `hud_tv_testcard.png` (`object-fit: cover`) plus
animierte Scanlines, oben links „○ STANDBY" (hell-rot `#E5484D`).

**Stärken**
- Das Gehäuse ist handwerklich das beste Element der Leiste: klobiges Holz-Furnier,
  Bakelit-Knöpfe, Behelfs-Antenne — trifft die „Behörden-Akte/Ost-Block"-Materialwelt sauber.
- Diegetisch richtig gelöst: Sendepause = **Testbild** statt totem „KEIN SIGNAL"-Text.
- „○ STANDBY" ruhig und lesbar; kein Alarm-Grün/-Rot-Missbrauch.

**Schwächen (klein bis mittel)**
- **T1 — Testbild ist kein echtes Pixel-Art.** `hud_tv_testcard.png` zeigt Banding in der
  Graustufen-Treppe und weiche Kanten an den Farbfeldern; es wirkt wie ein
  herunterskaliertes High-Res-Bild. Zusammen mit `imageRendering: cover` bricht das die
  Pixel-Illusion genau im Fokuspunkt der Röhre. *(Gemini-bestätigt; verwandt mit B1 §4.1
  „nur ganzzahlig / pixelated".)*
- **T2 — flache Mattscheibe.** Das Loch ist ein Rechteck; keine Röhren-Wölbung, kein
  Glas-Glow/Vignette. Der Bildschirm wirkt „aus" statt „leuchtet".
- **T3 — Scanlines nur im Loch**, nicht auf dem Glas-Rand — der CRT-Effekt endet an einer
  harten Kante. (Kosmetisch.)

**Verdikt TV:** solides, stimmiges Asset; einzige echte Baustelle ist das **Testbild neu
pixeln** (per Hand, solide Farben, eingebrannte Scanlines) — 0 $ Handarbeit.

---

## 2. Publikums-Wohnzimmer rechts + Figuren — **der Raum top, die Figuren das Problem**

`AudienceRoom` legt `audience_room.png` (1344×768, warm, gemütlich) als `cover`-Hintergrund,
darüber eine zentrierte Reihe der ersten 4 Segmente als `PixelSprite` (scale 2,2 → 48→106 px),
mit Mood-Bildfilter, Überzeugungs-Sockel und Wohnzimmer-Alphabet-Badge.

**Stärke:** Der Raum selbst ist sehr schönes Pixel-Art — warmes Stehlampen-Licht, Sofa,
Pflanze, gerahmte Blumenbilder, Teppich. Als Bühne trägt er.

**Aber die Figuren sitzen nicht in diesem Raum — sie kleben davor.** Drei belegte Befunde:

### F1 — **Asset-Defekt: eingebackter Rahmen in `audience_macher.png`** 🔴 (neu, kritisch)
Um „Die Macher" (der bärtige Mann) liegt ein rechteckiger dunkel-blaugrauer Rahmen. Das ist
**kein Overlay, keine Annotation, kein Harness-Artefakt** — der Rahmen steckt im PNG selbst.
Pixel-Dekodierung des Roh-Sheets:

```
audience_macher.png (96×48, 2 Frames à 48×48)
  Frame 1: Rand-Deckung L=1.00 R=1.00 T=1.00 B=1.00  → geschlossener Rahmen
  Frame 2: Rand-Deckung L=1.00 R=1.00 T=1.00 B=1.00  → geschlossener Rahmen
  Rahmenfarbe ≈ RGB(53,62,74)
```

Beide Animationsframes tragen ihn → er flackert nicht, er steht **konstant im Spiel**. Kein
anderes `audience_*`-Sheet hat das. Ursache: Export-/Isolations-Fehler bei der
Asset-Erzeugung (der 1–2 px breite Rahmen-Ring, slate/violett, saß auf dem äußersten
Frame-Rand; die Figur liegt vollständig im Innern bei x∈[3,44], y∈[1,46]).

> **✅ BEHOBEN (2026-07-06):** Rahmen-Ring in **beiden** Frames auf transparent gesetzt
> (Rand-Deckung L/R/T/B jetzt 0.00; nur 422 Rand-Pixel entfernt, Figur unangetastet —
> 2853→2431 opake Pixel). Beleg: `review-evidence/2026-07-06/fix_macher_rahmen_vorher_nachher.png`
> (Vorher/Nachher, beide Frames) + `publikum_wohnzimmer_nach_F1.png` (Kasten weg im Kontext).
> Reine Pixel-Bearbeitung des PNG (gleiche 96×48-Maße/Frames), kein Code/`assets.json` berührt.

### F2 — **Paletten-/Stil-Bruch im Figuren-Set** 🟠 (neu, messbar)
Das Set stammt sichtbar aus zwei „Bädern": warm & satt (macher, bohemien) vs. kalt &
entsättigt (optimiererin, besorgte_mitte, zorniger). Im warmen Wohnzimmer wirken die kalten
Figuren wie blaugraue „Geister". Hue-Analyse der Roh-Sheets (Frame 1, opake Pixel):

| Sprite | warm-Hue % | cool-Hue % | mittl. Sättigung | Einordnung |
|---|---|---|---|---|
| bohemien | 34,0 | 49,4 | 0,47 | warm/satt |
| macher | 22,9 | 68,7 | 0,35 | warm-neutral (cool durch Rahmen F1 + Jacke) |
| **optimiererin** | **3,0** | **91,4** | 0,35 | kalt |
| **zorniger** | **2,8** | **93,5** | 0,34 | kalt |
| **besorgte_mitte** | **0,0** | **93,3** | 0,38 | eiskalt (**0 %** warme Pixel) |

Drei von fünf Figuren haben praktisch **null** warme Pixel — der Raum dagegen ist durchweg
golden. Das ist kein Geschmack, das ist ein objektiver Bruch und verletzt das
**`styleHome()`-Mandat** (warm) für Heim-Szenen (Shot-List Paket B warnt wörtlich vor dem
„Propaganda-Fabrik-Look", wenn Heim-Assets kalt geraten).

**Wurzel (aus `assets.json`):** Die `audience_*`-Sprite-Prompts fordern explizit die
**kühle Ministeriums-Palette** — wörtlich „cool, clean, slightly desaturated modern palette:
cool greys (#262A31, #3A3F47, #9AA1AC, #E7EAEF) … no saturated candy colors, no pastel
tones … state ministry interior". Die Figuren wurden also für das **Behörden-Interieur**
gestylt, nicht fürs warme Wohnzimmer, in dem sie sitzen. Deshalb ist der saubere Fix ein
**Regen mit `styleHome()`** (warm, gleicher Seed/`referenceId`), nicht bloß ein Hue-Shift —
ein reiner Recolor kaschiert nur, die Prompt-Vorgabe bleibt sonst falsch.

### F3 — **„Sticker-Effekt": keine Schatten, keine Lichtannahme** 🟠 (neu)
Die Figuren werfen keinen Schatten aufs Polster und nehmen das warme Lampenlicht nicht an →
sie schweben vor dem Sofa statt darin zu sitzen. Zusätzlich: **harte schwarze Outlines** der
Figuren gegen das **Selout** (weiche, farbige Outlines) des Raums — zwei Zeichenschulen in
einem Bild. *(Gemini-Hauptbefund.)*

### F4 — **Mood-Filter liest sich als Render-Bug, nicht als Stimmung** 🟡 (Design)
`MOOD_FILTER.misstrauisch = hue-rotate(165deg) saturate(0.55) brightness(0.8)` färbt die
`bohemien`-Figur (roh warm/auburn) grünstichig-blau. Gemini hat das prompt als
„fehlerhaften Blend-Mode/Palette beim Export" gemeldet — **das ist es nicht**, es ist die
gewollte Stimmungs-Einfärbung. Aber genau das ist der Punkt: der Filter ist so aggressiv,
dass er wie ein Defekt wirkt statt wie „misstrauisch". Zusammen mit F2 (schon kalte Sprites)
addieren sich zwei Entsättigungen → Zombie-Look. **Empfehlung: Mood eher über Haltung/Badge/
Gesicht zeigen, den globalen Bildfilter deutlich zurücknehmen.**

### F5 — **Kopf-/Fuß-Schnitt** 🟡
Die 48×48-Frames sind unten hart abgeschnitten; im Raum steht die Schnittkante frei über dem
UI-Rand statt sauber dahinter zu verschwinden. Figuren 2–3 px tiefer setzen bzw. hinter den
Balken schieben. *(Gemini-bestätigt.)*

### Cross-Ref (aus 2026-07-05, hier nicht neu gemessen)
- **B4:** „AKTIONEN-WARTESCHLANGE" verdeckt im echten Spiel das rechte Publikums-Panel.
- **P5:** „Drahtgitter-/Hotspot-Overlay im Broadcast-Zustand sichtbar" — beim Nachstellen
  im laufenden Spiel prüfen (nicht Teil dieser Standalone-Reproduktion).

---

## 3. Kohärenz zwischen den Elementen

Drei Texel-Dichten/Stile treffen in einer Leiste aufeinander:
- **TV-Rahmen:** grobes, erdiges Low-Res-Pixel-Art (passt zu „Behörden-Akte").
- **Wohnzimmer:** feines, weiches, fast gemaltes Hi-Res-Pixel-Art (Indie-West-Look,
  „Stardew/Unpacking").
- **Figuren:** mittlere Auflösung, gemischte Palette, harte Outlines, + ein Sheet mit Rahmen.

Der **Ost-Behörde ↔ West-Wohnzimmer-Kontrast ist konzeptionell goldrichtig** (Sender vs.
Publikum). Aber der Bruch ist aktuell **handwerklich** (Outlines, Shading, Palette,
Texel-Dichte), nicht nur thematisch — es sieht nach „aus zwei Asset-Packs zusammengekauft"
aus. Das ist behebbar, ohne den gewollten Kontrast aufzugeben.

---

## 4. Priorisierte Empfehlungen

| # | Maßnahme | Aufwand | Wirkung |
|---|---|---|---|
| ~~**P1**~~ ✅ | ~~**F1 fixen:** Rahmen aus `audience_macher.png` (beide Frames) entfernen~~ **— erledigt 2026-07-06** | Minuten, 0 $ | sichtbarer Bug weg |
| **P2** | **F2 fixen:** die 3 kalten Sprites in die warme Heim-Palette ziehen (recolor **oder** `referenceId`-Regen mit `styleHome()`, gleicher Seed) | 3–5 Shots ≈ 1,5 $ **oder** Handarbeit | Figuren gehören in den Raum |
| **P3** | **F3:** weiche Drop-Shadows unter die Figuren + leichter warmer Licht-Overlay (10–15 %); Outlines abmildern | Code/CSS + Asset | Sticker-Effekt weg |
| **P4** | **T1:** Testbild neu pixeln (solide Farben, eingebrannte Scanlines) | Handarbeit, 0 $ | Röhre wirkt echt |
| **P5** | **F4/F5:** Mood-Filter entschärfen; Figuren tiefer/hinter den UI-Rand | Code | Stimmung statt Bug-Look |

**Reihenfolge:** P1 (Bug) → P3 (Integration, größter Kohärenz-Gewinn pro Aufwand) → P2
(Palette) → P4/P5. P1/P3/P4/P5 sind reine Handarbeit/Code (0 $), nur P2 braucht ggf. Regen.

---

## 5. Gemini 3.1 Pro — Zweitmeinung (Zusammenfassung)

Gemini kam unabhängig zu deckungsgleichen Kernbefunden und lieferte zwei Zusatzpunkte:

- **TV:** Gehäuse gut; Testbild „kein echtes Pixel-Art" (Banding/weiche Kanten); flache
  Mattscheibe ohne Wölbung/Glow. → deckt sich mit T1–T3.
- **Wohnzimmer:** Raum „handwerklich sehr schön"; Figuren „wie aufgeklebt", **keine Schatten**,
  kühle „Zombie-Hautfarbe" gegen warmen Raum; harte vs. Selout-Outlines „beißen sich".
  → F2/F3.
- **Bug-Hunting:** **lila/violette Bounding-Box um den bärtigen Mann „in Raum UND
  Sprite-Sheet — klarer Export-Fehler"** (= F1, unabhängig bestätigt); „schwebendes EI"
  (= das `einsam`-Badge der misstrauischen bohemien-Figur, korrekt platziert — hier **kein**
  Fehler); harte Fuß-Schnittkante (= F5).
- **Kohärenz:** inkonsistente Texel-Density; Ost-Block-UI vs. West-Indie-Wohnzimmer — „falls
  Absicht, konzeptionell super, aber der Stil muss aus einem Guss wirken".

**Eine Gemini-Aussage korrigiert:** Gemini deutete die blau-grüne bohemien-Figur als
„Export-Bug". Real ist es der **absichtliche `misstrauisch`-Mood-Filter** (F4) — die Kritik
(wirkt wie ein Bug) bleibt gültig, die Ursache ist aber Design, nicht Export.

---

## 6. Was das 2026-07-05-Review übersah (Methodik-Notiz)

Das große Review vom Vortag stufte V15 „Wohnzimmer/Publikum" als „Sitzkomposition ok" ein und
verwies aufs Studio-/Wohnzimmer-Upgrade. **Nicht erfasst** wurden: der eingebackene Rahmen in
`audience_macher` (F1), der messbare Paletten-Bruch im Figuren-Set (F2), der fehlende
Schatten/Sticker-Effekt (F3) und das nicht-pixelige Testbild (T1). Grund (wie schon im §2b-
Nachtrag von 2026-07-05): die Prüf-Bar misst Standlinien/Größen in der Welt, aber **nicht
Paletten-/Licht-Konsistenz einzelner Asset-Familien** und **nicht per-Asset-Artefakte**. →
Vorschlag: „Palette-/Outline-/Licht-Kohärenz je Asset-Familie" + „per-Sheet-Rand-Artefakt-
Scan" in die Ernte-/Prüf-Basis aufnehmen (der Rand-Scan aus §2/F1 ist trivial automatisierbar).

---

*Belege: `docs/review-evidence/2026-07-06/` (Standby-Leiste-Repro, Wohnzimmer-Repro,
isolierte Figuren-Sprites mit sichtbarem Rahmen). Reproduktion & Pixel-Analyse:
Headless-Chrome + eigene PNG-Dekodierung; Zweitmeinung: Gemini 3.1 Pro.*
