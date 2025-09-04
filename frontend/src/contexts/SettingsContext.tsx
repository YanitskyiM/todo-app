import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundOpacity: number;
  setBackgroundOpacity: (opacity: number) => void;
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

const defaultSettings: SettingsContextType = {
  backgroundColor: '#ffffff',
  setBackgroundColor: () => {},
  backgroundOpacity: 0.15,
  setBackgroundOpacity: () => {},
  backgroundImage: null,
  setBackgroundImage: () => {},
  primaryColor: '#000000',
  setPrimaryColor: () => {},
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

// Helper function to convert hex to rgb
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [backgroundColor, setBackgroundColorState] = useState<string>('#ffffff');
  const [backgroundOpacity, setBackgroundOpacityState] = useState<number>(0.15);
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
  const [primaryColor, setPrimaryColorState] = useState<string>('#000000');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('todoAppSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        const bgColor = settings.backgroundColor || '#ffffff';
        const bgOpacity = settings.backgroundOpacity || 0.15;
        const bgImage = settings.backgroundImage || null;
        const primaryCol = settings.primaryColor || '#000000';
        setBackgroundColorState(bgColor);
        setBackgroundOpacityState(bgOpacity);
        setBackgroundImageState(bgImage);
        setPrimaryColorState(primaryCol);
        
        // Apply primary color immediately on load
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primaryCol);
        root.style.setProperty('--primary-color-rgb', hexToRgb(primaryCol));
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      backgroundColor,
      backgroundOpacity,
      backgroundImage,
      primaryColor,
    };
    localStorage.setItem('todoAppSettings', JSON.stringify(settings));
    
    // Apply primary color to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-color-rgb', hexToRgb(primaryColor));
  }, [backgroundColor, backgroundOpacity, backgroundImage, primaryColor]);

  const setBackgroundColor = (color: string) => {
    setBackgroundColorState(color);
  };

  const setBackgroundOpacity = (opacity: number) => {
    setBackgroundOpacityState(opacity);
  };

  const setBackgroundImage = (image: string | null) => {
    setBackgroundImageState(image);
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
  };

  const value: SettingsContextType = {
    backgroundColor,
    setBackgroundColor,
    backgroundOpacity,
    setBackgroundOpacity,
    backgroundImage,
    setBackgroundImage,
    primaryColor,
    setPrimaryColor,
    isSettingsOpen,
    setIsSettingsOpen,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
