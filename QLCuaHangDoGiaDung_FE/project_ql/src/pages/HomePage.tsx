import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import type { Product } from '../types';
import './HomePage.css';

interface CartItem extends Product {
  quantity: number;
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
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

  const filteredProducts = products.filter(product =>
    product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <button className="account-button">
                <i className="fas fa-user"></i>
                <span>Tài khoản</span>
              </button>
              <button className="cart-button" onClick={() => setShowCart(!showCart)}>
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
              <button className="btn-checkout">
                <i className="fas fa-credit-card"></i>
                Thanh toán
              </button>
            </div>
          )}
        </div>
      )}

      {showCart && <div className="cart-overlay" onClick={() => setShowCart(false)}></div>}
    </div>
  );
}

export default HomePage;
