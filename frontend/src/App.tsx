import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TodoApp } from './components/TodoApp';
import { SettingsPage } from './components/SettingsPage';
import { Moon, Sun } from 'lucide-react';
import { Button } from './components/ui/button';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const AppContent = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { backgroundColor, primaryColor, isSettingsOpen } = useSettings();

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`;
  };

  useEffect(() => {
    // Apply the theme class to the document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Show settings page if settings is open
  if (isSettingsOpen) {
    return <SettingsPage />;
  }

  return (
    <div 
      className="min-h-screen p-4 transition-all duration-300"
      style={{
        background: backgroundColor !== '#ffffff' 
          ? `linear-gradient(135deg, ${hexToRgba(backgroundColor, 0.15)}, ${hexToRgba(backgroundColor, 0.05)})` 
          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.5), rgba(241, 245, 249, 0.2))'
      }}
    >
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
      <TodoApp />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
