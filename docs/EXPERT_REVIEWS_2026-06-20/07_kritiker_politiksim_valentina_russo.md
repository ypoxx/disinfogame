# Kritiker-Persona 2 — Valentina Russo (Politik-/Gesellschaftssimulation, seit 1990)

> Kanon: Democracy 1–4 (Positech/Cliff Harris — sichtbares Kausal-Web), Crisis in the Kremlin,
> Suzerain, Tropico, Republia Times/Orwell. **Web blockiert** — Genre-Wissen als Maßstab, keine erfundenen Zitate. Urteil über DIESES Spiel ruht auf Code/Daten.

## Gesamteindruck
Die richtige Genre-Familie (mehrdimensionaler Gesellschaftszustand → Auftragsmuster, wie Democracy).
Zwei Geburtsfehler: **das Kausal-Web ist vor dem Spieler verborgen, und es ist von der Siegbedingung entkoppelt.**

## Befunde
- **B1 — Kausal-Web existiert, ist aber unsichtbar.** `societyFormulaStep` koppelt 7 Kanten (Polarisierung>45→Fragmentierung; Zynismus>40→Wehrhaftigkeit↓; niedriger Druck→Diskurs heilt). UI zeigt nur Balken. *„Ich sehe acht Tachonadeln und keinen Motor."*
- **B2 — Herzstück und Sieg sind zwei getrennte Maschinen.** Gesellschaftswerte über `societyDeltaFromAction`; Sieg über separate `trustErosionValue` (`obj_destabilize unangetastet`, R2). *„Das Herz schlägt in einem Glaskasten neben dem Patienten — sichtbar, aber nicht angeschlossen."*
- **B3 — Ein großer Teil der Aktionen sind tote Knöpfe fürs Herzstück.** `actions.json` (44 Stück, ta01–07): 0 `impact_scale`, nur 3 gelesene Effekt-Keys; typische Keys (`reveals_vulnerabilities`, `defines_okrs`) kommen im Society-Mapping NICHT vor → bewegen die Werte gar nicht. *„Die Hälfte des Katalogs dreht an einem Knopf, der mit nichts verbunden ist."*
- **B4 — Die Baseline-Krücke verrät zu dünne Verdrahtung.** Code-Kommentar selbst: „sonst bleiben sie tot" → pauschaler impact_scale-Lärm statt spezifischer Kausalität. *„Wenn man den Strom über die Notbeleuchtung einspeisen muss, fehlt das eigentliche Kabel."*
- **B5 — Wo das Modell spezifisch ist, ist es exzellent** (Phänomene + Beats, Doppel-Kopplungen, testbares `evaluateBeatGate`). *„Wären alle Aktionen so verdrahtet wie die Phänomene, läge das Spiel im selben Regal wie Positech."*
- **B6 — Zwei der drei Aufträge messen an einer nicht bedienbaren Achse.** Wahl & Zweifel haben `vertrauen` in der Signatur — den entkoppelten Wert. Keil ist sauber. *„Wahl und Zweifel messen sich an einem Tacho, dessen Nadel an keinem Pedal hängt."*
- **B7 — Das MissionPanel ist der heimliche Held der Lesbarkeit** (Ist/Ziel/Richtung/Häkchen je Achse) — nur auf Status begrenzt, nicht aufs Kopplungs-Web ausgedehnt.
- **B8 — Verzögerte/zähe Effekte da & glaubwürdig** (`rumorPressure`, Krisenfenster, Inokulation/Streisand) — zeitlich ehrliche Konsequenzen.

## Stärken
Echtes nicht-triviales Kopplungsnetz; mustergültige Phänomen-Kopplungen + testbares Anti-Dominanz-Gate;
verzögerte/stochastische Effekte; MissionPanel-Status-Lesbarkeit; intellektuelle Ehrlichkeit der Doku.

## Top-Verbesserungen
1. **Vertrauen an den Gesellschaftszustand koppeln** (Kante in `societyFormulaStep`: Polarisierung+Zynismus+niedrige Diskursqualität ziehen am Vertrauen) → behebt B2+B6; „Wahl/Zweifel" verdient seine Signatur.
2. **Kausal-Web sichtbar machen** (Wirkungs-Geflecht-Panel; MissionPanel-Sprache von Status auf Verkettung ausdehnen).
3. **Tote Knöpfe verdrahten** (jede Aktion ≥1 gelesener Effekt-Key; Baseline-Krücke schrumpfen).
4. **Vorschau zur kleinen Kausalkette ausbauen** („…und hohe Polarisierung beschleunigt Fragmentierung").
5. **Auftrags-Signaturen auf erreichbare Achsen prüfen.**

## Schlussurteil
*„Sie haben den Motor gebaut und ihn neben das Auto gelegt — er läuft wunderbar, er treibt nur die Räder
noch nicht an. Schließt das eine Kabel an, malt die Kanten auf den Bildschirm, und ihr steht im selben Regal wie Positech."*
