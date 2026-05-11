using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class DonXuat_DAL
    {
        private readonly string _connStr;

        public DonXuat_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        private bool TryReadDonXuat(SqlDataReader reader, out DonXuat donXuat)
        {
            donXuat = null;

            if (reader["MaDonXuat"] == DBNull.Value)
                return false;

            var maDonXuat = Convert.ToInt32(reader["MaDonXuat"]);
            var ngayXuat = reader["NgayXuat"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["NgayXuat"]);
            var tongTien = reader["TongTien"] == DBNull.Value ? 0d : Convert.ToDouble(reader["TongTien"]);
            var trangThaiRaw = reader["TrangThai"] == DBNull.Value ? string.Empty : reader["TrangThai"].ToString() ?? string.Empty;
            var trangThai = string.IsNullOrWhiteSpace(trangThaiRaw) ? "Đợi" : trangThaiRaw;

            donXuat = new DonXuat
            {
                MaDonXuat = maDonXuat,
                NgayXuat = ngayXuat,
                MaNhanVien = reader["MaNhanVien"] == DBNull.Value ? null : Convert.ToInt32(reader["MaNhanVien"]),
                MaKhachHang = reader["MaKhachHang"] == DBNull.Value ? null : Convert.ToInt32(reader["MaKhachHang"]),
                TongTien = tongTien,
                TrangThai = trangThai
            };

            return true;
        }

        public List<DonXuat> GetAll()
        {
            List<DonXuat> ds = new List<DonXuat>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM DonXuat";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    if (TryReadDonXuat(reader, out var donXuat))
                        ds.Add(donXuat);
                }
            }
            return ds;
        }

        public DonXuat Insert(DonXuat dx)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO DonXuat
                (NgayXuat, MaNhanVien, MaKhachHang, TongTien, TrangThai)
                OUTPUT INSERTED.MaDonXuat
                VALUES (@NgayXuat, @MaNV, @MaKH, @TongTien, @TrangThai)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@NgayXuat", dx.NgayXuat);
                cmd.Parameters.AddWithValue("@MaNV", (object?)dx.MaNhanVien ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@MaKH", (object)dx.MaKhachHang ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TongTien", dx.TongTien);
                cmd.Parameters.AddWithValue("@TrangThai", string.IsNullOrWhiteSpace(dx.TrangThai) ? "Đợi" : dx.TrangThai);

                dx.MaDonXuat = Convert.ToInt32(cmd.ExecuteScalar());
                return dx;
            }
        }

        public bool Update(DonXuat dx)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE DonXuat SET
                    NgayXuat=@NgayXuat,
                    MaNhanVien=@MaNV,
                    MaKhachHang=@MaKH,
                    TongTien=@TongTien,
                    TrangThai=@TrangThai
                    WHERE MaDonXuat=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", dx.MaDonXuat);
                cmd.Parameters.AddWithValue("@NgayXuat", dx.NgayXuat);
                cmd.Parameters.AddWithValue("@MaNV", (object?)dx.MaNhanVien ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@MaKH", (object)dx.MaKhachHang ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TongTien", dx.TongTien);
                cmd.Parameters.AddWithValue("@TrangThai", string.IsNullOrWhiteSpace(dx.TrangThai) ? "Đợi" : dx.TrangThai);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM DonXuat WHERE MaDonXuat=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public DonXuat GetById(int ma)
        {
            DonXuat dx = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM DonXuat WHERE MaDonXuat=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read() && TryReadDonXuat(reader, out var donXuat))
                {
                    dx = donXuat;
                }
            }

            return dx;
        }

        public List<DonXuat> GetByMaKhachHang(int maKhachHang)
        {
            List<DonXuat> ds = new List<DonXuat>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM DonXuat WHERE MaKhachHang = @MaKhachHang ORDER BY MaDonXuat DESC";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaKhachHang", maKhachHang);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    if (TryReadDonXuat(reader, out var donXuat))
                        ds.Add(donXuat);
                }
            }

            return ds;
        }

        public bool UpdateStatus(int maDonXuat, string trangThai)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "UPDATE DonXuat SET TrangThai = @TrangThai WHERE MaDonXuat = @MaDonXuat";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaDonXuat", maDonXuat);
                cmd.Parameters.AddWithValue("@TrangThai", trangThai);

                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
