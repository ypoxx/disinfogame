# 🔭 Zwei fremde Modelle, dieselben Bildschirme — Vergleich und Plan

**Datum:** 2026-08-22
**Grundlage:** 21 Berichte von `stealth/ox-alpha` (2026-08-21, via OpenRouter) und
14 Berichte von `gpt-5.6-sol` (2026-08-22, OpenAI direkt) — beide über dieselbe
Ernte `runs/visual-review/latest`, dieselbe Linse `ui`, 1280 × 720.
**Werkzeug:** [`tools/model-review`](../../tools/model-review/)

> **Der Zweck dieses Dokuments.** Die Einzelberichte sind Hypothesen von Modellen, die
> nur Bilder gesehen haben. Hier steht, **worin sie übereinstimmen**, **wo sie sich
> widersprechen**, **was der Code dazu sagt** — und daraus ein Plan, der nach Wirkung
> je Aufwand sortiert ist.

---

## 1. Was die beiden Läufe sind

| | `stealth/ox-alpha` | `gpt-5.6-sol` |
|---|---|---|
| Anbieter | OpenRouter | OpenAI direkt |
| Berichte | 21 Dateien: 12 Bündel + 2 Synthesen + Clips/Nachläufe | 15 Dateien: 14 Bündel + 1 Rauchtest |
| Clips (Video-Eingang) | ja — 5 Clip-Bündel gelesen | **nein** — API nimmt kein `video_url` |
| Synthese | ja | **nein** — Guthaben nach 14 Bündeln erschöpft (HTTP 429) |
| Kosten | $0,00 (Gratis-Modell) | vom Konto verbraucht, Betrag von der API nicht gemeldet |
| Umfang der Berichte | 388.215 Zeichen | 375.641 Zeichen |

Das Bündel `dialog` lief bei OpenAI **zweimal** (Rauchtest + voller Lauf, unabhängig
voneinander). Beide Durchgänge nennen dieselben drei Hauptmaßnahmen in derselben
Reihenfolge — ein brauchbarer Beleg dafür, dass die Berichte nicht Zufallsprodukte sind.

**Wichtig für die Bewertung:** Die beiden Modelle haben sich nicht abgesprochen und
kennen einander nicht. Übereinstimmung heißt daher: *dieselbe Sache ist zwei
unabhängigen Betrachtern aufgefallen.* Sie heißt **nicht**, dass die Erklärung stimmt —
siehe §4.

---

## 2. Worin beide übereinstimmen (hohe Zuversicht)

Neun Befunde stehen in beiden Läufen, meist in mehreren Bündeln.

| # | Befund | ox-alpha | gpt-5.6-sol | Code geprüft |
|---|---|---|---|---|
| A | **Entscheidungs-Modal: Option C nicht erreichbar** | Rang 1 | office · panels-1 · panels-2 · broadcast | ✅ bestätigt, **Ursache anders** (§4.1) |
| B | **Beschnitt an Viewport-Kanten** (HUD, TV-Rahmen, Kachelreihen) | Rang 3 | building · daynight · panels · ending-2/-3 | ⚠️ teils nicht reproduzierbar (§5) |
| C | **Rot-Regel §4.7 verletzt** (vollrote Knöpfe) | Rang 2 | intro · ending-3 · ending-4 | ✅ 4 Verstöße, exakt benannt |
| D | **Datengrafiken codieren keine Daten** | Rang 8 | daycycle · ending-2 | ✅ **echter Programmfehler** (§4.4) |
| E | **Tageslauf widerspricht sich** (Sonnenuntergang zu früh, Vormittag wie Nacht) | Rang 4 | daynight · building | ✅ bestätigt, 3 Ursachen |
| F | **Kein Auswahl-/Vergleichsraster in den Optionskarten** | Rang 6 | office · broadcast · panels-2 | ✅ bestätigt (§4.3) |
| G | **Avatar und aktuelles Stockwerk nicht erkennbar** | Rang 7 | building · intro | ✅ Code hat keine Avatar-Marke |
| H | **Zustände (Hover/Fokus/Auswahl) nirgends sichtbar** | „alle acht Bündel" | „alle Screenshots" | ❌ **teilweise falsch** (§4.2) |
| I | **Die Ernte selbst ist defekt** | Rang 10 | building · panels-1 · ending-1/-4 · daycycle | ✅ nachgezählt (§4.5) |

