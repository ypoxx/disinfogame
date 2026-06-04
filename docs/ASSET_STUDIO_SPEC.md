# 🏗️ Asset Studio — Bau-Spezifikation

> **Status:** Aktiv (Bauplan) · **2026-05-31** · **Scope:** Tooling (Track A‑2) · Basis: **`sprite-tool/`** (ausbauen)
> Konzept/Entscheidungen: [`ASSET_BACKEND.md`](ASSET_BACKEND.md). Diese Datei sagt, **wie** man es baut.

## Zweck (1 Satz)
Ein **eigenständiges, internes** Werkzeug (nicht Teil des Spiels), um **alle Assets** (Bild + Sound) per API zu
erzeugen, zu kuratieren, zu editieren und als spielfertige Dateien + Manifest ins Spiel zu exportieren.

## Tech-Stack
- **Next.js + React + TypeScript + Tailwind** (das `sprite-tool/` ist genau das — erweitern, nicht neu bauen).
- Läuft lokal (`npm run dev`). **Keys** in der UI eingebbar **und** aus `.env.local` (nie committen).

## Provider (entschieden)
- **Bild:** Google **`gemini-3-pro-image`** (Gemini API). *(sprite-tool aktuell `gemini-2.0-flash-exp` → heben.)*
- **Audio:** **ElevenLabs** — TTS `eleven_v3`/`eleven_flash_v2_5` · SFX `POST /v1/sound-generation` · Musik `POST /v1/music/compose`.
- **Prompt-Hilfe (optional):** Claude (bereits im Tool).

## UX / Screens (gut-genug, klar)
1. **Einstellungen:** API-Keys (Google, ElevenLabs, optional Claude), Test-Knopf „verbindet?".
2. **Tabs: 🖼️ Grafik | 🔊 Sound | 📚 Bibliothek.**
3. **Grafik:** Prompt-Feld → Style-Anchor (`game-style-guide.md`) **automatisch** vorangestellt → optional **Master-Referenzbild** + **Seed** → *Erzeugen (N Varianten)* → Varianten-Galerie → Auswahl → **Editor** (Inpainting [da] · **Zuschneiden** · **Bereiche markieren** = Hotspot-Rechtecke) → **Sprite-Sheet-Assembler** (mehrere Frames → Raster) → „**fürs Spiel auswählen**".
4. **Sound:** Typ wählen (Sprache/SFX/Musik) → Prompt bzw. Composition-Plan → *Erzeugen* → **Audition-Liste** (Player) → **Editor** (Trimmen · Loop-Punkte · Normalisieren) → „**fürs Spiel auswählen**".
5. **Bibliothek:** alle erzeugten Assets mit Metadaten, Filter, `chosen`-Flag, **„Export ins Spiel"**.

## Haltbarkeit (Sicherung/Wiederherstellung) ✅
**Quelle der Wahrheit = Git/Dateien; IndexedDB ist nur ein Cache.** Damit nach Stunden Arbeit nichts im Browser
gefangen ist:
- **Sicherung (⬇)**: verlustfreies `asset-studio-backup-*.json` über *alle* Stores (Assets inkl. Roh-Daten, Stil-Bibel,
  Shots, kv) — funktioniert in jedem Browser, ins Repo committbar.
- **Wiederherstellen (↩)**: Backup-Datei zurückspielen (zusammenführend) — auch in eine leere Bibliothek.
- **`navigator.storage.persist()`** beim Start + Status-Anzeige (🔒 dauerhaft / ⚠ nicht), damit der Browser die DB
  nicht unter Speicherdruck wegräumt.
- Logik liegt in `lib/studio/backup.ts` (bewusst DOM-frei, testbar). *Offen:* Ordner-Handle merken + Auto-Export;
  optional später Netlify Blobs für Geräte-Sync.

## Datenformate
- **Manifest `assets.json`** (eine Datei, datengetrieben vom Spiel geladen):
  ```jsonc
  { "assets": [
    { "id": "room_medien_bg", "type": "image", "file": "images/room_medien_bg.png",
      "provider": "gemini-3-pro-image", "prompt": "...", "seed": 12345, "styleVersion": "v1",
      "chosen": true, "regions": [ { "id":"tv", "x":40,"y":60,"w":120,"h":80 } ] },
    { "id": "player_walk", "type": "sheet", "file": "sheets/player_walk.png", "chosen": true,
      "frameWidth":32, "frameHeight":32,
      "animations": { "walkRight": { "row":0, "frames":8, "frameTime":90, "loop":true } } },
    { "id": "door_open", "type": "sfx", "file": "sounds/door_open.mp3", "provider": "elevenlabs", "chosen": true },
    { "id": "theme_main", "type": "music", "file": "sounds/theme_main.mp3", "provider": "elevenlabs", "chosen": true }
  ] }
  ```
  `type`: `image | sheet | sfx | voice | music`.

## Export ins Spiel
- Schreibt die **gewählten** Dateien + `assets.json` nach **`../desinformation-network/public/assets/`** (`images/`, `sheets/`, `sounds/`).
- Das Spiel lädt daraus **datengetrieben** (Räume/Hotspots ↔ `building.json`; Sprite-Sheets ↔ `useSprite`; Sounds ↔ `SoundSystem`).

## Konsistenz-Regeln (Pflicht)
Style-Anchor **immer** voranstellen · **Master-Referenz + fester Seed** je Asset-Familie · für Figuren **Turnaround-Sheet zuerst**, dann Frames · Abweichungen per Inpainting fixen.

## Bau-Reihenfolge (Milestones, je grün lassen)
> Umsetzungsstand 2026-06-03 — Details & Regie-Modus: [`ASSET_STUDIO_DIRECTOR.md`](ASSET_STUDIO_DIRECTOR.md).
- **M1** ✅ Keys-UI + Provider-Lib; `gemini-3-pro-image`; Bild erzeugen läuft.
- **M2** ✅ Bibliothek + Auswahl + `assets.json` + Export (als **ZIP**; direkter Repo-Commit bewusst offen).
- **M3** ✅ **Sprite-Sheet-Studio** (Sheet slicen + Frames packen → Raster + Animations-JSON).
- **M4** ◑ **Bereiche markieren** (Hotspots) ✅ + Inpainting ✅ + Pixel-Nachbearbeitung ✅; freies **Zuschneiden** offen.
- **M5** ✅ **Sound** (ElevenLabs): SFX + Musik + NPC-Stimmen (Casting + TTS), Audition/Auswahl. Details: [`ASSET_STUDIO_SOUND.md`](ASSET_STUDIO_SOUND.md).
- **Export** ✅ einfacher: **direkt in den Spielordner** (File System Access) oder ZIP. Direkter GitHub-Commit weiter offen.
- **NEU** ✅ **Regie-Modus**: Stil-Findung, Stil-Bibel + Master-Referenzen, abgeleitete Shot-Liste, Varianten-Kritik (Claude sieht die Bilder), Regie-Chat.

## Qualität
TypeScript strict · Lint · Keys nur in `.env.local` (Beispiel: `.env.example`) · keine Secrets im Repo.
