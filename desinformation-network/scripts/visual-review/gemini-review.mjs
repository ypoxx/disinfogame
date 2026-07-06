// Gemini-Vision-Review-Helfer: schickt Screenshots/Clips + Prompt an die
// Gemini-API (GEMINI_API_KEY aus der Umgebung) und druckt die Antwort.
// Genutzt als ZWEITMEINUNG im Visual-Review (Bilder) und als HAUPT-Prüfer
// für Video-Clips (Animationstiming) — siehe docs/VISUAL_REVIEW_*.
//
// Lauf: node scripts/visual-review/gemini-review.mjs --prompt-file p.txt \
//         [--model gemini-2.5-flash] file1.png file2.webm …
//       node scripts/visual-review/gemini-review.mjs --list-models
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY fehlt'); process.exit(1); }
const API = 'https://generativelanguage.googleapis.com/v1beta';

const argv = process.argv.slice(2);
const arg = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};
const files = argv.filter((a, i) => !a.startsWith('--') && (i === 0 || !argv[i - 1].startsWith('--') || ['--list-models', '--json'].includes(argv[i - 1])));

if (argv.includes('--list-models')) {
  const res = await fetch(`${API}/models?key=${KEY}&pageSize=100`);
  const data = await res.json();
  for (const m of data.models ?? []) {
    if ((m.supportedGenerationMethods ?? []).includes('generateContent')) console.log(m.name);
  }
  process.exit(0);
}

const MODEL = arg('model', process.env.GEMINI_VISION_MODEL || 'gemini-3.1-pro-preview');
const promptFile = arg('prompt-file', null);
const promptInline = arg('prompt', null);
const prompt = promptFile ? fs.readFileSync(promptFile, 'utf8') : (promptInline ?? 'Beschreibe die Auffälligkeiten.');

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webm': 'video/webm', '.mp4': 'video/mp4', '.gif': 'image/gif' };

const parts = [{ text: prompt }];
let totalBytes = 0;
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  const mime = MIME[ext];
  if (!mime) { console.error(`Übersprungen (unbekannter Typ): ${f}`); continue; }
  const buf = fs.readFileSync(f);
  totalBytes += buf.length;
  parts.push({ text: `\n[Datei: ${path.basename(f)}]` });
  parts.push({ inline_data: { mime_type: mime, data: buf.toString('base64') } });
}
if (totalBytes > 19 * 1024 * 1024) {
  console.error(`⚠️ Payload ${(totalBytes / 1e6).toFixed(1)} MB > ~19 MB Inline-Limit — weniger/kleinere Dateien übergeben.`);
  process.exit(1);
}

const body = {
  contents: [{ role: 'user', parts }],
  // 16k: Denk-Modelle (gemini-3.x-pro) zählen ihre Thinking-Tokens mit —
  // 4096 schnitt Video-Reviews mitten in der Antwort ab (Etappe-3-Befund).
  generationConfig: { temperature: 0.2, maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || 16384) },
};

const res = await fetch(`${API}/models/${MODEL}:generateContent?key=${KEY}`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});
if (!res.ok) {
  console.error(`Gemini ${res.status}: ${(await res.text()).slice(0, 800)}`);
  process.exit(1);
}
const data = await res.json();
const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? '').join('');
console.log(text || JSON.stringify(data).slice(0, 1200));
