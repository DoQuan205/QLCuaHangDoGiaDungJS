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

type SortOption = 'popular' | 'newest' | 'bestSelling' | 'priceAsc' | 'priceDesc';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('popular');

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

  const getCategoryName = (categoryId: number) => {
    return categories.find(category => category.maLoai === categoryId)?.tenLoai ?? 'Chưa phân loại';
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setShowCart(false);
    setShowOrders(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const getOriginalPrice = (price: number) => Math.round(price * 1.25);

  const getSoldCount = (productId: number) => 15 + (productId * 7) % 86;

  const getSortButtonClass = (option: SortOption) => {
    return sortOption === option ? 'active' : '';
  };

  const getPriceSelectValue = () => {
    return sortOption === 'priceAsc' || sortOption === 'priceDesc' ? sortOption : '';
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

  const sortedProducts = [...filteredProducts].sort((firstProduct, secondProduct) => {
    switch (sortOption) {
      case 'newest':
        return secondProduct.maSanPham - firstProduct.maSanPham;
      case 'bestSelling':
        return getSoldCount(secondProduct.maSanPham) - getSoldCount(firstProduct.maSanPham);
      case 'priceAsc':
        return firstProduct.giaBan - secondProduct.giaBan;
      case 'priceDesc':
        return secondProduct.giaBan - firstProduct.giaBan;
      case 'popular':
      default:
        return firstProduct.maSanPham - secondProduct.maSanPham;
    }
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
        <div className="shop-topbar">
          <div className="container topbar-content">
            <div className="topbar-spacer"></div>
            <button onClick={loadCustomerOrders}><i className="fas fa-bell"></i> Thông Báo</button>
            <button><i className="fas fa-question-circle"></i> Hỗ Trợ</button>
            <button onClick={() => setShowAuth(true)}>Đăng Ký</button>
            <button onClick={() => setShowAuth(true)}>Đăng Nhập</button>
          </div>
        </div>

        <div className="container">
          <div className="header-content">
            <button className="logo" onClick={closeProductDetail}>
              <i className="fas fa-shopping-bag"></i>
              <span>GiaDung Mall</span>
            </button>
            <div className="search-area">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="ShopMall bao ship 0Đ - tìm đồ gia dụng ngay!"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-submit"><i className="fas fa-search"></i></button>
              </div>
            </div>
            <button className="cart-button" onClick={() => {
              setShowCart(!showCart);
              setShowOrders(false);
            }}>
              <i className="fas fa-shopping-cart"></i>
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="shop-content">
        <div className="container">
          {!selectedProduct && (
            <>
              <section className="hero-section">
                <div>
                  <span className="hero-kicker">Flash Sale Đồ Gia Dụng</span>
                  <h1>Siêu sale đồ gia dụng chính hãng</h1>
                  <p>Ưu đãi mỗi ngày - Freeship - Thanh toán an toàn</p>
                </div>
              </section>
            </>
          )}

          {selectedProduct ? (
            <section className="product-detail-section">
              <div className="breadcrumb">
                <button onClick={closeProductDetail}>Shopee</button>
                <span>&gt;</span>
                <button onClick={closeProductDetail}>Thiết Bị Điện Gia Dụng</button>
                <span>&gt;</span>
                <span>{getCategoryName(selectedProduct.maLoai)}</span>
                <span>&gt;</span>
                <strong>{selectedProduct.tenSanPham}</strong>
              </div>

              <div className="product-detail-card">
                <div className="product-media">
                  <div className="product-detail-image">
                    {selectedProduct.hinhAnh ? (
                      <img src={selectedProduct.hinhAnh} alt={selectedProduct.tenSanPham} />
                    ) : (
                      <i className="fas fa-box-open"></i>
                    )}
                  </div>
                  <div className="product-thumbs">
                    {[0, 1, 2, 3].map((item) => (
                      <button key={item} className={item === 0 ? 'active' : ''}>
                        {selectedProduct.hinhAnh ? <img src={selectedProduct.hinhAnh} alt="thumbnail" /> : <i className="fas fa-box-open"></i>}
                      </button>
                    ))}
                  </div>
                  <div className="product-share">Chia sẻ: <i className="fab fa-facebook"></i><i className="fab fa-facebook-messenger"></i><i className="fab fa-pinterest"></i></div>
                </div>

                <div className="product-detail-content">
                  <h2>{selectedProduct.tenSanPham}</h2>
                  <div className="rating-row">
                    <span className="rating-score">4.9</span>
                    <span className="stars">★★★★★</span>
                    <span className="rating-divider"></span>
                    <span>63 Đánh Giá</span>
                    <span className="rating-divider"></span>
                    <span>{getSoldCount(selectedProduct.maSanPham)} Đã Bán</span>
                  </div>

                  <div className="sale-price-box">
                    <div className="flash-sale"><i className="fas fa-bolt"></i> FLASH SALE <span>KẾT THÚC TRONG 00 : 55 : 10</span></div>
                    <div className="price-line">
                      <span className="product-detail-price">{formatCurrency(selectedProduct.giaBan)}</span>
                      <span className="original-price">{formatCurrency(getOriginalPrice(selectedProduct.giaBan))}</span>
                      <span className="discount-badge">-20%</span>
                    </div>
                  </div>

                  <div className="detail-option-row"><span>Vận Chuyển</span><strong><i className="fas fa-truck"></i> Miễn phí vận chuyển</strong></div>
                  <div className="detail-option-row"><span>An Tâm Mua Sắm</span><strong><i className="fas fa-shield-alt"></i> Trả hàng miễn phí 15 ngày</strong></div>
                  <div className="detail-option-row"><span>Loại</span><div className="variant-list"><button>{getCategoryName(selectedProduct.maLoai)}</button><button>Chính hãng</button><button>Bảo hành</button></div></div>
                  <div className="detail-option-row"><span>Số Lượng</span><div className="quantity-preview"><button>-</button><span>1</span><button>+</button><em>{selectedProduct.soLuong} sản phẩm có sẵn</em></div></div>

                  <div className="detail-actions">
                    <button
                      className="btn-detail-add-cart"
                      onClick={() => addToCart(selectedProduct)}
                      disabled={selectedProduct.soLuong === 0}
                    >
                      <i className="fas fa-cart-plus"></i>
                      Thêm Vào Giỏ Hàng
                    </button>
                    <button
                      className="btn-buy-now"
                      onClick={() => addToCart(selectedProduct)}
                      disabled={selectedProduct.soLuong === 0}
                    >
                      Mua Ngay
                    </button>
                  </div>
                </div>
              </div>

              <div className="shop-info-card">
                <div className="shop-avatar"><i className="fas fa-store"></i></div>
                <div><strong>GIADUNG SHOPS V1</strong><p>Online 5 Giờ Trước</p></div>
                <button>Chat Ngay</button>
                <button>Xem Shop</button>
                <div className="shop-stats"><span>Đánh Giá <strong>1.8k</strong></span><span>Sản Phẩm <strong>{products.length}</strong></span><span>Tỉ Lệ Phản Hồi <strong>100%</strong></span></div>
              </div>

              <div className="product-spec-card">
                <h3>CHI TIẾT SẢN PHẨM</h3>
                <div className="spec-row"><span>Danh Mục</span><p>Shopee &gt; Thiết Bị Điện Gia Dụng &gt; {getCategoryName(selectedProduct.maLoai)}</p></div>
                <div className="spec-row"><span>Thương hiệu</span><p>GiaDung Mall</p></div>
                <div className="spec-row"><span>Kho hàng</span><p>{selectedProduct.soLuong}</p></div>
                <div className="spec-row"><span>Xuất xứ</span><p>Việt Nam</p></div>
                <div className="spec-row"><span>Bảo hành</span><p>12 tháng</p></div>
                <div className="spec-row"><span>Mô tả</span><p>{selectedProduct.moTa || 'Sản phẩm hiện chưa có mô tả chi tiết.'}</p></div>
              </div>
            </section>
          ) : (
            <div className="market-layout">
              <aside className="filter-sidebar">
                <h3><i className="fas fa-list"></i> Tất Cả Danh Mục</h3>
                <button
                  className={selectedCategory === null ? 'filter-category active' : 'filter-category'}
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedProduct(null);
                  }}
                >
                  Tất cả sản phẩm
                </button>
                {categories.map((category) => (
                  <button
                    key={category.maLoai}
                    className={selectedCategory === category.maLoai ? 'filter-category active' : 'filter-category'}
                    onClick={() => {
                      setSelectedCategory(category.maLoai);
                      setSelectedProduct(null);
                    }}
                  >
                    {category.tenLoai}
                  </button>
                ))}

                <div className="filter-block">
                  <h4><i className="fas fa-filter"></i> Bộ Lọc Tìm Kiếm</h4>
                  <label><input type="checkbox" /> Hà Nội</label>
                  <label><input type="checkbox" /> TP. Hồ Chí Minh</label>
                  <label><input type="checkbox" /> Hàng mới</label>
                  <label><input type="checkbox" /> Freeship</label>
                </div>

                <div className="filter-block">
                  <h4>Đánh Giá</h4>
                  <p className="filter-stars">★★★★★ trở lên</p>
                  <p className="filter-stars">★★★★☆ trở lên</p>
                </div>
              </aside>

              <section className="products-section">
                <div className="sort-bar">
                  <span>Sắp xếp theo</span>
                  <button
                    className={getSortButtonClass('popular')}
                    onClick={() => setSortOption('popular')}
                  >
                    Phổ biến
                  </button>
                  <button
                    className={getSortButtonClass('newest')}
                    onClick={() => setSortOption('newest')}
                  >
                    Mới nhất
                  </button>
                  <button
                    className={getSortButtonClass('bestSelling')}
                    onClick={() => setSortOption('bestSelling')}
                  >
                    Bán chạy
                  </button>
                  <select
                    value={getPriceSelectValue()}
                    onChange={(event) => setSortOption(event.target.value as SortOption)}
                  >
                    <option value="" disabled>Giá</option>
                    <option value="priceAsc">Giá thấp đến cao</option>
                    <option value="priceDesc">Giá cao đến thấp</option>
                  </select>
                </div>
                <div className="products-grid">
                  {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                      <div key={product.maSanPham} className="product-card">
                        <span className="discount-corner">-20%</span>
                        <button className="product-card-view" onClick={() => openProductDetail(product)}>
                          <div className="product-image">
                            {product.hinhAnh ? (
                              <img src={product.hinhAnh} alt={product.tenSanPham} />
                            ) : (
                              <i className="fas fa-box-open"></i>
                            )}
                          </div>
                          <div className="product-details">
                            <h3>{product.tenSanPham}</h3>
                            <div className="mall-badge">Mall</div>
                          </div>
                        </button>
                        <div className="product-footer">
                          <span className="product-price">
                            {formatCurrency(product.giaBan)}
                          </span>
                          <span className="sold-count">Đã bán {getSoldCount(product.maSanPham)}</span>
                        </div>
                        <button
                          className="btn-add-cart"
                          onClick={() => addToCart(product)}
                          disabled={product.soLuong === 0}
                        >
                          <i className="fas fa-cart-plus"></i>
                          Thêm
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-products">Không tìm thấy sản phẩm nào</p>
                  )}
                </div>
              </section>
            </div>
          )}
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
