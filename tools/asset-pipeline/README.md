# Asset-Pipeline (headless)

Erzeugt die Spiel-Assets **ohne Browser** — direkt nach
`desinformation-network/public/assets/` (`assets.json` + `images/ sheets/ sounds/`).
Schema, Namenskonventionen und Ordnerlayout sind **identisch mit dem Asset Studio**
(`sprite-tool`, siehe `docs/ASSET_STUDIO_SPEC.md`): Beide Werkzeuge pflegen dasselbe
Manifest und können sich abwechseln (Merge je `type/id`).

Gedacht für automatisierte Läufe durch einen Agenten (Claude Code) mit
**Vision-Qualitätskontrolle**: Der Agent generiert, *sieht* sich jedes PNG an,
vergleicht mit dem Style-Guide und regeneriert gezielt.

## Schnellstart

```bash
cd tools/asset-pipeline
npm install
npm test               # 20 Unit-Tests (Shot-Liste, Manifest, Budget, Platzhalter)

npm run shotlist       # Soll-Liste (117 Assets, aus building.json/npcs.json abgeleitet)
npm run placeholders   # Platzhalter-PNGs erzeugen (KEINE API-Keys nötig)
npm run status         # Abdeckung: was fehlt noch (Muss/Kür)?
npm run validate       # assets.json + Dateien prüfen
```

## Echte Generierung (Phase 1+)

**Standard ist Dry-Run.** Echte API-Aufrufe nur mit `--live`:

```bash
# Bilder (Gemini "Nano Banana Pro", wie im sprite-tool):
node src/cli.mjs generate --images --priority must --limit 5 --live

# Audio (ElevenLabs — SFX/Musik/Stimmen):
node src/cli.mjs generate --audio --kind sfx --limit 5 --live
node src/cli.mjs voices --live           # Stimmen wählen → config/voices.json
node src/cli.mjs generate --audio --kind voice --only voice_direktor_intro --live
```

### Voraussetzungen (Claude-Code-Umgebung)

| Was | Wert |
|---|---|
| Env-Variable | `GOOGLE_AI_API_KEY` (Bilder) |
| Env-Variable | `ELEVENLABS_API_KEY` (Audio) |
| Netz-Allowlist | `generativelanguage.googleapis.com`, `api.elevenlabs.io` |

Optional: `GEMINI_IMAGE_MODEL` (Default `gemini-3-pro-image`),
`ELEVENLABS_TTS_MODEL`, `PIPELINE_OUT_DIR`.

### Sicherheits-/Kosten-Modell

- **Dry-Run als Default** — ohne `--live` wird nur der Plan gedruckt.
- **Harte Budgets pro Lauf** (Abbruch VOR Überschreitung):
  `PIPELINE_MAX_IMAGES` (12), `PIPELINE_MAX_AUDIO` (20),
  `PIPELINE_MAX_TTS_CHARS` (2500), `PIPELINE_MAX_MUSIC` (1).
- **Idempotent:** vorhandene Dateien werden übersprungen (außer `--force`);
  Seeds sind deterministisch je Shot-id → reproduzierbare Ergebnisse.
- **Inkrementelles Manifest:** jedes fertige Asset wird sofort gemerged —
  ein Abbruch verliert nichts.
- **Laufprotokoll:** JSONL je Lauf unter `runs/` (gitignored).
- Keys kommen NUR aus der Umgebung, landen nie im Repo; die Netz-Allowlist
  der Umgebung verhindert technisch jeden Aufruf an andere Hosts.

## Was die Shot-Liste enthält (117)

| Kategorie | ids | Anzahl | Priorität |
|---|---|---|---|
| Räume (groß, 1344×768) | `room_<roomId>` | 5 | Muss |
| Porträts (mittel, 1:1) | `portrait_<npcId>` | 5 | Muss |
| Porträt-Stimmungen | `portrait_<npcId>_<mood>` | 20 | Kür |
| Spielfigur | `player_walk` (8×32px), `player_idle` (4×32px) | 2 | Muss |
| NPC-Figuren (klein) | `figure_<npcId>` (4×32px idle) | 5 | Kür |
| Props (klein) | `prop_<name>` | 8 | Kür |
| SFX | `sfx_<name>` (alle SoundTypes des Spiels, snake_case) | 17 | 8 Muss |
| Musik | `music_theme_main`, `music_tense`, … | 4 | 1 Muss |
| Stimmen | `voice_<npcId>_<lineKey>` | 51 | 1 Muss (Intro) |

Quellen: `building.json` + `npcs.json` (neue Räume/NPCs erscheinen automatisch),
Stil-Kern aus `sprite-tool/public/context/game-style-guide.md`.

## Wie das Spiel lädt

`src/story-mode/assets/` (AssetRegistry + `useAssets`/`useSprite`):

- `BuildingView` → Raum-Hintergründe (`room_<id>`), NPC-Figuren (`figure_<id>`)
- `DialogBox` → Porträts (`portrait_<id>[_<mood>]`), Sprachzeilen (`voiceAssetId`)
- `SoundSystem` → `sfx_<type>` statt Synth, `music_<name>` als Loop

**Ohne Manifest läuft alles im bisherigen CSS-/Synth-Fallback weiter.**

## Phasen bis zum finalen Look

1. **Phase 0 (erledigt):** Loader + Verdrahtung im Spiel, diese Pipeline, Platzhalter.
2. **Phase 1 — Stil-Lock:** 2–3 Kandidaten für EINEN Raum generieren, Mensch wählt;
   Gewinner-Seed/Referenz wird Master für alle weiteren Läufe.
3. **Phase 2 — Grafik-Batch:** Räume → Porträts → Figuren/Props, je Lauf mit
   Vision-Review; Sheets bei Bedarf aus Einzelposen montieren.
4. **Phase 3 — Audio:** SFX/Musik; Stimmen-Casting (`config/voices.json`), Intro-Zeile
   zuerst (ist bereits im Spiel verdrahtet). Für weitere Dialog-Vertonung muss der
   DialogLoader den gewählten Zeilen-Key zurückgeben (kleine Engine-Erweiterung).
5. **Phase 4 — Abnahme:** `validate` + Spiel-Build + Deploy-Preview.
