# 🔎 VISUAL REVIEW 2026-07-05 — optisches Gesamt-Review (Befunde + Plan, KEINE Fixes)

**Status:** Befund-Dokument. Es wurde NICHTS generiert und NICHTS gefixt — Umsetzung erst
nach Owner-Budget-Freigabe (Shot-List-Plan in §6).
**Methodik:** wiederverwendbare Playwright-Ernte über alle Screens/Zustände
(`desinformation-network/scripts/visual-review/`, README dort) → 105 Artefakte
(94 Screenshots inkl. Boden-Linien-Overlays, 11 Video-Clips) → zweischichtige
Realitätssicht (pixelgenaue Geometrie ohne KI + Wahrnehmungs-Prüfung mit eingezeichneter
Engine-Boden-Linie) → orchestriertes Vision-Review (parallele Prüfer je Screen-Bündel
gegen Stil-Bibel `GESAMTKONZEPT_VISUELL.md` §4 + M1–M8; Gemini 3.1 Pro als Zweitmeinung,
Haupt-Prüfer für die Video-Clips) → **jeder Befund adversarial verifiziert** →
Regressions-Sweep der früher gefixten Klassen (V7-Schweben, Wand-Fuß-Linie, V9-Kacheln).

> Lese-Reihenfolge für die nächste Session: dieses Dokument → §6 Shot-List-Plan →
> `scripts/visual-review/README.md` (Ernte wiederholen/erweitern).

---

## 1. Realitätssicht, Schicht a — pixelgenaue Messung (ohne KI)

Referenz-Maßstab: **Avatar = 1,75 m = 128 px ⇒ 73,1 px/m.** Engine-Soll-Standlinie =
Wand-Fuß-Linie (`floor.y + STAGE.floorHeight − STAGE.floorStrip`). Gemessen wurde je
sichtbarem Element die tatsächliche Pixel-Unterkante (DOM-Box × Alpha-Scan der Assets,
Schwelle 8 wie `pixel-asset-pipeline`). Voller Report: `runs/visual-review/latest/geometry-report.json`.

### 1.1 Standlinien: die Objektklassen sind gegeneinander versetzt (Kern-Messbefund)

| Klasse | sichtbare Unterkante vs. Boden-Linie | Ursache | Einordnung |
|---|---|---|---|
| Deko-Props (Pflanze, Automat, Bank, …) | **exakt AUF der Linie (0 px)** | Assets sauber getrimmt (padBottom 0) | ✅ Referenz-Klasse |
| Avatar (m + w) | **6 px darüber** | bewusster `−6`-Offset in `walkY` (`buildingLayout.ts:94`) | Code-Fix (Offset entfernen oder für alle Klassen vereinheitlichen) |
| Türen (alle 5 Etagen) | **7,5 px darüber** | **eingebacktes Boden-Padding: 10 px Transparenz** im 192-px-Asset (`bld_door_closed` padB=10, `bld_door_open` padB=9) | Asset-Korrektur (trim) ODER Code-Kompensation |
| Statisten/Pförtner/Tür-Dummies/Walker | **11–16 px darüber** (clerk 16 px Etage 3/4, 11 px Etage 1 · cleaner_walk 16 px · Pförtner 13 px) | `PixelSprite`-Span (96 px nativ) richtet sich im höheren Container (112/116 px) NICHT an der Container-Unterkante aus; `transformOrigin: bottom` skaliert von der Span-Unterkante bei y=96 | **Code-Fix (eine Stelle, heilt 4 Figuren-Typen)** |

Der frühere V7-Fix (Avatar-Schweben) hält für den AVATAR; die Statisten-Klasse aus
Strang 5 hat denselben Fehler-TYP an anderer Stelle neu eingeführt → Regressions-Befund.

### 1.2 Maßstabs-Tabelle (sichtbare Höhe in Metern, Klassen über Etagen konsistent?)

