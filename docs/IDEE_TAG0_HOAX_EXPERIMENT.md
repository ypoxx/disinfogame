**Status:** Idee / Reflexion (NICHT beschlossen) — Owner-Eingabe 2026-06-15
**Scope:** Story — Onboarding / erster „Aha"-Beat
**Zweck:** Idee festhalten, damit sie nicht verloren geht. Keine Umsetzungsentscheidung.

# Idee: „Tag-0-Experiment" — der absurde Hoax als Aha-Moment

## Owner-Idee (Originalgedanke)
Schneller Einstieg + Belohnung: Der Spieler darf — *aus Sicht der Figur, als Experiment* — einen
**absurden Hoax** auswählen und ausspielen und sieht **sofort Effekte**. Darf lustig sein. Hat
zunächst **nichts mit den Zielen** zu tun („man kann alles mal ausprobieren"). = bewusste
folgenlose Probier-Zone vor dem eigentlichen Spiel.

## Welche Muster das bedient (Begründung)
- **Toy before Game / Möglichkeitsraum** (Will Wright): erst spielen, dann Ziele.
- **Time-to-First-Value / Magic Moment**: erster spürbarer Erfolg in Sekunden statt Minuten.
- **Juice / Game Feel**: nutzt die stärkste vorhandene Maschine (Aktion → Sendung → Publikum).
- **Safe-to-fail-Sandbox**: folgenlose Lernzone (vgl. Papers Please Tag 1, Plague Inc. Start).

## Die eine Drehung (für den Bildungszweck — prozedurale Rhetorik)
Der Hoax ist witzig **und funktioniert trotzdem**: ein Publikumssegment glaubt ihn, eine
Faktencheckerin reagiert, der Balken zuckt. Pointe = **„selbst völliger Unsinn verbreitet sich"**
(reales Phänomen). So belohnen die ersten Minuten **Reiz UND Erkenntnis** — nicht nur den Kick.

## Worauf es aufbaut (vorhandener Inhalt — NICHTS neu erfinden)
- **Aktion** `Verschwörungsnarrativ entwickeln` (`actions_continued.json`): headline_de
  „Verschwörungserzählung lanciert", narrative „Die Wahrheit ist da draußen – und wir erfinden sie",
  Kosten budget 4/cap 1/risk 5, `npc_affinity: marina`, effects polarization 0.26 (impact „high").
  *(Alternative leiser/billiger:* `Meme-Serie erstellen`, headline „Meme-Welle losgetreten",
  budget 2, „verbreiten sich wie ein Virus".)*
- **Anbieter-NPC**: Marina (Medien) — bietet es diegetisch als Aufwärm-Übung an.
- **Feedback-Maschine**: Broadcast „ON AIR" + Quote/Reichweite + Publikums-Wohnzimmer (vorhanden).
- **Echo/Lehrmoment**: die 8 Publikumssegmente (Optimierer, Macher, digitale Bohemiens, besorgte
  Mitte, Abgehängte, grüne Idealisten, nostalgische Eigenheimer, neugierige Liberale) + Gegenseite
  (Faktencheckerin) — alles vorhanden.

## Brücke (Toy → Game, diegetisch)
Marina vorher: „*Bevor wir's ernst meinen: Spielen Sie was aus, egal was. Schauen Sie, was passiert.*"
Marina danach: „*Süß. Jetzt mit Absicht.*" → übergibt an Auftragswahl/Ziel.

## Einordnung in die Orchestrierung (Director)
Dies ist der **erste fest gesetzte „Beat"** des Tag-1-Skripts: garantierter Aha-Moment, der dann an
den Director übergibt. Re-Sequenzierung vorhandener Teile, kein neuer Inhalt.

## Geformter Beat — Director-Entscheidungen A–D (Owner, 2026-06-15, in Sitzung getroffen)
*Status weiterhin: nicht final zur Umsetzung freigegeben — aber inhaltlich geformt.*

- **A — Experiment-Aktion:** `Verschwörungsnarrativ entwickeln` (lauter, sichtbarster Aha; Schlagzeile
  „Verschwörungserzählung lanciert").
- **B — Zugang zum Inhalt:** **drei geführte Köder** (geführte Freiheit), Spieler wählt einen:
  1. „Die Stadttauben sind Regierungsdrohnen"
  2. „Im Trinkwasser ist ein Mittel, das die Leute fügsam macht"
  3. „Die berühmte Brücke wurde nie gebaut — alles Kulisse" *(Vorgriff auf Episode `ep_bruecke`)*
- **C — Echo / Bildungs-Pointe:** diegetisches Echo (**ein Segment glaubt es**, z. B. „Die Abgehängten:
  überzeugt"; Faktencheckerin Ferro: „…frei erfunden") **+ Marinas Satz**: „Sehen Sie? Es muss nicht
  stimmen. Es muss nur ankommen." (Real-Welt-„Wussten Sie?"-Karte → in den End-Report, NICHT hier.)
- **D — Probier-Zone:** **folgenlos** (weder Kosten noch Risiko zählen) — Kalibrierung, kein Zug.
- **Brücke (Toy→Game):** Marina „Süß. Jetzt mit Absicht." → Auftragswahl (Keil/Wahl/Zweifel).

### Was es real anfasst (Orchestrierung, kein Neubau)
- **Wiederverwendet:** Aktion + Schlagzeile, Marina + Stimme, Broadcast/Quote/Wohnzimmer, 8 Segmente,
  Ferro/Gegenseite, Auftragswahl.
- **Neu (klein):** 3 Köder-Zeilen · 1 Echo-Regel · Marinas 2 Sätze · Reihenfolge als Tag-1-Beat ·
  Schalter „Probier-Zone folgenlos".
- **Spine:** 1 Director-Eintrag (Tag 1, erster Beat) · 3 Beat-Queue-Ereignisse (ON AIR → Echo →
  Brücke) · Fortschritts-Anzeige bleibt still, erscheint mit der Auftragswahl.

> Noch offen, falls gebaut wird: exakte Quote-Zahl/Tuning · ob alle 3 Köder ein eigenes Echo bekommen
> oder ein gemeinsames · genaue Anbindung an den (noch zu bauenden) Director/Beat-Queue.
