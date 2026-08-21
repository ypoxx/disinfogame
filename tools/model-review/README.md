# Model-Review (fremdes Modell schaut über das Spiel)

Schickt **kuratierte Ausschnitte des Projekts** über [openrouter.ai](https://openrouter.ai)
an ein **Nicht-Claude-Modell** und legt dessen Gutachten als Markdown unter
`docs/MODEL_REVIEWS/` ab.

**Wozu?** Die bisherigen Tiefen-Reviews (`docs/EXPERT_REVIEWS_2026-06-20/`, `docs/REVIEW_*.md`)
stammen alle vom selben Modell-Haushalt, der das Spiel auch gebaut hat. Ein fremdes Modell hat
andere blinde Flecken — genau das ist der Punkt. OpenRouter ist dabei nur der Durchreiche-Dienst:
ein Schlüssel, ein Dutzend Anbieter.

> ⚠️ **Fremdmodell-Berichte sind Hypothesen, keine Befunde.** Das Modell sieht weder das laufende
> Spiel noch das ganze Repository und kann `file:line` nicht verifizieren. Jeder Bericht trägt
> diesen Warnhinweis im Kopf. Kanonisch bleibt `docs/VISION_LOCK.md` bzw. die Spieldaten.

---

## Schnellstart

```bash
cd tools/model-review
npm test                                    # 60 Unit-/E2E-Tests, kein Netz, keine Kosten

node src/cli.mjs lenses                     # Welche Linsen gibt es?
node src/cli.mjs pack --lens konzept        # Was würde gesendet? (schreibt nach runs/)

export OPENROUTER_API_KEY="sk-or-v1-..."    # Schlüssel von https://openrouter.ai/keys
node src/cli.mjs key                        # Guthaben/Limit prüfen
node src/cli.mjs models --filter gemini     # Modelle + Preise ansehen

# Trockenlauf (Default — es passiert nichts Kostenpflichtiges):
node src/cli.mjs review --lens konzept --model google/gemini-3-pro-preview

# Echt:
node src/cli.mjs review --lens konzept --model google/gemini-3-pro-preview --live
```

Es gibt **keine Abhängigkeiten** — nur Node ≥ 18 (`fetch`, `node --test`). Kein `npm install` nötig.

### Schlüssel hinterlegen

Entweder als Umgebungsvariable (siehe oben) **oder** in einer lokalen Datei:

```bash
cp .env.example .env      # dann OPENROUTER_API_KEY eintragen
```

`.env` ist gitignored, ebenso `runs/`. Der Schlüssel wird in keiner Ausgabe und in keinem
Protokoll vollständig gedruckt (`sk-or-v1…abcd`).

---

## Linsen — Ausschnitt + Frage

Eine **Linse** legt fest, *was* das fremde Modell sieht und *was* es beantworten soll.
Große Prosa-Dokumente gehen ganz oder gekürzt mit; JSON-Spieldaten als Struktur-Digest
(Felder + Beispiele) oder als **Feld-Projektion** (alle Einträge, aber nur die relevanten
Felder — so passen alle 110 Aktionen mit Kosten/Effekten ins Paket, ohne die Erzähltexte).

| Linse | Frage | Paket* |
|---|---|---:|
| `konzept` | Trägt die Kernschleife? Zahlen die interessanten Entscheidungen auf den Sieg ein? | ~29k Tokens |
| `narrativ` | Haben die NPCs Stimmen? Sind Episoden Wendungen oder Aufgabenlisten? | ~16k Tokens |
| `balance` | Dominante Strategien, tote Optionen, Rückkopplungen ohne Gegenkraft | ~25k Tokens |
| `onboarding` | Erste 10 Minuten: Wann fällt die erste bedeutsame Entscheidung? | ~18k Tokens |
| `bildung` | Immunisiert das Spiel — oder ist es ein Handbuch? Trägt die Fiktionalisierung? | ~14k Tokens |
| `architektur` | Wo ballt sich Komplexität, welcher Schnitt lohnt zuerst? | ~11k Tokens |

\* Schätzung, `node src/cli.mjs pack --lens <id>` zeigt den echten Stand.

### Welches Modell?

`node src/cli.mjs models --filter <text>` zeigt den Katalog mit Tagespreisen (rund 420 Modelle).
Sinnvoll ist ein **starkes Modell aus einem anderen Haus als Claude** — genau darum geht es hier.
Stand 2026-08 zum Beispiel:

| Modell | $/1M Prompt | $/1M Antwort | Kosten für eine `konzept`-Review** |
|---|---:|---:|---:|
| `openai/gpt-5.1` | 1.25 | 10.00 | ~$0.12 |
| `google/gemini-3.1-pro-preview` | 2.00 | 12.00 | ~$0.16 |
| `x-ai/grok-4.3` | 1.25 | 2.50 | ~$0.06 |
| `deepseek/deepseek-chat-v3.1` | 0.25 | 0.95 | ~$0.02 |

\*\* Höchstfall: ~29k Prompt-Tokens + volle 8k Antwort-Tokens. Real liegt es meist darunter.
Eine Zweitmeinung von drei Modellen kostet also **Cent-Beträge**, keine Euro.

Jede Linse verlangt dieselbe Antwortform (Kurzfazit · Befunde mit Beleg und Zuversicht ·
Änderungen · **was streichen** · blinde Flecken) und dieselben Ehrlichkeitsregeln
(„erfinde keine Dateien/Zahlen; sag, was du nicht beurteilen kannst").

**Eigene Frage** an denselben Ausschnitt:

```bash
node src/cli.mjs review --lens narrativ --model x/y --frage "Klingt Igor wie ein Buchhalter oder wie eine Spielfigur?" --live
```

**Zusätzliche Datei** ins Paket (mehrfach erlaubt):

```bash
node src/cli.mjs review --lens konzept --datei docs/IDEE_BEAT_BUMERANG.md --live
```

**Zweitmeinung** — mehrere Modelle in einem Lauf, ein Bericht je Modell:

```bash
node src/cli.mjs review --lens balance --model a/b --model c/d --live
```

### Neue Linse anlegen

Eintrag in `src/lenses.mjs` ergänzen (`id`, `titel`, `kurz`, `rolle`, `auftrag`, `quellen`).
Quell-Modi: `voll` · `kopf` (+`limit`) · `digest` (JSON-Struktur + Beispiele) ·
`projektion` (+`arrays`, `felder`) · `baum` (Datei-Inventar eines Ordners).
`npm test` prüft danach automatisch, dass alle Pfade existieren und das Paket ins Budget passt.

---

## Sicherheits- und Kosten-Modell

- **Trockenlauf als Default.** Ohne `--live` geht kein Review-Aufruf raus. Der Trockenlauf
  schreibt den **exakten Prompt** nach `runs/` — erst lesen, dann senden.
- **Harte Kostenbremse vor dem Aufruf.** Geschätzt wird der Höchstfall (Prompt + volle
  Antwortlänge) zu den Katalogpreisen; über dem Limit bricht der Lauf ab, **bevor** gesendet wird.
  Default `$1.00` pro Modell (`--max-cost`, `MODEL_REVIEW_MAX_COST_USD`).
- **Modelle ohne Preisangabe** werden abgelehnt (sonst ließe sich die Bremse umgehen) —
  bewusst freischaltbar mit `--preis-unbekannt-ok`.
- **Modellkürzel wird gegen den Katalog geprüft**; bei Tippfehlern kommen Vorschläge statt
  eines fehlgeschlagenen Aufrufs.
- **Paketgröße ist hart gedeckelt** (`--max-chars`, Default 320.000 Zeichen). Was nicht
  hineinpasst, wird im Bericht als *ausgelassen* ausgewiesen — nie still abgeschnitten.
- **Protokoll** je Lauf unter `runs/run-<datum>-review.jsonl` (Kosten, Nutzung, Bericht).

### Datenschutz — das verlässt das Haus

Das Kontext-Paket geht an OpenRouter **und an den Anbieter des gewählten Modells**. Es enthält
Projektdokumente und Spieldaten (keine Schlüssel, keine Nutzerdaten). Standardmäßig wird
`provider: { data_collection: "deny" }` gesendet — OpenRouter leitet dann nur an Anbieter weiter,
die Eingaben **nicht zum Training sammeln**. Das schränkt die Auswahl ein; bewusst aufheben mit
`--erlaube-datensammlung` (bzw. `MODEL_REVIEW_ALLOW_DATA_COLLECTION=1`).

### Netzzugang (Sandbox / Proxy)

Zwei Stolpersteine, beide behandelt:

1. **Allowlist.** In Claude-Code-Web-Sitzungen muss `openrouter.ai` in den Egress-Einstellungen
   der Umgebung freigeschaltet sein, sonst: `403 Host not in allowlist`. Lokal irrelevant.
2. **Node und der Proxy.** Node wertet `HTTPS_PROXY` für `fetch()` nur aus, wenn es beim
   Prozessstart eingeschaltet wird (`NODE_USE_ENV_PROXY=1`, ab Node 22) — sonst landet der
   Aufruf am Gateway und bekommt 403, obwohl `curl` längst durchkommt. Die CLI startet sich
   deshalb **einmal selbst neu**, wenn ein Proxy gesetzt ist. Abschaltbar mit
   `MODEL_REVIEW_NO_REEXEC=1`. Ohne Proxy passiert nichts.

Alles außer `--live` (`lenses`, `pack`, `npm test`) funktioniert ohne Netz und ohne Schlüssel.

---

## Ergebnis

Berichte landen als `docs/MODEL_REVIEWS/<datum>_<linse>_<modell>.md` und dokumentieren immer
mit: Modell, Linse, gestellte Frage, **jede gezeigte Quelle mit Status** (vollständig/gekürzt/
ausgelassen), Tokennutzung, Kosten, Dauer. Ohne diesen Kopf wäre ein Fremdmodell-Urteil nicht
bewertbar.

Danach: Befunde am Code/an den Daten gegenprüfen, Brauchbares in `docs/STATUS.md` einordnen.

## Tests

```bash
npm test     # 60 Tests: Paketbau, Kostenbremse, Bericht, API-Client + CLI end-to-end
```

Die API-Tests laufen gegen einen **lokalen Attrappen-Server** (`node:http`) — inklusive eines
kompletten `--live`-Durchlaufs. Kein echter Netzzugriff, keine Kosten, kein Schlüssel nötig.
