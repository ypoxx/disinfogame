# 🎯 VISION-LOCK (ENTWURF — zur Freigabe)

> **Status:** ENTWURF · zur Abnahme durch dich
> **Aktualisiert:** 2026-05-31
> **Scope:** Gesamtes Projekt (Pro Mode + Story Mode)
> **Supersedes (nach Freigabe):** die widersprüchlichen Aussagen in `README.md`, `NPC_SYSTEM_DESIGN.md`,
> `GAME_DESIGN.md`, `ROADMAP.md`, `DEVELOPMENT_ROADMAP_2026.md` u. a.
> **Kanonisch für:** NPC-Roster · Zahlen · Zeitmodell · Sieg/Niederlage · Kunst-Richtung · Modus-Rollen · Roadmap-Hoheit

## Prinzip
Bei Widerspruch gewinnt **der laufende Code / die Daten**, nicht die Prosa. (`npcs.json` schlägt `README`.)
Jeder Punkt: **Konflikt (belegt) → Empfehlung → deine Entscheidung (offen).**
Nichts hier fasst Spiel-Code an — reine Wahrheits-Festlegung. Belege sind verifiziert (Datei:Zeile bzw. Daten-Zählung).

---

## 1. NPC-Roster
**Konflikt (verifiziert):**
- `README.md:93` → „Alex, Viktor, Lena" (3) — **„Viktor" und „Lena" existieren nirgends im Code.**
- `desinformation-network/docs/NPC_SYSTEM_DESIGN.md` → 5 NPCs, aber **falsche Nachnamen/Rollen** (Alexei „Volkov" statt **Petrov**; erfindet getrennte `volkov`- *und* `direktor`-IDs; vertauscht Igor-/Katja-Rollen).
- `src/story-mode/data/npcs.json` → **die Wahrheit** (was das Spiel lädt):

| id | Name | Rolle |
|---|---|---|
| `direktor` | Direktor Volkov | Leiter der Agentur |
| `marina` | Marina Petrova | Medien-Spezialistin |
| `alexei` | Alexei **Petrov** | Technischer Leiter |
| `katja` | Katja Orlova | Feld-Operateurin |
| `igor` | Igor Smirnov | Finanz-Analyst |

**Empfehlung:** `npcs.json` = kanonisch. README + NPC_SYSTEM_DESIGN an die Daten angleichen.
**Deine Entscheidung:** ☐ so übernehmen  ☐ Namen/Rollen ändern: ____________________

---

## 2. Zähl-Fakten (Daten = Wahrheit)
Auch nackte Zahlen driften:

| Fakt | Doc sagt | Daten sagen | Quelle |
|---|---|---:|---|
| Story-Aktionen | „108" (`README:15`) | **110** | `actions.json` + `actions_continued.json` (id-Zählung) |
| NPCs | „3" (`README:93`) | **5** | `npcs.json` |
| Gegenmaßnahmen | — | **24** | `countermeasures.json` |
| Konsequenzen | — | **24** | `consequences.json` |

**Empfehlung:** Zahlen nur noch aus Daten zitieren; README korrigieren.
**Deine Entscheidung:** ☐ ok

---

## 3. Zeitmodell
**Konflikt:** Zwei Modi, zwei Einheiten — teils widersprüchlich.
- **Pro Mode = Runden:** `GAME_DESIGN.md:17,28` → **Runde 32** Cap · `ROADMAP.md:1737` → **maxRounds 40**.
- **Story Mode = Phasen:** `phase % 24` (NPC-Krisen), Spielerreise bis ~Phase 120; narrativ überlagert als „Jahre 1–10" (`DEVELOPMENT_ROADMAP_2026`).

**Empfehlung:** Einheiten klar benennen — Story = **Phase**, Pro = **Runde**. **Einen** Pro-Cap festlegen.
**Deine Entscheidung:** Pro-Runden-Cap = ☐ 32  ☐ 40  ☐ andere: ___ · Story-Länge (Phasen) = ____

---

## 4. Sieg / Niederlage
**Konflikt (Pro Mode):**
- `GAME_DESIGN.md` → **eine** Bedingung: 75 % der Akteure < 0.40 Trust bis Runde 32; Defensiv-Sieg bei avgTrust > **0.80**.
- `ROADMAP.md:1701+` → **vier** Siegpfade (trust_collapse, media_capture, expert_corruption, infrastructure_dominance); Defensiv-Sieg avgTrust > **0.70** + 3 Defensiv-Akteure; maxRounds 40.
- **Story Mode:** **8 Ending-Kategorien** (`README:96`) — eigenes, narratives Framework.

**Empfehlung:** Pro-Modell entscheiden: **(A) ein** klarer Pfad (einfacher, = ausgelieferter Code) oder **(B) vier** Pfade (reicher, = neueres Design). Story = 8 Endings bestätigen.
**Deine Entscheidung:** Pro-Sieg = ☐ A (einzel)  ☐ B (4 Pfade) · Defensiv-Schwelle = ☐ 0.80  ☐ 0.70

---

## 5. Kunst-Richtung  ←  *hier liegt deine Avatar-Frage*
**Konflikt (verifiziert):**
- **Pro Mode** → „**Infographic Aesthetic**" (`CLAUDE.md`, `VISUAL_STYLE_GUIDE.md`): Datenvisualisierung, Trust-Farbskala. Kein Brutalismus/Pixel.
- **Story Mode — ZWEI unversöhnte Visionen im selben Repo:**
  - **(A) Aktuell umgesetzt** (`src/story-mode/README.md`): **isometrischer brutalistischer KI-Hintergrund + klickbare Hotspots**. Explizit „no 3D needed", ein statisches Bild → **kein Avatar, kein Pixel-Art**.
  - **(B) `BUILDING_CONCEPT.md`**: **Pixel-Art 16-bit, mehrstöckiges Gebäude, animierte Lauf-Figur (Sprite-Sheet)** + `sprite-tool/game-style-guide.md`.

Das ist **exakt** unsere Diskussion — *Option 1 (klickbar) vs. Avatar* — und sie liegt bereits als Widerspruch im Code.

**Empfehlung (deckt sich mit unserem Gespräch):**
- **Pro = Infographic** behalten (bewusst eigener Modus-Look, klar dokumentiert).
- **Story-Basis = (A)** klickbarer Querschnitt / Hotspots **jetzt**.
- **(B) Pixel-Avatar = spätere, optionale Schicht**, datengetrieben angedockt; **einzige echte Abhängigkeit = ein konsistenter Lauf-Zyklus** (Sprite-Tool-Job oder 2-Frame-Bob). Kein Engine-Umbau.

**Deine Entscheidung:** ☐ so (A jetzt, B später)  ☐ B sofort  ☐ anders: ____________________

---

## 6. Pro Mode — Status & Rolle
**Status (verifiziert):** `README` → „~80 % funktional"; Story → „~75 %". `AUDIT_REPORT_2025-12-29.md` listet offene Pro-Mode-Bugs. **Rolle unklar:** README behandelt Pro und Story als gleichwertig.

**Empfehlung:** Rolle festnageln — **(A)** Pro als **sekundären „Sandbox/Experten-Modus"** klar untergeordnet, **oder (B)** Pro nach `archive/pro-mode/` mit eigener Spezifikation auslagern, damit Story Mode der fokussierte Hauptpfad ist. *(Wir hatten B angedacht.)*
**Deine Entscheidung:** ☐ A (sekundär behalten)  ☐ B (archivieren mit Spec)  ☐ gleichwertig lassen

---

## 7. EINE Roadmap-Hoheit
**Konflikt:** Konkurrierende, teils widersprüchliche Pläne (alle im Repo verifiziert):
`ROADMAP.md` · `DEVELOPMENT_ROADMAP_2026.md` · `docs/PLATINUM_ROADMAP.md` · `STORY_MODE_UX_IMPLEMENTATION_PLAN.md` · `UI_UX_REDESIGN_PLAN.md` · `GAME_REDESIGN.md` · `CLAUDE_PROMPT_UI_REDESIGN.md` · `AUDIT_REPORT_2025-12-29.md`.

**Empfehlung:** **Eine** kanonische `ROADMAP.md` (frisch, supersedes alle). Rest nach `archive/docs/` mit Status-Header verschieben — **nichts löschen**.
**Deine Entscheidung:** ☐ ok  ☐ andere Struktur: ____________________

---

## 8. Doc-Metadaten-Standard (sofort, für alle Docs)
Jedes Top-Level-Dokument bekommt diesen Kopf:

```
**Status:** Aktiv | Referenz | Archiviert
**Aktualisiert:** YYYY-MM-DD
**Scope:** Pro | Story | Beide | Meta
**Supersedes / Superseded-By:** …
**Kanonisch für:** …
```

**Deine Entscheidung:** ☐ ok

---

## Nach deiner Abnahme mache ich (reine Doku, kein Spiel-Code):
1. `npcs.json`-Roster + korrigierte Zahlen in `README` & `NPC_SYSTEM_DESIGN` schreiben.
2. Zeit-/Sieg-/Kunst-Entscheidungen als kanonische Header in die jeweiligen Docs eintragen.
3. `archive/docs/` (+ ggf. `archive/pro-mode/`) anlegen, Alt-Docs mit Header verschieben.
4. Eine kanonische `ROADMAP.md` aufsetzen.
5. Diese Datei zu `docs/VISION_LOCK.md` (Status: Aktiv) promoten.

**Offene Kern-Entscheidungen (nur du):** §3 Pro-Cap · §4 Sieg-Modell · §5 Kunst-Pfad · §6 Pro-Mode-Rolle.
Den Rest setze ich nach deinem „ok" direkt um.
