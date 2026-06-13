/**
 * Icon — EIN Pixel-Icon-Vokabular statt Emojis (Stil-Bibel A5, Verbotsliste).
 * Mappt semantische Namen auf die vorhandenen `icon_*`-Assets (assets.json) und
 * rendert sie pixelig. Fehlt ein Asset, wird optional ein Text-Fallback gezeigt
 * (kein Emoji), sonst nichts — nie ein Emoji.
 */
import { useAssets } from '../assets/useAssets';

export type IconName =
  | 'budget' | 'capacity' | 'risk' | 'attention' | 'moral'
  | 'actions' | 'news' | 'stats' | 'npcs' | 'mission' | 'events'
  | 'building' | 'office' | 'dashboard' | 'broadcast'
  | 'soundOn' | 'soundOff' | 'save' | 'clock';

const ICON_ASSET: Record<IconName, string> = {
  budget: 'icon_budget',
  capacity: 'icon_capacity',
  risk: 'icon_risk',
  attention: 'icon_attention',
  moral: 'icon_moral',
  actions: 'icon_actions',
  news: 'icon_news',
  stats: 'icon_stats',
  npcs: 'icon_npcs',
  mission: 'icon_mission',
  events: 'icon_events',
  building: 'icon_building',
  office: 'icon_office',
  dashboard: 'icon_dashboard',
  broadcast: 'icon_broadcast',
  soundOn: 'icon_sound_on',
  soundOff: 'icon_sound_off',
  save: 'icon_save',
  clock: 'icon_clock',
};

export interface IconProps {
  name: IconName;
  size?: number;
  /** Kurzer Text-Fallback (kein Emoji!), falls das Asset (noch) fehlt. */
  fallback?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 16, fallback, title, className, style }: IconProps): JSX.Element | null {
  const assets = useAssets();
  const url = assets.imageUrl(ICON_ASSET[name]);
  if (url) {
    return (
      <img
        src={url}
        alt={title ?? ''}
        title={title}
        width={size}
        height={size}
        className={className}
        style={{ imageRendering: 'pixelated', display: 'inline-block', verticalAlign: 'middle', ...style }}
      />
    );
  }
  if (fallback) {
    return (
      <span
        title={title}
        className={className}
        style={{ fontSize: Math.round(size * 0.72), lineHeight: 1, ...style }}
      >
        {fallback}
      </span>
    );
  }
  return null;
}

export default Icon;
