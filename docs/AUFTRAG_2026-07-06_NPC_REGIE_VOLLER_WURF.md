# 🎯 AUFTRAG 2026-07-06 — NPC-Berater-Regie („voller Wurf")

> **Status:** Owner-Entscheid, **bindend** (Chat 2026-07-06: „Ich möchte den vollen Wurf.").
> **Art:** Aktualisierter **Arbeitsauftrag** (nicht das Spiel-`Auftrag`-System keil/wahl/zweifel — das heißt hier *Mission*).
> **Scope:** Story Mode · **Ebene:** Entscheidungs-/Berater-Architektur → Dialog-Regie → Qualitäts-Review
> **Baut auf:** `BAUPLAN_STORY_DIRECTOR_SPINE.md` (2026-06-18, Koordination) — dieser Auftrag ist die
> **nächste Achse daneben**: nicht *welcher Beat feuert*, sondern *wie der NPC die Aktions-Entscheidung
> als geführtes, konkurrierendes, reaktives Angebot spricht*.
> **Verhältnis zur Wahrheit:** ergänzt `VISION_LOCK.md` (dort als Amendment verlinkt). Bei Widerspruch
> gewinnt weiterhin **Code/Daten**.

> ✅ **UMSETZUNGSSTAND 2026-07-07 (erster Wurf gebaut, Tests grün):** R0–R6 sind als lauffähiger
> erster Durchstich implementiert — `engine/BeraterRegie.ts` (Angebot, 3-Takt-Bestätigung,
> `audienceFit` R3, `renderWettstreit`/`renderUebergangen`), `data/formulierungsbank.json` (5 Stimmen),
> Verdrahtung in `hooks/useStoryGameState.ts` (betonierter Satz ersetzt, `label_de` statt `headline_de`,
> R2-Wettstreit + R4-Übergangen), Grammatik-Fixes (Taler/Talern, „1 … Operationen", Bindestrich-Kaskade,
> ASCII-Umlaute) und das Review-Harness `scripts/dialogue-review/lint.mjs` (`npm run dialogue-review`).
> Typecheck + Build + 636 Story-Tests grün. **Offene Folgeschritte** unten in §12.

---

## 0. Die essenziellen Owner-Gedanken (das, was „erinnert" werden muss)

Damit spätere Sessions den *Geist* treffen, nicht nur die Mechanik — hier die Kernsätze des Owners,
sinngemäß aus dem Gespräch 2026-07-06:

1. **„Die Dialoge sollen intelligenter *führen*."** Reines Zusammenklicken von Aktionen ist schwer und
   passt nicht zum Story-Prinzip. Der Spieler soll **erzählerisch geführt** werden.
2. **„Aber keine versteckten Tutorials — sondern *erzählerische Aktionsangebote*."** Der NPC bietet aus
   der Geschichte heraus an, er erklärt nicht die Bedienung.
3. **„Jeder NPC steht für eine *Funktion* im Spiel."** Die Stimme *ist* die Funktion (Medien, Technik,
   Feld, Finanzen, Leitung).
4. **„Frage ich alle NPCs, sind das *konkurrierende Angebote* — und da wird das Spiel spannender."**
5. **„Noch geiler: NPCs *reagieren auf meine Entscheidungen mit anderen NPCs*."** Daraus entstehen
   **Lerneffekte**.
6. **„Nur weil sie überzeugend sind, ist es nicht richtig. Ich bin als Spieler wieder gefordert."**
   ⇒ **Der didaktische Kern.** Überzeugungskraft ≠ Wahrheit — genau die Lektion eines Desinfo-Spiels,
   auf den Spieler selbst angewandt.
7. **„Es geht nicht nur um die Dialoge."** Es ist eine **Architektur**; Dialog ist ihre Oberfläche.
8. **KI-Haltung:** Ein LLM pro Spielzug ist nicht leistbar. ⇒ KI gehört ins **Schreiben (offline)**,
   nicht ins **Spielen (Laufzeit)**.

