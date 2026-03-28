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
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO TaiKhoan
                (TenDangNhap, MatKhau, MaQuyen, TrangThai)
                VALUES (@User, @Pass, @Quyen, @TrangThai)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@User", tk.TenDangNhap);
                cmd.Parameters.AddWithValue("@Pass", tk.MatKhau);
                cmd.Parameters.AddWithValue("@Quyen", tk.MaQuyen);
                cmd.Parameters.AddWithValue("@TrangThai", tk.TrangThai);

                return cmd.ExecuteNonQuery() > 0;
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
                string sql = @"SELECT * FROM TaiKhoan 
                               WHERE TenDangNhap=@User AND MatKhau=@Pass AND TrangThai=1";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@User", user);
                cmd.Parameters.AddWithValue("@Pass", pass);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    tk = new TaiKhoan
                    {
                        MaTaiKhoan = (int)reader["MaTaiKhoan"],
                        TenDangNhap = reader["TenDangNhap"].ToString(),
                        MaQuyen = (int)reader["MaQuyen"],
                        TrangThai = (bool)reader["TrangThai"]
                    };
                }
            }

            return tk;
        }
    }
}