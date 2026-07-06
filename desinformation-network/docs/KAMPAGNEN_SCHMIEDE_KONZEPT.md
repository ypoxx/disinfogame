# Kampagnen-Schmiede — Zielgruppenanalyse befruchtet das Spielgeschehen

> Stand 2026-07-06. Baut die Fokusgruppe von einem Wissens-Automaten zu einem
> Handlungs-Einstieg um: aus Erkenntnis wird startklare Kampagne.

## Problem (Ausgangslage)

Die Zielgruppen-Analyse (`FokusgruppePreTest`) testete **einen von vier Appellen**
(Aufbruch · Abstiegsangst · Empörung · Seriosität) an einer Stichprobe und zeigte
zwei Balken (Prognose vs. Wahrheit) + eine Sample-Bias-Warnung. Danach: „Neue
Befragung". Sackgasse — die Erkenntnis floss **nicht** in die eigentliche Handlung
(`OperationsAkteView`: Ziel → Schwäche → Verbreiter → Plattform). Vier isolierte
Test-Szenarien ohne Anschluss.

## Lösung — drei Bausteine

**1 · Brücke (Erkenntnis → Kampagne).** Der Ergebnis-Screen erzeugt 1–3 startklare
**Kampagnen-Empfehlungen**. Jede bildet einen Sweet Spot (Appell × Milieu) auf einen
konkreten Operations-Seed ab — Ziel im Milieu, glaubwürdigste Schwäche, milieu-treuer
Verbreiter, reichweitenstarke Plattform — samt erwarteter Engine-Wirkung. „Kampagne
starten ▸" öffnet die Operations-Akte **vorbefüllt** (`initialSelection`).

**2 · Wirkungs-Landkarte.** Statt vier isolierter Knöpfe eine **Matrix Appell × Milieu**
über die befragte Stichprobe. Sweet Spots (grün) und Fallen (rot, schlagen zurück)
auf einen Blick; unbefragte Milieus bleiben „?" — eine schmale Stichprobe lässt die
Landkarte im Nebel (lehrt Repräsentativität).

**3 · Konsequenzen mit Zähnen.** Ruht eine Empfehlung auf einer geschönten
Wunsch-Stichprobe (Prognose ≫ wahrer Milieu-Wert, schmal befragt), trägt der Seed
`biasWarned`. Startet der Spieler sie trotzdem, **verpufft** die Kampagne: die
Engine dämpft die Vertrauens-Erosion (`OP_BIAS_EFFECT_FACTOR`) und meldet den
öffentlichen Fehlschlag im Newsroom. Ignorierte Marktforschung hat einen Preis.

## Datenfluss

```
personas.json ──► buildWirkungsMatrix(personas, sample)      ─► Matrix (Baustein 2)
                └► recommendCampaigns({personas, sample,          ─► Empfehlungen (Baustein 1)
                     segments, targets, carriers, platforms})        └► CampaignSeed{…, analysis}
                                                                          │
CampaignSeed ──► AkteSelection ──► OperationsAkteView(initialSelection)   │ onLaunchCampaign
                                        │ operationParamsOf                │
                                        ▼                                  ▼
                        OperationParams{…, analysis} ──► engine.playOperation()
                                                            └► biasWarned? → gedämpfte Erosion
                                                                              + „verpufft"-News (Baustein 3)
```

## Milieu-Verkabelung (schon in den Daten angelegt)

- `targets.json` · `milieu` (`wu_bohemien` …) → Ziel im Sweet-Spot-Milieu.
- `carriers.json` / `platforms.json` · `milieus[]` → Verbreiter/Plattform mit Milieu-Treffer.
- Personas nutzen die Kurzform (`zorniger`), Audience/Targets die `wu_`-Form
  → `toSegmentKey()` normalisiert. 3 der 8 Milieus haben (noch) kein Ziel
  → Teil-Empfehlung („Ziel in der Akte noch wählen").

## Dateien

| Rolle | Datei |
|---|---|
| Reine Logik (Matrix + Empfehlungen) | `src/story-mode/audience/kampagnenSchmiede.ts` |
| Analyse-Herkunft (serialisierbar) | `src/story-mode/battlefield/BattlefieldChain.ts` → `OperationAnalysis` |
| Ergebnis-Screen (Matrix + Empfehlungskarten) | `src/story-mode/components/FokusgruppePreTest.tsx` |
| Vorbelegung + Analyse-Streifen | `src/story-mode/components/OperationsAkteView.tsx` |
| Konsequenz („Zähne") | `src/game-logic/StoryEngineAdapter.ts` → `playOperation` |
| Verdrahtung (Seed-Zustand, Brücke) | `src/story-mode/StoryModeGame.tsx` |
| Tests | `__tests__/kampagnenSchmiede.test.ts`, `FokusgruppePreTest.test.tsx`, `OperationsAkteView.test.tsx`, `PlayOperation.test.ts` |

## Erweiterungs-Ideen (nicht umgesetzt)

- **Erkenntnis-Dossier**: Befunde über Runden hinweg sammeln, zu Kampagnen-Arcs
  kombinieren (dockt am bestehenden Combo-System an).
- **Benannte Personas als Vorschau**: „Doreen kippt · Henrike wird misstrauisch
  → +Enttarnungs-Risiko" direkt in der Start-Vorschau.
- **Ziele für die drei ziel-losen Milieus** (`wu_optimiererin`, `wu_macher`,
  `wu_zorniger`) ergänzen, damit jede Empfehlung voll vorbefüllt.
