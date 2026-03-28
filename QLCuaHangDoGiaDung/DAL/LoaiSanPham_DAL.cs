using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class LoaiSanPham_DAL
    {
        private readonly string _connStr;

        public LoaiSanPham_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        // 🔹 Lấy danh sách
        public List<LoaiSanPham> GetAll()
        {
            List<LoaiSanPham> ds = new List<LoaiSanPham>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM LoaiSanPham";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new LoaiSanPham
                    {
                        MaLoai = (int)reader["MaLoai"],
                        TenLoai = reader["TenLoai"].ToString(),
                        MoTa = reader["MoTa"].ToString()
                    });
                }
            }

            return ds;
        }

        // 🔹 Thêm
        public bool Insert(LoaiSanPham lsp)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO LoaiSanPham (TenLoai, MoTa)
                               VALUES (@TenLoai, @MoTa)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@TenLoai", lsp.TenLoai);
                cmd.Parameters.AddWithValue("@MoTa", lsp.MoTa);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Sửa
        public bool Update(LoaiSanPham lsp)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE LoaiSanPham SET 
                                TenLoai = @TenLoai,
                                MoTa = @MoTa
                               WHERE MaLoai = @MaLoai";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaLoai", lsp.MaLoai);
                cmd.Parameters.AddWithValue("@TenLoai", lsp.TenLoai);
                cmd.Parameters.AddWithValue("@MoTa", lsp.MoTa);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Xóa
        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM LoaiSanPham WHERE MaLoai = @MaLoai";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaLoai", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Lấy theo ID (nên có thêm)
        public LoaiSanPham GetById(int ma)
        {
            LoaiSanPham lsp = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM LoaiSanPham WHERE MaLoai = @MaLoai";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaLoai", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    lsp = new LoaiSanPham
                    {
                        MaLoai = (int)reader["MaLoai"],
                        TenLoai = reader["TenLoai"].ToString(),
                        MoTa = reader["MoTa"].ToString()
                    };
                }
            }

            return lsp;
        }
    }
}