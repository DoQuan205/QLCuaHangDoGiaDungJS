using DAL;
using QLCuaHangDoGiaDung.Models;

namespace BLL
{
    public class LoaiSanPham_BLL
    {
        private readonly LoaiSanPham_DAL dal;

        public LoaiSanPham_BLL(LoaiSanPham_DAL _dal)
        {
            dal = _dal;
        }

        // 🔹 Lấy danh sách
        public List<LoaiSanPham> GetAll()
        {
            return dal.GetAll();
        }

        // 🔹 Thêm
        public bool Insert(LoaiSanPham lsp)
        {
            if (string.IsNullOrEmpty(lsp.TenLoai))
                return false;

            if (lsp.TenLoai.Length > 100)
                return false;

            return dal.Insert(lsp);
        }

        // 🔹 Sửa
        public bool Update(LoaiSanPham lsp)
        {
            if (lsp.MaLoai <= 0)
                return false;

            if (string.IsNullOrEmpty(lsp.TenLoai))
                return false;

            return dal.Update(lsp);
        }

        // 🔹 Xóa
        public bool Delete(int ma)
        {
            if (ma <= 0)
                return false;

            return dal.Delete(ma);
        }

        // 🔹 Lấy theo ID
        public LoaiSanPham GetById(int ma)
        {
            if (ma <= 0)
                return null;

            return dal.GetById(ma);
        }
    }
}