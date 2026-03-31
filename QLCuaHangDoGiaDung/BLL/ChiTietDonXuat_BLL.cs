using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class ChiTietDonXuat_BLL
    {
        private readonly ChiTietDonXuat_DAL dal;

        public ChiTietDonXuat_BLL(ChiTietDonXuat_DAL _dal)
        {
            dal = _dal;
        }

        public List<ChiTietDonXuat> GetAll()
        {
            return dal.GetAll();
        }

        public List<ChiTietDonXuat> GetByMaDonXuat(int maDonXuat)
        {
            return dal.GetByMaDonXuat(maDonXuat);
        }

        public bool Insert(ChiTietDonXuat ct)
        {
            if (ct.MaDonXuat <= 0 || ct.MaSanPham <= 0)
                return false;

            if (ct.SoLuong <= 0 || ct.GiaBan <= 0)
                return false;

            return dal.Insert(ct);
        }

        public bool Update(ChiTietDonXuat ct)
        {
            if (ct.MaCTXuat <= 0)
                return false;

            return dal.Update(ct);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public bool DeleteByMaDonXuat(int maDonXuat)
        {
            if (maDonXuat <= 0)
                return false;

            return dal.DeleteByMaDonXuat(maDonXuat);
        }

        public ChiTietDonXuat GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}
