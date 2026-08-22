# 🗺 Plan: UX/UI nach der Zweitmeinung — sortiert nach Wirkung pro Aufwand

**Grundlage:** zwei Fremdmodell-Durchgänge über dieselben 19 Bildschirm-Bündel
(`stealth/ox-alpha` 2026-08-21, `gpt-5.6-sol` 2026-08-22) · **254 Befunde, in denen sich
beide unabhängig einig sind** · davon **20 am Code gegengeprüft**, mit `file:line`.
Vergleich: [`MODEL_REVIEWS/2026-08-22_VERGLEICH.md`](MODEL_REVIEWS/2026-08-22_VERGLEICH.md).

> **Wie dieser Plan gebaut ist.** Die Verifikation vom 2026-08-21 hatte gezeigt: Ein Modell,
> das nur Bilder sieht, erkennt zuverlässig *dass* etwas nicht stimmt, rät aber beim *Warum*
> (3/3 Beobachtungen richtig, 2/3 Diagnosen falsch). Der zweite Durchgang bestätigt das —
> über 20 Code-Prüfungen: **4 bestätigt, 14 teilweise, 2 widerlegt.** Deshalb steht in jedem
> Punkt unten die **am Code nachgemessene Ursache**, nicht die vom Modell vermutete. Wo sie
> abweicht, steht das ausdrücklich dabei; mehrfach wäre der vorgeschlagene Eingriff sonst
> wirkungslos geblieben.

---

## Die Rangfolge auf einen Blick

| # | Was | Aufwand | Warum hier | Status |
|---|---|---|---|---|
| **P0** | Einheiten-Bug im Tagesbericht | **winzig** | Kernkennzahl zeigt seit jeher 0 | ✅ geprüft |
| **P1** | Trägerflächen der Narrativ-Tafel | **winzig** | Kontrast 1,0:1 → Text unsichtbar | ✅ geprüft |
| **P2** | Entscheidungs-Modal einfassen | **klein** | einziges 100vh-Modal im Projekt | ✅ geprüft |
| **P3** | 9 rote Knöpfe → `stampCtaStyle` **+ Wache** | klein–mittel | Regel steht im Code und wird gebrochen | ✅ geprüft |
| **P4** | Schrift-Skala + Lesebreite als Token | klein | 19 Einigkeits-Befunde hängen daran | ✅ geprüft |
| **P5** | Spieler-Marker + Bodenschatten | klein | einziger Funktionsverlust im Gebäude | ✅ geprüft |
| **P6** | Lesebreite der DialogBox | winzig | höchste Frequenz im Spiel | ✅ geprüft |
| **P7** | Ernte: Wahlabend-Timing | klein | 10 von 13 unbrauchbaren Aufnahmen | ✅ geprüft |
| **P8** | Lagebericht-Knopf: Z-Ordnung | winzig | funktionslos genau wenn sichtbar | ✅ geprüft |
| **P9** | Leerzustände als Komponente | klein | 7 von 8 Stellen sind nackter Text | ✅ geprüft |
| **P10** | Porträt-Normierung | klein | größter Bruch im ersten Screen | ✅ geprüft |
| **P11** | Wertspalte im Entscheidungs-Modal | klein | die Entscheidung selbst | ✅ geprüft |
| **P12** | Gebäude-Beschriftung: eine Bezugskante | klein | Einheiten-Mix, zoom-instabil | ✅ geprüft |
| **P13** | Tageslicht-Kurve | mittel | betrifft jeden Welt-Screen | ✅ geprüft |
| **P14** | Scrim-Token + Modalhülle durchsetzen | mittel | 20 Scrims, 8 Schwarzwerte | ✅ geprüft |
| **P15** | Hover-Lücke der v3-Akten-Ansichten | mittel | 37 von 100 Knöpfen ohne Rückmeldung | ✅ geprüft |
| **P16** | Restliche Ernte-Timings | klein | 3 Aufnahmen | ✅ geprüft |
| — | **Entscheidungen, die niemand außer dem Eigentümer treffen kann** | — | 107 Widersprüche | ⚖ offen |

---

## P0 · Der Tagesbericht zeigt seine wichtigste Zahl als Null

