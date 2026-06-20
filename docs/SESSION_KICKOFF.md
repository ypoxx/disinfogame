# 🚀 Session-Kickoff — Merkkarte (für jede neue Session)

**Diese Datei der neuen Session zeigen.** Sie ist bewusst kurz und bleibt gültig.

## Lese-Reihenfolge (immer)
1. `SOUL.md` — Vision + Arbeitsvertrag
2. `docs/STATUS.md` — aktueller Bau-Stand
3. **Das neueste `docs/HANDOFF_*.md`** — Stand, offene PR, Next-Steps (schnellster Einstieg)
4. Bei Bedarf: `docs/GESAMTPLAN_2026-06-20.md` (Voll-Plan) · `docs/ORCHESTRATION_FEEDBACK.md` (Lessons)

## Eiserne Regeln
- **Branch:** nur auf `claude/gracious-keller-g43bu3` arbeiten/pushen (oder neuen mit Owner klären).
- **Gate vor jedem Push (Pflicht):** in `desinformation-network/` → `npm ci` (frischer Container) →
  `npx tsc --noEmit` + `npx vitest run` + `npm run build` müssen grün sein.
- **Assets** nur mit Kostenansage generieren; **Vision-QC ist Pflicht** (Kopf-Crop-Falle!).
- **Balance/Pacing** mit Vorher/Nachher-Simulation belegen, nie an einer Sieg-Quote.
- **Einfache Sprache zum Owner** (Fachbegriff nur in Klammern).

## Copy-Paste-Befehl für die neue Session
> Lies `SOUL.md`, `docs/STATUS.md` und das neueste `docs/HANDOFF_*.md`. Arbeite auf Branch
> `claude/gracious-keller-g43bu3`; halte das Gate (`tsc` + `vitest` + `build`) vor jedem Push grün.
> Dann mach weiter mit: **[DEIN WUNSCH]**

_Für **[DEIN WUNSCH]** z. B.: „PR #89 mergen" · „Phase C: Sofa-Sitzlinie/Diegetik" ·
„Spine-Feinschliff: DayReport-Vorgriff" · „Pacing nachjustieren"._
