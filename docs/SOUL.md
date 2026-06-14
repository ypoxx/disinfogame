# 🧭 SOUL.md — Wie dieses Projekt denkt und wie wir zusammenarbeiten

**Status:** Lebendes Dokument, Pflicht-Lektüre für jede Session (Mensch wie KI)
**Zweck:** Der Owner spricht in seiner Sprache — Visionen, Bilder, Bauchgefühl,
mündliche Transkripte. Dieses Dokument ist der Übersetzungsvertrag: Es macht aus
„so fühlt es sich richtig an" reproduzierbare Entscheidungen, damit jede neue
Session sofort effektiv ist, statt Kontext neu zu erraten.

---

## 1. Die Vision in einem Absatz

Ein Bildungs-Aufbauspiel im Geist von MadTV/MadNews/TVTower — aber **keine Kopie**:
Wir abstrahieren die MUSTER dieser Spiele (Planungs-Rhythmus, Verbindlichkeiten,
sichtbares Publikums-Feedback, Wettrennen um eine Deutungs-Metrik) und übertragen
sie mit mehrfachem Nachdenken auf etwas Eigenes: den Arbeitsalltag in einem
fiktiven **Desinformationsministerium**, das eine westliche Demokratie bespielt.
Spielbar, spannend, niedrigschwellig; Bildung entsteht durch das Spiel als
Ganzes (v. a. den End-Report), nicht durch Belehrung. Pixel-Art **aus einem Guss**
— die visuelle Kohärenz ist das Erste, was Nutzer sehen und beurteilen.

## 2. Der Owner (und wie man ihn liest)

