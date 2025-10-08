import React from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'sales', label: 'Sales', icon: '💰' },
    { id: 'debts', label: 'Debts', icon: '📋' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-3 px-2 text-sm transition-colors ${
              activeTab === tab.id
                ? 'text-primary bg-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-xl mb-1">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}