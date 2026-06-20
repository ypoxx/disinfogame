# Beat-Muster-Katalog — der Baukasten (Synthese von 6 Beats)

> In-Sitzung mit Owner geformt (2026-06-18). Status: **kanonischer Baukasten**.
> Bündelt die sechs in dieser Sitzung geformten **Entscheidungs-Beats** zu einem
> wiederverwendbaren Werkzeugkasten für **Skalierung** (Autoren-Template +
> Qualitäts-Gate + Lückenkarte). Andock-Dokumente: `BAUPLAN_STORY_DIRECTOR_SPINE.md`
> (Spine/Director), `WELT_ECKPUNKTE_WESTUNION.md` (Diegese), `IDEE_BEAT_*.md` (Quellen).
>
> **Abgrenzung:** Hier geht es um *Entscheidungs-Beats* (litmus-tragend: ein
> aufgeladener Entscheid mit nicht-dominierten Optionen). *Struktur-Beats*
> (`IDEE_TAG0_HOAX_EXPERIMENT.md`, `IDEE_TAGESWECHSEL_BEAT.md`) sind eine eigene
> Klasse (Onboarding/Rahmung) und nicht Gegenstand dieses Katalogs.

---

## Teil A — Der Katalog (6 Entscheidungs-Beats)

| # | Name | Region | Leitspannung | Kosten-Achse | Options-Form | Ausgangs-Form | Quelle |
|---|---|---|---|---|---|---|---|
| 1 | **Stadtrat** | offensiv, geplant | *welche* Antwort? | Lautstärke / Aufmerksamkeit | 4 Hebel (Hetzen/Einschleusen/Fraktion/Abkühlen) | deterministisch (Werte-Deltas) | Spine §Lackmustest |
| 2 | **Reale Vorlage** | offensiv, emergent | *ob/wie* ausnutzen? | Authentizität / Widerlegbarkeit | aufgreifen / veredeln / meiden | det. + Backfire-Risiko | `IDEE_BEAT_REALE_VORLAGE.md` |
| 3 | **Schwelbrand** | offensiv, Mehr-Tage | *wann* aufhören? | Dauer / Gier (akkumuliert) | weiter anfachen / ernten / löschen | Eskalations-Kurve | `IDEE_BEAT_SCHWELBRAND.md` |
| 4 | **Loyalitätsprobe** | intern (nach innen) | eigene *Leute* managen? | interne Loyalität / Sicherheit | einbinden / kaltstellen / verbrennen / vertrauen | det. + Leck-Risiko | `IDEE_BEAT_LOYALITAETSPROBE.md` |
| 5 | **Nebel** | epistemisch | *wie viel* wetten? | verborgene Information / Varianz | voll / sondieren / hedgen / auslassen | **stochastisch** (verdeckte Verteilung) | `IDEE_BEAT_NEBEL.md` |
| 6 | **Bumerang** | zeitlich / Vergangenheit | *recyceln oder begraben*? | Narrativ-Lebenszyklus / Verfall | recyceln / mutieren / mainstreamen / begraben | Wiederzündung/Verpuffen/Rückschlag (Streisand) | `IDEE_BEAT_BUMERANG.md` |

**Befund:** Sechs Beats, sechs *disjunkte* Kosten-Achsen und sechs verschiedene
Leitfragen. Die Vielfalt sitzt in der Geometrie — ein Dirigent, der hieraus zieht,
*kann* nicht in „einen richtigen Weg" kollabieren.

---

## Teil B — Die Beat-Grammatik (Autoren-Template für #7…#N)

Das Wiederholbare, aus allen sechs extrahiert. **Jeder** neue Entscheidungs-Beat
besteht aus diesen Teilen:

1. **Anlass/Bühne** — *was passiert*, vom Director gesetzt; nie *was der Spieler
   tut*. Nennt seine **Ebene** (Union/Staat/Stadt — `WELT_ECKPUNKTE_WESTUNION.md`).
