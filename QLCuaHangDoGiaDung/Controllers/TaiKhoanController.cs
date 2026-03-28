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

        public TaiKhoanController(TaiKhoan_BLL _bll)
        {
            bll = _bll;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(bll.GetAll());
        }

        [HttpPost]
        public IActionResult Create(TaiKhoan tk)
        {
            if (!bll.Insert(tk))
                return BadRequest("Dữ liệu không hợp lệ");

            return Ok("Thêm tài khoản thành công");
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