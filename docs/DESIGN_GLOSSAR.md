# 📖 Design-Glossar — Owner-Sprache → Fachkonzepte

**Status:** Lebendes Übersetzungs-Werkzeug (gehört zur SOUL.md-Familie)
**Zweck:** Der Owner sagt „spannend" oder „rund" — dieses Dokument übersetzt in
etablierte Design-Konzepte, damit Briefings präzise werden. Quellen: GDC-Talks und
Interviews (Sid Meier, Will Wright, 11 bit studios, Lucas Pope), MDA-Paper. Voll-
ständige Quellen-URLs im Recherche-Bericht (Session 2026-06-13).

## 1. Das Übersetzungs-Glossar

| Owner sagt … | Fachkonzept | Bedeutung in einem Satz | Anwendung bei uns |
|---|---|---|---|
| „spannend" | **Interesting Decisions** (Sid Meier) | Spiel = Folge interessanter Entscheidungen: kein dominanter Zug, echter Trade-off, spürbare Folge | Jede Maßnahme zeigt beide Kosten (Reichweite ↑, Glaubwürdigkeit ↓, Risiko ↑) vor der Wahl |
| | **Tension-Release-Zyklus** | Druck aufbauen, dann echter Entlastungsmoment | Tagesfazit/Lagebericht als Release nach jedem Arbeitstag |
| | **Push your luck** | sicher konsolidieren vs. riskant eskalieren | aggressive Kampagne = mehr Wirkung, mehr Enttarnungsrisiko — wann hört man auf? |
| | **Eskalationskurve** | jede Phase baut auf früheren Entscheidungen auf | Institutionen/Faktenchecker werden über 10 Jahre stärker (K14 umgesetzt) |
| „Spaß machen" | **Juice / Game Feel** | Feedback-Schichten machen jede Aktion befriedigend, ohne Mechanik zu ändern | NPC-Reaktionen, Wohnzimmer-Animationen, Sounds auf Kontakt-Frames |
| | **Core Loop** | die 2–5-Minuten-Handlung, die sich nie gleich anfühlt | Beobachten → Planen (Tafel) → Ausspielen → Reaktion sehen → nächster Tag |
| | **Flow-Kanal** | Herausforderung wächst mit dem Können | Jahr 1 einfach, Gegenwehr und Verflechtung kommen gestaffelt |
| „rund / aus einem Guss" | **MDA-Framework** | Mechanik → Dynamik → Ästhetik müssen dasselbe erzählen | „Apparatschik im System" muss in jeder Schicht spürbar sein |
| | **Diegetic UI** | Interface existiert IN der Spielwelt | Narrativ-Tafel, Terminal, TV statt Web-Overlays (Verfassung §4.4) |
| „man lernt was" | **Emergenz/Systemwissen** (Will Wright) | Lernen durch eigenes Manipulieren des Systems, nicht durch Belehrung | Desinfo-Mechanismen anwenden und Folgen erleben; End-Report als Spiegel |
| | **Konsequenz-Schleife** | frühe Entscheidungen wirken sichtbar auf späte Phasen | früh gesätes Narrativ spaltet Jahre später Milieus |
| „Feinheiten entdecken" | **Possibility Space / Depth over Complexity** | wenige Regeln, riesiger Möglichkeitsraum | Akteur-/Kanal-Kombinationen mit eigenen Kettenreaktionen |
| | **Zeigarnik-Effekt** | offene Schleifen bleiben im Kopf | NPC erwähnt „schlafenden Kontakt", der erst später spielbar wird |
| „nicht zu kompliziert" | **Onboarding-Gradient** | Mechaniken nacheinander einführen | Jahr-1-Basis, dann gestaffelt; NPC-Einweisung statt Tutorial-Wand |
| | **Toy vor Game** (Wright) | erst exploratives Spielzeug, dann Win/Lose | erste Minuten freies Erkunden des Gebäudes |
| „Wege und Weichen" | **Meaningful Choice / Yes-and** | jede Wahl öffnet Neues statt richtig/falsch | Angst-Narrative erzeugen andere Gegenwehr als Nationalismus-Narrative |
| | **Meta-Loop** | Tages-Loop eingebettet in Jahres-Loop | Monatsentscheidungen → Jahres-Machtposition → neue Weichen |

## 2. Meister-Lehren (Kurzextrakt mit Anwendung)

- **Will Wright:** „Games as toys" — der Apparat ist das Spielzeug, der Spieler macht
  sein Spiel daraus; **Scheitern ist Content** — eine auffliegende Kampagne muss die
  beste Geschichte des Spiels erzählen (dramatisch inszenieren, nicht still beenden);
  Possibility Space vor Quests.
- **Sid Meier:** Beide Seiten eines Trade-offs müssen locken; keine dominante
  Strategie (Optimum muss sich über die Zeit verschieben); Konsequenzen müssen
  sichtbar sein (sofort im Wohnzimmer, mittelfristig in den Kurven).
- **11 bit (Frostpunk/This War of Mine):** Zwei gegensätzliche Druck-Metriken statt
  einer Moralnote; **„kein Jackass-Simulator"** — der Spieler-Charakter handelt aus
  Überzeugung/Pragmatismus, nie als Cartoon-Bösewicht (passt exakt zu C18/C19);
  **Permanenz** — Entscheidungen sind nicht rücknehmbar, das gibt ihnen Gewicht.
- **Lucas Pope (Papers, Please):** Routine TRÄGT die Spannung, Störungen brechen sie
  auf (unser Tagesrhythmus + Sondersendungen); das Spiel moralisiert nicht, es zeigt
  Konsequenzen; Systemzwang (Budget, Direktiven) erzeugt Drama ohne Cutscene.

## 3. Top-10-Techniken (priorisiert, unter Owner-Leitplanken)

1. **Asymmetrische Trade-offs:** beide Kosten jeder Maßnahme explizit anzeigen.
2. **Zwei parallele Druck-Metriken:** „Spaltung" und „Institutionenvertrauen" laufen
   gegeneinander (K14-Pool ist der Anfang).
3. **Permanenz:** gestreute Narrative bleiben als Marker sichtbar — überlagern statt
   löschen.
4. **Routine + Störung:** fester Tagesablauf, mindestens eine Störung pro Tag (K1).
5. **Sichtbare Konsequenz-Kette:** Rückverfolgungs-Timeline „Entscheidung → Wirkung"
   (zahlt direkt in den End-Report K8 ein).
6. **Diegetisches Feedback:** das Wohnzimmer als Haupt-Feedback (vorhanden, K2/K4
   werten es auf).
7. **Offene Schleifen:** NPC-Andeutungen, die Phasen später aufgehen (K7-Schreibregel).
8. **Onboarding-Gradient:** Mechaniken jahresweise einführen, per NPC-Einweisung.
9. **Possibility Space:** Akteur-Konstellationen variieren je Partie (Wiederspielwert).
10. **Grauzone ohne Urteil:** End-Report beschreibt sachlich Zustände statt Gut/Böse-
    Note („In Ihrer Amtszeit stieg die Medien-Skepsis um 34 % …").
