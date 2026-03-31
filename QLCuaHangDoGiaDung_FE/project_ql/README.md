# Hệ thống Quản lý Cửa hàng Đồ Gia Dụng

Ứng dụng React + TypeScript + Vite để quản lý cửa hàng đồ gia dụng.

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cài thêm axios và react-router-dom

```bash
npm install axios react-router-dom
npm install --save-dev @types/react-router-dom
```

### 3. Cấu hình API

Mở file `src/services/api.ts` và cập nhật URL API nếu cần:

```typescript
const API_BASE_URL = 'http://localhost:5500/api';
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

## Tính năng

- 📊 Dashboard với thống kê tổng quan
- 📦 Hiển thị danh sách sản phẩm
- 🛒 Quản lý đơn hàng
- 👥 Thống kê khách hàng
- 💰 Báo cáo doanh thu
- 🎨 Giao diện đẹp, hiện đại
- 📱 Responsive design

## Công nghệ

- React 19
- TypeScript
- Vite
- Axios
- CSS3
- Font Awesome Icons

## Lưu ý

- Đảm bảo API backend đang chạy trước khi start frontend
- Kiểm tra CORS settings trong API nếu gặp lỗi kết nối
- Port mặc định: 5173 (có thể thay đổi trong vite.config.ts)
