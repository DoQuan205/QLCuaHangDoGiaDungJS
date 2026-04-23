using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class DonXuat_BLL
    {
        private readonly DonXuat_DAL dal;

        public DonXuat_BLL(DonXuat_DAL _dal)
        {
            dal = _dal;
        }

        public List<DonXuat> GetAll()
        {
            return dal.GetAll();
        }

        public DonXuat Insert(DonXuat dx)
        {
            if (dx.MaNhanVien <= 0)
                return null;

            if (dx.TongTien < 0)
                return null;

            dx.TrangThai = string.IsNullOrWhiteSpace(dx.TrangThai) ? "Đợi" : dx.TrangThai;
            return dal.Insert(dx);
        }

        public bool Update(DonXuat dx)
        {
            if (dx.MaDonXuat <= 0)
                return false;

            if (dx.MaNhanVien <= 0 || dx.TongTien < 0)
                return false;

            if (!IsValidTrangThai(dx.TrangThai))
                return false;

            return dal.Update(dx);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public DonXuat GetById(int ma)
        {
            return dal.GetById(ma);
        }

        public List<DonXuat> GetByMaKhachHang(int maKhachHang)
        {
            if (maKhachHang <= 0)
                return new List<DonXuat>();

            return dal.GetByMaKhachHang(maKhachHang);
        }

        public bool UpdateStatus(int maDonXuat, string trangThai)
        {
            if (maDonXuat <= 0 || !IsValidTrangThai(trangThai))
                return false;

            return dal.UpdateStatus(maDonXuat, trangThai);
        }

        private bool IsValidTrangThai(string? trangThai)
        {
            return trangThai == "Đợi" || trangThai == "Đã giao";
        }
    }
}
