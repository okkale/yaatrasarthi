/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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