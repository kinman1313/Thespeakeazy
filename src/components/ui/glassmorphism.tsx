import { cn } from '@/lib/utils';
import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'heavy';
  blur?: 'low' | 'medium' | 'high';
  border?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const GlassPanel = ({
  children,
  className,
  intensity = 'medium',
  blur = 'medium',
  border = true,
  rounded = 'md',
  ...props
}: GlassPanelProps) => {
  const intensityMap = {
    light: 'bg-opacity-20',
    medium: 'bg-opacity-30',
    heavy: 'bg-opacity-50'
  };

  const blurMap = {
    low: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    high: 'backdrop-blur-xl'
  };

  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-900',
        intensityMap[intensity],
        blurMap[blur],
        roundedMap[rounded],
        border && 'border border-white/20 dark:border-gray-800/30',
        'shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const GlassInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { containerClassName?: string }
>(({ className, containerClassName, ...props }, ref) => {
  return (
    <div className={cn('relative', containerClassName)}>
      <input
        className={cn(
          'w-full bg-white/20 dark:bg-gray-900/20 backdrop-blur-md',
          'border border-white/20 dark:border-gray-800/30',
          'rounded-md px-4 py-2 text-black dark:text-white',
          'placeholder:text-gray-500 dark:placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          'shadow-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
GlassInput.displayName = 'GlassInput';

export const GlassButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'primary' | 'secondary' | 'danger';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantMap = {
    default: 'bg-white/20 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30',
    primary: 'bg-blue-500/70 hover:bg-blue-500/80 text-white',
    secondary: 'bg-purple-500/70 hover:bg-purple-500/80 text-white',
    danger: 'bg-red-500/70 hover:bg-red-500/80 text-white'
  };

  return (
    <button
      className={cn(
        'backdrop-blur-md rounded-md px-4 py-2',
        'border border-white/20 dark:border-gray-800/30',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        'shadow-sm',
        variantMap[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
GlassButton.displayName = 'GlassButton';
