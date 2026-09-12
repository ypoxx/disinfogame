# 🛰️ Fremdmodell-Review — UX/UI & Bildwirkung — SYNTHESE über 14 Bündel

**Modell:** `gpt-5.6-sol` (via OpenRouter) · **Linse:** `ui` · **Datum:** 2026-08-22
**Erzeugt von:** `tools/model-review` · **Lauf:** 2026-08-22T17:09:26.285Z · **Dauer:** 94.2 s
**Nutzung:** nicht gemeldet · **Kosten:** unbekannt · **Anbieter-Datensammlung:** ausgeschlossen (deny)

> ⚠️ **Wie das zu lesen ist:** Ein *fremdes* Modell hat einen **kuratierten Ausschnitt**
> des Projekts gesehen — nicht das laufende Spiel und nicht das ganze Repository. Es kann
> daher weder Laufzeitverhalten prüfen noch `file:line`-Belege verifizieren. Befunde sind
> **Hypothesen**, die vor dem Umsetzen am Code/an den Daten gegenzuprüfen sind. Die
> kanonische Wahrheit bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## Gestellte Frage

Zusammenführung der Einzel-Gutachten: intro, dialog, building, panels-1von2, panels-2von2, daynight, office, broadcast, rooms, daycycle, ending-1von4, ending-2von4, ending-3von4, ending-4von4

## Gezeigter Ausschnitt

0 Zeichen ≈ 0 Tokens (geschätzt) aus 0 Quellen

_(Synthese über Einzelberichte — kein Datei-Paket)_

---

## Antwort des Modells

## 1. Das eine Gesamtbild

Die Oberfläche besitzt einen tragfähigen Kern: eine moderne Behördenwelt, in der Akten, Register, Stempel und Papierflächen Spielhandlungen materialisieren. Am überzeugendsten funktioniert das in Aktenansichten wie `operations_akte`, Missionsunterlagen, Teilen der Dialogboxen sowie den Tages- und Endberichten. Die Idee bricht jedoch regelmäßig dort, wo schwarze Terminalflächen, Scanlines, transparente Karten, Neonrahmen, grüne Statusbalken und rote Vollflächen-Buttons ein zweites UI-System eröffnen. Über fast alle Bereiche hinweg gewinnt zudem häufig die Kulisse — Monitore, Skyline, Kork, Publikum oder Weltkarte — gegen den eigentlichen Auftrag, Zustand oder Text. Das Spiel hat kein durchgängiges Vokabular für „aktuell“, „ausgewählt“, „fokussiert“, „gesperrt“, „neu“ und „gefährlich“; Gelb, Rot, Blau, Rahmen und Flächen wechseln ihre Bedeutung. Viele Screens sind horizontal großzügig, aber vertikal schlecht kalkuliert: oben bleiben tote Flächen, während unten Optionen, Diagramme, Buttons oder Raumtitel abgeschnitten werden. Die Typografie ist als feine Pixelschrift atmosphärisch passend, wird aber zu oft für lange Fließtexte, Mikrolabels und bildschirmbreite Zeilen eingesetzt. Insgesamt wirkt die Oberfläche deshalb nicht wie ein konsequent gestaltetes Aktensystem, sondern wie eine gute Papieridee, die von älteren Dashboard-, Terminal- und Webmodal-Mustern überlagert wird.

---

## 2. Wiederkehrende Muster

### A. Kulisse und Nebenbilder überstimmen die eigentliche Aufgabe

Monitore, Weltkarten, Skyline, Zuschauerzimmer, Korktexturen oder Raumdetails werden vor Figur, Auftrag, Ergebnis oder Leerzustand wahrgenommen.

**Aufgetreten in:** `intro`, `dialog`, `building`, `panels-1von2`, `panels-2von2`, `daynight`, `office`, `broadcast`, `rooms`, `daycycle`.

**Systemischer Kern:** Die Welt bleibt bei geöffneten Dialogen und Panels zu kontrastreich; lokale Hauptinhalte erhalten zu wenig Fläche oder keine eigene opake Trägerfläche.

---

### B. Die Papier-/Behördenidee wird durch ein zweites digitales UI-System gebrochen

Schwarze Balken, Scanlines, Neon-Grün, Cyan-Vollflächen, transparente Schwarzpanels und rote Vollflächen-CTAs wirken wie Terminal-, CRT- oder Web-UI.

