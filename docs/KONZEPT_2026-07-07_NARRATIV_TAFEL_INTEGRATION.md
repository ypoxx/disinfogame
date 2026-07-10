# 🧵 KONZEPT — Die Narrativ-Tafel wird wahr

**Status:** ✅ Abgenommen (Owner 2026-07-07, F-A–F-D entschieden — §11) · **T1–T4 umgesetzt**
(2026-07-08, dieser Branch; offen: Asset-/SFX-Paket mit Budget-Ansage + Harvest-Vision-Review + L8-Playtest) · **Datum:** 2026-07-07
**Scope:** Story · **Setzt auf:** `ZIELBILD_2026-07-04_WETTRENNEN.md` (kanonisch) ·
`PLAN_2026-07-06_UI_LUXUS.md` (§4.1 „Terminal WÄHLT, Korkbrett PLANT", Etappe L3 offen) ·
`KONZEPT_2026-06-14_HERZSTUECK_EPISODEN_WERTE.md` (§3.4, §14 F7=A) · `BAUPLAN_2026-06-14_HERZSTUECK.md` (P4).
**Anlass (Owner, 2026-07-07):** *„Ich verstehe die Narrativ-Tafel immer noch nicht"* → nicht löschen,
sondern klären: Design · Zeit · Ästhetik · Bedienung · Einbettung (Konzept, Dialoge, Elemente).

---

## 1. Diagnose in einem Absatz (Code-verifiziert)

Die Tafel ist mechanisch das **Plan- und Sende-UI** des Spiels (Anheften=`addToQueue`, Lösen, SOFORT,
AUSSPIELEN=`executeQueue`, LEEREN — `StoryModeGame.tsx:1323-1339`), aber ihr **namensgebender Teil ist
Kulisse**: Die Spuren A/B/C verteilen die flache Queue per `index % slots` (`NarrativeBoard.tsx:114-122`),
die Spur-Wahl erreicht die Engine nie (`onPin` übergibt nur die actionId, `:63`), der Strang-Fortschritt
wird berechnet, aber nicht gerendert (`BoardThread.progress` ungenutzt), Episoden-Fäden zeigen den
Füllwert „läuft ab in 99 Phasen" (`StoryModeGame.tsx:1307`), `narrativeSlots` wird nie übergeben
(faktisch immer 2), und der Spielertext enthält das interne Kürzel „(K40)" (`NarrativeBoard.tsx:322`).
Das echte Narrativ-System (Episoden: NPC-Angebot → `activateEpisode` → `einklink_aktionen` →
`completeEpisode` → `wirkt_auf`) läuft an der Tafel vorbei — sie zeigt es nur als Textzeile. Genau
daraus entstand der dokumentierte IA-Bruch („zwei Aktionsflächen … die teuerste Einzel-Unklarheit",
`REVIEW_2026-06-20_EPISODEN_AKTIONEN.md:135-147`). **Der Owner-Eindruck ist also kein Leseproblem,
sondern der Befund.**

## 2. Leitidee

> **Die Tafel beantwortet beim Öffnen in fünf Sekunden drei Fragen:
> „Woran arbeite ich?" (Stränge) · „Wie weit bin ich?" (Fortschritt) · „Was sende ich heute?" (Plan).**

Nicht die Fassade abreißen, sondern das Versprechen einlösen, das seit F7=A / BAUPLAN P4 beschlossen
und nie gebaut wurde: **Spuren = aktive Episoden-Stränge, Karten zahlen sichtbar auf ihren Strang ein.**
Die Tafel wird dadurch vom „zweiten Aktionskatalog mit Korkoptik" zum **Kampagnen-Planer des Rennens**
(Zielbild: Sonntagsfrage ↔ Abwehr) — der Ort, an dem aus Einzelmaßnahmen eine Geschichte wird.

Rollenteilung (bereits bindend beschlossen, §4.1 UI-Luxus): **Terminal WÄHLT (Taste A) · Tafel PLANT
& SPIELT AUS · Akte MISST (MissionPanel: Ist/Ziel/Tendenz je Achse).** Dieses Konzept macht die
mittlere Rolle wahr.

---

## 3. Design (Mechanik)

### 3.1 Spur = Strang (der Kern)
- Jede **aktive Episode** bekommt eine **echte Spur** mit Kopf: Episodentitel, **Wendung** (`wendung_de`
  — die Dilemma-Frage, heute nach dem Dialog nirgends nachlesbar), Fortschritt (siehe 3.3), Akt-Bezug (4.2).
- **Zuordnung ist Daten, keine Rotation:** Eine angeheftete Karte hängt an der Spur ihrer Episode, wenn
  ihre `actionId` in `ep.einklink_aktionen` steht (Mapping existiert: `episodes.json` + `completedActions`,
  `useStoryGameState.ts:1200-1208`). Alles andere hängt an der Spur **„TAGESGESCHÄFT"** (ehrlicher Name
  statt leerer SPUR-Buchstaben). Kein neues Engine-Feld nötig — die Zuordnung ist ableitbar.
