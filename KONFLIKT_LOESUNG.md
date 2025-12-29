# Anleitung: Pull Request Konflikte lösen

## Status

✅ **Alle 10 Branches wurden lokal gemerged**
❌ **Push schlägt fehl** (Session-ID Einschränkung)

## Deine Optionen

### Option 1: GitHub Web Interface (EMPFOHLEN für Anfänger)

Für jeden Branch mit Konflikt:

1. Gehe zum Pull Request auf GitHub
2. Klicke auf **"Resolve conflicts"**
3. Für jede konfliktbehaftete Datei:
   - **Wähle die RECHTE Seite** (von `main`)
   - Klicke "Mark as resolved"
4. Klicke "Commit merge"
5. Der PR kann jetzt gemerged werden!

**Warum die rechte Seite?**
- Die alten Branches sind Analyse/Planung
- `main` hat die neuesten Implementierungen (Story Mode, Features)
- Die Dokumentation aus den alten Branches bleibt erhalten

---

### Option 2: Lokal clonen und pushen

Wenn du Git auf deinem Computer hast:

```bash
# 1. Repository clonen
git clone https://github.com/ypoxx/disinfogame.git
cd disinfogame

# 2. Für jeden Branch:
git checkout <branch-name>
git merge main

# 3. Konflikte lösen (nimm main's Version):
git checkout --theirs <datei>
git add .
git commit -m "Merge main - resolve conflicts"

# 4. Pushen
git push origin <branch-name>
```

---

### Option 3: Alle PRs schließen (EINFACHSTE Lösung)

Da die meisten Branches **Planung und Analyse** waren, nicht Code:

**Welche Branches sind wichtig?**

| Branch | Wichtig? | Grund |
|--------|----------|-------|
| `claude/analyze-game-architecture-*` | ❌ Nein | Nur Dokumentation/Planung |
| `claude/fix-cluster-category-error-*` | ⚠️ Vielleicht | Bug-Fixes (aber alt) |
| `claude/fix-game-update-issues-*` | ⚠️ Vielleicht | Bug-Fixes (aber alt) |
| `claude/fix-network-map-ui-*` | ❌ Nein | Bereits in neueren Versionen |
| `claude/game-concept-discussion-*` | ❌ Nein | Nur Diskussion |
| `claude/improve-game-mechanics-*` | ❌ Nein | Bereits in neueren Versionen |
| `claude/network-game-ux-research-*` | ❌ Nein | Nur Research |
| `claude/research-game-improvements-*` | ❌ Nein | Nur Research |
| `claude/ui-ux-redesign-*` | ❌ Nein | Bereits in neueren Versionen |
| `codex/define-room-states-*` | ⚠️ Vielleicht | Story Mode Feature |

**Empfehlung:**
Schließe alle PRs **außer** vielleicht die 3 Bug-Fix Branches, wenn du sie wirklich brauchst.

---

## Die Konflikte im Detail

### Typische Konflikt-Dateien:

1. **App.tsx** - Main hat neuere UI
   → Nimm `main` Version

2. **GameState.ts** - Main hat Story Mode Integration
   → Nimm `main` Version

3. **NetworkVisualization.tsx** - Main hat neuere Rendering-Logik
   → Nimm `main` Version

4. **useGameState.ts** - Main hat neuere Hooks
   → Nimm `main` Version

**Regel:** Bei Zweifelsfall immer `main` nehmen! ✅

---

## Was ist NICHT verloren?

Keine Angst! Diese Dinge sind bereits in `main`:

✅ Story Mode (PR #24 gemerged)
✅ Alle Actors & Abilities
✅ Event System
✅ Combo System
✅ UI Improvements

Die alten Branches hatten hauptsächlich:
- Planungsdokumente (ROADMAP, AUDIT_REPORT, etc.)
- Research Notizen
- Alte Code-Versionen die inzwischen überholt sind

---

## Schnellste Lösung

**Für Anfänger: Schließe einfach alle PRs**

1. Gehe zu jedem PR
2. Klicke "Close pull request"
3. Schreibe: "Superseded by newer implementations in main"

**Das ist OK!** Die wichtigen Features sind bereits in `main`.

---

## Fragen?

Frag mich, wenn du:
- Nicht sicher bist, welche Branch wichtig ist
- Hilfe beim Konflikt-Lösen brauchst
- Wissen willst, was genau in einem Branch war
