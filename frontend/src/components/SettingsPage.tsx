import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Palette, RotateCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

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
  const { backgroundColor, setBackgroundColor, primaryColor, setPrimaryColor, setIsSettingsOpen } = useSettings();

  const handleReset = () => {
    setBackgroundColor('#ffffff');
    setPrimaryColor('#000000');
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
              <CardTitle className="text-xl">Background Color</CardTitle>
              <p className="text-sm text-gray-600">
                Choose a beautiful background color for your todo app
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <BackgroundColorPicker
                color={backgroundColor}
                onChange={setBackgroundColor}
              />
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

        {/* Current Colors Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Color Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Current Background</h4>
                <div 
                  className="w-full h-20 rounded-lg border-2 border-gray-300 flex items-center justify-center"
                  style={{ 
                    background: backgroundColor !== '#ffffff' 
                      ? `linear-gradient(135deg, ${backgroundColor}66, ${backgroundColor}33)` 
                      : 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
                  }}
                >
                  <span className="text-sm font-medium text-gray-700">{backgroundColor}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3">Current Primary Color</h4>
                <div className="space-y-3">
                  <div 
                    className="w-full h-12 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Button Preview ({primaryColor})
                  </div>
                  <Button 
                    className="w-full"
                    style={{ 
                      backgroundColor: primaryColor,
                      borderColor: primaryColor
                    }}
                  >
                    Live Button Example
                  </Button>
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
