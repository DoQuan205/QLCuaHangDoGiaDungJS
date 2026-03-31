using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class NhaCungCap_DAL
    {
        private readonly string _connStr;

        public NhaCungCap_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        public List<NhaCungCap> GetAll()
        {
            List<NhaCungCap> ds = new List<NhaCungCap>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM NhaCungCap";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new NhaCungCap
                    {
                        MaNhaCungCap = (int)reader["MaNhaCungCap"],
                        TenNhaCungCap = reader["TenNhaCungCap"].ToString(),
                        SoDienThoai = reader["SoDienThoai"].ToString(),
                        DiaChi = reader["DiaChi"].ToString(),
                        Email = reader["Email"].ToString()
                    });
                }
            }
            return ds;
        }

        public bool Insert(NhaCungCap ncc)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO NhaCungCap
                (TenNhaCungCap, SoDienThoai, DiaChi, Email)
                VALUES (@Ten, @SDT, @DiaChi, @Email)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ten", ncc.TenNhaCungCap);
                cmd.Parameters.AddWithValue("@SDT", ncc.SoDienThoai);
                cmd.Parameters.AddWithValue("@DiaChi", ncc.DiaChi);
                cmd.Parameters.AddWithValue("@Email", ncc.Email);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Update(NhaCungCap ncc)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE NhaCungCap SET
                    TenNhaCungCap=@Ten,
                    SoDienThoai=@SDT,
                    DiaChi=@DiaChi,
                    Email=@Email
                    WHERE MaNhaCungCap=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ncc.MaNhaCungCap);
                cmd.Parameters.AddWithValue("@Ten", ncc.TenNhaCungCap);
                cmd.Parameters.AddWithValue("@SDT", ncc.SoDienThoai);
                cmd.Parameters.AddWithValue("@DiaChi", ncc.DiaChi);
                cmd.Parameters.AddWithValue("@Email", ncc.Email);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM NhaCungCap WHERE MaNhaCungCap=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public NhaCungCap GetById(int ma)
        {
            NhaCungCap ncc = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM NhaCungCap WHERE MaNhaCungCap=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    ncc = new NhaCungCap
                    {
                        MaNhaCungCap = (int)reader["MaNhaCungCap"],
                        TenNhaCungCap = reader["TenNhaCungCap"].ToString(),
                        SoDienThoai = reader["SoDienThoai"].ToString(),
                        DiaChi = reader["DiaChi"].ToString(),
                        Email = reader["Email"].ToString()
                    };
                }
            }

            return ncc;
        }
    }
}
