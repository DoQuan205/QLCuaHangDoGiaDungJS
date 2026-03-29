using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonNhapController : ControllerBase
    {
        private readonly DonNhap_BLL bll;

        public DonNhapController(DonNhap_BLL _bll)
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
        public IActionResult Create(DonNhap dn)
        {
            if (!bll.Insert(dn))
                return BadRequest();

            return Ok("Thêm đơn nhập thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, DonNhap dn)
        {
            if (id != dn.MaDonNhap)
                return BadRequest();

            if (!bll.Update(dn))
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
