# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — SYNTHESE über 12 Bündel

**Modell:** `stealth/ox-alpha` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-21
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-21T16:57:37.470Z · **Dauer:** 134.9 s
**Nutzung:** 55.027 Prompt + 4.555 Antwort Tokens · **Kosten:** $0.00 (gratis) · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Zusammenführung der Einzel-Gutachten: dialog, building, panels-1von2, panels-2von2, daynight, office, broadcast, daycycle, ending-1von4, ending-2von4, ending-3von4, ending-4von4

## Gezeigter Ausschnitt

0 Zeichen ≈ 0 Tokens (geschätzt) aus 0 Quellen

_(Synthese über Einzelberichte — kein Datei-Paket)_

---

## Antwort des Modells

# Gesamtgutachten: Oberfläche „Desinformation Network“ (Story Mode)

## 1. Das eine Gesamtbild

Der rote Faden der Oberfläche ist eine Papier-/Akten-Metapher, die in einzelnen Komponenten überzeugt — die Vorgangskarten im Terminal, der Stempel-CTA im Pausenmenü, der „GEFÄLSCHT"-Stempel, die Typografie des Lageberichts — aber an allen Nähten bricht: Modale laufen über den Viewport, Fußleisten liegen im Kartenfluss, Primärknöpfe verletzen die eigene Rot-Regel, und die Welt widerspricht sich selbst (Sternenhimmel um 11 Uhr, Sonnenuntergang um 14:25). Das zweitgrößte Problem ist Leerfläche als Symptom fehlender Höhenkopplung: Dialogbox, Lagebericht-Panels, TV-Rahmen und Endings-Titelkarten behaupten Inhalte, die nicht da sind — das Papier-Design wird durch tote Fläche entwertet statt durch Ruhe getragen. Drittens fehlt durchgehend Zustandsdesign: kein Hover, kein Fokus, kein Auswahl-, kein Weiter-Cue ist in irgendeinem Bündel ablesbar; die Oberfläche hat Zustände nur als Behauptung, nicht als Bild. Die stärksten Assets sind die Raum-Hintergründe, der TV-Rahmen mit Ticker und die Stempel-Idee — sie tragen die Fiktion allein. Die schwächste Ebene ist die Kantenbehandlung: fast jedes Bündel liefert mindestens ein halb abgeschnittenes Element (Buttons, Rahmen, Labels, Panels), was durchweg wie Renderfehler wirkt. Und schließlich ist die Ernte selbst defekt: Duplikate, falsche Motive und ein komplett fehlender Screen machen einen relevanten Teil der Oberfläche unbewertbar — ein Prozessbefund, der vor weiteren Designurteilen geklärt werden muss. Insgesamt: solide Komponenten, kaputtes Zusammenspiel.

## 2. Wiederkehrende Muster (systemisch)

