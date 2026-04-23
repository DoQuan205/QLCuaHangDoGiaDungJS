namespace QLCuaHangDoGiaDung.Models
{
    public class DonXuat
    {
        public int MaDonXuat { get; set; }
        public DateTime NgayXuat { get; set; }
        public int MaNhanVien { get; set; }
        public int? MaKhachHang { get; set; }
        public double TongTien { get; set; }
        public string TrangThai { get; set; } = "Đợi";
    }
}
