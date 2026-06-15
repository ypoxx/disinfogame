# 🎨 Review-Report A — Visuelle Kohärenz & Asset-Pipeline (nach PR #77–#83)

**Stand:** 2026-06-15 · **Branch:** `claude/eager-curie-2m5kej` · **Methode:** 4 orchestrierte Agenten
(A1–A4), disjunkter Scope, alle Befunde mit `file:line`. Zentrale Maßnahmenliste:
[`TODO_2026-06-15_CENTRAL.md`](TODO_2026-06-15_CENTRAL.md). Plan: [`REVIEW_2026-06-15_PLAN.md`](REVIEW_2026-06-15_PLAN.md).

## Kurzfazit
Die v2-Primitiven (`PixelFrame`/`PixelModal`/`Icon`) sind sauber gebaut und an vielen Stellen korrekt
verwendet (DialogBox, OperationsAkte, NarrativeBoard, Lagebild). Aber der v2-Sweep (#77) hat **strukturelle
Stilbrüche systematisch übersehen** — sie laufen ausgerechnet auf den am häufigsten sichtbaren Flächen.
Asset-seitig ist die Bibliothek erstaunlich vollständig (Datei↔Manifest 1:1), hat aber **zwei echte
Planungslücken** und **28 Waisen** (erstellt, nie verbunden). Ein großes Reservoir **zurückgestellter**
Posten ist real und gehört in die zentrale Liste.

> **Methodischer Warnhinweis (gilt für künftige Audits):** Das `styleVersion`-Tag im Manifest ist **kein**
> verlässliches Legacy-Signal — 106/109 Bild-Assets stehen trotz v2-Rework noch auf `v1`. Urteil immer am
> Render-Idiom, nie am Tag. Und: STATUS' „241→0 Emojis / 37→0 Schatten" war **überzogen** (s. A1).

---

## A1 — Legacy-Audit: ist alles ins v2-Konzept umgewandelt? → **Nein, mehrere strukturelle Reste**

**Top-Offender (priorisiert):**
1. **9 Farbemojis in `headline_de`-Strings** (`StoryEngineAdapter.ts:1672,1771,1826,1865,1887,1909,1953,1981,3242`,
   `🔴🔥👁️💸⚖️🚨⚠️`) — landen sichtbar im Broadcast-Ticker, Newsroom-Feed, DayReport, ActionFeedback.
   **Zentraler Datenpfad** → höchste Streuwirkung. Fix: Text-Präfix (`[KRISE]`) statt Emoji. (Code, ~15 min)
2. **`monospace`/`font-mono` als Weltschrift, flächendeckend** — 72 Inline-`fontFamily:'monospace'` + ~27
   `font-mono`-Klassen. Schwerpunkte: **FokusgruppeView** (13×), **NewsroomView** (11×), **AuftragSelect**
   (Root-Font), DayReport (5×), GameEndScreen (3×), EndReport-Root. Verbotsliste §4.6. (Kontextuell OK:
   OperationsAkte/Broadcast-Ticker = diegetische Geräte.) *Vollständige Lösung blockiert durch fehlende
   Pixel-Font (Netz-Policy).*
3. **Harte Box-Shadows als Stilträger** — `TitleScreen.tsx:170–175,522,48` (Menü-Buttons + Changelog),
   `BuildingStage.tsx:810` (Poster), `BetrayalWarningBadge.tsx:69,74` (`shadow-lg` + Glow).
4. **TitleScreen-Farbemojis** (`💾🔊🔇` `:365,418`; `⚠️`+VS-16 `:444`) — erster Spielereindruck.
5. **`AdvisorPanel.getPriorityEmoji()` gibt leere Strings** (`AdvisorRecommendation.ts:404–409`) — der Sweep
   hat die Emoji-Zeichen gelöscht, aber **kein Icon eingesetzt** → sichtbares UI-Loch beim Prioritäts-Indikator.
6. **`index.css` Legacy-Klassen** — `.btn-primary`/`.btn-secondary` (`rounded-lg`), `.card` (`rounded-2xl`),
   `.interactive-glow`/`.animate-glow-pulse`/`.animate-opportunity-glow` (Neon-Glow), globales `font-family: Inter`.
7. **`MissionPanel`** (6× `border-4` roh, nicht auf `PixelModal` migriert) · **`GameEndScreen`** (`border-8`,
   `#8B0000` hart) · **runde Pillen** (`BetrayalIndicators`, `ActionFeedbackDialog`, `ActionQueueWidget` `rounded-full`).

**✅ Bereits sauber umgewandelt:** `PixelModal`/`PixelFrame`, `DialogBox` (kein CSS-Gesicht mehr, Ambient-Fade ok),
`OperationsAkteView` (monospace diegetisch vertretbar), `NarrativeBoard` (Inset-Schatten).

**Mess-Artefakt (Grep, src/ ohne Tests):**
```
Farbemojis im Render-Pfad (tsx)            2   (TitleScreen)
Farbemojis in headline_de (Engine-Daten)   9   (StoryEngineAdapter)
fontFamily:'monospace' (Inline)           72   (Fokusgruppe 13, Newsroom 11, OpsAkte 6 ok, …)
font-mono (CSS-Klasse)                    ~27
box-shadow HARD (kein inset)              12   (TitleScreen 5, BuildingStage, BetrayalBadge, …)
index.css Legacy-Klassen                  ~8   (.btn-*, .card, glow-Keyframes, Inter)
```
**Korrektur zu STATUS:** Die vom Sweep übersehenen Dauer-Widgets sind konkret `StoryEngineAdapter` (headline_de),
`TitleScreen`, `AdvisorPanel` (leere Priority-Icons).

---

## A2 — Neue Elemente ohne Asset / nicht in der Bibliothek angelegt → **2 echte Lücken**

Die meisten neuen Views sind entweder asset-gedeckt oder **bewusst CSS-diegetisch** (akzeptiert: OperationsAkte,
NarrativeBoard/Korkbrett, AuftragSelect, Lagebild). Echte Bibliotheks-Lücken:

1. **`ROOM_HINTS['operations']` fehlt in `tools/asset-pipeline/src/shotlist.mjs`.** `room_operations` wird vom
   Raum-Loop generiert, aber **ohne Qualitäts-Prompt** → das vorhandene Asset entstand aus einem generischen
   Fallback („office room"). Eintrag (Lagebild-Raum: Kartenwand, Planungstisch, gedämpftes Licht) anlegen,
   dann neu generieren. (Code 5 min + 1 Asset)
2. **Keine Poll-/Barometer-Grafik-Assets** (`prop_poll_chart`, `prop_barometer_gauge`) — `PollNews` erzeugt nur
   Text-News. Relevant, **sobald** P6-TV/Umfrage-Visualisierung gebaut wird. Shotlist-Einträge jetzt anlegen
   sichert Planbarkeit. (Code 10 min + 2 Assets)

**Design-Entscheidung offen:** `FokusgruppeView` nutzt CSS-Initialen-Kacheln statt Persona-Porträts —
CSS akzeptieren oder Asset-Batch (`portrait_fg_*`, 6 Bilder)? **Verknüpft mit B3-Befund:** 2 der 8
Audience-Segmente (`wu_idealistin`, `wu_macher`) haben gar keine Persona.

---

## A3 — Waisen: erstellt/registriert, aber nicht im Spiel → **28 echte Waisen**, Datei↔Manifest 1:1

Connect-Map über alle 134 Bild/Sheet-Assets, **Template-Referenzen korrekt aufgelöst** (`portrait_${id}`,
`npc_half_${id}`, `room_${id}`, `figure_${id}`, `audience_${seg}`, Deko via `corridorDecor.ts:FLOOR_DECOR`):

| Gruppe | Waisen | Befund | Empfehlung |
|---|---|---|---|
| **Alte Raum-Props** | `prop_coffee`, `prop_files`, `prop_red_phone`, `prop_safe`, `prop_server_rack`, `prop_tv`, `prop_typewriter`, `prop_world_map` (8) | Nie in `FLOOR_DECOR`/Hotspots; tw. redundant zu Raum-Bildern | `prop_safe`/`prop_server_rack`→Keller-Deko, `prop_world_map`→Ops-Deko; Rest archivieren |
| **NPC-Figuren** | `figure_alexei/igor/katja/marina/direktor`, `figure_cleaner` (6) | Nie im Gebäude-Querschnitt platziert (nur `clerk`/`pfoertner`/`cleaner_walk` genutzt) | Je Etage in `FLOOR_AMBIENT`/`DOOR_TRAFFIC` einsetzen (belebt die Flure) |
| **Alte Audience-Sheets** | `audience_family/intellectual/official/pensioner/worker/youth` (6) | Altes Milieu-Modell (>8 Segmente), nicht mehr in `audience.json` | Archivieren |
| **Tote Icon-Routen** | `icon_save`, `icon_office`, `icon_building` (3) | Asset existiert, aber kein `<Icon name=…>`-Aufruf | Verdrahten (Speichern/Büro/Gebäude) oder aus `IconName`-Union entfernen |

**Connect-Map:** 134 Bild/Sheet-Assets → 106 erreichbar, **28 Waisen** (16 image, 12 sheet). **Keine** Datei↔Manifest-Diskrepanz.

---

## A4 — Zurückgestellte Asset-/Debug-Posten → **~60 offene Posten** (Roh → zentrale Liste)

Vollständig destilliert in [`TODO_2026-06-15_CENTRAL.md`](TODO_2026-06-15_CENTRAL.md). Kategorien:
**ASSET-NEU 17** (room_operations, Avatar hi-res/m-w, Audience-Figuren, Wohnzimmer, saubere Korridore R4,
Keller R7, Deko-Props, 2–3 Skyline-Varianten, Tür-/Fahrstuhl-Assets) · **DEBUG 18** (Avatar↔Wahl, Fernseh­familie-
Sitzlinie, Türanim, Fahrstuhl-Maße, Proportionen) · **SOUND 6** · **CONNECT 20** (Himmel-Verlauf, Hotspots,
„2"-Badge, Wand-Fuß-Deko-Platzierung, Seitenleiste diegetisch).

**Aufgedeckter Widerspruch:** Adaptive Musik (J34/J35) + Ducking (J36) + Ambience-Verdrahtung — **STATUS** sagt
„geliefert PR #81", **VISUAL_AUDIO_BACKLOG** sagt „entschieden, aber NICHT gebaut". → **Im Deploy-Preview
verifizieren**, bevor der Posten als geschlossen gilt.
</content>
