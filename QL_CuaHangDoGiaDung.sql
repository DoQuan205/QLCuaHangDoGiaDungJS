CREATE DATABASE QL_CuaHangHoaQua;
GO

USE QL_CuaHangHoaQua;
GO

CREATE TABLE PhanQuyen (
    MaQuyen INT IDENTITY(1,1) PRIMARY KEY,
    TenQuyen NVARCHAR(50),
    MoTa NVARCHAR(200)
);

CREATE TABLE TaiKhoan (
    MaTaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE,
    MatKhau NVARCHAR(100),
    MaQuyen INT,
    TrangThai BIT,

    FOREIGN KEY (MaQuyen) REFERENCES PhanQuyen(MaQuyen)
);

CREATE TABLE NhanVien (
    MaNhanVien INT IDENTITY(1,1) PRIMARY KEY,
    TenNhanVien NVARCHAR(100),
    NgaySinh DATE,
    SoDienThoai NVARCHAR(15),
    DiaChi NVARCHAR(200),
    MaTaiKhoan INT,

    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

CREATE TABLE SanPham
(
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
    TenSanPham NVARCHAR(100),
    MaLoai INT,
    GiaBan FLOAT,
    SoLuong INT,
    HinhAnh NVARCHAR(200),
    MoTa NVARCHAR(200),

    FOREIGN KEY (MaLoai) REFERENCES LoaiSanPham(MaLoai)
)

CREATE TABLE LoaiSanPham
(
    MaLoai INT IDENTITY(1,1) PRIMARY KEY,
    TenLoai NVARCHAR(100),
    MoTa NVARCHAR(200)
)

CREATE TABLE KhachHang
(
    MaKhachHang INT IDENTITY(1,1) PRIMARY KEY,
    TenKhachHang NVARCHAR(100),
    SoDienThoai NVARCHAR(15),
    DiaChi NVARCHAR(200),
    Email NVARCHAR(100)
)

CREATE TABLE NhaCungCap
(
    MaNhaCungCap INT IDENTITY(1,1) PRIMARY KEY,
    TenNhaCungCap NVARCHAR(100),
    SoDienThoai NVARCHAR(15),
    DiaChi NVARCHAR(200),
    Email NVARCHAR(100)
)

CREATE TABLE DonNhap
(
    MaDonNhap INT IDENTITY(1,1) PRIMARY KEY,
    NgayNhap DATE,
    MaNhanVien INT,
    TongTien FLOAT,

    FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
)

CREATE TABLE ChiTietDonNhap
(
    MaCTNhap INT IDENTITY(1,1) PRIMARY KEY,
    MaDonNhap INT,
    MaSanPham INT,
    SoLuong INT,
    GiaNhap FLOAT,

    FOREIGN KEY (MaDonNhap) REFERENCES DonNhap(MaDonNhap),
    FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
)

CREATE TABLE DonXuat
(
    MaDonXuat INT IDENTITY(1,1) PRIMARY KEY,
    NgayXuat DATE,
    MaNhanVien INT,
    TongTien FLOAT,

    FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien)
)

CREATE TABLE ChiTietDonXuat
(
    MaCTXuat INT IDENTITY(1,1) PRIMARY KEY,
    MaDonXuat INT,
    MaSanPham INT,
    SoLuong INT,
    GiaBan FLOAT,

    FOREIGN KEY (MaDonXuat) REFERENCES DonXuat(MaDonXuat),
    FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
)

ALTER TABLE DonNhap
ADD MaNhaCungCap INT

ALTER TABLE DonNhap
ADD FOREIGN KEY (MaNhaCungCap) REFERENCES NhaCungCap(MaNhaCungCap)

ALTER TABLE DonXuat
ADD MaKhachHang INT

ALTER TABLE DonXuat
ADD FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang)

ALTER TABLE KhachHang
ADD MaTaiKhoan INT

ALTER TABLE KhachHang
ADD FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)

CREATE TABLE MaGiamGia
(
    MaGiamGia INT IDENTITY(1,1) PRIMARY KEY,
    TenMa NVARCHAR(50) NOT NULL,
    PhanTramGiam INT, 
    NgayKetThuc DATE,
    MaLoai INT,

    CONSTRAINT FK_MaGiamGia_LoaiSanPham
    FOREIGN KEY (MaLoai) REFERENCES LoaiSanPham(MaLoai)
);