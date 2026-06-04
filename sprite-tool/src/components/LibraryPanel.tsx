'use client';

// ===========================================
// BIBLIOTHEK — kuratierte Assets verwalten + Export
// ===========================================
// Listet Assets aus IndexedDB; id/Typ bearbeiten, „fürs Spiel" markieren,
// löschen, exportieren (assets.json + ZIP, inkl. Sheet-/Regionen-Metadaten).
// Als Modal (onClose) ODER eingebettet (embedded) nutzbar.

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { listAssets, putAsset, deleteAsset } from '@/lib/library';
import { validateForExport, type LibraryAsset, type ManifestAssetType } from '@/lib/assets';
import { buildExportZip, downloadBlob, supportsDirectoryExport } from '@/lib/export';
import { buildBackup, restoreBackup, storageStatus, type StorageStatus } from '@/lib/studio/backup';
import { useStudio } from '@/lib/studio/StudioContext';

function fmtMB(bytes: number): string {
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

interface LibraryPanelProps {
  onClose?: () => void;
  embedded?: boolean;
}

const TYPES: ManifestAssetType[] = ['image', 'sheet', 'sfx', 'voice', 'music'];

export function LibraryPanel({ onClose, embedded = false }: LibraryPanelProps) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dirExporting, setDirExporting] = useState(false);
  const [dirMsg, setDirMsg] = useState<string | null>(null);
  // LibraryPanel mountet erst nach Tab-Klick (clientseitig) → window ist da, keine SSR-Diskrepanz.
  const canDirExport = supportsDirectoryExport();
  const { reload, exportDir, autoExport, lastExport, connectExportDir, disconnectExportDir, exportNow } = useStudio();
  const fileRef = useRef<HTMLInputElement>(null);
  const [storage, setStorage] = useState<StorageStatus | null>(null);
  const [backupMsg, setBackupMsg] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    storageStatus().then(setStorage);
  }, []);

  useEffect(() => {
    let active = true;
    listAssets()
      .then((a) => {
        if (active) {
          setAssets(a);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function update(updated: LibraryAsset) {
    setAssets((prev) => prev.map((a) => (a.key === updated.key ? updated : a)));
    void putAsset(updated);
  }

  function remove(key: string) {
    setAssets((prev) => prev.filter((a) => a.key !== key));
    void deleteAsset(key);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await buildExportZip(assets);
      downloadBlob(blob, 'assets-export.zip');
    } finally {
      setExporting(false);
    }
  }

  async function handleConnect() {
    setDirMsg(null);
    try {
      await connectExportDir();
      setDirMsg('✓ Spielordner verbunden — Auto-Export aktiv.');
      window.setTimeout(() => setDirMsg(null), 4000);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return; // Abbruch ist kein Fehler
      setDirMsg(e instanceof Error ? `⚠ ${e.message}` : '⚠ Verbinden fehlgeschlagen');
    }
  }

  async function handleWriteNow() {
    setDirExporting(true);
    setDirMsg(null);
    try {
      const files = await exportNow();
      setDirMsg(`✓ ${files} Datei(en) + assets.json geschrieben.`);
      window.setTimeout(() => setDirMsg(null), 4000);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setDirMsg(e instanceof Error ? `⚠ ${e.message}` : '⚠ Schreiben fehlgeschlagen');
    } finally {
      setDirExporting(false);
    }
  }

  async function handleBackup() {
    setBackupMsg(null);
    try {
      const snap = await buildBackup();
      const blob = new Blob([JSON.stringify(snap)], { type: 'application/json' });
      const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      downloadBlob(blob, `asset-studio-backup-${stamp}.json`);
      setBackupMsg(`✓ Sicherung erstellt: ${snap.library.length} Assets, ${snap.shots.length} Shots. Datei ins Repo committen.`);
    } catch (e) {
      setBackupMsg(e instanceof Error ? `⚠ ${e.message}` : '⚠ Sicherung fehlgeschlagen');
    }
  }

  async function handleRestoreFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // erlaubt erneutes Wählen derselben Datei
    if (!file) return;
    setRestoring(true);
    setBackupMsg(null);
    try {
      const summary = await restoreBackup(JSON.parse(await file.text()));
      setAssets(await listAssets());
      await reload();
      setStorage(await storageStatus());
      setBackupMsg(`✓ Wiederhergestellt: ${summary.library} Assets, ${summary.bible} Bibel, ${summary.shots} Shots.`);
    } catch (err) {
      setBackupMsg(err instanceof Error ? `⚠ ${err.message}` : '⚠ Wiederherstellung fehlgeschlagen');
    } finally {
      setRestoring(false);
    }
  }

  const chosenCount = assets.filter((a) => a.chosen).length;
  const errors = validateForExport(assets);
  const isImage = (t: ManifestAssetType) => t === 'image' || t === 'sheet';

  return (
    <div className={embedded ? 'flex flex-col' : 'fixed inset-0 z-50 flex flex-col bg-gray-950'}>
      {/* Kopf */}
      <div className="flex items-center justify-between border-b border-gray-800 px-1 py-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-bold">📚 Bibliothek</h2>
          <span className="text-sm text-gray-500">
            {assets.length} Assets · {chosenCount} fürs Spiel gewählt
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Schließen">
            ✕ Schließen
          </button>
        )}
      </div>

      {/* Sicherung / Wiederherstellung — immer sichtbar (auch leer wiederherstellbar) */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-800 px-1 py-2 text-xs">
        <span className="text-gray-500">
          Liegt lokal im Browser — <span className="text-gray-400">Git/Dateien sind die Quelle der Wahrheit</span>. Regelmäßig sichern.
        </span>
        <div className="ml-auto flex items-center gap-2">
          {storage && (
            <span
              className={storage.persisted ? 'text-green-500' : 'text-yellow-500'}
              title={storage.persisted ? 'Browser hält die Daten dauerhaft' : 'Nicht als dauerhaft markiert — bitte sichern'}
            >
              {storage.persisted ? '🔒 dauerhaft' : '⚠ nicht dauerhaft'}
              {storage.usage ? ` · ${fmtMB(storage.usage)}` : ''}
            </span>
          )}
          <button onClick={handleBackup} className="rounded bg-gray-700 px-3 py-1.5 font-medium hover:bg-gray-600">
            ⬇ Sicherung
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={restoring}
            className="rounded bg-gray-700 px-3 py-1.5 font-medium hover:bg-gray-600 disabled:opacity-50"
          >
            {restoring ? 'Stelle wieder her…' : '↩ Wiederherstellen'}
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleRestoreFile} className="hidden" />
        </div>
      </div>
      {backupMsg && <div className="border-b border-gray-800 px-1 py-1.5 text-xs text-gray-300">{backupMsg}</div>}

      {/* Inhalt */}
      <div className={embedded ? 'py-4' : 'flex-1 overflow-y-auto p-4'}>
        {loading ? (
          <p className="text-gray-500">Lade…</p>
        ) : assets.length === 0 ? (
          <div className="mx-auto max-w-md py-16 text-center text-gray-500">
            <div className="mb-3 text-4xl">📭</div>
            <p>Noch keine Assets. Im Regie- oder Frei-erzeugen-Modus etwas erstellen und übernehmen.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-3">
            {assets.map((asset) => {
              const idInvalid = !/^[a-z0-9_]+$/.test(asset.id);
              return (
                <div key={asset.key} className="flex gap-4 rounded-lg border border-gray-800 bg-gray-900 p-3">
                  {/* Vorschau */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-800">
                    {isImage(asset.type) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`data:${asset.mime};base64,${asset.dataBase64}`} alt={asset.id} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl">🔊</div>
                    )}
                  </div>

                  {/* Felder */}
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={asset.id}
                        onChange={(e) => update({ ...asset, id: e.target.value })}
                        className={`flex-1 rounded border bg-gray-800 px-2 py-1 font-mono text-sm ${idInvalid ? 'border-red-600' : 'border-gray-700'}`}
                        placeholder="asset_id"
                      />
                      <select
                        value={asset.type}
                        onChange={(e) => update({ ...asset, type: e.target.value as ManifestAssetType })}
                        className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm"
                      >
                        {TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-1 text-sm text-gray-300">
                        <input type="checkbox" checked={asset.chosen} onChange={(e) => update({ ...asset, chosen: e.target.checked })} />
                        fürs Spiel
                      </label>
                      <button onClick={() => remove(asset.key)} className="ml-auto text-sm text-gray-500 hover:text-red-400">
                        Löschen
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {asset.role === 'master' && <span className="rounded bg-purple-900 px-1.5 py-0.5 text-purple-200">Stil-Master</span>}
                      {asset.family && <span className="text-gray-600">{asset.family}</span>}
                      {asset.type === 'sheet' && asset.frameWidth && (
                        <span className="text-gray-600">
                          Sheet {asset.cols}×{asset.rows} · {asset.frameWidth}×{asset.frameHeight}px
                        </span>
                      )}
                      {asset.regions && asset.regions.length > 0 && <span className="text-gray-600">{asset.regions.length} Hotspots</span>}
                      {asset.styleVersion && <span className="text-gray-600">{asset.styleVersion}</span>}
                    </div>
                    <div className="truncate text-xs text-gray-500">
                      {asset.provider || '—'}
                      {asset.seed !== undefined ? ` · seed ${asset.seed}` : ''}
                      {asset.prompt ? ` · ${asset.prompt}` : ''}
                    </div>
                    {idInvalid && <div className="text-xs text-red-400">Nur a–z, 0–9, _ erlaubt (wird als Dateiname genutzt).</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fuß: Export */}
      {assets.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 px-1 py-3 text-sm">
          <div className="min-w-0">
            {errors.length === 0 ? (
              <span className="text-green-400">✓ {chosenCount} Asset(s) bereit.</span>
            ) : (
              <span className="text-yellow-400">⚠ {errors[0]}</span>
            )}
            {dirMsg ? (
              <span className="ml-2 text-gray-300">{dirMsg}</span>
            ) : autoExport === 'ready' ? (
              <span className="ml-2 text-green-500">
                ⚡ Auto-Export → {exportDir}
                {lastExport ? ` · zuletzt ${new Date(lastExport).toLocaleTimeString()}` : ''}{' · '}
                <button onClick={() => void disconnectExportDir()} className="underline hover:text-white">
                  trennen
                </button>
              </span>
            ) : autoExport === 'needs-permission' ? (
              <span className="ml-2 text-yellow-500">⚠ Ordner „{exportDir}" erneut freigeben (1 Klick/Sitzung)</span>
            ) : (
              <span className="ml-2 text-gray-600">
                Ziel: <code className="rounded bg-gray-800 px-1">desinformation-network/public/assets</code>
              </span>
            )}
          </div>
          <div className="flex flex-shrink-0 gap-2">
            {canDirExport && autoExport === 'ready' && (
              <button
                onClick={handleWriteNow}
                disabled={errors.length > 0 || dirExporting}
                title="Schreibt sofort den aktuellen Stand (sonst automatisch nach jeder Änderung)"
                className="rounded bg-green-600 px-4 py-2 font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {dirExporting ? 'Schreibe…' : '✍️ Jetzt schreiben'}
              </button>
            )}
            {canDirExport && autoExport !== 'ready' && (
              <button
                onClick={handleConnect}
                title="Ordner einmal wählen — danach schreibt das Studio automatisch (Chrome/Edge)"
                className={`rounded px-4 py-2 font-medium ${autoExport === 'needs-permission' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {autoExport === 'needs-permission' ? '🔓 Ordner freigeben' : '🔗 Spielordner verbinden'}
              </button>
            )}
            <button
              onClick={handleExport}
              disabled={errors.length > 0 || exporting}
              className="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {exporting ? 'Exportiere…' : '⬇ ZIP'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
