using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using BLL;
using QLCuaHangDoGiaDung.Models;
using System.ComponentModel.DataAnnotations;

namespace API.Controllers
{
    public class DonXuatStatusRequest
    {
        [Required]
        public string TrangThai { get; set; } = string.Empty;
    }

    public class DonXuatCheckoutRequest
    {
        [Required]
        public DonXuat DonXuat { get; set; } = new DonXuat();

        [Required]
        public List<ChiTietDonXuat> ChiTietDonXuats { get; set; } = new List<ChiTietDonXuat>();
    }

    [Route("api/[controller]")]
    [ApiController]
    public class DonXuatController : ControllerBase
    {
        private readonly DonXuat_BLL bll;
        private readonly ThongBao_BLL thongBaoBll;
        private readonly IConfiguration config;

        public DonXuatController(DonXuat_BLL _bll, ThongBao_BLL _thongBaoBll, IConfiguration _config)
        {
            bll = _bll;
            thongBaoBll = _thongBaoBll;
            config = _config;
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

        [HttpPut("{id}/cancel")]
        public IActionResult Cancel(int id)
        {
            var existingOrder = bll.GetById(id);
            if (existingOrder == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng" });

            if (!bll.UpdateStatus(id, "Đã hủy"))
                return BadRequest(new { message = "Không thể hủy đơn hàng" });

            CreateOrderNotification(existingOrder.MaKhachHang, existingOrder.MaDonXuat, "Đơn hàng đã bị hủy", $"Đơn hàng #DX{existingOrder.MaDonXuat} đã được hủy.", "Hủy đơn");

            return Ok(new { message = "Hủy đơn hàng thành công" });
        }

        [HttpPost]
        public IActionResult Create(DonXuat dx)
        {
            if (dx.MaKhachHang <= 0)
                return BadRequest(new { message = "Thiếu mã khách hàng" });

            var createdOrder = bll.Insert(dx);
            if (createdOrder == null)
                return BadRequest(new { message = "Không thể tạo đơn xuất" });

            return Ok(createdOrder);
        }

        [HttpPost("checkout")]
        public IActionResult Checkout([FromBody] DonXuatCheckoutRequest request)
        {
            if (request?.DonXuat == null)
                return BadRequest(new { message = "Thiếu dữ liệu đơn hàng" });

            if (request.DonXuat.MaKhachHang <= 0)
                return BadRequest(new { message = "Thiếu mã khách hàng" });

            if (request.ChiTietDonXuats == null || request.ChiTietDonXuats.Count == 0)
                return BadRequest(new { message = "Giỏ hàng trống" });

            foreach (var ct in request.ChiTietDonXuats)
            {
                if (ct.MaSanPham <= 0 || ct.SoLuong <= 0 || ct.GiaBan <= 0)
                    return BadRequest(new { message = "Dữ liệu chi tiết đơn hàng không hợp lệ" });
            }

            using (var conn = new SqlConnection(config.GetConnectionString("DefaultConnection")))
            {
                conn.Open();
                using (var tx = conn.BeginTransaction())
                {
                    try
                    {
                        var order = request.DonXuat;
                        order.TrangThai = string.IsNullOrWhiteSpace(order.TrangThai) ? "Đợi" : order.TrangThai;

                        var insertOrderSql = @"INSERT INTO DonXuat
                        (NgayXuat, MaNhanVien, MaKhachHang, TongTien, TrangThai)
                        OUTPUT INSERTED.MaDonXuat
                        VALUES (@NgayXuat, @MaNV, @MaKH, @TongTien, @TrangThai)";

                        using var orderCmd = new SqlCommand(insertOrderSql, conn, tx);
                        orderCmd.Parameters.AddWithValue("@NgayXuat", order.NgayXuat == default ? DateTime.Now : order.NgayXuat);
                        orderCmd.Parameters.AddWithValue("@MaNV", (object?)order.MaNhanVien ?? DBNull.Value);
                        orderCmd.Parameters.AddWithValue("@MaKH", (object?)order.MaKhachHang ?? DBNull.Value);
                        orderCmd.Parameters.AddWithValue("@TongTien", order.TongTien);
                        orderCmd.Parameters.AddWithValue("@TrangThai", order.TrangThai);

                        var newOrderIdObj = orderCmd.ExecuteScalar();
                        if (newOrderIdObj == null || newOrderIdObj == DBNull.Value)
                            throw new Exception("Không lấy được mã đơn hàng mới");

                        var newOrderId = Convert.ToInt32(newOrderIdObj);
                        order.MaDonXuat = newOrderId;

                        var insertDetailSql = @"INSERT INTO ChiTietDonXuat
                        (MaDonXuat, MaSanPham, SoLuong, GiaBan)
                        VALUES (@MaDonXuat, @MaSanPham, @SoLuong, @GiaBan)";

                        foreach (var ct in request.ChiTietDonXuats)
                        {
                            using var detailCmd = new SqlCommand(insertDetailSql, conn, tx);
                            detailCmd.Parameters.AddWithValue("@MaDonXuat", newOrderId);
                            detailCmd.Parameters.AddWithValue("@MaSanPham", ct.MaSanPham);
                            detailCmd.Parameters.AddWithValue("@SoLuong", ct.SoLuong);
                            detailCmd.Parameters.AddWithValue("@GiaBan", ct.GiaBan);
                            detailCmd.ExecuteNonQuery();
                        }

                        tx.Commit();

                        try
                        {
                            CreateOrderNotification(order.MaKhachHang, newOrderId, "Đặt hàng thành công", $"Đơn hàng #DX{newOrderId} của bạn đã được tạo thành công và đang chờ quản lý xác nhận.", "Đặt hàng");
                        }
                        catch
                        {
                            // Không để lỗi thông báo làm fail đơn hàng
                        }

                        return Ok(new
                        {
                            message = "Đặt hàng thành công",
                            maDonXuat = newOrderId,
                            trangThai = order.TrangThai
                        });
                    }
                    catch (Exception ex)
                    {
                        tx.Rollback();
                        return BadRequest(new { message = "Không thể tạo đơn hàng", detail = ex.Message });
                    }
                }
            }
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

            if (request.TrangThai == "Đã giao")
            {
                CreateOrderNotification(existingOrder.MaKhachHang, existingOrder.MaDonXuat, "Đơn hàng đã được xác nhận", $"Đơn hàng #DX{existingOrder.MaDonXuat} đã được quản lý xác nhận và giao thành công.", "Xác nhận đơn");
            }
            else if (request.TrangThai == "Đã hủy")
            {
                CreateOrderNotification(existingOrder.MaKhachHang, existingOrder.MaDonXuat, "Đơn hàng đã bị hủy", $"Đơn hàng #DX{existingOrder.MaDonXuat} đã bị quản lý hủy.", "Hủy đơn");
            }

            return Ok(new { message = "Cập nhật trạng thái thành công" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (!bll.Delete(id))
                return BadRequest();

            return Ok("Xóa thành công");
        }

        private void CreateOrderNotification(int? maKhachHang, int maDonXuat, string tieuDe, string noiDung, string loai)
        {
            if (!maKhachHang.HasValue || maKhachHang.Value <= 0)
                return;

            if (thongBaoBll == null)
                return;

            try
            {
                thongBaoBll.Insert(new ThongBao
                {
                    MaKhachHang = maKhachHang.Value,
                    MaDonXuat = maDonXuat,
                    TieuDe = tieuDe,
                    NoiDung = noiDung,
                    Loai = loai,
                    DaDoc = false,
                    NgayTao = DateTime.Now
                });
            }
            catch
            {
                // Bỏ qua lỗi thông báo để không ảnh hưởng luồng đơn hàng
            }
        }
    }
}
