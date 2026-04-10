CREATE DATABASE QL_CuaHangHoaQua;
GO

USE QL_CuaHangHoaQua;
GO

CREATE TABLE PhanQuyen (
    MaQuyen INT IDENTITY(1,1) PRIMARY KEY,
    TenQuyen NVARCHAR(50),
    MoTa NVARCHAR(200)
);
GO

CREATE TABLE LoaiSanPham (
    MaLoai INT IDENTITY(1,1) PRIMARY KEY,
    TenLoai NVARCHAR(100),
    MoTa NVARCHAR(200)
);
GO

CREATE TABLE NhaCungCap (
    MaNhaCungCap INT IDENTITY(1,1) PRIMARY KEY,
    TenNhaCungCap NVARCHAR(100),
    SoDienThoai NVARCHAR(15),
    DiaChi NVARCHAR(200),
    Email NVARCHAR(100)
);
GO

CREATE TABLE TaiKhoan (
    MaTaiKhoan INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(50) UNIQUE,
    MatKhau NVARCHAR(100),
    MaQuyen INT,
    TrangThai BIT,

    FOREIGN KEY (MaQuyen) REFERENCES PhanQuyen(MaQuyen)
);
GO

CREATE TABLE KhachHang (
    MaKhachHang INT IDENTITY(1,1) PRIMARY KEY,
    TenKhachHang NVARCHAR(100),
    SoDienThoai NVARCHAR(15),
    DiaChi NVARCHAR(200),
    Email NVARCHAR(100),
    MaTaiKhoan INT,

    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);
GO

CREATE TABLE NhanVien (
    MaNhanVien INT IDENTITY(1,1) PRIMARY KEY,
    TenNhanVien NVARCHAR(100),
    NgaySinh DATE,
    SoDienThoai NVARCHAR(15),
    DiaChi NVARCHAR(200),
    MaTaiKhoan INT,

    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);
GO

CREATE TABLE SanPham (
    MaSanPham INT IDENTITY(1,1) PRIMARY KEY,
    TenSanPham NVARCHAR(100),
    MaLoai INT,
    GiaBan FLOAT,
    SoLuong INT,
    HinhAnh NVARCHAR(200),
    MoTa NVARCHAR(200),

    FOREIGN KEY (MaLoai) REFERENCES LoaiSanPham(MaLoai)
);
GO

CREATE TABLE DonNhap (
    MaDonNhap INT IDENTITY(1,1) PRIMARY KEY,
    NgayNhap DATE,
    MaNhanVien INT,
    MaNhaCungCap INT,
    TongTien FLOAT,

    FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien),
    FOREIGN KEY (MaNhaCungCap) REFERENCES NhaCungCap(MaNhaCungCap)
);
GO

CREATE TABLE DonXuat (
    MaDonXuat INT IDENTITY(1,1) PRIMARY KEY,
    NgayXuat DATE,
    MaNhanVien INT,
    MaKhachHang INT,
    TongTien FLOAT,

    FOREIGN KEY (MaNhanVien) REFERENCES NhanVien(MaNhanVien),
    FOREIGN KEY (MaKhachHang) REFERENCES KhachHang(MaKhachHang)
);
GO

CREATE TABLE ChiTietDonNhap (
    MaCTNhap INT IDENTITY(1,1) PRIMARY KEY,
    MaDonNhap INT,
    MaSanPham INT,
    SoLuong INT,
    GiaNhap FLOAT,

    FOREIGN KEY (MaDonNhap) REFERENCES DonNhap(MaDonNhap),
    FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);
GO

CREATE TABLE ChiTietDonXuat (
    MaCTXuat INT IDENTITY(1,1) PRIMARY KEY,
    MaDonXuat INT,
    MaSanPham INT,
    SoLuong INT,
    GiaBan FLOAT,

    FOREIGN KEY (MaDonXuat) REFERENCES DonXuat(MaDonXuat),
    FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
);
GO

CREATE TABLE MaGiamGia (
    MaGiamGia INT IDENTITY(1,1) PRIMARY KEY,
    TenMa NVARCHAR(50) NOT NULL,
    PhanTramGiam INT,
    NgayKetThuc DATE,
    MaLoai INT,

    FOREIGN KEY (MaLoai) REFERENCES LoaiSanPham(MaLoai)
);
GO

