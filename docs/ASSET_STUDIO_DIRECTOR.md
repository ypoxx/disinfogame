# 🎬 Asset Studio — Regie-Modus (Art-Director-Assistent)

> **Status:** Aktiv (umgesetzt) · **Aktualisiert:** 2026-06-03 · **Scope:** Tooling (Track A-2) · Basis: `sprite-tool/`
> **Verwandt:** [`ASSET_STUDIO_SPEC.md`](ASSET_STUDIO_SPEC.md) (Bauplan/Milestones) · [`ASSET_BACKEND.md`](ASSET_BACKEND.md) (Konzept) · [`BUILDING_AND_ASSETS.md`](BUILDING_AND_ASSETS.md) · [`VISION_LOCK.md`](VISION_LOCK.md) §5

## Zweck (1 Satz)
Aus dem reinen Bild-Generator wird ein **Art-Director-Assistent**: das Studio kennt das Spielkonzept,
macht **Vorschläge**, **diskutiert Varianten** (Claude *sieht* die Bilder) und **erzwingt Konsistenz** über
eine versionierte Stil-Bibel + Master-Referenzen — damit Alex eine stimmige Grafik **über alle Details** bekommt.

## Rollenteilung
- **Claude = Regie/Kritik/Gedächtnis.** Schlägt Stil-Richtungen & Prompts vor, **bewertet generierte Varianten visuell** (multimodal), diskutiert im Chat.
- **Gemini (Nano Banana Pro) = Kamera.** Rendert.
- **Das Studio = Erinnerung.** Stil-Bibel + Master-Referenzen + Shot-Status (IndexedDB).
- **Robust:** Die deterministischen Teile (Shot-Liste, Generieren, Slicen, Export, Fallback-Prompts) laufen **auch ohne Claude-Key**.

