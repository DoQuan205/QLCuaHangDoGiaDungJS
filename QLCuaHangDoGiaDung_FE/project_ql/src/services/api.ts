import axios from 'axios/dist/browser/axios.cjs';

const API_BASE_URL = 'https://localhost:7172/api';

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

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/TaiKhoan/login', { tenDangNhap: username, matKhau: password }),
  register: (data: any) => api.post('/TaiKhoan', data),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/DonXuat'),
  getById: (id: number) => api.get(`/DonXuat/${id}`),
  getByCustomerId: (customerId: number) => api.get(`/DonXuat/KhachHang/${customerId}`),
  create: (data: any) => api.post('/DonXuat', data),
  update: (id: number, data: any) => api.put(`/DonXuat/${id}`, data),
  updateStatus: (id: number, trangThai: 'Đợi' | 'Đã giao') => api.put(`/DonXuat/${id}/status`, { trangThai }),
  delete: (id: number) => api.delete(`/DonXuat/${id}`),
};

export const orderDetailsAPI = {
  getAll: () => api.get('/ChiTietDonXuat'),
  getByOrderId: (orderId: number) => api.get(`/ChiTietDonXuat/DonXuat/${orderId}`),
  create: (data: any) => api.post('/ChiTietDonXuat', data),
  delete: (id: number) => api.delete(`/ChiTietDonXuat/${id}`),
  deleteByOrderId: (orderId: number) => api.delete(`/ChiTietDonXuat/DonXuat/${orderId}`),
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

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/LoaiSanPham'),
  getById: (id: number) => api.get(`/LoaiSanPham/${id}`),
  create: (data: any) => api.post('/LoaiSanPham', data),
  update: (id: number, data: any) => api.put(`/LoaiSanPham/${id}`, data),
  delete: (id: number) => api.delete(`/LoaiSanPham/${id}`),
};

export default api;