Zwei davon — **A** und **H** — sind die lehrreichsten: Bei beiden sind sich die Modelle
einig, und bei beiden liegt die *Erklärung* daneben.

---

## 3. Wo die Modelle etwas Eigenes sehen

**Nur `gpt-5.6-sol`:**

1. **Schriftgrößen sind durchgehend eine Stufe zu klein.** Kommt in vier Bündeln vor
   (`ending-1`, `ending-2`, `ending-4`, `panels-2`), immer mit derselben Zahl:
   Haupttexte +20–30 %, Kennzahlen +40–50 %. ox-alpha erwähnt Typografie fast nie.
2. **Material statt Farbe.** Wo ox-alpha „Token vereinheitlichen" sagt, sagt
   `gpt-5.6-sol` „schwarze Bedienkarte → deckende Manila-Fläche, Schwarz nur für
   echte Monitorbilder" (`rooms`, `building`, `dialog`). Das ist konkreter und
   näher am Stil-Anker.
3. **Fokus-Scrim im Dialogzustand.** Beide Dialog-Durchgänge nennen es als Maßnahme 1:
   Raum und HUD abdunkeln, damit Porträt und Text vorn stehen.
4. **Maßangaben statt Adjektive.** „Dialog von 45 % auf 56–60 % der Bildschirmbreite" —
   nachgerechnet: `DecisionBeatModal.tsx:69` setzt `max-w-xl` = 576 px, bei 1280 px
   Aufnahmebreite sind das **45,0 %**. Das Modell hat den Wert aus dem Bild korrekt
   abgelesen.

**Nur `ox-alpha`:**

1. **Bewegung.** Es hat die fünf Clip-Bündel gelesen — Laufzyklus, Türanimationen,
   Tag/Nacht-Sweep, Sendungsband. `gpt-5.6-sol` konnte das nicht (kein Video-Eingang).
   Das bleibt der einzige Bereich, für den es nur eine Meinung gibt.
2. **Widerspruchsliste über Bündelgrenzen hinweg** (§3 der Synthese) — vier Modal-
   Umgebungen mit vier Verdunkelungen, zwei CTA-Systeme, drei Fremd-Farbregister.
   Das kann `gpt-5.6-sol` strukturell nicht leisten, weil ihm die Synthese fehlt.

**Echter Widerspruch — genau einer:**

