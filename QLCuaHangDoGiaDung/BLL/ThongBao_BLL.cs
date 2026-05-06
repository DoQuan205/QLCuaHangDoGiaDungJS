using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class ThongBao_BLL
    {
        private readonly ThongBao_DAL dal;

        public ThongBao_BLL(ThongBao_DAL _dal)
        {
            dal = _dal;
        }

        public List<ThongBao> GetAll()
        {
            return dal.GetAll();
        }

        public ThongBao GetById(int ma)
        {
            if (ma <= 0)
                return null;

            return dal.GetById(ma);
        }

        public List<ThongBao> GetByMaKhachHang(int maKhachHang)
        {
            if (maKhachHang <= 0)
                return new List<ThongBao>();

            return dal.GetByMaKhachHang(maKhachHang);
        }

        public bool Insert(ThongBao tb)
        {
            if (tb.MaKhachHang <= 0)
                return false;

            if (string.IsNullOrWhiteSpace(tb.TieuDe) || string.IsNullOrWhiteSpace(tb.NoiDung))
                return false;

            return dal.Insert(tb);
        }

        public bool MarkAsRead(int maThongBao)
        {
            if (maThongBao <= 0)
                return false;

            return dal.MarkAsRead(maThongBao);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }
    }
}