| Klasse | gemessen | Soll-Bereich (aus 1,75-m-Referenz) | Konsistenz über Etagen |
|---|---|---|---|
| **Tür** | **1,77 m = 1,01 H** | 1,9–2,3 m (Stil-Bibel: **1,15 H ≈ 2,0 m**) | ✅ einheitlich — aber **klassenweit zu klein**: Tür = Avatarhöhe wirkt gedrungen; Ursache ist das eingebackene Padding (Box 144 px stimmt, sichtbar nur ~130 px) |
| Statisten-Figuren | 1,53 m | 1,5–1,95 m | ✅ (bewusst etwas kleiner als Avatar) |
| Pförtner | 1,56 m | 1,5–1,85 m | ✅ |
| Pflanze groß | 1,48 m | 1,0–1,9 m | ✅ |
| Pflanze klein | 0,60 m | 0,5–1,2 m | ✅ |
| Wasserspender | 1,31 m | 0,9–1,4 m | ✅ |
| Getränkeautomat | 1,91 m | 1,5–2,0 m | ✅ |
| Kaffee-Station | 1,42 m | 0,85–1,5 m | ✅ (obere Kante) |
| Bank | 0,74 m | 0,7–1,1 m | ✅ |
| Stühle | 0,90 m | 0,7–1,2 m | ✅ |
| **Aktenvernichter** | **1,20 m** | 0,5–1,1 m | leicht drüber (brusthoher Shredder — vertretbar, Owner-Blick) |
| Mülleimer | 0,74 m | 0,3–0,9 m | ✅ |
| Fahrstuhl-Kabine | 2,86 m | (Schacht) | ✅ plausibel; **aber Content-Sprung offen↔zu: 194 vs. 209 px** → sichtbarer Versatz beim Überblenden |

**Fazit Schicht a:** Die Möbel-/Geräte-Skala ist insgesamt bemerkenswert konsistent
(Ergebnis der Pipeline-Disziplin). Die drei echten Ausreißer sind die
**Standlinien-Klassen-Versätze (1.1)**, die **zu kleine sichtbare Türhöhe** und der
**Kabinen-Content-Sprung** — alle drei mit Pixel-Beleg, alle drei günstig behebbar.

### 1.3 Asset-Padding-Audit (218 Assets)

Alle im Gebäude platzierten Props/Figuren-Sheets sind sauber getrimmt (padBottom 0).
Eingebacktes Padding tragen: `bld_door_closed/open` (10/9 px unten — s. o.),
`elevator_cabin_open` (16 px unten vs. 7 px bei `closed`), sowie (unkritisch, da nicht
bodenstehend platziert) `prop_coffee` 246 px, `prop_safe` 165 px, `prop_world_map` 144 px
und mehrere `icon_*` (asymmetrische Content-Boxen — für Icon-Ausrichtung relevant).
Voll-Liste: `runs/visual-review/latest/asset-audit.json`.

## 2. Vision-Review (Bündel-Prüfer + Gemini-Zweitmeinung, adversarial verifiziert)

_[WIRD NACH ABSCHLUSS DES REVIEW-ORCHESTERS GEFÜLLT — §2 Befunde nach Priorität,
§3 Regressions-Sweep-Ergebnis, §4 Video-/Animations-Befunde, §5 Lücken.]_

## 6. Shot-List-Plan (pixel-asset-pipeline-Format) + Kostenschätzung

> **NICHTS davon ist generiert.** Format = `tools/asset-pipeline/src/shotlist.mjs`-Einträge
> (`id/type/kind/priority/aspectRatio/size/seed: seedFor(id)/prompt`), Stile aus
> `styleguide.mjs` (`styleCore()`/`styleHome()`/`styleObject()`), Budget-Mechanik der
> Pipeline (Dry-Run-Default, `PIPELINE_MAX_IMAGES=12`/Lauf, idempotent) bleibt in Kraft.
> Generierung erst nach Owner-Freigabe, dann per
> `node src/cli.mjs generate --images --only <ids> --live --limit 12`.