**Wunsch-Ablauf des Owners (wörtlich als Zielbild):**
> NPC: „Du willst also ein Dossier anlegen? Ich habe da einige Optionen." → *Spieler wählt* → NPC:
> „Gut, ich lege für Frau Müller ein Dossier an; wenn das fertig ist, dann können wir [X] machen."

Also: **Aufschlag → Wahl → substanzielle, vorausweisende Bestätigung in der Stimme der Figur.**

---

## 1. Was sich im Prinzip ändert

**Von** einem flachen Aktions-Menü mit generischer, betonierter Bestätigung
**zu** einem **NPC-Berater-Wettstreit**: zuständige Figuren bieten ihre Aktionen erzählerisch an,
konkurrieren um knappe Ressourcen, reagieren aufeinander — und der Spieler lernt, **überzeugende
Rhetorik von richtiger Entscheidung zu trennen**.

Das ist **kein neues Inhaltssystem**, sondern eine **Bindeschicht + Stimme** über bereits Vorhandenem.

---

## 2. Ist-Stand — belegt (nichts davon muss neu erfunden werden)

> Pfade relativ zu `desinformation-network/src/story-mode/` · Belege verifiziert 2026-07-06.

| Baustein (existiert) | Wo | Was er heute tut |
|---|---|---|
| **Koordinations-Spine** | `engine/StoryDirector.ts`, `stores/directorStore.ts`, `engine/DecisionBeats.ts` (+ Tests) | kürt am Phasenende den *einen* nächsten Beat (Bauplan 2026-06-18, gebaut) |
| **NPC-Berater-Engine** | `engine/NPCAdvisorEngine.ts:64` `generateRecommendations()` | jeder NPC **analysiert unabhängig** und erzeugt priorisierte Empfehlungen → **konkurrierende Angebote sind Substrat!** |
| **Pro-NPC-Funktionslogik** | `engine/strategies/{Marina,Alexei,Katja,Direktor,Igor}AnalysisStrategy.ts` | „NPC = Funktion = eigener Korb" ist bereits Code |
| **Aktion↔NPC** | `data/actions*.json` `npc_affinity` (~143 Aktionen: Marina 52 · Alexei 26 · Katja 25 · Direktor 23 · Igor 10) | jede Aktion hat eine zuständige Figur |
| **Mission↔Aktion** | `data/episodes.json` `auftrag` (keil/wahl/zweifel/…) + `einklink_aktionen` | welche Aktionen einer Mission dienen — **Owners „Auftrag mit Aktionen verbinden" ist hier schon angelegt** |
| **Mission-Modell** | `engine/Auftraege.ts` (`AuftragId = keil\|wahl\|zweifel`) + Fortschritt | strategisches Ziel + Verdikt |
| **Ziel↔Person↔Verwundbarkeit** | `data/targets.json` (6 fiktive Personen, je Milieu + `vulnerabilities`) | die „Frau Müller" aus dem Wunsch-Ablauf |
| **Publikum & Wahrheits-Check** | `data/audience.json` (8 Milieus), `data/personas.json` (~30, `receptivity` zu hope/fear/anger/trust), `components/FokusgruppePreTest.tsx` | **kann einen überzeugenden Pitch mechanisch widerlegen** |
| **Dialog-Regie-Substrat** | `engine/DialogLoader.ts` (Topics, Progressive Disclosure, `resolveInserts`) | Verzweigung existiert für Themen |

**Fazit:** Alle Knoten liegen da — **unverbunden**. Deshalb wurde „mehrmals dran gearbeitet, ohne den
Haken dran zu kriegen": jeder Durchgang hat einen *Knoten* ergänzt, keiner die **Spine, die spricht**.

