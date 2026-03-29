using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class DonNhap_DAL
    {
        private readonly string _connStr;

        public DonNhap_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        public List<DonNhap> GetAll()
        {
            List<DonNhap> ds = new List<DonNhap>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM DonNhap";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new DonNhap
                    {
                        MaDonNhap = (int)reader["MaDonNhap"],
                        NgayNhap = (DateTime)reader["NgayNhap"],
                        MaNhanVien = (int)reader["MaNhanVien"],
                        MaNhaCungCap = reader["MaNhaCungCap"] != DBNull.Value ? (int?)reader["MaNhaCungCap"] : null,
                        TongTien = Convert.ToDouble(reader["TongTien"])
                    });
                }
            }
            return ds;
        }

        public bool Insert(DonNhap dn)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO DonNhap
                (NgayNhap, MaNhanVien, MaNhaCungCap, TongTien)
                VALUES (@NgayNhap, @MaNV, @MaNCC, @TongTien)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@NgayNhap", dn.NgayNhap);
                cmd.Parameters.AddWithValue("@MaNV", dn.MaNhanVien);
                cmd.Parameters.AddWithValue("@MaNCC", (object)dn.MaNhaCungCap ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TongTien", dn.TongTien);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Update(DonNhap dn)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE DonNhap SET
                    NgayNhap=@NgayNhap,
                    MaNhanVien=@MaNV,
                    MaNhaCungCap=@MaNCC,
                    TongTien=@TongTien
                    WHERE MaDonNhap=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", dn.MaDonNhap);
                cmd.Parameters.AddWithValue("@NgayNhap", dn.NgayNhap);
                cmd.Parameters.AddWithValue("@MaNV", dn.MaNhanVien);
                cmd.Parameters.AddWithValue("@MaNCC", (object)dn.MaNhaCungCap ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TongTien", dn.TongTien);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM DonNhap WHERE MaDonNhap=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public DonNhap GetById(int ma)
        {
            DonNhap dn = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM DonNhap WHERE MaDonNhap=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    dn = new DonNhap
                    {
                        MaDonNhap = (int)reader["MaDonNhap"],
                        NgayNhap = (DateTime)reader["NgayNhap"],
                        MaNhanVien = (int)reader["MaNhanVien"],
                        MaNhaCungCap = reader["MaNhaCungCap"] != DBNull.Value ? (int?)reader["MaNhaCungCap"] : null,
                        TongTien = Convert.ToDouble(reader["TongTien"])
                    };
                }
            }

            return dn;
        }
    }
}
