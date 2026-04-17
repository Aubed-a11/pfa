import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post('/auth/register', data),
}

// Menu
export const menuApi = {
  getCategories: () => api.get('/menu/categories'),
  getDishes: () => api.get('/menu/dishes'),
  createDish: (data: FormData) => api.post('/menu/dishes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateDish: (id: number, data: object) => api.put(`/menu/dishes/${id}`, data),
  deleteDish: (id: number) => api.delete(`/menu/dishes/${id}`),
  toggleAvailable: (id: number) => api.patch(`/menu/dishes/${id}/toggle`),
}

// Orders
export const orderApi = {
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: { tableNumber: number; items: { dishId: number; quantity: number }[] }) =>
    api.post('/orders', data),
  updateStatus: (id: number, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
}

// Stats
export const statsApi = {
  getSummary: () => api.get('/stats/summary'),
  getRevenue: (period: string) => api.get(`/stats/revenue?period=${period}`),
}

// Users
export const usersApi = {
  getAll: () => api.get('/users'),
  updateRole: (id: number, role: string) => api.patch(`/users/${id}/role`, { role }),
  delete: (id: number) => api.delete(`/users/${id}`),
}