- Die Buchstaben-Spuren A/B/C entfallen als tragende Metapher; „Spur" heißt ab jetzt: *ein laufender Strang*.

### 3.2 Das Strang-Limit wird echt (B6: ≤3 Narrative)
- Heute begrenzt nur die UI-Kosmetik; `activateEpisode` hat keinen Cap (`StoryEngineAdapter.ts:4101-4109`).
  Neu: **Engine-Cap = aktive Stränge ≤ Slots (Start 2, max 3).**
- Ist das Brett voll, wird das NPC-Episoden-Angebot zur **Entscheidung**: annehmen = einen laufenden
  Strang **abhängen** (er verfällt ohne `wirkt_auf`-Auszahlung; Karte wandert als grauer Stummel in die
  Ablage) — oder ablehnen (Episode bleibt im Angebot-Pool, solange ihr Auslöser gilt). Das erzeugt genau
  die „Interesting Decision", die dem Brett fehlt: **Fokus ist eine Ressource.**
- **Slot 3:** nicht mehr „Gebäude-Wachstum (K40)" (nie gebaut, Dev-Kürzel im Spielertext), sondern
  diegetisch ans Rennen gekoppelt: **die Zentrale genehmigt die dritte Spur mit Akt 3** („Die Wahl
  kippen") oder per Geld-Tranche bei gutem Fortschritt (Finanzen.ts, E18). → Owner-Frage F-B.

### 3.3 Fortschritt sichtbar — als Objekte, nicht als Balken (E6)
- Strang-Fortschritt = gespielte `einklink_aktionen` (wird heute berechnet und weggeworfen,
  `StoryModeGame.tsx:1299-1308`). Anzeige als **abgestempelte Kartenstummel** auf der Spur:
  je gespielter Einklink-Aktion ein Stummel mit „VOLLZOGEN."-Stempel, offene als leere Pin-Löcher.
  Zählbar wie das Wohnzimmer-Alphabet — kein Prozentbalken.
- Strang komplett → Abschluss-Moment auf der Tafel (Faden wird durchtrennt, Spur-Kopf bekommt
  Abschluss-Stempel), zusätzlich zur bestehenden News „Strang ausgespielt" (`useStoryGameState.ts:1190-1229`).

### 3.4 Rote Fäden = nur echte Verfallsdaten
- Combo-/Gelegenheitsfenster behalten ihren Countdown („läuft ab in N Tagen", Puls bei ≤1).
- Episoden-Stränge zeigen **keinen** Pseudo-Countdown mehr (Füllwert 99 entfällt); Dringlichkeit
  entsteht nur aus echten Fristen (Akt-Ende, Wahltag-Nähe, Fenster).
- Das schwebende `ComboHintsWidget` geht als **Zettel auf der Tafel** auf (bereits L3-Plan; V6 zu).

### 3.5 Planen gegen das Rennen
- Kopfleiste der Tafel zeigt die zwei Läufer minimal (Sonntagsfrage % mit Zielstrich · ABWEHR-Stufe)
  plus „Tag X — Wahl in Y Tagen": Der Plan wird **gegen die Uhr und den Gegner** komponiert, nicht im Vakuum.
- Angeheftete Karten tragen die **FRISCH/BEKANNT/VERBRANNT**-Stempel (MaschenGedaechtnis, existiert auf
  der Terminal-Karte): Die Tafel warnt VOR dem Ausspielen, wenn der Tagesplan in abgestumpfte Milieus
  funkt (E7 „nie Ressourcen in Verpufftes").

### 3.6 Was die Tafel abgibt
- **Das Karten-Deck (≈88–100 Maßnahmen) verlässt die Tafel** — der IA-Bruch wird endgültig geschlossen.
  Wählen ist Terminal-Sache (M2-Kuratierung: 3–8 anlassbezogen, Katalog im ARCHIV). Auf der Tafel bleibt
  ein Sprung: **„MASSNAHMEN WÄHLEN → TERMINAL (A)"**.
- Der `unavailableReason`-Tooltip (heute nur auf der Tafel, `NarrativeBoard.tsx:450`) zieht auf die
  Terminal-Karte um, damit die Information nicht verloren geht.
- Das freie `ActionQueueWidget` schrumpft zum **Mini-Chip „N angeheftet"**, der die Tafel öffnet —
  EIN Planungsort (§4.1), keine dritte Queue-Verwaltung.

---

## 4. Zeit (Tagesrhythmus & Kampagnen-Dramaturgie)

### 4.1 Der Tag (Routine trägt, Lucas-Pope-Prinzip)
1. **Morgen:** Briefing-Mappe (L6). Der Director kündigt reife Episoden an („Ein Strang reift heran…",
   existiert: `StoryDirector.ts:92-99`) → der Weg führt **zur Tafel** (Nordstern sagt es schon:
   „09:20 Narrativ-Tafel im Büro", `GESAMTKONZEPT_VISUELL.md:59`).
2. **Planen:** Tafel öffnen (Hotspot/T), Stränge sichten, am Terminal wählen (A), anheften, Plan-Kosten
   gegen Budget/AP prüfen, **AUSSPIELEN ▸**.
3. **Tag läuft:** Broadcast zeigt Sendungen (Strang-Aktionen tragen den Episodentitel, existiert:
   `useAudienceBroadcast.ts:65-75`); Störungen (Krise/Beat) unterbrechen die Routine.
4. **Abend:** **DayReport bekommt eine Strang-Zeile** („Grenzstadt-Gerücht: 2/3 — noch eine Sendung") —
   der Fortschritt, der heute NIRGENDS erscheint, schließt den Tages-Loop.

### 4.2 Die Kampagne (40 Tage, drei Akte)
- Die Akt-Dramaturgie des Zielbilds (Akt 1 „Keil" · Akt 2 „Zweifel" · Akt 3 „Wahl kippen", §8) bekommt
  ihren **sichtbaren Ort auf der Tafel**: ein Kraftband-Reiter über den Spuren („AKT 2 — DEN ZWEIFEL
  SÄEN") und ein dezenter Akt-Vermerk am Strang-Kopf, welchem Akt die Episode dient. Damit beantwortet
  die Tafel die Mittelspiel-Frage „Was mache ich JETZT?" (Zielbild §8).
- **Sonntagsfrage-Zettel:** „Nächste Sonntagsfrage in N Tagen" hängt als Notiz an der Tafel —
  der Wochen-Spannungsbogen wird zum Planungshorizont („schaffe ich den Strang vor der Umfrage?").
- Abhängigkeit ernst nehmen: Die **Episoden-Re-Kuratierung auf die 40-Tage-Taktung** ist offener
  Carry-forward (Zielbild Etappe 2/5) — ohne früh feuernde Episoden bleibt die beste Tafel leer.
  Die Terminal-Kuratierung entschärft das Inventar-Problem bereits (Strang-Aktionen Rang 0,
  `terminalCuration.ts:38-52`), die Trigger-Taktung gehört aber in die Content-Etappe.

---

## 5. Ästhetik (Stil-Lock „Behörden-Akte", v3 §4.7)

- **Strang-Kopf = Karteireiter/Aktenzunge** am Kork: Titel gestempelt, die Wendung als
  handschriftliche Randnotiz (Papier + Tinte, kein Web-Chip).
- **Echte rote Fäden:** dünne Faden-Linien von der Pin-Nadel jeder Karte zum Strang-Kopf
  (SVG-Overlay zwischen den Pin-Positionen) — die Detektiv-Korkwand, die die Metapher verspricht.
  `prefers-reduced-motion`: Fäden statisch, kein Puls.
- **Fortschritt als Material:** abgestempelte Stummel + leere Pin-Löcher (3.3) statt Balken;
  Abschluss = Faden-Schnitt + Stempel (Ein Moment, kein Toast).
- **L3-Paket wie geplant:** Anheft-/Abnehm-Animation, Papier-/Pin-SFX (existieren), Faden-Riss-Sound
  bei verfallenem Fenster (L7-SFX-Batch); ComboHints als Zettel.
- **Texthygiene (M4):** „(K40)" und „99 Phasen" verschwinden aus Spielertexten; Beschriftungen
  diegetisch („Sendeplan — was heute auf Sendung geht").
- Assets über `pixel-asset-pipeline` (Kork-Kachel, Faden, Reiter, Stummel) mit Budget-Ansage,
  CSS-Fallback pflicht (Arbeitsregel).

---

## 6. Bedienung

- **Ein Verb-Set pro Fläche** (Kessler/Boateng-Reviews): Terminal = wählen/ausführen · Tafel =
  planen/ausspielen · Akte = messen. Kein Katalog mehr auf der Tafel (3.6).
- **Hotkey `T`** (frei; belegt sind a/n/s/p/m/e/b/i/h/?, `StoryModeGame.tsx:657-683`) öffnet die
  Tafel — Overlay-Stack-Regel wie beim Terminal (nicht unter anderem Vollbild mounten). Esc-Muster
  bleibt (Capture + stopImmediatePropagation, E33).
- **Tastatur vollständig** (E33, existiert teilweise): Spur fokussieren ↑/↓, Karte fokussieren ←/→,
  Enter = Lösen/Details, A = Sprung ins Terminal, Enter dort = anheften (landet automatisch auf der
  richtigen Strang-Spur — die Zuordnung ist ja Daten, 3.1).
- **Drag & Drop bleibt Zusatz-Geste**, nicht Pflicht (kein „verkleidetes Dropdown"): Ziehen einer
  Tagesgeschäft-Karte auf einen Strang ist nur erlaubt, wenn die Aktion dort einzahlt — sonst
  federt sie zurück (Regel sichtbar machen statt stiller Kosmetik).
- **AUSSPIELEN ▸** bleibt der eine Sende-Knopf (prefix-genaue Budget-Prüfung bleibt,
  `isQueueBudgetFeasible`); Fußzeile zeigt Budget/AP **und Kapazität** (heute fehlt AP im
  Deck-Mapping, `StoryModeGame.tsx:1287` — Bugfix nebenbei).

---

## 7. Einbettung (Gesamtkonzept · Dialoge · Elemente)

| Element | Verknüpfung mit der Tafel |
|---|---|
| **Dialoge/NPCs** | Angebot → Annahme → „liegt jetzt als Strang auf dem Korkbrett" (existiert, `useStoryGameState.ts:689-717`). NEU: Brett voll → Dilemma-Dialog (3.2); NPC-Nebensätze zu stockenden Spuren („Die Grenzstadt wartet, Direktor — Spur 2 stockt."); Condition-Vars (`activeEpisode`, Strang-Fortschritt) fürs Dialog-System (KONZEPT §7). |
| **Terminal (L2)** | WÄHLT; Strang-Aktionen Rang 0 + „● STRANG"-Stempel (existiert). NEU: Stempel nennt den Episodentitel statt anonym „STRANG". Berater-Sprung landet weiter im Terminal. |
| **Broadcast/TV** | Sendungen tragen Episodentitel (existiert); Strang-Abschluss = TV-Moment. Owner-Priorität „Broadcast voll diegetisch" (STATUS) zahlt direkt ein: Die Tafel plant, der Fernseher zeigt die Folgen. |
| **Wahlkampf-Akte (MissionPanel)** | misst Achsen (Min-Regel, Zielbild §3); die Tafel zeigt nur das primäre Ziel als Kopf-Notiz + Verweis „Akte (M)". Keine Doppel-Messung. |
| **MaschenGedaechtnis** | FRISCH/BEKANNT/VERBRANNT auf angehefteten Karten (3.5) — Planqualität vor dem Senden. |
| **Fokusgruppe** | bekommt Episoden-Titel (existiert); Personas kommentieren künftig die Episode ihres Milieus (KONZEPT §7 — unverändert gültig). |
| **Finanzen (E18)** | Slot-3-Genehmigung als Tranchen-Belohnung möglich (Owner-Frage F-B). |
| **Tutorial (Tag-0-Hoax)** | Der Testballon endet an der Tafel: erste Karte anheften, AUSSPIELEN, erster Abwehr-Tick — „Sehen Sie den zweiten Balken?" Das Zwei-Balken-Tutorial (Zielbild §10) bekommt seinen dritten Beat: das Brett. |

## 8. Woran bisher niemand gedacht hat (Checkliste)

1. **Onboarding-Reihenfolge:** Tutorial-Marker „② Tafel planen" existiert (`PlayerOfficeView.tsx:98-102`),
   aber die Führung endet heute nicht im Anheft-Ritual → in L8/Tag-0 einbauen (7., letzte Zeile).
2. **Save/Load:** Strang-Zuordnung ist ableitbar (keine Migration); der Engine-Cap (3.2) braucht
   einen Save-Guard (mehr aktive Episoden im Altstand → älteste bleiben, Rest zurück in den Pool;
   Save-Version additiv).
3. **Sim-Gate:** Der Cap ist eine Mechanik-Änderung → `winnable-and-losable`-Gate + `balance-sim-p2`
   vorher/nachher; Episoden-Auszahlung `wirkt_auf` bleibt unangetastet (R2-Disziplin).
4. **Redundanz-Abbau messbar machen:** Nach Umbau existiert KEINE Fläche mehr mit zweitem
   Aktionskatalog; Queue-Verwaltung nur Tafel + Mini-Chip. (Persona-B-Frage „zwei Listen — warum?"
   muss im Playtest sterben.)
5. **Accessibility:** Tastatur-Vollpfad (6.), reduced-motion, Kontraste nach Palette v3.1.
6. **Doppel-Review-Kontrakt (§3b a)** gilt: Code adversarial + Harvest-Vision je Etappe.
7. **Akzeptanzkriterium (Playtest, L8):** Neuer Spieler beantwortet nach dem ersten Öffnen in
   ≤10 Sekunden: „Woran arbeite ich? Wie weit? Was sende ich heute?" — sonst nicht abgenommen.
8. **Bekannte Kleinfehler mitheilen:** ungenutztes `progress`, `expiresIn:99`, fehlendes
   `narrativeSlots`-Prop, AP fehlt im Kosten-Mapping (`StoryModeGame.tsx:1287`), „(K40)"-Text.

## 9. Etappen (jede: Gate `tsc·vitest·build` grün + Doppel-Review)

| Etappe | Inhalt | Engine? |
|---|---|---|
| **T1 — Wahrmachen** | Spur=Strang-Rendering + Tagesgeschäft-Spur (Zuordnung via `einklink_aktionen`), Fortschritt-Stummel, Deck raus + Terminal-Sprung, Füllwerte/K40 raus, Hotkey T, DayReport-Strangzeile | Nein (nur UI/Adapter-Mapping) |
| **T2 — L3-Luxus** | Karten/Reiter/Fäden-Optik, Anheft-Animation, ComboZettel, Queue-Widget→Mini-Chip, SFX, Assets (Budget-Ansage) | Nein |
| **T3 — Fokus-Mechanik** | Engine-Cap ≤ Slots, „Strang abhängen", Voll-Brett-Dialog, Slot-3-Freischaltung (F-B), Save-Guard, Sim-Beleg | **Ja (klein, simuliert)** |
| **T4 — Vertiefung (optional)** | Akt-Reiter/Sonntagsfrage-Zettel, NPC-Nebensätze/Condition-Vars, Fokusgruppen-Reaktion je Episode | teils |

Reihenfolge-Empfehlung im Gesamtplan: T1 ist klein und heilt das Verständnis-Problem sofort; T2 = die
beschlossene L3-Etappe; T3/T4 nach der Broadcast-Priorität (STATUS) bzw. mit der Episoden-Re-Kuratierung.

## 10. Risiko-Register

| # | Risiko | Gegenmittel |
|---|---|---|
| R1 | Cap frustriert (Episode „weg") | Abgelehnte/abgehängte Episoden bleiben im Pool, solange Auslöser gilt; Dialog sagt das explizit |
| R2 | Leere Tafel früh im Spiel (Episoden-Taktung) | Tagesgeschäft-Spur trägt immer; Re-Kuratierung als benannte Abhängigkeit (4.2) |
| R3 | Faden-Overlay wird visuell laut | Max 1 Faden je Karte, ruhige Farbe, reduced-motion; Harvest-Review als Gate |
| R4 | Sim kippt durch Cap | Cap gilt nur der Annahme, nicht der Auszahlung; Sim-Bänder vorher/nachher |
| R5 | Noch ein Ort für Ziele (Doppel-Messung) | Tafel zeigt nur primäres Ziel + Verweis auf die Akte (7.) |

## 11. Owner-Fragen — ✅ ENTSCHIEDEN (Owner-Transkript 2026-07-07)

- **F-A — Deck-Auszug: Katalog komplett raus** (Empfehlung angenommen; Owner tendierte zur
  Mini-Leiste). Begründung der Empfehlung: Eine Mini-Leiste wäre die DRITTE kuratierte Aktions-
  Liste (Terminal-Tür zeigt schon 3–8) und öffnet den IA-Bruch erneut; der Terminal-Sprung
  (Taste A/Knopf) fängt den Mehr-Klick ab; die Entscheidung ist asymmetrisch reversibel —
  Leiste später hinzufügen ist billig, wegnehmen wäre ein Bruch. **Rückfalloption:** Zeigt der
  Playtest (L8), dass der Sprung nervt, kommt eine „Heutige Empfehlung"-Leiste nach.
- **F-B — Slot 3: über Akt 3** („Die Wahl kippen"), diegetisch als Genehmigung der Zentrale —
  kein Gebäude-Wachstum (K40 bleibt ungebaut). Umsetzung in T3.
- **F-C — KEIN Framing-Bonus.** Die Spur-Zuordnung bleibt ehrliche Organisation (Daten),
  keine Zusatz-Mechanik.
- **F-D — Queue-Widget ersetzt:** Mini-Chip „N angeheftet" (öffnet die Tafel); das Widget
  liegt in `archive/story-mode-drafts/`.

## 12. Definition of Done

Die Tafel ist fertig, wenn (a) jede sichtbare Information dort wahr ist (keine kosmetischen Spuren,
keine Füllwerte), (b) sie der EINZIGE Planungs-/Sendeort ist und keinen Katalog mehr führt, (c) ein
Strang vom NPC-Angebot bis zum Abschluss-Stempel ohne Doc-Wissen lesbar ist (Playtest-Kriterium 8.7),
(d) DayReport/Briefing den Strang-Stand spiegeln, und (e) Gates + Sim-Belege + Doppel-Review grün sind.
