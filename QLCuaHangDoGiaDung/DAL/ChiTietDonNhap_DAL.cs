using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class ChiTietDonNhap_DAL
    {
        private readonly string _connStr;

        public ChiTietDonNhap_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        public List<ChiTietDonNhap> GetAll()
        {
            List<ChiTietDonNhap> ds = new List<ChiTietDonNhap>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM ChiTietDonNhap";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new ChiTietDonNhap
                    {
                        MaCTNhap = (int)reader["MaCTNhap"],
                        MaDonNhap = (int)reader["MaDonNhap"],
                        MaSanPham = (int)reader["MaSanPham"],
                        SoLuong = (int)reader["SoLuong"],
                        GiaNhap = Convert.ToDouble(reader["GiaNhap"])
                    });
                }
            }
            return ds;
        }

        public List<ChiTietDonNhap> GetByMaDonNhap(int maDonNhap)
        {
            List<ChiTietDonNhap> ds = new List<ChiTietDonNhap>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM ChiTietDonNhap WHERE MaDonNhap=@MaDonNhap";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaDonNhap", maDonNhap);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new ChiTietDonNhap
                    {
                        MaCTNhap = (int)reader["MaCTNhap"],
                        MaDonNhap = (int)reader["MaDonNhap"],
                        MaSanPham = (int)reader["MaSanPham"],
                        SoLuong = (int)reader["SoLuong"],
                        GiaNhap = Convert.ToDouble(reader["GiaNhap"])
                    });
                }
            }
            return ds;
        }

        public bool Insert(ChiTietDonNhap ct)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO ChiTietDonNhap
                (MaDonNhap, MaSanPham, SoLuong, GiaNhap)
                VALUES (@MaDonNhap, @MaSP, @SL, @GiaNhap)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaDonNhap", ct.MaDonNhap);
                cmd.Parameters.AddWithValue("@MaSP", ct.MaSanPham);
                cmd.Parameters.AddWithValue("@SL", ct.SoLuong);
                cmd.Parameters.AddWithValue("@GiaNhap", ct.GiaNhap);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Update(ChiTietDonNhap ct)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE ChiTietDonNhap SET
                    MaDonNhap=@MaDonNhap,
                    MaSanPham=@MaSP,
                    SoLuong=@SL,
                    GiaNhap=@GiaNhap
                    WHERE MaCTNhap=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ct.MaCTNhap);
                cmd.Parameters.AddWithValue("@MaDonNhap", ct.MaDonNhap);
                cmd.Parameters.AddWithValue("@MaSP", ct.MaSanPham);
                cmd.Parameters.AddWithValue("@SL", ct.SoLuong);
                cmd.Parameters.AddWithValue("@GiaNhap", ct.GiaNhap);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM ChiTietDonNhap WHERE MaCTNhap=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool DeleteByMaDonNhap(int maDonNhap)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM ChiTietDonNhap WHERE MaDonNhap=@MaDonNhap";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaDonNhap", maDonNhap);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public ChiTietDonNhap GetById(int ma)
        {
            ChiTietDonNhap ct = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM ChiTietDonNhap WHERE MaCTNhap=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    ct = new ChiTietDonNhap
                    {
                        MaCTNhap = (int)reader["MaCTNhap"],
                        MaDonNhap = (int)reader["MaDonNhap"],
                        MaSanPham = (int)reader["MaSanPham"],
                        SoLuong = (int)reader["SoLuong"],
                        GiaNhap = Convert.ToDouble(reader["GiaNhap"])
                    };
                }
            }

            return ct;
        }
    }
}
