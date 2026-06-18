# Bauplan — Die Spine: StoryDirector + Beat-Queue + Fortschritts-Anzeige

> In-Sitzung mit Owner geformt (2026-06-18). Status: **Konzept/Bauplan**, noch
> nicht baufreigegeben. Schwester-Dokumente: `IDEE_TAG0_HOAX_EXPERIMENT.md`,
> `IDEE_TAGESWECHSEL_BEAT.md` — beide Beats docken hier an.

## These
Die fehlende Sache ist **nicht Inhalt, sondern Koordination**. Das Spiel hat
bereits mehrere „halbe Dirigenten", die nur nicht miteinander reden. Die Spine
ist deshalb **eine Naht, kein neuer Motor** — sie sequenziert und macht sichtbar,
was schon existiert.

## Fund: fünf bereits existierende Regie-Systeme
> Pfade in dieser Tabelle relativ zu `desinformation-network/src/story-mode/`.

| System | Was es heute tut | Datei |
|---|---|---|
| Krisen-System | zustandsgetriggerte Beats am Phasenende (Risiko/Aufmerksamkeit/Aktionszahl) | `engine/CrisisMomentSystem.ts` |
| Berater-Empfehlungen | pro Phase NPC-Ratschläge „tu als Nächstes X" | `engine/NPCAdvisorEngine.ts` |
| Episoden | autorierte Mehr-Akt-Stränge (von NPC angeboten → Korkbrett → `wirkt_auf`) | `data/episodes.json`, `engine/EpisodeLoader.ts` |
| Morgenbriefing | deterministischer „drängendster Tageshinweis" + Büro-Verweis | `components/MorningBriefing.tsx` (`deriveBriefingHint`) |
| Aufträge & Ziele | strategisches Ziel (Keil/Wahl/Zweifel) + Fortschrittswerte | `engine/Auftraege.ts`, `components/MissionPanel.tsx` |

Die einzige Stelle, die heute „wir laufen alle hier durch" sagt, ist
`engine.advancePhase()`, aufgerufen aus `endPhase()`
(`hooks/useStoryGameState.ts:790`). Dort feuern die Checks unkoordiniert
nebeneinander — niemand kürt *den einen* nächsten Beat.

## Die drei Teile — und ihre Andockpunkte
- **① Director** — eine *dünne Auswahl* am Phasenende. Andock: im vorhandenen
  `advancePhase`/`endPhase`-Pfad.
- **② Beat-Queue** — schlichte geordnete Liste „anstehender Beats". Vorläufer
  existieren: `actionQueue` (Sendeplan, Spielerseite) und `activeEpisodes`
  (Korkbrett). Neu nur: eine *Erzähl*-Queue daneben.
- **③ Fortschritts-Anzeige** — existiert bereits: `Objective`/`MissionPanel` +
  Deutungshoheits-Balken (`DayReport.tsx`) + `trustHistory`/`TrustEvolutionChart`.
  Spine sorgt nur, dass jeder Beat sie bewegt und das **Delta sichtbar** wird
  (= Tageswechsel-Entscheidung C).

## Entscheidung ① — Wie viel Maschine: **Dünner Dirigent**
Kein neues Inhaltssystem. Eine kleine Auswahl-Funktion am Phasenende kürt aus den
schon existierenden Quellen den *einen* nächsten Beat und macht ihn an zwei
Stellen sichtbar: **Marinas Vorgriffszeile im Lagebericht** + **nächstes
Morgenbriefing**. Wächst später bruchfrei zu „Drehbuch je Auftrag" oder
„AI-Director" heran. (Verworfen für jetzt: vollausgebautes Drehbuch / Scoring-AI.)

