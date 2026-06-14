# 🌆 Strang 5 — Atmosphäre & Feinheiten · Feinplan (Vorlage zur Owner-Abnahme)

**Status:** Planung — **noch kein Bau.** Sammelt die bisher nur verstreuten Stichworte
(D13, V8, D28) zu einem ausgearbeiteten Feinplan. Owner: „Feinplanung ist wahrscheinlich
noch notwendig … ist mir echt wichtig" (2026-06-14).
**Datum:** 2026-06-14 · **Setzt auf:** Gebäude-Querschnitt (`BuildingStage`), Avatar/`useSprite`,
Tag/Nacht-Uhr (`dayClockStore`), Jahreszeiten (Schnee/Regen-Overlays).

> **Worum es geht (Owner-Worte):** „Liebe zum Detail, Lebendigkeit, Spaß. Trotz Brutalismus/
> Sowjet: nicht kalt/trocken." Das Gebäude soll **leben** — nicht als Kulisse, sondern als Ort
> mit Menschen, Routinen und kleinen Geschichten, die man entdecken kann.

---

## 1. Quellen (so war es bisher dokumentiert)
- **D13** (`DECISIONS_2026-06-13B_TRANSCRIPT.md`): Dummy-Türen mit ein-/ausgehenden Dummies (wie
  MadTV); klar erkennbar, welche Türen betretbar sind; Tür-Öffnen/-Schließen als Mikro-Animation;
  Flure lebendiger (Lampen abends an, Papierkorb, Pflanzen, Poster); Reinigungskräfte leeren
  Papierkörbe zu bestimmten Zeiten (Signal „bald Feierabend"); später Dummies anklickbar
  (Mini-Dialog/Tooltip).
- **D28** (`NEXT_LEVEL_PLAN.md`): **Pförtner** als „Stimme des eigenen Landes" — bewusst klein.
- **V8 / V9** (`STATUS.md`): Atmosphäre = Strang 5, bewusst später; Lobby + Pförtner-Figur offen.

## 2. Bausteine (klein, je grün getestet, datengetrieben)

### A — Lebendige Flure (rein additiv, kein Spielmechanik-Eingriff)
- **Flur-Requisiten** als Daten (`building.json` → `props[]` je Etage): Papierkorb, Pflanze,
  Wasserspender, Poster, Wanduhr — Positionen datengetrieben, Sprites mit CSS-Fallback.
- **Lampen-Zustand** koppeln an die Tagesuhr: abends an (warmer Schein), tags aus. Nutzt die
  vorhandene `DayNightTint`-Logik als Trigger (kein neues System).

### B — Dummy-Figuren (Flavor-NPCs, kein Spielziel)
- **Daten:** `ambient_figures.json` — `{id, route:[floor/col-Wegpunkte], schedule:[Uhrzeiten],
  sprite, label_de, lines_de:[…]}`.
- **Wege:** kleine, deterministische Routen (Reuse `BuildingNavigator`-Pfadlogik). Beispiele:
  - **Reinigungskraft** geht ab ~17:00 die Etagen ab, leert Papierkörbe → diegetisches Signal
    „bald Redaktionsschluss".
  - **Pförtner** in der Lobby, bleibt am Empfang.
  - Anonyme **Kollegen-Dummies** gehen durch Türen ein/aus (Belebung).
- **Tür-Dummies** (MadTV-Muster): an Nicht-Spieler-Türen erscheinen/verschwinden Figuren mit
  Tür-Mikro-Animation. Macht zugleich klar, **welche Türen betretbar** sind (Spieler-Türen
  heben sich ab) — löst nebenbei einen Lesbarkeits-Punkt.

### C — Anklickbare Flavor-Dialoge (später Slice)
- Dummies/Pförtner anklickbar → **Tooltip oder Mini-Dialog** (kein voller NPC-Dialog-Baum).
- **Pförtner = „Stimme des eigenen Landes" (D28):** gibt **Stimmungs-Hinweise** (z. B. wie die
  Heimat-Öffentlichkeit auf die letzte Operation schaut) — koppelt lesend an `audienceModel`
  bzw. Risk/Attention, **ohne** Rückwirkung auf die Mechanik. Reinigungskraft: „Bald schließt
  das Gebäude" o. ä.
- **Bildungs-Bonus (SOUL §1/5):** kleine entdeckbare Details mit Spielbezug, kein beliebiger Gag.

### D — Mikro-Animationen & Übergänge
- Tür auf/zu, Fahrstuhl-Kabine sichtbar genutzt (steht teils), Lampen-Flackern, dezente
  Loop-Bewegung (Pflanze, Anzeige). Alle mit `prefers-reduced-motion`-Abschaltung.

## 3. Phasen-Schnitt (Vorschlag, klein)
| Phase | Inhalt | Asset-Bedarf |
|---|---|---|
| **5a** | Flur-Requisiten + Lampen-an-abends (Daten + Sprites/Fallback) | gering (kleine Props) |
| **5b** | Dummy-Figuren mit Routen (Reinigungskraft, Kollegen) + Tür-Dummies | mittel (1–2 Lauf-Sheets) |
| **5c** | Pförtner-Figur + anklickbare Flavor-Dialoge (Stimmungs-Hinweise) | gering–mittel |
| **5d** | Tür-/Fahrstuhl-Mikro-Animationen, Politur | gering |

## 4. Leitplanken
- **Keine künstliche Verknappung / tickende Uhr** (SOUL §3) — Routinen sind Stimmung, nicht Druck.
- **Anfang nicht überfordern** (D13): Druck/Belebung dosiert, evtl. erst ab späterer Phase.
- **Pixel aus einem Guss** — neue Figuren/Props strikt nach Stil-Bibel, Vision-Review, keine
  realen Symbole (G23/SYMBOLS_AUDIT).
- **Budget:** Asset-Erzeugung mit Kostenansage (SOUL §5). 5a/5d sind weitgehend gratis.

## 5. Offene Owner-Abnahme
- Reihenfolge 5a→5d ok? Mit **5a (Flur-Requisiten)** zuerst (billig, sofort sichtbar)?
- Pförtner-Stimmungs-Hinweise: an `audienceModel` koppeln (empfohlen) oder generische Sprüche?
- Dummies anklickbar **jetzt** (5c) oder erst nach dem Haupt-Content (P2/Topics)?
