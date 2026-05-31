# 🎛️ Grafik-Backend (Asset-Pipeline) — Spezifikation

> **Status:** Aktiv (Plan) · **Aktualisiert:** 2026-05-31 · **Scope:** Story / Tooling · Gehört zu **Track A‑2** der `ROADMAP.md`
> Basis ist das bereits vorhandene **`sprite-tool/`**. Ziel: ein einfaches „Backend", in dem du Keys einstellst,
> Assets per KI erzeugst (konsistent), auswählst, editierst und ins Spiel exportierst.

## Ziel (deine Anforderung)
Ein simples Werkzeug, um **alle Grafiken per API zu erstellen**:
Keys einstellen → Assets erzeugen (Google **und** OpenAI) → **Konsistenz** über Stil-Beschreibung + Referenzbilder →
Auswahl/Kuratierung → Editieren (Inpainting, Zuschneiden, Bereiche markieren) → Export ins Spiel (per API zurückspielen).

## Was schon existiert (`sprite-tool/`)
- Next.js-Tool mit **Stil-Guide** (`public/context/game-style-guide.md` = der „Style-Anchor"),
  Prompt-Verbesserung (Claude), Bilderzeugung (Gemini), **Masken-/Inpainting-Editor**.
- **Lücken:** OpenAI als zweite Quelle · Keys-UI · Asset-Bibliothek/Auswahl · **Sprite-Sheet-Zusammenbau** ·
  Zuschneiden · Bereiche markieren · Export ins Spiel. Außerdem ist der Modellname **veraltet**
  (`gemini-2.0-flash-exp` → auf aktuelles „Nano Banana" heben).

## Aktuelle Modelle (Web-Stand 2026 — API-IDs verifiziert)

> ✅ **Entscheidung (2026-05-31): nur `gemini-3-pro-image` (Nano Banana Pro)** als einziges Bild-Modell.
> Begründung: **wenige Assets → geringe Kosten**; **Schärfe reicht** (kein 3D-Shooter); **kaum Text in Grafiken**
> → **Text wird im Code eingefügt** (flexibler, lokalisierbar `_de`/`_en`, gestochen scharf, ohne neu zu generieren).
> Folge fürs `sprite-tool`: **ein** Provider, **ein** Key → einfacher; der „Anbieter-Auswahl"-Punkt unten **entfällt vorerst**.
> `gpt-image-2` bleibt nur als **optionale** spätere Alternative notiert.

- **OpenAI: `gpt-image-2`** (GPT Image 2, April 2026) — bis **4K**, sehr starke Instruktions-Treue & Konsistenz.
  ⚠️ **Unterstützt KEINEN transparenten Hintergrund** → für freistehende Sprites den Hintergrund **hinterher** freistellen.
- **Google: `gemini-3-pro-image`** (Nano Banana Pro) — Top für Konsistenz: bis zu **14 Referenzbilder**,
  Identitäts-Erhalt, lokale Edits, 2K/4K. Günstiger/schneller: `gemini-2.5-flash-image` (Nano Banana).
- Das `sprite-tool` nutzt aktuell `gemini-2.0-flash-exp` → **auf `gemini-3-pro-image` (oder `gemini-2.5-flash-image`) heben.**

## Konsistenz-Rezept (web-bestätigt — genau dein Ansatz)
1. **Style-Anchor:** ein fester Absatz (Stil, Palette, Verbote, Stimmung) **vor jedem** Prompt — macht `game-style-guide.md` bereits.
2. **Master zuerst:** *eine* Hauptfigur / *einen* Master-Raum erzeugen → als **Referenzbild** für alle weiteren Assets („same style as …").
3. **Referenzbild(er) + fester Seed** bei jeder Generierung → reproduzierbar.
4. Kleine Abweichungen per **Inpainting/Maske** korrigieren (ist im Tool da).
5. Für Figuren: **Turnaround/Model-Sheet** (vorne/seite/…) zuerst, daraus die Animations-Frames.

## Feature-Plan (auf `sprite-tool` aufbauen)
- [ ] **Keys-UI:** Gemini- und OpenAI-Key bequem im Tool einstellen (statt nur `.env`).
- [ ] **Anbieter-Auswahl** (Gemini ↔ OpenAI) + Modell aktualisieren (Nano Banana / gpt-image-1).
- [ ] **Style-Lock:** Master-Referenzbild + Seed-Feld; Style-Anchor automatisch vorangestellt.
- [ ] **Asset-Bibliothek:** erzeugte Assets speichern, taggen, **„fürs Spiel auswählen"** markieren.
- [ ] **Sprite-Sheet-Zusammenbau:** N Frames → ein PNG-Raster **+** JSON (Frame-Koordinaten/Animationen).
- [ ] **Editieren:** Inpainting (da) + **Zuschneiden** + **Bereiche markieren** (Rechtecke).
- [ ] **Export ins Spiel:** gewählte Assets + `assets.json` nach `desinformation-network/public/assets/` schreiben.

## Verbindung zum Spiel
- **Markierte Bereiche** auf Raum-Hintergründen = klickbare **Hotspots** → liefern Daten für `building.json`/Räume (Track A‑1/A‑3).
- **Sprite-Sheets + JSON** → `useSprite`-Hook für Avatar/NPC-Figuren (Track A‑4; Bauplan in `BUILDING_CONCEPT.md`).
- **Asset-Manifest** (`assets.json`: id, typ, provider, prompt, seed, style-version) macht alles **reproduzierbar & versioniert**.

## Quellen (2026)
- Google: [Nano Banana image generation (ai.google.dev)](https://ai.google.dev/gemini-api/docs/image-generation) · [Consistent Imagery Codelab](https://codelabs.developers.google.com/gemini-consistent-imagery-notebook) · [Nano Banana Pro](https://blog.google/innovation-and-ai/products/nano-banana-pro/)
- OpenAI: [Image generation guide](https://developers.openai.com/api/docs/guides/image-generation) · [Prompting guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide)
- Community: [Consistent AI characters (2025)](https://medium.com/design-bootcamp/how-to-design-consistent-ai-characters-with-prompts-diffusion-reference-control-2025-a1bf1757655d) · [Scenario sprite/turnaround](https://www.scenario.com/blog/ai-sprite-generator)
