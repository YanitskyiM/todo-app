import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TodoApp } from './components/TodoApp';
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
  const { backgroundColor } = useSettings();

  useEffect(() => {
    // Apply the theme class to the document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div 
      className="min-h-screen p-4 transition-all duration-300"
      style={{
        background: backgroundColor !== '#ffffff' 
          ? `linear-gradient(135deg, ${backgroundColor}15, ${backgroundColor}05)` 
          : undefined
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
