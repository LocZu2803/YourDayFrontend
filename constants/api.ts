// API Configuration
export const API_BASE_URL = 'http://192.168.0.103:3000/api';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    DELETE_ACCOUNT: '/auth/delete-account',
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    GET: '/tasks/:id',
    UPDATE: '/tasks/:id',
    DELETE: '/tasks/:id',
  },
  HEALTH: '/health',
};

// Helper function to make API calls with proper error handling
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Prepare headers with explicit Content-Type for POST/PUT requests
  const headers: Record<string, string> = {};

  // Add default Content-Type for requests with body
  if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const defaultOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    console.log('API call - URL:', url);
    console.log('API call - Options:', {
      method: defaultOptions.method,
      headers: defaultOptions.headers,
      bodyLength: defaultOptions.body ? (typeof defaultOptions.body === 'string' ? defaultOptions.body.length : 'stream') : 0,
      body: defaultOptions.body && typeof defaultOptions.body === 'string' ? JSON.parse(defaultOptions.body) : null,
    });

    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    console.log('API call - Response status:', response.status);
    console.log('API call - Response data:', data);

    if (!response.ok) {
      console.error('API call - Full error response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
      });
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};