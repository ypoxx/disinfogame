# Beat-Idee #3: „Der Schwelbrand" (eskalierender Mehr-Tage-Bogen)

> In-Sitzung mit Owner geformt (2026-06-18). Status: **Konzept**. Dritter Beat
> neben #1 „Stadtrat" (`BAUPLAN_STORY_DIRECTOR_SPINE.md`) und #2 „Reale Vorlage"
> (`IDEE_BEAT_REALE_VORLAGE.md`). Geografie: Fokus-Mitgliedsstaat Gallia
> (`WELT_ECKPUNKTE_WESTUNION.md`). Prüft Offenheits-Prinzip ③ über *mehrere*
> Entscheidungspunkte.

## Grounding-Fund: den langsamen Bogen gibt es noch nicht
Eine `Episode` (`engine/EpisodeLoader.ts`) ist heute ein **Ein-Akt-Haken**: *eine*
`wendung_de`, *ein* `wirkt_auf`, ein Einklink-Punkt. Es gibt **keine** Struktur
für einen Bogen, der über Tage *läuft* und Zustand zwischen Akten trägt. Beat #3
ist damit das erste **echt neue Strukturmuster**: eine Kette verknüpfter Akte mit
getragenem Zustand (akkumuliertes Risiko + Ertrag + aktuelle „Stufe").

## Form (Owner-Entscheidung): eskalierender Bogen mit Ausstiegen
Eine Spine, aber **Einsatz UND Enttarnungs-Risiko akkumulieren** jeden Tag.
Offenheit = **WANN hörst du auf** — und das kippt mit deinem Risiko-Zustand, nie
absolut. Nie wirklich geschient: Ausstieg ist immer möglich.

## Anlass & Eskalations-Leiter
Du kultivierst über Tage eine manufakturierte Kontroverse in Gallia rund ums
Reizthema. Jede Stufe = ein Tag/Akt, größerer Ertrag, größerer Fußabdruck:
1. **Saat** — Zweifel leise setzen (niedriges Risiko, kleiner Effekt).
2. **Verstärkung** — koordinierte Amplifikation (mittel).
3. **Veredelung** — eine „glaubwürdige Stimme"/„Experten" einspannen (höher; die
   Stimme ist rückverfolgbar).
4. **Durchbruch** — realweltlicher Übersprung: ein echter Akteur greift es auf /
   eine Demo (höchster Ertrag; jetzt sichtbar genug für ernste Gegen-Ermittlung).

## Pro-Tag-Optionen
| Option | Wirkung | Kosten/Risiko |
|---|---|---|
| **Aussteigen / kassieren** | bankt den bisherigen Ertrag, Operation endet sauber | Risiko/Aufmerksamkeit **kühlen ab**; Decke (Ceiling) gekappt |
| **Nachlegen** (nächste Stufe) | höherer Ertrag | Fußabdruck wächst → **Enttarnungs-Risiko steigt**, `Gegenseite.ts` rückt näher; Backfire skaliert mit der erreichten Tiefe |
| **Spuren verwischen** (Tag ohne Vortrieb) | senkt Hitze → erlaubt späteres, tieferes Gehen | kostet einen Tag (**Tempo**) |

**Press-your-luck-Kern:** Je tiefer, desto größer der Sieg — aber eine
*Komplikation* kann zuschlagen (probabilistisch): fängt die Gegenseite einen
Faden und du stehst auf einer hohen Stufe, ist der Rückprall **proportional
größer** (Vertrauens-Rückprall ~ Tiefe/Sichtbarkeit; bei `risk ≥ 85` Enttarnung).
Tiefe hebt Belohnung **und** Katastrophe.

## Litmus (③) — generalisiert auf die Zeit-Achse, hält
- **Offenheit = Stopp-Punkt, strategie-relativ:** **Keil** treibt zur
  spektakulären Stufe 4 (max. Polarisierung/Drama); **Zweifel** bankt früh & oft
  (stetige Vertrauenserosion braucht kein Spektakel, bleibt sicher); **Wahl**
  treibt bis zur Schwelle, die seine Ziel-Fraktion kippt, dann Stopp; **überhitzt**
  (risk nahe 85) → kassieren, egal welcher Auftrag. Kein absoluter „richtiger Tag".
- **Nicht-Dominanz der Tages-Wahl:** Aussteigen = sicher+gebankt, aber Decke
  gekappt; Nachlegen = höhere Decke, höhere Katastrophe; Spuren verwischen =
  Langlebigkeit gegen Tempo. Keiner dominiert.
- **Kein einziger Weg:** der Ausgang ist eine *Kurve* (Risiko vs. Ertrag über
  Zeit); wo du landest, hängt an Auftrag + Nerv + Glück. Zwei Durchläufe desselben
  Bogens divergieren am Stopp-Punkt.

## Muster-Vergleich (jetzt drei Beats — der eigentliche Wert)
| | #1 Stadtrat | #2 Reale Vorlage | #3 Schwelbrand |
|---|---|---|---|
| Zeit | ein Schlag | ein Schlag | **mehrere Tage** |
| Auslöser | geplant | emergent | geplant, spieler-getrieben |
| Risiko-Achse | **Lautstärke** | **Authentizität** | **Dauer/Gier (akkumuliert)** |
| Leitspannung | *welche* Antwort? | *ob/wie* ausnutzen? | *wann* aufhören? |
| „Nichts tun" | abkühlen | abkühlen + sät Beat | Spuren verwischen (Bogen verlängern) |

→ Drei verschieden geformte Risiko-Achsen aus *einer* Mechanik. Die Vielfalt sitzt
in der **Geometrie der Beats**, nicht nur in den Optionen.

## Zusammenspiel mit dem Dirigenten (②)
Der Bogen ist die „Episode reif"-Stufe (Dringlichkeit-zuerst) — eine **Krise kann
ihn unterbrechen.** Das ist hier ein *Feature*: Unterbrechung mitten im Schwelbrand
zwingt zur Wahl (Bogen abbrechen, um die Krise zu lösen? durchziehen und beides
riskieren?) und hebt die Press-your-luck-Spannung. ② und #3 verstärken sich.

## Pädagogischer Kern
Lehrt, wie Desinfo-Kampagnen **eskalieren und kumulieren**, und das eigentliche
Operateurs-Dilemma: *Gier vs. Enttarnung über Zeit*. Harte Wahrheit: **Viralität
und Entdeckbarkeit steigen zusammen** — die größten Operationen sind auch die,
die am ehesten auffliegen und zurückschlagen.

## Implementierungs-Delta (falls gebaut)
Neu nötig: eine **Bogen-Struktur**, die Episode-Akte per Arc-ID verkettet und
Zustand trägt (aktuelle Stufe, akkumuliertes Risiko/Ertrag, Komplikations-
Wahrscheinlichkeit). Wiederverwendet: `risk`/`attention`-Akkumulation +
Abkühl-/Enttarnungs-Mechanik (`StoryEngineAdapter.ts`), `Gegenseite.ts` als
eskalierende Bedrohung, `wirkt_auf`/Signatur für den Ertrag. Kein neues
Wert-System.
