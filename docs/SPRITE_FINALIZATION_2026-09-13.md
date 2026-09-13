# Sprite-Finalisierung 2026-09-13

Diese Produktion ersetzt die bisherigen Platzhalter-/Zweibild-Sheets. Sie wurde
nach dem Update auf `762f9a4` an die neue `BuildingStage`-, `ambientLife`- und
`BroadcastBar`-Struktur angepasst.

## Abnahmeformat

| Gruppe | Dateien | Raster | Animationszeilen |
| --- | --- | --- | --- |
| Publikum | `audience_*.png` (8 Figuren) | 4 × 4, Zelle 48 × 48 px | ruhig, verunsichert, wütend, misstrauisch |
| Spielerfigur | `player_walk*.png` | 8 × 1, Zelle 64 × 64 px | vollständiger Gehzyklus |
| Statisten | `figure_*_walk.png` | 8 × 1, Zelle 48 × 96 px | vollständiger Gehzyklus |
| Nachrichten-TV | `hud_tv_news_scenes.png` | 4 × 1, Zelle 96 × 72 px | Presse, Infrastruktur, Straße, Netz |
| Gebäude-Etagen | `bld_floor_*.png` (6 Panoramen) | 1344 × 224 px | jede Ebene eigenes Raumgefühl |

Alle Figuren stehen mit ihrer Fuß-/Sitz-Basis auf der unteren Zellkante. Die
Publikumsidentität und Requisiten bleiben über alle Stimmungen erhalten. Kurze
Blinzel-/Reaktionsframes erhalten eigene Zeiten; ein deterministischer Offset
verhindert, dass das ganze Publikum synchron blinzelt.

## Finaler Prompt-Satz

Bildmodell: `openai-gpt-image-2`, jeweils mit dem bisherigen, freigestellten
Charakter-Sheet als visuelle Identitätsreferenz.

Publikum (für jeden der acht Archetypen):

> Produce one exact 4-column by 4-row pixel-art sprite sheet of this same seated
> character. Row 1 calm, row 2 uncertain, row 3 angry, row 4 suspicious. Four
> restrained loop frames per row: hold, blink/reaction, peak, settle. Lock the
> identity, face, outfit, colors, props, seated pose, scale and foot baseline in
> every cell. Convey emotion mainly through eyebrows, eyes and mouth; avoid broad
> body deformation. Flat uniform #FF00FF background, no furniture, scenery,
> labels or text. Crisp modern 16-bit/SNES-to-indie pixel art.

Spielerfigur, weibliche Variante:

> Produce one exact horizontal 8-frame walk-cycle sprite sheet of this same
> character. Include contact, recoil, passing and high-point poses for both legs;
> planted feet must not slide. Preserve the dark-red jacket, dark trousers, low
> shoes and the same briefcase in the same hand in every frame. Stable head and
> torso volume, consistent scale and ground baseline. Flat #FF00FF or transparent
> background, no scenery, labels or text. Crisp modern pixel art.

Spielerfigur, männliche Variante:

> Produce one exact horizontal 8-frame walk-cycle sprite sheet of this same male
> official. Include contact, recoil, passing and high-point poses for both legs;
> planted feet must not slide. Preserve the dark suit, red tie and the same
> briefcase in the same hand in every frame. Stable identity, scale and ground
> baseline. Flat #FF00FF or transparent background, no scenery, labels or text.
> Crisp modern pixel art.

Bote:

> Produce one exact horizontal 8-frame walk-cycle sprite sheet of this same clerk.
> Include contact, recoil, passing and high-point poses for both legs. The beige
> document folder remains tucked under the same arm and keeps its color and size
> in every frame. Stable identity, scale and ground baseline. Flat #FF00FF or
> transparent background, no scenery, labels or text. Crisp modern pixel art.

Reinigungskraft:

> Produce one exact horizontal 8-frame walk-cycle sprite sheet of this same
> cleaner. Include contact, recoil, passing and high-point poses for both legs.
> The cleaning cloth remains in the same hand in every frame. Stable identity,
> workwear, scale and ground baseline. Flat #FF00FF or transparent background, no
> scenery, labels or text. Crisp modern pixel art.

Nachrichtenmotive im linken Fernseher:

