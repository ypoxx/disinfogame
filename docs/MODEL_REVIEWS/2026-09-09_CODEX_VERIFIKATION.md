# Codex-Befunde am Code gegengeprüft (2026-09-09)

Ein bei Codex entwickelter Prüfplan meldete zwölf Befunde (E01–E12) gegen **`origin/main`**
(`9dfbb38`) — also gegen den Stand *ohne* die PRs #112 und #113. Dieses Dokument prüft sie am
Code nach, nach derselben Regel wie [`2026-08-21_VERIFIKATION.md`](2026-08-21_VERIFIKATION.md):
**Beobachtung und Diagnose sind zwei verschiedene Dinge.** Dort stimmten 3/3 Beobachtungen,
aber nur 1/3 Diagnosen.

## Verfahren

Acht Prüfagenten, je einer pro Befundgruppe, mit dem Auftrag, die *Ursache* rückwärts bis zur
Quelle zu verfolgen und Fundstellen mit `datei:zeile` zu belegen. Jeder Befund, der eine
Handlung ausgelöst hätte, ging danach durch **zwei Skeptiker mit dem Auftrag zu widerlegen** —
einer auf die Ursache, einer auf Schweregrad und Wirkung. Im Zweifel galt: widerlegt.

Beide Stände wurden geprüft, `origin/main` und der Branch-Kopf, denn ein Teil der Befunde ist
zwischenzeitlich behoben worden.

Die Befundtexte unten stehen im **Wortlaut der Prüfagenten**, nur die Umlaut-Umschrift wurde
normalisiert — sie sind Beleg, nicht Prosa. Jede genannte Datei wurde gegen das Repository
geprüft: von 89 Verweisen existieren 89; die beiden Ausnahmen (`StoryEngineTypes.ts`,
`consequence-reactions.json`) sind ausdrücklich Vorschläge für *neue* Dateien im
Wartbarkeits-Befund, keine Fehlverweise. **Keine erfundene Fundstelle.**

## Ergebnis in Zahlen

| | Anzahl |
|---|---:|
| Befunde insgesamt geprüft | 40 |
| davon Zusatzfunde, die Codex nicht gemeldet hatte | 5 |
| bestätigt | 33 |
| teilweise | 3 |
| widerlegt | 2 |
| auf dem Branch bereits behoben | 1 |
| ungeklärt (ehrlich offen) | 1 |
| **Codex-Diagnose zutreffend** | **12 von 40** |
| in der Gegenprobe von beiden Skeptikern gekippt | 6 |

Die Quote wiederholt sich: **die Beobachtungen trugen fast durchweg, die Diagnosen nicht.**
Ein Teil der 28 Abweichungen geht darauf zurück, dass Codex die Ursache ehrlich offenließ —
das ist kein Fehler, sondern genau die Lücke, die diese Prüfung schließen sollte.

Von beiden Skeptikern gekippt und deshalb **nicht** in der Maßnahmenliste:

