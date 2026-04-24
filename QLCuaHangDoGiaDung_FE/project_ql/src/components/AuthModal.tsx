import { useState } from 'react';
import { authAPI } from '../services/api';
import type { User } from '../types';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    fullName: ''
  });

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      phone: '',
      fullName: ''
    });
  };

  const mapRole = (maQuyen?: number): User['role'] => {
    if (maQuyen === 1) return 'admin';
    if (maQuyen === 2) return 'staff';
    return 'customer';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login(formData.username, formData.password);
        const apiUser = response.data;

        const user: User = {
          ...apiUser,
          tenDangNhap: apiUser.tenDangNhap,
          role: mapRole(apiUser.maQuyen),
          fullName: apiUser.tenDangNhap
        };

        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(user);
        onClose();
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Mật khẩu xác nhận không khớp!');
          return;
        }

        await authAPI.register({
          tenDangNhap: formData.username,
          matKhau: formData.password,
          maQuyen: 2,
          trangThai: true
        });

        setSuccess('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.');
        setIsLogin(true);
        setFormData({
          username: formData.username,
          password: '',
          confirmPassword: '',
          email: formData.email,
          phone: formData.phone,
          fullName: formData.fullName
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError('');
    setSuccess('');
    resetForm();
  };

  return (
    <>
      <div className="auth-overlay" onClick={onClose}></div>
      <div className="auth-modal">
        <div className="auth-brand-panel">
          <div className="auth-brand-logo">
            <i className="fas fa-shopping-bag"></i>
            <span>GiaDung Mall</span>
          </div>
          <h3>Mua sắm đồ gia dụng dễ dàng hơn</h3>
          <p>Đăng nhập để theo dõi đơn hàng, nhận ưu đãi và quản lý giỏ hàng của bạn.</p>
          <div className="auth-benefits">
            <span><i className="fas fa-shipping-fast"></i> Freeship</span>
            <span><i className="fas fa-shield-alt"></i> An toàn</span>
            <span><i className="fas fa-tags"></i> Giá tốt</span>
          </div>
        </div>

        <div className="auth-form-panel">
          <button className="auth-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>

          <div className="auth-header">
            <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
            <p>{isLogin ? 'Chào mừng bạn quay trở lại!' : 'Tạo tài khoản mới'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              {success}
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </button>
          </form>

          <div className="auth-switch">
            {isLogin ? (
              <p>
                Chưa có tài khoản?{' '}
                <button type="button" onClick={() => switchMode(false)}>Đăng ký ngay</button>
              </p>
            ) : (
              <p>
                Đã có tài khoản?{' '}
                <button type="button" onClick={() => switchMode(true)}>Đăng nhập</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AuthModal;
