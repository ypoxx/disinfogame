# 📋 MEMO 2026-07-06 — State of the Art (UI-Luxus-Paket, §3b a)

**Zweck:** Einmalige Recherche vor dem UI-Luxus-Paket (Owner-Auftrag Plan §3b a).
Drei Themen, drei Recherche-Agenten, hier das Destillat mit direkten Konsequenzen
für die Auflösungs-Etappe, L1/L2 und LB. Voll-Quellen am Ende je Abschnitt knapp.

---

## 1. Pixel-Perfect / Integer-Scaling (→ Auflösungs-Etappe, B1)

**Kernformel (Engine-Konsens Phaser/Godot/RetroArch):** in GERÄTE-Pixeln rechnen,
dann auf CSS zurückdividieren — so fällt der Faktor auch auf HiDPI/125-%-Windows
auf echte Pixel:

```js
const dpr = window.devicePixelRatio;
const k = Math.max(1, Math.floor(Math.min(w*dpr/LOGICAL_W, h*dpr/LOGICAL_H)));
const cssScale = k / dpr;   // physisch exakt ganzzahlig
```

- **Letterbox/Rand-Ausgleich:** Bühne in Container `display:grid; place-items:center`
  zentrieren; Offsets IMMER runden. Bei uns ist der „Balken" kein Schwarz, sondern
  Himmel/Stadt (Gebäude) bzw. Scrim/Rahmen (Nahsicht) — Rand-Ausgleich ist diegetisch.
