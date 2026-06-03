'use client';

// ===========================================
// BIBLIOTHEK — kuratierte Assets verwalten + Export
// ===========================================
// Listet Assets aus IndexedDB; id/Typ bearbeiten, „fürs Spiel" markieren,
// löschen, exportieren (assets.json + ZIP, inkl. Sheet-/Regionen-Metadaten).
// Als Modal (onClose) ODER eingebettet (embedded) nutzbar.

import { useEffect, useState } from 'react';
import { listAssets, putAsset, deleteAsset } from '@/lib/library';
import { validateForExport, type LibraryAsset, type ManifestAssetType } from '@/lib/assets';
import { buildExportZip, downloadBlob } from '@/lib/export';

interface LibraryPanelProps {
  onClose?: () => void;
  embedded?: boolean;
}

const TYPES: ManifestAssetType[] = ['image', 'sheet', 'sfx', 'voice', 'music'];

export function LibraryPanel({ onClose, embedded = false }: LibraryPanelProps) {
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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
        <div className="flex items-center justify-between gap-3 border-t border-gray-800 px-1 py-3 text-sm">
          <div className="min-w-0">
            {errors.length === 0 ? (
              <span className="text-green-400">✓ {chosenCount} Asset(s) bereit.</span>
            ) : (
              <span className="text-yellow-400">⚠ {errors[0]}</span>
            )}
            <span className="ml-2 text-gray-600">ZIP entpacken nach desinformation-network/public/assets/</span>
          </div>
          <button
            onClick={handleExport}
            disabled={errors.length > 0 || exporting}
            className="flex-shrink-0 rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {exporting ? 'Exportiere…' : '⬇ Export (ZIP)'}
          </button>
        </div>
      )}
    </div>
  );
}
