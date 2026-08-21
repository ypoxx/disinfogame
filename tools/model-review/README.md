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
npm test                                    # 86 Unit-/E2E-Tests, kein Netz, keine Kosten

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
| `ui` | **Mit Screenshots/Clips:** Was sitzt falsch, was ist zu klein, welche Grafik trägt nicht? | ~22k Tokens + Medien |
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

## UI-Review mit Screenshots

Die Linse `ui` ist die einzige, die **Bilder** mitschickt — ohne Pixel kann kein Modell sagen,
dass eine Grafik zu tief sitzt oder eine Zahl zu klein ist. Die Screenshots liefert die
vorhandene Visual-Review-Ernte:

```bash
cd desinformation-network
npm ci
npm run build
npm run preview -- --port 4173 &
node scripts/visual-review/harvest.mjs --no-clips        # → runs/visual-review/latest/shots/

cd ../tools/model-review
node src/cli.mjs review --lens ui --model konto \
  --bild ../../desinformation-network/runs/visual-review/latest/shots/title.png \
  --bild ../../desinformation-network/runs/visual-review/latest/shots/building_lobby_day.png \
  --live
```

- `--bild` nimmt eine Datei **oder ein Verzeichnis** (dann alle Bilder darin, alphabetisch).
  Grenze: 40 Bilder pro Lauf (`--max-bilder`), 8 MB pro Bild.
- Jedes Bild wird im Prompt **mit seinem Dateinamen angekündigt**, damit die Antwort sagen kann
  „in `05_hud.png` klebt die Tagesanzeige am Rand" statt „auf einem der Bilder".
- Liegt `runs/visual-review/latest/manifest.json` vor, geht die **Beschreibung jedes Screenshots**
  automatisch mit — das Modell weiß dann, was es sieht.
- Modelle ohne Bild-Eingabe werden **vor** dem Aufruf abgelehnt (`architecture.input_modalities`),
  mit Vorschlägen sehender Alternativen. Bilder an ein blindes Modell kosten sonst Geld für nichts.
- Die `ui`-Linse hat eine **eigene Antwortform**: Eindruck je Screen, konkrete Eingriffe
  (*Element → was ändern → warum*), Grafiken/Assets, Raster & Rhythmus, Lesbarkeit,
  die drei wirksamsten Änderungen.

### Serie — der ausführliche Durchgang

Bei einem **kostenlosen** Modell mit großem Kontext ist die Versuchung groß, alle Screenshots in
einen einzigen Aufruf zu kippen. Das Ergebnis ist flach: 60 Bilder in einem Prompt bekommen je
zwei Sätze. `serie` macht es andersherum — **ein konzentrierter Durchgang je Bildschirm-Bündel**
(intro · building · panels · daynight · clips …), danach ein **Synthese-Aufruf** über alle
Einzelberichte, der nach *wiederkehrenden* Mustern und Widersprüchen zwischen den Bündeln sucht:

```bash
node src/cli.mjs serie --model konto                    # Trockenlauf: welche Bündel gibt es?
node src/cli.mjs serie --model konto --live             # alle Bündel + Synthese
node src/cli.mjs serie --buendel building,panels --live # nur diese
node src/cli.mjs serie --pro-buendel 16 --live          # mehr Aufnahmen je Durchgang
```

Ergebnis in `docs/MODEL_REVIEWS/`: je Bündel ein Bericht plus
`<datum>_ui-00-SYNTHESE_<modell>.md` — die Synthese sortiert sich durch den `00` nach oben.

Die Bündel kommen aus dem `manifest.json` der Ernte; jeder Durchgang bekommt die Liste
„das siehst du" mit Dateiname und Beschreibung und die Auflage, **nur** diese Aufnahmen zu
beurteilen. Manifest-Einträge ohne vorhandene Datei werden übersprungen statt den Lauf abzubrechen.

### Clips (Video-Eingabe)

Modelle mit `video` in den `input_modalities` können die `.webm`-Clips der Ernte direkt lesen —
dann geht es nicht mehr nur um Anordnung, sondern um **Timing, Übergänge und Ruckeln**:

```bash
node src/cli.mjs review --lens ui --model konto \
  --video ../../desinformation-network/runs/visual-review/latest/clips --live
```

`serie` erkennt Clip-Bündel selbst und überspringt sie, wenn das Modell kein Video liest.
Grenzen: 8 Clips je Lauf (`--max-videos`), 24 MB je Clip.

> **Denk-Modelle brauchen Luft.** Modelle mit `reasoning.mandatory` (z. B. `stealth/ox-alpha`,
> Standard-Aufwand `max`) verbrauchen einen Teil des Antwort-Budgets fürs Nachdenken. Ist
> `--max-tokens` zu klein, kommt eine **leere** Antwort zurück. `serie` setzt deshalb 32.000
> statt 8.000; die Fehlermeldung nennt diese Ursache ausdrücklich, wenn es doch passiert.

> **Verwandtes im Repo:** `desinformation-network/scripts/visual-review/gemini-review.mjs` schickt
> dieselben Bilder direkt an die Gemini-API. Der Unterschied: dort ein fester Anbieter und freier
> Prompt, hier **jedes** OpenRouter-Modell, feste Antwortform, Kostenbremse und ein Bericht mit
> Quellen-Nachweis in `docs/MODEL_REVIEWS/`.

## Dein bei OpenRouter hinterlegtes Modell

`--model konto` lässt das Feld `model` weg — dann greift laut API-Schema das im Konto
hinterlegte Standardmodell (*„If `model` is unspecified, uses the user's default"*).
Weil erst die Antwort verrät, welches Modell das war, ist vorher **keine Kostenschätzung**
möglich; die Bremse lässt diesen Fall bewusst durch und warnt stattdessen. Der Bericht wird
nach dem tatsächlich benutzten Modell benannt.

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
npm test     # 86 Tests: Paketbau, Bilder/Clips, Serie, Kostenbremse, Bericht, API-Client + CLI end-to-end
```

Die API-Tests laufen gegen einen **lokalen Attrappen-Server** (`node:http`) — inklusive eines
kompletten `--live`-Durchlaufs. Kein echter Netzzugriff, keine Kosten, kein Schlüssel nötig.