## Der Ablauf (5 Stufen)
1. **Briefing** — Das Studio liest `building.json` + `npcs.json` + Style-Guide (Snapshot in `public/game/` bzw. `public/context/`). Es *kennt* Cast & Räume → kein leerer Prompt-Kasten.
2. **Stil-Findung** — Claude schlägt mehrere **distinkte** Richtungen vor (inkl. mutiger Alternative zum Brutalismus); pro Richtung wird **dasselbe Testmotiv** generiert → sehen, vergleichen, übernehmen → **Stil-Bibel v1**.
3. **Shot-Liste** — deterministisch aus den Daten abgeleitet, geordnet nach **echter Spiel-Abhängigkeit** (Lauf-Zyklus zuerst, dann Gebäude, Räume, Figuren). Jeder Shot hat einen vorgeschriebenen Prompt.
4. **Co-Design je Shot** — Prompt (Claude/Fallback) → generieren **mit Master-Referenzen** → **Claude bewertet** die Varianten gegen die Bibel & stellt Rückfragen → Pixel-Nachbearbeitung → **Freigabe in die Bibliothek** (optional „auch als Stil-Master"). Räume: **Hotspots** markieren.
5. **Sprite-Sheet & Export** — generiertes Sheet-Bild **slicen** (+ Animations-Vorschau) bzw. Frames **packen** → `type:"sheet"` mit Frame-Maßen/Animationen; **Export** als ZIP (`assets.json` + Dateien) für `desinformation-network/public/assets/`.

## Architektur (Dateien)
```
sprite-tool/src/
  lib/studio/
    db.ts            # zentrale IndexedDB (eine Version, Stores: library/bible/shots/kv)
    concept.ts       # lädt Spielkonzept-Snapshot (tolerant) — die Wissensquelle
    bible.ts         # Stil-Bibel: Typ, Default, buildAnchor(), CRUD, Snapshots
    shots.ts         # deriveShots() (aus Daten) + mergeShots() (Status/Asset behalten)
    pixel.ts         # Canvas: Downscale (Nearest), BG→Alpha, Paletten-Lock, Thumbs
    sheet.ts         # Canvas: sliceGrid()/sliceByFrameSize()/packFrames()
    director.ts      # Client-Wrapper /api/director + Fallback-Prompts + Master-Logik
    directorTypes.ts # geteilte Typen (Client+Server)
    directorServer.ts# Claude-Aufrufe (Stil/Prompt/Kritik/Chat), robustes JSON-Parsing
    generate.ts      # Client-Helfer für /api/generate
    StudioContext.tsx# zentraler Zustand (Konzept, Bibel, Shots, Keys)
  app/api/director/route.ts  # dispatch nach task
  components/director/        # BriefingPanel, StyleFinder, ShotList, ShotWorkspace, RegionEditor, BiblePanel, DirectorPanel
  components/SheetStudio.tsx  # M3
  components/FreeCreate.tsx   # klassischer Direkt-Flow (Power-User)
public/game/{building.json,npcs.json}  # Snapshot (Refresh: npm run sync:game)
```

## Modularität & Flexibilität (neue Büros/Etagen/Personen)
- Die **Shot-Liste ist eine reine Funktion** über die Konzept-Daten. Neue Etage/Raum/Person in `building.json`/`npcs.json` → nach `npm run sync:game` automatisch neue Shots, **ohne Code-Änderung**.
- `mergeShots()` bewahrt Status & gewähltes Asset bekannter Shots; eigene (custom) Shots bleiben erhalten.
- Die Stil-Bibel ist **Daten** (editierbar, versioniert); neue Palette/Richtung ohne Code.
- Asset-Rollen/Familien sind generisch; Provider sind hinter `providers.ts` gekapselt.

## Edge-Cases (bewusst behandelt)
- **Keine Keys:** UI weist hin; Routen liefern 401/`{ok:false}`; deterministische Fallback-Prompts greifen; Generieren/Slicen/Export funktionieren ohne Claude.
- **Claude-Antwort kein/kaputtes JSON:** robustes Parsing mit Fallback-Objekt (kein Crash).
- **Gemini liefert nichts/teilweise/Safety-Block:** pro-Variante-Fehler werden gesammelt & angezeigt.
- **Sheet nicht exakt teilbar:** ganzzahlige Frame-Größe + Rest-Warnung.
- **Konzept-Snapshot fehlt/teilweise:** toleranter Loader, `source:'partial'` + Hinweis, Fallback-Stil.
- **IndexedDB nicht verfügbar/Versionskonflikt:** EINE DB-Definition (db.ts); Bibel/Shots fallen auf Defaults zurück.
- **Große Kritik-Payloads:** Bilder werden client-seitig auf 384px verkleinert, max. 6 Stück.
- **SSR/Browser:** `window`/`indexedDB`/`fetch` nur clientseitig (Effekte), Lade-/Leerzustände abgefangen.

## Übereinstimmung mit dem Kanon
- **Liest** Spieldaten (Snapshot), **ändert** das Spiel nicht — Export ist bewusst entkoppelt (ZIP). „Daten = Wahrheit" bleibt gewahrt.
- Bedient **VISION_LOCK §5**: Raum-Hintergründe + Hotspots (Variante A) **und** den einen Lauf-Zyklus (Variante B). Die Stil-Findung respektiert, dass Brutalismus die aktuelle Entscheidung ist — sie ist ein **Werkzeug zum (Neu-)Entscheiden**, nicht zum stillen Überschreiben (Bibel ist versioniert).
- **Sicherheit:** `/api/director` nutzt denselben gehärteten Key-Pfad (Prod erzwingt UI-Key, kein Server-Fallback).

## Bewusst (noch) NICHT umgesetzt
- **Direkter Commit ins Spiel-Repo:** Export geht per **Ordner-Schreiber** (File System Access) oder ZIP; ein direkter GitHub-Commit braucht Token/Scope-Entscheidung (saubere Naht ist vorhanden).
- **Voll-Bibliotheks-Stil-Audit:** aktuell Kritik pro Asset; ein „über alles"-Abgleich kann folgen.
- **Freies Zuschneiden (Crop):** stattdessen Pixel-Downscale + Hotspot-Regionen (M4 teil-abgedeckt).

> ✅ **Sound/M5** umgesetzt — siehe [`ASSET_STUDIO_SOUND.md`](ASSET_STUDIO_SOUND.md). ✅ **Einfacher Export** via Ordner-Schreiber.
