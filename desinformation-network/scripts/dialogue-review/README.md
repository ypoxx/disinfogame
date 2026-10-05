# Dialog-Review-Harness (R6)

Automatischer, wiederholbarer Linter für die Dialog-Daten — das Abnahme-Gate der
NPC-Berater-Regie (`docs/AUFTRAG_2026-07-06_NPC_REGIE_VOLLER_WURF.md`, Etappe R6).
Fängt die billigen 80 % der Mängel, die in der Owner-Stichprobe auftauchten, damit
die teure Urteils-Arbeit (Persona-/Stimm-Treue) sich auf den Rest konzentriert.

## Lauf

```bash
cd desinformation-network
npm run dialogue-review          # Report + runs/dialogue-review/latest/BEFUNDE.json
node scripts/dialogue-review/lint.mjs --strict   # Exit 1 bei Error-Befunden (CI-tauglich)
```

## Geprüfte Klassen

| Kategorie | Stufe | Was |
|---|---|---|
| `verbotsliste-moebel` | error | Möbel/Dev-Vokabular im NPC-Text (Sendeplan, Narrativ-Tafel …) |
| `verbotsliste-emoji` | error | Emoji im Dialogtext |
| `platzhalter-fehlt` | error | `{x}` ohne Eintrag in `insert_library.json` |
| `kasus-dativ-taler` | error | Dativ-Rahmen vor `{budget_value}` → „Taler" statt „Talern" |
| `numerus-plural` | error | Zähl-Insert vor hart-pluralem Substantiv (`1 … Operationen`) |
| `verbotsliste-anglizismus` / `-floskel` | warn | Anglizismen-Soße, Behörden-Floskeln |
| `ascii-umlaut` | warn | ASCII-Ersatz statt Umlaut/ß (`nuetzlich`, `waere`) |
| `bindestrich-kaskade` | warn | Voll-Satz per „ - " in einen Satz geklebt |
| `fallback-rahmen` | warn | „liegt bei {x}" + Adjektiv-Fallback (`liegt bei unbekannt`) |
| `numerus-tage` | warn | `{days_remaining}` hängt hart „ Tage" an (`1 Tage`) |
| `parity-en-fehlt` | warn | `text_en` fehlt zu `text_de` |
| `insert-ungenutzt` / `tone-abdeckung` / `id-doppelt` | info | Hygiene-Hinweise |

Rein lesend, kein LLM. Der Report ist gitignored (`runs/`).
