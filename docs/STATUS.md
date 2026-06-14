# 📍 STATUS — zentrale Übersicht: erledigt · offen · TODO

**Zweck:** EIN zentraler, lebender Einstieg über den Projektstand — was erledigt ist, was
offen/zurückgestellt ist, und die priorisierte TODO-Liste. Ersetzt nicht die Detailpläne,
sondern verlinkt sie. **Jede Session aktualisiert dieses Dokument.**

> Lese-Reihenfolge: `SOUL.md` → `DECISIONS_2026-06-13B_TRANSCRIPT.md` →
> `STRANG34_FEINPLAN_2026-06-13_AKTIONEN_DIALOGE.md` → `GESAMTKONZEPT_VISUELL.md` →
> dieses Dokument für den aktuellen Bau-Stand. Lessons Learned: `ORCHESTRATION_FEEDBACK.md`.

**Stand:** 2026-06-14 · main nach #79 (Feinplan Strang 3+4) · offener Draft-PR **#80**
(Strang 3+4 P0 + Visual-Politur), Branch `claude/laughing-curie-jn0sff`.

---

## ✅ Erledigt (gemerged)

| Strang | Inhalt | PR |
|---|---|---|
| 1 — Visuelles Rework v2 | Stil-Bibel v2, alle 9 Räume neu, NPC-Halbfiguren transparent, UI ein-Guss (Emojis 241→0, Schlagschatten 37→0*), Tag/Nacht + Jahreszeiten, Dialog-Porträts v2 | #77 |
| 2 — Diegetische Bedienung | Knopfbalken weg, `FloorDirectory` (Etagen-Tableau F), Broadcast permanent, Narrativ-Tafel (Korkbrett), `LagebildView`, HUD auf Knopfdruck (H), `PixelModal`/`PixelFrame` für ~14 Modals | #78 |
| 3+4 — Feinplan | Planungsdokument zur Abnahme (kein Code) | #79 |

\* **Korrektur (ehrlich):** „241→0 Emojis / 37→0 Schatten" war **leicht überzogen** — der
Sweep hat dauerhaft eingeblendete Seiten-Widgets übersehen (s. Visual-Backlog & Lessons).

## 🟢 In Arbeit (PR #80, Draft)

