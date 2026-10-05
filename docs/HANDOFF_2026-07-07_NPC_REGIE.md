# 🤝 HANDOFF 2026-07-07 — NPC-Berater-Regie (erster Durchstich)

> **Für die nächste Session.** Prinzipien-Wahrheit: `AUFTRAG_2026-07-06_NPC_REGIE_VOLLER_WURF.md`
> (§12 = offene Folgeschritte + Parallel-Session-Hinweis).

## Was in dieser Session gebaut wurde
Erster lauffähiger Durchstich der NPC-Berater-Regie (R0–R6). **Typecheck + Build + 636 Story-Tests grün.**

| Datei | Was |
|---|---|
| `src/story-mode/engine/BeraterRegie.ts` **(neu)** | Kern: `Angebot` bauen, 3-Takt-Bestätigung (`renderBestaetigung`), Wirkung/Freischaltung aus `effects`/`unlocks`, `audienceFit` (R3), `renderWettstreit`/`renderUebergangen` |
| `src/story-mode/data/formulierungsbank.json` **(neu)** | Autoren-Zeit-Bank, 5 Stimmen × Slots (bestaetigung/wettstreit/uebergangen), agreement-sichere Platzhalter |
| `src/story-mode/hooks/useStoryGameState.ts` | Betonierten Bestätigungssatz durch Regie ersetzt (`handleDialogChoice`); `buildActionOfferChoices` nutzt `label_de` statt `headline_de`; R2-Wettstreit + R4-Übergangen in `interactWithNpc`; `npcsWithOffers`; `passedOverRef` |
| `src/story-mode/data/topics_dialogues.json` · `insert_library.json` | Grammatik-Fixes: Kasus (Taler/Talern), Numerus („1 … Operationen"), Bindestrich-Kaskade, „liegt bei unbekannt", ASCII-Umlaute/ß |
| `scripts/dialogue-review/lint.mjs` **(neu)** | Review-Harness — `npm run dialogue-review` → `runs/dialogue-review/latest/BEFUNDE.json` |
| `__tests__/BeraterRegie.test.ts` **(neu)** · `ActionFromDialog.test.ts` | 13 neue Regie-Tests; Alt-Test auf neues (korrektes) `label_de`-Verhalten angepasst |

## Der Beleg, dass es „führt" (aus echten Daten)
Aktion `1.4` (Katja, `unlocks:["8.7"]`=„Person erpressen", `reveals_weaknesses`) →
`renderBestaetigung` liefert z. B.: *„Gut — ich nehme mir Dr. Ferro vor. Ist das durch, steht
„Person erpressen" offen. Ihre Entscheidung, wie weit wir gehen."* — statt des alten
„…liegt jetzt auf dem Sendeplan."

## Nächster sinnvoller Schritt
**R4-Persistenz + R2-Sammel-Auswahl** (s. AUFTRAG §12). Die `debates` in `topics_dialogues.json`
sind das autorierte Substrat für die Nebeneinander-Auswahl konkurrierender NPC-Körbe und brauchen
zudem einen ASCII-Umlaut-/Stimm-Sweep.

## Verifikation
```bash
cd desinformation-network
npm run typecheck && npm run build
npx vitest run src/story-mode/__tests__      # 636 grün
npm run dialogue-review                       # 0 error
```
