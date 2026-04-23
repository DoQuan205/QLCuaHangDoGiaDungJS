USE QL_CuaHangDoGiaDung;
GO

IF COL_LENGTH('DonXuat', 'TrangThai') IS NULL
BEGIN
    ALTER TABLE DonXuat
    ADD TrangThai NVARCHAR(20) NOT NULL CONSTRAINT DF_DonXuat_TrangThai DEFAULT N'Đợi';
END
GO

UPDATE DonXuat
SET TrangThai = N'Đã giao'
WHERE TrangThai IS NULL OR LTRIM(RTRIM(TrangThai)) = N'';
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_DonXuat_TrangThai'
)
BEGIN
    ALTER TABLE DonXuat
    ADD CONSTRAINT CK_DonXuat_TrangThai CHECK (TrangThai IN (N'Đợi', N'Đã giao'));
END
GO

SELECT MaDonXuat, NgayXuat, MaKhachHang, TongTien, TrangThai
FROM DonXuat
ORDER BY MaDonXuat;
GO
