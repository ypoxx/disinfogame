# 🤝 Handoff 2026-07-06 — UI-Luxus-Paket (Etappen 0–4 gemergt) + offene Fäden

**Zweck:** Übergabe an die nächste Bau-Session. Was gemergt ist, was der Owner
neu entschieden hat, und was offen bleibt — mit Einstiegs-Dateien.

**Lese-Reihenfolge zuerst:** `SOUL.md` → `STATUS.md` →
`docs/PLAN_2026-07-06_UI_LUXUS.md` (§3 Etappen-Tabelle, §3b Doppel-Review-Kontrakt)
→ **dieses Dokument** → `docs/story-mode/MINISTRY_BROADCAST_CONCEPT.md` §7
(Owner-Entscheidung Broadcast).

---

## 1. Gemergt in PR #96 (Branch `claude/ui-luxus-package-1szmrw` → main)

Etappen 0–4 des UI-Luxus-Pakets, jede mit erfülltem **Doppel-Review-Kontrakt**
(adversariales Code-Review + Harvest-Vision-Review), plus eine Owner-Preview-
Fix-Runde. Gate durchgehend grün (`tsc 0` · `vitest 630` · `build`).

- **0 Memo** — `docs/MEMO_2026-07-06_STATE_OF_THE_ART.md` (Integer-Scaling,
  diegetische UI, Ambient-NPCs).
- **1 Auflösung/Integer-Scaling** — `pixelScale.ts` (pixel-saubere Welt-Ebene,
  Scale 0,5 exakt), `WorldAnchor`-Text, Cover-Snap-Hooks, B2–B24-Sofortpaket.
- **2 L1 Material-Welt „Behörden-Akte"** — `theme.ts` v3.1, Material-Kit, ~40
  Panels umgekleidet (Stempel statt Chips).
- **3 LB „Lebendiges Gebäude"** — `building/ambientLife.ts` (Statisten laufen
  echte Routen durch Türen statt Fade/Pendel); NEU Asset `figure_clerk_walk`.
- **4 L2 Vorgangs-Terminal** — `components/TerminalView.tsx` +
  `terminalCuration.ts` (CRT-Terminal ersetzt Aktionen-Sidebar; M1-Karten,
  M2-Kuratierung + Archiv). Karten-Kern = `components/ActionCard.tsx` (aus dem
  archivierten ActionPanel extrahiert).
- **Owner-Preview-Fix-Runde:** Cover-Snap-Letterbox behoben (Räume/Büros füllen
  wieder — `snapCoverScale` fällt auf exaktes Cover statt Letterbox); Queue-Widget
  verdeckt nicht mehr das Publikums-Wohnzimmer; kaputte TV-Glyphen (`▚▞`/`⬢`)
  ersetzt; NEU `hud_tv_testcard` (Sendepause-Testbild im Standby).

---

## 2. Owner-Richtung NEU (BINDEND) — Broadcast voll diegetisch ausbauen

