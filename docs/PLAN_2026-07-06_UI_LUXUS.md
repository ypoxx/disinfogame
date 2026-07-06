# 🏛️ PLAN 2026-07-06 — UI/UX-Luxus-Paket („Komplett Luxus")

**Status:** Vom Owner beschlossen (Chat 2026-07-06: „Ich will das Komplett Luxus Paket.").
Budget-Freigabe für Generierung liegt vor. **Vorgeschichte:** `VISUAL_REVIEW_2026-07-05.md`
(§2b blinder Fleck UI-Materialwelt, §6 Paket D) — Paket D geht in diesem Plan auf.
**Erster Schritt L0 (Stil-Lock) läuft bereits** — Mockups liegen dem Owner zur Wahl vor.

---

## 1. Leitidee

**Jede Bedienfläche bekommt einen Ort und ein Material in der Ministeriums-Welt.**
Nicht „Panels umfärben", sondern die Drei-Schichten-Regel (§4.4) vollenden: Bedienung
= Gegenstand (Akte, Klemmbrett, Terminal, Telefon), Text bleibt Engine-Ebene (E35),
Spiel-UI nur noch als schmaler Rand. Damit lösen sich die Struktur-Reste V2 (Berater-
Sidebar), V6 (Floating-Widgets) und V14 (Web-Sidebar) nicht kosmetisch, sondern konzeptionell.

## 2. Das diegetische Mapping (kanonisch für alle Etappen)

| Heute (Software-Kasten) | Wird zu (Gegenstand) | Etappe |
|---|---|---|
| Aktionen-Seitenleiste („88 verfügbar") | **Terminal**: Vollbild-Röhren-Arbeitsplatz am Schreibtisch; Maßnahmen als Vorgangs-Karten mit Wirkung+Preis+FRISCH/BEKANNT/VERBRANNT-Stempel (M1); anlassbezogene Auswahl zuerst, Katalog in der „Archiv"-Schublade (M2) | L2 |
| Aktionen-Warteschlange (Floating-Widget) | **Karten am Korkbrett**: Geplantes hängt angeheftet an der Narrativ-Tafel; Verfallsdaten als rote Fäden; Anheft-Animation | L3 |
| Berater-Sidebar + Detail-Modal | **Karteikasten/Personalakten** im KONTAKTE-Panel: Akte ziehen = Details; Empfehlungen als Notizzettel; Groll/Moral als Stempel in der Akte (löst V2 strukturell) | L4 |
| HUD-Zahlenleiste (H) | **Objekt-Leiste**: Sonntagsfrage = Umfrage-Ticker (Zeitungsschnipsel) · Abwehr = Lagekarte/Barometer · Kasse = Kassenbuch · Tag = Abreißkalender; Alarm-Zustände als rote Stempel/Lampen | L5 |
| Tagesfazit (DayReport) | **Abendzeitung/Fernschreiber-Ausdruck** (inkl. P3-Umbau: Sonntagsfrage/Abwehr statt Alt-Metriken) | L6 |
| Morgenbriefing | **Aktenmappe** klappt auf dem Schreibtisch auf; blockiert Eingaben (behebt B5) | L6 |
| Krisen-/Gegenmaßnahmen-/Verrats-Modals | **Rotes Telefon · Telegramm · Eilmeldung** — Dringlichkeit = Objekt | L6 |
| Pausenmenü (Web-Slider) | **Dienstplan-Tafel** mit Pixel-Reglern | L1 |
| ComboHints-Widget (V6) | Zettel am Korkbrett | L3 |

## 3. Etappen (jede: Gate grün + Ernte-Vergleich vorher/nachher)

> **Vorbedingung:** das Sofort-Paket aus dem Review (P1 Schärfe/Fonts, P2 Boden/Türen,
> P4 Text-Sweep) läuft VOR L1 — sonst wird auf matschiger Basis umgekleidet.

| Etappe | Inhalt | Aufwand | API-Budget |
|---|---|---|---|
| **L0 Stil-Lock** ✅ **ENTSCHIEDEN: „A — Behörden-Akte"** | 3 Materialwelten als Mockups generiert (0,80 $); Owner-Wahl 2026-07-06: **Behörden-Akte** → als **§4.7** in der Stil-Bibel verankert; L1 zieht `theme.ts` auf Papier-Token um | ✅ erledigt | 0,80 $ |
| **L1 Material-Kit + Umkleiden** | 9-Slice-Rahmen (leicht/standard/alarm), Panel-/Kopfband-Texturen, Pixel-Balken, Stempel-Badges, Klemmbrett; ALLE bestehenden Panels/Modals umgekleidet (CSS bleibt, Material wird Pixel); Pausenmenü-Regler | 1 Session | ~3–5 $ |
| **L2 Terminal (Herzstück 1)** | Vollbild-Terminal ersetzt Aktionen-Sidebar; M1-Karten; M2-Kuratierung; Porträt-/Filter-Zeile; Tastatur-/CRT-Klang | 1–2 Sessions | ~5–8 $ |
| **L3 Korkbrett = Planung (Herzstück 2)** | Queue → angeheftete Karten; rote Verfallsfäden; Anheft-/Abnehm-Animation; ComboHints als Zettel | 1–2 Sessions | ~4–6 $ |
| **L4 Kontakte-Konsolidierung** | Karteikasten + Personalakten; Berater-Rand-Tab entfällt; Grievance/Advisor-Detail als Akten-Seiten | 1 Session | ~3–5 $ |
| **L5 HUD diegetisch** | Objekt-Leiste (Ticker/Lagekarte/Kassenbuch/Kalender) + Alarm-Zustände (Puls als Lampen) | 1 Session | ~4–6 $ |
| **L6 Tageszyklus & Modals** | Zeitung/Fernschreiber, Briefing-Mappe (blockierend), Telefon/Telegramm/Eilmeldung; integriert Review-P3 (Enden-/Alt-Metriken-Umbau) | 1 Session | ~5–8 $ |
| **L7 Bewegung & Klang** | Anheften, Stempeln, Aktenklappen, Wählscheibe; SFX-Batch via ElevenLabs (Papier, Stempel, CRT, Telefon) über die bestehende Sound-Architektur | 1 Session | SFX-Batch (Pipeline-Budgets) |
| **L8 UX-Härtung + Playtest** | Onboarding-Führung neu (Anschluss ans beschlossene Tag-0-Hoax-Tutorial!); 3–5 Testspieler am Deploy-Preview; Ernte-Gesamtvergleich; Verbotsliste-Sweep | 1 Session + Testzeit | — |

**Gesamt: 6–8 Bau-Sessions · API-Bilder ~40–80 $ · SFX im Pipeline-Budget.**
(Die Bild-Kosten sind Cent-Beträge pro Stück; die Währung sind die Sessions.)

## 3b. Owner-Aufträge vom 2026-07-06 (nach Merge-Entscheid — BINDEND)

**(a) Doppel-Review-Kontrakt — gilt für JEDE Etappe dieses Plans:**
Abnahme erst, wenn BEIDE Reviews grün sind:
1. **Implementierungs-Review:** adversariales Code-Review des Etappen-Diffs
   (Korrektheit, M8-Gerüst, keine Verbotslisten-Verstöße im Code).
2. **Visuelles Review:** Harvest-Lauf (`scripts/visual-review/`) über die berührten
   Screens inkl. Clips + Boden-Linien-Overlays + Gemini-Zweitmeinung, Befunde
   adversarial verifiziert — wie im Gesamt-Review 2026-07-05.
Zu Beginn der frischen Session zusätzlich EINMALIG: kurze Recherche „State of the
Art" (diegetische Game-UI-Praxis, Pixel-Perfect-/Integer-Scaling-Techniken inkl.
devicePixelRatio/Letterboxing, lebendige NPC-Routinen in Aufbauspielen) →
1-Seiten-Memo, fließt in Auflösungs-Etappe, L1/L2 und LB ein.

**(b) Auflösungs-Etappe (Pflicht, FRÜH — Teil des Sofort-Pakets vor L1):**
- §4.1 wirklich herstellen: Welt-Bühne nur ganzzahlig skalieren (480×270 × N,
  Letterbox/Rand-Ausgleich statt krummem `cover`/Faktor 0,544) — der größte
  Schärfe-Gewinn des ganzen Vorhabens (Review B1).
- Raum-Nahsicht + NPC-Halbfiguren auf saubere Skalen; Porträt-Zuschnitte der
  Avatar-Wahl vereinheitlichen (Paket-D-Re-Framing); Hi-Res-Avatar-Frage (V16)
  hier entscheiden.

**(c) Neue Etappe LB „Lebendiges Gebäude" (nach L1, vor oder parallel zu L2):**
Owner-Befund: Statisten wirken unnatürlich — „wenige Schritte links/rechts" und
Ein-/Ausfaden. Soll-Verhalten:
- **Freie Wege:** Statisten laufen echte Routen über die ganze Etage (Ziel = Türen/
  Räume), nicht Pendel-Animationen. Technik: den vorhandenen `BuildingNavigator`
  wiederverwenden (pure TS, getestet, kennt doorX/Etagen/Fahrstuhl) — Ambient-NPCs
  werden Navigator-Instanzen mit ruhigem Tempo statt CSS-Keyframes.
- **Kein Ein-/Ausfaden:** Figuren ERSCHEINEN aus sich öffnenden Türen und
  VERSCHWINDEN in ihnen (bestehende RoomDoor-Auf/Zu-Blende + Z-Reihenfolge nutzen;
  Tür-Dummies und `bs-door-traffic`-Opacity-Zyklen werden ersetzt).
- Reinigung wandert Etagen ab (Fahrstuhl-Nutzung optional als Ausbaustufe);
  Frequenz ruhig — Bewegung ist Gefühl/Rhythmus, keine Unruhe (SOUL §3.4).
- **Akzeptanz:** 30-s-Clip je Etage ohne Fade-Artefakte und ohne Teleports;
  Statisten bleiben `pointer-events`-frei bzw. klickbar wie bisher; Geometrie-Audit
  weiterhin 0 Standlinien-Befunde; Doppel-Review-Kontrakt (a) erfüllt.

## 4. UX-Entscheidungen dieses Plans (Owner kann einsprechen)

1. **EIN Planungs-Ort:** Das Terminal WÄHLT Maßnahmen, das Korkbrett PLANT/ZEIGT sie.
   Die Seitenleiste „Aktionen" entfällt ersatzlos (heute dritter Parallelweg).
2. **Berater geht in KONTAKTE auf** (STATUS-V2-Rest wird damit geschlossen).
3. **HUD bleibt auf Taste H** — aber als Objekt-Leiste, nicht als Zahlenband.
4. **Kein Text in Assets** (E35): alle Generierungen „almost no text, placeholder marks".
5. **M2 im Terminal:** anlassbezogene Auswahl (3–8) ist die Eingangstür; der volle
   Katalog liegt bewusst eine Schublade tiefer („Archiv").

## 5. Risiko-Register

- **Adapter-Monolith:** UI-Umbau berührt `StoryEngineAdapter` NICHT (reine Ansicht);
  parallele Agenten nie gleichzeitig auf `StoryModeGame.tsx`.
- **M8-Gefahr** (15+ Komponenten): Etappen strikt seriell, nach jeder Etappe Gate
  (`tsc·vitest·build`) + Ernte-Vergleich mit dem Visual-Review-Harness.
- **Save-Kompatibilität:** unberührt (keine Engine-/Datenänderung außer L6-P3-Texten).
- **Vision-QC-Pflicht** für jedes generierte Asset (pixel-asset-pipeline-Skill-Regeln:
  Isolation, Trimmen, flach-frontal, Wand-Fuß-Linie sinngemäß für UI: Kachel-Nahtlosigkeit).
- **Owner-Loop:** nach L1 und nach jedem Herzstück Preview-Sichtung; Playtest erst L8.

## 6. Definition of Done („Komplett Luxus" ist fertig, wenn …)

- Kein Bedienelement mehr als „Webseite" lesbar (Verbotsliste-Sweep ohne Befund);
  V2/V6/V14 geschlossen.
- §4.7 Materialwelt kanonisch in der Stil-Bibel; `theme.ts` auf Material-Token umgezogen.
- M1 an jedem Entscheidungspunkt (Wirkung+Preis+Stempel vor dem Klick), EIN Planungs-Ort.
- Bewegung+Klang an den fünf Kern-Interaktionen (wählen, anheften, stempeln, Akte, Telefon).
- Playtest-Protokoll (3–5 Tester) ohne Bedien-Blocker; Ernte-Vorher/Nachher im Doc.
- Gate + beide Sim-Gates unverändert grün.

## 7. Kickoff-Prompt für die nächste Bau-Session

> „Lies SOUL.md → STATUS.md → VISUAL_REVIEW_2026-07-05.md (§2, §2b, §6) →
> PLAN_2026-07-06_UI_LUXUS.md (BESONDERS §3b: Doppel-Review-Kontrakt, Auflösungs-
> Etappe, LB ‚Lebendiges Gebäude') → GESAMTKONZEPT_VISUELL.md §4.7 (Stil-Lock:
> **Behörden-Akte**). PR #95 ist gemergt — starte einen frischen Branch von main.
> Reihenfolge: (0) State-of-the-Art-Memo (§3b a) → (1) Sofort-Paket-Rest inkl.
> **Auflösungs-Etappe/Integer-Scaling** (§3b b) → (2) L1 Papier-Material-Kit
> (Prompts nach §4.7-Pflichten, Vision-QC) + alle Panels umkleiden → (3) LB
> ‚Lebendiges Gebäude' (§3b c) → (4) L2 Terminal. JEDE Etappe: Gate grün +
> Doppel-Review (Code adversarial + Harvest-Vision-Review) VOR dem Weiterziehen;
> Standlinien-Trio (B6/B7/B8) und Stil-Lock sind bereits erledigt."
