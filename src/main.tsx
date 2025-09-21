import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AppDataProvider } from './context/AppDataContext.tsx';
import { UserDataProvider } from './context/UserDataContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
      <ThemeProvider>
        <AppDataProvider>
          <UserDataProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </UserDataProvider>
        </AppDataProvider>
      </ThemeProvider>
    </Suspense>
  </StrictMode>,
);