- **Downscale-Fall (unsere Assets sind über-nativ):** unter 1× nur Stammbrüche
  (1/2, 1/3 …) zulassen — Nearest-Neighbor bei krummem Faktor erzeugt ungleich
  große Pixel (csswg #5837); ×0,544 ist genau dieser Fehler.
- **Subpixel:** Transforms nie krumm zusammensetzen (`translateX(-50%)` einer
  ungeraden Breite = Halbpixel!); EINE Transform-Ebene, keine verschachtelten
  Skalierungen; Kamera-Offsets so runden, dass `offset×scale ∈ ℤ`.
- **Mischbetrieb (Godot-„canvas_items"-Muster):** Welt-Ebene ganzzahlig skaliert +
  `pixelated`; TEXT-Ebene als Geschwister UNskaliert in nativer Auflösung darüber
  (Font-Rasterizer bleibt scharf). Sprechblasen/Labels gehören also AUS der
  skalierten Bühne heraus, Position via `uiX = worldX*scale + offX`.
- **Resize:** Stufensprung ist erwartetes Verhalten (floor + min 1); KEINE
  CSS-Transition auf Scale (Zwischenwerte = Blur); auf `resize` UND
  matchMedia-dpr-Wechsel (Browser-Zoom!) reagieren; `pixelated` reicht 2026
  (crisp-edges = Synonym, Präfixe unnötig).

Quellen: MDN Crisp-Pixel-Art / image-rendering · csswg-drafts#5837 · tanalin.com
integer-scaling · Phaser Scale/Zoom-Docs · PixiJS #4866 · Godot Multiple
Resolutions (integer stretch) · web.dev devicePixelContentBox.

## 2. Diegetische Papier-/Terminal-UI (→ L1 Material-Kit, L2 Terminal)

1. **Taktilität = Physik + Sound, nicht Textur:** Papers Please wirkt anfassbar
   durch Stempel-„Punch" + Papier-Foley (50–500 ms, ein Klang pro Aktion) — das
   Material-Kit braucht von Anfang an die L7-Klang-Haken mitgedacht.
2. **Stempel als permanente Zustandssprache** (Papers Please, Obra Dinn): Zustand
   = physische Spur auf dem Dokument, nie Blinken → bestätigt §4.7 wörtlich.
3. **Bekannte Metaphern ersetzen Tutorials** (Obra-Dinn-Logbuch): Mappen,
   Karteireiter, Lesezeichen sind selbsterklärend — Umkleiden spart Onboarding.
4. **Skeuomorphismus kippt bei WIEDERHOLUNG** (This is the Police „tedious",
   Suzerain „overwhelming"): hochfrequente Aktionen brauchen Klick-Shortcuts
   trotz diegetischer Optik (Popes Mobile-Lösung: modale Stempel-Ablage,
   Aktenklammer). → L2-Terminal: Karten-Klick bleibt 1-Klick, Drag nur optional.
5. **Fokus-Scrim:** Akte über ABGEDUNKELTER, aber erkennbarer Spielwelt öffnen
   (Papers-Please-Inspect) — deckt sich mit §4.7-Kontrast-Regel.
6. **CRT glaubwürdig ohne Lesbarkeitsverlust** (Duskers, Fallout-Mod-Lehre):
   Text als Vollton rendern; Scanlines/Flicker/Vignette als SEPARATEN,
   abschaltbaren Layer; Tastatur-/Relais-Sound trägt mehr als starke Filter.
7. **Korkwand + roter Faden als Zustands-UI** ist etabliert (Shadows of Doubt)
   — bestätigt L3-Konzept.
8. **Übergänge 200–400 ms, ease-out, MIT Geräusch** (NN/g + Obra-Dinn-Umblättern:
   aufwendig, aber schnell/unterbrechbar). Ohne Papiersound wirkt dieselbe
   Animation träge.

Quellen: dukope.com Devlogs (Papers Please mobile, Obra Dinn) · gamedeveloper.com
(Papers Please, Obra Dinn IGF) · colepowered.com (Shadows of Doubt Corkboards) ·
gameuidatabase.com · NN/g animation-duration · interfaceingame.com (Duskers).

## 3. Lebendige Ambient-NPCs in 2D-Gebäuden (→ LB „Lebendiges Gebäude")

1. **Echte Ziele statt Pendel-Loops** (Stardew-Schedules: Zeit→Ort→Ziel→Blick→
   Tätigkeit): Der NPC geht irgendwohin und TUT dort etwas.
2. **Deterministisch + gejittert schlägt stochastisch:** fester Plan, Start ±s
   Jitter; echter Zufall wirkt „lumpy"/kaputt.
3. **Globaler Tagesrhythmus als Makro-Puls** (ONI-Blöcke): wechseln alle Figuren
   synchron die Phase, „atmet" das Gebäude — mit sehr wenigen Figuren erzielbar.
4. **Erscheinen/Verschwinden NUR durch diegetische Portale** (Fallout-Shelter-Tür,
   MadTV-Fahrstuhl): nie im Sichtfeld aufploppen/einfaden → bestätigt §3b(c) exakt.
5. **Tür-Beat ~0,5–1 s:** Innehalten → Tür auf → eintreten → Tür zu; der Beat
   verkauft den Raum dahinter.
6. **Pausen am Ziel mit Kontext-Idles** (Aushang lesen, 2–4 s), nie identische
   synchrone Loops nebeneinander.
7. **Taktung:** zu jedem Zeitpunkt ~1 Figur sichtbar unterwegs; >30–60 s ohne
   Bewegung wirkt tot; Ereignisse staffeln, nicht bündeln.
8. **Tempi variieren** (±15–25 % je Figur, μ≈1,2 m/s) und **Schrittfrequenz ans
   Tempo koppeln** (Foot-Sliding) — `frameTimeMs`-Hook existiert bereits.
9. **Mikro-Reaktionen sind der billigste Multiplikator** (Two Point Hospital):
   Flip am Wendepunkt, kurzes Zögern bei Begegnung.
10. **DOM/CSS:** nur `transform`/`opacity` animieren; 10–30 Sprites unkritisch.
    Muster: zentraler rAF-Ticker (volle Kontrolle) ODER CSS-Transition je
    Wegsegment + `transitionend` (jank-robust) — beide valide; Kontrollbedarf
    entscheidet. → LB nutzt den vorhandenen Navigator-Tick.

Quellen: stardewvalleywiki Schedule_data · somasim.com Project-Highrise-Notes ·
ONI-Wiki Cycles · TwoPointHospital-Interview (thesixthaxis) · MDN/motion.dev
Animations-Performance · arxiv 1203.5267 (Gehtempo-Verteilung).

---

**Konsequenz-Kette:** Auflösungs-Etappe implementiert §1 wörtlich (zentraler
`pixelScale`-Helfer, Welt ganzzahlig, Text-Ebene entkoppelt) → L1 baut das
Material-Kit mit Stempel-Zustandssprache + Klang-Haken (§2) → LB baut
Navigator-Routen mit Tür-Beat und Schedule-Jitter (§3) → L2 baut das Terminal
mit Vollton-Text + separatem CRT-Layer + 1-Klick-Karten (§2.4/2.6).
