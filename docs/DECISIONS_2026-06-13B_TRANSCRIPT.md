# 📋 Owner-Entscheidungen 2026-06-13 (Abend) — Antworten auf FRAGEN_2026-06-13.md + neue Stränge

**Status:** Kanonisch — destilliert aus dem mündlichen Transkript (Audio).
**Verhältnis:** Beantwortet `FRAGEN_2026-06-13.md` (A1–K41) und ergänzt
`DECISIONS_2026-06-12_NEXT_LEVEL.md`, `GESAMTKONZEPT_VISUELL.md`, `SOUL.md`.
**Lesehilfe:** ✅ entschieden · 🧩 neuer Konzept-/Bau-Auftrag · 💬 Rückfrage des
Owners an uns · ⚠️ neuer Bug/Mangel im aktuellen Build.

> **Leitsatz dieser Runde:** „Alles, was alt (CSS/Legacy) ist, muss weg und ins
> neue Pixel-Konzept übergehen — aus einem Guss. Keine Funktion darf dabei
> verloren gehen." Visuelle Qualität hat höchste Priorität; Owner erhöht dafür
> das Bild-KI-Budget (~+10–20 €) und akzeptiert komplette Neu-Generierung.

---

## A — Schichten & „aus einem Guss"

- **A1** ✅ Drei Bild-Schichten (Welt · anklickbare Dinge · kleine Randleiste) bestätigt — Bedingung: nichts wird unbenutzbar, keine Funktion fällt weg.
  - ⚠️ **NPC-Porträts sind nicht transparent** → der mitgenerierte Hintergrund liegt als „Briefmarke" sichtbar auf dem Büro-Hintergrund. **Muss gelöst werden** (Hintergrund ausstanzen/Chroma; wenn unmöglich, anderer Weg). Vor einer Massen-Neugenerierung: ⚠️ **Budget-Warnung an den Owner**.
  - ✅ Büro-Hotspots: die sichtbaren Rechtecke sind Legacy → **unsichtbare Klickflächen**; ideal: Klick-Feedback umrandet das **tatsächlich gezeichnete Objekt** (nicht ein Rechteck).
  - 💬 **Was ist in der „kleinen Randleiste"?** Owner fragt zurück: ist sie nur ein aufklappbares Menü? Wird sie überhaupt gebraucht oder taucht alles diegetisch auf? → unsere Empfehlung nötig.
  - ⚠️ Noch viel Legacy sichtbar (Dialogboxen im alten CSS, Überlappungen; neue Funktionen teils nur in alter Grafik). Skills/Roadmaps nachziehen.
- **A2** ✅ Mittiger Knopfbalken (Gebäude/Büro/Dashboard/Sendung) wird abgeschafft; Ortswechsel über Türen/Fahrstuhl.
  - ✅ **Sendung/Publikum (Broadcast) ist DEFAULT permanent sichtbar** (wie MadTV/MadNews/TVTower), mit Option zum Wegblenden/Runterfahren.
  - 🧩 **Navigations-Problem:** Gebäude ist hoch → man muss aktuell Etage für Etage fahren. Lösung für „durch das ganze Gebäude fahren" nötig (Fahrstuhl-Panel mit Etagenwahl o. ä.).
  - ⚠️ Lobby ist sichtbar nur dasselbe Asset ×4 → sieht nicht wie eine Lobby aus. Pförtner fehlt als Figur. Avatar-Beine bewegen sich noch nicht (leichtes Schweben).
  - 🧩 Dummy-Figuren durchs Gebäude laufen lassen (Lebendigkeit), Fahrstuhl sichtbar nutzen; Druck/Spannung evtl. erst später in einer Phase (Anfang nicht überfordern).
- **A3** ✅ Dialoge, Aktionswahl, Nachrichten hängen an Möbeln (Computer, Korkbrett, Akten …) statt aufzupoppen.
  - ✅ Texte bleiben flexibel/bearbeitbar, aber Felder/Dialoge im Pixel-Stil; passende Schrift + Farbharmonie.
  - ⚠️ Dialogfenster decken aktuell fast das ganze Büro zu (Figur/Raum kaum sichtbar) → kleiner/besser. MadTV-Lösung anschauen.
  - 💬 Owner erinnert: **Exa-API** nutzen, wenn WebFetch blockiert; **TVTower.org-GitHub** für Konzepte/Doku ansehen (nicht kopieren — Muster/Skills ableiten).