INSERT INTO PhanQuyen (TenQuyen, MoTa)
VALUES 
(N'Admin', N'Quản trị hệ thống'),
(N'Nhân viên', N'Quản lý bán hàng');

INSERT INTO LoaiSanPham (TenLoai, MoTa)
VALUES 
(N'Trái cây nội địa', N'Trái cây Việt Nam'),
(N'Trái cây nhập khẩu', N'Hàng nhập khẩu');

INSERT INTO NhaCungCap (TenNhaCungCap, SoDienThoai, DiaChi, Email)
VALUES 
(N'Công ty Hoa Quả Miền Bắc', '0123456789', N'Hà Nội', 'mienbac@gmail.com'),
(N'Fruit Import Co.', '0987654321', N'HCM', 'import@gmail.com');

INSERT INTO TaiKhoan (TenDangNhap, MatKhau, MaQuyen, TrangThai)
VALUES 
('admin', '123456', 1, 1),
('nhanvien1', '123456', 2, 1);

INSERT INTO KhachHang (TenKhachHang, SoDienThoai, DiaChi, Email, MaTaiKhoan)
VALUES 
(N'Nguyễn Văn A', '0911111111', N'Hà Nội', 'a@gmail.com', NULL),
(N'Trần Thị B', '0922222222', N'Hải Phòng', 'b@gmail.com', NULL);

-- Thêm Nhân viên
INSERT INTO NhanVien (TenNhanVien, NgaySinh, SoDienThoai, DiaChi, MaTaiKhoan)
VALUES 
(N'Nguyễn Văn An', '1990-05-15', '0901234567', N'123 Lê Lợi, Q1, TP.HCM', 1),
(N'Trần Thị Bình', '1995-08-20', '0912345678', N'456 Nguyễn Huệ, Q1, TP.HCM', 2);
GO

