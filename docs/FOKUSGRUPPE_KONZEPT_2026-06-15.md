# Fokusgruppe — Feature-Konzept (Owner-Vision 2026-06-15)

> Status: **Konzept zur Freigabe.** Noch kein Code/Asset erzeugt. Nach Freigabe →
> vertikaler Schnitt (1 Segment), dann Skalierung. Mimik: **statisch zuerst,
> Blinzeln als Phase 2** (Owner-Entscheidung).

## 1. Vision & Bildungsziel

Die Fokusgruppe wird vom **passiven Empathie-Ort** zum **aktiven Erkenntnis- und
Test-Werkzeug**. Kernbotschaft des Spiels: Desinformations-Kampagnen werden — wie
echte Kampagnen — **vorab getestet und optimiert**. Der Spieler soll erleben:
- Wie unterschiedliche Milieus dieselbe Botschaft **verschieden** aufnehmen.
- Dass man Wirkung **vorab testen** kann, statt blind zu senden.
- Dass jede Botschaft **versteckte Einwände** weckt, die die Gegenseite ausnutzt.

Das ist der „Empathie-/Erkenntnisort", aber mit mechanischer Konsequenz — kein
Deko-Screen mehr.

## 2. Ist-Zustand → Änderung

| Heute (`FokusgruppeView`) | Künftig |
|---|---|
| Read-only, 4–6 Personas, Einwegspiegel, **keine** Rückwirkung | Beauftragbar, kostet Budget+Zeit, liefert **verwertbare Einsicht** |
| Immer per `analyse`-Raum erreichbar | Im `analyse`-Raum **beauftragt** (nicht „einfach da") |
| Statische CSS-Initialen / wenige Bilder | ~30 benannte Personas mit Halbporträt + 3 Stimmungs-Mimiken |

Erhalten bleibt: Einwegspiegel-Metapher, `room_analyse`-Hintergrund, Props-getriebene
Komponente (kein Hook auf Spiel-State → testbar).

## 3. Kern-Mechanik: die beauftragte Befragung

**Beauftragen** (im `analyse`-Raum, Etage 3): kostet **Budget** + **Zeit** (1–2 Phasen
Vorlauf, damit es sich wie eine echte Studie anfühlt — Ergebnis kommt verzögert als
News/Akte). Zwei Modi:

### 3a. Vorab-Test (Pre-Test) — der Star
Vor einer großen Operation: Botschaft an einer gesampelten Fokusgruppe testen.
Ergebnis je Segment:
- **Prognostizierte Überzeugungs-Verschiebung** (±).
- **Stimmung** (zustimmend / skeptisch / ablehnend) mit O-Ton-Zitat.
- **Versteckte Einwände** — die Gegenargumente, die diese Botschaft weckt.

→ Der Spieler kann **Targeting/Botschaft anpassen**, bevor er Budget in die echte
Kampagne steckt. Wer **ungetestet** eine große Maßnahme fährt, hat ein **höheres
Backfire-/Risiko-Ergebnis** (Kopplung an die bestehende Backfire-/Risk-Mechanik).

### 3b. Nachanalyse
Nach einer Kampagne: beauftragte Studie erklärt **qualitativ, warum** sie wirkte oder
floppte — tiefer als die Broadcast-Leiste, mit Persona-Zitaten und Segment-Aufschlüsselung.

## 4. Personas

~**30 benannte Personas**, verteilt auf die **8 Milieu-Segmente** des `audienceModel`
(≈3–4 je Segment) — wiederkehrende Gesichter mit Mini-Bio, die der Spieler „lesen"
lernt. Pro Persona **3 Stimmungs-Mimiken** = **~90 Halbporträts** (mit Kleidung,
Brustbild). Eine Studie sampelt **6–8** Personas passend zum getesteten Ziel/Segment.

Anbindung: Personas referenzieren `audienceModel`-Segmente (`milieu`, `vulnerabilities`)
→ die „versteckten Einwände" eines Segments speisen sich aus dessen `vulnerabilities`.

## 5. UX-Fluss

1. Spieler betritt `analyse`-Raum → „Fokusgruppe beauftragen" (Budget/Zeit sichtbar).
2. Wahl: **Vorab-Test** (welche geplante Maßnahme?) oder **Nachanalyse** (letzte Kampagne).
3. Nach Vorlauf: Ergebnis als **Akte/News** → Einwegspiegel-Ansicht mit Personas,
   Stimmungs-Mimiken, Zitaten, Segment-Balken, „versteckte Einwände".

## 6. Mimik-System

Drei Stimmungen je Persona: **zustimmend · skeptisch · ablehnend** (gemappt auf den
bestehenden `Mood`-Typ). **Phase 1: statisch.** **Phase 2: dezentes 2-Frame-Blinzeln**
— nur wenn die statischen Gesichter gut sind und das Blinzeln bei kleinen Gesichtern
sauber rendert (Owner-Vorbehalt „muss gut aussehen, sonst lassen").

## 7. „Was kann man noch mehr machen?" — Ausbau-Ideen

- **Versteckte Einwände ↔ Gegenseite:** ungetestete/aggressive Botschaften erzeugen
  Einwände, die die **Gegenseite** im Wettrüsten aufgreift (direkte Kopplung an
  `armsRaceLevel`/Defender-Reaktion).
- **Longitudinale Drift:** die Überzeugung **einer** Persona über die Kampagne
  verfolgen — Radikalisierungs-/Ernüchterungs-Bogen. Stark fürs Bildungsziel
  („so verschiebt wiederholte Exposition ein Individuum").
- **Test-vs-blind-Dilemma:** Testen kostet Geld + Zeit → echte Kampagnen-Spannung
  „sicher & langsam" vs. „schnell & riskant".
- **Sample-Bias:** der Spieler wählt, **wen** er befragt — befragt er nur Zustimmer,
  überschätzt er die Wirkung (lehrt Stichproben-Verzerrung).

## 8. Kosten-Modell

- **In-Game:** Beauftragung kostet Budget + 1–2 Phasen. Bewusst moderat (Owner:
  „kann etwas kosten, aber nicht viel") — der Lerneffekt soll Testen belohnen.
- **Asset (Pipeline):** ~90 Halbporträts = ~8 Läufe à 12 Bilder. Plus später ggf.
  Blinzel-Frames. Phasenweise (s. §10), nicht in einem Rutsch.

## 9. Architektur-Anbindung

- **Daten:** neue `personas.json` (Persona-ID, Name, Bio, Segment-ID, `vulnerabilities`)
  über die 8 `audienceModel`-Segmente.
- **Assets:** `persona_<id>_<mood>` (Halbporträt, 3 Moods), Shotlist-Block analog zu
  den NPC-Halbporträts (`npc_half_*`, gleicher Seed je Persona → konsistentes Gesicht).
- **Mechanik:** „Fokusgruppe beauftragen" als Aktion/Flow im `analyse`-Raum
  (`costs`/`effects`-Schema vorhanden); Ergebnis als verzögerte Akte/News.
- **View:** `FokusgruppeView` erweitern (bleibt props-getrieben/testbar) um
  Prognose-Balken, Einwände, Zitate.

## 10. Phasenplan

- **Phase 1 — vertikaler Schnitt (nach Freigabe):** Mechanik (Beauftragen +
  Vorab-Test-Ergebnis) + **1 Segment** (~3 Personas × 3 Moods ≈ 9 Bilder). Look + UX
  im Preview prüfen. *(Kein 90-Bilder-Risiko vorab.)*
- **Phase 2 — Skalierung:** restliche Segmente → ~30 Personas / ~90 Porträts.
- **Phase 3 — Politur:** Blinzeln (wenn gut), longitudinale Drift, Sample-Bias.

## 11. Offene Design-Fragen (Owner)

1. **Vorab-Test an konkreter geplanter Maßnahme** oder an einer **abstrakten Botschaft/
   einem Thema**? (Ersteres koppelt enger an die Queue, Letzteres ist flexibler.)
2. **Verzögerung** der Studie: 1 Phase (schneller Loop) oder 2 (mehr Gewicht)?
3. **Backfire-Kopplung** scharf (ungetestet = spürbar riskanter) oder mild (nur Hinweis)?
4. Personas **fix benannt** (30 handgeschriebene Bios) oder **teilgeneriert** (Namen/
   Bios aus Bausteinen)?