## Entscheidung ② — Auswahl-Regel: **Dringlichkeit + Prise Abwechslung**
```
StoryDirector.pickNext(state):
  1. Krise akut?        -> Krisen-Beat       (Vorfahrt; passt zum heutigen Krisen-Modal)
  2. Episode reif?      -> Episoden-Beat     (autorierter Bogen)
  3. sonst (ruhiger Tag) -> Berater-/Ziel-Stups,
                            ABER bewusst ein anderer Typ als gestern
```
Dringlichkeit wird nie unterdrückt (eine brennende Krise muss raus); der
Anti-Wiederholungs-Tiebreak greift nur auf den ruhigen Tagen → Notfall bleibt
glaubwürdig, Routine-Tage nutzen sich nicht ab (Kur gegen „Tag 3,4,5 immer
dasselbe").

## Entscheidung ③ — Offenheits-Prinzip: **Offene Beats mit Trade-offs**
Gegen die Sorge „Automatisierung → ein richtiger Weg". Kern-Klarstellung: das
sind eigentlich *zwei* Ängste, mit verschiedenen Kuren —
- **(a) Gleichförmigkeit** — immer dieselbe *Abfolge* von Anlässen.
- **(b) Lösungs-Schiene** — pro Anlass nur *eine richtige Antwort*.

Und „Beat" = **Anlass/Bühne**, kein Drehbuch-Stück. Der Director kürt *was
passiert*, nie *was der Spieler tut*. (Der dünne Dirigent aus ① schreibt ohnehin
keine feste Abfolge — er reagiert je Phase neu auf den Zustand; ein fixer Pfad ist
bauartbedingt ausgeschlossen.)

**Primäres, bindendes Prinzip (Kur für b):** Jeder Beat muss **mindestens zwei
nicht-dominierte Antworten** bieten — keine Option ist auf allen Achsen
(Vertrauen / Risiko / Aufmerksamkeit / Ziel) besser als eine andere; jede kostet
*woanders*. Der Berater *empfiehlt* relativ zum aktuellen Ziel
(Keil/Wahl/Zweifel), aber ein anderes Ziel empföhle eine andere Antwort →
„richtig" ist **strategie-relativ**, nicht absolut. Nutzt die vorhandene
Trade-off-Struktur der Aktionen — **kein neues System, eine Autoren-Disziplin**
(testbar: ein Beat ohne ≥2 nicht-dominierte Optionen ist ein Fehler).

**Gestaffelt darüber (später, optional):**
- **2 — Beat-Pool mit Gewichtung** (Kur für a): Director zieht aus einem *Pool*
  passender Beats mit gewichtetem Zufall (Dringlichkeit ↑, jüngst gesehener Typ ↓)
  statt immer den Top-Beat. Billiger, natürlicher Zusatz; zwei ähnliche
  Spielstände driften auseinander.
- **3 — Reaktive Beats** (Originalität): Beats nach Spieler-Vorgeschichte
  parametrisiert (derselbe Anlass spielt anders je nach bisherigem Stil; NPCs
  erinnern sich). Reichste Variante, meiste Autorenarbeit — gezielt dort, wo sie
  sich lohnt.

## Lackmustest ③: Der Stadtrat-Beat (am echten Mechanik-Modell)
Zwei Ebenen im Spiel: **Spieler-Kosten** (`risk` 0–100, `attention` 0–100,
Reichweite/Budget — `StoryEngineAdapter.ts`) und **Gesellschafts-Werte**, die den
Auftrag bewegen (polarisierung/fragmentierung/diskursqualitaet/fraktionsstaerke/
vertrauen/zynismus — `engine/Auftraege.ts`). Auftrags-Signaturen: Keil
(polaris.↑/fragm.↑/diskurs↓) · Wahl (fraktion↑/vertrauen↓/zynismus↑) · Zweifel
(vertrauen↓/zynismus↑/diskurs↓).

**Anlass:** „Der Stadtrat von [Stadt] in **Gallia** (Fokus-Mitgliedsstaat) tagt
morgen über das Reizthema." Der Director setzt nur den Anlass; die Antwort gehört
dem Spieler. (Skala/Geografie gemäß `WELT_ECKPUNKTE_WESTUNION.md` — eine
Stadtrats-Institution sitzt in einer Stadt eines Mitgliedsstaats, nie „in
Westunion".)

| Option | Gesellschafts-Werte | Spieler-Kosten | Reichw. |
|---|---|---|---|
| A — Hetzen (Skandal aufladen) | polaris.↑↑, zynismus↑, diskurs↓ | Aufmerks.↑↑, Risiko↑ | hoch |
| B — Einschleusen (Verfahren delegitimieren) | vertrauen↓, zynismus↑, diskurs↓ | Aufmerks.↓ (leise), Risiko↑ bei Enttarnung, Budget/Zeit | niedrig |
| C — Fraktion stärken | fraktionsstaerke↑↑, polaris.↑ | Aufmerks.↑, Risiko↑ | gezielt |
| D — Laufen lassen (abkühlen) | — (kein Fortschritt) | Aufmerks.↓, Risiko↓ | 0 |

- **Nicht-Dominanz: hält.** Keine Option ist auf allen Achsen beste; jede gewinnt
  woanders (A=Reichweite, B=Tarnung+Zweifel-Trifecta, C=einzige für fraktion, D=
  einzige, die Hitze senkt).
- **Strategie-Relativität: hält.** Keil→A, Wahl→C, Zweifel→B, überhitzt→D. Der
  Berater empfiehlt entlang des *aktiven* Auftrags; andere Aufträge sind von
  anderen Optionen korrekt bedient. „Richtig" ist strategie-relativ.

**Verschärfung von ③ (vom Test gefördert) — testbare Autoren-Checkliste je Beat:**
> **Deckung + kein Universalsieger:** Jede Option muss für *mindestens eine*
> Strategie/Lage die beste sein — und *keine* für alle. Zusätzlich muss die
> Kosten-Achse (Risiko/Aufmerksamkeit) situative Überschreibungen erzeugen (z. B.
> „abkühlen" als Überhitzungs-Ventil). Verhindert nicht nur „eine richtige
> Antwort", sondern auch schleichende *Weich*-Dominanz einer Option über mehrere
> Aufträge.

## Das einzige wirklich Neue
Eine schlanke `StoryDirector`-Funktion (rein, testbar, wie `dayClockStore`/
`CrisisMomentSystem`), die am Ende von `advancePhase()` läuft:
1. liest den Zustand (Risiko/Aufmerksamkeit/Ziel-Fortschritt/aktive Episoden/
   letzter Beat-Typ),
2. `pickNext()` nach der Regel oben,
3. legt den Beat in die **Beat-Queue** und liefert die **Vorgriffszeile**
   (Marina) für `DayReport` + den Aufhänger fürs nächste `MorningBriefing`.

Minimaler Beat-Datentyp (Vorschlag): `{ id, typ: 'krise'|'episode'|'stups',
quelleId, vorgriffZeile_de, fortschrittHook? }`.

## Wie die zwei geformten Beats einrasten
- **Tag-0-Hoax** = der vom Director gesetzte **Eröffnungs-Beat (Tag 1)**, erster
  Queue-Eintrag (gescriptet, vor der Auftragswahl).
- **Tageswechsel** = der Director *läuft* bei `endPhase`, kürt den nächsten Beat
  und liefert Marinas Haken („Morgen tagt der Stadtrat…") + das Delta. Aus „ich
  setze die Zeile von Hand" wird „der Director setzt sie." → genau die
  „in wenigen Schritten automatisiert"-Frage, beantwortet.

## Offene Implementierungsfragen (falls gebaut)
- Wo lebt die Beat-Queue — eigener `directorStore` (zustand) oder im Engine-State
  (Save/Load-relevant, vgl. `saveState`/`loadState`)?
- „Episode reif" — Kriterium: angebotene/aktive Episode mit erfüllten Auslösern?
  (`getOfferableEpisodes` liefert schon Kandidaten.)
- Wie wird „letzter Beat-Typ" persistiert (für den Anti-Wiederholungs-Tiebreak)?
- Soll der Krisen-Beat den bestehenden `CrisisModal`-Pfad nutzen (ja — nicht
  duplizieren), und der Director nur die *Reihenfolge/Sichtbarkeit* steuern?

## Wiederverwendet vs. neu
- **Wiederverwendet:** `advancePhase`/`endPhase`, `CrisisMomentSystem`,
  `NPCAdvisorEngine`, `EpisodeLoader`/`episodes.json`, `MorningBriefing`,
  `DayReport`, `Objective`/`MissionPanel`, `trustHistory`.
- **Neu (klein):** `StoryDirector.pickNext()` + Beat-Datentyp + Beat-Queue
  (Liste) + „letzter Beat-Typ"-Merker. Keine neuen Inhaltssysteme.
