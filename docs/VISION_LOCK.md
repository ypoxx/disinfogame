# 🎯 VISION-LOCK (kanonisch)

> **Status:** Aktiv — **kanonische Projektwahrheit**
> **Aktualisiert:** 2026-05-31
> **Scope:** Gesamtes Projekt (Pro Mode + Story Mode)
> **Supersedes:** widersprüchliche Aussagen in `README.md`, `NPC_SYSTEM_DESIGN.md`, `GAME_DESIGN.md`,
> `ROADMAP.md`, `DEVELOPMENT_ROADMAP_2026.md` u. a.
> **Kanonisch für:** NPC-Roster · Zahlen · Zeitmodell · Sieg/Niederlage · Kunst-Richtung · Modus-Rollen · Roadmap-Hoheit

## Prinzip
Bei Widerspruch gewinnt **der laufende Code / die Daten**, nicht die Prosa. (`npcs.json` schlägt `README`.)
Belege sind verifiziert (Datei:Zeile bzw. Daten-Zählung). Entscheidungen wurden am 2026-05-31 getroffen.

---

## 1. NPC-Roster  ✅ entschieden
**Kanonisch = `src/story-mode/data/npcs.json`** (das, was das Spiel lädt):

| id | Name | Rolle |
|---|---|---|
| `direktor` | Direktor Volkov | Leiter der Agentur |
| `marina` | Marina Petrova | Medien-Spezialistin |
| `alexei` | Alexei **Petrov** | Technischer Leiter |
| `katja` | Katja Orlova | Feld-Operateurin |
| `igor` | Igor Smirnov | Finanz-Analyst |

