# ⏸ Offen: die fünf Animations-Gruppen des zweiten Durchgangs

**Datum:** 2026-08-22 · **Modell:** `gpt-5.6-sol` (OpenAI direkt) · **Status:** nicht gelaufen

Der zweite UX/UI-Durchgang ist bei den **Screenshot-Bündeln vollständig** (14 Berichte +
Synthese). Die fünf **Animations-Gruppen** fehlen — mitten im Nachlauf war das
OpenAI-Guthaben aufgebraucht:

```
HTTP 429 · insufficient_quota · credit_balance_exhausted
"You have no credits remaining."
```

Betroffen sind damit genau die fünf ox-alpha-Berichte vom 2026-08-21, die im Vergleich
**ohne Gegenstück** bleiben:

| ox-alpha-Bericht | Clips |
|---|---|
| `2026-08-21_ui-clips-ambient1_stealth-ox-alpha.md` | ambient_etage1/2/3 |
| `2026-08-21_ui-clips-ambient2_stealth-ox-alpha.md` | ambient_etage4, ambient_keller, avatar_walk |
| `2026-08-21_ui-clips-bewegung2_stealth-ox-alpha.md` | elevator, walkhome_dayreport |
| `2026-08-21_ui-clips-broadcast_stealth-ox-alpha.md` | broadcast |
| `2026-08-21_ui-clips-daynight_sweep_stealth-ox-alpha.md` | daynight_sweep |

Alles andere liegt bereit: Die 40 Einzelbilder sind gezogen
(`runs/visual-review/latest/frames/animation/`, `node src/cli.mjs frames --anzahl 4`), die
Gruppierung und die wortgleiche Frage des ersten Laufs stehen in
`tools/model-review/scripts/clip-gruppen-nachlauf.sh`. Nach dem Aufladen genügt:

```bash
bash tools/model-review/scripts/clip-gruppen-nachlauf.sh
```

> **Warum nicht über OpenRouter nachziehen?** Ginge — dann wäre es aber ein Vergleich
> gegen ein *drittes* Modell und nicht mehr derselbe zweite Durchgang. Für die fünf
> Gruppen lohnt sich das Warten auf Guthaben mehr als ein Bruch in der Vergleichsbasis.