### Kosten-Basis (Stand 2026-07, Google-API-Preisliste)
`gemini-3-pro-image`: ~**0,134 $/Bild** im 1–2K-Tier (unsere Räume 1344×768, Porträts
1024×1024 teils im 0,039-$-Tier); 4K 0,24 $. Kalkulation unten konservativ mit
**~0,27 $/Shot effektiv** (Vision-QC verwirft erfahrungsgemäß ~jede zweite Erzeugung;
Stil-Lock-Kandidaten ×2–3 beim jeweils ersten Bild einer neuen Familie). Die reine
API-Rechnung ist also **Cent-Bereich — der eigentliche Aufwand ist die QC-/Platzierungs-
Session** (Trimmen, Standlinie, Gate), nicht der Bild-Preis.

### Paket 0 — KEINE Generierung: Asset-Nachbearbeitung + Code (behebt §1-Messbefunde)
| Was | Art | Aufwand |
|---|---|---|
| `bld_door_closed`/`bld_door_open` unten trimmen (10/9 px) → Türen stehen AUF der Linie und wirken wieder ~1,97 m hoch (1,13 H ≈ Stil-Bibel-Soll) | Asset-Korrektur (sharp-trim, 0 $) | Minuten + Gate |
| `elevator_cabin_open` Content-Box an `closed` angleichen (16 vs. 7 px unten) → kein Sprung beim Überblenden | Asset-Korrektur (0 $) | Minuten + Gate |
| `PixelSprite`-Bodenbündigkeit im Container (heilt Statisten/Pförtner/Walker/Tür-Dummies, 11–16 px) | Code-Fix | 1 Stelle + Smoke |
| `walkY`-Offset −6 px vereinheitlichen (Avatar exakt auf Klassen-Linie) | Code-Fix | 1 Zeile + Smoke |

### Paket A — TV-Studio-Set (E17, Owner-Priorität aus Etappe 5; „4 Bilder tragen 80 %")
| id | kind | priority | Format | Prompt-Kern |
|---|---|---|---|---|
| `tv_studio_wahlstudio` | room | must | 4:3, 1024×768 | election-night TV studio backdrop, anchor desk, big abstract poll graphic wall, cool blue studio light, no people, no text, `styleCore()` |
| `tv_studio_sondersendung` | room | must | 4:3, 1024×768 | same studio re-lit in alarm red for a breaking-news special, `referenceId: tv_studio_wahlstudio` (gleicher Seed → gleiche Geometrie) |
| `tv_anchor_sprecherin` | figure | must | 1:1, 1024 | news anchor woman, bust, facing camera, modest western TV dress, isolated on chroma magenta (Objekt-Isolation!) |
| `tv_grafik_hochrechnung` | prop | nice | 16:9 klein | abstract election bar-chart overlay panel, no text (Text bleibt flexible Ebene, §4.5/E35) |

Einsatzorte: `TvSet`-Baukasten (`WahlabendScene`) — Drop-in unter die bestehende
Text-Ebene ohne API-Änderung; derselbe Baukasten bespielt künftig Broadcast-„Sondersendung".
**Kosten: 4 Shots ≈ 1,10 $** (inkl. QC-Verschnitt).

### Paket B — Wohnzimmer-Alphabet (5 Bilder, Etappe-4-Carry-forward, styleHome!)
`wz_kuechenstreit` · `wz_einsam_videospiel` · `wz_abwinken_tv` · `wz_parteifahne` ·
`wz_faktencheck_zeitung` — je kind `room`-Detail, 4:3, priority must (E6: Zustände NUR
als Bilder sichtbar). WARNUNG aus dem Skill: zwingend `styleHome()` (warm), sonst
„Propaganda-Fabrik-Look". **Kosten: 5 Shots ≈ 1,35 $.**

### Paket C — aus den Review-Befunden (§2) abgeleitet
_[WIRD NACH SYNTHESE GEFÜLLT — Kandidaten je nach Bestätigungslage: Lobby-Breitbild +
Empfangstresen (V9-Rest), 9-Slice-DialogBox-Asset (V3 optional), Hi-Res-Avatar-Sheets
(V16), Broadcast-TV-Rahmen.]_

**Gesamt-Budget-Ansage (Pakete A+B): ~2,50 $ API + eine QC-/Platzierungs-Session.**
Weit unter der SOUL-§3.8-Warnschwelle; die Budget-Ansage erfolgt trotzdem, weil
Owner-Freigabe für JEDE Generierung vereinbart ist.
