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
| **S5 Ambience/Musik** | Kulissen + adaptive Bänder gegen Klang-Bibel | teils (2 neue Atmos) |
| **S6 Voice-Politur** | ~51 Stimmen | **bewusst später** (Texte final) |
| **S7 = UI-Luxus L7** | fünf Kern-Interaktionen klingen+bewegen sich | wartet auf L2–L7 |
| **S8 Härtung + Playtest** | Kopfhörer-Test, Barrierefreiheit (Mute/Kanäle/Untertitel), Ernte-Gesamtvergleich | offen |

## 6. Ehrlichkeits-Bilanz (ungeschönt)

- **Kein Ohr im Spiel:** verifiziert ist *Lautheit/Clipping* (messbar), nicht der
  *ästhetische* Eindruck. Ein Hör-Panel + KI-Zweitmeinung (S8) steht aus — genau die
  Schicht b des Visual-Reviews, hier noch offen.
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
Harness + Report · Gate grün. Offen: S0 Klang-Lock formalisieren, S7-Verdrahtung an
L2–L7, S8 Hör-Playtest + Barrierefreiheit, Stimmen nach finalen Texten.
