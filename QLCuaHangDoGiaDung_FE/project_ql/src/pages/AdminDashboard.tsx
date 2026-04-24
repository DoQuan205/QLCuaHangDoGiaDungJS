import { useState, useEffect } from 'react';
import { productsAPI, ordersAPI, customersAPI } from '../services/api';
import StatCard from '../components/StatCard';
import ProductManagement from '../components/ProductManagement';
import OrderManagement from '../components/OrderManagement';
import CustomerManagement from '../components/CustomerManagement';
import SupplierManagement from '../components/SupplierManagement';
import type { Product, Order } from '../types';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
}

function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    customers: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

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
      setRecentOrders(sortedOrders.slice(0, 10));
      setTopProducts(products.slice(0, 5));

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
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <i className="fas fa-shopping-bag"></i>
          <div>
            <h2>GiaDung Mall</h2>
            <p>Seller Centre</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            <i className="fas fa-box"></i>
            <span>Sản phẩm</span>
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Đơn hàng</span>
          </button>
          <button 
            className={activeTab === 'customers' ? 'active' : ''}
            onClick={() => setActiveTab('customers')}
          >
            <i className="fas fa-users"></i>
            <span>Khách hàng</span>
          </button>
          <button 
            className={activeTab === 'suppliers' ? 'active' : ''}
            onClick={() => setActiveTab('suppliers')}
          >
            <i className="fas fa-truck"></i>
            <span>Nhà cung cấp</span>
          </button>
        </nav>

        <button className="btn-logout" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div>
            <span className="admin-kicker">Kênh quản trị</span>
            <h1>Trung tâm quản lý GiaDung Mall</h1>
          </div>
          <div className="admin-user">
            <div className="admin-avatar"><i className="fas fa-user-shield"></i></div>
            <div>
              <span>Admin</span>
              <p>Quản trị viên</p>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
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

            <div className="dashboard-grid">
              <section className="card">
                <div className="card-header">
                  <h2>Đơn hàng gần đây</h2>
                  <button className="btn-view-all" onClick={() => setActiveTab('orders')}>Xem tất cả</button>
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
                      {recentOrders.map((order) => (
                        <tr key={order.maDonXuat}>
                          <td>#DX{String(order.maDonXuat).padStart(3, '0')}</td>
                          <td>KH{order.maKhachHang || 'N/A'}</td>
                          <td>{formatDate(order.ngayXuat)}</td>
                          <td>{formatCurrency(order.tongTien)}</td>
                          <td>
                            <span className={order.trangThai === 'Đã giao' ? 'badge badge-success' : 'badge badge-warning'}>
                              {order.trangThai}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="card">
                <div className="card-header">
                  <h2>Sản phẩm bán chạy</h2>
                  <button className="btn-view-all" onClick={() => setActiveTab('products')}>Xem tất cả</button>
                </div>
                <div className="products-list">
                  {topProducts.map((product) => (
                    <div key={product.maSanPham} className="product-item">
                      <div className="product-info">
                        <div className="product-icon">
                          <i className="fas fa-box"></i>
                        </div>
                        <div>
                          <h4>{product.tenSanPham}</h4>
                          <p>Còn lại: {product.soLuong} sản phẩm</p>
                        </div>
                      </div>
                      <span className="product-price">{formatCurrency(product.giaBan)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductManagement />
        )}

        {activeTab === 'orders' && (
          <OrderManagement />
        )}

        {activeTab === 'customers' && (
          <CustomerManagement />
        )}

        {activeTab === 'suppliers' && (
          <SupplierManagement />
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
