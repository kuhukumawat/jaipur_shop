import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        document.cookie = 'auth-token=; Max-Age=0; path=/'
        document.cookie = 'user-role=; Max-Age=0; path=/'
        window.location.href = '/login'
      }
    }
    return Promise.reject(new Error(error.response?.data?.message || error.message || 'Something went wrong'))
  }
)

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data: any) => api.put('/auth/me', data),
  changePassword: (data: any) => api.put('/auth/me/password', data),
}

export const productAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
}

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data: FormData) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}

export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (productId: string, quantity: number) => api.post('/cart/items', { productId, quantity }),
  updateItem: (productId: string, quantity: number) => api.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId: string) => api.delete(`/cart/items/${productId}`),
  clear: () => api.delete('/cart'),
}

export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: (params?: any) => api.get('/orders', { params }),
  getAllOrders: (params?: any) => api.get('/orders/admin/all', { params }),
  getStats: () => api.get('/orders/admin/stats'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
  updatePayment: (id: string, paymentStatus: string) => api.put(`/orders/${id}/payment`, { paymentStatus }),
}

export const inventoryAPI = {
  getOverview: () => api.get('/inventory'),
  getLowStock: () => api.get('/inventory/low-stock'),
  getTransactions: (params?: any) => api.get('/inventory/transactions', { params }),
  adjustStock: (data: any) => api.post('/inventory/adjust', data),
}

export const reportAPI = {
  downloadInventoryExcel: () => api.get('/reports/inventory/excel', { responseType: 'blob' }),
  downloadOrdersExcel: (params?: any) => api.get('/reports/orders/excel', { params, responseType: 'blob' }),
}

export const userAPI = {
  getAll: (params?: any) => api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role }),
  updateStatus: (id: string, isActive: boolean) => api.put(`/users/${id}/status`, { isActive }),
  delete: (id: string) => api.delete(`/users/${id}`),
}

export const invoiceAPI = {
  previewUrl: (orderId: string) => `${API_URL}/invoices/${orderId}/preview`,
}

export default api
