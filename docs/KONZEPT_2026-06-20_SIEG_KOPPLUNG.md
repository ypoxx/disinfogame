# 🎯 Konzept zur Owner-Entscheidung: „Wofür gewinnt man eigentlich?" (R2 / Sieg-Kopplung)

**Version 2** · 2026-07-02 (Erstfassung 2026-06-20) · **Branch:** `claude/gracious-keller-g43bu3` ·
**Status:** ✅ **BEANTWORTET** durch `DECISIONS_2026-07-04_TRANSKRIPT_SIEG.md` (E1–E20);
Nachfolger/Zielbild: `ZIELBILD_2026-07-04_WETTRENNEN.md`. Der **Anhang (8 Nebenbefunde)
bleibt aktiv reparaturwürdig** und ist Teil von Etappe 0.
**Für:** Owner (mündliche Transkript-Antwort erwünscht — Fragen sind nummeriert: F1, F2 …)

> **Was ist Version 2?** Vor deiner Antwort habe ich das gesamte Konzept einer unabhängigen
> Zweitprüfung unterzogen: vier getrennte Tiefen-Analysen von Code (Sieg-Mechanik, Gesellschaftsmodell,
> Gegenseite) und allen Dokumenten. **Der Kern hält.** Aber ich habe eigene Übertreibungen gefunden und
> korrigiert, zwei verschwiegene Konflikte offengelegt und drei neue Erkenntnisse eingearbeitet.
> Die Änderungen im Überblick:
> 1. **„Zehn Experten geschlossen" war zu dick aufgetragen** — es sind vier von zehn, die diesen Punkt
>    ausdrücklich machen (korrigiert in §2 und F2).
> 2. **„Im Intro wörtlich" war ungenau** — das Spiel paraphrasiert das Versprechen, wörtlich steht es
>    nur in Design-Doku und Code (korrigiert in §2).
> 3. **Neu entdeckt: Das Wettrennen existiert schon — unsichtbar.** Die Verteidiger holen bereits heute
>    jede Phase Vertrauen zurück. Radikal 2 wäre kein Neubau, sondern das Sichtbar- und Schärfermachen
>    einer existierenden Mechanik (§5).
> 4. **Neu entdeckt: „gewinn- und verlierbar" ist heute durch KEINEN Test garantiert** — ich hatte die
>    Balance-Absicherung besser dargestellt, als sie ist (§7).
> 5. **Neu offengelegt: Einige Empfehlungen kollidieren mit deinen eigenen, früher „gelockten"
>    Prinzipien** (SOUL-Prinzipien, „Schaufenster"-Regel). Das gehört dir auf den Tisch, nicht unter
>    den Teppich → neuer Abschnitt §7b und neue Fragen F22–F25.

> **Lies das hier ohne Vorwissen.** Ich erkläre jeden Fachbegriff in Klammern. Wenn etwas unklar ist,
> ist das mein Fehler, nicht deiner — sag es einfach im Transkript.

---

## 1. Die Sache in drei Sätzen

Das Spiel hat heute **zwei Anzeigetafeln**, die kaum miteinander verbunden sind: eine sichtbare
(„wie steht die Gesellschaft?") und eine versteckte („hast du gewonnen?"). Deine **spannendsten
Entscheidungen** bewegen die sichtbare Tafel — aber **nicht** die versteckte, an der Sieg oder
Niederlage hängen. Deshalb fühlt sich vieles bedeutsam an, ohne wirklich zu zählen — genau dein
„Bauchgefühl".

---

## 2. Das Problem, mit einem Bild

Stell dir vor, du führst eine Kampagne. An der Wand hängt ein **Whiteboard** mit deinem eigentlichen
Ziel: „die Gesellschaft spalten". Das bewegt sich sichtbar, wenn du arbeitest — Polarisierung steigt,
das Vertrauen der Lager zueinander sinkt. Gut.

Aber **gewonnen** wird die Kampagne an einer **anderen Kennzahl im Hinterzimmer**: dem „Vertrauen in
die Institutionen". Und ausgerechnet deine spektakulärsten Schachzüge berühren diese Hinterzimmer-Zahl
**kaum**. Es ist, als würdest du für einen Marathon trainieren, aber gewertet wird heimlich dein
Ruhepuls.

*(Präzisierung aus der Zweitprüfung: Die sichtbare Tafel ist nicht komplett folgenlos — die
Gesellschaftswerte schalten Episoden frei und bestimmen die **Qualität** deines Endes. Aber auf Sieg,
Niederlage, Risiko, Krisen und das Verhalten deiner Leute haben sie exakt null Einfluss. Die Kopplung
ist eine Einbahnstraße in die Deko.)*

### Das in einem konkreten Spielmoment (im Code verifiziert)
- Du spielst den großen Entscheidungs-Moment „Stadtrat" und wählst den **lauten** Weg → **Polarisierung
  +18**. Das Whiteboard springt. **Die Sieg-Zahl bewegt sich: 0.**
- Stattdessen klickst du nebenbei eine billige „Reichweite verstärken"-Aktion → die Sieg-Zahl (Vertrauen)
  sinkt ein Stück. **Sieg-Fortschritt: ja.**

**Ergebnis:** Der *dramatische* Zug ist Deko, der *langweilige* Zug gewinnt. Das ist die Umkehrung von
dem, was ein gutes Spiel will — und die Wurzel deines Eindrucks, dass „es noch kein Gesamtkonzept ist".

*(Pikantes Detail aus der Zweitprüfung: Zwei Beats haben in ihren Daten sogar ein „Vertrauen −12"
hinterlegt — die Autoren-Absicht war also da. Der Code **verwirft** diesen Wert aktiv, und ein Test
sichert das Verwerfen ab. Die Absicht existiert, die Wirkung ist abgeklemmt.)*

### Warum das so gebaut wurde (das war kein Versehen — und hatte ZWEI Gründe)
Es gibt eine bewusste Regel namens **R2**: „Episoden und Entscheidungs-Beats verändern die Sieg-Zahl
NICHT." Dahinter standen zwei Motive:
1. **Vorsicht:** Die Sieg-Mathematik sollte nicht durch neue Inhalte durcheinandergebracht werden.
2. **Prinzip** (das hatte ich in Version 1 unterschlagen): R2 setzte deine eigene Losung „Vertrauens-
   erosion ist nur das *Mittel*" mechanisch um — der ausbalancierte Vertrauens-Pfad sollte als gültiger
   Sieg erhalten bleiben, während Beats „andere Achsen" bespielen.

**Vier der zehn Review-Experten** (die Systems-, Dilemma-, Politiksim- und Tycoon-Perspektive) benennen
diese Schutzregel heute ausdrücklich als **den Engpass**; die übrigen sechs arbeiten an Nachbarthemen
(Ton, Onboarding, Sprache, UX), deren Befunde aber an derselben Wurzel zusammenlaufen — so steht es in
der Synthese. In Version 1 hatte ich daraus „zehn Experten geschlossen" gemacht; das war zu dick
aufgetragen. Am Befund selbst ändert das nichts, wohl aber an der Ehrlichkeit der Vorlage.

### Ein zweiter, verwandter Webfehler
Dein Spiel arbeitet mit dem Versprechen **„Vertrauen = Mittel, Auftrag = Ziel."** Präzise gesagt
(Korrektur zu Version 1): *Wörtlich* steht dieser Satz in deiner Design-Doku und in Code-Kommentaren.
Im Spiel selbst sagt ihn Direktor Volkov bei der Auftragswahl **sinngemäß**: *„Das Vertrauen der Leute
zu zersetzen, ist nur das Mittel. Sagen Sie mir das Ziel. Daran misst die Zentrale Ihren Erfolg."*
Im Code ist es aber **umgekehrt** gebaut: Vertrauen IST das Ziel (daran gewinnt man), und der Auftrag
ist nur *Verzierung des Schluss-Bildschirms* (er bestimmt, ob das Ende „voll/teilweise/hohl" heißt —
sonst nichts). Das Spiel sagt A und tut B. Der Code dokumentiert das sogar selbst: „Bisher war der
Auftrag nur ein Schluss-Satz … bewusst NUR Erzähltext."

---

## 2b. Wichtig: Diese Frage ist nicht ganz neu — du hast sie schon einmal beantwortet

Das gehört zur Ehrlichkeit dieser Vorlage (in Version 1 fehlte es): **F1 ist keine jungfräuliche
Grundsatzfrage.** Am **14.06.** hast du im Transkript selbst das Reframe gesetzt:

> „In der Realität bricht eine Gesellschaft durch Desinfo nicht einfach ‚zusammen' — man **erreicht
> bestimmte Ziele**. Also: **Vertrauenserosion ist das Mittel, der Auftrag ist das Ziel.**"

Und die damalige Festlegung sagte ausdrücklich: **„v1 darf ‚Vertrauen erodieren' als einzigen
spielbaren Sieg implementieren"** — der heutige Zustand war also als *Zwischenschritt* markiert, nicht
als Endzustand. Ein älteres Struktur-Review (15.06.) hat zudem zweimal empfohlen, die Auftrags-Signatur
zur echten Sieg-Bedingung zu machen, und die „für alle Aufträge identische Sieg-Bedingung" den größten
Wiederspielwert-Killer genannt.

**Was das bedeutet:** Option B (unten) ist nicht „eine radikale neue Idee", sondern die **Einlösung
deiner eigenen Vorentscheidung**. F1 fragt deshalb ehrlicherweise nicht „was soll gewinnen?" ins Blaue,
sondern: **„Bestätigst du deine Richtung vom 14.06. — und soll sie jetzt eingelöst werden?"** Du kannst
sie natürlich auch revidieren; aber du solltest wissen, dass du damit eine eigene frühere Entscheidung
kippst, nicht nur eine Empfehlung ablehnst.

---

## 3. Worum es bei der Entscheidung WIRKLICH geht

Die ganze Frage lässt sich auf einen Satz eindampfen:

> **Was bedeutet „gewinnen" in deiner Vision — die Institutionen mürbe machen, oder deinen konkreten
> Auftrag an der Gesellschaft vollenden?**

Alles Weitere folgt aus deiner Antwort. Deshalb steht sie ganz oben im Fragenkatalog (F1).

---

## 4. Die Optionen — vom Vorsichtigen zum Mutigen

Ich beschreibe jede Option mit: **Bild** (was ist es), **Spielgefühl** (wie erlebt es der Spieler),
**Folgen** (Aufwand/Risiko/Balance/Bildung). Am Ende meine Empfehlung.

### Option 0 — Alles bleibt (R2 bleibt)
- **Bild:** Vertrauen bleibt die alleinige Sieg-Zahl; Auftrag & Gesellschaft bleiben im Wesentlichen Deko.
- **Spielgefühl:** wie heute — gute Inhalte, aber die großen Entscheidungen „zählen nicht".
- **Folgen:** kein Aufwand, kein Risiko. **Aber:** dein Bauchgefühl bleibt; die Experten-Kritik bleibt;
  zwei der drei Aufträge bleiben „Tachos ohne Pedal" — und deine eigene v1-Markierung („Zwischenschritt")
  bliebe dauerhaft uneingelöst. → Ich empfehle das **nicht**.