- **A4** ✅ Dashboard als eigene Ansicht entfällt; geht in Büro-Objekte auf.

## B — Planungsbrett (unser „Sendeplan")

- **B5** ✅ Narrativ-Tafel (Korkbrett) als zentrales Planungsbrett — gute Idee, weiter testen; Drag&Drop erwünscht (s. B7).
  - ⚠️ **Aktions-Verdrahtung unsauber:** TV/Dashboard/Berichte zeigen nur „Aktion durchgeführt" statt der Aktions-Überschrift (z. B. „Bot-Netzwerk gestartet"). **Muss durchgezogen werden.**
  - 🧩 Brauchen **kleinere, plakativere, greifbarere Aktionen** (die heutigen stammen aus dem Wargaming für Unternehmenskommunikatoren → zu abstrakt). Eigene Roadmap „Aktionen verbessern". → siehe K40/G22.
  - ⚠️ Direktor-Tageshinweise: gute Idee, aber teils unverständlich (welches Risiko? welches Problem?) → Formulierung überarbeiten.
  - ⚠️ Sprache/Dialoge insgesamt noch nicht flüssig/preisverdächtig → Niveau heben, evtl. stärkere Agenten (Journalist/Copywriter/Sprachwissenschaft-Niveau).
- **B6** ✅ Nicht mehr als 3 Narrative; weiter beobachten. 💬 Owner will Empfehlung aus mehreren Perspektiven.
- **B7** ✅ Pin/Drag&Drop auf die Tafel — versuchen, wenn Assets/Transparenz/Ästhetik mitspielen; bei Grenzen fallen lassen.
- **B8** ✅ Abgelaufene Gelegenheiten als rote Fäden mit Datum — testen; Sorge vor Überfüllung/Unübersichtlichkeit; ggf. gestapelt.

## C — Gegenseite ohne sichtbare Gegner

- **C9** ✅ Gegenseite nur über Medien + abstrakten Vertrauensbalken (Ministerium ↔ Institutionen), nie als Person/Büro im Gebäude.
  - 🧩 **Neue Idee:** Gegenseite greifbarer/erzählerischer machen (wie die Fokusgruppe entstand) — z. B. Gespräche mit **Einzelpersonen der Gegenseite**, die eine „Lageeinschätzung" aus ihrer Sicht geben. Ideen sammeln. (Fokusgruppe muss auch in den neuen Stil.)
- **C10** ✅ Vertrauensbalken **dezent** (Hintergrund/Bericht/abrufbar im Büro), nicht im Stundentakt prominent.
- **C11** ✅ „Institutionen" (Faktenchecker, Presse, Gericht) als Begriff ok.

## D — Proportionen & Kamera

- **D12** ✅ Avatar deutlich größer (größer als Schreibtisch, ~2/3 Raumhöhe) als feste Regel. (Reiteration: Avatar-Transparenz lösen.)
- **D13** ✅ Von außen keine Zimmer mehr, nur Fassade/Fenster/Türen; Räume öffnen sich beim Betreten.
  - 🧩 **Atmosphäre-Konzept (eigener Agent/Strang):** Dummy-Türen (wie MadTV) mit ein-/ausgehenden Dummies; klar erkennbar, **welche Türen betretbar** sind vs. nicht. Tür-Öffnen/-Schließen als Mikro-Animation. Flure lebendiger: Lampen (abends an), Papierkorb, kleine Pflanzen, Poster. Reinigungskräfte leeren Papierkörbe zu bestimmten Zeiten (Signal: bald Feierabend). Später: Dummies anklickbar (Mini-Dialog/Tooltip, z. B. „Geh mal zum Pförtner und frag zu XY"; Reinigungskraft „Bald schließt das Gebäude"). Trotz Brutalismus/Sowjet: nicht kalt/trocken — Liebe zum Detail, Lebendigkeit, Spaß.