**Aufwand: winzig (2 Zeilen).** **Das ist kein Design-, sondern ein Korrektheitsfehler.**

Beide Modelle meldeten „alle acht Milieubalken sehen gleich aus, die Grafik transportiert
keine Daten" und schlossen auf Platzhalter. Falsch — die Breiten werden sehr wohl gerechnet.
Sie sind nur **faktisch null**, weil ein 0..1-Wert in eine 0..100-Prozentbreite läuft:

```
DayReport.tsx:194   width: `${Math.max(0, Math.min(100, seg.belief))}%`
DayReport.tsx:17    belief: number;  // 0–100      ← Kommentar behauptet 0..100
StoryModeGame.tsx:1470   belief: seg.belief         ← liefert aber den Rohwert
audienceModel.ts:39-40   belief ist 0..1
```

Ein Milieu mit `belief` 0,35 rendert **0,35 % Breite**. Die Gegenprobe steht im selben Repo:
`BroadcastBar.tsx:370` rechnet korrekt `seg.belief * 100`. Zweite Stelle, gleiche Sorte:
`DayReport.tsx:120` bekommt `trustProgress` (0..1) und deckelt es auf 0..100.

**Fix:** `StoryModeGame.tsx:1470` → `belief: seg.belief * 100` (dann stimmt auch der
Interface-Kommentar), und `DayReport.tsx:120` analog zu `MorningBriefing.tsx:108` rechnen.

**Warum ganz oben:** Das Spiel will Datenkompetenz vermitteln. Eine Grafik, die acht
verschiedene Gesellschaftszustände als acht identische leere Balken zeigt, arbeitet direkt
gegen dieses Ziel — und der Spieler kann den Effekt seiner Arbeit nicht sehen. Zwei Zeilen.

> **Achtung beim Umsetzen:** `DayReport.test.tsx:18` fixiert selbst die falsche Annahme und
> `:15` liefert gar keine Segmente — der Test muss mitkorrigiert werden, sonst hält er den
> Bug fest.

---

## P1 · Auf der Narrativ-Tafel ist Text stellenweise physikalisch unsichtbar

**Aufwand: winzig (4 Zahlenwerte).** Bei **beiden** Modellen Platz 1 der wirksamsten Änderungen.

Gemessene WCAG-Kontraste der Spur-Texte auf ihrem tatsächlichen Untergrund:

| Text | gegen mittleres Kork | gegen ein helles Korkkorn |
|---|---:|---:|
| `#bfa988` | 2,34:1 | 1,58:1 |
| `#c9b48f` | 2,63:1 | 1,40:1 |
| `#e6d3ad` | 3,61:1 | **1,02:1** |

Bei 1,02:1 ist „TAGESGESCHÄFT" dort, wo ein helles Korn hinter dem Buchstaben liegt,
**nicht wahrnehmbar**. Am schlimmsten „DRITTE SPUR" (`NarrativeBoard.tsx:389-399`): keine
Trägerfläche **plus** `opacity: 0.55` auf der ganzen Zeile.

