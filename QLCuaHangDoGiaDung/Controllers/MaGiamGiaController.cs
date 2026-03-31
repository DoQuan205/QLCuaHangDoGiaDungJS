using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaGiamGiaController : ControllerBase
    {
        private readonly MaGiamGia_BLL bll;

        public MaGiamGiaController(MaGiamGia_BLL _bll)
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
        public IActionResult Create(MaGiamGia mgg)
        {
            if (!bll.Insert(mgg))
                return BadRequest();

            return Ok("Thêm mã giảm giá thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, MaGiamGia mgg)
        {
            if (id != mgg.MaMaGiamGia)
                return BadRequest();

            if (!bll.Update(mgg))
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
