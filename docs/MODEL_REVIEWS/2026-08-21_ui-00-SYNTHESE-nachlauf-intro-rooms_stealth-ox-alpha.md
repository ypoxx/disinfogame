# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — SYNTHESE über 2 Bündel

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T17:19:08.930Z · **Dauer:** 109.4 s
**Nutzung:** 9.757 Prompt + 3.567 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Zusammenführung der Einzel-Gutachten: intro, rooms

## Gezeigter Ausschnitt

0 Zeichen ≈ 0 Tokens (geschätzt) aus 0 Quellen

_(Synthese über Einzelberichte — kein Datei-Paket)_

---

## Antwort des Modells

# Gesamtgutachten: Oberfläche „Desinformation Network" (Story Mode)

## 1. Das eine Gesamtbild

Der rote Faden der Oberfläche ist ein Token-System, das auf dem Papier existiert und gut durchdacht ist — aber nur in Ausnahmen angewendet wird. Wo es greift (`operations_akte.png`, `avatar_choice.png`, die Aktenkarte in `vergabe_akte.png`), entstehen die stärksten Screens des Spiels: Papierflächen, Kopfband, Stempeloptik, klare Zweispalter. Überall sonst driftet die Oberfläche davon ab: vollrot geflutete Buttons statt Stempel, Arcade-Leuchtgelb im Titel, dunkle Tech-Screens mit Gelb-/Grünakzenten ohne jede Token-Verankerung. Das Ergebnis sind zwei visuelle Sprachen — „Behördenakte" und „dunkler Monitor" — die aktuell ununterschieden nebeneinanderstehen, sodass man zwei verschiedene Spiele zu sehen glaubt. Das zweite systemische Problem liegt unterhalb der Stilfrage: Zustände sind fast nirgends ablesbar (Auswahl, Sperrung, Leerstand, Fortschritt), und Leerzustände sind ungestaltet — tote Fläche frisst in vier von acht Screens zwischen einem Drittel und der Hälfte der Nutzfläche. Drittens verliert die Blickführung wiederholt an falschen Ankern: das hellste Element ist selten das wichtigste (gelbes Direktor-Tag, gelber Pretest-Titel), während die tragenden Werte (Schwellenstrich, „Aufklärung 0%", Meta-Zeilen der Maschen) im Kleingedruckten verstecken. Die gute Nachricht: Die meisten Defekte sind keine Designfragen mehr, sondern Durchsetzungsfragen — der richtige Code und die richtigen Assets existieren bereits.

## 2. Wiederkehrende Muster

1. **Rot als Fläche statt als Stempel.** `title.png`, `vergabe_akte.png` (intro); `board_direct.png` LEEREN-Button (rooms). Das Ministeriums-Rot entwertet sich selbst, je öfter es Vollflächen füllt; `stampCtaStyle` existiert und wird ignoriert.
2. **Ungestaltete Leerzustände / tote Fläche.** `vergage_akte.png` (Inhalt:Leere ≈ 1:2), `arrival_early/mid.png` (rechte Lobbyhälfte) (intro); `newsroom.png` (~55 % leeres Tickerpanel), `fokusgruppe.png` (untere Kartenhälften), `operations_akte.png` (rechte Analysespalte) (rooms). Nirgends gibt es einen gestalteten „noch nichts passiert"-Zustand.
3. **Zustände unlesbar oder unsichtbar.** Auswahl-Rahmen der Porträts, gesperrter CTA bei leerem Namen (intro); ANG-Meter zeigen „-", Radio-Trefferflächen zu klein, gewählte Zeile nicht markiert (rooms). Interaktivität ist aus Standbildern oft nicht einmal erschließbar.
4. **Wichtigste Information typografisch am schwächsten.** Schwellenstrich ohne Label, Untertitel unter Kontrastminimum, „ÜBERSPRINGEN" dunkel-auf-dunkel (intro); „Aufklärung 0%" in der Ecke, Maschen-Meta-Zeilen in der kleinsten Type, Mood-Labels unter der Berufsbezeichnung (rooms).
5. **Konkurrierende Beschriftungssysteme ohne Bezugskante.** Etagen-Namen vs. schwebende Owner-Tags (intro); Themen-Label/Balken/Zahl auf drei Ebenen, Chip-Zeile ohne Rasterbezug (rooms). Immer dasselbe Muster: Informationen hängen lose statt in einem Band mit festem Sitz.
6. **Abschneiden ohne Affordanz.** Oberster Stock mittig durchgeschnitten (intro); letzte Kartenreihe hart am Rand, Schritt 3 des Haupt-Workflows außerhalb des Viewports (rooms). Beides liest sich als Bug, nicht als Scroll.
7. **Dunkle Räume als Helligkeitsrauschen.** Schwarzer Außenrand um das Porträt-Panel (intro); Newsroom-, Fokusgruppen- und Pretest-Hintergrund so dunkel, dass sie weder Tiefe noch Kontext liefern (rooms) — der Style-Guide verbietet genau das explizit.
8. **Asset-Stilbrüche.** Gemalte, untereinander inkonsistente Porträts gegen feine Pixel-Art (intro); Kork-Textur in größerer Körnung als die Pixelschrift (rooms). Beide Male: ein Asset skaliert nicht zur Typo-Welt des Spiels.

## 3. Widersprüche zwischen den Bündeln

- **CTA-Sprache:** `avatar_choice.png` zeigt den korrekten Stempel-CTA; `title.png` und `vergabe_akte.png` denselben Button vollrot. In rooms fehlt der Stempel-CTA komplett — `AUSPIELEN` ist eine schwebende Box, `LEEREN` vollrot. Drei Knopf-Sprachen in acht Screens.
- **Modal-Untergrund:** intro fordert für Modals das warme `#2E2820` (aktuell rein schwarz), rooms arbeitet auf dunklen Tech-Gründen mit Gelb/Grün, die keinem Token entsprechen. Selbst wenn beide korrigiert würden, bliebe die Frage offen, wann Papier-Modal und wann Kennzeichnung als Diegetischer Bildschirm gilt — diese Regel existiert bisher nicht.
- **Rasterdisziplin:** `avatar_choice` hat horizontal saubere Gutters, `operations_akte` einen gleichmäßigen Zeilenpitch — während `board_direct` keine Rasterbezüge hält und `fokusgruppe_pretest` den Außenrand enger setzt als die Gutters. Streng und lax wechseln ohne erkennbares Kriterium.
- **Bildsprache der Schlüssel-Assets:** intro trägt seine Screens mit drei starken Welt-Assets (Key-Art, Cutaway, Akte); rooms hat kaum ein tragendes Asset — die Räume sind Rauschen, die Tafel ist von Textur erstickt. Das Bündel mit dem meisten Gameplay hat die schwächste Bildanbindung.
- **Umgang mit Hierarchie:** intro priorisiert gelegentlich falsch (gelbes Tag heller als der Avatar), rooms lässt Hierarchien flach kollabieren (16 identische Karten, drei Textebenen gleicher Größe). Beides führt zum selben Symptom, hat aber unterschiedliche Ursachen — Einzelfallfixes genügen hier nicht.

## 4. Rangliste der 10 wirksamsten Änderungen

1. **Kork-/Noise-Textur auf `board_direct.png` auf ~20 % Opazität senken, Slots auf helle Papierfläche.** Ein Layer-Wert trennt den zentralen Planungs-Screen zwischen „unbenutzbar" und „benutzbar". Aufwand: **klein**.
2. **`stampCtaStyle` global durchsetzen** — `title.png`, `vergabe_akte.png`, LEEREN-Button; AUSPIELEN als volle Fußleiste. Der Style existiert in `theme.ts`; reiner Austausch stellt Token-Compliance und eine einheitliche Primäraktion her. Aufwand: **klein**.
3. **`operations_akte.png`: interne Scroll-Region für die Schritteliste, Kopf/Fuß fixieren.** Schritt 3 ist derzeit unerreichbar — Funktionsdefekt, nicht Stilfrage. Aufwand: **mittel**.
4. **Ankunftssequenz: ein Beschriftungsband pro Etage (Name + Owner auf der Deckenkante) + Spieler-Marker.** Erster Weltkontakt nach dem Menü; aktuell rät der Spieler, wer er ist. Aufwand: **mittel**.
5. **Leerzustände gestalten:** Platzhalter-Tickerzeilen im Newsroom, Aktenkarte in `vergabe_akte.png` auf ~140 % skalieren und zentrieren, Kartenhöhe in `fokusgruppe.png` an Inhalt koppeln. Verwandt die vier leersten Flächen des Spiels in lesbare Screens. Aufwand: **mittel**.
6. **Untergrund-Regel festlegen und anwenden:** Modals auf `#2E2820`, Diegetische Bildschirme konsequent über den Tech-Token (`#275F6B`) mit Rahmen/Scanline kennzeichnen. Behebt das „zwei Spiele"-Problem strukturell. Aufwand: **mittel**.
7. **Zustandssystem definieren und sichtbar machen:** Doppelring + Mini-Stempel für gewählte Porträts, gesperrter CTA bei leerem Namen, gewählte Zielzeile unterlegt, Meter-Leerzustand als gestrichelter Balken statt „-". Betrifft beide Bündel, ist aber ein einmal entworfenes Set von States. Aufwand: **mittel**.
8. **Die jeweilige Schlüsselzahl jedes Screens heben:** „SCHWELLE"-Label am Barometerstrich, „Aufklärung %" als eigene Kennzahl, Maschen-Meta-Zeilen auf Lesegröße, Mood-Label als Badge in die Kartenkopfzeile. Je Fall eine Zeile Arbeit. Aufwand: **klein**.
9. **Abschneiden-Affordanzen:** Fade-out + Chevron unten in `fokusgruppe_pretest.png`, Kamerarand in `arrival_*` auf Deckenkanten setzen. Beseitigt den „sieht kaputt aus"-Eindruck. Aufwand: **klein**.
10. **Porträt-Assets vereinheitlichen:** neutraler Aktenfoto-Hintergrund für alle sechs, Farbklima und Zuschnitt normalisieren. Größter einzelner Stilbruch, aber teuer und extern (Neugenerierung/Nachbearbeitung). Aufwand: **groß**.

## 5. Was zuerst?

1. **Board_direct-Textur entschärfen (Nr. 1).** Es ist der einzige Punkt, an dem ein Screen faktisch unlesbar ist; ein einziger Parameterwert, sofort messbarer Erfolg — und der Planungs-Screen ist das Herzstück des Gameplays.
2. **Stempel-CTA-Rollout (Nr. 2).** Maximale Konsistenzwirkung pro Zeile Code, weil der Style bereits implementiert ist. Danach sieht jeder primäre Button im Spiel gleich aus — das Fundament für alle weiteren UI-Arbeit.
3. **Operationsakte-Scroll-Fix (Nr. 3).** Der Haupt-Workflow des Spiels ist aktuell an Schritt 3 blockiert. Kein visueller Feinschliff rechtfertigt es, einen unerreichbaren Kernschritt länger stehen zu lassen.

Alle drei betreffen Funktionsfähigkeit bzw. Systemdurchsetzung vor Ästhetik — erst wenn diese Ebene steht, lohnt sich die State- und Leerzustandsarbeit (Nr. 5–7), die die nächste größere Baustelle ist.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
