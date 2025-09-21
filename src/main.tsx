import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AppDataProvider } from './context/AppDataContext.tsx';
import { UserDataProvider } from './context/UserDataContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppDataProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
      </AppDataProvider>
    </ThemeProvider>
  </StrictMode>,
);
