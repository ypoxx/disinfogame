# Welt-Eckpunkte: Die Westunion (Diegese-Anker)

> **Status: kanonisch** (Owner-Entscheidung 2026-06-18). Schließt eine echte
> Lücke: `VISION_LOCK.md`, `SOUL.md`, `DESIGN_GLOSSAR.md` und der Diegese-Feinplan
> definierten „Westunion" bisher **gar nicht**; die Arbeitsdaten widersprachen
> sich (Staatenbund vs. einzelner nationaler Staat). Dieser Anker ist ab jetzt die
> Referenz — widersprechende Stellen werden hieran angeglichen, nicht umgekehrt.

## Wie die Unschärfe entstand (Befund)
Auslöser war ein Beat-Entwurf „Der Stadtrat von Westunion" — ein Skalen-Fehler
(eine *kommunale* Institution an den *Dach*-Namen gehängt). Ursache war nicht der
Beat, sondern das Fundament:
- **Nirgends gesperrt definiert** — nur verstreut in Daten benutzt.
- **In sich widersprüchlich:** `world-events.json:7-8` = Staatenbund mit
  Mitgliedsstaaten (Nordmark/Gallia/Insulandia/Südland); `world-events.json:29` =
  „Regierung von Westunion / Parlamentswahlen" (einzelner Staat); `Auftraege.ts` =
  *ein* aggregiertes „Westunion"-Barometer.
- **Geografie nie gebaut:** `countries.json` ist in `SCENARIO_FRAMEWORK.md` eine
  offene `[ ]`-TODO und existiert nicht — es gab keine Stadt/Region zum Anhängen.

## Was die Westunion ist
- **Strategischer Rahmen: ein Staatenbund** (EU-/Bündnis-artig) aus mehreren
  fiktiven Mitgliedsstaaten — **kein einzelnes Land.** Trägt die Kern-Allegorie:
  Ostland (Spielerheimat) zersetzt von innen das *Bündnis*, das Ostlands
  Kriegsgegner mit Waffen und Sanktionen stützt.
- **Mitgliedsstaaten** (aus `world-events.json`): **Nordmark, Gallia, Insulandia,
  Südland.** Keine realen Staatssymbole (`SYMBOLS_AUDIT.md`).
- **Spielbühne: ein Fokus-Mitgliedsstaat.** Die meisten Beats spielen konkret in
  *einem* Staat, damit sich die Welt greifbar anfühlt „wie ein Land" — ohne den
  Bund oder die anderen Staaten aufzugeben. **Provisorischer Fokus: Gallia**
  (Spannung Souveränität-vs-Unions-Integration → ergiebig für Keil/Zweifel).
  Austauschbar; bei Bedarf ändern.

## Ebenen-Vokabular — jeder Beat nennt seine Ebene
| Ebene | Institution (Beispiel) | Skala in `world-events.json` |
|---|---|---|
| **Union** | Unionsrat, Unionswahl, Unionskommission | `national`: „All of Westunion" |
| **Mitgliedsstaat** | Regierung/Parlament von Gallia | `regional`: „Member state level" |
| **Stadt/Region** | Stadtrat von [Stadt] in Gallia | (Unter-Ebene, neu zu benennen) |
| **Transnational** | Westunion + Ostland u. a. | `transnational` |

> **Regel:** Eine „Stadtrat"-Institution gehört **immer** einer Stadt in einem
> Mitgliedsstaat — **nie** „der Westunion". Unionsweite Organe heißen
> *Unions*-… (Unionsrat/Unionswahl). Das verhindert den Skalen-Fehler.

## Anzugleichende Altlasten (Lesart festzurren, Anzeige bleibt)
- `world-events.json:29` „Regierung von Westunion / Parlamentswahlen" → als
  **Unions**-Ebene lesen (Unionswahl/-regierung), nicht als nationaler Einzelstaat.
- `Auftraege.ts`-Instrumente („Westunion-Stimmungsbarometer/-Wahltrend/
  -Vertrauensindex") → **aggregierte Unions-Messwerte** (Mittel über
  Mitgliedsstaaten), nicht ein Einzelstaat.
- `countries.json` → bei Bedarf mit den vier Mitgliedsstaaten + Fokus-Markierung
  anlegen (erfüllt die offene TODO aus `SCENARIO_FRAMEWORK.md`).

## Warum das für Beats zählt
Ohne Anker improvisiert jeder Beat seine Geografie und landet auf der falschen
Skala. Mit Anker hat jeder Beat eine klare **Bühne** (Fokus-Staat) und **Ebene**
(Union/Staat/Stadt) — lokale und unionsweite Ereignisse fühlen sich dann richtig
an, und Beats lassen sich überhaupt sauber ausformen.
