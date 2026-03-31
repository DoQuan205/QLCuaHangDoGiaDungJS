using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class NhaCungCap_BLL
    {
        private readonly NhaCungCap_DAL dal;

        public NhaCungCap_BLL(NhaCungCap_DAL _dal)
        {
            dal = _dal;
        }

        public List<NhaCungCap> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(NhaCungCap ncc)
        {
            if (string.IsNullOrEmpty(ncc.TenNhaCungCap))
                return false;

            return dal.Insert(ncc);
        }

        public bool Update(NhaCungCap ncc)
        {
            if (ncc.MaNhaCungCap <= 0)
                return false;

            return dal.Update(ncc);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public NhaCungCap GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}
