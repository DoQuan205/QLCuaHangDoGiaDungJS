import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: () => api.get('/SanPham'),
  getById: (id: number) => api.get(`/SanPham/${id}`),
  create: (data: any) => api.post('/SanPham', data),
  update: (id: number, data: any) => api.put(`/SanPham/${id}`, data),
  delete: (id: number) => api.delete(`/SanPham/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/DonXuat'),
  getById: (id: number) => api.get(`/DonXuat/${id}`),
  create: (data: any) => api.post('/DonXuat', data),
  update: (id: number, data: any) => api.put(`/DonXuat/${id}`, data),
  delete: (id: number) => api.delete(`/DonXuat/${id}`),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get('/KhachHang'),
  getById: (id: number) => api.get(`/KhachHang/${id}`),
  create: (data: any) => api.post('/KhachHang', data),
  update: (id: number, data: any) => api.put(`/KhachHang/${id}`, data),
  delete: (id: number) => api.delete(`/KhachHang/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/NhaCungCap'),
  getById: (id: number) => api.get(`/NhaCungCap/${id}`),
  create: (data: any) => api.post('/NhaCungCap', data),
  update: (id: number, data: any) => api.put(`/NhaCungCap/${id}`, data),
  delete: (id: number) => api.delete(`/NhaCungCap/${id}`),
};

export default api;
