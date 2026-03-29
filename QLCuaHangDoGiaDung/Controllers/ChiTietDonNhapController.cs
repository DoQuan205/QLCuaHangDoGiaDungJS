using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietDonNhapController : ControllerBase
    {
        private readonly ChiTietDonNhap_BLL bll;

        public ChiTietDonNhapController(ChiTietDonNhap_BLL _bll)
        {
            bll = _bll;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(bll.GetAll());
        }

        [HttpGet("DonNhap/{maDonNhap}")]
        public IActionResult GetByMaDonNhap(int maDonNhap)
        {
            return Ok(bll.GetByMaDonNhap(maDonNhap));
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
        public IActionResult Create(ChiTietDonNhap ct)
        {
            if (!bll.Insert(ct))
                return BadRequest();

            return Ok("Thêm chi tiết đơn nhập thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ChiTietDonNhap ct)
        {
            if (id != ct.MaCTNhap)
                return BadRequest();

            if (!bll.Update(ct))
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

        [HttpDelete("DonNhap/{maDonNhap}")]
        public IActionResult DeleteByMaDonNhap(int maDonNhap)
        {
            if (!bll.DeleteByMaDonNhap(maDonNhap))
                return BadRequest();

            return Ok("Xóa chi tiết đơn nhập thành công");
        }
    }
}
