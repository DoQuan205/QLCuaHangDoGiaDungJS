using Microsoft.AspNetCore.Mvc;
using BLL;
using QLCuaHangDoGiaDung.Models;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonXuatStatusRequest
    {
        [Required]
        public string TrangThai { get; set; } = string.Empty;
    }

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

        [HttpGet("KhachHang/{maKhachHang}")]
        public IActionResult GetByMaKhachHang(int maKhachHang)
        {
            return Ok(bll.GetByMaKhachHang(maKhachHang));
        }

        [HttpPost]
        public IActionResult Create(DonXuat dx)
        {
            var createdOrder = bll.Insert(dx);
            if (createdOrder == null)
                return BadRequest(new { message = "Không thể tạo đơn xuất" });

            return Ok(createdOrder);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, DonXuat dx)
        {
            var existingOrder = bll.GetById(id);
            if (existingOrder == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            dx.MaDonXuat = id;
            dx.TrangThai = string.IsNullOrWhiteSpace(dx.TrangThai) ? existingOrder.TrangThai : dx.TrangThai;

            if (!bll.Update(dx))
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });

            return Ok(new { message = "Cập nhật thành công" });
        }

        [HttpPut("{id}/status")]
        public IActionResult UpdateStatus(int id, DonXuatStatusRequest request)
        {
            var existingOrder = bll.GetById(id);
            if (existingOrder == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            if (!bll.UpdateStatus(id, request.TrangThai))
                return BadRequest(new { message = "Trạng thái đơn hàng không hợp lệ" });

            return Ok(new { message = "Cập nhật trạng thái thành công" });
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
