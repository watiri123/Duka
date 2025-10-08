import React from 'react';
import { cn } from './utils'; // Assuming utils.ts is in the same directory

// Create a simple buttonVariants object to satisfy imports
export const buttonVariants = {
  // This is a dummy object to prevent import errors
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export function Button({ 
  className, 
  children, 
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variantStyles = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  };

  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  const Component = asChild ? 'div' : 'button';

  // Simple version - ignore asChild for now
  return (
    <Component
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
  </Component>
  );
}