| ID | Inhalt | Status |
|---|---|---|
| **P0a** | `headline_de` an alle **110** Aktionen; Generator/Broadcast nutzen sie → „Aktion durchgeführt" weg | ✅ |
| **P0b** | `MorningBriefing`: konkreter Tageshinweis (Zahl + zuständiges Büro, nicht klickbar, D-4) | ✅ |
| **Visual-Politur** | `AdvisorPanel`: Verbots-Schlagschatten/Glow raus → Pixel-Innenrand; Prioritätsfarben auf v2-Palette | ✅ |
| **P1a (Slice 1)** | **Aktion aus Dialog:** NPC bietet im Gespräch kontextuelle Maßnahmen an (Filter `npc_affinity` + verfügbar) → Wahl heftet auf den Sendeplan (Narrativ-Tafel). Entscheidung 1. | ✅ |
| **Declutter** | Floating-Overlays (Berater/Queue/Combo) **im Gespräch ausgeblendet** + Berater standard eingeklappt → Maßnahmen-Optionen erreichbar, Konversation frei (Smoke-belegt) | ✅ |
| **P1d** | **Sprach-Steckbriefe** je NPC (`docs/NPC_VOICE_PROFILES.md`) — Schreib-Gate für alle Dialog-Texte (K41) | ✅ |
| **P1b (Pilot)** | **Marina-Stimme**: alle 16 Begrüßungen (Level 0–3) nach Steckbrief neu (selbstbewusst, bildreich, trockener Biss); keine Vertonung berührt | ✅ |
| **P1b (Skaliert)** | **Begrüßungen aller NPCs** (Direktor, Alexei, Katja, Igor) nach Steckbrief neu (je 16, Level 0–3); bereinigt zugleich Alt-Persona-/Reale-Orts-Reste (Moskau/Kreml/Wodka) im Direktor | ✅ |
| **Deck-Gruppierung** | Narrativ-Tafel zeigt Maßnahmen **nach zuständigem Büro/NPC** statt flacher Liste (Entscheidung 1) | ✅ |
| **P1c (Affinitäten)** | **Alle 110 Aktions-Affinitäten** auf den kanonischen Roster (Owner: „Rollen wie Stimme") umgemappt → Orphan `volkov` weg, Dialog-Angebote je Büro stimmig | ✅ |
| **P1c (Content)** | **+15 granulare Aktionen** (`actions_p1c.json`, 110→125): **Igor/Finanz 3→10** inkl. **Kredit-Mechanik** (negative Budget-Kosten = Geldspritze, einmalig) + **Fokusgruppe** (K40), je Büro ergänzt. Balance-Sim: **18 Sieg / 18 Niederlage** (gewinn- UND verlierbar) | ✅ |

Gate je Push grün: `tsc` · `npm run build` · `vitest` (231). Smoke: `npm run smoke` (Playwright,
s. unten).

---

## 🔧 Visual-Coherence-Backlog (Owner-Feedback 2026-06-14, Preview #80)

Owner-Beobachtungen am Deploy-Preview + Verdikt **„zurückgestellt vs. übersehen"** nach Code-Inventur.
Prinzip (SOUL): visuelle Kohärenz ist das Erste, was Nutzer beurteilen.

| # | Beobachtung | Befund | Verdikt | Wohin |
|---|---|---|---|---|
| V1 | **Berater-Panel** (rechts) im alten Stil, „floating" | Verbots-Schatten/Glow + Off-Palette-Farben | **übersehen** (Strang 1 verfehlt) | **in #80 behoben** (Schatten/Farben); diegetische Auflösung = P1 |
| V2 | Berater als **dauerhafte Floating-Sidebar** statt diegetisch | widerspricht A2/A4 | **entschärft** (standard eingeklappt + im Gespräch ganz aus; Empfehlungen jetzt im Dialog) | Rest: Berater-Inhalt ganz in KONTAKTE-Panel verlagern → schmaler Rand-Tab entfällt |
| V3 | **Direktor-DialogBox** (roter Balken) wirkt legacy | v2-Farben + inset-Rahmen, aber flach | **Audit erledigt:** „Click to continue…" → „Weiter ▸" (war englisch), Auswahl-Liste gedeckelt+scrollbar (deckt den Raum nicht mehr zu, A3), Padding gestrafft | optional echtes 9-Slice-Pixel-Asset (Budget) |
| V10 | **G23/G24-Altlasten:** reale Bezüge (Moskau/Kreml/Genosse/Wodka/Russisch/Vaterland; „Russian minority/Soviet monument") | widerspricht „fiktiver Ost-Block, keine realen Symbole/Namen" | **✅ vollständig entschärft:** 28 „eigene Seite" (→ „die Zentrale" etc.) + 12 world-events (→ ostsprachige Minderheit, altes Regime). Player-sichtbar 0 reale Bezüge (nur interne ids/keys bleiben) | — |
| V11 | **Reaktions-Texte in Steckbrief-Stimme** (P1b) | Begrüßungen fertig | **✅ ALLE 5 NPCs:** Direktor+Marina vertont; **Alexei/Katja/Igor re-themed** (31 Reaktionen: `triggered_by_tags` auf die neuen Rollen-Aktions-Tags + Voice) — behebt zugleich, dass diese drei nach dem Affinitäts-Remap auf ihre Aktionen GESCHWIEGEN hätten (Tests belegen Feuern). | **Offen:** Topic-Texte in Stimme |
| V4 | **Büro-Panels** (Kontakte etc.) „andere CSS-Sachen" | Modals sind auf `PixelModal`, aber flach; einzelne Panels evtl. nicht migriert | **Audit nötig** | Mounted-Component-Audit (alle Panels gegen Stil-Bibel) |
| V5 | **HUD** teils alter Stil | `StoryHUD` nutzt v2-inset; Knopfdruck (H) da | **gering** | Feinpolitur im Stil-Audit |
| V6 | **Floating-Element links unten** (Auftrag/Hinweise) | `ComboHintsWidget` (`fixed bottom-4 left-4`), nicht-diegetisch | **übersehen** | diegetisch verorten oder in HUD/Tafel ziehen |
| V7 | **Avatar läuft, Beine bewegen sich nicht** (Schweben) | **Code-Bug gefunden & behoben:** `AssetRegistry.sheet()` gab je Render ein NEUES Objekt → `useSprite`-Effekt setzte den Frame bei jedem Re-Render auf 0 (beim Gehen rendert die Bühne ständig → eingefroren). Sheet jetzt referenz-stabil (memoisiert). Sprite-Sheet ist korrekt (256×32 = 8 Frames). | **✅ behoben** (kein Asset nötig) | Falls Frames optisch zu schwach: Neu-Generierung (Budget) als Fallback |
| V8 | „viele Feinheiten" aus Gesprächen fehlen | Atmosphäre (Dummies/Pförtner/Tür-Anim, D13) = **Strang 5**, bewusst später | **geplant** | Strang 5 (Atmosphäre) |
| V9 | **Lobby** = dasselbe Bild 3× nebeneinander → wirkt wie ein Bug, keine ganze Halle | EG-Hintergrund kachelte `repeat-x`; jetzt **`no-repeat` + `cover`** → eine durchgehende Eingangshalle (Flure kacheln weiter) | **✅ behoben** | Rest: optional breiteres Lobby-Asset + Pförtner-Figur (Asset/Budget) |

**Empfohlene Reihenfolge:** V1 (✅) → V4-Audit (klein, klärt Umfang) → **P1** (löst V2 strukturell) →
V3/V6 (Stil-Audit) → V7 (Asset-Arbeit, Budget-Ansage) → V8 (Strang 5).

---

## 🗺️ Roadmap Strang 3+4 (Feinplan §3, abgenommen §10)

| Phase | Inhalt | Status |
|---|---|---|
| **P0** | Aktions-Überschriften + Direktor-Hinweise | ✅ (PR #80) |
| **P1** | Aktion-aus-Dialog · Menü→Gespräch · granularere Aktionen · Sprach-Steckbriefe · NPC-Vorschläge im Gespräch (löst V2) | **Kern fertig** (PR #80) — ✅ P1a, ✅ P1b (Begrüßungen ALLER NPCs), ✅ P1c (Affinitäten + 15 neue Aktionen, 125 gesamt, Balance 18/18), ✅ P1d, ✅ Declutter, ✅ Deck nach NPC. **Rest-Politur (laufend):** P1b Topics/Reaktionen in Steckbrief-Stimme; weitere Aktions-Pakete + Marina (50) entlasten; situative Eröffnungen |
| **P2** | Kommunikations-Schlachtfeld (Ziel→Dossier→Kompromat→Verbreiter+Plattform-Mix). **Erst nach Exa-Recherche** (§10.1) | offen |
| **P3** | Gebäude-Wachstum (`unlocksRoom`/`unlocksNpc`) + 100–500-Pfade-Simulation | offen |

## 🪲 Bekannte Bugs / Altlasten

- **Avatar-Beine starr** (V7) — Schwebe-Eindruck.
- **NPC-Rollen-Inkonsistenz (3-fach, wichtig für P1c):** drei Quellen widersprechen sich —
  (a) `npcs.json` Rollen-Labels (Direktor=Leiter, Alexei=Technik, Katja=Feld, Igor=Finanz,
  Marina=Medien), (b) Aktions-`npc_affinity` (marina=Analyse, **volkov**=Ops/Infra [keine NPC-Id!],
  igor=Technik, katja=Content, direktor=Strategie), (c) alte `dialogues.json`-Personas (Direktor
  sowjetisch, „alexei"-Block = `vol_greet_*`-Chaos-Op, Katja=Content-Künstlerin, Igor=Hacker).
  **Folge:** manche Maßnahmen (volkov-Affinität) haben kein Büro, das sie im Dialog anbietet
  (P1a-Lücke). **GELÖST (2026-06-14):** Begrüßungen auf `npcs.json`-Rollen vereinheitlicht; Owner-Roster
  „Rollen wie Stimme" gelockt; alle 110 Affinitäten umgemappt (marina=Medien&Aufklärung · alexei=Technik ·
  katja=Feld · igor=Finanz · direktor=Strategie/Politik). **Rest:** Verteilung schief (marina 49 / igor 3)
  → in P1c-Content rebalancieren (Igor/Finanz-Aktionen ergänzen, Marina entlasten).
- **`npm run lint` defekt** — keine ESLint-Config im Repo; Gate stützt sich auf tsc/build/vitest.
- **Pixel-Font** blockiert (Netz-Policy) — `font-mono`-Reste bis lizenzfreie Datei vorliegt.

## 🛠️ Werkzeuge

- **Browser-Smoke:** `npm run smoke` (baut nicht; setzt laufenden `vite preview --port 4173` voraus)
  bzw. `scripts/app-smoke.mjs` (Playwright-core, Chromium im Container). Screenshots → `runs/app-smoke/`.
- **Daten-Skripte:** `scripts/add-headlines.mjs` (headline_de-Provenienz, idempotent).
