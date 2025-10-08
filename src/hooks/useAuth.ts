// Simple version without complex types
export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost/dukapro-backend/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  },

  checkAuth: async () => {
    try {
      const response = await fetch('http://localhost/dukapro-backend/api/auth.php', {
        credentials: 'include'
      });
      return await response.json();
    } catch (error) {
      return { loggedIn: false };
    }
  },

  logout: async () => {
    try {
      await fetch('http://localhost/dukapro-backend/api/auth.php', {
        method: 'DELETE',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};