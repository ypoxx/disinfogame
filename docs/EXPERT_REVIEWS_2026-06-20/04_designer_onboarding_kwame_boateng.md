# Designer-Persona 4 — Kwame Boateng (Onboarding / Kern-Loop / Ökonomie)

> Verankerung: Daniel Cook „The Chemistry of Game Design" (Skill-Atom: Aktion→Sim→Feedback→Modell;
> verkettete Atome; Burnout); Plague Inc./Ndemic (einfaches Spielzeug → graduelle Tiefe, eine
> Wettrenn-Metrik, frühe Gegen-Uhr). **Web blockiert.**
> **Wichtig:** bewertet den AKTUELLEN Stand — bestätigt im Code, dass mehrere Playtest-Mängel bereits
> behoben sind (Jahres-Gate gekappt, Delta am Planungspunkt, Doppel-Reaktion zusammengeführt, Wirksamkeit hergeleitet, Tag-1-Führung).

## Gesamteindruck
Das **Skill-Atom ist erstklassig** (Aktion → ON-AIR → Publikum → Marina → Werte-Delta), Lust in <2 min.
Onboarding-Schulden werden aktiv abgetragen. Offen ist nicht mehr der Einstieg, sondern **Takt &
Eskalation**: zwei Bühnen, stille Heimweg-Quittung, vier Uhren, 3 Jahre ökonomische Schonzeit.

## Befunde
- **B1 — Zwei Aktionsflächen, ein Inventar, DREI Geste-Vokabulare.** Terminal AUSFÜHREN/ANHEFTEN; Tafel ANHEFTEN/SOFORT/AUSSPIELEN. *„Zwei Tische, gleiches Kartendeck, und an jedem Tisch heißt ‚spielen' anders."*
- **B2 — Tageswechsel = No-Op mit stiller Quittung.** `requestEndDay` bricht ab während `walkHome`; Heimweg ohne Indikator. *„Der Spieler hört nicht ‚klick', er hört nichts. Also klickt er nochmal."* (NICHT behoben.)
- **B3 — Vier Zeit-Ebenen für eine Frage.** Uhr erreicht nie 18:00 → totes Flavor; echter Takt ist AP. *„Vier Uhren für eine Frage … drei davon sind Deko, aber der Neuling weiß nicht welche."*
- **B4 — Eskalation zu spät: 3-Jahres-Schonzeit** (`StoryEngineAdapter.ts:1944`) + passives +Budget. *„Plague Inc. lässt dich nie in Ruhe … Hier habe ich drei Jahre Schonfrist. Drei Jahre ist die Hälfte der Spieler längst weg."*
- **B5 — Tag 1 führt gut, Tag 2 ist eine Klippe.** Danach 88 Aktionen offen; Hervorhebung ≠ Reduktion. *„Hervorheben ist nicht dasselbe wie Wegräumen — das Auge sieht trotzdem die hundert."*
- **B6 — Vorschau am Planungspunkt ehrlich, aber `≈+5` Plan vs. `+8` Ergebnis kann verwirren.** *„Eine unerklärte Differenz ist schlimmer als gar keine Vorschau."* (kleiner Schliff: Delta-Quelle benennen)
- **B7 — Das gute Atom ist im Single-Modal überladen** (bis zu 14 Blöcke). *„Mein knackiges Spielzeug bekommt ein 14-stöckiges Quittungsformular."*

## Stärken
Mikro-Atom erstklassig; Onboarding-Schulden aktiv abgetragen (Code beweist es); „Episode = Bedeutung,
Aktion = Vokabular" ist Cook/Plague-Lehre; `episodeActionIds`+STRANG-Badge ist der richtige erste Dosier-Schritt.

## Top-Verbesserungen
1. **Eine Aktionsfläche, ein Verb-Set** (Terminal = ausführen, Tafel = planen; „SOFORT"/Doppelverben streichen).
2. **Heimweg-Quittung sofort sichtbar** (Band „auf dem Heimweg", Mehrfachklick darf nicht verpuffen).
3. **Eskalation nach vorn ziehen** (Schonzeit auf ~1 Jahr/erste Episode; sichtbare Gegen-Uhr ab Tag 2–3).
4. **Katalog wirklich dosieren, nicht nur sortieren** (Terminal default nur anlass-relevant + „ALLE"-Werkzeugkiste).
5. **Ergebnis-Modal progressiv aufklappen** (3 Kernblöcke groß, Rest einklappbar wie die Batch-View).

## Schlussurteil
*„Ihr habt das Streichholz schon entzündet … Nehmt dem Spieler die zweite Tischkante weg, gebt dem
Feierabend ein Geräusch, und lasst die Gegen-Uhr früher ticken. Dann sagt er nicht ‚verstanden ▸',
dann sagt er ‚noch ein Tag'."*
