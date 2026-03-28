using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhanVienController : ControllerBase
    {
        private readonly NhanVien_BLL bll;

        public NhanVienController(NhanVien_BLL _bll)
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
        public IActionResult Create(NhanVien nv)
        {
            if (!bll.Insert(nv))
                return BadRequest("Dữ liệu không hợp lệ");

            return Ok("Thêm nhân viên thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, NhanVien nv)
        {
            if (id != nv.MaNhanVien)
                return BadRequest();

            if (!bll.Update(nv))
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