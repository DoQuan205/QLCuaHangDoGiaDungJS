using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class TaiKhoan_BLL
    {
        private readonly TaiKhoan_DAL dal;

        public TaiKhoan_BLL(TaiKhoan_DAL _dal)
        {
            dal = _dal;
        }

        public List<TaiKhoan> GetAll()
        {
            return dal.GetAll();
        }

        public bool Insert(TaiKhoan tk)
        {
            if (string.IsNullOrWhiteSpace(tk.TenDangNhap) || string.IsNullOrWhiteSpace(tk.MatKhau))
                return false;

            tk.TenDangNhap = tk.TenDangNhap.Trim();
            return dal.Insert(tk);
        }

        public int InsertAndGetId(TaiKhoan tk)
        {
            if (string.IsNullOrWhiteSpace(tk.TenDangNhap) || string.IsNullOrWhiteSpace(tk.MatKhau))
                return 0;

            tk.TenDangNhap = tk.TenDangNhap.Trim();
            return dal.InsertAndGetId(tk);
        }

        public bool Update(TaiKhoan tk)
        {
            if (tk.MaTaiKhoan <= 0)
                return false;

            return dal.Update(tk);
        }

        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        public TaiKhoan GetById(int ma)
        {
            return dal.GetById(ma);
        }

        public TaiKhoan Login(string user, string pass)
        {
            return dal.Login(user, pass);
        }
    }
}