### Der konkrete Bruch, der alles sichtbar macht
`hooks/useStoryGameState.ts:674–678`: Wählt der Spieler im Dialog eine Aktion, wird ein **fester** Satz
gebaut:
```
const headline = action.headline_de || action.label_de;   // ← nimmt die ERGEBNIS-Schlagzeile zuerst
text: `Gut. „${headline}" liegt jetzt auf dem Sendeplan. An der Narrativ-Tafel ordnen Sie die Maßnahme ein und spielen sie aus.`
```
Vier Fehler in einem Satz, exemplarisch für das ganze Problem:
1. **Tempus-Widerspruch:** `headline_de` ist Perfekt („Akteur-Dossier **angelegt**" = erledigt), der
   Rahmen sagt „liegt **jetzt** … **spielen sie aus**" (geplant). Erledigt *und* geplant zugleich.
   → Richtig wäre `label_de` („Akteur-Dossier **erstellen**").
2. **UI mit NPC-Gesicht:** identischer Satz für jede Figur & jede Aktion — bricht „Eine Stimme, eine
   Welt" (`QUALITAETSMERKMALE.md` Merkmal 4).
3. **Erklärbär + Dev-Vokabular:** „Narrativ-Tafel", „Maßnahme … ausspielen" erklären die Bedien-Möbel
   (Verbotslisten-Verstoß).
4. **Kein Kontext:** kein Ziel, keine Wirkung, keine Freischaltung — obwohl alles in den Daten steht.

---

## 3. Die Spine (aus vorhandenen Feldern)

```
MISSION (Auftraege.ts: keil/wahl/zweifel)
  │  episodes.json → einklink_aktionen
  ▼
AKTIONEN (actions*.json: costs · effects · unlocks)
  │  ├─ npc_affinity ─────────►  ZUSTÄNDIGER NPC  → dessen AnalysisStrategy erzeugt das Angebot
  │  └─ targeting_specific ──►  ZIELPERSON (targets.json) → vulnerabilities
  ▼
WIRKUNG AUFS PUBLIKUM  audience.json (8 Milieus) ←→ personas.json (receptivity)
                        FokusgruppePreTest = Gegen-Check zur Rhetorik
