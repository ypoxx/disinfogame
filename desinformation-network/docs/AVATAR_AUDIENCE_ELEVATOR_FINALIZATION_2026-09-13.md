# Avatar-, Publikums- und Fahrstuhl-Finalisierung (2026-09-13)

## Produktionsassets

Die neuen Rastergrafiken wurden mit dem eingebauten aktuellen Bildmodell
(`openai-gpt-image-2`) erzeugt und anschließend deterministisch zugeschnitten,
auf Produktionsmaße gebracht und vom Magenta-Chroma-Key freigestellt.

### Einheitliche Auswahlporträts

Finaler Produktionsprompt:

> Create one exact 3×2 contact sheet of six square, head-and-shoulders personnel-file portraits for a contemporary fictional European ministry/intelligence office. Top row: young brown-haired man, middle-aged dark-haired man, older silver-haired man. Bottom row: young brown-haired woman with tied-back hair, middle-aged woman with black bob, older woman with silver bob. Every cell uses exactly the same camera distance, eye line, head size, shoulders, neutral blue-grey concrete background, restrained charcoal suit, cool desaturated palette, clean high-detail modern pixel art, consistent lighting and no text, insignia, borders or national symbols. Faces must be clearly different people and ages. Exact equal 512×512 cells.

Quelle: eingebautes Bildmodell, Rohbild `exec-7ea520c2-32ef-49ed-b93a-58e3ca7f3d0a.png`.
Produktion: sechs Dateien `public/assets/images/portrait_player_{m1,m2,m3,f1,f2,f3}.png`, je 512×512.

### Sechs Profil-Gehzyklen

Finaler Produktionsprompt:

> Create one exact 8-column × 6-row pixel-art sprite atlas on a single flat #FF00FF background. Rows match the six personnel portraits in order m1, m2, m3, f1, f2, f3. Each row shows the same distinct person in a modern charcoal ministry suit carrying the same briefcase, strict side view facing right, across an eight-frame full walk cycle with visibly different heel-strike, weight, passing and toe-off poses. Identical scale, foot baseline, outfit, face, hair and lighting across every frame. No scenery, labels, grid lines, shadows or symbols. Fine modern 16-bit-inspired pixel art, not coarse retro blocks.

Quelle: eingebautes Bildmodell, Rohbild `exec-9a863116-37d1-4e9b-a7cb-8d7460deee0e.png`.
Produktion: `public/assets/sheets/player_profiles_walk.png`, 768×576, 8×6 Frames à 96×96.

### Sechs Profil-Idlezyklen

Finaler Produktionsprompt:

> Reformat the six matching ministry agents as one exact 4-column × 6-row sprite atlas on flat #FF00FF. One person per row in m1, m2, m3, f1, f2, f3 order; four full-body front-view idle frames per person: neutral, subtle breathing, brief natural blink, neutral. Keep the same identity, age, face, hair, charcoal suit, briefcase, scale and foot baseline within each row and across the atlas. No scenery, labels, grid lines, shadows or symbols. Fine modern pixel art suitable for transparent 96×96 production frames.

Quelle: eingebautes Bildmodell, Rohbild `exec-f63fa29a-fe47-4d22-a964-205d39c3324e.png`.
Produktion: `public/assets/sheets/player_profiles_idle.png`, 384×576, 4×6 Frames à 96×96.

### Acht Publikums-Mimikatlanten

Gemeinsamer Produktionsprompt (je Archetyp mit eigener Identitätsbeschreibung):

> Create one exact 4-column × 4-row sprite sheet of the same fully seated audience character on a perfectly uniform #FF00FF background. Columns are four subtle animation phases; rows are calm/attentive, uncertain/worried, angry and suspicious. Keep pelvis, knees and feet on identical anchors in all 16 cells. Use fine modern high-resolution pixel art for native 96×96 frames, readable natural facial acting, warm amber room rim light and restrained cool television fill. Natural human skin tones, no blue/grey monochrome treatment, no furniture, floor, shadow, UI, labels or scenery.

Archetypen: Aufstiegsorientierte mit weißem Blazer, bodenständiger Handwerker,
Netz-Bohemien mit Kopfhörern, vorsichtige Frau der verunsicherten Mitte,
frustrierter älterer Arbeiter, idealistische Community-Organisatorin,
Rentner mit Katze und Tablet sowie informierte ältere Zeitungsleserin.

Quellen (eingebautes Bildmodell):
`exec-51818db6-c9c2-4a0c-b55d-bf85c4d78b28.png`,
`exec-d6475290-5613-4cef-ad15-0050accdee3f.png`,
`exec-5f68fcd9-14f6-42f1-8937-8592826ea9bd.png`,
`exec-5e96f323-bdde-498b-a201-7e03b3e9b44b.png`,
`exec-4cee1b43-8b88-4bc8-9309-18f3a77be7be.png`,
`exec-8d13f80a-f361-4e55-811f-d91a37170b5e.png`,
`exec-819a2764-bfe9-4481-bdce-c5452459d3af.png` und
`exec-cfc83ddc-2c36-4609-9829-b88592dac749.png`.

