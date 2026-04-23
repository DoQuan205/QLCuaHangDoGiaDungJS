using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SanPhamController : ControllerBase
    {
        private readonly SanPham_BLL bll;

        public SanPhamController(SanPham_BLL _bll)
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
        public IActionResult Create(SanPham sp)
        {
            if (!bll.Insert(sp))
                return BadRequest();

            return Ok("Thêm sản phẩm thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, SanPham sp)
        {
            var existingProduct = bll.GetById(id);
            if (existingProduct == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm" });

            sp.MaSanPham = id;

            if (!bll.Update(sp))
                return BadRequest(new { message = "Dữ liệu sản phẩm không hợp lệ" });

            return Ok(new { message = "Cập nhật thành công" });
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