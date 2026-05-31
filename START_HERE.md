# 🚀 START HERE — Desinformation Network (frischer Stand)

> **Stand:** 2026-05-31 · Saubere **Story-Mode-Basis** (Pro Mode archiviert) · Build & Tests grün

## Was das Projekt jetzt ist
Ein narratives Strategiespiel — **Story Mode**: Du leitest einen Mitarbeiter einer
Desinformations-Agentur durch moralische Entscheidungen, NPC-Beziehungen und bleibende
Konsequenzen (brutalistische Büro-Simulation im Stil von *Papers Please*).

Der frühere abstrakte **Pro Mode** (Netzwerk-/Vertrauens-Spiel) ist **eingefroren und
archiviert** unter `archive/pro-mode/` (Code + Backend + Spezifikation) — nichts gelöscht,
jederzeit zurückholbar.

## Schnellstart
```bash
cd desinformation-network
npm install
npm run dev        # → http://localhost:5173 → Knopf „📖 Story Mode starten"

# Qualität prüfen (alles grün):
npm run typecheck
npm run build
npx vitest run src/story-mode/__tests__
```

## Wo liegt was
| Zweck | Pfad |
|---|---|
| **Verbindliche Wahrheit** (Figuren, Zahlen, Stil, Entscheidungen) | `docs/VISION_LOCK.md` |
| Reihenfolge & Schwerpunkte | `ROADMAP.md` |
| Komplettes Datei-Inventar (behalten/archiviert) | `docs/INVENTORY.md` |
| Karte „was liegt wo" | `docs/CODEBASE_MAP.md` |
| Dialog-System erklärt **und behoben** | `docs/DIALOGUE_DIAGNOSIS.md` |
| Story-Spielcode | `desinformation-network/src/story-mode/` |
| Brücke zur Engine + geteilte Typen/Utils | `desinformation-network/src/game-logic/` |
| Archiv (alte Pläne, Pro-Code/Backend) | `archive/` |

## Was in der Aufräum-Runde gemacht wurde
- **Aufgeräumt:** toter Code, Müll-ZIPs, doppelte Daten entfernt; 11 → wenige Root-Dateien.
- **Verbessert:** Dialog-Kernfehler behoben — NPC-Reaktionen erscheinen wieder (mit Test belegt).
- **Fokussiert:** Pro Mode (UI + Engine + Backend) nach `archive/` ausgelagert → App ist **Story-only**.
- **Grün:** Typecheck sauber, 88 Story-Unit-Tests bestehen, Produktions-Build läuft (Bündel kleiner).

## Sinnvolle nächste Schritte (in kleinen, geprüften Schritten — mit dir am Steuer)
1. **Große Dateien zerlegen:** `StoryEngineAdapter.ts` (5119 Z.), `useStoryGameState.ts` (1447 Z.),
   `DialogLoader.ts` (1336 Z.) — jeweils Stück für Stück, Build/Tests nach jedem Schnitt.
2. **Story-Inhalt & Balance** ausbauen (mehr Reaktionen/Themen/Endings, Spielgefühl).
3. **Optional:** laufende Pixel-Figur (Avatar) — technisch klein, braucht nur **ein** Lauf-Zyklus-Bild.
