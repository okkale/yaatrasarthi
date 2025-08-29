/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

// Function to get the correct API base URL
export const getApiBaseUrl = () => {
  // In development, use empty string to utilize Vite's proxy
  // In production, use the full URL
  if (import.meta.env.DEV) {
    return ''; // This will use the Vite proxy defined in vite.config.ts
  }
  return import.meta.env.VITE_API_URL || 'https://yaatrasarthi.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      me: '/api/user/me'
    },
    monuments: '/api/monuments',
    bookings: '/api/bookings'
  }
}

export default API_BASE_URL