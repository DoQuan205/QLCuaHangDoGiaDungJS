USE QL_CuaHangDoGiaDung;
GO

/*
  Script đồng bộ DB hiện tại với backend/frontend cho luồng đơn hàng.
  - Sửa trạng thái DonXuat để khớp backend: Đợi / Đã giao / Đã hủy
  - Không ép chặt toàn bộ NOT NULL cho các bảng khác vì có thể cần dọn dữ liệu trước
*/

-- 1) Đồng bộ cột TrangThai của DonXuat
IF COL_LENGTH('dbo.DonXuat', 'TrangThai') IS NULL
BEGIN
    ALTER TABLE dbo.DonXuat
    ADD TrangThai NVARCHAR(20) NOT NULL
        CONSTRAINT DF_DonXuat_TrangThai DEFAULT (N'Đợi');
END
ELSE
BEGIN
    UPDATE dbo.DonXuat
    SET TrangThai = N'Đợi'
    WHERE TrangThai IS NULL OR LTRIM(RTRIM(TrangThai)) = N'';

    DECLARE @DefaultConstraintName sysname;
    SELECT @DefaultConstraintName = dc.name
    FROM sys.default_constraints dc
    INNER JOIN sys.columns c
        ON c.default_object_id = dc.object_id
    WHERE dc.parent_object_id = OBJECT_ID(N'dbo.DonXuat')
      AND c.name = N'TrangThai';

    IF @DefaultConstraintName IS NOT NULL
    BEGIN
        EXEC(N'ALTER TABLE dbo.DonXuat DROP CONSTRAINT [' + @DefaultConstraintName + ']');
    END

    IF EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID(N'dbo.DonXuat')
          AND name = N'CK_DonXuat_TrangThai'
    )
    BEGIN
        ALTER TABLE dbo.DonXuat DROP CONSTRAINT CK_DonXuat_TrangThai;
    END

    ALTER TABLE dbo.DonXuat
    ALTER COLUMN TrangThai NVARCHAR(20) NOT NULL;

    ALTER TABLE dbo.DonXuat
    ADD CONSTRAINT DF_DonXuat_TrangThai DEFAULT (N'Đợi') FOR TrangThai;
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE parent_object_id = OBJECT_ID(N'dbo.DonXuat')
      AND name = N'CK_DonXuat_TrangThai'
)
BEGIN
    ALTER TABLE dbo.DonXuat
    ADD CONSTRAINT CK_DonXuat_TrangThai
    CHECK (TrangThai IN (N'Đợi', N'Đã giao', N'Đã hủy'));
END
GO

-- 2) Tạo bảng thông báo nếu chưa có
IF OBJECT_ID(N'dbo.ThongBao', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ThongBao (
        MaThongBao INT IDENTITY(1,1) PRIMARY KEY,
        MaKhachHang INT NOT NULL,
        MaDonXuat INT NULL,
        TieuDe NVARCHAR(200) NOT NULL,
        NoiDung NVARCHAR(500) NOT NULL,
        Loai NVARCHAR(50) NOT NULL,
        DaDoc BIT NOT NULL DEFAULT 0,
        NgayTao DATETIME NOT NULL DEFAULT GETDATE(),

        FOREIGN KEY (MaKhachHang) REFERENCES dbo.KhachHang(MaKhachHang),
        FOREIGN KEY (MaDonXuat) REFERENCES dbo.DonXuat(MaDonXuat)
    );
END
GO

-- 3) Kiểm tra nhanh dữ liệu đơn xuất sau khi đồng bộ
SELECT MaDonXuat, NgayXuat, MaKhachHang, TongTien, TrangThai
FROM dbo.DonXuat
ORDER BY MaDonXuat DESC;
GO

/*
  Ghi chú:
  Nếu DB hiện tại đã có dữ liệu KhachHang/DonXuat thì script trên sẽ thêm bảng ThongBao
  mà không ảnh hưởng các bảng đang dùng.
*/

