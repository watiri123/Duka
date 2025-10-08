import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
  const variantStyles = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
  };

  return (
    <div 
      className={`relative w-full rounded-lg border p-4 ${variantStyles[variant]} ${className || ''}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className || ''}`} {...props}>{children}</h5>
  );
}

export function AlertDescription({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className || ''}`} {...props}>
      {children}
    </div>
  );
}