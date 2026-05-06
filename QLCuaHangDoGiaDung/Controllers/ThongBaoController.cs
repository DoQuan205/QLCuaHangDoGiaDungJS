using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongBaoController : ControllerBase
    {
        private readonly ThongBao_BLL bll;

        public ThongBaoController(ThongBao_BLL _bll)
        {
            bll = _bll;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(bll.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var data = bll.GetById(id);
            if (data == null)
                return NotFound();

            return Ok(data);
        }

        [HttpGet("KhachHang/{maKhachHang}")]
        public IActionResult GetByMaKhachHang(int maKhachHang)
        {
            return Ok(bll.GetByMaKhachHang(maKhachHang));
        }

        [HttpPost]
        public IActionResult Create(ThongBao tb)
        {
            if (!bll.Insert(tb))
                return BadRequest(new { message = "Dữ liệu thông báo không hợp lệ" });

            return Ok(tb);
        }

        [HttpPut("{id}/read")]
        public IActionResult MarkAsRead(int id)
        {
            if (!bll.MarkAsRead(id))
                return BadRequest(new { message = "Không thể cập nhật trạng thái đã đọc" });

            return Ok(new { message = "Đã đánh dấu đã đọc" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!bll.Delete(id))
                return BadRequest(new { message = "Không thể xóa thông báo" });

            return Ok(new { message = "Xóa thành công" });
        }
    }
}
