# 🎨 Gesamtkonzept Visuell — die „Verfassung" gegen den Frankenstein

**Status:** Kanonisch nach Owner-Abnahme der 🔴-Fragen (s. `FRAGEN_2026-06-13.md`)
**Quelle:** Dreier-Experten-Panel (Game Design · Inhalt · UX/Art) 2026-06-13, auf Basis
aller Owner-Entscheidungen, Screenshots und Code-Stichproben
**Kern-Diagnose:** Der „Frankenstein" hat EINE Wurzel — es wurde nie entschieden, was
**Welt**, was **diegetisches Bedien-Objekt** und was **Rand-UI** ist. Also brachte jede
Komponente ihren eigenen Stil mit (Foto-Räume, Web-HUD, Brutalismus-Dialoge, Emojis,
Terminal-Font). Dieses Dokument ist der eine Hebel dagegen.

---

## 1. Frankenstein-Audit (Ist-Stand, 13 Befunde)

🔴 = bricht Kohärenz hart · 🟡 = spürbarer Stilbruch · ⚪ = Detail

| # | Station | Kollision | Schwere |
|---|---|---|---|
| 1 | Title | Foto-Look-Gebäude vs. CSS-Punkt+Helvetica vs. Pixel-Welt dahinter | 🟡 |
| 2 | Arrival/Lobby | Querschnitt = „Setzkasten" aus Foto-Interieurs; Avatar ein Punkt | 🔴 |
| 3 | Gebäude | **Röntgenblick** (verstößt gegen Prinzip 2) + Foto-Räume vs. Pixel-Avatar; keine Stadt | 🔴 |
| 4 | Proportionen | Avatar ≈ 29 % der Raumhöhe (Soll ≈ 60 %); „Ameise vor Möbel-Fotos" | 🔴 |
| 5 | Spielerbüro | **Positiv-Anker** (sauberer Pixel-Raum) — kollidiert aber mit Foto-Vignetten des Gebäudes | 🟡 |
| 6 | HUD | Flache Web-Leiste + Emoji-Icons über der Pixel-Welt | 🔴 |
| 7 | View-Umschalter | Emoji-Web-Tabs („🏢 Gebäude…") mitten im Bild | 🔴 |
| 8 | Seiten-Panels/Berater | Eigener CSS-Brutalismus (border-4, harte Schatten) — drittes Idiom | 🟡 |
| 9 | Broadcast-Leiste | Eigener Rahmen-Stil als viertes Bild-Vokabular | 🟡 |
| 10 | DialogBox | CSS-Brutalismus + CSS-gezeichnetes Fallback-Gesicht | 🔴 |
| 11 | ~10 Modals | Jeweils eigene Brutalismus-Variante, kein gemeinsames Rahmen-System | 🟡 |
| 12 | Terminal-Reste | globales `font-mono`, CRT-Versalien-Ästhetik | ⚪ |
| 13 | Icons gesamt | Emojis + Unicode + geplante Pixel-Icons gemischt | 🔴 |

Panel-Konsens: Priorität 1 = Schichten-Regel (§4) — heilt 6, 7, 8, 10, 11, 13 gemeinsam.
Priorität 2 = Gebäude-Rework K6 — heilt 2, 3, 4.

## 2. Muster-Übertragung (MadTV-Funktion → unsere Ausprägung)

| MadTV-Muster | Funktion | Bei uns |
|---|---|---|
| Sendeplan-Raster | sichtbares Planungs-Artefakt | **NARRATIV-TAFEL** (Korkbrett im Büro): 2–3 laufende Narrative als Spuren, Maßnahmen-Karten werden angeheftet |
| Werbevertrags-Deadlines | Verbindlichkeiten mit Verfallsdatum | **Gelegenheits-Fenster** als rote Fäden mit Ablaufdatum auf der Tafel („Wahl in 3 Tagen", „Leak bis Freitag") |
| Quoten-Familie | Live-Feedback als Menschen | Publikums-Wohnzimmer (da) + K2-Milieus + K4-Fokusgruppe |
| Image-Nullsummen-Pool | Wettkampf-Metrik | **Deutungshoheits-Pool** Ministerium ↔ Institutionen (K14-Wettrennen als HUD-Balken, KEIN Gegner-Gesicht) |
| 3 Rivalen im Haus | Rivalität/Reibung | **Trägt NICHT** (Owner A7). Ersatz: diffuses Abwehr-Ökosystem (medial, K3) + interne Reibung (NPC-Moral/Verrat) — realistischer fürs Thema |
| Betty-Romanze | reputationsgekoppelter Langzeitbogen | NPC-Beziehungsbögen (K7), keine Romanze, gleiche Funktion |
| Filmeinkauf/Auktion | Ressourcen-Wettlauf | „Gestützte Stimmen" anwerben (K3): begrenzt verfügbar, Timing-Fenster, kein Bietgefecht |
| Boss-Vorladung | Pflicht-Rhythmus | Direktor-Morgenbriefing + gelegentliche Ministeriums-Vorladung (kostet Zeitblöcke) |
| Fahrstuhl-Engpass | Reibung/Tempo | Wege kosten Zeitblöcke (K1) — Tempogefühl ohne Warte-Frust |

**Herzstück-Entscheidung (Panel-Konsens): Die Narrativ-Tafel ist unser „Sendeplan".**
Sie ist diegetisch schon da (Korkbrett im Pixel-Büro), macht Planung anfassbar,
zeigt Verbindlichkeiten und Narrativ-Reifung — und die heutige Aktions-Liste wird
ihr INHALT statt ein paralleles Panel. Warnung des Game-Designers: Karten müssen
anfassbar wirken (heften), sonst ist es ein verkleidetes Dropdown.

## 3. Nordstern: Ein Spieltag (Kurzfassung)

09:00 Ankunft (Gebäude als Gebäude in Stadt-Silhouette, nur Fassade/Türen; Pförtner-
Gerücht) → 09:10 Direktor-Briefing (Tagesziel, Laune) → 09:20 Narrativ-Tafel im Büro
(2 Fäden, ein rotes Verfallsdatum, ~8 Zeitblöcke) → Entscheiden & riskieren (NPC groß
hinter Schreibtisch, Aktion aus Dialog; Risiko pulsiert; Institutionen gewinnen täglich
Vertrauen zurück = Wettrennen) → mittags platzt eine Sondersendung herein (Publikum
kippt sichtbar) → 17:00 Redaktionsschluss-Mahnung → 18:00 Heimweg durch die Lobby →
Tagesfazit/Lagebericht → Nacht über der Stadt, Monat +1.
**Sieg-Nähe:** Fäden reifen, Publikum kippt, Pool neigt sich zu uns.
**Enttarnungs-Nähe:** Risiko rot, Faktencheck-Banner häufen sich, NPC-Krisen, Vorladung.

## 4. Die visuelle Verfassung

**4.1 Referenz-Auflösung:** Logische Bühne **480×270** (16:9), nur ganzzahlig skaliert
(×2/×3/×4), `image-rendering: pixelated` überall. Basis-Raster 16 px; Figuren-Frames 32 px.

**4.2 Proportionssystem** (Bezug = Avatar-Körperhöhe **H**):
Tür 1,15 H · Raumhöhe innen ~1,5 H (Avatar ≈ 2/3) · **Schreibtisch 0,42 H (immer kleiner
als der Avatar)** · sitzender NPC: Kopf bei ~0,9 H · Schrank 0,9 H.
Folge fürs Gebäude: Avatar-Anteil an der Etagenhöhe von heute ~29 % auf ~60 % anheben
(Avatar größer und/oder Etage flacher).

**4.3 Zwei Kamera-Modi — nur zwei:**
① Querschnitt (Gebäude): vertikal scrollend, Fassade + Türen + Fenster-Silhouetten,
**keine Innenräume**, Stadt links/rechts. ② Raum-Nahsicht (beim Betreten): Vollbild,
NPC groß hinter Schreibtisch, kein Mini-Avatar. Die heutige „Foto-Vignette von außen"
wird abgeschafft.

**4.4 Drei-Schichten-Regel:**
| Schicht | Inhalt | Aussehen |
|---|---|---|
| Welt | Gebäude, Räume, Figuren, Stadt | Pixel-Art, Referenzauflösung |
| Diegetisches UI | Narrativ-Tafel, Terminal, Akten, Telefon, TV, Dienstausweis | Pixel-Objekt; öffnet sich als gerahmter Pixel-Bildschirm „im Möbel" |
| Spiel-UI | nur HUD-Rand (Zeit/Risiko/Budget), Pause, Ton, Version | EIN 9-Slice-Pixel-Stil, klein, am Rand |

Dialoge, Aktionswahl, Mission, News, Stats = diegetisch (an Möbel gekoppelt). Der
View-Umschalter entfällt; Ortswechsel diegetisch (Tür/Fahrstuhl).

**4.5 EIN System für Schrift/Rahmen/Icons:** Eine Pixel-Bitmap-Font (Text bleibt
flexible Ebene ÜBER Grafik, E35) · ein 9-Slice-Rahmen-Set (leicht/standard/alarm) ·
ein Pixel-Icon-Set (`icon_*`).

**4.6 Verbotsliste (hart):** Emojis · CSS-Gradients ohne Pixel-Bezug · CSS-gezeichnete
Gesichter/Möbel · abgerundete Web-Buttons/Pillen · Brutalismus-Schlagschatten als
Stilträger · `font-mono` als Weltschrift · Foto-Interieurs neben Pixel-Räumen ·
krumme Skalierung.

## 5. Reihenfolge der Heilung

1. 🔴-Fragen vom Owner beantworten lassen (`FRAGEN_2026-06-13.md`).
2. Schichten-Regel + Rahmen/Font/Icon-System bauen (heilt die UI-Befunde gemeinsam).
3. Gebäude-Rework K6 mit neuem Proportionssystem (heilt Welt-Befunde).
4. Narrativ-Tafel als diegetisches Planungs-Herzstück.
5. Stil-Restbestände (Title, Broadcast-Skin, Modals) angleichen.
