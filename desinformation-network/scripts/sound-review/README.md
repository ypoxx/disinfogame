# 🔊 Sound-Review — Harness (Klang-Ernte + Mix-Fundament)

Das hörbare Pendant zum `scripts/visual-review/`-Harness. Zwei Werkzeuge:
**Erzeugen** (ElevenLabs, über die Asset-Pipeline) und **Messen/Mischen** (ffmpeg).

> Voraussetzung fürs Messen/Mischen: `ffmpeg` + `ffprobe` im PATH.
> Voraussetzung fürs Erzeugen: `ELEVENLABS_API_KEY` (Env) + `npm install` in
> `tools/asset-pipeline/` (Netz-Allowlist `api.elevenlabs.io`).

## 1. Erzeugen (SFX · Ambience · Musik) — kanonisch in der Shot-Liste

Die Klang-Palette ist Teil der **einen** Shot-Liste
(`tools/asset-pipeline/src/shotlist.mjs`, Arrays `SFX` und `MUSIC`). Eine neue oder
geänderte Zeile dort ist die Quelle der Wahrheit; erzeugt wird budget-gewacht über
die Pipeline (Dry-Run ist Default):

```bash
cd tools/asset-pipeline
# Dry-Run (zeigt nur, was erzeugt würde):
node src/cli.mjs generate --audio --only sfx_stamp,sfx_pin
# Echt (schreibt mp3 + aktualisiert public/assets/assets.json):
node src/cli.mjs generate --audio --only sfx_stamp,sfx_pin --force --live
```

Format: `sfx_<snake>` → `SoundSystem.play('<camel>')`; `sfx_amb_<ort>` → Ambience
über `soundDirector`; `music_<name>` → adaptive Musik-Bänder. Stimmen (`voice_*`)
werden hier bewusst **nicht** angefasst (kommen, wenn die Dialog-Texte final sind).

## 2. Messen + Mischen (S2-Mix-Fundament) — `normalize-sounds.mjs`

Bringt die **ganze Nicht-Stimmen-Bibliothek** auf einen konsistenten Lautheits-
Korridor (EBU R128) und deckelt den True-Peak hart (kein Clipping). Behebt den
„Lautheits-Versatz" der Roh-Erzeugungen (die um > 50 dB streuen).

```bash
cd desinformation-network
node scripts/sound-review/normalize-sounds.mjs --dry     # nur messen + Report
node scripts/sound-review/normalize-sounds.mjs           # in-place normalisieren
node scripts/sound-review/normalize-sounds.mjs --only sfx_stamp
```

**Recipe je Klasse:**

| Klasse | Trim | Ziel | Methode |
|---|---|---|---|
| SFX (`sfx_*`, kein `amb`) | ja (Ränder < −45 dB) | Spitze −1,5 dBFS | Peak-Normalisierung (robust für kurze Einzeltöne, wo EBU-Integral versagt) |
| Ambience (`sfx_amb_*`) | nein (durchgehend) | −28 LUFS | Zwei-Pass-`loudnorm` |
| Musik (`music_*`) | nein | −18 LUFS | Zwei-Pass-`loudnorm` |

Zusätzlich läuft über **jede** Datei eine harte True-Peak-Decke (−1,0 dBFS), die
Inter-Sample-Übersteuerung nach dem mp3-Re-Encode abfängt.

Ausgabe: eine Tabelle (vorher → nachher) plus ein Report unter `runs/`
(`loudness-latest.json`, gitignored). Ausreißer werden markiert (`⚠` Lautheit,
`🔇` zu leise → neu erzeugen).

## 2b. Musik-Lautheit ohne ffmpeg — `measure-loudness.mjs`

Wenn `ffmpeg` fehlt (Erzeuger-Container ohne Installations-Recht; Playwrights
gebündeltes ffmpeg hat weder `loudnorm` noch mp3-Decoder), misst dieses Werkzeug
die Musik-Lautheit über **Chromiums Web-Audio `decodeAudioData`** — denselben
Decoder, mit dem das Spiel abspielt:

```bash
cd desinformation-network
node scripts/sound-review/measure-loudness.mjs            # alle music_*
node scripts/sound-review/measure-loudness.mjs --only music_gameplay,music_tense
```

Kennzahl: gated RMS in dBFS (relativer Lautheits-Proxy für Musikbetten) + Sample-Peak.
Report → `runs/music-loudness-latest.json` (gitignored). Angeglichen wird **nicht**
destruktiv, sondern über den Per-Track-Trim `MUSIC_TRIM_DB` in
`src/story-mode/utils/soundDirector.ts` (der Player senkt lautere Tracks beim Abspielen
auf ihren Band-Anker ab). Details: `docs/SOUND_REVIEW_2026-07-06.md` §8.

## 3. Warum kein „Screenshot"?

Klang lässt sich nicht knipsen. Der Report (`runs/loudness-latest.json`) ist das
messbare Belegstück — das hörbare Gegenstück zur `geometry-report.json` des
Visual-Reviews (Schicht a, „ohne Ohr/KI"). Die Wahrnehmungs-Schicht (Hör-Panel +
KI-Zweitmeinung) ist die nächste Ausbaustufe (siehe `docs/SOUND_REVIEW_2026-07-06.md`).
