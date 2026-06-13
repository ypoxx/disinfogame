// ===========================================
// ASSET-MANIFEST — Typen (Spiel-Seite)
// ===========================================
// Spiegel des Export-Schemas aus sprite-tool/src/lib/assets.ts (ManifestEntry).
// Quelle der Wahrheit für den VERTRAG ist docs/ASSET_STUDIO_SPEC.md; Erzeuger
// sind das Asset Studio (sprite-tool) und tools/asset-pipeline. Das Spiel lädt
// das Manifest datengetrieben aus public/assets/assets.json — fehlt es, läuft
// alles im bisherigen CSS-/Synth-Fallback weiter.

export type ManifestAssetType = 'image' | 'sheet' | 'sfx' | 'voice' | 'music';

/** Eine Animation in einem Sprite-Sheet (Zeile + Frame-Anzahl + Timing). */
export interface SheetAnimationMeta {
  row?: number;
  frames: number;
  frameTime: number; // ms pro Frame
  loop: boolean;
}

/** Klickbarer Bereich (Hotspot) auf einem Raum-Hintergrund. */
export interface AssetRegion {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Ein Eintrag im assets.json (Export-Schema des Asset Studios). */
export interface ManifestEntry {
  id: string;
  type: ManifestAssetType;
  file: string; // relativer Pfad, z. B. "images/room_zentrale.png"
  provider?: string;
  prompt?: string;
  seed?: number;
  styleVersion?: string;
  chosen: boolean;
  frameWidth?: number;
  frameHeight?: number;
  animations?: Record<string, SheetAnimationMeta>;
  regions?: AssetRegion[];
}

export interface AssetsManifest {
  assets: ManifestEntry[];
}

/** Aufgelöste Sheet-Infos für den Sprite-Renderer (useSprite). */
export interface SheetInfo {
  id: string;
  url: string;
  frameWidth: number;
  frameHeight: number;
  animations: Record<string, SheetAnimationMeta>;
}