Produktion: acht Dateien `public/assets/sheets/audience_*.png`, je 384×384,
4×4 Frames à 96×96. Die Freistellung erfolgt zellenweise, damit rote Kleidung
nicht entsättigt und keine Animationszeile in eine andere hineinblutet.

## Technische Einbindung

- Alle sechs Porträt-IDs wählen jetzt eine eigene, stabile Atlaszeile im Spiel.
- Geh- und Idle-Inhalte sind pro Frame auf 88 Pixel sichtbare Höhe normiert,
  horizontal zentriert und an der unteren Framekante ausgerichtet.
- Der Bühnen-Avatar ist 112 Weltpixel hoch und damit gleich groß wie das
  übrige Büropersonal; 96-Pixel-Quellen ersetzen die früheren 64-Pixel-Quellen.
- Alle acht Publikumssheets wurden als eine gemeinsame native 96-Pixel-Familie
  neu erzeugt. Vier Stimmungszeilen und je vier Phasen bleiben per Manifest
  zugeordnet; die Anzeige nutzt moderate Glättung ohne Skalierungsunschärfe.
- Die sichtbare Vierergruppe ist um 42 Pixel auf die tatsächliche Sofasitzfläche
  versetzt. Hüften liegen auf dem Polster, die vollständigen Unterschenkel fallen
  vor der Sofafront bis zur gemeinsamen Bodenlinie; eine breite Vordergrundmaske
  wurde nach der Browserprobe verworfen, weil sie die Beine physikalisch falsch
  verdeckt hätte.
- Etagen 2/3 besitzen eine um 16 Pixel tiefere Laufebene; Etage 4 verschiebt
  Türen und Laufebene gemeinsam um 18 Pixel.
- Während der rAF-gesteuerten Fahrstuhlfahrt ist die zusätzliche 90-ms-CSS-
  Kamerainterpolation deaktiviert. Die Ein-/Ausstiegsanimation verändert weder
  Maßstab noch Helligkeit der Figur.

## Fidelity-Ledger und Browserabnahme

| Referenzbefund | Umsetzung | Mess-/Sichtprüfung |
| --- | --- | --- |
| Figuren Etage 2/3 am hinteren Fußbodenrand | Laufebene +16 Stage-px | DOM: E3 608 statt 592, E2 856 statt 840; Screenshot geprüft |
| Türen und Figuren Etage 4 zu hoch | Tür- und Laufebene +18 Stage-px | DOM: beide 362 statt 344; Screenshot geprüft |
| Spieler größer und gröber als Personal | 112 Stage-px aus 96-px-Frames | Browser: Avatar und Personal je 56 Screen-px bei Bühnenmaßstab 0,5 |
| Auswahlbilder verzerrt/uneinheitlich | sechs neue 512×512-Porträts | Browser: sechs identische 140,66-px-Boxen, natürliche Quelle 512×512 |
| Auswahl nicht eindeutig im Lauf-Avatar | sechs Profilzeilen für Idle/Walk | Browserwahl `f2` ergibt `idle_f2` und `walk_f2` |
| Figuren wirken festgesetzt | frühere, schnellere echte Tür-zu-Tür-Routen | vier sichtbare Läufer änderten in 900 ms Position und Animationsframe |
| Publikum grob, stilistisch gemischt, teils blau/monochrom | acht neu erzeugte 384×384-Mimikatlanten mit 96-px-Frames und gemeinsamen Licht-/Proportionsregeln | Asset-Audit: 8×16 Frames, je 96×96; Kontaktbogen geprüft |
| Menschen nicht sauber auf dem Sofa | Gruppe +42 px auf die Sitzfläche, Füße auf gemeinsame vordere Bodenlinie, 1,08× Anzeige | Browser 1280×720 und 1600×900: alle Körper vollständig, keine Überlagerung/Kappung |
| Mimiken zu grob bzw. alte Sheets sichtbar | vier lesbare Emotionszeilen je Archetyp, alle acht IDs im Runtime-Fixture | Browser: beide Vierergruppen; nach 2,1 s wechselten 8/8 Figuren den Animationsframe |
| Avatar springt im Fahrstuhl | kein Scale-/Brightness-Keyframe | Browser: Sprite durch Eintritt, Fahrt und Austritt konstant 56×56 px |
| Doppeltes/unscharfes Gebäude in Fahrt | rAF-Kamera ohne nachlaufende CSS-Transition | Mittelphase: `transition:none`, exakt 1 Welt + 1 Kamera, gerastertes `-15,5px` bei DPR 2 |

Abnahmebilder liegen außerhalb des Repositorys unter `outputs/`:

- `avatar-choice-final.png`
- `building-floors-final.png`
- `audience-final.png`
- `audience-v3-primary-1600.png`
- `audience-v3-secondary-1600.png`
- `audience-v3-sprite-sheets.png`
- `elevator-mid-travel-final.png`

Agency-Signoff: Die Produktionsassets und ihre Renderer-Zuordnungen sind für
1280×720 und 1600×900 freigegeben. Die bestehende Wohnzimmergrafik wurde
bewusst beibehalten: Sie ist hochauflösend, warm beleuchtet und korrekt gesetzt;
die frühere Qualitätsabweichung entstand aus den alten 48-Pixel-Figuren und
deren Platzierung, nicht aus dem Hintergrund.
