using BLL;
using DAL;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Add services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 Dependency Injection (3-layer)
builder.Services.AddScoped<LoaiSanPham_DAL>();
builder.Services.AddScoped<LoaiSanPham_BLL>();

builder.Services.AddScoped<SanPham_DAL>();
builder.Services.AddScoped<SanPham_BLL>();

builder.Services.AddScoped<TaiKhoan_DAL>();
builder.Services.AddScoped<TaiKhoan_BLL>();

builder.Services.AddScoped<PhanQuyen_DAL>();
builder.Services.AddScoped<PhanQuyen_BLL>();

builder.Services.AddScoped<NhanVien_DAL>();
builder.Services.AddScoped<NhanVien_BLL>();

builder.Services.AddScoped<KhachHang_DAL>();
builder.Services.AddScoped<KhachHang_BLL>();

builder.Services.AddScoped<DonNhap_DAL>();
builder.Services.AddScoped<DonNhap_BLL>();

builder.Services.AddScoped<ChiTietDonNhap_DAL>();
builder.Services.AddScoped<ChiTietDonNhap_BLL>();

builder.Services.AddScoped<NhaCungCap_DAL>();
builder.Services.AddScoped<NhaCungCap_BLL>();

builder.Services.AddScoped<DonXuat_DAL>();
builder.Services.AddScoped<DonXuat_BLL>();

builder.Services.AddScoped<ThongBao_DAL>();
builder.Services.AddScoped<ThongBao_BLL>();

builder.Services.AddScoped<ChiTietDonXuat_DAL>();
builder.Services.AddScoped<ChiTietDonXuat_BLL>();

builder.Services.AddScoped<MaGiamGia_DAL>();
builder.Services.AddScoped<MaGiamGia_BLL>();

// 🔹 CORS (cho frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FE", policy =>
    {
        policy.WithOrigins(
            "http://127.0.0.1:5500", 
            "http://localhost:5500",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var connStr = config.GetConnectionString("DefaultConnection");

    if (!string.IsNullOrWhiteSpace(connStr))
    {
        using var conn = new SqlConnection(connStr);
        conn.Open();

        var checkRoleCmd = new SqlCommand("SELECT COUNT(*) FROM PhanQuyen WHERE MaQuyen = 3", conn);
        var hasCustomerRole = (int)checkRoleCmd.ExecuteScalar() > 0;

        if (!hasCustomerRole)
        {
            var insertRoleCmd = new SqlCommand("INSERT INTO PhanQuyen (TenQuyen, MoTa) VALUES (N'Khách hàng', N'Tài khoản mua hàng')", conn);
            insertRoleCmd.ExecuteNonQuery();
        }

        var createThongBaoTableSql = @"
IF OBJECT_ID(N'dbo.ThongBao', N'U') IS NULL
BEGIN
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
    );
END";
        var createThongBaoCmd = new SqlCommand(createThongBaoTableSql, conn);
        createThongBaoCmd.ExecuteNonQuery();
    }
}

// 🔹 Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}


app.UseCors("FE");

app.UseAuthorization();

app.MapControllers();

app.Run();