-- Thêm Sản phẩm với hình ảnh
INSERT INTO SanPham (TenSanPham, MaLoai, GiaBan, SoLuong, HinhAnh, MoTa)
VALUES 
-- Đồ dùng nhà bếp
(N'Bộ dao nhà bếp 5 món', 1, 450000, 100, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400', N'Bộ dao inox cao cấp'),
(N'Chảo chống dính 28cm', 1, 350000, 80, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400', N'Chảo chống dính cao cấp'),
(N'Bộ nồi inox 3 đáy', 1, 1250000, 40, 'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f6?w=400', N'Bộ 3 nồi inox cao cấp'),
(N'Thớt gỗ cao cấp', 1, 180000, 120, 'https://images.unsplash.com/photo-1594135595126-0e4a8d9b5b6d?w=400', N'Thớt gỗ tự nhiên'),
-- Đồ gia dụng điện
(N'Máy xay sinh tố Philips', 2, 1450000, 50, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', N'Máy xay 600W, 2L'),
(N'Nồi cơm điện Sharp 1.8L', 2, 1890000, 30, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', N'Nồi cơm công nghệ Nhật'),
(N'Quạt điện Panasonic', 2, 650000, 45, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', N'Quạt 5 cánh, 3 tốc độ'),
(N'Bàn ủi hơi nước Philips', 2, 850000, 25, 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400', N'Bàn ủi 2400W'),
(N'Ấm đun nước siêu tốc', 2, 450000, 60, 'https://images.unsplash.com/photo-1563822249366-3effc1c0c2d7?w=400', N'Ấm 1.7L tự động ngắt'),
(N'Máy hút bụi cầm tay', 2, 1950000, 20, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', N'Máy hút bụi không dây'),
(N'Ghế sofa 3 chỗ ngồi', 1, 8500000, 10, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', N'Sofa bọc vải cao cấp'),
(N'Bàn làm việc gỗ', 1, 2200000, 15, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400', N'Bàn 120x60cm có ngăn kéo'),
(N'Tủ quần áo 3 cánh', 1, 5500000, 8, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400', N'Tủ gỗ MDF cao cấp'),
(N'Kệ sách 5 tầng', 1, 1800000, 12, 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400', N'Kệ gỗ công nghiệp'),
(N'Bộ sen tắm cao cấp', 2, 1250000, 30, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400', N'Sen inox 304'),
(N'Gương phòng tắm LED', 2, 950000, 25, 'https://images.unsplash.com/photo-1625122498859-4dbd1d9b7f88?w=400', N'Gương 60x80cm có đèn'),
(N'Đèn ngủ để bàn', 2, 350000, 50, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400', N'Đèn LED ánh sáng ấm'),
(N'Tranh treo tường canvas', 1, 450000, 40, 'https://images.unsplash.com/photo-1582037928769-181f2644ecb7?w=400', N'Tranh 40x60cm'),
(N'Bình hoa gốm sứ', 1, 280000, 60, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400', N'Bình gốm Bát Tràng'),
(N'Đồng hồ treo tường', 2, 550000, 35, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400', N'Đồng hồ kim trôi 30cm');
GO

-- Thêm Mã giảm giá
INSERT INTO MaGiamGia (TenMa, PhanTramGiam, NgayKetThuc, MaLoai)
VALUES 
(N'SUMMER2024', 10, '2024-08-31', 1),
(N'NEWCUSTOMER', 15, '2024-12-31', 2),
(N'FLASH50', 50, '2024-07-15', 1);
GO

-- Thêm Đơn nhập
INSERT INTO DonNhap (NgayNhap, MaNhanVien, MaNhaCungCap, TongTien)
VALUES 
('2024-01-15', 1, 1, 50000000),
('2024-02-20', 1, 2, 35000000),
('2024-03-10', 2, 1, 45000000);
GO

-- Thêm Chi tiết đơn nhập
INSERT INTO ChiTietDonNhap (MaDonNhap, MaSanPham, SoLuong, GiaNhap)
VALUES 
(1, 1, 50, 350000),
(1, 2, 30, 280000),
(2, 5, 50, 1200000),
(2, 6, 30, 1600000),
(3, 11, 10, 7000000),
(3, 12, 15, 1800000);
GO

-- Thêm Đơn xuất
INSERT INTO DonXuat (NgayXuat, MaNhanVien, MaKhachHang, TongTien)
VALUES 
('2024-04-01', 2, 1, 3340000),
('2024-04-02', 2, 2, 2100000),
('2024-04-03', 2, 1, 9150000);
GO

-- Thêm Chi tiết đơn xuất
INSERT INTO ChiTietDonXuat (MaDonXuat, MaSanPham, SoLuong, GiaBan)
VALUES 
(1, 5, 2, 1450000),
(1, 1, 1, 450000),
(2, 7, 2, 650000),
(2, 9, 2, 450000),
(3, 11, 1, 8500000),
(3, 7, 1, 650000);
GO


SELECT 'Phân quyền' as N'Bảng', COUNT(*) as N'Số lượng' FROM PhanQuyen
UNION ALL SELECT N'Tài khoản', COUNT(*) FROM TaiKhoan
UNION ALL SELECT N'Nhân viên', COUNT(*) FROM NhanVien
UNION ALL SELECT N'Loại sản phẩm', COUNT(*) FROM LoaiSanPham
UNION ALL SELECT N'Sản phẩm', COUNT(*) FROM SanPham
UNION ALL SELECT N'Khách hàng', COUNT(*) FROM KhachHang
UNION ALL SELECT N'Nhà cung cấp', COUNT(*) FROM NhaCungCap
UNION ALL SELECT N'Mã giảm giá', COUNT(*) FROM MaGiamGia
UNION ALL SELECT N'Đơn nhập', COUNT(*) FROM DonNhap
UNION ALL SELECT N'Chi tiết đơn nhập', COUNT(*) FROM ChiTietDonNhap
UNION ALL SELECT N'Đơn xuất', COUNT(*) FROM DonXuat
UNION ALL SELECT N'Chi tiết đơn xuất', COUNT(*) FROM ChiTietDonXuat;

-- Hiển thị một số sản phẩm
SELECT TOP 5 MaSanPham, TenSanPham, GiaBan, SoLuong FROM SanPham;