- **E02a** (Zusatzfund derselben Klasse (von Codex nicht berichtet): drei weitere Subsysteme haben fer…) — desinformation-network/src/story-mode/engine/DialogLoader.ts:1261-1300 (exportState/importState für dialogueHistory + emotionalMemory existieren — "keine Serialisierung" ist falsc
- **E04b** (Teil von Codex E04: die 'Operationsbeschriftung' vermittelt ein eigenes Hauptziel.…) — desinformation-network/src/story-mode/engine/Auftraege.ts:64 ({ wert: 'vertrauen', richtung: 'runter', start: 100, ziel: 50 } — Vertrauenssenkung ist eine aktive, per Min-Regel zwi
- **E09d** (Zusatzbefund im selben Datenpfad (von Codex NICHT berichtet): generateRecommendations arbe…) — desinformation-network/src/story-mode/hooks/useStoryGameState.ts:419 — `const [worldEvents, setWorldEvents] = useState<WorldEventSnapshot[]>([]);` ist der EINZIGE Treffer für "set
- **E07a** (Der Ergebnisdialog nach einer Aktion verdeckt die Publikumsreaktion in der Sendeleiste.…) — desinformation-network/src/story-mode/components/ActionFeedbackDialog.tsx:716 (renderPublikum() im Single-Modal, Block '◍ PUBLIKUM — STIMMUNG IM LAND', definiert :175-196) sowie :5
- **E07c** (Die Publikumsansicht (Wohnzimmer) wirkt gedraengt.…) — desinformation-network/src/story-mode/assets/useSprite.ts:62-70 (width: sheet.frameWidth = 48, Layoutbox bleibt unskaliert) und desinformation-network/src/story-mode/assets/PixelSp
- **E08a** (Codex brauchte in einem Erstlauf etwa 2:05 Minuten bis zur ersten Aktion und empfand die f…) — desinformation-network/src/story-mode/components/MorningBriefing.tsx:162-166 (Tag-1-Hinweis „Ihr erster Schritt: Öffnen Sie das Terminal (Taste A) und fuehren Sie eine Maßnahme a

---

## Die Befunde, die standgehalten haben

### P0 — blockiert oder zerstört Fortschritt

#### E01 · Nach der Aktion Bot-Netzwerk an Tag 4 wurde die Oberfläche leer, mit Konsolenfehler zu fehlendem 'severity' in ConsequenceTimeline.tsx:106.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 0/2 widerlegt

**Ursache (am Code belegt).** DATENFEHLER, nicht Renderfehler. Kette rückwärts belegt: (1) In desinformation-network/src/story-mode/data/consequences.json kommt die Zeichenkette 'severity' NULL Mal vor - alle 24 Konsequenz-Definitionen haben kein severity-Feld (geprüft per JSON-Parse: 24/24 ohne severity; auch der Block consequence_types enthält keines). (2) ConsequenceSystem.ts:158 laedt diese Daten als 'const data = consequencesData as any' und legt sie ungeprüft in Map<string, ConsequenceDefinition> (Zeile 160). Dieser as-any-Cast ist das Typloch: der TypeScript-Typ ConsequenceDefinition (ConsequenceSystem.ts:105) verlangt severity als Pflichtfeld, der Cast schaltet die Prüfung ab. Belegt: 'npx tsc --noEmit' läuft mit Exit 0 grün, obwohl das Feld in den Daten fehlt. (3) StoryEngineAdapter.ts:5746 kopiert in registerPotentialConsequences 'severity: def.severity' - also undefined - in das UI-Objekt. Der Zieltyp PendingConsequence (StoryEngineAdapter.ts:530) verlangt severity ebenfalls als Pflichtfeld, TypeScript glaubt aber wegen (2), der Wert sei vorhanden. (4) StoryModeGame.tsx:1036 reicht getPendingConsequences() an die Timeline. (5) ConsequenceTimeline.tsx:106 ruft 'consequence.severity.toUpperCase()' völlig ungeschuetzt auf -> TypeError bei undefined. Zeile 87 (getSeverityColor) fällt dagegen sauber in den default-Zweig, stürzt also nicht ab; Zeile 106 ist die einzige Absturzstelle. Bot-Netzwerk-Bezug konkret: consequences.json, erste Definition 'cons_bot_exposed' (Bot-Netzwerk enttarnt) mit triggered_by ['2.1','2.2','5.1'); actions.json 2.1 = 'Bot-Netzwerk aufbauen', 2.2 = 'Bot-Netzwerk erweitern'. Auslösewahrscheinlichkeit beim ersten Einsatz 0.30 (base 0.15 + fest verdrahteter Boost 0.15, ConsequenceSystem.ts:203-217). Die Timeline rendert bereits, sobald die Liste nicht leer ist (ConsequenceTimeline.tsx:44) - der Absturz kommt also unmittelbar beim nächsten Render nach dem erfolgreichen Wurf, nicht erst wenn die Konsequenz aktiviert. Der Fehler ist NICHT bot-netzwerk-spezifisch: von 30 geladenen Aktionen zeigen 8 (2.1, 2.2, 2.3, 2.4, 2.10, 2.12, 2.17, 2.18) auf existierende Konsequenzen, und ALLE davon auf Definitionen ohne severity. Bot-Netzwerk ist nur eine häufige fruehe Aktion. Gilt auf origin/main UND unverändert auf HEAD: consequences.json ist zwischen origin/main und bf709d6 identisch (24/24 ohne severity), der einzige Diff in ConsequenceTimeline.tsx zwischen beiden Ständen ist die Schriftgröße 9px->10px in zwei Zeilen; Zeile 106 ist unverändert.

**Worin Codex abwich.** Codex hat den Absturzort exakt getroffen (ConsequenceTimeline.tsx:106) und ausdrücklich offengelassen, woher der fehlende Wert stammt - es hat also keine Ursache benannt. Die tatsächliche Ursache liegt nicht in der Komponente, sondern zwei Schichten tiefer in der Datendatei consequences.json (Feld existiert nirgends) plus dem as-any-Cast in ConsequenceSystem.ts:158, der genau diese Lücke vor dem Compiler verbirgt. Wer nur Zeile 106 mit einem Optional-Chaining absichert, behebt den Absturz, lässt aber die Datenluecke bestehen: die Timeline zeigt dann dauerhaft eine leere/unbekannte Schwere, und die severity-abhaengige Logik in StoryEngineAdapter.ts:2523-2527 und 6297-6298 stuft weiterhin jede Konsequenz still als harmloses 'info' ein.

**Nutzerwirkung.** Vollständiger Spielabbruch: die gesamte Oberfläche wird weiß, laufender Fortschritt ist ohne Neuladen verloren. Ausgelöst von 8 der 30 spielbaren Aktionen mit je rund 30 Prozent Chance beim ersten Einsatz - ein normaler Spieldurchlauf trifft das fast sicher innerhalb der ersten Tage. Zusatzschaden auch ohne Absturz: da severity überall undefined ist, werden Konsequenzen in Meldungen und Prioritäten durchgehend als 'info' statt als Gefahr eingestuft.

**Kleine Korrektur.** Zwei enge Eingriffe. (a) Datenriegel in ConsequenceSystem.ts:158-161: beim Laden jede Definition normalisieren, also fehlendes severity auf einen Default setzen (z.B. 'moderate') und per storyLogger warnen, statt sie roh per as-any in die Map zu schieben. (b) Renderschutz in ConsequenceTimeline.tsx:106: den Zugriff absichern, z.B. (consequence.severity ?? 'unbekannt').toUpperCase(). Inhaltlich richtig wird es erst, wenn (c) in consequences.json für alle 24 Definitionen ein echtes severity gepflegt wird - der type-Wert und die effects-Bloecke geben die Einstufung her.

**Strukturelle Alternative.** Den as-any-Cast beim Laden aller data/*.json durch eine echte Schema-Validierung ersetzen (Zod oder ein Vitest-Datentest, der jede JSON-Datei gegen ihr TypeScript-Interface prüft). Der Fall zeigt das Muster: TypeScript strict ist aktiv und tsc läuft grün, trotzdem fehlen Pflichtfelder, weil die Spieldaten die Typgrenze ungeprüft passieren. Neben severity fehlen in derselben Datei auch label_en und description_de/en, und player_choices benutzt cost/outcome statt der im Typ verlangten costs/outcome_de/outcome_en - dieselbe Lücke, nur ohne Absturz. Ein Datentest hätte alle vier Abweichungen auf einen Schlag gefunden.

**Abnahme.** Neues Spiel starten, 'Bot-Netzwerk aufbauen' (Aktion 2.1) so oft ausfuehren, bis der Konsequenz-Wurf trifft (Log: 'Consequence scheduled: Bot-Netzwerk enttarnt'). Erwartung: die Leiste AUSSTEHENDE KONSEQUENZEN erscheint mit einer lesbaren Schwere-Angabe, die Oberfläche bleibt bestehen, die Konsole zeigt keinen TypeError. Zusätzlich automatisierbar: ein Test, der jede Definition aus consequences.json auf ein severity aus der Menge minor|moderate|severe|critical prüft - dieser Test schlägt auf HEAD heute bei 24 von 24 Eintraegen fehl.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/data/consequences.json:1 (alle 24 consequences ohne severity; Zeichenkette kommt 0x in der Datei vor)`
- `desinformation-network/src/story-mode/engine/ConsequenceSystem.ts:158`
- `desinformation-network/src/story-mode/engine/ConsequenceSystem.ts:105`
- `desinformation-network/src/story-mode/engine/ConsequenceSystem.ts:203`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5746`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:530`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1036`
- `desinformation-network/src/story-mode/components/ConsequenceTimeline.tsx:106`
- `desinformation-network/src/story-mode/components/ConsequenceTimeline.tsx:44`

</details>

#### E02 · Bezahlter Creator ist nach dem Fortsetzen wieder nur "verfügbar", erworbenes Kompromat fehlt, das ausgegebene Budget bleibt ausgegeben.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* M · *Gegenprobe:* 0/2 widerlegt
· *Skeptiker zum Schweregrad:* P1

**Ursache (am Code belegt).** BELEGT: Die Serialisierung ist asymmetrisch. `buildCarrier` zieht das Geld aus `this.storyResources` ab (StoryEngineAdapter.ts:5202-5203: `this.storyResources.budget -= budget; this.storyResources.capacity -= capacity;`) und legt die Ware in `this.carrierStates` (5204). `acquireKompromat` zieht ebenfalls aus `storyResources` ab (5222) und legt die Ware in `this.acquiredKompromat` (5230). `saveState()` (6912-6968) serialisiert `storyResources` (6916) — aber WEDER `carrierStates` NOCH `acquiredKompromat`. Beide Felder (3993/3994) tauchen im gesamten save/load-Block nicht auf; `loadState()` (6972-7095) setzt sie folglich nie und sie bleiben auf dem Initialwert der frischen Engine (leere Map/Set). `getCarrierState` liefert dann den Default 'verfügbar' (5185). Geld ist im Save, Ware nicht — genau die beobachtete Asymmetrie. Laufzeit-Nachweis (Vitest, HEAD, frischer Mount = echter Reload-Pfad): SESSION 1 budget=126, carrier='aktiv', kompromat=['t_influencer:alte_posts'] → speichern → neu mounten → loadGame → SESSION 2 budget=126, carrier='verfügbar', kompromat=[]. Verschärfend: Autosave läuft bei JEDEM Phasenwechsel (StoryModeGame.tsx:776-781), der Verlust ist also nicht optional. ZWEITE, unabhängige Schicht derselben Beobachtung: `loadGame` (useStoryGameState.ts:1702-1734) frischt die React-Spiegel `carrierStates` (1316) und `acquiredKompromat` (1317) nicht auf. Im selben Mount zeigt die Operations-Akte danach weiter 'aktiv', während die Engine 'verfügbar' sagt → Klick auf AUSSPIELEN scheitert mit "Verbreiter noch nicht aufgebaut" (5250). Beide Schichten müssen behoben werden.

**Nutzerwirkung.** Echter Datenverlust bei jedem Fortsetzen: gekaufte Verbreiter und beschafftes Kompromat sind weg, Budget/Kapazität/Risiko/moralische Last der Käufe bleiben abgezogen. Der Spieler muss dieselbe Ware zweimal bezahlen — bei knapper Tranchen-Ökonomie (E18) kann das den Lauf unspielbar machen. Zusätzlich fällt die Operations-Bilanz im Abschlussbericht auf null zurück.

**Kleine Korrektur.** In `saveState()` vier Zeilen ergänzen: `carrierStates: Array.from(this.carrierStates.entries())`, `acquiredKompromat: Array.from(this.acquiredKompromat)`, `operationsPlayed`, `carriersUsed`/`platformsUsed` als Arrays. In `loadState()` spiegelbildlich mit Defaults (`new Map(state.carrierStates ?? [])`, `new Set(state.acquiredKompromat ?? [])`, `?? 0` / `?? []`) — der bestehende Default-Merge-Stil trägt Altstände ohne Migration. `SAVE_FORMAT_VERSION` (704) auf '2.4.0' heben und den Kommentarblock (690-703) fortschreiben. In `loadGame` (useStoryGameState.ts:1702) zusätzlich `setCarrierStates(engine.getCarrierStates())` und `setAcquiredKompromat(...)`; dafür fehlt ein Getter — kleinster Zuschnitt: `getAcquiredKompromat(): string[] { return Array.from(this.acquiredKompromat); }` neben 5209.

**Strukturelle Alternative.** Die Ursache ist eine handgepflegte Feldliste: `saveState` zählt 44 Felder einzeln auf, während die Klasse ~20 weitere mutierbare Felder hat — jedes neue Feld ist ein potenzieller stiller Verlust (carrierStates existiert seit P2 und war NIE im Save). Strukturell: den persistenten Zustand in EIN benanntes Objekt (`this.persistent = {...}`) bündeln, das als Ganzes serialisiert wird, plus einen Test, der die Schlüsselmenge von `saveState()` gegen eine explizite Erwartungsliste prüft und bei jedem neuen Feld rot wird (Konsistenztest statt Disziplin).

**Abnahme.** Testfall: Engine A — buildCarrier(c) + acquireKompromat(t,v) → saveState() → NEUE Engine B → loadState() → `B.getCarrierState(c) === 'aktiv'`, `B.isKompromatAcquired(t,v) === true`, `B.getResources().budget` gleich A. Zweiter Testfall über den Hook mit frischem Mount (unmount/remount): `state.carrierStates[c] === 'aktiv'` und `playOperation(...)` liefert kein "noch nicht aufgebaut". Dritter: `getOperationsSummary().operationsPlayed` bleibt über save/load erhalten.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:3993`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:3994`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5193-5206`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5216-5231`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:6912-6968`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:6972-7095`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1316-1317`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1702-1734`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:776-781`

</details>

### P1 — erhebliche Fehlführung

#### E01a · Codex berichtete eine komplett leere Oberfläche, nicht nur eine kaputte Konsequenz-Leiste - Teilfrage 5 des Auftrags.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 0/2 widerlegt

**Ursache (am Code belegt).** Es gibt im gesamten aktiven Spiel keine Fehlergrenze. Die Suche nach ErrorBoundary, componentDidCatch und getDerivedStateFromError über desinformation-network/src liefert null Treffer. main.tsx rendert <App/> nackt in React.StrictMode, App.tsx gibt direkt <StoryModeGame/> zurück, und die abstuerzende ConsequenceTimeline hängt in StoryModeGame.tsx:1030-1042 mitten im Sub-HUD-Zweig desselben Baums. React 18 (react ^18.2.0 laut package.json) unmountet bei einem unbehandelten Renderfehler den kompletten Root - deshalb verschwindet die ganze Seite und nicht nur die eine Komponente. Das ist ein Schadensverstärker, nicht die Ursache von E01: ohne den Datenfehler stürzt hier nichts ab, aber jeder künftige Renderfehler an beliebiger Stelle hat dieselbe Totalwirkung.

**Worin Codex abwich.** Codex hat diesen Punkt gar nicht benannt - es beschrieb nur die leere Oberfläche als Symptom, ohne zu erklären, warum ein Fehler in einer kleinen HUD-Leiste das gesamte Spiel mitnimmt. Der Grund ist strukturell und liegt ausserhalb der von Codex genannten Datei.

**Nutzerwirkung.** Jeder einzelne Renderfehler irgendwo im Baum - heute die Konsequenz-Leiste, morgen eine beliebige andere Komponente - macht das komplette Spiel unbedienbar und vernichtet den Spielstand der Sitzung. Es gibt keinen Rücksprungpunkt und keine Fehlermeldung für den Spieler.

**Kleine Korrektur.** Eine ErrorBoundary-Komponente anlegen und in App.tsx um <StoryModeGame/> legen, mit Fallback-Text und Neustart-Knopf. Zusätzlich eine zweite, engere Grenze um den Sub-HUD-Block in StoryModeGame.tsx:1030-1042, damit ein Fehler in Timeline oder Betrayal-Indikatoren nur diese Leiste ausblendet und das Spiel weiterlaeuft.

**Strukturelle Alternative.** Fehlergrenzen an den drei tragenden Naehten des Spielerpfads setzen: Wurzel (App), HUD-Streifen und Haupt-Ansichtsfläche. Wenn zusätzlich der Fehler samt Komponentennamen an storyLogger geht, fällt ein solcher Absturz schon im Container-Smoketest auf, statt erst live.

**Abnahme.** In einer Testkomponente innerhalb des Sub-HUD absichtlich einen Fehler werfen. Erwartung: nur die HUD-Leiste wird durch den Fallback ersetzt, Gebäude-Ansicht und Bedienung bleiben nutzbar; erst ein Fehler ausserhalb aller Grenzen löst den Wurzel-Fallback mit Neustart-Knopf aus - in keinem Fall eine weiße Seite.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/main.tsx:6`
- `desinformation-network/src/App.tsx:13`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1030`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1036`

</details>

#### E03a · „Probleme bei abgeschlossenen Aktionen nach Laden."

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 0/2 widerlegt

**Ursache (am Code belegt).** BELEGT — und die naheliegende Diagnose ist FALSCH: Die Engine speichert die benutzten Aktionen korrekt. `actionLoaderState` steht im Save (6966), `ActionLoader.exportState()` liefert `usedIds` (ActionLoader.ts:374-390), `importState` setzt sie zurück (396-431). Laufzeit-Nachweis: nach save/load meldet die Engine für die gespielte Aktion weiterhin `available=false, unavailableReason='Already used'`. Die echte Ursache liegt eine Schicht höher: Der Hook führt eine ZWEITE, unabhängige Liste `completedActions` als React-State (useStoryGameState.ts:415), befüllt ausschließlich in `executeAction` (1070: `setCompletedActions(prev => [...prev, actionId])`). `loadGame` (1702-1734) stellt sie NICHT wieder her — es gibt im ganzen Ladepfad kein `setCompletedActions`. Laufzeit-Nachweis (frischer Mount = echter Fortsetzen-Pfad): SESSION 1 completedActions=['1.1'] → speichern → neu mounten → loadGame → SESSION 2 completedActions=[] bei gleichzeitig 'Already used' in der Engine. Diese Liste ist keine Deko: (a) Episoden-Abschluss hängt an ihr — `ep.einklink_aktionen.every(id => completedActions.includes(id))` (1267); (b) Strang-Fortschritt in der Anzeige — StoryModeGame.tsx:561 `erledigt: ep.einklink_aktionen.filter(id => state.completedActions.includes(id))`; (c) Berater-Empfehlungen (900) und Krisen-Trigger `actionCount` (977).

**Worin Codex abwich.** Codex nannte keine Ursache. Wer sie im Speicherformat sucht, sucht falsch: die Engine persistiert die benutzten Aktionen korrekt. Der Fehler sitzt im React-Spiegel `completedActions` des Hooks, den `loadGame` nicht rekonstruiert.

**Nutzerwirkung.** Weiche Sackgasse: Ein Erzählstrang, von dessen 2-3 Einklink-Aktionen vor dem Speichern schon eine gespielt war, kann nach dem Fortsetzen NIE mehr abgeschlossen werden — der Zähler steht wieder bei 0/N, die fehlende Aktion ist aber in der Engine als „Already used" gesperrt und aus der Terminal-Liste gefiltert (TerminalView.tsx:186). Der Strang zahlt seine `wirkt_auf`-Wirkung nie aus und blockiert dauerhaft einen Brett-Slot. Zusätzlich zeigt die Strang-Anzeige 0 erledigte Schritte.

**Kleine Korrektur.** In `loadGame` die Liste aus der bereits serialisierten `actionHistory` rekonstruieren: im Adapter einen Getter ergänzen (neben 6229), z. B. `getCompletedActionIds(): string[] { return this.actionHistory.filter(h => h.result?.success && !h.actionId.startsWith('op_')).map(h => h.actionId); }` — das `op_`-Filter ist nötig, weil `playOperation` synthetische Einträge in dieselbe Historie schreibt (5354). Im Hook dann `setCompletedActions(engine.getCompletedActionIds())` neben die übrigen Refreshes (1707-1717).

**Strukturelle Alternative.** `completedActions` ist eine Zweitschrift dessen, was Engine (`actionHistory`) und ActionLoader (`usedActionIds`) ohnehin führen — drei Quellen für eine Wahrheit. Sauber: den React-State streichen und via `useMemo` aus der Engine ableiten; dann kann er per Konstruktion nicht mehr aus dem Tritt geraten (auch nicht beim Reset, s. E03b).

**Abnahme.** Hook-Test mit unmount/remount: Aktion X spielen, speichern, neu mounten, loadGame → `state.completedActions` enthält X. Zweiter Test: alle Einklink-Aktionen einer Episode spielen, dazwischen speichern/neu laden → die Episode schließt trotzdem ab (`episodeAbschluesse` wächst, Strang verlässt `activeEpisodes`).

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:415`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1068-1070`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1702-1734`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1259-1303`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:561`
- `desinformation-network/src/story-mode/engine/ActionLoader.ts:374-431`
- `desinformation-network/src/story-mode/data/episodes.json:16`

</details>

#### E03b · „Probleme bei Aktionszuständen nach Reset."

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2

**Ursache (am Code belegt).** BELEGT: `resetGame` (useStoryGameState.ts:1766-1801) erzeugt eine neue Engine (createStoryEngine setzt die Gameplay-Singletons zurück, StoryEngineAdapter.ts:7770-7779) und setzt 15 React-States zurück — aber 14 weitere nicht. Namentlich stehen nach dem Reset unverändert: `completedActions` (415), `carrierStates` (1316), `acquiredKompromat` (1317), `actionQueue` (439), `worldEvents` (419), `recommendations` (436), `betrayalStates` (472), `activeBetrayalWarnings`/`activeBetrayalEvent` (473/474), `activeCrisis` (477), `activeStageCountermeasure` (480), `recommendationTracking` (483), `comboHints` (491), `decisionBeatResult` (427). Laufzeit-Nachweis: nach `resetGame()` ist `state.completedActions` weiterhin ['1.1']. Folgeschaden über den Episoden-Effekt (1259-1303): der useEffect prüft nur `completedActions.includes(...)` gegen die Episoden der NEUEN Engine — passt eine Altspiel-ID, ruft er `engine.completeEpisode(ep.id)` und schreibt dem frischen Spiel die `wirkt_auf`-Gesellschaftswirkung gratis gut. Auch der localStorage-Stand wird beim Reset nicht gelöscht (`deleteSaveGame` (1740) wird nirgends in der UI aufgerufen — grep über src ergibt nur die Definition und den Rückgabewert).

**Worin Codex abwich.** Codex nannte keine Ursache. Wichtig für die Behebung: die ENGINE-Seite des Resets ist in Ordnung — `createStoryEngine` setzt alle acht Gameplay-Singletons zurück (7771-7778). Der Fehler ist ausschließlich die unvollständige Aufzählung der React-States in `resetGame`.

**Nutzerwirkung.** Ein Neustart ist nicht sauber: Das neue Spiel startet mit der Aktionshistorie des alten (Strang-Zähler zeigen erledigte Schritte, Erzählstränge können sich sofort selbst abschließen und Gesellschaftswirkung verschenken), die Operations-Akte zeigt Verbreiter des Vorgängerlaufs als 'aktiv', während die Engine sie nicht kennt (Klick → "Verbreiter noch nicht aufgebaut"), eine Warteschlange, ein offenes Krisen-/Verrats-Modal und alte Berater-Empfehlungen überleben den Reset.

**Kleine Korrektur.** Die 14 fehlenden Setter in `resetGame` (nach 1782) nachziehen: `setCompletedActions([])`, `setCarrierStates(newEngine.getCarrierStates())`, `setAcquiredKompromat([])`, `setActionQueue([])`, `setWorldEvents([])`, `setRecommendations([])`, `setBetrayalStates(new Map())`, `setActiveBetrayalWarnings([])`, `setActiveBetrayalEvent(null)`, `setActiveCrisis(null)`, `setActiveStageCountermeasure(null)`, `setRecommendationTracking(new Map())`, `setComboHints([])`, `setDecisionBeatResult(null)`.

**Strukturelle Alternative.** Denselben Fehler gibt es dreimal (Init, loadGame, resetGame pflegen je eine eigene, unterschiedlich vollständige Liste). Sauber: EIN `initialUiState`-Objekt und ein `useReducer` mit einer `RESET`- und einer `HYDRATE`-Aktion — dann ist "was wird zurückgesetzt" eine Datenstruktur statt 14 vergessbarer Aufrufe, und E03a/E03b/E02 fallen in einem Schnitt weg.

**Abnahme.** Hook-Test: Aktion spielen + Verbreiter aufbauen + Aktion anheften → `resetGame()` → `state.completedActions.length === 0`, `state.actionQueue.length === 0`, kein Verbreiter mit Status 'aktiv', `state.acquiredKompromat.length === 0`, `state.activeCrisis === null`.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1766-1801`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:415`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1316-1317`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1259-1303`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1740-1744`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:7770-7779`

</details>

#### E04a · Codex sah in der laufenden UI mehrere konkurrierende "Hauptziele" nebeneinander (Wahlziel, Vertrauensziele, Operationsbeschriftung).

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2

**Ursache (am Code belegt).** BELEGT: Es gibt genau EINEN Siegcheck — evaluateEnd() in VictorySystem.ts:64-86. Sieg = auftragProgressMin >= winThreshold (Zeile 65); Vertrauen ist dort KEIN eigener Siegweg, sondern nur eine von drei Signatur-Achsen des Auftrags 'wahl' (Auftraege.ts:62-67). Das alte Vertrauens-Ziel lebt trotzdem als DATENOBJEKT weiter: initializeObjectives() legt obj_destabilize ('Westunion destabilisieren', targetValue 40) unverändert an (StoryEngineAdapter.ts:1014-1027). NarrativeBoard und LagebildView blenden diese Zeile bereits aus (Filter category==='survival', NarrativeBoard.tsx:176-181, LagebildView.tsx:230) — MissionPanel und StatsPanel filtern dagegen nur nach type==='primary' (MissionPanel.tsx:33, StatsPanel.tsx:24) und rendern obj_destabilize unter der Überschrift HAUPTZIELE als 'Stand X · Ziel unter 40' (MissionPanel.tsx:203,247-250; StatsPanel.tsx:283,286). Der Wert unter 40 ist an KEINER Stelle mehr siegrelevant: trustTargetHeldPhases wird zwar noch hochgezählt (StoryEngineAdapter.ts:1354-1359), aber nirgends gelesen — REQUIRED_HOLD_PHASES kommt nur noch in Kommentaren vor (Zeilen 742, 1353, 6749). Identisch auf origin/main und HEAD.

**Worin Codex abwich.** Codex nannte ausdrücklich KEINE Ursache ("nur live an der Anzeige beobachtet"). Die belegte Ursache ist eng lokalisiert: nicht "das Spiel hat zwei Siegwege", sondern zwei von vier Zielanzeigen wenden den bereits existierenden Filter nicht an. Ein zweiter Siegweg existiert im Code NICHT.

**Nutzerwirkung.** Wer die Akte (Taste M) oder das Statistik-Panel öffnet, liest 'HAUPTZIEL: Westunion destabilisieren — Ziel unter 40' und arbeitet auf eine Marke hin, die den Sieg nicht auslöst. Der siegrelevante Vertrauenswert ist 70, nicht 40 — der Spieler jagt 30 Punkte, die er nicht braucht, während HUD, Tafel und Lagebild eine ganz andere Zahl zeigen.

**Kleine Korrektur.** In MissionPanel.tsx:33 und StatsPanel.tsx:24 denselben Filter anwenden, den NarrativeBoard/LagebildView schon nutzen: nur category==='survival' als Halte-Ziel zeigen; obj_destabilize verschwindet aus HAUPTZIELE und lebt nur noch als Signatur-Achse 'Vertrauen' im AUFTRAG-Block. Kein Datenmodell-Umbau nötig (obj_destabilize bleibt als Vertrauens-Speicher, den getAuftragProgressMin liest).

**Strukturelle Alternative.** obj_destabilize ganz aus objectives entfernen und Vertrauen zu einem normalen storyResources-Wert machen (Zielbild §12.2: 'Vertrauen wird internes Mittel'). Das berührt ~25 Lesestellen im Adapter (applyTrustDelta, getSocietySnapshot, Save-Format) und ist eine eigene Etappe, keine Review-Korrektur.

**Abnahme.** Akte (M) und Statistik-Panel im laufenden Spiel öffnen: unter HAUPTZIELE steht nur noch 'Nicht enttarnt werden — unter 85 halten'. Die Zeichenkette 'Ziel unter 40' erscheint in keinem Panel mehr.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:1014-1027`
- `desinformation-network/src/story-mode/components/MissionPanel.tsx:33`
- `desinformation-network/src/story-mode/components/MissionPanel.tsx:203-253`
- `desinformation-network/src/story-mode/components/StatsPanel.tsx:24`
- `desinformation-network/src/story-mode/components/StatsPanel.tsx:283-296`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:176-181`
- `desinformation-network/src/story-mode/components/LagebildView.tsx:230`
- `desinformation-network/src/story-mode/engine/VictorySystem.ts:64-86`

</details>

#### E04c · Abgeleitet aus Codex E04 ("konkurrierende Ziele"), am Code praezisiert: der AUFTRAG-Block der Akte zeigt eine ANDERE Latte als der Siegcheck.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* M · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2 / P2

**Ursache (am Code belegt).** BELEGT: Der Siegcheck fordert je Achse nur 60 % des Wegs — WIN_THRESHOLD = 0.6 (StoryEngineAdapter.ts:748), Min-Regel über alle Achsen (Auftraege.ts:142-163, VictorySystem.ts:65). MissionPanel rechnet 'reached' dagegen gegen den vollen Zielwert sig.ziel (MissionPanel.tsx:157) und beschriftet 'Ziel {s.ziel}' (Zeile 175). Konkret für den aktiven Default-Auftrag 'wahl' (Auftraege.ts:62-67): fraktionsstärke Sieg-Marke 43 vs. UI-Ziel 55 · vertrauen Sieg-Marke 70 vs. UI-Ziel 50 · zynismus Sieg-Marke 35 vs. UI-Ziel 45. Im Moment des Sieges stehen also alle drei Balken bei 60 % und tragen KEIN Haekchen. Zusätzlich fehlt die im Zielbild §3 ausdrücklich geforderte 'Tendenz' je Achse und die Kennzeichnung der klemmenden (Min-)Achse — MissionPanel zeigt Ist/Ziel, aber nicht, welche Achse gerade den Sieg blockiert.

**Worin Codex abwich.** Codex hat diese Divergenz nicht benannt; sie ist der eigentliche Kern von 'konkurrierende Ziele' und fällt live nur auf, wenn man Akte und HUD nebeneinander liest. Wichtig für die Reparaturrichtung: die UI ist hier NICHT falsch im Sinne des Zielbilds (§4 fordert 'alle Signatur-Achsen im Ziel', also Fortschritt 1.0) — der CODE ist mit 0.6 großzuegiger als der Beschluss. Die Akte darf also nicht auf 43/70/35 'heruntergeschrieben' werden.

**Nutzerwirkung.** Der Spieler kann aus der Akte nicht ablesen, wann er gewonnen hat. Der Sieg feuert, während die Akte drei unerfüllte Ziele zeigt — der Ausgang wirkt willkuerlich. Umgekehrt spielt, wer der Akte glaubt, über den Sieg hinaus.

**Kleine Korrektur.** Im AUFTRAG-Block je Balken eine zweite Marke 'Sieg ab' zeichnen, berechnet aus der Engine-Schwelle (state.engine.getWinThreshold(), StoryEngineAdapter.ts:4825-4827 — der Getter existiert bereits und wird vom EndReport genutzt): mark = richtung==='hoch' ? start + t*span : start - t*span. 'reached' gegen diese Marke setzen, den vollen Zielwert als blasseren Endpunkt stehen lassen. Zusätzlich die schwaechste Achse markieren (Min-Regel sichtbar machen) — das ist die vom Zielbild §3 geforderte Absicherung gegen die 'versteckte Falle'.

**Strukturelle Alternative.** Den vom Zielbild vorgesehenen Weg gehen und WIN_THRESHOLD auf 1.0 anheben; dann stimmen UI-Ziel und Siegmarke von selbst überein. Das ist laut docs/STATUS.md:287-289 und REVIEW_HOLISTISCH_2026-07-10.md:342 eine dedizierte Balance-Session (an die Aktions-Kuratierung 143->60-80 gekoppelt) und ausdrücklich KEINE Review-Korrektur — der bisherige Versuch (PR #94) war ein rechnerischer No-Op, weil die Zielmarken exakt mitskaliert wurden.

**Abnahme.** Bei Fortschritt 0.6 auf allen drei Achsen zeigt die Akte drei Balken mit erreichter 'Sieg ab'-Marke UND Haekchen, im selben Moment, in dem das Spiel den Siegbildschirm zeigt. Kein Spielstand existiert, in dem die Akte 'Ziel erreicht' sagt und der Siegcheck nicht feuert oder umgekehrt.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:748`
- `desinformation-network/src/story-mode/components/MissionPanel.tsx:154-186`
- `desinformation-network/src/story-mode/engine/Auftraege.ts:62-67`
- `desinformation-network/src/story-mode/engine/Auftraege.ts:142-163`
- `desinformation-network/src/story-mode/engine/VictorySystem.ts:64-77`
- `docs/ZIELBILD_2026-07-04_WETTRENNEN.md:41-45`

</details>

#### E04d · Abgeleitet aus Codex E04: eine dritte Fortschrittsmessung im täglichen Pflichtmoment.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2 / P3 (kosmetische Formulierungs-/Konsistenzfrage ohne mechanische Wirkung; höchstens P2 wegen der täglichen Wiederholung im Pflichtmoment)

**Ursache (am Code belegt).** BELEGT: StoryModeGame.tsx:549-552 bildet trustProgress = (100 - currentValue) / (100 - targetValue), also Nenner 60 (Vertrauen 100 -> 40). Die Quelle ist state.objectives.find(o => o.type === 'primary') — das nimmt schlicht den ERSTEN primaeren Eintrag; obj_survive ist ebenfalls type 'primary' (StoryEngineAdapter.ts:1027-1038), die Auswahl hängt also allein an der Array-Reihenfolge in initializeObjectives(). Dieser Wert speist (a) MorningBriefing.tsx:134-139, das woertlich 'Beim Vertrauensbruch kommen wir kaum voran — erst X % des Ziels' sagt, (b) die Laune des Direktors (MorningBriefing.tsx:74-81) und (c) den 'Deutungshoheit'-Balken im Tagesfazit (DayReport.tsx:128, 270-285). Der siegrelevante Nenner ist aber 50 (Vertrauen 100 -> 50, Auftraege.ts:64). Rechnerisch: bei Vertrauen 70 steht die Achse exakt auf der Sieg-Marke (60 %), das Briefing meldet 50 %. Die Warnschwelle 0.4 des Briefings greift bis Vertrauen 76 — dort beträgt der Achsenfortschritt bereits 48 %.

**Worin Codex abwich.** Codex nannte keine Ursache. Belegt ist, dass es sich nicht um einen weiteren Siegweg handelt, sondern um eine DRITTE Normierung desselben Vertrauenswerts (Nenner 60 statt 50) in genau den beiden Momenten, die der Spieler nicht überspringen kann (Morgenbriefing, Tagesfazit).

**Nutzerwirkung.** Der Direktor benennt jeden Morgen den Vertrauensbruch als 'das Ziel' und nennt einen Prozentwert, der weder mit der Sonntagsfrage noch mit dem AUFTRAG-Block der Akte übereinstimmt. Seine Laune (und damit der Ton der ganzen Szene) hängt an derselben abgeschafften Marke.

**Kleine Korrektur.** trustProgress in StoryModeGame.tsx:549-552 durch state.engine.getAuftragProgressMin() ersetzen (existiert bereits, StoryEngineAdapter.ts:4361-4365) und die Prop in MorningBriefing/DayReport entsprechend umbenennen; den Satz in MorningBriefing.tsx:136 auf das Rennen-Vokabular umstellen ('Die Sonntagsfrage bewegt sich kaum — erst X % zur Schwelle'). Der 'Deutungshoheit'-Balken im Tagesfazit darf als diegetisches Bild des MITTELS bleiben, aber ohne das Wort 'Ziel'.

**Strukturelle Alternative.** Ein gemeinsamer Selektor (analog utils/rennen.ts, das HUD/Tafel/Lagebild bereits auf EINE Skala zwingt) für jede Fortschrittszahl der UI — dann kann keine Ansicht mehr eine eigene Normierung erfinden.

**Abnahme.** Kein UI-Text nennt eine Prozentzahl 'des Ziels', die von der Sonntagsfrage-Skala (9 + Fortschritt*18) abweicht. Bei Vertrauen 70 sagt das Morgenbriefing denselben Fortschritt wie der Achsenbalken in der Akte.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/StoryModeGame.tsx:548-552`
- `desinformation-network/src/story-mode/components/MorningBriefing.tsx:74-81`
- `desinformation-network/src/story-mode/components/MorningBriefing.tsx:108`
- `desinformation-network/src/story-mode/components/MorningBriefing.tsx:134-139`
- `desinformation-network/src/story-mode/components/DayReport.tsx:128`
- `desinformation-network/src/story-mode/components/DayReport.tsx:270-285`
- `desinformation-network/src/story-mode/engine/Auftraege.ts:64`

</details>

#### E04e · Abgeleitet aus Codex E04: die Tafel verspricht das Ziel 'am Wahltag', das Spiel entscheidet frueher.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3 / P3 (Rundungslabel; die 'am Wahltag'-Haelfte ist eine Dublette zu H-14 und braucht keine eigene Einstufung)

**Ursache (am Code belegt).** BELEGT: NarrativeBoard.tsx:258-264 zeigt die Kopf-Notiz 'ZIEL: SONNTAGSFRAGE — X % · über 20 % am Wahltag'. evaluateEnd() kennt aber keine Wahltags-Bedingung für den Sieg: Priorität 1 gibt 'victory' zurück, sobald auftragProgressMin >= 0.6 ist (VictorySystem.ts:76-77); der Phasen-Check (phaseNumber >= maxPhases) steht erst DANACH und nur für das Timeout (Zeile 83). Der Sieg feuert also mitten in der Kampagne. Das ist im Repo bereits als offener Befund dokumentiert (docs/REVIEW_HOLISTISCH_2026-07-10.md:188-194, 'H-14 Sofort-Sieg mitten in der Kampagne', Sim-Median Tag 14-16 von 40, Owner-Entscheid ausstehend). Zweitens ist die genannte Zahl gerundet: thresholdPct = 9 + 0.6*18 = 19,8 (StoryEngineAdapter.ts:4955-4962), formatSchwellePct rundet auf '20 %' (rennen.ts:33-35) — der Sieg fällt also bei 19,8 %, während die Tafel 'über 20 %' verlangt.

**Worin Codex abwich.** Codex nannte keine Ursache. Wichtig: die UI-Formulierung 'am Wahltag' ist die ZIELBILD-konforme (§4: 'Am Wahltag hat die Sonntagsfrage die Schwelle erreicht'); abweichend ist der Code. Ein Agent darf hier deshalb nicht einfach den UI-Text ändern — das würde den H-14-Owner-Entscheid vorwegnehmen.

**Nutzerwirkung.** Die Tafel plant eine 40-Tage-Kampagne, das Spiel endet im Median an Tag 14-16; Tranchen, Sonntagsfragen-Ritual und Wahlabend-Dramaturgie finden in Siegen nicht statt. Zusätzlich kann der Balken grün sein und 19,8 % anzeigen, während derselbe Zettel 'über 20 %' fordert.

**Kleine Korrektur.** Nur die Rundung sofort geradeziehen: formatSchwellePct auf eine Nachkommastelle (wie formatPollPct) oder abrunden, damit angezeigte Schwelle und Siegbedingung nicht auseinanderfallen. Die Formulierung 'am Wahltag' NICHT anfassen, solange H-14 offen ist.

**Strukturelle Alternative.** H-14 entscheiden: entweder den Siegzweig in evaluateEnd an phaseNumber >= maxPhases binden (Sieg am Wahltag, wie Zielbild §4) oder First-past-the-post kanonisieren und Zielbild + UI-Texte nachfuehren. Beides ist ein Owner-Entscheid mit Balance-Folgen, keine Review-Korrektur.

**Abnahme.** Für die Rundung: kein Spielstand, in dem der Sonntagsfrage-Balken 'erreicht' anzeigt und der Zetteltext eine höhere Schwelle nennt. Für H-14: eine Entscheidung steht dokumentiert im Zielbild, und Code plus UI-Text sagen dasselbe.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:258-264`
- `desinformation-network/src/story-mode/engine/VictorySystem.ts:76-83`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:4950-4963`
- `desinformation-network/src/story-mode/utils/rennen.ts:28-35`
- `docs/REVIEW_HOLISTISCH_2026-07-10.md:188-194`

</details>

#### E05a · Codex: „'Phase' hat bei Befragung und Creatoraufbau unterschiedliche sichtbare Zeitfolgen."

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2 / P3 (reines Wording ohne Verhaltenswirkung; die eine irrefuehrende Zahl gehört zu E05b)

**Ursache (am Code belegt).** BELEGT: Der Begriff "Phase" trägt im aktiven Spiel FUENF verschiedene Bedeutungen, davon ZWEI gleichzeitig spielersichtbar mit widerspruechlicher Zeitsemantik. (1) `action.phase` = DISARM-Taktikkategorie ta01..ta07/targeting, KEINE Zeit (desinformation-network/src/story-mode/data/actions.json:53-107 Woerterbuch `phases`; ActionLoader.ts:20,217; ActionCard.tsx:81; StoryEngineAdapter.ts:575 `boostedPhases // Action phases (ta01-ta07)`). (2) `StoryPhase.number` = KAMPAGNENTAG, 1 Phase = 1 Tag, Kampagne 40 Tage (StoryEngineAdapter.ts:226 `// Tag der Kampagne (1..electionDay); Etappe 2: 1 Tag = 1 Phase`, :876 CAMPAIGN_DAYS_DEFAULT = 40; das Label lautet spielersichtbar "Tag N — Wahl in M Tagen", :930-936). (3) `gamePhase` = UI-Zustandsautomat intro/tutorial/playing/paused/consequence/ended (StoryModeGame.tsx:395,414,588). (4) `actions_phase3..actions_phase8` = Inhalts-Gruppierung/Freischaltstufen (actions_continued.json, Top-Level-Keys). (5) `buildCost.phases` = angebliche AUFBAU-VORLAUFZEIT eines Verbreiters (carriers.json:11,17,23,29,35,41,47,53; BattlefieldChain.ts:42). Die Kollision ist unmittelbar sichtbar: der Analyse-Raum schreibt "(kostet 8 Budget + eine Phase)" (MaschenVortestView.tsx:217) — dort meint Phase EIN TAG, der sofort verbraucht wird; die Operations-Akte schreibt beim Verbreiter "Aufbau 12k · 1 Phase(n)" (OperationsAkteView.tsx:575) — dort meint Phase eine WARTEZEIT, die nie eintritt (siehe E05b). Zusätzlich steht in dayClockStore.ts:6 noch die dritte Lesart "Eine Phase (= Monat) wird als ein Arbeitstag inszeniert", und StoryEngineAdapter.ts:223 trägt den veralteten Kommentar "Eine Phase entspricht ca. 1 Monat im Spiel", der von Zeile 226 desselben Interfaces widerlegt wird. NICHT belegt und daher nicht behauptet: dass "Creatoraufbau" eine eigene Aktion wäre — es gibt keine Aktion dieses Namens; gemeint ist der Verbreiter `creator` ("Content-Creator / Influencer", carriers.json:8) im Aufbau-Knopf der Operations-Akte.

**Worin Codex abwich.** Codex schlug als Ursache vor: "beabsichtigte Sonderregeln und tatsächliche Kostenberechnung sind abzugleichen" — also ein Kosten-Rechenproblem. Am Code ist die Ursache eine andere: eine VOKABEL-Kollision (ein Wort, fünf Bedeutungen) plus EIN nie implementiertes Datenfeld (buildCost.phases). Die Kostenberechnung der Befragung selbst ist korrekt (8 Budget werden abgebucht, ein Tag vergeht). Codex hat die Beobachtung getroffen, die Ursache verfehlt.

**Nutzerwirkung.** Der Spieler kann die Waehrung "Phase" nicht lernen: an einer Stelle bedeutet sie "dieser Tag ist jetzt vorbei", an der nächsten "du musst N Tage warten" (was nicht stimmt), an einer dritten steht sie als Kategorie über Aktionslisten. Die zentrale Ressource des Spiels — Zeit bis zum Wahltag — bleibt unlesbar, obwohl die Kampagne nur 40 Tage hat.

**Kleine Korrektur.** Das Wort "Phase" aus ALLEN spielersichtbaren Strings streichen und durch "Tag"/"Tage" ersetzen, passend zum bereits verwendeten Label "Tag N — Wahl in M Tagen". Betrifft: MaschenVortestView.tsx:217 ("kostet 8 Budget + einen ganzen Tag"), OperationsAkteView.tsx:575, CrisisModal.tsx:297, ActionFeedbackDialog.tsx:892, EventsPanel.tsx:172, NewsPanel.tsx:126, AdvisorDetailModal.tsx:269,272, GrievanceModal.tsx:192, TerminalView.tsx:449 ("PHASE BEENDEN" -> "TAG BEENDEN"). Intern darf `phase` als DISARM-Kategorie bleiben; die veralteten Kommentare StoryEngineAdapter.ts:223 und dayClockStore.ts:6 richtigstellen.

**Abnahme.** Ein Volltext-Grep über gerenderte deutsche Strings in src/story-mode/components/ liefert kein "Phase"/"Phasen" mehr; im Spiel steht überall dieselbe Einheit "Tag". Die interne DISARM-Kategorie `action.phase` bleibt unverändert (Tests grün).

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/data/actions.json:53`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:223`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:226`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:876`
- `desinformation-network/src/story-mode/components/MaschenVortestView.tsx:217`
- `desinformation-network/src/story-mode/components/OperationsAkteView.tsx:575`
- `desinformation-network/src/story-mode/data/carriers.json:11`
- `desinformation-network/src/story-mode/stores/dayClockStore.ts:6`
- `desinformation-network/src/story-mode/battlefield/BattlefieldChain.ts:42`

</details>

#### E05b · Teil von Codex' "Creatoraufbau": der Verbreiter-Aufbau weist eine Vorlaufzeit in Phasen aus.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2 / P3

**Ursache (am Code belegt).** BELEGT — echter Bug: `buildCost.phases` steht in den Daten (carriers.json, z.B. creator: `{budget:12, capacity:2, phases:1}`, thinktank: `phases:3`), ist im Typ deklariert (BattlefieldChain.ts:42) und wird dem Spieler ANGEZEIGT (OperationsAkteView.tsx:575: subtitle=`Aufbau ${c.buildCost.budget}k · ${c.buildCost.phases} Phase(n)`). Die Engine liest das Feld NIE. `StoryEngineAdapter.buildCarrier` (StoryEngineAdapter.ts:5194-5207) destrukturiert ausdrücklich nur `const { budget, capacity } = carrier.buildCost;`, zieht beide ab und setzt in derselben Anweisung `this.carrierStates.set(carrierId, 'aktiv')`. Der Verbreiter ist im selben Moment einsatzbereit. Gegenprobe: ein repo-weiter Grep auf `buildCost` und `phases` findet ausser Daten, Typ, Anzeige und Tests keinen Leser. Zweiter Beleg derselben Lücke: der Zustand `'aufbau'` existiert in der Union `CarrierState = 'verfuegbar' | 'aufbau' | 'aktiv' | 'verbrannt'` (BattlefieldChain.ts:46) und wird in OperationsAkteView.tsx:45 als möglicher Zustand dokumentiert, aber NIRGENDWO im Repo zugewiesen — der Zwischenzustand "im Aufbau" wurde geplant und nie gebaut. Zusätzlich sind die zwei Kostenangaben derselben Handlung inkonsistent: die Zeile darüber nennt Budget+Phasen (ohne Kapazität), der Knopf darunter Budget+Kapazität (ohne Phasen, OperationsAkteView.tsx:591).

**Worin Codex abwich.** Codex vermutete einen Abgleich zwischen Sonderregeln und Kostenberechnung. Tatsächlich fehlt keine Regel-Abstimmung, sondern der Konsument eines Datenfeldes: `phases` wird angezeigt und nie gelesen. Das ist keine Balance-, sondern eine Implementierungsluecke.

**Nutzerwirkung.** Die Anzeige luegt. Der Spieler plant um eine Vorlaufzeit herum, die es nicht gibt (Pseudo-Thinktank: "3 Phase(n)" -> sofort aktiv). Damit verschwindet zugleich die einzige beabsichtigte Tradeoff-Achse der Verbreiter-Oekonomie: teuer-und-langsam gegen billig-und-schnell kollabiert zu reinem Budgetvergleich, weil alle acht Verbreiter gleich schnell (= sofort) sind.

**Kleine Korrektur.** Ehrlich beschriften statt Mechanik erfinden: in OperationsAkteView.tsx:575 die `Phase(n)`-Angabe durch die tatsächlichen Kosten ersetzen (`Aufbau ${budget}k · ${capacity} Kap. · sofort einsatzbereit`) und den Knopf auf denselben Text bringen. Das kostet keine Balance-Änderung und beseitigt die Falschaussage.

**Strukturelle Alternative.** Wenn die Vorlaufzeit gewollt ist (die Daten und der ungenutzte Zustand `'aufbau'` legen das nahe): `buildCarrier` setzt `carrierStates` auf `'aufbau'` und merkt sich `readyAtPhase = storyPhase.number + buildCost.phases`; `advancePhase` (StoryEngineAdapter.ts:1051 ff.) schaltet faellige Verbreiter auf `'aktiv'`; das Oekonomie-Gate in `playOperation` (StoryEngineAdapter.ts:5285 ff., Meldung "Verbreiter erst aufbauen.") und `carrierActive` (OperationsAkteView.tsx:308) behandeln `'aufbau'` bereits korrekt als nicht-aktiv. Aufwand M, dafür wird die Achse "schnell vs. glaubwuerdig" erstmals spielbar.

**Abnahme.** In der Operations-Akte steht bei jedem Verbreiter genau eine Kostenangabe, sie nennt Budget und Kapazität, und sie behauptet keine Wartezeit. Ein Klick auf "Verbreiter aufbauen" führt sichtbar sofort zu "· aktiv ✓", was zur Beschriftung passt.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5194`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5199`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5205`
- `desinformation-network/src/story-mode/components/OperationsAkteView.tsx:575`
- `desinformation-network/src/story-mode/components/OperationsAkteView.tsx:591`
- `desinformation-network/src/story-mode/data/carriers.json:11`
- `desinformation-network/src/story-mode/battlefield/BattlefieldChain.ts:46`

</details>

#### E05d · Codex: unterschiedliche sichtbare Zeitfolge bei der Befragung — dort vergeht Zeit, anderswo nicht.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2 / P2

**Ursache (am Code belegt).** BELEGT — echter Bug, den Codex nicht benannt hat. Die Befragung ist die EINZIGE Spielerhandlung, die einen ganzen Kampagnentag verbraucht: `onCommission={() => { if (commissionFokusgruppe(FOKUSGRUPPE_COST)) endPhase(); }}` (StoryModeGame.tsx:1330). `commissionFokusgruppe` zieht nur Budget ab (useStoryGameState.ts:597-604), `endPhase` (useStoryGameState.ts:882) ruft `engine.advancePhase()` (StoryEngineAdapter.ts:1051). Dabei werden DREI Dinge übergangen, die der normale Tagesabschluss tut. (1) `useDayClockStore.getState().resetDay()` fehlt: der einzige Aufrufer im ganzen Repo ist StoryModeGame.tsx:1491 im DayReport-Pfad. Die Arbeitstag-Uhr (dayClockStore.ts:62-72, 09:00-18:00, sichtbar oben rechts via DayClock, StoryModeGame.tsx:1110) bleibt daher stehen, wo sie war. Wer um 15:00 eine Befragung beauftragt, steht danach an TAG N+1 — mit 5 frischen AP (advancePhase setzt `actionPointsRemaining = ACTION_POINTS_PER_PHASE = 5`, StoryEngineAdapter.ts:1100/878) — aber die Uhr zeigt weiter 15:00. Nach zwei weiteren Aktionen (je 90 min, dayClockStore.ts:19) ist `dayEnded` erreicht und der Tag endet erneut: die Befragung kostet effektiv EINEN Tag plus den Rest des nächsten. (2) Der normale Weg läuft über `requestEndDay` -> Heimweg -> DayReport (StoryModeGame.tsx:491-497, 1449 ff.); der Befragungspfad überspringt ihn, also entfällt für diesen Tag das Tagesfazit samt `getNightPreview()` und `getTranchePreview()` (StoryModeGame.tsx:1487-1489). (3) Die zum Zeitpunkt des Klicks noch offenen Aktionspunkte verfallen ersatzlos, weil advancePhase hart auf 5 setzt — die Beschriftung "(kostet 8 Budget + eine Phase)" (MaschenVortestView.tsx:217) erwähnt das nicht. Ergaenzend belegt: unmittelbar nach dem Tageswechsel erfüllt das Morgenbriefing seine Bedingung `briefedPhase !== state.storyPhase.number` (StoryModeGame.tsx:1504) und montiert sich mit z-50 (MorningBriefing.tsx:187) unter das noch offene Vortest-Overlay (zIndex 1100, MaschenVortestView.tsx:124) — der Tageswechsel bleibt während der offenen Analyse also vollständig unsichtbar.

**Worin Codex abwich.** Codex sah die abweichende Zeitfolge, führte sie aber auf die Kostenberechnung zurück. Die Budgetberechnung ist korrekt; falsch ist, dass der Befragungs-Pfad `endPhase()` direkt aufruft und dabei den Tagesabschluss-Ritus (Uhr zurücksetzen, Heimweg, Tagesfazit) umgeht.

**Nutzerwirkung.** Nach der Befragung widersprechen sich Tageszaehler (+1) und Arbeitstag-Uhr (unverändert) sichtbar auf demselben Bildschirm. Der neue Tag ist verkuerzt: 5 AP stehen nur noch wenigen Uhr-Stunden gegenüber, also kann der Spieler seine Aktionspunkte nicht ausspielen. Bei 40 Kampagnentagen ist der stille Verlust von bis zu 5 AP plus eines halben Tages pro Befragung erheblich — und er ist nirgends angesagt.

**Kleine Korrektur.** In StoryModeGame.tsx:1330 den Tagesabschluss vollständig machen: `onCommission={() => { if (commissionFokusgruppe(FOKUSGRUPPE_COST)) { endPhase(); useDayClockStore.getState().resetDay(); } }}` — identisch zu Zeile 1490-1491. Zusätzlich die Beschriftung in MaschenVortestView.tsx:217 ehrlich machen: "kostet 8 Budget und beendet den Arbeitstag — offene Aktionspunkte verfallen".

**Strukturelle Alternative.** Sauberer wäre, die Befragung nicht `endPhase()` aufrufen zu lassen, sondern sie wie jede andere Handlung über die Tagesuhr abzurechnen (`useDayClockStore.getState().advance(...)` mit einem eigenen TIME_COST.befragung von z.B. 240 min). Dann gibt es nur EINEN Weg, an dem ein Tag endet (dayEnded -> requestEndDay -> DayReport -> endPhase+resetDay), die Sonderregel verschwindet, und die Befragung kostet sichtbar Stunden statt eines unerklärten "Phase"-Sprungs. Aufwand M.

**Abnahme.** Befragung um 15:00 beauftragen: danach zeigt die Uhr oben rechts 09:00 und der Tageszaehler N+1; die 5 Aktionspunkte des neuen Tages lassen sich vollständig ausspielen. Die Beschriftung des Beauftragungs-Knopfes nennt den AP-Verfall vor dem Klick.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/StoryModeGame.tsx:1330`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1491`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:491`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:597`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:882`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:1100`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:878`
- `desinformation-network/src/story-mode/stores/dayClockStore.ts:71`
- `desinformation-network/src/story-mode/components/MaschenVortestView.tsx:217`

</details>

#### E06b · Codex sah "kleine dichte Texte" am NarrativeBoard.

*Status:* teilweise · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2 / P3 (kosmetische Politur; P2 vertretbar, wenn man nur die eine Wendungs-Zeile zählt) — P1 ist nicht gerechtfertigt

**Ursache (am Code belegt).** Global belegt und deutlich verbessert, AM BOARD praktisch unverändert. Gemessen über alle story-mode-.tsx (ohne Tests), Literale fontSize:N und text-[Npx]: origin/main hat 25 verschiedene Größen, darunter 25x 9px, 4x 8px und 12 krumme rem-Werte (0.68/0.72/0.75/0.8/0.85/0.9/0.95/1/1.25/1.875rem). HEAD hat 11 Größen, alle auf der Leiter StoryModeType (theme.ts:76-98), Sub-10px vollständig getilgt — 10px wächst von 71 auf 101 Vorkommen. typeGuard.test.ts hält das geschlossen und läuft grün (4/4 Tests, vitest). ABER: NarrativeBoard.tsx importiert StoryModeType gar nicht (Import-Zeile 18: StoryModeColors, StoryModeSurfaces, scrim) und ändert sich zwischen main und HEAD nur an EINER Stelle von text-[9px] auf text-[10px] (PinnedCard-Kosten, Zeile 656-659). Verteilung am Board: main 19x 11px + 9x 10px + 1x 9px, HEAD 19x 11px + 10x 10px — dazu 3x text-sm und 2x text-xs. 29 von 34 Größen-Literalen liegen also auf beiden Ständen bei 10-11px. Die Wache ist eine Anti-Wildwuchs-Wache, keine Vergrößerungs-Wache: micro:10 und mini:11 SIND Sprossen, text-[10px] passiert sie. Belegter Zusatzbefund: Die Leiter dokumentiert micro:10 ausdrücklich als "Badges, Einheiten, Mini-Labels" (theme.ts:77-78), das Board benutzt 10px aber für Fliesstext — die Wendungs-/Dilemmafrage eines Strangs (NarrativeBoard.tsx:572, italic, ganzer Satz) und die Fenster-Hinweise (Zeile 334/336). Das ist ein Verstoss gegen die Semantik der eigenen Leiter, kein Ermessensspielraum. Die Schrift ist VT323 mit size-adjust:132% (index.css:10-21, schon auf main — kein HEAD-Gewinn); laut Projekt-Messung ergibt das bei 10px 7,4px Versalhoehe.

**Nutzerwirkung.** Die Narrativ-Tafel ist die Planungsfläche des Spiels. Genau die zwei Texte, die dort das Warum erklären — die Wendungsfrage des Strangs und der nächste Schritt eines Gelegenheitsfensters — stehen in der kleinsten zulaessigen Größe, kursiv, auf gemusterter Korkfläche. Wer sie überliest, spielt die Strangkarten ohne den Konflikt zu kennen, den sie aufloesen sollen.

**Kleine Korrektur.** Die drei Fliesstext-Stellen am Board von micro (10) auf compact (13) heben: NarrativeBoard.tsx:572 (strand.wendung), :334 (w.hint), :336 (w.nextAction). Badges, Stummel und Kostenzeilen duerfen auf 10px bleiben. Der typeGuard lässt 13 als Sprosse durch, es ist keine Testaenderung nötig.

**Abnahme.** Wendungsfrage und Fenster-Hinweis rendern mit 13px; typeGuard.test.ts bleibt grün; der Rest der Tafel behält seine Größen (Regressionsdiff nur in diesen drei Zeilen).

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:572`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:334`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:18`
- `desinformation-network/src/story-mode/theme.ts:76`
- `desinformation-network/src/story-mode/__tests__/typeGuard.test.ts:70`
- `desinformation-network/src/index.css:10`

</details>

#### E07d · Der Operationsabschluss fällt weniger auf als andere Ereignisse.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2

**Ursache (am Code belegt).** Belegt, aber mit anderer Ursache als von Codex nahegelegt: Der Operationspfad hat UEBERHAUPT KEINEN Ergebnisdialog. In StoryModeGame.tsx:1353-1366 ruft onAusspielen nur playOperation(params) und danach setBroadcastExpanded(true) — setShowActionFeedback(true) steht ausschließlich in den beiden Aktionspfaden (Terminal StoryModeGame.tsx:1247-1249, Warteschlange StoryModeGame.tsx:1416-1421). playOperation setzt zwar lastActionResult (useStoryGameState.ts:1319-1337), doch der Dialog hängt an isVisible={showActionFeedback} (StoryModeGame.tsx:1548) und bleibt daher zu. Auch in den Nachrichten ist die Operation nicht eigens markiert: das erzeugte Ereignis trägt type 'action_result' (StoryEngineAdapter.ts:5340-5352), also denselben Typ wie eine gewoehnliche Aktion. Verschaerfend im Arc-Fall: ist operationQueue.length > 0 (StoryModeGame.tsx:1355-1361), bleibt die Operations-Akte offen — ein 'fixed'-Overlay mit zIndex 1000 und deckendem Hintergrund (OperationsAkteView.tsx:366-393) —, während darunter setBroadcastExpanded(true) das Wohnzimmer aufklappt; das 4,5-s-Peek läuft dann vollständig unsichtbar ab. Sichtbar bleibt vom Operationsabschluss also nur der Sendestreifen und eine Nachrichtenzeile vom Typ einer normalen Aktion.

**Worin Codex abwich.** Codex koppelt den Befund an den Ergebnisdialog ('Ergebnisdialog verdeckt Reaktionen; Operationsabschluss fällt weniger auf'). Tatsächlich ist es umgekehrt: Die Operation bekommt gar keinen Ergebnisdialog, während jede einfache Terminal-Aktion einen bekommt — der Abschluss der AUFWENDIGSTEN Handlung des Spiels ist damit schwaecher markiert als der der billigsten. Zusätzlich ist das Nachrichten-Ereignis typgleich mit einer normalen Aktion.

**Nutzerwirkung.** Wer eine Operation zusammenbaut (Verbreiter aufbauen, Kompromat beschaffen, Kampagne bestuecken) und AUSSPIELEN drueckt, bekommt keinerlei Quittung: die Akte schließt sich, es erscheint kein Ergebnisfenster, und im Arc-Fall bleibt sogar die Publikumsreaktion unter der weiter offenen Akte verborgen. Wirkung, Reichweite und Enttarnungsrisiko stehen nur in einer Nachrichtenzeile, die aussieht wie jede andere.

**Kleine Korrektur.** Nach playOperation denselben Ergebnisdialog öffnen — outcome.broadcastResult ist bereits ein vollständiges ActionResult mit narrative/headline (StoryEngineAdapter.ts:5325-5338): in StoryModeGame.tsx:1353-1366 bei Erfolg setShowActionFeedback(true) setzen; im Arc-Zweig zusätzlich das Peek erst starten, wenn die Akte geschlossen ist.

**Strukturelle Alternative.** Eigener Ereignistyp 'operation_result' mit eigener Markierung in Nachrichten/Lagebild und ein eigener Abschluss-Beat für Operationen (Bilanz: Reichweite, Wirkung, Verbreiter-Zustand, Enttarnungsrisiko), damit Aufwand und Quittung im Verhältnis stehen.

**Abnahme.** Nach AUSSPIELEN erscheint ein Ergebnisfenster mit Reichweite/Wirkung/Enttarnungsrisiko; im Arc-Fall wird die Publikumsreaktion erst gezeigt, wenn die Akte geschlossen ist; das Nachrichten-Ereignis der Operation ist von einem Aktionsergebnis unterscheidbar.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/StoryModeGame.tsx:1353-1366`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1247-1249`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1416-1421`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1546-1560`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1319-1337`
- `desinformation-network/src/story-mode/components/OperationsAkteView.tsx:359-393`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5340-5352`

</details>

#### E09a · Codex: "Empfehlungsschaltflächen ohne vollständige Texte" im Berater-Detail-Modal.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2

**Ursache (am Code belegt).** BELEGT. Der Button-Text wird zur Renderzeit aus der Aktions-ID abgeleitet: `actionId.split('_').slice(1).join(' ').toUpperCase()` (AdvisorDetailModal.tsx:255 auf HEAD, :263 auf origin/main — Ausdruck identisch, HEAD ändert daran nichts). Die tatsächlichen Aktions-IDs sind punktierte Zahlen ('1.1', '2.14', '3.10', '7.x') OHNE Unterstrich. Ich habe alle 82 Aktionen aus data/actions.json (30), actions_continued.json (19), actions_p1c.json (15), actions_p3_phenomena.json (18) durchsimuliert: 0 von 82 IDs enthalten einen Unterstrich, also liefert split('_') genau ein Element, slice(1) ein leeres Array, join(' ') den Leerstring. Ergebnis: 82/82 Buttons tragen NUR das Stern-Icon und sonst nichts. Die Ableitung ist ein Rest eines abgelegten ID-Schemas `ta##_snake_case`, das nur noch in Dialogdaten (topics_dialogues.json: 'ta04_social_bots', 'ta05_establish_front', …) und in ins Leere laufenden Strategie-Filtern lebt (IgorAnalysisStrategy.ts:210,220; KatjaAnalysisStrategy.ts:89; AlexeiAnalysisStrategy.ts:276; MarinaAnalysisStrategy.ts:179 — dort wird `a.id.includes('ta05_establish')` gegen IDs wie '2.14' geprüft, matcht also nie). Die EINZIGE ID im ganzen Empfehlungspfad, die Unterstriche hat, ist die Pseudo-ID 'interact_with_npc' (DirektorAnalysisStrategy.ts:246 und :271) -> 'WITH NPC'. Das ist exakt der von Codex gesehene unvollständige Text. Diese ID zeigt zusätzlich auf keine existierende Aktion, der Klick setzt highlightActionId und öffnet das Terminal (StoryModeGame.tsx:1741-1745), wo TerminalView.tsx:392 nie einen Treffer findet — toter Klick. Dass die Buttons überhaupt erscheinen, ist belegt: IgorAnalysisStrategy.getCheapActions (Zeile 324-328) filtert `costs.budget < 30`, und die realen Aktionskosten liegen bei 3-30k, also liefert der Filter praktisch immer 3 IDs.

**Nutzerwirkung.** Der Block "EMPFOHLENE AKTIONEN" im Berater-Detail ist unbenutzbar: der Spieler sieht eine Reihe identischer, beschrifteter Sternchen-Knoepfe und kann nicht erkennen, welche Maßnahme ein Berater empfiehlt. Er muss blind klicken und im Terminal nachsehen. Bei Direktor-Empfehlungen wegen niedriger Moral (Moral<40, realistisch erreichbar — Startmoral Alexei 60, Igor 65) erscheint zusätzlich ein Knopf 'WITH NPC', der ins Terminal springt und dort nichts hervorhebt.

**Kleine Korrektur.** Anzeigenamen aufloesen statt ableiten: in AdvisorDetailModal.tsx:255 `actionId.split(...)` ersetzen durch eine Nachschlage-Funktion, z.B. `getActionLoader().getAction(actionId)?.label_de ?? actionId` (Loader-API existiert: ActionLoader.ts:168), oder eine neue Prop `getActionLabel(actionId)` von StoryModeGame.tsx (dort liegt state.availableActions bereits vor, vgl. Zeile 1211) an das Modal durchreichen. Die Pseudo-ID 'interact_with_npc' explizit auf 'MIT BERATER SPRECHEN' abbilden (oder aus suggestedActions entfernen).

**Strukturelle Alternative.** suggestedActions nicht als nackte ID-Liste fuehren, sondern als {id, label}-Paare, die die Strategie beim Erzeugen aus der Aktion selbst befuellt (sie hat `a.label_de` in `gameState.availableActions` bereits in der Hand — dort steht heute nur `.map(a => a.id)`). Dann kann keine UI-Schicht mehr Namen erraten. Nicht-Aktions-Empfehlungen wie 'Sprich mit NPC' gehoeren in ein eigenes Feld (z.B. suggestedNpcTalk), nicht in einen Aktions-ID-Kanal.

**Abnahme.** Neues Spiel, Berater-Leiste -> Igor öffnen: die drei Empfehlungs-Buttons tragen lesbare Klartextnamen aus label_de (z.B. 'ZIELGRUPPE ANALYSIEREN'), keiner ist leer. Danach eine Situation mit NPC-Moral<40 herstellen und das Direktor-Detail öffnen: der Button heißt 'MIT BERATER SPRECHEN' (nicht 'WITH NPC') und führt zu einem sichtbaren Ziel statt in ein Terminal ohne Treffer.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/components/AdvisorDetailModal.tsx:255`
- `desinformation-network/src/story-mode/engine/strategies/DirektorAnalysisStrategy.ts:246`
- `desinformation-network/src/story-mode/engine/strategies/DirektorAnalysisStrategy.ts:271`
- `desinformation-network/src/story-mode/engine/strategies/IgorAnalysisStrategy.ts:324`
- `desinformation-network/src/story-mode/data/actions.json:2`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:330`
- `desinformation-network/src/story-mode/components/ActionCard.tsx:196`
- `desinformation-network/src/story-mode/engine/ActionLoader.ts:168`

</details>

#### E09b · Codex: "Berater nennt veralteten Budgetstand."

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* M · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P2 für die beschriebene Staleness; der P1-Defekt an derselben Fundstelle ist stattdessen das hartkodierte maxBudget: 1000 (useStoryGameState.ts:525), das den Berater dauerhaft falsch "Budget kritisch" melden lässt

**Ursache (am Code belegt).** BELEGT, aber NICHT dort, wo die Snapshot-Hypothese es vermutet. Das Modal bekommt KEIN eingefrorenes Prop: StoryModeGame.tsx:1738 übergibt `recommendations={state.recommendations}` — eine Live-Bindung an den Store; das Modal rendert bei jeder Store-Änderung neu. Der Budgetwert wird zur Renderzeit aber gar nicht gelesen. Er ist als fertig formatierter Text in `rec.message` / `rec.reasoning` einbetoniert, erzeugt von IgorAnalysisStrategy.analyzeBudgetLevel (Zeilen 83-91 kritisch, 110-116 Warnung: `Verfuegbare Mittel: ${currentBudget.toFixed(0)}k (${budgetPercentage.toFixed(0)}% von Maximum)`). Das Modal (AdvisorDetailModal.tsx:211 und :225) gibt diesen String nur noch aus. Erzeugt werden die Strings ausschließlich in generateRecommendations (useStoryGameState.ts:507-582), und diese Funktion wird nur an vier Stellen gerufen: drei Spielstart-Pfade (:628 startGame, :651 skipTutorial, :664 continueDialog) und genau EINMAL im laufenden Spiel, in endPhase (:923). executeAction (:1040-1249) ruft sie NICHT — es aktualisiert Ressourcen, News, NPCs, Objectives und availableActions, aber nicht die Empfehlungen. Ebenso wenig commissionFokusgruppe (:598ff, `engine.spendBudget`) oder die Gegenmassnahmen-Pfade. Budget ändert sich innerhalb einer Phase an vielen Stellen (StoryEngineAdapter.ts:4278/4291 Aktionskosten, :5067 Konter-Kosten, :5203/:5224 spendBudget, :4973). Ergebnis: die genannte Zahl ist der Stand vom letzten Phasenwechsel und bleibt bis zum nächsten stehen — genau das beobachtete "veraltet".

**Worin Codex abwich.** Codex nennt für diese Haelfte keine Ursache; die naheliegende Vermutung "beim Öffnen eingefrorenes Prop (Snapshot)" ist am Code WIDERLEGT — die Prop-Bindung ist live (StoryModeGame.tsx:1738) und das Modal rendert bei Store-Änderungen neu. Eingefroren ist nicht das Prop, sondern der bereits formatierte Textstring im Empfehlungsobjekt, und zwar seit dem letzten Phasenwechsel. Das Modal wieder zu öffnen ändert deshalb nichts — ein Snapshot-Fix am Modal wäre wirkungslos gewesen.

**Nutzerwirkung.** Der Finanz-Berater nennt eine Kassenlage, die nach der ersten Ausgabe der Phase nicht mehr stimmt und bis zum Tagesende falsch bleibt. Sein Rat ("kostenguenstige Aktionen", "kritische Schwelle unterschritten") beruht auf diesem alten Wert und widerspricht sichtbar der Ressourcenanzeige im HUD. In einem Lernspiel über Faktentreue ist ein Berater, der nachweislich veraltete Zahlen nennt, besonders schaedlich.

**Kleine Korrektur.** generateRecommendations() nach jedem budgetwirksamen Vorgang aufrufen — in executeAction nach `setResources(engine.getResources())` (useStoryGameState.ts:1060), in commissionFokusgruppe und im Konter-Pfad. Achtung beim Umbau: generateRecommendations in die Deps von executeAction aufnehmen und zugleich E09d beheben, sonst zieht man die Stale-Closure in einen häufiger laufenden Pfad.

**Strukturelle Alternative.** Zahlen nicht in Texte einbacken. AdvisorRecommendation trägt strukturierte Felder (z.B. {kind:'budget', budget, budgetPct}) oder Platzhalter im Message-Template; die Komponente formatiert beim Rendern aus dem Live-Store. Dann kann ein Empfehlungstext prinzipiell nicht mehr veralten, unabhängig davon, wann neu generiert wird — und die Schwellenlogik ("kritisch/Warnung") lässt sich getrennt als abgeleiteter Live-Wert prüfen.

**Abnahme.** Spiel bis zu einer Igor-Budgetwarnung fuehren, den im Berater-Detail genannten k-Betrag notieren, Modal schliessen, eine Aktion mit Budgetkosten ausfuehren, Modal wieder öffnen: der genannte Betrag stimmt mit der HUD-Kassenanzeige überein (heute steht dort weiterhin der Wert vom Phasenbeginn).

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/StoryModeGame.tsx:1738`
- `desinformation-network/src/story-mode/components/AdvisorDetailModal.tsx:211`
- `desinformation-network/src/story-mode/components/AdvisorDetailModal.tsx:225`
- `desinformation-network/src/story-mode/engine/strategies/IgorAnalysisStrategy.ts:83`
- `desinformation-network/src/story-mode/engine/strategies/IgorAnalysisStrategy.ts:110`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:507`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:923`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1040`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:4291`

</details>

#### E09c · Zusatzbefund beim Rückverfolgen des Budget-Datenflusses (von Codex NICHT berichtet): der Prozentsatz, mit dem der Berater argumentiert, hat keine Entsprechung im Spiel.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 0/2 widerlegt
· *Skeptiker zum Schweregrad:* P2

**Ursache (am Code belegt).** BELEGT. useStoryGameState.ts:525 setzt `maxBudget: 1000, // Fixed max budget for analysis` — eine erfundene Konstante. Das Spiel kennt keine Budget-Obergrenze: Startbudget ist 150k (StoryEngineAdapter.ts:943, bestätigt in Finanzen.ts:26 "Startbudget 150"), nachgespeist wird in Tranchen von 30/48/16/8/0/-12k alle 5 Tage (Finanzen.ts:28-33). `maxBudget` wird ausschließlich von IgorAnalysisStrategy.ts:73-74 für `budgetPercentage = currentBudget/maxBudget*100` benutzt (projektweit die einzigen Leseorte). Damit ist der Prozentwert bei Spielstart 150/1000 = 15 %, also unter der Kritisch-Schwelle von 30 % (Zeile 78). Igor ist ab Zug 1 verfuegbar und beratungsfaehig (npcs.json initialState: available true, morale 65 > der Sperre von 20 in NPCAdvisorEngine.ts:82), und analyzeBudgetLevel läuft ungefiltert als erste Analyse (IgorAnalysisStrategy.ts:38). Bei relationshipLevel 0 (Startwert) erscheint daher sofort "Budget kritisch: 15 %. Kostenguenstige Aktionen empfohlen." samt Begründung "Verfuegbare Mittel: 150k (15 % von Maximum). Kritische Schwelle unterschritten (<30 %)". Um die Warnstufe zu verlassen, muesste das Budget über 500k steigen — bei Tranchen von max. 48k je 5 Tage in einer 40-Tage-Kampagne praktisch unerreichbar.

**Worin Codex abwich.** Codex hat diesen Defekt nicht gesehen. Er verstärkt E09b: der Budgetstand ist nicht nur veraltet, sondern auch falsch gerahmt. Beide Defekte müssen zusammen behoben werden, sonst nennt der Berater nach dem E09b-Fix zwar aktuelle, aber weiterhin sinnlos in Prozent eines nicht existierenden Maximums umgerechnete Zahlen.

**Nutzerwirkung.** Der Finanz-Berater ruft ab dem ersten Zug bei voller Kasse "Budget kritisch" und empfiehlt Sparen — die Warnung ist damit dauerhaft an und trägt keine Information mehr. Der Spieler lernt, die Berater-Prioritäten zu ignorieren, was die gesamte Beratermechanik entwertet.

**Kleine Korrektur.** In useStoryGameState.ts:525 den erfundenen Wert 1000 durch einen im Spiel begruendeten Bezugswert ersetzen (z.B. das Startbudget 150 aus Finanzen.ts, exportiert als Konstante) — oder maxBudget aus dem Kontext streichen und die Schwellen in IgorAnalysisStrategy.ts:78/105 auf absolute k-Beträge umstellen, die zu Tranchengröße und Aktionskosten (3-30k) passen.

**Strukturelle Alternative.** Die Finanzschwellen des Beraters aus dem tatsächlichen Finanzmodell ableiten statt aus einer UI-nahen Konstante: Finanzen.ts kennt Tranchenhoehe und Mahnstufen, also "kritisch" = Budget reicht nicht mehr für die N guenstigsten verfuegbaren Aktionen bzw. Mahnstufe>=1. Damit hängt der Rat an der Mechanik und nicht an einer freihaendigen Zahl.

**Abnahme.** Neues Spiel starten, ohne eine Aktion auszufuehren das Berater-Detail von Igor öffnen: es erscheint KEINE Budget-Kritisch-Meldung bei vollem Startbudget. Anschliessend Budget bis in echte Knappheit spielen: die Meldung erscheint dann und ihre Zahlenangabe deckt sich mit der HUD-Kasse.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:525`
- `desinformation-network/src/story-mode/engine/strategies/IgorAnalysisStrategy.ts:73`
- `desinformation-network/src/story-mode/engine/strategies/IgorAnalysisStrategy.ts:78`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:943`
- `desinformation-network/src/story-mode/engine/Finanzen.ts:26`
- `desinformation-network/src/story-mode/data/npcs.json:1`

</details>

### P2 — lokale Qualität und Wartbarkeit

#### E03c · „Probleme bei der Anzeige abgelaufener Sperren."

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3

**Ursache (am Code belegt).** BELEGT: Die Sperr-Rechnung selbst ist korrekt und arbeitet in SPIELTAGEN, nicht in absoluter Zeit — `disabledActions: Map<actionId, reenablePhase>` (StoryActorAI.ts:236, gesetzt 432/534), `isActionDisabled` vergleicht `currentPhase < expiresPhase` (540-544), und der Zustand wird über `actorAIState` mitgespeichert (StoryEngineAdapter.ts:6963, StoryActorAI.ts:634/649). Die Referenzzeit bleibt über das Laden konsistent, weil `storyPhase` ebenfalls im Save steht (6915/7085). Der Fehler ist die AKTUALISIERUNG der Anzeige: Der Sperrtext entsteht in `convertToStoryAction` (3512-3514, 3537: `Kanal gesperrt — noch ${banDaysLeft} Tag(e)`) und landet über `refreshAvailableActions` (useStoryGameState.ts:586-589) in einem React-State. `refreshAvailableActions()` wird nur an drei Stellen gerufen: `startGame` (618), `executeAction` (1227), `loadGame` (1718) — NICHT in `endPhase` (882-1032). Der Tageswechsel frischt die Aktionsliste also nicht auf. Laufzeit-Nachweis: Sperre bis Tag 2, `endPhase()` → Engine sagt `available=true, unavailableReason=undefined`, der UI-State sagt weiterhin `available=false, 'Kanal gesperrt — noch 1 Tag'`.

**Worin Codex abwich.** Codex nannte keine Ursache. Zwei naheliegende Verdächtige sind nachweislich UNSCHULDIG: (1) die Sperre nutzt keine absoluten Zeitstempel, sondern Spieltage, und (2) sie wird korrekt serialisiert. Schuld ist allein der fehlende Aufruf von `refreshAvailableActions()` in `endPhase`.

**Nutzerwirkung.** Eine über Nacht abgelaufene Kanalsperre bleibt als GESPERRT-Stempel mit eingefrorenem Countdown stehen, bis der Spieler irgendeine andere Aktion ausführt; die Restlaufzeit zählt über Tage nie herunter. Dieselbe Lücke betrifft alle tagesabhängigen Änderungen der Aktionsliste (neu freigeschaltete Aktionen, NPC-Rabatte, veränderte Leistbarkeit) — sie erscheinen erst nach der nächsten Aktion.

**Kleine Korrektur.** In `endPhase` einen Aufruf `refreshAvailableActions();` neben die übrigen Refreshes setzen (nach useStoryGameState.ts:890) und `refreshAvailableActions` in die Dep-Liste (1032) aufnehmen. In `resetGame` ist `setAvailableActions([])` (1774) korrekt, weil `startGame` danach neu befüllt.

**Strukturelle Alternative.** `availableActions` ist abgeleiteter Zustand, der als React-State geführt und an drei Stellen von Hand nachgezogen wird — jede vergessene Stelle ist eine veraltete Anzeige. Sauber: als `useMemo` über einen Engine-Revisionszähler ableiten (Zähler in executeAction/endPhase/loadState erhöhen), dann kann die Liste per Konstruktion nicht mehr veralten.

**Abnahme.** Hook-Test: Aktion X bis Tag 2 sperren → `state.availableActions` zeigt „Kanal gesperrt“ → `endPhase()` (Tag 2) → OHNE weitere Aktion muss `state.availableActions.find(a => a.id === X).available === true` und `unavailableReason === undefined` sein.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:586-589`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:882-1032`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:618`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1227`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:3512-3537`
- `desinformation-network/src/story-mode/engine/StoryActorAI.ts:540-551`

</details>

#### E03d · Zusatzfund (nicht von Codex berichtet): ein kaputter oder unlesbarer Spielstand scheitert lautlos.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3

**Ursache (am Code belegt).** BELEGT: `hasSaveGame` prüft nur die EXISTENZ des Schlüssels (`localStorage.getItem('storyMode_save') !== null`, useStoryGameState.ts:1736-1738) — der Titelbildschirm zeigt „Fortsetzen“ also auch bei unbrauchbarem Inhalt (StoryModeGame.tsx:850 `hasSave={hasSaveGame()}`). `loadGame` fängt jede Ausnahme, loggt und gibt `false` zurück (1729-1733). Der Aufrufer wirft den Rückgabewert weg: `const handleLoad = () => { loadGame(); };` (StoryModeGame.tsx:813-815). Zur Versionierung: `SAVE_FORMAT_VERSION = '2.3.0'` (StoryEngineAdapter.ts:704); `loadState` liest `state.version ?? '1.0.0'`, LOGGT nur bei Abweichung (6977-6980) und merged danach per Default; es gibt keine Ablehnung, keine Obergrenze und keine Schema-Prüfung — ein neueres oder fremdes Format wird stillschweigend als Altstand behandelt. Das separat gespeicherte Dossier (`storyMode_save_dossier`, 1698/1723) trägt gar keine Version und fällt bei Parse-Fehler still auf `hydrate([])` zurück (1726).

**Worin Codex abwich.** Kein Codex-Befund — bei der geforderten Prüfung der Speicherformat-Versionierung mitgefunden.

**Nutzerwirkung.** Bei beschädigtem Spielstand tut der Knopf „Fortsetzen“ sichtbar nichts: kein Ladevorgang, keine Fehlermeldung, kein Angebot eines Neustarts. Der Spieler sitzt vor einem toten Knopf. Ein Spielstand aus einer neueren Version wird ohne Warnung als Altstand mit Default-Werten geladen.

**Kleine Korrektur.** Rückgabewert auswerten: `const handleLoad = () => { if (!loadGame()) setSaveMessage('Spielstand beschädigt — bitte neues Spiel starten.'); };` (StoryModeGame.tsx:813). Optional in `loadState` eine Major-Version-Prüfung: liegt die Major-Version des Stands über der aktuellen, gezielt werfen statt still zu mergen.

**Strukturelle Alternative.** Speicherstand-Ladefehler als benannten Fehlertyp (`SaveIncompatibleError` / `SaveCorruptError`) nach oben reichen, statt boolean; die UI kann dann pro Fall unterschiedlich reagieren (löschen anbieten vs. Update-Hinweis).

**Abnahme.** `localStorage.setItem('storyMode_save', '{kaputt')` → Titelbildschirm zeigt „Fortsetzen“ → Klick zeigt eine sichtbare Fehlermeldung statt gar nichts.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1702-1738`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:813-815`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:850`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:690-704`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:6972-6981`

</details>

#### E04f · Kontext-Auftrag: die tatsächlich gültige Schwelle aus dem Code herausarbeiten und die IST/SOLL-Abweichung sichtbar halten.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3 / P3

**Ursache (am Code belegt).** BELEGT — die gültige Schwelle steht an genau einer Stelle: WIN_THRESHOLD = 0.6 in StoryEngineAdapter.ts:748, gelesen von checkGameEnd (Zeile 6777) und von getWinThreshold() (Zeile 4825-4827). Es gibt keinen zweiten Ort und keine Datei/JSON, die sie überschreibt. In der Sonntagsfrage-Abbildung (SF_START 9, SF_SPAN 18, StoryEngineAdapter.ts:4956-4962) ergibt das 9 + 0.6*18 = 19,8 % — angezeigt als '20 %'. Die im Zielbild genannten 27 % sind der Wert bei Fortschritt 1.0 (9 + 18), also die Marke, die §4 ('alle Signatur-Achsen im Ziel') eigentlich fordert. IST 0.6 ist eine dokumentierte Zwischenkalibrierung mit ausdruecklichem Carry-forward auf 1.0 (ZIELBILD Zeile 326 und 399; STATUS.md:287-289 'WIN_THRESHOLD bleibt 0.6'; REVIEW_HOLISTISCH_2026-07-10.md:342: der 1.0-Versuch in PR #94 war ein rechnerischer No-Op, weil die Zielmarken exakt mitskaliert wurden). Auf origin/main und HEAD identisch (0.6, Signatur 55/50/45 unverändert).

**Nutzerwirkung.** Kein direkter Spielerschaden — aber jede Doku oder UI-Zeile, die '20 %' als Siegregel festschreibt, zementiert eine Zwischenkalibrierung gegen den geltenden Beschluss und macht die geplante Anhebung auf 1.0 teurer.

**Kleine Korrektur.** Nirgends '20 %' (oder 19,8 %) als Siegregel in Doku oder statischen UI-Text schreiben. Jede Anzeige die Schwelle aus getWinThreshold() ableiten — dann folgt die UI der Anhebung auf 1.0 automatisch. Wo eine feste Zahl unvermeidbar ist, den Zielbild-Wert 27 % nennen und die 0.6 als Balancing-Stand kennzeichnen.

**Strukturelle Alternative.** WIN_THRESHOLD auf 1.0 anheben — gekoppelt an impact_scale-Abschaffung und Aktions-Kuratierung, dedizierte Balance-Session (HANDOFF_2026-07-05B_ETAPPE5_FOLLOWUP.md). Nicht isoliert machbar: das Sim-Gate winnable-and-losable.test.ts ist die Leitplanke.

**Abnahme.** grep über src und docs findet keine Stelle, die 20 % als Siegbedingung behauptet; jede angezeigte Schwelle stammt aus getWinThreshold()/getWahlabendData().

<details><summary>Fundstellen</summary>

- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:748`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:4825-4827`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:4950-4963`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:6775-6784`
- `docs/ZIELBILD_2026-07-04_WETTRENNEN.md:36-45`
- `docs/ZIELBILD_2026-07-04_WETTRENNEN.md:78-81`
- `docs/ZIELBILD_2026-07-04_WETTRENNEN.md:326`
- `docs/STATUS.md:287-289`

</details>

#### E05c · Codex: "'Masche starten' merkt lediglich vor."

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3 / P3

**Ursache (am Code belegt).** BELEGT, aber es ist KEIN Mechanik-Bug, sondern eine ABSICHTLICHE Sonderregel mit falscher Beschriftung. Was beim Klick passiert: `onLaunch` -> `onLaunchMasche(testedId)` (MaschenVortestView.tsx:229,367-372) -> in StoryModeGame.tsx:1331 `{ addToQueue(actionId); setShowPreTest(false); }`. `addToQueue` (useStoryGameState.ts:1369-1381) hängt lediglich `buildQueuedAction(action)` an den React-State `actionQueue` und spielt einen Klick-Sound — KEINE Ressource wird angefasst. Abgebucht wird erst später: die Tafel-Taste AUSSPIELEN ruft `executeQueue` (useStoryGameState.ts:1402-1424) -> `executeAction` -> `engine.executeAction` -> `deductActionCosts` (StoryEngineAdapter.ts:5469) und `actionPointsRemaining--` (:3789). Dass das gewollt ist, ist im Code dreifach dokumentiert: Datei-Kopfkommentar MaschenVortestView.tsx:8 ("reiht genau diese Aktion in den Sendeplan"), StoryModeGame.tsx:1313 ("MASCHE STARTEN reiht genau diese Aktion in den Sendeplan (Bruecke Analyse -> Tat)") und der Testname MaschenVortestView.test.tsx:116 ("MASCHE STARTEN reiht genau die getestete Aktion ein"). Es folgt der Entwurfsentscheidung "EIN Planungsort" (QueuePinChip.tsx:2-6, NarrativeBoard.tsx:13). Der Fehler liegt allein in der Sprache und in fehlender Information: Der Knopf heißt "MASCHE STARTEN ▸" (MaschenVortestView.tsx:372) — "starten" verspricht Vollzug —, trägt KEINE Kostenangabe (der Typ `MascheKarte`, maschenVortest.ts:93-107, hat überhaupt kein Kostenfeld; `getVortestMaschen`, StoryEngineAdapter.ts:4750-4766, liefert keine Kosten mit), und die einzige Rückmeldung ist der kleine Chip unten rechts "N ANGEHEFTET — TAFEL (T)" (QueuePinChip.tsx:38) — das Wort dort ist "angeheftet", nicht "gestartet". Der Spieler klickt "starten", bekommt "angeheftet" und hat nie erfahren, was die Masche kostet.

**Worin Codex abwich.** Codex stellte es als offene Frage "Sonderregel oder Rechenfehler?" in den Raum. Antwort am Code: eindeutig Sonderregel, absichtlich, seit dem Entwurf so dokumentiert und durch einen Test festgeschrieben. Kein Kostenfehler — Kosten fallen korrekt beim Ausspielen an. Der Mangel ist reine Beschriftung/Information.

**Nutzerwirkung.** Erwartungsbruch am wichtigsten Übergabepunkt des Spiels (Analyse -> Tat): Der Spieler glaubt gesendet zu haben und hat nur vorgemerkt. Er sieht ausserdem vor dem Klick nicht, was die Masche kostet — Budget/Kapazität erfaehrt er erst an der Narrativ-Tafel (NarrativeBoard.tsx:658-662), also nach der Entscheidung.

**Kleine Korrektur.** Knopf umbenennen und Preis anschreiben: "IN DEN SENDEPLAN ▸ (12k · 2 Kap. · 1 AP)". Dafür `MascheKarte` (maschenVortest.ts:93) um `costs` erweitern und in `getVortestMaschen` (StoryEngineAdapter.ts:4750-4765) aus `loaded.costs` mitgeben; Knopftext in MaschenVortestView.tsx:372 anpassen. Der Testname in MaschenVortestView.test.tsx:116 ("reiht ... ein") beschreibt dann endlich dasselbe wie der Knopf.

**Abnahme.** Vor dem Klick steht auf dem Knopf, was die Masche kostet; nach dem Klick sagen Knopftext und Chip dasselbe Wort (Sendeplan/angeheftet). Kein Text im Vortest behauptet mehr, es sei bereits gesendet worden. Der bestehende Test bleibt grün (Callback-Vertrag unverändert).

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/components/MaschenVortestView.tsx:8`
- `desinformation-network/src/story-mode/components/MaschenVortestView.tsx:372`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1313`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:1331`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1369`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1402`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:3786`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5469`
- `desinformation-network/src/story-mode/components/QueuePinChip.tsx:38`
- `desinformation-network/src/story-mode/__tests__/MaschenVortestView.test.tsx:116`

</details>

#### E05e · Codex: "beabsichtigte Sonderregeln und tatsächliche Kostenberechnung sind abzugleichen" — Antwort auf die Frage nach EINER zentralen Kostenstelle.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* M · *Gegenprobe:* 0/2 widerlegt

**Ursache (am Code belegt).** BELEGT: Es gibt KEINE zentrale Kostenstelle, sondern SECHS, von denen zwei nachweislich voneinander abweichen. (A) `terminalCuration.istLeistbar` (terminalCuration.ts:26) — Terminal-Einzelaktion, rechnet mit dem ROHPREIS aus den Daten. (B) `queueAffordability.istPlanLeistbar` (queueAffordability.ts:28-41) — Sendeplan-Summe und AUSSPIELEN-Gate (NarrativeBoard.tsx:195), ebenfalls ROHPREIS, gespeist aus `buildQueuedAction` (useStoryGameState.ts:77-92), das `action.costs.budget` unverändert kopiert. (C) `StoryEngineAdapter.canAffordAction` (StoryEngineAdapter.ts:5422-5435) — rechnet mit RABATT: `Math.ceil(costs.budget * (1 - calculateNPCDiscount(action)/100))`. (D) `deductActionCosts` (StoryEngineAdapter.ts:5469-5486) — bucht ebenfalls den RABATTIERTEN Preis ab. (E) `convertToStoryAction` erzeugt `npcBonus.costReduction = relationshipLevel * 0.1` (StoryEngineAdapter.ts:3502) — eine DRITTE, abweichende Rabattformel (Bruchzahl statt Prozent, ohne Moral-Faktor, ohne 50%-Deckel); ein repo-weiter Grep zeigt: `npcBonus` wird von keiner UI-Komponente gelesen, also tote Rechnung. (F) `getOpportunityModifiers` liefert einen `costMultiplier` (StoryEngineAdapter.ts:3422-3462) — ein Grep über das gesamte Repo findet KEINEN Aufrufer; ebenfalls tot. Die Abweichung A/B gegen C/D ist real und nachrechenbar: `calculateNPCDiscount` = relationshipLevel*10 * (morale/100), gedeckelt bei 50 (StoryEngineAdapter.ts:5441-5466). `relationshipLevel` wird nach der Initialisierung nirgends geschrieben (einzige Zuweisung: StoryEngineAdapter.ts:977), und der `direktor` startet mit Level 1 und Moral 80 (npcs.json) -> 8 % Rabatt ab Spielbeginn. Damit gilt schon an Tag 1 für 10 der 26 direktor-affinen Aktionen: angezeigter Preis ≠ abgebuchter Preis, z.B. 2.13 "Strohmann-Partei gruenden" 25K angezeigt / 23K abgebucht, 7.8 "Medienunternehmen kaufen" 30K / 28K, 6.1 "Wahlkampf unterstuetzen" 20K / 19K. Angezeigt wird durchgaengig der Rohpreis (ActionCard.tsx:243-265, NarrativeBoard.tsx:658-662). Die Richtung ist gnaedig (es wird nie mehr abgebucht als angezeigt), aber das AUSSPIELEN-Gate in NarrativeBoard.tsx:195 rechnet zu streng und kann einen Plan sperren, der tatsächlich bezahlbar wäre (Budget 19, Plan = 2.10 "Think-Tank gruenden": Rohpreis 20 -> gesperrt, echter Preis 19 -> bezahlbar).

**Nutzerwirkung.** Der angezeigte Preis stimmt nicht mit dem abgebuchten überein — der Spieler kann sein Budget nicht planen und lernt, den Zahlen zu misstrauen. Am Rand des Budgets sperrt die Narrativ-Tafel Plaene mit "ZU TEUER", die tatsächlich bezahlbar wären; da der Rabatt an den Direktor gebunden ist, betrifft das gerade die teuren Struktur-Aktionen (Think-Tank, Strohmann-Partei, Medienkauf).

**Kleine Korrektur.** Den Effektivpreis zur einzigen Quelle machen: `calculateNPCDiscount` als öffentliche Methode `effectiveBudgetCost(actionId): number` exponieren und in `convertToStoryAction` (StoryEngineAdapter.ts:3527-3533) bereits den rabattierten Wert nach `costs.budget` schreiben — dann rechnen ActionCard, terminalCuration.istLeistbar, buildQueuedAction, queueAffordability.istPlanLeistbar und die Engine automatisch mit derselben Zahl. Die toten Rechnungen `npcBonus.costReduction` (StoryEngineAdapter.ts:3502) und `getOpportunityModifiers.costMultiplier` (:3422) entfernen oder anschliessen, damit keine vierte Formel im Code liegen bleibt.

**Abnahme.** Für jede Aktion gilt: die im Terminal, auf der Karte und an der Tafel angezeigte Budgetzahl ist exakt die Zahl, um die das Budget nach dem Ausspielen sinkt. Ein Test mit Direktor-Aktion 2.13 (Anzeige 23K bei Level 1 / Moral 80) und Budget 23 lässt AUSSPIELEN zu und endet bei Budget 0. Ein Grep findet nur noch EINE Rabattformel im Repo.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/components/terminalCuration.ts:26`
- `desinformation-network/src/story-mode/utils/queueAffordability.ts:28`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:195`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:77`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5422`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5441`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:5469`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:3502`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:3422`
- `desinformation-network/src/story-mode/components/ActionCard.tsx:253`

</details>

#### E07b · In einer beobachteten Situation war das TV in der Publikumsansicht leer; Codex konnte die Ursache nicht klaeren.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3 / P3

**Ursache (am Code belegt).** Geklaert — und es ist WEDER ein fehlender Leerzustand NOCH ein Fehlerzustand, sondern ein Animationsfehler bei LAUFENDER Sendung. (1) Laeuft eine Sendung (item gesetzt), steht im Bildfenster ausschließlich der Ticker-Span mit 'bb-ticker 9s linear infinite' (BroadcastBar.tsx:207-221). Die Keyframes gehen 'from translateX(100%) to translateX(-100%)' (BroadcastBar.tsx:50); Prozentwerte in translateX beziehen sich auf die EIGENE Breite des Spans. Der Span ist ein Flex-Kind mit whiteSpace:'nowrap' und min-width:auto, also so breit wie der Text (bei den Schlagzeilen der Daten — 20..39 Zeichen plus Praefix — rund das Doppelte bis Dreifache des ~110 px breiten Inhaltsfensters). Zum Animationsstart steht der Text daher vollständig RECHTS ausserhalb des Bildfensters und braucht das erste Drittel des 9-s-Zyklus, um hineinzulaufen — währenddessen ist der Bildschirm leer. (2) Das verschaerft der Auto-Peek: die ausgeklappte Leiste wird bei jedem Umschalten neu gemountet ('if (!expanded) return <CollapsedStrip .../>', BroadcastBar.tsx:392), der Ticker startet also bei JEDEM Aufklappen wieder ausserhalb — und der Peek dauert nur 4500 ms (StoryModeGame.tsx:467). (3) Zusätzlich ist das CSS-Bildfenster nicht auf das echte Loch des Rahmenbilds ausgerichtet: BroadcastBar.tsx:180-182 setzt {left 17 %, top 29 %, width 48 %, height 45 %}; das tatsächlich transparente Innenloch von public/assets/images/hud_tv_frame.png (512x384 RGBA, Innenbereich mit alpha<32, per Flood-Fill vom Rand abgegrenzt gemessen) liegt bei left 25,6 %, top 34,1 %, width 39,5 %, height 41,1 %. Das Rahmenbild liegt mit zIndex 2 UEBER dem Inhalt mit zIndex 1 (BroadcastBar.tsx:190, 204), also verdeckt die Blende zusätzlich die linken ~20 px und oberen ~9 px des Inhaltsfensters: der Text erscheint noch später und verschwindet frueher. BELEG am Bild: runs/visual-review/latest/shots/action_feedback.png (Ernte-Skript: 1,4 s nach AUSFUEHREN, Dialog wurde vom Wachter raeumeBuehneFrei über /^Verstanden/ weggeklickt, scripts/visual-review/harvest.mjs:106-108, 721-728) zeigt das TV auf ON AIR mit einem praktisch leeren Bildschirm — nur '● Bo' am rechten Rand —, während die Mittelspalte die volle Schlagzeile '[KLEIN] Bot-Netzwerk gestartet' führt. GEGENPROBE: Der echte Leerzustand ist sauber behandelt — ohne Sendung zeigt die Roehre das Testbild hud_tv_testcard, sonst den Text '··· KEIN SIGNAL ···' (BroadcastBar.tsx:177, 222-233); runs/visual-review/latest/shots/broadcast_expanded.png zeigt genau dieses gefuellte Testbild im STANDBY. Assets sind vorhanden und im Manifest registriert (public/assets/assets.json, hud_tv_frame/hud_tv_testcard). LATENTER Zusatzfehler, am Code belegt, Haeufigkeit unbelegt: fällt assets.imageUrl('hud_tv_frame') auf null (Manifest noch nicht geladen — initAssetRegistry läuft fire-and-forget in StoryModeGame.tsx:579 für 347 KB assets.json mit cache:'no-store' — oder Fetch schlägt fehl), rendert BroadcastBar.tsx:193 ein DECKENDES Ersatzrechteck (inset 0, backgroundColor '#15161c', zIndex 2) über dem Inhalt mit zIndex 1; dann ist der Bildschirm vollständig leer, auch ohne 'KEIN SIGNAL'. Sichtbar bliebe nur das ON-AIR-Laempchen (zIndex 3).

**Worin Codex abwich.** Codex hat ausdrücklich keine Ursache genannt ('nicht vollständig geklaert'). Die naheliegende Vermutung — fehlender Leerzustand oder fehlendes Asset — ist am Code widerlegt: der Leerzustand IST bebildert (Testbild) und hat einen Text ('··· KEIN SIGNAL ···'), die Assets sind vorhanden. Das beobachtete leere TV entsteht bei LAUFENDER Sendung durch den Ticker, der ausserhalb des Bildfensters startet, verstärkt durch ein CSS-Bildfenster, das nicht auf das gemessene Loch des Rahmenbilds passt.

**Nutzerwirkung.** Das Herzstueck der Sendeleiste — was gerade gesendet wird — ist im automatischen 4,5-s-Aufklappen über weite Strecken nicht lesbar; das TV wirkt kaputt oder tot, obwohl 'ON AIR' blinkt. Die Schlagzeile steht nur in der Mittelspalte, also gerade nicht dort, wohin die Bildsprache den Blick lenkt.

**Kleine Korrektur.** Den Ticker nicht ausserhalb starten: Schlagzeile zunaechst statisch/linksbuendig zeigen und erst nach einer Lesepause scrollen (oder Animation nur setzen, wenn der Text breiter als das Fenster ist), und die 'hole'-Prozentwerte in BroadcastBar.tsx:180-182 für das TV auf die gemessenen Werte des Assets korrigieren (left 25,6 %, top 34,1 %, width 39,5 %, height 41,1 %). Zusätzlich das Ersatzrechteck in BroadcastBar.tsx:193 auf einen Rahmen ohne deckende Fuellung umstellen bzw. hinter den Inhalt legen.

**Strukturelle Alternative.** Das Bildschirm-Rechteck als Metadatum am Asset fuehren (Loch-Koordinaten im Manifest, wie frameWidth/frameHeight bei Sheets) statt hart kodierter Prozentwerte pro Aufrufstelle — dieselbe Fehlausrichtung besteht sonst pro Rahmenbild erneut (der Zeitungsrahmen hud_paper_frame ist im selben Code mit 384x512 im 230x172-Kasten noch stärker verschoben).

**Abnahme.** Unmittelbar nach dem Aufklappen (auch beim automatischen Peek) steht die Schlagzeile lesbar im Bildfenster; ein Screenshot 1,4 s nach dem Ausspielen zeigt Text im TV, nicht nur am rechten Rand. Das Testbild fuellt im STANDBY das Glas ohne schwarze Restraender.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:50`
- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:177`
- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:180-182`
- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:186-194`
- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:196-233`
- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:392`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:462-469`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:579`
- `desinformation-network/public/assets/images/hud_tv_frame.png`
- `desinformation-network/runs/visual-review/latest/shots/action_feedback.png`
- `desinformation-network/runs/visual-review/latest/shots/broadcast_expanded.png`

</details>

#### E10a · Codex: "Lint findet keine Konfiguration."

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3 / P3

**Ursache (am Code belegt).** Belegt und auf main wie HEAD identisch. desinformation-network/package.json:12 definiert "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0", aber es existiert KEINE Konfiguration, die ESLint dafür findet: (a) keine eslint.config.js/.mjs/.cjs und keine .eslintrc* in desinformation-network/; (b) keine eslintConfig-Sektion in package.json (grep -c eslintConfig -> 0); (c) im Repo-Wurzelverzeichnis existiert überhaupt keine package.json und keine ESLint-Konfig; (d) keine eslintrc in den Elternverzeichnissen /home/user, /home, /. Die EINZIGE ESLint-Konfig im Repo ist sprite-tool/eslint.config.mjs — ausdrücklich nicht das aktive Spiel, und ESLint sucht ausschließlich aufwaerts vom cwd, nie in Geschwisterverzeichnissen. Der Abbruch kommt aus node_modules/@eslint/eslintrc/lib/cascading-config-array-factory.js:201 ("No ESLint configuration found in <dir>."). WICHTIGE ABWEICHUNG VON DER AUFGABENANNAHME ("Flat Config ab v9"): Installiert ist ESLint 8.57.1 (node_modules/eslint/package.json), devDependency ^8.56.0 — nicht v9. In 8.57.1 ist eslintrc der Default; Flat Config wird nur aktiv, wenn eine der Dateien aus FLAT_CONFIG_FILENAMES (flat-eslint.js:94-97) gefunden wird (shouldUseFlatConfig). Flat Config wäre hier der FALSCHE Fix, aus drei am Code belegten Gruenden: (1) node_modules/eslint/lib/cli.js:200 setzt options.extensions = ext ausschließlich im eslintrc-Zweig (else-Branch ab Z.156) — im Flat-Modus wird --ext ts,tsx stillschweigend verworfen, es würden nur .js/.mjs/.cjs geprüft, solange nicht zusätzlich files: ['**/*.{ts,tsx}'] gesetzt wird; (2) eslint-plugin-react-hooks@4.6.2 hat keinen flat-Export (Flat-Support erst ab v5); (3) @typescript-eslint/eslint-plugin@6.21.0 liefert in dist/configs/ ausschließlich eslintrc-Configs (all, base, eslint-recommended, recommended-type-checked, disable-type-checked), keine flat-Varianten. Flat Config würde also ein Plugin-Upgrade erzwingen.

**Nutzerwirkung.** Kein direkt sichtbarer Spielfehler. Wirkung ist mittelbar: eine ganze Qualitaetsstufe ist faktisch abgeschaltet — ungenutzte Variablen, kaputte React-Hook-Dependency-Arrays (exhaustive-deps) und tote eslint-disable-Direktiven werden nie gemeldet. Gerade bei 40 useCallback-Bloecken in useStoryGameState.ts ist exhaustive-deps die Regel, die stale-closure-Bugs faengt.

**Kleine Korrektur.** Eine Datei desinformation-network/.eslintrc.cjs anlegen (eslintrc-Format, NICHT Flat Config), die genau die bereits installierten Bausteine verdrahtet: root: true; env: { browser: true, es2020: true }; extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended']; parser: '@typescript-eslint/parser'; plugins: ['react-refresh']; ignorePatterns: ['dist', 'node_modules', 'archive']. Das bestehende npm-Script bleibt dann unverändert lauffaehig, weil --ext ts,tsx im eslintrc-Modus ausgewertet wird. Keine neue Dependency nötig — alle vier Pakete liegen bereits in devDependencies und in node_modules.

**Abnahme.** npm run lint läuft durch, ohne "No ESLint configuration found" abzubrechen, und meldet Regelverstoesse oder Exit-Code 0 statt eines Konfigurationsfehlers. Gegenprobe, dass die Endungen wirklich greifen: die Ausgabe nennt mindestens eine .ts- oder .tsx-Datei (bei stillschweigend verworfenem --ext wären es null TypeScript-Dateien).

<details><summary>Fundstellen</summary>

- `desinformation-network/package.json:12`
- `desinformation-network/node_modules/eslint/package.json:3`
- `desinformation-network/node_modules/eslint/lib/cli.js:200`
- `desinformation-network/node_modules/eslint/lib/eslint/flat-eslint.js:94`
- `desinformation-network/node_modules/@eslint/eslintrc/lib/cascading-config-array-factory.js:201`
- `sprite-tool/eslint.config.mjs:1`

</details>

#### E10c · Codex: "vier ergaenzende Prüfungen rot".

*Status:* ungeklaert · *Sicherheit:* hypothese · *Aufwand:* S · *Gegenprobe:* 0/0 widerlegt

**Ursache (am Code belegt).** Nicht verifizierbar, und das sage ich offen statt zu spekulieren. Diese vier Prüfungen existieren im Repository nicht: git diff --name-status origin/main..HEAD über alle *.test.ts/*.test.tsx zeigt ausschließlich sechs Dateien, die zum UX-Branch gehoeren (PortraitRahmen, ambientPlacement, buildingLayers, scrimGuard, stampCtaGuard, typeGuard) — keine davon stammt von Codex, alle wurden vor dem Review im Branch angelegt. Codex hat seine Zusatzpruefungen also ad hoc geschrieben und nicht eingecheckt. Ohne den Testcode lässt sich weder feststellen, WAS geprüft wurde, noch ob "rot" einen echten Produktfehler oder einen fehlerhaften Test bedeutet. Historische Dokumentation und ein Reviewbericht sind kein Verhaltensbeweis; ich habe keinen ausgeführten Code, an dem ich das nachziehen könnte.

**Worin Codex abwich.** Codex nennt ein Ergebnis ("vier rot"), liefert aber weder die Testnamen, noch die Assertions, noch die Fehlermeldungen mit — und hat die Tests nicht eingecheckt. Der Befund ist in dieser Form nicht nachpruefbar und daher auch nicht handlungsleitend.

**Nutzerwirkung.** Unbekannt. Wenn hinter den vier roten Prüfungen echte Defekte stehen, sind sie in diesem Bericht unsichtbar geblieben; wenn es Fehlannahmen des Reviewers über die Spielregeln waren, ist die Meldung ein Fehlalarm. Beides ist mit dem vorliegenden Material gleich plausibel.

**Kleine Korrektur.** Von Codex die vier Testdateien oder wenigstens die Assertion-Texte und die Fehlerausgabe nachfordern und dann gezielt gegen HEAD nachziehen. Solange das fehlt, den Punkt nicht als offenen Fehler fuehren, sondern als unbelegte Meldung.

**Abnahme.** Die vier Prüfungen liegen als Dateien im Repo und ihr Rot/Grün-Status ist auf HEAD reproduzierbar. Erst dann ist der Punkt entscheidbar.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/__tests__/`

</details>

#### E11 · Codex: "Adapter etwa 7.780 Zeilen, zentraler Hook etwa 1.913 Zeilen" (Wartbarkeitshinweis).

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* M · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3

**Ursache (am Code belegt).** Beide Zahlen sind exakt, nicht "etwa": StoryEngineAdapter.ts = 7780 Zeilen, useStoryGameState.ts = 1913 Zeilen. Beide Dateien sind zwischen origin/main und HEAD BYTE-IDENTISCH (git diff --stat origin/main..HEAD über beide Pfade ist leer) — die 43 Commits haben daran nichts geändert, der Befund gilt unverändert auf beiden Ständen. Die eigentliche Ursache ist aber nicht "große Datei", sondern eine Gottklasse: StoryEngineAdapter.ts exportiert nur 28 Symbole, davon 22 reine Interfaces/Types, 3 Konstanten, 2 Funktionen (getDataIntegrityIssues Z.711, createStoryEngine Z.7770) und EINE Klasse. Diese Klasse (Z.724-7756) ist rund 7030 Zeilen mit etwa 185 Methoden — 90 Prozent der Datei und 11,7 Prozent des gesamten src-Baums (66.439 Zeilen in 255 Dateien) in einem einzigen Typ. KONKRETE SCHNITTKANTEN, jeweils mit gemessener Zustandskopplung (Zaehlung distinkter this.<feld>-Namen im Bereich): (1) TYPEN-SEKTION Z.217-722, 506 Zeilen, Kopplung NULL — kein einziges this. im gesamten Bereich. Enthält StoryPhase Z.225, StoryResources Z.240, StoryAction Z.326, ActionResult Z.385, NPCState Z.494, NewsEvent Z.598, GameEndState Z.652, dazu SOCIETY_VALUE_META Z.278 und SAVE_FORMAT_VERSION Z.704. Nach StoryEngineTypes.ts verschieben und aus StoryEngineAdapter.ts re-exportieren; alle Importe der übrigen 254 Dateien bleiben unangetastet. Risikoloser 6,5-Prozent-Schnitt. (2) applyConsequenceMoraleImpact Z.1478-1993, 516 Zeilen in EINER privaten Methode, 6,6 Prozent der Datei. Inhaltlich ein hartkodierter Textkatalog, kein Algorithmus: 43 moraleChange-Zuweisungen, je rund 44 headline_de/headline_en/reaction_de/reaction_en-Literale, 16 reactions.push(...), gegliedert durch fünf Kommentarbloecke — CATEGORY 1 BOT/TECH EXPOSURE Z.1496, CATEGORY 2 TROLL/HARASSMENT BURNOUT Z.1585, CATEGORY 3 INVESTIGATION/EXPOSURE Z.1663, CATEGORY 4 OPPORTUNITY Z.1797, CATEGORY 5 COLLATERAL DAMAGE Z.1846. Kopplung nur 4 distinkte Namen: this.npcStates, this.newsEvents, this.storyPhase, this.seededRandom. Das Projekt hat für exakt dieses Muster schon Infrastruktur — Z.187-190 importieren npcs.json, world-events.json, targets.json, disinfo_methods.json aus src/story-mode/data/. Die Reaktionstexte nach data/consequence-reactions.json auslagern reduziert die Methode auf etwa 50 Zeilen Auswahllogik. (3) DELEGATIONS-FASSADEN Z.7219-7343, 125 Zeilen, Kopplung 7 distinkte Namen. Der Taxonomie-Teil Z.7291-7343 hält gar keinen eigenen Zustand: getTaxonomyForAction, getActionTaxonomyDisplay, getTaxonomyTechnique, getAllTaxonomyTechniques reichen alle nur an getTaxonomyLoader() weiter. Analog Z.7658-7708 (51 Zeilen): getExtendedActors bis getExtendedActorStats sind sechs Einzeiler auf this.extendedActorLoader. GEGENBELEG zur Ehrlichkeit: den naheliegend wirkenden größeren Tail-Block Z.7407-7708 (ArmsRace/Betrayal/Endings/ExtendedActors, 302 Zeilen) empfehle ich NICHT — er berührt 17 distinkte Instanzfelder und wäre ein schlechter Schnitt. Zum Hook: useStoryGameState.ts ist eine einzige exportierte Funktion ab Z.399 mit 40 useCallback-Bloecken. Die vier laengsten: executeAction Z.1039-1259 (221 Zeilen), handleDialogChoice Z.675-881 (207), endPhase Z.882-1038 (157), interactWithNpc Z.1470-1567 (98). Zwei geschlossene, herausloesbare Gruppen: die Warteschlange addToQueue/removeFromQueue/clearQueue/reorderQueue/executeQueue Z.1369-1429 (61 Zeilen) als useActionQueue, und die Speicherstaende saveGame/loadGame/hasSaveGame/deleteSaveGame Z.1693-1749 (57 Zeilen) als useSaveGame.

**Nutzerwirkung.** Keine unmittelbare. Mittelbar: jede Änderung an Konsequenzen, Dialogen, Wahlkampf-Metaspiel oder Rettungsstaenden fasst dieselbe Datei an, was Merge-Konflikte zwischen parallelen Zweigen erzwingt und das Testen von Teilverhalten ohne vollständige Engine-Instanz verhindert.

**Kleine Korrektur.** Als kleinsten Schritt nur Schnittkante 1 ausfuehren: Z.217-722 nach src/game-logic/StoryEngineTypes.ts verschieben und in StoryEngineAdapter.ts durch export * from './StoryEngineTypes' ersetzen. Kein Verhalten ändert sich, kein Aufrufer muss angefasst werden (Kopplung nachweislich null), und die Datei schrumpft um 506 Zeilen. Schnittkante 2 (Texte nach JSON) und 3 (Fassaden) sind eigene, größere Vorhaben und sollten nicht mit hineingezogen werden.

**Abnahme.** Für Schnittkante 1: npm run build und die 98 Testdateien laufen unverändert durch, git diff zeigt in keiner der übrigen 254 Dateien eine Änderung, und wc -l StoryEngineAdapter.ts liegt bei rund 7274 statt 7780.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:217`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:724`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:1478`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:1993`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:7291`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:7658`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:187`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:399`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1369`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1693`

</details>

#### E12 · Eigener Befund, nicht von Codex gemeldet: es gibt keinerlei CI-Konfiguration im Repository.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3 / P3

**Ursache (am Code belegt).** Belegt und auf main wie HEAD identisch. Es existiert kein .github-Verzeichnis im Arbeitsbaum (ls .github -> No such file or directory) und keines in der Versionsverwaltung: git ls-files | grep -c '^\.github/' -> 0, und git ls-tree -r origin/main --name-only | grep -c '^\.github/' -> 0. Auch keine aktiven Git-Hooks (.git/hooks enthält ausschließlich .sample-Dateien). Die einzige Automation im Projekt ist der Netlify-Deploy: netlify.toml:2 setzt command = "npm run build", was laut package.json:8 tsc && vite build ausführt. Daraus folgt die praezise Lage: die TYPPRUEFUNG ist beim Deploy erzwungen (ein tsc-Fehler bricht den Build ab), aber npm test und npm run lint werden NIRGENDS automatisch ausgeführt — nicht beim Commit, nicht beim Push, nicht beim Deploy. Die von Codex gemeldeten gruenen Tests sind damit ausschließlich davon abhängig, dass ein Mensch sie lokal startet und daran denkt. Zweite, konkrete Huerde für eine künftige CI: package.json:15 definiert "test": "vitest" ohne run-Subcommand. Installiert ist vitest 4.0.15, das im TTY in den Watch-Modus geht; ein CI-Job mit npm test würde haengen statt zu beenden. Ein test:run-Script existiert nicht (grep -c test:run -> 0).

**Worin Codex abwich.** Codex berichtet den gruenen Teststand als Qualitaetsaussage, prüft aber nicht, ob dieser Stand durchsetzbar ist. Er ist es nicht: zwischen Commit und Produktion steht allein tsc. Ohne diesen Befund liest sich "727 Tests grün" wie eine Garantie, obwohl es eine Momentaufnahme eines Entwicklerrechners ist.

**Nutzerwirkung.** Mittelbar, aber real: eine Regression, die einen der 750 Tests bricht, ohne einen Typfehler zu erzeugen, geht ungehindert bis in den Netlify-Deploy und damit zum Spieler. Genau die Klasse von Fehlern, die die Tests abdecken (Spiellogik, Endbedingungen, Speicherstaende), ist die, die tsc nicht sieht.

**Kleine Korrektur.** Zwei kleine Schritte, in dieser Reihenfolge. Erstens: in desinformation-network/package.json ein Script "test:run": "vitest run" ergaenzen, damit ein nicht-interaktiver Lauf existiert. Zweitens: .github/workflows/ci.yml anlegen, das bei push und pull_request in desinformation-network/ nacheinander npm ci, npm run typecheck und npm run test:run ausführt. Den Lint-Schritt erst hinzunehmen, nachdem E10a erledigt ist — sonst bricht die CI sofort an der fehlenden Konfiguration ab.

**Abnahme.** Ein Pull Request, der absichtlich eine Assertion in einer bestehenden Testdatei verletzt, ohne einen Typfehler einzubauen, wird von der CI rot markiert. Ohne diese Gegenprobe ist nur belegt, dass ein Workflow existiert, nicht dass er greift.

<details><summary>Fundstellen</summary>

- `desinformation-network/netlify.toml:2`
- `desinformation-network/package.json:8`
- `desinformation-network/package.json:15`
- `desinformation-network/package.json:12`

</details>

#### E12b · Aufspaltung von E12: Codex sagt "CSS enthält reduzierte Bewegung". Die Frage des Auftrags war, welche Animationen sie respektieren und welche nicht.

*Status:* teilweise · *Sicherheit:* am_code_belegt · *Aufwand:* M · *Gegenprobe:* 1/2 widerlegt
· *Skeptiker zum Schweregrad:* P3

**Ursache (am Code belegt).** Die globale Regel deckt CSS-Animationen und Transitions ab, aber nicht JS-getriebene Bewegung — und in einem Fall kehrt sie ihre Wirkung um. Vier belegte Ausreisser. (1) Umkehrung, der schwerste Fall: BroadcastBar.tsx:235-243 legt einen Scanline-Layer über den Sendestreifen mit background repeating-linear-gradient(transparent 0 2px, rgba(140,255,140,0.16) 2px 3px) und animation 'bb-scan 1.6s steps(2) infinite'. Die Keyframes animieren NUR opacity zwischen .05 und .14 (Zeile 49), das Element trägt aber KEINE statische opacity im Inline-Style. Die Kurzschreibweise setzt animation-fill-mode implizit auf none; die globale Regel beendet die Animation nach 0.01 ms, danach fällt opacity auf den Initialwert 1 zurück. Effektive Grün-Deckkraft steigt damit von 0,008-0,022 auf 0,16 — Faktor 7 bis 20. Ausgerechnet im Modus für Bewegungsempfindliche werden die Roehrenlinien also deutlich SICHTBARER, direkt über der 11px-Ticker-Schlagzeile (#9be89b auf #0a0f0a, BroadcastBar.tsx:207-221). Der Kontrast zu PlayerOfficeView.tsx:283, wo eine statische opacity:0.1 genau das verhindert, zeigt, dass es ein Versehen und kein Entwurf ist. (2) useNavigator.ts enthält vier rAF-Schleifen für Avatar-Lauf und Fahrstuhlfahrt (Zeilen 154, 161, 185, 203), die Positionen über React-State interpolieren; die Datei hat keinen einzigen Treffer auf 'reduc' oder 'matchMedia'. Die ~15-sekuendige Ankunftssequenz läuft bei prefers-reduced-motion also unverändert. (3) DialogBox.tsx:167-175 tippt jeden Dialogtext per setInterval mit 45 ms/Zeichen; kein matchMedia. Abkuerzbar per Klick (skipToEnd, :182-185), aber nicht automatisch stillgelegt. (4) FokusgruppeView.tsx:432 blinkt eine REC-Anzeige per setInterval alle 800 ms — die datei-eigene reduced-motion-Regel (:211-213) deckt nur die CSS-Animationen mit fg-Praefix ab, nicht diesen JS-Blinker. Alle vier bestehen unverändert auf origin/main (dortige Dateien haben ebenfalls null Treffer auf reduc/matchMedia). Nicht als Defekt zaehle ich den Ticker selbst: bb-ticker translatiert von 100% auf -100%, fällt mit fill-mode none aber auf translateX(0) zurück und bleibt lesbar. Unbelegt und daher Hypothese: ob scrollIntoView({behavior:'smooth'}) in TerminalView.tsx:154 prefers-reduced-motion beachtet — das entscheidet der Browser, nicht dieser Code.

**Worin Codex abwich.** Codex' Aussage stimmt, ist aber unvollständig: Die CSS-Regel deckt nicht alles ab. Vier bewegte Elemente laufen an ihr vorbei, und in einem Fall (BroadcastBar) macht sie den störenden Layer sogar 7-20x stärker, statt ihn zu daempfen — das verbindet E12 direkt mit Codex' Roehrenlinien-Beobachtung aus E06.

**Nutzerwirkung.** Nutzer mit prefers-reduced-motion sehen im permanenten Sendestreifen ein voll deckendes gruenes Zeilenraster über der Schlagzeile — mehr Rauschen als ohne die Einstellung. Zusätzlich laufen für sie die 15-sekuendige Ankunftsfahrt, der Schreibmaschineneffekt jedes Dialogs und ein 800-ms-Blinker unverändert weiter.

**Kleine Korrektur.** (a) BroadcastBar.tsx:235-243 eine statische opacity: 0.14 in den Inline-Style aufnehmen — dann fällt der Layer bei abgeschalteter Animation auf den Basiswert der Keyframes zurück, genau wie PlayerOfficeView.tsx:283 es vormacht. Ein Zeileneingriff, kein neuer Code. (b) Den bestehenden usePrefersReducedMotion-Hook aus BuildingStage.tsx:262-274 exportieren und in useNavigator.ts nutzen: bei reduced die Schritt-Dauer auf 0 setzen, sodass runStep direkt die Zielposition schreibt statt zu interpolieren. (c) Denselben Hook an DialogBox.tsx:197 als enabled=false durchreichen — der Parameter existiert bereits (:152). (d) FokusgruppeView.tsx:432: Intervall bei reduced nicht starten.

**Abnahme.** Mit prefers-reduced-motion:reduce ist der Sendestreifen-Layer nicht sichtbarer als ohne (gemessene Deckkraft <= 0,022 statt 0,16); die Ankunftssequenz erreicht die Zentrale ohne sichtbare Laufbewegung; Dialogtexte erscheinen vollständig ohne Tippeffekt; die REC-Anzeige blinkt nicht.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:235`
- `desinformation-network/src/story-mode/broadcast/BroadcastBar.tsx:49`
- `desinformation-network/src/story-mode/building/useNavigator.ts:154`
- `desinformation-network/src/story-mode/components/DialogBox.tsx:167`
- `desinformation-network/src/story-mode/components/FokusgruppeView.tsx:432`
- `desinformation-network/src/index.css:563`
- `desinformation-network/src/story-mode/components/PlayerOfficeView.tsx:283`

</details>

### Kein Fehler — bestätigte Stärken und Klarstellungen

#### E06c · Codex sah einen "unruhigen Hintergrund" am Board.

*Status:* bereits_behoben_auf_HEAD · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 0/0 widerlegt

**Ursache (am Code belegt).** Bestätigt für origin/main, auf HEAD gezielt repariert — und die Reparatur trifft genau diesen Befund. Auf main lagen die Spuren des Bretts mit rgba(0,0,0,0.08) bzw. rgba(0,0,0,0.12) auf der Korkfläche, die gesperrte Spur sogar ganz ohne Fläche mit opacity:0.55. Da die Korkkachel als backgroundImage HINTER allen Kindern liegt und keinen Deckkraft-Regler hat, schlug jedes helle Korn direkt hinter den Buchstaben durch. Nachgerechnet (WCAG-Relativluminanz, Korkgrund #7a5a36): Labelfarbe #bfa988 auf main-Spur = 3,31:1, #c9b48f = 3,72:1; die gesperrte Spur mit opacity 0.55 ohne Trägerfläche = 1,81:1; über einem hellen Korn (#d0b088) fällt main auf 1,16:1 — der Text verschwindet physikalisch. HEAD führt StoryModeSurfaces.corkCarrier = rgba(44,31,18,0.86) ein (theme.ts:122-125) und legt sie unter alle vier Spurtypen: lane-frei (NarrativeBoard.tsx:373), lane-gesperrt (:395, die opacity:0.55 ist ersatzlos entfallen), lane-tagesgeschaeft (:412) und StrandLane (:544). Nachgerechnet ergibt das 6,30:1 / 7,09:1 / 9,73:1 für #bfa988 / #c9b48f / #e6d3ad — und selbst über dem hellen Korn noch 5,31:1, weil die 86%-Deckung die Kachelvarianz kappt. Die 6,3:1 im theme.ts-Kommentar stimmen exakt mit meiner unabhaengigen Rechnung überein. Zusätzlich sank der Vollbild-Scrim von rgba(0,0,0,0.82) auf scrim('leicht') = 0,78 (NarrativeBoard.tsx:201) — das ist bewusst HELLER, damit die Welt darunter lesbar bleibt, und berührt den Kontrast auf dem Brett nicht.

**Nutzerwirkung.** Auf origin/main war Spur-Text über hellem Korkkorn stellenweise unlesbar (bis 1,16:1 gemessen). Auf HEAD liegen alle Spur-Labels über 5:1, auch im ungünstigsten Kachelfall. Für HEAD ist kein Handlungsbedarf offen.

**Kleine Korrektur.** Keine. Der Befund gilt nur für origin/main und ist auf HEAD durch StoryModeSurfaces.corkCarrier erledigt. Falls der Wert langfristig gehalten werden soll, wäre eine Wache analog scrimGuard.test.ts denkbar, die Textflächen über der Korkkachel ohne Trägerfläche meldet.

**Abnahme.** Auf HEAD: alle vier data-testid-Spuren (lane-frei, lane-gesperrt, lane-tagesgeschaeft, lane-strand-*) tragen backgroundColor rgba(44,31,18,0.86); keine Spur mehr mit opacity < 1.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/theme.ts:122`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:373`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:395`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:412`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:544`
- `desinformation-network/src/story-mode/components/NarrativeBoard.tsx:201`

</details>

#### E08b · Codex fand Marinas Episode mit drei zusammengehoerigen Aktionen verständlicher als die freie Systemauswahl — eine Stärke, die es zu verstehen gilt.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt

**Ursache (am Code belegt).** Vollständig am Code und an den aktiven Daten belegt, und die Episode lässt sich eindeutig identifizieren. Ich habe alle 13 Episoden-Auslöser gegen die Startwerte der Engine ausgewertet (polarisierung 25, informationslast 20, zynismus 20, fragmentierung 15, diskursqualitaet 70, fraktionsstärke 25 — StoryEngineAdapter.ts:941-963; Auslöserlogik EpisodeLoader.ts:63-84). Ergebnis: An Tag 1 ist GENAU EINE Episode ausloesbar — ep_bruecke "Die Bruecke, die zweimal steht" (episodes.json:10ff), ausloeser anyOf:[{always:true}], anbieter_npc: marina, mit exakt DREI einklink_aktionen 11.13 / 11.14 / 7.2. Alle zwoelf anderen sind zu (worldEvent election_announced, oder Schwellen wie polarisierung>=50, informationslast>=30, zynismus>=30 — an Tag 1 keine erfüllt). Codex' "Marinas Episode mit drei Aktionen" ist also nicht ungefähr, sondern der einzig mögliche Fall. Vier Mechaniken machen das Muster tragfaehig, alle im Code: (1) Buendel statt Katalog — beim Annehmen werden alle drei einklink_aktionen in EINEM Schritt auf den Sendeplan geheftet (useStoryGameState.ts:726-735, setActionQueue mit dem gesamten pinned-Array); alle drei sind an Tag 1 freigeschaltet (keine prerequisites) und zusammen leistbar: 18 von 150 Budget, 4 von 5 Kapazität, 3 von 5 AP. (2) Rahmen statt Liste — derselbe Dialog liefert Lage (lage_de) und die Dilemmafrage (wendung_de) mit, sodass die drei Karten eine Begründung tragen (useStoryGameState.ts:738-746). (3) Vorrang im Terminal — kuratiereVorgaenge gibt Episoden-Aktionen Rang 0, vor Berater-Empfehlungen (terminalCuration.ts:46); die drei Karten stehen also obenan in der Tuer, während die übrigen 85 im ARCHIV bleiben. (4) Sichtbarer Fortschritt und Nachfassen — die Tafel gruppiert sie auf einer Spur mit zaehlbaren Stummeln erledigt/gesamt (StoryModeGame.tsx:556-562, NarrativeBoard.tsx StrandLane), und stockt die Spur, erinnert das Morgenbriefing daran (StoryModeGame.tsx:566-570 stockendeSpur -> spurHinweis). Der Kontrast zur "freien Systemauswahl" ist damit 3 begruendete Karten gegen 88 unbegruendete. Die Bedingung, unter der das Muster greift: Der Spieler muss Marina finden — Episodenangebote erscheinen nur im Dialog des anbietenden NPC (getOfferableEpisodes(npcId), StoryEngineAdapter.ts:4105-4113; Angebot als erste Dialogoption, useStoryGameState.ts:1543-1556), und Marina sitzt im medien_zentrum auf Etage 3, während der Spieler auf Etage 1 beim Direktor startet. Der Direktor selbst hat an Tag 1 kein Angebot (seine vier Episoden sind alle zu).

**Nutzerwirkung.** Das Muster funktioniert wie beschrieben, ist aber nur über Marina erreichbar. Wer an Tag 1 nicht auf Etage 3 geht, sieht die einzige geführte Struktur des Spiels nie und bleibt bei den 88 freien Aktionen — das erklärt zugleich E08a.

**Kleine Korrektur.** Das Muster nicht ändern, sondern anschliessen: Im Eroeffnungsdialog des Direktors auf die einzige reife Episode verweisen. Der Datenweg existiert bereits — engine.getOfferableEpisodes() ohne npcId liefert an Tag 1 genau ep_bruecke, und das Morgenbriefing verarbeitet solche Hinweise schon (StoryModeGame.tsx:1513-1516 spurHinweis). Ein zweiter Satz im Volkov-Text (useStoryGameState.ts:641) oder ein beatHook, der den Anbieter-NPC und dessen Etage nennt, genuegt.

**Abnahme.** An Tag 1 nennt Eroeffnungsdialog oder Morgenbriefing namentlich Marina und Etage 3 als nächsten Schritt; nach Annahme der Episode liegen drei Karten auf dem Sendeplan (state.actionQueue.length === 3) und die Spur zeigt 0/3.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/story-mode/data/episodes.json:10`
- `desinformation-network/src/story-mode/engine/EpisodeLoader.ts:63`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:941`
- `desinformation-network/src/game-logic/StoryEngineAdapter.ts:4105`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:726`
- `desinformation-network/src/story-mode/hooks/useStoryGameState.ts:1543`
- `desinformation-network/src/story-mode/components/terminalCuration.ts:46`
- `desinformation-network/src/story-mode/StoryModeGame.tsx:556`
- `desinformation-network/src/story-mode/data/building.json`

</details>

#### E10b · Codex: "bestehende 727 Tests in 92 Dateien grün".

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 1/2 widerlegt

**Ursache (am Code belegt).** Kein Fehler, sondern eine Zahlenangabe — und sie ist exakt reproduzierbar, aber sie beschreibt origin/main, nicht HEAD. Dateizahl auf origin/main: git ls-tree -r origin/main --name-only | grep -E '^desinformation-network/src/.*\.test\.tsx?$' | wc -l -> 92. Punktgenaue Übereinstimmung mit Codex. Auf HEAD (bf709d6): 98 Dateien, also +6. Die sechs neuen sind src/story-mode/__tests__/{PortraitRahmen,ambientPlacement,buildingLayers,scrimGuard,stampCtaGuard,typeGuard}.test.ts; zusätzlich wurden DayReport.test.tsx und skyTime.test.ts geändert. Testfaelle statisch gezählt (Regex ^\s*(it|test)(\.\w+)?\s*\( ): main 722, HEAD 750, also +28. Codex' Laufzeitzahl 727 liegt 5 über meiner statischen Zaehlung auf main — das ist der erwartete Unterschied durch it.each/parametrisierte Fälle und mehrzeilige Aufrufe, die Zahl ist damit glaubhaft und nicht widerlegt. Separat davon tools/: origin/main 5 Testdateien, HEAD 15 (+10, alle unter tools/model-review/test/). Diese laufen NICHT unter vitest — tools/model-review/package.json setzt "test": "node --test" und ist ein eigenes npm-Projekt; desinformation-network/vitest.config.ts hat kein include und deckt daher nur den Spielbaum ab. Codex' 92/727 bezieht sich also korrekt allein auf das Spiel.

**Nutzerwirkung.** Keine. Die 43 Commits haben die Testabdeckung ausgebaut, nicht abgebaut.

**Kleine Korrektur.** Nichts zu korrigieren. Für künftige Vergleiche die Zahl an den Commit binden statt an "aktuell" — die Aussage 92/727 ist ohne den Zusatz "auf origin/main 9dfbb38" innerhalb weniger Commits veraltet.

**Abnahme.** find desinformation-network/src -name '*.test.ts*' | wc -l liefert 98 auf HEAD und 92 auf origin/main.

<details><summary>Fundstellen</summary>

- `desinformation-network/vitest.config.ts:6`
- `desinformation-network/package.json:15`
- `tools/model-review/package.json:12`
- `desinformation-network/src/story-mode/__tests__/typeGuard.test.ts:1`
- `desinformation-network/src/story-mode/__tests__/scrimGuard.test.ts:1`

</details>

#### E12a · Codex nennt Gebäude, Porträts und Ankunft als stimmige Atmosphaere und weist darauf hin, dass das CSS reduzierte Bewegung enthält — eine Stärke, die bewahrt werden soll.

*Status:* bestätigt · *Sicherheit:* am_code_belegt · *Aufwand:* S · *Gegenprobe:* 0/2 widerlegt

**Ursache (am Code belegt).** Beides belegt, auf origin/main wie auf HEAD unverändert. Die globale Regel steht in index.css:563-569 und setzt für *, *::before, *::after animation-duration 0.01ms, animation-iteration-count 1 und transition-duration 0.01ms — jeweils !important; auf main liegt sie identisch bei Zeile 533. Zwei Komponenten gehen darüber hinaus und machen es richtig: BuildingStage.tsx:262-274 hält einen eigenen matchMedia-Hook (re-subscribed, jsdom-sicher) und schaltet den 60-Hz-Statisten-Abspielkopf bei reduced motion komplett ab (Zeile 291-302: setFigures([]) und return VOR dem rAF-Loop, reduced steht in der Dependency-Liste :354); NewsroomView.tsx:180-185 deaktiviert seine Lauf-Animationen mit animation:none !important statt sich auf die 0.01ms-Kruecke zu verlassen. Vorbildlich gelöst ist auch PlayerOfficeView.tsx:277-288: Der Monitor-Flacker-Layer trägt eine statische opacity:0.1 im Inline-Style, sodass er bei abgeschalteter Animation exakt auf den Basiswert der Keyframes zurückfällt. Die Atmosphaere-Behauptung ist datenseitig gedeckt: public/assets/assets.json führt 335 Assets, darunter 32 Porträts (5 Stimmungen je NPC, portrait_marina bis portrait_marina_worried), 15 bld_*, 10 room_*, 10 figure_*, 4 player_* und ui_cork_tile; die Ankunftssequenz ist als eigene Inszenierung mit Letterbox und Schreibmaschinen-Captions gebaut (ArrivalSequence.tsx:19-31, :120-160). Keine Aussage von mir zu FPS, Mobilgeraeten oder Audio — dazu liegt kein Beleg vor.

**Nutzerwirkung.** Die Stärke besteht. Der schwerste Bewegungsanteil (die laufenden Statisten im Gebäude) wird bei prefers-reduced-motion tatsächlich abgeschaltet, nicht nur beschleunigt.

**Kleine Korrektur.** Nichts ändern. Erhaltenswert sind besonders zwei Muster, die als Vorbild für die Ausreisser in E12b dienen: der matchMedia-Hook in BuildingStage.tsx:262 und die statische Basis-opacity in PlayerOfficeView.tsx:283.

**Abnahme.** Mit prefers-reduced-motion:reduce bleiben die Gebäude-Statisten unbewegt (data-testid der Ambient-Figuren nicht im DOM) und die Newsroom-Scanline steht still.

<details><summary>Fundstellen</summary>

- `desinformation-network/src/index.css:563`
- `desinformation-network/src/story-mode/building/BuildingStage.tsx:262`
- `desinformation-network/src/story-mode/building/BuildingStage.tsx:291`
- `desinformation-network/src/story-mode/components/NewsroomView.tsx:180`
- `desinformation-network/src/story-mode/components/PlayerOfficeView.tsx:277`
- `desinformation-network/src/story-mode/components/ArrivalSequence.tsx:19`
- `desinformation-network/public/assets/assets.json`

</details>

---

## Was offen bleibt

- **E01 Konsequenz-Absturz** — Vier Punkte, die ich bewusst offen lasse. (1) Der genaue Zeitpunkt 'Tag 4' liess sich ohne Browser nicht nachstellen; er ist aber zwanglos erklärbar, weil der Wurf pro Einsatz nur rund 30 Prozent trifft und acht verschiedene Aktionen ihn ausloesen können. Die Kette selbst ist unabhängig davon am Code belegt. (2) Persistenz: StoryEngineAdapter.ts:6919 serialisiert pendingConsequences und Zeile 6993 liest sie mit '?? []' zurück. Alte Spielstaende würden also ebenfalls severity-lose Objekte einspielen - ich habe aber nicht geprüft, ob überhaupt in den Browser-Speicher geschrieben wird, und es ist für E01 auch nicht nötig: bereits der Frischstart-Pfad erzeugt undefined. Als Ursache scheidet die Deserialisierung damit aus. (3) Nebenbefund, nicht verfolgt: von 51 Eintraegen in triggered_by zeigen nur 8 auf real geladene Aktionen. Die übrigen verweisen auf nicht existierende Aktions-IDs (3.x, 5.x, 6.x, 7.x, 8.x) oder faelschlich auf Konsequenz-IDs und Pseudo-Ereignisse wie budget_stress und multiple_failures. Diese Trigger sind tot - ein eigenständiger Datenbefund ausserhalb dieses Auftrags. (4) Ebenfalls nur notiert, nicht ausgewertet: consequences.json weicht noch an drei weiteren Stellen vom Typ ab (fehlendes label_en, fehlendes description_de/en, player_choices mit cost/outcome statt costs/outcome_de/outcome_en). Diese Abweichungen stuerzen nicht ab, bestätigen aber, dass die Datei nie gegen ihr Interface geprüft wurde.
- **E02/E03 Spielstand, Reset, Sperren** — GILTIGKEIT origin/main vs. HEAD: Für ALLE sechs Befunde geprüft und identisch. `git diff origin/main HEAD` meldet für StoryEngineAdapter.ts, useStoryGameState.ts, ActionLoader.ts und StoryActorAI.ts NULL Änderungen; StoryModeGame.tsx hat 10/17 Zeilen Diff, die ausschließlich Scrim-Farben und den End-Report-Knopf betreffen (die Zeilen 1237/1238 mit der isUsed/isUnlocked-Abbildung sind auf origin/main wortgleich, nur um 7 Zeilen verschoben). Die 43 Commits von HEAD beheben also keinen dieser Befunde; alle Zeilenangaben oben gelten für den HEAD-Arbeitsbaum und inhaltsgleich für origin/main.

METHODE: Alle Aussagen sind am Code belegt UND zusätzlich zur Laufzeit nachgemessen — ich habe drei temporäre Vitest-Dateien angelegt, gegen HEAD ausgeführt und wieder gelöscht (git status ist sauber, keine Codeänderung im Repo). Gemessen wurde: (a) Engine-Ebene save→neue Engine→load, (b) Hook-Ebene mit renderHook, (c) der echte Fortsetzen-Pfad mit unmount/remount, weil nur der das Verhalten nach einem Seiten-Reload abbildet — im selben Mount täuschen die überlebenden React-States mehrfach ein korrektes Ergebnis vor (genau das verdeckt E03a, wenn man nicht neu mountet).

EXPLIZITE FELDLISTE (Auftragspunkt 2), Engine-Ebene:
GESPEICHERT (StoryEngineAdapter.ts:6912-6968, 44 Schlüssel): version, rngSeed, electionDay, storyPhase, storyResources, pendingConsequences, exposureCountdown, newsEvents, objectives, npcStates, actionHistory, worldEventCooldowns, activeOpportunityWindows, crisisWindowPhasesLeft, rumorPressure, episodesOffered, episodesActive, episodesCompleted, resolvedDecisionBeats, narrativeMemory, currentAuftragId, pollIndex, lastPollValues, noiseRiskToday, noiseAttentionToday, maschenGedaechtnis, segmentBelief, gekippteGruppen, patchedFamilies, firedAbwehrStages, pendingAbwehrStages, lastNightReport, reachDampening, lastTrancheDay, lastTrancheProgress, mahnstufe, lastTranche, nachspielzeitGenutzt, laeuferHistorie, comboSystemState, crisisMomentSystemState, actorAIState, actionLoaderState, consequenceSystemState. Außerhalb der Engine zusätzlich: storyMode_save_timestamp und storyMode_save_dossier.
NICHT GESPEICHERT, schadenrelevant: carrierStates (3993), acquiredKompromat (3994), operationsPlayed (4018), carriersUsed (4019), platformsUsed (4020), activeConsequence (729), allTriggeredEvents (754), countermeasureSystem-Zustand (862), betrayalSystem-Zustand, extendedActorLoader-Zustand (currentTrust), dialogLoader-Zustand (dialogueHistory/emotionalMemory).
NICHT GESPEICHERT, unkritisch bzw. bewusst: engineState (725, ungenutzt), npcDialogues (734, aus Daten geladen), trustTargetHeldPhases (741, im Code als historische Telemetrie markiert), triggeredEventsThisPhase (753, phasen-transient), lastMaschenDaempfung (814) und letzterFamilienEinsatz (823) — beide werden in loadState ausdrücklich genullt (7040/7043), mit dokumentierter Begründung.
NICHT WIEDERHERGESTELLT im Hook (loadGame, 1702-1734): completedActions, carrierStates, acquiredKompromat, actionQueue, worldEvents, recommendations, betrayalStates, activeBetrayalWarnings, activeBetrayalEvent, activeCrisis, activeStageCountermeasure, recommendationTracking, comboHints, trustHistory, extendedActors, currentDialog, activeNpcId, decisionBeatResult, gameEnd.

NICHT ABSCHLIESSEND GEKLÄRT: Codex nannte für E03 nur drei Prüfungsnamen, nicht die Prüfungen selbst. Ich habe zu jedem Namen genau eine belegte Fehlfunktion gefunden und laufzeitseitig reproduziert — dass Codex' Prüfungen exakt dieselben Punkte adressierten, ist damit sehr wahrscheinlich, aber nicht beweisbar. Falls Codex' Prüfcode noch vorliegt, wäre der Abgleich in Minuten erledigt. Zweite offene Kante: die Zeitbasis habe ich für die Kanalsperren (Spieltage, sauber) belegt; die Ablaufrechnung der Gelegenheitsfenster (activeOpportunityWindows, cleanupExpiredOpportunityWindows, 3396) und der Krisenfenster habe ich nicht im Detail geprüft, weil kein Befund darauf zeigte — beide Zustände stehen jedoch im Save.
- **E04 Konkurrierende Hauptziele** — ERGEBNISTABELLE (IST-Code vs. UI-Versprechen vs. Zielbild-Beschluss), aktiver Auftrag = Default 'wahl':

| Größe | Was der Siegcheck prüft (VictorySystem.ts:64-86 + StoryEngineAdapter.ts:748) | Was die UI verspricht | Was das Zielbild beschlossen hat |
|---|---|---|---|
| Siegwege | GENAU EINER: auftragProgressMin >= 0.6. Kein zweiter victory-Zweig im Repo (nur StoryEngineAdapter.ts:6852) | MissionPanel + StatsPanel zeigen zusätzlich 'HAUPTZIEL: Westunion destabilisieren, Ziel unter 40'; NarrativeBoard + LagebildView zeigen es korrekt nicht mehr | EIN Siegweg, DREI Verlustwege (§4); Vertrauens-Sieg gestrichen (§12.2) |
| Rolle Vertrauen | Eine von drei Signatur-Achsen (Auftraege.ts:64), notwendig, nicht hinreichend. Siegmarke Vertrauen <= 70 | Akte: 'Ziel 50'; HAUPTZIELE: 'Ziel unter 40'; Morgenbriefing/Tagesfazit: Nenner 100->40 | Vertrauen = Mittel, nicht Ziel (§8-Stempel, in AuftragSelect.tsx:36-39 korrekt umgesetzt) |
| Achsen-Marken | fraktionsstärke >= 43 · vertrauen <= 70 · zynismus >= 35 (Min-Regel, alle drei) | Akte zeigt 55 / 50 / 45 und setzt das Haekchen erst dort | 'alle Signatur-Achsen im Ziel' (§4) = 55 / 50 / 45 |
| Sonntagsfrage-Schwelle | 9 + 0.6*18 = 19,8 % | 'über 20 % am Wahltag' (NarrativeBoard), Zielstrich im HUD ohne Zahl | 'z. B. Start 9 % -> Ziel 27 %' (§3, illustrativ) = Fortschritt 1.0 |
| Zeitpunkt des Siegs | sofort bei Schwellenerreichen, Phasencheck erst danach (VictorySystem.ts:76-83) | 'am Wahltag' | 'Am Wahltag hat die Sonntagsfrage die Schwelle erreicht' (§4) — Abweichung als H-14 offen dokumentiert |
| Abwehr | >= 100 schlägt den Sieg (Priorität 0b, VictorySystem.ts:74) | 'ABWEHR X/100 — bei 100 ist Schluss' | übereinstimmend (§4, Verlust 1) |
| Risiko | >= 85 nur solange der Auftrag NICHT erfüllt ist (VictorySystem.ts:68) | 'Nicht enttarnt werden — unter 85 halten' | übereinstimmend (§4, Verlust 3) |

NICHT-BEFUNDE (gezielt geprüft, damit niemand hier Arbeit verschwendet):
- Es gibt KEINEN zweiten Siegweg. trustTargetHeldPhases wird in StoryEngineAdapter.ts:1354-1359 noch hochgezählt, aber nirgends gelesen; REQUIRED_HOLD_PHASES (Zeile 742) kommt nur in Kommentaren vor. Reine Telemetrie/Save-Kompatibilitaet.
- obj_destabilize.completed beeinflusst den Ausgang nicht. Es fliesst nur über objectivesCompleted in die Ending-TEXT-Klassifikation (EndingSystem.ts:517,537), und assembledEndingForBranch (StoryEngineAdapter.ts:6745-6752) erzwingt ohnehin die zum Zweig passende Kategorie.
- TutorialOverlay ist toter Content: 'Ihre Aufgabe ... destabilisieren' (TutorialOverlay.tsx:37) und 'Das Spiel läuft über 10 Jahre (120 Phasen)' (Zeile 44) stehen zwar im File, aber tutorial.start() wird nirgends aufgerufen (StoryModeGame.tsx:642 behauptet Erreichbarkeit über Pausenmenue/Hilfe — es existiert keine Aufrufstelle). Der Schritt 'objectives' ist bereits auf das Rennen umgeschrieben. Kein Live-Widerspruch, aber eine Falle für den nächsten Reviewer.
- dialogues.json:178 ('Westunion destabilisieren. Wir haben zehn Jahre.') ist ebenfalls unerreichbar: getNPCBriefing (StoryEngineAdapter.ts:7117) hat keine Aufrufstelle.
- Die Balken-Grafik in der Vergabe-Szene (AuftragSelect.tsx:64-71) ist hartkodiert (Fuellung 18 %, Strich bei 70 %) statt aus getWahlabendData() abgeleitet, nennt aber keine Zahl ('Ziel: über die Schwelle') — daher kein widersprechendes Ziel, nur eine vierte, nicht abgeleitete Darstellung desselben Rennens.

MAIN vs. HEAD: E04a-E04f gelten unverändert auf beiden Ständen. Die 43 Commits ändern an MissionPanel nur die Scrim-Farbe (rgba -> scrim('normal')); WIN_THRESHOLD, Aufträge-Signatur, VictorySystem, StatsPanel, MorningBriefing und die Filter in NarrativeBoard/LagebildView sind byte-gleich zu origin/main. Nichts davon ist auf HEAD bereits behoben.

WAS ICH NICHT KLAEREN KONNTE: (1) Ob die Live-Reihenfolge in state.objectives jemals von initializeObjectives() abweicht — die Save/Load-Wiederherstellung (StoryEngineAdapter.ts:6996-6997) übernimmt das Array aus dem Spielstand ungeprüft, sodass StoryModeGame.tsx:549 ('erster primary') theoretisch obj_survive treffen könnte; ich habe keinen Spielstand gefunden, in dem die Reihenfolge kippt, und habe das Spiel nicht ausgeführt (kein Browser erlaubt). Das ist eine HYPOTHESE, kein Befund. (2) Die Sim-Zahl 'Siege enden Median Tag 14-16' in E04e stammt aus docs/REVIEW_HOLISTISCH_2026-07-10.md, nicht aus einem von mir gefahrenen Lauf; belegt habe ich nur die Code-Eigenschaft (Siegzweig ohne Wahltags-Bedingung).
- **E05 Phasen-Semantik und Kosten** — GELTUNGSBEREICH (a)/(b) — geprüft: Alle fünf Befunde gelten UNVERAENDERT auf origin/main UND auf HEAD (bf709d6). `git diff --stat origin/main HEAD` zeigt für StoryEngineAdapter.ts, carriers.json und useStoryGameState.ts NULL Änderungen; die drei geänderten Dateien (StoryModeGame.tsx, MaschenVortestView.tsx, OperationsAkteView.tsx) tragen die betroffenen Zeilen identisch — auf main: OperationsAkteView.tsx:575 (`Phase(n)`), MaschenVortestView.tsx:215 (\"eine Phase\"), :369 (\"MASCHE STARTEN\"), StoryModeGame.tsx:1337 (`onCommission ... endPhase()`), :1338 (`onLaunchMasche -> addToQueue`), :1497-1498 (resetDay NUR im DayReport-Pfad), NarrativeBoard.tsx:195 (Roh-Gate). Keiner der 43 Commits behebt etwas davon.

KERNANTWORT auf die gestellte Frage: \"Masche starten\" ist KEIN Bug, sondern eine absichtliche, im Code und in einem Test festgeschriebene Sonderregel (Vormerken statt Ausfuehren, Entwurfsentscheidung \"EIN Planungsort\") — sie ist nur falsch beschriftet und zeigt vor dem Klick keinen Preis (E05c). Die ECHTEN Bugs im selben Komplex sind zwei andere, die Codex nicht benannt hat: das angezeigte, aber nie implementierte `buildCost.phases` beim Verbreiter-Aufbau (E05b) und der fehlende `resetDay()` im Befragungs-Pfad (E05d).

NAMENSFRAGE \"Creatoraufbau\": Es gibt im aktiven Spiel KEINE Aktion dieses Namens. Ein Scan aller 143 Aktionen aus actions.json / actions_continued.json / actions_p1c.json / actions_p3_phenomena.json auf \"creator\"/\"influencer\" liefert nur 1.6 \"Netzwerk-Analyse\" und 5.6 \"Eine Reichweite mieten\" (beide nur im Fliesstext). Der einzige Ort, an dem \"Creator\" mit einer Aufbau-Handlung UND einer Phasen-Angabe zusammenfällt, ist der Verbreiter `creator` (\"Content-Creator / Influencer\", carriers.json:8) in der Operations-Akte. Ich habe E05b darauf bezogen; sollte Codex etwas anderes gesehen haben, fällt E05b davon nicht weg (der ungenutzte `phases`-Wert gilt für alle acht Verbreiter), aber die Zuordnung zu Codex' Wortwahl bleibt eine Schlussfolgerung, kein Zitat.

NICHT ABSCHLIESSEND GEKLAERT — bewusst nicht als Befund geführt: (1) Kein Aktions-Datensatz hat überhaupt ein Dauer-/Verzoegerungsfeld (Schlüssel-Union über alle 143 Aktionen: id, phase, disarm_ref, label_de/en, headline_de, narrative_de/en, botschaft_de, costs, effects, prerequisites, unlocks, npc_affinity, legality, tags). Aktionen wirken also ausnahmslos sofort beim Ausspielen. Ob die Spieler-Beobachtung \"unterschiedliche Zeitfolgen\" darüber hinaus noch eine dritte Quelle hat, kann ich nicht ausschliessen. (2) `addToQueue` (useStoryGameState.ts:1369-1377) sucht in `availableActions` und prüft dabei NICHT das Feld `available` — eine gesperrte Aktion (\"Kanal gesperrt\", StoryEngineAdapter.ts:3535) kann angeheftet werden und lässt beim Ausspielen die ganze Queue abbrechen (useStoryGameState.ts:1417-1421). Für die 11.x-Maschen ist das derzeit folgenlos, weil sie ohne prerequisites immer freigeschaltet sind (ActionLoader.ts:153-158); ob eine Plattform-Sperre eine 11.x-Masche im echten Lauf trifft, habe ich nicht durchgespielt und melde es daher nur als Randnotiz. (3) TutorialOverlay.tsx:45-47 behauptet \"Das Spiel läuft über 10 Jahre (120 Phasen). Jede Phase entspricht etwa einem Monat\" — grob falsch (40 Tage, 1 Phase = 1 Tag). Ich fuehre es NICHT als Befund, weil `tutorial.start()` im gesamten Repo nirgends aufgerufen wird (einziger Treffer ist ein Kommentar, StoryModeGame.tsx:642); der Text ist damit unerreichbar. Sollte das Overlay je reaktiviert werden, ist er sofort ein P1.
- **E09 Berater: veraltetes Budget, leere Buttons** — 1) Der Branch-Vergleich ist eindeutig: `git diff origin/main...HEAD -- .../AdvisorDetailModal.tsx` ändert nur den SCHLIESSEN-Button auf paperButtonStyle und ersetzt den Leerzustand-Block durch die Leerzustand-Komponente (9+/17-). Die Label-Ableitung in Zeile 255 (HEAD) bzw. 263 (origin/main) ist zeichengleich, useStoryGameState.ts ist an den relevanten Stellen (525/582/923) auf beiden Ständen identisch. KEINER der vier Befunde ist auf HEAD behoben.\n\n2) Nicht abschliessend geklaert: welche der drei Anzeigen Codex konkret als \"veralteten Budgetstand\" gesehen hat — den k-Betrag in rec.reasoning, den Prozentwert in rec.message, oder beides. Für die Ursachenkette ist das ohne Belang (beide Werte stammen aus demselben, zum Phasenbeginn erzeugten String), für die Reproduktionsanleitung wäre es praeziser. Ich habe keinen Browser benutzt, also ist die Reproduktion aus dem Code hergeleitet, nicht beobachtet.\n\n3) Hypothese, nicht belegt: die toten `ta##_`-Filter in den vier Strategiedateien (IgorAnalysisStrategy.ts:210,220; KatjaAnalysisStrategy.ts:89; AlexeiAnalysisStrategy.ts:276; MarinaAnalysisStrategy.ts:179) laufen mit den heutigen punktierten IDs sicher ins Leere — ich habe verifiziert, dass keine Aktions-ID diese Muster enthält. Was ich NICHT geprüft habe, ist, ob dadurch ganze Empfehlungsmuster (z.B. Igors Tarnfirmen-Chance, Katjas Infiltrations-Rat) nie ausgelöst werden oder nur auf leere Vorschlagslisten fallen. Das ist ein eigener, potenziell größerer Befund und gehört in eine separate Prüfung — ich habe ihn hier bewusst nicht als belegt geführt.\n\n4) Ebenfalls nicht geprüft: ob Tests existieren, die die kaputte Label-Ableitung festschreiben. Ein Fix an AdvisorDetailModal.tsx:255 sollte gegen die Testsuite laufen, bevor er als sicher gilt.
- **E07 Ergebnisdialog verdeckt Reaktionen, leeres TV** — 1) Ich konnte nicht beweisen, WELCHE der belegten Leer-Ursachen Codex tatsächlich vor Augen hatte. Ich habe den Ticker-Fall an einem projekteigenen Screenshot (runs/visual-review/latest/shots/action_feedback.png, 2026-08-23) nachgewiesen; Codex' eigene Sitzung liegt mir nicht vor. Der zweite, ebenfalls am Code belegte Leer-Pfad (deckendes Fallback-Rechteck bei fehlendem Manifest) ist in einer normalen Sitzung unwahrscheinlich, weil die Leiste per Default eingeklappt startet (panelStore.ts:52) und das Manifest laengst geladen ist, bevor jemand B drueckt — ausschliessen kann ich ihn nicht. 2) Die exakte Dauer des leeren Fensters hängt von der Textbreite ab (Schlagzeilenlaenge, VT323 vs. Fallback-Monospace); belegt ist, DASS es existiert und dass es bei jedem Aufklappen neu beginnt, nicht die Sekundenzahl auf zwei Stellen. 3) Ich habe nicht ausgemessen, ob der Ergebnisdialog auch bei sehr kleinen Viewport-Hoehen den Wohnzimmer-Bereich geometrisch schneidet — bei 1280x720 tut er es (belegt), bei sehr flachen Fenstern deckt ihn allein der 85-%-Scrim ab.
- **E10/E11 Lint, Tests, Wartbarkeit** — 1) E10c ("vier ergaenzende Prüfungen rot") bleibt ungeklaert. Codex hat diese Prüfungen nicht eingecheckt — git diff origin/main..HEAD über alle Testdateien zeigt nur die sechs UX-Branch-Tests, keine von Codex. Ohne Testcode, Assertions oder Fehlerausgabe lässt sich weder das geprüften Verhalten rekonstruieren noch entscheiden, ob "rot" einen Produktfehler oder eine falsche Annahme des Reviewers über die Spielregeln bedeutet. Das ist die einzige echte Lücke in dieser Gruppe.

2) Codex' Laufzeitzahl 727 Testfaelle konnte ich nicht exakt reproduzieren, weil laut Auftrag nichts ausgeführt werden durfte. Statisch komme ich auf origin/main auf 722 Treffer für ^\\s*(it|test)(\\.\\w+)?\\s*\\( . Die Differenz von 5 ist durch it.each-Expansion und mehrzeilige Aufrufe zwanglos erklärbar; ich betrachte Codex' Zahl als glaubhaft, aber nicht als von mir bewiesen. Dasselbe gilt für "Build erfolgreich" — nicht ausgeführt, daher nicht bestätigt; belegt ist nur, dass netlify.toml:2 den Build über tsc && vite build führt und ein Typfehler den Deploy stoppen würde.

3) Bei den Schnittkanten in E11 habe ich die Zustandskopplung gemessen (distinkte this.<feld>-Namen je Zeilenbereich), nicht die semantische Verflechtung über Methodenaufrufe hinweg. Für Schnittkante 1 (reine Typen, Kopplung null) ist das ausreichend und beweisend. Für Schnittkante 2 und 3 ist es ein starkes Indiz, aber kein Beweis, dass die Auslagerung verhaltensneutral bleibt — das muesste beim tatsächlichen Umbau durch die Testsuite abgesichert werden.

4) Nicht geprüft habe ich, ob die drei für .eslintrc.cjs vorgeschlagenen extends-Ketten beim ersten Lauf null Verstoesse melden. Sehr wahrscheinlich nicht: bei 66.439 Zeilen src, die noch nie gelintet wurden, und --max-warnings 0 im bestehenden Script ist mit einer erheblichen Zahl an Erstbefunden zu rechnen. Der Fix stellt die Lauffaehigkeit von npm run lint her, nicht sofortige Sauberkeit — das sollte vor der Aufnahme in eine CI (E12) eingeplant werden.
- **E06/E08/E12 Lesbarkeit, Einstieg, Stärken** — 1) Die Kernzahl aus E08 — \"erste Aktion nach etwa 2:05 Minuten\" — ist aus statischem Code nicht nachpruefbar. Belegen konnte ich nur die Struktur dahinter (vier Pflicht-Bildschirme, ~27 s feste, aber abkuerzbare Zeitanteile, 13 gleichzeitig offene Systeme, 88 freigeschaltete Aktionen). Ein Timing-Beleg braucht einen Lauf; ich habe keinen Browser benutzt und keine Zahl geschaetzt.

2) Ebenfalls unbelegt: ob das 1px/3px-Scanline-Raster des Terminals auf HiDPI-Schirmen Moire mit dem Pixelfont bildet. Das ist die plausibelste Erklärung für Codex' \"stoerend\" (der reine Kontrast bleibt mit 7,5:1 unauffaellig), aber sie lässt sich nur am gerenderten Bild prüfen, nicht am Code. Ich fuehre sie als Hypothese, nicht als Ursache.

3) Zur Kontrastrechnung in E06c: Die Werte für die Kork-Grundfarbe #7a5a36 habe ich exakt nachgerechnet (Übereinstimmung mit dem theme.ts-Kommentar von 6,3:1). Der Wert für das \"helle Korkkorn\" beruht auf einem angenommenen Kornton (#d0b088), weil ich die Pixel der Kachel ui_cork_tile nicht ausgelesen habe. Die Richtung des Befunds ist davon unabhängig — die 86%-Deckung kappt die Kachelvarianz in jedem Fall —, der exakte Vorher-Wert (1,02:1 laut theme.ts, 1,16:1 bei meiner Annahme) ist es nicht.

4) Nebenbefund ausserhalb des Auftrags, verifiziert, aber nicht bewertet: FokusgruppeView.tsx ist im ausgelieferten Spiel unerreichbar. setShowFokusgruppe(true) wird nirgends aus der UI aufgerufen — der Setter wird ausschließlich an die Playwright-Ernte durchgereicht (StoryModeGame.tsx:537 innerhalb von publishVqa). Der Raum 'analyse' öffnet stattdessen MaschenVortestView (StoryModeGame.tsx:1072). Identisch auf origin/main (dort Zeile 531). Das berührt die Systemzaehlung in E08a: die Fokusgruppe ist keines der 13 offenen Systeme.

5) Nicht geprüft, weil ausserhalb des Auftrags: ob die 55 Aktionen mit prerequisites im Spielverlauf tatsächlich erreichbar sind, und ob die zwoelf an Tag 1 gesperrten Episoden ihre Schwellen im normalen Verlauf überschreiten.

6) Zu FPS, Mobilgeraeten und Audio habe ich bewusst keine Aussage getroffen — dazu liegt weder im Code noch in den Daten ein Beleg vor.

Der wichtigste offene Punkt ist Codex' Angabe „vier ergänzende Prüfungen rot": Der Testcode
wurde nie eingecheckt und die begleitenden `audit-evidence/`-Dateien existieren im Repository
nicht. Ohne ihn lässt sich nicht feststellen, ob „rot" einen Produktfehler oder einen
fehlerhaften Test bedeutet. Das bleibt bewusst unbeantwortet statt geraten.
