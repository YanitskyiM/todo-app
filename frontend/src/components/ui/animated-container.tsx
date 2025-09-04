import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AnimatedContainerProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  onToggle?: (isOpen: boolean) => void;
  variant?: 'default' | 'primary' | 'background';
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  title,
  description,
  icon,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  contentClassName,
  onToggle,
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isOpen, children]);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: 'border-primary/20 shadow-sm hover:shadow-md',
          header: 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:from-primary/10 hover:to-primary/15',
          icon: 'text-primary',
          title: 'text-primary font-semibold',
          content: 'bg-gradient-to-b from-primary/3 to-primary/5',
          chevron: 'text-primary/70'
        };
      case 'background':
        return {
          container: 'border-background/30 shadow-sm hover:shadow-md',
          header: 'bg-gradient-to-r from-background/60 to-background/80 border-background/30 hover:from-background/70 hover:to-background/90',
          icon: 'text-foreground/70',
          title: 'text-foreground font-semibold',
          content: 'bg-gradient-to-b from-background/20 to-background/40',
          chevron: 'text-foreground/60'
        };
      default:
        return {
          container: 'border-gray-200 shadow-sm hover:shadow-md',
          header: 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-150',
          icon: 'text-gray-600',
          title: 'text-gray-900 font-semibold',
          content: 'bg-gradient-to-b from-white to-gray-50',
          chevron: 'text-gray-500'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={cn(
      'animated-container border transition-all duration-300 group',
      styles.container,
      className
    )}>
      {/* Header */}
      <div
        className={cn(
          'header flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-200 border-b backdrop-blur-sm',
          styles.header,
          headerClassName
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className={cn(
              'flex-shrink-0 p-2 rounded-lg bg-white/50 shadow-sm',
              styles.icon
            )}>
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className={cn('text-lg font-semibold tracking-tight', styles.title)}>
              {title}
            </h3>
            {description && (
              <p className={cn(
                'text-sm mt-1 transition-all duration-200',
                isOpen 
                  ? 'text-gray-600 opacity-100 translate-y-0' 
                  : 'text-gray-500 opacity-0 -translate-y-1 pointer-events-none'
              )}>
                {description}
              </p>
            )}
          </div>
        </div>
        <div className={cn(
          'flex-shrink-0 p-2 rounded-lg bg-white/50 shadow-sm transition-all duration-200 group-hover:scale-105',
          styles.chevron
        )}>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          'content overflow-hidden transition-all duration-300 ease-in-out',
          styles.content
        )}
        style={{
          height: height === 'auto' ? 'auto' : `${height}px`,
        }}
      >
        <div
          ref={contentRef}
          className={cn('px-6 py-5', contentClassName)}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
