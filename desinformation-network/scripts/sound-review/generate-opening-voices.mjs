#!/usr/bin/env node
// ===========================================
// LUXUS-SOUND-REVIEW — Eröffnungs-Stimmen (Intro-Kurator + Vorstellungsrunde)
// ===========================================
// Erzeugt die vertonten Eröffnungszeilen via ElevenLabs, getrimmt + auf ~−16 LUFS
// normalisiert. Reproduzierbar (Owner-Abnahme aus der Audition 2026-07-06).
//
//   node scripts/sound-review/generate-opening-voices.mjs           # live erzeugen
//   node scripts/sound-review/generate-opening-voices.mjs --dry      # nur Plan zeigen
//
// Voraussetzung: ELEVENLABS_API_KEY + ffmpeg im PATH.
// WICHTIG: Die Bühnenanweisungen (*…*) werden identisch zur Engine
// (StoryEngineAdapter.stripStageDirections) entfernt, damit angezeigter Text und
// Tonspur der Erstbegegnung 1:1 übereinstimmen.

import { synthesizeSpeech } from '../../../tools/asset-pipeline/src/elevenlabs.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SOUNDS = path.resolve(here, '..', '..', 'public', 'assets', 'sounds');
const DIALOGUES = path.resolve(here, '..', '..', 'src', 'story-mode', 'data', 'dialogues.json');
const dry = process.argv.includes('--dry');

// Casting (stabil je Sprecher). Kurator Volkov = eigene, tiefe HQ-Stimme (nicht der Direktor-NPC).
const VOICES = {
  volkov: 'nPczCjzI2devNBz1zQrb',   // Brian — tief, resonant
  direktor: 'MHOybJN5BsVS5H8m3mru',
  marina: 'pFZP5JQG7iQjIQuC4Bku',
  alexei: 'bIHbv24MWmeRgasZH58o',
  katja: 'Xb7hH8MSUJpSbSDYk0k2',
  igor: 'wGD81UtSGECIRSWQjH8X',
};

// identisch zu StoryEngineAdapter.stripStageDirections
const strip = (t) => t.replace(/\*[^*]*\*/g, '').replace(/\s+/g, ' ').trim();

// Intro-Text EXAKT wie im Spiel (useStoryGameState, 40-Tage-Modell).
const INTRO = 'Willkommen, Direktor. Sie leiten ab heute die Abteilung für Sonderoperationen. '
  + 'Ihr Auftrag: die radikale Kraft über die Schwelle bringen — vor dem Wahltag in 40 Tagen. '
  + 'Das Vertrauen der Leute zu zersetzen, ist nur das Mittel. Die Zentrale misst Sie am Ergebnis.';

const firstMeeting = JSON.parse(fs.readFileSync(DIALOGUES, 'utf8')).special_dialogues.first_meeting;

const lines = [
  { id: 'voice_volkov_intro', voiceId: VOICES.volkov, text: INTRO },
  ...['direktor', 'marina', 'alexei', 'katja', 'igor'].map((npc) => ({
    id: `voice_${npc}_first`,
    voiceId: VOICES[npc],
    text: strip(firstMeeting[npc].text_de),
  })),
];

function polish(inFile, outFile) {
  const filter = 'silenceremove=start_periods=1:start_duration=0:start_threshold=-40dB:detection=peak,'
    + 'areverse,silenceremove=start_periods=1:start_duration=0:start_threshold=-40dB:detection=peak,areverse,'
    + 'loudnorm=I=-16:TP=-1.5:LRA=11';
  execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-y', '-i', inFile, '-af', filter,
    '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '128k', outFile], { stdio: 'ignore' });
}

for (const l of lines) {
  console.log(`${l.id}  ←  „${l.text.slice(0, 60)}${l.text.length > 60 ? '…' : ''}"`);
  if (dry) continue;
  const raw = path.join(SOUNDS, `${l.id}.raw.mp3`);
  const fin = path.join(SOUNDS, `${l.id}.mp3`);
  const { buffer } = await synthesizeSpeech({ text: l.text, voiceId: l.voiceId });
  fs.writeFileSync(raw, buffer);
  polish(raw, fin);
  fs.rmSync(raw, { force: true });
  console.log(`  ✔ ${(fs.statSync(fin).size / 1024).toFixed(0)} KB`);
}
console.log(dry ? '\nDRY — nichts erzeugt.' : `\nFertig: ${lines.length} Stimmen.`);
