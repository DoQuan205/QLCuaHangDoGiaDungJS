using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class KhachHang_BLL
    {
        private readonly KhachHang_DAL dal;

        public KhachHang_BLL(KhachHang_DAL _dal)
        {
            dal = _dal;
        }

        public List<KhachHang> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(KhachHang kh)
        {
            if (string.IsNullOrEmpty(kh.TenKhachHang))
                return false;

            if (string.IsNullOrEmpty(kh.SoDienThoai))
                return false;

            return dal.Insert(kh);
        }

        public bool Update(KhachHang kh)
        {
            if (kh.MaKhachHang <= 0)
                return false;

            return dal.Update(kh);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public KhachHang GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}