**Die Diagnose beider Modelle („Textur-Deckkraft senken") ist am Code nicht umsetzbar** — die
Textur ist `backgroundImage` des Scroll-Containers (`NarrativeBoard.tsx:236-247`), liegt
*hinter* allen Kindern, 1:1 skaliert, ohne Deckkraft-Regler. Der Gegenbeweis steht im selben
Bild: Die Papier-Notizen und das AKT-Band liegen auf **derselben** Textur und sind mit ~10:1
gestochen lesbar — weil sie eine deckende Trägerfläche mitbringen.

**Fix** — vier Werte in `NarrativeBoard.tsx`, keine Textfarbe, kein neues Asset:

| Zeile | von | auf |
|---|---|---|
| 373 (`lane-frei`) | `rgba(0,0,0,0.08)` | `rgba(44,31,18,0.86)` |
| 408 (`lane-tagesgeschaeft`) | `rgba(0,0,0,0.12)` | `rgba(44,31,18,0.86)` |
| 540 (`StrandLane`) | `rgba(0,0,0,0.12)` | `rgba(44,31,18,0.86)` |
| 391 (`lane-gesperrt`) | nur `opacity: 0.55` | Trägerfläche + Opazität nur auf den Text |

**Nachrangig, aber notierenswert:** Die Kachel `ui_cork_tile` überschießt ihren eigenen
Generierungs-Prompt (`assets.json:2017` verlangt „low contrast, completely uniform surface",
geliefert wurde Speckle bis nahe Weiß). Das verschärft den Effekt — behebt ihn aber nicht:
Selbst auf flachem `#7a5a36` läge `#c9b48f` nur bei ~2,3:1.

---

## P2 · Das Entscheidungs-Modal ist das einzige mit `max-h-[100vh]`

**Aufwand: klein.** Der prominenteste Befund beider Läufe — mit drei Korrekturen an der Deutung.

**Was stimmt:** Bei 1280×720 liegt der Rahmen auf y=0..719, also **720 von 720 px, Rand
null**. Der Beat „stadtrat" hat **vier** Optionen (A–D); sichtbar sind A, B und der Kopf von C.

**Was nicht stimmt:** Die Fußleiste liegt **nicht** im Kartenfluss. Kopf (`:71-79`),
Scrollbereich (`:130`) und Fuß (`:174-180`) sind drei Flex-Geschwister; der Kommentar
`:67-68` sagt es ausdrücklich. Der vom Modell vorgeschlagene Fußleisten-Umbau wäre
wirkungslos gewesen — dieselbe Fehldiagnose wie am 2026-08-21.

**Die echten Ursachen:**

1. `DecisionBeatModal.tsx:69` setzt `max-h-[100vh]`. **Jedes andere Modal** deckelt bei
   80–94vh (PixelModal 90, CrisisModal 90, BetrayalEventModal 90, NpcPanel 85, MissionPanel
   85, EventsPanel 85, NarrativeBoard 94). Dadurch fällt die Papierkante des `PixelFrame`
   mit der Bildschirmkante zusammen — man sieht keinen Fensterabschluss mehr.
   → **`max-h-[90vh]`.**
2. **Die Scroll-Affordanz existiert im Haus schon.** `DialogBox.tsx:194` begründet zum selben
   Review-Punkt B24: *„ohne ihn wirkte die letzte Option ‚halb abgeschnitten'"* — und
   `:373/:439` rendern dafür einen statischen Pixel-Marker **„▼ MEHR"** (bewusst kein
   Web-Verlauf, §4.6), gesteuert per ref + resize-Listener. DecisionBeatModal hat aus B24
   nur die Höhen-Deckelung übernommen, nicht die Affordanz. → **Muster kopieren.**
3. Die fehlende Scrollleiste im Screenshot ist ein **Ernte-Artefakt** (siehe Vergleich §2),
   nicht das Spiel. Bereits behoben.

---

## P3 · Neun rote Knöpfe brechen die eigene Regel — und es gibt nichts, das sie stoppt

**Aufwand: klein je Knopf, mittel für die Wache.** Einziger Befund mit Urteil **bestätigt**
(Beobachtung *und* Diagnose).

`theme.ts:68-71` schreibt vor: *„Primär-Aktionen sind GESTEMPELT statt rot geflutet … Rot
bleibt Stempel/Kopfband vorbehalten."* Trotzdem tragen **9 Knöpfe in 8 Dateien**
`ministryRed` als Fläche:

| Datei:Zeile | Knopf |
|---|---|
| `ActionFeedbackDialog.tsx:240` / `:548` | „VERSTANDEN" (beide Varianten) |
| `AdvisorDetailModal.tsx:90` | „SCHLIESSEN" |
| `AuftragSelect.tsx:78` | „AKTE ÜBERNEHMEN ▸" |
| `MaschenVortestView.tsx:206` / `:363` | „BEFRAGUNG BEAUFTRAGEN ▸", „MASCHE STARTEN ▸" |
| `OperationsAkteView.tsx:704` | „AUSSPIELEN ▸" (rot nur bei `complete`) |
| `PlayerOfficeView.tsx:541` | „FEIERABEND →" |
| `WahlabendScene.tsx:251` | „WEITER ▸" |

