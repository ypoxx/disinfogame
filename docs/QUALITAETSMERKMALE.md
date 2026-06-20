# 🏅 Qualitätsmerkmale — der gemeinsame Maßstab für „Operation Westunion"

**Datum:** 2026-06-20 · **Status:** kanonisch (Owner-Frage 2026-06-20: „Was sind die
wichtigen Qualitätsmerkmale, die in diesem Spiel gelten?").
**Zweck:** EIN gemeinsamer Maßstab — für Menschen *und* parallel arbeitende KI-Agenten.
Jedes Inhalts-/Code-Stück (Aktion, Episode, Beat, Panel) wird hieran gemessen. Das ist das
**Abnahme-Gate für das „kuratieren"-Paket** (Review §5) und löst `NPC_VOICE_PROFILES.md`
als allgemeines Schreib-Gate ab bzw. ergänzt es.

> Leitsatz (aus dem Review): **Die Episode/der Beat ist die Einheit der Bedeutung.
> Aktionen sind ihr Vokabular — kuratiert, nicht katalogisiert.** Diese Merkmale sagen,
> *woran man erkennt*, dass das gelungen ist.

---

## Die acht Merkmale (jedes mit „erfüllt, wenn")

### 1. Lesbarkeit am Entscheidungspunkt (Legibility)
Der Spieler sieht **Ursache → Wirkung, bevor er klickt** — nicht erst danach.
- *Warum hier:* Der teuerste, wiederkehrende Befund (Playtest B: „Aktion↔Barometer nicht
  gekoppelt"; Persona A: „soll das hoch oder runter?"). Ohne das optimiert man blind —
  das Gegenteil eines Strategiespiels (Wright: sauberes Mentalmodell).
- **Erfüllt, wenn:** jede Aktionskarte beim *Planen* zeigt, was sie an Gesellschaftswerten
  bewegt (z. B. „Polarisierung ▲, Diskurs ▼") **und** ihren Preis (Risiko/Aufmerksamkeit/
  Moral), nicht „1 NPC-Bonus". Keine nackten Zahlen ohne Bezug.

### 2. Dosierte Tiefe (Curation over Catalog)
Die **richtige Anzahl Wahlmöglichkeiten zur richtigen Zeit.** Der Möglichkeitsraum öffnet
sich **erzählerisch** (Auftrag/Episode/Lage), nicht über eine interne Uhr/Taxonomie.
- *Warum hier:* „143 Aktionen — reich, aber schlecht dosiert" / „zu viel zu früh". Wright:
  erst den Sandkasten lesbar machen, dann erweitern.
- **Erfüllt, wenn:** ein Tag dem Spieler eine **überschaubare, anlass-bezogene** Auswahl
  zeigt (Größenordnung 3–8, nicht 100). Nie ein Katalog-Dump als Eingangstür.

### 3. Jede Wahl ist eine echte Entscheidung (Meaningful, Non-Dominated Choice)
Mindestens zwei **nicht-dominierte** Wege mit Trade-off — keiner ist objektiv „der beste
Knopf". Die **Wendung** lebt in der Wahl.
- *Warum hier:* Das ist bereits die Beat-Grammatik (`BEAT_MUSTER_KATALOG.md`). Wir
  erweitern sie auf Aktionen: leise vs. laut, klein vs. groß, billig-sichtbar vs.
  teuer-deniabel.
- **Erfüllt, wenn:** man die Optionen eines Moments nicht nach „mehr Zahl = besser"
  sortieren kann; jede hat einen klaren Preis für ihren Vorteil.

### 4. Eine Stimme, eine Welt (Tonal & World Coherence — „aus einem Guss")
Ein Ton über Aktionen, NPCs, Episoden, Beats: **vivid, was es mit Menschen macht,
trockener Biss** — kein Lehrbuch, kein Jargon-Dump, keine realen Staatssymbole, **keine
Dev-Artefakte** (interne IDs).
- *Warum hier:* SOUL §1/§3 („aus einem Guss"); Review-Befund A (zwei Inhalts-Klassen).
  Die Pixel-Kohärenz gilt genauso für die Prosa.
- **Erfüllt, wenn:** ein Außenstehender nicht erkennt, *welche* Aktion alt und *welche*
  neu ist; jede Narrative ist **ein** Satz, der die Wirkung trägt (Vorbild `11.x`,
  Episoden); Labels deutsch/erklärt, Fachbegriff nur mit Mehrwert.

### 5. Spürbare, zeitlich ehrliche Konsequenz (Felt Consequence)
Belohnung **und** Preis sind sichtbar. Der gesellschaftliche Schaden liegt **nicht nur** im
End-Report; die Gegenseite ist ein langsames Immunsystem, das zurückkommt.
- *Warum hier:* Persona C: „Belohnung sofort, Schaden kaum sichtbar → trainiert erst den
  Reiz." Das ist der didaktische Kern (T5) und zugleich Spieltiefe (Wright: bedeutsame
  Konsequenzen).
- **Erfüllt, wenn:** der Preis einer aggressiven Aktion **im Loop** spürbar wird
  (Segment-Stimmung, wachsende Gegenwehr), nicht erst beim Abspann.

### 6. Glaubwürdigkeit / Recherche-Fundierung (Authenticity)
Jede Mechanik bildet ein **reales, dokumentiertes** Desinfo-Muster ab (Atlas). Die Welt ist
fiktiv (Westunion/Gallia), die **Methoden sind echt**.
- *Warum hier:* Das ist die Bildungs-Seele (SOUL §5). „Glaubwürdigkeit ist ihm wichtig"
  (SOUL §2). Ohne Fundierung ist es ein beliebiges Bösewicht-Spiel.
- **Erfüllt, wenn:** jede neue/überarbeitete Aktion einer `disinfo_methods`-Familie
  zuordenbar ist (`disarm_ref`/Atlas) und der reale Mechanismus stimmt — keine erfundene
  Pseudo-Taktik.

### 7. Bildung durchs Ganze, kein Zeigefinger (Education by Play)
Die Lehre entsteht aus dem Spielen + dem Debrief, nicht aus Belehrung. Moralische Last
**dezent**. Die Realität operiert amoralisch — wir zeigen das, statt zu mahnen.
- *Warum hier:* SOUL §3.5; bewusste Entscheidung „kein moralischer Beat/Gewissensprobe".
- **Erfüllt, wenn:** kein Text den Spieler belehrt; der Lernmoment sitzt im Erleben +
  End-Report (`lernmoment_id`, `counter_de`). Kein „das ist böse, weil…".

### 8. Verlässliches Gerüst & Nie-langweilig-Rhythmus (Robustness & Variety)
Nichts ist kaputt (kein toter Code, kein leakendes ID, keine Doppel-Rückmeldung, Gate
grün) — **und** der Rhythmus variiert (Spannung/Entspannung, Dirigent streut, Stochastik),
sodass „Tag 3, 4, 5" nicht gleich aussehen.
- *Warum hier:* T3-Lehre (kaputtes Gerüst kostet am meisten) + Owner-Wunsch „nie
  langweilig" + Director-Spine (gewichteter Pool, Nebel-Stochastik).
- **Erfüllt, wenn:** `tsc 0 · vitest grün · build` vor jedem Push; und zwei aufeinander
  folgende Tage fühlen sich **unterschiedlich** an (verschiedene Anlässe/Wege).

---

## Schnell-Checkliste (für jeden Pull / jede Aktion / jede Episode)
- [ ] **Wirkung sichtbar** beim Planen (Werte-Delta + Preis)? *(M1)*
- [ ] **Anlass-bezogen** angeboten, nicht aus dem Katalog gedumpt? *(M2)*
- [ ] **≥2 echte Wege** mit Trade-off (keine Dominanz)? *(M3)*
- [ ] **Ein Satz, guter Ton**, kein Jargon/keine ID/keine realen Symbole? *(M4)*
- [ ] **Preis spürbar im Loop**, nicht nur am Ende? *(M5)*
- [ ] **Reales Muster** dahinter (Atlas/`disarm_ref`)? *(M6)*
- [ ] **Kein Zeigefinger**, Lehre durchs Erleben? *(M7)*
- [ ] **Gate grün** + fühlt sich **anders** an als gestern? *(M8)*

---

## Verhältnis zu bestehenden Dokumenten
- **Konkretisiert** `SOUL.md` (Vision/Prinzipien) für die Inhalts-Arbeit.
- **Erweitert** `BEAT_MUSTER_KATALOG.md` (Beat-Grammatik) und `NPC_VOICE_PROFILES.md`
  (NPC-Stimmen) zu einem **allgemeinen** Inhalts-Gate.
- **Operationalisiert** `REVIEW_2026-06-20_EPISODEN_AKTIONEN.md` (Befunde A/B/C → Maßstab).
