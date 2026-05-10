import React, { Component, ErrorInfo } from 'react';
import { logErrorToBackend } from '../../utils/errorLogger';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    logErrorToBackend(
      error,
      errorInfo.componentStack,
      {
        component: this.props.children?.type?.displayName || this.props.children?.type?.name || 'Unknown',
        eventType: 'reactErrorBoundary'
      }
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              We're sorry, but something unexpected happened. The error has been logged.
            </p>
            <details className="mb-4">
              <summary className="cursor-pointer font-semibold text-gray-900">Error Details</summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                {this.state.error?.message}
              </pre>
            </details>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
