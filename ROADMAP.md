# 🗺️ Roadmap (kanonisch)

> **Status:** Aktiv · **Aktualisiert:** 2026-06-14 · **Scope:** Story Mode
> **Live-Bau-Stand (erledigt/offen/TODO) = [`docs/STATUS.md`](docs/STATUS.md)** — diese Roadmap gibt
> die Grobrichtung, STATUS die aktuelle Detail-Lage. Projektwahrheit: [`docs/VISION_LOCK.md`](docs/VISION_LOCK.md).
> Wie wir arbeiten: [`docs/SOUL.md`](docs/SOUL.md).

## Worauf wir hinarbeiten
**Story Mode im MadTV-/TVTower-Stil:** ein **mehrstöckiges Gebäude im Querschnitt**, klickbare Räume
(= NPCs/Funktionen), durch das **kleine Figuren laufen** — in kohärentem Pixel-Art-Look (Stil-Bibel v2),
gespeist aus einer **Grafik-/Sound-Pipeline**. Zielbild 0.9: durchspielbar, gewinn- UND verlierbar,
NPCs mit Situationsbewusstsein, Aktionen aus Dialogen, keine Entwurfs-Reste (SOUL §3.10).

Der frühere abstrakte **Pro Mode** ist eingefroren in `archive/pro-mode/`.

---

## Track A — Gebäude/Visuelle Verwandlung — ✅ Kern erreicht
Querschnitt-Gebäude (`BuildingView`/`BuildingStage`), klickbare Räume, **laufender Avatar**,
Grafik-Pipeline + datengetriebene Assets, Räume als Bilder, Tag/Nacht + Jahreszeiten — **steht**
(Strang 1 #77, Strang 2 #78). **Rest-Politur** läuft als **Visual-Backlog** (s. STATUS + neu
`docs/VISUAL_AUDIO_BACKLOG_2026-06-14.md`): Hintergrund/Skyline-Tageszeit, Büro-Hotspots „aus einem
Guss", Avatar-Auflösung, TV/Wohnzimmer/Broadcast, neue Panels aufs Asset-Niveau heben.

## Track B — Story-Tiefe & Spielgefühl *(laufend)*
Stand: Aktion-aus-Dialog, 125 Aktionen, NPC-Stimmen (Begrüßungen+Reaktionen), Balance gewinn-/
verlierbar (Strang 3+4 #79/#80). **P2 Kommunikations-Schlachtfeld** Erststufe gebaut (Operations-Akte
#81). **Als Nächstes (s. STATUS):** P2 abrunden (Verbreiter-Aufbau/Budget + Kompromat), **P3**
Gebäude-Wachstum (`unlocksRoom`/`unlocksNpc`) + 100–500-Pfade-Sim, **Topic-Texte in Stimme**.

## Track C — Atmosphäre & Feinheiten *(neu ausgeplant)*
**Strang 5** (Dummy-Figuren, Pförtner mit Stimmungs-Hinweisen, lebendige Flure, Tür-Animationen):
jetzt als Feinplan `docs/STRANG5_FEINPLAN_ATMOSPHAERE.md`. **Sound-Erweiterung** (adaptive Musik,
Ducking, Topic-Vertonung): Plan in `docs/VISUAL_AUDIO_BACKLOG_2026-06-14.md` §6.

## Track D — Engine-Hygiene *(sekundär, nur nach Bedarf)*
Große Dateien (`StoryEngineAdapter.ts`, `useStoryGameState.ts`, `DialogLoader.ts`) **nicht** als
Vorab-Umbau zerlegen — **gezielt**, wenn ein Feature es verlangt. `docs/story-mode/TECHNICAL_DEBT.md`
ist veraltet (Stand 2025-12) → Revalidierung offen. Build/Tests nach jedem Schnitt grün.

---

## Empfohlene nächste Schritte (konkret, s. STATUS für Details)
1. **P2 abrunden:** Verbreiter-Aufbau/Budget-Ökonomie + Kompromat-Schritt (pure Engine, vitest-first).
2. **Visual gratis-Politur:** Skyline/Himmel-Tageszeit + Büro-Hotspots + Broadcast-Leiste (Code, kein Asset-Spend).
3. **Topic-Texte in Stimme** (letzter Dialog-Block).

## Bewusst NICHT jetzt entschieden
- Umfang der Skyline-/Wohnzimmer-/Avatar-Neugenerierung (Asset-Budget — Owner-Ansage je Paket).
- Adaptive-Musik-Track-Menge; Avatar-Bindung an die Wahl (Porträt-only vs. m/w-Lauf-Variante).

