# ✅ Verifikation der drei Top-Befunde

**Datum:** 2026-08-21 · **Grundlage:** [`2026-08-21_ui-00-SYNTHESE_stealth-ox-alpha.md`](2026-08-21_ui-00-SYNTHESE_stealth-ox-alpha.md)
**Methode:** Jeder Befund am Code und am Screenshot nachgeprüft, mit `file:line`-Beleg.

> Die Fremdmodell-Berichte sind ausdrücklich **Hypothesen**. Dieses Dokument hält fest, was
> davon stimmt, was nicht, und wo die Diagnose danebenlag, obwohl die Beobachtung richtig war.
> **Ergebnis: 3 von 3 Beobachtungen zutreffend, 2 von 3 Diagnosen falsch.**

---

## 1. Entscheidungs-Modal — Beobachtung ✅ · Diagnose ❌

**Behauptung:** „Option C abgeschnitten; die Fußleiste liegt IM Kartenfluss statt darunter."

**Beobachtung stimmt.** In `runs/visual-review/latest/shots/decision_beat.png` bricht Option C
bündig an der Fußzeilenkante ab.

**Diagnose ist falsch.** Die Fußzeile ist korrekt gebaut — sie steht als Geschwister **außerhalb**
des scrollenden Bereichs, mit `shrink-0` und `border-t-4`:

