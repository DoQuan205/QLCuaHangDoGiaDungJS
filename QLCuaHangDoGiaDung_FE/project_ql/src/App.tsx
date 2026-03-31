import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import { productsAPI, ordersAPI, customersAPI } from './services/api';
import type { Product, Order } from './types';
import './App.css';

function App() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        productsAPI.getAll(),
        ordersAPI.getAll(),
        customersAPI.getAll()
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;
      const customers = customersRes.data;

      const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.tongTien, 0);

      setStats({
        products: products.length,
        orders: orders.length,
        customers: customers.length,
        revenue: totalRevenue
      });

      const sortedOrders = orders.sort((a: Order, b: Order) => 
        new Date(b.ngayXuat).getTime() - new Date(a.ngayXuat).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 5));
      setTopProducts(products.slice(0, 3));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-home"></i>
              <span>Đồ Gia Dụng</span>
            </div>
            <div className="header-actions">
              <button className="btn-icon">
                <i className="fas fa-bell"></i>
                <span className="badge">3</span>
              </button>
              <div className="user-menu">
                <img src="https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff" alt="User" />
                <span>Admin</span>
                <i className="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="welcome-section">
            <div className="welcome-text">
              <h1>Chào mừng đến với Hệ thống Quản lý</h1>
              <p>Quản lý cửa hàng đồ gia dụng hiệu quả và chuyên nghiệp</p>
            </div>
            <div className="quick-actions">
              <button className="btn btn-primary">
                <i className="fas fa-plus"></i>
                Thêm sản phẩm
              </button>
              <button className="btn btn-secondary">
                <i className="fas fa-file-import"></i>
                Nhập hàng
              </button>
            </div>
          </section>

          <section className="stats-section">
            <div className="stats-grid">
              <StatCard
                icon="fas fa-box"
                title="Sản phẩm"
                value={stats.products}
                change={{ text: '12% so với tháng trước', isPositive: true }}
                type="primary"
              />
              <StatCard
                icon="fas fa-shopping-cart"
                title="Đơn hàng"
                value={stats.orders}
                change={{ text: '8% so với tháng trước', isPositive: true }}
                type="success"
              />
              <StatCard
                icon="fas fa-users"
                title="Khách hàng"
                value={stats.customers}
                change={{ text: '5% so với tháng trước', isPositive: true }}
                type="warning"
              />
              <StatCard
                icon="fas fa-dollar-sign"
                title="Doanh thu"
                value={formatCurrency(stats.revenue)}
                change={{ text: '15% so với tháng trước', isPositive: true }}
                type="danger"
              />
            </div>
          </section>

          <div className="main-grid">
            <section className="card">
              <div className="card-header">
                <h2>Đơn hàng gần đây</h2>
                <a href="#" className="link">Xem tất cả</a>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Ngày</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.maDonXuat}>
                          <td>#DX{String(order.maDonXuat).padStart(3, '0')}</td>
                          <td>Khách hàng {order.maKhachHang || 'N/A'}</td>
                          <td>{formatDate(order.ngayXuat)}</td>
                          <td>{formatCurrency(order.tongTien)}</td>
                          <td>
                            <span className="badge badge-success">Hoàn thành</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center' }}>
                          Chưa có đơn hàng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card">
              <div className="card-header">
                <h2>Sản phẩm nổi bật</h2>
                <a href="#" className="link">Xem tất cả</a>
              </div>
              <div className="products-list">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => {
                    const icons = ['fa-blender', 'fa-utensils', 'fa-fan', 'fa-couch', 'fa-lightbulb'];
                    return (
                      <div key={product.maSanPham} className="product-item">
                        <div className="product-info">
                          <div className="product-icon">
                            <i className={`fas ${icons[index % icons.length]}`}></i>
                          </div>
                          <div>
                            <h4>{product.tenSanPham}</h4>
                            <p>Còn lại: {product.soLuong} sản phẩm</p>
                          </div>
                        </div>
                        <span className="product-price">{formatCurrency(product.giaBan)}</span>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ textAlign: 'center', color: '#6B7280' }}>
                    Chưa có sản phẩm nào
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
