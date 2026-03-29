using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class DonNhap_BLL
    {
        private readonly DonNhap_DAL dal;

        public DonNhap_BLL(DonNhap_DAL _dal)
        {
            dal = _dal;
        }

        public List<DonNhap> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(DonNhap dn)
        {
            if (dn.MaNhanVien <= 0)
                return false;

            if (dn.TongTien < 0)
                return false;

            return dal.Insert(dn);
        }

        public bool Update(DonNhap dn)
        {
            if (dn.MaDonNhap <= 0)
                return false;

            return dal.Update(dn);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public DonNhap GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}
