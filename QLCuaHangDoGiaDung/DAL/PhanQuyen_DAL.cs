using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class PhanQuyen_DAL
    {
        private readonly string _connStr;

        public PhanQuyen_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        // 🔹 Lấy tất cả
        public List<PhanQuyen> GetAll()
        {
            List<PhanQuyen> ds = new List<PhanQuyen>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM PhanQuyen";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new PhanQuyen
                    {
                        MaQuyen = (int)reader["MaQuyen"],
                        TenQuyen = reader["TenQuyen"].ToString(),
                        MoTa = reader["MoTa"].ToString()
                    });
                }
            }
            return ds;
        }

        // 🔹 Thêm
        public bool Insert(PhanQuyen pq)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "INSERT INTO PhanQuyen(TenQuyen, MoTa) VALUES(@Ten, @MoTa)";
                SqlCommand cmd = new SqlCommand(sql, conn);

                cmd.Parameters.AddWithValue("@Ten", pq.TenQuyen);
                cmd.Parameters.AddWithValue("@MoTa", pq.MoTa);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Sửa
        public bool Update(PhanQuyen pq)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE PhanQuyen SET
                               TenQuyen=@Ten,
                               MoTa=@MoTa
                               WHERE MaQuyen=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);

                cmd.Parameters.AddWithValue("@Ma", pq.MaQuyen);
                cmd.Parameters.AddWithValue("@Ten", pq.TenQuyen);
                cmd.Parameters.AddWithValue("@MoTa", pq.MoTa);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Xóa
        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM PhanQuyen WHERE MaQuyen=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        // 🔹 Lấy theo ID
        public PhanQuyen GetById(int ma)
        {
            PhanQuyen pq = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM PhanQuyen WHERE MaQuyen=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    pq = new PhanQuyen
                    {
                        MaQuyen = (int)reader["MaQuyen"],
                        TenQuyen = reader["TenQuyen"].ToString(),
                        MoTa = reader["MoTa"].ToString()
                    };
                }
            }

            return pq;
        }
    }
}