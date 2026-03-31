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

        public bool Insert(DonXuat dx)
        {
            if (dx.MaNhanVien <= 0)
                return false;

            if (dx.TongTien < 0)
                return false;

            return dal.Insert(dx);
        }

        public bool Update(DonXuat dx)
        {
            if (dx.MaDonXuat <= 0)
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
    }
}
