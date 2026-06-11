// ===========================================
// MANIFEST (assets.json) — Schema-Helfer, Merge, Validierung
// ===========================================
// Portierung der Export-Logik aus sprite-tool/src/lib/assets.ts, damit
// Studio-Exporte und Pipeline-Läufe dasselbe assets.json pflegen können.
// Merge = Upsert je (type, id): vorhandene Einträge anderer Herkunft bleiben.

import fs from 'node:fs';
import path from 'node:path';

export const ID_PATTERN = /^[a-z0-9_]+$/;

/** Zielordner je Typ (identisch zu folderForType im sprite-tool). */
export function folderForType(type) {
  switch (type) {
    case 'image':
      return 'images';
    case 'sheet':
      return 'sheets';
    case 'sfx':
    case 'voice':
    case 'music':
      return 'sounds';
    default:
      throw new Error(`Unbekannter Asset-Typ: ${type}`);
  }
}

export function extForType(type, mime) {
  const byMime = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
  };
  if (mime && byMime[mime]) return byMime[mime];
  return type === 'image' || type === 'sheet' ? 'png' : 'mp3';
}

export function filePathFor(asset) {
  return `${folderForType(asset.type)}/${asset.id}.${extForType(asset.type, asset.mime)}`;
}

/** Baut einen Manifest-Eintrag aus einem Shot + Erzeugungs-Metadaten. */
export function buildEntry(asset) {
  const entry = {
    id: asset.id,
    type: asset.type,
    file: asset.file || filePathFor(asset),
    chosen: true,
  };
  if (asset.provider) entry.provider = asset.provider;
  if (asset.prompt) entry.prompt = asset.prompt;
  if (asset.seed !== undefined) entry.seed = asset.seed;
  if (asset.styleVersion) entry.styleVersion = asset.styleVersion;
  if (asset.type === 'sheet') {
    if (asset.frameWidth !== undefined) entry.frameWidth = asset.frameWidth;
    if (asset.frameHeight !== undefined) entry.frameHeight = asset.frameHeight;
    if (asset.animations && Object.keys(asset.animations).length > 0) {
      entry.animations = asset.animations;
    }
  }
  if (asset.regions && asset.regions.length > 0) entry.regions = asset.regions;
  return entry;
}

export function readManifest(outDir) {
  const file = path.join(outDir, 'assets.json');
  if (!fs.existsSync(file)) return { assets: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return parsed && Array.isArray(parsed.assets) ? parsed : { assets: [] };
  } catch {
    return { assets: [] };
  }
}

/** Upsert je (type, id); Ergebnis stabil sortiert (saubere Git-Diffs). */
export function mergeManifest(manifest, entries) {
  const byKey = new Map(manifest.assets.map((a) => [`${a.type}/${a.id}`, a]));
  for (const entry of entries) {
    byKey.set(`${entry.type}/${entry.id}`, entry);
  }
  const assets = [...byKey.values()].sort((a, b) =>
    a.type === b.type ? a.id.localeCompare(b.id) : a.type.localeCompare(b.type)
  );
  return { assets };
}

export function writeManifest(outDir, manifest) {
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, 'assets.json');
  fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return file;
}

/**
 * Validierung wie validateForExport im sprite-tool + optionaler Datei-Check.
 * Liefert eine Liste von Fehlermeldungen (leer = ok).
 */
export function validateManifest(manifest, outDir = null) {
  const errors = [];
  const assets = manifest.assets ?? [];
  if (assets.length === 0) errors.push('Manifest enthält keine Assets.');

  const byTypeId = new Map();
  for (const a of assets) {
    if (!a.id || !a.id.trim()) {
      errors.push('Ein Asset hat keine id.');
      continue;
    }
    if (!ID_PATTERN.test(a.id)) {
      errors.push(`id „${a.id}" enthält ungültige Zeichen (erlaubt: a–z, 0–9, _).`);
    }
    if (!a.file || typeof a.file !== 'string') {
      errors.push(`Asset „${a.id}" hat keinen Dateipfad.`);
    }
    if (a.type === 'sheet' && (a.frameWidth === undefined || a.frameHeight === undefined)) {
      errors.push(`Sheet „${a.id}" hat keine Frame-Maße.`);
    }
    const key = `${a.type}/${a.id}`;
    byTypeId.set(key, (byTypeId.get(key) || 0) + 1);
    if (outDir && a.file && !fs.existsSync(path.join(outDir, a.file))) {
      errors.push(`Datei fehlt: ${a.file} (Asset „${a.id}").`);
    }
  }
  for (const [key, count] of byTypeId) {
    if (count > 1) errors.push(`„${key}" ist ${count}× vergeben (muss je Typ eindeutig sein).`);
  }
  return errors;
}

/** Schreibt eine Binärdatei eines Assets an seinen Manifest-Pfad. */
export function writeAssetFile(outDir, relFile, buffer) {
  const target = path.join(outDir, relFile);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buffer);
  return target;
}
