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

## Namensschema

`<datum>_<linse>_<modell>.md` — z. B. `2026-08-21_balance_openai-gpt-5.1.md`.
Mehrere Modelle zur selben Linse ergeben mehrere Dateien nebeneinander; das ist die
Zweitmeinung, nicht ein Versehen.
