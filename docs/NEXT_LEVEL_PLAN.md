# 🗺️ Next-Level-Plan — Konzepte K1–K13 und Umsetzungs-Wellen W1–W8

**Status:** Aktiv — kanonischer Arbeitsplan nach den Owner-Entscheidungen vom 2026-06-12
**Quellen:** `DECISIONS_2026-06-12_NEXT_LEVEL.md` (Entscheidungen) · Recherchen (MadTV/TVTower-Zeitökonomie, Desinformations-Realismus, Sprite-Animation, Engine-Durchrechnung)
**Zielbild:** Version „0.9" — vollständig wirkendes, durchspielbares, spannendes Spiel für die ersten Testspieler (Kriterien H45: zu Ende gespielt / „nochmal!" / Weiterempfehlung).

---

## Teil 1 — Konzepte (K)

### K1 · Tagesschleife & Spannung (A1, A2, A4, A5, E31) — Vorschlag zur Owner-Abnahme

**Was MadTV wirklich spannend machte (Recherche):** Nicht die Uhr an sich, sondern
(a) **Verbindlichkeiten mit Verfallsdatum** (Werbeverträge: nicht gesendet = Strafe statt Ertrag),
(b) **Wege kosten Zeit** (ein geteilter Fahrstuhl als berüchtigter Zeitfresser),
(c) der **Quoten-Abend** als fester Auswertungs-Moment,
(d) Tageszeiten mit eigener Logik (Primetime 20–23 Uhr).
Echtzeit ohne Pause war dort auch Frustquelle — das übernehmen wir bewusst NICHT.

