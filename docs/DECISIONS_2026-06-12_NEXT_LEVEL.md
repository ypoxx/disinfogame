# 📋 Owner-Entscheidungen 2026-06-12 (Abend) — Antworten auf die 48 Fragen

**Status:** Kanonisch — destilliert aus dem mündlichen Transkript des Owners
**Scope:** Story · ersetzt die offenen Punkte in `NEXT_LEVEL_QUESTIONS.md` (dort nur noch Referenz)
**Lesehilfe:** ✅ entschieden · 🧩 Konzept-Auftrag (Kürzel K#, siehe `NEXT_LEVEL_PLAN.md`) · 💬 Rückfrage des Owners an uns · ❌ abgelehnt

## Grundprinzipien (neu bzw. geschärft — gelten ab jetzt überall)

1. **Aus einem Guss:** Das komplette Spiel ist Pixel-Art — Dialogboxen, Panels, Icons, alles. Legacy-CSS-Flächen verschwinden vollständig; nur die nötige Spielsteuerung (Menü, Ton) bleibt, klein und standardisiert. Texte sind eine flexible Ebene ÜBER den Grafiken (nie eingebettet, nie überlaufend).
2. **Glaubwürdige Welt statt UI-Logik:** Kein Röntgenblick ins Gebäude, echte Größenverhältnisse (Avatar größer als der Schreibtisch!), Gebäude als Gebäude in einer Stadt, Räume sieht man erst beim Betreten, im Raum gilt MadTV-Nahsicht (NPC groß hinter dem Schreibtisch).
3. **Mechanik dient der Simulation:** Spannung kommt aus dem Thema Desinformation (Enttarnung, Gegenreaktion, Rhythmus eines Arbeitstags) — keine künstliche Verknappung, keine reine „Spannungs-Mechanik" als Selbstzweck.
4. **Bewegung ist Gefühl, nicht Belohnung:** Wege im Gebäude geben Rhythmus und kosten Zeit, aber es gibt keine mechanischen Boni fürs Hinlaufen.
5. **Bildung durch das Spiel als Ganzes:** Keine Belehrung an jedem Schritt, moralische Last dezent (NPC-Zwischentöne). Der große Lernmoment ist der End-Report.
6. **Niedrigschwellig & Spaß zuerst:** Zielgruppe sind spielaffine Erwachsene (z. B. Kolleg:innen aus der Unternehmenskommunikation); Schule ist spätere Vision.
7. **Verständliche Sprache:** Keine unnötigen Fachwörter in Konzepten und Fragen an den Owner (Lehre aus „Diegese").
8. **Budget-Bewusstsein:** Vertonung modular, Generierung gezielt; Warnung an den Owner, falls eine Maßnahme in den dreistelligen Euro-Bereich liefe (zweistellig = ok).
9. **Feinheiten mit Spielbezug:** Ein paar Dutzend kleine humorvolle Details, die am Spielverlauf hängen (Mini-Roadmap), statt beliebiger Easter Eggs.
10. **0.9-Zielbild:** Vollständig wirkendes Spiel — keine groben Fehler, mehrere Pfade, gute Grundkomplexität, man kann gewinnen UND verlieren, NPCs haben Situation Awareness, Aktionen lassen sich aus Dialogen heraus starten.

## A — Kernschleife

| # | Entscheidung |
|---|---|
| A1 | ✅ Bewegung kostet Spielzeit. Inszenierung: **ein Arbeitstag** (Beginn ~8/9 Uhr, eine Art „Redaktionsschluss"). 🧩 **K1 Tagesschleife**: mathematisches Modell offen (Recherche MadTV/TVTower), evtl. Zeitzonen-Idee. |
| A2 | 🧩 **K1**: Spannungsbogen neu denken — Zweck: Realismus, Rhythmus, sanfter Druck, Fehler provozieren. ❌ Tickende Uhr/künstliche Verknappung. 💬 Owner will Vorschläge, die zum Thema Desinformation passen. Dazu: **Durchrechnung, ob man aktuell überhaupt gewinnen/verlieren kann** (Engine-Analyse). |
| A3 | ❌ Keine mechanische Belohnung für Besuche. Offener Gedanke: NPCs als „intelligentere Akteure" mit bilateralen Auswirkungen ihrer Entscheidungen → fließt in 🧩 **K7 NPC-Tiefe**. |
| A4 | ✅ Pflichtmoment am Tagesende wie MadTV-Quotenabend: Fazit mit Analysen/Daten, evtl. Karte. 🧩 **K1** (Inszenierung) — globale Aktionen können andocken, nicht künstlich verbinden. |
| A5 | ✅ Weltereignisse auch mitten im Tag auf der Bühne (Sondersendung), dosiert (Abnutzung!), story-passend. |
| A6 | ✅ Tag/Nacht-Ambiente; gerne Jahreszeiten (niedrige Prio, in Asset-Bibliothek aufnehmen; Feiertage als Kampagnen-Anlässe denkbar). |
| A7 | ❌ Keine sichtbaren Gegner-Räume/-Gebäude. ✅ Stattdessen: Faktenchecker/Geheimdienste/viele Medien **indirekt** im TV/in Zeitungen sichtbar — Vielfalt der Gegenseite spürbar machen. → 🧩 **K3 Broadcast**. |

## B — Broadcast & Publikum

| # | Entscheidung |
|---|---|
| B8 | ✅ Bildschirm = **Echo der Zielgesellschaft** (wir bespielen das Ausland, nicht das eigene Volk). Wort „Diegese" aus allen Docs verbannen. |
| B9 | ✅ Teilweise Rückwirkung ja — aber **nichts Neues erfinden**: vorhandene Wirkungsketten klarer machen. 💬 weiteres Gespräch gewünscht. |
| B10 | 🧩 **K3 Talkshow**: Nicht „eigene Agenten", sondern **gestützte Stimmen / unwissende Mittäter** (Außenseiter-Autoren, Pseudo-Experten, finanzierte Bücher, Gremien-Mitglieder; teils offene Kanäle wie ein RT-Analogon, Botschafts-Einladungen, Wirtschaftsforen). Webrecherche beauftragt. Erkennbar machen, über wie viele Ecken jemand gestützt wird. |
| B11 | ✅ Mapping wandert in die Aktions-Daten (`actions.json`, Feld `broadcast`). |
| B12 | 🧩 **K2 Spielwelt**: Zwei-Länder-Modell überdenken. Optionen: Staatenbund (EU-artig, Orbán/Fico-Muster) ODER **ein großes föderales Land** (starke Demokratie, Institutionen, Pressefreiheit, viele Parteien/Interessen, Konsenssuche). Holistische Diagnose + Empfehlung erarbeiten (Recherche läuft). |
| B13 | ✅ Publikums-Figuren sind **zu sowjetisch/klischeehaft** → neu: modern-westlich, soziodemografische Milieus (Sinus-artig), evtl. mehr als 6. → Asset-Neuauflage + 🧩 **K2**. |
| B14 | ❌ Keine Namen im Wohnzimmer. ✅ NEUE IDEE: **Fokusgruppe** (wie in der Werbung) als eigener Raum/Videokonferenz — dort Personas MIT Namen und kleiner Geschichte, höherer Detailgrad. → 🧩 **K4 Fokusgruppe**. |
| B15 | ✅ Social-Feed als **eigenes Layout** auf einem Newsroom-Screen im Büro (Posts, Likes, Trending Topics — Kampagnen-Reifung sichtbar). → 🧩 **K5**. |
| B+ | ✅ Querschnitts-Auftrag: **alle Legacy-CSS-Flächen ersetzen** (Dialogfenster, rechte Panels, Aktionsauswahl …) → 🧩 **K11 Stil-Vollendung**. NPC-Aktionen braucht man nicht mehr im rechten Panel anklicken, wenn man bei den NPCs im Büro ist. |

## C — Bildung & Reflexion

| # | Entscheidung |
|---|---|
| C16 | 💬 Nicht verstanden („dezenter Toast", wessen Feedback-Dialog?) — Erklärung liefern, dann entscheidet der Owner. |
| C17 | ❌ Reale Fallreferenzen (zu viel Pflege). ✅ Bilanzen erzählerischer/detaillierter („kann wie eine Fallreferenz klingen"). ✅ Generell: **Dialoge sind zu platt** — mehr echte Dialoge statt Button-Klicks (Beispiel Finanzbericht), Situationsbezug. → 🧩 **K7**. |
| C18 | ✅ Moralische Last dezent: NPC-Zwischentöne, keine Spiegel/Träume. Spätere Idee: NPCs moralische Frage stellen können → ehrliche Antwort → Umgang (verpfeifen/entlassen) mit Rückwirkungen. Priorität bleibt: **durchspielbar + Spaß + Pfade + gewinnen/verlieren**. |
| C19 | ✅ Zielgruppe: spielaffine Erwachsene, niedrigschwellig. Schule = Vision. |
| C20 | ❌ Keine generelle Schwelle. ✅ NUR bei schwerwiegenden Aktionen (Leib/Leben, Panik): Bewusstseins-Moment, formuliert als Spiel-Logik („starkes Schwert — schnellere Enttarnung/Gegenreaktion"). |
| C21 | ❌ Kein Whistleblower-Story-Arc (Ending-Kategorie darf als passives Ende bestehen bleiben). |
| C22 | ❌ Kein Quellen-/Literaturverzeichnis. |

## D — Inhalt

| # | Entscheidung |
|---|---|
| D23 | ✅ Generische Direktor-Begrüßung reicht — etwas detaillierter/witziger, **vertont** (ElevenLabs-Qualität der ersten Version war gut). Optional: 3 Pflicht-Fragen, nur die Reihenfolge ist frei (Retro-Muster). |
| D24 | ✅ **Vertonungs-Roadmap modular** (🧩 K13): Platinum-Kerntexte vertonen, Rest stumm; Voll-Vertonung erst bei stabilen Texten (Budget/Sprachen!). |
| D25 | 💬 Empfehlung zu Story-Beats/Jahres-Meilensteinen ausarbeiten (Recherche läuft) — Owner braucht erst ein Gefühl, was das ist. |
| D26 | ✅ Erst Deutsch fertig, dann Lokalisierung in einem Rutsch (DE+EN). |
| D27 | ✅ Einfache Avatar-Anpassung: kleine Porträt-Auswahl (m/w × alt/mittel/jung) + Name. Porträt taucht im Spiel auf (z. B. hängt bei Erfolg gerahmt im Raum). Dazu 🧩 **K10 Mini-Roadmap „Spielfeinheiten"** (Dutzende kleine Details mit Spielverlaufs-Bezug). |
| D28 | ✅ Pförtner wird Flavor-NPC: Smalltalk + Gerüchte; er ist die **Stimme des eigenen Landes** (Innenstimmung als möglicher neuer Spielpfad — bewusst andiskutieren, nicht sofort bauen). → 🧩 **K2/K7**. |

## E — UX/UI & Gebäude

| # | Entscheidung |
|---|---|
| E29 | ✅ HUD-Hierarchie (Risiko/Kapazität prominent). |
| E30 | ✅ Pixel-Icons statt Emojis (eigener Pipeline-Lauf). |
| E31 | ✅ Phase-Ende mit Bestätigung UND diegetisch („nach Hause gehen": Tür/Lobby oder automatisch bei Tagesende) + sichtbares Feedback, dass der Tag endet. → Teil von 🧩 **K1**. |
| E32 | ✅ Mindestplattform Desktop/Laptop (Auflösungen testen); iPad-Landscape mitdenken, nicht blockierend. |
| E33 | ✅ Vollständige Tastatur-Spielbarkeit als Ziel. |
| E34 | ⏳ Farbenblind-Modi später (festgehalten). |
| E35 | ✅ Schriften flexibel/skaliert, nie in Grafiken eingebettet. |
| E+ | 🧩 **K6 Gebäude-Rework** (große Korrektur am aktuellen Stand): ① Gebäude als Gebäude mit Stadt-Szenerie links/rechts (nicht bildschirmfüllend), ② mehr Etagen + Kamera fährt hoch/runter, ③ **kein Röntgenblick** — von außen nur Fassade/Türen, Räume erst beim Betreten, ④ echte Größenverhältnisse Avatar↔Möbel (Assets ggf. neu), ⑤ Lobby-/Hintergrund-Maßstäbe korrigieren, ⑥ im Raum MadTV-Nahsicht (NPC groß hinter Schreibtisch, kein Mini-Avatar), ⑦ Laufanimation reparieren (Beine!, Schrittweite↔Geschwindigkeit, Godot-Konzepte als Referenz — Recherche läuft). |

## F — Audio

| # | Entscheidung |
|---|---|
| F36 | ✅ Mehr Ambient-Variation **pro Raum**, mehr Musik-Loops, mehr Ambiente generell. |
| F37 | ✅ Lautstärke-Mixer (Musik/SFX/Stimmen) in Optionen. |
| F38 | ✅ Direktor-Stimme bleibt. Hinweis an Owner: **Casting für alle 5 NPCs existiert bereits** (51 Zeilen generiert) — zum Anhören unter `public/assets/sounds/voice_*.mp3`; Neu-Casting jederzeit möglich. |
| F39 | ❌ Kein Typing-Sound. Evtl. dezenter Einzelton bei Aussage-Ende (Vorschlag machen, nicht nervig). |

## G — Technik & Qualität

| # | Entscheidung |
|---|---|
| G40 | 🧩 **K9 Speichern & Anmelden**: Browser-Back-Verlust beheben (Verlassen-Warnung + Autosave), leichtgewichtiges datenarmes Login (z. B. Google) für ~20–30 Tester, Cloud-Save, mehrere Spielstände. (Hinweis: archivierte Netlify-Functions/Redis-Infrastruktur existiert als Startpunkt.) |
| G41 | 💬 Erklärung Playwright-Smoke liefern; bei Zustimmung als CI einrichten. |
| G42 | ✅ `sovietRed` → `ministryRed`. |
| G43 | ✅ Bundle-Splitting ok; Budget-Leitplanke: Warnung an Owner ab ~dreistelligen Euro-Beträgen. |
| G44 | ❌ Telemetrie. ✅ STATTDESSEN **K8 End-Report**: Bei Spielende sichtbare Auswertung — genutzte Aktionen, ausgelöste Effekte, erreichte/verpasste Enden, Statistiken mit Diagrammen, kommentiert/interpretiert. „Der größte edukative Teil." Eigener Look erlaubt (ähnliche Farbwelt, nicht zwingend Pixel-Art). |

## H — Spieltests

| # | Entscheidung |
|---|---|
| H45 | ✅ Test misst **Spannung + Verständlichkeit** (nicht Bildungseffekt). Erfolgskriterien: zu Ende gespielt / „nochmal!" / Weiterempfehlung. Tester: Kolleg:innen Unternehmenskommunikation. |
| H46 | ❌ Kein Feedback-Kanal im Spiel. |
| H47 | ✅ Eigene Test-URL/Domain (statt PR-Preview). |
| H48 | ✅ Versionsnummer + Changelog sichtbar (hartes „v0.9" raus); Impressum-Thema vormerken. |

## Aufgelöste Widersprüche zum bisherigen Stand

| Konflikt | Auflösung |
|---|---|
| Roadmap-Eintrag „Besuchs-Belohnung" (Game-Design-Gutachten A4) | **Gestrichen** — A3-Entscheidung: keine mechanischen Belohnungen. Stattdessen K7 (NPC-Tiefe macht Besuche inhaltlich lohnend). |
| Gutachten-Vorschlag „sichtbar tickende Uhr" | **Ersetzt** durch K1-Tagesrhythmus (Arbeitstag + Redaktionsschluss + Tagesfazit). |
| Aktuelle BuildingStage zeigt Raum-Vignetten von außen | **Widerspricht Prinzip 2 (kein Röntgenblick)** → K6-Rework: Fassade + Türen außen, Raum-Nahsicht innen. |
| 6 Publikums-Figuren (sowjetischer Look) | **Asset-Neuauflage** westlich-modern nach Milieu-Konzept (B13/K2). |
| Ending-Kategorie „Whistleblower" vs. C21 | Ende bleibt als Ergebnis bestehen; **kein** eigener Story-Arc/Content dafür. |
| `NEXT_LEVEL_QUESTIONS.md` | Bleibt als Archiv; dieses Dokument ist die kanonische Antwort. |