**Aufgetreten in:** `intro`, `dialog`, `building`, `panels-1von2`, `panels-2von2`, `office`, `broadcast`, `rooms`, `daycycle`, `ending-1von4` bis `ending-4von4`.

**Systemischer Kern:** Papier ist bislang ein Stil einzelner Screens, keine verbindliche Komponentenfamilie.

---

### C. Zustände sind visuell nicht semantisch getrennt

Aktueller Ort, Auswahl, Hover, Tastaturfokus, Questziel, Warnung und Alarm werden mehrfach mit denselben gelben, roten oder blauen Signalen codiert.

**Aufgetreten in:** `intro`, `building`, `panels-1von2`, `panels-2von2`, `daynight`, `office`, `rooms`, `ending-1von4` bis `ending-4von4`.

**Typische Folgen:** vorausgewählt und ausgewählt sehen gleich aus; aktive CTAs wirken trotz fehlender Voraussetzungen verfügbar; erreichte Enden gehen im Raster unter; Türen wirken gleichzeitig wie Ziel, Hover und Warnung.

---

### D. Schrift und Zeilen sind für 1280 × 720 zu klein oder zu lang

Funktionszeilen, Statuswerte, Skalen, Hinweise, Regieanweisungen und Berichtstexte verlangen wiederholt einen zweiten Blick.

**Aufgetreten in:** allen Bündeln.

**Systemischer Kern:** Es fehlt eine verbindliche Mindestgröße für Pixelschrift sowie eine maximale Lesebreite. Besonders Berichte und Dialoge nutzen zu oft fast die gesamte verfügbare Breite.

---

### E. Vertikale Planung, Safe Areas und Scrollzustände sind unzuverlässig

Raumtitel, Optionen, Diagramme, Buttons und ganze Panels werden angeschnitten; angeschnittene Karten sollen Scrollbarkeit andeuten, sehen aber wie Fehler aus.

**Aufgetreten in:** `building`, `panels-1von2`, `panels-2von2`, `daynight`, `broadcast`, `rooms`, `daycycle`, `ending-1von4` bis `ending-4von4`.

**Besonders kritisch:** `poster_detail`, `ambient_bubble`, `broadcast_expanded`, `decision_beat`, mehrere Wahlabend-S3-Screens sowie Report-Mitte und -Ende zeigen den angekündigten Zustand gar nicht oder nicht vollständig.

---

### F. Gleichartige Kästen nivellieren die Informationshierarchie

Viele Screens geben Titel, Metadaten, Wirkung, Nebenhinweis und Primäraktion ähnliche Rahmenstärke, Fläche und Größe. Dadurch entsteht Verwaltungslärm statt Aktenhierarchie.

**Aufgetreten in:** `intro`, `dialog`, `panels-1von2`, `panels-2von2`, `office`, `rooms`, `daycycle`, `ending-1von4` bis `ending-4von4`.

**Systemischer Kern:** Außenrahmen, Abschnittstrenner, Kartenrahmen und Statuschips besitzen zu ähnliche visuelle Gewichte.

---

### G. Spielfigur, aktueller Ort und Ziel sind in der Gebäudewelt nicht zuverlässig auffindbar

Kleine Figuren unterscheiden sich kaum von NPCs; Fahrstuhl und Raumtafeln ziehen häufig stärker als der Avatar.

**Aufgetreten in:** `intro`, `building`, `daynight`, außerdem indirekt `office`.

**Systemischer Kern:** Die Architektur ist detailliert genug für Atmosphäre, aber zu kleinteilig, um Zustände allein über Spritekleidung zu vermitteln.

---

### H. Modale Zustände sperren und beruhigen den Hintergrund nicht

HUD, Uhr, Shortcut-Leiste oder darunterliegende Buttons bleiben optisch aktiv und teilweise sogar lesbar.

**Aufgetreten in:** `dialog`, `building`, `panels-1von2`, `panels-2von2`, `daycycle`, `ending-1von4` bis `ending-4von4`.

**Systemischer Kern:** Es fehlt eine gemeinsame Modalhülle mit Scrim, Fokusfang, sicherer Randzone und eindeutiger Z-Ebene.

---

### I. Leere Zustände und Ergebniszustände erhalten zu wenig Eigengewicht

„Keine Nachrichten“, „Keine Weltereignisse“, Aktionsergebnisse, Wahlresultate und noch offene Analysen wirken wie fehlender Inhalt oder Logtext.