Korrekt sind 5 Stellen (`StoryModeGame:199`, `AvatarChoice:115`, `DayReport:397`,
`GameEndScreen:356`, `StoryHUD:459`). Kopfbänder, Balkenfüllungen und Badges sind **keine**
Verstöße — sie sind genau der erlaubte Rot-Ort.

> **Der eigentliche Befund liegt eine Ebene höher:** `stampCtaStyle` ist eine reine
> Opt-in-Konstante **ohne Durchsetzung**. Kein ESLint, keine Test-Wache, kein geteiltes
> Button-Primitiv (`grep` nach `stampCta`/`ministryRed` in `scripts/` und den Test-Ordnern:
> null Treffer). Die Zahl war am 2026-08-21 noch 4, heute 9. **Ohne Wache wächst sie weiter.**
> Deshalb gehört ein Test dazu, der neue vollrote `<button>` meldet — sonst steht derselbe
> Punkt in drei Monaten wieder hier.

---

## P4 · Es gibt keine Schrift-Skala — nur 23 gewachsene Größen

**Aufwand: klein (Token + mechanische Umstellung).** Urteil **bestätigt**; 19 der
Einigkeits-Befunde fallen in diese Kategorie.

Nicht nur die Mindestgröße fehlt, sondern **die ganze Skala**: 23 verschiedene Schriftgrößen
inklusive krummer rem-Werte (10,88 / 11,52 / 12,8 / 13,6 / 14,4 / 15,2 px in `TitleScreen.tsx`
und `StoryHUD.tsx`) — jede Komponente erfindet ihre eigenen. Dazu fehlt jede
`max-width`-Begrenzung für Fließtext.

**Fix:** `StoryModeType`-Token in `theme.ts` (Mindestgröße 10 px — bei VT323 mit
`size-adjust: 132 %` ergibt das 7,4 px Versalhöhe — plus eine Lesebreite), danach die
krummen Werte mechanisch darauf ziehen.

**Warum vor den Einzelfixes:** Dieselbe Klasse von Befunden taucht in jedem Bündel auf.
Einzeln behoben sind es 19 Eingriffe; über die Skala sind es einer plus Ersetzungen.

---

## P5 · Der Spieler findet sich im Gebäude nicht

**Aufwand: klein (ein Marker im Renderer, ein Schatten-Element).** Zwei Befunde, eine Ursache.

**Marker (Urteil: teilweise).** Die *einzige* eingebaute Unterscheidung zwischen Avatar und
Statisten ist ein Höhen-Delta (128 px gegen 112/116 px, `buildingLayout.ts:44`,
`corridorDecor.ts:164`, `BuildingStage.tsx:797`) — und das drückt der Bühnen-Scale ½
(`BuildingStage.tsx:346`) auf **6–8 Bildschirm-Pixel** zusammen, bei identischer
Blaugrau-Palette. Erschwerend: Der Stil-Guide **verbietet** der Spielfigur auffällige
Merkmale (`game-style-guide.md:55-58`) — die Unterscheidung *muss* also aus dem Renderer
kommen, nicht aus dem Sprite.

**Bodenkontakt (Urteil: bestätigt, Beobachtung *und* Diagnose).** Die Figuren stehen mit
`gap = 0` **exakt** auf der Wand-Fuß-Linie (nachgemessen in allen 8
`geometry/building_*.json`). Der „freigestellt"-Eindruck kommt also **nicht** aus einem
Platzierungsfehler, sondern rein aus dem fehlenden Schatten — ein reines Ergänzungsproblem.

**Fix:** Marker als erstes Kind des Avatar-Spans über `WorldAnchor`; Schatten aus einer
gemeinsamen Standlinien-Quelle (`wallFootY(floor)` in `buildingLayout.ts`). Keine neuen Assets.

---

## P6 · Die DialogBox ist zu 69 % leer — und zwar horizontal

**Aufwand: winzig (`max-width`).** Höchste Frequenz im Spiel: jede Dialogzeile.

Gemessen an `dialog_alexei.png`: Von 187 Zeilen der Box sind **129 tintenfrei (69,0 %)**;
der Text steht in 286 px einer **1244 px** breiten Box, Ink-Anteil der Inhaltsfläche 1,6 %.

