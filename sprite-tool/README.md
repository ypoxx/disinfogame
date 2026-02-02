# Sprite Studio

KI-gestütztes Tool zur Erstellung von Spielgrafiken für das Disinfo-Spiel.

## Features

- **Claude-gestützte Prompt-Verbesserung** - Kennt den Spiel-Kontext (Sowjet-Ästhetik)
- **Nano Banana Pro Integration** - Google's beste Bild-KI
- **Inpainting** - Nur Teile eines Bildes ändern
- **Masken-Editor** - Bereiche zum Bearbeiten markieren
- **Erweiterte Controls** - Varianten, Seitenverhältnis, Seed, Referenzen

## Quick Start

### 1. Abhängigkeiten installieren

```bash
cd sprite-tool
npm install
```

### 2. API Keys einrichten

```bash
# Kopiere die Beispiel-Datei
cp .env.example .env.local
```

Dann öffne `.env.local` und füge deine API Keys ein:

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
GOOGLE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

---

## API Keys beschaffen

### Claude API (Anthropic)

1. Gehe zu [console.anthropic.com](https://console.anthropic.com/)
2. Erstelle einen Account oder logge dich ein
3. Navigiere zu **Settings** → **API Keys**
4. Klicke **Create Key**
5. Kopiere den Key (beginnt mit `sk-ant-`)

**Kosten:** ~$0.003 pro Prompt-Verbesserung (Claude Sonnet)

### Google AI (Nano Banana Pro)

1. Gehe zu [aistudio.google.com](https://aistudio.google.com/)
2. Logge dich mit deinem Google Account ein
3. Klicke auf **Get API Key** (oben rechts)
4. Erstelle einen neuen Key oder nutze einen bestehenden
5. Kopiere den Key (beginnt mit `AIza`)

**Kosten:** ~$0.04 pro generiertes Bild (1024x1024)

---

## Sicherheit

### .env.local wird NICHT committed

Die Datei `.env.local` ist in `.gitignore` eingetragen und wird **niemals**
ins Repository hochgeladen. Deine API Keys bleiben lokal.

### Zusätzliche Sicherheitsmaßnahmen

1. **Keine Keys im Code** - Alle Keys werden über Umgebungsvariablen geladen
2. **Server-side only** - API Keys werden nur auf dem Server verwendet, nie im Browser
3. **Rate Limiting** - Das Tool begrenzt Anfragen automatisch
4. **Kein Logging** - Keys werden nicht in Logs geschrieben

### Falls du das Tool deployen willst

Bei Deployment auf Vercel, Netlify o.ä.:
- Trage die Keys in den **Environment Variables** der Plattform ein
- Nutze **niemals** öffentliche Repos mit Keys im Code
- Aktiviere ggf. Spending Limits in den API-Consoles

---

## Workflow

```
1. Asset-Typ wählen (Sprite / Szene / Element)
2. Prompt eingeben (z.B. "Ein Büroangestellter der läuft")
3. (Optional) Prompt mit Claude verbessern oder auto-verbessern lassen
4. Varianten generieren (Ratio/Seed/Referenzen optional)
5. Beste Variante auswählen
6. Bei Bedarf: Bereich markieren und per Inpainting korrigieren
7. Als PNG exportieren
```

---

## Projektstruktur

```
sprite-tool/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Hauptseite
│   │   └── api/
│   │       ├── claude/        # Prompt-Verbesserung
│   │       ├── generate/      # Bildgenerierung
│   │       └── inpaint/       # Inpainting
│   ├── components/
│   │   ├── PromptAssistant.tsx
│   │   ├── ImageGenerator.tsx
│   │   └── ImageEditor.tsx
│   ├── lib/
│   │   ├── claude.ts          # Claude API Wrapper
│   │   ├── constants.ts       # Gemeinsame Konstanten
│   │   └── nanoBanana.ts      # Google AI Wrapper
│   └── types/
│       └── index.ts
├── public/
│   └── context/
│       └── game-style-guide.md  # Spiel-Kontext für Claude
├── .env.example               # Beispiel für API Keys
├── .env.local                 # DEINE Keys (nicht im Git!)
└── README.md
```

---

## Troubleshooting

### "API Key ungültig"
- Prüfe ob du `.env.local` (nicht `.env.example`) bearbeitet hast
- Prüfe ob der Key korrekt kopiert wurde (keine Leerzeichen)
- Starte den Dev-Server neu nach Änderungen an `.env.local`

### "Rate Limit erreicht"
- Warte einige Sekunden und versuche es erneut
- Google AI hat ein kostenloses Kontingent, danach fallen Kosten an

### Bilder werden nicht generiert
- Prüfe die Browser-Konsole (F12) auf Fehlermeldungen
- Prüfe das Terminal auf Server-Fehler

---

## Kosten-Übersicht

| Aktion | Kosten (ca.) |
|--------|--------------|
| Prompt verbessern (Claude) | $0.003 |
| 4 Bilder generieren (Nano Banana) | $0.16 |
| Inpainting (pro Bearbeitung) | $0.04 |
| **Typisches Asset (mit Iterationen)** | **$0.10 - $0.30** |

---

## Lizenz

Internes Tool für das Disinfo-Spiel Projekt.
