namespace QLCuaHangDoGiaDung.Models
{
    public class ThongBao
    {
        public int MaThongBao { get; set; }
        public int MaKhachHang { get; set; }
        public int? MaDonXuat { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public string Loai { get; set; } = string.Empty;
        public bool DaDoc { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