2. **≥ 3 nicht-dominierte Optionen** — keine Option ist auf allen Achsen (Vertrauen
   / Risiko / Aufmerksamkeit / Ziel) beste; jede kostet *woanders*.
3. **Kosten-Währung** — die *eine* Achse, gegen die der Beat primär abwägt (Spalte
   „Kosten-Achse" oben). Neue Beats sollen eine **noch nicht belegte** Währung
   bevorzugen (siehe Lückenkarte, Teil D).
4. **Ausgangs-Form** — deterministisch (Werte-Deltas) · mit Backfire-Risiko ·
   akkumulierend · **stochastisch** (verdeckte Verteilung). Variieren erhöht das
   Spielgefühl.
5. **Relativitäts-Achse** — *woran* sich „richtig" misst (Teil C.1): Auftrag /
   operative Lage / Spielgeschichte. **Muss benannt sein.**
6. **Andockung** — an Gesellschafts-Werte (`Auftraege.ts`), Spieler-Kosten
   (`StoryEngineAdapter.ts`) und/oder Zustand. Kein neues System pro Beat.

### Qualitäts-Gate (testbare Checkliste — jeder Beat muss bestehen)
> Aus der ③-Verschärfung des Spine (`BAUPLAN_STORY_DIRECTOR_SPINE.md`):
> - **Deckung:** Jede Option ist für *mindestens eine* Strategie/Lage die beste.
> - **Kein Universalsieger:** *Keine* Option ist für alle die beste.
> - **Situative Überschreibung:** Die Kosten-Achse erzeugt Ventile (z. B.
>   „abkühlen" bei Überhitzung), die Auftrags-Empfehlungen lageabhängig kippen.
> - **Keine Weich-Dominanz:** Keine Option schleicht sich über *mehrere* Aufträge
>   als „meist beste" ein.
> Ein Beat, der diese Checkliste nicht besteht, ist ein **Fehler**, kein Beat.

### Minimaler Daten-Typ (Skalierung in Daten, erweitert den Spine-Vorschlag)
```
Beat {
  id, name_de,
  region,                      // offensiv|intern|epistemisch|zeitlich
  ebene,                       // union|staat|stadt|transnational
  leitspannung_de,
  kostenAchse,                 // die abgewogene Währung
  relativitaetsAchse,          // auftrag|lage|geschichte
  ausgangsForm,                // det|backfire|akkumulierend|stochastisch
  optionen: [{ id, label_de, werteDelta, spielerKosten, ausgang }],  // >= 3, nicht-dominiert
  andockung,                   // referenzierte Werte/Zustände
}
```

---

## Teil C — Die drei kanonisierten Befunde

### C.1 Die Relativitäts-Achse wandert (verfeinert ③)
③ (kein universell bester Zug) hält über **alle** Beats — aber *woran* sich
„richtig" misst, verschiebt sich je Region:

| Achse | Bedeutung | Beats |
|---|---|---|
| **Auftrag** | richtig = relativ zu Keil/Wahl/Zweifel | 1, 2, 3 |
| **operative Lage** | richtig = relativ zu Ressourcen / Risiko-Appetit / Wert der Assets | 4, 5 |
| **Spielgeschichte** | richtig = relativ zu akkumuliertem Zustand (Inokulation, frühere Saat) | 6 |

→ Kanonisiert auch im Spine (`BAUPLAN_STORY_DIRECTOR_SPINE.md`, §Befunde).

### C.2 Die Gegenseite ist ein langsames Immunsystem (kein Konter)
Enttarnung/Backfire ist real meist *keine* Katastrophe, sondern eine **kleine
Bremse** + Treibstoff für langsame **gesellschaftliche Resilienz** (Aufklärung,
Regulierung, Faktenchecks). **Verfeinerung:** Resilienz *dämpft* in der Regel, kann
aber selten paradox *verstärken* (Streisand — vgl. Biolabs-Recherche in
`IDEE_BEAT_BUMERANG.md`). → Kanonisiert in `WELT_ECKPUNKTE_WESTUNION.md`.

### C.3 Der Dirigent braucht ein Gedächtnis
Beat 6 macht **vergangenen Spielzustand** zum First-Class-Input (welche Narrative
liefen wie oft → Inokulations-Stand). Das geht über den ursprünglich „dünnen"
Dirigenten hinaus und ist der konkrete Treiber für **Schicht 3 (reaktive Beats)**
des Spine. → Kanonisiert im Spine (§Befunde).

---

## Teil D — Achsen-Deckungskarte & offene Lücken (Skalierungs-Landkarte)

Damit Beat #7+ **Lücken füllen** statt zu duplizieren:

| Dimension | belegt | **offen (Backlog)** |
|---|---|---|
| Zeitlichkeit | Moment (1,2), Mehr-Tage (3), Vergangenheit (6) | **Zukunft/Vorbereitung** (Sleeper-Asset: jetzt investieren, später zahlt es) |
| Richtung | außen (1,2,3,6), innen (4), epistemisch (5) | **relational** (Allianz mit externem Akteur → Kontrollverlust) |
| Auslöser | geplant, emergent, akkumuliert, intern, Gelegenheit, Vergangenheit | **Attribution** (False-Flag: *wen* beschuldigen?) |
| Relativität | Auftrag, Lage, Geschichte | **Meta** (Ziel-Pivot: der Direktor bietet Auftragswechsel) |

> **Bewusst ausgelassen (Owner-Entscheidung):** der *moralische* Beat
> (Gewissensprobe). Realität operiert amoralisch; kein Zeigefinger. Nicht als
> Lücke behandeln.

---

## Teil E — Andockung an die Architektur (Brücke zum Bauen)

| Baustein | Was der Katalog verlangt | Wo (real) |
|---|---|---|
| **Schicht 2 — Beat-Pool** | der Katalog *ist* das Rohmaterial; gewichteter Zug, Anti-Wiederholung nach `region`/`kostenAchse` | Spine ②, Entsch. ② |
| **Schicht 1 — Director** | muss `relativitaetsAchse` kennen, um den Berater korrekt empfehlen zu lassen | `NPCAdvisorEngine.ts` |
| **Zustand/Gedächtnis (C.3)** | „Narrativ-Gedächtnis" (gelaufene Themen + Inokulation) persistieren | `saveState`/`loadState` (Spine §offene Fragen) |
| **Backfire-Modell (C.2)** | Resilienz dämpft meist, verstärkt selten — als Auflösungs-Regel | `Gegenseite.ts` |
| **Werte/Kosten** | jede Option mappt auf bestehende Werte-/Kosten-Achsen | `Auftraege.ts`, `StoryEngineAdapter.ts` |

**Kein neues Inhaltssystem** — der Katalog nutzt durchweg vorhandene Achsen; neu
ist nur Autoren-Disziplin + (später) die dünne Beat-Pool-Auswahl.

---

## Teil F — Qualitäts- & Skalierungs-Disziplin

Standard für jeden weiteren Beat (damit Skalierung *qualitativ* bleibt):
1. **Ein `IDEE_BEAT_*.md` pro Beat** — Anlass, Optionen, Ausgänge, Litmus, Befunde.
2. **Qualitäts-Gate bestehen** (Teil B) — sonst kein Beat.
3. **Eine offene Lücke füllen** (Teil D) — Region/Achse benennen, nicht duplizieren.
4. **Relativitäts-Achse benennen** (Teil C.1).
5. **Real-Grounding wo sinnvoll** — echte Kampagne als Beleg (wie Biolabs/#6),
   aber In-Game fiktiv (`SYMBOLS_AUDIT.md`).

→ Nächster geplanter Schritt (Owner): zurück zum **Spielerinnen-Feedback**
(`PLAYTEST_PERSONAS_2026-06-15*.md`, `ORCHESTRATION_FEEDBACK.md`) prüfen, ob
außerhalb der Beats noch etwas fehlt.
