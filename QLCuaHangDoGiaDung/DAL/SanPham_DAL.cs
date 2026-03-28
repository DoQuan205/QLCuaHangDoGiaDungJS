using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class SanPham_DAL
    {
        private readonly string _connStr;

        public SanPham_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        // 🔹 Lấy tất cả
        public List<SanPham> GetAll()
        {
            List<SanPham> ds = new List<SanPham>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM SanPham";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new SanPham
                    {
                        MaSanPham = (int)reader["MaSanPham"],
                        TenSanPham = reader["TenSanPham"].ToString(),
                        MaLoai = (int)reader["MaLoai"],
                        GiaBan = Convert.ToDouble(reader["GiaBan"]),
                        SoLuong = (int)reader["SoLuong"],
                        HinhAnh = reader["HinhAnh"].ToString(),
                        MoTa = reader["MoTa"].ToString()
                    });
                }
            }
            return ds;
        }

        // 🔹 Thêm
        public bool Insert(SanPham sp)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO SanPham
                (TenSanPham, MaLoai, GiaBan, SoLuong, HinhAnh, MoTa)
                VALUES (@Ten, @MaLoai, @Gia, @SL, @Hinh, @MoTa)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ten", sp.TenSanPham);
                cmd.Parameters.AddWithValue("@MaLoai", sp.MaLoai);
                cmd.Parameters.AddWithValue("@Gia", sp.GiaBan);
                cmd.Parameters.AddWithValue("@SL", sp.SoLuong);
                cmd.Parameters.AddWithValue("@Hinh", sp.HinhAnh);
                cmd.Parameters.AddWithValue("@MoTa", sp.MoTa);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Sửa
        public bool Update(SanPham sp)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE SanPham SET
                    TenSanPham=@Ten,
                    MaLoai=@MaLoai,
                    GiaBan=@Gia,
                    SoLuong=@SL,
                    HinhAnh=@Hinh,
                    MoTa=@MoTa
                    WHERE MaSanPham=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", sp.MaSanPham);
                cmd.Parameters.AddWithValue("@Ten", sp.TenSanPham);
                cmd.Parameters.AddWithValue("@MaLoai", sp.MaLoai);
                cmd.Parameters.AddWithValue("@Gia", sp.GiaBan);
                cmd.Parameters.AddWithValue("@SL", sp.SoLuong);
                cmd.Parameters.AddWithValue("@Hinh", sp.HinhAnh);
                cmd.Parameters.AddWithValue("@MoTa", sp.MoTa);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Xóa
        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM SanPham WHERE MaSanPham=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Lấy theo ID
        public SanPham GetById(int ma)
        {
            SanPham sp = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM SanPham WHERE MaSanPham=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    sp = new SanPham
                    {
                        MaSanPham = (int)reader["MaSanPham"],
                        TenSanPham = reader["TenSanPham"].ToString(),
                        MaLoai = (int)reader["MaLoai"],
                        GiaBan = Convert.ToDouble(reader["GiaBan"]),
                        SoLuong = (int)reader["SoLuong"],
                        HinhAnh = reader["HinhAnh"].ToString(),
                        MoTa = reader["MoTa"].ToString()
                    };
                }
            }

            return sp;
        }
    }
}