**Vorschlag „Ereignis-Uhr statt Echtzeit":**
- Eine Phase (= Monat) wird als **ein Arbeitstag** inszeniert: 09:00 bis 18:00 („Redaktionsschluss").
- Die Uhr im HUD läuft **nicht von selbst** — sie springt durch Handlungen vor:
  Aktion ausführen ≈ 1,5 h · NPC-Gespräch ≈ 30 min · Etagenwechsel ≈ 10 min ·
  Fahrstuhl ≈ 5 min/Etage (der `timeCostMin`-Hook im Navigator liegt dafür bereit).
  Kein Hektik-Gefühl, aber jede Handlung „kostet den Tag".
- **Kein zweites Ressourcensystem:** Die vorhandenen Aktionspunkte WERDEN die Stunden
  (AP = Zeitblöcke, nur anders beschriftet/inszeniert). Engine bleibt unangetastet.
- **Verfallende Gelegenheiten als Spannungsquelle** (MadTV-Werbedeadline-Analogie):
  Die Engine kennt bereits Opportunity-Windows und Combos mit Verfall — diese bekommen
  sichtbare „läuft ab um 16:00"-Anzeigen. Weltereignisse (A5) platzen am Vormittag/Nachmittag
  herein: sofort reagieren (kostet Stunden) oder liegen lassen (Konsequenz am Folgetag).
- **Redaktionsschluss-Ritual (E31 + A4):** Ab 17:00 mahnt eine dezente Meldung; um 18:00
  (oder früher per Klick auf den Lobby-Ausgang) geht der Avatar sichtbar nach Hause →
  **Tagesfazit** („Lagebericht"): Publikums-Entwicklung, Wirkung der Maßnahmen
  klein/mittel/groß, Schlagzeilen der Gegenseite, Kennzahlen — danach Morgen des
  nächsten Tages (Monat +1, Tag/Nacht- und später Jahreszeiten-Wechsel A6).
- **Spät bestätigte MadTV-Details (Quelle: GameFAQs-FAQ/Manual):** ① Tagesende dort =
  automatischer Fahrstuhl-Abgang, der Folgetag beginnt **beim Boss** → unser Morgen
  kann analog mit einem 10-Sekunden-Direktor-Briefing starten (Tagesziel + Laune).
  ② MadTV hatte KEINEN Auswertungs-Bildschirm — Feedback lief kontinuierlich (stündliche
  Quoten-Pfeile, Image-Punkte als **Nullsummen-Pool von 100** zwischen den drei Sendern;
  unter 20 = Abwärtsspirale, 0 = Bankrott, 100 = Sieg). Unser Tagesfazit (A4) ist also
  eine bewusste Verbesserung, kein Zitat — und der Nullsummen-Pool ist ein elegantes
  Vorbild für „Deutungshoheit": unser Vertrauens-Wettrennen (K14) als Pool zwischen
  Ministerium und Institutionen denken. ③ MadTVs Live-Quoten-Anzeige war eine
  **animierte Familie vor dem Fernseher** — exakt unser Publikums-Wohnzimmer; es sollte
  daher dauerhaft den Live-Zustand spiegeln (tut es), nicht nur Ereignis-Reaktionen.
- **Weitere übertragbare Muster aus der Recherche:**
  ① *Rollierender Planungshorizont* (MadTV plante 2 Tage voraus): heute gebuchte
  Kampagnen wirken ab morgen — planbarer Rhythmus statt Deadline-Stress.
  ② *Wirkungs-Abnutzung*: wiederholte gleiche Maßnahmen verlieren Wirkung
  („Sendung wird schal") — zwingt zu Variation und provoziert Fehler ganz ohne Knappheit.
  ③ *Vorladungen*: gelegentlich ein unverschiebbarer Pflichttermin (Direktor,
  Ministerium) der Stunden kostet — sanfter Druck (MadTVs „Der Boss will Sie sehen",
  TVTower: 2-Stunden-Frist).
  ④ *Zahlvorschlag*: 8 Zeitblöcke/Tag, davon ~3 fürs Tagesgeschäft, ~5 frei.
- 💬 **Owner-Punkte zur Abnahme:** Stundenwerte/8-Blöcke ok? AP=Stunden-Gleichsetzung ok?
  Automatischer Heimweg um 18:00 oder immer per Klick? Abnutzungs-Mechanik gewünscht?

### K2 · Spielwelt: Ein großes föderales Land (B12, B13, D28) — Empfehlung liegt vor

**Empfehlung (aus der Recherche zu realer EU-Binnendynamik):** **Modell B** —
EIN großes föderales Land („Westunion" als Bundesstaat), aber mit eingebauter
**Koalitionslogik**: 4–5 Parlaments-Fraktionen, die je nach Thema Mehrheiten
bilden müssen (das repliziert die EU-Konsens-Dynamik national, ohne
Außenpolitik-Komplexität). **Regionen mit eigener Medienlandschaft** ersetzen
die Mitgliedsstaaten; **starke Institutionen** (Verfassungsgericht, unabhängige
Presse) sind das Countermeasure-System — ihre schleichende Unterhöhlung ist das
eigentliche Drama. Reale Muster, die als Mechanik einfließen können: Veto-/
Obstruktions-Spieler mit überproportionalem Hebel, „Friedens-Narrativ" als
mehrheitsfähige Spaltpilz-Karte, Energie-Abhängigkeit als Druckmittel,
Parallel-Foren für Prestige außerhalb des Konsenses.

**Publikums-Milieus (B13):** 8 moderne, westliche Archetypen liegen ausgearbeitet
vor (Sinus-angelehnt, je mit Verwundbarkeiten + Pixel-Art-Bildbeschreibung):
Die Optimiererin · Der Macher-Typ · Der digitale Bohemien · Die besorgte Mitte ·
Der abgehängte Zornige · Die grüne Idealistin · Der nostalgische Eigenheimer ·
Der neugierige Liberale. (Details im Recherche-Bericht; ersetzt die 6
sowjetisch wirkenden Figuren.) Dazu D28: Pförtner als „Stimme des eigenen
Landes" — bewusst klein. → Konzeptpapier zur Owner-Abnahme, danach
audience.json-Umbau + 8 neue Figuren-Sheets.

### K3 · „Gestützte Stimmen" im Broadcast (B10, A7) — Typen liegen vor

Keine „eigenen Agenten", sondern **gestützte/unwissende Mittäter**, die das
Zielland-Fernsehen von selbst einlädt (Echo-Prinzip B8). Aus der Recherche
(real belegte Muster: Tenet-Media-Fall, „Voice of Europe", RT-Gäste-Auswahl
nach Narrativ statt Expertise) sechs spielbare Typen mit Aufbau-/Auffliegen-Logik:

| Typ | Aufbau | Nutzen | Auffliegen durch |
|---|---|---|---|
| Bezahlter Influencer (unwissend) | Schein-Agentur + Geld | hohe Reichweite | Geldfluss wird publik → Kettenschaden |
| Ex-Politiker/Ex-General | teuer, Einladungen | Insider-Glaubwürdigkeit | Botschafts-/Zahlungs-Spur |
| Rand-Akademiker | günstig, Talkshow-Schübe | „Experten"-Etikett | Faktencheck der Institution |
| Finanzierte Schein-NGO | mittel, Tarnung | Vertrauen bestimmter Milieus | Transparenzregister |
| Ideologisch Überzeugter | kostenlos aktivierbar | selbstverstärkend, kaum diskreditierbar | eigene Ereignisse (Realität widerspricht) |
| Pseudo-Thinktank | langfristig | „Studien" als Zitatquelle für alle anderen | Domain-/Netzwerk-Analyse |

Gegenseite (A7) erscheint nur medial und **vielfältig** (mehrere Faktenchecker,
Zeitungen, ein Geheimdienst-Sprecher). → Konzeptpapier zur Owner-Abnahme, dann
MINISTRY_BROADCAST_CONCEPT.md erweitern.

### K4 · Fokusgruppe (B14 — neue Owner-Idee, ausbauen!)

Eigener Raum „Zielgruppen-Analyse": Videokonferenz-/Einwegspiegel-Ansicht mit
6–8 benannten Personas (Name, Mini-Geschichte, Milieu-Zugehörigkeit). Dort wird
das Publikum **persönlich**: Die Personas kommentieren die letzte Kampagne aus
ihrer Lebenswelt, Stimmungs-/Überzeugungswerte werden als Aussagen erlebbar.
Mechanisch read-only (wie Broadcast-Leiste), inhaltlich der Empathie- und
Erkenntnis-Ort. Kosten: 1 Raumbild + 8 Persona-Porträts + Dialogzeilen.
→ Kurzkonzept + building.json-Raum, nach K2 (Milieus zuerst!).

### K5 · Social-Feed im Newsroom (B15)

Eigenes Layout auf einem Büro-/Newsroom-Screen: scrollende Post-Kacheln,
Likes, Kommentar-Schnipsel, **Trending Topics** — zeigt die Reifung einer
Kampagne im social-Kanal. Datenquelle: vorhandene newsEvents + Broadcast-Items.
→ Nach K11 (Stil-Bausteine) bauen.

### K6 · Gebäude-Rework (E-Block — Korrektur des aktuellen Stands)

1. **Stadt-Silhouette** links/rechts, Gebäude schmaler als der Bildschirm (eigene
   Assets: Stadt-Tiles Tag/Nacht).
2. **Mehr Etagen** (z. B. 6–8: Dach/Technik, Spezial-Ops, Zentrale+Büro, Analyse
   (K4-Fokusgruppe!), Medien/Newsroom (K5), Erdgeschoss-Lobby, Keller) — Kamera
   fährt mit, nie alles auf einmal.
3. **Kein Röntgenblick:** Außenansicht zeigt Fassade mit Fenstern (Lichter an/aus,
   Silhouetten) + Türen — KEINE Raum-Interieurs. Räume öffnen sich erst beim Betreten.
4. **Proportionen:** Avatar ≈ 2/3 Raumhöhe an der Lauflinie; Möbel kleiner als
   Figuren. Betroffene Assets werden neu generiert/skaliert.
5. **Raum-Ansicht = MadTV-Nahsicht:** Beim Betreten Vollbild-Raum, NPC groß hinter
   dem Schreibtisch (Porträt-/Halbfigur-Komposition), kein Mini-Avatar im Raum.
6. **Laufzyklus reparieren** (Recherche liegt vor): Frame-genaue Posen-Prompts
   (Contact/Down/Passing/High), ±2–3 px vertikales Bobbing, `frameTime` an
   Laufgeschwindigkeit koppeln (kein „Foot Sliding"), Schritt-Sound auf
   Kontakt-Frames (Frame 0/4). Konkreter 3-Schritte-Plan dokumentiert.

### K7 · NPC-Tiefe & Dialoge (C17, A3-Gedanke, 0.9-Zielbild)

NPCs bekommen **Situation Awareness**: Dialoge greifen Spielstand auf (läuft
teils schon via Inserts), echte Gesprächsführung statt Button-Klicks („Was willst
du sehen?" beim Finanzer), **Aktionen aus dem Dialog heraus startbar** (der
Besuch lohnt sich inhaltlich — Prinzip 4: keine mechanische Belohnung nötig).
Langfristig-Gedanke des Owners: NPCs als „intelligentere Akteure" mit bilateralen
Folgen ihrer Entscheidungen. → Konzept + Dialog-Ausbau (größter Schreibanteil).

### K8 · End-Report (G44) — „der größte edukative Teil"

Bei Spielende: Auswertungs-Bildschirm(e) — genutzte Aktionen & Techniken,
ausgelöste Effekte/Gegenreaktionen, Publikums-Verlauf über 10 Jahre, erreichtes
Ende + verpasste Alternativen, Diagramme (Verlaufskurven, Sankey Aktion→Wirkung),
**kommentiert/interpretiert** in 3–5 Absätzen. Eigener Look erlaubt (gleiche
Farbwelt, nicht zwingend Pixel-Art). Datengrundlage: trustHistory + completedActions
+ Broadcast-Verlauf existieren bereits.

### K9 · Speichern & Anmelden (G40)

Stufe 1 (sofort): Verlassen-Warnung (beforeunload) + Autosave je Phase in
localStorage + „Weiterspielen" auf dem Title-Screen. Stufe 2: datenarmes Login
(z. B. Google) + Cloud-Save für ~20–30 Tester, mehrere Spielstände — die
archivierte Netlify-Functions/Upstash-Infrastruktur (`archive/pro-mode/`) ist der
Startpunkt. DialogLoader-Zustand wandert mit ins Save-Format (bekannter Fund).

### K10 · Avatar-Wahl & Spielfeinheiten (D27)

Titel→„Neue Mission": Auswahl aus 6 Porträts (m/w × jung/mittel/alt, Pipeline-Lauf)
+ Namenseingabe. Porträt erscheint im Spiel (Dienstausweis im Büro; bei Erfolg
gerahmt an der Wand — erster Eintrag der **Spielfeinheiten-Mini-Roadmap**, die als
eigenes lebendes Doc ~2 Dutzend kleine, spielverlaufs-gebundene Details sammelt).

### K11 · Stil-Vollendung (Prinzip 1, E30/E35, B15-Anmerkung)

Alle Legacy-CSS-Flächen in den Pixel-Stil überführen: Dialogbox-Rahmen, Seiten-
Panels, HUD-Leisten, Buttons, Pixel-Icons statt Emojis (ein Pipeline-Lauf
`icon_*`-Assets), Modals. Bausteine: 9-Slice-Rahmen-Assets + Icon-Set. Texte
bleiben flexible Ebene (Skalierung E35). Aufräum-Kriterium: kein sichtbares
Element mehr „aus dem alten Entwurf".

### K12 · Audio-Ausbau (F36/F37/F39)

Raum-Ambiences (je Raum kurzer Loop: Lobby-Hall, Keller-Brummen, Newsroom-Getippe),
2–3 weitere Musik-Loops, Lautstärke-Mixer (Musik/SFX/Stimmen) im Pausenmenü +
Title. Dezenter Einzelton am Aussage-Ende statt Typing-Sound (Vorschlag, abschaltbar).

### K14 · Balancing: Gewinnen UND Verlieren möglich machen (Owner-Frage „durchrechnen")

Die Durchrechnung (`BALANCING_ANALYSIS_2026-06-12.md`) zeigt: aktuell gewinnt
jede Strategie fast sicher (oft Phase 6–8 von 120), verlieren ist unmöglich
(Risiko erreicht nie die Enttarnungsschwelle). 8 priorisierte Stellschrauben
liegen vor — die zwei wichtigsten: **Vertrauens-Regeneration durch Verteidiger**
(macht ein Wettrennen daraus) und **Risiko-Abbau senken** (macht Enttarnung
real). K14 gehört VOR K1-Umsetzung: erst echte Spannung in der Mathematik,
dann die Tagesrhythmus-Inszenierung obendrauf.

### K13 · Vertonungs-Roadmap (D24)

Stufenmodell: ① bereits vertonte 51 Zeilen bleiben; ② nach Dialog-Stabilisierung
(K7) die Platinum-Kerntexte (Begrüßungen + häufigste Reaktionen, geschätzt
~150–200 Zeilen) in einem Batch; ③ Voll-Vertonung erst mit Lokalisierung (D26).
Vor jedem Batch: Kostenabschätzung an Owner (Budget-Leitplanke G43).

---

## Teil 2 — Umsetzungs-Wellen (W) mit Abhängigkeiten

| Welle | Inhalt | Hängt ab von | Größe |
|---|---|---|---|
| **W1 Sofort** | ✅ ERLEDIGT 2026-06-12: Autosave je Phase + Verlassen-Schutz · Version 0.9.0 + Changelog-Overlay · HUD-Hierarchie mit Risiko-Puls · Laufzyklus (neues Walk-Sheet, Speed-Kopplung, Kontakt-Frame-Sounds) · `ministryRed` | — | ✅ |
| **W2 Konzept-Paket** | K1-Feinschliff, K2, K3 als Owner-Vorlagen (je 1–2 Seiten, einfache Sprache); Balancing-Analyse liegt bei | Recherchen ✅ | M |
| **W3 Gebäude-Rework** | ✅ ERLEDIGT 2026-06-13 (PR #75): kein Röntgenblick (Flure+Türen), Stadt-Silhouette, 6 Etagen, Proportionssystem (Avatar ×4), Raum-Nahsicht (NpcRoomView), reparierter Laufzyklus | — | ✅ |
| **W4 Spannung & Tagesschleife** | ✅ ERLEDIGT 2026-06-13: K14-Stellschrauben 1–4 (Simulations-Nachweis) + K1 vollständig (Ereignis-Uhr, Zeitkosten, Redaktionsschluss→Heimweg→Tagesfazit, Morgenbriefing). OFFEN: K14-Stellschrauben 5–8 (späterer Balancing-Pass mit Spielertests) | ✅ | ✅ Kern |
| **W5 Welt & Publikum** | ✅ K2 (1 föderales Land Westunion, 8 moderne Milieus + Figuren) · ✅ K4 Fokusgruppe · OFFEN K3-Stufe-1 (Gegenseite medial: Faktencheck-/Pressevielfalt) — braucht K3-Konzept-Abnahme | K2 ✅ | teils ✅ |
| **W6 Stil-Vollendung** | ✅ K5 Social-Feed (Newsroom) · ✅ K12 Audio (Mixer, Raum-Ambiences, Dialog-Endton, 2 Musik-Loops) · OFFEN K11 (3-Schichten-UI, Pixel-Rahmen, Icon-Einbau) — **blockiert durch Owner-Fragen 1–3** (UI-Schichten) | Fragen 1–3 | teils ✅ |
| **W7 Tiefe** | ✅ K10 Avatar-Wahl + Dienstausweis · OFFEN K7 NPC-Dialoge/Aktionen-aus-Dialog (**Fragen 38–41**) · K13-Stufe-2 Vertonung | Fragen 38–41 | teils ✅ |
| **W8 Abschluss 0.9** | ✅ K8 End-Report · OFFEN: K9-Stufe-2 Login/Cloud-Save · Balancing-Pass · Test-URL/Domain (H47) · Playwright-CI (G41) | alles | teils ✅ |

**Stand 2026-06-13:** Alle ohne Owner-Rückfrage umsetzbaren, beschlossenen Punkte sind
gebaut (W1–W4 komplett; W5/W6/W7/W8 so weit, wie ohne die offenen Fragen möglich).
Die verbleibenden Brocken **hängen an `FRAGEN_2026-06-13.md`**: K11/E30-Icon-Einbau
(Fragen 1–3, UI-Schichten) und K7-Dialogtiefe (Fragen 38–41). K3 (gestützte Stimmen)
braucht die Konzept-Abnahme. Diese drei sind der nächste Schritt, sobald das
Transkript vorliegt.