- **D14** ✅ Etagenzahl gut so (kein Hochhaus, normal hoch); keine leeren Etagen. Später mehr Büros möglich (Gebäude wächst, s. K40). 🧩 Asset-Strategie: entweder mehrere Etagen in einem Guss (fester Stil) ODER **modular** (Etagen schnell auflegbar) — Modularität vorab sauber planen. Nicht kritisch.
- **D15** ✅ Stadt nur sanft lebendig: Lichter (Tag/Nacht), Jahreszeiten (Schnee/Regen). Keine Autos/Passanten; nur Kleinigkeiten.

## E — Stil-Geschmack

- **E16** 🧩 Kompromiss statt reinem 70er-Braun ODER Graublau: **modern (2026), nicht zu dunkel** — Owner warnt vor falschem 1970-Klischee (reale Desinfo ist heutig, moderne Bürogebäude). „Evil Cold War"-Anmutung dosiert; Räume sollen zu **Kontext/Charakter** passen (IT/Keller dunkel ok; Direktor/Marina heller). Graublau+Brutalismus wirkt teils zu leer (Vorteil beim Überlagern — Prompting beachten).
- **E17** ✅ **Nicht zu grob pixelig** (die sichtbaren Einzelpixel der Lauf-Avatare wirken auf hochauflösendem MacBook „billig"). **Feiner/detaillierter ist erwünscht** — den *Geist* alter Spiele übernehmen, aber moderne Auflösung nutzen; Schrift auf Postern/Logos darf fein/lesbar sein. Kein 1990-Simulat.
- **E18** ✅ **Freie, kostenlose Pixel-Fonts** (Lizenz-sicher), keine Eigenentwicklung — außer einmalig handgemalt für ein Asset.
- **E19** ✅ Title-/Startbildschirm bleibt wie er ist (gefällt, passt). 💬 Falls wir mit „Title Screen" etwas anderes meinten, nachfragen. → *Unsere Lesart: der Startbildschirm. Bleibt.*

## F — Grenzen der „Bedienung über Möbel"

- **F20** ✅ Schlichter **Pixel-Terminal** für viele Zahlen/Listen ok — aber grafisch passend: Rahmen-Asset, Scrollen im Rahmen, **gezeichneter Scrollbalken** als Teil des visuellen Konzepts. Kein zweites CSS — **Pattern-/9-Slice-Assets** (kachelbar) nutzen (MadTV erlaubte Scrollen/Klicken im festen Terminalfenster).
- **F21** ✅ End-Report darf eigenen Look haben, aber Rahmen/Hintergrund im Stil; Inhalt (Diagramme/Statistik) darf Kompromisse machen (gab's im alten Stil nicht) — Farbgebung/Strichdicke für Wiedererkennbarkeit halten.

## G — Inhalts-Grenzen

- **G22** ✅ Methoden **explizit & praktisch benennen** (nicht nur andeuten) — sonst zu abstrakt. Keine „Anleitung-zum-Lügen"-Sorge: Spiel basiert auf realen Methoden (China/RU/Iran/NK); Ziel ist Verständnis. 🧩 **Viel mehr Einzel-Aktionen** je Aktionspaket → greifbarer, lehrreicher. **Replay/Spannung:** heute nur ~Dutzend Sieg/Verlier-Pfade; Ziel **100–500 Pfade** + längere Spielzeit → braucht Simulation + viele neue Aktionen + langes Nachdenken.
- **G23** ✅ Gestützte Stimmen **erkennbar fiktiv** (real inspiriert, keine erkennbaren echten Personen, keine Rechtsprobleme).
- **G24** ✅ Reale Themen (Energie, Migration, Wahl …) als Narrative ohne echte Namen/Flaggen — wichtig & aktuell; viele weitere Themen (kommunal→Welt) nutzbar → mehr Spannung.
- **G25** ✅ Moralische NPC-Zwischentöne **dezent**. 💬 Owner will Beispiel „leicht spürbar vs. dezent" von uns.

## H — Aufwand vs. Ertrag

- **H26** ✅ Gebäude-Rework + Proportionen **zuerst**, hohe Priorität (Visuelles trägt das Spielgefühl). 🧩 Braucht **bessere Grob- + Feinplanung**: standardisierte Stilistik, Asset-Katalog (wo/wann/wie, Modularität), **Realitäts-Check** der Proportionen (Kontext, nicht nur Bild). Budget: +10–20 € ok.
- **H27** ✅ Beim Rework **alle Räume neu** (Konsistenz), nicht nur teilweise.
- **H28** ✅ Narrativ-Tafel gleich **animiert & ziehbar**.
- **H29** ✅ Die ~10 Modalfenster auf **ein Rahmensystem, alles auf einmal** (Planung ist eh detailliert) — außer es zeigen sich Probleme.
- **H30** ✅ Tag/Nacht + Jahreszeiten **jetzt**.

## I — Tonalität & Kleinigkeiten

- **I31** ✅ Humor **zurückhaltend**, indirekt (Sprechstil der Figuren, eigene Wörter; Poster im Flur, Pflanze gegossen/nicht) — kein Pseudo-Witz.
- **I32** ✅ Zahlen/HUD **auf Knopfdruck** einblendbar (weniger Ablenkung).
- **I33** ✅ Klärung: Lesbarkeit von Text auf Bild **immer gewährleisten**; Dialoge/Sprechen **stimmungsvoll/erzählerisch** (heutige „Dialoge" sind oft nur Menüs „worüber willst du sprechen?" → mehr echtes Gespräch). 💬 (Frage war doppeldeutig — diese Lesart gilt.)

## J — Sound & Musik

- **J34/J35** ✅ **Beides gleichmäßig** (ruhige Loops + dramatische Situationsmusik) und **adaptiv**: Musik reagiert auf Spielzustand (Richtung Sieg heller, Richtung Verlust dunkler; eigene Loops bei guten/Welt-Ereignissen). Sound/Musik tragen stark zur Immersion bei — lohnt zu investieren.
- **J36** ✅ Raum-Klangkulissen **unter der Musik** (Musik ggf. leiser, damit Kulisse durchkommt) — Balance uns überlassen.
- **J37** ✅ Keine Klang-Referenz; kohärentes Set genügt; uns vertraut.

## K — Dialoge & Sprache (Schwerpunkt-Mega-Update)

- **K38** ✅ **Bestätigt als eigener Schwerpunkt:** echte Gesprächsführung, Situationsbezug, **Aktionen direkt aus dem Dialog**. Wird das Spiel massiv verbessern.
  - ⚠️ **Fernsehpublikum-Assets teils kaputt** (halbe Figuren, Couch liegt drüber) → neu machen.
- **K39** ✅ Git-Verlauf nach besseren alten Dialogen durchsuchen. Owner-Vermutung: evtl. nur **orphaned „Dateileichen"** (nie fertig verdrahtet) — wenn nichts Gutes da ist, neu schreiben; wenn doch, darauf aufsetzen (auch wegen des Konzepts dahinter).
- **K40** ✅ NPCs: Fachrolle-fokussiert, **etwas mehr Persönlichkeit** (nicht zu viel). 🧩 **Große neue Richtung — Aktionen über NPCs auslösen** statt aus einer 100er-Liste am Brett:
  - NPCs schlagen vor/listen kontextuelle Aktionen je Büro.
  - Aktionen weit über reine Desinfo: **Kredit beim Finanz-NPC**; **Fokusgruppe/Zielgruppen-Abfrage mit eigenen Fragestellungen** (kostet Geld); **Dossiers über bestimmte Personen** (Ziel wählen).
  - Framing „Kommunikations-Schlachtfeld": nicht „bestelle Panzer", sondern **wohin/warum** (Bot-Netzwerk = Infrastruktur/Logistik). Beispiel-Kette: beliebten Politiker ins Visier → Dossier → Schwäche/**Kompromat** finden → Größe einschätzen → Einsatz wählen → über **eigenen Propaganda-Kanal** (früher aufgebaut) ODER an einen **YouTuber** (exklusiv, wächst, aber weniger Reichweite) → wird sichtbar → kann abgeschaltet werden.
  - **Gebäude wächst mit Fähigkeiten:** neue Türen/Büros öffnen sich (z. B. nach Aufbau eines Bot-Netzwerks → neues Büro + NPC, der das Netzwerk redaktionell steuert und Vorschläge macht). MadTV-Studio-Wachstum als Vorbild.
- **K41** ✅ Sprachebene: **natürlicher Umgangston** (keine deutsche Behörde) + dezenter trockener Witz, **passend zur jeweiligen Persona**. Dialoge sind ein **Kernstück der Atmosphäre** und begleiten die Entscheidungen (welche Maßnahme wann/wo/wie) → Entscheidungs-Dilemmata → viele Pfade. MadTV-Analogie: Wachstum (eigenes Studio → größere Produktion) muss spürbar werden.

---

## Querschnitt: Neue Arbeitsstränge (für die Mega-Update-Planung)

1. 🧩 **Visuelles Rework (höchste Prio, H26–H30):** Stil-Bibel (Auflösung fein-pixelig, Proportions-Realitäts-Check, Asset-Katalog, Modularität), ALLE Räume neu, 3-Schichten-UI, Pixel-Rahmen/Terminal/Scrollbalken, freie Pixel-Font, Tag/Nacht+Jahreszeiten, **Avatar-Transparenz lösen**, kaputte Publikums-Assets neu, Lobby als echte Halle, Avatar-Laufanimation.
2. 🧩 **Diegetische Bedienung:** Knopfbalken weg, Navigation per Tür/Fahrstuhl (inkl. Etagenwahl), Dashboard→Büro-Objekte, Dialoge/Aktionen/News an Möbeln, Broadcast permanent sichtbar (wegblendbar), HUD auf Knopfdruck, Narrativ-Tafel (animiert+ziehbar), 10 Modals→ein Rahmensystem.
3. 🧩 **Aktions-Überarbeitung (Spieltiefe):** viel mehr granulare, konkrete, benannte Aktionen; Ziel-/Parameter-Wahl (Dossier über wen, Kompromat einsetzen wie, Frage an Fokusgruppe); Aktions-Überschriften überall durchziehen; Simulation Richtung 100–500 Sieg/Verlier-Pfade; Gebäude-Wachstum schaltet Büros/NPCs frei.
4. 🧩 **Dialog-/Sprach-Mega-Update (K38, Schwerpunkt):** echte Gespräche, Aktionen aus Dialog, Persona-Stimmen, höheres sprachliches Niveau (starke Agenten), Direktor-Tageshinweise verständlich, Git-Verlauf nach alten Dialogen prüfen.
5. 🧩 **Atmosphäre-Konzept:** Flur-Details, Dummies (Reinigung/Pförtner), Tür-Animationen, anklickbare Flavor-Figuren mit Tooltips/Mini-Dialogen.
6. 🧩 **Gegenseite erzählerisch:** Einzelpersonen-Gespräche/Lageeinschätzungen zusätzlich zur Fokusgruppe (nur medial/extern, nie im Gebäude).
7. 🧩 **Sound adaptiv:** zustandsreaktive Musik (Sieg/Verlust/Ereignisse), Kulisse unter Musik.
8. ✅ **Inhalt:** explizit-fiktiv, reale Themen ohne echte Namen, dezente Moral-Töne.

## Offene Rückfragen an den Owner (von uns, mit Empfehlung)

- **A1-Randleiste:** Empfehlung — die Randleiste auf ein minimales, einklappbares **Menü-Symbol** (Pause/Ton/Version/Speichern) reduzieren; alles Spielrelevante diegetisch. OK?
- **B6-Anzahl Narrative:** Empfehlung folgt in der Planung (Tendenz **3**: genug für Verflechtung, ohne zu überfordern).
- **G25-Beispiel:** „leicht spürbar" = NPC sagt offen „Das fühlt sich falsch an, aber gut." · „dezent" = nur eine kurze Geste/Halbsatz/Pause, die man überlesen kann. Owner wählte **dezent**.
- **E19/I33:** geklärt (s. o.).

## Prozess-Hinweis (Owner)

Token-Ökonomie: Owner regt eine **frische Session** für das Mega-Update an. Dieses
Dokument + `SOUL.md` + `NEXT_LEVEL_PLAN.md` + `GESAMTKONZEPT_VISUELL.md` sind der
verlustfreie Übergabepunkt.
