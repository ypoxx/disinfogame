# ⚖️ Balancing-Durchrechnung — „Kann man überhaupt gewinnen oder verlieren?"

**Status:** Analyse-Ergebnis (Owner-Auftrag 2026-06-12), Grundlage für K14-Balancing
**Datenbasis:** 110 Aktionen, Engine-Code (StoryEngineAdapter, EndingSystem), 90 simulierte
Partien (vorhandene Playtest-Tests + 50-Läufe-Batch mit Greedy-/Zufalls-Strategien)

## Antwort in einem Satz

**Gewinnen: ja — aber fast garantiert und oft viel zu früh. Verlieren: praktisch
unmöglich.** Das Spiel ist aktuell ein narrativer Durchlauf ohne mathematische
Spannung; genau hier liegt der größte Hebel für „spannend wie MadTV".

## Die Zahlen

| Befund | Beleg |
|---|---|
| Alle 4 Test-Strategien (zufällig, billigst, risikoarm, aggressiv) **gewinnen in 6–8 Phasen** von 120 | intelligent-playtest |
| 50-Läufe-Batch: **44× Sieg / 6× Zeit-Timeout / 0× Enttarnung**; Median-Sieg Phase 52, schnellster Phase 6 | Simulation |
| Risiko erreichte **nie** die Enttarnungsschwelle 85 (max. 32 %) — der Risiko-Abbau von −5/Phase neutralisiert den Aufbau vollständig | `StoryEngineAdapter.ts:662` |
| Vertrauen ist eine **Einbahnstraße**: keine Regeneration durch Verteidiger; die einzige Rückhol-Mechanik ist bei der Siegschwelle 40 gedeckelt | `:3958` |
| Budget ist nie knapp (Endstand 100–207k); Aufmerksamkeit pendelt um 0–4 % | Simulation |
| Risikoarm spielen ist **strikt dominant** — die 27 illegalen Aktionen lohnen sich nie | Strategie-Vergleich |
| Sieg-Prüfung schlägt jede Niederlage (Reihenfolge im Code); Insta-Win möglich, bevor Gefahr entsteht | `:4510–4518` |
| Zwei getrennte Endsysteme: der Spielfluss nutzt 4 simple Enden, die 8 reichen Ending-Kategorien (`EndingSystem.ts`) laufen am Loop vorbei | `:5057` vs. `:4498` |

## Die 8 Stellschrauben (Reihenfolge = Wirkung)

1. **Vertrauens-Regeneration durch Verteidiger** (Faktenchecker/Moderation gewinnen
   pro Phase Punkte zurück, skaliert mit Eskalationsstufe) → erzeugt das eigentliche
   Wettrennen Erosion vs. Aufklärung. `StoryActorAI` + `advancePhase`.
2. **Risiko-Abbau senken** (−5 → −1/−2, und nur ohne laufende Untersuchung) →
   Enttarnung wird wieder möglich. `:662`.
3. **Erosions-Multiplikatoren halbieren** (×1,25 Objective, ×50 Combo) → kein
   Frühsieg in Phase 2. `:3445`, `:3823`.
4. **Sieg erst nach Halten** (Ziel N Phasen unter der Schwelle halten, bei hohem
   Risiko nur „pyrrhischer Sieg") → Reihenfolge-Problem behoben. `:4510–4551`.
5. **Risiko/Ertrag koppeln**: hohe Erosion nur über riskante Aktionen → illegale
   Aktionen bekommen ihren Sinn. Aktions-Daten + Erosions-Formel.
6. **Ressourcen verknappen**: Budget-Regeneration streichen/an Erfolg koppeln;
   Kapazität ist der echte Engpass (≈2–3 Aktionen/Phase), AP=5 ist Beiwerk.
7. **Eskalierende Gegenreaktion statt Timer**: je tiefer das Vertrauen, desto
   stärkere Verteidiger-Wellen → natürlicher Spannungsbogen über 10 Jahre,
   ganz im Sinne der Owner-Vorgabe (keine künstliche Uhr).
8. **Endsysteme zusammenführen**: `EndingSystem.evaluateEnding` als primäre
   Auswertung verdrahten, damit alle 8 Enden real erreichbar sind.

## ✅ Umsetzungs-Nachweis (Stellschrauben 1–4, 2026-06-12 spät)

Nach Owner-Freigabe umgesetzt (Commit `2074a12`). Gleiche Simulation, 36 Partien:

| Metrik | Vorher | Nachher |
|---|---|---|
| Siege / Niederlagen | 33 / 3 | **19 / 17** |
| Enttarnungs-Niederlagen | 0 | **5** (alle bei riskanter Strategie, Risiko bis 100) |
| Frühester Sieg | Phase 7 | **Phase 24** (risikoarm: 38) |
| Median-Siegphase | 46 | **55** |
| Dominanz „risikoarm" | strikt dominant | gebrochen (8 vs. 6 vs. 5 Siege) |

Verlieren ist real: 12 Zeit-Niederlagen entstehen, weil die Verteidiger-Regeneration
das Wettrennen gewinnt. Stellschrauben 5–8 bleiben offen für den nächsten Balancing-Pass
(nach K1-Tagesschleife, mit menschlichem Spielgefühl statt nur KI-Strategien).

## Einordnung für K1 (Tagesschleife)

Die Tagesschleife allein erzeugt KEINE Spannung, wenn die Mathematik dahinter
keinen Druck kennt. Empfohlene Reihenfolge: erst Stellschrauben 1–4 (macht
gewinnen/verlieren real), dann K1-Inszenierung (macht den Druck fühlbar).
Beides zusammen ergibt den MadTV-Effekt: Verbindlichkeiten + Risiko + Rhythmus.
