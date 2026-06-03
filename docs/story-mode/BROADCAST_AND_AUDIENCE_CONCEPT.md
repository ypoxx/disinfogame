# 📺 Sendung & Publikum — Konzept (MadTV/MadNews-HUD)

**Status:** Aktiv — **Entwurf ohne Grafik-Assets umgesetzt** (siehe „✅ Umgesetzt"); tiefere Schichten optional
**Aktualisiert:** 2026-05-31
**Scope:** Story
**Supersedes / Superseded-By:** —
**Kanonisch für:** (noch) nichts — reines Konzept. Ergänzt `BUILDING_AND_ASSETS.md` (Gebäude/Querschnitt)
und `SCENARIO_FRAMEWORK.md` (Zielländer/Segmente). **Verbindlich bleibt `docs/VISION_LOCK.md`.**

---

## 0. Worum es geht (das Vorbild)

In **MadTV / MadNews** ist durchgehend — egal ob im Büro oder im Gebäude — eine **untere Leiste** sichtbar:

```
┌───────────────────────┬───────────────────┬───────────────────────┐
│  SENDUNG (links)      │   STATS (Mitte)   │   PUBLIKUM (rechts)   │
│  „Live-Programm" /    │   💰 / Quote /    │   Wer schaut zu?      │
│  Fernseher / Zeitung  │   ❤️ / 🕒          │   + Stimmung          │
└───────────────────────┴───────────────────┴───────────────────────┘
```

- **Links:** ein Fernseher (bzw. bei MadNews eine **Zeitung**), der das aktuelle „Programm" zeigt.
- **Rechts:** das **Publikum** — repräsentative Figuren dafür, *wer* zuschaut (z. B. „ein alter Mann
  allein" = ältere männliche Zielgruppe, niedrige Quote). Mehr Figuren = höhere Quote; Alter/Geschlecht
  zeigen *wer* zuschaut.
- **Mitte:** Kernzahlen (Geld, Quote/Rate, „Zufriedenheit", Uhr).

**Unsere Übersetzung:** Statt „Live-Programm" zeigt der Fernseher/die Zeitung die jeweils ausgespielte
**Desinformations-Maßnahme als „Effekt"** (Headline, TV-Ausschnitt, Social-Post …). Das **Publikum** zeigt,
**wer darauf anspringt** und **in welcher Stimmung** es ist (zufrieden / verunsichert / wütend / misstrauisch …).

---

## 1. Leitprinzip: Visualisierung, **kein** zweites Spiel

> **Das HUD ist eine Anzeige- und Feedback-Schicht über dem bestehenden Story-Mode-System —
> kein paralleler Simulator.** Es macht sichtbar, was Aktionen ohnehin auslösen.

Begründung: Story Mode hat bereits einen vollständigen **Aktions→Konsequenz-Kreislauf**. Wenn wir „Effekte"
und „Publikum" als getrennte Mechanik bauen, entstehen zwei widersprüchliche Wahrheiten. Stattdessen docken
wir an Vorhandenes an (siehe §6).

---

## 2. Was schon existiert (verifiziert) — und wo es andockt

| Baustein | Datei / Stand | Rolle im HUD |
|---|---|---|
| **„Effekte" = Aktionen** | `data/actions.json` (+ `_continued`), **110 Aktionen** nach **DISARM**-Framework: TA01 Strategie → TA02 Infrastruktur → **TA03 Content-Erzeugung** → **TA04 Distribution** … | Inhalt des **Fernsehers/der Zeitung** (links). Bes. TA03/TA04. |
| **Stats = Kosten-Typen** | `actions.json → cost_types`: 💰 **Budget**, ⚡ **Kapazität** (regeneriert/Phase), ⚠️ **Risiko** (Entdeckung, kumulativ), 👁️ **Aufmerksamkeit**, 💀 **Moralische Last** | **Mitte** des HUD (statt $/Quote/❤️/🕒). |
| **Gebäude-Querschnitt** | `building/BuildingView.tsx` + `data/building.json` (3 Etagen, 5 Räume → NPC), `viewMode:'building'` | Das HUD liegt **unter** Gebäude- *und* Büro-Ansicht. |
| **Produzenten (NPCs)** | `npcs.json` (5): Direktor Volkov, **Marina** (Medien → `ta02/03/04_*`), **Alexei** (Technik), **Katja** (Feld), **Igor** (Finanzen) | Räume produzieren die Effekte; Marina = Content/„Sendung". |
| **Gegenkräfte** | `countermeasures.json` (**24**), `consequences.json` (**24**), `engine/CountermeasureSystem`, `ConsequenceSystem`, `CrisisMomentSystem`, `BetrayalSystem` | Fakten-Checks / Gegen-Sendungen, Entdeckung, Krisen. |
| **Enden** | `engine/EndingSystem` — **8 Ending-Kategorien** (kanonisch, `VISION_LOCK §4`) | Publikums-/Risiko-Zustand speist die Enden. |
| **Zielgruppen (Entwurf)** | `SCENARIO_FRAMEWORK.md`: 6 fiktive Länder der **Westunion** (Nordmark/DE, Gallia/FR, Insulandia/UK, Balticum, Südland, Ostmark) mit je **Vulnerabilität** (z. B. „Energie-Angst") + OKRs (Cohesion, DemokratieVertrauen …) | **Kandidat für das Publikum** — aber als Spiel-**Daten noch nicht vorhanden**. |

**Lücke (= der neue Teil):** Es gibt **keine** Publikums-/Bevölkerungs-Repräsentation, die auf Effekte
reagiert, und **keine** Sendungs-Visualisierung. Beides ist neu.

---

## 3. Das HUD (Layout + Koordinaten)

Persistente untere Leiste, sichtbar in `office`- und `building`-View. Adressierbar über das
Entwickler-Koordinatensystem (§5):

- **`F1` — Sendung/Output:** rendert den aktuellen Effekt. Modus **TV** (Fernseher) *oder* **Zeitung**
  (MadNews) *oder* **Social-Feed**, je nach Kanal/Szenario.
- **`S` — Stats:** die fünf `cost_types` + Phase/„Jahr" (Zeitmodell laut `VISION_LOCK §3`).
- **`P` — Publikum:** Figuren der angesprochenen Segmente; Haltung/Gesicht = Stimmung, Anzahl/Größe = Reichweite.

---

## 4. Effekte-System (PLAN — Details offen)

**Definition (vorläufig):** Ein **Effekt** ist die *spielbare Darstellung einer Aktion* (i. d. R. TA03/TA04),
die als Sendung/Publikation ausgespielt wird und beim Publikum eine Reaktion auslöst.

**Mögliche Attribute** (teils schon in `actions.json`, teils neu):
- **Medium/Kanal:** TV-Ausschnitt · Zeitungs-Headline · Social-Post · Meme · „geleaktes Dokument" …
  → bestimmt mit, *welches* Segment erreicht wird (TV→älter, Social→jünger, Print→Establishment …).
- **Thema/Technik:** welche Persuasion-Technik (Taxonomie, 27+) + welches Angst-/Wut-Narrativ.
- **Reichweite, Glaubwürdigkeit, Zerfall (Decay), Entdeckbarkeit** — vorhanden sind bereits
  `budget/capacity/risk/attention/moral_weight`.
- **Lebenszyklus:** erzeugen (NPC-Raum) → ausspielen (Sendung) → Wirkung/Verbreitung → Abklingen *oder*
  Gegen-Sendung/Faktencheck.

**Offene Fragen:** → §7 (Q1, Q2, Q3).

---

## 5. Publikums-/Reaktions-System (PLAN — Details offen)

**Definition (vorläufig):** Das Publikum besteht aus **Segmenten**, die je nach **Resonanz** auf einen Effekt
anspringen und dabei ihre **Stimmung** und ihren **Glauben/Zusammenhalt** verschieben.

- **Segmente — Entscheidung (2026-05-31):** Das Publikum ist **hierarchisch: Land → Segmente**, wobei
  ein Segment **Milieu *und* Demografie kombiniert** (z. B. „ängstliche ältere Landbevölkerung",
  „wütende junge Online-Männer", „etabliertes urbanes Bürgertum"). **v1 = genau *ein* Land: Nordmark ✅**
  (DE-Analog — **großes Land mit viel Diversität auf allen Ebenen**, energieabhängig, reichste
  Vulnerabilitäten), reich nach innen segmentiert. **Architektur bleibt offen für N Länder** — jedes weitere erhöht nur die Komplexität
  (mehr Figuren/Quoten), ohne Umbau.

  ```jsonc
  // data/audience.json (Skizze) — erweiterbar: countries[] → segments[]
  { "countries": [{
    "id": "nordmark", "label_de": "Nordmark",
    "segments": [{
      "id": "nm_rural_anxious",
      "label_de": "Ländlich, älter, verunsichert",
      "milieu": "traditionell", "demographics": { "age": "55+", "lean": "skeptisch" },
      "vulnerabilities": ["energie_angst", "wirtschafts_sorge"],
      "size": 0.18, "mood": "verunsichert", "belief": 0.5, "reachedBy": ["tv", "print"]
    }]
  }] }
  ```
- **Resonanz / „wer springt an":** Treffer zwischen *Effekt-Thema* und *Segment-Vulnerabilität*
  (z. B. Energie-Angst-Content → **Nordmark**). Treffer ⇒ stärkere Wirkung + sichtbare Figur.
- **Stimmungen (Vorschlag):** `zufrieden/ruhig` · `verunsichert` · `wütend` · `misstrauisch`.
  Für den Spieler (Desinformations-Seite) ist **Verunsicherung/Wut/Spaltung** der „Erfolg" — speist die OKRs
  (Cohesion ↓, DemokratieVertrauen ↓, Energie-Angst ↑).
- **Quote/Reichweite (Einschaltquote):** *wie viele* eines Segments erreicht/überzeugt wurden — plus *welches*
  Segment (genau die MadTV-Logik „alter Mann = alte Zielgruppe").

**Offene Fragen:** → §7 (Q4, Q5, Q6).

---

## 6. Koordinatensystem (Entwickler-Overlay) — als Protokoll bestätigt

Ein **ein-/ausschaltbares Raster**, damit über Positionen geredet werden kann, **ohne Screenshots/Computer-Vision**.
Legt sich über Gebäude **und** HUD; später über echte Assets.

- **Zelle = `<Spalte><Etage>`** — Spalten A–E (links→rechts), Etage = Stockwerk. Bsp. **B3**.
- **Im Raum: Ziffernblock 1–9** (`1 2 3 / 4 5 6 / 7 8 9`, Lesereihenfolge). Bsp. **B53** = Raum B5, Feld 3 (oben-rechts).
- **Funktionselemente:** **F** Fernseher/Sendung · **Z** Zeitung · **P** Publikum · **S** Stats · **L** Lift.
  Optional Uhrzeit-Position für runde/Screen-Elemente: **F1 12:15**.
- **Overlay an/aus** = Dev-Filter (auch im laufenden Spiel testbar).

---

## 7. Offene Entscheidungen (das „haben wir an alles gedacht?")

1. **Effekt = Aktion oder eigenes Inhalts-Objekt?** Empfehlung: zunächst *Darstellung* einer bestehenden
   Aktion (billig, integriert); später optional reichere Content-Objekte.
2. **Kanäle/Medien jetzt oder später?** (TV vs. Zeitung vs. Social, die *unterschiedliche Segmente* erreichen.)
3. **Effekt-Attribute:** reichen `cost_types`, oder brauchen wir „Glaubwürdigkeit/Reichweite/Decay" explizit?
4. ✅ **ENTSCHIEDEN (2026-05-31):** Land → Segmente (Milieu × Demografie); **v1 = ein Land**, erweiterbar
   auf N Länder. *(v1-Land: **Nordmark ✅ bestätigt** — großes DE-Analog mit hoher Diversität.)*
5. **Stimmungs-Set + Wirkung:** welche Emotionen, und was bewirken sie mechanisch (Anfälligkeit, OKRs)?
6. **Reaktion lesbar (didaktisch) oder verdeckt?** Für den Bildungs-/Inokulations-Zweck:
   **lesbar** empfohlen — „Angst-Appell → verunsichert → anfälliger" sichtbar machen.
7. **Story-Mode-Ökonomie:** Gibt es Einkommen/„Rate" (MadTV 0,70)? Wie regeneriert Budget? Was „kauft" Reichweite?
   (Bereits in `INVENTORY`/Survey als Lücke markiert.)
8. **Integration Enden/Detection:** Publikums-Metriken speisen `EndingSystem` + Detection-Risk —
   **keine** neuen Sieg/Niederlage-Pfade erfinden (`VISION_LOCK §4`).
9. **Daten-Heimat:** neues `data/audience.json` (Segmente, Vulnerabilität, Stimmung) — szenario-gebunden.

---

## 8. Ethik / Bildung

- **Fiktiv bleiben** (Länder sind bereits fiktiv: Nordmark, Gallia … — `DECISIONS D-002/D-P003`).
- **Mechanik sichtbar machen** (Technik → Reaktion) = Inokulation: Spieler *versteht*, wie Manipulation wirkt.
- **Konsequenzen zeigen** (`consequences.json`, 24) — das Publikum ist nicht nur eine Quote, sondern Menschen.

---

## 9. Bauvorschlag (kleine grüne Schritte)

1. **HUD-Gerüst (CSS, keine Assets):** untere Leiste mit `F1`/`S`/`P`, gespeist aus **vorhandenen** Daten
   (aktuelle Aktion → `F1`; `cost_types` → `S`; Platzhalter-Segmente → `P`). + **Koordinaten-Overlay** (an/aus).
2. **Resonanz-Stub:** `audience.json` mit **einem Land** + 3–5 Innen-Segmenten (Milieu × Demografie) +
   Vulnerabilität; einfache Treffer-Logik Effekt↔Segment; Stimmung als Farbe/Haltung.
   **Struktur erweiterbar auf N Länder.**
3. **Sendungs-Render:** Effekt als TV-Bild *oder* Zeitungs-Headline (Medium-Umschalter).
4. **Vertiefung:** Quote/Reichweite, Decay, Gegen-Sendungen (Faktencheck), Anbindung an OKRs/Enden.

> Reihenfolge folgt `BUILDING_AND_ASSETS.md`: erst sichtbares Gerüst (CSS), Tiefe iterativ — **kein Big-Bang**,
> Build/Tests bleiben grün.

---

## ✅ Umgesetzt — Entwurf ohne Grafik-Assets (Branch `claude/building-schematic`)

Alles CSS-only, ohne Grafik-Assets; `typecheck` + Build + **95 Story-Tests** grün.

| Baustein | Stand | Ort |
|---|---|---|
| Koordinaten-Raster + „🧭"-Overlay (A2/B2/A0 …, leere Zellen) | ✅ | `building/BuildingView.tsx`, `data/building.json` (`col`) |
| Publikums-Modell (Resonanz · Quote · Stimmung · Glaube) | ✅ + Tests | `audience/audienceModel.ts`, `data/audience.json` |
| 2 Länder (Nordmark, Gallia) · erweiterbar auf N | ✅ | `data/audience.json` |
| HUD-Leiste **F1/Q/P** (persistent, über allen Views) | ✅ | `components/BroadcastHUD.tsx` |
| Sendung komponieren (Medium+Thema) + „📡 Ausstrahlen" | ✅ | `BroadcastHUD` + `stores/broadcastStore.ts` |
| **F1 ↔ Gameplay**: Content-Aktion (TA03/04/05/07) geht on air | ✅ | `StoryModeGame.tsx` (`airFromAction`), `audience/effectMapping.ts` |
| Detection: Risiko dämpft Wirkung + Gegen-Sendung (Faktencheck) | ✅ + Test | `detectionDampen`, `broadcastStore.counter` |
| Fahrstuhl (L) + Raum-Ambiente (ON AIR / Monitor) + NPC-Präsenz | ✅ | `BuildingView` (CSS-Keyframes) |

**Bewusst noch offen** (= braucht Grafik-Assets oder tiefere Engine-Arbeit, daher außerhalb des Entwurfs):
- Laufende Figuren zwischen Räumen — braucht **einen** Lauf-Zyklus-Asset (`VISION_LOCK §5`).
- Quote/Glaube an **OKRs/Enden** (`EndingSystem`) koppeln + Publikums-Stand in Save/Load.
- Aktionen aus der **Queue** (Auto-Ausführung) ebenfalls „on air" schalten.
- Echte Sendungs-/Figuren-Grafik statt CSS-Platzhalter (über `sprite-tool`/Asset-Pipeline).

---

## 10. Referenzen
- `docs/VISION_LOCK.md` — kanonische Wahrheit (Roster, Zeitmodell, Enden, Kunst-Richtung).
- `docs/BUILDING_AND_ASSETS.md` — Gebäude-/TVTower-Weg (HUD liegt darunter).
- `docs/story-mode/SCENARIO_FRAMEWORK.md` — Westunion-Länder + OKRs (Publikums-Kandidat).
- `src/story-mode/data/actions.json` — DISARM-Aktionen (= Effekte) + `cost_types` (= Stats).
- `src/story-mode/building/BuildingView.tsx`, `data/building.json` — Querschnitt (Track A-1).
