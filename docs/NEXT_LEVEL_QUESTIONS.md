# ❓ Fragen für das nächste Level — Owner-Entscheidungen & Diskussionsstoff

**Status:** Offene Fragen (2026-06-12), gesammelt nach Abschluss aller Phasen V0–V7
**Zweck:** Das Spiel ist spielbar/testbar. Diese Fragen heben es auf das nächste
Niveau. Antworten gerne häppchenweise — jede Frage ist einzeln entscheidbar.
Priorisierung: 🔴 blockiert Spieltests-Erkenntnisse · 🟡 nächster Sprint · ⚪ später.

## A — Kernschleife & Spannung (MadTV-DNA)

1. 🔴 Soll Bewegung Spielzeit kosten (TVTower-Prinzip)? Wenn ja: Tage/Stunden-Modell oder abstrakte „Zeiteinheiten je Phase"?
2. 🔴 Was ist der EINE Spannungsbogen einer Phase: AP-Verknappung, tickende Uhr, oder beides?
3. 🟡 Sollen NPC-Besuche (physisch hingehen) mechanisch belohnt werden — z. B. Rabatt auf Aktionen des besuchten NPC?
4. 🟡 Braucht endPhase einen Pflicht-Moment (Wochenschau/Quoten-Abend wie MadTV) oder bleibt der Übergang sofort?
5. 🟡 Wie häufig sollen Welt-Ereignisse aktiv in die Bühne eingreifen (Sondersendung unterbricht das Spiel) statt nur im Panel zu liegen?
6. ⚪ Soll es ein „Tag/Nacht"-Ambiente im Gebäude geben (Lichtwechsel je Phase)?
7. ⚪ Konkurrenz-Sichtbarkeit: Bekommen Gegenspieler (Faktenchecker, Geheimdienst) eigene Räume/ein eigenes Gebäude?

## B — Broadcast & Publikum (Konzept-Diskussion aus MINISTRY_BROADCAST_CONCEPT.md §5)

8. 🔴 Diegese: Bleibt der Bildschirm „Echo der Zielgesellschaft" (Empfehlung) oder senden wir eigene Propaganda-Formate?
9. 🔴 Soll Publikums-Resonanz (Quote/Stimmung) in die Mechanik zurückwirken oder Anzeige bleiben? (Wenn ja: Balancing-Sitzung.)
10. 🟡 Talkshow-Format: NPC-/Persona-Porträts im Studio-Set — eigene „Agenten"-Porträts generieren oder NPC-Porträts nutzen?
11. 🟡 Wer pflegt das Aktion→Thema/Kanal-Mapping: neue Felder in actions.json (Empfehlung) oder weiter Code-Tabelle?
12. 🟡 Zweites Land (gallia): Umschalter im Wohnzimmer, eigenes Wohnzimmer, oder Fokus-Land je Mission?
13. 🟡 Passen die 6 Figuren-Archetypen zu den Segmenten (z. B. „Beamter" = ängstliches Land-Milieu) oder 6 passgenaue Figuren generieren?
14. ⚪ Sollen einzelne Publikums-Figuren wiederkehrende „Charaktere" mit Namen werden (stärkere Empathie, mehr Pflege)?
15. ⚪ Social-Feed-Format (scrollende Post-Kacheln) für den social-Kanal — eigenes Layout bauen?

## C — Bildungszweck & Reflexion (Psychologie-Gutachten)

16. 🔴 Technik-Enttarnung nach Aktionen (Name + Erkennungsmerkmal der Persuasions-Technik): als dezenter Toast, als Teil des Feedback-Dialogs, oder abschaltbar in den Optionen?
17. 🔴 Wochenschau-Debrief: nur Bilanz („X verunsichert") oder zusätzlich je 1 reale Fallreferenz pro Phase?
18. 🟡 Soll die moralische Last sichtbarer werden (z. B. Spiegel-Momente im Büro, Träume, NPC-Kommentare)?
19. 🟡 Zielgruppe präzisieren: Schulen (Lehrkräfte-Material? Klassenraum-Modus?) vs. Selbstlerner — das entscheidet über Reflexions-Tiefe und Sprache.
20. 🟡 Brauchen illegale Aktionen eine stärkere visuelle „Schwelle" (Warnrahmen, NPC-Zögern), damit die Wahl bewusst ist?
21. ⚪ Whistleblower-Pfad (moralische Erlösung): eigener kurzer Story-Arc mit eigenen Assets?
22. ⚪ Quellen-/Literaturverzeichnis in der Encyclopedia für Lehrkräfte?

## D — Inhalt & Narrativ

23. 🟡 Direktor-Dialog nach der Ankunft: aktuell die generische Begrüßung — eigene geskriptete Erstbegegnungs-Szene (mit Wahlmöglichkeiten) schreiben?
24. 🟡 Sollen die 51 vertonten npcs.json-Zeilen die Platinum-Dialoge ersetzen/ergänzen (heute spricht Audio nur im Fallback-Pfad — Hauptpfad ist stumm)? Optionen: a) Platinum-Texte vertonen (~200 Zeilen TTS), b) npcs.json-Zeilen in den Hauptpfad mischen, c) stumm lassen.
25. 🟡 Story-Beats je Spieljahr (MadTV hat Ereignis-Dramaturgie): 10 Jahres-Meilensteine definieren?
26. ⚪ Lokalisierung: Englisch vollständig ausbauen (label_en existiert teils) — wann?
27. ⚪ Spielfigur: anpassbar (Name/Geschlecht/Porträt) oder bewusst anonym „Sie"?
28. ⚪ Lobby-Pförtner: gemalt im Hintergrund — soll er ein interaktiver Flavor-NPC werden (Smalltalk, Gerüchte)?