**Aufgetreten in:** `panels-1von2`, `panels-2von2`, `rooms`, `daycycle`, `ending-1von4` bis `ending-4von4`.

**Systemischer Kern:** Die Oberfläche behandelt leere beziehungsweise abschließende Zustände nicht als eigene Komponenten mit Icon, Überschrift, Erklärung und Handlung.

---

### J. Bildsprache und Assetmaßstab schwanken

Porträts, Charakterkonturen, Skyline-Ditherung, Kork, Wohnzimmer und TV-Grafiken unterscheiden sich sichtbar in Pixeldichte, Schärfe und Sättigung.

**Aufgetreten in:** `intro`, `dialog`, `building`, `daynight`, `office`, `broadcast`, `rooms`, `daycycle`, `ending-3von4`, `ending-4von4`.

---

## 3. Widersprüche zwischen den Bündeln

### Material und Flächen

- Akten und Berichte nutzen Creme, Kraftpapier und Tinte; Newsroom, Fokusgruppen, Gebäudebalken und Broadcast greifen dagegen auf Schwarz, Transparenz und Neon zurück.
- Dialogboxen sollen Papier sein, verwenden aber je nach Sprecher rote, blaue, olivfarbene oder beige Vollbänder. Dieselbe Metadatenfunktion erhält damit völlig unterschiedliche Flächengewichte.
- Kork wird teils als physischer Arbeitsgrund behandelt, teils liegt Text direkt auf der lauten Textur. Papierablagen fehlen ausgerechnet dort, wo Maßnahmen angeheftet werden sollen.

### Rot und andere Signalfarben

- Rot erscheint als Ministeriumskopfband, Alarm, positiver Kontostand, Abschlussbutton, Löschaktion, Wahlbalken, ausgewählte Karte und destruktive Aktion.
- Gelb bedeutet je nach Screen Ziel, aktueller Ort, Auswahl, Hover oder Warnung.
- Blau kennzeichnet mal Avatar, Auswahl, Phase oder normale Sprecheridentität. Damit ist Farbe nicht vorhersagbar.

### Knopf-Formen

- Primäraktionen erscheinen als rote Vollfläche, grüner Balken, graubrauner Kasten, neutrales Papier oder roter Doppelring.
- `MISSION BEGINNEN`, `AUSSPIELEN`, `WEITER`, `NÄCHSTER TAG`, `VERSTANDEN` und `BERICHT SCHLIESSEN` haben keine gemeinsame Höhe, Materialität oder Aktiv-/Deaktiviert-Logik.
- Schließen erscheint als freies „X“, gerahmter roter Knopf, Textbefehl oder gar nicht.

### Schriftgrößen und Typorollen

- In manchen Akten sind Überschriften groß und klar; in HUD, Endberichten und Dialogmetadaten werden Kernwerte wie juristisches Kleingedrucktes behandelt.
- Regieanweisungen sind teils Bestandteil derselben Zeile wie die Rede, teils fehlen sie visuell ganz.
- Passiv festgestellte Bewertungen sehen durch Outline-Chips wie anklickbare Filter aus.

### Raster und Abstände

- `panel_news` und `panel_npcs` haben massive Leerflächen, während `panel_stats`, `panel_mission`, `decision_beat`, Fokusgruppen und Endberichte unten überlaufen.
- Außenabstände, Kartengassen und Innenpolster wechseln selbst innerhalb derselben Panelserie.
- Die rechte Shortcut-Leiste besitzt eine konstante Breite, wird aber unten von Statusleisten überfahren und in anderen Screens von Panels überdeckt.

### Bildsprache

- Das Gebäude folgt feiner, scharfer Pixel-Art; Skyline, Kork und manche Wohnzimmer sind gröber, gesättigter oder stärker gedithert.
- Katja und Volkov liegen näher an einer gemeinsamen Charakterästhetik; Alexei, Marina und teilweise Igor wirken anders konturiert oder geglättet.
- Wahlabend-Sequenzen versprechen Wohnzimmer-, Büro- oder Sendungsschnitte, zeigen aber mehrfach dieselbe abstrakte TV-Grafik.

### Kameraführung und Bühnenmaß

