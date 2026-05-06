using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class TaiKhoan_DAL
    {
        private readonly string _connStr;

        public TaiKhoan_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        // 🔹 Lấy tất cả
        public List<TaiKhoan> GetAll()
        {
            List<TaiKhoan> ds = new List<TaiKhoan>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM TaiKhoan";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new TaiKhoan
                    {
                        MaTaiKhoan = (int)reader["MaTaiKhoan"],
                        TenDangNhap = reader["TenDangNhap"].ToString(),
                        MatKhau = reader["MatKhau"].ToString(),
                        MaQuyen = (int)reader["MaQuyen"],
                        TrangThai = (bool)reader["TrangThai"]
                    });
                }
            }
            return ds;
        }

        // 🔹 Thêm
        public bool Insert(TaiKhoan tk)
        {
            return InsertAndGetId(tk) > 0;
        }

        public int InsertAndGetId(TaiKhoan tk)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO TaiKhoan
                (TenDangNhap, MatKhau, MaQuyen, TrangThai)
                OUTPUT INSERTED.MaTaiKhoan
                VALUES (LTRIM(RTRIM(@User)), @Pass, @Quyen, @TrangThai)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@User", tk.TenDangNhap.Trim());
                cmd.Parameters.AddWithValue("@Pass", tk.MatKhau);
                cmd.Parameters.AddWithValue("@Quyen", tk.MaQuyen);
                cmd.Parameters.AddWithValue("@TrangThai", tk.TrangThai);

                return (int)cmd.ExecuteScalar();
            }
        }

        // 🔹 Sửa
        public bool Update(TaiKhoan tk)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE TaiKhoan SET
                    TenDangNhap=@User,
                    MatKhau=@Pass,
                    MaQuyen=@Quyen,
                    TrangThai=@TrangThai
                    WHERE MaTaiKhoan=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", tk.MaTaiKhoan);
                cmd.Parameters.AddWithValue("@User", tk.TenDangNhap);
                cmd.Parameters.AddWithValue("@Pass", tk.MatKhau);
                cmd.Parameters.AddWithValue("@Quyen", tk.MaQuyen);
                cmd.Parameters.AddWithValue("@TrangThai", tk.TrangThai);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Xóa
        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM TaiKhoan WHERE MaTaiKhoan=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Lấy theo ID
        public TaiKhoan GetById(int ma)
        {
            TaiKhoan tk = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM TaiKhoan WHERE MaTaiKhoan=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    tk = new TaiKhoan
                    {
                        MaTaiKhoan = (int)reader["MaTaiKhoan"],
                        TenDangNhap = reader["TenDangNhap"].ToString(),
                        MatKhau = reader["MatKhau"].ToString(),
                        MaQuyen = (int)reader["MaQuyen"],
                        TrangThai = (bool)reader["TrangThai"]
                    };
                }
            }

            return tk;
        }

        // 🔹 Đăng nhập
        public TaiKhoan Login(string user, string pass)
        {
            TaiKhoan tk = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"SELECT TOP 1 tk.MaTaiKhoan, tk.TenDangNhap, tk.MaQuyen, tk.TrangThai,
                                      kh.MaKhachHang, kh.TenKhachHang, kh.SoDienThoai, kh.DiaChi, kh.Email
                               FROM TaiKhoan tk
                               LEFT JOIN KhachHang kh ON kh.MaTaiKhoan = tk.MaTaiKhoan
                               LEFT JOIN NhanVien nv ON nv.MaTaiKhoan = tk.MaTaiKhoan
                               WHERE (LTRIM(RTRIM(tk.TenDangNhap)) = LTRIM(RTRIM(@User))
                                   OR LTRIM(RTRIM(ISNULL(kh.Email, ''))) = LTRIM(RTRIM(@User))
                                   OR LTRIM(RTRIM(ISNULL(kh.TenKhachHang, ''))) = LTRIM(RTRIM(@User))
                                   OR LTRIM(RTRIM(ISNULL(nv.TenNhanVien, ''))) = LTRIM(RTRIM(@User)))
                                 AND tk.MatKhau=@Pass AND tk.TrangThai=1
                               ORDER BY CASE WHEN kh.MaKhachHang IS NOT NULL THEN 0 ELSE 1 END, tk.MaTaiKhoan DESC";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@User", user.Trim());
                cmd.Parameters.AddWithValue("@Pass", pass);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    tk = new TaiKhoan
                    {
                        MaTaiKhoan = (int)reader["MaTaiKhoan"],
                        TenDangNhap = reader["TenDangNhap"].ToString(),
                        MaQuyen = (int)reader["MaQuyen"],
                        TrangThai = (bool)reader["TrangThai"],
                        MaKhachHang = reader["MaKhachHang"] == DBNull.Value ? null : (int?)reader["MaKhachHang"],
                        TenKhachHang = reader["TenKhachHang"] == DBNull.Value ? null : reader["TenKhachHang"].ToString(),
                        SoDienThoai = reader["SoDienThoai"] == DBNull.Value ? null : reader["SoDienThoai"].ToString(),
                        DiaChi = reader["DiaChi"] == DBNull.Value ? null : reader["DiaChi"].ToString(),
                        Email = reader["Email"] == DBNull.Value ? null : reader["Email"].ToString()
                    };
                }
            }

            return tk;
        }
    }
}