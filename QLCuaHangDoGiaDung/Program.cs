using BLL;
using DAL;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Add services
builder.Services.AddControllers();
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

// 🔹 CORS (cho frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FE", policy =>
    {
        policy.WithOrigins("http://127.0.0.1:5500", "http://localhost:5500")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

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