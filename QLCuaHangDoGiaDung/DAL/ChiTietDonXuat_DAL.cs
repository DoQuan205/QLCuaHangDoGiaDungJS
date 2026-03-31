using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class ChiTietDonXuat_DAL
    {
        private readonly string _connStr;

        public ChiTietDonXuat_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        public List<ChiTietDonXuat> GetAll()
        {
            List<ChiTietDonXuat> ds = new List<ChiTietDonXuat>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM ChiTietDonXuat";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new ChiTietDonXuat
                    {
                        MaCTXuat = (int)reader["MaCTXuat"],
                        MaDonXuat = (int)reader["MaDonXuat"],
                        MaSanPham = (int)reader["MaSanPham"],
                        SoLuong = (int)reader["SoLuong"],
                        GiaBan = Convert.ToDouble(reader["GiaBan"])
                    });
                }
            }
            return ds;
        }

        public List<ChiTietDonXuat> GetByMaDonXuat(int maDonXuat)
        {
            List<ChiTietDonXuat> ds = new List<ChiTietDonXuat>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM ChiTietDonXuat WHERE MaDonXuat=@MaDonXuat";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaDonXuat", maDonXuat);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(new ChiTietDonXuat
                    {
                        MaCTXuat = (int)reader["MaCTXuat"],
                        MaDonXuat = (int)reader["MaDonXuat"],
                        MaSanPham = (int)reader["MaSanPham"],
                        SoLuong = (int)reader["SoLuong"],
                        GiaBan = Convert.ToDouble(reader["GiaBan"])
                    });
                }
            }
            return ds;
        }

        public bool Insert(ChiTietDonXuat ct)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"INSERT INTO ChiTietDonXuat
                (MaDonXuat, MaSanPham, SoLuong, GiaBan)
                VALUES (@MaDonXuat, @MaSP, @SL, @GiaBan)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaDonXuat", ct.MaDonXuat);
                cmd.Parameters.AddWithValue("@MaSP", ct.MaSanPham);
                cmd.Parameters.AddWithValue("@SL", ct.SoLuong);
                cmd.Parameters.AddWithValue("@GiaBan", ct.GiaBan);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Update(ChiTietDonXuat ct)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = @"UPDATE ChiTietDonXuat SET
                    MaDonXuat=@MaDonXuat,
                    MaSanPham=@MaSP,
                    SoLuong=@SL,
                    GiaBan=@GiaBan
                    WHERE MaCTXuat=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ct.MaCTXuat);
                cmd.Parameters.AddWithValue("@MaDonXuat", ct.MaDonXuat);
                cmd.Parameters.AddWithValue("@MaSP", ct.MaSanPham);
                cmd.Parameters.AddWithValue("@SL", ct.SoLuong);
                cmd.Parameters.AddWithValue("@GiaBan", ct.GiaBan);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM ChiTietDonXuat WHERE MaCTXuat=@Ma";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool DeleteByMaDonXuat(int maDonXuat)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "DELETE FROM ChiTietDonXuat WHERE MaDonXuat=@MaDonXuat";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaDonXuat", maDonXuat);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public ChiTietDonXuat GetById(int ma)
        {
            ChiTietDonXuat ct = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                string sql = "SELECT * FROM ChiTietDonXuat WHERE MaCTXuat=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    ct = new ChiTietDonXuat
                    {
                        MaCTXuat = (int)reader["MaCTXuat"],
                        MaDonXuat = (int)reader["MaDonXuat"],
                        MaSanPham = (int)reader["MaSanPham"],
                        SoLuong = (int)reader["SoLuong"],
                        GiaBan = Convert.ToDouble(reader["GiaBan"])
                    };
                }
            }

            return ct;
        }
    }
}
