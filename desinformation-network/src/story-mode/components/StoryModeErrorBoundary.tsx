import { Component, ReactNode } from 'react';
import { StoryModeColors } from '../theme';

interface StoryModeErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface StoryModeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class StoryModeErrorBoundary extends Component<
  StoryModeErrorBoundaryProps,
  StoryModeErrorBoundaryState
> {
  constructor(props: StoryModeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): StoryModeErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Story Mode Error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: StoryModeColors.background }}
        >
          <div
            className="max-w-2xl w-full mx-4 border-8"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: StoryModeColors.danger,
              boxShadow: '16px 16px 0px 0px rgba(0,0,0,0.9)',
            }}
          >
            {/* Header */}
            <div
              className="px-8 py-6 border-b-4 text-center"
              style={{
                backgroundColor: StoryModeColors.danger,
                borderColor: StoryModeColors.border,
              }}
            >
              <div className="text-4xl mb-2">⚠️</div>
              <h1
                className="font-bold text-3xl tracking-wider"
                style={{ color: '#fff' }}
              >
                KRITISCHER FEHLER
              </h1>
              <p className="text-white/80 mt-2 text-sm">
                Operation Compromised
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div
                className="mb-6 text-center font-mono"
                style={{ color: StoryModeColors.textSecondary }}
              >
                <p className="mb-4">
                  Ein unerwarteter Fehler ist aufgetreten.
                </p>
                <p className="mb-4">
                  Die Mission wurde kompromittiert und muss neu gestartet werden.
                </p>
              </div>

              {/* Error details in dev mode */}
              {import.meta.env.DEV && this.state.error && (
                <div
                  className="border-2 p-4 mb-6 text-xs font-mono overflow-auto max-h-48"
                  style={{
                    backgroundColor: StoryModeColors.background,
                    borderColor: StoryModeColors.warning,
                    color: StoryModeColors.danger,
                  }}
                >
                  <div className="mb-2 font-bold" style={{ color: StoryModeColors.warning }}>
                    [DEV] ERROR DETAILS:
                  </div>
                  <pre className="whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReset}
                  className="w-full py-4 border-4 font-bold text-lg transition-all hover:brightness-110 active:translate-y-1"
                  style={{
                    backgroundColor: StoryModeColors.sovietRed,
                    borderColor: StoryModeColors.darkRed,
                    color: '#fff',
                    boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.8)',
                  }}
                >
                  MISSION NEUSTARTEN
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 border-4 font-bold transition-all hover:brightness-110 active:translate-y-1"
                  style={{
                    backgroundColor: StoryModeColors.concrete,
                    borderColor: StoryModeColors.borderLight,
                    color: StoryModeColors.textPrimary,
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
                  }}
                >
                  SEITE NEU LADEN
                </button>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-8 py-3 border-t-4 text-center text-xs"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.textMuted,
              }}
            >
              Error Code: ERR_STORY_MODE_CRITICAL
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default StoryModeErrorBoundary;
