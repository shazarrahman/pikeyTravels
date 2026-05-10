import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './routes/AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CustomizationProvider } from './context/CustomizationContext';
import ErrorBoundary from './components/error/ErrorBoundary';
import useGlobalErrorHandler from './hooks/useGlobalErrorHandler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  useGlobalErrorHandler();

  return (
    <HelmetProvider>
      <HashRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <CustomizationProvider>
                <ErrorBoundary>
                  <AppRouter />
                </ErrorBoundary>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--color-secondary)',
                        color: 'var(--color-foreground)',
                      fontSize: '14px',
                    },
                  }}
                />
              </CustomizationProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HashRouter >
    </HelmetProvider>
  );
}

export default App;