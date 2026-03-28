using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhachHangController : ControllerBase
    {
        private readonly KhachHang_BLL bll;

        public KhachHangController(KhachHang_BLL _bll)
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

        [HttpPost]
        public IActionResult Create(KhachHang kh)
        {
            if (!bll.Insert(kh))
                return BadRequest("Dữ liệu không hợp lệ");

            return Ok("Thêm khách hàng thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, KhachHang kh)
        {
            if (id != kh.MaKhachHang)
                return BadRequest();

            if (!bll.Update(kh))
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