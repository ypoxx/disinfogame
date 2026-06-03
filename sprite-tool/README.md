# Asset Studio

Internes Werkzeug zur Erstellung von Spiel-Assets (Grafik via Gemini; Audio via ElevenLabs geplant).

> **Im Browser nutzen (gehostet, ohne CLI, passwortgeschützt):** siehe **[DEPLOY.md](DEPLOY.md)** (Netlify).

## Features

**🎬 Regie-Modus (Art-Director-Assistent)** — siehe [`../docs/ASSET_STUDIO_DIRECTOR.md`](../docs/ASSET_STUDIO_DIRECTOR.md)
- **Kennt das Spielkonzept** (Gebäude/Räume/Personen aus `public/game/`) → macht Vorschläge statt leerer Prompt-Felder
- **Stil-Findung** - Claude schlägt mehrere Richtungen vor, dasselbe Testmotiv pro Richtung → vergleichen & übernehmen
- **Stil-Bibel** (versioniert) + **Master-Referenzen** → erzwungene Konsistenz über alle Assets
- **Shot-Liste** automatisch aus den Spieldaten abgeleitet (neue Räume/Etagen/Personen erscheinen von selbst)
- **Varianten-Kritik** - Claude *sieht* die generierten Bilder und bewertet sie gegen die Bibel + Regie-Chat

**🖼️ Erzeugen & Bearbeiten**
- **Nano Banana Pro / Gemini 3 Pro Image** - Bildgenerierung (Varianten, Ratio, Seed, Referenzen)
- **Inpainting + Masken-Editor** - nur Teile ändern
- **Pixel-Nachbearbeitung** - Downscale (Nearest), Hintergrund→Transparenz, Paletten-Lock
- **Hotspot-Regionen** auf Raum-Hintergründen (→ `building.json`)

**🎞️ Sprite-Sheet-Studio** - generiertes Sheet in Frames zerlegen, Animation prüfen, Frames packen → spielfertiges `type:"sheet"`

**📚 Bibliothek & Export** - kuratieren, „fürs Spiel" markieren, als ZIP (`assets.json` + Dateien) exportieren

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

1. **Keine Keys im Code** - Keys kommen aus `.env.local` oder werden in der UI (⚙️) eingegeben
2. **Keys nur lokal** - UI-Keys liegen ausschließlich in deinem Browser (localStorage) und gehen pro Anfrage als Header an die lokalen API-Routen; nichts wird ins Repo committet
3. **Gehostet: passwortgeschützt** - die deploybare Instanz ist per Basic Auth gesperrt (nur die **Seiten/UI**; `/api/*` ist bewusst ausgenommen, aber ohne UI-Key wirkungslos — Server-Key-Fallback ist in Produktion deaktiviert). Siehe [DEPLOY.md](DEPLOY.md)
4. **Kein Logging** - Keys werden nicht in Logs geschrieben

### Falls du das Tool deployen willst

Bei Deployment auf Vercel, Netlify o.ä.:
- Trage die Keys in den **Environment Variables** der Plattform ein
- Nutze **niemals** öffentliche Repos mit Keys im Code
- Aktiviere ggf. Spending Limits in den API-Consoles

---

## Workflow (Regie-Modus, empfohlen)

```
1. ⚙️ Keys eintragen (Google = Bilder, Claude = Regie)
2. 🎬 Regie → Briefing (Studio kennt Gebäude/Cast bereits)
3. Stil-Findung: Richtungen vorschlagen → Testmotive vergleichen → übernehmen (Stil-Bibel v1)
4. Shots: Shot wählen → Prompt vorschlagen → Varianten generieren (mit Master-Referenzen)
5. Bewerten lassen (Claude) → beste wählen → Pixel-Nachbearbeitung → „auch als Stil-Master"
6. Übernehmen → Bibliothek (Räume: Hotspots markieren)
7. 🎞️ Sprite-Sheet: Sheet-Bild slicen → Animation prüfen → speichern
8. 📚 Bibliothek → Export (ZIP) → entpacken nach desinformation-network/public/assets/
```

Daneben gibt es **✨ Frei erzeugen** als schnellen Direkt-Weg ohne Regie.

> **Spieldaten aktualisieren:** `npm run sync:game` kopiert `building.json`/`npcs.json` aus dem Spiel nach `public/game/`.

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
