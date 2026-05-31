// ===========================================
// EXPORT — assets.json + Dateien als ZIP
// ===========================================
// Erzeugt ein ZIP im Layout von public/assets/ (assets.json + images/…,
// sheets/…, sounds/…). Entpacken nach desinformation-network/public/assets/.

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
