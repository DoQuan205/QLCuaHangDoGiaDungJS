using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class ChiTietDonNhap_BLL
    {
        private readonly ChiTietDonNhap_DAL dal;

        public ChiTietDonNhap_BLL(ChiTietDonNhap_DAL _dal)
        {
            dal = _dal;
        }

        public List<ChiTietDonNhap> GetAll()
        {
            return dal.GetAll();
        }

        public List<ChiTietDonNhap> GetByMaDonNhap(int maDonNhap)
        {
            return dal.GetByMaDonNhap(maDonNhap);
        }

        public bool Insert(ChiTietDonNhap ct)
        {
            if (ct.MaDonNhap <= 0 || ct.MaSanPham <= 0)
                return false;

            if (ct.SoLuong <= 0 || ct.GiaNhap <= 0)
                return false;

            return dal.Insert(ct);
        }

        public bool Update(ChiTietDonNhap ct)
        {
            if (ct.MaCTNhap <= 0)
                return false;

            return dal.Update(ct);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public bool DeleteByMaDonNhap(int maDonNhap)
        {
            if (maDonNhap <= 0)
                return false;

            return dal.DeleteByMaDonNhap(maDonNhap);
        }

        public ChiTietDonNhap GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}
