---
name: pixel-asset-pipeline
description: Pixel-Art-Assets für das Story-Mode-Gebäude erzeugen UND pixelgenau platzieren (Gemini-Pipeline in tools/asset-pipeline). Nutze dies bei neuen/überarbeiteten Räumen, Props, Korridor-Deko, Figuren oder Hintergründen — es bündelt die hart erarbeiteten Lehren: Objekt-Isolation, Heim-Wärme, Trimmen, flach-frontale Perspektive, reale Proportionen, Platzierung an der Wand-Fuß-Linie und Vision-QC.
---

# Pixel-Asset-Pipeline — erzeugen & platzieren

Erprobte Vorgehensweise aus Strang 34/Visual-Politur. Ziel: Assets, die **zum
Hintergrund und zum Avatar passen** (reale Größen, richtige Perspektive, richtige
Standlinie) — nicht „zwei Welten" oder „Sachen mitten im Weg".

## 0. Werkzeug
```bash
cd tools/asset-pipeline
node src/cli.mjs generate --images --only <id1,id2> --live [--force] --limit N   # Budget: 12 Bilder/Lauf
```
Shot-Definitionen in `src/shotlist.mjs`, Stile in `src/styleguide.mjs`. Default ist
Dry-Run; echte Erzeugung nur mit `--live`. Vorhandene Dateien werden ohne `--force`
übersprungen. Keys (`GEMINI_API_KEY`/`ELEVENLABS_API_KEY`) liegen in der Umgebung.

## 1. Den richtigen STIL je Asset-Typ wählen (häufigster Fehler!)
- **Freistehendes Objekt / Korridor-Deko** → `styleObject()` **+ strenge Isolation**:
  „A single isolated object … ALONE on flat magenta — NO room, NO floor, NO wall,
  NO scenery, ONLY the object." Sonst malt das Modell eine **Mini-Raumszene** drumherum.
- **Heim / Wohnzimmer der Fernsehfamilie (Westunion)** → `styleHome()` (warm, hell,
  gemütlich). **NICHT** `styleCore()` — das ist das kühl-graue Ministerium und sieht
  sonst „wie die Propaganda-Fabrik" aus.
- **Ministeriums-Raum / Korridor-Wand** → `styleCore()` (kühl-modern, Beton/Glas).
- **Objekt für flachen Querschnitt** → „strict flat front/side ELEVATION view,
  orthographic, **NO isometric**, no 3/4 or top-down". Isometrische Props sitzen sonst
  perspektivisch falsch im flachen Flur.
- **Saubere Basis-Korridore** → Wand+Dado+Decke+Boden, **NICHTS** an die Wand backen
  (keine Uhr/Poster/Bank) — die werden separat platziert (sonst wiederholen sie sich beim Kacheln).

## 2. Trimmen — Voraussetzung für pixelgenaue Platzierung
Props kommen als **1024×1024 mit transparentem Rand**. Vor dem Platzieren auf die
Content-Box trimmen, sonst „schwebt" das Objekt (Padding unter den Füßen):
```js
import sharp from 'sharp';           // aus tools/asset-pipeline ausführen (dort liegt sharp)
await sharp(f).trim({ threshold: 8 }).toFile(f);   // schreibt das getrimmte PNG zurück
```

## 3. Reale Proportionen
Avatar ≈ 1,7 m ≈ **128 px** ⇒ **~75 px/Meter**. Beispiele: Pflanze ~105 px,
Wasserspender ~96 px, Getränkeautomat ~140 px (knapp mannshoch). Tür `doorHeight`=144.

## 4. Platzieren in `BuildingStage` — die WAND-FUSS-LINIE
Der wichtigste Punkt: Dinge stehen auf der Linie, **wo die Wand auf den Boden trifft**
(`floor.y + STAGE.floorHeight - STAGE.floorStrip`), **nicht** auf der vorderen Boden-
kante. Sonst stehen Deko/Türen „vor der Wand im Weg" und Türen ragen in den Boden.
- Bodensteher: Unterkante = Wand-Fuß-Linie, `transform: translateX(-50%)`.
- Wand-Objekte (Poster/Uhr): auf Wandhöhe (oberes Drittel).
- **Avatar + Türen teilen dieselbe Linie** (`STAGE.floorStrip`-Offset überall gleich).
- Datengetrieben in `building/corridorDecor.ts` (`FLOOR_DECOR`/`DECOR_HEIGHT`);
  Positionen bewusst in die **Tür-Lücken** legen (nicht über Türen/Schacht).

## 5. Hintergrund-Schichten (gegen „Skyline hängt"/„Baulücke")
- Himmel = `building/skyTime.ts` (tagesuhr-Verlauf) + Mask-Ausblendung am oberen Rand
  (natürlicher Stadt→Himmel-Übergang).
- Skyline = **dichte, durchgehende** Tile (keine Zahnlücken), Anzeige **≤ Native-Höhe**
  (sonst hochskaliert/unscharf).
- Untergrund (`bld_underground`) hinter/unter der untersten Etage (Keller) → Skyline
  „hängt" nicht, Keller wirkt unterirdisch.

## 6. Vision-QC ist PFLICHT
**Jedes** neu erzeugte PNG ansehen, bevor es platziert wird. Wiederkehrende Fehler:
Mini-Szene statt isoliertem Objekt · isometrisch statt frontal · Kopf/Rand
abgeschnitten · falsche Palette (kühl-grau statt warm) · nicht nahtlos kachelbar.
Schnelle Heuristik: Szene-Props sind **deutlich dateigrößer** als isolierte Objekte.

## 7. Gate
`npx tsc --noEmit` · `npx vitest run` · `npm run build` müssen grün sein; Assets
zusätzlich per Browser-Smoke/Deploy-Preview im echten Gebäude prüfen (Größen/Standlinie).
