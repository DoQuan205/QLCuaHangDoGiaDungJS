namespace QLCuaHangDoGiaDung.Models
{
    public class DonNhap
    {
        public int MaDonNhap { get; set; }
        public DateTime NgayNhap { get; set; }
        public int MaNhanVien { get; set; }
        public int? MaNhaCungCap { get; set; }
        public double TongTien { get; set; }
    }
}
