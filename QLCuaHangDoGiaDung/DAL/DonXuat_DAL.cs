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
                    ds.Add(new DonXuat
                    {
                        MaDonXuat = (int)reader["MaDonXuat"],
                        NgayXuat = (DateTime)reader["NgayXuat"],
                        MaNhanVien = (int)reader["MaNhanVien"],
                        MaKhachHang = reader["MaKhachHang"] != DBNull.Value ? (int?)reader["MaKhachHang"] : null,
                        TongTien = Convert.ToDouble(reader["TongTien"])
                    });
                }
            }
            return ds;
        }

        public bool Insert(DonXuat dx)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO DonXuat
                (NgayXuat, MaNhanVien, MaKhachHang, TongTien)
                VALUES (@NgayXuat, @MaNV, @MaKH, @TongTien)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@NgayXuat", dx.NgayXuat);
                cmd.Parameters.AddWithValue("@MaNV", dx.MaNhanVien);
                cmd.Parameters.AddWithValue("@MaKH", (object)dx.MaKhachHang ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TongTien", dx.TongTien);

                return cmd.ExecuteNonQuery() > 0;
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
                    TongTien=@TongTien
                    WHERE MaDonXuat=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", dx.MaDonXuat);
                cmd.Parameters.AddWithValue("@NgayXuat", dx.NgayXuat);
                cmd.Parameters.AddWithValue("@MaNV", dx.MaNhanVien);
                cmd.Parameters.AddWithValue("@MaKH", (object)dx.MaKhachHang ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TongTien", dx.TongTien);

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

                if (reader.Read())
                {
                    dx = new DonXuat
                    {
                        MaDonXuat = (int)reader["MaDonXuat"],
                        NgayXuat = (DateTime)reader["NgayXuat"],
                        MaNhanVien = (int)reader["MaNhanVien"],
                        MaKhachHang = reader["MaKhachHang"] != DBNull.Value ? (int?)reader["MaKhachHang"] : null,
                        TongTien = Convert.ToDouble(reader["TongTien"])
                    };
                }
            }

            return dx;
        }
    }
}
