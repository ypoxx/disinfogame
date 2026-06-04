# 🚀 Asset Studio im Browser bereitstellen (Netlify) — ohne CLI

Ziel: Das Asset Studio dauerhaft unter einer eigenen URL erreichen, **passwortgeschützt**,
als Einzelnutzer. Alle Schritte laufen **im Browser** — kein Terminal nötig.

> **Sicherheit vorab:** Der Schutz (`src/proxy.ts`) ist *fail-closed*. Ohne gesetztes
> `SITE_PASSWORD` ist die Seite **gesperrt** (nicht offen). Deine API-Keys (Gemini usw.)
> trägst du **in der App** unter ⚙️ ein — sie bleiben in deinem Browser und müssen
> **nicht** zu Netlify.
>
> **`/api` & Server-Keys:** Die API-Routen liegen **nicht** hinter dem Seiten-Passwort
> (sonst scheitern die internen `fetch()`-Aufrufe an 401 — „Key ungültig"/Passwort-Re-Prompt).
> Sie sind sicher, weil sie einen **Nutzer-Key** brauchen: Trag deine Keys **in der App**
> unter ⚙️ ein. **Setze KEINE Server-Fallback-Keys** (`GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY` …)
> in Netlify — der Production-Build ignoriert sie ohnehin (Server-Key-Fallback ist dort hart
> deaktiviert). Brauchst du je echte Server-Keys, sag Bescheid → dann auf ein Cookie-Gate umstellen.

---

## Einmalige Einrichtung (ca. 5 Minuten, nur Browser)

1. **Netlify-Account:** auf [app.netlify.com](https://app.netlify.com) mit GitHub anmelden
   (kostenlos). Beim ersten Mal Netlify den Zugriff auf das Repo `ypoxx/disinfogame` erlauben.

2. **Neue Site:** oben **„Add new site" → „Import an existing project" → „GitHub"** →
   Repository **`ypoxx/disinfogame`** auswählen.

3. **Build-Einstellungen** (das Wichtigste):
   - **Branch to deploy:** `main` *(empfohlen — siehe Hinweis unten)*.
   - **Base directory:** `sprite-tool`  ← unbedingt setzen!
   - **Build command:** `npm run build`  *(wird meist automatisch erkannt)*
   - **Publish directory:** leer lassen *(das Next.js-Plugin setzt das selbst)*

4. **Passwort setzen — VOR dem Deploy:** auf **„Add environment variables"** (bzw. später
   unter *Site configuration → Environment variables*) klicken und anlegen:
   | Key | Value |
   |---|---|
   | `SITE_PASSWORD` | dein langes, zufälliges Passwort |
   | `SITE_USER` | *(optional; Standard ist `admin`)* |

5. **„Deploy"** klicken und warten, bis der Build grün ist (1–3 Min).

6. **✅ Schutz prüfen (Pflicht!):** die neue URL in einem **privaten/Inkognito-Fenster** öffnen.
   Es **muss** ein Login-Fenster erscheinen → mit `admin` + deinem Passwort anmelden.
   - Erscheint **kein** Login-Fenster → sofort melden (dann härte ich nach).
   - Steht da *„SITE_PASSWORD ist nicht gesetzt"* → Variable aus Schritt 4 fehlt/falsch
     → setzen und unter *Deploys → Trigger deploy* neu bauen.

Fertig. Ab jetzt: **URL öffnen → Passwort → ⚙️ einmal API-Keys eintragen → arbeiten.**

---

## Hinweise

- **Branch `main`:** Der Asset-Studio-Code liegt inzwischen auf `main` (PRs #70/#71 gemergt).
  Für einen stabilen Deploy daher in Schritt 3 `main` als „Branch to deploy" wählen.

- **Updates:** Wenn ich am Tool etwas ändere und pushe, baut Netlify automatisch neu — du musst
  nichts tun.

- **Kosten:** Netlify-Gratis-Stufe genügt für Einzelnutzung. KI-Kosten laufen über deine eigenen
  Keys (in der App eingetragen).

- **Passwort ändern:** Wert von `SITE_PASSWORD` im Netlify-Dashboard ändern → neu deployen.

- **„Export ins Spiel" (kommt mit M2):** Da die gehostete Instanz nicht direkt ins Spiel-Repo
  schreiben kann, wird Export dort per **ZIP-Download** oder **Commit ins GitHub-Repo** laufen
  (im Browser). Details klären wir bei M2.
