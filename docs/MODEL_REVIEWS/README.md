# 🛰️ Fremdmodell-Reviews

Hier liegen Gutachten, die **nicht von Claude** stammen: Ein anderes Modell (via
[openrouter.ai](https://openrouter.ai)) bekommt einen kuratierten Ausschnitt des Projekts
zu sehen und antwortet in fester Form. Erzeugt mit [`tools/model-review`](../../tools/model-review/README.md).

```bash
cd tools/model-review
node src/cli.mjs lenses                                   # Welche Fragen gibt es?
node src/cli.mjs review --lens konzept --model openai/gpt-5.1   # Trockenlauf
node src/cli.mjs review --lens konzept --model openai/gpt-5.1 --live
```

## Was hier schon liegt

| Datei | Was drinsteht |
|---|---|
| [`2026-08-22_VERGLEICH_UND_PLAN.md`](2026-08-22_VERGLEICH_UND_PLAN.md) | **Hier anfangen.** Beide Modell-Läufe zusammengeführt, am Code geprüft, mit Plan in fünf Stufen. |
| [`2026-08-21_VERIFIKATION.md`](2026-08-21_VERIFIKATION.md) | Die drei Top-Befunde der ersten Runde, Zeile für Zeile nachgeprüft. |
| `2026-08-21_ui-*_stealth-ox-alpha.md` | Erste Runde: 12 Bündel + Synthesen (OpenRouter, gratis, mit Clips). |
| `2026-08-22_ui-*_gpt-5.6-sol.md` | Zweitmeinung: 14 Bündel (OpenAI direkt, ohne Clips, ohne Synthese). |

## Warum es diesen Ordner gibt

Die bisherigen Tiefen-Reviews (`docs/EXPERT_REVIEWS_2026-06-20/`, `docs/REVIEW_*.md`) stammen
alle aus demselben Modell-Haushalt, der das Spiel auch gebaut hat — mit entsprechend
gleichförmigen blinden Flecken. Ein fremdes Modell sieht andere Dinge (und übersieht andere).

## Wie diese Berichte zu lesen sind

> ⚠️ **Hypothesen, keine Befunde.** Das fremde Modell sieht weder das laufende Spiel noch das
> ganze Repository; es kann `file:line` nicht verifizieren und Zahlen nicht nachrechnen, die
> nicht im Paket standen. Jeder Bericht führt im Kopf auf, **welche Quellen** er gesehen hat
> und was davon gekürzt oder ausgelassen wurde.

Arbeitsweise: lesen → **am Code/an den Daten gegenprüfen** → Brauchbares in `docs/STATUS.md`
einordnen. Kanonisch bleibt [`docs/VISION_LOCK.md`](../VISION_LOCK.md) bzw. die Spieldaten.

## UI-Review mit Screenshots

Die Linse `ui` sieht das Spiel wirklich an. Screenshots kommen aus der vorhandenen
Visual-Review-Ernte (`desinformation-network/scripts/visual-review/harvest.mjs`):

```bash
cd desinformation-network && npm ci && npm run build
npm run preview -- --port 4173 &
node scripts/visual-review/harvest.mjs --no-clips     # → runs/visual-review/latest/shots/

cd ../tools/model-review
node src/cli.mjs review --lens ui --model konto \
  --bild ../../desinformation-network/runs/visual-review/latest/shots/title.png --live
```

Liegt das `manifest.json` der Ernte vor, bekommt das Modell zu jedem Screenshot auch dessen
Beschreibung. `--model konto` nutzt das bei OpenRouter hinterlegte Standardmodell.

### Der ausführliche Durchgang: `serie`

Statt alle Screenshots in einen Aufruf zu kippen (60 Bilder bekämen je zwei Sätze) läuft die
Serie **bündelweise** — intro · building · panels · daynight · clips — und fasst am Ende alles
zusammen:

```bash
cd tools/model-review
node src/cli.mjs serie --model konto            # Trockenlauf: welche Bündel gibt es?
node src/cli.mjs serie --model konto --live     # je Bündel ein Bericht + Synthese
```

Das ergibt hier je Bündel eine Datei plus `<datum>_ui-00-SYNTHESE_<modell>.md`. Die Synthese
sucht **wiederkehrende** Muster (was in mehreren Bündeln auftaucht, ist systemisch) und
Widersprüche zwischen den Bildschirmen, und schließt mit einer Rangliste nach Wirkung/Aufwand.

Clips (`.webm` aus der Ernte) gehen an Modelle mit Video-Eingabe direkt mit — dann geht es
zusätzlich um Timing, Übergänge und Ruckeln. **OpenAI nimmt kein Video entgegen**; dort
lässt die Serie die Clip-Bündel weg und nennt sie beim Namen. Der Weg dorthin führt über
Schlüsselbilder:

```bash
node src/cli.mjs frames                          # Standbilder aus den Clips ziehen
node src/cli.mjs review --lens ui --bild <ordner> --anbieter openai --model <id> --live
```

### Zweitmeinung von einem anderen Anbieter

```bash
node src/cli.mjs serie --anbieter openai --model gpt-5.6-sol --denk-aufwand high --live
```

Zwei Modelle über dieselbe Ernte laufen zu lassen lohnt sich — aber nicht, weil
Übereinstimmung Wahrheit bedeutet. Sie bedeutet nur, dass **dieselbe Sache zwei
unabhängigen Betrachtern aufgefallen** ist. Die Erklärung dahinter kann trotzdem bei
beiden falsch sein; ein Beispiel dafür steht in §4.1 des Vergleichs.

## Namensschema

`<datum>_<linse>_<modell>.md` — z. B. `2026-08-21_balance_openai-gpt-5.1.md`.
Mehrere Modelle zur selben Linse ergeben mehrere Dateien nebeneinander; das ist die
Zweitmeinung, nicht ein Versehen.
