# Zeitmodell — die vier Ebenen (Diegese + UI)

> Kanonische Kurzreferenz (T2/#1, 2026-06-18). Die Tester empfanden die vier
> überlagernden Zeit-Ebenen als Buchhaltung. Sie bleiben mechanisch, sind aber
> jetzt **hierarchisiert** (primär = „was tust du heute", sekundär = Kalender).

## Die vier Ebenen
| Ebene | Einheit | Bedeutung | Wo angezeigt | Hierarchie |
|---|---|---|---|---|
| **Arbeitstag-Uhr** | 09:00–18:00 | Innerhalb eines Tages; Handlungen kosten Zeit, 18:00 = Feierabend → Heimweg | `DayClock` (oben rechts) | **primär** (was JETZT) |
| **Aktionen heute (AP)** | ~5 pro Tag/Phase | Wie viele Maßnahmen du diesen Tag setzen kannst | HUD `PhaseDisplay` | **primär** (was JETZT) |
| **Monat** | 1–12 | Ein gespielter Tag = eine Phase = ein Monat-Schritt | HUD (Kalender-Cluster) | sekundär (Kontext) |
| **Jahr** | 1–10 (120 Phasen) | Der Kampagnen-Horizont (Sieg-/End-Check) | HUD (Kalender) + GameEnd | sekundär (Kontext) |

## Die zentrale Gleichung
**1 gespielter Tag = 1 Phase = 1 Monat-Schritt.** Du verbringst den Tag (Uhr +
AP), gehst abends heim (`walkHome` → Tagesfazit), und der nächste Morgen ist der
nächste Monat. 12 Monate = 1 Jahr; 10 Jahre = das ganze Spiel (120 Phasen).

## UI-Entschärfung (T2/#1)
- Das HUD zeigt **AP („AKTIONEN HEUTE")** groß/primär — der eigentliche Zug-Takt.
- **Jahr + Monat** sind zu einem kleinen **„KALENDER"**-Cluster (`J1 · MÄR`)
  zusammengefasst, sekundär — Positions-Kontext, nicht drei konkurrierende Großzahlen.
- Die **Arbeitstag-Uhr** bleibt separat oben rechts (Redaktionsschluss-Druck).

Bewusst NICHT getan: Ebenen entfernen/zusammenlegen (mechanischer Umbau mit
Risiko, Owner-Entscheidung offen). Die Entschärfung ist visuell + diese Referenz.
