import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const API_URL = 'http://localhost/DukaPro%20-%20Soko%20Manager/backend/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/auth.php`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.loggedIn && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // On initial load, check if the user is already authenticated via session.
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth.php`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Invalid credentials or server error.');
      }

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
      throw new Error(data.message || 'Login failed.');
    } catch (error) {
      console.error('Login request failed:', error);
      // Re-throw the error to be caught by the calling component (LoginForm)
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    fetch(`${API_URL}/auth.php`, {
      method: 'DELETE',
      credentials: 'include',
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
