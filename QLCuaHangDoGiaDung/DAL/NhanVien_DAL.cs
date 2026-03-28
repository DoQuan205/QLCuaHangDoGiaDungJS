using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class NhanVien_DAL
    {
        private readonly string _connStr;

        public NhanVien_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        // 🔹 Lấy tất cả
        public List<NhanVien> GetAll()
        {
            List<NhanVien> ds = new List<NhanVien>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM NhanVien";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new NhanVien
                    {
                        MaNhanVien = (int)reader["MaNhanVien"],
                        TenNhanVien = reader["TenNhanVien"].ToString(),
                        NgaySinh = (DateTime)reader["NgaySinh"],
                        SoDienThoai = reader["SoDienThoai"].ToString(),
                        DiaChi = reader["DiaChi"].ToString(),
                        MaTaiKhoan = (int)reader["MaTaiKhoan"]
                    });
                }
            }
            return ds;
        }

        // 🔹 Thêm
        public bool Insert(NhanVien nv)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO NhanVien
                (TenNhanVien, NgaySinh, SoDienThoai, DiaChi, MaTaiKhoan)
                VALUES (@Ten, @NgaySinh, @SDT, @DiaChi, @MaTK)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ten", nv.TenNhanVien);
                cmd.Parameters.AddWithValue("@NgaySinh", nv.NgaySinh);
                cmd.Parameters.AddWithValue("@SDT", nv.SoDienThoai);
                cmd.Parameters.AddWithValue("@DiaChi", nv.DiaChi);
                cmd.Parameters.AddWithValue("@MaTK", nv.MaTaiKhoan);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Sửa
        public bool Update(NhanVien nv)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE NhanVien SET
                    TenNhanVien=@Ten,
                    NgaySinh=@NgaySinh,
                    SoDienThoai=@SDT,
                    DiaChi=@DiaChi,
                    MaTaiKhoan=@MaTK
                    WHERE MaNhanVien=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", nv.MaNhanVien);
                cmd.Parameters.AddWithValue("@Ten", nv.TenNhanVien);
                cmd.Parameters.AddWithValue("@NgaySinh", nv.NgaySinh);
                cmd.Parameters.AddWithValue("@SDT", nv.SoDienThoai);
                cmd.Parameters.AddWithValue("@DiaChi", nv.DiaChi);
                cmd.Parameters.AddWithValue("@MaTK", nv.MaTaiKhoan);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Xóa
        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM NhanVien WHERE MaNhanVien=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Lấy theo ID
        public NhanVien GetById(int ma)
        {
            NhanVien nv = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM NhanVien WHERE MaNhanVien=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    nv = new NhanVien
                    {
                        MaNhanVien = (int)reader["MaNhanVien"],
                        TenNhanVien = reader["TenNhanVien"].ToString(),
                        NgaySinh = (DateTime)reader["NgaySinh"],
                        SoDienThoai = reader["SoDienThoai"].ToString(),
                        DiaChi = reader["DiaChi"].ToString(),
                        MaTaiKhoan = (int)reader["MaTaiKhoan"]
                    };
                }
            }

            return nv;
        }
    }
}