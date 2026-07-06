# Visual-Review-Ernte (wiederverwendbar)

Playwright-Werkzeugkette für das optische Gesamt-Review: Screenshots über ALLE
Screens/Zustände (inkl. Tag/Nacht, drei Wahlabend-Enden, Modals), kurze
Video-Clips aller animierten Elemente, pixelgenaue Standlinien-Messung
(Realitätssicht) und Gemini-Zweitmeinung.

## Lauf

```bash
cd desinformation-network
npm ci                      # Container-Falle: Toolchain zuerst
npm run build               # baut auch die Fixture-Bühne vqa.html
npm run preview -- --port 4173 &   # Preview-Server (Hintergrund)

node scripts/visual-review/harvest.mjs                  # alles (Shots + Clips)
node scripts/visual-review/harvest.mjs --no-clips       # nur Screenshots
node scripts/visual-review/harvest.mjs --only title,office
node scripts/visual-review/asset-audit.mjs              # PNG-Padding/Content-Box
node scripts/visual-review/analyze-geometry.mjs         # Boden-Linien-Report
```

Ausgabe unter `runs/visual-review/latest/` (gitignored):

| Pfad | Inhalt |
|---|---|
| `shots/*.png` | Screenshots je Zustand (`manifest.json` beschreibt jeden) |
| `overlay/*__floorlines.png` | dieselben Ansichten mit eingezeichneter **Wand-Fuß-Linie** (magenta) + vorderer Bodenkante (cyan, gestrichelt) |
| `clips/*.webm` | Video-Clips der animierten Elemente (Laufzyklus, Fahrstuhl, Tag/Nacht-Sweep, Wahlabend …) |
| `geometry/*.json` | DOM-Messungen (Stage-px) je Gebäude-Shot |
| `asset-audit.json` | Content-Box/eingebacktes Rand-Padding jedes Bild-Assets (sharp-Alpha-Scan, Schwelle 8 wie die Pipeline) |
| `geometry-report.json` | Befunde: schwebt/versinkt (px), Maßstab vs. 1,75-m-Referenz, Klassen-Konsistenz über Etagen |
| `console-errors.txt` | gesammelte Konsolen-Fehler aller Zustände |

## Bausteine

- **`?vqa=1`-Hook** (`src/story-mode/harness/vqaHook.ts` + Effect in
  `StoryModeGame.tsx`): exponiert `window.__VQA__` mit STAGE/Layout/Deko-Tabellen
  (Geometrie-Ground-Truth), Tagesuhr-Setter, Engine + UI-Settern. Ohne den
  Query-Parameter vollständig inert.
- **Fixture-Bühne** `vqa.html?scene=wahlabend&branch=victory|timeout|immune|exposed`:
  mountet die prop-getriebene `WahlabendScene` deterministisch (Werte spiegeln
  die echte Engine-Abbildung 9 % + p·18 %).
- **Force-End** (harvest.mjs §4): zieht in einer echten Partie den Wahltag auf
  heute (timeout), setzt die Abwehr auf 100 (immune) bzw. pinnt den
  Gesellschafts-Snapshot (victory) → echter Wahlabend → GameEndScreen → End-Report.
- **Gemini-Helfer** `gemini-review.mjs`: Bilder/Clips + Prompt an die Gemini-API
  (`GEMINI_API_KEY`); `--list-models` zeigt verfügbare Modelle.

## Hinweise

- **ffmpeg im Container** (`/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux`) ist ein
  gestrippter Build ohne `fps`-Filter: Keyframes aus Clips daher mit
  `-ss <sek> -i clip.webm -frames:v 1 out.png` ziehen (mehrere Probes), NICHT mit `-vf fps=…`/`-r 1`.
- Clips enthalten am Anfang den Intro-Vorlauf (Spielstart); der relevante Inhalt
  liegt in den LETZTEN `durationMs` Millisekunden (siehe manifest.json).

## Wieder verwendbar für künftige Sessions

Neue Zustände: in `harvest.mjs` einen `shot(...)`/`recordClip(...)`-Block
ergänzen (deklarativ, `--only` fürs gezielte Nach-Ernten). Neue Etagen/Räume
aus `building.json` erscheinen automatisch (Layout kommt aus dem Hook).
