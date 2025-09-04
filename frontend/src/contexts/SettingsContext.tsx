import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const defaultSettings: SettingsContextType = {
  backgroundColor: '#ffffff',
  setBackgroundColor: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultSettings);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [backgroundColor, setBackgroundColorState] = useState<string>('#ffffff');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('todoAppSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        const color = settings.backgroundColor || '#ffffff';
        setBackgroundColorState(color);
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      backgroundColor,
    };
    localStorage.setItem('todoAppSettings', JSON.stringify(settings));
  }, [backgroundColor]);

  const setBackgroundColor = (color: string) => {
    setBackgroundColorState(color);
  };

  const value: SettingsContextType = {
    backgroundColor,
    setBackgroundColor,
    isSettingsOpen,
    setIsSettingsOpen,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
