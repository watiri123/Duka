const API_BASE = 'http://localhost/backend/api';

// Generic API call function
export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      credentials: 'include' // Important for sessions
    });
    return handleResponse(response);
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

// Handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
};