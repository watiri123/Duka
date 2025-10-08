import React from 'react';
import { Button } from './button';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

// Simple sidebar implementation
export function Sidebar({ children, className }: SidebarProps) {
  return (
    <div className={`w-64 bg-gray-50 border-r border-gray-200 ${className || ''}`}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={`p-4 ${className || ''}`}>
      {children}
    </div>
  );
}

export function SidebarGroup({ children, className }: SidebarGroupProps) {
  return (
    <div className={`mb-6 ${className || ''}`}>
      {children}
    </div>
  );
}

export function SidebarMenu({ children, className }: SidebarMenuProps) {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      {children}
    </div>
  );
}

export function SidebarMenuItem({ 
  children, 
  isActive = false, 
  onClick,
  className 
}: SidebarMenuItemProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={`w-full justify-start ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

// Export additional components that might be expected
export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-b border-gray-200">{children}</div>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t border-gray-200">{children}</div>;
}

export function SidebarSeparator() {
  return <div className="border-t border-gray-200 my-4" />;
}

export function SidebarTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}>
      Toggle Sidebar
    </Button>
  );
}