using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChiTietDonXuatController : ControllerBase
    {
        private readonly ChiTietDonXuat_BLL bll;

        public ChiTietDonXuatController(ChiTietDonXuat_BLL _bll)
        {
            bll = _bll;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(bll.GetAll());
        }

        [HttpGet("DonXuat/{maDonXuat}")]
        public IActionResult GetByMaDonXuat(int maDonXuat)
        {
            return Ok(bll.GetByMaDonXuat(maDonXuat));
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
        public IActionResult Create(ChiTietDonXuat ct)
        {
            if (!bll.Insert(ct))
                return BadRequest();

            return Ok("Thêm chi tiết đơn xuất thành công");
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ChiTietDonXuat ct)
        {
            if (id != ct.MaCTXuat)
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

        [HttpDelete("DonXuat/{maDonXuat}")]
        public IActionResult DeleteByMaDonXuat(int maDonXuat)
        {
            if (!bll.DeleteByMaDonXuat(maDonXuat))
                return BadRequest();

            return Ok("Xóa chi tiết đơn xuất thành công");
        }
    }
}
