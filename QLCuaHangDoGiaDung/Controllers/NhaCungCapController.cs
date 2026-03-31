using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhaCungCapController : ControllerBase
    {
        private readonly NhaCungCap_BLL bll;

        public NhaCungCapController(NhaCungCap_BLL _bll)
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
        public IActionResult Create(NhaCungCap ncc)
        {
            if (!bll.Insert(ncc))
                return BadRequest();

            return Ok("Thêm nhà cung cấp thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, NhaCungCap ncc)
        {
            if (id != ncc.MaNhaCungCap)
                return BadRequest();

            if (!bll.Update(ncc))
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
