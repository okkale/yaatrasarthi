import axios from 'axios'
import { getApiBaseUrl } from '../config/api'

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Export specific API functions
interface MonumentParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

export const monumentsAPI = {
  getAll: async (params?: MonumentParams) => {
    try {
      const response = await api.get('/api/monuments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching monuments:', error);
      throw error;
    }
  },
  getById: async (id: string) => {
    try {
      const response = await api.get(`/api/monuments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching monument ${id}:`, error);
      throw error;
    }
  }
}

export const authAPI = {
  login: (credentials: any) => api.post('/api/auth/login', credentials),
  register: (userData: any) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/user/me')
}

export const bookingsAPI = {
  create: (bookingData: any) => api.post('/api/bookings', bookingData),
  getMyBookings: () => api.get('/api/bookings/my-bookings')
}