### Option A — Die kleine, vorsichtige Kopplung *(der billige Test)*
- **Bild:** Wir bauen **eine Brücke**: eine verrohte Gesellschaft (viel Polarisierung + Zynismus, wenig
  Diskursqualität) **erodiert mit der Zeit das Vertrauen von selbst**. Deine Beats/Episoden bewegen die
  Gesellschaft → und die Gesellschaft zieht (verzögert) am Vertrauen → also zählen deine großen
  Entscheidungen jetzt **mittelbar** für den Sieg.
- **Spielgefühl:** „Wenn ich den Graben vertiefe, bröckelt das Vertrauen langsam nach. Meine
  dramatischen Züge wirken — nur nicht sofort, sondern mit Nachlauf." Ehrlich und glaubwürdig
  (so funktioniert reale Desinformation auch: erst verrohen, dann bröckelt das Vertrauen).
- **Folgen:** **kleiner, umkehrbarer Eingriff** (eine neue „Wirkungs-Kante" in der Gesellschaftsformel —
  exakt der Vorschlag der Politiksim-Kritikerin). R2 wird von „Beats ändern den Sieg nie" zu „Beats
  ändern den Sieg über den Umweg Gesellschaft". **Gut als erster Schritt, um zu *fühlen*, ob die
  Richtung stimmt.**