- Figuren in Dialogen stehen überwiegend rechts und groß; Volkovs Intro bricht dieses Framing deutlich.
- Wahlabend-S0/S1 halten einen eingerückten TV-Rahmen, S2/S3 schieben ihn nach oben und schneiden ihn ab.
- Gebäudescreens zeigen oben abgeschnittene Raumtitel, obwohl unten dekorative Gleis- oder Fundamentfläche übrig bleibt.

---

## 4. Rangliste der 10 wirksamsten Änderungen

### 1. Fehlende, falsche und abgeschnittene Zustände reparieren

**Was:** Rendering-, Z-Index-, Overflow- und Scrollfehler zuerst beheben.  
**Wo:** `poster_detail`, `ambient_bubble`, `broadcast_expanded`, `decision_beat`, Wahlabend-S2/S3, Report-Mitte/-Ende, angeschnittene Raumtitel und „PUBLIKUM“-Elemente.  
**Warum:** Mehrere Screens zeigen nicht den benannten Inhalt oder verbergen bedienrelevante Optionen. Das ist vor jeder Stilverfeinerung zu beheben.  
**Aufwand:** mittel.

### 2. Eine verbindliche Zustandsmatrix definieren

**Was:** Sechs feste Zustände gestalten: normal, Hover, Tastaturfokus, ausgewählt, aktuell/„hier“, gesperrt; Warnung und Alarm separat. Fläche, Rand, Marker und Text müssen jeweils gemeinsam wechseln.  
**Wo:** Avatarwahl, Türen und Etagen, Panels, Vorgangskarten, Fokusgruppen, Operations-Akte, Enden-Raster.  
**Warum:** Beseitigt die häufigste semantische Unklarheit und reduziert den missbräuchlichen Einsatz von Gelb und Rot.  
**Aufwand:** mittel.

### 3. Alle Primäraktionen auf eine gemeinsame Stempel-CTA umstellen

**Was:** Helle Papierfläche, roter Doppelring, einheitliche Höhe und Innenabstände; deaktiviert ohne Rot und Pfeil. Rote Vollflächen nur für echte Alarme.  
**Wo:** Titel, Aktenübernahme, Büro, Board, Operations-Akte, Tageswechsel, Wahlabend, Report-Abschluss.  
**Warum:** Eine Komponentenänderung beseitigt einen der sichtbarsten Stilbrüche und klärt aktive gegen gesperrte Aktionen.  
**Aufwand:** klein bis mittel.

### 4. Eine gemeinsame Modal- und Panelhülle einführen

**Was:** 93–95 % maximale Viewportbreite, symmetrische Außenränder, opaker Papierkörper, fester Kopf, optional fester Fuß, nur der Inhaltskörper scrollt. HUD und Hintergrund werden gesperrt und auf etwa halbe visuelle Lautstärke gesetzt.  
**Wo:** Dialoge, Verzeichnisse, Seitenpanels, Fokusgruppen, Operations-Akte, Tagesbericht und Endberichte.  
**Warum:** Behebt gleichzeitig Hintergrundkonkurrenz, Ebenenlecks, unklare Scrollbarkeit und widersprüchliche Randabstände.  
**Aufwand:** mittel.

### 5. Mindesttypografie und Lesespalten festlegen

**Was:** Mikrolabels mindestens um etwa 20–25 % anheben; Werte stets größer als Labels; Fließtext auf ungefähr 65–75 Zeichen begrenzen; Regieanweisungen in eigener Zeile.  
**Wo:** HUD, Dialoge, Akten, Statusleisten, Reports, Wahlabend, Encyclopedia und Shortcut-Liste.  
**Warum:** Lesbarkeit ist in praktisch jedem Bündel beeinträchtigt und lässt sich größtenteils komponentenweit korrigieren.  
**Aufwand:** mittel.

### 6. Gebäudefokus mit drei festen Signalen lösen

**Was:** Aktive Etage 10–15 % heller, übrige Geschosse gedimmt; Avatar mit kleiner tintenblauer Kopfmarke und Bodenkontrast; nur das konkrete Ziel erhält einen zusätzlichen Marker.  
**Wo:** `arrival_*`, sämtliche `building_*`- und `sky_*`-Screens.  
**Warum:** Ein kleiner Overlay-Eingriff löst das zentrale Orientierungsproblem ohne neue Großassets.  
**Aufwand:** klein.

### 7. Schwarze und transparente Inhaltsflächen durch opake Dokumentkarten ersetzen

