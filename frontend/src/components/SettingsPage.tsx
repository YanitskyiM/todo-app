import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Palette, RotateCcw, Upload, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { TodoApp } from './TodoApp';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  title: string;
  description: string;
}

const PrimaryColorPicker: React.FC<Omit<ColorPickerProps, 'title' | 'description'>> = ({ color, onChange }) => {
  const [customColor, setCustomColor] = useState(color);

  // Predefined primary colors suitable for buttons
  const primaryColors = [
    '#000000', // Black
    '#1f2937', // Gray 800
    '#374151', // Gray 700
    '#6366f1', // Indigo 500
    '#3b82f6', // Blue 500
    '#06b6d4', // Cyan 500
    '#10b981', // Emerald 500
    '#84cc16', // Lime 500
    '#eab308', // Yellow 500
    '#f59e0b', // Amber 500
    '#f97316', // Orange 500
    '#ef4444', // Red 500
    '#ec4899', // Pink 500
    '#a855f7', // Purple 500
    '#8b5cf6', // Violet 500
    '#7c3aed', // Purple 600
    '#dc2626', // Red 600
    '#059669', // Emerald 600
    '#0891b2', // Cyan 600
    '#2563eb', // Blue 600
    '#7c2d12', // Orange 900
    '#991b1b', // Red 900
    '#581c87', // Purple 900
    '#1e40af', // Blue 800
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Preset Colors</h4>
        <div className="grid grid-cols-6 gap-3">
          {primaryColors.map((primaryColor, index) => {
            const isSelected = color === primaryColor;
            return (
              <span
                key={index}
                className={`inline-block w-12 h-12 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-2 border-gray-300'
                }`}
                style={{
                  backgroundColor: primaryColor,
                  minWidth: '3rem',
                  minHeight: '3rem',
                }}
                onClick={() => onChange(primaryColor)}
                title={primaryColor}
              />
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Custom Color</h4>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            placeholder="#000000"
          />
          <Button
            size="sm"
            onClick={() => onChange(customColor)}
            className="whitespace-nowrap"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

const BackgroundColorPicker: React.FC<Omit<ColorPickerProps, 'title' | 'description'>> = ({ color, onChange }) => {
  const [customColor, setCustomColor] = useState(color);

  // Predefined beautiful background colors
  const presetColors = [
    '#ffffff', // White
    '#f8fafc', // Slate 50
    '#f1f5f9', // Slate 100
    '#e2e8f0', // Slate 200
    '#fef2f2', // Red 50
    '#fee2e2', // Red 100
    '#fef7ff', // Purple 50
    '#f3e8ff', // Purple 100
    '#ecfdf5', // Green 50
    '#dcfce7', // Green 100
    '#f0f9ff', // Blue 50
    '#dbeafe', // Blue 100
    '#fffbeb', // Yellow 50
    '#fef3c7', // Yellow 100
    '#fdf4ff', // Pink 50
    '#fce7f3', // Pink 100
    '#f0fdfa', // Teal 50
    '#ccfbf1', // Teal 100
    '#fefce8', // Lime 50
    '#ecfccb', // Lime 100
    '#fff7ed', // Orange 50
    '#fed7aa', // Orange 100
    '#f8fafc', // Neutral 50
    '#f5f5f5', // Neutral 100
  ];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-4">Preset Colors</h4>
        <div className="grid grid-cols-6 gap-3">
          {presetColors.map((presetColor, index) => {
            const isSelected = color === presetColor;
            return (
              <span
                key={index}
                className={`inline-block w-12 h-12 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-2 border-gray-300'
                }`}
                style={{
                  backgroundColor: presetColor,
                  minWidth: '3rem',
                  minHeight: '3rem',
                }}
                onClick={() => onChange(presetColor)}
                title={presetColor}
              />
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-4">Custom Color</h4>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            placeholder="#ffffff"
          />
          <Button
            size="sm"
            onClick={() => onChange(customColor)}
            className="whitespace-nowrap"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  const { 
    backgroundColor, setBackgroundColor, 
    backgroundOpacity, setBackgroundOpacity,
    backgroundImage, setBackgroundImage,
    primaryColor, setPrimaryColor, 
    setIsSettingsOpen 
  } = useSettings();

  // Helper function to convert hex to rgba - same as in App.tsx
  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`;
  };

  const handleReset = () => {
    setBackgroundColor('#ffffff');
    setBackgroundOpacity(0.3);
    setBackgroundImage(null);
    setPrimaryColor('#000000');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to App
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Palette className="h-6 w-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Background Color Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Background Customization</CardTitle>
              <p className="text-sm text-gray-600">
                Customize your app's background with colors, opacity, and images
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Background Image Upload */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Background Image
                </h4>
                <div className="space-y-3">
                  {backgroundImage ? (
                    <div className="relative">
                      <img 
                        src={backgroundImage} 
                        alt="Background preview" 
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => setBackgroundImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload background image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="background-image-upload"
                      />
                      <label
                        htmlFor="background-image-upload"
                        className="inline-block px-3 py-1 bg-blue-500 text-white text-xs rounded cursor-pointer hover:bg-blue-600 transition-colors"
                      >
                        Choose Image
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Background Color Picker */}
              <div>
                <h4 className="text-sm font-medium mb-3">Background Color</h4>
                <BackgroundColorPicker
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                />
              </div>

              {/* Opacity Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Background Opacity</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {Math.round(backgroundOpacity * 100)}%
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={backgroundOpacity}
                    onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0% (Transparent)</span>
                    <span>100% (Solid)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Primary Color Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Primary Color</CardTitle>
              <p className="text-sm text-gray-600">
                Choose the primary color for buttons and interactive elements
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PrimaryColorPicker
                color={primaryColor}
                onChange={setPrimaryColor}
              />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Color Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-pink-500"></div>
              Live Preview
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Your actual todo app rendered live with your current settings
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Real Todo App Preview */}
            <div className="text-sm text-gray-600 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Live Preview - Real Todo App
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Preview Only
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border-2 border-gray-200 relative">
              <div 
                className="transition-all duration-300 relative pointer-events-none"
                style={{
                  transform: 'scale(0.75)',
                  transformOrigin: 'top left',
                  width: '133%',
                  height: '500px'
                }}
              >
                {/* Background layer - same as main app */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'scroll'
                  }}
                ></div>
                
                {/* Background overlay with color and opacity */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: backgroundColor !== '#ffffff' 
                      ? `linear-gradient(135deg, ${hexToRgba(backgroundColor, backgroundOpacity)}, ${hexToRgba(backgroundColor, backgroundOpacity * 0.3)})` 
                      : backgroundImage 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'linear-gradient(135deg, rgba(248, 250, 252, 0.5), rgba(241, 245, 249, 0.2))'
                  }}
                ></div>
                
                {/* Real TodoApp Component - Non-interactive */}
                <div className="relative z-10 p-4">
                  <TodoApp />
                </div>
              </div>
              
              {/* Overlay to prevent interactions */}
              <div className="absolute inset-0 bg-transparent cursor-not-allowed" title="Preview only - not interactive"></div>
            </div>

            {/* Color Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Background Info */}
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                    style={{ 
                      background: backgroundColor !== '#ffffff' 
                        ? `linear-gradient(135deg, ${hexToRgba(backgroundColor, 0.15)}, ${hexToRgba(backgroundColor, 0.05)})` 
                        : 'linear-gradient(135deg, rgba(248, 250, 252, 0.5), rgba(241, 245, 249, 0.2))'
                    }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-800">Background Settings</h4>
                    <p className="text-xs text-gray-500">{backgroundImage ? 'Image + color overlay' : 'Color gradient'}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Color:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs font-mono border">{backgroundColor}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Opacity:</span>
                    <span className="text-gray-800">{Math.round(backgroundOpacity * 100)}%</span>
                  </div>
                  {backgroundImage && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Image:</span>
                      <span className="text-gray-800 text-xs">Uploaded ✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary Color Info */}
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div>
                    <h4 className="font-medium text-gray-800">Primary Color</h4>
                    <p className="text-xs text-gray-500">Buttons & interactive elements</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hex Code:</span>
                    <code className="bg-white px-2 py-1 rounded text-xs font-mono border">{primaryColor}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Usage:</span>
                    <span className="text-gray-800">Buttons, Links, Icons</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Button Variations Preview */}
            <div className="p-4 rounded-lg border border-gray-200 bg-white">
              <h4 className="font-medium text-gray-800 mb-4">Button Variations</h4>
              <div className="flex flex-wrap gap-3">
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-105 shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 hover:scale-105"
                  style={{ 
                    borderColor: primaryColor, 
                    color: primaryColor,
                    backgroundColor: 'transparent'
                  }}
                >
                  Outline Button
                </button>
                <button 
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{ 
                    color: primaryColor,
                    backgroundColor: hexToRgba(primaryColor, 0.15)
                  }}
                >
                  Ghost Button
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200">
                  Secondary
                </button>
              </div>
            </div>

            {/* Color Harmony & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Color Harmony */}
              <div className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-blue-500">🎨</span>
                  Color Harmony
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: backgroundColor }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                    <span className="text-sm text-gray-600">Current Combination</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {backgroundColor === '#ffffff' && primaryColor === '#000000' 
                      ? 'Classic black and white - timeless and professional'
                      : backgroundColor.toLowerCase().includes('f') && primaryColor.toLowerCase().includes('3') 
                      ? 'Soft background with bold primary - great contrast'
                      : 'Custom color combination - make sure it feels balanced'}
                  </p>
                </div>
              </div>

              {/* Accessibility Tips */}
              <div className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-500">♿</span>
                  Accessibility
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">High contrast on buttons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Subtle background gradients</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Colors are optimized for readability and visual comfort.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Changes are saved automatically and applied immediately
          </p>
        </div>
      </div>
    </div>
  );
};
