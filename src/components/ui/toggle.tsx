import React from 'react';

interface ToggleProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  pressed = false,
  onPressedChange,
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  className
}: ToggleProps) {
  const handleClick = () => {
    if (!disabled) {
      onPressedChange?.(!pressed);
    }
  };

  const variantStyles = {
    default: pressed 
      ? 'bg-blue-500 text-white hover:bg-blue-600' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    outline: pressed
      ? 'border border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };

  const sizeStyles = {
    default: 'h-10 px-3',
    sm: 'h-9 px-2.5',
    lg: 'h-11 px-5'
  };

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        disabled:pointer-events-none disabled:opacity-50
        ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}
      `}
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={pressed}
    >
      {children}
    </button>
  );
}

// Export for toggle group compatibility
export const toggleVariants = {
  // Dummy export for compatibility
};