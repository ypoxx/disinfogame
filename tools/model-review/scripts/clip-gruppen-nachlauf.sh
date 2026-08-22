#!/usr/bin/env bash
# Nachlauf: die fünf Animations-Gruppen des zweiten UX/UI-Durchgangs.
#
# Der Durchgang am 2026-08-22 (gpt-5.6-sol, OpenAI direkt) ist bei den
# Screenshot-Bündeln vollständig; die Clip-Gruppen fehlen, weil mittendrin das
# Guthaben ausging (HTTP 429 · credit_balance_exhausted). Dieses Skript holt
# genau sie nach — mit derselben Gruppierung und der WORTGLEICHEN Frage des
# ersten Laufs, damit der Vergleich gegen stealth/ox-alpha trägt.
#
# Voraussetzungen:
#   · OPENAI_API_KEY gesetzt, Guthaben vorhanden
#   · Einzelbilder gezogen:  node src/cli.mjs frames --anzahl 4
#
# Aufruf:  bash tools/model-review/scripts/clip-gruppen-nachlauf.sh

set -u
cd /home/user/disinfogame/tools/model-review
F=/home/user/disinfogame/desinformation-network/runs/visual-review/latest/frames/animation
# Wortgleich mit dem ersten Lauf (2026-08-21) — nur so ist der Vergleich sauber.
FRAGE='Das sind Einzelbilder aus Animations-Clips des Spiels — je Clip vier Zeitpunkte (Suffix __f1..__f4), gezogen vom Ende des Clips. Beurteile daran: Wo stehen bewegte Figuren und Objekte relativ zum Boden und zueinander — schweben oder versinken sie? Stimmen Maßstab und Perspektive über die Zeitpunkte hinweg? Verändert sich zwischen den Bildern etwas, das nicht stimmig ist (springende Position, wechselnde Größe, verschwindende Elemente)? WICHTIG: Du siehst Standbilder, keine Bewegung — benenne ausdrücklich, was du daraus NICHT beurteilen kannst.'
bilder () { for c in "$@"; do for i in 1 2 3 4; do printf -- "--bild %s/%s__f%s.png " "$F" "$c" "$i"; done; done; }
lauf () {
  name="$1"; shift
  echo "▶ $name"
  node src/cli.mjs review --lens ui --anbieter openai --model gpt-5.6-sol \
    --denk-aufwand high --max-tokens 16000 --name "$name" --frage "$FRAGE" $(bilder "$@") --live 2>&1 | tail -4
}
lauf clips-ambient1 clip_ambient_etage1 clip_ambient_etage2 clip_ambient_etage3
lauf clips-ambient2 clip_ambient_etage4 clip_ambient_keller clip_avatar_walk
lauf clips-bewegung2 clip_elevator clip_walkhome_dayreport
lauf clips-broadcast clip_broadcast
lauf clips-daynight_sweep clip_daynight_sweep
echo "ALLE CLIP-GRUPPEN FERTIG"
