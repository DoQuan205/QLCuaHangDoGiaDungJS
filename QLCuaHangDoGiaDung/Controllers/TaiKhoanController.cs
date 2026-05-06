using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaiKhoanController : ControllerBase
    {
        private readonly TaiKhoan_BLL bll;
        private readonly KhachHang_BLL khachHangBll;

        public TaiKhoanController(TaiKhoan_BLL _bll, KhachHang_BLL _khachHangBll)
        {
            bll = _bll;
            khachHangBll = _khachHangBll;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(bll.GetAll());
        }

        [HttpPost]
        public IActionResult Create(TaiKhoan tk)
        {
            if (tk.MaQuyen == 0)
                tk.MaQuyen = 3;

            tk.TrangThai = true;

            var maTaiKhoan = bll.InsertAndGetId(tk);
            if (maTaiKhoan <= 0)
                return BadRequest("Dữ liệu không hợp lệ");

            if (tk.MaQuyen == 3)
            {
                var khachHang = new KhachHang
                {
                    TenKhachHang = string.IsNullOrWhiteSpace(tk.TenKhachHang) ? tk.TenDangNhap : tk.TenKhachHang,
                    SoDienThoai = tk.SoDienThoai ?? string.Empty,
                    DiaChi = tk.DiaChi ?? string.Empty,
                    Email = tk.Email ?? string.Empty,
                    MaTaiKhoan = maTaiKhoan
                };

                if (!khachHangBll.Insert(khachHang))
                    return BadRequest("Tạo tài khoản thành công nhưng không tạo được thông tin khách hàng");
            }

            return Ok(new { message = "Thêm tài khoản thành công", maTaiKhoan });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] TaiKhoan tk)
        {
            var user = bll.Login(tk.TenDangNhap, tk.MatKhau);

            if (user == null)
                return Unauthorized("Sai tài khoản hoặc mật khẩu");

            return Ok(user);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, TaiKhoan tk)
        {
            if (id != tk.MaTaiKhoan)
                return BadRequest();

            if (!bll.Update(tk))
                return BadRequest();

            return Ok("Cập nhật thành công");
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!bll.Delete(id))
                return BadRequest();

            return Ok("Xóa thành công");
        }
    }
}