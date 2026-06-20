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
- **Gate:** `tsc 0` · `vitest 456` · `build` grün.

---

## 3. Gebaut, aber NOCH NICHT auf `main` (sofort landebar)
- **PR #85 — Asset-Pakete (offener Draft):** **Avatar m/w** (P2-9), **Operationszentrale**
  `room_operations` (P1-8), **Skyline Dämmerung/Nacht** (P2-12), **sitzende Audience-Figuren**
  (P2-10). Budget war freigegeben, Vision-QC erledigt. **Konfliktfrei in das aktuelle `main`
  mergebar (geprüft).** Offen nur Owner-Preview-Feinschliff (Skyline-Übergang an Bandgrenzen,
  Audience-Sitzlinien). → **Empfehlung: prüfen + mergen** (größter „done-but-not-landed"-Hebel).

---

## 4. Owner-Entscheidungen — Status (abgeglichen)
| # | Frage | Status |
|---|---|---|
| 1 | NPC-Namen (Volkov & Co.) fiktionalisieren? | ✅ **entschieden: behalten** (#84) |
| 2 | Reale Plattformnamen behalten? | ✅ **entschieden: behalten** (#84) |
| 3 | Avatar m/w-Variante? | ✅ **entschieden + gebaut** (in #85, noch nicht gemergt) |
| 5 | Sound (J34–36) gebaut? | ✅ **ja, auf main** (#81) |
| 6 | Asset-Budget freigeben? | ✅ **freigegeben** (#85 hat es genutzt) |
| — | Beats: Sieg-Achse bewegen? | ✅ **nur andere Achsen** (2026-06-20, `DECISIONS_2026-06-20_BEATS.md`) |
| 4 | Fokusgruppe: Persona-Porträts oder CSS? | 🟡 **offen** (Segmente existieren als Daten; Bild-Batch = Budget) |
| 7 | Auftrag als *harte* Sieg-Bedingung (Pacing)? | 🟡 **offen** (heute Sieg-*Qualität*; Entscheidung am besten nach Preview) |

---

## 5. Roadmap — priorisierte Phasen

### Phase A — Landen & verifizieren (kein Budget, sofort)
1. **PR #85 mergen** (konfliktfrei) → Avatar m/w, Operationszentrale, Skylines, sitzende Audience landen.
2. **Owner-Preview-Sichtprüfung** am `main`-Deploy: Beat-Texte/Tonalität · Decision-Modal +
   „★ BERATER RÄT" · #85-Assets (Skyline-Übergang, Audience-Sitzlinien) · Sound.

### Phase B — Spielqualität ohne Budget/Block (Code/Content)
- **P1-9** Auftrags-Wahl kontextualisieren (in den Direktor-Dialog ziehen / nach Tag 1).
- **P1-10** End-Report „Mögliche Spielenden": Bedingungstexte an die echten Trigger angleichen.
- **P2-17 Pacing:** garantierte erste Verteidiger-Welle (Früh-Druck; teils via Frühphasen-Nudge
  da) + eskalierende Endwelle gegen Spät-Leerlauf.
- **❓7 entscheiden** (Pacing/harte Win-Condition) — nach dem Preview-Erleben.
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
