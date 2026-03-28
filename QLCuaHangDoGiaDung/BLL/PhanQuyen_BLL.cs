using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class PhanQuyen_BLL
    {
        private readonly PhanQuyen_DAL dal;

        public PhanQuyen_BLL(PhanQuyen_DAL _dal)
        {
            dal = _dal;
        }

        public List<PhanQuyen> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(PhanQuyen pq)
        {
            if (string.IsNullOrEmpty(pq.TenQuyen))
                return false;

            return dal.Insert(pq);
        }

        public bool Update(PhanQuyen pq)
        {
            if (pq.MaQuyen <= 0)
                return false;

            return dal.Update(pq);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public PhanQuyen GetById(int ma)
        {
            return dal.GetById(ma);
        }
    }
}