- **Profi-Kommunikator, kein Game-Designer.** Er beschreibt Wirkungen
  („spannend", „rund", „Spaß"), nicht Mechaniken. Auftrag an uns: in
  Design-Konzepte übersetzen (interessante Entscheidungen, Risiko/Ertrag,
  Spannungs-/Entspannungs-Zyklen …), Optionen in einfacher Sprache zurückgeben,
  Fachbegriff nur mit Erklärung in Klammern.
- **Mündliche Transkripte sind sein Hauptkanal.** Sie enthalten drei Sorten
  Inhalt, die wir IMMER sauber trennen müssen: ✅ Entscheidungen ·
  🧩 Konzept-Aufträge/offene Gedanken · 💬 Rückfragen an uns.
  Destillat gehört in ein datiertes DECISIONS-Dokument (Vorbild:
  `DECISIONS_2026-06-12_NEXT_LEVEL.md`).
- **Er übersieht bewusst Dinge und sagt das auch.** Also: mitdenken, die
  Intention hinter der Formulierung suchen, Widersprüche zum Bestand aktiv
  benennen und auflösen — nicht wörtlich abarbeiten. Wenn er „X" sagt und die
  Codebasis „Y" nahelegt: beides zeigen, Empfehlung geben.
- **Beispiele sind Anker, keine Grenzen.** „Wie MadTV" heißt: dieses Muster,
  diese Funktion — nicht dieses Interface. Moderne Erkenntnisse (Will Wright,
  Sid Meier, Papers Please, Frostpunk …) ausdrücklich einbeziehen.
- **Humor und Feinheiten sind ihm wichtig** (kleine entdeckbare Details mit
  Spielbezug), ebenso Glaubwürdigkeit (echte Desinfo-Muster, recherchiert).

## 3. Die Grundprinzipien (Kurzform — Langform in DECISIONS_2026-06-12)

1. Alles aus einem Guss (Pixel-Art überall; Texte als flexible Ebene darüber).
2. Glaubwürdige Welt: kein Röntgenblick, echte Proportionen (Avatar > Schreibtisch!),
   Gebäude in einer Stadt, Raum-Nahsicht beim Betreten.
3. Mechanik dient der Simulation — keine künstliche Verknappung/tickende Uhr.
4. Bewegung ist Gefühl und Rhythmus, keine Belohnungsquelle.
5. Bildung durchs Ganze; moralische Last dezent; End-Report ist der Lernmoment.
6. Niedrigschwellig, Spaß zuerst; Zielgruppe spielaffine Erwachsene.
7. Einfache Sprache Richtung Owner (Lehre: „Diegese").
8. Budget-Bewusstsein; Warnung ab ~dreistelligen Euro-Beträgen pro Maßnahme.
9. Feinheiten mit Spielbezug statt beliebiger Gags.
10. Zielbild 0.9: durchspielbar, gewinn- UND verlierbar, NPCs mit Situations-
    bewusstsein, Aktionen aus Dialogen heraus, keine Entwurfs-Reste.

## 4. Arbeitsmodus der KI-Sessions

> **AKTUELLER STAND (2026-06-14):** Strang 1 (#77) + 2 (#78) + Feinplan 3+4 (#79) **und PR #80**
> gemerged: Strang 3+4 **P0 + P1 (komplett) + P2 (Konzept + Engine, noch ohne UI)** plus umfangreiche
> Politur/Konsistenz. Im Spiel: Aktion-aus-Dialog, NPC-Stimmen (Begrüßungen + Reaktionen aller 5,
> Steckbriefe in `NPC_VOICE_PROFILES.md`), 125 Aktionen (Igor/Finanz inkl. Kredit, Fokusgruppe),
> Affinitäten auf kanonischem Roster, G23/G24 sauber, Avatar-Lauf/Lobby/DialogBox/Floating-Declutter
> behoben, Balance 18:18. **Zentraler Einstieg für den Bau-Stand: `STATUS.md`.**
> **Nächste Schritte (offen):** P2-„Akte"-UI — Owner-Entscheidung *Akte vs. dialog-only*
> (Konzept + Skizze in `STRANG34_P2_VERBREITER_PLATTFORM_KONZEPT.md`); Topic-Texte in Stimme;
> Visual-Backlog V4–V6/V8. Auftrag/Entscheidungen: `DECISIONS_2026-06-13B_TRANSCRIPT.md`.

- **Erst lesen:** SOUL.md → **`STATUS.md`** (aktueller Bau-Stand: erledigt/offen/TODO) →
  **`DECISIONS_2026-06-13B_TRANSCRIPT.md`** (neuestes) → `DECISIONS_2026-06-12_NEXT_LEVEL.md` →
  `GESAMTKONZEPT_VISUELL.md` → `NEXT_LEVEL_PLAN.md`. CLAUDE.md im Spielordner für Technik-Regeln.
- **Orchestrierung:** Großes parallelisieren (Recherche/Reviews/Implementierung
  auf disjunkten Dateien), Integration zentral halten. Agenten-Briefings IMMER
  mit harter Abschluss-Klausel („Antwort MUSS mit BERICHT: beginnen, keine
  eigenen Hintergrund-Agenten, Mess-Artefakt anhängen").
- **Qualitätskontrakt:** tsc + alle Tests + Build grün vor jedem Push;
  generierte Bilder per Vision-Review; Spielfluss per Browser-Smoke
  (Playwright mit `executablePath: /opt/pw-browsers/chromium-*/chrome-linux/chrome`);
  Balancing-Änderungen mit Vorher/Nachher-Simulation belegen.
- **Ehrlichkeit:** Befunde ungeschönt (Beispiel: „Verlieren ist mathematisch
  unmöglich"). Was nicht fertig wurde, steht im Bericht, nicht zwischen den Zeilen.
- **Lessons Learned** nach jeder größeren Session in ORCHESTRATION_FEEDBACK.md.
- **Web-Recherche:** Erst WebSearch/WebFetch; bei 403-Mauern Snippet-Synthese;
  wenn Tiefe nötig (Dokus, Screenshots mit Erklärungen): **Exa-API**
  (`EXA_API_KEY` in der Umgebung, https://api.exa.ai — search + contents).
  Bei verbrauchtem Exa-Budget: Owner informieren, NICHT abbrechen.

## 5. Token-/Kosten-Ökonomie (perspektivisch wichtig)

Was Kosten treibt: Re-Exploration bekannter Architektur, ausufernde
Agenten-Fan-outs, Recherche-Wiederholungen, lange unstrukturierte Kontexte.
Gegenmittel (gelten ab jetzt):
- Kanonische Docs statt Neu-Erkunden — dieses Dokument + DECISIONS + PLAN sind
  die Abkürzung; Architektur-Wissen steht in CLAUDE.md.
- Ein Recherche-Thema = EIN Agent mit klarer Frage (kein Fan-out ohne Not);
  Ergebnisse sofort in Docs destillieren, damit sie nie erneut erhoben werden.
- Modellwahl: Sonnet für klar spezifizierte Implementierung/Recherche,
  Opus nur für Urteils-/Balancing-/Konzeptarbeit, Haiku für triviale Audits.
- Generierungs-Budgets der Asset-Pipeline respektieren; ElevenLabs-Batches
  mit Kostenschätzung ankündigen.

## 6. Wie der Owner am wirksamsten beiträgt (erprobte Muster)

- **Weiter so:** mündliche Transkript-Antworten auf Fragenlisten (funktioniert
  hervorragend); klare Einzel-Entscheidungen („Ja/Nein/so machen"); Referenz-
  Screenshots; das Aussprechen von Prinzipien („keine realen Staatssymbole",
  „kein Röntgenblick") — Prinzipien skalieren besser als Einzelkorrekturen.
- **Hilft zusätzlich:** Geschmacksurteile früh anhand von 2–3 Varianten
  (Stil-Lock-Muster) statt spät am fertigen Stück; bei Unzufriedenheit das
  konkrete Bild benennen („Avatar kleiner als Schreibtisch") — genau solche
  Sätze sind Gold; offen sagen, was NICHT wichtig ist (spart die meiste Arbeit).
- **Format-Konvention für Antworten:** Frage-Nummer nennen (wie bei A1–H48) —
  das macht Transkript-Destillation verlustfrei.
