// ===========================================
// EXPORT — assets.json + Dateien (ZIP ODER direkt in einen Ordner)
// ===========================================
// Zwei Wege:
//  1) buildExportZip(): universeller ZIP-Download (jeder Browser).
//  2) exportToDirectory(): schreibt via File System Access API DIREKT in einen
//     gewählten Ordner (z. B. desinformation-network/public/assets) — kein
//     Entpacken, kein Token. Nur in Chromium-Browsern (Chrome/Edge/Brave).
// Layout in beiden Fällen: assets.json + images/… , sheets/… , sounds/…

import JSZip from 'jszip';
import { buildManifest, filePathFor, type LibraryAsset } from './assets';

export async function buildExportZip(assets: LibraryAsset[]): Promise<Blob> {
  const chosen = assets.filter((a) => a.chosen);
  const zip = new JSZip();
  zip.file('assets.json', JSON.stringify(buildManifest(assets), null, 2));
  for (const asset of chosen) {
    zip.file(filePathFor(asset), asset.dataBase64, { base64: true });
  }
  return zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ----- Direkter Ordner-Export (File System Access API) -----

// Minimale Typen (showDirectoryPicker ist noch nicht in den Standard-DOM-Typen).
interface FsWritable {
  write(data: BufferSource | Blob | string): Promise<void>;
  close(): Promise<void>;
}
interface FsFileHandle {
  createWritable(): Promise<FsWritable>;
}
interface FsDirHandle {
  getDirectoryHandle(name: string, opts?: { create?: boolean }): Promise<FsDirHandle>;
  getFileHandle(name: string, opts?: { create?: boolean }): Promise<FsFileHandle>;
}
type DirectoryPicker = (opts?: { mode?: 'read' | 'readwrite' }) => Promise<FsDirHandle>;

function getDirectoryPicker(): DirectoryPicker | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { showDirectoryPicker?: DirectoryPicker }).showDirectoryPicker;
}

/** Unterstützt der Browser den direkten Ordner-Export? */
export function supportsDirectoryExport(): boolean {
  return Boolean(getDirectoryPicker());
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer as ArrayBuffer;
}

async function writeFile(dir: FsDirHandle, name: string, data: BufferSource | string): Promise<void> {
  const handle = await dir.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(data);
  await writable.close();
}

export interface DirectoryExportResult {
  files: number;
}

/**
 * Schreibt assets.json + alle gewählten Dateien direkt in einen vom Nutzer
 * gewählten Ordner. Wirft bei Abbruch/fehlender Unterstützung.
 */
export async function exportToDirectory(assets: LibraryAsset[]): Promise<DirectoryExportResult> {
  const picker = getDirectoryPicker();
  if (!picker) {
    throw new Error('Dieser Browser unterstützt den direkten Ordner-Export nicht (Chrome/Edge nutzen).');
  }
  const root = await picker({ mode: 'readwrite' });
  const chosen = assets.filter((a) => a.chosen);

  // assets.json (überschreibt eine vorhandene Datei in-place)
  await writeFile(root, 'assets.json', JSON.stringify(buildManifest(assets), null, 2));

  // Unterordner-Handles cachen (images/sheets/sounds)
  const dirCache = new Map<string, FsDirHandle>();
  for (const asset of chosen) {
    const path = filePathFor(asset); // "<folder>/<name.ext>"
    const slash = path.indexOf('/');
    const folder = path.slice(0, slash);
    const name = path.slice(slash + 1);
    let dir = dirCache.get(folder);
    if (!dir) {
      dir = await root.getDirectoryHandle(folder, { create: true });
      dirCache.set(folder, dir);
    }
    await writeFile(dir, name, base64ToArrayBuffer(asset.dataBase64));
  }

  return { files: chosen.length };
}