Die Diagnose „feste Höhe" ist falsch — es gibt nirgends eine. Die **Hauptursache ist
horizontal:** `fixed left-0 right-0` + `mx-4` (`DialogBox.tsx:269, 277`) ohne jede
Zeilenlängenbegrenzung. Bei ~8,7 px/Zeichen passen ~138 Zeichen in eine Zeile — aber
**alle 294 `text_de`-Zeilen in `dialogues.json` sind ≤113 Zeichen** (Median 71). Kein
einziger Dialog des Spiels bricht je auf eine zweite Zeile um; die Box *kann* gar nicht voll
werden. (`min-h-[80px]`, `:357`, ist der kleinere, vertikale Anteil.)

---

## P7 · Ernte: der Wahlabend wird überklickt

**Aufwand: klein, nur `harvest.mjs`.** 10 der 13 unbrauchbaren Aufnahmen hängen hier.

Drei Ursachen, nicht eine:

1. `WahlabendScene.tsx:154` schaltet **per Timer** weiter (`delays [1900, 2600, 3000]`),
   `forceEnd` schläft aber blind 2000 ms vor dem s0-Shot (`harvest.mjs:550`) — der 1900-ms-Tick
   ist da durch. **Die Nummerierung s0..s3 ist um einen Schritt versetzt**, und der dritte
   Klick fällt hinter `LAST_STEP` und ruft `onComplete()`.
2. Der End-Report öffnet danach **von selbst** (`StoryModeGame.tsx:392-401`) — deshalb ist
   „gameend" nie der GameEndScreen, und `clickButton(/WEITER/i)` wie `setShowEndReport(true)`
   sind beide wirkungslos.
3. Der Report eines erzwungenen Endes ist kürzer als 1400 px Scroll ⇒ `mid` und `bottom`
   treffen denselben Anschlag.

Das VQA-Fenster exportiert bereits alle nötigen Hebel (`ui.setShowEndReport`,
`ui.setElectionNightDone`) — die Reparatur braucht **keine Änderung am Spielcode**.

---

## P8 · Der Lagebericht-Knopf ist genau dann funktionslos, wenn er sichtbar ist

**Aufwand: winzig.** Beide Modelle sahen „hängt an der Bildkante und wird beschnitten".

Beschnitten ist er **nicht** (gemessen: 16 px Rand rechts und unten, Beschriftung
vollständig). Das Problem ist die **Z-Ordnung**: `z-50` (`StoryModeGame.tsx:925`) unter dem
EndReport-Overlay mit `zIndex: 200` (`EndReport.tsx:925,931`) — er rendert auf **15 %
Helligkeit** (Kontrast ~1,3:1) und ist wegen des deckenden Overlays **nicht anklickbar**.
Da der Report bei Spielende ohnehin automatisch aufgeht, erscheint er nur in dem Moment, in
dem er nichts tut.

**Fix:** nur rendern wenn `!showEndReport` — und statt frei am Viewport in den Fußbereich des
`GameEndScreen` setzen (`GameEndScreen.tsx:207ff`, neben Neustart/Hauptmenü).

---

## P9 · Leerzustände: sieben von acht Stellen sind nackter Text

**Aufwand: klein (eine Komponente, sechs Einsatzstellen).**

Acht Fundstellen erfinden vier verschiedene Formen; genau **eine** (`EventsPanel.tsx:94-105`)
hat Icon + Überschrift + Unterzeile.

**Die eigentliche Ursache nennt keiner der Berichte:** Die Leerzustände sitzen in Containern
**ohne vertikale Zentrierung** — der Satz klebt oben, darunter bleibt die volle Panelhöhe
leer. Das ist der Grund, warum sie wie *fehlender Inhalt* aussehen und nicht wie ein Zustand.
Der tragende Teil des Fixes ist die Zentrierung, nicht das Icon.

---

## P10 · Die sechs Porträts sind nicht normiert — und der Versuch existiert nur als Prompt-Satz

**Aufwand: klein (~18 Zeilen, ohne Assets neu zu erzeugen).** Urteil **bestätigt**, in allen
fünf Teilaussagen am PNG gemessen.

