import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, Palette, RotateCcw } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

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
  const { backgroundColor, setBackgroundColor, isSettingsOpen, setIsSettingsOpen } = useSettings();

  const handleReset = () => {
    setBackgroundColor('#ffffff');
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

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Current Color</h4>
                <p className="text-xs text-gray-500">{backgroundColor}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
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
