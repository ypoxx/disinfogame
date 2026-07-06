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
  → `toSegmentKey()` normalisiert. **Alle 8 Milieus haben ein Ziel** (Roster auf 9
  Archetypen erweitert: `t_erfolgscoach`, `t_mittelstandsredner`, `t_protestredner`),
  jede Empfehlung ist damit voll vorbefüllt. Invariante geprüft in
  `TargetMilieuCoverage.test.ts`.

## Erkenntnis-Dossier (über Runden)

Jede beauftragte Fokusgruppe legt ihre Sweet Spots (≥ +40 %) als **Erkenntnisse** im
`dossierStore` ab — dedupliziert über die id (`appeal_segment`), stärkerer Wert und
früheste Entdeckungs-Phase bleiben. Aus dem wachsenden Bestand leitet `detectArcs()`
höherstufige **Kampagnen-Arcs** ab:

- **Flächenbrand** — ein Appell zündet in ≥3 Milieus → breit über mehrere Kanäle streuen.
- **Zwei-Fronten-Narrativ** — die zwei stärksten Befunde mit unterschiedlichem Appell in
  unterschiedlichen Milieus → beide Milieus parallel anspielen.

Der Ergebnis-Screen zeigt das Dossier als Befund-Chips + Arc-Karten. Reine Logik in
`audience/dossierModel.ts` (getestet), Persistenz im `stores/dossierStore.ts`
(Reset in `startGame`, noch nicht in Save/Load — wie `directorStore`).

## Dateien

| Rolle | Datei |
|---|---|
| Reine Logik (Matrix + Empfehlungen) | `src/story-mode/audience/kampagnenSchmiede.ts` |
| Analyse-Herkunft (serialisierbar) | `src/story-mode/battlefield/BattlefieldChain.ts` → `OperationAnalysis` |
| Ergebnis-Screen (Matrix + Empfehlungskarten) | `src/story-mode/components/FokusgruppePreTest.tsx` |
| Vorbelegung + Analyse-Streifen | `src/story-mode/components/OperationsAkteView.tsx` |
| Konsequenz („Zähne") | `src/game-logic/StoryEngineAdapter.ts` → `playOperation` |
| Erkenntnis-Dossier (Logik + Store) | `src/story-mode/audience/dossierModel.ts`, `src/story-mode/stores/dossierStore.ts` |
| Ziel-Roster (9 Archetypen, alle 8 Milieus) | `src/story-mode/data/targets.json` |
| Verdrahtung (Seed-Zustand, Brücke, Dossier) | `src/story-mode/StoryModeGame.tsx` |
| Tests | `kampagnenSchmiede.test.ts`, `dossierModel.test.ts`, `FokusgruppePreTest.test.tsx`, `OperationsAkteView.test.tsx`, `PlayOperation.test.ts`, `TargetMilieuCoverage.test.ts` |

## Erweiterungs-Ideen (nicht umgesetzt)

- **Arc → Ein-Klick-Sequenz**: Ein Zwei-Fronten-Arc befüllt nacheinander zwei Akten
  (aktuell ist der Arc ein strategischer Hinweis, das Starten läuft über die Empfehlungen).
- **Benannte Personas als Vorschau**: „Doreen kippt · Henrike wird misstrauisch
  → +Enttarnungs-Risiko" direkt in der Start-Vorschau.
- **Dossier in Save/Load**: Befunde überleben aktuell nur die Session (wie `directorStore`).