Interessant ist der Mechanismus: Die Normierung wurde **schon einmal versucht**
(`shotlist.mjs:793-795`, „Paket-D-Re-Framing") und lebt **ausschließlich als Prompt-Satz** —
„head is exactly 40 percent of the image height, the eye line sits on the …". Ein
Bildgenerator hält so etwas nicht ein, und niemand prüft es nach.

**Fix:** Eine deterministische Frame-Tabelle im Code (`playerProfileStore.ts`, hinter
`PLAYER_PORTRAITS`) plus Zuschnitt in `AvatarChoice.tsx`. Der prüfende Agent hat das
Ergebnis bereits gerendert — der Ausschnitt sitzt.

> **Hier widersprechen sich die Modelle** (W1 im `intro`-Vergleich): ox-alpha hält die
> Porträts für „gemalt/AI-generiert, der größte einzelne Stilbruch"; gpt-5.6-sol hält sie für
> „scharf und grundsätzlich stilkompatibel, nur uneinheitlich zugeschnitten". Die
> Code-Prüfung stützt die zweite Lesart: Der Defekt sitzt im **Zuschnitt**, nicht im Stil.
> Ein Neu-Erzeugen aller sechs Porträts wäre die deutlich teurere Antwort auf die falsche Frage.

---

## P11 · Die Wirkungswerte stehen auf drei x-Positionen — wegen eines Flex-Umbruchs

**Aufwand: klein.** Betrifft die Entscheidung selbst: Risiko/Aufmerksamkeit sind das, was der
Spieler vergleicht.

Es gibt **nicht** zwei Layout-Varianten, sondern **einen** Codepfad
(`DecisionBeatModal.tsx:48-57`, alle vier Optionen über `:160`). Die scheinbare „Spalte" ist
ein Zeilenumbruch **innerhalb** jedes Chips:

- Die Kosten-Zeile hängt in `flex justify-between items-start gap-3` (`:148`); der Titel-Span
  (`:149`) hat weder `min-w-0` noch `flex-1`, die Kosten-Zeile (`:160`) weder `shrink-0` noch
  Mindestbreite → beide schrumpfen proportional zum Inhalt.
- Die Chips tragen kein `whitespace-nowrap` (`:57`) → bei knappem Platz bricht jeder Chip
  intern zwischen Zahl und Label um. Option A (kurzer Titel) bleibt einzeilig, B und C
  (lange, selbst umbrechende Titel, C zusätzlich mit Inline-Badge „★ BERATER RÄT") brechen.

**Fix:** `shrink-0` + `whitespace-nowrap` auf die Kosten-Zeile, `min-w-0` auf den Titel.

---

## P12 · Gebäude-Beschriftung: zwei Ebenen, zwei Bezugskanten, zwei Maßeinheiten

**Aufwand: klein.** Die Modelle sagten „drei Ebenen zu viel". Es sind **zwei Ebenen mit einem
Einheiten-Mix**:

`WorldAnchor` (`BuildingStage.tsx:56-65`) verankert in Welt-px, rastert Kinder aber via
`scale(1/view.scale)` nativ — Kinder-Offsets sind CSS-px. Das Etagen-Schild nutzt einen
**Welt**-Offset (`y={floor.y + 8}`, `:690`), das Türschild einen **CSS**-Offset
(`bottom: 20`, `:735`). Bei 1280 px sieht das zufällig fast richtig aus; bei jedem anderen
Zoom laufen die Ebenen auseinander.

**Fix:** beide Schilder auf `floor.y` ankern, beide Offsets in CSS-px. Bei 1280 px
pixelidentisch zu heute, danach zoomstabil.

---

## P13 · Die Tageslicht-Kurve — und warum Aufhellen allein nicht hilft

**Aufwand: mittel.** Von beiden Modellen als Top-3 gemeldet, in beiden Läufen.

**Bestätigt, sogar schärfer als behauptet:** Die Uhr läuft 09:00–18:00 (`t = minutes/540`).
Die Dämmerungs-Skyline blendet ab `t=0.5` ein — **13:30** — und steht um 14:25 bei 85 %.
Die Nacht-Rampe startet `t=0.82` = **16:23** und ist `t=0.92` = **17:17** voll: **volle Nacht
43 Minuten vor Feierabend.** Der Frühmorgen-Stützpunkt liegt bei CIE L\*=17,3 — nur 3,8 Punkte
über dem *hellsten* Nacht-Stop (L\*=13,5).

**Die entscheidende Korrektur:** Die naheliegende Reparatur („Mittags-Stützpunkt aufhellen")
wäre größtenteils **unsichtbar**. `skyGradientForMinutes` setzt die Stops auf 0 % / 58 % /
100 % (`skyTime.ts:55`), und der Verlauf wird als Hintergrund des **Viewport**-Containers
gemalt (`BuildingStage.tsx:411-412`). Der helle `horizon`-Stop sitzt damit auf 100 % =
Fensterunterkante — die liegt weit unter der Bodenlinie und ist von Skyline, Straße und
Untergrund vollständig verdeckt. Gemessen in `sky_0900.png`: freier Himmel nur bis y≈320 von
720 (44 %). **Sichtbar ist immer nur das dunkelste obere Drittel des Verlaufs.**

Wer also nur die Palette anfasst, ändert Pixel, die niemand sieht. Die **Geometrie** muss
zuerst stimmen: Stops an der tatsächlich sichtbaren Himmelszone ausrichten, dann Rampen
verschieben, dann Palette.

---

## P14 · Zwanzig Scrims, acht Schwarzwerte, kein Token

**Aufwand: mittel.** Der Befund ist nicht nur bestätigt, sondern **untertrieben**: Der
Story-Mode hat 20 Vollbild-Scrims mit **acht** verschiedenen Schwarzwerten (0,75 · 0,78 ·
0,82 · 0,85 · 0,90 · 0,92 · 0,95 · 0,97). Sichtbar: `floor_directory` (0,78) lässt das
Gebäude klar lesbar, `shortcuts` (0,90) ist praktisch schwarz.

**Die Diagnose ist falsch:** Es ist *nicht* dieselbe Komponente, die verschieden dimmt. Es ist
eine **halbfertige Migration** — der Plan PR 2b („~10 Modals → EIN Rahmen-System",
`STRANG2_FEINPLAN_2026-06-13_DIEGESE.md:111-118`) wurde gebaut, aber nur **7 Aufrufstellen**
migriert. **13 Modals** rendern bis heute ihr eigenes `fixed inset-0`-Scrim mit hartem
Literal daneben; die Cluster 0,85/0,90/0,95 sehen nach „ungefähr so dunkel wie das
Nachbar-Modal" aus, nicht nach Absicht.

Dazu fehlt `PixelModal` selbst, was eine Modalhülle leisten müsste: kein `role="dialog"`,
kein `aria-modal`, kein Fokusfang, kein Inert-Schalten des HUD.

**Reihenfolge:** erst `PixelModal` zur echten Hülle machen (Scrim-Token + Fokusfang + HUD
sperren), dann die 13 Nachzügler migrieren. Nicht umgekehrt.

---

## P15 · Die Hover-Lücke sitzt genau in den neuesten Ansichten

**Aufwand: mittel.** Der pauschale Befund „durchgehend fehlt Zustandsdesign" ist **widerlegt** —
und das ist eine wichtige Korrektur, weil er in beiden Synthesen weit oben stand.

**Was es tatsächlich gibt:** Fokus ist *systematisch* gelöst — eine globale Regel gibt jedem
Button eine amberfarbene Pixel-Kante bei Tastatur-Fokus (`index.css:172-178`, mit Kommentar
„KEIN blauer Web-Ring/Glow (Verbotsliste, §4.6)"). Hover haben **63 von 100** Buttons.

**Der echte, engere Defekt:** 37 Buttons ohne Hover, konzentriert auf die **inline-gestylten
„v3-Akte"-Ansichten** — MaschenVortestView (8), OperationsAkteView (6), TerminalView (5),
StageCountermeasureModal (2), BroadcastBar (2). Die Ursache ist strukturell: Diese Dateien
stylen ausschließlich über `style={{…}}`, und ein Tailwind-`hover:` greift darauf nicht;
CSS-in-JS-`:hover` gibt es nirgends (0 Treffer im gesamten Story-Mode), `onMouseEnter`
ebenfalls nicht. `theme.ts:64-66` exportiert `createBrutalistButton` mit genau diesen
Zuständen — und niemand benutzt es.

**Derselbe Mechanismus wie bei P3:** Es gibt kein geteiltes Button-Primitiv. Beide Punkte
lösen sich zusammen.

---

## P16 · Restliche Ernte-Timings

**Aufwand: klein.** `poster_detail` (Overlay noch nicht offen), `ambient_bubble` (Blase noch
nicht da oder schon abgelaufen), `broadcast_expanded` (im zugeklappten Zustand aufgenommen).
Alle drei sind Wartezeit-Probleme, keine Verdecker — die drei Verdecker sind bereits behoben.

Erledigt sind in diesem Durchgang schon: Krisen-Modal-, Tagesbericht- und
Entscheidungs-Beat-Wächter in `shot()`, sowie die sichtbaren Scrollleisten
(`ignoreDefaultArgs: ['--hide-scrollbars']`).

---

## ⚖ Was der Plan bewusst offen lässt

107 Widersprüche zwischen den beiden Modellen sind **keine Fehler, sondern Entscheidungen** —
gegenläufige Empfehlungen zur gleichen, korrekten Beobachtung. Sie gehören dem Eigentümer,
nicht einem Modell. Die tragenden:

| Frage | Für A spricht | Für B spricht |
|---|---|---|
| **Gelbes Ziel-Tag im Gebäude** | entsättigen — es hat hier keine aktive Bedeutung | behalten — es ist das einzige Farbsignal für „hier lang" |
| **Gelber Türrahmen** | verstärken — 1 px geht unter | zurücknehmen — liest sich als Alarm |
| **Abdunklung im Dialog** | mehr — Raumkanten laufen unruhig auf die Box | weniger — tote schwarze Zone verschluckt den Raum |
| **Leere Etagen** | beleben — liest sich als Fehler | stärker dimmen — hebt die aktive Etage heraus |
| **Pförtner-Sprechblase, Terminal-Grün, Scanlines** | diegetische Welt-Ebene behalten | auf Papier umstellen (Token-Treue) |

Der gelbe Türrahmen ist der lehrreichste Fall: **beide können recht haben** — eine haarfeine
Linie in einer grellen Farbe ist gleichzeitig zu schwach und zu laut.

Diese Fragen laufen alle auf **eine** Grundsatzentscheidung hinaus, die `VISION_LOCK`
bislang nicht trifft: *Wie viel Bildschirm-/Terminal-Welt darf neben der Papier-Welt stehen?*
Solange die offen ist, produziert jeder weitere Review dieselben Widersprüche.

---

## Vorgeschlagene Reihenfolge

**Sitzung 1 — die Winzigkeiten mit der größten Wirkung.** P0, P1, P6, P8. Vier Eingriffe von
zusammen unter zwei Dutzend Zeilen; danach zeigt der Tagesbericht echte Daten, ist die
Narrativ-Tafel lesbar, hat der Dialog eine Lesebreite und der Endbildschirm keinen toten
Knopf mehr.

**Sitzung 2 — die Systeme.** P4 (Schrift-Skala) und P3 (Stempel-CTA **mit Wache**) zusammen:
Beide brauchen ein Token und eine mechanische Umstellung, und beide leiden am selben
fehlenden Button-Primitiv wie P15.

**Sitzung 3 — die Welt.** P5 (Marker + Schatten), P12 (Bezugskante), P13 (Tageslicht, dort
**Geometrie vor Palette**).

**Nebenher, unabhängig:** P7 und P16 in der Ernte — sie kosten wenig und heben die Qualität
jedes künftigen Reviews.

**Erst danach:** P14 (Modalhülle) und P15 (Hover-Lücke) als eine zusammenhängende
Komponenten-Arbeit. Das ist der einzige Block, der größer als eine Sitzung ist.

---

*Alle mit ✅ markierten Punkte sind am Code nachgemessen und tragen `file:line`-Belege.
Die 254 Einigkeits-Befunde jenseits dieser Liste sind unverifiziert: gut abgesichert in der
Beobachtung, offen in der Ursache. Wer einen davon anfasst, prüft ihn vorher — die Quote der
falschen Diagnosen liegt bei 14 von 20.*
