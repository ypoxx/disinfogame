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
| **Deck-Gruppierung** | Narrativ-Tafel zeigt Maßnahmen **nach zuständigem Büro/NPC** statt flacher Liste (Entscheidung 1) | ✅ |

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
| V3 | **Direktor-DialogBox** (roter Balken) wirkt legacy | nutzt v2-Farben + inset-Rahmen, aber **flach-CSS** (kein Pixel-Frame-Asset) | **Kohärenz-Lücke** | Stil-Audit DialogBox; ggf. echtes 9-Slice-Pixel-Asset |
| V4 | **Büro-Panels** (Kontakte etc.) „andere CSS-Sachen" | Modals sind auf `PixelModal`, aber flach; einzelne Panels evtl. nicht migriert | **Audit nötig** | Mounted-Component-Audit (alle Panels gegen Stil-Bibel) |
| V5 | **HUD** teils alter Stil | `StoryHUD` nutzt v2-inset; Knopfdruck (H) da | **gering** | Feinpolitur im Stil-Audit |
| V6 | **Floating-Element links unten** (Auftrag/Hinweise) | `ComboHintsWidget` (`fixed bottom-4 left-4`), nicht-diegetisch | **übersehen** | diegetisch verorten oder in HUD/Tafel ziehen |
| V7 | **Avatar läuft, Beine bewegen sich nicht** (Schweben) | bekannter Bug (DECISIONS A2); „reparierter Laufzyklus" (#75) griff nicht durchgängig | **bekannt, offen** | Walk-Sprite-Sheet (Asset) + Animations-Wiring; Größe/Schärfe (E17) |
| V8 | „viele Feinheiten" aus Gesprächen fehlen | Atmosphäre (Dummies/Pförtner/Tür-Anim, D13) = **Strang 5**, bewusst später | **geplant** | Strang 5 (Atmosphäre) |
| V9 | **Lobby** = dasselbe Bild 3× nebeneinander → wirkt wie ein Bug, keine ganze Halle | im Querschnitt werden identische Module gekachelt; Strang 1 (#77) meldete „Lobby als echte Eingangshalle", greift im Gebäude-Querschnitt aber nicht | **bekannt** (DECISIONS A2), Fix unscheduled | durchgehende Lobby-Komposition: ein breites Asset ODER variierte Module (wie die 3 Flur-Varianten) + Pförtner-Figur |

**Empfohlene Reihenfolge:** V1 (✅) → V4-Audit (klein, klärt Umfang) → **P1** (löst V2 strukturell) →
V3/V6 (Stil-Audit) → V7 (Asset-Arbeit, Budget-Ansage) → V8 (Strang 5).

---

## 🗺️ Roadmap Strang 3+4 (Feinplan §3, abgenommen §10)

| Phase | Inhalt | Status |
|---|---|---|
| **P0** | Aktions-Überschriften + Direktor-Hinweise | ✅ (PR #80) |
| **P1** | Aktion-aus-Dialog · Menü→Gespräch · granularere Aktionen · Sprach-Steckbriefe · NPC-Vorschläge im Gespräch (löst V2) | **in Arbeit** — ✅ P1a (Aktion aus Dialog), ✅ P1d (Steckbriefe), ✅ Declutter, ✅ P1b-Pilot (Marina-Begrüßungen), ✅ Deck nach NPC gruppiert. **Offen:** P1b auf restliche NPCs + Topics/Reactions skalieren (nach Marina-Abnahme), situative Eröffnungen; P1c granularere Aktionen (60–100, großes Content-Paket + Balancing-Sim) |
| **P2** | Kommunikations-Schlachtfeld (Ziel→Dossier→Kompromat→Verbreiter+Plattform-Mix). **Erst nach Exa-Recherche** (§10.1) | offen |
| **P3** | Gebäude-Wachstum (`unlocksRoom`/`unlocksNpc`) + 100–500-Pfade-Simulation | offen |

## 🪲 Bekannte Bugs / Altlasten

- **Avatar-Beine starr** (V7) — Schwebe-Eindruck.
- **NPC-Daten-Inkonsistenz:** Aktionen referenzieren Affinität `volkov` (= Direktor-Nachname),
  während die Tech-Rolle NPC-`alexei` ist; `igor` ist „Finanz-Analyst", macht in Aktionen aber
  Technik. Sauber zu ziehen in P1 (Steckbriefe/Affinitäten).
- **`npm run lint` defekt** — keine ESLint-Config im Repo; Gate stützt sich auf tsc/build/vitest.
- **Pixel-Font** blockiert (Netz-Policy) — `font-mono`-Reste bis lizenzfreie Datei vorliegt.

## 🛠️ Werkzeuge

- **Browser-Smoke:** `npm run smoke` (baut nicht; setzt laufenden `vite preview --port 4173` voraus)
  bzw. `scripts/app-smoke.mjs` (Playwright-core, Chromium im Container). Screenshots → `runs/app-smoke/`.
- **Daten-Skripte:** `scripts/add-headlines.mjs` (headline_de-Provenienz, idempotent).