**Was:** Dunkle Kraftpapier-Unterlage plus helle Papierkarten; Transparenz nur für Scrims, nicht hinter Text. Scanlines aus Textflächen entfernen.  
**Wo:** Newsroom, Fokusgruppen, Gebäudesprechblasen, Terminals, Broadcast-Status und Teile der Dialoge.  
**Warum:** Verbessert Lesbarkeit und schließt den größten Bruch der Papieridee.  
**Aufwand:** klein bis mittel.

### 8. Das globale HUD auf ein festes Randraster setzen

**Was:** Uhr, Menü und HUD-Schalter in eine gemeinsame obere Gruppe; rechte Werkzeugleiste und untere Statusleiste reservieren gegenseitig ihren Platz. Labels und Werte erhalten gemeinsame Grundlinien.  
**Wo:** Gebäude, Büro, Day/Night, Broadcast und alle geöffneten Seitenpanels.  
**Warum:** Verhindert abgeschnittene Buttons, beruhigt die dauernd sichtbare Oberfläche und verbessert jeden Spielmoment.  
**Aufwand:** mittel.

### 9. Wahlabend und Endberichte in feste Sequenzvorlagen überführen

**Was:** Für Wahlabend durchgehend dieselbe TV-Position; innen drei Zonen für Kennung, Hauptaussage und Ticker. S3 erhält ein festes Raster für Bild, Konsequenz, Reaktionen und CTA. Berichte zeigen oberhalb des Falzes Ergebnis, drei Kennzahlen und eine vollständige Grafik; der erreichte Ausgang erhält einen „ERREICHT“-Stempel.  
**Wo:** `ending-1von4` bis `ending-4von4`.  
**Warum:** Diese Screens bilden den dramaturgischen und pädagogischen Abschluss, wirken derzeit aber wie mehrere nicht abgestimmte Prototypen.  
**Aufwand:** mittel bis groß.

### 10. Tageslicht und Assets technisch normalisieren

**Was:** Tageszeit nur auf Himmel, Skyline und Außenkanten maskieren; Innenlicht lokal stabil halten. Danach Porträtzuschnitte, Charakterkonturen, Kork, Skyline-Ditherung und Wohnzimmer auf gemeinsame Pixeldichte und Sättigung bringen.  
**Wo:** `daynight`, `dialog`, `intro`, `office`, `rooms`, `broadcast`, Endsequenzen.  
**Warum:** Erhöht räumliche Glaubwürdigkeit und Produktionsgeschlossenheit, hat aber geringere unmittelbare Bedienwirkung als die vorherigen Punkte.  
**Aufwand:** groß.

---

## 5. Was zuerst?

### 1. Den Zustands- und Overflow-Schaden beseitigen

In der nächsten Sitzung zuerst `poster_detail`, `ambient_bubble`, `broadcast_expanded`, `decision_beat` sowie je einen fehlerhaften Wahlabend- und Reportzustand reparieren. Zusätzlich eine feste Safe Area für 1280 × 720 definieren und per Screenshot-Test prüfen. Solange Inhalte fehlen, abgeschnitten sind oder auf falschen Ebenen liegen, ist jede visuelle Verfeinerung nachrangig.

### 2. Drei gemeinsame Komponenten festziehen

Unmittelbar danach `PaperSurface`, `StampButton` und `SelectionState` als verbindliche Komponenten bauen. Damit lassen sich rote Vollflächen, schwarze Textkästen, widersprüchliche Deaktivierungen und unklare Auswahlzustände in vielen Screens gleichzeitig ersetzen. Diese drei Komponenten liefern den größten sichtbaren Konsistenzgewinn pro Arbeitssitzung.

### 3. Gebäudefokus als Referenzfall implementieren

Aktive Etage aufhellen, andere Geschosse dimmen, Avatar markieren und nur das konkrete Ziel zusätzlich hervorheben. Das ist räumlich klar abgrenzbar, technisch überschaubar und sofort in `intro`, `building` und `daynight` wiederverwendbar. Zugleich erzwingt dieser Schritt erstmals eine saubere Trennung zwischen „hier“, „ausgewählt“, „Ziel“ und „Warnung“ — genau die semantische Grundlage, die der gesamten Oberfläche derzeit fehlt.

---

*Automatisch erzeugt — der Inhalt oberhalb dieser Zeile stammt vom genannten Fremdmodell und ist
ungeprüft. Nächster Schritt: Befunde am Code verifizieren, dann in `docs/STATUS.md` einordnen.*
