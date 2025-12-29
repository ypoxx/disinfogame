import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
          <div className="max-w-md mx-4 p-6 bg-gray-800 border border-red-500 rounded-lg">
            <h2 className="text-xl font-bold text-red-500 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-300 mb-4">
              An error occurred in the application. Please try refreshing the page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-400 cursor-pointer">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-xs text-red-400 overflow-auto p-2 bg-gray-900 rounded">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