> Create a single horizontal pixel-art sprite sheet for the small picture area of
> a retro CRT news broadcast. Exactly four equal 4:3 panels in one row: an
> anonymous government press podium; an industrial infrastructure incident with
> water tower and pipes; a tense but nonviolent street crowd behind barriers; a
> digital misinformation network with phone, server racks and connected nodes.
> Contemporary restrained brutalism, cool desaturated greys, cyan monitor light
> and sparing dark-red accents. Crisp modern 16-bit pixel art, legible at 96 × 72
> px per panel. No presenter, flags, logos, emblems, captions or readable text.

Etagenpanoramen (ein Atlas, danach sechs exakte 1344 × 224-px-Zeilen):

> Create one square atlas divided into exactly six equal horizontal panoramic
> strips, edge-to-edge. Each strip is a strict straight-on side elevation of one
> ministry floor with a continuous level floor baseline and physically plausible
> lighting. In order: Special Operations with conduits, secure glass and cyan
> terminal glow; Analysis & Media with chart displays, notice boards and archive
> alcove; Field Operations with lockers, map case, equipment cage, bench and
> cases; Executive Headquarters with polished concrete, portraits, waiting chairs
> and warmer light; Ground-floor Lobby with reception desk, seating, plants,
> illuminated abstract artwork and glass revolving entrance; Basement with raw
> concrete, exposed pipes, secure storage and vault cues. Preserve clear wall
> zones for separate door sprites. Polished crisp 16-bit/32-bit pixel art, muted
> blue-grey concrete, charcoal, desaturated teal and restrained burgundy accents.
> No people, captions, UI, readable text, logos, isometric view, floating furniture
> or repeated copy-paste corridor pattern.

Kollisionskorrektur der Etagenpanoramen (Bildbearbeitung auf Basis des ersten
Atlas, weiterhin `openai-gpt-image-2`):

> Keep the exact six equal horizontal rows, camera, pixel-art style, lighting and
> floor baseline. Recompose only the architecture around the separately rendered
> game doors. Door bays per row: three on Special Operations, two on Analysis &
> Media, one on Field Operations, two on Headquarters, none in the Lobby and one
> in the Basement. Every bay must be a plain, dark, front-facing recess from wall
> to floor, with no monitor, poster, portrait, plant, chair, machine, cabinet,
> pipe, weapon or other prop crossing it. Leave additional empty wall/floor zones
> for clickable game props. Do not add doors, people, text, UI or duplicate props.

## Technische Finalisierung

Die Modellbilder wurden zellenweise getrennt, nur am zusammenhängenden
Chroma-/Hintergrund freigestellt, mit Nearest-Neighbour skaliert, unten zentriert
und in die oben genannten exakten Manifest-Raster gepackt. Türen verwenden eine
perspektivische Türblatt-Drehung; Fahrstuhltüren zwei gegenläufige Schiebepaneele.
Spieler und Statisten besitzen einen sichtbaren Tiefenschritt an der Schwelle.
Die Gebäudeübersicht verwendet nicht mehr das 16:9-Lobbybild bzw. gekachelte
Universalflure in einem 6:1-Ausschnitt. Jede Ebene besitzt nun ein für die echte
Bühnengeometrie komponiertes Panorama; die bisherigen Bilder bleiben nur als
Fallback für unvollständige Manifeste erhalten.

Die finale Kollisionsrunde koppelt die Türpositionen über `doorXFrac` explizit
an diese Buchten. Türblatt, Namensschild, Statuslicht, Klickfläche,
Navigationsziel und Ambient-Türverkehr beziehen dadurch dieselbe Koordinate.
Klickbare Deko wurde aus den Tür-Klickzonen versetzt; ein geometrischer Test
hält zusätzlich 36 Welt-px Sicherheitsraum für die sichtbare Requisite frei.

Etage 1 und Keller besitzen wegen ihrer tieferen perspektivischen Bodenflächen
eine eigene `doorFootOffsetY`-Korrektur (−10 bzw. −12 Welt-px). Die Türschwellen
liegen damit in der hinteren Wandebene; laufende und stehende Figuren sowie
Bodenrequisiten bleiben unverändert auf der vorderen Lauf-/Fußlinie. Türblatt,
Schild, Statuslicht und Klickfläche verwenden gemeinsam die korrigierte Linie.
