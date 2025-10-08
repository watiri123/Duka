import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { Products } from './components/Products';
import { Sales } from './components/Sales';
import { Debts } from './components/Debts';
import { BottomNav } from './components/BottomNav';
import { useAuth, AuthProvider } from './hooks/useAuth.tsx';

interface SalesProps {
  user: { id: number; username: string; name: string };
}

interface ProductsProps {
  user: { id: number; username: string; name: string };
}

function AppContent() {
  const { user, login, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products user={user} />;
      case 'sales':
        return <Sales user={user} />;
      case 'debts':
        return <Debts user={user} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">DukaPro - Soko Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Hello, {user.name}</span>
            <button
              onClick={logout}
              className="text-sm bg-destructive text-destructive-foreground px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {renderActiveTab()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
