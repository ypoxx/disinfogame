# 🔍 Gnadenloses Review nach den großen Updates (PR #77–#83) — Plan

**Stand:** 2026-06-15 · **Branch:** `claude/eager-curie-2m5kej`
**Anlass:** Die letzten ~5 PRs (#77 Visual-Rework v2 · #78 Diegese · #79/#80 Strang 3+4 ·
#81 P2+Visual-Politur · #82 Loop schließen · #83 Herzstück) haben das Spiel konzeptionell
und visuell stark vorangebracht. Ziel dieses Reviews: aus den großen Updates ein
**hervorragendes, kohärentes Paket** machen — ungeschönt (SOUL §4 „Ehrlichkeit").

> Methode: orchestrierte Agenten mit **disjunktem Datei-Scope**, jede mit harter
> Abschluss-Klausel (SOUL §4). Synthese zentral. Webrecherche dort, wo moderne
> Best-Practice die Empfehlung schärft.

---

## Gruppe A — Visuelle Kohärenz & Asset-Pipeline (4 Reviews)

**Maßstab:** `docs/GESAMTKONZEPT_VISUELL.md` (die „Verfassung", v.a. §4.4 Drei-Schichten-Regel
+ §4.6 Verbotsliste) · `docs/REWORK_PLAN_2026-06-13_STIL_BIBEL.md` · Asset-Konventionen aus
`AssetRegistry.ts`/`shotlist.mjs`. Leitprinzip SOUL §1: *visuelle Kohärenz ist das Erste,
was Nutzer beurteilen.*

| ID | Frage | Scope | Artefakt |
|---|---|---|---|
| **A1** | Sind ALLE Legacy-Grafiken (CSS & Co.) ins neue visuelle Konzept umgewandelt? | Alle gemounteten Komponenten + `index.css` gegen Verbotsliste (Emoji, CSS-Gradients, CSS-Gesichter/Möbel, runde Web-Buttons, Brutalismus-Schatten, `font-mono`, Foto-Interieurs, krumme Skalierung). Primitiven-Nutzung (`PixelFrame`/`PixelModal`/`Icon`). | Pro-Komponente-Verdikt (umgewandelt/teilweise/legacy) mit `file:line` + Grep-Zählungen |
| **A2** | Welche **neuen** Elemente (Seiten/Features/Konzepte) nutzen noch das alte Konzept, sind **nicht** im neuen Stil **und nicht in der visuellen Bibliothek** (Shotlist) angelegt? | Neue Views/Panels aus #77–#83 × `shotlist.mjs` (geplante Assets) × `assets.json` (vorhandene). | Tabelle: Element → rendert-mit → Asset nötig? → in Shotlist? → in assets.json? → Aktion |
| **A3** | Wo sind Assets **erstellt & angelegt**, tauchen aber **nicht im Spiel** auf (nicht verbunden)? | Echte Connect-Map über alle `image`/`sheet`-ids; Template-Referenzen korrekt auflösen (`portrait_${id}`, `npc_half_${id}`, `room_${id}`, `figure_${id}`, `prop_*` via Deko-Daten). Dateien⇄Manifest-Abgleich. | Liste echter Waisen + Grund; Datei/Manifest-Diskrepanzen |
| **A4** | Welche Asset-Erstellungen (Neu-Version/Debugging) sind **zurückgestellt**? | Alle Docs + Commit-Messages nach *zurückgestellt/offen/später/Budget/Neu-Gen/Bug/kaputt/Preview*. | Dedupliziertes, kategorisiertes Roh-TODO mit Quelle/Prio/Kostenklasse |

**Synthese A →** `docs/REVIEW_2026-06-15_VISUAL_ASSETS.md` + Beitrag zur zentralen TODO.

---

## Gruppe B — Spielstruktur (4 Perspektiven)

| ID | Frage | Scope | Linse |
|---|---|---|---|
| **B1** | Genügend **und massiv viele unterschiedliche** Wege zu gewinnen/verlieren, in allen Phasen spannend, mit Wiederspielwert? | `EndingSystem.ts`, Aufträge, `episodes.json`, `targets.json`, `world-events.json`, P3-Phänomene, `SocietyDynamics`, Balance-Sims; Sieg = obj_destabilize/Auftrags-Signaturen. | Game-Design + Webrecherche (Roguelite-Varianz, Multiple-Endings, FTL/Frostpunk/Papers-Please-Failure) |
| **B2** | Sind die erzählerischen Stränge durchweg hochwertig: stilistisch, nahbar, verständlich, fassbar, abwechslungsreich? | `dialogues.json`, `topics_dialogues.json`, `NPC_VOICE_PROFILES.md`, Episoden-Texte, `headline_de` (alle actions_*), Day/End-Report, `world-events.json`, Poll/Gegenseite-Texte. | Editorial/Writing + Webrecherche (Game-Writing-Craft) |
| **B3** | Sind die Stränge über **alle** Flächen kohärent/konsistent (NPC-Dialoge, Planung/Korkbrett/Sendeplan, Auswertungen, Broadcast/Newsroom, Fokusgruppe, Polls, Gegenseite)? | End-to-End-Tracing 2–3 Stränge (Auftrag/Episode); Rollen-Konsistenz (npcs.json↔Affinität↔Persona); fiktiver Ost-Block (`SYMBOLS_AUDIT`). | Continuity |
| **B4** | Von Anfang an erschließbar? Emergente Momente? Ergibt alles Sinn — oder sind Features/Räume/Funktionen nicht richtig eingebaut/„sinnlos"? | `DAY_ONE_WALKTHROUGH.md`, `TutorialOverlay`, Spielerpfad, `building.json`-Räume↔Views, Engine-Systeme↔UI-Einstieg (P2/Werte/Polls/Gegenseite sichtbar/erklärt?), tote Widgets. | Systems/UX |

**Synthese B →** `docs/REVIEW_2026-06-15_GAME_STRUCTURE.md`.

---

## Ergebnis-Artefakte
1. `docs/REVIEW_2026-06-15_VISUAL_ASSETS.md` (A1–A4 destilliert)
2. `docs/REVIEW_2026-06-15_GAME_STRUCTURE.md` (B1–B4 destilliert)
3. **`docs/TODO_2026-06-15_CENTRAL.md`** — die eine zentrale, priorisierte ToDo-Liste
   (Visual-Asset · Debug/Bug · Connect · Sound · Struktur/Narrativ), gespeist aus allen 8 Reviews.
4. Branch-Commit + Draft-PR.
</content>
</invoke>
