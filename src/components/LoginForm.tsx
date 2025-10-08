import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { LockKeyholeIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown login error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <LockKeyholeIcon className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">DukaPro Login</CardTitle>
          </div>
          <CardDescription>Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-end">
              <Button variant="link" type="button" className="p-0 h-auto text-sm font-semibold">
                Forgot Password?
              </Button>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-200 hover:bg-green-300 !text-black font-semibold border border-green-300 shadow-sm"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo Credentials:</p>
            <p>Username: <strong>admin</strong></p>
            <p>Password: <strong>admin123</strong></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Example implementation of useAuth hook
export function useAuth() {
  // Add your authentication logic here
  return {
    login: async (username: string, password: string) => {
      // Simulate login logic
      return username === 'admin' && password === 'admin123';
    },
  };
}