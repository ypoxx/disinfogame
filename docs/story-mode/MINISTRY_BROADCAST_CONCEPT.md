# 📡 „Das Ministerium sendet" — Broadcast-Konzept (breit)

**Status:** Entwurf — ⚠️ **braucht eine eigene Owner-Diskussion** (Festhaltung 2026-06-12)
**Aktualisiert:** 2026-06-12
**Scope:** Story
**Ergänzt:** `BROADCAST_AND_AUDIENCE_CONCEPT.md` (HUD-Geometrie/Publikums-Mechanik bleibt gültig)
**Implementierungs-Stand:** v1-Anzeige-Schicht live (`src/story-mode/broadcast/`, Taste B)

---

## 1. Warum dieses Dokument

MadTV zeigt ein **Fernsehprogramm**, MadNews eine **Titelseite**. Wir sind aber kein
Sender und keine Redaktion — wir sind ein **Desinformationsministerium**. Was „sendet"
ein Ministerium? Die Antwort bestimmt das wichtigste Feedback-Element des Spiels:
Der Spieler soll **plakativ** sehen, was die eigenen Taten auslösen — im Kleinen,
Mittleren und Großen, aktiv wie als Gegenreaktion (Owner-Vorgabe 2026-06-12).

**v1 (umgesetzt):** Die letzte Maßnahme läuft als „Sendung" über Röhren-TV bzw.
Zeitung, das Publikums-Wohnzimmer reagiert (Stimmung/Überzeugung je Segment),
Wirkung wird als KLEIN/MITTEL/GROSS eingestuft. Die Zuordnung Aktion→Kanal/Thema ist
**provisorisch** (`broadcastMapping.ts`) und bewusst klein gehalten.

## 2. Die Leitidee: Das Ministerium sieht die Welt durch Medien, die es manipuliert

Der Bildschirm im Büro ist kein Programm, das WIR ausstrahlen — es ist das
**Echo der Zielgesellschaft**: Westunions Medien, in denen unsere Operationen
(unsichtbar oder sichtbar) ankommen. Das löst das konzeptionelle Problem elegant:

- **Erfolg** = unsere Narrative tauchen in FREMDEN Medien auf (TV-Schlagzeile,
  Talkshow-Gast, der unsere Themen spricht, Leserbrief-Welle).
- **Misserfolg/Enttarnung** = Gegenwind in denselben Medien („Faktencheck",
  „Geheimdienst warnt vor Kampagne", parlamentarische Anfrage).
- **Eskalationsstufen** = Medienformat: Randnotiz (klein) → Schlagzeile/Talkshow
  (mittel) → Sondersendung/Staatskrise (groß).

## 3. Format-Palette (zur Diskussion)

| Format | Trägt | Eskalation | Aufwand |
|---|---|---|---|
| **Nachrichtenticker** (TV-Laufband) | jede Maßnahme, klein | klein | ✅ v1 vorhanden |
| **Schlagzeile** (Zeitungs-Rahmen) | Print-Kanal-Maßnahmen | klein–mittel | ✅ v1 vorhanden |
| **Talkshow mit „Agenten"** | platzierte Experten/Personas: unser NPC-Porträt sitzt im TV-Studio-Set und vertritt das Narrativ | mittel | 1 Studio-Hintergrund + Porträt-Compositing |
| **Sondersendung** | Krisen/Großwirkung: Vollbild-Übernahme der Broadcast-Leiste, rote Banner | groß | CSS + vorhandene SFX (sfx_world_event/crisis) |
| **Gegendarstellung/Faktencheck** | Countermeasures der Gegenseite, sichtbar im selben TV | Gegenreaktion | Mapping countermeasures.json → Items |
| **Soziale-Netzwerke-Feed** | social-Kanal: scrollende Post-Kacheln statt TV | klein–mittel | neues Mini-Layout |
| **Wochenschau** (Phasen-Ende) | Zusammenfassung aller Maßnahmen der Phase als „Sendung" vor dem Phasen-Übergang | Struktur | verbindet endPhase mit Broadcast |

## 4. Plakative Wirkungs-Treppe (Owner-Vorgabe: klein / mittel / groß, aktiv / Gegenreaktion)

```
AKTIV                                   GEGENREAKTION
klein   Ticker-Zeile, 1 Figur reagiert  Leserbrief „Zweifel an Berichten"
mittel  Schlagzeile + Talkshow,         Faktencheck-Banner, Segment wird
        2–3 Figuren wechseln Stimmung   misstrauisch (blau eingefärbt)
groß    Sondersendung, Wohnzimmer       „Geheimdienst warnt"-Sondersendung,
        kippt sichtbar (Mehrheit        Quote unserer Narrative fällt,
        wütend/überzeugt), Applaus-/    NPC-Krisen-Dialoge referenzieren
        Krisen-SFX                      die Enttarnung
```

v1 stuft über `intensity` (Aufmerksamkeits-Kosten + Risiko) ein; die Treppe oben
ist das Zielbild für die Inszenierung je Stufe.

## 5. Offene Fragen für die Owner-Diskussion

1. **Diegese:** Bleibt der Bildschirm „Echo der Zielgesellschaft" (Empfehlung) oder
   senden wir auch eigene Propaganda-Formate (Staats-TV nach innen)?
2. **Mapping-Hoheit:** Aktion→Thema/Kanal gehört langfristig in die Aktions-Daten
   (`actions.json`: neue Felder `broadcast: { themes, channel }`) statt in eine
   Code-Tabelle. Wer pflegt die Zuordnung — Daten-Autor oder Engine?
3. **Mechanik-Kopplung:** Publikum ist heute reine Anzeige. Soll Quote/Stimmung in
   die Spielmechanik zurückwirken (z. B. attention/risk modifizieren)? Wenn ja:
   Balancing-Sitzung nötig (Leitprinzip „Anzeige zuerst" aus
   BROADCAST_AND_AUDIENCE_CONCEPT.md §1 würde fallen).
4. **Talkshow-Inszenierung:** Eigene Porträts der „platzierten Agenten" (Personas)
   generieren oder NPC-Porträts wiederverwenden?
5. **Zwei Länder:** audience.json kennt `nordmark` UND `gallia` — v1 zeigt nur
   Nordmark. Zweites Wohnzimmer (Umschalter) oder Fokus-Land je Mission?
6. **Segment-Archetypen:** Die Figuren-Zuordnung (FIGURE_BY_SEGMENT) ist visuelle
   Kurzschrift — z. B. „Beamter" für das ängstliche Land-Milieu. Passt die Lesart
   oder eigene Figuren je Segment generieren (6 weitere Sheets, 1 Pipeline-Lauf)?
7. **Wochenschau:** Phasen-Ende als Pflicht-Moment (MadTV-Zitat: Quoten-Abend) —
   gewünscht?

## 6. Technischer Unterbau (vorhanden)

- `broadcast/useAudienceBroadcast.ts`: Aktion → Effect → `reactToEffect` →
  Segment-Update + Decay je Phase. Austauschbar, ohne UI-Änderung.
- `broadcast/broadcastMapping.ts`: die EINE Stelle für Kanal/Themen/Intensität
  (und damit der Hebel für Diskussionspunkt 2).
- Assets: `hud_tv_frame`, `hud_paper_frame`, `audience_room`, 6 Figuren-Sheets,
  `sfx_applause`, `sfx_tv_on`, `sfx_world_event`, `sfx_crisis` — Talkshow/Sonder-
  sendung brauchen nur 1–2 weitere Bilder (Studio-Set, Banner).