## E — UX/UI (aus dem UX-Gutachten, noch offen)

29. 🟡 HUD-Hierarchie: RISIKO und KAPAZITÄT prominent, MORALISCHE LAST sekundär — einverstanden?
30. 🟡 Emojis (Tab-Leiste, Panels) durch generierte Pixel-Icons ersetzen — ein Pipeline-Lauf, einheitlicher Look. Ja?
31. 🟡 „PHASE BEENDEN": Bestätigungs-Dialog gewünscht (verhindert Fehlklicks) oder bewusst reibungslos?
32. 🟡 Mobile/Tablet: Welche Mindest-Plattform für die ersten Tester (Desktop only? iPad Landscape laut altem Ziel)?
33. ⚪ Vollständige Tastatur-Spielbarkeit (Gebäude-Navigation per Pfeiltasten) als Accessibility-Ziel?
34. ⚪ Farbenblind-Modi (Stimmungs-Färbung des Publikums ist farbcodiert)?
35. ⚪ UI-Skalierungsoption (Pixel-Schriften sind klein auf 4K)?

## F — Audio

36. 🟡 Mehr Ambient-Variation: je Etage/Raum eigener Loop (Keller-Brummen, Lobby-Hall) — 3–4 weitere Musik-Läufe?
37. 🟡 Lautstärke-Mixer (Musik/SFX/Stimmen getrennt) in den Optionen?
38. ⚪ Direktor-Stimme „Max Mustermann - Ernst" gefällt? Alle 5 Stimmen einmal anhören und Casting absegnen (MP3s unter public/assets/sounds/voice_*).
39. ⚪ Schreibmaschinen-Sound beim Dialog-Typing-Effekt?

## G — Technik & Qualität

40. 🟡 Save-Format erweitern: DialogLoader-Zustand (Emotional Memory) mitsichern — jetzt machen oder mit nächster Save-Migration?
41. 🟡 Playwright-Smoke als CI-Schritt (GitHub Action) — einrichten?
42. 🟡 `sovietRed` → `ministryRed` Umbenennung (rein mechanisch) — freigeben?
43. ⚪ Bundle-Splitting (Build warnt vor Chunk-Größe) — Ziel-Budget definieren?
44. ⚪ Telemetrie für Spieltests (anonym: Abbruchpunkte, Phasen-Dauer) — wollen wir das, und datenschutzkonform wie?

## H — Spieltest-Organisation (nächster konkreter Schritt)

45. 🔴 Wer sind die ersten 3–5 Testspieler, und was ist die EINE Frage, die der Test beantworten soll (Verständlichkeit? Spannung? Bildungseffekt?)
46. 🟡 Feedback-Kanal im Spiel (Mail-Link/Formular auf dem Title-Screen)?
47. 🟡 Deploy-Ziel für Tester: Netlify-Preview des PR oder eigene Test-URL?
48. ⚪ Versionsnummer/Changelog sichtbar im Spiel pflegen (aktuell „v0.9" hart codiert)?

---

*Bewusst unter 100 geblieben: 48 Fragen, dafür jede einzeln entscheidbar und
keine Doppelungen. Die 🔴-Fragen (1, 2, 8, 9, 16, 17, 45) bestimmen, was die
ersten Spieltests überhaupt messen können — Empfehlung: diese sieben zuerst.*
