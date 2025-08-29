/// <reference types="vite/client" />

export interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_NODE_ENV: string
}

// Function to get the correct API base URL
export const getApiBaseUrl = () => {
  const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_NODE_ENV === 'development';
  
  // In development, use empty string to utilize Vite's proxy
  if (isDevelopment) {
    console.log('🌱 Development mode: Using Vite proxy for API requests');
    return ''; // This will use the Vite proxy defined in vite.config.ts
  }
  
  // In production, use the configured API URL with fallback
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.warn('⚠️  VITE_API_URL environment variable is not set. Using default production URL');
    return 'https://yaatrasarthi.onrender.com';
  }
  
  console.log('🚀 Production mode: Using configured API URL:', apiUrl);
  return apiUrl;
};

// Validate client-side environment
const validateClientEnvironment = () => {
  const isProduction = import.meta.env.PROD;
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (isProduction && !apiUrl) {
    console.warn('⚠️  VITE_API_URL is not set in production environment');
    console.warn('💡 Set VITE_API_URL in your deployment platform (Netlify, Vercel, etc.)');
  }
};

// Run validation
validateClientEnvironment();

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
