const ERROR_ENDPOINT = '/api/logs/frontend';

export const logErrorToBackend = (error, componentStack = '', additionalInfo = {}) => {
  // Avoid logging during test to prevent side effects
  if (process.env.NODE_ENV === 'test') return;

  const errorData = {
    error: {
      message: error?.message || String(error),
      stack: error?.stack || '',
      name: error?.name || '',
    },
    componentStack: componentStack || '',
    additionalInfo,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  // Use sendBeacon for reliability (works even on page unload)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(errorData)], { type: 'application/json' });
    navigator.sendBeacon(ERROR_ENDPOINT, blob);
  } else {
    // Fallback: fetch with keepalive flag, no auth interceptors
    fetch(ERROR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
      keepalive: true,
    }).catch(() => {});
  }
};
