using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class MaGiamGia_BLL
    {
        private readonly MaGiamGia_DAL dal;

        public MaGiamGia_BLL(MaGiamGia_DAL _dal)
        {
            dal = _dal;
        }

        public List<MaGiamGia> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(MaGiamGia mgg)
        {
            if (string.IsNullOrEmpty(mgg.TenMa))
                return false;

            if (mgg.PhanTramGiam <= 0 || mgg.PhanTramGiam > 100)
                return false;

            return dal.Insert(mgg);
        }

        public bool Update(MaGiamGia mgg)
        {
            if (mgg.MaMaGiamGia <= 0)
                return false;

            return dal.Update(mgg);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public MaGiamGia GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}
