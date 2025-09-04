import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, Palette, RotateCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PrimaryColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
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
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Preset Colors</h4>
        <div className="grid grid-cols-6 gap-2">
          {primaryColors.map((primaryColor, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                color === primaryColor 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: primaryColor }}
              onClick={() => onChange(primaryColor)}
              title={primaryColor}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Custom Color</h4>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
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

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [customColor, setCustomColor] = useState(color);

  // Predefined beautiful colors
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
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Preset Colors</h4>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((presetColor, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                color === presetColor 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
              title={presetColor}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Custom Color</h4>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
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

export const Settings: React.FC = () => {
  const { backgroundColor, setBackgroundColor, primaryColor, setPrimaryColor, isSettingsOpen, setIsSettingsOpen } = useSettings();

  const handleReset = () => {
    setBackgroundColor('#ffffff');
    setPrimaryColor('#000000');
  };

  const handleClose = () => {
    setIsSettingsOpen(false);
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Settings
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Background Color</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose a beautiful background color for your todo app
            </p>
            <ColorPicker
              color={backgroundColor}
              onChange={setBackgroundColor}
            />
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Primary Color</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose the primary color for buttons and interactive elements
            </p>
            <PrimaryColorPicker
              color={primaryColor}
              onChange={setPrimaryColor}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium">Current Colors</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300" 
                        style={{ backgroundColor }}
                      ></div>
                      <span className="text-xs text-gray-500">BG: {backgroundColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300" 
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <span className="text-xs text-gray-500">Primary: {primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset All
                </Button>
                <Button
                  size="sm"
                  onClick={handleClose}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