**Das ist die Priorität der nächsten Session.** Der Owner hat das kleine v1
(Text-Ticker) verworfen: **jedes wichtige Ereignis soll ein EIGENES Pixel-Art-Bild
bzw. eine Mini-Animation im Fernseher bekommen**, diegetisch. Vollständige
Vorgaben + Format-Palette + Wirkungs-Treppe: `MINISTRY_BROADCAST_CONCEPT.md`
(§3, §4, und die neue §7 „Owner-Entscheidung 2026-07-06").

Kurz: Maßnahmen (je Kanal/Masche/Tier), Gegenreaktion/Faktencheck, Krise/
Sondersendung, Enttarnung, Wahltag/Wochenschau — alle mit Motiv. Mehrframige
Sheets für Mini-Loops (Talkshow-Schnitt, Störbild-Flackern, Krisen-Banner-Puls).
`BroadcastItem` braucht ein Bild-/Sheet-Feld; Zuordnung Ereignis→Motiv als
gepflegte Mapping-Tabelle. Mechanische Publikums-Rückkopplung bleibt bewusst
separate Balancing-Frage.

**Einstiegs-Dateien:** `broadcast/BroadcastBar.tsx` (`BroadcastScreen`,
`AudienceRoom`), `broadcast/broadcastMapping.ts` (`mapActionToBroadcast`,
`BroadcastItem`), `broadcast/useAudienceBroadcast.ts`. Asset-Pipeline:
`tools/asset-pipeline/src/shotlist.mjs` (Muster: `hud_tv_testcard`-Shot als
Vorlage für Vollbild-TV-Motive; `styleObject/Home/Core` je nach Motiv).

---

## 3. Restliche UI-Luxus-Etappen (Plan §3, noch offen)

Reihenfolge laut Plan; jede mit Doppel-Review-Kontrakt (§3b):

- **L3 Korkbrett = Planung** — Queue → angeheftete Karten an der Narrativ-Tafel;
  rote Verfallsfäden; Anheft-Animation. Löst die Naht „Terminal speist noch das
  alte Floating-Widget". Dateien: `components/NarrativeBoard.tsx`,
  `components/ActionQueueWidget.tsx` (V6, soll aufgehen), Queue-API in
  `hooks/useStoryGameState.ts` (`addToQueue`/`executeQueue`).
- **L4 Kontakte-Konsolidierung** — Karteikasten/Personalakten; Berater-Rand-Tab
  entfällt (löst V2). `components/NpcPanel.tsx`, `AdvisorPanel`, `GrievanceModal`.
- **L5 HUD diegetisch** — Objekt-Leiste (Ticker/Lagekarte/Kassenbuch/Kalender).
- **L6 Tageszyklus & Modals** — Zeitung/Fernschreiber (DayReport), Briefing-Mappe
  (blockierend, behebt B5), Telefon/Telegramm/Eilmeldung. Integriert Review-P3.
- **L7 Bewegung & Klang** — Anheften/Stempeln/Aktenklappen-SFX (ElevenLabs-Batch).
- **L8 UX-Härtung + Playtest** — Onboarding, 3–5 Testspieler, Verbotslisten-Sweep.

---

## 4. Kleine offene Nebenbefunde (nicht blockierend)

- **8 ungenutzte generierte Bilder** (Audit 2026-07-06): 5 NPC-Figuren
  (`figure_alexei/direktor/igor/katja/marina` — nie im Gebäude verdrahtet),
  3 Deko-Props (`prop_safe`, `prop_server_rack`, `prop_world_map` — in keiner
  Etage platziert). Einbau = Platzierungs-Geschmack (Owner). Die 7 UI-Kit-Assets
  (`ui_frame_*`, `ui_badge_set`, `ui_clipboard_frame`, `ui_bar_segments`,
  `ui_panel_dark`) sind bewusst für L3+ reserviert, kein Befund.
- **MorningBriefing** kann englische Krisen-Ticker zeigen (Übersetzungspfad
  umgangen) — `engine/CrisisMomentSystem.ts:127/218`. Für L6 vorgemerkt.

---

## 5. Werkzeuge (bewährt)

- **Gate:** `cd desinformation-network && npx tsc --noEmit && npx vitest run && npm run build`.
- **Visual-Review-Ernte:** `scripts/visual-review/harvest.mjs` (Shots/Clips/
  Geometrie via `?vqa=1`), `analyze-geometry.mjs`, `gemini-review.mjs`
  (Gemini-Zweitmeinung, `GEMINI_API_KEY`; Video inline < 19 MB).
- **Asset-Pipeline:** `tools/asset-pipeline` (Gemini; Vision-QC PFLICHT;
  `pixel-asset-pipeline`-Skill lesen). Budget-Freigabe für Bild-Generierung liegt
  vor (Plan §3).
- **Prozess-Lehren:** `docs/ORCHESTRATION_FEEDBACK.md` fortschreiben.
