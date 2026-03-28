using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhanQuyenController : ControllerBase
    {
        private readonly PhanQuyen_BLL bll;

        public PhanQuyenController(PhanQuyen_BLL _bll)
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
        public IActionResult Create(PhanQuyen pq)
        {
            if (!bll.Insert(pq))
                return BadRequest();

            return Ok("Thêm quyền thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, PhanQuyen pq)
        {
            if (id != pq.MaQuyen)
                return BadRequest();

            if (!bll.Update(pq))
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