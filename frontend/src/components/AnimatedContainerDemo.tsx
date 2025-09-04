import React from 'react';
import { AnimatedContainer } from './ui/animated-container';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Palette, Layers, Settings, Star, Heart, Zap } from 'lucide-react';

export const AnimatedContainerDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Animated Container Demo
          </h1>
          <p className="text-gray-600">
            Smooth open/close animations with background and primary color variants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Variant */}
          <AnimatedContainer
            title="Default Container"
            description="Standard styling with gray colors"
            icon={<Settings className="h-5 w-5" />}
            defaultOpen={true}
            variant="default"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                This is the default variant with standard gray styling. Perfect for general use cases.
              </p>
              <div className="flex gap-2">
                <Button size="sm">Action 1</Button>
                <Button size="sm" variant="outline">Action 2</Button>
              </div>
            </div>
          </AnimatedContainer>

          {/* Primary Variant */}
          <AnimatedContainer
            title="Primary Container"
            description="Uses your custom primary color"
            icon={<Palette className="h-5 w-5" />}
            defaultOpen={false}
            variant="primary"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                This variant uses your custom primary color for headers and accents. Great for important sections.
              </p>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  Primary color accent area
                </p>
              </div>
            </div>
          </AnimatedContainer>

          {/* Background Variant */}
          <AnimatedContainer
            title="Background Container"
            description="Uses background color theming"
            icon={<Layers className="h-5 w-5" />}
            defaultOpen={false}
            variant="background"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                This variant uses background color theming. Perfect for content that should blend with the background.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-background/60 rounded border">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <p className="text-xs mt-1">Feature 1</p>
                </div>
                <div className="p-3 bg-background/60 rounded border">
                  <Heart className="h-4 w-4 text-red-500" />
                  <p className="text-xs mt-1">Feature 2</p>
                </div>
              </div>
            </div>
          </AnimatedContainer>

          {/* Custom Styling */}
          <AnimatedContainer
            title="Custom Styled"
            description="With custom classes and enhanced styling"
            icon={<Zap className="h-5 w-5" />}
            defaultOpen={true}
            variant="primary"
            className="border-2 border-purple-200 shadow-xl hover:shadow-2xl"
            headerClassName="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
            contentClassName="bg-gradient-to-br from-purple-50/50 to-pink-50/50"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                This container has custom styling with gradients and enhanced borders.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Custom
                </span>
                <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                  Styling
                </span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                  Example
                </span>
              </div>
            </div>
          </AnimatedContainer>
        </div>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Usage Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Basic Usage</h4>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`<AnimatedContainer
  title="My Container"
  description="Optional description"
  icon={<Icon />}
  defaultOpen={false}
>
  <div>Your content here</div>
</AnimatedContainer>`}
                </pre>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">With Variants</h4>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`<AnimatedContainer
  title="Primary Container"
  variant="primary"
  defaultOpen={true}
>
  <div>Primary themed content</div>
</AnimatedContainer>`}
                </pre>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Custom Styling</h4>
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
{`<AnimatedContainer
  title="Custom Container"
  className="border-2 border-blue-200"
  headerClassName="bg-blue-50"
  contentClassName="bg-blue-25"
>
  <div>Custom styled content</div>
</AnimatedContainer>`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
