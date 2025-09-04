import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GradientStop {
  color: string;
  position: number;
}

export interface GradientSettings {
  type: 'solid' | 'linear' | 'radial' | 'conic';
  direction: string;
  stops: GradientStop[];
  angle: number;
  centerX: number;
  centerY: number;
}

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
  // New gradient settings
  gradientSettings: GradientSettings;
  setGradientSettings: (settings: GradientSettings) => void;
  useGradient: boolean;
  setUseGradient: (use: boolean) => void;
}

const defaultGradientSettings: GradientSettings = {
  type: 'linear',
  direction: 'to bottom right',
  stops: [
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 }
  ],
  angle: 135,
  centerX: 50,
  centerY: 50
};

const defaultSettings: SettingsContextType = {
  backgroundColor: '#ffffff',
  setBackgroundColor: () => {},
  backgroundOpacity: 0.3,
  setBackgroundOpacity: () => {},
  backgroundImage: null,
  setBackgroundImage: () => {},
  primaryColor: '#000000',
  setPrimaryColor: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
  gradientSettings: defaultGradientSettings,
  setGradientSettings: () => {},
  useGradient: false,
  setUseGradient: () => {},
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
  const [backgroundOpacity, setBackgroundOpacityState] = useState<number>(0.3);
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
  const [primaryColor, setPrimaryColorState] = useState<string>('#000000');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [gradientSettings, setGradientSettingsState] = useState<GradientSettings>(defaultGradientSettings);
  const [useGradient, setUseGradientState] = useState<boolean>(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('todoAppSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        const bgColor = settings.backgroundColor || '#ffffff';
        const bgOpacity = settings.backgroundOpacity !== undefined ? settings.backgroundOpacity : 0.3;
        const bgImage = settings.backgroundImage || null;
        const primaryCol = settings.primaryColor || '#000000';
        const gradientSettings = settings.gradientSettings || defaultGradientSettings;
        const useGradient = settings.useGradient || false;
        
        setBackgroundColorState(bgColor);
        setBackgroundOpacityState(bgOpacity);
        setBackgroundImageState(bgImage);
        setPrimaryColorState(primaryCol);
        setGradientSettingsState(gradientSettings);
        setUseGradientState(useGradient);
        
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
      gradientSettings,
      useGradient,
    };
    localStorage.setItem('todoAppSettings', JSON.stringify(settings));
    
    // Apply primary color to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--primary-color-rgb', hexToRgb(primaryColor));
  }, [backgroundColor, backgroundOpacity, backgroundImage, primaryColor, gradientSettings, useGradient]);

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

  const setGradientSettings = (settings: GradientSettings) => {
    setGradientSettingsState(settings);
  };

  const setUseGradient = (use: boolean) => {
    setUseGradientState(use);
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
    gradientSettings,
    setGradientSettings,
    useGradient,
    setUseGradient,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
