import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, RotateCw, Palette } from 'lucide-react';
import { GradientSettings, GradientStop } from '../contexts/SettingsContext';

interface GradientPickerProps {
  gradientSettings: GradientSettings;
  onGradientChange: (settings: GradientSettings) => void;
}

const GradientPicker: React.FC<GradientPickerProps> = ({ gradientSettings, onGradientChange }) => {
  const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0);

  // Preset gradients
  const presetGradients: { name: string; settings: GradientSettings }[] = [
    {
      name: 'Sunset',
      settings: {
        type: 'linear',
        direction: 'to bottom right',
        stops: [
          { color: '#ff7e5f', position: 0 },
          { color: '#feb47b', position: 100 }
        ],
        angle: 135,
        centerX: 50,
        centerY: 50
      }
    },
    {
      name: 'Ocean',
      settings: {
        type: 'linear',
        direction: 'to bottom',
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 }
        ],
        angle: 180,
        centerX: 50,
        centerY: 50
      }
    },
    {
      name: 'Forest',
      settings: {
        type: 'linear',
        direction: 'to bottom right',
        stops: [
          { color: '#134e5e', position: 0 },
          { color: '#71b280', position: 100 }
        ],
        angle: 135,
        centerX: 50,
        centerY: 50
      }
    },
    {
      name: 'Purple Dream',
      settings: {
        type: 'radial',
        direction: 'circle',
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 }
        ],
        angle: 0,
        centerX: 50,
        centerY: 50
      }
    },
    {
      name: 'Fire',
      settings: {
        type: 'linear',
        direction: 'to right',
        stops: [
          { color: '#ff416c', position: 0 },
          { color: '#ff4b2b', position: 100 }
        ],
        angle: 90,
        centerX: 50,
        centerY: 50
      }
    },
    {
      name: 'Aurora',
      settings: {
        type: 'conic',
        direction: 'circle',
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 25 },
          { color: '#f093fb', position: 50 },
          { color: '#f5576c', position: 75 },
          { color: '#667eea', position: 100 }
        ],
        angle: 0,
        centerX: 50,
        centerY: 50
      }
    }
  ];

  const addStop = () => {
    const newStops = [...gradientSettings.stops];
    const newPosition = Math.min(100, Math.max(0, 
      newStops.length > 0 ? newStops[newStops.length - 1].position + 20 : 50
    ));
    newStops.push({ color: '#ffffff', position: newPosition });
    onGradientChange({ ...gradientSettings, stops: newStops });
  };

  const removeStop = (index: number) => {
    if (gradientSettings.stops.length <= 2) return; // Keep at least 2 stops
    const newStops = gradientSettings.stops.filter((_, i) => i !== index);
    onGradientChange({ ...gradientSettings, stops: newStops });
    if (selectedStopIndex >= newStops.length) {
      setSelectedStopIndex(newStops.length - 1);
    }
  };

  const updateStop = (index: number, field: 'color' | 'position', value: string | number) => {
    const newStops = [...gradientSettings.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    onGradientChange({ ...gradientSettings, stops: newStops });
  };

  const applyPreset = (preset: GradientSettings) => {
    onGradientChange(preset);
  };

  const generatePreviewCSS = () => {
    const { type, stops, angle, centerX, centerY } = gradientSettings;
    const stopStrings = stops.map(stop => `${stop.color} ${stop.position}%`).join(', ');

    switch (type) {
      case 'linear':
        return `linear-gradient(${angle}deg, ${stopStrings})`;
      case 'radial':
        return `radial-gradient(circle at ${centerX}% ${centerY}%, ${stopStrings})`;
      case 'conic':
        return `conic-gradient(from ${angle}deg at ${centerX}% ${centerY}%, ${stopStrings})`;
      default:
        return `linear-gradient(135deg, ${stopStrings})`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Gradient Type Selection */}
      <div>
        <h4 className="text-sm font-medium mb-3">Gradient Type</h4>
        <div className="grid grid-cols-4 gap-2">
          {[
            { type: 'linear', label: 'Linear' },
            { type: 'radial', label: 'Radial' },
            { type: 'conic', label: 'Conic' },
            { type: 'solid', label: 'Solid' }
          ].map(({ type, label }) => (
            <Button
              key={type}
              variant={gradientSettings.type === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGradientChange({ ...gradientSettings, type: type as any })}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Preset Gradients */}
      <div>
        <h4 className="text-sm font-medium mb-3">Preset Gradients</h4>
        <div className="grid grid-cols-3 gap-2">
          {presetGradients.map((preset, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => applyPreset(preset.settings)}
            >
              <div
                className="w-full h-16 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-colors"
                style={{ background: generatePreviewCSS() }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {preset.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Preview */}
      <div>
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div
          className="w-full h-24 rounded-lg border-2 border-gray-300"
          style={{ background: generatePreviewCSS() }}
        />
      </div>

      {/* Gradient Controls */}
      {gradientSettings.type !== 'solid' && (
        <>
          {/* Angle/Direction Controls */}
          {gradientSettings.type === 'linear' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Angle</h4>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {gradientSettings.angle}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={gradientSettings.angle}
                onChange={(e) => onGradientChange({ ...gradientSettings, angle: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}

          {/* Center Position for Radial/Conic */}
          {(gradientSettings.type === 'radial' || gradientSettings.type === 'conic') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Center X</h4>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gradientSettings.centerX}
                  onChange={(e) => onGradientChange({ ...gradientSettings, centerX: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-500">{gradientSettings.centerX}%</span>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Center Y</h4>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gradientSettings.centerY}
                  onChange={(e) => onGradientChange({ ...gradientSettings, centerY: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-500">{gradientSettings.centerY}%</span>
              </div>
            </div>
          )}

          {/* Color Stops */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Color Stops</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={addStop}
                className="h-8 px-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {gradientSettings.stops.map((stop, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                    selectedStopIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedStopIndex(index)}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: stop.color }}
                  />
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(index, 'color', e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => updateStop(index, 'position', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-center">
                    {stop.position}%
                  </span>
                  {gradientSettings.stops.length > 2 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStop(index);
                      }}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GradientPicker;
