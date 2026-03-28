using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiSanPhamController : ControllerBase
    {
        private readonly LoaiSanPham_BLL bll;

        public LoaiSanPhamController(LoaiSanPham_BLL _bll)
        {
            bll = _bll;
        }

        // 🔹 GET: api/LoaiSanPham
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = bll.GetAll();
            return Ok(data);
        }

        // 🔹 GET: api/LoaiSanPham/5
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var data = bll.GetById(id);

            if (data == null)
                return NotFound("Không tìm thấy loại sản phẩm");

            return Ok(data);
        }

        // 🔹 POST: api/LoaiSanPham
        [HttpPost]
        public IActionResult Create([FromBody] LoaiSanPham lsp)
        {
            if (!bll.Insert(lsp))
                return BadRequest("Dữ liệu không hợp lệ");

            return Ok("Thêm thành công");
        }

        // 🔹 PUT: api/LoaiSanPham/5
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] LoaiSanPham lsp)
        {
            if (id != lsp.MaLoai)
                return BadRequest("ID không khớp");

            if (!bll.Update(lsp))
                return BadRequest("Cập nhật thất bại");

            return Ok("Cập nhật thành công");
        }

        // 🔹 DELETE: api/LoaiSanPham/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!bll.Delete(id))
                return BadRequest("Xóa thất bại");

            return Ok("Xóa thành công");
        }
    }
}