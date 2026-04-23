export interface Product {
  maSanPham: number;
  tenSanPham: string;
  maLoai: number;
  giaBan: number;
  soLuong: number;
  hinhAnh: string;
  moTa: string;
}

export interface Order {
  maDonXuat: number;
  ngayXuat: string;
  maNhanVien: number;
  maKhachHang?: number;
  tongTien: number;
  trangThai: 'Đợi' | 'Đã giao';
}

export interface OrderDetail {
  maCTXuat: number;
  maDonXuat: number;
  maSanPham: number;
  soLuong: number;
  giaBan: number;
}

export interface Customer {
  maKhachHang: number;
  tenKhachHang: string;
  soDienThoai: string;
  diaChi: string;
  email: string;
}

export interface Supplier {
  maNhaCungCap: number;
  tenNhaCungCap: string;
  soDienThoai: string;
  diaChi: string;
  email: string;
}

export interface Category {
  maLoai: number;
  tenLoai: string;
  moTa: string;
}

export interface User {
  maTaiKhoan?: number;
  tenDangNhap: string;
  matKhau?: string;
  maQuyen?: number;
  trangThai?: boolean;
  role?: 'admin' | 'staff' | 'customer';
  fullName?: string;
}
