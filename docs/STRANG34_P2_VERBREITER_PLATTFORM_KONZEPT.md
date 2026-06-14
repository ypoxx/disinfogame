# 🛰️ P2 — Kommunikations-Schlachtfeld: Verbreiter × Plattform (Konzept + Daten-Schema)

**Status:** Konzept zur Owner-Abnahme (Feinplan §10.1 verlangt Recherche VOR Bau).
**Datum:** 2026-06-14 · **Quellen-Recherche:** WebSearch (Exa host-geblockt; real-case-fundiert).
**Setzt auf:** P1 (Aktion aus Dialog, Roster „Rollen wie Stimme", 125 Aktionen).

> Ersetzt das simple „eigener Kanal vs. YouTuber" (D-3) durch **zwei Achsen**: **WER** trägt die
> Botschaft (Verbreiter/Asset) und **WO** sie landet (Plattform-Mix). Ein Verbreiter bespielt
> **mehrere** Plattformen gleichzeitig (Owner-Kernpunkt §10.1).

---

## 1. Reale Muster (Recherche-Fundament, fiktiv gerahmt)

Drei dokumentierte Fälle tragen das Modell — im Spiel **ohne echte Namen/Staaten** (G23):

- **Tenet Media (2024):** RT schleuste über Tarnfirmen **9,7 Mio. $** an eine US-Firma, die
  reichweitenstarke **Influencer** für Videos bezahlte (16 Mio. Views); die Creator gaben an,
  nichts von der Geldquelle gewusst zu haben. → Muster **„bezahlter Content-Creator"**: hohe
  Reichweite/Glaubwürdigkeit, teuer, **Enttarnung killt das Asset** (YouTube sperrte die Kanäle).
- **Voice of Europe (2024):** **eigenes Frontmedium** (Prag) + verdeckte **Zahlungen an
  Politiker** (Bar/Krypto) gegen pro-russische Linie vor der EU-Wahl; per EU-Sanktion abgeschaltet.
  → Muster **„Frontmedium + gekaufte Amtsträger"**: hohe Legitimität, **maximales Rechts-/
  Enttarnungs-Risiko**, abschaltbar.
- **Doppelgänger (seit 2022):** **geklonte Nachrichtenseiten** (~17 Medien imitiert, 50+ Domains),
  verbreitet über **Social-Media-Wegwerf-Accounts** (v. a. Facebook/X). → Muster **„Klon-Medien +
  Bot-Verstärkung"**: skalierbar/billig, niedrige Einzel-Glaubwürdigkeit, **hohe Entdeckung**.

Ergänzend (Prior-Wissen): **Sockpuppet-/Spamouflage-Netze** (Masse, billig, niedrige Credibility),
**Schein-Thinktanks/NGOs** (institutionelle Legitimität, langsam), **Rand-Akademiker/„Experten"**.

**Sources:** [DOJ/Tenet — CNN](https://www.cnn.com/2024/09/04/politics/doj-alleges-russia-funded-company-linked-social-media-stars/index.html) ·
[NPR — Tenet](https://www.npr.org/2024/09/05/nx-s1-5100829/russia-election-influencers-youtube) ·
[Voice of Europe — ASD/GMF](https://securingdemocracy.gmfus.org/incident/voice-of-europe-2024-russian-backed-media-outlet-bribes-european-politicians/) ·
[Doppelgänger — EU DisinfoLab](https://www.disinfo.eu/doppelganger/)

---

## 2. Achse A — Verbreiter / Asset (WER trägt die Botschaft)

Daten-getrieben (JSON wie die Milieus, D-2: erweiterbar). Ein Asset wird **auf-/ausgebaut**, wächst,
kann **auffliegen** (→ abgeschaltet, Reichweite weg, Risiko-Spike).

| Verbreiter (fiktiv) | Reichweite | Glaubwürdigkeit | Aufbau (Zeit/€) | Enttarnungs-Risiko | Milieu-Passung |
|---|---|---|---|---|---|
| Content-Creator/Influencer | hoch | hoch (bei Basis) | mittel/teuer | mittel-hoch | jung, milieu-spezifisch |
| Ex-Politiker/„Experte" | mittel | sehr hoch | langsam/teuer | sehr hoch (Recht) | bürgerlich, Mitte |
| Rand-Akademiker | niedrig-mittel | hoch (Schein) | mittel | mittel | bildungsnah |
| Schein-NGO / Pseudo-Thinktank | mittel | hoch (institutionell) | langsam | niedrig-mittel | Eliten/Medien |
| Eigenes Frontmedium (RT-Analog) | hoch | mittel | teuer/langsam | hoch (abschaltbar) | Stamm-Publikum |
| Klon-Medien (Doppelgänger) | mittel | niedrig (bei Prüfung) | billig/schnell | hoch | breit, flüchtig |
| Bot-/Sockpuppet-Netz | sehr hoch (Volumen) | sehr niedrig | billig | sehr hoch | keine (Rauschen) |
| Ideologisch Überzeugte / „Useful Idiots" | variabel | mittel (organisch) | gratis | niedrig (für uns) | ihr eigenes |

## 3. Achse B — Plattform / Oberfläche (WO es landet)

Je eigene Dynamik; ein Verbreiter wählt einen **Plattform-Mix** (mehrere gleichzeitig).

| Plattform (fiktiv) | Reichweite | Tempo/Verfall | Moderation/Faktencheck | Stärke |
|---|---|---|---|---|
| Kurzvideo (TikTok-artig) | sehr hoch, jung | sehr schnell | algorithmisch | Viralität, Emotion |
| Video (YouTube-artig) | hoch, breit | mittel | mittel | Tiefe, „Doku"-Schein |
| Text/Feed (X-artig) | hoch | schnell | Faktenchecker aktiv | Diskurs-Setzung |
| Messenger/geschl. Gruppen (Telegram-artig) | niedrig, loyal | langsam | kaum | Radikalisierung, schwer entdeckbar |
| Etablierte Medien (Gastbeitrag/gestützte Stimme) | mittel | langsam | hoch (Redaktion) | höchste Glaubwürdigkeit |

## 4. Trade-off-Modell (vier Stellgrößen je Kombination)
**Reichweite · Glaubwürdigkeit/Milieu-Passung · Aufbaukosten-/zeit · Enttarnungs-Risiko/Abschaltbarkeit.**
Wirkung = f(VerbreiterReichweite × PlattformReichweite × MilieuPassung) − Dämpfung(Faktencheck, Sättigung).
Enttarnung = g(VerbreiterRisiko + PlattformModeration + Kompromat-Heikelheit + kumuliertem Risiko).
Bei Enttarnung: Asset (teilweise) verbrannt, öffentlicher Rückschlag (Vertrauen der Gegenseite ↑).

## 5. Die Aktions-Kette (P2b)
```
Ziel wählen (fiktiver Roster)
  → Dossier anlegen (deckt Schwäche/Angriffsfläche auf)        [vorhanden: 1.4/9.11]
     → Kompromat beschaffen/bewerten (Heikelheit + Glaubwürdigkeit)
        → Verbreiter wählen (Asset; ggf. erst aufbauen)
           → Plattform-Mix wählen (1..n)
              → Ausspielen  → sichtbar (Broadcast) → ggf. Faktencheck/Abschaltung
```
Umsetzung als **pure, vitest-getestete Zustandsmaschine** (`battlefield/`), die aus
{Ziel, Kompromat, Verbreiter, Plattform-Mix, Spielstand} → {Wirkung, Risiko, Enttarnungs-Chance,
Broadcast-Item} berechnet. Engine-additiv über `params` an der Aktion (`target`, `carrier`,
`platforms[]`, `kompromat`) — rückwärtskompatibel (heute leer).

## 6. Daten-Schema (rückwärtskompatibel)
- **`targets.json`** (D-2, 6–8 fiktive Ziele, erweiterbar): `{id, name, role_de, milieu, fiktiv:true,
  vulnerabilities:[{id, label_de, heikelheit:0..1, glaubwuerdigkeit:0..1, beschafft:false}], standing:0..1}`.
- **`carriers.json`** (Achse A): `{id, label_de, reach:0..1, credibility:0..1, buildCost{budget,capacity,phases},
  exposure:0..1, milieus:[...], state:'verfügbar'|'aufbau'|'aktiv'|'verbrannt'}`.
- **`platforms.json`** (Achse B): `{id, label_de, reach:0..1, decay:0..1, moderation:0..1, milieus:[...]}`.
- **Aktion `params`** (additiv): `{ target?:id, carrier?:id, platforms?:id[], kompromat?:id }`.
- **Aktion `unlocksRoom`/`unlocksNpc`** (P3-Vorbereitung, optional).

## 7. Fiktions-/Inhalts-Regeln (G23/SYMBOLS_AUDIT)
Real **inspiriert**, keine echten Personen/Parteien/Staaten/Flaggen. Ziele sind Archetypen
(„populärer Oppositions-Influencer", „integre Faktencheckerin", „wankelmütiger Hinterbänkler").
Bildungszweck: Muster sichtbar machen (End-Report benennt die reale Methode hinter der Mechanik).

## 8. Offene Owner-Abnahme für den P2-Bau
- **D-2 Ziel-Roster:** 6–8 Archetypen ok? (Vorschlag-Liste folgt als `targets.json`-Entwurf.)
- **Achsen-Umfang Start:** 8 Verbreiter × 5 Plattformen wie oben — oder schlanker beginnen (z. B. 5×4)?
- **Kompromat-Heikelheit ↔ moralische Last:** Kopplung an `moral_weight` + Enden — Stärke?
- **Reihenfolge:** erst Zustandsmaschine + Daten + Tests (unsichtbar), dann UI (Schlachtfeld-Ansicht)?
  Empfehlung: **ja** (vitest-first, dann diegetische Oberfläche).

## 9. Bau-Plan P2 (kleine grüne Schritte)
1. ✅ Daten: `targets.json` · `carriers.json` · `platforms.json` (fiktiver Roster: 6×8×5).
2. ✅ Engine: `battlefield/BattlefieldChain.ts` (pure) + `__tests__` (Wirkung/Risiko/Enttarnung deterministisch).
3. ✅ `params`-Durchstich (ids → Engine → Result → Broadcast/Nachricht): `OperationParams` +
   `resolveOperationParams`/`evaluateOperationParams`; `StoryEngineAdapter.playOperation` (eigener Pfad
   neben `executeAction`, moderater Risiko-/Aufmerksamkeits-Effekt). Aktion trägt `params` additiv/leer.
4. ⬜ Balancing-Sim erweitern (Pfad-Vielfalt §4: Thema×Verbreiter×Plattform×Ziel×Timing) + Verbreiter-
   Aufbau-/Budget-Ökonomie (§2 „aufbauen", state verfügbar/aufbau/aktiv/verbrannt) + Kompromat-Schritt (§5).
5. ✅ UI (Erststufe): `OperationsAkteView` — kompaktes diegetisches Aktendeckblatt (Ziel→Schwäche→
   Verbreiter→Plattform-Mix → Live-Wirkungs-Analyse → „Ausspielen"), erreichbar über die **Operations-
   zentrale** (Etage 4, NPC-loser Raum, wie Newsroom/Analyse). Folge: Kompromat-UI, reichere Broadcast-
   Themen aus dem Ziel-Milieu, optionales Akten-Raumbild (Asset).
