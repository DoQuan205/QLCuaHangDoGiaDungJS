import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI, ordersAPI, orderDetailsAPI, customersAPI } from '../services/api';
import type { Product, Category, User, Order } from '../types';
import AuthModal from '../components/AuthModal';
import './HomePage.css';

interface CartItem extends Product {
  quantity: number;
}

interface HomePageProps {
  onLoginSuccess: (user: User) => void;
}

function HomePage({ onLoginSuccess }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const looksLikeMojibake = (value?: string) => {
    if (!value) return false;
    return ['Ã', 'á»', 'áº', 'Ä', 'Â', 'â', '�'].some((fragment) => value.includes(fragment));
  };

  const fixVietnameseText = (value?: string) => {
    if (!value || !looksLikeMojibake(value)) return value ?? '';

    try {
      const bytes = Uint8Array.from([...value].map((char) => char.charCodeAt(0)));
      return new TextDecoder('utf-8').decode(bytes);
    } catch {
      return value;
    }
  };

  const normalizeProduct = (product: Product): Product => ({
    ...product,
    tenSanPham: fixVietnameseText(product.tenSanPham),
    hinhAnh: fixVietnameseText(product.hinhAnh),
    moTa: fixVietnameseText(product.moTa),
  });

  const normalizeCategory = (category: Category): Category => ({
    ...category,
    tenLoai: fixVietnameseText(category.tenLoai),
    moTa: fixVietnameseText(category.moTa),
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.map(normalizeProduct));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.map(normalizeCategory));
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadCustomerOrders = async () => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      alert('Vui lòng đăng nhập để xem đơn hàng!');
      setShowAuth(true);
      return;
    }

    const user: User = JSON.parse(savedUser);

    try {
      setOrdersLoading(true);
      const customersResponse = await customersAPI.getAll();
      const customers = customersResponse.data;
      const matchedCustomer = customers.find((customer: any) => {
        if (formDataMatch(user.tenDangNhap, customer.email)) return true;
        if (formDataMatch(user.fullName, customer.tenKhachHang)) return true;
        return false;
      });

      if (!matchedCustomer) {
        setCustomerOrders([]);
        setShowCart(false);
        setShowOrders(true);
        return;
      }

      const ordersResponse = await ordersAPI.getByCustomerId(matchedCustomer.maKhachHang);
      setCustomerOrders(ordersResponse.data);
      setShowOrders(true);
      setShowCart(false);
    } catch (error) {
      console.error('Error loading customer orders:', error);
      alert('Không thể tải đơn hàng của bạn!');
    } finally {
      setOrdersLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.maSanPham === product.maSanPham);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.maSanPham === product.maSanPham
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.maSanPham !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.maSanPham === productId ? { ...item, quantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.giaBan * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Giỏ hàng đang trống!');
      return;
    }

    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      alert('Vui lòng đăng nhập trước khi thanh toán!');
      setShowAuth(true);
      return;
    }

    const user: User = JSON.parse(savedUser);

    try {
      setCheckoutLoading(true);

      let customerId: number | undefined;
      const customersResponse = await customersAPI.getAll();
      const customers = customersResponse.data;

      const matchedCustomer = customers.find((customer: any) => {
        if (formDataMatch(user.tenDangNhap, customer.email)) return true;
        if (formDataMatch(user.fullName, customer.tenKhachHang)) return true;
        return false;
      });

      if (matchedCustomer) {
        customerId = matchedCustomer.maKhachHang;
      }

      const orderPayload = {
        ngayXuat: new Date().toISOString(),
        maNhanVien: 1,
        maKhachHang: customerId ?? null,
        tongTien: getTotalPrice(),
        trangThai: 'Đợi' as const
      };

      const createdOrderResponse = await ordersAPI.create(orderPayload);
      const latestOrder = createdOrderResponse.data as Order;

      if (!latestOrder?.maDonXuat) {
        throw new Error('Không tạo được đơn hàng mới');
      }

      await Promise.all(
        cart.map((item) =>
          orderDetailsAPI.create({
            maDonXuat: latestOrder.maDonXuat,
            maSanPham: item.maSanPham,
            soLuong: item.quantity,
            giaBan: item.giaBan
          })
        )
      );

      alert(`Đặt hàng thành công! Mã đơn hàng của bạn là #DX${latestOrder.maDonXuat}. Trạng thái hiện tại: ${latestOrder.trangThai}.`);
      setCart([]);
      setShowCart(false);
      await loadCustomerOrders();
      loadProducts();
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Thanh toán thất bại. Vui lòng thử lại!');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formDataMatch = (left?: string, right?: string) => {
    return Boolean(left && right && left.trim().toLowerCase() === right.trim().toLowerCase());
  };

  const getOrderStatusClass = (trangThai: Order['trangThai']) => {
    return trangThai === 'Đã giao' ? 'order-status delivered' : 'order-status pending';
  };

  const getOrderNotification = (trangThai: Order['trangThai']) => {
    return trangThai === 'Đã giao'
      ? 'Quản lý đã xác nhận và giao đơn hàng này.'
      : 'Đơn hàng đang chờ quản lý xác nhận.';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || product.maLoai === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <header className="shop-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-store"></i>
              <span>Cửa Hàng Đồ Gia Dụng</span>
            </div>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="header-buttons">
              <button className="account-button" onClick={() => setShowAuth(true)}>
                <i className="fas fa-user"></i>
                <span>Tài khoản</span>
              </button>
              <button className="account-button" onClick={loadCustomerOrders}>
                <i className="fas fa-bell"></i>
                <span>Đơn hàng của tôi</span>
              </button>
              <button className="cart-button" onClick={() => {
                setShowCart(!showCart);
                setShowOrders(false);
              }}>
                <i className="fas fa-shopping-cart"></i>
                <span>Giỏ hàng</span>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="shop-content">
        <div className="container">
          <section className="hero-section">
            <h1>Chào mừng đến với Cửa hàng Đồ Gia Dụng</h1>
            <p>Chất lượng cao - Giá cả hợp lý - Giao hàng nhanh chóng</p>
          </section>

          <section className="category-filter">
            <div className="category-buttons">
              <button
                className={selectedCategory === null ? 'category-btn active' : 'category-btn'}
                onClick={() => setSelectedCategory(null)}
              >
                <i className="fas fa-th"></i>
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.maLoai}
                  className={selectedCategory === category.maLoai ? 'category-btn active' : 'category-btn'}
                  onClick={() => setSelectedCategory(category.maLoai)}
                >
                  <i className="fas fa-tag"></i>
                  {category.tenLoai}
                </button>
              ))}
            </div>
          </section>

          <section className="products-section">
            <h2>Sản phẩm của chúng tôi</h2>
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.maSanPham} className="product-card">
                    <div className="product-image">
                      {product.hinhAnh ? (
                        <img src={product.hinhAnh} alt={product.tenSanPham} />
                      ) : (
                        <i className="fas fa-box-open"></i>
                      )}
                    </div>
                    <div className="product-details">
                      <h3>{product.tenSanPham}</h3>
                      <p className="product-stock">
                        Còn lại: {product.soLuong} sản phẩm
                      </p>
                      <div className="product-footer">
                        <span className="product-price">
                          {formatCurrency(product.giaBan)}
                        </span>
                        <button
                          className="btn-add-cart"
                          onClick={() => addToCart(product)}
                          disabled={product.soLuong === 0}
                        >
                          <i className="fas fa-cart-plus"></i>
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-products">Không tìm thấy sản phẩm nào</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {showCart && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h3>Giỏ hàng của bạn</h3>
            <button className="btn-close" onClick={() => setShowCart(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="cart-items">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.maSanPham} className="cart-item">
                  <div className="cart-item-info">
                    <h4>{item.tenSanPham}</h4>
                    <p>{formatCurrency(item.giaBan)}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.maSanPham, item.quantity - 1)}>
                        <i className="fas fa-minus"></i>
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.maSanPham, item.quantity + 1)}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.maSanPham)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-cart">Giỏ hàng trống</p>
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span>Tổng cộng:</span>
                <span className="total-price">{formatCurrency(getTotalPrice())}</span>
              </div>
              <button className="btn-checkout" onClick={handleCheckout} disabled={checkoutLoading}>
                <i className="fas fa-credit-card"></i>
                {checkoutLoading ? 'Đang xử lý...' : 'Thanh toán'}
              </button>
            </div>
          )}
        </div>
      )}

      {showOrders && (
        <div className="cart-sidebar orders-sidebar">
          <div className="cart-header">
            <h3>Đơn hàng của tôi</h3>
            <button className="btn-close" onClick={() => setShowOrders(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="cart-items orders-list">
            {ordersLoading ? (
              <p className="empty-cart">Đang tải đơn hàng...</p>
            ) : customerOrders.length > 0 ? (
              customerOrders.map((order) => (
                <div key={order.maDonXuat} className="order-card">
                  <div className="order-card-header">
                    <h4>#DX{order.maDonXuat}</h4>
                    <span className={getOrderStatusClass(order.trangThai)}>{order.trangThai}</span>
                  </div>
                  <p><strong>Ngày đặt:</strong> {new Date(order.ngayXuat).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Tổng tiền:</strong> {formatCurrency(order.tongTien)}</p>
                  <p className="order-notification">{getOrderNotification(order.trangThai)}</p>
                </div>
              ))
            ) : (
              <p className="empty-cart">Bạn chưa có đơn hàng nào.</p>
            )}
          </div>
        </div>
      )}

      {(showCart || showOrders) && <div className="cart-overlay" onClick={() => {
        setShowCart(false);
        setShowOrders(false);
      }}></div>}
      
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
}

export default HomePage;
