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

_[WIRD NACH SYNTHESE GEFÜLLT]_
