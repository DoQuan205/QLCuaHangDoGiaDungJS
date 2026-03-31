using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonXuatController : ControllerBase
    {
        private readonly DonXuat_BLL bll;

        public DonXuatController(DonXuat_BLL _bll)
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
        public IActionResult Create(DonXuat dx)
        {
            if (!bll.Insert(dx))
                return BadRequest();

            return Ok("Thêm đơn xuất thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, DonXuat dx)
        {
            if (id != dx.MaDonXuat)
                return BadRequest();

            if (!bll.Update(dx))
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
