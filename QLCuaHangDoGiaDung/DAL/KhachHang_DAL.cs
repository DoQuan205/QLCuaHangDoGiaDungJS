using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class KhachHang_DAL
    {
        private readonly string _connStr;

        public KhachHang_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        // 🔹 Lấy tất cả
        public List<KhachHang> GetAll()
        {
            List<KhachHang> ds = new List<KhachHang>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM KhachHang";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new KhachHang
                    {
                        MaKhachHang = (int)reader["MaKhachHang"],
                        TenKhachHang = reader["TenKhachHang"].ToString(),
                        SoDienThoai = reader["SoDienThoai"].ToString(),
                        DiaChi = reader["DiaChi"].ToString(),
                        Email = reader["Email"].ToString(),
                        MaTaiKhoan = reader["MaTaiKhoan"] == DBNull.Value ? null : (int?)reader["MaTaiKhoan"]
                    });
                }
            }
            return ds;
        }

        // 🔹 Thêm
        public bool Insert(KhachHang kh)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO KhachHang
                (TenKhachHang, SoDienThoai, DiaChi, Email, MaTaiKhoan)
                VALUES (@Ten, @SDT, @DiaChi, @Email, @MaTaiKhoan)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ten", kh.TenKhachHang);
                cmd.Parameters.AddWithValue("@SDT", kh.SoDienThoai);
                cmd.Parameters.AddWithValue("@DiaChi", kh.DiaChi ?? string.Empty);
                cmd.Parameters.AddWithValue("@Email", kh.Email ?? string.Empty);
                cmd.Parameters.AddWithValue("@MaTaiKhoan", kh.MaTaiKhoan.HasValue ? kh.MaTaiKhoan.Value : DBNull.Value);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Sửa
        public bool Update(KhachHang kh)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE KhachHang SET
                    TenKhachHang=@Ten,
                    SoDienThoai=@SDT,
                    DiaChi=@DiaChi,
                    Email=@Email,
                    MaTaiKhoan=@MaTaiKhoan
                    WHERE MaKhachHang=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", kh.MaKhachHang);
                cmd.Parameters.AddWithValue("@Ten", kh.TenKhachHang);
                cmd.Parameters.AddWithValue("@SDT", kh.SoDienThoai);
                cmd.Parameters.AddWithValue("@DiaChi", kh.DiaChi ?? string.Empty);
                cmd.Parameters.AddWithValue("@Email", kh.Email ?? string.Empty);
                cmd.Parameters.AddWithValue("@MaTaiKhoan", kh.MaTaiKhoan.HasValue ? kh.MaTaiKhoan.Value : DBNull.Value);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Xóa
        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM KhachHang WHERE MaKhachHang=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        private KhachHang ReadCustomer(SqlDataReader reader)
        {
            return new KhachHang
            {
                MaKhachHang = (int)reader["MaKhachHang"],
                TenKhachHang = reader["TenKhachHang"].ToString(),
                SoDienThoai = reader["SoDienThoai"].ToString(),
                DiaChi = reader["DiaChi"].ToString(),
                Email = reader["Email"].ToString(),
                MaTaiKhoan = reader["MaTaiKhoan"] == DBNull.Value ? null : (int?)reader["MaTaiKhoan"]
            };
        }

        // 🔹 Lấy theo ID
        public KhachHang GetById(int ma)
        {
            KhachHang kh = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM KhachHang WHERE MaKhachHang=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    kh = ReadCustomer(reader);
                }
            }

            return kh;
        }

        public KhachHang GetByMaTaiKhoan(int maTaiKhoan)
        {
            if (maTaiKhoan <= 0)
                return null;

            KhachHang kh = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT TOP 1 * FROM KhachHang WHERE MaTaiKhoan=@MaTaiKhoan ORDER BY MaKhachHang DESC";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaTaiKhoan", maTaiKhoan);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    kh = ReadCustomer(reader);
                }
            }

            return kh;
        }
    }
}