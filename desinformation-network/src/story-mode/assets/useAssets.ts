// ===========================================
// useAssets — React-Anbindung der AssetRegistry
// ===========================================
// Komponenten re-rendern automatisch, sobald das Manifest geladen ist.
// Vor dem Laden (oder ohne Manifest) liefert der Hook eine leere Registry,
// d. h. alle imageUrl()/sheet()-Aufrufe geben null => CSS-Fallback greift.

import { useSyncExternalStore } from 'react';
import { AssetRegistry, getAssetRegistry, subscribeAssets } from './AssetRegistry';

export function useAssets(): AssetRegistry {
  return useSyncExternalStore(subscribeAssets, getAssetRegistry, getAssetRegistry);
}
