# Spiel-Assets (datengetrieben)

Dieser Ordner wird von Werkzeugen befüllt — **nicht von Hand pflegen**:

- **Asset Studio** (`sprite-tool/`): kuratierter Export (ZIP/Ordner)
- **Asset-Pipeline** (`tools/asset-pipeline/`): headless/automatisiert

`assets.json` ist das Manifest (Schema: `docs/ASSET_STUDIO_SPEC.md`); das Spiel
lädt es über `src/story-mode/assets/`. Fehlt das Manifest, läuft das Spiel im
CSS-/Synth-Fallback. Einträge mit `"provider": "placeholder"` sind beschriftete
Platzhalter aus `npm run placeholders` und werden von echten Läufen überschrieben.