| Muster | Bündel |
|---|---|
| **Abschnittener Inhalt / Overflow ohne Affordance** (Option C, Float-Button, TV-Rahmen, PUBLIKUM, Dachtechnik, Kachelreihen) | dialog, building, panels-1, panels-2, office, broadcast, daycycle, ending-1–4 |
| **Modal-Fußleiste überdeckt Karteninhalt** („Keine Option ist überall die beste…" liegt IM Fluss) | panels-1, panels-2, office, broadcast |
| **Rot-Token-Verstoß** (gefüllte Rot-CTAs, Dauer-Rot am FEIERABEND, rote Randstreifen) gegen §4.7 | panels-2, office, broadcast, daycycle, ending-1–4 |
| **Tote Fläche durch fehlende Höhenkopplung** (Dialogbox ~70 % leer, Report-Panels ①③, TV-Innenflächen, Titelkarten, Enzyklopädie-Detailpaneel) | dialog, daycycle, daynight, ending-1–4, panels-2 |
| **Tageszeit ↔ Bild-Widerspruch** (Sterne bei Tag, Sunset bei 14:25, fehlende Dämmerung, unbeleuchtetes Gebäude nachts) | building, daynight |
| **Fehlende Zustände** (Hover/Fokus/Aktiv nirgends sichtbar; Auswahlzustände bei Zuträgern, Listen, Pills, Optionskarten) | alle acht Bündel |
| **Datengrafiken codieren keine Daten** (gleich lange Milieubalken, 100 %-blaue Deutungshoheit, graues Band ohne Legende, Wert-Label entkoppelt von Balkenspitze) | building, daycycle, daynight, ending-2, ending-3 |
| **Doppelte/kollidierende Beschriftungssysteme** (Stockwerk-Tag + schwebendes Label, Igor-Gelb, zwei „K"-Tasten, Kopfband-Farben ohne System) | building, daynight, dialog |
| **Defekte Ernte** (bildidentische Duplikate, falsche Motive, fehlender Screen) | building, panels-1, panels-2, ending-1–4 |
| **Uneinheitliche Stat-Anatomie in Entscheidungskarten** (Inline vs. Spalte, drei x-Positionen für denselben Wert) | panels-2, office, broadcast |

## 3. Widersprüche zwischen den Bündeln

- **Scrim/Dimming:** `pause_menu` dimmt vorbildlich; `panel_events` dunkelt stark, `hud_on` kaum, `shortcuts` voll Schwarz. Dieselbe Modal-Komponente, vier Umgebungen, null Token.
- **CTA-Stil:** `stampCtaStyle` wird korrekt genutzt (Pausenmenü „FORTSETZEN", „NÄCHSTER TAG ▶"), aber parallel gebrochen (WEITER/FEIERABEND vollrot, „BERICHT SCHLIESSEN" flach beige, „Verstanden ▶" unstempelig). Zwei CTA-Systeme koexistieren.
- **Modal-Geometrie:** Breite und Position schwanken zwischen ~45 % (office) und Empfehlungen Richtung 60–65 % (broadcast); vertikal mal zentriert, mal oben anliegend, mal überlaufend.
- **Farbsysteme:** Neben den Paper-Tokens existieren mindestens drei Fremdregister unvermittelt: CRT-Grün (Terminal), Amber-Rahmen (Vorgangskarten), Broadcast-Gold (Fixtures) — plus das Igor-Gelb und das weiche Airbrush-Abendrot als Einzelvorkommen.
- **Interaktionsmodell innerhalb eines Ablaufs:** „Klicken zum Fortfahren" als Text auf s0–s2, als Button auf s3 (ending-4) — dieselbe Aktion, zwei Grammatiken.
- **Kontraststrategie auf Dunkel:** Ticker und Bullets funktionieren; Schlagzeilen, Stempel und Float-Buttons in Rot-auf-Dunkelrot scheitern — es gibt offenbar keine gerechnete Regel für Tinte auf dunklen Zonen.
- **Bildsprache der Porträts/Sprites:** zwei Auflösungsfraktionen im Dialog; Sprite-Unterscheidbarkeit Avatar/NPC im Gebäude ungelöst, während die Porträt-Kacheln im Archiv wieder eigene Maßstäbe haben.

## 4. Rangliste der 10 wirksamsten Änderungen

1. **Entscheidungs-Modal reparieren:** Fußleiste aus dem Kartenfluss nehmen (fixiert unterhalb des Scrollbereichs), Option C vollständig lesbar machen, Bestätigungsfläche verankern. *Wo:* panels-1/-2, office, broadcast — der Kernspielloop. *Warum:* abgeschnittene Entscheidungsoption = Funktionsverlust, nicht Schönheitsfehler. *Aufwand: klein.*
2. **Alle Primär-CTAs auf `stampCtaStyle` stellen** (WEITER, FEIERABEND entsättigt/sperrend im Modal-Kontext, BERICHT SCHLIESSEN, Verstanden). *Warum:* stellt die Rot-Disziplin wieder her, macht die wichtigste Aktion spielweit wiedererkennbar; reiner Klassenwechsel. *Aufwand: klein.*
3. **Overflow-/Beschnitt-Sweep:** „VOLLSTÄNDIGER LAGEBERICHT" ins Panel integrieren, TV-Rahmen-Oberkante an Viewport nageln (alle s3), PUBLIKUM-Button und rechte Kachelreihen vollständig ins Bild, Close-X in sticky Kopfleiste. *Warum:* halbierte Elemente lesen sich überall als Bug und stehlen dem jeweiligen Hauptinhalt den ersten Blick. *Aufwand: klein bis mittel.*
4. **Tageslicht-Kurve kalibrieren + Nacht-Zustand des Gebäudes bauen:** Mittag hellster Punkt, Dämmerung zwischen 16:00 und 17:06, Morgen ohne Sterne, beleuchtete Fenster nachts, Innenlicht gekoppelt. *Warum:* betrifft jeden Welt-Screen und entscheidet über die Glaubwürdigkeit der Simulation. *Aufwand: mittel.*
5. **Höhen an Inhalt koppeln + Leerflächen besetzen:** Dialogbox wächst mit Text (~2 Zeilen Minimum), Report-Panels ①③ bekommen Stempel-Platzhalter („STILLER TAG"), TV-Balkenmodul auf ~140 % vergrößern und zentrieren, Enzyklopädie-Detailpaneel mit Metadatenblock füllen. *Aufwand: mittel.*
6. **Stat-Grid in den Entscheidungskarten normieren:** feste rechte Wertspalte (~20 % Kartenbreite), Wert über Label, gemeinsame Rechtskante über A/B/C. *Warum:* der Risiko-Vergleich ist die Kernentscheidung und steht aktuell auf drei x-Positionen. *Aufwand: klein bis mittel.*
7. **Gebäude-Beschriftung auf eine Ebene pro Etage reduzieren, Igor-Gelb entfernen, Spieler-Marker einführen.** *Warum:* löst die Frage „wo bin ich, wer ist das, was gehört wohin" auf vier Screens; Marker ist ein 16-px-Asset. *Aufwand: mittel.*
8. **Datengrafiken mit echten Werten füllen:** Milieubalken proportional, Deutungshoheit als segmentierter Balken mit Zahl, Chart-Legende fürs graue Band, Wert-Label an die Balkenspitze koppeln. *Warum:* eine Grafik, die nichts unterscheidet, untergräbt genau die Datenkompetenz, die das Spiel vermitteln will. *Aufwand: mittel.*
9. **Dialogsystem konsolidieren:** Kopfband-System vereinheitlichen (Papierband + Namens-Tinte + Akzentkante, Rot nur Volkov), Porträt-Körnung/Beschnittlinie normieren, Continue-Cue und Bühnenanweisungs-Stil (kursiv, `textSecondary`) einführen. *Warum:* höchste Frequenz — jede Dialogzeile des Spiels. *Aufwand: mittel.*
10. **Ernte-Prozess reparieren:** Duplikate löschen, fehlende Screens nachliefern (Shortcuts-Overlay, echte Panel-Shots ohne Modal, Plakat-Overlay, Flur-Statist, Exposed-s3, gescrollte Report-Zustände, je ein Hover-Shot pro Interaktionselement). *Warum:* ohne belastbares Material bleiben ganze Subsysteme unbewertbar; Prozessfix, kein Designfix. *Aufwand: klein (organisatorisch).*

## 5. Was zuerst?

1. **Entscheidungs-Modal (Rang 1):** Es blockiert den Kernloop des Spiels auf mindestens fünf Screens — jede weitere Designarbeit an Karten, Typografie oder Farben läuft ins Leere, solange die dritte Option unlesbar ist. Der Fix ist trivial und heilt vier Symptome gleichzeitig (Overlap, Scroll, fehlende CTA, tote Fußzone).
2. **CTA-/Rot-Sweep plus Overflow-Sweep (Rang 2+3 kombiniert):** Beides sind Klassen- bzw. Anker-Änderungen ohne neue Assets, zusammen nehmen sie der Oberfläche ihren „kaputt"-Eindruck — den abgeschnittenen Rahmen, den schwebenden Button, den rot gefluteten Knopf. Nach einer Sitzung wirken zehn Screens gepflegt statt fehlerhaft, was die Moral des Teams und die Bewertung aller Folge-Screens hebt.
3. **Tageslicht-Kurve (Rang 4):** Sie ist der einzige Befund, der die *Welt* und nicht nur die UI betrifft — und damit direkt das Immunisierungsziel: Ein Spiel über Desinformation darf sich selbst nicht widersprechen. Die Gradient-/Keyframe-Arbeit kann parallel zu den UI-Fixes laufen und braucht vor allem Entscheidungen (Zustandsliste, Dämmerungs-Keyframes), nicht Codevolumen.

Alles Übrige — Stat-Grids, Beschriftungsebenen, Datengrafiken, Dialogsystem — sollte erst nach der Nachlieferung der fehlenden Captures angegangen werden, damit nicht an Duplikaten gearbeitet wird.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