- `DecisionBeatModal.tsx:172-179` — Footer, `shrink-0`
- `DecisionBeatModal.tsx:130` — Optionsteil, `flex-1 min-h-0 overflow-y-auto`
- `DecisionBeatModal.tsx:67-68` — Kommentar „B24": genau dieser Fall wurde schon einmal behoben
  („sonst wurde Option D unterhalb der Kante gekappt")

**Die echte Ursache** ist eine andere und liegt eine Ebene tiefer:

1. `DecisionBeatModal.tsx:69` setzt `max-h-[100vh]` — das Modal füllt die Fensterhöhe **ohne
   jeden Rand**. Im Screenshot berührt es Ober- und Unterkante.
2. Es gibt **keine Scroll-Affordanz**: kein Verlauf, kein Pfeil, keine sichtbare Leiste. Eine
   Karte, die bündig an einer Kante abbricht, liest sich als Fehler, nicht als Scrollbereich.

**Vorschlag:** `max-h-[100vh]` → `max-h-[88vh]` (Modal bekommt Luft, die Kappung wird als
Scrollbereich erkennbar) **plus** einen unteren Verlauf oder Zähler („3 Optionen"). Der vom
Modell vorgeschlagene Umbau der Fußzeile wäre wirkungslos gewesen.

---

## 2. Rot-Verstöße gegen §4.7 — vollständig ✅

**Behauptung:** „Zwei CTA-Systeme koexistieren: `stampCtaStyle` korrekt genutzt, daneben
vollrote Knöpfe."

**Stimmt, mit Zählung.** Die Regel steht im Code selbst — `theme.ts:67-70`:
*„Primär-Aktionen sind GESTEMPELT statt rot geflutet … Rot bleibt Stempel/Kopfband vorbehalten."*

**Korrekt (5×):** `AvatarChoice.tsx:115` · `DayReport.tsx:397` · `GameEndScreen.tsx:356` ·
`StoryHUD.tsx:459` · `StoryModeGame.tsx:199`

**Verstoß — vollrote `<button>` (4×):**

| Datei:Zeile | Knopf |
|---|---|
| `ActionFeedbackDialog.tsx:240` | Aktions-Rückmeldung |
| `ActionFeedbackDialog.tsx:548` | „VERSTANDEN" |
| `AdvisorDetailModal.tsx:90` | Berater-Detail |
| `PlayerOfficeView.tsx:541` | „FEIERABEND →" |

Alle vier setzen `backgroundColor: StoryModeColors.ministryRed` mit weißer Schrift.

**Nicht betroffen:** Kopfbänder (z. B. `DecisionBeatModal.tsx:73`) — die sind laut §4.7 genau
der erlaubte Rot-Ort. Der Befund gilt ausschließlich für Knöpfe.

**Vorschlag:** Die vier auf `stampCtaStyle` umstellen. Reiner Stilwechsel, keine Logik.

---

## 3. Tag/Nacht — Beobachtung ✅ · Ursache anders als vermutet

**Behauptung:** „Sterne bei Tag (11:30), Sonnenuntergang um 14:25, Nacht-Skyline bei 14:00."

### 3a) „Sonnenuntergang um 14:25" — bestätigt ✅

`skyTime.ts:77`:

```ts
const dusk = ramp(t, 0.5, 0.62) * (1 - ramp(t, 0.82, 0.9));
```

Die Uhr läuft 09:00–18:00, `t = minutes / 540`. Damit beginnt die Dämmerung bei `t=0.5` —
das ist **13:30** — und liegt um 14:25 bereits bei ~77 % Deckkraft. Für einen Arbeitstag, der
bis 18:00 läuft, setzt der Sonnenuntergang **viereinhalb Stunden zu früh** ein.

### 3b) „Nacht-Optik am Vormittag" — bestätigt ✅, aber zwei Ursachen

`shots/building_lobby_day.png` (Uhr: **11:00**) zeigt einen dunklen Himmel und eine Skyline
mit durchgehend erleuchteten Fenstern.

Laut `skyTime.ts:76-78` sind bei 11:00 (`t=0.22`) **beide** Overlays auf 0 — es ist also die
**Basis**-Skyline zu sehen. Und die ist selbst ein Nachtbild: `public/assets/images/bld_city_far.png`
zeigt dunkle Gebäude mit hunderten warm erleuchteten Fenstern. Die „Tag"-Variante ist keine.

Dazu kommt der Verlauf: Der hellste Stützpunkt `skyTime.ts:24` („Mittag, hell") ist
`top: [42,74,122]` — ein sattes Dunkelblau. Der Himmel wird nie richtig hell.

### 3c) „Sterne" — das sind keine Sterne ❌

Weder `bld_city_far.png` noch `bld_city_far_night.png` enthalten Sterne (beide geprüft), und es
gibt kein Stern-Asset und keinen Stern-Code. Die weißen Punkte kommen aus
**`BuildingStage.tsx:1020-1035` — `SeasonOverlay`, also fallendem Schnee** in Dezember/Januar/Februar:

```ts
'radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,0.85), transparent), …'
animation: 'bs-snow 9s linear infinite'
```

Auf einem Standbild vor dunklem Himmel sieht Schnee aus wie ein Sternenfeld — das Modell hat
sich hier geirrt, und beim ersten Hinsehen auch der Prüfer. Das ändert nichts am Befund
„Vormittag sieht aus wie Nacht", verschiebt aber die Reihenfolge der Reparatur.

**Vorschlag, nach Wirkung:**
1. Tages-Variante der Skyline erzeugen (unbeleuchtete oder nur vereinzelt beleuchtete Fenster) —
   das ist die eigentliche Wurzel und ein Asset-Auftrag, kein Code.
2. `dusk`-Rampe von `0.5` auf ca. `0.75` schieben (Dämmerung ab ~15:45 statt 13:30).
3. Mittags-Stützpunkt in `skyTime.ts:24` deutlich aufhellen.
4. Schnee ist **kein** Fehler — aber er sollte nicht die einzige Bewegung an einem hellen
   Vormittagshimmel sein.

---

## Nicht geprüft

- „Nacht-Skyline im Fenster bei 14:00" (`dialog_marina.png`) — anderer Renderpfad
  (Raum-Innenansicht), nicht Teil dieser Prüfung. Bei 14:00 liegt die Dämmerungs-Skyline
  laut 3a bereits bei ~46 %, ein Zusammenhang ist also plausibel, aber unbelegt.
- Alle übrigen Befunde der Synthese (fehlende Zustände, Datengrafiken, Beschnitt-Sweep,
  tote Fläche) — unverifiziert.

## Was diese Prüfung über die Methode sagt

Alle drei **Beobachtungen** stimmten; zwei von drei **Diagnosen** lagen daneben. Ein Modell,
das nur Bilder sieht, erkennt zuverlässig *dass* etwas nicht stimmt, rät aber beim *Warum*.
Genau deshalb tragen die Berichte den Hypothesen-Hinweis — und genau deshalb lohnt der
Prüfschritt: Bei Befund 1 hätte die vorgeschlagene Reparatur nichts bewirkt.
