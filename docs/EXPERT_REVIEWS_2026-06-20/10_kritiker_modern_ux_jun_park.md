# Kritiker-Persona 5 — Jun Park (Moderne First-Session / UX)

> Referenz: Reigns (Nerial — binäre Entscheidungs-Beats), Plague Inc (Mobile-Onboarding), Frostpunk
> (HUD-Klarheit), Papers Please. **Web blockiert** — Vergleiche aus den Spielen selbst + etablierten
> First-Session-Heuristiken (progressive disclosure, toy-before-system). Bewertet den IST-Stand (nicht den alten Playtest-Build).

## Gesamteindruck (erste 20 Minuten, ehrlich simuliert)
Deutlich näher am „bleiben" als der Playtest vermuten ließ: Default-Name leer, Tag-1-Führung, Wirkungs-
Vorschau, Vorzeichen, EIN NPC-Block, Titel-Kontrast, Jahres-Gate — alles **bereits behoben**. Absprung-Risiko
2025 ist nicht der Inhalt, sondern **die Bühne**: toter Heimweg, zwei Aktionsflächen, überladenes Modal,
bestes Feature versteckt.

## Befunde
- **B1 — Der tote Heimweg ist immer noch da (teuerster First-Session-Moment).** `BuildingView.tsx:50–56` kein Indikator; `requestEndDay` stiller No-Op. *„Der Bildschirm tut so, als hätte ich nichts getan — also klicke ich nochmal … kaputt."*
- **B2 — Zwei Aktionsflächen, divergierende Verben** (Gate gekappt → jetzt nahezu redundante Flächen). *„Warum zwei Orte mit drei Wörtern für ‚jetzt machen'?"*
- **B3 — Decision-Beat-Modal (Reigns-Herzstück) hinter 7 Bedingungen vergittert** (`StoryModeGame.tsx:1331–1338`). *„Das ist die beste Mechanik im Spiel — warum muss ich Glück haben, dass sie überhaupt erscheint?"*
- **B4 — Ergebnis-Modal ist ein Dashboard geworden** (bis ~10 Blöcke, ein „VERSTANDEN"). *„Ich wollte nur sehen, ob es funktioniert hat — jetzt scrolle ich durch eine Steuererklärung."*
- **B5 — Wirkungs-Vorschau spricht mit gespaltener Zunge** (echte Werte-Deltas direkt neben „{n} NPC-Bonus" + großem Affinity-Block). *„Polarisierung +6 oder 1 NPC-Bonus? Was ist wichtig?"*
- **B6 — Zwei-Welten-Bruch** (diegetisches Korkbrett vs. Web-Such-Panel/Modals). *„Mal Pixel-Büro mit Zetteln, mal Excel-Maske."*
- **B7 — Zeit-Wildwuchs visuell entschärft, mechanisch vierfach** (HUD default aus = gut). *„Eine Uhr, AP, Monat, Jahr — alle messen, wie weit ich bin."*
- **B8 — Bildungs-Disclaimer zu leise** (0.68rem). *„Wenn das ein Lernspiel sein will, sollte der Lern-Rahmen nicht das Kleingedruckte sein."*

## Stärken
Mikro-Loop exzellent (ON-AIR + Wohnzimmer-Auto-Peek); Decision-Beat-Modal auf Reigns-Niveau; spürbarer
Fortschritt seit dem Playtest (Team hört auf Tests); Fiktion zündet <2 min; Korkbrett voll tastaturbedienbar.

## Top-Verbesserungen
1. **Heimweg sofort quittieren** (1 Tag, höchste Wirkung): `{walkHome && <Overlay + Skip>}`.
2. **Decision-Beat aus dem Bedingungs-Käfig holen** → prominenter Tagesmoment („Heute entscheiden Sie").
3. **Eine Aktionsfläche, ein Verb-Set.**
4. **Ergebnis-Modal für die erste Sitzung abspecken** (Combos/Verrat erst, wenn Mechanik aktiv).
5. **Eine Wirkungs-Sprache auf der Karte** (Barometer/Gesellschaft zuerst, NPC-Bonus klein).

## Schlussurteil
*„Das gute Spiel ist schon da — es versteckt sich gerade nur hinter seiner eigenen UI; macht die Bühne
so lesbar wie das Spielzeug, und ich bleibe."*
