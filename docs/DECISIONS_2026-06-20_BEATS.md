# 📋 Owner-Entscheidungen 2026-06-20 — Spine/Beats (Vertrauen-Kopplung)

**Status:** Kanonisch — destilliert aus dem Chat-Austausch dieser Session.
**Verhältnis:** Ergänzt `BAUPLAN_STORY_DIRECTOR_SPINE.md`, `BEAT_MUSTER_KATALOG.md`,
`HANDOFF_2026-06-18.md`, `SOUL.md`. Bezieht sich auf PR #87 (Spine Slice 3/4 + Schicht 3).
**Lesehilfe:** ✅ entschieden · 🧩 Konzept-/Bau-Auftrag · 💬 Rückfrage · ⚠️ Hinweis.

---

## Kern-Entscheidung: Beats und die Sieg-Achse

- **✅ Beats bewegen NUR „andere Achsen", nicht die Sieg-Achse.**
  Entscheidungs-Beats formen Gesellschaftswerte (= den Auftrag) und Spieler-Kosten
  (Risiko/Aufmerksamkeit/Budget/Moral) — **genau wie Aktionen** —, rühren aber das
  Institutionen-Vertrauen (`obj_destabilize`, den Sieg-Zähler) **nicht direkt an**.
  Damit verhalten sie sich wie die Episoden und die fein getunte Sieg-Schleife
  (Aktionen/Operationen treiben den Sieg) bleibt unangetastet.
  - **Begründung (Owner-Verständnis geklärt):** „Entkoppelt" meinte nie „losgelöst von
    Aktionen". Beats teilen *jede* Achse mit den Aktionen außer dem Sieg-Zähler — die
    Trade-off-Sprache ist dieselbe. Vorbehalten bleibt allein die Sieg-Achse, weil
    Vertrauenserosion „das Mittel" ist und der balancierte Sieg-Pfad gültig bleiben soll.
  - **Verworfene Alternative:** Beats mit Vertrauens-Richtung den Sieg-Zähler bewegen
    lassen (hätte Balance-Nachtuning + neuen Invariant gebraucht).
  - **Mechanisch gelockt:** Invariant-Test über **alle Beats × Optionen** belegt, dass
    kein Beat `obj_destabilize` bewegt (`DecisionBeatApply.test.ts`). Die
    Vertrauens-*Richtung* bleibt als Design-/Beratungs-Signal in den Daten (steuert die
    Empfehlung) und narrativ in `wirkung_de`.

## In der Session umgesetzte Aufträge (Kurz-Protokoll)

- **✅ Slice 3 — gewichteter Beat-Pool** (`pickNext` zieht gewichtet statt Top-Beat; `rng` injizierbar).
- **✅ Slice 4 — Entscheidungs-Beats als Inhalt** mit nicht-dominierten Trade-off-Optionen +
  testbarem Qualitäts-Gate (`evaluateBeatGate`) + Präsentation (`DecisionBeatModal`).
- **✅ Schicht 3 — Narrativ-Gedächtnis** (`NarrativeMemory`) → reaktiver **Bumerang** (erscheint
  erst nach gesätem Thema; Recyceln skaliert mit Inokulation, Rückschlag/Streisand).
- **✅ Nebel** (epistemisch, stochastisch: verdeckte Varianz-Spanne, Einsatz vorab fällig).
  → **Beat-Katalog vollständig (6/6).**
- **✅ Live-Berater-Hinweis** im Modal (`recommendForState` über alle drei Relativitäts-Achsen →
  „★ BERATER RÄT"-Badge). Macht „richtig ist strategie-/lage-/geschichte-relativ" sichtbar.

## Offen / als Nächstes (Empfehlung)

- 🧩 **Owner-Sichtprüfung am Preview** (`deploy-preview-87`): Stil/Tonalität der Beat-Texte,
  Modal-Auftritt nach dem Morgenbriefing, Berater-Badge.
- 🧩 Optional: Beat-Texte vertonen / Plakate/Assets zu den Beats (Asset-Budget beachten).
- 💬 PR #87 aus dem Draft-Status nehmen (ready for review), wenn die Sichtprüfung passt?
