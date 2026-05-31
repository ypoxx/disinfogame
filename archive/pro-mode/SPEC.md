# ❄️ Pro Mode — eingefrorene Spezifikation

> **Status:** Archiviert / eingefroren · **Aktualisiert:** 2026-05-31 · **Scope:** Pro
> **Kanonisch für:** Beschreibung des Pro-Mode-Standes zum Zeitpunkt des Einfrierens

Pro Mode wird **vorerst nicht weiterentwickelt** (Entscheidung 2026-05-31, siehe
[`../../docs/VISION_LOCK.md`](../../docs/VISION_LOCK.md) §6). Diese Datei hält fest, *was* Pro Mode ist,
damit das Wissen nicht verloren geht. **Der Code bleibt vorerst im Projekt**
(`desinformation-network/src/game-logic/`); eine saubere Heraustrennung ist ein möglicher späterer
Schritt, aber kein aktuelles Ziel.

## Was Pro Mode ist
Ein abstraktes Strategiespiel: Der Spieler manipuliert das **Vertrauen** in einem Netzwerk
gesellschaftlicher Akteure (Medien, Experten, Lobby, Organisationen). Optik: „Infographic"
(Datenvisualisierung), nicht die brutalistische Story-Optik.

- **Akteure:** ~56–58, mit Werten wie Vertrauen, Widerstandskraft, Einfluss-Radius.
- **Fähigkeiten:** z. B. „Agenda setzen", „Skandalisieren", „Autorität untergraben" — senken Vertrauen,
  wirken über Verbindungen weiter.
- **Zeit:** in **Runden**.
- **Gegenkräfte:** Vertrauens-Erholung, abnehmender Effekt bei Wiederholung, und **Verteidiger**
  (Faktenchecker, Medienkompetenz, Regulierer), die mit der Zeit auftauchen.

## Bekannte, NICHT aufgelöste Widersprüche (eingefroren als Code-Stand)

| Frage | `GAME_DESIGN.md` | `archive/docs/ROADMAP_pro-expansion.md` |
|---|---|---|
| Rundenlimit | 32 | 40 |
| Siegbedingung | eine (75 % der Akteure unter 40 % Vertrauen) | vier Pfade |
| Defensiv-Sieg (Gegner) | Durchschnittsvertrauen > 80 % | > 70 % + 3 Verteidiger |

Bei einer späteren Wiederaufnahme von Pro Mode müssen diese Punkte zuerst entschieden werden.

## Wo der Code liegt
- Spiel-Logik: `desinformation-network/src/game-logic/` (u. a. `GameState.ts`, `actor-ai.ts`, `balance-config.ts`)
- Detaillierte Mechanik-Beschreibung: `desinformation-network/.claude/GAME_DESIGN.md`
