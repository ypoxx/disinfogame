# 🗺️ Gesamtplan — Operation Westunion (Stand 2026-06-20)

**Zweck:** EIN konsolidierter, aktueller Voll-Plan. Gleicht `TODO_2026-06-15_CENTRAL.md`
(Stand vor #84–#87) gegen den realen Code auf `main` + die getroffenen Owner-Entscheidungen
ab und schneidet daraus eine priorisierte Roadmap. **Lese-Reihenfolge:** `SOUL.md` (Vision +
Arbeitsvertrag) → `STATUS.md` (Bau-Stand) → **dieses Dokument** (Was als Nächstes).

> **Verifikationsbasis:** Code-Stand `main` @ `b7a4ea6` (nach #87). Owner-Entscheidungen aus
> #84-Notizen + Chat 2026-06-20. PR-Stände per GitHub geprüft.

---

## 1. Vision (aus SOUL, ein Satz)
Bildungs-Aufbauspiel im Geist von MadTV/TVTower — Arbeitsalltag in einem fiktiven
**Desinformationsministerium** (Westunion/Gallia, keine realen Staatssymbole). Spielbar,
spannend, niedrigschwellig; Bildung entsteht durchs Ganze (v. a. End-Report), Pixel-Art aus
einem Guss.

---

## 2. Ist-Stand auf `main` (verifiziert „steht")
- **Einstieg & Gebäude (Strang 1/2):** Title → Ankunft → Direktor → freies Spiel; diegetische
  Bedienung (Narrativ-Tafel, Etagen-Tableau, Lagebild, HUD auf Knopfdruck), Tag/Nacht +
  Jahreszeiten, ein PixelFrame-System.
- **Aktionen & Dialoge (Strang 3/4 P0–P2):** 143 Aktionen mit `headline_de`, Aktion-aus-Dialog,
  NPC-Stimmen/Steckbriefe, P2-Schlachtfeld-Kette (Verbreiter/Kompromat/Enttarnung).
- **Herzstück (P0→P7):** Episoden + Korkbrett · Gesellschaftswerte (4 sichtbar) · **Aufträge
  Keil/Wahl/Zweifel** als Sieg-*Qualität* (`auftragMissionVerdict`) · Vernetzung (Umfragen-News,
  erzählerische Gegenseite, Fokusgruppe) · Ethik-Geländer + Umgebungshumor.
- **Bildungs-Kern:** `disinfo_methods.json` (18 Muster) + Atlas → End-Report („reale Methoden +
  Gegenmittel") + **Methoden-Dossier (Taste I)** + verpflichtendes Debrief.
- **Konsequenzen & Fail-States:** „Apparat zerfällt" + „Mittellos" live; gewinn- UND verlierbar
  (Sim/Invariant belegt).
- **Sound:** adaptive Musik + Ducking + Raum-Ambience (`soundDirector`) — **ist auf main**.
- **Story-Director-Spine (#86/#87):** gewichteter Beat-Pool · **Entscheidungs-Beats 6/6**
  (Stadtrat · Reale Vorlage · Schwelbrand · Loyalitätsprobe · Nebel · Bumerang) · Narrativ-
  Gedächtnis (Schicht 3) · Live-Berater-Badge. Beats **balance-neutral auf der Sieg-Achse**.
- **Pacing „spürbar härter" (P2-17, Session 2026-06-20, PR #89):** zwei Gegenwehr-Wellen
  (garantierte erste bei Phase 6 · spät eskalierender Gegendruck nach 3,5-Jahre-Schonzeit).
  Nur Risiko/Aufmerksamkeit (R2: Sieg-Achse tabu). **Mit Balance-Sim belegt.**
- **Gate:** `tsc 0` · `vitest 473` · `build` grün.

---

## 3. ✅ Gelandet seit der ersten Plan-Fassung (PR #88 → `main`)
- **PR #85 ist integriert gemergt** (war viel größer als sein Titel): **Assets** (Avatar m/w,
  Operationszentrale, Skyline Dämmerung/Nacht, sitzende Audience) · **Pixel-Weltschrift VT323**
  (+ Press Start 2P / Silkscreen, P1-6) · **Fokusgruppe-PreTest-Feature** · **P1-8/9/10**.
  Eine Spine-Kollision (`auftragChosen`→`showAuftrag`) aufgelöst; verlustfrei kontrolliert.
- **Visuelle Korrekturen (Session 2026-06-20, nach Owner-Screenshots):**
  - **Font zu klein** vs. alte Monospace → VT323 `@font-face size-adjust: 132%` (global größer,
    ohne px-Werte zu ändern).
  - **Blauer Web-Fokus-Ring** (der „Rand" um eine Sofa-Figur) → entfernt; Button-Fokus jetzt
    pixel-konform (amber, nur `:focus-visible`; Maus-Klick zeigt keinen Ring mehr).
  - **Sofa-Publikum zu klein** → repräsentative 4 statt 5, `scale 1.35→2.2`. (Exakte Sitzlinie
    am Preview feinjustierbar.)
  - **Flaky-Test** `DecisionBeatFlow` (hing an `Date.now`-Krisen-Seed) deterministisch gemacht.
- **⚠️ Offen — `audience_bohemien` ist „kopflos"** (echter Generierungs-Mangel, der wiederkehrende
  Kopf-Crop): **eine** Figur muss neu generiert werden (Pixel-Asset-Pipeline; `GEMINI_API_KEY`
  vorhanden; minimaler Budget; Kostenansage). Die anderen 7 Figuren sind ok.
- **⚠️ Offen — #85-Preview-Feinschliff:** Skyline-Übergang an Bandgrenzen · Audience-Sitzlinien-
  Pixelausrichtung (vom #85-Autor selbst notiert).

---

## 4. Owner-Entscheidungen — Status (abgeglichen)
| # | Frage | Status |
|---|---|---|
| 1 | NPC-Namen (Volkov & Co.) fiktionalisieren? | ✅ **entschieden: behalten** (#84) |
| 2 | Reale Plattformnamen behalten? | ✅ **entschieden: behalten** (#84) |
| 3 | Avatar m/w-Variante? | ✅ **entschieden + gebaut + gemergt** (#85→#88) |
| 5 | Sound (J34–36) gebaut? | ✅ **ja, auf main** (#81) |
| 6 | Asset-Budget freigeben? | ✅ **freigegeben** (#85 hat es genutzt) |
| — | Beats: Sieg-Achse bewegen? | ✅ **nur andere Achsen** (2026-06-20, `DECISIONS_2026-06-20_BEATS.md`) |
| 7 | Pacing-Intensität? | ✅ **„spürbar härter" gewählt** (2026-06-20) → P2-17 gebaut (späte Eskalation, sim-belegt) |
| 4 | Fokusgruppe: Persona-Porträts oder CSS? | 🟡 **offen** (Segmente existieren als Daten; Bild-Batch = Budget) |
| — | Auftrag als *harte* Sieg-Bedingung? | 🟡 **offen** (heute Sieg-*Qualität*; Pacing-Druck deckt den Spannungs-Bedarf erstmal ab) |

---

## 5. Roadmap — priorisierte Phasen

### Phase A — Landen & verifizieren ✅ größtenteils erledigt
1. ✅ **PR #85 gelandet** (integriert, PR #88). 2. ✅ **Sichtbare Owner-Mängel gefixt** (Font-Größe,
   Fokus-Ring, Publikums-Skala). **Offen:** `audience_bohemien` neu generieren · Owner-Sichtprüfung
   am `main`-Deploy (Font-Größe jetzt ok? · Publikum-Skala/Sitzlinie · Beat-Texte/Modal/Badge).

### Phase B — Spielqualität ohne Budget/Block (Code/Content) ← **AKTUELL**
- ✅ **P1-9** (Auftrags-Wahl im Direktor-Dialog) + ✅ **P1-10** (End-Report-Bedingungstexte) — via #85 erledigt.
- ✅ **P2-17 Pacing „spürbar härter" (PR #89):** garantierte erste Gegenwehr-Welle (Phase 6) +
  spät eskalierender Gegendruck (`oppositionPressure`, nach 3,5-Jahre-Schonzeit) gegen Spät-Leerlauf.
  **Balance-Sim belegt:** „Zeit abgelaufen"-Fizzle entfällt komplett; vorsichtiges/passives Spiel
  (vorher 100 % enttarnungs-sicher, nur Timeout) **kann jetzt auffliegen** (max. Risiko ~3 → ~85+);
  gewinn- UND verlierbar bleibt (16 S / 20 N über 36 Partien). Regressionstest `Pacing.test.ts` +
  `BalanceInvariant` grün (R2 gehalten). ❓7 ist damit als „spürbar härter" entschieden.
- **Spine-Feinschliff:** DayReport-Vorgriff („Marina kündigt morgen an"); Lage-Berater-Heuristik
  für Loyalitätsprobe/Nebel verfeinern.

### Phase C — Diegetik & visuelle Politur (Preview-getrieben)
- **P2-2/3/4** Seitenleiste/Broadcast/ComboHints/Büro-Hotspots diegetisch auflösen.
- **P2-7** Entkachelungs-Reste; **P2-8** Wohnzimmer-Sitzlinie; **P2-18** Strang-5-Flavor-Dialoge.

### Phase D — Inhalts-/Bildungstiefe (Content, optional Budget)
- **Topic-Vertonung** (P2-16) + **Beat-Texte vertonen** — ElevenLabs-Batch mit Kostenansage.
- **Fokusgruppe-Persona-Porträts** (❓4) ODER CSS akzeptieren.
- **Beat-Backlog (Katalog Teil D):** Sleeper-Asset (Zukunft) · Allianz/Kontrollverlust ·
  False-Flag/Attribution · Ziel-Pivot (Meta) — nach Lust, je einer mit Gate.

### Phase E — Schulden & Aufräumen (P3)
- Asset-Waisen verbinden/archivieren · `npcs.json` Inline-Fallback-Dialoge (Umlaute + Stimme) ·
  `TutorialOverlay`-Inhalt aktualisieren · Save/Load sichert `DialogLoader`-Zustand · Doku-Hygiene.

### 🔒 Extern blockiert
- **Pixel-Font** (Netz-Policy 403 → Owner-Upload nach `public/fonts/`) blockiert die vollständige
  Ablösung der `monospace`-Weltschrift (P1-6; noch ~21 Dateien). · `npm run lint` ohne ESLint-Config.

---

## 6. Arbeitskontrakt (kurz, aus SOUL)
Gate (`tsc`+`vitest`+`build`) grün vor jedem Push · Vision-QC für generierte Assets ·
Balance-Änderungen mit Sim/Invariant belegen · einfache Sprache zum Owner · STATUS/DECISIONS/
ORCHESTRATION_FEEDBACK je Session pflegen · kein Asset-Spend ohne Kostenansage.

---

## 7. Empfehlung „nächstes Paket"
**Sofort:** PR #85 prüfen + mergen, dann Owner-Preview-Sichtprüfung. **Danach Phase B**
(P1-9 · P1-10 · P2-17 Pacing) — alles ohne Budget/Block, hoher Spürbarkeits-Hebel. ❓7
(harte Win-Condition) erst nach dem Preview entscheiden.
