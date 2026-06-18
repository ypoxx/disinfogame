# Geformter Beat — Tageswechsel / „Der Heimweg"

> In-Sitzung mit Owner geformt (2026-06-18), im selben Director-Rhythmus wie
> `IDEE_TAG0_HOAX_EXPERIMENT.md`. Status: inhaltlich geformt, **noch nicht
> baufreigegeben**. Behebt direkt den dokumentierten **P0 „toter Heimweg"**
> aus `docs/PLAYTEST_PERSONAS_2026-06-15.md`.

## Das Problem (Playtest-Befund)
Um 18:00 (Redaktionsschluss) bzw. per „Feierabend" läuft der Avatar ~6 s
sichtbar zur Lobby — **ohne jede Rückmeldung**; Tester hielten das Spiel für
eingefroren, erneutes Klicken ist ein stummer No-Op. Danach erst der (gute)
Lagebericht. Zusätzlich: „stiller Tag" (kein Stück gespielt) wirkt wie ein
No-Op; und die Tage nutzen sich ab („Tag 3,4,5 immer dasselbe") — der Bericht
zeigt Zustand, keine Bewegung, kein Sog nach vorn.

## Director-Entscheidungen
- **A — Was ist der Heimweg? → Spiegel-Heimweg.** Heimweg kürzen, Button nach
  Klick sperren + umlabeln („Feierabend — Heimweg…"), Mini-Indikator (behebt das
  Einfrieren). Während der Avatar die Lobby quert, flackert auf dem Flur-Monitor
  **die heutige Schlagzeile** als Nachrichten-Schnipsel; an stillen Tagen
  stattdessen die **Schlagzeile der Gegenseite**. (Konsequenz-Heimweg mit
  Miete/Familie = eigener Strang später, nicht hier.)
- **B — Stiller Tag → Stille als Haltung.** Schweigen ist ein Zug: Deutungshoheit
  rückt sichtbar Richtung Institutionen, eine Gegen-Schlagzeile erscheint
  („Während es im Ministerium still blieb…"), Marina: „Wer schweigt, überlässt
  das Feld." Verzahnt mit A (Monitor zeigt dann die gegnerische Zeile).
- **C — Vorwärtssog → Bewegung statt Zustand.** Der Lagebericht zeigt Δ seit
  gestern (Segment-Pfeile, Balken-Delta) + Marinas Haken auf morgen („Morgen
  tagt der Stadtrat. Da wird's interessant."). Aus Bilanz wird Kette.

## Assemblierter Beat
```
18:00 — Schnee. Mantel an.
[ Feierabend — Heimweg… ]   (Button sperrt, Mini-Indikator)
Avatar quert die Lobby (~2s). Flur-Monitor flackert:
  „…BRÜCKE NIE GEBAUT? Bürger verunsichert…"   (= heutige Schlagzeile)
  [stiller Tag → stattdessen die Schlagzeile der Gegenseite]

LAGEBERICHT — Tag N
  ① Was wir ausspielten   ② Das Land (Δ-Pfeile: „Abgehängte ▲ +12")   ③ Gegenseite
  Deutungshoheit: 54% ▲ (+3)
  [stiller Tag → ◀ rückt zu Blau, „Institutionen füllen die Leere"]
  MARINA: „Morgen tagt der Stadtrat. Da wird's interessant."
[ Nächster Tag ▸ ]
```

## Orchestrierung (was es real anfasst)
- **Wiederverwendet:** `building/BuildingView.tsx` (Heimweg-Ritual) ·
  `components/DayReport.tsx` (3 Spalten, Kennzahlen, Deutungshoheits-Balken) ·
  Schlagzeile + Segment-Daten + Gegen-Schlagzeilen (rechnet der Report bereits) ·
  `stores/dayClockStore.ts` (18:00/Feierabend) · Marinas Stimme.
- **Neu (klein):** (A) Heimweg kürzen + Button sperren/umlabeln + Mini-Indikator
  + Flur-Monitor-Schnipsel · (B) Stiller-Tag-Logik (Deutungshoheit-Tick +
  Gegen-Zeile + Marina-Satz) · (C) Δ gegen Vortageswerte halten + Marinas
  Vorgriffszeile.
- **Spine-Andockstelle:** Marinas Vorgriffszeile (C) ist exakt die Stelle, an
  der der künftige **Director/Beat-Queue** einklinkt (C-Option 2: „Director legt
  den nächsten Beat" — Episode wird scharf, Gegenseite eskaliert). Heute mit
  Bordmitteln fertig, morgen Spine-bereit.

> Noch offen, falls gebaut wird: genaue Heimweg-Dauer/Indikator-Form · Tuning des
> Deutungshoheit-Ticks an stillen Tagen · woher der Vortageswert kommt
> (dayClock/gameState) · Quelle der Marina-Vorgriffszeile (vorerst handgesetzt,
> später Director).