### Option B — Die ehrliche Kopplung: *Der Auftrag IST der Sieg* *(die Einlösung deiner Vorentscheidung)*
- **Bild:** Wir bringen den Code zur Deckung mit deinem eigenen Versprechen vom 14.06. **Gewonnen** wird,
  wenn du deinen **Auftrag** erreichst (Keil: Gesellschaft auf die Spaltungs-Zielwerte treiben; Zweifel:
  Vertrauen/Diskurs auf die Zweifel-Zielwerte). Das **Vertrauen-Erodieren** wird zum **Mittel/Werkzeug**
  (es hilft dir, ist aber nicht mehr „der Sieg an sich"). **Verlieren** bleibt wie heute über
  **Enttarnung / Apparat zerfällt / pleite** — also: du *gewinnst* über deinen Auftrag, du *verlierst*
  über Überdrehen/Aufliegen.
- **Spielgefühl:** „Ich gewinne, indem ich das Land tatsächlich so umforme, wie meine Mission es verlangt
  — und **jeder** Beat, jede Episode, jede Aktion, die diese Werte bewegt, ist direkter Fortschritt."
  Zum ersten Mal sind die drei Aufträge **wirklich drei verschiedene Spiele**.
- **Feinheit** (aus der Zweitprüfung): Beim Standard-Auftrag **Keil** ist die Entkopplung heute total —
  seine Zielwerte liegen komplett auf der Gesellschafts-Tafel, die für den Sieg nicht zählt. Bei
  **Wahl** und **Zweifel** enthält das Ziel auch die Vertrauens-Achse; dort wäre die Kopplung teilweise
  automatisch mit drin. Option B macht also ausgerechnet den Auftrag heil, den jeder neue Spieler zuerst
  spielt.
- **Folgen:** **großer, aber sauberer Eingriff.** Das Fortschritts-Maß `auftragProgress` (= „wie nah bist
  du an deiner Auftrags-Signatur") **existiert schon** — es treibt heute nur das Schluss-Bild; wir machen
  es zum echten Sieg. Die gesamte Balance verschiebt sich auf die Gesellschafts-Achsen → **gründliches
  Nachbalancieren mit Simulation nötig.** Nebenwirkung (positiv): schwache und tote Aktionen **müssen**
  repariert werden, weil sie sonst wertlos sind — das zwingt zur längst fälligen Aufräumarbeit.
  **Das ist die Option, die dein Bauchgefühl an der Wurzel heilt.**

### Option C — Beides muss erfüllt sein (Doppel-Sieg)
- **Bild:** Sieg = Vertrauen-Ziel **gehalten** UND Auftrag-Ziel **erreicht**. Wer das Vertrauen bricht,
  aber den Auftrag verfehlt, bekommt einen echten **„hohlen Sieg"** (ein schlechteres Ende mit echten
  Folgen, nicht nur ein anderer Text — heute ist der „hohle Sieg" exakt das: nur ein anderer Satz im
  Epilog, im Code verifiziert).
- **Spielgefühl:** „Ich muss zweierlei schaffen — die Institutionen erschüttern UND mein spezielles Ziel
  erreichen." Am reichsten, aber auch am forderndsten; Gefahr, dass es sich wie **zwei Pflichtaufgaben**
  anfühlt.
- **Folgen:** am schwersten auszubalancieren und am schwersten zu erklären. Treu zum vollen Spruch
  („Vertrauen = Mittel UND Auftrag = Ziel"), aber Komplexitäts-Risiko. Eher ein *späteres* Ausbau-Ziel
  als ein erster Schritt.

---

## 5. Radikale Ideen (auf deinen Wunsch — gut durchdacht, ehrlich abgewogen)

### Radikal 1 — Die Sieg-Zahl ganz abschaffen; der Sieg ist ein sichtbarer Welt-Zustand
- **Bild:** Keine abstrakte „Vertrauen 40"-Leiste mehr. Du gewinnst, wenn die **Gesellschaft selbst** zu
  bestimmten Schlüsselmomenten (Wahlen, Krisen, die der Spielleiter terminiert) kippt — z. B. „Am
  Wahlabend teilen die zwei Lager keine gemeinsame Tatsache mehr." Die Zahlen werden **unsichtbar**; was
  du beobachtest, ist das **Land** (Sendungen, Umfragen, Bevölkerungs-Milieus), das sich verändert.
- **Warum reizvoll:** maximal verständlich UND immersiv zugleich — der Sieg *ist* die Fiktion. Löst drei
  Probleme auf einmal (Kopplung + „das Modell ist unsichtbar" + „zwei Welten"-Bruch).
- **Folgen/Ehrlichkeit:** **großer Umbau** — und er kollidiert mit deiner „Schaufenster"-Regel (siehe
  §7b). Hoher Lohn, hoher Aufwand. Eher **Zielbild** als nächster Schritt.

### Radikal 2 — Das Immunsystem als echter Gegner: Gewinnen wird ein Wettrennen ⭐ (mein Favorit unter den Radikalen)
- **Bild:** Die „Gegenseite" (Faktenchecker, Behörden, kritische Öffentlichkeit) wird zum **mechanischen
  Gegenspieler**, der die Gesellschaft aktiv **repariert** (Vertrauen zurückholt, Bevölkerungs-Milieus
  „impft", also widerstandsfähig macht). Du **gewinnst das Rennen**, wenn du dein Auftrags-Ziel
  erreichst, **bevor das Immunsystem dich einholt**.

- **Die wichtigste neue Erkenntnis der Zweitprüfung: Dieses Rennen existiert schon — unsichtbar.**
  Im Code holen die Verteidiger **bereits heute** jede Phase Vertrauen zurück (je stärker sie werden,
  desto mehr), können dir ein fast erreichtes Sieg-Ziel wieder „wegnehmen", und deshalb musst du das
  Ziel 3 Phasen **halten**. Es gibt Ermittler mit Enttarnungs-Countdown und ein Wettrüsten-Level.
  **Nur: Der Spieler sieht davon fast nichts.** Radikal 2 ist also weniger „Neubau" als **„das
  versteckte Rennen sichtbar machen und ihm Zähne geben"** — das senkt Aufwand und Risiko erheblich
  gegenüber meiner Schätzung in Version 1.

- **Auch schon (halb) da — gebaut, aber nicht eingesteckt** (wörtlich: fertiger Code ohne Anschluss):
  - Ein komplettes **Gegenmaßnahmen-System** (~20 realistische Maßnahmen nach dem Fach-Framework DISARM,
    mit Spieler-Reaktions-Optionen) liegt fertig im Code — **wird aber von keiner Stelle im Spiel
    aufgerufen.**
  - Die Plattform-Moderation kann Aktionen **sperren** — die Sperre wird nirgends durchgesetzt.
  - Verrats-Ereignisse definieren echte Folgen (Leaks, Netzwerk-Schaden, NPC-Verlust) — angewendet wird
    davon **nichts**, der Verrat bleibt ein erzähltes Modal.
  - Das reiche **8-Milieu-Publikumsmodell** (Erreichbarkeit, Stimmung, Glaube je Milieu) läuft als
    reines Schaufenster ohne Rückwirkung.
- **Was wirklich NEU gebaut werden müsste** (der ehrliche Kern des Aufwands): die **Immunisierung
  selbst** — dass eine wiederholte Masche bei bereits „geimpften" Milieus an Wirkung verliert. In
  Version 1 hatte ich behauptet, „eure Engine modelliert das schon heimlich" — **das war übertrieben.**
  Es gibt nur eine globale Risiko-Dämpfung im Operations-Pfad und Verteidiger, die bei Wiederholung
  *stärker* werden. Ein echtes „diese Masche zieht bei den Nostalgischen nicht mehr"-Gedächtnis
  existiert nicht und wäre Neubau.
- **Warum es trotzdem die stärkste Idee bleibt:** Es verknotet vier Probleme zu einer Mechanik:
  Sieg-Kopplung, sichtbarer Preis im Loop, Tempo/Nervenkitzel, und der Bildungs-Kern (man *erlebt*
  Prebunking/Resilienz als Mechanik — genau das, was die Inokulations-Forschung als wirksam zeigt).
- **Folgen/Ehrlichkeit:** immer noch der größte Umbau der hier genannten — aber etwa die Hälfte des
  Fundaments liegt fertig da. **Und:** ein Wettrennen erzeugt Zeitdruck, und das kollidiert mit deinem
  gelockten SOUL-Prinzip „keine künstliche Verknappung / keine tickende Uhr" (§7b, F22). **Ich empfehle
  es weiterhin als Zielbild, auf das die Schritte A→B natürlich zulaufen — aber nur, wenn du das
  Prinzip bewusst revidierst.**

### Radikal 3 — Man kann gar nicht „sauber" gewinnen; der eigentliche Punktestand ist die Abrechnung
- **Bild:** Jeder „Sieg" ist pyrrhisch; der bedeutsame End-Zustand ist die Erkenntnis (im Stil von
  „Papers, Please"/„Train": du hast effizient optimiert — und *genau das* war das Verbrechen).
- **Ehrlichkeit:** intellektuell faszinierend, aber **riskant** — kann frustrieren und widerspricht
  „gewinn- und verlierbar" sowie deinem Prinzip „niedrigschwellig, Spaß zuerst". Ich führe es der
  Vollständigkeit halber auf, **empfehle es nicht** als tragendes Prinzip (höchstens als *eine*
  Ton-Farbe im Ende, die ihr teilweise schon habt: der „hohle Sieg").

---

## 6. Meine Empfehlung: eine Leiter, kein Sprung

Nicht „alles oder nichts", sondern drei Stufen, jede für sich sinnvoll und absicherbar:

1. **Stufe 1 — Option A (die Brücke):** klein, umkehrbar, mit Simulation abgesichert. Ziel: *fühlen*, ob
   „meine großen Entscheidungen zählen jetzt" stimmt. **Risiko gering.**
2. **Stufe 2 — Option B (Auftrag = Sieg):** die Einlösung deiner Vorentscheidung vom 14.06., die Code
   und Versprechen zur Deckung bringt und die drei Aufträge zu drei Spielen macht. **Mittleres Risiko,
   hoher Lohn.**
3. **Stufe 3 — Radikal 2 (Immunsystem als Gegner):** das Zielbild, das Sieg, Konsequenz, Tempo und
   Bildung in einer Mechanik vereint — auf halb fertigem Fundament (§5). **Setzt deine bewusste
   Revision des „keine tickende Uhr"-Prinzips voraus (F22).**

Jede Stufe ist ein eigener, lieferbarer Schritt mit grünem Gate (alle Tests bestehen). Wir können nach
jeder Stufe innehalten und du entscheidest, ob die nächste kommt.

---

## 7. Was das quer für alles bedeutet (Konsequenzen ehrlich)

- **Balance (korrigiert und wichtiger als gedacht):** In Version 1 schrieb ich, die Sieg-Mathematik sei
  „mühsam eingestellt" und müsse bei einer Kopplung „neu nachgewiesen" werden. Die Zweitprüfung zeigt:
  **Es gibt heute überhaupt keinen Test, der garantiert, dass das Spiel gewinnbar UND verlierbar ist.**
  Es gibt einen Test, der die Effekt-Zahlen einfriert (gegen versehentliches Verstellen), und
  Simulationen, die Siegquoten *messen und loggen* — aber nichts schlägt Alarm, wenn das Spiel
  unbesiegbar oder unverlierbar würde. **Konsequenz:** Der Umbau ist nicht nur ein Risiko für die
  Balance — er ist die Gelegenheit, diese Garantie **zum ersten Mal** als harten Test zu verankern
  („Simulation muss x % Siege und y % Niederlagen produzieren, sonst rot"). Das würde jede spätere
  Änderung für immer absichern.
- **Inhalt (präzisiert):** „Die Hälfte des Katalogs bewegt nichts" stimmt nur in der weichen Lesart.
  Exakt nachgezählt: Von 143 Aktionen sind **23 (16 %) wirklich tot** (null Gesellschaftswirkung — fast
  alle Analyse- und Infrastruktur-Aktionen), **weitere 45 (31 %) wirken nur als kaum spürbares
  Grundrauschen**. Zusammen 48 % — daher „rund die Hälfte". Option B/Radikal 2 **erzwingt**, dass diese
  Aktionen echte Wirkung bekommen (oder ehrlich als Vorbereitung/Infrastruktur ausgewiesen werden).
- **Episoden/Beats:** ihre Wirkungs-Stärke muss zu ihrer dramatischen Bedeutung passen (verifiziert:
  eine Beat-Option bewegt ihre Leitachse um 16–24 Punkte, eine Episode um 4–5 — Faktor 3–5. Der
  Höhepunkt einer wochenlangen Episode wirkt schwächer als eine beiläufige Beat-Antwort). Das ziehen
  wir gerade.
- **Die drei Aufträge:** werden zum ersten Mal mechanisch verschieden (Details in Option B).
- **Ökonomie (neu, aus dem Tycoon-Review):** Das Budget wächst heute passiv (+5 pro Phase), und Pleite
  ist praktisch unmöglich (sie erfordert gleichzeitig hohes Risiko). Geld ist damit kein echter Druck.
  Ob das so bleiben soll, ist eine eigene Owner-Frage (F25) — sie ist unabhängig von F1, gehört aber
  ins selbe Gesamtbild „wovor hat der Spieler Angst?".
- **Bildung:** wird **stärker**, nicht schwächer — besonders mit Radikal 2 (man erlebt
  Resilienz/Prebunking als Spielmechanik) und mit „Preis im Loop" (man spürt den Schaden, statt ihn erst
  im Abspann zu lesen). **Aber:** Letzteres berührt dein gelocktes Prinzip „der End-Report ist der
  Lernmoment" (§7b, F23).
- **Was wir NICHT anfassen:** das gute „Spielzeug" (Sendung→Publikum), die Entscheidungs-Grammatik der
  Beats, die gute Schreibe. Die bleiben — sie werden nur endlich *angeschlossen*.

---

## 7b. NEU: Wo diese Vorlage mit deinen eigenen gelockten Prinzipien kollidiert

Du hast früher Prinzipien „gelockt" (= als kanonisch festgeschrieben). Drei davon stehen in Spannung zu
Empfehlungen dieser Vorlage. Das ist kein Grund, die Empfehlungen zu verwerfen — aber du sollst wissen,
**dass ein Ja an diesen Stellen ein bewusstes Umentscheiden ist**, kein bloßes Nicken:

1. **SOUL-Prinzip 3: „Keine künstliche Verknappung, keine tickende Uhr."**
   → Radikal 2 (Wettrennen) und ein „Sturm, den man kommen sieht" (F4) erzeugen genau das: Zeitdruck.
   Der Tycoon-Kritiker fordert ausdrücklich, dieses Prinzip zu überdenken. **Deine Entscheidung: F22.**
2. **SOUL-Prinzip 5: „Bildung durchs Ganze; der End-Report ist DER Lernmoment."**
   → Drei Erzähl-/Bildungs-Experten empfehlen, Preis und Widerlegung **in den Spiel-Loop** zu holen
   (F13/F15). Das verschiebt den Lernmoment nach vorn — gegen den Wortlaut des Prinzips.
   **Deine Entscheidung: F23.**
3. **Die „Schaufenster"-Regel (14.06.): „Broadcast/Publikum wirkt NICHT auf die Mechanik zurück."**
   → Radikal 1 und Radikal 2 leben davon, dass Publikum/Milieus mechanisch zurückwirken (Immunisierung,
   kippende Milieus als Sieg-Zustand). **Deine Entscheidung: F24.**

**Interessant dabei:** Deine Vision-Dokumente sind hier untereinander gespalten. Das visuelle
Nordstern-Dokument beschreibt den idealen Spieltag bereits als *„Institutionen gewinnen täglich
Vertrauen zurück = Wettrennen"*, mit kippendem Publikum und Redaktionsschluss-Mahnung — also genau das,
was SOUL-Prinzip 3 und die Schaufenster-Regel verbieten. Einer deiner beiden Nordsterne muss also
ohnehin weichen; die Frage ist nur, welcher.

---

## 8. Fragenkatalog (bitte mündlich, Nummern nennen — „F1: …")

> Du musst **nicht alle** beantworten. Aber je mehr, desto präziser kann ich bauen. Antworte ruhig in
> Bildern und Wirkungen („soll sich anfühlen wie …") — das Übersetzen in Mechanik ist mein Job.

### A — Die Grundsatzfrage (die wichtigste)
- **F1:** Am 14.06. hast du entschieden: „Vertrauenserosion ist das Mittel, der Auftrag ist das Ziel" —
  und der heutige Vertrauens-Sieg war ausdrücklich nur als v1-Zwischenschritt markiert. **Bestätigst du
  diese Richtung — soll der Auftrag jetzt zum echten Sieg werden (Option B)?** Oder revidierst du sie
  (Vertrauen bleibt der Sieg / oder beides, Option C)?
- **F2:** Soll deine *spannendste* Entscheidung des Tages (ein Beat/eine Episode) den Sieg **spürbar
  mitbewegen**? (Heute: nein — per R2 hart abgeklemmt, sogar wo die Beat-Daten es wollen. Vier der zehn
  Experten fordern die Kopplung ausdrücklich.)
- **F3:** Falls du bei „Vertrauen als Sieg" bleibst: Soll wenigstens die Brücke gebaut werden, dass eine
  verrohte Gesellschaft das Vertrauen von selbst erodiert (Option A)?

### B — Tempo, Spannung, Verlieren
- **F4:** Wie soll sich die Bedrohung anfühlen — ein **Sturm, den man kommen sieht** (angekündigt,
  unausweichlich, Frostpunk-Stil), oder eher ein schleichender Druck? (Heute: ~3,5 Jahre „Schonzeit",
  dann milder Anstieg. Achtung: „Sturm" berührt F22.)
- **F5:** Soll **Verlieren** so bleiben wie jetzt (Enttarnung / der eigene Apparat zerfällt / pleite),
  während man über den Auftrag *gewinnt*? Oder soll man auch *am Auftrag scheitern* können (Zeit läuft
  ab, Ziel nie erreicht)?
- **F6:** Darf es einen **echten „hohlen Sieg"** geben — du brichst das Vertrauen, verfehlst aber dein
  Ziel — mit spürbar schlechterem Ausgang? (Heute existiert er nur als anderer Epilog-Satz.)

### C — Die Gegenseite / das Immunsystem (Radikal 2)
- **F7:** Reizt dich die Idee, dass **Gewinnen ein Wettrennen** gegen ein erwachendes „Immunsystem" der
  Gesellschaft wird? (Neu aus der Zweitprüfung: dieses Rennen existiert schon unsichtbar im Code — die
  Verteidiger holen heute schon jede Phase Vertrauen zurück. Die Frage ist also eher: sichtbar machen
  und schärfen?) Bauchgefühl genügt.
- **F8:** Soll die Gegenseite ein **echter Gegner mit Zähnen** sein (macht deine Aktionen wirkungsloser,
  sperrt Kanäle, „impft" Milieus — vieles davon liegt fertig, aber nicht eingesteckt im Code), oder
  lieber atmosphärischer Kommentar bleiben?
- **F9:** Findest du es gut, wenn der Spieler **am eigenen Leib lernt**, dass wiederholte Maschen
  irgendwann verpuffen (das ist der reale „Prebunking"-Effekt — müsste neu gebaut werden)? Oder soll
  Manipulation sich durchgehend „mächtig" anfühlen?

### D — Sichtbarkeit & Ehrlichkeit gegenüber dem Spieler
- **F10:** Soll der Spieler das **Wirkungs-Geflecht sehen** (Pfeile: „Polarisierung treibt
  Fragmentierung", wie im Spiel *Democracy*) — oder soll das Räderwerk **geheimnisvoll** bleiben und der
  Spieler es selbst erspüren? (Heute sieht er 4 von 8 Gesellschaftswerten, den Rest nie.)
- **F11:** Beim *Planen* einer Aktion: möchtest du **eine klare Hauptwirkung** sehen („das treibt deinen
  Auftrag um X") — oder lieber mehrere kleine Hinweise?

### E — Die Tonalität des Erfolgs (eine kleine, aber heikle Frage)
- **F12:** Wenn du gerade etwas Fieses getan hast (eine Faktencheckerin zermürbt) — soll das Spiel dir
  **gratulieren** („AKTION ERFOLGREICH ✓", grün) oder dich **kühl quittieren** („Vollzogen.")? Die
  Erzähl-Experten sagen: das grüne Häkchen feiert die Tat und untergräbt die Bildung.
- **F13:** Wie viel **Unbehagen** willst du dem Spieler zumuten? Soll Manipulieren sich „glatt und gut"
  anfühlen (und die Reflexion kommt am Ende), oder soll schon im Spielen ein **leiser schlechter
  Beigeschmack** mitlaufen? (Berührt F23.)

### F — Bildungs-Ziel vs. Spielspaß
- **F14:** Wenn Bildungs-Wirkung und Spielspaß mal in Konflikt geraten — welche Seite gewinnt im Zweifel?
- **F15:** Soll die „so erkennt man das"-Lehre **mitten im Spiel** auftauchen (sofort nach einer Aktion
  ein Satz „von außen erkennt man das so …"), oder gebündelt am Ende bleiben? (Forschung: mittendrin
  wirkt besser. Berührt F23.)

### G — Risiko, Umfang, Reihenfolge
- **F16:** Bist du bereit für eine **Phase, in der die Balance wackelt**, wenn am Ende ein deutlich
  besseres Spiel steht — und wir dabei erstmals einen harten „gewinnbar UND verlierbar"-Test verankern
  (den es heute nicht gibt)? Oder soll jeder Schritt **jederzeit voll spielbar/stabil** bleiben?
- **F17:** Bevorzugst du die **Leiter** (erst die kleine Brücke A *fühlen*, dann B, dann das Rennen) —
  oder willst du **direkt auf das Zielbild** (Option B bzw. Radikal 2) zusteuern?
- **F18:** Gibt es einen **Termin/Anlass** (Präsentation, Test mit echten Spielern), auf den wir
  hinbauen sollten? Das ändert, wie groß ich die Schritte schneide.

### H — Radikale Ideen (deine Reaktion)
- **F19:** Radikal 1 („keine Sieg-Zahl, der sichtbare Welt-Zustand *ist* der Sieg") — Bauchgefühl:
  reizvoll oder zu abstrakt/zu viel?
- **F20:** Radikal 3 („man kann nicht sauber gewinnen, die Abrechnung ist der Punktestand") —
  vollständig ablehnen, oder als *eine* Ton-Farbe im Ende behalten?
- **F21:** Hast du selbst ein **Bild im Kopf**, wie sich der „perfekte" Sieg-Moment anfühlen soll? (Was
  siehst du auf dem Bildschirm, wenn der Spieler gewonnen hat?) — Solche Sätze sind für mich Gold.

### I — NEU: Deine gelockten Prinzipien (aus der Zweitprüfung, §7b)
- **F22:** SOUL-Prinzip 3 sagt „keine tickende Uhr". Radikal 2 und der „Sturm" (F4) brauchen aber
  Zeitdruck. **Bist du bereit, dieses Prinzip zu revidieren** — oder ist es unantastbar (dann fällt
  Radikal 2 in dieser Form)?
- **F23:** SOUL-Prinzip 5 sagt „der End-Report ist DER Lernmoment". Drei Experten wollen Preis und
  Widerlegung **in den Loop** holen. **Darf der Lernmoment nach vorn wandern** — oder bleibt er
  bewusst am Ende gebündelt?
- **F24:** Die „Schaufenster"-Regel sagt „das Publikum wirkt nie auf die Mechanik zurück". Radikal 1/2
  brauchen genau diese Rückwirkung (Milieus, die sich immunisieren oder kippen). **Darf das Schaufenster
  eine echte Kasse bekommen?**
- **F25:** Geld ist heute kein Druck (Budget wächst passiv, Pleite fast unmöglich). **Soll Ökonomie ein
  echter Spannungshebel werden** (knapper werdende Mittel, Geldgeber mit Erwartungen) — oder bewusst
  entspannt bleiben, damit der Fokus auf Risiko/Moral liegt?

---

## 9. Wenn du nur EINE Frage beantwortest
Dann **F1**: *Bestätigst du deine Richtung vom 14.06. — Auftrag = Ziel, jetzt einlösen?* Alles andere
kann ich daraus ableiten und dir als nächsten, kleinen, abgesicherten Schritt vorlegen.

---

## Anhang: Nebenbefunde der Zweitprüfung (unabhängig von deiner Entscheidung reparaturwürdig)

Bei der Code-Prüfung sind Baustellen aufgefallen, die **keine Owner-Entscheidung brauchen**, sondern
einfach Handwerk sind. Ich liste sie hier, damit sie nicht verloren gehen (Reparatur lohnt in jedem
Szenario, auch bei Option 0):

1. **Verrats-Risiko wird vermutlich doppelt gezählt** — dieselbe Moral-Verarbeitung läuft pro Aktion
   zweimal (einmal im Adapter, einmal im UI-Hook). Möglicher stiller Balance-Fehler.
2. **Krisen-Auflösungen wenden ihre Effekte teils nicht an** (nur Logging) — Spielerentscheidung ohne
   mechanische Folge.
3. **Verrats-Ereignis-Folgen** (Leak, Netzwerk-Schaden, NPC-Verlust) sind definiert, werden aber nie
   angewendet — der Verrat bleibt ein Text-Modal.
4. **Fertiges Gegenmaßnahmen-System** (~20 DISARM-Maßnahmen mit Reaktions-Optionen) wird von keiner
   Stelle im Spiel aufgerufen.
5. **Aktions-Sperren der Plattform-Moderation** werden gesetzt, aber nie durchgesetzt (Getter hat null
   Aufrufer); **Reichweiten-Reduktion** der Verteidiger ist ein leerer Programmzweig.
6. **Beat-Daten autorisieren Vertrauens-Wirkungen** (z. B. −12), die der Code verwirft — bei einer
   Kopplungs-Entscheidung sofort nutzbar, sonst irreführende Daten.
7. **Kein Test sichert „gewinnbar und verlierbar"** — nur Effektwert-Einfrierung + loggende
   Simulationen ohne harte Schwellen (siehe §7).
8. **Zwei parallele Endspiel-Regelwerke** — die Live-Logik und das End-Report-System prüfen teils
   unterschiedliche Schwellen (z. B. Enttarnung bei 85 vs. 95); heute versöhnt, aber fehleranfällig.
