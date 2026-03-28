using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class NhanVien_BLL
    {
        private readonly NhanVien_DAL dal;

        public NhanVien_BLL(NhanVien_DAL _dal)
        {
            dal = _dal;
        }

        public List<NhanVien> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(NhanVien nv)
        {
            if (string.IsNullOrEmpty(nv.TenNhanVien))
                return false;

            if (nv.NgaySinh > DateTime.Now)
                return false;

            return dal.Insert(nv);
        }

        public bool Update(NhanVien nv)
        {
            if (nv.MaNhanVien <= 0)
                return false;

            return dal.Update(nv);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public NhanVien GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}