```
Der gesuchte Join ist klein: **„Nimm die `einklink_aktionen` der aktuellen Mission → gruppiere nach
`npc_affinity` → jede Figur bietet ihren Korb erzählerisch an."**

---

## 4. Die drei tragenden Prinzipien

1. **NPC = Funktion = eigener Aktions-Korb.** Marina verkauft Reichweite, Alexei warnt vor Spuren,
   Igor rechnet, Katja liefert Feld, Volkov drückt auf Ergebnis. Die Stimme *ist* die Funktion.
2. **Konkurrierende Angebote um knappe Ressourcen.** Wer alle fragt, erlebt einen Wettstreit um
   Budget/Kapazität/Risiko/Aufmerksamkeit — echte, nicht-dominierte Wahl (Merkmal 3).
3. **Überzeugend ≠ richtig (didaktischer Kern, mechanisch wahr).** Marina ist per Design die beste
   Verkäuferin. Ihr glattester Pitch muss **manchmal die falsche Wahl** sein — sonst ist die Lektion
   nur Flavour. Der **Fokusgruppen-Pre-Test** ist das Werkzeug, das einen Pitch widerlegt
   („klingt super, aber die *besorgte Mitte* reagiert auf `anger` mit +0,1 — verpufft"). Da beißt der
   Lerneffekt: der Spieler wird gefordert, Rhetorik zu prüfen statt zu folgen.

---

## 5. Der volle Wurf — die fünf Bausteine (Owner-Entscheid B)

| # | Baustein | Kern | Neu / vorhanden |
|---|---|---|---|
| **B1** | **Angebots-Objekt + Regisseur** | Ein `Angebot` = `{NPC, Aktion, Ziel?, Wirkung, Freischaltung, Kosten, Persona-Stimme}`; ein regelbasierter Regisseur baut daraus den **3-Takt-Dialog**. Ersetzt die betonierte Bestätigung (`useStoryGameState.ts:674`). | Regisseur neu; Felder vorhanden |
| **B2** | **Konkurrierende Angebote** | Mehrere NPCs bieten gleichzeitig aus ihren Körben; Auswahl kostet Ressourcen der anderen. Nutzt `NPCAdvisorEngine` + `npc_affinity` + `einklink_aktionen`. | Verdrahtung + Wettstreit-UI |
| **B3** | **Reaktive Schicht** | NPCs kommentieren, **wen du bevorzugt/übergangen hast** (Rivalität, Groll, Ermutigung). Andockt an `relationship`/`morale`/Betrayal. | Signal „wer wurde begünstigt" + Reaktions-Beats |
| **B4** | **Wahrheits-Check gegen Rhetorik** | Der überzeugendste Pitch wird gegen `FokusgruppePreTest`/`personas.receptivity` geprüft; die *Korrektheit* eines Angebots ist **unabhängig von seiner Überzeugungskraft**. | Kopplung Pitch↔Pre-Test |
| **B5** | **Autoren-Zeit-KI (Formulierungsbank)** | LLM erzeugt **offline, einmalig** pro NPC × Slot × Aktions-Familie geprüfte Formulierungen → in Daten eingebacken. Laufzeit bleibt deterministisch. | neue Offline-Pipeline (analog Asset-Pipeline) |

---

## 6. Die drei Ebenen — und wo das „Review" bleibt

| Ebene | Was | Diese Ebene ist … |
|---|---|---|
| **Berater-/Entscheidungs-Architektur** | B1–B4: Angebot, Wettstreit, Reaktivität, Wahrheits-Check | **das Herzstück (neu zu binden)** |
| **Dialog-Regie** | die 3-Takt-Stimme der Architektur (Slots aus Feldern), B5-Formulierungsbank | Bau + Autoren-KI |
| **Dialog-Luxus-Review** | Qualitäts-Gate (Grammatik, Persona-Treue, EN, Verbotsliste) über Regie-Vorlagen **und** den ~886 Bestandszeilen | **das Abnahme-Gate, hinten** |

**Merksatz:** Das Review zuerst zu machen hieße, Sätze zu polieren, die **strukturell nicht führen
können** — Chrom auf einem Auto ohne Lenkung. Reihenfolge: **Architektur → Regie → Review.**

---

## 7. KI-Entscheidung (bindend)

- **Kein** Laufzeit-LLM als Basis (Kosten/Latenz/Offline). **Kein** kleines lokales Modell (kein
  verlässliches in-character Deutsch, Bundle-Größe unrealistisch).
- **KI = Autorenwerkzeug:** starkes Modell erzeugt **offline** die Formulierungsbank → **eingebacken**
  in Daten → Laufzeit = deterministischer Regisseur (LLM-Qualität, 0 Laufzeitkosten, testbar, offline).
- **Optional/später:** Laufzeit-LLM nur als Opt-in „Director's Cut" für Spieler mit eigenem Key — nie
  als Voraussetzung.

---

## 8. Etappen (jede: Gate grün = Doppel-Review + Merkmale + Verbotsliste)

| Etappe | Inhalt | Stand (2026-07-07) |
|---|---|---|
| **R0 — Naht sichtbar machen** | `Angebot`-Typ + Regisseur, Feldtausch `label_de` statt `headline_de` | ✅ gebaut |
| **R1 — 3-Takt-Regie (B1)** | substanzielle Bestätigung (Ziel/Wirkung/Freischaltung) in NPC-Stimme; Möbel-Vokabular raus | ✅ gebaut (Bestätigungs-Takt; Aufschlag-Takt = Begrüßung+Angebote, vorhanden) |
| **R2 — Konkurrierende Angebote (B2)** | NPC-Körbe je `npc_affinity`; Wettstreit-Spitze wenn Rivalen Angebote haben | ⚙️ v1: Wettstreit-Zeile verdrahtet · **offen:** Sammel-Auswahl mehrerer Körbe nebeneinander (heute: pro NPC-Besuch) |
| **R3 — Wahrheits-Check (B4)** | `audienceFit` (Aktion→Appell→personas-Rezeptivität) getrennt von `rhetorik` | ⚙️ v1: mechanische Trennung gebaut+getestet · **offen:** Sichtbarmachung in der Entscheidungs-UI + Kopplung an FokusgruppePreTest |
| **R4 — Reaktive Schicht (B3)** | übergangene NPCs reagieren beim nächsten Besuch | ⚙️ v1: In-Session verdrahtet · **offen:** Persistenz (Save/Load + BetrayalSystem-Grievance `ignored`), begünstigt-Reaktion, back_to_npc-Pfad |
| **R5 — Autoren-KI-Bank (B5)** | `data/formulierungsbank.json` (5 Stimmen × Slots), Laufzeit deterministisch | ⚙️ v1 handverfasst nach Steckbrief · **offen:** Offline-LLM-Erweiterung (mehr Varianten, EN-Parität), Ziel-Bindung (`{ziel}`) |
| **R6 — Dialog-Luxus-Review** | Harness `scripts/dialogue-review/` + Baseline + Mechanik-Fixes | ✅ Harness+Fixes gebaut · **offen:** Persona-/EN-Review der 886 Bestandszeilen, `tone` vervollständigen, Debatten-ASCII-Umlaut-Sweep, Vertonungs-Freigabe (D24) |

*(Feinausplanung je Etappe bei Baubeginn — dieser Auftrag ist die Richtungs- und Prinzipien-Wahrheit,
nicht der Bauplan jeder Zeile. „✅ gebaut" = erster Durchstich lauffähig+getestet, nicht „fertig poliert".)*

---

## 9. Abnahme-Gates (gelten für jede Etappe)

- **Doppel-Review-Kontrakt** (wie `PLAN_2026-07-06_UI_LUXUS.md` §3b): Implementierungs-Review
  (adversariales Code-Review des Diffs) **und** Domänen-Review (Persona-/Sprach-Treue, adversarial
  verifiziert) müssen **beide** grün sein.
- **Qualitätsmerkmale** (`QUALITAETSMERKMALE.md`): v. a. Merkmal 3 (echte Entscheidung) & Merkmal 4
  (eine Stimme, eine Welt).
- **Verbotsliste** (`NPC_VOICE_PROFILES.md`): keine Emoji/Anglizismen-Soße/Behörden-Floskeln/
  Erklärbär/Dev-Artefakte; „Sie"-Anrede lebendig.
- **Didaktik-Guard:** In jeder Etappe, die Angebote betrifft, muss die *Korrektheit* eines Angebots
  von seiner *Überzeugungskraft* trennbar bleiben (sonst B4 verletzt).

---

## 10. Referenz-Beispiele (aus echten Daten gebaut)

**3-Takt (Aktion 1.4 „Akteur-Dossier erstellen", `npc_affinity: katja`, `unlocks: 8.7` „Person
erpressen", Ziel z. B. Dr. Lena Ferro mit `reveals_weaknesses`):**
> **Katja:** „Ein Dossier über Ferro? Kann ich. Gebt mir zwei Tage."
> *(Spieler wählt)*
> **Katja:** „Gut — ich leg das Dossier über **Dr. Ferro** an. Ist es fertig, kennen wir ihre **wunden
> Punkte**. Dann steht uns die **Erpressung** offen. Ihre Entscheidung, ob wir so weit gehen."

**Konkurrierendes Angebot (dieselbe Mission, andere Funktion):**
> **Marina:** „Vergessen Sie das Dossier — zu langsam. Ich dreh Ferro in drei Tagen durch einen Trend
> das Wort im Mund um. Reichweite schlägt Aktenlage."
> **Igor:** „Marinas Trend kostet zwölf und ist gemietet. Katjas Dossier kostet vier und bleibt uns.
> Rechnen Sie selbst."

**Wahrheits-Check (B4) widerspricht der Rhetorik:**
> *(Marinas Pitch klingt am besten — der Pre-Test zeigt: Ferros Milieu `wu_idealistin` reagiert auf
> `anger` negativ. Der überzeugende Weg verpufft. Der Spieler ist gefordert.)*

**Reaktiv (B3):**
> *(Spieler nimmt wiederholt Marina statt Igor.)* **Igor:** „Sie hören auf die Lauteste im Raum. Merken
> Sie sich, wer am Ende die Zahlen erklärt."

---

## 11. Auffindbarkeit

- Verlinkt aus `VISION_LOCK.md` (Amendment 2026-07-06), `ROADMAP.md` (Track B) und `START_HERE.md`.
- Suchbegriffe für spätere Sessions: *Berater-Regie · NPC-Angebot · konkurrierende Angebote ·
  überzeugend ≠ richtig · Autoren-Zeit-KI · voller Wurf · 3-Takt-Dialog.*

---

## 12. Offene Folgeschritte (Stand 2026-07-07) & Parallel-Session-Hinweis

**Gebaute Dateien (erster Durchstich):** `engine/BeraterRegie.ts`, `data/formulierungsbank.json`,
`scripts/dialogue-review/lint.mjs` (+README), `__tests__/BeraterRegie.test.ts`; geändert:
`hooks/useStoryGameState.ts`, `data/topics_dialogues.json`, `data/insert_library.json`,
`__tests__/ActionFromDialog.test.ts`, `package.json`.

**Bewusst als Folgeschritt offen (nicht in diesem ersten Wurf):**
1. **R4-Persistenz:** `passedOverRef` ist In-Session (React-Ref). Für Save/Load muss das Ereignis
   in die Engine-Save-Schicht (`saveState`/`loadState`) — dort ist auch der `BetrayalSystem`-Zustand
   noch **nicht** eingehängt (bekannte Lücke); die vorhandene, aber nie erzeugte Grievance
   `type:'ignored'` ist der saubere Andockpunkt. Ebenso offen: die **begünstigt**-Reaktion.
2. **R2-Sammel-Auswahl:** heute stichelt der besuchte NPC gegen Rivalen; die eigentliche
   *Nebeneinander*-Auswahl mehrerer NPC-Körbe (eine Entscheidungs-Oberfläche) fehlt noch. Die
   vorhandenen `debates` in `topics_dialogues.json` (alexei↔marina, igor↔katja, direktor↔marina)
   sind das autorierte Substrat dafür — noch nicht an die Regie angeschlossen.
3. **R3-Sichtbarkeit:** `audienceFit` ist berechnet und getestet, aber noch nicht in der UI/Entscheidung
   sichtbar; Kopplung an `FokusgruppePreTest` (Aktion→Appell→Milieu) fehlt (Aktionen haben heute keine
   feste Appell-Zuordnung — nur tags-Heuristik).
4. **R6-Rest:** Persona-/EN-Review der ~886 Bestandszeilen, `tone` vervollständigen/verwerfen,
   **Debatten-ASCII-Umlaut-Sweep** (`nuetzt`/`staerker`/`Opportunitaeten` — bewusst NICHT angefasst,
   s. u.), dann Vertonungs-Freigabe (D24).
5. **Ziel-Bindung `{ziel}`:** die Bestätigung nennt heute nur dann ein Ziel, wenn eines übergeben wird;
   die Ziel-Auswahl (`targets.json` ↔ Aktion mit `targeting_specific`) ist noch nicht an die Regie geführt.

> ⚠️ **Parallel-Session-Hinweis (Owner 2026-07-07):** Dieser Umbau berührt `useStoryGameState.ts`
> und `topics_dialogues.json` — Dateien, an denen andere Sessions arbeiten könnten. Die **Debatten**
> (`topics_dialogues.json` §debates) wurden BEWUSST nur minimal angefasst (ein `waere`-Fix), um
> Konflikte zu vermeiden. Wenn sich eine parallele Session hier „verhakt": zuerst diesen Auftrag +
> `HANDOFF_2026-07-07_NPC_REGIE.md` lesen, dann `git`-seitig zusammenführen (die Regie liegt gekapselt
> in `engine/BeraterRegie.ts` + `data/formulierungsbank.json` — der Hook-Eingriff ist klein und lokal).
