import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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
export const monumentsAPI = {
  getAll: (params?: any) => api.get('/api/monuments', { params }),
  getById: (id: string) => api.get(`/api/monuments/${id}`)
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