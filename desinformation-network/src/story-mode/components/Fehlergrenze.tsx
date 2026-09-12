import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StoryModeColors, StoryModeType, stampCtaClass, stampCtaStyle } from '../theme';
import { storyLogger } from '../../utils/logger';

/**
 * Fehlergrenze — fängt Renderfehler ab, statt das ganze Spiel mitzureißen.
 *
 * Es gab im gesamten Spiel keine einzige. React 18 hängt bei einem
 * unbehandelten Renderfehler den kompletten Baum aus, deshalb wurde aus einem
 * `undefined` in der Konsequenz-Leiste eine leere Seite und der Spielstand der
 * Sitzung war verloren.
 *
 * Zwei Einsatzarten:
 * - `variante="teil"` um einzelne Leisten/Panels: nur dieser Bereich wird
 *   ersetzt, das Spiel läuft weiter.
 * - `variante="ganz"` um das Spiel: letzte Instanz, mit Neustart-Knopf.
 */
interface Props {
  children: ReactNode;
  variante?: 'teil' | 'ganz';
  /** Was hier kaputtging — erscheint im Protokoll und im Fallback. */
  bereich?: string;
}

interface State {
  fehler: Error | null;
}

export class Fehlergrenze extends Component<Props, State> {
  state: State = { fehler: null };

  static getDerivedStateFromError(fehler: Error): State {
    return { fehler };
  }

  componentDidCatch(fehler: Error, info: ErrorInfo): void {
    storyLogger.error(
      `[Fehlergrenze] ${this.props.bereich ?? 'unbenannt'}: ${fehler.message}`,
      info.componentStack
    );
  }

  private neuLaden = () => {
    window.location.reload();
  };

  render() {
    const { fehler } = this.state;
    if (!fehler) return this.props.children;

    const { variante = 'teil', bereich } = this.props;

    if (variante === 'teil') {
      // Knapp und beiläufig: Der Spieler soll weiterspielen können, nicht
      // erschrecken. Die Einzelheiten stehen im Protokoll, nicht auf dem Schirm.
      return (
        <div
          className="px-3 py-2 border"
          style={{
            backgroundColor: StoryModeColors.surface,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
            fontSize: StoryModeType.small,
          }}
        >
          {bereich ? `${bereich} ist gerade nicht verfügbar.` : 'Dieser Bereich ist gerade nicht verfügbar.'}
        </div>
      );
    }

    return (
      <div
        className="flex flex-col items-center justify-center gap-4 p-8"
        style={{ minHeight: '100vh', backgroundColor: StoryModeColors.background }}
      >
        <div style={{ fontSize: StoryModeType.title, color: StoryModeColors.textPrimary }}>
          AKTE VORÜBERGEHEND GESPERRT
        </div>
        <p
          className="text-center"
          style={{ color: StoryModeColors.textSecondary, fontSize: StoryModeType.body, maxWidth: '32rem' }}
        >
          Im Ministerium ist etwas schiefgelaufen. Ihr Spielstand ist gespeichert —
          ein Neustart bringt Sie zurück an die Stelle, an der Sie zuletzt abgelegt haben.
        </p>
        <button className={stampCtaClass} style={stampCtaStyle} onClick={this.neuLaden}>
          NEU LADEN
        </button>
        <code
          style={{ color: StoryModeColors.textMuted, fontSize: StoryModeType.micro, maxWidth: '40rem' }}
        >
          {bereich ? `${bereich}: ` : ''}{fehler.message}
        </code>
      </div>
    );
  }
}

export default Fehlergrenze;