> **Abdunklung.** `gpt-5.6-sol` fordert im `dialog`-Bündel *mehr* Abdunklung
> („Raum und HUD abdunkeln") und im `broadcast`- und `office`-Bündel *weniger*
> („Abdunklung sichtbar abschwächen").

Der Widerspruch löst sich auf, sobald man die Bildschirme trennt: Im Dialog ist der
Raum **Kulisse** und darf zurücktreten. Bei `broadcast` ist die Sendung **der Inhalt,
über den entschieden wird** — sie wegzudunkeln nimmt der Entscheidung ihre Grundlage.
Die Regel, die daraus folgt: *Verdunkelt wird, was nicht zur Entscheidung gehört —
nicht alles, was hinter dem Modal liegt.*

---

## 4. Was der Code dazu sagt

Geprüft mit `file:line`. Die Vorrunde steht in
[`2026-08-21_VERIFIKATION.md`](2026-08-21_VERIFIKATION.md) (3 von 3 Beobachtungen
richtig, 2 von 3 Diagnosen falsch). Diese Runde bestätigt das Muster.

### 4.1 Befund A — beide Modelle, dieselbe falsche Diagnose

Beide schreiben, die **Fußleiste überdecke Option C**. Beide schlagen vor, sie aus dem
Kartenfluss zu nehmen. Das ist sie bereits:

- `DecisionBeatModal.tsx:172-179` — Fußzeile, `shrink-0`, außerhalb des Scrollbereichs
- `DecisionBeatModal.tsx:130` — Optionsteil, `flex-1 min-h-0 overflow-y-auto`
- `DecisionBeatModal.tsx:67-68` — Kommentar „B24": genau dieser Fehler wurde bereits behoben

Die vorgeschlagene Reparatur hätte in **beiden** Fällen nichts bewirkt.

Die tatsächlichen Ursachen sind drei andere:

| | Stelle | Problem |
|---|---|---|
| 1 | `DecisionBeatModal.tsx:69` `max-h-[100vh]` | Das Modal berührt Ober- und Unterkante. Ohne Rand liest sich die Kappung als Fehler, nicht als Scrollbereich. |
| 2 | `DecisionBeatModal.tsx:69` `max-w-xl` | 576 px = 45 % der Breite. Die Karten werden dadurch **hoch** statt breit — genau das drückt Option C hinaus. |
| 3 | keine Scroll-Affordanz | Kein Verlauf, kein Marker, kein Zähler. |

**Und das Beste daran:** Punkt 3 ist im Repo bereits gelöst. `DialogBox.tsx:441-456`
trägt einen fertigen, stilkonformen „▼ MEHR"-Marker (kein Verlauf, kein Blinken,
`pointer-events-none`), gesteuert über `updateChoicesScrollHint`. Er muss nur
portiert werden.

### 4.2 Befund H — „keine Zustände" ist zur Hälfte falsch

- **Fokus: falsch.** `index.css:172-177` setzt global `button:focus-visible` mit
  2 px amberfarbener Kante — für **alle ~100 Knöpfe** des Story-Mode, und
  regelkonform ohne blauen Web-Ring (§4.6).
- **Hover: überwiegend richtig.** `onMouseEnter` gibt es in 7 Dateien, `:hover`-CSS
  in keiner; Tailwind-`hover:` nur punktuell.
- **Warum beide es trotzdem sagen:** `scripts/visual-review/harvest.mjs` bewegt nie
  die Maus und setzt nie den Tastaturfokus. **Kein Zustand kann auf einem Screenshot
  jemals erscheinen.** Beide Modelle urteilen hier über eine Lücke der Ernte.

Ein Beispiel dafür, wie das nach hinten losgeht: `gpt-5.6-sol` schreibt zum gelben
Schild „Finanzen / Tresor · Igor", es solle „in den inaktiven Zustand zurückgesetzt"
werden. Laut `BuildingStage.tsx:743-744` wird das Schild amber, wenn
`hovered || isTarget` — es ist also **das aktuelle Navigationsziel** und völlig korrekt
hervorgehoben. Der echte Befund liegt daneben: **Hover und Ziel teilen sich exakt eine
Farbe** (`WORLD_AMBER`), ohne zweites Merkmal. Zwei Zustände, ein Bild.

### 4.3 Befund F — bestätigt, mit einem Zusatz, den beide übersehen haben

`DecisionBeatModal.tsx:47-59` — `KostenChips` baut eine **variable Liste**: nur
vorhandene Kostenarten erscheinen, rechtsbündig nebeneinander. Option A („+15 % Risiko")
und Option B („+15 % Risiko · −40K · −2 Moral") haben unterschiedlich viele Chips —
derselbe Wert steht je Zeile an anderer Stelle. Ein Spaltenvergleich ist unmöglich,
obwohl er die Kernentscheidung des Spiels ist.

Zusatz: **alle** Chips tragen `StoryModeColors.danger`. `gpt-5.6-sol` hat das im
`office`-Bündel unabhängig bemerkt („Risiko und Aufmerksamkeit sehen semantisch gleich
aus") — die Farbe kodiert nichts und verbraucht Rot für eine neutrale Kennzahl.

### 4.4 Befund D — der einzige echte Programmfehler der ganzen Runde

Beide Modelle sagen sinngemäß „die Milieubalken unterscheiden nichts". Der Grund ist
ein **Skalenfehler**:

```
data/audience.json:28-35   belief ist ein Anteil 0..1   (0.15 … 0.50)

BroadcastBar.tsx:370   width: `${Math.round(seg.belief * 100)}%`     ← richtig
DayReport.tsx:194      width: `${Math.max(0, Math.min(100, seg.belief))}%`   ← falsch
```

Ohne `* 100` ergeben sich Balkenbreiten von **0,15 % bis 0,50 %** — auf einer 200 px
breiten Spalte sind das 0,3 bis 1,0 Pixel. Für das Auge: acht identische leere Zeilen.

Die Herkunft ist sichtbar: direkt darunter steht in `DayReport.tsx:120/275` dasselbe
Clamp-Muster für `trustProgress`, und das ist laut `DayReport.tsx:28` echt 0–100. Das
Muster wurde auf die falsche Skala kopiert. Beide Werte stammen aus derselben Quelle
(`audience.country.segments`), an der Skala gibt es nichts zu deuten.

**Ein `* 100` repariert die zentrale Datengrafik des Tagesberichts.**

### 4.5 Befund I — die Ernte, nachgezählt

92 Screenshots, davon **8 Dublettengruppen über 21 Dateien** — es sind nur 8
verschiedene Bilder. 13 Dateien sind Ballast, 14 % der Ernte.

Schwerer wiegt, *welche*:

```
end_timeout_wahlabend_s3.png  ==  end_timeout_gameend.png  ==  end_timeout_endreport_top.png
end_immune_wahlabend_s3.png   ==  end_immune_gameend.png   ==  end_immune_endreport_top.png
end_victory_wahlabend_s3.png  ==  end_victory_gameend.png  ==  end_victory_endreport_top.png
```

Drei **verschiedene** Bildschirme wurden je dreimal als dasselbe Bild aufgenommen. Der
Abschluss-Bildwechsel (s3) ist nie erfasst worden. `gpt-5.6-sol` hat genau das im
Bündel `ending-4von4` als Hauptbefund gemeldet („die s3-Screens zeigen den angekündigten
Bildwechsel überhaupt nicht") — **das Modell hatte recht, und die Ursache liegt im
Erntewerkzeug, nicht im Spiel.** Dasselbe Muster noch einmal: `end_*_endreport_mid.png` und `end_*_endreport_bottom.png`
sind in allen drei Enden **paarweise identisch** — `harvest.mjs` scrollt nicht, also
zeigen „Mitte" und „Ende" des Berichts denselben Ausschnitt.

### 4.6 Ein Befund, den erst der Vergleich sichtbar macht

ox-alpha schreibt in der Widerspruchsliste, die Modal-Verdunklung schwanke über
„vier Umgebungen, null Token". Nachgezählt sind es **sieben verschiedene Werte** in
14 handgebauten Vollbild-Overlays:

| Wert | Komponenten |
|---|---|
| 0,75 | `TutorialOverlay` |
| 0,82 | `NarrativeBoard` |
| 0,85 | `EventsPanel` · `MissionPanel` · `NewsPanel` · `NpcPanel` · `StatsPanel` |
| 0,90 | `ConsequenceModal` · `DecisionBeatModal` |
| 0,92 | `StageCountermeasureModal` |
| 0,95 | `BetrayalEventModal` · `CrisisModal` |
| `#0a0a0aF2` | `DayReport` (≈0,95 — und nicht einmal reines Schwarz) |

Die gemeinsame Komponente existiert längst: `PixelModal.tsx:51,81` mit
`backdrop = 0.85`. Sie wird 8× benutzt und 14× umgangen.

---

## 5. Was nicht bestätigt werden konnte

- **„PUBLIKUM-Knopf abgeschnitten"** (beide Modelle, mehrere Bündel).
  `BroadcastBar.tsx:161-164` gibt dem Knopf `flexShrink: 0` hinter einer
  ellipsierenden Schlagzeile — im Code kann er nicht gekappt werden. Entweder liegt
  die Leiste in einem engeren Container, oder die Aufnahme zeigt einen anderen
  Zustand. **Braucht einen gezielten Screenshot, keine Vermutung.**
- **Schriftgrößen** (nur `gpt-5.6-sol`). Eine Gestaltungsfrage, keine Code-Aussage —
  am Bild zu entscheiden, nicht am Repository. Steht deshalb in Stufe 4, nicht früher.
- **Alles aus den Clip-Bündeln.** Nur ox-alpha hat sie gesehen; es gibt keine
  Gegenprüfung. `gpt-5.6-sol` kann sie nicht lesen — der Weg dorthin ist
  `node src/cli.mjs frames` (Schlüsselbilder als Standbilder).

---

## 6. Der Plan

Sortiert nach **Wirkung je Aufwand**. Jede Stufe ist für sich lieferbar.

### Stufe 0 · Erst die Ernte reparieren — sonst arbeitet man an Duplikaten

Beide Modelle melden das unabhängig, und §4.5 belegt es. Solange 14 % der Bilder
Dubletten sind und drei Endbildschirme nie aufgenommen wurden, ist jede weitere
Designrunde teilweise blind.

- `harvest.mjs`: **scrollen**, bevor `*_mid` / `*_bottom` aufgenommen wird
- den Wahlabend-Schritt s3 tatsächlich erreichen, statt den Vorzustand dreimal zu speichern
- je ein **Hover-** und ein **Tastaturfokus-Bild** pro Interaktionsmuster — ohne sie
  bleibt Befund H für immer unentscheidbar (§4.2)
- eine **zweite Auflösung** (beide Modelle fordern sie; alles bisher ist 1280 × 720)
- `poster_detail.png` und `ambient_bubble.png` zeigen den Lagebericht statt des
  angekündigten Motivs — Routing prüfen

*Aufwand: klein, rein im Werkzeug. Wirkung: macht ein Drittel der offenen Befunde
überhaupt erst prüfbar.*

### Stufe 1 · Eine Komponente, fünf Bildschirme: `DecisionBeatModal`

Der meistgenannte Befund beider Läufe, und die Reparatur ist kleiner als beide dachten.

1. `DecisionBeatModal.tsx:69` — `max-w-xl` → **`max-w-3xl`** (768 px = 60 %; genau die
   Spanne, die `gpt-5.6-sol` unabhängig ausgerechnet hat). Karten werden breiter und
   damit niedriger — das allein holt Option C in den sichtbaren Bereich.
2. `DecisionBeatModal.tsx:69` — `max-h-[100vh]` → **`max-h-[88vh]`**. Das Modal bekommt
   Rand, die Kappung wird als Scrollbereich lesbar.
3. **„▼ MEHR" portieren** aus `DialogBox.tsx:441-456`. Vorhandenes Hausmuster,
   kein Neubau, kein Stilrisiko.
4. `KostenChips` (`DecisionBeatModal.tsx:47-59`) → **feste Spalten**
   (Risiko · Aufmerksamkeit · Budget · Moral), leere Zellen als „—",
   und **Rot nur für Risiko** — Aufmerksamkeit in Tinte.

*Nicht tun:* die Fußzeile umbauen. Beide Modelle schlagen es vor, beide irren (§4.1).

*Aufwand: klein (eine Datei, ein Muster kopieren). Wirkung: betrifft `office`,
`broadcast`, `panels-1`, `panels-2`, `daycycle` — den Kernloop des Spiels.*

### Stufe 2 · Zwei Zeilen mit großer Wirkung

- `DayReport.tsx:194` — `* 100` ergänzen. **Repariert die Milieu-Balken** (§4.4).
  Das ist ein echter Fehler, kein Geschmack.
- `skyTime.ts:77` — `dusk`-Rampe von `0.5` auf ~`0.75`. Dämmerung ab ~15:45 statt
  13:30. Beide Modelle nennen den zu frühen Sonnenuntergang.

*Aufwand: minimal. Wirkung: Tagesbericht und Tageslauf hören auf, sich selbst zu
widersprechen.*

### Stufe 3 · Drei mechanische Durchläufe

Reine Stil-/Klassenwechsel, keine Logik, gut testbar:

- **Rot → Stempel** (§4.7 des eigenen Themes): `ActionFeedbackDialog.tsx:240` ·
  `ActionFeedbackDialog.tsx:548` · `AdvisorDetailModal.tsx:90` ·
  `PlayerOfficeView.tsx:541` auf `stampCtaStyle` umstellen. Fünf Stellen machen es
  bereits richtig — die Vorlage ist da.
- **Ein Verdunkelungswert**: die 14 handgebauten Overlays auf `PixelModal` bzw. ein
  Token ziehen (§4.6). Dabei die Regel aus §3 anwenden: verdunkelt wird, was **nicht**
  zur Entscheidung gehört — bei `broadcast` also die Sendung *nicht*.
- **Zeilenbreite im Dialog**: `DialogBox.tsx:269-277` hat kein `max-w-*`. Bei 1600 px
  läuft eine Monospace-Zeile über >140 Zeichen. Die „tote Fläche", die ox-alpha
  im `dialog`-Bündel meldet, ist **horizontal** und mit einer Klasse behoben
  (`max-w-[70ch]` + zentrieren). Die Höhe ist bereits gekoppelt
  (`DialogBox.tsx:356` `min-h-[80px]`) — dort ist nichts zu tun.

*Aufwand: klein bis mittel, gut parallelisierbar. Wirkung: nimmt der Oberfläche
flächendeckend den „unfertig"-Eindruck.*

### Stufe 4 · Assets und Bildsprache

Hier braucht es Zeichnung, nicht Code:

1. **Tages-Skyline.** `public/assets/images/bld_city_far.png` ist selbst ein Nachtbild
   (dunkle Häuser, hunderte erleuchtete Fenster) und liegt als *Basis* unter allen
   Tageszeiten. Solange das so ist, sieht der Vormittag nach Nacht aus, egal was der
   Verlauf macht. `_dusk` und `_night` existieren bereits — es fehlt genau die eine
   Variante, die „Tag" heißt. **Das ist die Wurzel von Befund E.**
2. **Avatar-Bodenmarke.** Ein 16-px-Asset löst laut beiden Modellen die Frage
   „wo bin ich" auf mindestens acht Bildschirmen. Dazu: Hover und Ziel dürfen sich
   nicht länger eine Farbe teilen (§4.2).
3. **Papierregister statt schwarzer Schilder** (`gpt-5.6-sol`, `building`/`rooms`/`dialog`).
   Konsequenteste Einzelidee der ganzen Runde: Schwarz nur noch dort, wo wirklich ein
   Monitor leuchtet; Bedienflächen in Manila. Verbindet Betonwelt und Papier-Token.
4. **Schriftstufe.** Erst nach Stufe 0 entscheiden, mit einer zweiten Auflösung
   nebeneinander — sonst optimiert man auf 1280 × 720 hin.

### Stufe 5 · Erst nach neuer Ernte

Tote Flächen, Zustandsdesign, Wahlabend-Sequenzraster, Datengrafiken jenseits von
§4.4. Alles davon steht in beiden Läufen, aber auf Bildern, die entweder Dubletten
sind oder den falschen Zustand zeigen. Diese Arbeit lohnt erst, wenn Stufe 0 steht.

---

## 7. Was diese zweite Runde über die Methode sagt

Die erste Runde ergab: **Beobachtungen zuverlässig, Diagnosen nicht.** Die zweite
Runde verschärft das um eine Beobachtung, die man nur mit zwei Modellen machen kann:

> **Zwei unabhängige Modelle können sich auf dieselbe falsche Erklärung einigen.**
> Bei Befund A haben beide dieselbe Fußleisten-Theorie aufgestellt, und beide lagen
> falsch — die Fußleiste war schon repariert. Übereinstimmung erhöht das Vertrauen in
> die **Beobachtung**, nicht in die **Diagnose**.

Was der Vergleich dagegen wirklich bringt:

1. **Ein echter Programmfehler** (§4.4), gefunden, weil zwei Modelle unabhängig „die
   Balken unterscheiden nichts" sagten und das eine Nachrechnen wert war.
2. **Ein Befund, der erst durch Zählen entstand** (§4.6): sieben Verdunkelungswerte,
   wo ein Modell vier vermutete.
3. **Eine Korrektur an beiden Modellen** (§4.2): Der Fokus ist da, global und
   regelkonform — sie konnten ihn nur nicht sehen.
4. **Ein bestätigter Werkzeugfehler mit Folgen** (§4.5): drei nie aufgenommene
   Endbildschirme, von einem Modell korrekt als „der größte Bruch" gemeldet.

Der teuerste Teil des Verfahrens ist nicht der Modellaufruf — der war einmal gratis
und einmal ein Guthaben. Der teuerste Teil ist das Nachprüfen. Er ist auch der einzige,
der aus Hypothesen einen Plan macht.

---

*Einzelberichte: [`docs/MODEL_REVIEWS/`](.) · Werkzeug: [`tools/model-review/README.md`](../../tools/model-review/README.md)*
