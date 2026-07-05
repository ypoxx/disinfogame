# 🤝 Handoff: Etappe 5 „Fertig" (der Versionssprung) — Kickoff für die nächste Session

**Stand:** 2026-07-05, Ende der Etappe-4-Session · **Basis:** Branch `claude/etappe-4-startup-ad97om` (Draft-PR gegen `main`; Etappen 0–4 ✅)
**Lies zuerst:** `SOUL.md` → `STATUS.md` (Etappe-4-Block) → `ZIELBILD_2026-07-04_WETTRENNEN.md` (§12/§13 Etappe 5)
→ dieses Dokument. **Container-Falle zuerst:** `cd desinformation-network && npm ci`.

---

## 1. Wo wir stehen (3 Sätze)

Beide Rennläufer leben und das Immunsystem hat sein Gedächtnis: Abstumpfung + Impfung je
(Milieu × Familie) wirken mechanisch (`MaschenGedaechtnis.ts`), sichtbar als FRISCH/BEKANNT/
VERBRANNT-Stempel VOR dem Ausgeben, quittiert mit Ursache/Tag/Gegenmaßnahme (E5), Prebunking >
Debunking mit medienferner Lücke. Sim-Gate 8× flakefrei (Aggregat ~38–41/72; greedy 14–16/24;
random gewinnt durch natürliche Rotation; low_risk 0–2: reine Passivität verliert jetzt
mechanisch, §3d). Save-Format 2.2.0.

## 2. Ziel der Etappe (Zielbild §13, Etappe 5 = Versionssprung)

**Aktions-Kuratierung abschließen** (143 → ~60–80; JEDE Aktion bewegt sichtbar einen der zwei
Läufer — größte Arbeitsmenge, §12.7) · **Geld-Tranchen** (E18: Zentrale zahlt nach Fortschritt,
Pleite = Würgeschlinge) · **Wahlabend-Szenen** (ein TV-Set, drei Enden, §9) · **TV-Baukasten**
(E17: Sprecherin/Umfrage-Ticker/Faktencheck/Wahlstudio tragen 80 %) · **Endreport-Ausbau**
(Kurven beider Läufer, Maschen-Bilanz) · **Tag-0-Hoax als Zwei-Balken-Tutorial** (O7) ·
**Kurator-Rename** (Volkov, O6; vorher Audio-/Text-Audit) · `AuftragSelect`-UI raus ·
`WIN_THRESHOLD` → 1.0 mit der Kuratierung · Enden-Beschnitt (escape/moral_redemption →
Epilog-Färbungen) · HUD-Konsolidierung (Risiko raus, §12.4).

## 3. Offene Carry-forwards aus Etappe 4 (zuerst einsammeln)

1. **greedy an die Korridor-Mitte** (aktuell 14–16/24 ≈ 60 %, obere Kante des 30–60-Korridors)
   und **„jeder Verlustweg ≥ 15 %"** — beides über die Aktions-Kuratierung lösen, NICHT über
   weitere ImmuneSystem-Dreherei (die Konstanten sind 8×-flakefrei kalibriert).
2. **Wohnzimmer-Alphabet-Assets**: aktuell CSS-/Text-Badges; Asset-Batch (5 Bilder: Küchen-Streit,
   einsam am Videospiel, Abwinken vor TV, Parteifahne, Faktencheck-Zeitung) via
   `pixel-asset-pipeline` mit Budget-Ansage an den Owner.
3. **Sim-Referenz „rotierend"** optional als vierte geloggte Strategie (Handoff-E4-Vorschlag).
4. Episoden/Beats auf 40-Tage-Taktung kuratieren + EndReport-Charts von der Jahres-Achse holen
   (Etappe-2-Carry-forward, passt zur Endreport-Arbeit).

## 4. Neue Andockpunkte (Etappe 4 hat sie gebaut)

- **`engine/MaschenGedaechtnis.ts`** (pur): Matrix, Stempel, Impfung, Ziel-Milieu-Ableitung
  (`zielMilieusFuerTags` — Tag→Kanal/Themen-Tabellen leben jetzt HIER; broadcastMapping
  importiert sie). Kuratierungs-Werkzeug: `familienEinsaetze` + Stempel zeigen, welche
  Familien der Draw übersättigt.
- **Adapter-Getter:** `getMaschenVorschau(actionId)` (Stempel je Ziel-Milieu),
  `getWohnzimmerAlphabet()`, `ActionResult.maschenQuittung` (E5-Text).
- **Für Geld-Tranchen:** `auftragProgress` (VictorySystem) ist die Fortschritts-Quelle;
  Budget-Regen heute +5/Phase passiv (genau das soll E18 ersetzen).

## 5. Bekannte Fallen (Etappe 0–4, kumulativ — Zeit sparen!)

1. `npm ci` zuerst (Toolchain-Drift).
2. Sim-Gate nach JEDER Mechanik-Änderung; Band-Änderungen 8× flakefrei; `winnable-and-losable`
   UND `balance-sim-p2` IMMER zusammen messen (Lehre 3/8/9).
3. Adapter-Monolith: parallele Agenten NIE gleichzeitig an `StoryEngineAdapter.ts`.
4. Keine doppelte Buchhaltung: Abstumpfung wirkt auf die WIRKUNG; Abwehr-Lärm und
   Enttarnungs-Melder teilen sich die Risiko-Kost (`RISK_COST_TO_METER`); der „Gepatcht"-Sprung
   ist bewusst 3 (Patch stempelt zusätzlich überall BEKANNT).
5. `createStoryEngine()` resettet ALLE Singletons — Test-Mocks NACH Engine-Erzeugung.
6. Verfalls-Konstante und Stufen-Schwellen des Gedächtnisses sind gekoppelt
   (Schwelle VERBRANNT = 2−2·Verfall; Unit-Test pinnt die Treppe — Lehre 14).
7. Save: additiv + Default-Merge; Semantik-Bruch → Version bumpen (2.2.0-Migration als Muster:
   Marker ist das Feld `maschenGedaechtnis`, alte `methodFamilyUseCounts` wird übernommen).
8. Bei Kuratierung: `IdValidator` + `BalanceInvariant` + beide Sim-Gates laufen lassen —
   Aktions-Löschungen brechen sonst still Episoden-Refs (`wirkt_auf`, `strang_aktionen`).

## 6. Definition of Done (Etappe 5 — Auszug Zielbild §13)

Kuratierter Katalog (jede Aktion bewegt einen Läufer sichtbar), Geld-Tranchen statt
Passiv-Regen, drei Wahlabend-Enden im einen TV-Set, Endreport mit Läufer-Kurven,
Tutorial-Update, Kurator-Rename; `tsc 0 · vitest · build` grün; Sim-Gate-Bänder halten
(inkl. „jeder Verlustweg ≥ 15 %" scharf); STATUS + Zielbild §13 aktualisiert; Draft-PR.

## 7. Kickoff-Prompt für die neue Session (Vorschlag)

> „Lies SOUL.md → STATUS.md → ZIELBILD_2026-07-04_WETTRENNEN.md → HANDOFF_2026-07-05_ETAPPE5.md
> und starte Etappe 5 nach dem dortigen Arbeitsplan."
