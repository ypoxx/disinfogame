# 🩺 Diagnose: Warum die NPC-Dialoge „fast nie funktioniert" haben

> **Status:** Referenz · **Aktualisiert:** 2026-05-31 · **Scope:** Story
> **Wichtig:** Alles hier wurde **selbst im Code/in den Daten geprüft**, nicht aus zweiter Hand übernommen.

> ✅ **GELÖST (2026-05-31):** Der Reaktions-Weg ist jetzt verdrahtet — `processNPCReactions`
> (in `StoryEngineAdapter.ts`) fragt `getReaction` mit den **echten Aktions-Tags** ab, sodass die
> autorisierten NPC-Reaktionen wieder erscheinen statt der Notlösung. Beweis-Test:
> `src/story-mode/__tests__/NPCReactionWiring.test.ts` (grün). Die genaue Ursache unten bleibt
> als Dokumentation stehen.

## Kurzfassung (in einfachen Worten)
Die guten Dialoge sind **nicht verloren** — es wurde sogar sehr viel geschrieben. Das Problem ist:
Das Dialog-System wurde nur **halb angeschlossen**. Manche Wege funktionieren, einer (der häufigste) nicht —
und wenn ein Weg nichts findet, springt eine **Notlösung** ein, die immer denselben kurzen Satz zeigt.

Eine naheliegende erste Vermutung habe ich **überprüft und verworfen:** „Die guten Dialoge sind erst ab
Beziehungsstufe 2 freigeschaltet" — stimmt nicht. In den Daten haben nur **3 von 149** Dialog-Texten so eine
Sperre. Die Inhalte sind also fast nie „weggesperrt".

## Was tatsächlich vorhanden ist  ✅ *[geprüft]*
- **14 Gesprächsthemen** mit insgesamt **149 Dialog-Texten** (`topics_dialogues.json`), mehrschichtig (Einstieg → Vertiefung → Wahlmöglichkeiten).
- **16 Begrüßungen pro Figur** (4 je Beziehungsstufe) in `dialogues.json`.
- strukturierte **Reaktionen** + **20 „Ambient"-Sätze** pro Figur.

→ Es wurde wirklich viel Arbeit investiert. Das deckt sich mit deiner Erinnerung.

## Die Anzeige-Kette und die „zwei Wege"  ✅ *[geprüft]*
Beim Anzeigen versucht das Spiel zuerst das **reiche System**; findet es nichts, nimmt es die **Notlösung**
(einzelne feste Sätze aus `npcs.json`) — nachzulesen in `StoryEngineAdapter.ts:4122-4137`. Im Detail:

| Bereich | Status | Befund |
|---|---|---|
| **Themen-Gespräche** | ✅ sollte funktionieren | Die Themen-Schlüssel passen exakt (`content`, `mission`, …), kaum Sperren → das reiche System wird hier gefunden. |
| **Begrüßungen** | ✅ sollte funktionieren | 4 Varianten pro Stufe sind vorhanden und werden zufällig gewählt. |
| **Reaktionen auf Aktionen** *(das, was man am häufigsten sieht!)* | ❌ **hier klemmt es** | Das reiche Reaktions-System (`getReaction`) wird im Haupt-Spielablauf **nicht aufgerufen** — im zentralen Hook gibt es nur Aufrufe für „Begrüßung" und „Thema", **keinen** für „Reaktion". Die NPC-Reaktion nach einer Aktion kommt also aus einem **anderen Weg** und/oder fällt auf die Notlösung zurück → **immer derselbe feste Satz**. |

**Das ist der wahrscheinlichste Grund für „immer dieselben sperrigen Einzeiler".** Es ist kein Mangel an
Inhalt, sondern eine **fehlende Verbindung** an genau einer Stelle (plus mehrere konkurrierende Anzeige-Wege).

## Warum das so schwer zu beheben war
1. Alles hängt im **5119-Zeilen-Adapter** (`StoryEngineAdapter.ts`) — unübersichtlich.
2. Die Story-Daten liegen **doppelt und abweichend** (echt vs. veraltete `docs/`-Kopie).
3. Es gibt **mehrere Anzeige-Wege** nebeneinander (reiches System, Notlösung, evtl. ein Text-Generator).

## Empfohlene Reparatur (klein und sicher, in dieser Reihenfolge)
1. **Sicherungsnetz zuerst:** ein kleiner automatischer Test, der festhält, was heute bei Begrüßung / Thema / Reaktion herauskommt (damit wir beim Umbau nichts kaputt machen).
2. **Den Reaktions-Weg anschließen:** dafür sorgen, dass nach einer Aktion das reiche Reaktions-System mit den passenden „Auslösern" aufgerufen wird — ein gezielter, kleiner Eingriff.
3. **Daten zusammenführen:** die veraltete `docs/`-Kopie auflösen, damit es nur **eine** Quelle gibt.

## Sicherheits-Hinweis zur Diagnose
Die mit ✅ markierten Punkte sind im Code/in den Daten geprüft. Der Reaktions-Befund ist stark gestützt
(kein Aufruf des reichen Reaktions-Systems im Haupt-Ablauf gefunden), sollte aber vor dem Fix mit **einem
kurzen Lauftest** endgültig bestätigt werden — genau dafür ist Schritt 1 (Sicherungsnetz) da.