**Bekannte Fehler (zu korrigieren):** `README.md:93` nennt „Alex, Viktor, Lena" (Viktor/Lena existieren nicht).
`NPC_SYSTEM_DESIGN.md` gibt Alexei den falschen Nachnamen („Volkov" statt **Petrov**) und erfindet eine
getrennte `volkov`-Reaktion (es gibt kein `volkov`-NPC; der Direktor hat die id `direktor`, Nachname Volkov;
die zynische „Chaos"-Stimme gehört zu `alexei`).

---

## 2. Zähl-Fakten  ✅ entschieden — Daten = Wahrheit

| Fakt | Doc sagt | **Kanonisch (Daten)** | Quelle |
|---|---|---:|---|
| Story-Aktionen | „108" (`README:15`) | **110** | `actions.json` + `actions_continued.json` |
| NPCs | „3" (`README:93`) | **5** | `npcs.json` |
| Gegenmaßnahmen | — | **24** | `countermeasures.json` |
| Konsequenzen | — | **24** | `consequences.json` |

Zahlen künftig nur aus Daten zitieren.

---

## 3. Zeitmodell  ✅ entschieden
- **Story Mode = „Phase"** (narrativ überlagert als „Jahre 1–10").
- **Pro Mode = „Runde".**
- **Pro-Runden-Cap: eingefroren, nicht jetzt entschieden** (Code-Drift: `GAME_DESIGN.md` → 32, `ROADMAP.md` → 40).
  Auflösung **vertagt** zusammen mit der Pro-Mode-Archivierung (§6). Bis dahin gilt der laufende Code als Stand.

---

## 4. Sieg / Niederlage  ✅ entschieden
- **Story Mode = 8 Ending-Kategorien** (`README:96`) — kanonisches, narratives Framework.
- **Pro Mode = eingefroren/vertagt.** Der Konflikt (1 vs. 4 Siegpfade; Runde 32 vs. 40; Defensiv-Sieg 0.80 vs. 0.70)
  wird **nicht jetzt** gebalanced, sondern mit der Archivierung (§6) als Code-Stand eingefroren und dokumentiert.

---

## 5. Kunst-Richtung  ✅ entschieden  *(= die Avatar-Frage)*
- **Pro Mode = „Infographic Aesthetic"** (`CLAUDE.md`, `VISUAL_STYLE_GUIDE.md`) — bewusst eigener Modus-Look.
- **Story Mode:**
  - **Basis JETZT = (A)** klickbarer brutalistischer Querschnitt / Hotspots auf KI-Hintergrund
    (`src/story-mode/README.md` — läuft bereits, „no 3D needed").
  - **(B) Pixel-Avatar / mehrstöckiges Gebäude** (`BUILDING_CONCEPT.md`) = **spätere, optionale Schicht**,
    datengetrieben angedockt. **Einzige echte Abhängigkeit = ein konsistenter Lauf-Zyklus** (Sprite-Tool-Asset
    oder 2-Frame-Bob). Kein Engine-Umbau, kein PixiJS, kein Pathfinding nötig.

---

## 6. Pro Mode — Rolle  ✅ entschieden: **archivieren mit Spec**
- **Story Mode = fokussierter Hauptpfad.**
- **Pro Mode** wird nach `archive/pro-mode/` mit eigener Spezifikation ausgelagert (Status ~80 %, bekannte Bugs).
- **✅ ERLEDIGT (2026-05-31): Code-Extraktion durchgeführt.** Pro-Mode-UI, -Engine und -Backend liegen jetzt
  unter `archive/pro-mode/` (`code/` + `backend/`). Die App (`App.tsx`) startet direkt Story Mode; Typecheck,
  88 Unit-Tests und Produktions-Build sind grün. Geteilt **in-tree** bleiben nur Engine-Dateien, die Story
  tatsächlich nutzt (`actor-ai`, `NarrativeGenerator`, `combo-system`) sowie gemeinsame Typen/Utils.

---

## 7. Roadmap-Hoheit  ✅ entschieden
- **Eine** kanonische `ROADMAP.md` (frisch, supersedes alle anderen).
- Konkurrierende Pläne → `archive/docs/` mit Status-Header verschieben — **nichts löschen**:
  `DEVELOPMENT_ROADMAP_2026.md` · `docs/PLATINUM_ROADMAP.md` · `STORY_MODE_UX_IMPLEMENTATION_PLAN.md` ·
  `UI_UX_REDESIGN_PLAN.md` · `GAME_REDESIGN.md` · `CLAUDE_PROMPT_UI_REDESIGN.md` ·
  `PR_DESCRIPTION.md` · `PR_FIX_DESCRIPTION.md` · (alte) `ROADMAP.md`.
  `AUDIT_REPORT_2025-12-29.md` bleibt als datierte Referenz.

---

## 8. Doc-Metadaten-Standard  ✅ entschieden
Jedes Top-Level-Dokument bekommt den Kopf:

```
**Status:** Aktiv | Referenz | Archiviert
**Aktualisiert:** YYYY-MM-DD
**Scope:** Pro | Story | Beide | Meta
**Supersedes / Superseded-By:** …
**Kanonisch für:** …
```

---

## Umsetzungs-Status

**Schritt 1 — Wahrheits-Angleichung (dieser Stand):**
- [x] Vision-Lock kanonisch (diese Datei)
- [x] `README.md`: Roster + Zahlen + Modus-Rollen korrigiert
- [x] `NPC_SYSTEM_DESIGN.md`: Roster-Korrektur-Box + Nachname-Fix

**Schritt 2 — Konsolidierung (als Nächstes):**
- [ ] `archive/docs/` anlegen, Alt-Pläne mit Header verschieben
- [ ] frische kanonische `ROADMAP.md` (Story-first, Pro eingefroren, Kunst A→B, Fundament-first)
- [ ] `archive/pro-mode/SPEC.md` (eingefrorene Pro-Spezifikation, inkl. 32-vs-40-Notiz)

**Offen (für später, mit dir):** Story-Länge in Phasen (§3) · Pro-Code-Extraktion (§6) · Avatar-Asset-Route (§5).
