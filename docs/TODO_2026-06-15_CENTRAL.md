# ✅ Zentrale ToDo-Liste (nach dem gnadenlosen Review PR #77–#83)

**Stand:** 2026-06-15 · **Branch:** `claude/eager-curie-2m5kej` · **Quelle:** Synthese aus 8 Reviews
([Visual/Assets](REVIEW_2026-06-15_VISUAL_ASSETS.md) · [Spielstruktur](REVIEW_2026-06-15_GAME_STRUCTURE.md)).
**Zweck:** EINE priorisierte, deduplizierte Liste, um aus den großen Updates ein **exzellentes Paket** zu machen.

**Prioritäts-Logik:** P0 = höchster Hebel für „exzellent", Engine existiert schon, kleiner/mittlerer Aufwand ·
P1 = großer Qualitätssprung · P2 = Politur & Assets (Budget) · P3 = Aufräumen/niedrig · 🔒 = extern blockiert.
**Kostenklasse:** `Code` · `Asset` (Pipeline-Gen) · `Budget` (Owner-Ansage) · `Content` (Schreiben).

---

## 🔴 P0 — Erst diese (höchster Hebel, Engine ist da)

> **✅ Alle 8 P0-Posten umgesetzt** (Branch `claude/eager-curie-2m5kej`, Gate grün: `tsc 0` · `vitest 389` · `build`).
> Welt-Fiktion-Entscheidung des Owners eingearbeitet: NPC-Namen + Plattformnamen **bleiben**; nur die harten
> Staatssymbol-Lecks getilgt (Stalin/Genosse/NATO/Rubel→Taler/„Amerikaner"→Westunion/Gelbe Westen).

| # | Posten | Quelle | Beleg | Kosten |
|---|---|---|---|---|
| ✅ P0-1 | **Episoden im Spiel abschließen** — `completeEpisode()` wird live NIE aufgerufen (nur Tests). Im Hook nach jeder Aktion prüfen, ob alle `einklink_aktionen` einer aktiven Episode gespielt sind → `engine.completeEpisode(id)` + Abschluss-Beat. Erst dann feuern `wirkt_auf` + End-Report-Lernmoment. | B4, verifiziert | `StoryEngineAdapter.ts:3626`; `useStoryGameState.ts:658` | Code (M) |
| ✅ P0-2 | **Reiches EndingSystem verdrahten** — bei Spielende `evaluateEnding()` aufrufen; Kategorie/Tonalität durchreichen. Verwandelt 4 Strings in 8×7 state-getriebene Enden. | B1, verifiziert | `StoryEngineAdapter.ts:5830/5905` (tot) vs. `checkGameEnd` live | Code (S–M) |
| ✅ P0-3 | **Herzstück sichtbar machen** — Society-Werte + Auftrags-Fortschritt ins **Lagebild** (heute keine davon); HUD-„GESELLSCHAFT" nicht der einzige (default-aus) Ort. | B4 | `LagebildView.tsx:17`; `StoryHUD.tsx:497` | Code (S) |
| ✅ P0-4 | **P2-Schlachtfeld auffindbar machen** — Direktor-Hinweis/Pflicht-Episode „Operationszentrale, Etage 4" + `deriveBriefingHint` um Ops-Pointer erweitern. | B4 | `MorningBriefing.tsx:94`; Raum `operations` | Code (S) |
| ✅ P0-5 | **Advisor-Empfehlungen auf reale Aktionen** — `DirektorAnalysisStrategy` schlägt nicht-existente `ta02_server_network`/`ta08_all_in`… vor → tote Klicks im player-sichtbaren Modal. Auf `getAvailableActions()` umstellen. | B3 | `DirektorAnalysisStrategy.ts:346,395,409`; `AdvisorDetailModal.tsx:245` | Code (S) |
| ✅ P0-6 | **Farbemojis aus `headline_de`** (9×) — landen sichtbar in Broadcast/Newsroom/DayReport. Text-Präfix statt Emoji. | A1 | `StoryEngineAdapter.ts:1672,1771,1826,1865,1887,1909,1953,1981,3242` | Code (XS) |
| ✅ P0-7 | **Reale-Symbol-Reste tilgen** (player-sichtbar) — Stalin, „Amerikaner", Genosse (2×), Rubel (5×, **Test lösen** `PlatinumDialogSystem.test.ts:229`), NATO, Gelbe Westen. | B2, B3 | `dialogues.json:434,428`; `TutorialOverlay.tsx:219`; `DirektorAnalysisStrategy.ts:353`; `topics_dialogues.json:199,1035`; `world-events.json:370,233` | Content (S) |
| ✅ P0-8 | **`AdvisorPanel` Priority-Icon** — `getPriorityEmoji()` gibt leere Strings → sichtbares UI-Loch. `Icon`-Bauteil je Level. | A1 | `AdvisorRecommendation.ts:404–409` | Code (XS) |

---

## 🟠 P1 — Großer Qualitätssprung

> **🔬 Struktur-Befund (Messung, Session 2026-06-15):** Die Gesellschaftswerte/Auftrags-Signatur und der
> Sieg laufen auf **verschiedenen Zeitskalen** — der Vertrauens-Sieg fällt **schnell** (Median Phase ~54–64),
> bevor die Signatur nennenswert reift (Sieg-Runs: auftragProgress median ~0.0 für „Keil", ~0.33 für
> „Wahl/Zweifel", weil nur die Vertrauens-Achse automatisch erfüllt ist). → Ein **harter** per-Auftrag-Win-Gate
> würde das Spiel **unspielbar/unwinnbar** machen UND den (schnelleren) vorsichtigen Pfad bestrafen.
> **Owner-Entscheidung nötig** (Pacing), s. §❓-7.

| # | Posten | Quelle | Beleg | Kosten |
|---|---|---|---|---|
| ✅ P1-1 | **Auftrag bestimmt die Sieg-QUALITÄT** (statt unspielbarem Hard-Gate): voll erfüllt ≥0.6 · teilweise ≥0.35 · sonst „hohler Sieg" (Vertrauen gebrochen, eigentliches Ziel verfehlt) — im Sieg-Ende sichtbar (`auftragMissionVerdict`). **+ Kopplungs-Boost** (`SocietyDynamics` baseline grey/illegal → polarisierung/zynismus/diskursqualität) macht volle Erfüllung für dedizierten Aggressiv-Pfad erreichbar; **balance-neutral** (obj_destabilize unberührt, Sim 17/19, society-Tests grün). Hard-Gate = Owner-Pacing-Entscheidung. | B1 | `Auftraege.ts` `auftragMissionVerdict`; `StoryEngineAdapter.ts` victory-Branch; `SocietyDynamics.ts:110–124` | Code (M) |
| ✅ P1-2 | **Zwei neue Niederlage-Pfade live** (Frostpunk-Prinzip): **„Der Apparat zerfällt"** (`getBetrayingNPCs()≥3`) + **„Mittellos"** (`budget≤0 && risk≥70`) — vorher nur im toten `EndingSystem.shouldGameEnd` definiert. Sim bleibt gewinn- UND verlierbar. | B1 | `StoryEngineAdapter.ts checkGameEnd` (PRIORITY 1b/1c) | Code (M) |
| ✅ P1-3 | **Ambient-Rollenrutsch behoben** — alle **80 Zeilen** (de+en) der 4 fehlbesetzten NPCs (Marina≠Daten-Analystin, Alexei≠Troll, Katja≠Autorin, Igor≠Hacker) neu in korrekter Steckbrief-Stimme; Anglizismen-Soße (Dashboard/Sentiment/Penetration-Test/Zero-Day/Story-Arc/…) getilgt; IDs stabil; unvertont → keine Audio-Desync. | B2 | `dialogues.json` ambient-Blöcke; `NPC_VOICE_PROFILES.md` | Content (L) |
| ✅ P1-4 | **Topics bereinigt** — **73** ASCII-Umlaut-Strings korrigiert (kuratiert, ohne Korruption korrekter Wörter), **5 Prozent-Listen** (40-30-30) in NPC-Stimme umgeschrieben, **3 „Lebensader"-Copy-Paste** variiert. | B2 | `topics_dialogues.json` | Content (M) |
| P1-5 | **Encyclopedia (Taste I) auf `DisinfoMethodAtlas`** umstellen (deutsch, im Spiel verankert) oder entfernen — heute entkoppelte Pro-Mode-Legacy. | B4 | `Encyclopedia.tsx:1–7,52`; `disinfo_methods.json` | Code (M) |
| P1-6 | **`monospace`/`font-mono` als Weltschrift entfernen** — Schwerpunkt FokusgruppeView (13×), NewsroomView (11×), AuftragSelect-Root, DayReport (5×). *Vollständig blockiert durch Pixel-Font (🔒 P3-BLOCK-1) — Übergang: `inherit`.* | A1 | 72 Inline + ~27 Klassen | Code (M) |
| P1-7 | **Operation an `broadcastMapping` koppeln** — `playOperation` umgeht das Mapping; Tag `operation` fehlt in `THEMES_BY_TAG`, `targeting`→`abstiegs_angst` falsch. | B3-Subaudit | `StoryEngineAdapter.ts:3851–3897`; `broadcastMapping.ts:38–50` | Code (M) |
| P1-8 | **`ROOM_HINTS['operations']` in Shotlist** + `room_operations` neu generieren (heute generischer Fallback-Prompt). | A2 | `shotlist.mjs` ROOM_HINTS | Code (XS) + Asset |
| P1-9 | **Auftrags-Wahl kontextualisieren** — narrativ in den Direktor-Dialog ziehen oder erst nach Tag 1 anbieten (heute kontextlos sofort). | B4 | `StoryModeGame.tsx:700`; `AuftragSelect.tsx:28` | Code (S) |
| P1-10 | **End-Report „Mögliche Spielenden": Bedingungstexte an echte Trigger** angleichen (`collapse`=armsRace≥5; `stalemate`/`pyrrhic` werden nie erzeugt). | B3 | `EndReport.tsx:705–751` | Content (S) |
| P1-11 | **`index.css` Legacy-Klassen bereinigen** — `.btn-*` (`rounded-lg`), `.card` (`rounded-2xl`), Neon-Glow-Keyframes, globales `Inter`. | A1 | `index.css:118,136,144,200,320,447` | Code (S) |

---

## 🟡 P2 — Politur & Assets (mit Budget-Ansage)

**Visuell/Code (gratis zuerst):**
- P2-1 **Prozeduraler Himmel** (Tagesuhr-Verlauf 7 Stops + Horizont-Glühen) + **Skyline-Band höher** — löst „zu klein/zu dunkel" ohne Asset. *(A4 C-07/C-08)*
- P2-2 **Büro-Hotspots entrechtecken** (Ruhe-Ring weg, Hover-Glow folgt Möbelform) + **„2"-Welt-Badge diegetisch verorten**. *(A4 C-01/C-02)*
- P2-3 **Broadcast-Leiste höher**; **ComboHints diegetisch** (statt `fixed bottom-4 left-4`). *(A1, A4 C-05/C-06)*
- P2-4 **Seitenleiste diegetisch** (Papier/Klemmbrett oder PixelModal) — „zwei Welten" auflösen (V14). *(A4 C-04)*
- P2-5 **Harte Box-Shadows raus** (`TitleScreen` Menü/Changelog, `BuildingStage:810`, `BetrayalWarningBadge` Glow+`shadow-lg`); TitleScreen-Emojis→Icon; runde Pillen (`BetrayalIndicators`/`ActionFeedbackDialog`/`ActionQueueWidget`)→eckig. *(A1)*
- P2-6 **`MissionPanel`/`GameEndScreen` auf PixelModal**; `#8B0000`→`StoryModeColors`. *(A1)*
- P2-7 **R4-Entkachelung** — saubere Basis-Korridore (ohne eingebackene Deko) + datengetriebene `decor[]`-Platzierung an der Wand-Fuß-Linie; eigener Keller-Korridor (R7). **Atomar ausliefern.** *(A4 AN-06/07/08, C-03)*
- P2-8 **Fernsehfamilie/Wohnzimmer** — repräsentative Teilmenge auf Sofa-Sitzlinie (nicht alle 8), Sitzlinie↔Sofa-Asset. *(A4 DB-02/C-18)*

**Assets (Budget):**
- P2-9 **Avatar hi-res** (48–64 px) + Entscheidung Porträt-only vs. m/w-Lauf-Variante (heute nicht an Wahl gekoppelt). *(A4 AN-02/03, DB-01 — Owner-Entscheidung)*
- P2-10 **Audience-Figuren neu** (8 Segmente „kaputt") + **Wohnzimmer/Sofa** modern. *(A4 AN-04/05)*
- P2-11 **Tür-Assets** (gleiche Maße offen/zu, echte Phasen) + **Fahrstuhl-Kabine** an Schachtmaße; **Avatar↔Tür-Proportion** (R1). *(A4 AN-16/17, DB-03/04/05/06)*
- P2-12 **2–3 Skyline-Varianten** (Tag/Dämmerung/Nacht) cross-faden. *(A4 AN-09)*
- P2-13 **Poll/Barometer-Grafiken** (`prop_poll_chart`, `prop_barometer_gauge`) — nur falls P6-TV-Viz gebaut wird. *(A2)*
- P2-14 **Fokusgruppe-Persona-Porträts** ODER CSS akzeptieren; **2 fehlende Personas** (`wu_idealistin`, `wu_macher`). *(A2, B3 — Owner-Entscheidung)*

**Sound (🔍 zuerst Preview-Verifikation, s. Owner-Fragen):**
- P2-15 Adaptive Musik (J34/J35) + Ducking (J36) + Ambience-Verdrahtung — **STATUS/Backlog widersprüchlich**.
- P2-16 **Topic-Vertonung** (14 Themen × NPC) — ElevenLabs-Batch mit Kostenansage, **erst nach P1-4** (Texte stabil).

**Struktur:**
- P2-17 **Früh-Phase-Druck** (garantierte erste Verteidiger-Welle) + **Spät-Leerlauf** entschärfen (eskalierende Endwelle). *(B1)*
- P2-18 **Strang 5 (Atmosphäre)** vollständig: Dummy-Tür-Figuren, anklickbare Flavor-Dialoge. *(A4 C-17/C-19)*

---

## 🟢 P3 — Aufräumen & niedrig

- P3-1 **Waisen verbinden/archivieren:** NPC-`figure_*` (6) in Flure platzieren · `prop_safe`/`server_rack`/`world_map` in Keller/Ops-Deko · `prop_tv`/`typewriter`/`coffee`/`files`/`red_phone` archivieren · 6 alte `audience_*`-Sheets archivieren · `icon_save`/`office`/`building`-Routen verdrahten oder entfernen. *(A3)*
- P3-2 **Tote ID-Altlasten entfernen:** `npcs.json` `enhancedActions` (9 tote Refs) · `alexei.portrait:"volkov"` · `StoryNarrativeGenerator` `volkov`-Block (0 Caller) · ggf. `vol_*`-Dialog-IDs umbenennen. *(B3)*
- P3-3 **IdValidator erweitern** um `enhancedActions` + Advisor-`suggestedActions` (Blindstellen, die P0-5 hätten fangen können). *(B3)*
- P3-4 **Toter/veralteter Code:** `TutorialOverlay` (13 Schritte) löschen oder als echte Hilfe aktualisieren; `unlocksRoom/unlocksNpc` als „geplant" markieren (totes Schema-Feld). *(B4)*
- P3-5 **Doku-Hygiene:** `DAY_ONE_WALKTHROUGH.md` + Teile `HIDDEN_TREASURES.md` als veraltet markieren/aktualisieren. *(B4)*
- P3-6 Kleinkram: Lampen-abends-an, `StoryHUD.ViewToggleButton`-Label, `sovietRed`→`ministryRed`-Token, Save/Load sichert `DialogLoader`-Zustand nicht. *(A4 DB-07/10/11/13, C-11)*

---

## 🔒 Extern blockiert
- **P3-BLOCK-1 Pixel-Font** (z. B. „Pixel Operator", CC0) — Netz-Policy (403). Owner-Upload nach `public/fonts/` oder Allowlist. Blockiert die **vollständige** `font-mono`-Lösung (P1-6). *(A4 AN-21, DB-17)*
- `npm run lint` defekt (keine ESLint-Config) — Gate stützt sich auf tsc/build/vitest. *(A4 DB-07)*

---

## ❓ Owner-Entscheidungen (vor Umsetzung)
1. **Russisch-codierte NPC-Namen** (Volkov/Petrova/Petrov/Orlova/Smirnov) — als fiktive Ost-Block-Würze behalten, oder fiktionalisieren? *(B3)*
2. **Reale Plattformnamen** (Twitter/TikTok/Telegram/YouTube) in Topics/Actions — für Glaubwürdigkeit halten oder fiktionalisieren? `SYMBOLS_AUDIT.md` verbietet nur Staatssymbole. *(B2)*
3. **Avatar:** Porträt-only akzeptieren oder m/w-Lauf-Variante (Budget)? *(P2-9)*
4. **Fokusgruppe:** CSS-Initialen akzeptieren oder Persona-Porträt-Batch (6+2 Bilder)? *(P2-14)*
5. **Sound:** Sind adaptive Musik/Ducking/Ambience (J34–J36) gebaut? Deploy-Preview prüfen, bevor P2-15 geplant wird. *(A4-Widerspruch)*
6. **Asset-Budget-Pakete:** Skyline-Varianten · Audience-Figuren · Avatar hi-res · Wohnzimmer — je Paket Budget-Ansage.
7. **Auftrag als ECHTE (harte) Win-Condition?** (Pacing) — Heute ist der Auftrag die Sieg-*Qualität* (P1-1), kein harter Gate, weil der Vertrauens-Sieg schneller fällt als die Signatur reift. Soll der Sieg künftig die Signatur **verlangen**? Dann braucht es eine Pacing-Entscheidung: (a) Vertrauens-Sieg verlangsamen, damit die Mission Zeit hat zu reifen, ODER (b) Gesellschaftswerte deutlich schneller bewegen (ändert Polls/Fokusgruppe/Gegenseite-Erzählung mit), ODER (c) bei „hohlem Sieg" weiterspielen lassen, bis die Signatur erfüllt ist. Empfehlung: erst die Spielqualität von P1-1 im Preview erleben, dann entscheiden.

---

### Dedup-Hinweis
Diese Liste ersetzt die verstreuten Backlogs als **Single Source** für das Review-Paket. Die Detail-Backlogs
(`STATUS.md` V1–V16/R1–R8, `VISUAL_AUDIO_BACKLOG_2026-06-14.md`) bleiben als Belege; bei Umsetzung hier abhaken
und dort referenzieren. ~60 zurückgestellte Roh-Posten (A4) sind in P2/P3 aufgegangen.
</content>
