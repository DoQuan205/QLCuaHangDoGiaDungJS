using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class SanPham_BLL
    {
        private readonly SanPham_DAL dal;

        public SanPham_BLL(SanPham_DAL _dal)
        {
            dal = _dal;
        }

        public List<SanPham> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(SanPham sp)
        {
            if (string.IsNullOrEmpty(sp.TenSanPham))
                return false;

            if (sp.GiaBan <= 0 || sp.SoLuong < 0)
                return false;

            return dal.Insert(sp);
        }

        public bool Update(SanPham sp)
        {
            if (sp.MaSanPham <= 0)
                return false;

            if (string.IsNullOrWhiteSpace(sp.TenSanPham))
                return false;

            if (sp.GiaBan <= 0 || sp.SoLuong < 0 || sp.MaLoai <= 0)
                return false;

            return dal.Update(sp);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public SanPham GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}