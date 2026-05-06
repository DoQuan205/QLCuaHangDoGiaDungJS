using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using QLCuaHangDoGiaDung.Models;

namespace DAL
{
    public class ThongBao_DAL
    {
        private readonly string _connStr;

        public ThongBao_DAL(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        private SqlConnection GetConn()
        {
            return new SqlConnection(_connStr);
        }

        private bool HasThongBaoTable(SqlConnection conn)
        {
            using var cmd = new SqlCommand("SELECT CASE WHEN OBJECT_ID(N'dbo.ThongBao', N'U') IS NULL THEN 0 ELSE 1 END", conn);
            return Convert.ToInt32(cmd.ExecuteScalar()) == 1;
        }

        private ThongBao ReadThongBao(SqlDataReader reader)
        {
            return new ThongBao
            {
                MaThongBao = Convert.ToInt32(reader["MaThongBao"]),
                MaKhachHang = Convert.ToInt32(reader["MaKhachHang"]),
                MaDonXuat = reader["MaDonXuat"] == DBNull.Value ? null : Convert.ToInt32(reader["MaDonXuat"]),
                TieuDe = reader["TieuDe"].ToString() ?? string.Empty,
                NoiDung = reader["NoiDung"].ToString() ?? string.Empty,
                Loai = reader["Loai"].ToString() ?? string.Empty,
                DaDoc = reader["DaDoc"] != DBNull.Value && Convert.ToBoolean(reader["DaDoc"]),
                NgayTao = reader["NgayTao"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["NgayTao"])
            };
        }

        public List<ThongBao> GetAll()
        {
            List<ThongBao> ds = new List<ThongBao>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                if (!HasThongBaoTable(conn))
                    return ds;

                string sql = "SELECT * FROM ThongBao ORDER BY NgayTao DESC, MaThongBao DESC";
                SqlCommand cmd = new SqlCommand(sql, conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    ds.Add(ReadThongBao(reader));
                }
            }

            return ds;
        }

        public ThongBao GetById(int ma)
        {
            ThongBao tb = null;

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                if (!HasThongBaoTable(conn))
                    return null;

                string sql = "SELECT * FROM ThongBao WHERE MaThongBao=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                using SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    tb = ReadThongBao(reader);
                }
            }

            return tb;
        }

        public List<ThongBao> GetByMaKhachHang(int maKhachHang)
        {
            List<ThongBao> ds = new List<ThongBao>();

            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                if (!HasThongBaoTable(conn))
                    return ds;

                string sql = @"SELECT * FROM ThongBao
                               WHERE MaKhachHang=@MaKhachHang
                               ORDER BY NgayTao DESC, MaThongBao DESC";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaKhachHang", maKhachHang);

                using SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    ds.Add(ReadThongBao(reader));
                }
            }

            return ds;
        }

        public bool Insert(ThongBao tb)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                if (!HasThongBaoTable(conn))
                {
                    const string createTableSql = @"
CREATE TABLE dbo.ThongBao (
    MaThongBao INT IDENTITY(1,1) PRIMARY KEY,
    MaKhachHang INT NOT NULL,
    MaDonXuat INT NULL,
    TieuDe NVARCHAR(200) NOT NULL,
    NoiDung NVARCHAR(500) NOT NULL,
    Loai NVARCHAR(50) NOT NULL,
    DaDoc BIT NOT NULL DEFAULT 0,
    NgayTao DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (MaKhachHang) REFERENCES dbo.KhachHang(MaKhachHang),
    FOREIGN KEY (MaDonXuat) REFERENCES dbo.DonXuat(MaDonXuat)
)";
                    using var createCmd = new SqlCommand(createTableSql, conn);
                    createCmd.ExecuteNonQuery();
                }

                string sql = @"INSERT INTO ThongBao
                (MaKhachHang, MaDonXuat, TieuDe, NoiDung, Loai, DaDoc, NgayTao)
                OUTPUT INSERTED.MaThongBao
                VALUES (@MaKhachHang, @MaDonXuat, @TieuDe, @NoiDung, @Loai, @DaDoc, @NgayTao)";

                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaKhachHang", tb.MaKhachHang);
                cmd.Parameters.AddWithValue("@MaDonXuat", (object?)tb.MaDonXuat ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@TieuDe", tb.TieuDe ?? string.Empty);
                cmd.Parameters.AddWithValue("@NoiDung", tb.NoiDung ?? string.Empty);
                cmd.Parameters.AddWithValue("@Loai", tb.Loai ?? string.Empty);
                cmd.Parameters.AddWithValue("@DaDoc", tb.DaDoc);
                cmd.Parameters.AddWithValue("@NgayTao", tb.NgayTao == default ? DateTime.Now : tb.NgayTao);

                var insertedId = cmd.ExecuteScalar();
                if (insertedId == null || insertedId == DBNull.Value)
                    return false;

                tb.MaThongBao = Convert.ToInt32(insertedId);
                return true;
            }
        }

        public bool MarkAsRead(int maThongBao)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                if (!HasThongBaoTable(conn))
                    return false;

                string sql = "UPDATE ThongBao SET DaDoc = 1 WHERE MaThongBao = @MaThongBao";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@MaThongBao", maThongBao);

                return cmd.ExecuteNonQuery() > 0;
            }
        }

        public bool Delete(int ma)
        {
            using (SqlConnection conn = GetConn())
            {
                conn.Open();
                if (!HasThongBaoTable(conn))
                    return false;

                string sql = "DELETE FROM ThongBao WHERE MaThongBao=@Ma";
                SqlCommand cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Ma", ma);

                return cmd.ExecuteNonQuery() > 0;
            }
        }
    }
}
