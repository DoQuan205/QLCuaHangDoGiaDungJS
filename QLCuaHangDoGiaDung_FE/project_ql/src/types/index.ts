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
