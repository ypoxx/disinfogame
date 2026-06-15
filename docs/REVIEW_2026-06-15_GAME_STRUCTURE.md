# 🎮 Review-Report B — Spielstruktur (nach PR #77–#83)

**Stand:** 2026-06-15 · **Branch:** `claude/eager-curie-2m5kej` · **Methode:** 4 orchestrierte Agenten
(B1–B4, Opus) mit Webrecherche, disjunkter Scope, Befunde mit `file:line`. Maßnahmen:
[`TODO_2026-06-15_CENTRAL.md`](TODO_2026-06-15_CENTRAL.md).

## Kurzfazit
Das narrative **Rückgrat ist stark** (Episoden, Reports, Endings, Headlines = erzählerisch erstklassig) und
**überraschend kohärent** (Episode→Tafel→Broadcast→Report-Kette trägt, Welt konsequent fiktionalisiert,
„Verlieren unmöglich" ist geheilt). Aber drei strukturelle Dinge halten das Paket von „exzellent" zurück:
1. **Das Herzstück zahlt nicht aus** — Episoden schließen im echten Spiel nie ab; das reiche EndingSystem ist
   toter Code; der Siegweg ist über alle Aufträge identisch. → wenig strategische Replay-Varianz.
2. **Zwei-Geschwindigkeiten-Qualität** — die 2026er-Texte sind 1A, die **Altlasten** (NPC-Ambient/Topics) ziehen
   das Niveau hörbar runter und widersprechen den Stimm-Steckbriefen; reale-Symbol-Reste leaken sichtbar.
3. **Schlüsselsysteme sind kaum erschließbar** — Society-Werte/Auftrag fast unsichtbar, P2-Schlachtfeld
   unauffindbar, eine entkoppelte Legacy-„Encyclopedia" konkurriert mit dem echten Bildungskern.

> **Direkt verifiziert (zwei Agenten widersprachen sich):**
> - **`completeEpisode()` wird live NIE aufgerufen** (definiert `StoryEngineAdapter.ts:3626`, Caller nur in
>   `EpisodeSystem.test.ts`). → Episoden aktivieren & füllen sich, **lösen sich aber nie auf**; `wirkt_auf`
>   + End-Report-Lernmoment feuern nicht. (B4 bestätigt; B3 hatte nur die vorhandene Render-Verdrahtung gesehen.)
> - **Das reiche 8×7-`EndingSystem` ist toter Code** — `checkGameEnding`/`evaluateEnding` haben **keine Caller**;
>   live läuft nur das 4-Typ-`checkGameEnd` (4× in `useStoryGameState.ts`). `assembleAuftragEnding` ist dagegen
>   verdrahtet (Auftrags-Enden funktionieren).

---

## B1 — Wege zu Sieg/Niederlage & Wiederspielwert

**Inventar (mechanisch verschieden vs. Text-Reskin):**
- **Live: 1 echter Sieg** (`obj_destabilize` Vertrauen<40, 3 Phasen halten, `risk<85`) + **2 echte Niederlagen**
  (Enttarnung `risk≥85`, Timeout Phase 120). `escape`/`moral_redemption` haben so enge Gates, dass sie praktisch nie zünden.
- **9 „Auftrags-Enden" = Text-Reskin** (3 Aufträge × 3 Tonalitäten; nur Titel/Epilog, keine eigene Mathematik).
- **Das 8-Kategorien×7-Tonalitäten-EndingSystem ist nicht angeschlossen** (s. Verifikation oben) — genau das
  System, das echte Varianz brächte, ist tot.
- Varianzquellen real vorhanden: 10 Episoden, 6 Phänomen-Familien/18 Aktionen, 80 World-Events, 24 Konsequenzen, 7 Verteidiger-Akteure.

**„Verlieren unmöglich" — geheilt** ✅: Trust-Regeneration durch Verteidiger, gesenkter Risiko-Abbau, `REQUIRED_HOLD_PHASES=3`,
Enttarnung schlägt ungesicherten Sieg. `balance-sim-p2.test.ts:168` **pinnt** `wins>0 && defeats>0` (dok. 19/17).

**Phasen-Spannung (ehrlich):** **früh flach** (keine Verteidiger, ungebremste Erosion) · **Mitte stark** (Wettrennen,
Operationen verbrennen) · **spät zwiespältig** (Spät-Leerlauf nach gesichertem Halten; 120-Phasen-Decke sehr großzügig).

**Replay-Urteil:** mittlere **taktische** Varianz (Seed/Strategie/Episoden), aber **niedrige strategische
Ziel-Varianz** — man gewinnt/verliert „immer auf dieselbe Art". Größter Replay-Killer: **invariante Win-Condition**.

**Empfehlungen (Webrecherche: Sid Meier „interesting decisions" · emergente state-getriebene Enden · Frostpunk-Fail-States):**
1. **[Hoch, klein] Rich-EndingSystem verdrahten** — bei Spielende `evaluateEnding()` aufrufen → 4 Strings werden
   8×7 state-getriebene Enden (Code existiert `:5830/:5905`).
2. **[Hoch, mittel] Auftrags-Signatur zur echten Win-Condition** — Keil→Polarisierung, Wahl→Fraktionsstärke,
   Zweifel→Zynismus statt universell Vertrauen<40. Macht die 3 Aufträge mechanisch distinkt (Daten existieren in `Auftraege.ts`).
3. **[Hoch, mittel] Zusätzliche Niederlagen aus vorhandenen Bilanzen** — `npcsBetray≥3` und Budget-Pleite sind in
   `EndingSystem.shouldGameEnd:833/836` **schon definiert**, aber im Live-`checkGameEnd` ungenutzt → eigene Verlustpfade.
4. **[Mittel]** Escape/Redemption-Gates lockern oder als Spielerentscheidung; Früh-Phase mit garantierter erster
   Verteidiger-Welle; Spät-Leerlauf durch eskalierende Endwelle entschärfen.

---

## B2 — Erzählerische Qualität: **Zwei-Geschwindigkeiten**

| Strang | Note | Kern |
|---|---|---|
| Headlines (143×) | **1** | Konkret-bildhaft, kein „Aktion durchgeführt"-Rest. Vorbildlich. |
| Episoden (`episodes.json`) | **1** | Namen, Schauplätze, NPC-Stimme, trockener Witz — die „Wirbelsäule" trägt. |
| Reports/Endings (`EndReport`, `EndingSystem`, `PollNews`, `Gegenseite`) | **1** | Stärkstes Schreiben im Projekt; „show don't tell", saubere Sprachhygiene. |
| NPC-Begrüßungen/Reaktionen | **2−** | Handwerklich stark, in Stimme — aber distinkt nur Direktor/Marina. |
| **NPC-Ambient** (`dialogues.json`) | **5** | **Größter Mangel.** Rollenrutsch + Anglizismen + reale Bezüge. |
| **Topics** (`topics_dialogues.json`) | **4** | Behörden-Floskeln, Prozent-Listen, Copy-Paste-Schablonen, ASCII-Umlaute. |

**Schwerster Befund — systematischer Rollenrutsch** (Steckbrief ↔ Ambient): **Alexei** (Soll: paranoider Techniker)
spielt den alten „Volkov"-Chaos-Troll (`dialogues.json:1106,1208`, IDs `vol_*`); **Katja** (Soll: lakonische
Feld-Operateurin) eine Kreativ-Autorin (`:1459,1489`); **Igor** (Soll: Finanz) einen Hacker (`:1808,1850,1880`);
**Marinas** Ambient ist die alte Daten-Analystin (`:793,861`). Nur der **Direktor** ist durchgängig distinkt.
Plus **15 Anglizismen** im Ambient (Verbot `NPC_VOICE_PROFILES.md:12`).

**Empfehlung:** Ambient-Listen (~100 Zeilen) + Topics als **dedizierte Schreib-Welle** gegen die aktuellen
Steckbriefe neu, mit „Side-by-side-Test" als Gate (Zufallszeilen ohne Namen müssen zuordenbar sein). Headlines/Episoden/Reports **nicht anfassen** — sie sind der Maßstab.

---

## B3 — Erzählerische Kohärenz: **Rückgrat hält, wenige lokalisierbare Risse**

**Strang-Tracings ✅:** Episode `ep_bruecke` (Marina-Angebot↔`lage_de`-Figur stimmen für **10/10** Episoden) →
Korkbrett → **Broadcast-Schlagzeile aus aktiver Episode** (`useAudienceBroadcast.ts:66` — **ist verdrahtet**,
STATUS listet es fälschlich als „offen") → Fokusgruppe-★ → End-Report-Lernmoment-Render. Auftrag „Keil"
(Signatur↔`PollNews`-Leitinstrument↔`assembleAuftragEnding`) schließt sauber. Operation-Kette label-konsistent.

**Risse (spürbar):**
- 🟡 **Advisor empfiehlt nicht-existente Aktionen** — `DirektorAnalysisStrategy.ts:346,395,409` liefert
  `ta02_server_network`, `ta08_all_in` … die es im Katalog **nicht gibt**; landen als klickbare Buttons im
  player-sichtbaren `AdvisorDetailModal:245` → **toter Klick**. Fix: auf `getAvailableActions()` umstellen.
- 🟡 **„Genosse" player-sichtbar** (`TutorialOverlay.tsx:219`, `DirektorAnalysisStrategy.ts:353`) — Verbotsliste.
- 🟡 **Operation umgeht `broadcastMapping.ts`** (Sub-Audit): `playOperation` baut Broadcast/News von Hand;
  Tag `operation` fehlt in `THEMES_BY_TAG`, `targeting` injiziert das unpassende Publikums-Thema `abstiegs_angst`.
- 🟡 **End-Report „Mögliche Spielenden"**: Bedingungstexte ≠ echte Trigger (`EndReport.tsx:705`; `collapse` real
  = `armsRaceLevel≥5`, `stalemate`/`pyrrhic` werden nie erzeugt).

**Reale-Symbol-Audit (widerlegt STATUS-V10 „0 player-sichtbare reale Bezüge"):** spielersichtbar **Stalin**
(`dialogues.json:434`), **„Amerikaner"** als Gegner (`:428`), **„Rubel"** (5 Stellen, **durch Test festgezurrt**
`PlatinumDialogSystem.test.ts:229`), **NATO** (`world-events:370`), **Gelbe Westen** (`world-events:233`), **Genosse** (2×).
`allegory`-Metadaten mit echten Ländernamen in `world-events.json:12` (code-intern, **nicht gerendert** → niedrige Prio).
**Westunion-Welt sonst konsistent** (139×, Gegenseite „Ostland"/„Zentrale"). **Owner-Urteil:** russisch-codierte
NPC-Namen (Volkov/Petrova…) gewollt (fiktiver Ost-Block) oder fiktionalisieren?

**Tote ID-Altlasten (relativieren „volkov-Orphan vollständig weg"):** `npcs.json` `enhancedActions` (9 tote `ta##`-Refs,
nie effekt-seitig gelesen), `alexei.portrait:"volkov"` (Feld ungenutzt), `StoryNarrativeGenerator` `volkov`-Block (0 Caller),
55 `vol_*`-Dialog-IDs. **IdValidator-Blindstellen:** prüft `enhancedActions` und Advisor-`suggestedActions` **nicht**.

---

## B4 — Erschließbarkeit, Emergenz & Sinn: die 4 „macht noch keinen Sinn"-Befunde

Der diegetische Einstieg (Title → AvatarChoice → Ankunft → Direktor → Büro-①②③) ist **gut & lesbar**. Aber:

**5 Onboarding-Hürden:** (1) **Auftrags-Wahl zu früh/kontextlos** (sofort nach Direktor, bevor man je eine
Aktion/„Polarisierung" erlebt hat, `StoryModeGame.tsx:700`); (2) **„GESELLSCHAFT"-Leiste default unsichtbar**
(nur HUD via Taste H); (3) **Shortcuts (A/N/S/P/M/E/B/I/H/F) nirgends erklärt**; (4) **Operations-Akte versteckt**;
(5) **zwei widersprüchliche Bildungs-Systeme** (Taste-I-Encyclopedia legacy vs. Atlas).

**„Macht noch keinen Sinn"-Liste (priorisiert):**
- **P1 — Episoden schließen nie ab** (verifiziert, s. o.) → die dramatische Wendung hat keinen Zahltag.
  Fix: im Hook nach jeder Aktion prüfen, ob alle `einklink_aktionen` einer aktiven Episode gespielt sind →
  `engine.completeEpisode(id)` + Abschluss-Beat.
- **P2 — P2-Schlachtfeld unauffindbar** — `deriveBriefingHint` (`MorningBriefing.tsx:94`) kennt die
  Operationszentrale nie. Fix: Pflicht-Episode/Direktor-Hinweis „Etage 4" + Briefing-Pointer.
- **P3 — Encyclopedia (Taste I) ist Pro-Mode-Legacy** (englisch, Web-Look, `taxonomy.json`, ohne Spielwirkung) —
  auf `DisinfoMethodAtlas` umstellen oder entfernen.
- **P4 — Lagebild zeigt das Herzstück nicht** (`LagebildView.tsx:17` — keine Society-Werte/Auftrag). Fix: Society-Strip
  + Auftrags-Fortschritt ins Lagebild (der verlässliche diegetische Ort).
- P5 Auftrags-Wahl kontextualisieren · P6 `unlocksRoom/unlocksNpc` totes Schema-Feld · P7 `TutorialOverlay` toter+veralteter Code.

**Räume-Audit:** **kein Raum ohne Funktion** (alle 10 verdrahtet). Einzige Lücke: `operations` ist erreichbar,
aber **nicht erschließbar** (Auffindbarkeit, nicht Verdrahtung).

**Emergenz:** **echt** an einer Stelle — Aktion→Society-Werte→nicht-lineare Phasen-Formel→Poll/Barometer→Fokusgruppe→
Gegenseite→tonal differenziertes Ende (glaubwürdiger Echo-Kreis). **Isoliert/abgeschnitten:** Episoden (Rückkopplung
fehlt, weil Abschluss nie feuert), Broadcast (bewusst nur Spiegel), ComboHints/P2 (kein gezeigter Zusammenhang).

> **Doku-Hygiene:** `docs/DAY_ONE_WALKTHROUGH.md` und Teile von `HIDDEN_TREASURES.md` beschreiben ein **veraltetes**
> Design (Inbox/E-Mail/OfficeScreen/„Volkov") — als veraltet markieren oder aktualisieren.

---

## Kreuz-Validierungen & korrigierte Doc-Behauptungen
| Behauptung im Bestand | Befund |
|---|---|
| STATUS: „241→0 Emojis / 37→0 Schatten" | **überzogen** (A1: headline_de-Emojis, TitleScreen, AdvisorPanel-Leerstellen) |
| STATUS V10: „player-sichtbar 0 reale Bezüge" | **widerlegt** (B2/B3: Stalin/Amerikaner/Genosse/Rubel/NATO/Gelbe Westen) |
| STATUS P6: „Broadcast-Schlagzeile aus Episode offen" | **bereits verdrahtet** (`useAudienceBroadcast.ts:66`) |
| STATUS: adaptive Musik/Ducking/Ambience „geliefert #81" vs. Backlog „nicht gebaut" | **Widerspruch → Preview verifizieren** |
| STATUS: „volkov-Orphan vollständig entfernt" | **relativiert** (tote enhancedActions/Portrait/Reaktions-Block/IDs bleiben) |
| Episoden im Spiel wirksam | **nein** — `completeEpisode` nie live aufgerufen |
| Reiches EndingSystem als Inhalt | **nein** — toter Code |
</content>
