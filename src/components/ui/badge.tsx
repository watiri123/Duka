import React from 'react';

export function Badge({ 
  className, 
  children, 
  variant = 'default',
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}) {
  const variantStyles = {
    default: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    destructive: "bg-red-500 text-white",
    outline: "border border-gray-300 text-gray-700"
  };

  return (
    <div 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}