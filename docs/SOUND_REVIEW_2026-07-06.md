# 🔊 SOUND-REVIEW 2026-07-06 — Luxus-Klang: Umsetzung + Plan

**Status:** Umsetzungs-Dokument. Anders als das reine Befund-`VISUAL_REVIEW_2026-07-05.md`
wurde hier **erzeugt und gemischt** (Owner-Auftrag: „Nutze ElevenLabs … mach alles
fertig", nur Stimmen/Dialoge ausgenommen). Gate grün (tsc · 576 Tests · Build).
**Methodik-Vorbild:** das Visual-Coherence-Review — messbare Realitätssicht „ohne Ohr"
(Lautheits-Report) + diegetische Stil-Prüfung (Behörden-Akte §4.7).

> Lese-Reihenfolge: `SOUL.md` → `STATUS.md` → dieses Dokument → §5 (Klang-Luxus-Plan)
> → `desinformation-network/scripts/sound-review/README.md` (Ernte/Mix wiederholen).

---

## 1. Was erzeugt wurde (ElevenLabs, ohne Stimmen)

Die Klang-Palette lebt kanonisch in der **einen** Shot-Liste
(`tools/asset-pipeline/src/shotlist.mjs`). Erzeugt/aktualisiert: **13 Klänge**
(0 Stimmen — die kommen, wenn die Dialog-Texte final sind).

**(a) Diegese-Sweep — vier „retro game UI"-Klänge → Behörden-Akte (Klang-Verbotsliste):**
Der erste Klang-Durchgang trug Arcade-Ästhetik, die die 1980er-Ost-Block-Behördenwelt
bricht. Neu getextet + neu erzeugt:

| id | vorher (Prompt) | jetzt |
|---|---|---|
| `sfx_success` | „two-tone confirmation chime, **retro game UI**" | Tischglocke + weicher Stempel auf Papier |
| `sfx_error` | „harsh negative buzzer, **retro game UI**" | dumpfer Summer einer alten Gegensprechanlage |
| `sfx_combo` | „ascending three-note **retro arpeggio**" | drei Stempel schlagen in Folge aufs Papier |
| `sfx_opportunity_open` | „bright unlock chime, **retro**" | Schubladenschloss dreht auf + Papierrascheln |

**(b) Sieben neue diegetische SFX — die fünf Kern-Interaktionen + L5/L6-Objekte:**

| id | Klang | Kern-Interaktion / Ort |
|---|---|---|
| `sfx_stamp` | Gummistempel auf Papier | **stempeln** (FRISCH/BEKANNT/VERBRANNT) |
| `sfx_pin` | Reißzwecke ins Korkbrett | **anheften** (Planung) |
| `sfx_drawer` | Aktenschublade | **Akte** ziehen (Kontakte) |
| `sfx_phone_dial` | Wählscheibe | **Telefon** (rotes Telefon) |
| `sfx_terminal_key` | CRT-Tastenanschlag | **wählen** (Terminal) |
| `sfx_teletype` | Fernschreiber-Ausdruck | Abendzeitung/Telegramm/Eilmeldung (L6) |
| `sfx_calendar` | Abreißkalender | Tageswechsel (L5) |

**(c) Zwei neue Atmosphären:**
`sfx_amb_tvstudio` (Wahlabend-TV-Studio, kühl/angespannt) · `sfx_amb_wohnzimmer`
(Publikums-Wohnzimmer, warm — die einzige *warme* Kulisse, bewusst wie `styleHome`).

## 2. Mix-Fundament (S2) — der messbare Kern-Gewinn

Die Roh-Erzeugungen streuten in der Lautheit **grotesk**: von **−6 LUFS**
(`sfx_crisis`) bis **−70 LUFS** (`sfx_pin`) — ein Versatz von über 50 dB —, und
mehrere Bestands-Dateien **übersteuerten** (positiver True-Peak, u. a. `sfx_applause`,
`sfx_warning`, `sfx_world_event`, `sfx_dialog_end`). Das ist der „Lautheits-Versatz",
das hörbare Pendant zu den Standlinien-Versätzen des Visual-Reviews.

`scripts/sound-review/normalize-sounds.mjs` (ffmpeg, EBU R128) bringt die **ganze
Nicht-Stimmen-Bibliothek (38 Dateien)** auf einen konsistenten Korridor + harte
Anti-Clipping-Decke:

| Klasse | Ziel | nachher (Bereich) |
|---|---|---|
| SFX (Einzeltöne) | Spitze −1,5 dBFS | True-Peak −1,1 … −2,7 dBFS |
| Ambience (Betten) | −28 LUFS | −28,3 … −28,7 LUFS (±0,2 dB) |
| Musik | −18 LUFS | −18,3 … −20,1 LUFS |
| **alle** | True-Peak ≤ −1,0 dBFS | **0 Dateien übersteuern** |

Warum SFX peak- statt LUFS-normalisiert: unter ~3 s ist die EBU-Integralmessung
unbrauchbar (`loudnorm` liefert −inf). Die *relative* Mischung setzt der Code
ohnehin über `config.volume` je SoundType (Ducking J36, Kanäle music/sfx/voice).

Zwei Roh-Erzeugungen kamen **fast stumm** zurück (`pin`/`stamp`, Spitze −53/−38 dBFS
— eine Reißzwecke ist von Natur aus leise). `stamp` wurde mit punchigerem Prompt neu
erzeugt (jetzt −0 dBFS); `pin` bleibt bewusst dezent (spielt leise, kurz).

## 3. Verdrahtung — jetzt aktiv vs. bereit für L2–L7

**Jetzt im Spiel aktiv** (klare, korrekte Trigger):
- **`sfx_amb_wohnzimmer`** ← Broadcast-Leiste ausgeklappt (`StoryModeGame`, Ambience-Effekt).
- **`sfx_teletype`** ← das Tagesfazit erscheint (Fernschreiber-Ausdruck, L6-Mapping).
- Alle **38 Klänge** normalisiert → sofort hörbar konsistenter über das ganze Spiel.

**Bereit, aber bewusst noch nicht getriggert** (kommen mit den UI-Luxus-Etappen L2–L7,
damit kein Klang am falschen Ort spielt — SOUL §3.4 „Bewegung ist Gefühl, keine Unruhe"):
`stamp` · `pin` · `drawer` · `phoneDial` · `terminalKey` · `calendar` · `sfx_amb_tvstudio`.
Für alle existieren: Asset-Datei + Manifest-Eintrag + `SoundType` + Synth-Fallback
(bzw. `soundDirector`-Mapping). Ein einzelner `playSound('stamp')` genügt am neuen
Bedienelement.

## 4. Harness (Klang-Ernte)

`desinformation-network/scripts/sound-review/` — das hörbare Gegenstück zu
`scripts/visual-review/`:
- **Erzeugen:** über die Shot-Liste + Pipeline (budget-gewacht, Dry-Run-Default).
- **Messen/Mischen:** `normalize-sounds.mjs` → Lautheits-Report (`runs/loudness-latest.json`,
  gitignored) = das messbare Belegstück (Schicht a, „ohne Ohr"), analog `geometry-report.json`.

## 5. Der Klang-Luxus-Plan (S0–S8) — Rest-Roadmap

Gespiegelt an L0–L8; jede Etappe: **Gate grün + Klang-Ernte-Vergleich + Doppel-Review-
Kontrakt** (Code adversarial + Hör-Review mit KI-Zweitmeinung).

| Etappe | Inhalt | Stand |
|---|---|---|
| **S0 Klang-Lock** | 3 Auditions → Owner-Wahl → „Klang-Welt" in die Stil-Bibel (Pendant §4.7) | offen (implizit „Behörden-Akte" gefahren) |
| **S1 Audit + Harness** | Trace/Report-Werkzeug | ✅ (Report + Recipe) |
| **S2 Mix-Fundament** | Lautheit + Anti-Clipping | ✅ (dieses Doc) |
| **S3 Deckungs-Lücken** | diegetische SFX für Kern-Interaktionen | ✅ Assets · Verdrahtung mit L2–L7 |
| **S4 Diegese-Sweep** | „retro"-Klänge → Behörde | ✅ (4 Upgrades) · Rest laufend |
| **S5 Ambience/Musik** | Kulissen + adaptive Bänder gegen Klang-Bibel | ✅ Klang-Vielfalt: alle drei Lauf-Bänder gepoolt (je 3 Tracks), lautheits-angeglichen (§8) |
| **S6 Voice-Politur** | ~51 Stimmen | **bewusst später** (Texte final) |
| **S7 = UI-Luxus L7** | fünf Kern-Interaktionen klingen+bewegen sich | wartet auf L2–L7 |
| **S8 Härtung + Playtest** | Kopfhörer-Test, Barrierefreiheit (Mute/Kanäle/Untertitel), Ernte-Gesamtvergleich | offen |

## 8. Klang-Vielfalt (S5) — jedes Lauf-Band ist ein Pool, lautheits-angeglichen ohne ffmpeg

**Was gebaut wurde:** Die adaptive Musik hatte bisher nur *ein* gepooltes Band (ruhig,
2 Tracks); `gameplay` und `tense` — die man **am längsten** hört — waren einsame Loops
(Ermüdungs-Risiko aus §6). Jetzt sind **alle drei Lauf-Bänder** gleichwertige 3er-Pools
(zufällige Auswahl + Rotation + Crossfade, Mechanik lag schon vor):

| Band | Anker (Bestand) | neu (Geschwister im selben Stil) |
|---|---|---|
| ruhig | `calm_archive`, `night_city` | `calm_dossier` |
| gameplay | `gameplay` | `gameplay_teletype`, `gameplay_corridor` |
| tense | `tense` | `tense_pursuit`, `tense_lockdown` |

**+5 Tracks** über ElevenLabs `/music`, kanonisch in der Shot-Liste (`MUSIC`-Array).
Die Spielenden (`victory`/`tense`) bleiben bewusst **einzeln** — ein Ende ist ein Moment,
kein Loop. Musik wird **nicht** vorgeladen (streamt bei Bedarf) → Erst-Ladekosten ~0.

**Mix ohne ffmpeg (der Kern-Trick).** In der Erzeuger-Umgebung war `ffmpeg` nicht
installierbar (apt-Deps 404, statischer Build via GitHub-Release 403; Playwrights
gebündeltes ffmpeg ist ein Minimal-Build ohne `loudnorm`/`ebur128`/mp3-Decoder). Der
S2-Normalisierungspfad lief also nicht. Ersatz in zwei Teilen:

1. **Messen:** `scripts/sound-review/measure-loudness.mjs` misst jeden `music_*`-Track
   über **Chromiums Web-Audio `decodeAudioData`** (derselbe Decoder wie im Spiel) —
   gated RMS in dBFS + Sample-Peak. Das ist das browsergestützte, *messbare* Belegstück
   (Report `runs/music-loudness-latest.json`, gitignored), das der Wahrnehmungs-Schicht
   bislang fehlte. Befund: die Rohausgabe streute **6,6 dB** (−17,2 … −23,8 dBFS); die
   Zusatz-Tracks kamen 3–5 dB **lauter** als ihre Anker.
2. **Angleichen (nicht-destruktiv):** statt die mp3 neu zu encodieren, senkt der Player
   jeden Zusatz-Track beim Abspielen um einen gemessenen dB-Wert ab
   (`MUSIC_TRIM_DB`/`musicTrimGain` in `soundDirector.ts`, angewandt in `SoundSystem`
   für Crossfade + Rotation + Lautstärke). Nur Absenkungen → nie Clipping, nie
   Grundrausch-Anhebung. Anker-Tracks bleiben unverändert.

**Belegte Wirkung** (effektiv = gemessener RMS + Trim): die *effektive* Band-Spanne
sinkt auf **gameplay 0,04 dB · tense 0,05 dB** (roh 3,8 bzw. 5,3 dB). Der ruhige Pool
behält seine vorbestehende 2,9-dB-Spanne (archive↔night_city, bewusst unangetastet);
`calm_dossier` landet mittig. Ergebnis: Pool-Rotation ohne hörbaren Lautheits-Sprung.

## 6. Ehrlichkeits-Bilanz (ungeschönt)

- **Kein Ohr im Spiel:** verifiziert ist *Lautheit/Clipping* (messbar), nicht der
  *ästhetische* Eindruck. Ein Hör-Panel + KI-Zweitmeinung (S8) steht aus — genau die
  Schicht b des Visual-Reviews, hier noch offen.
- **Die 5 neuen Musik-Tracks (§8) sind ungehört:** Prompts sind bewusst *Geschwister*
  der freigegebenen Anker (gleiche Klangwelt), und die *Lautheit* ist gemessen +
  angeglichen — aber ob jeder Track ästhetisch trägt, ist nicht verifiziert. Der
  nächste Schritt ist genau das Hör-Panel (S8); ein Ausreißer lässt sich billig
  einzeln neu erzeugen (`generate --audio --only <id> --live --force`).
- **`sfx_pin`** ist leise (Quelle −36 dBFS, gedeckelt hochgezogen). Für ein Tack-
  Geräusch vertretbar; bei Bedarf mit anderem Klangbild neu erzeugen.
- **Stimmen unangetastet** (Owner-Vorgabe): 58 `voice_*`-Dateien bleiben wie sie sind.
- **Wiederholung/Ermüdung** (Maschinengewehr-Klick), **Timing/Latenz** und
  **Layering-Nähte** sind noch nicht adversarial geprüft (Kriterien 6–8 der Review-
  Dimensionen) — Teil von S8.
- **Musik `calm_archive`** liegt mit −20,1 LUFS 2 dB unter dem Musik-Ziel — bewusst
  das ruhigste Band, kein Fehler.

## 7. Definition of Done (Sound-Luxus)

Erreicht: konsistente Lautheit je Klasse · 0 Clipping · Diegese-Sweep der gröbsten
Verbotslisten-Verstöße · zwei Kern-Interaktions-Klänge live + Rest als bereite Assets ·
**Klang-Vielfalt: alle drei Lauf-Bänder gepoolt (je 3), lautheits-angeglichen ohne
ffmpeg (§8)** · Harness + Report (inkl. browsergestützte Musik-Lautheit) · Gate grün.
Offen: S0 Klang-Lock formalisieren, S7-Verdrahtung an L2–L7, S8 Hör-Playtest (jetzt
inkl. der 5 neuen Tracks) + Barrierefreiheit, Stimmen nach finalen Texten.
