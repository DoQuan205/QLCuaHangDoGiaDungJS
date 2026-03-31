using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class MaGiamGia_DAL
    {
        private readonly string _connStr;

        public MaGiamGia_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        public List<MaGiamGia> GetAll()
        {
            List<MaGiamGia> ds = new List<MaGiamGia>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM MaGiamGia";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new MaGiamGia
                    {
                        MaMaGiamGia = (int)reader["MaGiamGia"],
                        TenMa = reader["TenMa"].ToString(),
                        PhanTramGiam = (int)reader["PhanTramGiam"],
                        NgayKetThuc = (DateTime)reader["NgayKetThuc"],
                        MaLoai = (int)reader["MaLoai"]
                    });
                }
            }
            return ds;
        }

        public bool Insert(MaGiamGia mgg)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO MaGiamGia
                (TenMa, PhanTramGiam, NgayKetThuc, MaLoai)
                VALUES (@TenMa, @PhanTram, @NgayKT, @MaLoai)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@TenMa", mgg.TenMa);
                cmd.Parameters.AddWithValue("@PhanTram", mgg.PhanTramGiam);
                cmd.Parameters.AddWithValue("@NgayKT", mgg.NgayKetThuc);
                cmd.Parameters.AddWithValue("@MaLoai", mgg.MaLoai);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Update(MaGiamGia mgg)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE MaGiamGia SET
                    TenMa=@TenMa,
                    PhanTramGiam=@PhanTram,
                    NgayKetThuc=@NgayKT,
                    MaLoai=@MaLoai
                    WHERE MaGiamGia=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", mgg.MaMaGiamGia);
                cmd.Parameters.AddWithValue("@TenMa", mgg.TenMa);
                cmd.Parameters.AddWithValue("@PhanTram", mgg.PhanTramGiam);
                cmd.Parameters.AddWithValue("@NgayKT", mgg.NgayKetThuc);
                cmd.Parameters.AddWithValue("@MaLoai", mgg.MaLoai);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM MaGiamGia WHERE MaGiamGia=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public MaGiamGia GetById(int ma)
        {
            MaGiamGia mgg = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM MaGiamGia WHERE MaGiamGia=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    mgg = new MaGiamGia
                    {
                        MaMaGiamGia = (int)reader["MaGiamGia"],
                        TenMa = reader["TenMa"].ToString(),
                        PhanTramGiam = (int)reader["PhanTramGiam"],
                        NgayKetThuc = (DateTime)reader["NgayKetThuc"],
                        MaLoai = (int)reader["MaLoai"]
                    };
                }
            }

            return mgg;
        }
    }
}
