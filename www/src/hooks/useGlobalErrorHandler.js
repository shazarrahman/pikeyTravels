import { useEffect } from 'react';
import { logErrorToBackend } from '../utils/errorLogger';

function useGlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event) => {
      const error = event.error || new Error(event.message);
      logErrorToBackend(error, '', { eventType: 'window.onerror', filename: event.filename, lineno: event.lineno, colno: event.colno });
    };

    const handleUnhandledRejection = (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      logErrorToBackend(error, '', { eventType: 'unhandledrejection' });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

export default useGlobalErrorHandler;
