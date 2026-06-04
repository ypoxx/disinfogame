# 🔊 Asset Studio — Sound (M5, ElevenLabs)

> **Status:** Aktiv (umgesetzt) · **Aktualisiert:** 2026-06-04 · **Scope:** Tooling (Track A-2) · Basis: `sprite-tool/`
> **Verwandt:** [`ASSET_STUDIO_SPEC.md`](ASSET_STUDIO_SPEC.md) · [`ASSET_BACKEND.md`](ASSET_BACKEND.md) · [`ASSET_STUDIO_DIRECTOR.md`](ASSET_STUDIO_DIRECTOR.md)

## Zweck
Effekte, Musik und **stabile NPC-Stimmen** über ElevenLabs erzeugen, anhören, auswählen und als Audio-Assets
ins Spiel exportieren — gleicher Kurations-Ablauf wie bei Bildern. **Bearbeitung bewusst schlank** (nur
Audition + Auswahl; kein Trim/Loop in v1).

## Entscheidungen (mit Alex)
- **Umfang:** SFX **und** Musik **und** NPC-Stimmen.
- **Stimmen:** *einmalig erzeugte*, **feste/stabile** TTS pro NPC (kein Livestream). Pro NPC eine gecastete
  `voice_id` (manuell **oder per Claude-Vorschlag**), beliebig erweiterbar für weitere Sprechsituationen.
- **Bearbeitung:** nur Anhören & Auswählen (schlank). Rohaudio (mp3) wird unverändert übernommen.

## API (verifiziert, 2026)
Auth: Header `xi-api-key` (Nutzer-Key aus der UI). Antworten sind **Binär-Audio (mp3)**.
- **SFX:** `POST /v1/sound-generation` — `{ text, duration_seconds?(0.5–30), prompt_influence?(0–1) }`, `?output_format=`.
- **Musik:** `POST /v1/music` (Music v2) — `{ prompt, music_length_ms?(3000–300000) }`.
- **TTS:** `POST /v1/text-to-speech/{voice_id}` — `{ text, model_id }` (+ `voice_settings?`).
- **Stimmen:** `GET /v1/voices` → `{ voices: [{ voice_id, name, … }] }` (auch Auth-Check).
- Endpunkt/Modell/Format via ENV überschreibbar (`ELEVENLABS_API_BASE`, `ELEVENLABS_TTS_MODEL` [Default `eleven_multilingual_v2`], `ELEVENLABS_AUDIO_FORMAT`).

## Architektur
```
lib/studio/elevenlabs.ts  # Server: generateSfx/composeMusic/synthesizeSpeech/listVoices/testConnection
lib/studio/sound.ts       # Client-Wrapper für /api/sound
lib/studio/casting.ts     # feste voice_id je NPC (kv-Store)
lib/studio/concept.ts     # npcLines(): sprechbare Zeilen aus npcs.json (greetings/reactions/topics)
app/api/sound/route.ts    # dispatch: sfx | music | tts | voices
components/SoundStudio.tsx # Tab: SFX · Musik · Stimmen
components/VoiceStudio.tsx # Casting (manuell/Claude) + Zeilen-Batch-TTS
```
Manifest-Typen `sfx | voice | music` existieren bereits; Export (Ordner/ZIP) schreibt nach `public/assets/sounds/`.
Sicherheit: `/api/sound` nutzt den Nutzer-Key aus dem Header; **kein Server-Fallback** → offenes `/api` ohne Key wirkungslos.

## NPC-Stimmen-Konzept (bewahrt & skalierbar)
- **Casting** je NPC persistiert (kv: `voiceCasting`). „🎙️ Stimme vorschlagen" lässt **Claude** anhand der
  `personality` (traits) die beste Stimme aus `/v1/voices` wählen — Regie auch fürs Audio.
- **Zeilen:** aus `npcs.json` (Begrüßungen 0–3, Reaktionen, Topics) auswählbar + **freie Zeile** für neue
  Sprechsituationen. Asset-id-Schema `voice_<npc>_<lineKey>`. Batch erzeugt **sequenziell** (Rate-Limit-schonend).
- Stabilität = feste `voice_id` + festes Modell; gleiche Eingabe → gleiches Ergebnis.

## Edge-Cases
- **Kein Key:** UI-Hinweis; Route 401; nichts crasht.
- **Rate-Limit/Guthaben (429), 401, 422:** klare, übersetzte Fehlermeldungen aus der ElevenLabs-Antwort.
- **Leeres Audio:** Fehler statt stiller Erfolg.
- **Kosten:** Audio ist teurer; Batch ist sequenziell und nur auf Auswahl; Musik-Hinweis auf Bezahltarif-Lizenz.
- **Große Dateien:** Audio liegt als base64 in IndexedDB (dafür ausgelegt).

## Bewusst offen (spätere Ausbaustufen)
- Trim/Normalize/Loop-Punkte (nur falls nötig — würde Web-Audio-Bearbeitung/WAV-Encoding bringen).
- Composition-Plan-Musik (sektionsweise) statt einfachem Prompt.
- Voice-Settings-Feintuning (stability/style) im UI.
